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
