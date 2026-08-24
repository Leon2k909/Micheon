#!/usr/bin/env node
/**
 * The Matcher's third list has to actually mix.
 *
 * Words and Sentences are separate queues, so the obvious way to add Both is
 * to hand back one after the other. That is not a mixed list — it is the word
 * list with the sentences parked 16,000 places behind it, and nobody would
 * reach them. The queue has to interleave, which means both kinds have to
 * appear inside the first board's worth of items.
 *
 * The board is dealt six at a time from the front, so the front is the only
 * part of the queue this can be checked at. Everything after it follows.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildMatcherQueue, buildMatcherBoard, buildMatcherMixedBoard, getMatcherBothCounts, setMatcherBothCounts, DEFAULT_MATCHER_BOTH_COUNTS, getMatcherKind, setMatcherKind,',
      '  getMatcherCursor, setMatcherCursor, matcherDifficulty, MATCHER_BOARD_SIZE, MATCHER_MAX_BOARD_SIZE } from "./src/lib/matcher.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "matcher-both-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("matcher-both-check", module);
compiled.filename = path.join(root, ".matcher-both-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints, buildApiPartFromResolved, buildMatcherQueue, buildMatcherBoard,
  buildMatcherMixedBoard, getMatcherBothCounts, setMatcherBothCounts, DEFAULT_MATCHER_BOTH_COUNTS,
  getMatcherKind, setMatcherKind, getMatcherCursor, setMatcherCursor, matcherDifficulty,
  MATCHER_BOARD_SIZE, MATCHER_MAX_BOARD_SIZE,
} = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}

const learner = { id: "one", email: "one@example.com" };
const words = buildMatcherQueue(parts, "words", learner);
const sentences = buildMatcherQueue(parts, "sentences", learner);
const both = buildMatcherQueue(parts, "both", learner);

assert.ok(words.length > 1000 && sentences.length > 1000,
  `the two lists did not build: ${words.length} words, ${sentences.length} sentences`);

// ── it is both lists, not one of them ───────────────────────────────────────
const wordIds = new Set(words.map((pair) => pair.id));
const sentenceIds = new Set(sentences.map((pair) => pair.id));
const fromWords = both.filter((pair) => wordIds.has(pair.id)).length;
const fromSentences = both.filter((pair) => sentenceIds.has(pair.id)).length;
assert.ok(fromWords > 1000 && fromSentences > 1000,
  `Both is not both: ${fromWords} of its items are words and ${fromSentences} are sentences`);

// ── and it interleaves rather than concatenating ────────────────────────────
// One board's worth. Appending the sentences behind the words would put zero
// of them here, which is the failure this exists for.
const front = both.slice(0, MATCHER_BOARD_SIZE);
const frontWords = front.filter((pair) => wordIds.has(pair.id)).length;
const frontSentences = front.filter((pair) => sentenceIds.has(pair.id)).length;
assert.ok(frontWords > 0 && frontSentences > 0,
  "the first board of Both holds only one kind, so the list is glued end to end rather than mixed:\n"
  + front.map((pair) => `  ${wordIds.has(pair.id) ? "word    " : "sentence"}  ${pair.de}`).join("\n"));

// The first hundred should not be lopsided either — a single sentence at
// position 4 would satisfy the line above while the list stayed a word list.
const hundred = both.slice(0, 100);
const hundredSentences = hundred.filter((pair) => sentenceIds.has(pair.id)).length;
assert.ok(hundredSentences >= 20 && hundredSentences <= 80,
  `the first 100 of Both are ${hundredSentences}% sentences, which is one list wearing the other's name`);

// ── a board deals from it ───────────────────────────────────────────────────
// takeMatchingSafe drops anything ambiguous against what it has already
// taken, and a mixed list gives it more to compare; a board that comes back
// short would be dealt short on screen.
const board = buildMatcherBoard(both, 0, MATCHER_BOARD_SIZE);
assert.strictEqual(board.pairs.length, MATCHER_BOARD_SIZE,
  `a mixed board dealt ${board.pairs.length} of ${MATCHER_BOARD_SIZE} pairs`);
assert.ok(board.pairs.every((pair) => pair.de && pair.en), "a mixed board dealt a blank side");

for (const counts of [{ words: 3, sentences: 3 }, { words: 2, sentences: 4 }, { words: 4, sentences: 2 }]) {
  for (const from of [0, 1, 17, 143, both.length - 3]) {
    const mixedBoard = buildMatcherMixedBoard(both, from, counts);
    assert.strictEqual(mixedBoard.pairs.filter((pair) => pair.kind === "word").length, counts.words,
      `Both did not deal ${counts.words} words from ${from}`);
    assert.strictEqual(mixedBoard.pairs.filter((pair) => pair.kind === "sentence").length, counts.sentences,
      `Both did not deal ${counts.sentences} sentences from ${from}`);
    assert.notStrictEqual(mixedBoard.nextFrom, ((from % both.length) + both.length) % both.length,
      `Both did not advance from ${from}`);
  }
}
const collisionFixture = [
  { id: "w1", de: "Bank", en: "bank", aliases: [], kind: "word" },
  { id: "s1", de: "Bank", en: "bench", aliases: [], kind: "sentence" },
  { id: "w2", de: "Haus", en: "house", aliases: [], kind: "word" },
  { id: "s2", de: "Guten Tag", en: "hello", aliases: [], kind: "sentence" },
  { id: "s3", de: "Bis bald", en: "see you", aliases: [], kind: "sentence" },
];
const collisionBoard = buildMatcherMixedBoard(collisionFixture, 0, { words: 2, sentences: 2 });
assert.ok(!(collisionBoard.pairs.some((pair) => pair.id === "w1") && collisionBoard.pairs.some((pair) => pair.id === "s1")),
  "Both exposed two cards with the same visible German key");
const punctuationCollision = buildMatcherMixedBoard([
  { id: "pw1", de: "Hallo.", en: "hello", aliases: [], kind: "word" },
  { id: "ps1", de: "Hallo!", en: "hi there", aliases: [], kind: "sentence" },
  { id: "pw2", de: "Haus", en: "house", aliases: [], kind: "word" },
  { id: "ps2", de: "Bis bald", en: "see you", aliases: [], kind: "sentence" },
  { id: "ps3", de: "Guten Tag", en: "good day", aliases: [], kind: "sentence" },
], 0, { words: 2, sentences: 2 });
assert.ok(!(punctuationCollision.pairs.some((pair) => pair.id === "pw1")
  && punctuationCollision.pairs.some((pair) => pair.id === "ps1")),
  "Both ignored the Matcher's punctuation-normalised visible-key collision rules");
const shortLaneBoard = buildMatcherMixedBoard([
  { id: "only-word", de: "Haus", en: "house", aliases: [], kind: "word" },
  { id: "sentence-a", de: "Guten Tag", en: "hello", aliases: [], kind: "sentence" },
  { id: "sentence-b", de: "Bis bald", en: "see you", aliases: [], kind: "sentence" },
], 0, { words: 3, sentences: 2 });
assert.strictEqual(shortLaneBoard.pairs.length, 3,
  "Both exceeded a scarce lane's available safe items instead of showing fewer");
assert.notStrictEqual(shortLaneBoard.nextFrom, 0,
  "Both stalled when one lane could not fill its configured quota");

// ── it is remembered, and it keeps its own place ────────────────────────────
stored.clear();
assert.deepStrictEqual(getMatcherBothCounts("learn-de", learner), DEFAULT_MATCHER_BOTH_COUNTS,
  "Both count defaults changed unexpectedly");
setMatcherBothCounts({ words: 2, sentences: 4 }, "learn-de", learner);
setMatcherBothCounts({ words: 4, sentences: 2 }, "learn-en", learner);
const otherLearner = { id: "two", email: "two@example.com" };
assert.deepStrictEqual(getMatcherBothCounts("learn-de", learner), { words: 2, sentences: 4 },
  "Both counts did not persist for the course/profile");
assert.deepStrictEqual(getMatcherBothCounts("learn-en", learner), { words: 4, sentences: 2 },
  "Both counts leaked between courses");
assert.deepStrictEqual(getMatcherBothCounts("learn-de", otherLearner), DEFAULT_MATCHER_BOTH_COUNTS,
  "Both counts leaked between profiles");
setMatcherBothCounts({ words: 50, sentences: 50 }, "learn-de", otherLearner);
assert.deepStrictEqual(getMatcherBothCounts("learn-de", otherLearner), { words: MATCHER_MAX_BOARD_SIZE - 1, sentences: 1 },
  "Both counts did not clamp to the maximum board size");
const otherCountsKey = [...stored.keys()].find((key) => key.includes("gl-matcher-both-counts-v1:learn-de") && key.includes("two"));
stored.set(otherCountsKey, "not-json");
assert.deepStrictEqual(getMatcherBothCounts("learn-de", otherLearner), DEFAULT_MATCHER_BOTH_COUNTS,
  "corrupt Both counts did not fall back to defaults");
setMatcherKind("both", "learn-de", learner);
assert.strictEqual(getMatcherKind("learn-de", learner), "both",
  "choosing Both does not survive, so every visit reopens on Words");

setMatcherCursor({ ids: ["a"], approx: 700 }, "both", "learn-de", learner);
assert.strictEqual(getMatcherCursor("words", "learn-de", learner).approx, 0,
  "Both shares a cursor with Words, so clearing a mixed board moves the word list along too");
assert.strictEqual(getMatcherCursor("both", "learn-de", learner).approx, 700,
  "Both does not keep its own place");

// ── and the button exists ───────────────────────────────────────────────────
const fs = require("fs");
const view = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
assert.ok(/\["both",\s*"Both"\]/.test(view),
  "the list is buildable but there is no button to choose it");
assert.ok(view.includes('data-testid="matcher-both-words"')
  && view.includes('data-testid="matcher-both-sentences"'),
  "Both does not expose separate word and sentence count controls");
assert.ok(view.includes('if (kind === "both") return reviewing')
  && view.includes("buildMatcherMixedBoard(queue, from, bothCounts)"),
  "Both still uses adaptive board growth instead of the configured exact split");
assert.ok(matcherDifficulty(10_000).boardSize === MATCHER_MAX_BOARD_SIZE,
  "the high-streak test is not exercising adaptive growth");

// ── and there is a way through it other than starting again ─────────────────
// Start over was the only exit from a place you did not want to be, which at
// 660 of 16,324 means replaying everything already cleared to reach the rest.
const styles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
assert.ok(view.includes("data-testid=\"matcher-nav\"") && view.includes("matcher-nav__page"),
  "the Matcher can only be restarted, not moved through");
// Plain string matching rather than regexes: every one of these needles is
// full of brackets and dots, and an unescaped regex quietly matches anything.
assert.ok(view.includes("goToPosition(position - pageSize)")
  && view.includes("goToPosition(position + pageSize)"),
  "the page arrows do not move by a page");
// A page has to be the board on screen. A fixed six would overlap itself or
// skip pairs the moment the difficulty step deals a bigger board.
assert.ok(view.includes("const pageSize = Math.max(1, board.pairs.length || difficulty.boardSize)"),
  "a page is not the board actually being dealt, so paging will overlap or skip");
assert.ok(view.includes("Math.min(Math.max(1, Math.round(wanted)), queue.length) - 1"),
  "the jump box does not clamp, so a number past the end goes nowhere useful");
assert.ok(styles.includes(".matcher-nav__page {") && styles.includes(".matcher-nav__input"),
  "the page controls have no styling of their own");
assert.ok(view.includes("ui(\"Start over\")"),
  "paging replaced Start over rather than joining it");
console.log(
  `check-matcher-both: Both interleaves ${fromWords} words with ${fromSentences} sentences, `
  + `its first 100 are ${hundredSentences}% sentences, and it keeps its own place`
);
// esbuild's service keeps two sockets open after buildSync returns, so the
// event loop never empties and the build would wait for ever on a check that
// finished in a second. Say so rather than letting the loop decide —
// check-matcher-preference and check-matcher end the same way.
process.exit(0);
