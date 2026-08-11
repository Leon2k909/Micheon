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
 *   2. Missing-vocabulary collection: on German text, a real-looking German
 *      word that ISN'T in the list gets counted with the sentence it
 *      appeared in. This is a candidate list for a human (or a future
 *      authoring pass) to review -- never auto-added, same as every other
 *      pack in Micheon.
 *
 * YouTube is the special case. Its page chrome renders in the ACCOUNT's
 * interface language, so page-level language detection reads a German-locale
 * YouTube as "German page" even under an English video -- that poisoned the
 * candidate list once already. But video titles and descriptions on
 * German-learning channels are exactly the vocabulary worth reading. So on
 * YouTube this script scans ONLY the watch page's title + description
 * containers, and decides German-or-not per container from that container's
 * own text, never from the page around it.
 */
(() => {
  const WORD_RE = /[\p{L}\p{M}][\p{L}\p{M}'’-]*/gu;
  const GERMAN_LETTER_RE = /^[A-Za-zÄÖÜäöüß'’-]+$/;
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE"]);
  const MISSING_VOCAB_CAP = 3000;
  const FLUSH_DELAY_MS = 4000;
  const GERMAN_HINT_RE = /\b(und|nicht|der|die|das|ist|sind|ich|du|wir|mit|für|auch|über|sei|ein|eine|zum|zur|auf|dem|den)\b/g;

  const IS_YOUTUBE = /(^|\.)youtube\.com$/.test(location.hostname);
  // Title first, then the description in its collapsed and expanded homes.
  // YouTube reshuffles its DOM between deploys, so several selectors --
  // scanning is cheap, node-level dedup makes rescans safe.
  const YT_SCAN_SELECTORS = [
    "ytd-watch-metadata h1",
    "#description-inline-expander",
    "ytd-text-inline-expander",
    "#description",
  ];

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
  let ytGermanFound = false;
  let missingCounts = new Map();   // word -> count
  let missingExamples = new Map(); // word -> one real sentence it appeared in, first seen
  let flushTimer = null;
  let ytScanTimer = null;
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
    const hits = (sample.match(GERMAN_HINT_RE) || []).length;
    return hits >= 6;
  }

  // Per-container German check for YouTube. Vocabulary-list descriptions
  // are stopword-light ("06:09 neugierig" has no function word at all), so
  // umlaut/ß-bearing words count as a second, independent signal.
  function looksGermanBlock(text) {
    const sample = text.slice(0, 3000).toLowerCase();
    const stopHits = (sample.match(GERMAN_HINT_RE) || []).length;
    const umlautWords = (sample.match(/[a-zäöüß'’-]*[äöüß][a-zäöüß'’-]*/g) || []).length;
    return stopHits >= 4 || umlautWords >= 3;
  }

  // Stricter, sentence-sized version of the same check. YouTube descriptions
  // on German-learning channels mix English paragraphs with the German
  // content ("Following the English audio..." right above the vocab list),
  // and a container-level judgement can't see that seam -- verified on real
  // content, where the English half of a description polluted the candidate
  // list with "the", "and" and "app". Words are only collected when their
  // OWN sentence carries at least one German signal.
  function sentenceLooksGerman(sentence) {
    const sample = sentence.toLowerCase();
    if ((sample.match(GERMAN_HINT_RE) || []).length >= 1) return true;
    return /[äöüß]/.test(sample);
  }

  function buildIndexes(words) {
    for (const w of words) {
      const entry = { en: w.en, deDisplay: w.deDisplay };
      if (!byDeExact.has(w.de)) byDeExact.set(w.de, entry);
      const lowerKey = w.de.toLowerCase();
      if (!byDeLowerAny.has(lowerKey)) byDeLowerAny.set(lowerKey, entry);
      // Only index short English glosses for the reverse direction -- "to
      // give up, to quit" as a hover prompt on the word "give" would be
      // actively misleading about what's being asked for. Verb entries are
      // excluded outright: stripping their "to " made the English word
      // "date" (nearly always the calendar noun in real text) gloss as
      // "daten" (to date someone), and "collect" landed on "abholen" --
      // a wrong sense taught confidently. A missing gloss is silent; a
      // wrong one isn't. On genuine collisions between the remaining
      // entries, a noun (der/die/das) beats anything else: it's the
      // concrete, dictionary-shaped sense a hover should teach.
      const enFirst = w.en.split(",")[0].trim();
      if (/^[A-Za-z' -]+$/.test(enFirst) && !/^to\s/i.test(enFirst) && enFirst.split(/\s+/).length <= 2) {
        const enKey = enFirst.toLowerCase();
        const isNoun = /^(der|die|das)\s/.test(w.deDisplay);
        const existing = byEn.get(enKey);
        if (!existing || (isNoun && !existing.isNoun)) {
          byEn.set(enKey, { de: w.de, deDisplay: w.deDisplay, isNoun });
        }
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
    "alle", "alles", "andere", "anderen", "jede", "jeder", "jedes", "man", "mehr",
  ]);

  // Not vocabulary: names, cities, brands, web fragments and English filler
  // that survive the letter checks. Case-insensitive, so collisions with
  // real German words are excluded from the LIST rather than handled --
  // no "Ernst" (seriousness), "Ritter" (knight), "brave" (well-behaved),
  // "also" (therefore), "Sparkasse", "Cola": a learner losing those to a
  // name filter would be worse than a stray name getting through.
  const NOT_VOCAB = new Set([
    // first names common in German and English text
    "alexander", "andreas", "anna", "ashley", "ben", "brandon", "brian", "charles", "christian",
    "christina", "christopher", "clara", "daniel", "david", "dennis", "elias", "elizabeth", "emilia",
    "emily", "emma", "erik", "fabian", "felix", "florian", "hannah", "hanna", "heinrich", "jan",
    "jana", "james", "jason", "jennifer", "jessica", "johanna", "johannes", "john", "jonas", "joseph",
    "joshua", "julia", "justin", "katharina", "katrin", "kevin", "klara", "klaus", "laura", "lea",
    "lena", "leon", "linda", "lisa", "lukas", "lucas", "ludwig", "manfred", "marco", "marie", "mark",
    "markus", "martin", "mary", "matthias", "matthew", "max", "maximilian", "melanie", "mia",
    "michael", "michelle", "monika", "moritz", "nadine", "nele", "nick", "niklas", "nico", "nina",
    "noah", "oliver", "oskar", "patricia", "patrick", "paul", "peter", "petra", "philipp", "ralf",
    "richard", "robert", "ryan", "sabrina", "sandra", "sara", "sarah", "sebastian", "simon", "sofia",
    "sophie", "stefan", "stephanie", "susanne", "sven", "thomas", "tim", "tobias", "tom", "uwe",
    "vanessa", "wilhelm", "william", "wolfgang",
    // cities (countries stay collectable -- they're real vocabulary)
    "amsterdam", "athen", "augsburg", "berlin", "bochum", "bonn", "bremen", "brüssel", "budapest",
    "dortmund", "dresden", "dublin", "duisburg", "düsseldorf", "edinburgh", "essen", "frankfurt",
    "hamburg", "hannover", "helsinki", "istanbul", "karlsruhe", "kassel", "kiel", "kopenhagen",
    "köln", "leipzig", "lissabon", "london", "madrid", "mannheim", "moskau", "münchen", "nürnberg",
    "oslo", "paris", "peking", "potsdam", "prag", "rom", "rostock", "stockholm", "stuttgart",
    "tokio", "warschau", "washington", "wien", "wiesbaden", "wuppertal", "zürich",
    // brands, products, platforms
    "adidas", "airbnb", "aldi", "amazon", "android", "anthropic", "apple", "audi", "babbel", "bmw",
    "chatgpt", "chrome", "claude", "deepl", "discord", "disney", "duolingo", "easyjet", "ebay",
    "edeka", "facebook", "fanta", "fifa", "firefox", "ford", "fortnite", "gmail", "google", "haribo",
    "honda", "ikea", "instagram", "iphone", "ipad", "joytan", "lego", "lidl", "linkedin", "lufthansa",
    "marvel", "mastercard", "mcdonalds", "mercedes", "microsoft", "milka", "minecraft", "netflix",
    "nike", "nintendo", "nutella", "openai", "opel", "paypal", "pepsi", "pinterest", "playmobil",
    "playstation", "pokemon", "porsche", "puma", "reddit", "rewe", "roblox", "rossmann", "ryanair",
    "safari", "samsung", "shein", "sky", "slack", "snapchat", "spotify", "starbucks", "telegram",
    "telekom", "temu", "tesla", "tiktok", "toyota", "twitch", "twitter", "uber", "visa", "vodafone",
    "volkswagen", "whatsapp", "wikipedia", "windows", "xbox", "youtube", "zalando", "zara",
    // web and file fragments
    "api", "com", "html", "http", "https", "jpg", "mp3", "mp4", "net", "org", "pdf", "php", "png",
    "url", "www",
    // English filler that shows up inside otherwise-German sentences
    "and", "app", "apps", "are", "audio", "beginner", "best", "but", "can", "channel", "comment",
    "comments", "could", "course", "courses", "download", "english", "follow", "for", "free", "from",
    "german", "get", "got", "has", "have", "hello", "here", "how", "intermediate", "just", "learn",
    "learning", "lesson", "lessons", "like", "more", "most", "new", "not", "one", "phrases", "please",
    "sentences", "share", "should", "some", "subscribe", "than", "thank", "thanks", "that", "the",
    "their", "them", "then", "there", "they", "this", "time", "two", "video", "videos", "vocabulary",
    "welcome", "were", "what", "when", "where", "which", "who", "why", "with", "words", "would",
    "you", "your",
  ]);

  function looksLikeRealGermanCandidate(token) {
    if (token.length < 3 || token.length > 30) return false;
    if (!GERMAN_LETTER_RE.test(token)) return false;
    if (/^[A-ZÄÖÜ]+$/.test(token)) return false; // ALLCAPS: acronym/brand, not a word to learn
    // An uppercase letter anywhere past the first is brand-case (YouTube,
    // iPhone, TikTok, PayPal) -- German words never capitalise mid-word.
    if (/[A-ZÄÖÜ]/.test(token.slice(1))) return false;
    // Apostrophes are English contractions and possessives ("don't",
    // "Leon's"); the rare German ones ("geht's") aren't dictionary forms
    // worth collecting either.
    if (/['’]/.test(token)) return false;
    if (STOPWORDS.has(token.toLowerCase())) return false;
    if (NOT_VOCAB.has(token.toLowerCase())) return false;
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

  function makeGlossSpan(originalText, gloss, direction, germanText) {
    const span = document.createElement("span");
    span.className = "micheon-gloss-word";
    span.dataset.micheon = "1";
    span.dataset.micheonGloss = gloss;
    span.dataset.micheonDir = direction;
    span.dataset.micheonDe = germanText;
    span.tabIndex = 0;
    span.textContent = originalText;
    return span;
  }

  // ── tooltip ───────────────────────────────────────────────────────────
  // One shared element at the document root (position: fixed), placed from
  // the hovered word's viewport rect and clamped to the screen. See the
  // stylesheet for why this replaced a per-word ::after tooltip. Attached
  // to <html> rather than <body>: a transformed ancestor re-anchors
  // position:fixed to itself, and pages transform <body> more often than
  // they transform the root element.
  let tipEl = null;
  let tipTextEl = null;
  let tipSpeakEl = null;
  let hideTimer = null;

  function ensureTip() {
    if (tipEl && tipEl.isConnected) return tipEl;
    tipEl = document.createElement("div");
    tipEl.className = "micheon-gloss-tip";
    tipEl.dataset.micheon = "1";
    tipTextEl = document.createElement("span");
    tipTextEl.className = "micheon-gloss-tip-text";
    tipSpeakEl = document.createElement("button");
    tipSpeakEl.className = "micheon-gloss-tip-speak";
    tipSpeakEl.type = "button";
    tipSpeakEl.title = "Play the German";
    tipSpeakEl.textContent = "🔊";
    tipSpeakEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = tipEl?.dataset.micheonDe || "";
      if (text) chrome.runtime.sendMessage({ type: "micheon-tts", text });
    });
    tipEl.appendChild(tipTextEl);
    tipEl.appendChild(tipSpeakEl);
    // The tip itself cancels its own dismissal, so the speaker button is
    // actually reachable -- the cursor has to cross the gap between word
    // and tip without the tip vanishing under it.
    tipEl.addEventListener("mouseenter", cancelHide);
    tipEl.addEventListener("mouseleave", scheduleHide);
    document.documentElement.appendChild(tipEl);
    return tipEl;
  }

  function cancelHide() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function scheduleHide() {
    cancelHide();
    hideTimer = setTimeout(() => {
      if (tipEl) tipEl.classList.remove("micheon-visible");
    }, 250);
  }

  function showTip(word) {
    const tip = ensureTip();
    cancelHide();
    tipTextEl.textContent = word.dataset.micheonGloss || "";
    tip.dataset.micheonDe = word.dataset.micheonDe || "";
    if (!tipTextEl.textContent) return;
    const rect = word.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return; // collapsed/hidden word
    // Measure while invisible, then clamp into the viewport. The stylesheet
    // resets this element with `all: unset !important`, which outranks plain
    // inline styles -- position must be set with important priority too.
    tip.classList.remove("micheon-visible");
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    let left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(4, Math.min(left, window.innerWidth - tw - 4));
    let top = rect.top - th - 6;
    if (top < 4) top = rect.bottom + 6;
    tip.style.setProperty("left", `${Math.round(left)}px`, "important");
    tip.style.setProperty("top", `${Math.round(top)}px`, "important");
    tip.classList.add("micheon-visible");
  }

  function initTooltip() {
    document.addEventListener("mouseover", (e) => {
      const word = e.target?.closest?.(".micheon-gloss-word");
      if (word) showTip(word);
    }, true);
    document.addEventListener("mouseout", (e) => {
      if (e.target?.closest?.(".micheon-gloss-word")) scheduleHide();
    }, true);
    document.addEventListener("focusin", (e) => {
      const word = e.target?.closest?.(".micheon-gloss-word");
      if (word) showTip(word);
    }, true);
    document.addEventListener("focusout", scheduleHide, true);
    // A fixed-position tooltip doesn't follow its word when the page
    // scrolls out from under the cursor -- hide instead of drifting.
    window.addEventListener("scroll", () => {
      cancelHide();
      if (tipEl) tipEl.classList.remove("micheon-visible");
    }, { capture: true, passive: true });
  }

  function processTextNode(node, germanMode) {
    if (processed.has(node)) return;
    const text = node.nodeValue;
    if (!text || text.trim().length < 3) return;

    WORD_RE.lastIndex = 0;
    let match;
    let lastIndex = 0;
    let fragment = null; // built lazily -- most text nodes match nothing
    const plainParts = []; // our own passthrough text nodes, pre-marked processed

    while ((match = WORD_RE.exec(text))) {
      const token = match[0];
      const lower = token.toLowerCase();
      let hit = null;
      let direction = null;

      if (germanMode) {
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
          const sentence = extractSentence(node, match.index);
          // On YouTube the container was judged German as a whole, but its
          // sentences individually may not be -- skip the ones that aren't.
          if (!IS_YOUTUBE || sentenceLooksGerman(sentence)) {
            missingCounts.set(lower, (missingCounts.get(lower) || 0) + 1);
            if (!missingExamples.has(lower)) {
              missingExamples.set(lower, sentence);
            }
            scheduleFlush();
          }
        }
      } else {
        hit = byEn.get(lower);
        direction = "en-de";
      }

      if (hit) {
        if (!fragment) fragment = document.createDocumentFragment();
        const plain = document.createTextNode(text.slice(lastIndex, match.index));
        plainParts.push(plain);
        fragment.appendChild(plain);
        fragment.appendChild(makeGlossSpan(
          token,
          germanMode ? hit.en : hit.deDisplay,
          direction,
          germanMode ? token : hit.deDisplay
        ));
        lastIndex = match.index + token.length;
      }
    }

    if (fragment) {
      const tail = document.createTextNode(text.slice(lastIndex));
      plainParts.push(tail);
      fragment.appendChild(tail);
      // The passthrough text pieces were already fully scanned as part of
      // this node -- mark them processed so a rescan of the same container
      // (YouTube re-scans on navigation) can't double-count missing words
      // that happened to sit next to a glossed one.
      for (const part of plainParts) processed.add(part);
      node.parentNode?.replaceChild(fragment, node);
    } else {
      processed.add(node);
    }
  }

  function walk(root, germanMode) {
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
        processTextNode(nodes[i], germanMode);
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
            walk(added, isGermanPage);
          } else if (added.nodeType === Node.TEXT_NODE) {
            processTextNode(added, isGermanPage);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── YouTube mode ──────────────────────────────────────────────────────
  // Only the watch page's title + description containers, each judged by
  // its own text. The rest of the page (chrome, comments, sidebar) is
  // never scanned: the account's interface language and other people's
  // usernames aren't vocabulary.
  function scanYouTube() {
    if (location.pathname !== "/watch") return;
    const containers = [];
    for (const sel of YT_SCAN_SELECTORS) {
      for (const el of document.querySelectorAll(sel)) containers.push(el);
    }
    if (containers.length === 0) return;
    // Judge the VIDEO once, from the richest text present, then gloss every
    // container. YouTube keeps two copies of the description -- the full
    // text (hidden until "…more") and a one-line collapsed snippet -- and
    // judging each element on its own text left the snippet unglossed:
    // one line of a German vocab list can't pass a language check that the
    // full description passes easily. Whether this video is German isn't a
    // per-element question.
    const combined = containers.map((el) => el.textContent || "").join("\n");
    if (!looksGermanBlock(combined)) return;
    ytGermanFound = true;
    for (const el of containers) walk(el, true);
  }

  function scheduleYouTubeScan() {
    // The title/description mount late and keep mutating (the "…more"
    // expansion swaps in the full text), so this must re-scan over time --
    // but as a THROTTLE, not a debounce. A debounce that resets on every
    // mutation never fires on YouTube, which mutates continuously (player
    // progress, live comment stream); verified live, where the visible
    // description snippet stayed ungloosed because the quiet window the
    // debounce waited for never came, so the snippet was never glossed.
    // Node-level dedup keeps the repeated
    // scans cheap.
    if (ytScanTimer) return; // one already queued -- let it run
    ytScanTimer = setTimeout(() => {
      ytScanTimer = null;
      scanYouTube();
    }, 1200);
  }

  function initYouTube() {
    document.addEventListener("yt-navigate-finish", () => {
      ytGermanFound = false;
      scheduleYouTubeScan();
    });
    const observer = new MutationObserver(scheduleYouTubeScan);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleYouTubeScan();
  }

  // ── popup status ──────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "micheon-page-status") return undefined;
    sendResponse({
      ok: true,
      youtube: IS_YOUTUBE,
      watchPage: !IS_YOUTUBE || location.pathname === "/watch",
      german: IS_YOUTUBE ? ytGermanFound : isGermanPage,
      glossed: document.querySelectorAll(".micheon-gloss-word").length,
    });
    return undefined;
  });

  async function init() {
    const stored = await chrome.storage.local.get("settings");
    settings = { ...settings, ...(stored.settings || {}) };
    if (!settings.glossEnabled) return;

    const url = chrome.runtime.getURL("data/words.json");
    const words = await fetch(url).then((r) => r.json());
    buildIndexes(words);
    initTooltip();

    if (IS_YOUTUBE) {
      initYouTube();
    } else {
      isGermanPage = detectGerman();
      walk(document.body, isGermanPage);
      observeNewContent();
    }
    window.addEventListener("beforeunload", flushMissingVocab);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
