#!/usr/bin/env node
/**
 * A word may not be credited with what another word is said.
 *
 * The corpus counts are keyed on a folded form, and German inflection is
 * guessed by trying endings, so a word can be handed a count it never earned.
 * The guard already here stops a noun claiming a VERB — die Wolle taking the
 * mentions of "wollen". It cannot stop a noun claiming another NOUN, because
 * nothing about the spelling gives it away: die Esse's plural genuinely is
 * die Essen, and das Essen is a different word that happens to be written the
 * same. The corpus says Esse nought times and Essen 24 times, and all 24 went
 * to the smith's hearth — ranking it 136th of 24,191 words and printing A1 on
 * a B2 noun, on the strength of people talking about dinner.
 *
 * The rule that settles it: a guessed ending is a guess about ONE word, so
 * when the form guessed is something the course teaches in its own right, it
 * is a different word and keeps its own count.
 *
 * What matters is that the guard is narrow. Pooling is right far more often
 * than it is wrong — die Minute is said as "Minuten" 82 times and would score
 * 2 without it — so this asserts both directions: the false inheritance is
 * gone AND the true inheritance still happens.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildCorpusIndex, corpusUses, corpusReach, corpusKey } from "./src/lib/corpusFrequency.ts";',
      'export { spokenWordRung } from "./src/lib/wordSession.ts";',
      'export { cefrRungLabel } from "./src/lib/cefr.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "corpus-inheritance-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("corpus-inheritance-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "corpus-inheritance-entry.cjs"));
const { buildCorpusIndex, corpusUses, corpusReach, corpusKey, spokenWordRung, cefrRungLabel, allPartBlueprints } =
  loaded.exports;

const index = buildCorpusIndex(allPartBlueprints);

let failed = 0;
const check = (label, run) => {
  try {
    run();
    console.log(`ok   ${label}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${label}\n     ${error.message}`);
  }
};

const saidAsNoun = (word) => index.nounCount.get(corpusKey(word)) ?? 0;

check("the catalogue's own words are indexed, or the guard matches nothing", () => {
  assert.ok(index.headwords.size > 4000, `only ${index.headwords.size} headwords indexed`);
  // das Essen is the word being protected FROM having its count taken. The
  // word that was taking it, die Esse, has since been dropped from the course
  // — it was a smith's hearth in a pack that already teaches "forge", and no
  // English gloss for it read as English. The rule is not about that word
  // though, so it is still probed below as an untaught spelling: nothing may
  // collect das Essen's mentions by being spelled like its plural, whether the
  // course happens to teach it or not.
  assert.ok(index.headwords.has("essen"), "das Essen is not indexed as a word in its own right");
  assert.ok(index.headwords.has("link"), "der Link is not indexed as a word in its own right");
});

// ── the false inheritance ───────────────────────────────────────────────────
check("die Esse is not credited with what is said about dinner", () => {
  assert.strictEqual(saidAsNoun("Esse"), 0, "the corpus now says Esse, so this case has moved");
  assert.ok(saidAsNoun("Essen") > 0, "the corpus no longer says Essen, so nothing could be inherited");
  assert.strictEqual(corpusUses("Esse", index), 0,
    `die Esse is credited ${corpusUses("Esse", index)} mentions it never had`);
});

check("and so is not printed as a beginner word", () => {
  const word = { de: "die Esse", lookup: "Esse", level: "B2" };
  // 136 is where the inherited count had put it in a queue of 24,191.
  for (const rank of [0, 136, 299, 1199]) {
    const rung = spokenWordRung(word, rank, index);
    assert.strictEqual(cefrRungLabel(rung), "B2",
      `at queue position ${rank} a B2 noun is shown as ${cefrRungLabel(rung)}`);
  }
});

// corpusReach guesses endings the same way, so it takes the same guard on the
// candidates. Its own base term is NOT shape-tested — a separate, measured
// question left alone here — so what is asserted is the part that was fixed:
// the packs reached must not exceed the packs that say the word or a form of
// it that is not somebody else's word.
check("the pack count does not inherit another word's packs either", () => {
  const essen = corpusReach("Essen", index);
  const esse = corpusReach("Esse", index);
  assert.ok(essen > 20, `das Essen reaches only ${essen} packs, so there is nothing to wrongly inherit`);
  assert.ok(esse < essen / 4,
    `die Esse reaches ${esse} packs against das Essen's ${essen}: it is still living off the other word`);
});

check("die Linke does not live off der Link", () => {
  assert.strictEqual(corpusUses("Linke", index), 0,
    `die Linke is credited ${corpusUses("Linke", index)} mentions of something else`);
});

// ── the true inheritance, which must survive ────────────────────────────────
check("die Minute is still counted from the way it is actually said", () => {
  const uses = corpusUses("Minute", index);
  assert.ok(uses > 50,
    `die Minute scores ${uses}: the plural it is nearly always said in stopped counting`);
  assert.ok(uses > saidAsNoun("Minute"),
    "die Minute is no longer pooling its plural at all");
});

check("the guard stays narrow", () => {
  let inheriting = 0;
  for (const part of Object.values(allPartBlueprints)) {
    for (const seed of part.seeds ?? []) {
      if (seed.tip !== "noun") continue;
      const lookup = seed.lookup ?? seed.de;
      if ((index.nounCount.get(corpusKey(lookup)) ?? 0) === 0 && corpusUses(lookup, index) > 0) inheriting += 1;
    }
  }
  // 176 measured. A floor, because pooling is right far more often than not
  // and switching it off wholesale would pass every assertion above.
  assert.ok(inheriting > 120,
    `only ${inheriting} nouns still inherit a count: the pooling has been broken, not narrowed`);
});

if (failed) {
  console.error(`\n${failed} corpus inheritance check(s) failed.`);
  process.exit(1);
}
console.log("check-corpus-inheritance: a guessed ending never takes another word's count.");
process.exit(0);
