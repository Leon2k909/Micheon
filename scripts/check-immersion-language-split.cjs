#!/usr/bin/env node
/**
 * Reading English is not the same as reading German, and the collector has to
 * know which one it just saw.
 *
 * The page-level German test asks "does this page look German", and a feed
 * mixing languages answers yes. Everything on it was then collected as German
 * vocabulary: on a real export, 123 of 346 entries came off English sentences
 * — "trustworthiness", "somebody", "redesign" — filed as German words the app
 * had failed to teach. Nothing about that is visible in the extension. The
 * list just quietly fills with words that are not German.
 *
 * The sentence-level test that should have caught it could only vote yes. It
 * counted tokens the glossary holds, and the glossary holds "in", "was",
 * "will", "hat", "man", "so", "die", "boot", "kind", "band" and "fast" —
 * every one an ordinary English word too. Two show up in almost any English
 * sentence, so English text cleared a bar meant to prove German.
 *
 * English text is still worth reading, though: an English word the app has no
 * German for is a gap in the course pointed at from the other side. So it is
 * kept — in a bucket of its own, never mixed into the German one.
 *
 * This runs the real content script over real sentences from a real export
 * and asserts which bucket each word landed in.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const extension = path.join(root, "public", "micheon-immersion-extension");
const glossSource = fs.readFileSync(path.join(extension, "src", "content-gloss.js"), "utf8");
const words = fs.readFileSync(path.join(extension, "data", "words.json"), "utf8");

class FakeHighlight extends Set {}

// Straight out of the 2026-08-25 export, unedited.
// Quoted exactly. Truncating them is what makes this fixture stop working:
// the first sentence only leaked because it ends on "problem", which is a
// German word too, and that was the second of the two weak signals that made
// an English sentence read as German.
const ENGLISH_TEXT = [
  "GPT 5.6 Sol is second with the strongest backend and reasoning balance in the lineup but has a serious trustworthiness problem.",
  "I know plenty of people who are not casual users at all. They are extremely advanced users who pay $20 for ChatGPT Plus simply because they cannot afford more.",
  "The weakness I see in Micheon right now is that learners can become quite good at recognising written German without necessarily becoming good at producing it.",
  "Nearly 500,000 players joined the WARDOGS beta, according to game director Howard Philpott.",
  "Migrants in an Essex asylum camp are given free mobile phones and a snack box.",
];
// Also quoted from the export. Herbsthaushalt and Auslandshilfebudget are
// left out of the course on purpose — too narrow to teach — which is what
// makes them dependable fixtures: a word the course adopts stops being
// reported, so pinning a taught one would rot the moment it is taught.
const GERMAN_TEXT = [
  "NACHRICHT: Andy Burnham plant Steuererhöhungen für den Herbsthaushalt. Dies geschieht nachdem er auch Pläne vorgestellt hat, das Auslandshilfebudget um 13 Milliarden Pfund zu erhöhen.",
  "Präsident Trump sagt, die USA erwägen ernsthaft, den Lake Ontario umzubenennen.",
  "Heute gebe ich einem alten Dell Inspiron ein zweites Leben, denn er ist noch schnell genug.",
];

async function collect(lang, url, paragraphs) {
  const body = paragraphs
    .map((p) => `<article><div data-testid="tweetText">${p}</div></article>`).join("\n");
  const dom = new JSDOM(
    `<!doctype html><html lang="${lang}"><body><main id="feed">${body}</main></body></html>`,
    { url, runScripts: "outside-only", pretendToBeVisual: true }
  );
  const { window } = dom;
  let german = {};
  let english = {};
  let lastWrite = 0;
  window.Highlight = FakeHighlight;
  window.CSS = { highlights: { set() {}, get: () => new Set() } };
  window.fetch = async () => ({ json: async () => JSON.parse(words) });
  window.chrome = {
    runtime: { getURL: () => "data/words.json", sendMessage: () => Promise.resolve(), onMessage: { addListener() {} } },
    storage: {
      local: {
        get: async (keys) => {
          const asked = Array.isArray(keys) ? keys : [keys];
          const out = {};
          if (asked.includes("settings")) {
            out.settings = { glossEnabled: true, collectMissingVocab: true, ttsOnHover: false, ttsOnClick: false };
          }
          if (asked.includes("missingVocab")) out.missingVocab = german;
          if (asked.includes("missingEnglish")) out.missingEnglish = english;
          return out;
        },
        set: async (patch) => {
          if (patch.missingVocab) german = patch.missingVocab;
          if (patch.missingEnglish) english = patch.missingEnglish;
          if (patch.missingVocab || patch.missingEnglish) lastWrite = Date.now();
        },
        remove: async () => {},
      },
      onChanged: { addListener() {} },
    },
  };
  window.eval(glossSource);
  // The collector debounces its write, so this waits for the write rather
  // than for a duration. A fixed sleep sized against FLUSH_DELAY_MS passes on
  // a fast machine and fails on a slow one, which is a check that reports the
  // build agent's load as a bug in the extension.
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    // Settled: a write landed and nothing followed it for two seconds.
    if (lastWrite && Date.now() - lastWrite > 2000) break;
  }
  assert.ok(lastWrite, "the collector never wrote anything at all in 60s — the harness is not scanning");
  return { german: Object.keys(german), english: Object.keys(english) };
}

async function main() {
  // ── English text collects no German ───────────────────────────────────────
  // Both on a page that declares English and on one that declares German: a
  // German news page quoting an English press release is the ordinary case,
  // and lang="de" must not turn that quote into German vocabulary.
  for (const [lang, url] of [["en", "https://x.com/home"], ["de", "https://beispiel.de/artikel"]]) {
    const seen = await collect(lang, url, ENGLISH_TEXT);
    assert.deepStrictEqual(seen.german, [],
      `English sentences on a lang="${lang}" page were collected as German words: ${seen.german.join(", ")}`);

    // ...and are kept as the demand signal they are. Deliberately not pinned
    // to particular words: the moment the course learns one, the glossary
    // answers it and it stops being reported, which is this whole mechanism
    // working. What must hold is that English text still produces a report.
    assert.ok(seen.english.length >= 3,
      `English text produced only ${seen.english.length} reported gaps — the demand signal is off, `
      + "and a reader on an English feed now tells us nothing");
    for (const word of seen.english) {
      assert.ok(/^[a-z][a-z-]{3,}$/.test(word), `"${word}" is not a word worth reporting as a gap`);
    }
    // Names are not vocabulary in either language.
    for (const name of ["howard", "philpott", "micheon", "essex", "wardogs"]) {
      assert.ok(!seen.english.includes(name) && !seen.german.includes(name),
        `"${name}" is a name and was collected as a word to learn`);
    }
  }

  // ── German text still collects German ─────────────────────────────────────
  const seen = await collect("de", "https://beispiel.de/artikel", GERMAN_TEXT);
  for (const word of ["herbsthaushalt", "auslandshilfebudget"]) {
    assert.ok(seen.german.includes(word),
      `"${word}" is a German noun, was read on a German page, is not taught, and was not collected — `
      + "either the English veto is over-firing or the name filter is eating ordinary nouns");
  }
  // The same sentences carry names, and German capitalises every noun — so a
  // name rule built on capitalisation would take Herbsthaushalt and
  // Auslandshilfebudget with it. Both halves are asserted together on
  // purpose: passing one while failing the other is the actual danger.
  for (const name of ["andy", "burnham", "trump", "ontario", "dell", "inspiron"]) {
    assert.ok(!seen.german.includes(name), `the name "${name}" was collected as German vocabulary`);
  }

  // ── and the two stay apart all the way to the export ──────────────────────
  const popup = fs.readFileSync(path.join(extension, "src", "popup.js"), "utf8");
  assert.ok(popup.includes('rank(missingVocab, "de")') && popup.includes('rank(missingEnglish, "en")'),
    "the export does not label which language each word was read in, so the two lists merge into one");
  assert.ok(popup.includes('remove(["missingVocab", "missingEnglish"])'),
    "clearing the list leaves the English half behind, so it can never be emptied");

  console.log(
    `check-immersion-language-split: English text yields ${0} German words and reports its own gaps, `
    + "German text still yields German, and names are collected in neither"
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
