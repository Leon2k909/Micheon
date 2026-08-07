#!/usr/bin/env node
/**
 * The review controls have to mean what they say.
 *
 * "Learning — Review tomorrow" did not review tomorrow. A date on the SRS
 * ladder is only the EARLIEST a review is wanted, and an item with repeated
 * mistakes is deliberately pulled back before it. That behaviour is right; the
 * label was not, and a control that lies about what it does is worse than one
 * that does less.
 *
 * So two things are checked here. The rungs must not promise an exact date,
 * and Snooze — the control that DOES promise one — must actually be a floor
 * that every other path respects.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const guided = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
const session = fs.readFileSync(path.join(root, "src/session.ts"), "utf8");
const strength = fs.readFileSync(path.join(root, "src/lib/memoryStrength.ts"), "utf8");
const lesson = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");

// ── the rungs no longer promise a date they cannot keep ───────────────────
const levels = /const GUIDED_REVIEW_LEVELS[\s\S]*?\n\];/.exec(guided)?.[0] ?? "";
if (!levels) {
  failures.push("the review levels are gone");
} else {
  for (const promise of ["Review tomorrow", "Review in 3 days", "Review in 10 days", "Review in 30 days", "Review in 180 days"]) {
    if (levels.includes(promise)) {
      failures.push(`a rung still promises "${promise}", which the adaptive path can and does break`);
    }
  }
  // The middle rungs have to say the date is approximate.
  const hedged = (levels.match(/sooner if you slip/g) || []).length;
  if (hedged < 4) {
    failures.push("the timed rungs do not say the date can move, so they read as exact");
  }
}

// ── snooze exists, and is a hard floor ────────────────────────────────────
if (!/snoozedUntil\?: string;/.test(strength) || !/export function isSnoozed/.test(strength)
    || !/export function snoozeForDays/.test(strength)) {
  failures.push("there is no snooze, so there is no way to genuinely put an item off");
}
if (!/if \(isSnoozed\(record, now\)\) return false;/.test(strength)) {
  failures.push("a snoozed item can still report itself as due");
}

// The lesson queue must skip a snoozed item BEFORE the struggle branch —
// otherwise a struggle mark would drag it back and the promise would break.
const snoozeAt = session.indexOf("if (isSnoozed(rec)) return;");
const struggleAt = session.indexOf('if (rec?.lastGrade === "struggle") {');
if (snoozeAt < 0) {
  failures.push("the lesson queue does not skip snoozed items");
} else if (struggleAt >= 0 && snoozeAt > struggleAt) {
  failures.push("a struggle mark is checked before the snooze, so struggling items ignore it");
}
if (!/\.filter\(\(item\) => !isSnoozed\(recordFor\(item\)\)\)/.test(lesson)) {
  failures.push("the pet can still quiz on a snoozed item, so putting it off only half works");
}
if (!/snoozeForDays\(days, Date\.now\(\), prior\)/.test(lesson)) {
  failures.push("choosing a snooze does not write anything, so it is forgotten immediately");
}

// ── and the panel says which of the two it is giving you ──────────────────
if (!/This one is a promise\. Nothing shows it before the date you pick\./.test(guided)) {
  failures.push("the snooze section does not say it is a hard floor");
}
if (!/The app can still bring it back early if you keep slipping\./.test(guided)) {
  failures.push("the level section does not admit that the app can bring items back early");
}

if (failures.length) {
  console.error("FAIL check-review-honesty");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-review-honesty: the rungs describe what actually happens, and snooze is a floor that the lesson queue, the pet and the due check all respect");
