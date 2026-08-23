#!/usr/bin/env node
/**
 * A card has to teach what the word means, and the count behind it has to be
 * the word's own.
 *
 * Two faults, one symptom. A word can be pushed to the front of the course by
 * a count that belongs to a different word, and then taught in a sense the
 * course never uses — so the learner meets it early AND learns it wrong.
 *
 *   die Wolle arrived 84th on 42 uses. The course says Wolle three times. The
 *   other 39 were sentences opening "Wollen wir ...?".
 *   gelassen arrived 34th on 82 uses, every one of them lassen's.
 *   gestehen arrived 112th on 33 uses, every one of them stehen's, in a course
 *   that never says gestehen at all.
 *
 * And separately, gar sat at 58 on a count that was honest — the course really
 * does say it seventy times — while the card read "cooked through". All
 * seventy are gar nicht, gar nichts, gar kein.
 *
 * What is checked is the principle in both directions: a word must not inherit
 * another word's count, and a word that legitimately pools its own forms must
 * keep doing so. Both halves matter — the cheap fix for the first is to stop
 * pooling anything, which would undercount every verb in the language.
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
      'export { buildCorpusIndex, corpusUses, wordCommonality } from "./src/lib/corpusFrequency.ts";',
      'export { buildCatalog } from "./src/session.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "true-meanings-entry.ts",
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

const compiled = new Module("true-meanings-check", module);
compiled.filename = path.join(root, ".true-meanings-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildCorpusIndex, corpusUses, buildCatalog,
  buildWordCatalog } = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}
const index = buildCorpusIndex(parts);
const sentences = buildCatalog(parts).map((item) => String(item.de || ""));

/** How often the bare word really appears in the course's own sentences. */
function literalUses(word) {
  const bare = word.replace(/^(der|die|das)\s+/, "").trim();
  const re = new RegExp(`(?<![\\p{L}])${bare}(?![\\p{L}])`, "giu");
  return sentences.reduce((total, sentence) => total + (sentence.match(re) || []).length, 0);
}

// ── a word must not be counted on another word's back ───────────────────────
// The ceiling is generous on purpose: pooling a word's OWN forms legitimately
// multiplies its literal count several times over, and this must not fire on
// that. What it catches is a word whose count came from somewhere else
// entirely — an order of magnitude above anything the text can account for.
const IMPOSTORS = [
  { word: "die Wolle", stolenFrom: "wollen", was: 42 },
  { word: "gelassen", stolenFrom: "lassen", was: 82 },
  { word: "gestehen", stolenFrom: "stehen", was: 33 },
  { word: "erste", stolenFrom: "erst", was: 153 },
  { word: "der Gedanke", stolenFrom: null, was: 33 },
];
for (const { word, stolenFrom, was } of IMPOSTORS) {
  const counted = corpusUses(word, index);
  assert.ok(counted < was,
    `${word} is still counted ${counted} times, which is what it was when the count belonged to `
    + `${stolenFrom || "another word"} rather than to it`);
  const real = literalUses(word);
  assert.ok(counted <= Math.max(6, real * 6),
    `${word} is counted ${counted} times but the course only writes it ${real} times, `
    + "so the count is coming from somewhere other than this word");
  if (stolenFrom) {
    assert.ok(counted < corpusUses(stolenFrom, index),
      `${word} is counted as often as ${stolenFrom}, which is what inheriting its count looks like`);
  }
}

// ── but a word's own forms must still pool ──────────────────────────────────
// Removing the pooling entirely would silence every irregular verb in German:
// the course writes "müssen" 67 times and says it 336, the rest being muss,
// musst and musste. That is the signal the ordering runs on.
for (const [word, atLeast] of [["müssen", 200], ["werden", 200], ["geben", 120], ["wissen", 50],
  ["dürfen", 50], ["die Minute", 40]]) {
  const counted = corpusUses(word, index);
  assert.ok(counted >= atLeast,
    `${word} is only counted ${counted} times — its own forms have stopped pooling, `
    + "which undercounts every word that inflects");
}

// ── and the card has to teach the sense the course uses ─────────────────────
// The face of a card is the first alternative in its gloss, so a word whose
// everyday sense is listed second is taught in its rare sense.
const CARDS = [
  { de: "gar", mustLeadWith: /^at all\b/, notLeadWith: /^cooked|^done\b/,
    because: "all 70 of this course's uses are gar nicht / gar nichts / gar kein" },
  { de: "echt", mustLeadWith: /^really\b/, notLeadWith: /^genuine\b/,
    because: "Echt? on its own is Really?" },
  { de: "kurz", mustLeadWith: /^short\b/, notLeadWith: /^brief\b/,
    because: "brief is the dictionary word; short is the spoken one" },
  { de: "laufen", mustLeadWith: /^to walk\b/, notLeadWith: /^to go\b/,
    because: "to go is gehen's face — two words must not share one English" },
  { de: "erst", mustLeadWith: /^not until\b/, notLeadWith: /^only\b/,
    because: "only on its own is nur" },
  { de: "das Auto", mustLeadWith: /^car\b/, notLeadWith: /^auto\b/,
    because: "auto is not an English word for a car" },
  { de: "rein", mustLeadWith: /^in\b/, notLeadWith: /^pure\b/,
    because: "in speech it is short for herein, the pair to raus, which this course glosses as out" },
  { de: "weit", mustLeadWith: /^far\b/, notLeadWith: /^wide\b/,
    because: "the card's own note already conceded also far" },
  { de: "oben", mustLeadWith: /^up there\b/, notLeadWith: /^above\b/,
    because: "above is über; oben is where a thing is" },
  { de: "das Spiel", mustLeadWith: /^game\b/, notLeadWith: /^match\b/,
    because: "a Spiel is any game — match is only the sporting one" },
  { de: "zuerst", mustLeadWith: /^first\b/, notLeadWith: /^at first\b/,
    because: "at first promises a but afterwards, which zuerst does not" },
  { de: "sicher", mustLeadWith: /^sure\b/, notLeadWith: /^certain\b/,
    because: "Bist du sicher? is Are you sure?" },
  { de: "der Rest", mustLeadWith: /^the rest\b/, notLeadWith: /^remainder\b/,
    because: "remainder is the dictionary word" },
  { de: "die Hälfte", mustLeadWith: /^half\b/, notLeadWith: /^one half\b/,
    because: "nobody says one half" },
];
const sources = ["advancedWordPacks", "b2ExpansionPacks", "basicsWordPacks", "data", "everydayWordPacks",
  "expansionPacks", "frequencyWordPacks", "immersionWordPacks"]
  .map((name) => fs.readFileSync(path.join(root, `src/lib/${name}.ts`), "utf8")).join("\n");

for (const card of CARDS) {
  const found = new RegExp(`\\{ de: "${card.de}", lookup: "[^"]*", fallbackEn: "([^"]*)"`).exec(sources);
  assert.ok(found, `the card for "${card.de}" has gone or changed shape, so this can no longer check it`);
  const face = found[1].split(",")[0].trim();
  assert.ok(card.mustLeadWith.test(face) && !card.notLeadWith.test(face),
    `"${card.de}" shows "${face}" — ${card.because}`);
}

// ── a sentence is scored by its worst word, so no common word may score rare ─
// Two holes did this, and both are silent: an everyday line simply sits a few
// hundred places further back than it should and nothing says why.
{
  const { wordCommonality } = compiled.exports;
  // A stem ending in a cluster takes a linking -e-, so the third person is
  // stem+et. The plain -t rule landed one letter short and produced kosteen.
  for (const [form, lemma] of [["kostet", "kosten"], ["arbeitet", "arbeiten"],
    ["findet", "finden"], ["bietet", "bieten"], ["wartet", "warten"], ["öffnet", "öffnen"]]) {
    const asForm = wordCommonality(form, index);
    const asLemma = wordCommonality(lemma, index);
    assert.ok(asForm <= Math.max(120, asLemma * 1.3),
      `"${form}" scores ${Math.round(asForm)} while "${lemma}" scores ${Math.round(asLemma)} — ` +
      "the -et form is not reaching its verb, and every sentence using it is scored as rare");
  }
  // The matching pin for the bank gap — jetzt, hier, dann and the rest score
  // mid-rare because the bank has never heard of them — is deliberately NOT
  // here: USE_SPOKEN_FALLBACK is off, so the behaviour it would pin does not
  // exist yet. Pinning it now would mean pinning the bug.
}

// ── and a card must not swallow a word that means something else ────────────
// Same-meaning cards are combined on their English, so widening a gloss can
// fold two different words into one. Leading zuerst with a bare "first" put
// it inside erste, which is an ordinal: die erste Zwiebel is the first onion,
// zuerst die Zwiebeln is onions first. The learner would have been shown one
// card for two grammars.
//
// No blanket part-of-speech rule here on purpose — German adjectives work as
// adverbs unchanged, so wirklich/echt and natürlich/selbstverständlich carry
// different labels while being true synonyms, and a rule refusing that would
// be wrong eleven times to be right once.
{
  const catalogue = buildWordCatalog(parts);
  const cardFor = (name) => catalogue.find((word) => (word.lookup || word.de) === name);
  const foldedInto = (name) => catalogue.find((word) =>
    (word.synonyms ?? []).some((syn) => (syn.lookup || syn.de) === name));
  for (const [a, b] of [["zuerst", "erste"], ["erste", "zuerst"]]) {
    const swallowed = foldedInto(a);
    assert.ok(
      cardFor(a) && (!swallowed || (swallowed.lookup || swallowed.de) !== b),
      `"${a}" is taught on the "${b}" card. They are not the same word — one is a sequence ` +
      "adverb and the other an ordinal — so the gloss that merged them needs to be narrower."
    );
  }
}

// ── and no card may weld its usage note into the thing you say ──────────────
// "See you later today!" is not English. The when-it-applies part is a fact
// ABOUT the phrase and belongs in its note, where there is room to say it
// properly.
const WELDED = [
  ["See you later today", "phrasebank"],
  ["Have a good evening after work", "phrasebank"],
  ["Have a good rest of your", "phrasebank"],
  ["almost (NOT fast)", "expansionPacks"],
  ["because (keeps normal word order)", "expansionPacks"],
  ["before (conjunction)", "immersionWordPacks"],
  ["minute (of time)", "immersionWordPacks"],
  ["because (sends the action word to the end)", "expansionPacks"],
  ["German (person)", "frequencyWordPacks"],
  ['fallbackEn: "auto,', "basicsWordPacks"],
];
const everything = sources + fs.readFileSync(path.join(root, "src/lib/phrasebank.ts"), "utf8");
for (const [text] of WELDED) {
  assert.ok(!everything.includes(text),
    `"${text}" is back on the face of a card. That is a note about the word, not the word — `
    + "put it in the use field, where it can be said properly.");
}

console.log(
  "check-true-meanings: no word is counted on another word's back, inflected words still pool "
  + "their own forms, and the front-of-course cards lead with the sense the course uses"
);
// esbuild's service keeps two sockets open after buildSync returns, so the
// event loop never empties and the build would wait for ever on a check that
// finished in a second. Say so rather than letting the loop decide —
// check-matcher-preference and check-matcher end the same way.
process.exit(0);
