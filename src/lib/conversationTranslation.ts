import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * Whether the conversation shows what the other side's lines mean.
 *
 * Every turn is printed twice: the language being learned, and under it the
 * same line in a language the learner already reads. That second line is the
 * whole point early on and a spoiler later — once you can follow "Haben wir
 * noch genug Milch?" the English under it answers the question before you have
 * read the German, and the scene stops being practice.
 *
 * So it is a setting rather than a stage of the course: hidden when the
 * learner says so, and remembered, because being asked again every time you
 * open a scene is its own kind of noise. It is stored the way the app's other
 * small preferences are, which is what carries it between devices.
 */
const CONVERSATION_TRANSLATION_HIDDEN_KEY = "gl-conversation-translation-hidden-v1";
export const CONVERSATION_TRANSLATION_EVENT = "conversation-translation-changed";

export function getConversationTranslationHidden(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONVERSATION_TRANSLATION_HIDDEN_KEY) === "1";
}

export function setConversationTranslationHidden(hidden: boolean) {
  if (typeof window === "undefined") return;
  const value = hidden ? "1" : "0";
  window.localStorage.setItem(CONVERSATION_TRANSLATION_HIDDEN_KEY, value);
  syncLocalStorageItem(CONVERSATION_TRANSLATION_HIDDEN_KEY, value);
  window.dispatchEvent(new CustomEvent(CONVERSATION_TRANSLATION_EVENT, {
    detail: { hidden },
  }));
}
