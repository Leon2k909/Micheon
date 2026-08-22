import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Flame,
  Landmark,
  RotateCcw,
  Star,
  Target,
  TriangleAlert,
  X,
} from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import type { UserProfile } from "@/lib/profileStorage";
import {
  COUNTRY_LEVELS,
  type CountryLevel,
  type CountryPack,
  type CountryQuestion,
} from "@/lib/countryStudies";
import { UK_PACK, packCategories, packChapters } from "@/lib/countryPacks";
import { countryProgress, type CountryQuizState } from "@/lib/countryQuizProgress";

/**
 * Practice for the Life in the UK test.
 *
 * One screen with five ways in, rather than five screens: pick a topic, drill
 * your mistakes, revisit favourites, let the app choose (review), or do the
 * day's ten. They all end up in the same runner, because the thing a learner
 * actually does — read a question, answer it, find out why — should not look
 * different depending on which door they came through.
 *
 * Every answer is recorded whichever mode it came from, so the weakness
 * analysis and the progress figures reflect all practice rather than only the
 * sessions someone remembered to label as a test.
 */

const LEVEL_LABEL: Record<CountryLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

type Mode = "overview" | "topics" | "mistakes" | "favourites";

type Session = {
  questions: CountryQuestion[];
  index: number;
  chosen: number | null;
  correctCount: number;
  answers: Array<{ question: CountryQuestion; chosen: number; correct: boolean }>;
  scope: string;
  label: string;
  isDaily: boolean;
  finished: boolean;
};

function percentClass(percent: number): string {
  if (percent >= 80) return "text-[var(--success-text)]";
  if (percent >= 60) return "text-[var(--text-1)]";
  return "text-[var(--red-text)]";
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
      <p className="text-2xl font-black text-[var(--text-1)]">{value}</p>
      <p className="text-[11px] font-bold text-[var(--text-3)]">{label}</p>
      {hint ? <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">{hint}</p> : null}
    </div>
  );
}

export function UkPracticeView({
  profile,
  onOpenLesson,
  pack = UK_PACK,
}: {
  profile: UserProfile | null;
  onOpenLesson?: (lessonId: string) => void;
  /** Which country this screen is practising. Defaults to the UK. */
  pack?: CountryPack;
}) {
  const engine = useMemo(() => countryProgress(pack), [pack]);
  const [state, setState] = useState<CountryQuizState>(() =>
    countryProgress(pack).ensureDaily(countryProgress(pack).load(profile), profile)
  );
  const [mode, setMode] = useState<Mode>("overview");
  const [session, setSession] = useState<Session | null>(null);
  const [levels, setLevels] = useState<CountryLevel[]>([]);
  const [chapterFilter, setChapterFilter] = useState<string>("");

  const summary = useMemo(() => engine.progressSummary(state, profile), [engine, state, profile]);
  const strengths = useMemo(() => engine.categoryStrength(state), [engine, state]);
  const weak = useMemo(() => engine.weakCategories(state), [engine, state]);
  const mistakes = useMemo(() => engine.mistakes(state), [engine, state]);
  const favourites = useMemo(() => engine.favouriteQuestions(state), [engine, state]);
  const categories = useMemo(() => packCategories(pack), [pack]);
  const chapters = useMemo(() => packChapters(pack), [pack]);

  const startSession = (questions: CountryQuestion[], scope: string, label: string, isDaily = false) => {
    if (questions.length === 0) return;
    setSession({
      questions,
      index: 0,
      chosen: null,
      correctCount: 0,
      answers: [],
      scope,
      label,
      isDaily,
      finished: false,
    });
  };

  const answer = (choice: number) => {
    if (!session || session.chosen !== null) return;
    const question = session.questions[session.index];
    const correct = choice === question.answer;
    const nextState = session.isDaily
      ? engine.recordDailyAnswer(question.id, choice, correct, profile, state)
      : engine.recordAnswer(question.id, choice, correct, profile, state);
    setState(nextState);
    setSession({
      ...session,
      chosen: choice,
      correctCount: session.correctCount + (correct ? 1 : 0),
      answers: [...session.answers, { question, chosen: choice, correct }],
    });
  };

  const advance = () => {
    if (!session || session.chosen === null) return;
    const last = session.index >= session.questions.length - 1;
    if (last) {
      const finished = { ...session, finished: true };
      setSession(finished);
      setState(
        engine.recordTest(
          { at: Date.now(), score: session.correctCount, total: session.questions.length, scope: session.scope },
          profile,
          state
        )
      );
      return;
    }
    setSession({ ...session, index: session.index + 1, chosen: null });
  };

  const favourite = (id: string) => setState(engine.toggleFavourite(id, profile, state));

  const toggleLevel = (level: CountryLevel) =>
    setLevels((current) => (current.includes(level) ? current.filter((l) => l !== level) : [...current, level]));

  // ── The runner ──────────────────────────────────────────────────────────
  if (session) {
    if (session.finished) {
      const percent = Math.round((session.correctCount / session.questions.length) * 100);
      const passed = percent >= 75;
      return (
        <div className="space-y-4 np-uk-practice">
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-black tracking-tight text-[var(--text-1)]">{ui("Session complete")}</h1>
              <span className={`text-3xl font-black ${passed ? "text-[var(--success-text)]" : percentClass(percent)}`}>
                {percent}%
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--text-2)]">
              {uiFmt("{correct} of {total} correct in {label}.", {
                correct: session.correctCount,
                total: session.questions.length,
                label: session.label,
              })}
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
              {passed ? ui("That is above the 75% pass mark for the real test.") : ui("The real test needs 75%. Work through the ones you missed.")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="accent-btn inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
                onClick={() => setSession(null)}
                type="button"
              >
                {ui("Back to practice")}
              </button>
              {!session.isDaily && (
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--surface-2)] px-5 text-sm font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
                  onClick={() => startSession(session.questions, session.scope, session.label, false)}
                  type="button"
                >
                  <RotateCcw className="h-4 w-4" /> {ui("Try the same set again")}
                </button>
              )}
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Every answer, with the explanation")}</h2>
            <div className="mt-4 space-y-3">
              {session.answers.map(({ question, chosen, correct }) => (
                <div key={question.id} className="rounded-2xl bg-[var(--surface-2)] p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        correct ? "bg-[var(--success-bg)] text-[var(--success-text)]" : "bg-[var(--red-bg)] text-[var(--red-text)]"
                      }`}
                    >
                      {correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-[var(--text-1)]">{question.q}</p>
                      {!correct && (
                        <p className="mt-1 text-xs font-semibold text-[var(--red-text)]">
                          {uiFmt("Your answer: {answer}", { answer: question.options[chosen] })}
                        </p>
                      )}
                      <p className="mt-1 text-xs font-semibold text-[var(--success-text)]">
                        {uiFmt("Correct answer: {answer}", { answer: question.options[question.answer] })}
                      </p>
                      <p className="mt-1.5 text-xs font-semibold leading-5 text-[var(--text-3)]">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    const question = session.questions[session.index];
    const stat = engine.statFor(state, question.id);
    const isFavourite = state.favourites.includes(question.id);
    const progress = Math.round((session.index / session.questions.length) * 100);

    return (
      <div className="space-y-4 np-uk-practice">
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              className="inline-flex items-center gap-1.5 text-xs font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
              onClick={() => setSession(null)}
              type="button"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {ui("Leave session")}
            </button>
            <span className="text-xs font-black text-[var(--text-3)]">
              {uiFmt("Question {n} of {total}", { n: session.index + 1, total: session.questions.length })}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-2)]">
                {session.label}
              </span>
              <span className="rounded-full bg-[var(--accent-dim)] px-3 py-1 text-[11px] font-black text-[var(--accent)]">
                {ui(LEVEL_LABEL[question.level])}
              </span>
              {stat.wrong > 0 && (
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--red-text)]">
                  {uiFmt("Wrong {n}x before", { n: stat.wrong })}
                </span>
              )}
            </div>
            <button
              aria-label={isFavourite ? ui("Remove from favourites") : ui("Save to favourites")}
              aria-pressed={isFavourite}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                isFavourite ? "bg-[var(--accent-dim)] text-[var(--accent)]" : "bg-[var(--surface-2)] text-[var(--text-3)] hover:text-[var(--text-1)]"
              }`}
              onClick={() => favourite(question.id)}
              type="button"
            >
              <Star className="h-4 w-4" fill={isFavourite ? "currentColor" : "none"} />
            </button>
          </div>

          <h2 className="mt-4 text-xl font-black leading-tight tracking-tight text-[var(--text-1)]">{question.q}</h2>

          <div className="mt-5 grid gap-2.5">
            {question.options.map((option, index) => {
              const chosen = session.chosen;
              const isAnswer = index === question.answer;
              const isChosen = chosen === index;
              let cls = "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]";
              if (chosen !== null) {
                if (isAnswer) cls = "border-[var(--success-border)] bg-[var(--success-bg)]";
                else if (isChosen) cls = "border-[var(--red-border)] bg-[var(--red-bg)]";
                else cls = "border-[var(--border)] bg-[var(--surface-2)] opacity-60";
              }
              return (
                <button
                  key={option}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${cls}`}
                  disabled={chosen !== null}
                  onClick={() => answer(index)}
                  type="button"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-black text-[var(--text-2)]">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-bold text-[var(--text-1)]">{option}</span>
                  {chosen !== null && isAnswer && <Check className="h-4 w-4 shrink-0 text-[var(--success-text)]" />}
                  {chosen !== null && isChosen && !isAnswer && <X className="h-4 w-4 shrink-0 text-[var(--red-text)]" />}
                </button>
              );
            })}
          </div>

          {session.chosen !== null && (
            <div className="mt-5 rounded-2xl bg-[var(--surface-2)] p-4">
              <p className={`text-sm font-black ${session.chosen === question.answer ? "text-[var(--success-text)]" : "text-[var(--red-text)]"}`}>
                {session.chosen === question.answer ? ui("Correct") : ui("Not quite")}
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-6 text-[var(--text-2)]">{question.explanation}</p>
              <button
                className="accent-btn mt-4 inline-flex h-11 w-full items-center justify-center gap-2 text-sm"
                onClick={advance}
                type="button"
              >
                {session.index >= session.questions.length - 1 ? ui("See your result") : ui("Next question")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  // ── Landing ─────────────────────────────────────────────────────────────
  const tabs: Array<{ id: Mode; label: string; badge?: number }> = [
    { id: "overview", label: ui("Overview") },
    { id: "topics", label: ui("By topic") },
    { id: "mistakes", label: ui("My mistakes"), badge: mistakes.length },
    { id: "favourites", label: ui("Favourites"), badge: favourites.length },
  ];

  const dailyQuestions = engine.dailyQuestions(state);
  const dailyDone = engine.dailyComplete(state);
  const dailyAnswered = Object.keys(state.daily.answered).length;

  return (
    <div className="space-y-4 np-uk-practice">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">{ui("Practice")}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-2)]">
              {uiFmt("{n} questions across {c} topics. Learn a topic, then answer questions on it.", {
                n: summary.questionsTotal,
                c: summary.categoriesTotal,
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="accent-btn inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
              onClick={() => startSession(engine.reviewQueue(state, 15), "review", ui("Smart review"))}
              type="button"
            >
              <Target className="h-4 w-4" /> {ui("Smart review")}
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--surface-2)] px-5 text-sm font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
              onClick={() => startSession(engine.pickQuestions({ count: pack.exam.questionCount, levels }, state), "mixed", ui("Mock test"))}
              type="button"
            >
              {uiFmt("Mock test — {count} questions", { count: pack.exam.questionCount })}
            </button>
          </div>
        </div>

        <nav aria-label={ui("Practice sections")} className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              aria-current={mode === tab.id ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition-colors ${
                mode === tab.id
                  ? "bg-[var(--accent)] text-[var(--accent-text)]"
                  : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
              }`}
              key={tab.id}
              onClick={() => setMode(tab.id)}
              type="button"
            >
              {tab.label}
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span className="rounded-full bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-black text-[var(--text-2)]">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </section>

      {mode === "overview" && (
        <>
          {/* Daily quiz */}
          <section className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Daily quiz")}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                  {dailyDone
                    ? ui("Done for today. A fresh set arrives tomorrow.")
                    : uiFmt("{n} questions, new every day.", { n: dailyQuestions.length })}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1.5">
                <Flame className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-xs font-black text-[var(--text-1)]">
                  {uiFmt("{n}-day streak", { n: summary.streak })}
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${dailyQuestions.length ? Math.round((dailyAnswered / dailyQuestions.length) * 100) : 0}%` }}
              />
            </div>
            <button
              className="accent-btn mt-4 inline-flex h-11 w-full items-center justify-center gap-2 text-sm sm:w-auto sm:px-6"
              disabled={dailyQuestions.length === 0}
              onClick={() => startSession(dailyQuestions, "daily", ui("Daily quiz"), true)}
              type="button"
            >
              {dailyDone ? ui("Review today's quiz") : ui("Start the daily quiz")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          {/* Progress */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Your progress")}</h2>
              <BarChart3 className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatTile label={ui("Overall")} value={`${summary.overallPercent}%`} />
              <StatTile label={ui("Success rate")} value={`${summary.successRate}%`} />
              <StatTile label={ui("Correct")} value={String(summary.totalCorrect)} />
              <StatTile label={ui("Wrong")} value={String(summary.totalWrong)} />
              <StatTile label={ui("Questions seen")} value={`${summary.questionsSeen}/${summary.questionsTotal}`} />
              <StatTile label={ui("Topics learned")} value={`${summary.lessonsDone}/${summary.lessonsTotal}`} />
              <StatTile label={ui("Categories complete")} value={`${summary.categoriesComplete}/${summary.categoriesTotal}`} />
              <StatTile label={ui("Tests taken")} value={String(summary.testsTaken)} />
              <StatTile label={ui("Best test")} value={`${summary.bestTestPercent}%`} />
              <StatTile label={ui("Average test")} value={`${summary.averageTestPercent}%`} />
              <StatTile label={ui("Mistakes saved")} value={String(summary.mistakeCount)} />
              <StatTile label={ui("Favourites")} value={String(summary.favouriteCount)} />
            </div>
          </section>

          {/* Weakness analysis */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Where you are weakest")}</h2>
              <TriangleAlert className="h-5 w-5 text-[var(--accent)]" />
            </div>
            {weak.length === 0 ? (
              <p className="mt-3 text-sm font-semibold text-[var(--text-3)]">
                {ui("Answer a few questions in each topic and the weak spots will show up here.")}
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                  {ui("Below 75% — these are the topics to revise first.")}
                </p>
                <div className="mt-4 space-y-2">
                  {weak.slice(0, 6).map((row) => (
                    <div key={row.id} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[var(--text-1)]">{row.title}</p>
                        <p className="text-[11px] font-semibold text-[var(--text-3)]">
                          {uiFmt("{correct} right, {wrong} wrong", { correct: row.correct, wrong: row.wrong })}
                        </p>
                      </div>
                      <span className={`text-lg font-black ${percentClass(row.percent)}`}>{row.percent}%</span>
                      <button
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[var(--surface)] px-3 text-[11px] font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
                        onClick={() => startSession(engine.pickQuestions({ lesson: row.id, count: 10 }, state), row.id, row.title)}
                        type="button"
                      >
                        {ui("Revise")}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* All categories */}
          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Every topic")}</h2>
            <div className="mt-4 space-y-2">
              {strengths.map((row) => (
                <div key={row.id} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[var(--text-1)]">{row.title}</p>
                    <p className="truncate text-[11px] font-semibold text-[var(--text-3)]">{row.chapter}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text-3)]">
                    {uiFmt("{seen}/{total} seen", { seen: row.seen, total: row.total })}
                  </span>
                  <span className={`w-12 text-right text-sm font-black ${row.answered > 0 ? percentClass(row.percent) : "text-[var(--text-3)]"}`}>
                    {row.answered > 0 ? `${row.percent}%` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {mode === "topics" && (
        <>
          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Filters")}</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("Difficulty")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {COUNTRY_LEVELS.map((level) => (
                <button
                  className={`rounded-full px-4 py-2 text-xs font-black transition-colors ${
                    levels.includes(level)
                      ? "bg-[var(--accent)] text-[var(--accent-text)]"
                      : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                  }`}
                  key={level}
                  onClick={() => toggleLevel(level)}
                  type="button"
                >
                  {ui(LEVEL_LABEL[level])}
                </button>
              ))}
              {levels.length > 0 && (
                <button
                  className="rounded-full bg-[var(--surface-2)] px-4 py-2 text-xs font-black text-[var(--text-3)] transition-colors hover:bg-[var(--surface-3)]"
                  onClick={() => setLevels([])}
                  type="button"
                >
                  {ui("All levels")}
                </button>
              )}
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--text-3)]">{ui("Chapter")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className={`rounded-full px-4 py-2 text-xs font-black transition-colors ${
                  chapterFilter === "" ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                }`}
                onClick={() => setChapterFilter("")}
                type="button"
              >
                {ui("All chapters")}
              </button>
              {chapters.map((chapter) => (
                <button
                  className={`rounded-full px-4 py-2 text-xs font-black transition-colors ${
                    chapterFilter === chapter ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                  }`}
                  key={chapter}
                  onClick={() => setChapterFilter(chapter)}
                  type="button"
                >
                  {chapter}
                </button>
              ))}
            </div>
            {chapterFilter && (
              <button
                className="accent-btn mt-4 inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
                onClick={() => startSession(engine.pickQuestions({ chapter: chapterFilter, levels, count: 20 }, state), chapterFilter, chapterFilter)}
                type="button"
              >
                {uiFmt("Practise the whole chapter", {})} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </section>

          <section className="grid gap-3 lg:grid-cols-2">
            {categories
              .filter((category) => !chapterFilter || category.chapter === chapterFilter)
              .map((category) => {
                const row = strengths.find((s) => s.id === category.id);
                return (
                  <div className="card p-5" key={category.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                        <Landmark className="h-5 w-5" />
                      </div>
                      {row && row.answered > 0 && (
                        <span className={`text-lg font-black ${percentClass(row.percent)}`}>{row.percent}%</span>
                      )}
                    </div>
                    <h3 className="mt-4 text-base font-black leading-tight tracking-tight text-[var(--text-1)]">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold text-[var(--text-3)]">
                      {uiFmt("{n} questions · {chapter}", { n: category.count, chapter: category.chapter })}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="accent-btn inline-flex h-10 flex-1 items-center justify-center gap-2 text-xs"
                        disabled={category.count === 0}
                        onClick={() =>
                          startSession(
                            engine.pickQuestions({ lesson: category.id, levels, count: 10 }, state),
                            category.id,
                            category.title
                          )
                        }
                        type="button"
                      >
                        {ui("Practise")} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      {onOpenLesson && (
                        <button
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[var(--surface-2)] px-4 text-xs font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
                          onClick={() => onOpenLesson(category.id)}
                          type="button"
                        >
                          {ui("Learn first")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </section>
        </>
      )}

      {mode === "mistakes" && (
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("My mistakes")}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                {ui("Every question you have got wrong, kept until you get it right.")}
              </p>
            </div>
            {mistakes.length > 0 && (
              <button
                className="accent-btn inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
                onClick={() =>
                  startSession(
                    engine.pickQuestions({ mistakesOnly: true, count: Math.min(20, mistakes.length) }, state),
                    "mistakes",
                    ui("My mistakes")
                  )
                }
                type="button"
              >
                <RotateCcw className="h-4 w-4" /> {ui("Practise these")}
              </button>
            )}
          </div>

          {mistakes.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] px-5 py-8 text-center text-sm font-semibold text-[var(--text-3)]">
              {ui("Nothing here yet. Wrong answers are collected automatically.")}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {mistakes.map(({ question, yourAnswer, wrongCount }) => (
                <div className="rounded-2xl bg-[var(--surface-2)] p-4" key={question.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[11px] font-black text-[var(--text-2)]">
                      {strengths.find((s) => s.id === question.lesson)?.title ?? question.lesson}
                    </span>
                    <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[11px] font-black text-[var(--red-text)]">
                      {uiFmt("Wrong {n}x", { n: wrongCount })}
                    </span>
                    <span className="rounded-full bg-[var(--accent-dim)] px-3 py-1 text-[11px] font-black text-[var(--accent)]">
                      {ui(LEVEL_LABEL[question.level])}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-black text-[var(--text-1)]">{question.q}</p>
                  {yourAnswer >= 0 && question.options[yourAnswer] && (
                    <p className="mt-2 text-xs font-semibold text-[var(--red-text)]">
                      {uiFmt("Your answer: {answer}", { answer: question.options[yourAnswer] })}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-semibold text-[var(--success-text)]">
                    {uiFmt("Correct answer: {answer}", { answer: question.options[question.answer] })}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold leading-5 text-[var(--text-3)]">{question.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {mode === "favourites" && (
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Favourites")}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                {ui("Star a question during a session to keep it here.")}
              </p>
            </div>
            {favourites.length > 0 && (
              <button
                className="accent-btn inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
                onClick={() =>
                  startSession(
                    engine.pickQuestions({ favouritesOnly: true, count: Math.min(20, favourites.length) }, state),
                    "favourites",
                    ui("Favourites")
                  )
                }
                type="button"
              >
                <Star className="h-4 w-4" /> {ui("Practise these")}
              </button>
            )}
          </div>

          {favourites.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] px-5 py-8 text-center text-sm font-semibold text-[var(--text-3)]">
              {ui("No favourites yet.")}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {favourites.map((question) => (
                <div className="rounded-2xl bg-[var(--surface-2)] p-4" key={question.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[11px] font-black text-[var(--text-2)]">
                        {strengths.find((s) => s.id === question.lesson)?.title ?? question.lesson}
                      </span>
                      <p className="mt-3 text-sm font-black text-[var(--text-1)]">{question.q}</p>
                      <p className="mt-1.5 text-xs font-semibold text-[var(--success-text)]">
                        {uiFmt("Correct answer: {answer}", { answer: question.options[question.answer] })}
                      </p>
                      <p className="mt-1.5 text-xs font-semibold leading-5 text-[var(--text-3)]">{question.explanation}</p>
                    </div>
                    <button
                      aria-label={ui("Remove from favourites")}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]"
                      onClick={() => favourite(question.id)}
                      type="button"
                    >
                      <Star className="h-4 w-4" fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
