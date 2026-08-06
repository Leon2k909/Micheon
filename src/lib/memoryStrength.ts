// Spaced-repetition memory strength for every learnable item.
//
// Each successful recall moves an item one rung up the review ladder; the
// item is considered "known" only until its review comes due, then it
// re-enters lessons as a review. A struggle resets the ladder, so strength
// reflects how reliably the learner recalls the item OVER TIME, not whether
// they got it right once.

export type GradeRecord = {
  lastGrade?: string;
  updatedAt?: string;
  /** consecutive successful recalls (resets on struggle) */
  successes?: number;
  /** current review interval in days */
  intervalDays?: number;
  /** when this item should come back for review */
  dueAt?: string;
  /** never schedule a review again — the tier above Mastered */
  permanent?: boolean;
  /** last extra practice rep; does not move the spaced-review ladder */
  reinforcedAt?: string;
  /** answer checks accumulated across completed/abandoned sentence routes */
  answerAttempts?: number;
  /** incorrect answer checks accumulated across sentence routes */
  answerMistakes?: number;
  /** recent difficulty signal; rises on mistakes and fades through clean reps */
  difficultyDebt?: number;
  lastMistakeAt?: string;
  lastAnswerAt?: string;
};

/**
 * Leitner-style ladder: days until the next review after N consecutive
 * successes. One rung per named strength tier (Learning..Mastered — see
 * STRENGTH_LABELS below), so a word you've truly nailed five times running
 * isn't re-tested again for half a year — genuinely knowing something means
 * it takes a long time to forget it.
 */
export const REVIEW_INTERVALS_DAYS = [1, 3, 10, 30, 180];

/** Reviews mixed into a single session are capped so due backlogs never flood a lesson. */
export const REVIEWS_PER_SESSION = 6;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Legacy records (know, but no ladder fields) count as one success on a 7-day interval. */
function normalize(record: GradeRecord | undefined): Required<Pick<GradeRecord, "successes" | "intervalDays">> & { dueAtMs: number | null } {
  if (!record) return { successes: 0, intervalDays: 0, dueAtMs: null };
  const successes = record.successes ?? (record.lastGrade === "know" ? 1 : 0);
  const intervalDays = record.intervalDays ?? (record.lastGrade === "know" ? 7 : 0);
  let dueAtMs: number | null = record.dueAt ? Date.parse(record.dueAt) : null;
  if (dueAtMs == null && record.lastGrade === "know") {
    const base = record.updatedAt ? Date.parse(record.updatedAt) : Date.now();
    dueAtMs = (Number.isFinite(base) ? base : Date.now()) + intervalDays * DAY_MS;
  }
  return { successes, intervalDays, dueAtMs: Number.isFinite(dueAtMs as number) ? dueAtMs : null };
}

/** A successful recall: one rung up the ladder, next review scheduled. */
export function recordSuccess(prior: GradeRecord | undefined, now = Date.now()): GradeRecord {
  const successes = (prior?.lastGrade === "struggle" ? 0 : normalize(prior).successes) + 1;
  const intervalDays = REVIEW_INTERVALS_DAYS[Math.min(successes - 1, REVIEW_INTERVALS_DAYS.length - 1)];
  return {
    ...prior,
    permanent: false,
    lastGrade: "know",
    updatedAt: new Date(now).toISOString(),
    successes,
    intervalDays,
    dueAt: new Date(now + intervalDays * DAY_MS).toISOString(),
  };
}

/**
 * Rung a learner explicitly DECLARES known — the "Know it" button, which
 * skips the exercise outright rather than testing recall. That's a stronger
 * claim than one successful drill rep ("I already know this coming in", not
 * "I just got it right once"), so it jumps straight to the second-highest
 * rung instead of climbing one step at a time. A second confirmation later
 * (it resurfaces for review and you still know it) completes the climb to
 * Mastered — preserving the core SRS idea that lasting memory needs more
 * than one success, just letting a genuine "I know this" skip most of the
 * climb instead of starting from scratch like a brand-new word would.
 */
export function recordDeclaredKnown(prior: GradeRecord | undefined, now = Date.now()): GradeRecord {
  const priorSuccesses = prior?.lastGrade === "struggle" ? 0 : normalize(prior).successes;
  const nearMastered = REVIEW_INTERVALS_DAYS.length - 1; // one rung below the top
  const successes = priorSuccesses >= nearMastered ? priorSuccesses + 1 : nearMastered;
  const intervalDays = REVIEW_INTERVALS_DAYS[Math.min(successes - 1, REVIEW_INTERVALS_DAYS.length - 1)];
  return {
    ...prior,
    permanent: false,
    lastGrade: "know",
    updatedAt: new Date(now).toISOString(),
    successes,
    intervalDays,
    dueAt: new Date(now + intervalDays * DAY_MS).toISOString(),
  };
}

/** A struggle: ladder resets — strength is rebuilt from the bottom. */
export function recordStruggle(now = Date.now(), prior?: GradeRecord): GradeRecord {
  return {
    ...prior,
    permanent: false,
    dueAt: undefined,
    reinforcedAt: undefined,
    lastGrade: "struggle",
    updatedAt: new Date(now).toISOString(),
    successes: 0,
    intervalDays: 0,
  };
}

/**
 * Remember that a weak phrase received an extra same-day practice rep without
 * pretending its scheduled recall happened early. Keeping this timestamp
 * separate from `updatedAt` lets Continue Learning rotate its familiar half
 * while leaving successes, interval and due date untouched.
 */
export function recordReinforcement(prior: GradeRecord, now = Date.now()): GradeRecord {
  return {
    ...prior,
    reinforcedAt: new Date(now).toISOString(),
  };
}

/**
 * Manual override: jump straight to a ladder rung (0-5) instead of climbing
 * one success at a time. Lets the learner correct the tracker directly —
 * "I already know this cold" or "I don't actually remember this" — without
 * replaying it in a lesson first. level 0 clears the item back to New.
 */
export function setStrengthLevel(level: number, now = Date.now(), prior?: GradeRecord): GradeRecord | null {
  const clamped = Math.max(0, Math.min(REVIEW_INTERVALS_DAYS.length, Math.round(level)));
  if (clamped === 0) return null; // caller should delete the record entirely
  const intervalDays = REVIEW_INTERVALS_DAYS[clamped - 1];
  return {
    ...prior,
    permanent: false,
    lastGrade: "know",
    updatedAt: new Date(now).toISOString(),
    successes: clamped,
    intervalDays,
    dueAt: new Date(now + intervalDays * DAY_MS).toISOString(),
  };
}

/**
 * Above Mastered: for words so easy they should never come back at all — a
 * deliberate "I will never forget this" call, distinct from the timed ladder.
 */
export function recordPermanent(now = Date.now(), prior?: GradeRecord): GradeRecord {
  return {
    ...prior,
    lastGrade: "know",
    updatedAt: new Date(now).toISOString(),
    successes: REVIEW_INTERVALS_DAYS.length + 1,
    intervalDays: Infinity,
    permanent: true,
  };
}

/** True when a known item's scheduled review has arrived. Permanent items are never due. */
/**
 * How much of an item you can still be assumed to recall, 0-1.
 *
 * A word learned once and never seen again is not worth the same as one
 * reviewed last week, but the progress numbers counted both as a whole word
 * for ever — so the totals only ever went up, which is not how memory works.
 * On a real profile half of everything counted as "known" was more than a
 * week past its review date and still counted at full value.
 *
 * The curve:
 *  - inside its interval, an item is worth its full 1.0;
 *  - past due it decays by halves, at a pace set by the interval it had
 *    earned — a word on the 180-day rung fades far more slowly than one on
 *    the 1-day rung, which is the whole point of the ladder;
 *  - it never reaches zero. Forgetting is not deletion: relearning something
 *    you once knew is much faster than meeting it new, and the floor rises
 *    with how many times you have recalled it.
 *
 * Permanent items are exempt by definition, and legacy records with no
 * schedule stay whole rather than being punished for missing data.
 */
export function recallWeight(record: GradeRecord | undefined, now = Date.now()): number {
  if (!record || record.lastGrade !== "know") return 0;
  if (record.permanent) return 1;
  const { successes, intervalDays, dueAtMs } = normalize(record);
  if (dueAtMs == null) return 1;
  const overdueDays = (now - dueAtMs) / DAY_MS;
  if (overdueDays <= 0) return 1;
  const floor = Math.min(0.8, 0.42 + 0.08 * Math.max(0, successes));
  const halfLife = Math.max(14, Math.max(1, intervalDays) * 1.5);
  return floor + (1 - floor) * Math.pow(0.5, overdueDays / halfLife);
}

export type RecallDetail = {
  /** how much of the item still counts, 0-1 */
  weight: number;
  /** worth less than a whole item, and not exempt */
  fading: boolean;
  /** days past the scheduled review; 0 when it is not overdue yet */
  overdueDays: number;
  /** days it takes to lose half the distance to the floor */
  halfLifeDays: number;
  /** the lowest this item can ever fall to */
  floor: number;
  /** why it cannot fade, when it cannot */
  exempt: "permanent" | "unscheduled" | null;
};

/**
 * The same curve as recallWeight, with its workings exposed.
 *
 * Any number the app shows a learner should be one they can interrogate — the
 * tracker uses this to say, per item, how much it is currently worth, how far
 * past its review it is, and how far it could ever fall. A total that quietly
 * drops with no way to see why is worse than one that never drops at all.
 */
export function recallDetail(record: GradeRecord | undefined, now = Date.now()): RecallDetail {
  const bare = { weight: 0, fading: false, overdueDays: 0, halfLifeDays: 0, floor: 0, exempt: null } as RecallDetail;
  if (!record || record.lastGrade !== "know") return bare;
  if (record.permanent) return { ...bare, weight: 1, exempt: "permanent" };
  const { successes, intervalDays, dueAtMs } = normalize(record);
  if (dueAtMs == null) return { ...bare, weight: 1, exempt: "unscheduled" };
  const floor = Math.min(0.8, 0.42 + 0.08 * Math.max(0, successes));
  const halfLifeDays = Math.max(14, Math.max(1, intervalDays) * 1.5);
  const overdueDays = Math.max(0, (now - dueAtMs) / DAY_MS);
  const weight = recallWeight(record, now);
  return { weight, fading: weight < 1, overdueDays, halfLifeDays, floor, exempt: null };
}

export function isDueForReview(record: GradeRecord | undefined, now = Date.now()): boolean {
  if (!record || record.lastGrade !== "know" || record.permanent) return false;
  const { dueAtMs } = normalize(record);
  return dueAtMs != null && now >= dueAtMs;
}

/** How overdue (ms) — used to prioritise the most-forgotten items first. */
export function overdueBy(record: GradeRecord | undefined, now = Date.now()): number {
  const { dueAtMs } = normalize(record);
  return dueAtMs == null ? 0 : now - dueAtMs;
}

export type StrengthInfo = {
  /** 0..5 rungs on the ladder */
  level: number;
  label: string;
  /** days until the next review; negative = overdue */
  dueInDays: number | null;
  due: boolean;
  /** never reviewed again — the tier above Mastered */
  permanent: boolean;
};

const STRENGTH_LABELS = ["New", "Learning", "Familiar", "Strong", "Solid", "Mastered"];

/** Display info for the tracker: ladder level, label, and review timing. */
export function strengthInfo(record: GradeRecord | undefined, now = Date.now()): StrengthInfo {
  if (!record || (record.lastGrade !== "know" && record.lastGrade !== "struggle")) {
    return { level: 0, label: STRENGTH_LABELS[0], dueInDays: null, due: false, permanent: false };
  }
  if (record.lastGrade === "struggle") {
    // Rung 1, not 0: a struggling word has actually been attempted and
    // reset to the bottom of the ladder — it shouldn't look visually
    // identical to a word that's never been seen at all.
    return { level: 1, label: "Struggling", dueInDays: null, due: false, permanent: false };
  }
  if (record.permanent) {
    return { level: STRENGTH_LABELS.length - 1, label: "Permanent", dueInDays: null, due: false, permanent: true };
  }
  const { successes, dueAtMs } = normalize(record);
  const level = Math.min(successes, STRENGTH_LABELS.length - 1);
  const dueInDays = dueAtMs == null ? null : Math.ceil((dueAtMs - now) / DAY_MS);
  return {
    level,
    label: STRENGTH_LABELS[level],
    permanent: false,
    dueInDays,
    due: dueAtMs != null && now >= dueAtMs,
  };
}
