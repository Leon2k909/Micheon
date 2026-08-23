#!/usr/bin/env node
/**
 * The "Leben in Deutschland" practice bank has to be answerable.
 *
 * The same guard check-uk-questions puts on the British bank, for the German
 * one: a question with no correct option marks you wrong whatever you pick,
 * an id that names a lesson which does not exist hides the question from every
 * filter in the app, and two questions sharing an id share a score.
 *
 * It carries one assertion the UK check does not: nothing may be used twice.
 * The lessons close with quizzes of their own, and the practice
 * pool is drawn from separately. If the same question appeared in both, the
 * learner would meet it twice and the two records would drift apart. So the
 * two sets are compared here and any overlap fails the build.
 */
const assert = require("assert");
const fs = require("fs");
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
  // Fourteen per lesson is what the bank holds; ten is the floor at which
  // the topic picker can still offer a fresh set of ten.
  if (count < 10) {
    problems.push(`Bereich "${category.title}" hat nur ${count} Frage(n); der Themenwähler bietet 10 auf einmal an`);
  }
}

// All three difficulties have to be usable as a filter on their own.
for (const [level, count] of Object.entries(perLevel)) {
  if (count < 20) problems.push(`nur ${count} Fragen der Stufe "${level}"; dieser Filter wiederholte sich sofort`);
}

// ── the timeline ───────────────────────────────────────────────────────────
// Same rule as the British one: a span sorts by the year it
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

// ── die Prüfungszahlen ─────────────────────────────────────────────────────
// Der echte Test "Leben in Deutschland" hat 33 Fragen in 60 Minuten, 17 zum
// Bestehen. Der britische hat 24 in 45 mit 18. Beide Sätze stehen in der
// Oberfläche, und beide müssen die Zahlen ihres eigenen Landes nennen.
const packs = (() => {
  const b = esbuild.buildSync({
    stdin: {
      contents: 'export { UK_PACK, DE_PACK } from "./src/lib/countryPacks.ts";',
      resolveDir: root,
      sourcefile: "packs-entry.ts",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20",
    write: false, logLevel: "silent",
  });
  const m = new Module("packs-check", module);
  m.filename = path.join(root, ".packs-check.cjs");
  m.paths = Module._nodeModulePaths(root);
  m._compile(b.outputFiles[0].text, m.filename);
  return m.exports;
})();

assert.strictEqual(packs.DE_PACK.exam.questionCount, 33, "der deutsche Test hat 33 Fragen");
assert.strictEqual(packs.DE_PACK.exam.durationMs, 60 * 60 * 1000, "und 60 Minuten Zeit");
assert.strictEqual(packs.DE_PACK.exam.passMark, 17, "und 17 richtige zum Bestehen");
assert.strictEqual(packs.UK_PACK.exam.questionCount, 24, "der britische Test bleibt bei 24 Fragen");
assert.strictEqual(packs.UK_PACK.exam.passMark, 18, "und bei 18 zum Bestehen");
assert.notStrictEqual(packs.DE_PACK.storeKey, packs.UK_PACK.storeKey, "getrennte Speicher, getrennter Fortschritt");

// Und der Satz auf dem Prüfungsbildschirm muss formatiert sein, nicht fest:
// eine feste Zahl dort war genau der Fehler.
const testView = fs.readFileSync(
  path.join(root, "src/components/lifeInTheUk/UkTestView.tsx"), "utf8"
);
assert.ok(
  /uiFmt\(\s*"The exam simulation is the real thing: \{count\} questions, \{minutes\} minutes, \{pass\} to pass\."/.test(testView),
  "der Prüfungssatz nimmt die Zahlen des Landes, statt sie fest zu nennen"
);
assert.ok(
  !/24 questions, 45 minutes, 18 to pass\.\"\)/.test(testView),
  "und die alte feste Fassung wird nicht mehr ausgegeben"
);

assert.ok(DE_QUESTIONS.length >= 300, `nur ${DE_QUESTIONS.length} Fragen im Pool`);
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
