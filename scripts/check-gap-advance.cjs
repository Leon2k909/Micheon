#!/usr/bin/env node
/**
 * A finished word moves the caret to the next blank, and the blank's number is
 * not welded to the divider beside it.
 *
 * Two blanks give two boxes. Typing the whole of the first answer used to leave
 * the caret sitting in a box that had nothing left to receive — the exercise
 * looked frozen, and the only way on was an Enter the screen never asked for.
 * Three things have to hold, and all three fail quietly:
 *
 *   1. IT MOVES. A box holding a whole missing word hands the caret on.
 *   2. IT WAITS. Blanks are order-free, so a box is judged against the pool of
 *      answers, earlier boxes take their match out of that pool first, and a
 *      word still growing into a different answer keeps the caret. With "es"
 *      and "essen" both missing, jumping at "es" would truncate the word the
 *      learner was in the middle of typing.
 *   3. IT IS WIRED. The rule can be perfect and unreachable: the component has
 *      to call it from the box's own onChange, not only from Enter.
 *
 * And the spacing: the number is the first thing past the prompt's border-right,
 * so without padding of its own it touches the line while its box looks roomy.
 *
 * The rule is exercised as the real compiled TypeScript rather than read off the
 * page, because a check that greps for a function name passes against a function
 * that returns the wrong answer.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/lib/gapFill.ts";',
    resolveDir: root,
    sourcefile: "gap-advance-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("gap-advance", module);
compiled.filename = path.join(root, ".gap-advance.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { gapEntryIsComplete, matchesGapInput } = compiled.exports;

assert.strictEqual(typeof gapEntryIsComplete, "function",
  "gapFill must export gapEntryIsComplete — the caret has nothing to ask");

// 1. IT MOVES — the case from the screenshot: "probieren" typed in full.
const twoBlanks = ["probieren", "gemeinsam"];
assert.ok(gapEntryIsComplete(["probieren", ""], 0, twoBlanks),
  "a box holding a whole missing word must release the caret");
assert.ok(gapEntryIsComplete(["gemeinsam", ""], 0, twoBlanks),
  "either missing word finishes the first box — the blanks are order-free");

// Half-typed, mis-typed and empty all keep the caret where it is.
assert.ok(!gapEntryIsComplete(["probier", ""], 0, twoBlanks), "half a word is not a finished word");
assert.ok(gapEntryIsComplete(["probieren!", ""], 0, twoBlanks),
  "trailing punctuation is normalised away like everywhere else in the stage");
assert.ok(!gapEntryIsComplete(["", ""], 0, twoBlanks), "an empty box must not jump");
assert.ok(!gapEntryIsComplete(["   ", ""], 0, twoBlanks), "whitespace is not an answer");
assert.ok(!gapEntryIsComplete(["probierte", ""], 0, twoBlanks), "a near miss is still a miss");

// Case and ß are as tolerant as the checker that grades the same answer.
assert.ok(gapEntryIsComplete(["PROBIEREN", ""], 0, twoBlanks), "case must not decide");
assert.ok(gapEntryIsComplete(["strasse", ""], 0, ["Straße", "gemeinsam"]),
  "ss/ß must not decide — the final check accepts it, so the caret must too");

// 2. IT WAITS — an answer that is the start of another answer holds the caret.
const overlapping = ["es", "essen"];
assert.ok(!gapEntryIsComplete(["es", ""], 0, overlapping),
  'the "es" being typed may still be growing into "essen" — no yanking mid-word');
assert.ok(gapEntryIsComplete(["essen", ""], 0, overlapping),
  "once the longer answer is complete the caret moves");
// Once the ambiguity is gone — "essen" already claimed — "es" is unambiguous.
assert.ok(gapEntryIsComplete(["essen", "es", ""], 1, ["es", "essen", "noch"]),
  "an earlier box claims its answer, which frees the shorter word to finish this one");

// An answer already used up by an earlier box cannot finish this one too.
assert.ok(!gapEntryIsComplete(["probieren", "probieren"], 1, twoBlanks),
  "one occurrence of an answer satisfies one blank, not two");
// ...unless the same word really is missing twice.
assert.ok(gapEntryIsComplete(["noch", "noch"], 1, ["noch", "noch"]),
  "a word missing twice may finish two boxes");

// A single blank has nowhere to advance to, but the rule must not throw.
assert.strictEqual(gapEntryIsComplete(["probieren"], 0, ["probieren"]), true);
assert.strictEqual(gapEntryIsComplete([], 0, []), false, "no answers means nothing to finish");
assert.strictEqual(gapEntryIsComplete(["x"], 0, ["  "]), false, "blank answers are not answers");

// The two rules must agree: what finishes every box must also pass the check.
assert.ok(matchesGapInput(["probieren", "gemeinsam"].join(" "), twoBlanks),
  "boxes the caret walked through must add up to a correct answer");

// 3. IT IS WIRED — from the box's own onChange, not only from Enter.
// Line endings are CRLF in this repo; the shapes below are written with \n.
const readSource = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8")
  .split("\r\n").join("\n");
const view = readSource("src", "GuidedSession.tsx");
assert.ok(view.includes("gapEntryIsComplete"),
  "GuidedSession must import and use gapEntryIsComplete");
const opener = "onChange={(e) => {\n                          const value = e.target.value;";
const openerAt = view.indexOf(opener);
assert.notStrictEqual(openerAt, -1,
  "the gap box's onChange must be the multi-statement handler that can advance");
const onChange = view.slice(openerAt);
const handler = onChange.slice(0, onChange.indexOf("}}") + 2);
assert.ok(handler.includes("gapEntryIsComplete("),
  "the advance must happen on typing — Enter alone is the bug being fixed");
assert.ok(handler.includes("gapInputRefs.current[index + 1]?.focus()"),
  "the handler must actually move the caret to the next box");
assert.ok(/index\s*<\s*gap\.words\.length\s*-\s*1/.test(handler),
  "the last box must not try to advance past itself");
assert.ok(handler.includes("nextIsEmpty"),
  "a box that already holds an answer must not have the caret stolen back into it");

// The spacing fix: the numbered row clears the prompt's divider.
const css = readSource("src", "index.css").replace(/\/\*[\s\S]*?\*\//g, "");
const rules = new Map();
for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  rules.set(match[1].trim().replace(/\s+/g, " "), match[2]);
}
const promptRule = rules.get(".fs-prompt");
assert.ok(promptRule && /border-right/.test(promptRule),
  "the prompt still draws the divider the number was touching");
const rowRule = rules.get(".guided-session .fs-gap-row");
assert.ok(rowRule, ".fs-gap-row must exist — it is what holds the number off the line");
const rowPad = /padding-left:\s*(\d+)px/.exec(rowRule);
assert.ok(rowPad && Number(rowPad[1]) >= 8,
  `.fs-gap-row needs real clearance from the divider, found "${rowRule.trim()}"`);
assert.ok(view.includes('gap.words.length > 1 && "fs-gap-row"'),
  "the padding must be applied exactly where the numbers are drawn");

console.log(
  "check-gap-advance: a finished word hands the caret on, a word still growing keeps it, "
  + "the advance is wired to typing rather than to Enter, and the blank number clears the divider."
);
