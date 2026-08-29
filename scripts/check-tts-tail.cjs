#!/usr/bin/env node
/**
 * The voice stops when the speech does, not when the file does.
 *
 * Every clip the synthesis service returns is padded with encoded silence
 * after the last word — measured against the shipped voices, 354ms on "air"
 * and 1,049ms on "water" — and playback advanced on `ended`, so all of it was
 * listened to in full between every line of every card. In Listen, where a
 * card is two languages and up to three repeats, that is whole seconds of
 * dead air per card, and it is what a learner reports as the voice lagging:
 * the words are fine, the wait after them is not.
 *
 * Two halves. The scanner is pure and is tested as maths: it must find the
 * end of a tone followed by silence, refuse an all-silent buffer, and not
 * invent a trim where none is worth having. The wiring is pinned in source:
 * measurement happens once per fetched clip off the playback path, the trim
 * arms when playback starts and is cleared with every other guard, and
 * eviction forgets what it measured — a trim keyed to a revoked URL would
 * cut some future clip short at the wrong moment.
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
};
global.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; Object.assign(this, init); } };
global.Event = class Event { constructor(type) { this.type = type; } };
global.document = { createElement: () => ({}) };

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'import { lastVoicedEndSeconds } from "./src/lib/voice.ts";',
      'export { lastVoicedEndSeconds };',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "tail-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("tail-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "tail-entry.cjs"));
const { lastVoicedEndSeconds } = loaded.exports;

let failed = 0;
const check = (label, run) => {
  try {
    run();
    console.log(`ok   ${label}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${label}\n     ${error.message}`);
  }
};

const RATE = 24_000;
const seconds = (n) => Math.round(n * RATE);
const tone = (n) => Float32Array.from({ length: seconds(n) }, (_, i) => 0.4 * Math.sin(i / 8));
const hush = (n) => new Float32Array(seconds(n));
const join = (...parts) => {
  const out = new Float32Array(parts.reduce((total, p) => total + p.length, 0));
  let at = 0;
  for (const part of parts) { out.set(part, at); at += part.length; }
  return out;
};

check("a tone followed by padding is measured at the tone's end", () => {
  const end = lastVoicedEndSeconds(join(tone(0.35), hush(1.0)), RATE);
  assert.ok(end != null && Math.abs(end - 0.35) < 0.01,
    `expected ~0.35s, got ${end}`);
});

check("a clip that speaks to its very last sample is left alone", () => {
  const end = lastVoicedEndSeconds(tone(0.5), RATE);
  assert.ok(end != null && Math.abs(end - 0.5) < 0.01,
    `expected ~0.5s, got ${end}`);
});

check("an all-silent buffer yields nothing rather than a zero-length cut", () => {
  assert.strictEqual(lastVoicedEndSeconds(hush(1.0), RATE), null);
  assert.strictEqual(lastVoicedEndSeconds(new Float32Array(0), RATE), null);
});

check("a whisper under the threshold does not count as speech", () => {
  const whisper = Float32Array.from({ length: seconds(0.4) }, () => 0.002);
  const end = lastVoicedEndSeconds(join(tone(0.2), whisper), RATE);
  assert.ok(end != null && Math.abs(end - 0.2) < 0.01,
    `expected ~0.2s, got ${end}`);
});

const voice = fs.readFileSync(path.join(root, "src/lib/voice.ts"), "utf8").replace(/\r\n?/gu, "\n");

check("every fetched clip is measured once, off the playback path", () => {
  assert.ok(voice.includes("void measureSpeechEnd(entry.url, blob);"),
    "cacheAudioBlob no longer kicks off the measurement");
  assert.ok(voice.includes("decodeAudioData"),
    "the measurement no longer decodes the clip it judges");
});

check("the trim arms when playback starts and dies with the other guards", () => {
  // The call must be live code, so the pin demands it start its own line —
  // a commented-out call still contains the characters and fooled the
  // looser version of this assertion during its own fault-injection.
  assert.ok(/audio\.onplaying = \(\) => \{[\s\S]{0,300}?\n[ \t]*armTailTrim\(\);/u.test(voice),
    "playback start no longer arms the tail trim");
  assert.ok(/if \(tailGuard\) clearTimeout\(tailGuard\);\n/u.test(voice)
    && /const finish = \(\) => \{[\s\S]{0,300}?clearTimeout\(tailGuard\)/u.test(voice),
    "finish() no longer clears the tail trim — a stopped clip could cut the next one short");
});

check("what was measured is forgotten when its URL is", () => {
  assert.ok(voice.includes("forgetSpeechEnd(previous.url);")
    && voice.includes("forgetSpeechEnd(entry.url);"),
    "cache replacement or eviction keeps a stale measurement for a revoked URL");
});

check("a clip barely worth trimming keeps its natural ending", () => {
  assert.ok(/decoded\.duration - stopAt < TAIL_MIN_SAVING_S\) return;/u.test(voice),
    "the minimum-saving guard is gone — every clip would be cut, including ones with no real tail");
});

if (failed) {
  console.error(`\n${failed} tts-tail check(s) failed.`);
  process.exit(1);
}
console.log("check-tts-tail: playback ends with the speech, and the padding after it is never waited out");
process.exit(0);
