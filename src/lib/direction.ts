import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-direction";
export const DIRECTION_CHANGE_EVENT = "gl-direction-change";

// Which language the learner is studying. "learn-de" is the app's original mode
// (English speaker learning German). "learn-en" flips it so a German speaker
// learns English — the same content shown the other way round (English becomes
// the target you read/hear/type, German becomes the meaning). "learn-fr" makes
// French the target: the same catalogue again, narrowed to the entries French
// has been written for, with the learner's own language as the meaning.
export type LearningDirection = "learn-de" | "learn-en" | "learn-fr";

const DIRECTIONS: LearningDirection[] = ["learn-de", "learn-en", "learn-fr"];

/** Read a stored value as a direction, defaulting to the original mode. */
export function asLearningDirection(value: unknown): LearningDirection {
  return DIRECTIONS.includes(value as LearningDirection)
    ? (value as LearningDirection)
    : "learn-de";
}

export function getLearningDirection(): LearningDirection {
  if (typeof window === "undefined") return "learn-de";
  return asLearningDirection(localStorage.getItem(KEY));
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

export function learningFrench(): boolean {
  return getLearningDirection() === "learn-fr";
}

/**
 * Is the text being learned German?
 *
 * The question most of the app actually asks. It used to be spelled
 * `!learningEnglish()`, which was the same thing while there were two
 * directions and silently wrong the moment there were three: French would
 * have inherited the German umlaut bar, the German matcher and the German
 * synonym expansion, none of which are about French.
 */
export function targetIsGerman(): boolean {
  return getLearningDirection() === "learn-de";
}

/** BCP-47 tag of the language being learned — used for lesson audio. */
export function targetLangTag(): string {
  switch (getLearningDirection()) {
    case "learn-en": return "en-US";
    case "learn-fr": return "fr-FR";
    default: return "de-DE";
  }
}
