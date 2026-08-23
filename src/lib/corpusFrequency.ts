import { germanVerbLemma } from "@/lib/germanVerbForms";
import { frequencyRank } from "@/lib/wordFrequency";

/**
 * How common a word or sentence is, for every item in the course.
 *
 * The curated frequency list in wordFrequency.ts is the authority, but it only
 * reaches about 15% of what gets taught — the rest tie at "unranked", which
 * made a sort on it very nearly a no-op. This fills the gap from the course's
 * own text: a word that shows up across many different topic packs is, by
 * definition, one the language leans on. Restaurant German is full of
 * "Rechnung"; only genuinely everyday words appear in the pet pack AND the
 * dentist pack AND the argument pack.
 *
 * Curated rank wins wherever it exists. The corpus estimate only fills in
 * behind it, mapped onto the same scale so the two can be compared.
 */

export type CorpusIndex = {
  /** word -> how many distinct packs it appears in */
  spread: Map<string, number>;
  /** word -> total occurrences */
  count: Map<string, number>;
  /** word -> occurrences written as a noun (capitalised away from a full stop) */
  nounCount: Map<string, number>;
  /** word -> occurrences written as anything else */
  otherCount: Map<string, number>;
  /** word -> occurrences at the start of a sentence, where the capital says nothing */
  initialCount: Map<string, number>;
  /**
   * word -> its place in this corpus by how often it is said, 1 = most.
   *
   * The written bank is a list of content words: jetzt, hier, dann, immer,
   * mehr and viel are not in it at all. Without this they fell through to the
   * pack-spread estimate and scored mid-rare — jetzt at 2,213 — and a
   * sentence is scored by its worst word, so any line containing one of them
   * was dragged back with it.
   */
  spokenRank: Map<string, number>;
  packs: number;
};

const STOP = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines",
  "und", "oder", "aber", "ist", "sind", "war", "waren", "bin", "bist", "sein",
  "ich", "du", "er", "sie", "es", "wir", "ihr", "mich", "mir", "dich", "dir", "sich",
  "zu", "zum", "zur", "in", "im", "an", "am", "auf", "mit", "von", "vom", "bei", "für", "aus",
  "nicht", "kein", "auch", "noch", "schon", "so", "als", "wie", "wenn", "dass", "man",
]);

function words(text: string): string[] {
  return String(text ?? "")
    .toLocaleLowerCase("de-DE")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/**
 * The same tokens, but keeping which ones were written as nouns.
 *
 * German capitalises its nouns, and that is the only thing separating die
 * Macht from "er macht" — which matters, because pooling them credited the
 * noun with 148 uses it never had and would have carried it into the first
 * twenty words of the course.
 *
 * The first word of a sentence is capitalised whatever it is, so it is not
 * evidence either way and is left out of both tallies rather than guessed at.
 */
function shapedWords(text: string): Array<{ key: string; noun: boolean; initial: boolean }> {
  const raw = String(text ?? "").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  const out: Array<{ key: string; noun: boolean; initial: boolean }> = [];
  raw.forEach((token, index) => {
    const key = token.toLocaleLowerCase("de-DE");
    if (key.length <= 2 || STOP.has(key)) return;
    // The first word of a sentence is capitalised whatever it is, so its shape
    // is no evidence — but dropping it lost the count entirely, and the words
    // that open sentences are exactly the conversational ones. vielleicht was
    // recorded 9 times against a true 19, heute and bitte likewise. It is kept
    // apart and added back to whichever tally the word's own shape indicates.
    out.push({ key, noun: token[0] === token[0].toLocaleUpperCase("de-DE"), initial: index === 0 });
  });
  return out;
}

/** Does this word present as a noun — an article, or a capital of its own? */
export function looksLikeGermanNoun(word: string | undefined): boolean {
  const text = String(word ?? "").trim();
  if (!text) return false;
  if (/^(der|die|das)\s/i.test(text)) return true;
  const first = text[0];
  return first === first.toLocaleUpperCase("de-DE") && first !== first.toLocaleLowerCase("de-DE");
}

/** Build the index once from the whole course. */
/**
 * Built once per parts map and shared, like the catalogue.
 *
 * This only reads `phrases[].de`, which no setting changes, so the parts map's
 * identity is the whole key — no mode to fold in.
 */
const corpusCache = new WeakMap<object, CorpusIndex>();

export function buildCorpusIndex(parts: Record<string, { phrases?: { de?: string }[] }>): CorpusIndex {
  const cacheable = Boolean(parts) && typeof parts === "object";
  if (cacheable) {
    const cached = corpusCache.get(parts);
    if (cached) return cached;
  }
  const built = computeCorpusIndex(parts);
  if (cacheable) corpusCache.set(parts, built);
  return built;
}

function computeCorpusIndex(parts: Record<string, { phrases?: { de?: string }[] }>): CorpusIndex {
  const spread = new Map<string, number>();
  const count = new Map<string, number>();
  const nounCount = new Map<string, number>();
  const otherCount = new Map<string, number>();
  const initialCount = new Map<string, number>();
  const keys = Object.keys(parts);
  for (const key of keys) {
    const seen = new Set<string>();
    for (const phrase of parts[key]?.phrases ?? []) {
      for (const word of words(phrase?.de ?? "")) {
        // Irregular verbs are counted against their dictionary form, because
        // the suffix rules below cannot get from "ist" to "sein" and nothing
        // else will: this corpus uses haben 1,011 times and a suffix-only
        // count found 200 of them.
        const lemma = germanVerbLemma(word) ?? word;
        count.set(lemma, (count.get(lemma) ?? 0) + 1);
        seen.add(lemma);
      }
      // And again, keeping the noun/not-noun split.
      for (const { key: word, noun, initial } of shapedWords(phrase?.de ?? "")) {
        const lemma = germanVerbLemma(word) ?? word;
        const tally = initial ? initialCount : (noun ? nounCount : otherCount);
        tally.set(lemma, (tally.get(lemma) ?? 0) + 1);
      }
    }
    for (const word of seen) spread.set(word, (spread.get(word) ?? 0) + 1);
  }
  // Ranked once here rather than per lookup: wordCommonality is called for
  // every word of every sentence in the catalogue.
  const spokenRank = new Map<string, number>();
  [...count.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "de-DE"))
    .forEach(([word], place) => spokenRank.set(word, place + 1));

  return { spread, count, nounCount, otherCount, initialCount, spokenRank, packs: keys.length };
}

/**
 * Surface forms to try when scoring a word.
 *
 * German is heavily inflected and the frequency list is keyed on lemmas, so a
 * plain lookup misses nearly every verb as it actually appears in a sentence:
 * "gehen" is rank 19, but "gehe" was unranked and scored 3555, which made
 * "Ich gehe nach Hause" look RARER than "unter der Voraussetzung, dass die
 * Rahmenbedingungen stimmen". Trying a few endings fixes the common cases
 * without pretending to be a real morphological analyser.
 */
function lemmaCandidates(key: string, isNoun: boolean): string[] {
  const out = new Set<string>([key]);
  if (isNoun) {
    // A noun's other forms are plurals and cases. Nothing else: run the verb
    // endings over a noun and die Arbeit reaches arbeiten, die Wolle reaches
    // wollen, and each of them collects a verb's count as if it were its own.
    // Minute -> Minuten, Gedanke -> Gedanken, Tage -> Tag, Hause -> Haus.
    out.add(`${key}n`);
    out.add(`${key}en`);
    if (key.endsWith("e") && key.length > 3) out.add(key.slice(0, -1));
    return [...out];
  }
  // ich gehe -> gehen, wir mach -> machen
  out.add(`${key}n`);
  out.add(`${key}en`);
  // du gehst / er geht -> gehen
  if (key.endsWith("st") && key.length > 4) out.add(`${key.slice(0, -2)}en`);
  if (key.endsWith("t") && key.length > 3) out.add(`${key.slice(0, -1)}en`);
  // A stem ending in a consonant cluster takes a linking -e-, so the third
  // person is stem+et and the rule above lands one letter short: kostet gave
  // "kosteen", not kosten. Fifty-eight of the course's verbs were in that
  // hole — kostet scored 2,873 against kosten's 193, bietet 3,961 against
  // bieten's 24 — and since a sentence is scored by its worst word, one of
  // them was enough to send an everyday line to the back.
  if (key.endsWith("et") && key.length > 4) out.add(`${key.slice(0, -1)}n`);
  if (key.endsWith("est") && key.length > 5) out.add(`${key.slice(0, -2)}n`);
  if (key.endsWith("ete") && key.length > 5) out.add(`${key.slice(0, -2)}n`);
  if (key.endsWith("eten") && key.length > 6) out.add(`${key.slice(0, -3)}n`);
  // machte / machten -> machen
  if (key.endsWith("te") && key.length > 4) out.add(`${key.slice(0, -2)}en`);
  if (key.endsWith("ten") && key.length > 5) out.add(`${key.slice(0, -3)}en`);
  // No ge- stripping. It was here to reach gemacht -> macht -> machen, but
  // the principal-parts table now credits participles to their verb where the
  // course actually says them, and stripping the prefix at lookup time does
  // the opposite job: it hands one word another's count. The adjective
  // gelassen took all 82 of lassen's while the course says it three times,
  // and gestehen took all 33 of stehen's while the course never says it at
  // all — both of which then read as words worth teaching in the first fifty.
  return [...out];
}

/**
 * A rank-like number for one word: lower means more common. Deliberately on the
 * same scale as the curated list so the two can be mixed in one comparison.
 *
 * The best score across the word's plausible lemmas wins — an inflected form is
 * exactly as common as the word it belongs to.
 */
/**
 * How often the course actually says this word, pooled across its forms.
 *
 * wordCommonality answers "how widely used" from the pack spread, and rounds
 * that onto the curated scale — which for the 4,915 words the curated list
 * never reached means about forty distinct values for all of them. Everything
 * inside one of those values then ties, and a tie falls through to the order
 * the packs happened to be written in.
 *
 * The occurrence count was being built alongside the spread and thrown away.
 * It is the finer signal: der Teller is said fifteen times across the course
 * and der Saal twice, and that is the difference between them.
 */
/**
 * Is this a word the corpus index deliberately ignores?
 *
 * The index drops function words, so "sein" and "nicht" count zero however
 * often the course says them. Anything reading a zero as "nobody says this"
 * has to ask this first, or it would conclude that German does not use "und".
 */
export function corpusIgnores(word: string | undefined): boolean {
  const key = String(word ?? "").toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").trim();
  if (!key) return true;
  if (key.length <= 2) return true;
  return STOP.has(key);
}

export function corpusUses(word: string, index: CorpusIndex | null): number {
  if (!index) return 0;
  const key = word.toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").replace(/[^\p{L}\p{N}]/gu, "");
  if (!key) return 0;
  // A noun is counted from the noun tally and everything else from the other
  // one, so "er macht" cannot vouch for die Macht. Where the split has no
  // evidence at all — a word this corpus only ever puts first in a sentence —
  // the pooled count answers rather than a zero that would read as "unused".
  const isNoun = looksLikeGermanNoun(word);
  const shaped = isNoun ? index.nounCount : index.otherCount;
  // Sentence openings are added for the word as written and for nothing else.
  // A capital at the start of a sentence says nothing about which reading the
  // word has, so it is fair to count it towards the word itself — but adding
  // it to every guessed form is not: die Wolle was collecting the 42 sentences
  // that open "Wollen wir ...?" and arriving 84th in a course for holding
  // conversations, on three real mentions.
  let uses = (shaped.get(key) ?? 0) + (index.initialCount.get(key) ?? 0);
  for (const candidate of lemmaCandidates(key, isNoun)) {
    uses = Math.max(uses, shaped.get(candidate) ?? 0);
  }
  return uses;
}

/**
 * How many different packs of the course say this word.
 *
 * The companion to corpusUses, and the half that was never asked for. Six
 * mentions inside one pack is a topic; six spread over six packs is a word
 * people say. die Ausbildung is said six times across three packs and arrived
 * 600th of 7,300, ahead of das Wetter, which is said fourteen times across
 * twelve — more contexts, more useful, further back.
 */
export function corpusReach(word: string, index: CorpusIndex | null): number {
  if (!index) return 0;
  const key = word.toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").replace(/[^\p{L}\p{N}]/gu, "");
  if (!key) return 0;
  // The same shape test corpusUses makes, and for the same reason. The spread
  // map is case-folded, so pooling candidates freely let die Wolle claim the
  // 113 packs that say "wollen" and der Zeh the 68 that say "zehn" — the
  // false-inheritance bug over again, in the half that counts packs instead
  // of mentions. A candidate only counts when the corpus has actually written
  // it in this word's shape.
  const shaped = looksLikeGermanNoun(word) ? index.nounCount : index.otherCount;
  let reach = index.spread.get(key) ?? 0;
  for (const candidate of lemmaCandidates(key, looksLikeGermanNoun(word))) {
    if (candidate === key) continue;
    if (!(shaped.get(candidate) ?? 0)) continue;
    reach = Math.max(reach, index.spread.get(candidate) ?? 0);
  }
  return reach;
}

/**
 * Whether wordCommonality may fall back to how often this course says a word.
 *
 * The bank is a content-word list and has never heard of jetzt, hier, dann,
 * immer, viel or mehr — 144 words the course says twenty times or more, 7,119
 * mentions between them, all scored mid-rare by the pack-spread guess instead.
 * Turning this on fixes that and moves everyday lines forward.
 *
 * It is off because it also moves which pack leads the first dozen Continue
 * Learning lessons, and part380 — the pack that teaches Keine Ahnung, Kann
 * sein and Mal sehen, then how to extend each one — stops being reached
 * inside twelve. That pack surfaced early only by accident of word frequency;
 * making it deliberate is a curriculum decision, not a scoring one, so the
 * switch waits for that decision rather than being made silently by whoever
 * touched the scorer last.
 */
const USE_SPOKEN_FALLBACK = false;

export function wordCommonality(word: string, index: CorpusIndex | null): number {
  const key = word.toLocaleLowerCase("de-DE").replace(/[^\p{L}\p{N}]/gu, "");
  if (!key) return 5000;
  const candidates = lemmaCandidates(key, looksLikeGermanNoun(word));

  let best = Infinity;
  for (const candidate of candidates) {
    const curated = frequencyRank(candidate);
    if (Number.isFinite(curated) && curated < best) best = curated;
  }
  if (Number.isFinite(best)) return best;
  if (!index) return 4000;

  // The bank has no opinion. Before guessing from how many packs mention the
  // word, ask how often this course actually says it — the same evidence the
  // word ordering already runs on. 144 words the course says twenty times or
  // more scored worse than 1500 without this, between them 7,119 mentions,
  // and every sentence carrying one was scored as if it were rare.
  //
  // Mapped onto the bank's own scale rather than a wider one, so a word it
  // ranks and a word it has never heard of stay comparable inside the same
  // sentence.
  // OFF until the phrase-chain question below is decided. See
  // USE_SPOKEN_FALLBACK.
  let spoken = Infinity;
  for (const candidate of candidates) {
    const place = index.spokenRank.get(candidate);
    if (place != null && place < spoken) spoken = place;
  }
  if (USE_SPOKEN_FALLBACK && Number.isFinite(spoken)) {
    const of = Math.max(1, index.spokenRank.size);
    return Math.max(1, Math.round(1 + ((spoken - 1) / of) * 2500));
  }

  // Pool the corpus spread across the forms too, so "gehe", "gehst" and "geht"
  // count as one word rather than three rare ones.
  let spread = 0;
  for (const candidate of candidates) spread = Math.max(spread, index.spread.get(candidate) ?? 0);
  if (!spread) return 5000;
  // Appearing in many packs is the strongest available signal of everyday use.
  // A word in a third of all packs lands near the top; a word in one pack sits
  // out with the rare vocabulary.
  const share = spread / Math.max(1, index.packs);
  return Math.round(400 + (1 - Math.min(1, share * 3)) * 3600);
}

/** How common a whole sentence is — driven by its least common content word. */
export function sentenceCommonality(sentence: string, index: CorpusIndex | null): number {
  const parts = words(sentence);
  if (!parts.length) return 3000;
  const ranks = parts.map((w) => wordCommonality(w, index));
  // The hardest word is what makes a sentence hard to place, so weight the
  // worst one heavily rather than letting a long easy sentence average it away.
  const worst = Math.max(...ranks);
  const mean = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  return Math.round(mean * 0.6 + worst * 0.4);
}
