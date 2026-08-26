import { borrowedWordSegments } from "@/lib/borrowedWords";
import {
  gradeEntryForId,
  loadGradeStore,
  progressEntryForId,
  saveGradeStore,
  setCanonicalGradeRecord,
  statusForId,
  type GradeRecord,
  type GradeStore,
} from "@/lib/activity";
import {
  isDueForReview,
  isSnoozed,
  overdueBy,
  recordPermanent,
  recordReinforcement,
  recordStruggle,
  setStrengthLevel,
  snoozeForDays,
} from "@/lib/memoryStrength";
import { frequencyInfo, synonymCommonality } from "@/lib/wordFrequency";
import { meaningLanguageFor, targetLanguage, type CourseLanguage } from "@/lib/courseLanguages";
import { frenchFor } from "@/lib/frenchCourse";
import { polishFor } from "@/lib/polishCourse";
import { primaryAnswer } from "@/lib/germanTextMatch";
import { buildCatalog } from "@/session";
import { buildWordCatalog, rankWordCatalog, wordDifficultyRung } from "@/lib/wordSession";
import { buildCorpusIndex, sentenceCommonality } from "@/lib/corpusFrequency";
import { conversationPriorityScore } from "@/lib/conversationPriority";
import { cefrRung } from "@/lib/cefr";
import { withoutMutedPacks } from "@/lib/mutedPacks";
import { packMeta } from "@/lib/curriculum";
import {
  getAuthUser,
  loadScopedJson,
  saveScopedJson,
  type UserProfile,
} from "@/lib/profileStorage";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";

/**
 * Listen mode: passive exposure, deliberately NOT a lesson.
 *
 * Both languages are on screen and spoken together so the learner can be
 * doing something else entirely. That changes what a button press means:
 * recognising a sentence you HEAR, with its translation in front of you, is
 * a far weaker signal than producing it from memory in a guided session.
 * So the grades here are damped on purpose:
 *
 *  - "Know it" on a NEW item stamps listen counters only. It must not set a
 *    mastery grade, because a new item marked known would stop being
 *    introduced by Continue Learning — and the learner still needs to meet
 *    its spelling there. The tracker shows the exposure; the queue does not
 *    move.
 *  - "Know it" on a KNOWN item records a reinforcement — the same
 *    "practised again today, review date untouched" stamp optional practice
 *    uses. No rung climbed, no due date pushed.
 *  - "Difficult" on a NEW item marks a real struggle. That is not progress,
 *    it is a flag: guided sessions teach struggle-first, which is exactly
 *    what "I heard this and didn't get it" should cause.
 *  - "Difficult" on a KNOWN item keeps the ladder (one distracted listen
 *    must not undo months of reviews) but adds difficulty debt, the same
 *    signal a wrong answer leaves, so practice resurfaces it sooner.
 */

const GERMAN_REPEATS_KEY = "gl-listen-german-repeats";
const ENGLISH_REPEATS_KEY = "gl-listen-english-repeats";
const LANGUAGE_ORDER_KEY = "gl-listen-language-order";
const NEXT_CARD_DELAY_KEY = "gl-listen-next-card-delay-ms";
const LANGUAGE_GAP_KEY = "gl-listen-language-gap-ms";
const LOOP_ITEMS_KEY = "gl-listen-loop-items";
const LOOP_PASSES_KEY = "gl-listen-loop-passes";
const BACKGROUND_PLAYBACK_KEY = "gl-listen-background-playback-v1";
const PET_BILINGUAL_CAPTIONS_KEY = "gl-listen-pet-bilingual-captions-v1";
const CONTENT_SOURCE_KEY = "gl-listen-content-source";
const MIXED_COUNTS_KEY = "gl-listen-mixed-counts-v1";
const QUEUE_ORDER_KEY = "gl-listen-queue-order";
// v2 deliberately separates cursors by queue order. The original key only
// included course + content source, so changing from adaptive/least-heard to
// Most common first restored the same niche item at its popularity rank
// instead of beginning that ordering at the front.
const CURRENT_ITEM_KEY = "gl-listen-current-item-v2";
const MAX_LANGUAGE_REPEATS = 10;
const MAX_LOOP_ITEMS = 12;
const MAX_LOOP_PASSES = 6;
const MAX_NEXT_CARD_DELAY_MS = 30_000;
const MAX_LANGUAGE_GAP_MS = 30_000;
export const DEFAULT_GERMAN_REPEATS = 2;
export const DEFAULT_ENGLISH_REPEATS = 1;
export const DEFAULT_LISTEN_LOOP_ITEMS = 3;
export type ListenMixedCounts = { words: number; sentences: number };
export const DEFAULT_LISTEN_MIXED_COUNTS: ListenMixedCounts = { words: 1, sentences: 2 };
export function normalizeListenMixedCounts(value: Partial<ListenMixedCounts> | null | undefined): ListenMixedCounts {
  const words = Number.isFinite(value?.words) ? Math.max(1, Math.min(11, Math.round(value?.words as number))) : DEFAULT_LISTEN_MIXED_COUNTS.words;
  const sentences = Number.isFinite(value?.sentences) ? Math.max(1, Math.min(12 - words, Math.round(value?.sentences as number))) : DEFAULT_LISTEN_MIXED_COUNTS.sentences;
  return { words, sentences };
}
export function getListenMixedCounts(direction: LearningDirection = getLearningDirection()): ListenMixedCounts {
  try {
    const raw = window.localStorage.getItem(courseSettingKey(MIXED_COUNTS_KEY, direction));
    return normalizeListenMixedCounts(raw ? JSON.parse(raw) : null);
  } catch { return DEFAULT_LISTEN_MIXED_COUNTS; }
}
export function setListenMixedCounts(counts: Partial<ListenMixedCounts>, direction: LearningDirection = getLearningDirection()): ListenMixedCounts {
  const next = normalizeListenMixedCounts(counts);
  try { window.localStorage.setItem(courseSettingKey(MIXED_COUNTS_KEY, direction), JSON.stringify(next)); } catch { /* storage unavailable */ }
  return next;
}
export const DEFAULT_LISTEN_LOOP_PASSES = 2;
export const DEFAULT_NEXT_CARD_DELAY_MS = 1_100;
export const DEFAULT_LANGUAGE_GAP_MS = 0;
export type ListenContentSource = "sentences" | "words" | "mixed";
export type ListenQueueOrder = "common" | "learning" | "least-heard" | "newest" | "level";
export const LISTEN_QUEUE_ORDERS: ListenQueueOrder[] = ["level", "common", "learning", "least-heard", "newest"];
export const DEFAULT_LISTEN_CONTENT_SOURCE: ListenContentSource = "mixed";
/**
 * A1 first, then A2, then B1 — the order a course is taught in.
 *
 * The default used to be most-common-first, which sounds like the same thing
 * and is not. Frequency and difficulty are different axes: measured against
 * the French course, a B2 item arrived at position 190 with one and a half
 * thousand A1 items still queued behind it. Someone who has just started is
 * being read sentences from four levels above them, in a mode whose whole
 * point is that you are not looking at the screen to notice.
 *
 * Commonality still decides the order WITHIN a level, so nothing about "teach
 * what people actually say" is lost — it is asked second instead of first.
 * Most common first is still in the picker for anyone who wants it back.
 */
export const DEFAULT_LISTEN_QUEUE_ORDER: ListenQueueOrder = "level";
export type ListenLanguageOrder = "english-first" | "german-first";
export const DEFAULT_LISTEN_LANGUAGE_ORDER: ListenLanguageOrder = "english-first";
export const DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS = 1;
export const DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS = 2;
export const DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER: ListenLanguageOrder = "german-first";

function courseSettingKey(key: string, direction: LearningDirection): string {
  return `${key}:${direction}`;
}

function defaultGermanRepeats(direction: LearningDirection): number {
  return direction === "learn-en" ? DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS : DEFAULT_GERMAN_REPEATS;
}

function defaultEnglishRepeats(direction: LearningDirection): number {
  return direction === "learn-en" ? DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS : DEFAULT_ENGLISH_REPEATS;
}

function defaultLanguageOrder(direction: LearningDirection): ListenLanguageOrder {
  return direction === "learn-en" ? DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER : DEFAULT_LISTEN_LANGUAGE_ORDER;
}

function readIntegerSetting(key: string, fallback: number, min: number, max: number): number {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored == null || stored.trim() === "") return fallback;
    const raw = Number(stored);
    if (Number.isFinite(raw) && raw >= min && raw <= max) return Math.round(raw);
  } catch { /* storage blocked: use the documented default */ }
  return fallback;
}

function storeIntegerSetting(key: string, value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, Math.round(value)));
  try { window.localStorage.setItem(key, String(clamped)); } catch { /* keep Listen usable */ }
  return clamped;
}

function readCourseIntegerSetting(
  key: string,
  direction: LearningDirection,
  fallback: number,
  min: number,
  max: number
): number {
  const scopedKey = courseSettingKey(key, direction);
  try {
    if (window.localStorage.getItem(scopedKey) != null) {
      return readIntegerSetting(scopedKey, fallback, min, max);
    }
  } catch { /* storage blocked: use the documented default */ }
  // Repeat settings existed before courses had separate playback plans. Keep
  // that choice for the original German course without applying it backwards
  // to the English course.
  return direction === "learn-de"
    ? readIntegerSetting(key, fallback, min, max)
    : fallback;
}

export function getListenGermanRepeats(direction: LearningDirection = getLearningDirection()): number {
  return readCourseIntegerSetting(
    GERMAN_REPEATS_KEY,
    direction,
    defaultGermanRepeats(direction),
    1,
    MAX_LANGUAGE_REPEATS
  );
}

export function setListenGermanRepeats(
  count: number,
  direction: LearningDirection = getLearningDirection()
): number {
  return storeIntegerSetting(courseSettingKey(GERMAN_REPEATS_KEY, direction), count, 1, MAX_LANGUAGE_REPEATS);
}

export function getListenEnglishRepeats(direction: LearningDirection = getLearningDirection()): number {
  return readCourseIntegerSetting(
    ENGLISH_REPEATS_KEY,
    direction,
    defaultEnglishRepeats(direction),
    1,
    MAX_LANGUAGE_REPEATS
  );
}

export function setListenEnglishRepeats(
  count: number,
  direction: LearningDirection = getLearningDirection()
): number {
  return storeIntegerSetting(courseSettingKey(ENGLISH_REPEATS_KEY, direction), count, 1, MAX_LANGUAGE_REPEATS);
}

export function getListenLanguageOrder(
  direction: LearningDirection = getLearningDirection()
): ListenLanguageOrder {
  try {
    const value = window.localStorage.getItem(courseSettingKey(LANGUAGE_ORDER_KEY, direction));
    if (value === "english-first" || value === "german-first") return value;
    if (direction === "learn-de") {
      const legacyValue = window.localStorage.getItem(LANGUAGE_ORDER_KEY);
      if (legacyValue === "english-first" || legacyValue === "german-first") return legacyValue;
    }
  } catch { /* storage blocked: use the documented default */ }
  return defaultLanguageOrder(direction);
}

export function setListenLanguageOrder(
  order: ListenLanguageOrder,
  direction: LearningDirection = getLearningDirection()
): ListenLanguageOrder {
  const next = order === "german-first" ? "german-first" : "english-first";
  try {
    window.localStorage.setItem(courseSettingKey(LANGUAGE_ORDER_KEY, direction), next);
  } catch { /* keep Listen usable */ }
  return next;
}

export function getListenContentSource(
  direction: LearningDirection = getLearningDirection()
): ListenContentSource {
  try {
    const value = window.localStorage.getItem(courseSettingKey(CONTENT_SOURCE_KEY, direction));
    if (value === "sentences" || value === "words" || value === "mixed") return value;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_CONTENT_SOURCE;
}

export function setListenContentSource(
  source: ListenContentSource,
  direction: LearningDirection = getLearningDirection()
): ListenContentSource {
  const next = source === "sentences" || source === "words" ? source : "mixed";
  try {
    window.localStorage.setItem(courseSettingKey(CONTENT_SOURCE_KEY, direction), next);
  } catch { /* keep Listen usable */ }
  return next;
}

export function getListenQueueOrder(
  direction: LearningDirection = getLearningDirection()
): ListenQueueOrder {
  try {
    const value = window.localStorage.getItem(courseSettingKey(QUEUE_ORDER_KEY, direction));
    if (LISTEN_QUEUE_ORDERS.includes(value as ListenQueueOrder)) return value as ListenQueueOrder;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_QUEUE_ORDER;
}

export function setListenQueueOrder(
  order: ListenQueueOrder,
  direction: LearningDirection = getLearningDirection()
): ListenQueueOrder {
  // Written against the list rather than a chain of comparisons, which is how
  // an order could be added to the picker and silently fall back to the
  // default the moment it was chosen.
  const next = LISTEN_QUEUE_ORDERS.includes(order) ? order : DEFAULT_LISTEN_QUEUE_ORDER;
  try {
    window.localStorage.setItem(courseSettingKey(QUEUE_ORDER_KEY, direction), next);
  } catch { /* keep Listen usable */ }
  return next;
}

export function getListenNextCardDelayMs(): number {
  return readIntegerSetting(NEXT_CARD_DELAY_KEY, DEFAULT_NEXT_CARD_DELAY_MS, 0, MAX_NEXT_CARD_DELAY_MS);
}

export function setListenNextCardDelayMs(delayMs: number): number {
  return storeIntegerSetting(NEXT_CARD_DELAY_KEY, delayMs, 0, MAX_NEXT_CARD_DELAY_MS);
}

/**
 * Silence held where the card changes language.
 *
 * The next-card delay above is a pause AFTER both languages have finished, so
 * it can only ever pace how fast cards arrive. It cannot open the gap that
 * matters for speaking: hear the English, say the German yourself, then hear
 * the German and find out whether you were right. Without a gap that can be
 * set, the answer arrives
 * before there is time to attempt it, and Listen stays a listening exercise.
 *
 * It is held once per card, at the switch — not between repeats of the same
 * language, which are there to be heard back-to-back. Zero by default, so
 * playback is unchanged until somebody asks for a gap.
 */
export function getListenLanguageGapMs(): number {
  return readIntegerSetting(LANGUAGE_GAP_KEY, DEFAULT_LANGUAGE_GAP_MS, 0, MAX_LANGUAGE_GAP_MS);
}

export function setListenLanguageGapMs(gapMs: number): number {
  return storeIntegerSetting(LANGUAGE_GAP_KEY, gapMs, 0, MAX_LANGUAGE_GAP_MS);
}

/** One thing the player says, in order. `side` is which face of the card it is. */
export type ListenSpeechClip = {
  text: string;
  rate: number;
  lang: string;
  side: "de" | "en";
  /** Silence held before this clip. Set on exactly one clip per card. */
  pauseBeforeMs?: number;
};

/**
 * Everything a card says, in order, gap included.
 *
 * Lives here rather than inside the player so the rule that matters can be
 * tested rather than described: the pause belongs at the ONE point where the
 * card changes language. Built inline, the only thing a check could do was
 * match the source text of the component and hope it meant what it looked
 * like.
 */
export function buildListenSpeechPlan({
  de,
  en,
  germanRepeats,
  englishRepeats,
  languageOrder,
  englishLang,
  targetLang = "de-DE",
  languageGapMs,
}: {
  de: string;
  en: string;
  germanRepeats: number;
  englishRepeats: number;
  languageOrder: ListenLanguageOrder;
  englishLang: string;
  /** Voice for the `de` side, which is the language being LEARNED — German
   *  in the original course, French in the French one. Defaults to German so
   *  the two courses that always were German need not say so. */
  targetLang?: string;
  languageGapMs: number;
}): ListenSpeechClip[] {
  const german: ListenSpeechClip[] = Array.from(
    { length: Math.max(0, germanRepeats) },
    () => ({ text: de, rate: 0.92, lang: targetLang, side: "de" as const })
  );
  // A German word quoted inside the English line is read by the German voice.
  // The side stays "en" — it is still the meaning half of the card, and the
  // caption, the gap and the repeat count all belong to the line as a whole.
  const englishOnce: ListenSpeechClip[] = borrowedWordSegments(en, de, englishLang, targetLang)
    .map((segment) => ({ text: segment.text, rate: 0.95, lang: segment.lang, side: "en" as const }));
  const english: ListenSpeechClip[] = Array.from(
    { length: Math.max(0, englishRepeats) },
    () => englishOnce
  ).flat();
  const [first, second] = languageOrder === "english-first"
    ? [english, german]
    : [german, english];
  // Repeats of one language are meant to run together — the pause is the
  // learner's turn to answer, and there is only one place on a card where
  // that is what the silence means.
  if (languageGapMs > 0 && first.length > 0 && second.length > 0) {
    second[0] = { ...second[0], pauseBeforeMs: languageGapMs };
  }
  return [...first, ...second];
}

/**
 * Listen learns in small, repeated sets instead of walking the catalogue once.
 * A 3-item / 2-pass plan produces A, B, C, A, B, C, then D, E, F… .
 * One pass is the explicit exposure-only option for learners who do not want
 * item-level repetition. These settings are course-specific because a learner
 * may want more reinforcement in their newer language.
 */
export function getListenLoopItems(
  direction: LearningDirection = getLearningDirection()
): number {
  return readCourseIntegerSetting(
    LOOP_ITEMS_KEY,
    direction,
    DEFAULT_LISTEN_LOOP_ITEMS,
    1,
    MAX_LOOP_ITEMS
  );
}

export function setListenLoopItems(
  count: number,
  direction: LearningDirection = getLearningDirection()
): number {
  return storeIntegerSetting(
    courseSettingKey(LOOP_ITEMS_KEY, direction),
    count,
    1,
    MAX_LOOP_ITEMS
  );
}

export function getListenLoopPasses(
  direction: LearningDirection = getLearningDirection()
): number {
  return readCourseIntegerSetting(
    LOOP_PASSES_KEY,
    direction,
    DEFAULT_LISTEN_LOOP_PASSES,
    1,
    MAX_LOOP_PASSES
  );
}

export function setListenLoopPasses(
  count: number,
  direction: LearningDirection = getLearningDirection()
): number {
  return storeIntegerSetting(
    courseSettingKey(LOOP_PASSES_KEY, direction),
    count,
    1,
    MAX_LOOP_PASSES
  );
}

function safeLoopInteger(value: number, fallback: number, min: number, max: number): number {
  return Number.isFinite(value)
    ? Math.max(min, Math.min(max, Math.round(value)))
    : fallback;
}

/** Map the unbounded player position onto the catalogue's repeated-set order. */
export function listenQueueIndexForPlayhead(
  playhead: number,
  queueLength: number,
  itemsPerLoop: number,
  loopPasses: number
): number {
  const length = safeLoopInteger(queueLength, 0, 0, Number.MAX_SAFE_INTEGER);
  if (length === 0) return 0;
  const size = Math.min(length, safeLoopInteger(itemsPerLoop, DEFAULT_LISTEN_LOOP_ITEMS, 1, MAX_LOOP_ITEMS));
  const passes = safeLoopInteger(loopPasses, DEFAULT_LISTEN_LOOP_PASSES, 1, MAX_LOOP_PASSES);
  const position = safeLoopInteger(playhead, 0, 0, Number.MAX_SAFE_INTEGER) % (length * passes);
  const completeGroupItems = Math.floor(length / size) * size;
  const completeGroupSteps = completeGroupItems * passes;
  if (position < completeGroupSteps) {
    const groupSteps = size * passes;
    const group = Math.floor(position / groupSteps);
    return (group * size) + ((position % groupSteps) % size);
  }
  const tailSize = length - completeGroupItems;
  return tailSize > 0
    ? completeGroupItems + ((position - completeGroupSteps) % tailSize)
    : 0;
}

/** Restore a catalogue item at the beginning of its current learning set. */
export function listenPlayheadForQueueIndex(
  queueIndex: number,
  queueLength: number,
  itemsPerLoop: number,
  loopPasses: number
): number {
  const length = safeLoopInteger(queueLength, 0, 0, Number.MAX_SAFE_INTEGER);
  if (length === 0) return 0;
  const size = Math.min(length, safeLoopInteger(itemsPerLoop, DEFAULT_LISTEN_LOOP_ITEMS, 1, MAX_LOOP_ITEMS));
  const passes = safeLoopInteger(loopPasses, DEFAULT_LISTEN_LOOP_PASSES, 1, MAX_LOOP_PASSES);
  const index = ((Math.round(queueIndex) % length) + length) % length;
  const group = Math.floor(index / size);
  const offset = index % size;
  return (group * size * passes) + offset;
}

export function listenLoopPassForPlayhead(
  playhead: number,
  queueLength: number,
  itemsPerLoop: number,
  loopPasses: number
): number {
  const length = safeLoopInteger(queueLength, 0, 0, Number.MAX_SAFE_INTEGER);
  if (length === 0) return 1;
  const size = Math.min(length, safeLoopInteger(itemsPerLoop, DEFAULT_LISTEN_LOOP_ITEMS, 1, MAX_LOOP_ITEMS));
  const passes = safeLoopInteger(loopPasses, DEFAULT_LISTEN_LOOP_PASSES, 1, MAX_LOOP_PASSES);
  const position = safeLoopInteger(playhead, 0, 0, Number.MAX_SAFE_INTEGER) % (length * passes);
  const completeGroupItems = Math.floor(length / size) * size;
  const completeGroupSteps = completeGroupItems * passes;
  if (position < completeGroupSteps) {
    return Math.floor((position % (size * passes)) / size) + 1;
  }
  const tailSize = length - completeGroupItems;
  return tailSize > 0
    ? Math.floor((position - completeGroupSteps) / tailSize) + 1
    : 1;
}

/**
 * Keep the hands-free player alive while the learner visits another dashboard
 * section. This is deliberately on by default: Listen is useful precisely
 * because it can accompany another task, but the learner can opt out at the
 * point where playback is configured.
 */
export function getListenBackgroundPlayback(
  profile: UserProfile | null = getAuthUser()
): boolean {
  return loadScopedJson<boolean>(BACKGROUND_PLAYBACK_KEY, true, profile) !== false;
}

export function setListenBackgroundPlayback(
  enabled: boolean,
  profile: UserProfile | null = getAuthUser()
): boolean {
  const next = Boolean(enabled);
  saveScopedJson(BACKGROUND_PLAYBACK_KEY, next, profile);
  return next;
}

/**
 * Show the translation beside the live line in the pet bubble. This is on by
 * default because the pet may be the only visible part of Micheon while
 * Listen accompanies another task; a learner can still choose the lighter
 * single-line caption used by earlier releases.
 */
export function getListenPetBilingualCaptions(
  profile: UserProfile | null = getAuthUser()
): boolean {
  return loadScopedJson<boolean>(PET_BILINGUAL_CAPTIONS_KEY, true, profile) !== false;
}

export function setListenPetBilingualCaptions(
  enabled: boolean,
  profile: UserProfile | null = getAuthUser()
): boolean {
  const next = Boolean(enabled);
  saveScopedJson(PET_BILINGUAL_CAPTIONS_KEY, next, profile);
  return next;
}

function currentItemStorageKey(
  direction: LearningDirection,
  source: ListenContentSource,
  order: ListenQueueOrder
): string {
  // Sentence, word, and mixed queues contain different ids, while each queue
  // order gives those ids a different position. Keep an exact cursor for the
  // full combination so switching filters never drops a learner halfway into
  // an unrelated ordering.
  return `${CURRENT_ITEM_KEY}:${direction}:${source}:${order}`;
}

export function getListenCurrentItemId(
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser(),
  source: ListenContentSource = getListenContentSource(direction),
  order: ListenQueueOrder = getListenQueueOrder(direction)
): string {
  const value = loadScopedJson<unknown>(currentItemStorageKey(direction, source, order), "", profile);
  return typeof value === "string" ? value : "";
}

export function setListenCurrentItemId(
  itemId: string,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser(),
  source: ListenContentSource = getListenContentSource(direction),
  order: ListenQueueOrder = getListenQueueOrder(direction)
): string {
  const next = typeof itemId === "string" ? itemId.slice(0, 240) : "";
  saveScopedJson(currentItemStorageKey(direction, source, order), next, profile);
  return next;
}

export type ListenItem = {
  id: string;
  aliases: string[];
  de: string;
  en: string;
  use?: string;
  /** Which of the word's meanings this card teaches, in two or three words.
   * A heard word carries no context, so a card for a word that means more
   * than one thing says which meaning it is on — see wordSenseTags.ts. */
  senseTag?: string;
  /** Less common same-meaning words folded into this card (see wordSynonymGroups.ts).
   * Shown on the card so the group stays visible; only the common face is spoken.
   * `label` is the word's own frequency tier — absent when the bank does not
   * rank it, so the card never claims "less common" on no evidence. */
  synonyms?: Array<{ de: string; en: string; label?: string }>;
  /**
   * The pack's register warning — "18+ · intimate", "Strong language",
   * "Regional — not used everywhere". Authored in curriculum.ts, shown in
   * lessons, and until now dropped here: 762 of the queue's items came from a
   * pack carrying one and not one of them arrived with it. A learner matching
   * "Ich komm." against "I'm coming." has nothing on the card to tell them
   * which room that sentence belongs in.
   */
  tierNote?: string;
  /**
   * How hard this card is, 1 (A1) to 6 (C1-C2) — see cefrRung.
   *
   * What "easiest first" sorts on, and what the card shows through
   * cefrRungLabel. Read from the item rather than recomputed, so the order
   * can be checked against the thing it actually used.
   */
  rung?: number;
  kind: "sentence" | "word";
  popularity: number;
};

export function arrangeListenMixedQueue(queue: ListenItem[], counts: ListenMixedCounts = DEFAULT_LISTEN_MIXED_COUNTS): ListenItem[] {
  const wanted = normalizeListenMixedCounts(counts);
  const words = queue.filter((item) => item.kind === "word");
  const sentences = queue.filter((item) => item.kind === "sentence");
  const out: ListenItem[] = [];
  let wi = 0; let si = 0;
  while (wi < words.length || si < sentences.length) {
    for (let i = 0; i < wanted.words && wi < words.length; i += 1) out.push(words[wi++]);
    for (let i = 0; i < wanted.sentences && si < sentences.length; i += 1) out.push(sentences[si++]);
  }
  return out;
}

export function formatListenPetCaption(
  item: Pick<ListenItem, "de" | "en">,
  spokenText: string,
  showBothLanguages: boolean
): string {
  if (!showBothLanguages) return spokenText;
  return `${item.de}\n\n${item.en}`;
}

export type ListenQueueOptions = {
  contentSource?: ListenContentSource;
  direction?: LearningDirection;
  order?: ListenQueueOrder;
};

/**
 * The full listening queue. Most-common-first is the default: sentences use
 * the same conversation-usefulness score as the tracker and guided lessons,
 * while words use the shared corpus-frequency rank. Learners can instead use
 * adaptive learning priority or rotate through their least-heard material.
 * Snoozed items stay out in every order, exactly as they do in lessons.
 */
export function buildListenQueue(
  apiParts: Record<string, any>,
  grades: GradeStore,
  options: ListenQueueOptions = {},
  now = Date.now()
): ListenItem[] {
  const parts = withoutMutedPacks(apiParts);
  const direction = options.direction ?? getLearningDirection();
  const content = options.contentSource ?? getListenContentSource(direction);
  const order = options.order ?? getListenQueueOrder(direction);
  const corpusIndex = buildCorpusIndex(parts);

  // Pack position doubles as "how recently was this added": curriculum order
  // lists the curated course first and appends everything newer after it, and
  // packs are append-only once shipped. Tatoeba is the one exception — a static
  // bulk practice tier whose keys sort after every partN key without being new
  // — so it is pinned behind the authored packs instead of owning "Newest".
  const packKeys = Object.keys(parts);
  const packRank = new Map<string, number>();
  packKeys.forEach((key, index) => {
    packRank.set(key, key.startsWith("tatoeba") ? index - packKeys.length : index);
  });
  const itemPackRank = new Map<string, number>();
  const rememberPack = (id: string, partKey: unknown) => {
    const rank = packRank.get(String(partKey ?? ""));
    if (rank != null && !itemPackRank.has(id)) itemPackRank.set(id, rank);
  };
  // How hard a card is, as a rung from 1 (A1) to 6 (C1-C2).
  //
  // For a SENTENCE that is its pack's CEFR level, because a sentence is only
  // as easy as the lesson it belongs to. For a WORD it is not: haben, sein,
  // machen and bitte are taught inside A2 packs, since the lesson around them
  // is A2, and the words themselves are among the first fifty in the
  // language. Ordering words by the pack label put haben at 1,045 and bitte
  // at 3,372 of a queue that had just promised to start with the easiest
  // thing it had — so a word is asked for its own rung instead.
  //
  // Carried ON the item rather than looked up beside it: a sentence can
  // appear in more than one pack, and the catalogue has already decided which
  // one this card came from. A map rebuilt afterwards answers for whichever
  // pack was walked last, which is a different card's level.
  const partRung = (partKey: unknown) => cefrRung(parts[String(partKey ?? "")]?.level);

  // primaryAnswer on both sides: answer keys list alternatives behind " / "
  // for the matcher's benefit, but a listening card shows (and the voice
  // speaks) one clean form, not the whole key.
  const rankedSentences = content === "words" ? [] : buildCatalog(parts)
    .map((item, index) => ({
      item,
      index,
      popularity: conversationPriorityScore({
        partKey: item.partKey,
        kind: item.kind,
        commonality: sentenceCommonality(item.de, corpusIndex),
        lessonPriority: item.lessonPriority,
      }),
    }))
    .sort((a, b) => a.popularity - b.popularity || a.index - b.index);
  rankedSentences.forEach(({ item }) => rememberPack(item.id, item.partKey));
  const sentences: ListenItem[] = rankedSentences
    .map(({ item }, index, ranked) => ({
      id: item.id,
      aliases: item.aliases ?? [],
      de: primaryAnswer(item.de),
      en: primaryAnswer(item.en),
      tierNote: item.tierNote,
      rung: partRung(item.partKey),
      kind: "sentence" as const,
      // A percentile makes sentence and word popularity comparable in the
      // mixed queue even though their underlying scorers use different
      // scales. The authored conversation score still decides the sentence
      // rank before it is normalised.
      popularity: index / Math.max(1, ranked.length - 1),
    }));

  // A lemma claimed with incompatible meanings by several contextual packs
  // must not be read passively until its standalone card has been reviewed.
  // The contextual lesson remains available; only the arbitrary global card
  // is withheld. This is intentionally accuracy-first: silence teaches less
  // than a confidently spoken mistranslation, but it does not teach it wrong.
  const rankedWords = content === "sentences"
    ? []
    : rankWordCatalog(buildWordCatalog(parts).filter((word) => word.listenSafe !== false), corpusIndex);
  rankedWords.forEach((word) => rememberPack(word.id, word.partKey));
  const words: ListenItem[] = rankedWords
    .map((word, index, ranked) => ({
      id: word.id,
      // Catalog dedup preserves old progress ids as aliases. Dropping them
      // here made Listen blind to grades stored under a pre-merge id — a
      // word marked "never review" in the tracker kept playing.
      aliases: word.aliases ?? [],
      de: primaryAnswer(word.de),
      en: primaryAnswer(word.en),
      use: word.use,
      senseTag: word.senseTag,
      tierNote: packMeta(word.partKey).note,
      rung: wordDifficultyRung(word),
      // The combined card is one queue slot: the common face is what the
      // voice says, and the folded synonyms stay visible on the card.
      // Compared with the face of the card rather than rated alone — the
      // face is always the commoner word, so a bare tier told the reader
      // nothing they could act on.
      synonyms: word.synonyms?.map((syn) => ({
        de: syn.de,
        en: primaryAnswer(syn.en),
        label: synonymCommonality(word.lookup || word.de, syn.lookup || syn.de)?.label,
      })),
      kind: "word" as const,
      popularity: index / Math.max(1, ranked.length - 1),
    }));

  // "Both": merge comparable popularity percentiles. Since the sentence
  // tracker is much larger, this naturally keeps the product's phrase-first
  // cadence while still letting the most common word outrank a much less
  // common sentence. Sentence wins an exact tie.
  let combined: ListenItem[];
  if (sentences.length && words.length) {
    combined = [...sentences, ...words].sort((a, b) =>
      a.popularity - b.popularity
      || (a.kind === b.kind ? 0 : a.kind === "sentence" ? -1 : 1)
    );
  } else {
    combined = sentences.length ? sentences : words;
  }

  // Which language is in each of Listen's two slots, filled here rather than
  // in the player — because for French the text is not on the card at all. It
  // lives in a table keyed by the German, so the slot has to be filled while
  // the German is still what the item carries.
  //
  // The meaning slot is whatever the app itself is written in. It used to be
  // English by construction, which was the same thing while the app only ever
  // spoke the two languages the catalogue holds, and stopped being the same
  // thing when French became something the app could be set to: a learner
  // reading a French app was still being told what her German meant in
  // English. Which of the two slots holds the meaning differs by course — the
  // English course keeps German in the first one — so this asks rather than
  // assuming it is the second.
  //
  // An item the table cannot reach leaves the queue, exactly as it does in
  // the French course. A card that quietly falls back to another language is
  // one the settings beside it are lying about: the voice, the mute switch
  // and the repeat count all name a language that card is not in.
  const target = targetLanguage(direction);
  const meaning = meaningLanguageFor(target);
  const slots = direction === "learn-en"
    ? { de: meaning, en: target }
    : { de: target, en: meaning };
  if (slots.de !== "de" || slots.en !== "en") {
    const textFor = (item: ListenItem, language: CourseLanguage): string | null => {
      if (language === "de") return item.de;
      if (language === "en") return item.en;
      if (language === "pl") return polishFor(item.de);
      return frenchFor(item.de);
    };
    combined = combined.flatMap((item) => {
      const de = textFor(item, slots.de);
      const en = textFor(item, slots.en);
      if (!de || !en) return [];
      return [{
        ...item,
        de,
        en,
        // A synonym group is a group of GERMAN words for one meaning. There
        // is no French or Polish equivalent of it on the card, so it goes when
        // the German does.
        synonyms: slots.de === "de" ? item.synonyms : undefined,
      }];
    });
  }

  const recordFor = (item: ListenItem) =>
    progressEntryForId(grades, item.id, item.aliases)?.record;

  const listenStamp = (item: ListenItem) => {
    const record = recordFor(item);
    const stamps = [record?.listenedAt, record?.reinforcedAt, record?.updatedAt]
      .map((value) => (value ? Date.parse(value) : 0))
      .filter((value) => Number.isFinite(value));
    return stamps.length ? Math.max(...stamps) : 0;
  };

  const bucketOf = (item: ListenItem): number => {
    const record = recordFor(item);
    if (isSnoozed(record, now)) return -1;
    // An explicit review level is a scheduling decision for every learning
    // surface, including passive Listen. Keep a known item out until its
    // scheduled review date, while retaining the old behaviour for legacy
    // records that have no review timestamp at all.
    if (record?.permanent) return -1;
    const status = statusForId(grades, item.id, item.aliases);
    if (status === "known") {
      const scheduledAt = Date.parse(record?.dueAt ?? "");
      if (Number.isFinite(scheduledAt) && now < scheduledAt) return -1;
      if (isDueForReview(record, now)) return 0;
    }
    if (status === "struggle") return 1;
    if (status === "new") return 2;
    return 3;
  };

  const available = combined
    .map((item, index) => ({ item, index, bucket: bucketOf(item) }))
    .filter((entry) => entry.bucket >= 0);

  if (order === "common") return available.map((entry) => entry.item);

  // Easiest first. `available` is already in commonality order, so falling
  // back to its index is what keeps "the most useful A1 card" ahead of the
  // rest of A1 — the level is asked first and frequency second, rather than
  // one replacing the other. A pack with no level sorts last (cefrOrder gives
  // it 99): it applies everywhere, so there is no rung to put it on, and
  // guessing one would push unlevelled material in front of A1.
  if (order === "level") {
    return available
      .sort((a, b) =>
        (a.item.rung ?? 3) - (b.item.rung ?? 3)
        || a.index - b.index
      )
      .map((entry) => entry.item);
  }

  // Newest first exists because "Most common first" structurally cannot reach
  // new content: a freshly added word is by definition one the frequency bank
  // has never ranked, so it sorts to the very back of a queue thousands of
  // items long and is never actually heard. This order plays the most recent
  // packs first, most useful item within a pack first.
  if (order === "newest") {
    return available
      .sort((a, b) =>
        (itemPackRank.get(b.item.id) ?? -1) - (itemPackRank.get(a.item.id) ?? -1)
        || a.index - b.index
      )
      .map((entry) => entry.item);
  }

  if (order === "least-heard") {
    return available
      .sort((a, b) =>
        (Number(recordFor(a.item)?.listens) || 0) - (Number(recordFor(b.item)?.listens) || 0)
        || listenStamp(a.item) - listenStamp(b.item)
        || a.index - b.index
      )
      .map((entry) => entry.item);
  }

  return available
    .sort((a, b) =>
      a.bucket - b.bucket
      || (a.bucket === 0
        ? overdueBy(recordFor(b.item), now) - overdueBy(recordFor(a.item), now)
        : a.bucket === 3
          ? listenStamp(a.item) - listenStamp(b.item)
          : a.index - b.index)
    )
    .map((entry) => entry.item);
}

export type ListenGrade = "know" | "difficult";
export type ListenReviewLevel = "new" | "struggle" | "permanent" | 1 | 2 | 3 | 4 | 5;
export type ListenReviewChange = {
  entries: Array<{ key: string; record: GradeRecord | null }>;
};

function snapshotListenReviewChange(
  store: GradeStore,
  item: Pick<ListenItem, "id" | "aliases">
): ListenReviewChange {
  const keys = Array.from(new Set([item.id, ...item.aliases]));
  return {
    entries: keys.map((key) => ({
      key,
      record: store[key] ? { ...store[key] } : null,
    })),
  };
}

/**
 * Record a listen-mode grade. See the module comment for why every branch
 * is deliberately weaker than its guided-session counterpart.
 *
 * Returns what the record looked like BEFORE the grade, so the screen can
 * offer Undo. Marking something a struggle while half-listening in the
 * kitchen is exactly the kind of press that gets made by accident, and until
 * this returned a snapshot there was no way back from it.
 */
export function recordListenGrade(
  item: Pick<ListenItem, "id" | "aliases">,
  grade: ListenGrade,
  profile: UserProfile | null = getAuthUser(),
  now = Date.now()
): ListenReviewChange {
  const store = loadGradeStore(profile);
  const undo = snapshotListenReviewChange(store, item);
  const status = statusForId(store, item.id, item.aliases);
  const prior = progressEntryForId(store, item.id, item.aliases)?.record;
  const listenFields = {
    listens: (Number(prior?.listens) || 0) + 1,
    listenedAt: new Date(now).toISOString(),
  };

  if (grade === "know") {
    if (status === "known" && prior) {
      setCanonicalGradeRecord(store, item.id, item.aliases, {
        ...recordReinforcement(prior, now),
        ...listenFields,
      });
    } else {
      // New or struggling: exposure counts as exposure, nothing more. No
      // lastGrade means statusForId still answers "new", so Continue
      // Learning introduces the item exactly as it would have.
      setCanonicalGradeRecord(store, item.id, item.aliases, { ...prior, ...listenFields });
    }
  } else {
    if (status === "known" && prior) {
      setCanonicalGradeRecord(store, item.id, item.aliases, {
        ...prior,
        ...listenFields,
        // Same scale a real mistake leaves (adaptivePractice caps at 8);
        // one distracted listen is a nudge, not a ladder reset.
        difficultyDebt: Math.min(8, (Number(prior.difficultyDebt) || 0) + 1),
        lastMistakeAt: new Date(now).toISOString(),
      });
    } else {
      setCanonicalGradeRecord(store, item.id, item.aliases, {
        ...recordStruggle(now, prior),
        ...listenFields,
      });
    }
  }

  saveGradeStore(store, profile);
  return undo;
}

/**
 * An explicit tracker correction is intentionally stronger than passive
 * Listen grading. The learner chose an exact memory level, so write the same
 * spaced-review record the tracker and guided lesson use.
 */
export function setListenReviewLevel(
  item: Pick<ListenItem, "id" | "aliases">,
  level: ListenReviewLevel,
  profile: UserProfile | null = getAuthUser(),
  now = Date.now()
): ListenReviewChange {
  const store = loadGradeStore(profile);
  const change = snapshotListenReviewChange(store, item);
  const prior = progressEntryForId(store, item.id, item.aliases)?.record;

  if (level === "new") {
    delete store[item.id];
    item.aliases.forEach((alias) => delete store[alias]);
  } else if (level === "struggle") {
    setCanonicalGradeRecord(store, item.id, item.aliases, recordStruggle(now, prior));
  } else if (level === "permanent") {
    setCanonicalGradeRecord(store, item.id, item.aliases, recordPermanent(now, prior));
  } else {
    const record = setStrengthLevel(level, now, prior);
    if (record) setCanonicalGradeRecord(store, item.id, item.aliases, record);
  }

  saveGradeStore(store, profile);
  return change;
}

/** Restore the exact tracker entries replaced by an explicit Listen action. */
export function undoListenReviewChange(
  change: ListenReviewChange,
  profile: UserProfile | null = getAuthUser()
): void {
  const store = loadGradeStore(profile);
  for (const { key } of change.entries) delete store[key];
  for (const { key, record } of change.entries) {
    if (record) store[key] = { ...record };
  }
  saveGradeStore(store, profile);
}

/** Hold the current item out of every learning surface until the chosen date. */
export function snoozeListenItem(
  item: Pick<ListenItem, "id" | "aliases">,
  days: number,
  profile: UserProfile | null = getAuthUser(),
  now = Date.now()
): void {
  const store = loadGradeStore(profile);
  const prior = progressEntryForId(store, item.id, item.aliases)?.record;
  setCanonicalGradeRecord(store, item.id, item.aliases, snoozeForDays(days, now, prior));
  saveGradeStore(store, profile);
}

/** The stored listen-exposure count for a tracker row, if any. */
export function listenCountForId(store: GradeStore, id: string, aliases: string[] = []): number {
  const viaGrade = gradeEntryForId(store, id, aliases)?.record;
  const record = viaGrade ?? progressEntryForId(store, id, aliases)?.record;
  return Number(record?.listens) || 0;
}
