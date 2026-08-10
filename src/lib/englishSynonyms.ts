/**
 * Words that are the same word, for the purpose of marking an answer.
 *
 * The English half of a lesson asks one question: did you understand the
 * German? "We're going to the beach at the weekend" answers that question just
 * as completely as "We're going to the seaside at the weekend", and marking the
 * first one wrong teaches nothing except that the app is fussy.
 *
 * The matcher already carried about 130 of these folds, written one at a time
 * as they came up, buried in a 400-line chain of replacements. This is the same
 * idea as a table you can read: each row is a set of words that may stand in for
 * one another, first entry first. Both the learner's answer and the answer key
 * are folded to that first entry before they are compared, so every pair in a
 * row is accepted in both directions and no row can accidentally work one way
 * only.
 *
 * WHAT DOES NOT BELONG HERE
 *
 * Folding is symmetric and unconditional, so a row that puts two genuinely
 * different words together makes the app accept a wrong answer forever. The bar
 * is: could a careful English speaker swap these in an everyday sentence
 * without changing what happened? "Lake" and "sea" fail that. So do "hot" and
 * "warm", "always" and "often", and every pair the packs exist to teach apart —
 * greetings by register (hi / hello / good day), "excuse me" against "sorry",
 * and "Prost!" against "thanks".
 *
 * Two rows are deliberately looser than a dictionary would be, and are marked
 * where they sit: the seaside row treats Strand, Meer and Küste as one place in
 * English, and the clock rules below treat every way of saying a time as the
 * same time. Both are cases where the German has been understood.
 */
export const ENGLISH_SYNONYMS: string[][] = [
  // ── people and quantities ───────────────────────────────────────────────
  ["everyone", "everybody"],
  ["someone", "somebody"],
  ["anyone", "anybody"],
  ["no one", "nobody", "noone"],
  ["a lot", "lots", "loads"],
  ["about", "around", "approximately", "roughly"],
  ["almost", "nearly"],
  ["often", "frequently"],
  ["soon", "shortly"],
  ["maybe", "perhaps"],
  ["sure", "certain"],

  // ── places and things ───────────────────────────────────────────────────
  // Strand, Meer and Küste are one place in English here. A learner who
  // answers "beach" for "Meer" has understood the sentence; refusing it over
  // the difference between a beach and the sea is not teaching German.
  ["sea", "seaside", "beach", "coast", "seafront"],
  ["flat", "apartment"],
  ["sofa", "couch"],
  ["cupboard", "closet"],
  ["tap", "faucet"],
  ["car park", "parking lot", "parking garage"],
  ["motorway", "highway", "freeway"],
  ["pavement", "sidewalk"],
  ["postcode", "zip code", "zipcode"],
  ["taxi", "cab"],
  ["lorry", "truck"],
  ["bike", "bicycle"],
  ["motorbike", "motorcycle"],
  ["luggage", "baggage"],
  ["backpack", "rucksack"],
  ["torch", "flashlight"],
  ["trainers", "sneakers"],
  ["pharmacy", "chemist", "drugstore"],
  ["queue", "line"],
  ["phone", "telephone", "mobile phone", "cell phone", "cellphone", "mobile"],
  ["post", "mail"],
  ["film", "movie"],
  ["holiday", "vacation"],
  ["autumn", "fall"],
  ["dinner", "supper"],
  ["starter", "appetiser", "appetizer"],
  ["nappy", "diaper"],
  ["cost", "price"],

  // ── doing things ────────────────────────────────────────────────────────
  ["start", "begin", "commence"],
  ["starts", "begins"],
  ["started", "began"],
  ["starting", "beginning"],
  ["finished", "done", "completed"],
  ["finish", "complete"],
  ["speak", "talk"],
  ["reply", "answer"],
  // "receive" and "obtain" are not here: the chain above already folds them,
  // and a row that never fires is a row that looks like cover and is not.
  // "Shut" is the same word in every tense, and "close" is not, so folding the
  // two bare verbs together would quietly forgive "I closed" for "I close".
  // Only the state — the shop IS shut — is folded, which is the case that
  // actually comes up and the one where nothing is at stake.
  ["is closed", "is shut"],
  ["are closed", "are shut"],
  ["was closed", "was shut"],
  ["were closed", "were shut"],
  ["been closed", "been shut"],
  ["fix", "repair", "mend"],
  ["allowed", "permitted"],

  // ── describing things ───────────────────────────────────────────────────
  ["quick", "fast", "rapid", "quickly", "rapidly", "swiftly"],
  ["ill", "sick", "unwell"],
  ["happy", "glad", "pleased"],
  ["sad", "unhappy"],
  ["angry", "mad"],
  ["scared", "afraid", "frightened"],
  ["difficult", "hard", "tough"],
  ["easy", "simple"],
  ["strange", "weird", "odd"],
  ["correct", "right"],
  ["wrong", "incorrect"],
  ["big", "large"],
  ["small", "little"],
];

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Longest variant first, so "cell phone" is folded before "phone" can claim
 * half of it. An optional trailing "s" is matched and carried over, which
 * covers the plural of every noun in the table without a second row per word;
 * the fold runs on both sides of the comparison, so a form like "diapers" only
 * ever has to be CONSISTENT, not correct English.
 */
const FOLDS: Array<[RegExp, string]> = ENGLISH_SYNONYMS
  .flatMap(([canonical, ...variants]) => variants.map((variant) => [variant, canonical] as [string, string]))
  .sort((a, b) => b[0].split(" ").length - a[0].split(" ").length || b[0].length - a[0].length)
  .map(([variant, canonical]) => [
    new RegExp("\\b" + escape(variant) + (variant.endsWith("s") ? "" : "(s?)") + "\\b", "g"),
    variant.endsWith("s") ? canonical : canonical + "$1",
  ]);

export function foldEnglishSynonyms(text: string): string {
  let out = String(text ?? "");
  for (const [pattern, canonical] of FOLDS) out = out.replace(pattern, canonical);
  return out;
}

// ── telling the time ────────────────────────────────────────────────────────

const HOURS = [
  "twelve", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten", "eleven",
];
const MINUTES: Record<string, number> = {
  five: 5, ten: 10, quarter: 15, fifteen: 15, twenty: 20,
  "twenty five": 25, twentyfive: 25, half: 30, thirty: 30,
};
const MINUTE_WORDS: Record<number, string> = {
  0: "", 5: "five", 10: "ten", 15: "fifteen", 20: "twenty", 25: "twenty five",
  30: "thirty", 35: "thirty five", 40: "forty", 45: "forty five",
  50: "fifty", 55: "fifty five",
};

const hourIndex = (word: string) => HOURS.indexOf(word);

/**
 * Every way of saying a clock time reduced to one of them.
 *
 * "Es ist halb acht" is "half past seven", "seven thirty", or — in Britain,
 * out loud, constantly — "half seven". They are the same moment, and a learner
 * who writes one of them has read the German correctly. This turns all of them
 * into "seven thirty" before the comparison, so which one they reached for
 * stops mattering.
 *
 * Digits have already become words by the time this runs, so it only has to
 * deal with the written-out forms. "o'clock" is dropped for the same reason:
 * "It's seven" and "It's seven o'clock" are one answer.
 */
export function foldClockTimes(text: string): string {
  const hourAlt = HOURS.join("|");
  const minuteAlt = Object.keys(MINUTES).sort((a, b) => b.length - a.length).join("|");
  const at = (hour: number, minute: number) =>
    (HOURS[((hour % 12) + 12) % 12] + " " + (MINUTE_WORDS[minute] ?? "")).trim();

  return String(text ?? "")
    // "quarter to eight" / "twenty to eight" — the minutes belong to the hour before.
    .replace(new RegExp("\\b(?:a )?(" + minuteAlt + ") to (" + hourAlt + ")\\b", "g"), (whole, minute, hour) => {
      const h = hourIndex(hour);
      const m = MINUTES[minute];
      if (h < 0 || m == null) return whole;
      return at(h - 1, 60 - m);
    })
    // "half past seven", "quarter past seven", "twenty past seven".
    .replace(new RegExp("\\b(?:a )?(" + minuteAlt + ") past (" + hourAlt + ")\\b", "g"), (whole, minute, hour) => {
      const h = hourIndex(hour);
      const m = MINUTES[minute];
      if (h < 0 || m == null) return whole;
      return at(h, m);
    })
    // "half seven" — spoken British for 7:30, and never anything else.
    .replace(new RegExp("\\bhalf (" + hourAlt + ")\\b", "g"), (whole, hour) => {
      const h = hourIndex(hour);
      return h < 0 ? whole : at(h, 30);
    })
    // "twelve oh five" is "twelve five" once the filler is gone.
    .replace(new RegExp("\\b(" + hourAlt + ") oh (one|two|three|four|five|six|seven|eight|nine)\\b", "g"), "$1 $2")
    .replace(/\boclock\b/g, "")
    .replace(/ {2,}/g, " ")
    .trim();
}
