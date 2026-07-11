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
    lastGrade: "know",
    updatedAt: new Date(now).toISOString(),
    successes,
    intervalDays,
    dueAt: new Date(now + intervalDays * DAY_MS).toISOString(),
  };
}

/** A struggle: ladder resets — strength is rebuilt from the bottom. */
export function recordStruggle(now = Date.now()): GradeRecord {
  return {
    lastGrade: "struggle",
    updatedAt: new Date(now).toISOString(),
    successes: 0,
    intervalDays: 0,
  };
}

/**
 * Manual override: jump straight to a ladder rung (0-5) instead of climbing
 * one success at a time. Lets the learner correct the tracker directly —
 * "I already know this cold" or "I don't actually remember this" — without
 * replaying it in a lesson first. level 0 clears the item back to New.
 */
export function setStrengthLevel(level: number, now = Date.now()): GradeRecord | null {
  const clamped = Math.max(0, Math.min(REVIEW_INTERVALS_DAYS.length, Math.round(level)));
  if (clamped === 0) return null; // caller should delete the record entirely
  const intervalDays = REVIEW_INTERVALS_DAYS[clamped - 1];
  return {
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
export function recordPermanent(now = Date.now()): GradeRecord {
  return {
    lastGrade: "know",
    updatedAt: new Date(now).toISOString(),
    successes: REVIEW_INTERVALS_DAYS.length + 1,
    intervalDays: Infinity,
    permanent: true,
  };
}

/** True when a known item's scheduled review has arrived. Permanent items are never due. */
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
