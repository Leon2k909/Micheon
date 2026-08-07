#!/usr/bin/env node
/**
 * The progress page has to survive a window that is not full screen.
 *
 * Its main row is two flexible columns plus a fixed 280px one, and it was
 * switching to that at md — 768px. Minus the sidebar that leaves the flexible
 * pair around 200px each, so every card inside them wrapped to one word per
 * line and the activity card's range picker ran out of its own card and landed
 * on the one beside it.
 *
 * Three columns is a wide-window layout. It has to say so.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const activity = fs.readFileSync(path.join(root, "src/components/lab/ActivityCard.tsx"), "utf8");

// The three-column row may not appear before xl.
for (const m of settings.matchAll(/className="grid[^"]*grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)_280px\][^"]*"/g)) {
  if (!/xl:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)_280px\]/.test(m[0])) {
    failures.push(
      "the three-column progress row appears before xl — at md the flexible columns " +
      "are about 200px each and their cards wrap to one word per line"
    );
  }
}
// And it should step through two columns rather than jumping from one to three.
if (!/md:grid-cols-2 xl:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1fr\)_280px\]/.test(settings)) {
  failures.push("the progress row jumps straight from one column to three with no step between");
}
// Four stat cards at md is ~170px each, which German labels do not fit.
if (/className="grid gap-4 md:grid-cols-4"/.test(settings)) {
  failures.push("four stat cards appear at md, where a German label does not fit one");
}
// A heading and a dropdown cannot share a line in a narrow column.
if (!/flex flex-wrap items-start justify-between/.test(activity)) {
  failures.push(
    "the activity card's header cannot wrap, so its range picker overflows the card " +
    "and lands on whatever is beside it"
  );
}

if (failures.length) {
  console.error("FAIL check-progress-responsive");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-progress-responsive: the progress row steps one → two → three columns, and its cards wrap rather than overflowing");
