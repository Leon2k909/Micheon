#!/usr/bin/env node
/**
 * How much of the course exists in each language, and whether it is any good.
 *
 * This started as a French-only check, written when French coverage sat at
 * 18%. It walks TRANSLATION_LANGUAGES now, so a new
 * language is measured and floored from its first run without this file being
 * edited — which is the point of the table-per-language layer it sits on.
 *
 * It reports a percentage and floors a COUNT, and the two are different jobs:
 * the percentage says how much of the course a speaker can read, the floor
 * says that no translation already written may be lost. See FLOORS below for
 * why the floor stopped being a percentage.
 *
 * The quality rules are narrow on purpose. The first draft flagged "au
 * Bürgeramt", "la Goethestraße" and "Kölle Alaaf" as untranslated German,
 * when those are exactly what a French speaker in Germany says, and flagged
 * "normal" as untranslated when normal is the French word. Rules that cry
 * wolf get ignored, so those are gone.
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
      'export * from "./src/lib/translations.ts";',
      // Imported here rather than fetched: the tables load on demand in the
      // app so a German-only learner never downloads them, and this measures
      // every language at once with no event loop to await one on.
      'export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";',
      'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
      'export { SPANISH_BY_GERMAN } from "./src/lib/spanishTranslations.ts";',
  'export { ITALIAN_BY_GERMAN } from "./src/lib/italianTranslations.ts";',
      'export { PORTUGUESE_BY_GERMAN } from "./src/lib/portugueseTranslations.ts";',
      'export { RUSSIAN_BY_GERMAN } from "./src/lib/russianTranslations.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "translations-entry.ts",
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
const compiled = new Module("translations", module);
compiled.filename = path.join(root, ".translations.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { TRANSLATION_LANGUAGES, TRANSLATION_LANGUAGE_NAMES, translate, translationTable } = compiled.exports;
// The tables are fetched at runtime so a German-only learner never
// downloads them; here every language is wanted at once, and there is no
// event loop to await one on.
const M = compiled.exports;
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);
M.primeTranslations("es", M.SPANISH_BY_GERMAN);
M.primeTranslations("it", M.ITALIAN_BY_GERMAN);
M.primeTranslations("pt", M.PORTUGUESE_BY_GERMAN);
M.primeTranslations("ru", M.RUSSIAN_BY_GERMAN);

// ── read every taught entry out of the packs ────────────────────────────────
const FIELD = (name) => new RegExp("\\b" + name + ':\\s*"((?:[^"\\\\]|\\\\.)*)"');
const dir = path.join(root, "src/lib");
const entries = [];
for (const file of fs.readdirSync(dir).filter((n) => n.endsWith(".ts"))) {
  const lines = fs.readFileSync(path.join(dir, file), "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    const de = (line.match(FIELD("de")) || [])[1];
    if (!de) return;
    const inline = {};
    for (const language of TRANSLATION_LANGUAGES) {
      inline[language] = (line.match(FIELD(language)) || [])[1] || null;
    }
    entries.push({ de, inline, file, line: index + 1 });
  });
}

assert.ok(entries.length > 20000, `only found ${entries.length} taught entries — the scan is broken`);

/**
 * Per-language floors, counted in ENTRIES rather than per cent. Raise as
 * coverage climbs; never lower.
 *
 * A percentage floor punished the German course for growing. The denominator
 * is every taught entry, so a block of new German words pushed French down a
 * point without a single French translation being lost, and the build went red
 * over work nobody had touched. The only way back was to translate the new
 * German too — which makes adding German conditional on adding French, and
 * that is not the trade this file exists to make.
 *
 * A count says what the floor is actually for: the translations that exist
 * must not disappear. Deleting one fails; adding German does not. The numbers
 * are the current totals less a small margin, so a German string being
 * reworded — which drops its old key out of the table until the new one is
 * written — costs a handful rather than the build.
 *
 * A language appears here the moment it has a table, so forgetting to add one
 * is a failure rather than a silent zero.
 */
const FLOORS = {
  fr: 14800,
  // Polish reads lower than French and means something different: it covers
  // the opening stretch of the curriculum in full rather than a spread of all
  // of it. What the learner actually meets is floored by check-polish-course,
  // which counts the cards the course serves and requires every one of them to
  // have an answer.
  pl: 12700,
  // Spanish is finished, and reads higher than either of the two above it
  // because it is not a narrowing: it covers the catalogue entry for
  // entry. What the learner actually meets is floored by
  // check-spanish-course, which holds it to Polish card by card.
  es: 17000,
  // Italian is finished, and covers the catalogue entry for entry the way
  // Spanish does — the two read the same number to the card. Its floor is set
  // close to that number rather than well under it, because a finished table
  // has no more blocks coming to explain a fall.
  it: 22000,
  pt: 1380,
  // Russian has only just been started and is floored at zero for the same
  // reason Italian is: what matters while a table is being written is that
  // its number never falls. It is the seed a first lesson is built from —
  // see the header of russianTranslations.ts for what it is not.
  ru: 6550,
};

// The percentage is still reported, because it is the honest measure of how
// much of the course a speaker of that language can read. It is the wrong
// thing to FAIL on: 600 translations move 23,000 entries by two points, and
// two points say nothing about whether a learner meets French or German. What
// the learner meets is floored separately, by queue position, in
// check-french-front.

/**
 * A string that cannot be in the target language, so translating it as itself
 * is a real miss.
 *
 * "The translation equals the German" is wrong on its own: normal, important,
 * intelligent, restaurant and hundreds more are spelled identically in French.
 * Only strings carrying something the target does not have count — an umlaut,
 * an ß, or a noun ending only German builds.
 */
function cannotBeTarget(word) {
  const bare = word.replace(/^(der|die|das)\s+/i, "");
  if (/[äöüßÄÖÜ]/.test(bare)) return true;
  return /(ung|heit|keit|schaft|chen|lein)$/.test(bare);
}

// French sets a space before ! ? : and ; — including the non-breaking forms
// its typography actually uses. Only applied to languages that do this.
const SPACES_BEFORE_PUNCTUATION = new Set(["fr"]);
const BAD_PUNCTUATION = /[^\s  !?:;]([!?;:])(?:\s|$)/;

const problems = [];
const summary = [];

for (const language of TRANSLATION_LANGUAGES) {
  const name = TRANSLATION_LANGUAGE_NAMES[language] ?? language;
  const floor = FLOORS[language];
  assert.ok(
    typeof floor === "number",
    `${name} has a translation table but no floor in check-translation-coverage`
  );

  const translated = entries.filter((entry) => translate(entry.de, language, entry.inline[language]));
  const percent = (translated.length / entries.length) * 100;
  const inlineCount = entries.filter((entry) => entry.inline[language]).length;
  const tableCount = Object.keys(translationTable(language)).length;

  assert.ok(
    translated.length >= floor,
    `${name} covers ${translated.length.toLocaleString()} entries and the floor is `
    + `${floor.toLocaleString()} — ${(floor - translated.length).toLocaleString()} translations `
    + "have gone missing. This counts translations, not percentage: adding German "
    + "cannot trip it, so something that was translated no longer is."
  );

  let variants = 0;
  const seen = new Map();
  for (const entry of translated) {
    const value = translate(entry.de, language, entry.inline[language]);
    const where = `${entry.file}:${entry.line}`;

    if (
      value.trim().toLocaleLowerCase() === entry.de.trim().toLocaleLowerCase()
      && cannotBeTarget(entry.de)
    ) {
      problems.push(`[${language}] ${where}: "${entry.de}" is left untranslated`);
    }

    if (SPACES_BEFORE_PUNCTUATION.has(language) && BAD_PUNCTUATION.test(value)) {
      problems.push(`[${language}] ${where}: "${value}" is missing the space before its punctuation`);
    }

    // NOT CHECKED: German characters inside the translation. They are usually
    // right — "au Bürgeramt" and "la Goethestraße" are what a French speaker
    // in Germany says, and "Kölle Alaaf" is not translatable at all.
    //
    // NOT FAILED: the same German rendered two ways. Normally deliberate —
    // "Auf Wiederhören!" is "Au revoir ! (au téléphone)" in the phone lesson
    // and plain "Au revoir !" elsewhere. Counted instead.
    const previous = seen.get(entry.de);
    if (previous && previous !== value) variants += 1;
    seen.set(entry.de, value);
  }

  for (const [german, value] of Object.entries(translationTable(language))) {
    if (!value || !value.trim()) problems.push(`[${language}] "${german}" has an empty translation`);
    if (value === german && cannotBeTarget(german)) {
      problems.push(`[${language}] "${german}" is left untranslated`);
    }
  }

  summary.push(
    `${name}: ${translated.length.toLocaleString()}/${entries.length.toLocaleString()} `
    + `(${percent.toFixed(1)}%, floor ${floor.toLocaleString()} entries) — ${inlineCount.toLocaleString()} inline, `
    + `${tableCount.toLocaleString()} in table, ${variants} context variants`
  );
}

if (problems.length) {
  console.error("FAIL check-translation-coverage");
  problems.slice(0, 25).forEach((problem) => console.error("  " + problem));
  if (problems.length > 25) console.error(`  ...and ${problems.length - 25} more`);
  process.exit(1);
}

console.log("check-translation-coverage:");
summary.forEach((line) => console.log("  " + line));
