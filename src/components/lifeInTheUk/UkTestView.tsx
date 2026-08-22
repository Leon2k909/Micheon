import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  RotateCcw,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CountryPack } from "@/lib/countryStudies";
import { UK_PACK, packChapters, packLessonTitle } from "@/lib/countryPacks";
import { countryProgress, type CountryQuizState } from "@/lib/countryQuizProgress";
import {
  countryPassPercent,
  countryTests,
  type CountryExamOutcome,
  type CountryTest,
  type CountryTestMode,
} from "@/lib/countryTests";
import { countryAdvice } from "@/lib/countryAdvice";

type Stage = "hub" | "running" | "result";

function formatClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function formatDate(at: number): string {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    + " · " + date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/**
 * Sit a test — including the real one.
 *
 * The practice screens cover browsing a topic and chipping away at mistakes.
 * What was missing is an exam: 24 questions in 45 minutes with a pass mark of
 * 18, drawn across the whole syllabus rather than from whatever you last
 * revised. That is what this is for, with the other six modes beside it so
 * the seven ways to practise sit in one place.
 *
 * It reads and writes the existing quiz state, so a question starred here is
 * starred on the practice screen, and a wrong answer here appears in the same
 * mistakes list. One record, two surfaces.
 *
 * Every hook is above every early return, and has to be: a hook below one
 * runs on some renders and not others, which is React error #310 and the
 * whole screen going to the crash boundary.
 */
export function UkTestView({
  onOpenLesson,
  pack = UK_PACK,
}: {
  onOpenLesson?: (lessonId: string) => void;
  /** Which country's test this is. Defaults to the UK. */
  pack?: CountryPack;
}) {
  const engine = useMemo(() => countryTests(pack), [pack]);
  const quiz = useMemo(() => countryProgress(pack), [pack]);
  const passPercent = countryPassPercent(pack);
  const examCount = pack.exam.questionCount;
  const examPassMark = pack.exam.passMark;
  const testModes = useMemo(() => engine.modes(), [engine]);
  const [stage, setStage] = useState<Stage>("hub");
  const [test, setTest] = useState<CountryTest | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Record<string, number | null>>({});
  const [outcome, setOutcome] = useState<CountryExamOutcome | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [state, setState] = useState<CountryQuizState>(() => quiz.load());
  const [reviewOnlyWrong, setReviewOnlyWrong] = useState(true);
  const startedAtRef = useRef(0);

  const chapters = useMemo(() => packChapters(pack), []);
  const advice = useMemo(() => countryAdvice(pack, state), [state]);
  const history = useMemo(() => [...state.tests].reverse(), [state.tests]);
  const favouriteCount = useMemo(() => state.favourites.length, [state.stats]);
  const mistakeCount = useMemo(
    () => Object.values(state.stats).filter((stat) => stat.wrong > 0).length,
    [state.stats]
  );

  const finish = useCallback(() => {
    if (!test) return;
    const scored = engine.score(test, chosen, {
      at: Date.now(),
      elapsedMs: Date.now() - startedAtRef.current,
    });
    // Fold every answer into the shared record first, so mistakes and topic
    // strength update exactly as they do on the practice screens.
    let next = quiz.load();
    for (const answer of scored.answers) {
      next = quiz.recordAnswer(answer.questionId, answer.chosen ?? -1, answer.correct, undefined, next);
    }
    next = quiz.recordTest({
      at: scored.at,
      score: scored.correct,
      total: scored.total,
      scope: scored.chapter ?? scored.mode,
      mode: scored.mode,
      percent: scored.percent,
      passed: scored.passed,
      passMark: scored.passMark,
      elapsedMs: scored.elapsedMs,
      answers: scored.answers,
    }, undefined, next);
    setState(next);
    setOutcome(scored);
    setStage("result");
  }, [test, chosen]);

  // The exam clock. Only the exam has one.
  useEffect(() => {
    if (stage !== "running" || !test?.durationMs) return undefined;
    const deadline = startedAtRef.current + test.durationMs;
    const tick = () => {
      const left = deadline - Date.now();
      setRemainingMs(left);
      if (left <= 0) finish();
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [stage, test, finish]);

  const start = useCallback((mode: CountryTestMode, chapter?: string) => {
    const current = quiz.load();
    const built = engine.build(mode, current, { chapter: chapter ?? null });
    if (built.questions.length === 0) return;
    startedAtRef.current = Date.now();
    setState(current);
    setTest(built);
    setIndex(0);
    setChosen({});
    setOutcome(null);
    setRemainingMs(built.durationMs);
    setStage("running");
  }, []);

  const toggleStar = useCallback((questionId: string) => {
    setState(quiz.toggleFavourite(questionId));
  }, []);

  // ── Running ──────────────────────────────────────────────────────────────
  if (stage === "running" && test) {
    const question = test.questions[index];
    const answered = Object.values(chosen).filter((value) => value != null).length;
    const isLast = index === test.questions.length - 1;
    const starred = state.favourites.includes(question.id);

    return (
      <div className="space-y-4">
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui(engine.modeTitle(test.mode))}
              </p>
              <h2 className="mt-1 text-lg font-black tracking-tight text-[var(--text-1)]">
                {ui("Question")} {index + 1} {ui("of")} {test.questions.length}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {remainingMs != null && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black tabular-nums",
                  remainingMs < 5 * 60 * 1000
                    ? "bg-[var(--danger-bg)] text-[var(--danger-text)]"
                    : "bg-[var(--surface-2)] text-[var(--text-2)]"
                )}>
                  <Clock className="h-4 w-4" />
                  {formatClock(remainingMs)}
                </span>
              )}
              <button
                type="button"
                onClick={() => { setStage("hub"); setTest(null); }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                aria-label={ui("Leave test")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${((index + 1) / test.questions.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] font-bold text-[var(--text-3)]">
            {answered} {ui("answered")} · {ui("pass mark")} {test.passMark}/{test.questions.length}
          </p>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--accent)]">
                {packLessonTitle(pack, question.lesson)}
              </span>
              <h3 className="mt-3 text-xl font-black leading-snug tracking-tight text-[var(--text-1)]">
                {question.q}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleStar(question.id)}
              aria-pressed={starred}
              aria-label={ui(starred ? "Remove from favourites" : "Save to favourites")}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                starred ? "text-amber-400" : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
              )}
            >
              <Star className={cn("h-4 w-4", starred && "fill-current")} />
            </button>
          </div>

          <div className="mt-5 grid gap-2.5">
            {question.options.map((option, optionIndex) => {
              const picked = chosen[question.id] === optionIndex;
              return (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => setChosen((current) => ({ ...current, [question.id]: optionIndex }))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                    picked
                      ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
                    picked ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--surface)] text-[var(--text-3)]"
                  )}>
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-1)]">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              {ui("Back")}
            </button>
            {isLast ? (
              <button type="button" onClick={finish} className="accent-btn inline-flex h-11 items-center gap-2 px-6 text-sm">
                {ui("Finish and see result")}
                <Check className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIndex((value) => Math.min(test.questions.length - 1, value + 1))}
                className="accent-btn inline-flex h-11 items-center gap-2 px-6 text-sm"
              >
                {ui("Next")}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        {/* Every question at a glance, so a skipped one can be returned to —
            the real test lets you do the same. */}
        <section className="card p-5">
          <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("All questions")}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {test.questions.map((entry, entryIndex) => {
              const done = chosen[entry.id] != null;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setIndex(entryIndex)}
                  aria-label={`${ui("Question")} ${entryIndex + 1}`}
                  className={cn(
                    "h-8 w-8 rounded-lg text-[11px] font-black transition-colors",
                    entryIndex === index
                      ? "bg-[var(--accent)] text-[var(--accent-text)]"
                      : done
                        ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "bg-[var(--surface-2)] text-[var(--text-3)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  {entryIndex + 1}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────
  if (stage === "result" && outcome) {
    const wrong = outcome.answers.filter((answer) => !answer.correct);
    const shown = reviewOnlyWrong ? wrong : outcome.answers;

    return (
      <div className="space-y-4">
        <section className={cn(
          "card p-6 text-center",
          outcome.passed ? "border-[var(--success-text)]/40" : "border-[var(--danger-text)]/40"
        )}>
          <div className={cn(
            "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
            outcome.passed ? "bg-[var(--success-bg)] text-[var(--success-text)]" : "bg-[var(--danger-bg)] text-[var(--danger-text)]"
          )}>
            {outcome.passed ? <Trophy className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-1)]">
            {outcome.passed ? ui("Passed") : ui("Not passed")}
          </h2>
          <p className="mt-1 text-sm font-bold text-[var(--text-3)]">
            {ui(engine.modeTitle(outcome.mode))}{outcome.chapter ? ` · ${outcome.chapter}` : ""}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <p className="text-2xl font-black text-[var(--text-1)]">{outcome.correct}/{outcome.total}</p>
              <p className="mt-1 text-[11px] font-bold text-[var(--text-3)]">{ui("Correct")}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <p className="text-2xl font-black text-[var(--text-1)]">{outcome.percent}%</p>
              <p className="mt-1 text-[11px] font-bold text-[var(--text-3)]">{ui("Score")}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <p className="text-2xl font-black text-[var(--text-1)]">{outcome.total - outcome.correct}</p>
              <p className="mt-1 text-[11px] font-bold text-[var(--text-3)]">{ui("Incorrect")}</p>
            </div>
          </div>

          <p className="mt-4 text-xs font-bold text-[var(--text-3)]">
            {ui("Pass mark")}: {outcome.passMark}/{outcome.total}
            {outcome.mode === "exam" ? ` — ${examPassMark}/${examCount} = ${passPercent}%` : ""}
            {" · "}{ui("Time")}: {formatClock(outcome.elapsedMs)}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => start(outcome.mode, outcome.chapter ?? undefined)} className="accent-btn inline-flex h-11 items-center gap-2 px-5 text-sm">
              <RotateCcw className="h-4 w-4" />
              {ui("Try again")}
            </button>
            <button
              type="button"
              onClick={() => { setStage("hub"); setTest(null); setOutcome(null); }}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-5 text-sm font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
            >
              {ui("Back to tests")}
            </button>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black tracking-tight text-[var(--text-1)]">
              {reviewOnlyWrong ? ui("What you got wrong") : ui("Every question")}
            </h3>
            <button
              type="button"
              onClick={() => setReviewOnlyWrong((value) => !value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
            >
              {reviewOnlyWrong ? ui("Show all") : ui("Show only mistakes")}
            </button>
          </div>

          {shown.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-[var(--surface-2)] p-5 text-center text-sm font-bold text-[var(--text-3)]">
              {ui("Nothing wrong — a clean sheet.")}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {shown.map((answer) => {
                const question = quiz.questionById(answer.questionId);
                if (!question) return null;
                const starred = state.favourites.includes(question.id);
                return (
                  <div key={answer.questionId} className="rounded-2xl bg-[var(--surface-2)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onOpenLesson?.(question.lesson)}
                          className="text-[10px] font-black uppercase tracking-wide text-[var(--accent)] hover:underline"
                        >
                          {packLessonTitle(pack, question.lesson)}
                        </button>
                        <p className="mt-1.5 text-sm font-black text-[var(--text-1)]">{question.q}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleStar(question.id)}
                        aria-label={ui(starred ? "Remove from favourites" : "Save to favourites")}
                        className={cn("shrink-0 rounded-full p-1.5", starred ? "text-amber-400" : "text-[var(--text-3)] hover:text-[var(--text-1)]")}
                      >
                        <Star className={cn("h-4 w-4", starred && "fill-current")} />
                      </button>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {answer.chosen != null && answer.chosen !== question.answer && (
                        <p className="flex items-start gap-2 text-xs font-bold text-[var(--danger-text)]">
                          <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{ui("You chose")}: {question.options[answer.chosen]}</span>
                        </p>
                      )}
                      {answer.chosen == null && (
                        <p className="text-xs font-bold text-[var(--text-3)]">{ui("You left this unanswered — it counts as wrong.")}</p>
                      )}
                      <p className="flex items-start gap-2 text-xs font-bold text-[var(--success-text)]">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{ui("Correct answer")}: {question.options[question.answer]}</span>
                      </p>
                    </div>

                    <p className="mt-3 rounded-xl bg-[var(--surface)] p-3 text-xs font-semibold leading-5 text-[var(--text-2)]">
                      {question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // ── Hub ──────────────────────────────────────────────────────────────────
  const passedExams = history.filter((entry) => entry.mode === "exam" && entry.passed).length;

  return (
    <div className="space-y-4">
      {advice.length > 0 && (
        <section className="card p-5 sm:p-6">
          <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Where you stand")}</h2>
          <div className="mt-3 space-y-2">
            {advice.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl p-3.5",
                  entry.tone === "praise"
                    ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                    : entry.tone === "warn"
                      ? "bg-[var(--danger-bg)] text-[var(--danger-text)]"
                      : "bg-[var(--surface-2)] text-[var(--text-2)]"
                )}
              >
                {entry.tone === "praise" ? <Trophy className="mt-0.5 h-4 w-4 shrink-0" />
                  : entry.tone === "warn" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  : <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />}
                <p className="text-sm font-bold leading-5">{entry.text}</p>
                {entry.chapter && (
                  <button
                    type="button"
                    onClick={() => start("category", entry.chapter)}
                    className="ml-auto shrink-0 rounded-lg bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-black text-[var(--text-1)]"
                  >
                    {ui("Practise")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Choose a test")}</h2>
        <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
          {uiFmt("The exam simulation is the real thing: {count} questions, {minutes} minutes, {pass} to pass.", {
            count: examCount,
            minutes: Math.round(pack.exam.durationMs / 60000),
            pass: examPassMark,
          })}
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {testModes.map((entry) => {
            const unavailable =
              (entry.mode === "favourites" && favouriteCount === 0)
              || (entry.mode === "mistakes" && mistakeCount === 0);
            const detail =
              entry.mode === "favourites" ? `${favouriteCount} ${ui("saved")}`
              : entry.mode === "mistakes" ? `${mistakeCount} ${ui("to fix")}`
              : entry.count ? `${entry.count} ${ui("questions")}` : "";
            return (
              <button
                key={entry.mode}
                type="button"
                disabled={unavailable}
                onClick={() => start(entry.mode)}
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                  entry.mode === "exam"
                    ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]",
                  unavailable && "cursor-not-allowed opacity-50"
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-black text-[var(--text-1)]">{ui(entry.title)}</span>
                  {entry.timed && <Clock className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />}
                </div>
                <span className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
                  {entry.blurbValues ? uiFmt(entry.blurb, entry.blurbValues) : ui(entry.blurb)}
                </span>
                {detail && <span className="mt-2 rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-black text-[var(--text-3)]">{detail}</span>}
                {unavailable && (
                  <span className="mt-2 text-[10px] font-bold text-[var(--text-3)]">
                    {entry.mode === "favourites" ? ui("Star a question during a test to build this.") : ui("Nothing wrong yet — take a test first.")}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Category test — pick a topic")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chapters.map((chapter) => (
              <button
                key={chapter}
                type="button"
                onClick={() => start("category", chapter)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-black text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]"
              >
                {chapter}
                <span className="ml-2 text-[10px] font-bold text-[var(--text-3)]">
                  {engine.questionsForChapter(chapter).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Your results")}</h2>
          {passedExams > 0 && (
            <span className="rounded-full bg-[var(--success-bg)] px-3 py-1 text-[11px] font-black text-[var(--success-text)]">
              {passedExams} {ui("exams passed")}
            </span>
          )}
        </div>

        {history.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-[var(--surface-2)] p-5 text-center text-sm font-bold text-[var(--text-3)]">
            {ui("No tests yet. Your results will build up here so you can track progress.")}
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {history.slice(0, 12).map((entry, entryIndex) => {
              // Rows written before pass/fail was recorded show a score without
              // claiming an outcome they never stored.
              const known = entry.passed != null;
              const percent = entry.percent ?? (entry.total ? Math.round((entry.score / entry.total) * 100) : 0);
              return (
                <div key={`${entry.at}-${entryIndex}`} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5">
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    !known ? "bg-[var(--surface)] text-[var(--text-3)]"
                      : entry.passed ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                      : "bg-[var(--danger-bg)] text-[var(--danger-text)]"
                  )}>
                    {!known ? <ChevronRight className="h-4 w-4" /> : entry.passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[var(--text-1)]">
                      {entry.mode ? ui(engine.modeTitle(entry.mode as CountryTestMode)) : entry.scope}
                    </p>
                    <p className="truncate text-[11px] font-semibold text-[var(--text-3)]">{formatDate(entry.at)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black text-[var(--text-1)]">{entry.score}/{entry.total}</p>
                    <p className="text-[11px] font-bold text-[var(--text-3)]">{percent}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
