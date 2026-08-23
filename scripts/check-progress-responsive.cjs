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

// The lesson grid had the same fault. lg fires at a 1024px VIEWPORT and the
// sidebar takes about 250px of it, so three columns were landing in roughly
// 960px and the cards' level badges escaped their own headers.
const learn = fs.readFileSync(path.join(root, 'src/components/lab/LearnView.tsx'), 'utf8');
if (/grid gap-4 lg:grid-cols-3/.test(learn)) {
  failures.push("the lesson grid goes three-wide at lg, where the sidebar leaves about 300px a card");
}
if (!/md:grid-cols-2 xl:grid-cols-3/.test(learn)) {
  failures.push("the lesson grid does not step through two columns");
}
if (!/flex flex-wrap items-start justify-between/.test(learn)) {
  failures.push("the lesson card header cannot wrap, so its level badge escapes the card");
}

// Each filter group gets a row. Two of them shared one, and a row carrying
// two questions reads as one question: a lit chip in each group looked like
// two answers at once, and choosing a kind left the progress chip lit with
// nothing beside it that would put it out.
const kindAt = learn.indexOf("KIND_FILTERS.map");
const progressAt = learn.indexOf("PROGRESS_FILTERS.map");
const betweenFilters = kindAt >= 0 && progressAt > kindAt ? learn.slice(kindAt, progressAt) : "";
if (!betweenFilters.includes("</div>")) {
  failures.push(
    "the kind and progress filters share one row, so two chips light up in it and " +
    "neither reads as the answer to a question of its own"
  );
}

// The fluency meter is the narrowest thing in that column, and a screen
// breakpoint cannot see how narrow: widening the sidebar takes the card down
// to about 250px while the viewport still reads as a large one. At that width
// the stage name was clipped to an ellipsis and the sentence under it broke to
// one word a line, so the card asks its own width rather than the window's.
const meter = fs.readFileSync(path.join(root, "src/components/FluencyMeter.tsx"), "utf8");
if (!meter.includes('className="@container ')) {
  failures.push("the fluency meter has no container query, so it cannot tell how narrow its own column is");
}
if (!meter.includes("@max-[18rem]:flex-col")) {
  failures.push("the fluency meter keeps its figure beside the text at every width, leaving the text about 110px");
}
if (meter.includes("truncate text-lg font-black")) {
  failures.push("the fluency meter truncates the stage name, which is the one thing the card exists to say");
}

if (failures.length) {
  console.error("FAIL check-progress-responsive");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-progress-responsive: the progress row steps one → two → three columns, and its cards wrap rather than overflowing");
