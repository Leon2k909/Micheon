import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Shuffle, Sparkles } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  MATCHER_BOARD_SIZE,
  buildMatcherBoard,
  buildMatcherQueue,
  dealColumns,
  type MatcherKind,
  type MatcherPair,
} from "@/lib/matcher";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * Match the German to the English, six pairs at a time, until you stop.
 *
 * The board refills the instant it is cleared, walking the same queue the
 * course walks, so this is the whole tracker in pairs rather than a fixed
 * set of rounds with a score at the end.
 *
 * It deliberately writes no progress. Matching six visible pairs is
 * recognition with the answers on screen, and the app already draws that line
 * for Listen — passive exposure stays passive rather than quietly promoting
 * words you could not produce. Said on screen rather than left to be noticed.
 */
export function MatcherView({
  apiParts,
  profile,
  onExit,
}: {
  apiParts: Record<string, unknown>;
  profile: UserProfile | null;
  onExit: () => void;
}) {
  const [kind, setKind] = useState<MatcherKind>("words");
  const [from, setFrom] = useState(0);
  const [picked, setPicked] = useState<{ side: "de" | "en"; id: string } | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [matched, setMatched] = useState(0);
  const [missed, setMissed] = useState(0);

  /**
   * What is currently armed, in a ref as well as in state.
   *
   * Two clicks inside one frame both read the same render's `picked`, so the
   * second one saw nothing armed and scored a miss on a correct pair. Nobody
   * clicks that fast by accident — but this is a mode built for clicking fast,
   * and it was the first thing that happened when the board was driven at
   * speed. The ref is the truth; the state is what draws.
   */
  const pickedRef = useRef<{ side: "de" | "en"; id: string } | null>(null);
  const arm = useCallback((next: { side: "de" | "en"; id: string } | null) => {
    pickedRef.current = next;
    setPicked(next);
  }, []);

  const queue = useMemo(
    () => buildMatcherQueue(apiParts, kind, profile),
    [apiParts, kind, profile]
  );

  const board = useMemo(() => buildMatcherBoard(queue, from), [queue, from]);
  const columns = useMemo(() => dealColumns(board.pairs), [board.pairs]);

  // A cleared board is the point of the mode, so the next one arrives on its
  // own. The pause is long enough to see the last pair land.
  useEffect(() => {
    if (board.pairs.length === 0 || solved.size < board.pairs.length) return undefined;
    const timer = window.setTimeout(() => {
      setSolved(new Set());
      arm(null);
      setFrom(board.nextFrom);
    }, 520);
    return () => window.clearTimeout(timer);
  }, [solved, board, arm]);

  // Switching between words and sentences starts a fresh queue.
  const chooseKind = useCallback((next: MatcherKind) => {
    setKind(next);
    setFrom(0);
    setSolved(new Set());
    arm(null);
  }, [arm]);

  const choose = useCallback((side: "de" | "en", id: string) => {
    if (solved.has(id)) return;
    setWrong(null);
    const picked = pickedRef.current;
    if (!picked) {
      arm({ side, id });
      return;
    }
    if (picked.side === side) {
      arm({ side, id });
      return;
    }
    if (picked.id === id) {
      setSolved((current) => new Set(current).add(id));
      setMatched((count) => count + 1);
      arm(null);
      return;
    }
    // A miss clears the selection rather than leaving it armed, so the next
    // press is a fresh guess instead of half of the wrong one.
    setMissed((count) => count + 1);
    setWrong(id);
    arm(null);
    window.setTimeout(() => setWrong((current) => (current === id ? null : current)), 420);
  }, [arm, solved]);

  const tile = (pair: MatcherPair, side: "de" | "en") => {
    const done = solved.has(pair.id);
    const armed = picked?.side === side && picked.id === pair.id;
    const missedThis = wrong === pair.id;
    return (
      <button
        key={`${side}-${pair.id}`}
        type="button"
        disabled={done}
        lang={side === "de" ? "de" : "en"}
        onClick={() => choose(side, pair.id)}
        className={cn(
          "flex min-h-[64px] items-center justify-center rounded-2xl border p-3 text-center text-sm font-black transition-all",
          done && "border-transparent bg-[var(--success-bg)] text-[var(--success-text)] opacity-70",
          !done && armed && "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]",
          !done && missedThis && "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]",
          !done && !armed && !missedThis
            && "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)]"
        )}
      >
        {done ? <Check className="h-4 w-4" aria-hidden="true" /> : (side === "de" ? pair.de : pair.en)}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {ui("Back")}
          </button>
          <div className="flex items-center gap-2">
            {([["words", "Words"], ["sentences", "Sentences"]] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => chooseKind(value)}
                aria-pressed={kind === value}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-black transition-colors",
                  kind === value
                    ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                )}
              >
                {ui(label)}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs font-bold text-[var(--text-3)]">
          {uiFmt("{matched} matched · {missed} missed", {
            matched: uiNumber(matched),
            missed: uiNumber(missed),
          })}
          {" · "}
          {uiFmt("{n} in the queue", { n: uiNumber(queue.length) })}
        </p>
      </section>

      {board.pairs.length === 0 ? (
        <section className="card p-8 text-center">
          <Shuffle className="mx-auto h-8 w-8 text-[var(--text-3)]" />
          <p className="mt-3 text-sm font-black text-[var(--text-1)]">
            {ui("Nothing to match yet")}
          </p>
          <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
            {ui("Once the course content is loaded, everything you are learning can be matched here.")}
          </p>
        </section>
      ) : (
        <section className="card p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2.5" data-testid="matcher-german">
              {columns.german.map((pair) => tile(pair, "de"))}
            </div>
            <div className="grid gap-2.5" data-testid="matcher-english">
              {columns.english.map((pair) => tile(pair, "en"))}
            </div>
          </div>
        </section>
      )}

      <section className="card flex items-start gap-3 p-5">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
        <p className="text-xs font-semibold leading-5 text-[var(--text-3)]">
          {ui("Practice only — matching with both answers on screen is recognition, so nothing here changes your progress. It works through the same order your lessons do, and refills as soon as you clear a board.")}
        </p>
      </section>
    </div>
  );
}
