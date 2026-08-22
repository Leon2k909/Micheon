import type { Course } from "@/lib/courses";

/**
 * What a country in Country studies is made of.
 *
 * Michelle asked for Germany beside the UK, built to the same pattern: same
 * navigation, same category types, same presentation, same learning logic,
 * same quiz structure, same progress logic, same user flow — only the content
 * differs. So the views and the progress engine had to stop naming one country
 * and start taking one as an argument.
 *
 * This file holds ONLY types. The bundles that fill them in live in
 * countryPacks.ts, which imports the course and question data. Keeping the two
 * apart is what stops the cycle: deQuestionBank imports these types, and
 * countryPacks imports deQuestionBank.
 *
 * The UK types (UkQuestion, UkLevel) are structurally identical, so UK data
 * drops into these slots without a single edit to the UK files — which was the
 * other requirement: "Die UK-Landeskunde darf dabei nicht verändert oder
 * entfernt werden."
 */

export type CountryId = "uk" | "de";

export type CountryLevel = "easy" | "medium" | "hard";

export type CountryQuestion = {
  /** Stable across releases: progress, mistakes and favourites are keyed on it. */
  id: string;
  /** The id of the lesson that teaches this. */
  lesson: string;
  level: CountryLevel;
  q: string;
  options: string[];
  /** Index into options. Exactly one right answer. */
  answer: number;
  explanation: string;
};

export type CountryCategory = {
  id: string;
  title: string;
  chapter: string;
  count: number;
};

/**
 * A dated entry on a country's timeline.
 *
 * Field for field the shape UkTimelineEvent already had, so the existing UK
 * timeline satisfies it without being touched. era is a plain string here
 * because each country names its own eras.
 */
export type CountryTimelineEvent = {
  id: string;
  year: number;
  /** The year a span ENDED, for entries that cover one. The list sorts on this. */
  endYear?: number;
  displayYear: string;
  title: string;
  summary: string;
  /** The longer text revealed on click. */
  detail: string;
  era: string;
  /** Which syllabus area it belongs to, as a label. */
  category: string;
  /** People, places and terms, so search reaches this event by any of them. */
  tags: string[];
};

/**
 * Everything a country study needs to run.
 *
 * One object per country, passed down to the views instead of imported by
 * them. Adding a third country means writing a third pack, not editing a view.
 */
export type CountryPack = {
  id: CountryId;
  /** The flag roundel shown beside the country in the sidebar. */
  flagId: string;
  /** Shown in the sidebar and as the heading of every section. */
  label: string;
  /** The course this country teaches from. */
  course: Course;
  /** The practice pool, separate from the quizzes inside the lessons. */
  questions: CountryQuestion[];
  timeline: CountryTimelineEvent[];
  eraOrder: string[];
  eraLabels: Record<string, string>;
  /**
   * Where this country's progress is stored.
   *
   * Separate per country on purpose: a wrong answer about the Bundesrat should
   * not turn up in the UK mistake list, and neither streak should reset the
   * other. The UK keeps "uk-quiz-v1" so nobody loses the progress they already
   * have.
   */
  storeKey: string;
  /** The real exam this country's test simulation imitates. */
  exam: {
    questionCount: number;
    durationMs: number;
    passMark: number;
  };
  /** The language the material is written in — the language of the real test. */
  contentLang: "en" | "de";
};

export const COUNTRY_LEVELS: CountryLevel[] = ["easy", "medium", "hard"];
