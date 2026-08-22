import { useSyncExternalStore } from "react";
import { syncLocalStorageItem } from "@/lib/profileStorage";
import { LIFE_IN_THE_UK_DE } from "@/lib/lifeInTheUkTranslationsDe";
import { LEBEN_IN_DEUTSCHLAND_EN } from "@/lib/lebenInDeutschlandTranslationsEn";

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
 * keyed on the SOURCE text, and register it in TRANSLATIONS below. The keys
 * are the course's own strings exactly as they appear in it, so a missing
 * entry degrades to showing the original rather than to a crash or an empty
 * panel.
 *
 * A table also says which language it translates FROM. Country studies now
 * holds two courses written in two languages: Life in the UK is English and
 * offers German, Leben in Deutschland is German and offers English. Without
 * "from", the picker would offer a German learner a German translation of
 * German cards and appear broken.
 */

const KEY = "gl-course-translation";
export const COURSE_TRANSLATION_CHANGE_EVENT = "gl-course-translation-change";

/** "off" means cards are not tappable and nothing is offered. */
export type TranslationLanguage = "off" | "de" | "en";

/** The language a course is written in, which decides what can be offered. */
export type ContentLanguage = "en" | "de";

export const TRANSLATION_LANGUAGES: Array<{
  id: TranslationLanguage;
  label: string;
  endonym: string;
  /** null for "off", which belongs in every list. */
  from: ContentLanguage | null;
}> = [
  { id: "off", label: "No translation", endonym: "No translation", from: null },
  { id: "de", label: "German", endonym: "Deutsch", from: "en" },
  { id: "en", label: "English", endonym: "English", from: "de" },
];

const TRANSLATIONS: Partial<Record<TranslationLanguage, Record<string, string>>> = {
  de: LIFE_IN_THE_UK_DE,
  en: LEBEN_IN_DEUTSCHLAND_EN,
};

/**
 * What to offer beside a course written in this language.
 *
 * Always includes "off", so there is a way to turn it back off, and never
 * includes a table that reads the same language the course is already in.
 */
export function translationLanguagesFor(contentLang: ContentLanguage) {
  return TRANSLATION_LANGUAGES.filter((language) => language.from === null || language.from === contentLang);
}

let inMemory: TranslationLanguage = "off";

export function getTranslationLanguage(): TranslationLanguage {
  if (typeof window === "undefined") return "off";
  try {
    const stored = localStorage.getItem(KEY);
    inMemory = stored === "de" || stored === "en" ? stored : "off";
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
