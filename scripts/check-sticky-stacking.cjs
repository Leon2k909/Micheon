#!/usr/bin/env node
/**
 * A sticky element seals its children in, and two places must not both decide
 * where an element sits.
 *
 * The Know it menu opened over the queue scrubber's Go button — or rather it
 * did not: Go drew straight through the open menu, on top of it. The menu had
 * a z-index of its own and it made no difference, because `position: sticky`
 * creates a stacking context whether or not anybody asked for one. Inside that
 * context the menu's z-index only sorts it against its siblings; it cannot
 * lift the whole thing over anything outside. The fix is a z-index on the
 * sticky element itself, which is what the title bar has always had.
 *
 * The reason it survived so long is the second rule here. The same element
 * carried BOTH `position: sticky` from the stylesheet and Tailwind's
 * `relative` on its className, and which one won came down to which rule the
 * bundler emitted last: `relative` in the dev server, `sticky` in the built
 * bundle. Relative does not create a stacking context, so the menu behaved
 * perfectly in development and was broken in the app people actually run.
 * Nothing about that is visible in either place on its own — you have to open
 * the built app to see it — so it is checked here instead.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
// Comments out first. This stylesheet explains itself at length, and a comment
// sitting between one rule's closing brace and the next rule's selector is
// picked up as part of that selector — which quietly dropped every documented
// rule from the parse, including the one this check exists for.
const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Every rule that sets `position`, by the single class it targets. */
const rules = new Map();
// No leading `}` in this pattern: each rule's closing brace would be eaten
// by its own match, leaving the next rule with nothing to anchor on, and
// only every other rule was parsed.
for (const match of css.matchAll(/([^{}@]+)\{([^}]*)\}/g)) {
  const body = match[2];
  const position = body.match(/(?:^|;)\s*position:\s*([a-z-]+)/);
  if (!position) continue;
  const zIndex = body.match(/(?:^|;)\s*z-index:\s*(-?\d+)/);
  for (const selector of match[1].split(",")) {
    const single = selector.trim().match(/^\.([\w-]+)$/);
    if (single) rules.set(single[1], { position: position[1], zIndex: zIndex ? Number(zIndex[1]) : null });
  }
}
assert.ok(rules.size > 5, `only found ${rules.size} positioned classes — the stylesheet parse has stopped working`);

// ── every sticky element states which layer it is on ────────────────────────
// Not a style preference: sticky makes a stacking context, so the z-index of
// everything inside it is measured against this element's, and leaving that
// at auto is choosing a layer by accident.
const stickyWithoutLayer = [...rules.entries()]
  .filter(([, rule]) => rule.position === "sticky" && rule.zIndex === null)
  .map(([name]) => `.${name}`);
assert.deepStrictEqual(stickyWithoutLayer, [],
  `${stickyWithoutLayer.join(", ")} is position: sticky with no z-index. Sticky creates a stacking `
  + "context, so any menu or popover inside it cannot rise above anything outside it — give the "
  + "sticky element the z-index instead");

// ── nothing has its position decided in two places ──────────────────────────
// Which one wins is stylesheet order, and that is not the same in the dev
// server as in the built bundle: this is the shape of bug that works perfectly
// while you are building it and ships broken.
const UTILITIES = new Set(["relative", "absolute", "fixed", "sticky", "static"]);
const conflicts = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!/\.tsx?$/.test(entry.name)) continue;
    const source = fs.readFileSync(full, "utf8");
    for (const match of source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
      const classes = (match[1] || match[2] || "").split(/\s+/).filter(Boolean);
      const owned = classes.filter((name) => rules.has(name));
      const utility = classes.filter((name) => UTILITIES.has(name));
      if (!owned.length || !utility.length) continue;
      const line = source.slice(0, match.index).split("\n").length;
      conflicts.push(
        `${path.relative(root, full).replace(/\\/g, "/")}:${line} — .${owned.join(", .")} already sets `
        + `position (${owned.map((name) => rules.get(name).position).join(", ")}) and the same element `
        + `also carries "${utility.join(" ")}"`
      );
    }
  }
};
walk(path.join(root, "src"));
assert.deepStrictEqual(conflicts, [],
  `${conflicts.length} element(s) have their position set twice, so the dev server and the built app `
  + `disagree about it:\n  ${conflicts.join("\n  ")}`);

// ── and the one this was found on ───────────────────────────────────────────
const review = rules.get("listen-card-review");
assert.ok(review, ".listen-card-review no longer sets a position — the grading row is not pinned at all");
assert.strictEqual(review.position, "sticky",
  "the grading row is no longer sticky, so a card long enough to scroll can put Know it below the fold");
assert.ok(review.zIndex != null && review.zIndex > 0,
  "the grading row is sticky with no layer of its own, so the Know it menu is sealed under the "
  + "queue scrubber that follows the card");

const view = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
assert.ok(/className="listen-card-review [^"]*"/.test(view), "the grading row lost its class");
const menu = view.match(/data-testid="listen-review-menu"[\s\S]{0,400}/);
assert.ok(view.includes('className="absolute inset-x-0 top-full z-30'),
  "the Know it menu is no longer positioned above the card's own contents");

console.log(
  `check-sticky-stacking: ${[...rules.values()].filter((r) => r.position === "sticky").length} sticky `
  + "element(s) each name their layer, and no element has its position decided in two places"
);
process.exit(0);
