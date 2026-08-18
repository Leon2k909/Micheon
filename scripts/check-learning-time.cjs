const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export {
        ActiveStudyTimer,
        estimateFluencyHours,
        loadLearningTimeStats,
        normalizeLearningTimeStats,
        recordCompletedLearningSession,
      } from "./src/lib/learningTime.ts";
    `,
    resolveDir: root,
    sourcefile: "learning-time-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("learning-time-check", module);
compiled.filename = path.join(root, ".learning-time-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  ActiveStudyTimer,
  estimateFluencyHours,
  loadLearningTimeStats,
  normalizeLearningTimeStats,
  recordCompletedLearningSession,
} = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

class FakeTarget {
  constructor() {
    this.listeners = new Map();
  }
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }
  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }
  emit(type) {
    for (const listener of this.listeners.get(type) || []) listener({ type });
  }
}

class FakeDocument extends FakeTarget {
  constructor() {
    super();
    this.visibilityState = "visible";
    this.focused = true;
  }
  hasFocus() {
    return this.focused;
  }
}

function fakeClock() {
  let now = 0;
  let nextId = 1;
  const tasks = new Map();
  return {
    now: () => now,
    setTimeoutFn(callback, delay) {
      const id = nextId++;
      tasks.set(id, { callback, due: now + Math.max(0, delay) });
      return id;
    },
    clearTimeoutFn(id) {
      tasks.delete(id);
    },
    advance(ms) {
      const target = now + ms;
      while (true) {
        const due = [...tasks.entries()]
          .filter(([, task]) => task.due <= target)
          .sort((a, b) => a[1].due - b[1].due)[0];
        if (!due) break;
        tasks.delete(due[0]);
        now = due[1].due;
        due[1].callback();
      }
      now = target;
    },
  };
}

const win = new FakeTarget();
const doc = new FakeDocument();
const clock = fakeClock();
const timer = new ActiveStudyTimer({
  ...clock,
  windowTarget: win,
  documentTarget: doc,
  idleAfterMs: 120_000,
}).start();

clock.advance(30_000);
win.emit("keydown");
clock.advance(50_000);
win.emit("blur");
doc.focused = false;
clock.advance(100_000);
doc.focused = true;
win.emit("focus");
clock.advance(20_000);
doc.visibilityState = "hidden";
doc.emit("visibilitychange");
clock.advance(90_000);
doc.visibilityState = "visible";
doc.emit("visibilitychange");
clock.advance(130_000); // only 120 seconds count; then the one-shot idle timer pauses it

check(
  "active timer excludes blur, hidden time, and time past the idle deadline",
  timer.getActiveMs() === 220_000,
  `recorded ${timer.getActiveMs()}ms`
);
check("stop returns the same active total", timer.stop() === 220_000);
clock.advance(60_000);
check("a stopped timer never resumes", timer.getActiveMs() === 220_000);

const normalized = normalizeLearningTimeStats({
  totalActiveMs: "broken",
  completedLessons: -4,
  samples: [
    null,
    { activeMs: 100, progressBefore: 0, progressAfter: 99 },
    { activeMs: 600_000, progressBefore: 10, progressAfter: 13, completedAt: 123 },
  ],
});
check("malformed and sub-second stored samples are discarded", normalized.samples.length === 1);
check("safe totals are rebuilt from valid samples", normalized.totalActiveMs === 600_000);
check("progress gain is rebuilt when an old sample omitted it", normalized.totalProgressGained === 3);

const baselineEstimate = estimateFluencyHours(3_040, {});
check("a stable baseline estimate is available before timing history exists", baselineEstimate.hoursRemaining === 260);
check("untimed estimate is clearly labelled baseline", baselineEstimate.confidence === "baseline");

const personalizedEstimate = estimateFluencyHours(3_040, {
  samples: [
    { activeMs: 900_000, progressBefore: 100, progressAfter: 106, progressGained: 6, completedAt: 1 },
    { activeMs: 900_000, progressBefore: 106, progressAfter: 112, progressGained: 6, completedAt: 2 },
    { activeMs: 900_000, progressBefore: 112, progressAfter: 118, progressGained: 6, completedAt: 3 },
  ],
});
check("completed lessons personalize the estimate", personalizedEstimate.confidence === "personalized");
check(
  "the estimate blends observed pace with a conservative prior",
  personalizedEstimate.unitsPerHour > 12 && personalizedEstimate.unitsPerHour < 24,
  `rate ${personalizedEstimate.unitsPerHour}`
);
check("zero remaining units produces zero hours", estimateFluencyHours(0, {}).hoursRemaining === 0);

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const storage = new MemoryStorage();
global.fetch = async () => ({ ok: true });
global.window = {
  localStorage: storage,
  dispatchEvent() {},
};
global.CustomEvent = class CustomEvent {
  constructor(type, options) { this.type = type; this.detail = options?.detail; }
};
const profile = { id: "timing-test", name: "Test", email: "test@example.com" };
const stored = recordCompletedLearningSession({
  activeMs: 600_000,
  progressBefore: 20,
  progressAfter: 24,
  lessonId: "part-test",
}, profile);
const loaded = loadLearningTimeStats(profile);

check("completed active time persists per profile", loaded.totalActiveMs === 600_000);
check("completed lesson count persists", loaded.completedLessons === 1);
check("known-item progress persists", loaded.totalProgressGained === 4);
check("lesson identity is retained for diagnostics", loaded.samples[0]?.lessonId === "part-test");
const activityLog = JSON.parse(storage.getItem("activity-log:timing-test") || "[]");
check("timing reuses the shared activity log", activityLog.length === 1);
check("new records are marked as active-timed", activityLog[0]?.activeTimed === true);
check("legacy wall-clock records cannot be mistaken for active timing", activityLog[0]?.timingVersion === 1);
check("record returns the same persisted aggregate", JSON.stringify(stored) === JSON.stringify(loaded));
storage.setItem("activity-log:timing-test", JSON.stringify([
  ...activityLog,
  { ts: 999, durationSec: 900, sentences: 20, dialogues: 0, activeTimed: true },
]));
check(
  "unversioned timing records cannot pollute the personalised pace",
  loadLearningTimeStats(profile).completedLessons === 1
);

const labSource = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
const dashboardSource = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
const meterSource = fs.readFileSync(path.join(root, "src/components/FluencyMeter.tsx"), "utf8");
check(
  "every guided lesson path starts the active clock with a known-item baseline",
  // Three launch paths now: an explicit pack, Continue Learning, and the
  // vocabulary sitting added for words mode. Every one starts the clock.
  (labSource.match(/beginLessonTiming\(id\)/g) || []).length === 3
    && labSource.includes("startSessionRef.current(requestedPart)")
    && labSource.includes("sessionKnownBeforeRef.current = countKnownVocab")
);
check(
  "only completed lessons become fluency-pace samples",
  labSource.includes("logActivity(sessionSteps, true)")
    && labSource.includes("if (!completed || progressBefore === null || activeMs < 1_000) return;")
    && labSource.includes("recordCompletedLearningSession({")
);
check(
  "the dashboard visibly opts into the study-hours estimate",
  dashboardSource.includes("function FluencyOutlook")
    // Hours reach all the way to Fluent, and the label says so — Leon's call
    // after a next-stage-only estimate was tried and rejected.
    && dashboardSource.includes("estimateFluencyHours(fluency.toFluent")
    && dashboardSource.includes("hours to Fluent")
    && dashboardSource.includes("Estimated active study left")
    && dashboardSource.includes('window.addEventListener("activity-updated", refresh)')
    && meterSource.includes('ui("study hours left")')
);

if (failures) {
  console.error(`\n${failures} learning-time regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nActive lesson timing and fluency-hour estimates are guarded");
process.exit(0);
