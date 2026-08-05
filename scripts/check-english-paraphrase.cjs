#!/usr/bin/env node
/**
 * English recall must accept a correct answer worded differently.
 *
 * The step called "Recall the English" is testing whether the German was
 * understood. The stored English is one wording of that meaning, not the only
 * one, so grading it as an exact string turns correct comprehension into a
 * red "Not quite" — and, worse, into a struggle mark that drags the item back
 * into rotation. This gate pins both halves: real paraphrases pass, and
 * answers that swap who did what to whom still fail.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const root = path.join(__dirname, "..");

const built = esbuild.buildSync({
  stdin: {
    contents: `export { matchEnglishPhrase } from "./src/lib/germanTextMatch.ts";`,
    resolveDir: root,
    sourcefile: "entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20",
  write: false, logLevel: "silent",
});
const mod = new Module(path.join(root, "check-english-paraphrase.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-english-paraphrase.entry.cjs"));
const { matchEnglishPhrase } = mod.exports;

// [learner typed, answer key] — all of these mean the same thing.
const ACCEPT = [
  ["i see it that way too", "That's how I see it too."],
  ["I see it that way too.", "That's how I see it too."],
  ["that is how i see it too", "That's how I see it too."],
  ["give me the book", "Give the book to me."],
  ["i have seen that already", "I have already seen that."],
];

// These change the meaning and must still be refused.
const REJECT = [
  ["Peter calls Anna.", "Anna calls Peter."],
  ["do you see it that way too", "That's how I see it too."],
  ["i do not see it that way", "That's how I see it too."],
  ["the dog bites the man", "The man bites the dog."],
  // Prepositions are not scaffolding. "of" is the whole difference between
  // "could have" and the mistake the confusables pack exists to correct, and
  // treating it as noise made this pass — the wider gate caught it.
  ["I could of helped you if you had asked", "I could've helped you if you'd asked."],
  ["You should of told me sooner", "You should've told me sooner."],
  ["the book on the table", "The book under the table."],
];

const failures = [];
for (const [typed, key] of ACCEPT) {
  const result = matchEnglishPhrase(typed, key);
  if (!result.ok) failures.push(`should ACCEPT "${typed}" for "${key}"`);
}
for (const [typed, key] of REJECT) {
  const result = matchEnglishPhrase(typed, key);
  if (result.ok) failures.push(`should REJECT "${typed}" for "${key}"`);
}

if (failures.length) {
  console.error("FAIL check-english-paraphrase");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(`check-english-paraphrase: ${ACCEPT.length} paraphrases accepted, ${REJECT.length} meaning changes refused`);
