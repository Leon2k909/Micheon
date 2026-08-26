#!/usr/bin/env node
/**
 * Regression coverage for two easy-to-teach-wrong homonyms/false friends:
 * German large-number names use the long scale, and Gericht must not borrow a
 * food example when the standalone card teaches the legal sense.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildWordExampleIndex } from "./src/lib/wordExamples.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "number-sense-clarity-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("number-sense-clarity-check", module);
compiled.filename = path.join(root, ".number-sense-clarity-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildWordCatalog,
  buildWordExampleIndex,
} = compiled.exports;

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const parts = {
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
};
const words = buildWordCatalog(parts);
const byLookup = (lookup) => words.find(
  (word) => String(word.lookup).toLocaleLowerCase("de-DE") === lookup.toLocaleLowerCase("de-DE")
);

// Combined synonym cards (wordSynonymGroups.ts) fold same-meaning words into
// one entry, so the canary counts WORDS TAUGHT — faces plus absorbed
// synonyms. A reviewed-sense regression still moves this number; the fold
// alone cannot.
const taughtWords = words.reduce((count, word) => count + 1 + (word.synonyms?.length ?? 0), 0);
// 7413 -> 7464 when parts 535-538 added 53 everyday nouns the catalogue had
// no name for (bathroom, packing, small children, the drawer things). Two of
// the 53 folded into existing synonym cards rather than standing alone. The
// first natural-English review then restored two previously excluded phrase
// cards. The wider authored-gloss audit restored another 51 genuine English
// backs that had previously repeated the German and been silently filtered.
// 7517 -> 7593 in one pass with two causes. 106 seeds were being dropped for
// glossing a German word with the identical English one — der Film, das
// Ticket, der Computer, das Problem, das Update — a rule meant for unfinished
// phrase glosses that instead deleted every word the two languages share; the
// restored cards land as 51 new faces once folds and duplicates settle. And
// parts 539-542 teach 157 words found by two audits: the 137 words of the
// frequency bank that no pack taught (der Euro at rank 29, das Auto at 339),
// and the closed sets with holes in them — twelve of the fourteen counting
// words, Oma, Opa, Onkel, Tante, Cousin, brown, grey and purple. The bank is
// now taught to 2,495 of its 2,502 words, up from 2,351.
// 7753 -> 7845: parts 543 and 544 teach 92 words from the fourth Immersion
// export — the loose adverbs German hangs a sentence on (irgendwann, soeben,
// stattdessen, quasi), the judgements (wahnsinnig, widerlich, edel), ordinary
// things and deeds (das Rätsel, das Zeug, der Unfug, schiefgehen, feststecken),
// and five strong verbs the new principal-parts table needs to point at
// (befehlen, fliehen, geschehen, stechen, zurückkommen). All 92 stand alone;
// none folded into an existing synonym card.
// 7845 -> 8000: parts 545-550 round the inventory to eight thousand with 156
// words read out of the immersion gap list and the extension glossary — news
// and software vocabulary (der Börsengang, die Eilmeldung, das Ratenlimit, der
// Mehrspielermodus) and the ordinary things between them (der Kumpel, die
// Landkarte, die Großtante, das Lehrbuch). 18 of the 156 fold into synonym
// cards that already existed, so the faces move 7,330 -> 7,468 while the words
// taught move by 155: drucken is the one that does not arrive at all, dropped
// by the catalogue's own filters before it becomes a card.
// 8000 -> 8554: parts 561-584 take the TRACKER to eight thousand cards, which
// is the number a learner reads — the inventory had already been rounded, but
// it counts synonyms that share a face and the library still said 7,468. 570
// authored words, every one checked against the built catalogue rather than
// the pack files, so a word already taught under another spelling did not
// count as new: the courtroom and the letting agent, the building site and the
// toolbox, the farm and the wood, the kitchen and the label on the packet, the
// stage, the canvas and the forge. 16 never arrive — the catalogue's own
// filters drop them — and 22 of the 554 that do fold into synonym cards that
// already existed, so the faces move 7,468 -> 8,000 exactly.
// 8554 -> 9056: parts 585-604 teach 502 words read out of an eight-thousand-row
// spreadsheet of German words with their articles. The sheet holds 2,495 words
// spread over 8,000 rows — an adjective once per case ending, a verb once per
// participle form, so froh arrives five times and sagen seven — and 1,696 of
// them the course already taught. 94 of the 502 fold into synonym cards that
// already existed (die Fahrkarte onto das Ticket, downloaden onto
// herunterladen, die Kundin onto der Kunde), so the faces move 8,000 -> 8,406
// while the words taught move by the full 502. Eight more were written and
// then left out rather than shipped dead: the progress id strips umlauts, so
// sägen collides with sagen, träge with die Trage and waschbar with der
// Waschbär, and the second of each pair can never become a card.
// 9056 -> 9153: parts 605-610 stop mining sources and start from the gap.
// Thirty everyday fields were probed with twenty ordinary words each against
// the built catalogue; Naturwissenschaft answered worst at 35 per cent, with
// der Magnet, die Saeure and das Molekuel missing while the kitchen and the
// bathroom were complete. 98 words were written for it, of which 16 fold into
// synonym cards that already existed, so the faces move 8,406 -> 8,488 while
// the words taught move by 97: die Auswertung already had its French.
// 9153 -> 9281: parts 611-617 answer the second-worst field, the sea at 60 per
// cent - der Anker, das Segel and der Leuchtturm all missing. 130 words for
// the ship, the harbour, the water, what lives in it, fishing and diving, and
// what goes wrong out there. 15 fold into synonym cards, so the faces move
// 8,488 -> 8,603.
// 9281 -> 9386: parts 618-624 answer the third-worst field, the trades at 65
// per cent - der Schreiner, der Geselle and die Innung missing while the
// toolbox itself was nearly complete. 112 words for the trades, the German
// apprenticeship, the building site, the workshop, the materials, the verbs a
// quote lists and the invoice that follows. 26 fold into synonym cards, so the
// faces move 8,603 -> 8,689.
// 9386 -> 9492: parts 625-630 answer the mountain and the wood at 70 per cent.
// 107 words for the climb, the way-marking, a night under canvas, the country
// a walk crosses, what lives there, and the weather that turns it dangerous.
// Only 5 fold into existing synonym cards - the highest yield of the six
// blocks, because almost nothing up a mountain has a second name in a course
// written around a town. The faces move 8,689 -> 8,791.
// 9492 -> 9491: die Esse is dropped, the only word this ledger has ever lost.
// It is a smith's hearth, taught in a pack that already teaches die Schmiede
// as "forge", and English has no everyday word for the fire inside a forge as
// distinct from the forge itself — so its gloss had to be "smith's hearth",
// which is a dictionary entry rather than anything a reader would recognise.
// It also happens to be spelled like the plural of das Essen, which is a
// separate fault and fixed separately; a word is not dropped for being awkward
// to count.
// 9492 -> 9574: parts 631-637 answer post and insurance at 75 and 80 per cent.
// 89 words for the counter at the post office, packing a parcel, ordering and
// sending it back, the warehouse behind the shop, a border crossing, the cover
// a German household is expected to have, and the paperwork either side of the
// money. 14 fold into synonym cards, so the faces move 8,790 -> 8,865.
assert.equal(taughtWords, 9573, "the reviewed sense fixes changed the standalone word count");

const million = byLookup("Million");
assert(million, "die Million is missing from the shipped word catalog");
assert.equal(million.en, "million (number)", "die Million lost its disambiguated English gloss");
assert(million.use.includes("1,000,000"), "die Million is missing its numeric anchor");

const bus = byLookup("Bus");
assert(bus, "der Bus is missing from the shipped word catalog");
assert.equal(bus.en, "bus or coach", "the ordinary Bus card was replaced by a game-specific vehicle");
assert(!/battle bus/i.test(bus.en), "the Fortnite Battle Bus leaked into the standalone word answer");

const literature = byLookup("Literatur");
assert(literature, "die Literatur is missing from the shipped word catalog");
assert.equal(literature.en, "literature", "Conversation mode should use the ordinary English word literature");
assert(!/scholarly/i.test(literature.en), "the academic-only Literature gloss leaked into Conversation mode");
assert(/academic literature/i.test(literature.use), "Literatur no longer explains its academic context separately");

const milliard = byLookup("Milliarde");
assert(milliard, "die Milliarde is missing from the shipped word catalog");
assert.equal(milliard.en, "billion", "die Milliarde should require only the English answer billion");
for (const anchor of ["1,000,000", "1,000,000,000", "1,000,000,000,000"]) {
  assert(milliard.use.includes(anchor), `die Milliarde is missing scale anchor ${anchor}`);
}
assert(
  milliard.use.includes("German Billion = English trillion"),
  "die Milliarde does not warn about the German/English Billion false friend"
);

const court = byLookup("Gericht");
assert(court, "das Gericht is missing from the shipped word catalog");
assert.equal(court.en, "court", "the legal Gericht card must not require dish or meal as a second answer");
assert(/food context/i.test(court.use) && /separate meaning/i.test(court.use),
  "the Gericht card does not explain the separate food sense");

const courtExample = buildWordExampleIndex(parts).exampleFor(court);
assert(courtExample, "the legal Gericht card has no reviewed example");
assert(/\bcourt\b/i.test(courtExample.en), `Gericht chose a non-legal example: ${courtExample.en}`);
assert(!/\b(?:dish|dishes|meal|meals)\b/i.test(courtExample.en),
  `Gericht still chose the food example: ${courtExample.en}`);

const numberPack = parts["cb-letters-numbers"];
assert(numberPack, "Letters & Numbers pack is missing");
const phrasePairs = new Map((numberPack.phrases ?? []).map((phrase) => [phrase.de, phrase]));
assert.equal(
  phrasePairs.get("Eine Milliarde entspricht tausend Millionen.")?.en,
  "One billion equals one thousand million.",
  "the billion/Milliarde bridge is missing from the number lesson"
);
assert.equal(
  phrasePairs.get("Eine Billion entspricht tausend Milliarden.")?.en,
  "One trillion equals one thousand billion.",
  "the trillion/Billion bridge is missing from the number lesson"
);

console.log(
  `number and homonym clarity passed: ${words.length} unique word cards; `
  + `Gericht example = ${courtExample.de} / ${courtExample.en}`
);
