#!/usr/bin/env node
/**
 * What "Most common first" is allowed to treat as evidence of commonness.
 *
 * Roughly 6,500 of the 9,000 words this course teaches are not in the bundled
 * frequency bank at all — it stops at 2,500 words and never reaches the food,
 * the tools or the garden. For those the course's own sentences are the only
 * evidence there is, and the danger is reading far too much into far too
 * little: a single passing mention is not a frequency.
 *
 * That is not hypothetical. Every one of the 32 words on the vegetable shelf is
 * missing from the bank, so the corpus decided the whole shelf alone. das
 * Basilikum is said once in 10,078 sentences and der Knoblauch, die Gurke and
 * die Karotte not at all, so basil led garlic, cucumber and carrot in a queue
 * that had just promised the commonest thing first — and surfaced 673rd of
 * 26,475 to a learner on their first pass.
 *
 * So the bar is two. Below it a word is not pushed to the back; it simply stops
 * counting as attested and falls in with the words the course never says.
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
      'export { buildWordCatalog, rankWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildCorpusIndex, corpusUses, corpusIgnores } from "./src/lib/corpusFrequency.ts";',
      'export { frequencyRank } from "./src/lib/wordFrequency.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "word-ranking-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("word-ranking-check", module);
compiled.filename = path.join(root, ".word-ranking-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  try { parts[key] = M.buildApiPartFromResolved(blueprint, {}); } catch { /* skip malformed */ }
}

const corpus = M.buildCorpusIndex(parts);
const ranked = M.rankWordCatalog(M.buildWordCatalog(parts), corpus);
const positionOf = new Map(ranked.map((word, index) => [word.id, index + 1]));

check(`the catalogue ranks (${ranked.length.toLocaleString("en-GB")} words)`, ranked.length > 5000);

// ── the bar the ordering is allowed to call evidence ────────────────────
const source = fs.readFileSync(path.join(root, "src/lib/wordSession.ts"), "utf8");
check("the spoken-evidence bar is still two mentions",
  /const SPOKEN_EVIDENCE = 2;/.test(source));
check("and the attested list is still the thing that reads it",
  /\.filter\(\(entry\) => entry\.uses >= SPOKEN_EVIDENCE\)/.test(source));

/**
 * The words the bank cannot speak for, split by whether the course says them.
 *
 * Function words are left out: the corpus index drops them by design, so their
 * count is silence rather than absence and means nothing either way.
 */
const unbanked = ranked.filter((word) => {
  const name = word.lookup || word.de;
  return !Number.isFinite(M.frequencyRank(name)) && !M.corpusIgnores(name);
});
const usesOf = (word) => M.corpusUses(word.lookup || word.de, corpus);
const attested = unbanked.filter((word) => usesOf(word) >= 2);
const thin = unbanked.filter((word) => usesOf(word) <= 1);

check(`both groups are populated (${attested.length} said twice or more, ${thin.length} said once or never)`,
  attested.length > 100 && thin.length > 100);

const lastAttested = Math.max(...attested.map((word) => positionOf.get(word.id)));
const firstThin = Math.min(...thin.map((word) => positionOf.get(word.id)));
const jumpers = thin
  .filter((word) => positionOf.get(word.id) < lastAttested)
  .map((word) => `${word.de} (said ${usesOf(word)}, at ${positionOf.get(word.id)})`);

check("no word said once outranks every word the course says twice or more"
  + (jumpers.length ? ` — ${jumpers.slice(0, 3).join("; ")}` : ""),
  firstThin > lastAttested);

/**
 * The shelf that made the rule necessary, kept as a worked example.
 *
 * Not a claim that basil belongs at any particular number — nothing in the app
 * knows what basil's real frequency is. Only that it must not lead the
 * vegetables a German kitchen actually reaches for.
 */
const shelf = (german) => ranked.find((word) => word.de === german);
const basil = shelf("das Basilikum");
const garlic = shelf("der Knoblauch");
const potato = shelf("die Kartoffel");
check("the vegetable shelf is still in the catalogue", Boolean(basil && garlic && potato));
if (basil && potato) {
  check(`basil sorts behind the potato (${positionOf.get(basil.id)} vs ${positionOf.get(potato.id)})`,
    positionOf.get(basil.id) > positionOf.get(potato.id));
}

if (failures) {
  console.error(`\n${failures} word-ranking problem${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log(`\ncheck-word-ranking: one mention is not a frequency — ${thin.length.toLocaleString("en-GB")} thinly-attested words wait behind the ${attested.length.toLocaleString("en-GB")} the course really says.`);
