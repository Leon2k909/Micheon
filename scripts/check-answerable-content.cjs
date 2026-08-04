// Every taught line must be answerable from what the learner can see.
//
// Two ways that silently breaks, both found in shipped content:
//
//   1. An invisible character inside a German string. "die Pannenhilfe" once
//      carried a soft hyphen (U+00AD) between "Panne" and "nhilfe". It renders
//      identically, so the correct answer looked right and still failed — the
//      only string that matched was one containing a character nobody can type.
//
//   2. An English answer written for a longer variant of the sentence.
//      "Ich schau lieber Tennis." expected "I'd rather watch tennis, and boxing
//      only for the big fights." — the boxing clause exists only in the `long`
//      form, so the drilled sentence demanded words its German never contained.
//
// Both make an item permanently unanswerable, and because a wrong answer feeds
// the review scheduler, the item then returns forever as a struggle.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const FILES = ["src/lib/data.ts", "src/lib/expansionPacks.ts", "src/lib/phrasebank.ts"];

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── 1. invisible characters ────────────────────────────────────────────────
// Soft hyphen, zero-width space/non-joiner/joiner, word joiner, BOM.
const INVISIBLE = /[­​‌‍⁠﻿]/;
const invisibleHits = [];
for (const relativePath of FILES) {
  const lines = fs.readFileSync(path.join(root, relativePath), "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!INVISIBLE.test(line)) return;
    const codes = [...line]
      .filter((character) => INVISIBLE.test(character))
      .map((character) => `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`);
    invisibleHits.push(`${relativePath}:${index + 1} ${[...new Set(codes)].join(",")}`);
  });
}
check(
  "no taught line hides an invisible character a learner cannot type",
  invisibleHits.length === 0,
  invisibleHits.slice(0, 5).join(" | ")
);

// ── 2. English answers written for the `long` variant ──────────────────────
// A blunt en/de length ratio is useless here: idioms legitimately expand
// ("Spinnst du?" -> "Are you out of your mind?"). The real signal is an entry
// that ALSO carries a longer German variant, where the English tracks that
// variant instead of the sentence actually being drilled. The learner is then
// shown the short German and marked wrong for not producing the long one.
const ENTRY = /\bde: "((?:[^"\\]|\\.)*)", en: "((?:[^"\\]|\\.)*)"[\s\S]*?long: "((?:[^"\\]|\\.)*)"/g;
const words = (text) => text.split(/[\s—–-]+/).filter(Boolean).length;

const driftHits = [];
let checkedEntries = 0;
for (const relativePath of FILES) {
  const lines = fs.readFileSync(path.join(root, relativePath), "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    let match;
    ENTRY.lastIndex = 0;
    while ((match = ENTRY.exec(line))) {
      checkedEntries += 1;
      const german = words(match[1]);
      const english = words(match[2].split(" / ")[0]);
      const longGerman = words(match[3]);
      // A variant only 1-2 words longer is usually just restoring an auxiliary
      // or pronoun ("Wie viele Sätze noch?" -> "Wie viele Sätze machst du
      // noch?"), which carries no new content for the English to leak. Three
      // or more added words is where real extra content starts.
      if (longGerman < german + 3) continue;
      // Flag only when the English is closer to the long variant than to the
      // drilled sentence, and clearly overshoots it.
      const nearerLong = Math.abs(english - longGerman) < Math.abs(english - german);
      if (nearerLong && english > german + 2) {
        driftHits.push(
          `${relativePath}:${index + 1} drilled de(${german}w) "${match[1].slice(0, 40)}" ` +
          `but en(${english}w) matches long(${longGerman}w) "${match[2].slice(0, 60)}"`
        );
      }
    }
  });
}
check(
  `no English answer is written for the long variant instead of the drilled sentence (${checkedEntries} entries checked)`,
  driftHits.length === 0,
  driftHits.slice(0, 5).join(" | ")
);

if (failures) {
  console.error(`\n${failures} unanswerable-content regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nevery taught line is answerable from what the learner can see");
