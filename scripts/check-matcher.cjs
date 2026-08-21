#!/usr/bin/env node
/**
 * Matcher: the tracker in pairs, endlessly.
 *
 * Leon: "add another button called Matcher where you just see the english and
 * german and you are just continuously doing either words or sentences from
 * our trackers, matching constantly/endlessly in progression like
 * guidedsession".
 *
 * Three things can quietly break it and none of them look broken:
 *
 *  - a board holding two tiles that read the same has no solution, and the
 *    learner concludes they are wrong rather than that the board is;
 *  - a board that does not advance serves the same six words for ever, which
 *    is the opposite of "in progression";
 *  - grading it would promote words on recognition with the answer already on
 *    screen, which is the line the app draws for Listen.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildMatcherQueue, buildMatcherBoard, dealColumns, MATCHER_BOARD_SIZE } from "./src/lib/matcher.ts";',
      'export { matchingVisibleKey } from "./src/lib/germanTextMatch.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "matcher-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

// The queue builder reads browser storage on the way past.
const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("matcher-check", module);
compiled.filename = path.join(root, ".matcher-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints, buildApiPartFromResolved,
  buildMatcherQueue, buildMatcherBoard, dealColumns, MATCHER_BOARD_SIZE,
  matchingVisibleKey,
} = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}

for (const kind of ["words", "sentences"]) {
  const queue = buildMatcherQueue(parts, kind, null);
  assert.ok(queue.length > 1000, `only ${queue.length} ${kind} to match`);
  assert.ok(queue.every((pair) => pair.de && pair.en), `a ${kind} pair is missing a side`);

  // Progression: the queue is the course's order, so the first board is the
  // material a learner meets first rather than a random handful.
  const first = buildMatcherBoard(queue, 0);
  assert.strictEqual(first.pairs.length, MATCHER_BOARD_SIZE, `the first ${kind} board is short`);
  assert.deepStrictEqual(
    first.pairs.map((pair) => pair.id),
    queue.slice(0, MATCHER_BOARD_SIZE).map((pair) => pair.id),
    `the first ${kind} board is not the head of the queue`
  );

  // Solvable: no two tiles in a column may read the same, or the board has no
  // one-to-one answer and the learner is marked wrong for being right.
  let from = 0;
  for (let round = 0; round < 40; round += 1) {
    const board = buildMatcherBoard(queue, from);
    assert.strictEqual(board.pairs.length, MATCHER_BOARD_SIZE,
      `${kind} board ${round} came up short at ${from}`);
    const german = board.pairs.map((pair) => matchingVisibleKey(pair.de, "de"));
    const english = board.pairs.map((pair) => matchingVisibleKey(pair.en, "en"));
    assert.strictEqual(new Set(german).size, german.length,
      `two ${kind} tiles read the same in German at ${from}: ${board.pairs.map((p) => p.de).join(" | ")}`);
    assert.strictEqual(new Set(english).size, english.length,
      `two ${kind} tiles read the same in English at ${from}: ${board.pairs.map((p) => p.en).join(" | ")}`);
    assert.notStrictEqual(board.nextFrom, from, `the ${kind} queue stopped advancing at ${from}`);
    from = board.nextFrom;
  }

  // Endless: running off the end comes back to the beginning rather than
  // emptying out.
  const wrapped = buildMatcherBoard(queue, queue.length - 2);
  assert.strictEqual(wrapped.pairs.length, MATCHER_BOARD_SIZE,
    `${kind} runs out at the end of the queue instead of wrapping`);
}

// The deal is stable for a given board: a re-render must not move the tiles
// under the cursor, and the two columns must not be in the same order or the
// answer is "the one opposite".
{
  const queue = buildMatcherQueue(parts, "words", null);
  const board = buildMatcherBoard(queue, 0);
  const once = dealColumns(board.pairs);
  const twice = dealColumns(board.pairs);
  assert.deepStrictEqual(once.german.map((p) => p.id), twice.german.map((p) => p.id),
    "the same board deals differently each render");
  assert.notDeepStrictEqual(once.german.map((p) => p.id), once.english.map((p) => p.id),
    "both columns are in the same order, so every answer is the tile opposite");
  assert.strictEqual(new Set(once.german.map((p) => p.id)).size, board.pairs.length,
    "the deal dropped or duplicated a pair");
}

// It practises, it does not grade. Recognition with the answer on screen must
// not promote anything, and the screen says so rather than leaving it implied.
{
  const view = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
  for (const writer of ["recordListenGrade", "saveGradeStore", "recordSuccess", "setListenReviewLevel"]) {
    assert.ok(!view.includes(writer), `the Matcher writes progress through ${writer}`);
  }
  assert.ok(/nothing here changes your progress/.test(view),
    "the Matcher does not tell the learner that it is practice only");
  // Two clicks inside one frame used to score a miss on a correct pair.
  assert.ok(view.includes("pickedRef.current"),
    "the Matcher reads its selection from render state, so fast clicking mis-scores");

  const cards = fs.readFileSync(path.join(root, "src/components/duo/DuoPathView.tsx"), "utf8");
  assert.ok(cards.includes('ui("Matcher")'), "the Matcher card is missing from the three ways in");
  assert.ok(cards.includes("sm:grid-cols-3"), "the card row still only fits two");
  assert.ok(cards.includes("<MatcherView"), "the Matcher card opens nothing");

  // German, because the app offers a German interface and this is new copy.
  const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
  for (const key of ["Matcher", "Match and keep going", "Nothing to match yet"]) {
    assert.ok(i18n.includes(`"${key}":`), `"${key}" has no German`);
  }
}

console.log(
  `check-matcher: both queues ordered like the course, 40 boards each solvable `
  + `and advancing, the deal stable, and nothing graded`
);
