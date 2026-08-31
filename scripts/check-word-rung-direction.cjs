#!/usr/bin/env node
/**
 * A word's rung is never HARDER than the pack that teaches it.
 *
 * wordLadderRung and spokenWordRung both exist to rescue words whose lesson
 * is advanced but which are themselves everyday: haben and bitte are taught
 * in A2 packs, and ordering Listen by the pack label put haben at 1,045 of a
 * queue that had just promised to start with the easiest thing it had. Both
 * functions answer that by consulting a frequency bank and lowering the rung.
 *
 * Lowering. The rescue only ever runs in one direction, and the moment it can
 * run in the other it does something nobody would ask for: it demotes a word
 * for being COMMON. wordLadderRung's second tier was written as a bare
 * `return 2`, so every word already on rung 1 that happened to be common
 * enough to reach the frequency bank was moved to rung 2, while the rare
 * words around it fell through to their pack's band and stayed on rung 1.
 *
 * Measured when this was found: 11 of the 504 words in A1-labelled everyday
 * packs were demoted — Hund, Kopf, Fuß, Haut, Wald, Erde, Lehrer, Professor,
 * Wissenschaftler, Bürgermeister, Theater — and 493 stayed in front of them,
 * including Linse, Thymian, Faultier, Stachelschwein and Artischocke, none of
 * which appear in the spoken corpus often enough to be ranked at all. A
 * learner on easiest-first met lentil, thyme and sloth before dog and head.
 *
 * This does not assert that any word's rung is RIGHT — that is a content
 * question this cannot answer, and a check that claimed to would be lying
 * about what a frequency bank knows. It asserts only the direction: a rescue
 * that fires must not leave a word worse off than not firing at all.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { wordLadderRung, spokenWordRung } from "./src/lib/wordSession.ts";
      export { cefrRung } from "./src/lib/cefr.ts";
      export { everydayWordPartBlueprints } from "./src/lib/everydayWordPacks.ts";
      export { BEYOND_A_BEGINNER } from "./src/lib/beyondBeginnerWords.ts";
    `,
    resolveDir: root, sourcefile: "rung.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
  loader: { ".json": "json" },
});
const mod = new Module("rung", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "rung.cjs"));
const { wordLadderRung, spokenWordRung, cefrRung, everydayWordPartBlueprints, BEYOND_A_BEGINNER } = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

// ── every real word in every everyday pack ──────────────────────────────────
const demoted = [];
let examined = 0;
for (const [id, pack] of Object.entries(everydayWordPartBlueprints)) {
  const level = String(pack.level || "").toUpperCase();
  const band = cefrRung(level);
  if (!band || band > 90) continue;
  for (const seed of pack.seeds || []) {
    const lookup = seed.lookup || seed.de;
    if (!lookup) continue;
    examined += 1;
    const rung = wordLadderRung({ level, lookup, de: seed.de });
    if (rung > band) demoted.push(`${seed.de} (${id}, pack ${level} = rung ${band}, word given rung ${rung})`);
  }
}

check(`no word is ranked harder than its own pack (${examined} words)`,
  demoted.length === 0,
  demoted.length
    ? `${demoted.length} demoted for being common:\n     ` + demoted.slice(0, 8).join("\n     ")
    : "");

// ── and the same for the spoken ladder, which already had it right ──────────
//
// "Never raises" was the whole rule, and it is narrowed here to what it is
// actually protecting: no word may be raised by FREQUENCY. That is the bug
// this file was written for - a rescue firing on a bank rank and leaving a
// word worse off than not firing at all - and it stays forbidden.
//
// What is now allowed is a word raised because somebody named it. A pack's
// level is its topic's, so an A1 topic teaches die Kartoffel and die
// Artischocke alike, and no frequency signal separates them: the bank has
// ranked neither and a conversational corpus mentions neither, because
// conversation has no occasion to mention a cow OR a porcupine. Demoting on
// that silence took die Kuh, das Knie and die Jacke with it. So the later
// half is written out by hand in beyondBeginnerWords.ts, and a judgement made
// one word at a time is the one thing this check should not stand in the way
// of. Every other seed still may not move.
const spokenDemoted = [];
for (const [id, pack] of Object.entries(everydayWordPartBlueprints)) {
  const level = String(pack.level || "").toUpperCase();
  const band = cefrRung(level);
  if (!band || band > 90) continue;
  for (const seed of pack.seeds || []) {
    const lookup = seed.lookup || seed.de;
    if (!lookup) continue;
    if (BEYOND_A_BEGINNER.has(seed.de) || BEYOND_A_BEGINNER.has(lookup)) continue;
    const own = wordLadderRung({ level, lookup, de: seed.de });
    // Every tier of the spoken rescue, including the one that fires for the
    // most common words of all.
    for (const rank of [0, 299, 300, 1199, 1200, 50000]) {
      const got = spokenWordRung({ level, lookup, de: seed.de }, rank, null);
      if (got > own) spokenDemoted.push(`${seed.de} (${id}, spoken rank ${rank}: ${own} -> ${got})`);
    }
  }
}
check("no word is raised by frequency alone; only by being named",
  spokenDemoted.length === 0,
  spokenDemoted.slice(0, 6).join("\n     "));

// ...and the naming has to stay a judgement about difficulty rather than a
// place to put anything awkward. These are the words it must never contain:
// if one of them ever needs excluding, the packs are wrong, not the ladder.
const mustStayBeginner = [
  "die Kuh", "das Pferd", "die Katze", "der Hund", "das Knie", "der Mund",
  "die Jacke", "das Hemd", "die Kartoffel", "die Tomate", "der B\u00e4cker",
  "die Ampel", "regnen", "duschen", "der Teller", "die Flasche", "der Mond",
];
const wronglyNamed = mustStayBeginner.filter((word) => BEYOND_A_BEGINNER.has(word));
check("the named list holds none of the words a beginner plainly needs",
  wronglyNamed.length === 0, wronglyNamed.join(", "));

/**
 * The words the bug was found on, by name.
 *
 * A count alone would pass again the day somebody reintroduces the bare
 * return for a different tier, as long as the total happened to land at zero
 * for some other reason. These are the actual words a learner saw in the
 * wrong order, so they are the ones asserted.
 */
const COMMON_A1 = ["Hund", "Kopf", "Fuß", "Wald", "Haut", "Erde", "Lehrer", "Theater"];
const RARE_A1 = ["Linse", "Thymian", "Faultier", "Stachelschwein", "Artischocke"];

const wrongWay = [];
for (const common of COMMON_A1) {
  const c = wordLadderRung({ level: "A1", lookup: common, de: common });
  for (const rare of RARE_A1) {
    const r = wordLadderRung({ level: "A1", lookup: rare, de: rare });
    if (c > r) wrongWay.push(`${common} (rung ${c}) sorts behind ${rare} (rung ${r})`);
  }
}
check("no common A1 word sorts behind a rare one from the same band",
  wrongWay.length === 0,
  wrongWay.slice(0, 5).join("\n     "));

if (failed) {
  console.error("\nA rescue that demotes a word for being common is worse than no rescue.");
  process.exit(1);
}
console.log(`check-word-rung-direction: across ${examined} words, no rescue tier ever makes a word harder than its own pack`);
process.exit(0);
