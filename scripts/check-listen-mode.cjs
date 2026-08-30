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
      'export { buildListenQueue, arrangeListenMixedQueue, listenMixGroupFor, getListenMixedCounts, setListenMixedCounts, DEFAULT_LISTEN_MIXED_COUNTS, formatListenPetCaption, recordListenGrade, setListenReviewLevel, undoListenReviewChange, snoozeListenItem, getListenBackgroundPlayback, setListenBackgroundPlayback, getListenPetBilingualCaptions, setListenPetBilingualCaptions, getListenContentSource, setListenContentSource, getListenQueueOrder, setListenQueueOrder, getListenQueueWithin, setListenQueueWithin, listenQueueHasGroups, LISTEN_QUEUE_WITHINS, DEFAULT_LISTEN_QUEUE_WITHIN, getListenReturnGap, setListenReturnGap, getListenReturnScope, setListenReturnScope, listenReturnCovers, LISTEN_RETURN_GAPS, LISTEN_RETURN_SCOPES, DEFAULT_LISTEN_RETURN_GAP, DEFAULT_LISTEN_RETURN_SCOPE, LISTEN_RETURN_GAP_MS, getListenCurrentItemId, setListenCurrentItemId, getListenTargetRepeats, setListenTargetRepeats, getListenMeaningRepeats, setListenMeaningRepeats, getListenLanguageOrder, setListenLanguageOrder, getListenLoopItems, setListenLoopItems, getListenLoopPasses, setListenLoopPasses, listenQueueIndexForPlayhead, listenPlayheadForQueueIndex, listenLoopPassForPlayhead, getListenNextCardDelayMs, setListenNextCardDelayMs, getListenLanguageGapMs, setListenLanguageGapMs, buildListenSpeechPlan, DEFAULT_LANGUAGE_GAP_MS, DEFAULT_TARGET_REPEATS, DEFAULT_MEANING_REPEATS, DEFAULT_LISTEN_LANGUAGE_ORDER, DEFAULT_LISTEN_CONTENT_SOURCE, DEFAULT_LISTEN_QUEUE_ORDER, DEFAULT_LISTEN_LOOP_ITEMS, DEFAULT_LISTEN_LOOP_PASSES, DEFAULT_NEXT_CARD_DELAY_MS, listenCountForId } from "./src/lib/listenMode.ts";',
      'export { loadGradeStore, saveGradeStore, statusForId, COMPLETED_KEY } from "./src/lib/activity.ts";',
      'export { setInterfaceLanguage } from "./src/lib/interfaceLanguage.ts";',
      'export { setLearningDirection } from "./src/lib/direction.ts";',
      'export { meaningLanguageFor, targetLanguage, translationLanguagesNeeded } from "./src/lib/courseLanguages.ts";',
      'export { frenchFor } from "./src/lib/frenchCourse.ts";',
      'export { getScopedKey } from "./src/lib/profileStorage.ts";',
      'export { recordSuccess, isDueForReview } from "./src/lib/memoryStrength.ts";',
      'export { ttsSequence, stopTts } from "./src/lib/voice.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { WORD_ID_PREFIX, buildWordCatalog, wordLadderRung } from "./src/lib/wordSession.ts";',
      'export { buildCatalog } from "./src/session.ts";',
      'export { cefrRung, cefrRungLabel, cefrStep, cefrStepLabel, CEFR_STEPS } from "./src/lib/cefr.ts";',
      'export { wordDifficultyRung, spokenWordRung } from "./src/lib/wordSession.ts";',
      'export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";',
      'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
      'export { primeTranslations } from "./src/lib/translations.ts";',
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
  getListenTargetRepeats, setListenTargetRepeats,
  getListenMeaningRepeats, setListenMeaningRepeats,
  getListenLanguageOrder, setListenLanguageOrder,
  getListenLoopItems, setListenLoopItems,
  arrangeListenMixedQueue, listenMixGroupFor, getListenMixedCounts, setListenMixedCounts, DEFAULT_LISTEN_MIXED_COUNTS,
  getListenLoopPasses, setListenLoopPasses,
  listenQueueIndexForPlayhead, listenPlayheadForQueueIndex, listenLoopPassForPlayhead,
  getListenNextCardDelayMs, setListenNextCardDelayMs,
  getListenLanguageGapMs, setListenLanguageGapMs, buildListenSpeechPlan,
  setInterfaceLanguage, setLearningDirection, meaningLanguageFor, targetLanguage, frenchFor,
  ttsSequence, stopTts, DEFAULT_LANGUAGE_GAP_MS,
  DEFAULT_TARGET_REPEATS, DEFAULT_MEANING_REPEATS, DEFAULT_LISTEN_LANGUAGE_ORDER,
  DEFAULT_LISTEN_CONTENT_SOURCE,
  DEFAULT_LISTEN_QUEUE_ORDER, DEFAULT_LISTEN_LOOP_ITEMS,
  getListenQueueWithin, setListenQueueWithin, listenQueueHasGroups,
  LISTEN_QUEUE_WITHINS, DEFAULT_LISTEN_QUEUE_WITHIN,
  getListenReturnGap, setListenReturnGap, getListenReturnScope, setListenReturnScope,
  listenReturnCovers, LISTEN_RETURN_GAPS, LISTEN_RETURN_SCOPES,
  DEFAULT_LISTEN_RETURN_GAP, DEFAULT_LISTEN_RETURN_SCOPE, LISTEN_RETURN_GAP_MS,
  DEFAULT_LISTEN_LOOP_PASSES, DEFAULT_NEXT_CARD_DELAY_MS,
  listenCountForId, buildWordCatalog, wordLadderRung,
  loadGradeStore, statusForId, COMPLETED_KEY, getScopedKey,
  recordSuccess,
  buildCatalog, cefrRung, cefrRungLabel, cefrStep, cefrStepLabel, CEFR_STEPS, wordDifficultyRung, spokenWordRung, translationLanguagesNeeded,
  allPartBlueprints, buildApiPartFromResolved, WORD_ID_PREFIX,
} = compiled.exports;
// The tables are fetched on demand in the app, so a German-only learner
// never downloads them. A check has no event loop to await one on and wants
// every language at once, so it hands them in directly.
const M = compiled.exports;
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

// Asked for rather than assembled: lesson state is stored per learning
// direction now, so the address is "session-completed@learn-de:default" and
// not "session-completed:default". getScopedKey is the app's own answer.
const GRADES_KEY = getScopedKey(COMPLETED_KEY, null);
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
/**
 * A spoken line still says how it is written.
 *
 * The course teaches what people say — "Ich hab das nicht ganz verstanden" —
 * and in print it is "habe". Somebody who only ever hears a card has no idea
 * how to spell it, which is the half of the language Listen cannot teach on
 * its own. The lesson has shown this for a while and Listen dropped the field
 * on the way through, which is the kind of loss nothing reports: the card
 * looks complete either way.
 */
{
  const written = queue.filter((item) => item.long && item.long.trim());
  check("the written form survives into the Listen queue",
    written.length > 800);
  check("no card offers a written form identical to the line it teaches",
    written.every((item) => item.long.trim() !== item.de.trim()));
  const view = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
  check("the Listen card shows it",
    view.includes("written-note") && view.includes("item.long"));
  check("and only when it differs from the line being taught",
    view.includes("item.long.trim() !== item.de.trim()"));
}

check("most-common-first genuinely uses shared popularity order",
  buildListenQueue(parts, {}, { contentSource: "sentences", order: "common" })
    .slice(0, 200)
    .every((item, index, rows) => index === 0 || rows[index - 1].popularity <= item.popularity));

// ── easiest first, and it is the default ────────────────────────────────
// Frequency is not difficulty, and Listen defaulted to frequency. Measured on
// the French course before this: a B2 card arrived at position 190 with about
// fifteen hundred A1 cards still queued behind it. In a mode built for not
// looking at the screen, that is a beginner being read sentences four levels
// above them with nothing to say so.
//
// Every card carries the rung it was sorted on, so the order can be checked
// against the thing it actually used rather than against a lookup rebuilt
// beside it. That was tried first and was wrong twice over: a sentence can
// sit in more than one pack, so a map keyed by id answers for whichever pack
// was walked last — and for a word the pack is the wrong question entirely.
const rungOf = (item) => item.rung;
check("every card in the queue knows how hard it is",
  buildListenQueue(parts, {}, { contentSource: "mixed", order: "common" })
    .filter((item) => !item.rung).length === 0);

check("Listen starts at the easiest level by default", DEFAULT_LISTEN_QUEUE_ORDER === "level");

/**
 * The badge on a card and the tracker's level filter must give one answer.
 *
 * A range label reads two ways and the app uses both deliberately: the sort
 * key takes the low end so an A1-A2 lesson orders among the A1s, the filter
 * takes the high end so asking for A2 finds the A2 material inside it. The
 * badge was rendering the sort key, so a sentence out of an A1-A2 pack of
 * subordinate clauses (ob, weil, obwohl, dafür) announced A1 while the
 * tracker filed the same sentence under A2.
 */
const sentenceCards = buildListenQueue(parts, {}, { contentSource: "sentences", order: "common" });
check("every sentence card carries a level to show",
  sentenceCards.length > 0 && sentenceCards.every((item) => Boolean(item.levelLabel)));

// A card does not carry its partKey, but the catalogue it was built from does
// — so the join goes through the catalogue by id. Matching card text against
// seed text instead finds nothing and passes whatever it is given, which is
// how the first version of this check survived every sentence reading "A1".
const sentencePackOfId = new Map(buildCatalog(parts).map((entry) => [entry.id, entry.partKey]));
const disagreeing = [];
for (const card of sentenceCards) {
  const part = parts[String(sentencePackOfId.get(card.id) ?? "")];
  if (!part?.level) continue;
  const expected = cefrStepLabel(cefrStep(part.level));
  if (card.levelLabel !== expected) {
    disagreeing.push(`${card.de} shows ${card.levelLabel}, pack is ${part.level} so the tracker files it under ${expected}`);
  }
}
check("the level join actually finds the packs it is checking", disagreeing.length > 0 || sentencePackOfId.size > 0);
if (disagreeing.length) console.error(`  ${disagreeing.slice(0, 3).join("\n  ")}`);
check("a sentence shows the level the tracker filters it by",
  sentenceCards.length > 0 && disagreeing.length === 0);

/**
 * Easiest-first has to be monotonic in the level the CARD SHOWS.
 *
 * Asserting it against the sort key only proves the sort ran. The learner sees
 * a badge, and the promise "nothing harder before something easier" is kept or
 * broken in those units: when the badge read the high end of a range and the
 * sort key read the low end, A1-labelled and A1-A2-labelled packs walked
 * together at the same rung and the screen showed A1, A2, A1, A2 while the
 * sort was working exactly as written.
 */
/**
 * ...including after the mixed deal, which is where it actually broke.
 *
 * Every check above this one measured the queue the SORT produced. The
 * learner hears the queue the mixed deal produced, and the deal split it into
 * a word stream and a sentence stream and re-dealt them one-to-two — so the
 * two walked the level ladder at different speeds. The German course has
 * 1,147 A1 words against 366 A1 sentences: at two sentences a round the
 * sentences leave A1 while the words are a sixth of the way through it, and
 * every round after that reads A1 word, A2 sentence, A2 sentence. Three and a
 * half thousand backward steps, with the sort itself perfect and every
 * assertion about it passing.
 *
 * Asserted on the RUNG rather than the badge text, because words and
 * sentences label the top of the ladder differently — cefrRungLabel folds C1
 * and C2 into ranges, so a word says "B2–C1" where a sentence at the same
 * rung says "C1". That is a real cosmetic mismatch and worth its own fix; it
 * is not this promise, and ranking label strings would fail on it while
 * missing an actual regression at A1.
 */
const mixedCounts = { words: 1, sentences: 2 };
const dealt = arrangeListenMixedQueue(
  buildListenQueue(parts, {}, { contentSource: "mixed", order: "level" }),
  mixedCounts,
  listenMixGroupFor("level")
);
let dealtBackwards = 0;
for (let i = 1; i < dealt.length; i += 1) {
  if ((dealt[i].rung ?? 3) < (dealt[i - 1].rung ?? 3)) dealtBackwards += 1;
}
check(`easiest first stays easiest first after the words and sentences are dealt together (${dealt.length} cards)`,
  dealt.length > 1000 && dealtBackwards === 0);

// And the deal is still a deal: grouping must not quietly stop mixing.
const firstNine = dealt.slice(0, 9).map((item) => item.kind);
check(`the mix is still one word to two sentences (${firstNine.join(", ")})`,
  firstNine.filter((kind) => kind === "word").length >= 2
  && firstNine.filter((kind) => kind === "sentence").length >= 4);

// The orders that promise nothing about level must keep the flat deal, or
// grouping would impose a level order on a most-common-first queue.
check("a most-common-first queue is not grouped by level",
  listenMixGroupFor("common") === undefined && typeof listenMixGroupFor("level") === "function");

const easiest = buildListenQueue(parts, {}, { contentSource: "sentences", order: "level" });
const shownRank = (item) => CEFR_STEPS.indexOf(String(item.levelLabel ?? "").toLowerCase());
const backwards = [];
for (let i = 1; i < easiest.length; i += 1) {
  const previous = shownRank(easiest[i - 1]);
  const current = shownRank(easiest[i]);
  if (previous >= 0 && current >= 0 && current < previous) {
    backwards.push(`${easiest[i - 1].levelLabel} then ${easiest[i].levelLabel}: ${easiest[i].de}`);
  }
}
if (backwards.length) console.error(`  ${backwards.slice(0, 3).join("\n  ")}`);
check("easiest first never shows a level lower than the one before it",
  easiest.length > 100 && backwards.length === 0);

const byLevel = buildListenQueue(parts, {}, { contentSource: "mixed", order: "level" });
const byCommon = buildListenQueue(parts, {}, { contentSource: "mixed", order: "common" });
check("easiest-first never puts a harder card before an easier one",
  byLevel.length === byCommon.length
  && byLevel.every((item, index, rows) => index === 0 || rungOf(rows[index - 1]) <= rungOf(item)));
// The point of asking the rung FIRST rather than instead: commonality still
// decides the order inside a rung, so "teach what people actually say" is
// kept and simply asked second.
const firstRung = rungOf(byLevel[0]);
const sameRung = byLevel.filter((item) => rungOf(item) === firstRung).map((item) => item.id);
const commonPositions = sameRung.map((id) => byCommon.findIndex((item) => item.id === id));
check("and inside one rung it is still most-common-first",
  sameRung.length > 50
  && commonPositions.every((position, index) => index === 0 || commonPositions[index - 1] < position));

// ── what leads a group is a second question, asked separately ───────────────
//
// The line above is the DEFAULT answer to it, not the only one. "All of A1
// before any of A2" says nothing about the order of A1, and a learner can
// reasonably want that order to be commonality, or the cards they keep
// getting wrong, or the ones they have heard least. Before this, wanting any
// of those meant giving up the levels entirely and taking that order across
// the whole course — hearing C1 material in week one to get A1 sorted the way
// they wanted.
//
// So the check is in two halves: the second key must actually change the
// order, and it must never be able to break the first.
check("the second question defaults to the answer the single-key order gave",
  DEFAULT_LISTEN_QUEUE_WITHIN === "common");
check("every way of ordering a group is one the picker can store",
  LISTEN_QUEUE_WITHINS.length >= 5
  && LISTEN_QUEUE_WITHINS.every((value) => setListenQueueWithin(value) === value)
  && setListenQueueWithin("not-an-order") === DEFAULT_LISTEN_QUEUE_WITHIN);
check("Most common first ranks every card on its own, so it is not asked",
  listenQueueHasGroups("common") === false
  && ["level", "learning", "least-heard", "newest"].every(listenQueueHasGroups));

const withinLeast = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", within: "least-heard",
});
const withinNewest = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", within: "newest",
});
const withinCommon = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", within: "common",
});

// Same cards either way. A second sort key reorders a queue; it must never
// add to it or drop from it, which is what would happen if it were reaching
// past the group it is meant to be ordering.
const sameCards = (a, b) => a.length === b.length
  && new Set(a.map((item) => item.id)).size === new Set(b.map((item) => item.id)).size
  && a.every((item) => b.some((other) => other.id === item.id));
check("ordering a group changes the order and not the queue",
  sameCards(withinCommon, withinLeast) && sameCards(withinCommon, withinNewest));
check("the default second answer is exactly the queue there was before",
  withinCommon.every((item, index) => item.id === byLevel[index].id));

// The promise the whole feature rests on: whatever leads a level, A2 still
// waits for A1. A second key that could reach across groups would be the
// single-key order wearing a different name.
for (const [name, ordered] of [["least heard", withinLeast], ["newest", withinNewest]]) {
  check(`${name} inside a level still never puts a harder card before an easier one`,
    ordered.length > 100
    && ordered.every((item, index, rows) => index === 0 || rungOf(rows[index - 1]) <= rungOf(item)));
}
check("and it really is a different order, not the same queue relabelled",
  withinNewest.some((item, index) => item.id !== withinCommon[index].id));

// Newest first groups by pack, so "newest within newest" is a control that
// would read as a choice and do nothing. The picker drops it; this is the
// reason it can.
const newestQueue = buildListenQueue(parts, {}, { contentSource: "mixed", order: "newest" });
const newestWithinNewest = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "newest", within: "newest",
});
check("an order cannot lead its own groups",
  newestQueue.every((item, index) => item.id === newestWithinNewest[index].id));

setListenQueueWithin(DEFAULT_LISTEN_QUEUE_WITHIN);
check("the stored answer survives being written and read back",
  getListenQueueWithin() === DEFAULT_LISTEN_QUEUE_WITHIN);

// ── how long something waits before it comes back ─────────────────────
//
// Listen played whatever the order put in front of it, and hearing a word is
// not learning it: on a narrow filter the same twenty cards could come round
// all evening, which feels like studying and is not. The wait is what stops
// that, and it has two halves — how long, and over which kind of card.
//
// The design decision worth protecting is that a rested card is sorted to the
// BACK of the queue rather than removed from it. A filter can empty a queue,
// and a listening mode with nothing in it is a bug rather than a lesson. So
// every assertion below about resting is paired with one about the queue
// still holding every card it held before.
check("the wait defaults to a day, which is the shortest the ladder ever asks",
  DEFAULT_LISTEN_RETURN_GAP === "day" && LISTEN_RETURN_GAP_MS.day === 24 * 60 * 60 * 1000);
check("and it covers both kinds of card until told otherwise",
  DEFAULT_LISTEN_RETURN_SCOPE === "both");
check("every wait and every scope is one the picker can store",
  LISTEN_RETURN_GAPS.every((value) => setListenReturnGap(value) === value)
  && LISTEN_RETURN_SCOPES.every((value) => setListenReturnScope(value) === value)
  && setListenReturnGap("whenever") === DEFAULT_LISTEN_RETURN_GAP
  && setListenReturnScope("everything") === DEFAULT_LISTEN_RETURN_SCOPE);
check("what has to wait is exactly what the learner chose",
  listenReturnCovers("both", "word") && listenReturnCovers("both", "sentence")
  && listenReturnCovers("words", "word") && !listenReturnCovers("words", "sentence")
  && listenReturnCovers("sentences", "sentence") && !listenReturnCovers("sentences", "word"));

// A queue where the first card was heard a minute ago. Immediate leaves it
// where the order put it; a day pushes it behind everything else.
const heardNow = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", returnGap: "immediate",
});
const firstHeard = heardNow[0];
const justPlayed = {
  [firstHeard.id]: {
    listenedAt: new Date(Date.now() - 60 * 1000).toISOString(),
    listens: 1,
  },
};
const withoutWait = buildListenQueue(parts, justPlayed, {
  contentSource: "mixed", order: "level", returnGap: "immediate",
});
const withWait = buildListenQueue(parts, justPlayed, {
  contentSource: "mixed", order: "level", returnGap: "day",
});
check("with no wait, something heard a minute ago still leads the queue",
  withoutWait[0]?.id === firstHeard.id);
check("with a day's wait it is not first any more",
  withWait[0]?.id !== firstHeard.id);
check("and it is at the very back rather than gone",
  withWait[withWait.length - 1]?.id === firstHeard.id
  && withWait.length === withoutWait.length);

// The whole point of the floor: a wait must never be able to empty a queue,
// however much of it has been heard.
const everythingHeard = {};
for (const item of withoutWait.slice(0, 400)) {
  everythingHeard[item.id] = {
    listenedAt: new Date(Date.now() - 60 * 1000).toISOString(),
    listens: 1,
  };
}
const allRested = buildListenQueue(parts, everythingHeard, {
  contentSource: "mixed", order: "level", returnGap: "due",
});
check("even with hundreds of cards resting the queue is the same size",
  allRested.length === withoutWait.length);

// Scope. A wait on words alone must leave the sentences exactly where they were.
const wordFirst = withoutWait.find((entry) => entry.kind === "word");
const sentenceFirst = withoutWait.find((entry) => entry.kind === "sentence");
const bothHeard = {
  [wordFirst.id]: { listenedAt: new Date(Date.now() - 60 * 1000).toISOString(), listens: 1 },
  [sentenceFirst.id]: { listenedAt: new Date(Date.now() - 60 * 1000).toISOString(), listens: 1 },
};
const wordsOnly = buildListenQueue(parts, bothHeard, {
  contentSource: "mixed", order: "level", returnGap: "day", returnScope: "words",
});
const restedWordAt = wordsOnly.findIndex((entry) => entry.id === wordFirst.id);
const keptSentenceAt = wordsOnly.findIndex((entry) => entry.id === sentenceFirst.id);
const sentenceWasAt = withoutWait.findIndex((entry) => entry.id === sentenceFirst.id);
check("a wait on words alone rests the word and leaves the sentence alone",
  restedWordAt > keptSentenceAt && keptSentenceAt === sentenceWasAt);

// Never heard means never rested — a card that has not played yet cannot be
// one you have already had, whatever the wait is set to.
const untouched = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", returnGap: "due",
});
check("on a fresh course nothing is resting, so the strictest wait changes nothing",
  untouched.every((entry, index) => entry.id === heardNow[index].id));

setListenReturnGap(DEFAULT_LISTEN_RETURN_GAP);
setListenReturnScope(DEFAULT_LISTEN_RETURN_SCOPE);
check("the wait survives being written and read back",
  getListenReturnGap() === DEFAULT_LISTEN_RETURN_GAP
  && getListenReturnScope() === DEFAULT_LISTEN_RETURN_SCOPE);

// The settings are only real if the panel offers them, and the loop's numbers
// are only clear if the panel says what they add up to.
const listenPanel = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
// The buttons are rendered from a list with a templated test id, so the id
// never appears in the source spelled out. What can be read is the list the
// panel maps over, and that is the thing that has to hold every value: a wait
// the library knows and the panel does not offer is one nobody can choose.
const panelChoices = (name) => {
  const block = listenPanel.slice(listenPanel.indexOf(`const ${name} = [`));
  return [...block.slice(0, block.indexOf("] as const;")).matchAll(/\["([a-z-]+)",/g)]
    .map((match) => match[1]);
};
const offeredGaps = panelChoices("RETURN_GAP_CHOICES");
const offeredScopes = panelChoices("RETURN_SCOPE_CHOICES");
check(`the picker offers every wait and every scope${
  LISTEN_RETURN_GAPS.filter((v) => !offeredGaps.includes(v)).length
    ? " — missing " + LISTEN_RETURN_GAPS.filter((v) => !offeredGaps.includes(v)).join(", ")
    : ""}`,
  LISTEN_RETURN_GAPS.every((value) => offeredGaps.includes(value))
  && LISTEN_RETURN_SCOPES.every((value) => offeredScopes.includes(value))
  && listenPanel.includes("listen-return-gap-")
  && listenPanel.includes("listen-return-scope-"));
check("choosing one explains in words what it means in hours",
  listenPanel.includes("RETURN_GAP_EXPLAINED")
  && listenPanel.includes("listen-return-explained"));
check("and the loop says what the learner's own numbers add up to",
  listenPanel.includes("listen-loop-example")
  && listenPanel.includes("You hear all {total}, then the same {total} again"));
// The failure this replaces, asserted as the thing it was: nothing hard may
// sit in front of a beginner's material any more.
const firstHard = byLevel.findIndex((item) => rungOf(item) >= 4);
const easyBehindIt = byLevel.slice(firstHard).filter((item) => rungOf(item) <= 1).length;
check(`no A1 card waits behind a B2 one (${easyBehindIt} did, first hard card was at ${byCommon.findIndex((item) => rungOf(item) >= 4)})`,
  firstHard > 0 && easyBehindIt === 0);
// A pack with no level at all has no rung to sit on. It lands mid-ladder
// rather than at either end: first would push unlabelled material in front of
// A1, last would hide it entirely.
check("a pack with no level lands mid-ladder rather than ahead of A1",
  cefrRung(undefined) === 3 && cefrRung("") === 3 && cefrRung("nonsense") === 3);
// A range reads as its low end, except B2-C1, which gets a rung of its own.
check("a range is placed by where it starts, not by how far it reaches",
  cefrRung("A1-B2") === 1 && cefrRung("A2-C1") === 2 && cefrRung("B1-B2") === 3
  && cefrRung("B2-C1") === 5 && cefrRung("C1") === 6
  && cefrRungLabel(1) === "A1" && cefrRungLabel(6) === "C1\–C2");

// A word's rung is its own, not its pack's.
//
// The regression this exists to prevent, and it shipped once: sorting words
// by the pack's CEFR label put haben at 1,045, bitte at 3,372 and k\önnen at
// 3,370 of a queue that had just promised to start with the easiest thing it
// had. Those words are taught inside A2 packs because the LESSON is A2; the
// words themselves are among the first fifty in the language.
const wordQueue = buildListenQueue(parts, {}, { contentSource: "words", order: "level" });
const wordAt = (text) => wordQueue.findIndex((item) => item.de === text) + 1;
const coreWords = ["haben", "sein", "k\önnen", "m\üssen", "machen", "bitte", "geben", "gut"];
const worst = coreWords.map((text) => [text, wordAt(text)]).sort((a, b) => b[1] - a[1])[0];
check(`the commonest words in the language open the queue (worst: ${worst[0]} at ${worst[1]})`,
  coreWords.every((text) => wordAt(text) > 0 && wordAt(text) <= 40));
// Asserted through the rung as well as the position, so this still fails if
// the ordering changes but the difficulty question does not.
check("a core word is on the A1 rung even when its pack says A2",
  wordDifficultyRung({ level: "A2", lookup: "haben", de: "haben" }) === 1
  && wordDifficultyRung({ level: "A2-B2", lookup: "bitte", de: "bitte" }) === 1
  // ...and the rescue is narrow: an ordinary A2 noun stays where its pack put
  // it, whether the frequency bank ranks it low or has never heard of it.
  && wordDifficultyRung({ level: "A2", lookup: "Kollege", de: "der Kollege" }) === 2
  && wordDifficultyRung({ level: "A2", lookup: "Handtuch", de: "das Handtuch" }) === 2);
// A connector is core vocabulary whatever pack teaches it, and the frequency
// bank does not list them at all - so nothing but the function-word list
// rescues obwohl and nachdem from the B1-B2 pack they are taught in.
check("a connector taught in a B1-B2 pack is still core vocabulary",
  wordDifficultyRung({ level: "B1-B2", lookup: "obwohl", de: "obwohl" }) === 1
  && wordDifficultyRung({ level: "B1-B2", lookup: "nachdem", de: "nachdem" }) === 1);
// A sentence has no frequency rank of its own to be rescued by, so it is only
// as easy as the lesson it belongs to.
check("a sentence is placed by its pack, which is the only level it has",
  buildListenQueue(parts, {}, { contentSource: "sentences", order: "level" })
    .every((item) => item.rung >= 1 && item.rung <= 6));
// ── the promise, pinned so it cannot drift back ─────────────────────────
// Everything above says the order is right today. These say it stays right:
// the failures they catch are the two that already happened, plus the two
// ways a rule like this dies quietly — by collapsing into no rule at all, and
// by widening until it lets the wrong words through.

// 1. The ladder is GRADED, not flattened. A rung function that returned the
//    same answer for everything would satisfy "never harder before easier"
//    perfectly, and teach nothing.
const rungCounts = new Map();
for (const item of byLevel) rungCounts.set(item.rung, (rungCounts.get(item.rung) || 0) + 1);
const firstRungShare = (rungCounts.get(1) || 0) / byLevel.length;
check(`the ladder has real rungs on it (${[...rungCounts.keys()].sort().join("/")}, A1 is ${Math.round(firstRungShare * 100)}%)`,
  [1, 2, 3, 4, 5, 6].every((rung) => (rungCounts.get(rung) || 0) > 0)
  && firstRungShare > 0.03 && firstRungShare < 0.30);

// 2. Every rung is entered from ACROSS the course, not pack by pack. This is
//    the half that has never had a check: "the most useful words from every
//    category" is a promise about spread, and an order that walked the packs
//    one at a time would pass every other assertion here.
const packOfId = new Map();
for (const word of buildWordCatalog(parts)) packOfId.set(word.id, word.partKey);
for (const line of buildCatalog(parts)) if (!packOfId.has(line.id)) packOfId.set(line.id, line.partKey);
// Stated as the property, not as a pack count.
//
// "At least eight packs in the first sixty cards" was a proxy, and it encoded
// an assumption about how big a tier is. It holds easily where a level has
// thousands of cards and cannot hold at A1, where only seven packs carry a
// sentence at all and the three most useful of them fill the opening between
// them — which is most-useful-first working, not pack-walking.
//
// What must never happen is a single pack OWNING the start of a level. That is
// what pack-at-a-time walking looks like, it is what the queue actually did
// when one pack labelled A1-B1 supplied all sixty opening cards at B1, and it
// is true of a small tier and a huge one alike. Three packs sharing an opening
// half-and-quarter-and-quarter is spread; one pack taking all of it is not.
for (const source of ["words", "sentences", "mixed"]) {
  const graded = buildListenQueue(parts, {}, { contentSource: source, order: "level" });
  const openings = [1, 2, 3].map((rung) => {
    const opening = graded.filter((item) => item.rung === rung).slice(0, 60);
    const perPack = new Map();
    for (const item of opening) {
      const pack = packOfId.get(item.id);
      perPack.set(pack, (perPack.get(pack) ?? 0) + 1);
    }
    const largest = Math.max(0, ...perPack.values());
    return { packs: perPack.size, share: opening.length ? largest / opening.length : 0 };
  });
  check(`no single pack owns the start of a level of ${source} `
    + `(${openings.map((o) => `${o.packs} packs, biggest ${Math.round(o.share * 100)}%`).join("; ")})`,
    openings.every((o) => o.packs >= 3 && o.share <= 0.5));
}

// 3. The words this course says most are ALL on the first rung — the whole
//    of the promise, asserted as one statement rather than as a hand-picked
//    list that could be trimmed until it passed.
const spokenOrder = buildListenQueue(parts, {}, { contentSource: "words", order: "common" });
const strandedCore = spokenOrder.slice(0, 300).filter((item) => item.rung !== 1);
check(`the 300 words this course says most all sit on the first rung (${strandedCore.length} did not: ${strandedCore.slice(0, 5).map((item) => item.de).join(", ")})`,
  strandedCore.length === 0);
check("and the queue opens with three hundred cards of them before anything harder",
  buildListenQueue(parts, {}, { contentSource: "words", order: "level" })
    .slice(0, 300).every((item) => item.rung === 1));

// 4. ...and the rescue that does that stays NARROW. The written frequency
//    bank ranks entsprechend 111th, die Ma\ßnahme 198th and darstellen 206th:
//    that is news and web German, and reading it as "easy" would put office
//    vocabulary on the same rung as haben. Only what the course itself SAYS
//    may promote a word, so a word it never says cannot be promoted at all.
const officeWords = ["entsprechend", "die M\öglichkeit", "durchf\ühren", "darstellen", "die Ma\ßnahme"];
const wordRungOf = new Map(wordQueue.map((item) => [item.de, item.rung]));
check("office German the course never says is not rescued onto the A1 rung",
  officeWords.every((text) => (wordRungOf.get(text) ?? 0) >= 4));
check("a word with no spoken evidence keeps the rung its pack gave it",
  spokenWordRung({ level: "B1", lookup: "finden", de: "finden" }, 0, null) === 3
  && spokenWordRung({ level: "C1", lookup: "darstellen", de: "darstellen" }, 0, null) === 6);
// ...while an everyday word taught inside a B1 lesson is rescued by it. These
// are real: finden, das Problem, die T\ür, trinken and die Hilfe are all
// taught in B1 packs and are all in the three hundred this course says most.
const rescued = ["finden", "das Problem", "die T\ür", "trinken", "die Hilfe", "vergessen"];
const worstRescued = rescued.map((text) => [text, wordAt(text)]).sort((a, b) => b[1] - a[1])[0];
check(`an everyday word taught in a B1 lesson is still taught first (worst: ${worstRescued[0]} at ${worstRescued[1]})`,
  rescued.every((text) => wordRungOf.get(text) === 1 && wordAt(text) > 0 && wordAt(text) <= 400));

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

// ── the meaning is whatever the app is written in ───────────────────────
// A Listen card is two slots: the language being learned, and what it means in
// a language the learner already reads. The second one was English by
// construction — the same thing as "the app's language" while the app only
// ever spoke English or German, and no longer the same thing at all now it can
// be set to French. A learner reading a French app was still being told what
// her German meant in English, with nothing on screen to say why.
//
// Asserted from the queue rather than from the labels around it, because the
// queue is where the meaning text is decided; labels that name a language the
// lines are not in is the exact failure this pairing has to rule out.
const queueFor = (direction, app, contentSource = "sentences") => {
  setLearningDirection(direction);
  setInterfaceLanguage(app);
  return buildListenQueue(parts, {}, { contentSource, direction, order: "common" });
};

const englishApp = queueFor("learn-de", "en");
const frenchApp = queueFor("learn-de", "fr");
// The tables are fetched now, not bundled, and a card the table cannot reach
// leaves the queue — so whatever asks for them has to name the app's language
// as well as the course's. It named only the course's, and a German course in
// a French app fetched nothing, dropped all twenty thousand cards for want of
// a translation, and opened empty.
setLearningDirection("learn-de");
setInterfaceLanguage("fr");
const needsFrench = translationLanguagesNeeded("learn-de");
setInterfaceLanguage("en");
const needsNothing = translationLanguagesNeeded("learn-de");
const needsForFrenchCourse = translationLanguagesNeeded("learn-fr");
setInterfaceLanguage("fr");
check("a German course in a French app asks for the French table, which the course alone would not",
  needsFrench.join(",") === "fr"
  && needsNothing.length === 0
  && needsForFrenchCourse.join(",") === "fr");

check("the app's language is what a card is explained in",
  targetLanguage("learn-de") === "de"
  && meaningLanguageFor("de") === "fr"
  && meaningLanguageFor("en") === "fr"
  && meaningLanguageFor("fr") === "en");
check("a German course in a French app is explained in French, not English",
  frenchApp.length > 100
  && frenchApp.every((item) => item.en === frenchFor(item.de))
  && frenchApp.every((item) => item.de === englishApp.find((row) => row.id === item.id)?.de));
check("and every card it serves really has that French, rather than falling back",
  frenchApp.every((item) => Boolean(item.en && item.en.trim()))
  && frenchApp.length < englishApp.length);

// ── the first slot is the language being LEARNED, in every course ───────
// The English course used to be the exception: it kept its German first, so
// the big line at the top of the card was the one language the learner was
// not there to learn, and the translation sat underneath it in small type.
//
// Asserted as one rule over all three courses rather than course by course,
// and against the source text each side is built from, so it cannot pass by
// reading a label.
const germanOf = (id) => englishApp.find((row) => row.id === id)?.de ?? "";
const englishOf = (id) => englishApp.find((row) => row.id === id)?.en ?? "";
const LEADS_WITH = {
  "learn-de": { target: germanOf, meaning: englishOf },
  "learn-en": { target: englishOf, meaning: germanOf },
  "learn-fr": { target: (id) => frenchFor(germanOf(id)), meaning: englishOf },
};
setInterfaceLanguage("en");
for (const [direction, sides] of Object.entries(LEADS_WITH)) {
  const queue = queueFor(direction, "en");
  check(`${direction} leads with the language it teaches and explains it underneath`,
    queue.length > 100
    && queue.every((item) => item.de === sides.target(item.id))
    && queue.every((item) => item.en === sides.meaning(item.id)));
}
// ...and the meaning underneath follows the app, in the courses that can.
const englishCourseInFrench = queueFor("learn-en", "fr");
check("the English course still leads with English when the app is French",
  englishCourseInFrench.length > 100
  && englishCourseInFrench.every((item) => item.de === englishOf(item.id))
  && englishCourseInFrench.every((item) => item.en === frenchFor(germanOf(item.id))));

// The German course is untouched by any of this: it always led with German.
setInterfaceLanguage("auto");
for (const app of ["en", "de"]) {
  const unchanged = queueFor("learn-de", app);
  check(`learn-de in ${app === "de" ? "a German" : "an English"} app is the queue it always was`,
    unchanged.length === englishApp.length
    && unchanged[0]?.de === englishApp[0]?.de
    && unchanged[0]?.en === englishApp[0]?.en);
}

// Nothing explains a language in itself, so the French course in a French app
// keeps the English it had rather than printing the answer twice.
const frenchCourseInFrench = queueFor("learn-fr", "fr");
const frenchCourseInEnglish = queueFor("learn-fr", "en");
check("the French course in a French app still explains itself in English",
  frenchCourseInFrench.length > 100
  && frenchCourseInFrench.every((item) => item.de !== item.en)
  && frenchCourseInFrench.length === frenchCourseInEnglish.length
  && frenchCourseInFrench[0]?.en === frenchCourseInEnglish[0]?.en);

setLearningDirection("learn-de");
setInterfaceLanguage("auto");
stored.clear();

// ── newly added content has to be reachable, not just present ───────────
// The problem this order exists for: words added from real reading were in
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
// That measurement is gone, and what it was really measuring is worth
// recording. It asserted that 90% of the material most-common-first buries is
// served from the front half by newest-first — and it passed because the
// commonality signal in use was the corpus spread, which is largely a measure
// of how recently a pack was added: a new pack's words appear in few packs, so
// they scored rare, so the buried tail WAS the newest material and newest-first
// trivially front-loaded it. Once the order started grading by CEFR level, the
// tail became advanced vocabulary from every era of the course, and the figure
// fell to 66% — not because anything got harder to reach, but because the two
// orders finally mean different things. A hold-out test settled which signal is
// the better one: against the 2,130 words whose true frequency rank is known,
// corpus spread scores 0.399 and pack order alone scores 0.377, while the CEFR
// rung scores 0.534.
//
// So the promise is asserted directly instead: the orders differ, and
// most-common-first actually grades from common to advanced.
const shifts = commonWords
  .map((item, position) => Math.abs(position - (newestPositions.get(item.id) ?? position)))
  .sort((a, b) => a - b);
// ── the arrow keys move through the queue ───────────────────────────────────
// The arrow keys move through the queue. The
// buttons were the only way, which means a hand on the mouse for something
// done every few seconds while listening.
{
  const view = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
  check(
    "left and right step through the queue",
    view.includes('event.key !== "ArrowLeft" && event.key !== "ArrowRight"')
      && view.includes('step(event.key === "ArrowRight" ? 1 : -1)')
  );
  check(
    "a key inside a field belongs to the field, not the queue",
    view.includes("input, textarea, select, [contenteditable=")
  );
  // A key event can arrive with the window as its target, and window has no
  // closest() — casting instead of checking threw inside the handler, and the
  // arrows silently did nothing at all.
  check("the event target is checked, not cast", view.includes("target instanceof Element"));
}


check("newest-first is a different order, not most-common-first relabelled",
  buriedByCommon.length > 300
  && shifts[Math.floor(shifts.length / 2)] > commonWords.length * 0.15);

const rungByWordId = new Map(buildWordCatalog(parts).map((word) => [word.id, wordLadderRung(word)]));
const rungsOf = (items) => items
  .map((item) => rungByWordId.get(item.id))
  .filter((rung) => rung != null)
  .sort((a, b) => a - b);
const headRungs = rungsOf(commonWords.slice(0, Math.floor(commonWords.length * 0.1)));
const tailRungs = rungsOf(commonWords.slice(Math.floor(commonWords.length * 0.9)));
check("most-common-first actually grades from everyday to advanced",
  headRungs.length > 100 && tailRungs.length > 100
  && headRungs[Math.floor(headRungs.length / 2)] <= 2
  && tailRungs[Math.floor(tailRungs.length / 2)] >= 4);

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
  DEFAULT_TARGET_REPEATS === 2
  && DEFAULT_MEANING_REPEATS === 1
  && DEFAULT_LISTEN_LANGUAGE_ORDER === "meaning-first"
  && getListenTargetRepeats("learn-de") === 2
  && getListenMeaningRepeats("learn-de") === 1
  && getListenLanguageOrder("learn-de") === "meaning-first");
// One set of defaults for every course now. They needed their own only
// because the settings were named after languages and the English course's
// languages sat the other way round; named after the SIDES, the two courses
// want the same thing and say so.
check("every course defaults the same way, because the settings are about sides",
  ["learn-en", "learn-fr"].every((direction) =>
    getListenTargetRepeats(direction) === 2
    && getListenMeaningRepeats(direction) === 1
    && getListenLanguageOrder(direction) === "meaning-first"));
// A count somebody chose under the old, language-shaped names still applies
// to the line they chose it for. The English course is the one that moves:
// its "english repeats" was the count for the line being learned.
stored.clear();
stored.set("gl-listen-german-repeats:learn-en", "1");
stored.set("gl-listen-english-repeats:learn-en", "5");
stored.set("gl-listen-language-order:learn-en", "german-first");
stored.set("gl-listen-german-repeats:learn-de", "4");
stored.set("gl-listen-english-repeats:learn-de", "3");
stored.set("gl-listen-language-order:learn-de", "german-first");
check("a count chosen under the old names still applies to the same line",
  getListenTargetRepeats("learn-en") === 5
  && getListenMeaningRepeats("learn-en") === 1
  && getListenLanguageOrder("learn-en") === "meaning-first"
  && getListenTargetRepeats("learn-de") === 4
  && getListenMeaningRepeats("learn-de") === 3
  && getListenLanguageOrder("learn-de") === "target-first");
stored.clear();
setLearningDirection("learn-de");
setInterfaceLanguage("auto");
check("the next card waits 1.1 seconds by default",
  DEFAULT_NEXT_CARD_DELAY_MS === 1100 && getListenNextCardDelayMs() === 1100);
check("Listen defaults to a real learning loop rather than one-pass exposure",
  DEFAULT_LISTEN_LOOP_ITEMS === 3
  && DEFAULT_LISTEN_LOOP_PASSES === 2
  && getListenLoopItems("learn-de") === 3
  && getListenLoopPasses("learn-de") === 2);
check("Both defaults to one word and two sentences per loop",
  DEFAULT_LISTEN_MIXED_COUNTS.words === 1
  && DEFAULT_LISTEN_MIXED_COUNTS.sentences === 2
  && JSON.stringify(getListenMixedCounts("learn-de")) === JSON.stringify({ words: 1, sentences: 2 }));
setListenMixedCounts({ words: 2, sentences: 1 }, "learn-de");
setListenMixedCounts({ words: 1, sentences: 4 }, "learn-en");
check("each course remembers its own Both split",
  JSON.stringify(getListenMixedCounts("learn-de")) === JSON.stringify({ words: 2, sentences: 1 })
  && JSON.stringify(getListenMixedCounts("learn-en")) === JSON.stringify({ words: 1, sentences: 4 }));
const mixedFixture = [
  ...Array.from({ length: 5 }, (_, i) => ({ id: `w${i}`, kind: "word" })),
  ...Array.from({ length: 7 }, (_, i) => ({ id: `s${i}`, kind: "sentence" })),
];
check("Both emits exact 1+2 chunks while preserving each lane's order",
  arrangeListenMixedQueue(mixedFixture, { words: 1, sentences: 2 }).map((item) => item.id).join(",")
    === "w0,s0,s1,w1,s2,s3,w2,s4,s5,w3,s6,w4");
check("Both emits exact 2+1 chunks and drains the available tail without duplication",
  arrangeListenMixedQueue(mixedFixture, { words: 2, sentences: 1 }).map((item) => item.id).join(",")
    === "w0,w1,s0,w2,w3,s1,w4,s2,s3,s4,s5,s6");
stored.set("gl-listen-mixed-counts-v1:learn-de", "not-json");
check("corrupt Both counts fall back safely",
  JSON.stringify(getListenMixedCounts("learn-de")) === JSON.stringify({ words: 1, sentences: 2 }));
check("Both count writers keep at least one of each and cap the combined loop at twelve",
  JSON.stringify(setListenMixedCounts({ words: 20, sentences: 20 }, "learn-de")) === JSON.stringify({ words: 11, sentences: 1 }));
check("Listen defaults to both trackers, easiest level first",
  getListenContentSource("learn-de") === "mixed"
  && getListenQueueOrder("learn-de") === "level");
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
setListenTargetRepeats(3, "learn-de");
setListenMeaningRepeats(4, "learn-de");
setListenLanguageOrder("target-first", "learn-de");
setListenLoopItems(4, "learn-de");
setListenLoopPasses(3, "learn-de");
setListenTargetRepeats(5, "learn-en");
setListenMeaningRepeats(6, "learn-en");
setListenLanguageOrder("meaning-first", "learn-en");
setListenLoopItems(6, "learn-en");
setListenLoopPasses(4, "learn-en");
stored.set("gl-listen-next-card-delay-ms", "2500");
check("each course keeps its own language and learning-loop repetition plan",
  getListenTargetRepeats("learn-de") === 3
  && getListenMeaningRepeats("learn-de") === 4
  && getListenLanguageOrder("learn-de") === "target-first"
  && getListenLoopItems("learn-de") === 4
  && getListenLoopPasses("learn-de") === 3
  && getListenTargetRepeats("learn-en") === 5
  && getListenMeaningRepeats("learn-en") === 6
  && getListenLanguageOrder("learn-en") === "meaning-first"
  && getListenLoopItems("learn-en") === 6
  && getListenLoopPasses("learn-en") === 4);
check("the next-card delay is the learner's to change", getListenNextCardDelayMs() === 2500);

// ── the gap between the two languages ───────────────────────────────────
//
// The next-card delay above pauses AFTER both languages have been spoken, so
// it can only pace how fast cards arrive. The silence that matters is inside
// a card, between the German and the English, so the listener can say the
// German themselves before the card tells them.
stored.set("gl-listen-language-gap-ms", "3000");
check("the gap between languages is the learner's to change",
  DEFAULT_LANGUAGE_GAP_MS === 0 && getListenLanguageGapMs() === 3000);
stored.set("gl-listen-language-gap-ms", "999999");
check("a corrupt gap falls back to the documented default rather than stalling playback",
  getListenLanguageGapMs() === 0);
check("the gap writer clamps to safe limits",
  setListenLanguageGapMs(99_000) === 30_000 && setListenLanguageGapMs(-5) === 0);

const plan = (options) => buildListenSpeechPlan({
  de: "das Haus", en: "the house", meaningLang: "en-GB",
  targetRepeats: 2, meaningRepeats: 2, languageGapMs: 3000,
  languageOrder: "meaning-first", ...options,
});
const gapsIn = (clips) => clips.map((clip, index) => [index, clip.pauseBeforeMs])
  .filter(([, ms]) => ms != null);

check("the gap is held once, where the card changes language",
  JSON.stringify(gapsIn(plan({}))) === JSON.stringify([[2, 3000]])
  && plan({})[2].side === "target");
check("target first puts the same gap ahead of the meaning",
  JSON.stringify(gapsIn(plan({ languageOrder: "target-first" }))) === JSON.stringify([[2, 3000]])
  && plan({ languageOrder: "target-first" })[2].side === "meaning");
check("repeats of one language stay back-to-back — the gap is not between them",
  plan({ targetRepeats: 4, meaningRepeats: 4 }).filter((clip) => clip.pauseBeforeMs).length === 1
  && gapsIn(plan({ targetRepeats: 4, meaningRepeats: 4 }))[0][0] === 4);
check("a zero gap leaves the sequence exactly as it was",
  plan({ languageGapMs: 0 }).every((clip) => clip.pauseBeforeMs === undefined));
check("a card with only one language has no switch to pause at",
  plan({ targetRepeats: 0 }).every((clip) => clip.pauseBeforeMs === undefined)
  && plan({ meaningRepeats: 0 }).every((clip) => clip.pauseBeforeMs === undefined));
stored.set("gl-listen-target-repeats:learn-de", "99");
stored.set("gl-listen-meaning-repeats:learn-de", "0");
stored.set("gl-listen-side-order:learn-de", "invalid");
// Corrupt under the old names too, so a bad legacy value cannot creep in
// through the migration once the current one has been rejected.
stored.set("gl-listen-german-repeats:learn-de", "99");
stored.set("gl-listen-english-repeats:learn-de", "0");
stored.set("gl-listen-language-order:learn-de", "invalid");
stored.set("gl-listen-content-source:learn-de", "invalid");
stored.set("gl-listen-queue-order:learn-de", "invalid");
stored.set("gl-listen-loop-items:learn-de", "99");
stored.set("gl-listen-loop-passes:learn-de", "0");
stored.set("gl-listen-next-card-delay-ms", "999999");
check("corrupt Listen settings fall back to documented defaults",
  getListenTargetRepeats("learn-de") === 2
  && getListenMeaningRepeats("learn-de") === 1
  && getListenLanguageOrder("learn-de") === "meaning-first"
  && getListenContentSource("learn-de") === "mixed"
  && getListenQueueOrder("learn-de") === "level"
  && getListenLoopItems("learn-de") === 3
  && getListenLoopPasses("learn-de") === 2
  && getListenNextCardDelayMs() === 1100);
check("Listen setting writers clamp typed values to safe limits",
  setListenTargetRepeats(99, "learn-de") === 10
  && setListenMeaningRepeats(-4, "learn-de") === 1
  && setListenContentSource("invalid", "learn-de") === "mixed"
  && setListenQueueOrder("invalid", "learn-de") === "level"
  && setListenQueueOrder("level", "learn-de") === "level"
  && setListenQueueOrder("newest", "learn-de") === "newest"
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
  && prototype.includes("learningDirection={getLearningDirection()}"));

const view = read("src/components/listen/ListenView.tsx");
const sides = (options) => plan(options).map((clip) => clip.side).join(" ");
check("both languages are scheduled in the learner-selected order",
  view.includes("ttsSequence(")
  && view.includes("buildListenSpeechPlan({")
  && sides({}) === "meaning meaning target target"
  && sides({ languageOrder: "target-first" }) === "target target meaning meaning"
  && plan({}).some((clip) => clip.lang === "de-DE")
  && plan({}).some((clip) => clip.lang === "en-GB"));
check("German and English repeat independently",
  sides({ targetRepeats: 3, meaningRepeats: 1 }) === "meaning target target target"
  && sides({ targetRepeats: 1, meaningRepeats: 4 }) === "meaning meaning meaning meaning target");
check("reviewed word cards explain important secondary meanings on screen",
  view.includes('item.kind === "word" && item.use') && view.includes("{item.use}"));
// The player has to agree with the queue about which slot holds which
// language, or the labels, the voice and the mute switch all name a language
// the lines are not in. And the queue has to rebuild when the app language
// changes: the meaning is baked into the item, so re-rendering alone leaves
// French labels reading English text.
// The dependency array of the memo that builds the queue, read the same way
// the tracker check reads its filter memos: anchored backwards from the call,
// so it cannot latch onto some earlier memo and answer about that instead.
const queueCall = view.indexOf("buildListenQueue(apiParts");
const queueMemoStart = view.lastIndexOf("useMemo<ListenItem[]>(", queueCall);
const queueMemoClose = view.indexOf("\n    [", queueMemoStart);
const queueMemoDeps = view.slice(queueMemoClose, view.indexOf("]", queueMemoClose) + 1);
check("the queue memo's dependencies could be read at all",
  queueCall > 0 && queueMemoStart > 0 && queueMemoClose > queueCall && queueMemoDeps.includes("apiParts"));

check("the player reads its two languages from the course and the app, not from the slot names",
  view.includes("const courseLanguage = targetLanguage(learningDirection);")
  && view.includes("const meaningLanguage = meaningLanguageFor(courseLanguage, appLanguage);")
  // One form, no course-by-course branch: the first slot is the language
  // being learned, always. A ternary here is how the English course came to
  // lead with its German.
  && view.includes("{ de: courseLanguage, en: meaningLanguage };")
  && !view.includes("? { de: meaningLanguage")
  && view.includes("const appLanguage = useInterfaceLanguage();")
  // By membership, not by the literal tail of the array. Pinning the exact
  // string made every later dependency — a filter, a new revision counter —
  // look like a language regression, which is a check failing for a reason it
  // is not about.
  && queueMemoDeps.includes("meaningLanguage")
  && queueMemoDeps.includes("profile")
  && queueMemoDeps.includes("queueOrder")
  && queueMemoDeps.includes("translationsRevision")
  // ...and it redraws when a fetched table lands, so switching the app's
  // language while Listen is open does not blank the screen for the length of
  // a download and then fill it in.
  && view.includes("TRANSLATIONS_LOADED_EVENT")
  && view.includes("void ensureTranslations(meaningLanguage);"));

// The plan sentence names the two languages rather than spelling them out:
// the third course made "English ..., then German ..." a sentence that is
// simply false on screen. The counts and the order still have to be visible,
// which is what this was always for.
check("the playback plan, order switch, and typed repeat counts are visible",
  view.includes('"{meaning} {en}×, then {target} {de}×"')
  && view.includes('"{target} {de}×, then {meaning} {en}×"')
  && view.includes('data-testid={`listen-order-${value}`}')
  && view.includes('testId="listen-target-repeats"')
  && view.includes('testId="listen-meaning-repeats"'));
check("whole items return through a visible, learner-controlled learning loop",
  view.includes("listenQueueIndexForPlayhead(")
  && view.includes("listenPlayheadForQueueIndex(")
  && view.includes('testId="listen-loop-items"')
  && view.includes('testId="listen-loop-passes"')
  && view.includes('"Learning pass {pass} of {passes}"'));
check("Both exposes independent word and sentence loop counts and preserves the current card",
  view.includes('testId="listen-loop-words"')
  && view.includes('testId="listen-loop-sentences"')
  && view.includes("const currentId = item?.id")
  && view.includes("nextQueue.findIndex((candidate) => candidate.id === currentId)")
  && view.includes("next.words + next.sentences"));
// Easiest first is the default order now, and a walk up through the levels is
// only a walk if you can see which rung you are on.
//
// A sentence shows the level its pack is filtered by; a word has no pack level
// worth showing (its rung is its own difficulty, which is the point of
// spokenWordRung) and keeps the rung label. Both branches stay present: losing
// the fallback would blank the badge on every word card.
check("the card says which rung it is on, and the picker offers the order by name",
  view.includes("{item.levelLabel ? <> · {item.levelLabel}</> : item.rung ? <> · {cefrRungLabel(item.rung)}</> : null}")
  && view.includes('"level", "Easiest first (A1 → C1)",'));
/**
 * Narrowing, as distinct from reordering.
 *
 * Every order plays the whole catalogue and only argues about what comes
 * first, so there was no way to work through one level and stop. These two
 * read the same categories the trackers narrow by, so asking for A2 in Listen
 * and asking for it in the word list mean the same thing.
 */
const everything = buildListenQueue(parts, {}, { contentSource: "mixed", order: "level" });
const justA2 = buildListenQueue(parts, {}, { contentSource: "mixed", order: "level", levels: ["a2"] });
const justEssential = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", usefulness: ["essential"],
});
check(`the level filter narrows the queue (${everything.length} to ${justA2.length})`,
  justA2.length > 0 && justA2.length < everything.length
  && justA2.every((card) => !card.levelLabel || card.levelLabel === "A2"));
check(`the usefulness filter narrows the queue (${everything.length} to ${justEssential.length})`,
  justEssential.length > 0 && justEssential.length < everything.length);
check("narrowing by both is narrower than either alone",
  buildListenQueue(parts, {}, {
    contentSource: "mixed", order: "level", levels: ["a2"], usefulness: ["essential"],
  }).length <= Math.min(justA2.length, justEssential.length));

/**
 * SEVERAL levels at once, which is the whole reason these stopped being
 * radios: "A1 and A2, nothing above" is the question a learner near the start
 * of a course actually has, and one-of-six cannot ask it.
 */
const justA1 = buildListenQueue(parts, {}, { contentSource: "mixed", order: "level", levels: ["a1"] });
const a1PlusA2 = buildListenQueue(parts, {}, { contentSource: "mixed", order: "level", levels: ["a1", "a2"] });
check(`two levels together is the sum of both, not one of them (${justA1.length} + ${justA2.length} = ${a1PlusA2.length})`,
  a1PlusA2.length === justA1.length + justA2.length && justA1.length > 0);
check("and every card in it is one of the two levels asked for",
  a1PlusA2.every((card) => !card.levelLabel || card.levelLabel === "A1" || card.levelLabel === "A2"));

// Empty means everything, not nothing — unticking the last box has to be the
// same as never having filtered, or the control is a trap.
check("no levels selected plays every level",
  buildListenQueue(parts, {}, { contentSource: "mixed", order: "level", levels: [] }).length === everything.length);
check("no bands selected plays every band",
  buildListenQueue(parts, {}, { contentSource: "mixed", order: "level", usefulness: [] }).length === everything.length);

// Several bands, and a value the controls cannot show is ignored rather than
// silently narrowing the queue to something nothing can undo.
const twoBands = buildListenQueue(parts, {}, {
  contentSource: "mixed", order: "level", usefulness: ["essential", "everyday"],
});
check(`two usefulness bands is wider than one (${justEssential.length} -> ${twoBands.length})`,
  twoBands.length > justEssential.length);

/**
 * And a filter must never be a one-way door. The no-cards return sits above
 * the panel holding the filter buttons, so an empty result hides the only
 * controls that could widen it: the empty state has to say a filter did this
 * and offer the way back, or the setting can only be undone by clearing
 * storage.
 */
check("an empty queue caused by a filter says so and offers the way back",
  view.includes('data-testid="listen-clear-filters"')
  && view.includes("const narrowed = levelFilter.size > 0 || usefulnessFilter.size > 0")
  && view.includes('ui("Nothing matches those filters")'));
check("the filters are offered as controls, not just honoured in code",
  view.includes("data-testid={`listen-level-${value}`}")
  && view.includes("data-testid={`listen-usefulness-${option.key}`}")
  && view.includes("toggleLevelFilter(")
  && view.includes("toggleUsefulnessFilter("));
// Ticking rather than picking. aria-pressed is what tells a screen reader
// these combine; role="radio" would say the opposite of what they now do.
check("the filter buttons say they are toggles, not a one-of-six choice",
  view.includes("aria-pressed={selected}")
  && !/aria-label=\{ui\("Level"\)\}[\s\S]{0,200}?role="radiogroup"/u.test(view)
  && !/aria-label=\{ui\("Usefulness"\)\}[\s\S]{0,200}?role="radiogroup"/u.test(view));
// Pack filtering already reaches Listen through withoutMutedPacks. What was
// missing is that nothing said so, which is why it read as absent.
check("the panel says pausing a pack keeps it out of Listen",
  view.includes('ui("Packs")')
  && /paused? on the Learn screen is left out of Listen/u.test(view));

// The same failure the two trackers shipped with: a filter read by the memo
// but missing from its dependency array is a control that moves and changes
// nothing. Asserted here BEFORE it can happen rather than after somebody
// reports the buttons doing nothing.
check("the queue rebuilds when a filter changes",
  queueMemoDeps.includes("levelFilter") && queueMemoDeps.includes("usefulnessFilter"));

check("Listen exposes real source and queue-order controls",
  view.includes('data-testid={`listen-source-${value}`}')
  && view.includes('data-testid={`listen-queue-${value}`}')
  && view.includes("setListenContentSource(")
  && view.includes("setListenQueueOrder("));
check("the next-card delay is visible and drives auto-advance",
  view.includes('testId="listen-next-card-delay"')
  && view.includes("}, nextCardDelayMs);"));
check("the language gap is a visible setting that reaches the player",
  view.includes('testId="listen-language-gap"')
  && view.includes("setListenLanguageGapMs(seconds * 1000)")
  && view.includes("languageGapMs,")
  && view.includes("buildListenSpeechPlan({"));
// A silent gap and a dead player look identical. Whoever is holding the
// silence has to say so, and stop saying so the moment playback is paused.
check("the held gap says whose turn it is, and stops saying it when playback does",
  view.includes('data-testid="listen-your-turn"')
  && view.includes('"Your turn — say it in German"')
  && view.includes('"Your turn — say it in English"')
  && view.includes("onPause: (holding: boolean) => setYourTurn(holding && runRef.current === run)")
  && /return \(\) => \{[\s\S]{0,400}setYourTurn\(false\);/.test(view));
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

const i18n = read("src/lib/i18n.ts")
  // The German table lives in its own file so it can be fetched rather than
  // bundled; i18n.ts holds the machinery. Both are read so neither is lost.
  + read("src/lib/i18nDe.ts");
for (const key of [
  "Both languages repeat in small learning loops while you do something else.",
  "{meaning} {en}×, then {target} {de}×",
  "{target} {de}×, then {meaning} {en}×",
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
  "Easiest first works through the course by level — all of A1, then A2, then B1 — with the most useful card leading each level. Most common first teaches the phrases and words people are most likely to use, whatever level they are. Newest first plays the packs added most recently, so new content is heard instead of waiting behind thousands of commoner items.",
  "Easiest first (A1 → C1)",
  "Newest first",
  "Reviews & struggles first",
  "Least heard first",
  "Show both languages on the pet",
  "Keep {target} and {meaning} together in the pet bubble. Turn this off to show only the line currently being spoken.",
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


// ── the page leads with the display face where the dashboard does ───────
// Rounded lettering on the hero pair only (the language-tagged word and its
// meaning); captions and descriptions match the dashboard's small-size text
// face. Blanket-rounding every <p>/<small> was tried and looked clunky at
// 11-13px on Windows — this pins the split so neither half regresses.
const listenView = read("src/components/listen/ListenView.tsx");
const css = read("src/index.css");

// ── getting somewhere other than the next card ──────────────────────────────
// The queue is twenty-three thousand long and the only way through it was the
// next-arrow, one card a press. A bar for roughly where, a box for exactly
// where.
check(
  "the queue can be moved through without pressing next repeatedly",
  listenView.includes('data-testid="listen-scrub"')
    && /type="range"/.test(listenView)
    && listenView.includes('id="listen-jump"')
    && /\.listen-scrub__bar\s*\{/.test(css)
);
check(
  "a jump goes through the same primitive resume uses, so it wraps and clamps",
  /jumpToQueueIndex\s*=\s*\(index: number\)/.test(listenView)
    && /listenPlayheadForQueueIndex\(index, queue\.length, effectiveLoopItems, loopPasses\)/.test(listenView)
    && /Math\.min\(Math\.max\(1, Math\.round\(wanted\)\), queue\.length\) - 1/.test(listenView)
);
check(
  "dragging the bar does not synthesise a clip per pixel on the way past",
  // The value is held locally while dragging and committed on release; a
  // direct onChange->jump would fire on every step of the drag.
  /onChange=\{\(event\) => setScrubAt\(Number\(event\.target\.value\)\)\}/.test(listenView)
    && /onPointerUp=\{\(\) => \{ if \(scrubAt !== null\)/.test(listenView)
);
check(
  "a jump tears down the current card the same way an arrow press does",
  /const leaveCurrentItem = \(\) => \{/.test(listenView)
    && /const jumpToQueueIndex[\s\S]{0,400}leaveCurrentItem\(\);/.test(listenView)
    && /const step = \(direction: 1 \| -1\) => \{\s*leaveCurrentItem\(\);/.test(listenView)
);

// ── the collapsed player says where you are ─────────────────────────────────
// It showed one card and no count, so 3-of-20 and 19-of-20 looked identical.
// The scrub bar and the full view both carry the position; the mini player
// was the one place you could not tell.
check(
  "the background player shows the position in the queue",
  /listen-mini-player__pos/.test(listenView)
    && /uiNumber\(queueIndex \+ 1\)\} \/ \{uiNumber\(queue\.length\)/.test(listenView)
);
check(
  "the count survives a narrow player — the label gives way instead",
  // A plain flex row would push the last child out first, and the count is
  // the last child. The label ellipses; the count does not shrink.
  /\.listen-mini-player__state\s*\{[^}]*text-overflow:\s*ellipsis/s.test(css)
    && /\.listen-mini-player__pos\s*\{[^}]*flex:\s*0 0 auto/s.test(css)
);
check(
  "Listen rounds the hero pair and keeps small copy on the dashboard's text face",
  listenView.includes('className="listen-view mx-auto w-full max-w-7xl space-y-4"')
    && listenView.includes('lang="de"')
    && /\.new-ui-prototype \.listen-view p,\s*\.new-ui-prototype \.listen-view small,\s*\.listen-view p,\s*\.listen-view small \{\s*font-family: var\(--np-font-text/.test(css)
    && /\.new-ui-prototype \.listen-view p\[lang\],\s*\.listen-view p\[lang\] \{\s*font-family: var\(--np-font-display/.test(css)
);

// ── the player really does hold the silence ─────────────────────────────
//
// Everything above proves the gap is asked for. This runs the REAL sequencer
// and times it, because the two ways this can break are both invisible to a
// plan: not waiting at all, and — worse — not letting go. A gap that outlived
// Pause would advance the card seconds after the learner stopped it, which is
// why the wait is abortable rather than a plain sleep.
const elapsed = (from) => Date.now() - from;

void (async () => {
  const held = [];
  const heldStart = Date.now();
  await ttsSequence([
    { text: "the house", lang: "en-GB" },
    {
      text: "das Haus",
      lang: "de-DE",
      pauseBeforeMs: 400,
      onPause: (holding) => held.push([holding, elapsed(heldStart)]),
    },
  ]);
  check("a gap in the sequence is actually waited out",
    held.length === 2 && held[0][0] === true && held[1][0] === false
    && held[1][1] - held[0][1] >= 380);

  const cutStart = Date.now();
  const running = ttsSequence([
    { text: "the house", lang: "en-GB" },
    { text: "das Haus", lang: "de-DE", pauseBeforeMs: 8000 },
  ]);
  setTimeout(stopTts, 200);
  await running;
  check("pausing during the gap releases it at once instead of advancing later",
    elapsed(cutStart) < 2000);

  // A gap ahead of a voice that has been muted is silence for nothing.
  stored.set("gl-audio-settings-v1", JSON.stringify({
    masterVolume: 1, germanVolume: 0, englishVolume: 1,
  }));
  const mutedStart = Date.now();
  await ttsSequence([
    { text: "the house", lang: "en-GB" },
    { text: "das Haus", lang: "de-DE", pauseBeforeMs: 4000 },
  ]);
  check("no gap is held for a language that has been muted",
    elapsed(mutedStart) < 1500);

  delete global.window;
  delete global.localStorage;

  // The card owns the gap between its lines, and no line brings its own.
  //
  // Which lines an item has varies - a counter, the word, its translation,
  // and then a register pill, a use note or a list of synonyms only when the
  // item carries one. Setting the distance per line meant the rhythm changed
  // between cards as well as down a card: 16px under the counter, 12px under
  // the rest, 24px above the rule and 20px below it.
  const listenCss = read("src/index.css");
  const listenView = read("src/components/listen/ListenView.tsx");
  const cardBlock = listenCss.slice(listenCss.indexOf(".listen-card {"), listenCss.indexOf(".listen-card:has("));
  check(
    "the listen card sets one gap for every line it holds",
    cardBlock.includes("gap: 14px")
  );
  check(
    "the rule above the review controls has the same gap on both sides",
    listenCss.includes(".listen-card-review {") && listenCss.includes("padding-top: 14px")
  );
  // From just inside the card's opening tag: the card's own top margin is its
  // distance from the player above it, which is not part of this rhythm.
  const cardOpen = listenView.indexOf('className="listen-card');
  const cardMarkup = listenView.slice(listenView.indexOf(">", cardOpen), listenView.indexOf("listen-card-review"));
  check(
    "no line inside the card carries a margin of its own",
    !/className="[^"]*\bmt-\d/.test(cardMarkup)
  );
  // ── nothing below the card moves when the queue advances ──────────────
  // A floor is not enough, and a floor was what shipped: measured over 176
  // cards from across the queue, the card came out at five different heights
  // — 360, 370, 388, 411 and 425 — and every one of those steps walked Play,
  // Back and Next down the page. Someone pressing Next repeatedly clicks
  // where the button was. One height now, taken whether the item needs it.
  check(
    "the listen card is one height, not a floor it can grow past",
    cardBlock.includes("height: 440px;") && !cardBlock.includes("min-height:")
  );
  // ...and the one control that must stay reachable does, on the rarer item
  // that still overruns and scrolls inside the card.
  const reviewRule = listenCss.slice(
    listenCss.indexOf(".listen-card-review {"),
    listenCss.indexOf("}", listenCss.indexOf(".listen-card-review {"))
  );
  check(
    "the grading row stays on screen while a long card scrolls",
    reviewRule.includes("position: sticky;")
    && reviewRule.includes("bottom: 0;")
    && reviewRule.includes("background: var(--surface-2);")
  );
  // Every word is its own box so it can be hovered, and a box has padding.
  // Padding is width: at this size it put half a space again between every
  // pair of words, and "Setz dich doch" read as three separate things. The
  // padding stays and stops counting.
  check(
    "a word's hover padding does not push the next word along",
    listenCss.includes(".listen-sentence .fs-word {")
    && listenCss.slice(listenCss.indexOf(".listen-sentence .fs-word {"), listenCss.indexOf(".listen-sentence .fs-word {") + 200).includes("margin-inline: -0.08em;")
    && listenCss.includes("padding: 0.1em 0.08em 0.14em;")
  );
  if (failures > 0) {
    console.error(`\n${failures} listen-mode check(s) failed`);
    process.exit(1);
  }
  console.log("\nListen mode stays passive: damped grades, honest queue, wired UI");
  // Modules loaded under the window polyfill may have armed timers; exit
  // explicitly so a green run doesn't idle until the CI step times out.
  process.exit(0);
})();
