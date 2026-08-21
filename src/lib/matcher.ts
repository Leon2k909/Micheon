import { buildListenQueue, type ListenItem } from "@/lib/listenMode";
import { takeMatchingSafe } from "@/lib/germanTextMatch";
import { loadGradeStore } from "@/lib/activity";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * Matcher: the whole course, in pairs, forever.
 *
 * Leon: "add another button called Matcher where you just see the english and
 * german and you are just continuously doing either words or sentences from
 * our trackers, matching constantly/endlessly in progression like
 * guidedsession".
 *
 * So it is not a game with a score and an end — it is the tracker queue, six
 * pairs at a time, refilling the moment a board is cleared.
 *
 * The queue is buildListenQueue's rather than a new one. That function already
 * knows the order the rest of the app agrees on (most useful first, by the
 * frequency bank and then the pack's CEFR level), already drops muted packs
 * and snoozed items, and already splits words from sentences. A second
 * ordering written here would drift from it within a week.
 */
export type MatcherKind = "words" | "sentences";

export type MatcherPair = {
  id: string;
  de: string;
  en: string;
  /** Every key this item is stored under, so a grade lands on all of them. */
  aliases: string[];
};

/** Every item the Matcher can serve, in the order the course would serve it. */
export function buildMatcherQueue(
  apiParts: Record<string, unknown>,
  kind: MatcherKind,
  profile: UserProfile | null = null
): MatcherPair[] {
  const queue = buildListenQueue(
    apiParts as Record<string, never>,
    loadGradeStore(profile),
    { contentSource: kind === "words" ? "words" : "sentences", order: "common" }
  );
  return queue
    .map((item: ListenItem) => ({
      id: item.id,
      de: String(item.de ?? "").trim(),
      en: String(item.en ?? "").trim(),
      aliases: [...(item.aliases ?? [])],
    }))
    .filter((pair) => pair.de && pair.en);
}

/** How many pairs a board holds. Six fits a phone without scrolling. */
export const MATCHER_BOARD_SIZE = 6;
/** Ten is the most that still fits without the board becoming a scroll. */
export const MATCHER_MAX_BOARD_SIZE = 10;

/**
 * Pressing Know it over and over is a complaint: this is too easy.
 *
 * So the mode answers it. A run of Know its raises a step, and each step does
 * two things — puts more pairs on the board, and pushes further down the
 * queue. The second is the one that actually matters: the queue is ordered
 * most-useful-first, so moving down it is moving into rarer words, which is
 * what "harder" means for vocabulary. A bigger board alone would only be more
 * of the same words.
 *
 * A miss costs more than a Know it earns, because the point is to find the
 * level where you stop breezing through, not to ratchet upward and strand
 * someone in material they cannot do. The step falls back on its own.
 */
export const MATCHER_MAX_STEP = 4;

export function matcherDifficulty(knownStreak: number): {
  step: number;
  boardSize: number;
  skipAhead: number;
} {
  const streak = Math.max(0, Math.floor(knownStreak));
  // One step per board's worth of Know its — a whole board cleared by
  // declaration rather than a couple of easy words.
  const step = Math.min(MATCHER_MAX_STEP, Math.floor(streak / MATCHER_BOARD_SIZE));
  return {
    step,
    boardSize: Math.min(MATCHER_MAX_BOARD_SIZE, MATCHER_BOARD_SIZE + step),
    // Two extra boards' worth of queue per step. At the top step that is 48
    // items skipped every deal, which walks into rarer material quickly
    // without ever jumping somewhere unrelated.
    skipAhead: step * MATCHER_BOARD_SIZE * 2,
  };
}

/** What a miss does to the run. Steeper than the climb, deliberately. */
export function matcherStreakAfterMiss(knownStreak: number): number {
  return Math.max(0, Math.floor(knownStreak) - MATCHER_BOARD_SIZE);
}

/**
 * The next board, starting at `from`.
 *
 * Ambiguity is the thing that breaks a matching board: two cards whose German
 * looks identical, or whose English does, leave a round with no solution and
 * the learner convinced they are wrong. takeMatchingSafe already solves that
 * for the lesson's matching stage, so it solves it here.
 *
 * It scans forward past anything it has to skip, so a board is always full
 * while there is anything left to fill it with — and `nextFrom` reports where
 * the queue actually got to, not where it would have got to if nothing had
 * been skipped.
 */
export function buildMatcherBoard(
  queue: MatcherPair[],
  from: number,
  size = MATCHER_BOARD_SIZE
): { pairs: MatcherPair[]; nextFrom: number } {
  if (queue.length === 0) return { pairs: [], nextFrom: 0 };
  // Wrapping keeps it endless: reaching the end of the queue starts again at
  // the most useful items rather than stopping.
  const start = ((from % queue.length) + queue.length) % queue.length;
  const ordered = [...queue.slice(start), ...queue.slice(0, start)];
  const pairs = takeMatchingSafe(
    ordered,
    Math.min(size, queue.length),
    (pair: MatcherPair) => ({ german: pair.de, english: pair.en })
  );
  if (pairs.length === 0) return { pairs: [], nextFrom: start };
  // Where the queue reached: one past the last item this board actually took.
  const lastTaken = pairs[pairs.length - 1];
  const offset = ordered.indexOf(lastTaken);
  return { pairs, nextFrom: (start + offset + 1) % queue.length };
}

/**
 * The two columns, shuffled independently.
 *
 * Shuffled per board rather than per render, or React would deal a new layout
 * under the cursor on every state change. Seeded from the board itself so the
 * same board always lays out the same way — a re-render is not a new deal.
 */
export function dealColumns(pairs: MatcherPair[]): { german: MatcherPair[]; english: MatcherPair[] } {
  const seed = pairs.reduce((total, pair, index) => total + pair.id.length * (index + 7), 13);
  const shuffled = (list: MatcherPair[], salt: number) => {
    const out = [...list];
    let state = seed + salt;
    for (let i = out.length - 1; i > 0; i -= 1) {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      const j = state % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return { german: shuffled(pairs, 1), english: shuffled(pairs, 2) };
}
