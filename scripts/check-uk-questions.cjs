#!/usr/bin/env node
/**
 * The Life in the UK practice bank has to be answerable.
 *
 * check-courses already pins the quizzes embedded in lessons, and it exists
 * because a quiz with no correct option marks you wrong whatever you pick.
 * The practice bank is 248 questions written the same way and shown far more
 * often, so it needs the same guard — and two more the lesson quizzes do not:
 *
 *   - every question names a lesson that actually exists, because the whole
 *     "learn this topic, then answer questions on it" flow is that one field.
 *     A typo would silently hide the question from every filter in the app.
 *   - question ids are unique and stable, because progress, mistakes and
 *     favourites are all keyed on them. Two questions sharing an id would
 *     share a score, and renaming one would quietly discard someone's history.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { UK_QUESTIONS, ukCategories } from "./src/lib/ukQuestionBank.ts";
      export { lifeInTheUkCourse } from "./src/lib/lifeInTheUkCourse.ts";
    `,
    resolveDir: root,
    sourcefile: "uk-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("uk-questions-check", module);
compiled.filename = path.join(root, ".uk-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { UK_QUESTIONS, ukCategories, lifeInTheUkCourse } = compiled.exports;

const problems = [];
const lessonIds = new Set((lifeInTheUkCourse.lessons || []).map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

for (const question of UK_QUESTIONS) {
  const where = `question "${question.id}"`;

  if (!question.id) problems.push("a question has no id");
  if (seenIds.has(question.id)) problems.push(`${where}: duplicate id — progress would be shared between two questions`);
  seenIds.add(question.id);

  if (!lessonIds.has(question.lesson)) {
    problems.push(`${where}: names lesson "${question.lesson}", which is not in the course`);
  }
  perLesson.set(question.lesson, (perLesson.get(question.lesson) || 0) + 1);

  if (!LEVELS.has(question.level)) problems.push(`${where}: unknown difficulty "${question.level}"`);
  else perLevel[question.level] += 1;

  if (!question.q) problems.push(`${where}: no question text`);
  if (!question.explanation) problems.push(`${where}: no explanation — a wrong answer would teach nothing`);

  const options = question.options || [];
  if (options.length < 2) problems.push(`${where}: needs at least two options`);
  for (const option of options) {
    if (!option || !String(option).trim()) problems.push(`${where}: an option is empty`);
  }
  if (new Set(options).size !== options.length) {
    problems.push(`${where}: duplicate options — two identical choices cannot both be marked`);
  }

  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= options.length) {
    problems.push(`${where}: answer index ${question.answer} is outside its ${options.length} options`);
  }

  // The same question text twice means the learner meets it twice in one
  // session and the two records drift apart.
  const normalised = String(question.q).trim().toLowerCase();
  if (seenQuestions.has(normalised)) {
    problems.push(`${where}: same question text as "${seenQuestions.get(normalised)}"`);
  }
  seenQuestions.set(normalised, question.id);
}

// Every category has to be practisable, or the topic picker offers a dead end.
for (const category of ukCategories()) {
  const count = perLesson.get(category.id) || 0;
  if (count < 5) {
    problems.push(`category "${category.title}" has only ${count} question(s); the topic picker offers 10 at a time`);
  }
}

// All three difficulties have to be usable as a filter on their own.
for (const [level, count] of Object.entries(perLevel)) {
  if (count < 20) problems.push(`only ${count} "${level}" questions; that filter would repeat itself immediately`);
}

assert.ok(UK_QUESTIONS.length >= 200, `only ${UK_QUESTIONS.length} questions in the bank`);

if (problems.length) {
  console.error("FAIL check-uk-questions");
  problems.forEach((problem) => console.error("  " + problem));
  process.exit(1);
}

console.log(
  `check-uk-questions: ${UK_QUESTIONS.length} questions across ${perLesson.size} topics `
  + `(${perLevel.easy} easy, ${perLevel.medium} medium, ${perLevel.hard} hard), `
  + "each with a unique id, one answer in range, and an explanation"
);
