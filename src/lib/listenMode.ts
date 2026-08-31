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
import { portugueseFor } from "@/lib/portugueseCourse";
import { russianFor } from "@/lib/russianCourse";
import { spanishFor } from "@/lib/spanishCourse";
import { primaryAnswer } from "@/lib/germanTextMatch";
import { buildCatalog } from "@/session";
import { buildWordCatalog, rankWordCatalog, spokenWordRung } from "@/lib/wordSession";
import { buildCorpusIndex, sentenceCommonality } from "@/lib/corpusFrequency";
import {
  conversationPriorityInfo,
  conversationPriorityScore,
  USEFULNESS_FILTERS,
  type ConversationUsefulness,
} from "@/lib/conversationPriority";
import { cefrRung, cefrStep, cefrStepLabel, CEFR_STEPS, type CefrStep } from "@/lib/cefr";
import { withoutMutedPacks } from "@/lib/mutedPacks";
import { packMeta, packNoteForWord } from "@/lib/curriculum";
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

// Named for the two SIDES of a card, not for two languages.
//
// german/english was true while Listen only ever had those two and one of
// them was always the one being learned. It stopped being true when the
// English course arrived: there, "german repeats" was the setting for the
// line the learner is NOT learning, and the code that read it had to know
// which course it was in to know what it meant.
//
// The old keys are still read, once, mapped per course — see legacyRepeats —
// so a count somebody chose does not change which line it applies to.
const TARGET_REPEATS_KEY = "gl-listen-target-repeats";
const MEANING_REPEATS_KEY = "gl-listen-meaning-repeats";
const SIDE_ORDER_KEY = "gl-listen-side-order";
const LEGACY_GERMAN_REPEATS_KEY = "gl-listen-german-repeats";
const LEGACY_ENGLISH_REPEATS_KEY = "gl-listen-english-repeats";
const LEGACY_ORDER_KEY = "gl-listen-language-order";
const NEXT_CARD_DELAY_KEY = "gl-listen-next-card-delay-ms";
const LANGUAGE_GAP_KEY = "gl-listen-language-gap-ms";
const LOOP_ITEMS_KEY = "gl-listen-loop-items";
const LOOP_PASSES_KEY = "gl-listen-loop-passes";
const BACKGROUND_PLAYBACK_KEY = "gl-listen-background-playback-v1";
const PET_BILINGUAL_CAPTIONS_KEY = "gl-listen-pet-bilingual-captions-v1";
const CONTENT_SOURCE_KEY = "gl-listen-content-source";
const MIXED_COUNTS_KEY = "gl-listen-mixed-counts-v1";
const QUEUE_ORDER_KEY = "gl-listen-queue-order";
const QUEUE_WITHIN_KEY = "gl-listen-queue-within-v1";
const RETURN_GAP_KEY = "gl-listen-return-gap-v1";
const RETURN_SCOPE_KEY = "gl-listen-return-scope-v1";
const LEVEL_FILTER_KEY = "gl-listen-level-filter-v1";
const USEFULNESS_FILTER_KEY = "gl-listen-usefulness-filter-v1";
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
export const DEFAULT_TARGET_REPEATS = 2;
export const DEFAULT_MEANING_REPEATS = 1;
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
export type ListenLevelFilter = "all" | CefrStep;
export type ListenUsefulnessFilter = "all" | ConversationUsefulness;
export const LISTEN_QUEUE_ORDERS: ListenQueueOrder[] = ["level", "common", "learning", "least-heard", "newest"];
/**
 * What leads each group the queue order makes.
 *
 * Easiest first sorts by level, which puts all of A1 before any of A2 and
 * says nothing about the order of A1 itself. That second answer used to be
 * hard-coded to commonality, and it is a real choice: the same learner might
 * want A1 in the order they are most likely to need it, or want the A1 cards
 * they keep getting wrong to come first, and both are "all of A1 before A2".
 *
 * Every order except Most common first makes groups — levels, review
 * buckets, packs, listen counts — and this decides what happens inside one.
 * Most common first ranks every card individually, so it leaves no ties for
 * this to break; the picker says so rather than offering a control that
 * would do nothing.
 */
export type ListenQueueWithin = "common" | "hardest" | "least-heard" | "newest" | "learning";
export const LISTEN_QUEUE_WITHINS: ListenQueueWithin[] = ["common", "hardest", "least-heard", "newest", "learning"];
/**
 * How long after hearing something before it may play again.
 *
 * "immediate" is what Listen did before there was a choice: anything the order
 * put in front of you played, whether you heard it a minute ago or never. That
 * is right for a first pass through a new pack and wrong for everything after
 * it — a narrow filter turns into the same twenty cards all evening, which
 * feels like studying and is not.
 *
 * "due" defers to the review ladder rather than a clock: nothing you have
 * already answered correctly comes back until the ladder says it is due, at
 * one day, then three, ten, thirty, a hundred and eighty. It is the strictest
 * setting and the one that matches how the rest of the app schedules.
 */
export type ListenReturnGap =
  | "immediate"
  | "three"
  | "ten"
  | "thirty"
  | "hours"
  | "day"
  | "due";
export const LISTEN_RETURN_GAPS: ListenReturnGap[] = [
  "immediate", "three", "ten", "thirty", "hours", "day", "due",
];
/** A day is the default because a wait you can sit through is not a wait. */
export const DEFAULT_LISTEN_RETURN_GAP: ListenReturnGap = "day";
const HOUR_MS = 60 * 60 * 1000;
export const LISTEN_RETURN_GAP_MS: Record<ListenReturnGap, number> = {
  immediate: 0,
  // The counted gaps are not durations at all; see LISTEN_RETURN_GAP_CARDS.
  three: 0,
  ten: 0,
  thirty: 0,
  hours: 4 * HOUR_MS,
  day: 24 * HOUR_MS,
  // Not a duration: "due" asks the review ladder instead of the clock, and the
  // number here is only what a caller sees if it reads the map directly.
  due: Number.POSITIVE_INFINITY,
};

/**
 * The short waits, counted in cards rather than in time.
 *
 * Hours and days are the wrong unit for the thing a learner is usually trying
 * to build. Holding a word for the length of three other cards is short-term
 * memory: you are still carrying it when it comes back. Four hours is not that
 * exercise at all — by then the word is either in long-term memory or gone,
 * and the setting has stopped training the thing it was reached for.
 *
 * So the scale reaches down below the clock. Three, ten and thirty are far
 * enough apart to feel different in use: three is "still in your head", ten is
 * "you have to fetch it back", thirty is "a session ago".
 */
export const LISTEN_RETURN_GAP_CARDS: Partial<Record<ListenReturnGap, number>> = {
  three: 3,
  ten: 10,
  thirty: 30,
};

/** Is this wait measured in cards heard rather than in time passed? */
export function listenReturnGapIsCounted(gap: ListenReturnGap): boolean {
  return LISTEN_RETURN_GAP_CARDS[gap] !== undefined;
}

/**
 * Which cards the wait applies to.
 *
 * Words and sentences are learned differently and a learner may well want the
 * wait on one and not the other: a word met once is worth meeting again soon,
 * while a whole sentence heard twice in an evening teaches the rhythm and not
 * much else. Both by default, because that is what "already heard it" means
 * to somebody who has not thought about it.
 */
export type ListenReturnScope = "words" | "sentences" | "both";
export const LISTEN_RETURN_SCOPES: ListenReturnScope[] = ["both", "words", "sentences"];
export const DEFAULT_LISTEN_RETURN_SCOPE: ListenReturnScope = "both";

/** The order that leaves no ties to break, so nothing can be asked second. */
export const LISTEN_QUEUE_ORDERS_WITHOUT_GROUPS: ListenQueueOrder[] = ["common"];
/** Commonality, which is what the single-key order always used. */
export const DEFAULT_LISTEN_QUEUE_WITHIN: ListenQueueWithin = "common";
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
/**
 * Which side of the card is spoken first.
 *
 * Meaning first by default in every course: hear what it means, have your go
 * at saying it, then hear it said. The English course used to need its own
 * defaults purely because the settings were named after languages and its
 * languages sat the other way round. They are named after the sides now, so
 * there is one set of defaults and every course reads it the same way.
 */
export type ListenLanguageOrder = "meaning-first" | "target-first";
export const DEFAULT_LISTEN_LANGUAGE_ORDER: ListenLanguageOrder = "meaning-first";

function courseSettingKey(key: string, direction: LearningDirection): string {
  return `${key}:${direction}`;
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

function readOptionalRepeats(key: string): number | null {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored == null || stored.trim() === "") return null;
    const raw = Number(stored);
    if (Number.isFinite(raw) && raw >= 1 && raw <= MAX_LANGUAGE_REPEATS) return Math.round(raw);
  } catch { /* storage blocked: use the documented default */ }
  return null;
}

/**
 * What this setting was worth under its old, language-shaped name.
 *
 * The English course led with its MEANING, so its old "english repeats" was
 * the count for the line being learned and its "german repeats" the count for
 * the translation. Every other course led with the target, so the two map the
 * other way round. Read once and mapped rather than left behind, because a
 * dropped setting is a learner's chosen playback silently reverting.
 */
function legacyRepeats(direction: LearningDirection, side: "target" | "meaning"): number | null {
  const targetWasEnglish = direction === "learn-en";
  const wantsEnglishKey = side === "target" ? targetWasEnglish : !targetWasEnglish;
  const key = wantsEnglishKey ? LEGACY_ENGLISH_REPEATS_KEY : LEGACY_GERMAN_REPEATS_KEY;
  const scoped = readOptionalRepeats(courseSettingKey(key, direction));
  if (scoped != null) return scoped;
  // Repeat counts existed before courses had separate playback plans, and
  // that unscoped choice only ever belonged to the original German course.
  return direction === "learn-de" ? readOptionalRepeats(key) : null;
}

/** How often the line being LEARNED is spoken on each card. */
export function getListenTargetRepeats(direction: LearningDirection = getLearningDirection()): number {
  return readOptionalRepeats(courseSettingKey(TARGET_REPEATS_KEY, direction))
    ?? legacyRepeats(direction, "target")
    ?? DEFAULT_TARGET_REPEATS;
}

export function setListenTargetRepeats(
  count: number,
  direction: LearningDirection = getLearningDirection()
): number {
  return storeIntegerSetting(courseSettingKey(TARGET_REPEATS_KEY, direction), count, 1, MAX_LANGUAGE_REPEATS);
}

/** How often the translation beside it is spoken. */
export function getListenMeaningRepeats(direction: LearningDirection = getLearningDirection()): number {
  return readOptionalRepeats(courseSettingKey(MEANING_REPEATS_KEY, direction))
    ?? legacyRepeats(direction, "meaning")
    ?? DEFAULT_MEANING_REPEATS;
}

export function setListenMeaningRepeats(
  count: number,
  direction: LearningDirection = getLearningDirection()
): number {
  return storeIntegerSetting(courseSettingKey(MEANING_REPEATS_KEY, direction), count, 1, MAX_LANGUAGE_REPEATS);
}

export function getListenLanguageOrder(
  direction: LearningDirection = getLearningDirection()
): ListenLanguageOrder {
  try {
    const value = window.localStorage.getItem(courseSettingKey(SIDE_ORDER_KEY, direction));
    if (value === "meaning-first" || value === "target-first") return value;
    const legacy = window.localStorage.getItem(courseSettingKey(LEGACY_ORDER_KEY, direction))
      ?? (direction === "learn-de" ? window.localStorage.getItem(LEGACY_ORDER_KEY) : null);
    if (legacy === "english-first" || legacy === "german-first") {
      // Same mapping as legacyRepeats, for the same reason: the old names say
      // which LANGUAGE led, and which language that was depends on the course.
      const legacyTargetFirst = direction === "learn-en" ? "english-first" : "german-first";
      return legacy === legacyTargetFirst ? "target-first" : "meaning-first";
    }
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_LANGUAGE_ORDER;
}

export function setListenLanguageOrder(
  order: ListenLanguageOrder,
  direction: LearningDirection = getLearningDirection()
): ListenLanguageOrder {
  const next = order === "target-first" ? "target-first" : "meaning-first";
  try {
    window.localStorage.setItem(courseSettingKey(SIDE_ORDER_KEY, direction), next);
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

export function getListenQueueWithin(
  direction: LearningDirection = getLearningDirection()
): ListenQueueWithin {
  try {
    const value = window.localStorage.getItem(courseSettingKey(QUEUE_WITHIN_KEY, direction));
    if (LISTEN_QUEUE_WITHINS.includes(value as ListenQueueWithin)) return value as ListenQueueWithin;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_QUEUE_WITHIN;
}

export function setListenQueueWithin(
  within: ListenQueueWithin,
  direction: LearningDirection = getLearningDirection()
): ListenQueueWithin {
  const next = LISTEN_QUEUE_WITHINS.includes(within) ? within : DEFAULT_LISTEN_QUEUE_WITHIN;
  try {
    window.localStorage.setItem(courseSettingKey(QUEUE_WITHIN_KEY, direction), next);
  } catch { /* keep Listen usable */ }
  return next;
}

export function getListenReturnGap(
  direction: LearningDirection = getLearningDirection()
): ListenReturnGap {
  try {
    const value = window.localStorage.getItem(courseSettingKey(RETURN_GAP_KEY, direction));
    if (LISTEN_RETURN_GAPS.includes(value as ListenReturnGap)) return value as ListenReturnGap;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_RETURN_GAP;
}

export function setListenReturnGap(
  gap: ListenReturnGap,
  direction: LearningDirection = getLearningDirection()
): ListenReturnGap {
  const next = LISTEN_RETURN_GAPS.includes(gap) ? gap : DEFAULT_LISTEN_RETURN_GAP;
  try {
    window.localStorage.setItem(courseSettingKey(RETURN_GAP_KEY, direction), next);
  } catch { /* keep Listen usable */ }
  return next;
}

export function getListenReturnScope(
  direction: LearningDirection = getLearningDirection()
): ListenReturnScope {
  try {
    const value = window.localStorage.getItem(courseSettingKey(RETURN_SCOPE_KEY, direction));
    if (LISTEN_RETURN_SCOPES.includes(value as ListenReturnScope)) return value as ListenReturnScope;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_RETURN_SCOPE;
}

export function setListenReturnScope(
  scope: ListenReturnScope,
  direction: LearningDirection = getLearningDirection()
): ListenReturnScope {
  const next = LISTEN_RETURN_SCOPES.includes(scope) ? scope : DEFAULT_LISTEN_RETURN_SCOPE;
  try {
    window.localStorage.setItem(courseSettingKey(RETURN_SCOPE_KEY, direction), next);
  } catch { /* keep Listen usable */ }
  return next;
}

/** Whether the wait covers this kind of card at all. */
export function listenReturnCovers(scope: ListenReturnScope, kind: "word" | "sentence"): boolean {
  if (scope === "both") return true;
  return scope === "words" ? kind === "word" : kind === "sentence";
}

/** True when the order groups its cards, so asking what leads a group means
 *  something. Most common first ranks every card on its own. */
export function listenQueueHasGroups(order: ListenQueueOrder): boolean {
  return !LISTEN_QUEUE_ORDERS_WITHOUT_GROUPS.includes(order);
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

/**
 * Narrowing what plays, as opposed to reordering it.
 *
 * Order decides what comes first and still plays everything; a filter decides
 * what is in the queue at all. They answer different questions — "start me on
 * the easy material" is an order, "I only want A1 today" is a filter — and
 * Listen had only the first, so there was no way to work through one level or
 * one kind of usefulness and stop.
 *
 * Both read the same two categories the trackers narrow by, deliberately: a
 * learner who filters the word list to A2 and then opens Listen should be able
 * to ask for the same thing in the same words.
 */
/**
 * A SET of levels, not one of them.
 *
 * The first version of these was a radio group, which answers "only A1" and
 * cannot answer "A1 and A2, nothing above" — and the second is the more
 * useful question, because a learner working through the start of a course
 * wants both of the levels they have met and none of the four they have not.
 * Radio also has no way to say "everything except the specialist packs":
 * excluding one band meant naming every band you did want, one at a time,
 * which a single-select cannot hold at all.
 *
 * The empty set means no restriction rather than nothing — a filter nobody
 * has touched must not empty the queue, and unticking the last box is the
 * same thing as not having filtered.
 */
function readSetSetting<T extends string>(key: string, allowed: readonly T[], direction: LearningDirection): Set<T> {
  try {
    const raw = window.localStorage.getItem(courseSettingKey(key, direction));
    if (!raw) return new Set();
    const wanted = new Set(raw.split(",").map((entry) => entry.trim()).filter(Boolean));
    // Filtered against the allowed list, so a value left over from an older
    // build (or a hand-edited store) cannot silently narrow the queue to
    // something the controls cannot show and therefore cannot undo.
    return new Set(allowed.filter((value) => wanted.has(value)));
  } catch { /* storage blocked: play everything */ }
  return new Set();
}

function writeSetSetting<T extends string>(key: string, values: Iterable<T>, allowed: readonly T[], direction: LearningDirection): Set<T> {
  const wanted = new Set(values);
  const next = new Set(allowed.filter((value) => wanted.has(value)));
  try {
    window.localStorage.setItem(courseSettingKey(key, direction), [...next].join(","));
  } catch { /* keep Listen usable */ }
  return next;
}

export function getListenLevelFilters(
  direction: LearningDirection = getLearningDirection()
): Set<CefrStep> {
  return readSetSetting(LEVEL_FILTER_KEY, CEFR_STEPS, direction);
}

export function setListenLevelFilters(
  levels: Iterable<CefrStep>,
  direction: LearningDirection = getLearningDirection()
): Set<CefrStep> {
  return writeSetSetting(LEVEL_FILTER_KEY, levels, CEFR_STEPS, direction);
}

const USEFULNESS_KEYS = USEFULNESS_FILTERS
  .map((option) => option.key)
  .filter((key): key is ConversationUsefulness => key !== "all");

export function getListenUsefulnessFilters(
  direction: LearningDirection = getLearningDirection()
): Set<ConversationUsefulness> {
  return readSetSetting(USEFULNESS_FILTER_KEY, USEFULNESS_KEYS, direction);
}

export function setListenUsefulnessFilters(
  bands: Iterable<ConversationUsefulness>,
  direction: LearningDirection = getLearningDirection()
): Set<ConversationUsefulness> {
  return writeSetSetting(USEFULNESS_FILTER_KEY, bands, USEFULNESS_KEYS, direction);
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
  side: "target" | "meaning";
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
  targetRepeats,
  meaningRepeats,
  languageOrder,
  meaningLang,
  targetLang = "de-DE",
  languageGapMs,
}: {
  /** The line being LEARNED. Named `de` for the field it comes from. */
  de: string;
  /** The translation beside it. */
  en: string;
  targetRepeats: number;
  meaningRepeats: number;
  languageOrder: ListenLanguageOrder;
  /** Voice for the translation. */
  meaningLang: string;
  /** Voice for the line being learned. Defaults to German, so the course that
   *  always was German need not say so. */
  targetLang?: string;
  languageGapMs: number;
}): ListenSpeechClip[] {
  const target: ListenSpeechClip[] = Array.from(
    { length: Math.max(0, targetRepeats) },
    () => ({ text: de, rate: 0.92, lang: targetLang, side: "target" as const })
  );
  // A word of the language being learned, quoted inside the translation, is
  // read by that language's voice. The side stays "meaning" — it is still the
  // translation half of the card, and the caption, the gap and the repeat
  // count all belong to the line as a whole.
  const meaningOnce: ListenSpeechClip[] = borrowedWordSegments(en, de, meaningLang, targetLang)
    .map((segment) => ({ text: segment.text, rate: 0.95, lang: segment.lang, side: "meaning" as const }));
  const meaning: ListenSpeechClip[] = Array.from(
    { length: Math.max(0, meaningRepeats) },
    () => meaningOnce
  ).flat();
  const [first, second] = languageOrder === "meaning-first"
    ? [meaning, target]
    : [target, meaning];
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
  order: ListenQueueOrder,
  within: ListenQueueWithin
): string {
  // Sentence, word, and mixed queues contain different ids, while each queue
  // order gives those ids a different position. Keep an exact cursor for the
  // full combination so switching filters never drops a learner halfway into
  // an unrelated ordering. What leads each group is part of that ordering,
  // so it is part of the key: without it, changing it would leave the cursor
  // pointing at a position that no longer holds the card it was left on.
  //
  // The default is left out of the key so that every cursor stored before
  // there was a second question still resolves.
  const suffix = within === DEFAULT_LISTEN_QUEUE_WITHIN ? "" : `:${within}`;
  return `${CURRENT_ITEM_KEY}:${direction}:${source}:${order}${suffix}`;
}

export function getListenCurrentItemId(
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser(),
  source: ListenContentSource = getListenContentSource(direction),
  order: ListenQueueOrder = getListenQueueOrder(direction),
  within: ListenQueueWithin = getListenQueueWithin(direction)
): string {
  const value = loadScopedJson<unknown>(currentItemStorageKey(direction, source, order, within), "", profile);
  return typeof value === "string" ? value : "";
}

export function setListenCurrentItemId(
  itemId: string,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser(),
  source: ListenContentSource = getListenContentSource(direction),
  order: ListenQueueOrder = getListenQueueOrder(direction),
  within: ListenQueueWithin = getListenQueueWithin(direction)
): string {
  const next = typeof itemId === "string" ? itemId.slice(0, 240) : "";
  saveScopedJson(currentItemStorageKey(direction, source, order, within), next, profile);
  return next;
}

export type ListenItem = {
  id: string;
  aliases: string[];
  /** The line being LEARNED, and the big line on the card. Named for the
   *  field it is built from; it holds French in the French course and English
   *  in the English one. */
  de: string;
  /** What it means, in the language the app is written in. */
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
   * The same sentence as it is WRITTEN, when the card teaches how it is said.
   *
   * The course teaches the spoken form — "Ich hab das nicht ganz verstanden"
   * — because that is what people say. In print it is "habe", and a learner
   * who only ever meets the spoken one has no idea how to write it. The
   * lesson has shown this for a while; Listen dropped it on the way through.
   */
  long?: string;
  /**
   * How hard this card is, 1 (A1) to 6 (C1-C2) — see cefrRung.
   *
   * What "easiest first" sorts on, and what a WORD card shows through
   * cefrRungLabel. Read from the item rather than recomputed, so the order
   * can be checked against the thing it actually used.
   *
   * A sentence shows levelLabel instead: a range label's low end is the right
   * thing to sort by and the wrong thing to announce.
   */
  rung?: number;
  /**
   * What the card SAYS its level is, when that differs from what it sorts by.
   *
   * A range label has two readings and the app uses both on purpose: cefrRung
   * takes the low end so an A1-A2 lesson sorts among the A1s, and cefrStep
   * takes the high end so a learner filtering for A2 is shown the A2 material
   * inside it. Sorting and filtering each want a different one, and the badge
   * had been reading the sort key — so a sentence from an A1-A2 pack of
   * subordinate clauses announced itself as A1 while the tracker filed it
   * under A2. One item, two answers, and the badge gave the flattering one.
   *
   * Sentences carry the filter's reading here. Words do not set it: a word's
   * rung is its own difficulty rather than its pack's, which is why haben
   * sorts at 1 from inside an A2 pack, and that number is the honest badge.
   */
  levelLabel?: string;
  kind: "sentence" | "word";
  popularity: number;
};

/**
 * Deal words and sentences together, WITHOUT undoing the order that produced
 * them.
 *
 * Splitting the queue into two streams and dealing one word to two sentences
 * is right for an order that is a flat priority list. It is wrong for
 * easiest-first, because the two streams then walk the level ladder at
 * completely different speeds: the German course has 1,147 A1 words against
 * 366 A1 sentences, so at two sentences a round the sentence stream is out of
 * A1 while the word stream is a sixth of the way through it. Every round
 * after that reads A1 word, A2 sentence, A2 sentence — the level jumping
 * forward and back forever, 3,543 times across the queue, with the sort
 * itself working perfectly. The learner is told they are working up through
 * the levels and is not.
 *
 * So when the queue is grouped, the deal happens inside each group and the
 * groups stay in order. `groupOf` is what makes a group: the rung for
 * easiest-first, nothing at all for the orders that have no such promise to
 * keep, where the flat deal is still exactly right.
 */
export function arrangeListenMixedQueue(
  queue: ListenItem[],
  counts: ListenMixedCounts = DEFAULT_LISTEN_MIXED_COUNTS,
  groupOf?: (item: ListenItem) => number | string | undefined
): ListenItem[] {
  const wanted = normalizeListenMixedCounts(counts);
  const deal = (rows: ListenItem[], out: ListenItem[]) => {
    const words = rows.filter((item) => item.kind === "word");
    const sentences = rows.filter((item) => item.kind === "sentence");
    let wi = 0; let si = 0;
    while (wi < words.length || si < sentences.length) {
      for (let i = 0; i < wanted.words && wi < words.length; i += 1) out.push(words[wi++]);
      for (let i = 0; i < wanted.sentences && si < sentences.length; i += 1) out.push(sentences[si++]);
    }
  };
  const out: ListenItem[] = [];
  if (!groupOf) {
    deal(queue, out);
    return out;
  }
  // Insertion order, so the groups come out in the order the sort put them —
  // this must never re-sort, only preserve.
  const groups = new Map<string, ListenItem[]>();
  for (const item of queue) {
    const key = String(groupOf(item) ?? "");
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }
  for (const rows of groups.values()) deal(rows, out);
  return out;
}

/**
 * What counts as one group for the mixed deal, for a given queue order.
 *
 * Only easiest-first promises anything about level, so only easiest-first
 * constrains the deal. The others are flat priority lists where interleaving
 * across the whole queue is the point.
 */
export function listenMixGroupFor(
  order: ListenQueueOrder
): ((item: ListenItem) => number | string | undefined) | undefined {
  return order === "level" ? (item) => item.rung ?? 3 : undefined;
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
  within?: ListenQueueWithin;
  returnGap?: ListenReturnGap;
  returnScope?: ListenReturnScope;
  /** Levels to keep. Empty or absent plays every level. */
  levels?: Iterable<CefrStep>;
  /** Usefulness bands to keep. Empty or absent plays every band. */
  usefulness?: Iterable<ConversationUsefulness>;
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
  const within = options.within ?? getListenQueueWithin(direction);
  const returnGap = options.returnGap ?? getListenReturnGap(direction);
  const returnScope = options.returnScope ?? getListenReturnScope(direction);
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
  // A SENTENCE is ranked by the same reading of its pack label that it shows,
  // which is the high end of a range.
  //
  // Ranking by the low end is defensible on its own — an A1-A2 lesson is a
  // beginner lesson that happens to reach far — but it cannot be combined with
  // a badge that reads the high end. Easiest-first then walks A1-labelled and
  // A1-A2-labelled packs together, both at rung 1, and the cards announce A1,
  // A2, A1, A2 while the order is working exactly as written. A promise that
  // nothing harder comes before something easier is only kept if it is kept in
  // the units the learner is shown.
  const partRung = (partKey: unknown) => {
    const level = parts[String(partKey ?? "")]?.level;
    if (!level) return cefrRung(level);
    return CEFR_STEPS.indexOf(cefrStep(level)) + 1;
  };
  const partLevelLabel = (partKey: unknown) => {
    const level = parts[String(partKey ?? "")]?.level;
    return level ? cefrStepLabel(cefrStep(level)) : undefined;
  };

  // Narrowing happens BEFORE ranking, not after: popularity is stored as a
  // percentile of the queue, so filtering afterwards would leave a queue whose
  // positions were normalised against cards that are no longer in it.
  // Empty means no restriction, in both. Anything else is the set of things
  // to keep, so a learner can ask for A1 AND A2 and nothing above, or for
  // everything except one band — neither of which a single choice can say.
  const levelFilter = new Set(options.levels ?? getListenLevelFilters(direction));
  const usefulnessFilter = new Set(options.usefulness ?? getListenUsefulnessFilters(direction));
  const narrowing = levelFilter.size > 0 || usefulnessFilter.size > 0;
  const keep = (partKey: unknown, ownLevel?: string) => {
    if (!narrowing) return true;
    const key = String(partKey ?? "");
    if (levelFilter.size > 0) {
      // A word carries its own level and a sentence takes its pack's, which is
      // exactly how the two trackers filter them. Asking for A2 in Listen and
      // asking for it in the word list must not answer differently.
      const level = ownLevel ?? parts[key]?.level;
      if (!levelFilter.has(cefrStep(level))) return false;
    }
    if (usefulnessFilter.size > 0 && !usefulnessFilter.has(conversationPriorityInfo(key).key)) return false;
    return true;
  };

  // primaryAnswer on both sides: answer keys list alternatives behind " / "
  // for the matcher's benefit, but a listening card shows (and the voice
  // speaks) one clean form, not the whole key.
  const rankedSentences = content === "words" ? [] : buildCatalog(parts)
    .filter((item) => keep(item.partKey))
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
      long: item.long,
      rung: partRung(item.partKey),
      levelLabel: partLevelLabel(item.partKey),
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
    : rankWordCatalog(
      buildWordCatalog(parts).filter((word) => word.listenSafe !== false && keep(word.partKey, word.level)),
      corpusIndex
    );
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
      // The word's own register, not its pack's: a bare word card has no
      // pack context, and "die Lust" wearing part28's 18+ badge in a matcher
      // taught that everyday German is explicit. See packNoteForWord.
      tierNote: packNoteForWord(word.partKey, word.lookup),
      // `index` is this word's place in the ranking above, which is the
      // course's own count of how often it says the word — the evidence that
      // decides whether a pack label is the last word on how hard it is.
      rung: spokenWordRung(word, index, corpusIndex),
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
  // `de` is always the language being learned and `en` always the meaning,
  // whatever course this is. That is new: the English course used to put its
  // German in the first slot, so the big line at the top of the card was the
  // one language the learner was NOT there to learn.
  //
  // The meaning is whatever the app itself is written in. It used to be
  // English by construction, which was the same thing while the app only ever
  // spoke the two languages the catalogue holds, and stopped being the same
  // thing when French became something the app could be set to: a learner
  // reading a French app was still being told what her German meant in
  // English.
  //
  // An item the table cannot reach leaves the queue, exactly as it does in
  // the French course. A card that quietly falls back to another language is
  // one the settings beside it are lying about: the voice, the mute switch
  // and the repeat count all name a language that card is not in.
  const target = targetLanguage(direction);
  const meaning = meaningLanguageFor(target);
  const slots = { de: target, en: meaning };
  if (slots.de !== "de" || slots.en !== "en") {
    const textFor = (item: ListenItem, language: CourseLanguage): string | null => {
      if (language === "de") return item.de;
      if (language === "en") return item.en;
      if (language === "pl") return polishFor(item.de);
      if (language === "es") return spanishFor(item.de);
      if (language === "pt") return portugueseFor(item.de);
      if (language === "ru") return russianFor(item.de);
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

  /**
   * How many cards have been heard since this one.
   *
   * Every play stamps a time, so the number of cards carrying a LATER stamp is
   * exactly the number that have gone by since — no counter to keep, nothing
   * extra to store, and it survives a reload because the stamps do. Rank 0 is
   * the card heard most recently.
   */
  const heardRank = new Map<string, number>();
  combined
    .map((item) => ({ id: item.id, at: listenStamp(item) }))
    .filter((entry) => entry.at > 0)
    .sort((a, b) => b.at - a.at)
    .forEach((entry, position) => {
      if (!heardRank.has(entry.id)) heardRank.set(entry.id, position);
    });

  /**
   * Is this card still resting?
   *
   * Resting is not the same as excluded. A filter can empty a queue, and a
   * listening mode with nothing in it is a bug rather than a lesson, so a
   * rested card sorts to the BACK instead of leaving. On the whole course the
   * back is twenty thousand cards away and amounts to not coming back; on a
   * narrow filter it means "after everything else", which is the most this
   * setting can honestly promise there.
   *
   * Never heard means never rested: a card that has not played yet cannot be
   * one you have already had.
   */
  const resting = (item: ListenItem): boolean => {
    if (returnGap === "immediate") return false;
    if (!listenReturnCovers(returnScope, item.kind)) return false;
    const heardAt = listenStamp(item);
    if (!heardAt) return false;
    // A counted wait asks how many cards ago, not how long ago. Three cards is
    // a wait a learner can actually feel inside one session, which four hours
    // is not, and it is the whole point of the short end of this scale.
    const cards = LISTEN_RETURN_GAP_CARDS[returnGap];
    if (cards !== undefined) {
      const rank = heardRank.get(item.id);
      return rank !== undefined && rank < cards;
    }
    // "Due" hands the decision to the review ladder rather than the clock, so
    // a card rests exactly as long as the ladder says and no longer. One that
    // has never been graded has no ladder to consult and rests a day, which is
    // the shortest thing the ladder ever asks for.
    if (returnGap === "due") {
      const record = recordFor(item);
      if (record?.lastGrade === "know") return !isDueForReview(record, now);
      return now - heardAt < LISTEN_RETURN_GAP_MS.day;
    }
    return now - heardAt < LISTEN_RETURN_GAP_MS[returnGap];
  };

  const available = combined
    .map((item, index) => ({
      item,
      index,
      bucket: bucketOf(item),
      resting: resting(item) ? 1 : 0,
    }))
    .filter((entry) => entry.bucket >= 0);

  // What leads a group, once the order above has decided what the groups are.
  //
  // Every branch ends on `a.index - b.index`, which is commonality: the list
  // arrives in that order, so it is both the default answer and the last word
  // when the chosen one ties. Without that, two cards with the same listen
  // count or the same difficulty would fall into whatever order the sort
  // happened to leave them in, and the queue would not be the same twice.
  const leads = (a: typeof available[number], b: typeof available[number]): number => {
    if (within === "hardest") {
      // How often the learner has said this one was hard, which is a different
      // axis from the level: inside A1 every card is A1, and this is what
      // separates the ones that are still landing from the ones that are not.
      const debt = (entry: typeof a) => Number(recordFor(entry.item)?.difficultyDebt) || 0;
      return debt(b) - debt(a) || a.index - b.index;
    }
    if (within === "least-heard") {
      return (Number(recordFor(a.item)?.listens) || 0) - (Number(recordFor(b.item)?.listens) || 0)
        || listenStamp(a.item) - listenStamp(b.item)
        || a.index - b.index;
    }
    if (within === "newest") {
      return (itemPackRank.get(b.item.id) ?? -1) - (itemPackRank.get(a.item.id) ?? -1)
        || a.index - b.index;
    }
    if (within === "learning") {
      return a.bucket - b.bucket || a.index - b.index;
    }
    return a.index - b.index;
  };

  // Most common first ranks every card on its own, so there is nothing left
  // for `leads` to decide and applying it would quietly replace the order the
  // learner asked for. `available` is already in that rank, and the only thing
  // asked of it here is that a card still resting waits behind the rest.
  if (order === "common") {
    return available
      .sort((a, b) => a.resting - b.resting || a.index - b.index)
      .map((entry) => entry.item);
  }

  // Easiest first. The level is asked first and what leads it second, rather
  // than one replacing the other. A pack with no level sorts last (cefrOrder
  // gives it 99): it applies everywhere, so there is no rung to put it on, and
  // guessing one would push unlevelled material in front of A1.
  if (order === "level") {
    return available
      .sort((a, b) => a.resting - b.resting
        || (a.item.rung ?? 3) - (b.item.rung ?? 3)
        || leads(a, b))
      .map((entry) => entry.item);
  }

  // Newest first exists because "Most common first" structurally cannot reach
  // new content: a freshly added word is by definition one the frequency bank
  // has never ranked, so it sorts to the very back of a queue thousands of
  // items long and is never actually heard. This order plays the most recent
  // packs first, and `leads` decides the order within a pack.
  if (order === "newest") {
    return available
      .sort((a, b) =>
        a.resting - b.resting
        || (itemPackRank.get(b.item.id) ?? -1) - (itemPackRank.get(a.item.id) ?? -1)
        || leads(a, b)
      )
      .map((entry) => entry.item);
  }

  // Least heard first. Everything never played is tied at zero, which is most
  // of the queue on a fresh course, so what leads that group is the whole
  // question for a while.
  if (order === "least-heard") {
    return available
      .sort((a, b) =>
        a.resting - b.resting
        || (Number(recordFor(a.item)?.listens) || 0) - (Number(recordFor(b.item)?.listens) || 0)
        || leads(a, b)
      )
      .map((entry) => entry.item);
  }

  // Reviews & struggles first. Inside the due bucket the most overdue leads,
  // because that is what "due" means and no second question changes it; the
  // other buckets are ordered by whatever was asked for.
  return available
    .sort((a, b) =>
      a.resting - b.resting
      || a.bucket - b.bucket
      || (a.bucket === 0
        ? overdueBy(recordFor(b.item), now) - overdueBy(recordFor(a.item), now)
        : leads(a, b))
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
