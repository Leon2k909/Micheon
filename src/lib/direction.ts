import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-direction";
export const DIRECTION_CHANGE_EVENT = "gl-direction-change";

// Which language the learner is studying. "learn-de" is the app's original mode
// (English speaker learning German). "learn-en" flips it so a German speaker
// learns English — the same content shown the other way round (English becomes
// the target you read/hear/type, German becomes the meaning). "learn-fr" makes
// French the target: the same catalogue again, narrowed to the entries French
// has been written for, with the learner's own language as the meaning.
// "learn-pl" is that same shape once more, over the Polish table — see
// polishCourse.ts, which is frenchCourse.ts with its own vocabulary.
// "learn-es" is the fourth of that family and the first that is not
// narrowed: the Spanish table covers the whole catalogue, so the course
// is the German one entry for entry. See spanishCourse.ts. "learn-it" is
// the second of those: same shape, same coverage, its own table.
export type LearningDirection = "learn-de" | "learn-en" | "learn-fr" | "learn-pl" | "learn-es" | "learn-it" | "learn-pt" | "learn-ru";

/**
 * Which translation table a direction cannot be built without.
 *
 * German and English are both written on the entry, so they need nothing.
 * The others are read out of a table keyed by the German, and an entry the
 * table does not cover is DROPPED rather than shown untranslated — so a
 * course assembled before its table arrives is not merely unstyled, it is
 * short. Anything building a catalogue awaits this first.
 */
export function translationLanguageFor(
  direction: LearningDirection
): "fr" | "pl" | "es" | "it" | "pt" | "ru" | null {
  if (direction === "learn-fr") return "fr";
  if (direction === "learn-pl") return "pl";
  if (direction === "learn-es") return "es";
  if (direction === "learn-it") return "it";
  if (direction === "learn-pt") return "pt";
  if (direction === "learn-ru") return "ru";
  return null;
}

const DIRECTIONS: LearningDirection[] = ["learn-de", "learn-en", "learn-fr", "learn-pl", "learn-es", "learn-it", "learn-pt", "learn-ru"];

/** Read a stored value as a direction, defaulting to the original mode. */
function asLearningDirection(value: unknown): LearningDirection {
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

export function learningPolish(): boolean {
  return getLearningDirection() === "learn-pl";
}

export function learningSpanish(): boolean {
  return getLearningDirection() === "learn-es";
}

export function learningItalian(): boolean {
  return getLearningDirection() === "learn-it";
}

export function learningPortuguese(): boolean {
  return getLearningDirection() === "learn-pt";
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
    case "learn-pl": return "pl-PL";
    case "learn-es": return "es-ES";
    case "learn-it": return "it-IT";
    case "learn-pt": return "pt-PT";
    default: return "de-DE";
  }
}
