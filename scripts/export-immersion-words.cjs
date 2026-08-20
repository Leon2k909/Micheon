#!/usr/bin/env node
/**
 * Rebuild the browser extension's offline glossary from Micheon's authored
 * word catalogue. Keeping this in the repository prevents Immersion from
 * drifting behind Words mode whenever a new pack is added.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const { exampleRank } = require("./gloss-support.cjs");

const root = path.resolve(__dirname, "..");
const destination = path.join(root, "public", "micheon-immersion-extension", "data", "words.json");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildWordCatalog } from "./src/lib/wordSession.ts";',
      'export { buildCatalog } from "./src/session.ts";',
      'export { exampleRequiresSenseOverlap } from "./src/lib/wordExamples.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "immersion-word-export.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("immersion-word-export", module);
compiled.filename = path.join(root, ".immersion-word-export.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints, buildApiPartFromResolved, buildWordCatalog, buildCatalog,
  exampleRequiresSenseOverlap,
} = compiled.exports;
const supplementalWordBank = JSON.parse(
  fs.readFileSync(path.join(root, "src", "lib", "bundledWordBank.json"), "utf8")
);

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try {
    parts[key] = buildApiPartFromResolved(blueprint, {});
  } catch {
    // Match the app's offline fallback: one malformed pack must not erase the
    // rest of the glossary, while the normal content checks report that pack.
  }
}

const idPart = (value) => String(value ?? "")
  .trim()
  .toLocaleLowerCase("de-DE")
  .replace(/[^a-z0-9äöüß]+/gi, "-")
  .replace(/^-+|-+$/g, "") || "word";

/**
 * An example sentence for every word we have one for.
 *
 * The glossary shipped as bare word-to-gloss pairs, which tells you what a
 * word means and nothing about how it is used — and "how is it used" is the
 * whole reason to hover a word on a German page rather than look it up.
 *
 * The sentences come from our own catalogue, not an external corpus. That is
 * deliberate: this content has been through the orthography, punctuation and
 * quality gates, and a wrong example is worse than none because it teaches a
 * construction that is not German.
 *
 * Every sentence containing the word is kept, not just the first, because the
 * choice between them is the whole game: shortest-wins gave Leon a card that
 * read "profile — Wie sieht das Profil aus? / How does the tread look?", when
 * three of our six Profil sentences are about actual profiles. The shortest
 * sentence is only the best one among those that show the right meaning.
 */
const examplesByWord = new Map();
for (const item of buildCatalog(parts)) {
  const de = String(item.de || "").trim();
  const en = String(item.en || "").split(" / ")[0].trim();
  if (!de || !en || de.length > 90) continue;
  for (const token of de.toLocaleLowerCase("de-DE").split(/[^\p{L}\p{N}ß]+/u)) {
    if (token.length < 2) continue;
    let candidates = examplesByWord.get(token);
    if (!candidates) examplesByWord.set(token, (candidates = []));
    candidates.push({ de, en });
  }
}

/**
 * Tatoeba, for the words our own catalogue cannot illustrate.
 *
 * Built separately by build-tatoeba-examples.cjs, which needs 300 MB of
 * exports, so the result is committed and read from here. Our own sentences
 * always win: they are the ones written for this course. Tatoeba only fills
 * gaps, and every entry it fills is marked so the attribution is honest and
 * so a bad one can be traced back to its sentence id.
 */
const tatoebaPath = path.join(root, "src", "data", "tatoebaExamples.json");
const tatoeba = new Map();
if (fs.existsSync(tatoebaPath)) {
  for (const row of JSON.parse(fs.readFileSync(tatoebaPath, "utf8"))) {
    tatoeba.set(row.w, row);
  }
}

/**
 * Function words, which the course never made into vocabulary cards.
 *
 * Micheon teaches und, du, nicht and the rest through the sentences they
 * appear in rather than as standalone flashcards, so they were never in the
 * word catalogue — and therefore never in the glossary. Hovering "und" on a
 * German page did nothing, and "and" on an English page found no German at
 * all, because the reverse index is built from the same list.
 *
 * They stay out of the COLLECTION list, which is a different thing: as
 * unknown-word candidates they buried everything else ("die" 165 times,
 * "und" 168). content-gloss keeps its own STOPWORDS for that. This is only
 * about being able to look one up.
 */
/**
 * Words the extension reported it could not identify.
 *
 * Leon exports the collected list and the English half of it is not noise —
 * it is the point. Those are words he is reading on real pages that Micheon
 * had no German for, so hovering them said nothing. Each one here exists
 * because it actually turned up.
 */
const gapWords = JSON.parse(
  fs.readFileSync(path.join(root, "src", "data", "immersionGaps.json"), "utf8")
);

const functionWords = JSON.parse(
  fs.readFileSync(path.join(root, "src", "data", "functionWords.json"), "utf8")
);

const seen = new Set();
const rows = [];
/**
 * Which example a card gets.
 *
 * Ranked on whether the English side actually shows the meaning the card
 * prints, because a card that glosses a word one way and illustrates it
 * another teaches nothing and confuses the reader who trusted it. Our own
 * sentences win ties, being the ones written for this course and gated as
 * such, but a Tatoeba sentence that demonstrates the word beats one of ours
 * that does not. Shortest wins after that: a hover card has one line.
 *
 * Rank 3 — the sentence is really about a separable verb that merely contains
 * this one — is never shipped. There is no version of "toasting the new job"
 * that teaches stoßen, so that card goes out with no example at all.
 */
function chooseExample(key, cardGloss, fullGloss, headword) {
  const options = [];
  for (const candidate of examplesByWord.get(key) ?? []) {
    options.push({ de: candidate.de, en: candidate.en, ours: true });
  }
  const borrowed = tatoeba.get(key);
  if (borrowed) options.push({ de: borrowed.ex, en: borrowed.exEn, ours: false, id: borrowed.id });

  let best = null;
  for (const option of options) {
    const rank = exampleRank({
      cardGloss,
      fullGloss,
      de: option.de,
      en: option.en,
      headword,
      knows,
    });
    if (rank === 3) continue;
    const scored = { ...option, rank };
    if (!best) { best = scored; continue; }
    if (scored.rank !== best.rank) { if (scored.rank < best.rank) best = scored; continue; }
    if (scored.ours !== best.ours) { if (scored.ours) best = scored; continue; }
    if (scored.de.length < best.de.length) best = scored;
  }
  // Some words are known to have two meanings that share every letter, and
  // the Words tracker already refuses to illustrate those from a sentence
  // whose English agrees with nothing on the card — a cinema showing must not
  // serve "die Vorstellung = idea", "Das ist voll der Hammer" must not serve
  // the tool. That list is authored, reviewed and sitting in the app; the
  // hover card is the same promise to the same reader, so it obeys it too.
  if (best && best.rank === 2 && exampleRequiresSenseOverlap({ de: key, lookup: key })) return {};
  if (!best) return {};
  return best.ours
    ? { ex: best.de, exEn: best.en }
    // "t" means Tatoeba. The hover card credits it, and the id makes any
    // complaint traceable to one sentence rather than to a corpus.
    : { ex: best.de, exEn: best.en, exSrc: "t", exId: best.id };
}

// Combined synonym cards fold "der Wagen" into "das Auto" for lessons and the
// tracker, but a hover glossary must still explain whichever word the page
// actually used — so every absorbed synonym is flattened back into its own
// entry here.
const catalogWords = buildWordCatalog(parts)
  .flatMap((word) => [word, ...(word.synonyms ?? [])]);
const supplementalWords = supplementalWordBank.map((word) => ({
  lookup: word.lookup || word.de,
  de: word.de,
  en: word.en,
}));
// Function words go LAST, so anything the catalogue already teaches keeps its
// authored gloss and only the genuine gaps are filled.
const glossaryWords = [...catalogWords, ...supplementalWords, ...functionWords, ...gapWords];

/**
 * Every word this glossary holds, which is how a guess at a separable verb
 * gets checked: anstoßen is a real word we teach, ansitzen is not.
 */
const known = new Set();
for (const word of glossaryWords) {
  const value = String(word.lookup || word.de).trim().toLocaleLowerCase("de-DE");
  if (value) known.add(value.replace(/^(der|die|das)\s+/, ""));
}
const knows = (value) => known.has(value);

/**
 * A glossary is looked up by the word, not by the word with its article.
 *
 * The catalogue knows this and ships bare lookup keys. The hand-written
 * lists — function words, and the gap list built from Leon's exports — write
 * "die Korrektur" because that is how you teach a noun, and that string went
 * in as the key. Hovering "Korrektur" on a page then found nothing, while
 * "die Nutzung" sat in the file as a second entry beside the catalogue's own
 * "Nutzung". Sixty-six words were unreachable in German that way.
 */
const ARTICLE = /^(der|die|das)\s+/i;
const byKey = new Map();

for (const word of glossaryWords) {
  const de = String(word.lookup || word.de).trim().replace(ARTICLE, "");
  const key = de.toLocaleLowerCase("de-DE");
  if (!de) continue;
  if (seen.has(key)) {
    // The catalogue's authored gloss wins — it was written for this course.
    // But the other name for the same thing is why a reader hovered, so it
    // still has to reach the German: the catalogue calls die Nutzung "use",
    // Leon's pages call it "usage", and both should arrive here.
    const held = byKey.get(key);
    const alternative = String(word.en).split("/")[0].trim();
    if (held && alternative && alternative.toLocaleLowerCase("en") !== held.en.toLocaleLowerCase("en")) {
      const alts = held.enAlt ?? (held.enAlt = []);
      if (!alts.some((value) => value.toLocaleLowerCase("en") === alternative.toLocaleLowerCase("en"))
        && alts.length < 4) {
        alts.push(alternative);
      }
    }
    continue;
  }
  seen.add(key);
  // A hover card needs one clean meaning, not an answer-alternative list —
  // but the alternatives it drops are still meanings this word has, and an
  // example showing one of those is a good deal better than one showing none.
  const cardGloss = String(word.en).split("/")[0].trim();
  const row = {
    id: `vw-${idPart(de)}`,
    de,
    deDisplay: String(word.de).trim(),
    en: cardGloss,
    // "core" marks the everyday word for a meaning, so the English-to-German
    // direction can prefer immer over stets when both gloss as "always".
    ...(word.core ? { core: 1 } : {}),
    ...chooseExample(key, cardGloss, String(word.en), de),
  };
  rows.push(row);
  byKey.set(key, row);
}
// enAlt is written after the row is built, so it has to be appended last or
// it would not survive the spread above.
for (const row of rows) {
  if (row.enAlt && row.enAlt.length === 0) delete row.enAlt;
}

const withExample = rows.filter((row) => row.ex).length;
const borrowedExamples = rows.filter((row) => row.exSrc === "t").length;
console.log(
  `${withExample} of ${rows.length} entries carry an example `
  + `(${borrowedExamples} from Tatoeba), each one chosen because its English `
  + "shows the meaning the card prints."
);

const serialized = JSON.stringify(rows);
if (fs.existsSync(destination) && fs.readFileSync(destination, "utf8") === serialized) {
  console.log(`Micheon Immersion glossary is current (${rows.length} entries).`);
} else {
  fs.writeFileSync(destination, serialized);
  console.log(`Wrote ${rows.length} Micheon Immersion glossary entries.`);
}
