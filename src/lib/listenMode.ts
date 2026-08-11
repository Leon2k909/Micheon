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
import { getLessonContent } from "@/lib/lessonContent";
import { primaryAnswer } from "@/lib/germanTextMatch";
import { buildCatalog } from "@/session";
import { buildWordCatalog, rankWordCatalog } from "@/lib/wordSession";
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
const BACKGROUND_PLAYBACK_KEY = "gl-listen-background-playback-v1";
const CURRENT_ITEM_KEY = "gl-listen-current-item-v1";
const MAX_LANGUAGE_REPEATS = 10;
const MAX_NEXT_CARD_DELAY_MS = 30_000;
export const DEFAULT_GERMAN_REPEATS = 2;
export const DEFAULT_ENGLISH_REPEATS = 1;
export const DEFAULT_NEXT_CARD_DELAY_MS = 1_100;
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

export function getListenNextCardDelayMs(): number {
  return readIntegerSetting(NEXT_CARD_DELAY_KEY, DEFAULT_NEXT_CARD_DELAY_MS, 0, MAX_NEXT_CARD_DELAY_MS);
}

export function setListenNextCardDelayMs(delayMs: number): number {
  return storeIntegerSetting(NEXT_CARD_DELAY_KEY, delayMs, 0, MAX_NEXT_CARD_DELAY_MS);
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

function currentItemStorageKey(direction: LearningDirection): string {
  // Sentence, word, and mixed queues contain different ids. Keeping one
  // cursor per mode means changing the Continue Learning dropdown and coming
  // back never loses the learner's place in either queue.
  return `${CURRENT_ITEM_KEY}:${direction}:${getLessonContent()}`;
}

export function getListenCurrentItemId(
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): string {
  const value = loadScopedJson<unknown>(currentItemStorageKey(direction), "", profile);
  return typeof value === "string" ? value : "";
}

export function setListenCurrentItemId(
  itemId: string,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): string {
  const next = typeof itemId === "string" ? itemId.slice(0, 240) : "";
  saveScopedJson(currentItemStorageKey(direction), next, profile);
  return next;
}

export type ListenItem = {
  id: string;
  aliases: string[];
  de: string;
  en: string;
  kind: "sentence" | "word";
};

/**
 * The full listening queue, ordered like a session would prioritise it:
 * due reviews first (most overdue leading), then struggles, then new
 * material in course order, then everything known — least recently
 * listened-to first, so long passive sessions rotate rather than loop the
 * same openers. Snoozed items stay out, exactly as they do in lessons.
 */
export function buildListenQueue(
  apiParts: Record<string, any>,
  grades: GradeStore,
  now = Date.now()
): ListenItem[] {
  const parts = withoutMutedPacks(apiParts);
  const content = getLessonContent();

  // primaryAnswer on both sides: answer keys list alternatives behind " / "
  // for the matcher's benefit, but a listening card shows (and the voice
  // speaks) one clean form, not the whole key.
  const sentences: ListenItem[] = content === "words" ? [] : buildCatalog(parts)
    .map((item) => ({
      id: item.id,
      aliases: item.aliases ?? [],
      de: primaryAnswer(item.de),
      en: primaryAnswer(item.en),
      kind: "sentence" as const,
    }));

  const words: ListenItem[] = content === "sentences" ? [] : rankWordCatalog(buildWordCatalog(parts), null)
    .map((word) => ({
      id: word.id,
      aliases: [],
      de: primaryAnswer(word.de),
      en: primaryAnswer(word.en),
      kind: "word" as const,
    }));

  // "Both": words woven in at a light cadence (1 word per 4 sentences)
  // rather than concatenated, so a mixed queue actually mixes.
  let combined: ListenItem[];
  if (sentences.length && words.length) {
    combined = [];
    let w = 0;
    sentences.forEach((sentence, index) => {
      combined.push(sentence);
      if ((index + 1) % 4 === 0 && w < words.length) combined.push(words[w++]);
    });
    combined.push(...words.slice(w));
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

  return combined
    .map((item, index) => ({ item, index, bucket: bucketOf(item) }))
    .filter((entry) => entry.bucket >= 0)
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
