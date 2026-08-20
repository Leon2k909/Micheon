#!/usr/bin/env node
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");
const { exampleRank } = require("./gloss-support.cjs");

const root = path.resolve(__dirname, "..");
const extension = path.join(root, "public", "micheon-immersion-extension");
const archive = path.join(root, "public", "micheon-immersion-extension.zip");
const read = (relativePath) => fs.readFileSync(path.join(extension, relativePath), "utf8");
const manifest = JSON.parse(read("manifest.json"));
const words = JSON.parse(read("data/words.json"));
const gloss = read("src/content-gloss.js");
const popup = read("src/popup.js");
const offscreen = read("src/offscreen.js");
const background = read("src/background.js");
const popupScript = read("src/popup.js");
const desktopMain = fs.readFileSync(path.join(root, "electron", "main.js"), "utf8");
const desktopPreload = fs.readFileSync(path.join(root, "electron", "preload.cjs"), "utf8");
const settingsCard = fs.readFileSync(path.join(root, "src", "components", "BrowserExtension.tsx"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

/**
 * The reverse index, built by running the extension's own builder.
 *
 * There were two hand-written copies of these rules in this file. A copy of
 * the rules is a test of the copy: both drifted the moment the real index
 * learned about plurals, alternative names and verbs, and kept passing.
 */
function buildReverseIndex(glossary) {
  const cut = (from, to) => {
    const at = gloss.indexOf(from);
    const end = gloss.indexOf(to, at);
    assert.ok(at >= 0 && end > at, `could not isolate ${from.trim()}`);
    return gloss.slice(at, end);
  };
  const context = { byEn: new Map(), byDeExact: new Map(), byDeLowerAny: new Map() };
  vm.runInNewContext(
    cut("  function buildIndexes(words) {", "  const ENGLISH_S_WORDS")
    + cut("  const ENGLISH_S_WORDS = new Set([", "  const STOPWORDS")
    + "\nthis.build = buildIndexes;\nthis.singular = englishSingularEntry;",
    context,
    { filename: "content-gloss-reverse.js" }
  );
  context.build(glossary);
  return {
    byEn: context.byEn,
    reaches(english) {
      const hit = context.byEn.get(english) || context.singular(english);
      return hit ? hit.deDisplay : null;
    },
  };
}

function loadGlossTextFilters() {
  const start = gloss.indexOf("  const WORD_RE =");
  const end = gloss.indexOf("  function detectGerman", start);
  assert(start >= 0 && end > start, "could not isolate Immersion text-filter helpers");
  const source = `${gloss.slice(start, end)}\nthis.__filters = { excludedTextRanges, overlapsExcludedRange, candidateAppearsOutsideExcludedText };`;
  const context = {
    window: { requestIdleCallback: null, setTimeout },
    location: { hostname: "x.com" },
  };
  vm.runInNewContext(source, context, { filename: "content-gloss-text-filters.js" });
  return context.__filters;
}

// Every main push is an updater release. In CI, refuse to publish changed
// extension files under an old extension or app version: otherwise Brave can
// keep showing an indistinguishable stale unpacked build and the desktop
// autoupdater has no newer Micheon package through which to deliver it.
if (process.env.CI) {
  try {
    const parent = execFileSync("git", ["rev-parse", "HEAD^"], { cwd: root, encoding: "utf8" }).trim();
    const changed = execFileSync(
      "git",
      ["diff", "--name-only", parent, "HEAD", "--", "public/micheon-immersion-extension", "public/micheon-immersion-extension.zip"],
      { cwd: root, encoding: "utf8" }
    ).trim();
    if (changed) {
      const previousManifest = JSON.parse(execFileSync(
        "git", ["show", `${parent}:public/micheon-immersion-extension/manifest.json`],
        { cwd: root, encoding: "utf8" }
      ));
      const previousPackage = JSON.parse(execFileSync(
        "git", ["show", `${parent}:package.json`],
        { cwd: root, encoding: "utf8" }
      ));
      assert.notEqual(manifest.version, previousManifest.version,
        "extension files changed without advancing the extension version");
      assert.notEqual(packageJson.version, previousPackage.version,
        "extension files changed without an app release version to deliver them");
    }
  } catch (error) {
    if (error instanceof assert.AssertionError) throw error;
    console.warn(`Skipped extension release-version comparison: ${error.message}`);
  }
}

assert(/^0\.3\.[1-9]\d*$/.test(manifest.version), "the extension version was not advanced past 0.3.0");
for (const size of ["16", "32", "48", "128"]) {
  const icon = manifest.icons?.[size];
  assert(icon && fs.existsSync(path.join(extension, icon)), `missing Micheon ${size}px manifest icon`);
  assert.equal(manifest.action?.default_icon?.[size], icon, `toolbar icon ${size}px does not use the Micheon logo`);
}
assert(fs.existsSync(archive) && fs.statSync(archive).size > 100_000,
  "the downloadable Micheon Immersion archive is missing or unexpectedly small");
// maxBuffer, because words.json outgrew the 1 MB default the moment example
// sentences were added to it. Without this the check dies with a spawnSync
// ENOBUFS that says nothing about the glossary at all.
const packedFile = (relativePath) => execFileSync(
  "tar",
  ["-xOf", archive, relativePath],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
);
assert.equal(packedFile("manifest.json"), read("manifest.json"),
  "the downloadable archive contains a stale extension manifest");
assert.equal(packedFile("data/words.json"), read("data/words.json"),
  "the downloadable archive contains a stale word catalogue");

assert(words.length >= 6340, `only ${words.length} extension glossary entries were exported`);
assert.equal(new Set(words.map((word) => word.id)).size, words.length, "duplicate glossary ids found");
assert.equal(new Set(words.map((word) => word.de.toLocaleLowerCase("de-DE"))).size, words.length,
  "duplicate German lemmas found in the extension glossary");
for (const lemma of [
  "Bild", "folgen", "echt", "reposten", "möchten", "darüber", "Geschwister",
  "Hitze", "irgendwie", "niemand", "schlau", "entkommen", "ernsthaft", "kaum",
  "danke", "bisschen", "Konversation", "mitten", "schlafen", "sofort", "explizit", "weiterhin",
  "Abschreckung", "Pressestelle", "Riss", "Verbot", "wieder", "worum",
  "posten", "meist", "jemals", "Anwendungsfall", "Internetgeschwindigkeit", "Gartenschlauch",
  "Mitteilung", "Startseite", "Premium-Abo", "kollektiv", "erbärmlich", "verabscheuen", "Großbritannien",
  "mehr", "Schweden", "schwedisch", "tot",
  "gegenüber", "draußen", "raus", "verrückt", "nie", "niemals", "nichts", "etwas", "dafür",
  "darauf", "jedoch", "mehrere", "weniger", "leise", "verdoppeln", "drängen", "Augenhöhe",
  "Benchmark", "Punktzahl", "Bildschirmgröße", "Rechenleistung", "Sicherheitsproblem",
  "Einwanderung", "Migrant", "Pressesprecherin", "Satellitenbild", "verzögern", "zurücktreten",
  "Deutschland", "Österreich", "Schweiz", "Versandkosten", "Lieferumfang", "Ratenkauf",
  "jederzeit", "weiterempfehlen", "kabelgebunden", "kabellos", "Schalter", "Zubehör",
  "Helligkeit", "Latenz", "Tastenkappe", "Handballenauflage", "plattformübergreifend",
]) {
  assert(words.some((word) => word.de === lemma), `${lemma} is missing from the Immersion glossary`);
}
assert.equal(words.find((word) => word.de === "versprechen")?.en, "to promise",
  "versprechen still teaches the less common reflexive meaning instead of to promise");
assert.equal(words.find((word) => word.de === "belegen")?.en, "to take a course",
  "belegen still exports one specialist academic sense as though it were the whole word");

assert(gloss.includes("HOVER_SPEAK_DELAY_MS") && gloss.includes("SAME_WORD_SPEAK_COOLDOWN_MS"),
  "hover speech is no longer debounced and deduplicated");
assert(gloss.includes("X_POST_SELECTOR") && gloss.includes("initX()")
  && gloss.includes("reconcileStoredCandidates()") && gloss.includes("examplesForMissing"),
  "X collection is no longer isolated to post text or resolved candidates are not reconciled");
assert(gloss.includes("X_REINFORCEMENT_SELECTORS") && gloss.includes("collectMissing = true")
  && gloss.includes("caseInsensitiveGerman: true") && !gloss.includes("|| document.body, true"),
  "X interface vocabulary is no longer reinforced separately from authored-text collection");
assert(gloss.includes("xPendingPosts") && gloss.includes("xPendingChrome")
  && gloss.includes("collectXTargets(added)") && gloss.includes("scanXPost(post)")
  && !gloss.includes("scanXRoot") && !gloss.includes("new MutationObserver(scheduleXScan)"),
  "X mutations trigger broad repeated scans instead of targeted tweet/nav batches");
assert(gloss.includes("unregisterGlosses") && gloss.includes("glossHighlight.delete(entry.range)")
  && gloss.includes("glossedTextNodes") && gloss.includes("pruneDetachedGlosses()"),
  "detached infinite-feed highlights are retained instead of being released");
assert(gloss.includes("requestAnimationFrame(runPointerHitTest)"),
  "hover range hit-testing is no longer capped to one pass per animation frame");
assert(gloss.includes("insideGlossableText") && gloss.includes("X_CHROME_SELECTOR")
  && gloss.includes("includeInteractive: true"),
  "X hover hit-testing is no longer confined to glossary text or navigation labels cannot be glossed");
assert(gloss.includes("const chromeRoot = scope.matches?.(X_CHROME_SELECTOR)")
  && gloss.includes("xPendingChrome.add(containingChrome)")
  && gloss.includes("walk(chromeRoot || root, true"),
  "capitalised X navigation labels such as Mehr and Entdecken are no longer sent through the safe case-folded pass");
const signalCounter = gloss.slice(
  gloss.indexOf("  function knownGermanSignalCount"),
  gloss.indexOf("  function commentLooksGerman"),
);
assert(signalCounter.includes("const signalWordRe") && !signalCounter.includes("WORD_RE.exec"),
  "nested German detection can corrupt the outer word iterator and hang on an unknown X word");
assert(gloss.includes("const processed = new WeakMap()") && gloss.includes("const passMask = collectMissing ? 2 : 1"),
  "reinforcement-only scans can suppress a later authored-text collection pass");
assert(gloss.includes("priorExamples.length > 0 && examples.length === 0"),
  "reconciliation no longer removes candidates backed only by non-German UI noise");
assert(gloss.includes("NON_VOCAB_SPAN_RE") && gloss.includes("overlapsExcludedRange")
  && gloss.includes("exampleSupportsCandidate(example, word)"),
  "handles, email addresses or URLs can leak into glosses and missing-vocabulary exports");
const textFilters = loadGlossTextFilters();
assert.equal(textFilters.candidateAppearsOutsideExcludedText("Frag @Mitteilungen nach.", "Mitteilungen"), false,
  "a word inside an X handle is still treated as vocabulary");
assert.equal(textFilters.candidateAppearsOutsideExcludedText("Mitteilungen von @name", "Mitteilungen"), true,
  "real text next to an X handle is incorrectly discarded");
assert.equal(textFilters.candidateAppearsOutsideExcludedText("https://x.com/mitteilungen", "mitteilungen"), false,
  "a URL fragment is still treated as vocabulary");
assert(popup.includes("reconcileCurrentCatalogue()") && popup.includes("examplesForEntry")
  && popup.includes("examples }"),
  "the popup no longer reconciles taught words or exports multiple real sentence examples");
assert(gloss.includes("offset >= entry.end") && gloss.includes("getClientRects()"),
  "adjacent word hit-testing can overlap at a range boundary");
assert(gloss.includes("OBSERVED_FORM_TO_LEMMA") && gloss.includes('"übersetzt": "übersetzen"'),
  "observed German forms are no longer resolved to their authored lemmas");
assert(gloss.includes('"mitteilungen": "Mitteilung"') && gloss.includes('"booste": "boosten"')
  && gloss.includes('"erbärmlichen": "erbärmlich"') && gloss.includes('"verabscheue": "verabscheuen"')
  && gloss.includes('"sammelt": "sammeln"') && gloss.includes('"schwedisches": "schwedisch"'),
  "common inflected interface words are no longer resolved to their authored lemmas");
const aliasBlock = gloss.slice(
  gloss.indexOf("  const OBSERVED_FORM_TO_LEMMA"),
  gloss.indexOf("  function findGermanEntry"),
);
const glossaryLemmas = new Set(words.map((word) => word.de.toLocaleLowerCase("de-DE")));
const brokenAliases = [];
const aliasKeys = [];
for (const match of aliasBlock.matchAll(/^\s*"([^"]+)":\s*"([^"]+)",?$/gm)) {
  const [, observed, lemma] = match;
  aliasKeys.push(observed);
  if (!glossaryLemmas.has(lemma.toLocaleLowerCase("de-DE"))) {
    brokenAliases.push(`${observed} -> ${lemma}`);
  }
}
const duplicateAliases = [...new Set(aliasKeys.filter((alias, index) => aliasKeys.indexOf(alias) !== index))];
assert.deepEqual(duplicateAliases, [], `Duplicate Immersion aliases: ${duplicateAliases.join(", ")}`);
assert.deepEqual(brokenAliases, [], `Immersion aliases with missing dictionary targets: ${brokenAliases.join(", ")}`);
for (const observed of ["bedeutende", "gleichen", "gesagt", "wäre", "gewinnt", "zurückgegeben"]) {
  assert(new RegExp(`"${observed}":`).test(aliasBlock), `${observed} is no longer linked to its dictionary form`);
}
for (const observed of ["sekunden", "versandkosten", "lieferumfang", "abnehmbare", "tastaturen", "einstellungen"]) {
  assert(new RegExp(`"${observed}":`).test(aliasBlock), `${observed} from the shopping/device export is no longer linked to its dictionary form`);
}
assert(offscreen.includes("playbackRequest") && offscreen.includes("stopCurrentPlayback()")
  && offscreen.includes("currentFetch?.abort()"),
  "overlapping TTS playback is no longer cancelled");
// Micheon's own voice or nothing. A system voice reciting German teaches a
// pronunciation the learner cannot tell apart from the real model, so with
// the desktop app closed the extension must stay silent instead.
assert(!/speechSynthesis|SpeechSynthesisUtterance/.test(offscreen),
  "the browser's system voice is back -- Immersion must stay silent when Micheon is closed");
assert(/Micheon isn't running/.test(popupScript),
  "the popup no longer explains why pronunciation is silent when Micheon is closed");
assert(background.includes("latestTtsRequest") && background.includes("requestId !== latestTtsRequest")
  && background.includes("offscreenCreation") && background.includes("lastForwardedText"),
  "stale TTS requests can still race while the offscreen player is opening");
assert(packageJson.scripts?.build?.startsWith("npm run sync:immersion-extension &&"),
  "app builds no longer regenerate and pack the extension word snapshot first");
assert(desktopMain.includes('ipcMain.handle("extension:info"')
  && desktopMain.includes("previousVersion") && desktopMain.includes("updated:"),
  "desktop setup no longer reports the bundled/copied extension versions");
assert(desktopPreload.includes("getBrowserExtensionInfo")
  && settingsCard.includes("Included with this Micheon version")
  && settingsCard.includes("click Reload on the existing Micheon Immersion card"),
  "the extension setup screen no longer explains versioning and Brave reloads");
for (const noise of ["std", "min", "aug", "grok", "codex", "gemini"]) {
  assert(new RegExp(`\\"${noise}\\"`).test(gloss), `${noise} is no longer filtered from missing-vocabulary exports`);
}

async function checkLatestAudioWins() {
  let listener;
  const pending = [];
  const plays = [];
  const browserSpeech = [];
  let nextUrl = 0;

  class FakeAudio {
    constructor(url) { this.url = url; }
    play() { plays.push(this.url); return Promise.resolve(); }
    pause() {}
    removeAttribute() {}
    load() {}
  }

  const context = {
    AbortController,
    Audio: FakeAudio,
    URL: {
      createObjectURL: () => `blob:${++nextUrl}`,
      revokeObjectURL: () => {},
    },
    SpeechSynthesisUtterance: class {
      constructor(text) { this.text = text; }
    },
    chrome: {
      runtime: { onMessage: { addListener: (callback) => { listener = callback; } } },
    },
    fetch: (url, options) => new Promise((resolve, reject) => {
      const request = { url, resolve, reject, aborted: false };
      options.signal.addEventListener("abort", () => {
        request.aborted = true;
        reject(new Error("aborted"));
      });
      pending.push(request);
    }),
    speechSynthesis: {
      cancel: () => {},
      getVoices: () => [],
      speak: (utterance) => browserSpeech.push(utterance.text),
      onvoiceschanged: null,
    },
    setTimeout,
    clearTimeout,
    encodeURIComponent,
    console,
  };

  vm.runInNewContext(offscreen, context, { filename: "offscreen.js" });
  assert.equal(typeof listener, "function", "offscreen player did not register its message listener");
  listener({ type: "micheon-tts-play", text: "eins" });
  listener({ type: "micheon-tts-play", text: "zwei" });
  assert(pending[0]?.aborted, "the first local-TTS request was not cancelled");
  pending[1].resolve({ ok: true, blob: async () => ({ text: "zwei" }) });
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(plays, ["blob:1"], "rapid hover requests produced overlapping local audio");
  assert.deepEqual(browserSpeech, [], "the browser-voice fallback is back -- silence is the intended behaviour with Micheon closed");
}

checkLatestAudioWins().then(() => {
  console.log(`Immersion extension checks passed (${words.length} words, v${manifest.version}, latest audio wins).`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// ── example sentences ───────────────────────────────────────────────────────
// A bare word-to-gloss pair says what a word means and nothing about how it is
// used, which is the reason to hover a word on a German page in the first
// place. Roughly half the glossary now carries a real sentence.
//
// The sentences come from OUR catalogue, not an external corpus, and that is
// the point: this content has been through the orthography, punctuation and
// quality gates. A wrong example is worse than none, because it teaches a
// construction that is not German — which is exactly what an unfiltered
// Tatoeba import did to the sentence course.
{
  const glossary = JSON.parse(
    fs.readFileSync(path.join(root, "public/micheon-immersion-extension/data/words.json"), "utf8")
  );
  const withExample = glossary.filter((entry) => entry.ex);
  assert.ok(
    withExample.length >= 3000,
    `only ${withExample.length} glossary entries carry an example; expected 3,000+`
  );
  for (const entry of withExample) {
    assert.ok(entry.ex.trim().length > 3, `${entry.de}: example is empty`);
    assert.ok(entry.ex.length <= 90, `${entry.de}: example too long for a hover card — "${entry.ex}"`);
    assert.ok(entry.exEn && entry.exEn.trim(), `${entry.de}: example has no translation`);
    // The example must actually contain the word, or it teaches nothing about it.
    assert.ok(
      entry.ex.toLocaleLowerCase("de-DE").includes(entry.de.toLocaleLowerCase("de-DE")),
      `${entry.de}: the example does not contain the word — "${entry.ex}"`
    );
  }
  // And the card has to be able to show it.
  const content = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/content-gloss.js"), "utf8");
  assert.ok(content.includes("tipExampleEl"), "the hover card must have somewhere to put the example");
  assert.ok(
    content.includes("if (entry.ex) {"),
    "an entry with no example must show nothing rather than an empty line"
  );
  const css = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/content-gloss.css"), "utf8");
  assert.ok(css.includes(".micheon-gloss-tip-example"), "the example needs styling of its own");

  console.log(
    `check-immersion-extension: ${withExample.length.toLocaleString()} of ${glossary.length.toLocaleString()} `
    + "glossary entries carry a vetted example sentence that contains the word"
  );
}

// ── and the example has to show the meaning the card prints ─────────────────
// Leon hovered "profile" on x.com and got:
//
//     profile
//     Wie sieht das Profil aus? — How does the tread look?
//
// Both halves true, the card nonsense. Containing the word is not enough: the
// picker took the SHORTEST sentence holding "Profil" and three of the six we
// have are about tyres. So the English side is read now, and these are the
// words that used to get it wrong.
{
  const glossary = JSON.parse(
    fs.readFileSync(path.join(root, "public/micheon-immersion-extension/data/words.json"), "utf8")
  );
  const byWord = new Map(glossary.map((entry) => [entry.de.toLocaleLowerCase("de-DE"), entry]));

  // The rules themselves, on the sentences that taught us we needed them.
  const rankOf = (cardGloss, de, en, headword) => exampleRank({
    cardGloss, fullGloss: cardGloss, de, en, headword, knows: (value) => value === "anstoßen",
  });
  assert.strictEqual(rankOf("profile", "Wie sieht das Profil aus?", "How does the tread look?"), 2,
    "the tread sentence must not count as showing what a profile is");
  assert.strictEqual(rankOf("profile", "Wechsel mal aufs andere Profil.", "Switch to the other profile."), 0,
    "a sentence whose English says profile must count");
  assert.strictEqual(rankOf("to push", "Wann stoßen wir auf den Job an?", "When are we toasting the job?", "stoßen"), 3,
    "a separated prefix after the verb makes it a different verb");
  assert.strictEqual(rankOf("to drive", "Lass uns an den See fahren.", "Let's drive to the lake.", "fahren"), 0,
    "a preposition BEFORE the verb is not a separated prefix");
  assert.strictEqual(rankOf("to generalise", "Ich würde das nicht verallgemeinern.", "I wouldn't generalize it."), 0,
    "British and American spellings of the same word must meet");
  assert.strictEqual(rankOf("to forget", "Ich hab's vergessen.", "I forgot."), 0,
    "irregular English verbs must reach their base form");
  assert.strictEqual(rankOf("child", "Wie heißt dein Kind?", "What's your child's name?"), 0,
    "a possessive 's must not hide the word");
  assert.strictEqual(rankOf("female friend", "Ich geh mit einer Freundin ins Kino.", "I'm going with a friend."), 0,
    "an English compound is shown by its head word");
  assert.strictEqual(rankOf("to come across", "Wir kommen gleich.", "We're coming right away."), 2,
    "a two-word verb needs its particle, not just its verb");

  // word → what its example's English has to say for the card to make sense.
  const mustShow = {
    profil: "profile",
    glauben: "believ",
    alter: "age",
    freund: "friend",
    freundin: "friend",
    lauf: "barrel",
    rechnung: "bill",
    termin: "appointment",
    fahren: "driv",
    stadt: "city",
    wichtig: "important",
    zusammen: "together",
    freundlich: "friendly",
    gemütlich: "cosy",
    waffe: "weapon",
    feierabend: "day",
  };
  for (const [word, needle] of Object.entries(mustShow)) {
    const entry = byWord.get(word);
    assert.ok(entry, `${word} is missing from the glossary`);
    assert.ok(entry.ex, `${word}: no example at all`);
    assert.ok(
      entry.exEn.toLocaleLowerCase("en").includes(needle),
      `${word} is glossed "${entry.en}" and illustrated with "${entry.exEn}" — `
      + `the English never says "${needle}", so the card teaches the wrong sense`
    );
  }

  // A word with a reviewed everyday-first meaning is, by definition, one we
  // decided is polysemous — so its example has to show the meaning the card
  // leads with, or carry no example at all. Leon read "notification" on die
  // Mitteilung and was shown "What did the note say?"; der Verlauf said
  // "history" and was illustrated with "Don't get lost", which is the verb
  // sich verlaufen and not the noun.
  const canonicalSource = fs.readFileSync(path.join(root, "src/lib/canonicalWordSenses.ts"), "utf8");
  const canonicalKeys = [...canonicalSource.matchAll(/^ {2}([a-zäöüß]+): \{$/gm)].map((match) => match[1]);
  assert.ok(canonicalKeys.length >= 200, `only ${canonicalKeys.length} canonical senses found`);
  const mismatched = [];
  for (const key of canonicalKeys) {
    const entry = byWord.get(key);
    if (!entry || !entry.ex) continue;
    if (exampleRank({ cardGloss: entry.en, fullGloss: entry.en, de: entry.ex, en: entry.exEn }) >= 2) {
      mismatched.push(`${entry.deDisplay} = ${entry.en} — "${entry.exEn}"`);
    }
  }
  assert.deepStrictEqual(mismatched, [],
    "these words have a reviewed meaning and an example that shows a different one");
  for (const [word, sentence] of [["Mitteilung", /notification/i], ["Verlauf", /history/i]]) {
    const entry = byWord.get(word.toLowerCase());
    assert.ok(entry && entry.ex, `${word} lost its example entirely`);
    assert.ok(sentence.test(entry.exEn),
      `${word} is illustrated with "${entry.exEn}", which does not show what the card says`);
  }

  // Nothing may ship at rank 3: a sentence whose German is really a separable
  // verb that only contains this one. "Wann stoßen wir auf den neuen Job an?"
  // is anstoßen, and no gloss of stoßen makes that card honest.
  const known = new Set(glossary.map((entry) => entry.de.toLocaleLowerCase("de-DE")));
  const knows = (value) => known.has(value);
  const ranks = [0, 0, 0, 0];
  const impostors = [];
  for (const entry of glossary) {
    if (!entry.ex) continue;
    const rank = exampleRank({
      cardGloss: entry.en,
      fullGloss: entry.en,
      de: entry.ex,
      en: entry.exEn,
      headword: entry.de,
      knows,
    });
    ranks[rank] += 1;
    if (rank === 3) impostors.push(`${entry.de}: "${entry.ex}"`);
  }
  assert.deepStrictEqual(impostors, [], "these examples are really about a different, separable verb");

  // Words with two meanings in the same spelling obey the app's reviewed
  // list rather than a second policy invented here: no example at all beats
  // one whose English agrees with nothing on the card. Read out of the app's
  // own source so the two surfaces cannot drift apart.
  const wordExamples = fs.readFileSync(path.join(root, "src/lib/wordExamples.ts"), "utf8");
  const listed = /const REQUIRES_SENSE_OVERLAP = new Set\(\[([\s\S]*?)\]\)/.exec(wordExamples);
  assert.ok(listed, "could not find the app's reviewed sense-clash list");
  const clashes = [...listed[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(clashes.length >= 15, `only ${clashes.length} reviewed sense-clash words found`);
  for (const clash of clashes) {
    const entry = byWord.get(clash);
    if (!entry || !entry.ex) continue;
    assert.ok(
      exampleRank({ cardGloss: entry.en, fullGloss: entry.en, de: entry.ex, en: entry.exEn }) < 2,
      `${entry.de} has two meanings sharing a spelling, and "${entry.exEn}" shows neither `
      + `the card's "${entry.en}" nor anything like it — the app refuses this example, so must the card`
    );
  }

  // A floor, not a target. Most of the rest are honest translations that
  // reach for a synonym — "midday" illustrated by "lunchtime" — and dropping
  // those would cost two good cards for every bad one. What this catches is
  // the picker regressing to shortest-wins, which would move hundreds at once.
  const showsTheGloss = ranks[0] + ranks[1];
  const total = ranks.reduce((sum, count) => sum + count, 0);
  assert.ok(
    showsTheGloss / total >= 0.7,
    `only ${showsTheGloss} of ${total} examples show the meaning their card prints (want 70%+)`
  );
  console.log(
    `check-immersion-extension: ${showsTheGloss.toLocaleString()} of ${total.toLocaleString()} `
    + `examples show the meaning the card prints (${Math.round((showsTheGloss / total) * 100)}%)`
  );
}

// ── the Tatoeba fill, and why it is allowed near a learner ──────────────────
// Micheon used Tatoeba once before with no filtering at all and shipped 65
// sentences spelling "die Einzige" as "die einzige". These are the guards
// that make a second attempt defensible, checked on the shipped data rather
// than trusted from the build script.
{
  const glossary = JSON.parse(
    fs.readFileSync(path.join(root, "public/micheon-immersion-extension/data/words.json"), "utf8")
  );
  const borrowed = glossary.filter((entry) => entry.exSrc === "t");
  const ours = glossary.filter((entry) => entry.ex && !entry.exSrc);

  assert.ok(ours.length >= 3000, `only ${ours.length} examples from our own catalogue`);
  assert.ok(borrowed.length >= 1500, `only ${borrowed.length} Tatoeba examples; expected 1,500+`);

  // Our own sentences must always win. Tatoeba fills gaps; it never replaces
  // material written for this course.
  const overlap = glossary.filter((entry) => entry.exSrc === "t" && entry.exId == null);
  assert.strictEqual(overlap.length, 0, "a borrowed example must carry the id it came from");

  for (const entry of borrowed) {
    assert.ok(Number.isInteger(entry.exId) && entry.exId > 0,
      `${entry.de}: no traceable Tatoeba sentence id`);
    assert.ok(entry.exEn && entry.exEn.trim(), `${entry.de}: borrowed example has no translation`);
    assert.ok(entry.ex.length <= 90, `${entry.de}: borrowed example too long — "${entry.ex}"`);
    assert.ok(
      entry.ex.toLocaleLowerCase("de-DE").includes(entry.de.toLocaleLowerCase("de-DE")),
      `${entry.de}: borrowed example does not contain the word — "${entry.ex}"`
    );
    // Every rule our own content is held to. A stranger's approval is not a
    // reason to teach from a sentence that would fail our gates.
    assert.ok(
      !/\b\w*(?:daß|muß|gewiß|bewußt|Schluß|Fluß|Kuß|häßlich|läßt|paßt)\w*\b/.test(entry.ex),
      `${entry.de}: pre-1996 spelling — "${entry.ex}"`
    );
    assert.ok(
      !/\b\w*(?:strasse|heiss|weiss|schmeiss|spass|fuss|gruss|draussen|aussen|dreissig)\w*\b/i.test(entry.ex),
      `${entry.de}: ss where German takes ß — "${entry.ex}"`
    );
    assert.ok(
      !/\b(der|die|das|dem|den|ein|eine|einer|eines|einem|einen)\s+einzige[nrs]?\b(?!\s+[A-ZÄÖÜ])/.test(entry.ex),
      `${entry.de}: the exact error that shipped last time — "${entry.ex}"`
    );
    assert.ok(/[.!?…"'”»]$/.test(entry.ex.trim()), `${entry.de}: no final punctuation — "${entry.ex}"`);
    assert.ok(!/\s{2,}/.test(entry.ex), `${entry.de}: double space — "${entry.ex}"`);
  }

  // Tatoeba's house style names everybody Tom. Not wrong, but a glossary full
  // of one man's errands reads badly, so the picker prefers alternatives.
  const placeholders = borrowed.filter((entry) => /\b(Tom|Maria|Mary)\b/.test(entry.ex)).length;
  assert.ok(
    placeholders / borrowed.length < 0.1,
    `${Math.round((placeholders / borrowed.length) * 100)}% of borrowed examples use a placeholder name; expected under 10%`
  );

  // CC BY obliges attribution wherever a borrowed sentence is shown.
  const content = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/content-gloss.js"), "utf8");
  // Attribution lives on the credits page, not on every hover card: CC BY
  // asks for credit reasonable to the medium, and a tooltip is not it. What
  // the card MUST do is lay out — the example needs its own row, or a third
  // child in a nowrap flex row squeezes the gloss into an ellipsis and
  // "Mitteilungen" renders as the letter "r".
  assert.ok(
    !content.includes("Tatoeba (CC BY)"),
    "the hover card should not carry a licence notice; the credits page does"
  );
  const tipCss = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/content-gloss.css"), "utf8");
  assert.ok(/.micheon-gloss-tip {[^}]*flex-wrap: wrap/.test(tipCss),
    "the tip must wrap, or the example crushes the gloss");
  assert.ok(/.micheon-gloss-tip-example {[^}]*flex: 0 0 100%/.test(tipCss),
    "the example needs a row of its own");
  assert.ok(/.micheon-gloss-tip-example {[^}]*white-space: normal/.test(tipCss),
    "the example must wrap as prose rather than inherit the tip nowrap");

  console.log(
    `check-immersion-extension: ${(ours.length + borrowed.length).toLocaleString()} of ${glossary.length.toLocaleString()} `
    + `entries have an example — ${ours.length.toLocaleString()} ours, ${borrowed.length.toLocaleString()} from Tatoeba, `
    + "every borrowed one traceable and through our own German rules"
  );
}

// ── function words, and the reverse direction ───────────────────────────────
// Leon, reading an English page: "there is stuff on this page that i know we
// have in our app's translator but not showing, for example and/und and
// you/du". They were not showing because they were not there: the course
// teaches und, du and nicht through sentences rather than as vocabulary
// cards, so they never reached the word catalogue the glossary is built from.
{
  const glossary = JSON.parse(
    fs.readFileSync(path.join(root, "public/micheon-immersion-extension/data/words.json"), "utf8")
  );
  const byDe = new Map(glossary.map((entry) => [String(entry.de).toLocaleLowerCase("de-DE"), entry]));

  for (const [word, meaning] of [
    ["und", /and/i], ["du", /you/i], ["ich", /\bI\b/], ["nicht", /not/i],
    ["mit", /with/i], ["aber", /but/i], ["oder", /or/i], ["auch", /also/i],
    ["sehr", /very/i], ["wo", /where/i], ["warum", /why/i], ["kein", /no/i],
  ]) {
    const entry = byDe.get(word);
    assert.ok(entry, `"${word}" is missing from the glossary — hovering it would do nothing`);
    assert.ok(meaning.test(entry.en), `"${word}" glosses as "${entry.en}", which is not its meaning`);
  }

  const { byEn, reaches } = buildReverseIndex(glossary);

  // The plural, the other name, and the verb: three ways a word reached
  // nothing at all. "plugins" is in every release note Leon reads, "usage"
  // is what his pages call die Nutzung, and "decide" is a verb, which the
  // reverse index used to refuse outright.
  for (const [english, german, why] of [
    ["plugins", "das Plug-in", "an English plural must find its singular"],
    ["customers", "der Kunde", "likewise"],
    ["memories", "die Erinnerung", "and -ies must become -y"],
    ["usage", "die Verwendung", "an authored gloss still wins the key it claims"],
    ["history", "der Verlauf", "the other name for a word we already teach"],
    ["fridge", "der Kühlschrank", "a word added from Leon's own export"],
    ["decide", "entscheiden", "a verb is still a word somebody hovers"],
    ["decided", "entscheiden", "and its past tense is unambiguously that verb"],
    ["message", "die Nachricht", "the everyday word, not die Meldung"],
    ["notification", "die Benachrichtigung", "the app word"],
    ["bill", "die Rechnung", "each side of an \"A or B\" gloss is a claim"],
    ["invoice", "die Rechnung", "including the second side"],
    ["believe", "glauben", "and the same for \"to A or B\" verbs"],
  ]) {
    assert.strictEqual(reaches(english), german, `"${english}" should reach ${german} — ${why}`);
  }

  // A German page is full of English, and the reader is there to learn
  // German. A word that is not German but whose German we know now shows
  // that — but only for content words, or half an English sentence would be
  // underlined to teach "the" is "der".
  assert.ok(
    gloss.includes("if (!hit && !ENGLISH_NEVER_GUESS.has(lower)")
    && gloss.includes("byEn.get(lower) || englishSingularEntry(lower)"),
    "English inside German text no longer falls back to the German we know for it"
  );
  for (const [english, expected] of [
    ["fake", "gefälscht"], ["retention", "die Speicherung"], ["capacity", "die Kapazität"],
  ]) {
    assert.strictEqual(reaches(english), expected,
      `"${english}" turns up in German posts and should show ${expected}`);
  }

  // Leon hovered X's Mitteilungen tab and the card said "message" — the
  // wrong sense to lead with, and the same for its neighbours. The canonical
  // senses file owns these; this pins what the card actually leads with.
  for (const [word, leads] of [
    ["Mitteilung", /^notification/],
    ["Benachrichtigung", /^notification/],
    ["Meldung", /^report/],
    ["Verlauf", /^history/],
    ["Beitrag", /^contribution or post/],
    ["Nachricht", /^message/],
    ["Benachrichtigung", /^notification/],
    ["Impressum", /^legal notice/],
  ]) {
    const entry = glossary.find((candidate) => candidate.de === word);
    assert.ok(entry, `${word} is missing from the glossary`);
    assert.ok(leads.test(entry.en),
      `${word} leads with "${entry.en}" — a reader in a German UI needs it to lead with ${leads}`);
  }
  // The reason verbs were excluded in the first place, still holding: a noun
  // sense we teach must keep the key. Stripping "to " blindly made the
  // English word "date" gloss as daten, to date somebody.
  assert.ok(!(byEn.get("date") || {}).isVerb, "the noun sense of \"date\" must outrank the verb");

  for (const [english, german] of [
    ["and", "und"], ["you", "du"], ["but", "aber"], ["not", "nicht"],
    ["with", "mit"], ["very", "sehr"], ["always", "immer"], ["maybe", "vielleicht"],
  ]) {
    const hit = byEn.get(english);
    assert.ok(hit, `"${english}" has no German on the reverse side`);
    assert.strictEqual(hit.deDisplay, german,
      `"${english}" reaches "${hit.deDisplay}" rather than "${german}" — the everyday word should win`);
  }
  assert.ok(byEn.size >= 5000, `only ${byEn.size} reverse entries`);

  // A glossary is looked up by the word. Sixty-six entries were keyed "die
  // Korrektur", article and all, so hovering Korrektur on a page found
  // nothing while the entry sat there looking present.
  const articled = glossary.filter((entry) => /^(der|die|das)\s/i.test(entry.de));
  assert.deepStrictEqual(articled.map((entry) => entry.de), [],
    "a glossary entry must be keyed on the word, not on the word with its article");
  for (const noun of ["Korrektur", "Kühlschrank", "Nutzung", "Abonnement"]) {
    assert.ok(glossary.some((entry) => entry.de === noun), `${noun} cannot be looked up in German`);
  }

  // A qualifier in brackets is a note to the reader, not part of the word.
  // Leaving it in took weil, denn and 170 others out of the reverse direction.
  const content = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/content-gloss.js"), "utf8");
  // Matched by shape rather than by an exact literal: an assertion that has
  // to hand-escape a regex to describe a regex is one backslash away from
  // silently passing, which is the failure this whole file exists to prevent.
  assert.ok(
    /const enFirst = [^\n]*\.replace\([^\n]*\)\s*\.trim\(\)/.test(content),
    "a trailing qualifier must be stripped before the reverse key is built"
  );
  assert.ok(content.includes("isCore && !existing.isCore"),
    "the everyday word must win the reverse direction over a rarer synonym");

  // The popup: grouped, and resizable, since a browser will not let an
  // extension drag its own popup wider.
  const popupHtml = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/popup.html"), "utf8");
  for (const group of ["Reading", "Speech", "Video"]) {
    assert.ok(popupHtml.includes(`<h2 class="group">${group}</h2>`), `the popup has no "${group}" group`);
  }
  assert.ok(popupHtml.includes('id="sizeL"'), "the popup needs a size control");
  const popupJs = fs.readFileSync(path.join(root, "public/micheon-immersion-extension/src/popup.js"), "utf8");
  assert.ok(popupJs.includes("PANEL_WIDTHS"), "the size control needs widths to apply");
  assert.ok(popupJs.includes('chrome.storage.local.set({ panelSize: size })'),
    "the chosen size must be remembered, or picking it every time is worse than a fixed one");

  console.log(
    `check-immersion-extension: ${byEn.size.toLocaleString()} English words reach German, `
    + "function words included, and the popup is grouped and resizable"
  );
}

// ── inflected forms ─────────────────────────────────────────────────────────
// German is inflected and a glossary holds dictionary forms. Leon exported the
// words the extension could not identify: 276 entries, 47 of them plain
// inflections of words already in the glossary. Hovering "fuehlt" did nothing
// and it was logged as a word he did not know.
//
// The rules are only allowed to guess when the guess lands on an entry we
// already hold, and verb rules must land on an infinitive. That second
// condition is the one that matters: it is what stops the past tense of
// denken resolving to the noun Dach.
{
  const start = gloss.indexOf("  const ENGLISH_NEVER_GUESS");
  const stop = gloss.indexOf("  function findGermanEntry(token,", start);
  assert(start >= 0 && stop > start, "could not isolate the de-inflection helper");
  assert(gloss.indexOf("  function inflectedGermanEntry(token) {") > start,
    "the English guard must be defined before the helper that consults it");

  const byDeLowerAny = new Map();
  for (const entry of words) {
    const key = String(entry.de).toLowerCase();
    if (!byDeLowerAny.has(key)) byDeLowerAny.set(key, entry);
  }
  const context = { byDeLowerAny };
  vm.runInNewContext(
    gloss.slice(start, stop) + "\nthis.resolve = inflectedGermanEntry;",
    context,
    { filename: "content-gloss-inflection.js" }
  );
  const resolve = (form) => {
    const hit = context.resolve(form);
    return hit ? String(hit.de).toLowerCase() : null;
  };

  // Written with real umlauts. An earlier version spelled them "ae"/"ue" and
  // converted, which turned the test word "neuen" into "ne\u00fcn" \u2014 the helper
  // corrupted its own fixtures and then reported the code broken.
  for (const [form, lemma] of [
    ["neuen", "neu"],
    ["geladen", "laden"],
    ["geteilt", "teilen"],
    ["sollten", "sollen"],
    ["aktivit\u00e4ten", "Aktivit\u00e4t"],
    ["vorbestellt", "vorbestellen"],
    ["best\u00e4tigt", "best\u00e4tigen"],
  ].map(([form, lemma]) => [form, lemma.toLowerCase()])) {
    assert.equal(resolve(form), lemma,
      `"${form}" should resolve to "${lemma}" — a reader hovering it gets nothing otherwise`);
  }

  // An umlaut in the stem still has to reach the infinitive.
  assert.equal(resolve("w\u00e4chst"), "wachsen", "a stem-vowel change must still resolve");

  // A separable verb hides its ge in the middle, and a participle used as an
  // adjective wears two endings. Both were reported as unknown vocabulary.
  for (const [form, lemma] of [
    ["eingelöst", "einlösen"],
    ["angerufen", "anrufen"],
    ["herausgekommen", "herauskommen"],
    ["veröffentlichtes", "veröffentlichen"],
    ["geführte", "führen"],
    ["funktionierenden", "funktionieren"],
    // German puts zu inside a separable verb, and nothing about the word
    // survives a suffix rule: bereitzustellen is bereitstellen.
    ["bereitzustellen", "bereitstellen"],
    ["herauszufinden", "herausfinden"],
  ].map(([form, lemma]) => [form, lemma.toLowerCase()])) {
    assert.equal(resolve(form), lemma,
      `"${form}" should resolve to "${lemma}" — a reader hovering it gets nothing otherwise`);
  }

  // And the guesses that must never be made. A wrong gloss is worse than
  // none: it teaches a word the page never used.
  for (const [form, why] of [
    ["dachte", "the past of denken is not the noun Dach"],
    ["warfare", "English text is not German"],
    ["history", "nor is this"],
    ["usage", "nor is this"],
  ]) {
    assert.equal(resolve(form), null, `"${form}" must resolve to nothing — ${why}`);
  }

  // German pages are full of English, and suffix rules will invent German out
  // of it if allowed to: back became backen, off became offen, under became
  // und, better became das Bett. Every one of these was a confident wrong
  // answer on a word the reader already knew.
  for (const english of [
    "were", "under", "same", "want", "went", "plant", "often", "main", "best",
    "better", "interest", "listen", "figure", "plane", "back", "off", "such",
    "turn", "far", "begin", "red", "pass", "west", "less", "end", "find",
  ]) {
    assert.equal(resolve(english), null,
      `"${english}" is an English word and must not be guessed at as German`);
  }

  console.log("check-immersion-extension: inflected forms reach their dictionary entry, and bad guesses are refused");
}

// ── words the collector reported, now answerable ────────────────────────────
// Leon: "what english isnt a leak, its telling you words that im seeing on
// websites that need to be translated to improve our apps". He is right — the
// English half of an export is the feature working. Each entry in
// immersionGaps.json exists because it actually turned up on a page he read
// and the app had no German for it.
{
  const { reaches } = buildReverseIndex(words);

  // Straight from the export, most-seen first. If any of these stops
  // resolving, a word he demonstrably reads has gone silent again.
  for (const english of [
    "usage", "history", "cheaper", "customer", "website", "access", "limit",
    "activity", "leadership", "workflow", "subscription", "enterprise",
    "tutorial", "vendor", "purchase", "available", "glad", "finally",
    "absolutely", "incredible", "entire", "various", "fridge", "yesterday",
  ]) {
    const german = reaches(english);
    assert.ok(german, `"${english}" has no German — it came off a page Leon actually read`);
    assert.ok(/[A-Za-zÄÖÜäöüß]/.test(german), `"${english}" resolves to something empty`);
  }

  // Every noun states its gender, since a German noun without one is half a
  // card and the glossary is where a learner would look for it.
  const gaps = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "immersionGaps.json"), "utf8"));
  assert.ok(gaps.length >= 100, `only ${gaps.length} gap words; the export gave us more than that`);
  for (const entry of gaps) {
    assert.ok(entry.de && entry.en, "a gap word is missing a side");
    // A place name takes no article — Europa, China — and says so in the
    // data rather than being guessed at from its shape.
    const looksLikeNoun = !entry.noArticle
      && /^[A-ZÄÖÜ]/.test(entry.de.replace(/^(der|die|das)\s+/, ""));
    if (looksLikeNoun) {
      assert.ok(/^(der|die|das)\s/.test(entry.de),
        `"${entry.de}" is a noun with no article — the gender is the hard part`);
    }
    assert.ok(!/[.!?]$/.test(entry.de), `"${entry.de}" is a sentence, not a word`);
  }

  console.log(
    `check-immersion-extension: ${gaps.length} words the collector asked for now have German, `
    + `and ${buildReverseIndex(words).byEn.size.toLocaleString()} English words reach it`
  );
}
