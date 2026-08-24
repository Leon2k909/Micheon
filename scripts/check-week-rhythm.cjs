/**
 * "Diese Woche" has to mean this week.
 *
 * The card used to put lifetime totals under that heading — 221 sessions was
 * every session ever recorded — so these checks pin the two things that makes
 * it true: the week starts on Monday at local midnight, and nothing from
 * before that Monday is counted.
 */
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `export { weekRhythm, startOfWeek, nextWeekStart } from "./src/lib/weekRhythm.ts";`,
    resolveDir: root,
    sourcefile: "week-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-week-rhythm.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-week-rhythm.entry.cjs"));
const { weekRhythm, startOfWeek, nextWeekStart } = mod.exports;

const failures = [];
const DAY = 24 * 60 * 60 * 1000;
const at = (y, m, d, h = 12) => new Date(y, m - 1, d, h, 0, 0, 0).getTime();
const session = (ts) => ({ ts, durationSec: 600, sentences: 4, dialogues: 0 });

// ── the week starts on Monday, at midnight, wherever you are ───────────────
// 2026-08-24 is a Monday; 2026-08-23 the Sunday before it.
for (const [label, ts, expected] of [
  ["Monday itself", at(2026, 8, 24, 9), at(2026, 8, 24, 0)],
  ["Wednesday", at(2026, 8, 26, 23), at(2026, 8, 24, 0)],
  ["Sunday, the last day", at(2026, 8, 30, 23), at(2026, 8, 24, 0)],
  ["the Sunday before", at(2026, 8, 23, 12), at(2026, 8, 17, 0)],
]) {
  const got = startOfWeek(ts);
  if (got !== expected) {
    failures.push(`${label}: the week should start ${new Date(expected).toISOString()}, got ${new Date(got).toISOString()}`);
  }
}

if (new Date(startOfWeek(at(2026, 8, 26))).getHours() !== 0) {
  failures.push("the week starts partway through Monday rather than at midnight");
}

// ── and it resets exactly one week later ───────────────────────────────────
const spanDays = Math.round((nextWeekStart(at(2026, 8, 26)) - startOfWeek(at(2026, 8, 26))) / DAY);
if (spanDays !== 7) {
  failures.push(`a week should be 7 days long, this one is ${spanDays}`);
}
if (new Date(nextWeekStart(at(2026, 8, 26))).getDay() !== 1) {
  failures.push("the reset does not land on a Monday");
}

// ── last week's work does not count towards this week ──────────────────────
const now = at(2026, 8, 26, 15); // Wednesday
const week = weekRhythm(
  [
    session(at(2026, 8, 23, 20)),  // Sunday before — must not count
    session(at(2026, 8, 24, 8)),   // Monday
    session(at(2026, 8, 24, 19)),  // Monday again
    session(at(2026, 8, 26, 9)),   // today
    session(at(2026, 8, 31, 9)),   // next Monday — must not count either
  ],
  now
);

if (week.sessions !== 3) {
  failures.push(`three sessions fall inside this week, the card would show ${week.sessions}`);
}
if (week.daysPractised !== 2) {
  failures.push(`two days were practised, the card would show ${week.daysPractised}`);
}
if (week.days.length !== 7) {
  failures.push(`a week needs seven days to draw, got ${week.days.length}`);
}
if (week.busiestDay !== 2) {
  failures.push(`Monday had two sessions, the busiest day reads ${week.busiestDay}`);
}
if (!week.days[2].isToday || week.days[0].isToday) {
  failures.push("today is marked on the wrong day");
}
if (week.days[3].isFuture !== true || week.days[1].isFuture !== false) {
  failures.push("the days still to come are not marked as such");
}

// ── an empty week is a real answer, not a crash ────────────────────────────
const quiet = weekRhythm([], now);
if (quiet.sessions !== 0 || quiet.daysPractised !== 0 || quiet.days.length !== 7) {
  failures.push("a week with no sessions should read zero across seven drawn days");
}
if (weekRhythm([{ ts: NaN, durationSec: 60 }, null, undefined], now).sessions !== 0) {
  failures.push("a damaged log entry should be skipped rather than counted");
}

// ── the card reads the week, not the lifetime totals ───────────────────────
const card = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const panel = card.slice(card.indexOf("function ActivitySidePanel"), card.indexOf("function ActivitySidePanel") + 4000);
if (/stats\.sessionsCompleted/.test(panel)) {
  failures.push("the week card counts every session ever recorded again");
}
if (!/weekRhythm\(/.test(panel)) {
  failures.push("the week card no longer reads the week");
}
if (/\/6`/.test(panel) || /\/6"/.test(panel)) {
  failures.push("the milestone count is hard-coded again, which is how it came to read 9/6");
}
if (!/MILESTONES\.length/.test(panel)) {
  failures.push("the milestone total is not the number of milestones there are");
}

if (failures.length) {
  console.error("FAIL check-week-rhythm");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(
  "check-week-rhythm: the week starts Monday at local midnight, resets seven days later, counts only what falls inside it, and the card reads it rather than the lifetime totals"
);
