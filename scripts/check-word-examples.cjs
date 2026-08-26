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
      // Verb whose spelling doubles as a noun: German case decides.
      { de: "steuern", en: "to control", lookup: "steuern", pos: "verb" },
      // Noun card must not accept the lowercase verb.
      { de: "der Braten", en: "roast", lookup: "Braten", pos: "noun" },
      // Nominalized infinitive after a neuter trigger, senses agreeing.
      { de: "entkalken", en: "to descale", lookup: "entkalken", pos: "verb" },
      // Trigger matches but the English sense does not — must stay empty.
      { de: "stillen", en: "to breastfeed", lookup: "stillen", pos: "verb" },
      // The lookup key ships with unreviewed casing; word.de is authoritative.
      { de: "aufwärmen", en: "to warm up", lookup: "Aufwärmen", pos: "verb" },
      // Reviewed same-case sense clash: zero-overlap sentences must not serve.
      { de: "der Hammer", en: "hammer, mallet", lookup: "Hammer", pos: "noun" },
      // Idiom with an embedded article: a real usage may use another
      // determiner, so the article must not be required verbatim.
      { de: "den Erwartungen gerecht werden", en: "to live up to expectations", lookup: "gerecht werden", pos: "verb phrase" },
    ],
    phrases: [
      { de: "Das Haus ist groß.", en: "The house is big." },
      { de: "Mein Hund schläft gern.", en: "My dog likes to sleep." },
      { de: "Genau!", en: "Exactly!" },
      { de: "Das kann an dem Wetter liegen.", en: "That may be due to the weather." },
      { de: "Ein Gericht fehlt.", en: "A dish is missing." },
      { de: "Wir gehen vor Gericht.", en: "We are going to court." },
      { de: "Die Steuern fressen mich auf.", en: "Taxes are eating me alive." },
      { de: "Niemand kann alles steuern.", en: "Nobody can control everything." },
      { de: "Sonntags braten wir Kartoffeln.", en: "On Sundays we fry potatoes." },
      { de: "Zum Entkalken nimmst du Essig.", en: "For descaling you use vinegar." },
      { de: "Aus dem Stillen von damals wurde der Lustigste im Raum.", en: "The quiet one from back then became the funniest in the room." },
      { de: "Ich muss mich erst aufwärmen.", en: "I need to warm up first." },
      { de: "Das ist der Hammer!", en: "That's amazing!" },
      { de: "Ich kann ihren Erwartungen nie gerecht werden.", en: "I can never live up to her expectations." },
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

// 8. German capitalization separates homographs. The verb card must use the
//    lowercase-verb sentence, never the mid-sentence capital (the noun).
assert.deepEqual(
  example("steuern", "to control", "steuern"),
  { de: "Niemand kann alles steuern.", en: "Nobody can control everything." },
  "the verb steuern must use the verb sentence, not the taxes noun"
);

// 9. The noun card equally must not accept a lowercase verb occurrence.
assert.equal(
  example("der Braten", "roast", "Braten"),
  undefined,
  "the noun Braten must not be served by the lowercase verb braten"
);

// 10. A nominalized infinitive after a neuter trigger serves its verb when
//     the English senses agree ("Zum Entkalken" → to descale) …
assert.deepEqual(
  example("entkalken", "to descale", "entkalken"),
  { de: "Zum Entkalken nimmst du Essig.", en: "For descaling you use vinegar." },
  "the nominalization Zum Entkalken must serve the verb entkalken"
);

// 11. … but not when they disagree: "Aus dem Stillen" is the quiet one, not
//     breastfeeding — the trigger alone must not be enough.
assert.equal(
  example("stillen", "to breastfeed", "stillen"),
  undefined,
  "a trigger-matching nominalization with a foreign sense must not serve"
);

// 12. The display form's casing is authoritative — a capitalized lookup key
//     must not stop the lowercase verb from matching its verb sentence.
assert.deepEqual(
  example("aufwärmen", "to warm up", "Aufwärmen"),
  { de: "Ich muss mich erst aufwärmen.", en: "I need to warm up first." },
  "unreviewed lookup casing must not override the display form"
);

// 13. Reviewed sense-clash words refuse zero-overlap sentences: the idiom
//     "Das ist der Hammer!" is not an example of the tool.
assert.equal(
  example("der Hammer", "hammer, mallet", "Hammer"),
  undefined,
  "the amazement idiom must not serve the tool card"
);

// 14. Articles inside idiom lemmas are structural: "ihren Erwartungen" still
//     satisfies "den Erwartungen gerecht werden".
assert.deepEqual(
  example("den Erwartungen gerecht werden", "to live up to expectations", "gerecht werden"),
  { de: "Ich kann ihren Erwartungen nie gerecht werden.", en: "I can never live up to her expectations." },
  "an embedded article must not be required verbatim"
);

// 15. The tracker actually renders the index.
const tracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
assert(tracker.includes("buildWordExampleIndex"), "WordsTracker does not build the example index");
assert(tracker.includes("exampleIndex.exampleFor(word)"), "WordsTracker does not look up per-word examples");
assert(tracker.includes('ui("Example in context")'), "WordsTracker is missing the translated example label");

// 9. The label is translated.
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + fs.readFileSync(path.join(root, "src/lib/i18nDe.ts"), "utf8");
assert(i18n.includes('"Example in context": "Beispiel im Kontext"'), "missing German translation for the example label");

console.log("word context examples passed");
