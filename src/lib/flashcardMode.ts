import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * How the lesson preview shows a phrase.
 *
 * "flip" shows one side and makes you turn the card over, which is the whole
 * point of a flashcard: you have to try to remember before you are told. It is
 * the default for new learners and profiles without a saved preference.
 * "both" puts the German and the English on screen together for learners who
 * deliberately prefer a quick skim.
 */
export type FlashcardMode = "both" | "flip";

export const FLASHCARD_MODE_KEY = "gl-flashcard-mode-v1";
export const FLASHCARD_MODE_EVENT = "flashcard-mode-changed";

export function getFlashcardMode(): FlashcardMode {
  if (typeof window === "undefined") return "flip";
  try {
    // Keep an explicit existing choice, but make real flashcards the default
    // when the learner has never touched this setting.
    return window.localStorage.getItem(FLASHCARD_MODE_KEY) === "both" ? "both" : "flip";
  } catch {
    return "flip";
  }
}

export function setFlashcardMode(mode: FlashcardMode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FLASHCARD_MODE_KEY, mode);
  } catch {
    // The in-memory preference still applies even if storage is blocked.
  }
  syncLocalStorageItem(FLASHCARD_MODE_KEY, mode);
  // A storage event never fires in the window that wrote the value, so the
  // settings screen and an open lesson need this to agree.
  window.dispatchEvent(new Event(FLASHCARD_MODE_EVENT));
}

/** Which side a flip card opens on. */
export type FlashcardFace = "target" | "meaning";

export const FLASHCARD_FACE_KEY = "gl-flashcard-face-v1";

export function getFlashcardFace(): FlashcardFace {
  if (typeof window === "undefined") return "target";
  try {
    return window.localStorage.getItem(FLASHCARD_FACE_KEY) === "meaning" ? "meaning" : "target";
  } catch {
    return "target";
  }
}

export function setFlashcardFace(face: FlashcardFace) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FLASHCARD_FACE_KEY, face);
  } catch {
    /* preference still applies in memory */
  }
  syncLocalStorageItem(FLASHCARD_FACE_KEY, face);
  window.dispatchEvent(new Event(FLASHCARD_MODE_EVENT));
}
