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
// Polish used to sit in the Coming soon catalogue. It is a course now, so it
// has to be findable as one — listed outright, not behind "Show more".
if (catalogue.includes('id: "polish"')) {
  failures.push("languageCatalogue.ts: Polish is a course now and must not also say Coming soon");
}
if (!/id: "polish",[\s\S]{0,200}?available: true/.test(registry)) {
  failures.push("courseRegistry.ts: Polish is taught and must be selectable");
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

if (failures.length) {
  console.error("FAIL check-notification-actions");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-notification-actions: read/delete/clear-all wired, ${entries.length} languages listed and searchable, category cards have an edge`);
