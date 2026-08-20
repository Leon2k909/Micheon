#!/usr/bin/env node
/**
 * The exam simulation, the timeline and the course search.
 *
 * The question bank itself is checked by check-uk-questions; this covers what
 * sits on top of it. Michelle is revising for an exam she pays to sit, with a
 * pass mark of 18 out of 24, so the failures that matter here are the silent
 * ones:
 *
 *  - a pass mark off by one tells her she failed something she passed;
 *  - an exam draw weighted to one chapter is not the exam she is sitting;
 *  - a timeline out of order teaches the wrong sequence, which is precisely
 *    what the test asks about;
 *  - a search that only matches literal text turns "1066" into one result
 *    instead of the Norman Conquest and everything connected to it.
 *
 * None of those throw. So each is exercised for real, against the shared
 * question bank rather than a copy of it.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export * from "./src/lib/lifeInTheUkTests.ts";',
      'export * from "./src/lib/lifeInTheUkTimeline.ts";',
      'export * from "./src/lib/lifeInTheUkSearch.ts";',
      'export { ukAdvice } from "./src/lib/lifeInTheUkAdvice.ts";',
      'export { UK_QUESTIONS, ukChapters, ukQuestionsForChapter } from "./src/lib/ukQuestionBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "uk-tests-entry.ts",
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
const compiled = new Module("uk-tests", module);
compiled.filename = path.join(root, ".uk-tests.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

/** The shape the practice progress store keeps, with nothing answered. */
const emptyState = () => ({
  stats: {}, favourites: [], tests: [],
  daily: { day: "", ids: [], answered: [], index: 0 },
  streak: 0, streakDay: "", dailyGoal: 10,
});

// ── the numbers that define the feature ─────────────────────────────────────
assert.strictEqual(M.UK_EXAM_QUESTION_COUNT, 24, "the real test is 24 questions");
assert.strictEqual(M.UK_EXAM_PASS_MARK, 18, "the real pass mark is 18");
assert.strictEqual(M.UK_PASS_PERCENT, 75, "18 of 24 is 75%");
assert.strictEqual(M.UK_EXAM_DURATION_MS, 45 * 60 * 1000, "the real test allows 45 minutes");

// ── the seven modes ─────────────────────────────────────────────────────────
const MODES = ["exam", "quick", "mixed", "category", "weakness", "mistakes", "favourites"];
assert.strictEqual(M.UK_TEST_MODES.length, 7, `expected 7 modes, found ${M.UK_TEST_MODES.length}`);
for (const mode of MODES) {
  assert.ok(M.UK_TEST_MODES.some((entry) => entry.mode === mode), `mode "${mode}" is not offered`);
}
// Only the exam is timed. A clock on a ten-question warm-up teaches panic.
const timed = M.UK_TEST_MODES.filter((entry) => entry.timed).map((entry) => entry.mode);
assert.deepStrictEqual(timed, ["exam"], `only the exam should be timed, but ${timed.join(", ")} are`);

// ── the exam ────────────────────────────────────────────────────────────────
const exam = M.buildUkTest("exam", emptyState(), { random: seeded(7) });
assert.strictEqual(exam.questions.length, 24, `exam drew ${exam.questions.length} questions`);
assert.strictEqual(exam.passMark, 18, `exam pass mark is ${exam.passMark}`);
assert.strictEqual(exam.durationMs, 45 * 60 * 1000, "the exam must be timed");
assert.strictEqual(new Set(exam.questions.map((entry) => entry.id)).size, 24, "the exam repeated a question");

// It reaches the whole syllabus. A flat draw from a pool weighted to one
// chapter hands out exams weighted the same way; the real test is not.
const chapters = M.ukChapters();
const lessonChapter = new Map();
for (const chapter of chapters) {
  for (const question of M.ukQuestionsForChapter(chapter)) lessonChapter.set(question.lesson, chapter);
}
const spread = {};
for (const question of exam.questions) {
  const chapter = lessonChapter.get(question.lesson);
  spread[chapter] = (spread[chapter] || 0) + 1;
}
for (const chapter of chapters) {
  assert.ok(spread[chapter] >= 2, `the exam drew only ${spread[chapter] || 0} questions from "${chapter}"`);
}

// 17 fails, 18 passes. Off by one and the app tells someone they failed an
// exam they passed.
const answerFirst = (test, rightCount) => {
  const chosen = {};
  test.questions.forEach((question, index) => {
    chosen[question.id] = index < rightCount
      ? question.answer
      : (question.answer + 1) % question.options.length;
  });
  return chosen;
};
const meta = { at: 1767225600000, elapsedMs: 1000 };
const at17 = M.scoreUkTest(exam, answerFirst(exam, 17), meta);
assert.strictEqual(at17.correct, 17);
assert.strictEqual(at17.percent, 71, `17/24 should read 71%, got ${at17.percent}`);
assert.strictEqual(at17.passed, false, "17 out of 24 is a fail");
const at18 = M.scoreUkTest(exam, answerFirst(exam, 18), meta);
assert.strictEqual(at18.correct, 18);
assert.strictEqual(at18.percent, 75, `18/24 should read 75%, got ${at18.percent}`);
assert.strictEqual(at18.passed, true, "18 out of 24 is a pass");
assert.strictEqual(M.scoreUkTest(exam, answerFirst(exam, 24), meta).percent, 100);

// An unanswered question counts as wrong, exactly as on the day.
const blank = M.scoreUkTest(exam, {}, meta);
assert.strictEqual(blank.correct, 0, "leaving everything blank should score zero");
assert.strictEqual(blank.passed, false);
assert.ok(blank.answers.every((answer) => answer.chosen === null && !answer.correct));
assert.strictEqual(blank.answers.length, 24, "every question needs a record, answered or not");

// ── the other modes ─────────────────────────────────────────────────────────
for (const mode of MODES.filter((entry) => entry !== "exam")) {
  const test = M.buildUkTest(mode, {
    ...emptyState(),
    favourites: M.UK_QUESTIONS.slice(0, 3).map((question) => question.id),
    stats: { [M.UK_QUESTIONS[5].id]: { correct: 0, wrong: 2, lastSeen: 1, lastWrong: 1, lastWrongChoice: 0 } },
  }, { random: seeded(3) });
  assert.strictEqual(test.durationMs, null, `"${mode}" should be untimed`);
}

const quick = M.buildUkTest("quick", emptyState(), { random: seeded(11) });
assert.strictEqual(quick.questions.length, 10, `quick quiz drew ${quick.questions.length}`);
// The same 75% standard, scaled — not an impossible 18 out of 10.
assert.strictEqual(quick.passMark, 8, `a 10-question quiz should need 8, got ${quick.passMark}`);

const category = M.buildUkTest("category", emptyState(), { chapter: chapters[0], random: seeded(5) });
assert.ok(category.questions.length > 0, "the category test is empty");
assert.ok(
  category.questions.every((question) => lessonChapter.get(question.lesson) === chapters[0]),
  "the category test included questions from another chapter"
);

const starred = M.UK_QUESTIONS.slice(0, 3).map((question) => question.id);
const favourites = M.buildUkTest("favourites", { ...emptyState(), favourites: starred }, { random: seeded(5) });
assert.deepStrictEqual(
  favourites.questions.map((question) => question.id).sort(),
  [...starred].sort(),
  "the favourites test should hold exactly the starred questions"
);

const wrongId = M.UK_QUESTIONS[9].id;
const mistakes = M.buildUkTest("mistakes", {
  ...emptyState(),
  stats: { [wrongId]: { correct: 0, wrong: 1, lastSeen: 2, lastWrong: 2, lastWrongChoice: 1 } },
}, { random: seeded(5) });
assert.deepStrictEqual(
  mistakes.questions.map((question) => question.id),
  [wrongId],
  "the mistakes test should hold the questions answered wrong"
);

// Weakness follows accuracy, and is honest when it has nothing to go on
// rather than inventing a weakness or returning nothing.
const weakChapter = chapters[chapters.length - 1];
const weakStats = {};
for (const question of M.ukQuestionsForChapter(weakChapter).slice(0, 8)) {
  weakStats[question.id] = { correct: 0, wrong: 4, lastSeen: 1, lastWrong: 1, lastWrongChoice: 0 };
}
for (const question of M.ukQuestionsForChapter(chapters[0]).slice(0, 8)) {
  weakStats[question.id] = { correct: 4, wrong: 0, lastSeen: 1, lastWrong: 0, lastWrongChoice: -1 };
}
const weakState = { ...emptyState(), stats: weakStats };
assert.strictEqual(
  M.ukWeakestChapters(weakState)[0],
  weakChapter,
  "the weakest chapter should be the one answered worst"
);
const weakness = M.buildUkTest("weakness", weakState, { random: seeded(9) });
assert.ok(weakness.questions.length > 0, "the weakness test is empty");
assert.ok(
  weakness.questions.some((question) => lessonChapter.get(question.lesson) === weakChapter),
  "the weakness test ignored the weakest chapter"
);
assert.ok(
  M.buildUkTest("weakness", emptyState(), { random: seeded(9) }).questions.length > 0,
  "with nothing answered the weakness test should fall back to a spread, not return nothing"
);

// ── the timeline ────────────────────────────────────────────────────────────
const timeline = M.ukTimelineSorted();
assert.ok(timeline.length >= 30, `only ${timeline.length} timeline events`);
for (let index = 1; index < timeline.length; index += 1) {
  assert.ok(
    timeline[index].year >= timeline[index - 1].year,
    `the timeline is out of order at ${timeline[index].title}`
  );
}
const timelineIds = new Set();
for (const entry of timeline) {
  assert.ok(!timelineIds.has(entry.id), `duplicate timeline id ${entry.id}`);
  timelineIds.add(entry.id);
  assert.ok(entry.displayYear, `${entry.id}: no display year`);
  assert.ok(entry.detail && entry.detail.length > 40,
    `${entry.id}: clicking an event must reveal something worth reading`);
  assert.ok(entry.tags.length > 0, `${entry.id}: no tags, so search cannot reach it`);
}
for (const year of [1066, 1215, 1707, 1801, 1948]) {
  assert.ok(timeline.some((entry) => entry.year === year), `the timeline is missing ${year}`);
}

// ── search ──────────────────────────────────────────────────────────────────
// The stated example: "1066" reaches the Norman Conquest, and through its tags
// reaches William the Conqueror and the Battle of Hastings.
const norman = M.searchLifeInTheUk("1066");
assert.ok(norman.hits.length > 0, 'searching "1066" found nothing');
const conquest = norman.hits.find((hit) => hit.kind === "event" && /Norman Conquest/i.test(hit.title));
assert.ok(conquest, '"1066" should reach the Norman Conquest');
for (const term of ["William the Conqueror", "Battle of Hastings"]) {
  assert.ok(
    conquest.tags.includes(term),
    `the Norman Conquest should be tagged "${term}" so the chain from 1066 reaches it`
  );
}
assert.ok(norman.matchedTags.includes("1066"), "the search should report which tag it followed");

// Questions inherit tags by mentioning them, which is what connects the bank
// to the timeline without hand-labelling every question.
const taggedQuestions = M.UK_QUESTIONS.filter((question) => M.questionTags(question).length > 0);
assert.ok(
  taggedQuestions.length >= 40,
  `only ${taggedQuestions.length} questions picked up a tag; the chain from a year to a question is broken`
);

// A person, a place, a term and a year all work — not just years.
for (const [query, expect] of [
  ["Churchill", /Second World War|1940|Churchill/i],
  ["Magna Carta", /Magna Carta/i],
  ["Stonehenge", /Stonehenge/i],
  ["devolution", /Devolution|Scottish Parliament/i],
  ["Bannockburn", /Bannockburn/i],
  ["1948", /NHS|Windrush|1948/i],
]) {
  const found = M.searchLifeInTheUk(query);
  assert.ok(found.hits.length > 0, `searching "${query}" found nothing`);
  assert.ok(
    found.hits.some((hit) => expect.test(hit.title) || expect.test(hit.detail || "")),
    `searching "${query}" did not reach anything matching ${expect}`
  );
}

// Categories are searchable, and there is one per official chapter.
const categoryHits = M.ukSearchIndex().filter((hit) => hit.kind === "category");
assert.strictEqual(
  categoryHits.length,
  chapters.length,
  `expected one searchable category per chapter, got ${categoryHits.length} for ${chapters.length}`
);

// ── advice ──────────────────────────────────────────────────────────────────
// Quiet until there is something to go on. Advice from nothing is noise
// dressed as insight.
const cold = M.ukAdvice(emptyState());
assert.strictEqual(cold.length, 1, "with no data there should be exactly one prompt to begin");
assert.ok(/quick quiz/i.test(cold[0].text));

const warned = M.ukAdvice(weakState);
assert.ok(
  warned.some((entry) => entry.tone === "warn" && /weakest area/i.test(entry.text) && entry.chapter === weakChapter),
  "the weakest area should be named once there is enough data"
);
assert.ok(
  warned.some((entry) => entry.tone === "warn" && /incorrectly.*recommend revisiting/i.test(entry.text)),
  "outstanding mistakes should produce a recommendation naming the topic"
);

const threePasses = [1, 2, 3].map((index) => ({
  at: index, score: 20, total: 24, scope: "exam",
  mode: "exam", percent: 83, passed: true, passMark: 18, elapsedMs: 1000, answers: [],
}));
assert.ok(
  M.ukAdvice({ ...weakState, tests: threePasses })
    .some((entry) => entry.tone === "praise" && /three exam simulations/i.test(entry.text)),
  "three passed exams in a row should be called out — it answers the question the learner actually has"
);

console.log(
  `check-uk-tests: ${M.UK_QUESTIONS.length} shared questions across ${chapters.length} chapters, `
  + `${M.UK_TEST_MODES.length} test modes, ${timeline.length} timeline events, `
  + `${taggedQuestions.length} questions reachable by tag; 18/24 passes at 75% and 17/24 does not`
);
