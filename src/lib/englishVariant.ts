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
    .replace(/\bpractising\b/gi, "practicing")
    .replace(/\b(col|flav|hum|lab|neighb|behavi|rum|hon|fav)our(s|ed|ing|ful|less|ly)?\b/gi, "$1or$2")
    .replace(/\b(real|organ|apolog|normal|general|social|summar|character|priorit|minim|maxim|recogn|memor|standard|custom|final|critic|emphas)is(e|es|ed|ing|ation|ations|er|ers|able)\b/gi, "$1iz$2")
    .replace(/\b(cent|theat|met|lit|fib)re(s)?\b/gi, "$1er$2")
    .replace(/\b(travel|cancel|label|signal|model)ll(ed|ing|er|ers)\b/gi, "$1l$2")
    .replace(/\blicence(s)?\b/gi, "license$1")
    .replace(/\b(def|off)ence(s)?\b/gi, "$1ense$2")
    .replace(/\b(anal|dial|catal|mon|pro)ogue(s)?\b/gi, "$1og$2")
    .replace(/\bgrey\b/gi, "gray")
    .replace(/\bprogramme(s)?\b/gi, "program$1")
    .replace(/\bpaediatric(s)?\b/gi, "pediatric$1")
    .replace(/\bgynaecolog(y|ist|ists)\b/gi, "gynecolog$1")
    .replace(/\b(leuk|an)aemi(a|c)\b/gi, "$1emi$2")
    .replace(/\bdiarrhoea\b/gi, "diarrhea")
    .replace(/\boestrogen\b/gi, "estrogen")
    .replace(/\bfoetus(es)?\b/gi, "fetus$1")
    .replace(/\bmanoeuvre(s|d|ing)?\b/gi, "maneuver$1")
    .replace(/\bstorey(s)?\b/gi, "story$1")
    .replace(/\bplough(s|ed|ing)?\b/gi, "plow$1")
    .replace(/\bageing\b/gi, "aging")
    .replace(/\b(judge|acknowledge)ment(s)?\b/gi, "$1ment$2")
    .replace(/\b(mould|moult|savour)\b/gi, (m) => m.toLowerCase() === "mould" ? "mold" : m.toLowerCase() === "moult" ? "molt" : "savor")
    .replace(/\bcosy\b/gi, "cozy")
    .replace(/\bmoustache\b/gi, "mustache")
    .replace(/\b(skil|wil)ful\b/gi, "$1lful")
    .replace(/\b(enrol|instal)ment(s)?\b/gi, "$1lment$2")
    .replace(/\bcheque(s)?\b/gi, "check$1")
    .replace(/\bdraught(s)?\b/gi, "draft$1")
    .replace(/\bsulphur\b/gi, "sulfur")
    .replace(/\btyre(s)?\b/gi, "tire$1")
    .replace(/\bkerb(s)?\b/gi, "curb$1")
    .replace(/\bpyjamas\b/gi, "pajamas")
    .replace(/\bwhisky\b/gi, "whiskey")
    .replace(/\byoghurt(s)?\b/gi, "yogurt$1")
    .replace(/\b(anal|paral)ys(e|es|ed|ing|is|ist|ists|er|ers)\b/gi, "$1yz$2")
    .replace(/\baluminium\b/gi, "aluminum")
    .replace(/\bspeciality\b/gi, "specialty")
    .replace(/\bjeweller(y|ies)\b/gi, "jewelr$1")
    .replace(/\bomelette(s)?\b/gi, "omelet$1")
    .replace(/\bchilli(es)?\b/gi, "chili$1")
    .replace(/\bdoughnut(s)?\b/gi, "donut$1")
    .replace(/\bracquet(s)?\b/gi, "racket$1")
    .replace(/\bsceptic(al|ally|ism|s)?\b/gi, "skeptic$1")
    .replace(/\baeroplane(s)?\b/gi, "airplane$1")
    .replace(/\baxe(s)?\b/gi, "ax$1")
    .replace(/\bwoollen\b/gi, "woolen")
    .replace(/\bfulfilment\b/gi, "fulfillment")
    .replace(/\b(fulfil|enrol|instal|distil)(s)?\b/gi, "$1l$2");
}
