#!/usr/bin/env node
/**
 * Settings can be searched, and the accent colour can be changed and put back.
 *
 * Both promises have a way of quietly breaking. Search is only useful if it
 * looks INSIDE the collapsed categories — matching their titles alone would
 * find "Appearance" but never "dark mode" or "tyre". And a hand-picked accent
 * is only safe if the ink on top of it is derived rather than assumed: the
 * built-in green is dark enough for white text, a picked yellow is not.
 */
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/accentColour.ts";`,
    resolveDir: root,
    sourcefile: "accent-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-settings-search.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-settings-search.entry.cjs"));
const {
  ACCENT_PRESETS, DEFAULT_ACCENT, accentShades, contrastRatio, inkOn, normaliseHex,
} = mod.exports;

const failures = [];

// ── the ink on the accent is derived, never assumed ───────────────────────
// Every preset, and a deliberately awful pick, must end up with readable text
// on the button. This is the whole reason the shades are computed.
const TRIALS = [...ACCENT_PRESETS.map((p) => p.hex), "#ffee00", "#000000", "#ffffff", "#7a7a7a"];
for (const hex of TRIALS) {
  for (const theme of ["light", "dark"]) {
    const shades = accentShades(hex, theme);
    const ratio = contrastRatio(shades.accent, shades.accentText);
    if (ratio < 4.5) {
      failures.push(`${hex} in ${theme}: button text lands at ${ratio.toFixed(2)}:1 on the fill`);
    }
  }
}
if (inkOn("#ffee00") !== "#0b0e13") failures.push("yellow should take dark ink, not white");
if (inkOn("#1f2937") !== "#ffffff") failures.push("a dark accent should take white ink");

// ── normalisation is defensive ────────────────────────────────────────────
if (normaliseHex("43b84c") !== DEFAULT_ACCENT) failures.push("a hex without # should normalise");
if (normaliseHex("#4B8") !== "#44bb88") failures.push("three-digit hex should expand");
if (normaliseHex("rgb(1,2,3)") !== null) failures.push("a non-hex should be rejected, not guessed at");

// ── the default hands the palette back to the stylesheets ─────────────────
const lib = fs.readFileSync(path.join(root, "src/lib/accentColour.ts"), "utf8");
if (!/existing\?\.remove\(\)/.test(lib)) {
  failures.push("choosing the default must remove the override stylesheet, or the hand-tuned green is lost");
}
if (!/--np-green/.test(lib)) {
  failures.push("the prototype paints from --np-green; a custom accent that skips it only half applies");
}
// Every themed container re-declares --accent on itself, and a property on a
// closer ancestor beats one inherited from the root — so root-level inline
// styles reached nothing. The override must name those containers and win.
for (const scope of [".new-ui-prototype", ".guided-session.fs-app.prototype-guided-session", ".audio-mixer-panel.prototype-audio-mixer"]) {
  if (!lib.includes(`"${scope}"`)) {
    failures.push(`the accent override does not reach ${scope}, which declares its own --accent`);
  }
}
if (!/!important/.test(lib)) {
  failures.push("the override would lose to the theme blocks' higher specificity without !important");
}

// ── search reaches inside the collapsed categories ────────────────────────
const profile = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
if (!/SETTINGS_SEARCH_INDEX/.test(profile)) {
  failures.push("nothing indexes what each category contains, so search can only match titles");
}
for (const [term, category] of [
  ["dark mode", "Appearance"],
  ["tyre", "Language & voice"],
  ["startup", "Desktop app & updates"],
  ["mascot", "Pet & mascot"],
]) {
  const index = /const SETTINGS_SEARCH_INDEX[\s\S]*?\n};/.exec(profile);
  if (!index) { failures.push("the search index could not be read"); break; }
  const line = index[0].split("\n").find((l) => l.includes(`${category}"`) || l.trim().startsWith(category));
  if (!line || !line.toLowerCase().includes(term.split(" ")[0])) {
    failures.push(`searching "${term}" would not find ${category}`);
  }
}
if (!/forceOpen=\{settingsTerms\.length > 0\}/.test(profile)) {
  failures.push("a search hit does not open its category, so the match stays hidden");
}
if (!/hidden=\{!matchesSearch\(/.test(profile)) {
  failures.push("non-matching categories are not hidden, so search filters nothing");
}
if (!/Nothing matches that/.test(profile)) {
  failures.push("a search with no hits shows an empty screen instead of saying so");
}

// ── one focus ring, not two ───────────────────────────────────────────────
const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
if (!/\.settings-search__input:focus[\s\S]{0,220}outline: none;/.test(css)) {
  failures.push("the settings search would draw the global input ring around its own focus border");
}
const switcher = fs.readFileSync(path.join(root, "src/components/course/CourseSwitcher.tsx"), "utf8");
// A utility class in the markup is not proof: :focus-visible from a real
// keyboard outranks it, which is how this passed while the focused search was
// visibly drawing two rings. What settles it is a named rule that clears the
// outline, so that is what gets checked.
if (!/course-switcher-search/.test(switcher)) {
  failures.push("the course switcher's search is not covered by the single-ring rule");
}
if (!/\.course-switcher-search:focus-visible[\s\S]{0,200}outline: none;/.test(css)) {
  failures.push("nothing clears the platform focus ring on the course switcher's search, so it draws two");
}

// ── a changed border AND a hard ring is two borders ──────────────────────
//
// This is what a learner sees as "2 borders": an accent border with a 0-blur
// box-shadow just outside it traces a second rounded rectangle in the same
// colour. A blurred shadow reads as a glow and does not. Checked across every
// focus rule, plus the shared Input component, because the last version of
// this gate looked for a utility class and passed while the bug was on screen.
const sheets = ["src/index.css", "src/prototype/new-ui-prototype.css"]
  .map((rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, ""));
for (const sheet of sheets) {
  for (const m of sheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].replace(/\s+/g, " ").trim();
    if (!/:focus(-visible|-within)?\b/.test(sel)) continue;
    const body = m[2].replace(/\s+/g, " ");
    if (!/border(-color)?\s*:/.test(body)) continue;
    // 0 0 0 Npx — no offset, no blur, pure spread: a ring.
    if (/box-shadow:[^;]*\b0 0 0 \d+px/.test(body)) {
      failures.push(`${sel.slice(0, 58)} draws a border AND a hard ring on focus — that is the two borders`);
    }
  }
}
const inputComponent = fs.readFileSync(path.join(root, "src/components/ui/input.tsx"), "utf8");
if (/focus-visible:ring-\d/.test(inputComponent) && /focus-visible:border-/.test(inputComponent)) {
  failures.push("the shared Input draws an accent border and a ring, which is two borders on every field using it");
}

if (failures.length) {
  console.error("FAIL check-settings-search");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-settings-search: ${TRIALS.length} accent colours all derive readable ink in both themes, search reaches inside collapsed categories, and focus draws one ring`);
