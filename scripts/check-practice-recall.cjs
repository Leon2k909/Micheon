/**
 * The practice card asks new questions, and brings the old ones back on time.
 *
 * It used to hold three questions written into the source and cycle them with
 * `(index + 1) % 3`, so the fourth question of any session was the first one
 * again. What is wanted is a fresh question each time, and a schedule for
 * the ones already seen:
 *
 *   right  → "erst wieder nach so 30 fragen"
 *   wrong  → "immer mal wieder alle paar fragen ... bis man sie richtig hat"
 *   fixed  → "soll auch die immer mal wieder vorkommen"
 *
 * Those three lines are what this file checks, against the real functions.
 * The fourth thing it checks is the direction: the card asks in the language
 * you have and offers answers in the language you are learning, which was
 * fixed the German-learning way round and so practised the wrong language for
 * anyone learning English.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// --- a browser just real enough for the storage and direction modules -------

const store = new Map();
const localStorageStub = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  key: (index) => [...store.keys()][index] ?? null,
  removeItem: (key) => void store.delete(key),
  setItem: (key, value) => void store.set(key, String(value)),
};
Object.defineProperty(localStorageStub, "length", { get: () => store.size });
globalThis.window = {
  addEventListener() {},
  dispatchEvent() {},
  localStorage: localStorageStub,
  removeEventListener() {},
};
globalThis.localStorage = localStorageStub;
globalThis.CustomEvent = class {
  constructor(type, init) { this.type = type; this.detail = init?.detail; }
};
globalThis.fetch = async () => ({ json: async () => ({ items: {} }), ok: true });

const result = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/practiceRecall.ts";
export * from "./src/lib/practiceQuestions.ts";
export { setLearningDirection } from "./src/lib/direction.ts";`,
    resolveDir: root,
    sourcefile: "practice-recall-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("practice-recall-check", module);
compiled.filename = path.join(root, ".practice-recall-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  PRACTICE_MAX_GAP,
  PRACTICE_RECOVERY_GAP,
  PRACTICE_RIGHT_GAPS,
  PRACTICE_WRONG_GAP,
  applyPracticeAnswer,
  buildPracticeQuestion,
  createPracticeRecallState,
  practiceCandidates,
  selectPracticeItem,
  setLearningDirection,
} = compiled.exports;

// --- the schedule ----------------------------------------------------------

check(
  "a right answer holds the phrase back for at least 30 questions",
  PRACTICE_RIGHT_GAPS.every((gap) => gap >= 30) && PRACTICE_RIGHT_GAPS[0] === 30
);
check(
  "a wrong answer brings it back within a few questions",
  PRACTICE_WRONG_GAP > 0 && PRACTICE_WRONG_GAP <= 5,
  `gap is ${PRACTICE_WRONG_GAP}`
);
check(
  "a phrase never stops circulating",
  Number.isFinite(PRACTICE_MAX_GAP) && PRACTICE_MAX_GAP > 0
);

let state = createPracticeRecallState();
state = applyPracticeAnswer(state, "phrase-a", true);
const afterRight = state.entries.find((entry) => entry.itemId === "phrase-a");
check(
  "right: due 30 questions later, counted from the question just asked",
  afterRight.dueQuestion - state.questionCount === 30,
  `waited ${afterRight.dueQuestion - state.questionCount}`
);
check("right: nothing left outstanding", afterRight.misses === 0 && afterRight.successes === 1);

state = applyPracticeAnswer(state, "phrase-b", false);
const afterWrong = state.entries.find((entry) => entry.itemId === "phrase-b");
check(
  "wrong: due again in a few questions",
  afterWrong.dueQuestion - state.questionCount === PRACTICE_WRONG_GAP
);

// ...and it keeps coming back until it is answered correctly.
let asked = 0;
for (let round = 0; round < 4; round += 1) {
  // Answer other things until the missed phrase is due again.
  while (state.entries.find((entry) => entry.itemId === "phrase-b").dueQuestion > state.questionCount) {
    state = applyPracticeAnswer(state, `filler-${state.questionCount}`, true);
  }
  const picked = selectPracticeItem(state, [{ id: "phrase-b" }, { id: "phrase-c" }, { id: "phrase-d" }], "other");
  if (picked?.id === "phrase-b") asked += 1;
  state = applyPracticeAnswer(state, "phrase-b", false);
}
check(
  "wrong: it is chosen again every time it falls due, not once",
  asked === 4,
  `chosen ${asked} of 4 times`
);

// Getting it right at last does not retire it.
while (state.entries.find((entry) => entry.itemId === "phrase-b").dueQuestion > state.questionCount) {
  state = applyPracticeAnswer(state, `filler-${state.questionCount}`, true);
}
state = applyPracticeAnswer(state, "phrase-b", true);
const afterFix = state.entries.find((entry) => entry.itemId === "phrase-b");
check(
  "fixed: comes back sooner than an untroubled phrase, because one right answer straight after four wrong ones proves little",
  afterFix.dueQuestion - state.questionCount === PRACTICE_RECOVERY_GAP
    && PRACTICE_RECOVERY_GAP < PRACTICE_RIGHT_GAPS[0]
);
check("fixed: the miss count is cleared", afterFix.misses === 0);
check(
  "fixed: still scheduled, never dropped",
  Number.isFinite(afterFix.dueQuestion) && state.entries.some((entry) => entry.itemId === "phrase-b")
);

// --- what gets asked next --------------------------------------------------

const pool = [{ id: "seen-right" }, { id: "missed" }, { id: "fresh" }];
let order = createPracticeRecallState();
order = applyPracticeAnswer(order, "seen-right", true);
order = applyPracticeAnswer(order, "missed", false);
for (let index = 0; index < PRACTICE_WRONG_GAP; index += 1) {
  order = applyPracticeAnswer(order, `filler-${index}`, true);
}
check(
  "a due miss is asked before anything else",
  selectPracticeItem(order, pool, "none")?.id === "missed"
);

let freshFirst = createPracticeRecallState();
freshFirst = applyPracticeAnswer(freshFirst, "seen-right", true);
check(
  "with nothing overdue, a phrase never asked comes next",
  selectPracticeItem(freshFirst, [{ id: "seen-right" }, { id: "fresh" }], "none")?.id === "fresh"
);
check(
  "the phrase just answered is never asked twice in a row",
  selectPracticeItem(freshFirst, [{ id: "fresh" }, { id: "other" }], "fresh")?.id === "other"
);
check(
  "an empty history still produces a question",
  Boolean(selectPracticeItem(createPracticeRecallState(), pool))
);

// --- direction -------------------------------------------------------------

const catalogue = [
  { de: "Lass mich kurz überlegen.", en: "Let me think for a moment.", id: "p1", kind: "phrase", partKey: "part1", partLabel: "Everyday", use: "Everyday conversation" },
  { de: "Das kommt darauf an.", en: "That depends.", id: "p2", kind: "phrase", partKey: "part1", partLabel: "Everyday" },
  { de: "Mir ist beides recht.", en: "Either is fine with me.", id: "p3", kind: "phrase", partKey: "part1", partLabel: "Everyday" },
  { de: "Ich weiß es nicht.", en: "I don't know.", id: "p4", kind: "phrase", partKey: "part1", partLabel: "Everyday" },
  { de: "Bis später.", en: "See you later.", id: "p5", kind: "phrase", partKey: "part1", partLabel: "Everyday" },
  { de: "der Tisch", en: "the table", id: "v1", kind: "vocab", partKey: "part1", partLabel: "Everyday" },
];

setLearningDirection("learn-en");
const forEnglish = practiceCandidates(catalogue);
check(
  "learning English: the question is German and the answers are English",
  forEnglish[0].prompt === "Lass mich kurz überlegen."
    && forEnglish[0].answer === "Let me think for a moment."
);

setLearningDirection("learn-de");
const forGerman = practiceCandidates(catalogue);
check(
  "learning German: the same phrase the other way round",
  forGerman[0].prompt === "Let me think for a moment."
    && forGerman[0].answer === "Lass mich kurz überlegen."
);
check(
  "single words are left to the vocabulary tools; this card asks for phrases",
  forGerman.every((candidate) => candidate.id !== "v1")
);

const question = buildPracticeQuestion(forGerman[0], forGerman, () => 0.5);
check("a question offers four answers", question.options.length === 4);
check("exactly one of them is right", question.options.filter((option) => option.correct).length === 1);
check(
  "the wrong ones are real phrases from the catalogue, each shown once",
  new Set(question.options.map((option) => option.text)).size === 4
    && question.options.every((option) => forGerman.some((candidate) => candidate.answer === option.text))
);
check(
  "every answer carries its meaning, so a miss can be told what it picked",
  question.options.every((option) => typeof option.meaning === "string" && option.meaning.length > 0)
);
check(
  "the audio button speaks the language being learned",
  question.answerLangTag === "de-DE"
);
setLearningDirection("learn-en");
check(
  "...and the other language when that is what is being learned",
  buildPracticeQuestion(practiceCandidates(catalogue)[0], practiceCandidates(catalogue), () => 0.5).answerLangTag === "en-US"
);

// The correct answer must not always be in the same place.
const positions = new Set();
for (let seed = 0; seed < 12; seed += 1) {
  const drawn = buildPracticeQuestion(forGerman[0], forGerman, () => (seed % 7) / 7);
  positions.add(drawn.options.findIndex((option) => option.correct));
}
check("the right answer moves around", positions.size > 1, `only ever at ${[...positions]}`);

// --- the card is wired to the catalogue ------------------------------------

const shell = fs.readFileSync(
  path.join(root, "src/prototype/NewUiPrototype.tsx"),
  "utf8"
).split("\r\n").join("\n");

check(
  "the three hand-written questions are gone",
  !shell.includes("const EXERCISES") && !shell.includes("Either is fine with me.")
);
check(
  "the card draws from the course catalogue",
  shell.includes("practiceCandidates(buildCatalog(apiParts))")
);
check(
  "it asks the schedule which phrase comes next, and records the answer",
  shell.includes("selectPracticeItem(from, candidates, justAskedId)")
    && shell.includes("savePracticeRecallState(applyPracticeAnswer(")
);
// The schedule lived in a useState, and a click handler reads whatever the
// last render captured. Two questions in, every draw was asking a copy that
// had stopped counting — so the same phrase was still the most overdue one
// and the card offered it again, and again. Caught by clicking through the
// running app, not by reading the code.
check(
  "the schedule is read at the moment it is used, never from a captured copy",
  shell.includes("drawQuestion(loadPracticeRecallState(), question?.id)")
    && shell.includes("applyPracticeAnswer(loadPracticeRecallState(), question.id, isRight)")
    && !shell.includes("useState<PracticeRecallState>")
);
check(
  "only the first answer to a question is recorded",
  shell.includes("if (scored.current) return;")
);
check(
  "a miss can move on, because the phrase comes back on its own",
  /<button className="np-feedback-next" onClick=\{nextQuestion\}/.test(shell)
);
check(
  "the phrase is read aloud in the language being learned",
  shell.includes("playPhrase(solution.text, question.answerLangTag)")
    && !shell.includes(`utterance.lang = "de-DE"`)
);

if (failures > 0) {
  console.error(`\n${failures} practice recall check(s) failed.`);
  process.exit(1);
}
console.log("\nThe practice card keeps asking, and brings misses back until they stick.");
