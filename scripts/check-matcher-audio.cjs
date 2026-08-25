#!/usr/bin/env node
/**
 * The Matcher speaks, so it gets the same sound controls as the lesson.
 *
 * Tapping a card plays it, and there was no way to mute German, mute English,
 * turn the whole thing down or change the speed without leaving the mode.
 *
 * It mounts the lesson's own mixer rather than growing controls of its own.
 * Two sets of controls over one set of settings is two places to change the
 * same thing, and the moment they disagree the learner has to guess which one
 * is winning.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const matcher = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
const mixer = fs.readFileSync(path.join(root, "src/components/MuteButton.tsx"), "utf8");
const speed = fs.readFileSync(path.join(root, "src/components/SpeechSpeedControl.tsx"), "utf8");

// ── the mixer is mounted, and it is the shared one ──────────────────────────
assert.ok(/import \{ MuteButton \} from "@\/components\/MuteButton";/.test(matcher),
  "the Matcher does not mount the shared mixer");
assert.ok(/<MuteButton\b/.test(matcher), "the mixer is imported but never rendered");

// Not a second implementation: these are the calls a hand-rolled control would
// need, and the Matcher must reach them only through the shared component.
for (const own of ["toggleAudioMuted", "setMasterAudioVolume", "setTtsLanguageVolume", "setTtsSpeechRate"]) {
  assert.ok(!matcher.includes(own),
    `the Matcher calls ${own} directly, which is a second set of controls over one setting`);
}

// ── and that mixer really does carry what was asked for ─────────────────────
for (const [label, needle] of [
  ["a master volume", /setMasterAudioVolume/],
  ["a per-language volume", /setTtsLanguageVolume/],
  ["a per-language mute", /toggleTtsLanguageMuted/],
  ["the speed control", /SpeechSpeedControl/],
]) {
  assert.ok(needle.test(mixer), `the mixer no longer offers ${label}`);
}
// All together, or one language at a time.
for (const scope of ["master", "english", "german"]) {
  assert.ok(new RegExp(`"${scope}"`).test(speed), `the speed control lost its ${scope} scope`);
}

// ── the warmed audio has to follow the speed ────────────────────────────────
// The clip cache is keyed on text, RATE and language. Turning the speed up
// leaves every warmed clip under a key nothing will read again, so the board
// has to warm itself again when the mixer changes or the delay comes back.
assert.ok(/AUDIO_SETTINGS_EVENT/.test(matcher),
  "the Matcher does not listen for mixer changes, so changing the speed leaves its warmed audio stale");
assert.ok(/\[board\.pairs, sides\.target\.voice, sides\.meaning\.voice, audioRevision\]/.test(matcher),
  "the warm-up does not depend on the mixer, so a speed change would not re-warm the board");

// ── the trigger is icon-only ────────────────────────────────────────────────
// MuteButton renders `label` as visible text INSIDE the button. Passing one to
// a button sized for an icon put the word "Sound" through its right-hand edge.
// The aria-label it sets for itself is what names it.
assert.ok(!/<MuteButton[^>]*\blabel=/s.test(matcher),
  "the mixer trigger carries a visible label again, which overflows a button sized for an icon");

// ── the label is translated ─────────────────────────────────────────────────
const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
assert.ok(/"Sound":/.test(i18n), '"Sound" has no German');

console.log(
  "check-matcher-audio: the Matcher mounts the lesson's mixer — master, per-language mute and "
  + "volume, and speed for all or one language — and re-warms its audio when the speed changes"
);
