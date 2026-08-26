#!/usr/bin/env node
/**
 * A unit can be found by name, and going to it actually arrives.
 *
 * Lessons were already in the search box; the units holding them were not, so
 * typing a unit's name or "unit 12" found nothing and the only route to a unit
 * was scrolling the path until it appeared.
 *
 * The half that is easy to get wrong is the arrival. The path is loaded
 * lazily, so at the moment a result is chosen the element to scroll to does
 * not exist yet — a scrollIntoView fired there does nothing, silently, and
 * the page simply stays where it was. So the scroll waits for its target, and
 * gives up rather than waiting for ever.
 *
 * Both ends have to agree on the id, which is why it comes from one function
 * and not from two template strings that look alike today.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { duoUnitAnchorId, scrollToAnchorWhenReady } from "./src/lib/scrollToAnchor.ts";',
      'export { buildDuoPath } from "./src/lib/duoPath.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "unit-search-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("unit-search-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "unit-search-entry.cjs"));
const { duoUnitAnchorId, scrollToAnchorWhenReady, buildDuoPath, allPartBlueprints } = loaded.exports;

let failed = 0;
const check = (label, run) => {
  try {
    run();
    console.log(`ok   ${label}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${label}\n     ${error.message}`);
  }
};

// ── the scroll, which is the part that fails silently ───────────────────────
const fakeDoc = (appearsAfter) => {
  let asked = 0;
  return {
    asked: () => asked,
    getElementById: () => {
      asked += 1;
      return asked > appearsAfter ? { scrollIntoView() { this.scrolled = true; } } : null;
    },
  };
};
const runFrames = () => {
  const queue = [];
  const frame = (callback) => queue.push(callback);
  const drain = (limit = 500) => {
    let spins = 0;
    while (queue.length && spins < limit) { queue.shift()(); spins += 1; }
    return spins;
  };
  return { frame, drain, pending: () => queue.length };
};

check("a target already on the page is scrolled to at once", () => {
  const doc = fakeDoc(0);
  const { frame, drain } = runFrames();
  scrollToAnchorWhenReady("duo-unit-3", { doc, frame });
  drain();
  assert.strictEqual(doc.asked(), 1, `looked ${doc.asked()} times for something that was already there`);
});

check("a target that arrives late is waited for", () => {
  const doc = fakeDoc(20);
  const { frame, drain } = runFrames();
  scrollToAnchorWhenReady("duo-unit-3", { doc, frame });
  drain();
  assert.ok(doc.asked() >= 21, `gave up after ${doc.asked()} frames, before the lazy view could mount`);
});

check("a target that never arrives is given up on", () => {
  const doc = fakeDoc(Infinity);
  const { frame, drain, pending } = runFrames();
  scrollToAnchorWhenReady("duo-unit-3", { doc, frame, attempts: 12 });
  const spins = drain();
  assert.ok(spins <= 40, `spun ${spins} times for a target that will never exist`);
  assert.strictEqual(pending(), 0, "a callback is still queued for something that never appeared");
});

check("no document means no crash", () => {
  assert.doesNotThrow(() => scrollToAnchorWhenReady("duo-unit-1", { doc: null }));
  assert.doesNotThrow(() => scrollToAnchorWhenReady("", {}));
});

// ── both ends agree on the id ───────────────────────────────────────────────
const view = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const pathView = fs.readFileSync(path.join(root, "src/components/duo/DuoPathView.tsx"), "utf8").replace(/\r\n?/gu, "\n");

check("the unit card carries the id search aims at", () => {
  assert.ok(pathView.includes("id={duoUnitAnchorId(unit.number)}"),
    "the unit card has no id, so there is nothing to scroll to");
  assert.ok(pathView.includes("scroll-mt-24"),
    "without a scroll margin the unit lands under the sticky header, which reads as the wrong unit");
});

check("search builds the same id rather than its own", () => {
  assert.ok(view.includes("scrollToAnchorWhenReady(duoUnitAnchorId(unit.number))"),
    "search scrolls to an id it made up, which will drift from the one the card carries");
  assert.ok(!/id=\{`duo-unit-\$\{/.test(pathView), "the card builds its id by hand instead of from the helper");
});

check("units are searchable by number as well as by name", () => {
  assert.ok(/`unit \$\{unit\.number\}`/.test(view),
    'typing "unit 12" finds nothing: the number is not in the search text');
  assert.ok(view.includes("...unit.nodeTitles"),
    "the lessons inside a unit are not searchable, so a unit is only findable by its own title");
});

check("search reads the units the path actually shows", () => {
  assert.ok(view.includes("buildDuoPath(apiParts).units"),
    "search works out its own units, so its numbering can drift from the path's");
});

// ── and there are units to find ─────────────────────────────────────────────
check("the course produces units for this to find", () => {
  const units = buildDuoPath(allPartBlueprints).units;
  assert.ok(units.length > 10, `only ${units.length} units built`);
  const ids = new Set(units.map((unit) => duoUnitAnchorId(unit.number)));
  assert.strictEqual(ids.size, units.length, "two units share an anchor id, so one is unreachable");
  assert.ok(units.every((unit) => unit.title), "a unit has no title, so it cannot be searched for by name");
});

if (failed) {
  console.error(`\n${failed} unit search check(s) failed.`);
  process.exit(1);
}
console.log("check-unit-search: a unit is findable by name or number, and the path scrolls to it once it exists.");
process.exit(0);
