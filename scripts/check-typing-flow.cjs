#!/usr/bin/env node
/**
 * Typing the right answer is accepted, and moves on by itself.
 *
 * Two halves of one complaint — "I typed this correctly and it did not skip".
 *
 * ACCEPTED. "Ich hab's" and "Ich hab es" are one sentence written two ways;
 * the clitic 's IS es. That was expanded for a list of four verbs — machs,
 * gibts, gehts, ists — while the course uses a clitic on 57 different stems,
 * so writing one out in full was marked wrong on all the others.
 *
 * MOVES ON. Enter was always wired, but a finished answer asking for one more
 * keypress reads as the app not having noticed. A clean answer now checks
 * itself after a pause.
 *
 * Both halves have a way of going too far, and that is most of what is
 * guarded here:
 *
 *   - Expanding a trailing s must not touch ordinary words. "das", "was",
 *     "aus", "eins", "uns" all end in s and none of them is a contraction.
 *   - Expanding must not make two different cards identical, which would let
 *     a wrong answer pass on the card next to it.
 *   - Checking itself must not skip a note. A lenient match — a spelling
 *     slip, a capital letter, an English turn of phrase — is accepted WITH
 *     something to read, and jumping past it trades the lesson for a
 *     keystroke.
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
      'export { matchGermanSentence, normalizeGermanInput, normalizeGermanInputCaseSensitive } from "./src/lib/germanTextMatch.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";',
      'export { buildCatalog } from "./src/session.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "typing-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

global.window = {
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("typing-check", module);
compiled.filename = path.join(root, ".typing-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { matchGermanSentence, normalizeGermanInput, allPartBlueprints, buildApiPartFromResolved,
  buildBundledParts, filterPartsForLearningDirection, buildCatalog } = compiled.exports;

const ok = (typed, target) => matchGermanSentence(typed, target).ok;

// ── the clitic is accepted, written either way ──────────────────────────────
for (const [typed, target] of [
  ["Ich hab es", "Ich hab's"],
  ["Ich hab's", "Ich hab es"],
  ["Ich habs", "Ich hab's"],
  ["Ich hab es", "Ich habs"],
  ["Gibt's noch Kaffee?", "Gibt es noch Kaffee?"],
  ["Gibt es noch Kaffee?", "Gibt's noch Kaffee?"],
  ["Wie geht's?", "Wie geht es?"],
  ["Das war es", "Das war's"],
  ["Mach's gut", "Mach es gut"],
]) {
  assert.ok(ok(typed, target),
    `"${typed}" was marked wrong against "${target}", and they are the same sentence — the clitic `
    + "'s is es, so writing it out in full is not a mistake");
}

// ── and ordinary words ending in s are left alone ───────────────────────────
// The expansion is what makes this a risk: turn a trailing s into " es" too
// eagerly and "das Haus" becomes "da es Hau es".
for (const word of ["das", "was", "aus", "eins", "uns", "haus", "eis", "kurs", "bus", "glas"]) {
  assert.strictEqual(normalizeGermanInput(word), word,
    `"${word}" was rewritten by the contraction rule, and it is an ordinary word, not a contraction`);
}
assert.strictEqual(normalizeGermanInput("Das ist das Haus"), "das ist das haus",
  "an ordinary sentence was rewritten by the contraction rule");

// ── and two different cards do not become one ───────────────────────────────
// A wrong answer passing on the card next to it is the failure this prevents,
// and it can only be seen against the whole catalogue.
const blueprint = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { blueprint[key] = buildApiPartFromResolved(bp, {}); } catch { /* as the app does */ }
}
const parts = filterPartsForLearningDirection(
  { ...blueprint, ...buildBundledParts("learn-de") }, "learn-de");
const catalog = buildCatalog(parts);
assert.ok(catalog.length > 10000, `the catalogue did not build (${catalog.length} items)`);

const byNormalised = new Map();
for (const item of catalog) {
  const de = String(item.de ?? "").trim();
  if (!de) continue;
  const key = normalizeGermanInput(de);
  if (!byNormalised.has(key)) byNormalised.set(key, new Set());
  byNormalised.get(key).add(de);
}
const collided = [...byNormalised.values()].filter((forms) => forms.size > 1);
// Cards that were already indistinguishable are not this rule's doing; what
// matters is that expansion did not create NEW pairs. Any collision here must
// be between two spellings of one sentence, not two different ones.
for (const forms of collided) {
  const [first, ...rest] = [...forms];
  for (const other of rest) {
    const sameSentence = ok(first, other) || ok(other, first);
    assert.ok(sameSentence,
      `"${first}" and "${other}" now normalise to the same thing and are not the same sentence — `
      + "typing one would pass on the other");
  }
}

// ── a correct answer checks itself, and only a clean one ────────────────────
const session = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
assert.ok(/const AUTO_CHECK_PAUSE_MS = \d+;/.test(session),
  "the pause before a correct answer checks itself is gone, so it fires on the keystroke that "
  + "first matched and cuts off anyone still typing");
const pause = Number(/const AUTO_CHECK_PAUSE_MS = (\d+);/.exec(session)[1]);
assert.ok(pause >= 250 && pause <= 1200,
  `the pause is ${pause}ms, which is either short enough to interrupt typing or long enough to `
  + "read as the app hesitating");

const guard = /const clean = \(outcome[^)]*\) =>\s*([^;]+);/.exec(session);
assert.ok(guard, "the rule deciding which answers check themselves could not be found");
for (const note of ["spellingNote", "capitalizationError", "phrasingNote"]) {
  assert.ok(guard[1].includes(`!outcome.${note}`),
    `an answer carrying ${note} checks itself, which skips past the note the learner is meant to `
    + "read — the point of accepting it leniently was to say something about it");
}
assert.ok(guard[1].includes("outcome.ok"), "an answer that is not right checks itself");

// It has to cover the stages that ask for typing, or it is a fix for one screen.
for (const phase of ["ListenPick", "Type", "TypeAgain", "Translate", "TranslateAgain"]) {
  assert.ok(new RegExp(`phase === "${phase}"`).test(session.slice(session.indexOf("const autoCheckRef"))),
    `${phase} asks the learner to type and still waits for Enter, so the behaviour changes from `
    + "one stage to the next");
}
// And it must not fire twice on the same answer.
const effect = session.slice(session.indexOf("const autoCheckRef"), session.indexOf("const retryEn"));
for (const already of ["!listeningTypeChecked", "!checked", "!enChecked"]) {
  assert.ok(effect.includes(already),
    `the timer re-arms on an answer that was already checked (${already} is missing), so a card `
    + "can check itself twice");
}
assert.ok(effect.includes("window.clearTimeout"),
  "the pending check is never cancelled, so it survives a keystroke and fires on stale input");

console.log(
  `check-typing-flow: the clitic is accepted written either way, ${catalog.length} catalogue items `
  + `hold no new collisions, and a clean answer checks itself after ${pause}ms across five typing `
  + "stages — a lenient one still waits, so its note is read"
);
process.exit(0);
