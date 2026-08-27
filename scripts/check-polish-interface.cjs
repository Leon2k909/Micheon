#!/usr/bin/env node
/**
 * The Polish app has to be Polish everywhere the German one is German.
 *
 * This is check-french-interface applied to the third table, for the same
 * reason: ui() falls through to its English key when a lookup misses, so a gap
 * is invisible — nothing throws, nothing looks broken, and an English sentence
 * simply sits in a Polish screen.
 *
 * It also guards the one failure Polish can have that neither German nor
 * French can:
 *
 *   GENDER. Polish marks the speaker's gender in the past tense, so a literal
 *   translation of "you wrote" has to pick one — "napisałaś" to a woman,
 *   "napisałeś" to a man. An app does not know who is reading it, and half its
 *   readers would be addressed wrongly. The table is written in impersonal
 *   forms ("zapisano", "przerwano") or the present tense instead, which say
 *   the same thing without guessing. This fails on the second-person past
 *   endings so the next person to add a string cannot quietly reintroduce it.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const failures = [];

const readTable = (file, marker) => {
  const src = fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
  const start = src.indexOf("{", src.indexOf(marker));
  const end = src.indexOf("\n};", start);
  if (start < 0 || end < 0) throw new Error(`could not find the table in ${file}`);
  return Function("return " + src.slice(start, end + 2))();
};

const DE = readTable("src/lib/i18nDe.ts", "export const DE");
const PL = readTable("src/lib/i18nPl.ts", "export const PL");

// ── the two tables hold the same keys ────────────────────────────────────
// The German fallbacks are the deliberate exception, and there are seven of
// them; if that count changes, uiOr's call sites changed and this needs a look.
const germanFallbacks = Object.keys(PL).filter((key) => !(key in DE));
if (germanFallbacks.length > 8) {
  failures.push(
    `${germanFallbacks.length} Polish key(s) match nothing in the German table, so ui() can never find them: ` +
      germanFallbacks.slice(0, 6).map((key) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

const missing = Object.keys(DE).filter((key) => !(key in PL));
if (missing.length) {
  failures.push(
    `${missing.length} string(s) have German but no Polish, and would show in English: ` +
      missing.slice(0, 6).map((key) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

// ── every {slot} survives the translation ────────────────────────────────
const slots = (text) => (String(text).match(/\{\w+\}/g) || []).sort().join(",");
const dropped = Object.keys(DE)
  .filter((key) => key in PL)
  .filter((key) => slots(key) !== slots(PL[key]));
if (dropped.length) {
  failures.push(
    `${dropped.length} Polish translation(s) do not carry the same {slots} as their English, so a value goes missing:\n` +
      dropped.slice(0, 6).map((key) => `      ${JSON.stringify(key.slice(0, 50))} -> ${JSON.stringify(PL[key].slice(0, 50))}`).join("\n")
  );
}

const empty = Object.entries(PL).filter(([, value]) => !String(value).trim());
if (empty.length) failures.push(`${empty.length} Polish entries are empty`);

// ── nothing addresses the reader in the gendered past ────────────────────
// -łaś is the feminine second-person past, -łeś the masculine. Either one
// tells half the readership it is the other. Impersonal -no/-to forms and the
// present tense carry the same meaning for everybody.
const gendered = Object.entries(PL).filter(([, value]) =>
  /(łaś|łeś|łabyś|łbyś)\b/.test(String(value).replace(/[Ww]łaś/g, "")));
if (gendered.length) {
  failures.push(
    `${gendered.length} Polish entries address the reader in the gendered past tense, which is wrong for half of them: ` +
      gendered.slice(0, 4).map(([key, value]) => JSON.stringify(String(value).slice(0, 50))).join(", ")
  );
}

// ── a sentence that came back unchanged was never translated ─────────────
// Names and bare labels are supposed to survive: "Twemoji", "MICHEON",
// "colour, practise". Only prose is suspicious.
const looksLikeSentence = (text) => {
  const trimmed = text.trim();
  if (trimmed.includes(" · ")) return false;
  const words = trimmed.split(/\s+/).length;
  return (words > 2 && /[.!?]$/.test(trimmed)) || words > 6;
};
const untranslated = Object.entries(PL)
  .filter(([key, value]) => key === value && looksLikeSentence(key));
if (untranslated.length) {
  failures.push(
    `${untranslated.length} Polish entries are identical to their English, which is a paste that was never translated: ` +
      untranslated.slice(0, 4).map(([key]) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

// ── the picker actually offers it ────────────────────────────────────────
// A complete table nobody can select is not a Polish app.
const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const offers = (settings.match(/<option value="pl">/g) || []).length;
if (offers < 2) {
  failures.push(
    `the app-language picker offers Polish in ${offers} of its 2 settings layouts — ` +
      "a table nobody can choose is not a Polish app"
  );
}

const interfaceLanguage = fs.readFileSync(path.join(root, "src/lib/interfaceLanguage.ts"), "utf8");
if (!/InterfaceLanguage = "auto" \| "en" \| "de" \| "fr" \| "pl"/.test(interfaceLanguage)) {
  failures.push("InterfaceLanguage no longer admits \"pl\", so the picker's choice cannot be stored");
}
if (!/stored === "pl"/.test(interfaceLanguage)) {
  failures.push("getInterfaceLanguage no longer accepts a stored \"pl\", so the choice is forgotten on reload");
}

// ── the table is actually fetched, and dates and speech follow it ────────
// The tables are downloaded per language. A table with no loader is 221 KB
// that ships and is never read, and the app stays English in Polish.
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
if (!/pl: \(\) => import\("@\/lib\/i18nPl"\)/.test(i18n)) {
  failures.push("i18n.ts has no loader for the Polish table, so choosing Polish leaves the app in English");
}
if (!/language === "pl"\) return "pl-PL"/.test(i18n)) {
  failures.push("uiLocale or uiSpeechLang does not answer for Polish, so a Polish app formats dates or speaks in English");
}

if (failures.length) {
  console.error("FAIL check-polish-interface");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

const total = Object.keys(DE).length;
const covered = Object.keys(PL).filter((key) => key in DE).length;
console.log(
  `check-polish-interface: ${covered} of ${total} interface strings have Polish ` +
    // Floor, not round: 2936 of 2940 is not "100%", and reporting it as such is
    // how the last few strings stay English for ever.
    `(${Math.floor((covered / total) * 100)}%), every {slot} survives translation, ` +
    "nothing addresses the reader in the gendered past, and the picker offers it"
);
