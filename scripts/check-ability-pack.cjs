const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { CURRICULUM_ORDER } from "./src/lib/curriculum.ts";
    `,
    resolveDir: root,
    sourcefile: "ability-pack-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("ability-pack-check", module);
compiled.filename = path.join(root, ".ability-pack-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);
const { allPartBlueprints, CURRICULUM_ORDER } = compiled.exports;

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const normalise = (text) => String(text ?? "")
  .normalize("NFKC")
  .trim()
  .replace(/\s+/g, " ")
  .toLocaleLowerCase("de-DE");

const pack = allPartBlueprints.part150;
const phrases = pack?.phrases ?? [];
const phraseKeys = phrases.map((phrase) => normalise(phrase.de));
const ownKeys = new Set(phraseKeys);

const existingKeys = new Set();
for (const [partKey, part] of Object.entries(allPartBlueprints)) {
  if (partKey === "part150") continue;
  for (const phrase of part.phrases ?? []) existingKeys.add(normalise(phrase.de));
  for (const dialogue of part.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) existingKeys.add(normalise(line.de));
  }
  for (const word of part.vocab ?? []) {
    if (word.example) existingKeys.add(normalise(word.example));
  }
}

check("the ability and encouragement pack exists", Boolean(pack));
check("the pack contains substantial practice", phrases.length >= 30 && (pack?.dialogues ?? []).length >= 2);
check("every phrase has German, English and useful guidance", phrases.every((phrase) => phrase.de && phrase.en && phrase.use));
check("phrases are unique inside the pack", ownKeys.size === phraseKeys.length);
check("new phrases do not exactly duplicate the curated curriculum", phraseKeys.every((key) => !existingKeys.has(key)));
check(
  "the requested I can do it family is present",
  phrases.some((phrase) => phrase.de === "Ich kann das." && phrase.en.includes("I can do it."))
    && phrases.some((phrase) => phrase.de === "Du kannst das." && phrase.en.includes("You can do it."))
    && phrases.some((phrase) => phrase.de === "Wir können das." && phrase.en.includes("We can do it."))
);
check(
  "the pack teaches ability separately from managing a challenge",
  phrases.some((phrase) => phrase.de === "Ich kann das.")
    && phrases.some((phrase) => phrase.de === "Ich schaffe das.")
);
check(
  "the pack appears immediately after starter basics",
  CURRICULUM_ORDER.indexOf("part150") === CURRICULUM_ORDER.indexOf("part1") + 1
);

if (failures) {
  console.error(`\n${failures} ability-pack regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\n${phrases.length} ability, help and encouragement phrases are guarded`);
