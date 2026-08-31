#!/usr/bin/env node
/**
 * Tapping a card offers the app's own language, or nothing at all.
 *
 * She asked for exactly two choices here: "no translation", and whatever
 * language the app is set to. The picker used to be driven by the course
 * instead — it offered any table that could read it — so an English app
 * offered German help to someone who may not read German, and a German app
 * offered English.
 *
 * This runs the real module rather than reading it, because the rule is a
 * relationship between three things (app language, course language, which
 * tables exist) and a regex over the source would pass while the behaviour
 * was wrong. Every combination is exercised.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { translationLanguagesFor, getTranslationLanguage, setTranslationLanguage } from "./src/lib/courseTranslation.ts";',
      'export { setInterfaceLanguage } from "./src/lib/interfaceLanguage.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "card-translation-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  CustomEvent: class { constructor(type, init) { this.type = type; Object.assign(this, init); } },
};
global.localStorage = global.window.localStorage;
global.CustomEvent = global.window.CustomEvent;

const compiled = new Module("card-translation-check", module);
compiled.filename = path.join(root, ".card-translation-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { translationLanguagesFor, getTranslationLanguage, setTranslationLanguage, setInterfaceLanguage } = compiled.exports;

const offer = (app, course) => {
  setInterfaceLanguage(app);
  return translationLanguagesFor(course).map((entry) => entry.id).join(",");
};

// app language, course language, what may be chosen
const CASES = [
  // A German app beside the English and French courses offers German help.
  ["de", "en", "off,de"],
  ["de", "fr", "off,de"],
  // Beside the German course it offers nothing: the cards are already German.
  // One entry means the picker hides itself rather than showing a lone choice.
  ["de", "de", "off"],
  // And the mirror image, which is where the old rule went wrong: an English
  // app used to be offered German here, and only German.
  ["en", "de", "off,en"],
  ["en", "fr", "off,en"],
  ["en", "en", "off"],
  // Polish reads all three country courses.
  ["pl", "en", "off,pl"],
  ["pl", "de", "off,pl"],
  ["pl", "fr", "off,pl"],
  // French reads both country courses. Beside Vivre en France nothing is
  // needed, because those cards are already French.
  ["fr", "en", "off,fr"],
  ["fr", "de", "off,fr"],
  ["fr", "fr", "off"],
];

for (const [app, course, expected] of CASES) {
  const actual = offer(app, course);
  assert.strictEqual(
    actual, expected,
    `a ${app} app beside a ${course} course must offer [${expected}] and offers [${actual}]`
  );
}

// "off" is never absent: without it there is no way back to plain cards.
for (const [app, course] of CASES) {
  assert.ok(
    offer(app, course).split(",").includes("off"),
    `no way to turn translation off with a ${app} app beside a ${course} course`
  );
}

// A choice can outlive the app language that made it offerable. Pick German
// help, switch the app to English, and the picker is gone — the cards must go
// with it rather than keep answering in a language no longer on offer.
setInterfaceLanguage("de");
setTranslationLanguage("de");
assert.strictEqual(getTranslationLanguage(), "de", "the chosen language must survive while the app still speaks it");
setInterfaceLanguage("en");
assert.strictEqual(
  getTranslationLanguage(), "off",
  "German help is still in force in an English app, where the picker no longer offers it"
);
// Switching back restores it: the stored choice is clamped, not erased.
setInterfaceLanguage("de");
assert.strictEqual(
  getTranslationLanguage(), "de",
  "the stored choice was thrown away rather than clamped, so switching back loses it"
);

console.log(
  "check-card-translation: the picker offers the app's own language or nothing, "
  + "hides itself beside a course already in that language, and a stored choice "
  + "cannot outlive the language that offered it"
);
// esbuild's service keeps sockets open after buildSync returns; say the check
// is finished rather than letting the event loop decide.
process.exit(0);
