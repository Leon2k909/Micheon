const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";
      export { packMeta } from "./src/lib/curriculum.ts";
      export { matchEnglishPhrase, primaryAnswer } from "./src/lib/germanTextMatch.ts";
      export { buildPartCatalog, buildSession } from "./src/session.ts";
      export { swapStepForEnglish } from "./src/lib/learningDirectionStep.ts";
    `,
    resolveDir: root,
    sourcefile: "geordie-pack-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("geordie-pack-check", module);
compiled.filename = path.join(root, ".geordie-pack-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  buildBundledParts,
  buildPartCatalog,
  buildSession,
  filterPartsForLearningDirection,
  matchEnglishPhrase,
  packMeta,
  primaryAnswer,
  swapStepForEnglish,
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

const learnEnglishParts = buildBundledParts("learn-en");
const learnGermanParts = buildBundledParts("learn-de");
const pack = learnEnglishParts["cb-geordie"];

check("the Geordie pack is available to German speakers learning English", Boolean(pack));
check("the Geordie pack is hidden from English speakers learning German", !learnGermanParts["cb-geordie"]);
check(
  "the common direction filter also removes specialist packs",
  !filterPartsForLearningDirection(learnEnglishParts, "learn-de")["cb-geordie"]
    && Boolean(filterPartsForLearningDirection(learnEnglishParts, "learn-en")["cb-geordie"])
);

if (pack) {
  const ids = pack.phrases.map((phrase) => phrase.id);
  check("the pack contains twenty practical entries", pack.phrases.length === 20, `found ${pack.phrases.length}`);
  check("every entry has a stable unique id", ids.every(Boolean) && new Set(ids).size === ids.length);
  check("every entry is deliberately delayed until regional material", pack.phrases.every((phrase) => phrase.lessonPriority === 1));
  check("the pack carries English-language coaching", pack.coachingLanguage === "en");

  const divvent = pack.phrases.find((phrase) => phrase.id === "cb-geordie-divvent");
  const gannin = pack.phrases.find((phrase) => phrase.id === "cb-geordie-gannin-hyem");
  check("divvent is the displayed Newcastle spelling", primaryAnswer(divvent?.en) === "Divvent dee that.");
  check("gannin is the displayed Newcastle spelling", primaryAnswer(gannin?.en) === "Are ye gannin hyem already?");
  check("the learner's divnt spelling is accepted", matchEnglishPhrase("divnt dee that", divvent?.en ?? "").ok);
  check("the divn't spelling is accepted", matchEnglishPhrase("divn't dee that", divvent?.en ?? "").ok);
  check("Standard English remains accepted for divvent", matchEnglishPhrase("don't do that", divvent?.en ?? "").ok);
  check("the learner's ganning spelling is accepted", matchEnglishPhrase("are ye ganning home already", gannin?.en ?? "").ok);
  check("Standard English remains accepted for gannin", matchEnglishPhrase("are you going home already", gannin?.en ?? "").ok);

  const catalog = buildPartCatalog(pack, "cb-geordie");
  check(
    "catalogue and lesson data share the same stable ids",
    catalog.length === pack.phrases.length
      && catalog.every((item) => ids.includes(item.id))
  );

  const steps = buildSession({ ...pack, partKey: "cb-geordie" }, [], {}, 0);
  const firstSentence = steps.find((step) => step.type === "sentence");
  const swapped = swapStepForEnglish(firstSentence);
  check(
    "direction swapping puts the Geordie phrase in the English target column",
    swapped?.item?.de === firstSentence?.item?.en && swapped?.item?.en === firstSentence?.item?.de
  );
  check(
    "regional warnings survive the English-direction swap",
    Boolean(swapped?.item?.use) && Boolean(swapped?.item?.tierNote)
  );
}

const meta = packMeta("cb-geordie");
check("the pack is visibly labelled as regional Tier 3 material", meta.tier === 3 && /regional/i.test(meta.note ?? ""));

if (failures) {
  console.error(`\n${failures} Geordie-pack regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nGeordie direction, spelling variants, stable ids, and coaching are guarded");
