import { Part, Phrase, TranslationQuestion } from "./types";
import { curatedTopics } from "./phrasebank";
import { normalize } from "./api";
import tatoebaRaw from "./tatoeba.de-en.json";
import { getLearningDirection, type LearningDirection } from "./direction";

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
  short?: string;
  shortEn?: string;
  use?: string;
}

// Corpus translations are useful raw material, but learner-facing copy must
// be natural and preserve the speaker. Keep confident, reviewed corrections
// here instead of teaching a technically possible but confusing construction
// or silently changing German "ich" into English "you/we".
const TATOEBA_CORRECTIONS: Record<string, Partial<RawSentence>> = {
  "Das ist nicht, was ich sagte.": {
    de: "Das ist nicht das, was ich gesagt habe.",
    en: "That's not what I said.",
    short: "Das hab ich nicht gesagt.",
    shortEn: "That's not what I said. / I didn't say that.",
    use: "In everyday conversation, Germans normally say 'Das hab ich nicht gesagt.' The complete form uses 'das, was' and 'gesagt habe'.",
  },
  "Das stimmt nicht. Das ist nicht, was ich gesagt habe.": {
    de: "Das stimmt nicht. Das ist nicht das, was ich gesagt habe.",
    en: "You're wrong. That isn't what I said.",
    short: "Das stimmt nicht. Das hab ich nicht gesagt.",
    shortEn: "That's not true. I didn't say that.",
    use: "In everyday conversation, the direct 'Das hab ich nicht gesagt' sounds more natural. The complete version needs 'das, was'.",
  },
  "Das ist nicht, was ich denke.": {
    de: "Das ist nicht das, was ich denke.",
    short: "So denke ich nicht.",
    shortEn: "That's not how I see it. / That's not what I think.",
  },
  "Das ist nicht, was ich gesehen habe.": {
    de: "Das ist nicht das, was ich gesehen habe.",
  },
  "Das ist nicht, was ich dachte.": {
    de: "Das ist nicht das, was ich gedacht habe.",
    short: "Das hab ich nicht gedacht.",
    shortEn: "That's not what I thought. / I didn't think that.",
  },
  "Das ist nicht, was ich gehört habe.": {
    de: "Das ist nicht das, was ich gehört habe.",
  },
  "Das ist nicht, was ich tun werde.": {
    de: "Das ist nicht das, was ich tun werde.",
    short: "Das werde ich nicht tun.",
    shortEn: "That's not what I'm going to do. / I won't do that.",
  },
  "Das ist nicht, was er gesagt hat.": {
    de: "Das ist nicht das, was er gesagt hat.",
    short: "Das hat er nicht gesagt.",
    shortEn: "That's not what he said. / He didn't say that.",
  },
  "Das ist nicht, was ich sehen will.": {
    de: "Das ist nicht das, was ich sehen will.",
  },
  "Das ist nicht, was ich meinte.": {
    de: "Das ist nicht das, was ich gemeint habe.",
    short: "So hab ich das nicht gemeint.",
    shortEn: "That's not what I meant. / That's not how I meant it.",
  },
  "Das ist nicht, was ich suche.": {
    de: "Das ist nicht das, was ich suche.",
    short: "Das suche ich nicht.",
    shortEn: "That's not what I'm looking for. / I'm not looking for that.",
  },
  "Das ist nicht, was wir tun müssen.": {
    de: "Das ist nicht das, was wir tun müssen.",
  },
  "Das ist nicht, was ich bestellt habe.": {
    de: "Das ist nicht das, was ich bestellt habe.",
    short: "Das hab ich nicht bestellt.",
    shortEn: "This is not what I ordered. / I didn't order this.",
  },
  "Das ist nicht, was ich suchte.": {
    de: "Das ist nicht das, wonach ich gesucht habe.",
  },
  "Ist das nicht, was ich gesagt habe?": {
    de: "Ist das nicht das, was ich gesagt habe?",
    short: "Hab ich das nicht gesagt?",
    shortEn: "Isn't that what I said? / Didn't I say that?",
  },
  "Ist das nicht, was du willst?": {
    de: "Ist das nicht das, was du willst?",
  },
  "Ist das nicht, was sie wollen?": {
    de: "Ist das nicht das, was sie wollen?",
  },
  "Das ist nicht, warum ich hier bin.": {
    de: "Das ist nicht der Grund, warum ich hier bin.",
  },
  "Es ist nicht, wie du denkst.": {
    de: "Es ist nicht so, wie du denkst.",
  },
  "Das ist nicht, wie wir denken.": {
    de: "So denken wir nicht.",
  },
  "Das ist, wie ich es erfahren habe.": {
    de: "Daher weiß ich das.",
  },
  "Das ist, wo ich sein möchte.": {
    de: "Da möchte ich sein.",
  },
  "Das ist genau, was ich meine.": {
    de: "Das ist genau das, was ich meine.",
    short: "Genau das meine ich.",
    shortEn: "That's exactly what I mean.",
  },
  "Kann ich essen?": {
    de: "Kann ich das essen?",
    en: "Can I eat this? / Can I eat?",
  },
  "Ich glaube nicht, dass es gut für dich ist, ihn zu sehen.": {
    en: "I don't think it's good for you to see him. / I don't think seeing him is good for you.",
  },
  "Habe ich dir versprochen, dass ich das tun würde?": {
    en: "Did I promise you I'd do that? / Did I promise that I would do that?",
  },
  "Ich weiß, dass ich ohne Sie nicht leben kann.": {
    en: "I know I can't live without you.",
  },
  "Ich weiß, dass ich ohne dich nicht leben kann.": {
    en: "I know I can't live without you.",
  },
  "Ich weiß, dass ich ohne euch nicht leben kann.": {
    en: "I know I can't live without you.",
  },
  "Ich wollte nicht, dass das passiert.": {
    en: "I didn't want that to happen.",
  },
  "Wenn Sie nicht zu mir kommen, komme ich zu Ihnen.": {
    en: "If you don't come to me, I'll come to you.",
  },
  "Wenn ihr nicht zu mir kommt, komme ich zu euch.": {
    en: "If you don't come to me, I'll come to you.",
  },
  "Wenn du nicht zu mir kommst, komme ich zu dir.": {
    en: "If you don't come to me, I'll come to you.",
  },
  "Von wem haben Sie es, dass Sie das nicht müssen?": {
    en: "Who told you that you didn't need to do that?",
  },
  "Ich will das nicht so machen.": {
    en: "I don't want to do it that way.",
  },
  "Ich glaube, dass es wahr ist.": {
    en: "I believe that's true.",
  },
  "Ich weiß, dass dir das wichtig ist.": {
    en: "I know that's important to you.",
  },
  "Werden wir das nicht tun?": {
    en: "Aren't we going to do that?",
  },
  "Das ist nicht, was ich hören wollte.": {
    de: "Das ist nicht das, was ich hören wollte.",
    en: "That's not what I wanted to hear. / This isn't what I wanted to hear.",
  },
  "Wir sind uns nicht ganz sicher, was es ist.": {
    en: "We're not exactly sure what it is.",
  },
  "Sie sollen wissen, dass ich das nicht tun werde.": {
    en: "You should know that I won't do that.",
  },
};

const tatoebaSentences = (tatoebaRaw as RawSentence[]).map(s => {
  const correction = TATOEBA_CORRECTIONS[s.de];
  return correction ? { ...s, ...correction } : s;
});

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
  learningDirections?: LearningDirection[];
  coachingLanguage?: "de" | "en" | "both";
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
    learningDirections: meta.learningDirections,
    coachingLanguage: meta.coachingLanguage,
  };
}

/** Curated phrasebank → themed lesson parts (keys like "cb-greetings"). */
export function buildCuratedParts(direction: LearningDirection = getLearningDirection()): Record<string, Part> {
  const out: Record<string, Part> = {};
  for (const topic of curatedTopics) {
    if (topic.learningDirections && !topic.learningDirections.includes(direction)) continue;
    out[topic.id] = buildPartFromPhrases(
      {
        label: topic.label,
        level: topic.level,
        theme: topic.theme,
        description: topic.description,
        focus: topic.focus,
        learningDirections: topic.learningDirections,
        coachingLanguage: topic.coachingLanguage,
      },
      topic.phrases
    );
  }
  return out;
}

function determineUse(de: string): string {
  if (de === "Ist es Zeit?") {
    return "Uncommon (better: Ist es so weit? / Ist es an der Zeit?)";
  }
  if (de === "Wie war das?") {
    return "Uncommon (better: Wie bitte?)";
  }
  if (de === "Das hat Zeit.") {
    return "Uncommon / Formal (better: Das kann warten)";
  }
  if (de === "Dich will ich.") {
    return "Uncommon / Poetic inversion (better: Ich will dich)";
  }
  if (/^Die (kommen nicht|wissen das|schaffen das|lieben das|sind nicht hier|sind nicht gut|hören nicht zu|verstehen das nicht)\./.test(de)) {
    const betterForm = de.replace(/^Die /, "Sie ");
    return `Colloquial / Can sound disrespectful (better: ${betterForm})`;
  }
  if (de === "Ich will Zeit.") {
    return "Uncommon phrasing (better: Ich brauche Zeit)";
  }
  return "Real-world sentence";
}

/**
 * A "word" is a whitespace token containing at least one letter or digit —
 * so bare punctuation tokens (a stray "." or "„") don't inflate the count.
 */
function wordCount(s: string): number {
  return String(s ?? "").trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/**
 * The corpus is full of trivial 2-4 word fragments ("Ich wollte das.",
 * "Das ist es.") that teach almost nothing about German word order. The
 * Tatoeba tier's whole job is "how real full sentences are built," so it
 * only takes sentences of at least this many words. Genuinely useful short
 * phrases (greetings, reactions, idioms) live in the hand-curated packs
 * instead, where they carry proper usage notes.
 */
const TATOEBA_MIN_WORDS = 5;

/** Tatoeba slice → "real sentence" packs grouped by level (keys like "tatoeba-a1-1"). */
export function buildTatoebaParts(perPack = 50): Record<string, Part> {
  const byLevel: Record<string, RawSentence[]> = {};
  for (const s of tatoebaSentences) {
    if (wordCount(s.de) < TATOEBA_MIN_WORDS) continue;   // no trivial fragments
    let targetLevel = s.level;
    if (s.de === "Wie war das?") targetLevel = "B2";
    if (s.de === "Das hat Zeit.") targetLevel = "B1";
    if (s.de === "Dich will ich.") targetLevel = "B2";
    if (s.de === "Ich will Zeit.") targetLevel = "B1";
    if (/^Die (kommen nicht|wissen das|schaffen das|lieben das|sind nicht hier|sind nicht gut|hören nicht zu|verstehen das nicht)\./.test(s.de)) {
      targetLevel = "B2";
    }
    (byLevel[targetLevel] ??= []).push({ ...s, level: targetLevel });
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
        use: s.use || determineUse(s.de),
        short: s.short,
        shortEn: s.shortEn,
      }));
      const key = `${TATOEBA_PREFIX}-${level.toLowerCase()}-${packNo}`;
      out[key] = buildPartFromPhrases(
        {
          label: `Sentences ${level} · ${packNo}`,
          level,
          theme: `Real sentences ${level} · Set ${packNo}`,
          description:
            "Authentic German sentences with English translations — real practice at this level.",
          focus: "Absorb how real, everyday sentences are built at this level.",
        },
        phrases
      );
    }
  }
  return out;
}

/**
 * Everything bundled, in display order: curated lessons first.
 * Blueprint parts are merged before these by the caller.
 */
export function buildBundledParts(direction: LearningDirection = getLearningDirection()): Record<string, Part> {
  return buildCuratedParts(direction);
}

/** Keep direction-specific packs out of every downstream surface in one pass. */
export function filterPartsForLearningDirection<T extends Part>(
  parts: Record<string, T>,
  direction: LearningDirection = getLearningDirection()
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(parts).filter(([, part]) =>
      !part.learningDirections || part.learningDirections.includes(direction)
    )
  );
}

/** Flat pool of every bundled sentence (curated only) for games / review. */
export function getAllBundledSentences(direction: LearningDirection = getLearningDirection()): Phrase[] {
  return curatedTopics
    .filter((topic) => !topic.learningDirections || topic.learningDirections.includes(direction))
    .flatMap((topic) => topic.phrases);
}

/** Count of bundled sentences, for stats/labels. */
export const BUNDLED_SENTENCE_COUNT =
  curatedTopics.reduce((n, t) => n + t.phrases.length, 0);
