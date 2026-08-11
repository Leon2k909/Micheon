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
      'export { buildListenQueue, recordListenGrade, setListenReviewLevel, snoozeListenItem, getListenGermanRepeats, setListenGermanRepeats, getListenEnglishRepeats, setListenEnglishRepeats, getListenLanguageOrder, setListenLanguageOrder, getListenNextCardDelayMs, setListenNextCardDelayMs, DEFAULT_GERMAN_REPEATS, DEFAULT_ENGLISH_REPEATS, DEFAULT_LISTEN_LANGUAGE_ORDER, DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS, DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS, DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER, DEFAULT_NEXT_CARD_DELAY_MS, listenCountForId } from "./src/lib/listenMode.ts";',
      'export { loadGradeStore, saveGradeStore, statusForId, COMPLETED_KEY } from "./src/lib/activity.ts";',
      'export { recordSuccess, isDueForReview } from "./src/lib/memoryStrength.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { WORD_ID_PREFIX } from "./src/lib/wordSession.ts";',
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
  buildListenQueue, recordListenGrade, setListenReviewLevel, snoozeListenItem,
  getListenGermanRepeats, setListenGermanRepeats,
  getListenEnglishRepeats, setListenEnglishRepeats,
  getListenLanguageOrder, setListenLanguageOrder,
  getListenNextCardDelayMs, setListenNextCardDelayMs,
  DEFAULT_GERMAN_REPEATS, DEFAULT_ENGLISH_REPEATS, DEFAULT_LISTEN_LANGUAGE_ORDER,
  DEFAULT_ENGLISH_COURSE_GERMAN_REPEATS, DEFAULT_ENGLISH_COURSE_ENGLISH_REPEATS,
  DEFAULT_ENGLISH_COURSE_LANGUAGE_ORDER, DEFAULT_NEXT_CARD_DELAY_MS,
  listenCountForId,
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
setListenReviewLevel({ id: "manual-level", aliases: [] }, 5, null, Date.now());
grades = readGrades();
check("an explicit Listen level correction can set Mastered",
  grades["manual-level"]?.lastGrade === "know"
  && grades["manual-level"]?.successes === 5
  && grades["manual-level"]?.intervalDays === 180);
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
check("the default queue serves the sentence course", queue.length > 1000
  && queue.every((item) => item.kind === "sentence"));
check("sentence queue ids never wear the word prefix",
  queue.every((item) => !item.id.startsWith(WORD_ID_PREFIX)));

stored.set("gl-lesson-content", "words");
queue = buildListenQueue(parts, {});
check("words mode fills the queue from the word catalogue under vw- ids",
  queue.length > 1000 && queue.every((item) => item.kind === "word" && item.id.startsWith(WORD_ID_PREFIX)));

stored.set("gl-lesson-content", "mixed");
queue = buildListenQueue(parts, {});
check("mixed mode interleaves words among sentences rather than appending them",
  queue.some((item) => item.kind === "word")
  && queue.some((item) => item.kind === "sentence")
  && queue.slice(0, 40).some((item) => item.kind === "word"));

stored.set("gl-lesson-content", "sentences");
const probeId = buildListenQueue(parts, {})[5].id;
const dueYesterday = { ...recordSuccess(undefined, Date.now() - 2 * 864e5), dueAt: new Date(Date.now() - 864e5).toISOString() };
queue = buildListenQueue(parts, { [probeId]: dueYesterday });
check("a due review leads the listening queue", queue[0]?.id === probeId);

const snoozed = { snoozedUntil: new Date(Date.now() + 864e5).toISOString() };
queue = buildListenQueue(parts, { [probeId]: snoozed });
check("a snoozed item is not read aloud", queue.every((item) => item.id !== probeId));

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
setListenGermanRepeats(3, "learn-de");
setListenEnglishRepeats(4, "learn-de");
setListenLanguageOrder("german-first", "learn-de");
setListenGermanRepeats(5, "learn-en");
setListenEnglishRepeats(6, "learn-en");
setListenLanguageOrder("english-first", "learn-en");
stored.set("gl-listen-next-card-delay-ms", "2500");
check("each course keeps its own repeat counts and language order",
  getListenGermanRepeats("learn-de") === 3
  && getListenEnglishRepeats("learn-de") === 4
  && getListenLanguageOrder("learn-de") === "german-first"
  && getListenGermanRepeats("learn-en") === 5
  && getListenEnglishRepeats("learn-en") === 6
  && getListenLanguageOrder("learn-en") === "english-first");
check("the next-card delay is the learner's to change", getListenNextCardDelayMs() === 2500);
stored.set("gl-listen-german-repeats:learn-de", "99");
stored.set("gl-listen-english-repeats:learn-de", "0");
stored.set("gl-listen-language-order:learn-de", "invalid");
stored.set("gl-listen-next-card-delay-ms", "999999");
check("corrupt Listen settings fall back to documented defaults",
  getListenGermanRepeats("learn-de") === 2
  && getListenEnglishRepeats("learn-de") === 1
  && getListenLanguageOrder("learn-de") === "english-first"
  && getListenNextCardDelayMs() === 1100);
check("Listen setting writers clamp typed values to safe limits",
  setListenGermanRepeats(99, "learn-de") === 10
  && setListenEnglishRepeats(-4, "learn-de") === 1
  && setListenNextCardDelayMs(99_000) === 30_000);

const prototype = read("src/prototype/NewUiPrototype.tsx");
check("Listen sits in the left menu", /id: "listen", label: "Listen", icon: Headphones/.test(prototype));
check("navigating to Listen loads the course catalogue",
  /\["learn", "games", "tests", "listen"\]\.includes\(view\)/.test(prototype));
check("the Listen view is mounted behind the catalogue gate",
  prototype.includes('activeView === "listen"')
  && prototype.includes("<ListenView")
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
check("the playback plan, order switch, and typed repeat counts are visible",
  view.includes('"English {en}×, then German {de}×"')
  && view.includes('"German {de}×, then English {en}×"')
  && view.includes('data-testid={`listen-order-${value}`}')
  && view.includes('testId="listen-german-repeats"')
  && view.includes('testId="listen-english-repeats"'));
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
  && view.includes("snoozeListenItem(")
  && view.includes('ui("Set level")')
  && view.includes('ui("Put off")'));
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

const vocabTracker = read("src/components/lab/VocabTracker.tsx");
const wordsTracker = read("src/components/lab/WordsTracker.tsx");
check("both trackers surface the exposure count",
  vocabTracker.includes('ui("heard")') && wordsTracker.includes('ui("heard")'));

const i18n = read("src/lib/i18n.ts");
for (const key of [
  "Both languages read aloud while you do something else.",
  "German {de}×, then English {en}×",
  "English {en}×, then German {de}×",
  "Language order",
  "English first",
  "German first",
  "Times spoken on every card",
  "German repeats",
  "English repeats",
  "Next card delay",
  "Voice levels",
  "English voice is muted and will be skipped.",
  "Quick marks stay gentle. Set level makes an exact tracker change.",
  "Play audio",
  "heard",
  "Listening counts as exposure, not mastery. These items still appear in lessons because hearing a sentence is not spelling it.",
]) {
  check(`the new UI string is translated: ${key.slice(0, 40)}…`, new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}": "`).test(i18n));
}

delete global.window;
delete global.localStorage;

if (failures > 0) {
  console.error(`\n${failures} listen-mode check(s) failed`);
  process.exit(1);
}
console.log("\nListen mode stays passive: damped grades, honest queue, wired UI");
// Modules loaded under the window polyfill may have armed timers; exit
// explicitly so a green run doesn't idle until the CI step times out.
process.exit(0);
