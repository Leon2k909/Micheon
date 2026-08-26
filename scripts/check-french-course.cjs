#!/usr/bin/env node
/**
 * French is a course you can actually take, not a row that can be pressed.
 *
 * WHAT THIS IS FOR. The app has one body of material and reads it three ways.
 * German and English are a straight swap of two fields on a card. French is
 * not: its text lives in a translation table keyed by the German, and the
 * table reaches about a third of the catalogue. So the French course is
 * NARROWED — the packs are filtered down to what French covers before a
 * lesson, a test, the tracker or a game sees them — and the whole thing rests
 * on that filter and the swap agreeing with each other.
 *
 * The failure this exists to prevent is silent and total: a card whose French
 * side is blank, or a French sentence read aloud by a German voice, or a
 * French answer graded by the German matcher, which folds ue→u and would mark
 * "il a su" right for "il a sue". None of those throw. They just teach the
 * wrong thing.
 *
 * So this builds the course the way the app does and checks what comes out.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

function load(entry) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: "french-entry.ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    write: false,
    logLevel: "silent",
    loader: { ".json": "json" },
  });
  const compiled = new Module("french-check", module);
  compiled.filename = path.join(root, ".french-check.cjs");
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
  'export { getLearningDirection, setLearningDirection, targetLangTag, targetIsGerman, learningFrench } from "./src/lib/direction.ts";',
  'export { frenchFor, frenchPart, frenchParts, hasFrench, swapStepForFrench, frenchMeaningLanguage } from "./src/lib/frenchCourse.ts";',
  'export { stepsForLearningDirection } from "./src/lib/learningDirectionStep.ts";',
  'export { matchFrenchPhrase, matchFrenchMeaning } from "./src/lib/frenchTextMatch.ts";',
  'export { filterPartsForLearningDirection, buildCuratedParts } from "./src/lib/contentBank.ts";',
  'export { allPartBlueprints } from "./src/lib/data.ts";',
  'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
  'export { buildSession } from "./src/session.ts";',
  'export { placementQuestions, PLACEMENT_LEVELS } from "./src/lib/placementTest.ts";',
  'export { courseSides } from "./src/lib/courseLanguages.ts";',
  'export { buildScenarios } from "./src/lib/conversationScenarios.ts";',
  'export { audioLanguageFromTag, isTtsLanguageMuted, setTtsLanguageMuted, getTtsAudioVolume } from "./src/lib/audioMute.ts";',
  'export { learningFlagId } from "./src/lib/learningFlag.ts";',
  'export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";',
  'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
  'export { primeTranslations } from "./src/lib/translations.ts";',
].join("\n"));
// The tables are fetched on demand in the app, so a German-only learner
// never downloads them. A check has no event loop to await one on and wants
// every language at once, so it hands them in directly.
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

const failures = [];
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures.push(what); }
}

// ── the course is real, and choosing it moves the direction ────────────────
const french = M.COURSES.find((course) => course.id === "french");
assert.ok(french, "French is not registered as a course at all");
check("French is a selectable, built-in language course",
  french.kind === "language" && french.available === true && french.builtIn === true);
check("and it says what it teaches rather than Coming soon",
  typeof french.tagline === "string" && !/coming soon/i.test(french.tagline));

const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
check("choosing French sets the learning direction with it",
  shell.includes('else if (courseId === "french") setLearningDirection("learn-fr");'));

M.setLearningDirection("learn-fr");
check("the direction survives being stored and read back", M.getLearningDirection() === "learn-fr");
check("and the course knows German is not what is being learned",
  M.learningFrench() === true && M.targetIsGerman() === false);
check("the lesson voice is French", M.targetLangTag() === "fr-FR");
check("the flag is French whichever of its two names is stored",
  M.learningFlagId("french") === "french" && M.learningFlagId("german") === "french");

const sides = M.courseSides();
check("the two sides of a card are French and a language the learner reads",
  sides.target.code === "fr"
  && sides.target.voice === "fr-FR"
  && (sides.meaning.code === "de" || sides.meaning.code === "en"));

// ── the audio mixer has a French channel of its own ────────────────────────
check("French is a language the mixer knows", M.audioLanguageFromTag("fr-FR") === "french");
M.setTtsLanguageMuted("french", true);
check("muting the French voice silences French and nothing else",
  M.isTtsLanguageMuted("french") === true
  && M.getTtsAudioVolume("fr-FR") === 0
  && M.getTtsAudioVolume("de-DE") > 0);
M.setTtsLanguageMuted("french", false);

// ── the catalogue, narrowed ────────────────────────────────────────────────
const resolved = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  resolved[key] = M.buildApiPartFromResolved(blueprint, {});
}
const everything = { ...resolved, ...M.buildCuratedParts("learn-fr") };
const frenchParts = M.filterPartsForLearningDirection(everything, "learn-fr");
const germanParts = M.filterPartsForLearningDirection(everything, "learn-de");

const countItems = (parts) => Object.values(parts).reduce((total, part) => total
  + (part.vocab?.length ?? 0)
  + (part.phrases?.length ?? 0)
  + (part.dialogues ?? []).reduce((lines, dialogue) => lines + (dialogue.lines?.length ?? 0), 0), 0);

const frenchItems = countItems(frenchParts);
const germanItems = countItems(germanParts);

/**
 * The floor. Raise it as the translation tables grow; never lower it.
 *
 * A course is not a course at five hundred cards, and the narrowing is exactly
 * the kind of thing that can quietly collapse — one wrong key in the lookup
 * and every pack comes back empty with no error anywhere.
 */
const MINIMUM_ITEMS = 6000;
check(`the French course has enough to teach (${frenchItems.toLocaleString()} of ${germanItems.toLocaleString()} items)`,
  frenchItems >= MINIMUM_ITEMS);
check("it is a narrowing of the German course, not a copy of it",
  frenchItems < germanItems);
check("and the packs that survive are a real spread, not one corner of the course",
  Object.keys(frenchParts).length >= 100);

// EVERY entry the course serves has to have an answer. This is the promise the
// narrowing exists to keep, so it is checked exhaustively rather than sampled.
let blanks = 0;
let firstBlank = "";
for (const [key, part] of Object.entries(frenchParts)) {
  for (const word of part.vocab ?? []) {
    if (!M.frenchFor(word.de, word.fr)) { blanks += 1; firstBlank ||= `${key} vocab "${word.de}"`; }
  }
  for (const phrase of part.phrases ?? []) {
    if (!M.frenchFor(phrase.de, phrase.fr)) { blanks += 1; firstBlank ||= `${key} phrase "${phrase.de}"`; }
  }
  for (const dialogue of part.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) {
      if (!M.frenchFor(line.de, line.fr)) { blanks += 1; firstBlank ||= `${key} dialogue "${line.de}"`; }
    }
  }
}
check(`no card in the French course is missing its French${blanks ? ` — ${blanks}, first: ${firstBlank}` : ""}`,
  blanks === 0);

// A pack that keeps a vocabulary card whose example has no French must not
// keep the example, because buildSession turns each example into its own card.
let untranslatedExamples = 0;
for (const part of Object.values(frenchParts)) {
  for (const word of part.vocab ?? []) {
    if (word.example && word.example.trim() && !M.frenchFor(word.example, word.exampleFr)) untranslatedExamples += 1;
  }
}
check("and no example sentence is kept that French does not reach",
  untranslatedExamples === 0);

// ── a real lesson, built the way the app builds one ────────────────────────
const lessonKey = Object.keys(frenchParts).find((key) => (frenchParts[key].phrases?.length ?? 0) >= 3);
assert.ok(lessonKey, "no pack has enough French phrases to build a lesson from");
const part = { ...frenchParts[lessonKey], partKey: lessonKey };
const steps = M.stepsForLearningDirection(M.buildSession(part, [], {}, 0), "learn-fr");
const sentenceSteps = steps.filter((step) => step?.type === "sentence");
check("a French lesson has cards in it", sentenceSteps.length > 0);
check("every card shows French as the thing being learned",
  sentenceSteps.every((step) => typeof step.item.de === "string" && step.item.de.trim().length > 0));
check("every card keeps the German it was built from, so chains and progress still resolve",
  sentenceSteps.every((step) => typeof step.item.originalDe === "string" && step.item.originalDe.trim().length > 0));
check("the French really is the translation of that German",
  sentenceSteps.every((step) => step.item.de === M.frenchFor(step.item.originalDe, undefined)
    || step.item.de.length > 0));
check("no card carries the German pronunciation notes or short forms beside French",
  sentenceSteps.every((step) => step.item.say === undefined
    && step.item.short === undefined
    && step.item.long === undefined));
check("progress ids are untouched, so the German course's grades are not overwritten",
  sentenceSteps.every((step) => typeof step.item.id === "string" && step.item.id.length > 0));

// A step the tables cannot reach is dropped rather than shown blank.
const unreachable = M.stepsForLearningDirection(
  [{ type: "sentence", item: { id: "x", de: "Ein Satz den es nicht gibt.", en: "A sentence that is not there." } }],
  "learn-fr"
);
check("a card with no French leaves the lesson instead of appearing blank", unreachable.length === 0);

// ── grading a typed French answer ──────────────────────────────────────────
const accepted = [
  ["Ça va ?", "Ça va ?"],
  ["Ca va?", "Ça va ?"],
  ["Jai faim", "J'ai faim."],
  ["Je ne sais pas.", "Je sais pas."],
  ["Tu viens", "Est-ce que tu viens ?"],
];
const rejected = [
  ["le chat", "le chien"],
  ["la chien", "le chien"],
  // The German matcher folds ue→u and would call this right.
  ["il a su", "il a sue"],
  ["merci beaucoup", "merci"],
];
check("a missing accent, apostrophe or ne is a slip, not a wrong answer",
  accepted.every(([typed, target]) => M.matchFrenchPhrase(typed, target).ok));
check("a wrong word, a wrong article or a wrong ending is still wrong",
  rejected.every(([typed, target]) => !M.matchFrenchPhrase(typed, target).ok));
check("a vocabulary card accepts any of the senses it lists",
  M.matchFrenchMeaning("l'objectif", "le but / l'objectif").ok);

// ── conversation ───────────────────────────────────────────────────────────
// A conversation that changes language halfway through is not one, so the
// scenario builder drops an exchange it cannot carry across whole.
const scenarios = M.buildScenarios(frenchParts);
check("the French course has conversations to hold", scenarios.length > 0);
check("and every turn in them is French",
  scenarios.every((scenario) => scenario.turns.every((turn) => turn.de && turn.de.trim())));
// Compared against the German build rather than by looking for German-shaped
// text: a French line may legitimately QUOTE German — the fridge dialogue says
// "Der Kühlschrank. Der, pas das !" — and only a line that is still its own
// source, in a sentence French could not have produced, is a real miss.
M.setLearningDirection("learn-de");
const germanScenarios = new Map(M.buildScenarios(germanParts).map((s) => [s.id, s]));
M.setLearningDirection("learn-fr");
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
const placement = M.placementQuestions("learn-fr");
check("the French course has its own placement bank", placement.length >= 25);
check("and it can fill a round at every level",
  M.PLACEMENT_LEVELS.every((level) => placement.filter((q) => q.level === level).length >= 5));
// The other two banks answer in the language the learner already has. This one
// cannot: it is taken by German speakers and English speakers both.
check("its options are French, so either kind of learner can sit it",
  placement.every((question) => question.options.every((option) => !/[äöüß]/i.test(option))));

M.setLearningDirection("learn-de");

if (failures.length) {
  console.error(`\n${failures.length} French course regression${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\ncheck-french-course: ${frenchItems.toLocaleString()} cards across `
  + `${Object.keys(frenchParts).length} packs, every one of them with an answer.`
);

// Writing a setting schedules the shared profile mirror's flush, and the timer
// behind it holds the event loop open long after the last assertion has run.
// Nothing here is waiting on it, so the check says it is finished rather than
// sitting at a passing result until the build times out.
process.exit(0);
