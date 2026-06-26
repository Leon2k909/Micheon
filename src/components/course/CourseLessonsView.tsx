import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Check, Code2 } from "lucide-react";
import type { Course } from "@/lib/courses";
import { loadCourseProgress } from "@/lib/courses";
import { getAuthUser } from "@/lib/profileStorage";

export function CourseLessonsView({
  course,
  onOpenLesson,
  onOpenReader,
}: {
  course: Course;
  onOpenLesson: (lessonId: string) => void;
  onOpenReader: () => void;
}) {
  const lessons = course.lessons ?? [];
  const completed = new Set(loadCourseProgress(course.id, getAuthUser()));

  const sections: [string, typeof lessons][] = [];
  for (const l of lessons) {
    const existing = sections.find(([s]) => s === l.section);
    if (existing) existing[1].push(l);
    else sections.push([l.section, [l]]);
  }

  const doneCount = lessons.filter((l) => completed.has(l.id)).length;

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">{course.name}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-2)]">{course.tagline}</p>
          </div>
          <button
            type="button"
            onClick={onOpenReader}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90"
          >
            <BookOpen className="h-4 w-4" /> Read full course
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:max-w-xs">
          <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
            <p className="text-2xl font-black text-[var(--text-1)]">{lessons.length}</p>
            <p className="text-[11px] font-bold text-[var(--text-3)]">lessons</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
            <p className="text-2xl font-black text-[var(--text-1)]">{doneCount}</p>
            <p className="text-[11px] font-bold text-[var(--text-3)]">completed</p>
          </div>
        </div>
      </section>

      {sections.map(([section, items]) => (
        <section key={section}>
          <h2 className="mb-3 px-1 text-sm font-black uppercase tracking-wide text-[var(--text-3)]">{section}</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((lesson) => {
              const done = completed.has(lesson.id);
              return (
                <motion.button
                  key={lesson.id}
                  className="card card-hover min-h-[150px] p-5 text-left"
                  onClick={() => onOpenLesson(lesson.id)}
                  type="button"
                  whileTap={{ scale: 0.985 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                      <Code2 className="h-5 w-5" />
                    </div>
                    {done ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-[11px] font-black text-[var(--success-text)]">
                        <Check className="h-3 w-3" /> Done
                      </span>
                    ) : lesson.badge ? (
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-1)]">
                        {lesson.badge}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-lg font-black leading-tight tracking-tight text-[var(--text-1)]">{lesson.title}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-[var(--text-3)]">{lesson.blocks.length} sections</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#070707] text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
