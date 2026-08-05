#!/usr/bin/env node
/**
 * When the pet asks "do you remember how to say …" and you say no, twice, that
 * phrase has to reach the lesson.
 *
 * Saying no used to leave the pet asking the same question again and again
 * while the lesson never picked it up in any useful order: struggling items
 * are gathered pack by pack, so a phrase failed on a late pack queued behind
 * every older struggle and the three-per-lesson review cap meant it might
 * never be reached at all.
 */
const path = require("path");
const Module = require("module");
const root = path.join(__dirname, "..");
const esbuild = require("esbuild");

function load(entry, name) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: name + ".ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20",
    write: false, logLevel: "silent",
  });
  const mod = new Module(path.join(root, name + ".cjs"), module);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(built.outputFiles[0].text, path.join(root, name + ".cjs"));
  return mod.exports;
}

const { applyPetRecallAnswer, createPetRecallState } = load(
  `export { applyPetRecallAnswer, createPetRecallState } from "./src/lib/petRecall.ts";`, "handover-a");
const { orderStrugglingReviews, selectContinueLearningMix } = load(
  `export { orderStrugglingReviews, selectContinueLearningMix } from "./src/session.ts";`, "handover-b");

const failures = [];

// ── the pet stops drilling and lets go ─────────────────────────────────────
const question = { itemId: "phrase-1", aliases: [], recallSequence: 1 };
let state = createPetRecallState();
const first = applyPetRecallAnswer(state, question, "no");
if (first.outcome !== "focused") {
  failures.push(`the first "no" should keep the phrase with the pet, got ${first.outcome}`);
}
const second = applyPetRecallAnswer(first.state, { ...question, recallSequence: 2 }, "no");
if (second.outcome !== "handed-over") {
  failures.push(`the second "no" should hand the phrase to the lesson, got ${second.outcome}`);
}
if (second.state.entries.some((entry) => entry.itemId === "phrase-1")) {
  failures.push("after handing over, the pet should stop asking about it and move on");
}

// ── the lesson puts the freshest miss first ────────────────────────────────
const older = { item: { id: "old" }, struggledAt: 1_000 };
const oldest = { item: { id: "oldest" }, struggledAt: 10 };
const justNow = { item: { id: "fresh" }, struggledAt: 9_999_999 };
const ordered = orderStrugglingReviews([older, oldest, justNow]);
if (ordered[0] !== justNow) {
  failures.push("the phrase you just failed should lead the review queue");
}
if (ordered[1] !== oldest) {
  failures.push("behind the freshest miss, the longest-waiting struggle should come next — the backlog still has to drain");
}

// And that ordering has to survive the three-per-lesson cap that actually
// decides what a learner sees.
const many = Array.from({ length: 12 }, (_, i) => ({
  item: { id: `old-${i}`, de: `Satz ${i}.`, en: `Sentence ${i}.` },
  struggledAt: 1_000 + i,
  review: true,
}));
const petMiss = {
  item: { id: "pet-miss", de: "Ich bin mir nicht sicher.", en: "I'm not sure." },
  struggledAt: 9_999_999,
  review: true,
};
const mix = selectContinueLearningMix([], [...many, petMiss], [], 3, 3, []);
if (!mix.reviews.some((step) => step.item?.id === "pet-miss")) {
  failures.push("with a dozen older struggles queued, the phrase the pet just asked about still never reaches the lesson");
}

// ── the pet says where it went ─────────────────────────────────────────────
const fs = require("fs");
const provider = fs.readFileSync(path.join(root, "src/components/codexPets/CodexPetProvider.tsx"), "utf8");
if (!/recallOutcome === "handed-over"/.test(provider)) {
  failures.push("CodexPetProvider: the pet still promises to ask again after handing the phrase over");
}
const guided = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
if (!/struggledAt: Number\.isFinite\(struggledAt\)/.test(guided)) {
  failures.push("guided_learning_session: struggles are gathered without recording when they happened");
}

if (failures.length) {
  console.error("FAIL check-pet-handover");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-pet-handover: two misses hand the phrase to the lesson, and it leads the next review queue");
