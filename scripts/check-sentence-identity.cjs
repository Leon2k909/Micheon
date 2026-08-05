// Two sentences that differ only by a closing "." or "!" are one sentence.
//
// The learner hit this directly: "Lange nicht gesehen." and "Lange nicht
// gesehen!" arrived as two separate exercises, back to back. Every de-dup in
// the app compared whole strings, so nothing could see them as the same line.
//
// A "?" is deliberately still significant — "Alles klar." and "Alles klar?"
// are a statement and a question, and collapsing those would lose a sentence.
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { sentenceIdentityKey, matchingVisibleKey } from "./src/lib/germanTextMatch.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { expansionPartBlueprints } from "./src/lib/expansionPacks.ts";
      export { curatedTopics } from "./src/lib/phrasebank.ts";
    `,
    resolveDir: root,
    sourcefile: "sentence-identity-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("sentence-identity-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "sentence-identity-check.cjs"));
const { sentenceIdentityKey, matchingVisibleKey, allPartBlueprints, expansionPartBlueprints, curatedTopics } = compiled.exports;

const session = fs.readFileSync(path.join(root, "src/session.ts"), "utf8");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const same = (a, b) => sentenceIdentityKey(a).toLowerCase() === sentenceIdentityKey(b).toLowerCase();

check(
  "a closing full stop and exclamation mark are the same sentence",
  same("Lange nicht gesehen.", "Lange nicht gesehen!")
    && same("Danke schön.", "Danke schön!")
    && same("Warte kurz.", "Warte kurz!")
);
check(
  "a question mark still makes a different sentence",
  !same("Alles klar.", "Alles klar?") && !same("So ungefähr.", "So ungefähr?")
);
check(
  "different sentences are never merged",
  !same("Warte kurz.", "Sitz und warte.") && !same("Gerne.", "Sehr gerne.")
);
check(
  "the matching board uses the same identity, so no two cards read alike",
  matchingVisibleKey("Schade!", "de") === matchingVisibleKey("Schade.", "de")
);

// Both de-dup points in the session builder have to use it, or a lesson can
// still serve the pair: one guards a single pack, the other the catalogue.
check(
  "the lesson builder de-dupes on sentence identity",
  (session.match(/sentenceIdentityKey\(de\)\.toLowerCase\(\)/g) ?? []).length === 2,
  `found ${(session.match(/sentenceIdentityKey\(/g) ?? []).length} uses`
);

// And the shipped content should not still hold two taught phrases that are
// the same sentence. A phrase echoed inside a DIALOGUE is fine — that is the
// phrase being used in conversation, and the de-dup keeps them apart in a
// lesson — so only phrase-vs-phrase counts here.
const byKey = new Map();
const offenders = [];
// The phrasebank ships taught phrases too, and leaving it out here would let
// this whole check pass without ever looking at them.
const CORPORA = [allPartBlueprints, expansionPartBlueprints, Object.fromEntries(curatedTopics.map((t) => [t.id, t]))];
for (const packs of CORPORA) {
  for (const [packKey, pack] of Object.entries(packs)) {
    for (const phrase of pack.phrases ?? []) {
      if (!phrase?.de) continue;
      const key = sentenceIdentityKey(phrase.de).toLowerCase();
      if (!key) continue;
      const seen = byKey.get(key);
      if (seen && seen.de !== phrase.de) offenders.push(`${seen.packKey} "${seen.de}" vs ${packKey} "${phrase.de}"`);
      else if (!seen) byKey.set(key, { packKey, de: phrase.de });
    }
  }
}
check(
  `no two taught phrases are the same sentence (${byKey.size} checked)`,
  offenders.length === 0,
  offenders.slice(0, 4).join(" | ")
);

if (failures) {
  console.error(`\n${failures} sentence-identity regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\none sentence is one sentence, whatever it ends with");
