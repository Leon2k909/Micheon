/**
 * The vocabulary data uses a handful of descriptive labels rather than one
 * strict taxonomy (for example, "plural noun" and "spoken verb"). Keep the
 * tracker filter useful by matching those labels into broad, learner-facing
 * groups while allowing a word to match more than one group when appropriate.
 */
export type WordPartOfSpeechFilter =
  | "all"
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "connector"
  | "interjection"
  | "phrase"
  | "number"
  | "other";

export const WORD_PART_OF_SPEECH_FILTERS: Array<{
  key: WordPartOfSpeechFilter;
  label: string;
}> = [
  { key: "all", label: "All parts of speech" },
  { key: "noun", label: "Nouns" },
  { key: "verb", label: "Verbs" },
  { key: "adjective", label: "Adjectives" },
  { key: "adverb", label: "Adverbs" },
  { key: "pronoun", label: "Pronouns" },
  { key: "preposition", label: "Prepositions" },
  { key: "connector", label: "Connectors" },
  { key: "interjection", label: "Interjections" },
  { key: "phrase", label: "Phrases & idioms" },
  { key: "number", label: "Numbers & amounts" },
  { key: "other", label: "Other" },
];

const PART_OF_SPEECH_PATTERNS: Record<Exclude<WordPartOfSpeechFilter, "all" | "other">, RegExp> = {
  noun: /\bnoun\b/u,
  verb: /\bverb\b/u,
  adjective: /\badjective\b/u,
  adverb: /\badverb\b/u,
  pronoun: /\bpronoun\b/u,
  preposition: /\bpreposition\b/u,
  connector: /\b(?:connector|conjunction)\b/u,
  interjection: /\b(?:interjection|spoken reaction|spoken reply)\b/u,
  phrase: /\b(?:phrase|idiom|spoken word|fixed phrase)\b/u,
  number: /\b(?:numeral|number|amount word)\b/u,
};

const normalisePartOfSpeech = (value: string | undefined): string =>
  String(value ?? "").trim().toLocaleLowerCase("en-GB");

/** Return whether a vocabulary label belongs to a tracker filter group. */
export function wordMatchesPartOfSpeech(
  value: string | undefined,
  filter: WordPartOfSpeechFilter
): boolean {
  if (filter === "all") return true;
  const normalised = normalisePartOfSpeech(value);
  if (filter === "other") {
    return !Object.values(PART_OF_SPEECH_PATTERNS).some((pattern) => pattern.test(normalised));
  }
  return PART_OF_SPEECH_PATTERNS[filter].test(normalised);
}
