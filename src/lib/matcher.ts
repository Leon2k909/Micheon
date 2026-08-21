import { buildListenQueue, type ListenItem } from "@/lib/listenMode";
import { takeMatchingSafe } from "@/lib/germanTextMatch";
import { loadGradeStore } from "@/lib/activity";
import {
  getAuthUser,
  loadScopedJson,
  saveScopedJson,
  type UserProfile,
} from "@/lib/profileStorage";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";

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

/* ── where you got to ───────────────────────────────────────────────────
 *
 * Leon: "this is supposed to be like continue learning where it remembers
 * what ive already done, the same stuff can come back for review but i dont
 * wanna start from the beginning every time".
 *
 * A position alone will not do it. The queue is rebuilt from the grade store
 * every visit, and everything graded here leaves it — so the index that meant
 * "1,200 words in" yesterday means something else today, and after a run of
 * Know its it means somewhere earlier than where you actually were.
 *
 * A single item id will not do it either, for the same reason: the most
 * likely id to be missing is the one you were last looking at, because you
 * probably pressed Know it on it.
 *
 * So the cursor is the whole board's ids plus the number as a backstop. Resume
 * lands on the first of those still in the queue; if every one of them has
 * been graded away, the number puts you back at roughly the same depth rather
 * than at the very beginning. Coming back round for review is what the wrap is
 * for, not what losing your place is for.
 */
const MATCHER_CURSOR_KEY = "gl-matcher-cursor-v1";

export type MatcherCursor = { ids: string[]; approx: number };

/** Words and sentences are different queues, and each course has its own. */
function cursorStorageKey(kind: MatcherKind, direction: LearningDirection): string {
  return `${MATCHER_CURSOR_KEY}:${direction}:${kind}`;
}

export function getMatcherCursor(
  kind: MatcherKind,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): MatcherCursor {
  const stored = loadScopedJson<unknown>(cursorStorageKey(kind, direction), null, profile);
  if (!stored || typeof stored !== "object") return { ids: [], approx: 0 };
  const raw = stored as Partial<MatcherCursor>;
  const ids = Array.isArray(raw.ids)
    ? raw.ids.filter((id): id is string => typeof id === "string" && Boolean(id)).slice(0, 16)
    : [];
  const approx = Number.isFinite(raw.approx) ? Math.max(0, Math.floor(Number(raw.approx))) : 0;
  return { ids, approx };
}

export function setMatcherCursor(
  cursor: MatcherCursor,
  kind: MatcherKind,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): MatcherCursor {
  const next: MatcherCursor = {
    ids: cursor.ids.filter(Boolean).slice(0, 16),
    approx: Math.max(0, Math.floor(cursor.approx) || 0),
  };
  saveScopedJson(cursorStorageKey(kind, direction), next, profile);
  return next;
}

/** Where in THIS queue the stored cursor lands. */
export function matcherResumeFrom(queue: MatcherPair[], cursor: MatcherCursor): number {
  if (queue.length === 0) return 0;
  const at = new Map<string, number>();
  queue.forEach((pair, index) => { if (!at.has(pair.id)) at.set(pair.id, index); });
  for (const id of cursor.ids) {
    const index = at.get(id);
    if (index !== undefined) return index;
  }
  // Everything from that board has been graded away — a good sign, not a
  // reason to start over. Land at the same depth in the queue that is left.
  return Math.min(Math.max(0, cursor.approx), Math.max(0, queue.length - 1));
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
