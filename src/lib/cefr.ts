/**
 * CEFR tiers as the learner sees them.
 *
 * The ability bands (easy/medium/hard/expert) fold C1 and C2 into one "expert"
 * step, which is right for scoring — the app cannot meaningfully tell them
 * apart when choosing what to teach next. It is wrong for a filter, where a
 * learner asking for C2 means C2 and not "the hardest thing you have".
 */
export type CefrTier = "a" | "b1" | "b2" | "c1" | "c2";

export const CEFR_TIERS: CefrTier[] = ["a", "b1", "b2", "c1", "c2"];

/**
 * Which tier a level label belongs to. Checked from the top down, because a
 * range like "B2-C1" should count as the higher end — it contains C1 material,
 * and a learner filtering for C1 wants to find it.
 */
export function cefrTier(level: string | undefined): CefrTier {
  const text = String(level ?? "");
  if (/C2/i.test(text)) return "c2";
  if (/C1/i.test(text)) return "c1";
  if (/B2/i.test(text)) return "b2";
  if (/B1/i.test(text)) return "b1";
  return "a";
}

export function cefrLabel(tier: CefrTier): string {
  switch (tier) {
    case "c2": return "C2";
    case "c1": return "C1";
    case "b2": return "B2";
    case "b1": return "B1";
    default: return "A1-A2";
  }
}

/**
 * The same ladder, one rung finer: A1 and A2 kept apart.
 *
 * A tier folds them together because a LESSON list is short and reads better
 * grouped — there are 18 packs at A1 against 175 at A2, and six headings over
 * that is more scaffolding than the list can carry. A word list is nine
 * thousand rows, where "show me the first hundred words" and "show me
 * everything before B1" are different questions, and only one of them a tier
 * can answer.
 *
 * Read from the top down like cefrTier, so a range counts as its higher end:
 * "A1-A2" is A2, because it teaches A2 material and a learner asking for A1
 * is asking for the very start.
 */
export type CefrStep = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export const CEFR_STEPS: CefrStep[] = ["a1", "a2", "b1", "b2", "c1", "c2"];

export function cefrStep(level: string | undefined): CefrStep {
  const text = String(level ?? "");
  if (/C2/i.test(text)) return "c2";
  if (/C1/i.test(text)) return "c1";
  if (/B2/i.test(text)) return "b2";
  if (/B1/i.test(text)) return "b1";
  if (/A2/i.test(text)) return "a2";
  return "a1";
}

export function cefrStepLabel(step: CefrStep): string {
  return step.toUpperCase();
}

/**
 * Sort key for a level label, so a lesson list reads A1, A1-A2, A2, A2-B1,
 * B1, B1-B2, B2 … rather than in whatever order the catalogue was built.
 *
 * Ordered by the LOW end first, then the high end: "A1-B2" is a beginner
 * lesson that happens to reach far, so it belongs with the A1s and not
 * between B1 and B2. That is the opposite of cefrTier, which deliberately
 * reads a range as its top end — a learner filtering for C1 wants "B2-C1"
 * in the results, but does not want it sorted among the C1s.
 *
 * Labels with no level at all ("all", missing) sort last: they apply
 * everywhere, so there is no rung to put them on.
 */
const CEFR_RANK: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

/**
 * A level label as a difficulty RUNG, 1 to 6.
 *
 * cefrOrder above answers "where does this sit in a sorted list of labels",
 * which is a finer question than anyone teaching needs: it keeps A1, A1-A2
 * and A1-B1 apart, and for choosing what to play next they are the same rung.
 * Six rungs is what wordLadderRung has always used, and this is that banding
 * pulled out so a sentence can be put on the same ladder as a word.
 *
 * A range reads as its LOW end, matching cefrOrder: "A1-B2" is a beginner
 * lesson that reaches far, not a B2 one. The exception is B2-C1, which gets a
 * rung of its own between them — the two ends are far enough apart that
 * folding it either way misplaces it.
 */
export function cefrRung(level: string | undefined): number {
  const text = String(level ?? "").toUpperCase();
  if (/^C/.test(text)) return 6;
  if (text.startsWith("B2-C")) return 5;
  if (text.startsWith("B2")) return 4;
  if (text.startsWith("B1")) return 3;
  if (text.startsWith("A1")) return 1;
  if (text.startsWith("A2")) return 2;
  // No level, or something unrecognised. Middle of the ladder rather than
  // either end: putting it first would push unlabelled material in front of
  // A1, and putting it last would hide it entirely.
  return 3;
}

/** What to call a rung on screen. Named for the band it actually covers. */
export function cefrRungLabel(rung: number): string {
  switch (rung) {
    case 1: return "A1";
    case 2: return "A2";
    case 3: return "B1";
    case 4: return "B2";
    case 5: return "B2–C1";
    default: return "C1–C2";
  }
}

export function cefrOrder(level: string | undefined): number {
  const found = String(level ?? "").toUpperCase().match(/[ABC][12]/g);
  if (!found?.length) return 99;
  const low = CEFR_RANK[found[0]] ?? 9;
  const high = CEFR_RANK[found[found.length - 1]] ?? low;
  // "B1+" is a shade above plain B1 and a shade below B1-B2.
  return low * 10 + high + (String(level).includes("+") ? 0.5 : 0);
}
