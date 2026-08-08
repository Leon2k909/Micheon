#!/usr/bin/env node
/**
 * The review controls have to mean what they say.
 *
 * "Learning — Review tomorrow" did not review tomorrow. A date on the SRS
 * ladder is only the EARLIEST a review is wanted, and an item with repeated
 * mistakes is deliberately pulled back before it. That behaviour is right; the
 * label was not, and a control that lies about what it does is worse than one
 * that does less.
 *
 * So two things are checked here. The rungs must not promise an exact date,
 * and Snooze — the control that DOES promise one — must actually be a floor
 * that every other path respects.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const guided = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
const strength = fs.readFileSync(path.join(root, "src/lib/memoryStrength.ts"), "utf8");
const lesson = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");

// ── the rungs no longer promise a date they cannot keep ───────────────────
const levels = /const GUIDED_REVIEW_LEVELS[\s\S]*?\n\];/.exec(guided)?.[0] ?? "";
if (!levels) {
  failures.push("the review levels are gone");
} else {
  for (const promise of ["Review tomorrow", "Review in 3 days", "Review in 10 days", "Review in 30 days", "Review in 180 days"]) {
    if (levels.includes(promise)) {
      failures.push(`a rung still promises "${promise}", which the adaptive path can and does break`);
    }
  }
  // The middle rungs have to say the date is approximate.
  const hedged = (levels.match(/sooner if you slip/g) || []).length;
  if (hedged < 4) {
    failures.push("the timed rungs do not say the date can move, so they read as exact");
  }
}

// ── snooze exists, and is a hard floor ────────────────────────────────────
if (!/snoozedUntil\?: string;/.test(strength) || !/export function isSnoozed/.test(strength)
    || !/export function snoozeForDays/.test(strength)) {
  failures.push("there is no snooze, so there is no way to genuinely put an item off");
}
if (!/if \(isSnoozed\(record, now\)\) return false;/.test(strength)) {
  failures.push("a snoozed item can still report itself as due");
}

// Whether the lesson queue actually skips a put-off item — including one
// marked as a struggle, which is the case where the app has the strongest
// reason to overrule the learner — is checked by running it, further down.
if (!/\.filter\(\(item\) => !isSnoozed\(recordFor\(item\)\)\)/.test(lesson)) {
  failures.push("the pet can still quiz on a snoozed item, so putting it off only half works");
}
if (!/snoozeForDays\(days, Date\.now\(\), prior\)/.test(lesson)) {
  failures.push("choosing a snooze does not write anything, so it is forgotten immediately");
}

// ── and the panel says which of the two it is giving you ──────────────────
if (!/This one is a promise\. Nothing shows it before the date you pick\./.test(guided)) {
  failures.push("the snooze section does not say it is a hard floor");
}
if (!/The app can still bring it back early if you keep slipping\./.test(guided)) {
  failures.push("the level section does not admit that the app can bring items back early");
}

// Putting a phrase off means not doing it now, so something has to move --
// and what moves depends on where you are. Mid-lesson the exercise advances;
// on the preview it is the CARD that is swapped, because next() is the
// exercise's advance and does nothing there. Getting that wrong made the
// button appear completely dead on the flashcards.
const snoozeInLesson = guided.slice(
  guided.indexOf("const applyManualSnooze ="),
  guided.indexOf("const applyManualSnooze =") + 260,
);
if (!snoozeInLesson.includes("next();")) {
  failures.push("putting a phrase off mid-lesson leaves you sitting on it");
}
const snoozeInPreview = guided.slice(
  guided.indexOf("const snoozePreviewItem ="),
  guided.indexOf("const snoozePreviewItem =") + 300,
);
if (!snoozeInPreview.includes("onPreviewSwap")) {
  failures.push("putting a phrase off on the preview does not hand the slot back, so the button does nothing there");
}
// The preview is the intro, where the floating toast is deliberately
// suppressed -- so it has to show the notice itself or Undo is nowhere.
if (!guided.includes("notice={lastManualReviewChange}")) {
  failures.push("the preview cannot show the put-off notice, so Undo is unreachable there");
}
if (!guided.includes("notice?.subject &&")) {
  failures.push("the marked-as note does not name the phrase, so Undo refers to something unidentifiable");
}
// Built through uiFmt, or it lands untranslated in the middle of a German
// sentence -- and reads as "Put off until in a month" in English.
if (guided.includes("`Put off until ${")) {
  failures.push("the put-off label is glued together in JS, so it cannot translate and reads wrong in English");
}
// ── and putting one off holds for a phrase you have NEVER answered ────────
//
// This is the case that was broken, and it is the common one: you meet a new
// sentence on the preview flashcards, decide you do not want it, and put it
// off for a month. The record was written correctly — and then ignored, because
// every reader looked the record up through its GRADE. An ungraded record is
// invisible to findRecord and reads as "new" to statusForId, so the phrase came
// straight back on the next Continue Learning. Run the engine and check.
const Module = require("module");
const esbuild = require("esbuild");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildSession, isReinforcementEligible } from "./src/session.ts";',
      'export { snoozeForDays, recordSuccess } from "./src/lib/memoryStrength.ts";',
      'export { isAttemptedPracticeEligible, isAdaptiveReinforcementEligible } from "./src/lib/adaptivePractice.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "review-honesty-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("review-honesty-check", module);
compiled.filename = path.join(root, ".review-honesty-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  buildSession, isReinforcementEligible, snoozeForDays, recordSuccess,
  isAttemptedPracticeEligible, isAdaptiveReinforcementEligible,
} = compiled.exports;

const PUT_OFF = "Bist du am Sonntag frei?";
const probePart = {
  partKey: "probe",
  level: "A1",
  vocab: [],
  dialogues: [],
  phrases: [{ de: PUT_OFF, en: "Are you free on Sunday?" }, { de: "Ich habe Hunger.", en: "I am hungry." }],
};
const servedWith = (record) =>
  buildSession(probePart, [], { "probe-phrase-0": record }, 0)
    .filter((step) => step.item)
    .map((step) => step.item.de);

// Never graded, put off for a month.
if (servedWith(snoozeForDays(30)).includes(PUT_OFF)) {
  failures.push("a NEW phrase put off for a month comes back in the next lesson, so the put-off does nothing until an item has been graded");
}
// Answered but never graded, put off.
if (servedWith(snoozeForDays(30, Date.now(), { answerAttempts: 3 })).includes(PUT_OFF)) {
  failures.push("a phrase that was attempted and then put off comes back as optional practice");
}
// Marked as a struggle, put off.
if (servedWith(snoozeForDays(30, Date.now(), { lastGrade: "struggle", updatedAt: new Date().toISOString() })).includes(PUT_OFF)) {
  failures.push("a struggling phrase that was put off comes back anyway");
}
// Learned yesterday and put off: weak enough for the familiar half, which is
// reached by a path that treats "not due" as an invitation.
const weakKnown = snoozeForDays(30, Date.now(), recordSuccess(Date.now(), undefined));
if (isReinforcementEligible(weakKnown)) {
  failures.push("a recently learned phrase that was put off still qualifies for the familiar half");
}
// And the same for the difficult-sentence path, which brings a known phrase
// back BEFORE its review date precisely because it keeps going wrong. A record
// built to sail past that bar: answered, struggling, and not yet due.
const difficultKnown = snoozeForDays(30, Date.now(), {
  lastGrade: "know",
  dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  answerAttempts: 4,
  answerMistakes: 3,
  difficultyDebt: 3,
  lastMistakeAt: new Date().toISOString(),
});
if (isAdaptiveReinforcementEligible(difficultKnown, { de: PUT_OFF, en: "Are you free on Sunday?", level: "A1" })) {
  failures.push("a difficult phrase that was put off is still pulled back early for extra practice");
}
if (isAttemptedPracticeEligible(snoozeForDays(30, Date.now(), { answerAttempts: 3 }))) {
  failures.push("an attempted phrase that was put off still qualifies as attempted practice");
}
// The floor must LIFT. Putting something off is not deleting it.
if (!servedWith(snoozeForDays(0)).includes(PUT_OFF)) {
  failures.push("a phrase whose put-off has expired never comes back, so putting it off deletes it");
}

// Continue Learning picks its new material from the catalogue by STATUS, which
// an ungraded record does not change — so that pool needs the check of its own
// that the engine cannot give it.
const freshPool = lesson.slice(
  lesson.indexOf('if (statusForId(reviewState, item.id, item.aliases) !== "new") return;'),
  lesson.indexOf('if (statusForId(reviewState, item.id, item.aliases) !== "new") return;') + 600,
);
if (!freshPool.includes("isSnoozed(progressRecord)")) {
  failures.push("the new-material pool does not check the put-off, so a put-off phrase returns as new material");
}

if (failures.length) {
  console.error("FAIL check-review-honesty");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-review-honesty: the rungs describe what actually happens, and snooze is a floor that the lesson queue, the pet and the due check all respect");
