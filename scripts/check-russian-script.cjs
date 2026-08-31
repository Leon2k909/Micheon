const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

/**
 * The Russian script switch, held to the four rules it was built on.
 *
 * WHY A GATE AND NOT A COMMENT. Every rule below is invisible to reading the
 * code: each one type-checks, runs, and looks right while broken. The
 * transcriptions in particular are five tables of thirty-three rows that
 * nobody re-derives by eye — a single edited cell changes what a learner is
 * taught and nothing says so.
 *
 * THE RULES:
 *
 *   1. ONLY CYRILLIC IS STORED. The Latin forms are computed. A Latin letter
 *      appearing in the Russian table means somebody wrote a second spelling
 *      down, and two spellings drift apart — which is the whole reason
 *      russianScript.ts exists rather than a russianLatinTranslations.ts.
 *
 *   2. THE TABLES PRODUCE THE ATTESTED FORMS. Held against names whose Latin
 *      spelling in that language is already settled, including every example
 *      PWN prints in its own rule. This is what stops a well-meant tidy-up of
 *      a rule row from quietly changing Chruschtschow into Chruschtchow.
 *
 *   3. PROGRESS HANGS ON THE CYRILLIC, NEVER ON ITS DISPLAY. Switching script
 *      or interface language may not change what an answer is graded against.
 *
 *   4. THE ENGLISH SWITCH IS NOT INVOLVED. russianScript.ts must not import
 *      englishVariant.ts, and englishVariant.ts must not know about Russian.
 *      The UK/US switch has worked for months and the way it breaks is by
 *      being made general.
 */

const root = path.resolve(__dirname, "..");

const result = esbuild.buildSync({
  stdin: {
    contents: [
      'export * from "./src/lib/russianScript.ts";',
      'export { RUSSIAN_BY_GERMAN } from "./src/lib/russianTranslations.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "russian-script-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("russian-script-check", module);
compiled.filename = path.join(root, ".russian-script-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  latiniseRussian,
  matchRussianAnswer,
  RUSSIAN_ALPHABET,
  RUSSIAN_BY_GERMAN,
  RUSSIAN_SPECIAL_CHARACTERS,
  russianVoiceLang,
} = compiled.exports;

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

// ---------------------------------------------------------------- rule 1
check("only Cyrillic is stored — the table holds no Latin spellings", () => {
  const offenders = Object.entries(RUSSIAN_BY_GERMAN)
    .filter(([, value]) => /[A-Za-z]/.test(value))
    .slice(0, 5);
  assert.strictEqual(
    offenders.length,
    0,
    "these values carry Latin letters, so a second spelling has been written down: "
    + offenders.map(([de, ru]) => `"${de}" -> "${ru}"`).join(", ")
  );
});

check("no two German cards collapse onto one Russian line", () => {
  const byRussian = new Map();
  for (const [de, ru] of Object.entries(RUSSIAN_BY_GERMAN)) {
    byRussian.set(ru, [...(byRussian.get(ru) ?? []), de]);
  }
  const collisions = [...byRussian].filter(([, list]) => list.length > 1);
  assert.strictEqual(
    collisions.length,
    0,
    "a collision marks a wrong card right and never says so: "
    + collisions.map(([ru, list]) => `${ru} <- ${list.join(", ")}`).join("; ")
  );
});

// ---------------------------------------------------------------- rule 2
const ATTESTED = [
  ["de", "Хрущёв", "Chruschtschow"],
  ["de", "Горбачёв", "Gorbatschow"],
  ["de", "Сергеевич", "Sergejewitsch"],
  ["de", "Спасибо", "Spassibo"],
  ["de", "Ильич", "Iljitsch"],
  ["de", "Чехов", "Tschechow"],
  ["de", "Достоевский", "Dostojewski"],
  ["en", "Хорошо", "Khorosho"],
  ["en", "Жена", "Zhena"],
  ["en", "Пушкин", "Pushkin"],
  ["en", "Борщ", "Borshch"],
  ["en", "Дмитрий", "Dmitriy"],
  ["fr", "Хрущёв", "Khrouchtchov"],
  ["fr", "Чехов", "Tchekhov"],
  ["fr", "Пушкин", "Pouchkine"],
  ["fr", "Спасибо", "Spassibo"],
  ["pl", "долгий", "dołgij"],
  ["pl", "лапа", "łapa"],
  ["pl", "стол", "stoł"],
  ["pl", "лысый", "łysyj"],
  ["pl", "липа", "lipa"],
  ["pl", "левый", "lewyj"],
  ["pl", "цена", "cena"],
  ["pl", "жена", "żena"],
  ["pl", "жила", "żyła"],
  ["pl", "жёлтый", "żołtyj"],
  ["pl", "нёс", "nios"],
  ["pl", "орёл", "orioł"],
  ["pl", "ёлка", "jołka"],
  ["pl", "Елена", "Jelena"],
  ["pl", "Коробьин", "Korobjin"],
  ["es", "Пушкин", "Pushkin"],
  ["es", "Сергей", "Serguei"],
  ["es", "Михаил", "Mijail"],
  ["es", "Чехов", "Chejov"],
  ["es", "Нижний", "Nizhni"],
  ["es", "Щедрин", "Schedrin"],
];

check(`all ${ATTESTED.length} attested spellings still come out right`, () => {
  const wrong = ATTESTED
    .map(([lang, source, expected]) => [lang, source, expected, latiniseRussian(source, lang)])
    .filter(([, , expected, got]) => got !== expected);
  assert.strictEqual(
    wrong.length,
    0,
    wrong.map(([lang, source, expected, got]) => `${lang} ${source}: got "${got}", ${expected} is the established form`).join("; ")
  );
});

check("the interface language decides the transcription", () => {
  const seen = new Set(["de", "en", "fr", "pl", "es"].map((lang) => latiniseRussian("Хорошо", lang)));
  assert.ok(
    seen.size >= 4,
    `five languages produced only ${seen.size} spellings of Хорошо — a table has been pointed at another table's rules`
  );
  assert.strictEqual(latiniseRussian("Жена", "de"), "Schena");
  assert.strictEqual(latiniseRussian("Жена", "en"), "Zhena");
});

check("no transcription needs a key the learner cannot type", () => {
  // Diacritics are allowed only where the language writes them natively:
  // French ï, Polish ż and ł. Anything else means a learner is being asked
  // for a character their own keyboard does not carry.
  const allowed = { de: /^[a-z ]*$/i, en: /^[a-z ]*$/i, fr: /^[a-zï ]*$/i, pl: /^[a-zżł ]*$/i, es: /^[a-z ]*$/i };
  const sample = "Пётр Ильич съел жёлтый сыр Здравствуйте борщ цена фотограф";
  for (const [lang, pattern] of Object.entries(allowed)) {
    const out = latiniseRussian(sample, lang);
    assert.ok(pattern.test(out), `${lang} produced "${out}", which carries a character ${lang} does not write`);
  }
});

// ---------------------------------------------------------------- rule 3
check("the Cyrillic is always a right answer, whichever script is on", () => {
  for (const script of ["cyrillic", "latin"]) {
    for (const lang of ["de", "en", "fr", "pl", "es"]) {
      const match = matchRussianAnswer("Хорошо", "Хорошо", script, lang);
      assert.ok(match.ok, `typing the stored Cyrillic was refused in ${script}/${lang}`);
    }
  }
});

check("another language's transcription is a slip, not a wrong answer", () => {
  const match = matchRussianAnswer("Khorosho", "Хорошо", "latin", "de");
  assert.ok(match.ok, "an English-transcription answer was crossed out in a German app");
  assert.ok(match.spellingNote, "it passed without telling the learner which spelling is used here");
});

check("an ambiguous Latin form is accepted and the Cyrillic offered as a note", () => {
  // German writes ж and ш alike, so "Schena" cannot say which it was.
  const match = matchRussianAnswer("Schena", "Жена", "latin", "de");
  assert.ok(match.ok, "the German transcription of the card was marked wrong");
  assert.strictEqual(match.hint, "Жена", "no Cyrillic was offered for a spelling that reads back two ways");
});

check("a wrong word is still wrong", () => {
  assert.ok(!matchRussianAnswer("Muschtschina", "Хорошо", "latin", "de").ok);
  assert.ok(!matchRussianAnswer("Мужчина", "Хорошо", "cyrillic", "de").ok);
});

check("the voice speaks Russian whatever is on the screen", () => {
  assert.strictEqual(russianVoiceLang(), "ru-RU");
});

check("the character row carries the whole alphabet in both cases", () => {
  assert.strictEqual(RUSSIAN_ALPHABET.length, 33, "the Russian alphabet has 33 letters");
  assert.strictEqual(
    RUSSIAN_SPECIAL_CHARACTERS.length,
    66,
    "not one Russian letter is on a foreign keyboard, so the row is the alphabet in both cases"
  );
});

// ---------------------------------------------------------------- rule 4
check("the English variant switch is not part of this", () => {
  const russian = fs.readFileSync(path.join(root, "src/lib/russianScript.ts"), "utf8");
  const english = fs.readFileSync(path.join(root, "src/lib/englishVariant.ts"), "utf8");
  // Imports, not mentions: the file names englishVariant.ts in its opening
  // comment as the thing it was modelled on, which is worth saying and is
  // not a dependency.
  const imports = russian.match(/^\s*import\s[^;]*;/gmu) ?? [];
  assert.ok(
    !imports.some((line) => /englishVariant/.test(line)),
    "russianScript.ts imports from englishVariant.ts — the two switches share nothing on purpose"
  );
  assert.ok(
    !/[Rr]ussian|[Cc]yrillic/.test(english),
    "englishVariant.ts has been taught about Russian; the UK/US switch is meant to stay exactly as it is"
  );
});

if (failures.length) {
  console.error("\nFAIL check-russian-script");
  failures.forEach((failure) => console.error("  " + failure));
  process.exit(1);
}

console.log(
  `\ncheck-russian-script: ${Object.keys(RUSSIAN_BY_GERMAN).length} Russian cards stored in Cyrillic alone, `
  + `${ATTESTED.length} attested spellings hold across five transcriptions, grading follows the Cyrillic, `
  + "and the English variant switch is untouched"
);
