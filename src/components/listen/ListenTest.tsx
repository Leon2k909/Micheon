import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ListenItem } from "@/lib/listenMode";
import {
  buildListenTest,
  listenTestScore,
  type ListenTestVerdict,
} from "@/lib/listenTest";

/**
 * How much of the last stretch of listening actually stuck.
 *
 * One heard item per question, its English among three that could be mistaken
 * for it. At the end: a score, and the ones that got away — which is the part
 * worth reading, because a list of four words you thought you knew is more
 * use than a number.
 *
 * Nothing here writes progress. It says so on screen rather than leaving the
 * learner to work out why a word they just got right is still due.
 */
export function ListenTest({
  heard,
  pool,
  onClose,
}: {
  heard: ListenItem[];
  pool: ListenItem[];
  onClose: () => void;
}) {
  const [round, setRound] = useState(0);
  const questions = useMemo(() => buildListenTest(heard, pool), [heard, pool, round]);
  const [at, setAt] = useState(0);
  const [verdicts, setVerdicts] = useState<ListenTestVerdict[]>([]);

  const question = questions[at];
  const done = questions.length > 0 && at >= questions.length;

  const answer = useCallback((chosen: string) => {
    if (!question) return;
    setVerdicts((current) => [
      ...current,
      { id: question.id, prompt: question.prompt, answer: question.answer, chosen },
    ]);
    setAt((current) => current + 1);
  }, [question]);

  const again = useCallback(() => {
    setVerdicts([]);
    setAt(0);
    setRound((current) => current + 1);
  }, []);

  const header = (
    <button
      className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
      onClick={onClose}
      type="button"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {ui("Back to Listen")}
    </button>
  );

  // Nothing has played yet, or too little has, for a fair question.
  if (!questions.length) {
    return (
      <section className="card p-6 text-center" data-testid="listen-test">
        <div className="flex justify-start">{header}</div>
        <p className="mt-4 text-sm font-black text-[var(--text-1)]">
          {ui("Listen to a few first")}
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs font-semibold leading-5 text-[var(--text-3)]">
          {ui("This tests what this sitting has played. Press play, let a few cards go by, then come back.")}
        </p>
      </section>
    );
  }

  if (done) {
    const { right, total } = listenTestScore(verdicts);
    const missed = verdicts.filter((verdict) => verdict.chosen !== verdict.answer);
    return (
      <section className="card p-6" data-testid="listen-test-result">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {header}
          <button
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent-dim)] px-3.5 text-xs font-black text-[var(--accent)] transition-colors hover:bg-[var(--surface-3)]"
            onClick={again}
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {ui("Test again")}
          </button>
        </div>

        <p className="mt-6 text-center text-4xl font-black text-[var(--text-1)]" data-testid="listen-test-score">
          {uiFmt("{right} of {total}", { right: uiNumber(right), total: uiNumber(total) })}
        </p>
        <p className="mt-1 text-center text-sm font-bold text-[var(--text-3)]">
          {ui(missed.length === 0 ? "All of them. Nothing got past you." : "remembered")}
        </p>

        {missed.length > 0 && (
          <div className="mx-auto mt-6 max-w-2xl">
            <strong className="block text-xs font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("The ones that got away")}
            </strong>
            <ul className="mt-2 grid gap-2">
              {missed.map((verdict) => (
                <li
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2.5"
                  key={verdict.id}
                >
                  <span className="text-sm font-black text-[var(--text-1)]" lang="de">{verdict.prompt}</span>
                  <span className="mt-0.5 block text-xs font-bold text-[var(--text-2)]" lang="en">
                    {verdict.answer}
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-[var(--danger-text)]">
                    {uiFmt("you said: {chosen}", { chosen: verdict.chosen })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs font-semibold leading-5 text-[var(--text-3)]">
          {ui("A score here changes nothing in your lessons — picking from four is recognition, and the lessons ask you to produce the word. It is a read on how the listening is going.")}
        </p>
      </section>
    );
  }

  return (
    <section className="card p-6" data-testid="listen-test">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {header}
        <span className="text-xs font-black text-[var(--text-3)]">
          {uiFmt("{n} of {total}", { n: uiNumber(at + 1), total: uiNumber(questions.length) })}
        </span>
      </div>

      <p className="mt-8 text-center text-3xl font-black text-[var(--text-1)]" lang="de" data-testid="listen-test-prompt">
        {question.prompt}
      </p>
      <p className="mt-2 text-center text-xs font-bold text-[var(--text-3)]">
        {ui("What does it mean?")}
      </p>

      <div className="mx-auto mt-6 grid max-w-2xl gap-2.5 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            className={cn(
              "min-h-[56px] rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3",
              "text-center text-sm font-black text-[var(--text-1)] transition-colors",
              "hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]"
            )}
            key={option}
            lang="en"
            onClick={() => answer(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>

      {verdicts.length > 0 && (
        <p className="mt-6 text-center text-xs font-bold text-[var(--text-3)]">
          <Check className="mr-1 inline h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          {uiNumber(verdicts.filter((v) => v.chosen === v.answer).length)}
          <X className="ml-3 mr-1 inline h-3.5 w-3.5 text-[var(--danger-text)]" aria-hidden="true" />
          {uiNumber(verdicts.filter((v) => v.chosen !== v.answer).length)}
        </p>
      )}
    </section>
  );
}
