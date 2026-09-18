// A phrase comes back while it is still nearly there, and coming back is
// cheap. Both halves are load-bearing: spacing the returns out is only
// affordable because a return is tapped through rather than typed out.
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const lab = read("src/guided_learning_session.tsx");
const guided = read("src/GuidedSession.tsx");

let failures = 0;
const check = (name, ok, why = "") => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${ok || !why ? "" : ` — ${why}`}`);
  if (!ok) failures += 1;
};

const bundle = (contents, name) => {
  const built = esbuild.buildSync({
    stdin: { contents, resolveDir: root, sourcefile: `${name}.ts`, loader: "ts" },
    alias: { "@": path.resolve(root, "src") },
    bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  });
  const mod = new Module(name, null);
  mod.paths = Module._nodeModulePaths(root);
  mod._compile(built.outputFiles[0].text, path.join(root, `${name}.cjs`));
  return mod.exports;
};

const {
  buildSentencePhaseRoute,
  SECOND_SHOWING_PHASES,
  NON_WRITING_SENTENCE_PHASES,
  LEAN_SENTENCE_PHASES,
  SENTENCE_PHASES,
} = bundle('export * from "./src/lib/guidedLessonPhases.ts";', "phases");

// ── the return is tap-only, whatever else is true of the phrase ────────────
const writes = new Set(SENTENCE_PHASES.filter((p) => !NON_WRITING_SENTENCE_PHASES.includes(p)));
const combos = [];
for (const mastered of [false, true]) for (const bilingual of [false, true])
  for (const audioMuted of [false, true]) for (const word of [false, true])
    for (const orderable of [false, true]) for (const chained of [false, true])
      for (const typingFailed of [false, true])
        combos.push({ mastered, bilingual, audioMuted, word, orderable, chained, typingFailed });

const handSet = ["Read", "Type", "Type", "Translate", "WriteFromMemory"];
const returns = combos.map((options) => buildSentencePhaseRoute({ ...options, custom: handSet, secondShowing: true }));
check(
  `a return never asks for anything to be typed (${combos.length} combinations)`,
  returns.every((route) => route.every((phase) => !writes.has(phase))),
  JSON.stringify(returns.find((route) => route.some((phase) => writes.has(phase))))
);
check("a return always has at least one stage", returns.every((route) => route.length > 0));
check("a return never runs the reading stage again", returns.every((route) => !route.includes("Read")));
check("a return leads with picking the meaning", returns.every((route) => route[0] === "MeaningSelect"));
check(
  "a hand-set route does not reach the return",
  returns.every((route) => route.every((phase) => SECOND_SHOWING_PHASES.includes(phase)))
);
check(
  "with the sound off the listening stage is dropped, not swapped for a written one",
  JSON.stringify(buildSentencePhaseRoute({
    mastered: false, bilingual: false, audioMuted: true, secondShowing: true,
  })) === JSON.stringify(["MeaningSelect", "Order"])
);
check(
  "a two-word phrase has nothing to reorder, so its return is shorter still",
  JSON.stringify(buildSentencePhaseRoute({
    mastered: false, bilingual: false, audioMuted: false, orderable: false, secondShowing: true,
  })) === JSON.stringify(["MeaningSelect", "MissingWord"])
);
check(
  "teaching routes are untouched by the option",
  JSON.stringify(buildSentencePhaseRoute({ mastered: false, bilingual: false, audioMuted: false }))
    === JSON.stringify(LEAN_SENTENCE_PHASES)
);

// ── the weave: taught, taught, then the first one back ─────────────────────
const start = lab.indexOf("const withSecondShowing = (dealt: any[]): any[] => {");
const end = lab.indexOf("\n  const logActivity", start);
check("the weave can be found", start >= 0 && end > start);
const woven = bundle(
  `const withSpellingMemory = (steps: any[]): any[] => steps;\n`
  + lab.slice(start, end).replace("const withSecondShowing", "export const withSecondShowing"),
  "weave"
).withSecondShowing;

const phrase = (id) => ({ type: "sentence", item: { id, de: `${id}.` } });
const dealt = [phrase("a"), phrase("b"), phrase("c"), phrase("d"), { type: "complete" }];
const laid = woven(dealt).map((step) => step.type === "complete" ? "end" : `${step.item.id}${step.secondShowing ? "'" : ""}`);
check(`four phrases come back spread out (${laid.join(" ")})`,
  JSON.stringify(laid) === JSON.stringify(["a", "b", "c", "a'", "d", "b'", "c'", "d'", "end"]));

const everyPhraseTwice = (list) => {
  const taught = list.filter((s) => s.type === "sentence" && !s.secondShowing).map((s) => s.item.id);
  const back = list.filter((s) => s.secondShowing).map((s) => s.item.id);
  return JSON.stringify(taught) === JSON.stringify(back);
};
check("every phrase still comes back exactly once, in the order it was taught",
  everyPhraseTwice(woven(dealt)));
check("a sitting with one phrase still works",
  JSON.stringify(woven([phrase("a"), { type: "complete" }]).map((s) => s.type === "complete" ? "end" : `${s.item.id}${s.secondShowing ? "'" : ""}`))
    === JSON.stringify(["a", "a'", "end"]));
check("a sitting with no phrases is left alone",
  JSON.stringify(woven([{ type: "dialogue" }, { type: "complete" }])) === JSON.stringify([{ type: "dialogue" }, { type: "complete" }]));
check("the completion screen is last however it is dealt",
  woven(dealt).at(-1).type === "complete" && woven([phrase("a")]).at(-1).secondShowing === true);
check("a return is never dealt straight after the phrase it repeats",
  woven(dealt).every((step, i, all) => !step.secondShowing || all[i - 1]?.item?.id !== step.item.id));
check("nothing that is not a phrase is repeated",
  woven([phrase("a"), { type: "register" }, phrase("b"), { type: "complete" }])
    .filter((s) => s.secondShowing).every((s) => s.item?.id));

// ── the lesson runs it ────────────────────────────────────────────────────
// Twice: once for the route the lesson runs, once for the route it falls back
// to when the sound is turned off mid-stage. Missing either one hands the
// return the closed-book typing test.
check("the lesson asks for the return route by the stamp on the item",
  guided.includes("const isSecondShowing = Boolean(item?.secondShowing);")
    && (guided.match(/secondShowing: isSecondShowing,/g) ?? []).length >= 2);
check("a return opens on its first stage rather than the closed-book one",
  /item\?\.secondShowing\s*\n?\s*\? SECOND_SHOWING_PHASES\[0\]/.test(guided));
check("a return skips the typed French companion too",
  guided.includes("if (hasFr && !isSecondShowing) setPhase(\"French\"); else onNext();"));

if (failures) { console.log(`\n${failures} second showing check(s) failed`); process.exit(1); }
console.log("\nphrases come back soon, and cheaply");
