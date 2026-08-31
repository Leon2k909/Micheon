#!/usr/bin/env node
/**
 * The course picker opens on what you can choose, not on the whole catalogue.
 *
 * It lists eighty-seven languages so that somebody arriving with a language in
 * mind gets a straight answer rather than three rows and a guess. Eighty-four
 * of them say Coming soon, and drawing all of them cost 123 ms of render on
 * every open — 12,324px of list inside a window that shows about six hundred.
 * Measured against the same click afterwards: 63 ms, and 1,328px.
 *
 * The catalogue is not gone, and that is the part worth protecting. Searching
 * reaches every row without pressing anything first, because finding your own
 * language is the entire reason the long list exists.
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
      'export { COURSES, sortCoursesByName, visibleLanguageRows } from "./src/lib/courseRegistry.ts";',
      'export { PLANNED_LANGUAGES } from "./src/lib/languageCatalogue.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "course-switcher-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const compiled = new Module("course-switcher-check", module);
compiled.filename = path.join(root, ".course-switcher-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { COURSES, sortCoursesByName, visibleLanguageRows, PLANNED_LANGUAGES } = compiled.exports;

const languages = COURSES.filter((course) => course.kind === "language");
assert.ok(languages.length > 80, `only ${languages.length} languages listed; the catalogue has shrunk`);

const atRest = visibleLanguageRows(languages, { searching: false, showAll: false });
const expanded = visibleLanguageRows(languages, { searching: false, showAll: true });
const searched = visibleLanguageRows(languages, { searching: true, showAll: false });

// Short enough to draw without a wait.
//
// Written as "no more than eight" while eight was more than there were
// courses, and the day the ninth shipped the two halves of that sentence
// stopped agreeing: every course you can choose has to be here from the
// start — the loop below says so — and a fixed ceiling eventually forbids
// exactly that. So the rule is said instead of counted. At rest the picker
// holds the courses that can be chosen and nothing else, and what it holds
// back is the eighty-odd rows of catalogue that are the reason this exists.
const chooseable = languages.filter((course) => course.available);
assert.strictEqual(atRest.length, chooseable.length,
  `the picker opens with ${atRest.length} rows against ${chooseable.length} courses that can be chosen`);
assert.ok(atRest.length * 4 < languages.length,
  `the picker still opens with ${atRest.length} of ${languages.length} rows, which is the wait this exists to remove`);

// Everything you can actually pick has to be there from the start — a picker
// that hides a course you own is worse than a slow one.
for (const course of languages.filter((c) => c.available)) {
  assert.ok(atRest.some((row) => row.id === course.id),
    `${course.name} can be chosen but is not shown until you press Show more`);
}
// And the two hand-written next-ups, so the list does not read as one language.
for (const id of ["spanish", "french"]) {
  assert.ok(atRest.some((row) => row.id === id), `${id} should be visible without pressing anything`);
}

// Nothing is lost: asking for more, or searching, reaches every row.
assert.strictEqual(expanded.length, languages.length, "Show more does not reveal the whole catalogue");
assert.strictEqual(searched.length, languages.length, "searching does not reach the held-back rows");
const plannedIds = new Set(PLANNED_LANGUAGES.map((language) => language.id));
for (const id of ["persian", "japanese", "swahili"].filter((candidate) => plannedIds.has(candidate))) {
  assert.ok(searched.some((row) => row.id === id), `searching cannot reach ${id}`);
}

// ── the component has to use the rule, and let it be undone ─────────────────
const view = fs.readFileSync(path.join(root, "src/components/course/CourseSwitcher.tsx"), "utf8");
assert.ok(/visibleLanguageRows\(languages, \{ searching, showAll: showAllLanguages \}\)/.test(view),
  "the picker no longer uses the shared rule, so what it draws and what is checked here can differ");
assert.ok(/Show \{n\} more languages/.test(view),
  "there is no way to see the rest of the catalogue");
assert.ok(/const searching = Boolean\(normalizedQuery\)/.test(view),
  "searching no longer overrides the hold-back, so typing a language would not find it");

// ── the lists read in alphabetical order ─────────────────────────
// Eighty-eight rows in the order somebody happened to type them is a list you
// cannot look a language up in. Sorted by the name ON the row, not the English
// name underneath it, or the order reads as shuffled in every interface
// language but one.
const GERMAN_NAMES = {
  German: "Deutsch",
  French: "Französisch",
  Italian: "Italienisch",
  Polish: "Polnisch",
  Portuguese: "Portugiesisch",
  Spanish: "Spanisch",
};
assert.deepStrictEqual(
  sortCoursesByName(
    Object.keys(GERMAN_NAMES).map((name) => ({ name })),
    (name) => GERMAN_NAMES[name] || name,
    "de-DE"
  ).map((row) => GERMAN_NAMES[row.name]),
  ["Deutsch", "Französisch", "Italienisch", "Polnisch", "Portugiesisch", "Spanisch"],
  "the picker sorts the English names underneath the rows, so a German reader sees the list shuffled"
);

// A plain string sort drops every accented name below Z, which is where a lot
// of this catalogue lands in German, French and Polish.
assert.deepStrictEqual(
  sortCoursesByName(
    [{ name: "Bengalisch" }, { name: "Ägyptisch" }, { name: "Amharisch" }],
    (name) => name,
    "de-DE"
  ).map((row) => row.name),
  ["Ägyptisch", "Amharisch", "Bengalisch"],
  "accented names sort as raw code points, so they all fall to the bottom of the picker"
);

// And the picker has to be the thing using it, in all three of its sections,
// so a sorted language list does not sit above an unsorted country list.
assert.ok(view.includes("const inNameOrder = "),
  "the picker no longer sorts its lists by name");
for (const section of ["shownLanguages", "programming", "citizenship"]) {
  assert.ok(view.includes("const " + section + " = inNameOrder"),
    section + " is drawn in catalogue order, so that section cannot be read alphabetically");
}
// By the name the row shows, which means asking i18n rather than reading
// course.name straight off the object.
assert.ok(view.includes("sortCoursesByName(list, ui, uiLocale())"),
  "the picker sorts by the English name, so the order reads as shuffled in German");
// English used to be pinned above the list. In a sorted list that is the one
// row out of order, so it is drawn from inside the list instead.
assert.ok(!view.includes("!(groupFavourites && englishStarred) && <EnglishCard"),
  "English is pinned above the language list again, so the section no longer starts in alphabetical order");

// ── and the gloss that started this ─────────────────────────────────────────
// "gripping" is a literary word: a learner meeting it as the English side of a
// card has to know a rarer English word than the German one being taught.
const packs = fs.readFileSync(path.join(root, "src/lib/expansionPacks.ts"), "utf8");
assert.ok(/fallbackEn: "exciting, gripping"/.test(packs),
  "the spannend card should lead with the everyday word");
assert.ok(!/Really gripping\./.test(packs), "a sentence card still leads with \"gripping\"");

console.log(
  `check-course-switcher: the picker opens with ${atRest.length} language rows of ${languages.length}, `
  + "every choosable course among them, and searching still reaches all of them"
);
