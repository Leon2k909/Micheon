#!/usr/bin/env node
/**
 * What you know fades, so the number has to be able to fall.
 *
 * The vocabulary total only ever went up: an item graded "know" once counted
 * as a whole word for ever, however long ago that was. On a real profile half
 * of everything counted as known was more than a week past its review date
 * and still counted at full value.
 *
 * The properties pinned here are the ones that make a decaying number fair
 * rather than punishing: fresh items are whole, fading is gradual and paced
 * by the interval the item earned, nothing ever reaches zero, and a single
 * successful review restores it completely.
 */
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `export { recallWeight, recordSuccess, recordStruggle } from "./src/lib/memoryStrength.ts";`,
    resolveDir: root,
    sourcefile: "decay-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-memory-decay.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-memory-decay.entry.cjs"));
const { recallWeight, recordSuccess } = mod.exports;

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const failures = [];
const known = (overdueDays, successes, intervalDays) => ({
  lastGrade: "know",
  successes,
  intervalDays,
  dueAt: new Date(now - overdueDays * DAY).toISOString(),
  updatedAt: new Date(now - (overdueDays + intervalDays) * DAY).toISOString(),
});

// ── inside its interval, an item is whole ──────────────────────────────────
if (recallWeight(known(-5, 3, 10), now) !== 1) {
  failures.push("an item not yet due should count in full");
}
if (recallWeight(known(0, 3, 10), now) !== 1) {
  failures.push("an item due exactly now should still count in full");
}

// ── past due it fades, and keeps fading ────────────────────────────────────
let previous = 1;
for (const days of [1, 7, 14, 30, 90, 365]) {
  const weight = recallWeight(known(days, 3, 10), now);
  if (weight >= previous) {
    failures.push(`weight did not fall between the previous point and ${days} days overdue`);
  }
  previous = weight;
}

// ── but never to nothing: relearning is faster than learning ───────────────
if (recallWeight(known(3650, 1, 1), now) < 0.35) {
  failures.push("a long-forgotten item fell below the floor — forgetting is not deletion");
}

// ── a longer earned interval fades more slowly ─────────────────────────────
const shortRung = recallWeight(known(20, 1, 1), now);
const longRung = recallWeight(known(20, 5, 180), now);
if (!(longRung > shortRung + 0.1)) {
  failures.push("an item on the 180-day rung should hold its value far better than one on the 1-day rung");
}

// ── the fade is gentle enough to be fair ───────────────────────────────────
const weekLate = recallWeight(known(7, 3, 10), now);
if (weekLate < 0.85) {
  failures.push(`a week overdue costs ${(1 - weekLate).toFixed(2)} of an item — too punishing for being slightly late`);
}

// ── one review wins it all back ────────────────────────────────────────────
const faded = known(60, 2, 10);
if (recallWeight(faded, now) >= 0.9) failures.push("the test fixture is not actually faded");
if (recallWeight(recordSuccess(faded, now), now) !== 1) {
  failures.push("a successful review must restore the item to full value");
}

// ── permanent and legacy records are exempt ────────────────────────────────
if (recallWeight({ lastGrade: "know", permanent: true, dueAt: new Date(now - 500 * DAY).toISOString() }, now) !== 1) {
  failures.push("an item marked permanent should never fade");
}
if (recallWeight({ lastGrade: "know" }, now) !== 1) {
  failures.push("a legacy record with no schedule should stay whole rather than be punished for missing data");
}
if (recallWeight({ lastGrade: "struggle", dueAt: new Date(now).toISOString() }, now) !== 0) {
  failures.push("a struggling item should not count at all");
}

// ── and the app actually uses it ───────────────────────────────────────────
const fluency = fs.readFileSync(path.join(root, "src/lib/fluency.ts"), "utf8");
if (!/known \+= recallWeight/.test(fluency)) {
  failures.push("countKnownVocab still counts a flat one per item, so the total can never fall");
}
if (!/export function countFadingVocab/.test(fluency)) {
  failures.push("nothing counts what is fading, so a falling number arrives with no explanation");
}
if (!/externalWords/.test(fluency) || !/getMasteredCount\(\)/.test(fluency)) {
  failures.push("hand-mastered and external words carry no schedule and must not be decayed on a guess");
}
const home = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
if (!/countFadingVocab\(profile\)/.test(home) || !/A review brings/.test(home)) {
  failures.push("the outlook does not tell the learner why the number moved, or how to move it back");
}

if (failures.length) {
  console.error("FAIL check-memory-decay");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-memory-decay: fresh items count whole, a week late costs ${(1 - weekLate).toFixed(2)}, nothing falls below the floor, and one review restores full value`);
