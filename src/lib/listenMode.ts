import {
  gradeEntryForId,
  loadGradeStore,
  progressEntryForId,
  saveGradeStore,
  setCanonicalGradeRecord,
  statusForId,
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
import { primaryAnswer } from "@/lib/germanTextMatch";
import { buildCatalog } from "@/session";
import { buildWordCatalog, rankWordCatalog } from "@/lib/wordSession";
import { buildCorpusIndex, sentenceCommonality } from "@/lib/corpusFrequency";
import { conversationPriorityScore } from "@/lib/conversationPriority";
import { withoutMutedPacks } from "@/lib/mutedPacks";
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
const LOOP_ITEMS_KEY = "gl-listen-loop-items";
const LOOP_PASSES_KEY = "gl-listen-loop-passes";
const BACKGROUND_PLAYBACK_KEY = "gl-listen-background-playback-v1";
const PET_BILINGUAL_CAPTIONS_KEY = "gl-listen-pet-bilingual-captions-v1";
const CONTENT_SOURCE_KEY = "gl-listen-content-source";
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
export const DEFAULT_GERMAN_REPEATS = 2;
export const DEFAULT_ENGLISH_REPEATS = 1;
export const DEFAULT_LISTEN_LOOP_ITEMS = 3;
export const DEFAULT_LISTEN_LOOP_PASSES = 2;
export const DEFAULT_NEXT_CARD_DELAY_MS = 1_100;
export type ListenContentSource = "sentences" | "words" | "mixed";
export type ListenQueueOrder = "common" | "learning" | "least-heard";
export const DEFAULT_LISTEN_CONTENT_SOURCE: ListenContentSource = "mixed";
export const DEFAULT_LISTEN_QUEUE_ORDER: ListenQueueOrder = "common";
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
    if (value === "common" || value === "learning" || value === "least-heard") return value;
  } catch { /* storage blocked: use the documented default */ }
  return DEFAULT_LISTEN_QUEUE_ORDER;
}

export function setListenQueueOrder(
  order: ListenQueueOrder,
  direction: LearningDirection = getLearningDirection()
): ListenQueueOrder {
  const next = order === "learning" || order === "least-heard" ? order : "common";
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
  kind: "sentence" | "word";
  popularity: number;
};

export function formatListenPetCaption(
  item: Pick<ListenItem, "de" | "en">,
  spokenText: string,
  showBothLanguages: boolean
): string {
  if (!showBothLanguages) return spokenText;
  return `DE · ${item.de}\nEN · ${item.en}`;
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
  const sentences: ListenItem[] = rankedSentences
    .map(({ item }, index, ranked) => ({
      id: item.id,
      aliases: item.aliases ?? [],
      de: primaryAnswer(item.de),
      en: primaryAnswer(item.en),
      kind: "sentence" as const,
      // A percentile makes sentence and word popularity comparable in the
      // mixed queue even though their underlying scorers use different
      // scales. The authored conversation score still decides the sentence
      // rank before it is normalised.
      popularity: index / Math.max(1, ranked.length - 1),
    }));

  const rankedWords = content === "sentences" ? [] : rankWordCatalog(buildWordCatalog(parts), corpusIndex);
  const words: ListenItem[] = rankedWords
    .map((word, index, ranked) => ({
      id: word.id,
      aliases: [],
      de: primaryAnswer(word.de),
      en: primaryAnswer(word.en),
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
    const status = statusForId(grades, item.id, item.aliases);
    if (status === "known" && isDueForReview(record, now)) return 0;
    if (status === "struggle") return 1;
    if (status === "new") return 2;
    return 3;
  };

  const available = combined
    .map((item, index) => ({ item, index, bucket: bucketOf(item) }))
    .filter((entry) => entry.bucket >= 0);

  if (order === "common") return available.map((entry) => entry.item);

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

/**
 * Record a listen-mode grade. See the module comment for why every branch
 * is deliberately weaker than its guided-session counterpart.
 */
export function recordListenGrade(
  item: Pick<ListenItem, "id" | "aliases">,
  grade: ListenGrade,
  profile: UserProfile | null = getAuthUser(),
  now = Date.now()
): void {
  const store = loadGradeStore(profile);
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
): void {
  const store = loadGradeStore(profile);
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
