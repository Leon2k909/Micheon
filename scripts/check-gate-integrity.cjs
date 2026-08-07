#!/usr/bin/env node
/**
 * The gates themselves have to be able to fail.
 *
 * Five word boundaries across three gates had been written as a literal
 * backspace byte rather than \b — a heredoc turning \b into chr(8) — so those
 * patterns matched a control character that appears nowhere in the source they
 * were checking. Every one of them had been passing on anything since the day
 * it was written, and repairing them immediately surfaced two real defects:
 * jargon on the tracker, and a focus ring drawing a second border in four
 * places.
 *
 * A gate that cannot fail is worse than no gate, because it is counted as
 * covered. This checks for the control characters that silently do that.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

// Control characters that are almost certainly a mangled escape rather than
// something anyone typed on purpose.
const SUSPECT = new Map([
  [8, "\b (word boundary)"],
  [12, "\f (form feed)"],
  [11, "\v (vertical tab)"],
  [7, "\a (bell)"],
  [27, "\e (escape)"],
]);

for (const name of fs.readdirSync(path.join(root, "scripts")).sort()) {
  if (!name.endsWith(".cjs")) continue;
  const bytes = fs.readFileSync(path.join(root, "scripts", name));
  for (const [code, meaning] of SUSPECT) {
    const count = bytes.filter((b) => b === code).length;
    if (count) {
      failures.push(
        `${name} contains ${count} raw byte ${code} — almost certainly ${meaning} ` +
        "collapsed by a shell heredoc, which makes that pattern match nothing"
      );
    }
  }
}

if (failures.length) {
  console.error("FAIL check-gate-integrity");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-gate-integrity: no gate contains a collapsed escape that would make its pattern unmatchable");
