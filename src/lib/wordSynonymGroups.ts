import { foldEnglishSynonyms } from "@/lib/englishSynonyms";

/**
 * Same-meaning German words, combined into ONE card.
 *
 * The catalogue taught "anfangen", "beginnen" and "starten" as three separate
 * words, three separate tracker rows, three separate Listen cards — and the
 * learner met "to begin" three times without ever being told the three are one
 * meaning. Leon's call: combine all synonyms into one entry, the most common
 * word first, with the less common ones visible inside it instead of scattered
 * through the list.
 *
 * HOW TWO WORDS END UP ON ONE CARD
 *
 * Two taught words are treated as one meaning when their PRIMARY English
 * senses agree once trivial wording differences are folded away — the same
 * primary-sense normalisation the catalogue already uses to decide whether two
 * packs disagree about a word, plus the English synonym table, so "to speak"
 * and "to talk" count as the same sense the way the answer matcher already
 * says they are. Sharing a whole gloss string is NOT required: that bar kept
 * "der Wagen [car]" and "das Auto [car, automobile]" apart.
 *
 * Three guards keep this from over-merging:
 *
 *  - A word-class marker. "der Start" (a noun) must never fold into "starten"
 *    (a verb) just because both senses normalise to "start". The marker reads
 *    what the seed itself shows — a "to …" gloss or a "sich …" lemma is a
 *    verb, an article is a noun — and only identical markers may merge.
 *  - Only words shown as themselves merge. An idiom ("auf den Grund gehen")
 *    keeps its own card no matter what its gloss says.
 *  - KEEP_APART below: pairs whose English happens to collide but whose
 *    German the course exists to teach APART. Folding wissen into kennen
 *    would accept a wrong word forever, exactly the failure the English
 *    synonym table warns about — so these never share a card, whatever
 *    their glosses do.
 *
 * The most common word (frequency-bank rank, curriculum order as tie-break)
 * becomes the card's face; every other member survives as a visible
 * "also: …" synonym carrying its own gloss and usage note, and its progress
 * id travels as an alias so nothing a learner earned is lost. The English
 * sides are joined behind " / ", which the matchers already treat as
 * alternatives — answering "enemy" on the Gegner card stays right.
 */

/** The catalogue's primary-sense normalisation, shared so the two callers can never drift apart. */
export function primaryWordSense(en: string): string {
  return String(en ?? "")
    .split(" / ")[0].split(",")[0]
    .toLocaleLowerCase("en-GB")
    .replace(/\([^)]*\)/g, " ")
    .replace(/^\s*(to|the|a|an)\s+/, "")
    .replace(/[^a-zäöüß\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Word-class marker for the merge key. Glosses tell verbs apart ("to …"), the
 * German side tells nouns apart (article, or a reflexive "sich …" verb);
 * adjectives, adverbs and particles share the remaining bucket, where the
 * folded sense alone must agree.
 */
function wordClassMarker(en: string, de: string): string {
  const rawGloss = String(en ?? "").split(" / ")[0].split(",")[0].trim().toLocaleLowerCase("en-GB");
  const lemma = String(de ?? "").trim();
  if (/^to\s/.test(rawGloss) || /^sich\s/i.test(lemma)) return "verb";
  if (/^(der|die|das)\s/i.test(lemma)) return "noun";
  return "word";
}

/**
 * One meaning, one key — or null when this entry must not merge at all.
 * `de` is the display form; callers pass the catalogue's own fields.
 */
export function wordMeaningKey(en: string, de: string): string | null {
  const sense = foldEnglishSynonyms(primaryWordSense(en));
  if (!sense) return null;
  return `${wordClassMarker(en, de)}:${sense}`;
}

/**
 * Words the course teaches APART even though their English collides.
 *
 * A row here means: each listed word keeps its own card for ever. The row
 * itself documents WHICH collision is being refused — wissen and kennen are
 * both "to know", but knowing a fact and knowing a person are the exact
 * distinction German insists on and English hides. The seaside row exists
 * because the English synonym table deliberately treats beach, sea and coast
 * as one PLACE when marking answers; Strand, Meer and Küste are still three
 * different German words that must stay three cards.
 *
 * Membership is per word, not per pair: a listed word merges with nothing.
 * The single-word rows below came out of reading every group the automatic
 * key produced over the real catalogue: each is a word whose shared English
 * gloss is one word wearing two meanings ("seal", "line", "draw"), not one
 * meaning wearing two words. Isolating just that word lets the rest of its
 * group keep merging — Warteschlange and Schlange still share the queue card
 * after Leitung (the phone kind of "line") is pulled out.
 */
export const KEEP_APART: string[][] = [
  // German insists on the distinction; English hides it.
  ["wissen", "kennen"],
  ["leben", "wohnen"],
  ["fragen", "bitten"],
  ["bedeuten", "meinen"],
  ["treffen", "kennenlernen"],
  ["gehen", "laufen"],
  // Grammar words whose glosses collide but whose grammar is the lesson.
  ["denn", "weil"],
  ["damit", "sodass"],
  ["daran", "darauf"],
  ["zuvor", "bevor"],
  ["außerhalb", "draußen"],
  // The answer matcher deliberately folds these English senses; the German
  // words behind them stay separate cards.
  ["strand", "meer", "küste", "see"],
  ["kosten", "preis"],
  // False friends and register traps taught on purpose.
  ["termin", "ernennung"],
  ["streit", "argument"],
  ["idee", "ahnung"],    // an idea is not a hunch — keine Ahnung ≠ keine Idee

  ["ernährung", "diät"],
  ["konsequent", "konsistent"],
  // Four different kinds of dishonesty; a shared card would blur exactly
  // what each word accuses someone of.
  ["cheaten", "fremdgehen", "spicken", "schummeln"],
  // One English word, two unrelated German meanings — the polysemy traps
  // the automatic key cannot see. Isolating one side is enough.
  ["dauern"],            // "to take (time)" is not nehmen
  ["grinden"],           // the gaming grind is not mahlen (coffee)
  ["klappen"],           // "to work out (succeed)" is not trainieren
  ["leitung"],           // a phone "line" is not a queue
  ["speichern"],         // saving a file is not aufheben (keeping things)
  ["verschenken"],       // giving away a gift is not verraten (a secret)
  ["drehung"],           // a physical turn is not a Wendung (of phrase)
  ["robbe"],             // the seal that swims is not a gasket
  ["pinsel"],            // a paintbrush is not a hairbrush
  ["taste"],             // a keyboard key is not a door key
  ["betrag"],            // a sum of money is not a Menge (quantity)
  ["verlauf"],           // how something went is not a Kurs (course/class)
  ["wechsel", "wechselgeld"], // switching, and coins back, are not Änderungen
  ["anhalten"],          // mostly "to stop" — never a synonym of weitergehen
  ["fach"],              // a compartment/subject is not a Regal (shelf unit)
  ["anhänger"],          // a vehicle trailer is not a film preview
  ["vergehen"],          // time passing is not passing an exam
  ["zusammentreiben"],   // herding cattle is not rounding up a number
  ["tippen"],            // mostly typing/guessing — not wetten (wagering)
  ["auffrischen"],       // freshening wind is not picking things up
  ["wirt"],              // a publican is not a Vermieter (rental landlord)
  ["brechen"],           // snapping something is not kaputtgehen (dying gadgets)
  ["vergleich", "regulierung", "einigung"], // comparison, claims handling and agreement — not one "settlement"
  ["auflösung"],         // screen resolution is not a Beschluss (decision)
  ["komfort"],           // convenience is not Trost (consolation)
  ["abhalten"],          // holding a meeting / keeping someone from — not halten
  ["leinwand"],          // the cinema screen/canvas is not a Bildschirm
  ["parzelle"],          // a plot of land is not a Handlung (storyline)
  ["ferse"],             // the heel of a foot is not a shoe heel
  ["einbrechen"],        // burglary is not breaking in shoes
  ["vollaufen"],         // running full of water is not filling the tank
  ["entlüften"],         // bleeding a radiator is not bluten
  ["gedächtnis"],        // the faculty of memory is not an Erinnerung (a memory)
  ["briefmarke"],        // postage is not a rubber Stempel
  ["eingriff"],          // a surgical operation is not a Verfahren (procedure)
  ["selbstabholer"],     // collection in person is not a Sammler (hobbyist)
  ["wechselbad"],        // the emotional rollercoaster is not the ride
  ["eigentum"],          // ownership is not an Immobilie (a building)
  ["breit"],             // physical width; weit is far/loose — taught apart
  ["aufgeben"],          // checking a bag (and giving up) — not prüfen
  ["zutreffen"],         // being applicable is not applying for a job
  ["bestellung"],        // a purchase order is not an Auftrag (assignment)
  ["abholen"],           // picking someone up is not erheben (collecting data)
  ["überführen"],        // transferring a car/convicting is not überweisen (money)
  ["anhöhe"],            // a hillock is not an Anstieg (an increase)
  ["feingefühl"],        // tact is not a mouse-sensitivity setting
  ["verwöhnen"],         // pampering is not spoilern (a plot)
  ["ziehung"],           // a lottery draw is not an Unentschieden (a tie)
  ["umsteigen", "wickeln"], // changing trains / a nappy are not ändern
  ["gleis"],             // the station platform/track is not a Plattform (digital)
  ["mitbekommen"],       // noticing is not erwischen (catching red-handed)
  ["aktie"],             // a stock is not an Anteil (a share of something)
  ["aufklaren"],         // weather clearing is not klären (sorting out)
  ["ereignis"],          // an occurrence is not a Veranstaltung (organised event)
  ["reichhaltig"],       // rich in content is not beträchtlich (considerable)
  ["hilfsbereit"],       // a helpful person is not a helpful thing
  ["unbeständig"],       // changeable weather is not a verunsicherte person
  ["übereinstimmung"],   // concordance is not a Vereinbarung (a contract)
  ["volumen"],           // capacity — explicitly NOT loudness (Lautstärke)
  ["anschaffen"],        // deliberately acquiring is not bekommen (receiving)
  ["abmachen"],          // settling a deal is not zustimmen (consenting)
  ["immerhin"],          // the silver-lining "at least" — not mindestens/zumindest
];

const KEEP_APART_WORDS = new Set(
  KEEP_APART.flat().map((word) => word.toLocaleLowerCase("de-DE"))
);

const bareLookup = (lookup: string): string =>
  String(lookup ?? "")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/^(der|die|das)\s+/, "")
    .replace(/^sich\s+/, "");

/** Non-null when this word must keep its own card: the tag splits it out of any gloss group. */
export function keepApartTag(lookup: string): string | null {
  const key = bareLookup(lookup);
  return KEEP_APART_WORDS.has(key) ? key : null;
}

/**
 * Same-meaning groups whose English glosses do NOT collide, so the automatic
 * key cannot see them: "Gegner [opponent]" and "Feind [enemy]" are the pair
 * the frequency chips were built for. Mirrors SYNONYM_PAIRS in
 * wordFrequency.ts, which keeps labelling the pair on sentence cards.
 * Frequency still decides which member fronts the combined card.
 */
export const EXTRA_SYNONYM_GROUPS: string[][] = [
  ["gegner", "feind"],
  ["auto", "wagen"],
  ["schnell", "rasch"],
  // "Return" is one English word over two unrelated German meanings. Listing
  // the two REAL groups here splits them cleanly: parcels go back, money
  // comes back, and neither absorbs the other.
  ["retoure", "rückgabe", "rücksendung"],
  ["rendite", "ertrag"],
];

const EXTRA_GROUP_BY_WORD = new Map<string, string>();
EXTRA_SYNONYM_GROUPS.forEach((group, index) => {
  for (const word of group) {
    EXTRA_GROUP_BY_WORD.set(word.toLocaleLowerCase("de-DE"), `extra:${index}`);
  }
});

/** Non-null when this word belongs to a hand-listed same-meaning group. */
export function extraSynonymGroupKey(lookup: string): string | null {
  return EXTRA_GROUP_BY_WORD.get(bareLookup(lookup)) ?? null;
}

/** A less common same-meaning word folded into a combined card. */
export type WordSynonym = {
  /** The vw- progress id the word carried on its own — now one of the card's aliases. */
  id: string;
  /** "der Wagen" — display form, article kept. */
  de: string;
  /** Its own authored gloss, kept so the synonym line can show its meaning wording. */
  en: string;
  /** Bare lemma for frequency lookups. */
  lookup: string;
  pos?: string;
  use?: string;
  /** The pack that authored the word — counts and exports still attribute it. */
  partKey?: string;
  level?: string;
};
