import type { Course } from "@/lib/courses";
import { csharpCourse } from "@/lib/csharpCourse";
import { lifeInTheUkCourse } from "@/lib/lifeInTheUkCourse";
import { PLANNED_LANGUAGES } from "@/lib/languageCatalogue";

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
  {
    id: "spanish",
    kind: "language",
    name: "Spanish",
    tagline: "Coming soon.",
    icon: "🇪🇸",
    available: false,
  },
  {
    id: "french",
    kind: "language",
    name: "French",
    tagline: "Coming soon.",
    icon: "🇫🇷",
    available: false,
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
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
