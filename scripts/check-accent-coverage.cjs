#!/usr/bin/env node
/**
 * Every colour is changeable, including the ones painted as literals.
 *
 * Picking a custom accent re-points the tokens, but a good deal of Micheon is
 * hand-painted green: the course hero, the Continue learning button, the
 * progress tracks, the glows. Two passes fixed those — first the #hex greens,
 * then the rgba() ones, which is where the hero's wash lived and why that
 * gradient stayed green while the panel behind it turned purple.
 *
 * This holds the line: a brand green in a paint property must be reachable
 * under html[data-accent="custom"], or it is a colour the learner cannot
 * change.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const RULE = /([^{}]+)\{([^{}]*)\}/g;
const RGBA = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/g;
const HEX = /#([0-9a-fA-F]{6})\b/g;
const PAINTS = new Set(["background", "background-color", "background-image",
  "box-shadow", "border-color", "color", "border"]);

const norm = (s) => s.split(/\s+/).filter(Boolean).join(" ");

/**
 * One identity for a selector, whether or not it carries the accent flag or a
 * theme root. Both sides of the comparison MUST use this — computing the two
 * keys differently is how a gate reports hundreds of failures that are all
 * already fixed.
 */
const key = (selector) => {
  let s = norm(selector).replace(/\[data-accent="custom"\]/g, "");
  // Drop a leading `html` plus its attribute selectors AND any :not() guard on
  // it — light-mode twins are scoped html:not([data-theme="dark"]) so they
  // cannot outrank the dark rules, and that guard is not part of the identity.
  s = s.replace(/^html(\[[^\]]+\]|:not\([^)]*\))*/, (m, _a, offset, whole) => {
    const rest = whole.slice(m.length);
    return rest.startsWith(".") || rest.startsWith("#") ? "html" : "";
  });
  return norm(s);
};
const channels = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
const isBrandGreen = ([r, g, b]) => g > 28 && g - Math.max(r, b) > 10;

/**
 * Green that MEANS something, not green that is the brand.
 *
 * "Correct", "you knew it", "good" are right-answer feedback. A learner who
 * picks a red accent must not be told their correct answer is red, so these
 * deliberately stay green in every accent and are exempt from the sweep.
 */
const SEMANTIC = /is-good|is-correct|--correct|answer--correct|flashcard-known|grade-btn-known|is-right/i;

const failures = [];
let checked = 0;

for (const rel of ["src/index.css", "src/prototype/new-ui-prototype.css"]) {
  const css = fs.readFileSync(path.join(root, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

  // what a custom accent already re-points, per selector AND property
  const covered = new Map();
  for (const m of css.matchAll(RULE)) {
    const sel = norm(m[1]);
    if (!sel.includes('data-accent="custom"')) continue;
    const props = new Set(m[2].split(";").filter((d) => d.includes(":")).map((d) => d.split(":")[0].trim()));
    for (const part of sel.split(",")) {
      const k = key(part);
      const into = covered.get(k) ?? new Set();
      props.forEach((p) => into.add(p));
      covered.set(k, into);
    }
  }

  const uncovered = [];
  for (const m of css.matchAll(RULE)) {
    const sel = norm(m[1]);
    if (sel.includes("@") || sel.includes('data-accent="custom"') || SEMANTIC.test(sel)) continue;
    for (const decl of m[2].split(";")) {
      if (!decl.includes(":")) continue;
      const prop = decl.slice(0, decl.indexOf(":")).trim();
      const value = decl.slice(decl.indexOf(":") + 1).trim();
      if (!PAINTS.has(prop)) continue;
      const greens = [...value.matchAll(RGBA)].map((g) => [+g[1], +g[2], +g[3]])
        .concat([...value.matchAll(HEX)].map((g) => channels(g[1])))
        .filter(isBrandGreen);
      if (!greens.length) continue;
      checked += 1;
      for (const part of sel.split(",")) {
        if (!covered.get(key(part))?.has(prop)) uncovered.push(`${rel}: ${norm(part).slice(0, 70)} ${prop}`);
      }
    }
  }
  if (uncovered.length) {
    failures.push(`${uncovered.length} brand greens a custom accent cannot reach, e.g.`);
    uncovered.slice(0, 6).forEach((u) => failures.push("    " + u));
  }
}

// The one the learner actually asked about, pinned by name.
const proto = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");
if (!/html[^{,]*\[data-accent="custom"\][^{]*\.np-course-shade\s*\{[^}]*--accent(-hover)?-rgb/.test(proto)) {
  failures.push("the course hero's gradient wash does not follow a custom accent");
}
const accent = fs.readFileSync(path.join(root, "src/lib/accentColour.ts"), "utf8");
if (!/"--accent-rgb"/.test(accent) || !/function accentChannels/.test(accent)) {
  failures.push("there are no bare accent channels, so no translucent gradient can be built from the accent");
}

if (failures.length) {
  console.error("FAIL check-accent-coverage");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-accent-coverage: all ${checked} hand-painted greens follow a custom accent, gradient wash included`);
