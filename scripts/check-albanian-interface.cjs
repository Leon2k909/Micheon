#!/usr/bin/env node
/**
 * The Albanian app stays in one voice, and it can be chosen.
 *
 * Coverage is check-interface-coverage's job, and Albanian is held to the same
 * bar there as every other table. What a coverage count cannot see is how the
 * strings are written, and Albanian has four ways to go wrong that each look
 * like a perfectly good entry, and a fifth it shares with every language:
 *
 *   ADDRESS. The table says ti, as the German one says du. Albanian UI text
 *   written from habit says ju — the form an office uses to a citizen — and a
 *   single "ju lutem" in a screen of ti reads like a letter from somebody
 *   else. The next hundred strings get written by whoever is nearest, so the
 *   plural forms fail here unless they sit inside « », where a line may be
 *   quoting the word rather than using it.
 *
 *   GENDER. Albanian adjectives agree: i gatshëm to a man, e gatshme to a
 *   woman. The app does not know who is reading it, so the table writes round
 *   every one of those with a verb (the perfect with kam never agrees) or an
 *   invariant word such as gati. This fails on "i/e", and on the handful of
 *   reader-describing adjectives a literal translation reaches for first.
 *
 *   LETTERS. ë and ç are letters, not decoration, and text typed on a keyboard
 *   without them reads as careless to every Albanian reader. The commonest
 *   words written without them fail here.
 *
 *   QUOTES. Quotation is « », as the course writes it. A straight double quote
 *   in a value is also the one character most likely to be pasted in from an
 *   English source.
 *
 *   NUMBERS. Albanian groups thousands with a space, and not at all below ten
 *   thousand: 2500, 18 935. A number typed into a value from German or
 *   English habit, 2.500 or 2,500, sits in the same card as one uiNumber
 *   writes, and the two disagree in front of the reader.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
const failures = [];

const readTable = (file, marker) => {
  const src = read(file);
  const start = src.indexOf("{", src.indexOf(marker));
  const end = src.indexOf("\n};", start);
  if (start < 0 || end < 0) throw new Error(`could not find the table in ${file}`);
  return Function("return " + src.slice(start, end + 2))();
};

const SQ = readTable("src/lib/i18nSq.ts", "export const SQ");
const entries = Object.entries(SQ);

if (entries.length < 1500) {
  failures.push(`only ${entries.length} Albanian strings — a shell-sized table means most of the app falls back to English`);
}

// Text inside « » may quote a word rather than use it: a line explaining that
// German says Sie where Albanian says «ju» is doing its job.
const unquoted = (text) => String(text).replace(/«[^»]*»/g, " ");
const word = (list) => new RegExp(`(?<!\\p{L})(${list.join("|")})(?!\\p{L})`, "iu");
const sample = (rows) => rows.slice(0, 4).map(([key, value]) => `      ${JSON.stringify(key.slice(0, 50))} -> ${JSON.stringify(String(value).slice(0, 70))}`).join("\n");

// ── every {slot} survives the translation ────────────────────────────────
const slots = (text) => (String(text).match(/\{\w+\}/g) || []).sort().join(",");
const dropped = entries.filter(([key, value]) => slots(key) !== slots(value));
if (dropped.length) {
  failures.push(`${dropped.length} Albanian entries do not carry the same {slots} as their English, so a value goes missing:\n${sample(dropped)}`);
}

const empty = entries.filter(([, value]) => !String(value).trim());
if (empty.length) failures.push(`${empty.length} Albanian entries are empty`);

// ── ti, never ju ─────────────────────────────────────────────────────────
const PLURAL_ADDRESS = word(["ju", "juaj", "jeni", "keni", "tuaj", "tuajat", "tuajin", "tuajën", "tuajt", "tuajave"]);
const formal = entries.filter(([, value]) => PLURAL_ADDRESS.test(unquoted(value)));
if (formal.length) {
  failures.push(`${formal.length} Albanian entries address the reader as ju; the table says ti throughout:\n${sample(formal)}`);
}

// ── no gender on the reader ──────────────────────────────────────────────
const SLASHED = /(?<!\p{L})i\/e(?!\p{L})/u;
const READER_ADJECTIVE = new RegExp(
  "(?<!\\p{L})(je|jesh|ishe|ndihesh|dukesh|mbetesh)\\s+(i|e)\\s+"
  + "(gatshëm|gatshme|sigurt|lodhur|mirëpritur|regjistruar|kënaqur|lumtur|humbur|zënë|hutuar|gabuar|ri|re)(?!\\p{L})",
  "iu"
);
const gendered = entries.filter(([, value]) => SLASHED.test(value) || READER_ADJECTIVE.test(unquoted(value)));
if (gendered.length) {
  failures.push(`${gendered.length} Albanian entries give the reader a gender, which is wrong for half of them:\n${sample(gendered)}`);
}

// ── ë and ç are letters ──────────────────────────────────────────────────
const BARE = word(["nje", "eshte", "per", "nese", "mesim", "mesime", "fjale", "gjithcka", "cfare", "pergjigje", "perseritje", "te lutem", "mire"]);
const bare = entries.filter(([key, value]) => {
  const match = unquoted(value).match(BARE);
  return match && !key.toLowerCase().includes(match[1].toLowerCase());
});
if (bare.length) {
  failures.push(`${bare.length} Albanian entries spell a common word without its ë or ç:\n${sample(bare)}`);
}

// ── quotation is « » ─────────────────────────────────────────────────────
const quoted = entries.filter(([, value]) => /["“”„]/.test(value));
if (quoted.length) {
  failures.push(`${quoted.length} Albanian entries quote with " or “ ” rather than « »:\n${sample(quoted)}`);
}

// ── numbers are written the way uiNumber writes them ─────────────────────
const GROUPED_BY_HABIT = /\d[.,]\d{3}(?!\d)/;
const habit = entries.filter(([, value]) => GROUPED_BY_HABIT.test(value));
if (habit.length) {
  failures.push(`${habit.length} Albanian entries group a number with . or , where the app writes 2500 or 18 935:\n${sample(habit)}`);
}

// ── a sentence that came back unchanged was never translated ─────────────
const looksLikeSentence = (text) => {
  const trimmed = text.trim();
  if (trimmed.includes(" · ")) return false;
  const words = trimmed.split(/\s+/).length;
  return (words > 2 && /[.!?]$/.test(trimmed)) || words > 6;
};
const untranslated = entries.filter(([key, value]) => key === value && looksLikeSentence(key));
if (untranslated.length) {
  failures.push(`${untranslated.length} Albanian entries are identical to their source, a paste that was never translated:\n${sample(untranslated)}`);
}

// ── the daily line on the home screen ────────────────────────────────────
// motivationQuotes.ts is content rather than interface, so no coverage gate
// reads it, and a line without sq quietly shows its English. It is the first
// sentence an Albanian app shows every morning, so all 365 are held to the
// table's voice here. The adjective test is wider than the table's: a banner
// line reaches for "be strong" and "be proud" far more often than a button.
const quotes = read("src/lib/motivationQuotes.ts").split("\n")
  .filter((line) => line.startsWith("  { de: "))
  .map((line) => Function("return " + line.trim().replace(/,$/, ""))());
if (quotes.length < 365) {
  failures.push(`only ${quotes.length} daily lines read from motivationQuotes.ts, fewer than a year's 365: `
    + "lines were cut, or the file changed shape and this check no longer sees them");
}
const withoutAlbanian = quotes.filter((quote) => !quote.sq || !quote.sq.trim());
if (withoutAlbanian.length) {
  failures.push(`${withoutAlbanian.length} of ${quotes.length} daily lines have no Albanian, so the home banner reads English:\n`
    + withoutAlbanian.slice(0, 4).map((quote) => `      ${JSON.stringify(quote.en)}`).join("\n"));
}
const DAILY_READER_ADJECTIVE = /(?<!\p{L})(ji|je|jesh|ishe|ndihesh|dukesh|mbetesh|qëndro|bëhu)\s+(i|e)\s+\p{L}/iu;
const offVoice = quotes.filter((quote) => quote.sq).map((quote) => [quote.en, quote.sq])
  .filter(([, value]) => PLURAL_ADDRESS.test(unquoted(value)) || SLASHED.test(value)
    || DAILY_READER_ADJECTIVE.test(unquoted(value)) || /["“”„]/.test(value));
if (offVoice.length) {
  failures.push(`${offVoice.length} Albanian daily lines say ju, give the reader a gender, or quote with ":\n${sample(offVoice)}`);
}

// ── the table is fetched, offered, remembered, and dates follow it ───────
const i18n = read("src/lib/i18n.ts");
const languages = read("src/lib/interfaceLanguage.ts");
if (!/sq: \(\) => import\("@\/lib\/i18nSq"\)\.then\(\(m\) => m\.SQ\)/.test(i18n)) {
  failures.push("i18n.ts has no loader for the Albanian table, so choosing Shqip leaves the app in English");
}
if (!/\bsq: \{ format: "sq-AL", speech: "sq-AL" \}/.test(i18n)) {
  failures.push("UI_LOCALES does not answer for Albanian, so an Albanian app formats dates or speaks in another language");
}
if (!/\{ value: "sq", label: "Shqip"/.test(languages)) {
  failures.push("the picker's language list does not hold Shqip, so the table cannot be chosen anywhere");
}
if (!/export type InterfaceLanguage = [^;\n]*"sq"/.test(languages) || !/export type ResolvedInterfaceLanguage = [^;\n]*"sq"/.test(languages)) {
  failures.push("the interface-language types do not admit \"sq\", so the picker's choice cannot be stored");
}

if (failures.length) {
  console.error("FAIL check-albanian-interface");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-albanian-interface: ${entries.length} Albanian strings, every {slot} survives, ti throughout, `
  + "no gender on the reader, ë and ç where they belong, « » for quotation, numbers as the app writes them, "
  + "and the picker offers it; "
  + `all ${quotes.length} daily lines on the home screen in the same voice`
);
