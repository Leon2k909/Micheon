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

if (failures.length > 0) {
  console.error("Outdated German spellings found:");
  for (const failure of failures) {
    console.error(`  ${failure.file}:${failure.line}  ${failure.word}`);
  }
  process.exitCode = 1;
} else {
  console.log("German orthography check passed (modern ss/ß spellings).");
}
