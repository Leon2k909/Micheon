#!/usr/bin/env node
/**
 * The packs are the same course, split up.
 *
 * The whole point of splitting content into installable packs is that a
 * learner stops downloading 3.9 MB to study lesson three. The risk it creates
 * is the one that would be hardest to notice: an entry that falls between two
 * packs and is simply gone, or one that lands in two and is taught twice.
 * Neither throws. Both look like a content bug months later.
 *
 * So this reads the packs from source, reads the emitted JSON back off disk,
 * and checks the two describe exactly the same course — nothing lost, nothing
 * duplicated, and everything still readable after a round trip through JSON.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const OUT = path.join(root, "public", "content");

assert.ok(
  fs.existsSync(path.join(OUT, "manifest.json")),
  "no content manifest — run build:content-packs first"
);

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
      'export { TRANSLATION_LANGUAGES } from "./src/lib/translations.ts";',
      'export { FRENCH_BY_GERMAN } from "./src/lib/frenchTranslations.ts";',
      'export { POLISH_BY_GERMAN } from "./src/lib/polishTranslations.ts";',
      'export { primeTranslations } from "./src/lib/translations.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "content-packs-check.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("content-packs-check", module);
compiled.filename = path.join(root, ".content-packs-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;
// The tables are fetched at runtime so a German-only learner never
// downloads them; here every language is wanted at once, and there is no
// event loop to await one on.
M.primeTranslations("fr", M.FRENCH_BY_GERMAN);
M.primeTranslations("pl", M.POLISH_BY_GERMAN);

const resolved = Object.fromEntries(
  Object.entries(M.allPartBlueprints).map(([key, blueprint]) => [key, M.buildApiPartFromResolved(blueprint, {})])
);
const parts = { ...resolved, ...M.buildBundledParts(), ...M.buildTatoebaParts() };
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, "manifest.json"), "utf8"));

// ── the manifest describes files that exist ─────────────────────────────────
assert.ok(manifest.version >= 1, "the manifest needs a version so a stale cache can be dropped");
assert.ok(manifest.levels.length >= 2, `only ${manifest.levels.length} level packs — splitting bought nothing`);

const allPacks = [...manifest.levels, ...manifest.languages];
for (const pack of allPacks) {
  const file = path.join(root, "public", pack.url.replace(/^content\//, "content/"));
  assert.ok(fs.existsSync(file), `${pack.url} is in the manifest but not on disk`);
  const actual = fs.statSync(file).size;
  assert.strictEqual(
    actual,
    pack.bytes,
    `${pack.url} is ${actual} bytes but the manifest says ${pack.bytes} — the settings screen would lie about the download`
  );
  assert.ok(pack.entries > 0, `${pack.url} has no entries`);
}

// ── every part lands in exactly one pack ────────────────────────────────────
const seen = new Map();
let packedEntries = 0;
for (const level of manifest.levels) {
  const bucket = JSON.parse(fs.readFileSync(path.join(root, "public", level.url), "utf8"));
  for (const [partKey, part] of Object.entries(bucket)) {
    const already = seen.get(partKey);
    assert.ok(
      !already,
      `part "${partKey}" is in both ${already} and ${level.id} — it would be taught twice`
    );
    seen.set(partKey, level.id);
    packedEntries += (part.phrases?.length ?? 0) + (part.vocab?.length ?? 0);
  }
}

const sourceKeys = Object.keys(parts);
const missing = sourceKeys.filter((key) => !seen.has(key));
assert.strictEqual(
  missing.length,
  0,
  `${missing.length} parts are in the course but in no pack, so they would silently vanish: ${missing.slice(0, 5).join(", ")}`
);
const extra = [...seen.keys()].filter((key) => !sourceKeys.includes(key));
assert.strictEqual(extra.length, 0, `packs contain parts the course does not: ${extra.slice(0, 5).join(", ")}`);

const sourceEntries = Object.values(parts)
  .reduce((sum, part) => sum + (part.phrases?.length ?? 0) + (part.vocab?.length ?? 0), 0);
assert.strictEqual(
  packedEntries,
  sourceEntries,
  `the packs hold ${packedEntries} entries but the course has ${sourceEntries}`
);

// ── the content survives the round trip ─────────────────────────────────────
// Not just the counts: a sample of actual taught strings has to come back
// byte-identical, or something is being lost in serialisation that a count
// would never show.
let compared = 0;
for (const [partKey, part] of Object.entries(parts)) {
  const level = seen.get(partKey);
  const bucket = JSON.parse(fs.readFileSync(path.join(root, "public", `content/level/${level}.json`), "utf8"));
  const round = bucket[partKey];
  for (const [index, item] of (part.phrases ?? []).slice(0, 3).entries()) {
    assert.strictEqual(round.phrases[index].de, item.de, `${partKey} phrase ${index} changed in the pack`);
    assert.strictEqual(round.phrases[index].en, item.en, `${partKey} phrase ${index} lost its English`);
    compared += 1;
  }
  for (const [index, word] of (part.vocab ?? []).slice(0, 3).entries()) {
    assert.strictEqual(round.vocab[index].de, word.de, `${partKey} word ${index} changed in the pack`);
    compared += 1;
  }
}
assert.ok(compared > 500, `only ${compared} entries were compared — the round-trip check is not covering enough`);

// ── the split actually buys something ───────────────────────────────────────
const largest = Math.max(...manifest.levels.map((level) => level.bytes));
const total = manifest.levels.reduce((sum, level) => sum + level.bytes, 0);
assert.ok(
  largest < total * 0.6,
  `the largest pack is ${(largest / total * 100).toFixed(0)}% of the whole course — that is not a split worth having`
);
const smallest = Math.min(...manifest.levels.map((level) => level.bytes));
assert.ok(
  smallest < 1_200_000,
  `the smallest level pack is ${(smallest / 1048576).toFixed(2)} MB — a beginner should be downloading far less than the course`
);

// ── a language is a small pack, and every registered one is emitted ─────────
for (const language of M.TRANSLATION_LANGUAGES) {
  const pack = manifest.languages.find((entry) => entry.id === language);
  assert.ok(pack, `"${language}" has a translation table but no emitted pack`);
  assert.ok(
    pack.bytes < 4_000_000,
    `the ${language} pack is ${(pack.bytes / 1048576).toFixed(2)} MB — a language should not cost what the course costs`
  );
}

// ── the runtime cannot need a desktop branch ────────────────────────────────
// Electron loads over http://localhost and serves dist with express.static,
// so a relative fetch resolves identically in both. If someone adds a
// file:// path or an isElectron branch here, that has stopped being true and
// the two platforms have quietly diverged.
const runtimeSource = fs.readFileSync(path.join(root, "src/lib/contentPacks.ts"), "utf8");
// Comments are stripped first. The file EXPLAINS that Electron does not load
// over file://, and the first version of this check flagged its own
// documentation — which is the same class of false positive that made the
// translation gate cry wolf over "au Bürgeramt".
const runtime = runtimeSource
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(^|[^:])\/\/.*$/gm, "$1");
assert.ok(!/file:\/\//.test(runtime), "contentPacks must not special-case file:// — Electron serves over http");
assert.ok(!/isElectron|process\.versions/.test(runtime), "contentPacks must stay one code path for web and desktop");
assert.ok(/caches/.test(runtime), "packs need to survive offline, which is what the Cache API is for");

console.log(
  `check-content-packs: ${sourceEntries.toLocaleString()} entries across ${manifest.levels.length} level packs `
  + `(largest ${(largest / 1048576).toFixed(2)} MB of ${(total / 1048576).toFixed(2)} MB) `
  + `and ${manifest.languages.length} language pack(s); ${compared.toLocaleString()} strings verified byte-identical`
);
