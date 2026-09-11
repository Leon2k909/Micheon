#!/usr/bin/env node
/**
 * Every lesson in the list is called by its own name, in every language.
 *
 * LearnView draws `uiOr(part.theme, "Konversationsmodul")` for each row and
 * `uiOr(part.description, "Praktische Sätze und Wörter …")` under it. uiOr
 * does NOT fall back to the value it was handed — it returns
 * `table[value] ?? table[fallback] ?? fallback`. So a theme with no entry is
 * not shown in English and does not look broken: the row is titled
 * Konversationsmodul, and so is every other row.
 *
 * That is how it stood. 357 names lived only in the Portuguese table and 130
 * lived in no table at all, so six of the seven interface languages drew the
 * same two words over every lesson in the catalogue, through a green build.
 *
 * check-interface-coverage cannot see this class on its own. It collects what
 * the app asks for from ui() literals, from card fields, and from keys the
 * tables already hold — and a value NO table holds is in none of those. Only
 * the assembled catalogue knows it exists, which is why this check assembles
 * the catalogue rather than reading source text.
 *
 * BOTH FIELDS FAIL THE BUILD. The descriptions were counted out loud while
 * they were being written — the shortfall printed on every run so the number
 * could not quietly be forgotten — and now that it has reached zero the second
 * half asserts like the first. Nothing in here is exempt any more.
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
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";',
      'export { orderParts } from "./src/lib/curriculum.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "lesson-names-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("lesson-names", module);
compiled.filename = path.join(root, ".lesson-names.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

function readTable(file, marker) {
  const src = fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
  const start = src.indexOf("{", src.indexOf(marker));
  const end = src.indexOf("\n};", start);
  assert.ok(start >= 0 && end > start, `could not read the table in ${file}`);
  return Function("return " + src.slice(start, end + 2))();
}

const TABLES = {
  German: readTable("src/lib/i18nDe.ts", "export const DE"),
  French: readTable("src/lib/i18nFr.ts", "export const FR"),
  Polish: readTable("src/lib/i18nPl.ts", "export const PL"),
  Spanish: readTable("src/lib/i18nEs.ts", "export const ES"),
  Italian: readTable("src/lib/i18nIt.ts", "export const IT"),
  Portuguese: readTable("src/lib/i18nPt.ts", "export const PT"),
  Russian: readTable("src/lib/i18nRu.ts", "export const RU"),
};

/**
 * The catalogue exactly as the lesson list builds it.
 *
 * A pack that fails to resolve is skipped rather than thrown, matching the
 * app's own offline fallback — the content checks report that pack, and one
 * broken pack must not turn this into a report about itself.
 */
const base = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  try { base[key] = M.buildApiPartFromResolved(blueprint, {}); } catch { /* reported by the content checks */ }
}
const parts = M.orderParts(
  M.filterPartsForLearningDirection({ ...base, ...M.buildBundledParts("learn-de") }, "learn-de")
);

const themes = new Map();
const descriptions = new Map();
for (const [key, part] of Object.entries(parts)) {
  const theme = String(part.theme || "").trim();
  const description = String(part.description || "").trim();
  if (theme && !themes.has(theme)) themes.set(theme, key);
  if (description && !descriptions.has(description)) descriptions.set(description, key);
}

assert.ok(themes.size > 400,
  `only found ${themes.size} lesson names — the catalogue did not assemble, so this check proves nothing`);

assert.ok(descriptions.size > 400,
  `only found ${descriptions.size} lesson descriptions — the catalogue did not assemble, so this check proves nothing`);

const FIELDS = [
  { name: "lesson name", values: themes, reads: "Konversationsmodul" },
  { name: "lesson description", values: descriptions, reads: "the conversation-module sentence" },
];

let failed = 0;
for (const field of FIELDS) {
  for (const [language, table] of Object.entries(TABLES)) {
    const missing = [...field.values.entries()].filter(([text]) => !(text in table));
    if (!missing.length) continue;
    failed += 1;
    console.error(
      `FAIL ${missing.length} ${field.name}(s) have no ${language}, so those rows all read ${field.reads}:`
    );
    missing.slice(0, 6).forEach(([text, key]) => console.error(`     ${key}  ${JSON.stringify(text.slice(0, 62))}`));
  }
}

if (failed) {
  console.error(
    "\nuiOr returns table[value] ?? table[fallback] ?? fallback, so a value with no entry is not shown in English —\n"
    + "it is replaced by the fallback, and every lesson without one reads the same."
  );
  process.exit(1);
}

console.log(
  `check-lesson-names: all ${themes.size} lesson names and all ${descriptions.size} descriptions have `
  + "German, French, Polish, Spanish, Italian, Portuguese, Russian"
);
