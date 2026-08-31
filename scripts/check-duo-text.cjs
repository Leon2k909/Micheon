#!/usr/bin/env node
/**
 * The quick path shows whole sentences.
 *
 * A wrong answer turned up within a minute of the mode shipping, and it was
 * not one bad entry — one question in five was showing a fragment.
 *
 * germanMeaningAlternatives splits on comma, because a vocabulary gloss like
 * "to learn, to study" really is two ways of saying one thing. Run over a
 * SENTENCE the same split is catastrophic, because German puts a comma before
 * every subordinate clause. It truncated 3,458 German entries and 2,256
 * English ones:
 *
 *     "Nein, danke."                        ->  "Nein"
 *     "Entschuldigung, wo ist der Bahnhof?" ->  "Entschuldigung"
 *     "Ich möchte einen Kaffee, bitte."     ->  "Ich möchte einen Kaffee"
 *
 * displayMeaning splits on an explicit " / " and nothing else. Matching keeps
 * the comma-aware split on purpose — accepting "Nein" for "Nein, danke." is
 * generous to a learner rather than wrong.
 */
const assert = require("assert");
const fs = require("fs");
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
      'export { buildCatalog } from "./src/session.ts";',
      'export { displayMeaning, primaryGermanMeaning, matchGermanMeaning } from "./src/lib/germanTextMatch.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "duo-text-entry.ts",
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
const compiled = new Module("duo-text", module);
compiled.filename = path.join(root, ".duo-text.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

// ── the behaviour, on the sentences that broke ──────────────────────────────
for (const [full, why] of [
  ["Nein, danke.", "a two-word reply must not become one word"],
  ["Entschuldigung, wo ist der Bahnhof?", "the question must survive its own comma"],
  ["Ich möchte einen Kaffee, bitte.", "politeness is part of the sentence"],
  ["Ich glaube, das stimmt.", "a subordinate clause is not an alternative reading"],
]) {
  assert.strictEqual(M.displayMeaning(full), full, `${why} — got "${M.displayMeaning(full)}"`);
}

// A slash IS an author saying "either of these", and the first is what shows.
assert.strictEqual(M.displayMeaning("I'll call you tomorrow. / I'll give you a ring."), "I'll call you tomorrow.");
assert.strictEqual(M.displayMeaning("  spaced  "), "spaced");
assert.strictEqual(M.displayMeaning(""), "");

// Matching stays lenient on purpose: the split that is wrong for display is
// right for accepting what a learner types.
assert.notStrictEqual(
  M.primaryGermanMeaning("Nein, danke."),
  "Nein, danke.",
  "the comma-aware split should still exist for matching"
);

// ── nothing in the catalogue is truncated any more ──────────────────────────
const resolved = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);
const catalog = M.buildCatalog({ ...resolved, ...M.buildBundledParts(), ...M.buildTatoebaParts() });

let truncated = 0;
const samples = [];
for (const item of catalog) {
  for (const value of [String(item.de || "").trim(), String(item.en || "").trim()]) {
    if (!value || value.includes(" / ")) continue;
    if (M.displayMeaning(value) !== value) {
      truncated += 1;
      if (samples.length < 5) samples.push(value + "  ->  " + M.displayMeaning(value));
    }
  }
}
assert.strictEqual(
  truncated,
  0,
  `${truncated} catalogue entries are still shown truncated:\n    ${samples.join("\n    ")}`
);

console.log(
  `check-duo-text: ${catalog.length.toLocaleString()} catalogue entries, none shown truncated; `
  + "display splits on an explicit slash only, matching keeps its comma leniency"
);
