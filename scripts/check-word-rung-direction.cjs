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
const { wordLadderRung, spokenWordRung, cefrRung, everydayWordPartBlueprints } = mod.exports;

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
const spokenDemoted = [];
for (const [id, pack] of Object.entries(everydayWordPartBlueprints)) {
  const level = String(pack.level || "").toUpperCase();
  const band = cefrRung(level);
  if (!band || band > 90) continue;
  for (const seed of pack.seeds || []) {
    const lookup = seed.lookup || seed.de;
    if (!lookup) continue;
    const own = wordLadderRung({ level, lookup, de: seed.de });
    // Every tier of the spoken rescue, including the one that fires for the
    // most common words of all.
    for (const rank of [0, 299, 300, 1199, 1200, 50000]) {
      const got = spokenWordRung({ level, lookup, de: seed.de }, rank, null);
      if (got > own) spokenDemoted.push(`${seed.de} (${id}, spoken rank ${rank}: ${own} -> ${got})`);
    }
  }
}
check("the spoken ladder never raises a word's rung either",
  spokenDemoted.length === 0,
  spokenDemoted.slice(0, 6).join("\n     "));

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
