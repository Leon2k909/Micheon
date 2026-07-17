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
  "part57",           // Talking about learning German (& other skills)
  "cb-smalltalk",
  "cb-numbers-time",
  "cb-letters-numbers",
  "part2",            // Travel and daily tasks
  "cb-food",
  "part49",           // Cooking at home & food culture
  "part5",            // Food and cafe
  "cb-diet-allergies",
  "cb-shopping",
  "cb-grocery",
  "cb-money",
  "cb-money-woes",
  "cb-directions",
  "part6",            // Directions and movement
  "part3",            // Home and routine
  "cb-routine",
  "part7",            // People and family
  "cb-family",
  "cb-weather",
  "cb-reactions",
  "cb-shortreplies",
  "cb-connectors",
  "cb-celebrations",
  "cb-plans",
  "part4",            // Plans and conversation
  "cb-health",
  "cb-emergencies",
  "cb-travel",
  // ── Tier 2 · common, situational ────────────────────────────
  "part8",            // Core verbs
  "part9",            // Home and daily errands
  "cb-housing",
  "cb-gardening-plants",
  "cb-apartment-repairs",
  "cb-amt",
  "part51",           // Getting help: hotlines, bank & repairs
  "cb-medical-bureaucracy",
  "cb-post-packages",
  "cb-german-rules",
  "cb-finance-insurance",
  "cb-work",
  "cb-salary-negotiations",
  "part10",           // Work and study
  "part39",           // School days & bullying
  "part21",           // Idioms & expressions (Redewendungen)
  "cb-phone",
  "part15",           // Texting & chat shorthand
  "part43",           // Computers & tech (Windows, Linux & gadgets)
  "part50",           // Streaming & making videos
  "part56",           // Making games & coding
  "cb-internet-support",
  "cb-hotel",
  "cb-opinions",
  "part11",           // Opinions and media
  "part55",           // Stars, movies & series
  "part12",           // Travel and problems
  "cb-driving",
  "cb-traffic-fines",
  "cb-train-travel",
  "part59",           // Outdoors: walks, hikes & getting there
  "cb-hobbies",
  "cb-flea-markets",
  "cb-football-culture",
  "part58",           // Football & watching sports
  "cb-pets-animals",
  "part36",           // Gym & training
  "part37",           // Beauty, makeup & appearance
  "cb-barber-requests",
  "cb-body-skin",
  "cb-social",
  "cb-emotions",
  "cb-dreams-aspirations",
  "part46",           // Real talk: gossip, fears & what you really think
  "part53",           // Comfort calls, sleep & beliefs
  "cb-nightlife",
  "part48",           // Smoking, vaping & smoke breaks
  "cb-beer-culture",
  "part38",           // Drinking, gambling & addiction
  "cb-dating",
  "part18",           // Dating, flirting & social
  "part27",           // Deep love & affection (partner register)
  "part30",           // Arguing & making up
  "part32",           // Relationship talk: check-ins & hard questions
  "part52",           // Trust, cheating & the gender wars
  "part34",           // Psychology & emotions
  "part41",           // Milestones: proposals, weddings & family plans
  "part47",           // Family problems & faith
  "cb-family-problems",
  "cb-kids-school",
  // ── Tier 3 · niche / very casual — always labelled ──────────
  "cb-slang-friends",
  "part14",           // Everyday slang & youth talk
  "cb-modal-particles",
  "cb-denglish",
  "part16",           // Regional greetings & expressions
  "part17",           // Banter & friendly trash talk
  "cb-people-subcultures",
  "part31",           // Jokes, banter & humour
  "part29",           // Swearing & insults (strong language)
  "part13",           // Gaming & FPS callouts
  "part19",           // Loadouts & gunsmith talk
  "part42",           // Gaming: classes, settings & lobbies
  "part45",           // Online gaming culture: cheaters, Steam & Discord
  "cb-fighting-styles",
  "cb-tics-tourettes",
  "cb-neurodiversity",
  "part20",           // Flirting & intimacy (18+)
  "part28",           // Passion & desire (18+)
  "part22",           // B2 — discussion, argument & hypotheticals (advanced)
  "part23",           // B2 — health & the doctor (detailed)
  "part24",           // B2 — work & professional communication
  "part35",           // Work, money & the world
  "part44",           // AI, science & the future
  "part54",           // Investing: assets, interest & inflation
  "part25",           // B2-C1 — society, news & current affairs
  "part33",           // Talking politics & big topics (casual)
  "cb-social-issues",
  "part40",           // Conspiracies & rabbit holes
  "cb-crime-jail",
  "part26",           // C1 — university & academic life
];

const TIER1 = new Set(CURRICULUM_ORDER.slice(0, CURRICULUM_ORDER.indexOf("part8")));
const TIER3_NOTES: Record<string, string> = {
  "cb-slang-friends": "Slang — close friends only",
  part14: "Youth slang — casual only",
  "cb-modal-particles": "Modal particles — conversational fillers",
  "cb-denglish": "Denglish — very casual",
  part16: "Regional — not used everywhere",
  part17: "Banter — close friends only",
  "cb-people-subcultures": "Social types & subcultures",
  part13: "Gamer talk",
  part19: "Gamer talk",
  part42: "Gamer talk",
  part45: "Gamer talk",
  "cb-fighting-styles": "Combat & fighting styles",
  "cb-tics-tourettes": "Tics & Tourette's",
  "cb-neurodiversity": "Neurodiversity & focus",
  "cb-crime-jail": "Crime & legal vocabulary",
  "cb-social-issues": "Social issues & equality",
  part20: "18+ · intimate",
  part28: "18+ · intimate",
  part29: "Strong language — know it, use with care",
  part31: "Banter & humour — casual",
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
