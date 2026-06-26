import React from "react";
import { ArrowRight, BookOpen, Check, Code2, Trophy } from "lucide-react";
import type { Course } from "@/lib/courses";
import { loadCourseProgress } from "@/lib/courses";
import { getAuthUser } from "@/lib/profileStorage";

export function CourseDashboardView({
  course,
  onOpenLesson,
  onOpenReader,
  onBrowseLessons,
}: {
  course: Course;
  onOpenLesson: (lessonId: string) => void;
  onOpenReader: () => void;
  onBrowseLessons: () => void;
}) {
  const lessons = course.lessons ?? [];
  const completed = new Set(loadCourseProgress(course.id, getAuthUser()));
  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  const nextLesson = lessons.find((l) => !completed.has(l.id)) ?? lessons[0];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className="card course-feature-card flex flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="course-feature-pill rounded-full px-3 py-1 text-[11px] font-black">
              {course.name}
            </span>
            <span className="course-feature-pill-success rounded-full px-3 py-1 text-[11px] font-black">
              {pct}% complete
            </span>
          </div>
          <h2 className="course-feature-title mt-4 text-2xl font-black leading-tight tracking-tight">
            {nextLesson ? nextLesson.title : "Course complete"}
          </h2>
          <p className="course-feature-copy mt-2 max-w-md text-sm leading-6">
            {doneCount === 0
              ? "Start from the top — variables, types, then build up to s&box game code."
              : nextLesson
                ? `Pick up where you left off. ${doneCount} of ${lessons.length} lessons done.`
                : "You've completed every lesson. Revisit any topic from the course material."}
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="course-feature-panel rounded-[18px] p-4">
            <p className="course-feature-label text-[11px] font-bold">Course progress</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="course-feature-progress-track h-4 flex-1 rounded-full">
                <div className="course-feature-progress h-full rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="course-feature-title text-sm font-black">{doneCount}/{lessons.length}</span>
            </div>
          </div>
        </div>

        <button
          className="accent-btn mt-6 inline-flex h-12 w-full items-center justify-center gap-2 text-sm"
          onClick={() => (nextLesson ? onOpenLesson(nextLesson.id) : onOpenReader())}
          type="button"
        >
          {doneCount === 0 ? "Start learning" : nextLesson ? "Continue learning" : "Review course"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onBrowseLessons}
          className="card card-hover flex items-center gap-4 p-5 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-[var(--text-1)]">Browse lessons</p>
            <p className="text-xs font-semibold text-[var(--text-3)]">{lessons.length} lessons across {new Set(lessons.map((l) => l.section)).size} sections</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-3)]" />
        </button>

        <button
          type="button"
          onClick={onOpenReader}
          className="card card-hover flex items-center gap-4 p-5 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-[var(--text-1)]">Course material</p>
            <p className="text-xs font-semibold text-[var(--text-3)]">Read everything with the full sidebar view</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-3)]" />
        </button>
      </section>

      {/* Recent / up next list */}
      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">Up next</h2>
          <Trophy className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <div className="mt-4 space-y-2">
          {lessons.slice(0, 6).map((lesson) => {
            const done = completed.has(lesson.id);
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onOpenLesson(lesson.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5 text-left transition-colors hover:bg-[var(--surface-3)]"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-[var(--success-bg)] text-[var(--success-text)]" : "bg-[var(--surface)] text-[var(--text-3)]"}`}>
                  {done ? <Check className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[var(--text-1)]">{lesson.title}</p>
                  <p className="truncate text-[11px] font-semibold text-[var(--text-3)]">{lesson.section}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
