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
 *
 * Dates go through uiDate() for the same reason, and for one language even
 * the right locale is not enough. Electron's ICU has no Albanian at all — it
 * carries only the languages Chrome is translated into — so sq-AL, passed
 * faithfully, still came out as the machine's month names and the machine's
 * separators. The end of this check takes Albanian away from Node the way
 * Electron lacks it, and the app has to write Albanian regardless.
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
const bypasses = [];
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
    // uiLocale() handed straight to a formatter: the right tag, and still the
    // machine's month names for Albanian, because only the helpers know the
    // runtime cannot write it.
    if (/\.toLocale(String|DateString|TimeString)\(\s*uiLocale\(\)/.test(line)
      || /new Intl\.(NumberFormat|DateTimeFormat)\(\s*uiLocale\(\)/.test(line)) {
      bypasses.push(`${relative}:${index + 1}  ${line.trim().slice(0, 90)}`);
    }
  });
}

assert.deepStrictEqual(offenders, [],
  "these format a number or date for the machine's locale rather than the app's — "
  + "use uiNumber() or uiDate()");
assert.deepStrictEqual(bypasses, [],
  "these pass uiLocale() to a formatter themselves, which writes an Albanian interface in the "
  + "machine's language — use uiNumber() or uiDate()");

// And the helper has to actually follow the interface language, not the OS.
const i18n = fs.readFileSync(path.join(source, "lib/i18n.ts"), "utf8");
assert.ok(/export function uiNumber\b/.test(i18n), "uiNumber has gone missing");
assert.ok(/uiNumber[\s\S]{0,400}toLocaleString\(uiLocale\(\)/.test(i18n),
  "uiNumber must format with uiLocale(), or it is the same bug with a new name");
// Eight languages now, so this is a table rather than a ternary or a chain.
// What has to hold is unchanged: uiLocale asks the interface language, and
// answers with a real locale for every language it can be given.
const uiLocale = i18n.slice(i18n.indexOf("export function uiLocale"), i18n.indexOf("export function uiLocale") + 200);
assert.ok(/resolveInterfaceLanguage\(\)/.test(uiLocale),
  "uiLocale must follow the interface language");

// EVERY language, not a list written out here that goes stale the next time
// one is added. Three of them — Spanish, Italian, Portuguese — shipped as
// complete interface languages while this chain still fell through to English,
// so the app formatted their dates and spoke to them in the wrong language for
// months with nothing failing. The table is typed on ResolvedInterfaceLanguage,
// which makes a missing row a type error; this checks the rows are real tags
// rather than the same language wearing eight names.
const table = i18n.slice(i18n.indexOf("const UI_LOCALES"), i18n.indexOf("export function uiLocale"));
assert.ok(table.includes("Record<ResolvedInterfaceLanguage,"),
  "UI_LOCALES must be typed on ResolvedInterfaceLanguage, or a new language can be forgotten in silence");
const languages = /ResolvedInterfaceLanguage = ([^;]+);/
  .exec(fs.readFileSync(path.join(source, "lib/interfaceLanguage.ts"), "utf8"))[1]
  .match(/"([a-z]{2})"/g)
  .map((quoted) => quoted.slice(1, -1));
for (const language of languages) {
  const row = new RegExp(`\\b${language}: \\{ format: "([a-z]{2}-[A-Z]{2})", speech: "([a-z]{2}-[A-Z]{2})" \\}`).exec(table);
  assert.ok(row, `UI_LOCALES has no row for "${language}", so that language formats its numbers for another one`);
  assert.ok(row[1].startsWith(`${language}-`) || language === "en",
    `UI_LOCALES gives "${language}" the locale ${row[1]}, which belongs to another language`);
  assert.ok(row[2].startsWith(`${language}-`) || language === "en",
    `UI_LOCALES gives "${language}" the voice ${row[2]}, so the app would speak to that reader in another language`);
}

// The reported case, end to end: an English interface writes thousands with a
// comma, a German one with a full stop.
assert.strictEqual((18935).toLocaleString("en-GB"), "18,935",
  "an English interface must write 18,935");
assert.strictEqual((18935).toLocaleString("de-DE"), "18.935",
  "and a German one 18.935 — the two are not interchangeable");

// Albanian, end to end, in a runtime without Albanian. Node has the data, so
// it is taken away here the way Electron lacks it: sq is dropped from every
// locale a formatter is asked for, and a request left empty falls back to
// en-US, as Electron does on an Albanian Windows. The app has to write
// Albanian all the same, in CLDR's spelling (CLDR 48).
const esbuild = require("esbuild");
const Module = require("module");

const ALBANIAN = /^sq(-|$)/i;
const withoutAlbanian = (locales) => {
  const kept = (locales === undefined ? [] : [].concat(locales)).filter((tag) => !ALBANIAN.test(String(tag)));
  return kept.length ? kept : "en-US";
};
for (const name of ["NumberFormat", "DateTimeFormat"]) {
  const Real = Intl[name];
  const Lacking = function (locales, options) { return new Real(withoutAlbanian(locales), options); };
  Lacking.prototype = Real.prototype;
  Lacking.supportedLocalesOf = (locales, options) => Real.supportedLocalesOf(locales, options)
    .filter((tag) => !ALBANIAN.test(tag));
  Intl[name] = Lacking;
}
const realNumber = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function (locales, options) {
  return realNumber.call(this, withoutAlbanian(locales), options);
};
for (const method of ["toLocaleString", "toLocaleDateString", "toLocaleTimeString"]) {
  const real = Date.prototype[method];
  Date.prototype[method] = function (locales, options) { return real.call(this, withoutAlbanian(locales), options); };
}

const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
};
global.localStorage = global.window.localStorage;
global.navigator = { language: "en-GB", languages: ["en-GB"] };
global.document = { documentElement: { lang: "en" }, createElement: () => ({}) };
global.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; Object.assign(this, init); } };

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { uiDate, uiNumber } from "./src/lib/i18n.ts";',
      'export { setInterfaceLanguage } from "./src/lib/interfaceLanguage.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "number-formatting-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("number-formatting-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "number-formatting-entry.cjs"));
const { uiDate, uiNumber, setInterfaceLanguage } = loaded.exports;

setInterfaceLanguage("sq");
const albanian = (written, wanted, what) => assert.strictEqual(written, wanted,
  `an Albanian interface wrote ${what} as ${JSON.stringify(written)}, not ${JSON.stringify(wanted)} — `
  + "the runtime has no Albanian, so the app has to write it");
const space = " ";
albanian(uiNumber(18935), `18${space}935`, "a five-digit count");
albanian(uiNumber(1234), "1234", "a four-digit count, which Albanian leaves ungrouped");
albanian(uiNumber(1234567.5), `1${space}234${space}567,5`, "a decimal");
albanian(uiNumber(0.42, { style: "percent" }), "42%", "a percentage");
const monday = new Date(2026, 8, 7, 14, 5);
albanian(uiDate(monday, { day: "numeric", month: "short" }), "7 sht", "a day and a month");
albanian(uiDate(monday, { weekday: "short" }), "hën", "a weekday");
albanian(uiDate(monday, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  "e hënë, 7 shtator 2026", "a whole date");
albanian(uiDate(monday, { day: "numeric", month: "numeric", year: "numeric" }), "7.9.2026", "a date in figures");
albanian(uiDate(monday, { hour: "2-digit", minute: "2-digit" }), "02:05 m.d.", "an afternoon time");
albanian(uiDate(new Date(2026, 8, 7, 9, 7), { hour: "2-digit", minute: "2-digit" }), "09:07 p.d.", "a morning time");
albanian(uiDate(monday, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), "14:05", "a 24-hour time");
const eachMonth = (month) => Array.from({ length: 12 }, (_, m) => uiDate(new Date(2026, m, 1), { month })).join(" ");
albanian(eachMonth("short"), "jan shk mar pri maj qer korr gush sht tet nën dhj", "the short months");
albanian(eachMonth("long"), "janar shkurt mars prill maj qershor korrik gusht shtator tetor nëntor dhjetor", "the months");
const eachDay = (weekday) => Array.from({ length: 7 }, (_, d) => uiDate(new Date(2026, 8, 6 + d), { weekday })).join(", ");
albanian(eachDay("short"), "die, hën, mar, mër, enj, pre, sht", "the short weekdays");
albanian(eachDay("long"), "e diel, e hënë, e martë, e mërkurë, e enjte, e premte, e shtunë", "the weekdays");

// A language the runtime does have goes to Intl untouched.
setInterfaceLanguage("de");
assert.strictEqual(uiDate(monday, { day: "numeric", month: "short" }),
  new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short" }).format(monday),
  "a German interface must get the runtime's own German date");
assert.strictEqual(uiNumber(18935), "18.935", "and the runtime's own German number");

console.log(
  `check-number-formatting: ${files.length} files, every number and date formatted for the `
  + "interface language rather than the machine's, Albanian included"
);
// Changing the language schedules a profile sync, whose timer would keep
// this process alive and the build waiting on it.
process.exit(0);
