#!/usr/bin/env node
/**
 * A subject goes up, a board goes up under it, and the learner picks out
 * what they would use for that subject.
 *
 * This is the one way into Learn that asks the question a conversation
 * asks — not "what does this phrase mean" but "what do I have for this" —
 * and it only works if the board is honest. Half of it has to belong to the
 * subject and half has to come from somewhere else, the two halves have to
 * look alike, and the subject has to be one the course can actually fill.
 * None of that shows on a screenshot: a board that happens to be all
 * sentences-belong-and-words-don't looks exactly like a good one.
 *
 * So this builds the rounds and holds the rules, and reads the few source
 * lines that put the round where the learner looks for it.
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

function load(entry, name) {
  const built = esbuild.buildSync({
    stdin: { contents: entry, resolveDir: root, sourcefile: `${name}.ts`, loader: "ts" },
    alias: { "@": path.join(root, "src") },
    bundle: true, format: "cjs", platform: "node", target: "node20",
    write: false, logLevel: "silent",
  });
  const mod = new Module(path.join(root, `${name}.cjs`), module);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(built.outputFiles[0].text, path.join(root, `${name}.cjs`));
  return mod.exports;
}

const store = new Map();
global.window = {
  localStorage: {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  },
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
};
global.localStorage = global.window.localStorage;

const { allPartBlueprints } = load('export { allPartBlueprints } from "./src/lib/data.ts";', "tr-bp");
const { buildApiPartFromResolved } = load(
  'export { buildApiPartFromResolved } from "./src/lib/api.ts";', "tr-api");
const {
  TOPICS, TOPIC_ROUND_SIZE, buildTopicRound, gradeTopicRound,
} = load('export * from "./src/lib/topicRounds.ts";', "tr-rounds");
const { setItemStatus } = load('export { setItemStatus } from "./src/lib/activity.ts";', "tr-activity");
const { buildCatalog } = load('export { buildCatalog } from "./src/session.ts";', "tr-session");
const { buildCuratedParts } = load('export { buildCuratedParts } from "./src/lib/contentBank.ts";', "tr-bank");

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// The course as the app holds it: the blueprint packs and the curated
// phrasebank — the "cb-" packs half the subjects are built from — which the
// shell merges in the same way when it loads the catalogue.
const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* not this check's business */ }
}
Object.assign(parts, buildCuratedParts());

// A fixed sequence, so a failure here is a failure tomorrow as well.
const seeded = (seed) => () => {
  seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
  return seed / 4_294_967_296;
};

// ── every subject is made of packs that exist ───────────────────────────────
const missingPacks = TOPICS.flatMap((topic) =>
  topic.packs.filter((pack) => !parts[pack]).map((pack) => `${topic.id}: ${pack}`));
check("every pack a subject names is a pack the course has", missingPacks.length === 0,
  missingPacks.join(", "));

const shared = [];
TOPICS.forEach((topic, index) => {
  for (const other of TOPICS.slice(index + 1)) {
    for (const pack of topic.packs) if (other.packs.includes(pack)) shared.push(`${pack} (${topic.id} and ${other.id})`);
  }
});
check("no pack belongs to two subjects, or its cards would be right and wrong at once",
  shared.length === 0, shared.join(", "));

// ── every subject fills its board, and the board is honest ──────────────────
const textKey = (text) => String(text ?? "").trim().toLowerCase();
for (const topic of TOPICS) {
  const round = buildTopicRound(parts, topic.id, null, seeded(7));
  check(`${topic.id}: the subject fills its half of the board`,
    Boolean(round) && round.wanted === TOPIC_ROUND_SIZE,
    round ? `only ${round.wanted} of ${TOPIC_ROUND_SIZE} belong` : "no round could be built at all");
  if (!round) continue;

  const belongs = round.cards.filter((card) => card.belongs);
  const others = round.cards.filter((card) => !card.belongs);
  check(`${topic.id}: the other half is the same size`, others.length === belongs.length,
    `${belongs.length} belong, ${others.length} do not`);

  const leaked = others.filter((card) => topic.packs.includes(card.packKey));
  check(`${topic.id}: nothing marked as not belonging comes from the subject's own packs`,
    leaked.length === 0, leaked.map((card) => card.de).join(", "));

  const own = belongs.filter((card) => !topic.packs.includes(card.packKey));
  check(`${topic.id}: everything marked as belonging comes from the subject's packs`,
    own.length === 0, own.map((card) => `${card.de} (${card.packKey})`).join(", "));

  const wordsIn = belongs.filter((card) => card.kind === "word").length;
  const wordsOut = others.filter((card) => card.kind === "word").length;
  check(`${topic.id}: the shape of a card gives nothing away`,
    wordsIn === wordsOut,
    `${wordsIn} of the belonging cards are words against ${wordsOut} of the others,`
      + " so a learner can answer by kind instead of by meaning");

  const texts = round.cards.map((card) => textKey(card.de));
  check(`${topic.id}: no line appears on the board twice`,
    new Set(texts).size === texts.length);

  const blank = round.cards.filter((card) => !card.de.trim() || !card.en.trim());
  check(`${topic.id}: every card has both sides`, blank.length === 0,
    blank.map((card) => card.id).join(", "));
}

// ── two deals of one subject are not the same deal ──────────────────────────
const first = buildTopicRound(parts, "food", null, seeded(1));
const second = buildTopicRound(parts, "food", null, seeded(2));
check("asking for a subject twice does not put up the same six cards",
  Boolean(first && second)
    && first.cards.map((card) => card.id).sort().join("|") !== second.cards.map((card) => card.id).sort().join("|"),
  "the board is the first six every time, so the subject is learned as a fixed list");

// ── seen material comes first ───────────────────────────────────────────────
// The round is meant to be recall. Mark every food sentence the learner could
// meet as known and every belonging sentence on the board has to be one of
// them — a board of things the course has not taught yet is a vocabulary test
// wearing a subject's name.
const food = TOPICS.find((topic) => topic.id === "food");
const foodSentences = buildCatalog(parts).filter((item) => food.packs.includes(item.partKey));
const known = new Set();
for (const item of foodSentences) {
  setItemStatus(item.id, "known", null, item.aliases ?? []);
  known.add(item.id);
}
const recall = buildTopicRound(parts, "food", null, seeded(3));
const unseenOnBoard = recall
  ? recall.cards.filter((card) => card.belongs && card.kind === "sentence" && !known.has(card.id))
  : [];
check("what the learner has already met is what the board asks about first",
  Boolean(recall) && unseenOnBoard.length === 0,
  unseenOnBoard.map((card) => card.de).join(", ") || "no round");

// ── the grading says what was found, missed and wrong ───────────────────────
if (first) {
  const picks = new Set([
    ...first.cards.filter((card) => card.belongs).slice(0, 2).map((card) => card.id),
    first.cards.find((card) => !card.belongs).id,
  ]);
  const graded = gradeTopicRound(first, picks);
  check("a check counts found, missed and wrong separately",
    graded.found.length === 2 && graded.missed.length === first.wanted - 2 && graded.wrong.length === 1,
    `found ${graded.found.length}, missed ${graded.missed.length}, wrong ${graded.wrong.length}`);
}

// ── where the learner finds it ──────────────────────────────────────────────
const hub = read("src/components/duo/DuoPathView.tsx");
check("the topic round is on the Learn row",
  hub.includes("onClick={onTopicRound}") && hub.includes('ui("Topic round")'));

const shell = read("src/prototype/NewUiPrototype.tsx");
check("pressing the card opens the round without leaving Learn",
  shell.includes("<TopicRoundView") && /activeView === "path" && topicRoundOpen/.test(shell),
  "the card leads nowhere, or leads out of Learn");
check("opening it asks for the catalogue, which the row itself must never do",
  /const openTopicRound = \(\) => \{\s*requestParts\(\);/.test(shell)
    && !hub.includes("apiParts"),
  "either the round opens on an empty course, or the Learn row now loads the catalogue for everyone");

const view = read("src/components/duo/TopicRoundView.tsx");
check("the board shows the language being learned and keeps the meaning back until the check",
  /\{checked && <span className="np-topic-card-en"/.test(view),
  "a card that shows its meaning is answering its own question");
check("picking cards writes no grade",
  !/setItemStatus|saveGradeStore|recordSuccess|recordStruggle|setItemsStatus/.test(view),
  "recognition with the answers on screen is promoting words the learner could not produce");

// ── in every language the app offers ────────────────────────────────────────
const TABLES = {
  German: "src/lib/i18nDe.ts",
  French: "src/lib/i18nFr.ts",
  Polish: "src/lib/i18nPl.ts",
  Spanish: "src/lib/i18nEs.ts",
  Italian: "src/lib/i18nIt.ts",
  Portuguese: "src/lib/i18nPt.ts",
};
// The subject names and the phrases inside the question are data, not
// ui("...") literals, so the coverage check cannot see them. Held here.
const KEYS = [
  ...TOPICS.map((topic) => topic.label),
  ...TOPICS.map((topic) => topic.about),
  "Topic round",
  "Words for a subject",
  "Which of these would you use when talking about {subject}?",
  "Subject {n} of {total}",
  "Next subject",
  "Try this subject again",
];
for (const [language, file] of Object.entries(TABLES)) {
  const table = read(file);
  const missing = KEYS.filter((key) => !table.includes(`${JSON.stringify(key)}:`));
  check(`the round reads in ${language}`, missing.length === 0,
    missing.length ? `untranslated: ${missing.join(" · ")}` : "");
}

if (failed) {
  console.error(`\n${failed} topic-round check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-topic-rounds: ${TOPICS.length} subjects, each dealing ${TOPIC_ROUND_SIZE} that belong`
  + ` against ${TOPIC_ROUND_SIZE} that do not, with the shape of a card giving nothing away`
);
process.exit(0);
