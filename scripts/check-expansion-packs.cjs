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
  part158: {
    theme: "Everyday spoken German: the little phrases people actually use",
    fixture: "Sag mal, hast du kurz Zeit?",
  },
  part159: {
    theme: "Everyday practical gaps: getting normal things sorted",
    fixture: "Bleibt es bei heute Abend?",
  },
  part160: {
    theme: "Everyday conversation essentials: common replies, check-ins and quick plans",
    fixture: "Klingt nach einem Plan.",
  },
  part161: {
    theme: "Essential conversation skills: choosing, asking, apologising and setting boundaries",
    fixture: "Hast du einen Moment?",
  },
  part162: {
    theme: "Meeting people naturally: follow-ups, interests and recommendations",
    fixture: "Woher kennt ihr euch?",
  },
  part163: {
    theme: "Talking about experience: ever, never, yet and how long",
    fixture: "Hast du das schon mal gemacht?",
  },
  part164: {
    theme: "Explaining why: reasons, purpose and what happened as a result",
    fixture: "Wie kommt das?",
  },
  part165: {
    theme: "Talking about habits: how often, what is normal and what has changed",
    fixture: "Wie oft machst du das?",
  },
  part166: {
    theme: "Everyday things: finding, borrowing, sharing and putting them away",
    fixture: "Wo kommt das hin?",
  },
  part167: {
    theme: "Identifying people and things: which one, where it is and what it looks like",
    fixture: "Welchen meinst du?",
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
check("new authored phrases are unique across all seventeen packs", new Set(newPhraseKeys).size === newPhraseKeys.length);

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

check("the seventeen expansion packs contain at least 792 authored phrases", newPhrases.length >= 792, `found ${newPhrases.length}`);
check("the seventeen expansion packs contain at least 321 vocabulary seeds", totalSeeds >= 321, `found ${totalSeeds}`);
check("the seventeen expansion packs contain at least sixty-eight dialogues", totalDialogues >= 68, `found ${totalDialogues}`);
check("storytelling follows the conversation-bridges pack", CURRICULUM_ORDER.indexOf("part152") === CURRICULUM_ORDER.indexOf("cb-conversation-bridges") + 1);
check("digital safety follows the modern-tech packs", CURRICULUM_ORDER.indexOf("part151") === CURRICULUM_ORDER.indexOf("part56") + 1);
check("DIY follows the apartment-repair pack", CURRICULUM_ORDER.indexOf("part154") === CURRICULUM_ORDER.indexOf("cb-apartment-repairs") + 1);
check("tabletop language follows the social-gaming packs", CURRICULUM_ORDER.indexOf("part153") === CURRICULUM_ORDER.indexOf("part149") + 1);
check("tabletop language is labelled as specialist game talk", packMeta("part153").tier === 3 && Boolean(packMeta("part153").note));
check("the drugstore pack follows clothes shopping", CURRICULUM_ORDER.indexOf("part156") === CURRICULUM_ORDER.indexOf("part63") + 1);
check("the bakery pack follows grocery shopping", CURRICULUM_ORDER.indexOf("part155") === CURRICULUM_ORDER.indexOf("cb-grocery") + 1);
check("both new everyday-shopping packs are tier one", packMeta("part155").tier === 1 && packMeta("part156").tier === 1);
check("pet-directed speech follows the existing pets and animals pack", CURRICULUM_ORDER.indexOf("part157") === CURRICULUM_ORDER.indexOf("part86") + 1);
check("pet-directed speech stays in the common situational tier", packMeta("part157").tier === 2);
check("spoken-glue practice follows the short-replies pack", CURRICULUM_ORDER.indexOf("part158") === CURRICULUM_ORDER.indexOf("cb-shortreplies") + 1);
check("spoken-glue practice is introduced in tier one", packMeta("part158").tier === 1);
check("everyday essentials follow spoken-glue practice", CURRICULUM_ORDER.indexOf("part160") === CURRICULUM_ORDER.indexOf("part158") + 1);
check("everyday essentials are introduced in tier one", packMeta("part160").tier === 1);
check("essential conversation skills follow everyday essentials", CURRICULUM_ORDER.indexOf("part161") === CURRICULUM_ORDER.indexOf("part160") + 1);
check("essential conversation skills are introduced in tier one", packMeta("part161").tier === 1);
check("natural getting-to-know-you practice follows essential conversation skills", CURRICULUM_ORDER.indexOf("part162") === CURRICULUM_ORDER.indexOf("part161") + 1);
check("natural getting-to-know-you practice is introduced in tier one", packMeta("part162").tier === 1);
check("experience practice follows natural getting-to-know-you practice", CURRICULUM_ORDER.indexOf("part163") === CURRICULUM_ORDER.indexOf("part162") + 1);
check("experience practice is introduced in tier one", packMeta("part163").tier === 1);
check("reason-and-result practice follows experience practice", CURRICULUM_ORDER.indexOf("part164") === CURRICULUM_ORDER.indexOf("part163") + 1);
check("reason-and-result practice is introduced in tier one", packMeta("part164").tier === 1);
check("habits-and-frequency practice follows reason-and-result practice", CURRICULUM_ORDER.indexOf("part165") === CURRICULUM_ORDER.indexOf("part164") + 1);
check("habits-and-frequency practice is introduced in tier one", packMeta("part165").tier === 1);
check("everyday-things practice follows habits-and-frequency practice", CURRICULUM_ORDER.indexOf("part166") === CURRICULUM_ORDER.indexOf("part165") + 1);
check("everyday-things practice is introduced in tier one", packMeta("part166").tier === 1);
check("identifying practice follows everyday-things practice", CURRICULUM_ORDER.indexOf("part167") === CURRICULUM_ORDER.indexOf("part166") + 1);
check("identifying practice is introduced in tier one", packMeta("part167").tier === 1);
check("practical-gap practice follows home and daily errands", CURRICULUM_ORDER.indexOf("part159") === CURRICULUM_ORDER.indexOf("part9") + 1);
check("practical-gap practice stays in the common situational tier", packMeta("part159").tier === 2);

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

const spokenPhrases = new Set((allPartBlueprints.part158?.phrases ?? []).map((phrase) => phrase.de));
const spokenCoverage = {
  reactions: ["Na ja.", "Tja.", "Eben.", "Nicht schlecht."],
  agreement: ["Find ich auch.", "Seh ich auch so.", "Seh ich anders.", "Da hast du schon recht."],
  particles: ["Komm doch rein.", "Dann machen wir das eben so.", "Was ist eigentlich los?"],
  timing: ["Ich bin gleich so weit.", "Ich bin noch unterwegs.", "Ich komme erst später."],
  messages: ["Bin in zehn Minuten da.", "Sag Bescheid, wenn du da bist.", "Komm gut nach Hause."],
  repair: ["Das habe ich nicht mitbekommen.", "Du hast mich falsch verstanden.", "Das ist nicht das, was ich gesagt habe."],
};
for (const [area, fixtures] of Object.entries(spokenCoverage)) {
  check(`spoken-glue pack covers ${area}`, fixtures.every((phrase) => spokenPhrases.has(phrase)));
}

const practicalPhrases = new Set((allPartBlueprints.part159?.phrases ?? []).map((phrase) => phrase.de));
const practicalCoverage = {
  home: ["Hast du den Herd ausgemacht?", "Kannst du die Tür abschließen?", "Das Wasser läuft nicht ab."],
  appointments: ["Könnten Sie mich auf die Warteliste setzen?", "Ich muss meinen Termin leider absagen."],
  transport: ["Ist der Anschluss noch zu schaffen?", "Muss ich die Fahrkarte noch entwerten?"],
  shopping: ["Das wurde mir zweimal berechnet.", "Am Regal war aber ein anderer Preis angegeben."],
  health: ["Ich bekomme schlecht Luft.", "Meine Beschwerden sind schlimmer geworden."],
  work: ["Bis wann brauchst du das?", "Ich habe keinen Zugriff auf die Datei."],
  plans: ["Bleibt es bei heute Abend?", "Kann ich noch jemanden mitbringen?"],
  phone: ["Ich kann dich kaum hören.", "Du bist noch stummgeschaltet."],
};
for (const [area, fixtures] of Object.entries(practicalCoverage)) {
  check(`practical-gap pack covers ${area}`, fixtures.every((phrase) => practicalPhrases.has(phrase)));
}

const everydayEssentialPhrases = new Set((allPartBlueprints.part160?.phrases ?? []).map((phrase) => phrase.de));
const everydayEssentialCoverage = {
  replies: ["Klar.", "Gerne.", "Mach ich.", "Schade."],
  warmth: ["Schön, dich zu sehen.", "Freut mich für dich.", "Das kann ich verstehen."],
  opinions: ["Was hältst du davon?", "Wie findest du das?", "Da bin ich mir nicht sicher."],
  smalltalk: ["Und, was machst du so?", "Was hast du heute noch vor?", "Wie war dein Wochenende?"],
  timing: ["Bin gleich zurück.", "Ich bin ein bisschen spät dran.", "Ich muss jetzt los."],
  messages: ["Ich ruf dich später an.", "Sag Bescheid, falls sich was ändert.", "Ich melde mich morgen."],
  plans: ["Passt dir morgen?", "Klingt nach einem Plan.", "Wollen wir los?"],
};
for (const [area, fixtures] of Object.entries(everydayEssentialCoverage)) {
  check(`everyday-essentials pack covers ${area}`, fixtures.every((phrase) => everydayEssentialPhrases.has(phrase)));
}

const essentialConversationPhrases = new Set((allPartBlueprints.part161?.phrases ?? []).map((phrase) => phrase.de));
const essentialConversationCoverage = {
  choices: ["Schwer zu sagen.", "Mir ist beides recht.", "Du entscheidest.", "Das ist mir lieber."],
  attention: ["Kann ich dich kurz sprechen?", "Hast du einen Moment?", "Lass mich kurz ausreden."],
  boundaries: ["Darüber möchte ich nicht reden.", "So kannst du nicht mit mir reden.", "Das geht mir zu weit."],
  apologies: ["Tut mir leid wegen vorhin.", "Das war keine Absicht.", "Kann passieren."],
  support: ["Das hört sich echt anstrengend an.", "Kann ich irgendwas tun?", "Du kannst jederzeit mit mir reden."],
  followups: ["Was meinst du?", "Was würdest du machen?", "Was ist denn passiert?"],
};
for (const [area, fixtures] of Object.entries(essentialConversationCoverage)) {
  check(`essential-conversation pack covers ${area}`, fixtures.every((phrase) => essentialConversationPhrases.has(phrase)));
}

const naturalMeetingPhrases = new Set((allPartBlueprints.part162?.phrases ?? []).map((phrase) => phrase.de));
const naturalMeetingCoverage = {
  meeting: ["Bist du von hier?", "Woher kennt ihr euch?", "Wie habt ihr euch kennengelernt?"],
  work: ["Arbeitest du oder studierst du?", "Was machst du genau?", "Wann hast du Feierabend?"],
  catchups: ["Wie geht's dir so?", "Wie war deine Woche bisher?", "Hast du schon Pläne fürs Wochenende?"],
  interests: ["Wofür interessierst du dich?", "Hörst du gern Podcasts?", "Hast du in letzter Zeit was Gutes gesehen?"],
  recommendations: ["Was kannst du empfehlen?", "Wie fandest du es?", "Würdest du es empfehlen?"],
  reactions: ["Davon habe ich schon gehört.", "Das schaue ich mir mal an.", "Da bin ich gespannt."],
};
for (const [area, fixtures] of Object.entries(naturalMeetingCoverage)) {
  check(`natural-meeting pack covers ${area}`, fixtures.every((phrase) => naturalMeetingPhrases.has(phrase)));
}

const experiencePhrases = new Set((allPartBlueprints.part163?.phrases ?? []).map((phrase) => phrase.de));
const experienceCoverage = {
  questions: ["Hast du das schon mal gemacht?", "Seit wann machst du das?", "Wie lange ist das her?"],
  familiar: ["Ja, schon mehrmals.", "Das habe ich schon öfter gemacht.", "Ich habe erst vor Kurzem damit angefangen."],
  never: ["Nein, noch nie.", "Dazu bin ich noch nicht gekommen.", "Bisher hatte ich noch keine Gelegenheit dazu."],
  timing: ["Das ist das erste Mal, dass ich das mache.", "Das letzte Mal ist schon lange her.", "Ich habe das seitdem nicht mehr gemacht."],
  reflection: ["Daran erinnere ich mich noch gut.", "Es war schwieriger als gedacht.", "Ich habe viel daraus gelernt."],
  nextTime: ["Ich würde das gern noch mal machen.", "Das müssen wir unbedingt wiederholen.", "Beim nächsten Mal bin ich dabei."],
};
for (const [area, fixtures] of Object.entries(experienceCoverage)) {
  check(`experience pack covers ${area}`, fixtures.every((phrase) => experiencePhrases.has(phrase)));
}

const reasonResultPhrases = new Set((allPartBlueprints.part164?.phrases ?? []).map((phrase) => phrase.de));
const reasonResultCoverage = {
  questions: ["Wie kommt das?", "Woran liegt das?", "Wieso hast du nichts gesagt?"],
  reasons: ["Weil ich keine Zeit hatte.", "Ich hatte keine andere Wahl.", "Es lag an einem Missverständnis."],
  purpose: ["Wofür brauchst du das?", "Damit ich nichts vergesse.", "Ich mache das nur zur Sicherheit."],
  results: ["Deshalb habe ich abgesagt.", "Deswegen hat es länger gedauert.", "Am Ende hat es trotzdem geklappt."],
  understanding: ["Das erklärt einiges.", "Das macht jetzt Sinn.", "Kein Wunder, dass du müde bist."],
};
for (const [area, fixtures] of Object.entries(reasonResultCoverage)) {
  check(`reason-and-result pack covers ${area}`, fixtures.every((phrase) => reasonResultPhrases.has(phrase)));
}

const habitsFrequencyPhrases = new Set((allPartBlueprints.part165?.phrases ?? []).map((phrase) => phrase.de));
const habitsFrequencyCoverage = {
  questions: ["Wie oft machst du das?", "Wie sieht ein normaler Tag bei dir aus?", "Hast du dafür eine feste Routine?"],
  frequent: ["Eigentlich jeden Tag.", "Fast jeden Tag.", "Ich mache das regelmäßig."],
  occasional: ["Ab und zu.", "Eher selten.", "So gut wie nie."],
  changes: ["Früher habe ich das öfter gemacht.", "Ich will mir das angewöhnen.", "Ich habe meine Routine geändert."],
  patterns: ["Das passiert mir immer wieder.", "Ich halte mich nicht immer daran.", "Heute mache ich mal eine Ausnahme."],
};
for (const [area, fixtures] of Object.entries(habitsFrequencyCoverage)) {
  check(`habits-and-frequency pack covers ${area}`, fixtures.every((phrase) => habitsFrequencyPhrases.has(phrase)));
}

const everydayThingsPhrases = new Set((allPartBlueprints.part166?.phrases ?? []).map((phrase) => phrase.de));
const everydayThingsCoverage = {
  finding: ["Wo hab ich das hingelegt?", "Da ist es ja!", "Schau mal in der Schublade nach."],
  borrowing: ["Kann ich mir das kurz ausleihen?", "Wann brauchst du es zurück?", "Pass bitte gut darauf auf."],
  supplies: ["Wir haben keine Milch mehr.", "Das müssen wir nachkaufen.", "Lass mir bitte noch etwas übrig."],
  remembering: ["Vergiss deine Schlüssel nicht.", "Ich hab's zu Hause liegen lassen.", "Hast du an alles gedacht?"],
  tidying: ["Wo kommt das hin?", "Kann das weg?", "Heb das bitte für mich auf."],
};
for (const [area, fixtures] of Object.entries(everydayThingsCoverage)) {
  check(`everyday-things pack covers ${area}`, fixtures.every((phrase) => everydayThingsPhrases.has(phrase)));
}

const identifyingPhrases = new Set((allPartBlueprints.part167?.phrases ?? []).map((phrase) => phrase.de));
const identifyingCoverage = {
  choosing: ["Welchen meinst du?", "Nein, den anderen.", "Such dir einen aus."],
  locating: ["Den da links.", "Ganz oben im Regal.", "Kannst du darauf zeigen?"],
  people: ["Wie sieht er aus?", "Sie trägt eine rote Jacke.", "Du erkennst sie sofort."],
  features: ["Es ist ungefähr so groß.", "Es ist aus Holz.", "Welche Farbe hat es?"],
  comparing: ["Das ist nicht ganz dasselbe.", "Woran erkennt man den Unterschied?", "Das sieht in echt anders aus."],
};
for (const [area, fixtures] of Object.entries(identifyingCoverage)) {
  check(`identifying pack covers ${area}`, fixtures.every((phrase) => identifyingPhrases.has(phrase)));
}

if (failures) {
  console.error(`\n${failures} expansion-pack regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\n${newPhrases.length} phrases, ${totalSeeds} vocabulary seeds and ${totalDialogues} dialogues are guarded`);
