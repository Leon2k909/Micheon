const path = require("path");
const fs = require("fs");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";
      export { orderParts } from "./src/lib/curriculum.ts";
      export { buildWordCatalog } from "./src/lib/wordSession.ts";
    `,
    resolveDir: root,
    sourcefile: "bilingual-word-gloss-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("bilingual-word-gloss-check", module);
compiled.filename = path.join(root, ".bilingual-word-gloss-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildWordCatalog,
  orderParts,
} = compiled.exports;

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const parts = orderParts({
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
});
const authoredWords = Object.entries(resolvedBlueprints).flatMap(([partKey, part]) =>
  (part?.vocab ?? []).map((word) => ({ ...word, partKey }))
);
const words = buildWordCatalog(parts);

const normalise = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("de-DE")
  .replace(/\([^)]*\)/g, " ")
  .replace(/[^a-z0-9ß\s-]/g, " ")
  .replace(/\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines)\b/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const stemToken = (token) => token.length >= 6
  ? token.replace(/(?:ern|em|en|er|es|e)$/u, "")
  : token;

const looksLikeGermanCopy = (de, en) => {
  const german = normalise(de);
  const firstEnglish = String(en).split(/\s+\/\s+/u)[0];
  // A shared international word with a real English explanation is useful
  // ("BahnCard (railway discount card)"). The broken rows are multi-word
  // German phrases passed off as the English side with no explanation at all.
  if (/\([^)]*[a-z]{3,}(?:\s+[a-z]{3,})*[^)]*\)/i.test(firstEnglish)) return false;
  const english = normalise(firstEnglish);
  if (!german || !english) return false;

  const deTokens = german.split(/\s+/).map(stemToken);
  const enTokens = english.split(/\s+/).map(stemToken);
  if (enTokens.length < 2) return false;
  if (german === english) return true;
  const deSet = new Set(deTokens);
  const shared = enTokens.filter((token) => deSet.has(token)).length;
  return enTokens.length >= 2 && shared / enTokens.length >= 0.8;
};

const authoredBad = authoredWords.filter((word) => looksLikeGermanCopy(word.de, word.en));
const bad = words.filter((word) => looksLikeGermanCopy(word.de, word.en));
const authoredByGerman = new Map(authoredWords.map((word) => [normalise(word.de), word]));
const byGerman = new Map(words.map((word) => [normalise(word.de), word]));

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` - ${detail}` : ""}`);
}

check(
  "authored vocabulary has no multi-word German copy on its English side",
  authoredBad.length === 0,
  authoredBad.slice(0, 30).map((word) => `${word.de} => ${word.en} (${word.partKey})`).join(" | ")
);

for (const [german, expectedEnglish] of [
  ["gleichfalls", "same to you"],
  ["ebenso", "likewise"],
  ["Meinetwegen.", "all right then"],
  ["anbei", "attached"],
]) {
  const word = authoredByGerman.get(normalise(german));
  check(
    `authored ${german} gloss is translated before catalogue filtering`,
    Boolean(word) && normalise(word.en).includes(normalise(expectedEnglish)),
    word ? word.en : "missing authored word"
  );
}

check(
  `all ${words.length.toLocaleString("en-GB")} word cards have a distinct English gloss`,
  bad.length === 0,
  bad.slice(0, 30).map((word) => `${word.de} => ${word.en} (${word.partKey})`).join(" | ")
);

for (const [german, expectedEnglish] of [
  ["freundlich, aber bestimmt", "friendly but firm"],
  ["den Bildschirm teilen", "to share the screen"],
  ["der letzte Preis", "final price"],
  ["quer", "across"],
]) {
  const word = byGerman.get(normalise(german));
  check(
    `${german} has a real English gloss`,
    Boolean(word) && normalise(word.en).includes(normalise(expectedEnglish)),
    word ? word.en : "missing card"
  );
}

const vocabTracker = fs.readFileSync(path.join(root, "src/components/lab/VocabTracker.tsx"), "utf8");
const wordsTracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
for (const [name, source] of [["word and sentence tracker", vocabTracker], ["words tracker", wordsTracker]]) {
  check(
    `${name} shows the language being learned first`,
    source.includes("const learnsEnglish = learningEnglish()")
      && source.includes("const primaryText = learnsEnglish ?")
      && source.includes("const meaningText = learnsEnglish ?")
      && !source.includes("const primaryText = uiIsGerman()")
  );
}
check(
  "conversation usefulness stays available for filtering without a badge on every row",
  vocabTracker.includes("USEFULNESS_FILTERS")
    && !vocabTracker.includes("usefulnessTone")
    && !vocabTracker.includes("usefulness.label")
);

if (failures) {
  console.error(`\n${failures} bilingual word-gloss regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nevery word tracker card has separate German and English sides");
