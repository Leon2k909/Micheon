#!/usr/bin/env node
/**
 * A word that means two things must say which one it is on.
 *
 * Listen speaks a word and shows its translation. That is enough for a word
 * with one meaning and not enough for one with several: "weiter" spoken aloud
 * against the gloss "further, additional" leaves the learner who was thinking
 * of "carry on" unable to tell whether they were wrong or whether the card is
 * simply on the other meaning. The card carries a `use` note for most of
 * these, but a paragraph is read after the fact, and by then the voice has
 * moved on.
 *
 * wordSenseTags.ts answers it in two or three words. This holds that table to
 * the content, in both directions:
 *
 *   every ambiguous word in Listen has a tag — a word reviewed as polysemous
 *   in canonicalWordSenses.ts, or one the packs claim with two different
 *   primary senses, cannot ship without one, and
 *
 *   every tag belongs to a word that is still there — a tag left behind by a
 *   deleted or renamed lemma is dead weight nobody would notice.
 *
 * Plus the shape: two to four words, and never a restatement of the gloss it
 * sits under, which would add ink and settle nothing.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

global.window = {
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  dispatchEvent: () => true,
  addEventListener() {},
  removeEventListener() {},
};
global.localStorage = global.window.localStorage;

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { canonicalWordSenseFor } from "./src/lib/canonicalWordSenses.ts";',
      'export { primaryWordSense } from "./src/lib/wordSynonymGroups.ts";',
      'export { wordSenseTagFor, SENSE_TAGGED_WORDS } from "./src/lib/wordSenseTags.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "word-sense-tags-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("word-sense-tags", module);
compiled.filename = path.join(root, ".word-sense-tags.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildWordCatalog,
  canonicalWordSenseFor,
  primaryWordSense,
  wordSenseTagFor,
  SENSE_TAGGED_WORDS,
} = compiled.exports;

/** The same key wordSenseTags.ts uses: no article, no reflexive pronoun. */
const tagKey = (value) => String(value ?? "")
  .trim()
  .toLocaleLowerCase("de-DE")
  .replace(/^(der|die|das)\s+/, "")
  .replace(/^sich\s+/, "")
  .trim();

// ── how many meanings the packs claim for each lemma ─────────────────────
// Only a seed that SHOWS the word votes. An idiom built on the lemma has its
// own meaning and never owns the card, so it must not make the card look
// ambiguous either — the same rule buildWordCatalog applies when it decides
// whether a word is safe to read out passively.
const authoredSenses = new Map();
for (const blueprint of Object.values(allPartBlueprints)) {
  for (const seed of blueprint.seeds ?? []) {
    const lookup = String(seed.lookup || seed.de || "");
    const shown = String(seed.de || "").replace(/^(der|die|das)\s+/i, "").replace(/^sich\s+/i, "").trim();
    if (!shown || /\s/.test(shown)) continue;
    if (shown.toLocaleLowerCase("de-DE") !== lookup.replace(/^sich\s+/i, "").trim().toLocaleLowerCase("de-DE")) continue;
    const key = tagKey(lookup);
    if (!key) continue;
    const sense = primaryWordSense(String(seed.fallbackEn || ""))
      || String(seed.fallbackEn || "").toLocaleLowerCase("en-GB").trim();
    if (!sense) continue;
    if (!authoredSenses.has(key)) authoredSenses.set(key, new Set());
    authoredSenses.get(key).add(sense);
  }
}

const parts = {};
for (const [partKey, blueprint] of Object.entries(allPartBlueprints)) {
  parts[partKey] = buildApiPartFromResolved(blueprint, {});
}
// Listen omits the words it has no agreed meaning for, so those are not the
// ones this is about: an unspoken word cannot be misheard.
const listenWords = buildWordCatalog(parts, "conversation").filter((word) => word.listenSafe !== false);

const ambiguous = listenWords.filter((word) => {
  const key = tagKey(word.lookup || word.de);
  return Boolean(canonicalWordSenseFor(word.lookup)) || (authoredSenses.get(key)?.size ?? 0) >= 2;
});

let failures = 0;
const fail = (message) => { failures += 1; console.error(`FAIL ${message}`); };
const ok = (message) => console.log(`ok   ${message}`);

assert.ok(ambiguous.length > 200, `expected the ambiguous set to be substantial, found ${ambiguous.length}`);
ok(`${ambiguous.length} words in Listen carry more than one meaning`);

// ── every ambiguous word is tagged ───────────────────────────────────────
const untagged = ambiguous.filter((word) => !word.senseTag);
if (untagged.length) {
  fail(`${untagged.length} ambiguous words reach Listen with no meaning tag:`);
  for (const word of untagged.slice(0, 20)) {
    console.error(`     ${tagKey(word.lookup || word.de)}  ${word.de} = ${word.en}`);
  }
  if (untagged.length > 20) console.error(`     ... and ${untagged.length - 20} more`);
} else {
  ok("every ambiguous word in Listen names the meaning it is on");
}

// ── no tag outlives its word ─────────────────────────────────────────────
const live = new Set(listenWords.map((word) => tagKey(word.lookup || word.de)));
const dead = SENSE_TAGGED_WORDS.filter((key) => !live.has(key));
if (dead.length) {
  fail(`${dead.length} meaning tags name a word Listen no longer has: ${dead.join(", ")}`);
} else {
  ok("every meaning tag belongs to a word Listen still plays");
}

// ── shape: short, and not the gloss again ────────────────────────────────
const bareGloss = (value) => String(value ?? "")
  .toLocaleLowerCase("en-GB")
  .replace(/\([^)]*\)/g, " ")
  .replace(/[^a-z\s]/g, " ")
  .replace(/\b(a|an|the|to)\b/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const tooLong = [];
const tooShort = [];
const restated = [];
for (const word of ambiguous) {
  const tag = word.senseTag;
  if (!tag) continue;
  const words = tag.trim().split(/\s+/).length;
  if (words > 4) tooLong.push(`${tagKey(word.lookup || word.de)} (${words} words: ${tag})`);
  if (words < 2) tooShort.push(`${tagKey(word.lookup || word.de)} (${tag})`);
  if (bareGloss(tag) && bareGloss(tag) === bareGloss(word.en)) {
    restated.push(`${tagKey(word.lookup || word.de)} (${tag})`);
  }
}
if (tooLong.length) fail(`a meaning tag is read at a glance — these run long: ${tooLong.join(", ")}`);
else ok("every meaning tag is four words or fewer");
if (tooShort.length) fail(`one word cannot place a meaning: ${tooShort.join(", ")}`);
else ok("every meaning tag is at least two words");
if (restated.length) fail(`these tags only repeat the translation above them: ${restated.join(", ")}`);
else ok("no meaning tag merely restates its own gloss");

// ── sentences are left alone ─────────────────────────────────────────────
// A sentence is its own context. Tagging one would be ink for nothing, and
// the card renders the tag only for words.
const listenView = read("src/components/listen/ListenView.tsx");
if (listenView.includes('item.kind === "word" && item.senseTag')) {
  ok("the card shows the meaning tag on words only");
} else {
  fail("ListenView must render the meaning tag for word cards only");
}
if (listenView.includes('uiFmt("Meaning here: {sense}"')) {
  ok("the tag is rendered through the translation layer");
} else {
  fail("the meaning tag must be rendered through uiFmt so a German app reads German");
}
if (read("src/lib/i18n.ts").includes('"Meaning here: {sense}": ')) {
  ok("the meaning tag label has a German translation");
} else {
  fail("i18n.ts is missing the German translation for the meaning tag label");
}
if (read("src/index.css").includes(".sense-note {")) {
  ok("the meaning tag has its own styling");
} else {
  fail("index.css is missing .sense-note");
}

if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll word sense tag checks passed (${ambiguous.length} tagged words).`);
