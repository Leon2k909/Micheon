import type { Course } from "@/lib/courses";
import { csharpCourse } from "@/lib/csharpCourse";

// The native German experience is "built in" — selecting it returns to the
// normal app. Other courses render through the in-app course shell.
export const COURSES: Course[] = [
  {
    id: "german",
    kind: "language",
    name: "German",
    tagline: "Read, listen, speak, type and translate real German.",
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
  csharpCourse,
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
