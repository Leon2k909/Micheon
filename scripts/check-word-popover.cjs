#!/usr/bin/env node
/**
 * The word panel has to fit on the screen it opens on.
 *
 * It opened upward, always. That was itself a fix — downward ran it into the
 * bottom of a lesson card — but a fixed direction only moves the problem to
 * wherever the sentence sits high instead of low. Listen puts it near the top
 * of the window, and upward there put the word and its meaning behind the
 * header, leaving two buttons and nothing to say what they were for.
 *
 * Sideways is the same fault at the ends of a line: the panel is centred on
 * its word, so a word near an edge centred 190px of panel half outside the
 * window.
 *
 * The placement is RUN here rather than restated. The first version of this
 * check carried its own copy of the arithmetic and read only the constants
 * from the component — so breaking the flip outright left it green, which is
 * the exact failure a check like this exists to catch.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/lib/popoverPlacement.ts";',
    resolveDir: root,
    sourcefile: "popover-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("popover-placement", module);
compiled.filename = path.join(root, ".popover-placement.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { placeWordPopover, POPOVER_HEIGHT, POPOVER_WIDTH, POPOVER_EDGE } = compiled.exports;

const view = fs.readFileSync(path.join(root, "src/components/shared/TappableSentence.tsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");

const FLIP_AT = POPOVER_HEIGHT + POPOVER_EDGE;

// ── up or down ──────────────────────────────────────────────────────────────
// A word low on the page has room overhead, and opening up keeps the panel off
// the sentence. A word near the top has no such room.
assert.strictEqual(placeWordPopover({ top: 600, left: 400, width: 40 }, 1280).below, false,
  "a word with plenty of room above still opened downward, over the sentence it belongs to");
assert.strictEqual(placeWordPopover({ top: 40, left: 400, width: 40 }, 1280).below, true,
  "a word near the top of the window opened upward, which is where the header is — "
  + "the word and its meaning are the parts that go, leaving two unexplained buttons");
assert.strictEqual(placeWordPopover({ top: FLIP_AT, left: 400, width: 40 }, 1280).below, false,
  "the flip fires a pixel early");
assert.strictEqual(placeWordPopover({ top: FLIP_AT - 1, left: 400, width: 40 }, 1280).below, true,
  "the flip fires a pixel late, so the panel is clipped by exactly the margin it did not check");

// ── left and right ──────────────────────────────────────────────────────────
assert.strictEqual(placeWordPopover({ top: 600, left: 620, width: 40 }, 1280).shift, 0,
  "a word in the middle of the line was shifted for no reason");

const atLeft = placeWordPopover({ top: 600, left: 4, width: 30 }, 1280);
assert.ok(atLeft.shift > 0, "the first word of a line centred the panel off the left edge");
assert.ok(4 + 15 + atLeft.shift - POPOVER_WIDTH / 2 >= POPOVER_EDGE - 1,
  `shifting by ${atLeft.shift} still leaves the panel past the left edge`);

const atRight = placeWordPopover({ top: 600, left: 1250, width: 26 }, 1280);
assert.ok(atRight.shift < 0, "the last word of a line centred the panel off the right edge");
assert.ok(1250 + 13 + atRight.shift + POPOVER_WIDTH / 2 <= 1280 - POPOVER_EDGE + 1,
  `shifting by ${atRight.shift} still leaves the panel past the right edge`);

// A window narrower than the panel cannot fit it; it must still answer.
assert.ok(Number.isFinite(placeWordPopover({ top: 600, left: 100, width: 30 }, 320).shift),
  "a window narrower than the panel produced no placement at all");

// ── and the component uses the answer ───────────────────────────────────────
assert.ok(view.includes("placeWordPopover("),
  "the component works its own placement out, so this check is measuring something nothing draws");
assert.ok(view.includes("popoverPlace.below && \"is-below\""), "the measured direction is not put on the panel");
assert.ok(view.includes("marginLeft: `${popoverPlace.shift}px`"), "the measured sideways shift is not applied");
assert.ok(view.includes("anchorRefs.current[i] = node"),
  "nothing holds the word's position, so there is nothing to measure against");
assert.ok(/\.fs-word-popover\.is-below\s*\{[^}]*top: calc\(100% \+ 8px\)[^}]*bottom: auto/.test(styles),
  "is-below has no rule, so the measured direction changes nothing on screen");
assert.ok(/\.fs-word-popover\s*\{[^}]*max-width: min\(280px, calc\(100vw - 20px\)\)/.test(styles),
  "the panel can still be drawn wider than the window it opens in");

console.log(
  "check-word-popover: the word panel opens away from the edge it would cross — "
  + `downward within ${FLIP_AT}px of the top, and pulled back inside either side`
);
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
