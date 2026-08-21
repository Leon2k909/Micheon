import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, CheckCheck, ChevronDown, RotateCcw, Shuffle, Sparkles, Volume2 } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  MATCHER_BOARD_SIZE,
  buildMatcherBoard,
  buildMatcherQueue,
  dealColumns,
  matcherDifficulty,
  matcherStreakAfterMiss,
  type MatcherKind,
  type MatcherPair,
} from "@/lib/matcher";
import {
  setListenReviewLevel,
  snoozeListenItem,
  undoListenReviewChange,
  type ListenReviewChange,
  type ListenReviewLevel,
} from "@/lib/listenMode";
import { tts, stopTts } from "@/lib/voice";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * Match the German to the English, six pairs at a time, until you stop.
 *
 * The board refills the instant it is cleared, walking the same queue the
 * course walks, so this is the whole tracker in pairs rather than a fixed
 * set of rounds with a score at the end.
 *
 * Matching itself still writes nothing. Pairing six visible cards is
 * recognition with the answers on screen, and the app already draws that line
 * for Listen — passive exposure stays passive rather than quietly promoting
 * words you could not produce. Know it is different: that is a declaration,
 * the same one the lesson's skip button makes, so it does write.
 */
const REVIEW_LEVELS: Array<{ value: ListenReviewLevel; label: string; note: string }> = [
  { value: "struggle", label: "Struggling", note: "Comes back as soon as there is a slot" },
  { value: 2, label: "Familiar", note: "About 3 days away, sooner if you slip" },
  { value: 3, label: "Strong", note: "About 10 days away, sooner if you slip" },
  { value: 5, label: "Mastered", note: "About 180 days away, sooner if you slip" },
  { value: "permanent", label: "Never review", note: "Never comes back at all" },
];

/** Put off for a while — the delay half of the menu. */
const PUT_OFF_DAYS = [1, 3, 7, 30];

type MatcherNotice = {
  message: string;
  undo?: { change: ListenReviewChange; pair: MatcherPair };
};

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
   * How many Know its in a row. Drives the difficulty step: pressing it over
   * and over is a complaint that this is too easy, so the mode answers by
   * dealing bigger boards from further down the queue.
   */
  const [knownStreak, setKnownStreak] = useState(0);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [notice, setNotice] = useState<MatcherNotice | null>(null);

  const englishLang = resolveEnglishVariant(getEnglishVariant()) === "american" ? "en-US" : "en-GB";

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

  const difficulty = useMemo(() => matcherDifficulty(knownStreak), [knownStreak]);
  const board = useMemo(
    () => buildMatcherBoard(queue, from, difficulty.boardSize),
    [queue, from, difficulty.boardSize]
  );
  const columns = useMemo(() => dealColumns(board.pairs), [board.pairs]);

  // The notice is only there so a mark can be taken back; left on screen it
  // becomes furniture. Same few seconds Listen gives it.
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), notice.undo ? 8000 : 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => () => stopTts(), []);

  const dealNext = useCallback(() => {
    setSolved(new Set());
    arm(null);
    setMenuFor(null);
    // The difficulty step pushes further down the queue: past the most useful
    // items and into the rarer ones, which is what harder means here.
    setFrom(board.nextFrom + difficulty.skipAhead);
  }, [arm, board.nextFrom, difficulty.skipAhead]);

  // A cleared board is the point of the mode, so the next one arrives on its
  // own. The pause is long enough to see the last pair land.
  useEffect(() => {
    if (board.pairs.length === 0 || solved.size < board.pairs.length) return undefined;
    const timer = window.setTimeout(dealNext, 520);
    return () => window.clearTimeout(timer);
  }, [solved, board.pairs.length, dealNext]);

  // Switching between words and sentences starts a fresh queue.
  const chooseKind = useCallback((next: MatcherKind) => {
    setKind(next);
    setFrom(0);
    setSolved(new Set());
    setMenuFor(null);
    arm(null);
  }, [arm]);

  const speak = useCallback((pair: MatcherPair, side: "de" | "en") => {
    // tts() is already the one door to the mixer: it checks the master and
    // per-language volumes itself and says so on screen when it is muted,
    // so this needs no mute logic of its own and cannot drift from the lesson.
    const text = side === "de" ? pair.de : pair.en;
    if (!text) return;
    void tts(text, side === "de" ? 0.88 : 0.95, side === "de" ? "de-DE" : englishLang);
  }, [englishLang]);

  const choose = useCallback((side: "de" | "en", id: string) => {
    if (solved.has(id)) return;
    setWrong(null);
    setMenuFor(null);
    const pair = board.pairs.find((entry) => entry.id === id);
    if (pair) speak(pair, side);
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
    // press is a fresh guess instead of half of the wrong one. It also costs
    // more of the streak than a Know it earns — the step is meant to settle
    // where you stop breezing through, not to ratchet away from you.
    setMissed((count) => count + 1);
    setKnownStreak(matcherStreakAfterMiss);
    setWrong(id);
    arm(null);
    window.setTimeout(() => setWrong((current) => (current === id ? null : current)), 420);
  }, [arm, board.pairs, solved, speak]);

  /** Say you already have it: writes the same declaration the lesson's skip does. */
  const markKnown = useCallback((pair: MatcherPair, quiet = false) => {
    const change = setListenReviewLevel(pair, 5, profile);
    setSolved((current) => new Set(current).add(pair.id));
    setKnownStreak((streak) => streak + 1);
    setMenuFor(null);
    if (!quiet) {
      setNotice({
        message: uiFmt("“{item}” marked as known.", { item: pair.de }),
        undo: { change, pair },
      });
    }
    return change;
  }, [profile]);

  /** The whole board at once, then straight on to the next one. */
  const knowAll = useCallback(() => {
    const remaining = board.pairs.filter((pair) => !solved.has(pair.id));
    if (remaining.length === 0) return;
    for (const pair of remaining) markKnown(pair, true);
    setNotice({
      message: uiFmt("Marked {n} as known.", { n: uiNumber(remaining.length) }),
    });
  }, [board.pairs, markKnown, solved]);

  const applyLevel = useCallback((pair: MatcherPair, level: ListenReviewLevel, label: string) => {
    const change = setListenReviewLevel(pair, level, profile);
    setSolved((current) => new Set(current).add(pair.id));
    setMenuFor(null);
    // Only Know it claims the item is easy. Setting a level by hand is a
    // correction, so it must not feed the too-easy streak.
    if (level === "struggle" || level === "new") setKnownStreak(matcherStreakAfterMiss);
    setNotice({
      message: uiFmt("“{item}” set to {level}.", { item: pair.de, level: ui(label) }),
      undo: { change, pair },
    });
  }, [profile]);

  const putOff = useCallback((pair: MatcherPair, days: number) => {
    snoozeListenItem(pair, days, profile);
    setSolved((current) => new Set(current).add(pair.id));
    setMenuFor(null);
    setNotice({
      message: uiFmt("“{item}” put off for {days} days.", { item: pair.de, days: uiNumber(days) }),
    });
  }, [profile]);

  const undoNotice = useCallback(() => {
    const pending = notice?.undo;
    if (!pending) return;
    undoListenReviewChange(pending.change, profile);
    setSolved((current) => {
      if (!current.has(pending.pair.id)) return current;
      const next = new Set(current);
      next.delete(pending.pair.id);
      return next;
    });
    setKnownStreak((streak) => Math.max(0, streak - 1));
    setNotice({ message: uiFmt("Took the mark off “{item}”.", { item: pending.pair.de }) });
  }, [notice, profile]);

  const tile = (pair: MatcherPair, side: "de" | "en") => {
    const done = solved.has(pair.id);
    const armed = picked?.side === side && picked.id === pair.id;
    const missedThis = wrong === pair.id;
    const menuOpen = menuFor === pair.id;
    return (
      <div key={`${side}-${pair.id}`} className={cn("matcher-tile", side === "de" && "is-german")}>
        <button
          type="button"
          disabled={done}
          lang={side === "de" ? "de" : "en"}
          onClick={() => choose(side, pair.id)}
          className={cn(
            "flex min-h-[64px] w-full items-center justify-center rounded-2xl border p-3 text-center text-sm font-black transition-all",
            side === "de" && !done && "pr-16",
            done && "border-transparent bg-[var(--success-bg)] text-[var(--success-text)] opacity-70",
            !done && armed && "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]",
            !done && missedThis && "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)]",
            !done && !armed && !missedThis
              && "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)]"
          )}
        >
          {done ? <Check className="h-4 w-4" aria-hidden="true" /> : (side === "de" ? pair.de : pair.en)}
        </button>

        {/* The grade controls hang off the German tile only: one set per pair,
            on the side that names the thing being graded. */}
        {side === "de" && !done && (
          <span className="matcher-tile-actions">
            <button
              type="button"
              aria-label={uiFmt("Mark “{item}” as known", { item: pair.de })}
              className="matcher-tile-btn"
              onClick={(event) => { event.stopPropagation(); markKnown(pair); }}
              title={ui("Know it")}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={uiFmt("More options for “{item}”", { item: pair.de })}
              className="matcher-tile-btn"
              onClick={(event) => {
                event.stopPropagation();
                setMenuFor((current) => (current === pair.id ? null : pair.id));
              }}
            >
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", menuOpen && "rotate-180")} aria-hidden="true" />
            </button>
          </span>
        )}

        {menuOpen && !done && (
          <div className="matcher-tile-menu" role="menu" aria-label={ui("Set level or put off")}>
            <strong>{ui("Set level")}</strong>
            {REVIEW_LEVELS.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                role="menuitem"
                onClick={() => applyLevel(pair, option.value, option.label)}
              >
                <span>{ui(option.label)}</span>
                <small>{ui(option.note)}</small>
              </button>
            ))}
            <strong>{ui("Put off")}</strong>
            <span className="matcher-tile-menu-days">
              {PUT_OFF_DAYS.map((days) => (
                <button
                  key={days}
                  type="button"
                  role="menuitem"
                  onClick={() => putOff(pair, days)}
                >
                  {uiFmt("{days}d", { days: uiNumber(days) })}
                </button>
              ))}
            </span>
          </div>
        )}
      </div>
    );
  };

  const remaining = board.pairs.filter((pair) => !solved.has(pair.id)).length;

  return (
    <div className="space-y-4" onPointerDown={(event) => {
      // Any press outside a menu closes it.
      if (!(event.target instanceof Element) || !event.target.closest(".matcher-tile")) setMenuFor(null);
    }}>
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
          <div className="flex flex-wrap items-center gap-2">
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
            <button
              type="button"
              onClick={knowAll}
              disabled={remaining === 0}
              data-testid="matcher-know-all"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-500/18 disabled:opacity-40 dark:text-emerald-300"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {uiFmt("Know all {n}", { n: uiNumber(remaining) })}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs font-bold text-[var(--text-3)]">
          {uiFmt("{matched} matched · {missed} missed", {
            matched: uiNumber(matched),
            missed: uiNumber(missed),
          })}
          {" · "}
          {uiFmt("{n} in the queue", { n: uiNumber(queue.length) })}
          {difficulty.step > 0 && (
            <>
              {" · "}
              <span className="font-black text-[var(--accent)]">
                {uiFmt("Step {step}: {size} pairs, deeper in", {
                  step: uiNumber(difficulty.step),
                  size: uiNumber(difficulty.boardSize),
                })}
              </span>
            </>
          )}
        </p>
        {notice && (
          <p className="matcher-notice" role="status">
            <span>{notice.message}</span>
            {notice.undo && (
              <button type="button" onClick={undoNotice}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {ui("Undo")}
              </button>
            )}
          </p>
        )}
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
          <Volume2 className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
          {ui("Tapping a card speaks it, at whatever volume you set for that language. Matching itself changes nothing — both answers are on screen, so it is recognition. Know it and the level menu do write, the same as anywhere else, and keep saying you know them deals bigger boards from further down the queue.")}
        </p>
      </section>
    </div>
  );
}
