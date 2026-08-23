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

export function cefrOrder(level: string | undefined): number {
  const found = String(level ?? "").toUpperCase().match(/[ABC][12]/g);
  if (!found?.length) return 99;
  const low = CEFR_RANK[found[0]] ?? 9;
  const high = CEFR_RANK[found[found.length - 1]] ?? low;
  // "B1+" is a shade above plain B1 and a shade below B1-B2.
  return low * 10 + high + (String(level).includes("+") ? 0.5 : 0);
}
