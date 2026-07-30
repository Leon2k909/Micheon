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
      export { buildTatoebaParts } from "./src/lib/contentBank.ts";
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
  buildTatoebaParts,
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

const tatoebaParts = buildTatoebaParts(5_000);
const tatoebaPhrases = Object.values(tatoebaParts).flatMap(phrasesFromPart);
const defaultTatoebaParts = buildTatoebaParts();
const authoredPhrases = [
  ...Object.values(allPartBlueprints).flatMap(phrasesFromPart),
  ...curatedTopics.flatMap((topic) => topic?.phrases ?? []),
  ...tatoebaPhrases,
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

const reportedDislikePhrase = allPartBlueprints.part69?.phrases?.[1];

check("the reported conversational dislike still exists", Boolean(reportedDislikePhrase));
check(
  "the reported conversational dislike keeps its stable Part 69 source position",
  reportedDislikePhrase?.de === "Ich mag sie einfach nicht besonders."
    && String(reportedDislikePhrase?.en ?? "").includes("I'm not that keen on her")
);
if (reportedDislikePhrase) {
  const conversation = phraseForLearningMode(reportedDislikePhrase, "conversation");
  const exam = phraseForLearningMode(reportedDislikePhrase, "exam");
  const spoken = "Ich mag sie nicht besonders.";
  const emphatic = "Ich mag sie einfach nicht besonders.";

  check(
    "Conversation mode teaches the unmarked everyday dislike",
    conversation.de === spoken,
    `found ${JSON.stringify(conversation.de)}`
  );
  check(
    "the everyday dislike keeps an honest conversational English meaning",
    conversation.en === "I'm not that keen on her. / I don't particularly like her.",
    `found ${JSON.stringify(conversation.en)}`
  );
  check(
    "Conversation mode keeps the more emphatic variant visible",
    conversation.long === emphatic,
    `found ${JSON.stringify(conversation.long)}`
  );
  check(
    "Conversation grading accepts both the everyday and emphatic variants",
    acceptsSelectedPhrase(conversation, spoken)
      && acceptsSelectedPhrase(conversation, emphatic)
  );
  check(
    "Exam mode preserves the authored emphatic sentence",
    exam.de === emphatic && exam.short === spoken,
    `found target ${JSON.stringify(exam.de)} and short ${JSON.stringify(exam.short)}`
  );
}

const auditedConversationalPrimaries = [
  {
    standard: "Wann öffnet der Supermarkt?",
    spoken: "Wann macht der Supermarkt auf?",
    spokenEn: "When does the supermarket open? / What time does the supermarket open?",
  },
  {
    standard: "Meinetwegen.",
    spoken: "Von mir aus.",
    spokenEn: "Fine by me. / All right then.",
  },
  {
    standard: "Das ergibt Sinn.",
    spoken: "Das macht Sinn.",
    spokenEn: "That makes sense.",
  },
  {
    standard: "Das sieht an dir richtig gut aus.",
    spoken: "Das steht dir richtig gut.",
    spokenEn: "That really suits you. / That looks really good on you.",
  },
  {
    standard: "Wo sind die Umkleidekabinen?",
    spoken: "Wo sind die Umkleiden?",
    spokenEn: "Where are the changing rooms? / Where are the fitting rooms?",
  },
  {
    standard: "Ich krieg das Regal einfach nicht zusammengebaut.",
    spoken: "Ich krieg das Regal einfach nicht zusammen.",
    spokenEn: "I just can't get this shelf together. / I can't get this shelf put together.",
  },
  {
    standard: "Der Laden ist auch am Sonntag geöffnet.",
    spoken: "Der Laden ist auch sonntags offen.",
    spokenEn: "The shop is open on Sundays too.",
  },
];

for (const expected of auditedConversationalPrimaries) {
  const phrase = authoredPhrases.find((candidate) => candidate?.de === expected.standard);
  check(`audited conversational phrase still exists: ${expected.standard}`, Boolean(phrase));
  if (!phrase) continue;

  const conversation = phraseForLearningMode(phrase, "conversation");
  const exam = phraseForLearningMode(phrase, "exam");
  check(
    `Conversation mode teaches the everyday form: ${expected.spoken}`,
    conversation.de === expected.spoken && conversation.en === expected.spokenEn,
    `found ${JSON.stringify(conversation.de)} / ${JSON.stringify(conversation.en)}`
  );
  check(
    `Conversation mode retains and accepts the careful form: ${expected.standard}`,
    conversation.long === expected.standard
      && acceptsSelectedPhrase(conversation, expected.spoken)
      && acceptsSelectedPhrase(conversation, expected.standard),
    `found long ${JSON.stringify(conversation.long)}`
  );
  check(
    `Exam mode retains the careful target: ${expected.standard}`,
    exam.de === expected.standard && exam.short === expected.spoken,
    `found target ${JSON.stringify(exam.de)} and short ${JSON.stringify(exam.short)}`
  );
}

const reportedTatoebaPhrase = tatoebaPhrases.find((phrase) =>
  phrase?.en === "That's not what I said."
);

check("the reported real-world sentence still exists", Boolean(reportedTatoebaPhrase));
check(
  "the corrected real-world sentence keeps its stable source position",
  defaultTatoebaParts["tatoeba-b1-1"]?.phrases?.[6]?.en === "That's not what I said."
);
if (reportedTatoebaPhrase) {
  const conversation = phraseForLearningMode(reportedTatoebaPhrase, "conversation");
  const exam = phraseForLearningMode(reportedTatoebaPhrase, "exam");
  const spoken = "Das hab ich nicht gesagt.";
  const standard = "Das ist nicht das, was ich gesagt habe.";

  check(
    "Conversation mode teaches the natural spoken correction",
    conversation.de === spoken,
    `found ${JSON.stringify(conversation.de)}`
  );
  check(
    "the natural spoken correction keeps an honest English meaning",
    conversation.en === "That's not what I said. / I didn't say that.",
    `found ${JSON.stringify(conversation.en)}`
  );
  check(
    "the corrected real-world sentence keeps its complete form visible",
    conversation.long === standard,
    `found ${JSON.stringify(conversation.long)}`
  );
  check(
    "Exam mode teaches the complete das-was construction",
    exam.de === standard,
    `found ${JSON.stringify(exam.de)}`
  );
  check(
    "Exam mode shows but does not explicitly grade against the casual alternative",
    exam.short === spoken && !acceptsSelectedPhrase(exam, spoken)
  );
  check(
    "Conversation grading accepts both versions of the corrected sentence",
    acceptsSelectedPhrase(conversation, spoken)
      && acceptsSelectedPhrase(conversation, standard)
  );
}

check(
  "the reported translated-sounding German is absent from built lessons",
  !tatoebaPhrases.some((phrase) => phrase?.de === "Das ist nicht, was ich sagte.")
);
check(
  "the second missing-das corpus sentence is corrected",
  tatoebaPhrases.some((phrase) =>
    phrase?.de === "Das stimmt nicht. Das ist nicht das, was ich gesagt habe."
  )
  && !tatoebaPhrases.some((phrase) =>
    phrase?.de === "Das stimmt nicht. Das ist nicht, was ich gesagt habe."
  )
);

const translatedCalques = [
  "Es ist, was es ist.",
  "Das ist, was ich mag.",
  "Das ist, was ich denke.",
  "Das ist, was ich dachte.",
  "Das ist, was sie sagte.",
  "Das ist, was wir machen.",
  "Das ist, was ich mache.",
  "Das ist, was ich sage.",
  "Das ist, was ich tue.",
  "Das ist, was ich gesagt habe.",
  "Es ist nicht, was ich dachte.",
  "Das ist, was ich ihr gesagt habe.",
  "Das ist, was ich gesehen habe.",
  "Das ist, was ich gut kann.",
  "Das ist, was ich gehört habe.",
  "Das ist, was ich tun möchte.",
  "Das ist, was ich tun muss.",
  "Das ist, was ich wirklich will.",
  "Das ist, was er gesagt hat.",
  "Du weißt, das ist, was ich will.",
  "Das ist, was du mir gesagt hast.",
  "Ich glaube, das ist, was passiert ist.",
  "Das ist, was ich ihnen sagte.",
  "Ich denke, das ist, was passiert ist.",
  "Das ist, was wir gesehen haben.",
  "Ich glaube, das ist, was Sie suchen.",
  "Es ist nicht an dir, das zu entscheiden.",
  "Das ist, was ich verstehen möchte.",
  "Das ist, was sich so tut.",
  "Das ist, was ich immer sage.",
  "Das ist, was ich gerne wissen würde.",
  "Das ist, was ich gerne mache.",
  "Glaubst du, dass es das ist, was ich möchte.",
  "Das ist, was ich dachte, dass du gesagt hast.",
  "Das ist, was ich dich gebeten habe zu tun.",
  "Es ist nicht an dem, dass ich dies nicht tun will.",
  "Ich weiß, dass es nicht das ist, was du wolltest.",
  "Bist du sicher, dass es das ist, was du willst?",
  "Denkst du, dass es das ist, was ich hören will?",
  "Ich weiß nicht, wenn ich fragen kann.",
  "Das ist nicht, was ich denke.",
  "Das ist nicht, was ich gesehen habe.",
  "Das ist nicht, was ich dachte.",
  "Das ist nicht, was ich gehört habe.",
  "Das ist nicht, was ich tun werde.",
  "Das ist nicht, was er gesagt hat.",
  "Das ist nicht, was ich sehen will.",
  "Das ist nicht, was ich meinte.",
  "Das ist nicht, was ich suche.",
  "Das ist nicht, was wir tun müssen.",
  "Das ist nicht, was ich hören wollte.",
  "Das ist nicht, was ich bestellt habe.",
  "Das ist nicht, was ich suchte.",
  "Ist das nicht, was ich gesagt habe?",
  "Ist das nicht, was du willst?",
  "Ist das nicht, was sie wollen?",
  "Das ist nicht, warum ich hier bin.",
  "Es ist nicht, wie du denkst.",
  "Das ist nicht, wie wir denken.",
  "Das ist, wie ich es erfahren habe.",
  "Das ist, wo ich sein möchte.",
  "Das ist genau, was ich meine.",
];
const builtGerman = new Set(tatoebaPhrases.map((phrase) => phrase?.de));
check(
  "reviewed English-like corpus constructions are absent from built lessons",
  translatedCalques.every((phrase) => !builtGerman.has(phrase)),
  translatedCalques.filter((phrase) => builtGerman.has(phrase)).slice(0, 5).join("; ")
);

const remainingNaturalnessIssues = tatoebaPhrases.filter((phrase) =>
  /(?:^|,\s)(?:Das|das|Es|es) ist(?: nicht| genau)?, (?:was|wie|warum|wo)\b/.test(phrase?.de ?? "")
  || /^Es ist nicht an (?:mir|dir), das zu entscheiden\.$/.test(phrase?.de ?? "")
  || /^Es ist nicht an dem, dass/.test(phrase?.de ?? "")
  || /^Ich weiß nicht, wenn ich fragen kann\.$/.test(phrase?.de ?? "")
);
check(
  "the shipped corpus contains no remaining reviewed English-shaped constructions",
  remainingNaturalnessIssues.length === 0,
  remainingNaturalnessIssues.slice(0, 5).map((phrase) => phrase.de).join("; ")
);

const naturalCorpusFixtures = [
  { standard: "Es ist so, wie es ist.", spoken: "Es ist, wie es ist." },
  { standard: "Das ist das, was ich denke.", spoken: "Das denke ich." },
  { standard: "Das ist das, was sie gesagt hat.", spoken: "Das hat sie gesagt." },
  { standard: "Das ist genau das, was ich wirklich will.", spoken: "Genau das will ich." },
  { standard: "Das ist genau das, was ich gern wissen würde.", spoken: "Genau das würde ich gern wissen." },
];
for (const fixture of naturalCorpusFixtures) {
  const phrase = tatoebaPhrases.find((item) => item?.de === fixture.standard);
  const conversation = phrase && phraseForLearningMode(phrase, "conversation");
  check(
    `Conversation mode leads with reviewed corpus wording: ${fixture.spoken}`,
    conversation?.de === fixture.spoken && conversation?.long === fixture.standard,
    `found ${JSON.stringify(conversation)}`
  );
}

const decisionPhrase = tatoebaPhrases.find((phrase) =>
  phrase?.de === "Das ist nicht meine Entscheidung."
);
check(
  "the reported decision sentence teaches natural conversational German",
  decisionPhrase?.en === "It isn't my decision.",
  `found ${JSON.stringify(decisionPhrase)}`
);
check(
  "the translated-sounding decision sentence is absent from built lessons",
  !builtGerman.has("Es ist nicht an mir, das zu entscheiden.")
);

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
const guidedStyles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const testsSource = fs.readFileSync(path.join(root, "src/components/tests/TestsView.tsx"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const packageLockSource = fs.readFileSync(path.join(root, "package-lock.json"), "utf8");
const dialogueStart = guidedSource.indexOf("function DialogueExercise(");
const dialogueEnd = guidedSource.indexOf("// ── Main ──", dialogueStart);
const dialogueSource = guidedSource.slice(dialogueStart, dialogueEnd > dialogueStart ? dialogueEnd : undefined);

function phaseNames(constantName) {
  const body = guidedSource.match(new RegExp(`const ${constantName}[^=]*= \\[(.*?)\\]`, "s"))?.[1] ?? "";
  return [...body.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

const fullLessonPhases = phaseNames("PHASES");
const bilingualLessonPhases = phaseNames("BILINGUAL_PHASES");

check(
  "guided lesson routes omit the temporarily disabled speaking stage",
  !fullLessonPhases.includes("Speak")
    && !bilingualLessonPhases.includes("Speak")
    && fullLessonPhases.includes("WriteFromMemory")
    && !guidedSource.includes('phase === "Speak"')
);
check(
  "desktop lessons cannot trigger a speech-model download",
  guidedSource.includes("if (isElectronApp() || !isSpeechRecognitionSupported()) return null;")
    && !guidedSource.includes("whisperRecognition")
);
check(
  "the offline recognition runtime and model selectors are absent from the app",
  !packageJson.dependencies?.["@huggingface/transformers"]
    && !packageJson.devDependencies?.["@huggingface/transformers"]
    && !packageLockSource.includes('node_modules/@huggingface/transformers')
    && !fs.existsSync(path.join(root, "src/lib/whisperRecognition.ts"))
    && !fs.existsSync(path.join(root, "src/lib/voiceModel.ts"))
);

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

const shortcutHintRule = guidedStyles.match(/\.fs-hint kbd\s*\{([^}]*)\}/)?.[1] ?? "";
check(
  "multi-key lesson hints grow around their text instead of touching the border",
  /width:\s*auto/.test(shortcutHintRule)
    && /min-width:\s*22px/.test(shortcutHintRule)
    && /padding:\s*0 6px/.test(shortcutHintRule)
    && /white-space:\s*nowrap/.test(shortcutHintRule)
);

const missingWordPhaseRule = guidedStyles.match(/\.fs-missing-phase\s*\{([^}]*)\}/)?.[1] ?? "";
const missingWordResultRule = guidedStyles.match(/\.fs-missing-result\s*\{([^}]*)\}/)?.[1] ?? "";
check(
  "missing-word options and feedback use one explicit non-overlapping layout flow",
  guidedSource.includes('className="fs-missing-phase"')
    && /display:\s*grid/.test(missingWordPhaseRule)
    && /grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(missingWordPhaseRule)
    && /gap:\s*16px/.test(missingWordPhaseRule)
    && /position:\s*relative/.test(missingWordResultRule)
    && /width:\s*100%/.test(missingWordResultRule)
);

if (failures) {
  console.error(`\n${failures} learning-mode regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\nConversation/Exam selection, production grading, stable IDs and pack collisions are guarded for ${completeVariants.length} spoken variants`
);
