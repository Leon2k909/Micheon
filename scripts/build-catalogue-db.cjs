#!/usr/bin/env node
/**
 * Generate the catalogue database from the authored packs.
 *
 * The packs stay the source of truth. They are hand-written content under
 * version control, every gate in the build reads them, and moving authoring
 * into a binary file would throw all of that away. This is a build artefact
 * derived from them, the same way the word-picture artwork is — if the two
 * ever disagree, the packs win and this gets regenerated.
 *
 * What it buys is the thing files cannot: an index. Searching the tracker
 * currently walks all 16,308 items in JavaScript on every query. SQLite's FTS5
 * answers the same question from an index, and the whole catalogue stops
 * having to be resident in the renderer to do it.
 *
 * No native module is involved. Electron 43 ships Node 24, which has
 * node:sqlite built in, FTS5 included — verified against the packaged app
 * rather than assumed.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const { DatabaseSync } = require("node:sqlite");

const root = path.resolve(__dirname, "..");
const OUT = path.join(root, "public", "catalogue.db");

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
      'export { buildWordCatalog, rankWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildCatalog } from "./src/session.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "catalogue-db-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("catalogue-db", module);
compiled.filename = path.join(root, ".catalogue-db.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;
global.window = undefined;

const resolved = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);
const parts = { ...resolved, ...M.buildBundledParts(), ...M.buildTatoebaParts() };

const sentences = M.buildCatalog(parts);
const words = M.rankWordCatalog(M.buildWordCatalog(parts));

fs.rmSync(OUT, { force: true });
const db = new DatabaseSync(OUT);

db.exec(`
  PRAGMA journal_mode = OFF;
  PRAGMA synchronous = OFF;

  CREATE TABLE item (
    id        TEXT PRIMARY KEY,
    kind      TEXT NOT NULL,          -- 'sentence' | 'word'
    de        TEXT NOT NULL,
    en        TEXT NOT NULL,
    part_key  TEXT,
    part_label TEXT,
    level     TEXT,
    lookup    TEXT,
    pos       TEXT,
    use_note  TEXT
  );

  -- The search index. 'external content' would save the duplication, but the
  -- rows are small and a standalone table keeps the query a single statement.
  CREATE VIRTUAL TABLE item_fts USING fts5(
    id UNINDEXED,
    de,
    en,
    extra,
    tokenize = "unicode61 remove_diacritics 2"
  );
`);

const insertItem = db.prepare(
  `INSERT OR REPLACE INTO item (id, kind, de, en, part_key, part_label, level, lookup, pos, use_note)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const insertFts = db.prepare(`INSERT INTO item_fts (id, de, en, extra) VALUES (?, ?, ?, ?)`);

const text = (value) => (value == null ? "" : String(value));

db.exec("BEGIN");
let count = 0;
for (const [kind, rows] of [["sentence", sentences], ["word", words]]) {
  for (const row of rows) {
    if (!row || !row.id || !row.de) continue;
    const extra = [row.use, row.partLabel, row.lookup, row.tierNote, row.when]
      .filter(Boolean)
      .map(text)
      .join(" ");
    insertItem.run(
      text(row.id), kind, text(row.de), text(row.en),
      text(row.partKey), text(row.partLabel), text(row.level),
      text(row.lookup), text(row.pos), text(row.use)
    );
    insertFts.run(text(row.id), text(row.de), text(row.en), extra);
    count += 1;
  }
}
db.exec("COMMIT");
db.exec("INSERT INTO item_fts(item_fts) VALUES('optimize')");
db.exec("VACUUM");
db.close();

const size = fs.statSync(OUT).size;
console.log(
  `catalogue.db: ${count.toLocaleString()} items `
  + `(${sentences.length.toLocaleString()} sentences, ${words.length.toLocaleString()} words), `
  + `${(size / 1024 / 1024).toFixed(1)} MB`
);
