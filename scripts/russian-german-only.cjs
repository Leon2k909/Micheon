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
  // The inspection translates — техосмотр — but the organisation does not, and
  // "Sie arbeitet beim TÜV" is about the organisation.
  "TÜV", "Siemens", "Zur Linde", "mit Linde",
  // German paediatric check-ups are numbered U1 to U9; nothing is called that
  // in Russia. And VB in a small ad is Verhandlungsbasis, a German shorthand.
  "der U7", "Euro VB", "Bei VB", "Kompaktbrief",
  // A Sunday-night television institution. Naming it teaches nothing to
  // somebody who will never be in the room where it is on.
  "Tatort", "DB-App",
  // German regional words for the same thing. The lesson is which German
  // region you are standing in, which is not a lesson in Russian.
  "Buletten", "Fleischpflanzerl",
];

/**
 * German transport that is a name rather than a kind of vehicle. The Autobahn
 * numbers are named individually rather than matched as A + digits, because
 * A4 is also a sheet of paper and A2 is also a language level.
 */
const TRANSPORT = [
  "ICE", "S-Bahn", "Hbf", "Deutsche Bahn",
  "A7 Richtung", "auf der A3", "Auf der A3",
];

/** German holidays with no counterpart in the Russian calendar. */
const HOLIDAYS = ["Fronleichnam", "Buß- und Bettag", "Christi Himmelfahrt"];

/**
 * The German language taught as its own subject.
 *
 * The plain word Deutsch has to be a PATTERN rather than a substring, because
 * "Deutschland" contains it and a card about the country is not a card about
 * the language. \b…\b keeps «Dein Deutsch ist echt gut» and lets
 * «Ich bin zum ersten Mal in Deutschland» through.
 */
const LANGUAGE = [
  /\bDeutsch\b/, /\bDeutschlernen\b/,
  // The lower-case adjective, but only where it modifies the language or a
  // German-format document: "deutsche Untertitel", "der deutsche Lebenslauf".
  // Left alone elsewhere, so "ein deutscher Wald" is still a wood.
  /deutsche[rnms]? (Untertitel|Lebenslauf|Ton|Synchro)/i,
  "Hochdeutsch", "Bayrisch", "bayerisch", "Plattdeutsch", "Sächsisch",
  "Schweizerdeutsch", "Umlaut", "scharfem S", "scharfes S",
  // German has dialects that stop comprehension; Russian does not in the same
  // way, and these cards mean the German ones.
  "Dialekt", "Tastatur fehlt das ü",
  "Alt plus", /der, die oder das/i, "Der, nicht das", "Der Kühlschrank.",
  "Zertifikat B1", "Kurs, B2", "bei A2",
  // Russian has no articles at all, so any card teaching der/die/das is
  // teaching a category the learner's target language does not contain.
  /\bArtikel\b.{0,30}(verwechsle|durcheinander)/, /(verwechsle|durcheinander).{0,30}\bArtikel\b/,
  "verrät oft den Artikel",
  "mit e-y oder mit a-i", "mit ha oder ohne", "ae, oe, ue und ss",
  "schreib ich einfach ue", "Punkt de", "gemütlich auf Englisch",
  "heißt wörtlich", "heißt übersetzt", "unübersetzbares Wort",
  "Handschuh ist einfach", "Fernweh ist Heimweh", "Gemütlich ist so ein",
  "become werden heißt", "Bekommen heißt nicht become",
  "Und Chef ist der Boss", "das Wort selbst?", "Wort für privacy",
  "I become a steak", "Deutsche Größen",
  "Durchwachsen heißt beim Fleisch", "Halb und halb heißt",
  "Eventuell heißt vielleicht", "Stimmt so heißt",
  "Im Süden sagt man Geldbeutel", "Ich hab ein Gift für dich",
  "Ein Gift?!",
];

/** German letter and reference conventions. */
const FORMULAS = [
  "Mit freundlichen Grüßen", "Sehr geehrte Damen und Herren", "Viele Grüße reicht",
  "Mit besten Grüßen", "z. Hd.", "Zu Händen", "stets bemüht", "Stets bemüht",
  "zu unserer Zufriedenheit", "zu unserer vollsten Zufriedenheit",
  "zu unserer vollen Zufriedenheit", "Anbei sende ich Ihnen",
  "Schreiben Sie einfach: Alles Liebe",
];

/**
 * "In Germany one does it this way." True, and no use to somebody learning to
 * speak Russian in a place where it is done differently or not at all.
 */
const CUSTOMS = [
  /In Deutschland (zahlt|isst|macht)/, "Mülltrennung ist in Deutschland",
  "Halb Deutschland macht es", "Frag zehn Deutsche",
  "ich mach was Deutsches", "Willkommen in Deutschland",
  "Abendbrot",
];

const GERMAN_ONLY = [
  ...INSTITUTIONS, ...TRANSPORT, ...HOLIDAYS, ...LANGUAGE, ...FORMULAS, ...CUSTOMS,
];

/**
 * The one name a Russian card may carry: an international brand a Russian also
 * writes in Latin. WhatsApp is WhatsApp in Moscow too.
 */
const INTERNATIONAL = [
  "WhatsApp", "Instagram", "YouTube", "Google", "LinkedIn", "PDF", "SIM",
  "eSIM", "DSL", "QR", "Mario Kart", "Wi-Fi", "WLAN",
];

/**
 * Which German-only name a card carries, or null when it carries none.
 * Entries are substrings unless they are patterns — see LANGUAGE for why the
 * bare word Deutsch cannot be a substring.
 */
function germanOnlyName(german) {
  const text = String(german ?? "");
  for (const entry of GERMAN_ONLY) {
    if (entry instanceof RegExp) {
      const hit = text.match(entry);
      if (hit) return hit[0];
    } else if (text.includes(entry)) {
      return entry;
    }
  }
  return null;
}

module.exports = { GERMAN_ONLY, INTERNATIONAL, germanOnlyName };
