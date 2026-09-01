import { buildListenQueue, type ListenItem } from "@/lib/listenMode";
import { matchingVisibleKeys, takeMatchingSafe } from "@/lib/germanTextMatch";
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
 * English on one side, German on the other, drawn from the same trackers the
 * course uses and walked in the same progression order. It does not end:
 * clear a board and the next one deals itself.
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
export type MatcherKind = "words" | "sentences" | "both";

export type MatcherPair = {
  id: string;
  de: string;
  en: string;
  /** Every key this item is stored under, so a grade lands on all of them. */
  aliases: string[];
  kind: "word" | "sentence";
  /** The pack's register warning, where it has one. Shown on the tile. */
  tierNote?: string;
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
    // "both" is Listen's mixed queue, not the two lists glued end to end.
    // That queue puts words and sentences on one comparable popularity scale
    // and interleaves them, so a board can hold "Wir haben das." beside haben
    // rather than working through every word before the first sentence.
    {
      contentSource: kind === "both" ? "mixed" : kind === "words" ? "words" : "sentences",
      order: "common",
    }
  );
  return queue
    .map((item: ListenItem) => ({
      id: item.id,
      de: String(item.de ?? "").trim(),
      en: String(item.en ?? "").trim(),
      tierNote: item.tierNote,
      aliases: [...(item.aliases ?? [])],
      kind: (item.kind === "word" ? "word" : "sentence") as MatcherPair["kind"],
    }))
    .filter((pair) => pair.de && pair.en);
}

/** How many pairs a board holds. Six fits a phone without scrolling. */
export const MATCHER_BOARD_SIZE = 6;
/** Ten is the most that still fits without the board becoming a scroll. */
export const MATCHER_MAX_BOARD_SIZE = 10;
type MatcherBothCounts = { words: number; sentences: number };
export const DEFAULT_MATCHER_BOTH_COUNTS: MatcherBothCounts = { words: 3, sentences: 3 };
const MATCHER_BOTH_COUNTS_KEY = "gl-matcher-both-counts-v1";
export function getMatcherBothCounts(direction: LearningDirection = getLearningDirection(), profile: UserProfile | null = getAuthUser()): MatcherBothCounts {
  return normalizeMatcherBothCounts(loadScopedJson<Partial<MatcherBothCounts> | null>(`${MATCHER_BOTH_COUNTS_KEY}:${direction}`, null, profile));
}
export function setMatcherBothCounts(counts: Partial<MatcherBothCounts>, direction: LearningDirection = getLearningDirection(), profile: UserProfile | null = getAuthUser()): MatcherBothCounts {
  const next = normalizeMatcherBothCounts(counts);
  saveScopedJson(`${MATCHER_BOTH_COUNTS_KEY}:${direction}`, next, profile);
  return next;
}

function normalizeMatcherBothCounts(value: Partial<MatcherBothCounts> | null | undefined): MatcherBothCounts {
  const words = Number.isFinite(value?.words) ? Math.max(1, Math.min(MATCHER_MAX_BOARD_SIZE - 1, Math.round(value?.words as number))) : DEFAULT_MATCHER_BOTH_COUNTS.words;
  const sentences = Number.isFinite(value?.sentences) ? Math.max(1, Math.min(MATCHER_MAX_BOARD_SIZE - words, Math.round(value?.sentences as number))) : DEFAULT_MATCHER_BOTH_COUNTS.sentences;
  return { words, sentences };
}

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
 * It works like Continue learning: it remembers what has already been done,
 * the same material can come back for review, and it never starts from the
 * beginning of the queue again.
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

/**
 * Which list was open, remembered like everything else here.
 *
 * Each list already kept its own place, its own misses and its own streak —
 * but not the fact that it was the one being used, so every visit opened on
 * Words and somebody working through the sentences had to say so again each
 * time. Stored per course, because which list you want is a fact about the
 * language you are learning rather than about the machine.
 */
const MATCHER_KIND_KEY = "gl-matcher-kind-v1";

export function getMatcherKind(
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): MatcherKind {
  const stored = loadScopedJson<unknown>(`${MATCHER_KIND_KEY}:${direction}`, null, profile);
  // Anything else — a missing value, a corrupted one, an older spelling — is
  // the default rather than an error, the same as every other preference here.
  return stored === "sentences" || stored === "words" || stored === "both" ? stored : "words";
}

export function setMatcherKind(
  kind: MatcherKind,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): MatcherKind {
  saveScopedJson(`${MATCHER_KIND_KEY}:${direction}`, kind, profile);
  return kind;
}

type MatcherCursor = { ids: string[]; approx: number };

/**
 * Each list is a different queue, and each course has its own.
 *
 * "both" is a third key rather than a view onto the other two, so its place,
 * its misses and its streak are its own. Sharing a cursor with Words would
 * mean clearing a mixed board moved you along the word list as well.
 */
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

/* ── the ones you got wrong ─────────────────────────────────────────────
 *
 * The missed pairs can be replayed on their own, on demand.
 *
 * Kept as ids rather than as pairs, and resolved against the live queue when
 * it is time to deal them. A pair frozen at the moment of the miss would keep
 * showing after the word had been graded away or its pack muted — the missed
 * list is a pointer at the course, not a copy of it.
 *
 * Newest first, so the cap drops the oldest misses rather than the freshest.
 */
const MATCHER_MISSED_KEY = "gl-matcher-missed-v1";
export const MATCHER_MISSED_LIMIT = 200;

function missedStorageKey(kind: MatcherKind, direction: LearningDirection): string {
  return `${MATCHER_MISSED_KEY}:${direction}:${kind}`;
}

export function getMatcherMissed(
  kind: MatcherKind,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): string[] {
  const stored = loadScopedJson<unknown>(missedStorageKey(kind, direction), null, profile);
  if (!Array.isArray(stored)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of stored) {
    if (typeof value !== "string" || !value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length >= MATCHER_MISSED_LIMIT) break;
  }
  return out;
}

export function setMatcherMissed(
  ids: string[],
  kind: MatcherKind,
  direction: LearningDirection = getLearningDirection(),
  profile: UserProfile | null = getAuthUser()
): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const id of ids) {
    if (typeof id !== "string" || !id || seen.has(id)) continue;
    seen.add(id);
    next.push(id);
    if (next.length >= MATCHER_MISSED_LIMIT) break;
  }
  saveScopedJson(missedStorageKey(kind, direction), next, profile);
  return next;
}

/** Add a miss to the front of the list, without letting it grow for ever. */
export function rememberMiss(ids: string[], id: string): string[] {
  if (!id) return ids;
  return [id, ...ids.filter((entry) => entry !== id)].slice(0, MATCHER_MISSED_LIMIT);
}

/**
 * The missed ids that are still real, as pairs, in the order they were missed.
 *
 * Anything the course has since dropped — graded to a level that is not due,
 * muted, retired — quietly falls out here rather than being dealt as a card
 * that no longer belongs to the queue it came from.
 */
export function matcherMissedPairs(queue: MatcherPair[], ids: string[]): MatcherPair[] {
  if (queue.length === 0 || ids.length === 0) return [];
  const byId = new Map(queue.map((pair) => [pair.id, pair]));
  const out: MatcherPair[] = [];
  for (const id of ids) {
    const pair = byId.get(id);
    if (pair) out.push(pair);
  }
  return out;
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

export function buildMatcherMixedBoard(
  queue: MatcherPair[],
  from: number,
  counts: MatcherBothCounts = DEFAULT_MATCHER_BOTH_COUNTS
): { pairs: MatcherPair[]; nextFrom: number } {
  if (!queue.length) return { pairs: [], nextFrom: 0 };
  const wanted = normalizeMatcherBothCounts(counts);
  const start = ((from % queue.length) + queue.length) % queue.length;
  const picked: MatcherPair[] = [];
  const usedIds = new Set<string>();
  const usedKeys = new Set<string>();
  let words = 0; let sentences = 0; let inspected = 0;
  while (inspected < queue.length && (words < wanted.words || sentences < wanted.sentences)) {
    const pair = queue[(start + inspected) % queue.length]; inspected += 1;
    if (pair.kind === "word" && words >= wanted.words) continue;
    if (pair.kind === "sentence" && sentences >= wanted.sentences) continue;
    const keys = matchingVisibleKeys(pair.de, pair.en);
    if (keys.length !== 2 || keys.some((key) => usedKeys.has(key)) || usedIds.has(pair.id)) continue;
    picked.push(pair);
    usedIds.add(pair.id);
    keys.forEach((key) => usedKeys.add(key));
    if (pair.kind === "word") words += 1; else sentences += 1;
  }
  const inspectedNext = (start + Math.max(1, inspected)) % queue.length;
  const nextFrom = inspectedNext === start && queue.length > 1
    ? (start + 1) % queue.length
    : inspectedNext;
  return { pairs: picked, nextFrom };
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
