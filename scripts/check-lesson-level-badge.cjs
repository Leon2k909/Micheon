#!/usr/bin/env node
/**
 * A lesson says what level it is teaching at.
 *
 * The course runs A1 to C2 and the session never said which it was in. A
 * learner meeting a word has no way to tell whether it is early material they
 * should expect to hold, or something from far up the course that arrived
 * because of how the queue is ordered — and that judgement changes how hard
 * they are on themselves for not knowing it.
 *
 * The claim on the badge has to stay the claim the data supports. Levels are
 * a property of the PACK: every item carries its pack's label, and no word in
 * this catalogue has a difficulty of its own. So the badge shows the pack's
 * label and the tooltip says whose level it is. A per-item level would have
 * to be invented, and an invented one is how a beginner gets told a rare
 * compound noun is A1.
 *
 * What is guarded here: the label is the catalogue's own text rather than a
 * rounded step, a levelless pack draws nothing rather than guessing, and both
 * places the session shows an item — the preview card and every stage of the
 * exercise — actually carry it.
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

const built = esbuild.buildSync({
  stdin: {
    contents: `export { cefrBadgeLabel, cefrStep } from "./src/lib/cefr.ts";`,
    resolveDir: root, sourcefile: "badge.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
});
const mod = new Module("badge", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "badge.cjs"));
const { cefrBadgeLabel, cefrStep } = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// ── the label is the catalogue's, not a rounded one ─────────────────────────
check("a single level prints as itself", cefrBadgeLabel("A1") === "A1", `got ${cefrBadgeLabel("A1")}`);
check("a lower-case label is tidied rather than rejected",
  cefrBadgeLabel("b2") === "B2", `got ${cefrBadgeLabel("b2")}`);
/**
 * The range survives.
 *
 * cefrStep exists to FILE a pack at one level so a queue can be ordered, and
 * it files A1-B1 at A2. That is a judgement worth making for an ordering and
 * not worth showing to a learner as a fact about what they are reading. If
 * the badge ever starts printing cefrStep's answer, this is what notices.
 */
check("a range is shown as the range the pack claims",
  cefrBadgeLabel("A1-A2") === "A1-A2", `got ${cefrBadgeLabel("A1-A2")}`);
check("a wide range is not quietly narrowed to one step",
  cefrBadgeLabel("A1-B1") === "A1-B1" && cefrStep("A1-B1") === "a2",
  `badge said ${cefrBadgeLabel("A1-B1")}, and the filing step is ${cefrStep("A1-B1")} — `
  + "if those two ever agree, the badge is printing a judgement as a fact");

// ── and a pack with no level says nothing ───────────────────────────────────
for (const [name, value] of [["missing", undefined], ["empty", ""], ["blank", "   "], ["everywhere", "all"], ["null", null]]) {
  check(`a ${name} level draws no badge`, cefrBadgeLabel(value) === null,
    `got ${JSON.stringify(cefrBadgeLabel(value))}, which is a level the catalogue never claimed`);
}

// ── both places the session shows an item ───────────────────────────────────
const guided = read("src/GuidedSession.tsx");
check("the badge reads the shared helper rather than its own copy of the rule",
  guided.includes('import { cefrBadgeLabel } from "@/lib/cefr"')
    && guided.includes("const label = cefrBadgeLabel(level);"),
  "the session decides what counts as a level itself, so its answer can drift from the catalogue's");
check("the badge says whose level it is",
  guided.includes('title={ui("The level of the lesson this comes from")}'),
  "a bare level beside a word reads as that WORD's level, which is not what the data says");

check("every stage of the exercise carries it",
  guided.includes('<span className="fs-eyebrow"><i /> {ui("Sentence practice")}<CefrBadge level={item?.level} /></span>'),
  "the exercise does not show the level, so it is missing from all seven stages");
check("the preview card carries it",
  guided.includes("<CefrBadge level={card.level} />"),
  "the first thing a lesson shows is the one screen with no level on it");
check("the preview card is given a level to show",
  /level: step\.item\.level,/.test(guided) && /^ {2}level\?: string;$/mu.test(guided),
  "the preview card type drops the level on the way in, so its badge can never draw");

const css = read("src/index.css");
check("the badge is styled from the theme's own variables",
  /\.fs-level-badge \{[^}]*var\(--fs-line-strong\)[^}]*var\(--fs-muted\)/su.test(css),
  "the badge hardcodes colours, so it will be wrong in at least one of the guided themes");

// ── in every language the app offers ────────────────────────────────────────
const TABLES = {
  German: "src/lib/i18nDe.ts",
  French: "src/lib/i18nFr.ts",
  Polish: "src/lib/i18nPl.ts",
  Spanish: "src/lib/i18nEs.ts",
  Italian: "src/lib/i18nIt.ts",
  Portuguese: "src/lib/i18nPt.ts",
};
for (const [language, file] of Object.entries(TABLES)) {
  check(`the tooltip reads in ${language}`,
    read(file).includes('"The level of the lesson this comes from":'),
    "untranslated");
}

if (failed) {
  console.error(`\n${failed} lesson level badge check(s) failed.`);
  process.exit(1);
}
console.log(
  "check-lesson-level-badge: the session shows the pack's own level on the preview card and on "
  + "every stage, ranges intact, nothing invented for a pack that has none"
);
process.exit(0);
