#!/usr/bin/env node
/**
 * The two views of Lessons show the same course, and put the same work away.
 *
 * All lessons and Your path are one screen with a switch on it, so a pack in
 * one and not the other is not a difference of opinion — it is one of them
 * being wrong, and the learner has no way to tell which. They disagreed by 129
 * rows: the list showed reserved keys with no content at all ("Part 401", and
 * up), where the path dropped them because it builds from catalogue items and
 * they produce none. Clicking one opened a lesson with nothing to teach.
 *
 * They also disagreed about what a pack CONTAINS. partItemCount added vocab
 * and phrases and stopped, so the sixty-nine packs that hold everything as
 * dialogues were counted as empty — printed as "0 items" on their own cards,
 * and dropped by anything filtering on the count.
 *
 * And the shelf: the list has always been able to put finished lessons away,
 * the path walked you through every one of them. Same rule now, from the same
 * module, with the fading exception intact — a finished pack whose words have
 * started to go comes back on its own, in both views.
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildDuoPath, duoPackCounts } from "./src/lib/duoPath.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts, partItemCount } from "./src/lib/contentBank.ts";
      export { buildCatalog } from "./src/session.ts";
      export { getHideFinishedLessons, passesFinishedShelf } from "./src/lib/lessonShelf.ts";
    `,
    resolveDir: root, sourcefile: "sync.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("sync", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "sync.cjs"));
const {
  buildDuoPath, duoPackCounts, allPartBlueprints, buildBundledParts, partItemCount,
  buildCatalog, passesFinishedShelf,
} = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const parts = { ...allPartBlueprints, ...buildBundledParts() };

// ── the same packs, both ways ───────────────────────────────────────────────
// The list keeps a pack when it has anything to teach; the path keeps one when
// the catalogue builds a card from it. Those are the same claim, so the two
// sets have to match exactly.
const listKeys = new Set(Object.entries(parts).filter(([, part]) => partItemCount(part) > 0).map(([key]) => key));
const unshelved = buildDuoPath(parts, null, { hideFinished: false });
const pathKeys = new Set(unshelved.units.flatMap((unit) => unit.nodes.map((node) => node.key)));

const onlyList = [...listKeys].filter((key) => !pathKeys.has(key));
const onlyPath = [...pathKeys].filter((key) => !listKeys.has(key));
check("every pack the list shows is on the path", onlyList.length === 0,
  `${onlyList.length} in the list only: ${onlyList.slice(0, 6).join(", ")}`);
check("every pack on the path is in the list", onlyPath.length === 0,
  `${onlyPath.length} on the path only: ${onlyPath.slice(0, 6).join(", ")}`);
check("and there is a course to show", pathKeys.size > 300, `${pathKeys.size} packs`);

// ── an empty pack is not a lesson ───────────────────────────────────────────
const catalog = buildCatalog(parts);
const taught = new Set(catalog.filter((item) => item.partKey).map((item) => item.partKey));
const emptyShown = [...listKeys].filter((key) => !taught.has(key));
check("no pack with nothing to teach reaches either view", emptyShown.length === 0,
  `${emptyShown.length} empty packs are still listed: ${emptyShown.slice(0, 6).join(", ")}`);

// ── a dialogue pack is not empty ────────────────────────────────────────────
const dialogueOnly = Object.entries(parts).filter(([, part]) =>
  (part.dialogues?.length ?? 0) > 0
  && (part.phrases?.length ?? 0) === 0
  && (part.vocab?.length ?? 0) === 0);
check("there are dialogue-only packs to get wrong", dialogueOnly.length > 20,
  `${dialogueOnly.length} found — if this drops to zero the case below stops being tested`);
check("a dialogue-only pack counts its lines rather than reporting nothing",
  dialogueOnly.every(([, part]) => partItemCount(part) > 0),
  "a pack that teaches only dialogue says it has 0 items, and anything filtering on the count drops it");

// ── the shelf, applied to both ──────────────────────────────────────────────
/**
 * Learned, with progress that actually exists.
 *
 * The first draft of this asserted the shelf against a catalogue carrying no
 * grades at all — where nothing is finished, so nothing is ever hidden and
 * every assertion about hiding passed no matter what the code did. Two
 * injections that broke the shelf outright went unnoticed. The rule needs
 * progress to bite on.
 *
 * duoPackCounts is what the path counts with, so counting through it here
 * means this check and the screen agree by construction.
 */
const [doneKey, fadingKey] = [...pathKeys];
const DAY = 86400000;
const now = Date.now();
// dueAt, an ISO string — the field normalize() actually reads. Written as
// dueAtMs first, which it ignores, so every record fell back to "due one
// interval from now" and nothing could ever be overdue. The two assertions
// about fading passed against a fixture that was never fading.
const learned = (dueAtMs) => ({
  lastGrade: "know",
  successes: 3,
  intervalDays: 10,
  dueAt: new Date(dueAtMs).toISOString(),
});
const grades = {};
for (const item of catalog) {
  // Comfortably in date, so nothing about it is fading.
  if (item.partKey === doneKey) grades[item.id] = learned(now + 30 * DAY);
  // Long overdue, so the memory model says it is going.
  if (item.partKey === fadingKey) grades[item.id] = learned(now - 400 * DAY);
}
const counted = duoPackCounts(catalog, grades, now);
const doneRow = counted.get(doneKey);
const fadingRow = counted.get(fadingKey);

check("a pack answered correctly and in date counts as finished, not fading",
  doneRow.done === doneRow.total && doneRow.fading === 0,
  `${doneKey}: ${doneRow.done}/${doneRow.total} done, ${doneRow.fading} fading`);
check("a pack long overdue counts as fading",
  fadingRow.done === fadingRow.total && fadingRow.fading > 0,
  `${fadingKey}: ${fadingRow.done}/${fadingRow.total} done, ${fadingRow.fading} fading — `
  + "the path cannot bring back what it cannot see going");

check("the shelf puts the finished pack away",
  passesFinishedShelf(doneRow, { hideFinished: true, askedForFinished: false }) === false,
  "a pack with every item known and none fading is still on the path");
check("and keeps the fading one",
  passesFinishedShelf(fadingRow, { hideFinished: true, askedForFinished: false }) === true,
  "a pack whose words have started to go was hidden — the signal is invisible where it matters most");
check("with the shelf off, both stay",
  passesFinishedShelf(doneRow, { hideFinished: false, askedForFinished: false })
    && passesFinishedShelf(fadingRow, { hideFinished: false, askedForFinished: false }));

// ── and the path itself, built against that progress ────────────────────────
const shelved = buildDuoPath(parts, null, { hideFinished: true, grades });
const shelvedKeys = new Set(shelved.units.flatMap((unit) => unit.nodes.map((node) => node.key)));
const shownAll = buildDuoPath(parts, null, { hideFinished: false, grades });
const shownAllKeys = new Set(shownAll.units.flatMap((unit) => unit.nodes.map((node) => node.key)));

check("the finished pack is gone from the path with the shelf on",
  !shelvedKeys.has(doneKey),
  `${doneKey} is fully known and not fading, and the path still walks you through it`);
check("the fading pack is still there",
  shelvedKeys.has(fadingKey),
  `${fadingKey} is finished but going, and the shelf hid it anyway`);
check("both come back with the shelf off",
  shownAllKeys.has(doneKey) && shownAllKeys.has(fadingKey),
  "turning the shelf off does not bring the finished packs back, so nothing is deleted is not true");
check("the path reports what the shelf is holding",
  shelved.shelvedNodes === shownAllKeys.size - shelvedKeys.size && shelved.shelvedNodes > 0,
  `it says ${shelved.shelvedNodes} are put away while ${shownAllKeys.size - shelvedKeys.size} are missing from it`);
check("a path built with the shelf on still counts its own totals",
  shelved.totalNodes === shelved.units.flatMap((u) => u.nodes).length,
  "the total and the nodes on screen disagree, so the percentage describes a path nobody is looking at");
// The rule itself, on the cases nobody looks at on screen.
check("finished and not fading goes away",
  passesFinishedShelf({ done: 5, total: 5, fading: 0 }, { hideFinished: true, askedForFinished: false }) === false);
check("finished but fading comes back",
  passesFinishedShelf({ done: 5, total: 5, fading: 1 }, { hideFinished: true, askedForFinished: false }) === true,
  "a lesson you have started to forget is hidden — the fading signal is invisible where it matters most");
check("unfinished is never shelved",
  passesFinishedShelf({ done: 4, total: 5, fading: 0 }, { hideFinished: true, askedForFinished: false }) === true);

// ── hidden by default, and a way back in both views ─────────────────────────
const shelf = read("src/lib/lessonShelf.ts");
check("the shelf is on unless it has been turned off",
  shelf.includes('return window.localStorage.getItem(KEY) !== "0";'),
  "finished lessons are shown by default again");
check("turning it off is stored rather than forgotten",
  shelf.includes('window.localStorage.setItem(KEY, hide ? "1" : "0");'),
  "off is written as an absent key, which now reads back as the default — so the choice does not survive");

const pathView = read("src/components/duo/DuoPath.tsx");
check("the path says how much it is holding, and hands it back",
  pathView.includes('uiFmt("{count} finished put away — show them"')
    && pathView.includes("onClick={onShowFinished}"),
  "the path hides finished units with nothing on screen to say so or to undo it");

const lessons = read("src/components/lab/LearnView.tsx");
check("both views read one setting rather than each keeping its own",
  /<DuoPath[\s\S]{0,220}hideFinished=\{hideFinished\}/u.test(lessons),
  "the path decides for itself whether to hide finished work, so the switch in the list does not reach it");

const TABLES = ["De", "Fr", "Pl", "Es", "It", "Pt"];
for (const lang of TABLES) {
  check(`the way back reads in ${lang}`,
    read(`src/lib/i18n${lang}.ts`).includes('"{count} finished put away — show them":'),
    "untranslated");
}

if (failed) {
  console.error(`\n${failed} lessons-in-step check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-lessons-in-step: both views hold the same ${pathKeys.size} packs, dialogue-only packs count their lines, `
  + "and the shelf is on by default in both with the fading exception intact"
);
process.exit(0);
