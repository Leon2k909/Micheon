#!/usr/bin/env node
/**
 * The leaderboard has to survive having almost nobody on it.
 *
 * Its table is you plus the friends you have actually added, so the ordinary
 * early sizes are one row and two rows. The podium arrangement was written as
 * [second, first, third] read straight out of that table, which only holds at
 * three: at two the third place came back undefined, and the renderer read
 * .id off it and threw. The whole page went to the error boundary, so adding
 * a first friend and going to look at the leaderboard was a crash.
 *
 * The sizes below are therefore not a tidy sweep for its own sake — one and
 * two are the sizes almost every learner has, and they are the ones that were
 * broken. What is asserted is that no arrangement ever contains a hole, since
 * a hole is what the renderer cannot survive.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export { arrangePodium } from "./src/lib/leaderboardPodium.ts";',
    resolveDir: root,
    sourcefile: "podium-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});

const loaded = new Module("podium-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "podium-entry.cjs"));
const { arrangePodium } = loaded.exports;

const row = (id) => ({ id });
const ids = (rows) => rows.map((entry) => entry.id);

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

// The crash itself: every size must come back hole-free, because the renderer
// dereferences each entry immediately.
for (const size of [0, 1, 2, 3, 4, 9]) {
  check(`a table of ${size} arranges without a hole`, () => {
    const arranged = arrangePodium(Array.from({ length: size }, (_, i) => row(`p${i}`)));
    assert.ok(Array.isArray(arranged), "expected an array");
    for (const entry of arranged) {
      assert.ok(entry && typeof entry.id === "string", `hole in the arrangement for size ${size}`);
    }
  });
}

check("alone, there is no podium at all", () => {
  assert.deepStrictEqual(arrangePodium([row("me")]), []);
  assert.deepStrictEqual(arrangePodium([]), []);
});

check("two stand in ranked order, because there is no middle to raise", () => {
  assert.deepStrictEqual(ids(arrangePodium([row("first"), row("second")])), ["first", "second"]);
});

check("three put the winner in the middle", () => {
  assert.deepStrictEqual(
    ids(arrangePodium([row("first"), row("second"), row("third")])),
    ["second", "first", "third"],
  );
});

check("a longer table is cut to three, keeping the top of it", () => {
  const arranged = ids(arrangePodium(["first", "second", "third", "fourth", "fifth"].map(row)));
  assert.deepStrictEqual(arranged, ["second", "first", "third"]);
  assert.ok(!arranged.includes("fourth"), "fourth place reached the podium");
});

check("the table it is given is not reordered underneath the caller", () => {
  const table = [row("first"), row("second"), row("third")];
  arrangePodium(table);
  assert.deepStrictEqual(ids(table), ["first", "second", "third"]);
});

// The renderer has to actually use it, and has to keep the empty case off the
// screen — an arrangement of [] still renders a bordered, 230px-tall panel.
const view = fs.readFileSync(path.resolve(root, "src/prototype/NewUiPrototype.tsx"), "utf8").replace(/\r\n?/gu, "\n");

check("the leaderboard arranges through this function", () => {
  assert.ok(view.includes("const podium = arrangePodium(leaderboard);"), "podium is built some other way");
  assert.ok(
    !/\[\s*leaderboard\[1\]\s*,\s*leaderboard\[0\]/u.test(view),
    "the blind [1],[0],[2] arrangement is back",
  );
});

check("an empty arrangement renders no podium", () => {
  assert.ok(view.includes("{podium.length ? ("), "the podium renders unconditionally");
});

check("the podium tells the stylesheet how many places it holds", () => {
  assert.ok(view.includes("data-places={podium.length}"), "data-places is missing");
});

const css = fs.readFileSync(path.resolve(root, "src/prototype/new-ui-prototype.css"), "utf8");
check("two places are given two columns, not three with a gap", () => {
  assert.ok(
    /\.np-leaderboard-podium\[data-places="2"\]\s*\{[^}]*grid-template-columns:\s*repeat\(2/u.test(css),
    "no two-column rule for a two-person podium",
  );
});

if (failed) {
  console.error(`\n${failed} leaderboard podium check(s) failed.`);
  process.exit(1);
}
console.log("Leaderboard podium check passed.");
