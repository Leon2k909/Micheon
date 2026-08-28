#!/usr/bin/env node
/**
 * The voice starts clean after silence, and the app still sleeps when idle.
 *
 * Since the idle fix, the speech AudioContext suspends four seconds after the
 * last sound — that is what stopped the app costing 8% of a core while
 * minimised, and it stays. The regression it introduced was WHERE the wake-up
 * was paid: playback awaited context.resume() immediately before play(), so
 * every clip beginning after a quiet gap put the audio device's spin-up on
 * the critical path, and a graph woken at the instant it is asked to carry
 * sound can garble its opening samples. Heard as speech that is sometimes a
 * little late and croaks at the start — only sometimes, because only the clip
 * after a gap pays it, which in Listen and lessons is most first clips.
 *
 * The shape of the fix, each part of which this check pins because each can
 * be lost independently:
 *
 *  1. The wake starts when the clip is REQUESTED, overlapping the fetch.
 *  2. A held pause (the learner's turn to speak) keeps the context awake —
 *     the sequence is still in flight, that is not idle.
 *  3. Every playback exit re-arms the suspend, aborted ones included, or one
 *     interruption leaves the audio thread awake for good.
 *  4. A stale timer never suspends a clip that is audibly playing.
 *  5. And the suspend itself survives — fixing the croak by deleting the
 *     idle fix would bring back the input lag it was built to remove.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const voice = fs.readFileSync(path.join(root, "src/lib/voice.ts"), "utf8").replace(/\r\n?/gu, "\n");

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

check("the wake starts at the request, before the fetch", () => {
  const playOne = voice.slice(voice.indexOf("async function playOne"));
  const warm = playOne.indexOf("prewarmSpeechAudio();");
  const fetch = playOne.indexOf("await getAudioUrl(");
  assert.ok(warm !== -1, "playOne never wakes the audio hardware, so the spin-up lands after the fetch again");
  assert.ok(fetch !== -1, "playOne's fetch could not be found, so the ordering cannot be judged");
  assert.ok(warm < fetch, "the wake starts after the fetch, so nothing overlaps and the whole spin-up is waited out");
});

check("the prewarm wakes an existing context and never conjures one", () => {
  const body = /function prewarmSpeechAudio\(\) \{([\s\S]*?)\n\}/.exec(voice);
  assert.ok(body, "prewarmSpeechAudio is gone");
  assert.ok(body[1].includes("cancelAudioIdleSuspend()"),
    "the prewarm leaves the idle timer running, which can suspend the context mid-wake");
  assert.ok(/state === "suspended"/.test(body[1]) && /\.resume\(\)/.test(body[1]),
    "the prewarm no longer resumes a suspended context, so the croak is back");
  assert.ok(!/getSharedAudioContext|new AudioContext/.test(body[1]),
    "the prewarm creates a context: before the first sound there is nothing to wake, and a context "
    + "created outside a playback path is how autoplay policy hands back one that never runs");
});

check("a held pause is playback, not idleness", () => {
  const hold = /if \(item\.pauseBeforeMs && getTtsAudioVolume\(item\.lang\) > 0\) \{([\s\S]*?)await silence\(/.exec(voice);
  assert.ok(hold, "the pause hold could not be found");
  assert.ok(hold[1].includes("cancelAudioIdleSuspend()"),
    "the idle timer keeps ticking through the learner's speaking turn, so the clip after it wakes the "
    + "hardware at the one moment a late croaky start is most noticeable");
});

check("every playback exit re-arms the suspend, aborted exits included", () => {
  const rearms = voice.split("\n").filter((line, index, lines) => {
    if (!line.includes("scheduleAudioIdleSuspend();")) return false;
    // The re-arm must sit inside a .finally, before its token guard, so an
    // abort that bumped the token still re-arms.
    const behind = lines.slice(Math.max(0, index - 8), index).join("\n");
    return behind.includes(".finally(() => {");
  }).length;
  assert.strictEqual(rearms, 2,
    `${rearms} of 2 playback exits re-arm the suspend: an interrupted playback on the uncovered path `
    + "leaves the audio thread awake for good");
  for (const match of voice.matchAll(/\.finally\(\(\) => \{([\s\S]{0,600}?)if \(token === playSeq\)/g)) {
    assert.ok(match[1].includes("scheduleAudioIdleSuspend();"),
      "the re-arm sits inside the token guard, so a stop that bumped the token skips it");
  }
});

check("a stale timer never silences a playing clip", () => {
  const timer = /audioIdleTimer = setTimeout\(\(\) => \{([\s\S]*?)\}, AUDIO_IDLE_SUSPEND_MS\);/.exec(voice);
  assert.ok(timer, "the idle timer could not be found");
  const guard = timer[1].indexOf("if (currentAudio || currentUtterance) return;");
  const suspend = timer[1].indexOf(".suspend()");
  assert.ok(guard !== -1,
    "the timer suspends without asking whether something is audibly playing — a re-arm from an "
    + "interrupted sequence can land after its successor starts, and this cuts that successor off mid-word");
  assert.ok(suspend !== -1 && guard < suspend, "the playing guard sits after the suspend, so it guards nothing");
});

check("the idle suspend itself survives", () => {
  assert.ok(/const AUDIO_IDLE_SUSPEND_MS = \d+;/.test(voice),
    "the idle delay is gone — if the croak was fixed by deleting the suspend, the idle cost it removed is back");
  const delay = Number(/const AUDIO_IDLE_SUSPEND_MS = (\d+);/.exec(voice)[1]);
  assert.ok(delay >= 1000 && delay <= 60_000,
    `the idle delay is ${delay}ms — short enough to thrash between clips, or long enough to never fire`);
  assert.ok(/void context\.suspend\(\)\.catch/.test(voice), "nothing suspends the context any more");
});

check("the analyser still refuses to route sound into a context that is not running", () => {
  const attach = voice.slice(voice.indexOf("async function attachAudioAnalysis"));
  assert.ok(/if \(context\.state === "suspended"\) \{\s*try \{ await context\.resume\(\); \}/.test(attach),
    "the analyser no longer awaits the resume, so the prewarm is the only thing standing between a "
    + "suspended graph and a routed clip — and the prewarm is deliberately fire-and-forget");
  assert.ok(attach.includes('if (context.state !== "running"'),
    "a clip can be routed into a non-running context, which plays it silently");
});

if (failed) {
  console.error(`\n${failed} audio wake check(s) failed.`);
  process.exit(1);
}
console.log("check-audio-wake: the hardware wakes under the fetch, sleeps when truly idle, and never mutes a playing clip.");
process.exit(0);
