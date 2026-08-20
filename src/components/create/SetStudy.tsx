import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  Pencil,
  RotateCcw,
  Shuffle,
  Target,
  Timer,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { tts } from "@/lib/voice";
import {
  MASTERY_TARGET,
  STUDY_STAGE_LABELS,
  applyAnswer,
  buildLearnRound,
  checkTypedAnswer,
  emptyProgress,
  loadStudyProgress,
  resetStudyProgress,
  saveStudyProgress,
  studiableCards,
  summariseProgress,
  type StudyCard,
  type StudySet,
  type StudySetProgress,
  type StudyStage,
} from "@/lib/studySets";

type Mode = "menu" | "flashcards" | "learn" | "test" | "match";

function shuffled<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

/**
 * Four ways to study one set.
 *
 * Flashcards to meet the material, Learn to grind it in with the stage ladder
 * the set defines, Test for a graded run, Match for the fast one you play
 * when you cannot face another typed answer. The same shape people already
 * know from Quizlet, so nothing here needs explaining.
 *
 * Learn is the one that carries progress. Flashcards, Test and Match do not
 * write to it — a card should be promoted because you produced it under the
 * ladder, not because you flipped past it or got lucky in a matching grid.
 */
export function SetStudy({
  set,
  onBack,
  onEdit,
}: {
  set: StudySet;
  onBack: () => void;
  onEdit: () => void;
}) {
  const [mode, setMode] = useState<Mode>("menu");
  const [progress, setProgress] = useState<StudySetProgress>(() => loadStudyProgress(set.id));

  const cards = useMemo(() => studiableCards(set), [set]);
  const summary = useMemo(() => summariseProgress(set, progress), [set, progress]);

  const record = useCallback((cardId: string, correct: boolean) => {
    setProgress((current) => {
      const next = {
        ...current,
        [cardId]: applyAnswer(current[cardId], correct, set.stages.length),
      };
      saveStudyProgress(set.id, next);
      return next;
    });
  }, [set.id, set.stages.length]);

  const reset = useCallback(() => {
    resetStudyProgress(set.id);
    setProgress({});
  }, [set.id]);

  const speak = useCallback((text: string) => {
    if (!set.speak) return;
    void tts(text, 0.95, "de-DE").catch(() => undefined);
  }, [set.speak]);

  const header = (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (mode === "menu" ? onBack() : setMode("menu"))}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {mode === "menu" ? ui("All sets") : ui("Back to modes")}
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-black text-[var(--text-1)]">{set.title}</p>
          <p className="text-[11px] font-bold text-[var(--text-3)]">
            {cards.length} {ui("cards")} · {summary.mastered} {ui("mastered")}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label={ui("Edit set")}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );

  if (mode === "flashcards") return <>{header}<Flashcards cards={cards} set={set} speak={speak} /></>;
  if (mode === "learn") return <>{header}<Learn set={set} progress={progress} onAnswer={record} speak={speak} onDone={() => setMode("menu")} /></>;
  if (mode === "test") return <>{header}<TestMode cards={cards} set={set} /></>;
  if (mode === "match") return <>{header}<MatchMode cards={cards} /></>;

  /**
   * Practise, then test. Two things, not four.
   *
   * A flat list of Learn / Flashcards / Test / Match made four equal choices
   * out of one real decision: am I still learning this, or am I checking
   * whether I know it? Grouping says which is which, and says out loud that
   * only practice moves your progress — a test tells you where you stand
   * without quietly promoting anything.
   */
  const GROUPS: {
    key: "practice" | "test";
    title: string;
    blurb: string;
    modes: { id: Mode; title: string; blurb: string; icon: React.ComponentType<{ className?: string }> }[];
  }[] = [
    {
      key: "practice",
      title: "Practice",
      blurb: "Builds the set into your memory. Progress only moves here.",
      modes: [
        { id: "learn", title: "Learn", blurb: "Walks each card up the stages you set. The one that tracks progress.", icon: Target },
        { id: "flashcards", title: "Flashcards", blurb: "Flip through at your own pace. Nothing is graded.", icon: Layers },
        { id: "match", title: "Match", blurb: "Pair terms against definitions, against the clock.", icon: Timer },
      ],
    },
    {
      key: "test",
      title: "Test",
      blurb: "Checks where you stand. Graded, and it changes nothing.",
      modes: [
        { id: "test", title: "Written test", blurb: "Answer the whole set, then see a score and every correction.", icon: Trophy },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {header}

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Progress")}</h3>
          {summary.mastered > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-[11px] font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
            >
              <RotateCcw className="h-3 w-3" />
              {ui("Reset")}
            </button>
          )}
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${summary.percent}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {([["mastered", summary.mastered], ["learning", summary.learning], ["new", summary.untouched]] as const).map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[var(--surface-2)] p-3">
              <p className="text-lg font-black text-[var(--text-1)]">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-3)]">{ui(label)}</p>
            </div>
          ))}
        </div>
      </section>

      {GROUPS.map((group) => (
        <section key={group.key} className="card p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-base font-black tracking-tight text-[var(--text-1)]">{ui(group.title)}</h3>
            <span className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
              group.key === "practice"
                ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                : "bg-[var(--surface-2)] text-[var(--text-3)]"
            )}>
              {ui(group.key === "practice" ? "tracks progress" : "no effect on progress")}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">{ui(group.blurb)}</p>

          <div className={cn("mt-4 grid gap-2.5", group.modes.length > 1 && "sm:grid-cols-3")}>
            {group.modes.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setMode(entry.id)}
                className="flex items-start gap-3 rounded-2xl bg-[var(--surface-2)] p-4 text-left transition-colors hover:bg-[var(--surface-3)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  <entry.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-[var(--text-1)]">{ui(entry.title)}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-[var(--text-3)]">{ui(entry.blurb)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ── Flashcards ──────────────────────────────────────────────────────────────

function Flashcards({ cards, set, speak }: { cards: StudyCard[]; set: StudySet; speak: (text: string) => void }) {
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[order[position]];
  const front = set.promptSide === "term" ? card?.term : card?.definition;
  const back = set.promptSide === "term" ? card?.definition : card?.term;

  useEffect(() => {
    if (card && set.promptSide === "term") speak(card.term);
    // Speaking is tied to the card, not to the flip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  const go = (delta: number) => {
    setFlipped(false);
    setPosition((current) => Math.max(0, Math.min(order.length - 1, current + delta)));
  };

  if (!card) return null;

  return (
    <div className="mt-4 space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black text-[var(--text-3)]">
            {position + 1} / {order.length}
          </p>
          <button
            type="button"
            onClick={() => { setOrder(shuffled(order)); setPosition(0); setFlipped(false); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-[11px] font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
          >
            <Shuffle className="h-3 w-3" />
            {ui("Shuffle")}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className="mt-4 flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-[var(--surface-2)] p-8 text-center transition-colors hover:bg-[var(--surface-3)]"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={flipped ? "back" : "front"}
              initial={{ opacity: 0, rotateX: -25 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 25 }}
              transition={{ duration: 0.16 }}
              className="text-2xl font-black leading-snug text-[var(--text-1)]"
            >
              {flipped ? back : front}
            </motion.p>
          </AnimatePresence>
          {flipped && card.hint && (
            <p className="text-xs font-semibold text-[var(--text-3)]">{card.hint}</p>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-3)]">
            {flipped ? ui("tap to go back") : ui("tap to reveal")}
          </p>
        </button>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={position === 0}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] text-sm font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui("Previous")}
          </button>
          <button
            type="button"
            onClick={() => speak(card.term)}
            aria-label={ui("Hear it")}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
          >
            <Volume2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={position === order.length - 1}
            className="accent-btn inline-flex h-11 flex-1 items-center justify-center gap-2 text-sm disabled:opacity-40"
          >
            {ui("Next")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

// ── Learn ───────────────────────────────────────────────────────────────────

function Learn({
  set,
  progress,
  onAnswer,
  speak,
  onDone,
}: {
  set: StudySet;
  progress: StudySetProgress;
  onAnswer: (cardId: string, correct: boolean) => void;
  speak: (text: string) => void;
  onDone: () => void;
}) {
  // The round is built once and held, so answering does not reshuffle the
  // questions under the learner mid-round.
  const [round] = useState(() => buildLearnRound(set, progress, 10));
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<null | { correct: boolean; expected: string }>(null);
  const [tally, setTally] = useState({ right: 0, wrong: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const all = useMemo(() => studiableCards(set), [set]);
  const current = round[index];

  useEffect(() => {
    if (current && set.promptSide === "term") speak(current.card.term);
    setTyped("");
    setVerdict(null);
    if (current && (current.stage === "typed" || current.stage === "reverse")) {
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current?.card.id]);

  // Distractors come from the set itself, so the wrong answers are plausible
  // rather than obviously from another topic.
  const options = useMemo(() => {
    if (!current || current.stage !== "choice") return [];
    const answerSide = set.promptSide === "term" ? "definition" : "term";
    const right = current.card[answerSide];
    const others = shuffled(all.filter((entry) => entry.id !== current.card.id))
      .map((entry) => entry[answerSide])
      .filter((value) => value && value !== right)
      .slice(0, 3);
    return shuffled([right, ...others]);
  }, [current, all, set.promptSide]);

  if (round.length === 0) {
    return (
      <section className="card mt-4 p-8 text-center">
        <Trophy className="mx-auto h-9 w-9 text-[var(--accent)]" />
        <h3 className="mt-3 text-lg font-black text-[var(--text-1)]">{ui("Everything is mastered")}</h3>
        <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
          {ui("Nothing left to learn in this set. Reset the progress to go again.")}
        </p>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="card mt-4 p-8 text-center">
        <Trophy className="mx-auto h-9 w-9 text-[var(--accent)]" />
        <h3 className="mt-3 text-lg font-black text-[var(--text-1)]">{ui("Round complete")}</h3>
        <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
          {tally.right} {ui("right")} · {tally.wrong} {ui("wrong")}
        </p>
        <button type="button" onClick={onDone} className="accent-btn mt-5 inline-flex h-11 items-center gap-2 px-6 text-sm">
          {ui("Back to modes")}
        </button>
      </section>
    );
  }

  const reverse = current.stage === "reverse";
  const promptSide = reverse
    ? (set.promptSide === "term" ? "definition" : "term")
    : set.promptSide;
  const answerSide = promptSide === "term" ? "definition" : "term";
  const prompt = current.card[promptSide];
  const expected = current.card[answerSide];

  const submit = (correct: boolean) => {
    if (verdict) return;
    setVerdict({ correct, expected });
    setTally((value) => ({
      right: value.right + (correct ? 1 : 0),
      wrong: value.wrong + (correct ? 0 : 1),
    }));
    onAnswer(current.card.id, correct);
  };

  const entry = progress[current.card.id] ?? emptyProgress();

  return (
    <div className="mt-4 space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--accent)]">
            {ui(STUDY_STAGE_LABELS[current.stage as StudyStage])}
          </span>
          <p className="text-xs font-black text-[var(--text-3)]">
            {index + 1} / {round.length} · {entry.streak}/{MASTERY_TARGET}
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-[var(--surface-2)] p-7 text-center">
          <p className="text-2xl font-black leading-snug text-[var(--text-1)]">{prompt}</p>
          {current.stage === "flashcard" && (
            <p className="mt-3 text-lg font-bold text-[var(--accent)]">{expected}</p>
          )}
          {current.card.hint && verdict && (
            <p className="mt-2 text-xs font-semibold text-[var(--text-3)]">{current.card.hint}</p>
          )}
        </div>

        {current.stage === "flashcard" ? (
          <button
            type="button"
            onClick={() => { submit(true); }}
            className="accent-btn mt-4 inline-flex h-11 w-full items-center justify-center gap-2 text-sm"
          >
            {ui("Got it")}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : current.stage === "choice" ? (
          <div className="mt-4 grid gap-2">
            {options.map((option, optionIndex) => {
              const isRight = option === expected;
              const show = Boolean(verdict);
              return (
                <button
                  key={`${option}-${optionIndex}`}
                  type="button"
                  disabled={show}
                  onClick={() => submit(isRight)}
                  className={cn(
                    "rounded-2xl border p-3.5 text-left text-sm font-bold transition-colors",
                    show && isRight
                      ? "border-[var(--success-text)] bg-[var(--success-bg)] text-[var(--success-text)]"
                      : show
                        ? "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-3)]"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-1)] hover:border-[var(--accent)]"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (verdict) return;
              submit(checkTypedAnswer(expected, typed));
            }}
          >
            <input
              ref={inputRef}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              disabled={Boolean(verdict)}
              placeholder={ui("Type the answer")}
              className={cn(
                "h-12 w-full rounded-2xl border bg-[var(--surface-2)] px-4 text-base font-bold text-[var(--text-1)] outline-none transition-colors",
                verdict?.correct === true ? "border-[var(--success-text)]"
                  : verdict?.correct === false ? "border-[var(--danger-text)]"
                  : "border-[var(--border)] focus:border-[var(--accent)]"
              )}
            />
            {!verdict && (
              <button type="submit" className="accent-btn mt-3 inline-flex h-11 w-full items-center justify-center text-sm">
                {ui("Check")}
              </button>
            )}
          </form>
        )}

        {verdict && (
          <div className="mt-4">
            <div className={cn(
              "flex items-start gap-2 rounded-2xl p-3.5",
              verdict.correct ? "bg-[var(--success-bg)] text-[var(--success-text)]" : "bg-[var(--danger-bg)] text-[var(--danger-text)]"
            )}>
              {verdict.correct ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
              <p className="text-sm font-black">
                {verdict.correct ? ui("Correct") : `${ui("Answer")}: ${verdict.expected}`}
              </p>
            </div>
            {/* Getting it wrong is worth a second look before moving on, so
                the answer stays up until the learner chooses to continue. */}
            <button
              type="button"
              onClick={() => setIndex((value) => value + 1)}
              className="accent-btn mt-3 inline-flex h-11 w-full items-center justify-center gap-2 text-sm"
              autoFocus
            >
              {index + 1 >= round.length ? ui("Finish round") : ui("Next")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Test ────────────────────────────────────────────────────────────────────

function TestMode({ cards, set }: { cards: StudyCard[]; set: StudySet }) {
  const [questions] = useState(() => shuffled(cards).slice(0, 20));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const answerSide = set.promptSide === "term" ? "definition" : "term";
  const promptSide = set.promptSide;

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.filter((card) => checkTypedAnswer(card[answerSide], answers[card.id] ?? "")).length;
  }, [submitted, questions, answers, answerSide]);

  if (questions.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      {submitted && (
        <section className="card p-6 text-center">
          <Trophy className="mx-auto h-9 w-9 text-[var(--accent)]" />
          <h3 className="mt-3 text-2xl font-black text-[var(--text-1)]">
            {score} / {questions.length}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
            {Math.round((score / questions.length) * 100)}%
          </p>
        </section>
      )}

      <section className="card p-5 sm:p-6">
        <div className="space-y-3">
          {questions.map((card, index) => {
            const given = answers[card.id] ?? "";
            const correct = submitted && checkTypedAnswer(card[answerSide], given);
            return (
              <div key={card.id} className="rounded-2xl bg-[var(--surface-2)] p-3.5">
                <p className="text-[11px] font-black text-[var(--text-3)]">{index + 1}</p>
                <p className="mt-1 text-sm font-black text-[var(--text-1)]">{card[promptSide]}</p>
                <input
                  value={given}
                  disabled={submitted}
                  onChange={(event) => setAnswers((current) => ({ ...current, [card.id]: event.target.value }))}
                  placeholder={ui("Your answer")}
                  className={cn(
                    "mt-2 h-10 w-full rounded-xl border bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-1)] outline-none",
                    submitted
                      ? correct ? "border-[var(--success-text)]" : "border-[var(--danger-text)]"
                      : "border-[var(--border)] focus:border-[var(--accent)]"
                  )}
                />
                {submitted && !correct && (
                  <p className="mt-1.5 text-xs font-bold text-[var(--success-text)]">
                    {ui("Answer")}: {card[answerSide]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="accent-btn mt-4 inline-flex h-11 w-full items-center justify-center text-sm"
          >
            {ui("Submit test")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] text-sm font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
          >
            <RotateCcw className="h-4 w-4" />
            {ui("Try again")}
          </button>
        )}
      </section>
    </div>
  );
}

// ── Match ───────────────────────────────────────────────────────────────────

type Tile = { key: string; cardId: string; text: string; side: "term" | "definition" };

function MatchMode({ cards }: { cards: StudyCard[] }) {
  const [round, setRound] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(cards));
  const [picked, setPicked] = useState<Tile | null>(null);
  const [cleared, setCleared] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  const done = cleared.size > 0 && cleared.size === new Set(tiles.map((tile) => tile.cardId)).size;

  useEffect(() => {
    if (done) return undefined;
    const timer = window.setInterval(() => setElapsed(Date.now() - startedAt), 100);
    return () => window.clearInterval(timer);
  }, [done, startedAt]);

  const choose = (tile: Tile) => {
    if (cleared.has(tile.cardId) || wrongPair.length > 0) return;
    if (!picked) { setPicked(tile); return; }
    if (picked.key === tile.key) { setPicked(null); return; }
    if (picked.cardId === tile.cardId) {
      setCleared((current) => new Set([...current, tile.cardId]));
      setPicked(null);
      return;
    }
    // A wrong pair flashes rather than silently deselecting, so it registers.
    setWrongPair([picked.key, tile.key]);
    window.setTimeout(() => { setWrongPair([]); setPicked(null); }, 420);
  };

  const restart = () => {
    setTiles(buildTiles(cards));
    setCleared(new Set());
    setPicked(null);
    setRound((value) => value + 1);
  };

  return (
    <div className="mt-4 space-y-4" key={round}>
      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black tabular-nums text-[var(--text-1)]">
            {(elapsed / 1000).toFixed(1)}s
          </p>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-[11px] font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
          >
            <Shuffle className="h-3 w-3" />
            {ui("New round")}
          </button>
        </div>

        {done ? (
          <div className="mt-5 rounded-3xl bg-[var(--success-bg)] p-8 text-center">
            <Trophy className="mx-auto h-9 w-9 text-[var(--success-text)]" />
            <p className="mt-3 text-2xl font-black text-[var(--success-text)]">
              {(elapsed / 1000).toFixed(1)}s
            </p>
            <button type="button" onClick={restart} className="accent-btn mt-4 inline-flex h-11 items-center gap-2 px-5 text-sm">
              <RotateCcw className="h-4 w-4" />
              {ui("Go again")}
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {tiles.map((tile) => {
              const isCleared = cleared.has(tile.cardId);
              const isPicked = picked?.key === tile.key;
              const isWrong = wrongPair.includes(tile.key);
              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => choose(tile)}
                  className={cn(
                    "flex min-h-[76px] items-center justify-center rounded-2xl border p-3 text-center text-xs font-bold transition-all",
                    isCleared
                      ? "pointer-events-none border-transparent bg-transparent opacity-0"
                      : isWrong
                        ? "border-[var(--danger-text)] bg-[var(--danger-bg)] text-[var(--danger-text)]"
                        : isPicked
                          ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-1)] hover:border-[var(--border-2)]"
                  )}
                >
                  {tile.text}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/** Six pairs is the size that fits a grid and still takes a moment to solve. */
function buildTiles(cards: StudyCard[]): Tile[] {
  const chosen = shuffled(cards).slice(0, 6);
  const tiles: Tile[] = [];
  for (const card of chosen) {
    tiles.push({ key: `${card.id}-t`, cardId: card.id, text: card.term, side: "term" });
    tiles.push({ key: `${card.id}-d`, cardId: card.id, text: card.definition, side: "definition" });
  }
  return shuffled(tiles);
}
