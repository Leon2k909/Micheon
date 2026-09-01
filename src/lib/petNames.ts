import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * Learner-chosen names for pets.
 *
 * The catalogue name comes from the pet's own manifest, which is shared by
 * everyone who installs it — so renaming has to be stored on this side rather
 * than written back into the pack. Kept by pet key, so a rename survives
 * reinstalling the pet and never collides with another one.
 */
export const PET_NAMES_KEY = "gl-codex-pet-names-v1";
export const PET_NAMES_EVENT = "codex-pet-names-changed";

/** Long enough for a real name, short enough not to break the speech bubble. */
export const MAX_PET_NAME = 24;

type PetNames = Record<string, string>;

function read(): PetNames {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PET_NAMES_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: PetNames = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, MAX_PET_NAME);
    }
    return out;
  } catch {
    return {};
  }
}

/** The name to show: the learner's own if they set one, else the pet's. */
export function petDisplayName(petKey: string, fallback: string): string {
  const custom = read()[petKey];
  return custom || fallback;
}

/** Pass an empty string to go back to the pet's original name. */
export function setPetName(petKey: string, name: string) {
  if (typeof window === "undefined") return;
  const names = read();
  const trimmed = String(name ?? "").trim().slice(0, MAX_PET_NAME);
  if (trimmed) names[petKey] = trimmed;
  else delete names[petKey];
  const raw = JSON.stringify(names);
  try {
    window.localStorage.setItem(PET_NAMES_KEY, raw);
  } catch {
    /* the rename still applies in memory */
  }
  syncLocalStorageItem(PET_NAMES_KEY, raw);
  // The overlay is a separate window and a storage event never fires in the
  // window that wrote the value, so both signals are needed.
  window.dispatchEvent(new Event(PET_NAMES_EVENT));
}
