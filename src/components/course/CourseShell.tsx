import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Globe, Landmark, Scale, Star, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/courses";
import { loadCourseProgress, resolveLessonForBackground, saveCourseProgress } from "@/lib/courses";
import { getCodeBackground } from "@/lib/codeBackground";
import { getAuthUser } from "@/lib/profileStorage";
import { LessonBlocks } from "@/components/course/LessonBlocks";
import { useScrollLock } from "@/lib/scrollLock";

/**
 * One look per chapter, taken in order rather than by name.
 *
 * A course brings however many chapters it brings — five for the British
 * course, three for the German one — so this is indexed into and wrapped.
 * Keying it on chapter titles would style one course and leave every other
 * one grey.
 *
 * Colours sit at mid saturation so they hold up on the light ground as well
 * as the dark, and they are applied inline: Tailwind arbitrary values emit
 * no rule in this project, so a class like text-[#a78bfa] would do nothing.
 */
const CHAPTER_LOOKS = [
  { icon: Star, colour: "#a78bfa" },
  { icon: Globe, colour: "#60a5fa" },
  { icon: Landmark, colour: "#34d399" },
  { icon: Scale, colour: "#fbbf24" },
  { icon: Users, colour: "#f472b6" },
] as const;

export function CourseShell({ course, onExit, initialLessonId }: { course: Course; onExit: () => void; initialLessonId?: string }) {
  // The shell underneath is still scrollable, which is where the second
  // scrollbar came from. Before any early return, so the hook count is stable.
  useScrollLock();
  const user = getAuthUser();
  const lessons = course.lessons ?? [];
  const [activeId, setActiveId] = useState(initialLessonId ?? lessons[0]?.id ?? "");
  const [completed, setCompleted] = useState<string[]>(() => loadCourseProgress(course.id, user));

  const activeIndex = Math.max(0, lessons.findIndex((l) => l.id === activeId));
  const lesson = lessons[activeIndex];
  const nextLesson = lessons[activeIndex + 1];

  const sections = useMemo(() => {
    const map = new Map<string, typeof lessons>();
    for (const l of lessons) {
      if (!map.has(l.section)) map.set(l.section, []);
      map.get(l.section)!.push(l);
    }
    return Array.from(map.entries());
  }, [lessons]);

  const progressPct = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;

  const markComplete = (id: string) => {
    if (completed.includes(id)) return;
    const next = [...completed, id];
    setCompleted(next);
    saveCourseProgress(course.id, next, user);
  };

  const go = (id: string) => {
    setActiveId(id);
    const main = document.getElementById("course-scroll");
    if (main) main.scrollTo(0, 0);
  };

  if (!lesson) {
    return (
      <div className="app-overlay fixed inset-0 z-[180] flex items-center justify-center bg-[var(--bg)] text-[var(--text-1)]">
        <p className="text-sm font-semibold">This course has no lessons yet.</p>
      </div>
    );
  }

  return (
    <div className="app-overlay fixed inset-0 z-[180] flex flex-col bg-[var(--bg)] text-[var(--text-1)]">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-2)] text-base font-black text-[var(--accent)]">
          {course.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-[var(--text-1)]">{course.name}</p>
          <p className="text-[11px] font-semibold text-[var(--text-3)]">{completed.length}/{lessons.length} lessons · {progressPct}%</p>
        </div>
        <div className="hidden h-1.5 w-40 overflow-hidden rounded-full bg-[var(--surface-2)] sm:block">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
        >
          <X className="h-4 w-4" /> Exit
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-3 md:block">
          {sections.map(([section, items], sectionIndex) => {
            const look = CHAPTER_LOOKS[sectionIndex % CHAPTER_LOOKS.length];
            const ChapterIcon = look.icon;
            return (
              <div key={section} className="mb-5">
                <div className="mb-2 flex items-center gap-2 px-1">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: look.colour + "26", color: look.colour }}
                  >
                    <ChapterIcon className="h-3.5 w-3.5" />
                  </span>
                  {/* The heading takes the icon's colour so the eye can find a
                      chapter without reading it. It wraps rather than
                      truncating — a cut-off chapter name is worse than two
                      lines of it. */}
                  <p
                    className="min-w-0 text-[10.5px] font-black uppercase leading-tight tracking-wide"
                    style={{ color: look.colour }}
                  >
                    {section}
                  </p>
                </div>
                <div className="grid gap-1.5">
                  {items.map((l) => {
                    const active = l.id === activeId;
                    const done = completed.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => go(l.id)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition-colors",
                          active
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                        )}
                      >
                        {/* Wraps: the old rail truncated every long title, so
                            "British Values & Principles" read as "British
                            Values & Princ…" and two chapters ended up
                            indistinguishable. */}
                        <span className="min-w-0 flex-1 leading-snug">{l.title}</span>
                        {done ? (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                              active ? "bg-white/25 text-white" : "bg-[var(--success-bg)] text-[var(--success-text)]"
                            )}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        ) : (
                          <ChevronRight
                            aria-hidden="true"
                            className={cn("h-3.5 w-3.5 shrink-0", active ? "text-white/70" : "text-[var(--text-3)]")}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Content */}
        <main id="course-scroll" className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Mobile lesson picker */}
            <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
              {lessons.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => go(l.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-black transition-colors",
                    l.id === activeId ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-2)] text-[var(--text-2)]"
                  )}
                >
                  {l.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-1)]">{lesson.title}</h2>
              {lesson.badge && (
                <span className="rounded-md bg-[var(--success-bg)] px-2 py-1 text-[11px] font-black text-[var(--success-text)]">
                  {lesson.badge}
                </span>
              )}
            </div>

            <div className="mt-4">
              <LessonBlocks blocks={resolveLessonForBackground(lesson, getCodeBackground()).blocks} readingOnly />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => go(lessons[activeIndex - 1].id)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {/* Reaching the end of a lesson is what completes it here.
                  It used to be answering a question correctly, but the reader
                  no longer shows questions — without this the progress counter
                  at the top would sit at 0/23 however much you read. */}
              {nextLesson ? (
                <button
                  type="button"
                  onClick={() => { markComplete(lesson.id); go(nextLesson.id); }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-black text-white transition-opacity hover:opacity-90"
                >
                  Next: {nextLesson.title} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { markComplete(lesson.id); onExit(); }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-black text-white"
                >
                  Finish <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
