import React, { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Eye, RotateCcw, ScrollText } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { GlossedGerman } from "@/components/shared/GlossedGerman";
import { coverIdeas, PASSAGES, type Passage } from "@/lib/passages";

/**
 * Read a paragraph of real German and say what it means.
 *
 * The one exercise in the app that recognition cannot pass. Everything else
 * can be got through by spotting the right answer among four; here there is
 * nothing to spot — you either understood the four messages or you did not,
 * and writing the English is the proof.
 *
 * Hovering a word gives its gloss on purpose. Not knowing that Filiale is a
 * branch is a lookup, not a skill, and making somebody guess it teaches
 * nothing. What is left after the lookups is the actual work: which clause
 * belongs to which, what the particle is doing, where the verb went.
 */
export function PassagesView() {
  const [openId, setOpenId] = useState<string | null>(null);
  const passage = useMemo(() => PASSAGES.find((entry) => entry.id === openId) ?? null, [openId]);

  if (passage) {
    return <PassageRun key={passage.id} passage={passage} onBack={() => setOpenId(null)} />;
  }

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <ScrollText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide text-[var(--accent)]">
              {ui("Read it and say it back")}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-1)]">
              {ui("Passages")}
            </h2>
            <p className="mt-1.5 text-sm font-semibold leading-6 text-[var(--text-3)]">
              {ui("German the way it actually reaches you — messages, notes, a rant about a parcel. Read the whole thing, then put each line into English. Hover any word you do not know; working out the sentence is the part that counts.")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-2.5 sm:grid-cols-2">
        {PASSAGES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setOpenId(entry.id)}
            className="card p-4 text-left transition-colors hover:bg-[var(--surface-2)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {entry.source}
              </p>
              <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-black text-[var(--text-3)]">
                {entry.level}
              </span>
            </div>
            <p className="mt-1.5 text-base font-black text-[var(--text-1)]">{entry.title}</p>
            <p className="mt-1 truncate text-xs font-semibold text-[var(--text-3)]" lang="de">
              {entry.lines[0]?.de}
            </p>
            <p className="mt-2 text-[11px] font-bold text-[var(--text-3)]">
              {uiFmt("{count} lines", { count: uiNumber(entry.lines.length) })}
            </p>
          </button>
        ))}
      </section>
    </div>
  );
}

/** One passage, line by line. */
function PassageRun({ passage, onBack }: { passage: Passage; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState("");
  /** Attempts kept so the end can show the whole thing back. */
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [scored, setScored] = useState<Record<number, "got" | "close" | "missed">>({});

  const line = passage.lines[index];
  const done = index >= passage.lines.length;

  const coverage = useMemo(
    () => (revealed && line ? coverIdeas(line.en, attempt) : null),
    [revealed, line, attempt]
  );

  const commit = useCallback(() => {
    setAnswers((current) => ({ ...current, [index]: attempt }));
    setRevealed(true);
  }, [attempt, index]);

  const mark = useCallback((verdict: "got" | "close" | "missed") => {
    setScored((current) => ({ ...current, [index]: verdict }));
    setRevealed(false);
    setAttempt("");
    setIndex((value) => value + 1);
  }, [index]);

  const restart = useCallback(() => {
    setIndex(0);
    setAttempt("");
    setAnswers({});
    setScored({});
    setRevealed(false);
  }, []);

  const header = (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {ui("All passages")}
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-black text-[var(--text-1)]">{passage.title}</p>
          <p className="text-[11px] font-bold text-[var(--text-3)]">
            {passage.source} · {passage.level}
          </p>
        </div>
        <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-black text-[var(--text-3)]">
          {Math.min(index + 1, passage.lines.length)} / {passage.lines.length}
        </span>
      </div>
    </section>
  );

  if (done) {
    const got = Object.values(scored).filter((value) => value === "got").length;
    return (
      <div className="space-y-4">
        {header}
        <section className="card p-5 sm:p-6">
          <h3 className="text-lg font-black tracking-tight text-[var(--text-1)]">
            {ui("The whole thing, both ways")}
          </h3>
          <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
            {uiFmt("You marked {got} of {total} as understood.", {
              got: uiNumber(got),
              total: uiNumber(passage.lines.length),
            })}
          </p>
          <div className="mt-4 space-y-3">
            {passage.lines.map((entry, at) => (
              <div key={entry.de} className="rounded-2xl bg-[var(--surface-2)] p-4">
                <p className="text-sm font-black text-[var(--text-1)]" lang="de">{entry.de}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-2)]">{entry.en}</p>
                {answers[at] ? (
                  <p className="mt-2 text-xs font-semibold text-[var(--text-3)]">
                    <span className="font-black">{ui("You wrote")}: </span>{answers[at]}
                  </p>
                ) : null}
                {entry.note ? (
                  <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[11px] font-semibold leading-5 text-[var(--text-3)]">
                    {entry.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={restart}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-4 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {ui("Again")}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-xs font-black text-[var(--accent-text)] transition-colors hover:brightness-110"
            >
              {ui("Another passage")}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {header}

      {/*
        The whole passage stays on screen while you work through it. A
        message only makes sense next to the ones around it, and hiding the
        rest would turn this back into single-sentence practice.
      */}
      <section className="card p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
          {ui("Hover a word for its meaning")}
        </p>
        <div className="mt-3 space-y-2">
          {passage.lines.map((entry, at) => (
            <p
              key={entry.de}
              lang="de"
              className={cn(
                "rounded-xl px-3 py-2 text-base font-bold leading-8 transition-colors",
                at === index ? "bg-[var(--accent-dim)] text-[var(--text-1)]" : "text-[var(--text-3)]"
              )}
            >
              {/* The line's own glossary wins: it knows which sense is meant
                  here, which a word-level lookup cannot. */}
              <GlossedGerman text={entry.de} glosses={entry.glosses} />
            </p>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <label className="block">
          <span className="text-sm font-black text-[var(--text-1)]">
            {uiFmt("Put line {number} into English", { number: uiNumber(index + 1) })}
          </span>
          <textarea
            value={attempt}
            onChange={(event) => setAttempt(event.target.value)}
            rows={3}
            disabled={revealed}
            placeholder={ui("Say what it means, in your own words")}
            className="mt-2 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5 text-sm font-semibold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)] disabled:opacity-70"
          />
        </label>

        {!revealed ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!attempt.trim()}
              onClick={commit}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-black transition-colors",
                attempt.trim()
                  ? "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110"
                  : "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-3)]"
              )}
            >
              <Check className="h-3.5 w-3.5" />
              {ui("Compare with the answer")}
            </button>
            <button
              type="button"
              onClick={() => { setAttempt(""); setRevealed(true); }}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-4 text-xs font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
            >
              <Eye className="h-3.5 w-3.5" />
              {ui("Show me")}
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("One natural English version")}
              </p>
              <p className="mt-1 text-base font-black text-[var(--text-1)]">{line.en}</p>
              {line.note ? (
                <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
                  {line.note}
                </p>
              ) : null}
            </div>

            {/*
              Not a mark. Two good translations can share almost no words, so
              the only honest thing to report is which ideas went unmentioned
              — enough to catch a clause you skipped, and no more.
            */}
            {coverage && coverage.total > 0 && attempt.trim() ? (
              <p className="text-xs font-semibold text-[var(--text-3)]">
                {coverage.missing.length === 0
                  ? ui("Your version mentions everything the reference does.")
                  : uiFmt("Not in your version: {words}", { words: coverage.missing.join(", ") })}
              </p>
            ) : null}

            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("You are the judge")}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {([
                  ["got", "I had it"],
                  ["close", "Close enough"],
                  ["missed", "I missed it"],
                ] as const).map(([verdict, label]) => (
                  <button
                    key={verdict}
                    type="button"
                    onClick={() => mark(verdict)}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-xs font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
                  >
                    {ui(label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
