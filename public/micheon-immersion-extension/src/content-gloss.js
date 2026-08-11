/**
 * Runs on every page. Two things, both entirely offline against Micheon's
 * own bundled word list (data/words.json) -- no translation API, no network
 * call beyond loading that one local file:
 *
 *   1. Glossing: a word already in the list gets a dotted underline and a
 *      hover/focus tooltip with its translation. German page -> English
 *      gloss (reinforcement of what you're learning). Non-German page ->
 *      German gloss on English words that have a taught equivalent (recall
 *      prompt, so pages you'd otherwise read in English still teach).
 *   2. Missing-vocabulary collection: on a page detected as German, a
 *      real-looking German word that ISN'T in the list gets counted. This
 *      is a candidate list for a human (or a future authoring pass) to
 *      review -- never auto-added, same as every other pack in Micheon.
 */
(() => {
  const WORD_RE = /[\p{L}\p{M}][\p{L}\p{M}'’-]*/gu;
  const GERMAN_LETTER_RE = /^[A-Za-zÄÖÜäöüß'’-]+$/;
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE"]);
  const MISSING_VOCAB_CAP = 3000;
  const FLUSH_DELAY_MS = 4000;

  let settings = { glossEnabled: true, collectMissingVocab: true };
  // German capitalises every noun and nothing else, so a word's authored
  // case IS its part-of-speech signal -- "Daten" (data, a noun) and "daten"
  // (to date someone, a verb) are different words that happen to share
  // letters, not the same word in two cases. Losing that by lowercasing
  // everything for lookup produced exactly that mix-up on first real-page
  // testing (spiegel.de glossed "Daten" as "to date"). Match on exact
  // authored case; the only case-insensitive fallback is ALL-CAPS text
  // (headlines, nav labels), which discards case entirely so there is no
  // noun/verb signal left to lose there. Position-based recovery of
  // ordinary sentence-initial Titlecase words was tried and reverted: it
  // cannot actually tell "capitalised because it's a real noun this list
  // doesn't teach" apart from "capitalised only by sentence position",
  // and a wrong gloss teaches something false, which is worse than a
  // missed one.
  let byDeExact = new Map();       // authored-case German -> { en, deDisplay }
  let byDeLowerAny = new Map();    // lowercase German (all entries) -> { en, deDisplay }
  let byEn = new Map();   // lowercase English (first word of gloss only) -> { de, deDisplay }
  let isGermanPage = false;
  let missingCounts = new Map();   // word -> count
  let missingExamples = new Map(); // word -> one real sentence it appeared in, first seen
  let flushTimer = null;
  const processed = new WeakSet();

  // The sentence a missing word appeared in is worth more than the word
  // alone -- it's real usage, the same kind of context Micheon's own "use"
  // field captures by hand for every taught word. A single text node is
  // often only a FRAGMENT of the visible sentence (inline <strong>/<a> tags
  // split it in the DOM), so this reads the whole containing element's
  // text, not just the one node the match was found in.
  function extractSentence(node, tokenStart) {
    const container = node.parentElement?.closest("p, li, h1, h2, h3, h4, blockquote, td, dd, figcaption") || node.parentElement;
    const full = (container?.textContent || node.nodeValue || "").replace(/\s+/g, " ").trim();
    if (!full) return "";
    const approxPoint = Math.min(full.length - 1, Math.max(0, tokenStart));
    const before = full.slice(0, approxPoint);
    const after = full.slice(approxPoint);
    const start = Math.max(before.lastIndexOf(". "), before.lastIndexOf("! "), before.lastIndexOf("? "));
    const endMatch = after.search(/[.!?](\s|$)/);
    const end = endMatch === -1 ? after.length : endMatch + 1;
    const sentence = full.slice(start === -1 ? 0 : start + 2, approxPoint + end).trim();
    return sentence.length > 4 && sentence.length <= 220 ? sentence : full.slice(0, 200);
  }

  function detectGerman() {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("de")) return true;
    if (htmlLang && !htmlLang.startsWith("de")) return false;
    // No lang attribute at all: fall back to a quick sample of the page's
    // own text rather than guessing from the URL, which lies constantly
    // (plenty of German sites live on .com/.io domains).
    const sample = (document.body?.innerText || "").slice(0, 2000).toLowerCase();
    const hits = (sample.match(/\b(und|nicht|der|die|das|ist|sind|ich|du|wir|mit|für|auch)\b/g) || []).length;
    return hits >= 6;
  }

  function buildIndexes(words) {
    for (const w of words) {
      const entry = { en: w.en, deDisplay: w.deDisplay };
      if (!byDeExact.has(w.de)) byDeExact.set(w.de, entry);
      const lowerKey = w.de.toLowerCase();
      if (!byDeLowerAny.has(lowerKey)) byDeLowerAny.set(lowerKey, entry);
      // Only index single-word English glosses for the reverse direction --
      // "to give up, to quit" as a hover prompt on the word "give" would be
      // actively misleading about what's being asked for.
      const enFirst = w.en.split(",")[0].trim();
      if (/^[A-Za-z' -]+$/.test(enFirst) && enFirst.split(/\s+/).length <= 2) {
        const enKey = enFirst.toLowerCase().replace(/^to\s+/, "");
        if (!byEn.has(enKey)) byEn.set(enKey, { de: w.de, deDisplay: w.deDisplay });
      }
    }
  }

  // Articles, pronouns, conjunctions, prepositions and auxiliary-verb forms:
  // Micheon teaches these through the sentences they appear in rather than
  // as standalone flashcards, so they never show up as their own word-list
  // entry. Left unfiltered, they dominated the real candidate list on
  // first testing ("die" 165x, "und" 168x) and buried every genuinely new
  // word this is supposed to surface -- excluded on purpose, not missing.
  const STOPWORDS = new Set([
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "einem", "einen", "eines",
    "und", "oder", "aber", "doch", "denn", "sondern", "als", "wie", "wenn", "dass", "weil", "ob",
    "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "dich", "sich", "uns", "euch",
    "mein", "dein", "sein", "ihre", "unser", "euer", "ihren", "ihrer", "ihrem", "seinen", "seiner", "seinem",
    "in", "im", "an", "am", "auf", "aus", "bei", "bis", "durch", "für", "gegen", "mit", "nach",
    "ohne", "seit", "um", "unter", "von", "vor", "zu", "zum", "zur", "über", "hinter", "neben", "zwischen",
    "ist", "sind", "war", "waren", "wird", "werden", "wurde", "wurden", "hat", "haben", "hatte", "hatten",
    "kann", "können", "muss", "müssen", "soll", "sollen", "will", "wollen", "darf", "dürfen", "mag", "mögen",
    "nicht", "kein", "keine", "auch", "noch", "nur", "schon", "so", "sehr", "hier", "dort", "jetzt",
    "alle", "alles", "alle", "andere", "anderen", "jede", "jeder", "jedes", "man", "mehr", "mehr",
  ]);

  function looksLikeRealGermanCandidate(token) {
    if (token.length < 3 || token.length > 30) return false;
    if (!GERMAN_LETTER_RE.test(token)) return false;
    if (/^[A-ZÄÖÜ]+$/.test(token)) return false; // ALLCAPS: acronym/brand, not a word to learn
    if (STOPWORDS.has(token.toLowerCase())) return false;
    return true;
  }

  function scheduleFlush() {
    if (flushTimer) return;
    flushTimer = setTimeout(flushMissingVocab, FLUSH_DELAY_MS);
  }

  async function flushMissingVocab() {
    flushTimer = null;
    if (missingCounts.size === 0) return;
    const { missingVocab = {} } = await chrome.storage.local.get("missingVocab");
    for (const [word, count] of missingCounts) {
      const prior = missingVocab[word];
      missingVocab[word] = {
        count: (prior?.count || 0) + count,
        example: prior?.example || missingExamples.get(word) || "",
      };
    }
    missingCounts = new Map();
    missingExamples = new Map();
    const trimmed = Object.fromEntries(
      Object.entries(missingVocab)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, MISSING_VOCAB_CAP)
    );
    await chrome.storage.local.set({ missingVocab: trimmed });
  }

  function makeGlossSpan(originalText, gloss, direction) {
    const span = document.createElement("span");
    span.className = "micheon-gloss-word";
    span.dataset.micheon = "1";
    span.dataset.micheonGloss = gloss;
    span.dataset.micheonDir = direction;
    span.tabIndex = 0;
    span.textContent = originalText;
    return span;
  }

  function processTextNode(node) {
    if (processed.has(node)) return;
    const text = node.nodeValue;
    if (!text || text.trim().length < 3) return;

    WORD_RE.lastIndex = 0;
    let match;
    let lastIndex = 0;
    let fragment = null; // built lazily -- most text nodes match nothing

    while ((match = WORD_RE.exec(text))) {
      const token = match[0];
      const lower = token.toLowerCase();
      let hit = null;
      let direction = null;

      if (isGermanPage) {
        hit = byDeExact.get(token);
        if (!hit && /^[A-ZÄÖÜ]+$/.test(token)) {
          // All-caps discards case entirely (headlines, nav labels) -- no
          // noun/verb signal survives that to protect, so the full index
          // is fair game here.
          hit = byDeLowerAny.get(lower);
        }
        // Deliberately NOT recovering ordinary sentence-initial Titlecase
        // words against non-noun entries: "position in the sentence" can't
        // actually distinguish a real capitalised noun this list doesn't
        // teach from a lowercase-authored word capitalised only by
        // position -- confirmed on real content, where sentence-initial
        // "Daten" (data, a noun Micheon doesn't teach) kept resolving to
        // "daten" (to date someone, a verb it does). A missed gloss is
        // silent; a wrong one actively teaches something false, so this
        // stays exact-case-or-nothing for ordinary Titlecase tokens.
        direction = "de-en";
        if (!hit && settings.collectMissingVocab && looksLikeRealGermanCandidate(token)) {
          missingCounts.set(lower, (missingCounts.get(lower) || 0) + 1);
          if (!missingExamples.has(lower)) {
            missingExamples.set(lower, extractSentence(node, match.index));
          }
          scheduleFlush();
        }
      } else {
        hit = byEn.get(lower);
        direction = "en-de";
      }

      if (hit) {
        if (!fragment) fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        fragment.appendChild(makeGlossSpan(token, isGermanPage ? hit.en : hit.deDisplay, direction));
        lastIndex = match.index + token.length;
      }
    }

    if (fragment) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      node.parentNode?.replaceChild(fragment, node);
    } else {
      processed.add(node);
    }
  }

  function walk(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const parent = n.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".micheon-gloss-word")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    // Process off the main thread's critical path, in batches, so a huge
    // page (long article, infinite-scroll feed) doesn't jank the tab.
    let i = 0;
    function step(deadline) {
      while (i < nodes.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
        processTextNode(nodes[i]);
        i += 1;
      }
      if (i < nodes.length) requestIdleCallback(step, { timeout: 1000 });
    }
    requestIdleCallback(step, { timeout: 1000 });
  }

  function observeNewContent() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const added of m.addedNodes) {
          if (added.nodeType === Node.ELEMENT_NODE) {
            if (added.dataset?.micheon) continue; // our own insertion
            walk(added);
          } else if (added.nodeType === Node.TEXT_NODE) {
            processTextNode(added);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function init() {
    const stored = await chrome.storage.local.get("settings");
    settings = { ...settings, ...(stored.settings || {}) };
    if (!settings.glossEnabled) return;

    isGermanPage = detectGerman();

    const url = chrome.runtime.getURL("data/words.json");
    const words = await fetch(url).then((r) => r.json());
    buildIndexes(words);

    walk(document.body);
    observeNewContent();
    window.addEventListener("beforeunload", flushMissingVocab);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
