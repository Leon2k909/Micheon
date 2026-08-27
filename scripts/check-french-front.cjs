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
      'export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";',
      'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
      'export { primeTranslations } from "./src/lib/translations.ts";',
      'export { buildCatalog } from "./src/session.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
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
  translate, TRANSLATION_LANGUAGES, TRANSLATION_LANGUAGE_NAMES, buildCatalog,
  buildWordCatalog } = compiled.exports;
// The tables are fetched at runtime so a German-only learner never
// downloads them; here every language is wanted at once, and there is no
// event loop to await one on.
const M = compiled.exports;
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

/**
 * How far in each band reaches, and how much of it must be translated.
 *
 * The bands used to stop at 2,000 because that was as far as the coverage
 * went. The first five thousand are complete now — a real course, not a
 * sampler — so the floor follows, and the bands past it hold the ground
 * that was won rather than the ground that was there.
 */
const BANDS = [
  { upTo: 500, floor: 100 },
  { upTo: 1000, floor: 100 },
  { upTo: 2000, floor: 100 },
  { upTo: 5000, floor: 100 },
  { upTo: 8000, floor: 82 },
  { upTo: 12000, floor: 68 },
  { upTo: 16000, floor: 60 },
];

/**
 * How much of the word tracker the French course is allowed to be missing.
 *
 * Every single word the German course teaches has French, so the two trackers
 * hold the same list. That is not a coincidence to be rediscovered later: a
 * German word added without French silently shrinks the French course, and
 * nothing else in the build would say so.
 *
 * Short of 100 because a word added on one side and translated on the next
 * commit should not stop a release — but a handful, not a category.
 */
const WORD_PARITY_FLOOR = 99;

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
  let complete = 0;
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
    // Report how DEEP the language reaches rather than the first band alone.
    // "100% of the first 500" said the same thing when the five hundredth card
    // was the last one translated and when the five thousandth was.
    if (covered >= 100) complete = band.upTo;
  }
  summary.push(complete
    ? `${name} 100% of the first ${complete.toLocaleString("en-GB")}`
    : `${name} has gaps in its first ${BANDS[0].upTo}`);
}

// The word tracker is its own catalogue — the queue above mixes sentences and
// words, so a word missing its French disappears into a percentage there. The
// tracker lists them one per row, and an untranslated one is a card the French
// course simply does not have.
const germanWords = buildWordCatalog(parts);
const bareWords = germanWords.filter((word) => !translate(String(word.de), "fr", word.fr));
const wordParity = ((germanWords.length - bareWords.length) / germanWords.length) * 100;
assert.ok(wordParity >= WORD_PARITY_FLOOR,
  `the word tracker teaches ${germanWords.length.toLocaleString("en-GB")} German words and `
  + `${wordParity.toFixed(1)}% of them have French — the floor is ${WORD_PARITY_FLOOR}%. `
  + `${bareWords.length} are bare, starting with:\n`
  + bareWords.slice(0, 8).map((word) => `    ${word.de}  (${word.en})`).join("\n")
  + "\n  Add them to FRENCH_BY_GERMAN in src/lib/frenchTranslations.ts. A German word with no "
  + "French is not a gap in a percentage — it is a word the French course does not teach at all.");

/**
 * The same tracker, counted for Polish — and counted, not divided.
 *
 * Polish is a narrowing rather than a parity language: it teaches the cards it
 * has an answer for, and the German course is allowed to run ahead of it. A
 * percentage would therefore punish German for growing, which is the fault
 * check-translation-coverage was moved off percentages to avoid.
 *
 * What must not happen is the other direction: Polish word cards that exist
 * today quietly disappearing because a translation was deleted or a German
 * word reworded out from under its key. So the floor is the number of German
 * word cards that have Polish. Raise it as each block lands; never lower it.
 */
const POLISH_WORD_FLOOR = 7050;
const withPolish = germanWords.filter((word) => translate(String(word.de), "pl", null));
assert.ok(withPolish.length >= POLISH_WORD_FLOOR,
  `${withPolish.length.toLocaleString("en-GB")} of the ${germanWords.length.toLocaleString("en-GB")} `
  + `German word cards have Polish, and the floor is ${POLISH_WORD_FLOOR.toLocaleString("en-GB")} — `
  + `${(POLISH_WORD_FLOOR - withPolish.length).toLocaleString("en-GB")} have gone missing. This is a `
  + "count, so adding German cannot trip it: a card the Polish course used to teach no longer has "
  + "an answer in POLISH_BY_GERMAN.");

console.log(`check-french-front: ${summary.join("; ")} — measured by queue position, `
  + "because that is what decides which cards a learner actually meets. "
  + `Word tracker: ${wordParity.toFixed(1)}% of ${germanWords.length.toLocaleString("en-GB")} words `
  + `have French, ${withPolish.length.toLocaleString("en-GB")} have Polish `
  + `(floor ${POLISH_WORD_FLOOR.toLocaleString("en-GB")})`);
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
