#!/usr/bin/env node
/**
 * The listening stage: hear it, write it — options only on request.
 *
 * Picking the sentence you heard out of four is recognition, and recognition
 * is the weakest thing a listening check can measure: three of the four
 * options are usually wrong by the first syllable, so the round is passable
 * without having parsed anything. Writing it down is the real test.
 *
 * That makes the round much harder, which is fine, and much easier to make
 * miserable, which is not. Two things have to hold:
 *
 *   1. the typed answer is graded with the SAME tolerance as every other
 *      typing stage — no more, and no less. Measured, that tolerance is
 *      rule-shaped, not distance-shaped: it forgives ss for ß, ue for ü,
 *      sentence case, end punctuation, hab/habe, the fuller written form and
 *      a merged synonym — and it forgives NO typos. "sat" for "satt" is wrong
 *      here exactly as it is wrong at Write it and Recall DE. That is the
 *      deliberate app-wide standard, so this stage inherits it rather than
 *      inventing a softer one of its own; the assertions below hold it to
 *      both edges so neither drifts.
 *   2. the four options are still there, one press away, and pressing them is
 *      recorded as a struggle rather than passed off as a clean answer. This
 *      is what stands in for typo tolerance: the way out of a round you
 *      cannot spell your way through.
 *
 * The grading is checked by running the real matcher. The screen is checked
 * by rendering the real component in both of its modes and reading the HTML,
 * because a stage that grades perfectly and shows the answer teaches nothing.
 */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

function load(entry, options = {}) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: "listening-entry.tsx", loader: "tsx" },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    jsx: "automatic",
    define: {
      "import.meta.env.DEV": "false",
      "import.meta.env.PROD": "true",
      "import.meta.env.MODE": '"production"',
    },
    loader: { ".css": "empty", ".png": "dataurl", ".svg": "dataurl", ".json": "json" },
    write: false,
    logLevel: "silent",
    ...options,
  });
  const compiled = new Module("listening-check", module);
  compiled.filename = path.join(root, ".listening-check.cjs");
  compiled.paths = Module._nodeModulePaths(root);
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  return compiled.exports;
}

// ── how the typed answer is graded ──────────────────────────────────────
const { matchGermanSentence } = load(
  'export { matchGermanSentence } from "./src/lib/germanTextMatch.ts";'
);
const accepts = (typed, target) => matchGermanSentence(typed, target).ok === true;

// What a person actually types after hearing a sentence once. None of these
// is a failure to understand German; all of them would be a failure to
// understand a keyboard.
check("a heard sentence typed correctly is correct",
  accepts("Ich hab es einfach satt.", "Ich hab es einfach satt."));
check("the closing full stop is not the exercise",
  accepts("Ich hab es einfach satt", "Ich hab es einfach satt."));
check("ss for ß is accepted — the sound is identical and the key is not on a UK keyboard",
  accepts("Ich weiss dass ich das kann.", "Ich weiß dass ich das kann."));
check("ue for ü survives, for the same reason",
  accepts("Ich muess los.", "Ich müss los."));
check("stray double spaces do not count",
  accepts("Ich  hab es.", "Ich hab es."));
check("the spoken short form and the fuller written one are both what was said",
  accepts("Ich habe es einfach satt.", "Ich hab es einfach satt."));

// The other edge, stated out loud because it is the cost of this stage: the
// matcher measures rules, not distance, so a mis-typed letter is a miss. A
// learner who heard the sentence perfectly and typed "sat" for "satt" is told
// Not quite. That is the same standard as Write it and Recall DE, and it is
// why the four options have to stay one press away. If a typo tolerance is
// ever added to German grading, this assertion is where it will announce
// itself — and this stage's rescue wording should be reconsidered when it does.
check("a mis-typed letter is a miss — the app has no typo tolerance, here or anywhere",
  !accepts("Ich hab es einfach sat.", "Ich hab es einfach satt."));
check("and a dropped letter mid-word is a miss too",
  !accepts("Kannst du mir kurz helfn?", "Kannst du mir kurz helfen?"));
check("a genuinely different sentence is still wrong",
  !accepts("Ich hab es einfach satt.", "Ich traue mir das zu."));
check("the right words in the wrong order are not the sentence that was said",
  !accepts("Das kann ich weiß ich.", "Ich weiß dass ich das kann."));
check("an empty answer is never correct",
  !accepts("", "Ich hab es."));

// ── what the stage actually puts on screen ──────────────────────────────
// The exercise is internal to GuidedSession, so it is rendered from a copy of
// the real source with two edits: export the exercise, and pin the opening
// phase (and, for the second pass, the opening mode) so the branch under test
// is the one that mounts. Everything else is the shipped code.
// Normalised, because git checks this file out with CRLF on Windows and every
// pin below spans more than one line.
const componentSource = read("src/GuidedSession.tsx").replace(/\r\n?/gu, "\n");
const tempFile = path.join(root, "src", "__listening-dictation-check.tsx");

function renderStage(mode) {
  let source = componentSource.replace(
    'const [phase, setPhase] = useState<Phase>(\n    item?.mastery === "strong" ? MASTERED_PHASES[0] : "Read"\n  );',
    'const [phase, setPhase] = useState<Phase>("ListenPick");'
  );
  if (source === componentSource) throw new Error("the opening-phase state line moved");
  if (mode === "pick") {
    const was = source;
    source = source.replace('useState<"type" | "pick">("type")', 'useState<"type" | "pick">("pick")');
    if (source === was) throw new Error("the listening-mode state line moved");
  }
  fs.writeFileSync(tempFile, `${source}\nexport { SentenceExercise as __Exercise };\n`);
  try {
    const { __Exercise, renderToStaticMarkup, createElement } = load([
      'export { __Exercise } from "./src/__listening-dictation-check.tsx";',
      'export { renderToStaticMarkup } from "react-dom/server";',
      'export { createElement } from "react";',
    ].join("\n"));
    return renderToStaticMarkup(createElement(__Exercise, {
      item: {
        id: "check-1",
        kind: "sentence",
        de: "Ich hab es einfach satt.",
        en: "I'm just fed up with it.",
        lookup: "satt",
      },
      listeningChoicePool: [
        "Ich weiß dass ich das kann.",
        "Ich traue mir das zu.",
        "Ich hab es.",
      ],
      translationChoicePool: ["I'm just fed up with it."],
      onNext() {}, onSkip() {}, onGradeItem() {}, onReviewLevel() {}, onSnooze() {}, onAnswer() {},
    }));
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
}

// A jsdom-shaped world, so the component's browser reads resolve.
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.CustomEvent = dom.window.CustomEvent;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
global.matchMedia = dom.window.matchMedia;
global.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [], addEventListener() {}, removeEventListener() {} };
global.SpeechSynthesisUtterance = function () {};
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

const typing = renderStage("type");
const options = renderStage("pick");

check("the stage opens on a typing box, not on four buttons",
  typing.includes("Type what you heard") && !typing.includes("fs-listening-choices"));
check("it still plays the audio it is asking about",
  typing.includes("Listen carefully") && typing.includes("fs-listening-prompt"));
check("the sentence being asked for is nowhere on screen",
  !typing.includes("Ich hab es einfach satt"));
check("the umlaut bar is there — dictation without ä ö ü ß is a keyboard test",
  typing.includes("fs-charsrow") && typing.includes("ß"));
check("the way out is offered from the start",
  typing.includes("fs-listening-switch") && /Show me the options/.test(typing));

check("asking for the options actually shows four of them",
  options.includes("fs-listening-choices")
  && (options.match(/fs-listening-choice"/g) ?? []).length === 4);
check("the sentence that was said is among them",
  options.includes("Ich hab es einfach satt"));
check("and there is a way back to writing it",
  /Go back to writing it/.test(options));
check("the typing box is gone once the options are up",
  !options.includes("Type what you heard"));

// ── the parts a render cannot see ───────────────────────────────────────
check("the typed answer goes through matchEither — the same grading as every other typing stage",
  /const listeningTypeResult = useMemo\(\s*\(\) => matchEither\(listeningInput\)/.test(componentSource));
check("taking the options records a struggle, so the phrase comes back round",
  /const showListeningChoices = \(\) => \{[\s\S]{0,400}?setGrade\("struggle"\)[\s\S]{0,200}?onGradeItem\?\.\(item\.id, "struggle"\)/
    .test(componentSource));
check("two misses promote the way out from a footnote to an offer",
  /listeningMisses >= 2/.test(componentSource));
check("the number-key shortcut is scoped to the options — otherwise digits typed into the sentence answer the round",
  /if \(phase !== "ListenPick" \|\| listeningMode !== "pick"\) return;/.test(componentSource));
check("entering the stage resets it to dictation, so the next card is not stuck on the easy version",
  /if \(phase === "ListenPick"\) \{[\s\S]{0,300}?setListeningMode\("type"\)/.test(componentSource));

// ── and that both controls are visible ──────────────────────────────────
const styles = read("src/index.css").replace(/\r\n?/gu, "\n");
check("the swap control is styled rather than falling back to unstyled text",
  /\.guided-session \.fs-listening-switch \{/.test(styles));
check("and it reacts to hover, so it reads as a control",
  /\.guided-session \.fs-listening-switch:hover \{/.test(styles));
check("the after-two-misses offer is styled too",
  /\.fs-listening-rescue \{/.test(styles));

if (failures) {
  console.error(`\ncheck-listening-dictation: ${failures} failed`);
  process.exit(1);
}
console.log("\ncheck-listening-dictation: the listening stage asks you to write what you heard, "
  + "grades it to the same standard as every other typing stage, and keeps the four options one press away");
