/**
 * Names that exist in Germany and nowhere a Russian lives.
 *
 * WHY A RUSSIAN COURSE NEEDS THIS LIST AT ALL. Every card in the table is keyed
 * by a German sentence, and the Russian is what the learner produces and is
 * graded on. So a German card about the Schufa does not become a Russian card
 * about the Schufa — it becomes a Russian sentence a Russian would never say,
 * about an office that does not exist where the language is spoken. The learner
 * is not helped by knowing how to discuss Bavarian dialect in Russian.
 *
 * WHY PROPER NAMES ONLY. The blunt version of this rule blocks any German
 * subject, and it is wrong: "Brotzeit" keyed to «перекус» teaches a real Russian
 * word, and "Mietvertrag" keyed to «договор аренды» teaches a real Russian
 * contract. Germans and Russians both rent flats. What does not travel is the
 * NAME — Schufa, TÜV, Elster, Fronleichnam, Bayrisch — because there is nothing
 * on the other side for it to be the name of. So this list holds proper names,
 * German-language drills and the letter formulas, and lets ordinary life
 * through in whatever words Russian actually uses for it.
 *
 * WHEN A NEW NAME BELONGS HERE. If a card would teach a Russian speaker a word
 * for a thing they cannot encounter, and no Russian equivalent exists to
 * translate it into, add it. If a Russian equivalent exists — техосмотр for the
 * TÜV inspection, садик for the Kita — the card is fine and the name is not the
 * problem; the card just has to use the Russian word.
 */

/**
 * German bodies, brands, documents and abbreviations that name themselves.
 *
 * WHAT IS DELIBERATELY NOT HERE, and why the list is shorter than it first was:
 * Standesamt, Fahrzeugbrief, Rentenpunkte, Sperrmüll, Elternzeit, Berufsschule,
 * Werkstudent, Arbeitsgericht, Gartenordnung. Every one of those has a Russian
 * counterpart the card already uses — загс, техпаспорт, пенсионные баллы,
 * крупногабаритный мусор, отпуск по уходу, училище, студент-практикант, суд по
 * трудовым спорам, устав садового товарищества. Russia registers marriages and
 * counts pension points too. Blocking those would not be holding the line, it
 * would be deleting good Russian for having a German key.
 */
const INSTITUTIONS = [
  "Schufa", "Elster", "BAföG", "Deutschlandticket", "BahnCard",
  "IGeL", "GmbH", "Azubi", "ZKB", "eVB", "Anlage N",
  "Schultüte", "Gelben Sack", "Gelbe Sack", "Flensburg",
];

/** German transport that is a name rather than a kind of vehicle. */
const TRANSPORT = ["ICE", "S-Bahn", "Hbf", "Deutsche Bahn"];

/** German holidays with no counterpart in the Russian calendar. */
const HOLIDAYS = ["Fronleichnam", "Buß- und Bettag", "Christi Himmelfahrt"];

/** The German language taught as its own subject. */
const LANGUAGE = [
  "Hochdeutsch", "Bayrisch", "bayerisch", "Plattdeutsch", "Sächsisch",
  "Schweizerdeutsch", "Umlaut", "scharfem S", "scharfes S",
  "Alt plus", "der, die oder das", "Der, nicht das",
  "Zertifikat B1", "Kurs, B2", "bei A2",
  "auf Deutsch", "Deutsch lernen", "Deutschlernen",
];

/** German letter and reference conventions. */
const FORMULAS = [
  "Mit freundlichen Grüßen", "Sehr geehrte Damen und Herren", "Viele Grüße reicht",
  "Mit besten Grüßen", "z. Hd.", "Zu Händen", "stets bemüht",
  "zu unserer Zufriedenheit", "Anbei sende ich Ihnen",
];

const GERMAN_ONLY = [
  ...INSTITUTIONS, ...TRANSPORT, ...HOLIDAYS, ...LANGUAGE, ...FORMULAS,
];

/**
 * The one name a Russian card may carry: an international brand a Russian also
 * writes in Latin. WhatsApp is WhatsApp in Moscow too.
 */
const INTERNATIONAL = [
  "WhatsApp", "Instagram", "YouTube", "Google", "LinkedIn", "PDF", "SIM",
  "eSIM", "DSL", "QR", "Mario Kart", "Wi-Fi", "WLAN",
];

/** Which German-only name a card carries, or null when it carries none. */
function germanOnlyName(german) {
  const text = String(german ?? "");
  return GERMAN_ONLY.find((name) => text.includes(name)) ?? null;
}

module.exports = { GERMAN_ONLY, INTERNATIONAL, germanOnlyName };
