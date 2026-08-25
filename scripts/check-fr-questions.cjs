#!/usr/bin/env node
/**
 * The "Vivre en France" practice bank has to be answerable.
 *
 * The same guard check-uk-questions and check-de-questions put on the other
 * two banks: a question with no correct option marks you wrong whatever you
 * pick, an id that names a lesson which does not exist hides the question from
 * every filter in the app, and two questions sharing an id share a score.
 *
 * It carries the assertion the German check carries too: nothing may be used
 * twice. The lessons close with quizzes of their own and the practice pool is
 * drawn from separately, so an overlap would show the learner the same
 * question in two places while keeping two records of it.
 *
 * And it pins the numbers of the real exam. Since 1 January 2026 the examen
 * civique is 40 questions in 45 minutes with 32 correct to pass — different
 * from both other countries, and the three sets of numbers all reach the same
 * screen.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { FR_QUESTIONS, frCategories, frChapters } from "./src/lib/frQuestionBank.ts";
      export { vivreEnFranceCourse } from "./src/lib/vivreEnFranceCourse.ts";
      export { FR_TIMELINE, frTimelineSorted, FR_ERA_ORDER } from "./src/lib/vivreEnFranceTimeline.ts";
      export { FR_PACK, UK_PACK, DE_PACK } from "./src/lib/countryPacks.ts";
      export { COUNTRY_SEARCH_EXAMPLES } from "./src/lib/countrySearch.ts";
    `,
    resolveDir: root,
    sourcefile: "fr-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("fr-questions-check", module);
compiled.filename = path.join(root, ".fr-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  FR_QUESTIONS, frCategories, frChapters, vivreEnFranceCourse,
  FR_TIMELINE, frTimelineSorted, FR_ERA_ORDER,
  FR_PACK, UK_PACK, DE_PACK, COUNTRY_SEARCH_EXAMPLES,
} = compiled.exports;

const problems = [];
const lessons = vivreEnFranceCourse.lessons || [];
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

const normalise = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");

for (const question of FR_QUESTIONS) {
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
  // Four options with one right answer is the shape of the real exam, so the
  // practice bank uses it rather than merely allowing at least two.
  if (options.length !== 4) problems.push(`${where}: has ${options.length} options; the exam always offers four`);
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
  for (const block of lesson.blocks || []) {
    if (block.type !== "quiz") continue;
    courseQuizzes.set(normalise(block.q), lesson.id);
    const correct = (block.options || []).filter((option) => option.correct).length;
    if (correct !== 1) {
      problems.push(`lesson "${lesson.id}": a quiz has ${correct} correct options, not exactly one`);
    }
  }
}
for (const question of FR_QUESTIONS) {
  const key = normalise(question.q);
  if (courseQuizzes.has(key)) {
    problems.push(
      `question "${question.id}" already appears word for word in lesson "${courseQuizzes.get(key)}" — nothing twice`
    );
  }
}

// Every topic has to be practisable, or the picker offers a dead end.
for (const category of frCategories()) {
  const count = perLesson.get(category.id) || 0;
  if (count < 10) {
    problems.push(`topic "${category.title}" has only ${count} question(s); the picker offers ten at a time`);
  }
}

for (const [level, count] of Object.entries(perLevel)) {
  if (count < 20) problems.push(`only ${count} questions at level "${level}"; that filter would repeat at once`);
}

// ── the five official themes ───────────────────────────────────────────────
// The chapter names are the syllabus of the real exam and are what maps this
// course onto it. A renamed or missing theme is a course about something else.
const THEMES = [
  "Principes et valeurs de la République",
  "Système institutionnel et politique",
  "Droits et devoirs",
  "Histoire, géographie et culture",
  "Vivre dans la société française",
];
const chapters = frChapters();
for (const theme of THEMES) {
  if (!chapters.includes(theme)) problems.push(`the official theme "${theme}" has no lessons`);
}
if (chapters.length !== THEMES.length) {
  problems.push(`the course has ${chapters.length} themes; the exam has ${THEMES.length}`);
}

// ── the timeline ───────────────────────────────────────────────────────────
const sorted = frTimelineSorted();
for (let index = 1; index < sorted.length; index += 1) {
  const previous = sorted[index - 1];
  const current = sorted[index];
  const previousYear = previous.endYear ?? previous.year;
  const currentYear = current.endYear ?? current.year;
  if (previousYear > currentYear) {
    problems.push(`timeline: "${current.title}" comes after "${previous.title}" but is earlier`);
  }
}
for (const entry of FR_TIMELINE) {
  if (entry.endYear !== undefined && entry.endYear < entry.year) {
    problems.push(`timeline: "${entry.title}" ends (${entry.endYear}) before it began (${entry.year})`);
  }
  if (!entry.tags || entry.tags.length === 0) {
    problems.push(`timeline: "${entry.title}" has no tags — search would reach it by nothing`);
  }
  if (!FR_ERA_ORDER.includes(entry.era)) {
    problems.push(`timeline: "${entry.title}" is in era "${entry.era}", which is not in the order`);
  }
}

// ── the exam numbers ───────────────────────────────────────────────────────
assert.strictEqual(FR_PACK.exam.questionCount, 40, "the French exam asks 40 questions");
assert.strictEqual(FR_PACK.exam.durationMs, 45 * 60 * 1000, "in 45 minutes at most");
assert.strictEqual(FR_PACK.exam.passMark, 32, "and needs 32 correct answers to pass");
assert.strictEqual(FR_PACK.contentLang, "fr", "the material is in the language of the real exam");
assert.strictEqual(FR_PACK.flagId, "french", "the sidebar needs a flag it has art for");
// Separate stores, separate progress: a wrong answer about the Sénat must not
// turn up in the German mistake list.
assert.notStrictEqual(FR_PACK.storeKey, UK_PACK.storeKey, "separate store from the UK");
assert.notStrictEqual(FR_PACK.storeKey, DE_PACK.storeKey, "separate store from Germany");
assert.strictEqual(UK_PACK.exam.questionCount, 24, "the British exam stays at 24 questions");
assert.strictEqual(DE_PACK.exam.questionCount, 33, "the German one stays at 33");

assert.ok(
  Array.isArray(COUNTRY_SEARCH_EXAMPLES.fr) && COUNTRY_SEARCH_EXAMPLES.fr.length >= 6,
  "the search box needs French examples, or it opens with an empty suggestion row"
);

assert.ok(FR_QUESTIONS.length >= 280, `only ${FR_QUESTIONS.length} questions in the pool`);
assert.ok(lessons.length >= 25, `only ${lessons.length} lessons in the course`);

if (problems.length) {
  console.error("FAIL check-fr-questions");
  problems.forEach((problem) => console.error("  " + problem));
  process.exit(1);
}

console.log(
  `check-fr-questions: ${FR_QUESTIONS.length} questions across ${perLesson.size} topics `
  + `(${perLevel.easy} easy, ${perLevel.medium} medium, ${perLevel.hard} hard) in `
  + `${chapters.length} official themes, ${FR_TIMELINE.length} timeline entries in order, `
  + "and nothing shared between the lessons and the pool"
);
