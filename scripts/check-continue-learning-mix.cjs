const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export {
        isReinforcementEligible,
        pickPreviewReplacement,
        rankReinforcementCandidates,
        selectContinueLearningMix,
      } from "./src/session.ts";
      export {
        recordDeclaredKnown,
        recordPermanent,
        recordReinforcement,
        recordSuccess,
      } from "./src/lib/memoryStrength.ts";
      export { gradeEntryForId, setCanonicalGradeRecord } from "./src/lib/activity.ts";
    `,
    resolveDir: root,
    sourcefile: "continue-learning-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("continue-learning-check", module);
compiled.filename = path.join(root, ".continue-learning-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  isReinforcementEligible,
  gradeEntryForId,
  pickPreviewReplacement,
  recordDeclaredKnown,
  recordPermanent,
  recordReinforcement,
  recordSuccess,
  rankReinforcementCandidates,
  selectContinueLearningMix,
  setCanonicalGradeRecord,
} = compiled.exports;

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const step = (id, de, en, extra = {}) => ({
  type: "sentence",
  ...extra,
  item: { id, de, en },
});

const now = Date.UTC(2026, 6, 28, 12);
const firstRecall = recordSuccess(undefined, now);
const secondRecall = recordSuccess(firstRecall, now + 1_000);
const declaredKnown = recordDeclaredKnown(undefined, now);
const permanent = recordPermanent(now);
const alreadyDue = { ...firstRecall, dueAt: new Date(now - 1).toISOString() };

check("a newly learned phrase can reinforce before tomorrow", isReinforcementEligible(firstRecall, now + 2_000));
check("a second-rung phrase can still reinforce", isReinforcementEligible(secondRecall, now + 2_000));
check("Know it remains hidden until its scheduled review", !isReinforcementEligible(declaredKnown, now + 2_000));
check("permanent items never become reinforcement", !isReinforcementEligible(permanent, now + 2_000));
check("due items stay in the scheduled review pool", !isReinforcementEligible(alreadyDue, now));
check(
  "legacy known records can fill the familiar half",
  isReinforcementEligible({ lastGrade: "know", updatedAt: new Date(now).toISOString() }, now + 2_000)
);

const reinforced = recordReinforcement(firstRecall, now + 5_000);
check("reinforcement records a separate rotation timestamp", reinforced.reinforcedAt === new Date(now + 5_000).toISOString());
check(
  "reinforcement does not move the spaced-review ladder",
  reinforced.successes === firstRecall.successes
    && reinforced.intervalDays === firstRecall.intervalDays
    && reinforced.dueAt === firstRecall.dueAt
    && reinforced.updatedAt === firstRecall.updatedAt
);

const aliasStore = { "legacy-item-id": secondRecall };
const aliasEntry = gradeEntryForId(aliasStore, "canonical-item-id", ["legacy-item-id"]);
setCanonicalGradeRecord(
  aliasStore,
  "canonical-item-id",
  ["legacy-item-id"],
  recordSuccess(aliasEntry.record, now + 6_000)
);
check(
  "legacy aliases migrate without resetting their review rung",
  !aliasStore["legacy-item-id"]
    && aliasStore["canonical-item-id"].successes === secondRecall.successes + 1
);

const fresh = [
  step("f-collision", "Wie geht's?", "How are you?"),
  step("f-1", "Das ist neu eins.", "Fresh one."),
  step("f-2", "Das ist neu zwei.", "Fresh two."),
  step("f-3", "Das ist neu drei.", "Fresh three."),
];
const struggles = [step("s-1", "Ich brauche Übung.", "I need practice.", { review: true })];
const due = [step("d-1", "Wie geht es dir?", "How are you?", { review: true, interval: 1 })];
const practice = [
  step("r-1", "Das kenne ich eins.", "Known one.", { review: true, reinforcement: true }),
  step("r-2", "Das kenne ich zwei.", "Known two.", { review: true, reinforcement: true }),
];

const englishMix = selectContinueLearningMix(fresh, struggles, due, 3, 3, practice, "en");
check("Continue Learning returns three unseen phrases", englishMix.fresh.length === 3);
check("Continue Learning returns three familiar/review phrases", englishMix.reviews.length === 3);
check(
  "review priority is struggle, then due, then reinforcement",
  englishMix.reviews.map((item) => item.item.id).join(",") === "s-1,d-1,r-1"
);
check(
  "learn-English sessions dedupe the English target and backfill another unseen phrase",
  !englishMix.fresh.some((item) => item.item.id === "f-collision")
    && englishMix.fresh.some((item) => item.item.id === "f-3")
);
check(
  "all six learn-English targets are unique",
  new Set([...englishMix.fresh, ...englishMix.reviews].map((item) => item.item.en.toLowerCase())).size === 6
);

const fullDueMix = selectContinueLearningMix(
  fresh,
  [],
  [
    step("d-2", "Fällig zwei.", "Due two.", { review: true, interval: 1 }),
    step("d-3", "Fällig drei.", "Due three.", { review: true, interval: 3 }),
    step("d-4", "Fällig vier.", "Due four.", { review: true, interval: 10 }),
  ],
  3,
  3,
  practice,
  "en"
);
check("scheduled reviews fill their slots before optional reinforcement", fullDueMix.reviews.every((item) => !item.reinforcement));

const sameGermanDue = selectContinueLearningMix(
  fresh,
  [],
  [
    step("same-de-1", "Das geht.", "That works.", { review: true, interval: 1 }),
    step("same-de-2", "Das geht.", "That's possible.", { review: true, interval: 3 }),
    step("same-de-3", "Das geht.", "That is okay.", { review: true, interval: 10 }),
    step("same-de-4", "Das geht.", "That can be done.", { review: true, interval: 30 }),
  ],
  3,
  3,
  [],
  "en"
);
check(
  "due selection uses the English target all the way through",
  sameGermanDue.reviews.length === 3
    && new Set(sameGermanDue.reviews.map((item) => item.item.en)).size === 3
);

const rotationPool = [0, 1, 2, 3].map((index) => ({
  id: `rotation-${index}`,
  successes: 1,
  lastPractised: now + index,
  index,
}));
const firstRotation = rankReinforcementCandidates(rotationPool).slice(0, 3);
const reinforcedIds = new Set(firstRotation.map((item) => item.id));
const nextRotationPool = rotationPool.map((item) => ({
  ...item,
  lastPractised: reinforcedIds.has(item.id) ? now + 10_000 + item.index : item.lastPractised,
}));
const secondRotation = rankReinforcementCandidates(nextRotationPool).slice(0, 3);
check(
  "the familiar half rotates after its reinforcement timestamp changes",
  firstRotation.map((item) => item.id).join(",") === "rotation-0,rotation-1,rotation-2"
    && secondRotation[0].id === "rotation-3"
);

const replacement = pickPreviewReplacement(
  [
    { id: "colliding-replacement", partKey: "part1", de: "Wie geht's?", en: "How are you?" },
    { id: "safe-replacement", partKey: "part1", de: "Was ist neu?", en: "What's new?" },
  ],
  ["How are you?", "Known target."],
  "en",
  "part1"
);
check(
  "Know it preview replacement preserves six unique target cards",
  replacement?.id === "safe-replacement"
);

const labSource = fs.readFileSync(path.join(root, "src/german_learning_lab.tsx"), "utf8");
check(
  "the app marks optional practice separately from successful scheduled recall",
  labSource.includes("if (s.reinforcement) markReinforced(s.item.id, s.item.aliases);")
    && labSource.includes("setCanonicalGradeRecord(next, id, aliases, recordReinforcement(prior));")
);
check(
  "lesson completion does not bulk-grade skipped exercises",
  !/onComplete=\{\(\) => \{[\s\S]*?markCompleted\(sessionSteps\)/.test(labSource)
    && labSource.includes("onAdvance={(step: any, skipped?: boolean) => { if (!skipped) markCompleted([step]); }}")
);
check(
  "the target-language dedupe follows the learner direction",
  labSource.includes('learningEnglish() ? "en" : "de"')
);

if (failures) {
  console.error(`\n${failures} Continue Learning regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nContinue Learning's rotating 3 familiar + 3 unseen mix is guarded");
