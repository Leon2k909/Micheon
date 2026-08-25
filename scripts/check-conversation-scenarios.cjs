#!/usr/bin/env node
/**
 * Every scenario has to be playable, and every question answerable.
 *
 * The mode hands the learner four replies and accepts one. That only works if
 * the other three are actually wrong — and the way it silently stops working
 * is a distractor that would ALSO answer the question. "Danke." replies to
 * almost anything; offered against "Kann ich Ihnen helfen?" there are two
 * right answers and no way to tell which the app wanted, so a learner who
 * reads the German properly gets marked wrong.
 *
 * So the options are built for every learner turn in every scenario and
 * checked: four distinct replies, the real one among them, and none of the
 * others a courtesy that fits anywhere.
 *
 * Nothing here is authored content. A scenario IS one of the course's own
 * dialogues, which the content checks already cover — this checks the machine
 * that turns one into a conversation.
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
      'export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";',
      'export { buildScenarios, learnerLines, replyOptions, learnerTurnIndexes, MIN_SCENARIO_TURNS } from "./src/lib/conversationScenarios.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "conversation-entry.ts",
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

const compiled = new Module("conversation-check", module);
compiled.filename = path.join(root, ".conversation-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildBundledParts,
  filterPartsForLearningDirection, buildScenarios, learnerLines, replyOptions,
  learnerTurnIndexes, MIN_SCENARIO_TURNS } = compiled.exports;

const blueprint = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { blueprint[key] = buildApiPartFromResolved(bp, {}); } catch { /* as the app does */ }
}
const parts = filterPartsForLearningDirection(
  { ...blueprint, ...buildBundledParts("learn-de") }, "learn-de");

const scenarios = buildScenarios(parts);
assert.ok(scenarios.length > 400,
  `only ${scenarios.length} scenarios built — the dialogues are not being read`);

const pool = learnerLines(scenarios);
assert.ok(pool.length > 900,
  `only ${pool.length} learner lines, which is too small a pool to draw wrong answers from`);

// ── every scenario is a conversation, not a monologue ───────────────────────
for (const scenario of scenarios) {
  assert.ok(scenario.turns.length >= MIN_SCENARIO_TURNS,
    `"${scenario.title}" has ${scenario.turns.length} turns — too short to be a conversation`);
  assert.ok(scenario.turns.some((turn) => turn.side === "you"),
    `"${scenario.title}" never lets the learner speak, so it is a script to read`);
  assert.ok(scenario.turns.some((turn) => turn.side === "them"),
    `"${scenario.title}" is all the learner, so there is nobody to answer`);
  assert.ok(scenario.turns.every((turn) => turn.de && turn.en),
    `"${scenario.title}" has a turn missing one of its languages`);
}

// ── and every question the learner is asked can be answered ─────────────────
// The courtesy list is the component's own: a reply that fits anywhere cannot
// be a wrong answer, so it must never be offered as one.
const FITS_ANYWHERE = /^(ja|nein|danke|bitte|okay|ok|klar|genau|gut|alles klar|kein problem|gerne|na klar)[.!?]?$/i;

let questions = 0;
for (const scenario of scenarios) {
  for (const index of learnerTurnIndexes(scenario)) {
    const answer = scenario.turns[index];
    const options = replyOptions(answer, pool, 4, index);
    questions += 1;

    assert.strictEqual(options.length, 4,
      `"${scenario.title}" turn ${index} offered ${options.length} replies, not 4`);
    assert.ok(options.some((option) => option.de === answer.de),
      `"${scenario.title}" turn ${index} does not offer the reply the dialogue actually gives`);

    const seen = new Set(options.map((option) => option.de));
    assert.strictEqual(seen.size, 4,
      `"${scenario.title}" turn ${index} offered the same reply twice`);

    for (const option of options) {
      if (option.de === answer.de) continue;
      assert.ok(!FITS_ANYWHERE.test(option.de.trim()),
        `"${scenario.title}" turn ${index} offers "${option.de}" as a wrong answer, but it replies `
        + `to anything — so "${answer.de}" is not the only right answer and the question cannot be marked`);
      assert.ok(option.en.trim().toLowerCase() !== answer.en.trim().toLowerCase(),
        `"${scenario.title}" turn ${index} offers a wrong answer that means the same as the right one`);
    }
  }
}
assert.ok(questions > 900, `only ${questions} questions across every scenario`);

// ── the same scenario lays out the same way twice ───────────────────────────
// A re-render is not a new question. Options shuffled per render would move
// under the cursor every time React updated anything.
const sample = scenarios[0];
const first = replyOptions(sample.turns[learnerTurnIndexes(sample)[0]], pool, 4, 1);
const again = replyOptions(sample.turns[learnerTurnIndexes(sample)[0]], pool, 4, 1);
assert.deepStrictEqual(first.map((o) => o.de), again.map((o) => o.de),
  "the replies are shuffled afresh on every call, so they would move under the cursor mid-answer");

// ── and it is reachable ─────────────────────────────────────────────────────
// Conversation is the fourth way into Learn rather than a nav entry of its
// own, because it is another way through the same course rather than a
// separate place to be. So the way in is a card beside the guided session,
// the path and the Matcher — and the nav must NOT also carry it, or there
// would be two doors to one room.
const learn = fs.readFileSync(path.join(root, "src/components/duo/DuoPathView.tsx"), "utf8");
assert.ok(learn.includes("<ConversationView") && learn.includes("setConversing(true)"),
  "the mode exists but Learn has no card that opens it");
assert.ok(learn.includes('ui("Say something back")'),
  "the fourth card has no label");
// Four cards need four columns; three-across strands the fourth on its own row.
assert.ok(learn.includes("sm:grid-cols-2 lg:grid-cols-4"),
  "the ways into Learn are still laid out three across, so the fourth card sits alone");

const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
assert.ok(!shell.includes("CONVERSATION_NAVIGATION_ITEM") && !shell.includes("conversationUnlocked"),
  "Conversation has a nav entry as well as its card in Learn — one room, two doors, and the "
  + "nav copy is dead code the moment the card moves");

console.log(
  `check-conversation-scenarios: ${scenarios.length} scenarios, ${questions} questions, every one `
  + "answerable — four distinct replies with exactly one that fits"
);
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
