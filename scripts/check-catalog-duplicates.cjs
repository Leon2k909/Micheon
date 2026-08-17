#!/usr/bin/env node
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildCatalog, buildPartCatalog } from "./src/session.ts";',
      'export { buildWordCatalog, buildWordSitting } from "./src/lib/wordSession.ts";',
      'export { sentenceIdentityKey } from "./src/lib/germanTextMatch.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "catalog-duplicates-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("catalog-duplicates-check", module);
compiled.filename = path.join(root, ".catalog-duplicates-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildCatalog,
  buildPartCatalog,
  buildTatoebaParts,
  buildWordCatalog,
  buildWordSitting,
  sentenceIdentityKey,
} = compiled.exports;

const resolvedBlueprints = Object.fromEntries(
  Object.entries(allPartBlueprints).map(([partKey, blueprint]) => [
    partKey,
    buildApiPartFromResolved(blueprint, {}),
  ])
);
const parts = {
  ...resolvedBlueprints,
  ...buildBundledParts(),
  ...buildTatoebaParts(),
};

const identity = (value, locale) => sentenceIdentityKey(value)
  .toLocaleLowerCase(locale);
const answerAlternatives = (value) => String(value ?? "")
  .split(/\s+\/\s+/u)
  .map((answer) => answer.trim())
  .filter(Boolean);
const pairKey = (item) => `${identity(item.de, "de-DE")}\u0000${identity(item.en, "en-GB")}`;
const groupsBy = (items, keyFor) => {
  const groups = new Map();
  for (const item of items) {
    const key = keyFor(item);
    if (!key) continue;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return [...groups.values()].filter((group) => group.length > 1);
};

const rawCatalog = Object.entries(parts).flatMap(([partKey, part]) =>
  buildPartCatalog({ ...part, partKey }, partKey)
);
const rawDuplicatePairs = groupsBy(rawCatalog, pairKey);
const rawRepeatedGerman = groupsBy(rawCatalog, (item) => identity(item.de, "de-DE"));
const repeatedGerman = rawRepeatedGerman
  .filter((group) => new Set(group.map(pairKey)).size > 1);
const catalog = buildCatalog(parts);
const remainingDuplicatePairs = groupsBy(catalog, pairKey);
const remainingRepeatedGerman = groupsBy(catalog, (item) => identity(item.de, "de-DE"));
const wordCatalog = buildWordCatalog(parts);
const duplicateWords = groupsBy(wordCatalog, (item) => identity(item.de, "de-DE"));

global.window = {};
global.localStorage = {
  getItem: (key) => key === "gl-learning-mode" ? "exam" : null,
};
const examRawCatalog = Object.entries(parts).flatMap(([partKey, part]) =>
  buildPartCatalog({ ...part, partKey }, partKey)
);
const examCatalog = buildCatalog(parts);
delete global.localStorage;
delete global.window;
const examRepeatedGerman = groupsBy(examRawCatalog, (item) => identity(item.de, "de-DE"));
const remainingExamGerman = groupsBy(examCatalog, (item) => identity(item.de, "de-DE"));

if (process.env.CATALOG_DUPLICATES_VERBOSE === "1") {
  for (const group of rawDuplicatePairs) {
    console.log(group.map((item) =>
      `${item.de} = ${item.en} [${item.kind}:${item.id}]`
    ).join("\n  ↳ "));
  }
  console.log(`\n${repeatedGerman.length} repeated German forms have different English senses:`);
  for (const group of repeatedGerman) {
    console.log(group.map((item) =>
      `${item.de} = ${item.en} [${item.kind}:${item.id}]`
    ).join("\n  ↳ "));
  }
}
if (process.env.CATALOG_DUPLICATES_VERBOSE === "1" || process.env.CATALOG_DUPLICATES_VERBOSE === "words") {
  console.log(`\n${duplicateWords.length} repeated word faces:`);
  for (const group of duplicateWords) {
    console.log(group.map((item) =>
      `${item.de} = ${item.en} [${item.partKey}:${item.id}]`
    ).join("\n  ↳ "));
  }
}

assert.equal(
  remainingDuplicatePairs.length,
  0,
  `tracker still contains duplicate visible pairs: ${remainingDuplicatePairs
    .slice(0, 10)
    .map((group) => group.map((item) => `${item.de} (${item.id})`).join(" / "))
    .join(" | ")}`
);
assert.equal(
  remainingRepeatedGerman.length,
  0,
  `tracker still contains repeated German: ${remainingRepeatedGerman
    .slice(0, 10)
    .map((group) => group.map((item) => `${item.de} (${item.id})`).join(" / "))
    .join(" | ")}`
);
assert.equal(
  remainingExamGerman.length,
  0,
  `Exam mode still contains repeated German: ${remainingExamGerman
    .slice(0, 10)
    .map((group) => group.map((item) => `${item.de} (${item.id})`).join(" / "))
    .join(" | ")}`
);
assert.equal(
  duplicateWords.length,
  0,
  `Words mode still contains duplicate visible cards: ${duplicateWords
    .slice(0, 10)
    .map((group) => group.map((item) => `${item.de} (${item.id})`).join(" / "))
    .join(" | ")}`
);

const wordAliasFixture = buildWordCatalog({
  first: { vocab: [{ de: "probeweise", en: "on a trial basis", lookup: "probeweise-one", core: true }] },
  second: { vocab: [{ de: "probeweise", en: "as a trial", lookup: "probeweise-two", core: true }] },
});
assert.equal(wordAliasFixture.length, 1, "same-face word fixtures did not collapse");
assert(wordAliasFixture[0].aliases?.includes("vw-probeweise-two"), "merged word lost its later progress id");
assert(wordAliasFixture[0].en.includes("on a trial basis") && wordAliasFixture[0].en.includes("as a trial"),
  "merged word lost an authored English sense");
const aliasReview = buildWordSitting(wordAliasFixture, {
  "vw-probeweise-two": { lastGrade: "struggle", updatedAt: new Date().toISOString() },
});
assert(aliasReview[0]?.review && aliasReview[0]?.item.id === wordAliasFixture[0].id,
  "word sitting ignored progress stored under a merged alias");

for (const group of rawRepeatedGerman) {
  const germanKey = identity(group[0].de, "de-DE");
  const canonical = catalog.find((item) => identity(item.de, "de-DE") === germanKey);
  assert(canonical, `deduplication removed every copy of ${group[0].de}`);
  const progressIds = new Set([canonical.id, ...(canonical.aliases ?? [])]);
  const acceptedEnglish = new Set(
    answerAlternatives(canonical.en).map((answer) => identity(answer, "en-GB"))
  );
  for (const item of group) {
    assert(
      progressIds.has(item.id),
      `${group[0].de} lost progress id ${item.id} while its duplicate was merged`
    );
    for (const alias of item.aliases ?? []) {
      assert(
        progressIds.has(alias),
        `${group[0].de} lost legacy progress id ${alias} while its duplicate was merged`
      );
    }
    for (const answer of answerAlternatives(item.en)) {
      assert(
        acceptedEnglish.has(identity(answer, "en-GB")),
        `${group[0].de} lost English answer ${answer} while its duplicate was merged`
      );
    }
  }
}

for (const group of examRepeatedGerman) {
  const germanKey = identity(group[0].de, "de-DE");
  const canonical = examCatalog.find((item) => identity(item.de, "de-DE") === germanKey);
  assert(canonical, `Exam mode removed every copy of ${group[0].de}`);
  const progressIds = new Set([canonical.id, ...(canonical.aliases ?? [])]);
  const acceptedEnglish = new Set(
    answerAlternatives(canonical.en).map((answer) => identity(answer, "en-GB"))
  );
  for (const item of group) {
    assert(progressIds.has(item.id), `${group[0].de} lost Exam-mode progress id ${item.id}`);
    for (const alias of item.aliases ?? []) {
      assert(progressIds.has(alias), `${group[0].de} lost Exam-mode legacy id ${alias}`);
    }
    for (const answer of answerAlternatives(item.en)) {
      assert(
        acceptedEnglish.has(identity(answer, "en-GB")),
        `${group[0].de} lost Exam-mode English answer ${answer}`
      );
    }
  }
}

const makesSense = catalog.filter((item) => identity(item.de, "de-DE") === "das macht sinn");
assert.equal(makesSense.length, 1, "Das macht Sinn. still appears more than once in the tracker");

const duplicateEntries = rawRepeatedGerman.reduce((sum, group) => sum + group.length - 1, 0);
console.log(
  `check-catalog-duplicates: ${duplicateEntries} repeated entries across `
  + `${rawRepeatedGerman.length} German forms collapse to one progress-preserving card `
  + `(${rawDuplicatePairs.length} exact pairs, ${repeatedGerman.length} with alternate English); `
  + `Exam mode also has no repeats; ${wordCatalog.length} word cards contain no exact visible duplicates`
);
