#!/usr/bin/env node
/**
 * A tracker row stays inside its own bounds when the window is narrow.
 *
 * It did not. Each row is: checkbox, speaker, a text column, and the three
 * Known/Struggle/To learn buttons. The text column was `min-w-0 flex-1`, so
 * it shrank towards nothing while the buttons kept their width — and under
 * the text sits the strength row (bars, status word, "never reviewed again",
 * "review in N days") as a plain `flex` with no wrap. Flex children stop
 * shrinking at min-content, so once the column was narrower than that, they
 * overflowed it sideways and landed on top of the buttons.
 *
 * Measured in a browser at the real markup, window 545px wide: 140px of
 * overflow, 128px of it overlapping the buttons. Overlap started at 620px
 * and got worse the narrower the window went.
 *
 * Two rules, and both are needed:
 *   1. the text column has a floor, so the ROW wraps the buttons onto their
 *      own line instead of crushing the column
 *   2. the strength row wraps, so its badges stack rather than overflow
 *
 * Rule 1 alone leaves a gap between the column's floor and the badges'
 * min-content width. Rule 2 alone still fails below ~460px, where the
 * column is squeezed to 10px. Verified: with both, no overlap anywhere
 * between 380px and 900px.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const failures = [];

for (const name of ["VocabTracker", "WordsTracker"]) {
  const file = path.join(root, "src/components/lab", name + ".tsx");
  const text = fs.readFileSync(file, "utf8");

  // ── 1. the text column cannot be crushed ────────────────────────────────
  if (/<div className="min-w-0 flex-1">/.test(text)) {
    failures.push(
      name + ": the row's text column is back to `min-w-0 flex-1`, so it shrinks towards zero "
      + "instead of letting the row wrap the buttons — the badges under the text then sit on top of them"
    );
  } else if (!/<div className="min-w-\d+ flex-1 basis-0">/.test(text)) {
    failures.push(
      name + ": the row's text column no longer declares a min-width floor with flex-1 basis-0"
    );
  }

  // ── 2. the strength row wraps ───────────────────────────────────────────
  const meter = /<div className="mt-1 flex([^"]*)">/.exec(text);
  if (!meter) {
    failures.push(name + ": the strength row's container is gone or renamed, so this check cannot see it");
  } else if (!/\bflex-wrap\b/.test(meter[1])) {
    failures.push(
      name + ": the strength row lost `flex-wrap`, so its badges overflow the text column sideways "
      + "onto the Known/Struggle/To learn buttons once the window is under ~620px"
    );
  }
}

if (failures.length) {
  console.error("FAIL check-tracker-row-fit");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

assert.ok(true);
console.log(
  "check-tracker-row-fit: both trackers give the text column a min-width floor and let the strength row wrap, "
  + "so nothing overlaps the status buttons on a narrow window"
);
