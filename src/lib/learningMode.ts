import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-learning-mode";

export type LearningMode = "conversation" | "exam";

type PhraseForm = {
  de: string;
  en?: string;
  short?: string;
  /** English for the short form. Without it the short form cannot be taught. */
  shortEn?: string;
  long?: string;
};

export function getLearningMode(): LearningMode {
  if (typeof window === "undefined") return "conversation";
  try {
    return localStorage.getItem(KEY) === "exam" ? "exam" : "conversation";
  } catch {
    return "conversation";
  }
}

export function setLearningMode(mode: LearningMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // The in-memory preference still updates even if browser storage is blocked.
  }
  syncLocalStorageItem(KEY, mode);
}

/**
 * Conversation mode asks for the form people normally say and keeps the full
 * standard form as an accepted hint. Exam mode makes the full form the target
 * and shows the everyday version as supporting context.
 */
export function phraseForLearningMode<T extends PhraseForm>(phrase: T, mode: LearningMode): T {
  const original = phrase.de.trim();
  const spoken = phrase.short?.trim() || original;
  const standard = phrase.long?.trim() || original;
  const spokenEn = phrase.shortEn?.trim();

  if (mode === "exam") {
    return {
      ...phrase,
      de: standard,
      short: spoken !== standard ? spoken : undefined,
      long: undefined,
    };
  }

  // Swapping the German for its short form while leaving the English describing
  // the full sentence produces a card that lies: "Zu teuer." shown as meaning
  // "I don't want to buy that, it's too expensive." The learner is then asked to
  // produce one from the other, and graded against a sentence that isn't on
  // screen. So the short form is only taught when it has an English of its own.
  //
  // Without one, the full pair is taught and `short` is left in place, which the
  // usage chip already surfaces as what people actually say — the hint stays,
  // the mismatched definition goes.
  if (spoken === original || !spokenEn) {
    return { ...phrase, long: undefined };
  }

  return {
    ...phrase,
    de: spoken,
    en: spokenEn,
    short: undefined,
    long: standard !== spoken ? standard : undefined,
  };
}
