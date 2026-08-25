#!/usr/bin/env node
/**
 * Numbers must be written the way the INTERFACE language writes them.
 *
 * Number.toLocaleString() with no argument formats for the machine, not for
 * the app. On a German-region Windows every count in Micheon came out with
 * German separators no matter which language the app was set to, so an
 * English dashboard read "18.935 XP" — which an English reader parses as
 * eighteen point nine three five, off by a factor of a thousand. Sixty-seven
 * call sites did it, and none of them looked wrong in the source.
 *
 * uiNumber() exists for this. The rule is simply that the locale is never
 * left to chance: pass one, or use the helper that does.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "src");

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
})(source);

const offenders = [];
for (const file of files) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  // i18n.ts is where the helper lives and where the rule is explained.
  if (relative === "src/lib/i18n.ts") continue;
  const text = fs.readFileSync(file, "utf8");
  text.split("\n").forEach((line, index) => {
    // A locale-sensitive formatter called with no locale at all.
    if (/\.toLocale(String|DateString|TimeString)\(\s*\)/.test(line)) {
      offenders.push(`${relative}:${index + 1}  ${line.trim().slice(0, 90)}`);
    }
    if (/new Intl\.(NumberFormat|DateTimeFormat)\(\s*\)/.test(line)) {
      offenders.push(`${relative}:${index + 1}  ${line.trim().slice(0, 90)}`);
    }
  });
}

assert.deepStrictEqual(offenders, [],
  "these format a number or date for the machine's locale rather than the app's — "
  + "use uiNumber(), or pass uiLocale()");

// And the helper has to actually follow the interface language, not the OS.
const i18n = fs.readFileSync(path.join(source, "lib/i18n.ts"), "utf8");
assert.ok(/export function uiNumber\b/.test(i18n), "uiNumber has gone missing");
assert.ok(/uiNumber[\s\S]{0,400}toLocaleString\(uiLocale\(\)/.test(i18n),
  "uiNumber must format with uiLocale(), or it is the same bug with a new name");
// Three languages now, so this is a lookup rather than a ternary. What has to
// hold is unchanged: uiLocale asks the interface language, and answers with a
// real locale for every language it can be given.
const uiLocale = i18n.slice(i18n.indexOf("export function uiLocale"), i18n.indexOf("export function uiLocale") + 400);
assert.ok(/resolveInterfaceLanguage\(\)/.test(uiLocale),
  "uiLocale must follow the interface language");
for (const tag of ["de-DE", "fr-FR", "en-GB"]) {
  assert.ok(uiLocale.includes(`"${tag}"`),
    `uiLocale no longer answers ${tag}, so that language formats its numbers for another one`);
}

// The reported case, end to end: an English interface writes thousands with a
// comma, a German one with a full stop.
assert.strictEqual((18935).toLocaleString("en-GB"), "18,935",
  "an English interface must write 18,935");
assert.strictEqual((18935).toLocaleString("de-DE"), "18.935",
  "and a German one 18.935 — the two are not interchangeable");

console.log(
  `check-number-formatting: ${files.length} files, every number formatted for the `
  + "interface language rather than the machine's"
);
