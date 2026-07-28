const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { matchEnglishPhrase, primaryAnswer } from "./src/lib/germanTextMatch.ts";
    `,
    resolveDir: root,
    sourcefile: "answer-matching-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("answer-matching-check", module);
compiled.filename = path.join(root, ".answer-matching-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { allPartBlueprints, matchEnglishPhrase, primaryAnswer } = compiled.exports;

function findPhrase(value, german) {
  if (!value || typeof value !== "object") return undefined;
  if (value.de === german && typeof value.en === "string") return value;
  for (const child of Object.values(value)) {
    const found = findPhrase(child, german);
    if (found) return found;
  }
  return undefined;
}

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const german = "Wir sind noch nicht komplett, einer kommt später.";
const phrase = findPhrase(allPartBlueprints, german);
check("the reported restaurant phrase still exists", Boolean(phrase));

if (phrase) {
  check(
    "the displayed answer teaches natural English",
    primaryAnswer(phrase.en) === "We're not all here yet — one more person is coming later.",
    `found ${JSON.stringify(primaryAnswer(phrase.en))}`
  );

  const accepted = [
    "we are not all here yet, one comes later",
    "We're not all here yet; one more is coming.",
    "We are still waiting on one more.",
  ];
  for (const answer of accepted) {
    check(
      `valid equivalent is accepted: ${answer}`,
      matchEnglishPhrase(answer, phrase.en).ok
    );
  }

  const rejected = [
    "We are all here; one comes later.",
    "They are not all here yet; one comes later.",
    "We are not all here yet; no one comes later.",
    "We are not all here yet; two come later.",
    "We are not all here yet; one came earlier.",
  ];
  for (const answer of rejected) {
    check(
      `meaning-changing answer stays rejected: ${answer}`,
      !matchEnglishPhrase(answer, phrase.en).ok
    );
  }
}

if (failures) {
  console.error(`\n${failures} answer-matching regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nValid English variants pass without weakening subject, polarity, number, or tense");
