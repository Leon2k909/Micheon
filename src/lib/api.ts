import { getCachedDictionaryEntry, setCachedDictionaryEntry } from "./dictionaryCache";
import { 
  allPartBlueprints, 
  entryFallbacks, 
  REMOTE_GERMAN_WORD_LIST_URLS, 
  REMOTE_CATALOG_MAX_STORED 
} from "./data";
import { Blueprint, Part, VocabItem } from "./types";

/** fetch() that always rejects/aborts after `ms`, so a slow host can't hang a load. */
async function fetchWithTimeout(url: string, ms = 6000, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function normalize(text: string) {
  return String(text ?? "").toLowerCase().trim().replace(/[.!?]/g, "").replace(/\s+/g, " ");
}

export function normalizeLookup(text: string) {
  return String(text ?? "").toLowerCase().trim().replace(/["""''.,!?;:()]/g, "").replace(/\s+/g, " ");
}

export function capitalizeWord(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toGermanDisplayText(text: string) {
  if (!text) return text;
  let result = String(text);
  result = result
    .replace(/Ã„/g, "Ä")
    .replace(/Ã¤/g, "ä")
    .replace(/Ã–/g, "Ö")
    .replace(/Ã¶/g, "ö")
    .replace(/Ãœ/g, "Ü")
    .replace(/Ã¼/g, "ü")
    .replace(/ÃŸ/g, "ß")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€œ|â€œ|â€ž/g, "\"")
    .replace(/â€ /g, "\"")
    .replace(/â€˜|â€™/g, "'")
    .replace(/Â·/g, "·")
    .replace(/Ae/g, "Ä")
    .replace(/Oe/g, "Ö")
    .replace(/Ue/g, "Ü")
    .replace(/ae/g, "ä")
    .replace(/oe/g, "ö")
    .replace(/ue/g, "ü");

  const exactWordReplacements: [RegExp, string][] = [
    [/\bstrasse\b/gi, "Straße"],
    [/\bheißt\b/gi, "heißt"],
    [/\bweiss\b/gi, "weiß"],
    [/\bweisst\b/gi, "weißt"],
    [/\bgross\b/gi, "groß"],
  ];

  exactWordReplacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });

  return result;
}

export function toLearnerGloss(seedFallback: string, glosses: string[] | undefined, lookupWord: string) {
  if (seedFallback) return seedFallback;
  const options = (glosses ?? [])
    .flatMap((gloss) => String(gloss ?? "").split(/[;,]/))
    .map((item) => item.trim())
    .filter(Boolean);

  const ranked = options
    .filter((option) => option.length <= 40)
    .sort((left, right) => left.length - right.length);

  return ranked[0] ?? lookupWord ?? "";
}

export function hasDialogueSentenceShape(text: string) {
  return String(text ?? "").trim().split(/\s+/).filter(Boolean).length >= 2;
}

export async function resolveDictionaryEntry(word: string) {
  const key = normalizeLookup(word ?? "");
  if (key) {
    const cached = getCachedDictionaryEntry(key);
    if (cached) return cached;
  }
  
  const primary = await fetchFromKaikki(word);
  if (primary) {
    if (key) setCachedDictionaryEntry(key, primary);
    return primary;
  }
  
  const backup = await fetchFromWiktionary(word);
  if (backup) {
    if (key) setCachedDictionaryEntry(key, backup);
    return backup;
  }
  
  const fallback = getFallbackEntry(word);
  if (fallback && key) setCachedDictionaryEntry(key, fallback);
  return fallback;
}

function getFallbackEntry(word: string) {
  const key = normalizeLookup(word ?? "");
  return entryFallbacks[key] ?? entryFallbacks[toAsciiFallbackKey(key)] ?? null;
}

function toAsciiFallbackKey(key: string) {
  return String(key ?? "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

async function fetchFromKaikki(word: string) {
  const urls = buildKaikkiJsonUrlCandidates(word);
  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, 5000);
      if (!response.ok) continue;
      const text = await response.text();
      const parsed = parseJsonl(text);
      const best = pickBestEntry(parsed, word);
      if (best) return simplifyEntry(best);
    } catch { /* continue */ }
  }
  return null;
}

function buildKaikkiJsonUrlCandidates(word: string) {
  if (!word) return [];
  const trimmed = word.trim();
  const lower = normalizeLookup(word);
  const variants = Array.from(new Set([trimmed, lower, capitalizeWord(lower)].filter(Boolean)));
  const urls: string[] = [];
  variants.forEach((variant) => {
    const originalChars = Array.from(variant);
    if (originalChars.length > 0) {
      urls.push(`https://kaikki.org/dictionary/German/meaning/${encodeURIComponent(originalChars[0])}/${encodeURIComponent(originalChars.slice(0, 2).join(""))}/${encodeURIComponent(variant)}.jsonl`);
    }
    const normalizedVariant = normalizeLookup(variant);
    const normalizedChars = Array.from(normalizedVariant);
    if (normalizedChars.length > 0) {
      urls.push(`https://kaikki.org/dictionary/German/meaning/${encodeURIComponent(normalizedChars[0])}/${encodeURIComponent(normalizedChars.slice(0, 2).join(""))}/${encodeURIComponent(variant)}.jsonl`);
    }
  });
  return Array.from(new Set(urls));
}

function parseJsonl(text: string) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
}

function scoreEntry(entry: any, lookupWord: string) {
  let score = 0;
  if (normalizeLookup(entry.word ?? "") === normalizeLookup(lookupWord ?? "")) score += 100;
  if (entry.etymology_text) score += 8;
  if (entry.sounds?.some((s: any) => s.mp3_url || s.ogg_url)) score += 6;
  if (entry.forms?.length) score += 4;
  if (entry.senses?.some((s: any) => !(s.tags ?? []).includes("form-of") && (s.glosses?.length || s.raw_glosses?.length))) score += 30;
  if (entry.senses?.some((s: any) => s.examples?.length)) score += 5;
  if (entry.pos) score += 2;
  return score;
}

function pickBestEntry(entries: any[], lookupWord: string) {
  if (!entries.length) return null;
  return [...entries].sort((a, b) => scoreEntry(b, lookupWord) - scoreEntry(a, lookupWord))[0];
}

function simplifyEntry(entry: any) {
  if (!entry) return null;
  const audio = entry.sounds?.find((s: any) => s.mp3_url || s.ogg_url) ?? null;
  return {
    word: entry.word ?? "",
    pos: entry.pos ?? "",
    glosses: collectGlosses(entry),
    etymology: entry.etymology_text ?? "",
    audioUrl: audio?.mp3_url ?? audio?.ogg_url ?? "",
    formsCount: entry.forms?.filter((f: any) => f.form && f.form !== "no-table-tags").length ?? 0,
    examples: collectExamples(entry),
    exampleTranslations: collectExampleTranslations(entry),
  };
}

function collectGlosses(entry: any) {
  const glosses: string[] = [];
  const stripHtml = (s: string) => String(s ?? "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\.mw-parser-output[^[{]*([\s\S]*?\})/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
  const senses = entry?.senses ?? [];
  const nonFormSenses = senses.filter((s: any) => !(s.tags ?? []).includes("form-of"));
  const source = nonFormSenses.length > 0 ? nonFormSenses : senses;
  source.forEach((sense: any) => {
    const items = sense.glosses ?? sense.raw_glosses ?? [];
    items.forEach((gloss: string) => {
      const clean = stripHtml(gloss);
      if (clean && glosses.length < 4 && !glosses.includes(clean)) glosses.push(clean);
    });
  });
  return glosses;
}

function collectExamples(entry: any) {
  const examples: string[] = [];
  const senses = entry?.senses ?? [];
  senses.forEach((sense: any) => {
    (sense.examples ?? []).forEach((ex: any) => {
      const text = typeof ex?.text === "string" ? ex.text : null;
      if (text && examples.length < 2 && !examples.includes(text)) examples.push(text);
    });
  });
  return examples;
}

function collectExampleTranslations(entry: any) {
  const translations: string[] = [];
  const senses = entry?.senses ?? [];
  senses.forEach((sense: any) => {
    (sense.examples ?? []).forEach((ex: any) => {
      const english = typeof ex?.english === "string" ? ex.english : null;
      if (english && translations.length < 2 && !translations.includes(english)) translations.push(english);
    });
  });
  return translations;
}

async function fetchFromWiktionary(word: string) {
  if (!word) return null;
  try {
    const url = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
    const response = await fetchWithTimeout(url, 5000);
    if (!response.ok) return null;
    const data = await response.json();
    const deDefs = (data as any)?.de ?? [];
    if (!deDefs.length) return null;
    const stripHtml = (s: string) => String(s ?? "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\.mw-parser-output[^[{]*([\s\S]*?\})/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s+/g, " ").trim();
    const glosses = deDefs.flatMap((def: any) => def.definitions?.map((d: any) => stripHtml(d.definition)).filter(Boolean) ?? []).slice(0, 4);
    if (!glosses.length) return null;
    return { word, pos: deDefs[0]?.partOfSpeech ?? "", glosses, etymology: "", audioUrl: "", formsCount: 0, examples: [], exampleTranslations: [] };
  } catch { return null; }
}

export async function fetchRemoteGermanWordCatalog() {
  for (const url of REMOTE_GERMAN_WORD_LIST_URLS) {
    try {
      const response = await fetchWithTimeout(url, 8000);
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("json") || url.endsWith(".json")) {
        const data = await response.json();
        const words = (Array.isArray(data) ? data : [])
          .map((entry) => {
            if (typeof entry === "string") return entry;
            return entry?.word ?? entry?.german ?? entry?.de ?? "";
          })
          .map((word) => String(word ?? "").trim())
          .filter((word) => /^[A-Za-zÄÖÜäöüß-]+$/.test(word));
        if (words.length > 0) return words.slice(0, REMOTE_CATALOG_MAX_STORED);
        continue;
      }

      const text = await response.text();
      const words = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(/\s+/)[0] ?? "")
        .map((word) => String(word ?? "").trim())
        .filter((word) => /^[A-Za-zÄÖÜäöüß-]+$/.test(word));
      if (words.length > 0) return words.slice(0, REMOTE_CATALOG_MAX_STORED);
    } catch {
      continue;
    }
  }
  return [];
}

export async function fetchGermanApiVocabulary(levels = ["a1", "a2", "b1"], limitPerLevel = 250) {
  const apiKey = "demo-key-12345";
  const results: VocabItem[] = [];

  for (const level of levels) {
    try {
      const url = `https://german-language.onrender.com/vocab?level=${encodeURIComponent(level)}&limit=${limitPerLevel}`;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 4500);
      const response = await fetch(url, { headers: { "X-API-Key": apiKey }, signal: controller.signal });
      window.clearTimeout(timeout);
      if (!response.ok) continue;

      const payload = await response.json();
      const rows = Array.isArray(payload?.data) ? payload.data : [];

      rows.forEach((row: any) => {
        const german = String(row?.german ?? row?.de ?? "").trim();
        const english = String(row?.english ?? row?.en ?? "").trim();
        if (!german || !english) return;

        const gender = String(row?.gender ?? "").trim();
        const de = gender && !german.toLowerCase().startsWith(`${gender.toLowerCase()} `)
          ? `${gender} ${german}`
          : german;

        results.push({
          de: toGermanDisplayText(de),
          en: english,
          tip: String(row?.pos ?? "word").trim() || "word",
          lookup: german,
          example: toGermanDisplayText(String(row?.example_de ?? "").trim()),
          exampleEn: String(row?.example_en ?? "").trim(),
          pos: String(row?.pos ?? "").trim(),
        });
      });
    } catch {
      continue;
    }
  }

  return results;
}

const WOKABULARY_GERMAN_ENGLISH_CSV_URLS = [
  "https://wokabulary.com/assets/wordlists/en-de/en-de_communication.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_sentences.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_orientation.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_surrounding.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_shopping.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_food.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_transport.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_technology.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_time.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_health.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_personal-information.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_verb.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_adjective.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_color.csv",
  "https://wokabulary.com/assets/wordlists/en-de/en-de_numbers.csv",
];

export async function fetchWokabularyWordBank() {
  const results: VocabItem[] = [];

  for (const url of WOKABULARY_GERMAN_ENGLISH_CSV_URLS) {
    try {
      const response = await fetchWithTimeout(url, 6000);
      if (!response.ok) continue;

      const text = await response.text();
      text.split(/\r?\n/).forEach((line) => {
        const [german, english, note, tags] = line.split(";").map((value) => String(value ?? "").trim());
        if (!german || !english) return;

        const isSentence = /\s/.test(german.replace(/[.!?]/g, "").trim());
        results.push({
          de: toGermanDisplayText(german),
          en: english,
          tip: isSentence ? "phrase" : (tags?.split(",")[0]?.trim() || "word"),
          lookup: german,
          example: isSentence ? toGermanDisplayText(german) : "",
          exampleEn: isSentence ? english : "",
          pos: note || "",
        });
      });
    } catch {
      continue;
    }
  }

  return results;
}

export function buildApiPartFromResolved(blueprint: Blueprint, resolvedEntries: Record<string, any>): Part {
  const vocab: VocabItem[] = blueprint.seeds.map((seed) => {
    const entry = resolvedEntries[seed.lookup] ?? getFallbackEntry(seed.lookup);
    const learnerGloss = toLearnerGloss(seed.fallbackEn, entry?.glosses, seed.lookup);
    return {
      de: toGermanDisplayText(seed.de),
      en: learnerGloss,
      tip: seed.tip ?? entry?.pos ?? "word",
      lookup: seed.lookup,
      // Vocabulary lookups may enrich a word's gloss or part of speech, but
      // they must never inject an unreviewed sentence into a lesson.
      example: "",
      exampleEn: "",
      exampleFr: "",
      pos: entry?.pos ?? "",
      // usage note from the seed ("The word gamers actually say") — shown as
      // a chip in lessons and the tracker.
      use: (seed as any).use,
    };
  });

  const articleQuestions = blueprint.seeds.filter((seed) => seed.article).slice(0, 6).map((seed) => ({
    word: seed.de.replace(/^(der|die|das)\s+/i, ""),
    correct: seed.article!,
    hint: "Loaded from hardcoded vocabulary.",
  }));

  const translationQuestions = blueprint.seeds.slice(0, 4).map((seed) => {
    const entry = resolvedEntries[seed.lookup] ?? getFallbackEntry(seed.lookup);
    const promptText = toLearnerGloss(seed.fallbackEn, entry?.glosses, seed.lookup);
    return {
      prompt: `Translate: "${promptText}"`,
      answers: [normalize(seed.de), normalize(seed.lookup)],
      sample: toGermanDisplayText(seed.de),
      explain: `Hardcoded vocabulary item: ${seed.lookup}.`,
    };
  });

  // Sentences and dialogues are reviewed product content. Vocabulary seeds
  // provide words only; dictionary examples must never become lesson phrases.
  const phrases = Array.isArray(blueprint.phrases) ? [...blueprint.phrases] : [];
  const dialogues = Array.isArray(blueprint.dialogues) ? [...blueprint.dialogues] : [];

  return {
    label: blueprint.label, level: blueprint.level, theme: blueprint.theme,
    description: blueprint.description, focus: blueprint.focus,
    vocab, articleQuestions, translationQuestions, dialogues, phrases,
    learningDirections: blueprint.learningDirections,
    coachingLanguage: blueprint.coachingLanguage,
  };
}
