import { normalizeEnglishSpelling } from "@/lib/englishVariant";

/** Normalize German learner input for comparison (typing or speech transcript). */

export function normalizeGermanInput(t: string) {
  return String(t ?? "")
    .toLowerCase()
    .trim()
    .replace(/[.!?,;:]/g, "")
    .replace(/\s+/g, " ");
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

export function matchEnglishPhrase(input: string, target: string) {
  return matchGermanPhrase(normalizeEnglishSpelling(input), normalizeEnglishSpelling(target));
}
