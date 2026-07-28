const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { matchEnglishPhrase, matchGermanSentence, primaryAnswer } from "./src/lib/germanTextMatch.ts";
      export { buildBundledParts } from "./src/lib/contentBank.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildPartCatalog } from "./src/session.ts";
      export { buildCorpusIndex, sentenceCommonality } from "./src/lib/corpusFrequency.ts";
      export { itemDifficulty, itemPriority } from "./src/lib/ability.ts";
    `,
    resolveDir: root,
    sourcefile: "answer-matching-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("answer-matching-check", module);
compiled.filename = path.join(root, ".answer-matching-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildCorpusIndex,
  buildPartCatalog,
  itemDifficulty,
  itemPriority,
  matchEnglishPhrase,
  matchGermanSentence,
  primaryAnswer,
  sentenceCommonality,
} = compiled.exports;

function findPhrase(value, german) {
  if (!value || typeof value !== "object") return undefined;
  if (value.de === german && typeof value.en === "string") return value;
  for (const child of Object.values(value)) {
    const found = findPhrase(child, german);
    if (found) return found;
  }
  return undefined;
}

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const german = "Wir sind noch nicht komplett, einer kommt später.";
const phrase = findPhrase(allPartBlueprints, german);
check("the reported restaurant phrase still exists", Boolean(phrase));

if (phrase) {
  check(
    "the displayed answer teaches natural English",
    primaryAnswer(phrase.en) === "We're not all here yet — one more person is coming later.",
    `found ${JSON.stringify(primaryAnswer(phrase.en))}`
  );

  const accepted = [
    "we are not all here yet, one comes later",
    "We're not all here yet; one more is coming.",
    "We are still waiting on one more.",
  ];
  for (const answer of accepted) {
    check(
      `valid equivalent is accepted: ${answer}`,
      matchEnglishPhrase(answer, phrase.en).ok
    );
  }

  const rejected = [
    "We are all here; one comes later.",
    "They are not all here yet; one comes later.",
    "We are not all here yet; no one comes later.",
    "We are not all here yet; two come later.",
    "We are not all here yet; one came earlier.",
  ];
  for (const answer of rejected) {
    check(
      `meaning-changing answer stays rejected: ${answer}`,
      !matchEnglishPhrase(answer, phrase.en).ok
    );
  }
}

const treatmentCostGerman = "Was kostet das, und was zahlt die Kasse?";
const treatmentCostPhrase = findPhrase(allPartBlueprints, treatmentCostGerman);
check("the treatment-cost phrase still exists", Boolean(treatmentCostPhrase));

if (treatmentCostPhrase) {
  check(
    "the displayed treatment-cost answer uses natural English",
    primaryAnswer(treatmentCostPhrase.en) === "How much does it cost, and what does my insurance cover?",
    `found ${JSON.stringify(primaryAnswer(treatmentCostPhrase.en))}`
  );

  for (const answer of [
    "How much does it cost, and what does my insurance cover?",
    "What does it cost, and what does my insurance cover?",
  ]) {
    check(
      `equivalent treatment-cost answer is accepted: ${answer}`,
      matchEnglishPhrase(answer, treatmentCostPhrase.en).ok
    );
  }

  check(
    "an answer that omits the insurance clause stays rejected",
    !matchEnglishPhrase("How much does it cost?", treatmentCostPhrase.en).ok
  );
}

const settingOffPhrase = findPhrase(allPartBlueprints, "Ich fahre gleich los.");
check("the setting-off phrase still exists", Boolean(settingOffPhrase));
check(
  "the spoken setting-off form keeps the near-future meaning",
  settingOffPhrase?.short === "Ich fahr gleich los.",
  `found ${JSON.stringify(settingOffPhrase?.short)}`
);

for (const [german, spoken] of [
  ["Ich kann heute Nacht die Finger nicht von dir lassen.", "Ich kann heut Nacht die Finger nicht von dir lassen."],
  ["Ich geh mal kurz runter, bin gleich wieder da.", "Ich geh kurz runter, bin gleich wieder da."],
  ["Fang schon mal an, ich komm gleich nach.", "Fang schon mal an, bin gleich da."],
  ["Ich bin bis Freitag krankgeschrieben, die AU schick ich euch gleich.", "Bin bis Freitag krankgeschrieben, die AU schick ich gleich."],
  ["Ich hab hier kaum Empfang, kann ich dich gleich zurückrufen?", "Hab kaum Empfang — kann ich dich gleich zurückrufen?"],
  ["Das war ich, sorry — ich wisch das gleich weg.", "Das war ich, sorry — wisch ich gleich weg."],
]) {
  const phraseWithSpokenForm = findPhrase(allPartBlueprints, german);
  check(`the spoken form keeps the full meaning: ${german}`, Boolean(phraseWithSpokenForm));
  check(
    `the spoken form preserves every promise or time detail: ${german}`,
    phraseWithSpokenForm?.short === spoken,
    `found ${JSON.stringify(phraseWithSpokenForm?.short)}`
  );
}

const bundledParts = buildBundledParts();
const restaurantPart = buildApiPartFromResolved(allPartBlueprints.part76, {});
const restaurantPhrases = restaurantPart.phrases ?? [];
const standardTable = "Haben Sie noch einen Tisch frei?";
const conciseTable = "Ist noch ein Tisch frei?";
const colloquialTable = "Haben Sie noch was frei?";
const conciseTableIndex = restaurantPhrases.findIndex((item) => item.de === conciseTable);
const colloquialTableIndex = restaurantPhrases.findIndex((item) => item.de === colloquialTable);
const standardTablePhrase = bundledParts["cb-food"]?.phrases.find((item) => item.de === standardTable);

check("the explicit table question is in the early core food pack", Boolean(standardTablePhrase));
check(
  "the explicit table question has a stable id",
  standardTablePhrase?.id === "cb-food-table-availability"
);
check(
  "the old colloquial phrase keeps its original index and saved-progress id",
  colloquialTableIndex === 0
);
check(
  "the concise alternative is appended without shifting old restaurant ids",
  conciseTableIndex === restaurantPhrases.length - 1
);
check(
  "the learner-facing default explains einen without grammar jargon",
  standardTablePhrase?.use.includes("der Tisch → einen Tisch")
    && standardTablePhrase?.use.includes("not 'ein Tisch'")
);
check(
  "the incorrect nominative form is not shipped as a German phrase",
  !JSON.stringify(allPartBlueprints).includes("Haben Sie noch ein Tisch frei?")
);
check(
  "the correct einen form passes German grading",
  matchGermanSentence(standardTable, standardTable).ok
);
check(
  "the incorrect ein form remains rejected",
  !matchGermanSentence("Haben Sie noch ein Tisch frei?", standardTable).ok
);
const lowerNoun = matchGermanSentence("Haben Sie noch einen tisch frei?", standardTable);
check(
  "a lowercase German noun is reported as a capitalization error",
  !lowerNoun.ok && lowerNoun.capitalizationError === true
);
const lowerFormalYou = matchGermanSentence("Haben sie noch einen Tisch frei?", standardTable);
check(
  "lowercase formal Sie is reported as a capitalization error",
  !lowerFormalYou.ok && lowerFormalYou.capitalizationError === true
);

const catalogParts = { ...allPartBlueprints, ...bundledParts, part76: restaurantPart };
const corpusIndex = buildCorpusIndex(catalogParts);
const standardCatalog = buildPartCatalog(bundledParts["cb-food"], "cb-food")
  .find((item) => item.de === standardTable);
const conciseCatalog = buildPartCatalog(restaurantPart, "part76")
  .find((item) => item.de === conciseTable);
const colloquialCatalog = buildPartCatalog(restaurantPart, "part76")
  .find((item) => item.de === colloquialTable);

function freshScore(item, ability) {
  return itemPriority({
    ability,
    commonality: sentenceCommonality(item.de, corpusIndex),
    difficulty: itemDifficulty(item.level, item.de.trim().split(/\s+/).length),
    lessonPriority: item.lessonPriority,
  });
}

for (const ability of ["easy", "medium", "hard", "expert"]) {
  const standardScore = freshScore(standardCatalog, ability);
  const conciseScore = freshScore(conciseCatalog, ability);
  const colloquialScore = freshScore(colloquialCatalog, ability);
  check(
    `actual ${ability} Continue Learning ranking teaches explicit then concise then colloquial`,
    standardScore < conciseScore && conciseScore < colloquialScore,
    `${standardScore.toFixed(4)} / ${conciseScore.toFixed(4)} / ${colloquialScore.toFixed(4)}`
  );
}

if (failures) {
  console.error(`\n${failures} answer-matching regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nAnswer variants and learner-first curriculum ordering are guarded");
