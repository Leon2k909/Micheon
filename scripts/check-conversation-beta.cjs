#!/usr/bin/env node
/**
 * Conversation Beta: hard structure first, and phrases taught as replies.
 *
 * The normal lesson orders by how useful a phrase is, which is right for
 * getting started and wrong for getting fast: the structures that make German
 * feel foreign turn up in longer, less common sentences, so a usefulness
 * ranking pushes them to the back. "weil" sends the verb to the end and has no
 * English equivalent to lean on — you can know a thousand words and still not
 * be able to build a sentence with it.
 *
 * Two properties have to hold. Sentences that teach structure must come first,
 * and a phrase that the course already has a question for must be able to find
 * it, or the "learn it as an answer" half does nothing.
 */
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");
const fs = require("fs");

const root = path.join(__dirname, "..");
global.window = { localStorage: null, dispatchEvent() {}, addEventListener() {} };
global.localStorage = { getItem: () => null, setItem() {} };
global.window.localStorage = global.localStorage;

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { structureScore, structureNotes, questionFor, rankForBeta } from "./src/lib/conversationBeta.ts";
      export { allPartBlueprints } from "./src/lib/data.ts";
    `,
    resolveDir: root, sourcefile: "beta-check.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});
const compiled = new Module("beta-check", module);
compiled._compile(built.outputFiles[0].text, path.join(root, "beta-check.js"));
const { structureScore, structureNotes, questionFor, rankForBeta, allPartBlueprints } = compiled.exports;

let failures = 0;
const check = (name, ok, detail) => {
  if (ok) return void console.log("ok   " + name);
  failures += 1;
  console.error("FAIL " + name + (detail ? " — " + detail : ""));
};

// ── the structure that has no English counterpart scores highest ──────────
const weil = structureScore("Ich komme nicht mit, weil ich noch arbeiten muss.");
const plain = structureScore("Ich trinke einen Kaffee.");
check("a weil-clause outranks a plain sentence", weil > plain, `${weil} vs ${plain}`);
check("a plain sentence teaches no structure", plain === 0, String(plain));
check(
  "the note says what it is teaching",
  structureNotes("Ich komme nicht mit, weil ich noch arbeiten muss.").some((n) => /weil|end/i.test(n)),
);
check(
  "Konjunktiv II is recognised",
  structureScore("Ich hätte gern einen Kaffee.") > 0,
);
check(
  "a relative clause is recognised",
  structureScore("Das ist der Mann, der nebenan wohnt.") > 0,
);

// ── length alone is not structure ─────────────────────────────────────────
check(
  "a long sentence with no structure still scores nothing",
  structureScore("Ich kaufe Brot und Butter und Milch und Käse und Eier und Obst.") === 0,
);

// ── the questions are really there ────────────────────────────────────────
const answers = [];
for (const pack of Object.values(allPartBlueprints)) {
  for (const d of pack.dialogues ?? []) {
    const lines = d.lines ?? [];
    for (let i = 1; i < lines.length; i += 1) {
      if (!lines[i - 1]?.de || !lines[i]?.de) continue;
      if (!/\?\s*$/.test(String(lines[i - 1].de).trim())) continue;
      if (lines[i - 1].speaker && lines[i].speaker && lines[i - 1].speaker === lines[i].speaker) continue;
      answers.push(lines[i].de);
    }
  }
}
const found = answers.filter((de) => questionFor(de)).length;
check(
  `every dialogue answer can find its question (${found}/${answers.length})`,
  answers.length > 200 && found === answers.length,
);
check("a sentence that answers nothing returns null", questionFor("Zzz nicht vorhanden.") === null);

// ── ranking puts structure first ──────────────────────────────────────────
const ranked = rankForBeta([
  { de: "Ich trinke Kaffee." },
  { de: "Ich bleibe zu Hause, weil es regnet." },
  { de: "Danke." },
]);
check("ranking leads with the structural sentence", /weil/.test(ranked[0].item.de), ranked[0].item.de);

// ── it reorders the sitting, it does not grow it ──────────────────────────
const lesson = fs.readFileSync(path.join(root, "src/guided_learning_session.tsx"), "utf8");
check(
  "the beta reorders the new material rather than adding to it",
  /rankForBeta\(fresh\.map/.test(lesson) && !/freshLimit\s*\+/.test(lesson),
);
check("it only applies when switched on", /conversationBetaOn\(\)\s*\?/.test(lesson));
// ── and the entry point is Leon's only ────────────────────────────────────
const shell = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
check(
  "the switch is behind the Leon-only gate",
  /hasLeonSocialPreview\(profile\?\.email\) && \([\s\S]{0,600}np-beta-button/.test(shell),
);

// A second button beside Continue learning, not a checkbox: pressing it has
// to start a lesson, and the ordinary button has to turn the beta back off or
// one press would quietly change every lesson after it.
check("the beta button starts a lesson rather than only setting a flag", /setConversationBeta\(true\);[\s\S]{0,80}onPractice\(\)/.test(shell));
check("the ordinary Continue learning turns the beta back off", /setConversationBeta\(false\);[\s\S]{0,80}onPractice\(\)/.test(shell));

if (failures) {
  console.error(`\n${failures} conversation-beta regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}
console.log("\nConversation Beta leads with structure, finds the question for every dialogue answer, and stays behind its gate");
process.exit(0);
