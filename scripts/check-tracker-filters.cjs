#!/usr/bin/env node
/**
 * Both trackers offer the same two ways of narrowing a list.
 *
 * The sentence list and the word list are separate components on purpose — the
 * sentence one indexes sixteen thousand rows — but that separation let their
 * controls drift. The words list could be filtered by CEFR level and not by
 * usefulness; the sentence list could be filtered by usefulness and not by
 * level. Neither gap was a decision, and a learner looking for "the A1
 * sentences" had no way to ask.
 *
 * Level and usefulness are the two that cross: every item carries a level, and
 * usefulness is read from the pack an item belongs to, which words and
 * sentences both have. Part of speech stays words-only and item type stays
 * sentences-only, because those describe what the two things ARE.
 *
 * The data is checked as well as the wiring: a control offering bands that
 * nothing in the catalogue carries is a control that always returns nothing,
 * which is worse than not offering it.
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
      'export { CEFR_STEPS, cefrStep } from "./src/lib/cefr.ts";',
      'export { conversationPriorityInfo, USEFULNESS_FILTERS } from "./src/lib/conversationPriority.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "tracker-filters-entry.ts",
    loader: "ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  logLevel: "silent",
});
const loaded = new Module("tracker-filters-entry", null);
loaded.paths = Module._nodeModulePaths(root);
loaded._compile(built.outputFiles[0].text, path.join(root, "tracker-filters-entry.cjs"));
const { CEFR_STEPS, cefrStep, conversationPriorityInfo, USEFULNESS_FILTERS, allPartBlueprints,
  buildApiPartFromResolved, buildBundledParts, buildTatoebaParts } = loaded.exports;

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

const sentences = fs.readFileSync(path.join(root, "src/components/lab/VocabTracker.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const words = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8").replace(/\r\n?/gu, "\n");

check("the sentence list can be narrowed by level", () => {
  assert.ok(/const \[levelFilter, setLevelFilter\] = useState<"all" \| CefrStep>\("all"\)/.test(sentences),
    "the sentence tracker has no level state");
  assert.ok(sentences.includes('cefrStep(item.level) !== levelFilter'),
    "the level control is drawn but nothing filters on it");
  assert.ok(/\{ui\("Level"\)\}/.test(sentences), "the level control has no label on screen");
});

check("the word list can be narrowed by usefulness", () => {
  assert.ok(/const \[usefulness, setUsefulness\] = useState<"all" \| ConversationUsefulness>\("all"\)/.test(words),
    "the words tracker has no usefulness state");
  assert.ok(words.includes("usefulnessOf(word.partKey) !== usefulness"),
    "the usefulness control is drawn but nothing filters on it");
  assert.ok(/\{ui\("Usefulness"\)\}/.test(words), "the usefulness control has no label on screen");
});

check("both level controls offer a way back to everything", () => {
  for (const [name, source] of [["sentences", sentences], ["words", words]]) {
    assert.ok(/<option value="all">\{ui\("All levels"\)\}<\/option>/.test(source),
      `the ${name} level control has no All levels option, so choosing a level is one-way`);
  }
});

check("both read the same usefulness list, so the bands cannot drift apart", () => {
  for (const [name, source] of [["sentences", sentences], ["words", words]]) {
    assert.ok(source.includes('USEFULNESS_FILTERS,') || source.includes("USEFULNESS_FILTERS.map"),
      `the ${name} tracker builds its own usefulness list`);
  }
  assert.ok(!/const USEFULNESS_FILTERS: \{/.test(sentences) && !/const USEFULNESS_FILTERS: \{/.test(words),
    "a tracker still declares its own copy of the usefulness bands");
});

// ── and the controls offer bands the catalogue actually carries ─────────────
// The catalogue the trackers actually build, not the authored packs alone:
// bundled and Tatoeba parts are in the list a learner filters, and a control
// judged against blueprints only would look dead when it is not.
const resolved = Object.fromEntries(Object.entries(allPartBlueprints).map(([key, blueprint]) => {
  try { return [key, buildApiPartFromResolved(blueprint, {})]; } catch { return [key, blueprint]; }
}));
const parts = { ...resolved, ...buildBundledParts(), ...buildTatoebaParts() };
const seeds = [];
const partLevels = new Map();
for (const [key, part] of Object.entries(parts)) {
  partLevels.set(key, part.level);
  const rows = (part.seeds ?? part.vocab ?? []);
  for (const _ of rows) seeds.push({ part: key, level: part.level });
  if (!rows.length) seeds.push({ part: key, level: part.level });
}

check("every level the control offers matches something", () => {
  const present = new Set(seeds.map((seed) => cefrStep(seed.level)));
  const offered = CEFR_STEPS.filter((step) => !present.has(step));
  assert.strictEqual(offered.length, 0,
    `the control offers ${offered.join(", ")}, which nothing in the catalogue is`);
});

check("every usefulness band the control offers matches something", () => {
  const present = new Set([...partLevels.keys()].map((key) => conversationPriorityInfo(key).key));
  // "personal" is the learner's own added material, which a fresh catalogue
  // has none of — offering it is right even when nothing matches yet.
  const offered = USEFULNESS_FILTERS
    .filter((option) => option.key !== "all" && option.key !== "personal")
    .filter((option) => !present.has(option.key))
    .map((option) => option.key);
  assert.strictEqual(offered.length, 0,
    `the control offers ${offered.join(", ")}, which no pack is`);
});

check("the two lists keep the controls that describe what they are", () => {
  assert.ok(words.includes("WORD_PART_OF_SPEECH_FILTERS"), "the words list lost its part-of-speech control");
  assert.ok(sentences.includes("ITEM_TYPE_FILTERS"), "the sentence list lost its item-type control");
});

if (failed) {
  console.error(`\n${failed} tracker filter check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-tracker-filters: level and usefulness narrow both lists, over ${seeds.length.toLocaleString("en-GB")} seeds`
);
process.exit(0);
