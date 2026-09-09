#!/usr/bin/env node
/**
 * Russian for the practice questions of the country packs.
 *
 * These questions are not lesson text, so check-ru-country-translations and
 * its siblings would call every one of these keys an orphan and refuse them.
 * They reach a reader all the same, in three places: ukSessionQuizzes folds
 * the UK bank into the stepped lesson, and UkPracticeView and UkTestView —
 * both shared by all seven countries — show every bank. A lesson was being
 * read in Russian and then asking its questions in English.
 *
 * The German sibling lists all six banks because German has all six. Russian
 * is arriving one bank at a time, so BANKS holds the ones a Russian reader
 * can already have. A bank is added to that list on the day its table ships,
 * and from that day this gate refuses to let a single string of it go
 * missing.
 *
 * What this checks, for each bank listed:
 *
 *   - every key is a string the bank really contains, character for
 *     character, because a key one character off is never found and nothing
 *     anywhere reports it;
 *   - every string of the bank has Russian — measured through
 *     translateCourseText, the lookup a reader's tap goes through, so a
 *     string another table already answers counts and is not duplicated here;
 *   - no key of a bank table is also a key of another Russian table, which
 *     would be a silent collision in the single object they are spread into;
 *   - the words the exam itself asks for survive into the Russian;
 *   - no value is empty, and no sentence came back identical to its source.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents:
      'export { UK_QUESTIONS } from "./src/lib/ukQuestionBank.ts";\n' +
      'export { DE_QUESTIONS } from "./src/lib/deQuestionBank.ts";\n' +
      'export { UK_QUESTION_BANK_RU } from "./src/lib/ukQuestionBankTranslationsRu.ts";\n' +
      'export { DE_QUESTION_BANK_RU } from "./src/lib/deQuestionBankTranslationsRu.ts";\n' +
      'export { LIFE_IN_THE_UK_RU } from "./src/lib/lifeInTheUkTranslationsRu.ts";\n' +
      'export { LEBEN_IN_DEUTSCHLAND_RU } from "./src/lib/lebenInDeutschlandTranslationsRu.ts";\n' +
      'export { VIVRE_EN_FRANCE_RU } from "./src/lib/vivreEnFranceTranslationsRu.ts";\n' +
      'export { VIVERE_IN_ITALIA_RU } from "./src/lib/vivereInItaliaTranslationsRu.ts";\n' +
      'export { VIVIR_EN_ESPANA_RU } from "./src/lib/vivirEnEspanaTranslationsRu.ts";\n' +
      'export { ZYCIE_W_POLSCE_RU } from "./src/lib/zycieWPolsceTranslationsRu.ts";\n' +
      'export { translateCourseText } from "./src/lib/courseTranslation.ts";',
    resolveDir: root,
    sourcefile: "ru-bank-translation-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("ru-bank-translation-check", module);
compiled.filename = path.join(root, ".ru-bank-translation-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const M = compiled.exports;

/** The Russian tables a bank table must NOT share a key with. */
const COURSE_TABLES = [
  ["Life in the UK", M.LIFE_IN_THE_UK_RU],
  ["Leben in Deutschland", M.LEBEN_IN_DEUTSCHLAND_RU],
  ["Vivre en France", M.VIVRE_EN_FRANCE_RU],
  ["Vivere in Italia", M.VIVERE_IN_ITALIA_RU],
  ["Vivir en Espana", M.VIVIR_EN_ESPANA_RU],
  ["Zycie w Polsce", M.ZYCIE_W_POLSCE_RU],
];

const BANKS = [
  {
    label: "Life in the UK",
    questions: M.UK_QUESTIONS,
    table: M.UK_QUESTION_BANK_RU,
    symbol: "UK_QUESTION_BANK_RU",
    // Where LIFE_IN_THE_UK_RU draws the line, and the bank has to draw it in
    // the same place: the lesson and its questions are read one after the
    // other, and a word glossed two ways between them teaches nothing.
    //
    // This list is the half that stays ENGLISH — what a reader meets printed
    // on a form or a doorplate and nowhere else. The half that becomes
    // Russian is not checked here: an institution Russian has a name for is
    // caught by the no-Russian rule above if it goes missing, and its
    // declension would make a literal needle accuse a correct sentence.
    keep: [
      "NHS",
      "National Insurance",
      "council tax",
      "Equality Act 2010",
      "Human Rights Act 1998",
      "GCSE",
    ],
  },
  {
    label: "Leben in Deutschland",
    questions: M.DE_QUESTIONS,
    table: M.DE_QUESTION_BANK_RU,
    symbol: "DE_QUESTION_BANK_RU",
    // The same line as LEBEN_IN_DEUTSCHLAND_RU draws, and again only the half
    // that stays GERMAN is checked here: the words a reader meets printed on
    // a form. What Russian has a name for — Основной закон, федеральный
    // канцлер, Бундестаг — is left to the no-Russian rule above, because
    // Russian declines those and a literal needle would accuse a correct
    // sentence for writing Основным законом.
    keep: [
      "Standesamt",
      "Kindergeld",
      "Elterngeld",
      "Bürgergeld",
    ],
  },
];

const failures = [];

// A translation identical to its source is a forgotten paste — unless the
// source is a name or a title. Only a SENTENCE that came back unchanged is
// suspicious, so this asks for final punctuation or real length.
//
// A title is not a sentence even when it ends in a full stop or an
// exclamation mark: "Rule, Britannia!" is "Rule, Britannia!" in Russian too,
// and demanding a difference would only invite a worse answer. Title Case is
// the test — every word that carries letters begins with a capital, apart
// from the short joining words a title leaves in lower case.
const JOINING = new Set([
  "a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to",
  "de", "des", "du", "la", "le", "les", "et", "en",
]);
const looksLikeTitle = (text) => {
  const words = text.replace(/[.!?,]/g, " ").split(/\s+/).filter(Boolean);
  return words.length > 1 && words.every((word) => JOINING.has(word) || /^[A-Z]/.test(word));
};
const looksLikeSentence = (text) => {
  const trimmed = text.trim();
  if (looksLikeTitle(trimmed)) return false;
  const words = trimmed.split(/\s+/).length;
  return (words > 1 && /[.!?]$/.test(trimmed)) || words > 6;
};

const counts = [];
for (const { label, questions, table, symbol, keep } of BANKS) {
  const inBank = new Set();
  for (const question of questions) {
    const add = (text) => {
      if (typeof text === "string" && text.trim()) inBank.add(text.trim());
    };
    add(question.q);
    for (const option of question.options) add(option);
    add(question.explanation);
  }

  const orphans = Object.keys(table).filter((key) => !inBank.has(key));
  if (orphans.length) {
    failures.push(
      `${label}: ${orphans.length} key(s) match no question in the bank, so they can never be shown:\n` +
        orphans.slice(0, 8).map((key) => `      ${JSON.stringify(key.slice(0, 90))}`).join("\n")
    );
  }

  const noRussian = [...inBank].filter((source) => M.translateCourseText(source, "ru") === null);
  if (noRussian.length) {
    failures.push(
      `${label}: ${noRussian.length} question string(s) have no Russian at all, in this table or any other:\n` +
        noRussian.slice(0, 8).map((text) => `      ${JSON.stringify(text.slice(0, 90))}`).join("\n")
    );
  }

  for (const [other, otherTable] of COURSE_TABLES) {
    const shared = Object.keys(table).filter((key) => key in otherTable);
    if (shared.length) {
      failures.push(
        `${label}: ${shared.length} key(s) are also in the Russian table of ${other}. Both are spread ` +
          "into one object, so whichever spread runs last decides the wording for both — drop them here:\n" +
          shared.slice(0, 6).map((key) => `      ${JSON.stringify(key.slice(0, 80))}`).join("\n")
      );
    }
  }

  for (const term of keep) {
    const withTerm = Object.entries(table).filter(([key]) => key.includes(term));
    const dropped = withTerm.filter(([, value]) => !value.includes(term));
    if (withTerm.length >= 3 && dropped.length > withTerm.length / 2) {
      failures.push(
        `${label}: ${dropped.length} of ${withTerm.length} entries mentioning "${term}" no longer carry it. ` +
          "A reader meets that one on a form, so it stays in the bank's own language:\n" +
          dropped.slice(0, 4).map(([key]) => `      ${JSON.stringify(key.slice(0, 80))}`).join("\n")
      );
    }
  }

  const empty = Object.entries(table).filter(([, value]) => !String(value).trim());
  if (empty.length) failures.push(`${label}: ${empty.length} entries have an empty translation`);

  const untranslated = Object.entries(table)
    .filter(([key, value]) => key === value && looksLikeSentence(key));
  if (untranslated.length) {
    failures.push(
      `${label}: ${untranslated.length} sentence(s) are identical to their source, which is a paste that was never translated: ` +
        untranslated.slice(0, 4).map(([key]) => JSON.stringify(key.slice(0, 60))).join(", ")
    );
  }

  // A bank table nobody spread into the lookup would pass every check above
  // and still show a reader nothing, so make sure it is registered.
  const registered = require("fs").readFileSync(path.join(root, "src/lib/courseTranslation.ts"), "utf8");
  if (!registered.includes(`...${symbol}`)) {
    failures.push(`${symbol} is never spread into TRANSLATIONS.ru, so nothing in it can ever be found`);
  }

  const here = Object.keys(table).length;
  counts.push(
    `${label} ${questions.length} questions / ${inBank.size} strings ` +
      `(${here} here, ${inBank.size - here} from a course table)`
  );
}

if (failures.length) {
  console.error("FAIL check-ru-bank-translation");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  "check-ru-bank-translation: " +
    counts.join("; ") +
    " — all reachable in Russian, every key matches a real question and no table collides with another"
);
