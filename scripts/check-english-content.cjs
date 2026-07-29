const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";
    `,
    resolveDir: root,
    sourcefile: "english-content-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("english-content-check", module);
compiled.filename = path.join(root, ".english-content-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { allPartBlueprints, buildBundledParts, buildTatoebaParts } = compiled.exports;
// Scan the union of both directions. Direction-specific packs (for example
// English spelling for German speakers) do not exist in the default learn-de
// bundle and would otherwise escape this content audit entirely.
const bundledParts = {
  ...buildBundledParts("learn-de"),
  ...buildBundledParts("learn-en"),
};
const tatoebaParts = buildTatoebaParts(5_000);

const englishKeys = new Set(["en", "shortEn", "fallbackEn", "exampleEn"]);
const learnerEnglish = [];
function collectEnglish(value, location = "content") {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectEnglish(entry, `${location}[${index}]`));
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    const nextLocation = `${location}.${key}`;
    if (englishKeys.has(key) && typeof entry === "string") {
      learnerEnglish.push({ text: entry, location: nextLocation });
    }
    if (entry && typeof entry === "object") collectEnglish(entry, nextLocation);
  }
}

collectEnglish(allPartBlueprints, "blueprints");
collectEnglish(bundledParts, "bundled");
collectEnglish(tatoebaParts, "tatoeba");

const definiteErrorPatterns = [
  ["the legacy 'your seeing him' sentence", /I don't think your seeing him is good for you/i],
  ["a missing apostrophe in a negative contraction", /\b(?:dont|doesnt|didnt|cant|couldnt|shouldnt|wouldnt|wont|isnt|arent|wasnt|werent|havent|hasnt|hadnt)\b/i],
  ["could/should/would of", /\b(?:could|should|would) of\b/i],
  ["a fused common phrase", /\b(?:alot|everytime|infront|atleast|aswell)\b/i],
  ["a double comparative", /\b(?:more better|more easier|more faster|more slower|most best)\b/i],
  ["between you and I", /\bbetween you and I\b/i],
  ["discuss about", /\bdiscuss(?:ed|es|ing)? about\b/i],
  ["explain + person without 'to'", /\bexplain(?:ed|s)? (?:me|you|him|her|us|them)\b/i],
  ["look forward to + bare infinitive", /\blook(?:ing)? forward to (?:see|meet|hear|go|visit|talk)\b/i],
  ["suggest + person + to", /\bsuggest(?:ed|s)? (?:me|you|him|her|us|them) to\b/i],
  ["promise + person + to", /\bpromis(?:e|ed|es|ing) (?:me|you|him|her|us|them) to\b/i],
  ["going + a bare verb", /\bgoing (?:do|go|see|make|have|get|take|tell|say|come)\b/i],
  ["wanted + a bare verb", /\bwanted (?:hear|see|do|go|make|have|get|take|tell|say|come)\b/i],
  ["an uncountable noun made plural", /\b(?:informations|advices|furnitures|homeworks|luggages|equipments)\b/i],
  ["bad third-person agreement", /\b(?:he|she|it) (?:don't|are)\b/i],
  ["bad non-third-person agreement", /\b(?:I|you|we|they) (?:doesn't|has)\b/i],
];

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

for (const [label, pattern] of definiteErrorPatterns) {
  const hit = learnerEnglish.find((entry) => pattern.test(entry.text));
  check(`no learner sentence contains ${label}`, !hit, hit && `${hit.location}: ${hit.text}`);
}

const plainLanguageFiles = [
  "src/lib/data.ts",
  "src/lib/expansionPacks.ts",
  "src/lib/phrasebank.ts",
  "src/lib/loanwordPairs.json",
];
const unexplainedGrammarJargon = plainLanguageFiles
  .flatMap((relativePath) => {
    const source = fs.readFileSync(path.join(root, relativePath), "utf8");
    return source.split(/\r?\n/).map((text, index) => ({
      text,
      location: `${relativePath}:${index + 1}`,
    }));
  })
  .find((entry) => /\b(?:reflexive|conjugated)\b/i.test(entry.text));
check(
  "learner tips explain German patterns without unexplained grammar jargon",
  !unexplainedGrammarJargon,
  unexplainedGrammarJargon && `${unexplainedGrammarJargon.location}: ${unexplainedGrammarJargon.text.trim()}`
);

const tatoebaPhrases = Object.values(tatoebaParts).flatMap((part) => part.phrases ?? []);
const translatedByGerman = new Map(tatoebaPhrases.map((phrase) => [phrase.de, phrase.en]));
const expectedCorrections = new Map([
  [
    "Ich glaube nicht, dass es gut für dich ist, ihn zu sehen.",
    "I don't think it's good for you to see him. / I don't think seeing him is good for you.",
  ],
  [
    "Habe ich dir versprochen, dass ich das tun würde?",
    "Did I promise you I'd do that? / Did I promise that I would do that?",
  ],
  ["Ich weiß, dass ich ohne Sie nicht leben kann.", "I know I can't live without you."],
  ["Ich weiß, dass ich ohne dich nicht leben kann.", "I know I can't live without you."],
  ["Ich weiß, dass ich ohne euch nicht leben kann.", "I know I can't live without you."],
  ["Ich wollte nicht, dass das passiert.", "I didn't want that to happen."],
  ["Wenn Sie nicht zu mir kommen, komme ich zu Ihnen.", "If you don't come to me, I'll come to you."],
  ["Wenn ihr nicht zu mir kommt, komme ich zu euch.", "If you don't come to me, I'll come to you."],
  ["Wenn du nicht zu mir kommst, komme ich zu dir.", "If you don't come to me, I'll come to you."],
  ["Von wem haben Sie es, dass Sie das nicht müssen?", "Who told you that you didn't need to do that?"],
  ["Ich will das nicht so machen.", "I don't want to do it that way."],
  ["Ich glaube, dass es wahr ist.", "I believe that's true."],
  ["Ich weiß, dass dir das wichtig ist.", "I know that's important to you."],
  ["Werden wir das nicht tun?", "Aren't we going to do that?"],
  ["Das ist nicht das, was ich gesagt habe.", "That's not what I said."],
  [
    "Das stimmt nicht. Das ist nicht das, was ich gesagt habe.",
    "You're wrong. That isn't what I said.",
  ],
  [
    "Das ist nicht das, was ich hören wollte.",
    "That's not what I wanted to hear. / This isn't what I wanted to hear.",
  ],
  ["Wir sind uns nicht ganz sicher, was es ist.", "We're not exactly sure what it is."],
  ["Sie sollen wissen, dass ich das nicht tun werde.", "You should know that I won't do that."],
]);

for (const [german, english] of expectedCorrections) {
  check(
    `reviewed translation stays natural: ${german}`,
    translatedByGerman.get(german) === english,
    `found ${JSON.stringify(translatedByGerman.get(german))}`
  );
}

check("the audit covers thousands of learner-facing English fields", learnerEnglish.length > 9_000);

if (failures) {
  console.error(`\n${failures} English-content regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\n${learnerEnglish.length.toLocaleString("en-GB")} learner-facing English fields passed QA`);
