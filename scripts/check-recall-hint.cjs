// A hint must help without being the answer: first letters only, and pressing
// Hint on one stage must not open the next stage already showing the answer.
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const guided = fs.readFileSync(path.join(root, "src/GuidedSession.tsx"), "utf8");
let failures = 0;
const check = (name, ok) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  if (!ok) failures += 1;
};

const start = guided.indexOf("function buildRecallHint(");
const end = guided.indexOf("\nfunction RecallHelp(", start);
check("the hint builder can be found", start >= 0 && end > start);

const primary = guided.includes("primaryAnswer") ? "import { primaryAnswer } from \"@/lib/germanTextMatch\";\n" : "";
const built = esbuild.buildSync({
  stdin: {
    contents: `${primary}${guided.slice(start, end)}\nexport { buildRecallHint };`,
    resolveDir: root, sourcefile: "recall-hint.ts", loader: "ts",
  },
  alias: { "@": path.resolve(root, "src") },
  bundle: true, write: false, format: "cjs", platform: "node", logLevel: "silent",
});
const mod = new Module("recall-hint", null);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "recall-hint.cjs"));
const { buildRecallHint } = mod.exports;

const revealed = (hint) => Array.from(hint).filter((c) => /[\p{L}\p{N}]/u.test(c)).length;
for (const answer of ["Guten Morgen", "thank you", "Danke schön", "Ich habe einen Hund", "der Hund", "Hund", "ja", "a cat"]) {
  const hint = buildRecallHint(answer);
  const words = answer.split(/\s+/);
  check(`"${answer}" shows at most one letter a word (${hint})`,
    hint !== answer && revealed(hint) <= words.length
      && hint.split(" ").every((word, i) => revealed(word) <= 1 && word.length === words[i].length));
}

for (const stage of ["write", "translate", "recall-both-target", "recall-both-meaning", "gap", "order", "memory-de"]) {
  check(`the ${stage} help starts closed on every step, repeats included`,
    new RegExp("key=\\{`\\$\\{item\\.id\\}-" + stage + "-\\$\\{step\\}`\\}").test(guided));
}

if (failures) { console.log(`\n${failures} recall hint check(s) failed`); process.exit(1); }
console.log("\nrecall hints give a start, not the answer");
