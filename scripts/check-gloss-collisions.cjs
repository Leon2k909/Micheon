#!/usr/bin/env node
/**
 * An English prompt must name the German verb it wants.
 *
 * The learner is shown English and asked to produce German, so a short prompt
 * that is ALSO the prompt for a different German verb is unanswerable — not
 * hard, unanswerable, because nothing on screen says which one is wanted.
 *
 * Found in the wild by Leon: "Ich verstehe." was glossed "I see.", while the
 * same course teaches "Das seh ich anders." for "I see it differently." and
 * "Ich sehe das." for "I see it that way.". His words: "i understand is
 * better, no? i see is the same but ich seh is gonna get confused surely?"
 * The pack made it worse than a general risk — the card directly below it
 * already read "I don't understand.", so the positive and the negative of one
 * verb were glossed with two different English verbs.
 *
 * Two shapes are checked, both restricted to prompts of four words or fewer,
 * where the prompt IS the whole clue and there is no context to disambiguate:
 *
 *   exact   two cards, same English prompt, German that shares no content word
 *   prefix  a standalone short prompt that also opens a longer card's prompt,
 *           again with unrelated German
 *
 * Overlaps that are fine are named in ALLOWED below rather than quietly
 * skipped: an explicit list can be argued with, a loosened rule cannot.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.join(__dirname, "..");

global.window = {
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  dispatchEvent: () => true,
  addEventListener() {},
  removeEventListener() {},
};
global.localStorage = global.window.localStorage;

const built = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildApiPartFromResolved } from "./src/lib/api.ts";
      export { buildCatalog } from "./src/session.ts";
    `,
    resolveDir: root,
    sourcefile: "gloss-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});
const mod = new Module(path.join(root, "check-gloss.entry.cjs"), module);
mod.paths = Module._nodeModulePaths(root);
mod._compile(built.outputFiles[0].text, path.join(root, "check-gloss.entry.cjs"));
const { allPartBlueprints, buildApiPartFromResolved, buildCatalog } = mod.exports;

/**
 * Overlaps reviewed and kept, with the reason. These are register or wording
 * variants of ONE meaning — the learner who answers with the other card's
 * German has not misunderstood anything. A wrong-verb trap never belongs here.
 */
const ALLOWED = new Set([
  // exact: same English prompt on two cards
  "anything else",  // polite "Sonst noch etwas?" against casual "Noch was?"
  "i want you",     // "Ich will dich." against the warmer "Ich hab Lust auf dich."
  "i think so",     // glauben and denken are interchangeable in this reply
  // prefix: short prompt that also opens a longer one
  "Noch was?|Noch etwas dazu?",             // register again, same question
  "Ich weiß.|Das Lied kenn ich!",           // wissen/kennen, and the card's own note teaches the split
  "Ich weiß.|Das kenn ich.",                // same pair, same note
  "Es ist gut.|Kein Problem, wirklich.",    // free translation of a reassurance, both natural
  "Was ist das?|Wie heißt das Ding da?",    // "What's that?" still answers to "Was ist das?"
  "Was ist das?|Wozu dient das?",           // ditto
  "Was ist das?|Wie heißt das?",            // ditto
]);

const parts = {};
for (const [key, blueprint] of Object.entries(allPartBlueprints)) {
  try { parts[key] = buildApiPartFromResolved(blueprint, {}); } catch { /* as the app does */ }
}

const promptWords = (text) => String(text)
  .toLowerCase()
  .replace(/[^a-z\s']/g, " ")
  .split(/\s+/)
  .filter(Boolean);

// Content words only: the pronouns and articles two unrelated sentences share
// say nothing about whether they mean the same thing.
const GERMAN_FRAME = /^(ich|du|er|sie|es|wir|ihr|das|der|die|den|dem|ein|eine|nicht|mal|noch|schon|und|aber|mir|mich|dir|dich|sich)$/;
const germanContent = (text) => String(text)
  .toLowerCase()
  .replace(/[^a-zäöüß\s]/g, " ")
  .split(/\s+/)
  .filter((word) => word.length > 2 && !GERMAN_FRAME.test(word));

// Prefix-matched, so "verstehe" and "versteh" count as the same verb but
// "versteh" and "seh" do not.
const related = (a, b) =>
  a.content.some((word) => b.content.some((other) => other.slice(0, 4) === word.slice(0, 4)));

const items = buildCatalog(parts)
  .filter((item) => !String(item.en).includes("/"))
  .map((item) => ({
    de: String(item.de),
    en: String(item.en),
    words: promptWords(item.en),
    content: germanContent(item.de),
  }))
  .filter((item) => item.words.length >= 1 && item.words.length <= 4 && item.content.length > 0);

const byPrompt = new Map();
for (const item of items) {
  const key = item.words.join(" ");
  if (!byPrompt.has(key)) byPrompt.set(key, []);
  byPrompt.get(key).push(item);
}

const failures = [];

for (const [prompt, group] of byPrompt) {
  if (ALLOWED.has(prompt)) continue;
  const clash = group.find((a) => group.find((b) => a.de !== b.de && !related(a, b)));
  if (!clash) continue;
  const germans = [...new Set(group.map((g) => g.de))];
  failures.push(`"${clash.en}" is the prompt for ${germans.slice(0, 3).join(" and ")} — nothing on screen says which`);
}

for (const [short, shortGroup] of byPrompt) {
  if (short.split(" ").length > 2) continue;
  for (const [long, longGroup] of byPrompt) {
    if (!long.startsWith(short + " ")) continue;
    for (const a of shortGroup) {
      for (const b of longGroup) {
        if (related(a, b) || ALLOWED.has(`${a.de}|${b.de}`)) continue;
        failures.push(`"${a.en}" -> ${a.de}, but "${b.en}" -> ${b.de} — the short prompt reads as the long one`);
      }
    }
  }
}

if (failures.length) {
  console.error("FAIL check-gloss-collisions");
  [...new Set(failures)].forEach((line) => console.error("  " + line));
  console.error("\nGloss the German the prompt actually wants, or add the pair to ALLOWED with a reason.");
  process.exit(1);
}

assert.ok(items.length > 500, "the short-prompt catalogue is empty, so this check proves nothing");
console.log(`check-gloss-collisions: ${items.length} short prompts each name the German they want`);
