#!/usr/bin/env node
/**
 * The Italian table, held to the two rules it is being written under.
 *
 * WHY THIS EXISTS AT ALL. Italian is being written with Spanish open beside it,
 * because every key already has a Spanish reading and the two languages are
 * close enough that it is a useful check on register. It is a check and not a
 * source, and the difference is not academic: writing from the Spanish is how
 * burro (butter, not a donkey), salire (to go up, not to leave) and guardare
 * (to look, not to keep) get written the Spanish way and are wrong in Italian
 * while looking entirely plausible.
 *
 * That is not hypothetical. "Das Geschirr wickeln wir in Luftpolsterfolie."
 * went in as "La vajilla... le stoviglie le avvolgiamo nel pluriball." — the
 * Spanish word for crockery, in the middle of an Italian sentence, on a card a
 * learner would have been taught from. It got as far as the table. So the
 * Spanish words that are NOT Italian words are listed below and the build
 * refuses them.
 *
 * THE SECOND RULE is that no two German keys share one Italian line. Where two
 * German words really are one Italian word that would be honest, and French,
 * Polish and Spanish all carry such pairs. Italian is being written without
 * them on purpose: each collision has been looked at as it arose and the
 * newcomer given the fuller phrase, so that every German card keeps a card of
 * its own. Five thousand entries in, that has held exactly. Pinning it means
 * the next one has to be a decision rather than an accident.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/lib/italianTranslations.ts"), "utf8");
const pairs = [...source.matchAll(/^ {2}"((?:[^"\\]|\\.)*)": "((?:[^"\\]|\\.)*)",$/gm)]
  .map((match) => ({ german: match[1], italian: match[2] }));

const failures = [];
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures.push(what); }
}

check(`the table parses and has entries (${pairs.length.toLocaleString("en-GB")})`, pairs.length > 4000);

// ── no German key answered twice ───────────────────────────────────────────
const keys = new Map();
const repeatedKeys = [];
for (const { german } of pairs) {
  if (keys.has(german)) repeatedKeys.push(german);
  keys.set(german, true);
}
check(`no German key appears twice${repeatedKeys.length ? ` — ${repeatedKeys[0]}` : ""}`,
  repeatedKeys.length === 0);

// ── nothing empty, nothing left as the German ──────────────────────────────
const blank = pairs.filter((row) => !row.italian.trim());
check(`no card has an empty Italian side${blank.length ? ` — ${blank[0].german}` : ""}`,
  blank.length === 0);

/**
 * An umlaut on the Italian side almost always means a line was never
 * translated. The exception is a handful of cards that quote a German phrase
 * on purpose — the sign-off a learner has to recognise, the word on the till
 * display — and those quote it inside guillemets. So the quoted spans come out
 * before the test, and what is left has to be a real Italian sentence: a line
 * that is nothing but a German quotation is still an untranslated line.
 */
/**
 * The other exception is a name. Italian does not respell people or places -
 * Herr Müller is signor Müller - so the surnames and place names the packs
 * actually use are listed here rather than being translated away. The list is
 * explicit on purpose: an unknown umlauted word is a missed line, not a name.
 */
const PROPER_NAMES = [
  "Müller", "Schröder", "Grün", "Björn", "Jürgen", "Günther", "Käthe",
  "München", "Köln", "Düsseldorf", "Nürnberg", "Zürich", "Österreich",
];
const outsideQuotes = (italian) => {
  let rest = italian.replace(/«[^»]*»/g, " ");
  for (const name of PROPER_NAMES) rest = rest.split(name).join(" ");
  return rest.trim();
};
const stillGerman = pairs.filter((row) => {
  const rest = outsideQuotes(row.italian);
  return /[äöüßÄÖÜ]/.test(rest) || (rest.length < 4 && row.italian.includes("«"));
});
check(`no Italian line still carries an umlaut${stillGerman.length ? ` — "${stillGerman[0].italian}"` : ""}`,
  stillGerman.length === 0);

/**
 * Words that are Spanish and are not Italian.
 *
 * Deliberately a short list of high-frequency words rather than a dictionary:
 * the failure being caught is a hand slipping from one language into the other
 * mid-sentence, and that slip lands on common words. A word that exists in both
 * (normale, importante, and hundreds more) must not be here, and neither must
 * one that only looks Spanish — burro and salire are real Italian words with
 * different meanings, which is a translation error this check cannot see and a
 * human has to.
 */
const SPANISH_ONLY = [
  "vajilla", "cerveza", "jamón", "queso", "mujer", "hombre", "ciudad",
  "trabajo", "dinero", "tienda", "semana", "jueves", "viernes", "miércoles",
  "siempre", "mucho", "entonces", "porque", "aunque", "cuando", "donde",
  "ahora", "también", "después", "todavía", "algo", "nada", "muy",
  "desde", "según", "hacia", "abajo", "arriba", "lejos",
  "hoy", "ayer", "mañana", "noche", "año", "días", "hijo", "hija", "hermano",
  "puerta", "ventana", "cocina", "coche", "niño", "niña",
];
/**
 * Words this list must NOT contain, and why, because the first version had
 * four of them and failed on an entry that was right:
 *   casa   is Italian for house, the same word in both languages;
 *   pero   is Italian for a pear tree;
 *   cerca  is Italian for "he searches";
 *   hasta  is Italian for a spear;
 *   calle  is a Venetian street.
 * A word shared by the two languages proves nothing about which one was being
 * written, so it cannot be evidence of a slip.
 */
const leaked = [];
for (const { german, italian } of pairs) {
  const words = italian.toLocaleLowerCase("it-IT").split(/[^a-zà-öø-ÿ]+/u);
  for (const word of SPANISH_ONLY) {
    if (words.includes(word)) leaked.push(`${german} → "${italian}" (${word})`);
  }
}
check(`no Italian line has a Spanish word in it${leaked.length ? ` — ${leaked[0]}` : ""}`,
  leaked.length === 0);

// ── one German card, one Italian card ──────────────────────────────────────
const byItalian = new Map();
const shared = [];
for (const { german, italian } of pairs) {
  if (byItalian.has(italian)) shared.push(`"${italian}" — ${byItalian.get(italian)} and ${german}`);
  else byItalian.set(italian, german);
}
check(`no two German keys share one Italian line${shared.length ? ` — ${shared.slice(0, 3).join("; ")}` : ""}`,
  shared.length === 0);

if (failures.length) {
  console.error(`\n${failures.length} Italian table problem${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\ncheck-italian-table: ${pairs.length.toLocaleString("en-GB")} entries, `
  + `${byItalian.size.toLocaleString("en-GB")} distinct Italian lines — one card each, `
  + "and not a word of Spanish among them."
);
