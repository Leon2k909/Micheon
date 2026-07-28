const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { computeGap, matchesGapInput, spokenWord } from "./src/lib/gapFill.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";
      export { buildCatalog } from "./src/session.ts";
    `,
    resolveDir: root,
    sourcefile: "gap-fill-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("gap-fill-check", module);
compiled.filename = path.join(root, ".gap-fill-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  computeGap,
  matchesGapInput,
  spokenWord,
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildCatalog,
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

const euSentence = "Nach EU-Recht steht mir eine Entschädigung zu.";
const euGap = computeGap(euSentence);
check("the reported sentence keeps its two intended blanks", euGap.display === "Nach ____ steht mir eine ____ zu.", euGap.display);
check("the reported answer preserves the valid EU-Recht spelling", JSON.stringify(euGap.words) === JSON.stringify(["EU-Recht", "Entschädigung"]), euGap.words.join(" | "));
check("the screenshot's exact answer is accepted", matchesGapInput("EU-Recht Entschädigung", euGap.words));
check("a space may replace the hard-to-type hyphen", matchesGapInput("EU Recht Entschaedigung", euGap.words));
check("the two missing answers remain order-free", matchesGapInput("Entschädigung EU-Recht", euGap.words));
check("the old invalid glued spelling stays rejected", !matchesGapInput("EURecht Entschädigung", euGap.words));
check("leaving out one blank stays rejected", !matchesGapInput("Entschädigung", euGap.words));

const punctuationCases = [
  ["EU-Recht", "EU Recht", "EURecht"],
  ["E-Mail", "E Mail", "EMail"],
  ["T-Shirt", "T Shirt", "TShirt"],
  ["Zwei-Faktor-Authentifizierung", "Zwei Faktor Authentifizierung", "ZweiFaktorAuthentifizierung"],
  ["Spieler-ID", "Spieler ID", "SpielerID"],
  ["Erste-Hilfe-Kurs", "Erste Hilfe Kurs", "ErsteHilfeKurs"],
  ["WLAN-Passwort", "WLAN Passwort", "WLANPasswort"],
  ["Check-out", "Check out", "Checkout"],
];
for (const [canonical, spaced, glued] of punctuationCases) {
  check(`${canonical} accepts its canonical spelling`, matchesGapInput(canonical, [canonical]));
  check(`${canonical} accepts a keyboard-friendly space`, matchesGapInput(spaced, [canonical]));
  check(`${canonical} rejects the invalid glued spelling`, !matchesGapInput(glued, [canonical]));
}

for (const canonical of ["Gibt's", "Mach's", "läuft's"]) {
  check(`${canonical} keeps its apostrophe in learner-facing feedback`, spokenWord(`${canonical}!`) === canonical);
  check(`${canonical} accepts input with or without the apostrophe`, matchesGapInput(canonical.replace("'", ""), [canonical]));
}

const substringCases = [
  ["ich", "nicht"],
  ["Tag", "Montag"],
  ["Art", "Karte"],
  ["Recht", "zurecht"],
];
for (const [expected, wrong] of substringCases) {
  check(`${expected} is not accepted inside ${wrong}`, !matchesGapInput(wrong, [expected]));
}
check("one occurrence cannot fill two identical blanks", !matchesGapInput("warten", ["warten", "warten"]));
check("two occurrences can fill two identical blanks", matchesGapInput("warten warten", ["warten", "warten"]));
check("a multi-token answer cannot donate a token to another blank", !matchesGapInput("EU-Recht", ["EU-Recht", "Recht"]));
check("separate occurrences satisfy overlapping-looking answers", matchesGapInput("EU-Recht Recht", ["EU-Recht", "Recht"]));

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const fullCatalog = buildCatalog({
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
});
const targetTexts = new Set();
for (const item of fullCatalog) {
  for (const value of [item.de, item.en, item.short, item.long]) {
    if (typeof value === "string" && value.trim()) targetTexts.add(value.trim());
  }
}

let preservationFailure = null;
let selfMatchFailure = null;
for (const sentence of targetTexts) {
  const gap = computeGap(sentence);
  const sourceTokens = sentence.split(/\s+/).filter(Boolean);
  const displayTokens = gap.display.split(/\s+/).filter(Boolean);
  const canonicalWords = sourceTokens
    .filter((_, index) => displayTokens[index] === "____")
    .map(spokenWord);
  if (!preservationFailure && JSON.stringify(gap.words) !== JSON.stringify(canonicalWords)) {
    preservationFailure = `${sentence} -> ${gap.words.join(" | ")} (wanted ${canonicalWords.join(" | ")})`;
  }
  if (!selfMatchFailure && !matchesGapInput(gap.words.join(" "), gap.words)) {
    selfMatchFailure = `${sentence} -> ${gap.words.join(" | ")}`;
  }
}

check("every catalogue gap preserves the canonical missing-word spelling", !preservationFailure, preservationFailure ?? "");
check("every catalogue gap accepts its own displayed answer", !selfMatchFailure, selfMatchFailure ?? "");
check("the invariant audits the complete shipped catalogue", fullCatalog.length >= 9000, `found ${fullCatalog.length}`);

if (failures) {
  console.error(`\n${failures} gap-fill regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\nGap-fill punctuation and exact-token matching passed across ${targetTexts.size.toLocaleString("en-GB")} target texts`);
