const fs = require("node:fs");
const path = require("node:path");

const guided = fs.readFileSync(path.resolve(__dirname, "../src/GuidedSession.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const styles = fs.readFileSync(path.resolve(__dirname, "../src/index.css"), "utf8").replace(/\r\n?/gu, "\n");

const checks = [
  ["the lesson progress opens an accessible navigator", guided.includes('aria-controls={!inIntro ? "lesson-navigator" : undefined}') && guided.includes('aria-haspopup={!inIntro ? "dialog" : undefined}')],
  ["every real lesson step gets a numbered destination", guided.includes("lessonStepIndexes.map((stepIndex, lessonOffset)")],
  ["numbered destinations jump directly to the selected lesson", guided.includes("onClick={() => jumpToLesson(lessonNumber)}") && guided.includes("setIndex(targetIndex);")],
  ["direct jumps leave unfinished work uncompleted", guided.includes("if (current) onAdvance?.(current, true, performance);")],
  ["the struggle action saves the current lesson before advancing", guided.includes('gradeItem(struggleId, "struggle")') && guided.includes("jumpToLesson(nextLessonNumber, true);")],
  ["completed lesson numbers receive their own state", guided.includes('isCompleted && "is-complete"') && styles.includes(".fs-lesson-number.is-complete:not(.is-current)")],
  ["the navigator uses the light Micheon guided-session theme", styles.includes(".prototype-guided-session .fs-lesson-navigator") && styles.includes(".prototype-guided-session .fs-lesson-number.is-current")],
];

let failed = false;
for (const [label, passed] of checks) {
  if (passed) console.log(`ok   ${label}`);
  else {
    failed = true;
    console.error(`FAIL ${label}`);
  }
}

if (failed) process.exit(1);
console.log("Guided lesson navigation is guarded.");
