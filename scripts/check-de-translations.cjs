#!/usr/bin/env node
/**
 * The same guard as check-uk-translations, pointing the other way.
 *
 * Leben in Deutschland is written in German and offers English; Life in the UK
 * is written in English and offers German. Both tables are keyed on their
 * course's own source text, and both fail the same silent way: one wrong
 * character — an en dash for a hyphen, a missing full stop, a straight quote
 * where the course has a typographic one — and the lookup misses. The card
 * still renders, the tap still works, and the learner is told there is no
 * translation for a card that was in fact translated.
 *
 * So: every key must correspond to real course text. The reverse is not
 * required — a partly translated course is a legitimate state and the
 * interface says so per card — but the coverage is printed, because a number
 * that quietly falls is the thing worth seeing.
 *
 * It also checks that the picker can actually reach this table: a language
 * whose "from" does not match the course it belongs to would never be offered
 * beside it, and the whole file would sit there unreachable.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents:
      'export { lebenInDeutschlandCourse } from "./src/lib/lebenInDeutschlandCourse.ts";\n' +
      'export { LEBEN_IN_DEUTSCHLAND_EN } from "./src/lib/lebenInDeutschlandTranslationsEn.ts";\n' +
      'export { LEBEN_IN_DEUTSCHLAND_PL } from "./src/lib/lebenInDeutschlandTranslationsPl.ts";\n' +
      'export { LEBEN_IN_DEUTSCHLAND_FR } from "./src/lib/lebenInDeutschlandTranslationsFr.ts";',
    resolveDir: root,
    sourcefile: "de-translations-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("de-translations-check", module);
compiled.filename = path.join(root, ".de-translations-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { lebenInDeutschlandCourse: course, LEBEN_IN_DEUTSCHLAND_EN, LEBEN_IN_DEUTSCHLAND_PL, LEBEN_IN_DEUTSCHLAND_FR } =
  compiled.exports;

// One course, one set of rules, three target languages.
const TABLES = [
  { language: "English", table: LEBEN_IN_DEUTSCHLAND_EN },
  { language: "Polish", table: LEBEN_IN_DEUTSCHLAND_PL },
  { language: "French", table: LEBEN_IN_DEUTSCHLAND_FR },
];

// Every German string the lesson body can offer a translation for. Paragraphs
// and callouts count because they are tappable too — the marker only appears
// where a translation exists, so this is what "everything" means.
const translatable = new Set();
if (course.name) translatable.add(course.name);
if (course.tagline) translatable.add(course.tagline);
for (const lesson of course.lessons ?? []) {
  translatable.add(lesson.title);
  if (lesson.summary) translatable.add(lesson.summary);
  if (lesson.chapter) translatable.add(lesson.chapter);
  if (lesson.section) translatable.add(lesson.section);
  for (const block of lesson.blocks ?? []) {
    if (block.type === "h3" || block.type === "p" || block.type === "callout") translatable.add(block.text);
    if (block.type === "cards") for (const item of block.items ?? []) { translatable.add(item.h4); translatable.add(item.p); }
    if (block.type === "cta") { translatable.add(block.title); translatable.add(block.sub); }
  }
}
translatable.delete(undefined);

const failures = [];

for (const { language, table } of TABLES) {
  const orphans = Object.keys(table).filter((key) => !translatable.has(key));
  if (orphans.length) {
    failures.push(
      `${orphans.length} ${language} key(s) match no card or heading in the course, so they can never be shown:\n`
      + orphans.slice(0, 8).map((key) => `      ${JSON.stringify(key.slice(0, 90))}`).join("\n")
    );
  }
}

// A translation identical to its German is a paste that was never translated
// — unless the German is a name or a list of them. "Konrad Adenauer" is
// "Konrad Adenauer" in English, and a "Name · Name · Name" list is a list of
// proper nouns where demanding a difference would only invite a worse
// translation. Prose is the target.
const looksLikeSentence = (text) => {
  const trimmed = text.trim();
  if (trimmed.includes(" · ")) return false;
  const words = trimmed.split(/\s+/).length;
  return (words > 1 && /[.!?]$/.test(trimmed)) || words > 6;
};
for (const { language, table } of TABLES) {
  const untranslated = Object.entries(table).filter(([key, value]) => key === value && looksLikeSentence(key));
  if (untranslated.length) {
    failures.push(
      `${untranslated.length} ${language} sentence(s) are identical to their German, which is a paste that was never translated: `
      + untranslated.slice(0, 4).map(([key]) => JSON.stringify(key.slice(0, 60))).join(", ")
    );
  }

  const empty = Object.entries(table).filter(([, value]) => !String(value).trim());
  if (empty.length) failures.push(`${empty.length} ${language} entries have an empty translation`);
}

// The names of laws and institutions are the point of sitting the test in
// German. A table that had translated "Grundgesetz" into "Basic Law"
// everywhere would teach the wrong word for the day itself.
const KEEP_GERMAN = ["Grundgesetz", "Bundestag", "Bundesrat", "Bundeskanzler", "Bundespräsident"];
for (const { language, table } of TABLES) {
  for (const term of KEEP_GERMAN) {
    const withTerm = Object.entries(table).filter(([key]) => key.includes(term));
    const dropped = withTerm.filter(([, value]) => !value.includes(term));
    // A handful may legitimately reword; a majority losing the term is the
    // failure worth catching.
    if (withTerm.length >= 4 && dropped.length > withTerm.length / 2) {
      failures.push(
        `"${term}" survives into the ${language} in only ${withTerm.length - dropped.length} of ${withTerm.length} entries — `
        + "the German name is what the test asks for and should stay in the sentence"
      );
    }
  }
}

// ── the picker can reach it ───────────────────────────────────────────────
const lib = fs.readFileSync(path.join(root, "src/lib/courseTranslation.ts"), "utf8");
assert.ok(
  /id: "en"[^}]*from: \[[^\]]*"de"/.test(lib),
  "English must be registered as translating FROM German, or it is never offered beside this course"
);
assert.ok(
  /en: \{[^}]*LEBEN_IN_DEUTSCHLAND_EN/.test(lib),
  "the English table is not registered in TRANSLATIONS, so nothing would ever look it up"
);
assert.ok(
  /id: "pl"[^}]*from: \[[^\]]*"de"/.test(lib),
  "Polish must be registered as translating FROM German, or it is never offered beside this course"
);
assert.ok(
  /pl: \{[^}]*LEBEN_IN_DEUTSCHLAND_PL/.test(lib),
  "the Polish table is not registered in TRANSLATIONS, so nothing would ever look it up"
);
assert.ok(
  /id: "fr"[^}]*from: \[[^\]]*"de"/.test(lib),
  "French must be registered as translating FROM German, or it is never offered beside this course"
);
assert.ok(
  /fr: \{[^}]*LEBEN_IN_DEUTSCHLAND_FR/.test(lib),
  "the French table is not registered in TRANSLATIONS, so nothing would ever look it up"
);
const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
assert.ok(
  !/activePack\.id === "uk" &&/.test(shell),
  "the picker is still hidden behind a UK-only test, so the German course would never show it"
);
assert.ok(
  /translationLanguagesFor\(activePack\.contentLang\)/.test(shell),
  "the picker must filter by the course's own language rather than list every table"
);

if (failures.length) {
  console.error("FAIL check-de-translations");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

const total = translatable.size;
const coverage = TABLES.map(({ language, table }) => {
  const covered = Object.keys(table).length;
  return `${covered} of ${total} have ${language} (${Math.floor((covered / total) * 100)}%)`;
}).join(", ");
console.log(
  `check-de-translations: ${coverage}, every key matches real course text, and the picker offers them beside the German course`
);
