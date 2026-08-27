#!/usr/bin/env node
/**
 * Finished lessons can be put away, and putting them away is not losing them.
 *
 * A library that only grows is one you stop scrolling, so finished lessons go
 * on a shelf. Three things have to hold, and every one of them fails silently
 * — the screen looks perfectly correct either way:
 *
 *   1. THE WAY BACK. Hiding is a preference, not a delete. The control that
 *      hid them brings them back, it carries the count so a shelf holding
 *      forty lessons says so, and the preference survives a reload.
 *   2. THE EXCEPTION. A finished lesson whose words have started to fade comes
 *      back on its own. "Finished" is a claim about the past; what you are
 *      assumed to recall today is a different question, and they disagree the
 *      moment a review falls due. Hide those too and the fading signal is
 *      invisible exactly where it matters most — on the lessons finished long
 *      enough ago to have been forgotten.
 *   3. ONE CURVE. The lesson list's "fading" must be the tracker's own decay,
 *      not a second rule that happens to agree today. A word is either fading
 *      or it is not, and the two screens have to say the same thing about it.
 *
 * So this runs the real functions against real grade records rather than
 * reading the source and hoping.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/lib/lessonShelf.ts";\n'
      + 'export { recallDetail } from "./src/lib/memoryStrength.ts";',
    resolveDir: root,
    sourcefile: "lesson-shelf-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("lesson-shelf", module);
compiled.filename = path.join(root, ".lesson-shelf.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

/**
 * A record the way lessons actually write one.
 *
 * dueAt is an ISO string, not a number of milliseconds — writing the field the
 * app does not use makes every record look freshly scheduled, and a check
 * built on that would pass while counting nothing.
 */
const known = ({ overdueDays = 0, successes = 3, intervalDays = 10 } = {}) => ({
  lastGrade: "know",
  successes,
  intervalDays,
  updatedAt: new Date(now - (overdueDays + intervalDays) * DAY).toISOString(),
  dueAt: new Date(now - overdueDays * DAY).toISOString(),
});

// ── counting a lesson ───────────────────────────────────────────────────────
const phrases = [{ id: "p1" }, { id: "p2" }, { id: "p3" }, {}];
const grades = {
  p1: known({ overdueDays: 0 }),          // learned, still inside its interval
  p2: known({ overdueDays: 400 }),        // learned long ago, well past due
  p3: { lastGrade: "struggle" },          // seen, not known
  // the fourth has no id of its own and falls back to the positional key
  "packA-phrase-3": known({ overdueDays: 90 }),
};

const progress = M.lessonProgress("packA", phrases, grades, now);
assert.strictEqual(progress.total, 4, "a lesson lost or gained items while being counted");
assert.strictEqual(progress.done, 3,
  "the learned count is wrong — a struggling item counted as known, or the positional id fallback broke and old progress stopped counting");
assert.strictEqual(progress.fading, 2,
  "the fading count is wrong: p2 (400 days overdue) and the positional item (90 days) are both past due");

// ── and it is the SAME curve the tracker draws ──────────────────────────────
// Not "a number that looks similar": the same function, asked about the same
// records. If the tracker's curve moves, this moves with it.
for (const [id, record] of Object.entries(grades)) {
  if (record.lastGrade !== "know") continue;
  const trackerSaysFading = M.recallDetail(record, now).fading;
  const countedHere = M.lessonProgress("packA", [{ id }], { [id]: record }, now).fading === 1;
  assert.strictEqual(countedHere, trackerSaysFading,
    `the lesson list and the tracker disagree about whether "${id}" is fading`);
}

// A fresh, never-overdue lesson has nothing fading.
assert.strictEqual(
  M.lessonProgress("packB", [{ id: "q1" }], { q1: known({ overdueDays: 0 }) }, now).fading, 0,
  "an item inside its review interval was counted as fading"
);

// ── what the shelf hides ────────────────────────────────────────────────────
const unstarted = { done: 0, total: 10, fading: 0 };
const halfway = { done: 4, total: 10, fading: 0 };
const finished = { done: 10, total: 10, fading: 0 };
const finishedFading = { done: 10, total: 10, fading: 3 };
const empty = { done: 0, total: 0, fading: 0 };

assert.ok(M.isFinishedLesson(finished), "a fully learned lesson is not being recognised as finished");
assert.ok(!M.isFinishedLesson(halfway), "a half-done lesson counts as finished");
assert.ok(!M.isFinishedLesson(empty),
  "an empty lesson counts as finished, so a pack with no phrases would be shelved as done work");

const shelfOff = { hideFinished: false, askedForFinished: false };
const shelfOn = { hideFinished: true, askedForFinished: false };

for (const [name, progressValue] of Object.entries({ unstarted, halfway, finished, finishedFading, empty })) {
  assert.ok(M.passesFinishedShelf(progressValue, shelfOff),
    `${name} was hidden while the shelf was off — the shelf is not the only thing hiding lessons`);
}
assert.ok(M.passesFinishedShelf(unstarted, shelfOn), "an unstarted lesson was put on the shelf");
assert.ok(M.passesFinishedShelf(halfway, shelfOn), "a half-done lesson was put on the shelf");
assert.ok(!M.passesFinishedShelf(finished, shelfOn), "the shelf is on and a finished lesson is still listed");

// The one that matters: finished, but fading, so it comes back.
assert.ok(M.passesFinishedShelf(finishedFading, shelfOn),
  "a finished lesson whose words have started to fade was hidden, so the review it needs is "
  + "invisible on exactly the lessons most likely to need one");

// Asking for finished lessons outright beats the standing preference.
assert.ok(M.passesFinishedShelf(finished, { hideFinished: true, askedForFinished: true }),
  "the Finished filter returns nothing while the shelf is on, so the two controls fight");

// ── the button can say what it is holding ───────────────────────────────────
const counts = M.shelfCounts([unstarted, halfway, finished, finished, finishedFading, empty]);
assert.strictEqual(counts.finished, 3, "the shelf miscounts what it holds, so the button's number is wrong");
assert.strictEqual(counts.returned, 1, "the shelf does not know how many it handed back");

// ── the preference survives a reload, and can always be turned off ──────────
const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
};
assert.strictEqual(M.getHideFinishedLessons(), false, "the shelf starts switched on, hiding work nobody asked to hide");
M.setHideFinishedLessons(true);
assert.strictEqual(M.getHideFinishedLessons(), true, "the choice does not survive a reload");
M.setHideFinishedLessons(false);
assert.strictEqual(M.getHideFinishedLessons(), false, "the shelf cannot be turned off — the lessons are gone for good");

// Storage refusing to answer must not hide anything.
global.window = { localStorage: { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } } };
assert.strictEqual(M.getHideFinishedLessons(), false,
  "with storage blocked the shelf defaults to hiding lessons behind a preference that cannot be read back or turned off");
assert.doesNotThrow(() => M.setHideFinishedLessons(true), "blocked storage breaks the button rather than the preference");

// ── the screen actually uses all of it ──────────────────────────────────────
const view = fs.readFileSync(path.join(root, "src/components/lab/LearnView.tsx"), "utf8");
// The whole statement, not just the name: a call left in place but guarded
// off still contains "passesFinishedShelf(" and would satisfy a looser test
// while the shelf did nothing.
assert.ok(view.includes("    if (!passesFinishedShelf("),
  "the lesson list does not consult the shelf, so the button changes nothing");
assert.ok(view.includes("lessonProgress(key, part.phrases ?? [], grades)"),
  "the lesson list counts progress itself instead of using the counter the tracker shares, so the two will drift");
assert.ok(/askedForFinished: progressFilter === "done"/.test(view),
  "the Finished filter no longer overrides the shelf");
assert.ok(view.includes('uiFmt("{count} fading"'),
  "a lesson never shows how much of it has faded");
assert.ok(/Show finished \({count}\)/.test(view) && /Hide finished \({count}\)/.test(view),
  "the shelf button does not carry its count, so it can hide forty lessons without saying so");
assert.ok(view.includes("setHideFinished(setHideFinishedLessons(false));"),
  "clearing the filters leaves the shelf on, so a cleared list stays short for no visible reason");

// Both labels and both explanations have to exist in German and in French, or
// the button reads English on a German screen.
const de = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
const fr = fs.readFileSync(path.join(root, "src/lib/i18nFr.ts"), "utf8");
for (const key of ["Hide finished ({count})", "Show finished ({count})", "{count} fading"]) {
  assert.ok(de.includes(`"${key}":`), `"${key}" has no German`);
  assert.ok(fr.includes(`"${key}":`), `"${key}" has no French`);
}

// ── and the screen really draws it ──────────────────────────────────────────
/**
 * Rendered rather than read. Everything above proves the rules; this proves
 * the list obeys them, which is the half that source-matching cannot see — a
 * correct predicate wired to nothing looks exactly like a correct screen.
 */
{
  const rendered = esbuild.buildSync({
    stdin: {
      contents: 'export { LearnView } from "./src/components/lab/LearnView.tsx";\n'
        + 'export { saveGradeStore } from "./src/lib/activity.ts";\n'
        + 'export { setHideFinishedLessons } from "./src/lib/lessonShelf.ts";',
      resolveDir: root,
      sourcefile: "render-shelf-entry.tsx",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20", jsx: "automatic",
    write: false, logLevel: "silent",
    external: ["react", "react-dom", "react/jsx-runtime"],
    loader: { ".css": "empty", ".png": "empty", ".svg": "empty", ".webp": "empty", ".json": "json" },
  });

  const cell = new Map();
  const storage = {
    getItem: (key) => cell.get(key) ?? null,
    setItem: (key, value) => { cell.set(key, String(value)); },
    removeItem: (key) => { cell.delete(key); },
    clear: () => cell.clear(),
  };
  global.window = {
    localStorage: storage,
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    location: { search: "", href: "http://localhost/" },
    navigator: { language: "en-GB" },
  };
  global.localStorage = storage;
  global.document = {
    documentElement: { dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, contains: () => false } },
    addEventListener() {}, removeEventListener() {},
  };
  global.navigator = { language: "en-GB" };

  const view = new Module("render-shelf", module);
  view.filename = path.join(root, ".render-shelf.cjs");
  view.paths = Module._nodeModulePaths(root);
  view._compile(rendered.outputFiles[0].text, view.filename);
  const { LearnView, saveGradeStore, setHideFinishedLessons } = view.exports;

  const React = require(path.join(root, "node_modules/react"));
  const { renderToStaticMarkup } = require(path.join(root, "node_modules/react-dom/server"));

  const lesson = (theme, ids) => ({
    label: theme, level: "A1", theme, description: `${theme} description`, focus: "",
    phrases: ids.map((id) => ({ id, de: `${id} de`, en: `${id} en` })),
  });
  const apiParts = {
    packOpen: lesson("Still going", ["o1", "o2"]),
    packDone: lesson("All finished", ["d1", "d2"]),
    packFaded: lesson("Finished but faded", ["f1", "f2"]),
  };
  // Due in the future, not due "now": the component reads Date.now() itself,
  // and an item due at exactly this instant is a hair past due by the time it
  // renders, which would make every freshly-learned lesson claim to be fading.
  const fresh = () => known({ overdueDays: -30 });
  saveGradeStore({
    o1: fresh(),
    d1: fresh(), d2: fresh(),
    f1: fresh(), f2: known({ overdueDays: 400 }),
  }, null);

  const draw = () => renderToStaticMarkup(React.createElement(LearnView, { apiParts, onOpenLesson() {} }));

  setHideFinishedLessons(false);
  const showingAll = draw();
  for (const theme of ["Still going", "All finished", "Finished but faded"]) {
    assert.ok(showingAll.includes(theme), `"${theme}" is missing from the list before anything is hidden`);
  }
  assert.ok(showingAll.includes("Hide finished (2)"),
    "the shelf button is missing, or does not say how many finished lessons it would put away");
  assert.ok(showingAll.includes("1 fading"),
    "a lesson with a word past its review date does not say so on the card");
  assert.ok(!showingAll.includes("0 fading"),
    "a lesson with nothing overdue is claiming items are fading");

  setHideFinishedLessons(true);
  const shelved = draw();
  assert.ok(shelved.includes("Still going"), "an unfinished lesson was put away with the finished ones");
  assert.ok(!shelved.includes("All finished"), "the shelf is on and a finished lesson is still in the list");
  assert.ok(shelved.includes("Finished but faded"),
    "a finished lesson whose words have faded was put away too, hiding the review it needs");
  assert.ok(shelved.includes("Show finished (2)"),
    "with lessons on the shelf there is no labelled way to bring them back");

  setHideFinishedLessons(false);
}

console.log(
  "check-lesson-shelf: finished lessons can be put away and brought back, a fading one comes back on "
  + "its own, and the list's decay is the tracker's own curve"
);
process.exit(0);
