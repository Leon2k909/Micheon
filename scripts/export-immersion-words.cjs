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
const { allPartBlueprints, buildApiPartFromResolved, buildWordCatalog } = compiled.exports;
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
  });
}

const serialized = JSON.stringify(rows);
if (fs.existsSync(destination) && fs.readFileSync(destination, "utf8") === serialized) {
  console.log(`Micheon Immersion glossary is current (${rows.length} entries).`);
} else {
  fs.writeFileSync(destination, serialized);
  console.log(`Wrote ${rows.length} Micheon Immersion glossary entries.`);
}
