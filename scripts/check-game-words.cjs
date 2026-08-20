#!/usr/bin/env node
/**
 * A game that says "Spell this word" must be given a word.
 *
 * Word Snake drew its word bank from buildCatalog — the PHRASE course. That
 * would be obvious on screen if a sentence arrived looking like a sentence,
 * but gameLetters() strips spaces and punctuation first, so it arrives as one
 * unbroken run of letters. The board asked for
 * "Selbstverständlich. Sollen wir uns auf ein Safeword einigen?" as a 42-tile
 * row, and the worst entry in the catalogue would have been 134 tiles.
 *
 * The trap is that the phrase catalogue LOOKS like a plausible source, and
 * useGameDeck's "words" mode looks like the filter that fixes it. It is not:
 * of 16,308 phrase entries only 47 contain no space, and every one of those is
 * an interjection — "Mist!", "Verdammt!", "Hallöchen!". Filtering leaves a
 * spelling game with 47 swearwords. The vocabulary is a different array
 * (part.vocab, read by buildWordCatalog) and that is the only correct source.
 *
 * So this checks both halves: that the word source really yields words, and
 * that the three spelling games are still wired to it.
 */
const assert = require("assert");
const fs = require("fs");
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
      'export { buildCatalog } from "./src/session.ts";',
      'export { buildGameWords, gameLetters } from "./src/games/gameContent.tsx";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "game-words-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("game-words", module);
compiled.filename = path.join(root, ".game-words.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

const resolved = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);
const parts = { ...resolved, ...M.buildBundledParts(), ...M.buildTatoebaParts() };

// ── the source really is vocabulary ───────────────────────────────────────
const words = M.buildGameWords(parts, "learn-de");

assert.ok(
  words.length >= 6000,
  `the spelling games need a real word bank — got ${words.length}, expected at least 6,000. `
  + "47 would mean it has been repointed at the phrase catalogue."
);

// Not one of them may be a sentence, however it got here.
const spaced = words.filter((word) => /\s/.test(word.spelling));
assert.strictEqual(
  spaced.length,
  0,
  `${spaced.length} entries carry a space: ${spaced.slice(0, 3).map((w) => JSON.stringify(w.spelling)).join(", ")}`
);

// A tile row has to fit a board twenty columns wide.
const overlong = words.filter((word) => word.letters.length > 20 || word.letters.length < 2);
assert.strictEqual(
  overlong.length,
  0,
  `${overlong.length} entries are unspellable on a 20-wide board, longest `
  + `${Math.max(0, ...overlong.map((w) => w.letters.length))}: `
  + overlong.slice(0, 3).map((w) => w.spelling).join(", ")
);

// The article is split off rather than spelled, which is what the "Include
// Articles" toggle switches back on. If it stayed glued to the noun the
// toggle would do nothing and every noun would start DER/DIE/DAS.
const apple = words.find((word) => word.spelling === "Apfel");
assert.ok(apple, "der Apfel should be in the word bank");
assert.strictEqual(apple.article, "der", "the article belongs in its own field, not in the spelling");
assert.strictEqual(apple.clue, "apple", "the clue is the English side");
const articled = words.filter((word) => word.article).length;
assert.ok(articled >= 4000, `only ${articled} words kept their article; expected 4,000+`);

// No German noun is spelled with its article still attached.
const glued = words.filter((word) => /^(der|die|das)\s/i.test(word.de) && /^(DER|DIE|DAS)/.test(word.letters.join("")) && word.article === undefined);
assert.strictEqual(glued.length, 0, "a noun kept its article inside the spelling");

// ── and the phrase catalogue is still the wrong source ────────────────────
// Kept as live evidence rather than a comment: if someone repoints a spelling
// game at buildCatalog, these numbers are why it broke.
const phrases = M.buildCatalog(parts);
const phraseSingles = phrases.filter((item) => !/\s/.test(String(item.de || "").trim()));
assert.ok(
  phraseSingles.length < 200,
  `the phrase catalogue now has ${phraseSingles.length} single-word entries — if it has become a `
  + "real word source this check's reasoning needs revisiting"
);
const longestPhrase = Math.max(...phrases.map((item) => M.gameLetters(String(item.de || "")).length));
assert.ok(
  longestPhrase > 100,
  `expected the phrase catalogue to contain entries far too long to spell; longest is ${longestPhrase}`
);

// ── the games are wired to it ─────────────────────────────────────────────
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const snake = read("src/games/SnakeGame.tsx");
assert.ok(
  /words:\s*wordCatalogue/.test(snake) && /wordCatalogue\.map/.test(snake),
  "SnakeGame's word bank must be built from the vocabulary, not from trackerEntries"
);
assert.ok(
  !/trackerEntries\s*$\s*\.map\(\(entry\) => \(\{\s*de: entry\.letters/m.test(snake),
  "SnakeGame is mapping phrase entries into its word bank again"
);

for (const file of ["src/games/FallingLetters.tsx", "src/games/WhackAMole.tsx"]) {
  const source = read(file);
  assert.ok(
    source.includes("useGameWordDeck()"),
    `${file} spells a target letter by letter, so it must draw from useGameWordDeck()`
  );
  assert.ok(
    !source.includes('useGameDeck("letters")'),
    `${file} is back on the phrase catalogue — "letters" mode only bounds the LENGTH, not the word count`
  );
}

// ── the settings panel stays a panel ──────────────────────────────────────
// It used to be an inline block at the full width of the content column,
// which both stretched a narrow list of toggles across the screen and pushed
// the board itself below the fold every time it opened.
assert.ok(
  /fixed inset-0 z-\[110\][^"]*flex items-center justify-center/.test(snake),
  "the Word Snake settings panel must be an overlay, not a block in the flow"
);
assert.ok(
  /max-w-sm max-h-\[80vh\]/.test(snake),
  "the settings panel needs its width and height capped"
);

console.log(
  `check-game-words: ${words.length.toLocaleString()} spellable words (${articled.toLocaleString()} with articles), `
  + `none longer than 20 tiles; 3 spelling games wired to the vocabulary, not the ${phrases.length.toLocaleString()}-entry phrase course`
);
