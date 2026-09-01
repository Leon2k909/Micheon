#!/usr/bin/env node
/**
 * The course teaches the beginner's German before the resident's.
 *
 * The order is tier, then level, then the hand order — and this holds the
 * consequences of that rather than the rule, because the consequences are
 * what a learner meets. Inside tier 1 the hand order used to run B1
 * daily-admin packs at positions 26 to 50 — electricity bills, IBAN
 * transfers, insurance, the Amt — while "Numbers, time & dates", "Shopping &
 * money", "Directions and movement" and "Weather & seasons", all A1, sat at
 * 203 to 225. Somebody who could not yet count was being taught to query a
 * heating bill. Past the curated list, packs were appended by id, which is not
 * an order: it put B2 sayings at 29.
 *
 * Not asserted: that "most common first" is the order. It was measured and it
 * is the wrong rule. Sentence commonality against the corpus ranks "In the
 * workshop", "Packing a parcel" and "Crime & Jail" as the three commonest
 * packs, because the metric rewards short function words and the corpus is
 * conversational. Commonality decides order WITHIN a level in Listen, where it
 * works; as the first key it would open the course with the workshop.
 *
 * The tiers are editorial judgement about what everyday German is and are not
 * second-guessed here: every tier-1 pack still precedes every tier-2 pack.
 * What changed is the order inside a tier.
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
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts } from "./src/lib/contentBank.ts";
      export { orderParts, packMeta, CURRICULUM_ORDER } from "./src/lib/curriculum.ts";
      export { cefrOrder, cefrRung } from "./src/lib/cefr.ts";
    `,
    resolveDir: root, sourcefile: "order.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("order", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "order.cjs"));
const { allPartBlueprints, buildBundledParts, orderParts, packMeta, CURRICULUM_ORDER, cefrOrder, cefrRung } = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const parts = { ...allPartBlueprints, ...buildBundledParts() };
const taught = ([, part]) => (part.phrases?.length || part.vocab?.length || part.dialogues?.length);
const ordered = Object.entries(orderParts(parts)).filter(taught);
const title = (part) => String(part.theme || part.label);
const at = (needle) => ordered.findIndex(([, part]) => title(part).includes(needle));

// ── the tiers are intact ────────────────────────────────────────────────────
const tiers = ordered.map(([key]) => packMeta(key).tier);
const reference = ordered.filter(([key]) => key === "part141").length;
const tiersLessReference = ordered.filter(([key]) => key !== "part141").map(([key]) => packMeta(key).tier);
check("every tier-1 pack still comes before every tier-2 pack, and tier 3 last",
  tiersLessReference.every((tier, index) => index === 0 || tiersLessReference[index - 1] <= tier),
  (() => {
    const where = tiersLessReference.findIndex((tier, index) => index > 0 && tiersLessReference[index - 1] > tier);
    return where < 0 ? "" : `a tier-${tiersLessReference[where]} pack sits at #${where + 1} behind a tier-${tiersLessReference[where - 1]} one — the editorial order was overridden`;
  })());

// ── and inside a tier, easier comes first ───────────────────────────────────
for (const tier of [1, 2, 3]) {
  const inTier = ordered.filter(([key]) => packMeta(key).tier === tier && key !== "part141");
  const orders = inTier.map(([, part]) => cefrOrder(part.level));
  const slip = orders.findIndex((value, index) => index > 0 && orders[index - 1] > value);
  check(`inside tier ${tier}, no pack is harder than the one after it`,
    slip < 0,
    slip < 0 ? "" : `${title(inTier[slip - 1][1])} [${inTier[slip - 1][1].level}] is served before ${title(inTier[slip][1])} [${inTier[slip][1].level}]`);
}

// Within one level of one tier, the hand order still decides.
const tierOneA1 = ordered.filter(([key, part]) => packMeta(key).tier === 1 && cefrOrder(part.level) === cefrOrder("A1"));
const handIndex = tierOneA1.map(([key]) => CURRICULUM_ORDER.indexOf(key)).filter((index) => index >= 0);
check("inside one level, the hand order is kept",
  handIndex.every((index, position) => position === 0 || handIndex[position - 1] <= index),
  "two packs of the same tier and level swapped places for no reason the curriculum gives");
check("the course still opens on greetings", title(ordered[0][1]).includes("Greetings"),
  `it opens on ${title(ordered[0][1])}`);

// ── what a beginner meets ───────────────────────────────────────────────────
const firstForty = ordered.slice(0, 40);
const hard = firstForty.filter(([, part]) => cefrRung(part.level) >= 3);
check("the first forty lessons hold nothing at B1 or above",
  hard.length === 0,
  hard.length ? `${hard.length} at B1+: ${hard.slice(0, 4).map(([, part]) => `${title(part).slice(0, 36)} [${part.level}]`).join("; ")}` : "");

for (const [needle, within] of [
  ["Numbers, time & dates", 50],
  ["Shopping & money", 50],
  ["Directions and movement", 60],
  ["Weather & seasons", 60],
]) {
  const position = at(needle);
  check(`"${needle}" is within the first ${within}`,
    position >= 0 && position < within,
    position < 0 ? "not found at all" : `it is lesson ${position + 1}`);
}
for (const needle of ["Sayings Germans actually use", "Strom, Gas und die Heizkosten", "Versicherungen"]) {
  const position = at(needle);
  check(`"${needle}" waits until after the beginner's material`,
    position < 0 || position >= 60,
    `it is lesson ${position + 1}`);
}

// ── reference material is kept, and kept out of the way ────────────────────
const keyboard = at("Typing ä");
check("the keyboard pack is still in the course", keyboard >= 0,
  "it was dropped rather than moved — a learner who cannot type ß has lost the page that tells them how");
check("and it is served after everything that teaches German",
  keyboard === ordered.length - 1,
  `it is lesson ${keyboard + 1} of ${ordered.length}`);

// ── one order, in both views ────────────────────────────────────────────────
const list = read("src/components/lab/LearnView.tsx");
check("the lesson list is drawn in the course order rather than one of its own",
  list.includes("const parts = Object.entries(orderParts(apiParts));")
    && !/\.sort\(\(\[, a\], \[, b\]\) => cefrOrder/u.test(list),
  "the list sorts itself, so it and the path disagree about what comes first");

if (failed) {
  console.error(`\n${failed} curriculum order check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-curriculum-by-level: ${ordered.length} packs in tier, level, hand order — `
  + `the first forty are all A1/A2, numbers are lesson ${at("Numbers, time & dates") + 1}, `
  + `and the keyboard page is last`
);
process.exit(0);
