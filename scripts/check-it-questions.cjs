#!/usr/bin/env node
/**
 * The "Vivere in Italia" practice bank has to be answerable.
 *
 * The same guard check-uk-questions, check-de-questions, check-fr-questions
 * and check-pl-questions put on the other four banks: a question with no
 * correct option marks you wrong whatever you pick, an id that names a lesson
 * which does not exist hides the question from every filter in the app, and
 * two questions sharing an id share a score.
 *
 * It carries the assertion the others carry too: nothing may be used twice.
 * The lessons close with quizzes of their own and the practice pool is drawn
 * separately, so an overlap would show the learner the same question in two
 * places while keeping two records of it.
 *
 * WHAT IT DOES NOT PIN, and why. Three of those banks check their numbers
 * against a real state exam. Italy has none: citizenship asks for a B1
 * certificate in the language and the long-stay permit for an A2 test, both
 * of which examine Italian rather than Italy, and the integration agreement
 * awards credits for civic sessions without an examination at the end. So the
 * figures here are the course's own — thirty questions, forty-five minutes,
 * twenty-one to pass — and this check holds them to being internally
 * consistent rather than to matching an outside authority.
 *
 * THE VOLUME FLOORS ARE PROPORTIONAL, unlike the Polish sibling's. That one
 * switches its floors on only once the bank is longer than a sitting, so
 * while the course is being written they cannot bite at all. Asking instead
 * that each difficulty hold a tenth of the pool is a rule that holds at every
 * size, including the sizes a half-written bank passes through.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { IT_QUESTIONS } from "./src/lib/itQuestionBank.ts";
      export { vivereInItaliaCourse } from "./src/lib/vivereInItaliaCourse.ts";
      export { IT_TIMELINE, IT_ERA_ORDER, IT_ERA_LABELS } from "./src/lib/vivereInItaliaTimeline.ts";
      export { IT_PACK, packCategories } from "./src/lib/countryPacks.ts";
      export { COUNTRY_SEARCH_EXAMPLES } from "./src/lib/countrySearch.ts";
    `,
    resolveDir: root,
    sourcefile: "it-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("it-questions-check", module);
compiled.filename = path.join(root, ".it-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  IT_QUESTIONS, vivereInItaliaCourse,
  IT_TIMELINE, IT_ERA_ORDER, IT_ERA_LABELS,
  IT_PACK, packCategories, COUNTRY_SEARCH_EXAMPLES,
} = compiled.exports;

const problems = [];
const lessons = vivereInItaliaCourse.lessons || [];
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

const normalise = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");

for (const question of IT_QUESTIONS) {
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
  // Four options with one right answer, the same shape the other four banks
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
  // Three per lesson is this course's own shape, chosen when it was planned.
  // Stated here so a lesson cannot quietly arrive with one.
  if (quizzes !== 3) problems.push(`lesson "${lesson.id}" closes with ${quizzes} quizzes, not three`);
}
for (const question of IT_QUESTIONS) {
  const key = normalise(question.q);
  if (courseQuizzes.has(key)) {
    problems.push(
      `question "${question.id}" already appears word for word in lesson "${courseQuizzes.get(key)}" — nothing twice`
    );
  }
}

// ── the practice test is possible on its own terms ─────────────────────────
// No outside authority to check against, so it is checked against itself: a
// pass mark above the questions asked can never be reached.
assert.ok(
  IT_PACK.exam.passMark <= IT_PACK.exam.questionCount,
  `the practice test asks ${IT_PACK.exam.questionCount} questions but wants ${IT_PACK.exam.passMark} right`
);
// Each topic and each difficulty has to hold enough to be worth filtering by.
// Proportional rather than absolute, so the rule means the same thing at
// sixty-five questions as at three hundred.
for (const [lesson, count] of perLesson) {
  if (count < 8) problems.push(`topic "${lesson}" has only ${count} question(s); the picker offers them in tens`);
}
const levelFloor = Math.floor(IT_QUESTIONS.length / 10);
for (const [level, count] of Object.entries(perLevel)) {
  if (count < levelFloor) {
    problems.push(
      `level "${level}" holds ${count} of ${IT_QUESTIONS.length} questions, under a tenth; that filter would repeat at once`
    );
  }
}

// ── the five chapters ──────────────────────────────────────────────────────
// The chapter names carry the shape of the course. A renamed one is a course
// about something else. The first two take their titles from the Constitution,
// which is how Italy divides this material itself.
const CHAPTERS = [
  "Simboli e principi fondamentali",
  "L'ordinamento della Repubblica",
  "Storia d'Italia",
  "Territorio, economia e l'Italia nel mondo",
  "Società e vita quotidiana",
];
const chapters = [];
for (const lesson of lessons) {
  if (!chapters.includes(lesson.section)) chapters.push(lesson.section);
}
for (const chapter of chapters) {
  if (!CHAPTERS.includes(chapter)) problems.push(`lesson chapter "${chapter}" is not one of the five`);
}

// ── the timeline reads forwards ────────────────────────────────────────────
const eras = new Set(IT_ERA_ORDER);
let previous = -Infinity;
for (const entry of [...IT_TIMELINE].sort((a, b) => (a.endYear ?? a.year) - (b.endYear ?? b.year))) {
  if (!eras.has(entry.era)) problems.push(`timeline "${entry.id}": era "${entry.era}" is not in IT_ERA_ORDER`);
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
for (const era of IT_ERA_ORDER) {
  if (!IT_ERA_LABELS[era]) problems.push(`era "${era}" has no label`);
}

// ── the picker can reach it ────────────────────────────────────────────────
assert.ok(
  Array.isArray(COUNTRY_SEARCH_EXAMPLES.it) && COUNTRY_SEARCH_EXAMPLES.it.length > 0,
  "Italy has no search examples, so its search box opens with nothing to try"
);
assert.ok(
  packCategories(IT_PACK).length === lessons.length,
  "the practice picker does not offer one topic per lesson"
);

if (problems.length) {
  console.error("FAIL check-it-questions");
  problems.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-it-questions: ${IT_QUESTIONS.length} questions across ${lessons.length} lessons in `
  + `${chapters.length} chapters, three quizzes each, none repeated from a lesson, `
  + `${IT_TIMELINE.length} timeline entries in order — and a practice test of `
  + `${IT_PACK.exam.questionCount} that imitates no state exam, because Italy holds none`
);
process.exit(0);
