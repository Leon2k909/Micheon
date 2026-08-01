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
  "part150",          // I can do it: ability, help and encouragement
  "part57",           // Talking about learning German (& other skills)
  "part141",          // Typing German characters on an English Windows keyboard
  "cb-conversation-repair",
  "cb-english-confusables", // Core contractions and confusing spellings for German speakers learning English
  "cb-reactions",
  "cb-shortreplies",
  "part158",         // Everyday spoken glue: reactions, timing and keeping in touch
  "part160",         // Everyday essentials: common replies, check-ins and quick plans
  "part161",         // Essential conversation skills: choices, turns, repair and boundaries
  "part162",         // Meeting people: follow-ups, interests and recommendations
  "part163",         // Talking about experience: ever, never, yet and how long
  "part164",         // Explaining why: reasons, purpose and consequences
  "part165",         // Talking about habits: frequency, routines and changes
  "part166",         // Everyday things: finding, borrowing, sharing and putting away
  "part167",         // Identifying people and things: which one, where and what it looks like
  "part168",         // Everyday amounts: enough, too much, what is left and sharing
  "part169",         // Thinking, knowing, remembering, clarifying and checking
  "part170",         // Getting things done: starting, waiting, finishing and following up
  "part171",         // Keeping conversations moving: updates, reactions and follow-up questions
  "part172",         // Strom, Gas und die Heizkosten
  "part173",         // Essen mit Einschränkungen
  "part174",         // False friends that trap English speakers
  "part175",         // Sayings Germans actually use
  "part176",         // Tja, Igitt, Juhu — spoken reactions
  "part177",         // WG, Azubi, LKW — spoken abbreviations
  "part178",         // Beim Friseur
  "part179",         // Der Umzug
  "part180",         // Wetter, das Pläne ändert
  "part181",         // Fitnessstudio und Verein
  "part182",         // Kochen: einmal durchs Rezept
  "part183",         // Das Auto im Alltag
  "part184",         // Der Notfall: 112 und Erste Hilfe
  "part185",         // Beim Zahnarzt
  "part186",         // Kita und Schule
  "part187",         // Geld überweisen und Rechnungen
  "part188",         // Versicherungen im Alltag
  "part189",         // Amt, Ausweis und Formulare
  "part190",         // Geburtstag feiern
  "part191",         // Im Hotel
  "part192",         // Krank zu Hause
  "part193",         // Draußen im Park und am See
  "part194",         // Die Wohnung einrichten
  "part195",         // Über Deutsch reden
  "part196",         // Im Supermarkt: Chip, Pfand, SB-Kasse
  "part197",         // Zusammen sein: Jahrestag und Kosenamen
  "part198",         // Feiertage: Silvester, Weihnachten, Ostern
  "part199",         // Termine jonglieren
  "part200",         // Pendeln und Bahn fahren
  "part201",         // Garten und Balkon
  "part202",         // Fahrrad fahren
  "part203",         // Wäsche waschen
  "part204",         // Schwimmbad und Sauna
  "part205",         // Mülltrennung
  "part206",         // WG und Haushalt teilen
  "part207",         // In der Warteschleife
  "part208",         // Floskeln: die kleinen Antworten
  "part209",         // Nein sagen mit Stil
  "part210",         // In der Arztpraxis
  "part211",         // Homeoffice und Videokonferenz
  "part212",         // Nachbarschaftshilfe
  "part213",         // Oma und Opa
  "cb-smalltalk",
  "cb-numbers-time",
  "cb-letters-numbers",
  "part2",            // Travel and daily tasks
  "cb-food",
  "part49",           // Cooking at home & food culture
  "part5",            // Food and cafe
  "part142",          // Takeaway, food delivery and missing orders
  "cb-diet-allergies",
  "cb-shopping",
  "part63",           // Clothes shopping & returns
  "part156",          // Drugstore: toiletries, laundry products and photos
  "cb-grocery",
  "part155",          // Bakery, deli counter and weekly market
  "cb-money",
  "cb-money-woes",
  "cb-directions",
  "part6",            // Directions and movement
  "part3",            // Home and routine
  "part144",          // Putting things somewhere: stellen/stehen and legen/liegen
  "cb-routine",
  "part7",            // People and family
  "cb-family",
  "cb-weather",
  "cb-connectors",
  "cb-celebrations",
  "part66",           // German holidays: Weihnachtsmarkt to Karneval
  "cb-plans",
  "part4",            // Plans and conversation
  "cb-health",
  "cb-emergencies",
  "cb-travel",
  "part64",           // Flying & the airport
  // ── Tier 2 · common, situational ────────────────────────────
  "part8",            // Core verbs
  "part9",            // Home and daily errands
  "part159",          // Everyday practical gaps: normal problems and arrangements
  "part68",          // Daily home talk: couples, flatmates & feelings
  "part69",          // People, opinions & reactions
  "part70",          // Keeping a conversation going
  "cb-conversation-bridges", // Clarifying, rephrasing, turn-taking and nuanced spoken replies
  "part152",         // Telling a story clearly: sequence, turning points and outcomes
  "part71",          // Opinions, agreeing & disagreeing
  "part145",          // Linking ideas: cause, contrast and consequence
  "part72",          // Making & changing plans
  "part73",          // Everyday work life
  "part74",          // Phone calls & voice notes
  "part75",          // Getting around
  "part76",          // Eating & drinking out
  "part77",          // When shopping goes wrong
  "part78",          // Health between normal people
  "part79",          // Being there for someone
  "part80",          // Neighbours & shared living
  "part81",          // Phones, streaming & group chats
  "part82",          // Family & relatives
  "part83",          // Weather & seasons
  "part84",          // Sport & exercise
  "part85",          // Money between friends
  "part86",          // Pets & animals
  "part157",         // Talking directly to pets: commands, affection and care
  "part87",          // Clothes & getting ready
  "part88",          // Kids & parenting
  "part89",          // Learning & studying
  "part90",          // Driving & cars
  "part91",          // Weekends & free time
  "part92",          // Music, films & books
  "part93",          // Venting & getting it off your chest
  "part99",
  "part94",
  "part95",
  "part96",
  "part98",
  "cb-housing",
  "cb-gardening-plants",
  "cb-apartment-repairs",
  "part154",         // DIY tools and fixing things at home
  "cb-amt",
  "part143",          // Visas, residence permits and the Ausländerbehörde
  "part51",           // Getting help: hotlines, bank & repairs
  "cb-medical-bureaucracy",
  "cb-post-packages",
  "cb-german-rules",
  "part67",           // Very German things: Pfand, Mülltrennung & Sauna
  "cb-finance-insurance",
  "cb-work",
  "cb-salary-negotiations",
  "part65",           // Job applications & the Zeugnis code
  "part10",           // Work and study
  "part39",           // School days & bullying
  "part21",           // Idioms & expressions (Redewendungen)
  "cb-phone",
  "part15",           // Texting & chat shorthand
  "part43",           // Computers & tech (Windows, Linux & gadgets)
  "part50",           // Streaming & making videos
  "part56",           // Making games & coding
  "part151",          // Online safety, scams and account recovery
  "cb-internet-support",
  "cb-hotel",
  "cb-opinions",
  "part11",           // Opinions and media
  "part55",           // Stars, movies & series
  "part61",           // Music, concerts & festivals
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
  "part62",           // Hosting, visiting & neighbours
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
  "part60",           // Condolences, loss & being there
  "cb-family-problems",
  "cb-kids-school",
  // ── Tier 3 · niche / very casual — always labelled ──────────
  "cb-slang-friends",
  "part14",           // Everyday slang & youth talk
  "cb-modal-particles",
  "cb-denglish",
  "part16",           // Regional greetings & expressions
  "cb-geordie",       // Newcastle English for German speakers learning English
  "part17",           // Banter & friendly trash talk
  "cb-people-subcultures",
  "part31",           // Jokes, banter & humour
  "part29",           // Swearing & insults (strong language)
  "part13",           // Gaming & FPS callouts
  "part19",           // Loadouts & gunsmith talk
  "part147",          // RPG & survival weapons, armour and durability
  "part42",           // Gaming: classes, settings & lobbies
  "part148",          // Abilities, cooldowns, buffs and skill trees
  "part146",          // Caves, dungeons and underground exploration
  "part149",          // Adding friends, parties and cross-play
  "part153",          // Board games, tabletop RPGs and taking turns
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
  "cb-geordie": "Geordie / Newcastle English — regional and informal",
  part17: "Banter — close friends only",
  "cb-people-subcultures": "Social types & subcultures",
  part13: "Gamer talk",
  part19: "Gamer talk",
  part146: "Gamer talk",
  part147: "Gamer talk",
  part148: "Gamer talk",
  part149: "Gamer talk",
  part153: "Tabletop and board-game talk",
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
