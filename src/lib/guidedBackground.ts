import { syncLocalStorageItem } from "@/lib/profileStorage";

/** Visual backdrop used behind the focused guided lesson. */
export type GuidedBackground = "garden" | "dawn" | "plain";

export const GUIDED_BACKGROUND_KEY = "micheon-guided-background-v1";
export const GUIDED_BACKGROUND_EVENT = "guided-background-changed";

export function getGuidedBackground(): GuidedBackground {
  if (typeof window === "undefined") return "garden";
  try {
    const stored = window.localStorage.getItem(GUIDED_BACKGROUND_KEY);
    return stored === "dawn" || stored === "plain" ? stored : "garden";
  } catch {
    return "garden";
  }
}

export function setGuidedBackground(background: GuidedBackground) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUIDED_BACKGROUND_KEY, background);
  } catch {
    // The in-memory preference still updates the current settings view.
  }
  syncLocalStorageItem(GUIDED_BACKGROUND_KEY, background);
  window.dispatchEvent(new Event(GUIDED_BACKGROUND_EVENT));
}
