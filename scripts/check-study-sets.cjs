#!/usr/bin/env node
/**
 * Create — your own study sets.
 *
 * Everything here fails silently if it fails at all, which is why it is
 * checked rather than eyeballed:
 *
 *  - a typed answer marked wrong when it was right teaches you to distrust
 *    your own memory, which is the exact opposite of the point;
 *  - a mastery ladder that promotes too early quietly retires cards you
 *    cannot actually produce, and the set reports 100% while you fail;
 *  - a paste parser that drops a line loses work the user typed by hand and
 *    never tells them;
 *  - a Learn round built from mastered cards wastes the session on things
 *    already known.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: { contents: 'export * from "./src/lib/studySets.ts";', resolveDir: root, sourcefile: "study-entry.ts" },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("study-sets", module);
compiled.filename = path.join(root, ".study-sets.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

// ── typed answers ───────────────────────────────────────────────────────────
// Forgiving about what is not being tested, strict about what is.
for (const [expected, given, why] of [
  ["apple", "apple", "exact"],
  ["apple", "  Apple  ", "case and surrounding space"],
  ["apple", "apple.", "a trailing full stop"],
  ["der Apfel", "Apfel", "the article, when the noun is right"],
  ["Apfel", "der Apfel", "an article the learner added"],
  ["to go / to walk", "to walk", "any of several accepted answers"],
  ["to go / to walk", "to go", "the first accepted answer"],
  ["die Straße", "die Straße", "eszett kept intact"],
]) {
  assert.ok(M.checkTypedAnswer(expected, given), `"${given}" should be accepted for "${expected}" — ${why}`);
}
for (const [expected, given, why] of [
  ["apple", "apples", "a plural is a different word"],
  ["apple", "aple", "a misspelling is the thing being tested"],
  ["apple", "", "an empty answer is not a right answer"],
  ["apple", "   ", "nor is whitespace"],
  ["die Straße", "die Strasse", "ss for ß is a spelling choice the course teaches against"],
  ["der Apfel", "die Apfel", "wrong article with no noun to fall back on is still wrong"],
]) {
  assert.ok(!M.checkTypedAnswer(expected, given), `"${given}" should NOT be accepted for "${expected}" — ${why}`);
}

// ── the mastery ladder ──────────────────────────────────────────────────────
const stages = 3;
let entry = M.emptyProgress();
assert.strictEqual(entry.stage, 0);
assert.strictEqual(entry.mastered, false);

// One right answer is not mastery.
entry = M.applyAnswer(entry, true, stages);
assert.strictEqual(entry.streak, 1, "one right answer should build a streak, not promote");
assert.strictEqual(entry.stage, 0);
assert.strictEqual(entry.mastered, false);

// Two in a row promotes to the next stage and resets the streak.
entry = M.applyAnswer(entry, true, stages);
assert.strictEqual(entry.stage, 1, `two right in a row should promote — got stage ${entry.stage}`);
assert.strictEqual(entry.streak, 0, "the streak restarts at the new stage");
assert.strictEqual(entry.mastered, false, "promoting is not mastering");

// Getting it wrong drops a stage, because recall was weaker than it looked.
entry = M.applyAnswer(entry, false, stages);
assert.strictEqual(entry.stage, 0, "a wrong answer should drop the card back a stage");
assert.strictEqual(entry.streak, 0);
assert.strictEqual(entry.wrong, 1);

// The full climb: only the last stage retires the card.
let climb = M.emptyProgress();
for (let step = 0; step < (stages - 1) * M.MASTERY_TARGET; step += 1) {
  climb = M.applyAnswer(climb, true, stages);
  assert.strictEqual(climb.mastered, false, `mastered too early, after ${step + 1} right answers`);
}
climb = M.applyAnswer(climb, true, stages);
assert.strictEqual(climb.mastered, false, "still one short of the top");
climb = M.applyAnswer(climb, true, stages);
assert.strictEqual(climb.mastered, true, "clearing the last stage should master the card");

// A single-stage set is legal and must still be masterable.
let single = M.emptyProgress();
single = M.applyAnswer(single, true, 1);
single = M.applyAnswer(single, true, 1);
assert.strictEqual(single.mastered, true, "a one-stage set must be completable");

// Mastery is not permanent — get it wrong and it comes back.
const unlearned = M.applyAnswer({ ...climb }, false, stages);
assert.strictEqual(unlearned.mastered, false, "a wrong answer must un-master a card");

// ── pasting ─────────────────────────────────────────────────────────────────
const pasted = M.parsePastedCards([
  "der Apfel - apple",
  "die Stadt – city",
  "das Haus — house",
  "gehen = to go",
  "sprechen : to speak",
  "der Lkw\tlorry",
  "",
  "   ",
  "einsam",
].join("\n"));
assert.strictEqual(pasted.length, 7, `expected 7 cards from that paste, got ${pasted.length}`);
assert.strictEqual(pasted[0].term, "der Apfel");
assert.strictEqual(pasted[0].definition, "apple");
assert.strictEqual(pasted[1].definition, "city", "an en dash is a separator too");
assert.strictEqual(pasted[2].definition, "house", "so is an em dash");
assert.strictEqual(pasted[3].definition, "to go");
assert.strictEqual(pasted[4].definition, "to speak");
assert.strictEqual(pasted[5].term, "der Lkw", "a tab is what a spreadsheet paste gives you");
assert.strictEqual(pasted[5].definition, "lorry");
// A line with no separator is kept with an empty back rather than dropped —
// losing it silently would lose work the user typed.
assert.strictEqual(pasted[6].term, "einsam");
assert.strictEqual(pasted[6].definition, "");
assert.ok(pasted.every((card) => card.source === "paste"));
assert.strictEqual(new Set(pasted.map((card) => card.id)).size, pasted.length, "pasted cards need distinct ids");

// A dash inside the German must not split the card at the wrong place.
const compound = M.parsePastedCards("der Lkw - Lastkraftwagen - lorry");
assert.strictEqual(compound.length, 1);
assert.strictEqual(compound[0].term, "der Lkw", "only the FIRST separator splits the line");
assert.strictEqual(compound[0].definition, "Lastkraftwagen - lorry");

// ── sets and rounds ─────────────────────────────────────────────────────────
const set = M.makeSet("Test set", 1000);
assert.ok(set.id && set.title === "Test set");
assert.deepStrictEqual(set.stages, M.DEFAULT_STAGES, "a new set gets the default ladder");
assert.strictEqual(M.setIsStudiable(set), false, "an empty set is not studiable");

set.cards = [
  M.makeCard("der Apfel", "apple", { now: 1 }),
  M.makeCard("die Stadt", "city", { now: 2 }),
  M.makeCard("das Haus", "house", { now: 3 }),
  M.makeCard("half a card", "", { now: 4 }),
];
assert.strictEqual(M.studiableCards(set).length, 3, "a card missing a side is not studiable");
assert.strictEqual(M.incompleteCards(set).length, 1, "the editor has to be able to flag it");
assert.ok(M.setIsStudiable(set));

// Duplicates are surfaced, not silently merged — the user may have meant it.
const dupes = { ...set, cards: [...set.cards, M.makeCard("der Apfel", "apple again", { now: 5 })] };
assert.deepStrictEqual(M.duplicateTerms(dupes), ["der apfel"]);

// A round never opens with a card already mastered.
const progress = {
  [set.cards[0].id]: { streak: 0, correct: 6, wrong: 0, stage: 2, mastered: true },
  [set.cards[1].id]: { streak: 1, correct: 1, wrong: 2, stage: 0, mastered: false },
};
const round = M.buildLearnRound(set, progress, 10);
const ids = round.map((item) => item.card.id);
assert.ok(!ids.includes(set.cards[0].id), "a mastered card must not be asked again in a round");
assert.ok(ids.includes(set.cards[1].id), "an unmastered card must be asked");
assert.ok(!ids.includes(set.cards[3].id), "an incomplete card must never reach a round");
// Least-practised first, so a round does not open with the card you know best.
assert.strictEqual(ids[0], set.cards[2].id, "the never-seen card should come first");

// The stage each card is asked at comes from its own progress.
const stagedRound = M.buildLearnRound(
  { ...set, stages: ["flashcard", "choice", "typed"] },
  { [set.cards[1].id]: { streak: 0, correct: 2, wrong: 0, stage: 1, mastered: false } },
  10
);
const staged = stagedRound.find((item) => item.card.id === set.cards[1].id);
assert.strictEqual(staged.stage, "choice", "a card at stage 1 should be asked with multiple choice");

// A round is capped, so a huge set still gives a session you can finish.
const big = { ...set, cards: Array.from({ length: 200 }, (_, i) => M.makeCard(`w${i}`, `d${i}`, { now: i })) };
assert.strictEqual(M.buildLearnRound(big, {}, 10).length, 10, "the round size must be respected");

// ── summary ─────────────────────────────────────────────────────────────────
const summary = M.summariseProgress(set, progress);
assert.strictEqual(summary.total, 3, "the summary counts studiable cards only");
assert.strictEqual(summary.mastered, 1);
assert.strictEqual(summary.learning, 1);
assert.strictEqual(summary.untouched, 1);
assert.strictEqual(summary.percent, 33);
const empty = M.summariseProgress({ ...set, cards: [] }, {});
assert.strictEqual(empty.percent, 0, "an empty set must not divide by zero");

// ── stage config ────────────────────────────────────────────────────────────
assert.ok(M.ALL_STAGES.length >= 4, "there should be a real choice of stages");
for (const stage of M.ALL_STAGES) {
  assert.ok(M.STUDY_STAGE_LABELS[stage], `stage "${stage}" has no label`);
  assert.ok(M.STUDY_STAGE_BLURBS[stage], `stage "${stage}" has no explanation`);
}
assert.ok(M.DEFAULT_STAGES.every((stage) => M.ALL_STAGES.includes(stage)));

// ── it is actually reachable ────────────────────────────────────────────────
const prototype = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
assert.ok(
  prototype.includes('const CREATE_NAVIGATION_ITEM: NavigationItem = { id: "create", label: "Create"'),
  "Create needs a navigation entry or nobody can open it"
);
assert.ok(
  prototype.includes("...(createUnlocked ? [CREATE_NAVIGATION_ITEM] : [])"),
  "Create belongs in the beta section, gated like the rest"
);
assert.ok(
  prototype.includes("const createUnlocked = leonOnlyFeaturesUnlocked;"),
  "Create should use the same gate as games — Leon and Michelle"
);
assert.ok(prototype.includes('activeView === "create"'), "Create has no route");
assert.ok(prototype.includes("<CreateView apiParts={apiParts} />"),
  "Create must receive the catalogue, or the import tab has nothing to search");

console.log(
  `check-study-sets: ${M.ALL_STAGES.length} stages, ladder promotes on ${M.MASTERY_TARGET} in a row and demotes on a miss, `
  + "paste keeps every line, and Create is wired into the beta nav"
);
