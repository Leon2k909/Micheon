#!/usr/bin/env node
/**
 * The Albanian table is Albanian, spelled the way Albania spells it.
 *
 * Every rule here is one the table was written to, and each is pinned because
 * a slip against it is invisible on the card and wrong in the lesson — the
 * learner types what they see, and is graded on it:
 *
 *   - THE ALBANIAN ALPHABET. Albanian writes the Latin letters plus ë and ç,
 *     and nothing else: an é, a ü or a Greek letter is a card a learner cannot
 *     type from the alphabet they are learning. The one exception is a word the
 *     German side carries verbatim — a brand, a name, or the German word a card
 *     is ABOUT (Müller mit Ü).
 *   - Ë AND Ç ARE WRITTEN. Typed in a hurry, Albanian drops both — eshte for
 *     është, cfare for çfarë — and a learner copies what the card shows. The
 *     words below are never Albanian without their marks.
 *   - THE PLAIN APOSTROPHE. Contractions (ç'kemi, s'kam, t'i) are written with
 *     ', so the same word is never two spellings on two cards.
 *   - A QUESTION STAYS A QUESTION. A German card that asks ends in ?, and so
 *     does its Albanian.
 *   - NOUNS CARRY THEIR ARTICLE — AS AN ENDING. A German noun card names THE
 *     thing (das Haus), and Albanian says that with the definite ending:
 *     shtëpia, not shtëpi. The definite nominative always ends in a, i, u, t
 *     or të, so an ending in a consonant or in a bare ë is the indefinite form.
 *   - ONE ANSWER PER SENTENCE. The course teaches a sentence in the form people
 *     say it (ich hab) and in the exam form (ich habe), and looks the card up
 *     by whichever it is showing. Both spellings are keys; they must hold the
 *     same Albanian, or the learner is taught two answers to one sentence
 *     depending on a setting.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { ALBANIAN_BY_GERMAN } from "./src/lib/albanianTranslations.ts";',
      'export { toSpokenGerman, toTextedGerman } from "./src/lib/spokenGerman.ts";',
      'export { matchAlbanianSentence } from "./src/lib/albanianTextMatch.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "albanian-table-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
global.window = undefined;
const compiled = new Module("albanian-table", module);
compiled.filename = path.join(root, ".albanian-table.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { ALBANIAN_BY_GERMAN, toSpokenGerman, toTextedGerman, matchAlbanianSentence } = compiled.exports;

const entries = Object.entries(ALBANIAN_BY_GERMAN);
assert.ok(entries.length > 20000, `only ${entries.length} Albanian entries — the table did not load, or it lost most of itself`);

const OTHER_SCRIPT = /[Ͱ-Ͽἀ-῿Ѐ-ӿ]/;
const ALBANIAN_WORD = /^[A-Za-zËëÇç]+$/;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const inGerman = (token, german) =>
  new RegExp(`(?<![\\p{L}])${escape(token)}(?![\\p{L}])`, "iu").test(german);
// Never Albanian without their ë or ç: a keyboard shortcut, not a spelling.
const UNMARKED = [
  "eshte", "jane", "shume", "cfare", "pershendetje", "mire", "ketu", "kete", "keto", "une", "ate",
  "kerkoj", "degjoj", "mbremje", "mengjes", "shtepi", "shtepia", "ceshtje", "cdo", "ckemi", "nje", "per",
  "gjithcka", "dicka", "asgje", "gje", "tjeter", "keshtu", "gjate", "kater", "pese",
  "gjashte", "shtate", "tete", "nente", "dhjete", "vjec", "cmim", "cmimi", "mirembrema", "miremengjes",
  "miredita", "gezuar", "mesoj", "shqiperi", "shqiperia", "femije", "femijet",
];
const UNMARKED_WORD = new RegExp(`(?<![\\p{L}])(${UNMARKED.join("|")})(?![\\p{L}])`, "iu");
// A definite nominative ends in a, i, u, t or të; so does a word the German
// carries over as it is. In a hyphened compound the article sits on the first
// half (dita-urë, the bridge day), or on a borrowed word after its hyphen
// (WiFi-ja).
const DEFINITE = /(?:[aiu]|t|të)$/iu;
const LEADING_PARTICLE = /^(?:i|e|të|së)\s+/iu;
const isDefinite = (head) => DEFINITE.test(head) || DEFINITE.test(head.split("-")[0]);
// Measures Albanian names by what they weigh rather than with a noun of their
// own: das Pfund is gjysmë kile, half a kilo, as the Portuguese is o meio quilo.
const MEASURED = new Set(["das Pfund"]);

const problems = [];
const fail = (german, value, why) => problems.push(`${why} — ${german} → ${value}`);

for (const [german, raw] of entries) {
  const value = String(raw ?? "");
  if (!value.trim()) { fail(german, value, "empty"); continue; }
  if (value !== value.trim()) fail(german, value, "leading or trailing space");
  if (value !== value.normalize("NFC")) fail(german, value, "not NFC");
  if (OTHER_SCRIPT.test(value)) fail(german, value, "Greek or Cyrillic letters");

  for (const token of value.match(/\p{L}+/gu) || []) {
    if (ALBANIAN_WORD.test(token) || inGerman(token, german)) continue;
    fail(german, value, `'${token}' has a letter Albanian does not write`);
    break;
  }
  const unmarked = UNMARKED_WORD.exec(value);
  if (unmarked && !inGerman(unmarked[1], german)) fail(german, value, `'${unmarked[1]}' is written without its ë or ç`);
  if (/’/.test(value) && !/’/.test(german)) fail(german, value, "a curly apostrophe where Albanian writes '");
  if (/\?["“”»«„]?$/.test(german.trim()) && !/\?["“”»«„)]*\s*(?:\p{Extended_Pictographic}\s*)*$/u.test(value)) {
    fail(german, value, "the German asks, the Albanian does not");
  }
  if (/^(der|die|das) [\p{Lu}][\p{L}-]*$/u.test(german) && !MEASURED.has(german)) {
    const head = value.replace(LEADING_PARTICLE, "").split(/\s+/)[0].replace(/[.!,]+$/, "");
    if (!isDefinite(head) && !inGerman(head, german)) fail(german, value, "a noun card not in its definite form");
  }

  for (const variant of new Set([toSpokenGerman(german), toTextedGerman(german), toTextedGerman(toSpokenGerman(german))])) {
    if (!variant || variant === german) continue;
    const other = ALBANIAN_BY_GERMAN[variant];
    if (other !== undefined && other !== value) fail(german, value, `its spoken spelling ${variant} is taught as ${other}`);
  }
}

/**
 * And what a learner may type. A foreign keyboard has no ë and no ç, so the
 * grader takes either left off as a slip rather than a mistake, and must
 * still refuse a different word — the indefinite shtëpi is not the house.
 * Each of these was run against the matcher before it was trusted.
 */
const typed = [
  ["Përshëndetje!", "Përshëndetje!", true, false],
  ["pershendetje", "Përshëndetje!", true, true],
  ["cfare po ben", "Çfarë po bën?", true, true],
  ["ckemi", "Ç'kemi?", true, true],
  ["shtepia", "shtëpia", true, true],
  ["shtepi", "shtëpia", false, false],
  ["Mirëmbrëma!", "Mirëmëngjes!", false, false],
  ["Jetoj në tiranë.", "Jetoj në Tiranë.", false, false],
];
for (const [input, target, ok, note] of typed) {
  const result = matchAlbanianSentence(input, target);
  if (result.ok !== ok || (ok && Boolean(result.spellingNote) !== note)) {
    problems.push(`typing ${input} against ${target} graded ok=${result.ok} note=${result.spellingNote}, expected ok=${ok} note=${note}`);
  }
}

if (problems.length) {
  console.error("FAIL check-albanian-table");
  problems.slice(0, 25).forEach((problem) => console.error("  " + problem));
  if (problems.length > 25) console.error(`  ...and ${problems.length - 25} more`);
  process.exit(1);
}

console.log(
  `check-albanian-table: ${entries.length.toLocaleString("en-GB")} Albanian entries — the Albanian alphabet, `
  + "ë and ç always written, the plain apostrophe, a question for a question, every noun in its "
  + "definite form, and one answer for every spelling of one sentence"
);
