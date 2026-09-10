import { useSyncExternalStore } from "react";
import { resolveInterfaceLanguage, type ResolvedInterfaceLanguage } from "@/lib/interfaceLanguage";
import { syncLocalStorageItem } from "@/lib/profileStorage";
import { LIFE_IN_THE_UK_DE } from "@/lib/lifeInTheUkTranslationsDe";
import { UK_QUESTION_BANK_DE } from "@/lib/ukQuestionBankTranslationsDe";
import { FR_QUESTION_BANK_DE } from "@/lib/frQuestionBankTranslationsDe";
import { PL_QUESTION_BANK_DE } from "@/lib/plQuestionBankTranslationsDe";
import { IT_QUESTION_BANK_DE } from "@/lib/itQuestionBankTranslationsDe";
import { ES_QUESTION_BANK_DE } from "@/lib/esQuestionBankTranslationsDe";
import { RU_QUESTION_BANK_DE } from "@/lib/ruQuestionBankTranslationsDe";
import { LIFE_IN_THE_UK_PL } from "@/lib/lifeInTheUkTranslationsPl";
import { LEBEN_IN_DEUTSCHLAND_PL } from "@/lib/lebenInDeutschlandTranslationsPl";
import { VIVRE_EN_FRANCE_PL } from "@/lib/vivreEnFranceTranslationsPl";
import { VIVERE_IN_ITALIA_PL } from "@/lib/vivereInItaliaTranslationsPl";
import { VIVIR_EN_ESPANA_PL } from "@/lib/vivirEnEspanaTranslationsPl";
import { ZHIZN_V_ROSSII_PL } from "@/lib/zhiznVRossiiTranslationsPl";
import { UK_QUESTION_BANK_PL } from "@/lib/ukQuestionBankTranslationsPl";
import { DE_QUESTION_BANK_PL } from "@/lib/deQuestionBankTranslationsPl";
import { FR_QUESTION_BANK_PL } from "@/lib/frQuestionBankTranslationsPl";
import { IT_QUESTION_BANK_PL } from "@/lib/itQuestionBankTranslationsPl";
import { ES_QUESTION_BANK_PL } from "@/lib/esQuestionBankTranslationsPl";
import { RU_QUESTION_BANK_PL } from "@/lib/ruQuestionBankTranslationsPl";
import { LEBEN_IN_DEUTSCHLAND_RU } from "@/lib/lebenInDeutschlandTranslationsRu";
import { LIFE_IN_THE_UK_RU } from "@/lib/lifeInTheUkTranslationsRu";
import { UK_QUESTION_BANK_RU } from "@/lib/ukQuestionBankTranslationsRu";
import { DE_QUESTION_BANK_RU } from "@/lib/deQuestionBankTranslationsRu";
import { PL_QUESTION_BANK_RU } from "@/lib/plQuestionBankTranslationsRu";
import { FR_QUESTION_BANK_RU } from "@/lib/frQuestionBankTranslationsRu";
import { IT_QUESTION_BANK_RU } from "@/lib/itQuestionBankTranslationsRu";
import { ES_QUESTION_BANK_RU } from "@/lib/esQuestionBankTranslationsRu";
import { ZYCIE_W_POLSCE_RU } from "@/lib/zycieWPolsceTranslationsRu";
import { VIVRE_EN_FRANCE_RU } from "@/lib/vivreEnFranceTranslationsRu";
import { VIVERE_IN_ITALIA_RU } from "@/lib/vivereInItaliaTranslationsRu";
import { VIVIR_EN_ESPANA_RU } from "@/lib/vivirEnEspanaTranslationsRu";
import { LIFE_IN_THE_UK_FR } from "@/lib/lifeInTheUkTranslationsFr";
import { UK_QUESTION_BANK_FR } from "@/lib/ukQuestionBankTranslationsFr";
import { DE_QUESTION_BANK_FR } from "@/lib/deQuestionBankTranslationsFr";
import { PL_QUESTION_BANK_FR } from "@/lib/plQuestionBankTranslationsFr";
import { IT_QUESTION_BANK_FR } from "@/lib/itQuestionBankTranslationsFr";
import { ES_QUESTION_BANK_FR } from "@/lib/esQuestionBankTranslationsFr";
import { RU_QUESTION_BANK_FR } from "@/lib/ruQuestionBankTranslationsFr";
import { DE_QUESTION_BANK_EN } from "@/lib/deQuestionBankTranslationsEn";
import { PL_QUESTION_BANK_EN } from "@/lib/plQuestionBankTranslationsEn";
import { IT_QUESTION_BANK_EN } from "@/lib/itQuestionBankTranslationsEn";
import { ES_QUESTION_BANK_EN } from "@/lib/esQuestionBankTranslationsEn";
import { FR_QUESTION_BANK_EN } from "@/lib/frQuestionBankTranslationsEn";
import { RU_QUESTION_BANK_EN } from "@/lib/ruQuestionBankTranslationsEn";
import { LEBEN_IN_DEUTSCHLAND_FR } from "@/lib/lebenInDeutschlandTranslationsFr";
import { ZYCIE_W_POLSCE_FR } from "@/lib/zycieWPolsceTranslationsFr";
import { VIVERE_IN_ITALIA_FR } from "@/lib/vivereInItaliaTranslationsFr";
import { VIVIR_EN_ESPANA_FR } from "@/lib/vivirEnEspanaTranslationsFr";
import { ZHIZN_V_ROSSII_FR } from "@/lib/zhiznVRossiiTranslationsFr";
import { LEBEN_IN_DEUTSCHLAND_EN } from "@/lib/lebenInDeutschlandTranslationsEn";
import { VIVRE_EN_FRANCE_DE } from "@/lib/vivreEnFranceTranslationsDe";
import { VIVRE_EN_FRANCE_EN } from "@/lib/vivreEnFranceTranslationsEn";
import { ZHIZN_V_ROSSII_DE } from "@/lib/zhiznVRossiiTranslationsDe";
import { ZHIZN_V_ROSSII_EN } from "@/lib/zhiznVRossiiTranslationsEn";
import { ZYCIE_W_POLSCE_EN } from "@/lib/zycieWPolsceTranslationsEn";
import { VIVERE_IN_ITALIA_EN } from "@/lib/vivereInItaliaTranslationsEn";
import { VIVIR_EN_ESPANA_EN } from "@/lib/vivirEnEspanaTranslationsEn";
import { ZYCIE_W_POLSCE_DE } from "@/lib/zycieWPolsceTranslationsDe";
import { VIVERE_IN_ITALIA_DE } from "@/lib/vivereInItaliaTranslationsDe";
import { VIVIR_EN_ESPANA_DE } from "@/lib/vivirEnEspanaTranslationsDe";
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
 * seven courses written in seven languages: Life in the UK is English, Leben
 * in Deutschland is German, Vivre en France is French, and the four newer
 * ones are Polish, Italian, Spanish and Russian. Without "from", the picker
 * would offer a German learner a German translation of German cards and
 * appear broken. A target language can read more than one of them, so
 * "from" is a LIST rather than a single language.
 *
 * The tables for one target language are merged into one lookup, because a
 * table is keyed by its course's own source text and two courses written in
 * two different languages cannot produce the same key. check-fr-translations
 * fails the build if they ever do.
 */

const KEY = "gl-course-translation";
const COURSE_TRANSLATION_CHANGE_EVENT = "gl-course-translation-change";

/** "off" means cards are not tappable and nothing is offered. */
export type TranslationLanguage = "off" | "de" | "en" | "pl" | "fr" | "ru";

/** The language a course is written in, which decides what can be offered. */
type ContentLanguage = "en" | "de" | "fr" | "pl" | "it" | "es" | "ru";

export const TRANSLATION_LANGUAGES: Array<{
  id: TranslationLanguage;
  label: string;
  endonym: string;
  /** The course languages this table can be offered beside. null for "off",
   *  which belongs in every list. */
  from: ContentLanguage[] | null;
}> = [
  { id: "off", label: "No translation", endonym: "No translation", from: null },
  // The four newer courses were taken in order of how hard they are to read
  // without help: Russian first, because Cyrillic is a wall rather than an
  // unfamiliar word, then Polish, then Italian, then Spanish. Guessing at a
  // sentence is not reading it, so all four ended up here — and with the
  // last of them there is no country course left where the picker has to
  // hide itself for want of a table.
  { id: "de", label: "German", endonym: "Deutsch", from: ["en", "fr", "ru", "pl", "it", "es"] },
  // English reached three of the seven country courses while German reached
  // all seven. Russian is the first of the four it could not read to be
  // closed, and deliberately the first: a Latin-alphabet sentence can be
  // guessed at without help, Cyrillic cannot, so this is where the missing
  // table actually stopped somebody reading.
  { id: "en", label: "English", endonym: "English", from: ["de", "fr", "ru", "pl", "it", "es"] },
  // All three country courses have Polish tables now.
  { id: "pl", label: "Polish", endonym: "Polski", from: ["en", "de", "fr", "it", "es", "ru"] },
  // English, German and now Polish. Vivre en France needs no French table —
  // those cards are already French.
  { id: "fr", label: "French", endonym: "Français", from: ["en", "de", "pl", "it", "es", "ru"] },
  // Russian became a complete interface language before it could read a
  // single country course: the app spoke Russian everywhere except at the one
  // switch beside a card. Leben in Deutschland is the first course it can
  // read, and deliberately the first — a Russian speaker sitting the German
  // citizenship test is who this course is for. The others follow, one entry
  // in this list each: Life in the UK and Zycie w Polsce next.
  { id: "ru", label: "Russian", endonym: "Русский", from: ["de", "en", "pl", "fr", "it", "es"] },
];

const TRANSLATIONS: Partial<Record<TranslationLanguage, Record<string, string>>> = {
  de: {
    ...LIFE_IN_THE_UK_DE, ...VIVRE_EN_FRANCE_DE, ...ZHIZN_V_ROSSII_DE, ...ZYCIE_W_POLSCE_DE,
    ...VIVERE_IN_ITALIA_DE, ...VIVIR_EN_ESPANA_DE, ...CSHARP_COURSE_DE,
    // The practice questions, which are not lesson text but reach the reader
    // through the same stepped session and the same marker.
    ...UK_QUESTION_BANK_DE,
    ...FR_QUESTION_BANK_DE,
    ...PL_QUESTION_BANK_DE,
    ...IT_QUESTION_BANK_DE,
    ...ES_QUESTION_BANK_DE,
    ...RU_QUESTION_BANK_DE,
  },
  en: {
    ...LEBEN_IN_DEUTSCHLAND_EN, ...VIVRE_EN_FRANCE_EN, ...ZHIZN_V_ROSSII_EN,
    ...ZYCIE_W_POLSCE_EN, ...VIVERE_IN_ITALIA_EN, ...VIVIR_EN_ESPANA_EN,
    // The practice questions, the same second body of text the German,
    // Polish, Russian and French tables answer. Six of the seven packs are
    // here; the seventh, Life in the UK, asks its questions in English
    // already.
    ...DE_QUESTION_BANK_EN,
    ...PL_QUESTION_BANK_EN,
    ...IT_QUESTION_BANK_EN,
    ...ES_QUESTION_BANK_EN,
    ...FR_QUESTION_BANK_EN,
    ...RU_QUESTION_BANK_EN,
  },
  pl: {
    ...LIFE_IN_THE_UK_PL, ...LEBEN_IN_DEUTSCHLAND_PL, ...VIVRE_EN_FRANCE_PL,
    ...VIVERE_IN_ITALIA_PL, ...VIVIR_EN_ESPANA_PL, ...ZHIZN_V_ROSSII_PL,
    // The practice questions, the same second body of text the German
    // tables above answer.
    ...UK_QUESTION_BANK_PL,
    ...DE_QUESTION_BANK_PL,
    ...FR_QUESTION_BANK_PL,
    ...IT_QUESTION_BANK_PL,
    ...ES_QUESTION_BANK_PL,
    ...RU_QUESTION_BANK_PL,
  },
  fr: {
    ...LIFE_IN_THE_UK_FR, ...LEBEN_IN_DEUTSCHLAND_FR, ...ZYCIE_W_POLSCE_FR,
    ...VIVERE_IN_ITALIA_FR, ...VIVIR_EN_ESPANA_FR, ...ZHIZN_V_ROSSII_FR,
    // The practice questions, the same second body of text the German,
    // Polish and Russian tables answer.
    ...UK_QUESTION_BANK_FR,
    ...DE_QUESTION_BANK_FR,
    ...PL_QUESTION_BANK_FR,
    ...IT_QUESTION_BANK_FR,
    ...ES_QUESTION_BANK_FR,
    ...RU_QUESTION_BANK_FR,
  },
  ru: {
    ...LEBEN_IN_DEUTSCHLAND_RU, ...LIFE_IN_THE_UK_RU, ...ZYCIE_W_POLSCE_RU,
    ...VIVRE_EN_FRANCE_RU, ...VIVERE_IN_ITALIA_RU, ...VIVIR_EN_ESPANA_RU,
    // The practice questions, the same second body of text the German and
    // Polish tables above answer.
    ...UK_QUESTION_BANK_RU,
    ...DE_QUESTION_BANK_RU,
    ...PL_QUESTION_BANK_RU,
    ...FR_QUESTION_BANK_RU,
    ...IT_QUESTION_BANK_RU,
    ...ES_QUESTION_BANK_RU,
  },
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
    inMemory = stored === "de" || stored === "en" || stored === "pl" || stored === "fr" || stored === "ru" ? stored : "off";
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
// Keyed on the interface languages themselves rather than on a copy of that
// union: adding one to the picker should be a line of data here or nothing at
// all, not a type error in an unrelated file — and the Partial is what says
// "nothing written for that reader yet", which the ?? below already answers.
const PROGRAMMING_COURSE_TRANSLATIONS: Partial<Record<ResolvedInterfaceLanguage, TranslationLanguage>> = {
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
function localiseLesson(lesson: Lesson, language: TranslationLanguage): Lesson {
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
