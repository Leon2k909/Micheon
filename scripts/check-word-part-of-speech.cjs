#!/usr/bin/env node
/**
 * The Words tracker exposes learner-facing part-of-speech groups rather than
 * the raw editorial labels. Keep compound labels useful and keep the filter
 * wired into the actual WordsTracker component.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export { wordMatchesPartOfSpeech } from "./src/lib/wordPartOfSpeech.ts";',
    resolveDir: root,
    sourcefile: "word-part-of-speech-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("word-part-of-speech-check", module);
compiled.filename = path.join(root, ".word-part-of-speech-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { wordMatchesPartOfSpeech } = compiled.exports;

const cases = [
  ["noun", "noun", true],
  ["plural noun", "noun", true],
  ["proper noun", "noun", true],
  ["verb", "verb", true],
  ["spoken verb", "verb", true],
  ["verb phrase", "verb", true],
  ["adjective and spoken reply", "adjective", true],
  ["adverb and spoken reply", "adverb", true],
  ["pronoun", "pronoun", true],
  ["preposition", "preposition", true],
  ["conjunction", "connector", true],
  ["connector", "connector", true],
  ["spoken reaction", "interjection", true],
  ["fixed phrase", "phrase", true],
  ["idiom", "phrase", true],
  ["numeral", "number", true],
  ["amount word", "number", true],
  ["noun", "verb", false],
  ["verb phrase", "other", false],
  ["unclassified", "other", true],
  ["", "other", true],
];

for (const [label, filter, expected] of cases) {
  assert.equal(
    wordMatchesPartOfSpeech(label, filter),
    expected,
    `${JSON.stringify(label)} ${filter} match changed`
  );
}

const tracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
assert(tracker.includes("setPartOfSpeech"), "WordsTracker does not expose the part-of-speech state");
assert(tracker.includes("wordMatchesPartOfSpeech(word.pos, partOfSpeech)"), "WordsTracker does not apply the part-of-speech filter");
assert(tracker.includes('ui("Part of speech")'), "WordsTracker is missing the filter label");

console.log("word part-of-speech filtering passed");
