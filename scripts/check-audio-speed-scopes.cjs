#!/usr/bin/env node
/** Per-language speech-speed storage and surface coverage. */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const store = new Map();
const localStorage = {
  getItem: (key) => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
global.Event = class Event { constructor(type) { this.type = type; } };
global.window = {
  localStorage,
  addEventListener() {},
  dispatchEvent() {},
};

(async () => {
const built = await esbuild.build({
  entryPoints: [path.join(root, "src/lib/audioMute.ts")],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
  plugins: [{
    name: "profile-storage-stub",
    setup(build) {
      build.onResolve({ filter: /^@\/lib\/profileStorage$/ }, () => ({
        path: "profile-storage-stub",
        namespace: "audio-check",
      }));
      build.onLoad({ filter: /.*/, namespace: "audio-check" }, () => ({
        contents: "export const syncLocalStorageItem = () => {};",
        loader: "js",
      }));
    },
  }],
});

const compiled = new Module("audio-speed-check", module);
compiled.filename = path.join(root, ".audio-speed-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const audio = compiled.exports;

const SETTINGS_KEY = "gl-audio-settings-v1";
const reset = (value) => {
  store.clear();
  if (value) store.set(SETTINGS_KEY, JSON.stringify(value));
};

reset();
assert.equal(audio.getTtsSpeechRate("en-GB"), 1);
assert.equal(audio.getTtsSpeechRate("de-DE"), 1);

reset({ speechRate: 1.25 });
assert.equal(audio.getTtsSpeechRate("en-US"), 1.25, "legacy speed did not migrate to English");
assert.equal(audio.getTtsSpeechRate("de-DE"), 1.25, "legacy speed did not migrate to German");

audio.setTtsSpeechRate(1.5);
assert.equal(audio.getTtsSpeechRate("english"), 1.5);
assert.equal(audio.getTtsSpeechRate("german"), 1.5);
assert.equal(audio.getMasterTtsSpeechRate(), 1.5, "Master should set both absolute channels");

audio.setTtsLanguageSpeechRate("english", 0.75);
assert.equal(audio.getTtsSpeechRate("en-US"), 0.75);
assert.equal(audio.getTtsSpeechRate("de-DE"), 1.5);
assert.equal(audio.getMasterTtsSpeechRate(), null, "different channels should display Mixed");

audio.setTtsLanguageSpeechRate("german", 0.75);
assert.equal(audio.getMasterTtsSpeechRate(), null, "one channel still at its old speed keeps this Mixed");
audio.setTtsLanguageSpeechRate("french", 0.75);
assert.equal(audio.getTtsSpeechRate("fr-FR"), 0.75, "French is a channel of its own, not the fallback");
assert.equal(audio.getMasterTtsSpeechRate(), null, "Polish still at its old speed keeps this Mixed");
audio.setTtsLanguageSpeechRate("polish", 0.75);
assert.equal(audio.getTtsSpeechRate("pl-PL"), 0.75, "Polish is a channel of its own, not the fallback");
assert.equal(audio.getMasterTtsSpeechRate(), null, "Spanish still at its old speed keeps this Mixed");
audio.setTtsLanguageSpeechRate("spanish", 0.75);
assert.equal(audio.getTtsSpeechRate("es-ES"), 0.75, "Spanish is a channel of its own, not the fallback");
assert.equal(audio.getMasterTtsSpeechRate(), 0.75, "matching channels should restore one Master value");
audio.setTtsLanguageSpeechRate("german", 99);
assert.equal(audio.getTtsSpeechRate("de-DE"), 2, "language speed should respect the server ceiling");

assert.equal(audio.audioLanguageFromTag("en-GB"), "english");
assert.equal(audio.audioLanguageFromTag("de-DE"), "german");

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const control = read("src/components/SpeechSpeedControl.tsx");
const mute = read("src/components/MuteButton.tsx");
const listen = read("src/components/listen/ListenView.tsx");
const profile = read("src/Gamification.tsx");
const guided = read("src/GuidedSession.tsx");
const voice = read("src/lib/voice.ts");

for (const scope of ["master", "english", "german", "french", "polish"]) {
  assert(control.includes(`value: "${scope}"`), `missing ${scope} speed scope`);
}
assert(mute.includes("<SpeechSpeedControl"), "global audio mixer lacks scoped speed");
assert(listen.includes("<SpeechSpeedControl"), "Listen lacks scoped speed");
assert((profile.match(/<SpeechSpeedControl/g) || []).length >= 2, "profile speed surfaces are not shared");
// The lesson has no speed control of its own any more — first the Hear it
// button carried it, then a header gauge, and both went as second doors to
// a room the audio mixer already opens. Speed must still be reachable
// mid-lesson, so the lesson mounts that mixer.
assert(
  !guided.includes("<SpeechSpeedControl") && /<MuteButton[\s\S]{0,200}panelClassName="prototype-audio-mixer"/.test(guided),
  "the lesson lost its route to speech speed — the audio mixer must stay in its header"
);
// Matched inside effectiveRate rather than as one exact line: what matters is
// that the clip's pace is multiplied by the language's own setting, not what
// the left-hand operand is called. It is no longer plain `rate` — a word short
// enough that the authored slowdown would spoil it drops that slowdown first —
// and the learner's setting must survive that, which check-short-word-pace
// asserts by running the arithmetic rather than by reading it.
assert(
  /function effectiveRate\([\s\S]{0,400}\* getTtsSpeechRate\(lang\)/.test(voice),
  "playback ignores the clip language's speed"
);

console.log("per-language speech speed, legacy migration, Master batching, and all speed surfaces passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
