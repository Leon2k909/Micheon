import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

export type EnglishVariant = "auto" | "british" | "american";
export type ResolvedEnglishVariant = "british" | "american";

export const ENGLISH_VARIANT_KEY = "english-variant";

const BRITISH_REGIONS = new Set(["gb", "uk", "ie", "au", "nz", "za"]);

export function detectEnglishVariant(): ResolvedEnglishVariant {
  if (typeof navigator === "undefined") return "american";

  const languages = [navigator.language, ...(navigator.languages ?? [])]
    .filter(Boolean)
    .map((language) => language.toLowerCase());

  for (const language of languages) {
    const region = language.split(/[-_]/)[1];
    if (region && BRITISH_REGIONS.has(region)) return "british";
    if (region === "us") return "american";
  }

  return "american";
}

export function getEnglishVariant(profile?: UserProfile | null): EnglishVariant {
  return loadScopedJson<EnglishVariant>(ENGLISH_VARIANT_KEY, "auto", profile);
}

export function setEnglishVariant(value: EnglishVariant, profile?: UserProfile | null) {
  saveScopedJson(ENGLISH_VARIANT_KEY, value, profile);
}

export function resolveEnglishVariant(value: EnglishVariant): ResolvedEnglishVariant {
  return value === "auto" ? detectEnglishVariant() : value;
}

export function formatEnglishText(text: string, variant: EnglishVariant | ResolvedEnglishVariant) {
  const resolved = variant === "auto" ? detectEnglishVariant() : variant;
  if (resolved === "british") {
    return String(text ?? "")
      .replace(/\b[Pp]ractice\b/g, (match) => match[0] === "P" ? "Practise" : "practise")
      .replace(/\b[Pp]ractices\b/g, (match) => match[0] === "P" ? "Practises" : "practises")
      .replace(/\b[Pp]racticed\b/g, (match) => match[0] === "P" ? "Practised" : "practised")
      .replace(/\b[Pp]racticing\b/g, (match) => match[0] === "P" ? "Practising" : "practising");
  }

  return String(text ?? "")
    .replace(/\b[Pp]ractise\b/g, (match) => match[0] === "P" ? "Practice" : "practice")
    .replace(/\b[Pp]ractises\b/g, (match) => match[0] === "P" ? "Practices" : "practices")
    .replace(/\b[Pp]ractised\b/g, (match) => match[0] === "P" ? "Practiced" : "practiced")
    .replace(/\b[Pp]ractising\b/g, (match) => match[0] === "P" ? "Practicing" : "practicing");
}

export function normalizeEnglishSpelling(text: string) {
  return String(text ?? "")
    .replace(/\bpractise\b/gi, "practice")
    .replace(/\bpractises\b/gi, "practices")
    .replace(/\bpractised\b/gi, "practiced")
    .replace(/\bpractising\b/gi, "practicing");
}
