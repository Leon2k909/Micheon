#!/usr/bin/env node
/**
 * The line under a card is translated, or it is honestly English.
 *
 * Fourteen thousand cards carry a short note saying when the phrase is used.
 * They were written in English because the app was, and they kept being shown
 * in English after the app learned to speak six languages: a Portuguese
 * reader got the card in Portuguese and the explanation under it in English.
 *
 * They are being translated in batches, which is the only way a job this size
 * lands at all. That makes two things worth holding:
 *
 *   1. THE SIX MOVE TOGETHER. Translating a batch into one language and not
 *      the others does not fix the unfairness, it moves it. Every table must
 *      hold the same set of notes.
 *
 *   2. A KEY THAT IS NOT A KEY IS DEAD WEIGHT. The tables are keyed by the
 *      English note exactly as the card carries it, so a key that matches no
 *      card can never be looked up — it is a translation nobody will read,
 *      and nothing about the app looks wrong when it happens.
 *
 * Coverage itself is reported rather than enforced. A floor here would mean
 * either failing the build for months or setting it so low it says nothing;
 * the number on every build is what keeps the job visible.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const libDir = path.join(root, "src/lib");

// ── every note a card actually carries ────────────────────────────────────
const cardNotes = new Set();
for (const name of fs.readdirSync(libDir)) {
  if (!name.endsWith(".ts") || name.startsWith("usageNotes")) continue;
  const source = fs.readFileSync(path.join(libDir, name), "utf8");
  for (const match of source.matchAll(/\buse: "((?:[^"\\]|\\.)*)"/g)) {
    try { cardNotes.add(JSON.parse('"' + match[1] + '"')); } catch { /* not a plain literal */ }
  }
}
assert.ok(cardNotes.size > 10000, `expected the card notes, found ${cardNotes.size}`);

// ── what each language has so far ─────────────────────────────────────────
const LANGUAGES = [
  ["de", "usageNotesDe.ts", "USE_DE"],
  ["fr", "usageNotesFr.ts", "USE_FR"],
  ["pl", "usageNotesPl.ts", "USE_PL"],
  ["es", "usageNotesEs.ts", "USE_ES"],
  ["it", "usageNotesIt.ts", "USE_IT"],
  ["pt", "usageNotesPt.ts", "USE_PT"],
];

const failures = [];
const tables = new Map();

for (const [code, file, name] of LANGUAGES) {
  const full = path.join(libDir, file);
  if (!fs.existsSync(full)) {
    failures.push(`${file} is missing, so ${code} has no notes at all while the others do`);
    continue;
  }
  const source = fs.readFileSync(full, "utf8");
  if (!source.includes(`export const ${name}`)) {
    failures.push(`${file} does not export ${name}, so usageNotes.ts cannot load it`);
    continue;
  }
  const rows = new Map();
  for (const match of source.matchAll(/^ {2}("(?:[^"\\]|\\.)*"): ("(?:[^"\\]|\\.)*"),$/gm)) {
    rows.set(JSON.parse(match[1]), JSON.parse(match[2]));
  }
  tables.set(code, rows);
}

// ── the six move together ─────────────────────────────────────────────────
const sizes = [...tables.entries()].map(([code, rows]) => `${code} ${rows.length ?? rows.size}`);
const first = tables.get("de");
if (first) {
  for (const [code, rows] of tables) {
    if (code === "de") continue;
    const missing = [...first.keys()].filter((key) => !rows.has(key));
    const extra = [...rows.keys()].filter((key) => !first.has(key));
    if (missing.length || extra.length) {
      failures.push(
        `${code} is out of step with de: ${missing.length} note(s) it has not got and ${extra.length} `
        + `it has that de has not. Translating a batch into some languages and not the rest moves the `
        + `unfairness rather than fixing it. First missing: ${JSON.stringify(missing[0] ?? extra[0])}`
      );
    }
  }
}

// ── no key that matches no card ───────────────────────────────────────────
for (const [code, rows] of tables) {
  const orphans = [...rows.keys()].filter((key) => !cardNotes.has(key));
  if (orphans.length) {
    failures.push(
      `${code} holds ${orphans.length} note(s) no card carries, so they can never be looked up. `
      + `First: ${JSON.stringify(orphans[0])}`
    );
  }
}

// ── and the app reads them ────────────────────────────────────────────────
const loader = fs.readFileSync(path.join(libDir, "usageNotes.ts"), "utf8");
for (const [code] of LANGUAGES) {
  if (!new RegExp(`\\b${code}: \\(\\) => import`).test(loader)) {
    failures.push(`usageNotes.ts has no loader for ${code}, so its file is never fetched`);
  }
}
if (/^import .*usageNotes(De|Fr|Pl|Es|It|Pt)/m.test(loader)) {
  failures.push("a notes table is imported statically, which puts all fourteen thousand into the bundle");
}
for (const [file, what] of [
  ["src/GuidedSession.tsx", "the lesson chip and the flashcard note"],
  ["src/components/listen/ListenView.tsx", "the Listen note"],
  ["src/components/lab/VocabTracker.tsx", "the sentence tracker"],
  ["src/components/lab/WordsTracker.tsx", "the word tracker"],
]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (!source.includes("usageNote(")) {
    failures.push(`${what} shows its note without asking usageNote(), so it stays English in every language`);
  }
}

if (failures.length) {
  console.error("FAIL check-usage-notes");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

const done = first ? first.size : 0;
const pct = ((done / cardNotes.size) * 100).toFixed(1);
console.log(
  `check-usage-notes: ${done} of ${cardNotes.size} card notes translated (${pct}%), `
  + `the same set in all six languages, every key matches a card, and all five places ask for them`
);
