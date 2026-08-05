import type { Course } from "@/lib/courses";
import { csharpCourse } from "@/lib/csharpCourse";
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
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
