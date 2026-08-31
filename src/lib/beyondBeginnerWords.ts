/**
 * Words a beginner's TOPIC teaches that are not a beginner's words.
 *
 * A pack carries one level and its words do not. The A1 animal pack teaches
 * die Kuh and das Stachelschwein, the A1 kitchen pack die Kartoffel and die
 * Artischocke, the A1 office pack der Bleistift and der Bildschirmschoner.
 * Measured, 462 of the words in those packs are ones the 2,500-word frequency
 * bank has never ranked and this course's conversational text never says -
 * and about half of them are plainly first-thousand vocabulary anyway. A
 * corpus of conversation has no occasion to mention a cow.
 *
 * So frequency cannot sort these, and this is the half it cannot: the ones
 * that are genuinely later. Written out rather than derived, because there is
 * nothing to derive them from - it is a judgement about what a learner needs
 * first, and a list is the honest shape for a judgement. Argue with any line
 * of it; that is what it is for.
 *
 * What is NOT here matters as much: die Kuh, das Knie, die Jacke, die
 * Kartoffel, der Bäcker, die Ampel, regnen and duschen all stay where their
 * pack put them.
 */
export const BEYOND_A_BEGINNER = new Set([
  "das Stachelschwein", "das Faultier", "der Luchs", "der Maulwurf",
  "der Dachs", "der Biber", "der Otter", "der Igel",
  "der Waschbär", "das Nashorn", "das Nilpferd", "der Leopard",
  "der Gepard", "der Schimpanse", "der Ochse", "der Truthahn",
  "das Meerschweinchen", "das Fohlen", "das Kalb", "der Hirsch",
  "das Wildschwein", "der Eisbär", "der Ellbogen", "das Handgelenk",
  "der Fingernagel", "die Hüfte", "der Knöchel", "die Wade",
  "der Oberschenkel", "die Stirn", "das Kinn", "die Wange",
  "der Hang", "die Klippe", "der Sumpf", "das Moor",
  "der Gletscher", "der Vulkan", "der Wasserfall", "der Dschungel",
  "die Strömung", "der Horizont", "der Schlamm", "der Fels",
  "die Aprikose", "die Feige", "die Dattel", "die Rosine",
  "die Walnuss", "die Haselnuss", "die Erdnuss", "die Mandel",
  "der Granatapfel", "die Himbeere", "die Blaubeere", "die Pflaume",
  "die Zucchini", "die Aubergine", "der Brokkoli", "der Blumenkohl",
  "der Rosenkohl", "der Spinat", "der Sellerie", "das Radieschen",
  "der Rettich", "die Rübe", "der Kürbis", "die Erbse",
  "die Linse", "der Spargel", "die Artischocke", "der Fenchel",
  "der Ingwer", "die Petersilie", "der Schnittlauch", "das Basilikum",
  "der Thymian", "der Rosmarin", "die Minze", "die Strickjacke",
  "die Weste", "die Krawatte", "die Daunenjacke", "die Regenjacke",
  "der Strumpf", "die Strumpfhose", "das Unterhemd", "der Schlafanzug",
  "die Badehose", "der Badeanzug", "die Sandale", "der Hausschuh",
  "der Kragen", "die Kapuze", "das Knopfloch", "die Wolle",
  "die Baumwolle", "die Seide", "das Leinen", "der Samt",
  "gestreift", "kariert", "gepunktet", "die Hebamme",
  "der Chirurg", "der Apotheker", "der Psychologe", "der Erzieher",
  "der Flugbegleiter", "der Lokführer", "der Seemann", "der Astronaut",
  "der Tischler", "der Maurer", "der Dachdecker", "der Förster",
  "der Schneider", "der Uhrmacher", "der Bildhauer", "der Dolmetscher",
  "der Bibliothekar", "der Buchhalter", "der Briefträger", "der Kassierer",
  "der Dom", "das Denkmal", "der Brunnen", "der Sandkasten",
  "die Fußgängerzone", "der Zebrastreifen", "der Kreisverkehr", "die Einbahnstraße",
  "der Bürgersteig", "die Laterne", "das Parkhaus", "der Wolkenkratzer",
  "die Konditorei", "die Reinigung", "der Waschsalon", "das Postamt",
  "das Gefängnis", "die Kaserne", "die Galerie", "der Zirkus",
  "das Hallenbad", "die Turnhalle", "der Füller", "der Spitzer",
  "der Zirkel", "die Mappe", "der Ranzen", "die Kreide",
  "der Pausenhof", "die Büroklammer", "der Locher", "der Tacker",
  "der Textmarker", "der Notizblock", "der Briefumschlag", "der Aktenordner",
  "die Schreibtischlampe", "der Papierkorb", "der Kopierer", "der Bildschirmschoner",
  "kriechen", "schleichen", "gähnen", "zittern",
  "beißen", "kauen", "schlucken", "stinken",
  "schmelzen", "gefrieren", "spritzen", "graben",
  "melken", "jagen", "angeln", "stricken",
  "nähen", "fegen", "schrauben", "bohren",
  "falten", "biegen", "blass", "mild",
  "eklig", "mager", "nackt", "das Feuerwerk",
  "das Geschenkpapier", "der Advent", "der Nikolaus", "der Muttertag",
  "der Vatertag", "der Valentinstag", "die Tube", "der Sack",
  "das Fass", "der Kanister", "die Kanne", "der Henkel",
  "der Verschluss", "der Korken", "Tschechien", "Ungarn",
  "Schottland", "Ägypten", "die Niederlande", "niederländisch",
  "arabisch", "griechisch", "das Rechteck", "das Dreieck",
  "das Quadrat", "die Kugel", "die Kante", "die Innenseite",
  "die Außenseite", "oberhalb", "unterhalb", "senkrecht",
  "waagerecht", "quer", "sich schminken", "sich rasieren",
  "staubsaugen", "tanken", "abbiegen", "hageln",
  "donnern", "blitzen", "stürmen", "wehen",
  "tauen", "wechselhaft", "regnerisch", "neblig",
  "eisig", "heiter", "bewölkt", "das Duschgel",
  "das Deo", "die Nagelschere", "die Pinzette", "der Nachttisch",
  "der Hocker", "das Fensterbrett", "der Kleiderschrank",

  // ── the abstract tail, which is a different kind of mistake ───────────────
  //
  // Everything above is a CONCRETE noun a beginner's topic reached too far
  // for: a porcupine in the animal pack, a paperclip in the office pack. The
  // words below are not that. They are abstract and administrative vocabulary
  // sitting in packs called Common words 2, 3 and 4, Everyday basics, and
  // Useful words from real browsing — pack names that promise the opposite of
  // what these are.
  //
  // Found by asking which rung-1 words the spoken bank ranks rarer than
  // 15,000th and then reading the answer rather than acting on it, because
  // the answer is mostly wrong: die Tomate is 15,840th, die Gurke 16,188th,
  // die Bushaltestelle 16,363rd and die Hausaufgabe 30,984th, and every one
  // of those is a beginner's word that film dialogue simply has no occasion
  // to say. Eighty-seven words came back and roughly a quarter of them
  // belonged here; the rest are staying exactly where they are. That ratio is
  // the reason this file is a list and not a threshold.
  //
  // What these have in common is not rarity, which is why frequency found
  // them only by accident: die Umsetzung, die Anforderung and der Landkreis
  // are ordinary words in a German office or council letter. They are simply
  // nobody's first three hundred, and a course that opens with them is
  // teaching the register of a form before the register of a conversation.
  "die Anforderung", "die Umsetzung", "der Landkreis", "die Nutzung",
  "die Integration", "das Zutun", "die Augenhöhe",
  "europäisch", "individuell", "konkret", "kollektiv", "optimal",
  "verabscheuen", "angewidert", "zusammenhängen", "begründen",
  "sich mit etwas auskennen", "jemandem etwas zutrauen", "missverstehen",

  // ── and the same tail among the words the bank cannot see at all ──────────
  //
  // The bank is a 6,314-word subset, so a word missing from it carries no
  // evidence either way: sprechen is absent from it, and so are der Bär,
  // putzen, die Soße and der Cousin. Eighty-nine unranked words sit on rung
  // one and the great majority of them belong there.
  //
  // These do not, and they are the same kind of thing as the group above —
  // the register of a company report or a deli counter, not of a first
  // conversation. Read one by one, because there was nothing else to read:
  // no rank, no corpus count, only the word and the pack that claimed it.
  "das Unternehmen", "der Betrieb", "die Hochschule", "der Teamkollege",
  "fördern", "jeweilig", "sogenannt", "landesweit", "nahtlos", "anstelle",
  "zusammentragen", "die Absicht", "fällen", "durchdrehen", "zweisprachig",
  "sich etwas angewöhnen", "mit jemandem mitfühlen", "das Premium-Abo",
  "die Frischetheke", "der Kilopreis", "der Stückpreis", "die Rohmilch",
  "das Körnerbrötchen", "der Brotlaib",
]);
