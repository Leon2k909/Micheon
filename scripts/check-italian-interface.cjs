#!/usr/bin/env node
/**
 * Italian is wired up, and the app keeps saying tu.
 *
 * Coverage is check-interface-coverage's job and Italian is held to the same
 * bar there as the other five, with no exemption of its own. What that check
 * cannot see is WHICH Italian this is, and there are two things a coverage
 * count will pass without noticing.
 *
 * ADDRESS. Italian has a real second person and a polite third — tu and Lei —
 * and an app is not a form. Every other table here settles this the same way:
 * the German says du, the Portuguese says tu, the English source uses the
 * plain second person. A table that drifts into Lei is not wrong Italian, it
 * is a different app talking to you, and it drifts one string at a time as
 * whoever is nearest writes the next hundred.
 *
 * AND THE COURSE IS STILL GERMAN. This table is what the app says about
 * itself; the cards keep teaching German whatever is chosen here. So "the
 * German word" has to stay "la parola tedesca" — quietly generalising it to
 * "la parola straniera" would leave an Italian reader learning German from an
 * app that no longer says so.
 *
 * The pairs below are not a claim that Lei is wrong Italian. They are a claim
 * that this file is not where it goes.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

function readTable(rel, marker) {
  const src = read(rel);
  const start = src.indexOf("{", src.indexOf(marker));
  const end = src.indexOf("\n};", start);
  if (start < 0 || end < 0) throw new Error(`could not read the table in ${rel}`);
  return Function("return " + src.slice(start, end + 2))();
}

const IT = readTable("src/lib/i18nIt.ts", "export const IT");
const i18n = read("src/lib/i18n.ts");
const languages = read("src/lib/interfaceLanguage.ts");

let failures = 0;
const check = (name, condition, detail) => {
  if (condition) { console.log(`ok   ${name}`); return; }
  failures += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const entries = Object.entries(IT);

check(`the table is a whole app, not a shell (${entries.length} strings)`, entries.length > 1500,
  "a partial table passes coverage for the keys it has and leaves the rest in English");

// ── it is Italian, and it says tu ───────────────────────────────────────────
//
// Matched on whole words, because "lei" is also the ordinary word for "her"
// and half these forms are legitimate somewhere. What is being looked for is
// the app addressing its reader in the third person.
const POLITE = [
  /\bLei\b/u,               // the polite you, which is capitalised on purpose
  /\bsuo account\b/iu,      // "your account" said the polite way
  /\bla Sua\b/u,
  /\bil Suo\b/u,
  /\bVoi\b/u,               // the older plural polite
];
const polite = entries
  .filter(([, value]) => POLITE.some((pattern) => pattern.test(value)))
  .map(([key]) => JSON.stringify(key));
check("nobody is addressed as Lei", polite.length === 0,
  `${polite.length}: ${polite.slice(0, 4).join(", ")}`);

// The imperative an app gives is the tu one: "scrivi", never "scriva".
//
// Anchored to the start of a sentence and to a capital, because every one of
// these forms is also something else mid-sentence and a looser test reports
// correct Italian as a fault: "quando torni in rete" is the tu present, and
// "a meno che tu non scelga" is the subjunctive that "a meno che" requires.
// An instruction addressed to the reader opens the sentence, which is the
// only place this needs to look.
const FORMAL_IMPERATIVE =
  /(^|[.!?:]\s+)(Scriva|Prema|Scelga|Controlli|Apra|Chiuda|Torni|Provi|Clicchi|Usi|Scelga)\b/u;
const formalVerbs = entries
  .filter(([, value]) => FORMAL_IMPERATIVE.test(value))
  .map(([key]) => JSON.stringify(key));
check("instructions are given in the tu imperative", formalVerbs.length === 0,
  `${formalVerbs.length}: ${formalVerbs.slice(0, 4).join(", ")}`);

// ── the course it frames is still German ────────────────────────────────────
const GERMAN_KEYS = entries.filter(([key]) => /\bGerman\b/u.test(key));
check(`the table has the German course's own strings in it (${GERMAN_KEYS.length})`,
  GERMAN_KEYS.length > 20, "nothing to check the framing against");
const generalised = GERMAN_KEYS
  .filter(([, value]) => !/tedesc|Deutsch/iu.test(value))
  // Two strings name German only as an example inside a longer sentence and
  // do not need the word again in the Italian.
  .filter(([key]) => !/^German tip:/u.test(key))
  .map(([key]) => JSON.stringify(key));
check("a string about German still says German in Italian", generalised.length === 0,
  `${generalised.length}: ${generalised.slice(0, 4).join(", ")}`);

// ── the mechanical failures a coverage count also cannot see ────────────────
const slots = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const slotMismatch = entries.filter(([key, value]) => slots(key) !== slots(value)).map(([key]) => JSON.stringify(key));
check("every {slot} survives translation", slotMismatch.length === 0,
  slotMismatch.slice(0, 4).join(", "));

/**
 * A value left as its own key is an untranslated string that counts as
 * translated everywhere else, which is worse than a missing one: the coverage
 * check sees a key with a value and passes it.
 *
 * A string that is only slots and punctuation has nothing in it to translate,
 * so the slots come off before asking whether any words are left. Then two
 * lists.
 *
 * SAME WORD: words Italian shares or borrowed, and the names of the projects
 * in the credits. Two are not borrowings at all: "incomplete" is the feminine
 * plural of incompleto and describes cards, which are feminine; "Account" is
 * simply what Italian software calls an account, and "profilo" is taken by
 * the profile sitting beside it in the same settings page.
 *
 * MUST STAY ENGLISH: strings whose whole job is to BE English. "colour,
 * practise" is the example under the British-spelling setting; translating it
 * deletes the only information it carries.
 */
const SAME_WORD = new Set([
  "Cache", "Beta", "XP", "TSV", "CSV", "MICHEON", "Micheon Premium", "Micheon coins",
  "Euro", "Original", "Normal", "Familiar", "Extras", "Lingo",
  "Twemoji", "Tatoeba", "Lucide",
  "incomplete", "Account", "Home", "Dashboard", "Desktop",
]);
const MUST_STAY_ENGLISH = new Set(["colour, practise", "color, practice"]);
/**
 * WRITTEN IN ITALIAN TO BEGIN WITH: the country course about Italy carries
 * an Italian tagline, so this table has nothing to translate and leaves it
 * alone. Identical is the correct answer. check-french-interface and
 * check-polish-interface hold the same kind of list for the same reason.
 */
const SOURCE_IS_ITALIAN = new Set([
  "Storia, ordinamento e vita quotidiana \u2014 come funziona il paese.",
]);
const untouched = entries
  .filter(([key, value]) => key === value)
  .filter(([key]) => !SAME_WORD.has(key) && !MUST_STAY_ENGLISH.has(key))
  .filter(([key]) => !SOURCE_IS_ITALIAN.has(key))
  .filter(([key]) => /[a-z]{4}/iu.test(key.replace(/\{\w+\}/g, "")))
  .map(([key]) => JSON.stringify(key));
check("no string was left in English while counting as translated", untouched.length === 0,
  `${untouched.length}: ${untouched.slice(0, 5).join(", ")}`);

check("the app can actually load the table",
  i18n.includes('it: () => import("@/lib/i18nIt").then((m) => m.IT)'),
  "i18n.ts has no loader for Italian, so choosing it would leave the app in English");

check("Italian is a language the picker offers and storage accepts",
  /\{ value: "it", label: "Italiano"/u.test(languages)
    && /"it"/u.test(languages.slice(languages.indexOf("ResolvedInterfaceLanguage"))),
  "the picker or the stored-value type does not know about it");

// Somebody looking for it will type the English name, the German one, or the
// endonym — and the picker has to find it from any of them.
for (const query of ["italian", "italienisch", "italiano", "italien"]) {
  const found = [...languages.matchAll(/\{ value: "(\w+)"[^}]*\}/gu)]
    .filter((match) => match[0].toLowerCase().includes(query))
    .map((match) => match[1]);
  check(`"${query}" finds it`, found.includes("it"), `found ${found.join(", ") || "nothing"}`);
}

if (failures) {
  console.error(`\n${failures} Italian interface check(s) failed.`);
  process.exit(1);
}

console.log(
  `\ncheck-italian-interface: ${entries.length} strings, tu throughout, `
  + "still framing a German course, and findable among the languages the picker offers"
);
