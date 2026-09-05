#!/usr/bin/env node
/**
 * The "Vivir en España" practice bank has to be answerable.
 *
 * The same guard the other five banks carry: a question with no correct
 * option marks you wrong whatever you pick, an id that names a lesson which
 * does not exist hides the question from every filter in the app, and two
 * questions sharing an id share a score. Nothing may be used twice — the
 * lessons close with quizzes of their own and the practice pool is drawn
 * separately, so an overlap would show the learner the same question in two
 * places while keeping two records of it.
 *
 * WHAT THIS ONE PINS THAT THE POLISH AND ITALIAN CHECKS CANNOT. Those two
 * countries hold no civics examination, so their figures are the course's own
 * and can only be checked against themselves. Spain has one: the CCSE, the
 * test of Conocimientos Constitucionales y Socioculturales de España, set by
 * the Instituto Cervantes and required for naturalisation. Its shape is
 * public, so the pack's figures are held to it:
 *
 *     25 questions · 45 minutes · 15 correct to pass
 *
 * Verified at examenes.cervantes.es/es/ccse/como in September 2026. If the
 * Instituto changes the format, this check fails and says so, which is the
 * point: a practice test that quietly drifts from the exam it imitates is
 * worse than one that admits it imitates nothing.
 *
 * The real exam offers three options per question, or true and false. This
 * bank offers four, as all six do, so that a learner moving between countries
 * meets one kind of question. That is a deliberate difference and is written
 * in the course header rather than pinned here.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { ES_QUESTIONS } from "./src/lib/esQuestionBank.ts";
      export { vivirEnEspanaCourse } from "./src/lib/vivirEnEspanaCourse.ts";
      export { ES_TIMELINE, ES_ERA_ORDER, ES_ERA_LABELS } from "./src/lib/vivirEnEspanaTimeline.ts";
      export { ES_PACK, packCategories } from "./src/lib/countryPacks.ts";
      export { COUNTRY_SEARCH_EXAMPLES } from "./src/lib/countrySearch.ts";
    `,
    resolveDir: root,
    sourcefile: "es-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("es-questions-check", module);
compiled.filename = path.join(root, ".es-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  ES_QUESTIONS, vivirEnEspanaCourse,
  ES_TIMELINE, ES_ERA_ORDER, ES_ERA_LABELS,
  ES_PACK, packCategories, COUNTRY_SEARCH_EXAMPLES,
} = compiled.exports;

const problems = [];
const lessons = vivirEnEspanaCourse.lessons || [];
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

const normalise = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");

for (const question of ES_QUESTIONS) {
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
for (const question of ES_QUESTIONS) {
  const key = normalise(question.q);
  if (courseQuizzes.has(key)) {
    problems.push(
      `question "${question.id}" already appears word for word in lesson "${courseQuizzes.get(key)}" — nothing twice`
    );
  }
}

// ── the practice test is the CCSE's shape ──────────────────────────────────
const CCSE = { questionCount: 25, durationMinutes: 45, passMark: 15 };
assert.strictEqual(
  ES_PACK.exam.questionCount, CCSE.questionCount,
  `the CCSE asks ${CCSE.questionCount} questions; this pack asks ${ES_PACK.exam.questionCount}`
);
assert.strictEqual(
  ES_PACK.exam.durationMs, CCSE.durationMinutes * 60 * 1000,
  `the CCSE lasts ${CCSE.durationMinutes} minutes; this pack allows ${ES_PACK.exam.durationMs / 60000}`
);
assert.strictEqual(
  ES_PACK.exam.passMark, CCSE.passMark,
  `the CCSE needs ${CCSE.passMark} right out of 25; this pack needs ${ES_PACK.exam.passMark}`
);

// Each topic and each difficulty has to hold enough to be worth filtering by.
// Proportional rather than absolute, so the rule means the same at sixty-five
// questions as at three hundred, including the sizes a half-written bank
// passes through.
for (const [lesson, count] of perLesson) {
  if (count < 8) problems.push(`topic "${lesson}" has only ${count} question(s); the picker offers them in tens`);
}
const levelFloor = Math.floor(ES_QUESTIONS.length / 10);
for (const [level, count] of Object.entries(perLevel)) {
  if (count < levelFloor) {
    problems.push(
      `level "${level}" holds ${count} of ${ES_QUESTIONS.length} questions, under a tenth; that filter would repeat at once`
    );
  }
}

// ── the five chapters ──────────────────────────────────────────────────────
// The chapter names carry the shape of the course. A renamed one is a course
// about something else.
const CHAPTERS = [
  "Símbolos y Constitución",
  "Las instituciones del Estado",
  "Historia de España",
  "El Estado autonómico, el territorio y las lenguas",
  "Sociedad y vida cotidiana",
];
const chapters = [];
for (const lesson of lessons) {
  if (!chapters.includes(lesson.section)) chapters.push(lesson.section);
}
for (const chapter of chapters) {
  if (!CHAPTERS.includes(chapter)) problems.push(`lesson chapter "${chapter}" is not one of the five`);
}

// ── the timeline reads forwards ────────────────────────────────────────────
const eras = new Set(ES_ERA_ORDER);
let previous = -Infinity;
for (const entry of [...ES_TIMELINE].sort((a, b) => (a.endYear ?? a.year) - (b.endYear ?? b.year))) {
  if (!eras.has(entry.era)) problems.push(`timeline "${entry.id}": era "${entry.era}" is not in ES_ERA_ORDER`);
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
for (const era of ES_ERA_ORDER) {
  if (!ES_ERA_LABELS[era]) problems.push(`era "${era}" has no label`);
}

// ── the picker can reach it ────────────────────────────────────────────────
assert.ok(
  Array.isArray(COUNTRY_SEARCH_EXAMPLES.es) && COUNTRY_SEARCH_EXAMPLES.es.length > 0,
  "Spain has no search examples, so its search box opens with nothing to try"
);
assert.ok(
  packCategories(ES_PACK).length === lessons.length,
  "the practice picker does not offer one topic per lesson"
);

if (problems.length) {
  console.error("FAIL check-es-questions");
  problems.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-es-questions: ${ES_QUESTIONS.length} questions across ${lessons.length} lessons in `
  + `${chapters.length} chapters, three quizzes each, none repeated from a lesson, `
  + `${ES_TIMELINE.length} timeline entries in order — and a practice test of `
  + `${ES_PACK.exam.questionCount} in ${ES_PACK.exam.durationMs / 60000} minutes needing `
  + `${ES_PACK.exam.passMark}, which is the CCSE's own shape`
);
process.exit(0);
