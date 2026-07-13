import { normalizeEnglishSpelling } from "@/lib/englishVariant";

/** Normalize German learner input for comparison (typing or speech transcript). */

export function normalizeGermanInput(t: string) {
  return String(t ?? "")
    .toLowerCase()
    .trim()
    .replace(/[’'`´‘]/g, "")            // apostrophes don't matter: "don't" == "dont"
    .replace(/[-–—/]/g, " ")            // hyphens, dashes, slashes act as spaces: "after-work" == "after work"
    .replace(/[.!?,;:"()“”„«»…]/g, "")  // drop sentence punctuation incl. curly/German/French quotes
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeGermanLenient(t: string) {
  return normalizeGermanInput(t)
    .replace(/ß/g, "ss")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    // Fold ALL diacritics (ä ö ü, and French é è ê à ç î ô û…) to their base
    // letter, so answers typed without accents still match leniently.
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    // Colloquial / spoken contractions
    .replace(/\bnix\b/g, "nichts")
    .replace(/\bmachs\b/g, "mach es")
    .replace(/\bgibts\b/g, "gibt es")
    .replace(/\bgehts\b/g, "geht es")
    .replace(/\bists\b/g, "ist es");
}

export function normalizeGermanInputCaseSensitive(t: string) {
  return String(t ?? "")
    .trim()
    .replace(/[’'`´‘]/g, "")            // apostrophes don't matter
    .replace(/[-–—/]/g, " ")            // hyphens, dashes, slashes act as spaces
    .replace(/[.!?,;:"()“”„«»…]/g, "")  // drop punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeGermanLenientCaseSensitive(t: string) {
  return normalizeGermanInputCaseSensitive(t)
    .replace(/ß/g, "ss")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .replace(/\bnix\b/g, "nichts")
    .replace(/\bmachs\b/g, "mach es")
    .replace(/\bgibts\b/g, "gibt es")
    .replace(/\bgehts\b/g, "geht es")
    .replace(/\bists\b/g, "ist es");
}

export function matchGermanPhrase(input: string, target: string): { ok: boolean; spellingNote: boolean; capitalizationError?: boolean } {
  const normInputCS = normalizeGermanInputCaseSensitive(input);
  const normTargetCS = normalizeGermanInputCaseSensitive(target);

  if (normInputCS === normTargetCS) {
    return { ok: true, spellingNote: false };
  }

  const lenientInputCS = normalizeGermanLenientCaseSensitive(input);
  const lenientTargetCS = normalizeGermanLenientCaseSensitive(target);

  if (lenientInputCS === lenientTargetCS) {
    return { ok: true, spellingNote: true };
  }

  // Check if it would match case-insensitively
  const normInputCI = normalizeGermanInput(input);
  const normTargetCI = normalizeGermanInput(target);
  const lenientInputCI = normalizeGermanLenient(input);
  const lenientTargetCI = normalizeGermanLenient(target);

  if (normInputCI === normTargetCI || lenientInputCI === lenientTargetCI) {
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  return { ok: false, spellingNote: false };
}

// Expand common English contractions so "it's already late" == "it is already
// late", "let's start" == "let us start", etc. Applied to BOTH the answer key
// and the learner's input, so either form is accepted. (The 's/'d expansions
// are ambiguous in rare cases — "he's gone" as "he has" — an acceptable trade
// for beginner-level sentences.)
const CONTRACTIONS: [RegExp, string][] = [
  [/\blet[’'`´]?s\b/gi, "let us"],
  [/\bwon[’'`´]?t\b/gi, "will not"],
  [/\bcan[’'`´]?t\b/gi, "cannot"],
  [/\bshan[’'`´]?t\b/gi, "shall not"],
  [/\b(\w+)n[’'`´]?t\b/gi, "$1 not"],           // don't/dont, isn't/isnt, wasn't/wasnt, couldn't/couldnt…
  [/\bi[’'`´]?m\b/gi, "i am"],
  [/\b(\w+)[’'`´]re\b/gi, "$1 are"],             // you're, we're, they're
  [/\b(you|they)re\b/gi, "$1 are"],              // youre, theyre (avoiding 'were' conflict)
  [/\b(\w+)[’'`´]ve\b/gi, "$1 have"],            // I've, you've...
  [/\b(i|you|we|they)ve\b/gi, "$1 have"],        // ive, youve, weve, theyve
  [/\b(\w+)[’'`´]ll\b/gi, "$1 will"],
  [/\b(i|you|he|she|it|they)ll\b/gi, "$1 will"], // ill, youll... (avoiding 'well' conflict)
  [/\b(\w+)[’'`´]d\b/gi, "$1 would"],
  [/\b(you|he|she|we|they)d\b/gi, "$1 would"],   // youd, hed... (avoiding 'id' conflict)
  [/\b(it|that|there|here|what|who|where|when|why|how|he|she)[’'`´]?s\b/gi, "$1 is"], // it's/its, that's/thats...
];

// Common text-speak, expanded on BOTH sides: the learner may type "pls", and
// some answer keys (the texting pack) themselves contain "rn"/"idk" — so the
// full words must also match those keys.
const TEXT_SPEAK: [RegExp, string][] = [
  [/\bpls\b/g, "please"], [/\bplz\b/g, "please"],
  [/\bthx\b/g, "thanks"], [/\btysm\b/g, "thank you so much"], [/\bty\b/g, "thank you"],
  [/\bu\b/g, "you"], [/\bur\b/g, "your"], [/\br\b/g, "are"], [/\bim\b/g, "i am"],
  [/\bidk\b/g, "i do not know"], [/\bdunno\b/g, "do not know"],
  [/\bcuz\b/g, "because"], [/\bcos\b/g, "because"], [/\bbc\b/g, "because"],
  [/\brn\b/g, "right now"], [/\bnvm\b/g, "never mind"], [/\bnp\b/g, "no problem"],
  [/\bbtw\b/g, "by the way"], [/\bomw\b/g, "on my way"],
  [/\btho\b/g, "though"], [/\bthru\b/g, "through"],
  [/\btmrw\b/g, "tomorrow"], [/\btmr\b/g, "tomorrow"],
  [/\bppl\b/g, "people"], [/\bmsg\b/g, "message"],
  [/\bokay\b/g, "ok"], [/\bkk\b/g, "ok"],
  [/\bgotta\b/g, "got to"], [/\bgn\b/g, "good night"],
  [/\bofc\b/g, "of course"],
  [/\bsec\b/g, "second"],
  // apostrophe-less question contractions — unambiguous tokens
  [/\bwhats\b/g, "what is"], [/\bwhens\b/g, "when is"], [/\bwheres\b/g, "where is"],
  [/\bwhos\b/g, "who is"], [/\bwhys\b/g, "why is"], [/\bhows\b/g, "how is"],
  [/\bthats\b/g, "that is"], [/\btheres\b/g, "there is"], [/\bheres\b/g, "here is"],
];

function expandEnglishContractions(t: string) {
  let s = String(t ?? "").toLowerCase().replace(/[’`´]/g, "'");
  for (const [re, sub] of CONTRACTIONS) s = s.replace(re, sub);
  for (const [re, sub] of TEXT_SPEAK) s = s.replace(re, sub);
  return s;
}

// Digits fold to number words so "3 nights" == "three nights".
const NUM_WORDS: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
  "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
  "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen",
  "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen",
  "18": "eighteen", "19": "nineteen", "20": "twenty", "30": "thirty",
  "40": "forty", "50": "fifty", "60": "sixty", "70": "seventy",
  "80": "eighty", "90": "ninety", "100": "one hundred",
};

// Canonicalize grammatical paraphrases that mean the same thing, so British
// and American forms both pass: "Have you got this?" == "Do you have this?",
// "She's got a car" == "She has a car". Both sides are reduced to the same
// bare form ("you have this") purely for comparison — never for display.
function canonicalizeEnglish(t: string) {
  return t
    .replace(/\bgonna\b/g, "going to")
    .replace(/\bwanna\b/g, "want to")
    .replace(/\bthank you\b/g, "thanks")
    .replace(/\bper\b/g, "for")          // "per night" == "for the night" (articles drop in the same tier)
    .replace(/\bcould\b/g, "can")        // polite request forms are interchangeable for comprehension
    .replace(/\bmay (i|we)\b/g, "can $1") // "May I speak to..." == "Can I speak to..."
    .replace(/\bshall\b/g, "should")     // "Shall we meet?" == "Should we meet?"
    .replace(/\b(alright|all right)\b/g, "ok")   // "alright" == "all right" == "okay" ("okay" already folds to "ok")
    // whose/who's homophone: the app tests GERMAN comprehension — an English
    // homophone slip ("whos turn is it") shouldn't fail the lesson. "whose"
    // folds to "who is", the same form the contraction expander gives whos/who's.
    .replace(/\bwhose\b/g, "who is")
    .replace(/\b(\d{1,3})\b/g, (m) => NUM_WORDS[m] ?? m)  // "3 nights" == "three nights"
    .replace(/\b(do|does|did) (\w+) have\b/g, "$2 have")   // do-support: "do you have" -> "you have"
    .replace(/\bhave (\w+) got\b/g, "$1 have")             // "have you got" -> "you have"
    .replace(/\bhas (\w+) got\b/g, "$1 have")              // "has she got" -> "she have"
    .replace(/\b(\w+) (?:has|have|is) got\b/g, "$1 have")  // "she has/is got" (is = 's expansion) -> "she have"
    .replace(/\bhas\b/g, "have")                          // person-neutral for comparison only
    
    // Polite request / question equivalents
    .replace(/\bcould\b/g, "can")
    
    // Common vocabulary synonyms
    .replace(/\bavailable\b/g, "free")
    .replace(/\breserved\b/g, "booked")
    .replace(/\belevator\b/g, "lift")
    .replace(/\bcheck\b/g, "bill")
    .replace(/\b(restroom|bathroom|washroom|loo)\b/g, "toilet")
    .replace(/\b(arrange|schedule|set up)\b/g, "make")
    .replace(/\b(meeting|date)\b/g, "appointment")
    .replace(/\b(pub|bar)\b/g, "pub")
    .replace(/\b(underground|metro|tube)\b/g, "subway")
    .replace(/\bstore\b/g, "shop")
    .replace(/\bfootball\b/g, "soccer")
    .replace(/\b(purse|handbag)\b/g, "bag")
    .replace(/\bauto\b/g, "car");
}

// Answer keys sometimes carry helper notes in parentheses, e.g.
// "Ok, sleep well. Love ya! (hab dich lieb)" — those are display hints, never
// something the learner should have to type.
function stripParentheticals(t: string) {
  return String(t ?? "").replace(/\([^)]*\)/g, " ");
}

// English articles are meaning-neutral for these translations: "I see the
// cash" and "I see cash" both show the German was understood.
function stripArticles(t: string) {
  return t.replace(/\b(a|an|the)\b/g, " ");
}

// True when a and b differ by at most one edit: insert/delete/substitute, or
// one adjacent swap ("learnign" == "learning").
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length === b.length) {
    const diffs: number[] = [];
    for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) diffs.push(k);
    if (diffs.length === 1) return true; // substitution
    if (diffs.length === 2) {
      const [x, y] = diffs;
      return y === x + 1 && a[x] === b[y] && a[y] === b[x]; // adjacent swap
    }
    return false;
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  if (l.length - s.length > 1) return false;
  let i = 0, j = 0, skipped = false;
  while (i < s.length && j < l.length) {
    if (s[i] === l[j]) { i++; j++; continue; }
    if (skipped) return false;
    skipped = true;
    j++; // skip the extra char in the longer word
  }
  return true;
}

// A single edit at the very end of a word involving s/d is usually GRAMMAR,
// not a typo — "tastes" vs "tasted" (tense), "plays" vs "played". Those must
// not be forgiven; the learner's tense reading is part of the answer.
function isInflectionEdit(a: string, b: string): boolean {
  if (a.length === b.length) {
    return (
      a.slice(0, -1) === b.slice(0, -1) &&
      "sd".includes(a[a.length - 1]) &&
      "sd".includes(b[b.length - 1])
    );
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (long.length - short.length !== 1) return false;
  const last = long[long.length - 1];
  return long.slice(0, -1) === short && (last === "s" || last === "d");
}

// Word-by-word typo tolerance: same word count, each word exact or (length >= 5
// on both sides and within one edit), at most 2 fuzzy words per sentence.
// Final-letter s/d edits are excluded — that's tense/agreement, not spelling.
function typoClose(a: string, b: string): boolean {
  const wa = a.split(" ").filter(Boolean);
  const wb = b.split(" ").filter(Boolean);
  if (wa.length !== wb.length || wa.length === 0) return false;
  let fuzzy = 0;
  for (let k = 0; k < wa.length; k++) {
    if (wa[k] === wb[k]) continue;
    if (
      wa[k].length >= 5 && wb[k].length >= 5 &&
      withinOneEdit(wa[k], wb[k]) &&
      !isInflectionEdit(wa[k], wb[k])
    ) {
      if (++fuzzy > 2) return false;
      continue;
    }
    return false;
  }
  return fuzzy > 0;
}

export function matchEnglishPhrase(input: string, target: string): { ok: boolean; spellingNote: boolean } {
  // "A / B" answer keys offer alternatives — accept a match against either
  // side (or the whole thing). Recurse per segment, slash-free.
  if (/\//.test(String(target ?? ""))) {
    const segments = String(target).split("/").map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      const r = matchEnglishPhrase(input, seg);
      if (r.ok) return r;
    }
    // fall through: compare against the whole key with "/" as a space
  }
  // "ur" is ambiguous text-speak (your / you are). The main table expands it to
  // "your"; if that fails, retry once with "you are" (recursion-safe: the
  // replacement removes the token).
  if (/\bur\b/i.test(String(input ?? ""))) {
    const alt = matchEnglishPhrase(String(input).replace(/\bur\b/gi, "you are"), target);
    if (alt.ok) return alt;
  }
  const inputNorm = stripParentheticals(normalizeEnglishSpelling(input));
  const targetNorm = stripParentheticals(normalizeEnglishSpelling(target));
  // Tier 1: plain ("dont" == "don't" via apostrophe stripping).
  const plain = matchGermanPhrase(inputNorm, targetNorm);
  if (plain.ok) return plain;
  // Tier 2: contractions expanded ("it is" == "it's", "let us" == "let's").
  const inputC = expandEnglishContractions(inputNorm);
  const targetC = expandEnglishContractions(targetNorm);
  const contracted = matchGermanPhrase(inputC, targetC);
  if (contracted.ok) return contracted;
  // Tier 3: articles ignored ("I see the cash" == "I see cash").
  const articles = matchGermanPhrase(stripArticles(inputC), stripArticles(targetC));
  if (articles.ok) return articles;
  // Tier 4: grammatical paraphrases ("Have you got X?" == "Do you have X?"),
  // alone and with articles ignored.
  const inputK = canonicalizeEnglish(inputC);
  const targetK = canonicalizeEnglish(targetC);
  const canonical = matchGermanPhrase(inputK, targetK);
  if (canonical.ok) return canonical;
  const canonicalArticles = matchGermanPhrase(stripArticles(inputK), stripArticles(targetK));
  if (canonicalArticles.ok) return canonicalArticles;
  // Tier 4.5: compound-word spacing — "wifi" == "Wi-Fi" == "wi fi",
  // "checkout" == "check-out". Hyphens became spaces during normalization, so
  // comparing with ALL spaces removed folds every compound-spacing variant.
  // Cross-compare every normalization form: a sloppy input ("isnt", "hes")
  // may only align with the target's UNexpanded form and vice versa.
  const spaceless = (s: string) => normalizeGermanInput(s).replace(/ /g, "");
  const inputForms = [inputNorm, inputC, inputK].map(spaceless);
  const targetForms = [targetNorm, targetC, targetK].map(spaceless);
  if (inputForms.some((i) => targetForms.includes(i))) {
    return { ok: true, spellingNote: false };
  }
  // Tier 5: small typos ("alredy" == "already") — flagged as a spelling note.
  // Tried on plain, contraction-expanded and canonical pairs, since a sloppy
  // input ("its") may only align with one form of the target.
  if (
    typoClose(normalizeGermanInput(inputNorm), normalizeGermanInput(targetNorm)) ||
    typoClose(normalizeGermanInput(inputC), normalizeGermanInput(targetC)) ||
    typoClose(normalizeGermanInput(inputK), normalizeGermanInput(targetK))
  ) {
    return { ok: true, spellingNote: true };
  }
  return { ok: false, spellingNote: false };
}
