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
      'export { buildMatcherQueue, buildMatcherBoard, getMatcherKind, setMatcherKind,',
      '  getMatcherCursor, setMatcherCursor, MATCHER_BOARD_SIZE } from "./src/lib/matcher.ts";',
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
  getMatcherKind, setMatcherKind, getMatcherCursor, setMatcherCursor, MATCHER_BOARD_SIZE,
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

// ── it is remembered, and it keeps its own place ────────────────────────────
stored.clear();
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

console.log(
  `check-matcher-both: Both interleaves ${fromWords} words with ${fromSentences} sentences, `
  + `its first 100 are ${hundredSentences}% sentences, and it keeps its own place`
);
// esbuild's service keeps two sockets open after buildSync returns, so the
// event loop never empties and the build would wait for ever on a check that
// finished in a second. Say so rather than letting the loop decide —
// check-matcher-preference and check-matcher end the same way.
process.exit(0);
