#!/usr/bin/env node
/**
 * Every Listen setting says what it does, and every choice does something.
 *
 * Listen has more knobs than any other screen — what plays, in what order,
 * which levels, how useful, how soon something comes back, which language
 * first, how many repeats. A knob without an explanation is a guess, and a
 * knob whose explanation names four of six choices leaves two of them as
 * guesses: that was the queue order, which explained Easiest, Most common,
 * Newest and Longest and said nothing about Reviews & struggles or Least
 * heard — the two whose names explain themselves least.
 *
 * Two things are held here, and both are derived rather than listed:
 *
 *   1. Every settings group carries an explanation, and the queue order's
 *      explanation mentions every order the picker offers — read off the
 *      picker, so adding a seventh order without a sentence for it fails.
 *   2. The choices on screen are exactly the choices the library accepts.
 *      An order in LISTEN_QUEUE_ORDERS with no button cannot be chosen; a
 *      button whose value is not in the list is chosen and then thrown away
 *      on the next read. Both directions are checked for orders, the
 *      within-group leads, and the return gaps and scopes.
 *
 * Whether each filter actually narrows the queue is proven by building it —
 * a level filter that lets one off-level card through is the kind of thing
 * that looks fine on a screen with ten thousand cards on it.
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
      export * from "./src/lib/listenMode.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
    `,
    resolveDir: root, sourcefile: "settings.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("settings", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "settings.cjs"));
const L = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const view = read("src/components/listen/ListenView.tsx");

// ── every group is explained ────────────────────────────────────────────────
// A group is a <legend>; its explanation is the first ui() paragraph inside
// the same fieldset. Read structurally so a group added later is held too.
const fieldsets = [...view.matchAll(/<fieldset[\s\S]*?<\/fieldset>/gu)].map((m) => m[0]);
check("Listen's settings are in fieldsets this can read", fieldsets.length >= 6, `${fieldsets.length} found`);
for (const fieldset of fieldsets) {
  const legend = /<legend[^>]*>\{ui\("([^"]+)"\)\}<\/legend>/u.exec(fieldset)?.[1];
  if (!legend) continue;
  const explained = /<legend[\s\S]*?<\/legend>\s*<p[^>]*>\s*\{ui\("([^"]{40,})"\)\}/u.test(fieldset);
  check(`"${legend}" says what it does`, explained, "the group has a title and no explanation, so its choices are a guess");
}

// ── the order picker and its explanation agree ──────────────────────────────
const orderBlock = /<legend[^>]*>\{ui\("Queue order"\)\}<\/legend>\s*<p[^>]*>\s*\{ui\("([^"]+)"\)\}/u.exec(view)?.[1] ?? "";
const pickerOrders = [...view.matchAll(/\[\s*"([a-z-]+)",\s*"([^"]+)",?\s*\]/gu)]
  .map((m) => [m[1], m[2]])
  .filter(([value]) => L.LISTEN_QUEUE_ORDERS.includes(value));
const orderLabels = new Map(pickerOrders.map(([value, label]) => [value, label]));
check("the picker offers every order the library accepts",
  L.LISTEN_QUEUE_ORDERS.every((order) => orderLabels.has(order)),
  `missing a button: ${L.LISTEN_QUEUE_ORDERS.filter((order) => !orderLabels.has(order)).join(", ")}`);
for (const [value, label] of orderLabels) {
  // The explanation names the choice by the start of its label — "Newest
  // first" is named as "Newest first", "Easiest first (A1 → C1)" as
  // "Easiest first". Every order gets a sentence, not just the obvious ones.
  const name = label.replace(/\s*\(.*\)$/u, "");
  check(`the queue order text explains "${name}"`, orderBlock.includes(name),
    `the picker offers ${name} and the explanation above it never mentions it`);
}

// ── every choice on screen is one the library accepts, and vice versa ───────
const pairs = (name) => [...view.matchAll(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const;`, "gu"))]
  .flatMap((m) => [...m[1].matchAll(/\[\s*"([a-z-]+)",/gu)].map((x) => x[1]));
for (const [screenName, libList, what] of [
  ["WITHIN_CHOICES", L.LISTEN_QUEUE_WITHINS, "what leads each group"],
  ["RETURN_GAP_CHOICES", L.LISTEN_RETURN_GAPS, "how soon something comes back"],
  ["RETURN_SCOPE_CHOICES", L.LISTEN_RETURN_SCOPES, "what has to wait"],
]) {
  const onScreen = pairs(screenName);
  if (!libList) { check(`the library exports a list for ${what}`, false, `nothing to compare ${screenName} against`); continue; }
  check(`${what}: every button is a value the library keeps`,
    onScreen.every((value) => libList.includes(value)),
    `on screen but rejected on the next read: ${onScreen.filter((value) => !libList.includes(value)).join(", ")}`);
  check(`${what}: every value the library keeps has a button`,
    libList.every((value) => onScreen.includes(value)),
    `accepted but unreachable: ${libList.filter((value) => !onScreen.includes(value)).join(", ")}`);
}

// ── the learning loop is described in things, not abstractions ─────────────
/**
 * "Hear a small set, then revisit the same items" was accurate and meant
 * nothing to the person reading it. What happens is concrete — you hear a
 * few cards, then those same cards again, then the next few — and "set" was
 * an abstraction standing in for that. The loop's copy has to name cards,
 * and the header chip has to say the same thing as the settings under it,
 * so a learner who reads one is not surprised by the other.
 */
// Bounded by the 1× note, the last line of the block. A fixed character
// count cut the second summary string in half, the check failed on a clean
// tree, and every injection looked caught because of it.
const loopBlock = view.slice(view.indexOf('ui("Learning loop")'), view.indexOf('ui("At 1× each card plays once') + 120);
check("the loop copy talks about cards", /ui\("Cards at a time"\)/u.test(loopBlock) && /\bcards\b/u.test(loopBlock),
  "the loop settings no longer say what a loop is made of");
check("and never about sets", !/\bsets?\b/u.test(loopBlock),
  "the word \"set\" is back — it is an abstraction, and it was the reason this copy was unclear");
// There are two summaries — one for a mixed loop, one for a plain one — and
// EACH has to carry both numbers. Asserted as one regex first, which the
// mixed variant satisfied on its own while the plain one had been replaced
// with a fixed "3 cards, 2×": an injection walked straight past it.
const summaries = [...loopBlock.matchAll(/"(Right now:[^"]*)"/gu)].map((m) => m[1]);
check("both summaries are built from the learner's own numbers",
  summaries.length === 2 && summaries.every((text) => text.includes("{total}") && text.includes("{passes}")),
  summaries.length !== 2
    ? `${summaries.length} summary strings found, expected the mixed and the plain one`
    : `a summary carries a fixed number instead of the chosen one: ${summaries.find((text) => !text.includes("{total}") || !text.includes("{passes}"))}`);
check("the header chip says the same thing as the settings",
  view.includes('"{items} cards at a time, heard {passes}×"') && !view.includes("-item loop"),
  "the chip at the top still says \"3-item loop, 2 passes\" while the settings underneath say cards");

// ── and the filters narrow, measured on the real queue ─────────────────────
const parts = L.allPartBlueprints;
const build = (options) => L.buildListenQueue(parts, {}, { contentSource: "sentences", order: "level", ...options });
const everything = build({});
check("there is a queue to filter", everything.length > 1000, `${everything.length} cards`);

const low = (card) => String(card.levelLabel ?? "").toUpperCase().split(/[–-]/u)[0];
for (const levels of [["a1"], ["b1"], ["a1", "a2"]]) {
  const narrowed = build({ levels });
  const wanted = levels.map((step) => step.toUpperCase());
  const stray = narrowed.filter((card) => !wanted.includes(low(card)));
  check(`the level filter ${levels.join("+")} lets nothing else through`,
    narrowed.length > 0 && stray.length === 0,
    stray.length ? `${stray.length} off-level cards, e.g. [${stray[0].levelLabel}] ${String(stray[0].de).slice(0, 40)}` : "an empty queue");
}
const useful = build({ usefulness: ["essential"] });
check("the usefulness filter narrows rather than decorates",
  useful.length > 0 && useful.length < everything.length / 2,
  `${useful.length} of ${everything.length}`);

const passages = build({ contentSource: "passages" });
check("asking for passages gives passages and nothing else",
  passages.length > 0 && passages.every((card) => card.kind === "passage"));

if (failed) {
  console.error(`\n${failed} listen settings check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-listen-settings: ${fieldsets.length} groups explained, all ${orderLabels.size} orders named in the order text, `
  + "every button matches the library, and the level, usefulness and source filters narrow the real queue"
);
process.exit(0);
