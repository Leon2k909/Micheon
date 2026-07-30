const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";
    `,
    resolveDir: root,
    sourcefile: "german-punctuation-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("german-punctuation-check", module);
compiled.filename = path.join(root, ".german-punctuation-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { allPartBlueprints, buildBundledParts, buildTatoebaParts } = compiled.exports;
const bundledParts = {
  ...buildBundledParts("learn-de"),
  ...buildBundledParts("learn-en"),
};
const tatoebaParts = buildTatoebaParts(5_000);

const germanKeys = new Set(["de", "short", "long", "exampleDe"]);
const learnerGerman = [];
function collectGerman(value, location = "content") {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectGerman(entry, `${location}[${index}]`));
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    const nextLocation = `${location}.${key}`;
    if (germanKeys.has(key) && typeof entry === "string") {
      learnerGerman.push({ text: entry, location: nextLocation });
    }
    if (entry && typeof entry === "object") collectGerman(entry, nextLocation);
  }
}

collectGerman(allPartBlueprints, "blueprints");
collectGerman(bundledParts, "bundled");
collectGerman(tatoebaParts, "tatoeba");

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const firstHit = (pattern) => learnerGerman.find((entry) => pattern.test(entry.text));
const spacingError = firstHit(/\s+[,;:!?]|\s+\.(?!\.)/u);
check(
  "learner German has no spaces before punctuation",
  !spacingError,
  spacingError && `${spacingError.location}: ${spacingError.text}`
);

const missingSpace = firstHit(/[,;:](?=\p{L})/u);
check(
  "commas, semicolons and colons are followed by spacing",
  !missingSpace,
  missingSpace && `${missingSpace.location}: ${missingSpace.text}`
);

const doubledMark = firstHit(/([,;:])\1/u);
check(
  "learner German has no doubled comma, semicolon or colon",
  !doubledMark,
  doubledMark && `${doubledMark.location}: ${doubledMark.text}`
);

const reviewedErrors = [
  "Es ist wie es ist.",
  "Du weißt nicht wie es ist, arm zu sein.",
  "Ich verstehe nicht was sie gesagt hat.",
  "Wir wissen was zu tun ist.",
  "Es ist wichtiger was du bist als das, was du hast.",
  "Ich weiß nicht, von was Sie sprechen.",
  "Für was, denkst du, ist das?",
  "Ich verstehe nicht, zu was das gut sein soll.",
];
for (const sentence of reviewedErrors) {
  const hit = learnerGerman.find((entry) => entry.text === sentence);
  check(`reviewed punctuation or phrasing is absent: ${sentence}`, !hit, hit && hit.location);
}

const tatoebaPhrases = Object.values(tatoebaParts).flatMap((part) => part.phrases ?? []);
const byGerman = new Map(tatoebaPhrases.map((phrase) => [phrase.de, phrase]));
const reported = byGerman.get("Ich glaube, ich habe alles, was ich brauche.");
check("the reported sentence keeps both correct German commas", Boolean(reported));
check(
  "the reported sentence explains its first comma in plain language",
  /comma after ['’]glaube['’] is correct/i.test(reported?.use ?? "")
);

const expectedCorrections = [
  "So ist es nun mal.",
  "Du weißt nicht, wie es ist, arm zu sein.",
  "Ich verstehe nicht, was sie gesagt hat.",
  "Wir wissen, was zu tun ist.",
  "Wer du bist, ist wichtiger als das, was du hast.",
  "Ich weiß nicht, wovon Sie sprechen.",
  "Was meinst du, wofür ist das?",
  "Ich verstehe nicht, wozu das gut sein soll.",
];
for (const sentence of expectedCorrections) {
  check(`reviewed correction is shipped: ${sentence}`, byGerman.has(sentence));
}

check("the punctuation audit covers thousands of German fields", learnerGerman.length > 10_000, `found ${learnerGerman.length}`);

if (failures) {
  console.error(`\n${failures} German punctuation regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\n${learnerGerman.length.toLocaleString("en-GB")} learner-facing German fields passed punctuation QA`);
