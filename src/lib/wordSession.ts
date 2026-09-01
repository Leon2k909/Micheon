/**
 * Vocabulary sittings: single words, taught on their own.
 *
 * The course has carried thousands of authored words with English glosses
 * since the beginning, and none of them was ever taught: words only entered lessons
 * through hand-written example sentences, and no word has one. That gate is
 * deliberate — an isolated word is not a sentence, and the sentence course
 * must never pad itself with flashcards. It stays. This module is the OTHER
 * door: a sitting made only of words, started from its own button, tracked
 * under its own ids.
 *
 * ISOLATION IS THE CONTRACT HERE. Word progress lives under a `vw-` id
 * namespace that no sentence path constructs or looks up, so a word graded
 * here can never surface as a due review in a sentence sitting, and a
 * sentence grade can never mark a word learned. The only single words a
 * sentence sitting may contain remain the authored one-word PHRASES —
 * "Prost!", "Genau!" — which are sentences by intent: things you say on
 * their own.
 */
import { BEYOND_A_BEGINNER } from "@/lib/beyondBeginnerWords";
import { cefrRung } from "@/lib/cefr";
import { frequencyRank, speechPrefers } from "@/lib/wordFrequency";
import { spokenFrequencyRank, type NounEvidence } from "@/lib/spokenFrequency";
import { getLearningMode, type LearningMode } from "@/lib/learningMode";
import { packNoteForWord } from "@/lib/curriculum";
import { corpusIgnores, corpusReach, corpusUses, wordCommonality, type CorpusIndex } from "@/lib/corpusFrequency";
import functionWords from "@/data/functionWords.json";
import { isDueForReview, isSnoozed, overdueBy, type GradeRecord } from "@/lib/memoryStrength";
import { lessonMixForBacklog } from "@/session";
import { canonicalWordSenseFor } from "@/lib/canonicalWordSenses";
import { wordSenseTagFor } from "@/lib/wordSenseTags";
import { sentenceIdentityKey } from "@/lib/germanTextMatch";
import {
  extraSynonymGroupKey,
  keepApartTag,
  primaryWordSense,
  wordMeaningKey,
  type WordSynonym,
} from "@/lib/wordSynonymGroups";

export type WordItem = {
  /** `vw-` + the lemma: global, not per pack, so "das Haus" is ONE word
   *  however many packs list it, and its progress follows the word. */
  id: string;
  /** Older ids for the same visible word, retained so progress survives
   * catalogue deduplication and is migrated on the next write. */
  aliases?: string[];
  /** "das Haus" — the display form, article kept, always German. */
  de: string;
  /** "house" — the authored gloss. Direction handling is the session's job,
   *  same as for sentences: `de` is German, `en` is English, whichever the
   *  learner is producing. */
  en: string;
  /** Bare lemma, for frequency lookups and dictionary joins. */
  lookup: string;
  /** "noun" | "verb" | ... when the author said so. */
  pos?: string;
  use?: string;
  /** Which of the word's meanings this card is teaching, in two or three
   * words. Only words that carry more than one meaning have it — see
   * wordSenseTags.ts. */
  senseTag?: string;
  /** Authored as the word's primary sense — see VocabSeed.core. */
  core?: boolean;
  /** False when contextual packs disagree and no standalone meaning has yet
   * been reviewed. Listen omits these rather than teaching an arbitrary
   * first-pack meaning passively. */
  listenSafe?: boolean;
  /** Less common same-meaning words folded into this card, most common first.
   * Their progress ids ride in `aliases`; see wordSynonymGroups.ts. */
  synonyms?: WordSynonym[];
  kind: "word";
  partKey: string;
  /** The owning pack's CEFR level — the ladder reads difficulty from it. */
  level?: string;
};

const wordIdPart = (value: string) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "word";

export const WORD_ID_PREFIX = "vw-";

export function wordProgressId(lookupOrDe: string): string {
  return WORD_ID_PREFIX + wordIdPart(lookupOrDe);
}

/** One word, article aside — "die Lüge" yes, "an etwas liegen" no. */
const isBareLemma = (de: string): boolean =>
  !/\s/.test(String(de ?? "").replace(/^(der|die|das)\s+/i, "").trim());

/**
 * Which of two packs' claims on one lemma should own the card.
 *
 * Curriculum order decides by default. It is overruled only when the later
 * claim is plainly the better card for the word itself: a seed marked as the
 * primary sense beats one that is not, and failing that, the bare word beats
 * an idiom built on it. Anything else keeps the incumbent, so this can never
 * turn into "last pack wins".
 */
const beatsExisting = (
  candidate: { de: string; core: boolean },
  existing: { de: string; core?: boolean }
): boolean => {
  if (candidate.core !== Boolean(existing.core)) return candidate.core;
  const candidateIsBare = isBareLemma(candidate.de);
  if (candidateIsBare !== isBareLemma(existing.de)) return candidateIsBare;
  return false;
};

/**
 * Every teachable word across the given packs, most common German first.
 *
 * Deduped by lemma: the same word listed by three packs is one entry, owned by
 * the first pack in the walk order (curriculum order, so early packs win) —
 * except where beatsExisting above hands the card to a better claim.
 * Words without a gloss are skipped rather than guessed at — a flashcard whose
 * back is empty teaches nothing.
 */
/**
 * Built once per parts map and mode, and shared.
 *
 * Deduping 7,330 words out of the packs costs about 450ms, and nothing about
 * the answer changes between calls with the same input — but it ran again on
 * every render that wanted a word list, several times over inside the single
 * blocked frame a language switch used to be.
 *
 * Keyed on the mode as well as the parts, like the sentence catalogue in
 * session.ts: conversation and exam front different words, so answering one
 * from a cache filled by the other would be a worse bug than the slowness.
 */
const wordCatalogCache = new WeakMap<object, Map<string, WordItem[]>>();

export function buildWordCatalog(
  apiParts: Record<string, any>,
  /** Conversation fronts the spoken word; exam practice keeps the written
   *  one. Defaults to the live setting so existing callers are unchanged. */
  mode: LearningMode = getLearningMode()
): WordItem[] {
  const cacheable = Boolean(apiParts) && typeof apiParts === "object";
  if (cacheable) {
    const cached = wordCatalogCache.get(apiParts)?.get(String(mode));
    if (cached) return cached;
  }
  const byLemma = new Map<string, WordItem>();
  const authoredGlosses = new Map<string, Set<string>>();
  for (const [partKey, part] of Object.entries(apiParts ?? {})) {
    for (const word of (part as any)?.vocab ?? []) {
      const de = String(word?.de ?? "").trim();
      const en = String(word?.en ?? "").trim();
      const lookup = String(word?.lookup ?? de).trim();
      if (!de || !en) continue;
      // A handful of seeds are broken or misfiled, found by reading the
      // outliers rather than assumed: glosses that just repeat the German
      // ("das Haar in der Suppe" = "Haar in der Suppe"), and full sentences
      // parked in a vocab array. A card whose back repeats its front teaches
      // nothing, and sentences belong to the sentence course.
      //
      // Only when the German is more than one word, though. English and
      // German share a great many words outright, and this threw away every
      // single one of them: das Ticket, der Plan, der Computer, der Film, das
      // Problem, das Update, das Feedback, der Podcast, das Meeting — 106
      // seeds, none of them the lazy copy this was written to catch, which no
      // longer occurs in the content at all. And a card is not empty just
      // because the two languages agree on the word: der Film still has to
      // teach that it is DER, and the gender is the hard part.
      const bareDe = de.toLowerCase().replace(/^(der|die|das)\s+/, "").replace(/[.!?]+$/, "");
      const bareEn = en.toLowerCase().replace(/^(der|die|das)\s+/, "").replace(/[.!?]+$/, "");
      if (bareDe === bareEn && /\s/.test(bareDe)) continue;
      if (/[.!?]$/.test(de)) continue;
      const id = wordProgressId(lookup || de);
      // Packs conflict when they disagree about the MEANING, not the wording.
      // Comparing full gloss strings withheld 135 words whose packs agree —
      // "to learn" vs "to learn, to study" is one sense written twice, and
      // vielleicht sat out of Listen over exactly that. So the key is the
      // primary sense: the part a card would speak, stripped of alternatives,
      // parentheticals and function words. Motto-class conflicts ("theme" vs
      // "motto") still differ after this and still withhold. The same
      // normalisation decides synonym-card grouping in wordSynonymGroups.ts,
      // which is why it lives there.
      const primarySense = primaryWordSense(en);
      const glossKey = primarySense
        || en.toLocaleLowerCase("en-GB").replace(/[.!?]+$/u, "").replace(/\s+/g, " ");
      // Only seeds that SHOW the word vote on its standalone sense. An idiom
      // built on the lemma can never own the card (beatsExisting), so its
      // meaning must not veto the card either — "auf den Grund gehen" was
      // withholding plain Grund, and "ehrlich gesagt" plain ehrlich. A
      // reflexive form (sich kümmern) is the word shown in its real shape,
      // so it votes; anything longer is an idiom with its own meaning.
      const shown = de.replace(/^(der|die|das)\s+/i, "").replace(/^sich\s+/i, "").trim();
      const showsTheWord = !/\s/.test(shown)
        && shown.toLocaleLowerCase("de-DE") === lookup.replace(/^sich\s+/i, "").trim().toLocaleLowerCase("de-DE");
      if (showsTheWord) {
        if (!authoredGlosses.has(id)) authoredGlosses.set(id, new Set());
        authoredGlosses.get(id)?.add(glossKey);
      }
      // Several packs legitimately claim one lemma, and they do not all show
      // the word itself: a pack about causes lists "an etwas liegen", while the
      // pack that teaches position lists plain "liegen". First-pack-wins handed
      // the card to whichever happened to come first, so the vocabulary card
      // titled "liegen" taught "to be due to something" and the verb's actual
      // meaning was never shown, spoken in Listen, or exported to the
      // extension. Fifteen lemmas were being taught by an idiom this way.
      // A card for the bare word must teach the bare word; the idiom is already
      // taught properly as a sentence. Replacing keeps the Map's original
      // insertion slot, so the word stays where curriculum order put it.
      const existing = byLemma.get(id);
      if (existing && !beatsExisting({ de, core: Boolean(word?.core) }, existing)) continue;
      byLemma.set(id, {
        id, de, en, lookup,
        pos: word?.pos || word?.tip || undefined,
        use: word?.use || undefined,
        core: word?.core || undefined,
        kind: "word",
        partKey,
        level: (part as any)?.level ? String((part as any).level) : undefined,
      });
    }
  }
  const visibleWords = new Map<string, WordItem>();
  const deduped: WordItem[] = [];
  for (const word of byLemma.values()) {
    const reviewed = canonicalWordSenseFor(word.lookup);
    if (reviewed) {
      word.de = reviewed.de;
      word.en = reviewed.en;
      word.use = reviewed.use;
      word.pos = reviewed.pos ?? word.pos;
      word.level = reviewed.level ?? word.level;
      word.core = true;
      word.listenSafe = true;
    } else {
      // A seed explicitly marked `core` has already been reviewed as the
      // standalone sense, so contextual alternatives must not hide it.
      word.listenSafe = Boolean(word.core) || (authoredGlosses.get(word.id)?.size ?? 0) <= 1;
    }

    // A word the packs claim with two meanings needs the meaning it is being
    // taught in named on the card, because Listen speaks it with no context.
    word.senseTag = wordSenseTagFor(word.lookup || word.de);

    const visibleKey = sentenceIdentityKey(word.de).toLocaleLowerCase("de-DE");
    const existing = visibleWords.get(visibleKey);
    if (!existing) {
      const canonical = { ...word, aliases: [...(word.aliases ?? [])] };
      visibleWords.set(visibleKey, canonical);
      deduped.push(canonical);
      continue;
    }

    // One merge, one rule. This was a second copy of the join below, and the
    // copies drifted: only one of them knew that "speak" and "to speak" are
    // the same sense, so which spelling of a duplicate survived depended on
    // which path a word happened to take.
    existing.en = mergeEnglishAlternatives([existing.en, word.en]);
    existing.aliases = [...new Set([
      ...(existing.aliases ?? []),
      word.id,
      ...(word.aliases ?? []),
    ])].filter((id) => id && id !== existing.id);
    existing.listenSafe = Boolean(existing.listenSafe || word.listenSafe);
  }
  const out = consolidateSynonymGroups(deduped, mode);
  if (cacheable) {
    const byMode = wordCatalogCache.get(apiParts) ?? new Map<string, WordItem[]>();
    byMode.set(String(mode), out);
    wordCatalogCache.set(apiParts, byMode);
  }
  return out;
}

/** Every English alternative once, first spelling wins — the same join the visible-word dedup uses. */
const mergeEnglishAlternatives = (values: string[]): string => {
  const seen = new Set<string>();
  const merged: string[] = [];
  // Both separators, because the two sources use different ones: the packs
  // write "to talk / to speak" and the frequency bank writes "human, humane".
  // Splitting on the slash alone compared "humane" against the whole string
  // "human, humane", found no match, and produced "humane / human / humane".
  for (const answer of values.flatMap((value) => String(value ?? "").split(/\s*[/,;]\s*/u))) {
    const trimmed = answer.trim();
    // "speak" and "to speak" are one sense written twice, and comparing them
    // whole let both through: reden read "to talk / speak / to speak". The
    // infinitive marker and a leading article are spelling, not meaning, so
    // they come off before comparing — and the first spelling still wins, so
    // the card keeps whichever form the earlier pack chose.
    const key = sentenceIdentityKey(trimmed.replace(/^(to|a|an|the)\s+/i, ""))
      .toLocaleLowerCase("en-GB");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(trimmed);
  }
  return merged.join(" / ");
};

/**
 * Combine same-meaning words into one card: the most common word fronts it,
 * the rest stay visible as its `synonyms`, most common first, and every
 * merged progress id becomes an alias so grades survive the fold. The rules
 * for what counts as "same meaning" — and the words deliberately kept apart —
 * live in wordSynonymGroups.ts.
 *
 * The combined card takes the EARLIEST member's slot, so curriculum order
 * still decides when the meaning is first met; within the group, frequency
 * rank decides who fronts the card (curriculum order breaks ties).
 */
function consolidateSynonymGroups(words: WordItem[], mode: LearningMode): WordItem[] {
  const groupKeyFor = (word: WordItem): string | null => {
    const extra = extraSynonymGroupKey(word.lookup || word.de);
    if (extra) return extra;
    // Only words shown as themselves merge; an idiom keeps its own card.
    const shown = word.de.replace(/^(der|die|das)\s+/i, "").replace(/^sich\s+/i, "").trim();
    if (!shown || /\s/.test(shown)) return null;
    const key = wordMeaningKey(word.en, word.de);
    if (!key) return null;
    const apart = keepApartTag(word.lookup || word.de);
    return apart ? `${key} ${apart}` : key;
  };

  const groups = new Map<string, number[]>();
  words.forEach((word, index) => {
    const key = groupKeyFor(word);
    if (!key) return;
    const members = groups.get(key) ?? [];
    members.push(index);
    groups.set(key, members);
  });

  const dropped = new Set<number>();
  const combinedAt = new Map<number, WordItem>();
  // Neutral everyday German fronts the card. The frequency bank decides, but
  // it does not rank slang — and the slang packs sit EARLY in the curriculum,
  // so curriculum order alone put "pennen" in front of "schlafen". A word
  // from a tier-note pack (niche/casual — always labelled) must never front
  // a standard word it happens to tie with.
  const tierNoted = (word: WordItem): number => (packNoteForWord(word.partKey, word.lookup) ? 1 : 0);
  /**
   * Which same-meaning word fronts the card in Conversation mode.
   *
   * The frequency bank is built from written German, so it ranked der Ort
   * above der Platz and put the written word on the face of a card whose own
   * synonym line read "more common in speech". In Conversation mode that is
   * backwards: the word people say is the word to learn, and speechPrefers
   * already knows which that is.
   *
   * Only for a documented pair. Everywhere else the bank still decides —
   * guessing which of two words sounds more spoken is exactly the kind of
   * claim this file refuses to make.
   *
   * A SCORE rather than a comparison between two words, because a group can
   * hold three. Unternehmen/Betrieb/Firma is one: speech prefers Firma over
   * Unternehmen, the bank prefers Unternehmen over Betrieb and Betrieb over
   * Firma, and a pairwise override turns that into a cycle the sort resolves
   * arbitrarily. Asking each word once whether speech prefers it to anything
   * else in ITS OWN group gives a real order.
   */
  const speechFavoured = (word: WordItem, members: WordItem[]): number => {
    if (mode !== "conversation") return 1;
    const name = word.lookup || word.de;
    return members.some((other) => other !== word && speechPrefers(name, other.lookup || other.de))
      ? 0
      : 1;
  };
  for (const indexes of groups.values()) {
    if (indexes.length < 2) continue;
    const members = indexes.map((index) => words[index]);
    const ordered = [...indexes].sort((a, b) =>
      speechFavoured(words[a], members) - speechFavoured(words[b], members)
      || frequencyRank(words[a].lookup || words[a].de) - frequencyRank(words[b].lookup || words[b].de)
      || tierNoted(words[a]) - tierNoted(words[b])
      || a - b
    );
    const face = words[ordered[0]];
    const rest = ordered.slice(1).map((index) => words[index]);
    const combined: WordItem = {
      ...face,
      en: mergeEnglishAlternatives([face.en, ...rest.map((word) => word.en)]),
      aliases: [...new Set([
        ...(face.aliases ?? []),
        ...rest.flatMap((word) => [word.id, ...(word.aliases ?? [])]),
      ])].filter((id) => id && id !== face.id),
      synonyms: [
        ...(face.synonyms ?? []),
        ...rest.map((word): WordSynonym => ({
          id: word.id,
          de: word.de,
          en: word.en,
          lookup: word.lookup,
          pos: word.pos,
          use: word.use,
          partKey: word.partKey,
          level: word.level,
        })),
      ],
    };
    const slot = Math.min(...indexes);
    for (const index of indexes) {
      if (index !== slot) dropped.add(index);
    }
    combinedAt.set(slot, combined);
  }
  if (!combinedAt.size) return words;
  return words.flatMap((word, index) => {
    const combined = combinedAt.get(index);
    if (combined) return [combined];
    return dropped.has(index) ? [] : [word];
  });
}

/** Frequency-ranked: the words people actually meet come first. */
/**
 * The connectors, pronouns and prepositions the course teaches through
 * sentences rather than as cards. They are the most common words in the
 * language and the frequency bank misses a good few of them.
 */
const CORE_FUNCTION_WORDS = new Set(
  (functionWords as { de: string }[]).map((entry) =>
    String(entry.de).toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").trim())
);

/** A connector, pronoun or preposition the course teaches through sentences.
 *  Exported for the gate, which has to know which words both frequency
 *  sources are silent about for reasons that are not difficulty. */
export function isCoreFunctionWord(word: string | undefined): boolean {
  if (!word) return false;
  return CORE_FUNCTION_WORDS.has(
    String(word).toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").trim()
  );
}

/**
 * Most useful first — the order Listen plays, lessons draw from and the
 * tracker lists.
 *
 * The frequency bank decides this, and it covers 2,130 of the 7,045 words.
 * Past that, everything used to tie: the corpus fallback scores a word by how
 * many packs contain it, which for a catalogue of 450 themed packs squeezes
 * 4,915 words into about forty distinct values. Ties fall through to
 * catalogue position, which is pack order, which is the order packs were
 * written in — so by word 2,450 of Listen the queue was serving der Aimbot,
 * das Kondolenzbuch and der Saal while obwohl, der Teller, regnen and der Tee
 * sat unplayed behind them: advanced and rare ahead of ordinary and common.
 *
 * The missing signal was already authored and already computed: every pack
 * states its CEFR level, and wordLadderRung turns that into a difficulty
 * rung. Sorting by it after the frequency rank leaves the 2,130 curated
 * words in exactly the order they were in — their rank already separates
 * them — and gives the other 4,915 the only real ordering they have: A1
 * before A2 before B1, and the C1 vocabulary last where it belongs.
 *
 * That ordering is measured, not assumed. Holding out the 2,130 words whose
 * true rank IS known and asking each candidate to predict it, by Spearman
 * correlation against the truth:
 *
 *     pack order, no signal at all      0.377
 *     corpus spread alone (what shipped) 0.399
 *     spread, then occurrence count     0.395
 *     CEFR rung first                   0.534
 *
 * The corpus spread barely improves on no signal, which is the surprise:
 * counting how many packs use a word sounds like frequency and is mostly
 * noise. Occurrence count, computed and thrown away until now, adds a little
 * inside a rung. (Measured with the rung computed from the CEFR level only —
 * wordLadderRung consults the frequency bank for the A1-B1 mass, and letting
 * it do so here would have been marking its own homework: it scored 0.549
 * that way, predicting an answer it had been given.)
 */
/** How far back a word waits when our own conversation never uses it. */
/**
 * How far behind the last word the course DOES say an unsaid one starts.
 *
 * A setback rather than exile, because absence is partly just coverage: many
 * perfectly speakable words simply never come up in 10,078 sentences. Far
 * enough that the words we do say overtake it, not far enough to bury it.
 */
const UNSPOKEN_SETBACK = 600;

/**
 * How much of the ordering the spoken signal decides, against the written one.
 *
 * One: where this course's own conversational text has seen a word, it decides
 * outright and the written bank does not get a vote. Anything less kept
 * carrying office vocabulary forward on its print rank — at 0.75, die
 * Ausbildung was still 401st in a course for holding conversations, on six
 * mentions in ten thousand sentences.
 *
 * The bank still orders the two things the corpus cannot speak about: function
 * words, which the index drops by design, and the words the corpus has never
 * seen at all.
 */
const SPOKEN_WEIGHT = 1;

/**
 * How many times the course has to say a word before the count means anything.
 *
 * One mention in 10,078 sentences is not evidence that a word is common; it is
 * evidence that a sentence somewhere mentions it. But the rule read any count
 * above zero as attestation, so a single passing mention outranked every word
 * the course never happened to use — and in a pack the frequency bank does not
 * reach, that single mention is the whole ordering.
 *
 * The vegetable shelf is the clearest case. None of its 32 words are in the
 * bank, so the corpus decides alone: das Basilikum is said once, der Knoblauch
 * and die Gurke and die Karotte not at all, and basil therefore led garlic,
 * cucumber and carrot in a queue promising the commonest thing first.
 *
 * Two is the smallest bar that asks a word to have been said more than once.
 * A word below it is not pushed to the back — it falls through to the same
 * treatment the unsaid words already get, ordered on the written bank where
 * that knows anything and on wordCommonality where it does not.
 */
const SPOKEN_EVIDENCE = 2;

/**
 * How many packs have to say a word before the count is about the word.
 *
 * A pack's own sentences say its own seeds — that is what example sentences
 * are — so a count of two or three is usually one topic talking to itself,
 * plus a neighbour. Measured: the words at positions 1,470–1,760 of the
 * ranking were der Rollator, der Abspann, der Rosenmontag, der Ersatzschlüssel,
 * die Noten (sheet music) — every one said exactly three times in two packs,
 * none in the frequency bank — and every one of them sat ahead of every word
 * the sentences happen not to say, however high the fifty-thousand-word
 * spoken list ranks it, because attestation decided outright and a setback
 * put the rest behind the whole attested list.
 *
 * Three packs is where a count stops being a topic: no single pack and its
 * neighbour can reach it. A word below it is not pushed to the back — like a
 * word said once, it falls through to the spoken list and the bank, which is
 * where "sheet music" belongs and where wheeled walkers belong.
 */
const SPOKEN_REACH = 3;

/**
 * How far the subtitle list reaches, and therefore where everything else starts.
 *
 * The list holds the fifty thousand commonest words of spoken German, which is
 * far past the end of anything this course teaches. A word it has never heard
 * is rarer than every word it has, so the signals that answer for those words
 * are placed beyond its last position rather than mixed in with it.
 */
const SPOKEN_LIST_SPAN = 50_000;

export function rankWordCatalog(
  catalog: WordItem[],
  corpusIndex: CorpusIndex | null = null,
  mode: LearningMode = getLearningMode()
): WordItem[] {
  /**
   * Conversation mode ranks by what people SAY, not by what gets written.
   *
   * The frequency bank is corpus-ranked from written German — news and web
   * text — so it put "entsprechend" at position 30 of the queue, which is not
   * a 30th priority for anybody. The point is to learn to SPEAK German as
   * quickly as possible, not to write it.
   *
   * The evidence is already in the app: 12,689 hand-written CONVERSATIONAL
   * sentences. entsprechend appears in none of them; sagen appears in 41 and
   * was waiting behind it. A word this course never once puts in somebody's
   * mouth is not what to learn first for speaking.
   *
   * A setback rather than exile, because absence is partly just coverage —
   * 39% of ranked words are never said, and many are perfectly speakable
   * words our sentences happen not to reach. Six hundred places is enough to
   * let the words we DO say overtake it, and not enough to bury it.
   *
   * Function words are exempt: the corpus index drops them, so their zero
   * means nothing at all.
   */
  /**
   * How often the course's own conversational text says each word, as a rank.
   *
   * Built once for the whole catalogue rather than per word, because a rank is
   * a position among the others and there is no way to know one word's without
   * looking at all of them.
   */
  const spokenRanks = (() => {
    if (mode !== "conversation" || !corpusIndex) return null;
    // Weighted by how many packs say it, not by the raw count. A count on its
    // own cannot tell a common word from a topic: die Ausbildung is said six
    // times and das Wetter fourteen, but the six sit in three packs and the
    // fourteen in twelve, and it is das Wetter a learner will need. The
    // geometric mean keeps both halves honest — neither a word said often in
    // one place nor one mentioned once each in many gets to the front on that
    // alone.
    const attested = catalog
      .map((word) => {
        const name = word.lookup || word.de;
        const uses = corpusUses(name, corpusIndex);
        const reach = corpusReach(name, corpusIndex);
        // Reach is capped at the count, because it cannot honestly exceed it:
        // a word written once appears in one pack. Where the map says more —
        // das Los reading 27 from the particle "los", die Sucht 7 from "sucht"
        // — that is the spread map being blind to part of speech, not
        // evidence, and without the cap a word used once was pulled from
        // 3,000th to 660th on it.
        const weight = Math.sqrt(uses * Math.max(1, Math.min(reach, uses)));
        return { id: word.id, uses, reach, weight };
      })
      .filter((entry) => entry.uses >= SPOKEN_EVIDENCE && entry.reach >= SPOKEN_REACH)
      .sort((a, b) => b.weight - a.weight);
    return new Map(attested.map((entry, index) => [entry.id, index + 1]));
  })();

  /**
   * What this course's own text can say about a pooled lowercase count.
   *
   * The subtitle list cannot tell die Macht from "er macht". Our sentences can,
   * because a capital away from a full stop is a noun and nothing else is, so
   * the two tallies are kept apart and can referee the collision. Only asked
   * about nouns, because only a noun has a lowercase twin to be confused with.
   */
  const nounEvidenceFor = (word: WordItem, name: string): NounEvidence | null => {
    if (word.pos !== "noun" || !corpusIndex) return null;
    const key = String(name).toLocaleLowerCase("de-DE").replace(/^(der|die|das)\s+/, "").trim();
    return {
      noun: corpusIndex.nounCount.get(key) ?? 0,
      other: corpusIndex.otherCount.get(key) ?? 0,
    };
  };

  const speakingRank = (word: WordItem, rank: number): number => {
    // No index is NO EVIDENCE, not evidence of absence. corpusUses returns 0
    // without one, so every word looks unspoken, every word moves the same
    // distance, and the whole rule quietly cancels itself out.
    if (!spokenRanks) return rank;
    const name = word.lookup || word.de;
    // Function words are exempt: the corpus index drops them, so their zero
    // means nothing at all.
    if (corpusIgnores(name)) return rank;
    /**
     * Where our own conversational text has nothing to say, ask how often
     * people say the word on film.
     *
     * This is the long tail, and until now it had no ordering at all: 6,500 of
     * the 9,000 words taught are outside the written bank's 2,500, so once the
     * course's own sentences fell silent there was no evidence left and the
     * words fell back on their pack order. That is how a herb the course
     * mentions once came to lead the garlic, the cucumber and the carrot.
     *
     * It answers HERE and not sooner on purpose. Our sentences are hand-written
     * for teaching and film dialogue is not: subtitles rank umbringen 861st and
     * das Arschloch 969th, which is true of thrillers and not of the first five
     * hundred words anybody should be taught. Where the course has spoken for
     * itself it keeps the floor; where it has not, this is far better than the
     * nothing it replaces.
     *
     * Placed past the attested words rather than mixed in with them, so the
     * two signals never have to be compared on a scale neither shares.
     */
    const attested = spokenRanks.get(word.id);
    if (attested === undefined) {
      const said = spokenFrequencyRank(name, nounEvidenceFor(word, name));
      if (Number.isFinite(said)) return spokenRanks.size + said;
    }
    /**
     * Everything below here is answering for a word neither our own text nor
     * the subtitle list has ever seen, so it belongs behind both.
     */
    const past = (position: number): number =>
      spokenRanks.size + SPOKEN_LIST_SPAN + position;
    const spoken = attested ?? past(spokenRanks.size + UNSPOKEN_SETBACK);
    /**
     * A word the bank has never heard of is not a rare word.
     *
     * The bank lists 2,502 words of WRITTEN German, and heute, bitte, danke,
     * vielleicht and bisschen are not among them — so they arrived here as
     * "unranked", were handed straight back before the spoken signal was
     * consulted at all, and sorted to the far end of the queue. heute is said
     * 224 times in this course's own conversational text, more than almost
     * anything, and sat at 2,252 of a list claiming to teach the commonest
     * things first.
     *
     * Where the bank is silent the corpus is the only evidence there is, so it
     * answers alone. Only where the corpus has actually seen the word: absent
     * from both, it stays unranked and sorts on the rung as before.
     */
    if (!Number.isFinite(rank)) {
      return spokenRanks.has(word.id) ? spoken : rank;
    }
    // The geometric mean of the two ranks, which is the shape that lets
    // DISAGREEMENT move a word both ways. The rule this replaces only ever
    // pushed back, and only words used exactly zero times: der Bereich is used
    // once in 10,078 sentences, which was enough to exempt it, so it sat at
    // position 34 of a course meant to teach conversation. And nothing could
    // come forward — morgen is said 72 times and waited at 1,279 because the
    // written bank ranks it 1,650.
    //
    // Multiplying is right for ranks rather than averaging them, because a
    // frequency list is Zipfian: 30 to 300 is a real drop in how often you
    // meet a word and 3,000 to 3,300 is no drop at all.
    //
    // Weighted towards what is SAID rather than an even split, because an even
    // split let a high written rank carry a word on very thin spoken evidence:
    // die Ausbildung is ranked 195 in print and said six times in ten thousand
    // conversational sentences, and sat at 191 of a course for holding
    // conversations. At 0.75 it sits at 327, der Bereich moves 163 -> 642 and
    // der Nutzer 676 -> 1,563, while kurz, einfach, heute and bitte come into
    // the first twenty. Measured across weightings; past 0.65 nothing said
    // twice or less survives in the first three hundred at all.
    return Math.pow(spoken, SPOKEN_WEIGHT) * Math.pow(rank, 1 - SPOKEN_WEIGHT);
  };

  return [...catalog]
    .map((word, index) => ({
      word,
      index,
      rank: speakingRank(word, frequencyRank(word.lookup || word.de)),
      rung: wordDifficultyRung(word),
      commonality: wordCommonality(word.lookup || word.de, corpusIndex),
      uses: corpusUses(word.lookup || word.de, corpusIndex),
    }))
    .sort((a, b) =>
      a.rank - b.rank
      || a.rung - b.rung
      || b.uses - a.uses
      || a.commonality - b.commonality
      || a.index - b.index
    )
    .map((entry) => entry.word);
}

/**
 * The difficulty ladder, and how a sitting decides which rung to serve from.
 *
 * A learner who reads B2 English for fun kept being handed "to be" and "to
 * have", because words are served most-common-first — right for a beginner,
 * insulting for them.
 * the words get harder. And later, once the hard tiers run dry, sittings
 * come BACK for the easy words that were skipped over — climbing must never
 * mean words go missing, only that they wait.
 *
 * Every word sits on a rung derived from its pack's CEFR level, with the
 * frequency bank splitting the beginner mass. The learner's own rung is
 * counted from their word grades: each known word is a step up (a "Kann ich"
 * press writes exactly such a grade, so mass-skipping basics climbs fast),
 * and each struggling word pulls DOWN twice as hard, because struggling at a
 * rung is the clearest sign it is high enough. Five knowns per rung, because
 * fifteen was too slow, and the failure mode it guards against is
 * real: someone skipping easy material should feel the sittings harden
 * within one preview's worth of "Kann ich", not three. A genuine beginner
 * still climbs slowly, because earning five knowns takes days while
 * declaring five takes seconds — that difference is precisely what the
 * ladder exists to detect.
 *
 * Serving order is a PREFERENCE, never a filter: at-or-above the learner's
 * rung first (nearest rung first, most common first within it), then below,
 * nearest first. Every word remains reachable in every state of progress.
 */
export function wordLadderRung(word: Pick<WordItem, "level" | "lookup" | "de">): number {
  const level = String(word.level ?? "").toUpperCase();
  const band = cefrRung(level);
  // B1 and up is settled by the label alone. The frequency bank is a list of
  // 2,500 everyday words and has nothing to say about that end of the ladder.
  if (band >= 3 && /^[BC]/.test(level)) return band;
  // The A1-B1 mass is where nearly everything lives; the frequency bank is
  // what separates "sein" from a mid-pack A2 noun.
  //
  // Both tiers can only make a word EASIER than its pack, never harder. That
  // is the whole point of them — they exist to rescue words whose LESSON is
  // advanced but which are themselves everyday. Written as a bare `return 2`,
  // the second tier did the opposite to anything already on rung 1: being
  // common was enough to trip it, so der Hund (rank 1,023), der Kopf (697),
  // der Fuß (923), der Wald (428) and seven others were pushed to rung 2,
  // while die Linse, der Thymian, das Faultier and die Artischocke were too
  // rare to trip anything and kept rung 1. Easiest-first then offered lentil,
  // thyme and sloth ahead of dog, head and foot — 11 words demoted for being
  // common, 493 left in front of them for being rare.
  //
  // spokenWordRung applies this same two-tier shape to the spoken bank and
  // has always written it as Math.min(own, 2). This is that, in the place it
  // was missing.
  const rank = frequencyRank(word.lookup || word.de);
  if (rank <= 300) return Math.min(band, 1);
  if (rank <= 1200) return Math.min(band, 2);
  return band;
}

/**
 * The rung a word ACTUALLY sits on — the question anything ordering by
 * difficulty should ask.
 *
 * A word's rung is not its pack's level. haben, sein, machen and bitte are
 * taught in A2 packs, because the LESSON around them is A2; the words
 * themselves are the first fifty words of the language. Ordering Listen by
 * the pack label put haben at 1,045 and bitte at 3,372 of a queue that had
 * just promised to start with the easiest thing it had.
 *
 * Connectors get the same treatment for the opposite reason: obwohl and
 * nachdem are taught in a B1-B2 pack and are missing from the frequency bank
 * entirely, so nothing else would rescue them.
 */
export function wordDifficultyRung(word: Pick<WordItem, "level" | "lookup" | "de">): number {
  return isCoreFunctionWord(word.lookup || word.de) ? 1 : wordLadderRung(word);
}

/**
 * How many of the most-said words count as core vocabulary whatever pack
 * teaches them, and how many as no harder than A2.
 *
 * The same two-tier shape wordLadderRung applies to the written bank, asked
 * of the spoken evidence instead. The written bank cannot answer this: its
 * top 300 is news and web German, and reading it as "easy" promotes
 * entsprechend, die Maßnahme, durchführen and darstellen to the rung haben
 * is on. The course's own conversational text says none of them.
 */
const SPOKEN_CORE = 300;
const SPOKEN_EVERYDAY = 1200;
/** ...and the tier past that: said a handful of times, so ordinary, not rare. */
const SPOKEN_ORDINARY = 2500;

/** The same two tiers read off the written bank, which caps but never promotes. */
const WRITTEN_CORE = 300;
const WRITTEN_EVERYDAY = 1200;

/**
 * The rung a word sits on once you know how much this course actually SAYS it.
 *
 * A pack level is a LESSON's difficulty, and for a word it is only ever a
 * guess. finden, das Problem, die Tür, trinken, vergessen and die Hilfe are
 * taught in B1 packs and are among the three hundred words this course says
 * most often — ordering Listen by the pack alone left finden at 3,986 of a
 * queue that had promised the easiest thing first.
 *
 * `rankAmongSpoken` is the word's position in rankWordCatalog's output, which
 * is that ranking. Only a word the corpus has actually SEEN can be rescued by
 * it: in a mode that ranks by the written bank instead, an unguarded rule
 * would read a written ordering as a spoken one and do the exact thing the
 * paragraph above says not to.
 */
export function spokenWordRung(
  word: Pick<WordItem, "level" | "lookup" | "de">,
  rankAmongSpoken: number,
  corpusIndex: CorpusIndex | null
): number {
  const name = word.lookup || word.de;
  const rank = frequencyRank(name);
  const attested = Boolean(corpusIndex) && corpusUses(name, corpusIndex!) > 0;
  let rung = wordDifficultyRung(word);

  /**
   * Rarity pushes UP, which nothing did before.
   *
   * A pack's level is its TOPIC's, and a beginner's topic is full of words
   * that are not a beginner's: the A1 weather pack teaches hageln and
   * wechselhaft, the A1 clothes pack die Daunenjacke and das Knopfloch, the
   * A1 kitchen pack die Artischocke and der Granatapfel. Measured, 451 of the
   * 1,152 cards on the A1 rung were words the 2,500-word bank has never
   * ranked AND this course's ten thousand conversational sentences never say
   * once. Two independent sources of evidence, both silent, and the card
   * still said A1.
   *
   * Silence from both is not proof a word is hard - it is proof it is not
   * among the first thousand, which is all the rung claims. So such a word
   * cannot open the course; it goes one rung up and no further, because the
   * author did put it in a beginner's topic and that is worth something.
   *
   * Function words are exempt: the corpus index drops them by design, so
   * their silence means nothing at all, and the bank misses half of them -
   * heute, bitte, danke and obwohl would all be pushed off the rung they
   * belong on by a rule reading their absence as rarity.
   */
  /**
   * A pack's level is its TOPIC's, and a beginner's topic teaches words that
   * are not a beginner's: the A1 kitchen pack has die Kartoffel and die
   * Artischocke in it, the A1 office pack der Bleistift and der
   * Bildschirmschoner. The card said A1 for all four.
   *
   * Frequency cannot separate them, and that was tried first: the bank has
   * never ranked either half and this course's conversational text says
   * neither, because a conversation has no occasion to mention a cow OR a
   * porcupine. Demoting on that silence takes die Kuh, das Knie and die Jacke
   * with it - 462 words across the everyday packs, about half of them plainly
   * first-thousand vocabulary.
   *
   * So the later half is named instead. See beyondBeginnerWords.ts: it is a
   * judgement about what a learner needs first, and a list is the honest
   * shape for a judgement rather than a threshold pretending to be one.
   */
  if (BEYOND_A_BEGINNER.has(word.de) || BEYOND_A_BEGINNER.has(name)) {
    rung = Math.max(rung, 2);
  }

  /**
   * ...and commonness pulls DOWN, from both sources, each as far as it can
   * honestly reach.
   *
   * The written bank is news and web German, so it may not name a word a
   * beginner's - entsprechend is 111th in it and is nobody's early word. But
   * a word it ranks that highly is not the hardest thing in the course
   * either, and die Entwicklung sat at B2-C1 on a bank rank of 73. So the
   * bank caps rather than promotes, and caps gently: one rung down from the
   * top, not into the beginner's range. Capping bank-top-300 words at B1 was
   * tried and takes entsprechend, die Massnahme and darstellen with it, which
   * is the very thing the spoken ranking exists to prevent.
   */
  if (rank <= WRITTEN_CORE) rung = Math.min(rung, 4);
  else if (rank <= WRITTEN_EVERYDAY) rung = Math.min(rung, 5);

  /**
   * What the course itself SAYS is the strongest evidence there is, and the
   * only one allowed to reach the first rung. The third tier is new: flach,
   * steil, feucht, zugleich and zumindest are all said two or three times in
   * the conversational text and were all sitting on B2-C1.
   */
  if (!attested) return rung;
  if (rankAmongSpoken < SPOKEN_CORE) return 1;
  if (rankAmongSpoken < SPOKEN_EVERYDAY) return Math.min(rung, 2);
  if (rankAmongSpoken < SPOKEN_ORDINARY) return Math.min(rung, 3);
  return rung;
}

/**
 * Where the learner currently stands — read from DECLARED knowns only.
 *
 * The rung used to count every known word, so simply learning a lot put a
 * learner on the top rung and their sittings turned into a C1 gauntlet
 * while unknown everyday words waited below. The rule: knowing a lot of
 * words must not put a learner on a top rung. Only repeatedly pressing Know
 * it on words in a session should do that, because
 * you; an earned know only says you learned it. Only the first is a climb
 * signal — and a struggle still pulls down twice as hard, whatever kind of
 * knowns sit above it.
 */
export function learnerWordRung(
  grades: Record<string, GradeRecord | undefined>,
  now = Date.now()
): number {
  let declaredKnown = 0;
  let struggling = 0;
  for (const [id, record] of Object.entries(grades ?? {})) {
    if (!id.startsWith(WORD_ID_PREFIX) || !record) continue;
    if (record.lastGrade === "know" && record.declared) declaredKnown += 1;
    else if (record.lastGrade === "struggle" && !isSnoozed(record, now)) struggling += 1;
  }
  const score = declaredKnown - struggling * 2;
  return Math.max(1, Math.min(6, 1 + Math.floor(score / 5)));
}

type WordStep = {
  type: "sentence";
  review?: boolean;
  reviewReason?: "struggle" | "due";
  interval?: number;
  overdue?: number;
  item: WordItem & { level?: string; mastery: "new" | "learning" | "strong" };
};

/**
 * One vocabulary sitting: at most six words, reviews first serving the same
 * promise sentences make — a due backlog trades new slots for review slots,
 * and the sitting never grows. Snooze is the learner's decision and outranks
 * everything, exactly as it does for sentences.
 *
 * Two words with the same gloss never share a sitting: the meaning-pick stage
 * builds its wrong answers from the other words on the table, and offering
 * "city" twice would make one of the two right answers "wrong".
 */
export function buildWordSitting(
  ranked: WordItem[],
  grades: Record<string, GradeRecord | undefined>,
  now = Date.now(),
  /** Mixed sittings hand words a smaller budget; alone, words get the full
   *  six-slot mix. Unused slots of either kind fall to the other, so two
   *  slots are two WORDS whenever two teachable words exist. */
  slots?: { reviewSlots: number; freshSlots: number }
): WordStep[] {
  const recordFor = (word: WordItem) => {
    for (const id of [word.id, ...(word.aliases ?? [])]) {
      const record = grades?.[id];
      if (record) return record;
    }
    return undefined;
  };

  const struggles: WordItem[] = [];
  const due: WordItem[] = [];
  let fresh: WordItem[] = [];
  for (const word of ranked) {
    const record = recordFor(word);
    if (isSnoozed(record, now)) continue;
    if (record?.lastGrade === "struggle") struggles.push(word);
    else if (record?.lastGrade === "know") {
      if (isDueForReview(record, now)) due.push(word);
      // Known and not due: resting. Words rest until their date, full stop —
      // there is no adaptive early recall here to keep the mode simple and
      // the promise legible.
    } else fresh.push(word);
  }

  // The ladder: serve new words from the learner's rung upward, nearest rung
  // first, most common first within a rung — then wrap DOWN to whatever was
  // skipped, so finishing the hard tiers brings the easy ones back. Stable
  // sort over the frequency-ranked input keeps in-rung order.
  //
  // With one carve-out, from "erneuerbar" arriving in sittings before words
  // like Hund had: a word in the everyday core (top
  // ~1,200 of the frequency bank) is NEVER beneath anyone. The rung count
  // climbs on knowns, so a learner with thousands of known items sat on the
  // top rung while unknown core words waited behind every C1 word for the
  // wrap-down. An unknown core word now counts as at-rung wherever the
  // learner stands — the boredom fix survives (a core word truly known is one
  // Kann-ich from gone for ever), and the rungs still govern
  // everything outside the core.
  const CORE_FREQUENCY_RANK = 1200;
  const rung = learnerWordRung(grades, now);
  fresh = fresh
    .map((word, index) => {
      const naturalRung = wordLadderRung(word);
      const core = frequencyRank(word.lookup || word.de) <= CORE_FREQUENCY_RANK;
      return { word, index, wordRung: core ? Math.max(naturalRung, rung) : naturalRung };
    })
    .sort((a, b) =>
      (a.wordRung >= rung ? 0 : 1) - (b.wordRung >= rung ? 0 : 1)
      || Math.abs(a.wordRung - rung) - Math.abs(b.wordRung - rung)
      || a.index - b.index
    )
    .map((entry) => entry.word);
  due.sort((a, b) => overdueBy(recordFor(b), now) - overdueBy(recordFor(a), now));

  const mix = slots ?? lessonMixForBacklog(struggles.length + due.length);
  const usedGlosses = new Set<string>();
  const usedDe = new Set<string>();
  const claim = (word: WordItem) => {
    const gloss = word.en.trim().toLowerCase();
    const face = word.de.trim().toLowerCase();
    if (usedGlosses.has(gloss) || usedDe.has(face)) return false;
    usedGlosses.add(gloss);
    usedDe.add(face);
    return true;
  };

  const take = (pool: WordItem[], limit: number) => {
    const out: WordItem[] = [];
    for (const word of pool) {
      if (out.length >= limit) break;
      if (claim(word)) out.push(word);
    }
    return out;
  };

  const reviewPicks = take([...struggles, ...due], mix.reviewSlots);
  const freshPicks = take(fresh, mix.freshSlots + (mix.reviewSlots - reviewPicks.length));

  const asStep = (word: WordItem, review: boolean): WordStep => {
    const record = recordFor(word);
    return {
      type: "sentence",
      ...(review
        ? {
            review: true,
            reviewReason: record?.lastGrade === "struggle" ? "struggle" : "due",
            interval: Number(record?.intervalDays) || 1,
            overdue: overdueBy(record, now),
          }
        : {}),
      item: { ...word, mastery: review ? "learning" : "new" },
    };
  };

  // New words first, then reviews — the same order a sentence sitting uses.
  return [
    ...freshPicks.map((word) => asStep(word, false)),
    ...reviewPicks.map((word) => asStep(word, true)),
  ];
}
