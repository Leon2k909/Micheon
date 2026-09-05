import { entryFallbacks } from "./data";
import { Blueprint, Part, VocabItem } from "./types";

export function normalize(text: string) {
  return String(text ?? "").toLowerCase().trim().replace(/[.!?]/g, "").replace(/\s+/g, " ");
}

function normalizeLookup(text: string) {
  return String(text ?? "").toLowerCase().trim().replace(/["""''.,!?;:()]/g, "").replace(/\s+/g, " ");
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
    .replace(/Â·/g, "·");
  // Repairing mojibake (the sequences above) is safe: those byte patterns
  // never occur in real German. Expanding the digraphs ae/oe/ue into
  // umlauts is NOT -- it used to happen here and it corrupted 580 authored
  // strings, because those letter pairs are ordinary German. It turned
  // "teuer" into "teür", "neuen" into "neün", "schauen" into "schaün",
  // "sauer" into "saür" and "bauen" into "baün": spellings that do not
  // exist, taught as if they did, and marked wrong when the learner typed
  // them correctly. Nothing in the content is ASCII-transliterated (checked
  // across all 20,068 authored German strings -- zero needed it), so the
  // expansion had nothing to gain and everything to break.
  // scripts/check-german-orthography.cjs holds this shut.

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

function toLearnerGloss(seedFallback: string, glosses: string[] | undefined, lookupWord: string) {
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

/**
 * A gloss like "development, trend" lists alternative meanings for the
 * learner to recognise — it was never meant to be typed back whole. The
 * translate step's matcher already accepts a "/"-joined target as
 * alternatives (see matchEnglishPhrase); this just puts word glosses into
 * that format instead of the comma/semicolon they're authored with, so
 * answering with any one listed meaning is graded correct.
 */
function toAnswerAlternates(gloss: string): string {
  const parts = String(gloss ?? "").split(/[;,]/).map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.join(" / ") : gloss;
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

export function buildApiPartFromResolved(blueprint: Blueprint, resolvedEntries: Record<string, any>): Part {
  const vocab: VocabItem[] = blueprint.seeds.map((seed) => {
    const entry = resolvedEntries[seed.lookup] ?? getFallbackEntry(seed.lookup);
    const learnerGloss = toLearnerGloss(seed.fallbackEn, entry?.glosses, seed.lookup);
    return {
      de: toGermanDisplayText(seed.de),
      en: toAnswerAlternates(learnerGloss),
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
      // "this seed teaches the primary sense" — decides which pack owns the
      // word's card when several teach it in different senses.
      core: (seed as any).core,
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
    writtenOnly: blueprint.writtenOnly,
  };
}
