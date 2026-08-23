#!/usr/bin/env node
/**
 * A German speaker gets a German app, everywhere.
 *
 * The whole new shell — sidebar, dashboard, search, notifications, shop,
 * social — was built without a single translation call, so someone running the
 * app in German mode read English on every screen the moment they left a
 * lesson. That is the bug this guards.
 *
 * Three things have to hold, and the last two rot quietly:
 *   1. copy goes through ui() / uiFmt() rather than being written inline,
 *   2. every key those calls use actually HAS a German translation. A missing
 *      key is silent — ui() returns the English string untouched — so without
 *      this check the interface degrades one new string at a time, and
 *   3. copy written AROUND a value counts as copy. This is the hole the first
 *      version left: it only looked for a JSX node made of plain words, so
 *      "{n} useful items known", "{x} of {y} achievements unlocked", and
 *      "About {h} hours to Fluent" all sailed past it and a German dashboard
 *      read English wherever it showed a number. A sentence with a number in
 *      it needs the WHOLE sentence as one key — German puts the number
 *      somewhere else — so text beside an expression is always a bug.
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

// ── nor English written around a value ────────────────────────────────────
//
// Comments are prose about the code and would otherwise trip every one of
// these patterns, so they come out first.
function withoutComments(source) {
  let out = "";
  let index = 0;
  let inBlock = false;
  while (index < source.length) {
    if (inBlock) {
      const end = source.indexOf("*/", index);
      if (end === -1) break;
      inBlock = false;
      index = end + 2;
      continue;
    }
    const block = source.indexOf("/*", index);
    const line = source.indexOf("//", index);
    const newline = source.indexOf("\n", index);
    if (line !== -1 && (block === -1 || line < block) && (newline === -1 || line < newline)) {
      out += source.slice(index, line);
      index = newline === -1 ? source.length : newline;
      continue;
    }
    if (block !== -1) {
      out += source.slice(index, block);
      inBlock = true;
      index = block + 2;
      continue;
    }
    out += source.slice(index);
    break;
  }
  return out;
}

// A key like "{xp} XP to level {level}" is a translated pattern, not loose
// copy — blank the keys out so the patterns below cannot read them back as
// English sitting beside a value.
const code = withoutComments(shell).replace(/\bui(?:Fmt|Or)?\("(?:[^"\\]|\\.)*"/g, "ui(KEY");
const beside = [];
// "…} useful items known<", ">About {…" — two or more words touching a value.
for (const m of code.matchAll(/\}\s*([A-Za-z]{2,}(?:[ ,.'-]+[A-Za-z]{2,})+)\s*[<{]/g)) beside.push(m[1]);
for (const m of code.matchAll(/>\s*([A-Za-z]{2,}(?:[ ,.'-]+[A-Za-z]{2,})+)\s*\{/g)) beside.push(m[1]);
// aria-label={`… ${value} …`} — read aloud, so it is copy as much as the
// rest. Templates that call ui() have already been blanked to ui(KEY above,
// which is what separates a translated label from a hand-written one.
for (const m of code.matchAll(/(?:aria-label|title)=\{`([^`]*)`\}/g)) {
  if (m[1].includes("ui(")) continue;
  const words = m[1].replace(/\$\{[^{}]*\}/g, " ").match(/[A-Za-z]{2,}(?:[ ,.'-]+[A-Za-z]{2,})+/g);
  if (words) beside.push(...words);
}
if (beside.length) {
  failures.push(
    `${beside.length} phrase(s) are written beside a value instead of going through uiFmt(): ` +
    [...new Set(beside)].slice(0, 4).map((t) => JSON.stringify(t)).join(", ")
  );
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

// ── 4. words that reach ui() through a variable ───────────────────────────
// The rules above read ui("…") literally, which is blind to the shape the
// update panel uses:
//
//     [["auto", "Automatic", "Download and install on quit"], …]
//       .map(([value, label, note]) => <><strong>{ui(label)}</strong>…</>)
//
// Every one of those notes was English on a German screen, and every check
// passed. So: any sentence-shaped string in the app's own chrome must either
// have German or be named below with a reason.
const CHROME = ["src/components", "src/components/course", "src/components/codexPets"];
// The two screens that are not under src/components and were therefore
// outside this rule until a background option was found sitting in English.
const CHROME_FILES = ["src/Gamification.tsx", "src/prototype/NewUiPrototype.tsx"];

// Not translations, and each for its own reason.
const DELIBERATE = new Set([
  // Sample lines spoken by the voice being auditioned — they are the voice's
  // own language, which is the point of hearing them.
  "Hello! Shall we make a start?",
  "Guten Tag! Wollen wir anfangen?",
  "Bonjour ! On commence ?",
  // Both halves of a locale ternary; the German one is right there beside it.
  "Cache cleared.",
  "Cache geleert.",
  "Could not clear the cache.",
  "The selected file is too large.",
  "Keep learning while Micheon prepares the new version.",
  // Compared against lesson content, never shown.
  "Now answer these",
  // Sample people in the Friends screen. A name is a name in every language,
  // and "translating" one would be a bug rather than a courtesy.
  "Jonas Weber",
  "Sophie Klein",
  "Felix Braun",
  "Emilia Koch",
]);

// Already German — the other half of a locale ternary, which needs no entry
// in a table that translates into German.
const readsGerman = (value) =>
  /[äöüßÄÖÜ]/.test(value)
  || /\b(der|die|das|und|oder|nicht|kann|wird|deine|diese|einen|eine|für|mit|von|jetzt|noch)\b/i.test(value);

const sentenceShaped = (value) =>
  value.length >= 4 && value.length <= 120
  && /^[A-Z]/.test(value)
  && /\s/.test(value)
  && !/[<>{}[\]\/\\|@#$^*=_~`]/.test(value)
  && /[a-z]{2}/.test(value);

const chromeFiles = [];
for (const dir of CHROME) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) continue;
  for (const name of fs.readdirSync(full)) {
    if (!/\.tsx?$/.test(name)) continue;
    const file = path.join(full, name);
    if (fs.statSync(file).isFile()) chromeFiles.push([dir + "/" + name, file]);
  }
}
for (const named of CHROME_FILES) {
  const file = path.join(root, named);
  if (fs.existsSync(file)) chromeFiles.push([named, file]);
}

const chromeEnglish = [];
for (const [label, file] of chromeFiles) {
  // Comments are stripped rather than skipped line by line: a sentence quoted
  // inside a /* … */ block sits on a continuation line that starts with
  // neither marker, and was reported as untranslated interface text.
  const source = fs.readFileSync(file, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    (block) => block.replace(/[^\n]/g, " ")
  );
  source.split("\n").forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    for (const match of line.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
      // Source may write a character as a \uXXXX escape; the key looked up at
      // runtime is the character itself, and the em dash in that background
      // note is written exactly that way.
      const value = unescapeKey(match[1]);
      if (!sentenceShaped(value) || DELIBERATE.has(value) || readsGerman(value)) continue;
      if (translated.has(value) || translated.has(match[1])) continue;
      // A fallback for an error object's own message, not a label.
      if (/instanceof Error \? \w+\.message :/.test(line)) continue;
      chromeEnglish.push(label + ":" + (index + 1) + "  " + JSON.stringify(value));
    }
  });
}
if (chromeEnglish.length) {
  failures.push(
    chromeEnglish.length + " string(s) in the app's own chrome have no German — translate them, "
    + "or add them to DELIBERATE with the reason:\n    " + chromeEnglish.join("\n    ")
  );
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
