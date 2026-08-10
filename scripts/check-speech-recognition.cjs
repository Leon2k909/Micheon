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

const { buildPronunciationFeedback } = loadTypeScript("src/lib/pronunciationFeedback.ts");
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

console.log("Speech recognition runtime, lifecycle, stage, and pronunciation feedback are guarded");
