import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_DISPLAY_MODE_KEY = "gl-codex-pet-display-mode-v1";
export const CODEX_PET_DISPLAY_MODE_EVENT = "codex-pet-display-mode-changed";

export type PetDisplayMode = "app" | "desktop" | "games";

/**
 * Desktop, not Games.
 *
 * Games mode asks Windows to keep the mascot above fullscreen games, which it
 * does by putting the overlay in the screen-saver z-order band. Nothing can be
 * drawn over a fullscreen game without the desktop compositor staying in
 * charge of the screen, and a game that cannot hand its frames straight to the
 * display picks up a frame of latency doing it. Nobody chooses that — it
 * arrived as a default — and it is felt as input delay while gaming.
 *
 * Desktop keeps the mascot over the desktop and ordinary windows, where it
 * costs nothing anyone can feel. Anyone who genuinely wants it over a game can
 * still say so, now that the choice states what it costs.
 */
const DEFAULT_PET_DISPLAY_MODE: PetDisplayMode = "desktop";

export function isPetDisplayMode(value: unknown): value is PetDisplayMode {
  return value === "app" || value === "desktop" || value === "games";
}

export function getPetDisplayMode(): PetDisplayMode {
  if (typeof window === "undefined") return DEFAULT_PET_DISPLAY_MODE;
  const stored = window.localStorage.getItem(CODEX_PET_DISPLAY_MODE_KEY);
  return isPetDisplayMode(stored) ? stored : DEFAULT_PET_DISPLAY_MODE;
}

export function setPetDisplayMode(mode: PetDisplayMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CODEX_PET_DISPLAY_MODE_KEY, mode);
  syncLocalStorageItem(CODEX_PET_DISPLAY_MODE_KEY, mode);
  window.dispatchEvent(new CustomEvent<PetDisplayMode>(CODEX_PET_DISPLAY_MODE_EVENT, {
    detail: mode,
  }));
}
