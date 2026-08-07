#!/usr/bin/env node
/**
 * Settings you can navigate, and a header that survives a longer language.
 *
 * Ten collapsed cards down a page meant finding anything was reading ten
 * descriptions and guessing which one hid it. The categories now build a
 * sidebar by registering themselves, so it is made from what is actually
 * rendered rather than a second list that has to be kept in step -- several of
 * those categories are conditional, and a hand-written list would go stale.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const category = fs.readFileSync(path.join(root, "src/components/SettingsCategory.tsx"), "utf8");
const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const proto = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");

// ── the sidebar is built from what renders ────────────────────────────────
if (!/export function SettingsCategoryLayout/.test(category)) {
  failures.push("there is no settings layout, so the categories are a stack of accordions again");
}
if (!/nav\.register\(/.test(category) || !/nav\.unregister\(/.test(category)) {
  failures.push("categories do not register themselves, so the sidebar would need a hand-written list that goes stale");
}
if (!/<SettingsCategoryLayout/.test(settings)) {
  failures.push("the settings page does not use the layout");
}
// Only the chosen category renders, or it is a stack with a sidebar bolted on.
if (!/if \(nav\.selected !== id\) return null;/.test(category)) {
  failures.push("every category renders at once, so the sidebar selects nothing");
}
// Search has to keep showing every match, not one.
if (!/listMode/.test(category) || !/searching=\{settingsTerms\.length > 0\}/.test(settings)) {
  failures.push("search does not fall back to showing every match");
}
// A category that disappears must not leave the panel blank.
if (!/visible\.some\(\(entry\) => entry\.id === selected\)/.test(category)) {
  failures.push("a category that becomes hidden would leave the panel empty with nothing selected");
}
if (!/\.settings-nav-item\b/.test(css) || !/\.settings-layout\b/.test(css)) {
  failures.push("the sidebar has no styling");
}
// It has to survive a narrow window rather than squeezing two columns.
if (!/max-width:\s*900px[\s\S]{0,400}\.settings-layout \{ grid-template-columns: minmax\(0, 1fr\); \}/.test(css)) {
  failures.push("the sidebar keeps its column on a narrow window instead of becoming a row");
}

// ── the header stats survive German ───────────────────────────────────────
const chipStrong = /\.np-stat-chip strong \{([^}]*)\}/.exec(proto)?.[1] ?? "";
const chipSmall = /\.np-stat-chip small \{([^}]*)\}/.exec(proto)?.[1] ?? "";
if (!/white-space:\s*nowrap/.test(chipStrong)) {
  failures.push("the stat number can wrap, which breaks the figure across two lines");
}
if (/white-space:\s*nowrap/.test(chipSmall)) {
  failures.push(
    'the stat LABEL cannot wrap, so "Lektionen abgeschlossen" forces the chip wider than the row — ' +
    "this is what pushed the header off a narrow window in German"
  );
}
if (!/\.np-header-stats \{[^}]*flex-wrap:\s*wrap/.test(proto)) {
  failures.push("the stat row cannot wrap, so the third chip overflows rather than moving down");
}

if (failures.length) {
  console.error("FAIL check-settings-nav");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-settings-nav: settings has a sidebar built from the categories that render, search still lists every match, and the header stats wrap instead of overflowing");
