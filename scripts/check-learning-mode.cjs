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
      export { toTextedGerman } from "./src/lib/spokenGerman.ts";
      export {
        AUDIO_REQUIRED_SENTENCE_PHASES,
        BILINGUAL_SENTENCE_PHASES,
        MASTERED_SENTENCE_PHASES,
        SENTENCE_PHASES,
        buildSentencePhaseRoute,
        replacementSentencePhaseWhenMuted,
      } from "./src/lib/guidedLessonPhases.ts";
      export { wordOrderTokensMatchSentence } from "./src/lib/wordOrder.ts";
      export { getSfxAudioVolume, getTtsAudioVolume } from "./src/lib/audioMute.ts";
      export { resampleSpectrum, speechSpectrumFromFft } from "./src/lib/audioLevel.ts";
      export { germanWordGloss } from "./src/lib/germanWordGloss.ts";
      export { englishWordGloss } from "./src/lib/englishWordGloss.ts";
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
  AUDIO_REQUIRED_SENTENCE_PHASES,
  BILINGUAL_SENTENCE_PHASES,
  buildSentencePhaseRoute,
  buildTatoebaParts,
  curatedTopics,
  englishWordGloss,
  germanWordGloss,
  getSfxAudioVolume,
  getTtsAudioVolume,
  MASTERED_SENTENCE_PHASES,
  matchLearningModeGermanAnswer,
  phraseForLearningMode,
  resampleSpectrum,
  replacementSentencePhaseWhenMuted,
  SENTENCE_PHASES,
  speechSpectrumFromFft,
  toTextedGerman,
  wordOrderTokensMatchSentence,
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

const reportedSinnContextPhrase = authoredPhrases.find(
  (phrase) => phrase?.de === "Das ergibt Sinn, jetzt verstehe ich den Zusammenhang."
);
check("the longer Sinn ergeben sentence still exists", Boolean(reportedSinnContextPhrase));
check(
  "the longer Sinn note treats both common forms accurately",
  reportedSinnContextPhrase?.use?.includes("standard and register-neutral")
    && reportedSinnContextPhrase?.use?.includes("also common in everyday conversation")
    && !/not Sinn machen|careful version|purist|Denglish/i.test(reportedSinnContextPhrase.use),
  `found ${JSON.stringify(reportedSinnContextPhrase?.use)}`
);

const reportedRepeatedWordPhrase = authoredPhrases.find(
  (phrase) => phrase?.de === "Sie müssen nicht mit, wenn Sie nicht wollen."
);
check("the reported repeated-word sentence still exists", Boolean(reportedRepeatedWordPhrase));
check(
  "the reported sentence has a natural and faithful English meaning",
  reportedRepeatedWordPhrase?.en === "You don't have to come along if you don't want to.",
  `found ${JSON.stringify(reportedRepeatedWordPhrase?.en)}`
);
check(
  "the reported sentence explains why both repeated words are required",
  String(reportedRepeatedWordPhrase?.use ?? "").includes("each appear twice on purpose")
);

function firstRepeatedVisibleWordPair(sentence) {
  const words = String(sentence ?? "").trim().split(/\s+/).filter(Boolean);
  const firstAt = new Map();
  for (let index = 0; index < words.length; index += 1) {
    const previous = firstAt.get(words[index]);
    if (previous !== undefined) return { words, first: previous, second: index };
    firstAt.set(words[index], index);
  }
  return null;
}

const repeatedWordRows = authoredPhrases
  .map((phrase) => ({ phrase, pair: firstRepeatedVisibleWordPair(phrase?.de) }))
  .filter((row) => row.pair);
const repeatedWordOrderFailures = repeatedWordRows.filter(({ pair }) => {
  const tokens = pair.words.map((text, index) => ({ id: `${index}-${text}`, text }));
  [tokens[pair.first], tokens[pair.second]] = [tokens[pair.second], tokens[pair.first]];
  return !wordOrderTokensMatchSentence(tokens, pair.words.join(" "));
});
check(
  "every catalog sentence with identical visible tiles accepts those tiles in either identity order",
  repeatedWordRows.length > 0 && repeatedWordOrderFailures.length === 0,
  repeatedWordOrderFailures.slice(0, 5).map(({ phrase }) => phrase.de).join("; ")
);

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

const testFft = Array.from({ length: 512 }, () => 0);
for (let index = 3; index <= 6; index += 1) testFft[index] = 225;
for (let index = 35; index <= 48; index += 1) testFft[index] = 178;
const measuredSpectrum = speechSpectrumFromFft(testFft, 48_000, 1_024, 12);
const compactSpectrum = resampleSpectrum(measuredSpectrum, 9);
check(
  "TTS meters preserve real low-to-high frequency differences",
  measuredSpectrum.length === 12
    && measuredSpectrum.some((level) => level > 0.6)
    && measuredSpectrum.some((level) => level > 0.5 && level < 0.75)
    && new Set(measuredSpectrum.map((level) => level.toFixed(2))).size >= 3,
  `found ${JSON.stringify(measuredSpectrum)}`
);
check(
  "frequency spectra resample cleanly to the Stage 5 bar count",
  compactSpectrum.length === 9
    && compactSpectrum.every((level) => level >= 0 && level <= 1)
    && new Set(compactSpectrum.map((level) => level.toFixed(2))).size >= 3,
  `found ${JSON.stringify(compactSpectrum)}`
);
check(
  "silent FFT input produces a silent meter",
  speechSpectrumFromFft(Array.from({ length: 512 }, () => 0), 48_000, 1_024, 12).every((level) => level === 0)
);

const reportedVentingPhrase = authoredPhrases.find((phrase) =>
  phrase?.de === "Der Tag war einfach nur zum Kotzen."
);

check("the reported bad-day phrase still exists", Boolean(reportedVentingPhrase));
check(
  "the bad-day phrase declares a faithful English meaning for its spoken form",
  reportedVentingPhrase?.shortEn === "That was fucking awful. / That really sucked.",
  `found ${JSON.stringify(reportedVentingPhrase?.shortEn)}`
);

if (reportedVentingPhrase) {
  const conversation = phraseForLearningMode(reportedVentingPhrase, "conversation");
  const exam = phraseForLearningMode(reportedVentingPhrase, "exam");
  const spoken = "War echt zum Kotzen.";
  const standard = "Der Tag war einfach nur zum Kotzen.";

  check(
    "Conversation mode teaches the common spoken bad-day phrase first",
    conversation.de === spoken
      && conversation.en === reportedVentingPhrase.shortEn
      && conversation.long === standard,
    `found ${JSON.stringify(conversation)}`
  );
  check(
    "Conversation grading also accepts the fuller bad-day sentence",
    acceptsSelectedPhrase(conversation, standard)
  );
  check(
    "Exam mode keeps the complete bad-day sentence as its target",
    exam.de === standard && exam.short === spoken && exam.long === undefined,
    `found ${JSON.stringify(exam)}`
  );
}

const reportedGoingOutPhrase = authoredPhrases.find((phrase) =>
  phrase?.de === "So kannst du da nicht hingehen."
);

check("the reported going-out phrase still exists", Boolean(reportedGoingOutPhrase));
check(
  "the blunter going-out alternative is labelled as parent-specific rather than generic speech",
  reportedGoingOutPhrase?.short === "So gehst du nicht raus."
    && reportedGoingOutPhrase?.shortLabel === "Parents often say"
    && String(reportedGoingOutPhrase?.use ?? "").includes("especially associated with a parent"),
  `found ${JSON.stringify(reportedGoingOutPhrase)}`
);
if (reportedGoingOutPhrase) {
  const conversation = phraseForLearningMode(reportedGoingOutPhrase, "conversation");
  check(
    "Conversation mode keeps the neutral full target while preserving the contextual parent alternative",
    conversation.de === "So kannst du da nicht hingehen."
      && conversation.short === "So gehst du nicht raus."
      && conversation.shortLabel === "Parents often say",
    `found ${JSON.stringify(conversation)}`
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
    `Conversation mode retains and accepts the standard form: ${expected.standard}`,
    conversation.long === expected.standard
      && acceptsSelectedPhrase(conversation, expected.spoken)
      && acceptsSelectedPhrase(conversation, expected.standard),
    `found long ${JSON.stringify(conversation.long)}`
  );
  check(
    `Exam mode retains the standard target: ${expected.standard}`,
    exam.de === expected.standard && exam.short === expected.spoken,
    `found target ${JSON.stringify(exam.de)} and short ${JSON.stringify(exam.short)}`
  );
  if (expected.standard === "Das ergibt Sinn.") {
    check(
      "usage guidance treats Sinn ergeben and Sinn machen as normal German",
      phrase.use?.includes("Both forms are normal")
        && phrase.use?.includes("standard, register-neutral")
        && !/purist|Denglish/i.test(phrase.use),
      `found ${JSON.stringify(phrase.use)}`
    );
  }
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

  // Conversation mode punctuates the way people type, so the authored short
  // form is compared after that pass rather than before it. The WORDS still
  // have to be the author's -- only the grammar commas move.
  if (conversation.de !== toTextedGerman(spoken)) variantIssues.push(`${label}: Conversation target`);
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
const muteButtonSource = fs.readFileSync(path.join(root, "src/components/MuteButton.tsx"), "utf8");
const ttsWaveformSource = fs.readFileSync(path.join(root, "src/components/TtsWaveform.tsx"), "utf8");
const voiceSource = fs.readFileSync(path.join(root, "src/lib/voice.ts"), "utf8");
const guidedStyles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
const testsSource = fs.readFileSync(path.join(root, "src/components/tests/TestsView.tsx"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const packageLockSource = fs.readFileSync(path.join(root, "package-lock.json"), "utf8");
const dialogueStart = guidedSource.indexOf("function DialogueExercise(");
const dialogueEnd = guidedSource.indexOf("// Section", dialogueStart);
const dialogueSource = guidedSource.slice(dialogueStart, dialogueEnd > dialogueStart ? dialogueEnd : undefined);
// TappableSentence is shared with Listen and the passages now, so it has its
// own file and the whole file is the component — no slicing needed.
const tappableSentenceSource = fs.readFileSync(
  path.join(root, "src/components/shared/TappableSentence.tsx"),
  "utf8"
);
const guidedSentenceTracking = [...guidedStyles.matchAll(
  /(?:^|\n)[^{\n]*\.fs-line\s*\{[^}]*letter-spacing:\s*(-?\d*\.?\d+)em;/g
)].map((match) => Number(match[1]));

function phaseNames(constantName) {
  const body = guidedSource.match(new RegExp(`const ${constantName}[^=]*= \\[(.*?)\\]`, "s"))?.[1] ?? "";
  return [...body.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

const fullLessonPhases = [...SENTENCE_PHASES];
const bilingualLessonPhases = [...BILINGUAL_SENTENCE_PHASES];
const mutedFullLessonPhases = buildSentencePhaseRoute({
  mastered: false,
  bilingual: false,
  audioMuted: true,
  typingFailed: true,
});
// What a phrase actually opens with: one typing test and no writing practice.
const leanLessonPhases = buildSentencePhaseRoute({
  mastered: false,
  bilingual: false,
  audioMuted: false,
});
const mutedBilingualLessonPhases = buildSentencePhaseRoute({
  mastered: false,
  bilingual: true,
  audioMuted: true,
});
const mutedMasteredLessonPhases = buildSentencePhaseRoute({
  mastered: true,
  bilingual: false,
  audioMuted: true,
});

check(
  "Stage 5 waveforms use the playing clip's real frequency spectrum instead of a scrolling fake",
  voiceSource.includes("getByteFrequencyData(frequencySamples)")
    && voiceSource.includes("speechSpectrumFromFft(")
    && voiceSource.includes("analyser.fftSize = 1024")
    && ttsWaveformSource.includes("detail.spectrum")
    && ttsWaveformSource.includes("resampleSpectrum(spectrum, bars)")
    && !ttsWaveformSource.includes("history.shift()")
);
check(
  "Hear it stays visually steady while TTS is playing",
  !guidedStyles.includes("fsListenPulse")
    && !guidedStyles.includes(".fs-listen.is-speaking .fs-listen-icon { animation")
);
check(
  "context-specific spoken alternatives can replace the generic People say label",
  guidedSource.includes("shortLabel ? uiOr(shortLabel")
    && guidedSource.includes("shortLabel={targetIsGermanCourse ? item.shortLabel : undefined}")
);
check(
  "guided sentence tracking keeps German umlauts visually distinct",
  guidedSentenceTracking.length >= 2
    && guidedSentenceTracking.every((tracking) => tracking >= -0.02)
);

check(
  "no lesson route asks the learner to speak into a microphone",
  !fullLessonPhases.includes("Speak")
    && !bilingualLessonPhases.includes("Speak")
    && fullLessonPhases.includes("WriteFromMemory")
    && !guidedSource.includes('phase === "Speak"')
    && !guidedSource.includes("<SpeakingPractice")
    && !guidedSource.includes("<MicButton")
);
check(
  "unavailable target audio temporarily removes every audio-required sentence stage",
  AUDIO_REQUIRED_SENTENCE_PHASES.length === 2
    && AUDIO_REQUIRED_SENTENCE_PHASES.includes("ListenPick")
    && AUDIO_REQUIRED_SENTENCE_PHASES.includes("MissingWord")
    && AUDIO_REQUIRED_SENTENCE_PHASES.every((phase) => !mutedFullLessonPhases.includes(phase))
    && mutedFullLessonPhases.length === fullLessonPhases.length - AUDIO_REQUIRED_SENTENCE_PHASES.length
    // The muted route is the full one with the audio stages taken out and
    // nothing else moved. This used to be written as "the stage after
    // MeaningSelect is Type", which was the same claim only while those two
    // happened to be neighbours — adding a stage between them broke a check
    // about muting for a reason that had nothing to do with audio.
    && JSON.stringify(mutedFullLessonPhases)
      === JSON.stringify(fullLessonPhases.filter((phase) => !AUDIO_REQUIRED_SENTENCE_PHASES.includes(phase)))
);
check(
  "mute filtering also preserves the useful bilingual and mastered routes",
  AUDIO_REQUIRED_SENTENCE_PHASES.every((phase) => !mutedBilingualLessonPhases.includes(phase))
    && mutedBilingualLessonPhases.includes("French")
    && mutedBilingualLessonPhases.includes("Memory")
    && JSON.stringify(mutedMasteredLessonPhases) === JSON.stringify(MASTERED_SENTENCE_PHASES)
);
check(
  "muting during either listening check moves safely to the next usable stage",
  replacementSentencePhaseWhenMuted("ListenPick", { mastered: false, bilingual: false, typingFailed: true }) === "Type"
    // The spoken gap fill hands over to the written one, not to whatever
    // happens to come next.
    && replacementSentencePhaseWhenMuted("MissingWord", { mastered: false, bilingual: false, typingFailed: true }) === "Gap"
    && replacementSentencePhaseWhenMuted("Type", { mastered: false, bilingual: false, typingFailed: true }) === "Type"
);
// ── one typing test, and the writing practice is what missing it costs ────
// A phrase was written out six times in the sitting that introduced it. Only
// the first of those was a test; the rest were transcription, which is the
// slowest thing the app asks for and the reason a sitting covered so little.
check(
  "a new phrase asks for one typing stage, not six",
  leanLessonPhases.filter((phase) =>
    ["ListenPick", "Type", "Translate", "Gap", "WriteFromMemory", "RecallBoth"].includes(phase)
  ).join(",") === "ListenPick",
  "the lean route is asking for writing practice the learner has not failed anything to earn"
);
check(
  "...and it is Hear & write, the one with nothing on screen to copy",
  leanLessonPhases.includes("ListenPick")
);
check(
  "recognition is untouched — nothing was swapped for a multiple choice",
  ["Read", "MeaningSelect", "MissingWord", "Order"].every((phase) =>
    leanLessonPhases.includes(phase) && fullLessonPhases.includes(phase))
);
check(
  "missing the typing test buys the writing stages back",
  ["Type", "Translate", "Gap", "WriteFromMemory", "RecallBoth"].every((phase) =>
    !leanLessonPhases.includes(phase)
    && buildSentencePhaseRoute({
      mastered: false, bilingual: false, audioMuted: false, typingFailed: true,
    }).includes(phase)),
  "a wrong answer no longer earns the practice it is supposed to"
);
// ── muting replaces the audio stages, it does not shorten the sitting ──────
// Removing them was the rule, and it left a new word with three stages and
// no test at all — Read, pick the meaning, see it the other way round, done —
// because the one typing test a new item gets was Hear & write. So Hear &
// write hands over to Read & write, the spoken gap fill to the written one,
// and a word, which has neither a gap nor an ordering to fall back on, gets
// the written trio in place of its one listening test.
check(
  "muting mid-listening test hands over to Read & write, not to whatever came next",
  replacementSentencePhaseWhenMuted("ListenPick", { mastered: false, bilingual: false }) === "Type"
);
const mutedLeanLessonPhases = buildSentencePhaseRoute({ mastered: false, bilingual: false, audioMuted: true });
check(
  "a new phrase with the sound off is still tested, in writing, and still gap-filled",
  AUDIO_REQUIRED_SENTENCE_PHASES.every((phase) => !mutedLeanLessonPhases.includes(phase))
    && mutedLeanLessonPhases.includes("Type")
    && mutedLeanLessonPhases.includes("Gap")
    && mutedLeanLessonPhases.length >= leanLessonPhases.length,
  `muted: ${mutedLeanLessonPhases.join(" → ")} against ${leanLessonPhases.join(" → ")}`
);
const leanWordPhases = buildSentencePhaseRoute({ mastered: false, bilingual: false, audioMuted: false, word: true });
const mutedLeanWordPhases = buildSentencePhaseRoute({ mastered: false, bilingual: false, audioMuted: true, word: true });
check(
  "a new word with the sound off gets the written trio where its one listening test was",
  !mutedLeanWordPhases.includes("ListenPick")
    && ["Type", "Translate", "RecallBoth"].every((phase) => mutedLeanWordPhases.includes(phase))
    && mutedLeanWordPhases.length > leanWordPhases.length,
  `muted: ${mutedLeanWordPhases.join(" → ")} against ${leanWordPhases.join(" → ")}`
);
// ── a missed spelling is remembered past the sitting ────────────────────────
// The miss bought the writing stages back inside the sitting where it
// happened, and then the component remounted and forgot: the phrase came back
// for review on the one-test route as if it had never gone wrong. The record
// keeps when it was last answered and when it last slipped, so every step is
// stamped from that before the sitting is dealt, and a struggle review — which
// is what a failed spelling writes — carries it outright.
const builder = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
check(
  "a phrase whose last run had a mistake comes back to be spelled again",
  builder.includes("const withSpellingMemory = (steps: any[]): any[] => {")
    && builder.includes("lastRunHadMistake(record)")
    && /const withSecondShowing = \(dealt: any\[\]\): any\[\] => \{[\s\S]{0,200}?const steps(?:: any\[\])? = withSpellingMemory\(dealt\);/.test(builder)
    && /reviewReason: "struggle",[\s\S]{0,600}?item: \{ \.\.\.st\.item, typingFailed: true \}/.test(builder)
    && guidedSource.includes("useState(() => Boolean(item?.typingFailed))"),
  "the review of a misspelled phrase opens on the one-test route, so the spelling is never checked again"
);
const adaptive = fs.readFileSync(path.join(root, "src/lib/adaptivePractice.ts"), "utf8");
check(
  "...judged by the record itself: the last answer and the last slip are the same moment",
  /export function lastRunHadMistake\([\s\S]{0,400}?slipped >= answered/.test(adaptive)
);
check(
  "...and Meaning first is never left as a dead end at the foot of a route",
  guidedSource.includes("<Button onClick={advanceOrFinish}")
    && !guidedSource.includes("<Button onClick={advance}\n")
    && /if \(currentPhaseRef\.current === phase\) advanceOrFinish\(\);/.test(guidedSource),
  "a reading stage that ends a route calls advance(), which does nothing on the last stage"
);
check(
  "the guided lesson reacts to both master and learning-language mute controls",
  guidedSource.includes("window.addEventListener(AUDIO_SETTINGS_EVENT, syncAudioState)")
    && guidedSource.includes("getTtsAudioVolume(guidedTargetLanguageTag()) <= 0")
    && guidedSource.includes("replacementSentencePhaseWhenMuted(phase")
    && guidedSource.includes("audioMuted: audioMutedRef.current")
);
check(
  "lesson shortcut help lists the Windows Alt codes for German characters",
  guidedSource.includes('["ä", "0228"]')
    && guidedSource.includes('["ö", "0246"]')
    && guidedSource.includes('["ü", "0252"]')
    && guidedSource.includes('["ß", "0223"]')
    && guidedSource.includes("Ä Alt + 0196 · Ö Alt + 0214 · Ü Alt + 0220")
    && guidedSource.includes("Windows number pad")
);
const promptLanguageFlagShell = guidedStyles.match(
  /\.fs-prompt \.fs-prompt-language\.is-german,\s*[\s\S]*?\.fs-prompt \.fs-prompt-language\.is-english\s*\{([^}]*)\}/u
)?.[1] ?? "";
check(
  "answer prompts use neutral dashboard-style language flags",
  guidedSource.includes('function PromptLanguageBadge(')
    && guidedSource.includes('className="fs-german-flag"')
    && guidedSource.includes('"fs-english-flag"')
    && !guidedSource.includes('<span>{learnEn ? "EN" : "DE"}</span>')
    && promptLanguageFlagShell.includes("background: #fff;")
    && !promptLanguageFlagShell.includes("var(--fs-grad)")
);
const audibleSettings = {
  muted: false,
  masterVolume: 1,
  sfxVolume: 1,
  englishVolume: 1,
  germanVolume: 1,
  sfxMuted: false,
  englishMuted: false,
  germanMuted: false,
};
check(
  "language voice mute only silences listening work for that language",
  getTtsAudioVolume("de-DE", { ...audibleSettings, germanMuted: true }) === 0
    && getTtsAudioVolume("en-GB", { ...audibleSettings, germanMuted: true }) === 1
    && getTtsAudioVolume("en-US", { ...audibleSettings, englishMuted: true }) === 0
    && getTtsAudioVolume("de-DE", { ...audibleSettings, englishMuted: true }) === 1
    && getTtsAudioVolume("de-DE", { ...audibleSettings, muted: true }) === 0
);
check(
  "the audio mixer exposes a separate persistent sound-effects slider",
  muteButtonSource.includes('label={ui("Sound effects")}')
    && muteButtonSource.includes('testId="sfx"')
    && muteButtonSource.includes("setSfxAudioVolume")
    && muteButtonSource.includes("toggleSfxMuted")
);
check(
  "answer sounds respect both master and sound-effects volume",
  getSfxAudioVolume({
    muted: false,
    masterVolume: 0.5,
    sfxVolume: 0.4,
    englishVolume: 1,
    germanVolume: 1,
    sfxMuted: false,
    englishMuted: false,
    germanMuted: false,
  }) === 0.2
    && getSfxAudioVolume({
      muted: false,
      masterVolume: 1,
      sfxVolume: 1,
      englishVolume: 1,
      germanVolume: 1,
      sfxMuted: true,
      englishMuted: false,
      germanMuted: false,
    }) === 0
    && guidedSource.includes("const sfxVolume = getSfxAudioVolume()")
    && guidedSource.includes("gain * sfxVolume")
);
check(
  "word-order grading compares visible text instead of hidden duplicate-tile positions",
  guidedSource.includes("wordOrderTokensMatchSentence(orderTokens, item.de)")
    && !guidedSource.includes("answerIndex")
    && wordOrderTokensMatchSentence(
      [
        { text: "Sie" },
        { text: "müssen" },
        { text: "nicht" },
        { text: "mit," },
        { text: "wenn" },
        { text: "Sie" },
        { text: "nicht" },
        { text: "wollen." },
      ],
      "Sie müssen nicht mit, wenn Sie nicht wollen."
    )
);
check(
  "German lesson words expose useful offline English hover glosses",
  germanWordGloss("Was") === "what"
    && germanWordGloss("nicht,") === "not"
    && germanWordGloss("glaube")?.includes("believe")
    && germanWordGloss("brauche")?.includes("need")
    && germanWordGloss("müssen")?.includes("must")
    && germanWordGloss("Gedanken") === "thought"
    && germanWordGloss("unbekanntesfantasiewort") === null
    // Both directions still resolve a gloss; the German side now also tells
    // the lookup where the word sits, so a mid-sentence capital gets the noun
    // rather than its lowercase verb twin (see check-word-hovers). The
    // sentence itself lives in the shared component; the reorder tiles are
    // still the lesson's own.
    && tappableSentenceSource.includes("germanWordGloss(w, { midSentenceCapital:")
    && tappableSentenceSource.includes(': glossLang === "en" ? englishWordGloss(w)')
    && guidedSource.includes("? englishWordGloss(token.text)")
    && guidedSource.includes("germanWordGloss(token.text, {")
    && tappableSentenceSource.includes("data-gloss={hoverGloss ?? undefined}")
    && guidedStyles.includes("[data-gloss]:is(:hover, :focus-visible)::before")
);
check(
  "English lesson words expose useful offline German hover glosses",
  englishWordGloss("I") === "ich"
    && englishWordGloss("the") === "der / die / das"
    && englishWordGloss("until") === "bis"
    && englishWordGloss("aim")?.toLocaleLowerCase("de-DE").includes("ziel")
    && englishWordGloss("houses")?.toLocaleLowerCase("de-DE").includes("haus")
    && englishWordGloss("don't") === "… nicht (mit do)"
    && englishWordGloss("head")?.toLocaleLowerCase("de-DE").includes("kopf")
    && englishWordGloss("head")?.toLocaleLowerCase("de-DE").includes("steuern") !== true
    && englishWordGloss("zzzunknownword") === null
    // The popover opens in both directions: the gate is "a gloss language
    // exists", never "the course is German".
    && tappableSentenceSource.includes("if (!glossLang) return;")
    && !tappableSentenceSource.includes("if (!showEnglishGloss) return;")
    // Learn-English practice writes keep German in `de`: the gloss becomes
    // the card's German side and the hovered English word its front.
    && tappableSentenceSource.includes("addCustomEntries([{ de, en: face, use: text }]);")
);
check(
  "copying tappable lesson words produces one normally spaced sentence",
  tappableSentenceSource.includes('className="fs-tappable-sentence"')
    && tappableSentenceSource.includes('onCopy={copySelectionWithSpaces}')
    && tappableSentenceSource.includes('.filter(Boolean).join(" ")')
    && tappableSentenceSource.includes('{i > 0 && " "}')
    && !tappableSentenceSource.includes('onMouseDown={(e) => e.preventDefault()}')
    && guidedStyles.includes(".fs-tappable-sentence { display: contents; }")
);
const glossaryTokens = authoredPhrases.flatMap((phrase) =>
  [phrase?.de, phrase?.short, phrase?.long]
    .filter(Boolean)
    .flatMap((sentence) => String(sentence).split(/\s+/).filter((token) => /[A-Za-zÄÖÜäöüß]/u.test(token)))
);
const missingGlossTokens = glossaryTokens.filter((token) => !germanWordGloss(token));
const glossaryCoverage = glossaryTokens.length
  ? 1 - (missingGlossTokens.length / glossaryTokens.length)
  : 0;
const missingGlossCounts = missingGlossTokens.reduce((counts, token) => {
  const key = token.toLocaleLowerCase("de-DE").replace(/^[\s.,!?;:()"'„“]+|[\s.,!?;:()"'„“]+$/gu, "");
  if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}, new Map());
const frequentMissingGlosses = [...missingGlossCounts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "de"))
  .slice(0, 18)
  .map(([token, count]) => `${token} (${count})`);
check(
  "offline hover glosses cover at least 90% of words used in the lesson catalog",
  glossaryCoverage >= 0.90,
  `${Math.round(glossaryCoverage * 100)}% covered; frequent gaps: ${frequentMissingGlosses.join(", ")}`
);
const englishGlossaryTokens = authoredPhrases.flatMap((phrase) =>
  [phrase?.en]
    .filter(Boolean)
    .flatMap((sentence) => String(sentence).split(/\s+/).filter((token) => /[A-Za-z]/u.test(token)))
);
const missingEnglishGlossTokens = englishGlossaryTokens.filter((token) => !englishWordGloss(token));
const englishGlossaryCoverage = englishGlossaryTokens.length
  ? 1 - (missingEnglishGlossTokens.length / englishGlossaryTokens.length)
  : 0;
const missingEnglishGlossCounts = missingEnglishGlossTokens.reduce((counts, token) => {
  const key = token.toLocaleLowerCase("en-GB").replace(/^[\s.,!?;:()"'“”]+|[\s.,!?;:()"'“”]+$/gu, "");
  if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}, new Map());
const frequentMissingEnglishGlosses = [...missingEnglishGlossCounts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "en"))
  .slice(0, 80)
  .map(([token, count]) => `${token} (${count})`);
check(
  "offline German glosses cover at least 90% of English lesson words",
  englishGlossaryCoverage >= 0.90,
  `${Math.round(englishGlossaryCoverage * 100)}% covered; frequent gaps: ${frequentMissingEnglishGlosses.join(", ")}`
);
check(
  "stage-route fallback uses the shared defined phase lists",
  guidedSource.includes("[...BILINGUAL_SENTENCE_PHASES]")
    && guidedSource.includes("[...SENTENCE_PHASES]")
    && !guidedSource.includes("withFrench ? BILINGUAL_PHASES")
);
check(
  "nothing records the learner: speaking into the microphone was removed whole",
  !guidedSource.includes("transcribeSpeech")
    && !guidedSource.includes("getUserMedia")
    && !fs.existsSync(path.join(root, "electron/speech-recognition.cjs"))
);
check(
  "the retired browser speech-model runtime stays absent from the app",
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
  "dialogue typing can be skipped without falsely marking the line known",
  dialogueSource.includes("const skipLine = () => {")
    && dialogueSource.includes('onGradeItem?.(lineGradeId, "struggle");')
    && dialogueSource.includes('aria-label="Skip this line for now and keep it in practice"')
    && dialogueSource.includes("nextLine();")
);
check(
  "dialogue actions use the green prototype hierarchy instead of the legacy black glow",
  dialogueSource.includes('className="dialogue-skip-action')
    && dialogueSource.includes('"dialogue-primary-action h-14')
    && dialogueSource.includes('className="dialogue-title-badge')
    && !dialogueSource.includes("continue-glow")
    && !dialogueSource.includes("bg-zinc-950 text-white")
);
check(
  "guided answer boxes disable the browser spellchecker because the app grades the selected language itself",
  (guidedSource.match(/<Input\b/g) || []).length > 0
    && (guidedSource.match(/<Input\b/g) || []).length
      === (guidedSource.match(/spellCheck=\{false\}/g) || []).length
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
