const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

/**
 * The Greek script switch, held to the rules it was built on.
 *
 * WHY A GATE AND NOT A COMMENT. As with the Russian switch, every rule below
 * is invisible to reading the code: each one type-checks, runs and looks
 * right while broken. Greek is harder than Russian besides, because its
 * spelling does not say what it sounds like letter by letter — greekScript.ts
 * reads a word into sounds first, and a rule that misreads μπ or γι changes
 * what thousands of cards teach without a single error anywhere.
 *
 * THE RULES:
 *
 *   1. EVERY GREEK WORD CAN BE READ IN LATIN, AND TYPED. Every word in the
 *      table transcribes completely, in all six languages, into letters that
 *      language's own keyboard has. Only Greek is stored — check-greek-table
 *      refuses a Latin word the German card does not carry — so this is the
 *      whole of what the Latin setting can show.
 *
 *   2. THE TABLES PRODUCE THE FORMS THEY WERE BUILT TO. Polish against the
 *      examples the Polish commission on geographical names (KSNG) prints in
 *      its own rules for Greek; the other five against forms chosen one per
 *      rule, so a well-meant tidy-up of one row cannot quietly change what a
 *      learner is taught.
 *
 *   3. THE INTERFACE LANGUAGE CHOOSES THE TRANSCRIPTION.
 *
 *   4. WHAT IS ON SCREEN IS A RIGHT ANSWER. On the Latin setting, typing the
 *      transcription shown — with or without its accents — is a clean answer,
 *      so the lesson moves on by itself as it does in every other course.
 *      Held over a sample of the whole table, in all six languages.
 *
 *   5. THE GREEK IS ALWAYS RIGHT, AND A SLIP IS NOT A MISTAKE. Progress hangs
 *      on the Greek, never on its display.
 *
 *   6. THE SWITCH REACHES THE SCREEN: the badge, the key row, the course
 *      picker and the sentence all ask the one place that knows.
 */

const root = path.resolve(__dirname, "..");

const result = esbuild.buildSync({
  stdin: {
    contents: [
      'export * from "./src/lib/greekScript.ts";',
      'export { matchGreekAnswer } from "./src/lib/greekTextMatch.ts";',
      'export { GREEK_BY_GERMAN } from "./src/lib/greekTranslations.ts";',
      'export { gapTranscriptionIsComplete, matchesGapTranscription } from "./src/lib/gapFill.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "greek-script-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("greek-script-check", module);
compiled.filename = path.join(root, ".greek-script-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  formatGreekText,
  gapTranscriptionIsComplete,
  GREEK_BY_GERMAN,
  greekScriptAfterToggle,
  greekScriptShows,
  greekSecondLine,
  greekVoiceLang,
  latiniseGreek,
  matchesGapTranscription,
  matchGreekAnswer,
  resolveGreekScript,
} = compiled.exports;

const LANGUAGES = ["de", "en", "fr", "pl", "es", "it"];

const failures = [];
function check(label, run) {
  try {
    run();
    console.log("ok   " + label);
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
    console.log("FAIL " + label);
  }
}

const values = [...new Set(Object.values(GREEK_BY_GERMAN).map((value) => String(value ?? "")))];

// ---------------------------------------------------------------- rule 1
check(`every Greek word in the ${values.length.toLocaleString("en-GB")} cards transcribes into typeable letters`, () => {
  /**
   * Word by word rather than card by card: the transcription copies
   * everything that is not a Greek letter through untouched, so the words
   * are the whole of what can go wrong, and there are far fewer of them.
   *
   * Accents are allowed where the language marks stress with them, ï in
   * French and the hyphen of the German s-ch — the grader folds all three
   * away, and what is left must be the plain letters every keyboard has.
   */
  const WORD = /(?:(?=\p{Script=Greek})\p{L})+/gu;
  const ALLOWED = {
    de: /^[a-záéíóú-]+$/i,
    en: /^[a-záéíóú]+$/i,
    fr: /^[a-záéíóúï]+$/i,
    pl: /^[a-z]+$/i,
    es: /^[a-záéíóú]+$/i,
    it: /^[a-záéíóú]+$/i,
  };
  const words = new Set();
  for (const value of values) {
    for (const word of value.normalize("NFC").match(WORD) ?? []) words.add(word);
  }
  assert.ok(words.size > 5000, `only ${words.size} distinct Greek words — the table did not load`);
  const offenders = [];
  for (const word of words) {
    for (const language of LANGUAGES) {
      const latin = latiniseGreek(word, language);
      const plain = latin.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/-/g, "");
      if (!latin || !ALLOWED[language].test(latin) || !/^[a-z]+$/i.test(plain)) {
        offenders.push(`${language} ${word} -> "${latin}"`);
      }
    }
  }
  assert.strictEqual(
    offenders.length,
    0,
    "these come out with a letter left over, or one the learner's keyboard does not have: "
    + offenders.slice(0, 8).join("; ")
  );
});

check("every letter of the Greek alphabet is read as a sound", () => {
  /**
   * The check above cannot see a letter that goes missing: a word without its
   * ψ is still a word of typeable letters. Read on its own, a letter the
   * tables have lost comes out as nothing at all.
   */
  const missing = [];
  for (const letter of "αβγδεζηθικλμνξοπρσςτυφχψω") {
    for (const language of LANGUAGES) {
      if (!latiniseGreek(letter, language)) missing.push(`${language} ${letter}`);
    }
  }
  assert.strictEqual(missing.length, 0, "these letters are read as nothing: " + missing.join(", "));
});

check("the Greek setting shows the card exactly as it is stored", () => {
  for (const value of values.filter((_, index) => index % 50 === 0)) {
    assert.strictEqual(formatGreekText(value, "greek", "de"), value, `"${value}" changed on the Greek setting`);
    assert.strictEqual(formatGreekText(value, "both", "de"), value, `"${value}" changed above the line on the both setting`);
    assert.strictEqual(greekSecondLine(value, "greek", "de"), null, `"${value}" grew a second line on the Greek setting`);
  }
  assert.strictEqual(formatGreekText("Καλημέρα!", "latin", "de"), "Kaliméra!");
  assert.strictEqual(greekSecondLine("Καλημέρα!", "both", "de"), "Kaliméra!");
  assert.strictEqual(greekSecondLine("η κάρτα SIM", "latin", "de"), null, "a second line appeared on the Latin setting");
  assert.strictEqual(latiniseGreek("η κάρτα SIM", "de"), "i kárta SIM", "Latin already in the card was not copied through");
  assert.strictEqual(latiniseGreek("Πού είναι;", "en"), "Poú íne?", "the Greek question mark was not put back as ?");
});

// ---------------------------------------------------------------- rule 2
/**
 * Polish: KSNG's own examples for its Greek rules — w for β, t for θ, ki and
 * gi before an e sound, j for the γ of γεια, ij for a stressed i before a
 * vowel, doubled letters written once, and no accents at all.
 */
const KSNG = [
  ["Κέρκυρα", "Kierkira"], ["Χαιρώνεια", "Chieronia"], ["Ιωάννινα", "Joanina"], ["Άγιο Όρος", "Ajo Oros"],
  ["Αίγινα", "Ejina"], ["Βεργίνα", "Werjina"], ["Πολύγυρος", "Polijiros"], ["Γύθειο", "Jitio"],
  ["Γιάρος", "Jaros"], ["Πλαγιάρι", "Plajari"], ["Άγγελος", "Angielos"], ["Κιάτο", "Kiato"],
  ["Μουρνιές", "Murnies"], ["Τρίκαλα", "Trikala"], ["Παραλία", "Paralija"], ["Μακεδονία", "Makiedonija"],
  ["Ίος", "Ijos"], ["Αργολίδα", "Argolida"], ["Γρεβενά", "Grewena"], ["Γερακοβούνι", "Jerakowuni"],
  ["Αιγές", "Ejes"], ["Αιγαίο", "Ejeo"], ["Καισαριανή", "Kiesariani"], ["Πόρτο Χέλι", "Porto Chieli"],
  ["Κερκίνη", "Kierkini"], ["Κύλληνη", "Kilini"], ["Αττική", "Atiki"], ["Μονή Αγίου Στεφάνου", "Moni Ajiu Stefanu"],
  ["Κουνουπιδιανά", "Kunupidiana"],
].map(([greek, latin]) => ["pl", greek, latin]);

/**
 * The other five, one row per rule they were built to: how each writes β, δ,
 * χ, the γ of γεια and the γ of Γιώργος, ου, ξ, a doubled letter, σ between
 * vowels, the nasal of πέντε, the σχ that must not read as one sound, and
 * the γγν of συγγνώμη, which is one γ.
 */
const PINNED = [
  ["de", "Ευχαριστώ", "Efcharistó"], ["de", "Γεια σου", "Ja su"], ["de", "Βοήθεια", "Woíthia"],
  ["de", "Δεν καταλαβαίνω", "Dhen katalawéno"], ["de", "το σχολείο", "to s-cholío"], ["de", "Γιώργος", "Jórghos"],
  ["de", "θάλασσα", "thálassa"], ["de", "Βασίλης", "Wassílis"], ["de", "ξέρω", "xéro"], ["de", "τζατζίκι", "dsadsíki"],
  ["en", "Ευχαριστώ", "Efharistó"], ["en", "Γεια σου", "Ya sou"], ["en", "Πού είναι η τουαλέτα;", "Poú íne i toualéta?"],
  ["en", "το σχολείο", "to skholío"], ["en", "αύριο", "ávrio"], ["en", "μπύρα", "bíra"], ["en", "πέντε", "pénde"],
  ["en", "συγγνώμη", "sighnómi"], ["en", "ξέρω", "kséro"], ["en", "έλεγχος", "élenhos"], ["en", "ΑΘΗΝΑ", "ATHINA"],
  ["fr", "Ευχαριστώ", "Efkharistó"], ["fr", "Όχι", "Ókhi"], ["fr", "Δεν καταλαβαίνω", "Den katalavéno"],
  ["fr", "Άγγελος", "Ánguelos"], ["fr", "Βασίλης", "Vassílis"], ["fr", "το τσάι", "to tsáï"], ["fr", "προϊόν", "proïón"],
  ["es", "Ευχαριστώ", "Efjaristó"], ["es", "Όχι", "Óji"], ["es", "το σχολείο", "to sjolío"], ["es", "Άγγελος", "Ánguelos"],
  ["es", "θάλασσα", "thálasa"], ["es", "Ελλάδα", "Eláda"], ["es", "Γιώργος", "Yórgos"],
  ["it", "Ευχαριστώ", "Efcharistó"], ["it", "Γεια σου", "Ja su"], ["it", "Άγγελος", "Ánghelos"],
  ["it", "γνωρίζω", "ghnorízo"], ["it", "ξέρω", "xéro"], ["it", "το σχολείο", "to scholío"],
];

check(`all ${KSNG.length} KSNG examples and ${PINNED.length} pinned forms still come out right`, () => {
  const wrong = [...KSNG, ...PINNED]
    .map(([language, greek, expected]) => [language, greek, expected, latiniseGreek(greek, language)])
    .filter(([, , expected, got]) => got !== expected);
  assert.strictEqual(
    wrong.length,
    0,
    wrong.map(([language, greek, expected, got]) => `${language} ${greek}: got "${got}", expected "${expected}"`).join("; ")
  );
});

// ---------------------------------------------------------------- rule 3
check("the interface language decides the transcription", () => {
  const seen = new Set(LANGUAGES.map((language) => latiniseGreek("Ευχαριστώ", language)));
  assert.ok(
    seen.size >= 5,
    `six languages produced only ${seen.size} spellings of Ευχαριστώ — a table has been pointed at another table's rules`
  );
  assert.strictEqual(latiniseGreek("Βοήθεια", "de"), "Woíthia");
  assert.strictEqual(latiniseGreek("Βοήθεια", "en"), "Voíthia");
  // Portuguese and Russian readers are given the English letters for now.
  assert.strictEqual(latiniseGreek("Ευχαριστώ", "pt"), latiniseGreek("Ευχαριστώ", "en"));
  assert.strictEqual(latiniseGreek("Ευχαριστώ", "ru"), latiniseGreek("Ευχαριστώ", "en"));
});

// ---------------------------------------------------------------- rule 4
check("on the Latin setting the transcription on screen is a clean answer, card after card", () => {
  const sample = values.filter((_, index) => index % 10 === 0);
  const offenders = [];
  for (const value of sample) {
    for (const language of LANGUAGES) {
      const shown = latiniseGreek(value, language);
      const plain = shown.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      for (const [script, typed] of [["latin", shown], ["both", shown], ["latin", plain]]) {
        const match = matchGreekAnswer(typed, value, script, language);
        if (!match.ok || match.spellingNote || match.capitalizationError) {
          offenders.push(`${language}/${script} "${typed}" for ${value}: ${JSON.stringify(match)}`);
        }
      }
    }
  }
  assert.strictEqual(
    offenders.length,
    0,
    "typing exactly what the card shows is not a clean answer, so the lesson waits for a Check that "
    + "every other course does without: " + offenders.slice(0, 5).join("; ")
  );
});

check("accents and an opening small letter are not asked for", () => {
  const plain = matchGreekAnswer("kalimera", "Καλημέρα!", "latin", "de");
  assert.ok(plain.ok && !plain.spellingNote, `kalimera on the Latin setting: ${JSON.stringify(plain)}`);
});

check("a blank read in Latin letters is filled in Latin letters", () => {
  assert.ok(matchesGapTranscription("scholio", ["s-cholío"]), "the German s-ch asked for a hyphen, or for two words");
  assert.ok(matchesGapTranscription("s-cholio", ["s-cholío"]), "typing the hyphen shown was refused");
  assert.ok(matchesGapTranscription("athina scholio", ["s-cholío", "Athína"]), "two blanks in either order were refused");
  assert.ok(!matchesGapTranscription("athina", ["s-cholío"]), "a different word filled the blank");
  assert.ok(gapTranscriptionIsComplete(["scholio", ""], 0, ["s-cholío", "Athína"]),
    "a finished Latin word does not hand the caret on to the next blank");
});

// ---------------------------------------------------------------- rule 5
check("the Greek is always a right answer, whichever script is on", () => {
  for (const script of ["greek", "latin", "both"]) {
    for (const language of LANGUAGES) {
      const match = matchGreekAnswer("Καλημέρα!", "Καλημέρα!", script, language);
      assert.ok(match.ok && !match.spellingNote, `typing the stored Greek was not clean in ${script}/${language}`);
    }
  }
});

check("on the Greek setting Latin letters are still the word, with a note", () => {
  const match = matchGreekAnswer("Kalimera", "Καλημέρα!", "greek", "de");
  assert.ok(match.ok, "the transcription was crossed out on the Greek setting");
  assert.ok(match.spellingNote, "it passed without saying that the lesson asked for Greek");
});

check("another language's transcription and a capital inside the line are slips", () => {
  const english = matchGreekAnswer("Efharisto", "Ευχαριστώ!", "latin", "de");
  assert.ok(english.ok && english.spellingNote, `the English spelling in a German app: ${JSON.stringify(english)}`);
  // w for β is no Greeklish anybody types, so only the German table knows it.
  const german = matchGreekAnswer("Woithia", "Βοήθεια", "latin", "en");
  assert.ok(german.ok && german.spellingNote, `the German spelling in an English app: ${JSON.stringify(german)}`);
  const capital = matchGreekAnswer("to Scholio", "το σχολείο", "latin", "de");
  assert.ok(capital.ok && capital.spellingNote, `a capital inside the line: ${JSON.stringify(capital)}`);
});

check("a wrong word is still wrong", () => {
  assert.ok(!matchGreekAnswer("Kalispera", "Καλημέρα!", "latin", "de").ok);
  assert.ok(!matchGreekAnswer("Kalimera", "Καληνύχτα", "latin", "de").ok);
  assert.ok(!matchGreekAnswer("Καληνύχτα", "Καλημέρα!", "latin", "de").ok);
});

check("the voice speaks Greek whatever is on the screen", () => {
  assert.strictEqual(greekVoiceLang(), "el-GR");
});

check("auto means Greek on a Greek device and Latin letters everywhere else", () => {
  const saved = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const pretend = (languages) => Object.defineProperty(globalThis, "navigator", {
    value: { language: languages[0], languages }, configurable: true, writable: true,
  });
  try {
    pretend(["el-GR", "en"]);
    assert.strictEqual(resolveGreekScript("auto"), "greek", "a Greek device was shown a transcription of its own alphabet");
    pretend(["de-DE", "en"]);
    assert.strictEqual(resolveGreekScript("auto"), "latin", "a German device opened on the Greek alphabet");
  } finally {
    if (saved) Object.defineProperty(globalThis, "navigator", saved);
    else delete globalThis.navigator;
  }
});

check("the last alphabet cannot be switched off", () => {
  assert.strictEqual(greekScriptAfterToggle("greek", "greek"), "greek");
  assert.strictEqual(greekScriptAfterToggle("latin", "latin"), "latin");
  assert.strictEqual(greekScriptAfterToggle("greek", "latin"), "both");
  assert.strictEqual(greekScriptAfterToggle("both", "greek"), "latin");
  assert.ok(greekScriptShows("both", "greek") && greekScriptShows("both", "latin"));
});

// ---------------------------------------------------------------- rule 6
check("the switch reaches the screen", () => {
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  const shared = read("src/lib/courseScript.ts");
  assert.ok(shared.includes("window.addEventListener(GREEK_SCRIPT_EVENT, sync)"),
    "nothing redraws when the Greek switch is pressed, so the sentence keeps the old alphabet");
  assert.ok(/case "el": return formatGreekText\(/.test(shared), "the shared door does not know Greek");
  const guided = read("src/GuidedSession.tsx");
  assert.ok(guided.includes('data-testid="greek-script-switch"'), "the badge on the typing prompt no longer switches Greek");
  assert.ok(guided.includes("if (!courseShowsNative(language)) return null;"),
    "the Greek key row no longer goes away when Greek is not on screen");
  assert.ok(read("src/components/shared/TappableSentence.tsx").includes("showCourseText(lang, word)"),
    "the lesson sentence no longer asks how its words are drawn");
  assert.ok(/ALPHABET_COURSES[^\n]*greek: "el"/.test(read("src/components/course/CourseSwitcher.tsx")),
    "the course picker lost the Greek latches");
});

if (failures.length) {
  console.error("\nFAIL check-greek-script");
  failures.forEach((failure) => console.error("  " + failure));
  process.exit(1);
}

console.log(
  `\ncheck-greek-script: ${values.length.toLocaleString("en-GB")} Greek cards stored in Greek alone, readable in six `
  + `Latin transcriptions, ${KSNG.length} KSNG examples and ${PINNED.length} pinned forms hold, and grading follows the Greek`
);
// esbuild's service keeps sockets open after buildSync returns.
process.exit(0);
