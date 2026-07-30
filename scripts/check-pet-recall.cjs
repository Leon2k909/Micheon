const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/petRecall.ts";`,
    resolveDir: root,
    sourcefile: "pet-recall-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("pet-recall-check", module);
compiled.filename = path.join(root, ".pet-recall-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  CODEX_PET_RECALL_KEY,
  PET_RECALL_FOCUS_CHANCE,
  advancePetRecallQuestion,
  applyPetRecallAnswer,
  createPetRecallState,
  loadPetRecallState,
  selectPrioritizedPetRecallItem,
} = compiled.exports;

const provider = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetProvider.tsx"),
  "utf8"
);
const lab = fs.readFileSync(path.join(root, "src/german_learning_lab.tsx"), "utf8");
const main = fs.readFileSync(path.join(root, "electron/main.js"), "utf8");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const itemA = { id: "phrase-a", aliases: ["alias-a"] };
const itemB = { id: "phrase-b" };
const itemC = { id: "phrase-c" };
const candidates = [itemA, itemB, itemC];

function ask(state, item) {
  return advancePetRecallQuestion(state, {
    aliases: item.aliases,
    itemId: item.id,
  });
}

function answer(state, item, recallSequence, response, now) {
  return applyPetRecallAnswer(state, {
    aliases: item.aliases,
    itemId: item.id,
    recallSequence,
  }, response, now);
}

let state = createPetRecallState();
const firstQuestion = ask(state, itemA);
state = firstQuestion.state;
const firstMiss = answer(state, itemA, firstQuestion.questionNumber, "no", 1000);
state = firstMiss.state;

check("No places the missed phrase in focused recall", firstMiss.outcome === "focused");
check(
  "focused recall heavily favours the same phrase even inside the recent-item window",
  selectPrioritizedPetRecallItem(
    state,
    candidates,
    new Set([itemA.id]),
    () => PET_RECALL_FOCUS_CHANCE - 0.01
  )?.id === itemA.id
);
check(
  "focused recall still leaves room for a different question",
  selectPrioritizedPetRecallItem(
    state,
    candidates,
    new Set([itemA.id]),
    () => PET_RECALL_FOCUS_CHANCE + 0.01
  ) === undefined
);

state = ask(state, itemB).state;
check(
  "one different question may still appear before the focused repeat",
  selectPrioritizedPetRecallItem(state, candidates, new Set([itemA.id, itemB.id]), () => 0.99)
    === undefined
);
state = ask(state, itemC).state;
check(
  "two different questions force the missed phrase next",
  selectPrioritizedPetRecallItem(state, candidates, new Set(candidates.map((item) => item.id)), () => 0.99)
    ?.id === itemA.id
);

const focusedRepeat = ask(state, itemA);
state = focusedRepeat.state;
const remembered = answer(state, itemA, focusedRepeat.questionNumber, "yes", 2000);
state = remembered.state;
check("Yes moves a missed phrase into reinforcement", remembered.outcome === "reinforcement");
check(
  "reinforcement waits for short-term spacing instead of repeating immediately",
  selectPrioritizedPetRecallItem(state, candidates, new Set([itemA.id]), () => 0) === undefined
);

state = ask(state, itemB).state;
state = ask(state, itemC).state;
state = ask(state, itemB).state;
check(
  "the remembered phrase returns randomly when its first follow-up is due",
  selectPrioritizedPetRecallItem(state, candidates, new Set([itemB.id]), () => 0.1)?.id === itemA.id
);

const firstFollowUp = ask(state, itemA);
state = firstFollowUp.state;
const reinforced = answer(state, itemA, firstFollowUp.questionNumber, "yes", 3000);
state = reinforced.state;
check("a first follow-up schedules a wider second check", reinforced.outcome === "reinforcement");
for (let index = 0; index < 8; index += 1) {
  state = ask(state, index % 2 ? itemB : itemC).state;
}
check(
  "the same phrase returns for its later follow-up",
  selectPrioritizedPetRecallItem(state, candidates, new Set([itemB.id, itemC.id]), () => 0.1)?.id
    === itemA.id
);

const secondFollowUp = ask(state, itemA);
state = secondFollowUp.state;
const retired = answer(state, itemA, secondFollowUp.questionNumber, "yes", 4000);
state = retired.state;
check("repeated successful checks retire the phrase from the short-term queue", retired.outcome === "retired");
check("retired phrases no longer override normal questions", state.entries.length === 0);

let queuedState = createPetRecallState();
const queuedA = ask(queuedState, itemA);
queuedState = answer(queuedA.state, itemA, queuedA.questionNumber, "no", 5000).state;
const queuedB = ask(queuedState, itemB);
queuedState = answer(queuedB.state, itemB, queuedB.questionNumber, "no", 6000).state;
check(
  "a second miss queues behind the first instead of replacing it",
  selectPrioritizedPetRecallItem(queuedState, candidates, new Set(), () => 0.1)?.id === itemA.id
);
const queueFocusQuestion = ask(queuedState, itemA);
queuedState = answer(
  queueFocusQuestion.state,
  itemA,
  queueFocusQuestion.questionNumber,
  "yes",
  7000
).state;
check(
  "remembering the first miss promotes the next missed phrase",
  selectPrioritizedPetRecallItem(queuedState, candidates, new Set(), () => 0.1)?.id === itemB.id
);

const storage = new Map();
const priorWindow = global.window;
global.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
  },
};
storage.set(`${CODEX_PET_RECALL_KEY}:learner-a`, JSON.stringify({
  entries: [queuedState.entries.find((entry) => entry.itemId === itemB.id)],
  questionCount: 7,
}));
storage.set(`${CODEX_PET_RECALL_KEY}:learner-b`, JSON.stringify({
  entries: [],
  questionCount: 2,
}));
const learnerA = loadPetRecallState({ id: "learner-a" });
const learnerB = loadPetRecallState({ id: "learner-b" });
check(
  "focused recall storage is isolated per learner profile",
  learnerA.entries[0]?.itemId === itemB.id && learnerB.entries.length === 0
);
if (priorWindow === undefined) delete global.window;
else global.window = priorWindow;

check(
  "the provider counts scheduled prompts but not answer-revealing confirmations",
  provider.includes("options.question && !options.question.confirm")
    && provider.includes("recallSequence: notePetRecallQuestion")
);
check(
  "No and confirmed Yes both update the persistent recall queue",
  provider.includes("notePetRecallAnswer(question, answer, getAuthUser())")
);
check(
  "the scheduler deliberately overrides the recent-question guard for prioritised recall",
  lab.includes("getPrioritizedPetRecallItem(quizItems, recentlyAsked, user)")
);
check(
  "desktop pet relays preserve the recall sequence used for answer scheduling",
  main.includes("recallSequence: Number.isSafeInteger(Number(question.recallSequence))")
);

if (failures) {
  console.error(`\n${failures} focused pet recall regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nfocused misses, mixed repeats, spaced follow-ups, and profile isolation are guarded");
