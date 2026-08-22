#!/usr/bin/env node
/**
 * The "Leben in Deutschland" practice bank has to be answerable.
 *
 * The same guard check-uk-questions puts on the British bank, for the German
 * one: a question with no correct option marks you wrong whatever you pick,
 * an id that names a lesson which does not exist hides the question from every
 * filter in the app, and two questions sharing an id share a score.
 *
 * It carries one assertion the UK check does not, because Michelle asked for
 * it in so many words — "berücksichtige aber bitte dinge nicht doppelt zu
 * verwenden". The lessons close with quizzes of their own, and the practice
 * pool is drawn from separately. If the same question appeared in both, the
 * learner would meet it twice and the two records would drift apart. So the
 * two sets are compared here and any overlap fails the build.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { DE_QUESTIONS, deCategories } from "./src/lib/deQuestionBank.ts";
      export { lebenInDeutschlandCourse } from "./src/lib/lebenInDeutschlandCourse.ts";
      export { DE_TIMELINE, deTimelineSorted } from "./src/lib/lebenInDeutschlandTimeline.ts";
    `,
    resolveDir: root,
    sourcefile: "de-questions-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("de-questions-check", module);
compiled.filename = path.join(root, ".de-questions-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { DE_QUESTIONS, deCategories, lebenInDeutschlandCourse, DE_TIMELINE, deTimelineSorted } = compiled.exports;

const problems = [];
const lessons = lebenInDeutschlandCourse.lessons || [];
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const seenIds = new Set();
const seenQuestions = new Map();
const LEVELS = new Set(["easy", "medium", "hard"]);
const perLesson = new Map();
const perLevel = { easy: 0, medium: 0, hard: 0 };

const normalise = (text) => String(text).trim().toLowerCase().replace(/\s+/g, " ");

for (const question of DE_QUESTIONS) {
  const where = `Frage "${question.id}"`;

  if (!question.id) problems.push("eine Frage hat keine id");
  if (seenIds.has(question.id)) problems.push(`${where}: doppelte id — zwei Fragen teilten sich einen Fortschritt`);
  seenIds.add(question.id);

  if (!lessonIds.has(question.lesson)) {
    problems.push(`${where}: nennt Lektion "${question.lesson}", die es im Kurs nicht gibt`);
  }
  perLesson.set(question.lesson, (perLesson.get(question.lesson) || 0) + 1);

  if (!LEVELS.has(question.level)) problems.push(`${where}: unbekannte Schwierigkeit "${question.level}"`);
  else perLevel[question.level] += 1;

  if (!question.q) problems.push(`${where}: kein Fragetext`);
  if (!question.explanation) problems.push(`${where}: keine Erklärung — eine falsche Antwort lehrte nichts`);

  const options = question.options || [];
  if (options.length < 2) problems.push(`${where}: braucht mindestens zwei Optionen`);
  for (const option of options) {
    if (!option || !String(option).trim()) problems.push(`${where}: eine Option ist leer`);
  }
  if (new Set(options).size !== options.length) {
    problems.push(`${where}: doppelte Optionen — zwei gleiche Auswahlen können nicht beide gelten`);
  }

  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= options.length) {
    problems.push(`${where}: Antwortindex ${question.answer} liegt außerhalb der ${options.length} Optionen`);
  }

  const key = normalise(question.q);
  if (seenQuestions.has(key)) {
    problems.push(`${where}: gleicher Fragetext wie "${seenQuestions.get(key)}"`);
  }
  seenQuestions.set(key, question.id);
}

// ── nothing used twice ─────────────────────────────────────────────────────
// The quizzes inside the lessons and the practice pool have to stay disjoint.
const courseQuizzes = new Map();
for (const lesson of lessons) {
  for (const block of lesson.blocks || []) {
    if (block.type !== "quiz") continue;
    courseQuizzes.set(normalise(block.q), lesson.id);

    // While we are here: a lesson quiz needs exactly one correct option, for
    // the same reason a pool question does.
    const correct = (block.options || []).filter((option) => option.correct).length;
    if (correct !== 1) {
      problems.push(`Lektion "${lesson.id}": eine Quizfrage hat ${correct} richtige Optionen, nicht genau eine`);
    }
  }
}
for (const question of DE_QUESTIONS) {
  const key = normalise(question.q);
  if (courseQuizzes.has(key)) {
    problems.push(
      `Frage "${question.id}" steht wörtlich schon in Lektion "${courseQuizzes.get(key)}" — nichts doppelt verwenden`
    );
  }
}

// Every category has to be practisable, or the topic picker offers a dead end.
for (const category of deCategories()) {
  const count = perLesson.get(category.id) || 0;
  if (count < 5) {
    problems.push(`Bereich "${category.title}" hat nur ${count} Frage(n); der Themenwähler bietet 10 auf einmal an`);
  }
}

// All three difficulties have to be usable as a filter on their own.
for (const [level, count] of Object.entries(perLevel)) {
  if (count < 20) problems.push(`nur ${count} Fragen der Stufe "${level}"; dieser Filter wiederholte sich sofort`);
}

// ── the timeline ───────────────────────────────────────────────────────────
// Same rule Michelle set for the British one: a span sorts by the year it
// ENDED, so a fourteen-year republic does not appear to be over before it
// began. And an end before its start is a typo, not a span.
const sorted = deTimelineSorted();
for (let index = 1; index < sorted.length; index += 1) {
  const previous = sorted[index - 1];
  const current = sorted[index];
  const previousYear = previous.endYear ?? previous.year;
  const currentYear = current.endYear ?? current.year;
  if (previousYear > currentYear) {
    problems.push(`Zeitleiste: "${current.title}" steht nach "${previous.title}", ist aber früher`);
  }
}
for (const entry of DE_TIMELINE) {
  if (entry.endYear !== undefined && entry.endYear < entry.year) {
    problems.push(`Zeitleiste: "${entry.title}" endet (${entry.endYear}) vor seinem Beginn (${entry.year})`);
  }
  if (!entry.tags || entry.tags.length === 0) {
    problems.push(`Zeitleiste: "${entry.title}" hat keine Schlagwörter — die Suche fände es über nichts`);
  }
}

assert.ok(DE_QUESTIONS.length >= 130, `nur ${DE_QUESTIONS.length} Fragen im Pool`);
assert.ok(lessons.length >= 23, `nur ${lessons.length} Lektionen im Kurs`);

if (problems.length) {
  console.error("FAIL check-de-questions");
  problems.forEach((problem) => console.error("  " + problem));
  process.exit(1);
}

console.log(
  `check-de-questions: ${DE_QUESTIONS.length} Fragen in ${perLesson.size} Bereichen `
  + `(${perLevel.easy} leicht, ${perLevel.medium} mittel, ${perLevel.hard} schwer), `
  + `${DE_TIMELINE.length} Zeitleisteneinträge chronologisch, `
  + "keine Frage doppelt zwischen Kurs und Übungspool"
);
