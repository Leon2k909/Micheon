#!/usr/bin/env node
/**
 * Every string the app looks up exists in every language the picker offers.
 *
 * The existing language checks each covered a slice and between them left a
 * gap wide enough to lose a course card in. check-german-interface scans two
 * shell files; the French and Polish checks only assert that their tables hold
 * the same KEYS as German. So a string outside those two files is invisible to
 * all three at once: German never asks for it, and French and Polish report
 * a hundred per cent because they match German exactly. Forty-nine strings sat
 * in that gap — including a course tagline, so a learner whose app was set to
 * German read "Read, listen, type and translate real Portuguese." under a
 * heading that said HAUPTKURS, with three checks calling the interface
 * complete.
 *
 * This asks the whole question in one place: walk src, collect every literal
 * handed to ui()/uiFmt()/uiOr(), and require a translation in each table.
 *
 * Spanish was exempt while its table covered only the app shell — a stated
 * scope rather than a silent gap, reported on every run so it could not drift
 * into looking finished. It is finished now, so the exemption is gone and it
 * is held to the same bar as the rest. That is the only honest end for an
 * exemption: meet it, or keep printing the shortfall. Quietly keeping one
 * after the reason expired is how a check stops meaning anything.
 *
 * Keys are compared by the string the app RESOLVES, never by the source text:
 * "— nothing" and "— nothing" are one key at runtime and two different
 * lines in a file, so a text search reports a present key as missing and
 * produces a duplicate when it is "fixed".
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

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
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", "assets"].includes(entry.name)) continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(entry.name) && !/^i18n/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const asked = new Map();
for (const file of walk(path.join(root, "src"))) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/\bui(?:Fmt|Or)?\(("(?:[^"\\]|\\.){2,}")/g)) {
    let key;
    try { key = JSON.parse(m[1]); } catch { continue; }
    if (!asked.has(key)) asked.set(key, path.relative(root, file));
  }
}

/**
 * Course names and taglines reach ui() as a variable, never as a literal
 * argument, so no scan of ui() call sites can see them. This is exactly where
 * the reported fault lived.
 */
const registry = fs.readFileSync(path.join(root, "src/lib/courseRegistry.ts"), "utf8");
for (const m of registry.matchAll(/\b(?:tagline|name)\s*:\s*("(?:[^"\\]|\\.)*")/g)) {
  let key;
  try { key = JSON.parse(m[1]); } catch { continue; }
  if (!asked.has(key)) asked.set(key, "src/lib/courseRegistry.ts");
}

assert.ok(asked.size > 1000,
  `only found ${asked.size} interface strings — the scan is looking in the wrong place`);

let failed = 0;
for (const [language, table] of Object.entries(TABLES)) {
  const missing = [...asked.entries()]
    .filter(([key]) => /[A-Za-z]{2}/.test(key))
    .filter(([key]) => !(key in table));
  if (missing.length) {
    failed += 1;
    console.error(`FAIL ${missing.length} string(s) have no ${language} and show English to a ${language}-language learner:`);
    missing.slice(0, 8).forEach(([key, file]) => console.error(`     ${file}  ${JSON.stringify(key.slice(0, 66))}`));
  } else {
    console.log(`ok   every one of the ${asked.size} interface strings has ${language}`);
  }
}


if (failed) {
  console.error("\nA string outside the two shell files is seen by no other language check — that is the gap this exists to close.");
  process.exit(1);
}
console.log(
  `check-interface-coverage: every one of the ${asked.size} strings the app looks up has `
    + `${Object.keys(TABLES).join(", ")}`
);
process.exit(0);
