const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
    `,
    resolveDir: root,
    sourcefile: "hardcoded-content-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("hardcoded-content-check", module);
compiled.filename = path.join(root, ".hardcoded-content-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { allPartBlueprints, buildApiPartFromResolved } = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const phraseMismatches = [];
const dialogueMismatches = [];
const injectedExamples = [];
const incompleteAuthoredPhrases = [];
const incompleteDialogueLines = [];

for (const [partKey, blueprint] of Object.entries(allPartBlueprints)) {
  const poisonedDictionary = Object.fromEntries(
    (blueprint.seeds ?? []).map((item, index) => [
      item.lookup,
      {
        word: item.lookup,
        pos: "test entry",
        glosses: [item.fallbackEn],
        examples: [`UNREVIEWED DICTIONARY SENTENCE ${partKey} ${index}`],
        exampleTranslations: [`UNREVIEWED DICTIONARY TRANSLATION ${partKey} ${index}`],
      },
    ])
  );
  const built = buildApiPartFromResolved(blueprint, poisonedDictionary);
  const authoredPhrases = blueprint.phrases ?? [];
  const authoredDialogues = blueprint.dialogues ?? [];

  if (JSON.stringify(built.phrases ?? []) !== JSON.stringify(authoredPhrases)) {
    phraseMismatches.push(partKey);
  }
  if (JSON.stringify(built.dialogues ?? []) !== JSON.stringify(authoredDialogues)) {
    dialogueMismatches.push(partKey);
  }
  if ((built.vocab ?? []).some((item) => item.example || item.exampleEn || item.exampleFr)) {
    injectedExamples.push(partKey);
  }

  authoredPhrases.forEach((phrase, index) => {
    if (!phrase?.de?.trim() || !phrase?.en?.trim()) {
      incompleteAuthoredPhrases.push(`${partKey}:${index}`);
    }
  });
  authoredDialogues.forEach((dialogue, dialogueIndex) => {
    (dialogue?.lines ?? []).forEach((line, lineIndex) => {
      if (!line?.de?.trim() || !line?.en?.trim()) {
        incompleteDialogueLines.push(`${partKey}:${dialogueIndex}:${lineIndex}`);
      }
    });
  });
}

check(
  "every blueprint lesson exposes exactly its hardcoded phrases",
  phraseMismatches.length === 0,
  phraseMismatches.slice(0, 8).join(", ")
);
check(
  "every blueprint lesson exposes exactly its hardcoded dialogues",
  dialogueMismatches.length === 0,
  dialogueMismatches.slice(0, 8).join(", ")
);
check(
  "dictionary examples cannot leak through vocabulary rows",
  injectedExamples.length === 0,
  injectedExamples.slice(0, 8).join(", ")
);
check(
  "all hardcoded blueprint phrases include German and English",
  incompleteAuthoredPhrases.length === 0,
  incompleteAuthoredPhrases.slice(0, 8).join(", ")
);
check(
  "all hardcoded dialogue lines include German and English",
  incompleteDialogueLines.length === 0,
  incompleteDialogueLines.slice(0, 8).join(", ")
);

const strongLanguagePack = allPartBlueprints.part29;
const strongLanguagePhrases = new Map(
  (strongLanguagePack?.phrases ?? []).map((phrase) => [phrase.de, phrase])
);
const strongLanguageCoverage = {
  situationDirectedSwearing: [
    "Scheiße, ich habe meinen Schlüssel vergessen.",
    "Was soll der Scheiß?",
    "Das ist echt beschissen gelaufen.",
    "Das war scheiße von mir.",
  ],
  roughReactions: [
    "Willst du mich verarschen?",
    "Du kannst mich mal.",
    "Leck mich.",
  ],
  schwanzInContext: [
    "Der Fuchs hat einen langen, buschigen Schwanz.",
    "Bei einem Mann ist das Wort Schwanz eine vulgäre Bezeichnung für den Penis.",
    "Er hat mir ungefragt ein Bild von seinem Schwanz geschickt.",
    "Jetzt zieht er den Schwanz ein.",
    "Da war kein Schwanz.",
    "Das ist doch nur ein Schwanzvergleich.",
    "Er denkt auch nur mit seinem Schwanz.",
  ],
  insultsAndBoundaries: [
    "Der Typ ist ein Wichser.",
    "Halt jetzt endlich die Klappe.",
    "So redest du nicht mit mir.",
    "Lass mich in Ruhe, sonst hole ich Hilfe.",
  ],
};
const contextualStrongLanguage = Object.values(strongLanguageCoverage).flat();

check(
  "the strong-language pack includes Schwanz as a context-sensitive hardcoded word",
  (strongLanguagePack?.seeds ?? []).some(
    (seed) => seed.de === "der Schwanz" && seed.fallbackEn.includes("tail") && seed.fallbackEn.includes("penis")
  )
);
for (const [area, fixtures] of Object.entries(strongLanguageCoverage)) {
  check(
    `the strong-language pack covers ${area}`,
    fixtures.every((phrase) => strongLanguagePhrases.has(phrase)),
    fixtures.filter((phrase) => !strongLanguagePhrases.has(phrase)).join(" | ")
  );
}
check(
  "every new strong-language sentence explains both register and speaking situation",
  contextualStrongLanguage.every((text) => {
    const phrase = strongLanguagePhrases.get(text);
    return phrase?.use?.trim() && phrase?.when?.trim();
  })
);
check(
  "the strong-language dialogues contrast neutral, idiomatic and vulgar meanings",
  [
    "Ein Wort, drei Bedeutungen (Schwanz in context)",
    "Ein ungefragtes Bild (setting a boundary)",
  ].every((title) => (strongLanguagePack?.dialogues ?? []).some((dialogue) => dialogue.title === title))
);

if (failures) {
  console.error(`\n${failures} hardcoded-content regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`Hardcoded-only sentence assembly is guarded across ${Object.keys(allPartBlueprints).length} blueprint packs`);
