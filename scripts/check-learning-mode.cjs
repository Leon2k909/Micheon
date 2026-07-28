const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { curatedTopics } from "./src/lib/phrasebank.ts";
      export {
        matchLearningModeGermanAnswer,
        phraseForLearningMode,
      } from "./src/lib/learningMode.ts";
    `,
    resolveDir: root,
    sourcefile: "learning-mode-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("learning-mode-check", module);
compiled.filename = path.join(root, ".learning-mode-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  curatedTopics,
  matchLearningModeGermanAnswer,
  phraseForLearningMode,
} = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

function phrasesFromPart(part) {
  return [
    ...(part?.phrases ?? []),
    ...(part?.dialogues ?? []).flatMap((dialogue) => dialogue?.lines ?? []),
  ];
}

const authoredPhrases = [
  ...Object.values(allPartBlueprints).flatMap(phrasesFromPart),
  ...curatedTopics.flatMap((topic) => topic?.phrases ?? []),
];

function acceptsSelectedPhrase(selected, answer) {
  return matchLearningModeGermanAnswer(answer, selected).ok;
}

const reportedPhrase = authoredPhrases.find((phrase) =>
  String(phrase?.en ?? "").includes("I see what you mean, but")
);

check("the reported disagreement softener still exists", Boolean(reportedPhrase));
check(
  "the disagreement softener declares an English meaning for its spoken form",
  Boolean(reportedPhrase?.shortEn?.trim())
);

if (reportedPhrase) {
  const conversation = phraseForLearningMode(reportedPhrase, "conversation");
  const exam = phraseForLearningMode(reportedPhrase, "exam");
  const spoken = "Versteh ich, aber ...";
  const standard = "Ich verstehe, was du meinst, aber ...";

  check(
    "Conversation mode teaches the form friends actually say",
    conversation.de === spoken,
    `found ${JSON.stringify(conversation.de)}`
  );
  check(
    "Conversation mode keeps the full standard form visible",
    conversation.long === standard,
    `found ${JSON.stringify(conversation.long)}`
  );
  check(
    "Exam mode teaches the complete standard form",
    exam.de === standard,
    `found ${JSON.stringify(exam.de)}`
  );
  check(
    "Exam mode keeps the everyday spoken form available",
    exam.short === spoken,
    `found ${JSON.stringify(exam.short)}`
  );

  check(
    "Conversation grading accepts the taught spoken answer",
    acceptsSelectedPhrase(conversation, spoken)
  );
  check(
    "Conversation grading accepts its paired full standard answer",
    acceptsSelectedPhrase(conversation, standard)
  );
  check(
    "Exam grading accepts the taught full standard answer",
    acceptsSelectedPhrase(exam, standard)
  );
  check(
    "Exam grading does not accept the displayed casual form",
    !acceptsSelectedPhrase(exam, spoken)
  );
}

const completeVariants = authoredPhrases.filter((phrase) =>
  phrase?.de?.trim()
  && phrase?.en?.trim()
  && phrase?.short?.trim()
  && phrase?.shortEn?.trim()
);

check(
  "the live catalog contains complete spoken-form variants",
  completeVariants.length > 0
);

const variantIssues = [];
for (const phrase of completeVariants) {
  const spoken = phrase.short.trim();
  const standard = (phrase.long?.trim() || phrase.de.trim());
  const conversation = phraseForLearningMode(phrase, "conversation");
  const exam = phraseForLearningMode(phrase, "exam");
  const label = `${spoken} / ${standard}`;

  if (conversation.de !== spoken) variantIssues.push(`${label}: Conversation target`);
  if (conversation.en !== phrase.shortEn.trim()) variantIssues.push(`${label}: Conversation English`);
  if (!acceptsSelectedPhrase(conversation, standard)) variantIssues.push(`${label}: standard rejected in Conversation`);
  if (exam.de !== standard) variantIssues.push(`${label}: Exam target`);
}

check(
  "every complete variant selects and grades the right form for each mode",
  variantIssues.length === 0,
  variantIssues.slice(0, 5).join("; ")
);

const unpairedShort = {
  de: "Ich habe heute keine Zeit.",
  en: "I don't have time today.",
  short: "Heute keine Zeit.",
};
const unpairedExam = phraseForLearningMode(unpairedShort, "exam");
check(
  "Exam mode never accepts an unpaired casual short form",
  acceptsSelectedPhrase(unpairedExam, unpairedShort.de)
    && !acceptsSelectedPhrase(unpairedExam, unpairedShort.short)
);

const packs = [
  ...Object.entries(allPartBlueprints),
  ...curatedTopics.map((topic) => [topic.id, topic]),
];

function rowsFromPack(packKey, pack) {
  const rows = (pack?.phrases ?? []).map((phrase, index) => ({
    phrase,
    sourceId: phrase.id ?? `${packKey}-phrase-${index}`,
    sourcePath: `phrase ${index}`,
  }));
  for (const [dialogueIndex, dialogue] of (pack?.dialogues ?? []).entries()) {
    for (const [lineIndex, phrase] of (dialogue?.lines ?? []).entries()) {
      rows.push({
        phrase,
        sourceId: phrase.id ?? `${packKey}-dlg-${dialogueIndex}-${lineIndex}`,
        sourcePath: `dialogue ${dialogueIndex}, line ${lineIndex}`,
      });
    }
  }
  return rows;
}

function normalizedTarget(value) {
  return String(value ?? "").trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
}

const identityIssues = [];
const collisionIssues = [];
for (const [packKey, pack] of packs) {
  const rows = rowsFromPack(packKey, pack);
  const sourceIds = rows.map((row) => row.sourceId);
  const sourceSnapshot = rows.map(({ phrase }) => JSON.stringify(phrase));

  for (const mode of ["conversation", "exam"]) {
    const transformed = rows.map(({ phrase }) => phraseForLearningMode(phrase, mode));
    const transformedIds = transformed.map((phrase, index) => phrase.id ?? rows[index].sourceId);
    if (JSON.stringify(transformedIds) !== JSON.stringify(sourceIds)) {
      identityIssues.push(`${packKey}: ${mode} changed source IDs/order`);
    }
    if (rows.some(({ phrase }, index) => JSON.stringify(phrase) !== sourceSnapshot[index])) {
      identityIssues.push(`${packKey}: ${mode} mutated authored rows`);
    }

    const targets = new Map();
    transformed.forEach((phrase, index) => {
      const target = normalizedTarget(phrase.de);
      if (!target) return;
      const source = rows[index].phrase;
      // Repeated authored rows (most often a phrase repeated inside its pack's
      // dialogue) are intentional. A short/full pair converging on one target
      // is also harmless when both rows teach the same English meaning. Flag
      // only distinct source targets whose meanings would become ambiguous.
      const sourceGerman = normalizedTarget(source.de);
      const sourceEnglish = normalizedTarget(source.en);
      const previous = targets.get(target);
      if (
        previous
        && previous.sourceGerman !== sourceGerman
        && previous.sourceEnglish !== sourceEnglish
      ) {
        collisionIssues.push(
          `${packKey} (${mode}): ${previous.sourcePath} and ${rows[index].sourcePath} both become ${JSON.stringify(phrase.de)}`
        );
      } else if (!previous) {
        targets.set(target, { sourceGerman, sourceEnglish, sourcePath: rows[index].sourcePath });
      }
    });
  }
}

check(
  "learning-mode transformation preserves every pack's stable source IDs and order",
  identityIssues.length === 0,
  identityIssues.slice(0, 5).join("; ")
);
check(
  "learning-mode transformation creates no ambiguous German targets inside a pack",
  collisionIssues.length === 0,
  collisionIssues.slice(0, 5).join("; ")
);

const guidedSource = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
const testsSource = fs.readFileSync(path.join(root, "src/components/tests/TestsView.tsx"), "utf8");
const dialogueStart = guidedSource.indexOf("function DialogueExercise(");
const dialogueEnd = guidedSource.indexOf("// ── Main ──", dialogueStart);
const dialogueSource = guidedSource.slice(dialogueStart, dialogueEnd > dialogueStart ? dialogueEnd : undefined);

check(
  "DialogueExercise uses the production learning-mode matcher",
  dialogueSource.includes("matchLearningModeGermanAnswer(input")
    && dialogueSource.includes("long: line?.long")
);
check(
  "Tests carry the paired full form into grading",
  testsSource.includes("long: item.long")
    && testsSource.includes("matchLearningModeGermanAnswer(input, { de: alternative, long: item.long })")
);
check(
  "production grading never adds the Exam-only short hint as an answer",
  !String(matchLearningModeGermanAnswer).includes("phrase.short")
);

if (failures) {
  console.error(`\n${failures} learning-mode regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\nConversation/Exam selection, production grading, stable IDs and pack collisions are guarded for ${completeVariants.length} spoken variants`
);
