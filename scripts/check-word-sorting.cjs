#!/usr/bin/env node
/** Regression coverage for every learner-facing Word Tracker sort. */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export { sortWordTrackerRows, WORD_TRACKER_SORTS } from "./src/lib/wordTrackerSort.ts";',
    resolveDir: root,
    sourcefile: "word-sorting-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("word-sorting-check", module);
compiled.filename = path.join(root, ".word-sorting-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { sortWordTrackerRows, WORD_TRACKER_SORTS } = compiled.exports;

const word = (id, de, en, level = "B1") => ({
  id,
  de,
  en,
  lookup: de,
  kind: "word",
  level,
  partKey: "test",
});
const ids = (rows) => rows.map((row) => row.id);
const sort = (rows, key, records = {}, common = rows, language = "de", now) =>
  sortWordTrackerRows(
    rows,
    key,
    (row) => records[row.id],
    new Map(common.map((row, index) => [row.id, index])),
    language,
    now
  );

const easy = word("easy", "Apfel", "pear", "A1");
const medium = word("medium", "Mitte", "middle", "B1");
const hard = word("hard", "Zebra", "aardvark", "C1");
const basic = [medium, hard, easy];
const common = [hard, easy, medium];

assert.deepEqual(ids(sort(basic, "common", {}, common)), ["hard", "easy", "medium"]);
assert.deepEqual(ids(sort(basic, "rare", {}, common)), ["medium", "easy", "hard"]);
assert.deepEqual(ids(sort(basic, "easy", {}, common)), ["easy", "medium", "hard"]);
assert.deepEqual(ids(sort(basic, "hard", {}, common)), ["hard", "medium", "easy"]);
assert.deepEqual(ids(sort(basic, "alpha", {}, common)), ["easy", "medium", "hard"]);
assert.deepEqual(ids(sort(basic, "alpha-desc", {}, common)), ["hard", "medium", "easy"]);
// Alphabetical sorting follows the language visible as the row's main word.
assert.deepEqual(ids(sort(basic, "alpha", {}, common, "en")), ["hard", "medium", "easy"]);

const now = Date.parse("2026-08-17T12:00:00.000Z");
const struggle = word("struggle", "ringen", "struggle");
const olderDue = word("older-due", "alt", "old");
const newerDue = word("newer-due", "neu", "new");
const fresh = word("fresh", "frisch", "fresh");
const known = word("known", "bekannt", "known");
const records = {
  struggle: { lastGrade: "struggle", updatedAt: "2026-08-15T12:00:00.000Z" },
  "older-due": { lastGrade: "know", successes: 2, dueAt: "2026-08-01T12:00:00.000Z" },
  "newer-due": { lastGrade: "know", successes: 2, dueAt: "2026-08-16T12:00:00.000Z" },
  known: { lastGrade: "know", successes: 3, dueAt: "2026-09-01T12:00:00.000Z" },
};
const attentionRows = [known, fresh, newerDue, struggle, olderDue];
assert.deepEqual(
  ids(sort(attentionRows, "status", records, attentionRows, "de", now)),
  ["struggle", "older-due", "newer-due", "fresh", "known"]
);

const permanent = word("permanent", "sicher", "certain");
const memoryRecords = {
  ...records,
  permanent: { lastGrade: "know", permanent: true, successes: 5 },
};
const memoryRows = [permanent, known, fresh, struggle];
assert.deepEqual(
  ids(sort(memoryRows, "weak", memoryRecords, memoryRows, "de", now)),
  ["struggle", "fresh", "known", "permanent"]
);
assert.deepEqual(
  ids(sort(memoryRows, "strong", memoryRecords, memoryRows, "de", now)),
  ["permanent", "known", "fresh", "struggle"]
);

const listened = word("listened", "gehört", "heard");
const answered = word("answered", "beantwortet", "answered");
const untouched = word("untouched", "unberührt", "untouched");
const recentRecords = {
  listened: { listenedAt: "2026-08-17T11:00:00.000Z" },
  answered: { updatedAt: "2026-08-01T00:00:00.000Z", lastAnswerAt: "2026-08-17T10:00:00.000Z" },
};
assert.deepEqual(
  ids(sort([untouched, answered, listened], "recent", recentRecords)),
  ["listened", "answered", "untouched"]
);

assert.equal(WORD_TRACKER_SORTS.length, 10, "Word Tracker sort menu changed unexpectedly");
for (const key of ["rare", "easy", "hard", "alpha-desc", "weak", "strong", "recent"]) {
  assert(WORD_TRACKER_SORTS.some((option) => option.key === key), `missing ${key} sort option`);
}

const tracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
assert(tracker.includes("WORD_TRACKER_SORTS.map"), "WordsTracker does not render the shared sort options");
assert(tracker.includes("sortWordTrackerRows("), "WordsTracker does not apply the tested sort helper");
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + fs.readFileSync(path.join(root, "src/lib/i18nDe.ts"), "utf8");
for (const { label } of WORD_TRACKER_SORTS) {
  assert(i18n.includes(`${JSON.stringify(label)}:`), `missing German translation for ${label}`);
}

console.log("word tracker sorting passed");
