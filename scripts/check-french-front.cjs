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
 * position in the queue the app serves. The depth each language reaches is
 * reported by queue position; what fails the build is a COUNT of translated
 * entries — see TRANSLATED_QUEUE_FLOORS below for why it stopped being a
 * percentage of the front.
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
      'export { SPANISH_BY_GERMAN } from "./src/lib/spanishTranslations.ts";',
      'export { ITALIAN_BY_GERMAN } from "./src/lib/italianTranslations.ts";',
      'export { PORTUGUESE_BY_GERMAN } from "./src/lib/portugueseTranslations.ts";',
      'export { RUSSIAN_BY_GERMAN } from "./src/lib/russianTranslations.ts";',
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
// Every language the loop below measures has to be loaded before it is
// measured. Two of them were not, and were scored against an empty table.
M.primeTranslations("es", M.SPANISH_BY_GERMAN);
M.primeTranslations("it", M.ITALIAN_BY_GERMAN);
M.primeTranslations("pt", M.PORTUGUESE_BY_GERMAN);
M.primeTranslations("ru", M.RUSSIAN_BY_GERMAN);

/**
 * The bands REPORT how deep each language reaches; the floor that fails the
 * build is a COUNT of translated queue entries per language, below.
 *
 * The bands used to be the floor, at 100% for the first five thousand. That
 * shape had the fault the other translation floors were already moved off in
 * v1.2.631: the denominator is the German queue, so a block of new German
 * sentences pushed the front percentage down with no translation lost — and
 * the only way back was to translate the new German at once, making German
 * growth conditional on French. Since the courses started DROPPING what their
 * table cannot answer (frenchParts/polishParts), a learner in those courses
 * never meets a bare German card anyway: their front is simply the foremost
 * translated entries, and a new untranslated sentence changes it not at all.
 *
 * What must still fail the build is loss: a translation that existed and is
 * gone. The count catches exactly that — deleting French shrinks it, adding
 * German cannot move it. Raise each floor as coverage grows; never lower it.
 */
const BANDS = [
  { upTo: 500 },
  { upTo: 1000 },
  { upTo: 2000 },
  { upTo: 5000 },
  { upTo: 8000 },
  { upTo: 12000 },
  { upTo: 16000 },
];
// Italian is finished, and its floor now sits beside Spanish rather than under
// it: the two cover the queue identically, so one number holds them both and a
// drop in either reads as the loss it is. The floor lives here rather than only
// in check-translation-coverage because a language with a table and no floor
// here fails the build outright, which is how Italian announced itself on its
// first day.
// Russian is still at zero, because while a table is being written the rule
// that matters is only that its number never falls.
// CAVEAT on every number in this line except French: the inline fallback
// below is built from item.fr alone and handed to EVERY language, so a card
// with an inline French counts as translated for Italian, Portuguese and
// Russian too. Russian measures 4,671 here against roughly 830 catalogue
// entries of its own — the difference is that inflation. Correcting it would
// move Italian and Portuguese below their floors in the same commit, so it
// wants doing deliberately rather than as a side effect.
const TRANSLATED_QUEUE_FLOORS = { fr: 17300, pl: 18700, es: 24000, it: 24000, pt: 4370, ru: 12290 };

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
    // Report how DEEP the language reaches rather than the first band alone.
    // "100% of the first 500" said the same thing when the five hundredth card
    // was the last one translated and when the five thousandth was.
    if (covered >= 100) complete = band.upTo;
  }
  const queueEntries = queue.filter((item) => item.de).length;
  const translatedInQueue = queueEntries - missingAt.length;
  const queueFloor = TRANSLATED_QUEUE_FLOORS[language];
  assert.ok(typeof queueFloor === "number",
    `${name} has a translation table but no queue floor in check-french-front`);
  assert.ok(translatedInQueue >= queueFloor,
    `${name} can translate ${translatedInQueue.toLocaleString("en-GB")} of the ${queueEntries.toLocaleString("en-GB")} `
    + `queue entries, and the floor is ${queueFloor.toLocaleString("en-GB")} — `
    + `${(queueFloor - translatedInQueue).toLocaleString("en-GB")} translations have gone missing. This is a count: `
    + "adding German cannot trip it, so a sentence that was translated no longer is.");
  summary.push((complete
    ? `${name} 100% of the first ${complete.toLocaleString("en-GB")}`
    : `${name} has gaps in its first ${BANDS[0].upTo}`)
    + `, ${translatedInQueue.toLocaleString("en-GB")} translated in the queue (floor ${queueFloor.toLocaleString("en-GB")})`);
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
 *
 * As of this floor the narrowing narrows nothing: all 9,000 have Polish, so
 * the two trackers hold the same list, exactly as French does. The count stays
 * a count anyway. French is a parity language by decision and Polish is not,
 * and the day a German block ships ahead of its Polish the percentage rule
 * would stop the release while this one asks only that nothing was lost.
 */
const POLISH_WORD_FLOOR = 8990;
const withPolish = germanWords.filter((word) => translate(String(word.de), "pl", null));
assert.ok(withPolish.length >= POLISH_WORD_FLOOR,
  `${withPolish.length.toLocaleString("en-GB")} of the ${germanWords.length.toLocaleString("en-GB")} `
  + `German word cards have Polish, and the floor is ${POLISH_WORD_FLOOR.toLocaleString("en-GB")} — `
  + `${(POLISH_WORD_FLOOR - withPolish.length).toLocaleString("en-GB")} have gone missing. This is a `
  + "count, so adding German cannot trip it: a card the Polish course used to teach no longer has "
  + "an answer in POLISH_BY_GERMAN.");

/**
 * And the same again for the languages that were not being counted at all.
 *
 * The two floors above were written when there were two table-backed courses.
 * There are four, and a word card losing its Spanish would have been as
 * invisible as the queue gap above: measured, never loaded, and reported as a
 * number nobody could act on. Same rule as Polish — a count, raised as blocks
 * land, never lowered.
 */
const SPANISH_WORD_FLOOR = 8990;
const withSpanish = germanWords.filter((word) => translate(String(word.de), "es", null));
assert.ok(withSpanish.length >= SPANISH_WORD_FLOOR,
  `${withSpanish.length.toLocaleString("en-GB")} of the ${germanWords.length.toLocaleString("en-GB")} `
  + `German word cards have Spanish, and the floor is ${SPANISH_WORD_FLOOR.toLocaleString("en-GB")} \u2014 `
  + `${(SPANISH_WORD_FLOOR - withSpanish.length).toLocaleString("en-GB")} have gone missing.`);

// The Italian table is finished, so the floor is no longer a moving number:
// every word card the German course teaches has Italian, the same as French and
// Polish, and anything short of all of them is a card that lost its answer.
const ITALIAN_WORD_FLOOR = 9000;
const withItalian = germanWords.filter((word) => translate(String(word.de), "it", null));
assert.ok(withItalian.length >= ITALIAN_WORD_FLOOR,
  `${withItalian.length.toLocaleString("en-GB")} German word cards have Italian, `
  + `and the floor is ${ITALIAN_WORD_FLOOR.toLocaleString("en-GB")}.`);

/**
 * And the two counts that are actually on screen: what each course BUILDS.
 *
 * The floors above ask whether a card has an answer, and that is not the same
 * question. Polish read 9,000 of 9,000 while its tracker showed 8,997, and
 * French sat at 100% parity while teaching 9,454 words against the German
 * 9,715. Both gaps were a level below a card. Several SEEDS share one lemma,
 * only the winner becomes a card, and a losing seed the table cannot answer for
 * is dropped by the narrowing — so a different seed wins the lemma, or a
 * synonym stops folding, and the tracker comes up short with every card it does
 * show fully translated.
 *
 * Two numbers, because they fail differently: CARDS is the list length a
 * learner scrolls, TAUGHT counts the synonyms folded behind those cards, and a
 * lost seed usually moves only the second. Both are counts, for the reason
 * given above — German may run ahead, nothing already written may be lost.
 *
 * Only vocab is narrowed here. buildWordCatalog reads nothing else that
 * frenchPart or polishPart rewrites, and running either over every phrase and
 * dialogue costs minutes rather than half a second.
 */
const BUILT_FLOORS = {
  fr: { cards: 8990, taught: 9700 },
  pl: { cards: 8990, taught: 9700 },
};
const germanTaught = germanWords.reduce((count, word) => count + 1 + (word.synonyms?.length ?? 0), 0);
const builtCounts = {};
for (const [language, floor] of Object.entries(BUILT_FLOORS)) {
  const name = TRANSLATION_LANGUAGE_NAMES[language] ?? language;
  const narrowed = Object.fromEntries(Object.entries(parts).map(([key, part]) => [
    key,
    {
      ...part,
      vocab: (part.vocab ?? []).filter((word) => translate(
        String(word.de ?? ""), language, language === "fr" ? (word.fr ?? null) : null
      )),
    },
  ]));
  const cards = buildWordCatalog(narrowed);
  const taught = cards.reduce((count, word) => count + 1 + (word.synonyms?.length ?? 0), 0);
  builtCounts[language] = { cards: cards.length, taught };
  assert.ok(cards.length >= floor.cards,
    `the ${name} word tracker builds ${cards.length.toLocaleString("en-GB")} cards against the German `
    + `${germanWords.length.toLocaleString("en-GB")}, and the floor is ${floor.cards.toLocaleString("en-GB")}. `
    + "Every card having an answer is not enough: a seed that loses its lemma to another seed still has "
    + "to be in the table, or dropping it moves the fold and the tracker comes up short.");
  assert.ok(taught >= floor.taught,
    `the ${name} course teaches ${taught.toLocaleString("en-GB")} words across those cards and the floor `
    + `is ${floor.taught.toLocaleString("en-GB")}. The cards are still there; what went missing is a word `
    + "folded behind one of them as a synonym, which is a seed with no translation.");
}

console.log(`check-french-front: ${summary.join("; ")} — measured by queue position, `
  + "because that is what decides which cards a learner actually meets. "
  + `Word tracker: ${wordParity.toFixed(1)}% of ${germanWords.length.toLocaleString("en-GB")} words `
  + `have French, ${withPolish.length.toLocaleString("en-GB")} have Polish. `
  + `Built: French ${builtCounts.fr.cards.toLocaleString("en-GB")} cards teaching `
  + `${builtCounts.fr.taught.toLocaleString("en-GB")} words, Polish ${builtCounts.pl.cards.toLocaleString("en-GB")} `
  + `cards teaching ${builtCounts.pl.taught.toLocaleString("en-GB")} — against the German `
  + `${germanWords.length.toLocaleString("en-GB")} and ${germanTaught.toLocaleString("en-GB")}`);
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
