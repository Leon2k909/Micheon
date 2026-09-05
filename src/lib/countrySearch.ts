import type { CountryId, CountryPack, CountryQuestion, CountryTimelineEvent } from "@/lib/countryStudies";
import { packChapters, packLessonTitle } from "@/lib/countryPacks";

/**
 * Search one country's whole course by person, year, event, place, term or
 * category.
 *
 * Same mechanism as lifeInTheUkSearch, with the country passed in. A plain
 * text search does not do the job: "1989" appears in one question and
 * "Mauerfall" in another, and neither finds the other. So the timeline
 * supplies a controlled vocabulary — every event names the people, places and
 * terms it involves — and everything else inherits a tag by MENTIONING it. A
 * question whose explanation says "Grundgesetz" picks up that tag without
 * anyone hand-labelling the pool.
 *
 * The index is built once per country and cached, because building it walks
 * every question against every vocabulary term and that is not something to
 * repeat on each keystroke.
 */

type CountrySearchKind = "event" | "question" | "lesson" | "category" | "term";

export type CountrySearchHit = {
  id: string;
  kind: CountrySearchKind;
  title: string;
  subtitle: string;
  /** Year for events, so results can be shown chronologically. */
  year?: number;
  displayYear?: string;
  category?: string;
  /** Tags shared with other entries — the chain the learner can follow. */
  tags: string[];
  detail?: string;
  /** Lesson to open, when the hit is or belongs to one. */
  lessonId?: string;
};

type CountrySearchResult = {
  hits: CountrySearchHit[];
  matchedTags: string[];
};

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
}

type Built = {
  vocabulary: string[];
  questionTags: Map<string, string[]>;
  hits: CountrySearchHit[];
};

const CACHE = new Map<CountryId, Built>();

function lessonText(blocks: NonNullable<CountryPack["course"]["lessons"]>[number]["blocks"]): string {
  return blocks
    .map((block) => {
      if (block.type === "p" || block.type === "h3" || block.type === "callout") return block.text;
      if (block.type === "cards") return block.items.map((item) => item.h4 + " " + item.p).join(" ");
      if (block.type === "quiz") return block.q + " " + block.explanation;
      if (block.type === "cta") return block.title + " " + block.sub;
      return "";
    })
    .join(" ");
}

function build(pack: CountryPack): Built {
  // Longest first, so "Zweiter Weltkrieg" is matched before "Weltkrieg".
  const vocabulary = [...new Set(pack.timeline.flatMap((entry) => entry.tags))]
    .sort((a, b) => b.length - a.length);

  const questionTags = new Map<string, string[]>();
  const tagsFor = (question: CountryQuestion): string[] => {
    const cached = questionTags.get(question.id);
    if (cached) return cached;
    const haystack = fold([question.q, question.explanation, ...question.options].join(" "));
    const tags = vocabulary.filter((term) => haystack.includes(fold(term)));
    questionTags.set(question.id, tags);
    return tags;
  };

  const eventHit = (entry: CountryTimelineEvent): CountrySearchHit => ({
    id: pack.id + "-event-" + entry.id,
    kind: "event",
    title: entry.title,
    subtitle: entry.displayYear + " · " + (pack.eraLabels[entry.era] ?? entry.era),
    year: entry.year,
    displayYear: entry.displayYear,
    category: entry.category,
    tags: entry.tags,
    detail: entry.detail,
  });

  const hits: CountrySearchHit[] = pack.timeline.map(eventHit);

  for (const question of pack.questions) {
    hits.push({
      id: pack.id + "-question-" + question.id,
      kind: "question",
      title: question.q,
      subtitle: packLessonTitle(pack, question.lesson),
      lessonId: question.lesson,
      tags: tagsFor(question),
      detail: question.explanation,
    });
  }

  for (const lesson of pack.course.lessons ?? []) {
    // A lesson's searchable text is its own prose, so the page that teaches a
    // thing is findable even where no tag was ever written for it.
    const text = lessonText(lesson.blocks);
    const haystack = fold(text + " " + lesson.title);
    hits.push({
      id: pack.id + "-lesson-" + lesson.id,
      kind: "lesson",
      title: lesson.title,
      subtitle: lesson.section,
      category: lesson.section,
      tags: vocabulary.filter((term) => haystack.includes(fold(term))),
      detail: text.slice(0, 400),
      lessonId: lesson.id,
    });
  }

  for (const chapter of packChapters(pack)) {
    const count = pack.questions.filter((question) => {
      const lesson = (pack.course.lessons ?? []).find((entry) => entry.id === question.lesson);
      return lesson?.section === chapter;
    }).length;
    hits.push({
      id: pack.id + "-category-" + chapter,
      kind: "category",
      title: chapter,
      subtitle: count + " questions",
      category: chapter,
      tags: [],
    });
  }

  return { vocabulary, questionTags, hits };
}

function built(pack: CountryPack): Built {
  const cached = CACHE.get(pack.id);
  if (cached) return cached;
  const value = build(pack);
  CACHE.set(pack.id, value);
  return value;
}

/** Every distinct tag in a country's course, which is what makes term search work. */

function haystackFor(hit: CountrySearchHit): string {
  return fold([hit.title, hit.subtitle, hit.detail ?? "", hit.displayYear ?? "", ...hit.tags].join(" "));
}

export function searchCountry(pack: CountryPack, query: string, limit = 40): CountrySearchResult {
  const needle = fold(query.trim());
  if (needle.length < 2) return { hits: [], matchedTags: [] };
  const terms = needle.split(/\s+/).filter(Boolean);
  const all = built(pack).hits;

  const direct = all.filter((hit) => {
    const hay = haystackFor(hit);
    return terms.every((term) => hay.includes(term));
  });

  // Tags carried by anything directly matched AND named by the query itself.
  // Restricting to tags the query mentions is what stops a search for a common
  // word dragging in half the course through an unrelated tag.
  const matchedTags = new Set<string>();
  for (const hit of direct) {
    for (const tag of hit.tags) {
      const folded = fold(tag);
      if (terms.some((term) => folded.includes(term) || term.includes(folded))) matchedTags.add(tag);
    }
  }

  const seen = new Set(direct.map((hit) => hit.id));
  const related: CountrySearchHit[] = [];
  if (matchedTags.size > 0) {
    for (const hit of all) {
      if (seen.has(hit.id)) continue;
      if (hit.tags.some((tag) => matchedTags.has(tag))) {
        related.push(hit);
        seen.add(hit.id);
      }
    }
  }

  // Events first and in date order, then where to read about it, then the
  // questions that test it — the order a revising learner wants.
  const order: Record<CountrySearchKind, number> = { event: 0, lesson: 1, category: 2, question: 3, term: 4 };
  const ranked = [...direct, ...related].sort((a, b) => {
    if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
    if (a.year != null && b.year != null) return a.year - b.year;
    return a.title.localeCompare(b.title);
  });

  return { hits: ranked.slice(0, limit), matchedTags: [...matchedTags] };
}

/** Suggestions for an empty box — the kinds of thing that work. */
export const COUNTRY_SEARCH_EXAMPLES: Record<CountryId, string[]> = {
  uk: ["1066", "Churchill", "Magna Carta", "Stonehenge", "NHS", "devolution", "Scotland", "suffrage"],
  de: ["1949", "Grundgesetz", "Mauerfall", "Bundesrat", "Weimar", "Föderalismus", "Bismarck", "Euro"],
  fr: ["1789", "laïcité", "Marianne", "Bastille", "Sénat", "outre-mer", "Schœlcher", "Maastricht"],
  pl: ["966", "Solidarność", "3 maja", "rozbiory", "Sejm", "wojewódctwo", "Piłsudski", "1989"],
  it: ["1861", "Costituzione", "2 giugno", "Risorgimento", "Senato", "regioni", "Garibaldi", "1946"],
  es: ["1978", "Constitución", "Cortes Generales", "autonomías", "12 de octubre", "Transición", "al-Ándalus", "euskera"],
};
