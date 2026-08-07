#!/usr/bin/env node
/**
 * A German speaker gets a German app, everywhere.
 *
 * The whole new shell — sidebar, dashboard, search, notifications, shop,
 * social — was built without a single translation call, so someone running the
 * app in German mode read English on every screen the moment they left a
 * lesson. That is the bug this guards.
 *
 * Two things have to hold, and the second is the one that rots quietly:
 *   1. copy goes through ui() / uiFmt() rather than being written inline, and
 *   2. every key those calls use actually HAS a German translation. A missing
 *      key is silent — ui() returns the English string untouched — so without
 *      this check the interface degrades one new string at a time.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
// The settings page was outside this check and drifted back to English one
// string at a time: a German learner opened Profileinstellungen and read
// "Manage your name, learning preferences…" underneath it.
const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");

const translated = new Set([...i18n.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:/gm)].map((m) => m[1]));

// ── every key the shell asks for is translated ────────────────────────────
// Source may write a character as a \uXXXX escape; the key the app looks up at
// runtime is the character itself, so both sides are compared unescaped.
const unescapeKey = (raw) => raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
const asked = new Set([
  ...[...shell.matchAll(/\bui(?:Fmt)?\("([^"]+)"/g)].map((m) => unescapeKey(m[1])),
  ...[...settings.matchAll(/\bui(?:Fmt|Or)?\("([^"]+)"/g)].map((m) => unescapeKey(m[1])),
]);
// Table fields reach the screen through ui(...) at their render site, so their
// values are keys too.
const FIELDS = "label|title|subtitle|note|detail|desc|description|actionLabel|group|name|body";
for (const m of shell.matchAll(new RegExp(String.raw`\b(?:${FIELDS})\s*:\s*"([^"]{2,})"`, "g"))) {
  asked.add(m[1]);
}
// People's names are not copy.
const NOT_COPY = new Set(["Jonas Weber", "Sophie Klein", "Felix Braun", "Emilia Koch", "Michelle", "Leon"]);
const untranslated = [...asked].filter((k) => !NOT_COPY.has(k) && /[A-Za-z]{2}/.test(k) && !translated.has(k));
if (untranslated.length) {
  failures.push(
    `${untranslated.length} shell string(s) have no German and would show in English: ` +
    untranslated.slice(0, 6).map((k) => JSON.stringify(k)).join(", ")
  );
}

// ── the shell still routes its copy through ui() ──────────────────────────
if ((shell.match(/\bui\(/g) || []).length < 150) {
  failures.push("the shell has lost most of its translation calls");
}

// ── no bare English left in the markup ────────────────────────────────────
// A JSX text node holding two or more plain words is copy that never reaches
// the dictionary.
const bare = [];
for (const m of shell.matchAll(/>\s*([A-Z][a-z]+(?: [a-z]+){1,})\s*</g)) bare.push(m[1]);
if (bare.length) {
  failures.push(`markup still writes English inline: ${bare.slice(0, 4).map((t) => JSON.stringify(t)).join(", ")}`);
}

// ── translations are looked up at render, not at import ───────────────────
//
// A ui() call inside a module-level data table runs once, when the module is
// first imported, so the interface language would freeze at whatever it was
// when the app started and never follow a change.
const lines = shell.split("\n");
const START = /^(?:export\s+)?const\s+[A-Za-z0-9_]+\s*(?::[^=]*)?=\s*[[{]/;
let frozen = 0;
for (let i = 0; i < lines.length; i += 1) {
  if (!START.test(lines[i])) continue;
  let depth = 0;
  let j = i;
  for (; j < lines.length; j += 1) {
    for (const c of lines[j]) {
      if ("{[(".includes(c)) depth += 1;
      else if ("}])".includes(c)) depth -= 1;
    }
    if (depth <= 0 && j > i) break;
  }
  frozen += (lines.slice(i, j + 1).join("\n").match(/\bui\(/g) || []).length;
  i = j;
}
if (frozen > 0) {
  failures.push(`${frozen} translation call(s) sit in module data tables, so the language would freeze at app start`);
}

if (failures.length) {
  console.error("FAIL check-german-interface");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(
  `check-german-interface: all ${asked.size} shell strings have German, ` +
  "nothing is written inline, and every lookup happens at render rather than at import"
);
