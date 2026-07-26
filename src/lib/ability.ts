import type { GradeStore } from "@/lib/activity";

/**
 * A personal read on how strong a learner is, used to decide what "Continue
 * learning" reaches for first.
 *
 * The important constraint: this only ever changes the ORDER in which packs are
 * served, never which packs exist. A strong learner gets the harder material
 * sooner; the easier packs stay in the queue and are served once the harder ones
 * run out. Nothing in the language can be skipped by being good at it.
 */

export type AbilityBand = "easy" | "medium" | "hard" | "expert";

export type Ability = {
  /** 0-1. Blends how much has been graded, how much stuck, and how deeply. */
  score: number;
  band: AbilityBand;
  /** Items with any grade at all — the confidence behind the score. */
  graded: number;
  knownRatio: number;
  /** True until there is enough history to judge; the band stays "easy". */
  provisional: boolean;
};

/**
 * Below this many graded items the score is not trusted. A learner who gets
 * their first six answers right is not a C1 candidate, and promoting them there
 * would bury the basics they have not met yet.
 */
export const ABILITY_MIN_GRADED = 40;

/** Interval at which an item counts as fully mastered for scoring purposes. */
const STRONG_INTERVAL_DAYS = 30;

export function computeAbility(grades: GradeStore): Ability {
  const records = Object.values(grades ?? {}).filter((record) => record?.lastGrade);
  const graded = records.length;
  if (!graded) {
    return { score: 0, band: "easy", graded: 0, knownRatio: 0, provisional: true };
  }

  const known = records.filter((record) => record.lastGrade === "know").length;
  const knownRatio = known / graded;

  // How deeply the known items have stuck. Clicking "Know it" once is weaker
  // evidence than an item that has survived to a 30-day interval, so depth is
  // scored separately from the raw hit rate.
  const depth = records.reduce((total, record) => {
    if (record.lastGrade !== "know") return total;
    const interval = Math.max(1, Number(record.intervalDays) || 1);
    return total + Math.min(1, interval / STRONG_INTERVAL_DAYS);
  }, 0) / graded;

  // Volume matters on its own: 500 graded items at 80% is a stronger signal
  // than 50 at 80%. Saturates so a long-time user is not pushed past expert.
  const volume = Math.min(1, graded / 600);

  const score = Math.max(0, Math.min(1, knownRatio * 0.5 + depth * 0.35 + volume * 0.15));
  const provisional = graded < ABILITY_MIN_GRADED;

  return {
    score,
    band: provisional ? "easy" : bandForScore(score),
    graded,
    knownRatio,
    provisional,
  };
}

export function bandForScore(score: number): AbilityBand {
  if (score >= 0.78) return "expert";
  if (score >= 0.58) return "hard";
  if (score >= 0.34) return "medium";
  return "easy";
}

const BAND_ORDER: AbilityBand[] = ["easy", "medium", "hard", "expert"];

/** Which band a pack's CEFR label belongs to. */
export function bandForLevel(level: string | undefined): AbilityBand {
  const text = String(level ?? "");
  if (/C[12]/i.test(text)) return "expert";
  if (/B2/i.test(text)) return "hard";
  if (/B1/i.test(text)) return "medium";
  return "easy";
}

/**
 * How well a pack suits this learner. Lower sorts first.
 *
 * Overshooting is penalised harder than undershooting: serving a beginner C1
 * material is a worse mistake than serving a strong learner something easy,
 * which merely feels quick.
 */
export function packAffinity(ability: AbilityBand, level: string | undefined): number {
  const want = BAND_ORDER.indexOf(ability);
  const has = BAND_ORDER.indexOf(bandForLevel(level));
  const gap = has - want;
  return gap >= 0 ? gap * 2 : -gap;
}

/** Short, honest description of what the app is doing, for the UI. */
export function abilityLabel(ability: Ability): string {
  if (ability.provisional) return "Still learning what suits you";
  switch (ability.band) {
    case "expert": return "Serving your hardest material first";
    case "hard": return "Serving harder material first";
    case "medium": return "Stepping up the difficulty";
    default: return "Building the basics first";
  }
}
