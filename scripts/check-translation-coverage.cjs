#!/usr/bin/env node
/**
 * How much of the course exists in each language, and whether it is any good.
 *
 * This started as a French-only check, written when French coverage sat at
 * 18%. It walks TRANSLATION_LANGUAGES now, so a new
 * language is measured and floored from its first run without this file being
 * edited — which is the point of the table-per-language layer it sits on.
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
 * Per-language floors. Raise as coverage climbs; never lower.
 *
 * A language appears here the moment it has a table, so forgetting to add one
 * is a failure rather than a silent zero.
 */
const FLOORS = {
  fr: 58,
  // Polish reads lower than French and means something different: it is a
  // quarter of the catalogue, but the quarter it covers is the opening
  // stretch of the curriculum in full. What the learner actually meets is
  // floored by check-polish-course, which counts the cards the course serves
  // and requires every one of them to have an answer.
  pl: 25,
};

// This percentage is of EVERYTHING, which is the wrong shape on its own: 600
// translations move 21,666 entries by two points, and two points say nothing
// about whether a learner meets French or German. What the learner meets is
// floored separately, by queue position, in check-french-front.

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
    percent >= floor,
    `${name} coverage fell to ${percent.toFixed(1)}% — the floor is ${floor}%`
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
    + `(${percent.toFixed(1)}%, floor ${floor}%) — ${inlineCount.toLocaleString()} inline, `
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
