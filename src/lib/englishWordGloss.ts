import bundledWordBank from "@/lib/bundledWordBank.json";

/**
 * German gloss for a visible English word — the learn-English mirror of
 * germanWordGloss. A German speaker hovering "goal" in an English sentence
 * should see "das Ziel" the same way an English speaker hovering "Ziel" sees
 * "goal".
 *
 * The lookup is entirely offline and precision-first: only the PRIMARY
 * English sense of each bank entry is inverted ("control, head" keys only
 * "control" — keying the secondary sense would label the everyday noun
 * "head" with a niche verb), plus a curated set of function words and
 * contractions the bank does not carry. Unknown words stay unlabelled
 * instead of guessing.
 */

type WordBankEntry = {
  de?: string;
  en?: string;
  lookup?: string;
  tip?: string;
};

const stripEnglishPunctuation = (value: string) => String(value ?? "")
  .normalize("NFC")
  .replace(/^[\s.,!?;:()[\]{}"'„“‚‘«»…–—-]+|[\s.,!?;:()[\]{}"'„“‚‘«»…–—-]+$/gu, "");

const wordKey = (value: string) => stripEnglishPunctuation(value).toLocaleLowerCase("en-GB");

/** The primary sense of a gloss: text before the first alternative separator,
 *  minus a leading particle and any bracketed qualifier. Returns "" when the
 *  primary sense is not a single word — a single hovered token cannot mean a
 *  whole phrase. */
const primarySenseKey = (gloss: string): string => {
  const first = String(gloss ?? "")
    .split(/\s*(?:,|\/|\bor\b)\s*/)[0]
    .replace(/\([^)]*\)/g, " ")
    .replace(/^(?:to|a|an|the)\s+/i, "")
    .trim();
  if (!first || /\s/.test(first)) return "";
  return wordKey(first);
};

// Curated function words, forms of be/have, and common contractions — the
// highest-frequency words a German learner of English actually hovers, none
// of which the word bank carries as entries.
const CORE_ENGLISH_GLOSSES: Array<[string, string]> = [
  ["i", "ich"],
  ["you", "du / ihr / Sie"],
  ["he", "er"],
  ["she", "sie"],
  ["it", "es"],
  ["we", "wir"],
  ["they", "sie"],
  ["the", "der / die / das"],
  ["a", "ein / eine"],
  ["an", "ein / eine"],
  ["and", "und"],
  ["or", "oder"],
  ["but", "aber"],
  ["not", "nicht"],
  ["no", "nein / kein"],
  ["yes", "ja"],
  ["is", "ist"],
  ["are", "sind / bist / seid"],
  ["am", "bin"],
  ["was", "war"],
  ["were", "waren / warst / wart"],
  ["be", "sein"],
  ["been", "gewesen"],
  ["being", "seiend / gerade"],
  ["have", "haben"],
  ["has", "hat"],
  ["had", "hatte / gehabt"],
  ["do", "tun / machen"],
  ["does", "tut / macht"],
  ["did", "tat / machte"],
  ["will", "werden (Zukunft)"],
  ["would", "würde"],
  ["can", "können"],
  ["could", "könnte / konnte"],
  ["should", "sollte"],
  ["must", "müssen"],
  ["may", "dürfen / können"],
  ["might", "könnte vielleicht"],
  ["of", "von"],
  ["to", "zu / nach"],
  ["in", "in"],
  ["on", "auf / an"],
  ["at", "an / bei / um"],
  ["for", "für"],
  ["with", "mit"],
  ["from", "von / aus"],
  ["by", "von / bei / mit"],
  ["about", "über / ungefähr"],
  ["this", "dieser / diese / dieses"],
  ["that", "das / dass / jener"],
  ["these", "diese"],
  ["those", "jene / diese"],
  ["there", "dort / da"],
  ["here", "hier"],
  ["my", "mein / meine"],
  ["your", "dein / euer / Ihr"],
  ["his", "sein / seine"],
  ["her", "ihr / ihre / sie"],
  ["our", "unser / unsere"],
  ["their", "ihr / ihre"],
  ["me", "mich / mir"],
  ["him", "ihn / ihm"],
  ["us", "uns"],
  ["them", "sie / ihnen"],
  ["what", "was"],
  ["who", "wer"],
  ["how", "wie"],
  ["when", "wann / wenn / als"],
  ["where", "wo"],
  ["why", "warum"],
  ["because", "weil"],
  ["if", "wenn / ob"],
  ["so", "also / so"],
  ["very", "sehr"],
  ["too", "zu / auch"],
  ["also", "auch"],
  ["i'm", "ich bin"],
  ["i've", "ich habe"],
  ["i'll", "ich werde"],
  ["i'd", "ich würde / ich hätte"],
  ["it's", "es ist"],
  ["that's", "das ist"],
  ["there's", "da ist / es gibt"],
  ["you're", "du bist / ihr seid / Sie sind"],
  ["we're", "wir sind"],
  ["they're", "sie sind"],
  ["don't", "… nicht (mit do)"],
  ["doesn't", "… nicht (mit does)"],
  ["didn't", "… nicht (Vergangenheit)"],
  ["can't", "kann nicht"],
  ["won't", "wird nicht / will nicht"],
  ["isn't", "ist nicht"],
  ["aren't", "sind nicht"],
  ["wasn't", "war nicht"],
  ["let's", "lass uns / lasst uns"],
];

const glossAlternatives = new Map<string, string[]>();

const addGloss = (key: string, german: string) => {
  if (!key || !german) return;
  const list = glossAlternatives.get(key);
  if (!list) glossAlternatives.set(key, [german]);
  else if (list.length < 3 && !list.includes(german)) list.push(german);
};

for (const [key, german] of CORE_ENGLISH_GLOSSES) addGloss(key, german);
// A curated entry is complete in itself — bank inversions must not append
// noun senses onto function words ("will" must stay the future marker, not
// grow "der Wille").
const curatedKeys = new Set(CORE_ENGLISH_GLOSSES.map(([key]) => key));

for (const rawEntry of bundledWordBank as WordBankEntry[]) {
  const german = String(rawEntry.de ?? "").trim();
  if (!german) continue;
  const key = primarySenseKey(rawEntry.en ?? "");
  if (curatedKeys.has(key)) continue;
  addGloss(key, german);
}

/** Inflection bases worth retrying: plural, -ing and -ed forms. Every
 *  plausible base is tried — a miss just falls through to null. */
const lookupKeys = (key: string): string[] => {
  const keys = [key];
  if (key.length > 4 && key.endsWith("ies")) keys.push(`${key.slice(0, -3)}y`);
  if (key.length > 4 && /(?:ches|shes|sses|xes|zes)$/.test(key)) keys.push(key.slice(0, -2));
  if (key.length > 3 && key.endsWith("s") && !/(?:ss|us|is)$/.test(key)) keys.push(key.slice(0, -1));
  for (const [suffix, minLength] of [["ing", 6], ["ed", 5]] as const) {
    if (key.length < minLength || !key.endsWith(suffix)) continue;
    const base = key.slice(0, -suffix.length);
    keys.push(base, `${base}e`);
    if (base.length > 2 && base[base.length - 1] === base[base.length - 2]) {
      keys.push(base.slice(0, -1));
    }
  }
  return keys;
};

/**
 * Returns a short German gloss for a visible English word, or null when the
 * word is not confidently covered.
 */
export function englishWordGloss(word: string): string | null {
  const key = wordKey(word);
  if (!key) return null;
  for (const candidate of lookupKeys(key)) {
    const list = glossAlternatives.get(candidate);
    if (list?.length) return list.join(" / ");
  }
  return null;
}
