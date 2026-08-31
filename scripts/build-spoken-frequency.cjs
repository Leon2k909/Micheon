#!/usr/bin/env node
/**
 * How common is each word in SPOKEN German?
 *
 * The bundled bank is a written-corpus list of 2,500 words, and this course is
 * for holding conversations. That mismatch is not theoretical: the bank ranks
 * "entsprechend" 30th, and does not contain bitte, danke, heute or vielleicht
 * at all. Ordering a speaking course by it puts an office adverb ahead of
 * "please".
 *
 * So this reads a frequency list built from film and television subtitles —
 * dialogue, which is the closest large corpus there is to how people actually
 * talk — and keeps the rank of every word the course teaches. The words it
 * cannot answer for are left out rather than guessed at.
 *
 * SOURCE  hermitdave/FrequencyWords, content/2018/de/de_50k.txt
 *         https://github.com/hermitdave/FrequencyWords  (MIT)
 *         Derived from the OpenSubtitles corpus.
 *
 * Only the ranks of words this course teaches are kept, so what ships is a
 * few thousand numbers rather than the whole list.
 *
 * Run:  node scripts/build-spoken-frequency.cjs path/to/de_50k.txt
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const listPath = process.argv[2];
if (!listPath || !fs.existsSync(listPath)) {
  console.error("usage: node scripts/build-spoken-frequency.cjs <de_50k.txt>");
  console.error("get it from https://github.com/hermitdave/FrequencyWords (MIT)");
  process.exit(1);
}

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.localStorage = global.window.localStorage;

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "spoken-frequency-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("spoken-frequency", module);
compiled.filename = path.join(root, ".spoken-frequency.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  try { parts[key] = M.buildApiPartFromResolved(blueprint, {}); } catch { /* skip malformed */ }
}
const catalog = M.buildWordCatalog(parts);

/** The list is lowercased and carries no articles, so the lookup must match. */
const key = (word) =>
  String(word ?? "").toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").trim();

const spoken = new Map();
for (const [index, line] of fs.readFileSync(listPath, "utf8").split("\n").entries()) {
  const [word] = line.trim().split(/\s+/);
  if (word && !spoken.has(word)) spoken.set(word, index + 1);
}

const ranks = {};
for (const word of catalog) {
  const name = key(word.lookup || word.de);
  const rank = spoken.get(name);
  if (rank !== undefined && ranks[name] === undefined) ranks[name] = rank;
}

const sorted = Object.fromEntries(
  Object.entries(ranks).sort((a, b) => a[1] - b[1])
);
const out = path.join(root, "src/data/spokenFrequency.json");
fs.writeFileSync(out, JSON.stringify(sorted) + "\n", "utf8");

console.log(`read ${spoken.size.toLocaleString("en-GB")} words of subtitle German`);
console.log(`kept ${Object.keys(sorted).length.toLocaleString("en-GB")} of the ${catalog.length.toLocaleString("en-GB")} this course teaches`);
console.log(`wrote ${path.relative(root, out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
