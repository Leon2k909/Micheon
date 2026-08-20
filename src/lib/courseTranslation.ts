import { useSyncExternalStore } from "react";
import { syncLocalStorageItem } from "@/lib/profileStorage";
import { LIFE_IN_THE_UK_DE } from "@/lib/lifeInTheUkTranslationsDe";

/**
 * Tap a card, read it in your own language.
 *
 * This is deliberately NOT the interface language. A German speaker learning
 * English often wants the app itself in English — that is the point of
 * practising — while still wanting a translation when a card defeats her. And
 * someone Polish wanting an English app with Polish help has no way to say so
 * if the two settings are one setting. So this is its own choice, defaulting
 * to "off" for people who do not need it.
 *
 * Adding a language is one file and two lines: export a Record<string, string>
 * keyed on the ENGLISH source text, and register it in TRANSLATIONS below. The
 * keys are the English strings exactly as they appear in the course, so a
 * missing entry degrades to showing the English rather than to a crash or an
 * empty panel.
 */

const KEY = "gl-course-translation";
export const COURSE_TRANSLATION_CHANGE_EVENT = "gl-course-translation-change";

/** "off" means cards are not tappable and nothing is offered. */
export type TranslationLanguage = "off" | "de";

export const TRANSLATION_LANGUAGES: Array<{ id: TranslationLanguage; label: string; endonym: string }> = [
  { id: "off", label: "No translation", endonym: "No translation" },
  { id: "de", label: "German", endonym: "Deutsch" },
];

const TRANSLATIONS: Partial<Record<TranslationLanguage, Record<string, string>>> = {
  de: LIFE_IN_THE_UK_DE,
};

let inMemory: TranslationLanguage = "off";

export function getTranslationLanguage(): TranslationLanguage {
  if (typeof window === "undefined") return "off";
  try {
    const stored = localStorage.getItem(KEY);
    inMemory = stored === "de" ? stored : "off";
  } catch {
    // Keep the in-memory preference when browser storage is blocked.
  }
  return inMemory;
}

export function setTranslationLanguage(language: TranslationLanguage) {
  inMemory = language;
  try {
    localStorage.setItem(KEY, language);
  } catch {
    // The in-memory preference still updates even if storage is blocked.
  }
  syncLocalStorageItem(KEY, language);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<TranslationLanguage>(COURSE_TRANSLATION_CHANGE_EVENT, { detail: language }));
  }
}

/**
 * The translation for one English string, or null when there is none.
 *
 * Null rather than the English text, so a caller can tell "not translated yet"
 * apart from "translates to the same words" and say so in the interface.
 */
export function translateCourseText(english: string, language: TranslationLanguage = getTranslationLanguage()): string | null {
  if (language === "off") return null;
  const table = TRANSLATIONS[language];
  if (!table) return null;
  return table[english.trim()] ?? null;
}

export function translationCoverage(language: TranslationLanguage): number {
  const table = TRANSLATIONS[language];
  return table ? Object.keys(table).length : 0;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) onStoreChange();
  };
  window.addEventListener(COURSE_TRANSLATION_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(COURSE_TRANSLATION_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Re-render when the choice changes, including from another window. */
export function useTranslationLanguage(): TranslationLanguage {
  return useSyncExternalStore(subscribe, getTranslationLanguage, () => "off" as TranslationLanguage);
}
