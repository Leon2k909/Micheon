import { loadScopedJson, getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { getMasteredCount } from "@/lib/mastery";

// The per-item review/completion state (COMPLETED_KEY in german_learning_lab):
// id -> { lastGrade, ... }. An item graded "know" is something the learner has
// actually recalled successfully. May also be stored as a plain array of ids.
const REVIEW_KEY = "session-completed";

export type FluencyStage = { label: string; min: number; blurb: string };

/**
 * Honest ability milestones, keyed to the number of DISTINCT items a learner
 * has actually learned in the app (review "know" records + words mastered in
 * games + self-tracked external words) — not XP. The thresholds are calibrated
 * so the named ability roughly matches what that much active vocabulary unlocks
 * in real conversation. This is an estimate, and it never claims "100% fluent"
 * from a practice counter.
 */
export const FLUENCY_STAGES: FluencyStage[] = [
  { label: "Starting out", min: 0, blurb: "Building your very first words and phrases." },
  { label: "Basics", min: 150, blurb: "Greetings, essentials, and simple needs." },
  { label: "Everyday survival", min: 500, blurb: "Getting by in shops, directions, and small talk." },
  { label: "Conversational", min: 1200, blurb: "Following and joining everyday conversations." },
  { label: "Confident", min: 2500, blurb: "Understanding most speech and giving opinions freely." },
  { label: "Fluent", min: 5000, blurb: "Keeping up with real natives at full speed." },
];

export const FLUENT_TARGET = FLUENCY_STAGES[FLUENCY_STAGES.length - 1].min;

/** Distinct things the learner actually knows, across lessons, games and external tracking. */
export function countKnownVocab(user: UserProfile | null = getAuthUser(), externalWords = 0): number {
  let known = 0;
  try {
    const raw = loadScopedJson<any>(REVIEW_KEY, {}, user);
    if (Array.isArray(raw)) {
      known = raw.length; // legacy: a plain list of completed ids (all "known")
    } else if (raw && typeof raw === "object") {
      for (const rec of Object.values(raw)) if ((rec as any)?.lastGrade === "know") known += 1;
    }
  } catch {
    /* ignore */
  }
  return known + getMasteredCount() + Math.max(0, externalWords || 0);
}

export function getFluency(vocab: number) {
  const v = Math.max(0, Math.floor(vocab || 0));
  let i = 0;
  for (let k = 0; k < FLUENCY_STAGES.length; k += 1) if (v >= FLUENCY_STAGES[k].min) i = k;
  const cur = FLUENCY_STAGES[i];
  const next = FLUENCY_STAGES[i + 1] ?? null;
  const toNext = next ? Math.max(0, next.min - v) : 0;
  const span = next ? next.min - cur.min : 1;
  const pctToNext = next ? Math.max(0, Math.min(100, Math.round(((v - cur.min) / span) * 100))) : 100;
  const overallPct = Math.min(100, Math.round((v / FLUENT_TARGET) * 100));
  return { vocab: v, cur, next, toNext, pctToNext, overallPct, index: i, total: FLUENCY_STAGES.length };
}
