import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * What each pet says, in the learner's own words.
 *
 * This replaces a hardcoded special case — one pet's key was checked by name so
 * it would prefix every message with "Hello darling." Charming, but it meant a
 * pet's voice was a code change. Now every pet has the same two dials:
 *
 *   prefix  — said in front of everything, the pet's catchphrase
 *   lines   — the hellos it uses when it first appears, replacing the defaults
 *
 * Stored per pet key, on this side rather than in the pet's manifest, since a
 * manifest is shared by everyone who installs that pet.
 */
export const PET_GREETINGS_KEY = "gl-codex-pet-greetings-v1";
export const PET_GREETINGS_EVENT = "codex-pet-greetings-changed";

/** Long enough for a real phrase, short enough not to swamp the bubble. */
export const MAX_GREETING = 120;
export const MAX_GREETING_LINES = 8;

export type PetGreeting = {
  prefix?: string;
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
 * Keyed by the bare pet id, since a pet key is `<source>:<id>`.
 */
const DEFAULT_PREFIXES: Record<string, string> = {
  leon: "Hello darling.",
};

function defaultPrefixFor(petKey: string): string {
  const id = String(petKey ?? "").split(":").pop() ?? "";
  return DEFAULT_PREFIXES[id.toLocaleLowerCase()] ?? "";
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_GREETING) : "";
}

function read(): GreetingStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PET_GREETINGS_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: GreetingStore = {};
    for (const [key, value] of Object.entries(parsed as GreetingStore)) {
      if (!value || typeof value !== "object") continue;
      const prefix = clean(value.prefix);
      const lines = Array.isArray(value.lines)
        ? value.lines.map(clean).filter(Boolean).slice(0, MAX_GREETING_LINES)
        : [];
      if (prefix || lines.length) out[key] = { ...(prefix ? { prefix } : {}), ...(lines.length ? { lines } : {}) };
      // An empty entry is only kept for a pet that has a built-in voice, where
      // it is the record of someone having deliberately cleared it. For every
      // other pet an empty entry is just junk.
      else if (defaultPrefixFor(key)) out[key] = {};
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
  const prefix = defaultPrefixFor(petKey);
  return prefix ? { prefix } : {};
}

export function getAllPetGreetings(): GreetingStore {
  return read();
}

export function setPetGreeting(petKey: string, greeting: PetGreeting) {
  if (typeof window === "undefined") return;
  const store = read();
  const prefix = clean(greeting.prefix);
  const lines = (greeting.lines ?? []).map(clean).filter(Boolean).slice(0, MAX_GREETING_LINES);
  if (prefix || lines.length) store[petKey] = { ...(prefix ? { prefix } : {}), ...(lines.length ? { lines } : {}) };
  // Clearing a pet that has a built-in voice has to be remembered, or the
  // default would simply come back on the next message.
  else if (defaultPrefixFor(petKey)) store[petKey] = {};
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
 * Apply a pet's catchphrase to something it is about to say.
 *
 * Skipped when the text already starts with the prefix, so a greeting line that
 * happens to include the catchphrase is not doubled up.
 */
export function withPetPrefix(petKey: string, text: string): string {
  const prefix = getPetGreeting(petKey).prefix;
  const body = String(text ?? "").trim();
  if (!prefix || !body) return body;
  if (body.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase())) return body;
  return `${prefix} ${body}`;
}

/** The hellos this pet should use, or null to keep the app's defaults. */
export function petGreetingLines(petKey: string): string[] | null {
  const lines = getPetGreeting(petKey).lines;
  return lines && lines.length ? lines : null;
}
