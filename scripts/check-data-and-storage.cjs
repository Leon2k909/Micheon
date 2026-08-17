#!/usr/bin/env node
/**
 * You can see what Micheon keeps, and delete it — without deleting the wrong
 * thing.
 *
 * This is the one screen in the app whose buttons destroy work permanently, so
 * the properties that matter are about blast radius and consent: a delete
 * touches only this profile, "everything" means this account's data and not
 * the machine's, and nothing irreversible happens on a single click.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");
const failures = [];

// ── a working localStorage, so the real functions can be exercised ────────
const store = new Map();
global.window = {
  localStorage: {
    get length() { return store.size; },
    key: (i) => [...store.keys()][i] ?? null,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  // profileStorage wires up unload flushing at import time.
  addEventListener() {},
  removeEventListener() {},
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
  location: { search: "", reload() {} },
  dispatchEvent() { return true; },
};
global.document = { documentElement: { dataset: {}, style: {}, setAttribute() {}, getAttribute: () => null }, addEventListener() {}, head: { appendChild() {} }, getElementById: () => null, createElement: () => ({ style: {} }) };
global.navigator = { language: "en-GB", sendBeacon: () => true };

const built = esbuild.buildSync({
  stdin: {
    contents: `export { measureDataUsage, clearDataCategory, clearAllData, formatBytes } from "./src/lib/dataUsage.ts";`,
    resolveDir: root,
    sourcefile: "data-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-data.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-data.entry.cjs"));
const { measureDataUsage, clearDataCategory, clearAllData, formatBytes } = mod.exports;

const me = { id: "leon" };
const seed = () => {
  store.clear();
  store.set("session-completed:leon", JSON.stringify({ a: 1, b: 2 }));
  store.set("activity-log:leon", JSON.stringify([1, 2, 3]));
  store.set("gl-custom-content-v1:leon", JSON.stringify({ packs: ["mine"] }));
  store.set("snake-hs:leon", "4200");
  store.set("gl-theme:leon", "dark");
  // Another person on the same machine, and a machine-wide key.
  store.set("session-completed:michelle", JSON.stringify({ hers: true }));
  store.set("german-arena-known-profiles", JSON.stringify(["leon", "michelle"]));
};

// ── it reports what is there, grouped ─────────────────────────────────────
seed();
const usage = measureDataUsage(me);
if (usage.totalBytes <= 0) failures.push("nothing is measured, so the screen would always read empty");
const ids = usage.categories.map((c) => c.id);
for (const want of ["progress", "activity", "custom", "games", "settings"]) {
  if (!ids.includes(want)) failures.push(`the "${want}" group is never reported, so it cannot be cleared on its own`);
}
const custom = usage.categories.find((c) => c.id === "custom");
if (custom && !custom.irreplaceable) {
  failures.push("your own typed-in words are not flagged as unrecoverable");
}
const games = usage.categories.find((c) => c.id === "games");
if (games && games.irreplaceable) {
  failures.push("game high scores are flagged as unrecoverable, which makes the real warnings meaningless");
}

// ── a delete stays inside this profile ────────────────────────────────────
seed();
clearDataCategory("games", me);
if (store.has("snake-hs:leon")) failures.push("clearing a group did not remove its own keys");
if (!store.has("session-completed:leon")) failures.push("clearing high scores removed learning progress");
if (!store.has("session-completed:michelle")) failures.push("clearing one profile's data reached another profile");

// ── and "everything" means this account, not the machine ──────────────────
seed();
const removed = clearAllData(me);
if (removed < 5) failures.push(`"delete everything" only removed ${removed} entries`);
if (store.has("session-completed:leon")) failures.push('"delete everything" left this profile\'s progress behind');
if (!store.has("session-completed:michelle")) {
  failures.push('"delete everything" wiped another profile on the same computer');
}
if (!store.has("german-arena-known-profiles")) {
  failures.push('"delete everything" removed the account list, which would strand every other profile');
}

// ── the sizes read like sizes ─────────────────────────────────────────────
if (formatBytes(512) !== "512 B") failures.push("small sizes are not shown in bytes");
if (!/KB$/.test(formatBytes(4096))) failures.push("kilobyte sizes are not labelled KB");
if (!/MB$/.test(formatBytes(5 * 1024 * 1024))) failures.push("megabyte sizes are not labelled MB");

// ── nothing destructive on one click ──────────────────────────────────────
const ui = fs.readFileSync(path.join(root, "src/components/DataAndStorage.tsx"), "utf8");
if (!/if \(arming !== id\) \{ setArming\(id\); setNote\(""\); return; \}/.test(ui)) {
  failures.push("a delete button fires on the first click, with no chance to change your mind");
}
if (!/Tap again to delete/.test(ui) || !/Cancel/.test(ui)) {
  failures.push("an armed delete does not say what it is waiting for, or offer a way out");
}
if (!/cannot be undone|nicht rückgängig/.test(ui)) {
  failures.push("nothing warns that deleting everything is permanent");
}
// The claim made on screen has to match what clearAllData actually does.
if (!/other profiles on this computer are untouched/.test(ui)) {
  failures.push("the screen does not say whose data it is about to delete");
}

const profile = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
if (/h-\[72px\].*rounded-\[24px\]/.test(profile)) {
  failures.push("Data & storage still has the visible deferred skeleton pill");
}
if (!/fallback=\{<div aria-hidden=\"true\" className=\"h-px w-full\" \/>\}/.test(profile)
    || !/fallback=\{<div aria-hidden=\"true\" className=\"h-px w-full\" \/>}\s*\n\s*minHeight=\{1\}/.test(profile)) {
  failures.push("Data & storage lost the nonzero invisible reveal anchor");
}

// ── and it is honest about languages ──────────────────────────────────────
if (!/nothing to uninstall that would save you space/.test(ui)) {
  failures.push("the screen implies course content can be uninstalled to free space, which it cannot");
}

// ── the desktop figures are guarded like every other channel ──────────────
const main = fs.readFileSync(path.join(root, "electron/main.js"), "utf8");
if (!/storage:get-usage/.test(main) || !/storage:clear-cache/.test(main)) {
  failures.push("the desktop app cannot report disk usage");
}
const usageHandler = main.slice(main.indexOf('ipcMain.handle("storage:get-usage"'), main.indexOf('ipcMain.handle("storage:clear-cache"'));
if (!/eventCameFrom\(event, mainWindow\)/.test(usageHandler)) {
  failures.push("the storage channel is not checked for provenance like its neighbours");
}
if (!/deadline/.test(main)) {
  failures.push("the directory walk is unbounded — a large cache would freeze the settings screen");
}

if (failures.length) {
  console.error("FAIL check-data-and-storage");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-data-and-storage: usage is grouped and sized, a delete stays inside one profile, \"everything\" spares other accounts, and nothing destructive fires on a single click");
