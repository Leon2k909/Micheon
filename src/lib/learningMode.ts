import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-learning-mode";

export type LearningMode = "conversation" | "exam";

type PhraseForm = {
  de: string;
  short?: string;
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

  if (mode === "exam") {
    return {
      ...phrase,
      de: standard,
      short: spoken !== standard ? spoken : undefined,
      long: undefined,
    };
  }

  return {
    ...phrase,
    de: spoken,
    short: undefined,
    long: standard !== spoken ? standard : undefined,
  };
}
