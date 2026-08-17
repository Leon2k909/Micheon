#!/usr/bin/env node
/**
 * The Words tracker shows each word inside one reviewed course sentence so
 * learners see WHEN a word is used, not just what it maps to. Keep the index
 * honest: authored vocab examples win, whole-token phrase matches back them
 * up, and a word with no reviewed sentence shows nothing — never a fabricated
 * carrier sentence and never the bare word quoted at itself.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export { buildWordExampleIndex } from "./src/lib/wordExamples.ts";',
    resolveDir: root,
    sourcefile: "word-examples-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("word-examples-check", module);
compiled.filename = path.join(root, ".word-examples-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { buildWordExampleIndex } = compiled.exports;

const parts = {
  "unit-1": {
    theme: "Test unit",
    level: "A1",
    vocab: [
      // Authored example — must win even though a phrase below also shows the word.
      { de: "das Haus", en: "house", lookup: "Haus", pos: "noun", example: "Das Haus ist sehr alt.", exampleEn: "The house is very old." },
      // No authored example — served by the reviewed phrase containing the lemma.
      { de: "der Hund", en: "dog", lookup: "Hund", pos: "noun" },
      // Appears in no sentence — must show nothing rather than fabricate.
      { de: "die Katze", en: "cat", lookup: "Katze", pos: "noun" },
      // Only a one-word phrase exists — a word quoted at itself is no example.
      { de: "genau", en: "exactly", lookup: "genau", pos: "adverb" },
      // Idiom lemma with a placeholder slot-word.
      { de: "an etwas liegen", en: "to be due to something", lookup: "an etwas liegen", pos: "verb phrase" },
      // Same German spelling, two unrelated meanings. The English gloss must
      // choose the matching reviewed sentence, irrespective of cache order.
      { de: "das Gericht", en: "court", lookup: "Gericht", pos: "noun" },
    ],
    phrases: [
      { de: "Das Haus ist groß.", en: "The house is big." },
      { de: "Mein Hund schläft gern.", en: "My dog likes to sleep." },
      { de: "Genau!", en: "Exactly!" },
      { de: "Das kann an dem Wetter liegen.", en: "That may be due to the weather." },
      { de: "Ein Gericht fehlt.", en: "A dish is missing." },
      { de: "Wir gehen vor Gericht.", en: "We are going to court." },
    ],
    dialogues: [],
  },
};

const index = buildWordExampleIndex(parts);
const example = (de, en, lookup) => index.exampleFor({ de, en, lookup });

// 1. The word's own hand-written example always wins.
assert.deepEqual(
  example("das Haus", "house", "Haus"),
  { de: "Das Haus ist sehr alt.", en: "The house is very old." },
  "authored vocab example must beat phrase matches"
);

// 2. Whole-token phrase fallback keeps the German/English pairing intact.
assert.deepEqual(
  example("der Hund", "dog", "Hund"),
  { de: "Mein Hund schläft gern.", en: "My dog likes to sleep." },
  "phrase fallback lost the reviewed sentence pair"
);

// 3. No reviewed sentence means no example — nothing is fabricated.
assert.equal(example("die Katze", "cat", "Katze"), undefined, "unmatched word must have no example");

// 4. A one-word phrase adds no context and must not serve as an example.
assert.equal(example("genau", "exactly", "genau"), undefined, "the bare word quoted at itself is not an example");

// 5. Idiom lemmas match through their content tokens; placeholder slot-words
//    ("etwas") must not be required verbatim.
assert.deepEqual(
  example("an etwas liegen", "to be due to something", "an etwas liegen"),
  { de: "Das kann an dem Wetter liegen.", en: "That may be due to the weather." },
  "placeholder tokens must not block idiom examples"
);

// 6. Inflected forms are not chased — exact tokens only.
assert.equal(
  example("das Fenster", "window", "Fenster"),
  undefined,
  "a lemma absent from every sentence must stay example-free"
);

// 7. Homonyms use the sentence for the requested English meaning. The second
//    lookup also proves the cache is keyed by sense, not German spelling alone.
assert.deepEqual(
  example("das Gericht", "court", "Gericht"),
  { de: "Wir gehen vor Gericht.", en: "We are going to court." },
  "legal Gericht must not receive the food example"
);
assert.deepEqual(
  example("das Gericht", "dish", "Gericht"),
  { de: "Ein Gericht fehlt.", en: "A dish is missing." },
  "food Gericht must not reuse the cached legal example"
);

// 8. The tracker actually renders the index.
const tracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
assert(tracker.includes("buildWordExampleIndex"), "WordsTracker does not build the example index");
assert(tracker.includes("exampleIndex.exampleFor(word)"), "WordsTracker does not look up per-word examples");
assert(tracker.includes('ui("Example in context")'), "WordsTracker is missing the translated example label");

// 9. The label is translated.
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
assert(i18n.includes('"Example in context": "Beispiel im Kontext"'), "missing German translation for the example label");

console.log("word context examples passed");
