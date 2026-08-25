#!/usr/bin/env node
/**
 * Settings you can read straight down, and a header that survives a longer
 * language.
 *
 * The categories were a sidebar with one panel beside it for a while. That
 * showed one of them at a time and put the name you pressed in a different
 * column from the thing it opened. They are one column of disclosures now:
 * every name is on screen, any number of them open, each under its own row.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const category = fs.readFileSync(path.join(root, "src/components/SettingsCategory.tsx"), "utf8");
const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const proto = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");

// ── the list reads straight down ──────────────────────────────────────────
if (!/export function SettingsCategoryLayout/.test(category)) {
  failures.push("there is no settings layout, so the search has nothing to sit in");
}
if (!/<SettingsCategoryLayout/.test(settings)) {
  failures.push("the settings page does not use the layout");
}
// No selection and no registry: every category renders, always.
if (/nav\.selected/.test(category) || /SettingsNavContext/.test(category)) {
  failures.push("a category still asks a sidebar whether it is the chosen one, so only one of them renders");
}
// Each row opens its own panel, directly underneath itself.
if (!/aria-controls=\{panelId\}/.test(category) || !/aria-expanded=\{isOpen\}/.test(category)) {
  failures.push("the rows are not disclosures, so nothing says what they open");
}
if (!/<div hidden=\{!isOpen\} id=\{panelId\}>/.test(category)) {
  failures.push("a category's panel is not the thing its own row controls");
}
// Search filters the same list rather than replacing it.
if (!/forceOpen/.test(category) || !/hidden=\{!matchesSearch\(/.test(settings)) {
  failures.push("search does not open the matches inside the list it is already showing");
}
if (!/\{search && <div className="settings-layout-search">\{search\}<\/div>\}/.test(category)) {
  failures.push("the search box is not the first row of the list");
}
if (!/\.settings-layout\b/.test(css) || !/\.settings-panel-icon\b/.test(css)) {
  failures.push("the list has no styling");
}
// The sidebar is gone; nothing should be left styling one.
if (/\.settings-nav\b/.test(css) || /\.settings-nav-item\b/.test(css)) {
  failures.push("the sidebar CSS outlived the sidebar");
}

// Account details used to sit above everything, permanently, while the things
// you might actually be looking for were behind a search box. It is a
// category like the rest now, and the search is the row above them all,
// because typing to find a setting and picking one out of the list are the
// same job.
if (!/<SettingsCategory[\s\S]{0,400}title=\{ui\("Account details"\)\}/.test(settings)) {
  failures.push("Account details is not a category, so it is pinned above every other setting");
}
if (!/search=\{\(/.test(settings)) {
  failures.push("the settings page does not hand the layout its search box");
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
console.log("check-settings-nav: settings is one column of disclosures with the search at its head, each row opening its own panel, and the header stats wrap instead of overflowing");
