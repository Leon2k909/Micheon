#!/usr/bin/env node
/**
 * An open menu has to be reachable, not just visible.
 *
 * The flashcard's four panels sit at position: relative; z-index: 1. The
 * topline holds "Set level", and because the topline is positioned WITH a
 * z-index it creates a stacking context -- so the menu's own z-index only ever
 * competed inside the topline and was capped at 1 along with it.
 * .fs-flashcard-content is a sibling at the same z-index and later in the DOM,
 * so it painted over the open menu: its audio button sat on top and swallowed
 * presses meant for the options underneath.
 *
 * A menu cannot raise itself out of its parent's stacking context, so the fix
 * has to lift the PANEL that contains the open menu. This checks the numbers
 * still work out, rather than that a particular line is present.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");

const zIndexOf = (selectorNeedle, { requireHas = false } = {}) => {
  for (const match of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const selector = match[1].replace(/\s+/g, " ").trim();
    if (!selector.includes(selectorNeedle)) continue;
    if (requireHas !== selector.includes(":has(")) continue;
    const z = /z-index:\s*(-?\d+)/.exec(match[2]);
    if (z) return Number(z[1]);
  }
  return null;
};

// The flat baseline the four panels share.
const panelZ = zIndexOf(".fs-flashcard-topline");
if (panelZ === null) {
  failures.push("the flashcard panels no longer declare a z-index, so this check cannot tell whether the menu escapes");
}

// The lift that applies only while a menu is open.
const liftedZ = zIndexOf(":has(.fs-review-level-menu)", { requireHas: true });
if (liftedZ === null) {
  failures.push("nothing raises the panel holding an open review menu, so a later sibling paints over it and eats the press");
} else if (panelZ !== null && liftedZ <= panelZ) {
  failures.push(`the lifted panel (${liftedZ}) does not outrank its siblings (${panelZ}), so the menu is still covered`);
}

// The lift must be conditional. Raising the topline permanently would park it
// above the card's own content for the whole lesson.
const unconditionalTopline = zIndexOf(".fs-flashcard-topline", { requireHas: false });
if (unconditionalTopline !== null && liftedZ !== null && unconditionalTopline >= liftedZ) {
  failures.push("the topline is raised unconditionally rather than only while its menu is open");
}

// And the menu above the rest of its own panel.
const menuZ = zIndexOf(".fs-review-level-menu {", { requireHas: false })
  ?? zIndexOf(".fs-review-level-menu", { requireHas: false });
if (menuZ === null) {
  failures.push("the review menu has no z-index of its own");
}

if (failures.length) {
  console.error("FAIL check-menu-stacking");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(
  `check-menu-stacking: the panel holding an open review menu lifts to ${liftedZ} above its siblings at ${panelZ}, ` +
  "and only while the menu is open"
);
