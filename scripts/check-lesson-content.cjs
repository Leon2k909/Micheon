#!/usr/bin/env node
/**
 * Vocabulary sittings exist, and they cannot contaminate the sentence course.
 *
 * Leon's brief, verbatim: "i dont want single vocabulary leaking into the
 * normal sentence continue learning button, the only singular words in the
 * normal continue learning button ... is if you would say it on its own like
 * cheers!". So this gate runs both engines and checks the border from both
 * sides, rather than trusting that two id namespaces stay apart because a
 * comment says they will.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildWordCatalog, buildWordSitting, rankWordCatalog, WORD_ID_PREFIX, wordProgressId } from "./src/lib/wordSession.ts";',
      'export { buildSession, buildCatalog } from "./src/session.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { recordSuccess, recordStruggle, snoozeForDays } from "./src/lib/memoryStrength.ts";',
      'export { WORD_PHASES, MASTERED_WORD_PHASES, buildSentencePhaseRoute } from "./src/lib/guidedLessonPhases.ts";',
    ].join("\n"),
    resolveDir: root, sourcefile: "lesson-content-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("lesson-content-check", module);
compiled.filename = path.join(root, ".lesson-content-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  buildWordCatalog, buildWordSitting, rankWordCatalog, WORD_ID_PREFIX, wordProgressId,
  buildSession, allPartBlueprints, buildApiPartFromResolved,
  recordSuccess, recordStruggle, snoozeForDays,
  WORD_PHASES, MASTERED_WORD_PHASES, buildSentencePhaseRoute,
} = compiled.exports;

const parts = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(bp, {}); } catch { /* skip malformed */ }
}

// ── the words exist and are teachable ─────────────────────────────────────
const catalog = buildWordCatalog(parts);
assert(catalog.length > 3000, `only ${catalog.length} teachable words — the seed inventory has been lost`);
assert(catalog.every((w) => w.id.startsWith(WORD_ID_PREFIX)), "a word id escaped the vw- namespace");
assert(catalog.every((w) => w.en.trim().length > 0), "a word without a gloss is being taught");
assert(catalog.every((w) => w.de.trim().split(/\s+/).length <= 6 && !/[.!?]$/.test(w.de)),
  "something sentence-shaped got into the word catalogue");
assert(catalog.every((w) => w.de.toLowerCase().replace(/^(der|die|das) /, "") !== w.en.toLowerCase().replace(/^(der|die|das) /, "")),
  "a card whose gloss repeats its German is being taught");

// ── a sitting behaves like a sitting ──────────────────────────────────────
const ranked = rankWordCatalog(catalog, null);
const fresh = buildWordSitting(ranked, {});
assert.equal(fresh.length, 6, "a fresh vocabulary sitting is not six words");
assert.equal(new Set(fresh.map((s) => s.item.en.toLowerCase())).size, 6,
  "two words in one sitting share a gloss, which breaks the meaning-pick stage");

const [w1, w2, w3] = ranked;
const grades = {
  [w1.id]: { ...recordSuccess(Date.now() - 3 * 864e5, undefined), dueAt: new Date(Date.now() - 864e5).toISOString() },
  [w2.id]: recordStruggle(Date.now(), undefined),
  [w3.id]: snoozeForDays(30),
};
const second = buildWordSitting(ranked, grades);
const ids = second.map((s) => s.item.id);
assert(ids.includes(w1.id), "a due word is not brought back");
assert(ids.includes(w2.id), "a struggling word is not brought back");
assert(!ids.includes(w3.id), "a put-off word came back anyway");
assert.equal(buildWordSitting(ranked, grades, Date.now(), { reviewSlots: 1, freshSlots: 1 }).length, 2,
  "the mixed-sitting budget is ignored");

// ── THE BORDER, run from both sides ───────────────────────────────────────
// Fifty words graded hot and due; the sentence engine must serve none of them.
const hot = {};
for (const w of ranked.slice(0, 50)) {
  hot[w.id] = { ...recordSuccess(Date.now() - 10 * 864e5, undefined), dueAt: new Date(Date.now() - 5 * 864e5).toISOString() };
}
let leaked = 0;
let oneWordPhrases = 0;
for (const [key, part] of Object.entries(parts)) {
  for (const step of buildSession({ ...part, partKey: key }, [], hot, 0)) {
    if (!step.item) continue;
    if (String(step.item.id ?? "").startsWith(WORD_ID_PREFIX) || step.item.kind === "vocab" || step.item.kind === "word") leaked += 1;
    if (String(step.item.de ?? "").trim().split(/\s+/).length === 1) oneWordPhrases += 1;
  }
}
assert.equal(leaked, 0, `${leaked} vocabulary items leaked into sentence sessions`);
assert(oneWordPhrases > 0,
  "the authored one-word phrases (Prost!, Genau!) have vanished from sentence sessions — they belong there");

// A sentence grade must not touch a word.
const sentenceGraded = { "part1-phrase-0": recordSuccess(Date.now(), undefined) };
assert(buildWordSitting(ranked, sentenceGraded).every((s) => !s.review),
  "a sentence grade marked a word as learned");

// ── the word route is short on purpose ────────────────────────────────────
assert.deepEqual([...WORD_PHASES], ["Read", "MeaningPick", "Type", "Translate"]);
assert.deepEqual([...MASTERED_WORD_PHASES], ["RecallTarget", "RecallMeaning"]);
assert.deepEqual(
  buildSentencePhaseRoute({ mastered: false, bilingual: true, audioMuted: false, word: true }),
  [...WORD_PHASES],
  "a word item is being marched through the sentence route"
);

// ── one record per word, tests included ───────────────────────────────────
const tests = read("src/components/tests/TestsView.tsx");
assert(tests.includes("buildWordCatalog(apiParts)") && tests.includes("wordProgressId("),
  "tests mint their own vocabulary ids again, so the same word has split progress");
assert(!/id = source\?\.id \?\? `\$\{partKey\}-test-vocab-/.test(tests),
  "tests fell back to per-pack vocabulary ids");
assert(wordProgressId("Haus") === wordProgressId("haus"), "word ids are case-sensitive, splitting progress");

// ── the picker, and the flag it writes ────────────────────────────────────
const home = read("src/prototype/NewUiPrototype.tsx");
assert(home.includes("np-lesson-content-picker"), "the content picker is gone from the home page");
for (const value of ['"sentences"', '"words"', '"mixed"']) {
  assert(home.includes(value), `the picker lost its ${value} option`);
}
const session = read("src/guided_learning_session.tsx");
assert(session.includes('getLessonContent()') && session.includes('lessonContent === "words"'),
  "Continue Learning no longer consults the content choice");
assert(session.includes("mixedWords"), "the mixed sitting no longer exists");

// ── the words tracker is separate, not bolted on ──────────────────────────
assert(fs.existsSync(path.join(root, "src/components/lab/WordsTracker.tsx")), "the words tracker is gone");
const bigTracker = read("src/components/lab/VocabTracker.tsx");
assert(!bigTracker.includes("wordSession"),
  "the word & sentence tracker imports the word catalogue — that is the merge Leon said would lag");
assert(read("src/Gamification.tsx").includes("<WordsTracker"), "the words tracker is not mounted");

// ── and Conversation Beta stayed dead ─────────────────────────────────────
for (const gone of ["src/lib/betaMode.ts", "src/lib/conversationBeta.ts", "src/lib/conversationQuestions.ts"]) {
  assert(!fs.existsSync(path.join(root, gone)), `${gone} is back`);
}
assert(!read("src/GuidedSession.tsx").includes("ConversationExercise"), "the beta exercise is back");
assert(!home.includes("np-beta-button"), "the beta button is back");

console.log(`check-lesson-content: ${catalog.length} words teachable under their own ids, sittings of six with snooze and reviews honoured, zero leakage into sentence sessions in either direction, one record per word across sittings/tests/tracker, and the beta stays removed`);
