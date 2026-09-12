const path = require("node:path");
const Module = require("node:module");
const { pathToFileURL } = require("node:url");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: `export { firstSpokenAlternative } from "./src/lib/spokenText.ts";`,
    resolveDir: root,
    sourcefile: "spoken-text-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("spoken-text-check", module);
compiled.filename = path.join(root, ".spoken-text-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);

const { firstSpokenAlternative: clientFirstSpokenAlternative } = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const cases = [
  ["client removes a vocabulary clarification", "advice (NOT a rat)", "advice"],
  ["client removes a note before choosing a slash alternative", "advice (NOT a rat) / counsel", "advice"],
  ["client removes a leading parenthetical note", "(case of) emergency", "emergency"],
  ["client removes a normal parenthetical gloss", "co-payment (patient's share)", "co-payment"],
  ["client keeps ordinary text", "Just a normal sentence.", "Just a normal sentence."],
  ["client smooths the reported selbstständig phrase for German TTS", "sich selbstständig machen", "sich selbständig machen"],
  ["client smooths inflected selbstständig forms for German TTS", "viel selbstständiger", "viel selbständiger"],
  // One spelling, two words. The synthesiser guesses from the sentence and
  // guessed the weather in "things that wind me up", so the verb is respelled
  // on its way to the voice — and only the verb, which is why the weather
  // cases sit right beside it here.
  ["client respells the verb wind so it rhymes with mind", "things that wind me up", "things that wynd me up"],
  ["client respells it with an object and a particle apart", "wind it back down", "wynd it back down"],
  ["client respells the fixed phrase", "Wind your neck in.", "Wynd your neck in."],
  ["client respells the hyphenated noun", "That was a wind-up.", "That was a wynd-up."],
  ["client leaves the weather alone", "The wind knocked the tree over.", "The wind knocked the tree over."],
  ["client leaves the weather alone even before up", "The wind whistles up top", "The wind whistles up top"],
  ["client leaves German Wind alone", "Bei dem Wind ist es am schlimmsten.", "Bei dem Wind ist es am schlimmsten."],
  // One spelling, two readings again: the adjective has a poetic two-syllable
  // form the voice preferred, which is how the gloss on verflucht was read.
  ["client respells the adjective so it is one syllable", "cursed", "curst"],
  ["client respells it mid-sentence", "This place is cursed.", "This place is curst."],
  ["client keeps the capital where the word starts a line", "Cursed thing.", "Curst thing."],
  ["client leaves accursed its own syllables", "the accursed thing", "the accursed thing"],
];

for (const [name, input, expected] of cases) {
  const actual = clientFirstSpokenAlternative(input);
  check(name, actual === expected, actual);
}

check(
  "client still selects the first slash alternative",
  clientFirstSpokenAlternative("advice / counsel (formal)") === "advice"
);
check(
  "client still normalizes and/or compounds",
  clientFirstSpokenAlternative("and/or German") === "and or German"
    && clientFirstSpokenAlternative("Online/Offline") === "Online"
);

async function checkServerMirror() {
  const serverModule = await import(pathToFileURL(path.join(root, "server/index.js")).href);
  for (const [name, input, expected] of cases) {
    const actual = serverModule.firstSpokenAlternative(input);
    check(`server ${name.replace(/^client /, "")}`, actual === expected, actual);
  }
  check(
    "server still selects the first slash alternative",
    serverModule.firstSpokenAlternative("advice / counsel (formal)") === "advice"
  );
  check(
    "server still normalizes and/or compounds",
    serverModule.firstSpokenAlternative("and/or German") === "and or German"
      && serverModule.firstSpokenAlternative("Online/Offline") === "Online"
  );
  check(
    "Sonia slows an isolated occurrence just enough to separate its syllables",
    serverModule.pronunciationRateFor("occurrence", "en-GB-SoniaNeural", "+0%") === "-10%"
  );
  check(
    "Sonia applies the same clarity pace to an isolated plural",
    serverModule.pronunciationRateFor("Occurrences.", "en-GB-SoniaNeural", "+20%") === "-10%"
  );
  check(
    "an already slower Sonia setting stays learner-controlled",
    serverModule.pronunciationRateFor("occurrence", "en-GB-SoniaNeural", "-20%") === "-20%"
  );
  check(
    "other voices and full sentences keep their requested pace",
    serverModule.pronunciationRateFor("occurrence", "en-GB-LibbyNeural", "+0%") === "+0%"
      && serverModule.pronunciationRateFor("an occurrence", "en-GB-SoniaNeural", "+0%") === "+0%"
  );
}

checkServerMirror()
  .then(() => {
    if (failures) {
      console.error(`\n${failures} spoken-text regression${failures === 1 ? "" : "s"}`);
      process.exitCode = 1;
      return;
    }
    console.log("\nSpeech normalization keeps annotations visible and pronunciation traps out of TTS");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
