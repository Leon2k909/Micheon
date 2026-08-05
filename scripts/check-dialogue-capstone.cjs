#!/usr/bin/env node
/**
 * A conversation is a capstone, not a doorway.
 *
 * It used to run as soon as ONE of its lines was taught, which dragged in the
 * rest wherever they sat in the course order. Across the 634 conversations the
 * median gap between a conversation's earliest and latest line is 6,382 places
 * and 79% reach more than 2,000 places ahead — which is how a line ranked
 * 10,250th of 12,647 by how commonly it is said turned up in the second lesson
 * of its pack.
 *
 * Two things have to stay true at once: conversations wait for most of their
 * language, AND they still all run. Gating too hard is the easy mistake — an
 * "every line" rule dropped them from 100% to 0%.
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

const { buildSession, dialogueIsEarned } = load(
  `export { buildSession, dialogueIsEarned } from "./src/session.ts";`, "capstone-a");
const { allPartBlueprints } = load(
  `export { allPartBlueprints } from "./src/lib/data.ts";`, "capstone-b");

const failures = [];

// ── the rule itself ────────────────────────────────────────────────────────
const four = { dialogue: { lines: [{ de: "A." }, { de: "B." }, { de: "C." }, { de: "D." }] } };
if (dialogueIsEarned(four, new Set(["a."]))) {
  failures.push("one line out of four should not open a conversation");
}
if (!dialogueIsEarned(four, new Set(["a.", "b."]))) {
  failures.push("half the lines should be enough — stricter than this and conversations stop running");
}
if (dialogueIsEarned({ dialogue: { lines: [] } }, new Set())) {
  failures.push("an empty conversation should never run");
}

// ── and what it does to real lessons ───────────────────────────────────────
const later = () => new Date(Date.now() + 400 * 864e5).toISOString();
const known = () => ({
  lastGrade: "know", successes: 6, intervalDays: 180,
  dueAt: later(), updatedAt: new Date().toISOString(),
});

function walkPack(key, maxLessons = 200) {
  const part = { ...allPartBlueprints[key], partKey: key };
  const review = {};
  const ranAt = new Map();
  for (let lesson = 1; lesson <= maxLessons; lesson++) {
    const steps = buildSession(part, [], review, 0);
    if (!steps.some((s) => s.type === "sentence" || s.type === "dialogue")) break;
    for (const step of steps) {
      if (step.type === "dialogue" && !ranAt.has(step.dialogue?.title)) {
        ranAt.set(step.dialogue?.title, lesson);
      }
      if (step.item?.id) review[step.item.id] = known();
      for (const line of step.dialogue?.lines ?? []) {
        if (line?.id) review[line.id] = known();
      }
    }
  }
  return ranAt;
}

// Every conversation in a decent slice of the course still runs.
const sample = Object.keys(allPartBlueprints).slice(0, 40);
let defined = 0;
let ran = 0;
for (const key of sample) {
  const count = (allPartBlueprints[key]?.dialogues ?? []).length;
  if (!count) continue;
  defined += count;
  ran += walkPack(key).size;
}
if (defined === 0) failures.push("no conversations found in the sample — has the course moved?");
if (ran < defined) {
  failures.push(`only ${ran} of ${defined} conversations ever run — the gate is too strict`);
}

// And the one that started this does not arrive in the first lessons of its pack.
const part39 = walkPack("part39");
const schoolDays = part39.get("Warst du gern in der Schule?");
if (!schoolDays) {
  failures.push('the "Warst du gern in der Schule?" conversation never runs');
} else if (schoolDays <= 4) {
  failures.push(`"Warst du gern in der Schule?" still opens at lesson ${schoolDays}; it holds a line ranked 10,250th of 12,647 by how commonly it is said`);
}

if (failures.length) {
  console.error("FAIL check-dialogue-capstone");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-dialogue-capstone: ${ran}/${defined} conversations still run, and the school-days one waits until lesson ${schoolDays}`);
