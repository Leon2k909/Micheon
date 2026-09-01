import { useCallback, useMemo, useState } from "react";

import { ArrowRight, Gauge, TrendingUp, X } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getAuthUser, saveScopedJson } from "@/lib/profileStorage";
import { getLearningDirection } from "@/lib/direction";
import { courseSides } from "@/lib/courseLanguages";
import {
  PLACEMENT_LEVELS,
  PLACEMENT_PASS,
  PLACEMENT_ROUND_SIZE,
  assessPlacement,
  nextPlacementLevel,
  placementPartFor,
  placementRound,
  type Cefr,
  type PlacementQuestion,
} from "@/lib/placementTest";

/**
 * The placement test, as a ladder you climb until you fall off.
 *
 * Doing well in the test has to make Continue learning harder. The old test
 * could not do that — it asked ten A1–B1 words and topped out at B1, so a strong
 * the second half — it asked ten A1–B1 words and topped out at B1, so a strong
 * result had nowhere to put you.
 *
 * This asks a five-question round at a level, and moves up only while you are
 * passing four of five. It stops at the first level you miss and places you at
 * the highest you cleared, which is written to the same key Continue learning
 * already reads. Nothing else in the lesson pipeline changed: it was always
 * capable of starting anywhere in the curriculum, it was only ever being told
 * to start low.
 */
export function PlacementLadder({
  apiParts,
  onClose,
  onPlaced,
}: {
  apiParts: Record<string, unknown>;
  onClose: () => void;
  onPlaced?: (level: Cefr | null, partKey: string | null) => void;
}) {
  const direction = getLearningDirection();
  const sides = courseSides(direction);
  const [level, setLevel] = useState<Cefr>("A1");
  const [questions, setQuestions] = useState<PlacementQuestion[]>(() => placementRound(direction, "A1"));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [cleared, setCleared] = useState<Cefr[]>([]);
  const [asked, setAsked] = useState(0);
  const [stage, setStage] = useState<"asking" | "result">("asking");
  const [placedLevel, setPlacedLevel] = useState<Cefr | null>(null);
  const [placedPart, setPlacedPart] = useState<string | null>(null);

  const question = questions[index];

  const finish = useCallback((finalCleared: Cefr[]) => {
    const best = assessPlacement(finalCleared);
    const partKey = placementPartFor(best, apiParts);
    const user = getAuthUser();
    // The same two keys the first-run test writes, so Continue learning picks
    // this up with no other wiring — and so retaking it moves you.
    if (partKey) saveScopedJson("german-lab-placement-result", partKey, user);
    saveScopedJson("german-lab-placement-done", true, user);
    setPlacedLevel(best);
    setPlacedPart(partKey);
    setStage("result");
    onPlaced?.(best, partKey);
  }, [apiParts, onPlaced]);

  const advance = useCallback(() => {
    if (picked == null || !question) return;
    const wasRight = picked === question.answer;
    const correctSoFar = roundCorrect + (wasRight ? 1 : 0);
    setPicked(null);
    setAsked((value) => value + 1);

    if (index + 1 < questions.length) {
      setRoundCorrect(correctSoFar);
      setIndex((value) => value + 1);
      return;
    }

    // Round over. Passed means climb; failed means stop where you are.
    const passed = correctSoFar >= PLACEMENT_PASS;
    const nextCleared = passed ? [...cleared, level] : cleared;
    const nextLevel = passed ? nextPlacementLevel(level) : null;
    if (!nextLevel) { finish(nextCleared); return; }

    const round = placementRound(direction, nextLevel);
    if (round.length === 0) { finish(nextCleared); return; }
    setCleared(nextCleared);
    setLevel(nextLevel);
    setQuestions(round);
    setIndex(0);
    setRoundCorrect(0);
  }, [picked, question, roundCorrect, index, questions.length, cleared, level, direction, finish]);

  const partTitle = useMemo(() => {
    if (!placedPart) return null;
    const part = apiParts[placedPart] as { theme?: unknown; label?: unknown } | undefined;
    return String(part?.theme || part?.label || placedPart);
  }, [apiParts, placedPart]);

  if (stage === "result") {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
          <Gauge className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-1)]">
          {placedLevel ? uiFmt("You placed at {level}", { level: placedLevel }) : ui("Starting from the beginning")}
        </h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-3)]">
          {placedLevel
            ? uiFmt("You cleared {n} of {total} levels across {asked} questions.", {
                n: cleared.length, total: PLACEMENT_LEVELS.length, asked,
              })
            : ui("No level was cleared, so the course starts at the first pack. That is the right place to begin.")}
        </p>

        {partTitle && (
          <div className="mt-5 rounded-2xl bg-[var(--surface-2)] p-4 text-left">
            <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Continue learning now starts here")}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-black text-[var(--text-1)]">
              <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
              {partTitle}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {PLACEMENT_LEVELS.map((entry) => (
            <span
              key={entry}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-black",
                cleared.includes(entry)
                  ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                  : "bg-[var(--surface-2)] text-[var(--text-3)]"
              )}
            >
              {entry}
            </span>
          ))}
        </div>

        <button type="button" onClick={onClose} className="accent-btn mt-6 inline-flex h-12 w-full items-center justify-center px-6 text-sm">
          {ui("Done")}
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm font-black text-[var(--text-1)]">{ui("No placement questions available")}</p>
        <button type="button" onClick={onClose} className="accent-btn mt-5 inline-flex h-11 items-center px-6 text-sm">
          {ui("Close")}
        </button>
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
            {ui("Placement test")} · {ui(sides.target.label)}
          </p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-[var(--text-1)]">
            {uiFmt("Level {level} — question {n} of {total}", { level, n: index + 1, total: questions.length })}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={ui("Leave placement test")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* The ladder, so it is obvious the test is climbing rather than just
          being long. Somebody who has cleared B1 can see they have. */}
      <div className="mt-4 flex items-center gap-1.5">
        {PLACEMENT_LEVELS.map((entry) => (
          <div key={entry} className="flex flex-1 flex-col items-center gap-1">
            <div className={cn(
              "h-1.5 w-full rounded-full",
              cleared.includes(entry) ? "bg-[var(--success-text)]"
                : entry === level ? "bg-[var(--accent)]"
                : "bg-[var(--surface-2)]"
            )} />
            <span className={cn(
              "text-[10px] font-black",
              entry === level ? "text-[var(--accent)]" : "text-[var(--text-3)]"
            )}>{entry}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
        {ui(question.instruction)}
      </p>
      <h3 className="mt-2 text-2xl font-black leading-snug tracking-tight text-[var(--text-1)]"
          lang={sides.target.htmlLang}>
        {question.prompt}
      </h3>

      <div className="mt-5 grid gap-2.5">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            type="button"
            onClick={() => setPicked(optionIndex)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
              picked === optionIndex
                ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
            )}
          >
            <span className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
              picked === optionIndex ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--surface)] text-[var(--text-3)]"
            )}>
              {String.fromCharCode(65 + optionIndex)}
            </span>
            <span className="text-sm font-bold text-[var(--text-1)]">{option}</span>
          </button>
        ))}
      </div>

      {/* No mark-as-you-go. A placement test that tells you the answer teaches
          you the next question, and the point here is measurement. */}
      <button
        type="button"
        disabled={picked == null}
        onClick={advance}
        className="accent-btn mt-6 inline-flex h-12 w-full items-center justify-center gap-2 text-sm disabled:opacity-40"
      >
        {index + 1 < questions.length ? ui("Next") : ui("Finish this level")}
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-[11px] font-semibold text-[var(--text-3)]">
        {uiFmt("Get {pass} of {size} right to move up a level.", { pass: PLACEMENT_PASS, size: PLACEMENT_ROUND_SIZE })}
      </p>
    </div>
  );
}
