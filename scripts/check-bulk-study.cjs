#!/usr/bin/env node
/**
 * Studying several sets at once has to move those sets.
 *
 * A study mode takes one set and writes progress under that set's id, so the
 * obvious way to study three at once — glue the cards into a throwaway set —
 * writes the whole session under the throwaway. The learner works through
 * forty cards, all three sets stay exactly where they were, and a stray
 * progress blob is left behind for every combination anybody tried. Nothing
 * about that failure is visible on screen: the session looks right the whole
 * way through and the counters move.
 *
 * So this runs the real functions and asserts where the progress LANDED.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: { contents: 'export * from "./src/lib/studySets.ts";', resolveDir: root, sourcefile: "bulk-entry.ts" },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
global.window = undefined;
const compiled = new Module("bulk-study", module);
compiled.filename = path.join(root, ".bulk-study.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

const card = (id, term) => ({ id, term, definition: term + " (en)", source: "manual" });
const set = (id, cards, over = {}) => ({
  id, title: id, description: "", cards, createdAt: "", updatedAt: "",
  promptSide: "term", speak: true, stages: ["flashcard", "choice", "typed"],
  masteryTarget: 2, roundSize: 10, demoteOnWrong: true, ...over,
});

const verbs = set("verbs", [card("c1", "gehen"), card("c2", "haben")]);
const food = set("food", [card("c1", "Brot")], { masteryTarget: 4, stages: ["flashcard"] });
const empty = set("empty", []);

// ── the combined session ────────────────────────────────────────────────────
const combined = M.combineStudySets([verbs, food, empty], 1700000000000);
assert.ok(combined, "three sets combined to nothing");
assert.strictEqual(combined.set.cards.length, 3,
  "an empty set contributed cards, or a real one lost some");
assert.ok(M.isCombinedSet(combined.set), "the throwaway is not recognisable as one");
assert.ok(!M.isCombinedSet(verbs), "a real set is being mistaken for a combined one");

// Both sets have a card called c1. Unprefixed they would be one card, and one
// card's progress would be written over the other's.
const ids = combined.set.cards.map((entry) => entry.id);
assert.strictEqual(new Set(ids).size, 3,
  `two cards share an id in the combined set (${ids.join(", ")}) — their progress would merge`);
assert.deepStrictEqual(M.splitCombinedCardId(ids[0]), { setId: "verbs", cardId: "c1" },
  "a combined card id cannot be traced back to its set");
assert.strictEqual(M.splitCombinedCardId("plain-id"), null,
  "an ordinary card id is being read as a combined one");

// The session takes its shape from the first set chosen, not from a merge.
assert.deepStrictEqual(combined.set.stages, verbs.stages,
  "the session's stages are not the first set's — a set that dropped a stage got it back");

// ── an answer lands on the set that owns the card ───────────────────────────
const store = { verbs: {}, food: {} };
const loadFor = (id) => store[id] ?? {};

const first = M.recordCombinedAnswer(combined, `verbs::c1`, true, loadFor);
assert.ok(first, "an answer on a combined card went nowhere");
assert.strictEqual(first.setId, "verbs",
  "the answer was filed under the wrong set, so the right one never moves");
assert.ok(first.progress.c1, "the answer was stored under the combined id rather than the card's own");
assert.ok(!first.progress["verbs::c1"], "the prefixed id leaked into the set's saved progress");
store.verbs = first.progress;

// The other set's identically-named card must be untouched by that.
assert.strictEqual(Object.keys(store.food).length, 0,
  "answering verbs::c1 also wrote to food, which has its own c1");

// ── a card is promoted on ITS set's ladder, not the session's ───────────────
// food asks four right answers over ONE stage; the session (from verbs) asks
// two over THREE. Both ladders leave a card unmastered after three answers, so
// three proves nothing — the two disagree at two answers and at four, and it
// is those the assertions sit on.
const answerFood = (times) => {
  let progress = {};
  for (let i = 0; i < times; i += 1) {
    const landed = M.recordCombinedAnswer(combined, `food::c1`, true, () => progress);
    assert.ok(landed, "the food card never recorded an answer");
    progress = landed.progress;
  }
  return progress.c1;
};

// Two answers is a promotion on the session's ladder and nothing at all on
// food's, so the stage says which one ran.
assert.strictEqual(answerFood(2).stage, 0,
  "a food card advanced a stage after two right answers — that is the session's target of two, "
  + "not food's four, so the card is climbing somebody else's ladder");

// Four is mastery on food's ladder and only stage two on the session's.
assert.strictEqual(answerFood(4).mastered, true,
  "a food card was not mastered after the four right answers its own set asks for");

// ── and the session shows what the sets already know ────────────────────────
const seen = M.combinedProgress(combined, (id) => (id === "verbs" ? { c1: { streak: 1, correct: 1, wrong: 0, stage: 0, mastered: false } } : {}));
assert.ok(seen["verbs::c1"], "a set's existing progress does not appear in the combined session");
assert.ok(!seen["food::c1"], "progress appeared for a card whose set has none");

// ── the view offers it ──────────────────────────────────────────────────────
const view = fs.readFileSync(path.join(root, "src/components/create/CreateView.tsx"), "utf8");
const study = fs.readFileSync(path.join(root, "src/components/create/SetStudy.tsx"), "utf8");
assert.ok(view.includes('name: "studyMany"'),
  "a selection still cannot be studied, only deleted");
assert.ok(view.includes("pickedStudiable"),
  "the selection does not distinguish sets with cards from empty ones");
assert.ok(study.includes("recordCombinedAnswer(combined"),
  "the study screen accepts a combined session and still writes to the throwaway");
assert.ok(study.includes("for (const id of Object.keys(combined.members)) resetStudyProgress(id)"),
  "resetting a combined session clears the throwaway and leaves the real progress");

console.log(
  "check-bulk-study: a selection studies as one session, every answer lands on the set that "
  + "owns the card, and a card is promoted on its own set's ladder"
);
process.exit(0);
