#!/usr/bin/env node
/**
 * A word is ranked on its own mentions, not on another word's.
 *
 * The frequency index counts how often the course's own sentences say each
 * word, and that count decides two things a learner sees directly: where the
 * word sits in "Most common first", and the CEFR badge on its card.
 *
 * Counting has to guess at endings — the corpus writes "Blumen" and the card
 * says "die Blume", and nothing but an ending rule connects them. The guess is
 * that a noun in -e is an inflected form, so the -e is stripped and the stem
 * looked up too. That is right for Blumen and Erdbeeren, and wrong for every
 * noun whose own dictionary form ends in -e: strip it from "Plane" and you get
 * "Plan", which is a different word the course teaches in its own right.
 *
 * The one thing that can tell those two cases apart is knowing whether the
 * stem is itself a word this course teaches. That set was read from a field
 * name no built part has, so it was empty, and the guard had never once fired:
 * die Plane, a tarpaulin, was collecting all fourteen mentions of der Plan and
 * arriving 300th in a queue that promises the commonest words first — ahead of
 * die Wand, der Grund and die Verspätung. die Buche was paid in das Buch, die
 * Rabatte in der Rabatt, die Linke in der Link.
 *
 * Nothing on screen said so. The rank looked like a rank and the badge looked
 * like a badge, and a tarpaulin reading A1 is only wrong if you happen to know
 * what a tarpaulin is.
 *
 * So this holds the rule rather than the field name or any word's position:
 * the index can see what the course teaches, and no card is paid in the
 * mentions of another card.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

function load(entry, name) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: `${name}.ts`, loader: "ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20",
    write: false, logLevel: "silent",
  });
  const mod = new Module(path.join(root, `${name}.cjs`), module);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(built.outputFiles[0].text, path.join(root, `${name}.cjs`));
  return mod.exports;
}

global.window = {
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
};
global.localStorage = global.window.localStorage;

const { allPartBlueprints } = load('export { allPartBlueprints } from "./src/lib/data.ts";', "wm-bp");
const { buildApiPartFromResolved } = load(
  'export { buildApiPartFromResolved } from "./src/lib/api.ts";', "wm-api");
const cf = load('export * from "./src/lib/corpusFrequency.ts";', "wm-cf");
const { buildWordCatalog } = load(
  'export { buildWordCatalog } from "./src/lib/wordSession.ts";', "wm-ws");

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* a pack that will not build is not this check's business */ }
}

const index = cf.buildCorpusIndex(parts);
const catalog = buildWordCatalog(parts);

// ── the index can see what the course teaches ───────────────────────────────
// Stated as coverage of the catalogue rather than as a size, because the
// failure this catches is the set being fed from the wrong field, and a set
// fed from the wrong field is empty however many words the course grows to.
const unseen = catalog.filter((word) => !index.headwords.has(cf.corpusKey(word.lookup || word.de)));
check(
  "every word the course teaches is a word the frequency index knows about",
  unseen.length === 0,
  unseen.length === catalog.length
    ? "the index knows NONE of them, so the guard below can never fire — it is almost"
      + " certainly reading a field the built parts do not have"
    : `${unseen.length} are invisible to it, e.g. ${unseen.slice(0, 8).map((w) => w.de).join(", ")}`
);

// ── and no card is paid in another card's mentions ──────────────────────────
// A word with an empty tally of its own, credited the exact tally of another
// word the course teaches whose spelling it contains, is not that word
// inflected. It is that word, and the mentions belong to it.
const owned = (word) => {
  const name = word.lookup || word.de;
  const key = cf.corpusKey(name);
  const shaped = cf.looksLikeGermanNoun(name) ? index.nounCount : index.otherCount;
  return (shaped.get(key) ?? 0) + (index.initialCount.get(key) ?? 0);
};

const taught = new Map();
for (const word of catalog) {
  const key = cf.corpusKey(word.lookup || word.de);
  if (key && !taught.has(key)) taught.set(key, word);
}

/**
 * The two words differ by an ending, and not by a whole second word.
 *
 * A bare prefix test is not enough: "Autoradio" begins with "Autor" and
 * "Pinguin" with "Ping", and neither is any word inflected. What the lemma
 * rules actually strip is an inflectional ending, so that is the only
 * difference that can make one of these words look like the other.
 */
const ENDINGS = ["", "e", "n", "en", "s", "es", "er", "ern", "nen"];
const differByEnding = (a, b) => {
  const [shortKey, longKey] = a.length <= b.length ? [a, b] : [b, a];
  if (!longKey.startsWith(shortKey)) return false;
  return ENDINGS.includes(longKey.slice(shortKey.length));
};

const stolen = [];
for (const word of catalog) {
  const name = word.lookup || word.de;
  const key = cf.corpusKey(name);
  const total = cf.corpusUses(name, index);
  if (!key || total === 0 || owned(word) > 0) continue;
  for (const [otherKey, other] of taught) {
    if (otherKey === key) continue;
    if (!differByEnding(key, otherKey)) continue;
    if (owned(other) !== total) continue;
    stolen.push(`${word.de} (${word.en}) has no mentions of its own and is credited`
      + ` all ${total} of ${other.de}'s`);
    break;
  }
}
check(
  "no word is ranked on the mentions of another word the course teaches",
  stolen.length === 0,
  stolen.slice(0, 10).join("\n     ")
);

// ── the guard is load-bearing, not decoration ───────────────────────────────
// Built a second time from parts with the vocabulary list taken away, which is
// exactly the state the bug left it in. If the answer is the same either way
// then the guard is not doing anything and the two checks above are passing on
// a coincidence.
const blind = {};
for (const [key, part] of Object.entries(parts)) blind[key] = { ...part, vocab: undefined, seeds: undefined };
const blindIndex = cf.buildCorpusIndex(blind);
const changed = catalog.filter((word) => {
  const name = word.lookup || word.de;
  return cf.corpusUses(name, index) !== cf.corpusUses(name, blindIndex);
});
check(
  "and taking the vocabulary away visibly changes what the index counts",
  changed.length > 0,
  "the index counts the same with and without the list of taught words, so nothing is guarding anything"
);

if (failed) {
  console.error(`\n${failed} word-mention check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-word-mentions: the index knows all ${catalog.length} taught words,`
  + ` no card is paid in another card's mentions, and ${changed.length} words are counted`
  + " differently because of it"
);
process.exit(0);
