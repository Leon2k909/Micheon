#!/usr/bin/env node
/**
 * Listen survives a lesson, and the two do not talk over each other.
 *
 * Opening a lesson is a page navigation, not a change of view: the whole app
 * is torn down and rebuilt around the lesson. Listen therefore had no way to
 * continue — its session lived in component state that died with the page —
 * and no way to be asked about, so a card reading itself aloud would call
 * tts(), which stops whatever is playing first. A Listen session was not
 * talked over, it was ended, one sentence at a time, silently.
 *
 * Three rules, and the third is the one that keeps this honest:
 *
 * 1. A session the learner has not closed comes back after the navigation.
 * 2. While it is PLAYING, the lesson stops volunteering speech.
 * 3. Pausing or closing hands the voice straight back — and a button that says
 *    a word out loud always says it, because pressing one is a request, not an
 *    interruption. A rule that silenced those would be a broken lesson, not a
 *    polite one.
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
global.CustomEvent = class CustomEvent { constructor(type) { this.type = type; } };

const built = esbuild.buildSync({
  stdin: {
    contents: 'export { readListenSession, writeListenSession, listenIsHoldingAudio } from "./src/lib/listenSession.ts";',
    resolveDir: root,
    sourcefile: "listen-session-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("listen-session-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "listen-session-entry.cjs"));
const { readListenSession, writeListenSession, listenIsHoldingAudio } = loaded.exports;

let failed = 0;
const check = (label, run) => {
  try {
    store.clear();
    run();
    console.log(`ok   ${label}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${label}\n     ${error.message}`);
  }
};

check("a machine that has never used Listen holds nothing back", () => {
  assert.deepStrictEqual(readListenSession(), { live: false, playing: false });
  assert.strictEqual(listenIsHoldingAudio(), false);
});

check("a playing session survives being read back, which is what a lesson does", () => {
  writeListenSession({ live: true, playing: true });
  assert.deepStrictEqual(readListenSession(), { live: true, playing: true });
  assert.strictEqual(listenIsHoldingAudio(), true, "a lesson would speak over a playing session");
});

check("a paused session stays on screen but lets the lesson talk", () => {
  writeListenSession({ live: true, playing: false });
  assert.strictEqual(readListenSession().live, true, "pausing closed the player");
  assert.strictEqual(listenIsHoldingAudio(), false,
    "a learner who paused Listen to do a lesson properly got a silent lesson");
});

check("closing hands the voice straight back", () => {
  writeListenSession({ live: true, playing: true });
  writeListenSession({ live: false, playing: false });
  assert.strictEqual(listenIsHoldingAudio(), false, "the lesson stayed silent after Listen was closed");
  assert.deepStrictEqual(readListenSession(), { live: false, playing: false });
});

check("a closed session leaves nothing behind", () => {
  writeListenSession({ live: true, playing: true });
  writeListenSession({ live: false, playing: false });
  assert.strictEqual(store.size, 0, "a finished session is still stored, so it is not the same as never having one");
});

check("nonsense in storage is not a live session", () => {
  store.set("gl-listen-session", "{ broken");
  assert.strictEqual(listenIsHoldingAudio(), false);
  store.set("gl-listen-session", '"a string"');
  assert.strictEqual(listenIsHoldingAudio(), false);
  store.set("gl-listen-session", '{"live":"yes","playing":1}');
  assert.strictEqual(listenIsHoldingAudio(), false, "truthy junk counted as a playing session");
});

// ── the wiring ──────────────────────────────────────────────────────────────
const lesson = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const listen = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8").replace(/\r\n?/gu, "\n");
const guidedPage = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8").replace(/\r\n?/gu, "\n");

check("the lesson's own speech defers, and every one of those sites uses it", () => {
  assert.ok(/function lessonSpeak[\s\S]{0,400}listenIsHoldingAudio\(\)/.test(lesson),
    "lessonSpeak does not consult the Listen session");
  const auto = lesson.split("\n").filter((line) => (
    /\blessonSpeak\(/.test(line) === false
    && /\btts\(/.test(line)
    && !/^\s*(\/\/|\*)/.test(line)
    && !/=>\s*(void\s+)?tts\(|onClick|onHear/.test(line)
  ));
  // What is left calling tts() directly must be either a helper a press goes
  // through, or the deferral itself — lessonSpeak has to reach the real tts()
  // once it has decided Listen is not holding the voice.
  for (const line of auto) {
    const isPressHelper = /const speak\b|const speakCard\b/.test(line) || /void tts\(text,/.test(line);
    const isTheDeferralItself = /^\s*return tts\(text, rate, lang\);$/.test(line);
    assert.ok(isPressHelper || isTheDeferralItself,
      `a lesson speaks on its own without deferring to Listen: ${line.trim().slice(0, 70)}`);
  }
  assert.ok(lesson.split("lessonSpeak(").length - 1 >= 20,
    "hardly any of the lesson's automatic speech goes through the deferral");
});

check("a press still speaks, whatever Listen is doing", () => {
  assert.ok(/onClick=\{\(\) => tts\(/.test(lesson),
    "the buttons that say a word out loud were silenced along with the automatic speech");
});

check("Listen comes back after the navigation a lesson performs", () => {
  assert.ok(listen.includes("useState(() => readListenSession().live)"),
    "the session starts closed on every mount, so opening a lesson ends it");
  assert.ok(/writeListenSession\(\{\s*live,\s*playing: live && playing\s*\}\)/.test(listen),
    "nothing records what Listen is doing, so nothing can defer to it");
});

check("the lesson screen mounts the player", () => {
  assert.ok(guidedPage.includes("<BackgroundListen"), "the lesson screen does not mount Listen at all");
  assert.ok(/BackgroundListen[\s\S]{0,600}active=\{false\}/.test(guidedPage),
    "Listen is mounted active, which would draw the whole Listen screen over the lesson");
});

check("the player's speaker is the one the rest of the app uses", () => {
  assert.ok(listen.includes("<MuteButton"),
    "the mini player still has its own mute button, so speeds cannot be reached from it");
  assert.ok(!/listen-mini-player__volume">[\s\S]{0,400}type="range"/.test(listen),
    "the bespoke volume slider is still in the mini player beside the shared control");
});

if (failed) {
  console.error(`\n${failed} listen-alongside-lesson check(s) failed.`);
  process.exit(1);
}
console.log("check-listen-alongside-lesson: a session survives a lesson, holds the voice only while playing, and gives it back.");
process.exit(0);
