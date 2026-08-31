const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export {
        matchingVisibleKey,
        matchingVisibleKeys,
        takeMatchingSafe,
      } from "./src/lib/germanTextMatch.ts";
      export { pickFresh, pickReviews } from "./src/session.ts";
    `,
    resolveDir: root,
    sourcefile: "matching-pairs-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("matching-pairs-check", module);
compiled.filename = path.join(root, ".matching-pairs-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  matchingVisibleKey,
  matchingVisibleKeys,
  pickFresh,
  pickReviews,
  takeMatchingSafe,
} = compiled.exports;

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const step = (id, de, en, extra = {}) => ({
  type: "sentence",
  ...extra,
  item: { id, de, en },
});
const pairOfStep = (candidate) => ({
  german: candidate.item.de,
  english: candidate.item.en,
});
const visibleSetsAreUnique = (items) => {
  const german = items.map((item) => matchingVisibleKey(item.item.de, "de"));
  const english = items.map((item) => matchingVisibleKey(item.item.en, "en"));
  return new Set(german).size === items.length && new Set(english).size === items.length;
};

const screenshot = [
  step("du", "Ich wünschte, ich könnte das so gut wie du.", "I wish I were as good at doing that as you are."),
  step("sie", "Ich wünschte, ich könnte das so gut wie Sie.", "I wish I were as good at doing that as you are."),
  step("go", "Ich glaube, es ist an der Zeit für mich zu gehen.", "I think it's time for me to go."),
  step("backfill", "Das schaffe ich schon.", "I can manage it."),
];
const screenshotPick = pickFresh(screenshot, 3);
check(
  "the exact du/Sie collision is skipped and a later phrase backfills the round",
  screenshotPick.map((item) => item.item.id).join(",") === "du,go,backfill"
);
check("the screenshot round is one-to-one in both directions", visibleSetsAreUnique(screenshotPick));

const slashAlternatives = takeMatchingSafe(
  [
    step("slash-1", "Erster Satz.", "Same visible. / Alternative one."),
    step("slash-2", "Zweiter Satz.", "Same visible. / Alternative two."),
    step("slash-safe", "Dritter Satz.", "A different answer."),
  ],
  3,
  pairOfStep
);
check(
  "slash alternatives collide by the primary answer actually rendered",
  slashAlternatives.map((item) => item.item.id).join(",") === "slash-1,slash-safe"
);

const duplicateGerman = takeMatchingSafe(
  [
    step("de-1", "Das geht.", "That works."),
    step("de-2", "  DAS   GEHT. ", "That is possible."),
    step("de-safe", "Das klappt.", "That is okay."),
  ],
  3,
  pairOfStep
);
check(
  "case and whitespace cannot hide a duplicate German source",
  duplicateGerman.map((item) => item.item.id).join(",") === "de-1,de-safe"
);

const blocked = matchingVisibleKeys(
  "Ich wünschte, ich könnte das so gut wie du.",
  "I wish I were as good at doing that as you are."
);
const reviewPick = pickReviews(
  [
    step("review-collision", "Andere deutsche Form.", "I wish I were as good at doing that as you are.", { interval: 1 }),
    step("review-1", "Das erinnere ich.", "I remember that.", { interval: 3 }),
    step("review-2", "Das weiß ich noch.", "I still know that.", { interval: 10 }),
  ],
  2,
  blocked
);
check(
  "blocked cards are respected while reviews backfill",
  reviewPick.map((item) => item.item.id).join(",") === "review-1,review-2"
);

const exhausted = takeMatchingSafe(
  screenshot.slice(0, 2),
  3,
  pairOfStep
);
check(
  "an exhausted pool returns its largest honest subset instead of duplicates",
  exhausted.length === 1 && exhausted[0].item.id === "du"
);

const guidedSource = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
check(
  "preview cards use the same visible-answer collision keys as Quick Match",
  guidedSource.includes("const keys = matchingVisibleKeys(target, meaning);")
    && guidedSource.includes("const safeCards = takeMatchingSafe(")
);
check(
  "skipping flashcards still reaches the guided matching round",
  /onSkip=\{\(\) => \{[\s\S]*?setPreviewActive\(false\);[\s\S]*?setMatchingActive\(previewCards\.length > 1\);/.test(guidedSource)
);
// The round used to hold the door shut until every pair was matched, and then
// push you through it whether you wanted to go or not. It now refills instead
// of ending, so both halves of that had to go: a Continue that waits for a
// finished board would be a door that never opens.
check(
  "leaving the guided matching round is never gated on finishing the board",
  /<button\s+type="button"\s+className="fs-preview-next"\s+onClick=\{onComplete\}/.test(guidedSource)
    && !guidedSource.includes("disabled={!complete}")
);
check(
  "a cleared board deals the next one rather than ending the round",
  guidedSource.includes("const SESSION_MATCH_BOARD = 6;")
    && /setBoardStart\(\(start\) => \(start \+ boardItems\.length\) % items\.length\)/.test(guidedSource)
    // Wrapping, so a short session comes round again for review rather than
    // running out of board after one pass.
    && guidedSource.includes("items[(boardStart + offset) % items.length]")
);

if (failures) {
  console.error(`\n${failures} matching-pair regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nQuick Match cannot present indistinguishable hidden-id answers");
