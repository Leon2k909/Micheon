import { normalizeEnglishSpelling } from "@/lib/englishVariant";

/**
 * Answer keys sometimes offer alternatives ("I like going to the cinema. / I
 * like going to the movies."). The UI shows only the FIRST (most common) one —
 * matching still accepts every alternative behind the scenes.
 */
export function primaryAnswer(s: string): string {
  return String(s ?? "").split(" / ")[0].trim();
}

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
    .replace(/\bists\b/g, "ist es")
    .replace(/\bgerne\b/g, "gern");
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
    .replace(/\bists\b/g, "ist es")
    .replace(/\bgerne\b/g, "gern");
}

export function matchGermanPhrase(input: string, target: string): { ok: boolean; spellingNote: boolean; capitalizationError?: boolean; phrasingNote?: boolean } {
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

// ─── German-side synonyms & coaching ────────────────────────────────────────
// The same philosophy as the English tiers, for typed GERMAN answers: genuinely
// interchangeable German passes silently; a literal English-transfer phrasing
// ("Ich bin kalt" for "Mir ist kalt") is rejected with a phrasingNote so the
// UI coaches instead of red-Xing. These run on normalizeGermanInput output
// (lowercase, punctuation stripped, umlauts INTACT), so patterns carry ö/oe
// alternates; lenient umlaut folding is applied after.
// NOTE: these live in matchGermanSentence, NOT matchGermanPhrase — the latter
// doubles as the raw comparator inside the English tiers, where German folds
// must never run.
const GERMAN_SYNONYMS: [RegExp, string][] = [
  // möchte (polite) and wollen both say "want" — person kept per pair
  [/\bm(?:ö|oe)chte\b/g, "will"],
  [/\bm(?:ö|oe)chtest\b/g, "willst"],
  [/\bm(?:ö|oe)chten\b/g, "wollen"],
  [/\b(super|prima|spitze|mega)\b/g, "toll"],
  [/\b(tschau|ciao)\b/g, "tschüss"],
  [/\b(hi|hey)\b/g, "hallo"],
  [/\bsorry\b/g, "entschuldigung"],       // Sorry is everyday German
  [/\bentschuldige\b/g, "entschuldigung"],
  // Cross-gender noun pairs fold WITH their article so each side stays
  // grammatical German ("das Klo" == "die Toilette", never "das Toilette").
  [/\bdas klo\b/g, "die toilette"],
  [/\bdem klo\b/g, "der toilette"],
  [/\bein klo\b/g, "eine toilette"],
  [/\baufs klo\b/g, "auf die toilette"],   // "Ich muss aufs Klo"
  [/\b(?:der|den) wagen\b/g, "das auto"],
  [/\bdem wagen\b/g, "dem auto"],
  [/\beinen wagen\b/g, "ein auto"],
  [/\bk(?:ö|oe)stlich\b/g, "lecker"],
  [/\bdefekt\b/g, "kaputt"],
  [/\bdoktor\b/g, "arzt"],
  [/\beventuell\b/g, "vielleicht"],
  [/\brasch\b/g, "schnell"],
  // ── Verified loanword/sibling pairs (adversarially checked against data.ts) ──
  [/\bklub\b/g, "verein"],                     // Traditionsklub — same gender
  [/\bschiri\b/g, "schiedsrichter"],           // everyone says Schiri
  [/\bgym\b/g, "fitnessstudio"],               // exact token only — never touches Gymnasium
  [/\bprotein\b/g, "eiweiß"],
  [/\brunterladen\b/g, "herunterladen"],
  [/\brunter\b/g, "herunter"],                 // colloquial adverb, same meaning
  [/\bsettings\b/g, "einstellungen"],
  [/\bcheaten\b/g, "schummeln"], [/\bcheatet\b/g, "schummelt"], [/\bgecheatet\b/g, "geschummelt"],
  [/\bwishlist\b/g, "wunschliste"],
  [/\bcontent\b/g, "inhalt"],
  // das Update / die Aktualisierung — cross-gender, article-paired first
  [/\bdas update\b/g, "die aktualisierung"],
  [/\bdem update\b/g, "der aktualisierung"],
  [/\bupdates\b/g, "aktualisierungen"], [/\bupdate\b/g, "aktualisierung"],
  [/\bcrush\b/g, "schwarm"],                   // der Crush = der Schwarm
  // das Tattoo / die Tätowierung — cross-gender
  [/\bdas tattoo\b/g, "die tätowierung"],
  [/\btattoos\b/g, "tätowierungen"], [/\btattoo\b/g, "tätowierung"],
  [/\bpennen\b/g, "schlafen"], [/\bpennt\b/g, "schläft"], [/\bpenne\b/g, "schlafe"], [/\bgepennt\b/g, "geschlafen"],
  [/\bsmartphone\b/g, "handy"],
  [/\bgigs\b/g, "auftritte"], [/\bgig\b/g, "auftritt"],
  [/\btannenbaum\b/g, "weihnachtsbaum"],
  [/\bkassenbon\b/g, "bon"],
  [/\bim angebot\b/g, "reduziert"],
  [/\bbewerbungsgespr(?:ä|ae)ch\b/g, "vorstellungsgespräch"],
  // kriegen == bekommen (colloquial "get") — person/tense kept per pair
  [/\bkriege\b/g, "bekomme"], [/\bkriegst\b/g, "bekommst"], [/\bkriegt\b/g, "bekommt"],
  [/\bkriegen\b/g, "bekommen"], [/\bgekriegt\b/g, "bekommen"],
];

// Classic English→German literal transfers: understandable, but not German.
const GERMAN_NEAR_MISS: [RegExp, string][] = [
  // "I am cold/warm/hot/bored" — German uses the dative: "Mir ist kalt"
  [/\bich bin (kalt|warm|hei(?:ß|ss)|langweilig)\b/g, "mir ist $1"],
  // "I'm good/bad" as a state — German asks how it GOES: "Mir geht es gut"
  [/\bich bin gut\b/g, "mir geht es gut"],
  [/\bich bin schlecht\b/g, "mir geht es schlecht"],
];

const applyFolds = (t: string, folds: [RegExp, string][]) => {
  let s = t;
  for (const [re, sub] of folds) s = s.replace(re, sub);
  return s;
};

/**
 * Full German answer check: strict tiers first (via matchGermanPhrase), then
 * interchangeable-German synonyms (silent accept), then English-transfer
 * literals (rejected with phrasingNote so the UI coaches kindly).
 * Use THIS for German answers; matchGermanPhrase stays the raw comparator.
 */
export function matchGermanSentence(input: string, target: string): { ok: boolean; spellingNote: boolean; capitalizationError?: boolean; phrasingNote?: boolean } {
  const base = matchGermanPhrase(input, target);
  if (base.ok || base.capitalizationError) return base;
  const syn = (s: string) =>
    normalizeGermanLenient(applyFolds(normalizeGermanInput(s), GERMAN_SYNONYMS));
  const synInput = syn(input);
  const synTarget = syn(target);
  if (synInput === synTarget) return { ok: true, spellingNote: false };
  const near = (s: string) => normalizeGermanLenient(applyFolds(applyFolds(normalizeGermanInput(s), GERMAN_SYNONYMS), GERMAN_NEAR_MISS));
  if (near(input) === near(target)) return { ok: false, spellingNote: false, phrasingNote: true };
  return base;
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
  // Only real auxiliary stems — a generic (\w+)nt would mangle ordinary words
  // ending in "nt" ("want" -> "wa not", "went" -> "we not", "moment"…).
  [/\b(do|does|did|is|are|was|were|has|have|had|would|should|could|must|need|ought)n[’'`´]?t\b/gi, "$1 not"],
  [/\bain[’'`´]?t\b/gi, "is not"],
  [/\bi[’'`´]?m\b/gi, "i am"],
  [/\b(\w+)[’'`´]re\b/gi, "$1 are"],             // you're, we're, they're
  [/\b(you|they)re\b/gi, "$1 are"],              // youre, theyre (avoiding 'were' conflict)
  [/\b(\w+)[’'`´]ve\b/gi, "$1 have"],            // I've, you've...
  [/\b(i|you|we|they)ve\b/gi, "$1 have"],        // ive, youve, weve, theyve
  [/\b(\w+)[’'`´]ll\b/gi, "$1 will"],
  // "ill" is only "i will" when a verb follows — otherwise it's the adjective (sick).
  [/\bill\b(?=\s+(be|go|come|see|do|get|have|take|make|try|call|text|send|tell|let|meet|ask|pay|wait|check|bring|pick|start|stop|talk|speak|write|help|show|give|grab|join|drive|walk|stay|leave|book|order)\b)/gi, "i will"],
  [/\b(you|he|she|it|they)ll\b/gi, "$1 will"], // youll, hell... (avoiding 'well' conflict)
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
    // ── Vetted similar-phrase folds (adversarially checked against data.ts) ──
    .replace(/\btonight\b/g, "this evening")
    .replace(/\b(on|over) the weekend\b/g, "at the weekend")
    .replace(/\bthis weekend\b/g, "at the weekend")
    .replace(/\bquarter after\b/g, "quarter past")
    .replace(/\bhalf (one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/g, "half past $1")
    .replace(/\bclosest\b/g, "nearest")
    .replace(/\b(stay|stays|stayed|staying) at home\b/g, "$1 home")
    .replace(/\ba couple of\b/g, "a few")
    .replace(/\bkilogram(s)?\b/g, "kilo$1")
    .replace(/\bin total\b/g, "altogether")
    .replace(/\bdepart(s)?\b/g, "leave$1")
    .replace(/\bfill(s|ed|ing)? (in|out) \b/g, "fill$1 in ")
    .replace(/\b(cash register|cash desk)\b/g, "checkout")
    .replace(/\bcarry[- ]on (luggage|baggage|bag|bags)\b/g, "hand luggage")
    .replace(/\bon sale\b/g, "on offer")
    .replace(/\bbattery is (almost |nearly )?(flat|empty)\b/g, "battery is $1dead")
    .replace(/\bno worries\b/g, "no problem")
    .replace(/\bpardon( me)?\b/g, "excuse me")
    .replace(/\bloan\b/g, "lend")
    .replace(/\b(cash machine|cashpoint|cash point)\b/g, "atm")
    .replace(/\btake (out money|money out)\b/g, "withdraw money")
    .replace(/\bmy treat\b/g, "on me")
    .replace(/\bmore slowly\b/g, "slower")
    .replace(/\bmore quickly\b/g, "faster")
    .replace(/\b(sadly|regrettably)\b/g, "unfortunately")
    .replace(/\bi am afraid (i|we|that|it)\b/g, "unfortunately $1")
    .replace(/\blook out\b/g, "watch out")
    .replace(/\b(hang|hold) on\b/g, "wait")
    .replace(/\b(am|is|are) (almost |nearly )?finished\b/g, "$1 $2done")
    .replace(/\bhappy christmas\b/g, "merry christmas")
    .replace(/\bright (around|about) the corner\b/g, "just $1 the corner")
    .replace(/\bkinda\b/g, "kind of")
    .replace(/\bsorta\b/g, "sort of")
    .replace(/\bgimme\b/g, "give me")
    .replace(/\blemme\b/g, "let me")
    .replace(/\boutta\b/g, "out of")
    .replace(/\bc'?mon\b/g, "come on")
    .replace(/\b(thanks (?:quite )?a lot|thanks so much|many thanks)\b/g, "thanks very much")
    .replace(/\bhow are you doing\b/g, "how are you")
    .replace(/\bhow is it going\b/g, "how are you")
    .replace(/\bi am called\b/g, "my name is")
    .replace(/\bi come from\b/g, "i am from")
    .replace(/\b(he|she|it) comes from\b/g, "$1 is from")
    .replace(/\b(you|we|they) come from\b/g, "$1 are from")
    .replace(/\b(tv|telly)\b/g, "television")
    .replace(/\bcab\b/g, "taxi")
    .replace(/\bpic\b/g, "photo")
    .replace(/\bpics\b/g, "photos")
    .replace(/\bbeverage\b/g, "drink")
    .replace(/\b(supper|evening meal)\b/g, "dinner")
    .replace(/\bphysician\b/g, "doctor")
    .replace(/\bunwell\b/g, "sick")
    .replace(/\b(medication|meds)\b/g, "medicine")
    .replace(/\bparking lot\b/g, "car park")
    .replace(/\bcentral station\b/g, "main station")
    .replace(/\bsleepy\b/g, "tired")
    .replace(/\bbrothers and sisters\b/g, "siblings")
    .replace(/\b1st\b/g, "first")
    .replace(/\b2nd\b/g, "second")
    .replace(/\b3rd\b/g, "third")
    .replace(/\bmister\b/g, "mr")
    .replace(/\bsettee\b/g, "sofa")
    .replace(/\breply\b/g, "answer")
    .replace(/\btalking\b/g, "speaking")
    .replace(/\bquick\b/g, "fast")
    .replace(/\bhow much does ((?:\w+ ){0,2}\w+) cost\b/g, "how much is $1")
    .replace(/\bairplane\b/g, "plane")
    .replace(/\bcongrats\b/g, "congratulations")
    .replace(/\bmaths\b/g, "math")
    .replace(/\b(burn|learn|dream|spell|smell|spoil)t\b/g, "$1ed")
    .replace(/\bwhilst\b/g, "while")
    .replace(/\bo'?clock\b/g, "")
    .replace(/\b(?:excuse me|pardon me|pardon|my apologies|apologies)\b/g, "sorry")
    .replace(/\bwhat are you called\b/g, "what is your name")
    .replace(/\binsane\b/g, "crazy")
    .replace(/\bstunning\b/g, "beautiful")
    .replace(/\btill?\b/g, "until")
    .replace(/\b(everything|everyone|everybody|nothing)'?s\b/g, "$1 is")
    .replace(/\bmatch\b/g, "game")
    .replace(/\bnil\b/g, "zero")
    .replace(/\bgo+a+l\b/g, "goal")
    .replace(/\bworkout\b/g, "training")
    .replace(/\boh,? my (?:god|gosh|goodness)\b/g, "omg")
    .replace(/\bbank holiday\b/g, "public holiday")
    .replace(/\bat the weekend\b/g, "on the weekend")
    .replace(/\b(?:ring|phone) (me|you|him|her|us|them)\b/g, "call $1")
    .replace(/\b(?:total|complete|utter|absolute) (?:rubbish|trash|garbage|crap|nonsense)\b/g, "total nonsense")
    .replace(/\b(drives?|driving) (me|you|him|her|us|them) mad\b/g, "$1 $2 crazy")
    .replace(/\bslower\b/g, "more slow")
    .replace(/\bstudy(ing)?\b/g, "learn$1")
    .replace(/\bwhat is (?:going on|happening)\b/g, "what is up")
    .replace(/\bwc\b/g, "toilet")
    // ── end vetted folds ──
    
    // Polite request / question equivalents
    .replace(/\bcould\b/g, "can")
    
    // Common vocabulary synonyms
    .replace(/\b(pretty good|quite well)\b/g, "pretty well")
    .replace(/\b(quite a lot|a lot|pretty much|lots|plenty)\b/g, "quite a lot")
    .replace(/\b(lots of|a lot of)\b/g, "quite a lot")
    .replace(/\bjust\b/g, "only")
    .replace(/\b(hi|hey)\b/g, "hello")
    .replace(/\byeah\b/g, "yes")
    .replace(/\b(bye|goodbye)\b/g, "bye")
    .replace(/\b(begin|commence)\b/g, "start")
    .replace(/\b(shut|lock)\b/g, "close")
    .replace(/\b(purchase|obtain)\b/g, "buy")
    .replace(/\b(receive|acquire)\b/g, "get")
    .replace(/\btalk\b/g, "speak")
    .replace(/\b(difficult|tough)\b/g, "hard")
    .replace(/\bsimple\b/g, "easy")
    .replace(/\bcorrect\b/g, "right")
    .replace(/\b(incorrect|false)\b/g, "wrong")
    .replace(/\bill\b/g, "sick")
    .replace(/\b(glad|pleased)\b/g, "happy")
    .replace(/\b(wonderful|excellent|awesome|superb|fantastic)\b/g, "great")
    .replace(/\blarge\b/g, "big")
    .replace(/\blittle\b/g, "small")
    .replace(/\bperhaps\b/g, "maybe")
    .replace(/\b(right away|straight away|instantly|at once)\b/g, "immediately")
    .replace(/\bquickly\b/g, "fast")
    .replace(/\bslowly\b/g, "slow")
    .replace(/\b(have to|need to|ought to)\b/g, "must")
    .replace(/\b(cellphone|cell phone|mobile phone|mobile)\b/g, "phone")
    .replace(/\bflat\b/g, "apartment")
    .replace(/\bvacation\b/g, "holiday")
    .replace(/\b(highway|freeway|expressway)\b/g, "motorway")
    .replace(/\brailroad\b/g, "railway")
    .replace(/\bbaggage\b/g, "luggage")
    .replace(/\bmovie theater\b/g, "cinema")
    .replace(/\bfilm\b/g, "movie")
    .replace(/\bcouch\b/g, "sofa")
    .replace(/\brefrigerator\b/g, "fridge")
    .replace(/\b(pretty|rather|fairly)\b/g, "quite")
    .replace(/\b(someone|somebody)\b/g, "someone")
    .replace(/\b(everyone|everybody)\b/g, "everyone")
    .replace(/\b(anyone|anybody)\b/g, "anyone")
    .replace(/\b(no one|nobody)\b/g, "no one")
    .replace(/\b(somewhere|anyplace|someplace)\b/g, "somewhere")
    .replace(/\b(sometimes|occasionally)\b/g, "sometimes")
    .replace(/\b(nowadays|today)\b/g, "these days")
    .replace(/\brecall\b/g, "remember")
    .replace(/\battempt\b/g, "try")
    .replace(/\bfancy\b/g, "like")
    .replace(/\bwould like\b/g, "want")
    .replace(/\bdad\b/g, "father")
    .replace(/\b(mom|mum)\b/g, "mother")
    .replace(/\bfolks\b/g, "parents")
    .replace(/\bbro\b/g, "brother")
    .replace(/\b(kid|baby)\b/g, "child")
    .replace(/\blady\b/g, "woman")
    .replace(/\bguy\b/g, "man")
    .replace(/\blad\b/g, "boy")
    .replace(/\b(gal|lass)\b/g, "girl")
    .replace(/\bhubby\b/g, "husband")
    .replace(/\bwifey\b/g, "wife")
    .replace(/\bdoc\b/g, "doctor")
    .replace(/\b(coworker|co-worker)\b/g, "colleague")
    .replace(/\bemployer\b/g, "boss")
    .replace(/\btutor\b/g, "teacher")
    .replace(/\bpupil\b/g, "student")
    .replace(/\b(college|uni)\b/g, "university")
    .replace(/\b(bicycle|bike)\b/g, "bike")
    .replace(/\bmotorcycle\b/g, "motorbike")
    .replace(/\b(coffee shop|coffeehouse)\b/g, "cafe")
    .replace(/\beatery\b/g, "restaurant")
    .replace(/\bgrocery store\b/g, "supermarket")
    .replace(/\btown\b/g, "city")
    .replace(/\bnation\b/g, "country")
    .replace(/\broad\b/g, "street")
    .replace(/\blane\b/g, "path")
    .replace(/\bwoods\b/g, "forest")
    .replace(/\b(rubbish|garbage|waste)\b/g, "trash")
    .replace(/\b(dustbin|bin|garbage can|trash can)\b/g, "trashcan")
    .replace(/\b(photo|photograph|picture)\b/g, "photo")
    .replace(/\b(journey|tour|travel)\b/g, "trip")
    .replace(/\bplane ride\b/g, "flight")
    .replace(/\bguesthouse\b/g, "hotel")
    .replace(/\bchamber\b/g, "room")
    .replace(/\bfront desk\b/g, "reception")
    .replace(/\btimetable\b/g, "schedule")
    .replace(/\b(gasoline|gas)\b/g, "petrol")
    .replace(/\bgas station\b/g, "petrol station")
    .replace(/\bcookie\b/g, "biscuit")
    .replace(/\bcandy\b/g, "sweet")
    .replace(/\b(french fries|fries)\b/g, "chips")
    .replace(/\bpants\b/g, "trousers")
    .replace(/\brailway station\b/g, "train station")
    .replace(/\bmail office\b/g, "post office")
    .replace(/\bmailman\b/g, "postman")
    .replace(/\bmailbox\b/g, "letterbox")
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
    .replace(/\bauto\b/g, "car")
    .replace(/\bmovies\b/g, "cinema")
    .replace(/\btalks\b/g, "speaks")
    .replace(/\btalked\b/g, "spoke")
    .replace(/\bkids\b/g, "children")
    .replace(/\b(grandma|granny|nana)\b/g, "grandmother")
    .replace(/\b(grandpa|granddad|grandad)\b/g, "grandfather")
    .replace(/\b(tasty|yummy)\b/g, "delicious")
    .replace(/\b(jumper|pullover|sweatshirt)\b/g, "sweater")
    .replace(/\bright now\b/g, "now")
    .replace(/\b(currently|at the moment)\b/g, "now")
    .replace(/\btruly\b/g, "really")
    .replace(/\bindeed\b/g, "really")
    .replace(/\b(a little|a little bit|slightly)\b/g, "a bit")
    .replace(/\b(choose|select|pick)\b/g, "choose")
    .replace(/\bdiscover\b/g, "find")
    .replace(/\b(assist|aid)\b/g, "help")
    .replace(/\bdemonstrate\b/g, "show")
    .replace(/\bhalt\b/g, "stop")
    .replace(/\butilize\b/g, "use")
    .replace(/\b(drop by|drop in)\b/g, "visit")
    .replace(/\bawait\b/g, "wait")
    .replace(/\bnote down\b/g, "write")
    .replace(/\bclient\b/g, "customer")
    .replace(/\b(salesperson|salesclerk)\b/g, "clerk")
    .replace(/\bfood list\b/g, "menu")
    .replace(/\bpermit\b/g, "license")
    .replace(/\bsack\b/g, "bag")
    .replace(/\bcarton\b/g, "box")
    .replace(/\bpresent\b/g, "gift")
    .replace(/\bchair\b/g, "seat")
    .replace(/\byard\b/g, "garden")
    .replace(/\bhamlet\b/g, "village")
    .replace(/\bocean\b/g, "sea")
    .replace(/\bpond\b/g, "lake")
    .replace(/\bstream\b/g, "river")
    .replace(/\bhill\b/g, "mountain")
    .replace(/\b(handsome|lovely|gorgeous)\b/g, "beautiful")
    .replace(/\b(awful|horrible|dreadful)\b/g, "terrible")
    .replace(/\b(clever|intelligent|bright|shlau|schlau)\b/g, "smart")
    .replace(/\b(silly|dumb)\b/g, "stupid")
    .replace(/\bcourteous\b/g, "polite")
    .replace(/\bimpolite\b/g, "rude")
    .replace(/\bunfriendly\b/g, "mean")
    .replace(/\b(dull|tedious)\b/g, "boring")
    .replace(/\bthrilling\b/g, "exciting")
    .replace(/\bidle\b/g, "lazy")
    .replace(/\bwealthy\b/g, "rich")
    .replace(/\bsecure\b/g, "safe")
    .replace(/\brisky\b/g, "dangerous")
    .replace(/\binexpensive\b/g, "cheap")
    .replace(/\bcostly\b/g, "expensive")
    .replace(/\btidy\b/g, "clean")
    .replace(/\bmessy\b/g, "dirty")
    .replace(/\bnoisy\b/g, "loud")
    .replace(/\bsilent\b/g, "quiet")
    .replace(/\b(anyhow|in any case)\b/g, "anyway")
    .replace(/\b(probably|likely)\b/g, "probably")
    .replace(/\b(normally|typically)\b/g, "usually")
    .replace(/\bparticularly\b/g, "especially")
    .replace(/\ball of a sudden\b/g, "suddenly")
    .replace(/\b(at the moment|presently|right now)\b/g, "currently")
    .replace(/\bsearch for\b/g, "look for")
    .replace(/\bgo on\b/g, "continue")
    .replace(/\b(take place|occur)\b/g, "happen")
    .replace(/\blook after\b/g, "take care of")
    .replace(/\bparticipate\b/g, "take part")
    .replace(/\b(delay|put off)\b/g, "postpone")
    .replace(/\b(issue|trouble)\b/g, "problem")
    .replace(/\b(path|route)\b/g, "way")
    .replace(/\bview\b/g, "opinion")
    .replace(/\bchance\b/g, "opportunity")
    .replace(/\bcause\b/g, "reason")
    .replace(/\binformation\b/g, "info")
    .replace(/\bprecise\b/g, "exact")
    .replace(/\b(various|diverse)\b/g, "different")
    .replace(/\b(significant|vital)\b/g, "important")
    .replace(/\bwell-known\b/g, "famous")
    .replace(/\bwell-liked\b/g, "popular")
    .replace(/\bamusing\b/g, "funny")
    .replace(/\b(at the end|in the end)\b/g, "in the end")
    .replace(/\bevery day\b/g, "daily")
    .replace(/\bstudy(ing)?\b/g, "learn$1")   // lernen covers both; people interchange them
    .replace(/\bpossibly\b/g, "maybe");
}

// ─── Tier 7: "understandable" near-misses ───────────────────────────────────
// Classic German→English transfer: phrasings an English speaker fully
// understands but wouldn't say. These are accepted (the learner communicated)
// with a phrasingNote so the UI can coach: "people will understand you — more
// natural is: …". They run LAST, so a properly-phrased answer never gets
// flagged — only answers that failed every silent tier land here.
const NEAR_MISS: [RegExp, string][] = [
  // "ich will" = want — Germans say "I will…" for "I want to…", and will/can
  // requests blur ("Will you help?" / "Can you help?"). All soft-equal.
  [/\b(?:will|can|want(?:s)? to|would like to)\b/g, "~mod~"],
  // bekommen ≠ become: "Can I become a beer?" means "Can I get a beer?"
  [/\bbecome(s)?\b/g, "get$1"],
  [/\bbecame\b/g, "got"],
  [/\bchef\b/g, "boss"],                  // der Chef = the boss, not a cook
  [/\bhandy\b/g, "phone"],                // das Handy = mobile phone
  [/\bsince\b/g, "for"],                  // "I'm here since two weeks" (seit)
  // machen covers make AND do: "I make my homework" (tense kept per pair)
  [/\bmake\b/g, "do"], [/\bmakes\b/g, "does"],
  [/\bmade\b/g, "did"], [/\bmaking\b/g, "doing"],
  [/\bwith the (bus|train|tram|car|bike|taxi|subway)\b/g, "by $1"], // mit dem Bus
  [/\binformations\b/g, "info"],          // die Informationen (canonical form is "info")
  [/\bpersons\b/g, "people"],             // die Personen
];

function applyNearMiss(t: string): string {
  let s = t;
  for (const [re, sub] of NEAR_MISS) s = s.replace(re, sub);
  return s;
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

// Fold an -ing gerund to its base so "to listen" and "listening" compare equal
// ("listening" -> "listen", "running" -> "run", "swimming" -> "swim"). Only for
// words > 4 chars, so short non-gerunds (king, ring, sing) are left alone. Tense
// endings (-ed, -s) are deliberately NOT folded — those carry meaning.
function stemGerund(w: string): string {
  if (w.length > 4 && w.endsWith("ing")) {
    return w.slice(0, -3).replace(/([a-z])\1$/, "$1"); // drop "ing"; collapse a doubled consonant
  }
  return w;
}

// Reduce a sentence to its meaning-bearing words in ORDER: drop articles and the
// infinitive/preposition "to", and fold gerunds. Keeping the order means a
// reversed sentence ("the woman gives the man" vs "the man gives the woman")
// still fails, so this only forgives phrasing, never meaning.
function reduceForMeaning(s: string): string {
  const FUNC = new Set(["a", "an", "the", "to"]);
  return normalizeGermanInput(s)
    .split(" ")
    .filter((w) => w && !FUNC.has(w))
    .map(stemGerund)
    .join(" ");
}

export function matchEnglishPhrase(
  input: string,
  target: string
): { ok: boolean; spellingNote: boolean; phrasingNote?: boolean } {
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
  // Tier 6: meaning-reduced ordered match — folds gerund/infinitive
  // ("to listen" == "listening") and drops articles/"to", but keeps word order,
  // so valid rephrasings pass while reversed/wrong-order answers still fail.
  const reducedInput = reduceForMeaning(inputK);
  const reducedTarget = reduceForMeaning(targetK);
  if (reducedTarget && reducedInput === reducedTarget) {
    return { ok: true, spellingNote: false };
  }
  // Tier 7: recognizable German-style literal translation ("I will eat" for
  // "I want to eat", "Can I become a coffee?"). NOT accepted — a literal
  // transfer isn't the English being taught — but flagged so the UI can coach
  // kindly ("people would understand you — the natural way is …") instead of
  // showing a cold "wrong". Runs last: anything that matched a silent tier
  // above never reaches here.
  const inputM = applyNearMiss(inputK);
  const targetM = applyNearMiss(targetK);
  if (
    matchGermanPhrase(inputM, targetM).ok ||
    matchGermanPhrase(stripArticles(inputM), stripArticles(targetM)).ok ||
    (reduceForMeaning(targetM) && reduceForMeaning(inputM) === reduceForMeaning(targetM))
  ) {
    return { ok: false, spellingNote: false, phrasingNote: true };
  }
  return { ok: false, spellingNote: false };
}
