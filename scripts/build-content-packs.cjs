#!/usr/bin/env node
/**
 * Split the course into packs that can be installed one at a time.
 *
 * THE PROBLEM. All 21,366 taught entries are TypeScript object literals that
 * compile into one 3.9 MB JavaScript chunk. Everybody downloads all of it: a
 * beginner on lesson 3 gets the B2 expansion packs, and the moment a second
 * language becomes a real course everybody gets that too. Leon: "let people
 * install whichever language they want".
 *
 * THE SHAPE. Content becomes static JSON under public/content, fetched on
 * demand and cached. Two axes, because there are two reasons to not want
 * something:
 *   - LEVEL. You are on A1; you do not need the B2 packs yet.
 *   - LANGUAGE. You read English; you do not need the French translations.
 *
 * WHY NOT SQLITE. The database already generated next door is the right tool
 * for SEARCH and the wrong one for delivery: on the web it means shipping a
 * WASM engine and then downloading all 13 MB before the first query, which is
 * worse than what we have. JSON over HTTP is cached by the browser, works
 * byte-identically in Electron because that loads over http://localhost too,
 * and needs no engine at all. catalogue.db stays for what it is good at.
 *
 * THE PACKS STAY THE SOURCE OF TRUTH. This is a build artefact, like the
 * word-picture artwork and the database. If they ever disagree, the packs win
 * and this gets regenerated.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const OUT = path.join(root, "public", "content");

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
      'export { TRANSLATION_LANGUAGES, TRANSLATION_LANGUAGE_NAMES, translate } from "./src/lib/translations.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "content-packs-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("content-packs", module);
compiled.filename = path.join(root, ".content-packs.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

const resolved = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);
const parts = { ...resolved, ...M.buildBundledParts(), ...M.buildTatoebaParts() };

/**
 * Which level band a part belongs to.
 *
 * Read off the part's own level where it has one, so this follows the course
 * rather than a naming convention that could drift. Anything unlabelled goes
 * in core, which is the safe direction: a learner gets it rather than not.
 */
function bandFor(part) {
  const level = String(part?.level ?? part?.cefr ?? "").toUpperCase();
  if (level.startsWith("A1")) return "a1";
  if (level.startsWith("A2")) return "a2";
  if (level.startsWith("B1")) return "b1";
  if (level.startsWith("B2")) return "b2";
  if (level.startsWith("C")) return "c1";
  return "core";
}

const bands = new Map();
let entryCount = 0;

for (const [partKey, part] of Object.entries(parts)) {
  const band = bandFor(part);
  if (!bands.has(band)) bands.set(band, {});
  const bucket = bands.get(band);
  // Carried whole rather than reshaped: whatever the app reads today it can
  // still read after a round trip through JSON.
  bucket[partKey] = part;
  entryCount += (part.phrases?.length ?? 0) + (part.vocab?.length ?? 0);
}

// ── translation packs, one per language ─────────────────────────────────────
const germanStrings = new Set();
for (const part of Object.values(parts)) {
  for (const item of part.phrases ?? []) if (item?.de) germanStrings.add(String(item.de));
  for (const word of part.vocab ?? []) if (word?.de) germanStrings.add(String(word.de));
}

const languagePacks = [];
for (const language of M.TRANSLATION_LANGUAGES) {
  const table = {};
  for (const german of germanStrings) {
    const value = M.translate(german, language, null);
    if (value) table[german] = value;
  }
  languagePacks.push({ language, table });
}

// ── write ───────────────────────────────────────────────────────────────────
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "level"), { recursive: true });
fs.mkdirSync(path.join(OUT, "language"), { recursive: true });

const manifest = {
  // Bumped when the SHAPE changes, so a cached pack from an older shape is
  // discarded rather than half-understood.
  version: 1,
  generated: "build",
  levels: [],
  languages: [],
};

const write = (file, value) => {
  const json = JSON.stringify(value);
  fs.writeFileSync(file, json);
  return Buffer.byteLength(json);
};

for (const [band, bucket] of [...bands.entries()].sort()) {
  const file = path.join(OUT, "level", `${band}.json`);
  const bytes = write(file, bucket);
  const entries = Object.values(bucket)
    .reduce((sum, part) => sum + (part.phrases?.length ?? 0) + (part.vocab?.length ?? 0), 0);
  manifest.levels.push({
    id: band,
    url: `content/level/${band}.json`,
    parts: Object.keys(bucket).length,
    entries,
    bytes,
  });
}

for (const { language, table } of languagePacks) {
  const file = path.join(OUT, "language", `${language}.json`);
  const bytes = write(file, table);
  manifest.languages.push({
    id: language,
    name: M.TRANSLATION_LANGUAGE_NAMES[language] ?? language,
    url: `content/language/${language}.json`,
    entries: Object.keys(table).length,
    bytes,
  });
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

const mb = (n) => (n / 1048576).toFixed(2) + " MB";
const totalLevel = manifest.levels.reduce((sum, level) => sum + level.bytes, 0);
console.log(
  `content packs: ${entryCount.toLocaleString()} entries in ${manifest.levels.length} level packs `
  + `(${mb(totalLevel)} total, largest ${mb(Math.max(...manifest.levels.map((l) => l.bytes)))}) `
  + `and ${manifest.languages.length} language pack(s)`
);
for (const level of manifest.levels) {
  console.log(`   level/${level.id.padEnd(5)} ${String(level.entries).padStart(6)} entries  ${mb(level.bytes)}`);
}
for (const language of manifest.languages) {
  console.log(`   lang/${language.id.padEnd(6)} ${String(language.entries).padStart(6)} entries  ${mb(language.bytes)}`);
}
