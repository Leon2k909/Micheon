#!/usr/bin/env node
/**
 * Exactly which taught entries Portuguese does not answer — using the app's
 * own translate(), not a guess at it.
 *
 * WHY THIS AND NOT A SET LOOKUP. A naive "is this German string a key in the
 * table" answers 1,375 entries missing. The app is cleverer than that: a word
 * card written "das Missverständnis" is answered by a table key
 * "Missverständnis", and a card can carry its own inline translation instead
 * of using the table at all. Checking against the real lookup gives 746.
 *
 * Those 746 are not all work. Most are another language's own cards, which put
 * their own language in the de field, and the packs this course deliberately
 * leaves out. This separates the two so the number that is left is the number
 * of cards a Portuguese learner actually reads in German.
 *
 * It is a tool, not a gate — check-portuguese-table.cjs holds the rules that
 * can be decided mechanically. Run it after adding German to see what is owed.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export * from "./src/lib/translations.ts";',
      'export { PORTUGUESE_BY_GERMAN } from "./src/lib/portugueseTranslations.ts";',
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
compiled.filename = path.join(root, ".translations-pt.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;
M.primeTranslations("pt", M.PORTUGUESE_BY_GERMAN);
const { translate } = M;

/**
 * The packs and single cards this course refuses, read from the gate so the
 * two cannot drift apart. The gate is the authority; this only mirrors it.
 */
const gate = fs.readFileSync(path.join(root, "scripts/check-portuguese-table.cjs"), "utf8");
const excluded = new Set();
const notFor = gate.slice(gate.indexOf("const NOT_FOR_PORTUGUESE"));
for (const m of notFor.slice(0, notFor.indexOf("]);")).matchAll(/^ {2}"(.*)",$/gm)) excluded.add(m[1]);
const packs = gate.match(/const EXCLUDED_PACKS = .([^}]*)/);
for (const m of (packs ? packs[1] : "").matchAll(/(\w+): "([^"]+)"/g)) {
  const source = fs.readFileSync(path.join(root, m[2]), "utf8");
  const from = Math.max(source.indexOf(`\n  ${m[1]}: {`), source.indexOf(`\n  "${m[1]}": [`));
  if (from < 0) continue;
  const after = source.slice(from + 1);
  const next = after.search(/\n {2}"?(part\d+|cb-[a-z-]+)"?: [{[]/);
  const block = next < 0 ? after : after.slice(0, next);
  const phrases = block.indexOf("phrases:");
  for (const d of (phrases < 0 ? block : block.slice(phrases)).matchAll(/ de: "(.*?)"/g)) {
    excluded.add(d[1]);
  }
}

const FIELD = (name) => new RegExp("\\b" + name + ':\\s*"((?:[^"\\\\]|\\\\.)*)"');

/**
 * The regex captures the SOURCE text between the quotes, so a card containing
 * a quotation mark comes back with its backslash still attached — Sagen wir
 * einfach „rot\". The table, being a compiled module, holds the parsed string
 * with no backslash. Comparing one against the other says the card is
 * untranslated when the key sitting in the table is byte-identical to it.
 *
 * Every card with a quotation mark in it is affected, in every language.
 */
const unescape = (raw) => {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
};
const dir = path.join(root, "src/lib");
const owed = new Map();
let entries = 0;
let skippedOwn = 0;
let skippedExcluded = 0;

for (const file of fs.readdirSync(dir).filter((n) => n.endsWith(".ts"))) {
  // Another language's own cards put THEIR language in the de field — Russian
  // Cyrillic, not German — so Portuguese owes them nothing.
  const ownCards = /OwnCards\.ts$/.test(file);
  // And the two plumbing files whose de field is a language name and a code.
  const plumbing = file === "courseLanguages.ts" || file === "courseTranslation.ts";
  fs.readFileSync(path.join(dir, file), "utf8").split(/\r?\n/).forEach((line, i) => {
    const rawDe = (line.match(FIELD("de")) || [])[1];
    const de = rawDe === undefined ? undefined : unescape(rawDe);
    if (!de) return;
    entries++;
    const rawPt = (line.match(FIELD("pt")) || [])[1];
    const inline = rawPt ? unescape(rawPt) : null;
    if (translate(de, "pt", inline)) return;
    if (ownCards || plumbing) return void skippedOwn++;
    if (excluded.has(de)) return void skippedExcluded++;
    if (!owed.has(de)) owed.set(de, `${file}:${i + 1}`);
  });
}

console.log(`${entries.toLocaleString("en-GB")} taught entries read.`);
console.log(`${skippedOwn} belong to another language or are plumbing.`);
console.log(`${skippedExcluded} are cards this course deliberately leaves out.`);
console.log(`\n${owed.size} distinct German string(s) a Portuguese learner would read in German:`);
for (const [de, where] of owed) console.log(`  ${where}\n    ${de}`);
