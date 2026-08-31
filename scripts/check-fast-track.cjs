#!/usr/bin/env node
/**
 * The fast track teaches conversation and nothing else.
 *
 * Continue learning walks the curriculum in order, which is right for working
 * through a course and slow for somebody who wants to talk to a person: the
 * order has the rooms of a house, the things on a desk and the parts of a car
 * in it. The fast track is the same seven stages over a much smaller course —
 * the two conversational bands, in the order they were already authored.
 *
 * WHAT IS LEFT OUT IS THE FEATURE, so that is what is asserted. A pack list
 * that quietly grew to include the furniture would still look like a fast
 * track from the outside, still start a lesson, and still be wrong; nothing
 * in a screenshot or a passing build would say so.
 *
 * It is deliberately not a claim that every pack in the list is the right
 * one. Which topics count as conversational is an editorial judgement living
 * in conversationPriority.ts, and a check that restated it would just be that
 * file typed twice. This asserts the boundary: the named rooms-and-furniture
 * packs stay out, the named friends-and-family ones stay in, and the button
 * always resolves to something teachable.
 */
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { FAST_TRACK_PACKS, nextFastTrackPart } from "./src/lib/conversationPriority.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts } from "./src/lib/contentBank.ts";
    `,
    resolveDir: root, sourcefile: "ft.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("ft", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "ft.cjs"));
const { FAST_TRACK_PACKS, nextFastTrackPart, allPartBlueprints, buildBundledParts } = mod.exports;

// The catalogue a sitting actually sees: hand-written blueprints PLUS the
// bundled phrasebank, which is where every cb-* pack lives. Checking against
// the blueprints alone reports two dozen conversational packs as missing.
const catalogue = { ...allPartBlueprints, ...buildBundledParts() };

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// ── every pack it names has to exist ────────────────────────────────────────
const missing = FAST_TRACK_PACKS.filter((packId) => !catalogue[packId]);
check(`every fast-track pack is one the app actually has (${FAST_TRACK_PACKS.length} packs)`,
  missing.length === 0,
  missing.length ? `${missing.length} name nothing: ${missing.slice(0, 8).join(", ")}` : "");

/**
 * The packs the fast track exists to skip.
 *
 * Named rather than derived: there is no property that marks a pack as
 * furniture, and inventing one to satisfy a check would be a worse version of
 * the editorial list this is guarding.
 */
const MUST_BE_EXCLUDED = [
  ["part586", "Rooms and what stands in them"],
  ["part535", "The bathroom and the bedroom"],
  ["part472", "Around the house"],
  ["part512", "School and desk things"],
  ["part469", "Vegetables and herbs"],
  ["part473", "Clothes and fabrics"],
  ["part530", "Shapes, sides and directions"],
];
const leaked = MUST_BE_EXCLUDED.filter(([packId]) => FAST_TRACK_PACKS.includes(packId));
check("the rooms-and-furniture packs are not in it",
  leaked.length === 0,
  leaked.map(([id, theme]) => `${id} (${theme})`).join(", "));

/** ...and the ones it exists to reach. */
const MUST_BE_INCLUDED = [
  ["cb-greetings", "Greetings & politeness"],
  ["cb-introductions", "Introducing yourself"],
  ["cb-family", "Family & relationships"],
  ["cb-conversation-repair", "keeping a conversation going"],
  ["cb-reactions", "quick reactions"],
  ["part7", "People and family"],
];
const absent = MUST_BE_INCLUDED.filter(([packId]) => !FAST_TRACK_PACKS.includes(packId));
check("the conversation packs a learner came for are in it",
  absent.length === 0,
  absent.map(([id, theme]) => `${id} (${theme})`).join(", "));

// ── it continues, and it always has an answer ───────────────────────────────
const present = Object.fromEntries(FAST_TRACK_PACKS.map((packId) => [packId, {}]));
const fresh = nextFastTrackPart(present, () => true);
check("with nothing finished it starts at the first conversational pack",
  fresh === FAST_TRACK_PACKS[0], `started at ${fresh}`);

const firstThree = new Set(FAST_TRACK_PACKS.slice(0, 3));
const afterThree = nextFastTrackPart(present, (packId) => !firstThree.has(packId));
check("it skips what is finished rather than restarting",
  afterThree === FAST_TRACK_PACKS[3], `expected ${FAST_TRACK_PACKS[3]}, got ${afterThree}`);

check("with everything finished it still returns a pack, never nothing",
  nextFastTrackPart(present, () => false) === FAST_TRACK_PACKS[0],
  "a button on screen that resolves to null teaches nothing when pressed");

check("a catalogue without the conversational packs resolves to nothing rather than guessing",
  nextFastTrackPart({}, () => true) === null);

// ── the card, where the learner looks for it ────────────────────────────────
const view = fs.readFileSync(path.join(root, "src/components/duo/DuoPathView.tsx"), "utf8");

check("the fast track card is on the home row", /onClick=\{onFastTrack\}/.test(view));

/**
 * Second, right after Continue learning — counted from what is actually on
 * the row, not from a list written here.
 *
 * Position is the request, not decoration: it is the card meant to be seen
 * beside the one it offers an alternative to.
 *
 * The first draft of this named five cards outright — including the quick
 * path, which was removed the same day for being a second teacher of one
 * course. That is precisely the failure this check was extended to stop, and
 * writing it down did not stop me repeating it one file over.
 *
 * So the candidates are the cards that could be there, and the ways in are
 * whichever of them actually are, in the order the source renders them. What
 * is asserted is the part that was asked for and cannot be inferred: Continue
 * learning first, the fast track immediately after it.
 */
const CANDIDATES = ["Guided session", "Fast track", "Quick path", "Matcher", "Conversation"];
const labels = CANDIDATES
  .map((label) => ({ label, at: view.indexOf(`ui("${label}")`) }))
  .filter((entry) => entry.at >= 0)
  .sort((a, b) => a.at - b.at)
  .map((entry) => entry.label);

check("Continue learning still leads the row", labels[0] === "Guided session", labels.join(" -> "));
check("the fast track sits immediately after it",
  labels[1] === "Fast track",
  `the row reads ${labels.join(" -> ")}`);

/**
 * The row has to fit them all at its widest, or the last card added sits
 * alone on a second row looking like an afterthought.
 *
 * This rule lives here and nowhere else. It used to live in check-matcher and
 * in check-conversation-scenarios as well, each written as the literal column
 * count of the day — `lg:grid-cols-4` in both — so adding a fifth card broke
 * two checks that have nothing to do with matching or with conversations.
 * Counted from the labels instead, it needs no editing the next time a way in
 * is added, and there is one place to look when it fails.
 */
const columns = [...view.matchAll(/grid-cols-(\d+)/g)].map((m) => Number(m[1]));
check("the row lays out every way into Learn on one row at its widest",
  columns.includes(labels.length),
  `the widest row is ${Math.max(...columns, 0)} columns for ${labels.length} cards, so one is stranded `
  + `at every width (columns offered: ${columns.join(", ") || "none"})`);

// ── and the door it opens ───────────────────────────────────────────────────
const prototype = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
check('pressing it asks for the fast track', /url\.searchParams\.set\("guided", "fast"\)/.test(prototype));

const session = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
check('the session resolves "fast" to a real pack rather than treating it as one',
  /guidedRequest === "fast"/.test(session) && /fastTrackPart\(\)/.test(session),
  'without this, "fast" is looked up as a pack id, found missing, and the lesson never starts');

check("a paused pack stays out of the fast track too",
  /nextFastTrackPart\(\s*activeParts/.test(session.replace(/\s+/g, " ").replace(/ /g, " "))
    || /withoutMutedPacks\(apiParts\)[\s\S]{0,200}nextFastTrackPart/.test(session),
  "pausing a pack is an instruction; a second button that ignored it would serve what somebody asked not to see");

if (failed) {
  console.error("\nWhat the fast track leaves out is the whole feature.");
  process.exit(1);
}
console.log(
  `check-fast-track: ${FAST_TRACK_PACKS.length} conversational packs, no rooms or furniture among them, `
  + `second of ${labels.length} on the home row, and it always resolves to something teachable`
);
process.exit(0);
