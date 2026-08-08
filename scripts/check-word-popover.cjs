#!/usr/bin/env node
/**
 * The word panel has to be readable to its last line.
 *
 * It is a child of the lesson card, and that card clips itself so its rounded
 * corners hold. With overflow: hidden there is no way for a descendant to paint
 * outside, so a panel taller than the space left below the sentence was simply
 * chopped — which is what happened once the pronoun notes got long enough to
 * explain a word properly. "ihr" is three different words and its note says so.
 *
 * Two things keep it readable: the card clips with a margin rather than
 * absolutely, and the panel scrolls instead of growing without limit.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");

const card = /(?:^|\n)\.fs-card \{([^}]*)\}/.exec(css)?.[1] ?? "";
if (!card) {
  failures.push("the lesson card rule is gone, so this check cannot tell whether the panel is clipped");
} else {
  if (/overflow:\s*hidden/.test(card)) {
    failures.push(
      "the lesson card clips with overflow: hidden, which no descendant can escape — " +
      "a word panel taller than the space below the sentence gets chopped"
    );
  }
  if (!/overflow-clip-margin:/.test(card)) {
    failures.push("the lesson card has no clip margin, so the word panel cannot paint outside it");
  }
}

const popover = /\.guided-session \.fs-word-popover \{([^}]*)\}/.exec(css)?.[1] ?? "";
if (!popover) {
  failures.push("the word panel has no styling");
} else if (!/max-height:/.test(popover) || !/overflow-y:\s*auto/.test(popover)) {
  failures.push("the word panel neither caps its height nor scrolls, so a long note runs off the screen");
}

if (failures.length) {
  console.error("FAIL check-word-popover");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-word-popover: the lesson card clips with a margin the panel can escape, and a long note scrolls rather than being cut off");
