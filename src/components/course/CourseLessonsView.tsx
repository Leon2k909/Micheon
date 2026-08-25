import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Check, Code2, Landmark, Sparkles } from "lucide-react";
import type { Course } from "@/lib/courses";
import { loadCourseProgress } from "@/lib/courses";
import { CODE_BACKGROUND_LABEL, getCodeBackground, setCodeBackground, type CodeBackground } from "@/lib/codeBackground";
import { getAuthUser } from "@/lib/profileStorage";
import { ui, uiFmt } from "@/lib/i18n";
import { courseReadingLanguage, translateCourseText, useTranslationLanguage } from "@/lib/courseTranslation";

/**
 * "lesson 16" beside "Fertig" is the worst of both languages, so the numbered
 * badges follow the interface language. Only the two known shapes are
 * translated; anything else (the C# course's "s&box") passes through
 * unchanged rather than being lost to a missing key.
 */
function badgeLabel(badge: string): string {
  const numbered = /^(lesson|practice)\s+(\d+)$/i.exec(badge.trim());
  if (!numbered) return ui(badge);
  const n = numbered[2];
  return numbered[1].toLowerCase() === "lesson"
    ? uiFmt("lesson {n}", { n })
    : uiFmt("practice {n}", { n });
}

const BACKGROUND_OPTIONS: { key: CodeBackground; label: string; sub: string }[] = [
  { key: "python", label: "🐍 Python", sub: "Explanations compare C# to Python" },
  { key: "js", label: "🟨 JavaScript", sub: "Explanations compare C# to JS" },
  { key: "new", label: "🌱 I'm new to coding", sub: "No comparisons — plain-English explanations" },
];

/**
 * Course tagline adapted to the learner's background.
 *
 * The alternates are written here rather than on the course, so they are the
 * one string on this screen that never passed through the course lookup — and
 * a German reader who said they came from JavaScript got a German course under
 * an English tagline. They go through the reading language too.
 */
function taglineFor(course: Course, bg: CodeBackground | null): string {
  if (course.id !== "csharp" || !bg || bg === "python") return course.tagline;
  const reading = courseReadingLanguage(course);
  const english = bg === "js"
    ? "Learn C# from JavaScript, then build games in s&box."
    : "Learn C# from scratch, then build games in s&box.";
  return translateCourseText(english, reading) ?? english;
}

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
  const [background, setBackgroundState] = useState<CodeBackground | null>(getCodeBackground);
  const translationLanguage = useTranslationLanguage();
  const [pickingBackground, setPickingBackground] = useState(false);
  const isProgramming = course.kind === "programming";
  // Every lesson card carried a pair of code brackets, which is right for C#
  // and wrong for the citizenship course sitting next to it in the nav.
  const LessonIcon = isProgramming ? Code2 : Landmark;
  const showPicker = isProgramming && (background === null || pickingBackground);

  const pickBackground = (bg: CodeBackground) => {
    setCodeBackground(bg);
    setBackgroundState(bg);
    setPickingBackground(false);
  };

  const sections: [string, typeof lessons][] = [];
  for (const l of lessons) {
    const existing = sections.find(([s]) => s === l.section);
    if (existing) existing[1].push(l);
    else sections.push([l.section, [l]]);
  }

  const doneCount = lessons.filter((l) => completed.has(l.id)).length;
  const tagline = taglineFor(course, background);
  const taglineTranslated = translateCourseText(tagline, translationLanguage);

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">{course.name}</h1>
            {/* The tagline is course content, not interface text, so it follows
                the translation picker rather than the app language — same
                choice, same behaviour as the cards inside a lesson. */}
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-2)]">{tagline}</p>
            {taglineTranslated ? (
              <p className="mt-1 max-w-2xl text-sm font-bold leading-6 text-[var(--accent)]">{taglineTranslated}</p>
            ) : null}
            {isProgramming && background && !showPicker && (
              <button
                type="button"
                onClick={() => setPickingBackground(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-[11px] font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
              >
                <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                {uiFmt("Tailored for: {background} · change", { background: CODE_BACKGROUND_LABEL[background] })}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenReader}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90"
          >
            <BookOpen className="h-4 w-4" /> {ui("Read full course")}
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:max-w-xs">
          <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
            <p className="text-2xl font-black text-[var(--text-1)]">{lessons.length}</p>
            <p className="text-[11px] font-bold text-[var(--text-3)]">{ui("lessons")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
            <p className="text-2xl font-black text-[var(--text-1)]">{doneCount}</p>
            <p className="text-[11px] font-bold text-[var(--text-3)]">{ui("completed")}</p>
          </div>
        </div>
      </section>

      {showPicker && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-[1.5px] border-[var(--accent)] p-5 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Which language do you already know?")}
            </h2>
          </div>
          <p className="mt-1.5 text-sm font-semibold leading-6 text-[var(--text-2)]">
            {ui("The course adapts its explanations and side-by-side code comparisons to the language you already speak.")}
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {BACKGROUND_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => pickBackground(opt.key)}
                className={
                  "rounded-2xl border p-4 text-left transition-colors " +
                  (background === opt.key
                    ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]")
                }
              >
                <p className="text-sm font-black text-[var(--text-1)]">{ui(opt.label)}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{ui(opt.sub)}</p>
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {sections.map(([section, items]) => (
        <section key={section}>
          <div className="mb-3 px-1">
            <h2 className="text-sm font-black uppercase tracking-wide text-[var(--text-3)]">{section}</h2>
            {translateCourseText(section, translationLanguage) && (
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)] opacity-80">
                {translateCourseText(section, translationLanguage)}
              </p>
            )}
          </div>
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
                      <LessonIcon className="h-5 w-5" />
                    </div>
                    {done ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-[11px] font-black text-[var(--success-text)]">
                        <Check className="h-3 w-3" /> {ui("Done")}
                      </span>
                    ) : lesson.badge ? (
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-1)]">
                        {badgeLabel(lesson.badge)}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-lg font-black leading-tight tracking-tight text-[var(--text-1)]">{lesson.title}</h3>
                  {translateCourseText(lesson.title, translationLanguage) && (
                    <p className="mt-1 text-[13px] font-semibold leading-snug text-[var(--text-3)]">
                      {translateCourseText(lesson.title, translationLanguage)}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-[var(--text-3)]">{uiFmt("{n} sections", { n: lesson.blocks.length })}</p>
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
