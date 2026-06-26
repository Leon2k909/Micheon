import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

// ── Block model for generic lesson rendering ──────────────────
export type Block =
  | { type: "p"; text: string }                                   // inline `code` via backticks
  | { type: "h3"; text: string }
  | { type: "code"; code: string }
  | { type: "callout"; variant: CalloutVariant; text: string }
  | { type: "twocol"; left: ColCard; right: ColCard }
  | { type: "cards"; items: { h4: string; p: string }[] }
  | { type: "quiz"; q: string; options: QuizOption[]; explanation: string }
  | { type: "cta"; title: string; sub: string };

export type CalloutVariant = "why" | "warn" | "sbox" | "python" | "analogy";
export type ColCard = { lang: string; code: string };
export type QuizOption = { text: string; correct: boolean };

export type Lesson = {
  id: string;
  title: string;
  section: string;
  badge?: string;
  blocks: Block[];
};

export type CourseKind = "language" | "programming";

export type Course = {
  id: string;
  kind: CourseKind;
  name: string;
  tagline: string;
  icon: string;          // emoji for the switcher
  available: boolean;
  builtIn?: boolean;     // the native German Lab experience
  lessons?: Lesson[];    // present for in-app courses (e.g. csharp)
};

// ── Active-course persistence ─────────────────────────────────
export const ACTIVE_COURSE_KEY = "active-course";
export const COURSE_PROGRESS_PREFIX = "course-progress";

export function getActiveCourseId(profile: UserProfile | null = getAuthUser()): string {
  return loadScopedJson<string>(ACTIVE_COURSE_KEY, "german", profile) || "german";
}

export function setActiveCourseId(id: string, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(ACTIVE_COURSE_KEY, id, profile);
}

// Per-course set of completed lesson ids (quiz answered correctly).
export function loadCourseProgress(courseId: string, profile: UserProfile | null = getAuthUser()): string[] {
  const raw = loadScopedJson<string[]>(`${COURSE_PROGRESS_PREFIX}:${courseId}`, [], profile);
  return Array.isArray(raw) ? raw : [];
}

export function saveCourseProgress(courseId: string, completed: string[], profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(`${COURSE_PROGRESS_PREFIX}:${courseId}`, Array.from(new Set(completed)), profile);
}
