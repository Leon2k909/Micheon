const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";
      export { CURRICULUM_ORDER, packMeta } from "./src/lib/curriculum.ts";
      export { matchingVisibleKey, matchEnglishPhrase, matchGermanPhrase, primaryAnswer } from "./src/lib/germanTextMatch.ts";
      export { buildPartCatalog } from "./src/session.ts";
      export { swapStepForEnglish } from "./src/lib/learningDirectionStep.ts";
    `,
    resolveDir: root,
    sourcefile: "conversation-bridges-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("conversation-bridges-check", module);
compiled.filename = path.join(root, ".conversation-bridges-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const {
  buildBundledParts,
  buildPartCatalog,
  CURRICULUM_ORDER,
  filterPartsForLearningDirection,
  matchingVisibleKey,
  matchEnglishPhrase,
  matchGermanPhrase,
  packMeta,
  primaryAnswer,
  swapStepForEnglish,
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

const packKey = "cb-conversation-bridges";
const learnGermanParts = buildBundledParts("learn-de");
const learnEnglishParts = buildBundledParts("learn-en");
const germanPack = learnGermanParts[packKey];
const englishPack = learnEnglishParts[packKey];
const pack = germanPack;

check("the conversation-bridges pack is available when learning German", Boolean(germanPack));
check("the conversation-bridges pack is available when learning English", Boolean(englishPack));
check(
  "the shared direction filter preserves the pack in both directions",
  Boolean(filterPartsForLearningDirection(learnGermanParts, "learn-de")[packKey])
    && Boolean(filterPartsForLearningDirection(learnEnglishParts, "learn-en")[packKey])
);

const orderHits = CURRICULUM_ORDER.filter((key) => key === packKey).length;
const packIndex = CURRICULUM_ORDER.indexOf(packKey);
check("the pack has one curriculum position", orderHits === 1, `found ${orderHits}`);
check(
  "conversation bridges follow conversation flow and precede storytelling",
  packIndex === CURRICULUM_ORDER.indexOf("part70") + 1
    && CURRICULUM_ORDER.indexOf("part152") === packIndex + 1
);
check("conversation bridges stay in the common situational tier", packMeta(packKey).tier === 2);

if (pack) {
  const phrases = pack.phrases ?? [];
  const ids = phrases.map((phrase) => phrase.id);
  const germanPrompts = phrases.map((phrase) => matchingVisibleKey(phrase.de, "de"));
  const primaryEnglish = phrases.map((phrase) => matchingVisibleKey(phrase.en, "en"));
  const groups = new Set(phrases.map((phrase) => phrase.group));

  check("the pack adds at least forty focused fluency frames", phrases.length >= 40, `found ${phrases.length}`);
  check(
    "every frame has a stable namespaced id",
    ids.every((id) => id?.startsWith(`${packKey}-`)) && new Set(ids).size === ids.length
  );
  check(
    "every frame has both languages, guidance and a conversation function",
    phrases.every((phrase) => phrase.de?.trim() && phrase.en?.trim() && phrase.use?.trim() && phrase.group?.trim())
  );
  check("German prompts are unique inside the pack", new Set(germanPrompts).size === germanPrompts.length);
  check("primary English answers are unique inside the pack", new Set(primaryEnglish).size === primaryEnglish.length);
  check("bidirectional coaching survives the learning-direction swap", pack.coachingLanguage === "both");
  check(
    "all planned conversational functions are represented",
    [
      "clarifying-and-reference",
      "rephrasing-and-scope",
      "turn-taking",
      "uncertainty-and-source",
      "stance-and-decisions",
      "support-and-boundaries",
    ].every((group) => groups.has(group))
  );

  const baselineGerman = new Map();
  const baselineEnglish = new Map();
  for (const [otherKey, otherPack] of Object.entries(learnGermanParts)) {
    if (otherKey === packKey) continue;
    for (const phrase of otherPack.phrases ?? []) {
      baselineGerman.set(matchingVisibleKey(phrase.de, "de"), `${otherKey}: ${phrase.de}`);
      baselineEnglish.set(matchingVisibleKey(phrase.en, "en"), `${otherKey}: ${primaryAnswer(phrase.en)}`);
    }
    for (const dialogue of otherPack.dialogues ?? []) {
      for (const line of dialogue.lines ?? []) {
        baselineGerman.set(matchingVisibleKey(line.de, "de"), `${otherKey} dialogue: ${line.de}`);
        baselineEnglish.set(matchingVisibleKey(line.en, "en"), `${otherKey} dialogue: ${primaryAnswer(line.en)}`);
      }
    }
  }

  const germanCollision = phrases.find((phrase) => baselineGerman.has(matchingVisibleKey(phrase.de, "de")));
  const englishCollision = phrases.find((phrase) => baselineEnglish.has(matchingVisibleKey(phrase.en, "en")));
  check(
    "new German prompts do not repeat the shipped hand-written catalogue",
    !germanCollision,
    germanCollision && `${germanCollision.de} conflicts with ${baselineGerman.get(matchingVisibleKey(germanCollision.de, "de"))}`
  );
  check(
    "new primary English answers do not create ambiguous matching pairs",
    !englishCollision,
    englishCollision && `${primaryAnswer(englishCollision.en)} conflicts with ${baselineEnglish.get(matchingVisibleKey(englishCollision.en, "en"))}`
  );

  const catalog = buildPartCatalog(pack, packKey);
  check(
    "catalogue entries preserve every stable phrase id",
    catalog.length === phrases.length && catalog.every((item) => ids.includes(item.id))
  );

  const byId = new Map(phrases.map((phrase) => [phrase.id, phrase]));
  const grammarJargon = /\b(?:accusative|dative|genitive|nominative|reflexive|conjugat(?:e|ed|ion)|infinitive|participle|subordinate|relative clause|modal verb|imperative|predicate)\b/i;
  const jargonIssues = phrases.filter((phrase) => grammarJargon.test(phrase.use ?? ""));
  check(
    "conversation-bridge guidance explains usage without grammar jargon",
    jargonIssues.length === 0,
    jargonIssues.map((phrase) => `${phrase.id}: ${phrase.use}`).slice(0, 5).join("; ")
  );

  const agreeOnThat = byId.get("cb-conversation-bridges-agree-on-that");
  const agreeOnThatUse = agreeOnThat?.use ?? "";
  const hasConcreteAgreementTip = /means 'to agree on something'/i.test(agreeOnThatUse)
    && /'darauf'/i.test(agreeOnThatUse)
    && /both (?:people|sides).*accept/i.test(agreeOnThatUse)
    && !grammarJargon.test(agreeOnThatUse);
  check(
    "the agreement bridge has a concrete plain-language usage tip",
    agreeOnThat?.de === "Darauf können wir uns einigen."
      && agreeOnThat?.en === "We can agree on that."
      && hasConcreteAgreementTip,
    `found ${JSON.stringify(agreeOnThatUse)}`
  );

  const catalogAgreeOnThat = catalog.find((item) => item.id === agreeOnThat?.id);
  check(
    "the built catalogue preserves the agreement bridge's plain-language tip",
    catalogAgreeOnThat?.use === agreeOnThatUse && hasConcreteAgreementTip
  );

  const swappedAgreeOnThat = swapStepForEnglish({
    type: "sentence",
    item: { ...agreeOnThat, coachingLanguage: pack.coachingLanguage },
  });
  check(
    "the agreement tip survives the English-learning direction swap",
    swappedAgreeOnThat?.item?.de === agreeOnThat?.en
      && swappedAgreeOnThat?.item?.en === agreeOnThat?.de
      && swappedAgreeOnThat?.item?.use === agreeOnThatUse
      && hasConcreteAgreementTip
  );

  const asFarAs = byId.get("cb-conversation-bridges-as-far-as-i-know");
  const notMyPoint = byId.get("cb-conversation-bridges-not-my-point");
  check(
    "conversational English is displayed before its careful full form",
    primaryAnswer(asFarAs?.en) === "As far as I know, nothing's been decided yet."
  );
  check(
    "careful English alternatives remain accepted",
    matchEnglishPhrase("As far as I know, nothing has been decided yet", asFarAs?.en ?? "").ok
  );
  check(
    "careful German forms remain accepted for spoken contractions",
    matchGermanPhrase(notMyPoint?.long ?? "", notMyPoint?.de ?? "").ok
  );

  const source = byId.get("cb-conversation-bridges-mean-by-that");
  const swapped = swapStepForEnglish({
    type: "sentence",
    item: { ...source, coachingLanguage: pack.coachingLanguage },
  });
  check(
    "direction swapping puts English in the target column",
    swapped?.item?.de === source?.en && swapped?.item?.en === source?.de
  );
  check(
    "useful two-language coaching remains visible after the swap",
    swapped?.item?.use === source?.use
  );
}

if (failures) {
  console.error(`\n${failures} conversation-bridges regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nConversation bridges are bidirectional, collision-free and placed before storytelling");
