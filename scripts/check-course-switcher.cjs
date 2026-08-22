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
      'export { COURSES, visibleLanguageRows } from "./src/lib/courseRegistry.ts";',
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
const { COURSES, visibleLanguageRows, PLANNED_LANGUAGES } = compiled.exports;

const languages = COURSES.filter((course) => course.kind === "language");
assert.ok(languages.length > 80, `only ${languages.length} languages listed; the catalogue has shrunk`);

const atRest = visibleLanguageRows(languages, { searching: false, showAll: false });
const expanded = visibleLanguageRows(languages, { searching: false, showAll: true });
const searched = visibleLanguageRows(languages, { searching: true, showAll: false });

// Short enough to draw without a wait.
assert.ok(atRest.length <= 8,
  `the picker still opens with ${atRest.length} language rows, which is the wait this exists to remove`);

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
