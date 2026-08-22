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

// ── the tracker shows the decay rather than contradicting it ───────────────
//
// The one screen named after tracking used to print the raw tally, so it
// disagreed with the dashboard by hundreds of items with nothing on screen to
// explain the gap. A number that falls has to be inspectable where it lives.
const tracker = fs.readFileSync(path.join(root, "src/components/lab/VocabTracker.tsx"), "utf8");
if (!/counting \+= detail\.weight/.test(tracker) || !/counts\.counting/.test(tracker)) {
  failures.push("the tracker headline still counts a flat one per item, so it contradicts every other screen");
}
if (!/\{ key: "fading", label: "Fading" \}/.test(tracker)) {
  failures.push("there is no way to filter to the fading items, so the backlog cannot be cleared from here");
}
// Declared AND rendered — a component nobody mounts explains nothing.
if (!/function HowCountingWorks\b/.test(tracker) || !/<HowCountingWorks\b/.test(tracker)) {
  failures.push("nothing on the tracker explains how the count works — a total that falls unexplained reads as a bug");
}
// The explainer has to answer the learner's questions, not describe the
// algorithm. The first version of this listed intervals, half-lives, floors
// and a formula — accurate, and unreadable to the person it was written
// for. So: the four things a reader actually needs, and a ban on the
// vocabulary that made it unreadable.
for (const [what, needle] of [
  ["why the number can go down", /can go down as well as up/],
  ["that a review restores it", /counts fully again/],
  ["that nothing reaches zero", /nothing ever falls to zero/],
  ["what never fades", /Never fades:/],
  ["how fading relates to due", /Same items, just later/],
  ["a worked example", /For example: you had/],
]) {
  if (!needle.test(tracker)) failures.push(`the explainer never covers ${what}`);
}
// Only what a learner can actually read. Comments explaining the design to
// the next person are not jargon on screen, and policing them pushes the
// explanation out of the code rather than off the page.
const trackerCopy = tracker
  .replace(new RegExp('\\/\\*[\\s\\S]*?\\*\\/', 'g'), ' ')
  .replace(new RegExp('(^|[^:])\\/\\/[^\\n]*', 'g'), '$1 ');
// Jargon that only makes sense if you already know how the thing works.
for (const [term, pattern] of [
  ["review intervals as a ladder of days", /1 → 3 → 10 → 30 → 180/],
  ["the half-life formula", /interval × 1\.5|half the distance/],
  ["\"rung\"", /\brungs?\b/],
  ["the floor as a bare number", /0\.50 after one|floor rises/],
]) {
  if (pattern.test(trackerCopy)) {
    failures.push(`the explainer is describing the algorithm again — it mentions ${term}`);
  }
}
// In a unit a learner reads. "counts as 0.84" was accurate and meaningless —
// 0.84 of what? — so the row states a percentage with the days behind it.
if (!/Math\.round\(decay\.weight \* 100\)/.test(tracker) || !/decay\.overdueDays/.test(tracker)) {
  failures.push("an individual row never says what it is currently worth in plain units, or how overdue it is");
}
if (/counts as["'\s]*\}?\s*\{?\s*decay\.weight\.toFixed/.test(tracker)) {
  failures.push("the row is back to a bare 0-1 figure, which reads as nothing to a learner");
}
if (!/decay\.halfLifeDays/.test(tracker) || !/decay\.floor/.test(tracker)) {
  failures.push("the row's tooltip does not show the workings behind the number");
}
// Due and fading are the same backlog a day apart; showing both chips on one
// row said the same thing twice and implied they were different things.
if (!/s\.due && !decay\.fading/.test(tracker)) {
  failures.push("a row can show both 'due for review' and a fading figure, which reads as two separate problems");
}


if (failures.length) {
  console.error("FAIL check-memory-decay");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-memory-decay: fresh items count whole, a week late costs ${(1 - weekLate).toFixed(2)}, nothing falls below the floor, and one review restores full value`);
