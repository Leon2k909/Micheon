#!/usr/bin/env node
/**
 * Passages: read real German, say what it means.
 *
 * The exercise only works if the lookups are trustworthy. A learner meeting
 * an unknown word is supposed to hover it and get on with the sentence — so a
 * word with no gloss is a dead end, and a word with the WRONG gloss is worse,
 * because they will build the sentence around it and never find out why it
 * did not make sense.
 *
 * germanWordGloss knows words, not sentences. It answers "age" for Alter,
 * which is right about the noun and wrong about a message that opens with it.
 * Each line therefore carries its own glossary for the words its context
 * decides, and this check holds the whole thing to the contract: every word
 * resolves, and the known traps resolve to the meaning the line actually has.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { PASSAGES, passageTokens, coverIdeas } from "./src/lib/passages.ts";',
      'export { germanWordGloss } from "./src/lib/germanWordGloss.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "passages-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("passages-check", module);
compiled.filename = path.join(root, ".passages-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { PASSAGES, passageTokens, coverIdeas, germanWordGloss } = compiled.exports;

assert.ok(PASSAGES.length >= 8, `only ${PASSAGES.length} passages`);
assert.strictEqual(
  new Set(PASSAGES.map((entry) => entry.id)).size,
  PASSAGES.length,
  "two passages share an id"
);

const glossFor = (line, word) => line.glosses?.[word]
  ?? line.glosses?.[word.toLocaleLowerCase("de-DE")]
  ?? germanWordGloss(word);

let words = 0;
const blank = [];
for (const passage of PASSAGES) {
  assert.ok(passage.lines.length >= 3, `${passage.id} is too short to be a passage`);
  assert.ok(passage.title && passage.source && passage.level, `${passage.id} is missing its framing`);
  for (const line of passage.lines) {
    assert.ok(line.de.trim() && line.en.trim(), `${passage.id} has a line missing a side`);
    // A line must not be its own translation — that is a copy, not a passage.
    assert.notStrictEqual(line.de.trim(), line.en.trim(), `${passage.id}: a line repeats itself`);
    for (const token of passageTokens(line.de)) {
      if (!token.word) continue;
      words += 1;
      if (!glossFor(line, token.text)) blank.push(`${passage.id}: ${token.text}`);
    }
  }
}
assert.deepStrictEqual(blank, [],
  "these words have no gloss, so hovering them tells the reader nothing");
assert.ok(words >= 200, `only ${words} words across all passages`);

// The traps, by name. Each of these has a perfectly good general gloss that
// is the wrong one for the line it sits in.
for (const [id, word, wanted, generalWouldSay] of [
  ["paket", "Alter", /mate|dude/i, "age"],
  ["feierabend", "weg", /gone|off/i, "way / path"],
  ["meeting", "Zahlen", /figure|number/i, "pay"],
  ["rechnung", "Positionen", /line item/i, "position / place / job"],
  ["mama", "Ordentliches", /proper|decent/i, "orderly / tidy"],
]) {
  const passage = PASSAGES.find((entry) => entry.id === id);
  assert.ok(passage, `passage ${id} has gone`);
  const line = passage.lines.find((entry) => passageTokens(entry.de).some((token) => token.text === word));
  assert.ok(line, `${id} no longer contains ${word}`);
  const gloss = glossFor(line, word);
  assert.ok(wanted.test(gloss),
    `${word} in ${id} glosses as "${gloss}" — the general glossary says "${generalWouldSay}", `
    + "which is right about the word and wrong about this line"
  );
}

// ── the attempt is compared, not marked ─────────────────────────────────────
// Two good translations can share almost no words, so nothing here may claim
// a verdict. What it reports is which ideas went unmentioned.
{
  // Contractions must not leave debris: didn't once produced "didn", and a
  // reader was told they had failed to mention it.
  const contracted = coverIdeas("The delivery guy didn't turn up again.", "The delivery guy did not turn up again");
  assert.deepStrictEqual(contracted.missing, [],
    `a faithful rewording should leave nothing unmentioned, got ${JSON.stringify(contracted.missing)}`);
  assert.ok(!contracted.covered.includes("didn"), "didn is not a word and must never be an idea");

  // And the limitation, stated rather than hidden: a synonym IS reported as
  // unmentioned, because no thesaurus is consulted. The screen frames this as
  // "not in your version" and never as a mistake, which is why that is safe.
  const synonym = coverIdeas("The delivery guy didn't turn up.", "The delivery driver did not turn up.");
  assert.ok(synonym.missing.includes("guy"),
    "a swapped synonym is expected to read as unmentioned — if this ever passes, "
    + "the checker has started guessing at meaning and the wording on screen has to change");

  const half = coverIdeas("A slip in the letterbox, even though I was home all day.", "A slip in the letterbox");
  assert.ok(half.missing.includes("home"), "a skipped clause must show up as unmentioned ideas");
  assert.ok(half.covered.includes("slip"), "and what was said must be credited");

  // Grammar words are not ideas: mentioning "the" proves nothing.
  const trivial = coverIdeas("The meeting has been put back again.", "the the the");
  assert.ok(trivial.missing.includes("meeting"), "content words are what count");
  assert.ok(!trivial.covered.includes("the"), "function words must not be scored at all");

  // Inflection is not a difference in meaning.
  const shapes = coverIdeas("I'm staying in bed today.", "I stayed in bed today");
  assert.ok(shapes.covered.includes("staying"), "stayed should satisfy staying");
}

// The view has to offer the lookup and refuse to mark the translation.
const view = fs.readFileSync(path.join(root, "src/components/passages/PassagesView.tsx"), "utf8");
assert.ok(view.includes("entry.glosses?.[token.text]"),
  "the view ignores the line's own glossary, so the context-correct meanings never show");
assert.ok(view.includes("data-gloss"), "words are not hoverable");
assert.ok(/I had it|Close enough|I missed it/.test(view),
  "the reader is not the one marking the translation");
assert.ok(!/is correct|richtig|Correct!/.test(view),
  "a free translation must not be declared correct by the app");

const styles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
assert.ok(styles.includes(".passage-word.has-gloss"), "a hoverable word has no affordance");
assert.ok(/\.passage-word\.has-gloss::after[\s\S]{0,400}content: attr\(data-gloss\)/.test(styles),
  "the gloss never reaches the screen");

console.log(
  `check-passages: ${PASSAGES.length} passages, ${words} words, every one with a gloss `
  + "that fits its line, and the translation left for the reader to judge"
);
