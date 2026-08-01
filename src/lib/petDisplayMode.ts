import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_DISPLAY_MODE_KEY = "gl-codex-pet-display-mode-v1";
export const CODEX_PET_DISPLAY_MODE_EVENT = "codex-pet-display-mode-changed";

export type PetDisplayMode = "app" | "desktop" | "games";

const DEFAULT_PET_DISPLAY_MODE: PetDisplayMode = "games";

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
