import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";
import type { CodeBackground } from "@/lib/codeBackground";

// ── Block model for generic lesson rendering ──────────────────
// Blocks that reference the learner's prior language (Python by default) can
// carry alternates: textJs / textNew for prose+callouts, leftJs for the
// comparison column. resolveLessonForBackground() picks the right variant.
export type Block =
  | { type: "p"; text: string; textJs?: string; textNew?: string }  // inline `code` via backticks
  | { type: "h3"; text: string }
  | { type: "code"; code: string }
  | { type: "callout"; variant: CalloutVariant; text: string; textJs?: string; textNew?: string }
  | { type: "twocol"; left: ColCard; leftJs?: ColCard; right: ColCard }
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

/**
 * Adapt a lesson to the learner's programming background.
 * - python (or unset): original content, Python comparisons.
 * - js: swap Python prose/columns for JavaScript ones where provided.
 * - new: no prior language — comparison columns collapse to just the C# code,
 *   and Python-referencing prose uses its beginner variant (or is dropped for
 *   "from Python" callouts with no beginner text).
 */
export function resolveLessonForBackground(lesson: Lesson, bg: CodeBackground | null): Lesson {
  if (!bg || bg === "python") return lesson;
  const blocks: Block[] = [];
  for (const block of lesson.blocks) {
    switch (block.type) {
      case "p":
        blocks.push({ ...block, text: (bg === "js" ? block.textJs : block.textNew) ?? block.text });
        break;
      case "callout": {
        const alt = bg === "js" ? block.textJs : block.textNew;
        if (block.variant === "python" && bg === "new" && !alt) break; // comparison is meaningless — drop it
        blocks.push({ ...block, text: alt ?? block.text });
        break;
      }
      case "twocol":
        if (bg === "new") blocks.push({ type: "code", code: block.right.code });
        else blocks.push({ ...block, left: block.leftJs ?? block.left });
        break;
      default:
        blocks.push(block);
    }
  }
  return { ...lesson, blocks };
}

export type CourseKind = "language" | "programming";

export type Course = {
  id: string;
  kind: CourseKind;
  name: string;
  tagline: string;
  icon: string;          // emoji for the switcher
  available: boolean;
  builtIn?: boolean;     // the native Micheon experience
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
