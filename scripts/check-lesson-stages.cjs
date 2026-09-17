#!/usr/bin/env node
/**
 * The stages a lesson runs can be set by hand, and the default does not move.
 *
 * Four promises, in the order they matter:
 *
 *  1. THE DEFAULT IS UNTOUCHED. Recommended is not a list of ticks — it picks
 *     per phrase and lengthens a route when a test is missed — and nobody who
 *     never opens the setting may notice it exists. So the option is proven
 *     inert across every combination of what the route builder is told, not
 *     just the everyday two.
 *
 *  2. A HAND-SET ROUTE IS HONOURED, within the hard limits. Repeats appear as
 *     repeats. A single word still skips what only a sentence can do; a stage
 *     that needs sound still gives way when it is off; a known phrase, an
 *     extension of one just taught, and the French companion keep their own
 *     shorter routes.
 *
 *  3. STORED SETTINGS CANNOT BREAK A LESSON. They outlive the code that wrote
 *     them, so what comes back is clamped, cleaned, and never without Read.
 *
 *  4. A REPEATED STAGE CAN BE GOT PAST. The lesson used to find its place by
 *     name, and from the second of two Type stages that finds the first — so a
 *     repeat would have looped for ever. It steps by position now.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildSentencePhaseRoute, replacementSentencePhaseWhenMuted, LEAN_SENTENCE_PHASES, AUDIO_REQUIRED_SENTENCE_PHASES } from "./src/lib/guidedLessonPhases.ts";
      export {
        CUSTOMISABLE_STAGES,
        customStageCount,
        customStageRoute,
        DEFAULT_LESSON_STAGES,
        getLessonStages,
        LONG_ROUTE_STAGES,
        MAX_STAGE_REPEATS,
        normaliseStageChoices,
        REQUIRED_STAGE,
        setLessonStages,
      } from "./src/lib/lessonStages.ts";
    `,
    resolveDir: root,
    sourcefile: "lesson-stages-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.localStorage = (() => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
})();
global.window = { localStorage: global.localStorage };

const compiled = new Module("lesson-stages-check", module);
compiled.filename = path.join(root, ".lesson-stages-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const {
  AUDIO_REQUIRED_SENTENCE_PHASES,
  buildSentencePhaseRoute,
  CUSTOMISABLE_STAGES,
  customStageCount,
  customStageRoute,
  DEFAULT_LESSON_STAGES,
  getLessonStages,
  LEAN_SENTENCE_PHASES,
  LONG_ROUTE_STAGES,
  MAX_STAGE_REPEATS,
  normaliseStageChoices,
  replacementSentencePhaseWhenMuted,
  REQUIRED_STAGE,
  setLessonStages,
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

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ── 1. the default is untouched ─────────────────────────────────────────────
check(
  "nobody is opted in: the stored default is the recommended route",
  DEFAULT_LESSON_STAGES.mode === "recommended"
    && getLessonStages().mode === "recommended"
    && customStageRoute(getLessonStages()) === undefined
);

const bools = [false, true];
const combinations = [];
for (const mastered of bools) for (const bilingual of bools) for (const audioMuted of bools)
  for (const word of bools) for (const orderable of bools) for (const chained of bools)
    for (const typingFailed of bools)
      combinations.push({ mastered, bilingual, audioMuted, word, orderable, chained, typingFailed });

const inertDiffs = combinations.filter((options) =>
  !same(buildSentencePhaseRoute(options), buildSentencePhaseRoute({ ...options, custom: undefined }))
  || !same(
    replacementSentencePhaseWhenMuted("ListenPick", options),
    replacementSentencePhaseWhenMuted("ListenPick", { ...options, custom: undefined })
  )
);
check(
  `with no custom route, all ${combinations.length} combinations build exactly the route they built before`,
  inertDiffs.length === 0,
  inertDiffs.slice(0, 2).map((o) => JSON.stringify(o)).join(" | ")
);

// The two routes people meet every day, spelled out, so a change to either is
// a decision somebody makes on purpose rather than a side effect of this one.
const everyday = { mastered: false, bilingual: false, audioMuted: false, orderable: true, chained: false, typingFailed: false };
check(
  "a new word still takes Read, Select, Meaning first, Hear & write",
  same(buildSentencePhaseRoute({ ...everyday, word: true }), ["Read", "MeaningSelect", "MeaningFirst", "ListenPick"])
);
check(
  "a new sentence still takes the lean route",
  same(buildSentencePhaseRoute({ ...everyday, word: false }), [...LEAN_SENTENCE_PHASES])
);

// ── 2. a hand-set route is honoured, within the hard limits ────────────────
const longRoute = customStageRoute({ mode: "custom", stages: LONG_ROUTE_STAGES });
check(
  "the long route runs every stage there is, with Type and Translate twice, in lesson order",
  longRoute.length === 13
    && customStageCount(LONG_ROUTE_STAGES) === 13
    && CUSTOMISABLE_STAGES.every((stage) => longRoute.includes(stage))
    && longRoute.filter((stage) => stage === "Type").length === 2
    && longRoute.filter((stage) => stage === "Translate").length === 2
    && same([...new Set(longRoute)], [...CUSTOMISABLE_STAGES]),
  longRoute.join(" > ")
);

const sentenceLong = buildSentencePhaseRoute({ ...everyday, word: false, custom: longRoute });
check(
  "a sentence runs the long route exactly, repeats and all",
  same(sentenceLong, longRoute),
  sentenceLong.join(" > ")
);

const repeated = customStageRoute({ mode: "custom", stages: [{ stage: "Read", repeats: 1 }, { stage: "Type", repeats: 3 }] });
check(
  "a stage set to run three times is three steps in a row, not collapsed into one",
  same(buildSentencePhaseRoute({ ...everyday, word: false, custom: repeated }), ["Read", "Type", "Type", "Type"])
);

const wordLong = buildSentencePhaseRoute({ ...everyday, word: true, custom: longRoute });
check(
  "a single word skips every stage only a sentence can do",
  !["MissingWord", "Gap", "Order", "WriteFromMemory"].some((stage) => wordLong.includes(stage))
    && wordLong.includes("Read") && wordLong.filter((stage) => stage === "Type").length === 2,
  wordLong.join(" > ")
);

const mutedLong = buildSentencePhaseRoute({ ...everyday, word: false, audioMuted: true, custom: longRoute });
check(
  "with the sound off, no stage that needs it is left in a hand-set route",
  !AUDIO_REQUIRED_SENTENCE_PHASES.some((stage) => mutedLong.includes(stage)),
  mutedLong.join(" > ")
);

check(
  "a two-word phrase still drops the reorder it cannot meaningfully do",
  !buildSentencePhaseRoute({ ...everyday, word: false, orderable: false, custom: longRoute }).includes("Order")
);

check(
  "a phrase already known keeps its single recall whatever the setting says",
  same(buildSentencePhaseRoute({ ...everyday, word: false, mastered: true, custom: longRoute }), ["RecallBoth"])
    && same(buildSentencePhaseRoute({ ...everyday, word: true, mastered: true, custom: longRoute }), ["RecallBoth"])
);
check(
  "an extension of a sentence just taught, and the French companion, keep their own routes",
  same(
    buildSentencePhaseRoute({ ...everyday, word: false, chained: true, custom: longRoute }),
    buildSentencePhaseRoute({ ...everyday, word: false, chained: true })
  )
    && same(
      buildSentencePhaseRoute({ ...everyday, word: false, bilingual: true, custom: longRoute }),
      buildSentencePhaseRoute({ ...everyday, word: false, bilingual: true })
    )
);
check(
  "a hand-set route that leaves a word nothing it can do falls back rather than ending the card",
  buildSentencePhaseRoute({ ...everyday, word: true, custom: ["Gap", "Order"] }).length > 0
);

// ── 3. stored settings cannot break a lesson ───────────────────────────────
check(
  "what comes back from storage is cleaned: known stages, once each, repeats 1 to 3, Read always there",
  same(
    normaliseStageChoices([{ stage: "Type", repeats: 9 }, { stage: "Retired", repeats: 1 }, { stage: "Type", repeats: 1 }, { stage: "Gap", repeats: -4 }]),
    [{ stage: "Read", repeats: 1 }, { stage: "Type", repeats: MAX_STAGE_REPEATS }, { stage: "Gap", repeats: 1 }]
  )
    && same(normaliseStageChoices("not a list"), [{ stage: REQUIRED_STAGE, repeats: 1 }])
);

global.localStorage.setItem("gl-lesson-stages-v1", "{not json");
check("unreadable storage falls back to the recommended route", getLessonStages().mode === "recommended");

const saved = setLessonStages({ mode: "custom", stages: [{ stage: "Order", repeats: 2 }] });
const loaded = getLessonStages();
check(
  "a custom route survives a save and a reload, in lesson order and with Read added",
  saved.mode === "custom" && loaded.mode === "custom"
    && same(loaded.stages, [{ stage: "Read", repeats: 1 }, { stage: "Order", repeats: 2 }])
);
setLessonStages({ mode: "recommended" });
check("choosing Recommended again puts the default back", getLessonStages().mode === "recommended");

// ── 4. a repeated stage can be got past ─────────────────────────────────────
const guided = read("src/GuidedSession.tsx");
check(
  "the lesson moves on by position, not by looking its stage name up again",
  guided.includes("moveToStep(step + 1)")
    && !/order\.indexOf\(phase\)\s*\+\s*1/u.test(guided)
    && !/order\.indexOf\(phase\)\s*-\s*1/u.test(guided),
  "a stage name lookup would find the first of two repeats and loop"
);
check(
  "a late tick from the first of two repeats cannot skip the second",
  /currentPhaseRef\.current !== phase \|\| stepRef\.current !== step/u.test(guided)
);
check(
  "entering a repeat clears the answer the previous one left behind",
  guided.includes("}, [phase, step, item.de]);")
);
check(
  "the stage bar lights the right one of two repeats and names the second as a repeat",
  guided.includes("currentIndex={step}")
    && guided.includes("key={`${p}-${i}`}")
    && guided.includes('uiFmt("{stage} again", { stage: name })')
);
check(
  "the setting is read once per card, so a change never lands half way through one",
  /const customRoute = useMemo\(\(\) => customStageRoute\(getLessonStages\(\)\), \[\]\);/u.test(guided)
    && guided.includes("custom: customRoute,")
);

// ── and it is somewhere a person can find it ───────────────────────────────
const settings = read("src/Gamification.tsx");
const panel = read("src/components/settings/LessonStagesSetting.tsx");
check(
  "Profile and settings carries the control, and searching for stages or repeats finds it",
  settings.includes("<LessonStagesSetting />")
    && /"Learning options": "[^"]*\bstages\b[^"]*\brepeat\b/u.test(settings)
);
check(
  "the control offers the default, the long route, and a route built by hand",
  ["recommended", "long", "custom"].every((value) => panel.includes(`["${value}", `))
    && panel.includes("setLessonStages(")
);

if (failures) {
  console.error(`\n${failures} lesson-stages regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nThe stages a lesson runs can be set by hand, and the default has not moved");
