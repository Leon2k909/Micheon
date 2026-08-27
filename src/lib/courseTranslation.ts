import { useSyncExternalStore } from "react";
import { resolveInterfaceLanguage } from "@/lib/interfaceLanguage";
import { syncLocalStorageItem } from "@/lib/profileStorage";
import { LIFE_IN_THE_UK_DE } from "@/lib/lifeInTheUkTranslationsDe";
import { LEBEN_IN_DEUTSCHLAND_EN } from "@/lib/lebenInDeutschlandTranslationsEn";
import { VIVRE_EN_FRANCE_DE } from "@/lib/vivreEnFranceTranslationsDe";
import { VIVRE_EN_FRANCE_EN } from "@/lib/vivreEnFranceTranslationsEn";
import { CSHARP_COURSE_DE } from "@/lib/csharpCourseDe";
import type { Block, Course, Lesson } from "@/lib/courses";

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
  de: { ...LIFE_IN_THE_UK_DE, ...VIVRE_EN_FRANCE_DE, ...CSHARP_COURSE_DE },
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

// ── reading a course in the interface language ──────────────────────────────

/**
 * Which languages a programming course has actually been written in.
 *
 * A lookup rather than a test for German. Asking "is the app German" answers
 * the wrong question: it says yes to the one language that happens to have a
 * translation today, and no to every other reader without distinguishing
 * "there is nothing written for you" from "you get English because you are not
 * German". Adding French here is then a line of data rather than a second
 * branch, and check-french-interface is refusing the branch on exactly that
 * reasoning.
 */
const PROGRAMMING_COURSE_TRANSLATIONS: Partial<Record<"en" | "de" | "fr" | "pl", TranslationLanguage>> = {
  de: "de",
};

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
  return PROGRAMMING_COURSE_TRANSLATIONS[resolveInterfaceLanguage()] ?? "off";
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
