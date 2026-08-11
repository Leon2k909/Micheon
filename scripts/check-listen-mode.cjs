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
      'export { buildListenQueue, recordListenGrade, getListenGermanRepeats, DEFAULT_GERMAN_REPEATS, listenCountForId } from "./src/lib/listenMode.ts";',
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
  buildListenQueue, recordListenGrade, getListenGermanRepeats, DEFAULT_GERMAN_REPEATS, listenCountForId,
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
check("German is spoken twice by default", DEFAULT_GERMAN_REPEATS === 2 && getListenGermanRepeats() === 2);
stored.set("gl-listen-german-repeats", "3");
check("the repeat count is the learner's to change", getListenGermanRepeats() === 3);
stored.set("gl-listen-german-repeats", "99");
check("a corrupt repeat count falls back to the default", getListenGermanRepeats() === 2);

const prototype = read("src/prototype/NewUiPrototype.tsx");
check("Listen sits in the left menu", /id: "listen", label: "Listen", icon: Headphones/.test(prototype));
check("navigating to Listen loads the course catalogue",
  /\["learn", "games", "tests", "listen"\]\.includes\(view\)/.test(prototype));
check("the Listen view is mounted behind the catalogue gate",
  prototype.includes('activeView === "listen"') && prototype.includes("<ListenView apiParts={apiParts}"));

const view = read("src/components/listen/ListenView.tsx");
check("the view speaks German then English in one sequence", view.includes("ttsSequence(")
  && view.includes('lang: "de-DE"') && view.includes("englishLang"));
check("the view repeats the German the configured number of times",
  view.includes("Array.from({ length: repeats }"));
check("pausing actually stops the voice", view.includes("stopTts()"));
check("grading uses the damped listen path, not the lesson path",
  view.includes("recordListenGrade(") && !view.includes("recordDeclaredKnown") && !view.includes("setItemStatus("));

const vocabTracker = read("src/components/lab/VocabTracker.tsx");
const wordsTracker = read("src/components/lab/WordsTracker.tsx");
check("both trackers surface the exposure count",
  vocabTracker.includes('ui("heard")') && wordsTracker.includes('ui("heard")'));

const i18n = read("src/lib/i18n.ts");
for (const key of [
  "Both languages read aloud while you do something else.",
  "Play audio",
  "heard",
  "Listening counts as exposure, not mastery — these items still appear in your lessons, because hearing a sentence is not spelling it.",
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
