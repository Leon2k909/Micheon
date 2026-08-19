#!/usr/bin/env node
/**
 * German errors the other gates do not look for.
 *
 * A fifth of the sentence practice came from a Tatoeba export that kept only
 * de, en and level — the sentence ids, the owner, and the approved/orphan/
 * native flags were all discarded, so it can never be re-filtered on quality
 * and there is no record that it ever was. It shipped 65 sentences spelling
 * "die Einzige" as "die einzige", and was teaching them as correct German.
 *
 * check-german-orthography covers pre-1996 ss/ß spellings and invented
 * umlauts. check-german-punctuation covers commas. Neither of them looks at
 * capitalisation of substantivised adjectives, or at whether a sentence ends
 * like one, which is how all 65 got through.
 *
 * WHAT THIS DELIBERATELY DOES NOT CHECK. An audit of all 22,234 entries also
 * flagged "Blumen ohne Anlass sind die besten" and "Die erste Staffel ist die
 * beste" — and both are correct. When the noun is present and the adjective
 * stands in for it, German keeps the adjective lower case; it is only a
 * substantivisation, and only capitalised, when there is no noun to lean on.
 * ander- and meist- are on Duden's explicit lower-case list regardless. A rule
 * that "fixed" those would make the app teach worse German than it does now,
 * so this checks the forms Duden lists outright and nothing cleverer.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "german-quality-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("german-quality", module);
compiled.filename = path.join(root, ".german-quality.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;
global.window = undefined;

const resolved = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);
const parts = { ...resolved, ...M.buildBundledParts(), ...M.buildTatoebaParts() };

const entries = [];
for (const [partKey, part] of Object.entries(parts)) {
  for (const item of part.phrases || []) {
    if (item && item.de) entries.push({ partKey, de: String(item.de), en: String(item.en || "") });
  }
}

const failures = [];
const flag = (label, hits) => {
  if (!hits.length) return;
  failures.push(`${label} (${hits.length}):`);
  for (const hit of hits.slice(0, 5)) failures.push(`    [${hit.partKey}] ${hit.de}`);
};

// ── capitalisation Duden states outright ──────────────────────────────────
// der/die/das Einzige is listed as a noun. There is no elided noun to lean on:
// "Ich bin nicht die Einzige" means "the only person", not "the only <thing
// just mentioned>", which is why this one is safe to enforce and "die beste
// [Staffel]" is not.
flag(
  'substantivised "Einzige" left lower-case',
  entries.filter((e) => /\b(der|die|das|dem|den|ein|eine|einer|eines|einem|einen)\s+einzige[nrs]?\b(?!\s+[A-ZÄÖÜ])/.test(e.de))
);

// ── a taught sentence ends like a sentence ────────────────────────────────
// Multi-word only, and closing punctuation includes quotes and brackets so
// dialogue lines and vocabulary phrases are not dragged in.
const FINITE_VERBS = new RegExp(
  "\\b(ist|sind|bin|bist|seid|war|warst|waren|wäre|wären"
  + "|hat|habe|hast|habt|haben|hatte|hatten|hätte|hätten"
  + "|wird|werde|wirst|werdet|werden|wurde|wurden|würde|würden"
  + "|kann|kannst|könnt|können|konnte|konnten|könnte|könnten"
  + "|will|willst|wollt|wollen|wollte|wollten|muss|musst|müsst|müssen|musste|mussten"
  + "|soll|sollst|sollt|sollen|sollte|sollten|darf|darfst|dürft|dürfen|durfte|durften"
  + "|mag|magst|mögt|mögen|möchte|möchtest|möchten"
  + "|geht|gehe|gehst|gehen|ging|gingen|kommt|komme|kommst|kommen|kam|kamen"
  + "|macht|mache|machst|machen|machte|machten|gibt|gebe|gibst|geben|gab|gaben"
  + "|weiß|weißt|wisst|wissen|wusste|wussten|sagt|sage|sagst|sagen|sagte|sagten"
  + "|nimm|nimmt|nehme|nimmst|nehmen|nahm|nahmen|sieht|sehe|siehst|sehen|sah|sahen"
  + "|heißt|heiße|heißen|bleibt|bleibe|bleiben|blieb|blieben|braucht|brauche|brauchen"
  + "|findet|finde|findest|finden|fand|fanden|denke|denkst|denkt|denken|glaube|glaubst|glaubt|glauben"
  + "|lass|lasst|lassen|steht|stehe|stehst|stehen|liegt|liege|liegen|passt|passen"
  + "|läuft|laufen|fährt|fahren|isst|essen|trinkt|trinken|schläft|schlafen"
  + "|arbeite|arbeitest|arbeitet|arbeiten|verstehe|verstehst|versteht|verstehen)\\b",
  "i"
);

flag(
  "sentence with no final punctuation",
  entries.filter((e) => {
    const de = e.de.trim();
    if (!/\s/.test(de)) return false;
    // A finite verb is what separates a sentence from a phrase the course
    // teaches whole ("In stiller Trauer"). No verb, no rule.
    if (!FINITE_VERBS.test(de)) return false;
    return !/[.!?…"'“”„»«)\]]$/.test(de);
  })
);

// ── typographic slips ─────────────────────────────────────────────────────
// German sets a space before an ellipsis, so only real punctuation counts.
flag(
  "space before punctuation",
  entries.filter((e) => /\s[.,!?;:](?!\.)/.test(e.de) && !/\s\.\.\./.test(e.de))
);
flag("double space", entries.filter((e) => /\s{2,}/.test(e.de)));

// ── a question in one language and a statement in the other ───────────────
flag(
  "German statement paired with an English question",
  entries.filter((e) => {
    const de = e.de.trim();
    const en = e.en.split(" / ")[0].trim();
    if (!de || !en) return false;
    if (/[„“"»]/.test(de)) return false;          // quoted dialogue carries both
    if (!/^(ist|sind|war|waren|hast|hat|habt|haben|kannst|kann|könnt|können|willst|will|wollt|wollen|bist|glaubst|weißt|magst|darfst|soll|sollst)\b/i.test(de)) return false;
    return !de.endsWith("?") && en.endsWith("?");
  })
);

if (failures.length) {
  console.error("FAIL check-german-quality");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}

console.log(
  `check-german-quality: ${entries.length.toLocaleString()} taught German sentences carry their `
  + "capitals, their final punctuation and their question marks"
);
