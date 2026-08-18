#!/usr/bin/env node
/**
 * Regression coverage for two easy-to-teach-wrong homonyms/false friends:
 * German large-number names use the long scale, and Gericht must not borrow a
 * food example when the standalone card teaches the legal sense.
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
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildWordExampleIndex } from "./src/lib/wordExamples.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "number-sense-clarity-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("number-sense-clarity-check", module);
compiled.filename = path.join(root, ".number-sense-clarity-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildWordCatalog,
  buildWordExampleIndex,
} = compiled.exports;

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const parts = {
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
};
const words = buildWordCatalog(parts);
const byLookup = (lookup) => words.find(
  (word) => String(word.lookup).toLocaleLowerCase("de-DE") === lookup.toLocaleLowerCase("de-DE")
);

// Combined synonym cards (wordSynonymGroups.ts) fold same-meaning words into
// one entry, so the canary counts WORDS TAUGHT — faces plus absorbed
// synonyms. A reviewed-sense regression still moves this number; the fold
// alone cannot.
const taughtWords = words.reduce((count, word) => count + 1 + (word.synonyms?.length ?? 0), 0);
assert.equal(taughtWords, 7237, "the reviewed sense fixes changed the standalone word count");

const million = byLookup("Million");
assert(million, "die Million is missing from the shipped word catalog");
assert.equal(million.en, "million (number)", "die Million lost its disambiguated English gloss");
assert(million.use.includes("1,000,000"), "die Million is missing its numeric anchor");

const bus = byLookup("Bus");
assert(bus, "der Bus is missing from the shipped word catalog");
assert.equal(bus.en, "bus or coach", "the ordinary Bus card was replaced by a game-specific vehicle");
assert(!/battle bus/i.test(bus.en), "the Fortnite Battle Bus leaked into the standalone word answer");

const literature = byLookup("Literatur");
assert(literature, "die Literatur is missing from the shipped word catalog");
assert.equal(literature.en, "literature", "Conversation mode should use the ordinary English word literature");
assert(!/scholarly/i.test(literature.en), "the academic-only Literature gloss leaked into Conversation mode");
assert(/academic literature/i.test(literature.use), "Literatur no longer explains its academic context separately");

const milliard = byLookup("Milliarde");
assert(milliard, "die Milliarde is missing from the shipped word catalog");
assert.equal(milliard.en, "billion", "die Milliarde should require only the English answer billion");
for (const anchor of ["1,000,000", "1,000,000,000", "1,000,000,000,000"]) {
  assert(milliard.use.includes(anchor), `die Milliarde is missing scale anchor ${anchor}`);
}
assert(
  milliard.use.includes("German Billion = English trillion"),
  "die Milliarde does not warn about the German/English Billion false friend"
);

const court = byLookup("Gericht");
assert(court, "das Gericht is missing from the shipped word catalog");
assert.equal(court.en, "court", "the legal Gericht card must not require dish or meal as a second answer");
assert(/food context/i.test(court.use) && /separate meaning/i.test(court.use),
  "the Gericht card does not explain the separate food sense");

const courtExample = buildWordExampleIndex(parts).exampleFor(court);
assert(courtExample, "the legal Gericht card has no reviewed example");
assert(/\bcourt\b/i.test(courtExample.en), `Gericht chose a non-legal example: ${courtExample.en}`);
assert(!/\b(?:dish|dishes|meal|meals)\b/i.test(courtExample.en),
  `Gericht still chose the food example: ${courtExample.en}`);

const numberPack = parts["cb-letters-numbers"];
assert(numberPack, "Letters & Numbers pack is missing");
const phrasePairs = new Map((numberPack.phrases ?? []).map((phrase) => [phrase.de, phrase]));
assert.equal(
  phrasePairs.get("Eine Milliarde entspricht tausend Millionen.")?.en,
  "One billion equals one thousand million.",
  "the billion/Milliarde bridge is missing from the number lesson"
);
assert.equal(
  phrasePairs.get("Eine Billion entspricht tausend Milliarden.")?.en,
  "One trillion equals one thousand billion.",
  "the trillion/Billion bridge is missing from the number lesson"
);

console.log(
  `number and homonym clarity passed: ${words.length} unique word cards; `
  + `Gericht example = ${courtExample.de} / ${courtExample.en}`
);
