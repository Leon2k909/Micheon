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
const { germanWordGloss, bank } = compiled.exports;

// The component splits on whitespace and strips punctuation at lookup time,
// so the sweep below has to count words the same way it does.
const bareWord = (word) => word.replace(/[.,!?;:"«»„“()]/g, "");
const sentenceWords = (line) => String(line ?? "").trim().split(/\s+/).filter(Boolean);

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
    sentenceWords(sentence).forEach((word, index) => {
      if (!(index > 0 && /^\p{Lu}/u.test(word))) return;
      capitals += 1;
      const before = germanWordGloss(word);
      const after = asNoun(word);
      if (before && !after) lost.push(`${word} (had "${before}")`);
      if (before !== after && after) improved.add(bareWord(word));
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
  const opener = sentenceWords("Weiß ich nicht.");
  check("the opening word is the one at index 0", opener[0] === "Weiß");
  check("a sentence-opening capital is not treated as a noun",
    /know/i.test(String(germanWordGloss("Weiß"))));
}

// ── one hover implementation, used by every surface that shows German ───
// A plain tooltip was tried in Listen first and was the wrong answer: it could
// say what a word meant and then leave the learner with nowhere to put it.
// Every surface now shows the same popover — meaning, Hear it, Practice this
// word — so there is one thing to get right rather than three.
const shared = read("src/components/shared/TappableSentence.tsx");
check("the shared component asks for the noun sense on mid-sentence capitals",
  /midSentenceCapital: i > 0 && \/\^\\p\{Lu\}\/u\.test\(w\)/.test(shared));
check("a line's own glossary still beats the word lookup",
  /const lineGloss = glosses\?\.\[w\]/.test(shared)
  && shared.indexOf("const lineGloss") < shared.indexOf("const hoverGloss"));
check("the popover offers the two things a learner wants next",
  /\{ui\("Hear it"\)\}/.test(shared) && /\{ui\("Practice this word"\)\}/.test(shared));
check("a word already kept says so instead of offering to keep it twice",
  /popoverSaved \? \([\s\S]{0,200}?In your words/.test(shared));
check("the popover is reachable without a pointer",
  /tabIndex=\{0\}/.test(shared) && /onKeyDown=/.test(shared) && /onContextMenu=/.test(shared));
check("speaking a word can be announced, so a surface already playing can stand down",
  /onWordAudio\?\.\(\);/.test(shared));

const listen = read("src/components/listen/ListenView.tsx");
check("Listen renders its sentence through the shared component",
  /<TappableSentence text=\{item\.de\} lang="de-DE" meaningText=\{item\.en\} onWordAudio=\{pause\} \/>/.test(listen));
check("and tapping a word pauses the loop rather than talking over it",
  /onWordAudio=\{pause\}/.test(listen));

const passages = read("src/components/passages/PassagesView.tsx");
check("Passages uses the same one rather than its own copy",
  /<TappableSentence text=\{entry\.de\} lang="de-DE" glosses=\{entry\.glosses\} \/>/.test(passages));
check("and no longer carries a second hover implementation",
  !passages.includes("data-gloss"));

const guided = read("src/GuidedSession.tsx");
check("the lesson imports the component instead of keeping its own",
  /import \{ TappableSentence \} from "@\/components\/shared\/TappableSentence";/.test(guided)
  && !guided.includes("function TappableSentence("));
check("the reorder stage judges by the sentence, not by where the shuffle put the tile",
  /token\.text !== String\(item\.de\)\.trim\(\)\.split\(\/\\s\+\/\)\[0\]/.test(guided));

// ── and it has to be visible outside a lesson ───────────────────────────
// Every one of these styles was scoped to .guided-session, and the --fs-*
// palette they use is only defined there. Un-widened, the popover renders in
// Listen as unstyled text on no background — the silent way CSS fails.
const styles = read("src/index.css");
check("the popover styles apply wherever the component renders",
  /:is\(\.guided-session, \.fs-tappable-sentence\) \.fs-word-popover \{/.test(styles));
check("so do the word and its anchor",
  /:is\(\.guided-session, \.fs-tappable-sentence\) \.fs-word \{/.test(styles)
  && /:is\(\.guided-session, \.fs-tappable-sentence\) \.fs-word-anchor \{/.test(styles));
check("and the buttons inside it",
  /:is\(\.guided-session, \.fs-tappable-sentence\) \.fs-word-popover-btn \{/.test(styles));
{
  // No --fs- token may be referenced bare in these rules: outside a lesson it
  // resolves to nothing and the colour simply does not happen.
  const blocks = [...styles.matchAll(/^:is\(\.guided-session, \.fs-tappable-sentence\)[\s\S]*?\n\}/gmu)];
  const bare = blocks.flatMap((block) => [...block[0].matchAll(/var\((--fs-[a-z0-9-]+)\)(?!\s*,)/gu)].map((m) => m[1]));
  check(`every lesson-palette token has a theme fallback${bare.length ? ` — bare: ${[...new Set(bare)].join(", ")}` : ""}`,
    blocks.length > 5 && bare.length === 0);

  // And the fallback has to be a theme token, not a literal. --fs-surface
  // once fell back to #fff, which painted a white panel under near-white
  // text — perfectly visible in a light lesson, invisible in the dark app
  // where Listen and the passages actually live.
  const literalFallbacks = blocks.flatMap((block) =>
    [...block[0].matchAll(/var\((--fs-[a-z0-9-]+),\s*(#[0-9a-f]{3,8}|rgb|hsl)/giu)].map((m) => m[1]));
  check(`no lesson-palette token falls back to a hardcoded colour${literalFallbacks.length ? ` — ${[...new Set(literalFallbacks)].join(", ")}` : ""}`,
    literalFallbacks.length === 0);
}
check("the lesson's own dark skin still out-specifies the shared rules",
  styles.includes(".guided-session.fs-app.prototype-guided-session .fs-word"));

if (failures) {
  console.error(`\ncheck-word-hovers: ${failures} failed`);
  process.exit(1);
}
console.log("\ncheck-word-hovers: a capitalised word mid-sentence glosses as the noun it is, "
  + "no word lost a meaning to the change, and one hover implementation serves every surface");
