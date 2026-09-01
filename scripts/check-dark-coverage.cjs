#!/usr/bin/env node
/**
 * Nothing may paint itself light and forget to say what it does in the dark.
 *
 * Most of the app is token-driven, so it flips theme for free. The exceptions
 * are rules that hardcode a literal near-white background — the Practice hub
 * did exactly that, so in dark mode it kept its white cards while the text on
 * them turned near-white too, and the headings vanished.
 *
 * This walks every rule, finds the ones painting a literal light background,
 * and fails unless a dark-mode rule covers the same selector.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const FILES = ["src/prototype/new-ui-prototype.css", "src/index.css"];

/** Relative luminance of a css colour literal, or null if it is not one. */
function luminance(value) {
  const hex = /#([0-9a-f]{3}|[0-9a-f]{6})\b/i.exec(value);
  const rgb = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(value);
  let channels = null;
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/(.)/g, "$1$1") : hex[1];
    channels = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else if (rgb) {
    channels = [1, 2, 3].map((i) => Number(rgb[i]));
  }
  if (!channels) return null;
  const lin = channels.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** Split a stylesheet into { selector, body } pairs, ignoring at-rule wrappers. */
function rules(css) {
  const out = [];
  // Comments first: a comment sitting above a rule otherwise glues itself to
  // the selector, and the rule gets skipped as if it were a comment — which
  // is how a dark override can exist and still be reported missing.
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    if (!selector || selector.startsWith("@") || selector.startsWith("/*")) continue;
    out.push({ selector, body: m[2] });
  }
  return out;
}

/**
 * Light on purpose. Each entry states why, because "it looked wrong in dark"
 * is a bug and "it is meant to be light" is a decision — and only one of them
 * should silence this gate.
 */
const DELIBERATELY_LIGHT = [
  // Artwork and identity marks, not surfaces: a flag stripe is the flag's
  // colour in any theme, and the gold tiers are gold.
  [".np-social-avatar--gold", "gold tier identity"],
  [".np-social-side-icon--gold", "gold tier identity"],
  [".np-premium-mark", "gold premium badge"],
  [".np-podium-rank", "gold first-place mark"],
  [".fs-german-flag", "flag artwork"],
  [".fs-english-flag", "flag artwork"],
  // These sit on their own coloured surface, so they are light against it
  // rather than light against the page.
  [".np-premium-action", "button on the premium card's own coloured surface"],
  [".course-feature-pill", "white on the green course hero"],
  [".course-feature-pill-success", "white on the green course hero"],
  [".course-feature-panel", "white on the green course hero"],
  [".course-feature-progress", "white on the green course hero"],
  [".course-feature-progress-track", "white on the green course hero"],
  // A skip link that is loud on focus in every theme, deliberately.
  [".app-skip-button", "focus affordance, loud on purpose"],
];

/** Compare selectors on shape, not spelling: the dark twin of
 *  "html.is-prototype-shell" is written "html[data-theme=\"dark\"].is-prototype-shell",
 *  which only matches once the theme attribute is folded away. */
function normalise(part) {
  return part.trim().replace(/\s+/g, " ");
}

const failures = [];
const darkSelectors = new Set();
const lightPainters = [];

for (const rel of FILES) {
  const css = fs.readFileSync(path.join(root, rel), "utf8");
  for (const { selector, body } of rules(css)) {
    const isDark = /\[data-theme="dark"\]/.test(selector);
    if (isDark) {
      // Record what each dark rule actually TARGETS, not every class it
      // mentions. Matching on any shared class made an ancestor-level token
      // override look like coverage for a descendant that hardcodes a colour
      // — which is how the guided lesson kept its white cards while its text
      // went white too.
      for (const part of selector.split(",")) {
        const target = normalise(part.replace(/html\[data-theme="dark"\]/g, "html"));
        if (target) darkSelectors.add(target);
      }
      continue;
    }
    // Only literal backgrounds matter; var()-driven ones flip with the tokens.
    for (const decl of body.split(";")) {
      if (!/^\s*background(-color|-image)?\s*:/.test(decl)) continue;
      const value = decl.split(":").slice(1).join(":");
      if (/var\(/.test(value)) continue;
      // The lightest stop in the declaration is what the eye sees.
      const stops = value.match(/#[0-9a-f]{3,6}\b|rgba?\([^)]*\)/gi) || [];
      const lit = stops.map(luminance).filter((n) => n != null);
      if (!lit.length) continue;
      // Transparent overlays sit on whatever is beneath; only near-opaque
      // light fills actually replace the surface.
      const opaque = stops.filter((s) => {
        const a = /rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(s);
        return !a || Number(a[1]) >= 0.9;
      }).map(luminance).filter((n) => n != null);
      if (!opaque.length) continue;
      if (Math.max(...opaque) < 0.6) continue;
      const classes = selector.match(/\.[-\w]+/g) || [];
      if (!classes.length) continue;
      const targets = selector.split(",").map(normalise).filter(Boolean);
      lightPainters.push({ rel, selector, classes, targets });
    }
  }
}

for (const { rel, selector, classes, targets } of lightPainters) {
  // Covered when a dark rule targets the same thing (or an ancestor chain
  // ending in it), not merely when it mentions one of the same classes.
  if (targets.every((t) => [...darkSelectors].some((d) => d === t || d.endsWith(" " + t)))) continue;
  if (DELIBERATELY_LIGHT.some(([cls]) => classes.includes(cls))) continue;
  failures.push(`${rel}: "${selector}" paints a light background with no dark-mode rule for it`);
}

// Everything above walks stylesheets. A screen can paint itself light
// without one: the first-run starting-point screen set every colour in the
// markup - a cream card, white panels, near-black text - so it came up in
// full daylight inside a dark app, and no rule existed for this to find.
//
// These two files are token-driven now. The literals below are the ones they
// used to carry, and any of them coming back means the screen has stopped
// following the theme again.
const FIRST_RUN_FILES = ["src/components/PlacementTest.tsx", "src/guided_learning_session.tsx"];
const LIGHT_PAINT = ["bg-white", "bg-zinc-50", "bg-zinc-100", "text-zinc-950", "text-zinc-600", "text-zinc-500", "border-zinc-200", "border-zinc-300"];
for (const rel of FIRST_RUN_FILES) {
  const markup = fs.readFileSync(path.join(root, rel), "utf8");
  for (const literal of LIGHT_PAINT) {
    if (markup.includes(literal)) {
      failures.push(rel + ': paints "' + literal + '" into the markup, which no dark rule can answer');
    }
  }
}

// And no dark: variant in those files either.
//
// Nothing binds that variant to the app's theme here - there is no custom
// variant declared, so it falls back to the desktop's own setting. On a dark
// desktop with the app in light mode it fires anyway, which is how the green
// option ended up pale green on pale green and unreadable. The tokens
// already know which theme is on; a variant is not needed and not honest.
for (const rel of FIRST_RUN_FILES) {
  const markup = fs.readFileSync(path.join(root, rel), "utf8");
  if (markup.includes("dark:")) {
    failures.push(rel + ": uses a dark: variant, which follows the desktop here rather than the app");
  }
}

if (failures.length) {
  console.error("FAIL check-dark-coverage");
  [...new Set(failures)].forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-dark-coverage: ${lightPainters.length} literal light backgrounds, every one answered in dark mode`);
