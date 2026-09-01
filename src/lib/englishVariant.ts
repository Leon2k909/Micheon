import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

export type EnglishVariant = "auto" | "british" | "american";
type ResolvedEnglishVariant = "british" | "american";

const ENGLISH_VARIANT_KEY = "english-variant";

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

/**
 * Announced, so a change lands on the screen you are looking at.
 *
 * The variant was read from storage at render and never watched, which was
 * fine while it could only be changed in Settings — you came back to a fresh
 * screen either way. It can now be switched from the flag on the typing
 * prompt mid-lesson, and a setting that needs a restart to take effect is
 * not really a switch.
 */
export const ENGLISH_VARIANT_EVENT = "micheon:english-variant";

export function setEnglishVariant(value: EnglishVariant, profile?: UserProfile | null) {
  saveScopedJson(ENGLISH_VARIANT_KEY, value, profile);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ENGLISH_VARIANT_EVENT, { detail: value }));
  }
}

export function resolveEnglishVariant(value: EnglishVariant): ResolvedEnglishVariant {
  return value === "auto" ? detectEnglishVariant() : value;
}

/** Human name for a variant, for labels like "Auto-detect (British English)". */
export function englishVariantLabel(variant: ResolvedEnglishVariant): string {
  return variant === "british" ? "British English" : "American English";
}

/**
 * Word stems that flip between -ise and -ize. An explicit list, never a blind
 * suffix rule: capsize, seize, prize and size must never become -ise, and
 * advertise or surprise must never become -ize.
 */
const IZE_STEMS = "real|organ|apolog|normal|general|social|summar|character|priorit|minim|maxim|recogn|memor|standard|custom|final|critic|emphas|fertil|sympath|author|util|mobil";

/** Stems that flip between -or and -our (colour family). */
const OUR_STEMS = "col|flav|hum|lab|neighb|behavi|rum|hon|fav";
const OUR_SUFFIXES = "s|ed|ing|ful|less|ly|ite|ites|hood|hoods";

/** Match the first-letter case of the source word ("Gray" -> "Grey"). */
function matchWordCase(source: string, replacement: string): string {
  return source[0] >= "A" && source[0] <= "Z"
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;
}

/**
 * Word-for-word display pairs (American form, British form). Only unambiguous
 * pairs belong here: words with a second meaning in one variant (tire, meter,
 * story, check, draft, curb) are deliberately left alone — a wrong "tyre" is
 * worse than a tolerated "tire". Suffix families live in the regex rules below.
 *
 * A few are vocabulary rather than spelling. They earn their place by the same
 * test and no other: freeway means nothing else in British English, motorway
 * means nothing else in American, so the swap is safe read either way. That
 * test is why sidewalk/pavement, flashlight/torch, apartment/flat and
 * vacation/holiday are NOT here — the list is reversed to americanise, and
 * reversing those turns a pavement into a sidewalk, a flaming torch into a
 * flashlight, and a flat tyre into an apartment tyre.
 */
const DISPLAY_WORD_PAIRS: Array<[string, string]> = [
  ["practice", "practise"],
  ["practices", "practises"],
  ["practiced", "practised"],
  ["practicing", "practising"],
  ["gray", "grey"],
  ["program", "programme"],
  ["programs", "programmes"],
  ["license", "licence"],
  ["licenses", "licences"],
  ["donut", "doughnut"],
  ["donuts", "doughnuts"],
  ["pajamas", "pyjamas"],
  ["mustache", "moustache"],
  ["mustaches", "moustaches"],
  ["cozy", "cosy"],
  ["aluminum", "aluminium"],
  ["jewelry", "jewellery"],
  ["specialty", "speciality"],
  ["airplane", "aeroplane"],
  ["airplanes", "aeroplanes"],
  ["yogurt", "yoghurt"],
  ["yogurts", "yoghurts"],
  ["omelet", "omelette"],
  ["omelets", "omelettes"],
  ["chili", "chilli"],
  ["chilies", "chillies"],
  ["ax", "axe"],
  ["woolen", "woollen"],
  ["skillful", "skilful"],
  ["willful", "wilful"],
  ["fulfillment", "fulfilment"],
  ["enrollment", "enrolment"],
  ["enrollments", "enrolments"],
  ["installment", "instalment"],
  ["installments", "instalments"],
  ["judgment", "judgement"],
  ["judgments", "judgements"],
  ["aging", "ageing"],
  ["sulfur", "sulphur"],
  ["mold", "mould"],
  ["molds", "moulds"],
  ["moldy", "mouldy"],
  ["savory", "savoury"],
  ["diarrhea", "diarrhoea"],
  ["estrogen", "oestrogen"],
  ["fetus", "foetus"],
  ["maneuver", "manoeuvre"],
  ["maneuvers", "manoeuvres"],
  ["plow", "plough"],
  ["plows", "ploughs"],
  ["freeway", "motorway"],
  ["freeways", "motorways"],
];

const AMERICAN_TO_BRITISH = new Map(DISPLAY_WORD_PAIRS);
const BRITISH_TO_AMERICAN = new Map(DISPLAY_WORD_PAIRS.map(([us, uk]) => [uk, us] as [string, string]));
const AMERICAN_WORDS_RE = new RegExp(`\\b(${DISPLAY_WORD_PAIRS.map(([us]) => us).join("|")})\\b`, "gi");
const BRITISH_WORDS_RE = new RegExp(`\\b(${DISPLAY_WORD_PAIRS.map(([, uk]) => uk).join("|")})\\b`, "gi");

/** Rewrite American spellings to British for display, preserving case. */
function britishiseEnglishSpelling(text: string) {
  return String(text ?? "")
    .replace(AMERICAN_WORDS_RE, (m) => {
      const uk = AMERICAN_TO_BRITISH.get(m.toLowerCase());
      return uk ? matchWordCase(m, uk) : m;
    })
    .replace(new RegExp(`\\b(${OUR_STEMS})or(${OUR_SUFFIXES})?\\b`, "gi"), "$1our$2")
    .replace(new RegExp(`\\b(${IZE_STEMS})iz(e|es|ed|ing|ation|ations|er|ers|able)\\b`, "gi"), "$1is$2")
    .replace(/\b(cent|theat|lit|fib)er(s)?\b/gi, "$1re$2")
    .replace(/\b(travel|cancel|label|signal|model)(ed|ing|er|ers)\b/gi, "$1l$2")
    .replace(/\b(def|off)ense(s)?\b/gi, "$1ence$2")
    .replace(/\b(anal|dial|catal|mon|pro)og(s)?\b/gi, "$1ogue$2")
    .replace(/\bskeptic(al|ally|ism|s)?\b/gi, (m) => matchWordCase(m, "sceptic" + m.slice(7)))
    .replace(/\bpediatric(s)?\b/gi, (m) => matchWordCase(m, "paediatric" + m.slice(9)));
}

/** Rewrite British spellings to American for display, preserving case. */
function americaniseEnglishSpelling(text: string) {
  return String(text ?? "")
    .replace(BRITISH_WORDS_RE, (m) => {
      const us = BRITISH_TO_AMERICAN.get(m.toLowerCase());
      return us ? matchWordCase(m, us) : m;
    })
    .replace(new RegExp(`\\b(${OUR_STEMS})our(${OUR_SUFFIXES})?\\b`, "gi"), "$1or$2")
    .replace(new RegExp(`\\b(${IZE_STEMS})is(e|es|ed|ing|ation|ations|er|ers|able)\\b`, "gi"), "$1iz$2")
    .replace(/\b(cent|theat|lit|fib)re(s)?\b/gi, "$1er$2")
    .replace(/\b(travel|cancel|label|signal|model)l(ed|ing|er|ers)\b/gi, "$1$2")
    .replace(/\b(def|off)ence(s)?\b/gi, "$1ense$2")
    .replace(/\b(anal|dial|catal|mon|pro)ogue(s)?\b/gi, "$1og$2")
    .replace(/\bsceptic(al|ally|ism|s)?\b/gi, (m) => matchWordCase(m, "skeptic" + m.slice(7)))
    .replace(/\bpaediatric(s)?\b/gi, (m) => matchWordCase(m, "pediatric" + m.slice(10)));
}

export function formatEnglishText(text: string, variant: EnglishVariant | ResolvedEnglishVariant) {
  const resolved = variant === "auto" ? detectEnglishVariant() : variant;
  return resolved === "british"
    ? britishiseEnglishSpelling(String(text ?? ""))
    : americaniseEnglishSpelling(String(text ?? ""));
}

export function normalizeEnglishSpelling(text: string) {
  return String(text ?? "")
    .replace(/\bpractise\b/gi, "practice")
    .replace(/\bpractises\b/gi, "practices")
    .replace(/\bpractised\b/gi, "practiced")
    .replace(/\bpractising\b/gi, "practicing")
    .replace(new RegExp(`\\b(${OUR_STEMS})our(${OUR_SUFFIXES})?\\b`, "gi"), "$1or$2")
    .replace(new RegExp(`\\b(${IZE_STEMS})is(e|es|ed|ing|ation|ations|er|ers|able)\\b`, "gi"), "$1iz$2")
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
    .replace(/\bmould(s|y)\b/gi, "mold$1")
    .replace(/\bsavour(y|ier|iest)\b/gi, "savor$1")
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
