#!/usr/bin/env node
/**
 * Polish is a course you can actually take, not a row that can be pressed.
 *
 * WHAT THIS IS FOR. This is check-french-course written for the fourth
 * reading of the same material, and it exists for the same reason: a
 * table-backed course rests entirely on the narrowing and the swap agreeing
 * with each other, and every way that can fail is silent. A card whose Polish
 * side is blank. A Polish sentence read aloud by a German voice. A Polish
 * answer graded by the German matcher, which treats a lower-case noun as a
 * mistake — a rule Polish does not have — or by the French one, which strips
 * combining marks and so walks straight past ł.
 *
 * What is Polish's own rather than French's is checked here too: that ł is
 * forgiven, that a lower-case noun is not called a capitalisation error, and
 * that the ó/u and rz/ż pairs are NOT folded together, because "morze" and
 * "może" are a real everyday pair and accepting one for the other would mark
 * a wrong word right.
 *
 * So this builds the course the way the app does and reads what comes out.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

function load(entry) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: "polish-entry.ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    write: false,
    logLevel: "silent",
    loader: { ".json": "json" },
  });
  const compiled = new Module("polish-check", module);
  compiled.filename = path.join(root, ".polish-check.cjs");
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
  'export { getLearningDirection, setLearningDirection, targetLangTag, targetIsGerman, learningPolish } from "./src/lib/direction.ts";',
  'export { polishFor, polishPart, polishParts, hasPolish, swapStepForPolish, polishMeaningLanguage } from "./src/lib/polishCourse.ts";',
  'export { stepsForLearningDirection } from "./src/lib/learningDirectionStep.ts";',
  'export { matchPolishPhrase, matchPolishMeaning, POLISH_SPECIAL_CHARACTERS } from "./src/lib/polishTextMatch.ts";',
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
].join("\n"));

const failures = [];
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures.push(what); }
}

// ── the course is real, and choosing it moves the direction ────────────────
const polish = M.COURSES.find((course) => course.id === "polish");
assert.ok(polish, "Polish is not registered as a course at all");
check("Polish is a selectable, built-in language course",
  polish.kind === "language" && polish.available === true && polish.builtIn === true);
check("and it says what it teaches rather than Coming soon",
  typeof polish.tagline === "string" && !/coming soon/i.test(polish.tagline));
// Everything in the catalogue is drawn only behind "Show more", which is the
// wrong place for a language you can start.
check("it is not also listed as a language that is only planned",
  !M.PLANNED_LANGUAGES.some((language) => language.id === "polish"));

const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
check("choosing Polish sets the learning direction with it",
  shell.includes('else if (courseId === "polish") setLearningDirection("learn-pl");'));

M.setLearningDirection("learn-pl");
check("the direction survives being stored and read back", M.getLearningDirection() === "learn-pl");
check("and the course knows German is not what is being learned",
  M.learningPolish() === true && M.targetIsGerman() === false);
check("the lesson voice is Polish", M.targetLangTag() === "pl-PL");
check("the flag is Polish whichever of its two names is stored",
  M.learningFlagId("polish") === "polish" && M.learningFlagId("german") === "polish");

const sides = M.courseSides();
check("the two sides of a card are Polish and a language the learner reads",
  sides.target.code === "pl"
  && sides.target.voice === "pl-PL"
  && (sides.meaning.code === "de" || sides.meaning.code === "en"));

// A voice with no entry falls back on the server's default, which is German —
// the one failure that would leave every Polish sentence read aloud in German.
const server = fs.readFileSync(path.join(root, "server/index.js"), "utf8");
check("the speech server has a Polish voice to answer with",
  /"pl-PL":\s*"pl-PL-\w+Neural"/.test(server) && /"pl-PL":\s*\[/.test(server));

// ── the audio mixer has a Polish channel of its own ────────────────────────
check("Polish is a language the mixer knows", M.audioLanguageFromTag("pl-PL") === "polish");
M.setTtsLanguageMuted("polish", true);
check("muting the Polish voice silences Polish and nothing else",
  M.isTtsLanguageMuted("polish") === true
  && M.getTtsAudioVolume("pl-PL") === 0
  && M.getTtsAudioVolume("de-DE") > 0);
M.setTtsLanguageMuted("polish", false);

// ── the catalogue, narrowed ────────────────────────────────────────────────
const resolved = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  resolved[key] = M.buildApiPartFromResolved(blueprint, {});
}
const everything = { ...resolved, ...M.buildCuratedParts("learn-pl") };
const polishParts = M.filterPartsForLearningDirection(everything, "learn-pl");
const germanParts = M.filterPartsForLearningDirection(everything, "learn-de");

const countItems = (parts) => Object.values(parts).reduce((total, part) => total
  + (part.vocab?.length ?? 0)
  + (part.phrases?.length ?? 0)
  + (part.dialogues ?? []).reduce((lines, dialogue) => lines + (dialogue.lines?.length ?? 0), 0), 0);

const polishItems = countItems(polishParts);
const germanItems = countItems(germanParts);

/**
 * The floor. Raise it as the translation table grows; never lower it.
 *
 * The narrowing is exactly the kind of thing that can quietly collapse — one
 * wrong key in the lookup and every pack comes back empty with no error
 * anywhere — so the number that proves it did not is pinned.
 */
const MINIMUM_ITEMS = 3000;
check(`the Polish course has enough to teach (${polishItems.toLocaleString()} of ${germanItems.toLocaleString()} items)`,
  polishItems >= MINIMUM_ITEMS);
check("it is a narrowing of the German course, not a copy of it",
  polishItems < germanItems);
check("and the packs that survive are a real spread, not one corner of the course",
  Object.keys(polishParts).length >= 100);

// EVERY entry the course serves has to have an answer. This is the promise the
// narrowing exists to keep, so it is checked exhaustively rather than sampled.
let blanks = 0;
let firstBlank = "";
for (const [key, part] of Object.entries(polishParts)) {
  for (const word of part.vocab ?? []) {
    if (!M.polishFor(word.de)) { blanks += 1; firstBlank ||= `${key} vocab "${word.de}"`; }
  }
  for (const phrase of part.phrases ?? []) {
    if (!M.polishFor(phrase.de)) { blanks += 1; firstBlank ||= `${key} phrase "${phrase.de}"`; }
  }
  for (const dialogue of part.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) {
      if (!M.polishFor(line.de)) { blanks += 1; firstBlank ||= `${key} dialogue "${line.de}"`; }
    }
  }
}
check(`no card in the Polish course is missing its Polish${blanks ? ` — ${blanks}, first: ${firstBlank}` : ""}`,
  blanks === 0);

let untranslatedExamples = 0;
for (const part of Object.values(polishParts)) {
  for (const word of part.vocab ?? []) {
    if (word.example && word.example.trim() && !M.polishFor(word.example)) untranslatedExamples += 1;
  }
}
check("and no example sentence is kept that Polish does not reach",
  untranslatedExamples === 0);

// ── a real lesson, built the way the app builds one ────────────────────────
const lessonKey = Object.keys(polishParts).find((key) => (polishParts[key].phrases?.length ?? 0) >= 3);
assert.ok(lessonKey, "no pack has enough Polish phrases to build a lesson from");
const part = { ...polishParts[lessonKey], partKey: lessonKey };
const steps = M.stepsForLearningDirection(M.buildSession(part, [], {}, 0), "learn-pl");
const sentenceSteps = steps.filter((step) => step?.type === "sentence");
check("a Polish lesson has cards in it", sentenceSteps.length > 0);
check("every card shows Polish as the thing being learned",
  sentenceSteps.every((step) => typeof step.item.de === "string" && step.item.de.trim().length > 0));
check("no card is still showing the German it was built from",
  sentenceSteps.every((step) => !/[äöüß]/i.test(step.item.de)));
check("every card keeps the German it was built from, so chains and progress still resolve",
  sentenceSteps.every((step) => typeof step.item.originalDe === "string" && step.item.originalDe.trim().length > 0));
check("no card carries the German pronunciation notes, short forms or article beside Polish",
  sentenceSteps.every((step) => step.item.say === undefined
    && step.item.short === undefined
    && step.item.long === undefined
    && step.item.article === undefined));
check("progress ids are untouched, so the German course's grades are not overwritten",
  sentenceSteps.every((step) => typeof step.item.id === "string" && step.item.id.length > 0));

const unreachable = M.stepsForLearningDirection(
  [{ type: "sentence", item: { id: "x", de: "Ein Satz den es nicht gibt.", en: "A sentence that is not there." } }],
  "learn-pl"
);
check("a card with no Polish leaves the lesson instead of appearing blank", unreachable.length === 0);

// Two German greetings meet one Polish one. The card that survives has to
// carry both meanings, or the second one is lost with the card.
const merged = Object.values(polishParts)
  .flatMap((p) => p.phrases ?? [])
  .find((phrase) => M.polishFor(phrase.de) === "Dzień dobry!");
check("where two German cards meet one Polish word, the survivor keeps both meanings",
  Boolean(merged) && merged.en.split(" / ").length >= 2);

// ── grading a typed Polish answer ─────────────────────────────────────────
const accepted = [
  ["Cześć!", "Cześć!"],
  // Nine letters an English, German or French keyboard cannot reach.
  ["czesc", "Cześć!"],
  ["Dziekuje bardzo", "Dziękuję bardzo"],
  // ł carries no combining mark, so a French-style NFKD strip walks past it.
  ["lodka", "łódka"],
  // Polish capitalises sentence starts and proper nouns and nothing else.
  ["dom", "Dom"],
];
const rejected = [
  ["kot", "pies"],
  ["nie lubię kawa", "nie lubię kawy"],
  // The ó/u and rz/ż pairs sound identical and are NOT folded: these are real
  // everyday words that differ by exactly that, and accepting one for the
  // other would mark a wrong word right and never say so.
  ["może", "morze"],
  ["buk", "bok"],
];
check("a missing diacritic is a slip, not a wrong answer",
  accepted.every(([typed, target]) => M.matchPolishPhrase(typed, target).ok));
check("and it is reported as a spelling note rather than passing silently",
  M.matchPolishPhrase("czesc", "Cześć!").spellingNote === true);
check("a wrong word, a wrong case or a same-sounding different word is still wrong",
  rejected.every(([typed, target]) => !M.matchPolishPhrase(typed, target).ok));
check("a lower-case noun is not called a capitalisation mistake",
  M.matchPolishPhrase("dom", "Dom").capitalizationError !== true);
// Polish leaves the subject out unless it is stressing it. That is worth
// saying, and worth not crossing.
check("a spare subject pronoun is coached rather than marked wrong",
  M.matchPolishPhrase("ja idę", "idę").phrasingNote === true);
check("a vocabulary card accepts any of the senses it lists",
  M.matchPolishMeaning("mieszkanie", "dom, mieszkanie").ok);
check("the character row offers every letter the keyboard cannot reach",
  M.POLISH_SPECIAL_CHARACTERS.length >= 18);

// ── conversation ───────────────────────────────────────────────────────────
const scenarios = M.buildScenarios(polishParts);
check("the Polish course has conversations to hold", scenarios.length > 0);
check("and every turn in them is Polish",
  scenarios.every((scenario) => scenario.turns.every((turn) => turn.de && turn.de.trim())));
M.setLearningDirection("learn-de");
const germanScenarios = new Map(M.buildScenarios(germanParts).map((s) => [s.id, s]));
M.setLearningDirection("learn-pl");
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
const placement = M.placementQuestions("learn-pl");
check("the Polish course has its own placement bank", placement.length >= 25);
check("and it can fill a round at every level",
  M.PLACEMENT_LEVELS.every((level) => placement.filter((q) => q.level === level).length >= 5));
// Taken by German speakers and English speakers both, so it has to be
// answerable without either.
check("its options are Polish, so either kind of learner can sit it",
  placement.every((question) => question.options.every((option) => !/[äöüß]/i.test(option))));
// The options render in the order they are written and nothing shuffles them,
// so a bank whose answer is always first can be passed without reading on.
check("and the right answer is not always the first option",
  new Set(placement.map((question) => question.answer)).size >= 3);

M.setLearningDirection("learn-de");

if (failures.length) {
  console.error(`\n${failures.length} Polish course regression${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\ncheck-polish-course: ${polishItems.toLocaleString()} cards across `
  + `${Object.keys(polishParts).length} packs from ${M.translationCount("pl").toLocaleString()} `
  + "translations, every one of them with an answer."
);

// Writing a setting schedules the shared profile mirror's flush, and the timer
// behind it holds the event loop open long after the last assertion has run.
process.exit(0);
