#!/usr/bin/env node
/**
 * The "Жизнь в России" practice bank has to be answerable.
 *
 * The same guard the other six banks carry: a question with no correct option
 * marks you wrong whatever you pick, an id that names a lesson which does not
 * exist hides the question from every filter in the app, and two questions
 * sharing an id share a score. Nothing may be used twice — the lessons close
 * with quizzes of their own and the practice pool is drawn separately, so an
 * overlap would show the learner the same question in two places while
 * keeping two records of it.
 *
 * WHAT THIS ONE PINS. Russia holds a real examination, so the pack's figures
 * are held to it rather than only to themselves. Government Decree No. 1136
 * of 31 July 2025 split the former combined exam: for citizenship there are
 * now two separate ones, and this pack imitates the second — history of
 * Russia and the foundations of legislation. Per the Rosobrnadzor and FIPI
 * specification:
 *
 *     36 tasks · 18 history, 18 law
 *     no more than 90 minutes
 *     a pass is at least 28 primary points out of 40,
 *     with at least 12 in each half
 *
 * Verified at fipi.ru in September 2026.
 *
 * THE PASS MARK IS CONVERTED, and the check knows it. The real exam counts
 * POINTS: forty across thirty-six tasks, because six of them want an answer
 * in the candidate's own words and are worth two. This bank holds only
 * four-option questions worth one, so the threshold is carried across as a
 * proportion: 28 of 40 is 70 per cent, and 70 per cent of 36 questions is 25.
 * The check recomputes that arithmetic rather than trusting a number typed
 * once, so a change to either figure at the source shows up here.
 *
 * The real exam offers three options a question. This bank offers four, as
 * all seven do, so a learner moving between countries meets one kind of
 * question. That is deliberate and is written in the course header.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { RU_QUESTIONS } from "./src/lib/ruQuestionBank.ts";
      export { zhiznVRossiiCourse } from "./src/lib/zhiznVRossiiCourse.ts";
      export { RU_TIMELINE, RU_ERA_ORDER, RU_ERA_LABELS } from "./src/lib/zhiznVRossiiTimeline.ts";
      export { RU_PACK, packCategories } from "./src/lib/countryPacks.ts";
      export { COUNTRY_SEARCH_EXAMPLES } from "./src/lib/countrySearch.ts";
    `,
    resolveDir: root,
    sourcefile: "ru-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("ru-questions-check", module);
compiled.filename = path.join(root, ".ru-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  RU_QUESTIONS, zhiznVRossiiCourse,
  RU_TIMELINE, RU_ERA_ORDER, RU_ERA_LABELS,
  RU_PACK, packCategories, COUNTRY_SEARCH_EXAMPLES,
} = compiled.exports;

const problems = [];
const lessons = zhiznVRossiiCourse.lessons || [];
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

const normalise = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");

for (const question of RU_QUESTIONS) {
  const where = `question "${question.id}"`;

  if (!question.id) problems.push("a question has no id");
  if (seenIds.has(question.id)) problems.push(`${where}: duplicate id — two questions would share one score`);
  seenIds.add(question.id);

  if (!lessonIds.has(question.lesson)) {
    problems.push(`${where}: names lesson "${question.lesson}", which the course does not have`);
  }
  perLesson.set(question.lesson, (perLesson.get(question.lesson) || 0) + 1);

  if (!LEVELS.has(question.level)) problems.push(`${where}: unknown difficulty "${question.level}"`);
  else perLevel[question.level] += 1;

  if (!question.q) problems.push(`${where}: no question text`);
  if (!question.explanation) problems.push(`${where}: no explanation — a wrong answer would teach nothing`);

  const options = question.options || [];
  if (options.length !== 4) problems.push(`${where}: has ${options.length} options; every bank here offers four`);
  for (const option of options) {
    if (!option || !String(option).trim()) problems.push(`${where}: an option is empty`);
  }
  if (new Set(options).size !== options.length) {
    problems.push(`${where}: duplicate options — two identical choices cannot both count`);
  }

  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= options.length) {
    problems.push(`${where}: answer index ${question.answer} falls outside the ${options.length} options`);
  }

  const key = normalise(question.q);
  if (seenQuestions.has(key)) {
    problems.push(`${where}: same question text as "${seenQuestions.get(key)}"`);
  }
  seenQuestions.set(key, question.id);
}

// ── nothing used twice ─────────────────────────────────────────────────────
const courseQuizzes = new Map();
for (const lesson of lessons) {
  let quizzes = 0;
  for (const block of lesson.blocks || []) {
    if (block.type !== "quiz") continue;
    quizzes += 1;
    courseQuizzes.set(normalise(block.q), lesson.id);
    const correct = (block.options || []).filter((option) => option.correct).length;
    if (correct !== 1) {
      problems.push(`lesson "${lesson.id}": a quiz has ${correct} correct options, not exactly one`);
    }
  }
  if (quizzes !== 3) problems.push(`lesson "${lesson.id}" closes with ${quizzes} quizzes, not three`);
}
for (const question of RU_QUESTIONS) {
  const key = normalise(question.q);
  if (courseQuizzes.has(key)) {
    problems.push(
      `question "${question.id}" already appears word for word in lesson "${courseQuizzes.get(key)}" — nothing twice`
    );
  }
}

// ── the practice test carries the real exam across ─────────────────────────
const EXAM = { tasks: 36, minutes: 90, points: 40, passPoints: 28 };
assert.strictEqual(
  RU_PACK.exam.questionCount, EXAM.tasks,
  `the exam sets ${EXAM.tasks} tasks; this pack asks ${RU_PACK.exam.questionCount}`
);
assert.strictEqual(
  RU_PACK.exam.durationMs, EXAM.minutes * 60 * 1000,
  `the exam allows ${EXAM.minutes} minutes; this pack allows ${RU_PACK.exam.durationMs / 60000}`
);
// The conversion is recomputed here rather than trusted as a typed number, so
// that changing either figure at the source moves the pass mark with it.
const converted = Math.floor((EXAM.passPoints / EXAM.points) * EXAM.tasks);
assert.strictEqual(
  RU_PACK.exam.passMark, converted,
  `${EXAM.passPoints} of ${EXAM.points} points is ${converted} of ${EXAM.tasks} questions; this pack wants `
  + `${RU_PACK.exam.passMark}`
);

// Each topic and each difficulty has to hold enough to be worth filtering by.
// Proportional rather than absolute, so the rule means the same at sixty-five
// questions as at four hundred, including the sizes a half-written bank
// passes through.
for (const [lesson, count] of perLesson) {
  if (count < 8) problems.push(`topic "${lesson}" has only ${count} question(s); the picker offers them in tens`);
}
const levelFloor = Math.floor(RU_QUESTIONS.length / 10);
for (const [level, count] of Object.entries(perLevel)) {
  if (count < levelFloor) {
    problems.push(
      `level "${level}" holds ${count} of ${RU_QUESTIONS.length} questions, under a tenth; that filter would repeat at once`
    );
  }
}

// ── the six chapters ───────────────────────────────────────────────────────
// The chapter names carry the shape of the course. A renamed one is a course
// about something else.
const CHAPTERS = [
  "Символы и Конституция",
  "Государственное устройство",
  "История России",
  "Территория и природа",
  "Народы, языки и культура",
  "Общество и повседневная жизнь",
];
const chapters = [];
for (const lesson of lessons) {
  if (!chapters.includes(lesson.section)) chapters.push(lesson.section);
}
for (const chapter of chapters) {
  if (!CHAPTERS.includes(chapter)) problems.push(`lesson chapter "${chapter}" is not one of the six`);
}

// ── the timeline reads forwards ────────────────────────────────────────────
// Eight eras rather than six: a thousand years does not fit into six spans
// without one of them swallowing four different worlds.
assert.ok(
  RU_ERA_ORDER.length === 8,
  `the Russian timeline is planned in eight eras; RU_ERA_ORDER holds ${RU_ERA_ORDER.length}`
);
const eras = new Set(RU_ERA_ORDER);
let previous = -Infinity;
for (const entry of [...RU_TIMELINE].sort((a, b) => (a.endYear ?? a.year) - (b.endYear ?? b.year))) {
  if (!eras.has(entry.era)) problems.push(`timeline "${entry.id}": era "${entry.era}" is not in RU_ERA_ORDER`);
  if (!entry.title || !entry.summary || !entry.detail) {
    problems.push(`timeline "${entry.id}": missing title, summary or detail`);
  }
  if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
    problems.push(`timeline "${entry.id}": no tags, so search cannot reach it`);
  }
  const year = entry.endYear ?? entry.year;
  if (year < previous) problems.push(`timeline "${entry.id}": ${year} sorts before ${previous}`);
  previous = year;
}
for (const era of RU_ERA_ORDER) {
  if (!RU_ERA_LABELS[era]) problems.push(`era "${era}" has no label`);
}

// ── the picker can reach it ────────────────────────────────────────────────
assert.ok(
  Array.isArray(COUNTRY_SEARCH_EXAMPLES.ru) && COUNTRY_SEARCH_EXAMPLES.ru.length > 0,
  "Russia has no search examples, so its search box opens with nothing to try"
);
assert.ok(
  packCategories(RU_PACK).length === lessons.length,
  "the practice picker does not offer one topic per lesson"
);

if (problems.length) {
  console.error("FAIL check-ru-questions");
  problems.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-ru-questions: ${RU_QUESTIONS.length} questions across ${lessons.length} lessons in `
  + `${chapters.length} chapters, three quizzes each, none repeated from a lesson, `
  + `${RU_TIMELINE.length} timeline entries across ${RU_ERA_ORDER.length} eras — and a practice test of `
  + `${RU_PACK.exam.questionCount} in ${RU_PACK.exam.durationMs / 60000} minutes needing `
  + `${RU_PACK.exam.passMark}, which is the real exam's ${EXAM.passPoints}/${EXAM.points} carried across`
);
process.exit(0);
