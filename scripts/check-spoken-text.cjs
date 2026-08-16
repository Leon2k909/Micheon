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
}

checkServerMirror()
  .then(() => {
    if (failures) {
      console.error(`\n${failures} spoken-text regression${failures === 1 ? "" : "s"}`);
      process.exitCode = 1;
      return;
    }
    console.log("\nSpeech normalization keeps annotations visible but out of TTS");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
