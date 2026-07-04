import { normalizeEnglishSpelling } from "@/lib/englishVariant";

/** Normalize German learner input for comparison (typing or speech transcript). */

export function normalizeGermanInput(t: string) {
  return String(t ?? "")
    .toLowerCase()
    .trim()
    .replace(/[’'`´]/g, "")        // apostrophes don't matter: "don't" == "dont"
    .replace(/[-–—/]/g, " ")       // hyphens, dashes, slashes act as spaces: "after-work" == "after work"
    .replace(/[.!?,;:"()]/g, "")   // drop sentence punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeGermanLenient(t: string) {
  return normalizeGermanInput(t)
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
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

export function matchEnglishPhrase(input: string, target: string) {
  const inputNorm = normalizeEnglishSpelling(input);
  const targetNorm = normalizeEnglishSpelling(target);
  // Plain comparison first ("dont" == "don't" via apostrophe stripping), then
  // retry with contractions expanded ("it is" == "it's", "let us" == "let's").
  const plain = matchGermanPhrase(inputNorm, targetNorm);
  if (plain.ok) return plain;
  return matchGermanPhrase(expandEnglishContractions(inputNorm), expandEnglishContractions(targetNorm));
}
