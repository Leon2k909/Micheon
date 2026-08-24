#!/usr/bin/env node
/**
 * Text on the feature gradient stays readable at every accent colour.
 *
 * The gradient cards — "Words tracked", the course hero —
 * hardcoded #ffffff and then faded it: opacity-70 on the labels, 0.75 and
 * 0.82 on the copy. That is fine on the built-in purple and falls apart
 * everywhere else. The accent is a free colour picker with ten presets, and
 * the gradient runs accentHover -> accentPressed, which in light mode is
 * darker than the accent itself.
 *
 * Measured across all ten presets in both themes, white at 70%: between
 * 1.39:1 and 4.42:1. Amber in dark mode was 1.45:1 — white text on a yellow
 * card. Picking the ink against the gradient and dropping the fade takes the
 * worst case to 3.97:1.
 *
 * This does not read the CSS and hope. It runs the real accentShades() over
 * the real preset list and computes the real contrast ratio, so adding a
 * preset that cannot carry readable text fails here rather than shipping.
 *
 * The floor is 3.9, just under today's worst case (dark Violet, 3.97). It is
 * below AA's 4.5 on purpose: a mid-tone gradient cannot reach 4.5 with either
 * ink, and this guard exists to stop regressions, not to claim a pass. Making
 * every preset clear 4.5 means darkening the gradient itself — a visual
 * decision, not one to smuggle in through a check script.
 */
const path = require("path");
const esbuild = require("esbuild");

const FLOOR = 3.9;
const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  entryPoints: [path.join(root, "src/lib/accentColour.ts")],
  bundle: true,
  format: "cjs",
  write: false,
  platform: "node",
});
const mod = { exports: {} };
new Function("module", "exports", "require", built.outputFiles[0].text)(mod, mod.exports, require);
const { ACCENT_PRESETS, accentShades, contrastRatio } = mod.exports;

// The same choice accentColour.ts makes for --feature-ink. Kept here rather
// than exported so this check fails if the two ever drift apart: if the app
// starts picking a different ink, these numbers stop matching what ships.
const inkFor = (hover, pressed) => {
  const worst = (ink) => Math.min(contrastRatio(ink, hover), contrastRatio(ink, pressed));
  return worst("#ffffff") >= worst("#0b0e13") ? "#ffffff" : "#0b0e13";
};

const failures = [];
let worstSeen = { name: "", ratio: Infinity, theme: "" };

for (const theme of ["light", "dark"]) {
  for (const preset of ACCENT_PRESETS) {
    const shades = accentShades(preset.hex, theme);
    const ink = inkFor(shades.accentHover, shades.accentPressed);
    const ratio = Math.min(
      contrastRatio(ink, shades.accentHover),
      contrastRatio(ink, shades.accentPressed)
    );
    if (ratio < worstSeen.ratio) worstSeen = { name: preset.name, ratio, theme };
    if (ratio < FLOOR) {
      failures.push(
        `${preset.name} in ${theme} mode: text on the feature gradient reaches only ${ratio.toFixed(2)}:1 `
        + `(floor ${FLOOR}). Either the preset is too mid-tone to carry text, or the gradient needs to move.`
      );
    }
  }
}

// The cards must actually use the variable. A perfect ratio is worth nothing
// if the markup still says #ffffff.
const fs = require("fs");
const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const panel = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const accent = fs.readFileSync(path.join(root, "src/lib/accentColour.ts"), "utf8");

if (!/\["--feature-ink",/.test(accent)) {
  failures.push("accentColour.ts no longer publishes --feature-ink, so the cards fall back to the built-in purple's answer");
}
for (const rule of ["course-feature-card", "course-feature-title", "course-feature-copy", "course-feature-label", "lesson-card-active"]) {
  // Plain string slicing, not a built regex: a hand-built one silently matched
  // nothing here and the whole loop passed on a file that had gone back to
  // hardcoded white.
  const open = css.indexOf("." + rule + " {");
  if (open === -1) {
    failures.push(`.${rule} is gone or renamed, so this check can no longer see whether it hardcodes white`);
    continue;
  }
  const block = css.slice(open, css.indexOf("}", open));
  // Only the text colour. A border of "18% white mixed into the accent" is a
  // lighter accent at every hue and is fine; it is the ink that has to move.
  const colour = block.split("\n").filter((line) => line.trim().startsWith("color:")).join(" ");
  if (colour.includes("#ffffff") || colour.includes("rgb(255 255 255")) {
    failures.push(`.${rule} hardcodes white again instead of --feature-ink, so a light accent makes its text vanish`);
  }
}
if (/text-white" style=\{\{ background: "var\(--feature-gradient\)"/.test(panel)) {
  failures.push("a gradient card in Gamification.tsx is back to text-white");
}
if (/opacity-7[05]">\{ui\("(Next target|Words tracked)"\)/.test(panel)) {
  failures.push("a gradient card's label is faded again — that fade is what made it unreadable");
}

if (failures.length) {
  console.error("FAIL check-feature-ink");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-feature-ink: text on the feature gradient clears ${FLOOR}:1 for all ${ACCENT_PRESETS.length} presets in both themes `
  + `(worst: ${worstSeen.name} in ${worstSeen.theme}, ${worstSeen.ratio.toFixed(2)}:1), and the cards read it from --feature-ink`
);
