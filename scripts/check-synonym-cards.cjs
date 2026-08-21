#!/usr/bin/env node
/**
 * Combined synonym cards: one card per meaning, most common word first.
 *
 * The catalogue folds same-meaning words into one entry (wordSynonymGroups.ts)
 * — "anfangen" fronts a card that also carries "beginnen", instead of the
 * learner meeting "to begin" as three unrelated rows. This is exactly the kind
 * of machinery that can rot in two opposite directions: it can stop merging
 * (the tracker quietly fills back up with duplicates) or it can start merging
 * words the course exists to teach APART (wissen folded into kennen would
 * accept a wrong answer forever). Both directions are checked here, against
 * the real implementation and the real content.
 *
 * Synthetic cases pin the rules; the real catalogue then proves the fold is
 * alive, ordered most-common-first, and progress-safe (every absorbed word's
 * id rides as an alias on its card).
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { buildWordCatalog, rankWordCatalog } from "./src/lib/wordSession.ts";',
      'export { wordMeaningKey, keepApartTag, extraSynonymGroupKey, KEEP_APART, EXTRA_SYNONYM_GROUPS } from "./src/lib/wordSynonymGroups.ts";',
      'export { frequencyRank, synonymCommonality } from "./src/lib/wordFrequency.ts";',
      'export { sentenceIdentityKey } from "./src/lib/germanTextMatch.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, buildTatoebaParts } from "./src/lib/contentBank.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "synonym-cards-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const compiled = new Module("synonym-cards-check", module);
compiled.filename = path.join(root, ".synonym-cards-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const {
  allPartBlueprints,
  buildApiPartFromResolved,
  buildBundledParts,
  buildTatoebaParts,
  buildWordCatalog,
  frequencyRank,
  synonymCommonality,
  wordMeaningKey,
  keepApartTag,
  extraSynonymGroupKey,
  KEEP_APART,
  EXTRA_SYNONYM_GROUPS,
} = compiled.exports;

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

// ── The rules, pinned on synthetic packs ──────────────────────────────────
{
  const parts = {
    part1: {
      vocab: [
        { de: "das Auto", en: "car", lookup: "Auto", pos: "noun" },
        { de: "wissen", en: "to know", lookup: "wissen", pos: "verb" },
        { de: "die Dusche", en: "shower", lookup: "Dusche", pos: "noun" },
      ],
    },
    part2: {
      vocab: [
        { de: "der Wagen", en: "car", lookup: "Wagen", pos: "noun" },
        { de: "kennen", en: "to know", lookup: "kennen", pos: "verb" },
        { de: "duschen", en: "to shower", lookup: "duschen", pos: "verb" },
      ],
    },
  };
  const catalog = buildWordCatalog(parts);
  const byLookup = new Map(catalog.map((word) => [word.lookup.toLowerCase(), word]));

  const auto = byLookup.get("auto");
  check(Boolean(auto), "synthetic: das Auto is missing from the catalogue");
  check(!byLookup.has("wagen"), "synthetic: der Wagen kept its own card instead of folding into das Auto");
  check(
    Boolean(auto?.synonyms?.some((syn) => syn.de === "der Wagen")),
    "synthetic: das Auto does not list der Wagen as its synonym"
  );
  check(
    Boolean(auto?.aliases?.includes("vw-wagen")),
    "synthetic: der Wagen's progress id is not an alias of the combined card"
  );

  check(Boolean(byLookup.get("wissen")) && Boolean(byLookup.get("kennen")),
    "synthetic: wissen and kennen must both keep their own cards (KEEP_APART)");
  check(!(byLookup.get("wissen")?.synonyms?.length), "synthetic: wissen must not absorb kennen");

  check(Boolean(byLookup.get("dusche")) && Boolean(byLookup.get("duschen")),
    "synthetic: die Dusche (noun) and duschen (verb) must never share a card");
}

// ── The real catalogue ────────────────────────────────────────────────────
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
const catalog = buildWordCatalog(parts);
const combined = catalog.filter((word) => (word.synonyms?.length ?? 0) > 0);

// The fold is alive. If this floor ever fails, the consolidation died and the
// tracker is full of duplicate meanings again.
check(combined.length >= 5, `only ${combined.length} combined synonym cards — the fold has died`);

// No absorbed word survives as its own card, and ids stay unique.
const idsOnCards = new Set(catalog.map((word) => word.id));
check(idsOnCards.size === catalog.length, "duplicate card ids in the catalogue");
for (const word of combined) {
  for (const syn of word.synonyms) {
    check(!idsOnCards.has(syn.id) || syn.id === word.id,
      `"${syn.de}" is listed as a synonym of "${word.de}" but still has its own card`);
    check((word.aliases ?? []).includes(syn.id) || syn.id === word.id,
      `synonym "${syn.de}" of "${word.de}" does not ride as a progress alias`);
  }
}

// Most common first: the face is at least as common as every synonym, and the
// synonyms themselves are ordered most common first.
for (const word of combined) {
  const faceRank = frequencyRank(word.lookup || word.de);
  let previous = faceRank;
  for (const syn of word.synonyms) {
    const rank = frequencyRank(syn.lookup || syn.de);
    check(faceRank <= rank,
      `"${word.de}" fronts its card but "${syn.de}" is more common (${rank} < ${faceRank})`);
    check(previous <= rank,
      `synonyms of "${word.de}" are not ordered most common first ("${syn.de}")`);
    previous = rank;
  }
}

// Words the course teaches apart stay apart — on every card, not just their own.
for (const group of KEEP_APART) {
  for (const word of catalog) {
    for (const syn of word.synonyms ?? []) {
      check(!keepApartTag(syn.lookup || syn.de),
        `"${syn.de}" is a keep-apart word but was absorbed into "${word.de}"`);
    }
  }
  const present = group.filter((lookup) =>
    catalog.some((word) => (word.lookup || word.de).toLowerCase().replace(/^(der|die|das)\s+/, "") === lookup));
  check(present.length === new Set(present).size, `keep-apart group ${group.join("/")} lost a card`);
}

// The meaning side keeps every absorbed gloss as an accepted alternative, so
// answering with a synonym's meaning stays right everywhere " / " is split.
for (const word of combined) {
  const alternatives = String(word.en).toLowerCase();
  for (const syn of word.synonyms) {
    const primary = String(syn.en).split(" / ")[0].split(",")[0].trim().toLowerCase();
    check(!primary || alternatives.includes(primary),
      `the card "${word.de}" dropped the gloss of its synonym "${syn.de}" (${primary})`);
  }
}

// Hand-listed same-meaning groups (Gegner/Feind, Auto/Wagen …) are genuinely
// combined: when at least two members are taught, exactly one card carries
// the whole group.
for (const group of EXTRA_SYNONYM_GROUPS) {
  const members = new Set(group);
  const bare = (value) => String(value ?? "").toLowerCase().replace(/^(der|die|das)\s+/, "").replace(/^sich\s+/, "");
  const cards = catalog.filter((word) =>
    members.has(bare(word.lookup || word.de))
    || (word.synonyms ?? []).some((syn) => members.has(bare(syn.lookup || syn.de))));
  const taught = cards.reduce((count, word) =>
    count
    + (members.has(bare(word.lookup || word.de)) ? 1 : 0)
    + (word.synonyms ?? []).filter((syn) => members.has(bare(syn.lookup || syn.de))).length, 0);
  if (taught >= 2) {
    check(cards.length === 1,
      `the hand-listed group ${group.join("/")} spans ${cards.length} cards instead of one`);
  }
}

// ── The surfaces that show the group ──────────────────────────────────────
// Renderers are pinned the way every other gate pins them: by the source that
// makes the behaviour, so a refactor that silently drops the synonym line fails
// here instead of in Michelle's tracker.
const tracker = fs.readFileSync(path.join(root, "src/components/lab/WordsTracker.tsx"), "utf8");
check(tracker.includes("word.synonyms"), "WordsTracker no longer renders combined synonym cards");
check(tracker.includes('ui("Also")'), "WordsTracker lost the Also: label for synonyms");
check(tracker.includes("syn.lookup.toLowerCase().includes(needle)"),
  "WordsTracker search no longer matches absorbed synonyms");

const listenView = fs.readFileSync(path.join(root, "src/components/listen/ListenView.tsx"), "utf8");
check(listenView.includes("item.synonyms"), "ListenView no longer shows the synonym line on word cards");

const listenMode = fs.readFileSync(path.join(root, "src/lib/listenMode.ts"), "utf8");
check(listenMode.includes("synonyms: word.synonyms"), "buildListenQueue drops synonyms from word cards");

const guided = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
check(guided.includes("synonyms={item.synonyms}"), "GuidedSession no longer passes synonyms to the usage chips");
check(guided.includes("groupSynonyms.map"), "UsageChips no longer renders the synonym chips");
check(/for \(const entry of item\.synonyms \?\? \[\]\) \{\s*\n\s*const alt = matchTarget\(typed, entry\.de\);/u.test(guided),
  "GuidedSession no longer accepts a synonym as a typed answer");

// ── the tag on a folded synonym compares it with the face ───────────────────
// Leon: "the common tag should have said whether it was the same commonality,
// less or more than the parent word. parent word always the absolute most
// common". Both halves are checked here: the claim about the data, and the
// label built on top of it.
{
  // The premise. If a synonym ever outranked its face, "less common" would be
  // a lie on that card and the fold itself would be picking the wrong word.
  const inverted = [];
  let comparable = 0;
  for (const word of combined) {
    const face = frequencyRank(word.lookup || word.de);
    for (const syn of word.synonyms ?? []) {
      const other = frequencyRank(syn.lookup || syn.de);
      if (!Number.isFinite(face) || !Number.isFinite(other)) continue;
      comparable += 1;
      if (other < face) inverted.push(`${word.de} #${face} is led by ${syn.de} #${other}`);
    }
  }
  check(inverted.length === 0,
    `the face of a combined card is not the most common word: ${inverted.slice(0, 4).join("; ")}`);
  check(comparable >= 200, `only ${comparable} synonym pairs have both words ranked`);

  // The label. Compared by ratio, because a frequency list is Zipfian: the
  // 212 ranks between das Fernsehen and das TV are nothing, the 216 between
  // das Unternehmen and der Betrieb are a different word entirely.
  check(synonymCommonality("Fernsehen", "TV")?.label === "just as common",
    "das Fernsehen and das TV are a rank apart in practice and should read that way");
  check(synonymCommonality("Unternehmen", "Betrieb")?.label === "much less common",
    "#23 against #239 is a real drop and should read as one");
  check(synonymCommonality("erhalten", "empfangen")?.label === "much less common",
    "#32 against #1809 is the clearest case there is");
  check(synonymCommonality("professionell", "fachlich")?.label === "just as common",
    "the pair Leon reported should say they are interchangeable, not repeat a tier");

  // Where writing and speech disagree, the card says so instead of reporting
  // the rank as though it settled the matter. The bank is a written corpus:
  // it has anfangen at #1131 against beginnen at #130, which is true of prose
  // and false of anybody talking.
  for (const [face, spoken] of [
    ["beginnen", "anfangen"],
    ["Unternehmen", "Firma"],
    ["Beruf", "Job"],
    ["Raum", "Zimmer"],
    ["notwendig", "nötig"],
  ]) {
    const versus = synonymCommonality(face, spoken);
    check(versus?.label === "more common in speech",
      `${spoken} is what people say instead of ${face}, and the card should say so `
      + `rather than "${versus?.label ?? "nothing"}"`);
  }
  // But only where it was reviewed. The sweep that found those also produced
  // false ones — corpusUses pools a lemma's forms, so "gebraucht" counted as
  // gebrauchen — and an unreviewed pair keeps the written verdict.
  check(synonymCommonality("verwenden", "gebrauchen")?.label === "much less common",
    "gebrauchen was rejected from the spoken list and must keep the written verdict");

  // Silence rather than a guess: the bank carries neither slang nor function
  // words, so unranked never means rare.
  check(synonymCommonality("Auto", "zzzznotaword") === null,
    "an unranked synonym must make no claim at all");
  check(synonymCommonality(undefined, "Auto") === null, "nor must a missing face");

  // And the surfaces have to ask for the comparison rather than the old tier.
  for (const [file, label] of [
    ["src/components/lab/WordsTracker.tsx", "the Words tracker"],
    ["src/GuidedSession.tsx", "a lesson"],
    ["src/lib/listenMode.ts", "Listen"],
  ]) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    check(text.includes("synonymCommonality("),
      `${label} still tags a folded synonym with its own tier instead of comparing it with the face`);
  }
}

if (failures.length) {
  console.error("FAIL check-synonym-cards");
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log(
  `check-synonym-cards: ${combined.length} combined cards, most common word first, ` +
  "keep-apart words separate, progress ids preserved, all surfaces rendering, " +
  "and every folded synonym compared with the face rather than tiered alone"
);
