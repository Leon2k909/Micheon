#!/usr/bin/env node
/**
 * A translation key that matches nothing is invisible.
 *
 * The card translations are keyed on the English source text, copied by hand
 * out of the course. One wrong character — a hyphen instead of an en dash, a
 * missing full stop — and the lookup silently misses. The card still renders,
 * the tap still works, and the learner is told there is no translation for a
 * card that was in fact translated. Nothing throws and nothing looks broken,
 * which is exactly the class of failure worth pinning.
 *
 * So: every key must correspond to a real card heading, card body or section
 * heading in the course. The reverse is NOT required — a partly translated
 * course is a legitimate state, and the interface says so per card.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents:
      'export { lifeInTheUkCourse } from "./src/lib/lifeInTheUkCourse.ts";\n' +
      'export { LIFE_IN_THE_UK_DE } from "./src/lib/lifeInTheUkTranslationsDe.ts";',
    resolveDir: root,
    sourcefile: "uk-translations-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("uk-translations-check", module);
compiled.filename = path.join(root, ".uk-translations-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { lifeInTheUkCourse, LIFE_IN_THE_UK_DE } = compiled.exports;

// Every English string the lesson body can offer a translation for. Paragraphs
// and callouts are included because they are tappable too — the marker only
// appears where a translation exists, so this is what "everything" means.
const translatable = new Set();
for (const lesson of lifeInTheUkCourse.lessons ?? []) {
  for (const block of lesson.blocks ?? []) {
    if (block.type === "h3" || block.type === "p" || block.type === "callout") {
      translatable.add(block.text);
    }
    if (block.type === "cards") {
      for (const item of block.items ?? []) {
        translatable.add(item.h4);
        translatable.add(item.p);
      }
    }
  }
}

const failures = [];

const orphans = Object.keys(LIFE_IN_THE_UK_DE).filter((key) => !translatable.has(key));
if (orphans.length) {
  failures.push(
    `${orphans.length} German key(s) match no card or heading in the course, so they can never be shown:\n` +
      orphans.slice(0, 8).map((key) => `      ${JSON.stringify(key.slice(0, 90))}`).join("\n")
  );
}

// A translation identical to its English is a forgotten paste — unless the
// English is a name. "Magna Carta", "Robert the Bruce" and "Trent, Mersey,
// Tyne" are supposed to survive unchanged, and so are bare years. Only a
// SENTENCE that came back identical is suspicious, so this looks for final
// punctuation or real length rather than for a space.
// A single word keeping its full stop is still a name: the card body "England."
// is "England." in German too. A sentence needs more than one word.
const looksLikeSentence = (text) => {
  const trimmed = text.trim();
  // A "Name · Name · Name" list is a list of proper nouns. "Chaucer ·
  // Shakespeare · Jane Austen" is the same in German, and demanding a
  // difference would only invite a worse translation. Prose is the target.
  if (trimmed.includes(" · ")) return false;
  const words = trimmed.split(/\s+/).length;
  return (words > 1 && /[.!?]$/.test(trimmed)) || words > 6;
};
const untranslated = Object.entries(LIFE_IN_THE_UK_DE)
  .filter(([key, value]) => key === value && looksLikeSentence(key));
if (untranslated.length > 0) {
  failures.push(
    `${untranslated.length} sentence(s) are identical to their English, which is a paste that was never translated: ` +
      untranslated.slice(0, 4).map(([key]) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

const empty = Object.entries(LIFE_IN_THE_UK_DE).filter(([, value]) => !String(value).trim());
if (empty.length) {
  failures.push(`${empty.length} entries have an empty translation`);
}

if (failures.length) {
  console.error("FAIL check-uk-translations");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

const covered = Object.keys(LIFE_IN_THE_UK_DE).length;
const total = translatable.size;
console.log(
  `check-uk-translations: ${covered} of ${total} translatable strings have German ` +
    // Floor, not round: 820 of 824 is not "100%", and reporting it as such is
    // how the last few strings stay missing for ever.
    `(${Math.floor((covered / total) * 100)}%), and every key matches real course text`
);
