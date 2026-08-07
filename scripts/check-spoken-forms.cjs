// Conversation mode must actually teach the spoken ich-form.
//
// The picker promises "the short, natural forms people use". Before the
// derived contraction it could only honour that where an author had written
// BOTH a `short` and a `shortEn` — 101 of 17,648 taught lines. A learner in
// Conversation mode was shown "So habe ich das noch nicht gesehen." and, worse,
// was marked wrong for typing the form people actually say.
//
// The derivation is only safe because it is meaning-preserving, so this gate
// guards exactly that: the right verbs contract, the wrong ones never do, the
// written form stays accepted, and exam mode is left alone.
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { toSpokenGerman, hasSpokenForm } from "./src/lib/spokenGerman.ts";
      export { phraseForLearningMode, matchLearningModeGermanAnswer } from "./src/lib/learningMode.ts";
      export { matchGermanSentence } from "./src/lib/germanTextMatch.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { expansionPartBlueprints } from "./src/lib/expansionPacks.ts";
    `,
    resolveDir: root,
    sourcefile: "spoken-forms-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("spoken-forms-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "spoken-forms-check.cjs"));
const {
  toSpokenGerman,
  phraseForLearningMode,
  matchLearningModeGermanAnswer,
  matchGermanSentence,
  allPartBlueprints,
  expansionPartBlueprints,
} = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── the contraction itself ─────────────────────────────────────────────────
check(
  "the ich-form -e is dropped after ich",
  toSpokenGerman("Ich habe keine Zeit.") === "Ich hab keine Zeit."
    && toSpokenGerman("Ich freue mich sehr.") === "Ich freu mich sehr."
);
check(
  "and with the subject after the verb, which is where it was missing",
  toSpokenGerman("So habe ich das noch nicht gesehen.") === "So hab ich das noch nicht gesehen."
    && toSpokenGerman("Das mache ich gleich.") === "Das mach ich gleich."
    && toSpokenGerman("Habe ich das gesagt?") === "Hab ich das gesagt?"
);
check(
  "capitalisation survives the contraction",
  toSpokenGerman("Habe ich das gesagt?").startsWith("Hab ")
);
// Stems ending in -t or -d keep their -e in real German. Printing "ich arbeit"
// as the model sentence would be teaching a mistake.
for (const [written, why] of [
  ["Ich arbeite hier seit zwei Jahren.", "arbeiten"],
  ["Ich finde das gut.", "finden"],
  ["Ich rede mit ihm.", "reden"],
  ["Ich warte auf dich.", "warten"],
]) {
  check(`${why} keeps its -e — the contraction would be wrong German`, toSpokenGerman(written) === written);
}
check(
  "nothing outside the ich-form is touched",
  toSpokenGerman("Die Arbeit ist fertig.") === "Die Arbeit ist fertig."
    && toSpokenGerman("Er hat das gesehen.") === "Er hat das gesehen."
    && toSpokenGerman("Wir gehe nirgendwo hin.") === "Wir gehe nirgendwo hin."
);

// ── what each mode serves ──────────────────────────────────────────────────
const sample = { de: "So habe ich das noch nicht gesehen.", en: "I hadn't looked at it that way before." };
const conversation = phraseForLearningMode(sample, "conversation");
const exam = phraseForLearningMode(sample, "exam");
check(
  "Conversation mode serves the spoken form",
  conversation.de === "So hab ich das noch nicht gesehen.",
  conversation.de
);
check(
  "Conversation mode keeps the written sentence as supporting context",
  conversation.long === "So habe ich das noch nicht gesehen.",
  String(conversation.long)
);
check(
  "Exam mode is untouched and still serves the written form",
  exam.de === "So habe ich das noch nicht gesehen." && !exam.long,
  exam.de
);
check(
  "the English is identical in both modes — a contraction changes no meaning",
  conversation.en === sample.en && exam.en === sample.en
);

// ── nobody is marked wrong either way ──────────────────────────────────────
check(
  "the spoken form is accepted in Conversation mode",
  matchLearningModeGermanAnswer("So hab ich das noch nicht gesehen.", conversation).ok
);
check(
  "the textbook form is still accepted in Conversation mode",
  matchLearningModeGermanAnswer("So habe ich das noch nicht gesehen.", conversation).ok
);
check(
  "the inverted contraction now matches at all, in either direction",
  matchGermanSentence("So hab ich das noch nicht gesehen.", "So habe ich das noch nicht gesehen.").ok
    && matchGermanSentence("So habe ich das noch nicht gesehen.", "So hab ich das noch nicht gesehen.").ok
);

// ── corpus-wide sanity: the promise is now actually kept ───────────────────
let total = 0;
let reshaped = 0;
const suspicious = [];
// allPartBlueprints already spreads in expansionPartBlueprints, so iterating
// both counted every expansion pack twice and reported a total nearly half
// again as large as the course really is.
for (const packs of [allPartBlueprints]) {
  for (const pack of Object.values(packs)) {
    for (const phrase of pack.phrases ?? []) {
      if (!phrase?.de) continue;
      total += 1;
      const spoken = toSpokenGerman(phrase.de);
      if (spoken === phrase.de) continue;
      reshaped += 1;
      // Every derived form must still be accepted against its written original,
      // otherwise Conversation mode would be teaching an answer it rejects.
      if (!matchGermanSentence(spoken, phrase.de).ok) suspicious.push(`${phrase.de} -> ${spoken}`);
    }
  }
}
// The verb goes LAST after dass/weil/wenn, which is nowhere near "ich", so
// the two ich-adjacent rules never reached it and sentences came out half
// contracted: "Ich bleib hier, weil ich noch etwas mache."
check(
  "the ich-form -e is dropped at the end of a subordinate clause too",
  toSpokenGerman("Ich gebe zu, dass ich es nicht verstehe.") === "Ich geb zu, dass ich es nicht versteh."
    && toSpokenGerman("Ich bleibe hier, weil ich noch etwas mache.") === "Ich bleib hier, weil ich noch etwas mach."
);
// That rule is not anchored to "ich", so it leans entirely on the verb being
// clause-final. A noun cannot stand there in German, which is what keeps
// these intact -- and getting it wrong would PRINT a mangled model sentence.
check(
  "it never strips the -e off a noun",
  toSpokenGerman("Weil ich die Frage nicht verstehe, frage ich nach.").includes("die Frage")
    && toSpokenGerman("Ich weiß, dass ich die Kriege nicht verstehe.").includes("die Kriege")
    && toSpokenGerman("Das ist die Frage.") === "Das ist die Frage."
);
// Stems ending in -t or -d keep their -e in real German. Accepting "ich
// arbeit" from a learner is kindness; printing it as the model is not.
check(
  "stems that keep their -e are left alone",
  toSpokenGerman("Ich arbeite morgen.") === "Ich arbeite morgen."
    && toSpokenGerman("Ich rede mit ihm.") === "Ich rede mit ihm."
    && toSpokenGerman("Ich finde das gut.") === "Ich finde das gut."
);
check(
  `Conversation mode reshapes a meaningful share of the course (${reshaped} of ${total})`,
  reshaped > 500,
  `only ${reshaped}`
);
check(
  "every derived spoken form is accepted against its written original",
  suspicious.length === 0,
  suspicious.slice(0, 3).join(" | ")
);

if (failures) {
  console.error(`\n${failures} spoken-form regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nConversation mode teaches the form people actually say");
