#!/usr/bin/env node
/**
 * The word panel has to be readable to its last line, and the card has to keep
 * its corners.
 *
 * The panel is a child of the lesson card, and that card clips itself so its
 * rounded corners hold. Opening downward ran it into the card's bottom edge and
 * it was cut off — the pronoun notes got long enough to explain a word
 * properly, and "ihr" is three different words.
 *
 * The first fix was a clip margin, which was worse: a margin expands the clip
 * region for EVERY child, so the card's own contents painted over the rounded
 * corners and squared them off. The panel opens upward instead — the sentence
 * sits low in the card and there is far more room above it — so nothing needs
 * permission to leave.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");

const cardRule = /\.fs-card \{([^}]*)\}/.exec(css)?.[1] ?? "";
if (!cardRule) {
  failures.push("the lesson card rule is gone, so this check cannot tell whether the corners still clip");
} else {
  if (/overflow-clip-margin/.test(cardRule)) {
    failures.push(
      "the lesson card uses a clip margin, which lets its own contents paint over " +
      "the rounded corners and square them off"
    );
  }
  if (!/overflow:\s*hidden/.test(cardRule)) {
    failures.push("the lesson card no longer clips, so its rounded corners do not hold");
  }
}

const popover = /\.guided-session \.fs-word-popover \{([^}]*)\}/.exec(css)?.[1] ?? "";
if (!popover) {
  failures.push("the word panel has no styling");
} else {
  if (!/bottom:\s*calc\(100% \+/.test(popover)) {
    failures.push("the word panel opens downward, where the card runs out and cuts it off");
  }
  if (!/max-height:/.test(popover) || !/overflow-y:\s*auto/.test(popover)) {
    failures.push("the word panel neither caps its height nor scrolls, so a long note runs off the screen");
  }
}

if (failures.length) {
  console.error("FAIL check-word-popover");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-word-popover: the card clips absolutely so its corners hold, and the panel opens upward and scrolls rather than being cut off");
