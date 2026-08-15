/** Diagnostic report for polysemous vocabulary cards used by Listen mode. */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: 'export { allPartBlueprints } from "./src/lib/data.ts";',
    resolveDir: root,
    sourcefile: "listen-sense-audit-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("listen-sense-audit", module);
compiled.filename = path.join(root, ".listen-sense-audit.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);
const { allPartBlueprints } = compiled.exports;

const bank = require(path.join(root, "src/lib/bundledWordBank.json"));
const ranks = new Map();
for (let index = 0; index < bank.length; index += 1) {
  const entry = bank[index] || {};
  for (const value of [entry.lookup, entry.de]) {
    const key = String(value || "").toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").trim();
    if (key && !ranks.has(key)) ranks.set(key, index + 1);
  }
}

const keyOf = (value) => String(value || "").toLocaleLowerCase("de-DE").trim();
const isBare = (value) => !/\s/.test(String(value || "").replace(/^(der|die|das)\s+/i, "").trim());
const byLemma = new Map();
for (const [partKey, blueprint] of Object.entries(allPartBlueprints)) {
  for (const seed of blueprint.seeds || []) {
    const key = keyOf(seed.lookup || seed.de);
    if (!key) continue;
    const claim = {
      partKey,
      level: blueprint.level,
      de: seed.de,
      en: seed.fallbackEn,
      use: seed.use,
      core: Boolean(seed.core),
    };
    if (!byLemma.has(key)) byLemma.set(key, []);
    byLemma.get(key).push(claim);
  }
}

const ownerOf = (claims) => {
  let owner = claims[0];
  for (const claim of claims.slice(1)) {
    if (claim.core !== owner.core) {
      if (claim.core) owner = claim;
      continue;
    }
    if (isBare(claim.de) !== isBare(owner.de) && isBare(claim.de)) owner = claim;
  }
  return owner;
};

const rows = [];
for (const [lemma, claims] of byLemma) {
  const meanings = new Set(claims.map((claim) => String(claim.en || "").toLocaleLowerCase("en-GB")));
  if (claims.length < 2 || meanings.size < 2) continue;
  rows.push({ lemma, rank: ranks.get(lemma) || Infinity, owner: ownerOf(claims), claims });
}
rows.sort((a, b) => a.rank - b.rank || a.lemma.localeCompare(b.lemma, "de"));

const start = Math.max(0, Number(process.argv[2]) || 0);
const count = Math.max(1, Number(process.argv[3]) || 120);
for (const row of rows.slice(start, start + count)) {
  const rank = Number.isFinite(row.rank) ? `#${row.rank}` : "unranked";
  console.log(`\n${rank} ${row.lemma} -> ${row.owner.de} = ${row.owner.en} [${row.owner.level}; ${row.owner.partKey}${row.owner.core ? "; core" : ""}]`);
  for (const claim of row.claims) {
    const owner = claim === row.owner ? "*" : " ";
    console.log(`${owner} ${claim.level} ${claim.partKey}: ${claim.de} = ${claim.en}${claim.core ? " [core]" : ""}`);
  }
}
console.log(`\n${rows.length} duplicated lemmas carry different glosses.`);
