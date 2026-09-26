import { resolveInterfaceLanguage, type ResolvedInterfaceLanguage } from "@/lib/interfaceLanguage";
import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Which alphabet a Greek card is SHOWN in.
 *
 * The same switch the Russian course has, for the same reason: a first lesson
 * in an alphabet nobody has taught you yet is a page of shapes, and the Latin
 * letters carry a beginner until the Greek ones take over. So this mirrors
 * russianScript.ts setting for setting — auto, the native alphabet, Latin, or
 * both at once — and the lesson reads the two through one helper,
 * courseScript.ts, so neither course can drift from the other.
 *
 * It is a file of its own rather than a second table inside russianScript.ts,
 * because the hard part is not the same. Russian letters map to Latin one at a
 * time. Greek spelling does not say what it sounds like letter by letter: ου
 * is one sound, αι is e, μπ is b at the start of a word and mb inside it, and
 * γ is two different sounds depending on the vowel after it. So a Greek word
 * is read into SOUNDS first, and each language then spells those sounds with
 * its own letters.
 *
 * ONLY GREEK IS EVER STORED. The Latin form is computed here, every time, and
 * never written down. Two tables would drift; one cannot.
 */
type GreekScript = "auto" | "greek" | "latin" | "both";
type ResolvedGreekScript = "greek" | "latin" | "both";

const GREEK_SCRIPT_KEY = "greek-script";

/**
 * What "auto" means before the learner has said.
 *
 * A device set to Greek gets Greek: nothing is gained by transcribing an
 * alphabet its owner has read since school. Everyone else starts on the Latin
 * letters, as the Russian course does, and the Greek is one tap away on the
 * typing prompt and in the course picker.
 */
function detectGreekScript(): ResolvedGreekScript {
  if (typeof navigator === "undefined") return "latin";
  const languages = [navigator.language, ...(navigator.languages ?? [])]
    .filter(Boolean)
    .map((language) => language.toLowerCase().split(/[-_]/)[0]);
  return languages.includes("el") ? "greek" : "latin";
}

export function getGreekScript(profile?: UserProfile | null): GreekScript {
  return loadScopedJson<GreekScript>(GREEK_SCRIPT_KEY, "auto", profile);
}

/**
 * Announced, so a change lands on the screen you are looking at. The badge on
 * the typing prompt switches it mid-lesson, and a setting that needs a
 * restart is not a switch.
 */
export const GREEK_SCRIPT_EVENT = "micheon:greek-script";

export function setGreekScript(value: GreekScript, profile?: UserProfile | null) {
  saveScopedJson(GREEK_SCRIPT_KEY, value, profile);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(GREEK_SCRIPT_EVENT, { detail: value }));
  }
}

export function resolveGreekScript(value: GreekScript): ResolvedGreekScript {
  return value === "auto" ? detectGreekScript() : value;
}

/**
 * The voice always speaks Greek. The script is a reading aid; the sound behind
 * it does not change, and a transcription read aloud by a German voice would
 * teach the wrong sound with total confidence.
 */
export function greekVoiceLang(): "el-GR" {
  return "el-GR";
}

/** Human name for a script, for the badge's tooltip. */
export function greekScriptLabel(script: ResolvedGreekScript): string {
  if (script === "both") return "Greek and Latin";
  return script === "greek" ? "Greek" : "Latin";
}

/**
 * The two latches in the course picker, over the one stored value — the same
 * mapping russianScriptShows and russianScriptAfterToggle make, and for the
 * same reason: the picker asks which latches are down and what a press should
 * store, and never has to know that "both" exists. The last latch down cannot
 * be released, because a card in no alphabet at all is a blank card.
 */
export function greekScriptShows(script: ResolvedGreekScript, which: "greek" | "latin"): boolean {
  return script === "both" || script === which;
}

export function greekScriptAfterToggle(
  script: ResolvedGreekScript,
  which: "greek" | "latin"
): ResolvedGreekScript {
  const other = which === "greek" ? "latin" : "greek";
  if (!greekScriptShows(script, which)) return script === other ? "both" : which;
  return script === "both" ? other : script;
}

/* ------------------------------------------------------------------------ */
/* Reading a Greek word into sounds                                          */
/* ------------------------------------------------------------------------ */

type VowelSound = "a" | "e" | "i" | "o" | "u";

/**
 * The consonant sounds, named by how English phrasebooks write them.
 *
 *   gh  γ before a, o, u or a consonant — the throaty sound of γάλα
 *   y   γ before e or i, and ι opening a word before another vowel — γεια
 *   dh  δ, the soft th of "this"
 *   th  θ, the hard th of "thin"
 *   x   χ, the ch of Bach
 *   b d g        μπ, ντ, γκ where they are a plain b, d, g
 *   mb nd ng     the same inside a word after a vowel, where they carry a nasal
 *   n   γ before χ or ξ, which is a nasal: έλεγχος
 */
type ConsonantSound =
  | "v" | "f" | "gh" | "y" | "dh" | "z" | "th" | "k" | "l" | "m" | "n" | "ks"
  | "p" | "r" | "s" | "t" | "x" | "ps" | "b" | "mb" | "d" | "nd" | "g" | "ng"
  | "ts" | "dz";

type SoundUnit =
  | { kind: "vowel"; sound: VowelSound; stressed: boolean }
  | { kind: "consonant"; sound: ConsonantSound };

type GreekLetter = { base: string; stressed: boolean; diaeresis: boolean };

const VOWEL_LETTERS = "αεηιουω";
const SINGLE_VOWEL: Record<string, VowelSound> = { α: "a", ε: "e", η: "i", ι: "i", ο: "o", υ: "i", ω: "o" };
const VOWEL_PAIRS: Record<string, VowelSound> = { αι: "e", ει: "i", οι: "i", υι: "i", ου: "u" };
const V_PAIRS: Record<string, VowelSound> = { αυ: "a", ευ: "e", ηυ: "i" };
const PLAIN_CONSONANT: Record<string, ConsonantSound> = {
  β: "v", δ: "dh", ζ: "z", θ: "th", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "ks",
  π: "p", ρ: "r", σ: "s", τ: "t", φ: "f", χ: "x", ψ: "ps",
};
/** After αυ, ευ and ηυ the υ is v before these, and f before anything else. */
const VOICED_LETTERS = "βγδζλμνρ";

function isGreekLetter(char: string): boolean {
  return /\p{L}/u.test(char) && /\p{Script=Greek}/u.test(char);
}

const HAS_GREEK_LETTER = /[\u0370-\u03FF\u1F00-\u1FFF]/;

/**
 * Split a word into letters that know their own accent.
 *
 * Decomposed first, so ά arrives as α plus the tonos and ϊ as ι plus the
 * diaeresis — the accent tells the reader where the stress falls, and the
 * diaeresis says two vowels are read apart, and the two jobs are kept apart
 * here as well.
 */
function readLetters(word: string): GreekLetter[] {
  const letters: GreekLetter[] = [];
  for (const char of word.toLowerCase().normalize("NFD")) {
    const last = letters[letters.length - 1];
    if (char === "\u0301" || char === "\u0300" || char === "\u0342") {
      if (last) last.stressed = true;
      continue;
    }
    if (char === "\u0308") {
      if (last) last.diaeresis = true;
      continue;
    }
    if (/[\u0300-\u036F]/.test(char)) continue;
    letters.push({ base: char === "ς" ? "σ" : char, stressed: false, diaeresis: false });
  }
  return letters;
}

function isVowelLetter(letter: GreekLetter | undefined): boolean {
  return Boolean(letter) && VOWEL_LETTERS.includes(letter!.base);
}

/**
 * Whether two vowel letters are read as one.
 *
 * Monotonic spelling puts the accent of a pair on its SECOND letter — αί, ού,
 * εύ — so an accent on the first letter, or a diaeresis on the second, says
 * the two are read apart: τσάι, κορόιδο, προϊόν.
 */
function formsPair(first: GreekLetter | undefined, second: GreekLetter | undefined): boolean {
  if (!first || !second || first.stressed || second.diaeresis) return false;
  const pair = first.base + second.base;
  return pair in VOWEL_PAIRS || pair in V_PAIRS;
}

/** The vowel sound a vowel starting at this letter makes, and whether it carries the stress. */
function vowelAt(letters: GreekLetter[], index: number): { sound: VowelSound; stressed: boolean } | null {
  const letter = letters[index];
  if (!isVowelLetter(letter)) return null;
  const next = letters[index + 1];
  if (formsPair(letter, next)) {
    const pair = letter.base + next.base;
    return { sound: VOWEL_PAIRS[pair] ?? V_PAIRS[pair], stressed: next.stressed };
  }
  return { sound: SINGLE_VOWEL[letter.base], stressed: letter.stressed };
}

function isFrontVowel(sound: VowelSound | undefined): boolean {
  return sound === "e" || sound === "i";
}

/**
 * μπ, ντ and γκ carry their nasal only inside a word, after a vowel: μπύρα is
 * bira and ντομάτα domata, but λάμπα is lamba and πέντε pende.
 */
function nasalHere(units: SoundUnit[], letters: GreekLetter[], after: number): boolean {
  const previous = units[units.length - 1];
  return previous?.kind === "vowel" && after < letters.length;
}

function readSounds(word: string): SoundUnit[] {
  const letters = readLetters(word);
  const units: SoundUnit[] = [];
  let index = 0;
  while (index < letters.length) {
    const letter = letters[index];
    const next = letters[index + 1];

    if (isVowelLetter(letter)) {
      const pair = next ? letter.base + next.base : "";
      if (formsPair(letter, next) && pair in V_PAIRS) {
        // αυ, ευ, ηυ: a vowel and then v or f, voiced before a vowel or a
        // voiced consonant — αύριο is avrio, ευχαριστώ is efcharisto.
        const after = letters[index + 2];
        const voiced = Boolean(after) && (isVowelLetter(after) || VOICED_LETTERS.includes(after.base));
        units.push({ kind: "vowel", sound: V_PAIRS[pair], stressed: next.stressed });
        units.push({ kind: "consonant", sound: voiced ? "v" : "f" });
        index += 2;
        continue;
      }
      if (formsPair(letter, next)) {
        units.push({ kind: "vowel", sound: VOWEL_PAIRS[pair], stressed: next.stressed });
        index += 2;
        continue;
      }
      // An unstressed ι opening a word before an unstressed vowel is a glide,
      // not a syllable: ιατρός is yatros, Ιωάννινα Yoannina. Before a
      // stressed vowel it keeps its own syllable — Ιούνιος, ιός.
      if (index === 0 && letter.base === "ι" && !letter.stressed && isVowelLetter(next)) {
        const following = vowelAt(letters, 1);
        if (following && !following.stressed) {
          units.push({ kind: "consonant", sound: "y" });
          index += 1;
          continue;
        }
      }
      units.push({ kind: "vowel", sound: SINGLE_VOWEL[letter.base], stressed: letter.stressed });
      index += 1;
      continue;
    }

    if (letter.base === "μ" && next?.base === "π") {
      units.push({ kind: "consonant", sound: nasalHere(units, letters, index + 2) ? "mb" : "b" });
      index += 2;
      continue;
    }
    if (letter.base === "ν" && next?.base === "τ") {
      units.push({ kind: "consonant", sound: nasalHere(units, letters, index + 2) ? "nd" : "d" });
      index += 2;
      continue;
    }
    if (letter.base === "τ" && next?.base === "σ") {
      units.push({ kind: "consonant", sound: "ts" });
      index += 2;
      continue;
    }
    if (letter.base === "τ" && next?.base === "ζ") {
      units.push({ kind: "consonant", sound: "dz" });
      index += 2;
      continue;
    }
    if (letter.base === "γ") {
      if (next?.base === "κ") {
        units.push({ kind: "consonant", sound: nasalHere(units, letters, index + 2) ? "ng" : "g" });
        index += 2;
        continue;
      }
      // γγ before ν is one γ, not a nasal: συγγνώμη is sighnomi, never
      // singnomi. The second γ is read as the plain γ before a consonant.
      if (next?.base === "γ" && letters[index + 2]?.base === "ν") {
        index += 1;
        continue;
      }
      if (next?.base === "γ") {
        units.push({ kind: "consonant", sound: "ng" });
        index += 2;
        continue;
      }
      if (next?.base === "χ" || next?.base === "ξ") {
        units.push({ kind: "consonant", sound: "n" });
        index += 1;
        continue;
      }
      const vowel = vowelAt(letters, index + 1);
      if (vowel && isFrontVowel(vowel.sound)) {
        units.push({ kind: "consonant", sound: "y" });
        // γι and γει before another vowel are one sound, not two: γεια is
        // ya, γιατί yati, Γιώργος Yorgos. The ι only survives when it is
        // stressed and so a syllable of its own — Αγία, υγεία.
        const afterI = letters[index + 2];
        if (next.base === "ι" && !next.stressed && isVowelLetter(afterI)) {
          index += 2;
          continue;
        }
        if (next.base === "ε" && afterI?.base === "ι" && formsPair(next, afterI)
          && !afterI.stressed && isVowelLetter(letters[index + 3])) {
          index += 3;
          continue;
        }
        index += 1;
        continue;
      }
      units.push({ kind: "consonant", sound: "gh" });
      index += 1;
      continue;
    }

    const plain = PLAIN_CONSONANT[letter.base];
    if (plain) units.push({ kind: "consonant", sound: plain });
    index += 1;
  }
  return units;
}

/* ------------------------------------------------------------------------ */
/* Spelling the sounds, one language at a time                               */
/* ------------------------------------------------------------------------ */

/**
 * How one language writes the sounds above.
 *
 * Every transcription here is PHONETIC — what a reader of that language says
 * when they read it aloud with their own letter values — rather than ELOT's
 * letter-for-letter scheme. Kalimera, not Kalēmera; ya sou, not geia sou.
 * The learner's job with these letters is to say the word, and a scheme that
 * is right about the spelling and wrong about the sound teaches the wrong one.
 *
 * Stress is marked with an acute wherever the language's readers are used to
 * seeing it — Greek stress moves and changes meaning, and the tonos is the
 * only thing that says where it falls. The grader ignores the accents: they
 * are there to be read, and nobody is asked to type them.
 */
type Spelling = {
  v: string;
  gh: string;
  y: string;
  dh: string;
  z: string;
  th: string;
  ks: string;
  dz: string;
  x: string;
  u: string;
  stress: boolean;
  /** σ between vowels doubled, where a single s would read as z. */
  ssBetweenVowels?: boolean;
  /** Doubled consonants written once, where two would say something else. */
  singleDoubles?: boolean;
  /** How g stays hard before e and i. */
  hardG?: string;
  /** k, ch and g take an i before an e sound — Polish Kierkira, Chieronia, Angielos. */
  palatalBeforeE?: boolean;
  /** χ after σ, where s plus the plain spelling would make a sound of its own. */
  xAfterS?: string;
  /** An unstressed i read apart from the vowel before it. */
  iAfterVowel?: string;
  /** A stressed i before another vowel, which Polish writes with a j: Paralija. */
  stressedIBeforeVowel?: string;
};

/**
 * GERMAN — the German Wikivoyage phrasebook's letters: w for β, j for γ
 * before e and i, gh and dh for the two sounds German has no letter for, ch
 * for χ, which German already reads both ways Greek says it (Bach and ich).
 *
 * ss between vowels as the Russian table has it, because German reads a lone
 * s there as z. And σχ is written s-ch: "sch" is one sound in German, and
 * σχολείο read as "Scholio" starts with the wrong one.
 */
const DE: Spelling = {
  v: "w", gh: "gh", y: "j", dh: "dh", z: "s", th: "th", ks: "x", dz: "ds", x: "ch", u: "u",
  stress: true, ssBetweenVowels: true, xAfterS: "-ch",
};

/**
 * ENGLISH — the letters English phrasebooks use: gh, dh and th for γ, δ and θ,
 * y for the γ of γεια, h for χ, and ou for ου as in ya sou. χ after σ is kh,
 * because "sh" would be read as one sound.
 */
const EN: Spelling = {
  v: "v", gh: "gh", y: "y", dh: "dh", z: "z", th: "th", ks: "ks", dz: "dz", x: "h", u: "ou",
  stress: true, xAfterS: "kh",
};

/**
 * FRENCH — ou for ου and kh for χ, as French writes Greek sounds; ss between
 * vowels because French reads a lone s there as z; gu for a hard g before e
 * and i, and ï for an i read apart from the vowel before it, both French
 * spelling's own devices. γ is gh, because a French reader takes "gn" for the
 * sound of agneau, and γνώμη is not that.
 */
const FR: Spelling = {
  v: "v", gh: "gh", y: "y", dh: "d", z: "z", th: "th", ks: "ks", dz: "dz", x: "kh", u: "ou",
  stress: true, ssBetweenVowels: true, hardG: "gu", iAfterVowel: "ï",
};

/**
 * SPANISH — j for χ, which is exactly the Spanish sound (efjaristó); g and d
 * for γ and δ, which Spanish already softens between vowels the way Greek
 * does; gu for a hard g before e and i. Doubled letters are written once,
 * because Spanish ll and rr are sounds of their own and Greek λλ is not.
 */
const ES: Spelling = {
  v: "v", gh: "g", y: "y", dh: "d", z: "z", th: "th", ks: "ks", dz: "dz", x: "j", u: "u",
  stress: true, singleDoubles: true, hardG: "gu",
};

/**
 * ITALIAN — ch for χ (efcharistó), j for the γ of γεια, x for ξ. γ is gh, for
 * the reason French needs it and one more: Italian reads "gn" as in gnocchi
 * and "gli" as in figli, and γνωρίζω and γλυκό are neither.
 */
const IT: Spelling = {
  v: "v", gh: "gh", y: "j", dh: "d", z: "z", th: "th", ks: "x", dz: "dz", x: "ch", u: "u",
  stress: true, hardG: "gh",
};

/**
 * POLISH — the official transcription, as the Commission on Standardisation
 * of Geographical Names (KSNG) lays it down for Greek: w for β, t for θ, ch
 * for χ, j for γ before e and i, ki, chi and gi before an e sound, ij for a
 * stressed i before a vowel, doubled letters written once, and no accents.
 * Its own examples — Kierkira, Chieronia, Joanina, Ajo Oros, Paralija — are
 * held against this table in check-greek-script.cjs.
 */
const PL: Spelling = {
  v: "w", gh: "g", y: "j", dh: "d", z: "z", th: "t", ks: "ks", dz: "dz", x: "ch", u: "u",
  stress: false, singleDoubles: true, palatalBeforeE: true, stressedIBeforeVowel: "ij",
};

/**
 * Which spelling each interface language reads.
 *
 * Portuguese has no Greek transcription of its own here yet and reads the
 * English one — a stopgap, as in russianScript.ts, and not a claim about
 * Portuguese practice. Russian reads it too: a Russian reader who wants the
 * Latin letters is best served by the most widely printed ones.
 *
 * Greek reads it as well, and for the plainest reason of all: somebody with
 * the app in Greek is not reaching for Latin letters to read Greek with. The
 * setting still exists for them, so the row has to answer something, and the
 * most widely printed spelling is the answer that claims least.
 */
const SPELLINGS: Record<ResolvedInterfaceLanguage, Spelling> = {
  de: DE,
  en: EN,
  fr: FR,
  pl: PL,
  es: ES,
  it: IT,
  pt: EN,
  ru: EN,
  el: EN,
};

/** The six transcriptions, named — for the grader and the build gate. */
const GREEK_SCRIPT_LANGUAGES: ReadonlyArray<ResolvedInterfaceLanguage> = ["de", "en", "fr", "pl", "es", "it"];

const ACUTE: Record<string, string> = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };

function stressed(text: string): string {
  const at = Math.max(...[...text].map((char, index) => (char in ACUTE ? index : -1)));
  if (at < 0) return text;
  return text.slice(0, at) + ACUTE[text[at]] + text.slice(at + 1);
}

function spellVowel(
  unit: Extract<SoundUnit, { kind: "vowel" }>,
  previous: SoundUnit | undefined,
  next: SoundUnit | undefined,
  spelling: Spelling
): string {
  let text: string = unit.sound === "u" ? spelling.u : unit.sound;
  if (
    spelling.stressedIBeforeVowel && unit.sound === "i" && unit.stressed && next?.kind === "vowel"
    && !(previous?.kind === "consonant" && previous.sound === "y")
  ) return spelling.stressedIBeforeVowel;
  if (spelling.iAfterVowel && unit.sound === "i" && !unit.stressed && previous?.kind === "vowel") {
    text = spelling.iAfterVowel;
  }
  return spelling.stress && unit.stressed ? stressed(text) : text;
}

function spellConsonant(
  unit: Extract<SoundUnit, { kind: "consonant" }>,
  previous: SoundUnit | undefined,
  next: SoundUnit | undefined,
  spelling: Spelling
): string {
  const nextVowel = next?.kind === "vowel" ? next.sound : undefined;
  const beforeE = nextVowel === "e";
  const palatal = spelling.palatalBeforeE && beforeE ? "i" : "";
  switch (unit.sound) {
    case "v": return spelling.v;
    case "gh": return spelling.gh;
    case "y": return spelling.y;
    case "dh": return spelling.dh;
    case "z": return spelling.z;
    case "th": return spelling.th;
    case "ks": return spelling.ks;
    case "dz": return spelling.dz;
    case "k": return "k" + palatal;
    case "x":
      if (spelling.xAfterS && previous?.kind === "consonant" && previous.sound === "s") return spelling.xAfterS;
      return spelling.x + palatal;
    case "g":
    case "ng": {
      const nasal = unit.sound === "ng" ? "n" : "";
      if (palatal) return nasal + "g" + palatal;
      if (spelling.hardG && isFrontVowel(nextVowel)) return nasal + spelling.hardG;
      return nasal + "g";
    }
    case "s":
      return spelling.ssBetweenVowels && previous?.kind === "vowel" && next?.kind === "vowel" ? "ss" : "s";
    default:
      return unit.sound;
  }
}

/**
 * Put the capitals back — on the finished word, as russianScript.ts does, so a
 * capital is never lost to a letter that spells as two.
 */
function applyWordCase(source: string, rendered: string): string {
  if (!rendered) return rendered;
  const letters = [...source].filter(isGreekLetter);
  if (!letters.length) return rendered;
  const upper = letters.filter((char) => char === char.toUpperCase() && char !== char.toLowerCase());
  if (letters.length > 1 && upper.length === letters.length) return rendered.toUpperCase();
  if (upper.length && letters[0] === upper[0]) return rendered[0].toUpperCase() + rendered.slice(1);
  return rendered;
}

function transliterateWord(word: string, spelling: Spelling): string {
  const units = readSounds(word);
  let out = "";
  units.forEach((unit, index) => {
    const previous = units[index - 1];
    const next = units[index + 1];
    if (
      spelling.singleDoubles && unit.kind === "consonant"
      && previous?.kind === "consonant" && previous.sound === unit.sound
    ) return;
    out += unit.kind === "vowel"
      ? spellVowel(unit, previous, next, spelling)
      : spellConsonant(unit, previous, next, spelling);
  });
  return applyWordCase(word, out);
}

/**
 * Rewrite Greek to Latin under one language's conventions.
 *
 * Runs of Greek letters are transcribed and everything else — Latin already in
 * the text, digits, spaces — is copied through, so "η κάρτα SIM" keeps its SIM.
 * The two marks Greek punctuates differently are put back into Latin use: the
 * Greek question mark is a semicolon, and the raised dot is its semicolon.
 */
export function latiniseGreek(text: string, language: ResolvedInterfaceLanguage): string {
  const source = String(text ?? "").normalize("NFC");
  if (!HAS_GREEK_LETTER.test(source)) return source;
  const spelling = SPELLINGS[language] ?? EN;
  let out = "";
  let word = "";
  for (const char of source) {
    if (isGreekLetter(char)) {
      word += char;
      continue;
    }
    if (word) {
      out += transliterateWord(word, spelling);
      word = "";
    }
    out += char === ";" || char === "\u037E" ? "?" : char === "\u0387" || char === "\u00B7" ? ";" : char;
  }
  if (word) out += transliterateWord(word, spelling);
  return out;
}

/**
 * What a Greek card SHOWS.
 *
 * Greek is returned exactly as stored, and it is the only branch that ever
 * needs to be fast. Latin is computed from it under the language the app is
 * being read in, so switching the interface language switches the
 * transcription with it and touches nothing else: progress, grades and reviews
 * all hang off the Greek.
 */
export function formatGreekText(
  text: string,
  script: GreekScript | ResolvedGreekScript,
  interfaceLanguage: ResolvedInterfaceLanguage = resolveInterfaceLanguage()
): string {
  const resolved = script === "auto" ? detectGreekScript() : script;
  if (resolved === "greek" || resolved === "both") return String(text ?? "");
  return latiniseGreek(text, interfaceLanguage);
}

/**
 * The quieter line underneath on the both setting, or nothing — the whole
 * phrase transcribed at once, for the reason russianSecondLine gives: the
 * line above is split into words that can be tapped, and a Latin word
 * threaded under every Greek one would double the line rather than caption it.
 */
export function greekSecondLine(
  text: string,
  script: GreekScript | ResolvedGreekScript,
  interfaceLanguage: ResolvedInterfaceLanguage = resolveInterfaceLanguage()
): string | null {
  const resolved = script === "auto" ? detectGreekScript() : script;
  if (resolved !== "both") return null;
  const latin = latiniseGreek(text, interfaceLanguage);
  return latin === String(text ?? "").normalize("NFC") ? null : latin;
}

/* ------------------------------------------------------------------------ */
/* Grading an answer typed in Latin letters                                  */
/* ------------------------------------------------------------------------ */

/**
 * The form two transcriptions are compared in.
 *
 * Accents go, because they are a reading aid — the stress is in the Greek, and
 * a learner who read kaliméra and typed kalimera read it right. ï goes with
 * them, which is French for i. Apostrophes and hyphens go, so s-ch and sch
 * meet, and so does Wi-Fi typed as WiFi. Case is kept, for the caller to
 * decide what a capital is worth.
 */
function foldTranscription(text: string): string {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’ʼ'`´‘‐‑-]/g, "")
    .replace(/[.!?,;:"()[\]{}“”„«»…\u00B7–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looseTranscription(text: string): string {
  return foldTranscription(text).toLowerCase().replace(/(.)\1+/g, "$1");
}

type GreekTranscriptionMatch = { ok: boolean; spellingNote: boolean };

/**
 * Grade a Latin answer against a Greek card, or answer null when it is not a
 * transcription of it at all and the Greeklish walk in greekTextMatch.ts
 * should have its turn.
 *
 * WHILE THE LATIN IS ON SCREEN, the transcription on screen is a right answer
 * with nothing to say about it — including without its accents, and with a
 * small letter where the line opens. That is what makes the lesson go on by
 * itself once the answer is typed, as it does for every other course.
 *
 * WHILE ONLY GREEK IS ON SCREEN, the same letters are still the word, and pass
 * as they always did: with a note, because the lesson asked for Greek.
 *
 * WHAT IS A SLIP rather than a mistake, in either setting: a capital letter
 * inside the line, a doubled letter written once or a single one doubled, and
 * another language's transcription — somebody who learned efharistó in an
 * English app and switched the interface to German has not forgotten the word.
 */
export function matchGreekTranscription(
  input: string,
  targetGreek: string,
  script: GreekScript | ResolvedGreekScript,
  interfaceLanguage: ResolvedInterfaceLanguage = resolveInterfaceLanguage()
): GreekTranscriptionMatch | null {
  const typed = foldTranscription(input);
  if (!typed) return null;
  const resolved = script === "auto" ? detectGreekScript() : script;
  const readingLatin = resolved !== "greek";
  const active = foldTranscription(latiniseGreek(targetGreek, interfaceLanguage));

  const sameOpening = typed.slice(0, 1).toLowerCase() === active.slice(0, 1).toLowerCase();
  if (typed === active || (sameOpening && typed.slice(1) === active.slice(1))) {
    return { ok: true, spellingNote: !readingLatin };
  }
  const loose = looseTranscription(typed);
  if (loose === looseTranscription(active)) return { ok: true, spellingNote: true };
  for (const language of GREEK_SCRIPT_LANGUAGES) {
    if (language === interfaceLanguage) continue;
    if (loose === looseTranscription(latiniseGreek(targetGreek, language))) {
      return { ok: true, spellingNote: true };
    }
  }
  return null;
}
