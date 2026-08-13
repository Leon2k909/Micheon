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
const packedFile = (relativePath) => execFileSync("tar", ["-xOf", archive, relativePath], { encoding: "utf8" });
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
]) {
  assert(words.some((word) => word.de === lemma), `${lemma} is missing from the Immersion glossary`);
}
assert.equal(words.find((word) => word.de === "versprechen")?.en, "to promise",
  "versprechen still teaches the less common reflexive meaning instead of to promise");

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
assert(offscreen.includes("playbackRequest") && offscreen.includes("stopCurrentPlayback()")
  && offscreen.includes("currentFetch?.abort()") && offscreen.includes("speechSynthesis.cancel()"),
  "overlapping TTS playback is no longer cancelled");
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
  assert.deepEqual(browserSpeech, [], "a cancelled request leaked through the browser-voice fallback");
}

checkLatestAudioWins().then(() => {
  console.log(`Immersion extension checks passed (${words.length} words, v${manifest.version}, latest audio wins).`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
