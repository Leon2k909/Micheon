// Answering in the wrong language must not be graded as failure.
//
// Typing the English translation into the German box is a mis-aimed answer,
// not a gap in knowledge. Graded as a failure it marked the phrase "struggle",
// knocked a mastered item off the short route back onto the full fifteen-stage
// one, and added difficulty debt — punishing someone who knew the pair.
//
// The dangerous half of this feature is the opposite mistake: quietly excusing
// an answer that is simply wrong. So the detection is only consulted after the
// expected side has already failed, and the checks below prove it recognises
// the real pairing rather than waving anything through.
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { matchGermanSentence, matchEnglishPhrase } from "./src/lib/germanTextMatch.ts";
    `,
    resolveDir: root,
    sourcefile: "wrong-language-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("wrong-language-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "wrong-language-check.cjs"));
const { matchGermanSentence, matchEnglishPhrase } = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── the wiring ─────────────────────────────────────────────────────────────
check(
  "there is one shared test for an answer aimed at the other side",
  source.includes("const answeredOtherSide = (typed: string, expecting:")
);
/**
 * Every place that consults the shared test, checked on its own terms.
 *
 * This was a count \u2014 "at least six guarded call sites" \u2014 which says a number
 * changed rather than which site broke, passes just as happily when one guard
 * loses its return and another gains one, and gets edited down to match every
 * time a stage is removed. Stages come and go; the promise does not.
 */
// The definition reads `answeredOtherSide = (`, so it is not one of these:
// every occurrence of the name followed straight by a bracket is a call.
const consultations = source.split("answeredOtherSide(").slice(1);
check(
  "there is at least one stage doing this at all",
  consultations.length > 0
);
consultations.forEach((after, index) => {
  const tail = after.slice(0, 200);
  check(
    `consultation ${index + 1} flags the slip and returns before grading`,
    /flagWrongLanguage\("(?:target|meaning)"\);\s*return;/.test(tail),
    "the guard falls through and grades the answer it was meant to intercept"
  );
});
// ...and none of them is consulted until the expected side has already failed,
// or a correct answer in the right language could be read as a slip.
check(
  "it is only consulted once the expected side has already failed",
  (source.match(/!\w+\.ok\s*\n?\s*&& answeredOtherSide\(/g) ?? []).length === consultations.length,
  `${consultations.length} consultations, `
  + `${(source.match(/!\w+\.ok\s*\n?\s*&& answeredOtherSide\(/g) ?? []).length} of them behind a failure`
);
check(
  "very short input is never judged as a language slip",
  /if \(trimmed\.length < 3\) return false;/.test(source)
);
// The closed-book stage is the one that marks struggle, so it matters most.
for (const fn of ["checkRecallBoth"]) {
  const body = source.match(new RegExp(`const ${fn} = \\(\\) => \\{[\\s\\S]*?\\n  \\};`));
  check(
    `${fn} checks for a language slip before it can mark struggle`,
    Boolean(body) && body[0].indexOf("answeredOtherSide") < body[0].indexOf("noteRecallStruggle"),
    body ? "guard missing or after the grading" : "function not found"
  );
}
check(
  "the learner is told which box to use, without a wrong-answer verdict",
  source.includes("wrongLanguageNotice") && source.includes('role="status"')
    && /this one wants the/.test(source)
);
check(
  "the notice clears when the stage changes",
  /useEffect\(\(\) => \{ setWrongLanguageNotice\(null\); \}, \[phase\]\);/.test(source)
);

// ── the detection itself, against the real matchers ────────────────────────
const GERMAN = "Kein Problem.";
const ENGLISH = "No problem.";

check(
  "typing the English translation is recognised as the meaning side",
  matchEnglishPhrase(ENGLISH, ENGLISH).ok && !matchGermanSentence(ENGLISH, GERMAN).ok
);
check(
  "typing the German sentence is recognised as the target side",
  matchGermanSentence(GERMAN, GERMAN).ok && !matchEnglishPhrase(GERMAN, ENGLISH).ok
);
// This is the check that stops the feature becoming a way to pass by typing
// nonsense: an answer that matches NEITHER side must stay wrong.
check(
  "a genuinely wrong answer still matches neither side, so it stays wrong",
  !matchGermanSentence("Das Wetter ist schoen.", GERMAN).ok
    && !matchEnglishPhrase("Das Wetter ist schoen.", ENGLISH).ok
);
check(
  "a correct answer is never mistaken for a language slip",
  matchGermanSentence(GERMAN, GERMAN).ok
);

if (failures) {
  console.error(`\n${failures} wrong-language regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nanswering in the wrong language is corrected, not counted against you");
