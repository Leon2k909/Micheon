#!/usr/bin/env node
/**
 * A German account reads the programming course in German.
 *
 * The course-translation machinery was built for the citizenship courses,
 * where English on top and German on tap is exactly right: the English of Life
 * in the UK IS the practice. A programming course is the opposite — nobody
 * opens "C# for s&box" to practise their English, and for a reader whose app
 * is in German the English is one more thing between them and the C#. So a
 * programming course follows the interface language instead.
 *
 * Three ways that rots, and none of them is visible on screen until somebody
 * switches their account to German:
 *   1. a string the course renders that has no German — it silently falls back
 *      to English, so the lesson comes out half-translated,
 *   2. a translation that rewrote something inside backticks. That text is
 *      what the reader has to TYPE; a translated identifier is a lesson
 *      teaching code the compiler rejects, and
 *   3. a screen that gets its course from somewhere other than getCourse(),
 *      which is the one place the localising happens.
 *
 * So this runs the real lookup and reads the real course back, in both
 * languages.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

function loadCourse({ german }) {
  const built = esbuild.buildSync({
    stdin: {
      contents: 'export { getCourse } from "./src/lib/courseRegistry.ts";\n'
        + 'export { CSHARP_COURSE_DE } from "./src/lib/csharpCourseDe.ts";\n'
        + 'export { csharpCourse } from "./src/lib/csharpCourse.ts";',
      resolveDir: root,
      sourcefile: "course-language-entry.ts",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
  });
  const store = new Map();
  if (german) store.set("gl-interface-language", "de");
  global.window = {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  };
  global.localStorage = global.window.localStorage;
  const compiled = new Module(`course-language-${german}`, module);
  compiled.filename = path.join(root, `.course-language-${german}.cjs`);
  compiled.paths = Module._nodeModulePaths(root);
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  return compiled.exports;
}

/** Every string a reader actually reads, with the code blocks left out. */
function readableStrings(course) {
  const out = [];
  const add = (kind, value) => {
    const text = String(value || "").trim();
    if (text) out.push({ kind, text });
  };
  add("name", course.name);
  add("tagline", course.tagline);
  for (const lesson of course.lessons || []) {
    add("title", lesson.title);
    add("section", lesson.section);
    for (const block of lesson.blocks || []) {
      switch (block.type) {
        case "p": case "callout":
          add(block.type, block.text); add(block.type, block.textJs); add(block.type, block.textNew); break;
        case "h3": add("h3", block.text); break;
        case "cards":
          for (const item of block.items || []) { add("card", item.h4); add("card", item.p); }
          break;
        case "quiz":
          add("quiz", block.q);
          for (const option of block.options || []) add("quiz", option.text);
          add("quiz", block.explanation);
          break;
        case "cta": add("cta", block.title); add("cta", block.sub); break;
        default: break; // `code` is never translated, by design
      }
    }
  }
  return out;
}

/**
 * Is this string pure code, or something a reader reads?
 *
 * The quiz options that answer "which call do you use" are `Log.Info()` and
 * `GetComponent<Rigidbody>()`; the comparison columns are labelled "Python"
 * and "C#". Those must NOT be translated, so they cannot be counted as gaps —
 * but the test has to be narrow, or a real German sentence hides behind it.
 */
function isPureCode(text) {
  if (/^(Python|JavaScript|C#|s&box|LINQ)$/.test(text)) return true;
  // A call, a member chain or a generic — something with punctuation only
  // code has. A BARE word is deliberately NOT code here, however
  // identifier-shaped it looks: "Loops", "Classes", "Interfaces" and
  // "Cameras" are lesson titles, and treating them as code let a missing
  // translation for any one-word heading pass unnoticed. The API names that
  // genuinely are bare words — Scene, GameObject, HoldType — are answered in
  // the table by an entry that maps them to themselves, so they never reach
  // this test at all.
  if (!/[.(<]/.test(text)) return false;
  // Outside its own argument list, code has no spaces. That is what separates
  // `Scene.GetAllComponents<Rigidbody>()` from "Sound.Play(EngineLoop,
  // WorldPosition) — the position parameter tracks the object", which starts
  // the same way and is a sentence.
  const outside = text.replace(/\([^)]*\)/g, "()").replace(/^new\s+/, "");
  return !/\s/.test(outside);
}

const english = loadCourse({ german: false });
const englishCourse = english.getCourse("csharp");
const germanApi = loadCourse({ german: true });
const germanCourse = germanApi.getCourse("csharp");

// ── the English course is untouched when the app is in English ──────────────
assert.strictEqual(englishCourse.name, "C# for s&box",
  "the course was translated for an account that never asked for German");
assert.ok(englishCourse.lessons.length > 0, "the course has no lessons at all");

// ── and comes back German when the app is in German ─────────────────────────
assert.notStrictEqual(germanCourse.name, englishCourse.name,
  "a German account still gets the English course name — getCourse is not localising");
assert.strictEqual(germanCourse.lessons.length, englishCourse.lessons.length,
  "localising changed how many lessons there are");

// Progress is stored against lesson ids. Translate one and every finished
// lesson silently un-finishes itself the moment the app language changes.
const englishIds = englishCourse.lessons.map((lesson) => lesson.id);
const germanIds = germanCourse.lessons.map((lesson) => lesson.id);
assert.deepStrictEqual(germanIds, englishIds,
  "lesson ids changed with the language, so switching to German would wipe course progress");

// ── every readable string has German ────────────────────────────────────────
const germanStrings = readableStrings(germanCourse);
const stillEnglish = germanStrings.filter(({ text }) => english.CSHARP_COURSE_DE[text] === undefined
  && Object.prototype.hasOwnProperty.call(english.CSHARP_COURSE_DE, text) === false
  && !isPureCode(text)
  && readableStrings(englishCourse).some((row) => row.text === text));

assert.deepStrictEqual(stillEnglish.map((row) => `[${row.kind}] ${row.text.slice(0, 90)}`), [],
  `${stillEnglish.length} strings in the course have no German and fall back to English, so a `
  + "German reader gets a half-translated lesson");

// ── code inside the prose is never translated ───────────────────────────────
// `Log.Info()` and `float` are what the reader types. A translated identifier
// is a lesson teaching code that does not compile.
const snippets = (value) => String(value).match(/`[^`]+`/g) || [];
const drifted = [];
for (const [source, translation] of Object.entries(english.CSHARP_COURSE_DE)) {
  const after = new Set(snippets(translation));
  for (const snippet of snippets(source)) if (!after.has(snippet)) drifted.push(`${snippet} in "${source.slice(0, 60)}…"`);
}
assert.deepStrictEqual(drifted, [],
  "the German rewrote code the reader is supposed to type, so the lesson now teaches code that will not compile");

// A code block is never touched at all.
const codeOf = (course) => (course.lessons || []).flatMap((lesson) =>
  (lesson.blocks || []).filter((block) => block.type === "code").map((block) => block.code));
assert.deepStrictEqual(codeOf(germanCourse), codeOf(englishCourse),
  "a code block was translated — the lesson now teaches C# that does not compile");

// ── a language course is NOT swept up in this ───────────────────────────────
// Life in the UK is English on purpose: the English is the practice, and the
// German belongs behind the tap it already has.
const uk = germanApi.getCourse("life-in-the-uk") ?? germanApi.getCourse("uk");
if (uk) {
  assert.strictEqual(uk.kind, "citizenship",
    "the citizenship course changed kind, so the rule that spares it no longer applies");
}
for (const id of ["german", "english-uk", "french"]) {
  const course = germanApi.getCourse(id);
  if (!course) continue;
  assert.strictEqual(course.kind, "language",
    `${id} is no longer a language course, so it would start following the interface language`);
}

// ── every screen gets its course from the one lookup ────────────────────────
const registry = fs.readFileSync(path.join(root, "src/lib/courseRegistry.ts"), "utf8");
assert.ok(/export function getCourse[\s\S]{0,200}localiseCourse\(/.test(registry),
  "getCourse no longer localises, so every course screen is back to English");

// The lesson list, dashboard, reader and session must not reach around it.
for (const file of ["CourseLessonsView.tsx", "CourseDashboardView.tsx", "CourseShell.tsx", "CourseSession.tsx"]) {
  const source = fs.readFileSync(path.join(root, "src/components/course", file), "utf8");
  assert.ok(!/\bCOURSES\.find\(/.test(source),
    `${file} looks a course up in COURSES directly, skipping the localising in getCourse`);
}

// The tagline alternates are written in the view, not on the course, so they
// are the one string that never passes through getCourse.
const lessonsView = fs.readFileSync(path.join(root, "src/components/course/CourseLessonsView.tsx"), "utf8");
assert.ok(/translateCourseText\(english, reading\)/.test(lessonsView),
  "the background-specific tagline skips the reading language, so a German reader who came from "
  + "JavaScript gets a German course under an English tagline");

// ── the chrome around it is German too ──────────────────────────────────────
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + fs.readFileSync(path.join(root, "src/lib/i18nDe.ts"), "utf8");
const known = new Set([...i18n.matchAll(/^\s*"((?:[^"\\]|\\.)*)"\s*:/gm)].map((m) => m[1]));
const unescapeKey = (raw) => raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
const missingChrome = new Set();
for (const file of fs.readdirSync(path.join(root, "src/components/course"))) {
  if (!/\.tsx?$/.test(file)) continue;
  const source = fs.readFileSync(path.join(root, "src/components/course", file), "utf8");
  for (const match of source.matchAll(/\bui(?:Fmt|Or)?\("((?:[^"\\]|\\.)*)"/g)) {
    const key = unescapeKey(match[1]);
    if (!known.has(key)) missingChrome.add(`[${file}] ${key}`);
  }
}
assert.deepStrictEqual([...missingChrome], [],
  "a course screen asks for interface copy that has no German, so the buttons around a German "
  + "lesson read English");

console.log(
  `check-course-language: the C# course reads back in German for a German account (${germanStrings.length} `
  + `strings, ${Object.keys(english.CSHARP_COURSE_DE).length} translated), its code and lesson ids are `
  + "untouched, and language courses keep the tap-to-reveal they had"
);
process.exit(0);
