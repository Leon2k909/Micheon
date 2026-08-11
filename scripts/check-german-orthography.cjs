const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceRoots = ["src", "server", "public"].map((dir) => path.join(root, dir));
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".svg"]);

// Definite pre-1996 spellings whose modern standard forms use ss.
// This list deliberately excludes words that still require ß, such as weiß,
// groß, Straße, heiß, süß, draußen, and Spaß.
const outdatedForms = [
  "daß",
  "muß",
  "mußt",
  "mußte",
  "mußten",
  "müßt",
  "müßte",
  "müßtest",
  "müßtet",
  "müßten",
  "wußte",
  "wußtest",
  "wußtet",
  "wußten",
  "wißt",
  "bißchen",
  "Kuß",
  "Schluß",
  "Fluß",
  "naß",
  "paßt",
  "paßte",
  "läßt",
  "haßt",
  "faßt",
  "vergißt",
  "ißt",
  "sodaß",
];

const escaped = outdatedForms.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const outdatedPattern = new RegExp(`(?<!\\p{L})(?:${escaped.join("|")})(?!\\p{L})`, "giu");

function collectFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(fullPath, files);
    else if (textExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

const failures = [];
for (const file of sourceRoots.flatMap((directory) => collectFiles(directory))) {
  const text = fs.readFileSync(file, "utf8");
  outdatedPattern.lastIndex = 0;
  for (const match of text.matchAll(outdatedPattern)) {
    const line = text.slice(0, match.index).split("\n").length;
    failures.push({ file: path.relative(root, file), line, word: match[0] });
  }
}

// ── the display pipeline may not invent umlauts ───────────────────────────
// toGermanDisplayText repairs mojibake, which is safe because those byte
// sequences never occur in real German. It once ALSO expanded the digraphs
// ae/oe/ue into umlauts, and that corrupted 580 authored strings: "teuer"
// became "teür", "neuen" became "neün", "sauer" became "saür", "bauen"
// became "baün". Every one of those was shown to the learner as the correct
// spelling and marked wrong when they typed the real one. Nothing in the
// content is ASCII-transliterated, so the expansion could only ever lose.
const apiSource = fs.readFileSync(path.join(root, "src", "lib", "api.ts"), "utf8");
const displayBody = apiSource.slice(apiSource.indexOf("export function toGermanDisplayText"));
const digraphExpansion = /\.replace\(\s*\/(?:ae|oe|ue|Ae|Oe|Ue)\/g\s*,\s*"[ÄÖÜäöü]"\s*\)/;
if (digraphExpansion.test(displayBody.slice(0, displayBody.indexOf("return result")))) {
  failures.push({
    file: "src/lib/api.ts",
    line: apiSource.slice(0, apiSource.indexOf("toGermanDisplayText")).split("\n").length,
    word: "ae/oe/ue -> umlaut expansion in toGermanDisplayText (corrupts real German: teuer, neuen, sauer, bauen)",
  });
}

if (failures.length > 0) {
  console.error("Outdated German spellings found:");
  for (const failure of failures) {
    console.error(`  ${failure.file}:${failure.line}  ${failure.word}`);
  }
  process.exitCode = 1;
} else {
  console.log("German orthography check passed (modern ss/ß spellings, no invented umlauts).");
}
