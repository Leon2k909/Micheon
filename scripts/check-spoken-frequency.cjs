#!/usr/bin/env node
/**
 * The spoken frequency list, and the gap it exists to fill.
 *
 * Two signals already order the vocabulary queue: this course's own 10,078
 * conversational sentences, and a written bank of 2,500 words. Between them
 * they leave about 6,500 of the 9,000 words taught with no ordering at all —
 * and that silent tail is where a herb the course mentions once came to lead
 * the garlic, the cucumber and the carrot.
 *
 * This list answers for that tail. It does NOT replace the course's own text,
 * which still leads: our sentences are hand-written for teaching and film
 * dialogue is not, and subtitle German ranks umbringen 861st. It answers only
 * where the course has said nothing, where it is far better than the nothing
 * it replaces.
 *
 * These checks pin the two properties the ordering depends on: that the list
 * is dialogue rather than print, and that it sits behind the course's own
 * voice rather than in front of it.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

let failures = 0;
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures += 1; }
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
      'export { spokenFrequencyRank, hasSpokenRank, SPOKEN_RANK_COUNT } from "./src/lib/spokenFrequency.ts";',
      'export { frequencyRank } from "./src/lib/wordFrequency.ts";',
      'export { buildWordCatalog, rankWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildCorpusIndex } from "./src/lib/corpusFrequency.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "spoken-frequency-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("spoken-frequency-check", module);
compiled.filename = path.join(root, ".spoken-frequency-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

check(`the list loads (${M.SPOKEN_RANK_COUNT.toLocaleString("en-GB")} words)`,
  M.SPOKEN_RANK_COUNT > 5000);

// ── it is dialogue, not print ───────────────────────────────────────────
// If these are not near the front, the file being read is not a spoken corpus.
for (const [word, ceiling] of [
  ["bitte", 200], ["danke", 200], ["vielleicht", 200],
  ["einfach", 300], ["heute", 300], ["morgen", 400], ["kurz", 800],
]) {
  check(`speech leans on "${word}" (rank ${M.spokenFrequencyRank(word)} <= ${ceiling})`,
    M.spokenFrequencyRank(word) <= ceiling);
}

// And the five the written bank has no entry for AT ALL, which is the sharpest
// form of the mismatch: without a spoken list they arrive as "unranked" and
// sort with the rare words. If the bank ever gains one, this pin is testing
// the wrong thing and should be rewritten rather than deleted.
for (const word of ["bitte", "danke", "vielleicht", "heute", "bisschen"]) {
  check(`the written bank still has no entry for "${word}"`,
    !Number.isFinite(M.frequencyRank(word)));
}

// The office German the written bank puts at the front.
for (const [word, floor] of [
  ["entsprechend", 3000], ["Maßnahme", 8000], ["darstellen", 3000], ["Ausbildung", 2000],
]) {
  check(`nobody says "${word}" much (rank ${Math.round(M.spokenFrequencyRank(word))} >= ${floor})`,
    M.spokenFrequencyRank(word) >= floor);
}

// ── the lowercase collision correction ──────────────────────────────────
// The list cannot tell die Macht from "er macht". Where this course's own text
// says the form is mostly not the noun, the rank is pushed back.
const bare = M.spokenFrequencyRank("die Macht");
const damped = M.spokenFrequencyRank("die Macht", { noun: 0, other: 80 });
check(`a pooled noun is pushed back, not taken at face value (${bare} -> ${Math.round(damped)})`,
  damped > bare * 5);
check("and a noun the course really does use as a noun is left alone",
  M.spokenFrequencyRank("das Haus", { noun: 19, other: 0 }) === M.spokenFrequencyRank("das Haus"));
check("the correction is capped rather than unbounded",
  M.spokenFrequencyRank("die Macht", { noun: 0, other: 100000 })
    === M.spokenFrequencyRank("die Macht") * 10);

// ── the shelf that started it ───────────────────────────────────────────
const parts = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  try { parts[key] = M.buildApiPartFromResolved(blueprint, {}); } catch { /* skip */ }
}
const corpus = M.buildCorpusIndex(parts);
const ranked = M.rankWordCatalog(M.buildWordCatalog(parts), corpus);
const a1 = ranked.filter((word) => word.level === "A1");
const placeOf = (german) => a1.findIndex((word) => word.de === german) + 1;

const basil = placeOf("das Basilikum");
const garlic = placeOf("der Knoblauch");
const potato = placeOf("die Kartoffel");
check(`the A1 shelf is still there (${a1.length} A1 words)`, basil > 0 && garlic > 0 && potato > 0);
check(`basil is behind the garlic (${basil} vs ${garlic})`, basil > garlic);
check(`basil is behind the potato (${basil} vs ${potato})`, basil > potato);
check(`basil is in the back half of A1 (${basil} of ${a1.length})`, basil > a1.length / 2);

// The two the list has never heard at all, which is its own kind of answer:
// outside the fifty thousand commonest things anyone says on film.
for (const german of ["die Artischocke", "der Schnittlauch"]) {
  check(`the list has never heard "${german}", and says so`, !M.hasSpokenRank(german));
  check(`  so it sits behind the basil`, placeOf(german) > basil);
}

if (failures) {
  console.error(`\n${failures} spoken-frequency problem${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log(`\ncheck-spoken-frequency: ${M.SPOKEN_RANK_COUNT.toLocaleString("en-GB")} words ranked by how often they are said out loud, and basil is ${basil} of ${a1.length} at A1 rather than 301st.`);
