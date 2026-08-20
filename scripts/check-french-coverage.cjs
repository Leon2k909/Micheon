#!/usr/bin/env node
/**
 * How much French the course actually has, and whether it is any good.
 *
 * Leon: "18% coverage is bad, lets get this number up". This measures it from
 * both sources — the `fr:` fields written inline in the packs and the map in
 * frenchTranslations.ts — and holds a floor under the number so it can only
 * go up.
 *
 * It also checks the French is French, because a coverage number is easy to
 * inflate with lines nobody would say and a learner cannot tell. But only
 * where a mechanical rule is actually right: the first draft of this check
 * flagged "au Bürgeramt", "la Goethestraße" and "Kölle Alaaf" as untranslated
 * German, when those are exactly what a French speaker in Germany says, and
 * flagged "normal" as untranslated when normal is the French word. Rules that
 * cry wolf get ignored, so those are gone and what remains is narrow.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/lib/frenchTranslations.ts";',
    resolveDir: root,
    sourcefile: "french-entry.ts",
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
const compiled = new Module("french", module);
compiled.filename = path.join(root, ".french.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { FRENCH_BY_GERMAN, resolveFrench } = compiled.exports;

// ── read every taught entry out of the packs ────────────────────────────────
const FIELD = (name) => new RegExp("\\b" + name + ':\\s*"((?:[^"\\\\]|\\\\.)*)"');
const dir = path.join(root, "src/lib");
const entries = [];
for (const file of fs.readdirSync(dir).filter((n) => n.endsWith(".ts"))) {
  const lines = fs.readFileSync(path.join(dir, file), "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    const de = (line.match(FIELD("de")) || [])[1];
    if (!de) return;
    entries.push({
      de,
      en: (line.match(FIELD("en")) || [])[1] || "",
      inline: (line.match(FIELD("fr")) || [])[1] || null,
      file,
      line: index + 1,
    });
  });
}

assert.ok(entries.length > 20000, `only found ${entries.length} taught entries — the scan is broken`);

const translated = entries.filter((entry) => resolveFrench(entry.de, entry.inline));
const percent = (translated.length / entries.length) * 100;

// ── the floor ───────────────────────────────────────────────────────────────
// Raise this as coverage climbs. It exists so a refactor cannot quietly drop
// translations, and so "get the number up" is a number rather than a feeling.
const FLOOR_PERCENT = 26.5;
assert.ok(
  percent >= FLOOR_PERCENT,
  `French coverage fell to ${percent.toFixed(1)}% — the floor is ${FLOOR_PERCENT}%`
);

const inlineCount = entries.filter((entry) => entry.inline).length;
assert.ok(
  inlineCount >= 3868,
  `the packs used to carry 3,868 inline French translations and now carry ${inlineCount}`
);

// ── is it French? ───────────────────────────────────────────────────────────
/**
 * A string that cannot be French, so translating it as itself is a real miss.
 *
 * "The French equals the German" is wrong on its own: normal, important,
 * intelligent, restaurant and hundreds more are spelled identically in both.
 * Only strings carrying something French does not have count — an umlaut, an
 * ß, or a noun ending only German builds.
 */
function cannotBeFrench(word) {
  const bare = word.replace(/^(der|die|das)\s+/i, "");
  if (/[äöüßÄÖÜ]/.test(bare)) return true;
  return /(ung|heit|keit|schaft|chen|lein)$/.test(bare);
}

// A space before ! ? : ; — including the non-breaking forms French typography
// actually uses.
const FRENCH_SPACE = "[\\s\\u00a0\\u202f]";
const BAD_PUNCTUATION = new RegExp("[^" + FRENCH_SPACE.slice(1, -1) + "!?:;]([!?;:])(?:\\s|$)");

const problems = [];
const seen = new Map();
let variants = 0;

for (const entry of translated) {
  const fr = resolveFrench(entry.de, entry.inline);
  const where = `${entry.file}:${entry.line}`;

  if (
    fr.trim().toLocaleLowerCase() === entry.de.trim().toLocaleLowerCase()
    && cannotBeFrench(entry.de)
  ) {
    problems.push(`${where}: "${entry.de}" is left untranslated`);
  }

  if (BAD_PUNCTUATION.test(fr)) {
    problems.push(`${where}: "${fr}" is missing the French space before its punctuation`);
  }

  // NOT CHECKED: German characters inside the French. They are usually right.
  // "au Bürgeramt", "la Goethestraße" and "Kölle Alaaf" are what a French
  // speaker living in Germany says, and the last is not translatable at all.
  //
  // NOT FAILED: the same German rendered two ways. That is normally
  // deliberate — "Auf Wiederhören!" is "Au revoir ! (au téléphone)" in the
  // phone lesson and plain "Au revoir !" elsewhere. Counted instead.
  const previous = seen.get(entry.de);
  if (previous && previous !== fr) variants += 1;
  seen.set(entry.de, fr);
}

for (const [german, french] of Object.entries(FRENCH_BY_GERMAN)) {
  if (!french || !french.trim()) problems.push(`frenchTranslations: "${german}" has an empty translation`);
  if (french === german && cannotBeFrench(german)) {
    problems.push(`frenchTranslations: "${german}" is left untranslated`);
  }
}

if (problems.length) {
  console.error("FAIL check-french-coverage");
  problems.slice(0, 25).forEach((problem) => console.error("  " + problem));
  if (problems.length > 25) console.error(`  ...and ${problems.length - 25} more`);
  process.exit(1);
}

const fromMap = translated.length - inlineCount;
console.log(
  `check-french-coverage: ${translated.length.toLocaleString()} of ${entries.length.toLocaleString()} entries `
  + `have French (${percent.toFixed(1)}%, floor ${FLOOR_PERCENT}%) — `
  + `${inlineCount.toLocaleString()} inline, ${fromMap.toLocaleString()} from frenchTranslations.ts`
  + `, ${variants} context variants`
);
