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
      export { primaryEnglishMeaning, primaryGermanMeaning } from "./src/lib/germanTextMatch.ts";
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
  primaryEnglishMeaning,
  primaryGermanMeaning,
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
    // Asked of courseSides() rather than of a learning-English boolean: with
    // three courses the first line is not "English or German", it is whichever
    // language this course teaches.
    //
    // The second line used to be picked with `meaning.code === "de" ? de : en`,
    // which answered English for everything that was not German. The meaning
    // column follows the app's language now, so it is asked for rather than
    // chosen between — otherwise the tracker labels a line Polish and shows
    // English underneath it.
    source.includes("courseSides()")
      && /const primaryText = (french \?\? \()?learnsEnglish \?|const primaryText = french \?\?/.test(source)
      && /const meaningText = meaningTextFor\(/.test(source)
      && !source.includes("const primaryText = uiIsGerman()")
  );
}
check(
  "conversation usefulness stays available for filtering without a badge on every row",
  vocabTracker.includes("USEFULNESS_FILTERS")
    && !vocabTracker.includes("usefulnessTone")
    && !vocabTracker.includes("usefulness.label")
);

// What the card actually shows, swept across the whole catalogue. A gloss
// whose brackets balance must still balance once the first sense is taken
// from it: a card ending mid-note is the visible half of a bad split.
const bracketsBalance = (value) => {
  let depth = 0;
  for (const character of String(value ?? "")) {
    if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
};
const cutMidNote = [];
for (const word of words) {
  for (const [side, shown] of [
    [word.en, primaryEnglishMeaning(String(word.en ?? ""))],
    [word.de, primaryGermanMeaning(String(word.de ?? ""))],
  ]) {
    if (side && bracketsBalance(side) && !bracketsBalance(shown)) {
      cutMidNote.push(`${word.de} => ${shown}`);
    }
  }
}
check(
  `no card of ${words.length} is shown with a bracket left open`,
  cutMidNote.length === 0,
  cutMidNote.slice(0, 20).join(" | ")
);
// Where the two languages share the word, the card leads with the shared
// word. A learner who already owns fantastic should be handed it, not set to
// memorise a synonym for a word they know — and the free win is most of what
// makes a cognate worth teaching at all.
//
// The catalogue does this everywhere: romantic, logical, chaotic, optimistic,
// realistic, practical, relevant, tolerant, active, creative, normal, modern,
// interesting, nervous, correct, perfect, direct, flexible, stable. One card
// glossed fantastisch as incredible and was the only one out of step.
//
// Listed rather than derived, because the family is full of words that only
// look shared, and the catalogue is careful about those too — eventuell is
// possibly and says NOT eventually, sensibel is sensitive and says NOT
// sensible, brav is well-behaved and says NOT brave. A rule that guessed
// from spelling would break exactly those cards.
const COGNATE_LEADS = [
  ["fantastisch", "fantastic"],
  ["romantisch", "romantic"],
  ["logisch", "logical"],
  ["chaotisch", "chaotic"],
  ["optimistisch", "optimistic"],
  ["realistisch", "realistic"],
  ["praktisch", "practical"],
  ["relevant", "relevant"],
  ["tolerant", "tolerant"],
  ["aktiv", "active"],
  ["kreativ", "creative"],
  ["nervös", "nervous"],
  ["korrekt", "correct"],
  ["perfekt", "perfect"],
  ["direkt", "direct"],
  ["interessant", "interesting"],
];
const cognateMisses = [];
for (const [german, shared] of COGNATE_LEADS) {
  const word = byGerman.get(normalise(german));
  if (!word) continue;
  if (!normalise(word.en).startsWith(normalise(shared))) {
    cognateMisses.push(`${german} => ${word.en} (expected ${shared})`);
  }
}
check(
  `all ${COGNATE_LEADS.length} shared words are taught as the shared word`,
  cognateMisses.length === 0,
  cognateMisses.join(" | ")
);
// The first word of a gloss is the one the card shows and the one the
// learner will carry away, so it has to be a word they will actually hear
// said. Bookish is not wrong — it is just unusable: nobody answers how are
// you with listless, and a learner who learns it that way has been handed a
// word with no situations in it.
//
// Only the LEAD is refused, never the gloss. A rare word sitting behind a
// plain one is doing useful work, which is why feststellen keeps ascertain
// after to determine, and beginnen keeps commence after to begin.
const BOOKISH_ENGLISH = [
  "listless", "indolent", "torpid", "languid", "enervated", "slothful",
  "wan", "pallid", "doleful", "lugubrious", "disconsolate", "querulous",
  "taciturn", "garrulous", "loquacious", "obstreperous", "recalcitrant",
  "obdurate", "intransigent", "peevish", "irksome", "wearisome",
  "perspicacious", "munificent", "parsimonious", "penurious", "impecunious",
  "salubrious", "fortuitous", "propitious", "egregious", "vexatious",
  "plethora", "surfeit", "paucity", "assiduous", "diffident", "voluble",
  "truculent", "saturnine", "phlegmatic", "choleric",
  // Alive only inside one fixed phrase (in all its splendour), which is not
  // a gloss a learner can use anywhere else.
  "splendour", "splendor",
];
const BOOKISH_LEAD = new RegExp(`^(?:to\\s+|a\\s+|an\\s+|the\\s+)?(?:${BOOKISH_ENGLISH.join("|")})\\b`, "i");
const bookishLeads = [];
for (const word of words) {
  const first = String(word.en ?? "").split(/\s+\/\s+|[,;]|\s+or\s+/i)[0].trim();
  if (BOOKISH_LEAD.test(first)) bookishLeads.push(`${word.de} => ${word.en}`);
}
check(
  "no card leads its meaning with a word nobody says out loud",
  bookishLeads.length === 0,
  bookishLeads.slice(0, 12).join(" | ")
);
if (failures) {
  console.error(`\n${failures} bilingual word-gloss regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nevery word tracker card has separate German and English sides");
