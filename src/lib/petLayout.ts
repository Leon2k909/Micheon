import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * How multiple desktop mascots are arranged.
 *
 * "together" keeps them in one row that drags as a single group — the original
 * behaviour, and still the tidiest for two or three pets.
 * "apart" gives every pet its own place on the desktop, dragged individually.
 */
export type PetLayoutMode = "together" | "apart";

export const PET_LAYOUT_KEY = "gl-codex-pet-layout-v1";
export const PET_LAYOUT_EVENT = "codex-pet-layout-changed";

export function getPetLayoutMode(): PetLayoutMode {
  if (typeof window === "undefined") return "together";
  return window.localStorage.getItem(PET_LAYOUT_KEY) === "apart" ? "apart" : "together";
}

export function setPetLayoutMode(mode: PetLayoutMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PET_LAYOUT_KEY, mode);
  // The overlay window and the main window are separate renderers, so the
  // change has to travel by both the shared-storage sync and a same-window
  // event — a storage event never fires in the window that made the change.
  syncLocalStorageItem(PET_LAYOUT_KEY, mode);
  window.dispatchEvent(new Event(PET_LAYOUT_EVENT));
}

/** Where a single pet sits when the pets are arranged apart. */
export function petPositionKey(baseKey: string, petKey: string) {
  return `${baseKey}:${petKey}`;
}
