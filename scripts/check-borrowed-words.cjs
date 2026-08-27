#!/usr/bin/env node
/**
 * A German word quoted in an English line is said in German — and nothing else is.
 *
 * "Der Kühlschrank. Der, not das!" and "Der, die or das?" are English
 * sentences with German words standing in them. Read by the English voice,
 * the card teaching the articles is the one mispronouncing them.
 *
 * The danger is entirely in the other direction. "die" is an ordinary English
 * word, and "to die", "one die", "die down" and "What did he die of?" are all
 * real cards in this course. A rule that went by spelling would say those in
 * German, which is a worse fault than the one it set out to fix — so this
 * checks the whole catalogue, not just the three cards it is meant to help.
 *
 * The rule under test has two parts: a word must appear on the card's own
 * German side, AND at least one such word must be unmistakably German. The
 * second part is what keeps "I am in the city" beside "Ich bin in der Stadt"
 * from turning its "in" German.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: [
      'export { borrowedWordSegments } from "./src/lib/borrowedWords.ts";',
      'export { buildListenSpeechPlan, buildListenQueue } from "./src/lib/listenMode.ts";',
      'export { allPartBlueprints } from "./src/lib/data.ts";',
      'export { buildApiPartFromResolved } from "./src/lib/api.ts";',
      'export { buildBundledParts, filterPartsForLearningDirection } from "./src/lib/contentBank.ts";',
      'export { loadGradeStore } from "./src/lib/activity.ts";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "borrowed-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true, format: "cjs", platform: "node", target: "node20", write: false, logLevel: "silent",
});

const stored = new Map();
global.window = {
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => { stored.set(key, String(value)); },
    removeItem: (key) => { stored.delete(key); },
  },
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
};
global.localStorage = global.window.localStorage;

const compiled = new Module("borrowed-check", module);
compiled.filename = path.join(root, ".borrowed-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const { borrowedWordSegments, buildListenSpeechPlan, buildListenQueue, allPartBlueprints,
  buildApiPartFromResolved, buildBundledParts, filterPartsForLearningDirection,
  loadGradeStore } = compiled.exports;

const EN = "en-GB";
const DE = "de-DE";
const langs = (segments) => segments.map((s) => s.lang);
const said = (segments, lang) => segments.filter((s) => s.lang === lang).map((s) => s.text.trim()).join(" ");

// ── the cards this exists for ───────────────────────────────────────────────
{
  const segments = borrowedWordSegments("Der, die or das?", "Der, die oder das?", EN, DE);
  assert.ok(segments.some((s) => s.lang === DE), "the card naming the three articles is read entirely in English");
  assert.ok(/der/i.test(said(segments, DE)) && /die/i.test(said(segments, DE)) && /das/i.test(said(segments, DE)),
    `all three articles should be German, got German="${said(segments, DE)}" English="${said(segments, EN)}"`);
  assert.ok(/\bor\b/.test(said(segments, EN)), "the English word 'or' was handed to the German voice");
}
{
  const segments = borrowedWordSegments("Der Kühlschrank. Der, not das!", "Der Kühlschrank. Der, nicht das!", EN, DE);
  assert.ok(/\bnot\b/.test(said(segments, EN)), "'not' was handed to the German voice");
  assert.ok(/kühlschrank/i.test(said(segments, DE)), "the German noun was left to the English voice");
}
{
  // Mostly English, two German words at the front — the split has to work
  // even when the quoted German is a minority of the line.
  const segments = borrowedWordSegments("Der Kühlschrank. Did I say that right?", "Der Kühlschrank. Hab ich das richtig gesagt?", EN, DE);
  assert.ok(/kühlschrank/i.test(said(segments, DE)), "the quoted German was not picked out");
  assert.ok(/did i say that right/i.test(said(segments, EN)), "the English question was not left in English");
}

// ── and the cards it must not touch ─────────────────────────────────────────
for (const [en, de] of [
  ["to die", "sterben"],
  ["one die", "der Würfel"],
  ["to die down", "abflauen"],
  ["My battery is about to die.", "Mein Akku ist gleich leer."],
  ["What did he die of?", "Woran ist er gestorben?"],
  ["I am in the city.", "Ich bin in der Stadt."],
  ["He was in the garden.", "Er war im Garten."],
]) {
  const segments = borrowedWordSegments(en, de, EN, DE);
  assert.deepStrictEqual(langs(segments), [EN],
    `"${en}" was split for the German voice, and it is ordinary English — German got "${said(segments, DE)}"`);
}

// ── nothing in the whole catalogue is caught by accident ────────────────────
// The three cards above are the only ones this may change. Anything else is a
// mispronunciation this introduced rather than fixed.
const blueprint = {};
for (const [key, bp] of Object.entries(allPartBlueprints)) {
  try { blueprint[key] = buildApiPartFromResolved(bp, {}); } catch { /* as the app does */ }
}
const parts = filterPartsForLearningDirection(
  { ...blueprint, ...buildBundledParts("learn-de") }, "learn-de");
const queue = buildListenQueue(parts, loadGradeStore(null),
  { contentSource: "mixed", order: "common", direction: "learn-de" });
assert.ok(queue.length > 15000, `the queue did not build (${queue.length} items)`);

const changed = [];
for (const item of queue) {
  if (!item?.en || !item?.de) continue;
  const segments = borrowedWordSegments(item.en, item.de, EN, DE);
  if (segments.some((segment) => segment.lang === DE)) changed.push({ de: item.de, en: item.en, german: said(segments, DE) });
}
assert.ok(changed.length > 0, "nothing at all is affected, so the rule never fires on real content");

/**
 * The real guard is not how MANY cards fire, but whether any of them hands
 * ordinary English to the German voice.
 *
 * A count was the first thing tried here and it was the wrong instrument. The
 * rule legitimately fires on more than the three article cards: German
 * surnames (Müller), street names (Goethestraße), dishes (Leberkäse) and
 * sign-offs quoted whole ("Mit freundlichen Grüßen") are all German words
 * standing in English sentences, and all of them were being mispronounced
 * too. Capping the count would have meant refusing correct behaviour.
 *
 * So every word going to the German voice is checked against the English
 * words that could plausibly reach it. "was" is on this list because it did:
 * "What exactly was unclear?" beside "Was genau war unklar?" shares it, and
 * the auxiliary was being read in German.
 */
const ENGLISH_WORDS = [
  "was", "war", "will", "hat", "has", "had", "is", "are", "the", "and", "or",
  "not", "but", "in", "on", "at", "to", "of", "a", "an", "so", "man", "den",
  "standard", "die", "hall", "arm", "hand", "band", "rat", "boot", "brief",
  "gift", "list", "mist", "rock", "tag", "kind", "link", "mode", "fast", "see",
];
// Not "does it look German" — that was tried and it refused "Because 'become'
// means werden.", where the German verb is the entire point of the card and
// carries neither an umlaut nor an article. What matters is the other
// direction: whether anything English got swept up.
for (const card of changed) {
  assert.ok(String(card.german).trim().length > 0,
    `"${card.en}" produced an empty German segment`);
  for (const word of String(card.german).toLowerCase().match(/[\p{L}][\p{L}\p{M}]*/gu) ?? []) {
    if (/[äöüß]/.test(word)) continue;
    // The three articles are the whole point of the feature, so they are the
    // one place an English-looking word may cross over.
    if (["der", "die", "das", "dem", "des", "mit", "und", "nicht", "oder"].includes(word)) continue;
    assert.ok(!ENGLISH_WORDS.includes(word),
      `"${card.en}" hands the ordinary English word "${word}" to the German voice `
      + `(German got "${card.german}")`);
  }
}

// ── and the player actually says it that way ────────────────────────────────
// The rule is worth nothing if the plan that reaches the voice ignores it.
const plan = buildListenSpeechPlan({
  de: "Der, die oder das?",
  en: "Der, die or das?",
  targetRepeats: 1,
  meaningRepeats: 1,
  languageOrder: "target-first",
  meaningLang: EN,
  targetLang: DE,
  languageGapMs: 900,
});
const meaningSide = plan.filter((clip) => clip.side === "meaning");
assert.ok(meaningSide.length > 1,
  "the meaning side is still one clip, so the whole line goes to one voice however it was split");
assert.ok(meaningSide.some((clip) => clip.lang === DE), "no part of the English side reaches the German voice");
assert.ok(meaningSide.some((clip) => clip.lang === EN), "the whole English side was handed to the German voice");
// The pause is the learner's turn, and there is one of it.
assert.strictEqual(plan.filter((clip) => clip.pauseBeforeMs).length, 1,
  "splitting the English side multiplied the pause, so the card now waits between fragments");
assert.strictEqual(plan.find((clip) => clip.pauseBeforeMs), meaningSide[0],
  "the pause moved off the point where the card changes language");

// A repeat repeats the whole line, not one fragment of it.
const twice = buildListenSpeechPlan({
  de: "Der, die oder das?", en: "Der, die or das?",
  targetRepeats: 1, meaningRepeats: 2,
  languageOrder: "target-first", meaningLang: EN, targetLang: DE, languageGapMs: 0,
});
assert.strictEqual(twice.filter((clip) => clip.side === "meaning").length, meaningSide.length * 2,
  "asking for the English twice no longer says the whole line twice");

// An ordinary card is untouched: one clip per side, as before.
const ordinary = buildListenSpeechPlan({
  de: "Ich bin in der Stadt.", en: "I am in the city.",
  targetRepeats: 1, meaningRepeats: 1,
  languageOrder: "target-first", meaningLang: EN, targetLang: DE, languageGapMs: 900,
});
assert.strictEqual(ordinary.length, 2, "an ordinary card no longer plays as two clips");
assert.strictEqual(ordinary[1].lang, EN, "an ordinary English line was handed to the German voice");

console.log(
  `check-borrowed-words: ${changed.length} card(s) quote German inside their English and are read `
  + "that way, every one of them recognisably German; ordinary English — 'to die', 'one die', "
  + "'in the city' — is left alone, and the pause still falls once, where the card changes language"
);
process.exit(0);
