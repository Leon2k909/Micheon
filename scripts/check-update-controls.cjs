#!/usr/bin/env node
/**
 * Updates can be postponed, and update notices can be hidden.
 *
 * The updater used to be entirely in charge: check every fifteen minutes,
 * download unasked, panel always on screen. That is the right default and a
 * poor rule — someone on a metered connection, or halfway through a lesson,
 * had no say. These are the properties that make the controls real rather
 * than decorative.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const failures = [];

// ── the settings survive a restart, and cannot be corrupted into silence ──
const settingsPath = path.join(root, "electron/desktop-settings.cjs");
const settings = require(settingsPath);
const defaults = settings.DEFAULT_DESKTOP_SETTINGS;
if (defaults.updateMode !== "auto") {
  failures.push("automatic updates must stay the default");
}
if (defaults.updateNoticesHidden !== false) {
  failures.push("update notices must be shown by default");
}
const wild = settings.normalizeDesktopSettings({ updateMode: "whatever", updateSnoozeUntil: 8.64e15, updateNoticesHidden: "yes" });
if (wild.updateMode !== "auto") failures.push("an unknown update mode should fall back to automatic");
if (wild.updateSnoozeUntil > Date.now() + 31 * 24 * 60 * 60 * 1000) {
  failures.push("a corrupt snooze would silence updates for ever — it must be clamped");
}
if (wild.updateNoticesHidden !== false) failures.push("a non-boolean hidden flag should not hide notices");
const kept = settings.normalizeDesktopSettings({ updateMode: "manual", updateNoticesHidden: true });
if (kept.updateMode !== "manual" || kept.updateNoticesHidden !== true) {
  failures.push("a real choice must survive normalisation");
}

// ── the main process actually obeys them ─────────────────────────────────
const main = read("electron/main.js");
if (!/function applyUpdatePreferences/.test(main) || !/autoUpdater\.autoDownload = automatic/.test(main)) {
  failures.push("nothing stops the background download, which is the whole cost on a metered connection");
}
if (!/function updateSnoozeActive/.test(main)) {
  failures.push("there is no snooze check, so postponing would do nothing");
}
if (!/updateMode === "manual" \|\| updateSnoozeActive\(\)/.test(main)) {
  failures.push("the periodic check ignores the mode and the snooze");
}
if (!/update:set-preferences/.test(main) || !/update:download-now/.test(main)) {
  failures.push("the renderer cannot change the preferences, or cannot override them once set");
}
if (!/eventCameFrom\(event, mainWindow\)/.test(main.slice(main.indexOf("update:set-preferences")))) {
  failures.push("the preference channel is not checked for provenance like its neighbours");
}

// ── and the renderer offers them ─────────────────────────────────────────
const preload = read("electron/preload.cjs");
if (!/setUpdatePreferences/.test(preload) || !/downloadUpdateNow/.test(preload)) {
  failures.push("the preload bridge does not expose the update controls");
}
const card = read("src/components/UpdateStatusCard.tsx");
for (const [what, needle] of [
  ["automatic mode", '"auto", "Automatic"'],
  ["ask-first mode", '"ask", "Ask first"'],
  ["manual mode", '"manual", "Only when I ask"'],
  ["postpone options", "Postpone for"],
  ["a way back", "Resume updates"],
  ["hiding notices", "Hide update notices"],
]) {
  if (!card.includes(needle)) failures.push(`the update card is missing ${what}`);
}
// Hiding notices must not mean hiding the update: it still installs.
if (!/Updates still install/.test(card)) {
  failures.push("hiding notices should say plainly that updates still install");
}
const lib = read("src/lib/updateStatus.ts");
if (!/if \(status\?\.noticesHidden\) return false;/.test(lib)) {
  failures.push("hiding notices does not actually silence the floating panel");
}

if (failures.length) {
  console.error("FAIL check-update-controls");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-update-controls: automatic stays the default, postponing and manual mode stop the background download, and hidden notices silence the panel without stopping the update");
