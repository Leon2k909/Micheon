const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";
      export { orderParts } from "./src/lib/curriculum.ts";
      export { buildCatalog, buildSession } from "./src/session.ts";
      export { buildCorpusIndex, sentenceCommonality } from "./src/lib/corpusFrequency.ts";
      export {
        conversationPriorityInfo,
        conversationPriorityScore,
      } from "./src/lib/conversationPriority.ts";
    `,
    resolveDir: root,
    sourcefile: "conversation-priority-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("conversation-priority-check", module);
compiled.filename = path.join(root, ".conversation-priority-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildCatalog,
  buildCorpusIndex,
  buildSession,
  buildTatoebaParts,
  conversationPriorityInfo,
  conversationPriorityScore,
  orderParts,
  sentenceCommonality,
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

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const parts = orderParts({
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
});
const catalog = buildCatalog(parts);
const corpusIndex = buildCorpusIndex(parts);

const score = (item) => conversationPriorityScore({
  partKey: item.partKey,
  kind: item.kind,
  commonality: sentenceCommonality(item.de, corpusIndex),
  lessonPriority: item.lessonPriority,
});

const everydayRepair = catalog.find((item) => item.de === "Ich hab das nicht ganz verstanden.");
const deliberateAdmission = catalog.find((item) => item.de === "Ich gebe zu, dass ich es nicht verstehe.");
const speedCamera = catalog.find((item) => item.de === "Ich wurde auf der Autobahn geblitzt.");

check("the everyday repair phrase is shipped", Boolean(everydayRepair));
check("the reported admission phrase remains available as later practice", Boolean(deliberateAdmission));
check("the reported speed-camera phrase is shipped", Boolean(speedCamera));

if (everydayRepair && deliberateAdmission && speedCamera) {
  check(
    "the everyday repair phrase ranks before the deliberate admission",
    score(everydayRepair) < score(deliberateAdmission),
    `${score(everydayRepair)} vs ${score(deliberateAdmission)}`
  );
  check(
    "the everyday repair phrase ranks before the speed-camera situation",
    score(everydayRepair) < score(speedCamera),
    `${score(everydayRepair)} vs ${score(speedCamera)}`
  );
  check(
    "the admission has a natural English translation and honest usage note",
    deliberateAdmission.en === "I admit I don't understand."
      && /more deliberate/i.test(deliberateAdmission.use || "")
  );
}

check(
  "the priority model separates essential, situational, specialist and extra material",
  conversationPriorityInfo("cb-conversation-repair").key === "essential"
    && conversationPriorityInfo("cb-traffic-fines").key === "situational"
    && conversationPriorityInfo("part29").key === "specialist"
    && conversationPriorityInfo("tatoeba-b1-1").key === "extra"
);

check(
  "a corpus sentence cannot beat an essential even with artificially common words",
  conversationPriorityScore({ partKey: "cb-conversation-repair", kind: "phrase", commonality: 5_000 })
    < conversationPriorityScore({ partKey: "tatoeba-a1-1", kind: "phrase", commonality: 1 })
);

check(
  "phrases rank before vocabulary examples inside the same pack",
  conversationPriorityScore({ partKey: "cb-greetings", kind: "phrase", commonality: 1_000 })
    < conversationPriorityScore({ partKey: "cb-greetings", kind: "vocab", commonality: 1_000 })
);

const authoredOrder = buildSession({
  partKey: "cb-conversation-repair",
  level: "A1",
  vocab: [],
  dialogues: [],
  phrases: [
    { id: "later", de: "Das kommt später dran.", en: "That comes later.", lessonPriority: 1 },
    { id: "first", de: "Kannst du das nochmal sagen?", en: "Can you say that again?", lessonPriority: -2 },
    { id: "middle", de: "Was meinst du genau?", en: "What exactly do you mean?" },
  ],
}, [], {}, 0).filter((step) => step.type === "sentence");
check(
  "fresh lessons use deterministic authored priority instead of shuffled ties",
  authoredOrder[0]?.item?.id === "first"
);

const trackerSource = fs.readFileSync(
  path.join(root, "src/components/lab/VocabTracker.tsx"),
  "utf8"
);
check(
  "the tracker exposes real item-type and usefulness filters",
  trackerSource.includes("ITEM_TYPE_FILTERS")
    && trackerSource.includes("USEFULNESS_FILTERS")
    && trackerSource.includes("usefulnessFilter !== \"all\"")
);
check(
  "Most common first is backed by the shared conversation score",
  trackerSource.includes("common: (a, b) => a.priorityScore - b.priorityScore")
    && trackerSource.includes("conversationPriorityScore({")
);

const guidedSource = fs.readFileSync(
  path.join(root, "src/guided_learning_session.tsx"),
  "utf8"
);
check(
  "guided lessons and pet recall share the same conversation-first ranking",
  (guidedSource.match(/conversationPriorityScore\(\{/g) || []).length >= 2
);

if (failures) {
  console.error(`\n${failures} conversation-priority regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\nconversation-first ranking passed against ${catalog.length.toLocaleString("en-GB")} shipped items`);
