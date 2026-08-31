#!/usr/bin/env node
/**
 * Italian is a course you can actually take, not a row that can be pressed.
 *
 * WHAT THIS IS FOR. This is check-spanish-course written for the sixth reading
 * of the same material, and most of it is there for the same reasons: a
 * table-backed course rests on the narrowing and the swap agreeing with each
 * other, and every way that can fail is silent. A card whose Italian side is
 * blank. An Italian sentence read aloud by a German voice. An Italian answer
 * graded by the German matcher, which calls a lower-case noun a mistake — a
 * rule Italian does not have.
 *
 * WHAT IS DIFFERENT HERE. Nothing about the shape: Italian is meant to reach
 * the whole catalogue exactly as Spanish does, so the question is the same
 * one — "did anything get lost?" — and the answer is pinned against Polish
 * and Spanish rather than against a constant, which makes it self-maintaining
 * and gives it nothing to raise as the tables grow.
 *
 * What is Italian's OWN is the grading, and it is not Spanish's. Spanish can
 * forgive every accent it has, because "cancion" is not a Spanish word.
 * Italian cannot: "e" is and, "è" is is, "si" is if and "sì" is yes. So the
 * accents are forgiven everywhere EXCEPT on that short list of monosyllables,
 * and the checks below pin both halves of that — the forgiving and the not.
 * The doubled consonant is pinned too, because it is the mistake an English
 * or German speaker makes most and the one Italian least tolerates: nonno is
 * a grandfather and nono is ninth.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

function load(entry) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: "italian-entry.ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    write: false,
    logLevel: "silent",
    loader: { ".json": "json" },
  });
  const compiled = new Module("italian-check", module);
  compiled.filename = path.join(root, ".italian-check.cjs");
  compiled.paths = Module._nodeModulePaths(root);
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  return compiled.exports;
}

// A localStorage good enough for the modules that read the direction out of it.
const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  CustomEvent: class {},
};
global.localStorage = global.window.localStorage;

const M = load([
  'export { COURSES } from "./src/lib/courseRegistry.ts";',
  'export { PLANNED_LANGUAGES } from "./src/lib/languageCatalogue.ts";',
  'export { getLearningDirection, setLearningDirection, targetLangTag, targetIsGerman, learningItalian } from "./src/lib/direction.ts";',
  'export { italianFor, italianPart, italianParts, hasItalian, swapStepForItalian, italianMeaningLanguage } from "./src/lib/italianCourse.ts";',
  'export { stepsForLearningDirection } from "./src/lib/learningDirectionStep.ts";',
  'export { matchItalianPhrase, matchItalianMeaning, ITALIAN_SPECIAL_CHARACTERS } from "./src/lib/italianTextMatch.ts";',
  'export { filterPartsForLearningDirection, buildCuratedParts } from "./src/lib/contentBank.ts";',
  'export { allPartBlueprints } from "./src/lib/data.ts";',
  'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
  'export { buildSession } from "./src/session.ts";',
  'export { placementQuestions, PLACEMENT_LEVELS } from "./src/lib/placementTest.ts";',
  'export { courseSides } from "./src/lib/courseLanguages.ts";',
  'export { buildScenarios } from "./src/lib/conversationScenarios.ts";',
  'export { audioLanguageFromTag, isTtsLanguageMuted, setTtsLanguageMuted, getTtsAudioVolume } from "./src/lib/audioMute.ts";',
  'export { learningFlagId } from "./src/lib/learningFlag.ts";',
  'export { translationCount } from "./src/lib/translations.ts";',
  'export { ITALIAN_BY_GERMAN } from "./src/lib/italianTranslations.ts";',
  'export { SPANISH_BY_GERMAN } from "./src/lib/spanishTranslations.ts";',
  'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
  'export { polishFor } from "./src/lib/polishCourse.ts";',
  'export { primeTranslations } from "./src/lib/translations.ts";',
].join("\n"));

// The tables are fetched at runtime so a German-only learner never downloads
// them; here three are wanted at once, and there is no event loop to await one
// on. Polish and Spanish are here because they are the bar Italian is held to.
M.primeTranslations("it", M.ITALIAN_BY_GERMAN);
M.primeTranslations("es", M.SPANISH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

const failures = [];
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures.push(what); }
}

// ── the course is real, and choosing it moves the direction ────────────────
const italian = M.COURSES.find((course) => course.id === "italian");
assert.ok(italian, "Italian is not registered as a course at all");
check("Italian is a selectable, built-in language course",
  italian.kind === "language" && italian.available === true && italian.builtIn === true);
check("and it says what it teaches rather than Coming soon",
  typeof italian.tagline === "string" && !/coming soon/i.test(italian.tagline));
// Everything in the catalogue is drawn only behind "Show more", which is the
// wrong place for a language you can start.
check("it is not also listed as a language that is only planned",
  !M.PLANNED_LANGUAGES.some((language) => language.id === "italian"));

const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
check("choosing Italian sets the learning direction with it",
  shell.includes('else if (courseId === "italian") setLearningDirection("learn-it");'));

M.setLearningDirection("learn-it");
check("the direction survives being stored and read back", M.getLearningDirection() === "learn-it");
check("and the course knows German is not what is being learned",
  M.learningItalian() === true && M.targetIsGerman() === false);
check("the lesson voice is Italian", M.targetLangTag() === "it-IT");
check("the flag is Italian whichever of its two names is stored",
  M.learningFlagId("italian") === "italian" && M.learningFlagId("german") === "italian");

const sides = M.courseSides();
check("the two sides of a card are Italian and a language the learner reads",
  sides.target.code === "it"
  && sides.target.voice === "it-IT"
  && (sides.meaning.code === "de" || sides.meaning.code === "en"));

// A voice with no entry falls back on the server's default, which is German —
// the one failure that would leave every Italian sentence read aloud in German.
const server = fs.readFileSync(path.join(root, "server/index.js"), "utf8");
check("the speech server has an Italian voice to answer with",
  /"it-IT":\s*"it-IT-\w+Neural"/.test(server) && /"it-IT":\s*\[/.test(server));

// ── the audio mixer has an Italian channel of its own ──────────────────────
check("Italian is a language the mixer knows", M.audioLanguageFromTag("it-IT") === "italian");
M.setTtsLanguageMuted("italian", true);
check("muting the Italian voice silences Italian and nothing else",
  M.isTtsLanguageMuted("italian") === true
  && M.getTtsAudioVolume("it-IT") === 0
  && M.getTtsAudioVolume("de-DE") > 0);
M.setTtsLanguageMuted("italian", false);

// ── the catalogue, whole ───────────────────────────────────────────────────
const resolved = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  resolved[key] = M.buildApiPartFromResolved(blueprint, {});
}
const everything = { ...resolved, ...M.buildCuratedParts("learn-it") };
const italianCourseParts = M.filterPartsForLearningDirection(everything, "learn-it");
const germanParts = M.filterPartsForLearningDirection(everything, "learn-de");

const countItems = (parts) => Object.values(parts).reduce((total, part) => total
  + (part.vocab?.length ?? 0)
  + (part.phrases?.length ?? 0)
  + (part.dialogues ?? []).reduce((lines, dialogue) => lines + (dialogue.lines?.length ?? 0), 0), 0);

const italianItems = countItems(italianCourseParts);
const germanItems = countItems(germanParts);
const kept = germanItems ? italianItems / germanItems : 0;

/**
 * The bar is the other complete courses, not a constant.
 *
 * A course that is meant to be the German one entry for entry can lose a
 * thousand cards to one missing key without an error anywhere, and still
 * clear any floor low enough to have been safe to write. So the number is
 * pinned against Polish, which is read from the same catalogue through the
 * same swap: the check has nothing to raise as the tables grow, and it fails
 * the moment Italian falls behind.
 */
const polishParts = M.filterPartsForLearningDirection(everything, "learn-pl");
const polishItems = countItems(polishParts);
check(`the Italian course is not behind the other complete courses (${italianItems.toLocaleString()} against Polish's ${polishItems.toLocaleString()}, out of ${germanItems.toLocaleString()})`,
  italianItems >= polishItems);
check(`and it reaches the German course rather than a corner of it (${(kept * 100).toFixed(1)}%)`,
  kept >= 0.9);
check("it is still the German course read through a table, not a copy of it",
  Object.keys(italianCourseParts).length === Object.keys(germanParts).length);

// The totals above can agree while a scattering of individual cards is missed,
// so the same comparison is made entry by entry: every German string Polish
// can answer, Italian answers too.
const behind = [];
for (const part of Object.values(germanParts)) {
  const german = [
    ...(part.vocab ?? []).map((word) => word.de),
    ...(part.phrases ?? []).map((phrase) => phrase.de),
    ...(part.dialogues ?? []).flatMap((dialogue) => (dialogue.lines ?? []).map((line) => line.de)),
  ];
  for (const text of german) {
    if (M.polishFor(text) && !M.italianFor(text)) behind.push(text);
  }
}
check(`no card is taught in Polish and left untaught in Italian${behind.length ? ` — ${behind.length}, first: "${behind[0]}"` : ""}`,
  behind.length === 0);

// EVERY entry the course serves has to have an answer. Checked exhaustively
// rather than sampled, because "nearly all of it" is exactly what a broken
// lookup looks like from a distance.
let blanks = 0;
let firstBlank = "";
for (const [key, part] of Object.entries(italianCourseParts)) {
  for (const word of part.vocab ?? []) {
    if (!M.italianFor(word.de)) { blanks += 1; firstBlank ||= `${key} vocab "${word.de}"`; }
  }
  for (const phrase of part.phrases ?? []) {
    if (!M.italianFor(phrase.de)) { blanks += 1; firstBlank ||= `${key} phrase "${phrase.de}"`; }
  }
  for (const dialogue of part.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) {
      if (!M.italianFor(line.de)) { blanks += 1; firstBlank ||= `${key} dialogue "${line.de}"`; }
    }
  }
}
check(`no card in the Italian course is missing its Italian${blanks ? ` — ${blanks}, first: ${firstBlank}` : ""}`,
  blanks === 0);

let untranslatedExamples = 0;
for (const part of Object.values(italianCourseParts)) {
  for (const word of part.vocab ?? []) {
    if (word.example && word.example.trim() && !M.italianFor(word.example)) untranslatedExamples += 1;
  }
}
check("and no example sentence is kept that Italian does not reach",
  untranslatedExamples === 0);

// ── a real lesson, built the way the app builds one ────────────────────────
const lessonKey = Object.keys(italianCourseParts).find((key) => (italianCourseParts[key].phrases?.length ?? 0) >= 3);
assert.ok(lessonKey, "no pack has enough Italian phrases to build a lesson from");
const part = { ...italianCourseParts[lessonKey], partKey: lessonKey };
const steps = M.stepsForLearningDirection(M.buildSession(part, [], {}, 0), "learn-it");
const sentenceSteps = steps.filter((step) => step?.type === "sentence");
check("an Italian lesson has cards in it", sentenceSteps.length > 0);
check("every card shows Italian as the thing being learned",
  sentenceSteps.every((step) => typeof step.item.de === "string" && step.item.de.trim().length > 0));
// Guillemets are the one place German is allowed to survive on an Italian
// card — the spelling-alphabet lines quote it on purpose — so they are cut
// out before the umlaut test, exactly as check-italian-table does it.
check("no card is still showing the German it was built from",
  sentenceSteps.every((step) => !/[äöüß]/i.test(String(step.item.de).replace(/«[^»]*»/gu, ""))));
check("every card keeps the German it was built from, so chains and progress still resolve",
  sentenceSteps.every((step) => typeof step.item.originalDe === "string" && step.item.originalDe.trim().length > 0));
check("no card carries the German pronunciation notes, short forms or article beside Italian",
  sentenceSteps.every((step) => step.item.say === undefined
    && step.item.short === undefined
    && step.item.long === undefined
    && step.item.article === undefined));
check("progress ids are untouched, so the German course's grades are not overwritten",
  sentenceSteps.every((step) => typeof step.item.id === "string" && step.item.id.length > 0));

const unreachable = M.stepsForLearningDirection(
  [{ type: "sentence", item: { id: "x", de: "Ein Satz den es nicht gibt.", en: "A sentence that is not there." } }],
  "learn-it"
);
check("a card with no Italian leaves the lesson instead of appearing blank", unreachable.length === 0);

// Two German cards can meet one Italian one. The table was written to avoid it
// where the German really is two different things, but where Italian genuinely
// has one word the survivor has to carry both meanings — or the second card is
// lost and its meaning with it.
const twoGerman = Object.keys(M.ITALIAN_BY_GERMAN).find((german) => (
  Object.keys(M.ITALIAN_BY_GERMAN).some((other) => other !== german
    && M.ITALIAN_BY_GERMAN[other] === M.ITALIAN_BY_GERMAN[german])
));
const twin = twoGerman
  ? Object.keys(M.ITALIAN_BY_GERMAN).find((other) => other !== twoGerman
    && M.ITALIAN_BY_GERMAN[other] === M.ITALIAN_BY_GERMAN[twoGerman])
  : null;
if (twoGerman && twin) {
  const merged = M.italianPart({
    vocab: [],
    dialogues: [],
    phrases: [
      { id: "a", de: twoGerman, en: "First meaning" },
      { id: "b", de: twin, en: "Second meaning" },
    ],
  });
  check("where two German cards meet one Italian word, the survivor keeps both meanings",
    merged.phrases.length === 1
    && merged.phrases[0].en.includes("First meaning")
    && merged.phrases[0].en.includes("Second meaning"));
} else {
  // The table is written so this does not arise, and check-italian-table
  // enforces it. Saying so is better than a silently skipped case.
  check("where two German cards meet one Italian word, the survivor keeps both meanings", true);
}

// A pack's German-only questions are written against a German answer, and
// carrying them into the Italian course would ask for German inside an
// Italian lesson.
check("the German-only question types do not follow the pack into Italian",
  Object.values(italianCourseParts).every((p) => (p.translationQuestions ?? []).length === 0
    && (p.articleQuestions ?? []).length === 0));

// ── grading a typed Italian answer ─────────────────────────────────────────
const accepted = [
  ["Come stai?", "Come stai?"],
  // The accents are not on a keyboard bought in Britain or Germany, and the
  // learner who types these knew the word.
  ["perche", "perché"],
  ["citta", "città"],
  ["caffe", "caffè"],
  // Punctuation is dropped on both sides.
  ["Come ti chiami", "Come ti chiami?"],
  // Italian capitalises sentence starts and proper nouns and nothing else.
  ["casa", "Casa"],
];
const rejected = [
  ["gatto", "cane"],
  // The doubled consonant is a longer sound, not a spelling convention, and
  // every pair below is two everyday words.
  ["nono", "nonno"],
  ["cane", "canne"],
  ["casa", "cassa"],
  ["sete", "sette"],
  // The accent IS the word in these, so it is the one thing not folded.
  ["e", "è"],
  ["si", "sì"],
  ["da", "dà"],
  // The elision apostrophe is not decoration: "un ora" is the masculine
  // article on a feminine noun.
  ["un ora", "un'ora"],
  // Wrong verb: what the lesson is for.
  ["sono bene", "sto bene"],
];
check("a missing accent is a slip, not a wrong answer",
  accepted.every(([typed, target]) => M.matchItalianPhrase(typed, target).ok));
check("and it is reported as a spelling note rather than passing silently",
  M.matchItalianPhrase("perche", "perché").spellingNote === true);
check("a wrong word, a doubled consonant or a dropped accent that changes the word is still wrong",
  rejected.every(([typed, target]) => !M.matchItalianPhrase(typed, target).ok));
check("a lower-case noun is not called a capitalisation mistake",
  M.matchItalianPhrase("casa", "Casa").capitalizationError !== true);
// Italian leaves the subject out unless it is stressing it — the ending
// already says who. That is worth saying, and worth not crossing.
check("a spare subject pronoun is coached rather than marked wrong",
  M.matchItalianPhrase("io vado", "vado").phrasingNote === true);
check("a vocabulary card accepts any of the senses it lists",
  M.matchItalianMeaning("l'abitazione", "la casa, l'abitazione").ok);
check("the character row offers è, the one letter the matcher does not forgive",
  M.ITALIAN_SPECIAL_CHARACTERS.includes("è") && M.ITALIAN_SPECIAL_CHARACTERS.length >= 12);

// ── conversation ───────────────────────────────────────────────────────────
const scenarios = M.buildScenarios(italianCourseParts);
check("the Italian course has conversations to hold", scenarios.length > 0);
check("and every turn in them is Italian",
  scenarios.every((scenario) => scenario.turns.every((turn) => turn.de && turn.de.trim())));
M.setLearningDirection("learn-de");
const germanScenarios = new Map(M.buildScenarios(germanParts).map((s) => [s.id, s]));
M.setLearningDirection("learn-it");
const untranslated = [];
for (const scenario of scenarios) {
  const source = germanScenarios.get(scenario.id);
  if (!source) continue;
  scenario.turns.forEach((turn, index) => {
    const german = source.turns[index]?.de ?? "";
    if (turn.de === german && /[äöüß]/i.test(german)) untranslated.push(german);
  });
}
check(`no turn is still the German it was built from${untranslated.length ? ` — ${untranslated[0]}` : ""}`,
  untranslated.length === 0);

// ── placement ──────────────────────────────────────────────────────────────
const placement = M.placementQuestions("learn-it");
check("the Italian course has its own placement bank", placement.length >= 25);
check("and it can fill a round at every level",
  M.PLACEMENT_LEVELS.every((level) => placement.filter((q) => q.level === level).length >= 5));
// Taken by German speakers and English speakers both, so it has to be
// answerable without either.
check("its options are Italian, so either kind of learner can sit it",
  placement.every((question) => question.options.every((option) => !/[äöüß]/i.test(option))));
// The options render in the order they are written and nothing shuffles them,
// so a bank whose answer is always first can be passed without reading on.
check("and the right answer is not always the first option",
  new Set(placement.map((question) => question.answer)).size >= 3);

M.setLearningDirection("learn-de");

// ── the table-backed courses travel together ───────────────────────────────
//
// French, Polish, Spanish and Italian are built the same way: the catalogue
// stays German and the course looks its own text up. So a file that consults
// one table and not the others is not a style difference, it is a screen that
// answers for three languages and silently falls back to German for the
// fourth.
//
// That is exactly how it went wrong once already, when Practice looked up
// French and let Polish fall through to the German — which is also what the
// German prompt uses, so every candidate was dropped as "same wording on both
// sides" and the screen sat waiting forever. Nothing failed; the build was
// green through all of it.
//
// Named exceptions rather than a pattern, because each one has a reason and a
// new file should have to state its own.
const NOT_ITALIAN = new Set([
  // The other implementations themselves; italianCourse.ts is their twin.
  "src/lib/polishCourse.ts",
  "src/lib/spanishCourse.ts",
]);
const sourceDir = path.join(root, "src");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : /\.tsx?$/.test(entry.name) ? [full] : [];
});
const files = walk(sourceDir)
  .map((file) => ({ rel: path.relative(root, file).replace(/\\/g, "/"), text: fs.readFileSync(file, "utf8") }));

const lopsided = files
  .filter(({ rel, text }) => !NOT_ITALIAN.has(rel) && text.includes("spanishFor(") && !text.includes("italianFor("))
  .map(({ rel }) => rel);
check(
  `every file that looks a phrase up in Spanish looks it up in Italian too${lopsided.length ? ` — ${lopsided.join(", ")}` : ""}`,
  lopsided.length === 0
);

// The same failure one level up: a screen that grades Spanish typing with its
// own comparator and Italian with somebody else's.
const MATCHER_EXEMPT = new Set([
  "src/lib/polishTextMatch.ts",
  "src/lib/frenchTextMatch.ts",
  "src/lib/spanishTextMatch.ts",
]);
const ungraded = files
  .filter(({ rel, text }) => !MATCHER_EXEMPT.has(rel)
    && /matchSpanish(Phrase|Sentence|Meaning)\(/.test(text)
    && !/matchItalian(Phrase|Sentence|Meaning)\(/.test(text))
  .map(({ rel }) => rel);
check(
  `every screen that grades typed Spanish grades typed Italian the same way${ungraded.length ? ` — ${ungraded.join(", ")}` : ""}`,
  ungraded.length === 0
);

if (failures.length) {
  console.error(`\n${failures.length} Italian course regression${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\ncheck-italian-course: ${italianItems.toLocaleString()} cards across `
  + `${Object.keys(italianCourseParts).length} packs from ${M.translationCount("it").toLocaleString()} `
  + "translations — everything Polish teaches, every one of them with an answer."
);

// Writing a setting schedules the shared profile mirror's flush, and the timer
// behind it holds the event loop open long after the last assertion has run.
process.exit(0);
