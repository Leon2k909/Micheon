#!/usr/bin/env node
/**
 * Every quiz in an in-app course must have exactly one right answer.
 *
 * This is the failure that would never throw and never look broken. A quiz
 * with no correct option marks the learner wrong whatever they pick; a quiz
 * with two marks them wrong for choosing the other right one. Someone
 * revising for the Life in the UK Test — which they pay to sit, and which
 * needs 18 of 24 — would conclude they had misunderstood the material.
 *
 * So this reads the real course objects and checks the shape of every block.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { COURSES } from "./src/lib/courseRegistry.ts";',
      'export { UK_QUESTIONS } from "./src/lib/ukQuestionBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "courses-entry.ts",
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
const compiled = new Module("courses-check", module);
compiled.filename = path.join(root, ".courses-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { COURSES, UK_QUESTIONS } = compiled.exports;

const problems = [];
let quizzes = 0;
let lessons = 0;

for (const course of COURSES) {
  if (!course.lessons || course.lessons.length === 0) continue;

  const lessonIds = new Set();
  for (const lesson of course.lessons) {
    lessons++;
    const where = `${course.id}/${lesson.id}`;

    if (lessonIds.has(lesson.id)) problems.push(`${where}: duplicate lesson id`);
    lessonIds.add(lesson.id);
    if (!lesson.title) problems.push(`${where}: no title`);
    if (!lesson.section) problems.push(`${where}: no section`);
    if (!lesson.blocks || lesson.blocks.length === 0) problems.push(`${where}: no blocks`);

    for (const [index, block] of (lesson.blocks || []).entries()) {
      const at = `${where} block ${index} (${block.type})`;

      switch (block.type) {
        case "quiz": {
          quizzes++;
          const options = block.options || [];
          const correct = options.filter((option) => option.correct).length;
          if (options.length < 2) problems.push(`${at}: needs at least two options`);
          if (correct !== 1) {
            problems.push(
              `${at}: ${correct} correct answers, expected exactly 1 — "${String(block.q).slice(0, 60)}"`
            );
          }
          if (!block.q) problems.push(`${at}: no question text`);
          // The explanation is what turns a wrong answer into learning, and
          // the renderer shows it either way. A quiz without one is a dead end.
          if (!block.explanation) problems.push(`${at}: no explanation`);
          const seen = new Set();
          for (const option of options) {
            if (!option.text) problems.push(`${at}: an option has no text`);
            if (seen.has(option.text)) problems.push(`${at}: duplicate option "${option.text}"`);
            seen.add(option.text);
          }
          break;
        }
        case "p":
        case "h3":
          if (!block.text) problems.push(`${at}: empty text`);
          break;
        case "callout":
          if (!block.text) problems.push(`${at}: empty text`);
          if (!["why", "warn", "sbox", "python", "analogy"].includes(block.variant)) {
            problems.push(`${at}: unknown variant "${block.variant}"`);
          }
          break;
        case "code":
          if (!block.code) problems.push(`${at}: empty code`);
          break;
        case "cards":
          if (!block.items || block.items.length === 0) problems.push(`${at}: no items`);
          for (const item of block.items || []) {
            if (!item.h4 || !item.p) problems.push(`${at}: a card is missing its heading or body`);
          }
          break;
        case "cta":
          if (!block.title || !block.sub) problems.push(`${at}: incomplete call to action`);
          break;
        case "twocol":
          if (!block.left?.code || !block.right?.code) problems.push(`${at}: incomplete columns`);
          break;
        default:
          problems.push(`${at}: unknown block type`);
      }
    }
  }
}

// The Life in the UK course exists to get someone through a real exam, so the
// syllabus coverage is pinned rather than left to drift.
const uk = COURSES.find((course) => course.id === "life-in-the-uk");
assert.ok(uk, "the Life in the UK course should be registered");
assert.strictEqual(uk.kind, "citizenship", "it is not a language or a programming course");
assert.ok(uk.available, "it should be selectable, not marked coming soon");
const sections = new Set((uk.lessons || []).map((lesson) => lesson.section));
for (const required of [
  "Values and principles",
  "What is the UK?",
  "A long and illustrious history",
  "A modern, thriving society",
  "Government, the law and your role",
]) {
  assert.ok(sections.has(required), `the syllabus chapter "${required}" has no lessons`);
}
// This used to require 20+ quiz blocks inside the Life in the UK lessons,
// written when those blocks were the only practice that existed. They are not
// any more: the practice bank holds 240+ questions with difficulty levels,
// spaced repetition and a mistakes list, and Michelle asked for the quizzes to
// come out of the lessons so reading a topic stays reading a topic.
//
// The requirement itself is still worth keeping — a citizenship course with
// nothing to answer is no use — so it now counts the bank, which is where the
// questions actually live. check-uk-questions pins their shape; this pins that
// enough of them exist at all.
assert.ok(
  UK_QUESTIONS.length >= 100,
  `only ${UK_QUESTIONS.length} practice questions in the bank; the real test asks 24 and a bank that small would repeat`
);

if (problems.length) {
  console.error("FAIL check-courses");
  problems.forEach((problem) => console.error("  " + problem));
  process.exit(1);
}

console.log(
  `check-courses: ${lessons} lessons across ${COURSES.filter((c) => c.lessons?.length).length} in-app courses, `
  + `${quizzes} quizzes each with exactly one right answer and an explanation`
);
