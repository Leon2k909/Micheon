#!/usr/bin/env node
/**
 * An accurate sentence has to be accepted, and an inaccurate one still refused.
 *
 * The matcher forgives typing, contractions, spelling and word order. What it
 * did not forgive was word CHOICE: "We're going to the beach at the weekend"
 * came back as Not quite because the answer key happened to say "seaside". The
 * synonym table fixes that, and this checks it from both ends — because a
 * synonym table is exactly the kind of thing that quietly starts accepting
 * near-misses, and a leak there is worse than the fussiness it replaced.
 *
 * Every row is exercised in both directions, so a row that has stopped firing
 * (usually because an earlier fold in the chain already claimed the word) shows
 * up as a failure rather than sitting there looking like cover.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { matchEnglishPhrase } from "./src/lib/germanTextMatch.ts";',
      'export { ENGLISH_SYNONYMS } from "./src/lib/englishSynonyms.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "synonym-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("synonym-check", module);
compiled.filename = path.join(root, ".synonym-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { matchEnglishPhrase, ENGLISH_SYNONYMS } = compiled.exports;

const failures = [];

// ── every row fires, both ways ────────────────────────────────────────────
let pairs = 0;
for (const [canonical, ...variants] of ENGLISH_SYNONYMS) {
  for (const variant of variants) {
    pairs += 1;
    const forward = matchEnglishPhrase(`i said the ${variant} was here`, `I said the ${canonical} was here.`);
    const back = matchEnglishPhrase(`i said the ${canonical} was here`, `I said the ${variant} was here.`);
    if (!forward.ok || !back.ok) {
      failures.push(`"${variant}" and "${canonical}" are listed as the same word but are not accepted for each other`);
    }
  }
}
if (pairs < 80) {
  failures.push(`only ${pairs} synonym pairs — the table has been gutted`);
}

// A word may not sit in two rows with two different canonicals: it would fold
// one way or the other depending on row order, which is not a decision anyone
// is making on purpose.
const seen = new Map();
for (const row of ENGLISH_SYNONYMS) {
  for (const word of row) {
    const already = seen.get(word);
    if (already && already !== row[0]) {
      failures.push(`"${word}" is in two rows ("${already}" and "${row[0]}"), so which one wins depends on the order of the table`);
    }
    seen.set(word, row[0]);
  }
}

// ── the accurate sentence is accepted ─────────────────────────────────────
const ACCEPT = [
  // The one that started this.
  ["we're going to the beach at the weekend", "We're going to the seaside at the weekend."],
  ["we're going to the sea at the weekend", "We're going to the seaside at the weekend."],
  ["everybody is already here", "Everyone is already here."],
  ["can somebody help me", "Can someone help me?"],
  ["i live in a flat", "I live in an apartment."],
  ["the pharmacy is closed", "The chemist is shut."],
  ["the shop is shut", "The shop is closed."],
  ["i have to take a cab", "I have to take a taxi."],
  ["i feel sick", "I feel ill."],
  ["that's not correct", "That's not right."],
  ["shall we start", "Shall we begin?"],
  ["i'm done", "I'm finished."],
  ["it's a difficult question", "It's a hard question."],
  ["perhaps tomorrow", "Maybe tomorrow."],
  // "Ich glaube" is think AND believe, and English hedges with either.
  ["i believe we have enough", "I think we have enough."],
  ["i reckon we have enough", "I think we have enough."],
  ["i suppose we have enough", "I think we have enough."],
  ["i guess we have enough", "I think we have enough."],
  ["i think it is fine", "I believe it is fine."],
  ["she believes it is true", "She thinks it is true."],
  ["i thought so", "I believed so."],
  ["i'm really happy", "I'm really glad."],
  ["it costs about ten euros", "It costs around ten euros."],
  // Telling the time, every way people say it.
  ["it's half seven", "It's half past seven."],
  ["it's seven thirty", "It's half past seven."],
  ["it's nine fifteen", "It's a quarter past nine."],
  ["it's seven forty five", "It's quarter to eight."],
  ["it's seven", "It's seven o'clock."],
];
for (const [input, key] of ACCEPT) {
  if (!matchEnglishPhrase(input, key).ok) {
    failures.push(`"${input}" is refused for "${key}", and it means the same thing`);
  }
}

// ── the inaccurate one is still refused ───────────────────────────────────
const REJECT = [
  // "sort of" folds with "kind of" and "type of"; the bare words must not,
  // because kind is also nice and type is also what you do to a keyboard.
  ["he is a type person", "He is a kind person."],
  ["i sort the letter", "I type the letter."],
  ["what sort of bread is that", "What sort of cheese is that?"],
  ["we're going to the lake at the weekend", "We're going to the sea at the weekend."],
  ["we're going to the mountains at the weekend", "We're going to the seaside at the weekend."],
  ["the river is beautiful", "The sea is beautiful."],
  ["the water is hot", "The water is warm."],
  ["i always go there", "I often go there."],
  ["someone is here", "Everyone is here."],
  ["i'd like a tea", "I'd like a coffee."],
  ["i sold the car", "I bought the car."],
  ["the shop is open", "The shop is closed."],
  ["i go to the theatre", "I go to the cinema."],
  ["are you right", "Are you all right?"],
  // Hedging is not certainty, and German keeps wissen and glauben apart.
  ["i know we have enough", "I think we have enough."],
  ["i hope we have enough", "I think we have enough."],
  // "Guess" and "suppose" only hedge in the first person: on their own they
  // are a riddle and an obligation, and must not fold into "think".
  ["guess the answer", "think of the answer"],
  ["you are supposed to wait here", "you think to wait here"],
  // A wrong time is a wrong answer, however it is phrased.
  ["it's ten past seven", "It's half past seven."],
  ["it's seven twenty", "It's seven thirty."],
  ["it's quarter to eight", "It's quarter past eight."],
  ["it's half eight", "It's half past seven."],
];
for (const [input, key] of REJECT) {
  if (matchEnglishPhrase(input, key).ok) {
    failures.push(`"${input}" is accepted for "${key}", which does not mean the same thing`);
  }
}

if (failures.length) {
  console.error("FAIL check-synonyms");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-synonyms: ${ENGLISH_SYNONYMS.length} rows / ${pairs} pairs all accepted in both directions, ${REJECT.length} near-misses still refused`);
