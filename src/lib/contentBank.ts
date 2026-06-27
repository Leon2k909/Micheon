import { Part, Phrase, TranslationQuestion } from "./types";
import { curatedTopics } from "./phrasebank";
import { normalize } from "./api";
import tatoebaRaw from "./tatoeba.de-en.json";

/**
 * Bundled, always-available content.
 *
 * Two offline sources are turned into the app's standard `Part` shape:
 *   1. The hand-curated phrasebank (curatedTopics) — themed teaching lessons.
 *   2. A filtered slice of the Tatoeba corpus — thousands of real sentences.
 *
 * This is the reliability floor: it works with no network at all. The remote
 * APIs in api.ts only ever merge *on top* of what these builders produce.
 */

interface RawSentence {
  de: string;
  en: string;
  level: string;
}

const tatoebaSentences = tatoebaRaw as RawSentence[];

const TATOEBA_PREFIX = "tatoeba";
const LEVEL_ORDER = ["A1", "A2", "B1", "B2"];

/** A part whose nav card should be grouped with the bulk "library", not the core path. */
export function isBulkPartKey(key: string) {
  return key.startsWith("wordbank") || key.startsWith(TATOEBA_PREFIX);
}

/** Items a part contributes to study (words + sentences), for honest UI counts. */
export function partItemCount(part: Part) {
  return (part.vocab?.length ?? 0) + (part.phrases?.length ?? 0);
}

interface PartMeta {
  label: string;
  level: string;
  theme: string;
  description: string;
  focus: string;
}

function buildPartFromPhrases(meta: PartMeta, phrases: Phrase[]): Part {
  const usable = phrases.filter((p) => p.de?.trim() && p.en?.trim());

  const translationQuestions: TranslationQuestion[] = usable.slice(0, 8).map((p) => ({
    prompt: `Translate: "${p.en}"`,
    answers: [normalize(p.de)],
    sample: p.de,
    explain: p.use || "Bundled phrase.",
  }));

  return {
    label: meta.label,
    level: meta.level,
    theme: meta.theme,
    description: meta.description,
    focus: meta.focus,
    vocab: [],
    articleQuestions: [],
    translationQuestions,
    // No synthetic dialogues: these are standalone sentences, not real exchanges.
    dialogues: [],
    phrases: usable,
  };
}

/** Curated phrasebank → themed lesson parts (keys like "cb-greetings"). */
export function buildCuratedParts(): Record<string, Part> {
  const out: Record<string, Part> = {};
  for (const topic of curatedTopics) {
    out[topic.id] = buildPartFromPhrases(
      {
        label: topic.label,
        level: topic.level,
        theme: topic.theme,
        description: topic.description,
        focus: topic.focus,
      },
      topic.phrases
    );
  }
  return out;
}

/** Tatoeba slice → "real sentence" packs grouped by level (keys like "tatoeba-a1-1"). */
export function buildTatoebaParts(perPack = 50): Record<string, Part> {
  const byLevel: Record<string, RawSentence[]> = {};
  for (const s of tatoebaSentences) {
    (byLevel[s.level] ??= []).push(s);
  }

  const out: Record<string, Part> = {};
  for (const level of LEVEL_ORDER) {
    const items = byLevel[level] ?? [];
    let packNo = 0;
    for (let i = 0; i < items.length; i += perPack) {
      packNo += 1;
      const chunk = items.slice(i, i + perPack);
      const phrases: Phrase[] = chunk.map((s) => ({
        de: s.de,
        en: s.en,
        use: "Real-world sentence",
      }));
      const key = `${TATOEBA_PREFIX}-${level.toLowerCase()}-${packNo}`;
      out[key] = buildPartFromPhrases(
        {
          label: `Sentences ${level} · ${packNo}`,
          level,
          theme: `Real sentences ${level} · Set ${packNo}`,
          description:
            "Authentic German sentences with English translations, sourced from the open Tatoeba corpus.",
          focus: "Absorb how real, everyday sentences are built at this level.",
        },
        phrases
      );
    }
  }
  return out;
}

/**
 * Everything bundled, in display order: curated lessons first, then the
 * Tatoeba sentence library. Blueprint parts are merged before these by the caller.
 */
export function buildBundledParts(): Record<string, Part> {
  return {
    ...buildCuratedParts(),
    ...buildTatoebaParts(),
  };
}

/** Flat pool of every bundled sentence (curated + Tatoeba) for games / review. */
export function getAllBundledSentences(): Phrase[] {
  const curated = curatedTopics.flatMap((t) => t.phrases);
  const tatoeba: Phrase[] = tatoebaSentences.map((s) => ({
    de: s.de,
    en: s.en,
    use: "Real-world sentence",
  }));
  return [...curated, ...tatoeba];
}

/** Count of bundled sentences, for stats/labels. */
export const BUNDLED_SENTENCE_COUNT =
  curatedTopics.reduce((n, t) => n + t.phrases.length, 0) + tatoebaSentences.length;
