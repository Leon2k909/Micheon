#!/usr/bin/env node
/**
 * What a learner meets first, and what may not be in it.
 *
 * A pack's level is its TOPIC's, so an A1 topic teaches die Kartoffel and die
 * Artischocke alike and both cards said A1. beyondBeginnerWords.ts answers
 * that by naming the later half one word at a time, and this guards the
 * naming: the words that must be in it, the words that must never be, and the
 * size of the tail that is still unexamined.
 *
 * WHY THIS IS NOT A THRESHOLD. The obvious check is "no rung-1 word may be
 * rarer than N", and it is wrong, twice over. The spoken bank is a 6,314-word
 * subset of a fifty-thousand-word list, so absence from it is not evidence:
 * sprechen, der Bär, putzen, die Soße and der Cousin are all missing from it.
 * And among the words it DOES rank, the rare end is mostly correct: die
 * Tomate is 15,840th, die Gurke 16,188th, die Bushaltestelle 16,363rd, die
 * Hausaufgabe 30,984th, and every one of those is a beginner's word that film
 * dialogue has no occasion to say. Of the eighty-seven ranked words past
 * 15,000 on the rung, about a quarter were genuinely misplaced. A threshold
 * would have moved all eighty-seven and taken the tomato with it.
 *
 * So frequency is used here only to SIZE the unexamined tail, never to decide
 * a word. The ceiling below exists to stop it growing quietly; a pack added
 * with fifty specialist words in it should have to look at them.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { spokenWordRung } from "./src/lib/wordSession.ts";
      export { spokenFrequencyRank } from "./src/lib/spokenFrequency.ts";
      export { BEYOND_A_BEGINNER } from "./src/lib/beyondBeginnerWords.ts";
    `,
    resolveDir: root, sourcefile: "block.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("block", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "block.cjs"));
const { allPartBlueprints, spokenWordRung, spokenFrequencyRank, BEYOND_A_BEGINNER } = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const rankOf = (word) => {
  const r = spokenFrequencyRank(word);
  if (typeof r === "number") return r;
  if (r && typeof r.rank === "number") return r.rank;
  return Infinity;
};

const rows = [];
for (const [id, pack] of Object.entries(allPartBlueprints)) {
  const level = String(pack.level || "").toUpperCase();
  if (!level) continue;
  for (const seed of pack.seeds || []) {
    const lookup = seed.lookup || seed.de;
    if (!lookup) continue;
    const rank = rankOf(lookup);
    rows.push({ id, theme: pack.theme || "", de: seed.de, lookup, rank,
                rung: spokenWordRung({ level, lookup, de: seed.de }, rank, null) });
  }
}
const onRung1 = rows.filter((r) => r.rung === 1);

/**
 * Every name in the list has to match a real seed.
 *
 * A judgement recorded against a word that no pack teaches is a line that
 * looks like work and does nothing — and it is the likely result of a rename,
 * an article change, or a word being dropped from a pack. The list is only
 * worth trusting if every line of it still bites.
 */
const seedNames = new Set();
for (const r of rows) { seedNames.add(r.de); seedNames.add(r.lookup); }
const orphans = [...BEYOND_A_BEGINNER].filter((w) => !seedNames.has(w));
check(`every named word matches a seed some pack teaches (${BEYOND_A_BEGINNER.size} named)`,
  orphans.length === 0,
  orphans.length ? `${orphans.length} match nothing: ${orphans.slice(0, 8).join(", ")}` : "");

// ...and naming a word has to actually move it.
const inert = [...BEYOND_A_BEGINNER]
  .map((w) => rows.find((r) => r.de === w || r.lookup === w))
  .filter((r) => r && r.rung === 1)
  .map((r) => r.de);
check("naming a word actually lifts it off the beginner rung",
  inert.length === 0,
  inert.length ? `${inert.length} named but still rung 1: ${inert.slice(0, 8).join(", ")}` : "");

/**
 * The words a beginner plainly needs, which no judgement may take away.
 *
 * These are the ones a frequency sweep removes, and the reason this file
 * cannot become one. Every one of them is ranked rarer than 15,000 in the
 * spoken bank or missing from it entirely, and every one belongs on the first
 * rung regardless.
 */
const MUST_STAY = [
  "die Tomate", "die Gurke", "die Karotte", "die Zwiebel", "die Kartoffel",
  "die Erdbeere", "die Nudel", "der Pfeffer", "die Soße",
  "die Hausaufgabe", "der Kugelschreiber", "das Schwimmbad", "die Bushaltestelle",
  "schneien", "windig", "putzen", "einsteigen", "schieben", "sprechen",
  "der Hund", "die Kuh", "der Bär", "der Welpe", "die Wolke",
  "der Cousin", "der Beruf", "die Garage", "der Bauer",
];
const taken = MUST_STAY.filter((w) => {
  const row = rows.find((r) => r.de === w || r.lookup === w);
  return row && row.rung > 1;
});
check(`the words a beginner plainly needs are all still on the first rung (${MUST_STAY.length} pinned)`,
  taken.length === 0,
  taken.length ? `moved off: ${taken.join(", ")}` : "");

/**
 * The words this pass judged, by name.
 *
 * A count would go green again the day somebody empties the list and adds
 * fifty others. These are the actual judgements, so these are what is pinned.
 */
const MUST_MOVE = [
  "die Linse", "der Thymian", "das Faultier", "die Artischocke",
  "der Dachdecker", "die Büroklammer", "der Rettich", "der Flugbegleiter",
  "die Anforderung", "die Umsetzung", "der Landkreis", "die Nutzung",
  "das Zutun", "verabscheuen", "angewidert", "kollektiv",
  "das Unternehmen", "der Betrieb", "die Hochschule", "jeweilig",
  "landesweit", "nahtlos", "zusammentragen", "die Frischetheke",
];
const stillFirst = MUST_MOVE.filter((w) => {
  const row = rows.find((r) => r.de === w || r.lookup === w);
  return !row || row.rung === 1;
});
check(`the words judged beyond a beginner are off the first rung (${MUST_MOVE.length} pinned)`,
  stillFirst.length === 0,
  stillFirst.length ? `still rung 1 (or gone from the packs): ${stillFirst.join(", ")}` : "");

/**
 * The unexamined tail, sized rather than judged.
 *
 * Not a claim that these are wrong — most are not. It is a ceiling, so that a
 * pack arriving with a long specialist tail has to be looked at instead of
 * disappearing into a number nobody prints.
 */
const RARE = 15000;
const CEILING = 75;
const tail = onRung1.filter((r) => r.rank > RARE && r.rank < Infinity);
check(`the unexamined rare tail on the beginner rung is at most ${CEILING} (currently ${tail.length})`,
  tail.length <= CEILING,
  tail.length > CEILING
    ? `${tail.length} rung-1 words rank rarer than ${RARE}. Read them and either name them in `
      + `beyondBeginnerWords.ts or raise this ceiling with a reason.\n     `
      + tail.sort((a, b) => b.rank - a.rank).slice(0, 10).map((r) => `${r.de} (${r.rank}, ${r.theme})`).join("\n     ")
    : "");

if (failed) {
  console.error("\nThe first rung is the promise the course opens with.");
  process.exit(1);
}
console.log(
  `check-beginner-block: ${onRung1.length} words on the beginner rung, `
  + `${BEYOND_A_BEGINNER.size} named beyond it, ${tail.length} rare ones still unexamined`
);
process.exit(0);
