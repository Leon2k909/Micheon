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
      'export { frenchFor } from "./src/lib/frenchCourse.ts";',
      'export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";',
      'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
      'export { primeTranslations } from "./src/lib/translations.ts";',
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
  learnerTurnIndexes, MIN_SCENARIO_TURNS, frenchFor } = compiled.exports;
// The tables are fetched on demand in the app, so a German-only learner
// never downloads them. A check has no event loop to await one on and wants
// every language at once, so it hands them in directly.
const M = compiled.exports;
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

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

// ── scenes are being lengthened, and stay lengthened ────────────────────────
// Almost every authored dialogue was four lines, which is two turns for the
// learner — a question and an answer, twice. They are being extended to eight
// a batch at a time. This floor is a ratchet: it rises with each batch, and
// its job is to notice a later edit quietly trimming them back.
const LONG_SCENES = 28;
const long = scenarios.filter((s) => s.turns.length >= 8);
assert.ok(long.length >= LONG_SCENES,
  `only ${long.length} scenes run to eight turns or more, and ${LONG_SCENES} did — extended `
  + "dialogues have been shortened again");
for (const scenario of long) {
  assert.ok(learnerTurnIndexes(scenario).length >= 4,
    `"${scenario.title}" runs to ${scenario.turns.length} turns but the learner speaks only `
    + `${learnerTurnIndexes(scenario).length} of them, so the extra length is somebody else talking`);
}

// ── and lengthening one has not dropped it from the French course ───────────
// buildScenarios refuses a dialogue outright when any single line has no
// French, because a conversation that changes language halfway through is not
// one. So adding a German line to a scene the French course DOES show removes
// the whole scene, silently, from a course nothing else here exercises. The
// rule that keeps it honest: extend a fully-French dialogue, translate what
// you added.
const FULLY_FRENCH = 158;
let fullyFrench = 0;
for (const part of Object.values(parts)) {
  for (const dialogue of (part?.dialogues ?? [])) {
    const lines = dialogue?.lines ?? [];
    if (!lines.length) continue;
    if (lines.every((line) => line?.de && frenchFor(line.de, line.fr ?? null))) fullyFrench += 1;
  }
}
assert.ok(fullyFrench >= FULLY_FRENCH,
  `${fullyFrench} dialogues survive into the French course and ${FULLY_FRENCH} did. A line was `
  + "added to one of them without its French, which drops the entire scene rather than that line");

// ── the meaning line can be put away, and only that line ────────────────────
// Each turn prints the language being learned and, under it, the same line in
// a language the learner already reads. That second line is the point early on
// and a spoiler later: it answers the question before the German has been
// read. So it can be hidden — and the failure worth guarding is hiding the
// WRONG one, which leaves a turn with nothing on it at all.
const view = fs.readFileSync(path.join(root, "src/components/conversation/ConversationView.tsx"), "utf8");
assert.ok(view.includes('data-testid="conversation-translation-toggle"'),
  "there is no way to put the translation away");
assert.ok(view.includes("{!translationHidden && <p className=\"conversation-line__en\">{turn.en}</p>}"),
  "the toggle does not actually hide the meaning line");
assert.ok(/<p className="conversation-line__de" lang=\{sides\.target\.htmlLang\}>\{turn\.de\}<\/p>/.test(view),
  "the line being practised is printed conditionally — hide that and the turn says nothing at all");

// A preference, not a mood: written through the stored setting rather than to
// component state, or it is forgotten the moment the scene closes.
assert.ok(view.includes("setConversationTranslationHidden(!translationHidden)")
  && view.includes("useState(getConversationTranslationHidden)"),
  "the setting is component state, so it resets every time a scene is opened");
assert.ok(view.includes("CONVERSATION_TRANSLATION_EVENT"),
  "a change made elsewhere leaves this scene showing the opposite of the setting");
const prefs = fs.readFileSync(path.join(root, "src/lib/conversationTranslation.ts"), "utf8");
assert.ok(prefs.includes("syncLocalStorageItem"),
  "the setting is written to this device only, unlike the app's other preferences");
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + fs.readFileSync(path.join(root, "src/lib/i18nDe.ts"), "utf8");
assert.ok(i18n.includes('"Hide the translation":') && i18n.includes('"Show the translation":'),
  "the control has no German");

console.log(
  `check-conversation-scenarios: ${scenarios.length} scenarios, ${questions} questions, every one `
  + `answerable — four distinct replies with exactly one that fits. ${long.length} scenes run to `
  + `eight turns with the learner speaking four, ${fullyFrench} survive into the French course, `
  + "and the meaning line can be put away without taking the practised line with it"
);
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
