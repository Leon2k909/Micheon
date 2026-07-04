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
    .replace(/ue/g, "u");
}

export function matchGermanPhrase(input: string, target: string) {
  if (normalizeGermanInput(input) === normalizeGermanInput(target)) return { ok: true, spellingNote: false };
  if (normalizeGermanLenient(input) === normalizeGermanLenient(target)) return { ok: true, spellingNote: true };
  return { ok: false, spellingNote: false };
}

// Expand common English contractions so "it's already late" == "it is already
// late", "let's start" == "let us start", etc. Applied to BOTH the answer key
// and the learner's input, so either form is accepted. (The 's/'d expansions
// are ambiguous in rare cases — "he's gone" as "he has" — an acceptable trade
// for beginner-level sentences.)
const CONTRACTIONS: [RegExp, string][] = [
  [/\blet's\b/g, "let us"],
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "cannot"],
  [/\bshan't\b/g, "shall not"],
  [/\b(\w+)n't\b/g, "$1 not"],           // don't, isn't, wasn't, couldn't…
  [/\bi'm\b/g, "i am"],
  [/\b(\w+)'re\b/g, "$1 are"],           // you're, we're, they're
  [/\b(\w+)'ve\b/g, "$1 have"],          // I've, you've, they've
  [/\b(\w+)'ll\b/g, "$1 will"],          // I'll, it'll, we'll
  [/\b(\w+)'d\b/g, "$1 would"],          // I'd, he'd
  [/\b(it|that|there|here|what|who|where|how|he|she)'s\b/g, "$1 is"],
];

function expandEnglishContractions(t: string) {
  let s = String(t ?? "").toLowerCase().replace(/[’`´]/g, "'");
  for (const [re, sub] of CONTRACTIONS) s = s.replace(re, sub);
  return s;
}

// Canonicalize grammatical paraphrases that mean the same thing, so British
// and American forms both pass: "Have you got this?" == "Do you have this?",
// "She's got a car" == "She has a car". Both sides are reduced to the same
// bare form ("you have this") purely for comparison — never for display.
function canonicalizeEnglish(t: string) {
  return t
    .replace(/\bgonna\b/g, "going to")
    .replace(/\bwanna\b/g, "want to")
    .replace(/\b(do|does|did) (\w+) have\b/g, "$2 have")   // do-support: "do you have" -> "you have"
    .replace(/\bhave (\w+) got\b/g, "$1 have")             // "have you got" -> "you have"
    .replace(/\bhas (\w+) got\b/g, "$1 have")              // "has she got" -> "she have"
    .replace(/\b(\w+) (?:has|have|is) got\b/g, "$1 have")  // "she has/is got" (is = 's expansion) -> "she have"
    .replace(/\bhas\b/g, "have");                          // person-neutral for comparison only
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

// Word-by-word typo tolerance: same word count, each word exact or (length >= 5
// on both sides and within one edit), at most 2 fuzzy words per sentence.
function typoClose(a: string, b: string): boolean {
  const wa = a.split(" ").filter(Boolean);
  const wb = b.split(" ").filter(Boolean);
  if (wa.length !== wb.length || wa.length === 0) return false;
  let fuzzy = 0;
  for (let k = 0; k < wa.length; k++) {
    if (wa[k] === wb[k]) continue;
    if (wa[k].length >= 5 && wb[k].length >= 5 && withinOneEdit(wa[k], wb[k])) {
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
