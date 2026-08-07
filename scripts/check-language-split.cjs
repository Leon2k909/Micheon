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

if (failures) {
  console.error(`\n${failures} language-split regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log("\nthe course and the interface are set separately, and auto still means what it did");
// setInterfaceLanguage schedules a shared-storage mirror write, and that timer
// keeps Node alive with stdout still buffered, so the run looks like a hang.
process.exit(0);
