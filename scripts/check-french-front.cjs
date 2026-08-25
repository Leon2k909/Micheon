#!/usr/bin/env node
/**
 * The cards a learner meets FIRST have to exist in their language.
 *
 * Overall coverage is the wrong number to steer by on its own. It read a
 * respectable 33% while 330 of the first 500 items in the queue had no French
 * at all — so a French speaker opening the course met a wall of untranslated
 * German across their first fifty cards, and the headline percentage said
 * nothing was wrong. 21,666 entries means 600 translations move that figure by
 * two points either way.
 *
 * So this measures the only thing that decides what a learner actually sees:
 * position in the queue the app serves. The front is floored at everything,
 * because those are the commonest things in the language and there is no
 * argument for shipping them bare.
 *
 * The queue is built the way the app builds it — blueprint packs merged with
 * the curated phrasebank, filtered for the course — because reading
 * allPartBlueprints alone misses all 65 curated packs, and that is where the
 * greetings live.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";',
      'export { buildListenQueue } from "./src/lib/listenMode.ts";',
      'export { loadGradeStore } from "./src/lib/activity.ts";',
      'export { translate, TRANSLATION_LANGUAGES, TRANSLATION_LANGUAGE_NAMES } from "./src/lib/translations.ts";',
      'export { buildCatalog } from "./src/session.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "french-front-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("french-front-check", module);
compiled.filename = path.join(root, ".french-front-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildBundledParts,
  filterPartsForLearningDirection, buildListenQueue, loadGradeStore,
  translate, TRANSLATION_LANGUAGES, TRANSLATION_LANGUAGE_NAMES, buildCatalog } = compiled.exports;

/** How far in each band reaches, and how much of it must be translated. */
const BANDS = [
  { upTo: 500, floor: 100 },
  { upTo: 1000, floor: 88 },
  { upTo: 2000, floor: 55 },
];

const blueprint = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { blueprint[key] = buildApiPartFromResolved(bp, {}); } catch { /* as the app does */ }
}
const parts = filterPartsForLearningDirection(
  { ...blueprint, ...buildBundledParts("learn-de") }, "learn-de");

const curated = Object.keys(parts).filter((key) => key.startsWith("cb-")).length;
assert.ok(curated > 40,
  `only ${curated} curated packs reached the queue — the phrasebank is not being assembled `
  + "the way the app assembles it, and this check would be measuring the wrong list");

// Inline translations live on the catalogue entry; the tables are keyed by the
// German text. translate() prefers inline, so both have to be offered here or
// a card with a good inline French would read as missing.
const inline = new Map();
for (const item of buildCatalog(parts)) {
  if (item.fr) inline.set(String(item.de), String(item.fr));
}

const queue = buildListenQueue(parts, loadGradeStore(null),
  { contentSource: "mixed", order: "common", direction: "learn-de" });
assert.ok(queue.length > 15000, `the queue did not build (${queue.length} items)`);

const summary = [];
for (const language of TRANSLATION_LANGUAGES) {
  const name = TRANSLATION_LANGUAGE_NAMES[language] ?? language;
  const missingAt = [];
  queue.forEach((item, index) => {
    const de = String(item.de || "");
    if (!de) return;
    if (!translate(de, language, inline.get(de))) missingAt.push({ at: index + 1, de, en: item.en });
  });

  for (const band of BANDS) {
    const inBand = queue.slice(0, band.upTo).filter((item) => item.de).length;
    const missing = missingAt.filter((m) => m.at <= band.upTo);
    const covered = ((inBand - missing.length) / inBand) * 100;
    assert.ok(covered >= band.floor,
      `${name} covers ${covered.toFixed(1)}% of the first ${band.upTo} items a learner meets, `
      + `and the floor is ${band.floor}%. ${missing.length} are bare, starting with:\n`
      + missing.slice(0, 8).map((m) => `    ${m.at}  ${m.de}  (${m.en})`).join("\n")
      + "\n  These are the commonest things in the language — a learner opening the course "
      + "in this language meets them before anything else.");
    if (band.upTo === 500) summary.push(`${name} ${covered.toFixed(0)}% of the first 500`);
  }
}

console.log(`check-french-front: ${summary.join("; ")} — measured by queue position, `
  + "because that is what decides which cards a learner actually meets");
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
