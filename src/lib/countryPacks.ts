import type { CountryId, CountryPack } from "@/lib/countryStudies";
import { lifeInTheUkCourse } from "@/lib/lifeInTheUkCourse";
import { UK_QUESTIONS } from "@/lib/ukQuestionBank";
import { UK_ERA_LABELS, UK_ERA_ORDER, UK_TIMELINE } from "@/lib/lifeInTheUkTimeline";
import { lebenInDeutschlandCourse } from "@/lib/lebenInDeutschlandCourse";
import { DE_QUESTIONS } from "@/lib/deQuestionBank";
import { DE_ERA_LABELS, DE_ERA_ORDER, DE_TIMELINE } from "@/lib/lebenInDeutschlandTimeline";
import { vivreEnFranceCourse } from "@/lib/vivreEnFranceCourse";
import { FR_QUESTIONS } from "@/lib/frQuestionBank";
import { FR_ERA_LABELS, FR_ERA_ORDER, FR_TIMELINE } from "@/lib/vivreEnFranceTimeline";

/**
 * The countries Country studies covers.
 *
 * One bundle each. The UK bundle points at the files that were already there
 * and changes none of them — its store key is still "uk-quiz-v1", so nobody
 * loses the progress they have. Germany and France are the same shape filled
 * with their own material, which is the whole point: same structure, same
 * flow, different content.
 *
 * Adding a fourth country means adding a bundle here, one line in
 * COUNTRY_SEARCH_EXAMPLES and one picture in COUNTRY_ART. Nothing else.
 */

export const UK_PACK: CountryPack = {
  id: "uk",
  flagId: "english-uk",
  label: "United Kingdom – Land and Culture",
  country: "United Kingdom",
  course: lifeInTheUkCourse,
  questions: UK_QUESTIONS,
  timeline: UK_TIMELINE,
  eraOrder: [...UK_ERA_ORDER],
  eraLabels: UK_ERA_LABELS,
  storeKey: "uk-quiz-v1",
  exam: {
    questionCount: 24,
    durationMs: 45 * 60 * 1000,
    passMark: 18,
  },
  contentLang: "en",
};

/**
 * Leben in Deutschland.
 *
 * The real test is 33 questions in 60 minutes with 17 to pass — 30 from the
 * national catalogue and 3 about the state you sit it in. The simulation uses
 * the national figures; the state-specific three have no equivalent here
 * because the app does not ask which Bundesland someone lives in.
 *
 * The material is in German because the test is in German. Learning the facts
 * in English and then meeting them in German on the day is how people fail.
 */
export const DE_PACK: CountryPack = {
  id: "de",
  flagId: "german",
  label: "Germany – Land and Culture",
  country: "Germany",
  course: lebenInDeutschlandCourse,
  questions: DE_QUESTIONS,
  timeline: DE_TIMELINE,
  eraOrder: [...DE_ERA_ORDER],
  eraLabels: DE_ERA_LABELS,
  storeKey: "de-quiz-v1",
  exam: {
    questionCount: 33,
    durationMs: 60 * 60 * 1000,
    passMark: 17,
  },
  contentLang: "de",
};

/**
 * Vivre en France.
 *
 * L'examen civique : 40 questions à choix multiples en 45 minutes au maximum,
 * et 32 bonnes réponses — 80 % — pour le réussir. Il est exigé depuis le
 * 1er janvier 2026 pour toute demande de naturalisation. Sur les 40 questions,
 * 28 portent sur des connaissances et 12 sont des mises en situation ; la
 * simulation tire dans le même pool, comme les deux autres pays.
 *
 * Le contenu est en français parce que l'examen se passe en français.
 */
export const FR_PACK: CountryPack = {
  id: "fr",
  flagId: "french",
  label: "France – Land and Culture",
  country: "France",
  course: vivreEnFranceCourse,
  questions: FR_QUESTIONS,
  timeline: FR_TIMELINE,
  eraOrder: [...FR_ERA_ORDER],
  eraLabels: FR_ERA_LABELS,
  storeKey: "fr-quiz-v1",
  exam: {
    questionCount: 40,
    durationMs: 45 * 60 * 1000,
    passMark: 32,
  },
  contentLang: "fr",
};

export const COUNTRY_PACKS: CountryPack[] = [UK_PACK, DE_PACK, FR_PACK];

export function countryPack(id: CountryId): CountryPack {
  return COUNTRY_PACKS.find((pack) => pack.id === id) ?? UK_PACK;
}

/** The chapters a country's course teaches, in course order. */
export function packChapters(pack: CountryPack): string[] {
  const seen: string[] = [];
  for (const lesson of pack.course.lessons ?? []) {
    if (!seen.includes(lesson.section)) seen.push(lesson.section);
  }
  return seen;
}

export function packCategories(pack: CountryPack) {
  return (pack.course.lessons ?? []).map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    chapter: lesson.section,
    count: pack.questions.filter((question) => question.lesson === lesson.id).length,
  }));
}

export function packLessonTitle(pack: CountryPack, lessonId: string): string {
  return (pack.course.lessons ?? []).find((lesson) => lesson.id === lessonId)?.title ?? lessonId;
}

const sortYear = (entry: { year: number; endYear?: number }) => entry.endYear ?? entry.year;

/** Chronological, with spans placed at the year they ended. */
export function packTimelineSorted(pack: CountryPack) {
  return [...pack.timeline].sort((a, b) => sortYear(a) - sortYear(b) || a.year - b.year);
}
