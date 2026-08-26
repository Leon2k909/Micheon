#!/usr/bin/env node
/**
 * The course and the interface are two settings, not one.
 *
 * They used to be the same control: choosing "Deutsch" in the language picker
 * switched the course to learn-English AND put the whole app into German. That
 * looks tidy until two people want the halves set differently — a German
 * speaker learning English who wants her app in English (the language she is
 * practising), and an English speaker learning German who wants his app in
 * German for exactly the same reason. Neither setup existed.
 *
 * All four combinations have to be reachable, and the default has to stay the
 * old derived behaviour so nobody's app silently changes language.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const fs = require("fs");

const root = path.join(__dirname, "..");
const store = {};
global.window = { localStorage: null, dispatchEvent() {}, addEventListener() {} };
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
};
global.window.localStorage = global.localStorage;

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { ui, uiIsGerman } from "./src/lib/i18n.ts";
      export { setInterfaceLanguage, getInterfaceLanguage, resolveInterfaceLanguage } from "./src/lib/interfaceLanguage.ts";
      export { setLearningDirection } from "./src/lib/direction.ts";
    `,
    resolveDir: root, sourcefile: "language-split-check.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("language-split-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "language-split-check.js"));
const { uiIsGerman, setInterfaceLanguage, getInterfaceLanguage, setLearningDirection } = compiled.exports;

let failures = 0;
const check = (name, ok, detail) => {
  if (ok) return void console.log("ok   " + name);
  failures += 1;
  console.error("FAIL " + name + (detail ? " — " + detail : ""));
};

// ── the default is the old behaviour ──────────────────────────────────────
check("the interface language defaults to following the course", getInterfaceLanguage() === "auto");
setLearningDirection("learn-de");
check("on auto, learning German still gives an English app", uiIsGerman() === false);
setLearningDirection("learn-en");
check("on auto, learning English still gives a German app", uiIsGerman() === true);

// ── and all four combinations are now reachable ───────────────────────────
setLearningDirection("learn-en");
setInterfaceLanguage("en");
check("learning English WITH an English app (the German speaker's setup)", uiIsGerman() === false);

setLearningDirection("learn-de");
setInterfaceLanguage("de");
check("learning German WITH a German app (the English speaker's setup)", uiIsGerman() === true);

setLearningDirection("learn-de");
setInterfaceLanguage("en");
check("learning German with an English app", uiIsGerman() === false);

setLearningDirection("learn-en");
setInterfaceLanguage("de");
check("learning English with a German app", uiIsGerman() === true);

// ── the setting survives, and auto still tracks the course afterwards ─────
setInterfaceLanguage("auto");
setLearningDirection("learn-de");
check("going back to auto follows the course again", uiIsGerman() === false);

// ── the picker no longer changes the course behind your back ──────────────
const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
check(
  "the spelling picker no longer switches the course",
  !/updateLanguageSelection[\s\S]{0,400}setLearningDirection/.test(settings),
);
// The two settings live in the two places they belong: what you are LEARNING
// is the course, chosen from the course card on the home page, and the app's
// own language is a setting. Offering the course in both places was the same
// choice in two spots, which is how they drift apart.
check(
  "the app language is a setting",
  settings.includes('ui("App language")'),
);
check(
  "the course is chosen from the course picker, not duplicated in settings",
  !settings.includes('ui("I am learning")')
    && /courseId === "english-uk"[\s\S]{0,200}setLearningDirection/.test(
      fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8")
    ),
);
check(
  "the interface picker offers auto, English and German",
  /value="auto"[\s\S]{0,300}value="en"[\s\S]{0,120}value="de"/.test(settings),
);

// ── and the tree is subscribed, or the setting needs a reload to show ─────
const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
check("the app subscribes to the interface language", /useInterfaceLanguage\(\)/.test(app));

// The course has to survive the window being closed.
//
// Which of the two built-in courses is showing is read from the direction,
// and the direction was written to this device only. Its key starts with gl-,
// which the shared mirror carries, and the mirror is read back over local
// storage on load and on every window focus - so choosing German held until
// the window closed and then went back to English on its own, with nothing
// on screen to explain it. The mirror never heard about the change.
const directionSource = fs.readFileSync(path.join(root, "src/lib/direction.ts"), "utf8");
check(
  "setting the course reaches the shared mirror, not only this device",
  directionSource.includes("syncLocalStorageItem(KEY, d)")
);
const storageSource = fs.readFileSync(path.join(root, "src/lib/profileStorage.ts"), "utf8");
check(
  "and the mirror really does carry that key, which is what made a local-only write lose it",
  storageSource.includes('"gl-"')
);

// The header's three figures all belong to one course.
//
// The lesson counter already did. XP and the session log did not, so the same
// header could say both that nothing had been done in this course and that a
// life had: 221 lessons dropped to 0 on the way to German while 13,860 XP and
// 16 days stayed put.
const storage = fs.readFileSync(path.join(root, "src/lib/profileStorage.ts"), "utf8");
for (const key of ['"totalXp"', '"activity-log"', '"sessionsCompleted"']) {
  const at = storage.indexOf("DIRECTION_SCOPED_KEYS");
  const set = storage.slice(at, storage.indexOf("]);", at));
  check(
    key + " belongs to the course that earned it",
    set.includes(key)
  );
}
// And the re-run hands the pre-split store to the course that earned it, not
// to whichever one is open. Getting this wrong credits a course the learner
// has not started with a life's worth of lessons.
check(
  "the split re-run copies into the direction an earlier run recorded",
  storage.includes("earlierSplitDirection(profileId) ?? currentDirection()")
    && storage.includes('const EARLIER_SPLIT_KEYS = ["gl-direction-split-v2", "gl-direction-split"];')
);

if (failures) {
  console.error(`\n${failures} language-split regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log("\nthe course and the interface are set separately, and auto still means what it did");
// setInterfaceLanguage schedules a shared-storage mirror write, and that timer
// keeps Node alive with stdout still buffered, so the run looks like a hang.
process.exit(0);
