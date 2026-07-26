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
    }
    return out;
  } catch {
    return {};
  }
}

export function getPetGreeting(petKey: string): PetGreeting {
  return read()[petKey] ?? {};
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
