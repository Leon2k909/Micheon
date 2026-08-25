import { useSyncExternalStore } from "react";
import { syncLocalStorageItem } from "@/lib/profileStorage";
import { LIFE_IN_THE_UK_DE } from "@/lib/lifeInTheUkTranslationsDe";
import { LEBEN_IN_DEUTSCHLAND_EN } from "@/lib/lebenInDeutschlandTranslationsEn";
import { CSHARP_COURSE_DE } from "@/lib/csharpCourseDe";
import { uiIsGerman } from "@/lib/i18n";
import type { Block, Course, Lesson } from "@/lib/courses";

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
  de: { ...LIFE_IN_THE_UK_DE, ...CSHARP_COURSE_DE },
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

// ── reading a course in the interface language ──────────────────────────────

/**
 * Which language a course's own text should be READ in.
 *
 * The tap-to-reveal above is the right shape for a language course: the
 * English of Life in the UK IS the practice, so it stays on top and the German
 * is there for the sentence that defeats you. A programming course is the
 * opposite. Nobody opens "C# for s&box" to practise their English — the
 * English is just the medium, and for a reader whose app is in German it is
 * one more thing in the way of the C#.
 *
 * So a programming course follows the interface language, and everything else
 * keeps the choice it already had.
 */
export function courseReadingLanguage(course: Pick<Course, "kind">): TranslationLanguage {
  if (course.kind !== "programming") return "off";
  return uiIsGerman() ? "de" : "off";
}

/** Translate, or keep the original when nothing is written for it yet. */
function readAs(text: string, language: TranslationLanguage): string {
  return translateCourseText(text, language) ?? text;
}

/**
 * A lesson with its prose in the reading language and its code untouched.
 *
 * Done to the lesson rather than inside each component on purpose. The blocks
 * are rendered by half a dozen little components — headings, cards, quizzes,
 * calls to action — and the quiz alone renders three separate strings with no
 * translation call at all. Patching them one at a time is how a reader ends up
 * with German prose and English answers on the same card.
 *
 * `code` never passes through here. Translating an identifier would leave the
 * lesson telling the reader to write something the compiler rejects.
 */
export function localiseLesson(lesson: Lesson, language: TranslationLanguage): Lesson {
  if (language === "off") return lesson;
  const blocks: Block[] = lesson.blocks.map((block) => {
    switch (block.type) {
      case "p":
      case "callout":
        return {
          ...block,
          text: readAs(block.text, language),
          ...(block.textJs === undefined ? {} : { textJs: readAs(block.textJs, language) }),
          ...(block.textNew === undefined ? {} : { textNew: readAs(block.textNew, language) }),
        };
      case "h3":
        return { ...block, text: readAs(block.text, language) };
      case "cards":
        return { ...block, items: block.items.map((item) => ({ h4: readAs(item.h4, language), p: readAs(item.p, language) })) };
      case "quiz":
        return {
          ...block,
          q: readAs(block.q, language),
          // correct stays as it is: it is the answer, not words to read.
          options: block.options.map((option) => ({ ...option, text: readAs(option.text, language) })),
          explanation: readAs(block.explanation, language),
        };
      case "cta":
        return { ...block, title: readAs(block.title, language), sub: readAs(block.sub, language) };
      default:
        return block;
    }
  });
  return { ...lesson, title: readAs(lesson.title, language), section: readAs(lesson.section, language), blocks };
}

/**
 * The whole course, read in the interface language.
 *
 * Lesson ids are never touched — progress is stored against them, and a
 * learner who switched the app to German would otherwise come back to a course
 * that had forgotten every lesson they had finished.
 */
export function localiseCourse(course: Course): Course {
  const language = courseReadingLanguage(course);
  if (language === "off" || !course.lessons) return course;
  return {
    ...course,
    name: readAs(course.name, language),
    tagline: readAs(course.tagline, language),
    lessons: course.lessons.map((lesson) => localiseLesson(lesson, language)),
  };
}
