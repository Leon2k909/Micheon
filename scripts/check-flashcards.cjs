const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const guidedSession = read("src/GuidedSession.tsx");
const picker = read("src/components/FlashcardModePicker.tsx");
const styles = read("src/index.css");

const result = esbuild.buildSync({
  stdin: {
    contents: `export { getFlashcardMode, FLASHCARD_MODE_KEY } from "./src/lib/flashcardMode.ts";`,
    resolveDir: root,
    sourcefile: "flashcard-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("flashcard-check", module);
compiled.filename = path.join(root, ".flashcard-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { FLASHCARD_MODE_KEY, getFlashcardMode } = compiled.exports;

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

check("flip cards are the server-safe default", getFlashcardMode() === "flip");

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
  },
};

check("profiles without a saved preference default to flip cards", getFlashcardMode() === "flip");
stored.set(FLASHCARD_MODE_KEY, "both");
check("an existing show-both choice is preserved", getFlashcardMode() === "both");
stored.set(FLASHCARD_MODE_KEY, "flip");
check("an existing flip choice is preserved", getFlashcardMode() === "flip");
stored.set(FLASHCARD_MODE_KEY, "unexpected-value");
check("invalid old values fall back to flip cards", getFlashcardMode() === "flip");
global.window.localStorage.getItem = () => { throw new Error("storage blocked"); };
check("blocked storage still falls back to flip cards", getFlashcardMode() === "flip");
delete global.window;

const flipFaceStart = guidedSession.indexOf("function FlipFace(");
const flipFaceEnd = guidedSession.indexOf("function SessionFlashcardPreview(", flipFaceStart);
const flipFace = guidedSession.slice(flipFaceStart, flipFaceEnd);

check(
  "the complete flashcard surface owns pointer flipping",
  guidedSession.includes('className={cn("fs-flashcard", mode === "flip" && "is-flippable")}')
    && guidedSession.includes('onClick={mode === "flip" ? toggleFlip : undefined}')
);
check("the inner face does not double-handle pointer clicks", !flipFace.includes("onClick={onFlip}"));
check(
  "the focused flip face supports enter and space",
  flipFace.includes('event.key !== " " && event.key !== "Enter"')
    && flipFace.includes("event.stopPropagation();")
);
check(
  "sound and know-it controls do not accidentally flip the card",
  guidedSession.match(/event\.stopPropagation\(\);/g)?.length >= 4
    // The guard moved up to the grade wrapper when Know it grew its level
    // menu: one stopPropagation now shields the picker, its menu and the
    // fallback button alike from reaching the card's flip handler.
    && /className="fs-flashcard-grade" onClick=\{\(event\) => event\.stopPropagation\(\)\}>[\s\S]{0,320}<ReviewLevelPicker[\s\S]{0,700}className="fs-flashcard-known"/.test(guidedSession)
);
check(
  "sentence clicks flip in flip mode but still speak in show-both mode",
  guidedSession.includes('onClick={mode === "both" ? (event) => { event.stopPropagation(); speak(text, lang); } : undefined}')
);
check("flippable cards have a full-surface pointer cue", styles.includes(".fs-flashcard.is-flippable") && styles.includes("cursor: pointer"));
check("the settings picker presents the default flip option first", picker.indexOf('id: "flip"') < picker.indexOf('id: "both"'));

if (failures) {
  console.error(`\n${failures} flashcard regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nFlashcard defaults, full-card flipping and protected controls are guarded");
