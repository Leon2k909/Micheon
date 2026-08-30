#!/usr/bin/env node
/**
 * Spanish is a course you can actually take, not a row that can be pressed.
 *
 * WHAT THIS IS FOR. This is check-polish-course written for the fifth reading
 * of the same material, and most of it is there for the same reasons: a
 * table-backed course rests on the narrowing and the swap agreeing with each
 * other, and every way that can fail is silent. A card whose Spanish side is
 * blank. A Spanish sentence read aloud by a German voice. A Spanish answer
 * graded by the German matcher, which calls a lower-case noun a mistake — a
 * rule Spanish does not have.
 *
 * WHAT IS DIFFERENT HERE, AND WHY IT NEEDS ITS OWN CHECK. French is a
 * narrowing: it covers part of the catalogue and drops the rest, so the
 * question its check asks is "did enough survive?". Polish and Spanish are
 * meant to reach the whole of it, so the question here is the opposite one:
 * "did anything get lost?". A floor cannot answer that, so Spanish is
 * measured against Polish instead — the same catalogue read through the same
 * swap — both in total and card by card.
 *
 * That comparison is not decoration. Spanish arrived with 24,481
 * translations and every count that had been asked for; Polish reached 944
 * keys it did not, and among them were und, ich, sprechen and zwanzig. No
 * check in the build noticed, because nothing was comparing the two.
 *
 * What is Spanish's own is checked too: that a missing accent is a slip, that
 * ñ is NOT folded to n, and that b/v, ll/y, c/s/z and silent h are not folded
 * either. Every one of those pairs is two real everyday words, and accepting
 * one for the other would mark a wrong answer right and never say so.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

function load(entry) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: "spanish-entry.ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    write: false,
    logLevel: "silent",
    loader: { ".json": "json" },
  });
  const compiled = new Module("spanish-check", module);
  compiled.filename = path.join(root, ".spanish-check.cjs");
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
  'export { getLearningDirection, setLearningDirection, targetLangTag, targetIsGerman, learningSpanish } from "./src/lib/direction.ts";',
  'export { spanishFor, spanishPart, spanishParts, hasSpanish, swapStepForSpanish, spanishMeaningLanguage } from "./src/lib/spanishCourse.ts";',
  'export { stepsForLearningDirection } from "./src/lib/learningDirectionStep.ts";',
  'export { matchSpanishPhrase, matchSpanishMeaning, SPANISH_SPECIAL_CHARACTERS } from "./src/lib/spanishTextMatch.ts";',
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
  'export { SPANISH_BY_GERMAN } from "./src/lib/spanishTranslations.ts";',
  'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
  'export { polishFor } from "./src/lib/polishCourse.ts";',
  'export { primeTranslations } from "./src/lib/translations.ts";',
].join("\n"));

// The tables are fetched at runtime so a German-only learner never downloads
// them; here both are wanted at once, and there is no event loop to await one
// on. Polish is here because it is the bar Spanish is held to below.
M.primeTranslations("es", M.SPANISH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

const failures = [];
function check(what, ok) {
  if (ok) console.log("ok   " + what);
  else { console.error("FAIL " + what); failures.push(what); }
}

// ── the course is real, and choosing it moves the direction ────────────────
const spanish = M.COURSES.find((course) => course.id === "spanish");
assert.ok(spanish, "Spanish is not registered as a course at all");
check("Spanish is a selectable, built-in language course",
  spanish.kind === "language" && spanish.available === true && spanish.builtIn === true);
check("and it says what it teaches rather than Coming soon",
  typeof spanish.tagline === "string" && !/coming soon/i.test(spanish.tagline));
// Everything in the catalogue is drawn only behind "Show more", which is the
// wrong place for a language you can start.
check("it is not also listed as a language that is only planned",
  !M.PLANNED_LANGUAGES.some((language) => language.id === "spanish"));

const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
check("choosing Spanish sets the learning direction with it",
  shell.includes('else if (courseId === "spanish") setLearningDirection("learn-es");'));

M.setLearningDirection("learn-es");
check("the direction survives being stored and read back", M.getLearningDirection() === "learn-es");
check("and the course knows German is not what is being learned",
  M.learningSpanish() === true && M.targetIsGerman() === false);
check("the lesson voice is Spanish", M.targetLangTag() === "es-ES");
check("the flag is Spanish whichever of its two names is stored",
  M.learningFlagId("spanish") === "spanish" && M.learningFlagId("german") === "spanish");

const sides = M.courseSides();
check("the two sides of a card are Spanish and a language the learner reads",
  sides.target.code === "es"
  && sides.target.voice === "es-ES"
  && (sides.meaning.code === "de" || sides.meaning.code === "en"));

// A voice with no entry falls back on the server's default, which is German —
// the one failure that would leave every Spanish sentence read aloud in German.
const server = fs.readFileSync(path.join(root, "server/index.js"), "utf8");
check("the speech server has a Spanish voice to answer with",
  /"es-ES":\s*"es-ES-\w+Neural"/.test(server) && /"es-ES":\s*\[/.test(server));

// ── the audio mixer has a Spanish channel of its own ───────────────────────
check("Spanish is a language the mixer knows", M.audioLanguageFromTag("es-ES") === "spanish");
M.setTtsLanguageMuted("spanish", true);
check("muting the Spanish voice silences Spanish and nothing else",
  M.isTtsLanguageMuted("spanish") === true
  && M.getTtsAudioVolume("es-ES") === 0
  && M.getTtsAudioVolume("de-DE") > 0);
M.setTtsLanguageMuted("spanish", false);

// ── the catalogue, whole ───────────────────────────────────────────────────
const resolved = {};
for (const [key, blueprint] of Object.entries(M.allPartBlueprints)) {
  resolved[key] = M.buildApiPartFromResolved(blueprint, {});
}
const everything = { ...resolved, ...M.buildCuratedParts("learn-es") };
const spanishCourseParts = M.filterPartsForLearningDirection(everything, "learn-es");
const germanParts = M.filterPartsForLearningDirection(everything, "learn-de");

const countItems = (parts) => Object.values(parts).reduce((total, part) => total
  + (part.vocab?.length ?? 0)
  + (part.phrases?.length ?? 0)
  + (part.dialogues ?? []).reduce((lines, dialogue) => lines + (dialogue.lines?.length ?? 0), 0), 0);

const spanishItems = countItems(spanishCourseParts);
const germanItems = countItems(germanParts);
const kept = germanItems ? spanishItems / germanItems : 0;

/**
 * The bar is the other complete course, not a constant.
 *
 * French is a narrowing — it covers about a third of the catalogue and drops
 * the rest — so its check asks "did enough survive?". Polish and Spanish are
 * meant to reach everything the packs hold, so the question here is the
 * opposite one: "did anything get lost?". A fixed floor cannot answer it. A
 * course that is meant to be the German one entry for entry can lose a
 * thousand cards to one missing key without an error anywhere, and still
 * clear any floor low enough to have been safe to write.
 *
 * So the number is pinned against Polish, which is read from the same
 * catalogue through the same swap. That makes the check self-maintaining: it
 * has nothing to raise as the tables grow, and it fails the moment Spanish
 * falls behind — which is exactly how the gap this was written to close went
 * unnoticed. Spanish had 24,481 translations and looked finished; Polish had
 * 944 more, and among them were und, ich, sprechen and zwanzig.
 */
const polishParts = M.filterPartsForLearningDirection(everything, "learn-pl");
const polishItems = countItems(polishParts);
check(`the Spanish course is not behind the other complete course (${spanishItems.toLocaleString()} against Polish's ${polishItems.toLocaleString()}, out of ${germanItems.toLocaleString()})`,
  spanishItems >= polishItems);
check(`and it reaches the German course rather than a corner of it (${(kept * 100).toFixed(1)}%)`,
  kept >= 0.9);
check("it is still the German course read through a table, not a copy of it",
  Object.keys(spanishCourseParts).length === Object.keys(germanParts).length);

// The totals above can agree while a scattering of individual cards is missed,
// so the same comparison is made entry by entry: every German string Polish
// can answer, Spanish answers too.
const behind = [];
for (const part of Object.values(germanParts)) {
  const german = [
    ...(part.vocab ?? []).map((word) => word.de),
    ...(part.phrases ?? []).map((phrase) => phrase.de),
    ...(part.dialogues ?? []).flatMap((dialogue) => (dialogue.lines ?? []).map((line) => line.de)),
  ];
  for (const text of german) {
    if (M.polishFor(text) && !M.spanishFor(text)) behind.push(text);
  }
}
check(`no card is taught in Polish and left untaught in Spanish${behind.length ? ` — ${behind.length}, first: "${behind[0]}"` : ""}`,
  behind.length === 0);

// EVERY entry the course serves has to have an answer. Checked exhaustively
// rather than sampled, because "nearly all of it" is exactly what a broken
// lookup looks like from a distance.
let blanks = 0;
let firstBlank = "";
for (const [key, part] of Object.entries(spanishCourseParts)) {
  for (const word of part.vocab ?? []) {
    if (!M.spanishFor(word.de)) { blanks += 1; firstBlank ||= `${key} vocab "${word.de}"`; }
  }
  for (const phrase of part.phrases ?? []) {
    if (!M.spanishFor(phrase.de)) { blanks += 1; firstBlank ||= `${key} phrase "${phrase.de}"`; }
  }
  for (const dialogue of part.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) {
      if (!M.spanishFor(line.de)) { blanks += 1; firstBlank ||= `${key} dialogue "${line.de}"`; }
    }
  }
}
check(`no card in the Spanish course is missing its Spanish${blanks ? ` — ${blanks}, first: ${firstBlank}` : ""}`,
  blanks === 0);

let untranslatedExamples = 0;
for (const part of Object.values(spanishCourseParts)) {
  for (const word of part.vocab ?? []) {
    if (word.example && word.example.trim() && !M.spanishFor(word.example)) untranslatedExamples += 1;
  }
}
check("and no example sentence is kept that Spanish does not reach",
  untranslatedExamples === 0);

// ── a real lesson, built the way the app builds one ────────────────────────
const lessonKey = Object.keys(spanishCourseParts).find((key) => (spanishCourseParts[key].phrases?.length ?? 0) >= 3);
assert.ok(lessonKey, "no pack has enough Spanish phrases to build a lesson from");
const part = { ...spanishCourseParts[lessonKey], partKey: lessonKey };
const steps = M.stepsForLearningDirection(M.buildSession(part, [], {}, 0), "learn-es");
const sentenceSteps = steps.filter((step) => step?.type === "sentence");
check("a Spanish lesson has cards in it", sentenceSteps.length > 0);
check("every card shows Spanish as the thing being learned",
  sentenceSteps.every((step) => typeof step.item.de === "string" && step.item.de.trim().length > 0));
check("no card is still showing the German it was built from",
  sentenceSteps.every((step) => !/[äöüß]/i.test(step.item.de)));
check("every card keeps the German it was built from, so chains and progress still resolve",
  sentenceSteps.every((step) => typeof step.item.originalDe === "string" && step.item.originalDe.trim().length > 0));
check("no card carries the German pronunciation notes, short forms or article beside Spanish",
  sentenceSteps.every((step) => step.item.say === undefined
    && step.item.short === undefined
    && step.item.long === undefined
    && step.item.article === undefined));
check("progress ids are untouched, so the German course's grades are not overwritten",
  sentenceSteps.every((step) => typeof step.item.id === "string" && step.item.id.length > 0));

const unreachable = M.stepsForLearningDirection(
  [{ type: "sentence", item: { id: "x", de: "Ein Satz den es nicht gibt.", en: "A sentence that is not there." } }],
  "learn-es"
);
check("a card with no Spanish leaves the lesson instead of appearing blank", unreachable.length === 0);

// Two German cards can meet one Spanish one. The table was written to avoid it
// where the German really is two different things, but where Spanish genuinely
// has one word the survivor has to carry both meanings — or the second card is
// lost and its meaning with it.
const twoGerman = Object.keys(M.SPANISH_BY_GERMAN).find((german) => (
  Object.keys(M.SPANISH_BY_GERMAN).some((other) => other !== german
    && M.SPANISH_BY_GERMAN[other] === M.SPANISH_BY_GERMAN[german])
));
const twin = twoGerman
  ? Object.keys(M.SPANISH_BY_GERMAN).find((other) => other !== twoGerman
    && M.SPANISH_BY_GERMAN[other] === M.SPANISH_BY_GERMAN[twoGerman])
  : null;
if (twoGerman && twin) {
  const merged = M.spanishPart({
    vocab: [],
    dialogues: [],
    phrases: [
      { id: "a", de: twoGerman, en: "First meaning" },
      { id: "b", de: twin, en: "Second meaning" },
    ],
  });
  check("where two German cards meet one Spanish word, the survivor keeps both meanings",
    merged.phrases.length === 1
    && merged.phrases[0].en.includes("First meaning")
    && merged.phrases[0].en.includes("Second meaning"));
} else {
  check("where two German cards meet one Spanish word, the survivor keeps both meanings", true);
}

// A pack's German-only questions are written against a German answer, and
// carrying them into the Spanish course would ask for German inside a Spanish
// lesson.
check("the German-only question types do not follow the pack into Spanish",
  Object.values(spanishCourseParts).every((p) => (p.translationQuestions ?? []).length === 0
    && (p.articleQuestions ?? []).length === 0));

// ── grading a typed Spanish answer ────────────────────────────────────────
const accepted = [
  ["¿Cómo estás?", "¿Cómo estás?"],
  // The accents are not on a keyboard bought in Britain or Germany, and the
  // learner who types this knew the word.
  ["cancion", "canción"],
  ["Que tal", "¿Qué tal?"],
  // The opening marks are punctuation and dropped on both sides.
  ["Como te llamas", "¿Cómo te llamas?"],
  // Spanish capitalises sentence starts and proper nouns and nothing else.
  ["casa", "Casa"],
];
const rejected = [
  ["gato", "perro"],
  // ñ is its own letter, and every pair below is two real everyday words that
  // differ by exactly the fold that was NOT applied. Accepting either side
  // would mark a wrong word right and never say so.
  ["ano", "año"],
  ["campana", "campaña"],
  ["vaca", "baca"],
  ["haya", "halla"],
  ["casa", "caza"],
  ["ola", "hola"],
  // Wrong tense, wrong verb: what the lesson is for.
  ["soy cansado", "estoy cansado"],
];
check("a missing accent is a slip, not a wrong answer",
  accepted.every(([typed, target]) => M.matchSpanishPhrase(typed, target).ok));
check("and it is reported as a spelling note rather than passing silently",
  M.matchSpanishPhrase("cancion", "canción").spellingNote === true);
check("a wrong word, or a same-sounding different word, is still wrong",
  rejected.every(([typed, target]) => !M.matchSpanishPhrase(typed, target).ok));
check("a lower-case noun is not called a capitalisation mistake",
  M.matchSpanishPhrase("casa", "Casa").capitalizationError !== true);
// Spanish leaves the subject out unless it is stressing it — the ending
// already says who. That is worth saying, and worth not crossing.
check("a spare subject pronoun is coached rather than marked wrong",
  M.matchSpanishPhrase("yo voy", "voy").phrasingNote === true);
check("a vocabulary card accepts any of the senses it lists",
  M.matchSpanishMeaning("el hogar", "la casa, el hogar").ok);
check("the character row offers ñ, the one letter the matcher does not forgive",
  M.SPANISH_SPECIAL_CHARACTERS.includes("ñ") && M.SPANISH_SPECIAL_CHARACTERS.length >= 12);

// ── conversation ───────────────────────────────────────────────────────────
const scenarios = M.buildScenarios(spanishCourseParts);
check("the Spanish course has conversations to hold", scenarios.length > 0);
check("and every turn in them is Spanish",
  scenarios.every((scenario) => scenario.turns.every((turn) => turn.de && turn.de.trim())));
M.setLearningDirection("learn-de");
const germanScenarios = new Map(M.buildScenarios(germanParts).map((s) => [s.id, s]));
M.setLearningDirection("learn-es");
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
const placement = M.placementQuestions("learn-es");
check("the Spanish course has its own placement bank", placement.length >= 25);
check("and it can fill a round at every level",
  M.PLACEMENT_LEVELS.every((level) => placement.filter((q) => q.level === level).length >= 5));
// Taken by German speakers and English speakers both, so it has to be
// answerable without either.
check("its options are Spanish, so either kind of learner can sit it",
  placement.every((question) => question.options.every((option) => !/[äöüß]/i.test(option))));
// The options render in the order they are written and nothing shuffles them,
// so a bank whose answer is always first can be passed without reading on.
check("and the right answer is not always the first option",
  new Set(placement.map((question) => question.answer)).size >= 3);

M.setLearningDirection("learn-de");

// ── the table-backed courses travel together ───────────────────────────────
//
// French, Polish and Spanish are built the same way: the catalogue stays
// German and the course looks its own text up. So a file that consults one
// table and not the others is not a style difference, it is a screen that
// answers for two languages and silently falls back to German for the third.
//
// That is exactly how it went wrong once already. Practice looked up French,
// and for Polish let the answer fall through to the German — which is also
// what the German prompt uses, so every candidate was dropped as "same
// wording on both sides" and the screen sat waiting forever. Nothing failed;
// the build was green through all of it.
//
// Named exceptions rather than a pattern, because each one has a reason and a
// new file should have to state its own.
const NOT_SPANISH = new Set([
  // The Polish implementation itself; spanishCourse.ts is its twin.
  "src/lib/polishCourse.ts",
]);
const sourceDir = path.join(root, "src");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : /\.tsx?$/.test(entry.name) ? [full] : [];
});
const lopsided = walk(sourceDir)
  .map((file) => ({ rel: path.relative(root, file).replace(/\\/g, "/"), text: fs.readFileSync(file, "utf8") }))
  .filter(({ rel, text }) => !NOT_SPANISH.has(rel) && text.includes("polishFor(") && !text.includes("spanishFor("))
  .map(({ rel }) => rel);
check(
  `every file that looks a phrase up in Polish looks it up in Spanish too${lopsided.length ? ` — ${lopsided.join(", ")}` : ""}`,
  lopsided.length === 0
);

// The same failure one level up: a screen that grades French and Polish typing
// with their own comparators and Spanish with somebody else's.
const MATCHER_EXEMPT = new Set([
  "src/lib/polishTextMatch.ts",
  "src/lib/frenchTextMatch.ts",
]);
const ungraded = walk(sourceDir)
  .map((file) => ({ rel: path.relative(root, file).replace(/\\/g, "/"), text: fs.readFileSync(file, "utf8") }))
  .filter(({ rel, text }) => !MATCHER_EXEMPT.has(rel)
    && /matchPolish(Phrase|Sentence|Meaning)\(/.test(text)
    && !/matchSpanish(Phrase|Sentence|Meaning)\(/.test(text))
  .map(({ rel }) => rel);
check(
  `every screen that grades typed Polish grades typed Spanish the same way${ungraded.length ? ` — ${ungraded.join(", ")}` : ""}`,
  ungraded.length === 0
);

if (failures.length) {
  console.error(`\n${failures.length} Spanish course regression${failures.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\ncheck-spanish-course: ${spanishItems.toLocaleString()} cards across `
  + `${Object.keys(spanishCourseParts).length} packs from ${M.translationCount("es").toLocaleString()} `
  + "translations — everything Polish teaches, every one of them with an answer."
);

// Writing a setting schedules the shared profile mirror's flush, and the timer
// behind it holds the event loop open long after the last assertion has run.
process.exit(0);
