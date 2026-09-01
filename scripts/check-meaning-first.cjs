#!/usr/bin/env node
/**
 * One more stage, and it must never become a second typing test.
 *
 * The route is deliberately down to ONE typing test per encounter: the writing
 * stages are what missing that test costs, and getting them back is what a
 * wrong answer buys. A stage added afterwards for pacing is exactly how that
 * bargain gets undone by accident — not for the learner who got it wrong, for
 * everybody.
 *
 * So the rule this holds is arithmetic, not adjectival: the route a new phrase
 * meets contains exactly one stage that asks for typing, and it is still Hear
 * & write. Failing it still buys the rest back. Neither of those is something
 * a screenshot would show going wrong.
 *
 * MeaningFirst itself is the stage being added. Every other stage puts the
 * target language in front of you and asks what it means; this one puts the
 * meaning in front of you and shows how it is said, which is the direction you
 * need when you are the one talking, and the direction the route never showed.
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n?/gu, "\n");

const built = esbuild.buildSync({
  stdin: {
    contents: `export * from "./src/lib/guidedLessonPhases.ts";`,
    resolveDir: root, sourcefile: "phases.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
});
const mod = new Module("phases", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "phases.cjs"));
const {
  buildSentencePhaseRoute,
  SENTENCE_PHASES,
  NON_WRITING_SENTENCE_PHASES,
  LEAN_SENTENCE_PHASES,
} = mod.exports;

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`ok   ${name}`); return; }
  failed += 1;
  console.error(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
};

const nonWriting = new Set(NON_WRITING_SENTENCE_PHASES);
const writingIn = (route) => route.filter((phase) => !nonWriting.has(phase));

const base = { mastered: false, bilingual: false, audioMuted: false };
const freshSentence = buildSentencePhaseRoute({ ...base });
const freshWord = buildSentencePhaseRoute({ ...base, word: true });
const failedSentence = buildSentencePhaseRoute({ ...base, typingFailed: true });
const failedWord = buildSentencePhaseRoute({ ...base, word: true, typingFailed: true });

// ── the bargain: one typing test, until it is missed ────────────────────────
check("a new phrase is asked to type exactly once",
  writingIn(freshSentence).length === 1,
  `it types ${writingIn(freshSentence).length} times: ${writingIn(freshSentence).join(", ") || "never"}`);
check("and the one time is Hear & write",
  writingIn(freshSentence)[0] === "ListenPick",
  `the one typing stage is ${writingIn(freshSentence)[0]}`);
check("a new word is asked to type exactly once too",
  writingIn(freshWord).length === 1 && writingIn(freshWord)[0] === "ListenPick",
  `it types: ${writingIn(freshWord).join(", ") || "never"}`);

check("missing the typing test still buys the writing stages back",
  writingIn(failedSentence).length > writingIn(freshSentence).length,
  `a missed test leads to ${writingIn(failedSentence).length} writing stages, the same as passing it`);
check("and it buys them back for a word as well",
  writingIn(failedWord).length > writingIn(freshWord).length,
  `a missed word test leads to ${writingIn(failedWord).length}`);

// ── the stage that was added ────────────────────────────────────────────────
check("the new stage is one of the routes a learner meets",
  freshSentence.includes("MeaningFirst") && freshWord.includes("MeaningFirst"),
  "it exists but nothing reaches it");
check("it asks for no typing",
  nonWriting.has("MeaningFirst"),
  "the stage counts as writing, which is the one thing it must not be");
check("a missed typing test does not lose it",
  failedSentence.includes("MeaningFirst"),
  "getting the test wrong removes a stage, which is backwards");
check("it comes after the meaning has been checked",
  freshSentence.indexOf("MeaningFirst") > freshSentence.indexOf("MeaningSelect"),
  "the meaning is shown as the prompt before the learner has been asked for it");
check("it comes before the phrase has to be produced",
  freshSentence.indexOf("MeaningFirst") < freshSentence.indexOf("ListenPick"),
  "the direction you speak in is shown after you were asked to speak it");
check("the route really did grow",
  freshSentence.length >= 6,
  `the lean route is ${freshSentence.length} stages: ${freshSentence.join(" → ")}`);

// Every phase named as non-writing has to be a phase that exists, or the set
// is quietly excusing a typo instead of a stage.
const unknown = NON_WRITING_SENTENCE_PHASES.filter((phase) => !SENTENCE_PHASES.includes(phase));
check("the non-writing list names only real stages", unknown.length === 0,
  unknown.length ? `unknown: ${unknown.join(", ")}` : "");
check("the lean route is built from the list, not from a second opinion",
  LEAN_SENTENCE_PHASES.every((phase) => nonWriting.has(phase) || phase === "ListenPick"),
  "a stage in the lean route is neither the typing test nor known to be free of typing");

// ── and it shows the pair the other way round ───────────────────────────────
const guided = read("src/GuidedSession.tsx");
check("the meaning is the big line",
  /phase === "MeaningFirst" \?[\s\S]{0,900}<div className="fs-line">\{shownEnglish\}<\/div>/u.test(guided),
  "the stage renders something other than the meaning on the line the eye lands on");
check("the target sits underneath it, still tappable",
  /phase === "MeaningFirst" \?[\s\S]{0,1400}<TappableSentence text=\{item\.de\}/u.test(guided),
  "the target is missing from the stage, or is there as dead text");
check("it plays the target rather than leaving it silent",
  guided.includes('if (phase === "ListenPick" || phase === "MeaningFirst") lessonSpeak(item.de, 0.88, targetLang);'),
  "a stage about how the phrase is SAID does not say it");
check("it has no input of its own",
  !/phase === "MeaningFirst"[\s\S]{0,1200}<(input|textarea)/u.test(guided),
  "the stage grew a text box, which is the one thing it must not have");
check("it is named in the stage bar and in the heading",
  guided.includes('if (p === "MeaningFirst") return "Meaning first";')
    && guided.includes('case "MeaningFirst": return "Now the other way round";'));

const TABLES = {
  German: "src/lib/i18nDe.ts",
  French: "src/lib/i18nFr.ts",
  Polish: "src/lib/i18nPl.ts",
  Spanish: "src/lib/i18nEs.ts",
  Italian: "src/lib/i18nIt.ts",
  Portuguese: "src/lib/i18nPt.ts",
};
const KEYS = [
  "Meaning first",
  "Now the other way round",
  "What you want to say",
  "This is what you'd want to say. Here it is in {language}.",
];
for (const [language, file] of Object.entries(TABLES)) {
  const table = read(file);
  const missing = KEYS.filter((key) => !table.includes(`${JSON.stringify(key)}:`));
  check(`the stage reads in ${language}`, missing.length === 0,
    missing.length ? `untranslated: ${missing.join(" · ")}` : "");
}

if (failed) {
  console.error(`\n${failed} meaning-first check(s) failed.`);
  process.exit(1);
}
console.log(
  `check-meaning-first: ${freshSentence.length} stages for a new phrase — ${freshSentence.join(" → ")} — `
  + `with one typing test, and ${writingIn(failedSentence).length} writing stages waiting behind a wrong answer`
);
process.exit(0);
