#!/usr/bin/env node
/**
 * Hover a word, get the meaning it has HERE.
 *
 * German capitalises its nouns, and a great many nouns have a lowercase twin
 * that is a verb or a particle. The word bank stores both under one
 * case-folded key, so the twin that happened to be curated first answered for
 * both — and it was usually the wrong one for a word standing capitalised in
 * the middle of a sentence:
 *
 *     der Krieg   glossed as "get / manage"          (kriegen, to get)
 *     die Stelle  glossed as "stand something up"    (stellen, to place)
 *     die Last    glossed as "read"                  (lesen)
 *     die Falle   glossed as "fall / be pleasing"    (fallen / gefallen)
 *     das Mal     glossed as "just / sometime"       (the "sag mal" softener)
 *
 * Not a near miss in any of those — a different word. A learner hovering to
 * unstick themselves was handed something that made the sentence impossible.
 *
 * The fix is a hint, not an override: a caller that can see the word is
 * capitalised somewhere other than the start of its sentence says so, and the
 * noun bank gets asked first. If it has no answer the ordinary lookup replies
 * exactly as before, which is why the sweep below also insists that nothing
 * anywhere in the catalogue LOSES a gloss.
 */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n?/gu, "\n");

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { germanWordGloss } from "./src/lib/germanWordGloss.ts";',
      'export { glossedTokens } from "./src/components/shared/GlossedGerman.tsx";',
      'export { default as bank } from "./src/lib/bundledWordBank.json";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "hover-entry.tsx",
    loader: "tsx",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  jsx: "automatic",
  loader: { ".css": "empty", ".json": "json" },
  write: false,
  logLevel: "silent",
});
const compiled = new Module("hover-check", module);
compiled.filename = path.join(root, ".hover-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { germanWordGloss, glossedTokens, bank } = compiled.exports;

const asNoun = (word) => germanWordGloss(word, { midSentenceCapital: true });

// ── the traps, by name ──────────────────────────────────────────────────
for (const [word, wanted, wrongTwin] of [
  ["Krieg", /war/i, "get / manage (kriegen)"],
  ["Stelle", /place|spot|job/i, "stand something up (stellen)"],
  ["Last", /burden|load/i, "read (lesen)"],
  ["Falle", /trap/i, "fall / be pleasing (fallen)"],
  ["Mal", /time|occasion/i, "just / sometime (the softener)"],
  ["Essen", /food|meal/i, "eat (essen)"],
  ["Tat", /act|action|deed/i, "do (tun)"],
  ["Stand", /status|level|stall/i, "be standing (stehen)"],
  ["Lüge", /lie|untruth/i, "tell a lie (lügen)"],
  ["Kosten", /cost|expense/i, "taste (kosten)"],
  ["Morgen", /morning/i, "tomorrow"],
]) {
  const gloss = asNoun(word);
  check(`${word} glosses as the noun, not "${wrongTwin}"`, Boolean(gloss) && wanted.test(gloss));
}

// ── and the hint must never take a meaning away ─────────────────────────
{
  const rows = Array.isArray(bank) ? bank : Object.values(bank).flat().filter(Boolean);
  const sentences = rows
    .map((row) => row && (row.de || row.german))
    .filter((line) => typeof line === "string" && /\s/.test(line));
  check("the sweep has a real corpus to run against", sentences.length > 500);

  let capitals = 0;
  const lost = [];
  const improved = new Set();
  for (const sentence of sentences) {
    glossedTokens(sentence).forEach((token, index) => {
      if (!token.word) return;
      if (!(index > 0 && /^\p{Lu}/u.test(token.text))) return;
      capitals += 1;
      const before = germanWordGloss(token.text);
      const after = asNoun(token.text);
      if (before && !after) lost.push(`${token.text} (had "${before}")`);
      if (before !== after && after) improved.add(token.text);
    });
  }
  check(`the sweep actually looked at something (${capitals} mid-sentence capitals)`, capitals > 500);
  check(`no word loses its gloss to the hint${lost.length ? ` — lost ${lost.slice(0, 5).join(", ")}` : ""}`,
    lost.length === 0);
  check(`the hint changes real answers, not just the named traps (${improved.size} words)`,
    improved.size >= 10);
}

// ── the opening word gets no hint ───────────────────────────────────────
// "Weiß ich nicht" opens with the verb; every German sentence opens with a
// capital, so treating that capital as evidence would break the common case
// to fix the rare one.
{
  const opener = glossedTokens("Weiß ich nicht.");
  check("the tokeniser marks the opening word as index 0", opener[0].text === "Weiß" && opener[0].word);
  check("a sentence-opening capital is not treated as a noun",
    /know/i.test(String(germanWordGloss("Weiß"))));
}

// ── one hover implementation, used by every surface that shows German ───
const shared = read("src/components/shared/GlossedGerman.tsx");
check("the shared component asks for the noun sense on mid-sentence capitals",
  /midSentenceCapital = index > 0 && \/\^\\p\{Lu\}\/u\.test\(token\.text\)/.test(shared));
check("a line's own glossary still beats the word lookup",
  shared.indexOf("glosses?.[token.text]") < shared.indexOf("germanWordGloss(token.text"));
check("words with no gloss get no affordance — an underline leading nowhere is worse than none",
  /cn\("gloss-word", gloss && "has-gloss"\)/.test(shared));
check("the gloss is reachable by keyboard, not hover alone",
  /tabIndex=\{gloss \? 0 : undefined\}/.test(shared) && /aria-label=\{gloss \?/.test(shared));

const listen = read("src/components/listen/ListenView.tsx");
check("Listen renders its sentence through the shared component",
  /<GlossedGerman text=\{item\.de\} \/>/.test(listen));

const passages = read("src/components/passages/PassagesView.tsx");
check("Passages uses the same one rather than its own copy",
  /<GlossedGerman text=\{entry\.de\} glosses=\{entry\.glosses\} \/>/.test(passages));
check("and no longer carries a second hover implementation",
  !passages.includes("data-gloss"));

const guided = read("src/GuidedSession.tsx");
check("the lesson's tappable words pass the hint too",
  /germanWordGloss\(w, \{ midSentenceCapital: i > 0 && \/\^\\p\{Lu\}\/u\.test\(w\) \}\)/.test(guided));
check("the reorder stage judges by the sentence, not by where the shuffle put the tile",
  /token\.text !== String\(item\.de\)\.trim\(\)\.split\(\/\\s\+\/\)\[0\]/.test(guided));

const styles = read("src/index.css");
check("a hoverable word is marked as one",
  /\.gloss-word\.has-gloss \{[\s\S]{0,200}?border-bottom: 1px dotted/.test(styles));
check("and the gloss reaches the screen",
  /\.gloss-word\.has-gloss::after[\s\S]{0,120}?content: attr\(data-gloss\)/.test(styles));

if (failures) {
  console.error(`\ncheck-word-hovers: ${failures} failed`);
  process.exit(1);
}
console.log("\ncheck-word-hovers: a capitalised word mid-sentence glosses as the noun it is, "
  + "no word lost a meaning to the change, and one hover implementation serves every surface");
