const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts } from "./src/lib/contentBank.ts";
      export { CURRICULUM_ORDER, packMeta } from "./src/lib/curriculum.ts";
    `,
    resolveDir: root,
    sourcefile: "expansion-pack-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("expansion-pack-check", module);
compiled.filename = path.join(root, ".expansion-pack-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { allPartBlueprints, buildBundledParts, CURRICULUM_ORDER, packMeta } = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const normalise = (text) => String(text ?? "")
  .normalize("NFKC")
  .trim()
  .replace(/[“”„]/g, '"')
  .replace(/\s+/g, " ")
  .toLocaleLowerCase("de-DE");

const expected = {
  part151: {
    theme: "Online safety, scams and account recovery",
    fixture: "Gib niemandem deinen Bestätigungscode.",
  },
  part152: {
    theme: "Telling a story clearly: what happened next",
    fixture: "Es stellte sich heraus, dass wir am falschen Eingang gewartet hatten.",
  },
  part153: {
    theme: "Board games, tabletop RPGs and taking turns",
    fixture: "Wessen Zug ist es?",
  },
  part154: {
    theme: "DIY tools and fixing things at home",
    fixture: "Prüf mit der Wasserwaage, ob es gerade ist.",
  },
  part155: {
    theme: "At the bakery, deli counter and weekly market",
    fixture: "Darf's ein bisschen mehr sein?",
  },
  part156: {
    theme: "At the drugstore: toiletries, laundry and photos",
    fixture: "Gibt es das auch als Reisegröße?",
  },
  part157: {
    theme: "Talking to your pets",
    fixture: "Komm, wir gehen Gassi.",
  },
};

const newKeys = new Set(Object.keys(expected));
const newPhrases = [];
let totalSeeds = 0;
let totalDialogues = 0;

for (const [partKey, expectation] of Object.entries(expected)) {
  const pack = allPartBlueprints[partKey];
  const phrases = pack?.phrases ?? [];
  const seeds = pack?.seeds ?? [];
  const dialogues = pack?.dialogues ?? [];
  totalSeeds += seeds.length;
  totalDialogues += dialogues.length;
  newPhrases.push(...phrases.map((phrase) => ({ ...phrase, partKey })));

  check(`${partKey} exists with the intended theme`, pack?.theme === expectation.theme);
  check(`${partKey} contains substantial sentence practice`, phrases.length >= 28, `found ${phrases.length}`);
  check(`${partKey} adds a useful vocabulary set`, seeds.length >= 15, `found ${seeds.length}`);
  check(`${partKey} includes at least two complete dialogues`, dialogues.length >= 2, `found ${dialogues.length}`);
  check(
    `${partKey} phrases all have German, English and guidance`,
    phrases.every((phrase) => phrase.de?.trim() && phrase.en?.trim() && phrase.use?.trim())
  );
  check(`${partKey} keeps its regression fixture`, phrases.some((phrase) => phrase.de === expectation.fixture));
  check(
    `${partKey} appears exactly once in curriculum order`,
    CURRICULUM_ORDER.filter((key) => key === partKey).length === 1
  );
}

const newPhraseKeys = newPhrases.map((phrase) => normalise(phrase.de));
check("new authored phrases are unique across all seven packs", new Set(newPhraseKeys).size === newPhraseKeys.length);

const existingGerman = new Set();
for (const [partKey, pack] of Object.entries(allPartBlueprints)) {
  if (newKeys.has(partKey)) continue;
  for (const phrase of pack.phrases ?? []) existingGerman.add(normalise(phrase.de));
  for (const dialogue of pack.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) existingGerman.add(normalise(line.de));
  }
}
for (const pack of Object.values(buildBundledParts())) {
  for (const phrase of pack.phrases ?? []) existingGerman.add(normalise(phrase.de));
}

const duplicate = newPhrases.find((phrase) => existingGerman.has(normalise(phrase.de)));
check(
  "new authored phrases do not exactly duplicate the existing hand-written catalog",
  !duplicate,
  duplicate && `${duplicate.partKey}: ${duplicate.de}`
);

check("the release adds at least 220 authored phrases", newPhrases.length >= 220, `found ${newPhrases.length}`);
check("the release adds at least 113 vocabulary seeds", totalSeeds >= 113, `found ${totalSeeds}`);
check("the release adds at least seventeen dialogues", totalDialogues >= 17, `found ${totalDialogues}`);
check("storytelling follows conversational practice", CURRICULUM_ORDER.indexOf("part152") === CURRICULUM_ORDER.indexOf("part70") + 1);
check("digital safety follows the modern-tech packs", CURRICULUM_ORDER.indexOf("part151") === CURRICULUM_ORDER.indexOf("part56") + 1);
check("DIY follows the apartment-repair pack", CURRICULUM_ORDER.indexOf("part154") === CURRICULUM_ORDER.indexOf("cb-apartment-repairs") + 1);
check("tabletop language follows the social-gaming packs", CURRICULUM_ORDER.indexOf("part153") === CURRICULUM_ORDER.indexOf("part149") + 1);
check("tabletop language is labelled as specialist game talk", packMeta("part153").tier === 3 && Boolean(packMeta("part153").note));
check("the drugstore pack follows clothes shopping", CURRICULUM_ORDER.indexOf("part156") === CURRICULUM_ORDER.indexOf("part63") + 1);
check("the bakery pack follows grocery shopping", CURRICULUM_ORDER.indexOf("part155") === CURRICULUM_ORDER.indexOf("cb-grocery") + 1);
check("both new everyday-shopping packs are tier one", packMeta("part155").tier === 1 && packMeta("part156").tier === 1);
check("pet-directed speech follows the existing pets and animals pack", CURRICULUM_ORDER.indexOf("part157") === CURRICULUM_ORDER.indexOf("part86") + 1);
check("pet-directed speech stays in the common situational tier", packMeta("part157").tier === 2);

const petPhrases = new Set((allPartBlueprints.part157?.phrases ?? []).map((phrase) => phrase.de));
const petCoverage = {
  commands: ["Sitz!", "Platz!", "Gib Pfötchen!", "Bei Fuß!"],
  walking: ["Komm, wir gehen Gassi.", "Musst du mal raus?", "Nicht auf die Straße!"],
  feeding: ["Willst du ein Leckerli?", "Das darfst du nicht fressen.", "Trink erst mal was."],
  affection: ["Braver Junge!", "Braves Mädchen!", "Fein gemacht!"],
  care: ["Zeig mal deine Pfote.", "Nicht lecken!", "Du musst jetzt deine Medizin nehmen."],
  vet: ["Wir fahren jetzt zum Tierarzt.", "Das piekst nur ganz kurz.", "Den Trichter musst du noch anlassen."],
};
for (const [area, fixtures] of Object.entries(petCoverage)) {
  check(`pet-directed pack covers ${area}`, fixtures.every((phrase) => petPhrases.has(phrase)));
}

if (failures) {
  console.error(`\n${failures} expansion-pack regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\n${newPhrases.length} phrases, ${totalSeeds} vocabulary seeds and ${totalDialogues} dialogues are guarded`);
