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

// ── British English leads ────────────────────────────────────────────────
// Learners in British mode see the FIRST "/"-segment, so an American-first
// pair shows American to a British learner. Pairs are welcome; order is not
// negotiable. The American form may appear alone only when no British twin
// exists in the string (then it is simply a spelling error, also flagged).
const AMERICAN_LEADS = [
  ["tire", "tyre"], ["tires", "tyres"], ["curb", "kerb"],
  ["aluminum", "aluminium"], ["gray", "grey"], ["color", "colour"],
  ["colors", "colours"], ["favorite", "favourite"], ["favorites", "favourites"],
  ["center", "centre"], ["theater", "theatre"], ["gasoline", "petrol"],
  ["cozy", "cosy"], ["donut", "doughnut"], ["airplane", "aeroplane"],
  ["pajamas", "pyjamas"], ["neighborhood", "neighbourhood"],
  ["apologize", "apologise"], ["organize", "organise"], ["realize", "realise"],
  ["soccer", "football"], ["diaper", "nappy"], ["faucet", "tap"],
  ["zucchini", "courgette"], ["mom", "mum"],
];
const britishFailures = [];
for (const { text, location } of learnerEnglish) {
  const primary = String(text).split("/")[0];
  for (const [american, british] of AMERICAN_LEADS) {
    const wordRe = new RegExp("\\b" + american + "\\b", "i");
    const match = wordRe.exec(primary);
    if (!match) continue;
    // "colour, color" and "football, soccer" glosses are fine: the British
    // form already leads. Only flag when the American form comes FIRST.
    const britishRe = new RegExp("\\b" + british + "\\b", "i");
    const britishMatch = britishRe.exec(primary);
    if (britishMatch && britishMatch.index < match.index) continue;
    // "candy floss"-style glosses list both; the primary segment still must
    // not open with the American form when the British one exists anywhere.
    britishFailures.push(
      location + ": the primary wording uses \"" + american + "\" — British English leads, use \"" + british + "\" first"
    );
  }
}

// ── plural you stays honest ──────────────────────────────────────────────
// German "ihr" carries no headcount. "you two" may survive as a secondary
// alternative, but a PRIMARY "you two" needs zwei/beide in the German.
const youTwoFailures = [];
function collectPairs(value) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) { value.forEach(collectPairs); return; }
  if (typeof value.de === "string" && typeof value.en === "string") {
    const primary = value.en.split("/")[0];
    if (/\byou two\b/i.test(primary)
        && !/\b(zwei|beide|beiden|Paar|P\u00e4rchen|Zwillinge)\b/i.test(value.de)) {
      youTwoFailures.push(
        JSON.stringify(value.de.slice(0, 60)) + ": primary English says \"you two\" but the German counts nobody — lead with \"you all\""
      );
    }
  }
  for (const entry of Object.values(value)) {
    if (entry && typeof entry === "object") collectPairs(entry);
  }
}
collectPairs(allPartBlueprints);
collectPairs(bundledParts);

const definiteErrorPatterns = [
  ["the legacy 'your seeing him' sentence", /I don't think your seeing him is good for you/i],
  ["a literal German hunger or thirst construction", /\bI (?:have|had) (?:hunger|thirst)\b/i],
  ["a German Bock phrase presented as English", /\bI (?:have|had) (?:null )?Bock\b/i],
  ["a literal German service or card label", /\b(?:key service|customer card|tax class|notification card)\b/i],
  ["a literal price question with 'high'", /\bhow high (?:is|are)\b/i],
  ["the literal cheaper-item question", /\bdo you have it cheaper\b/i],
  ["a literal hotel-rate question", /\b(?:what|how much) does the night cost\b|\bwhat is the cost for the night\b|\bhow much is the night\b/i],
  ["literal five-minute arrival wording", /\bI (?:am coming|will come) in five minutes\b/i],
  ["a German food or drink label used as an English sentence", /\b(?:I am ordering a Radler|I am drinking a Mass of beer)\b/i],
  ["a literal relationship or radio-silence construction", /\b(?:I don't have contact with|we have absolute radio silence)\b/i],
  ["literal nursery-place wording", /\b(?:spot in a daycare|searching for a place in a nursery)\b/i],
  ["a literal group-arrival sentence", /\b(?:one comes later|waiting on one more)\b/i],
  ["a literal disagreement or doubt construction", /\b(?:I have to disagree there|I have my doubts there)\b/i],
  ["a literal personal-description construction", /\b(?:sports ace|active against discrimination)\b/i],
  ["the false-friend apple shandy", /\bapple shandy\b/i],
  ["German 'Public Viewing' used as ordinary English", /(?:^|[.!?]\s+|\/\s*)Public viewing\b|\bpub or public viewing\b/i],
  ["literal job-application wording", /\bapplied for the position as\b/i],
  ["literal employment-reference wording", /\b(?:worded benevolently|Good would be)\b/i],
  ["the invented noun 'present-opening'", /\bpresent-opening\b/i],
  ["literal replacement-bus wording", /\bFrom Kassel on it's\b/i],
  ["literal phone-battery wording", /\bphone's about to go\b/i],
  ["literal tracking-number wording", /\btracking number at hand\b/i],
  ["the isolated non-native 'And I?' alternative", /(?:^|\/\s*)And I\?(?:\s*\/|$)/i],
  ["the awkward 'This is for sure' alternative", /\bThis is for sure\b/i],
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

function phrasesFromPart(part) {
  return [
    ...(part?.phrases ?? []),
    ...(part?.dialogues ?? []).flatMap((dialogue) => dialogue?.lines ?? []),
  ];
}

const authoredPhrases = [
  ...Object.values(allPartBlueprints).flatMap(phrasesFromPart),
  ...Object.values(bundledParts).flatMap(phrasesFromPart),
];
const expectedCommonFirst = new Map([
  ["Ich heiße Anna.", "I'm Anna."],
  ["Ich habe Hunger.", "I'm hungry."],
  ["Ich habe Durst.", "I'm thirsty."],
  ["Um wie viel Uhr?", "What time?"],
  ["Ich komme in fünf Minuten.", "I'll be there in five minutes."],
  ["Was kostet die Nacht?", "How much is it per night?"],
  ["Ich habe Bock.", "I'm up for it."],
  ["Ich habe null Bock.", "I really don't feel like it."],
  ["Haben Sie es günstiger?", "Do you have a cheaper one?"],
  ["Sie ist eine echte Sportskanone.", "She's really sporty."],
  ["Wie hoch sind die Kontoführungsgebühren?", "How much are the account fees?"],
  ["Wir suchen einen Platz in einer Kita.", "We're looking for a nursery place."],
  ["Wie hoch ist das Porto für diesen Brief?", "How much is postage for this letter?"],
  ["Ich habe keinen Kontakt mehr zu meinem Vater.", "I'm no longer in contact with my father."],
  ["Wir haben eine absolute Funkstille.", "We're not speaking at all."],
  ["Ich trinke heute eine Apfelschorle.", "I'm having an apple spritzer today."],
  ["Haben Sie die Sendungsnummer zur Hand?", "Do you have the tracking number ready?"],
  ["Ab Kassel ist Schienenersatzverkehr.", "From Kassel onwards, there's a rail-replacement bus service."],
  ["Ich hab mich auf die Stelle als Projektmanagerin beworben.", "I applied for the project manager position."],
  ["Die Bescherung ist bei uns nach dem Essen.", "We open the presents after dinner."],
  ["Ist hier irgendwo eine Steckdose? Mein Handy macht gleich schlapp.", "Is there a socket anywhere? My phone's about to die."],
]);

for (const [german, primaryEnglish] of expectedCommonFirst) {
  const matches = authoredPhrases.filter((phrase) => phrase?.de === german);
  const wrong = matches.find((phrase) => String(phrase?.en ?? "").split(" / ")[0] !== primaryEnglish);
  check(
    `common English comes first for: ${german}`,
    matches.length > 0 && !wrong,
    wrong
      ? `found ${JSON.stringify(wrong.en)}`
      : matches.length === 0
        ? "phrase missing"
        : ""
  );
}

check("the audit covers thousands of learner-facing English fields", learnerEnglish.length > 9_000);

if (failures) {
  console.error(`\n${failures} English-content regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}


if (britishFailures.length || youTwoFailures.length) {
  console.error("FAIL check-english-content (British English rules)");
  britishFailures.forEach((line) => console.error("  " + line));
  youTwoFailures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`\n${learnerEnglish.length.toLocaleString("en-GB")} learner-facing English fields passed QA`);
