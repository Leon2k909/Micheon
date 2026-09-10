#!/usr/bin/env node
/**
 * French for the practice questions of the country packs.
 *
 * These questions are not lesson text, so check-fr-translations and its
 * siblings would call every one of these keys an orphan and refuse them. They
 * reach a reader all the same, in three places: ukSessionQuizzes folds the UK
 * bank into the stepped lesson, and UkPracticeView and UkTestView — both
 * shared by all seven countries — show every bank. A lesson was being read in
 * French and then asking its questions in English.
 *
 * The German and Polish siblings list all six banks because those languages
 * have all six. French is arriving one bank at a time, so BANKS holds the
 * ones a French reader can already have. A bank is added to that list on the
 * day its table ships, and from that day this gate refuses to let a single
 * string of it go missing.
 *
 * What this checks, for each bank listed:
 *
 *   - every key is a string the bank really contains, character for
 *     character, because a key one character off is never found and nothing
 *     anywhere reports it;
 *   - every string of the bank has French — measured through
 *     translateCourseText, the lookup a reader's tap goes through, so a
 *     string another table already answers counts and is not duplicated here;
 *   - no key of a bank table is also a key of another French table, which
 *     would be a silent collision in the single object they are spread into;
 *   - the words the exam itself asks for survive into the French;
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
      'export { PL_QUESTIONS } from "./src/lib/plQuestionBank.ts";\n' +
      'export { IT_QUESTIONS } from "./src/lib/itQuestionBank.ts";\n' +
      'export { IT_QUESTION_BANK_FR } from "./src/lib/itQuestionBankTranslationsFr.ts";\n' +
      'export { UK_QUESTION_BANK_FR } from "./src/lib/ukQuestionBankTranslationsFr.ts";\n' +
      'export { DE_QUESTION_BANK_FR } from "./src/lib/deQuestionBankTranslationsFr.ts";\n' +
      'export { PL_QUESTION_BANK_FR } from "./src/lib/plQuestionBankTranslationsFr.ts";\n' +
      'export { LIFE_IN_THE_UK_FR } from "./src/lib/lifeInTheUkTranslationsFr.ts";\n' +
      'export { LEBEN_IN_DEUTSCHLAND_FR } from "./src/lib/lebenInDeutschlandTranslationsFr.ts";\n' +
      'export { VIVERE_IN_ITALIA_FR } from "./src/lib/vivereInItaliaTranslationsFr.ts";\n' +
      'export { VIVIR_EN_ESPANA_FR } from "./src/lib/vivirEnEspanaTranslationsFr.ts";\n' +
      'export { ZYCIE_W_POLSCE_FR } from "./src/lib/zycieWPolsceTranslationsFr.ts";\n' +
      'export { ZHIZN_V_ROSSII_FR } from "./src/lib/zhiznVRossiiTranslationsFr.ts";\n' +
      'export { translateCourseText } from "./src/lib/courseTranslation.ts";',
    resolveDir: root,
    sourcefile: "fr-bank-translation-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("fr-bank-translation-check", module);
compiled.filename = path.join(root, ".fr-bank-translation-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const M = compiled.exports;

/** The French tables a bank table must NOT share a key with. */
const COURSE_TABLES = [
  ["Life in the UK", M.LIFE_IN_THE_UK_FR],
  ["Leben in Deutschland", M.LEBEN_IN_DEUTSCHLAND_FR],
  ["Vivere in Italia", M.VIVERE_IN_ITALIA_FR],
  ["Vivir en Espana", M.VIVIR_EN_ESPANA_FR],
  ["Zycie w Polsce", M.ZYCIE_W_POLSCE_FR],
  ["Zhizn v Rossii", M.ZHIZN_V_ROSSII_FR],
];

const BANKS = [
  {
    label: "Life in the UK",
    questions: M.UK_QUESTIONS,
    table: M.UK_QUESTION_BANK_FR,
    symbol: "UK_QUESTION_BANK_FR",
    // Where LIFE_IN_THE_UK_FR draws the line, and the bank has to draw it in
    // the same place: the lesson and its questions are read one after the
    // other, and a word glossed two ways between them teaches nothing.
    //
    // This list is the half that stays ENGLISH — the law, the office or the
    // institution the exam asks for by name, where translating the words
    // would teach the wrong answer. The half that becomes French is not
    // checked here: l'État de droit and les critères protégés are caught by
    // the no-French rule above if they go missing, and a literal needle would
    // accuse a correct sentence for declining them.
    //
    // Every term was measured against the finished table first. Royal Assent,
    // council tax, GCSE, PAYE and the Crown Dependencies are each in fewer
    // than three keys and sit under the threshold this gate fires at, so
    // listing them would only be decoration.
    keep: [
      "NHS",
      "National Insurance",
      "Equality Act 2010",
      "Human Rights Act 1998",
      "House of Commons",
      "House of Lords",
      "Union Flag",
      "Good Friday Agreement",
      "Senedd",
      "Holyrood",
      "Magna Carta",
    ],
  },
  {
    label: "Leben in Deutschland",
    questions: M.DE_QUESTIONS,
    table: M.DE_QUESTION_BANK_FR,
    symbol: "DE_QUESTION_BANK_FR",
    // The half that stays GERMAN, as LEBEN_IN_DEUTSCHLAND_FR keeps it: the
    // Einbürgerungstest is sat in German and asks for these words by name, so
    // a French rendering would teach the wrong answer. The half that becomes
    // French — l'État de droit, la séparation des pouvoirs, les Länder — is
    // left to the no-French rule above, because a literal needle would accuse
    // a correct sentence for declining them.
    //
    // Measured against the finished table first. Bundesversammlung, Stasi,
    // Jugendamt, Ausländerbehörde, Landtag, Minijob, Integrationskurs and
    // Richtlinienkompetenz are each in fewer than three keys and sit under
    // the threshold this gate fires at, so listing them would be decoration.
    keep: [
      "Grundgesetz",
      "Bundestag",
      "Bundesrat",
      "Bundesregierung",
      "Bundeskanzler",
      "Bundespräsident",
      "Bundesverfassungsgericht",
      "Ministerpräsident",
      "Fraktion",
      "Budgetrecht",
      "Erststimme",
      "Zweitstimme",
      "Volkskammer",
      "Standesamt",
      "Bürgeramt",
      "Finanzamt",
      "Agentur für Arbeit",
      "Kindergeld",
      "Elterngeld",
      "Bürgergeld",
      "Arbeitslosengeld",
      "Rundfunkbeitrag",
    ],
  },
  {
    label: "Zycie w Polsce",
    questions: M.PL_QUESTIONS,
    table: M.PL_QUESTION_BANK_FR,
    symbol: "PL_QUESTION_BANK_FR",
    // The half that stays POLISH, as ZYCIE_W_POLSCE_FR keeps it: the word
    // that IS the answer and has no French equivalent. What French does have
    // a name for takes it — the Rada Ministrów is the Conseil des ministres,
    // the Sąd Najwyższy the Cour suprême — and that half is left to the
    // no-French rule above, because Polish declines those and a literal
    // needle would accuse a correct sentence.
    //
    // Measured against the finished table first, and two needles that look
    // as if they belong are deliberately out. "gminy" is the plural where the
    // French writes the singular. "złoty" is the currency in two keys but the
    // adjective for golden in three more — a black eagle on a golden field is
    // not a sum of money, and the needle would accuse the heraldry questions
    // of losing a word they never carried.
    //
    // Sejm and Senat stay in even though two entries each appear to drop
    // them: those two are "sejmik" and "Senatorem", the needle hiding inside
    // a longer Polish word, and both are correctly French in the value.
    keep: [
      "Sejm",
      "Senat",
      "gmina",
      "powiat",
      "Marszałek",
      "Solidarność",
      "REGON",
      "ZUS",
      "NFZ",
      "KRUS",
      "RODO",
    ],
  },
  {
    label: "Vivere in Italia",
    questions: M.IT_QUESTIONS,
    table: M.IT_QUESTION_BANK_FR,
    symbol: "IT_QUESTION_BANK_FR",
    // The half that stays ITALIAN, as VIVERE_IN_ITALIA_FR keeps it: the word
    // that IS the answer and that French has no word for. What French does
    // name takes its French form — the Camera dei deputati is the Chambre des
    // députés, the Quirinale the Quirinal — and that half is left to the
    // no-French rule above.
    //
    // "Consulta" is on the list because a question asking what the Corte
    // costituzionale is commonly called cannot be answered in French.
    //
    // "primo" and "secondo" are deliberately absent although they are the two
    // courses of an Italian meal: they hide inside primo grado and secondo
    // l'articolo, and a gate watching them would accuse the whole chapter on
    // the courts of dropping a word it never carried.
    keep: [
      "codice fiscale",
      "permesso di soggiorno",
      "INPS",
      "INAIL",
      "CCNL",
      "Consulta",
    ],
  },
];

const failures = [];

// A translation identical to its source is a forgotten paste — unless the
// source is a name or a title. Only a SENTENCE that came back unchanged is
// suspicious, so this asks for final punctuation or real length.
//
// A title is not a sentence even when it ends in a full stop or an
// exclamation mark: "Rule, Britannia!" is "Rule, Britannia!" in French too,
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

  const noFrench = [...inBank].filter((source) => M.translateCourseText(source, "fr") === null);
  if (noFrench.length) {
    failures.push(
      `${label}: ${noFrench.length} question string(s) have no French at all, in this table or any other:\n` +
        noFrench.slice(0, 8).map((text) => `      ${JSON.stringify(text.slice(0, 90))}`).join("\n")
    );
  }

  for (const [other, otherTable] of COURSE_TABLES) {
    const shared = Object.keys(table).filter((key) => key in otherTable);
    if (shared.length) {
      failures.push(
        `${label}: ${shared.length} key(s) are also in the French table of ${other}. Both are spread ` +
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
          "The exam asks for that one by name, so it stays in the bank's own language:\n" +
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
    failures.push(`${symbol} is never spread into TRANSLATIONS.fr, so nothing in it can ever be found`);
  }

  const here = Object.keys(table).length;
  counts.push(
    `${label} ${questions.length} questions / ${inBank.size} strings ` +
      `(${here} here, ${inBank.size - here} from a course table)`
  );
}

if (failures.length) {
  console.error("FAIL check-fr-bank-translation");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  "check-fr-bank-translation: " +
    counts.join("; ") +
    " — all reachable in French, every key matches a real question and no table collides with another"
);
