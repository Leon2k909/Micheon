#!/usr/bin/env node
/**
 * English for the practice questions of the country packs.
 *
 * These questions are not lesson text, so check-en-translations and its
 * siblings would call every one of these keys an orphan and refuse them. They
 * reach a reader all the same, in three places: ukSessionQuizzes folds the UK
 * bank into the stepped lesson, and UkPracticeView and UkTestView — both
 * shared by all seven countries — show every bank. A lesson was being read in
 * English and then asking its questions in German.
 *
 * Life in the UK is not in this list and never will be: its bank is written
 * in English already. The other six are arriving one at a time, so BANKS
 * holds the ones an English reader can already have, and with Zhizn v
 * Rossii that is now all six. A bank was added to the list on the day its
 * table shipped, and from that day this gate refuses to let a single
 * string of it go missing.
 *
 * What this checks, for each bank listed:
 *
 *   - every key is a string the bank really contains, character for
 *     character, because a key one character off is never found and nothing
 *     anywhere reports it;
 *   - every string of the bank has English — measured through
 *     translateCourseText, the lookup a reader's tap goes through, so a
 *     string another table already answers counts and is not duplicated here;
 *   - no key of a bank table is also a key of another English table, which
 *     would be a silent collision in the single object they are spread into;
 *   - the words the exam itself asks for survive into the English;
 *   - no value is empty, and no sentence came back identical to its source.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents:
      'export { DE_QUESTIONS } from "./src/lib/deQuestionBank.ts";\n' +
      'export { PL_QUESTIONS } from "./src/lib/plQuestionBank.ts";\n' +
      'export { IT_QUESTIONS } from "./src/lib/itQuestionBank.ts";\n' +
      'export { ES_QUESTIONS } from "./src/lib/esQuestionBank.ts";\n' +
      'export { FR_QUESTIONS } from "./src/lib/frQuestionBank.ts";\n' +
      'export { RU_QUESTIONS } from "./src/lib/ruQuestionBank.ts";\n' +
      'export { DE_QUESTION_BANK_EN } from "./src/lib/deQuestionBankTranslationsEn.ts";\n' +
      'export { PL_QUESTION_BANK_EN } from "./src/lib/plQuestionBankTranslationsEn.ts";\n' +
      'export { IT_QUESTION_BANK_EN } from "./src/lib/itQuestionBankTranslationsEn.ts";\n' +
      'export { ES_QUESTION_BANK_EN } from "./src/lib/esQuestionBankTranslationsEn.ts";\n' +
      'export { FR_QUESTION_BANK_EN } from "./src/lib/frQuestionBankTranslationsEn.ts";\n' +
      'export { RU_QUESTION_BANK_EN } from "./src/lib/ruQuestionBankTranslationsEn.ts";\n' +
      'export { LEBEN_IN_DEUTSCHLAND_EN } from "./src/lib/lebenInDeutschlandTranslationsEn.ts";\n' +
      'export { VIVRE_EN_FRANCE_EN } from "./src/lib/vivreEnFranceTranslationsEn.ts";\n' +
      'export { VIVERE_IN_ITALIA_EN } from "./src/lib/vivereInItaliaTranslationsEn.ts";\n' +
      'export { VIVIR_EN_ESPANA_EN } from "./src/lib/vivirEnEspanaTranslationsEn.ts";\n' +
      'export { ZYCIE_W_POLSCE_EN } from "./src/lib/zycieWPolsceTranslationsEn.ts";\n' +
      'export { ZHIZN_V_ROSSII_EN } from "./src/lib/zhiznVRossiiTranslationsEn.ts";\n' +
      'export { translateCourseText } from "./src/lib/courseTranslation.ts";',
    resolveDir: root,
    sourcefile: "en-bank-translation-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("en-bank-translation-check", module);
compiled.filename = path.join(root, ".en-bank-translation-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const M = compiled.exports;

/** The English tables a bank table must NOT share a key with. */
const COURSE_TABLES = [
  ["Leben in Deutschland", M.LEBEN_IN_DEUTSCHLAND_EN],
  ["Vivre en France", M.VIVRE_EN_FRANCE_EN],
  ["Vivere in Italia", M.VIVERE_IN_ITALIA_EN],
  ["Vivir en Espana", M.VIVIR_EN_ESPANA_EN],
  ["Zycie w Polsce", M.ZYCIE_W_POLSCE_EN],
  ["Zhizn v Rossii", M.ZHIZN_V_ROSSII_EN],
];

const BANKS = [
  {
    label: "Leben in Deutschland",
    questions: M.DE_QUESTIONS,
    table: M.DE_QUESTION_BANK_EN,
    symbol: "DE_QUESTION_BANK_EN",
    // Where LEBEN_IN_DEUTSCHLAND_EN draws the line, and the bank has to draw
    // it in the same place: the lesson and its questions are read one after
    // the other, and a word glossed two ways between them teaches nothing.
    //
    // This list is the half that stays GERMAN — the law, the office or the
    // benefit the Einbürgerungstest asks for by name, where translating the
    // words would teach the wrong answer. The half that becomes English is
    // not checked here: the separation of powers and the states are caught by
    // the no-English rule above if they go missing, and a literal needle would
    // accuse a correct sentence for declining them.
    //
    // Every term was measured against the finished table first. Landtag,
    // Jugendamt, Ausländerbehörde, Bundesversammlung, Ermächtigungsgesetz,
    // Stasi, Bundeswehr, Minijob, Integrationskurs and Richtlinienkompetenz
    // are each in fewer than three keys and sit under the threshold this gate
    // fires at, so listing them would only be decoration.
    //
    // "Rechtsstaat" is on the list although one of its four keys is really
    // Rechtsstaatlichkeit, the rule of law in general, correctly translated:
    // the needle hides inside the longer word, and one drop out of four is
    // well under the threshold.
    keep: [
      "Grundgesetz",
      "Bundestag",
      "Bundesrat",
      "Bundesregierung",
      "Bundeskanzler",
      "Bundespräsident",
      "Bundesverfassungsgericht",
      "Ministerpräsident",
      "Reichstag",
      "Fraktion",
      "Budgetrecht",
      "Erststimme",
      "Zweitstimme",
      "Volkskammer",
      "Rechtsstaat",
      "Einbürgerungstest",
      "Standesamt",
      "Bürgeramt",
      "Finanzamt",
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
    table: M.PL_QUESTION_BANK_EN,
    symbol: "PL_QUESTION_BANK_EN",
    // The half that stays POLISH, as ZYCIE_W_POLSCE_EN keeps it: the word
    // that IS the answer and that English has no short name for. What
    // English does name takes its English name — the Trybunał Konstytucyjny
    // is the Constitutional Tribunal, a województwo a voivodeship — and that
    // half is left to the no-English rule above, because a literal needle
    // would accuse a correct sentence for declining them.
    //
    // Measured against the finished table first. PESEL, NIP, KRS, CEIDG,
    // liceum and technikum are each in fewer than three keys and sit under
    // the threshold this gate fires at, so listing them would be decoration.
    //
    // Two needles that look as if they belong are deliberately out. "RODO"
    // is the European regulation, and English calls it the GDPR — the lesson
    // does too, so the bank follows. "wojewoda" is the voivode in English,
    // and the whole chapter on the regions would be accused of dropping a
    // word it correctly translated.
    //
    // Sejm and Senat stay in even though three entries appear to drop them:
    // those are "sejmik", the voivodeship assembly, and "Senatorem" and
    // "Senatorów", the person rather than the chamber — the needle hiding
    // inside a longer Polish word, correct English in the value.
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
    ],
  },
  {
    label: "Vivere in Italia",
    questions: M.IT_QUESTIONS,
    table: M.IT_QUESTION_BANK_EN,
    symbol: "IT_QUESTION_BANK_EN",
    // The half that stays ITALIAN, as VIVERE_IN_ITALIA_EN keeps it: the word
    // printed on the form, and the palace the newspapers use in place of the
    // institution. What English already names takes its English name — the
    // Camera dei deputati is the Chamber of Deputies, a comune a commune —
    // and that half is left to the no-English rule above.
    //
    // Measured against the finished table first. questura, liceo, maturità,
    // SPID and CNEL are each in fewer than three keys and sit under the
    // threshold this gate fires at, so listing them would be decoration.
    //
    // "primo" and "secondo" are deliberately absent although they are the two
    // courses of an Italian meal: they hide inside primo grado, primo comma
    // and secondo l'articolo, and a gate watching them would accuse the whole
    // chapter on the courts of dropping a word it never carried.
    keep: [
      "codice fiscale",
      "permesso di soggiorno",
      "INPS",
      "INAIL",
      "CCNL",
      "CGIL",
      "CISL",
      "UIL",
      "Consulta",
      "Quirinale",
      "Montecitorio",
      "Palazzo Madama",
      "Palazzo Chigi",
    ],
  },
  {
    label: "Vivir en España",
    questions: M.ES_QUESTIONS,
    table: M.ES_QUESTION_BANK_EN,
    symbol: "ES_QUESTION_BANK_EN",
    // The half that stays SPANISH, as VIVIR_EN_ESPANA_EN keeps it: the word
    // printed on the form, the custom with no English twin, and castellano,
    // which article 3 uses precisely because the other languages of Spain are
    // Spanish too. What English already names takes its English name — the
    // Defensor del Pueblo is the Ombudsman, a concejal a councillor, the
    // presidente del Gobierno the prime minister — and that half is left to
    // the no-English rule above.
    //
    // Measured against the finished table first. TIE, tapeo, siesta, Cl@ve,
    // IRPF, SEPE, selectividad and matrícula de honor are each in fewer than
    // three keys and sit under the threshold this gate fires at, so listing
    // them would be decoration.
    //
    // Four needles that look as if they belong are deliberately out.
    // "empadronamiento" is the act; the lesson names the paper after the
    // roll, the padrón certificate, and padrón is on the list instead.
    // "convenio" is two different words — the Navarrese funding agreement,
    // which keeps its name, and the convenio colectivo, which is a collective
    // agreement in English. "Estatuto" is the Statute of Autonomy and the
    // Workers' Statute, renamed in both. And "tapa" and "grado" hide inside
    // etapas and grado medio: the needle inside a longer Spanish word, correct
    // English in the value.
    //
    // "Seguridad Social" and "vida laboral" each drop once and stay in. The
    // ministry is called Inclusion and Social Security in English, and a
    // worker's whole working life is the ordinary phrase, not the document.
    keep: [
      "DNI",
      "NIE",
      "Seguridad Social",
      "padrón",
      "arraigo",
      "Cortes",
      "DELE",
      "CCSE",
      "amparo",
      "Instituto Cervantes",
      "concierto",
      "finiquito",
      "vida laboral",
      "sobremesa",
      "Bachillerato",
      "ESO",
      "CGPJ",
      "foral",
      "peseta",
      "Moncloa",
      "Prado",
      ["castellano", "Castilian"],
    ],
  },
  {
    label: "Vivre en France",
    questions: M.FR_QUESTIONS,
    table: M.FR_QUESTION_BANK_EN,
    symbol: "FR_QUESTION_BANK_EN",
    // The half that stays FRENCH, as VIVRE_EN_FRANCE_EN keeps it: the name of
    // the law or the institution the exam asks about, and the words with no
    // English twin. What English already names takes its English name, and
    // those are the pairs below: a mairie is a town hall and has to arrive as
    // one, an Assemblée nationale the National Assembly.
    //
    // Measured against the finished table first. CPAM, PACS, mutuelle and the
    // Journée défense et citoyenneté are each in fewer than three keys and sit
    // under the threshold this gate fires at, so listing them would be
    // decoration.
    //
    // Three needles that look as if they belong are deliberately out. "état
    // civil" and "aide juridictionnelle" are renamed on purpose — the lesson
    // says civil register and legal aid, and a gate watching the French would
    // accuse every correct row. And "maire" hides inside primaire and
    // caisse primaire: the needle inside a longer French word, correct English
    // in the value. mairie, one letter longer, does not hide anywhere.
    //
    // "commune", "département", "député" and "grève" each drop a few times
    // and stay in: a loi commune is a common law, a conseil départemental a
    // departmental council, a député européen a member of the European
    // Parliament, and one option says striking rather than the strike. All are
    // far below the half this gate fires at.
    keep: [
      "laïcité",
      "SMIC",
      "Sécurité sociale",
      "prud'hommes",
      "carte Vitale",
      "Assurance maladie",
      "Défenseur des droits",
      "Conseil constitutionnel",
      "cour d'assises",
      "tribunal correctionnel",
      "Journal officiel",
      "bloc de constitutionnalité",
      "Code civil",
      "baccalauréat",
      "lycée",
      "collège",
      "commune",
      "département",
      "Marianne",
      "Marseillaise",
      "France Travail",
      ["préfecture", "prefecture"],
      ["préfet", "prefect"],
      ["mairie", "town hall"],
      ["Sénat", "Senate"],
      ["Assemblée nationale", "National Assembly"],
      ["Premier ministre", "prime minister"],
      ["député", "deput"],
      ["grève", "strik"],
    ],
  },
  {
    label: "Zhizn v Rossii",
    questions: M.RU_QUESTIONS,
    table: M.RU_QUESTION_BANK_EN,
    symbol: "RU_QUESTION_BANK_EN",
    // Every term here is a pair, and it has to be: a Cyrillic word cannot
    // survive unchanged into an English sentence, so the plain form would
    // match a key and then never find itself in the value. The pair names
    // the source word and the English one it has to arrive as.
    //
    // Measured against the finished table first. SNILS, INN, MROT, EGE,
    // ZAGS, marshrutka, elektrichka, banya and dacha are each in fewer than
    // three keys and sit under the threshold this gate fires at, so listing
    // them would be decoration.
    //
    // Two needles that look as if they belong are out. "дач" hides inside
    // неудачном and удачной, and "Екатерин" inside Екатеринбург, which is
    // Yekaterinburg and not Catherine: the needle inside a longer Russian
    // word, correct English in the value.
    //
    // "перепис" drops twice out of ten and stays in: a census is a census,
    // but the same root also carries the act of writing something over.
    keep: [
      ["Дума", "Duma"],
      ["Совет Федерации", "Federation Council"],
      ["Конституционный Суд", "Constitutional Court"],
      ["субъект", "federal subject"],
      ["Транссиб", "Trans-Siberian"],
      ["отчеств", "patronymic"],
      ["поликлиник", "clinic"],
      ["Кремл", "Kremlin"],
      ["СССР", "USSR"],
      ["ЮНЕСКО", "UNESCO"],
      ["Байкал", "Baikal"],
      ["Ленинград", "Leningrad"],
      ["рубл", "rouble"],
      ["Пушкин", "Pushkin"],
      ["Сибир", "Siberia"],
      ["Волга", "Volga"],
      ["Гагарин", "Gagarin"],
      ["Орд", "Horde"],
      ["крепостно", "serf"],
      ["перепис", "census"],
    ],
  },
];

const failures = [];

// A translation identical to its source is a forgotten paste — unless the
// source is a name or a title. Only a SENTENCE that came back unchanged is
// suspicious, so this asks for final punctuation or real length.
//
// A title is not a sentence even when it ends in a full stop or an
// exclamation mark: "Otto von Bismarck" is "Otto von Bismarck" in English
// too, and demanding a difference would only invite a worse answer. Title
// Case is the test — every word that carries letters begins with a capital,
// apart from the short joining words a name leaves in lower case, in German
// as in English.
const JOINING = new Set([
  "a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to",
  "am", "auf", "der", "die", "das", "im", "ob", "und", "van", "von", "zu", "zur",
  "i", "w", "we", "z", "ze", "na", "do", "od", "po", "pod", "nad",
  "il", "lo", "la", "le", "gli", "dei", "degli", "della", "delle", "di", "da",
  "e", "ed", "un", "una", "al", "alla", "nel", "nella", "dal", "dalla",
  "el", "los", "las", "del", "de", "y", "en", "con", "por", "para",
  "et", "du", "des", "les", "le", "aux", "sur", "sous",
]);
const looksLikeTitle = (text) => {
  const words = text.replace(/[.!?,]/g, " ").split(/\s+/).filter(Boolean);
  return words.length > 1 && words.every((word) => JOINING.has(word) || /^[A-ZÄÖÜ]/.test(word));
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

  const noEnglish = [...inBank].filter((source) => M.translateCourseText(source, "en") === null);
  if (noEnglish.length) {
    failures.push(
      `${label}: ${noEnglish.length} question string(s) have no English at all, in this table or any other:\n` +
        noEnglish.slice(0, 8).map((text) => `      ${JSON.stringify(text.slice(0, 90))}`).join("\n")
    );
  }

  for (const [other, otherTable] of COURSE_TABLES) {
    const shared = Object.keys(table).filter((key) => key in otherTable);
    if (shared.length) {
      failures.push(
        `${label}: ${shared.length} key(s) are also in the English table of ${other}. Both are spread ` +
          "into one object, so whichever spread runs last decides the wording for both — drop them here:\n" +
          shared.slice(0, 6).map((key) => `      ${JSON.stringify(key.slice(0, 80))}`).join("\n")
      );
    }
  }

  for (const entry of keep) {
    // A term the target language keeps unchanged is written once: the string
    // to look for is the same on both sides. A term the lesson deliberately
    // renames — castellano is Castilian, a préfecture a prefecture — gives
    // the pair, so the gate watches the source word and the English one it
    // has to arrive as.
    const [term, kept] = Array.isArray(entry) ? entry : [entry, entry];
    const withTerm = Object.entries(table).filter(([key]) => key.includes(term));
    const dropped = withTerm.filter(([, value]) => !value.includes(kept));
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
    failures.push(`${symbol} is never spread into TRANSLATIONS.en, so nothing in it can ever be found`);
  }

  const here = Object.keys(table).length;
  counts.push(
    `${label} ${questions.length} questions / ${inBank.size} strings ` +
      `(${here} here, ${inBank.size - here} from a course table)`
  );
}

if (failures.length) {
  console.error("FAIL check-en-bank-translation");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  "check-en-bank-translation: " +
    counts.join("; ") +
    " — all reachable in English, every key matches a real question and no table collides with another"
);
