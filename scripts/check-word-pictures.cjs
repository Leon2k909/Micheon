#!/usr/bin/env node
/**
 * The pictures beside the words.
 *
 * Two things can go wrong here and only one of them is visible while you
 * work. The first is that coverage quietly rots — a re-glossed pack, a
 * tightened matcher, and suddenly half the animals show nothing. The second
 * is worse: a picture that is CONFIDENTLY WRONG, which teaches the wrong
 * word rather than merely failing to help. So this pins a floor under
 * coverage and pins the specific mis-hits that were found and fixed by hand,
 * because every one of them came back through a different route than the
 * last.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
      'export { buildWordCatalog, rankWordCatalog } from "./src/lib/wordSession.ts";',
      'export { wordPicture, WORD_PICTURE_COUNT } from "./src/lib/wordPictures.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "word-pictures-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("word-pictures-check", module);
compiled.filename = path.join(root, ".word-pictures-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildWordCatalog,
  rankWordCatalog,
  wordPicture,
  WORD_PICTURE_COUNT,
} = compiled.exports;

// ── The thing itself, before any catalogue ────────────────────────────────

// Concrete words get one.
assert.strictEqual(wordPicture("apple", "noun"), "🍎", "apple should show an apple");
assert.strictEqual(wordPicture("dog", "noun"), "🐕", "dog should show a dog");
assert.strictEqual(wordPicture("to swim", "verb"), "🏊", "to swim should show swimming");

// Abstractions get none, and that is the design rather than a gap. If these
// ever start returning something, the map has begun decorating instead of
// teaching, and cards like "describe" and "mention" will look identical.
for (const abstract of ["framework", "prerequisite", "extent", "respective", "to constitute"]) {
  assert.strictEqual(
    wordPicture(abstract, abstract.startsWith("to ") ? "verb" : "noun"),
    null,
    `"${abstract}" is abstract and must show nothing`
  );
}

// The part of speech decides the map, so a homograph resolves to its own
// sense: die Fliege is an insect, fliegen is an aeroplane.
assert.strictEqual(wordPicture("fly", "noun"), "🪰", "the noun fly is the insect");
assert.strictEqual(wordPicture("to fly", "verb"), "✈️", "the verb fly is the aeroplane");

// A parenthetical is a disambiguator and must be read BEFORE it is discarded,
// or the two turkeys and the two letters swap places.
assert.strictEqual(wordPicture("turkey (bird)", "noun"), "🦃", "turkey the bird");
assert.strictEqual(wordPicture("Turkey (country)", "noun"), "🇹🇷", "Turkey the country");
assert.strictEqual(
  wordPicture("letter (of the alphabet)", "noun"),
  "🔤",
  "a letter of the alphabet is not an envelope"
);

// The compound fallback reads a head noun — a birthday cake is a cake — but
// must stop at a preposition, where the head noun stops being the word.
assert.strictEqual(wordPicture("birthday cake", "noun"), "🍰", "birthday cake is a cake");
assert.strictEqual(wordPicture("roe deer", "noun"), "🦌", "roe deer is a deer");
assert.strictEqual(
  wordPicture("putting into operation", "noun"),
  null,
  "putting into operation is not surgery — the fallback must not cross 'into'"
);
assert.strictEqual(
  wordPicture("patient with people", "adjective"),
  "😌",
  "someone patient with people is not a crowd"
);

// Mis-hits found by hand against the real catalogue. Each is a different
// route to the same failure, so each keeps its own line.
assert.strictEqual(
  wordPicture("to take / last", "verb"),
  null,
  "dauern is 'to take' in the sense of duration — no grabbing hand"
);
assert.strictEqual(
  wordPicture("single / singly", "adjective"),
  null,
  "einzeln is one-at-a-time, not unmarried"
);
assert.strictEqual(
  wordPicture("square / angular", "adjective"),
  "🔲",
  "eckig is a shape, not a town square"
);
assert.strictEqual(
  wordPicture("to pump iron / to lift", "verb"),
  "🏋️",
  "pumpen is lifting weights, not ironing shirts"
);
assert.strictEqual(
  wordPicture("cling film", "noun"),
  "🥡",
  "Frischhaltefolie is not a motion picture"
);
assert.strictEqual(
  wordPicture("second vote (party)", "noun"),
  null,
  "die Zweitstimme is a ballot, not a party popper"
);

// The compound sweep. Every one of these was a real card in the catalogue
// showing a confidently wrong picture, found by listing the glosses that only
// resolved through their last word. They are pinned individually because each
// arrived by a route the previous fix did not close.
const COMPOUNDS = [
  ["political party", "noun", "🗳️", "not a party popper"],
  ["interested party", "noun", "🧑", "not a party popper either"],
  ["managing director", "noun", "🧑‍💼", "not a film clapperboard"],
  ["debit card", "noun", "💳", "not a playing card"],
  ["library card", "noun", "📚", "not a playing card"],
  ["red card", "noun", "🟥", "not a playing card"],
  ["flower bed", "noun", "🌷", "not somewhere to sleep"],
  ["raised bed", "noun", "🌱", "not somewhere to sleep"],
  ["cheat sheet", "noun", "📝", "not a bedsheet"],
  ["character sheet", "noun", "📋", "not a bedsheet"],
  ["number plate", "noun", "🚗", "not a dinner plate"],
  ["dining car", "noun", "🍽️", "not a road car"],
  ["cycle path", "noun", "🚲", "not a hiking boot"],
  ["career path", "noun", "💼", "not a hiking boot"],
  ["bottle bank", "noun", "♻️", "not a high street bank"],
  ["food bank", "noun", "🥫", "not a high street bank"],
  ["watering can", "noun", "💧", "not a tin can"],
  ["litter tray", "noun", "🐈", "not a serving tray"],
  ["city hall", "noun", "🏛️", "not a doorway"],
  ["capital letter", "noun", "🔤", "not an envelope"],
  ["basic step", "noun", "💃", "not a stepladder"],
  ["main course", "noun", "🍽️", "not a school course"],
  ["blood group", "noun", "🩸", "not a crowd"],
  ["native speaker", "noun", "🗣️", "not a loudspeaker"],
  ["baked goods", "noun", "🥐", "not a cardboard box"],
  ["toilet paper", "noun", "🧻", "not a sheet of A4"],
  ["rain shower", "noun", "🌧️", "not a bathroom shower"],
  ["star sign", "noun", "⭐", "not a road sign"],
  ["clover leaf", "noun", "🍀", "not a generic leaf"],
  ["coffee bean", "noun", "☕", "not a haricot"],
  ["arbitration body", "noun", "⚖️", "not a human body"],
  ["bad luck", "noun", "😖", "emphatically not a four-leaf clover"],
  ["multi-storey car park", "noun", "🅿️", "not a tree"],
  ["bin bag", "noun", "🗑️", "not a handbag"],
  ["wrapping paper", "noun", "🎁", "not a sheet of A4"],
  ["SIM card", "noun", "📱", "not a playing card"],
  ["gym hall", "noun", "🏋️", "not a doorway"],
  ["to tell a lie", "verb", "🤥", "not lying down"],
  ["to let go", "verb", "🤲", "not going for a walk"],
];
for (const [gloss, pos, want, why] of COMPOUNDS) {
  assert.strictEqual(wordPicture(gloss, pos), want, `"${gloss}" is ${why}`);
}

// An adjective reads the adjective map and nothing else. These four each
// share an English word with an unrelated noun, and each used to show that
// noun's picture.
assert.strictEqual(wordPicture("concrete", "adjective"), null, "konkret is specific, not a brick");
assert.strictEqual(wordPicture("present (at hand)", "adjective"), null, "vorliegend is at hand, not a gift");
assert.strictEqual(wordPicture("uniform", "adjective"), null, "einheitlich is consistent, not a necktie");
assert.strictEqual(wordPicture("flat / shallow", "adjective"), null, "flach is a shape, not an apartment");
// ...but the maps that legitimately span both parts of speech still work.
assert.strictEqual(wordPicture("red", "adjective"), "🟥", "colours are listed as adjectives too");
assert.strictEqual(wordPicture("German", "adjective"), "🇩🇪", "nationalities are listed as adjectives too");

// Function words get nothing. "adverb" contains the substring "verb", which
// routed all 210 of them into the verb map and gave "live (broadcast)" the
// house of "to live".
assert.strictEqual(wordPicture("live (broadcast)", "adverb"), null, "an adverb is not a verb");
assert.strictEqual(wordPicture("double / twice as much", "adverb"), null, "an adverb is not a verb");
for (const pos of ["preposition", "conjunction", "connector", "pronoun", "interjection"]) {
  assert.strictEqual(wordPicture("go", pos), null, `a ${pos} takes no picture`);
}
// The genuine verb parts of speech still route to the verb map.
assert.strictEqual(wordPicture("to swim", "verb phrase"), "🏊", "a verb phrase is a verb");
assert.strictEqual(wordPicture("to swim", "spoken verb"), "🏊", "a spoken verb is a verb");

// A slash without spaces still separates senses, so a two-sense gloss is not
// read as a compound: "tax bracket/class" is not a school class.
assert.strictEqual(wordPicture("tax bracket/class", "noun"), null, "tax bracket/class is not a lesson");

// ── Against the whole catalogue ───────────────────────────────────────────

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const parts = { ...resolvedBlueprints, ...buildBundledParts(), ...buildTatoebaParts() };
const catalog = rankWordCatalog(buildWordCatalog(parts));

const withPicture = catalog.filter((word) => wordPicture(word.en, word.pos));
const share = withPicture.length / catalog.length;

// A floor, not a target. Roughly two thirds of the catalogue is abstract
// vocabulary that is meant to come back empty, so the number to defend is
// "the concrete words still have theirs", not "most words have one".
assert.ok(
  share >= 0.3,
  `word pictures cover ${(share * 100).toFixed(1)}% of ${catalog.length} cards; the floor is 30%`
);

// Nouns are where pictures do most of their work.
const nouns = catalog.filter((word) => word.pos === "noun");
const nounShare = nouns.filter((word) => wordPicture(word.en, word.pos)).length / nouns.length;
assert.ok(
  nounShare >= 0.38,
  `nouns are at ${(nounShare * 100).toFixed(1)}%; the floor is 38%`
);

// Named animals and food are the cards Leon asked for by name, so they are
// held to a much higher bar than the catalogue average.
const NAMED = [
  "apple", "banana", "bread", "cheese", "milk", "water", "coffee", "potato",
  "tomato", "dog", "cat", "horse", "cow", "pig", "sheep", "bird", "fish",
  "bear", "fox", "wolf", "elephant", "lion", "mouse", "bee", "butterfly",
  "house", "car", "tree", "flower", "sun", "moon", "star", "rain", "snow",
];
for (const gloss of NAMED) {
  assert.ok(
    wordPicture(gloss, "noun"),
    `"${gloss}" is exactly the kind of word a picture is for and has none`
  );
}

// ── The rendering side ────────────────────────────────────────────────────

// ── The artwork ───────────────────────────────────────────────────────────
//
// The pictures were drawn with the operating system's emoji font to begin
// with. On Windows that is Segoe UI Emoji, and Leon's verdict was "these
// emojis look terrible. nothing like what i was expecting from the git repos"
// — the flat two-tone Windows glyphs look nothing like the illustrated set the
// idea was sold on. They are Twemoji SVGs now, generated by
// scripts/build-word-pictures.cjs and shipped with the app.
//
// Twemoji is CC-BY 4.0. Shipping the artwork without crediting it is a licence
// breach, not an oversight, so the credit is a build-breaking requirement.
const assets = fs.readFileSync(path.join(root, "src/lib/wordPictureAssets.ts"), "utf8");
const assetCount = (assets.match(/^  "/gm) || []).length;
assert.ok(
  assetCount >= 700,
  `only ${assetCount} emoji have artwork; the map uses far more than that`
);

// Every emoji the map can return must have a file, or a card shows a blank
// space where a picture was promised.
const usedEmoji = new Set();
const mapSource = fs.readFileSync(path.join(root, "src/lib/wordPictures.ts"), "utf8");
for (const match of mapSource.matchAll(/:\s*"([^"a-zA-Z0-9 ][^"]*)"/g)) {
  const value = match[1];
  if (value && !/^[\x00-\x7F]*$/.test(value)) usedEmoji.add(value);
}
const withoutArtwork = [...usedEmoji].filter((value) => !assets.includes(JSON.stringify(value) + ":"));
assert.strictEqual(
  withoutArtwork.length,
  0,
  `no artwork generated for: ${withoutArtwork.join(" ")} — rerun npm run build:word-pictures`
);

// The files themselves have to be there, not merely named.
const assetDir = path.join(root, "public/word-pictures");
assert.ok(fs.existsSync(assetDir), "the word-picture artwork directory is missing");
const svgCount = fs.readdirSync(assetDir).filter((name) => name.endsWith(".svg")).length;
assert.ok(
  svgCount >= 700,
  `only ${svgCount} SVGs are shipped; the generator writes one per emoji used`
);

const credits = fs.readFileSync(path.join(root, "src/components/CreditsCard.tsx"), "utf8");
assert.ok(
  credits.includes("Twemoji") && credits.includes("CC BY 4.0"),
  "Twemoji artwork ships without its CC-BY credit"
);
// A fifth of the sentence practice is still Tatoeba's, and CC-BY covers
// adaptations, so editing a sentence does not release the obligation. This
// credit may only come out when the last Tatoeba-derived pack does.
assert.ok(
  credits.includes("Tatoeba") && credits.includes("CC BY 2.0 FR"),
  "Tatoeba sentences still ship, so their CC-BY credit has to as well"
);

const session = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
assert.ok(
  session.includes('? wordPicture(learnEn ? item?.de : item?.en, item?.pos)'),
  "the lesson card must take its picture from the word's own gloss and part of speech, "
  + 'from whichever side of the step the gloss is on in this direction'
);
// The picture is a cue to the MEANING. Showing it while the learner is being
// asked FOR the meaning hands over the answer.
assert.ok(
  session.includes('{picture && phase !== "Translate" && phase !== "TranslateAgain" && ('),
  "the picture must stay off the Translate stages, where it would be the answer"
);
assert.ok(
  session.includes('<div className="fs-picture" aria-hidden="true">')
    && session.includes('<img alt="" draggable={false} src={wordPictureAsset(picture) ?? undefined} />'),
  "the picture is decorative — the word and its meaning are already announced"
);

const tracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
assert.ok(
  tracker.includes("const picture = wordPicture(word.en, word.pos);"),
  "the words tracker shows the same picture as the lesson"
);
assert.ok(
  tracker.includes('className="word-picture w-5 shrink-0"'),
  "the tracker reserves the slot on every row so the list keeps a straight edge"
);

const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
// The artwork is square SVG now, so it is sized rather than typeset. Without
// an explicit size an <img> falls back to its intrinsic dimensions, and a
// Twemoji file is 36x36 — close enough to look deliberate on the tracker row
// and badly wrong on the lesson board, which is exactly the kind of thing
// nobody notices until it ships.
assert.ok(
  /\.fs-picture img \{[^}]*width: 44px[^}]*height: 44px/.test(css),
  "the lesson board's picture has no explicit size"
);
assert.ok(
  /\.word-picture img \{[^}]*width: 18px[^}]*height: 18px/.test(css),
  "the tracker row's picture has no explicit size"
);

console.log(
  `word pictures OK — ${WORD_PICTURE_COUNT} entries cover ${withPicture.length}/${catalog.length} cards `
  + `(${(share * 100).toFixed(1)}%), nouns ${(nounShare * 100).toFixed(1)}%`
);
