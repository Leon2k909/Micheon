import { loadGradeStore, statusForId } from "@/lib/activity";
import { courseSides } from "@/lib/courseLanguages";
import { CURRICULUM_ORDER } from "@/lib/curriculum";
import { formatEnglishText, getEnglishVariant } from "@/lib/englishVariant";
import { frenchFor } from "@/lib/frenchCourse";
import { italianFor } from "@/lib/italianCourse";
import { polishFor } from "@/lib/polishCourse";
import { portugueseFor } from "@/lib/portugueseCourse";
import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";
import { russianFor } from "@/lib/russianCourse";
import { spanishFor } from "@/lib/spanishCourse";
import { buildWordCatalog } from "@/lib/wordSession";
import { buildCatalog } from "@/session";

/**
 * A subject, and the words and phrases you would reach for to talk about it.
 *
 * Every other way into Learn hands the learner one phrase and asks about that
 * phrase. This asks the question the other way round, which is the way a
 * conversation asks it: you are at a table, the talk turns to somebody's
 * family, and what you need is not "what does Geschwister mean" but "what do
 * I have for this". A subject is named, a board of German goes up, and the
 * learner picks out everything they would use for it — with the rest of the
 * board drawn from other subjects, so a pick is a decision and not a tap.
 *
 * Nothing is typed and nothing is graded. It is recognition with the answers
 * on screen, the same line Listen and the Matcher draw, so it can be fast:
 * a board a minute, a subject a minute, the whole course by subject.
 */
type TopicDef = {
  id: string;
  /** The subject as a heading — an existing pack label where one fits. */
  label: string;
  /**
   * The subject as it sits in the question: "talking about {about}".
   *
   * Absent where "talking about" is the wrong verb for it. Most subjects are
   * things you talk ABOUT — your family, the weather, money — and a greeting
   * is not: it is something you SAY, at a moment. Those carry `ask` instead.
   */
  about?: string;
  /**
   * The whole question, for a subject the default sentence misdescribes.
   *
   * "Which of these would you use when talking about meeting people?" was
   * read, reasonably, as asking for hellos — so a board of goodbyes marked
   * five of them missed. The subject was never only hellos; the question was
   * just describing it wrongly.
   */
  ask?: string;
  /** The packs whose material belongs to this subject. */
  packs: readonly string[];
};

/**
 * The subjects, in the order the course reaches them.
 *
 * Grouped by hand rather than read off the pack themes, because a theme is a
 * pack's title and there are 584 of them — "Cooking at home & food culture"
 * and "Food and cafe" are one subject to anybody sitting at a table. Each
 * subject is a handful of packs, and the check holds every pack listed here
 * to being real and every subject to having enough on the board.
 */
export const TOPICS: readonly TopicDef[] = [
  // Named for both ends of the conversation, because the pack is: "Greetings
  // & politeness" is nine hellos, sixteen goodbyes, how-are-you, thank you and
  // sorry. Called "Meeting people" it read as the hello alone, so a board that
  // wanted Tschüss and Bis bald too came back five missed out of six.
  //
  // Not part16: its "regional greetings" carry das Brötchen, lecker and der
  // Feierabend, which are regional words rather than ways of greeting anyone,
  // and every one of them would be marked as belonging here.
  {
    id: "greetings",
    label: "Hello, goodbye & small talk",
    ask: "Which of these would you say when greeting someone, or leaving?",
    packs: ["cb-greetings", "cb-introductions", "cb-smalltalk"],
  },
  // Not part47: half of it is faith — beten, die Konfession, die Kirchensteuer
  // — and the family half is already here as cb-family-problems.
  { id: "family", label: "Family & relationships", about: "your family", packs: ["cb-family", "part7", "part41", "cb-family-problems", "cb-kids-school"] },
  { id: "food", label: "Food & drink", about: "food and drink", packs: ["cb-food", "part5", "cb-grocery", "part49"] },
  // Same again: plans are made, not discussed in the abstract.
  { id: "plans", label: "Making plans", ask: "Which of these would you say when making plans with someone?", packs: ["cb-plans", "part4"] },
  // Not part2 or part12: "Travel and daily tasks" teaches das Fenster, die
  // Rechnung and die Frage as its words, and "Travel and problems" teaches
  // vergessen and die Hilfe — a board would call every one of them getting
  // around. The sentences of both are travel; the words are not.
  { id: "travel", label: "Travel & getting around", about: "getting around", packs: ["cb-travel", "cb-directions", "part6"] },
  { id: "home", label: "Home & daily routine", about: "home and your daily routine", packs: ["part3", "cb-routine", "part9"] },
  { id: "money", label: "Money & shopping", about: "money and shopping", packs: ["cb-money", "cb-money-woes", "cb-shopping"] },
  { id: "health", label: "Health & the doctor", about: "health and the doctor", packs: ["cb-health", "cb-emergencies", "part23"] },
  { id: "work", label: "Work & study", about: "work and study", packs: ["part10", "part24"] },
  { id: "weather", label: "Weather", about: "the weather", packs: ["cb-weather"] },
  // Not part59: "Outdoors: walks, hikes & getting there" is half a train
  // journey — das Gleis, umsteigen, der Schienenersatzverkehr — so the
  // subject is sport and training, which is what the two packs left are.
  { id: "sport", label: "Sport & training", about: "sport and training", packs: ["part36", "part58"] },
  { id: "celebrations", label: "Celebrations & holidays", about: "celebrations and holidays", packs: ["cb-celebrations", "part66"] },
];

/** How many of the board belong to the subject; the same number do not. */
export const TOPIC_ROUND_SIZE = 6;
/** Of those, how many are single words when the subject has them. */
const TOPIC_ROUND_WORDS = 3;

type TopicCard = {
  id: string;
  /** The line in the language being learned. */
  de: string;
  /** What it means, in the language the app explains things in. */
  en: string;
  kind: "word" | "sentence";
  belongs: boolean;
  packKey: string;
};

export type TopicRound = {
  topic: TopicDef;
  cards: TopicCard[];
  /** How many cards belong — what "you found N of M" counts against. */
  wanted: number;
};

type PoolItem = Omit<TopicCard, "belongs"> & { seen: boolean; order: number };

// One explicit call per language, because the course checks read the source
// for exactly that: a file that looks a phrase up in French and not in Polish
// is how Practice once fell through to the German and waited forever.
const translatorFor = (code: string): ((german: string) => string | null) | null => {
  if (code === "fr") return (german) => frenchFor(german);
  if (code === "pl") return (german) => polishFor(german);
  if (code === "es") return (german) => spanishFor(german);
  if (code === "it") return (german) => italianFor(german);
  if (code === "pt") return (german) => portugueseFor(german);
  if (code === "ru") return (german) => russianFor(german);
  return null;
};

const textKey = (text: string) => String(text ?? "").trim().toLowerCase();

/**
 * Everything the course could put on a board, by the pack it came from.
 *
 * Words come from the word catalogue and sentences from the sentence one,
 * both of which already know which pack owns each item — which is the whole
 * question here, since a subject IS a set of packs.
 *
 * The course's own direction is honoured the way the tests honour it: a
 * French course shows the French for each line and drops what has none. The
 * meaning stays English unless the app itself is in German, because English
 * is the one meaning every item in the catalogue carries.
 */
function buildPool(apiParts: Record<string, unknown>, profile: UserProfile | null): Map<string, PoolItem[]> {
  const sides = courseSides();
  const translate = translatorFor(sides.target.code);
  const meaningIsGerman = translate !== null && sides.meaning.code === "de";
  const variant = getEnglishVariant(profile);
  const grades = loadGradeStore(profile);
  const rank = new Map(CURRICULUM_ORDER.map((key, index) => [key, index]));
  const byPack = new Map<string, PoolItem[]>();
  let order = 0;

  const add = (item: {
    id: string; aliases?: string[]; de: string; en: string; kind: "word" | "sentence"; packKey: string;
  }) => {
    const target = translate ? translate(item.de) : item.de;
    if (!target || !target.trim()) return;
    const meaning = meaningIsGerman ? item.de : formatEnglishText(item.en, variant);
    if (!meaning.trim()) return;
    const list = byPack.get(item.packKey) ?? [];
    list.push({
      id: item.id,
      de: target.trim(),
      en: meaning.trim(),
      kind: item.kind,
      packKey: item.packKey,
      seen: statusForId(grades, item.id, item.aliases ?? []) !== "new",
      // Curriculum position first so a subject leads with its earliest pack;
      // catalogue order after that so two items from one pack keep theirs.
      order: (rank.get(item.packKey) ?? CURRICULUM_ORDER.length) * 100_000 + order++,
    });
    byPack.set(item.packKey, list);
  };

  for (const word of buildWordCatalog(apiParts as Record<string, never>)) {
    if (word.listenSafe === false) continue;
    add({ id: word.id, aliases: word.aliases, de: word.de, en: word.en, kind: "word", packKey: word.partKey });
  }
  for (const item of buildCatalog(apiParts)) {
    add({ id: item.id, aliases: item.aliases, de: item.de, en: item.en, kind: "sentence", packKey: item.partKey });
  }
  return byPack;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [out[index], out[swap]] = [out[swap], out[index]];
  }
  return out;
}

/**
 * Some of a pool, seen material first, with a little variety.
 *
 * Seen first because the round is meant to be recall: the words you have
 * met are the ones you should be able to place, and a board full of things
 * the course has not taught yet is a vocabulary test wearing a subject's
 * name. Within that, the pick is shuffled across a window three boards deep
 * rather than always taking the first six, so the same subject asked twice
 * does not put up the same six cards.
 */
function draw(pool: PoolItem[], count: number, wordsWanted: number, random: () => number, taken: Set<string>): PoolItem[] {
  const fresh = pool.filter((item) => !taken.has(textKey(item.de)));
  const ordered = [...fresh].sort((a, b) => Number(b.seen) - Number(a.seen) || a.order - b.order);
  const window = (items: PoolItem[], need: number) => shuffle(items.slice(0, Math.max(need * 3, 12)), random).slice(0, need);
  const words = ordered.filter((item) => item.kind === "word");
  const sentences = ordered.filter((item) => item.kind === "sentence");
  const chosenWords = window(words, Math.min(wordsWanted, words.length, count));
  const chosenSentences = window(sentences, Math.min(count - chosenWords.length, sentences.length));
  const short = count - chosenWords.length - chosenSentences.length;
  const filler = short > 0
    ? shuffle(words.filter((item) => !chosenWords.includes(item)), random).slice(0, short)
    : [];
  const picked = [...chosenWords, ...chosenSentences, ...filler];
  for (const item of picked) taken.add(textKey(item.de));
  return picked;
}

/**
 * One board for one subject: half of it belongs, half of it is from
 * somewhere else entirely.
 *
 * The distractors come from OTHER subjects rather than from anywhere at all,
 * so they are the kind of thing a learner might genuinely reach for — a
 * sentence about the weather beside one about your sister — instead of a
 * word so remote that the board sorts itself. They mirror the subject's mix
 * of words and sentences for the same reason: if every sentence belonged and
 * every word did not, the shape of the card would answer the question.
 *
 * Null when the subject cannot fill its half of the board in this course —
 * a language whose translation table has not reached these packs yet.
 */
export function buildTopicRound(
  apiParts: Record<string, unknown>,
  topicId: string,
  profile: UserProfile | null = null,
  random: () => number = Math.random
): TopicRound | null {
  const topic = TOPICS.find((entry) => entry.id === topicId);
  if (!topic) return null;
  const byPack = buildPool(apiParts, profile);
  const own = new Set(topic.packs);
  const taken = new Set<string>();

  const belongs = draw(
    topic.packs.flatMap((pack) => byPack.get(pack) ?? []),
    TOPIC_ROUND_SIZE,
    TOPIC_ROUND_WORDS,
    random,
    taken
  );
  if (belongs.length < 4) return null;

  const others = TOPICS
    .filter((entry) => entry.id !== topic.id)
    .flatMap((entry) => entry.packs)
    .filter((pack) => !own.has(pack))
    .flatMap((pack) => byPack.get(pack) ?? []);
  const wordsAmongBelongs = belongs.filter((item) => item.kind === "word").length;
  const distractors = draw(others, belongs.length, wordsAmongBelongs, random, taken);

  const cards: TopicCard[] = shuffle(
    [
      ...belongs.map(({ seen: _seen, order: _order, ...card }) => ({ ...card, belongs: true })),
      ...distractors.map(({ seen: _seen, order: _order, ...card }) => ({ ...card, belongs: false })),
    ],
    random
  );
  return { topic, cards, wanted: belongs.length };
}

type TopicRoundResult = {
  found: TopicCard[];
  missed: TopicCard[];
  wrong: TopicCard[];
};

/** What a set of picks got right, left out, and got wrong. */
export function gradeTopicRound(round: TopicRound, picked: ReadonlySet<string>): TopicRoundResult {
  return {
    found: round.cards.filter((card) => card.belongs && picked.has(card.id)),
    missed: round.cards.filter((card) => card.belongs && !picked.has(card.id)),
    wrong: round.cards.filter((card) => !card.belongs && picked.has(card.id)),
  };
}

const CURSOR_KEY = "topic-round-cursor";

/**
 * Which subject comes next, remembered across visits so the round walks the
 * list rather than opening on the same subject every time.
 */
export function currentTopicIndex(profile: UserProfile | null = null): number {
  const raw = loadScopedJson<number>(CURSOR_KEY, 0, profile);
  const index = Number.isFinite(raw) ? Math.floor(Number(raw)) : 0;
  return ((index % TOPICS.length) + TOPICS.length) % TOPICS.length;
}

export function advanceTopicIndex(profile: UserProfile | null = null): number {
  const next = (currentTopicIndex(profile) + 1) % TOPICS.length;
  saveScopedJson(CURSOR_KEY, next, profile);
  return next;
}
