#!/usr/bin/env node
/**
 * The lessons list runs up the CEFR ladder.
 *
 * It used to come out in catalogue order, so an A1 lesson, an A1-A2 and
 * another A1 sat next to each other with no rung to read them by. The
 * catalogue carries seventeen distinct level labels — A1 through C2 plus
 * ranges like A2-C1 and the odd B1+ — and none of them meant anything to the
 * ordering.
 *
 * Sorted by the LOW end of a range first, then the high end: "A1-B2" is a
 * beginner lesson that reaches far, so it belongs among the A1s. That is the
 * opposite of cefrTier, which reads a range as its top end so that filtering
 * for C1 surfaces "B2-C1". Both are right for their own job, which is exactly
 * why it is worth pinning that the list uses the sorting one.
 *
 * This computes the order rather than grepping for it, so a change to
 * cefrOrder that quietly reshuffles the ladder fails here.
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  entryPoints: [path.join(root, "src/lib/cefr.ts")],
  bundle: true, format: "cjs", write: false, platform: "node",
});
const mod = { exports: {} };
new Function("module", "exports", "require", built.outputFiles[0].text)(mod, mod.exports, require);
const { cefrOrder } = mod.exports;

const failures = [];

// Every label the catalogue actually uses, deliberately shuffled.
const LABELS = [
  "B1", "A2", "A2-B1", "A1-A2", "B2", "A1", "A2-B2", "B1-B2", "B2-C1",
  "C1", "A1-B1", "C2", "A1-B2", "B1-C1", "B1+", "A2-C1", "all",
];
const EXPECTED = [
  "A1", "A1-A2", "A1-B1", "A1-B2",
  "A2", "A2-B1", "A2-B2", "A2-C1",
  "B1", "B1+", "B1-B2", "B1-C1",
  "B2", "B2-C1",
  "C1", "C2",
  "all",
];

const actual = LABELS.slice().sort((a, b) => cefrOrder(a) - cefrOrder(b));
if (actual.join(" ") !== EXPECTED.join(" ")) {
  failures.push(
    "cefrOrder no longer walks the ladder in order.\n"
    + "    expected: " + EXPECTED.join(", ") + "\n"
    + "    got:      " + actual.join(", ")
  );
}

// A range must sort by where it starts, not where it ends. Without this the
// wide ranges scatter through the list and the ladder stops reading as one.
if (cefrOrder("A1-C1") > cefrOrder("A2")) {
  failures.push("A1-C1 sorts after A2 — ranges are being ordered by their top end, which scatters them up the list");
}
// Unlabelled goes last, not first: it belongs to no rung.
if (cefrOrder("all") < cefrOrder("C2")) {
  failures.push("an unlabelled lesson sorts before C2, so it lands in the middle of the ladder");
}

// And the list has to actually use it.
const view = fs.readFileSync(path.join(root, "src/components/lab/LearnView.tsx"), "utf8");
if (!view.includes("cefrOrder(a.level) - cefrOrder(b.level)")) {
  failures.push("LearnView no longer sorts its filtered lessons by level, so they fall back to catalogue order");
}

if (failures.length) {
  console.error("FAIL check-lesson-order");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  "check-lesson-order: " + EXPECTED.length + " level labels sort A1 -> C2 with ranges grouped under where they start, "
  + "and the lessons list applies it"
);
