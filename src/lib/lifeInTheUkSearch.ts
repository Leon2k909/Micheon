import {
  UK_QUESTIONS,
  ukChapters,
  ukLessonTitle,
  ukQuestionsForChapter,
  type UkQuestion,
} from "@/lib/ukQuestionBank";
import { UK_TIMELINE, UK_ERA_LABELS, type UkTimelineEvent } from "@/lib/lifeInTheUkTimeline";
import { lifeInTheUkCourse } from "@/lib/lifeInTheUkCourse";

/**
 * Search the whole Life in the UK course by person, year, event, place, term
 * or category.
 *
 * A plain text search does not do what was asked. "1066" appears in one
 * question; "William the Conqueror" appears in a different one; neither finds
 * the other, and the learner who typed a date gets a fragment instead of the
 * story.
 *
 * So the timeline supplies a controlled vocabulary — every event names the
 * people, places and terms it involves — and everything else inherits a tag
 * by MENTIONING it. A question whose explanation says "William the Conqueror"
 * picks up that tag without anyone hand-labelling 248 questions. A hit on any
 * tag then pulls in everything else carrying it, which is how typing a year
 * reaches the event, the lesson that teaches it and the questions that test
 * it.
 */

type UkSearchKind = "event" | "question" | "lesson" | "category" | "term";

type UkSearchHit = {
  id: string;
  kind: UkSearchKind;
  title: string;
  subtitle: string;
  /** Year for events, so results can be shown chronologically. */
  year?: number;
  displayYear?: string;
  /** Syllabus area, as a label. */
  category?: string;
  /** Tags shared with other entries — the chain the learner can follow. */
  tags: string[];
  /** Longer body for events, or the explanation for questions. */
  detail?: string;
  /** Lesson to open, when the hit is or belongs to one. */
  lessonId?: string;
};

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
}

/** The controlled vocabulary: every tag any timeline event declares. */
const VOCABULARY: string[] = [...new Set(UK_TIMELINE.flatMap((entry) => entry.tags))]
  // Longest first, so "William the Conqueror" is matched before "William".
  .sort((a, b) => b.length - a.length);

const QUESTION_TAGS = new Map<string, string[]>();

/**
 * Tags a question earns by mentioning them.
 *
 * Derived rather than authored: 248 questions hand-tagged would be 248
 * chances to forget one, and the tag would then be missing precisely where
 * the learner searched for it.
 */
export function questionTags(question: UkQuestion): string[] {
  const cached = QUESTION_TAGS.get(question.id);
  if (cached) return cached;
  const haystack = fold([question.q, question.explanation, ...question.options].join(" "));
  const tags = VOCABULARY.filter((term) => haystack.includes(fold(term)));
  QUESTION_TAGS.set(question.id, tags);
  return tags;
}

/** Every distinct tag in the course, which is what makes term search work. */

function eventHit(entry: UkTimelineEvent): UkSearchHit {
  return {
    id: "uk-event-" + entry.id,
    kind: "event",
    title: entry.title,
    subtitle: entry.displayYear + " · " + UK_ERA_LABELS[entry.era],
    year: entry.year,
    displayYear: entry.displayYear,
    category: entry.category,
    tags: entry.tags,
    detail: entry.detail,
  };
}

function lessonText(lesson: (typeof lifeInTheUkCourse.lessons extends undefined ? never : NonNullable<typeof lifeInTheUkCourse.lessons>)[number]): string {
  return lesson.blocks
    .map((block) => {
      if (block.type === "p" || block.type === "h3" || block.type === "callout") return block.text;
      if (block.type === "cards") return block.items.map((item) => item.h4 + " " + item.p).join(" ");
      if (block.type === "quiz") return block.q + " " + block.explanation;
      if (block.type === "cta") return block.title + " " + block.sub;
      return "";
    })
    .join(" ");
}

export function ukSearchIndex(): UkSearchHit[] {
  const hits: UkSearchHit[] = UK_TIMELINE.map(eventHit);

  for (const question of UK_QUESTIONS) {
    hits.push({
      id: "uk-question-" + question.id,
      kind: "question",
      title: question.q,
      subtitle: ukLessonTitle(question.lesson),
      lessonId: question.lesson,
      tags: questionTags(question),
      detail: question.explanation,
    });
  }

  for (const lesson of lifeInTheUkCourse.lessons ?? []) {
    // A lesson's searchable text is its own prose, so the page that teaches a
    // thing is findable even where no tag was ever written for it.
    const text = lessonText(lesson);
    const haystack = fold(text + " " + lesson.title);
    hits.push({
      id: "uk-lesson-" + lesson.id,
      kind: "lesson",
      title: lesson.title,
      subtitle: lesson.section,
      category: lesson.section,
      tags: VOCABULARY.filter((term) => haystack.includes(fold(term))),
      detail: text.slice(0, 400),
      lessonId: lesson.id,
    });
  }

  for (const chapter of ukChapters()) {
    hits.push({
      id: "uk-category-" + chapter,
      kind: "category",
      title: chapter,
      subtitle: ukQuestionsForChapter(chapter).length + " questions",
      category: chapter,
      tags: [],
    });
  }

  return hits;
}

const INDEX_CACHE: { value: UkSearchHit[] | null } = { value: null };
function index(): UkSearchHit[] {
  if (!INDEX_CACHE.value) INDEX_CACHE.value = ukSearchIndex();
  return INDEX_CACHE.value;
}

function haystackFor(hit: UkSearchHit): string {
  return fold([hit.title, hit.subtitle, hit.detail ?? "", hit.displayYear ?? "", ...hit.tags].join(" "));
}

type UkSearchResult = {
  hits: UkSearchHit[];
  /** Tags the query matched, so the UI can show the chain it followed. */
  matchedTags: string[];
};

export function searchLifeInTheUk(query: string, limit = 40): UkSearchResult {
  const needle = fold(query.trim());
  if (needle.length < 2) return { hits: [], matchedTags: [] };
  const terms = needle.split(/\s+/).filter(Boolean);
  const all = index();

  const direct = all.filter((hit) => {
    const hay = haystackFor(hit);
    return terms.every((term) => hay.includes(term));
  });

  // Tags carried by anything directly matched AND named by the query itself.
  // Restricting to tags the query mentions is what stops a search for a
  // common word dragging in half the course through an unrelated tag.
  const matchedTags = new Set<string>();
  for (const hit of direct) {
    for (const tag of hit.tags) {
      const folded = fold(tag);
      if (terms.some((term) => folded.includes(term) || term.includes(folded))) matchedTags.add(tag);
    }
  }

  const seen = new Set(direct.map((hit) => hit.id));
  const related: UkSearchHit[] = [];
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
  const order: Record<UkSearchKind, number> = { event: 0, lesson: 1, category: 2, question: 3, term: 4 };
  const ranked = [...direct, ...related].sort((a, b) => {
    if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
    if (a.year != null && b.year != null) return a.year - b.year;
    return a.title.localeCompare(b.title);
  });

  return { hits: ranked.slice(0, limit), matchedTags: [...matchedTags] };
}

/** Suggestions for an empty box — the kinds of thing that work. */
