#!/usr/bin/env node
/**
 * The Listen test: does a score mean anything?
 *
 * Four ways it could be worthless, and none of them look broken on screen:
 *
 *   - a question whose options contain the right answer twice, which marks a
 *     correct choice wrong;
 *   - a question with no distractors, where there is nothing to get wrong;
 *   - options that re-deal between the press and the click, so the answer
 *     moves out from under the cursor;
 *   - testing the whole 23,000-item queue rather than what was actually
 *     played, which is a vocabulary exam wearing a listening test's clothes.
 *
 * And one that would be worse than worthless: grading. Choosing from four is
 * recognition, and the lessons ask the learner to produce the word. A score
 * here that promoted anything would undo the damping Listen exists for.
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
      'export { buildListenQueue } from "./src/lib/listenMode.ts";',
      'export { buildListenTest, listenTestScore, LISTEN_TEST_OPTIONS, LISTEN_TEST_MAX_QUESTIONS, LISTEN_TEST_MIN_HEARD } from "./src/lib/listenTest.ts";',
      'export { matchingVisibleKey } from "./src/lib/germanTextMatch.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "listen-test-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

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

const compiled = new Module("listen-test-check", module);
compiled.filename = path.join(root, ".listen-test-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints, buildApiPartFromResolved, buildListenQueue,
  buildListenTest, listenTestScore,
  LISTEN_TEST_OPTIONS, LISTEN_TEST_MAX_QUESTIONS, LISTEN_TEST_MIN_HEARD,
  matchingVisibleKey,
} = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}
const queue = buildListenQueue(parts, {}, {}, Date.now());
assert.ok(queue.length > 1000, `only ${queue.length} items in the Listen queue`);

// Walk the queue in chunks, as a sitting does, and test each chunk.
let papers = 0;
for (let from = 0; from + 30 < Math.min(queue.length, 3000); from += 137) {
  const heard = queue.slice(from, from + 18);
  const questions = buildListenTest(heard, queue);
  assert.ok(questions.length > 0, `no questions from 18 heard items at ${from}`);
  assert.ok(questions.length <= LISTEN_TEST_MAX_QUESTIONS,
    `${questions.length} questions is more than one sitting's worth`);

  for (const question of questions) {
    assert.ok(question.options.includes(question.answer),
      `"${question.prompt}" does not offer its own answer`);
    assert.ok(question.options.length >= 2,
      `"${question.prompt}" has nothing to choose between`);
    assert.ok(question.options.length <= LISTEN_TEST_OPTIONS,
      `"${question.prompt}" offers ${question.options.length} options`);

    // Two options reading the same is a question with two right answers.
    const seen = question.options.map((option) => matchingVisibleKey(option, "en"));
    assert.strictEqual(new Set(seen).size, seen.length,
      `two options read the same for "${question.prompt}": ${question.options.join(" | ")}`);

    // Only what was heard may be asked about.
    assert.ok(heard.some((item) => item.id === question.id),
      `"${question.prompt}" was never played, so the test is asking about the queue`);
  }

  // Same input, same paper — otherwise the options move under the cursor.
  const again = buildListenTest(heard, queue);
  assert.deepStrictEqual(again.map((q) => q.id + "|" + q.options.join(",")),
    questions.map((q) => q.id + "|" + q.options.join(",")),
    `the test re-deals itself between renders at ${from}`);
  papers += 1;
}
assert.ok(papers > 15, `only ${papers} papers checked`);

// Too little heard is no test at all, rather than a test of one thing.
assert.deepStrictEqual(buildListenTest([], queue), [], "an empty sitting produced questions");
assert.deepStrictEqual(buildListenTest(queue.slice(0, LISTEN_TEST_MIN_HEARD - 1), queue), [],
  "a sitting shorter than the minimum produced questions");

// The score is the count of right answers, not of questions.
const verdicts = [
  { id: "a", prompt: "x", answer: "one", chosen: "one" },
  { id: "b", prompt: "y", answer: "two", chosen: "three" },
];
assert.deepStrictEqual(listenTestScore(verdicts), { right: 1, total: 2 }, "the score does not count");

// ── it measures, it does not promote ────────────────────────────────────────
const view = fs.readFileSync(path.join(root, "src/components/listen/ListenTest.tsx"), "utf8");
for (const writer of ["recordListenGrade", "saveGradeStore", "recordSuccess", "setListenReviewLevel", "hideNavItem"]) {
  assert.ok(!view.includes(writer), `the Listen test writes progress through ${writer}`);
}
assert.ok(/changes nothing in your lessons/.test(view),
  "the test does not tell the learner that the score is not progress");

const logic = fs.readFileSync(path.join(root, "src/lib/listenTest.ts"), "utf8");
assert.ok(!/Math\.random/.test(logic),
  "the paper is randomised per render, so the options move between press and click");

// ── the way in ──────────────────────────────────────────────────────────────
const listen = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
assert.ok(/data-testid="listen-test-open"/.test(listen), "there is no Test button in Listen");
assert.ok(/onClick=\{\(\) => \{ pause\(\); setTesting\(true\); \}\}/.test(listen),
  "opening the test leaves the audio playing, which reads the answers out over it");
assert.ok(/<ListenTest /.test(listen), "the Test button opens nothing");
assert.ok(/setHeardIds/.test(listen),
  "nothing records what the sitting played, so the test cannot be about it");

for (const key of ["Test me", "Back to Listen", "The ones that got away"]) {
  assert.ok(fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8").includes(`"${key}":`),
    `"${key}" has no German`);
}

// ── the running score is laid out, not left to the text flow ────────────────
// It was a tick, a number, a cross and a number loose in a paragraph, which
// broke: the glyphs ended up down the left of the card with their numbers
// stranded in the middle. Two boxes, placed explicitly, cannot come apart
// that way.
{
  const view = fs.readFileSync(path.join(root, "src/components/listen/ListenTest.tsx"), "utf8");
  const styles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
  assert.ok(view.includes("data-testid=\"listen-test-score\""),
    "the running score has no element of its own, so nothing can position it");
  // Plain string matching rather than a regex: every needle here is dots and
  // braces, and an unescaped regex quietly matches almost anything.
  const scoreRule = styles.slice(styles.indexOf(".listen-test-score {"));
  assert.ok(styles.includes(".listen-test-score {")
    && scoreRule.slice(0, scoreRule.indexOf("}")).includes("display: flex"),
    "the score relies on inline text flow again, which is what put the ticks down the left");
  // A red nought for a clean run is a warning about nothing.
  assert.ok(view.includes("wrong > 0 && \"is-wrong\""),
    "the wrong tally is painted red even at zero");
  // Tokens, so a custom accent and dark mode both work.
  assert.ok(!/text-emerald-600/.test(view),
    "the score still paints a hardcoded green that no theme can reach");
}
console.log(
  `check-listen-test: ${papers} papers over the real queue — every question answerable, `
  + "only heard items asked, the deal stable, and nothing graded"
);
