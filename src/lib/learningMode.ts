import { useSyncExternalStore } from "react";
import { matchGermanSentence } from "@/lib/germanTextMatch";
import { toSpokenGerman, toTextedGerman } from "@/lib/spokenGerman";
import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-learning-mode";
const LEARNING_MODE_CHANGE_EVENT = "gl-learning-mode-change";

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
    return asTexted(withSpokenEnglish(withSpokenIchForm({
      ...phrase,
      // A conversational English written for a sentence whose GERMAN is the
      // same either way. shortEn used to be reachable only alongside a short
      // German form, so a card whose only difference was the English had no
      // way to say so.
      ...(spokenEn ? { en: spokenEn } : {}),
      short: undefined,
      long: standard !== original ? standard : undefined,
    })));
  }

  // Swapping the German for its short form while leaving the English describing
  // the full sentence produces a card that lies: "Zu teuer." shown as meaning
  // "I don't want to buy that, it's too expensive." The learner is then asked to
  // produce one from the other, and graded against a sentence that isn't on
  // screen. So the short form is only taught when it has an English of its own.
  //
  // Without one, the full pair is taught and `short` is left in place, which the
  // usage chip already surfaces as what people actually say — the hint stays,
  // the mismatched definition goes. The ich-form contraction below still
  // applies, because that one never changes what the English means.
  if (!spokenEn) {
    return asTexted(withSpokenEnglish(withSpokenIchForm({ ...phrase, long: undefined })));
  }

  // No derived contraction here on purpose: this phrase carries a hand-written
  // conversational form with its own English, and a reviewed wording outranks a
  // generated one. If an author wrote "Das denke ich.", that is what gets
  // taught — the rule only fills the silence where nobody wrote anything.
  return asTexted({
    ...phrase,
    de: spoken,
    en: spokenEn,
    short: undefined,
    long: standard !== spoken ? standard : undefined,
  });
}

/**
 * Conversation mode's last step: drop the ich-form -e the way people speak
 * ("So hab ich das noch nicht gesehen"). Meaning-preserving, so the English
 * needs no counterpart — see spokenGerman.ts.
 *
 * The written sentence is kept in `long`, which is both the supporting context
 * the card shows and, through matchLearningModeGermanAnswer, an accepted
 * answer. Nobody is marked wrong for typing the textbook form. An authored
 * `long` always wins, since a hand-written pairing knows more than this rule.
 */
function withSpokenIchForm<T extends PhraseForm>(phrase: T): T {
  const written = phrase.de.trim();
  const spoken = toSpokenGerman(written);
  if (spoken === written) return phrase;
  return { ...phrase, de: spoken, long: phrase.long?.trim() || written };
}

/**
 * "Sollen wir …?" is "Should we …?" when people say it out loud.
 *
 * Shall is not wrong — it is the form an exam expects, and Exam mode keeps
 * it. It is just not what gets said, and a course teaching somebody to talk
 * should hand them the words they will hear. Ninety cards opened on it, and
 * several already offered "Should we …" as their second wording, which is
 * the same judgement made one card at a time.
 *
 * Only the opening moves, and only where the sentence really begins — the
 * start of the English or the start of an alternative after a slash. Shall
 * elsewhere in a sentence is doing something else ("what shall be done"),
 * and an authored shortEn outranks this the way `long` outranks the spoken
 * German rule: a hand-written wording knows more than a transform.
 */
function withSpokenEnglish<T extends PhraseForm>(phrase: T): T {
  const written = String(phrase.en ?? "");
  const spoken = written.replace(/(^|\/\s*)Shall (we|I)\b/gu, "$1Should $2");
  return spoken === written ? phrase : { ...phrase, en: spoken };
}

/**
 * Conversation mode punctuates the way people type, not the way an exam is
 * marked. Applied to the German being TAUGHT only: the full written form kept
 * in `long` still carries every comma, and Exam mode is untouched.
 *
 * This runs on hand-written conversational forms too. An author who wrote a
 * short form was choosing the words, not adjudicating commas, and a mode that
 * punctuated half its sentences one way and half the other would look like a
 * bug rather than a register.
 */
function asTexted<T extends PhraseForm>(phrase: T): T {
  const texted = toTextedGerman(phrase.de);
  return texted === phrase.de ? phrase : { ...phrase, de: texted };
}
