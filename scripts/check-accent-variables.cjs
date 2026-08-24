#!/usr/bin/env node
/**
 * A green hidden in a custom property still has to follow the accent.
 *
 * check-accent-coverage walks paint properties — background, color, border
 * and friends. A green declared as a VARIABLE is invisible to it, and that is
 * exactly how the mastery ring stayed green on a pink accent:
 *
 *   --mastery-ring-start:  #2ea742
 *   --mastery-ring-middle: #56c85c
 *   --mastery-ring-end:    #8bd060
 *   --mastery-ring-halo:   rgba(86, 200, 92, 0.24)
 *
 * Four literals, declared once, with no [data-accent="custom"] variant
 * anywhere. The ring's BORDER was re-pointed and nothing else was, which made
 * it worse than leaving it alone: a pink outline around a green ring, sitting
 * on a green-tinted tile, as the one green thing on a pink page.
 *
 * The rule is deliberately loose: a variable holding a brand green must be
 * re-declared somewhere under [data-accent="custom"]. Where does not matter,
 * because a variable only has to be reachable. That keeps this cheap and
 * keeps it from arguing with how the stylesheets are organised.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const FILES = ["src/index.css", "src/prototype/new-ui-prototype.css"];
const RULE = /([^{}]+)\{([^{}]*)\}/g;
const DECL = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
const HEX = /#([0-9a-fA-F]{6})\b/g;
const RGBA = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;

/**
 * Brand green, not "any colour with green in it". Hue 80-165 with real
 * saturation: #2ea742 and #8bd060 are in; #e6e7ee (a blue-grey border) and
 * rgba(54, 82, 45) (a barely-there rule line) are out
 * because re-pointing every muted surface tint would be noise, not a fix.
 */
function isBrandGreen(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 60) return false;
  if (g < r || g < b) return false;
  let h = max === g ? 60 * (2 + (b - r) / d)
    : max === r ? 60 * (((g - b) / d) % 6)
    : 60 * (4 + (r - g) / d);
  if (h < 0) h += 360;
  return h >= 80 && h <= 165;
}

const hexToRgb = (hex) => [
  parseInt(hex.slice(0, 2), 16),
  parseInt(hex.slice(2, 4), 16),
  parseInt(hex.slice(4, 6), 16),
];

/**
 * Two ways a variable can already follow the accent, and only one of them is
 * a CSS rule.
 *
 * accentColour.ts rewrites a long list of them in JavaScript when the accent
 * changes — --mint, --activity-green-*, --np-green and friends. Those are
 * covered; they just are not covered HERE. Reading that list rather than
 * duplicating it means the two cannot drift.
 */
const accentTs = fs.readFileSync(path.join(root, "src/lib/accentColour.ts"), "utf8");
const setInJs = new Set([...accentTs.matchAll(/\["(--[a-z0-9-]+)"/gi)].map((m) => m[1]));

/**
 * Green that MEANS something stays green at every accent — a learner who
 * picks a red accent must not be told their correct answer is red. Same
 * exemption check-accent-coverage makes, for the same reason.
 */
const SEMANTIC = /success|correct|good|right|positive|known|streak-on/i;

// A variable declared twice — once as a literal, once as var(--accent, …) —
// is already coupled; the literal is just the fallback for the default green.
const readsAccent = new Set();

const declared = new Map();
const overridden = new Set();

for (const rel of FILES) {
  const css = fs.readFileSync(path.join(root, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selector, body] of css.matchAll(RULE)) {
    const isCustom = selector.includes('[data-accent="custom"]');
    for (const [, prop, value] of body.matchAll(DECL)) {
      if (isCustom) { overridden.add(prop); continue; }
      const green =
        [...value.matchAll(HEX)].some((m) => isBrandGreen(...hexToRgb(m[1])))
        || [...value.matchAll(RGBA)].some(([, r, g, b]) => isBrandGreen(+r, +g, +b));
      if (value.includes("var(--accent")) readsAccent.add(prop);
      if (green && !declared.has(prop)) declared.set(prop, rel);
    }
  }
}

const stranded = [...declared.keys()].filter((prop) =>
  !overridden.has(prop) && !setInJs.has(prop) && !SEMANTIC.test(prop) && !readsAccent.has(prop));

if (stranded.length) {
  console.error("FAIL check-accent-variables");
  console.error(
    `  ${stranded.length} custom propert${stranded.length === 1 ? "y holds" : "ies hold"} a brand green with no `
    + '[data-accent="custom"] variant, so whatever reads them stays green on every other accent:'
  );
  stranded.slice(0, 10).forEach((p) => console.error(`    ${p}   (${declared.get(p)})`));
  if (stranded.length > 10) console.error(`    … and ${stranded.length - 10} more`);
  process.exit(1);
}

console.log(
  `check-accent-variables: all ${declared.size} custom properties holding a brand green have a custom-accent variant`
);
