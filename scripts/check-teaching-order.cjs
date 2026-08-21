#!/usr/bin/env node
/**
 * What gets taught next has to be what you are most likely to need next.
 *
 * The failure this guards against, found in the wild: "Wie schön! Und wie
 * macht ihr das mit der Arbeit?" — a line from a pregnancy-announcement
 * dialogue — was served at position 1,268, one place BEHIND "Wo ist die
 * Toilette?" at 1,208.
 *
 * Two causes, both pinned here. 309 of 373 packs shared a single "situational"
 * band, so once a learner passed the ~1,200 essential and everyday items the
 * band stopped sorting anything at all. And what took over was a commonality
 * score that measures how often a sentence's WORDS appear in our own content —
 * so a niche sentence assembled from ordinary words ("wie", "macht", "Arbeit")
 * scored as common, while "Toilette" scored as exotic.
 *
 * The division of labour that fixes it, and that this holds in place:
 *   band       = how often you NEED this — editorial, no word count can supply it
 *   commonality = how hard the VOCABULARY is — measured, and only sorts within a band
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");
const failures = [];

global.window = { localStorage: { length: 0, key: () => null, getItem: () => null, setItem() {}, removeItem() {} }, addEventListener() {}, removeEventListener() {}, setTimeout: (f, m) => setTimeout(f, m), clearTimeout: (i) => clearTimeout(i), location: { search: "" }, dispatchEvent() { return true; } };
global.document = { documentElement: { dataset: {}, style: {}, setAttribute() {}, getAttribute: () => null }, addEventListener() {}, head: { appendChild() {} }, getElementById: () => null, createElement: () => ({ style: {} }) };
global.navigator = { language: "en-GB" };

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildCatalog } from "./src/session.ts";
      export { conversationPriorityScore, conversationPriorityInfo } from "./src/lib/conversationPriority.ts";
      export { buildCorpusIndex, sentenceCommonality } from "./src/lib/corpusFrequency.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildWordCatalog, rankWordCatalog, buildWordSitting, learnerWordRung } from "./src/lib/wordSession.ts";
      export { frequencyRank } from "./src/lib/wordFrequency.ts";
    `,
    resolveDir: root, sourcefile: "order-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-order.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-order.entry.cjs"));
const { buildCatalog, conversationPriorityScore, conversationPriorityInfo, buildCorpusIndex, sentenceCommonality, allPartBlueprints } = mod.exports;

const catalog = buildCatalog(allPartBlueprints);
const corpus = buildCorpusIndex(allPartBlueprints);
const ordered = catalog
  .map((item) => ({
    de: item.de,
    partKey: item.partKey,
    score: conversationPriorityScore({
      partKey: item.partKey,
      kind: item.kind,
      commonality: sentenceCommonality(item.de, corpus),
      lessonPriority: item.lessonPriority,
    }),
  }))
  .sort((a, b) => a.score - b.score);

const positionOf = (needle) => ordered.findIndex((row) => row.de.includes(needle)) + 1;

// ── no band may swallow the catalogue ─────────────────────────────────────
const counts = new Map();
for (const item of catalog) {
  const key = conversationPriorityInfo(item.partKey).key;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}
const biggest = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
const share = biggest[1] / catalog.length;
if (share > 0.55) {
  failures.push(`"${biggest[0]}" holds ${Math.round(share * 100)}% of the catalogue — a band that size sorts nothing`);
}
// The old bucket must not quietly reappear under its old name.
if ((counts.get("situational") ?? 0) > catalog.length * 0.2) {
  failures.push("the flat situational bucket is back");
}
for (const band of ["daily", "occasional", "life-event"]) {
  if (!counts.get(band)) failures.push(`the "${band}" band is empty, so the split is not doing anything`);
}

// ── the motivating inversion, and its neighbours ──────────────────────────
const niche = positionOf("Und wie macht ihr das mit der Arbeit");
const toilet = positionOf("Wo ist die Toilette");
if (niche <= 0) {
  failures.push("the pregnancy-dialogue line is gone from the catalogue, so this check proves nothing");
} else if (toilet <= 0) {
  failures.push('"Wo ist die Toilette?" is gone from the catalogue, so this check proves nothing');
} else if (niche < toilet * 3) {
  failures.push(`a pregnancy-and-parental-leave line is served at ${niche} against "where is the toilet" at ${toilet} — the ordering has slipped back to word frequency`);
}

// ── the first thing taught is an essential, not a common-sounding sentence ─
const firstTwenty = ordered.slice(0, 20).map((row) => conversationPriorityInfo(row.partKey).key);
if (firstTwenty.some((key) => key !== "essential" && key !== "personal")) {
  failures.push("something outside the conversation essentials is being taught in the first twenty items");
}

// ── an editor can promote within a band but never across one ──────────────
const bandGap = 10_000_000;
const maxAuthored = 2 * 1_500_000;
const maxCommonality = 5_000 * 1_000;
if (maxAuthored + maxCommonality + 60_000 >= bandGap) {
  failures.push("a within-band nudge can now outrank the band itself, so usefulness stops deciding the order");
}

if (failures.length) {
  console.error("FAIL check-teaching-order");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
// ── declaring knowns must not bury the common words ─────────────────────────
// Leon: "im concerned that if i keep pressing kann ich, it will make things
// less popular.. is that a good worry?"
//
// The mechanism is real: the rung climbs on DECLARED knowns — five presses a
// rung, six rungs, so it tops out after twenty-five — and new words are then
// served from that rung upward. What stops it becoming a problem is the core
// carve-out: a word in the top 1,200 of the frequency bank counts as at-rung
// wherever the learner stands, so the everyday vocabulary can never be pushed
// behind C1 material. This asserts the outcome rather than the mechanism, so
// it survives the mechanism being rewritten.
{
  const { buildApiPartFromResolved, buildWordCatalog, rankWordCatalog, buildWordSitting, learnerWordRung, frequencyRank } = mod.exports;
  const wordParts = {};
  for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
    try { wordParts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
  }
  const rankedWords = rankWordCatalog(buildWordCatalog(wordParts), null);
  const declareTopN = (n) => {
    const grades = {};
    for (let i = 0; i < n; i += 1) {
      const word = rankedWords[i];
      if (word) grades[word.id] = { lastGrade: "know", declared: true };
    }
    return grades;
  };

  // The rung really does saturate, which is worth stating rather than
  // discovering later: after 25 presses everyone is on the top rung.
  assert.strictEqual(learnerWordRung(declareTopN(0)), 1, "nobody starts above the first rung");
  assert.strictEqual(learnerWordRung(declareTopN(25)), 6, "25 declared knowns reaches the top rung");
  assert.strictEqual(learnerWordRung(declareTopN(2000)), 6, "and it cannot climb past it");

  // The outcome that matters: however far up the ladder you are, the next new
  // words are still the most common ones you have not met.
  for (const declared of [0, 25, 100, 500, 1000]) {
    const grades = declareTopN(declared);
    const sitting = buildWordSitting(rankedWords, grades, Date.now(), { reviewSlots: 0, freshSlots: 6 });
    const words = sitting.map((step) => step.item);
    assert.ok(words.length > 0, `no words served after ${declared} declared knowns`);
    const known = words.filter((word) => Number.isFinite(frequencyRank(word.lookup || word.de))).length;
    assert.strictEqual(known, words.length,
      `after ${declared} presses of Kann ich, ${words.length - known} of ${words.length} new words `
      + "are outside the 2,500-word frequency bank — declaring knowns is pushing rare words forward");
  }
}

console.log(`check-teaching-order: no band holds more than ${Math.round(share * 100)}% of the catalogue, the essentials come first, and the pregnancy line sits at ${niche} against "where is the toilet" at ${toilet}, and declaring knowns never buries the common words`);
