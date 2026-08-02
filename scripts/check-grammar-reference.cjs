const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "ClozeGrammar.tsx");
const source = fs.readFileSync(sourcePath, "utf8");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export {
        GRAMMAR_TIPS,
        ENGLISH_GRAMMAR_TIPS,
        CLOZE_EXERCISES,
        ENGLISH_CLOZE_EXERCISES,
      } from "./src/ClozeGrammar.tsx";
    `,
    resolveDir: root,
    sourcefile: "grammar-reference-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("grammar-reference-check", module);
compiled.filename = path.join(root, ".grammar-reference-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  GRAMMAR_TIPS,
  ENGLISH_GRAMMAR_TIPS,
  CLOZE_EXERCISES,
  ENGLISH_CLOZE_EXERCISES,
} = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` - ${detail}` : ""}`);
}

function duplicates(values) {
  const seen = new Set();
  return [...new Set(values.filter((value) => seen.has(value) || !seen.add(value)))];
}

const requiredLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const tracks = [
  {
    name: "German",
    topics: GRAMMAR_TIPS,
    exercises: CLOZE_EXERCISES,
    minimumTopics: 37,
  },
  {
    name: "English",
    topics: ENGLISH_GRAMMAR_TIPS,
    exercises: ENGLISH_CLOZE_EXERCISES,
    minimumTopics: 40,
  },
];

for (const track of tracks) {
  const topicIds = track.topics.map((topic) => topic.id);
  const exerciseIds = track.exercises.map((exercise) => exercise.id);
  const levels = new Set(track.topics.map((topic) => topic.level));
  const referencedTopicIds = new Set(track.exercises.map((exercise) => exercise.tip_id));

  check(
    `${track.name} reference has substantial A1-C2 coverage`,
    track.topics.length >= track.minimumTopics,
    `found ${track.topics.length}, expected at least ${track.minimumTopics}`
  );
  check(
    `${track.name} reference includes every CEFR level`,
    requiredLevels.every((level) => levels.has(level)),
    `found ${[...levels].join(", ")}`
  );
  check(
    `${track.name} topic ids are unique`,
    duplicates(topicIds).length === 0,
    duplicates(topicIds).join(", ")
  );
  check(
    `${track.name} exercise ids are unique`,
    duplicates(exerciseIds).length === 0,
    duplicates(exerciseIds).join(", ")
  );

  const incompleteTopics = track.topics.filter((topic) =>
    !topic.id?.trim()
    || !topic.title?.trim()
    || !topic.summary?.trim()
    || !topic.tip?.trim()
    || !Array.isArray(topic.rules)
    || topic.rules.length < 4
    || topic.rules.some((rule) => !String(rule).trim())
    || !Array.isArray(topic.examples)
    || topic.examples.length < 2
    || topic.examples.some((example) => !example?.de?.trim() || !example?.en?.trim())
  );
  check(
    `${track.name} topics all contain a summary, useful rules, a shortcut and bilingual examples`,
    incompleteTopics.length === 0,
    incompleteTopics.map((topic) => topic.id).join(", ")
  );

  const malformedExercises = track.exercises.filter((exercise) =>
    !exercise.id?.trim()
    || !exercise.sentence?.trim()
    || (exercise.sentence.match(/___/g) ?? []).length !== 1
    || !exercise.answer?.trim()
    || /\s/u.test(exercise.answer.trim())
    || !exercise.hint?.trim()
  );
  check(
    `${track.name} cloze exercises each have one hardcoded blank and one answer`,
    malformedExercises.length === 0,
    malformedExercises.map((exercise) => exercise.id).join(", ")
  );

  const orphanedExercises = track.exercises.filter((exercise) => !topicIds.includes(exercise.tip_id));
  check(
    `${track.name} exercises always open a real grammar topic`,
    orphanedExercises.length === 0,
    orphanedExercises.map((exercise) => `${exercise.id}:${exercise.tip_id}`).join(", ")
  );

  const topicsWithoutPractice = track.topics.filter((topic) => !referencedTopicIds.has(topic.id));
  check(
    `${track.name} grammar topics all have at least one cloze exercise`,
    topicsWithoutPractice.length === 0,
    topicsWithoutPractice.map((topic) => topic.id).join(", ")
  );
}

const misleadingClaims = [
  ["the old absolute verb-second claim", /Verb always second/i],
  ["the old absolute separable-prefix claim", /prefix always goes to the very end/i],
  ["the old false final-ig pronunciation claim", /Never a hard g or k/i],
  ["the old accusative overgeneralisation", /Everything else stays the same/i],
  ["generated grammar exercise assembly", /function\s+buildCloze\b|Math\.random\(|\bseed(?:ed)?\b/i],
];
for (const [label, pattern] of misleadingClaims) {
  check(`grammar source contains no ${label}`, !pattern.test(source));
}

check(
  "grammar data is exported as reviewed hardcoded arrays",
  /export const GRAMMAR_TIPS(?:\s*:\s*GrammarTip\[\])?\s*=\s*\[/u.test(source)
    && /export const ENGLISH_GRAMMAR_TIPS(?:\s*:\s*GrammarTip\[\])?\s*=\s*\[/u.test(source)
    && /export const CLOZE_EXERCISES(?:\s*:\s*ClozeExercise\[\])?\s*=\s*\[/u.test(source)
    && /export const ENGLISH_CLOZE_EXERCISES(?:\s*:\s*ClozeExercise\[\])?\s*=\s*\[/u.test(source)
);

if (failures) {
  console.error(`\n${failures} grammar-reference regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(
  `\n${GRAMMAR_TIPS.length} German topics, ${ENGLISH_GRAMMAR_TIPS.length} English topics and ${CLOZE_EXERCISES.length + ENGLISH_CLOZE_EXERCISES.length} exercises passed QA`
);
