#!/usr/bin/env node
/**
 * Rebuild the browser extension's offline glossary from Micheon's authored
 * word catalogue. Keeping this in the repository prevents Immersion from
 * drifting behind Words mode whenever a new pack is added.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const destination = path.join(root, "public", "micheon-immersion-extension", "data", "words.json");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildCatalog } from "./src/session.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "immersion-word-export.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("immersion-word-export", module);
compiled.filename = path.join(root, ".immersion-word-export.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildWordCatalog, buildCatalog } = compiled.exports;
const supplementalWordBank = JSON.parse(
  fs.readFileSync(path.join(root, "src", "lib", "bundledWordBank.json"), "utf8")
);

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try {
    parts[key] = buildApiPartFromResolved(blueprint, {});
  } catch {
    // Match the app's offline fallback: one malformed pack must not erase the
    // rest of the glossary, while the normal content checks report that pack.
  }
}

const idPart = (value) => String(value ?? "")
  .trim()
  .toLocaleLowerCase("de-DE")
  .replace(/[^a-z0-9äöüß]+/gi, "-")
  .replace(/^-+|-+$/g, "") || "word";

/**
 * An example sentence for every word we have one for.
 *
 * The glossary shipped as bare word-to-gloss pairs, which tells you what a
 * word means and nothing about how it is used — and "how is it used" is the
 * whole reason to hover a word on a German page rather than look it up.
 *
 * The sentences come from our own catalogue, not an external corpus. That is
 * deliberate: this content has been through the orthography, punctuation and
 * quality gates, and a wrong example is worse than none because it teaches a
 * construction that is not German. Roughly half the glossary is covered, and
 * the half that is not simply carries no example rather than a doubtful one.
 *
 * Shortest match wins. A hover card has room for one line, and "Das ist mein
 * Haus." teaches das Haus better than a subordinate clause that happens to
 * contain it.
*/
const examplesByWord = new Map();
for (const item of buildCatalog(parts)) {
  const de = String(item.de || "").trim();
  const en = String(item.en || "").split(" / ")[0].trim();
  if (!de || !en || de.length > 90) continue;
  for (const token of de.toLocaleLowerCase("de-DE").split(/[^\p{L}\p{N}ß]+/u)) {
    if (token.length < 2) continue;
    const current = examplesByWord.get(token);
    if (!current || de.length < current.de.length) examplesByWord.set(token, { de, en });
  }
}

/**
 * Tatoeba, for the words our own catalogue cannot illustrate.
 *
 * Built separately by build-tatoeba-examples.cjs, which needs 300 MB of
 * exports, so the result is committed and read from here. Our own sentences
 * always win: they are the ones written for this course. Tatoeba only fills
 * gaps, and every entry it fills is marked so the attribution is honest and
 * so a bad one can be traced back to its sentence id.
 */
const tatoebaPath = path.join(root, "src", "data", "tatoebaExamples.json");
const tatoeba = new Map();
if (fs.existsSync(tatoebaPath)) {
  for (const row of JSON.parse(fs.readFileSync(tatoebaPath, "utf8"))) {
    tatoeba.set(row.w, row);
  }
}

const seen = new Set();
const rows = [];
// Combined synonym cards fold "der Wagen" into "das Auto" for lessons and the
// tracker, but a hover glossary must still explain whichever word the page
// actually used — so every absorbed synonym is flattened back into its own
// entry here.
const catalogWords = buildWordCatalog(parts)
  .flatMap((word) => [word, ...(word.synonyms ?? [])]);
const supplementalWords = supplementalWordBank.map((word) => ({
  lookup: word.lookup || word.de,
  de: word.de,
  en: word.en,
}));
for (const word of [...catalogWords, ...supplementalWords]) {
  const de = String(word.lookup || word.de).trim();
  const key = de.toLocaleLowerCase("de-DE");
  if (!de || seen.has(key)) continue;
  seen.add(key);
  rows.push({
    id: `vw-${idPart(de)}`,
    de,
    deDisplay: String(word.de).trim(),
    // A hover card needs one clean meaning, not an answer-alternative list.
    en: String(word.en).split("/")[0].trim(),
    ...(examplesByWord.has(key)
      ? { ex: examplesByWord.get(key).de, exEn: examplesByWord.get(key).en }
      : tatoeba.has(key)
        ? {
          ex: tatoeba.get(key).ex,
          exEn: tatoeba.get(key).exEn,
          // "t" means Tatoeba. The hover card credits it, and the id makes
          // any complaint traceable to one sentence rather than to a corpus.
          exSrc: "t",
          exId: tatoeba.get(key).id,
        }
        : {}),
  });
}

const serialized = JSON.stringify(rows);
if (fs.existsSync(destination) && fs.readFileSync(destination, "utf8") === serialized) {
  console.log(`Micheon Immersion glossary is current (${rows.length} entries).`);
} else {
  fs.writeFileSync(destination, serialized);
  console.log(`Wrote ${rows.length} Micheon Immersion glossary entries.`);
}
