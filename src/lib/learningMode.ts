import { useSyncExternalStore } from "react";
import { matchGermanSentence } from "@/lib/germanTextMatch";
import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-learning-mode";
export const LEARNING_MODE_CHANGE_EVENT = "gl-learning-mode-change";

export type LearningMode = "conversation" | "exam";

let inMemoryMode: LearningMode = "conversation";

type PhraseForm = {
  de: string;
  en?: string;
  short?: string;
  /** English for the short form. Without it the short form cannot be taught. */
  shortEn?: string;
  long?: string;
};

/**
 * Grade the German forms promised by the learning-mode picker. The selected
 * target is always tried first; Conversation mode may also carry its paired
 * full form in `long`. Exam mode deliberately removes `long`, so this never
 * broadens an exam answer to an untaught casual `short` variant.
 */
export function matchLearningModeGermanAnswer(
  input: string,
  phrase: Pick<PhraseForm, "de" | "long">
): ReturnType<typeof matchGermanSentence> {
  const primary = matchGermanSentence(input, phrase.de);
  const full = phrase.long?.trim();
  if (primary.ok || !full || full === phrase.de.trim()) return primary;

  const standard = matchGermanSentence(input, full);
  return standard.ok ? standard : primary;
}

export function getLearningMode(): LearningMode {
  if (typeof window === "undefined") return "conversation";
  try {
    inMemoryMode = localStorage.getItem(KEY) === "exam" ? "exam" : "conversation";
  } catch {
    // Keep the current in-memory preference when browser storage is blocked.
  }
  return inMemoryMode;
}

export function setLearningMode(mode: LearningMode) {
  inMemoryMode = mode;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // The in-memory preference still updates even if browser storage is blocked.
  }
  syncLocalStorageItem(KEY, mode);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<LearningMode>(LEARNING_MODE_CHANGE_EVENT, { detail: mode }));
  }
}

function subscribeLearningMode(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onLearningModeChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) onStoreChange();
  };

  window.addEventListener(LEARNING_MODE_CHANGE_EVENT, onLearningModeChange);
  window.addEventListener("storage", onStorage);
  // Profile hydration writes localStorage in this window, where `storage` does
  // not fire, and announces the completed batch with this event instead.
  window.addEventListener("storage-sync-completed", onLearningModeChange);
  return () => {
    window.removeEventListener(LEARNING_MODE_CHANGE_EVENT, onLearningModeChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("storage-sync-completed", onLearningModeChange);
  };
}

/** Reactive learning mode for catalogues cached by React consumers. */
export function useLearningMode(): LearningMode {
  return useSyncExternalStore(subscribeLearningMode, getLearningMode, () => "conversation");
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

  // Some catalogue entries already use the spoken form as `de` and keep the
  // fuller standard form in `long`. Conversation mode must preserve that full
  // form as supporting context (and as an accepted answer).
  if (spoken === original) {
    return {
      ...phrase,
      short: undefined,
      long: standard !== original ? standard : undefined,
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
  if (!spokenEn) {
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
