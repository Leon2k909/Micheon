const assert = require("assert");
const fs = require("fs");
const Module = require("module");
const path = require("path");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const speech = require(path.join(root, "electron", "speech-recognition.cjs"));
const settings = require(path.join(root, "electron", "desktop-settings.cjs"));
const speechSource = read("electron/speech-recognition.cjs");

function loadTypeScript(relativePath) {
  const sourcePath = path.join(root, relativePath);
  const built = esbuild.buildSync({
    bundle: true,
    entryPoints: [sourcePath],
    format: "cjs",
    platform: "node",
    write: false,
  });
  const loaded = new Module(sourcePath, module);
  loaded.filename = sourcePath;
  loaded.paths = Module._nodeModulePaths(path.dirname(sourcePath));
  loaded._compile(built.outputFiles[0].text, sourcePath);
  return loaded.exports;
}

const feedback = loadTypeScript("src/lib/pronunciationFeedback.ts");
const { buildPronunciationFeedback } = feedback;
const main = read("electron/main.js");
const preload = read("electron/preload.cjs");
const guided = read("src/GuidedSession.tsx");
const phases = read("src/lib/guidedLessonPhases.ts");
const profile = read("src/components/SpeechRecognitionSettings.tsx");

assert.equal(speech.WHISPER_RUNTIME_VERSION, "1.9.2");
assert.equal(speech.WHISPER_MODEL_NAME, "large-v3-turbo-q5_0");
assert.equal(speech.WHISPER_MODEL_SIZE, 574041195);
assert.match(speech.WHISPER_RUNTIME_SHA256, /^[a-f0-9]{64}$/);
assert.match(speech.WHISPER_MODEL_SHA256, /^[a-f0-9]{64}$/);

const parsed = speech.parseWhisperJson({
  result: { language: "de" },
  transcription: [{ text: " Hallo Welt.", tokens: [{ text: " Hallo", p: 0.91 }] }],
});
assert.equal(parsed.text, "Hallo Welt.");
assert.equal(parsed.language, "de");
assert.deepEqual(parsed.tokens, [{ text: " Hallo", probability: 0.91 }]);

const exact = buildPronunciationFeedback("Ich weiß, was du meinst.", "ich weiss was du meinst");
assert.equal(exact.score, 1, "ß and ss are the same sound for pronunciation feedback");

const missing = buildPronunciationFeedback("Komm gut nach Hause.", "Komm nach Hause");
assert(missing.score < 1);
assert(missing.segments.some((segment) => segment.status === "needs-work" && segment.text.includes("gut")));

const umlaut = buildPronunciationFeedback("So ungefähr.", "So ungefahr");
assert(umlaut.segments.some((segment) => segment.status === "needs-work" && segment.text.includes("ä")));

assert.equal(settings.DEFAULT_DESKTOP_SETTINGS.speechRecognitionEnabled, true);
assert.equal(settings.normalizeDesktopSettings({}).speechRecognitionEnabled, true);
assert.equal(settings.normalizeDesktopSettings({ speechRecognitionEnabled: false }).speechRecognitionEnabled, false);
assert(speechSource.includes("scheduleInstallRetry") && speechSource.includes("void ensureInstalled()"));

assert(main.includes("void getSpeechRecognitionManager().ensureInstalled()"));
assert(main.includes('ipcMain.handle("speech-recognition:transcribe"'));
assert(preload.includes("transcribeSpeech") && preload.includes("onSpeechRecognitionStatus"));
assert(phases.includes('"Speak"'));
assert(guided.includes("<SpeakingPractice") && guided.includes("buildPronunciationFeedback"));
assert(profile.includes("Uninstall speech recognition?") && profile.includes("Reinstall"));

// ── waiting for the answer ──────────────────────────────────────────────────
//
// Whisper's own defaults made every attempt cost about seventeen seconds
// regardless of how long you spoke: four threads whatever the machine has, and
// an encoder that pads everything to a thirty-second window. Measured on a
// 5.4-second clip: 16.6s shipped, 9.0s with the threads, 2.4s with both.
//
// The risk is the second one. Too small an audio context truncates the
// recording, so it is derived from the clip and checked here against clips of
// several lengths rather than pinned to one number that looked fine once.
const wav = (seconds, { sampleRate = 16000, channels = 1, bits = 16 } = {}) => {
  const bytesPerSecond = sampleRate * channels * (bits / 8);
  const buffer = Buffer.alloc(44 + Math.round(seconds * bytesPerSecond));
  buffer.write("RIFF", 0, "ascii");
  buffer.write("WAVE", 8, "ascii");
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt16LE(bits, 34);
  return buffer;
};
const tuningFor = (seconds, cores) => {
  const args = speech.transcriptionTuning(wav(seconds), cores);
  const at = (flag) => (args.indexOf(flag) === -1 ? null : Number(args[args.indexOf(flag) + 1]));
  return { args, threads: at("-t"), context: at("-ac") };
};

// The duration is read from the header, not assumed from the byte count.
assert(Math.abs(speech.wavDurationSeconds(wav(5)) - 5) < 0.01);
assert(Math.abs(speech.wavDurationSeconds(wav(5, { sampleRate: 48000, channels: 2 })) - 5) < 0.01);
assert(speech.wavDurationSeconds(Buffer.alloc(10)) === 0);

// Threads: use the machine, leave it usable, and never go below whisper's own
// default -- a two-core laptop must not come out of this slower than it was.
assert.equal(tuningFor(5, 16).threads, 14);
assert.equal(tuningFor(5, 8).threads, 6);
assert.equal(tuningFor(5, 4).threads, 4);
assert.equal(tuningFor(5, 2).threads, 4);
assert.equal(tuningFor(5, 0).threads, 4);

// Context: big enough for what was said, with room to spare. 1500 frames is
// the full thirty seconds, so a second of audio needs fifty.
for (const seconds of [1, 3, 5.4, 9.9, 15, 24]) {
  const { context } = tuningFor(seconds, 16);
  assert(context !== null, `a ${seconds}s clip should size the window`);
  assert(
    context >= seconds * 50,
    `a ${seconds}s clip asked for ${context} frames, which cannot hold it`
  );
  assert(context >= 256 && context < 1500);
}
// A long recording gets the whole window rather than a clipped one.
assert.equal(tuningFor(26, 16).context, null);
assert.equal(tuningFor(40, 16).context, null);
// A ten-second clip must not be handed a five-second window.
assert(tuningFor(9.9, 16).context > tuningFor(3, 16).context);
// And the tuning has to actually reach whisper.
assert(speechSource.includes("...transcriptionTuning(audio)"));

// ── a repaired sentence must not read as a clean one ────────────────────────
//
// These are real whisper outputs, captured by synthesising each sentence twice:
// once with a German voice, once with an English voice reading the same German
// text — which is what a learner who cannot pronounce it yet actually sounds
// like. The numbers are the model's own confidence per token.
//
// The English readings are the whole problem: the text comes back nearly
// right, so letter-matching alone called the last one 97%. The confidence did
// not come back right, and that is the signal being used.
const NATIVE_S1 = [
  [" Ich", 0.539], [" glaube", 0.997], [",", 0.964], [" wir", 0.995], [" haben", 0.999],
  [" alles", 0.995], [",", 0.986], [" was", 0.997], [" wir", 1.0], [" brauchen", 0.999], [".", 0.952],
];
const ENGLISH_S5 = [
  [" Das", 0.945], [" W", 0.331], ["etter", 0.946], [" ist", 0.995], [" heute", 0.256],
  [" wirklich", 0.345], [" schon", 0.619], [".", 0.749],
];
const NATIVE_S3 = [
  [" Ich", 0.929], [" hätte", 0.999], [" gern", 0.988], [" einen", 0.999],
  [" K", 0.997], ["aff", 1.0], ["ee", 0.999], [".", 0.939],
];
const asTokens = (rows) => rows.map(([text, probability]) => ({ text, probability }));

const nativeS1 = feedback.buildPronunciationFeedback(
  "Ich glaube, wir haben alles, was wir brauchen.",
  "Ich glaube, wir haben alles, was wir brauchen.",
  asTokens(NATIVE_S1)
);
assert.deepEqual(nativeS1.unclearWords, [], "a native speaker is being told they mumbled");
assert(nativeS1.score === 1, `a clean native reading scored ${nativeS1.score}`);

const nativeS3 = feedback.buildPronunciationFeedback(
  "Ich hätte gern einen Kaffee.",
  "Ich hätte gern einen Kaffee.",
  asTokens(NATIVE_S3)
);
assert.deepEqual(nativeS3.unclearWords, []);
assert(nativeS3.score === 1);

// The case that started this: right words, barely heard.
const englishS5 = feedback.buildPronunciationFeedback(
  "Das Wetter ist heute wirklich schön.",
  "Das Wetter ist heute wirklich schon.",
  asTokens(ENGLISH_S5)
);
assert(
  englishS5.unclearWords.includes("heute") && englishS5.unclearWords.includes("wirklich"),
  `the guessed words were not called out: ${JSON.stringify(englishS5.unclearWords)}`
);
assert(
  englishS5.score < 0.8,
  `a sentence the model guessed at still scored ${Math.round(englishS5.score * 100)}%`
);
// A wrong word the model was also unsure of must not collect near-miss credit
// for sharing letters with the right one. "wie viel" came back "we will" at
// 0.42 and 0.14, and letter overlap alone scored that sentence 90%.
const ENGLISH_S6 = [
  [" Ent", 0.88], ["sch", 0.681], ["uld", 0.978], ["igung", 0.935], [",", 0.861],
  [" we", 0.424], [" will", 0.137], [" kost", 0.575], ["et", 0.98], [" das", 0.982], [".", 0.728],
];
const englishS6 = feedback.buildPronunciationFeedback(
  "Entschuldigung, wie viel kostet das?",
  "Entschuldigung, we will kostet das.",
  asTokens(ENGLISH_S6)
);
assert(
  englishS6.score <= 0.8,
  `a guessed-at wrong word still earned near-miss credit: ${Math.round(englishS6.score * 100)}%`
);
// ...but a genuine near miss keeps its credit. "schön" heard as "schon" is one
// vowel out, and the model was sure of it; that must still read as mostly right.
const nearMiss = feedback.buildPronunciationFeedback(
  "So ungefähr.", "So ungefahr.",
  asTokens([[" So", 0.98], [" ungef", 0.97], ["ahr", 0.96], [".", 0.95]])
);
assert(nearMiss.score > 0.85, `a confident near miss was punished as a guess: ${nearMiss.score}`);

// Without confidence — the browser fallback — nothing changes from before.
const noConfidence = feedback.buildPronunciationFeedback(
  "Das Wetter ist heute wirklich schön.",
  "Das Wetter ist heute wirklich schon.",
);
assert.deepEqual(noConfidence.unclearWords, []);
assert(noConfidence.score > 0.9, "the browser fallback should be unaffected");

// The threshold has to stay between the two populations that were measured.
assert(
  feedback.UNCLEAR_BELOW < 0.539 && feedback.UNCLEAR_BELOW > 0.35,
  "the unclear threshold has moved outside the range the measurements support"
);
// Sub-word pieces regroup into words, and a word takes its WORST piece.
const regrouped = feedback.heardWordsWithConfidence(asTokens([
  [" Har", 0.54], ["ben", 0.673], ["er", 0.14], ["ls", 0.736],
]));
assert.equal(regrouped.length, 1);
assert.equal(regrouped[0].text, "Harbenerls");
assert(Math.abs(regrouped[0].confidence - 0.14) < 1e-9, "a word must take its weakest syllable");

// ── the Speak stage must not claim to mark pronunciation ────────────────────
//
// It cannot. Whisper is a language model and it repairs the speaker: read the
// German in a broad English accent -- "Ikh glaubay, veer harben alles" -- and
// it returns "Ich glaube, wir haben alles, was wir brauchen" with per-word
// confidence of 0.91 to 0.98. Not hedging. Confident, and wrong about what was
// actually said. So a high score here means the words were RECOVERABLE, and the
// copy has to say that, because "Excellent" over a mispronounced sentence
// teaches the mistake.
const speakCopy = [
  "Every word came through.",
  "Most of it came through. The red parts did not.",
  "That did not come through. Try it again slowly.",
];
for (const line of speakCopy) {
  assert(guided.includes(line), `the Speak stage lost its wording: ${line}`);
}
// Nothing in the result panel may praise the SOUND of the attempt.
const resultPanel = guided.slice(
  guided.indexOf("function pronunciationMessage"),
  guided.indexOf("function pronunciationMessage") + 1400,
);
for (const overclaim of ["clearly", "Excellent", "perfect", "sounds German", "pronounced"]) {
  assert(
    !resultPanel.includes(overclaim),
    `the Speak stage says "${overclaim}", which claims a judgement about pronunciation that it cannot make`
  );
}
// And it has to say so out loud rather than leaving a bare percentage that
// looks like a mark out of a hundred.
const caveat = "This checks whether your words came through, not how close your accent is.";
assert(guided.includes(caveat), "the Speak stage no longer explains what the score is not");
assert(guided.includes('<small>{ui("understood")}</small>'), "the score has no label, so it reads as a mark");
// German learners see this panel too.
const german = read("src/lib/i18n.ts");
for (const line of [...speakCopy, caveat.slice(0, 40), '"understood"']) {
  assert(german.includes(line), `the Speak stage wording is untranslated: ${line}`);
}

console.log("Speech recognition runtime, lifecycle, stage, pronunciation feedback, transcription tuning, and the limits of what the Speak stage claims are guarded");
