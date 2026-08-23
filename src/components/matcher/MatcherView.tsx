import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, CheckCheck, ChevronDown, RotateCcw, Shuffle, Sparkles, Volume2 } from "lucide-react";
import { ui, uiFmt, uiNumber, uiOr } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  MATCHER_BOARD_SIZE,
  buildMatcherBoard,
  buildMatcherQueue,
  dealColumns,
  getMatcherCursor,
  getMatcherKind,
  getMatcherMissed,
  matcherDifficulty,
  matcherMissedPairs,
  matcherResumeFrom,
  matcherStreakAfterMiss,
  rememberMiss,
  setMatcherCursor,
  setMatcherKind,
  setMatcherMissed,
  type MatcherKind,
  type MatcherPair,
} from "@/lib/matcher";
import { getLearningDirection } from "@/lib/direction";
import {
  setListenReviewLevel,
  snoozeListenItem,
  undoListenReviewChange,
  type ListenReviewChange,
  type ListenReviewLevel,
} from "@/lib/listenMode";
import { preloadTts, tts, stopTts } from "@/lib/voice";
import { MuteButton } from "@/components/MuteButton";
import { AUDIO_SETTINGS_EVENT } from "@/lib/audioMute";
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
  // Resolved on the first render rather than in an effect, for the same reason
  // the cursor is: opening on Words and then swapping to the remembered list
  // would flash the wrong one every single time.
  const [kind, setKind] = useState<MatcherKind>(() => getMatcherKind(getLearningDirection(), profile));
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

  const direction = useMemo(() => getLearningDirection(), []);

  /**
   * Where you got to, not where the list starts.
   *
   * Resolved on the first render rather than in an effect, so the board is
   * never dealt from the top and then swapped — the flash of sein/werden/haben
   * would say "you are starting again" every single time, which is the thing
   * being fixed.
   */
  const [from, setFrom] = useState(
    () => matcherResumeFrom(queue, getMatcherCursor(kind, direction, profile))
  );
  const [resumedAt] = useState(() => from);

  // Switching list resumes THAT list where it was left, since each of the
  // three keeps its own cursor.
  const lastKind = useRef(kind);
  useEffect(() => {
    if (lastKind.current === kind) return;
    lastKind.current = kind;
    setFrom(matcherResumeFrom(queue, getMatcherCursor(kind, direction, profile)));
    // Each list keeps its own misses too, so load that list's rather than
    // carrying the other one's across.
    setMissedIds(getMatcherMissed(kind, direction, profile));
    savedKind.current = kind;
  }, [kind, queue, direction, profile]);

  /**
   * The ones you got wrong, kept between visits.
   *
   * A pair leaves this list by being matched correctly IN the missed round,
   * not by being matched at all — after a miss the card stays on the board and
   * is almost always matched right on the next press, so counting that would
   * empty the list before it was any use.
   */
  const [missedIds, setMissedIds] = useState<string[]>(
    () => getMatcherMissed(kind, direction, profile)
  );
  const [reviewing, setReviewing] = useState(false);
  const missedPairs = useMemo(
    () => matcherMissedPairs(queue, missedIds),
    [queue, missedIds]
  );

  const difficulty = useMemo(() => matcherDifficulty(knownStreak), [knownStreak]);
  // The missed round is a redo, not an escalation: normal board size, and it
  // deals from the missed pairs rather than from the course queue.
  const board = useMemo(
    () => (reviewing
      ? buildMatcherBoard(missedPairs, 0, MATCHER_BOARD_SIZE)
      : buildMatcherBoard(queue, from, difficulty.boardSize)),
    [reviewing, missedPairs, queue, from, difficulty.boardSize]
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

  // Say it once, on arrival: the list is not starting again.
  useEffect(() => {
    if (resumedAt <= 0) return;
    setNotice({ message: uiFmt("Picked up where you left off — {n} in.", { n: uiNumber(resumedAt) }) });
  }, [resumedAt]);

  /**
   * Remember the board, not just the number. Everything graded here leaves the
   * queue, so the position that meant "1,200 words in" is worth less every
   * visit; the ids of what is actually on screen survive that, and the number
   * is only the backstop for when the whole board has been graded away.
   */
  useEffect(() => {
    // Never while reviewing the missed ones: that board is a detour, and
    // writing it as the cursor would lose the place in the course queue.
    if (reviewing || board.pairs.length === 0 || queue.length === 0) return;
    const at = ((from % queue.length) + queue.length) % queue.length;
    setMatcherCursor(
      { ids: board.pairs.map((pair) => pair.id), approx: at },
      kind,
      direction,
      profile
    );
  }, [reviewing, board.pairs, from, queue.length, kind, direction, profile]);

  // The missed list outlives the sitting, same as the place does.
  const savedKind = useRef(kind);
  useEffect(() => {
    // Only write back to the list this state belongs to. On a kind switch the
    // state is replaced in the same pass, and writing first would copy one
    // list's misses over the other's.
    if (savedKind.current !== kind) return;
    setMatcherMissed(missedIds, kind, direction, profile);
  }, [missedIds, kind, direction, profile]);

  const dealNext = useCallback(() => {
    setSolved(new Set());
    arm(null);
    setMenuFor(null);
    if (reviewing) {
      // The missed round has no queue to advance through — clearing a board
      // shortens the list itself. When it runs out, say so and go back to the
      // course rather than sitting on an empty board.
      if (missedPairs.length === 0) {
        setReviewing(false);
        setNotice({ message: ui("That is the missed list cleared. Back to where you were.") });
      }
      return;
    }
    // The difficulty step pushes further down the queue: past the most useful
    // items and into the rarer ones, which is what harder means here.
    setFrom(board.nextFrom + difficulty.skipAhead);
  }, [arm, board.nextFrom, difficulty.skipAhead, missedPairs.length, reviewing]);

  const toggleReviewing = useCallback(() => {
    setSolved(new Set());
    setMenuFor(null);
    arm(null);
    setReviewing((current) => !current);
  }, [arm]);

  // A cleared board is the point of the mode, so the next one arrives on its
  // own. The pause is long enough to see the last pair land.
  useEffect(() => {
    if (board.pairs.length === 0 || solved.size < board.pairs.length) return undefined;
    const timer = window.setTimeout(dealNext, 520);
    return () => window.clearTimeout(timer);
  }, [solved, board.pairs.length, dealNext]);

  // Switching list swaps the queue; the effect above puts the new one back
  // where it was left rather than at its start.
  const chooseKind = useCallback((next: MatcherKind) => {
    setKind(next);
    setMatcherKind(next, direction, profile);
    setSolved(new Set());
    setMenuFor(null);
    arm(null);
  }, [arm, direction, profile]);

  /** Back to the head of the queue, for when the point is the easy words. */
  const startOver = useCallback(() => {
    setMatcherCursor({ ids: [], approx: 0 }, kind, direction, profile);
    setFrom(0);
    setSolved(new Set());
    setKnownStreak(0);
    setMenuFor(null);
    arm(null);
    setNotice({ message: ui("Back to the start of the list.") });
  }, [arm, direction, kind, profile]);

  const speak = useCallback((pair: MatcherPair, side: "de" | "en") => {
    // tts() is already the one door to the mixer: it checks the master and
    // per-language volumes itself and says so on screen when it is muted,
    // so this needs no mute logic of its own and cannot drift from the lesson.
    const text = side === "de" ? pair.de : pair.en;
    if (!text) return;
    void tts(text, side === "de" ? 0.88 : 0.95, side === "de" ? "de-DE" : englishLang);
  }, [englishLang]);

  /**
   * Warm the board's audio while the learner is still reading it.
   *
   * A clip that has never been spoken has to be synthesised upstream first,
   * which measured at 377-847 ms — long enough that tapping a card felt
   * broken. The whole board costs about as much as one clip, because each
   * synthesis opens its own connection and they overlap: six lines measured
   * 357 ms together against 716 ms for the slowest one alone.
   *
   * The cache this fills is the one playback reads, keyed on the same text,
   * rate and language, so a tap after this lands on a hit. Failures are
   * ignored on purpose — this is a head start, and a tap still works without
   * it exactly as it did before.
   */
  //
  // Re-warmed when the mixer changes, because the cache is keyed on the RATE
  // as well as the text: turning the speed up leaves every warmed clip under
  // a key nothing will read again, and the delay comes straight back.
  const [audioRevision, setAudioRevision] = useState(0);
  useEffect(() => {
    const onAudioChanged = () => setAudioRevision((revision) => revision + 1);
    window.addEventListener(AUDIO_SETTINGS_EVENT, onAudioChanged);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, onAudioChanged);
  }, []);

  useEffect(() => {
    if (!board.pairs.length) return;
    for (const pair of board.pairs) {
      if (pair.de) preloadTts(pair.de, 0.88, "de-DE");
      if (pair.en) preloadTts(pair.en, 0.95, englishLang);
    }
  }, [board.pairs, englishLang, audioRevision]);

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
      // Getting it right in the missed round is what clears it. Getting it
      // right in the ordinary round does not: after a miss the card stays put
      // and is almost always matched on the very next press, so counting that
      // would empty the list before it was any use.
      if (reviewing) setMissedIds((current) => current.filter((entry) => entry !== id));
      arm(null);
      return;
    }
    // A miss clears the selection rather than leaving it armed, so the next
    // press is a fresh guess instead of half of the wrong one. It also costs
    // more of the streak than a Know it earns — the step is meant to settle
    // where you stop breezing through, not to ratchet away from you.
    setMissed((count) => count + 1);
    setKnownStreak(matcherStreakAfterMiss);
    // Both halves of a wrong guess go on the list: the card you meant and the
    // card you hit. Either one is a pair you did not have.
    setMissedIds((current) => rememberMiss(rememberMiss(current, id), picked.id));
    setWrong(id);
    arm(null);
    window.setTimeout(() => setWrong((current) => (current === id ? null : current)), 420);
  }, [arm, board.pairs, reviewing, solved, speak]);

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

        {side === "de" && pair.tierNote ? (
          <span
            className="register-note matcher-tile-note"
            title={ui("Not everyday neutral German — use in the right company")}
          >
            {uiOr(pair.tierNote, "Besonderer Sprachgebrauch")}
          </span>
        ) : null}

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

        {/* German side only — the same as the buttons that open it. Without
            this the menu is keyed on the PAIR, so opening it drew one under
            the German tile and a second under the English tile for the same
            pair, wherever the shuffle had put it. */}
        {side === "de" && menuOpen && !done && (
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
  const position = queue.length === 0 ? 0 : ((from % queue.length) + queue.length) % queue.length;

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
            {([["words", "Words"], ["sentences", "Sentences"], ["both", "Both"]] as const).map(([value, label]) => (
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
            {/* Redo just the ones you got wrong. Disabled rather than hidden
                when there are none, so it does not appear and vanish. */}
            <button
              type="button"
              onClick={toggleReviewing}
              disabled={!reviewing && missedPairs.length === 0}
              aria-pressed={reviewing}
              data-testid="matcher-review-missed"
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-black transition-colors disabled:opacity-40",
                reviewing
                  ? "border-rose-500 bg-rose-500 text-white"
                  : "border-rose-500/35 bg-rose-500/10 text-rose-700 hover:bg-rose-500/18 dark:text-rose-300"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              {/* "Redo 4 missed" rather than "Missed 4": the counter beside it
                  is this sitting's, so a fresh visit would otherwise read
                  "0 missed · Missed 4" and look like a contradiction. */}
              {reviewing
                ? ui("Back to the list")
                : uiFmt("Redo {n} missed", { n: uiNumber(missedPairs.length) })}
            </button>
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
            {/* The lesson's own mixer, not a second set of controls: tapping a
                card here goes through the same tts() the lesson uses, so the
                volumes and speeds it reads are these. A separate one would be
                two places to set the same thing, and they would disagree. */}
            <MuteButton
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
              iconClassName="h-3.5 w-3.5"
              panelClassName="prototype-audio-mixer"
            />
          </div>
        </div>
        <p className="mt-3 text-xs font-bold text-[var(--text-3)]">
          {uiFmt("{matched} matched · {missed} missed", {
            matched: uiNumber(matched),
            missed: uiNumber(missed),
          })}
          {" · "}
          {reviewing ? (
            // The place in the course is not what you are looking at, so
            // showing it here would be a lie about where you are.
            <span className="font-black text-rose-600 dark:text-rose-400">
              {uiFmt("redoing {n} you missed", { n: uiNumber(missedPairs.length) })}
            </span>
          ) : (
            <>
              {/* Where you are, because "7,243 in the queue" alone reads like a
                  list you have never touched. */}
              {uiFmt("at {at} of {n}", {
                at: uiNumber(Math.min(position + 1, queue.length)),
                n: uiNumber(queue.length),
              })}
              {position > 0 && (
                <>
                  {" · "}
                  <button type="button" onClick={startOver} className="matcher-restart">
                    {ui("Start over")}
                  </button>
                </>
              )}
            </>
          )}
          {!reviewing && difficulty.step > 0 && (
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
          {ui("It remembers where you got to, so opening it again carries on rather than starting over — words and sentences each keep their own place, and the list comes back round for review when you reach the end. Tapping a card speaks it, at whatever volume you set for that language. Matching itself changes nothing — both answers are on screen, so it is recognition. Know it and the level menu do write, the same as anywhere else, and keep saying you know them deals bigger boards from further down the queue.")}
        </p>
      </section>
    </div>
  );
}
