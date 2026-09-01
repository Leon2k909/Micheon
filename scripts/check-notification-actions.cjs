#!/usr/bin/env node
/**
 * The bell has to be usable, not just decorative.
 *
 * A notification you cannot dismiss and cannot mark as read is a permanent
 * badge, and a permanent badge is one people stop looking at. Deleting is
 * about today's showing, not the kind — clearing today's streak note must not
 * silence tomorrow's, which is what muting is for.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const failures = [];

const prefs = read("src/lib/notificationPrefs.ts");
for (const fn of [
  "getNotificationStatus",
  "markNotificationsRead",
  "dismissNotifications",
  "restoreDismissedNotifications",
]) {
  if (!new RegExp(`export function ${fn}\\b`).test(prefs)) {
    failures.push(`notificationPrefs.ts: ${fn} is missing`);
  }
}
// Clearing something must also mark it read, or the badge counts rows that are
// no longer on screen and can never be cleared.
if (!/dismissed: \[\.\.\.stored\.dismissed, \.\.\.ids\],\s*\r?\n\s*read: \[\.\.\.stored\.read, \.\.\.ids\],/.test(prefs)) {
  failures.push("notificationPrefs.ts: deleting a notification should mark it read too");
}
if (!/MAX_TRACKED_IDS/.test(prefs)) {
  failures.push("notificationPrefs.ts: stored ids need a ceiling so the list cannot grow for ever");
}

const shell = read("src/prototype/NewUiPrototype.tsx");
// Ids carry the day, so a cleared notification returns tomorrow.
if (!/id: `reviews:\$\{today\}`/.test(shell)) {
  failures.push("NewUiPrototype: notification ids should include the day, so clearing one is not permanent");
}
if (!/!notificationStatus\.dismissed\.has\(item\.id\)/.test(shell)) {
  failures.push("NewUiPrototype: deleted notifications are still being shown");
}
if (!/const unreadNotifications = notifications\.filter\(\(item\) => !notificationStatus\.read\.has\(item\.id\)\)/.test(shell)) {
  failures.push("NewUiPrototype: nothing separates read from unread");
}
if (!/\{unreadNotifications\.length > 0 && <span aria-hidden="true">\{unreadNotifications\.length\}<\/span>\}/.test(shell)) {
  failures.push("NewUiPrototype: the badge should count unread, and disappear when there are none");
}
for (const [label, pattern] of [
  ["Mark all as read", /markNotificationsRead\(notifications\.map\(\(item\) => item\.id\)\)/],
  ["Clear all", /dismissNotifications\(notifications\.map\(\(item\) => item\.id\)\)/],
  ["per-row mark as read", /markNotificationsRead\(\[notification\.id\]\)/],
  ["per-row delete", /dismissNotifications\(\[notification\.id\]\)/],
  ["undo clear", /restoreDismissedNotifications\(\)/],
]) {
  if (!pattern.test(shell)) failures.push(`NewUiPrototype: ${label} is not wired up`);
}
// Opening one should count as reading it.
if (!/applyNotificationChange\(\(\) => markNotificationsRead\(\[notification\.id\]\)\);\s*\r?\n\s*openNotification/.test(shell)) {
  failures.push("NewUiPrototype: opening a notification should mark it read");
}

// ── the language picker ────────────────────────────────────────────────────
const catalogue = read("src/lib/languageCatalogue.ts");
const entries = catalogue.match(/\{ id: "/g) || [];
if (entries.length < 60) {
  failures.push(`languageCatalogue.ts: only ${entries.length} languages listed; the point is that people find theirs`);
}
for (const expected of ["japanese", "arabic", "mandarin", "swahili", "hindi"]) {
  if (!catalogue.includes(`id: "${expected}"`)) {
    failures.push(`languageCatalogue.ts: ${expected} is missing`);
  }
}
const registry = read("src/lib/courseRegistry.ts");
// Polish and Spanish both used to sit in the Coming soon catalogue. They are
// courses now, so each has to be findable as one — listed outright, not
// behind "Show more" — and neither may be in both places at once.
for (const taught of ["polish", "spanish"]) {
  const name = taught[0].toUpperCase() + taught.slice(1);
  if (catalogue.includes(`id: "${taught}"`)) {
    failures.push(`languageCatalogue.ts: ${name} is a course now and must not also say Coming soon`);
  }
  if (!new RegExp(`id: "${taught}",[\\s\\S]{0,400}?available: true`).test(registry)) {
    failures.push(`courseRegistry.ts: ${name} is taught and must be selectable`);
  }
}
if (!/PLANNED_LANGUAGES\.map/.test(registry)) {
  failures.push("courseRegistry.ts: the catalogue is not being listed in the picker");
}
if (!/available: false/.test(registry)) {
  failures.push("courseRegistry.ts: planned languages must not look selectable");
}
const switcher = read("src/components/course/CourseSwitcher.tsx");
if (!/function foldForSearch/.test(switcher)) {
  failures.push("CourseSwitcher: search should fold diacritics, so \"cestina\" finds \"čeština\"");
}
if (!/overflow-y-auto/.test(switcher)) {
  failures.push("CourseSwitcher: the list is long now and has to scroll");
}

// ── the settings categories have an edge ───────────────────────────────────
// The card used to carry this as a utility class; it is a named rule now, so
// the check follows it into the stylesheet. Same promise either way.
const settingsCss = read("src/index.css");
if (!/\.settings-row \{[^}]*border:[^;]*--card-edge/.test(settingsCss)) {
  failures.push("SettingsCategory: a white card on a near-white page needs a border to be visible at all");
}
// ...and it is an edge, not a highlight. A boundary needs 3:1 to be seen; the
// dark value was set at over 5, which is what made every card look outlined
// in white. Checked as a range so it cannot drift back up OR be softened away
// to nothing, since the whole reason it exists is that the card vanishes
// without it.
{
  const channel = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const dark = /html\[data-theme="dark"\][^{]*\{[^}]*--card-edge:\s*(#[0-9a-f]{6})/i.exec(settingsCss);
  if (!dark) {
    failures.push("the dark theme no longer names a card edge");
  } else {
    // The darkest and lightest surfaces a card sits on in the dark theme.
    const ratios = ["#0c1017", "#1b1f2a"].map((bg) => contrast(dark[1], bg));
    if (Math.min(...ratios) < 3) {
      failures.push(`the dark card edge is ${Math.min(...ratios).toFixed(2)}:1, under the 3:1 a boundary needs`);
    }
    if (Math.max(...ratios) > 4.2) {
      failures.push(`the dark card edge is ${Math.max(...ratios).toFixed(2)}:1, loud enough to read as a white outline`);
    }
  }
}

if (failures.length) {
  console.error("FAIL check-notification-actions");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-notification-actions: read/delete/clear-all wired, ${entries.length} languages listed and searchable, category cards have an edge`);
