#!/usr/bin/env node
/**
 * The audio panel lists the voices that can be heard, and no others.
 *
 * It used to list all four whatever course was open, so somebody learning
 * German from English was given a French volume, a Polish volume, and speed
 * scopes for both — controls for voices that will never make a sound, with the
 * two that matter pushed apart by them.
 *
 * The tempting rule is "the course's two languages" and it is wrong. A control
 * has to exist for every voice that CAN be heard, or somebody ends up with
 * audio they cannot turn down. The pet speaks in the interface language, so
 * reading the app in French while learning German makes a French voice audible
 * in a course with no French in it — and that is the case this check exists
 * for, because it is the one that looks like an edge case and is not.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
};
global.localStorage = global.window.localStorage;
global.navigator = { language: "en-GB", languages: ["en-GB"] };
global.document = { documentElement: { lang: "en" }, createElement: () => ({}) };
global.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; Object.assign(this, init); } };

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { audioLanguagesInPlay } from "./src/lib/audioLanguagesInPlay.ts";',
      'export { setInterfaceLanguage } from "./src/lib/interfaceLanguage.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "audio-in-play-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("audio-in-play-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "audio-in-play-entry.cjs"));
const { audioLanguagesInPlay, setInterfaceLanguage } = loaded.exports;

let failed = 0;
const check = (label, run) => {
  try {
    store.clear();
    if (setInterfaceLanguage) setInterfaceLanguage("en");
    run();
    console.log(`ok   ${label}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${label}\n     ${error.message}`);
  }
};

check("German from English lists German and English, and nothing else", () => {
  assert.deepStrictEqual(audioLanguagesInPlay("learn-de"), ["english", "german"]);
});

check("English from German lists the same two", () => {
  assert.deepStrictEqual(audioLanguagesInPlay("learn-en"), ["english", "german"]);
});

check("a French course lists French", () => {
  assert.ok(audioLanguagesInPlay("learn-fr").includes("french"),
    "the language being taught has no volume control");
});

check("a Polish course lists Polish", () => {
  assert.ok(audioLanguagesInPlay("learn-pl").includes("polish"),
    "the language being taught has no volume control");
});

check("a Spanish course lists Spanish", () => {
  assert.ok(audioLanguagesInPlay("learn-es").includes("spanish"),
    "the language being taught has no volume control");
});

check("a course never lists a voice it cannot speak", () => {
  assert.ok(!audioLanguagesInPlay("learn-de").includes("polish"),
    "a German course still offers a Polish control");
  assert.ok(!audioLanguagesInPlay("learn-de").includes("french"),
    "a German course still offers a French control");
  assert.ok(!audioLanguagesInPlay("learn-de").includes("spanish"),
    "a German course still offers a Spanish control");
});

// The case that is easy to miss: the pet speaks in the INTERFACE language.
check("reading the app in French while learning German keeps the French control", () => {
  if (!setInterfaceLanguage) throw new Error("cannot set the interface language, so this cannot be proved");
  setInterfaceLanguage("fr");
  const languages = audioLanguagesInPlay("learn-de");
  assert.ok(languages.includes("french"),
    "the pet speaks French and there is no way to turn it down");
  assert.ok(languages.includes("german") && languages.includes("english"),
    "the course's own languages were dropped");
});

check("and in Polish", () => {
  if (!setInterfaceLanguage) throw new Error("cannot set the interface language");
  setInterfaceLanguage("pl");
  assert.ok(audioLanguagesInPlay("learn-de").includes("polish"),
    "the pet speaks Polish and there is no way to turn it down");
});

check("the order does not shuffle when the interface changes", () => {
  if (!setInterfaceLanguage) throw new Error("cannot set the interface language");
  setInterfaceLanguage("fr");
  const withFrench = audioLanguagesInPlay("learn-de");
  assert.deepStrictEqual(withFrench, ["english", "german", "french"],
    `listed as ${withFrench.join(", ")}: the panel reorders itself`);
});

// ── and both controls actually use it ───────────────────────────────────────
const mixer = fs.readFileSync(path.join(root, "src/components/MuteButton.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const speed = fs.readFileSync(path.join(root, "src/components/SpeechSpeedControl.tsx"), "utf8").replace(/\r\n?/gu, "\n");

check("every volume row is conditional, not just the two obvious ones", () => {
  for (const language of ["english", "german", "french", "polish", "spanish"]) {
    assert.ok(mixer.includes(`inPlay.includes("${language}")`),
      `the ${language} volume row is shown unconditionally`);
  }
});

check("the speed scopes are filtered too, and Master survives", () => {
  assert.ok(/SCOPES\.filter\(\(option\) => option\.value === "master" \|\| inPlay\.includes\(option\.value\)\)/.test(speed),
    "the speed scopes still offer every language");
  assert.ok(speed.includes('{scopes.map((option) => ('),
    "the filtered list is worked out and then the unfiltered one is drawn");
});

check("a selected scope that stops applying falls back to Master", () => {
  assert.ok(/if \(scope !== "master" && !inPlay\.includes\(scope\)\) setScope\("master"\)/.test(speed),
    "changing course leaves a speed selected for a language with no button on screen");
});

if (failed) {
  console.error(`\n${failed} audio-languages-in-play check(s) failed.`);
  process.exit(1);
}
console.log("check-audio-languages-in-play: the panel offers a control for every voice that can be heard, and none that cannot.");
process.exit(0);
