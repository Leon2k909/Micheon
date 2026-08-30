#!/usr/bin/env node
/**
 * Spanish covers the app SHELL, and the shell cannot drift out from under it.
 *
 * Adding a language to the picker is the easy half. The half that rots is the
 * table: somebody writes a new settings heading, the lookup misses, and the
 * app draws English inside an otherwise Spanish page with nothing reporting a
 * problem. So the same rule German is held to applies here — every string the
 * shell asks for has a Spanish entry, or the build fails naming the strings.
 *
 * THE SHELL IS NO LONGER THE LIMIT. This check was written while Spanish
 * covered the shell alone, and said so: French and Polish carried the strings
 * inside lessons and the trackers, Spanish did not, and those fell back to
 * English. Asserting the wider coverage then would have failed on the day it
 * shipped and been loosened, which is how a check dies.
 *
 * Spanish is complete now, and check-interface-coverage holds every language
 * to the whole app. What is left here is the part that check cannot do: the
 * shell strings it finds by field name and by map lookup rather than by a
 * ui() literal, the Spanish-specific ¿ and ¡, and the picker wiring. The
 * narrow scope stayed; the reason for it did not.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

const shell = read("src/prototype/NewUiPrototype.tsx");
const settings = read("src/Gamification.tsx");
const table = read("src/lib/i18nEs.ts");
const picker = read("src/components/AppLanguagePicker.tsx");
const languages = read("src/lib/interfaceLanguage.ts");
const i18n = read("src/lib/i18n.ts");

let failures = 0;
const check = (name, condition, detail) => {
  if (condition) { console.log(`ok   ${name}`); return; }
  failures += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const translated = new Set([...table.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:/gm)].map((m) => m[1]));
const unescapeKey = (raw) => raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
const asked = new Set([
  ...[...shell.matchAll(/\bui(?:Fmt)?\("([^"]+)"/g)].map((m) => unescapeKey(m[1])),
  ...[...settings.matchAll(/\bui(?:Fmt|Or)?\("([^"]+)"/g)].map((m) => unescapeKey(m[1])),
]);
const FIELDS = "label|title|subtitle|note|detail|desc|description|actionLabel|group|name|body";
for (const m of shell.matchAll(new RegExp(String.raw`\b(?:${FIELDS})\s*:\s*"([^"]{2,})"`, "g"))) {
  asked.add(m[1]);
}
/**
 * Copy that reaches ui() as a value of a map, indexed by something that is
 * not a field name.
 *
 * The field-name rule above finds `label:` and `title:` and so on. It cannot
 * find HEADER_SUBTITLES, whose keys are screen names and whose values are the
 * line under the greeting — so three strings on the most-seen screen in the
 * app were invisible to every language check, and German, French and Polish
 * carry them only because somebody happened to read them on screen. Noticing
 * is not a way of finding things. Any map that is indexed inside a ui() call
 * has its string values treated as keys.
 */
for (const [, ident] of shell.matchAll(/\bui\((\w+)\[/g)) {
  const declared = shell.indexOf(`const ${ident}`);
  if (declared < 0) continue;
  const body = shell.slice(declared, shell.indexOf("\n};", declared));
  for (const [, value] of body.matchAll(/:\s*"([^"]{2,})"/g)) asked.add(value);
}
// ...and the fallback beside it, which is the value for every unlisted key.
for (const [, fallback] of shell.matchAll(/\bui\(\w+\[[^\]]*\]\s*\?\?\s*"([^"]{2,})"\)/g)) {
  asked.add(fallback);
}

const NOT_COPY = new Set(["Jonas Weber", "Sophie Klein", "Felix Braun", "Emilia Koch", "Michelle", "Leon"]);
const missing = [...asked].filter((k) => !NOT_COPY.has(k) && /[A-Za-z]{2}/.test(k) && !translated.has(k));
check(`every shell string has Spanish (${asked.size} asked)`, missing.length === 0,
  missing.length ? `${missing.length} missing: ${missing.slice(0, 6).map((k) => JSON.stringify(k)).join(", ")}` : "");

// A {slot} dropped in translation renders the literal word to the learner.
const slotMismatch = [];
for (const [, key, value] of table.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/gm)) {
  const slots = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  if (slots(key) !== slots(value)) slotMismatch.push(key);
}
check("every {slot} survives translation", slotMismatch.length === 0,
  slotMismatch.slice(0, 4).map((k) => JSON.stringify(k)).join(", "));

/**
 * Spanish opens a question and an exclamation as well as closing it. A line
 * that closes without opening is a translation done as if it were English.
 *
 * Text inside « » is exempt, because a language tip quotes the language it is
 * about: the Polish tip carries «Czy mówi Pan po angielsku?» and the French
 * one «Tu viens ?». Putting ¿ in front of either would be a Spanish mark
 * stamped on somebody else's sentence — the check would be enforcing a real
 * error rather than catching one.
 *
 * The blind spot that opens up is a genuinely Spanish question written inside
 * quotes, which this would now skip. It is counted and printed rather than
 * waved through, so the exemption stays visible instead of becoming a place
 * where things quietly stop being checked.
 */
const unopened = [];
let quotedSkipped = 0;
for (const [, , value] of table.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/gm)) {
  const full = String(value);
  for (const [, quoted] of full.matchAll(/«([^»]*)»/g)) if (/[?!]/.test(quoted)) quotedSkipped += 1;
  const text = full.replace(/«[^»]*»/g, "");
  if ((text.includes("?") && !text.includes("¿")) || (text.includes("!") && !text.includes("¡"))) {
    unopened.push(full);
  }
}
check(`questions and exclamations are opened as well as closed (${quotedSkipped} quoted foreign example(s) exempt)`,
  unopened.length === 0,
  unopened.slice(0, 3).map((t) => JSON.stringify(t)).join(", "));

check("the app can actually load the table",
  i18n.includes('es: () => import("@/lib/i18nEs").then((m) => m.ES)'),
  "i18n.ts has no loader for Spanish, so choosing it would leave the app in English");

check("Spanish is a language the picker offers and storage accepts",
  /\{ value: "es", label: "Español"/u.test(languages)
    && languages.includes("INTERFACE_LANGUAGE_VALUES.has(stored)"),
  "either the option is missing, or storage still validates against a hand-written list that would read \"es\" back as \"auto\"");

/**
 * The picker is searchable, and searchable by the names people type.
 *
 * The list is in endonyms — Español, Français, Polski — which is right, and
 * is exactly why the search has to accept the exonym and the unaccented
 * spelling too: somebody hunting for Spanish in an app currently written in
 * Polish is not going to scan a list of endonyms, and the keyboard that made
 * them want this setting is the one that will not produce ñ.
 */
const built = require("child_process").execFileSync(process.execPath, ["-e", `
const esbuild = require(${JSON.stringify(path.join(root, "node_modules/esbuild"))});
const out = esbuild.buildSync({
  stdin: {
    contents: 'export { searchInterfaceLanguages, INTERFACE_LANGUAGES } from "./src/lib/interfaceLanguage.ts";',
    resolveDir: ${JSON.stringify(root)}, sourcefile: "lang.ts", loader: "ts",
  },
  alias: { "@": ${JSON.stringify(path.join(root, "src"))} },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
});
process.stdout.write(out.outputFiles[0].text);
`], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
const Module = require("module");
const langs = new Module("lang", null);
langs.paths = Module._nodeModulePaths(root);
langs._compile(built, path.join(root, "lang.cjs"));
const { searchInterfaceLanguages, INTERFACE_LANGUAGES } = langs.exports;

check(`the picker offers every language with a table (${INTERFACE_LANGUAGES.length})`,
  INTERFACE_LANGUAGES.some((l) => l.value === "es") && INTERFACE_LANGUAGES.length >= 5);

for (const [query, expected] of [
  ["spanish", "es"], ["espanol", "es"], ["Español", "es"], ["castellano", "es"],
  ["french", "fr"], ["francais", "fr"], ["german", "de"], ["deutsch", "de"],
  ["polish", "pl"], ["english", "en"],
]) {
  const found = searchInterfaceLanguages(query).map((l) => l.value);
  check(`"${query}" finds ${expected}`, found.includes(expected), `found ${found.join(", ") || "nothing"}`);
}
check("a query that matches nothing returns nothing rather than everything",
  searchInterfaceLanguages("zzzz").length === 0);
check("an empty query returns the whole list",
  searchInterfaceLanguages("").length === INTERFACE_LANGUAGES.length);

check("the picker is one component, used everywhere the setting appears",
  (settings.match(/<AppLanguagePicker/g) || []).length === 2
    && !/<option value="pl">/u.test(settings),
  "a hand-written option list is back, which is how the two copies of this setting came to disagree");
check("it can be searched and confirmed from the keyboard",
  picker.includes('data-testid="app-language-search"')
    && picker.includes('event.key === "Enter" && matches.length === 1'));

if (failures) {
  console.error(`\n${failures} Spanish interface check(s) failed.`);
  process.exit(1);
}
console.log(`check-spanish-interface: all ${asked.size} shell strings have Spanish, the picker offers ${INTERFACE_LANGUAGES.length} languages and finds them by exonym, endonym or unaccented spelling`);
process.exit(0);
