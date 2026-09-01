#!/usr/bin/env node
/**
 * Listen can play the biggest pieces first.
 *
 * Every other queue order sorts by something about how well the material is
 * known or how useful it is. None of them by how much of it there is — and
 * Listen now holds three sizes of thing: a whole passage, a sentence, a single
 * word. A session of the longest is a different exercise from a session of the
 * shortest. Long pieces are where the language joins up, where a clause hands
 * over to the next one, and where listening is actually hard; short ones are
 * where recognition is. Being able to ask for one of those is the feature.
 *
 * What this guards is that the order is real, not a label. It builds the queue
 * the app builds and reads the positions back: the biggest card leads, every
 * card is at least as long as the one after it, and the shortest material ends
 * up at the back rather than scattered through.
 *
 * It measures LENGTH and says so. Word cards are built from the learner's own
 * tracker, which is empty in a check with no profile, so the queue here is
 * passages and sentences — and an assertion phrased as "the words are at the
 * back" would be reporting something it had not seen.
 *
 * It also guards the thing that would quietly ruin it — sorting on the meaning
 * as well as on the target. A short German sentence with a long English gloss
 * is not a longer piece of German, and a length that counted both would file
 * it as one.
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildListenQueue, listenItemLength, LISTEN_QUEUE_ORDERS } from "./src/lib/listenMode.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts } from "./src/lib/contentBank.ts";
    `,
    resolveDir: root, sourcefile: "longest.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("longest", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "longest.cjs"));
const { buildListenQueue, listenItemLength, LISTEN_QUEUE_ORDERS, allPartBlueprints, buildBundledParts } = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

check("the order is one the app will accept", LISTEN_QUEUE_ORDERS.includes("longest"),
  "the picker could offer it and the setting would fall back to the default on the next read");

// ── length is the target line, and only that ────────────────────────────────
check("length is measured on the line being learned",
  listenItemLength({ de: "abcdefghij", en: "x" }) === 10,
  `got ${listenItemLength({ de: "abcdefghij", en: "x" })}`);
check("a long meaning does not make a short target long",
  listenItemLength({ de: "Hallo", en: "a very long English gloss indeed, going on and on" }) === 5,
  "the meaning is counted too, so a short sentence with a wordy gloss sorts as a big piece");
check("a card with no target is zero rather than a crash",
  listenItemLength({}) === 0 && listenItemLength({ de: null }) === 0);

// ── the queue the app actually builds ───────────────────────────────────────
const parts = { ...allPartBlueprints, ...buildBundledParts() };
const queue = buildListenQueue(parts, {}, { contentSource: "mixed", order: "longest" });
check("the queue is not empty", queue.length > 50, `only ${queue.length} cards built`);

const lengths = queue.map(listenItemLength);
const descending = lengths.every((value, index) => index === 0 || lengths[index - 1] >= value);
check("every card is at least as long as the one after it", descending,
  (() => {
    const at = lengths.findIndex((value, index) => index > 0 && lengths[index - 1] < value);
    return at < 0 ? "" : `card ${at} is ${lengths[at]} long, behind one of ${lengths[at - 1]}`;
  })());

check("the biggest piece leads", lengths[0] === Math.max(...lengths),
  `the queue opens on a ${lengths[0]}-character card while a ${Math.max(...lengths)}-character one waits`);

/**
 * The sizes end up in bands, which is the point.
 *
 * Not asserted as "all passages, then all sentences": the order sorts by
 * length and a long sentence genuinely is longer than a short passage. What
 * has to be true is the thing a learner asked for — that the small stuff is at
 * the back, so the first stretch of a session is the substantial material.
 */
const firstTenth = lengths.slice(0, Math.floor(lengths.length / 10));
const lastTenth = lengths.slice(-Math.floor(lengths.length / 10));
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
check("the opening stretch is the substantial material", mean(firstTenth) > mean(lastTenth) * 3,
  `the first tenth averages ${Math.round(mean(firstTenth))} characters and the last ${Math.round(mean(lastTenth))} — `
  + "not the difference between a paragraph and a word");

const shortest = lengths.filter((value) => value > 0 && value <= 12);
if (shortest.length > 20) {
  const firstShortAt = lengths.findIndex((value) => value > 0 && value <= 12);
  check("the shortest cards wait behind the longer ones", firstShortAt > lengths.length / 2,
    `the first word-sized card is at position ${firstShortAt} of ${lengths.length}`);
}

// ── and it is a choice a learner can make ───────────────────────────────────
const view = read("src/components/listen/ListenView.tsx");
check("the picker offers it", /"longest", "Longest first",/.test(view),
  "the order exists but nothing on screen can choose it");
check("the settings text says what it does",
  view.includes("Longest first plays the biggest pieces first"),
  "the group explains the other orders and not this one");

const TABLES = {
  German: "src/lib/i18nDe.ts",
  French: "src/lib/i18nFr.ts",
  Polish: "src/lib/i18nPl.ts",
  Spanish: "src/lib/i18nEs.ts",
  Italian: "src/lib/i18nIt.ts",
  Portuguese: "src/lib/i18nPt.ts",
};
for (const [language, file] of Object.entries(TABLES)) {
  const table = read(file);
  check(`it reads in ${language}`,
    table.includes('"Longest first":') && table.includes("Longest first plays the biggest pieces first"),
    "the label or the explanation is untranslated");
}

if (failed) {
  console.error(`\n${failed} longest-first check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-longest-first: ${queue.length} cards ordered biggest to smallest — the opening tenth averages `
  + `${Math.round(mean(firstTenth))} characters against ${Math.round(mean(lastTenth))} at the end`
);
process.exit(0);
