#!/usr/bin/env node
/**
 * Matcher: the tracker in pairs, endlessly.
 *
 * Leon: "add another button called Matcher where you just see the english and
 * german and you are just continuously doing either words or sentences from
 * our trackers, matching constantly/endlessly in progression like
 * guidedsession".
 *
 * Three things can quietly break it and none of them look broken:
 *
 *  - a board holding two tiles that read the same has no solution, and the
 *    learner concludes they are wrong rather than that the board is;
 *  - a board that does not advance serves the same six words for ever, which
 *    is the opposite of "in progression";
 *  - grading it would promote words on recognition with the answer already on
 *    screen, which is the line the app draws for Listen.
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
      'export { buildMatcherQueue, buildMatcherBoard, dealColumns, matcherDifficulty, matcherStreakAfterMiss, getMatcherCursor, setMatcherCursor, matcherResumeFrom, getMatcherMissed, setMatcherMissed, rememberMiss, matcherMissedPairs, MATCHER_MISSED_LIMIT, MATCHER_BOARD_SIZE, MATCHER_MAX_BOARD_SIZE, MATCHER_MAX_STEP } from "./src/lib/matcher.ts";',
      'export { matchingVisibleKey } from "./src/lib/germanTextMatch.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "matcher-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

// The queue builder reads browser storage on the way past.
const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("matcher-check", module);
compiled.filename = path.join(root, ".matcher-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints, buildApiPartFromResolved,
  buildMatcherQueue, buildMatcherBoard, dealColumns, matcherDifficulty, matcherStreakAfterMiss,
  getMatcherCursor, setMatcherCursor, matcherResumeFrom,
  getMatcherMissed, setMatcherMissed, rememberMiss, matcherMissedPairs, MATCHER_MISSED_LIMIT,
  MATCHER_BOARD_SIZE, MATCHER_MAX_BOARD_SIZE, MATCHER_MAX_STEP,
  matchingVisibleKey,
} = compiled.exports;

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}

for (const kind of ["words", "sentences"]) {
  const queue = buildMatcherQueue(parts, kind, null);
  assert.ok(queue.length > 1000, `only ${queue.length} ${kind} to match`);
  assert.ok(queue.every((pair) => pair.de && pair.en), `a ${kind} pair is missing a side`);

  // Progression: the queue is the course's order, so the first board is the
  // material a learner meets first rather than a random handful.
  const first = buildMatcherBoard(queue, 0);
  assert.strictEqual(first.pairs.length, MATCHER_BOARD_SIZE, `the first ${kind} board is short`);
  assert.deepStrictEqual(
    first.pairs.map((pair) => pair.id),
    queue.slice(0, MATCHER_BOARD_SIZE).map((pair) => pair.id),
    `the first ${kind} board is not the head of the queue`
  );

  // Solvable: no two tiles in a column may read the same, or the board has no
  // one-to-one answer and the learner is marked wrong for being right.
  let from = 0;
  for (let round = 0; round < 40; round += 1) {
    const board = buildMatcherBoard(queue, from);
    assert.strictEqual(board.pairs.length, MATCHER_BOARD_SIZE,
      `${kind} board ${round} came up short at ${from}`);
    const german = board.pairs.map((pair) => matchingVisibleKey(pair.de, "de"));
    const english = board.pairs.map((pair) => matchingVisibleKey(pair.en, "en"));
    assert.strictEqual(new Set(german).size, german.length,
      `two ${kind} tiles read the same in German at ${from}: ${board.pairs.map((p) => p.de).join(" | ")}`);
    assert.strictEqual(new Set(english).size, english.length,
      `two ${kind} tiles read the same in English at ${from}: ${board.pairs.map((p) => p.en).join(" | ")}`);
    assert.notStrictEqual(board.nextFrom, from, `the ${kind} queue stopped advancing at ${from}`);
    from = board.nextFrom;
  }

  // Endless: running off the end comes back to the beginning rather than
  // emptying out.
  const wrapped = buildMatcherBoard(queue, queue.length - 2);
  assert.strictEqual(wrapped.pairs.length, MATCHER_BOARD_SIZE,
    `${kind} runs out at the end of the queue instead of wrapping`);
}

// The deal is stable for a given board: a re-render must not move the tiles
// under the cursor, and the two columns must not be in the same order or the
// answer is "the one opposite".
{
  const queue = buildMatcherQueue(parts, "words", null);
  const board = buildMatcherBoard(queue, 0);
  const once = dealColumns(board.pairs);
  const twice = dealColumns(board.pairs);
  assert.deepStrictEqual(once.german.map((p) => p.id), twice.german.map((p) => p.id),
    "the same board deals differently each render");
  assert.notDeepStrictEqual(once.german.map((p) => p.id), once.english.map((p) => p.id),
    "both columns are in the same order, so every answer is the tile opposite");
  assert.strictEqual(new Set(once.german.map((p) => p.id)).size, board.pairs.length,
    "the deal dropped or duplicated a pair");
}

// MATCHING does not grade; DECLARING does.
//
// Pairing six visible cards is recognition with the answer on screen, so it
// must promote nothing — that line is the same one Listen draws. But Leon
// asked for Know it and a level menu here, and pressing those is a statement
// about what you know, exactly as the lesson's skip button is. So the rule is
// not "this screen never writes", it is "the matching never writes".
{
  const view = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");

  // The matching handler, on its own.
  const chooseStart = view.indexOf("const choose = useCallback(");
  assert.ok(chooseStart > 0, "the matching handler has been renamed");
  const chooseEnd = view.indexOf("/** Say you already have it", chooseStart);
  assert.ok(chooseEnd > chooseStart, "cannot tell where the matching handler ends");
  const chooseSource = view.slice(chooseStart, chooseEnd);
  for (const writer of ["recordListenGrade", "saveGradeStore", "recordSuccess", "setListenReviewLevel", "snoozeListenItem", "setItemStatus"]) {
    assert.ok(!chooseSource.includes(writer),
      `matching a pair writes progress through ${writer} — recognition must stay unscored`);
  }

  // And the declarations do write, or the buttons are decoration.
  assert.ok(/const markKnown = useCallback\([\s\S]{0,400}?setListenReviewLevel\(pair, 5, profile\)/.test(view),
    "Know it does not record anything");
  assert.ok(/const applyLevel = useCallback\([\s\S]{0,400}?setListenReviewLevel\(pair, level, profile\)/.test(view),
    "the level menu does not record anything");
  assert.ok(/const putOff = useCallback\([\s\S]{0,300}?snoozeListenItem\(pair, days, profile\)/.test(view),
    "Put off does not delay anything");
  assert.ok(/undoListenReviewChange\(pending\.change, profile\)/.test(view),
    "a mark made here cannot be taken back");
  assert.ok(view.includes('data-testid="matcher-know-all"') && /const knowAll = useCallback\(/.test(view),
    "there is no way to clear the whole board at once");

  // Tapping a card speaks it, through the one door that honours the mixer.
  assert.ok(/void tts\(text, side === "de" \? 0\.88 : 0\.95, side === "de" \? "de-DE" : englishLang\)/.test(view),
    "tapping a card does not speak it");
  assert.ok(!/getTtsAudioVolume|audioMuted|masterVolume/.test(view),
    "the Matcher checks the volume itself instead of letting tts() do it — that is how a "
    + "surface drifts out of step with the mixer");
  assert.ok(/const pair = board\.pairs\.find\(\(entry\) => entry\.id === id\);\s*\n\s*if \(pair\) speak\(pair, side\);/.test(view),
    "the spoken word is not the card that was pressed");

  assert.ok(/Matching itself changes nothing/.test(view),
    "the Matcher does not tell the learner which of its buttons count");
  // Two clicks inside one frame used to score a miss on a correct pair.
  assert.ok(view.includes("pickedRef.current"),
    "the Matcher reads its selection from render state, so fast clicking mis-scores");

  const cards = fs.readFileSync(path.join(root, "src/components/duo/DuoPathView.tsx"), "utf8");
  assert.ok(cards.includes('ui("Matcher")'), "the Matcher card is missing from the three ways in");
  assert.ok(cards.includes("sm:grid-cols-3"), "the card row still only fits two");
  assert.ok(cards.includes("<MatcherView"), "the Matcher card opens nothing");

  // German, because the app offers a German interface and this is new copy.
  const i18n = fs.readFileSync(path.join(root, "src/lib/i18n.ts"), "utf8");
  for (const key of [
    "Matcher", "Match and keep going", "Nothing to match yet",
    "Know all {n}", "Set level or put off", "Step {step}: {size} pairs, deeper in",
    "“{item}” marked as known.", "“{item}” put off for {days} days.",
  ]) {
    assert.ok(i18n.includes(`"${key}":`), `"${key}" has no German`);
  }
}

// ── keep pressing Know it and it gets harder ────────────────────────────
// Leon: "if im constantly pressing know it, it should get progressively
// harder". Two levers, and the second is the one that matters: a bigger board
// is only more of the same words, whereas moving down the queue is moving into
// rarer ones — which is what harder means for vocabulary.
{
  const flat = matcherDifficulty(0);
  assert.strictEqual(flat.step, 0, "the mode starts above its own floor");
  assert.strictEqual(flat.boardSize, MATCHER_BOARD_SIZE, "the first board is not the normal size");
  assert.strictEqual(flat.skipAhead, 0, "a fresh start already skips ahead");

  // A couple of easy words is not a complaint; a whole board's worth is.
  assert.strictEqual(matcherDifficulty(MATCHER_BOARD_SIZE - 1).step, 0,
    "the step rises before a full board has been declared known");
  assert.strictEqual(matcherDifficulty(MATCHER_BOARD_SIZE).step, 1,
    "clearing a board by declaration does not raise the step");

  let previousSize = 0;
  let previousSkip = -1;
  for (let streak = 0; streak <= MATCHER_BOARD_SIZE * 12; streak += MATCHER_BOARD_SIZE) {
    const level = matcherDifficulty(streak);
    assert.ok(level.boardSize >= previousSize, "the board shrank as the streak grew");
    assert.ok(level.skipAhead > previousSkip || level.step === MATCHER_MAX_STEP,
      "the queue position stopped moving before the top step");
    assert.ok(level.boardSize <= MATCHER_MAX_BOARD_SIZE,
      `board grew to ${level.boardSize}, past what fits without scrolling`);
    assert.ok(level.step <= MATCHER_MAX_STEP, "the step ran away past its ceiling");
    previousSize = level.boardSize;
    previousSkip = level.skipAhead;
  }
  assert.strictEqual(matcherDifficulty(Number.MAX_SAFE_INTEGER).step, MATCHER_MAX_STEP,
    "an enormous streak escapes the ceiling");

  // And it comes back down, so a run of Know its cannot strand someone in
  // material they cannot do.
  assert.strictEqual(matcherStreakAfterMiss(MATCHER_BOARD_SIZE * 3), MATCHER_BOARD_SIZE * 2,
    "a miss does not cost a board's worth of streak");
  assert.strictEqual(matcherStreakAfterMiss(2), 0, "the streak went negative");
  assert.ok(
    matcherDifficulty(matcherStreakAfterMiss(MATCHER_BOARD_SIZE)).step
      < matcherDifficulty(MATCHER_BOARD_SIZE).step,
    "missing at the bottom of a step does not drop back down"
  );

  // The bigger board still has to be dealable from the real queue.
  const top = matcherDifficulty(MATCHER_BOARD_SIZE * MATCHER_MAX_STEP);
  const wordQueue = buildMatcherQueue(parts, "words", null);
  const big = buildMatcherBoard(wordQueue, 0, top.boardSize);
  assert.strictEqual(big.pairs.length, top.boardSize,
    `the hardest board deals ${big.pairs.length} pairs, not ${top.boardSize}`);
  assert.strictEqual(new Set(big.pairs.map((p) => p.id)).size, big.pairs.length,
    "the hardest board repeats a pair");

  // Skipping ahead must land somewhere real rather than off the end.
  const deep = buildMatcherBoard(wordQueue, big.nextFrom + top.skipAhead, top.boardSize);
  assert.strictEqual(deep.pairs.length, top.boardSize, "skipping ahead deals a short board");
  assert.notDeepStrictEqual(deep.pairs.map((p) => p.id), big.pairs.map((p) => p.id),
    "skipping ahead deals the same pairs, so nothing got harder");
}

// A grade has to land on every key the item is stored under, or marking a word
// known here leaves an alias behind that the rest of the app still serves.
{
  const wordQueue = buildMatcherQueue(parts, "words", null);
  assert.ok(wordQueue.every((pair) => Array.isArray(pair.aliases)),
    "pairs carry no aliases, so a grade written here misses the item's other keys");
  assert.ok(wordQueue.some((pair) => pair.aliases.length > 0),
    "not one pair in the whole queue has an alias — the field is being dropped");
}

// ── it remembers where you got to ───────────────────────────────────────
// Leon: "this is supposed to be like continue learning where it remembers
// what ive already done ... i dont wanna start from the beginning every time".
//
// The hard case is the ordinary one: everything graded here LEAVES the queue,
// so the board you were last looking at is exactly the board most likely to
// have gone. A cursor that is only a number drifts; a cursor that is only the
// current item's id fails the moment you press Know it on it.
{
  const queue = buildMatcherQueue(parts, "words", null);
  const board = buildMatcherBoard(queue, 0);
  const later = buildMatcherBoard(queue, 400);

  // Nothing stored: the front of the list, as a first visit should be.
  assert.strictEqual(matcherResumeFrom(queue, { ids: [], approx: 0 }), 0,
    "a first visit does not start at the beginning");
  assert.strictEqual(matcherResumeFrom([], { ids: ["x"], approx: 9 }), 0,
    "an empty queue resolves to something other than zero");

  // The plain case: the board is still there, so resume on it.
  const at = matcherResumeFrom(queue, { ids: later.pairs.map((p) => p.id), approx: 400 });
  assert.strictEqual(queue[at].id, later.pairs[0].id,
    "resuming does not land on the board that was left");
  assert.ok(at > 0, "resuming a board 400 items in came back to the start");

  // The real case: the first few of that board have been graded away. It must
  // land on the survivors, not at the front.
  const thinned = queue.filter((pair) => pair.id !== later.pairs[0].id && pair.id !== later.pairs[1].id);
  const afterGrading = matcherResumeFrom(thinned, { ids: later.pairs.map((p) => p.id), approx: 400 });
  assert.strictEqual(thinned[afterGrading].id, later.pairs[2].id,
    "grading the first cards of a board loses the place instead of moving to the next one");

  // The pathological case: the whole board is gone. Land at the same depth,
  // never back at the beginning — that is the complaint being fixed.
  const gone = queue.filter((pair) => !later.pairs.some((p) => p.id === pair.id));
  const deep = matcherResumeFrom(gone, { ids: later.pairs.map((p) => p.id), approx: 400 });
  assert.ok(deep >= 390 && deep <= 400,
    `a fully graded board resumed at ${deep}, not near the 400 it was at`);
  assert.strictEqual(matcherResumeFrom(board.pairs, { ids: ["nothing"], approx: 10_000 }), board.pairs.length - 1,
    "a cursor past the end of a shrunken queue is not clamped into it");

  // Round trip through storage, including the shapes a hand-edited or
  // half-written value can take.
  const written = setMatcherCursor({ ids: later.pairs.map((p) => p.id), approx: 400 }, "words", "learn-de", null);
  assert.strictEqual(written.approx, 400, "the cursor was not written as given");
  const read = getMatcherCursor("words", "learn-de", null);
  assert.deepStrictEqual(read.ids, later.pairs.map((p) => p.id), "the cursor did not survive storage");
  assert.strictEqual(read.approx, 400, "the backstop position did not survive storage");

  // Words and sentences are separate lists and must keep separate places.
  const sentenceCursor = getMatcherCursor("sentences", "learn-de", null);
  assert.deepStrictEqual(sentenceCursor, { ids: [], approx: 0 },
    "the words cursor is answering for sentences too");

  // Nothing stored, or something broken stored, must never throw.
  assert.deepStrictEqual(getMatcherCursor("words", "learn-en", null), { ids: [], approx: 0 },
    "an unvisited course does not start clean");

  // The view has to actually use it, and resolve it on the first render rather
  // than dealing from the top and swapping — that flash says "starting again",
  // which is the thing being fixed.
  const view = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
  assert.ok(/useState\(\s*\(\) => matcherResumeFrom\(queue, getMatcherCursor\(kind, direction, profile\)\)\s*\)/.test(view),
    "the board's starting position is not resolved from the stored cursor on the first render");
  assert.ok(/setMatcherCursor\(\s*\{ ids: board\.pairs\.map\(\(pair\) => pair\.id\), approx: at \}/.test(view),
    "the board on screen is not what gets remembered");
  assert.ok(!/setKind\(next\);\s*\n\s*setFrom\(0\)/.test(view),
    "switching between words and sentences throws that list's place away");
  assert.ok(/const startOver = useCallback\(/.test(view) && /Start over/.test(view),
    "there is no way back to the front of the list once you are deep in it");
}

// ── redoing just the ones you got wrong ─────────────────────────────────
// Leon: "add a button to match just the missed ones if i want to".
{
  const queue = buildMatcherQueue(parts, "words", null);
  const sample = buildMatcherBoard(queue, 200).pairs;

  // Newest first, deduped, and capped — a list that grows for ever is a list
  // nobody ever clears.
  let list = [];
  for (const pair of sample) list = rememberMiss(list, pair.id);
  assert.strictEqual(list[0], sample[sample.length - 1].id, "the newest miss is not at the front");
  assert.strictEqual(list.length, sample.length, "a miss was dropped or duplicated");
  list = rememberMiss(list, sample[0].id);
  assert.strictEqual(list[0], sample[0].id, "missing the same pair again does not move it up");
  assert.strictEqual(list.length, sample.length, "missing the same pair twice records it twice");

  let long = [];
  for (let i = 0; i < MATCHER_MISSED_LIMIT + 50; i += 1) long = rememberMiss(long, `id-${i}`);
  assert.strictEqual(long.length, MATCHER_MISSED_LIMIT, "the missed list grows without limit");
  assert.strictEqual(long[0], `id-${MATCHER_MISSED_LIMIT + 49}`, "the cap dropped the newest instead of the oldest");

  // Ids resolve against the LIVE queue, in the order they were missed, and a
  // pair the course has since dropped falls out rather than being dealt.
  const ids = sample.map((pair) => pair.id);
  const resolved = matcherMissedPairs(queue, ids);
  assert.deepStrictEqual(resolved.map((pair) => pair.id), ids, "the missed pairs came back in the wrong order");
  const withGhost = matcherMissedPairs(queue, ["not-a-real-id", ...ids]);
  assert.deepStrictEqual(withGhost.map((pair) => pair.id), ids, "a missed id that has left the queue is still dealt");
  assert.deepStrictEqual(matcherMissedPairs([], ids), [], "an empty queue still produces missed pairs");
  assert.deepStrictEqual(matcherMissedPairs(queue, []), [], "an empty list still produces pairs");

  // A missed board has to be dealable — and short lists must not come back
  // empty, or the button would open onto nothing.
  for (const size of [1, 2, 3, 6]) {
    const few = matcherMissedPairs(queue, ids.slice(0, size));
    const board = buildMatcherBoard(few, 0, MATCHER_BOARD_SIZE);
    assert.ok(board.pairs.length > 0 && board.pairs.length <= size,
      `a missed list of ${size} dealt ${board.pairs.length} cards`);
    assert.ok(board.pairs.every((pair) => ids.includes(pair.id)),
      "the missed round dealt something that was not missed");
  }

  // Storage round trip, and separate lists per queue.
  setMatcherMissed(ids, "words", "learn-de", null);
  assert.deepStrictEqual(getMatcherMissed("words", "learn-de", null), ids,
    "the missed list did not survive storage");
  assert.deepStrictEqual(getMatcherMissed("sentences", "learn-de", null), [],
    "the words misses are answering for sentences too");
  setMatcherMissed(["a", "a", "", "b"], "sentences", "learn-de", null);
  assert.deepStrictEqual(getMatcherMissed("sentences", "learn-de", null), ["a", "b"],
    "blank and duplicate ids are stored rather than cleaned");

  // The view's side of it.
  const view = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8");
  assert.ok(view.includes('data-testid="matcher-review-missed"'),
    "there is no button to redo the missed ones");
  assert.ok(/setMissedIds\(\(current\) => rememberMiss\(rememberMiss\(current, id\), picked\.id\)\)/.test(view),
    "a wrong guess records only one of the two cards involved");
  assert.ok(/if \(reviewing\) setMissedIds\(\(current\) => current\.filter/.test(view),
    "getting a missed pair right does not take it off the list");
  assert.ok(!/if \(!reviewing\) setMissedIds\(\(current\) => current\.filter/.test(view),
    "an ordinary correct match clears the list — after a miss the card stays "
    + "put and is matched on the next press, so the list would never fill");
  // The detour must not overwrite where you were in the course.
  assert.ok(/if \(reviewing \|\| board\.pairs\.length === 0 \|\| queue\.length === 0\) return;/.test(view),
    "reviewing the missed ones writes its board as the course cursor, losing your place");
  assert.ok(/reviewing\s*\n?\s*\? buildMatcherBoard\(missedPairs, 0, MATCHER_BOARD_SIZE\)/.test(view),
    "the missed round does not deal from the missed pairs");
  assert.ok(/!reviewing && difficulty\.step > 0/.test(view),
    "the missed round claims a difficulty step it is not running at");
}

// ── the controls have to be on the board, not just in the file ──────────
// Everything above reads source. This renders the real component against the
// real queue and looks at what comes out, because a control that is wired
// perfectly and never drawn is the same as no control.
{
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" });
  const priorWindow = global.window;
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.localStorage = dom.window.localStorage;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
  global.CustomEvent = dom.window.CustomEvent;
  dom.window.dispatchEvent = () => true;
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  global.matchMedia = dom.window.matchMedia;
  global.requestAnimationFrame = (fn) => setTimeout(() => fn(Date.now()), 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
  global.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [], addEventListener() {}, removeEventListener() {} };
  global.SpeechSynthesisUtterance = function () {};
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

  const viewBuild = esbuild.buildSync({
    stdin: {
      contents: [
        'export { MatcherView } from "./src/components/matcher/MatcherView.tsx";',
        'export { renderToStaticMarkup } from "react-dom/server";',
        'export { createElement } from "react";',
      ].join("\n"),
      resolveDir: root,
      sourcefile: "matcher-view-entry.tsx",
      loader: "tsx",
    },
    alias: { "@": path.join(root, "src") },
    bundle: true,
    format: "cjs",
    platform: "node",
    target: "node20",
    jsx: "automatic",
    define: {
      "import.meta.env.DEV": "false",
      "import.meta.env.PROD": "true",
      "import.meta.env.MODE": '"production"',
    },
    loader: { ".css": "empty", ".png": "dataurl", ".svg": "dataurl", ".json": "json" },
    write: false,
    logLevel: "silent",
  });
  const viewModule = new Module("matcher-view-check", module);
  viewModule.filename = path.join(root, ".matcher-view-check.cjs");
  viewModule.paths = Module._nodeModulePaths(root);
  viewModule._compile(viewBuild.outputFiles[0].text, viewModule.filename);
  const { MatcherView, renderToStaticMarkup, createElement } = viewModule.exports;

  const html = renderToStaticMarkup(createElement(MatcherView, {
    apiParts: parts,
    profile: null,
    onExit() {},
  }));

  const count = (needle) => (html.match(new RegExp(needle, "g")) ?? []).length;
  assert.strictEqual(count("matcher-tile-actions"), MATCHER_BOARD_SIZE,
    `${count("matcher-tile-actions")} pairs carry grade controls, not ${MATCHER_BOARD_SIZE}`);
  assert.ok(html.includes('data-testid="matcher-know-all"'),
    "Know all is not on the board");
  assert.ok(/Know all\s*6/.test(html.replace(/<[^>]+>/g, " ")),
    "Know all does not say how many it would take");
  assert.strictEqual(count('aria-haspopup="menu"'), MATCHER_BOARD_SIZE,
    "not every pair can open its level menu");
  // The menu is closed until asked for — a board with six open menus is a mess.
  assert.strictEqual(count("matcher-tile-menu"), 0,
    "the level menus render open");
  assert.strictEqual(count('aria-expanded="false"'), MATCHER_BOARD_SIZE,
    "the menu buttons do not report themselves closed");
  // Six German tiles and six English ones, and only the German side is graded.
  assert.strictEqual(count("matcher-tile is-german"), MATCHER_BOARD_SIZE,
    "the German column is not the one carrying the controls");
  assert.ok(!/Step \d/.test(html.replace(/<[^>]+>/g, " ")),
    "a fresh board already claims to be at a raised step");

  // ── and exactly one menu when one is open ─────────────────────────────
  //
  // A closed board proves nothing about this. The menu is keyed on the PAIR,
  // and a pair has two tiles — so with the open-state forced, an unguarded
  // menu draws twice: once under the German word and once under its English
  // tile, wherever the shuffle put it. That is what Leon saw, and the check
  // above sailed past it because nothing was open.
  //
  // Forced by pinning the open test itself in a copy of the real source,
  // which turns "is this pair's menu open" into "yes" for every tile that is
  // allowed to draw one. Six means the side guard holds; twelve means it does
  // not.
  const openMenuFile = path.join(root, "src/components/matcher/__menu-open-check.tsx");
  const original = fs.readFileSync(path.join(root, "src/components/matcher/MatcherView.tsx"), "utf8")
    .replace(/\r\n?/gu, "\n");
  const pinned = original.replace("const menuOpen = menuFor === pair.id;", "const menuOpen = true;");
  assert.notStrictEqual(pinned, original, "the menu's open test has been renamed or moved");
  fs.writeFileSync(openMenuFile, pinned);
  try {
    const openBuild = esbuild.buildSync({
      stdin: {
        contents: [
          'export { MatcherView } from "./src/components/matcher/__menu-open-check.tsx";',
          'export { renderToStaticMarkup } from "react-dom/server";',
          'export { createElement } from "react";',
        ].join("\n"),
        resolveDir: root,
        sourcefile: "matcher-open-entry.tsx",
        loader: "tsx",
      },
      alias: { "@": path.join(root, "src") },
      bundle: true,
      format: "cjs",
      platform: "node",
      target: "node20",
      jsx: "automatic",
      define: {
        "import.meta.env.DEV": "false",
        "import.meta.env.PROD": "true",
        "import.meta.env.MODE": '"production"',
      },
      loader: { ".css": "empty", ".png": "dataurl", ".svg": "dataurl", ".json": "json" },
      write: false,
      logLevel: "silent",
    });
    const openModule = new Module("matcher-open-check", module);
    openModule.filename = path.join(root, ".matcher-open-check.cjs");
    openModule.paths = Module._nodeModulePaths(root);
    openModule._compile(openBuild.outputFiles[0].text, openModule.filename);
    const opened = openModule.exports.renderToStaticMarkup(
      openModule.exports.createElement(openModule.exports.MatcherView, {
        apiParts: parts, profile: null, onExit() {},
      })
    );
    const menus = (opened.match(/class="matcher-tile-menu"/g) ?? []).length;
    assert.strictEqual(menus, MATCHER_BOARD_SIZE,
      `${menus} level menus drew for ${MATCHER_BOARD_SIZE} pairs — the menu is keyed on the `
      + "pair but rendered per tile, so each one appears under the German word AND its English tile");
    // And they hang off the German side, where the buttons that open them are.
    const germanColumn = opened.slice(
      opened.indexOf('data-testid="matcher-german"'),
      opened.indexOf('data-testid="matcher-english"')
    );
    assert.strictEqual((germanColumn.match(/class="matcher-tile-menu"/g) ?? []).length, MATCHER_BOARD_SIZE,
      "the level menus are not all in the German column, where the controls are");
  } finally {
    fs.rmSync(openMenuFile, { force: true });
  }

  global.window = priorWindow;
  dom.window.close();
}

console.log(
  `check-matcher: both queues ordered like the course, 40 boards each solvable `
  + `and advancing, the deal stable, the place kept across visits, matching still `
  + `unscored, the step rising and falling with the run of Know its, and every `
  + `pair rendering its controls, with the missed ones redoable on their own`
);
// Writing a cursor schedules the shared-items sync, which outside a browser
// fails and retries on a growing delay — it would keep the build waiting for
// ever. The check is finished; say so rather than letting the loop decide.
process.exit(0);
