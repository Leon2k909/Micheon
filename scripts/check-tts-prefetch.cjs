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
// The text is part of that agreement, not decoration. A word short enough that
// the authored slowdown would spoil it is spoken at a different rate from the
// one this would otherwise work out, so a preload that omits the text warms an
// entry under the wrong key — and warms it for exactly the short words the
// warming was added to help.
assert.ok(/getAudioUrl\(spokenText, effectiveRate\(rate, lang, spokenText\), lang\)/.test(preloadBody.slice(0, 700)),
  "preloadTts no longer fills the cache playback reads, so warming it achieves nothing");

// And the other side of the same agreement: playback must work the rate out
// from the same three things. Pinned here as well because this check's whole
// purpose is that the two calls match, and reading only one of them would let
// them drift apart with this still green.
assert.ok(/const rate = effectiveRate\(item\.rate \?\? DEFAULT_RATE, lang, text\);/.test(voice),
  "playback works its rate out from different inputs than the preload, so the warmed entry is never the one read");

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
// Each column is played in its OWN language, which is not always German and
// English — so both the rate and the voice are compared as expressions rather
// than as the two tags they used to be.
const playback = /void tts\(text, side === "de" \? ([\d.]+) : ([\d.]+), side === "de" \? ([\w.]+) : ([\w.]+)\)/.exec(matcher);
assert.ok(playback, "the Matcher's tts() call has changed shape; this check needs rewriting");
const [, germanRate, englishRate, targetVoiceVar, meaningVoiceVar] = playback;

const warmGerman = argumentsFor(matcher, "preloadTts", "de");
const warmEnglish = argumentsFor(matcher, "preloadTts", "en");
assert.strictEqual(warmGerman, `${germanRate},${targetVoiceVar}`,
  `the target side is warmed at ${warmGerman} but played at ${germanRate}, ${targetVoiceVar} — the warmed entry is never read`);
assert.strictEqual(warmEnglish, `${englishRate},${meaningVoiceVar}`,
  `the meaning side is warmed at ${warmEnglish} but played at ${englishRate}, ${meaningVoiceVar} — the warmed entry is never read`);

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

/**
 * ── and Listen, which had the same job and got it wrong ────────────────────
 *
 * This check guarded the Matcher only. Listen grew a prefetch of its own
 * later, warming both sides at 0.88 while its speech plan played the target
 * at 0.92 and the meaning at 0.95. The rate is part of the cache key, so
 * every clip it warmed was an entry playback never asked for: the fetch it
 * exists to remove still happened, at the start of every card.
 *
 * It went unnoticed because short words hide it. effectiveRate clamps a one-
 * or two-syllable word to 1 whatever rate it is handed, so "ear" and "go"
 * matched by accident and only longer words and sentences — measured at 400
 * to 850 ms upstream — paid.
 *
 * The rates are one exported pair now, read by the plan and by the prefetch,
 * so the two cannot disagree. What is asserted here is that they are still
 * read rather than retyped, because retyping them is the whole story.
 */
const listen = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
const plan = fs.readFileSync(path.join(root, "src/lib/listenMode.ts"), "utf8");

assert.ok(/export const LISTEN_TARGET_RATE\s*=\s*[\d.]+/.test(plan)
  && /export const LISTEN_MEANING_RATE\s*=\s*[\d.]+/.test(plan),
  "the Listen speech rates are no longer exported constants, so the plan and the prefetch can drift again");

assert.ok(/speak\(de, targetLang, en, meaningLang, "target", LISTEN_TARGET_RATE\)/.test(plan),
  "the speech plan no longer plays the target side at LISTEN_TARGET_RATE");
assert.ok(/speak\(en, meaningLang, de, targetLang, "meaning", LISTEN_MEANING_RATE\)/.test(plan),
  "the speech plan no longer plays the meaning side at LISTEN_MEANING_RATE");

assert.ok(/preloadTts\(item\.de,\s*LISTEN_TARGET_RATE,\s*targetLang\)/.test(listen),
  "Listen warms the target side at a literal rate again — it must use the constant the plan plays");
assert.ok(/preloadTts\(item\.en,\s*LISTEN_MEANING_RATE,\s*meaningLang\)/.test(listen),
  "Listen warms the meaning side at a literal rate again — it must use the constant the plan plays");

// No bare decimal may reappear beside a preloadTts call in Listen: that is
// exactly the shape the bug had.
const listenWarmCalls = [...listen.matchAll(/preloadTts\([^)]*\)/g)].map((m) => m[0]);
const literalRate = listenWarmCalls.filter((call) => /,\s*[\d.]+\s*,/.test(call));
assert.strictEqual(literalRate.length, 0,
  `Listen warms with a hard-coded rate: ${literalRate.join(", ")}`);

// The card in front of the learner is warmed too, not only the one after it —
// otherwise the first card of every sitting fetches its own audio.
assert.ok(/if \(playing\) warm\(nextItem\);\s*else warm\(item\);/.test(listen),
  "Listen warms only the next card, so the first card of a sitting still waits on the upstream fetch");

console.log(
  "check-tts-prefetch: the Matcher and Listen both warm audio at the same rate and language "
  + "they will play it, Listen's rates come from one exported pair, and neither waits on the warm"
);
