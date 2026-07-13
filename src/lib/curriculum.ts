// The hand-defined curriculum: which packs exist, what order Continue
// Learning serves them in, and how common their content is.
//
// Everything here is hard-coded on purpose. Lessons draw ONLY from
// hand-written sentences (no generated carrier drills, no remote APIs), and
// the order below is the gate: Continue Learning serves the first pack that
// still has unlearned or due content, so tier-2 material only appears once
// every tier-1 pack is fully known, and tier-3 (niche/casual — always
// labelled) only after that.

export type PackTier = 1 | 2 | 3;

export type PackMeta = { tier: PackTier; note?: string };

/**
 * Continue-Learning order. Tier 1 = everyday core German every fluent
 * speaker uses daily; tier 2 = common but situational; tier 3 = niche,
 * regional, or very casual — every tier-3 item carries its pack note as a
 * chip so nobody mistakes it for neutral German.
 */
export const CURRICULUM_ORDER: string[] = [
  // ── Tier 1 · everyday core ──────────────────────────────────
  "cb-greetings",
  "cb-introductions",
  "part1",            // Starter basics
  "cb-smalltalk",
  "cb-numbers-time",
  "part2",            // Travel and daily tasks
  "cb-food",
  "part5",            // Food and cafe
  "cb-shopping",
  "cb-grocery",
  "cb-directions",
  "part6",            // Directions and movement
  "part3",            // Home and routine
  "cb-routine",
  "part7",            // People and family
  "cb-family",
  "cb-weather",
  "cb-reactions",
  "cb-plans",
  "part4",            // Plans and conversation
  "cb-health",
  "cb-emergencies",
  "cb-travel",
  // ── Tier 2 · common, situational ────────────────────────────
  "part8",            // Core verbs
  "part9",            // Home and daily errands
  "cb-housing",
  "cb-work",
  "part10",           // Work and study
  "cb-phone",
  "part15",           // Texting & chat shorthand
  "cb-hotel",
  "cb-opinions",
  "part11",           // Opinions and media
  "part12",           // Travel and problems
  "cb-hobbies",
  "cb-social",
  "cb-nightlife",
  "cb-dating",
  "part18",           // Dating, flirting & social
  // ── Tier 3 · niche / very casual — always labelled ──────────
  "cb-slang-friends",
  "part14",           // Everyday slang & youth talk
  "cb-denglish",
  "part16",           // Regional greetings & expressions
  "part17",           // Banter & friendly trash talk
  "part13",           // Gaming & FPS callouts
  "part19",           // Loadouts & gunsmith talk
  "part20",           // Flirting & intimacy (18+)
];

const TIER1 = new Set(CURRICULUM_ORDER.slice(0, CURRICULUM_ORDER.indexOf("part8")));
const TIER3_NOTES: Record<string, string> = {
  "cb-slang-friends": "Slang — close friends only",
  part14: "Youth slang — casual only",
  "cb-denglish": "Denglish — very casual",
  part16: "Regional — not used everywhere",
  part17: "Banter — close friends only",
  part13: "Gamer talk",
  part19: "Gamer talk",
  part20: "18+ · intimate",
};

/** Tier + note for a pack key. Tatoeba packs are extra practice at the very end. */
export function packMeta(partKey: string | undefined): PackMeta {
  const key = String(partKey ?? "");
  if (key.startsWith("tatoeba")) return { tier: 3, note: "Real-world sentence — extra practice" };
  if (TIER3_NOTES[key]) return { tier: 3, note: TIER3_NOTES[key] };
  if (TIER1.has(key)) return { tier: 1 };
  return { tier: 2 };
}

/**
 * Re-key a parts map into curriculum order: listed packs first in the order
 * above, then anything unlisted (tatoeba packs, future content) after,
 * levelled tatoeba packs sorted a1 -> a2 -> b1.
 */
export function orderParts<T>(parts: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const key of CURRICULUM_ORDER) {
    if (parts[key]) out[key] = parts[key];
  }
  const rest = Object.keys(parts).filter((k) => !(k in out));
  rest.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (const key of rest) out[key] = parts[key];
  return out;
}
