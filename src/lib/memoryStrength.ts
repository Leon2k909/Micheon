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
};

/** Leitner-style ladder: days until the next review after N consecutive successes. */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30, 90];

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

/** A struggle: ladder resets — strength is rebuilt from the bottom. */
export function recordStruggle(now = Date.now()): GradeRecord {
  return {
    lastGrade: "struggle",
    updatedAt: new Date(now).toISOString(),
    successes: 0,
    intervalDays: 0,
  };
}

/** True when a known item's scheduled review has arrived. */
export function isDueForReview(record: GradeRecord | undefined, now = Date.now()): boolean {
  if (!record || record.lastGrade !== "know") return false;
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
};

const STRENGTH_LABELS = ["New", "Learning", "Familiar", "Strong", "Solid", "Mastered"];

/** Display info for the tracker: ladder level, label, and review timing. */
export function strengthInfo(record: GradeRecord | undefined, now = Date.now()): StrengthInfo {
  if (!record || (record.lastGrade !== "know" && record.lastGrade !== "struggle")) {
    return { level: 0, label: STRENGTH_LABELS[0], dueInDays: null, due: false };
  }
  if (record.lastGrade === "struggle") {
    return { level: 0, label: "Struggling", dueInDays: null, due: false };
  }
  const { successes, dueAtMs } = normalize(record);
  const level = Math.min(successes, STRENGTH_LABELS.length - 1);
  const dueInDays = dueAtMs == null ? null : Math.ceil((dueAtMs - now) / DAY_MS);
  return {
    level,
    label: STRENGTH_LABELS[level],
    dueInDays,
    due: dueAtMs != null && now >= dueAtMs,
  };
}
