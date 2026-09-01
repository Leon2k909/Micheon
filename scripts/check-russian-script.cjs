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
check("only Cyrillic is stored — no Latin spelling of a Russian word", () => {
  /**
   * A Latin word is allowed only where the GERMAN card already carries it.
   *
   * The rule being protected is that a Russian word has one stored spelling
   * and the transcriptions are computed. "No Latin at all" was the first way
   * of saying it, and it was too blunt: some cards QUOTE a foreign word —
   * asking how to say birthday in German, or naming Der Kühlschrank — and
   * that word has to survive into the Russian, because it is the thing being
   * asked about.
   *
   * Quoted-from-the-source is the line that separates the two. A transcription
   * like Schena never appears in the German card, so it is still caught; a
   * quotation always does.
   */
  const offenders = [];
  for (const [de, ru] of Object.entries(RUSSIAN_BY_GERMAN)) {
    const source = de.toLowerCase();
    const stray = (ru.match(/[A-Za-z]+/g) ?? []).filter((word) => !source.includes(word.toLowerCase()));
    if (stray.length) offenders.push(`"${de}" -> "${ru}" (${stray.join(", ")})`);
  }
  assert.strictEqual(
    offenders.length,
    0,
    "these carry Latin the German card does not, so a second spelling has been written down: "
    + offenders.slice(0, 5).join("; ")
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

/**
 * The course does not decide the learner's gender.
 *
 * Russian marks gender on the short adjective and on the past tense, so "I am
 * free" is свободен from a man and свободна from a woman, and "I understood"
 * is понял or поняла. German hides the choice — "Ich bin frei" is the same
 * sentence either way — so a translator writes the masculine without noticing
 * and the app has quietly decided who is using it.
 *
 * The Polish course already refuses this; check-polish-interface says nothing
 * may address the reader in the gendered past. Same rule here, and the way out
 * is the same: rewrite rather than pick. "Я свободен" becomes "у меня нет
 * дел", "Рад тебя видеть" becomes "Приятно тебя видеть" — both are what a
 * Russian says anyway.
 *
 * WHAT IS NOT CAUGHT, deliberately: gender ON THE CARD. A card about a Lehrer
 * says учитель, because that is the card, not the reader. Only я and ты are
 * looked at.
 */
/**
 * The gender word lists moved to scripts/russian-gender-words.cjs when a second
 * gate needed them: check-russian-own-cards.cjs holds the Russian-only packs to
 * this same rule, and two copies of a list is one copy going stale.
 */

/**
 * WHAT THIS STILL DOES NOT CATCH: a long-form adjective in direct address —
 * "Ты такой тихий" decides a gender as surely as свободен does. Matching
 * -ый/-ая would reach every adjective in the table, including the ones
 * describing a thing rather than a person, and a gate that cries wolf gets
 * turned off. Those are caught by reading, and this note is here so the next
 * person knows it is a gap rather than a judgement.
 */

/**
 * Somebody else is being talked about, so the gender is theirs, not the
 * reader's. Written as a third-person subject or a name, because those are the
 * two ways a card says "not you": "Он был врачом" is about him, and its был is
 * correct.
 *
 * Asking instead for я or ты to be PRESENT was the first attempt and it let
 * "Рад тебя видеть" through — Russian drops the subject pronoun, so the
 * sentence that addresses the reader most directly is exactly the one that
 * does not name them.
 */
const {
  THIRD_PERSON, MASCULINE_SHORT, FEMININE_SHORT, MASCULINE_PAST, FEMININE_PAST,
} = require("./russian-gender-words.cjs");

check("the course never decides the learner's gender", () => {
  const offenders = [];
  for (const [de, ru] of Object.entries(RUSSIAN_BY_GERMAN)) {
    // A lower-case single word is a dictionary card, not something anybody
    // says: müssen glosses as должен because that is the word, and there is no
    // reader in it to misgender.
    if (!/\s/.test(de.trim()) && de === de.toLocaleLowerCase("de-DE")) continue;
    const words = ru.toLowerCase().replace(/[.,!?;:—–-]/g, " ").split(/\s+/).filter(Boolean);
    if (words.some((word) => THIRD_PERSON.includes(word))) continue;
    /**
     * A name inside the line is somebody else too — but only a capital that
     * is NOT opening a sentence counts as one.
     *
     * Skipping the first word of the WHOLE value was the first version, and a
     * two-sentence card walked straight through it: "Вы не могли бы позвонить?
     * Я всё время был дома" opens its second sentence with Я, the capital read
     * as a name, and the whole card went unchecked. Sentences are split first
     * now, and each one loses only its own opening word.
     */
    const named = ru.split(/(?<=[.!?])\s+/).some((sentence) =>
      sentence.trim().split(/\s+/).slice(1).some((word) => /^[А-ЯЁ]/.test(word)));
    if (named) continue;

    /**
     * The two forms are not caught the same way, because they fail differently.
     *
     * A SHORT ADJECTIVE with no subject named is the reader: nobody writes
     * "Рад тебя видеть" about a third party without saying who. Flagged
     * whether or not я or ты appears — and it usually does not, because
     * Russian drops the pronoun exactly where the address is most direct.
     *
     * A PAST VERB agrees with whatever its subject is, and most subjects are
     * not the reader. "Последний раз был давно" is был agreeing with раз, and
     * flagging it would be asking a translator to avoid the masculine gender
     * of an ordinary noun. So the past tense counts only where я or ты is
     * actually in the sentence.
     */
    const namesReader = words.includes("я") || words.includes("ты");
    /**
     * A short adjective FIRST is the reader — "Рад тебя видеть", predicate
     * first and the subject dropped, which is exactly where Russian leaves the
     * pronoun out. Anywhere else it is agreeing with the noun in front of it:
     * "Первая часть готова" is готова agreeing with часть, and asking a
     * translator to avoid that would be asking them to avoid feminine nouns.
     */
    const shortAdjective = words.find((word) => MASCULINE_SHORT.includes(word) || FEMININE_SHORT.includes(word));
    if (shortAdjective && (namesReader || words[0] === shortAdjective)) {
      offenders.push(`"${de}" -> "${ru}" (${shortAdjective})`);
      continue;
    }
    if (!namesReader) continue;
    const past = words.find((word) => MASCULINE_PAST.includes(word) || FEMININE_PAST.includes(word));
    if (past) offenders.push(`"${de}" -> "${ru}" (${past})`);
  }
  assert.strictEqual(
    offenders.length,
    0,
    "these decide the learner's gender; rewrite them rather than pick one — "
    + offenders.slice(0, 6).join("; ")
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
