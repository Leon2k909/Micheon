#!/usr/bin/env node
/**
 * A pack's level is inherited by every word in it, so a specialist pack
 * labelled A2 puts specialist words into a beginner's list.
 *
 * Seven packs were doing that: fish species and rock-pool anatomy, hiking
 * gear and way-marking, camping kit, forest and alpine terrain, upland
 * wildlife, restaurant dishes, and baking technique. A learner filtering for
 * A2 was being offered "der Zunder" and "die Sättigungsbeilage" alongside
 * "das Brot".
 *
 * There is no measurement that finds these on its own, and this check does
 * not pretend otherwise. Two attempts failed the same way: word frequency
 * calls "die Kuh" advanced, and pack-level frequency calls "Countries and
 * languages" advanced, because the corpus behind both is conversational and
 * holds almost no concrete nouns at any difficulty. Every pack here was read
 * and judged, and the words that carried each judgement are named below so a
 * later reader can check the reasoning rather than trust the label.
 *
 * Both directions are pinned. The seven must stay above A2, and the packs the
 * failed measurement wanted to demote with them — countries, weather verbs,
 * grammar terms — must stay at A1/A2. A sweep that mechanically pushes
 * low-frequency packs upward breaks this check, which is the point: the
 * distinction is the finding, not the seven labels.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { cefrStep, CEFR_STEPS } from "./src/lib/cefr.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "pack-levels-entry.ts",
    loader: "ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  logLevel: "silent",
});
const mod = new Module("pack-levels", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "pack-levels.cjs"));
const { cefrStep, CEFR_STEPS, allPartBlueprints } = mod.exports;

const rank = (step) => CEFR_STEPS.indexOf(step);

/** Packs whose whole subject is specialist, with the words that say so. */
const SPECIALIST = [
  { key: "part615", because: ["der Kabeljau", "die Miesmuschel", "die Kieme"] },
  { key: "part626", because: ["die Serpentine", "die Schneegrenze", "der Rucksackgurt"] },
  { key: "part627", because: ["das Biwak", "der Zunder", "das Spannseil"] },
  { key: "part628", because: ["die Sennhütte", "das Wurzelwerk", "der Tropfstein"] },
  { key: "part629", because: ["das Murmeltier", "die Kreuzotter", "der Molch"] },
  { key: "part575", because: ["die Sättigungsbeilage", "der Schmorbraten", "der Schmand"] },
  { key: "part576", because: ["der Mürbeteig", "die Krume", "das Bindemittel"] },
];

for (const { key, because } of SPECIALIST) {
  const part = allPartBlueprints[key];
  assert.ok(part, `${key} should still exist`);
  const step = cefrStep(part.level);
  assert.ok(
    rank(step) >= rank("b1"),
    `${key} "${part.theme}" is labelled ${part.level}, which reads as ${step}. It teaches `
      + `${because.join(", ")} — those are not words a learner meets in their first year, and `
      + `the pack's level is what every word in it inherits.`,
  );
  // If the pack were emptied and refilled with beginner words the pin above
  // would be constraining the wrong thing, so it is tied to the evidence.
  const words = new Set((part.seeds ?? []).map((seed) => seed.de));
  for (const word of because) {
    assert.ok(
      words.has(word),
      `${key} no longer teaches ${word}. This check holds it above A2 BECAUSE of that word; `
        + `if the pack's contents changed, re-read it and revise the reasoning above rather `
        + `than deleting the word from this list.`,
    );
  }
}

/**
 * The control group: packs the frequency measurement scored as low as the
 * seven above, which are correctly A1/A2. They are the reason this file pins
 * judgements one at a time instead of applying a rule.
 */
const BEGINNER = [
  { key: "part523", because: "country names and language adjectives" },
  { key: "part532", because: "everyday weather verbs — regnen, schneien, windig" },
  { key: "part585", because: "grammar terms, met in week one of any course" },
  { key: "part604", because: "colours and shapes" },
  { key: "part466", because: "Baum, Blume, Blatt — the pack opens on the commonest words there are" },
];

for (const { key, because } of BEGINNER) {
  const part = allPartBlueprints[key];
  assert.ok(part, `${key} should still exist`);
  const step = cefrStep(part.level);
  assert.ok(
    rank(step) <= rank("a2"),
    `${key} "${part.theme}" has been pushed to ${part.level}. It teaches ${because}. Almost `
      + `none of its words appear in the frequency bank, which is a fact about the bank `
      + `holding no concrete nouns, not about the words being hard.`,
  );
}

console.log(
  `check-pack-levels: ${SPECIALIST.length} specialist packs held above A2, `
    + `${BEGINNER.length} beginner packs held at or below it`,
);
