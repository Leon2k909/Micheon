#!/usr/bin/env node
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

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

  // The reverse index, rebuilt the way content-gloss builds it, so this checks
  // what a reader on an English page would actually get.
  const byEn = new Map();
  for (const entry of glossary) {
    const first = String(entry.en).split(",")[0].replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (!/^[A-Za-z' -]+$/.test(first) || /^to\s/i.test(first) || first.split(/\s+/).length > 2) continue;
    const key = first.toLowerCase();
    const isNoun = /^(der|die|das)\s/.test(entry.deDisplay);
    const isCore = entry.core === 1;
    const existing = byEn.get(key);
    if (!existing || (isCore && !existing.isCore) || (isNoun && !existing.isNoun && !existing.isCore)) {
      byEn.set(key, { de: entry.deDisplay, isNoun, isCore });
    }
  }
  for (const [english, german] of [
    ["and", "und"], ["you", "du"], ["but", "aber"], ["not", "nicht"],
    ["with", "mit"], ["very", "sehr"], ["always", "immer"], ["maybe", "vielleicht"],
  ]) {
    const hit = byEn.get(english);
    assert.ok(hit, `"${english}" has no German on the reverse side`);
    assert.strictEqual(hit.de, german,
      `"${english}" reaches "${hit.de}" rather than "${german}" — the everyday word should win`);
  }
  assert.ok(byEn.size >= 5000, `only ${byEn.size} reverse entries`);

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
