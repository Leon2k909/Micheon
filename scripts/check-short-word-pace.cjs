#!/usr/bin/env node
/**
 * A one-syllable word is not read slowly, and the learner's own pace still wins.
 *
 * Every clip is authored at 0.88 — a deliberate slowdown that makes a sentence
 * easier to follow. Spread across a sentence it is barely there. Spread across
 * one syllable it IS the word: measured against the app's own voice server,
 * "go" comes back as 1.08 seconds of audio at 0.88 against 0.96 at normal
 * pace, and a neural voice asked to hold a diphthong that long creaks at the
 * end of it. Short words are also the ones a learner replays most.
 *
 * The rule only drops the AUTHORED slowdown. A learner who has turned a
 * language down still gets it turned down, because that is an answer to a
 * question they were asked; 0.88 is a default nobody chose. Both halves are
 * asserted, because a fix that quietly overrode somebody's chosen speed would
 * pass every claim about croakiness and be worse than the fault.
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

// effectiveRate is private, deliberately — it is an implementation detail of
// playback. The behaviour is reached through the same door playback uses.
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'import { effectiveRate, slowingWouldSpoil, roughSyllables } from "./src/lib/voice.ts";',
      'export { effectiveRate, slowingWouldSpoil, roughSyllables };',
      'export { setTtsSpeechRate, setTtsLanguageSpeechRate } from "./src/lib/audioMute.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "pace-entry.ts",
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const loaded = new Module("pace-entry", null);
loaded._compile(built.outputFiles[0].text, path.join(root, "pace-entry.cjs"));
const { effectiveRate, slowingWouldSpoil, roughSyllables, setTtsSpeechRate } = loaded.exports;

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

check("syllables are counted well enough to tell short from not", () => {
  for (const [word, expected] of [["go", 1], ["air", 1], ["Öl", 1], ["Ehre", 2], ["occurrence", 4], ["Versicherung", 4]]) {
    assert.strictEqual(roughSyllables(word), expected, `${word} counted as ${roughSyllables(word)}`);
  }
});

check("the words that croak are recognised", () => {
  for (const word of ["go", "air", "Öl", "ja", "Haus", "Ehre", "gehen"]) {
    assert.ok(slowingWouldSpoil(word), `${word} would still be slowed`);
  }
});

check("a sentence is left alone, however short", () => {
  for (const line of ["Wollen wir los?", "Shall we go?", "Es war besser.", "ich bin"]) {
    assert.ok(!slowingWouldSpoil(line), `"${line}" was treated as a single short word`);
  }
});

check("a long word is left alone", () => {
  for (const word of ["occurrence", "Versicherung", "Eigenbedarfskündigung"]) {
    assert.ok(!slowingWouldSpoil(word), `${word} was treated as short`);
  }
});

check("something with no vowels at all is not mistaken for short", () => {
  assert.ok(!slowingWouldSpoil("—"), "punctuation counted as a word");
  assert.ok(!slowingWouldSpoil(""), "nothing counted as a word");
});

// ── the rate itself ─────────────────────────────────────────────────────────
check("a short word loses the authored slowdown", () => {
  setTtsSpeechRate(1);
  assert.strictEqual(effectiveRate(0.88, "en-GB", "go"), 1,
    `"go" is still read at ${effectiveRate(0.88, "en-GB", "go")}`);
  assert.strictEqual(effectiveRate(0.88, "de-DE", "Haus"), 1);
});

check("a sentence keeps it", () => {
  setTtsSpeechRate(1);
  assert.ok(Math.abs(effectiveRate(0.88, "en-GB", "Shall we go?") - 0.88) < 1e-9,
    "the authored pace was dropped for a whole sentence");
});

check("the learner's chosen pace still applies to a short word", () => {
  setTtsSpeechRate(0.5);
  const short = effectiveRate(0.88, "de-DE", "Haus");
  assert.ok(Math.abs(short - 0.5) < 1e-9,
    `somebody who chose half speed got ${short}: their setting was overridden`);
  setTtsSpeechRate(1);
});

check("a learner who speeds up is not slowed back down", () => {
  setTtsSpeechRate(1.5);
  const short = effectiveRate(0.88, "de-DE", "Haus");
  assert.ok(short > 1, `a short word at ${short} for somebody who asked for 1.5`);
  setTtsSpeechRate(1);
});

check("nothing is ever asked of the voice outside its limits", () => {
  for (const learner of [0.3, 0.5, 1, 1.5, 2]) {
    setTtsSpeechRate(learner);
    for (const text of ["go", "Shall we go?", "Versicherung"]) {
      const rate = effectiveRate(0.88, "de-DE", text);
      assert.ok(rate >= 0.3 && rate <= 2, `${text} at learner ${learner} produced ${rate}`);
    }
  }
  setTtsSpeechRate(1);
});

// ── and the warmed cache entry is the one playback asks for ─────────────────
const voice = fs.readFileSync(path.join(root, "src/lib/voice.ts"), "utf8").replace(/\r\n?/gu, "\n");
check("preloading warms the entry playback will actually use", () => {
  assert.ok(/getAudioUrl\(spokenText, effectiveRate\(rate, lang, spokenText\), lang\)/.test(voice),
    "preload works out the rate without the text, so every short word warms the wrong cache entry and misses");
  assert.ok(/const rate = effectiveRate\(item\.rate \?\? DEFAULT_RATE, lang, text\);/.test(voice),
    "playback does not pass the text, so no word is ever recognised as short");
});

const listen = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8").replace(/\r\n?/gu, "\n");
check("Listen fetches ahead, and only ever one card", () => {
  // Both sides of one card, through a single helper rather than four calls,
  // so the rate cannot be right on one line and wrong on the next. That is
  // how it broke: the warm asked for 0.88 while the plan played 0.92 and
  // 0.95, and every clip it fetched was an entry playback never read.
  assert.ok(/preloadTts\(item\.de,\s*LISTEN_TARGET_RATE,\s*targetLang\)/.test(listen),
    "the target side is no longer warmed at the rate the speech plan plays it");
  assert.ok(/preloadTts\(item\.en,\s*LISTEN_MEANING_RATE,\s*meaningLang\)/.test(listen),
    "the meaning side is no longer warmed at the rate the speech plan plays it");

  /**
   * While playing, the NEXT card. While paused, the one on screen.
   *
   * The rule this replaces was "never fetch while paused", and its reason
   * still stands: reading ahead through a queue nobody is listening to spends
   * a connection on audio nobody asked for. Warming the card already in front
   * of the learner is not that — it is one card, displayed, one tap from
   * playing, and it is the card that used to make the first play of every
   * sitting wait on the upstream fetch.
   *
   * What must not come back is fetching the NEXT card while paused, which is
   * the speculative half.
   */
  assert.ok(/if \(playing\) warm\(nextItem\);\s*\n\s*else warm\(item\);/.test(listen),
    "Listen no longer warms the next card while playing and the current one while paused");
  assert.ok(!/if \(!playing\) .*warm\(nextItem\)/.test(listen),
    "a paused player reads ahead through the queue again, which spends somebody's connection on audio nobody asked for");
});

if (failed) {
  console.error(`\n${failed} short-word pace check(s) failed.`);
  process.exit(1);
}
console.log("check-short-word-pace: short words are not stretched, chosen speeds are kept, and the next card is fetched early.");
process.exit(0);
