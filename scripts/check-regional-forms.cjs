#!/usr/bin/env node
/**
 * A card that is not everyday neutral language has to say so, in every mode.
 *
 * curriculum.ts already labels twenty-six packs — "Regional — not used
 * everywhere", "18+ · intimate", "Strong language — know it, use with care",
 * "Youth slang", "Gamer talk". session.ts puts that note on every catalogue
 * item as tierNote, and the lesson view has shown it since it was written.
 *
 * Listen and the Matcher dropped it. They build a sentence item out of a
 * fixed shape —
 *
 *   sentences: { id, aliases, de, en, kind, popularity }
 *   MatcherPair: { id, de, en, aliases }
 *
 * — and tierNote was not in it, so 762 of the queue's 20,971 items arrived
 * stripped of their warning in exactly the two modes that teach by
 * repetition. "Ich komm." against "I'm coming." is an unremarkable matching
 * pair; it comes from the 18+ pack, and nothing on the board said so.
 *
 * Two things are checked, and the second is the one that rots: that the note
 * still reaches the queue, and that both surfaces still render it. A queue
 * carrying a field nobody draws is the same bug wearing a passing test.
 *
 * The parts are assembled the way the app assembles them — blueprint packs
 * merged with the curated phrasebank, filtered per course. Reading
 * allPartBlueprints alone is 491 of 556 parts and misses every curated pack.
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
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";',
      'export { buildListenQueue } from "./src/lib/listenMode.ts";',
      'export { buildMatcherQueue } from "./src/lib/matcher.ts";',
      'export { loadGradeStore } from "./src/lib/activity.ts";',
      'export { packMeta } from "./src/lib/curriculum.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "regional-forms-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("regional-forms-check", module);
compiled.filename = path.join(root, ".regional-forms-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, buildApiPartFromResolved, buildBundledParts,
  filterPartsForLearningDirection, buildListenQueue, buildMatcherQueue,
  loadGradeStore, packMeta } = compiled.exports;

/** The app's own assembly, for one course. */
function partsFor(direction) {
  const blueprintParts = {};
  for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
    try { blueprintParts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
  }
  return filterPartsForLearningDirection(
    { ...blueprintParts, ...buildBundledParts(direction) }, direction);
}

// ── the packs that need a warning still have one ────────────────────────────
for (const [key, expect] of [
  ["part16", /regional/i],
  ["cb-geordie", /regional|Newcastle/i],
  ["part20", /18\+/],
  ["part29", /strong language/i],
  ["part14", /slang/i],
]) {
  const note = packMeta(key).note ?? "";
  assert.ok(expect.test(note),
    `pack ${key} has lost its register warning (note is ${JSON.stringify(note)})`);
}

const summary = [];
for (const direction of ["learn-de", "learn-en"]) {
  const parts = partsFor(direction);
  const curated = Object.keys(parts).filter((key) => key.startsWith("cb-")).length;
  assert.ok(curated > 40,
    `${direction}: only ${curated} curated packs reached the queue — the phrasebank is not being `
    + "assembled the way the app assembles it, and this check would miss everything in it");

  const queue = buildListenQueue(parts, loadGradeStore(null),
    { contentSource: "mixed", order: "common", direction });
  assert.ok(queue.length > 15000, `${direction}: the queue did not build (${queue.length} items)`);

  const flagged = queue.filter((item) => item.tierNote);
  assert.ok(flagged.length > 300,
    `${direction}: only ${flagged.length} queue items carry a register warning. `
    + "The packs are labelled and the queue is dropping the label on the way in — "
    + "which is the bug this exists for, and it is silent.");

  // The 18+ and strong-language packs are the ones it matters most for.
  for (const needle of ["18+", "Strong language"]) {
    assert.ok(flagged.some((item) => String(item.tierNote).includes(needle)),
      `${direction}: nothing in the queue carries the ${JSON.stringify(needle)} warning`);
  }

  // And the Matcher, which maps the queue into its own shape and could drop it
  // again there without Listen noticing.
  const board = buildMatcherQueue(parts, "both", null);
  const boardFlagged = board.filter((pair) => pair.tierNote).length;
  assert.ok(boardFlagged > 300,
    `${direction}: only ${boardFlagged} Matcher pairs carry a register warning — `
    + "MatcherPair is dropping tierNote on its way out of the queue");

  /**
   * The warning is word-honest.
   *
   * A pack's note describes the pack's SENSE, and every sentence in the two
   * intimate packs genuinely belongs to that register — but the words were
   * inheriting it wholesale, so "die Lust" (Lust auf Pizza — core, innocent
   * German) sat in the matcher wearing an 18+ badge, alongside "die Grenze"
   * (a country border), "übernachten" (what children do at a friend's
   * house) and "heiß" (the weather). A bare word card has no pack context;
   * its badge has to be about the word. Both directions pinned: everyday
   * words carry nothing, and the words whose standard use really is this
   * register — begehren, devot — keep the badge, as does every sentence.
   *
   * These name specific words on purpose: each doubles as a drift guard,
   * because a rename or a typo in the everyday list brings the badge back
   * and fails here.
   */
  // The German course only: the other direction's queue holds English words.
  if (direction === "learn-de") {
    const wordCard = (needle) => queue.find(
      (item) => item.kind === "word" && String(item.de) === needle
    );
    for (const innocent of ["die Lust", "die Grenze", "heiß", "übernachten"]) {
      const card = wordCard(innocent);
      if (!card) continue; // combined synonym cards can rename a face; the named ones below still hold
      assert.ok(!card.tierNote,
        `${direction}: the word card for ${JSON.stringify(innocent)} carries `
        + `${JSON.stringify(card.tierNote)} — everyday German wearing its pack's intimate badge again`);
    }
    const lust = wordCard("die Lust");
    assert.ok(lust, `${direction}: "die Lust" is missing from the word queue entirely`);
    for (const explicit of ["begehren", "devot"]) {
      const card = wordCard(explicit);
      if (!card) continue;
      assert.ok(String(card.tierNote ?? "").includes("18+"),
        `${direction}: ${JSON.stringify(explicit)} lost its 18+ badge — that word's standard use IS this register`);
    }
    const intimateSentence = queue.find(
      (item) => item.kind === "sentence" && String(item.tierNote ?? "").includes("18+")
    );
    assert.ok(intimateSentence,
      `${direction}: no sentence carries the 18+ badge any more — the word fix has bled into sentences`);
  }

  summary.push(`${direction}: ${flagged.length} of ${queue.length} warned, ${boardFlagged} on the board`);
}

// ── and both surfaces actually draw it ──────────────────────────────────────
// A queue carrying a field nobody renders passes every assertion above and
// shows the learner nothing.
const listen = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
const matcher = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
assert.ok(/item\.tierNote/.test(listen) && /register-note/.test(listen),
  "Listen receives the register warning and does not draw it");
assert.ok(/pair\.tierNote/.test(matcher) && /register-note/.test(matcher),
  "the Matcher receives the register warning and does not draw it");
const styles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
assert.ok(/\.register-note\s*\{/.test(styles), "the register warning has no styling of its own");

console.log(`check-regional-forms: the register warning reaches both modes and both draw it — `
  + summary.join("; "));
// esbuild's service keeps two sockets open after buildSync returns, so the
// event loop never empties and the build would wait for ever on a check that
// finished in a second. check-matcher-preference ends the same way.
process.exit(0);
