import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Code2, RotateCcw, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course, Lesson } from "@/lib/courses";
import { buildLessonSession, checkCode, type SessionStep } from "@/lib/courseSession";
import { LessonBlocks } from "@/components/course/LessonBlocks";
import { HighlightedCode } from "@/components/course/highlight";

// ── IDE-style editor: transparent textarea over highlighted code ──
function CodeEditor({
  value,
  onChange,
  onKeyDown,
  rows,
  state,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  rows: number;
  state: "idle" | "ok" | "bad";
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineCount = Math.max(rows, value.split("\n").length);

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const borderCls =
    state === "ok" ? "border-[var(--success-border,#2d6b4f)]" :
    state === "bad" ? "border-[var(--red-border,#7a3344)]" :
    "border-[var(--border)] focus-within:border-[var(--accent)]";

  return (
    <div className={cn("flex overflow-hidden rounded-2xl border bg-[#16161a] font-mono text-[13px] leading-[1.6]", borderCls)}>
      {/* gutter */}
      <div className="select-none border-r border-[var(--border)] bg-[#1a1a1e] px-3 py-3 text-right text-[var(--text-3)]">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* editor area */}
      <div className="relative flex-1">
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none m-0 overflow-auto whitespace-pre p-3 text-[#e8e8ea]"
          style={{ minHeight: `${lineCount * 1.6 + 1.5}em` }}
        >
          <HighlightedCode code={value + "\n"} />
        </pre>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre bg-transparent p-3 text-transparent caret-[var(--accent)] outline-none"
        />
      </div>
    </div>
  );
}

// ── Code typing step ──────────────────────────────────────────
function CodeStepView({
  prompt,
  target,
  hintComments,
  value,
  onChange,
  onPass,
}: {
  prompt: string;
  target: string;
  hintComments: string[];
  value: string;
  onChange: (next: string) => void;
  onPass: () => void;
}) {
  const [checked, setChecked] = useState(false);
  const [showReference, setShowReference] = useState(true);
  const result = useMemo(() => checkCode(value, target), [value, target]);
  const targetLines = target.split("\n").length;

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleCheck();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const eEnd = el.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(eEnd);
      onChange(next);
      if (checked) setChecked(false);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + 2, s + 2); });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const eEnd = el.selectionEnd;
      const before = value.slice(0, s);
      const after = value.slice(eEnd);
      const currentLine = before.slice(before.lastIndexOf("\n") + 1);
      const baseIndent = currentLine.match(/^\s*/)?.[0] ?? "";
      const extraIndent = currentLine.trimEnd().endsWith("{") ? "  " : "";
      const insert = "\n" + baseIndent + extraIndent;
      const next = before + insert + after;
      onChange(next);
      if (checked) setChecked(false);
      requestAnimationFrame(() => {
        const pos = s + insert.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
      return;
    }

    if (e.key === "}") {
      const el = e.currentTarget;
      const s = el.selectionStart;
      const eEnd = el.selectionEnd;
      const before = value.slice(0, s);
      const after = value.slice(eEnd);
      const lineStart = before.lastIndexOf("\n") + 1;
      const currentLine = before.slice(lineStart);

      // If the current line is just indentation, outdent before inserting the brace,
      // matching the usual VS Code behaviour for closing braces.
      if (/^\s*$/.test(currentLine) && currentLine.length > 0) {
        e.preventDefault();
        const outdentedLine = currentLine.replace(/ {1,2}$/, "");
        const next = value.slice(0, lineStart) + outdentedLine + "}" + after;
        const pos = lineStart + outdentedLine.length + 1;
        onChange(next);
        if (checked) setChecked(false);
        requestAnimationFrame(() => {
          el.focus();
          el.setSelectionRange(pos, pos);
        });
      }
    }
  };

  const handleChange = (v: string) => { onChange(v); if (checked) setChecked(false); };

  const handleCheck = () => {
    if (!value.trim()) return;
    setChecked(true);
    if (result.ok) setTimeout(onPass, 700);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl space-y-4">
      <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--accent)]">
          <Code2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-[var(--text-1)]">{prompt}</p>
          <p className="text-xs font-semibold text-[var(--text-3)]">Retype the reference below into the editor. You only need the code, not the explanation comments.</p>
        </div>
      </div>

      {/* Reference (shown by default) */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">Reference — type this</span>
          <button
            type="button"
            onClick={() => setShowReference((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-black text-[var(--accent)] hover:underline"
          >
            {showReference ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showReference ? "Hide" : "Show"}
          </button>
        </div>
        {showReference ? (
          <pre className="overflow-x-auto rounded-lg bg-[#16161a] p-3 font-mono text-[13px] leading-[1.6]">
            <HighlightedCode code={target} />
          </pre>
        ) : (
          <p className="text-xs font-semibold text-[var(--text-3)]">
            Hidden — try from memory.{hintComments.length > 0 ? " Goal: " + hintComments.join("; ") : ""}
          </p>
        )}
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <CodeEditor
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          rows={Math.max(4, targetLines + 1)}
          state={checked ? (result.ok ? "ok" : "bad") : "idle"}
        />
        <p className="text-right text-[10px] font-semibold text-[var(--text-3)]">Tab = indent · Ctrl+Enter = check</p>

        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-bold",
                result.ok
                  ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                  : "bg-[var(--red-bg,#3a2026)] text-[var(--red-text,#ff8a9b)]"
              )}
            >
              {result.ok
                ? "Correct! Nicely done."
                : result.misplacedSemicolon
                  ? "Nearly — the semicolon goes after the closing bracket: WriteLine(value); not WriteLine(value;)."
                  : result.caseMismatch
                    ? "Nearly — check the capital letters. C# is case-sensitive, e.g. WriteLine needs a capital L."
                    : result.missingPunctuation
                      ? "Nearly — you're missing a semicolon. C# needs it here."
                      : result.typoHint
                        ? `Typo — you typed ${result.typoHint.typed}, but it should be ${result.typoHint.expected}.`
                        : "Not quite — compare with the reference and try again."}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2">
          {checked && !result.ok ? (
            <>
              <button type="button" onClick={() => { onChange(""); setChecked(false); }} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-black text-[var(--text-2)] hover:bg-[var(--surface-2)]">
                <RotateCcw className="h-4 w-4" /> Clear
              </button>
              <button type="button" onClick={() => onChange(target)} className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-sm font-black text-[var(--text-1)] hover:bg-[var(--surface-3)]">
                Fill answer
              </button>
              <button type="button" onClick={onPass} className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-sm font-black text-[var(--text-2)] hover:bg-[var(--surface-3)]">
                Skip
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={checked && result.ok ? onPass : handleCheck}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-black text-white transition-opacity hover:opacity-90"
            >
              {checked && result.ok ? <>Next <ArrowRight className="h-4 w-4" /></> : "Check"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Concept step ──────────────────────────────────────────────
function ConceptStepView({ blocks, onNext }: { blocks: SessionStep extends never ? never : any; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl space-y-5">
      <LessonBlocks blocks={blocks} />
      <button
        type="button"
        onClick={onNext}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-black text-white transition-opacity hover:opacity-90"
      >
        Continue <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ── Quiz step ─────────────────────────────────────────────────
function QuizStepView({ q, options, explanation, onNext }: { q: string; options: { text: string; correct: boolean }[]; explanation: string; onNext: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correctIdx = options.findIndex((o) => o.correct);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <p className="text-base font-black text-[var(--text-1)]">{q}</p>
        <div className="mt-3 flex flex-col gap-2">
          {options.map((opt, i) => {
            const showCorrect = answered && i === correctIdx;
            const showWrong = answered && i === picked && !opt.correct;
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setPicked(i)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                  showCorrect ? "border-[var(--success-border,#2d6b4f)] bg-[var(--success-bg)] text-[var(--success-text)]"
                  : showWrong ? "border-[var(--red-border,#7a3344)] bg-[var(--red-bg,#3a2026)] text-[var(--red-text,#ff8a9b)]"
                  : "border-[var(--border-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)] disabled:opacity-70"
                )}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="mt-3 rounded-xl bg-[var(--info-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--info-text)]">
            {explanation}
          </div>
        )}
      </div>
      {answered && (
        <button type="button" onClick={onNext} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-black text-white">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

// ── Session shell ─────────────────────────────────────────────
export function CourseSession({
  course,
  lesson,
  onComplete,
  onExit,
}: {
  course: Course;
  lesson: Lesson;
  onComplete: () => void;
  onExit: () => void;
}) {
  const steps = useMemo<SessionStep[]>(() => buildLessonSession(lesson), [lesson]);
  const [index, setIndex] = useState(0);
  const [codeDrafts, setCodeDrafts] = useState<Record<number, string>>({});
  const step = steps[Math.min(index, steps.length - 1)];
  const progress = steps.length > 1 ? Math.round((index / (steps.length - 1)) * 100) : 100;

  const next = () => {
    if (index < steps.length - 1) setIndex((i) => i + 1);
    else onComplete();
  };
  const back = () => setIndex((i) => Math.max(0, i - 1));
  const canGoBack = index > 0;

  return (
    <div className="fixed inset-0 z-[500] flex flex-col bg-[var(--bg)] text-[var(--text-1)]">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={back}
            disabled={!canGoBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Go back one step"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">{course.name}</div>
            <div className="text-base font-black tracking-tight text-[var(--text-1)]">{lesson.title}</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
        >
          <X className="h-4 w-4" /> Exit
        </button>
      </header>

      {/* Body */}
      <main className="flex flex-1 items-start justify-center overflow-y-auto p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <div key={index} className="flex w-full justify-center">
            {step.type === "concept" && <ConceptStepView blocks={step.blocks} onNext={next} />}
            {step.type === "code" && (
              <CodeStepView
                prompt={step.prompt}
                target={step.target}
                hintComments={step.hintComments}
                value={codeDrafts[index] ?? ""}
                onChange={(nextDraft) => setCodeDrafts((drafts) => ({ ...drafts, [index]: nextDraft }))}
                onPass={next}
              />
            )}
            {step.type === "quiz" && (
              <QuizStepView q={step.q} options={step.options} explanation={step.explanation} onNext={next} />
            )}
            {step.type === "complete" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl space-y-6 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success-bg)] text-[var(--success-text)]">
                  <Check className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-[var(--text-1)]">Lesson complete</h2>
                  <p className="text-sm font-semibold text-[var(--text-3)]">You read the concepts and typed the code. Keep the momentum going.</p>
                </div>
                <button type="button" onClick={onComplete} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-black text-white">
                  Finish <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
