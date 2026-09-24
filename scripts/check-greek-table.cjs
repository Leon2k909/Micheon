#!/usr/bin/env node
/**
 * The Greek table is Greek, spelled the way Greece spells it.
 *
 * Every rule here is one the table was written to, and each is pinned because
 * a slip against it is invisible on the card and wrong in the lesson — the
 * learner types what they see, and is graded on it:
 *
 *   - GREEK LETTERS. A Latin o, a, e, p or x inside a Greek word looks
 *     identical on screen and matches nothing a learner types on a Greek
 *     keyboard. A whole value in Latin letters is a card that was never
 *     translated. The one exception is a word the German side carries
 *     verbatim — a brand, an abbreviation, or the German word a card is
 *     ABOUT (Müller mit Ü, the answer to "what is fridge in German?").
 *   - MONOTONIC SPELLING. One accent per word, no breathings. A polytonic
 *     character is a different code point from its monotonic twin and would
 *     be marked wrong against what anybody types.
 *   - FINAL SIGMA. ς at the end of a word and σ everywhere else, except
 *     before the apostrophe of an elided word (φτύσ' το).
 *   - THE QUESTION MARK IS ";". A "?" on a Greek card teaches the wrong
 *     punctuation; the Greek question mark, U+037E, normalises to the plain
 *     semicolon and is written as one.
 *   - NOUNS CARRY THEIR ARTICLE. A German noun card keeps its gender in the
 *     article, and Greek gender is no more guessable, so the Greek card
 *     carries ο, η, το, οι or τα.
 *   - ONE ANSWER PER SENTENCE. The course teaches a sentence in the form people
 *     say it (ich hab) and in the exam form (ich habe), and looks the card up
 *     by whichever it is showing. Both spellings are keys; they must hold the
 *     same Greek, or the learner is taught two answers to one sentence
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
      'export { GREEK_BY_GERMAN } from "./src/lib/greekTranslations.ts";',
      'export { toSpokenGerman, toTextedGerman } from "./src/lib/spokenGerman.ts";',
      'export { matchGreekSentence } from "./src/lib/greekTextMatch.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "greek-table-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
global.window = undefined;
const compiled = new Module("greek-table", module);
compiled.filename = path.join(root, ".greek-table.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { GREEK_BY_GERMAN, toSpokenGerman, toTextedGerman, matchGreekSentence } = compiled.exports;

const entries = Object.entries(GREEK_BY_GERMAN);
assert.ok(entries.length > 20000, `only ${entries.length} Greek entries — the table did not load, or it lost most of itself`);

const GREEK = /[Ͱ-Ͽ]/;
const POLYTONIC = /[ἀ-῿]/;
const LATIN_TOKEN = /[A-Za-zÀ-ÖØ-öø-ɏ][A-Za-zÀ-ÖØ-öø-ɏ'’-]*/g;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const inGerman = (token, german) =>
  new RegExp(`(?<![\\p{L}])${escape(token)}(?![\\p{L}])`, "iu").test(german);
// Borrowings Greek writes in Latin letters although the German card does not.
const BORROWED = new Set(["email", "e-mail", "app", "apps", "wifi", "wi-fi", "ok", "online", "offline", "pin", "iban", "sms", "pdf", "usb", "tv", "dj", "pc", "gps", "id", "qr", "sim", "vip"]);

const problems = [];
const fail = (german, value, why) => problems.push(`${why} — ${german} → ${value}`);

for (const [german, raw] of entries) {
  const value = String(raw ?? "");
  if (!value.trim()) { fail(german, value, "empty"); continue; }
  if (value !== value.trim()) fail(german, value, "leading or trailing space");
  if (value !== value.normalize("NFC")) fail(german, value, "not NFC");

  const latin = (value.match(LATIN_TOKEN) || []).map((t) => t.replace(/['’-]+$/, "")).filter(Boolean);
  const foreign = latin.filter((t) => !BORROWED.has(t.toLowerCase()) && !inGerman(t, german));
  if (foreign.length) fail(german, value, `Latin '${foreign[0]}' the German does not carry`);
  if (!GREEK.test(value) && /\p{L}/u.test(german) && !latin.every((t) => inGerman(t, german))) {
    fail(german, value, "no Greek letters");
  }
  for (const word of value.split(/[^\p{L}]+/u)) {
    if (word && GREEK.test(word) && /[A-Za-z]/.test(word)) fail(german, value, `'${word}' mixes Greek and Latin letters`);
  }
  if (POLYTONIC.test(value)) fail(german, value, "polytonic accent");
  if (/σ(?![\p{L}'’])/u.test(value)) fail(german, value, "σ at the end of a word");
  if (/ς(?=\p{L})/u.test(value)) fail(german, value, "ς inside a word");
  if (/[?;]/.test(value)) fail(german, value, "a question mark where Greek writes ;");
  if (/^(der|die|das) [\p{Lu}][\p{L}-]*$/u.test(german) && !/^(ο|η|το|οι|τα) /u.test(value)) {
    fail(german, value, "a noun card without its article");
  }

  for (const variant of new Set([toSpokenGerman(german), toTextedGerman(german), toTextedGerman(toSpokenGerman(german))])) {
    if (!variant || variant === german) continue;
    const other = GREEK_BY_GERMAN[variant];
    if (other !== undefined && other !== value) fail(german, value, `its spoken spelling ${variant} is taught as ${other}`);
  }
}

/**
 * And what a learner may type. Greek is the one course most learners cannot
 * type on the keyboard they own, so the grader takes three things as slips
 * rather than mistakes — a missing accent, a word-final σ, and the word in
 * Latin letters — and must still refuse a different word. Each of these was
 * run against the matcher before it was trusted.
 */
const typed = [
  ["Καλημέρα", "Καλημέρα!", true, false],
  ["καλημερα", "Καλημέρα!", true, true],
  ["ο φιλοσ", "ο φίλος", true, true],
  ["kalimera", "Καλημέρα!", true, true],
  ["efxaristo", "Ευχαριστώ!", true, true],
  ["8elw", "θέλω", true, true],
  ["den 3erw", "Δεν ξέρω.", true, true],
  ["kalispera", "Καλημέρα!", false, false],
  ["to spito", "το σπίτι", false, false],
  ["Μένω στην αθήνα.", "Μένω στην Αθήνα.", false, false],
];
for (const [input, target, ok, note] of typed) {
  const result = matchGreekSentence(input, target);
  if (result.ok !== ok || (ok && Boolean(result.spellingNote) !== note)) {
    problems.push(`typing ${input} against ${target} graded ok=${result.ok} note=${result.spellingNote}, expected ok=${ok} note=${note}`);
  }
}

if (problems.length) {
  console.error("FAIL check-greek-table");
  problems.slice(0, 25).forEach((problem) => console.error("  " + problem));
  if (problems.length > 25) console.error(`  ...and ${problems.length - 25} more`);
  process.exit(1);
}

console.log(
  `check-greek-table: ${entries.length.toLocaleString("en-GB")} Greek entries — Greek letters, monotonic, `
  + "final sigma where it belongs, ; for a question, every noun with its article, "
  + "and one answer for every spelling of one sentence"
);
