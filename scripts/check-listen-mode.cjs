/**
 * Listen mode: passive exposure must stay passive.
 *
 * The whole promise of the Listen tab is that grading there is damped: the
 * learner can press Know it on a hundred sentences while cooking and their
 * lesson queue must not notice. These checks run the REAL grading and queue
 * functions against the real catalogue and assert the damping from both
 * sides — what a listen grade writes, and what it must never write.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

// ── a browser-shaped world, before the modules load ─────────────────────
const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};
// Some modules read the bare `localStorage` global rather than
// window.localStorage (getLessonContent does) — mirror it.
global.localStorage = global.window.localStorage;

const result = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildListenQueue, formatListenPetCaption, recordListenGrade, setListenReviewLevel, undoListenReviewChange, snoozeListenItem, getListenBackgroundPlayback, setListenBackgroundPlayback, getListenPetBilingualCaptions, setListenPetBilingualCaptions, getListenContentSource, setListenContentSource, getListenQueueOrder, setListenQueueOrder, getListenCurrentItemId, setListenCurrentItemId, getListenGermanRepeats, setListenGermanRepeats, getListenEnglishRepeats, setListenEnglishRepeats, getListenLanguageOrder, setListenLanguageOrder, getListenLoopItems, setListenLoopItems, getListenLoopPasses, setListenLoopPasses, listenQueueIndexForPlayhead, listenPlayheadForQueueIndex, listenLoopPassForPlayhead, getListenNextCardDelayMs, setListenNextCardDelayMs, DEFAULT_GERMAN_REPEATS, DEFAULT_ENGLISH_REPEATS, DEFAULT_LISTEN_LANGUAGE_ORDER, DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS, DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS, DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER, DEFAULT_LISTEN_CONTENT_SOURCE, DEFAULT_LISTEN_QUEUE_ORDER, DEFAULT_LISTEN_LOOP_ITEMS, DEFAULT_LISTEN_LOOP_PASSES, DEFAULT_NEXT_CARD_DELAY_MS, listenCountForId } from "./src/lib/listenMode.ts";',
      'export { loadGradeStore, saveGradeStore, statusForId, COMPLETED_KEY } from "./src/lib/activity.ts";',
      'export { recordSuccess, isDueForReview } from "./src/lib/memoryStrength.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { WORD_ID_PREFIX, buildWordCatalog } from "./src/lib/wordSession.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "listen-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("listen-check", module);
compiled.filename = path.join(root, ".listen-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  buildListenQueue, formatListenPetCaption, recordListenGrade, setListenReviewLevel, undoListenReviewChange, snoozeListenItem,
  getListenBackgroundPlayback, setListenBackgroundPlayback,
  getListenPetBilingualCaptions, setListenPetBilingualCaptions,
  getListenContentSource, setListenContentSource,
  getListenQueueOrder, setListenQueueOrder,
  getListenCurrentItemId, setListenCurrentItemId,
  getListenGermanRepeats, setListenGermanRepeats,
  getListenEnglishRepeats, setListenEnglishRepeats,
  getListenLanguageOrder, setListenLanguageOrder,
  getListenLoopItems, setListenLoopItems,
  getListenLoopPasses, setListenLoopPasses,
  listenQueueIndexForPlayhead, listenPlayheadForQueueIndex, listenLoopPassForPlayhead,
  getListenNextCardDelayMs, setListenNextCardDelayMs,
  DEFAULT_GERMAN_REPEATS, DEFAULT_ENGLISH_REPEATS, DEFAULT_LISTEN_LANGUAGE_ORDER,
  DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS, DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS,
  DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER, DEFAULT_LISTEN_CONTENT_SOURCE,
  DEFAULT_LISTEN_QUEUE_ORDER, DEFAULT_LISTEN_LOOP_ITEMS,
  DEFAULT_LISTEN_LOOP_PASSES, DEFAULT_NEXT_CARD_DELAY_MS,
  listenCountForId, buildWordCatalog,
  loadGradeStore, statusForId, COMPLETED_KEY,
  recordSuccess,
  allPartBlueprints, buildApiPartFromResolved, WORD_ID_PREFIX,
} = compiled.exports;

const GRADES_KEY = `${COMPLETED_KEY}:default`;
const seedGrades = (store) => stored.set(GRADES_KEY, JSON.stringify(store));
const readGrades = () => JSON.parse(stored.get(GRADES_KEY) ?? "{}");

const parts = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(bp, {}); } catch { /* skip malformed */ }
}

// ── damped grading, all four branches ───────────────────────────────────
stored.clear();
recordListenGrade({ id: "sent-1", aliases: [] }, "know", null);
let grades = readGrades();
check("listen-know on a NEW item leaves it new to the lesson queue",
  statusForId(grades, "sent-1") === "new");
check("listen-know on a NEW item stamps the exposure counter",
  grades["sent-1"]?.listens === 1 && typeof grades["sent-1"]?.listenedAt === "string");
check("listen-know on a NEW item sets no mastery grade and no review date",
  grades["sent-1"]?.lastGrade === undefined && grades["sent-1"]?.dueAt === undefined);

stored.clear();
const knownRecord = recordSuccess(recordSuccess(undefined, Date.now() - 3 * 864e5), Date.now() - 864e5);
seedGrades({ "sent-2": knownRecord });
recordListenGrade({ id: "sent-2", aliases: [] }, "know", null);
grades = readGrades();
check("listen-know on a KNOWN item moves neither ladder rung nor due date",
  grades["sent-2"].successes === knownRecord.successes
  && grades["sent-2"].intervalDays === knownRecord.intervalDays
  && grades["sent-2"].dueAt === knownRecord.dueAt);
check("listen-know on a KNOWN item records the reinforcement stamp",
  typeof grades["sent-2"].reinforcedAt === "string" && grades["sent-2"].listens === 1);

stored.clear();
recordListenGrade({ id: "sent-3", aliases: [] }, "difficult", null);
grades = readGrades();
check("listen-difficult on a NEW item flags a real struggle (teach-me-first, not progress)",
  statusForId(grades, "sent-3") === "struggle");

stored.clear();
seedGrades({ "sent-4": knownRecord });
recordListenGrade({ id: "sent-4", aliases: [] }, "difficult", null);
grades = readGrades();
check("listen-difficult on a KNOWN item keeps the ladder intact",
  statusForId(grades, "sent-4") === "known"
  && grades["sent-4"].successes === knownRecord.successes
  && grades["sent-4"].dueAt === knownRecord.dueAt);
check("listen-difficult on a KNOWN item leaves the same debt signal a mistake would",
  grades["sent-4"].difficultyDebt === 1 && typeof grades["sent-4"].lastMistakeAt === "string");

stored.clear();
seedGrades({ "legacy-id": { lastGrade: "know", successes: 3, intervalDays: 10, dueAt: knownRecord.dueAt } });
recordListenGrade({ id: "canonical-id", aliases: ["legacy-id"] }, "know", null);
grades = readGrades();
check("a listen grade folds legacy alias records into the canonical id like every other grade write",
  grades["canonical-id"] !== undefined && grades["legacy-id"] === undefined);
check("the exposure count is readable back through aliases",
  listenCountForId(grades, "canonical-id") === 1);

stored.clear();
seedGrades({ "legacy-manual-level": { lastGrade: "struggle", listens: 2 } });
const reviewChange = setListenReviewLevel({ id: "manual-level", aliases: ["legacy-manual-level"] }, 5, null, Date.now());
grades = readGrades();
check("an explicit Listen level correction can set Mastered",
  grades["manual-level"]?.lastGrade === "know"
  && grades["manual-level"]?.successes === 5
  && grades["manual-level"]?.intervalDays === 180
  && grades["legacy-manual-level"] === undefined);
undoListenReviewChange(reviewChange, null);
grades = readGrades();
check("an explicit Listen level correction can restore the exact prior tracker record",
  grades["manual-level"] === undefined
  && grades["legacy-manual-level"]?.lastGrade === "struggle"
  && grades["legacy-manual-level"]?.listens === 2);
setListenReviewLevel({ id: "manual-level", aliases: [] }, "new", null, Date.now());
check("an explicit Listen level correction can reset an item to New",
  readGrades()["manual-level"] === undefined);

stored.clear();
snoozeListenItem({ id: "listen-snooze", aliases: [] }, 7, null, Date.now());
grades = readGrades();
check("Listen can genuinely put an item off",
  Date.parse(grades["listen-snooze"]?.snoozedUntil ?? "") > Date.now() + 6 * 864e5);

// ── the queue: right content, right order, snooze honoured ──────────────
stored.clear();
let queue = buildListenQueue(parts, {});
check("the default queue combines sentence and word trackers",
  DEFAULT_LISTEN_CONTENT_SOURCE === "mixed"
  && queue.some((item) => item.kind === "sentence")
  && queue.some((item) => item.kind === "word")
  && queue.slice(0, 40).some((item) => item.kind === "word"));
check("the default queue genuinely uses shared popularity order",
  DEFAULT_LISTEN_QUEUE_ORDER === "common"
  && buildListenQueue(parts, {}, { contentSource: "sentences", order: "common" })
    .slice(0, 200)
    .every((item, index, rows) => index === 0 || rows[index - 1].popularity <= item.popularity));

queue = buildListenQueue(parts, {}, { contentSource: "sentences", order: "common" });
check("sentence source only serves sentence-tracker ids", queue.length > 1000
  && queue.every((item) => item.kind === "sentence" && !item.id.startsWith(WORD_ID_PREFIX)));

queue = buildListenQueue(parts, {}, { contentSource: "words", order: "common" });
check("words mode fills the queue from the word catalogue under vw- ids",
  queue.length > 1000 && queue.every((item) => item.kind === "word" && item.id.startsWith(WORD_ID_PREFIX)));

queue = buildListenQueue(parts, {}, { contentSource: "mixed", order: "common" });
check("mixed mode interleaves words among sentences rather than appending them",
  queue.some((item) => item.kind === "word")
  && queue.some((item) => item.kind === "sentence")
  && queue.slice(0, 40).some((item) => item.kind === "word")
  && queue.slice(0, 200).every((item, index, rows) =>
    index === 0 || rows[index - 1].popularity <= item.popularity));

const commonSentences = buildListenQueue(parts, {}, { contentSource: "sentences", order: "common" });
check("Listen never exposes the context-only ‘Ist er heute?’ dialogue fragment",
  !commonSentences.some((item) => item.de === "Ist er heute?" || item.en === "Is it today?")
  && commonSentences.some((item) => item.de === "Ist der Termin heute?" && item.en === "Is the appointment today?"));
const heardFirstFour = Object.fromEntries(commonSentences.slice(0, 4).map((item) => [
  item.id,
  { listens: 4, listenedAt: new Date().toISOString() },
]));
queue = buildListenQueue(parts, heardFirstFour, { contentSource: "sentences", order: "least-heard" });
check("least-heard order genuinely rotates material with less Listen exposure to the front",
  queue[0]?.id === commonSentences[4]?.id);

// ── newly added content has to be reachable, not just present ───────────
// The complaint this order exists for: words added from real reading were in
// the queue but never heard. "Most common first" ranks words by the bundled
// frequency bank, and a word the bank has never ranked sorts behind every word
// it has — so the newest content sat ~90% of the way down a 20,000-item queue.
// Presence is not the promise; being reached is. Assert the reach, not the
// membership, or this regresses silently the moment ranking changes again.
const newestWords = buildListenQueue(parts, {}, { contentSource: "words", order: "newest" });
const commonWords = buildListenQueue(parts, {}, { contentSource: "words", order: "common" });
const positionIn = (queue, id) => queue.findIndex((item) => item.id === id);
// Measured, not asserted by eye: the median item of the newest-first head sits
// past 90% of the most-common-first queue. Deliberately a median and not an
// "every" — a newly added pack can legitimately hold a very common word, and
// one such word ranking early under both orders is correct, not a regression.
// Measured from the buried side, not the newest side. Earlier versions
// asserted "the newest words sit deep in the most-common order" — true when
// new packs held niche words, inverted the day the frequency-bank packs
// (part476+) arrived, because the newest content became the MOST common
// words. The promise was never about the newest words being obscure; it is
// that material most-common-first buries is still actually reached. So:
// take everything in the back 10% of the common order and assert newest-first
// serves it from the front half. If newest-first ever degenerates into
// most-common-first, buried material keeps its >90% position and every
// threshold fails at once.
const newestPositions = new Map(newestWords.map((item, index) => [item.id, index]));
const buriedByCommon = commonWords
  .map((item, position) => ({ item, position }))
  .filter(({ position }) => position > commonWords.length * 0.9)
  .map(({ item }) => newestPositions.get(item.id))
  .filter((position) => position !== undefined)
  .sort((a, b) => a - b);
check("newest-first order serves the same material, nothing dropped",
  newestWords.length === commonWords.length && newestWords.length > 1000);
check("newest-first genuinely front-loads what most-common-first buries",
  buriedByCommon.length > 300
  && buriedByCommon[Math.floor(buriedByCommon.length / 2)] < newestWords.length * 0.4
  && buriedByCommon.filter((position) => position < newestWords.length / 2).length / buriedByCommon.length >= 0.9);

// A card titled with a bare word must teach that word. An idiom built on the
// lemma ("an etwas liegen") used to win the card purely by sitting in an
// earlier pack, so Listen said "liegen — to be due to something" and the verb's
// real meaning was never spoken at all.
const wordCards = buildListenQueue(parts, {}, { contentSource: "words", order: "common" });
const completeWordCatalog = buildWordCatalog(parts);
const unresolvedWordIds = new Set(completeWordCatalog
  .filter((word) => word.listenSafe === false)
  .map((word) => word.id));
// No size floor on the withheld pool: it measured the review BACKLOG, not the
// mechanism, and the backlog is meant to reach zero. It did — every formerly
// withheld word now has a reviewed sense in canonicalWordSenses.ts. The
// mechanism itself is proved below by the synthetic prüfwort conflict, which
// must always be withheld no matter how empty the real pool gets.
check("real unresolved polysemy is withheld from passive Listen, not guessed",
  wordCards.length > 4000
  && !wordCards.some((item) => unresolvedWordIds.has(item.id)));
const cardFor = (german) => wordCards.find((item) => item.de === german);
const cardForLookup = (lookup) => wordCards.find((item) => item.id === `vw-${String(lookup)
  .toLocaleLowerCase("de-DE")
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9äöüß]+/gi, "-")
  .replace(/^-+|-+$/g, "")}`);
check("a bare word's card teaches the bare word, not an idiom built on it",
  /lying|located/i.test(cardFor("liegen")?.en ?? "")
  && /remember/i.test(cardForLookup("erinnern")?.en ?? "")
  && /remind/i.test(cardForLookup("erinnern")?.use ?? "")
  && !wordCards.some((item) => item.de === "an etwas liegen"));
// A niche sense from an earlier pack used to win the same way an idiom did:
// "stehen — to suit someone", "sitzen — to fit (of a garment)". Both are real
// meanings and both packs keep teaching them in their own sentences; what the
// card must lead with is what the word usually means.
check("a word's card teaches its primary sense, not an earlier pack's niche one",
  /standing/i.test(cardFor("stehen")?.en ?? "")
  && /sitting/i.test(cardFor("sitzen")?.en ?? "")
  && /stand something up/i.test(cardFor("stellen")?.en ?? ""));

// Contextual packs are allowed to teach different meanings of a polysemous
// word. The global Listen card is not allowed to choose one by load order:
// reviewed words get an everyday-first sense plus context, while an unresolved
// conflict is withheld from passive playback until someone has reviewed it.
for (const [lookup, primary, context] of [
  ["belegen", /take a course/i, /occupy|reserve|evidence/i],
  ["ankommen", /arrive/i, /depend/i],
  ["stimmen", /correct/i, /vote|tune/i],
  ["Stimme", /^voice$/i, /vote|vocal part|second voice/i],
  ["Nachricht", /message|news/i, /message|news/i],
  ["passen", /fit|suit/i, /size|suit|work/i],
  ["Hammer", /hammer|mallet/i, /awesome|amazing/i],
  ["See", /^lake$/i, /sea/i],
  ["ausleihen", /borrow|lend/i, /borrow|lend|hire|rent/i],
  ["vornehmen", /plan/i, /resolve|intend/i],
  ["ansatz", /approach|starting point/i, /hair|roots/i],
  ["abschließen", /finish|complete/i, /lock|contract/i],
  ["folge", /result|consequence/i, /episode/i],
  ["rezept", /recipe|prescription/i, /cooking|medicine/i],
]) {
  const reviewed = cardForLookup(lookup);
  check(`${lookup} has a reviewed standalone meaning instead of a pack-order accident`,
    primary.test(reviewed?.en ?? "") && context.test(reviewed?.use ?? ""));
}

const unresolvedQueue = buildListenQueue({
  first: { level: "A1", vocab: [{ de: "prüfwort", en: "first unrelated meaning", lookup: "prüfwort" }] },
  second: { level: "B1", vocab: [{ de: "prüfwort", en: "second unrelated meaning", lookup: "prüfwort" }] },
}, {}, { contentSource: "words", order: "common" });
check("an unresolved conflicting word is withheld from passive Listen playback",
  !unresolvedQueue.some((item) => item.id === "vw-prufwort"));
// English collapses two unrelated German words into "theme": das Motto is the
// theme of a party, das Thema is a topic you discuss. A bare "theme" on either
// card teaches a coin flip, so each has to say which one it is.
check("Motto and Thema do not both answer to a bare “theme”",
  /party theme/i.test(cardFor("das Motto")?.en ?? "")
  && !/^theme$/i.test((cardFor("das Motto")?.en ?? "").trim()));

/**
 * Standing guarantee over every word card, not a list of words I happened to
 * check by hand.
 *
 * A Listen card speaks ONE English phrase — primaryAnswer, the part before the
 * first " / ". Two German words reaching the same spoken English is fine when
 * they are true synonyms (deshalb / deswegen / daher really are all
 * "therefore"). It is a mistranslation when they are not, and the machine-
 * checkable version of "not" is that the claimants disagree about part of
 * speech: a noun and an adjective are never interchangeable however close the
 * gloss reads. That caught voreilig and der Ausschlag both saying "rash" —
 * hasty versus the skin kind — and six more pairs like it.
 *
 * The two shape checks below are plain wrongness rather than ambiguity: a
 * German noun whose English begins "to ...", or a verb glossed as a thing.
 */
const spokenGloss = (item) => String(item.en ?? "").trim().replace(/[.!?]+$/, "");
const looksLikeNoun = (german) => /^(der|die|das)\s+/i.test(String(german ?? "").trim());

const bySpoken = new Map();
for (const card of wordCards) {
  const key = spokenGloss(card).toLowerCase();
  if (!key) continue;
  if (!bySpoken.has(key)) bySpoken.set(key, []);
  bySpoken.get(key).push(card);
}
const mixedPosCollisions = [...bySpoken.entries()].filter(([, cards]) =>
  new Set(cards.map((c) => c.de.toLowerCase())).size > 1
  && new Set(cards.map((c) => (looksLikeNoun(c.de) ? "noun" : "other"))).size > 1);
check(
  `no spoken gloss is shared by a noun and a non-noun (${mixedPosCollisions.length} found)`,
  mixedPosCollisions.length === 0
);
if (mixedPosCollisions.length) {
  for (const [gloss, cards] of mixedPosCollisions.slice(0, 8)) {
    console.error(`     "${gloss}" <- ${cards.map((c) => c.de).join(" | ")}`);
  }
}

// Part of speech has to come from the authored seed, not from the shape of the
// English. Plenty of non-nouns are correctly glossed with an article — schade
// is "a shame", neulich is "the other day" — so keying off the article alone
// reports five false positives and teaches nobody anything.
const posByGerman = new Map();
for (const part of Object.values(parts)) {
  for (const word of part?.vocab ?? []) {
    const de = String(word?.de ?? "").trim();
    if (de && !posByGerman.has(de)) posByGerman.set(de, String(word?.tip ?? word?.pos ?? ""));
  }
}
const nounSpokenAsVerb = wordCards.filter((c) => looksLikeNoun(c.de) && /^to\s+\w/i.test(spokenGloss(c)));
const verbSpokenAsNoun = wordCards.filter((c) =>
  posByGerman.get(c.de) === "verb" && /^(a|an|the)\s+\w/i.test(spokenGloss(c)));
check(`no noun is spoken as a verb (${nounSpokenAsVerb.length} found)`, nounSpokenAsVerb.length === 0);
check(`no bare verb is spoken as a noun (${verbSpokenAsNoun.length} found)`, verbSpokenAsNoun.length === 0);
for (const card of [...nounSpokenAsVerb, ...verbSpokenAsNoun].slice(0, 8)) {
  console.error(`     ${card.de} = "${spokenGloss(card)}"`);
}
check("liegen and lügen are taught as the different verbs they are",
  /lie/i.test(cardFor("lügen")?.en ?? "")
  && !/lying/i.test(cardFor("lügen")?.en ?? "")
  && !/\blie\b/i.test(cardFor("liegen")?.en ?? "")
  && /lay/i.test(cardFor("legen")?.en ?? ""));

const learningOptions = { contentSource: "sentences", order: "learning" };
const probeId = buildListenQueue(parts, {}, learningOptions)[5].id;
const dueYesterday = { ...recordSuccess(undefined, Date.now() - 2 * 864e5), dueAt: new Date(Date.now() - 864e5).toISOString() };
queue = buildListenQueue(parts, { [probeId]: dueYesterday }, learningOptions);
check("adaptive learning order can still put a due review first", queue[0]?.id === probeId);

const snoozed = { snoozedUntil: new Date(Date.now() + 864e5).toISOString() };
queue = buildListenQueue(parts, { [probeId]: snoozed }, learningOptions);
check("a snoozed item is not read aloud", queue.every((item) => item.id !== probeId));

const levelNow = Date.now();
setListenReviewLevel({ id: probeId, aliases: [] }, 5, null, levelNow);
const beforeMasteredReview = buildListenQueue(
  parts,
  readGrades(),
  learningOptions,
  levelNow + 179 * 864e5
);
check("a timed Listen level removes the item until its review date",
  beforeMasteredReview.every((item) => item.id !== probeId));
const atMasteredReview = buildListenQueue(
  parts,
  readGrades(),
  learningOptions,
  levelNow + 180 * 864e5 + 1
);
check("a timed Listen level returns the item when it is due",
  atMasteredReview.some((item) => item.id === probeId));

// ── settings and wiring, from source ────────────────────────────────────
stored.clear();
check("the German course defaults to English once, then German twice",
  DEFAULT_GERMAN_REPEATS === 2
  && DEFAULT_ENGLISH_REPEATS === 1
  && DEFAULT_LISTEN_LANGUAGE_ORDER === "english-first"
  && getListenGermanRepeats("learn-de") === 2
  && getListenEnglishRepeats("learn-de") === 1
  && getListenLanguageOrder("learn-de") === "english-first");
check("the English course defaults to German once, then English twice",
  DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS === 1
  && DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS === 2
  && DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER === "german-first"
  && getListenGermanRepeats("learn-en") === 1
  && getListenEnglishRepeats("learn-en") === 2
  && getListenLanguageOrder("learn-en") === "german-first");
check("the next card waits 1.1 seconds by default",
  DEFAULT_NEXT_CARD_DELAY_MS === 1100 && getListenNextCardDelayMs() === 1100);
check("Listen defaults to a real learning loop rather than one-pass exposure",
  DEFAULT_LISTEN_LOOP_ITEMS === 3
  && DEFAULT_LISTEN_LOOP_PASSES === 2
  && getListenLoopItems("learn-de") === 3
  && getListenLoopPasses("learn-de") === 2);
check("Listen defaults to both trackers in real most-common-first order",
  getListenContentSource("learn-de") === "mixed"
  && getListenQueueOrder("learn-de") === "common");
setListenContentSource("words", "learn-de");
setListenQueueOrder("least-heard", "learn-de");
setListenContentSource("sentences", "learn-en");
setListenQueueOrder("learning", "learn-en");
check("each course remembers its own Listen source and queue order",
  getListenContentSource("learn-de") === "words"
  && getListenQueueOrder("learn-de") === "least-heard"
  && getListenContentSource("learn-en") === "sentences"
  && getListenQueueOrder("learn-en") === "learning");
const repeatedSet = Array.from(
  { length: 12 },
  (_, playhead) => listenQueueIndexForPlayhead(playhead, 20, 3, 2)
);
check("the learning loop revisits a small set before introducing more items",
  repeatedSet.join(",") === "0,1,2,0,1,2,3,4,5,3,4,5");
const exposureOnly = Array.from(
  { length: 8 },
  (_, playhead) => listenQueueIndexForPlayhead(playhead, 20, 3, 1)
);
check("one loop pass preserves the old sequential exposure behaviour",
  exposureOnly.join(",") === "0,1,2,3,4,5,6,7");
check("a restored item starts at the first pass of its own loop",
  listenQueueIndexForPlayhead(
    listenPlayheadForQueueIndex(7, 20, 3, 3),
    20,
    3,
    3
  ) === 7
  && listenLoopPassForPlayhead(listenPlayheadForQueueIndex(7, 20, 3, 3), 20, 3, 3) === 1);
const tailSet = Array.from(
  { length: 15 },
  (_, playhead) => listenQueueIndexForPlayhead(playhead, 5, 3, 2)
);
check("a short final set repeats without wrapping early items into it",
  tailSet.join(",") === "0,1,2,0,1,2,3,4,3,4,0,1,2,0,1");
setListenGermanRepeats(3, "learn-de");
setListenEnglishRepeats(4, "learn-de");
setListenLanguageOrder("german-first", "learn-de");
setListenLoopItems(4, "learn-de");
setListenLoopPasses(3, "learn-de");
setListenGermanRepeats(5, "learn-en");
setListenEnglishRepeats(6, "learn-en");
setListenLanguageOrder("english-first", "learn-en");
setListenLoopItems(6, "learn-en");
setListenLoopPasses(4, "learn-en");
stored.set("gl-listen-next-card-delay-ms", "2500");
check("each course keeps its own language and learning-loop repetition plan",
  getListenGermanRepeats("learn-de") === 3
  && getListenEnglishRepeats("learn-de") === 4
  && getListenLanguageOrder("learn-de") === "german-first"
  && getListenLoopItems("learn-de") === 4
  && getListenLoopPasses("learn-de") === 3
  && getListenGermanRepeats("learn-en") === 5
  && getListenEnglishRepeats("learn-en") === 6
  && getListenLanguageOrder("learn-en") === "english-first"
  && getListenLoopItems("learn-en") === 6
  && getListenLoopPasses("learn-en") === 4);
check("the next-card delay is the learner's to change", getListenNextCardDelayMs() === 2500);
stored.set("gl-listen-german-repeats:learn-de", "99");
stored.set("gl-listen-english-repeats:learn-de", "0");
stored.set("gl-listen-language-order:learn-de", "invalid");
stored.set("gl-listen-content-source:learn-de", "invalid");
stored.set("gl-listen-queue-order:learn-de", "invalid");
stored.set("gl-listen-loop-items:learn-de", "99");
stored.set("gl-listen-loop-passes:learn-de", "0");
stored.set("gl-listen-next-card-delay-ms", "999999");
check("corrupt Listen settings fall back to documented defaults",
  getListenGermanRepeats("learn-de") === 2
  && getListenEnglishRepeats("learn-de") === 1
  && getListenLanguageOrder("learn-de") === "english-first"
  && getListenContentSource("learn-de") === "mixed"
  && getListenQueueOrder("learn-de") === "common"
  && getListenLoopItems("learn-de") === 3
  && getListenLoopPasses("learn-de") === 2
  && getListenNextCardDelayMs() === 1100);
check("Listen setting writers clamp typed values to safe limits",
  setListenGermanRepeats(99, "learn-de") === 10
  && setListenEnglishRepeats(-4, "learn-de") === 1
  && setListenContentSource("invalid", "learn-de") === "mixed"
  && setListenQueueOrder("invalid", "learn-de") === "common"
  && setListenLoopItems(99, "learn-de") === 12
  && setListenLoopPasses(0, "learn-de") === 1
  && setListenNextCardDelayMs(99_000) === 30_000);

stored.clear();
check("background Listen playback is on by default and remains learner-controlled",
  getListenBackgroundPlayback(null) === true
  && setListenBackgroundPlayback(false, null) === false
  && getListenBackgroundPlayback(null) === false
  && setListenBackgroundPlayback(true, null) === true);
check("pet captions show both languages with a clean gap by default and remain learner-controlled",
  getListenPetBilingualCaptions(null) === true
  && formatListenPetCaption({ de: "Bis gleich.", en: "See you soon." }, "Bis gleich.", true) === "Bis gleich.\n\nSee you soon."
  && setListenPetBilingualCaptions(false, null) === false
  && getListenPetBilingualCaptions(null) === false
  && formatListenPetCaption({ de: "Bis gleich.", en: "See you soon." }, "Bis gleich.", false) === "Bis gleich."
  && setListenPetBilingualCaptions(true, null) === true);
setListenCurrentItemId("sentence-cursor", "learn-de", null, "sentences");
setListenCurrentItemId("english-course-cursor", "learn-en", null, "sentences");
setListenCurrentItemId("word-cursor", "learn-de", null, "words");
setListenCurrentItemId("learning-cursor", "learn-de", null, "sentences", "learning");
check("Listen remembers a separate exact cursor for each course, content mode, and queue order",
  getListenCurrentItemId("learn-de", null, "words") === "word-cursor"
  && getListenCurrentItemId("learn-en", null, "words") === ""
  && getListenCurrentItemId("learn-de", null, "sentences") === "sentence-cursor"
  && getListenCurrentItemId("learn-en", null, "sentences") === "english-course-cursor"
  && getListenCurrentItemId("learn-de", null, "sentences", "learning") === "learning-cursor"
  && getListenCurrentItemId("learn-de", null, "sentences", "least-heard") === "");

const prototype = read("src/prototype/NewUiPrototype.tsx");
check("Listen sits in the left menu", /id: "listen", label: "Listen", icon: Headphones/.test(prototype));
// Pinned by behaviour, not by the exact array literal. This first matched
// ["learn", "games", "tests", "listen"] verbatim, which meant adding a fifth
// view that also needs the catalogue broke a Listen check for no Listen
// reason. What matters is that navigating to Listen asks for the catalogue.
const navigateGate = /if \(\[([^\]]+)\]\.includes\(view\)\) setPartsRequested\(true\);/.exec(prototype);
check("navigating to Listen loads the course catalogue",
  Boolean(navigateGate) && navigateGate[1].includes('"listen"'));
check("the Listen view stays mounted behind the catalogue gate across dashboard navigation",
  prototype.includes('activeView === "listen"')
  && prototype.includes("<ListenView")
  && prototype.includes('active={activeView === "listen"}')
  && prototype.includes('className={activeView === "listen" ? "np-main" : "hidden"}')
  && prototype.includes('learningDirection={learningEnglish() ? "learn-en" : "learn-de"}'));

const view = read("src/components/listen/ListenView.tsx");
check("the view schedules both languages in the learner-selected order", view.includes("ttsSequence(")
  && view.includes('lang: "de-DE"')
  && view.includes("englishLang")
  && view.includes('languageOrder === "english-first"')
  && view.includes("[...englishSequence, ...germanSequence]"));
check("the view repeats German and English independently",
  /Array\.from\(\s*\{ length: germanRepeats \}/.test(view)
  && /Array\.from\(\s*\{ length: englishRepeats \}/.test(view));
check("reviewed word cards explain important secondary meanings on screen",
  view.includes('item.kind === "word" && item.use') && view.includes("{item.use}"));
check("the playback plan, order switch, and typed repeat counts are visible",
  view.includes('"English {en}×, then German {de}×"')
  && view.includes('"German {de}×, then English {en}×"')
  && view.includes('data-testid={`listen-order-${value}`}')
  && view.includes('testId="listen-german-repeats"')
  && view.includes('testId="listen-english-repeats"'));
check("whole items return through a visible, learner-controlled learning loop",
  view.includes("listenQueueIndexForPlayhead(")
  && view.includes("listenPlayheadForQueueIndex(")
  && view.includes('testId="listen-loop-items"')
  && view.includes('testId="listen-loop-passes"')
  && view.includes('"Learning pass {pass} of {passes}"'));
check("Listen exposes real source and queue-order controls",
  view.includes('data-testid={`listen-source-${value}`}')
  && view.includes('data-testid={`listen-queue-${value}`}')
  && view.includes("setListenContentSource(")
  && view.includes("setListenQueueOrder("));
check("the next-card delay is visible and drives auto-advance",
  view.includes('testId="listen-next-card-delay"')
  && view.includes("}, nextCardDelayMs);"));
check("master, German, and English volume sliders are always in the Listen view",
  view.includes('testId="listen-master"')
  && view.includes('testId="listen-german"')
  && view.includes('testId="listen-english"'));
check("muted language state cannot silently hide from the learner",
  view.includes('"English voice is muted and will be skipped."')
  && view.includes('"German voice is muted and will be skipped."'));
check("Listen exposes exact review levels and real snooze choices",
  view.includes("setListenReviewLevel(")
  && view.includes("undoListenReviewChange(")
  && view.includes("snoozeListenItem(")
  && view.includes('ui("Set level")')
  && view.includes('ui("Put off")'));
check("level and snooze controls live under the Know it hover/focus menu",
  view.includes('data-testid="listen-know-options"')
  && view.includes('onMouseEnter={openReviewPanel}')
  && view.includes('data-testid="listen-review-menu"')
  && !view.includes('openReviewPanel("level")')
  && !view.includes('openReviewPanel("snooze")'));
check("the review menu pauses autoplay, freezes the exact item, names it, and offers Undo",
  view.includes("const openReviewPanel")
  && view.includes("pause();")
  && view.includes("setReviewTarget({ ...item")
  && view.includes("setListenReviewLevel(target")
  && view.includes('uiFmt("“{item}” set to {level}."')
  && view.includes("undoReviewLevel")
  && view.includes('ui("Undo")'));
check("pausing actually stops the voice", view.includes("stopTts()"));
check("silent playback is detected from a real start event, not a duration guess",
  view.includes("TTS_SPEAKING_EVENT")
  && view.includes("if (!heardSpeech)")
  && !view.includes("startedAt < 600"));
check("grading uses the damped listen path, not the lesson path",
  view.includes("recordListenGrade(") && !view.includes("recordDeclaredKnown") && !view.includes("setItemStatus("));
check("a rapid grade or navigation cannot queue a second card advance",
  view.includes("gradeAdvanceTimerRef")
  && view.includes("if (!item || gradeAdvanceTimerRef.current != null) return;")
  && view.includes("cancelGradeAdvance();"));
check("Listen restores and persists the exact card for this course, content mode, and queue order",
  view.includes("getListenCurrentItemId(")
  && view.includes("setListenCurrentItemId(item.id")
  && view.includes("contentSource, queueOrder"));
check("background playback is default-on, toggleable, and exposes a compact persistent player",
  view.includes("getListenBackgroundPlayback(")
  && view.includes("setListenBackgroundPlayback(")
  && view.includes('data-testid="listen-background-player"')
  && view.includes('data-testid="listen-background-toggle"'));
check("the active pet mirrors every spoken clip without starting a duplicate voice",
  view.includes("onStart: () => mirrorOnPet")
  && view.includes("formatListenPetCaption(item, text, petBilingualCaptions)")
  && view.includes('data-testid="listen-pet-bilingual-toggle"')
  && view.includes("silent: true")
  && view.includes("verbatim: true"));

const voice = read("src/lib/voice.ts");
const petProvider = read("src/components/codexPets/CodexPetProvider.tsx");
const petLayer = read("src/components/codexPets/CodexPetLayer.tsx");
check("the shared TTS sequence exposes an exact clip-start hook for synced captions",
  voice.includes("onStart?: () => void") && voice.includes("item.onStart?.()"));
check("silent pet captions are kept verbatim and never interrupt Listen audio",
  petProvider.includes("options.verbatim ? rawText")
  && petProvider.includes("silent: options.silent === true")
  && petLayer.includes("if (speech?.silent)")
  && petLayer.includes("whitespace-pre-line"));

const electronMain = read("electron/main.js");
const electronPreload = read("electron/preload.cjs");
check("Windows taskbar controls and keyboard media keys command the mounted player",
  electronMain.includes("setThumbarButtons")
  && electronMain.includes('"MediaPreviousTrack"')
  && electronMain.includes('"MediaPlayPause"')
  && electronMain.includes('"MediaNextTrack"')
  && electronPreload.includes("onListenMediaCommand"));
check("minimized Listen playback disables Chromium background throttling only while playing",
  electronMain.includes("setBackgroundThrottling(!listenMediaState.playing)")
  && electronMain.includes('ipcMain.on("listen-media:set-state"')
  && electronPreload.includes("setListenMediaState"));

const vocabTracker = read("src/components/lab/VocabTracker.tsx");
const wordsTracker = read("src/components/lab/WordsTracker.tsx");
check("both trackers surface the exposure count",
  vocabTracker.includes('ui("heard")') && wordsTracker.includes('ui("heard")'));

const i18n = read("src/lib/i18n.ts");
for (const key of [
  "Both languages repeat in small learning loops while you do something else.",
  "German {de}×, then English {en}×",
  "English {en}×, then German {de}×",
  "{items}-item loop, {passes} passes",
  "Learning pass {pass} of {passes}",
  "What you hear",
  "Which items Listen plays, in what order, and how often they come back.",
  "Learning loop",
  "Hear a small set, then revisit the same items before moving on.",
  "Items in each loop",
  "How many different items to hear before they return",
  "Passes through each loop",
  "2 means every item returns once; 1 turns item repetition off",
  "Language order",
  "English first",
  "German first",
  "Times spoken on every card",
  "German repeats",
  "English repeats",
  "Next card delay",
  "How it sounds",
  "Voice levels, speed, and how each card is spoken. Saved automatically.",
  "English voice is muted and will be skipped.",
  "Hover over Know it, or open its menu, for exact levels and Put off.",
  "More Know it options",
  "“{item}” set to {level}.",
  "Undid the level change for “{item}”.",
  "Play audio",
  "Keep playing around Micheon",
  "Continue when you open Home, Practice, Settings, or another app section.",
  "Content source",
  "Choose whether Listen pulls from the sentence tracker, word tracker, or both.",
  "Queue order",
  "Most common first teaches the phrases and words people are most likely to use. Newest first plays the packs added most recently, so new content is heard instead of waiting behind thousands of commoner items.",
  "Newest first",
  "Reviews & struggles first",
  "Least heard first",
  "Show both languages on the pet",
  "Keep German and English together in the pet bubble. Turn this off to show only the line currently being spoken.",
  "Playing in the background",
  "Listen is paused",
  "Previous item",
  "Next item",
  "Close Listen player",
  "heard",
  "Repeated listening builds familiarity, but it does not mark an item mastered. Lessons still check whether you can recall and spell it.",
]) {
  check(`the new UI string is translated: ${key.slice(0, 40)}…`, new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}": "`).test(i18n));
}

delete global.window;
delete global.localStorage;

// ── the page leads with the display face where the dashboard does ───────
// Rounded lettering on the hero pair only (the language-tagged word and its
// meaning); captions and descriptions match the dashboard's small-size text
// face. Blanket-rounding every <p>/<small> was tried and looked clunky at
// 11-13px on Windows — this pins the split so neither half regresses.
const listenView = read("src/components/listen/ListenView.tsx");
const css = read("src/index.css");
check(
  "Listen rounds the hero pair and keeps small copy on the dashboard's text face",
  listenView.includes('className="listen-view mx-auto w-full max-w-7xl space-y-4"')
    && listenView.includes('lang="de"')
    && /\.new-ui-prototype \.listen-view p,\s*\.new-ui-prototype \.listen-view small,\s*\.listen-view p,\s*\.listen-view small \{\s*font-family: var\(--np-font-text/.test(css)
    && /\.new-ui-prototype \.listen-view p\[lang\],\s*\.listen-view p\[lang\] \{\s*font-family: var\(--np-font-display/.test(css)
);

if (failures > 0) {
  console.error(`\n${failures} listen-mode check(s) failed`);
  process.exit(1);
}
console.log("\nListen mode stays passive: damped grades, honest queue, wired UI");
// Modules loaded under the window polyfill may have armed timers; exit
// explicitly so a green run doesn't idle until the CI step times out.
process.exit(0);
