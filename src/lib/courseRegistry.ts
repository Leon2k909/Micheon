import type { Course } from "@/lib/courses";
import { csharpCourse } from "@/lib/csharpCourse";
import { lifeInTheUkCourse } from "@/lib/lifeInTheUkCourse";
import { lebenInDeutschlandCourse } from "@/lib/lebenInDeutschlandCourse";
import { vivreEnFranceCourse } from "@/lib/vivreEnFranceCourse";
import { zycieWPolsceCourse } from "@/lib/zycieWPolsceCourse";
import { vivereInItaliaCourse } from "@/lib/vivereInItaliaCourse";
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
  // French is the third course made of this same material, and it is now
  // complete: 9,000 word cards, 12,041 sentences and 3,500 dialogue lines, the
  // German course entry for entry. It began as a narrowing — the table reached
  // about a third of the catalogue and frenchCourse.ts dropped the rest rather
  // than serve two cards in three blank — and that filter is still there, but
  // it no longer has anything to drop. What kept a thousand entries out at the
  // end was spelling, not translation: the packs hold "Ich verstehe" and the
  // course serves the spoken "Ich versteh", so the table needed both. See
  // frenchCourse.ts.
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
  // Italian is the second of those, on the same terms: italianTranslations.ts
  // covers the catalogue entry for entry, so nothing a learner meets in German
  // is missing from it either. See italianCourse.ts.
  {
    id: "italian",
    kind: "language",
    name: "Italian",
    tagline: "Read, listen, type and translate real Italian.",
    icon: "🇮🇹",
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
  // Russian is the seventh, and the first written in another alphabet. Cards
  // are held in Cyrillic and can be READ in Cyrillic or in one of five Latin
  // transcriptions, whichever the learner picks — see russianScript.ts. Its
  // vocabulary is still being written, so the course is short and grows with
  // each block; the tagline promises what it does rather than how much.
  {
    id: "russian",
    kind: "language",
    name: "Russian",
    tagline: "Learn Russian in Cyrillic, or in letters you already read.",
    icon: "🇷🇺",
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
  vivereInItaliaCourse,
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
