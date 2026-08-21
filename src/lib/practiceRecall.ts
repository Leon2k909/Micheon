import {
  getAuthUser,
  loadScopedJson,
  saveScopedJson,
  type UserProfile,
} from "@/lib/profileStorage";

export const PRACTICE_RECALL_KEY = "gl-practice-recall-v1";

/**
 * How long a phrase waits before the practice card asks it again.
 *
 * Michelle set these: "wenn man sie richtig hat die jeweilige frage erst
 * wieder nach so 30 fragen", "wenn man sie falsch hat das sie immer mal wieder
 * alle paar fragen kommt bis man sie richtig hat", and — once it is finally
 * right — "soll auch die immer mal wieder vorkommen".
 *
 * So a miss comes back in three questions and keeps coming back until it is
 * answered correctly; the answer that fixes it returns sooner than an
 * untroubled one, because getting something right once directly after getting
 * it wrong proves very little; and everything keeps circulating, because the
 * gap stops growing at PRACTICE_MAX_GAP rather than retiring the phrase.
 */
export const PRACTICE_WRONG_GAP = 3;
export const PRACTICE_RECOVERY_GAP = 12;
export const PRACTICE_RIGHT_GAPS = [30, 45, 70, 100] as const;
export const PRACTICE_MAX_GAP = 120;

/**
 * Entries are only written for phrases that have actually been asked, and the
 * catalogue holds thousands, so this is a cap on a list that grows one
 * question at a time. Well-known phrases are dropped first: an entry with
 * successes and no misses is the one whose loss costs least.
 */
const MAX_TRACKED_ITEMS = 600;

export type PracticeRecallEntry = {
  /** Question number this phrase is allowed to come back at. */
  dueQuestion: number;
  itemId: string;
  lastAskedQuestion: number;
  /** Wrong answers since the last right one. Zero once it is fixed. */
  misses: number;
  successes: number;
  updatedAt: number;
};

export type PracticeRecallState = {
  entries: PracticeRecallEntry[];
  /** How many questions this profile has been asked, ever. */
  questionCount: number;
};

export function createPracticeRecallState(): PracticeRecallState {
  return { entries: [], questionCount: 0 };
}

function nonNegativeInteger(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.trunc(number) : fallback;
}

export function normalizePracticeRecallState(value: unknown): PracticeRecallState {
  if (!value || typeof value !== "object") return createPracticeRecallState();
  const raw = value as Partial<PracticeRecallState>;
  const questionCount = nonNegativeInteger(raw.questionCount);
  const seen = new Set<string>();
  const entries = Array.isArray(raw.entries)
    ? raw.entries.flatMap((candidate) => {
      if (!candidate || typeof candidate !== "object") return [];
      const entry = candidate as Partial<PracticeRecallEntry>;
      const itemId = typeof entry.itemId === "string" ? entry.itemId.trim() : "";
      if (!itemId || seen.has(itemId)) return [];
      seen.add(itemId);
      const lastAskedQuestion = nonNegativeInteger(entry.lastAskedQuestion);
      return [{
        dueQuestion: nonNegativeInteger(entry.dueQuestion, lastAskedQuestion),
        itemId,
        lastAskedQuestion,
        misses: nonNegativeInteger(entry.misses),
        successes: nonNegativeInteger(entry.successes),
        updatedAt: nonNegativeInteger(entry.updatedAt),
      }];
    })
    : [];
  return { entries, questionCount };
}

/** The gap a right answer earns, given how well the phrase is known. */
export function practiceRightGap(successes: number, hadMisses: boolean) {
  if (hadMisses) return PRACTICE_RECOVERY_GAP;
  const index = Math.min(Math.max(0, successes - 1), PRACTICE_RIGHT_GAPS.length - 1);
  return Math.min(PRACTICE_MAX_GAP, PRACTICE_RIGHT_GAPS[index]);
}

function trimEntries(entries: PracticeRecallEntry[]): PracticeRecallEntry[] {
  if (entries.length <= MAX_TRACKED_ITEMS) return entries;
  // Keep everything still being worked on; among the settled ones, keep the
  // most recently seen.
  const struggling = entries.filter((entry) => entry.misses > 0);
  const settled = entries
    .filter((entry) => entry.misses === 0)
    .sort((a, b) => b.lastAskedQuestion - a.lastAskedQuestion);
  return [...struggling, ...settled].slice(0, MAX_TRACKED_ITEMS);
}

/**
 * Record that a phrase was asked, and answered.
 *
 * The FIRST answer is the one that counts. Clicking around after that teaches
 * the card nothing about whether the phrase is known, and letting a second
 * click overwrite a miss would hand a clean bill of health to exactly the
 * phrase that needs asking again.
 */
export function applyPracticeAnswer(
  state: PracticeRecallState,
  itemId: string,
  correct: boolean,
  now = Date.now()
): PracticeRecallState {
  const trimmed = typeof itemId === "string" ? itemId.trim() : "";
  if (!trimmed) return state;
  const questionCount = state.questionCount + 1;
  const previous = state.entries.find((entry) => entry.itemId === trimmed);
  const successes = correct ? (previous?.successes ?? 0) + 1 : (previous?.successes ?? 0);
  const misses = correct ? 0 : (previous?.misses ?? 0) + 1;
  const gap = correct
    ? practiceRightGap(successes, (previous?.misses ?? 0) > 0)
    : PRACTICE_WRONG_GAP;
  const entry: PracticeRecallEntry = {
    dueQuestion: questionCount + gap,
    itemId: trimmed,
    lastAskedQuestion: questionCount,
    misses,
    successes,
    updatedAt: now,
  };
  const entries = trimEntries([
    entry,
    ...state.entries.filter((candidate) => candidate.itemId !== trimmed),
  ]);
  return { entries, questionCount };
}

export type PracticeCandidate = { id: string };

/**
 * Which phrase to ask next.
 *
 * In order: something already got wrong and now due, then something never
 * asked, then a due repeat, and only if none of those exist the phrase that
 * has waited longest. Never the phrase just answered — being asked the same
 * thing twice in a row reads as the app being stuck rather than as revision.
 */
export function selectPracticeItem<T extends PracticeCandidate>(
  state: PracticeRecallState,
  candidates: readonly T[],
  justAskedId?: string,
  random: () => number = Math.random
): T | undefined {
  const pool = candidates.filter((candidate) => candidate?.id && candidate.id !== justAskedId);
  if (pool.length === 0) return candidates.find((candidate) => Boolean(candidate?.id));

  const byId = new Map(state.entries.map((entry) => [entry.itemId, entry]));
  const due = (entry: PracticeRecallEntry) => entry.dueQuestion <= state.questionCount;

  const struggling = pool.filter((candidate) => {
    const entry = byId.get(candidate.id);
    return entry && entry.misses > 0 && due(entry);
  });
  if (struggling.length > 0) {
    // The one waiting longest, so a second miss cannot jump the queue ahead of
    // the first.
    return struggling.reduce((worst, candidate) => {
      const a = byId.get(candidate.id)!;
      const b = byId.get(worst.id)!;
      return a.dueQuestion < b.dueQuestion ? candidate : worst;
    });
  }

  const fresh = pool.filter((candidate) => !byId.has(candidate.id));
  if (fresh.length > 0) return fresh[Math.floor(random() * fresh.length) % fresh.length];

  const repeats = pool.filter((candidate) => {
    const entry = byId.get(candidate.id);
    return entry && due(entry);
  });
  if (repeats.length > 0) {
    return repeats[Math.floor(random() * repeats.length) % repeats.length];
  }

  // Nothing is due yet — ask whatever has been waiting longest rather than
  // showing an empty card.
  return pool.reduce((oldest, candidate) => {
    const a = byId.get(candidate.id)?.lastAskedQuestion ?? 0;
    const b = byId.get(oldest.id)?.lastAskedQuestion ?? 0;
    return a < b ? candidate : oldest;
  });
}

export function loadPracticeRecallState(
  profile: UserProfile | null = getAuthUser()
): PracticeRecallState {
  return normalizePracticeRecallState(
    loadScopedJson<PracticeRecallState>(PRACTICE_RECALL_KEY, createPracticeRecallState(), profile)
  );
}

export function savePracticeRecallState(
  state: PracticeRecallState,
  profile: UserProfile | null = getAuthUser()
) {
  saveScopedJson(PRACTICE_RECALL_KEY, state, profile);
}
