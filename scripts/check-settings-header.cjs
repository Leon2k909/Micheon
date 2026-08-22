#!/usr/bin/env node
/**
 * Every settings category opens with its icon and title in the same place.
 *
 * They did not. The header is a flex row and the icon was centred in it, so
 * where the icon sat depended on how tall the header happened to be — and that
 * depended on whether the description wrapped. Five categories have a
 * two-line description and two have a one-line one, so clicking between them
 * moved the icon and the title by 10px and the panel body by 19px. Measured in
 * the running app: iconTop was 26px in five categories and 16px in two.
 *
 * Nothing throws and no test fails when this regresses. It just looks sloppy in
 * a way that is hard to name, which is exactly why it is worth pinning.
 *
 * Two rules hold it:
 *   1. the header aligns to the TOP, so the icon cannot float with the height
 *   2. the description reserves two lines, so the height is the same anyway
 *      and the body below starts level too
 *
 * Rule 2 alone would fix the icon; rule 1 alone would leave the content
 * jumping. Both are needed, so both are checked.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const component = fs.readFileSync(path.join(root, "src/components/SettingsCategory.tsx"), "utf8");

const failures = [];

// ── 1. the header anchors to the top ──────────────────────────────────────
const head = /\.settings-panel-head\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
if (!head) {
  failures.push(".settings-panel-head has no rule at all");
} else if (!/align-items:\s*flex-start/.test(head)) {
  failures.push(
    "the category header no longer aligns to flex-start — centred, the icon drifts with the header's height, " +
    "which is what put it 26px down in some categories and 16px in others"
  );
}

// ── 2. the description reserves its two lines ─────────────────────────────
const desc = /\.settings-panel-desc\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
if (!desc) {
  failures.push(".settings-panel-desc has no rule, so a one-line description makes a shorter header");
} else if (!/min-height:/.test(desc)) {
  failures.push(".settings-panel-desc lost its min-height, so header height follows the text again");
}

// ── 3. the markup still carries the class the CSS targets ─────────────────
// The rule used to hang off Tailwind utilities, which any tidy-up would break
// silently. It is a named class now, and this is what keeps the two in step.
if (!/className="settings-panel-desc/.test(component)) {
  failures.push("SettingsCategory no longer renders .settings-panel-desc, so the min-height matches nothing");
}
if (!/className="settings-panel-icon"/.test(component)) {
  failures.push("SettingsCategory no longer renders .settings-panel-icon");
}

// ── 4. no category smuggles in a second header ────────────────────────────
// "Desktop app & updates" rendered its own icon-and-title block below the
// category one: two near-identical headers, in two different sizes.
const componentsDir = path.join(root, "src/components");
const suspects = [];
for (const name of fs.readdirSync(componentsDir)) {
  if (!name.endsWith(".tsx") || name === "SettingsCategory.tsx") continue;
  const text = fs.readFileSync(path.join(componentsDir, name), "utf8");
  // An icon tile the size of a category header's, next to an h3.
  if (/h-10 w-10[^"]*rounded-\[14px\][^"]*accent-dim/.test(text) && /<h3/.test(text)) {
    suspects.push(name);
  }
}
if (suspects.length) {
  failures.push(
    `these render a category-sized icon tile beside a heading, which stacks a second header under the real one: ${suspects.join(", ")}`
  );
}

if (failures.length) {
  console.error("FAIL check-settings-header");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

assert.ok(true);
console.log(
  "check-settings-header: the category header anchors to the top, reserves two lines for its description, "
  + "keeps the classes the CSS targets, and no panel stacks a second header of its own"
);
