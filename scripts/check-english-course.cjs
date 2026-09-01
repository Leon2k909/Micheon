#!/usr/bin/env node
/**
 * English is a course you can pick, not just a hidden direction.
 *
 * The app has always been able to teach English to a German speaker -- that is
 * the learn-en direction, the same content read the other way. It was simply
 * never listed as a course, so the course picker offered German and nothing
 * else, and the dashboard told someone learning English that their active
 * course was German, every single visit.
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];

const registry = fs.readFileSync(path.join(root, "src/lib/courseRegistry.ts"), "utf8");
const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/prototype/new-ui-prototype.css"), "utf8");

// ── it is listed, and listed as something you can actually start ──────────
const entry = /\{[^{}]*id:\s*"english-uk"[\s\S]*?\}/.exec(registry)?.[0] ?? "";
const entryUs = /\{[^{}]*id:\s*"english-us"[\s\S]*?\}/.exec(registry)?.[0] ?? "";
if (!entry) {
  failures.push("English (UK) is not in the course registry, so it cannot be picked");
} else if (!entryUs) {
  failures.push("English (US) is missing, so British and American cannot be told apart");
} else {
  if (!/available:\s*true/.test(entry)) failures.push("English is listed but marked unavailable");
  if (!/builtIn:\s*true/.test(entry)) failures.push("English is not marked built-in, so it would open the third-party course shell");
}

// ── picking it moves the direction, not just the stored id ────────────────
if (!/courseId === "english-uk" \|\| courseId === "english-us"\)/.test(shell)
    || !/setLearningDirection\("learn-en"\)/.test(shell)
    || !/setEnglishVariant\(/.test(shell)) {
  failures.push("choosing English does not switch the learning direction, so the app would keep teaching German");
}
if (!/courseId === "german"\)\s*setLearningDirection\("learn-de"\)/.test(shell)) {
  failures.push("choosing German does not switch back");
}

// ── and the direction wins over a stale stored id ─────────────────────────
// Installs that were learning English before English was listed still have
// "german" saved; the dashboard must not believe it.
if (!/learningEnglish\(\)[\s\S]{0,200}"english-us"[\s\S]{0,60}"english-uk"/.test(shell)) {
  failures.push("the active course is read from storage alone, so an existing learn-en install still shows German");
}

// ── the hero stops asserting German ───────────────────────────────────────
if (/ui\("Switch course, currently German"\)/.test(shell)) {
  failures.push("the course chip still hardcodes German");
}
// Named from the course rather than chosen between two spellings: with a third
// course, "English or German" is a question with a missing answer.
if (!/<strong>\{ui\(sides\.target\.label\)\}<\/strong>/.test(shell)) {
  failures.push("the course chip does not name the course you are actually on");
}
// "{language} for real conversations" was the old course hero's headline.
// That hero was replaced by the LanguageCard in v1.2.438 and never rendered
// again; it went in the dead-code pass, and this had been asserting a line on
// a screen nobody could reach. The rule — the course you are on is named,
// not hard-coded as German — is the chip assertion above, which is live.
if (!/\.np-language-badge\.is-english/.test(css)) {
  failures.push("there is no English flag, so the chip would show German stripes beside the word English");
}

if (failures.length) {
  console.error("FAIL check-english-course");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("check-english-course: English is a pickable built-in course, choosing it moves the direction, and the dashboard names the course you are actually on");
