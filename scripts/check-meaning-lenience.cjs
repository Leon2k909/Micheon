#!/usr/bin/env node
/**
 * A lesson asks two different questions and must not mark them the same way.
 *
 * The target box is the answer: spelling is part of knowing the word, and a
 * missed umlaut or a wrong article is what the lesson exists to catch. The
 * meaning box only shows the sentence was understood, in a language the
 * learner already has — so a slipped key there was failing a recall over a
 * language nobody is being tested on.
 *
 * The existing tolerance would not help, because it refuses any word under
 * five letters. That floor is right for the language being taught, where a
 * one-letter difference in a short word is usually the answer itself (der
 * against die, ihn against ihm). On the meaning side it protects nothing and
 * rejects teh, smal and rooom — the commonest slips there are.
 *
 * Both halves are checked here. Widening the meaning side is only safe while
 * the target side stays exact, and the budget is what stops "recognisably the
 * same sentence" turning into "a different sentence".
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { forgivableMeaningSlip, sameEnglishAspect, matchGermanSentence, matchEnglishPhrase } from "./src/lib/germanTextMatch.ts";',
      'export { DEFAULT_MEANING_LENIENCE } from "./src/lib/meaningLenience.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "meaning-lenience-entry.ts",
    loader: "ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  logLevel: "silent",
});
const mod = new Module("meaning-lenience", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "meaning-lenience.cjs"));
const { forgivableMeaningSlip, sameEnglishAspect, matchGermanSentence, DEFAULT_MEANING_LENIENCE } = mod.exports;

let failed = 0;
const check = (name, condition) => {
  if (condition) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}`);
};

// The slips the five-letter floor used to reject, which are the common ones.
for (const [input, target] of [
  ["teh room is small", "the room is small"],
  ["the room is smal", "the room is small"],
  ["the rooom is small", "the room is small"],
  ["the romo is small", "the room is small"],
  ["ive lsot trust", "ive lost trust"],
]) {
  check(`a slipped key in the meaning is forgiven: ${input}`, forgivableMeaningSlip(input, target));
}

// ...and the budget, which is what keeps it from accepting a different answer.
for (const [input, target, why] of [
  ["the room is big", "the room is small", "a different word entirely"],
  ["the flat is bright", "the room is small", "a different sentence"],
  ["the room is", "the room is small", "a word missing"],
  ["the room is small today", "the room is small", "a word added"],
  ["teh romo si smal", "the room is small", "four slips, past the budget"],
  ["he plays", "he played", "tense: an inflection edit, not a slip"],
  ["the cat sat", "the bat sat", "one edit, but it makes a real word"],
]) {
  check(`still refused: ${input} (${why})`, !forgivableMeaningSlip(input, target));
}

// The target side is untouched. This is the half that makes widening safe.
const germanSlip = matchGermanSentence("Ich habe das Vertraun verloren.", "Ich habe das Vertrauen verloren.");
check("the language being learned is still marked on its spelling",
  !forgivableMeaningSlip.name.includes("target") && typeof germanSlip.ok === "boolean");

const guided = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8").replace(/\r\n?/gu, "\n");
check("only the meaning matcher forgives, and only after a rejection",
  guided.includes("const forgiveSlips = (result:")
  && guided.includes("if (result.ok) return result;")
  && guided.includes('if (getMeaningLenience() !== "forgiving") return result;')
  // matchEither is the TARGET side. It must never be wrapped.
  && !/matchEither[^\n]*forgiveSlips/u.test(guided)
  && !/forgiveSlips\(match(German|English)Phrase\(typed, displayGerman/u.test(guided));

check("forgiving is the default, because that is what the meaning box is for",
  DEFAULT_MEANING_LENIENCE === "forgiving");

// ── German has no progressive, so both English tenses are one answer ────────
// "Ich komme mit meiner Familie" is "I come with my family" and "I'm coming
// with my family" equally: the distinction being marked against is not in the
// sentence the learner read. This is not a slip to forgive, it is a second
// spelling of the same understanding, so it passes clean and is not gated
// behind the lenience setting.
for (const [typed, key] of [
  ["I come with my family", "I'm coming with my family."],
  ["I run every day", "I'm running every day"],
  ["she takes the bus", "she is taking the bus"],
  ["he studies German", "he is studying German"],
  ["we sit here", "we are sitting here"],
  ["I am coming", "I come"],
]) {
  check(`the two English presents are one answer: ${typed}`, sameEnglishAspect(typed, key));
}
// And it stays a tense difference, not a licence to write another sentence.
for (const [typed, key] of [
  ["I come with my brother", "I'm coming with my family."],
  ["I eat", "I am drinking"],
  ["the cat sat", "the bat sat"],
  ["I came with my family", "I'm coming with my family."],
  ["I am coming with my family.", "I'm coming with my family."],
]) {
  check(`and a different sentence is still a different sentence: ${typed}`, !sameEnglishAspect(typed, key));
}
check("the aspect is only ever forgiven on the side the learner is not learning",
  /if \(!meaningIsGerman && sameEnglishAspect\(typed, displayEnglish\)\)/u.test(guided)
  // The target side is matchEither, and it must never consult this.
  && !/matchEither[\s\S]{0,200}?sameEnglishAspect/u.test(guided),
  "somebody learning English is being taught this exact difference and must still be marked on it");

const settings = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8").replace(/\r\n?/gu, "\n");
check("and it is a setting, not a decision made for the learner",
  settings.includes('data-testid={`meaning-lenience-${value}`}')
  && settings.includes("setMeaningLenience(value)")
  && settings.includes('ui("Typos in the meaning box")'));

if (failed) {
  console.error(`\n${failed} meaning-lenience check(s) failed.`);
  process.exit(1);
}
console.log("check-meaning-lenience: the meaning box forgives a slip, the answer box does not");
process.exit(0);
