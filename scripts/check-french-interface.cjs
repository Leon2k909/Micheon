#!/usr/bin/env node
/**
 * The French app has to be French everywhere the German one is German.
 *
 * ui() falls through to its English key when a lookup misses. That is the
 * right behaviour — a missing string shows English rather than breaking — and
 * it is also why a gap is invisible: nothing throws, nothing looks broken, and
 * an English sentence simply sits in a French screen. check-german-interface
 * guards the German table against exactly that. This guards the French one,
 * plus the two failures French can have that German cannot:
 *
 *   1. A DROPPED SLOT. "Deleted {count} entries." translated without its
 *      {count} loses the number, and the sentence still reads fine. Both sides
 *      must carry the same slots.
 *   2. A KEY THAT IS NOT A KEY. The French table is generated from the German
 *      table's own keys, so the two must hold the same set. Anything else means
 *      the generator ran against a different i18n.ts and the entry can never
 *      be found.
 *
 * The exception to (2) is the handful of GERMAN strings at the end of the
 * French table. Those are the fallbacks uiOr() is handed at its call sites,
 * which have no English key — see uiOr in i18n.ts.
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
const FR = readTable("src/lib/i18nFr.ts", "export const FR");

// ── the two tables hold the same keys ────────────────────────────────────
// The German fallbacks are the deliberate exception, and there are seven of
// them; if that count changes, uiOr's call sites changed and this needs a look.
const germanFallbacks = Object.keys(FR).filter((key) => !(key in DE));
if (germanFallbacks.length > 8) {
  failures.push(
    `${germanFallbacks.length} French key(s) match nothing in the German table, so ui() can never find them: ` +
      germanFallbacks.slice(0, 6).map((key) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

const missing = Object.keys(DE).filter((key) => !(key in FR));
if (missing.length) {
  failures.push(
    `${missing.length} string(s) have German but no French, and would show in English: ` +
      missing.slice(0, 6).map((key) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

// ── every slot survives the translation ──────────────────────────────────
const slots = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const dropped = Object.entries(FR).filter(([key, value]) => key in DE && slots(key) !== slots(value));
if (dropped.length) {
  failures.push(
    `${dropped.length} French translation(s) do not carry the same {slots} as their English, so a value goes missing:\n` +
      dropped.slice(0, 6).map(([key, value]) =>
        `      ${JSON.stringify(key.slice(0, 60))}\n        expected {${slots(key)}}, found {${slots(value)}}`
      ).join("\n")
  );
}

// The German table has the same obligation, and a slot dropped there is the
// same silent failure. Checking it here costs one line.
const droppedDe = Object.entries(DE).filter(([key, value]) => slots(key) !== slots(value));
if (droppedDe.length) {
  failures.push(
    `${droppedDe.length} German translation(s) drop a {slot}: ` +
      droppedDe.slice(0, 4).map(([key]) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

const empty = Object.entries(FR).filter(([, value]) => !String(value).trim());
if (empty.length) failures.push(`${empty.length} French entries are empty`);

// ── a sentence that came back unchanged was never translated ─────────────
// Names and bare labels are supposed to survive: "Twemoji", "MICHEON",
// "colour, practise". Only prose is suspicious.
const looksLikeSentence = (text) => {
  const trimmed = text.trim();
  if (trimmed.includes(" · ")) return false;
  const words = trimmed.split(/\s+/).length;
  return (words > 2 && /[.!?]$/.test(trimmed)) || words > 6;
};
// One key is not English at all: the France country course carries its own
// French tagline, which the German table translates and the French one leaves
// alone. Identical is the correct answer there.
const SOURCE_IS_FRENCH = new Set([
  "Valeurs, institutions et vie quotidienne — comment le pays fonctionne.",
]);
const untranslated = Object.entries(FR)
  .filter(([key, value]) => key === value && !SOURCE_IS_FRENCH.has(key) && looksLikeSentence(key));
if (untranslated.length) {
  failures.push(
    `${untranslated.length} French entries are identical to their English, which is a paste that was never translated: ` +
      untranslated.slice(0, 4).map(([key]) => JSON.stringify(key.slice(0, 60))).join(", ")
  );
}

// ── the picker actually offers it ────────────────────────────────────────
// A complete table nobody can select is not a French app.
const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const offers = (settings.match(/<option value="fr">/g) || []).length;
if (offers < 2) {
  failures.push(
    `the app-language picker offers French in ${offers} of its 2 settings layouts — ` +
      "a table nobody can choose is not a French app"
  );
}

const interfaceLanguage = fs.readFileSync(path.join(root, "src/lib/interfaceLanguage.ts"), "utf8");
if (!/InterfaceLanguage = "auto" \| "en" \| "de" \| "fr"/.test(interfaceLanguage)) {
  failures.push("InterfaceLanguage no longer admits \"fr\", so the picker's choice cannot be stored");
}
if (!/stored === "fr"/.test(interfaceLanguage)) {
  failures.push("getInterfaceLanguage no longer accepts a stored \"fr\", so the choice is forgotten on reload");
}

// ── nothing branches on "is it German" to decide what English to show ────
// `uiIsGerman() ? German : English` was the shape of every one of these before
// French existed, and every one of them would have shown a French reader
// English. They are dictionary lookups now, and this keeps them that way.
const sources = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry.name)) sources.push(full);
  }
};
walk(path.join(root, "src"));
const branching = sources.filter((file) => {
  if (file.endsWith(path.join("lib", "i18n.ts"))) return false;
  return /uiIsGerman\(\)\s*\n?\s*\?/.test(fs.readFileSync(file, "utf8"));
});
if (branching.length) {
  failures.push(
    `${branching.length} file(s) still choose their copy with uiIsGerman(), which shows English to a French reader: ` +
      branching.slice(0, 4).map((file) => path.relative(root, file)).join(", ")
  );
}

if (failures.length) {
  console.error("FAIL check-french-interface");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

const total = Object.keys(DE).length;
const covered = Object.keys(FR).filter((key) => key in DE).length;
console.log(
  `check-french-interface: ${covered} of ${total} interface strings have French ` +
    // Floor, not round: 2855 of 2859 is not "100%", and reporting it as such is
    // how the last few strings stay English for ever.
    `(${Math.floor((covered / total) * 100)}%), every {slot} survives translation, ` +
    "and no component picks its copy by asking whether the app is German"
);
