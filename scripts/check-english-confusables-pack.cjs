const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";
      export { CURRICULUM_ORDER, packMeta } from "./src/lib/curriculum.ts";
      export { matchingVisibleKey, matchEnglishPhrase, primaryAnswer } from "./src/lib/germanTextMatch.ts";
      export { buildPartCatalog, buildSession } from "./src/session.ts";
      export { swapStepForEnglish } from "./src/lib/learningDirectionStep.ts";
    `,
    resolveDir: root,
    sourcefile: "english-confusables-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("english-confusables-check", module);
compiled.filename = path.join(root, ".english-confusables-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  buildBundledParts,
  buildPartCatalog,
  buildSession,
  CURRICULUM_ORDER,
  filterPartsForLearningDirection,
  matchingVisibleKey,
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

const packKey = "cb-english-confusables";
const learnEnglishParts = buildBundledParts("learn-en");
const learnGermanParts = buildBundledParts("learn-de");
const pack = learnEnglishParts[packKey];

check("the pack is available to German speakers learning English", Boolean(pack));
check("the pack is hidden from English speakers learning German", !learnGermanParts[packKey]);
check(
  "the shared direction filter preserves the same boundary",
  !filterPartsForLearningDirection(learnEnglishParts, "learn-de")[packKey]
    && Boolean(filterPartsForLearningDirection(learnEnglishParts, "learn-en")[packKey])
);

const orderHits = CURRICULUM_ORDER.filter((key) => key === packKey).length;
check("the pack has one curriculum position", orderHits === 1, `found ${orderHits}`);
check(
  "the core spelling pack appears before situational Tier 2 lessons",
  CURRICULUM_ORDER.indexOf(packKey) > -1
    && CURRICULUM_ORDER.indexOf(packKey) < CURRICULUM_ORDER.indexOf("part8")
);
check("the pack is classified as core Tier 1 material", packMeta(packKey).tier === 1);

if (pack) {
  const ids = pack.phrases.map((phrase) => phrase.id);
  const germanPrompts = pack.phrases.map((phrase) => matchingVisibleKey(phrase.de, "de"));
  const primaryEnglish = pack.phrases.map((phrase) => matchingVisibleKey(phrase.en, "en"));
  const groups = new Set(pack.phrases.map((phrase) => phrase.group));

  check("the pack adds at least forty focused sentences", pack.phrases.length >= 40, `found ${pack.phrases.length}`);
  check("every sentence has a stable unique id", ids.every(Boolean) && new Set(ids).size === ids.length);
  check("every German prompt is unique inside the pack", new Set(germanPrompts).size === germanPrompts.length);
  check("every primary English answer is unique inside the pack", new Set(primaryEnglish).size === primaryEnglish.length);
  check(
    "every sentence carries explicit learner coaching",
    pack.phrases.every((phrase) => phrase.de?.trim() && phrase.en?.trim() && phrase.use?.trim())
  );
  check("English coaching survives the learning-direction swap", pack.coachingLanguage === "en");
  check(
    "all planned contrast groups are represented",
    [
      "past-modal-contractions",
      "there-their-theyre",
      "its-thats",
      "your-youre-whose-whos",
      "other-common-confusables",
    ].every((group) => groups.has(group))
  );

  const byId = new Map(pack.phrases.map((phrase) => [phrase.id, phrase]));
  const couldve = byId.get("cb-english-confusables-couldve-helped");
  const wouldve = byId.get("cb-english-confusables-wouldve-called");
  const shouldve = byId.get("cb-english-confusables-shouldve-told");
  const directThere = byId.get("cb-english-confusables-their-keys-there");
  const directTheyre = byId.get("cb-english-confusables-theyre-bringing-their");
  const directIts = byId.get("cb-english-confusables-its-lost-its-collar");
  const directYoure = byId.get("cb-english-confusables-youre-forgetting-your");

  check("could've is displayed and its full form is accepted", primaryAnswer(couldve?.en) === "I could've helped you if you'd asked." && matchEnglishPhrase("I could have helped you if you had asked", couldve?.en ?? "").ok);
  check("would've is displayed and its full form is accepted", primaryAnswer(wouldve?.en) === "I would've called, but my battery was dead." && matchEnglishPhrase("I would have called, but my battery was dead", wouldve?.en ?? "").ok);
  check("should've is displayed and its full form is accepted", primaryAnswer(shouldve?.en) === "You should've told me sooner." && matchEnglishPhrase("You should have told me sooner", shouldve?.en ?? "").ok);
  check("could of is rejected", !matchEnglishPhrase("I could of helped you if you had asked", couldve?.en ?? "").ok);
  check("would of is rejected", !matchEnglishPhrase("I would of called, but my battery was dead", wouldve?.en ?? "").ok);
  check("should of is rejected", !matchEnglishPhrase("You should of told me sooner", shouldve?.en ?? "").ok);
  check("their/there contrast is present", /\btheir\b/i.test(directThere?.en ?? "") && /\bthere\b/i.test(directThere?.en ?? ""));
  check("they're/their contrast is present", /\bthey're\b/i.test(directTheyre?.en ?? "") && /\btheir\b/i.test(directTheyre?.en ?? ""));
  check("it's/its contrast is present", /\bit's\b/i.test(directIts?.en ?? "") && /\bits\b/i.test(directIts?.en ?? ""));
  check("you're/your contrast is present", /\byou're\b/i.test(directYoure?.en ?? "") && /\byour\b/i.test(directYoure?.en ?? ""));
  check("a meaning-changing their/they're swap is rejected", !matchEnglishPhrase("Their waiting outside", byId.get("cb-english-confusables-theyre-waiting")?.en ?? "").ok);
  check("a meaning-changing your/you're swap is rejected", !matchEnglishPhrase("Your early", byId.get("cb-english-confusables-youre-early")?.en ?? "").ok);

  const catalog = buildPartCatalog(pack, packKey);
  check(
    "catalogue and lesson data share stable ids",
    catalog.length === pack.phrases.length && catalog.every((item) => ids.includes(item.id))
  );

  const steps = buildSession({ ...pack, partKey: packKey }, [], {}, 0);
  const firstSentence = steps.find((step) => step.type === "sentence");
  const swapped = swapStepForEnglish(firstSentence);
  check(
    "direction swapping puts English in the target column",
    swapped?.item?.de === firstSentence?.item?.en && swapped?.item?.en === firstSentence?.item?.de
  );
  const coachedSwap = swapStepForEnglish({
    type: "sentence",
    item: { ...couldve, coachingLanguage: pack.coachingLanguage },
  });
  check(
    "the explicit contraction guidance survives direction swapping",
    /could've\s*=\s*could have/i.test(coachedSwap?.item?.use ?? "")
  );
}

if (failures) {
  console.error(`\n${failures} English-confusables regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nEnglish contractions and confusable forms are displayed; direction gating and stable ids are guarded");
