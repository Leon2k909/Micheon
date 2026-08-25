import { useSyncExternalStore } from "react";
import { resolveInterfaceLanguage } from "@/lib/interfaceLanguage";
import { syncLocalStorageItem } from "@/lib/profileStorage";
import { LIFE_IN_THE_UK_DE } from "@/lib/lifeInTheUkTranslationsDe";
import { LEBEN_IN_DEUTSCHLAND_EN } from "@/lib/lebenInDeutschlandTranslationsEn";
import { VIVRE_EN_FRANCE_DE } from "@/lib/vivreEnFranceTranslationsDe";
import { VIVRE_EN_FRANCE_EN } from "@/lib/vivreEnFranceTranslationsEn";

/**
 * Tap a card, read it in your own language.
 *
 * The only help on offer is the app's own language, and the only other
 * choice is none. It used to be independent of the interface language, on
 * the reasoning that someone might run the app in English and still want
 * German help. In practice that produced the opposite: an English app
 * offering a German translation to someone who may not read a word of
 * German, and a German app offering English. The language you set the app
 * to is already your statement of what you read, so it decides this too.
 *
 * It still defaults to "off" — help is offered, never imposed — and it is
 * still stored separately, so turning it off does not disturb the interface.
 *
 * Adding a language is one file and two lines: export a Record<string, string>
 * keyed on the SOURCE text, and register it in TRANSLATIONS below. The keys
 * are the course's own strings exactly as they appear in it, so a missing
 * entry degrades to showing the original rather than to a crash or an empty
 * panel.
 *
 * A table also says which language it translates FROM. Country studies holds
 * three courses written in three languages: Life in the UK is English, Leben
 * in Deutschland is German, Vivre en France is French. Without "from", the
 * picker would offer a German learner a German translation of German cards and
 * appear broken. French, being neither of the app's own two languages, offers
 * both — so "from" is a LIST rather than a single language.
 *
 * The tables for one target language are merged into one lookup, because a
 * table is keyed by its course's own source text and two courses written in
 * two different languages cannot produce the same key. check-fr-translations
 * fails the build if they ever do.
 */

const KEY = "gl-course-translation";
export const COURSE_TRANSLATION_CHANGE_EVENT = "gl-course-translation-change";

/** "off" means cards are not tappable and nothing is offered. */
export type TranslationLanguage = "off" | "de" | "en";

/** The language a course is written in, which decides what can be offered. */
export type ContentLanguage = "en" | "de" | "fr";

export const TRANSLATION_LANGUAGES: Array<{
  id: TranslationLanguage;
  label: string;
  endonym: string;
  /** The course languages this table can be offered beside. null for "off",
   *  which belongs in every list. */
  from: ContentLanguage[] | null;
}> = [
  { id: "off", label: "No translation", endonym: "No translation", from: null },
  { id: "de", label: "German", endonym: "Deutsch", from: ["en", "fr"] },
  { id: "en", label: "English", endonym: "English", from: ["de", "fr"] },
];

const TRANSLATIONS: Partial<Record<TranslationLanguage, Record<string, string>>> = {
  de: { ...LIFE_IN_THE_UK_DE, ...VIVRE_EN_FRANCE_DE },
  en: { ...LEBEN_IN_DEUTSCHLAND_EN, ...VIVRE_EN_FRANCE_EN },
};

/**
 * What to offer beside a course written in this language.
 *
 * Two entries at most: "off", which is always there so help can be turned
 * back off, and the language the app itself is in — but only when a table
 * can actually read this course. A German app beside the German course
 * offers nothing but off, which leaves one entry, and the picker hides
 * itself rather than showing a menu with a single choice.
 */
export function translationLanguagesFor(contentLang: ContentLanguage) {
  const appLanguage = resolveInterfaceLanguage();
  return TRANSLATION_LANGUAGES.filter(
    (language) =>
      language.from === null ||
      (language.id === appLanguage && language.from.includes(contentLang))
  );
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
  // A stored choice can outlive the app language that made it offerable:
  // pick German help, switch the app to English, and the picker is gone
  // while the cards keep answering in German. Clamped here rather than at
  // each card, so what is shown can never disagree with what is offered.
  // The stored value is left alone — switching back restores the choice.
  return inMemory === "off" || inMemory === resolveInterfaceLanguage() ? inMemory : "off";
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
 * The translation for one source string, or null when there is none.
 *
 * Null rather than the source text, so a caller can tell "not translated yet"
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
