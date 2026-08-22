#!/usr/bin/env node
/**
 * A tapped card should already have its audio.
 *
 * Clips are synthesised upstream on first use, measured at 377-847 ms — long
 * enough that tapping a card read as broken rather than slow. Nothing is
 * cached on disk, so every clip pays that once per app run.
 *
 * The board is warmed while the learner is still reading it. That costs about
 * one clip's worth of time for the whole board, because each synthesis opens
 * its own connection and they overlap: six lines measured 357 ms together
 * against 716 ms for the slowest one alone.
 *
 * The way this silently stops working is a mismatched key. The cache is keyed
 * on text, RATE and LANGUAGE, so warming at one rate and playing at another
 * fills an entry nothing ever reads — no error, no failure, just the delay
 * back and a second synthesis of the same line. So what is checked here is
 * that the two calls agree, not merely that a preload exists.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const voice = fs.readFileSync(path.join(root, "src/lib/voice.ts"), "utf8");
const matcher = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");

// The warming function has to exist and go through the same door as playback,
// or it warms a different cache from the one a tap reads.
assert.ok(/export function preloadTts\(/.test(voice), "preloadTts is gone");
const preloadBody = voice.slice(voice.indexOf("export function preloadTts("));
assert.ok(/getAudioUrl\(spokenText, effectiveRate\(rate, lang\), lang\)/.test(preloadBody.slice(0, 600)),
  "preloadTts no longer fills the cache playback reads, so warming it achieves nothing");

// ── the Matcher board warms itself ──────────────────────────────────────────
assert.ok(/preloadTts/.test(matcher), "the Matcher board never warms its audio");
assert.ok(/for \(const pair of board\.pairs\)/.test(matcher),
  "the warming does not walk the board, so only part of it is ready");

/** The (rate, lang) each call site uses for a side of a card. */
function argumentsFor(source, fn, side) {
  const pattern = new RegExp(`${fn}\\(\\s*(?:text|pair\\.${side})\\s*,([^)]*)\\)`);
  const found = pattern.exec(source);
  return found ? found[1].replace(/\s+/g, "") : null;
}

// Playback passes them through a conditional; warming names each side
// outright. Compare the values, not the spelling.
const playback = /void tts\(text, side === "de" \? ([\d.]+) : ([\d.]+), side === "de" \? "de-DE" : (\w+)\)/.exec(matcher);
assert.ok(playback, "the Matcher's tts() call has changed shape; this check needs rewriting");
const [, germanRate, englishRate, englishLangVar] = playback;

const warmGerman = argumentsFor(matcher, "preloadTts", "de");
const warmEnglish = argumentsFor(matcher, "preloadTts", "en");
assert.strictEqual(warmGerman, `${germanRate},"de-DE"`,
  `the German side is warmed at ${warmGerman} but played at ${germanRate}, "de-DE" — the warmed entry is never read`);
assert.strictEqual(warmEnglish, `${englishRate},${englishLangVar}`,
  `the English side is warmed at ${warmEnglish} but played at ${englishRate}, ${englishLangVar} — the warmed entry is never read`);

// ── and it must stay a head start, never a blocker ──────────────────────────
// preloadTts returns void and swallows its own failures; a tap has to work
// exactly as it did before whether the warming finished, failed, or never ran.
// Nested parens: effectiveRate(rate, lang) sits inside the argument list, so
// this looks for the .catch that follows the call rather than trying to match
// the argument list itself.
assert.ok(/getAudioUrl\([\s\S]*?\)\s*\.catch\(\(\) => \{\}\)/.test(preloadBody.slice(0, 600)),
  "preloadTts can reject, so a failed warm-up would surface as an unhandled rejection");
assert.ok(!/await preloadTts/.test(matcher),
  "the board waits for its audio before drawing, which trades one delay for a worse one");

console.log(
  "check-tts-prefetch: the Matcher warms every card on the board at the same rate and language "
  + "it will play them, and a tap never waits on it"
);
