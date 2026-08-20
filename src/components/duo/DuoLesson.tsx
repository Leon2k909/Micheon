import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Volume2, X } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { tts } from "@/lib/voice";
import { setItemStatus } from "@/lib/activity";
import {
  DUO_HEARTS,
  buildDuoLesson,
  duoCheckBuild,
  duoCheckTyped,
  duoXpFor,
  type DuoExercise,
} from "@/lib/duoLesson";

type Verdict = { correct: boolean; note: string | null; expected: string } | null;

/**
 * One short lesson: ten turns, five hearts, marked as you go.
 *
 * The whole point of this format is that the feedback is immediate and the
 * turn is over quickly, so the answer bar is the load-bearing part — it says
 * right or wrong, shows the expected answer when wrong, and moves on with one
 * key press. Everything else on screen is deliberately quiet.
 *
 * Grading goes through setItemStatus, the same call the rest of the app uses.
 * A right answer here is worth what a right answer is worth anywhere, and the
 * path lights up from the same store the guided session writes to.
 */
export function DuoLesson({
  apiParts,
  packKey,
  packTitle,
  onExit,
  onFinished,
}: {
  apiParts: Record<string, unknown>;
  packKey: string;
  packTitle: string;
  onExit: () => void;
  onFinished?: (result: { correct: number; total: number; xp: number; heartsLeft: number }) => void;
}) {
  const [exercises] = useState<DuoExercise[]>(() => buildDuoLesson(apiParts, packKey));
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(DUO_HEARTS);
  const [correct, setCorrect] = useState(0);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [assembled, setAssembled] = useState<string[]>([]);
  const [stage, setStage] = useState<"playing" | "done">("playing");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const startedAt = useRef(Date.now());

  const exercise = exercises[index];
  const finished = stage === "done";
  const outOfHearts = hearts <= 0;

  const speak = useCallback((text: string) => { void tts(text, 0.95, "de-DE"); }, []);

  // Listening exercises play themselves — the question is the audio.
  useEffect(() => {
    if (!exercise || finished) return;
    if (exercise.kind === "listen") speak(exercise.prompt);
    if (exercise.kind === "type-de") window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [exercise, finished, speak]);

  const finish = useCallback((finalCorrect: number, heartsLeft: number) => {
    const xp = duoXpFor(finalCorrect, exercises.length, heartsLeft);
    setStage("done");
    onFinished?.({ correct: finalCorrect, total: exercises.length, xp, heartsLeft });
  }, [exercises.length, onFinished]);

  /**
   * `choice` is passed in when a multiple-choice option is tapped.
   *
   * Tapping an option grades it there and then, so the answer is one action
   * rather than two — picking a line and then reaching for Check underneath
   * it was a second press that never told us anything the first had not.
   * The state setter is asynchronous, so the tapped index has to travel as an
   * argument; reading `picked` here would grade the PREVIOUS selection.
   */
  const submit = useCallback((choice?: number) => {
    if (!exercise || verdict) return;
    let ok = false;
    let note: string | null = null;
    let expected = "";

    if (exercise.kind === "build") {
      ok = duoCheckBuild(assembled, exercise.solution ?? []);
      expected = (exercise.solution ?? []).join(" ");
    } else if (exercise.kind === "type-de") {
      const result = duoCheckTyped(typed, exercise.target ?? "");
      ok = result.ok;
      note = result.note;
      expected = exercise.target ?? "";
    } else {
      const chosen = choice ?? picked;
      // Nothing chosen is not a wrong answer. The Check button was disabled
      // in that state but the Enter handler was not, so a stray Return on a
      // question you had not answered marked it wrong and took a heart.
      if (chosen == null) return;
      ok = chosen === exercise.answerIndex;
      expected = exercise.options?.[exercise.answerIndex ?? 0] ?? "";
    }

    setVerdict({ correct: ok, note, expected });
    // Same grading call as everywhere else, so the two learning modes cannot
    // form separate opinions of what this learner knows.
    setItemStatus(exercise.item.id, ok ? "known" : "struggle", undefined, exercise.item.aliases ?? []);
    if (ok) setCorrect((value) => value + 1);
    else setHearts((value) => value - 1);
  }, [exercise, verdict, assembled, typed, picked]);

  const next = useCallback(() => {
    const wasCorrect = verdict?.correct ?? false;
    const runningCorrect = correct;
    const heartsLeft = hearts;
    setVerdict(null);
    setPicked(null);
    setTyped("");
    setAssembled([]);
    if (heartsLeft <= 0) { finish(runningCorrect, 0); return; }
    if (index + 1 >= exercises.length) { finish(runningCorrect, heartsLeft); return; }
    setIndex((value) => value + 1);
    void wasCorrect;
  }, [verdict, correct, hearts, index, exercises.length, finish]);

  // Enter checks, then Enter continues — the whole lesson is playable from the
  // keyboard, which is what makes the format quick.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || finished) return;
      event.preventDefault();
      if (verdict) next();
      else submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [verdict, next, submit, finished]);

  const canSubmit = useMemo(() => {
    if (!exercise) return false;
    if (exercise.kind === "build") return assembled.length === (exercise.solution ?? []).length;
    if (exercise.kind === "type-de") return typed.trim().length > 0;
    return picked != null;
  }, [exercise, assembled, typed, picked]);

  if (exercises.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm font-black text-[var(--text-1)]">{ui("Nothing to practise here yet")}</p>
        <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
          {ui("This unit has no items the course can build a lesson from.")}
        </p>
        <button type="button" onClick={onExit} className="accent-btn mt-5 inline-flex h-11 items-center px-6 text-sm">
          {ui("Back to the path")}
        </button>
      </div>
    );
  }

  if (finished) {
    const xp = duoXpFor(correct, exercises.length, hearts);
    const seconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const accuracy = Math.round((correct / exercises.length) * 100);
    return (
      <div className="card p-8 text-center">
        <div className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
          outOfHearts ? "bg-[var(--danger-bg)] text-[var(--danger-text)]" : "bg-[var(--success-bg)] text-[var(--success-text)]"
        )}>
          {outOfHearts ? <Heart className="h-7 w-7" /> : <Check className="h-7 w-7" />}
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-1)]">
          {outOfHearts ? ui("Out of hearts") : ui("Lesson complete")}
        </h2>
        <p className="mt-1 text-sm font-bold text-[var(--text-3)]">{packTitle}</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[var(--surface-2)] p-4">
            <p className="text-2xl font-black text-[var(--accent)]">+{xp}</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--text-3)]">{ui("XP")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] p-4">
            <p className="text-2xl font-black text-[var(--text-1)]">{accuracy}%</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--text-3)]">{ui("Accuracy")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] p-4">
            <p className="text-2xl font-black text-[var(--text-1)]">{seconds}s</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--text-3)]">{ui("Time")}</p>
          </div>
        </div>
        <button type="button" onClick={onExit} className="accent-btn mt-6 inline-flex h-12 w-full items-center justify-center px-6 text-sm">
          {ui("Back to the path")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="card flex items-center gap-4 p-4">
        <button
          type="button"
          onClick={onExit}
          aria-label={ui("Leave lesson")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            animate={{ width: `${(index / exercises.length) * 100}%` }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1" aria-label={`${hearts} ${ui("hearts left")}`}>
          {Array.from({ length: DUO_HEARTS }).map((_, heartIndex) => (
            <Heart
              key={heartIndex}
              className={cn(
                "h-4 w-4 transition-colors",
                heartIndex < hearts ? "fill-rose-500 text-rose-500" : "text-[var(--surface-3)]"
              )}
            />
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
          {exercise.kind === "choose-en" ? ui("What does this mean?")
            : exercise.kind === "choose-de" ? ui("How do you say this?")
            : exercise.kind === "build" ? ui("Put it in order")
            : exercise.kind === "listen" ? ui("What did you hear?")
            : ui("Type it in German")}
        </p>

        <div className="mt-3 flex items-start gap-3">
          {(exercise.kind === "listen" || exercise.kind === "choose-en" || exercise.kind === "build") && (
            <button
              type="button"
              onClick={() => speak(exercise.prompt)}
              aria-label={ui("Play audio")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-text)]"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
          {/* A listening exercise that prints the sentence is a reading
              exercise. The text stays hidden until the answer is in. */}
          <h2 lang={exercise.kind === "choose-de" || exercise.kind === "type-de" ? undefined : "de"}
              className="text-2xl font-black leading-snug tracking-tight text-[var(--text-1)]">
            {exercise.kind === "listen" && !verdict ? "· · ·" : exercise.prompt}
          </h2>
        </div>

        <div className="mt-6">
          {exercise.options && (
            <div className="grid gap-2.5">
              {exercise.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  type="button"
                  disabled={Boolean(verdict)}
                  onClick={() => { setPicked(optionIndex); submit(optionIndex); }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                    verdict && optionIndex === exercise.answerIndex
                      ? "border-[var(--success-text)] bg-[var(--success-bg)]"
                      : verdict && optionIndex === picked
                        ? "border-[var(--danger-text)] bg-[var(--danger-bg)]"
                        : picked === optionIndex
                          ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                          : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-black text-[var(--text-3)]">
                    {optionIndex + 1}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-1)]">{option}</span>
                </button>
              ))}
            </div>
          )}

          {exercise.kind === "build" && (
            <div>
              <div className="min-h-[64px] rounded-2xl border border-dashed border-[var(--border-2)] p-3">
                <div className="flex flex-wrap gap-2">
                  {assembled.map((word, wordIndex) => (
                    <button
                      key={`${word}-${wordIndex}`}
                      type="button"
                      disabled={Boolean(verdict)}
                      onClick={() => setAssembled((current) => current.filter((_, i) => i !== wordIndex))}
                      className="rounded-xl border border-[var(--accent)] bg-[var(--accent-dim)] px-3 py-2 text-sm font-black text-[var(--text-1)]"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(exercise.tiles ?? []).map((word, wordIndex) => {
                  // Tiles are consumed by position, so a sentence repeating a
                  // word ("Ich bin, was ich bin") still has one tile per use.
                  const usedCount = assembled.filter((entry) => entry === word).length;
                  const availableCount = (exercise.tiles ?? []).filter((entry) => entry === word).length;
                  const exhausted = usedCount >= availableCount;
                  return (
                    <button
                      key={`${word}-${wordIndex}`}
                      type="button"
                      disabled={exhausted || Boolean(verdict)}
                      onClick={() => setAssembled((current) => [...current, word])}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm font-black transition-all",
                        exhausted
                          ? "border-transparent bg-[var(--surface-2)] text-transparent"
                          : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-1)] hover:border-[var(--accent)]"
                      )}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {exercise.kind === "type-de" && (
            <input
              ref={inputRef}
              value={typed}
              disabled={Boolean(verdict)}
              onChange={(event) => setTyped(event.target.value)}
              lang="de"
              placeholder={ui("Type the German")}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-base font-bold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
            />
          )}
        </div>
      </section>

      <AnimatePresence>
        {verdict && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "card p-5",
              verdict.correct ? "border-[var(--success-text)]/40" : "border-[var(--danger-text)]/40"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                verdict.correct ? "bg-[var(--success-bg)] text-[var(--success-text)]" : "bg-[var(--danger-bg)] text-[var(--danger-text)]"
              )}>
                {verdict.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-sm font-black",
                  verdict.correct ? "text-[var(--success-text)]" : "text-[var(--danger-text)]"
                )}>
                  {verdict.correct ? ui("Correct") : ui("Not quite")}
                </p>
                {!verdict.correct && (
                  <p className="mt-1 text-sm font-bold text-[var(--text-1)]" lang="de">{verdict.expected}</p>
                )}
                {verdict.note && (
                  <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">{verdict.note}</p>
                )}
                {exercise.item.en && (
                  <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">{exercise.item.en}</p>
                )}
              </div>
              <button type="button" onClick={next} className="accent-btn h-11 shrink-0 px-6 text-sm">
                {index + 1 >= exercises.length || hearts <= 0 ? ui("Finish") : ui("Continue")}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Only where there is still something to submit. A multiple-choice
          question grades itself the moment an option is tapped, so a Check
          button under it would demand a second press to confirm a decision
          already made.

          Keyed on whether the exercise HAS options rather than on its kind:
          a listening exercise comes both ways, with options to pick and as a
          box to type into, and keying on the kind would leave the typed
          variety with no way to submit at all. */}
      {!verdict && !exercise.options && (
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => submit()}
          className="np-check-3d w-full"
        >
          {ui("Check")}
        </button>
      )}
    </div>
  );
}
