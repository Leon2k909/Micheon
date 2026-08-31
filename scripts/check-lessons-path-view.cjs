#!/usr/bin/env node
/**
 * The path is a view of the lessons, not a screen beside them.
 *
 * It was drawn under the ways-in cards on the Learn screen: the same packs,
 * the same grades, the same curriculum order the lesson list already showed,
 * in a second picture on a second screen. Two pictures of one course means a
 * learner has to remember which screen shows which — and it means every later
 * change to the catalogue has two places that can drift apart.
 *
 * So it moved: Lessons offers it as one of two views of itself. What this
 * check guards is the part that a screenshot would not catch and a passing
 * build would not either — that the move is a MOVE. A path quietly left
 * behind on the Learn row, or a second copy of the path component written to
 * serve Lessons, would look right in both places and be the exact problem
 * this was meant to end.
 *
 * It also guards the switch being real: a view choice with no visible control
 * is a view nobody can reach, and one that only renders in one of the two
 * branches is a door that locks behind you.
 */
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// ── one path, in a file of its own ──────────────────────────────────────────
const pathModule = "src/components/duo/DuoPath.tsx";
check("the path is a component of its own", fs.existsSync(path.join(root, pathModule)),
  `${pathModule} does not exist, so Lessons has nothing to render`);

const pathSource = read(pathModule);
check("it takes the catalogue and a way to open a pack, and decides nothing else",
  /export function DuoPath\(\{\s*\n\s*apiParts,\s*\n\s*onOpenLesson,/.test(pathSource),
  "the path's props changed shape; whoever renders it may no longer be able to");
check("every node opens the guided session rather than teaching its own lesson",
  pathSource.includes("onClick={() => onOpenLesson(node.key)}"),
  "a stop on the path opens something other than the one place a phrase is taught properly");

// ── Lessons renders it, and offers the choice ───────────────────────────────
const lessons = read("src/components/lab/LearnView.tsx");
check("Lessons imports the one path component rather than drawing its own",
  lessons.includes('import { DuoPath } from "@/components/duo/DuoPath"'),
  "Lessons builds a second picture of the course");
check("the path view hands it the same opener the lesson list uses",
  /<DuoPath apiParts=\{apiParts\} onOpenLesson=\{onOpenLesson\} \/>/.test(lessons),
  "the two views of one screen open lessons differently, which is two teachers again");

check("the choice is a labelled control, not a hidden mode",
  lessons.includes('ui("All lessons")') && lessons.includes('ui("Your path")'),
  "the view choice has no labels, so nothing on screen says a second view exists");
check("the control says which view is showing",
  /aria-pressed=\{value === key\}/.test(lessons),
  "the buttons do not report their state, so neither a screen reader nor the styling knows");

/**
 * The switch has to render in BOTH branches.
 *
 * A toggle that only draws on the list would take you to the path and leave
 * you there — the way back would be whatever nav entry you could find.
 */
const choices = [...lessons.matchAll(/<LessonsViewChoice /g)].length;
check("the switch is on both views, so neither is a one-way door", choices === 2,
  `<LessonsViewChoice> renders ${choices} time(s); the list and the path each need one`);
check("the path view is reached by the choice rather than by a route",
  /if \(view === "path"\)/.test(lessons),
  "nothing branches on the chosen view");

// ── and it really left the Learn row ────────────────────────────────────────
const learn = read("src/components/duo/DuoPathView.tsx");
check("the Learn row no longer draws the path",
  !learn.includes("<DuoPath") && !learn.includes("buildDuoPath"),
  "the path is in Lessons AND still under the cards — two pictures of one course");
check("the Learn row stopped asking for what it no longer uses",
  !learn.includes("onOpenLesson") && !learn.includes("apiParts"),
  "the cards still take the path's props, which will read as a live feature to the next person");

const shell = read("src/prototype/NewUiPrototype.tsx");
check("the shell stopped handing the Learn row the path's props",
  !/<DuoPathView[^>]*onOpenLesson/su.test(shell),
  "the mount still passes an opener nothing on that screen opens");

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
  const table = read(file);
  const missing = ["All lessons", "Your path"].filter((key) => !table.includes(`"${key}":`));
  check(`the switch is readable in ${language}`, missing.length === 0,
    missing.length ? `untranslated: ${missing.join(", ")}` : "");
}

process.exit(failed === 0 ? 0 : 1);
