import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-direction";
export const DIRECTION_CHANGE_EVENT = "gl-direction-change";

// Which language the learner is studying. "learn-de" is the app's original mode
// (English speaker learning German). "learn-en" flips it so a German speaker
// learns English — the same content shown the other way round (English becomes
// the target you read/hear/type, German becomes the meaning).
export type LearningDirection = "learn-de" | "learn-en";

export function getLearningDirection(): LearningDirection {
  if (typeof window === "undefined") return "learn-de";
  return localStorage.getItem(KEY) === "learn-en" ? "learn-en" : "learn-de";
}

export function setLearningDirection(d: LearningDirection) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, d);
    // ...and into the shared mirror, which every other setting reaches
    // through saveScopedJson. This one wrote locally only, and the key
    // starts with gl-, so the mirror carries it: it was read back over the
    // new value on the next load and on every window focus. Choosing German
    // held until the window closed and then went back to English on its own,
    // because the direction is what the two built-in courses are read from.
    syncLocalStorageItem(KEY, d);
    window.dispatchEvent(new CustomEvent(DIRECTION_CHANGE_EVENT, { detail: d }));
  }
}

export function learningEnglish(): boolean {
  return getLearningDirection() === "learn-en";
}

/** BCP-47 tag of the language being learned — used for lesson audio. */
export function targetLangTag(): string {
  return getLearningDirection() === "learn-en" ? "en-US" : "de-DE";
}
