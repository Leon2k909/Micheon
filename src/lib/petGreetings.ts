import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * What each pet says, in the learner's own words.
 *
 * This replaces a hardcoded special case — one pet's key was checked by name so
 * it would prefix every message with "Hello darling." Charming, but it meant a
 * pet's voice was a code change. Now every pet has the same three dials:
 *
 *   prefixes     — catchphrases, one picked each time, so a pet has a range
 *                  rather than one line it repeats forever
 *   prefixChance — how often a message actually gets one, 0 to 100
 *   lines        — the hellos it uses when it first appears
 *
 * Stored per pet key, on this side rather than in the pet's manifest, since a
 * manifest is shared by everyone who installs that pet.
 */
export const PET_GREETINGS_KEY = "gl-codex-pet-greetings-v1";
export const PET_GREETINGS_EVENT = "codex-pet-greetings-changed";

/** Long enough for a real phrase, short enough not to swamp the bubble. */
export const MAX_GREETING = 120;
export const MAX_GREETING_LINES = 8;

/** Used on every message unless the learner turns it down. */
export const DEFAULT_PREFIX_CHANCE = 100;

export type PetGreeting = {
  /** Catchphrases. One is picked per message; a single entry never varies. */
  prefixes?: string[];
  /** 0–100. How often a message gets a catchphrase at all. */
  prefixChance?: number;
  lines?: string[];
};

type GreetingStore = Record<string, PetGreeting>;

/**
 * Voices a pet ships with.
 *
 * Making greetings configurable should not have taken one away: the leon pet
 * was written for one person and has always opened with "Hello darling." It is
 * a default now rather than a special case in the provider — still the first
 * thing she hears without setting anything up, and still hers to change.
 *
 * These belong to that one pet and nobody else's: a stranger's pet calling them
 * "babe" out of the box would be a bug, not a feature. Every other pet starts
 * with nothing and the same dials to fill it in.
 *
 * Keyed by the bare pet id, since a pet key is `<source>:<id>`.
 */
const DEFAULT_PREFIXES: Record<string, string[]> = {
  leon: ["Hello darling.", "Hey babe.", "My love."],
};

function defaultPrefixesFor(petKey: string): string[] {
  const id = String(petKey ?? "").split(":").pop() ?? "";
  return DEFAULT_PREFIXES[id.toLocaleLowerCase()] ?? [];
}

/** True for a pet that has a voice of its own to fall back to. */
export function petHasBuiltInVoice(petKey: string): boolean {
  return defaultPrefixesFor(petKey).length > 0;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_GREETING) : "";
}

function cleanList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(clean).filter(Boolean).slice(0, MAX_GREETING_LINES) : [];
}

function cleanChance(value: unknown): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return DEFAULT_PREFIX_CHANCE;
  return Math.min(100, Math.max(0, n));
}

/** Older versions stored a single `prefix` string. Read it as a list of one. */
function storedPrefixes(value: any): string[] {
  const many = cleanList(value?.prefixes);
  if (many.length) return many;
  const one = clean(value?.prefix);
  return one ? [one] : [];
}

function read(): GreetingStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PET_GREETINGS_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: GreetingStore = {};
    for (const [key, value] of Object.entries(parsed as Record<string, any>)) {
      if (!value || typeof value !== "object") continue;
      const prefixes = storedPrefixes(value);
      const lines = cleanList(value.lines);
      // The chance is only meaningful alongside a catchphrase, but it is kept
      // whenever it was set so turning the dial down and typing a new phrase
      // does not silently reset it to "every message".
      const hasChance = value.prefixChance !== undefined;
      const chance = hasChance ? cleanChance(value.prefixChance) : DEFAULT_PREFIX_CHANCE;
      if (prefixes.length || lines.length) {
        out[key] = {
          ...(prefixes.length ? { prefixes } : {}),
          ...(lines.length ? { lines } : {}),
          ...(hasChance ? { prefixChance: chance } : {}),
        };
      }
      // An empty entry is only kept for a pet that has a built-in voice, where
      // it is the record of someone having deliberately cleared it. For every
      // other pet an empty entry is just junk.
      else if (petHasBuiltInVoice(key)) out[key] = hasChance ? { prefixChance: chance } : {};
    }
    return out;
  } catch {
    return {};
  }
}

/** What this pet says, falling back to its built-in voice if it has one. */
export function getPetGreeting(petKey: string): PetGreeting {
  const stored = read()[petKey];
  if (stored) return stored;
  const prefixes = defaultPrefixesFor(petKey);
  return prefixes.length ? { prefixes } : {};
}

/** The catchphrases in use, built-in or the learner's own. */
export function petPrefixes(petKey: string): string[] {
  return getPetGreeting(petKey).prefixes ?? [];
}

/** How often this pet uses one, as a percentage. */
export function petPrefixChance(petKey: string): number {
  return getPetGreeting(petKey).prefixChance ?? DEFAULT_PREFIX_CHANCE;
}

export function getAllPetGreetings(): GreetingStore {
  return read();
}

export function setPetGreeting(petKey: string, greeting: PetGreeting) {
  if (typeof window === "undefined") return;
  const store = read();
  // A caller still passing the old single `prefix` is honoured as a list of one.
  const prefixes = storedPrefixes(greeting);
  const lines = cleanList(greeting.lines);
  const hasChance = greeting.prefixChance !== undefined;
  const chance = hasChance ? cleanChance(greeting.prefixChance) : undefined;

  if (prefixes.length || lines.length) {
    store[petKey] = {
      ...(prefixes.length ? { prefixes } : {}),
      ...(lines.length ? { lines } : {}),
      ...(chance !== undefined ? { prefixChance: chance } : {}),
    };
  }
  // Clearing a pet that has a built-in voice has to be remembered, or the
  // default would simply come back on the next message.
  else if (petHasBuiltInVoice(petKey)) {
    store[petKey] = chance !== undefined ? { prefixChance: chance } : {};
  }
  else delete store[petKey];

  const raw = JSON.stringify(store);
  try {
    window.localStorage.setItem(PET_GREETINGS_KEY, raw);
  } catch {
    /* the change still applies in memory */
  }
  syncLocalStorageItem(PET_GREETINGS_KEY, raw);
  // The overlay is a separate window, and a storage event never fires in the
  // window that wrote the value.
  window.dispatchEvent(new Event(PET_GREETINGS_EVENT));
}

/**
 * Forget everything set for this pet, so it goes back to its built-in voice.
 *
 * Distinct from saving an empty greeting, which is how you silence a pet that
 * has a built-in one — "Back to default" and "say nothing" are different wishes.
 */
export function resetPetGreeting(petKey: string) {
  if (typeof window === "undefined") return;
  const store = read();
  delete store[petKey];
  const raw = JSON.stringify(store);
  try {
    window.localStorage.setItem(PET_GREETINGS_KEY, raw);
  } catch {
    /* the change still applies in memory */
  }
  syncLocalStorageItem(PET_GREETINGS_KEY, raw);
  window.dispatchEvent(new Event(PET_GREETINGS_EVENT));
}

/**
 * The last catchphrase each pet used, so the next pick avoids it.
 *
 * Plain random on a list of three says the same thing twice in a row a third of
 * the time, which reads as a pet that is stuck rather than one with range.
 */
const lastPrefix = new Map<string, string>();

/** Choose a catchphrase for this message, or "" for none this time. */
export function pickPetPrefix(petKey: string, random: () => number = Math.random): string {
  const greeting = getPetGreeting(petKey);
  const prefixes = greeting.prefixes ?? [];
  if (!prefixes.length) return "";

  const chance = greeting.prefixChance ?? DEFAULT_PREFIX_CHANCE;
  if (chance <= 0) return "";
  if (chance < 100 && random() * 100 >= chance) return "";

  const previous = lastPrefix.get(petKey);
  const fresh = prefixes.length > 1 ? prefixes.filter((one) => one !== previous) : prefixes;
  const chosen = fresh[Math.min(fresh.length - 1, Math.floor(random() * fresh.length))];
  lastPrefix.set(petKey, chosen);
  return chosen;
}

/**
 * Apply a pet's catchphrase to something it is about to say.
 *
 * Skipped when the text already starts with the chosen phrase, so a greeting
 * line that happens to include the catchphrase is not doubled up.
 */
export function withPetPrefix(petKey: string, text: string, random: () => number = Math.random): string {
  const body = String(text ?? "").trim();
  if (!body) return body;
  const prefix = pickPetPrefix(petKey, random);
  if (!prefix) return body;
  if (body.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase())) return body;
  return `${prefix} ${body}`;
}

/** The hellos this pet should use, or null to keep the app's defaults. */
export function petGreetingLines(petKey: string): string[] | null {
  const lines = getPetGreeting(petKey).lines;
  return lines && lines.length ? lines : null;
}
