import React, { useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/courses";
import { loadCourseProgress, resolveLessonForBackground, saveCourseProgress } from "@/lib/courses";
import { getCodeBackground } from "@/lib/codeBackground";
import { getAuthUser } from "@/lib/profileStorage";
import { LessonBlocks } from "@/components/course/LessonBlocks";

export function CourseShell({ course, onExit, initialLessonId }: { course: Course; onExit: () => void; initialLessonId?: string }) {
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
      <div className="fixed inset-0 z-[180] flex items-center justify-center bg-[var(--bg)] text-[var(--text-1)]">
        <p className="text-sm font-semibold">This course has no lessons yet.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[180] flex flex-col bg-[var(--bg)] text-[var(--text-1)]">
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
        <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-3 md:block">
          {sections.map(([section, items]) => (
            <div key={section} className="mb-3">
              <p className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">{section}</p>
              {items.map((l) => {
                const active = l.id === activeId;
                const done = completed.includes(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => go(l.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-semibold transition-colors",
                      active ? "bg-[var(--surface-2)] text-[var(--text-1)]" : "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                    )}
                  >
                    <span className="truncate">{l.title}</span>
                    {done && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--success-text)]" />}
                  </button>
                );
              })}
            </div>
          ))}
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
              <LessonBlocks blocks={resolveLessonForBackground(lesson, getCodeBackground()).blocks} onQuizCorrect={() => markComplete(lesson.id)} />
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
              {nextLesson ? (
                <button
                  type="button"
                  onClick={() => go(nextLesson.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-black text-white transition-opacity hover:opacity-90"
                >
                  Next: {nextLesson.title} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onExit}
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
