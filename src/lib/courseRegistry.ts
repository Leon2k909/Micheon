import type { Course } from "@/lib/courses";
import { csharpCourse } from "@/lib/csharpCourse";
import { lifeInTheUkCourse } from "@/lib/lifeInTheUkCourse";
import { lebenInDeutschlandCourse } from "@/lib/lebenInDeutschlandCourse";
import { vivreEnFranceCourse } from "@/lib/vivreEnFranceCourse";
import { zycieWPolsceCourse } from "@/lib/zycieWPolsceCourse";
import { PLANNED_LANGUAGES } from "@/lib/languageCatalogue";
import { localiseCourse } from "@/lib/courseTranslation";

// The native German experience is "built in" — selecting it returns to the
// normal app. Other courses render through the in-app course shell.
export const COURSES: Course[] = [
  {
    id: "german",
    kind: "language",
    name: "German",
    tagline: "Read, listen, type and translate real German.",
    icon: "🇩🇪",
    available: true,
    builtIn: true,
  },
  // The app has always been able to teach English to a German speaker -- it
  // is the learn-en direction, with the same content read the other way. It
  // was simply never listed as a course, so the one person here who is
  // learning English saw a picker that only offered German.
  {
    id: "english-uk",
    kind: "language",
    name: "English (UK)",
    tagline: "British spelling and accent — colour, practise, timetable.",
    icon: "🇬🇧",
    available: true,
    builtIn: true,
  },
  {
    id: "english-us",
    kind: "language",
    name: "English (US)",
    tagline: "American spelling and accent — color, practice, schedule.",
    icon: "🇺🇸",
    available: true,
    builtIn: true,
  },
  // French is the third course made of this same material. The app holds
  // German↔French translations for around a third of the catalogue — some
  // written inline on the entry, the rest in frenchTranslations.ts — and the
  // course is NARROWED to those rather than served with two cards in three
  // blank. What is left is roughly seven thousand words, phrases and dialogue
  // lines, all of which have an answer. See frenchCourse.ts.
  {
    id: "french",
    kind: "language",
    name: "French",
    tagline: "Read, listen, type and translate real French.",
    icon: "🇫🇷",
    available: true,
    builtIn: true,
  },
  // Polish is the fourth, on exactly the same terms — polishTranslations.ts
  // holds German↔Polish for a quarter of the catalogue, and polishCourse.ts
  // narrows the packs to it. The opening stretch of the curriculum survives
  // whole, which is what a beginner actually meets.
  {
    id: "polish",
    kind: "language",
    name: "Polish",
    tagline: "Read, listen, type and translate real Polish.",
    icon: "🇵🇱",
    available: true,
    builtIn: true,
  },
  // Spanish is the fifth, and the first of the table-backed courses that is
  // NOT narrowed. French covers about a third of the catalogue and Polish a
  // quarter, so both drop what they cannot say; spanishTranslations.ts covers
  // all of it — 9,000 word cards, 12,000 sentences, 3,482 dialogue lines —
  // so the Spanish course is the German one entry for entry, and nothing a
  // learner meets in German is missing from it. See spanishCourse.ts.
  {
    id: "spanish",
    kind: "language",
    name: "Spanish",
    tagline: "Read, listen, type and translate real Spanish.",
    icon: "🇪🇸",
    available: true,
    builtIn: true,
  },
  {
    id: "portuguese",
    kind: "language",
    name: "Portuguese",
    tagline: "Read, listen, type and translate real Portuguese.",
    icon: "🇵🇹",
    available: true,
    builtIn: true,
  },
  // Everything else people might come looking for. Listed, searchable and
  // honest about not being ready — a picker with three rows makes someone
  // wonder whether their language was considered and rejected.
  ...PLANNED_LANGUAGES.map((language) => ({
    id: language.id,
    kind: "language" as const,
    name: language.name,
    tagline: "Coming soon.",
    icon: language.icon,
    available: false,
  })),
  csharpCourse,
  lifeInTheUkCourse,
  lebenInDeutschlandCourse,
  vivreEnFranceCourse,
  // A country pack is not enough on its own: the chooser lists COURSES,
  // so Poland shipped complete and unreachable — four packs on the home
  // card, three rows in the dialog that is the only way in.
  zycieWPolsceCourse,
];

/**
 * One lookup, so one place decides what language the course is read in.
 *
 * Every screen that shows a course — the dashboard, the lesson list, the
 * reader, the session and its quizzes — gets its Course from here. Localising
 * at the lookup means none of them has to know, and none of them can be the
 * one screen somebody forgot.
 */
export function getCourse(id: string): Course | undefined {
  const course = COURSES.find((c) => c.id === id);
  return course && localiseCourse(course);
}

const PLANNED_IDS = new Set(PLANNED_LANGUAGES.map((language) => language.id));

/**
 * Which language rows the picker draws before anyone asks for more.
 *
 * All but a handful of the eighty-eight say Coming soon, and drawing all of
 * them cost 123 ms of render on every open — 12,324px of list inside a window
 * that shows about six hundred. So the ones that can be chosen, plus the one
 * written out by hand with its own flag, are drawn straight away and the
 * catalogue waits to be asked for.
 *
 * Searching overrides that completely, because finding your language is the
 * question the long list exists to answer: typing "farsi" has to reach Persian
 * without pressing anything first.
 *
 * A function rather than a line inside the component so it can be checked
 * against the real course list instead of by reading the source.
 */
export function visibleLanguageRows(
  languages: Course[],
  { searching, showAll }: { searching: boolean; showAll: boolean }
): Course[] {
  if (searching || showAll) return languages;
  return languages.filter((course) => !PLANNED_IDS.has(course.id));
}

/**
 * The picker's lists, in the order they are read.
 *
 * Every row carries an English name underneath, but it shows the name in the
 * interface language, so the order has to follow what is actually on the row:
 * Spanish belongs under S in German and espagnol under E in French. Sorting
 * the English names would have looked shuffled in every language but one.
 *
 * Intl does the comparing rather than a plain string sort, which is what puts
 * Ae beside A and L-stroke beside L instead of after Z - the picker lists
 * eighty-seven languages and plenty of them are spelled with marks.
 *
 * A function here rather than a sort written into the component, so a course
 * added tomorrow lands in its place without anybody remembering a list, and
 * so the order can be checked against real names instead of by reading the
 * source.
 */
export function sortCoursesByName<T extends { name: string }>(
  courses: T[],
  shownName: (name: string) => string,
  locale: string
): T[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base", numeric: true });
  return [...courses].sort((a, b) => collator.compare(shownName(a.name), shownName(b.name)));
}
