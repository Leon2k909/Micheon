import { resolveInterfaceLanguage, type ResolvedInterfaceLanguage } from "@/lib/interfaceLanguage";
import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Which alphabet a Russian card is SHOWN in.
 *
 * Modelled on englishVariant.ts, and deliberately a separate file rather than
 * a generalisation of it. The two mechanisms look alike from a distance —
 * both rewrite the target text for display and leave the stored text alone —
 * but English swaps whole words out of a list, while this rewrites every
 * letter under rules that depend on what stands beside it. Folding them
 * together would put the UK/US switch, which has worked for months, inside a
 * machine built for a harder problem. So they sit side by side and share
 * nothing.
 *
 * ONLY CYRILLIC IS EVER STORED. The Latin form is computed here, every time,
 * and never written down. Two tables would drift; one cannot.
 */
export type RussianScript = "auto" | "cyrillic" | "latin";
export type ResolvedRussianScript = "cyrillic" | "latin";

export const RUSSIAN_SCRIPT_KEY = "russian-script";

/** Interface languages whose devices already read Cyrillic day to day. */
const CYRILLIC_LOCALES = new Set(["ru", "uk", "be", "bg", "sr", "mk", "kk", "ky", "tg", "mn"]);

/**
 * What "auto" means before the learner has said.
 *
 * A device that already reads Cyrillic gets Cyrillic: nothing is gained by
 * transcribing an alphabet its owner has read since school. Everyone else
 * starts on the Latin crutch, because the first lesson is unreadable
 * otherwise, and the switch is one tap away on the typing prompt.
 */
export function detectRussianScript(): ResolvedRussianScript {
  if (typeof navigator === "undefined") return "latin";

  const languages = [navigator.language, ...(navigator.languages ?? [])]
    .filter(Boolean)
    .map((language) => language.toLowerCase().split(/[-_]/)[0]);

  return languages.some((language) => CYRILLIC_LOCALES.has(language)) ? "cyrillic" : "latin";
}

export function getRussianScript(profile?: UserProfile | null): RussianScript {
  return loadScopedJson<RussianScript>(RUSSIAN_SCRIPT_KEY, "auto", profile);
}

/**
 * Announced, so a change lands on the screen you are looking at — the same
 * reason ENGLISH_VARIANT_EVENT exists. The script can be switched from the
 * typing prompt mid-lesson, and a setting that needs a restart is not a
 * switch.
 */
export const RUSSIAN_SCRIPT_EVENT = "micheon:russian-script";

export function setRussianScript(value: RussianScript, profile?: UserProfile | null) {
  saveScopedJson(RUSSIAN_SCRIPT_KEY, value, profile);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(RUSSIAN_SCRIPT_EVENT, { detail: value }));
  }
}

export function resolveRussianScript(value: RussianScript): ResolvedRussianScript {
  return value === "auto" ? detectRussianScript() : value;
}

/**
 * The voice always speaks Russian.
 *
 * The script is a reading aid; the sound behind it does not change. This
 * exists so no call site is tempted to derive a voice from the alphabet on
 * screen and read a transcription aloud in German.
 */
export function russianVoiceLang(): "ru-RU" {
  return "ru-RU";
}

/** Human name for a script, for labels like "Auto-detect (Cyrillic)". */
export function russianScriptLabel(script: ResolvedRussianScript): string {
  return script === "cyrillic" ? "Cyrillic" : "Latin";
}

/**
 * How a Cyrillic letter is written, given what stands around it.
 *
 * Every slot is optional and `base` is the answer when none of them fires.
 * The slots are checked in the order below, which is the order the sources
 * state their own rules in:
 *
 *   initial       at the start of a word
 *   afterSign     the letter before was ь or ъ
 *   afterAny      the letter before is in this set (per row, per language —
 *                 the sets differ, so they are written out rather than named)
 *   betweenVowels a vowel on both sides
 *   afterVowel    the letter before was a vowel
 *   finalAfterAny at the end of a word, after one of this set
 *   beforeAny     the letter after is in this set
 *   base          everything else
 */
type LetterRule = {
  base: string;
  initial?: string;
  afterSign?: string;
  afterAny?: ReadonlyArray<readonly [string, string]>;
  betweenVowels?: string;
  afterVowel?: string;
  finalAfterAny?: ReadonlyArray<readonly [string, string]>;
  beforeAny?: ReadonlyArray<readonly [string, string]>;
};

type ScriptTable = Readonly<Record<string, LetterRule>>;

const CYRILLIC_VOWELS = "аеёиоуыэюя";
const CYRILLIC_SIGNS = "ьъ";

/**
 * The alphabet, in order, so every table below can be read as a column and
 * checked against its source without hunting.
 */
export const RUSSIAN_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

/**
 * GERMAN — Duden-Transkription, the one German newspapers and Wikipedia use.
 * Chosen because it is what a German reader has already seen in "Chruschtschow"
 * and "Gorbatschow", and because reading it aloud with German letter values
 * lands close to the Russian.
 */
const DE_TABLE: ScriptTable = {
  а: { base: "a" },
  б: { base: "b" },
  в: { base: "w" },
  г: { base: "g" },
  д: { base: "d" },
  е: { base: "e", initial: "je", afterVowel: "je", afterSign: "je" },
  ё: { base: "jo", afterAny: [["жчшщ", "o"]] },
  ж: { base: "sch" },
  з: { base: "s" },
  и: { base: "i", afterSign: "ji" },
  й: { base: "j", afterAny: [["иы", ""]] },
  к: { base: "k" },
  л: { base: "l" },
  м: { base: "m" },
  н: { base: "n" },
  о: { base: "o" },
  п: { base: "p" },
  р: { base: "r" },
  с: { base: "s", betweenVowels: "ss" },
  т: { base: "t" },
  у: { base: "u" },
  ф: { base: "f" },
  х: { base: "ch" },
  ц: { base: "z" },
  ч: { base: "tsch" },
  ш: { base: "sch" },
  щ: { base: "schtsch" },
  ъ: { base: "" },
  ы: { base: "y" },
  ь: { base: "" },
  э: { base: "e" },
  ю: { base: "ju" },
  я: { base: "ja" },
};

/**
 * ENGLISH — BGN/PCGN, in the plain form that carries no diacritics.
 * BGN/PCGN writes ё as ë; English does not use ë, so this table writes the
 * "yo"/"o" that English actually prints (Fyodor, Pyotr, Gorbachov).
 */
const EN_TABLE: ScriptTable = {
  а: { base: "a" },
  б: { base: "b" },
  в: { base: "v" },
  г: { base: "g" },
  д: { base: "d" },
  е: { base: "e", initial: "ye", afterVowel: "ye", afterSign: "ye", afterAny: [["й", "ye"]] },
  ё: { base: "yo", afterAny: [["жчшщ", "o"]] },
  ж: { base: "zh" },
  з: { base: "z" },
  и: { base: "i", afterSign: "yi" },
  й: { base: "y" },
  к: { base: "k" },
  л: { base: "l" },
  м: { base: "m" },
  н: { base: "n" },
  о: { base: "o" },
  п: { base: "p" },
  р: { base: "r" },
  с: { base: "s" },
  т: { base: "t" },
  у: { base: "u" },
  ф: { base: "f" },
  х: { base: "kh" },
  ц: { base: "ts" },
  ч: { base: "ch" },
  ш: { base: "sh" },
  щ: { base: "shch" },
  ъ: { base: "" },
  ы: { base: "y" },
  ь: { base: "" },
  э: { base: "e" },
  ю: { base: "yu" },
  я: { base: "ya" },
};

/**
 * FRENCH — the transcription française used by Le Monde and the French
 * Wikipedia (Khrouchtchev, Tchekhov, Gorbatchev). It keeps ï, which French
 * writes natively and a French keyboard reaches with the ¨ dead key.
 */
const FR_TABLE: ScriptTable = {
  а: { base: "a" },
  б: { base: "b" },
  в: { base: "v" },
  г: { base: "g", beforeAny: [["еиы", "gu"]] },
  д: { base: "d" },
  е: { base: "e", initial: "ie", afterVowel: "ïe", afterSign: "ie" },
  ё: { base: "io", afterAny: [["жчшщ", "o"]] },
  ж: { base: "j" },
  з: { base: "z" },
  и: { base: "i", afterVowel: "ï" },
  й: { base: "ï", afterAny: [["иы", ""]] },
  к: { base: "k" },
  л: { base: "l" },
  м: { base: "m" },
  // French adds a silent e so the n is pronounced rather than nasalised:
  // Пушкин is Pouchkine, Сталин Staline. Without it "Pouchkin" rhymes with
  // "matin", which is a different sound in the one language this table is for.
  н: { base: "n", finalAfterAny: [["иы", "ne"]] },
  о: { base: "o" },
  п: { base: "p" },
  р: { base: "r" },
  с: { base: "s", betweenVowels: "ss" },
  т: { base: "t" },
  у: { base: "ou" },
  ф: { base: "f" },
  х: { base: "kh" },
  ц: { base: "ts" },
  ч: { base: "tch" },
  ш: { base: "ch" },
  щ: { base: "chtch" },
  ъ: { base: "" },
  ы: { base: "y" },
  ь: { base: "" },
  э: { base: "e" },
  ю: { base: "iou" },
  я: { base: "ia" },
};

/**
 * POLISH — transkrypcja polska as PWN lays it down, the system Polish
 * publishing and the Polish Wikipedia follow. It keeps ż and ł, which are
 * Polish letters in their own right and sit on a Polish keyboard.
 *
 * The set "жлцчшщ" appears three times below and is not a phonetic class: it
 * is the list PWN names for е, ё, ю and я. Л is in it because лe is already
 * written "le" — л before a soft vowel is plain l — so the vowel must not add
 * a second j.
 */
const PL_TABLE: ScriptTable = {
  а: { base: "a" },
  б: { base: "b" },
  в: { base: "w" },
  г: { base: "g" },
  д: { base: "d" },
  е: { base: "ie", initial: "je", afterVowel: "je", afterSign: "je", afterAny: [["жлцчшщ", "e"]] },
  ё: { base: "io", initial: "jo", afterVowel: "jo", afterSign: "jo", afterAny: [["жлцчшщ", "o"]] },
  ж: { base: "ż" },
  з: { base: "z" },
  и: { base: "i", afterSign: "ji", afterAny: [["жцш", "y"]] },
  й: { base: "j" },
  к: { base: "k" },
  л: { base: "ł", beforeAny: [["еёиюяь", "l"]] },
  м: { base: "m" },
  н: { base: "n" },
  о: { base: "o" },
  п: { base: "p" },
  р: { base: "r" },
  с: { base: "s" },
  т: { base: "t" },
  у: { base: "u" },
  ф: { base: "f" },
  х: { base: "ch" },
  ц: { base: "c" },
  ч: { base: "cz" },
  ш: { base: "sz" },
  щ: { base: "szcz" },
  ъ: { base: "" },
  ы: { base: "y" },
  ь: { base: "" },
  э: { base: "e" },
  ю: { base: "iu", initial: "ju", afterVowel: "ju", afterSign: "ju", afterAny: [["жлцчшщ", "u"]] },
  я: { base: "ia", initial: "ja", afterVowel: "ja", afterSign: "ja", afterAny: [["жлцчшщ", "a"]] },
};

/**
 * SPANISH — the Calonge system, which Fundéu recommends and the RAE follows
 * (Chéjov, Pushkin, Serguéi). Calonge also marks the stressed syllable with
 * an accent; unpointed Cyrillic does not say where the stress is, so this
 * table leaves the accents off rather than guessing at them.
 */
const ES_TABLE: ScriptTable = {
  а: { base: "a" },
  б: { base: "b" },
  в: { base: "v" },
  г: { base: "g", beforeAny: [["еиы", "gu"]] },
  д: { base: "d" },
  е: { base: "e", initial: "ye", afterVowel: "ie", afterSign: "ie" },
  ё: { base: "io", initial: "yo", afterSign: "io", afterAny: [["жчшщ", "o"]] },
  ж: { base: "zh" },
  з: { base: "z" },
  и: { base: "i" },
  й: { base: "i", afterAny: [["иы", ""]] },
  к: { base: "k" },
  л: { base: "l" },
  м: { base: "m" },
  н: { base: "n" },
  о: { base: "o" },
  п: { base: "p" },
  р: { base: "r" },
  с: { base: "s" },
  т: { base: "t" },
  у: { base: "u" },
  ф: { base: "f" },
  х: { base: "j" },
  ц: { base: "ts" },
  ч: { base: "ch" },
  ш: { base: "sh" },
  щ: { base: "sch" },
  ъ: { base: "" },
  ы: { base: "y" },
  ь: { base: "" },
  э: { base: "e" },
  ю: { base: "iu", initial: "yu", afterVowel: "yu", afterSign: "iu" },
  я: { base: "ia", initial: "ya", afterVowel: "ya", afterSign: "ia" },
};

/**
 * Which table each interface language reads.
 *
 * Portuguese has no Russian transcription of its own here yet and reads the
 * English table. That is a stopgap and nothing more: nobody has looked up
 * what Portuguese practice actually is, and this line must not be read as an
 * answer to that question. A pt row belongs here the day somebody does.
 */
const TABLES: Record<ResolvedInterfaceLanguage, ScriptTable> = {
  de: DE_TABLE,
  en: EN_TABLE,
  fr: FR_TABLE,
  pl: PL_TABLE,
  es: ES_TABLE,
  pt: EN_TABLE,
};

/** The five tables, named — for the sample sheet and the build gate. */
export const RUSSIAN_SCRIPT_LANGUAGES: ReadonlyArray<ResolvedInterfaceLanguage> = ["de", "en", "fr", "pl", "es"];

function isCyrillicLetter(char: string): boolean {
  return char !== "" && /[Ѐ-ӿ]/.test(char);
}

/** One letter, under the rules of one table, in the word it stands in. */
function renderLetter(table: ScriptTable, word: string, index: number): string {
  const lower = word[index].toLowerCase();
  const rule = table[lower];
  if (!rule) return word[index];

  const prev = index > 0 ? word[index - 1].toLowerCase() : "";
  const next = index + 1 < word.length ? word[index + 1].toLowerCase() : "";

  // Every test below is guarded against an empty neighbour, because
  // "аеёиоуыэюя".includes("") is true in JavaScript. Unguarded, the first
  // letter of every word counted as standing after a vowel AND after a soft
  // sign: Сергеевич came out "Ssergejewitsch" and Ильич "Jiljitsch".
  if (index === 0 && rule.initial !== undefined) return rule.initial;
  if (rule.afterSign !== undefined && prev !== "" && CYRILLIC_SIGNS.includes(prev)) return rule.afterSign;
  if (rule.afterAny) {
    for (const [chars, rendering] of rule.afterAny) {
      if (prev !== "" && chars.includes(prev)) return rendering;
    }
  }
  if (
    rule.betweenVowels !== undefined
    && prev !== "" && CYRILLIC_VOWELS.includes(prev)
    && next !== "" && CYRILLIC_VOWELS.includes(next)
  ) return rule.betweenVowels;
  if (rule.afterVowel !== undefined && prev !== "" && CYRILLIC_VOWELS.includes(prev)) return rule.afterVowel;
  if (rule.finalAfterAny && next === "") {
    for (const [chars, rendering] of rule.finalAfterAny) {
      if (prev !== "" && chars.includes(prev)) return rendering;
    }
  }
  if (rule.beforeAny) {
    for (const [chars, rendering] of rule.beforeAny) {
      if (next !== "" && chars.includes(next)) return rendering;
    }
  }
  return rule.base;
}

/**
 * Put the capitals back.
 *
 * Done on the finished word rather than letter by letter, because several
 * letters transcribe to nothing — a capital Ь or a dropped Й would otherwise
 * take the capital with it and leave the word starting lower case.
 */
function applyWordCase(source: string, rendered: string): string {
  if (!rendered) return rendered;
  const letters = [...source].filter(isCyrillicLetter);
  if (!letters.length) return rendered;
  const upper = letters.filter((char) => char === char.toUpperCase() && char !== char.toLowerCase());
  if (letters.length > 1 && upper.length === letters.length) return rendered.toUpperCase();
  if (upper.length && letters[0] === upper[0]) return rendered[0].toUpperCase() + rendered.slice(1);
  return rendered;
}

function transliterateWord(word: string, table: ScriptTable): string {
  let out = "";
  for (let index = 0; index < word.length; index += 1) out += renderLetter(table, word, index);
  return applyWordCase(word, out);
}

/**
 * Rewrite Cyrillic to Latin under one language's conventions.
 *
 * Runs of Cyrillic are transcribed and everything else — Latin already in the
 * text, digits, punctuation, spaces — is copied through untouched, so a card
 * like "Метро (metro)" keeps its bracketed gloss.
 */
export function latiniseRussian(text: string, language: ResolvedInterfaceLanguage): string {
  const source = String(text ?? "");
  const table = TABLES[language] ?? EN_TABLE;
  let out = "";
  let word = "";
  for (const char of source) {
    if (isCyrillicLetter(char)) {
      word += char;
      continue;
    }
    if (word) {
      out += transliterateWord(word, table);
      word = "";
    }
    out += char;
  }
  if (word) out += transliterateWord(word, table);
  return out;
}

/**
 * What a Russian card SHOWS.
 *
 * Cyrillic is returned exactly as stored — the stored form is the real one,
 * and this is the only branch that ever needs to be fast. Latin is computed
 * from it under the language the app is being read in, so switching the
 * interface language switches the transcription with it and touches nothing
 * else: progress, grades and reviews all hang off the Cyrillic.
 */
export function formatRussianText(
  text: string,
  script: RussianScript | ResolvedRussianScript,
  interfaceLanguage: ResolvedInterfaceLanguage = resolveInterfaceLanguage()
): string {
  const resolved = script === "auto" ? detectRussianScript() : script;
  if (resolved === "cyrillic") return String(text ?? "");
  return latiniseRussian(text, interfaceLanguage);
}

/**
 * The letters that share a spelling with another letter, per language.
 *
 * Derived from the tables rather than listed, so a table that is corrected
 * corrects this too. German is the loud case: ж and ш are both "sch", so
 * "Schena" read backwards is Жена or Шена and nothing in the Latin says
 * which. That is not a defect to be fixed — it is what the transcription is —
 * so the matcher accepts both readings and the card offers the Cyrillic as a
 * note.
 */
function ambiguousLetters(table: ScriptTable): Set<string> {
  const byRendering = new Map<string, string[]>();
  for (const letter of RUSSIAN_ALPHABET) {
    const rendering = table[letter]?.base;
    if (!rendering) continue;
    byRendering.set(rendering, [...(byRendering.get(rendering) ?? []), letter]);
  }
  const ambiguous = new Set<string>();
  for (const [, letters] of byRendering) {
    if (letters.length > 1) for (const letter of letters) ambiguous.add(letter);
  }
  return ambiguous;
}

const AMBIGUOUS: Record<ResolvedInterfaceLanguage, Set<string>> = {
  de: ambiguousLetters(DE_TABLE),
  en: ambiguousLetters(EN_TABLE),
  fr: ambiguousLetters(FR_TABLE),
  pl: ambiguousLetters(PL_TABLE),
  es: ambiguousLetters(ES_TABLE),
  pt: ambiguousLetters(EN_TABLE),
};

/** Whether a Cyrillic answer has a Latin form that reads back more than one way. */
export function russianTranscriptionIsAmbiguous(
  targetCyrillic: string,
  language: ResolvedInterfaceLanguage
): boolean {
  const ambiguous = AMBIGUOUS[language] ?? AMBIGUOUS.en;
  return [...String(targetCyrillic ?? "").toLowerCase()].some((char) => ambiguous.has(char));
}

export type RussianMatch = {
  ok: boolean;
  /** Right word, spelled a way this language's transcription does not use. */
  spellingNote: boolean;
  /** Answered in the other alphabet. Accepted; worth saying. */
  scriptNote?: boolean;
  capitalizationError?: boolean;
  /** The Cyrillic behind the answer, to show when the Latin is ambiguous. */
  hint?: string;
  /**
   * Declared so this reads like every other matcher, and never set.
   *
   * Polish and Spanish coach a spare subject pronoun, because the verb ending
   * already says who and leaving it in is not what anyone says. Russian is
   * not that language: "Я живу в Москве" is ordinary Russian, not an
   * over-production, and the pronoun is dropped only where the context has
   * already supplied it. Carrying the Polish rule across would put a note on
   * correct Russian, which is worse than no note at all.
   */
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘ʹʺ]/g;
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…]/g;
const THIN_SPACES = /[    ]/g;

function normalizeRussianInput(text: string): string {
  return String(text ?? "")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The form the tiers below compare.
 *
 * Diacritics go, for the same reason the Polish matcher forgives them: ï, ż
 * and ł are on the keyboard of the person the transcription was written for
 * and on nobody else's, and a learner who typed "zena" for "żena" knew the
 * word. ł is folded by hand — it carries no combining mark, so decomposition
 * walks straight past it, which is the lesson polishTextMatch.ts already
 * learned. Doubled letters collapse so "Choroschó"/"ss" spellings meet.
 */
function foldLatin(text: string): string {
  return normalizeRussianInput(text)
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/(.)\1+/g, "$1");
}

function foldCyrillic(text: string): string {
  return normalizeRussianInput(text).toLowerCase();
}

function hasCyrillic(text: string): boolean {
  return /[Ѐ-ӿ]/.test(String(text ?? ""));
}

/**
 * Grade a typed answer against a Cyrillic card.
 *
 * The learner types whatever alphabet is on screen, and neither choice is
 * penalised: in Latin mode the target is transcribed and compared in Latin,
 * in Cyrillic mode it is compared as stored, and an answer that arrives in
 * the other alphabet is still accepted with a note rather than crossed out.
 *
 * Inside Latin mode the other four transcriptions are accepted too. Somebody
 * who learned "Khorosho" in an English app and switched the interface to
 * German has not forgotten the word, and telling them "Choroscho" is the
 * spelling here is the whole of what went wrong.
 */
export function matchRussianAnswer(
  input: string,
  targetCyrillic: string,
  script: RussianScript | ResolvedRussianScript,
  interfaceLanguage: ResolvedInterfaceLanguage = resolveInterfaceLanguage()
): RussianMatch {
  const resolved = script === "auto" ? detectRussianScript() : script;
  const typed = normalizeRussianInput(input);
  const target = normalizeRussianInput(targetCyrillic);
  if (!typed) return { ok: false, spellingNote: false };

  const hint = russianTranscriptionIsAmbiguous(target, interfaceLanguage) ? target : undefined;

  // Cyrillic, letter for letter, whichever mode is on. The stored form is
  // always a right answer.
  if (typed === target) return { ok: true, spellingNote: false };
  if (hasCyrillic(typed) && foldCyrillic(typed) === foldCyrillic(target)) {
    if (typed.slice(1) === target.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true, hint };
  }

  const active = latiniseRussian(target, interfaceLanguage);
  if (typed === active) return { ok: true, spellingNote: false, scriptNote: resolved === "cyrillic", hint };

  if (foldLatin(typed) === foldLatin(active)) {
    return { ok: true, spellingNote: true, scriptNote: resolved === "cyrillic", hint };
  }

  for (const language of RUSSIAN_SCRIPT_LANGUAGES) {
    if (language === interfaceLanguage) continue;
    if (foldLatin(typed) === foldLatin(latiniseRussian(target, language))) {
      return { ok: true, spellingNote: true, scriptNote: resolved === "cyrillic", hint };
    }
  }

  return { ok: false, spellingNote: false, hint };
}

/**
 * The Cyrillic alphabet, for the character row under the typing prompt.
 *
 * POLISH_SPECIAL_CHARACTERS carries the nine letters a foreign keyboard
 * cannot reach; for Russian that is all thirty-three, so the row is the
 * alphabet itself in its own order — the order a learner is being taught it
 * in, not the Latin one.
 */
export const RUSSIAN_SPECIAL_CHARACTERS = [
  ...[...RUSSIAN_ALPHABET],
  ...[...RUSSIAN_ALPHABET.toUpperCase()],
];
