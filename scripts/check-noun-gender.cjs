/**
 * A German noun has one gender, and the app quizzes it.
 *
 * buildApiPartFromResolved turns every seed carrying an `article` into a
 * der/die/das question, so that field is taught as the noun's gender. Two packs
 * teaching the same noun with different articles means the learner is marked
 * right in one lesson and wrong in the next for the same answer. That happened:
 * der Untertitel in part246, die Untertitel in part351, because the second seed
 * showed the PLURAL and plurals all take die.
 *
 * The check cannot simply compare articles, because German genuinely has
 * homographs that differ by gender AND meaning — die Steuer is a tax, das Steuer
 * is a steering wheel; die Leiter is a ladder, der Leiter is a manager; das
 * Gehalt is a salary, der Gehalt is content. Those are correct and must pass. So
 * a conflict only counts when the two entries also share a meaning.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
let failures = 0;
function check(name, condition) {
  if (condition) { console.log(`ok   ${name}`); return; }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const result = esbuild.buildSync({
  stdin: {
    contents: 'export { allPartBlueprints } from "./src/lib/data.ts";',
    resolveDir: root,
    sourcefile: "gender-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("gender-check", module);
compiled.filename = path.join(root, ".gender-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);
const { allPartBlueprints } = compiled.exports;

const STOP = new Set(["a", "an", "the", "of", "for", "in", "on", "to", "and", "or", "with", "usually",
  "here", "plural", "singular", "someone", "something", "one", "your", "its", "it", "that", "this"]);
// Compared as stems, not literal words. "subtitle" and "subtitles" are the same
// meaning, and the whole reason this check exists is a seed that showed the
// PLURAL — so a literal comparison reads the conflict as a homograph and passes.
// Verified by reintroducing the Untertitel bug: literal matching missed it.
const stem = (word) => word.replace(/ies$/, "y").replace(/(ses|xes|zes|ches|shes)$/, "").replace(/s$/, "");
const contentWords = (gloss) => String(gloss || "")
  .toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-zäöüß\s-]/g, " ")
  .split(/[\s-]+/).filter((w) => w.length > 2 && !STOP.has(w))
  .map(stem);
const sharesMeaning = (a, b) => {
  const A = contentWords(a), B = contentWords(b);
  return A.some((w) => B.includes(w));
};

const byNoun = new Map();
for (const [partKey, blueprint] of Object.entries(allPartBlueprints)) {
  for (const seed of blueprint.seeds ?? []) {
    const article = String(seed.article || "").toLowerCase();
    if (!article) continue; // no article means no gender question is generated
    const noun = String(seed.de || "").replace(/^(der|die|das)\s+/i, "").trim();
    if (!noun || /\s/.test(noun)) continue;
    const key = noun.toLocaleLowerCase("de-DE");
    if (!byNoun.has(key)) byNoun.set(key, []);
    byNoun.get(key).push({ article, gloss: seed.fallbackEn, partKey, noun });
  }
}

const conflicts = [];
for (const [, entries] of byNoun) {
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j];
      if (a.article === b.article) continue;
      if (!sharesMeaning(a.gloss, b.gloss)) continue; // homograph: correct German
      conflicts.push(`${a.noun}: "${a.article}" in ${a.partKey} ("${a.gloss}") vs "${b.article}" in ${b.partKey} ("${b.gloss}")`);
    }
  }
}

check(`no noun is quizzed with two genders for the same meaning (${conflicts.length} found)`, conflicts.length === 0);
for (const line of conflicts.slice(0, 12)) console.error(`     ${line}`);

// A seed whose German still carries an article must not contradict its own
// `article` field — that would show one gender and mark another correct.
const selfContradiction = [];
for (const [partKey, blueprint] of Object.entries(allPartBlueprints)) {
  for (const seed of blueprint.seeds ?? []) {
    const declared = String(seed.article || "").toLowerCase();
    const shown = String(seed.de || "").trim().match(/^(der|die|das)\s+/i);
    if (declared && shown && shown[1].toLowerCase() !== declared) {
      selfContradiction.push(`${partKey}: ${seed.de} declares article "${declared}"`);
    }
  }
}
check(`no seed shows one article and declares another (${selfContradiction.length} found)`, selfContradiction.length === 0);
for (const line of selfContradiction.slice(0, 12)) console.error(`     ${line}`);

if (failures > 0) {
  console.error(`\n${failures} noun-gender check(s) failed`);
  process.exit(1);
}
console.log("\nNoun genders agree wherever the meaning does; homographs left alone");
process.exit(0);
