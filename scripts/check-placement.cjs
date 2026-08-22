#!/usr/bin/env node
/**
 * Placement has to be able to place you high.
 *
 * The old test asked ten A1–B1 vocabulary words and mapped the score onto one
 * of five packs, the highest being B1. Somebody who answered every question
 * correctly and somebody who was comfortably B2 got the same answer, because
 * the ceiling belonged to the test rather than to the learner. That gap has
 * to close: doing really well in the test has to make Continue learning
 * harder.
 *
 * So what is checked here is the property that was missing — that a strong run
 * lands strictly higher than a weak one, and that the placement is written to
 * the key Continue learning already reads. Plus the shape of the question
 * bank, because a placement question with two right answers mismeasures
 * somebody in a way no error message will ever reveal.
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
      'export * from "./src/lib/placementTest.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "placement-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("placement", module);
compiled.filename = path.join(root, ".placement.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

// ── the question bank ───────────────────────────────────────────────────────
const LEVELS = M.PLACEMENT_LEVELS;
assert.deepStrictEqual(LEVELS, ["A1", "A2", "B1", "B2", "C1"], "the ladder should run A1 to C1");

for (const direction of ["learn-de", "learn-en"]) {
  const questions = M.placementQuestions(direction);
  const ids = new Set();
  for (const question of questions) {
    const where = `${direction}/${question.id}`;
    assert.ok(!ids.has(question.id), `${where}: duplicate id`);
    ids.add(question.id);
    assert.ok(LEVELS.includes(question.level), `${where}: unknown level ${question.level}`);
    assert.ok(question.prompt && question.instruction, `${where}: missing prompt or instruction`);
    assert.ok(question.options.length >= 3, `${where}: only ${question.options.length} options`);
    assert.ok(
      Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length,
      `${where}: answer index out of range`
    );
    assert.ok(question.explanation, `${where}: no explanation`);
    const seen = new Set();
    for (const option of question.options) {
      assert.ok(option && option.trim(), `${where}: empty option`);
      assert.ok(!seen.has(option), `${where}: duplicate option "${option}" — two identical options means two right answers`);
      seen.add(option);
    }
  }

  // Every level must be able to fill a full round, or the ladder stops early
  // and reports a ceiling that is the bank's rather than the learner's.
  for (const level of LEVELS) {
    const round = M.placementRound(direction, level, () => 0.5);
    assert.strictEqual(
      round.length,
      M.PLACEMENT_ROUND_SIZE,
      `${direction} ${level}: only ${round.length} questions, need ${M.PLACEMENT_ROUND_SIZE}`
    );
    assert.ok(round.every((entry) => entry.level === level), `${direction} ${level}: round mixed levels`);
  }
}

// The English bank must actually test English rather than being the German one
// read backwards — that was the old test's flaw and it asks a native English
// speaker nothing.
const en = M.placementQuestions("learn-en");
const de = M.placementQuestions("learn-de");
assert.ok(en.length >= 30 && de.length >= 30, "both banks need real depth");
const overlap = en.filter((entry) => de.some((other) => other.prompt === entry.prompt));
assert.strictEqual(overlap.length, 0, "the English and German banks should not share prompts");

// ── the ladder ──────────────────────────────────────────────────────────────
assert.strictEqual(M.assessPlacement([]), null, "clearing nothing places you at the beginning, not at A1");
assert.strictEqual(M.assessPlacement(["A1"]), "A1");
assert.strictEqual(M.assessPlacement(["A1", "A2", "B1"]), "B1");
assert.strictEqual(M.assessPlacement(["A1", "A2", "B1", "B2", "C1"]), "C1", "clearing everything must reach C1");
// Order in, highest out — not last-in.
assert.strictEqual(M.assessPlacement(["B2", "A1", "A2"]), "B2");

assert.strictEqual(M.nextPlacementLevel("A1"), "A2");
assert.strictEqual(M.nextPlacementLevel("B2"), "C1");
assert.strictEqual(M.nextPlacementLevel("C1"), null, "C1 is the top — the ladder must terminate");

// ── placement actually changes where you start ──────────────────────────────
const parts = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);

const bandStart = (key) => String(parts[key]?.level || "").split("-")[0];
const placed = {};
for (const level of LEVELS) {
  const key = M.placementPartFor(level, parts);
  assert.ok(key, `no pack found for ${level}`);
  placed[level] = key;
  assert.strictEqual(
    bandStart(key),
    level,
    `${level} placed into ${key}, whose band starts at ${bandStart(key)}`
  );
}

// The whole point: a strong result is a different, harder pack than a weak one.
assert.notStrictEqual(placed.A1, placed.C1, "A1 and C1 must not place at the same pack");
const distinct = new Set(Object.values(placed));
assert.strictEqual(distinct.size, LEVELS.length, "every level should place somewhere different");
assert.strictEqual(M.placementPartFor(null, parts), null, "no level means no placement override");

// ── the result reaches Continue learning ────────────────────────────────────
// The keys are what makes this work at all: the lesson pipeline could always
// start anywhere, it was only ever told to start low.
const ladder = fs.readFileSync(path.join(root, "src/components/tests/PlacementLadder.tsx"), "utf8");
assert.ok(
  ladder.includes('saveScopedJson("german-lab-placement-result", partKey, user)'),
  "the placement result must be written to the key Continue learning reads"
);
assert.ok(
  ladder.includes('saveScopedJson("german-lab-placement-done", true, user)'),
  "placement must be marked done, or the first-run gate reappears"
);
const testsView = fs.readFileSync(path.join(root, "src/components/tests/TestsView.tsx"), "utf8");
assert.ok(testsView.includes("<PlacementLadder"), "the placement test should be reachable from Tests");
assert.ok(
  testsView.includes("setPlacementOpen(true)"),
  "there should be a way to start it — it is retakeable on purpose"
);

console.log(
  `check-placement: ${de.length} German and ${en.length} English questions across ${LEVELS.length} levels; `
  + `A1 places at ${placed.A1} and C1 at ${placed.C1}`
);
