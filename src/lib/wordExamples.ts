/**
 * Contextual example sentences for the Words tracker.
 *
 * A gloss tells the learner what a word maps to; it does not tell them when
 * the word is actually used — "aufheben" is "to pick up" until it means "to
 * abolish". The tracker therefore shows each word inside one REVIEWED course
 * sentence, with its translation, so the context travels with the card.
 *
 * Sources are strictly the sentences the course already teaches, read through
 * buildCatalog so learning-mode rewrites and the hand-written-examples-only
 * gate apply here exactly as they do in lessons. Nothing is fabricated: a
 * word whose lemma never appears verbatim in a reviewed sentence simply shows
 * no example. Inflected forms are NOT chased ("Häuser" does not serve
 * "das Haus") — a wrong-sense or wrong-form match would teach worse than
 * no match, and this surface has no reviewer.
 *
 * German capitalization is meaning-bearing: "steuern" (to control) and
 * "Steuern" (taxes) are different words that share letters. Lemma tokens and
 * their case therefore come from the card's reviewed display form (word.de,
 * not the dictionary lookup key, whose casing is unreviewed): a lowercase
 * lemma accepts lowercase or sentence-opening occurrences, a capitalized
 * lemma (noun) only capitalized ones. One reviewed exception: a nominalized
 * infinitive after a neuter trigger ("beim Entkalken") legitimately shows its
 * verb — but only when the sentence's English shares a meaning word with the
 * card, because "Aus dem Stillen" (the quiet one) must not serve "stillen"
 * (to breastfeed).
 *
 * This module only READS the catalog. It must never feed sentences back into
 * lessons or Listen — the word/sentence isolation contract in wordSession.ts
 * stays intact.
 */
import { buildCatalog } from "@/session";
import type { WordItem } from "@/lib/wordSession";

type WordExample = {
  /** The reviewed German sentence containing the word. */
  de: string;
  /** Its authored English translation. */
  en: string;
};

/** Placeholder tokens in idiom lemmas ("an etwas liegen") that name a slot,
 *  not a word — a real usage fills the slot, so they must not be required. */
const PLACEHOLDERS = new Set(["etwas", "etw", "jemand", "jemanden", "jemandem", "jdn", "jdm", "sich"]);

/** Articles inside idiom lemmas ("den Erwartungen gerecht werden") are
 *  structural: a real sentence may use another determiner ("ihren
 *  Erwartungen"), so they must not be required either. */
const ARTICLES = new Set(["der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines"]);

const tokenize = (text: string): string[] =>
  String(text ?? "")
    .toLocaleLowerCase("de-DE")
    .normalize("NFC")
    .split(/[^a-zäöüß]+/)
    .filter(Boolean);

const WORD_RE = /[a-zA-ZäöüßÄÖÜẞ]+/g;
/** Characters whose presence between two words starts a new sentence-like
 *  unit (sentence enders and quotes). Commas, colons, dashes, hyphens,
 *  apostrophes and parentheses do not: a capital after them is still a
 *  mid-sentence capital ("Vor der Reparatur: Daten sichern!" is the noun). */
const SENTENCE_BOUNDARY_RE = /[.!?…"„“”»«]/;

/** Words a neuter nominalized infinitive follows ("beim Entkalken", "das
 *  Pendeln", "als Beatmen"). Deliberately excludes non-neuter articles:
 *  "Die Steuern" and "einen Braten" are real nouns, not nominalizations. */
const NOMINALIZATION_TRIGGERS = new Set([
  "beim", "zum", "am", "vom", "im", "ins", "das", "dem", "ohne", "als",
  "mit", "nach", "vor", "durch", "für", "gegen", "übers", "ums", "aufs",
]);

const CASE_LOWER = 1;
const CASE_CAP_INITIAL = 2;
const CASE_CAP_MID = 4;
/** Mid-sentence capital directly after a nominalization trigger. */
export const CASE_CAP_NOMINALIZED = 8;

/**
 * Which case forms each token of a German sentence appears in, keyed by the
 * lowercased token. "Die Steuern fressen mich auf." reports steuern only as
 * a mid-sentence capital — the noun — so the verb card must not use it.
 */
export function germanTokenCaseForms(sentence: string): Map<string, number> {
  const text = String(sentence ?? "").normalize("NFC");
  const forms = new Map<string, number>();
  let lastEnd = 0;
  let first = true;
  let prev = "";
  for (const match of text.matchAll(WORD_RE)) {
    const raw = match[0];
    const gap = text.slice(lastEnd, match.index ?? 0);
    lastEnd = (match.index ?? 0) + raw.length;
    const atSentenceStart = first || SENTENCE_BOUNDARY_RE.test(gap);
    first = false;
    let bit: number;
    if (!/^[A-ZÄÖÜẞ]/.test(raw)) bit = CASE_LOWER;
    else if (atSentenceStart) bit = CASE_CAP_INITIAL;
    else bit = NOMINALIZATION_TRIGGERS.has(prev)
      ? CASE_CAP_MID | CASE_CAP_NOMINALIZED
      : CASE_CAP_MID;
    const key = raw.toLocaleLowerCase("de-DE");
    forms.set(key, (forms.get(key) ?? 0) | bit);
    prev = key;
  }
  return forms;
}

/** Case forms a lemma token may always take inside a sentence: a noun
 *  (capitalized lemma) must stay capitalized; anything else must appear
 *  lowercase, or capitalized only because it opens the sentence. A verb's
 *  nominalization (CASE_CAP_NOMINALIZED) is handled separately because it
 *  additionally needs the English senses to agree. */
export const acceptableCaseMask = (rawLemmaToken: string): number =>
  /^[A-ZÄÖÜẞ]/.test(rawLemmaToken)
    ? (CASE_CAP_INITIAL | CASE_CAP_MID)
    : (CASE_LOWER | CASE_CAP_INITIAL);

/** Function words create accidental matches ("court" and "dish" examples
 * both contain "a" or "the"), so only meaning-bearing English words may
 * disambiguate a German homonym. */
const ENGLISH_STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "but", "by",
  "do", "does", "for", "from", "had", "has", "have", "he", "her", "him", "his",
  "i", "in", "into", "is", "it", "its", "me", "my", "of", "on", "or", "our",
  "out", "she", "so", "some", "something", "that", "the", "their", "them",
  "there", "they", "this", "to", "up", "us", "was", "we", "were", "with",
  "without", "you", "your",
]);

const singularEnglishToken = (token: string): string => {
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && /(?:ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !/(?:ss|us|is)$/.test(token)) return token.slice(0, -1);
  return token;
};

/** All shapes a token might share with a gloss written in another form:
 *  "descaling" must meet "descale", "warmed" must meet "warm". Every
 *  plausible base is added — matching on any one of them is enough, and a
 *  wrong base ("teeth" from "teething") only ever adds a token nobody asks
 *  for. */
const englishTokenVariants = (token: string): string[] => {
  const variants = [token];
  const singular = singularEnglishToken(token);
  if (singular !== token) variants.push(singular);
  for (const [suffix, minLength] of [["ing", 6], ["ed", 5]] as const) {
    if (token.length < minLength || !token.endsWith(suffix)) continue;
    const base = token.slice(0, -suffix.length);
    variants.push(base, `${base}e`);
    if (base.length > 2 && base[base.length - 1] === base[base.length - 2]) {
      variants.push(base.slice(0, -1));
    }
  }
  return variants;
};

export const englishSenseTokens = (text: string): Set<string> => new Set(
  String(text ?? "")
    .toLocaleLowerCase("en-GB")
    .normalize("NFC")
    .split(/[^a-z]+/)
    .filter(Boolean)
    .filter((token) => !ENGLISH_STOPWORDS.has(token))
    .flatMap(englishTokenVariants)
);

/** The lemma's tokens in their ORIGINAL case, from the card's REVIEWED
 *  display form (article and placeholder slot-words dropped). The dictionary
 *  lookup key is deliberately not used here: its casing is unreviewed
 *  ("aufwärmen" ships lookup "Aufwärmen"), and idiom cards carry lookup keys
 *  like "Acht" whose lone token would match sentences that have nothing to
 *  do with the idiom ("Es ist halb acht."). */
export const rawLemmaTokens = (word: Pick<WordItem, "de" | "lookup">): string[] => {
  const base = String(word.de || word.lookup)
    .normalize("NFC")
    .replace(/^(der|die|das)\s+/i, "");
  const raws: string[] = [];
  for (const match of base.matchAll(WORD_RE)) {
    const lower = match[0].toLocaleLowerCase("de-DE");
    if (!PLACEHOLDERS.has(lower) && !ARTICLES.has(lower)) raws.push(match[0]);
  }
  return raws;
};

/** Reviewed same-case sense clashes. For these cards a sentence sharing no
 *  meaning word with the gloss is the OTHER sense — "Das ist der Hammer!"
 *  (that's amazing) must not serve the tool card, a cinema showing must not
 *  serve "die Vorstellung = idea". Sense overlap is required, so these cards
 *  show nothing rather than the wrong meaning. Keyed by lowercased lookup. */
const REQUIRES_SENSE_OVERLAP = new Set([
  "hammer", "abhängen", "abstimmen", "melden", "nüchtern", "zocken",
  "ausfallen", "folge", "verlängerung", "anlage", "verlegen", "ansatz",
  "erstatten", "stand", "stimmen", "anwendung", "träger", "eingehen",
  "prozess", "vorstellung",
]);

/** True when this card must not accept a zero-overlap example. */
export const exampleRequiresSenseOverlap = (word: Pick<WordItem, "de" | "lookup">): boolean =>
  REQUIRES_SENSE_OVERLAP.has(String(word.lookup || word.de).toLocaleLowerCase("de-DE").trim());

type Candidate = {
  de: string;
  en: string;
  tokens: Set<string>;
  /** Case forms each token appears in — see germanTokenCaseForms. */
  caseForms: Map<string, number>;
  /** Meaning-bearing words from the reviewed English translation. */
  senseTokens: Set<string>;
  /** Word count of the German sentence. */
  count: number;
  /** Catalog position — curriculum order breaks ties. */
  order: number;
};

const senseOverlap = (candidate: Candidate, wanted: Set<string>): number => {
  let overlap = 0;
  for (const token of wanted) {
    if (candidate.senseTokens.has(token)) overlap += 1;
  }
  return overlap;
};

const bestForSense = (
  pool: Candidate[],
  wanted: Set<string>
): { candidate: Candidate; overlap: number } | undefined => {
  let best: Candidate | undefined;
  let bestOverlap = -1;
  for (const candidate of pool) {
    const overlap = senseOverlap(candidate, wanted);
    if (overlap > bestOverlap || (overlap === bestOverlap && best && better(candidate, best))) {
      best = candidate;
      bestOverlap = overlap;
    }
  }
  return best ? { candidate: best, overlap: bestOverlap } : undefined;
};

/**
 * Shorter reads better, but a two-word fragment shows little context. Prefer
 * a sentence of 3–12 words, then the shortest, then curriculum order.
 */
const better = (a: Candidate, b: Candidate): boolean => {
  const aIdeal = a.count >= 3 && a.count <= 12 ? 0 : 1;
  const bIdeal = b.count >= 3 && b.count <= 12 ? 0 : 1;
  if (aIdeal !== bIdeal) return aIdeal < bIdeal;
  if (a.count !== b.count) return a.count < b.count;
  return a.order < b.order;
};

type WordExampleIndex = {
  exampleFor(word: Pick<WordItem, "de" | "en" | "lookup">): WordExample | undefined;
};

/**
 * One index per parts map. Two tiers, in order of trust:
 *
 * 1. The word's OWN hand-written example (`vocab.example`/`exampleEn`) — the
 *    author wrote that sentence for its source sense, so it wins when its
 *    English meaning matches the reviewed standalone card.
 * 2. A reviewed phrase/dialogue sentence containing every lemma token
 *    verbatim (whole-token, case-insensitive) — same words, so the same
 *    inflection caveat as above keeps false matches out. English meaning
 *    words break homonym ties (`Gericht` as court versus dish).
 *
 * A sentence that IS the word (one-word phrases like "Genau!") adds no
 * context and never serves.
 */
export function buildWordExampleIndex(apiParts: Record<string, any>): WordExampleIndex {
  const catalog = buildCatalog(apiParts ?? {});
  const authored = new Map<string, Candidate[]>();
  const candidates: Candidate[] = [];
  const postings = new Map<string, number[]>();

  catalog.forEach((item, order) => {
    const de = String(item.de ?? "").trim();
    const en = String(item.en ?? "").trim();
    if (!de || !en) return;
    const tokens = tokenize(de);
    const candidate: Candidate = {
      de,
      en,
      tokens: new Set(tokens),
      caseForms: germanTokenCaseForms(de),
      senseTokens: englishSenseTokens(en),
      count: tokens.length,
      order,
    };
    // Vocab-kind catalog entries ARE the authored example sentences: the
    // catalog stores word.example as `de` keyed by the word's lookup.
    if (item.kind === "vocab" && item.lookup) {
      const key = String(item.lookup).toLocaleLowerCase("de-DE");
      const list = authored.get(key);
      if (list) list.push(candidate);
      else authored.set(key, [candidate]);
    }
    if (tokens.length < 2) return; // a bare word is not an example of itself
    const index = candidates.length;
    candidates.push(candidate);
    for (const token of new Set(tokens)) {
      const list = postings.get(token);
      if (list) list.push(index);
      else postings.set(token, [index]);
    }
  });

  const cache = new Map<string, WordExample | null>();

  const exampleFor = (word: Pick<WordItem, "de" | "en" | "lookup">): WordExample | undefined => {
    const lookupKey = String(word.lookup || word.de).toLocaleLowerCase("de-DE");
    // A homonym can be requested under more than one reviewed English sense.
    // Caching only by German lookup made whichever sense was opened first win.
    const cacheKey = `${lookupKey}\u0000${String(word.en ?? "").toLocaleLowerCase("en-GB")}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached ?? undefined;

    const wantedSense = englishSenseTokens(word.en);
    const requiresOverlap = exampleRequiresSenseOverlap(word);
    const ownBest = bestForSense(authored.get(lookupKey) ?? [], wantedSense);
    const own = ownBest && (!requiresOverlap || ownBest.overlap > 0) ? ownBest : undefined;
    const rawTokens = rawLemmaTokens(word);
    const tokens = rawTokens.map((raw) => raw.toLocaleLowerCase("de-DE"));
    let found: WordExample | null = own
      ? { de: own.candidate.de, en: own.candidate.en }
      : null;
    if (tokens.length > 0) {
      // Walk the rarest token's postings and verify the rest — the anchor
      // with the fewest sentences keeps common-word lemmas ("ich") cheap.
      let anchor: number[] | undefined;
      for (const token of tokens) {
        const list = postings.get(token);
        if (!list) { anchor = undefined; break; }
        if (!anchor || list.length < anchor.length) anchor = list;
      }
      const wordFace = String(word.de ?? "").toLocaleLowerCase("de-DE").trim();
      const matching: Candidate[] = [];
      for (const index of anchor ?? []) {
        const candidate = candidates[index];
        if (candidate.count <= tokens.length) continue; // adds no context
        if (candidate.de.toLocaleLowerCase("de-DE").trim() === wordFace) continue;
        if (!tokens.every((token) => candidate.tokens.has(token))) continue;
        // "steuern" must not be served by "Die Steuern …": every lemma token
        // has to appear in a case form the lemma itself could take. The one
        // exception is a nominalized infinitive ("beim Entkalken" for
        // entkalken), accepted only when the English senses also agree —
        // otherwise "Aus dem Stillen" (the quiet one) would pass as the
        // nominalization of breastfeeding.
        const caseOk = rawTokens.every((raw, at) =>
          ((candidate.caseForms.get(tokens[at]) ?? 0) & acceptableCaseMask(raw)) !== 0
        );
        if (!caseOk) {
          const nominalizedOk = rawTokens.every((raw, at) => {
            const forms = candidate.caseForms.get(tokens[at]) ?? 0;
            if ((forms & acceptableCaseMask(raw)) !== 0) return true;
            return raw === tokens[at] && raw.endsWith("n") && (forms & CASE_CAP_NOMINALIZED) !== 0;
          });
          if (!nominalizedOk || senseOverlap(candidate, wantedSense) === 0) continue;
        }
        matching.push(candidate);
      }
      const phraseBest = bestForSense(matching, wantedSense);
      const phrase = phraseBest && (!requiresOverlap || phraseBest.overlap > 0) ? phraseBest : undefined;
      // An authored example still wins when it matches this meaning. If the
      // authored source belongs to another sense, a semantically matching
      // reviewed sentence is safer (Gericht = court must not show a dish).
      if (phrase && (!own || (own.overlap === 0 && phrase.overlap > 0))) {
        found = { de: phrase.candidate.de, en: phrase.candidate.en };
      }
    }
    cache.set(cacheKey, found);
    return found ?? undefined;
  };

  return { exampleFor };
}
