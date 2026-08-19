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
      'export { recordDeclaredKnown } from "./src/lib/memoryStrength.ts";',
      'export { wordLadderRung, learnerWordRung } from "./src/lib/wordSession.ts";',
      'export { WORD_PHASES, MASTERED_WORD_PHASES, buildSentencePhaseRoute } from "./src/lib/guidedLessonPhases.ts";',
      'export { matchEnglishMeaning, primaryEnglishMeaning } from "./src/lib/germanTextMatch.ts";',
      'export { frequencyRank } from "./src/lib/wordFrequency.ts";',
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
  recordDeclaredKnown, wordLadderRung, learnerWordRung,
  WORD_PHASES, MASTERED_WORD_PHASES, buildSentencePhaseRoute,
  matchEnglishMeaning, primaryEnglishMeaning, frequencyRank,
} = compiled.exports;

const parts = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(bp, {}); } catch { /* skip malformed */ }
}

// ── the words exist and are teachable ─────────────────────────────────────
const catalog = buildWordCatalog(parts);
// Combined synonym cards fold same-meaning words into one entry (see
// wordSynonymGroups.ts), so the inventory is counted in WORDS TAUGHT — card
// faces plus the synonyms they absorbed — never in cards, or the fold could
// quietly hide a lost word behind a smaller catalogue.
const absorbedSynonyms = catalog.flatMap((word) => word.synonyms ?? []);
const taughtWordCount = catalog.length + absorbedSynonyms.length;
assert(taughtWordCount >= 4287, `only ${taughtWordCount} taught words — the expanded word inventory has been lost`);
assert(catalog.every((w) => w.id.startsWith(WORD_ID_PREFIX)), "a word id escaped the vw- namespace");
assert(catalog.every((w) => w.en.trim().length > 0), "a word without a gloss is being taught");
assert(catalog.every((word) => {
  const primaryMeaning = primaryEnglishMeaning(word.en);
  return primaryMeaning && matchEnglishMeaning(primaryMeaning, word.en).ok;
}), "a word's displayed primary meaning is not accepted by its own answer checker");
assert(catalog.every((w) => w.de.trim().split(/\s+/).length <= 6 && !/[.!?]$/.test(w.de)),
  "something sentence-shaped got into the word catalogue");
assert(catalog.every((w) => w.de.toLowerCase().replace(/^(der|die|das) /, "") !== w.en.toLowerCase().replace(/^(der|die|das) /, "")),
  "a card whose gloss repeats its German is being taught");

// Leon asked for genuine depth in the dedicated Words mode, especially for
// an English learner who already knows the basics. These packs deliberately
// double the B2+ inventory with authored verbs, adjectives and modern topic
// vocabulary. Pin both raw pack size and catalogue ownership: a duplicate
// lemma or same-language gloss would otherwise make a seed silently vanish.
// Taught-from-pack counts a pack's card faces AND its words absorbed into a
// combined synonym card elsewhere — absorbed is still taught, just not a row.
const taughtFromPack = (key) =>
  catalog.filter((word) => word.partKey === key).length
  + absorbedSynonyms.filter((syn) => syn.partKey === key).length;
const depthPackKeys = Array.from({ length: 10 }, (_, index) => `part${411 + index}`);
const depthPackKeySet = new Set(depthPackKeys);
const depthCards = catalog.filter((word) => depthPackKeySet.has(word.partKey));
const depthWords = [
  ...depthCards,
  ...absorbedSynonyms.filter((syn) => depthPackKeySet.has(syn.partKey)),
];
assert.equal(depthWords.length, 400, "the advanced word expansion no longer contributes 400 taught words");
for (const key of depthPackKeys) {
  assert.equal((parts[key]?.vocab ?? []).length, 40, `${key} lost one of its forty authored words`);
  assert.equal(taughtFromPack(key), 40,
    `${key} contains a duplicate or unusable word that vanished from Words mode`);
}
assert(depthWords.filter((word) => word.pos === "verb" || word.pos === "verb phrase" || word.pos === "adjective").length >= 210,
  "the advanced expansion has fallen back to padding the catalogue with nouns");
const secondDepthPackKeys = Array.from({ length: 10 }, (_, index) => `part${421 + index}`);
const secondDepthPackKeySet = new Set(secondDepthPackKeys);
const secondDepthCards = catalog.filter((word) => secondDepthPackKeySet.has(word.partKey));
const secondDepthWords = [
  ...secondDepthCards,
  ...absorbedSynonyms.filter((syn) => secondDepthPackKeySet.has(syn.partKey)),
];
assert.equal(secondDepthWords.length, 400, "the second advanced expansion no longer contributes 400 taught words");
for (const key of secondDepthPackKeys) {
  assert.equal((parts[key]?.vocab ?? []).length, 40, `${key} lost one of its forty authored words`);
  assert.equal(taughtFromPack(key), 40,
    `${key} contains a duplicate or unusable word that vanished from Words mode`);
}
assert(secondDepthWords.filter((word) => ["verb", "verb phrase", "adjective", "adverb"].includes(word.pos)).length >= 235,
  "the second advanced expansion has fallen back to padding the catalogue with nouns");
const glossOwners = new Map();
for (const word of catalog) {
  const gloss = word.en.trim().toLowerCase();
  if (!glossOwners.has(gloss)) glossOwners.set(gloss, []);
  glossOwners.get(gloss).push(word);
}
// Cards only: a depth word ABSORBED into a combined synonym card shares its
// gloss by design — that card names the distinction, which is the explaining
// this check demands.
const reusedDepthGlosses = depthCards
  .filter((word) => glossOwners.get(word.en.trim().toLowerCase())?.length !== 1)
  .map((word) => `${word.de} = ${word.en}`);
const reusedSecondDepthGlosses = secondDepthCards
  .filter((word) => glossOwners.get(word.en.trim().toLowerCase())?.length !== 1)
  .map((word) => `${word.de} = ${word.en}`);
assert.equal(reusedDepthGlosses.length, 0,
  `a new advanced word reuses an existing English gloss without explaining the distinction: ${reusedDepthGlosses.join(", ")}`);
assert.equal(reusedSecondDepthGlosses.length, 0,
  `a second-batch advanced word reuses an existing English gloss without explaining the distinction: ${reusedSecondDepthGlosses.join(", ")}`);

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

// ── the difficulty ladder ─────────────────────────────────────────────────
//
// Leon's rule, verbatim: "if shes repeatedly saying she knows stuff, the
// words should get harder and harder" — and later, "it should still go back
// to doing the beginning stuff we skipped out". Both halves are behaviour,
// so both are run rather than read.
assert(
  catalog.filter((w) => wordLadderRung(w) >= 4).length
    + absorbedSynonyms.filter((syn) => wordLadderRung(syn) >= 4).length >= 1188,
  "the advanced word inventory has shrunk — part401-430 may be missing"
);
for (const key of ["part401", "part405", "part410"]) {
  assert((parts[key]?.vocab ?? []).length === 40, `${key} lost its forty words`);
}
// A beginner starts at the bottom.
assert(buildWordSitting(ranked, {}).every((s) => wordLadderRung(s.item) === 1),
  "a fresh learner is no longer started on the most common words");
// The climb rate is Leon's: five knowns per rung, so about one preview's
// worth of Kann-ich presses (25) reaches the top. Fifteen-per-rung was
// shipped first and judged too slow — this assertion is what pins the fix.
const climbGrades = {};
for (const w of ranked.slice(0, 26)) climbGrades[w.id] = recordDeclaredKnown(undefined);
assert(learnerWordRung(climbGrades) >= 6, "25 Kann-ich presses no longer reach the top rung — the climb rate has regressed");
// Leon's second ruling (2026-08-19), after "erneuerbar" arrived before Hund:
// an unknown word in the everyday core (frequency rank <= 1200) is never
// beneath anyone, so a climbed learner is served unknown core words alongside
// the hard tiers rather than after them. Everything OUTSIDE the core still
// hardens with the rung, which is the half of the promise from 2026-08's
// first ruling that survives.
const climbedFresh = buildWordSitting(ranked, climbGrades).filter((s) => !s.review);
assert(climbedFresh.every((s) =>
  wordLadderRung(s.item) >= 4 || frequencyRank(s.item.lookup || s.item.de) <= 1200
), "a climbed learner is being served uncommon basics");
assert(climbedFresh.some((s) => frequencyRank(s.item.lookup || s.item.de) <= 1200),
  "a climbed learner no longer meets unknown everyday-core words at all");
// Struggles pull it back down.
const strugglingGrades = { ...climbGrades };
for (const w of ranked.slice(200, 215)) strugglingGrades[w.id] = recordStruggle(Date.now(), undefined);
assert(learnerWordRung(strugglingGrades) < learnerWordRung(climbGrades),
  "struggling at the top no longer lowers the ladder");
// And the wrap-around: when the hard tiers are done, the skipped easy words
// come back — climbing must never mean words go missing.
const topDone = {};
for (const w of ranked) if (wordLadderRung(w) >= 3) topDone[w.id] = recordDeclaredKnown(undefined);
const wrapped = buildWordSitting(ranked, topDone).filter((s) => !s.review);
assert(wrapped.length > 0 && wrapped.every((s) => wordLadderRung(s.item) < 3),
  "finishing the hard tiers does not bring the skipped easy words back");

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
assert.deepEqual(
  [...WORD_PHASES],
  ["Read", "MeaningPick", "MeaningSelect", "ListenPick", "Type", "Translate", "RecallBoth"]
);
assert.deepEqual([...MASTERED_WORD_PHASES], ["RecallTarget", "RecallMeaning"]);
assert.deepEqual(
  buildSentencePhaseRoute({ mastered: false, bilingual: true, audioMuted: false, word: true }),
  [...WORD_PHASES],
  "a word item is being marched through the sentence route"
);
assert.deepEqual(
  buildSentencePhaseRoute({ mastered: false, bilingual: false, audioMuted: true, word: true }),
  WORD_PHASES.filter((phase) => phase !== "ListenPick"),
  "muting audio removed more than the listening-only word stage"
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
assert(home.includes("np-lesson-content-trigger") && home.includes('aria-haspopup="menu"'),
  "the picker is no longer the dropdown on the button that Leon asked for");
// The preview swap must replace like with like: mastering a WORD on the
// vocabulary flashcards used to hand back a SENTENCE, mid-preview, in a
// sitting chosen precisely for having no sentences in it.
const sessionSrc = read("src/guided_learning_session.tsx");
assert(sessionSrc.includes('outgoing?.item?.kind === "word"'),
  "the preview swap no longer distinguishes word cards from sentence cards");
assert(sessionSrc.includes("swappingWord") && /swappingWord[\s\S]{0,220}rankWordCatalog/.test(sessionSrc),
  "a mastered word card is not replaced from the word catalogue");
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

console.log(`check-lesson-content: ${taughtWordCount} words taught across ${catalog.length} cards (synonyms combined), sittings of six with snooze and reviews honoured, zero leakage into sentence sessions in either direction, one record per word across sittings/tests/tracker, and the beta stays removed`);
