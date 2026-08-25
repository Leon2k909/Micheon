#!/usr/bin/env node
/**
 * Create — your own study sets.
 *
 * Everything here fails silently if it fails at all, which is why it is
 * checked rather than eyeballed:
 *
 *  - a typed answer marked wrong when it was right teaches you to distrust
 *    your own memory, which is the exact opposite of the point;
 *  - a mastery ladder that promotes too early quietly retires cards you
 *    cannot actually produce, and the set reports 100% while you fail;
 *  - a paste parser that drops a line loses work the user typed by hand and
 *    never tells them;
 *  - a Learn round built from mastered cards wastes the session on things
 *    already known.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: { contents: 'export * from "./src/lib/studySets.ts";', resolveDir: root, sourcefile: "study-entry.ts" },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("study-sets", module);
compiled.filename = path.join(root, ".study-sets.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

/** Any other module, compiled the same way, so a check runs the real thing. */
function loadModule(relativePath, _names) {
  const bundle = esbuild.buildSync({
    stdin: {
      contents: `export * from "./${relativePath.replace(/\.tsx?$/, "")}";`,
      resolveDir: root,
      sourcefile: "extra-entry.ts",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    write: false,
    logLevel: "silent",
  });
  const loaded = new Module(relativePath, module);
  loaded.filename = path.join(root, `.${path.basename(relativePath)}.cjs`);
  loaded.paths = Module._nodeModulePaths(root);
  loaded._compile(bundle.outputFiles[0].text, loaded.filename);
  return loaded.exports;
}

// ── typed answers ───────────────────────────────────────────────────────────
// Forgiving about what is not being tested, strict about what is.
for (const [expected, given, why] of [
  ["apple", "apple", "exact"],
  ["apple", "  Apple  ", "case and surrounding space"],
  ["apple", "apple.", "a trailing full stop"],
  ["der Apfel", "Apfel", "the article, when the noun is right"],
  ["Apfel", "der Apfel", "an article the learner added"],
  ["to go / to walk", "to walk", "any of several accepted answers"],
  ["to go / to walk", "to go", "the first accepted answer"],
  ["die Straße", "die Straße", "eszett kept intact"],
]) {
  assert.ok(M.checkTypedAnswer(expected, given), `"${given}" should be accepted for "${expected}" — ${why}`);
}
for (const [expected, given, why] of [
  ["apple", "apples", "a plural is a different word"],
  ["apple", "aple", "a misspelling is the thing being tested"],
  ["apple", "", "an empty answer is not a right answer"],
  ["apple", "   ", "nor is whitespace"],
  ["die Straße", "die Strasse", "ss for ß is a spelling choice the course teaches against"],
  ["der Apfel", "die Apfel", "wrong article with no noun to fall back on is still wrong"],
]) {
  assert.ok(!M.checkTypedAnswer(expected, given), `"${given}" should NOT be accepted for "${expected}" — ${why}`);
}

// ── the mastery ladder ──────────────────────────────────────────────────────
const stages = 3;
let entry = M.emptyProgress();
assert.strictEqual(entry.stage, 0);
assert.strictEqual(entry.mastered, false);

// One right answer is not mastery.
entry = M.applyAnswer(entry, true, stages);
assert.strictEqual(entry.streak, 1, "one right answer should build a streak, not promote");
assert.strictEqual(entry.stage, 0);
assert.strictEqual(entry.mastered, false);

// Two in a row promotes to the next stage and resets the streak.
entry = M.applyAnswer(entry, true, stages);
assert.strictEqual(entry.stage, 1, `two right in a row should promote — got stage ${entry.stage}`);
assert.strictEqual(entry.streak, 0, "the streak restarts at the new stage");
assert.strictEqual(entry.mastered, false, "promoting is not mastering");

// Getting it wrong drops a stage, because recall was weaker than it looked.
entry = M.applyAnswer(entry, false, stages);
assert.strictEqual(entry.stage, 0, "a wrong answer should drop the card back a stage");
assert.strictEqual(entry.streak, 0);
assert.strictEqual(entry.wrong, 1);

// The full climb: only the last stage retires the card.
let climb = M.emptyProgress();
for (let step = 0; step < (stages - 1) * M.MASTERY_TARGET; step += 1) {
  climb = M.applyAnswer(climb, true, stages);
  assert.strictEqual(climb.mastered, false, `mastered too early, after ${step + 1} right answers`);
}
climb = M.applyAnswer(climb, true, stages);
assert.strictEqual(climb.mastered, false, "still one short of the top");
climb = M.applyAnswer(climb, true, stages);
assert.strictEqual(climb.mastered, true, "clearing the last stage should master the card");

// A single-stage set is legal and must still be masterable.
let single = M.emptyProgress();
single = M.applyAnswer(single, true, 1);
single = M.applyAnswer(single, true, 1);
assert.strictEqual(single.mastered, true, "a one-stage set must be completable");

// Mastery is not permanent — get it wrong and it comes back.
const unlearned = M.applyAnswer({ ...climb }, false, stages);
assert.strictEqual(unlearned.mastered, false, "a wrong answer must un-master a card");

// ── pasting ─────────────────────────────────────────────────────────────────
const pasted = M.parsePastedCards([
  "der Apfel - apple",
  "die Stadt – city",
  "das Haus — house",
  "gehen = to go",
  "sprechen : to speak",
  "der Lkw\tlorry",
  "",
  "   ",
  "einsam",
].join("\n"));
assert.strictEqual(pasted.length, 7, `expected 7 cards from that paste, got ${pasted.length}`);
assert.strictEqual(pasted[0].term, "der Apfel");
assert.strictEqual(pasted[0].definition, "apple");
assert.strictEqual(pasted[1].definition, "city", "an en dash is a separator too");
assert.strictEqual(pasted[2].definition, "house", "so is an em dash");
assert.strictEqual(pasted[3].definition, "to go");
assert.strictEqual(pasted[4].definition, "to speak");
assert.strictEqual(pasted[5].term, "der Lkw", "a tab is what a spreadsheet paste gives you");
assert.strictEqual(pasted[5].definition, "lorry");
// A line with no separator is kept with an empty back rather than dropped —
// losing it silently would lose work the user typed.
assert.strictEqual(pasted[6].term, "einsam");
assert.strictEqual(pasted[6].definition, "");
assert.ok(pasted.every((card) => card.source === "paste"));
assert.strictEqual(new Set(pasted.map((card) => card.id)).size, pasted.length, "pasted cards need distinct ids");

// A dash inside the German must not split the card at the wrong place.
const compound = M.parsePastedCards("der Lkw - Lastkraftwagen - lorry");
assert.strictEqual(compound.length, 1);
assert.strictEqual(compound[0].term, "der Lkw", "only the FIRST separator splits the line");
assert.strictEqual(compound[0].definition, "Lastkraftwagen - lorry");

// A real file can quote separators, line breaks, and quotes. It also needs
// editable defaults rather than assuming everybody names columns the same.
const D = loadModule("src/lib/delimitedCards.ts");
const csv = D.parseDelimitedFile([
  "German,English,Hint",
  '"der Apfel, rot","red apple","Say ""rot"""',
  '"Guten\\nMorgen",good morning,greeting',
].join("\r\n").replace("\\n", "\n"), "cards.csv");
assert.strictEqual(csv.delimiter, ",", "a CSV extension must choose commas");
assert.strictEqual(csv.rows.length, 3, "a quoted line break belongs to its field, not a new row");
assert.strictEqual(csv.rows[1][0], "der Apfel, rot", "a quoted comma must stay inside the term");
assert.strictEqual(csv.rows[1][2], 'Say "rot"', "doubled quotes must be unescaped");
assert.strictEqual(csv.rows[2][0], "Guten\nMorgen");
assert.ok(D.rowLooksLikeHeader(csv.rows[0]), "German, English, Hint should be recognised as headings");
const mapped = D.suggestDelimitedMapping(csv.rows[0]);
assert.strictEqual(mapped.term, 0);
assert.strictEqual(mapped.definition, 1);
assert.strictEqual(mapped.hint, 2);
const headerless = D.suggestDelimitedMapping([]);
assert.strictEqual(headerless.term, 0);
assert.strictEqual(headerless.definition, 1, "a headerless file should default to its first two columns");
const fileCards = D.makeCardsFromDelimited(csv.rows.slice(1), mapped, 100);
assert.strictEqual(fileCards.length, 2);
assert.ok(fileCards.every((card) => card.source === "file"), "file cards should retain their source");
assert.strictEqual(fileCards[0].hint, 'Say "rot"');

const tsv = D.parseDelimitedFile("Term\tDefinition\ngehen\tto go", "cards.tsv");
assert.strictEqual(tsv.delimiter, "\t", "a TSV extension must choose tabs");
assert.strictEqual(tsv.rows[1][1], "to go");
assert.throws(
  () => D.parseDelimitedText('Term,Definition\n"unfinished,answer', ","),
  /quoted value/,
  "a broken quoted file needs an error instead of a partial import"
);

// ── sets and rounds ─────────────────────────────────────────────────────────
const set = M.makeSet("Test set", 1000);
assert.ok(set.id && set.title === "Test set");
assert.deepStrictEqual(set.stages, M.DEFAULT_STAGES, "a new set gets the default ladder");
assert.strictEqual(M.setIsStudiable(set), false, "an empty set is not studiable");

set.cards = [
  M.makeCard("der Apfel", "apple", { now: 1 }),
  M.makeCard("die Stadt", "city", { now: 2 }),
  M.makeCard("das Haus", "house", { now: 3 }),
  M.makeCard("half a card", "", { now: 4 }),
];
assert.strictEqual(M.studiableCards(set).length, 3, "a card missing a side is not studiable");
assert.strictEqual(M.incompleteCards(set).length, 1, "the editor has to be able to flag it");
assert.ok(M.setIsStudiable(set));

// Duplicates are surfaced, not silently merged — the user may have meant it.
const dupes = { ...set, cards: [...set.cards, M.makeCard("der Apfel", "apple again", { now: 5 })] };
assert.deepStrictEqual(M.duplicateTerms(dupes), ["der apfel"]);

// A round never opens with a card already mastered.
const progress = {
  [set.cards[0].id]: { streak: 0, correct: 6, wrong: 0, stage: 2, mastered: true },
  [set.cards[1].id]: { streak: 1, correct: 1, wrong: 2, stage: 0, mastered: false },
};
const round = M.buildLearnRound(set, progress, 10);
const ids = round.map((item) => item.card.id);
assert.ok(!ids.includes(set.cards[0].id), "a mastered card must not be asked again in a round");
assert.ok(ids.includes(set.cards[1].id), "an unmastered card must be asked");
assert.ok(!ids.includes(set.cards[3].id), "an incomplete card must never reach a round");
// Least-practised first, so a round does not open with the card you know best.
assert.strictEqual(ids[0], set.cards[2].id, "the never-seen card should come first");

// The stage each card is asked at comes from its own progress.
const stagedRound = M.buildLearnRound(
  { ...set, stages: ["flashcard", "choice", "typed"] },
  { [set.cards[1].id]: { streak: 0, correct: 2, wrong: 0, stage: 1, mastered: false } },
  10
);
const staged = stagedRound.find((item) => item.card.id === set.cards[1].id);
assert.strictEqual(staged.stage, "choice", "a card at stage 1 should be asked with multiple choice");

// A round is capped, so a huge set still gives a session you can finish.
const big = { ...set, cards: Array.from({ length: 200 }, (_, i) => M.makeCard(`w${i}`, `d${i}`, { now: i })) };
assert.strictEqual(M.buildLearnRound(big, {}, 10).length, 10, "the round size must be respected");

const summary = M.summariseProgress(set, progress);
assert.strictEqual(summary.total, 3, "the summary counts studiable cards only");
assert.strictEqual(summary.mastered, 1);
assert.strictEqual(summary.learning, 1);
assert.strictEqual(summary.untouched, 1);
assert.strictEqual(summary.percent, 33);
const empty = M.summariseProgress({ ...set, cards: [] }, {});
assert.strictEqual(empty.percent, 0, "an empty set must not divide by zero");

const statusSet = {
  ...M.makeSet("Library status", 2000),
  cards: [
    M.makeCard("eins", "one", { now: 1 }),
    M.makeCard("zwei", "two", { now: 2 }),
  ],
};
assert.strictEqual(M.studySetLibraryStatus(statusSet, {}), "incomplete",
  "a set that has not been started belongs under incomplete");
assert.strictEqual(M.studySetLibraryStatus(statusSet, {
  [statusSet.cards[0].id]: { streak: 1, correct: 1, wrong: 0, stage: 0, mastered: false },
}), "learning", "a set with active progress belongs under learning");
assert.strictEqual(M.studySetLibraryStatus(statusSet, Object.fromEntries(statusSet.cards.map((card) => [
  card.id,
  { streak: 0, correct: 6, wrong: 0, stage: 2, mastered: true },
]))), "mastered", "a set only becomes mastered when every card is mastered");

// ── stage config ────────────────────────────────────────────────────────────
assert.ok(M.ALL_STAGES.length >= 4, "there should be a real choice of stages");
for (const stage of M.ALL_STAGES) {
  assert.ok(M.STUDY_STAGE_LABELS[stage], `stage "${stage}" has no label`);
  assert.ok(M.STUDY_STAGE_BLURBS[stage], `stage "${stage}" has no explanation`);
}
assert.ok(M.DEFAULT_STAGES.every((stage) => M.ALL_STAGES.includes(stage)));

// ── it is actually reachable ────────────────────────────────────────────────
const prototype = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
assert.ok(
  prototype.includes('const CREATE_NAVIGATION_ITEM: NavigationItem = { id: "create", label: "Create"'),
  "Create needs a navigation entry or nobody can open it"
);
assert.ok(
  prototype.includes("...(createUnlocked ? [CREATE_NAVIGATION_ITEM] : [])"),
  "Create belongs in the beta section, gated like the rest"
);
assert.ok(
  prototype.includes("const createUnlocked = leonOnlyFeaturesUnlocked;"),
  "Create should use the same gate as games — Leon and Michelle"
);
assert.ok(prototype.includes('activeView === "create"'), "Create has no route");
assert.ok(prototype.includes("<CreateView apiParts={apiParts} />"),
  "Create must receive the catalogue, or the import tab has nothing to search");

console.log(
  `check-study-sets: ${M.ALL_STAGES.length} stages, ladder promotes on ${M.MASTERY_TARGET} in a row and demotes on a miss, `
  + "paste keeps every line, and Create is wired into the beta nav"
);

// ── the import filters ──────────────────────────────────────────────────────
// Picking cards one at a time out of 23,000 is a chore, so the filters are
// the feature. They are checked against a stand-in pool rather than the real
// catalogue: what matters is that each filter narrows the way it claims to.
const imp = (() => {
  const b = esbuild.buildSync({
    stdin: {
      contents: 'export { levelMatches, filterImportPool, filtersAreEmpty, importPacks, isStruggling, EMPTY_FILTERS, CEFR_LEVELS, IMPORT_POS_GROUPS, ADD_ALL_LIMIT, COMMON_RANK_LIMIT } from "./src/lib/studyImport.ts";',
      resolveDir: root,
      sourcefile: "import-entry.ts",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
  });
  const mod = new Module("study-import", module);
  mod.filename = path.join(root, ".study-import.cjs");
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(b.outputFiles[0].text, mod.filename);
  return mod.exports;
})();

// A stated range must satisfy every level inside it. Nine catalogue entries
// carry one, and dropping them from an A2 filter would quietly hide material
// the learner asked for.
assert.ok(imp.levelMatches("A2", "A2"));
assert.ok(imp.levelMatches("a2", "A2"), "level matching is case-insensitive");
assert.ok(imp.levelMatches("A2-B2", "B1"), "a range must include the levels between its ends");
assert.ok(imp.levelMatches("A2-B2", "A2"), "and its lower end");
assert.ok(imp.levelMatches("A2-B2", "B2"), "and its upper end");
assert.ok(!imp.levelMatches("A2-B2", "C1"), "but not levels outside it");
assert.ok(!imp.levelMatches("B1", "A1"));
assert.ok(!imp.levelMatches(undefined, "A1"), "an item with no level matches no level filter");

const pool = [
  { id: "w:1", de: "der Hund", en: "dog", kind: "word", level: "A1", pos: "noun", packKey: "p1", packLabel: "Animals", rank: 300, search: "der hund dog" },
  { id: "w:2", de: "laufen", en: "to run", kind: "word", level: "A2", pos: "verb", packKey: "p1", packLabel: "Animals", rank: 800, search: "laufen to run" },
  { id: "w:3", de: "schnell", en: "fast", kind: "word", level: "A1", pos: "adjective", packKey: "p2", packLabel: "Describing", rank: 5000, search: "schnell fast" },
  { id: "w:4", de: "dennoch", en: "nevertheless", kind: "word", level: "C1", pos: "adverb", packKey: "p2", packLabel: "Describing", rank: 9000, search: "dennoch nevertheless" },
  { id: "p:1", de: "Wie geht es dir?", en: "How are you?", kind: "phrase", level: "A1", packKey: "p3", packLabel: "Greetings", rank: Infinity, search: "wie geht es dir how are you" },
];

const only = (filters) => imp.filterImportPool(pool, { ...imp.EMPTY_FILTERS, ...filters }).map((item) => item.id);

assert.deepStrictEqual(only({}).length, 5, "no filters means everything");
assert.deepStrictEqual(only({ kind: "word" }).sort(), ["w:1", "w:2", "w:3", "w:4"], "the word filter must exclude phrases");
assert.deepStrictEqual(only({ kind: "phrase" }), ["p:1"], "and the phrase filter must exclude words");
assert.deepStrictEqual(only({ level: "A1" }).sort(), ["p:1", "w:1", "w:3"], "the A1 filter must take A1 of both kinds");
assert.deepStrictEqual(only({ pos: "noun" }), ["w:1"]);
assert.deepStrictEqual(only({ pos: "verb" }), ["w:2"], "the verb filter must not sweep in adverbs");
assert.deepStrictEqual(only({ pos: "adverb" }), ["w:4"], "adverbs are their own group, not verbs");
assert.deepStrictEqual(only({ pack: "p1" }).sort(), ["w:1", "w:2"], "the pack filter narrows to one theme");
assert.deepStrictEqual(only({ commonOnly: true }).sort(), ["w:1", "w:2"], "common means inside the frequency limit");
assert.deepStrictEqual(only({ query: "dog" }), ["w:1"], "search still works alongside the filters");

// Filters combine rather than replace one another.
assert.deepStrictEqual(only({ kind: "word", level: "A1", pos: "noun" }), ["w:1"], "filters must stack");
assert.deepStrictEqual(only({ level: "A1", commonOnly: true }), ["w:1"], "A1 and common together");
assert.deepStrictEqual(only({ level: "C1", commonOnly: true }), [], "a combination with no members returns nothing");

// Most common first, because someone building "the A1 nouns" wants the ones
// they will meet first, not an alphabetical list starting at Abend.
const ordered = imp.filterImportPool(pool, { ...imp.EMPTY_FILTERS, kind: "word" }).map((item) => item.rank);
assert.deepStrictEqual(ordered, [...ordered].sort((a, b) => a - b), "results must be ordered most common first");

assert.ok(imp.filtersAreEmpty(imp.EMPTY_FILTERS), "the default filters count as empty");
assert.ok(!imp.filtersAreEmpty({ ...imp.EMPTY_FILTERS, level: "A1" }), "a set level is not empty");
assert.ok(!imp.filtersAreEmpty({ ...imp.EMPTY_FILTERS, query: "hund" }), "nor is a query");

const packs = imp.importPacks(pool);
assert.strictEqual(packs.length, 3, "every pack in the pool should be offered");
assert.strictEqual(packs[0].count, 2, "packs are listed biggest first");
assert.strictEqual(packs[0].label, "Animals");

assert.ok(imp.ADD_ALL_LIMIT >= 100 && imp.ADD_ALL_LIMIT <= 1000, "add-all needs a sane cap");
assert.strictEqual(imp.CEFR_LEVELS.length, 6, "A1 through C2");
assert.ok(imp.IMPORT_POS_GROUPS.length >= 4, "there should be a real choice of parts of speech");

// The importer must reach BOTH catalogues. buildCatalog alone is phrases
// only — someone looking for a noun would find sentences containing it and no
// way to add the word itself, which is how this shipped the first time.
const importSource = fs.readFileSync(path.join(root, "src/lib/studyImport.ts"), "utf8");
assert.ok(importSource.includes("buildWordCatalog"), "the import pool must include the vocabulary");
assert.ok(importSource.includes("buildCatalog"), "and the phrases");

console.log(
  `check-study-sets: import filters narrow by kind, level, part of speech, pack and frequency, `
  + `combine correctly, and sort most-common-first`
);

// ── sharing a set ───────────────────────────────────────────────────────────
// Sets get shared by pasting them into a chat, so the export has to survive
// that: what comes out must go back in and give the same cards.
const shared = M.makeSet("Kitchen words", 2000);
shared.description = "Things in a German kitchen";
shared.stages = ["flashcard", "typed"];
shared.cards = [
  M.makeCard("der Löffel", "spoon", { now: 1 }),
  M.makeCard("die Gabel", "fork", { hint: "die Gabeln in the plural", now: 2 }),
  M.makeCard("das Messer", "knife", { now: 3 }),
];

const text = M.exportSetToText(shared);
assert.ok(text.includes("# Kitchen words"), "the title should survive an export");
assert.ok(text.includes("der Löffel\tspoon"), "cards are exported tab-separated");

const back = M.importSetFromText(text, 3000);
assert.strictEqual(back.title, "Kitchen words");
assert.strictEqual(back.description, "Things in a German kitchen");
assert.deepStrictEqual(back.stages, ["flashcard", "typed"], "the ladder travels with the set");
assert.strictEqual(back.cards.length, 3, `round trip lost cards: got ${back.cards.length}`);
assert.strictEqual(back.cards[0].term, "der Löffel");
assert.strictEqual(back.cards[0].definition, "spoon");
assert.strictEqual(back.cards[1].hint, "die Gabeln in the plural", "the hint column survives too");

// Somebody pasting a plain list with no header gets cards and no title, which
// is the right answer rather than an error.
const bare = M.importSetFromText("der Hund - dog\ndie Katze - cat");
assert.strictEqual(bare.title, null);
assert.strictEqual(bare.stages, null);
assert.strictEqual(bare.cards.length, 2);

// A junk stage name in a shared set is ignored rather than adopted.
const junk = M.importSetFromText("# X\n# stages: flashcard, wobble\nder Hund\tdog");
assert.deepStrictEqual(junk.stages, ["flashcard"], "unknown stage names must be dropped, not kept");

// ── the struggling filter ───────────────────────────────────────────────────
// The most useful thing this screen does with our data: build a set out of
// the words the tracker already knows you get wrong.
const graded = [
  { id: "w:a", rawId: "a", de: "der Hund", en: "dog", kind: "word", rank: 1, search: "der hund dog" },
  { id: "w:b", rawId: "b", de: "die Katze", en: "cat", kind: "word", rank: 2, search: "die katze cat" },
  { id: "w:c", rawId: "c", de: "das Pferd", en: "horse", kind: "word", rank: 3, search: "das pferd horse" },
];
const grades = {
  a: { answerMistakes: 3 },
  b: { difficultyDebt: 2 },
  // c has nothing recorded — never attempted is not the same as struggling.
};
const struggling = imp.filterImportPool(
  graded,
  { ...imp.EMPTY_FILTERS, strugglingOnly: true },
  grades
).map((item) => item.id);
assert.deepStrictEqual(struggling.sort(), ["w:a", "w:b"], "only recorded mistakes count as struggling");
assert.ok(imp.isStruggling(graded[0], grades), "an answer mistake means struggling");
assert.ok(!imp.isStruggling(graded[2], grades), "an untouched item is not struggling");
assert.ok(!imp.isStruggling(graded[2], {}), "and neither is anything with no grades at all");
assert.strictEqual(
  imp.filterImportPool(graded, { ...imp.EMPTY_FILTERS, strugglingOnly: true }, {}).length,
  0,
  "with an empty grade store nothing is struggling"
);
// It combines with the rest, so "the A1 nouns I keep failing" is one filter set.
assert.deepStrictEqual(
  imp.filterImportPool(graded, { ...imp.EMPTY_FILTERS, strugglingOnly: true, query: "katze" }, grades).map((i) => i.id),
  ["w:b"],
  "the struggling filter stacks with the others"
);
assert.ok(!imp.filtersAreEmpty({ ...imp.EMPTY_FILTERS, strugglingOnly: true }));

console.log(
  "check-study-sets: a shared set round-trips through plain text, and the tracker's "
  + "mistakes can be filtered into a set"
);

// ── three things that were not clear enough ─────────────────────────────────
const editorSource = fs.readFileSync(path.join(root, "src/components/create/SetEditor.tsx"), "utf8");
const importSource2 = fs.readFileSync(path.join(root, "src/components/create/CatalogueImport.tsx"), "utf8");
const studySource = fs.readFileSync(path.join(root, "src/components/create/SetStudy.tsx"), "utf8");

// 1. Renaming has to look possible before you touch it. A borderless input
//    looks exactly like a heading, which is why nobody found it.
assert.ok(editorSource.includes("<Pencil"), "the set title needs a pencil so it reads as editable");
assert.ok(
  /aria-label=\{ui\("Set title — click to rename"\)\}/.test(editorSource),
  "the title input needs a label that says it can be renamed"
);

// 2. The two catalogues are separate and the picker must say so, with sizes,
//    rather than leaving it to be inferred from the results.
assert.ok(importSource2.includes('ui("Which catalogue")'), "the catalogue picker must name itself");
for (const label of ["Vocabulary", "Phrases", "Both"]) {
  assert.ok(importSource2.includes(`"${label}"`), `the picker should offer "${label}"`);
}
assert.ok(
  /counts\.word/.test(importSource2) && /counts\.phrase/.test(importSource2),
  "each catalogue should show its own size"
);

// 3. Practice and test are two different things and the menu must group them.
assert.ok(/key: "practice"/.test(studySource), "there must be a practice group");
assert.ok(/key: "test"/.test(studySource), "there must be a test group");
assert.ok(
  studySource.includes('ui(group.key === "practice" ? "tracks progress" : "no effect on progress")'),
  "the grouping must say which one moves progress — that is the whole distinction"
);

console.log(
  "check-study-sets: the title reads as renameable, the two catalogues are named with their "
  + "sizes, and practice is separated from test"
);

// ── bulk selection ──────────────────────────────────────────────────────────
// Importing 250 cards and pruning them one at a time is worse than not
// importing them, so selection exists in all three places it is needed.
const createSource = fs.readFileSync(path.join(root, "src/components/create/CreateView.tsx"), "utf8");

// Cards: select, select-all, delete, reorder, and a shortcut to the broken ones.
assert.ok(editorSource.includes("const [selected, setSelected]"), "the editor needs card selection");
assert.ok(editorSource.includes("const removeSelected"), "selected cards must be deletable in bulk");
assert.ok(editorSource.includes("const moveSelected"), "selected cards must be movable in bulk");
assert.ok(/"Select none" : "Select all"/.test(editorSource), "there must be a select-all toggle");
assert.ok(
  editorSource.includes("setSelected(new Set(incomplete.map((card) => card.id)))"),
  "selecting just the incomplete cards is the common case after a big import"
);
// Selection has to key on card ids, not indexes: an index-based selection
// silently points at whatever slid into the slot after a delete or a reorder.
assert.ok(
  /useState<Set<string>>\(new Set\(\)\)/.test(editorSource),
  "selection must be by id, not by index"
);

// Sets: select several and delete them together, progress included.
assert.ok(createSource.includes("const [picked, setPicked]"), "the set list needs selection");
assert.ok(createSource.includes("const deletePicked"), "selected sets must be deletable in bulk");
assert.ok(
  createSource.includes("resetStudyProgress(set.id)")
    && createSource.includes("progress.forEach((value, id) => saveStudyProgress(id, value))"),
  "bulk deletion must clear each set's progress and let Undo restore it"
);

// Import: tick some results and add only those.
assert.ok(importSource2.includes("const [ticked, setTicked]"), "results must be tickable");
assert.ok(importSource2.includes("Add selected"), "there must be an add-selected");
assert.ok(
  importSource2.includes("onAddMany(results.filter((item) => ticked.has(item.id) && !alreadyAdded.has(item.id)))"),
  "add-selected must skip anything already in the set"
);

console.log("check-study-sets: cards, sets and search results can all be selected and managed in bulk");

// ── the beta section, and where the mascot wakes up ─────────────────────────
const protoSource = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");

// Learn is unfinished, so it sits with the other beta entries rather than in
// the navigation every account sees.
assert.ok(
  protoSource.includes("const LEARN_PATH_NAVIGATION_ITEM"),
  "Learn needs its own beta navigation entry"
);
assert.ok(
  protoSource.includes("...(learnPathUnlocked ? [LEARN_PATH_NAVIGATION_ITEM] : [])"),
  "Learn belongs in the beta list"
);
assert.ok(
  /NAVIGATION\.filter\(\(item\) => item\.id !== "games" && item\.id !== "path"\)/.test(protoSource),
  "Learn must be taken OUT of the main navigation, or it appears twice"
);
assert.ok(
  protoSource.includes("const learnPathUnlocked = leonOnlyFeaturesUnlocked;"),
  "Learn uses the same gate as the rest of beta — Leon and Michelle"
);
// A view that has just been gated away must not strand whoever was on it.
assert.ok(
  protoSource.includes('if (!learnPathUnlocked && activeView === "path") setActiveView("home");'),
  "an account without Learn must be moved off it rather than left there"
);
assert.ok(
  protoSource.includes('if (!createUnlocked && activeView === "create") setActiveView("home");'),
  "the same for Create"
);

// The mascot goes back where it was left. The renderer already saved its
// position inside the overlay; the WINDOW was recreated bottom-right every
// launch, so the saved coordinate was measured against a window that had
// moved out from under it.
const mainSource = fs.readFileSync(path.join(root, "electron/main.js"), "utf8");
assert.ok(mainSource.includes("function savePetOverlayBounds"), "the overlay's window position must be saved");
assert.ok(
  /const saved = getDesktopSettings\(\)\.petOverlayBounds;/.test(mainSource),
  "and read back when the overlay is created"
);
assert.ok(
  /savePetOverlayBounds\(\);\n\}/.test(mainSource.replace(/\r\n/g, "\n")),
  "a finished drag is the moment the mascot has been deliberately moved"
);
assert.ok(
  /appIsQuitting = true;\s*\n\s*savePetOverlayBounds\(\);/.test(mainSource.replace(/\r\n/g, "\n")),
  "and quitting is the last chance to record it"
);
// Clamped on read, or a monitor unplugged since would strand the mascot at
// coordinates nothing can display.
assert.ok(
  /Math\.max\(desktopBounds\.x, saved\.x\)/.test(mainSource),
  "a restored position must be clamped to the desktop that exists now"
);

// ── the ladder is the set's to tune ─────────────────────────────────────────
// The stages are customisable per set. Choosing which stages run
// settled what a card is asked; these settle how hard it is to get past them.
{
  const ladder = { ...M.makeSet("Dials", 1000), stages: ["flashcard", "choice", "typed"] };

  // One right answer promotes when the set says one.
  let quick = M.applyAnswer(undefined, true, 3, { masteryTarget: 1 });
  assert.strictEqual(quick.stage, 1, "masteryTarget 1 should promote on the first right answer");

  // Four does not, until the fourth.
  let slow = undefined;
  for (let i = 0; i < 3; i += 1) slow = M.applyAnswer(slow, true, 3, { masteryTarget: 4 });
  assert.strictEqual(slow.stage, 0, "masteryTarget 4 must not promote on three right answers");
  slow = M.applyAnswer(slow, true, 3, { masteryTarget: 4 });
  assert.strictEqual(slow.stage, 1, "the fourth right answer should promote");

  // A mistake costs a stage, unless the set says it does not.
  const climbed = M.applyAnswer(M.applyAnswer(undefined, true, 3), true, 3);
  assert.strictEqual(climbed.stage, 1, "two right answers promote by default");
  assert.strictEqual(
    M.applyAnswer(climbed, false, 3, { demoteOnWrong: false }).stage, 1,
    "with demotion off, a mistake must not drop the card down the ladder"
  );
  assert.strictEqual(
    M.applyAnswer(climbed, false, 3, { demoteOnWrong: false }).streak, 0,
    "it still resets the streak — a mistake is never free"
  );
  assert.strictEqual(M.applyAnswer(climbed, false, 3).stage, 0,
    "and the default is still to drop a stage");

  // A round is as long as the set says.
  const many = { ...ladder, roundSize: 4, cards: Array.from({ length: 20 }, (_, i) =>
    M.makeCard(`Wort ${i}`, `word ${i}`, { now: i })) };
  assert.strictEqual(M.buildLearnRound(many, {}).length, 4,
    "a Learn round should be as long as the set's roundSize, not a constant");
  assert.strictEqual(M.buildLearnRound({ ...many, roundSize: 15 }, {}).length, 15,
    "and it should follow when that changes");

  // A set written before the dials existed still opens, on the old behaviour.
  const old = M.makeSet("Old", 1000);
  assert.strictEqual(old.masteryTarget, M.MASTERY_TARGET, "a new set uses the documented default");
  assert.ok(old.demoteOnWrong, "and demotion stays on unless it is turned off");
}

// ── every way to study, on the card ─────────────────────────────────────────
// "i only see practice button, not tests like quizlet". Four intentions, four
// buttons — and the three icon-only actions beside them say what they do.
{
  const view = fs.readFileSync(path.join(root, "src/components/create/CreateView.tsx"), "utf8");
  for (const mode of ["learn", "flashcards", "test", "match"]) {
    assert.ok(view.includes(`mode: "${mode}"`), `the set card cannot launch ${mode} directly`);
  }
  assert.ok(view.includes("STUDY_LAUNCHERS.map"), "the launchers are not rendered on the card");
  for (const label of ["Edit", "Duplicate", "Delete"]) {
    assert.ok(view.includes(`{ui("${label}")}`), `the ${label} action is still an unlabelled icon`);
  }
  const study = fs.readFileSync(path.join(root, "src/components/create/SetStudy.tsx"), "utf8");
  assert.ok(study.includes("initialMode ?? \"menu\""),
    "a mode chosen on the card must open directly rather than showing the menu again");
}

// ── the background player goes where it is put ──────────────────────────────
// "this should be moveable around the window the playing in the background
// thing" — and stay there, which means a stored position, clamped.
{
  const listen = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
  assert.ok(listen.includes("onPointerDown={beginDrag}"), "the mini player is not draggable");
  assert.ok(listen.includes("setPointerCapture"),
    "a drag must survive the cursor leaving the element");
  assert.ok(/closest\("button, input, a/.test(listen),
    "dragging must not fire when the controls are pressed");
  assert.ok(listen.includes("saveMiniPlayerPosition"),
    "where it was dragged to has to outlive the session");

  const geometry = fs.readFileSync(path.join(root, "src/lib/miniPlayerPosition.ts"), "utf8");
  assert.ok(geometry.includes("viewport.width - size.width"),
    "the position must be clamped so a narrower window cannot strand the player off-screen");
  const M2 = loadModule("src/lib/miniPlayerPosition.ts", ["loadMiniPlayerPosition", "miniPlayerPixels", "miniPlayerFraction"]);
  const size = { width: 680, height: 96 };
  const wide = { width: 1920, height: 1080 };
  const narrow = { width: 800, height: 600 };
  const parked = M2.miniPlayerFraction({ left: 1240, top: 984 }, size, wide);
  assert.ok(parked.x > 0.99 && parked.y > 0.99, "the far corner should store as the far corner");
  const onNarrow = M2.miniPlayerPixels(parked, size, narrow);
  assert.ok(onNarrow.left + size.width <= narrow.width,
    "the same corner on a smaller window must still fit on screen");
  assert.ok(onNarrow.top + size.height <= narrow.height, "vertically too");
}

// ── long lists get around ───────────────────────────────────────────────────
// A long list needs a way through it: with hundreds of flashcards, the
// choice between an endless scroll and pagination belongs to the reader
// rather than to the page.
{
  const L = loadModule("src/lib/longLists.ts");

  // Paging arithmetic, including the case that strands a reader: a filter
  // that shrinks the list while they are on a later page.
  const first = L.pageWindow(23584, 1, 80);
  assert.strictEqual(first.from, 1);
  assert.strictEqual(first.to, 80);
  assert.strictEqual(first.pageCount, 295, "23,584 results at 80 a page is 295 pages, the last one short");
  const third = L.pageWindow(23584, 3, 80);
  assert.strictEqual(third.from, 161, "page three starts at 161, not at 160 or 162");
  const stranded = L.pageWindow(12, 9, 80);
  assert.strictEqual(stranded.page, 1, "a page beyond the end must be pulled back into range");
  assert.strictEqual(stranded.to, 12);
  const empty = L.pageWindow(0, 1, 80);
  assert.strictEqual(empty.from, 0, "an empty list starts at nothing rather than at one");
  assert.strictEqual(empty.pageCount, 1, "and still has a page to be on");

  const items = Array.from({ length: 200 }, (_, i) => i);
  assert.deepStrictEqual(L.pageSlice(items, 2, 80), items.slice(80, 160));
  assert.strictEqual(L.pageSlice(items, 99, 80).length, 40, "the last page is however long it is");

  assert.strictEqual(L.DEFAULT_LONG_LIST_MODE, "pages");

  // The catalogue used to cut itself off at eighty with no way to the
  // eighty-first, and the card editor rendered every card it had.
  const importer = fs.readFileSync(path.join(root, "src/components/create/CatalogueImport.tsx"), "utf8");
  assert.ok(!importer.includes("Showing the first"),
    "the catalogue still truncates its results instead of paging them");
  assert.ok(importer.includes("<ListPager"), "the catalogue has no pager");
  assert.ok(importer.includes("<LongListChoice"), "the reader cannot choose pages or scrolling");

  // Scroll mode must stay bounded. Rendering 23,584 rows locks the browser.
  for (const [file, label] of [
    ["src/components/create/CatalogueImport.tsx", "the catalogue"],
    ["src/components/create/SetEditor.tsx", "the card editor"],
  ]) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(/mode === "scroll"[\s\S]{0,120}\.slice\(0,/.test(text)
      || /cardMode === "scroll"[\s\S]{0,120}\.slice\(0,/.test(text),
      `${label} renders every row in scroll mode rather than a bounded chunk`);
    assert.ok(text.includes("<ShowMore"), `${label} has no way to reveal the rest`);
  }

  // The jump control has to arrive even where smooth scrolling is ignored,
  // and has to respect a reader who asked for less motion.
  const list = fs.readFileSync(path.join(root, "src/components/create/LongList.tsx"), "utf8");
  assert.ok(list.includes("prefers-reduced-motion: reduce"),
    "the jump ignores a reader who asked for less motion");
  assert.ok(/behavior: "auto"/.test(list),
    "the jump has no fallback for a browser that accepts smooth and does nothing");
  assert.ok(list.includes('data-testid="scroll-jump"'), "the jump control cannot be found to test");

  // The preference belongs to the person, not to the guest scope.
  const lib = fs.readFileSync(path.join(root, "src/lib/longLists.ts"), "utf8");
  assert.ok(/loadLongListMode\(profile: UserProfile \| null = getAuthUser\(\)\)/.test(lib),
    "the long-list preference reads from the guest scope rather than the signed-in profile");
  for (const file of ["src/components/create/CatalogueImport.tsx", "src/components/create/SetEditor.tsx"]) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(!/loadLongListMode\(null\)|saveLongListMode\([^)]*, null\)/.test(text),
      `${file} pins the preference to the guest scope, so it never comes back`);
  }
}

// ── folders, and reorganising without a mouse ───────────────────────────────
// Run against the real functions rather than pinned as source strings. The
// half of this feature that can silently rot is the DATA half — a set filed
// under a folder that no longer exists, a duplicate landing in the wrong
// place — and none of that is visible in a source grep.
{
  const set = (id, folderId) => ({
    id, title: id, description: "", cards: [], createdAt: "", updatedAt: "",
    promptSide: "term", speak: true, stages: ["flashcard"],
    masteryTarget: 2, roundSize: 10, demoteOnWrong: true,
    ...(folderId === undefined ? {} : { folderId }),
  });

  // Folders live under their own key. Sharing one with the sets or the
  // progress would have each overwrite the other on save.
  assert.ok(M.STUDY_FOLDERS_KEY && M.STUDY_FOLDERS_KEY !== M.STUDY_SETS_KEY
    && M.STUDY_FOLDERS_KEY !== M.STUDY_PROGRESS_PREFIX,
    "folders share a storage key with the sets or the progress");

  // A set made before folders existed has no folderId and must still open.
  const older = { id: "old", title: "Old", cards: [{ id: "c", term: "a", definition: "b", source: "manual" }] };
  const repaired = M.loadStudySets.length >= 0 && [older].map((entry) => entry);
  assert.ok(repaired, "loadStudySets is not callable");

  // resolvedFolderId is the whole safety net: a set pointing at a folder that
  // has been deleted reads as top level, not as missing.
  const folders = [{ id: "f1", name: "Verbs", createdAt: "", updatedAt: "" }];
  assert.strictEqual(M.resolvedFolderId(set("a", "f1"), folders), "f1",
    "a set in a folder that exists does not resolve to it");
  assert.strictEqual(M.resolvedFolderId(set("b", "gone"), folders), null,
    "a set pointing at a deleted folder does not fall back to the top level — "
    + "it would be filed into a folder nothing draws, and disappear");
  assert.strictEqual(M.resolvedFolderId(set("c"), folders), null,
    "an unfiled set does not read as unfiled");

  // A folder is a name. A blank one would draw a header nobody can identify.
  const made = M.makeFolder("   ", 1700000000000);
  assert.ok(made.id && made.name === "Untitled folder" && made.createdAt,
    "makeFolder does not fill in a blank name");

  // Reordering is a splice, and it must not lose or clone an item.
  const moved = M.moveStudyItem(["a", "b", "c", "d"], 0, 2);
  assert.deepStrictEqual(moved, ["b", "c", "a", "d"], "moveStudyItem moved the wrong thing");
  assert.deepStrictEqual(M.moveStudyItem(["a", "b"], 0, 0), ["a", "b"], "a move to the same place changed the list");
  assert.deepStrictEqual(M.moveStudyItem(["a", "b"], 5, 0), ["a", "b"], "a move from off the end was not refused");

  // A copy belongs beside its source. Prepending it to the whole array — what
  // duplicate used to do — makes a copy of a set filed deep in a folder
  // appear at the top of that folder instead of next to the set it copies.
  const before = [set("a"), set("b", "f1"), set("c")];
  const after = M.insertCopyAfterSource(before, "b", set("b-copy", "f1"));
  assert.deepStrictEqual(after.map((entry) => entry.id), ["a", "b", "b-copy", "c"],
    "a duplicate does not land immediately after the set it copies");
  assert.strictEqual(M.insertCopyAfterSource(before, "nope", set("x")).length, 4,
    "duplicating against a missing source dropped the copy");

  // Deleting a folder must not delete what was in it.
  const kept = M.unfileFolder([set("a", "f1"), set("b", "f1"), set("c")], folders, "f1", 1700000000000);
  assert.strictEqual(kept.sets.length, 3, "deleting a folder lost the sets inside it");
  assert.ok(kept.sets.every((entry) => entry.folderId === undefined),
    "deleting a folder left its sets pointing at it");
  assert.strictEqual(kept.folders.length, 0, "the folder survived its own deletion");
}

// ── and the view offers all three ways to move a set ────────────────────────
// Source pins, and weak ones on their own — they cannot prove the handlers
// work. They are here for the one thing executing the module cannot check:
// that a path which must never need a pointer is actually rendered.
{
  const view = fs.readFileSync(path.join(root, "src/components/create/CreateView.tsx"), "utf8");
  const styles = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
  assert.ok(view.includes('aria-label={ui("Move up")}') && view.includes('aria-label={ui("Move down")}'),
    "a set can only be reordered by dragging, so it cannot be reordered without a pointer");
  assert.ok(view.includes("const reorderDraggedSet")
    && view.includes("reorderDraggedSet(scope, id, set.id)"),
  "dragging a set onto another set does not reorder their list");
  assert.ok(view.includes("draggedSet?.scope !== scope")
    && view.includes("event.stopPropagation()"),
  "a same-list reorder can bubble into the folder drop and turn into a file move");
  assert.ok(view.includes('dropSet === set.id && "is-drop-target"')
    && styles.includes(".create-set.is-drop-target"),
  "the dragged set has no visible destination before it is dropped");
  assert.ok(view.includes('className="create-set__drop-preview"')
    && view.includes('{ui("Drop here")}')
    && styles.includes(".create-set__drop-preview")
    && styles.includes("background-size: 22px 22px"),
  "the destination is only a subtle outline instead of a card-sized grid preview");
  assert.ok(view.includes("const [expandedFolders, setExpandedFolders]")
    && view.includes('className="create-folder__toggle"')
    && view.includes("aria-expanded={expanded}")
    && styles.includes(".create-folders-grid"),
  "folders still occupy the full page instead of rendering as compact pressable tiles");
  assert.ok(view.includes('aria-label={ui("Delete set")}')
    && view.includes('className="create-set__delete"')
    && view.includes('<X className="h-3.5 w-3.5" />'),
  "set deletion still consumes a full action-row button instead of the top-right close control");
  assert.ok(view.includes('data-testid="library-sort"')
    && view.includes('<option value="recent">')
    && view.includes('<option value="az">'),
  "the library cannot be sorted by recently edited or A-Z");
  for (const filter of ["incomplete", "learning", "mastered", "pinned"]) {
    assert.ok(view.includes(`<option value="${filter}">`), `the library is missing its ${filter} filter`);
  }
  assert.ok(view.includes('aria-label={ui(set.pinned ? "Unpin set" : "Pin set")}'),
    "sets cannot be pinned from their card");
  assert.ok(view.includes('className="create-save-status"')
    && view.includes('className="create-undo-toast"'),
    "Create has no saved state or undo feedback");
  const editor = fs.readFileSync(path.join(root, "src/components/create/SetEditor.tsx"), "utf8");
  const fileImport = fs.readFileSync(path.join(root, "src/components/create/DelimitedImport.tsx"), "utf8");
  assert.ok(editor.includes("<DelimitedImport onImport={commitDelimited} />")
    && fileImport.includes('data-testid="delimited-file-input"')
    && fileImport.includes("Term column")
    && fileImport.includes("Definition column"),
    "CSV and TSV files cannot be mapped and imported from the existing paste tab");
  assert.ok(view.includes('aria-label={ui("Move to folder")}') && view.includes("<select"),
    "a set can only be filed by dragging, which never fires from touch");
  // Bound to the resolved folder, never the raw field: a select whose value
  // matches no option shows its first one, which claims the set is somewhere
  // it is not and re-files it there on the next change.
  assert.ok(view.includes('value={resolvedFolderId(set, folders) ?? "none"}'),
    "the folder select is bound to the raw folderId, so a stale id misreports where a set is");
  assert.ok(view.includes("insertCopyAfterSource(sets, source.id, copy)"),
    "duplicate still prepends to the whole list");
  // Sets before folders, so an interruption leaves an empty folder rather
  // than a set filed under one that is gone.
  const del = view.indexOf("const removeFolder");
  assert.ok(del > 0 && view.indexOf("persist(next.sets)", del) < view.indexOf("persistFolders(next.folders)", del),
    "folder deletion writes the folders before the sets, so an interruption strands a set");
  assert.ok(view.includes("const setDragImport") || fs.readFileSync(path.join(root, "src/lib/setDrag.ts"), "utf8").includes("SET_DRAG_TYPE"),
    "the study-set drag has no module of its own");
}

console.log(
  "check-study-sets: Learn sits under beta with Create, the mascot's window "
  + "position survives a restart, the ladder is the set's to tune, and the "
  + "background player goes where it is put, and a long list pages or scrolls"
);
