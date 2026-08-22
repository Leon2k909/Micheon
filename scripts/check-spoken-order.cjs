#!/usr/bin/env node
/**
 * Conversation mode has to order by what people SAY.
 *
 * The bundled frequency bank is ranked from WRITTEN German — news and web
 * prose — and over the 2,212 words both signals can speak about, its order
 * agrees with conversational use at Spearman 0.51. Half right is not right:
 * it put der Bereich at 34, die Maßnahme at 186 and politisch at 207, while
 * morgen waited at 1,502 and echt at 474.
 *
 * The rule that used to guard this could not have caught any of that. It
 * pushed a word back only when the course used it EXACTLY zero times, so one
 * mention exempted it, and it had no way to bring a spoken word forward at
 * all. What is asserted here is the shape that can do both.
 *
 * Exam mode is deliberately untouched: for a written exam, written frequency
 * is the right answer.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildWordCatalog, rankWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildCorpusIndex, corpusUses, corpusIgnores } from "./src/lib/corpusFrequency.ts";',
      'export { frequencyRank } from "./src/lib/wordFrequency.ts";',
      'export { germanVerbLemma, GERMAN_VERB_FORM_COUNT, GERMAN_VERB_FORMS } from "./src/lib/germanVerbForms.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "spoken-order-entry.ts",
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

const compiled = new Module("spoken-order-check", module);
compiled.filename = path.join(root, ".spoken-order-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints, buildApiPartFromResolved, buildWordCatalog, rankWordCatalog,
  buildCorpusIndex, corpusUses, corpusIgnores, frequencyRank,
  germanVerbLemma, GERMAN_VERB_FORM_COUNT,
} = compiled.exports;

// ── the verb table the count depends on ─────────────────────────────────────
// Without it "ist" is not "sein" and the corpus undercounts the commonest
// verbs in the language by orders of magnitude, which makes every number
// below meaningless.
assert.ok(GERMAN_VERB_FORM_COUNT > 450, `only ${GERMAN_VERB_FORM_COUNT} verb forms written down`);
for (const [form, lemma] of [
  ["ist", "sein"], ["war", "sein"], ["hat", "haben"], ["wird", "werden"],
  ["gibt", "geben"], ["gefunden", "finden"], ["gegangen", "gehen"], ["nimmt", "nehmen"],
]) {
  assert.strictEqual(germanVerbLemma(form), lemma, `"${form}" does not count towards ${lemma}`);
}
assert.strictEqual(germanVerbLemma("Haus"), null, "the table is guessing at words it does not hold");

// The Immersion extension is a standalone content script and cannot import
// this module, so it carries its own copy of the same forms. Two hand-written
// copies of a hundred and forty-five verbs drift; this is what stops them.
{
  const fs = require("fs");
  const gloss = fs.readFileSync(
    path.join(root, "public/micheon-immersion-extension/src/content-gloss.js"), "utf8");
  const strongTable = gloss.slice(
    gloss.indexOf("const STRONG_VERB_FORMS"), gloss.indexOf("const STRONG_FORM_TO_LEMMA"));
  const extensionForms = new Map();
  for (const [, lemma, forms] of strongTable.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    for (const form of forms.split(" ")) extensionForms.set(form, lemma);
  }
  // Its closed classes — sein, haben, the modals — live in the alias map next
  // door rather than in the table, because that map came first.
  const aliasBlock = gloss.slice(
    gloss.indexOf("const OBSERVED_FORM_TO_LEMMA"), gloss.indexOf("const STRONG_VERB_FORMS"));
  for (const [, form, lemma] of aliasBlock.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    if (!extensionForms.has(form)) extensionForms.set(form, lemma);
  }

  const { GERMAN_VERB_FORMS } = compiled.exports;
  const drifted = [];
  for (const [lemma, forms] of Object.entries(GERMAN_VERB_FORMS)) {
    for (const form of forms.split(" ")) {
      const theirs = extensionForms.get(form);
      if (theirs && theirs !== lemma) drifted.push(`${form}: here ${lemma}, extension ${theirs}`);
    }
  }
  assert.deepStrictEqual(drifted, [],
    `the extension's verb table disagrees with src/lib/germanVerbForms.ts: ${drifted.join("; ")}`);
}

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}
const index = buildCorpusIndex(parts);
const catalog = buildWordCatalog(parts).filter((word) => word.listenSafe !== false);
assert.ok(catalog.length > 5000, `only ${catalog.length} words in the catalogue`);

// ── a noun is not its verb ──────────────────────────────────────────────────
// German capitalises its nouns, which is the only thing separating die Macht
// from "er macht". Pooling them credited the noun with 148 uses and would have
// carried it into the first twenty words of the course.
assert.ok(corpusUses("die Macht", index) < 40,
  `die Macht is credited with ${corpusUses("die Macht", index)} uses, which is "er macht" being counted as the noun`);
assert.ok(corpusUses("machen", index) > 100, "machen lost its own count to the noun split");

const conversation = rankWordCatalog(catalog, index, "conversation");
const exam = rankWordCatalog(catalog, index, "exam");
const talk = new Map(conversation.map((word, i) => [word.de, i + 1]));
const write = new Map(exam.map((word, i) => [word.de, i + 1]));

// ── the headline: the first 500 must be words people actually say ───────────
const thin = (list) => list.slice(0, 500)
  .filter((word) => !corpusIgnores(word.lookup || word.de)
    && corpusUses(word.lookup || word.de, index) <= 1).length;
const spokenThin = thin(conversation);
const writtenThin = thin(exam);
assert.ok(spokenThin < 60,
  `${spokenThin} of the first 500 conversation words are used at most once in the course's own speech`);
assert.ok(spokenThin < writtenThin / 2,
  `conversation order (${spokenThin}) is no better than the written one (${writtenThin})`);

// ── words the written bank over-rates for speech must fall back ─────────────
for (const de of ["der Bereich", "die Maßnahme", "politisch", "das Mitglied", "die Veranstaltung"]) {
  const before = write.get(de);
  const after = talk.get(de);
  assert.ok(before && after, `${de} is no longer taught, so this pin needs rewriting`);
  assert.ok(after > before * 1.5,
    `${de} sits at ${after} for conversation against ${before} for the exam — barely moved`);
}

// ── and words people say must come forward ──────────────────────────────────
for (const de of ["morgen", "echt", "gleich", "kurz", "einfach", "die Minute"]) {
  const before = write.get(de);
  const after = talk.get(de);
  assert.ok(before && after, `${de} is no longer taught, so this pin needs rewriting`);
  assert.ok(after < before * 0.75,
    `${de} sits at ${after} for conversation against ${before} for the exam — it should have come forward`);
}
assert.ok(talk.get("morgen") < 300,
  `"tomorrow" is at ${talk.get("morgen")} in a course for having conversations`);

// ── but the basics must not be disturbed ────────────────────────────────────
for (const de of ["sein", "haben", "machen", "gut", "gehen"]) {
  assert.ok(talk.get(de) <= 25, `${de} fell to ${talk.get(de)}; the commonest words must stay first`);
}

// ── exam mode keeps the written order ───────────────────────────────────────
const writtenFirst = exam.slice(0, 8).map((word) => frequencyRank(word.lookup || word.de));
assert.deepStrictEqual([...writtenFirst].sort((a, b) => a - b), writtenFirst,
  "exam mode no longer serves the written frequency bank in its own order");

// ── one gloss, one sense ────────────────────────────────────────────────────
// "to talk / speak / to speak" is one sense written twice: the merge compared
// whole strings, so the infinitive marker hid the repeat, and the two sources
// separate their senses differently — packs with a slash, the bank with a comma.
const repeated = catalog.filter((word) => {
  const senses = String(word.en).split(/\s*[/,;]\s*/)
    .map((sense) => sense.trim().toLowerCase().replace(/^(to|a|an|the)\s+/, ""))
    .filter(Boolean);
  return new Set(senses).size !== senses.length;
});
assert.ok(repeated.length <= 7,
  `${repeated.length} glosses say the same thing twice: ${repeated.slice(0, 6).map((w) => `${w.de} "${w.en}"`).join(", ")}`);

// ── and one card that read as a textbook rather than as English ─────────────
const gemeinde = catalog.find((word) => word.de === "die Gemeinde");
assert.ok(gemeinde && !/municipality/i.test(gemeinde.en),
  `die Gemeinde leads with "${gemeinde && gemeinde.en}" — municipality is not a word English speakers say`);

console.log(
  `check-spoken-order: conversation puts ${spokenThin} barely-spoken words in its first 500 `
  + `against ${writtenThin} for the exam order; morgen ${write.get("morgen")} -> ${talk.get("morgen")}, `
  + `der Bereich ${write.get("der Bereich")} -> ${talk.get("der Bereich")}`
);
