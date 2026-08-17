#!/usr/bin/env node
/**
 * Every example the Words tracker serves must show the card's OWN word, in a
 * case form that word can take. German capitalization separates homographs —
 * the verb card "steuern" must never display "Die Steuern fressen mich auf."
 * (the taxes noun), which is exactly the shipped bug this check pins. Runs
 * against the full real catalog so a content addition cannot quietly pair a
 * card with the other sense again.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildWordExampleIndex, germanTokenCaseForms, acceptableCaseMask, rawLemmaTokens, englishSenseTokens, exampleRequiresSenseOverlap, CASE_CAP_NOMINALIZED } from "./src/lib/wordExamples.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "word-example-senses-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("word-example-senses-check", module);
compiled.filename = path.join(root, ".word-example-senses-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  CASE_CAP_NOMINALIZED,
  acceptableCaseMask,
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildWordCatalog,
  buildWordExampleIndex,
  englishSenseTokens,
  exampleRequiresSenseOverlap,
  germanTokenCaseForms,
  rawLemmaTokens,
} = compiled.exports;

const parts = {
  ...Object.fromEntries(
    Object.entries(allPartBlueprints).map(([key, blueprint]) => [key, buildApiPartFromResolved(blueprint, {})])
  ),
  ...buildBundledParts(),
  ...buildTatoebaParts(),
};

const words = buildWordCatalog(parts);
const index = buildWordExampleIndex(parts);

const overlapOf = (wordEn, exampleEn) => {
  const wanted = englishSenseTokens(wordEn);
  const have = englishSenseTokens(exampleEn);
  let overlap = 0;
  for (const token of wanted) if (have.has(token)) overlap += 1;
  return overlap;
};

const problems = [];
let served = 0;
for (const word of words) {
  const example = index.exampleFor(word);
  if (!example) continue;
  served += 1;
  const label = `${word.de} (${word.en})`;
  const raws = rawLemmaTokens(word);
  const forms = germanTokenCaseForms(example.de);
  const overlap = overlapOf(word.en, example.en);
  for (const raw of raws) {
    const have = forms.get(raw.toLocaleLowerCase("de-DE")) ?? 0;
    if (have === 0) {
      problems.push(`${label}: lemma token "${raw}" missing from example "${example.de}"`);
      continue;
    }
    if ((have & acceptableCaseMask(raw)) !== 0) continue;
    const nominalized = raw === raw.toLocaleLowerCase("de-DE")
      && raw.endsWith("n")
      && (have & CASE_CAP_NOMINALIZED) !== 0
      && overlap > 0;
    if (!nominalized) {
      problems.push(`${label}: "${raw}" appears only in a foreign case form in "${example.de}"`);
    }
  }
  if (exampleRequiresSenseOverlap(word) && overlap === 0) {
    problems.push(`${label}: sense-clash word served zero-overlap example "${example.de}"`);
  }
}

assert.equal(
  problems.length,
  0,
  `wrong-sense or wrong-case examples served:\n  ${problems.slice(0, 20).join("\n  ")}`
);

// The reported card, pinned concretely: the verb steuern must never again
// show the taxes sentence.
const steuern = words.find((word) => word.de === "steuern");
assert(steuern, "the steuern verb card exists");
const steuernExample = index.exampleFor(steuern);
assert.notEqual(
  steuernExample?.de,
  "Die Steuern fressen mich auf.",
  "the steuern verb card is showing the taxes noun sentence again"
);

assert(served > 2500, `example coverage collapsed: only ${served} of ${words.length} words have examples`);
console.log(`word example senses passed (${served}/${words.length} words with case- and sense-checked examples)`);
