#!/usr/bin/env node
/**
 * The "Życie w Polsce" practice bank has to be answerable.
 *
 * The same guard check-uk-questions, check-de-questions and check-fr-questions
 * put on the other three banks: a question with no correct option marks you
 * wrong whatever you pick, an id that names a lesson which does not exist
 * hides the question from every filter in the app, and two questions sharing
 * an id share a score.
 *
 * It carries the assertion the others carry too: nothing may be used twice.
 * The lessons close with quizzes of their own and the practice pool is drawn
 * from separately, so an overlap would show the learner the same question in
 * two places while keeping two records of it.
 *
 * WHAT IT DOES NOT PIN, and why. The other three check their numbers against
 * a real state exam. Poland has none: becoming a Polish citizen asks for a B1
 * certificate in the language, which tests Polish rather than Poland, and the
 * civic-knowledge test proposed in 2025 was never enacted. So the figures here
 * are the course's own — thirty questions, forty-five minutes, twenty-one to
 * pass — and this check holds them to being internally consistent rather than
 * to matching an outside authority: the pass mark has to be reachable within
 * the questions asked, and the exam cannot ask for more questions than the
 * bank holds.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { PL_QUESTIONS } from "./src/lib/plQuestionBank.ts";
      export { zycieWPolsceCourse } from "./src/lib/zycieWPolsceCourse.ts";
      export { PL_TIMELINE, PL_ERA_ORDER, PL_ERA_LABELS } from "./src/lib/zycieWPolsceTimeline.ts";
      export { PL_PACK, packCategories, packChapters } from "./src/lib/countryPacks.ts";
      export { COUNTRY_SEARCH_EXAMPLES } from "./src/lib/countrySearch.ts";
    `,
    resolveDir: root,
    sourcefile: "pl-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("pl-questions-check", module);
compiled.filename = path.join(root, ".pl-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  PL_QUESTIONS, zycieWPolsceCourse,
  PL_TIMELINE, PL_ERA_ORDER, PL_ERA_LABELS,
  PL_PACK, packCategories, COUNTRY_SEARCH_EXAMPLES,
} = compiled.exports;

const problems = [];
const lessons = zycieWPolsceCourse.lessons || [];
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

const normalise = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");

for (const question of PL_QUESTIONS) {
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
  // Four options with one right answer, the same shape the other three banks
  // use, so a learner moving between countries meets one kind of question.
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
  for (const block of lesson.blocks || []) {
    if (block.type !== "quiz") continue;
    courseQuizzes.set(normalise(block.q), lesson.id);
    const correct = (block.options || []).filter((option) => option.correct).length;
    if (correct !== 1) {
      problems.push(`lesson "${lesson.id}": a quiz has ${correct} correct options, not exactly one`);
    }
  }
}
for (const question of PL_QUESTIONS) {
  const key = normalise(question.q);
  if (courseQuizzes.has(key)) {
    problems.push(
      `question "${question.id}" already appears word for word in lesson "${courseQuizzes.get(key)}" — nothing twice`
    );
  }
}

// ── the practice test is possible on its own terms ─────────────────────────
// No outside authority to check against, so it is checked against itself: a
// pass mark above the questions asked can never be reached, and a test longer
// than the bank would repeat itself inside one sitting.
assert.ok(
  PL_PACK.exam.passMark <= PL_PACK.exam.questionCount,
  `the practice test asks ${PL_PACK.exam.questionCount} questions but wants ${PL_PACK.exam.passMark} right`
);
// The bank has to be able to fill a sitting without repeating inside it, and
// each topic and each difficulty has to hold enough to be worth filtering by.
// Those floors arrive with the bank itself: while it is still being written
// they would fail on work that is simply not finished yet, which reports the
// plan rather than a fault.
if (PL_QUESTIONS.length >= PL_PACK.exam.questionCount) {
  const thin = [...perLesson.entries()].filter(([, count]) => count < 8);
  for (const [lesson, count] of thin) {
    problems.push(`topic "${lesson}" has only ${count} question(s); the picker offers them in tens`);
  }
  for (const [level, count] of Object.entries(perLevel)) {
    if (count < 20) problems.push(`only ${count} questions at level "${level}"; that filter would repeat at once`);
  }
}

// ── the five chapters ──────────────────────────────────────────────────────
// The chapter names carry the shape of the course. A renamed or missing one
// is a course about something else.
const CHAPTERS = [
  "Symbole i wartości Rzeczypospolitej",
  "Ustrój i instytucje",
  "Historia Polski",
  "Geografia, gospodarka i Polska w świecie",
  "Społeczeństwo i życie codzienne",
];
const chapters = [];
for (const lesson of lessons) {
  if (!chapters.includes(lesson.section)) chapters.push(lesson.section);
}
for (const chapter of chapters) {
  if (!CHAPTERS.includes(chapter)) problems.push(`lesson chapter "${chapter}" is not one of the five`);
}

// ── the timeline reads forwards ────────────────────────────────────────────
const eras = new Set(PL_ERA_ORDER);
let previous = -Infinity;
for (const entry of [...PL_TIMELINE].sort((a, b) => (a.endYear ?? a.year) - (b.endYear ?? b.year))) {
  if (!eras.has(entry.era)) problems.push(`timeline "${entry.id}": era "${entry.era}" is not in PL_ERA_ORDER`);
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
for (const era of PL_ERA_ORDER) {
  if (!PL_ERA_LABELS[era]) problems.push(`era "${era}" has no label`);
}

// ── the picker can reach it ────────────────────────────────────────────────
assert.ok(
  Array.isArray(COUNTRY_SEARCH_EXAMPLES.pl) && COUNTRY_SEARCH_EXAMPLES.pl.length > 0,
  "Poland has no search examples, so its search box opens with nothing to try"
);
assert.ok(
  packCategories(PL_PACK).length === lessons.length,
  "the practice picker does not offer one topic per lesson"
);

if (problems.length) {
  console.error("FAIL check-pl-questions");
  problems.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-pl-questions: ${PL_QUESTIONS.length} questions across ${lessons.length} lessons in `
  + `${chapters.length} chapters, none repeated from a lesson quiz, ${PL_TIMELINE.length} timeline `
  + `entries in order — and a practice test of ${PL_PACK.exam.questionCount} that imitates no state exam, `
  + "because Poland holds none"
);
process.exit(0);
