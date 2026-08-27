const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export {
        buildSession,
        isReinforcementEligible,
        pickPreviewReplacement,
        rankReinforcementCandidates,
        selectContinueLearningMix,
      } from "./src/session.ts";
      export {
        ADAPTIVE_REPEAT_COOLDOWN_MS,
        adaptiveRepeatPriority,
        inherentSentenceDifficulty,
        isAdaptiveReinforcementEligible,
        isAttemptedPracticeEligible,
        recordAnswerPerformance,
      } from "./src/lib/adaptivePractice.ts";
      export {
        recordDeclaredKnown,
        recordPermanent,
        recordReinforcement,
        recordStruggle,
        recordSuccess,
        setStrengthLevel,
      } from "./src/lib/memoryStrength.ts";
      export { gradeEntryForId, setCanonicalGradeRecord } from "./src/lib/activity.ts";
      export { finishLessonAndQueueNext } from "./src/lib/lessonFlow.ts";
      export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";
      export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";
      export { primeTranslations } from "./src/lib/translations.ts";
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
  buildSession,
  isReinforcementEligible,
  ADAPTIVE_REPEAT_COOLDOWN_MS,
  adaptiveRepeatPriority,
  gradeEntryForId,
  pickPreviewReplacement,
  recordDeclaredKnown,
  recordPermanent,
  recordReinforcement,
  recordStruggle,
  recordSuccess,
  rankReinforcementCandidates,
  selectContinueLearningMix,
  setCanonicalGradeRecord,
  finishLessonAndQueueNext,
  inherentSentenceDifficulty,
  isAdaptiveReinforcementEligible,
  isAttemptedPracticeEligible,
  recordAnswerPerformance,
  setStrengthLevel,
} = compiled.exports;
// The tables are fetched on demand in the app, so a German-only learner
// never downloads them. A check has no event loop to await one on and wants
// every language at once, so it hands them in directly.
const M = compiled.exports;
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

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

const permanentWithSchedule = {
  ...permanent,
  dueAt: new Date(now + 86_400_000).toISOString(),
  reinforcedAt: new Date(now).toISOString(),
};
const relearnedPermanent = recordSuccess(permanentWithSchedule, now + 1_000);
const declaredPermanent = recordDeclaredKnown(permanentWithSchedule, now + 1_000);
const struggledPermanent = recordStruggle(now + 1_000, permanentWithSchedule);
const manuallyGradedPermanent = setStrengthLevel(2, now + 1_000, permanentWithSchedule);
check(
  "every normal grade transition clears a stale Permanent flag",
  relearnedPermanent.permanent === false
    && declaredPermanent.permanent === false
    && struggledPermanent.permanent === false
    && manuallyGradedPermanent?.permanent === false
);
check(
  "marking a Permanent item as struggle clears its obsolete schedule",
  !struggledPermanent.dueAt && !struggledPermanent.reinforcedAt
);
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

const easySentence = { de: "Bis bald.", en: "See you soon.", level: "A1" };
const hardSentence = {
  de: "Obwohl die Entscheidung zunächst vernünftig wirkte, wurde sie anschließend wegen der möglichen Konsequenzen zurückgenommen.",
  en: "Although the decision initially seemed reasonable, it was subsequently withdrawn because of the possible consequences.",
  level: "B2",
};
check(
  "long advanced B2 sentences carry more inherent practice weight",
  inherentSentenceDifficulty(hardSentence) > inherentSentenceDifficulty(easySentence)
    && inherentSentenceDifficulty(hardSentence) >= 0.48
    && inherentSentenceDifficulty(easySentence) < 0.48
);

const mistakenPerformance = recordAnswerPerformance(
  undefined,
  { attempts: 10, mistakes: 3 },
  now
);
const learnedAfterMistakes = recordSuccess(mistakenPerformance, now + 1_000);
check(
  "actual wrong stage answers create durable per-item difficulty history",
  learnedAfterMistakes.answerAttempts === 10
    && learnedAfterMistakes.answerMistakes === 3
    && learnedAfterMistakes.difficultyDebt > 0
    && learnedAfterMistakes.lastMistakeAt === new Date(now).toISOString()
);
check(
  "repeated mistakes make an easy learned sentence eligible before its mastery due date",
  Date.parse(learnedAfterMistakes.dueAt) > now + 2_000
    && isAdaptiveReinforcementEligible(learnedAfterMistakes, easySentence, now + 2_000)
    && adaptiveRepeatPriority(learnedAfterMistakes, easySentence) > 0.48
);

const cleanHardPerformance = recordAnswerPerformance(
  undefined,
  { attempts: 10, mistakes: 0 },
  now
);
const learnedHardSentence = recordSuccess(cleanHardPerformance, now + 1_000);
check(
  "an inherently difficult practised sentence repeats even without a mistake",
  isAdaptiveReinforcementEligible(learnedHardSentence, hardSentence, now + 2_000)
);
check(
  "Know it alone still respects the mastery schedule",
  !isAdaptiveReinforcementEligible(recordDeclaredKnown(undefined, now), hardSentence, now + 2_000)
);

const recentlyRepeated = recordReinforcement(learnedAfterMistakes, now + 3_000);
check(
  "adaptive repetition has a cooldown so one item cannot starve the familiar half",
  !isAdaptiveReinforcementEligible(recentlyRepeated, easySentence, now + 4_000)
    && isAdaptiveReinforcementEligible(
      recentlyRepeated,
      easySentence,
      now + 3_000 + ADAPTIVE_REPEAT_COOLDOWN_MS + 1
    )
);
check(
  "a skipped sentence becomes familiar without receiving a mastery grade",
  !mistakenPerformance.lastGrade
    && isAttemptedPracticeEligible(mistakenPerformance)
);

const attemptedMix = buildSession(
  {
    partKey: "attempted-mix",
    label: "Attempted mix",
    level: "A1",
    vocab: [],
    dialogues: [],
    phrases: [
      { id: "attempted-item", de: "Das habe ich versucht.", en: "I tried that." },
      { id: "fresh-a", de: "Das ist ganz neu.", en: "That is completely new." },
      { id: "fresh-b", de: "Hier ist noch etwas Neues.", en: "Here is something else new." },
      { id: "fresh-c", de: "Wir lernen weiter.", en: "We keep learning." },
    ],
  },
  [],
  { "attempted-item": mistakenPerformance },
  0
);
const attemptedMixSentences = attemptedMix.filter((item) => item.type === "sentence");
const attemptedStep = attemptedMixSentences.find((item) => item.item?.id === "attempted-item");
check(
  "an attempted sentence occupies the familiar half and leaves all three fresh slots genuine",
  attemptedMixSentences.filter((item) => !item.review).length === 3
    && attemptedStep?.reviewReason === "attempted"
    && attemptedStep?.optionalPractice === true
    && attemptedStep?.reinforcement !== true
);

const attemptedDialogue = buildSession(
  {
    partKey: "attempted-dialogue",
    label: "Attempted dialogue",
    level: "A1",
    vocab: [],
    phrases: [],
    dialogues: [{
      title: "A short chat",
      lines: [
        { id: "dialogue-attempted", de: "Das habe ich schon versucht.", en: "I already tried that." },
        { id: "dialogue-new-a", de: "Versuch es noch einmal.", en: "Try it again." },
        { id: "dialogue-new-b", de: "Diesmal klappt es.", en: "It works this time." },
      ],
    }],
  },
  [],
  {
    "dialogue-A short chat-0-Das habe ich schon versucht.": mistakenPerformance,
  },
  0
);
const dialogueCapstone = attemptedDialogue.find((item) => item.type === "dialogue");
check(
  "attempted lines return as individual practice but never masquerade as a fresh dialogue line",
  attemptedDialogue.some((item) => item.type === "sentence" && item.item?.id === "dialogue-attempted" && item.reviewReason === "attempted")
    && dialogueCapstone?.dialogue?.lines?.length === 2
    && !dialogueCapstone.dialogue.lines.some((line) => line.id === "dialogue-attempted")
);

const struggledWithHistory = recordStruggle(now + 4_000, learnedAfterMistakes);
const declaredWithHistory = recordDeclaredKnown(struggledWithHistory, now + 5_000);
check(
  "difficulty history survives struggle and known grade transitions",
  declaredWithHistory.answerAttempts === learnedAfterMistakes.answerAttempts
    && declaredWithHistory.answerMistakes === learnedAfterMistakes.answerMistakes
    && declaredWithHistory.difficultyDebt === learnedAfterMistakes.difficultyDebt
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

const attemptedOptional = step("attempted-optional", "Das war schwierig.", "That was difficult.", {
  review: true,
  reviewReason: "attempted",
  optionalPractice: true,
});
const fullDueWithAttemptMix = selectContinueLearningMix(
  fresh,
  [],
  [
    step("formal-due-1", "Formell eins.", "Formal one.", { review: true, interval: 1 }),
    step("formal-due-2", "Formell zwei.", "Formal two.", { review: true, interval: 3 }),
    step("formal-due-3", "Formell drei.", "Formal three.", { review: true, interval: 10 }),
  ],
  3,
  3,
  [attemptedOptional],
  "en"
);
check(
  "three formal due reviews displace optional attempted practice",
  fullDueWithAttemptMix.reviews.length === 3
    && !fullDueWithAttemptMix.reviews.some((item) => item.item.id === "attempted-optional")
);

const sameGermanDue = selectContinueLearningMix(
  fresh,
  [],
  [
    step("same-de-1", "Das geht.", "That works.", { review: true, interval: 1 }),
    step("same-de-2", "Das geht.", "That's possible.", { review: true, interval: 3 }),
    step("unique-de-3", "Das klappt.", "That is okay.", { review: true, interval: 10 }),
    step("unique-de-4", "Das ist möglich.", "That can be done.", { review: true, interval: 30 }),
  ],
  3,
  3,
  [],
  "en"
);
check(
  "due selection stays unambiguous in either matching direction",
  sameGermanDue.reviews.length === 3
    && sameGermanDue.reviews.filter((item) => item.item.de === "Das geht.").length === 1
    && new Set(sameGermanDue.reviews.map((item) => item.item.de)).size === 3
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

const ageFirst = rankReinforcementCandidates([
  { id: "older-easier", successes: 2, lastPractised: now, index: 0, repeatPriority: 0.1 },
  { id: "newer-harder", successes: 1, lastPractised: now + 60_000, index: 1, repeatPriority: 1.5 },
]);
check(
  "familiar practice rotates by age before static difficulty priority",
  ageFirst[0].id === "older-easier"
);

const urgencyFirst = rankReinforcementCandidates([
  { id: "older-ordinary", successes: 1, lastPractised: now, index: 0, practiceUrgency: 0, repeatPriority: 0 },
  { id: "recent-attempt", successes: 0, lastPractised: now + 60_000, index: 1, practiceUrgency: 2, repeatPriority: 0.5 },
]);
check(
  "a just-failed attempt returns before ordinary familiar filler",
  urgencyFirst[0].id === "recent-attempt"
);

const cleanedPerformance = recordAnswerPerformance(
  learnedAfterMistakes,
  { attempts: 20, mistakes: 0 },
  now + 60 * 86_400_000
);
check(
  "old mistakes decay and clean practice lowers adaptive priority",
  adaptiveRepeatPriority(learnedAfterMistakes, easySentence, now + 1_000)
    > adaptiveRepeatPriority(learnedAfterMistakes, easySentence, now + 60 * 86_400_000)
    && adaptiveRepeatPriority(cleanedPerformance, easySentence, now + 60 * 86_400_000)
      < adaptiveRepeatPriority(learnedAfterMistakes, easySentence, now + 60 * 86_400_000)
);

const replacement = pickPreviewReplacement(
  [
    { id: "colliding-replacement", partKey: "part1", de: "Wie geht's?", en: "How are you?" },
    { id: "safe-replacement", partKey: "part1", de: "Was ist neu?", en: "What's new?" },
  ],
  [
    { de: "Wie läuft es?", en: "How are you?" },
    { de: "Bekannter Satz.", en: "Known target." },
  ],
  "part1"
);
check(
  "Know it preview replacement preserves six unique target cards",
  replacement?.id === "safe-replacement"
);

const labSource = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
const guidedSource = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
const petProviderSource = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetProvider.tsx"),
  "utf8"
);
const petQuestionSchedulerStart = labSource.indexOf(
  'const cadence = getCodexPetCadence("questions", petCoachingFrequencies.questions)'
);
const petQuestionSchedulerEnd = labSource.indexOf(
  "\n  useEffect(() => {",
  petQuestionSchedulerStart + 1
);
const petQuestionSchedulerSource = petQuestionSchedulerStart >= 0 && petQuestionSchedulerEnd > petQuestionSchedulerStart
  ? labSource.slice(petQuestionSchedulerStart, petQuestionSchedulerEnd)
  : "";
check(
  "the app marks optional practice separately from successful scheduled recall",
  labSource.includes("if (s.reinforcement) markReinforced(s.item.id, s.item.aliases);")
    && labSource.includes("setCanonicalGradeRecord(next, id, aliases, recordReinforcement(practised));")
);
check(
  "lesson completion does not bulk-grade skipped exercises",
  !/onComplete=\{\(\) => \{[\s\S]*?markCompleted\(sessionSteps\)/.test(labSource)
    // A skipped exercise is attempted, never completed. A conversation step
    // holds several reviews, so it expands into its turns first -- but the
    // skipped/completed split still has to survive that.
    && /if \(skipped\) parts\.forEach\([\s\S]{0,60}markAttempted/.test(labSource)
    && /else markCompleted\(parts, performance\);/.test(labSource)
    && labSource.includes('step?.type === "conversation"')
);
check(
  "wrong stage answers are batched and persisted once when the sentence is left",
  guidedSource.includes("const answerPerformanceRef = useRef(new Map<string, AnswerPerformance>())")
    && guidedSource.includes("onAdvance?.(current, skipped, performance)")
    && !guidedSource.includes("recordAnswerPerformance(")
    && labSource.includes("recordAnswerPerformance(prior, performance)")
);
check(
  "Know it does not discard wrong answers made earlier in the same route",
  /updatedAt >= sessionStart\) \{[\s\S]*?performance\?\.attempts[\s\S]*?recordAnswerPerformance\(prior, performance\)[\s\S]*?return;/.test(labSource)
);
check(
  "preview replacement blocks both named language columns after direction swaps",
  // The candidates are un-swapped German entries, so every direction has to be
  // read back to that pair — a French or Polish card through the originalDe it
  // kept. Both table-backed courses take that same route, so they share a branch.
  labSource.includes("const blockedPairs = current")
    && labSource.includes('if (swapDirection === "learn-en")')
    && labSource.includes('if (swapDirection === "learn-fr" || swapDirection === "learn-pl")')
    && labSource.includes("String(step.item?.originalDe ?? \"\")")
);

let queuedAfterStorageFailure = 0;
let completionErrors = 0;
finishLessonAndQueueNext(
  () => { throw new Error("simulated full local storage"); },
  () => { queuedAfterStorageFailure += 1; },
  () => { completionErrors += 1; }
);
check(
  "a lesson still queues its successor when completion persistence throws",
  queuedAfterStorageFailure === 1 && completionErrors === 1
);
check(
  "automatic continuation reuses the global mixed-session selector",
  labSource.includes("() => window.setTimeout(() => startSession(), 260)")
    && !labSource.includes("window.setTimeout(() => startSession(activePart)")
);
check(
  "lesson completion counts down against its existing auto-finish delay without extending it",
  guidedSource.includes("const AUTO_FINISH_DELAY_MS = 2600")
    && guidedSource.includes("const deadline = Date.now() + AUTO_FINISH_DELAY_MS")
    && guidedSource.includes("setTimeout(finish, AUTO_FINISH_DELAY_MS)")
    && guidedSource.includes("setInterval(updateCountdown, 100)")
    && guidedSource.includes("clearInterval(countdownTimer)")
    && guidedSource.includes('uiFmt("Starting your next lesson in {seconds}…", { seconds: secondsRemaining })')
);
check(
  "lesson completion goes straight to its success screen without an in-lesson memory check",
  !guidedSource.includes("LessonMemoryCheck")
    && !guidedSource.includes("onMemoryGrade")
    && !labSource.includes("markMemoryGrade")
    && !labSource.includes("onMemoryGrade")
    && guidedSource.includes('<CompleteScreen onNext={onComplete} />')
);
check(
  "the proactive desktop pet remains responsible for later memory questions",
  labSource.includes('getCodexPetCadence("questions", petCoachingFrequencies.questions)')
    // The question names the course it is asking about, in whichever interface
    // language the learner reads — four courses now, so the name is picked once
    // and dropped into both sentences rather than spelled out inside each.
    && labSource.includes('const askedLanguageDe = learnsFrench ? "Französisch" : learnsPolish ? "Polnisch" : "Englisch";')
    && labSource.includes('const askedLanguageEn = learnsFrench ? "French" : learnsPolish ? "Polish" : "German";')
    && labSource.includes('Do you remember how to say “${meaning}” in ${askedLanguageEn}?')
    && labSource.includes('Erinnerst du dich, wie man „${meaning}“ auf ${askedLanguageDe} sagt?')
    && petProviderSource.includes("setItemStatus(")
    && petProviderSource.includes('answer === "yes" ? "known" : "struggle"')
);
check(
  "proactive recall questions continue while a guided lesson is open",
  Boolean(petQuestionSchedulerSource)
    && !petQuestionSchedulerSource.includes("showGuidedSession")
    && petQuestionSchedulerSource.includes("showPlacementTest")
    && petQuestionSchedulerSource.includes("petSpeechRef.current")
);
check(
  "lesson-time questions keep cadence, speech backoff, and per-item deduplication",
  petQuestionSchedulerSource.includes("scheduleQuestion(cadence.initialDelayMs)")
    && petQuestionSchedulerSource.includes("scheduleQuestion(cadence.intervalMs)")
    && petQuestionSchedulerSource.includes("scheduleQuestion(15000)")
    && petQuestionSchedulerSource.includes("Date.now() - message.createdAt < 30 * 60 * 1000")
    && petQuestionSchedulerSource.includes("!recentlyAsked.has(candidate.id)")
    && petQuestionSchedulerSource.includes("if (!item) {")
);

if (failures) {
  console.error(`\n${failures} Continue Learning regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nContinue Learning's rotating 3 familiar + 3 unseen mix is guarded");
