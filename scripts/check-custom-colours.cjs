#!/usr/bin/env node
/**
 * Point at a part of the app, change its colour, and have it stay changed.
 *
 * The real thing this has to protect is the reason the accent overrides are
 * written the way they are: every themed container re-declares these tokens
 * on ITSELF, so an override set on <html> alone is beaten by a nearer
 * declaration and changes nothing inside a lesson. That failure is invisible
 * in the settings panel — the swatch shows the new colour, the app does not.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/lib/customColours.ts";',
    resolveDir: root,
    sourcefile: "custom-colours-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

// A browser-shaped world, enough for a stylesheet to be written into.
const stored = new Map();
const head = [];
global.window = {
  localStorage: {
    getItem: (key) => (stored.has(key) ? stored.get(key) : null),
    setItem: (key, value) => stored.set(key, String(value)),
    removeItem: (key) => stored.delete(key),
  },
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => ({ getPropertyValue: () => "", backgroundColor: "", color: "", borderTopColor: "", borderTopWidth: "0px" }),
};
global.localStorage = global.window.localStorage;
const makeElement = (id) => ({ id, textContent: "", remove() { const at = head.indexOf(this); if (at >= 0) head.splice(at, 1); } });
global.document = {
  documentElement: {
    dataset: {},
    getAttribute: () => global.document.__theme ?? "light",
  },
  getElementById: (id) => head.find((node) => node.id === id) ?? null,
  createElement: () => makeElement(""),
  head: { appendChild: (node) => head.push(node) },
  __theme: "light",
};
global.Event = class { constructor(type) { this.type = type; } };

const compiled = new Module("custom-colours", module);
compiled.filename = path.join(root, ".custom-colours.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  PAINTABLE_PARTS,
  applyCustomColours,
  clearCustomColour,
  getCustomColours,
  resetCustomColours,
  setCustomColour,
  toHexString,
  toRgbString,
} = compiled.exports;

const sheet = () => head.find((node) => node.id === "micheon-custom-colour-overrides")?.textContent ?? "";

// ── the parts on offer ──────────────────────────────────────────────────────
assert.ok(PAINTABLE_PARTS.length >= 6, "the picker offers almost nothing to pick");
for (const part of PAINTABLE_PARTS) {
  assert.ok(/^--[a-z0-9-]+$/.test(part.token), `${part.token} is not a CSS variable`);
  assert.ok(part.name && part.description, `${part.token} has no name a person could read`);
  assert.ok(["background", "border", "text"].includes(part.kind), `${part.token} has no kind`);
}
// Named parts, not "--surface-2". The whole point is pointing at a thing.
for (const part of PAINTABLE_PARTS) {
  assert.ok(!part.name.includes("--"), `${part.token} is named after its variable rather than the thing`);
}

// ── a colour, set, survives and reaches the containers ──────────────────────
stored.clear();
head.length = 0;
setCustomColour("--surface-2", "#123456");
assert.strictEqual(getCustomColours("light")["--surface-2"], "#123456",
  "a colour set in the light theme was not stored");

const css = sheet();
assert.ok(css.includes("--surface-2: #123456 !important"),
  "the override is not written with !important, so the theme blocks outrank it");
// The failure this file exists for: every themed container re-declares these
// tokens, and a nearer declaration wins over one inherited from :root.
for (const scope of [":root", ".new-ui-prototype", ".guided-session.fs-app.prototype-guided-session"]) {
  assert.ok(css.includes(scope), `the override never reaches ${scope}, so that part of the app keeps its old colour`);
}

// ── light and dark keep separate books ──────────────────────────────────────
global.document.__theme = "dark";
assert.deepStrictEqual(getCustomColours("dark"), {},
  "a colour chosen in the light theme leaked into the dark one, where it may be unreadable");
setCustomColour("--surface-2", "#eeddcc");
assert.strictEqual(getCustomColours("dark")["--surface-2"], "#eeddcc");
assert.strictEqual(getCustomColours("light")["--surface-2"], "#123456",
  "setting a dark colour overwrote the light one");
applyCustomColours("dark");
assert.ok(sheet().includes("#eeddcc") && !sheet().includes("#123456"),
  "the dark theme is painting the light theme's colour");
global.document.__theme = "light";

// ── a part with partners moves with them ────────────────────────────────────
const paired = PAINTABLE_PARTS.find((part) => part.also?.length);
if (paired) {
  setCustomColour(paired.token, "#0f0f0f");
  const withPartners = sheet();
  for (const partner of paired.also) {
    assert.ok(withPartners.includes(`${partner}: #0f0f0f !important`),
      `${paired.name} did not carry ${partner} with it, so the app is half-recoloured`);
  }
}

// ── undo, and reset ─────────────────────────────────────────────────────────
clearCustomColour("--surface-2");
assert.ok(!("--surface-2" in getCustomColours("light")), "a cleared part is still stored");
resetCustomColours();
assert.deepStrictEqual(getCustomColours("light"), {}, "reset left light colours behind");
assert.deepStrictEqual(getCustomColours("dark"), {}, "reset left dark colours behind");
assert.strictEqual(sheet(), "",
  "with nothing overridden the stylesheet must go, so the app's own palette is back in charge");

// ── only real colours, and only offered tokens ──────────────────────────────
setCustomColour("--surface-2", "not a colour");
assert.deepStrictEqual(getCustomColours("light"), {}, "a junk value was accepted into a stylesheet");
setCustomColour("--secret-token", "#123456");
assert.deepStrictEqual(getCustomColours("light"), {},
  "a token the picker never offered was accepted, so storage can inject any variable it likes");
// And the same on the way out: storage is not to be trusted just because it is ours.
stored.set("gl-custom-colours", JSON.stringify({ light: { "--evil": "#000000", "--surface-2": "#abcdef" }, dark: {} }));
assert.deepStrictEqual(getCustomColours("light"), { "--surface-2": "#abcdef" },
  "an unknown token in storage was read back and would have been injected");

// ── colour conversion, both directions ──────────────────────────────────────
assert.strictEqual(toRgbString("#161b23"), "rgb(22, 27, 35)");
assert.strictEqual(toRgbString("rgb(22, 27, 35)"), "rgb(22, 27, 35)");
assert.strictEqual(toRgbString("rgba(22, 27, 35, 0.5)"), "rgb(22, 27, 35)");
assert.strictEqual(toHexString("rgb(22, 27, 35)"), "#161b23");
assert.strictEqual(toRgbString("nonsense"), null);

// ── the picker, and the settings that start it ──────────────────────────────
const inspector = fs.readFileSync(path.join(root, "src/components/settings/ColourInspector.tsx"), "utf8");
assert.ok(inspector.includes("elementFromPoint"), "the picker does not look at what is under the pointer");
assert.ok(inspector.includes('style.pointerEvents = "none"'),
  "the capture layer stays under the pointer during the hit test, so every reading is the overlay itself");
assert.ok(inspector.includes('event.key === "Escape"'), "there is no way out of the picker with the keyboard");
assert.ok(/createPortal\(/.test(inspector),
  "the picker is not portalled, so it cannot outline anything outside the settings panel");

const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
assert.ok(settings.includes("<ColourInspector"), "the picker is never mounted");
assert.ok(settings.includes("Pick a part of the app"), "there is no way to start the picker");
assert.ok(settings.includes("resetCustomColours"), "there is no way to put everything back");

const boot = fs.readFileSync(path.join(root, "src/main.tsx"), "utf8");
assert.ok(boot.includes("applyCustomColours()"), "chosen colours are not painted at startup, so they vanish on restart");
assert.ok(
  boot.indexOf("applyAccentColour()") < boot.indexOf("applyCustomColours()"),
  "the accent is applied after the hand-picked parts, so it overwrites them"
);
const theme = fs.readFileSync(path.join(root, "src/lib/theme.ts"), "utf8");
assert.ok(theme.includes("applyCustomColours"),
  "switching between light and dark does not swap the colours, which are stored per theme");

const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
for (const part of PAINTABLE_PARTS) {
  assert.ok(i18n.includes(`"${part.name}":`), `"${part.name}" is not translated`);
  assert.ok(i18n.includes(`"${part.description}":`), `the description of ${part.name} is not translated`);
}

console.log(
  `check-custom-colours: ${PAINTABLE_PARTS.length} parts can be pointed at and recoloured, `
  + "per theme, reaching every themed container"
);
// Saving a colour schedules the shared-storage flush, and a pending timer
// keeps node alive with the output still buffered — the check appears to hang
// having already passed. Every assertion above is synchronous, so once we are
// here there is nothing left to wait for.
process.exit(0);
