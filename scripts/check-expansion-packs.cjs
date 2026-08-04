const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const result = esbuild.buildSync({
  stdin: {
    contents: `
      export { allPartBlueprints } from "./src/lib/data.ts";
      export { buildBundledParts } from "./src/lib/contentBank.ts";
      export { CURRICULUM_ORDER, packMeta } from "./src/lib/curriculum.ts";
    `,
    resolveDir: root,
    sourcefile: "expansion-pack-check-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

const compiled = new Module("expansion-pack-check", module);
compiled.filename = path.join(root, ".expansion-pack-check.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(result.outputFiles[0].text, compiled.filename);

const { allPartBlueprints, buildBundledParts, CURRICULUM_ORDER, packMeta } = compiled.exports;

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const normalise = (text) => String(text ?? "")
  .normalize("NFKC")
  .trim()
  .replace(/[“”„]/g, '"')
  .replace(/\s+/g, " ")
  .toLocaleLowerCase("de-DE");

const expected = {
  part151: {
    theme: "Online safety, scams and account recovery",
    fixture: "Gib niemandem deinen Bestätigungscode.",
  },
  part152: {
    theme: "Telling a story clearly: what happened next",
    fixture: "Es stellte sich heraus, dass wir am falschen Eingang gewartet hatten.",
  },
  part153: {
    theme: "Board games, tabletop RPGs and taking turns",
    fixture: "Wessen Zug ist es?",
  },
  part154: {
    theme: "DIY tools and fixing things at home",
    fixture: "Prüf mit der Wasserwaage, ob es gerade ist.",
  },
  part155: {
    theme: "At the bakery, deli counter and weekly market",
    fixture: "Darf's ein bisschen mehr sein?",
  },
  part156: {
    theme: "At the drugstore: toiletries, laundry and photos",
    fixture: "Gibt es das auch als Reisegröße?",
  },
  part157: {
    theme: "Talking to your pets",
    fixture: "Komm, wir gehen Gassi.",
  },
  part158: {
    theme: "Everyday spoken German: the little phrases people actually use",
    fixture: "Sag mal, hast du kurz Zeit?",
  },
  part159: {
    theme: "Everyday practical gaps: getting normal things sorted",
    fixture: "Bleibt es bei heute Abend?",
  },
  part160: {
    theme: "Everyday conversation essentials: common replies, check-ins and quick plans",
    fixture: "Klingt nach einem Plan.",
  },
  part161: {
    theme: "Essential conversation skills: choosing, asking, apologising and setting boundaries",
    fixture: "Hast du einen Moment?",
  },
  part162: {
    theme: "Meeting people naturally: follow-ups, interests and recommendations",
    fixture: "Woher kennt ihr euch?",
  },
  part163: {
    theme: "Talking about experience: ever, never, yet and how long",
    fixture: "Hast du das schon mal gemacht?",
  },
  part164: {
    theme: "Explaining why: reasons, purpose and what happened as a result",
    fixture: "Wie kommt das?",
  },
  part165: {
    theme: "Talking about habits: how often, what is normal and what has changed",
    fixture: "Wie oft machst du das?",
  },
  part166: {
    theme: "Everyday things: finding, borrowing, sharing and putting them away",
    fixture: "Wo kommt das hin?",
  },
  part167: {
    theme: "Identifying people and things: which one, where it is and what it looks like",
    fixture: "Welchen meinst du?",
  },
  part168: {
    theme: "Everyday amounts: enough, too much, what is left and how to share it",
    fixture: "Das kommt ungefähr hin.",
  },
  part169: {
    theme: "Thinking, knowing and remembering: everyday ways to handle information",
    fixture: "Da lag ich wohl falsch.",
  },
  part170: {
    theme: "Getting things done together: starting, waiting, finishing and following up",
    fixture: "Sag mir Bescheid, wenn du fertig bist.",
  },
  part171: {
    theme: "Keeping conversations moving: updates, reactions and follow-up questions",
    fixture: "Ich halte dich auf dem Laufenden.",
  },
  part172: {
    theme: "Strom, Gas und die Heizkosten",
    fixture: "Der Strom ist weg — ist die Sicherung raus?",
  },
  part173: {
    theme: "Essen mit Einschränkungen",
    fixture: "Ich habe eine Unverträglichkeit, keine Allergie.",
  },
  part174: {
    theme: "False friends — words that trap English speakers",
    fixture: "Wir kommen eventuell etwas später.",
  },
  part175: {
    theme: "Sayings Germans actually use",
    fixture: "Er muss immer seinen Senf dazugeben.",
  },
  part176: {
    theme: "Tja, Igitt, Juhu — the sounds Germans make",
    fixture: "Tja, da kann man nichts machen.",
  },
  part177: {
    theme: "WG, Azubi, LKW — the abbreviations Germans speak",
    fixture: "Ich wohne in einer WG.",
  },
  part178: {
    theme: "Beim Friseur: describing the cut you actually want",
    fixture: "Nur die Spitzen, bitte.",
  },
  part179: {
    theme: "Der Umzug: boxes, vans and settling in",
    fixture: "Hast du schon Kartons besorgt?",
  },
  part180: {
    theme: "Weather that changes your plans: Glatteis, Schauer und Hitzewelle",
    fixture: "Pass auf, heute Morgen ist es glatt draußen.",
  },
  part181: {
    theme: "Fitnessstudio und Verein: signing up and sticking at it",
    fixture: "Kann ich ein Probetraining machen?",
  },
  part182: {
    theme: "Cooking a recipe through: schälen, anbraten, abschmecken",
    fixture: "Kannst du die Nudeln abgießen?",
  },
  part183: {
    theme: "Das Auto im Alltag: tanken, Werkstatt und geblitzt",
    fixture: "Ich bin geblitzt worden.",
  },
  part184: {
    theme: "Der Notfall: 112, Erste Hilfe und die Notaufnahme",
    fixture: "Es ist ein Unfall passiert.",
  },
  part185: {
    theme: "Beim Zahnarzt: Vorsorge, Füllung und das kurze Piksen",
    fixture: "Einmal ausspülen, bitte.",
  },
  part186: {
    theme: "Kita und Schule: Schultüte, Pausenbrot und Elternabend",
    fixture: "Zur Einschulung bekommt jedes Kind eine Schultüte.",
  },
  part187: {
    theme: "Geld überweisen: IBAN, Verwendungszweck und die Mahnung",
    fixture: "Vergiss den Verwendungszweck nicht, sonst kann ich es nicht zuordnen.",
  },
  part188: {
    theme: "Versicherungen: Haftpflicht, Hausrat und der Schadensfall",
    fixture: "Ich habe einen Schaden zu melden.",
  },
  part189: {
    theme: "Amt, Ausweis und Formulare: zuständig oder nicht",
    fixture: "Dafür sind wir nicht zuständig, das macht das Landratsamt.",
  },
  part190: {
    theme: "Geburtstag feiern: Ständchen, Kerzen und reinfeiern",
    fixture: "Puste alle Kerzen auf einmal aus!",
  },
  part191: {
    theme: "Im Hotel: buchen, einchecken und das laute Zimmer",
    fixture: "Bis wann kann ich kostenlos stornieren?",
  },
  part192: {
    theme: "Krank zu Hause: auskurieren, Hühnersuppe und der Damm",
    fixture: "Mich hat es jetzt auch erwischt.",
  },
  part193: {
    theme: "Draußen im Park und am See: die Runde, die Decke, das Eis",
    fixture: "Komm, wir drehen eine Runde durch den Park.",
  },
  part194: {
    theme: "Die Wohnung einrichten: Flohmarkt, Glühbirnen und das ewige Regal",
    fixture: "Die Glühbirne im Flur ist durchgebrannt.",
  },
  part195: {
    theme: "Über Deutsch reden: wenn das Wort nicht kommen will",
    fixture: "Es liegt mir auf der Zunge.",
  },
  part196: {
    theme: "Im Supermarkt: der Chip, das Pfand und die SB-Kasse",
    fixture: "Hast du einen Chip für den Einkaufswagen?",
  },
  part197: {
    theme: "Zusammen sein: Jahrestag, Kosenamen und Händchen halten",
    fixture: "Morgen ist unser Jahrestag, hast du daran gedacht?",
  },
  part198: {
    theme: "Feiertage: Silvester, Weihnachten und Ostern",
    fixture: "Zwischen den Jahren machen wir gar nichts.",
  },
  part199: {
    theme: "Termine jonglieren: absagen, verschieben und doch noch treffen",
    fixture: "Mir ist leider etwas dazwischengekommen.",
  },
  part200: {
    theme: "Pendeln und Bahn fahren: Anschluss, Zugbindung und der Ruhebereich",
    fixture: "Das Pendeln schlaucht mehr, als man denkt.",
  },
  part201: {
    theme: "Garten und Balkon: gießen, jäten und der Krieg mit den Schnecken",
    fixture: "Die Schnecken haben den halben Salat gefressen.",
  },
  part202: {
    theme: "Fahrrad fahren: Platten, Kette und der endende Radweg",
    fixture: "Ich habe einen Platten, hinten ist die Luft raus.",
  },
  part203: {
    theme: "Wäsche waschen: sortieren, schleudern und die rote Socke",
    fixture: "Eine rote Socke, und die ganze Wäsche ist rosa.",
  },
  part204: {
    theme: "Schwimmbad und Sauna: Bahnen, Pommes und der Aufguss",
    fixture: "Sie hat gerade ihr Seepferdchen gemacht.",
  },
  part205: {
    theme: "Mülltrennung: der Gelbe Sack, die Biotonne und der Pizzakarton",
    fixture: "Der Joghurtbecher muss nicht gespült sein — löffelrein reicht.",
  },
  part206: {
    theme: "WG und Haushalt teilen: Putzplan, Kühlschrankfach und wer dran ist",
    fixture: "Wer meinen Joghurt isst, schreibt ihn bitte auf die Einkaufsliste.",
  },
  part207: {
    theme: "In der Warteschleife: Hotlines, Ansagen und endlich ein Mensch",
    fixture: "Bitte bleiben Sie dran, der nächste freie Mitarbeiter ist gleich für Sie da.",
  },
  part208: {
    theme: "Floskeln: die kleinen Antworten, die Gespräche tragen",
    fixture: "Schönes Wochenende! — Danke, gleichfalls!",
  },
  part209: {
    theme: "Nein sagen mit Stil: freundlich, aber bestimmt",
    fixture: "Das ist lieb gemeint, aber nichts für mich.",
  },
  part210: {
    theme: "In der Arztpraxis: Überweisung, Wartezimmer und nüchtern kommen",
    fixture: "Zur Blutabnahme kommen Sie bitte nüchtern.",
  },
  part211: {
    theme: "Homeoffice und Videokonferenz: du bist auf stumm",
    fixture: "Du bist auf stumm!",
  },
  part212: {
    theme: "Nachbarschaftshilfe: Pakete, Schlüssel und eine Tasse Zucker",
    fixture: "Nimmst du mein Paket an, wenn ich nicht da bin?",
  },
  part213: {
    theme: "Oma und Opa: Kuchen, Fotoalben und die goldene Hochzeit",
    fixture: "Mit über achtzig ist sie noch erstaunlich rüstig.",
  },
  part214: {
    theme: "Im Kino: Reihe zwölf, Popcorn gemischt und der Abspann",
    fixture: "Ich schaue Filme am liebsten in der Originalfassung.",
  },
  part215: {
    theme: "Flohmarkt: feilschen, stöbern und der letzte Preis",
    fixture: "Was ist der letzte Preis?",
  },
  part216: {
    theme: "Baby und Kleinkind: wickeln, zahnen und der heilige Mittagsschlaf",
    fixture: "Beim Zahnen ist die Nacht kurz.",
  },
  part217: {
    theme: "Camping: Heringe, Stockbrot und der Sternenhimmel",
    fixture: "Beim Aufbauen fehlt am Ende immer ein Hering.",
  },
  part218: {
    theme: "Krankenhausbesuch: Station drei, Zimmer zwölf",
    fixture: "Die Operation ist gut verlaufen.",
  },
  part219: {
    theme: "Die Steuererklärung: absetzen, Elster und der Schuhkarton",
    fixture: "Die Fahrten zur Arbeit setzt du über die Pendlerpauschale ab.",
  },
  part220: {
    theme: "Im Blumenladen: einen Strauß binden lassen",
    fixture: "Schneide die Stiele schräg an, dann halten sie länger.",
  },
  part221: {
    theme: "Glückwünsche: zur Prüfung, zur Geburt, zum Einzug",
    fixture: "Nachwuchs ist unterwegs? Herzlichen Glückwunsch!",
  },
  part222: {
    theme: "Musik machen: Tonleitern, Lampenfieber und der Applaus",
    fixture: "Vor dem Vorspielen habe ich immer Lampenfieber.",
  },
  part223: {
    theme: "Kleidung und Anprobe: sitzt wie angegossen",
    fixture: "Wie sitzt die Hose? — Wie angegossen.",
  },
  part224: {
    theme: "Wandern: Höhenmeter, Gipfelkreuz und die Abkürzung, die keine war",
    fixture: "Die Abkürzung war natürlich keine.",
  },
  part225: {
    theme: "Reklamieren im Restaurant: freundlich, deutlich, gelöst",
    fixture: "Da ist tatsächlich ein Haar in der Suppe.",
  },
  part226: {
    theme: "In der Apotheke: Beipackzettel, Generikum und der Notdienst",
    fixture: "Zu Risiken und Nebenwirkungen fragen Sie Ihre Ärztin oder Apothekerin.",
  },
  part227: {
    theme: "In der Bücherei: Leihfrist, Mahngebühr und die Onleihe",
    fixture: "Die Leihfrist beträgt vier Wochen.",
  },
  part228: {
    theme: "Im Museum: Audioguide, Sonderausstellung und der Shop am Ausgang",
    fixture: "Der Ausgang führt natürlich durch den Museumsshop.",
  },
  part229: {
    theme: "Den Führerschein machen: Fahrstunden, Schulterblick und der große Tag",
    fixture: "Beim Anfahren am Berg würge ich den Motor ab.",
  },
  part230: {
    theme: "Prüfungen und Lernen: Karteikarten, Eselsbrücken und der Blackout",
    fixture: "Eselsbrücken sind albern und genau deshalb unvergesslich.",
  },
  part231: {
    theme: "Lüften und Heizen: die deutsche Wissenschaft vom Raumklima",
    fixture: "Fünf Minuten Durchzug bringen mehr als den ganzen Tag auf Kipp.",
  },
  part232: {
    theme: "Kleinanzeigen: Ist das noch da?",
    fixture: "Ist das noch da?",
  },
  part233: {
    theme: "Beim Metzger: Aufschnitt, halb und halb und die Scheibe auf die Hand",
    fixture: "Darf es etwas mehr sein? — Ja, passt schon.",
  },
  part234: {
    theme: "Im Zoo: Fütterung, Streichelzoo und das weise Faultier",
    fixture: "Das Faultier hat das Leben verstanden.",
  },
  part235: {
    theme: "Karneval und Fasching: Alaaf, Helau und Kamelle",
    fixture: "In Köln ruft man Alaaf, in Düsseldorf Helau.",
  },
  part236: {
    theme: "Aberglaube: auf Holz klopfen und bloß nicht verschreien",
    fixture: "Anstoßen immer mit Blickkontakt — sonst sieben Jahre Pech.",
  },
  part237: {
    theme: "Briefe und E-Mails: Sehr geehrte, anbei und der fehlende Anhang",
    fixture: "Der Anhang fehlt — die berühmteste Mail-Panne der Welt.",
  },
  part238: {
    theme: "Bezahlen im Lokal: getrennt oder zusammen — und stimmt so",
    fixture: "Dreißig — stimmt so.",
  },
  part239: {
    theme: "Volksfest und Kirmes: Riesenrad, Zuckerwatte und die Losbude",
    fixture: "An der Losbude gewinnt am Ende immer die Bude.",
  },
  part240: {
    theme: "Lotto: sechs Richtige, die Tippgemeinschaft und der Traum",
    fixture: "Beim Rubbellos gewinnt man meistens: noch ein Rubbellos.",
  },
  part241: {
    theme: "Sternzeichen: typisch Steinbock und Merkur ist rückläufig",
    fixture: "Merkur ist rückläufig — daran liegt es bestimmt.",
  },
  part242: {
    theme: "Die Fahrgemeinschaft: Spritgeld, Musikhoheit und Schweigen vor acht",
    fixture: "Bei uns gilt: Wer fährt, bestimmt die Musik.",
  },
  part243: {
    theme: "Das Klassentreffen: Namensschilder, Anekdoten und der harte Kern",
    fixture: "Du hast dich kaum verändert!",
  },
  part244: {
    theme: "Reacting to everyday news: surprise, sympathy, relief and what happens next",
    fixture: "Das sind ja gute Nachrichten!",
  },
  part245: {
    theme: "Der Sprachkurs: Einstufungstest, Niveau B1 und die Prüfung",
    fixture: "Fehler machen gehört dazu — sonst lernt man nichts.",
  },
  part246: {
    theme: "Streaming und Serien: noch eine Folge, dann wirklich Schluss",
    fixture: "Nur noch eine Folge — sagte ich vor drei Stunden.",
  },
  part247: {
    theme: "Wohnungssuche: Warmmiete, Schufa und die Besichtigung mit vierzig Leuten",
    fixture: "Steht da Kaltmiete oder Warmmiete?",
  },
  part248: {
    theme: "In der Kneipe: vom Fass, der Deckel und die letzte Runde",
    fixture: "Ein Bier vom Fass, bitte.",
  },
  part249: {
    theme: "Hochzeit feiern: Polterabend, das Ja-Wort und der Eröffnungstanz",
    fixture: "Dann kommt das Ja-Wort — und alle halten die Luft an.",
  },
  part250: {
    theme: "Beim Tierarzt: Impfpass, Krallen schneiden und der Katzenkorb",
    fixture: "Sobald der Katzenkorb rauskommt, ist die Katze verschwunden.",
  },
  part251: {
    theme: "Putzen: der Wischmopp, der Kalk und die Grundreinigung",
    fixture: "Fenster putzt man am besten bei bewölktem Himmel.",
  },
  part252: {
    theme: "Fußball schauen: Anpfiff, Abseits und der Elfmeter",
    fixture: "Das war doch klares Abseits!",
  },
  part253: {
    theme: "Im Café: Milchschaum, zum Hierbleiben und der Stammplatz",
    fixture: "Zum Mitnehmen oder zum Hierbleiben?",
  },
  part254: {
    theme: "Küchengeräte: entkalken, die Sicherung und der Toaster mit Eigenleben",
    fixture: "Das war ein Kurzschluss — die Sicherung ist rausgeflogen.",
  },
  part255: {
    theme: "Die Ausbildung: Azubi, Berufsschule und übernommen werden",
    fixture: "Nicht jeder muss studieren — Ausbildung ist ein guter Weg.",
  },
  part256: {
    theme: "Wenn es Ärger gibt: Widerspruch, Anwalt und die Schlichtungsstelle",
    fixture: "Erst mal ruhig durchlesen — die klingen alle schlimmer, als sie sind.",
  },
  part257: {
    theme: "Smalltalk im Büro: Kaffeeküche, Montagsgesicht und Feierabend",
    fixture: "So, ich mache Feierabend.",
  },
  part258: {
    theme: "Hausversammlung: Hausgeld, Umlage und die Mieterhöhung",
    fixture: "Wer nicht hingeht, beschwert sich hinterher am lautesten.",
  },
  part259: {
    theme: "Pakete: Packstation, Sendungsverfolgung und der Zettel im Briefkasten",
    fixture: "Im Briefkasten lag nur die Benachrichtigungskarte.",
  },
  part260: {
    theme: "Schlaf: durchschlafen, der Wecker und die verlorene Stunde",
    fixture: "Einschlafen geht, aber durchschlafen nicht.",
  },
  part261: {
    theme: "Gesund essen: Portionen, Zucker und der gute Vorsatz",
    fixture: "Verbieten hilft nichts, in Maßen essen schon.",
  },
  part262: {
    theme: "Beileid und Trauer: die richtigen Worte finden",
    fixture: "Du musst nichts sagen, ich bin einfach da.",
  },
  part263: {
    theme: "Handyvertrag: Datenvolumen, Verlängerung und das gesprungene Display",
    fixture: "Mein Datenvolumen ist am Zwanzigsten schon aufgebraucht.",
  },
  part264: {
    theme: "Nichts vergessen: Zettel, Kalender und die Erinnerung im Handy",
    fixture: "Schreib es auf, sonst ist es weg.",
  },
  part265: {
    theme: "Das Vorstellungsgespräch: Stärken, Schwächen und die Gehaltsfrage",
    fixture: "Nenne eine Spanne, keine einzelne Zahl.",
  },
  part266: {
    theme: "Geld leihen: unter Freunden, mit Frist und ohne Groll",
    fixture: "Geliehen ist geliehen, geschenkt ist geschenkt.",
  },
  part267: {
    theme: "Winterreifen: von O bis O, Einlagern und das Profil",
    fixture: "Von O bis O — von Oktober bis Ostern.",
  },
  part268: {
    theme: "Elternabend und Elterngespräch: Noten, Nachhilfe und die Empfehlung",
    fixture: "Nachhilfe ist keine Niederlage.",
  },
  part300: {
    theme: "Grillen: Holzkohle, der Grillmeister und wer was mitbringt",
    fixture: "Warte auf die Glut, nicht auf die Flamme.",
  },
  part301: {
    theme: "Gebrauchtwagen kaufen: Probefahrt, Scheckheft und der TÜV",
    fixture: "Ist der Wagen scheckheftgepflegt?",
  },
  part302: {
    theme: "Kinderkrankheiten: Windpocken, Fieber und der Kinderarzt",
    fixture: "Sie darf erst wieder hin, wenn sie vierundzwanzig Stunden fieberfrei ist.",
  },
  part303: {
    theme: "Internet kaputt: Router, Störung und der Techniker kommt",
    fixture: "Liegt es am WLAN oder an der Leitung?",
  },
  part304: {
    theme: "Komplimente machen: Das steht dir, du strahlst ja",
    fixture: "Nimm das Kompliment einfach an.",
  },
  part305: {
    theme: "Wenn eine Beziehung endet: Trennung, Umzug und weiter",
    fixture: "Ein Neuanfang ist kein Scheitern.",
  },
  part306: {
    theme: "Haus kaufen: Eigenkapital, Notartermin und die Nebenkosten",
    fixture: "Rechne lieber mit fünfzehn Prozent Nebenkosten.",
  },
  part307: {
    theme: "Renovieren: streichen, tapezieren und alles abkleben",
    fixture: "Erst mal alles abkleben, das ist die halbe Arbeit.",
  },
  part308: {
    theme: "Fotografieren: Gruppenfoto, Gegenlicht und einmal ohne Blinzeln",
    fixture: "Auf drei, und bitte nicht blinzeln!",
  },
  part309: {
    theme: "Ein Haustier anschaffen: Tierheim, Verantwortung und wer geht raus",
    fixture: "Wer geht raus, wenn es im November regnet?",
  },
  part310: {
    theme: "Die Handwerkerrechnung: Stundenlohn, Anfahrt und der Kostenvoranschlag",
    fixture: "Machen Sie mir bitte einen Kostenvoranschlag.",
  },
  part311: {
    theme: "Kirche im Alltag: Taufe, Konfirmation und die Kirchensteuer",
    fixture: "Die Kirchensteuer steht auf jeder Gehaltsabrechnung.",
  },
  part312: {
    theme: "Ausgehen und trinken: Weinkarte, Absacker und die letzte Bahn",
    fixture: "Trocken oder lieblich?",
  },
  part313: {
    theme: "Ehrenamt: Feuerwehr, Tafel und wer sonst noch mitmacht",
    fixture: "Bei uns ist die Feuerwehr komplett freiwillig.",
  },
  part314: {
    theme: "Beim Herrenfriseur: die Seiten kurz, oben lassen",
    fixture: "Die Seiten kurz, oben lassen.",
  },
  part315: {
    theme: "Unwetter: Starkregen, Sturmwarnung und der volle Keller",
    fixture: "Der Keller ist vollgelaufen.",
  },
  part316: {
    theme: "Digitaler Papierkram: Passwort vergessen, Update und Cookie-Banner",
    fixture: "Schau mal im Spam-Ordner nach.",
  },
  part317: {
    theme: "Über Sprachen reden: wörtlich übersetzt und falsche Freunde",
    fixture: "Wörtlich übersetzt ergibt das keinen Sinn.",
  },
  part318: {
    theme: "In Rente gehen: Rentenbescheid, Abschlag und der letzte Arbeitstag",
    fixture: "Früher gehen kostet Abschläge, jeden Monat.",
  },
  part319: {
    theme: "Kinder und Bildschirme: Medienzeit, das erste Handy und YouTube",
    fixture: "Regeln gelten für alle, auch für uns.",
  },
  part320: {
    theme: "Nachhaltig im Alltag: Ökostrom, Mehrweg und reparieren statt wegwerfen",
    fixture: "Kaputt heißt nicht automatisch weg.",
  },
  part321: {
    theme: "Physiotherapie und Reha: sechs Termine, Übungen für zu Hause",
    fixture: "Die Übungen für zu Hause macht kaum jemand.",
  },
  part322: {
    theme: "Arbeitsrecht: Betriebsrat, Abmahnung und das Arbeitszeugnis",
    fixture: "Unterschreib nichts sofort, auch keine Abmahnung.",
  },
  part323: {
    theme: "Gäste bewirten: Menü planen, Allergien und alles am Vortag",
    fixture: "Koch nichts, was du zum ersten Mal machst.",
  },
  part324: {
    theme: "Briefe verschicken: Briefmarke, Einwurf-Einschreiben und der Kasten an der Ecke",
    fixture: "Auf dem Kasten steht, wann die nächste Leerung ist.",
  },
  part325: {
    theme: "Eine Feier planen: Gästeliste, Zusagen und die Torte",
    fixture: "Die Gästeliste wächst wie von selbst.",
  },
  part326: {
    theme: "Krank im Job: der gelbe Schein, Lohnfortzahlung und wieder zurück",
    fixture: "Ab dem dritten Tag brauchst du ein Attest.",
  },
  part327: {
    theme: "Skiurlaub: Skipass, Piste und der Schnee, der nicht liegt",
    fixture: "Blaue Piste heißt leicht, rote mittel, schwarze schwer.",
  },
  part328: {
    theme: "Krankenkasse: gesetzlich, privat und der Zusatzbeitrag",
    fixture: "Die Leistungen sind bei allen Kassen fast gleich.",
  },
  part329: {
    theme: "Streit mit den Nachbarn: Lärm, Gespräch und die Hausordnung",
    fixture: "Such zuerst das Gespräch, nicht den Anwalt.",
  },
  part330: {
    theme: "Buchstabieren am Telefon: A wie Anton, Umlaute und der Bindestrich",
    fixture: "Meier kann man auf vier Arten schreiben.",
  },
  part331: {
    theme: "Auf dem Wochenmarkt: Marktstand, Saisonware und ein Stück zum Probieren",
    fixture: "Probieren Sie mal, die sind ganz süß.",
  },
  part332: {
    theme: "Im Tanzkurs: Grundschritt, führen und folgen und der Abschlussball",
    fixture: "Standard und Latein sind zwei verschiedene Welten.",
  },
  part333: {
    theme: "Theater und Oper: Premiere, Parkett und die Pause im Foyer",
    fixture: "Der Beifall wollte gar nicht aufhören.",
  },
  part334: {
    theme: "Flug gestrichen: umbuchen, Entschädigung und das Gepäck, das nicht kam",
    fixture: "Die Ausgleichszahlung liegt zwischen 250 und 600 Euro.",
  },
  part335: {
    theme: "Mit dem Zug quer durchs Land: Platzreservierung, Speisewagen und der Nachtzug",
    fixture: "Heute fährt der Zug in umgekehrter Wagenreihung.",
  },
  part336: {
    theme: "Beim Friseur: waschen, schneiden und der Blick in den Spiegel",
    fixture: "Trinkgeld beim Friseur ist üblich, aber freiwillig.",
  },
  part337: {
    theme: "Platter Reifen: Flickzeug, Kette und die Fahrradwerkstatt",
    fixture: "Öl die Kette, dann quietscht es nicht mehr.",
  },
  part338: {
    theme: "Ein Tag in der Therme: Bademantel, Solebecken und die Ruhezone",
    fixture: "Das Solebecken trägt dich fast von allein.",
  },
  part339: {
    theme: "Beim Optiker: Sehtest, Fassung und die erste Gleitsichtbrille",
    fixture: "Die Gleitsichtbrille hat drei Zonen in einem Glas.",
  },
  part340: {
    theme: "Krank am Wochenende: 116117, Bereitschaftsdienst und die Notdienst-Apotheke",
    fixture: "Für Lebensgefahr gibt es die 112, für alles andere die 116117.",
  },
  part341: {
    theme: "Die Kita-Suche: Platz, Tagesmutter und Betreuungszeiten",
    fixture: "Die Platzvergabe folgt Punkten, nicht dem Zufall.",
  },
  part342: {
    theme: "Schuhe kaufen und zum Schuster bringen: Größe, Absatz und neue Sohlen",
    fixture: "Nachmittags sind die Füße etwas dicker.",
  },
  part343: {
    theme: "Durch die Waschstraße: Programm wählen, Antenne rein und stehen bleiben",
    fixture: "Gang raus, Motor an, Hände weg vom Lenkrad.",
  },
  part344: {
    theme: "Im Fundbüro: verloren, gefunden und der Finderlohn",
    fixture: "Drei bis fünf Prozent sind der übliche Finderlohn.",
  },
  part345: {
    theme: "In der Änderungsschneiderei: kürzen, enger machen und der neue Reißverschluss",
    fixture: "Der alte Saum bleibt als Reserve drin.",
  },
  part346: {
    theme: "Das E-Auto laden: Ladesäule, Ladekarte und die Frage nach der Reichweite",
    fixture: "Wer die Säule blockiert, zahlt Blockiergebühr.",
  },
  part347: {
    theme: "Der Schrebergarten: Parzelle, Laube und die Gartenordnung",
    fixture: "Gekauft wird die Laube, gepachtet der Boden.",
  },
  part348: {
    theme: "Im Baumarkt: Dübel, Zuschnitt und das Gerät zum Leihen",
    fixture: "Welchen Dübel brauche ich für eine Betonwand?",
  },
  part349: {
    theme: "Strom anmelden: Zählerstand, Abschlag und der Anbieterwechsel",
    fixture: "Ohne Anmeldung landest du in der Grundversorgung.",
  },
  part350: {
    theme: "Impfen gehen: Impfpass, Auffrischung und der kleine Piks",
    fixture: "Tetanus ist alle zehn Jahre fällig.",
  },
  part351: {
    theme: "Serienabend: Streaming-Abo, Folgen und Untertitel",
    fixture: "Nur noch eine Folge, versprochen.",
  },
  part352: {
    theme: "Winterdienst: Räumpflicht, Streugut und der Schneeschieber um sieben",
    fixture: "Streusalz ist in vielen Städten verboten.",
  },
  part353: {
    theme: "Der Handyvertrag: Datenvolumen, Mindestlaufzeit und die Nummer mitnehmen",
    fixture: "Nach dem Datenlimit wird gedrosselt.",
  },
  part354: {
    theme: "Panne auf der Straße: Warndreieck, Warnweste und der Pannendienst",
    fixture: "Zieh die Warnweste an, bevor du aussteigst.",
  },
  part359: {
    theme: "Wählen gehen: Wahlbenachrichtigung, Wahllokal und zwei Stimmen",
    fixture: "Die Zweitstimme entscheidet über die Sitze im Bundestag.",
  },
  part356: {
    theme: "Der Strafzettel: falsch geparkt, Bußgeld und der Einspruch",
    fixture: "Punkte kommen nach Flensburg.",
  },
  part358: {
    theme: "Aufs Standesamt: Anmeldung, Papiere und die Eheurkunde",
    fixture: "Ohne Standesamt gilt die Ehe nicht.",
  },
  part355: {
    theme: "Heuschnupfen: Pollenflug, juckende Augen und die Tablette am Morgen",
    fixture: "Wie ist heute der Pollenflug?",
  },
  part357: {
    theme: "Sperrmüll: das alte Sofa, die Anmeldung und der Wertstoffhof",
    fixture: "Rausstellen darfst du erst am Abend vorher.",
  },
  part362: {
    theme: "Das Gehaltsgespräch: Vorbereitung, Argumente und die Zahl zuerst",
    fixture: "Argumentiere mit Leistung, nicht mit deiner Miete.",
  },
  part360: {
    theme: "Blut spenden: Termin, Traubenzucker und der kleine Piks für andere",
    fixture: "Es gibt Kekse, Saft und Traubenzucker.",
  },
  part364: {
    theme: "Pflege in der Familie: Pflegegrad, Pflegedienst und Hilfe im Alltag",
    fixture: "Führ vorher eine Woche Pflegetagebuch.",
  },
  part363: {
    theme: "Den Job wechseln: Kündigungsschreiben, Resturlaub und das Arbeitszeugnis",
    fixture: "'Er war stets bemüht' ist eine Katastrophe.",
  },
  part365: {
    theme: "Der Schadensfall: melden, fotografieren und der Gutachter",
    fixture: "Fotografier alles, bevor du aufräumst.",
  },
  part361: {
    theme: "Der Erste-Hilfe-Kurs: stabile Seitenlage, Verbandskasten und keine Angst vorm Helfen",
    fixture: "Unterlassene Hilfeleistung ist strafbar.",
  },
  part368: {
    theme: "Kind krank: der Anruf aus der Kita, Kinderkrankentage und der Wadenwickel",
    fixture: "Vierundzwanzig Stunden fieberfrei, dann darf es wieder in die Kita.",
  },
  part366: {
    theme: "Der Reisepass: beantragen, das digitale Foto und der Chip",
    fixture: "Verlängern geht nicht — es gibt immer einen neuen Pass.",
  },
  part369: {
    theme: "Die Wohnungsübergabe: besenrein, das Protokoll und die Kaution",
    fixture: "Besenrein heißt: leer und gefegt, nicht geleckt.",
  },
  part370: {
    theme: "Die Haushaltshilfe: Probestunde, Minijob und der Haushaltsscheck",
    fixture: "Schwarzarbeit fliegt spätestens beim Unfall auf.",
  },
  part371: {
    theme: "Lebenslauf und Anschreiben: tabellarisch, die Lücke und ein einziges PDF",
    fixture: "Der deutsche Lebenslauf ist tabellarisch.",
  },
  part374: {
    theme: "Am Stück erzählen: längere Gesprächsbeiträge",
    fixture: "Lange Rede, kurzer Sinn: Wir haben es einfach gekauft.",
  },
  part372: {
    theme: "Gründe geben: weil, denn und nämlich",
    fixture: "Ich muss jetzt los, denn mein Zug fährt in zwanzig Minuten.",
  },
  part373: {
    theme: "Folgen und Gegensätze: deshalb, obwohl und trotzdem",
    fixture: "Einerseits ist die Wohnung teuer, andererseits spare ich mir den langen Weg.",
  },
  part367: {
    theme: "Mit dem Fernbus: Handyticket, Gepäckfach und die Pause an der Raststätte",
    fixture: "Die Fahrzeit ist geschätzt, nicht versprochen.",
  },
};

const newKeys = new Set(Object.keys(expected));
const newPhrases = [];
let totalSeeds = 0;
let totalDialogues = 0;

for (const [partKey, expectation] of Object.entries(expected)) {
  const pack = allPartBlueprints[partKey];
  const phrases = pack?.phrases ?? [];
  const seeds = pack?.seeds ?? [];
  const dialogues = pack?.dialogues ?? [];
  totalSeeds += seeds.length;
  totalDialogues += dialogues.length;
  newPhrases.push(...phrases.map((phrase) => ({ ...phrase, partKey })));

  check(`${partKey} exists with the intended theme`, pack?.theme === expectation.theme);
  check(`${partKey} contains substantial sentence practice`, phrases.length >= 28, `found ${phrases.length}`);
  check(`${partKey} adds a useful vocabulary set`, seeds.length >= 15, `found ${seeds.length}`);
  check(`${partKey} includes at least two complete dialogues`, dialogues.length >= 2, `found ${dialogues.length}`);
  check(
    `${partKey} phrases all have German, English and guidance`,
    phrases.every((phrase) => phrase.de?.trim() && phrase.en?.trim() && phrase.use?.trim())
  );
  check(`${partKey} keeps its regression fixture`, phrases.some((phrase) => phrase.de === expectation.fixture));
  check(
    `${partKey} appears exactly once in curriculum order`,
    CURRICULUM_ORDER.filter((key) => key === partKey).length === 1
  );
}

const newPhraseKeys = newPhrases.map((phrase) => normalise(phrase.de));
const duplicateNewKeys = newPhraseKeys.filter((key, index) => newPhraseKeys.indexOf(key) !== index);
const duplicateNewPhrases = newPhrases.filter((phrase) => duplicateNewKeys.includes(normalise(phrase.de)));
check(
  "new authored phrases are unique across all one hundred packs",
  duplicateNewKeys.length === 0,
  duplicateNewPhrases.map((phrase) => `${phrase.partKey}: ${phrase.de}`).join(" | ")
);

const existingGerman = new Set();
for (const [partKey, pack] of Object.entries(allPartBlueprints)) {
  if (newKeys.has(partKey)) continue;
  for (const phrase of pack.phrases ?? []) existingGerman.add(normalise(phrase.de));
  for (const dialogue of pack.dialogues ?? []) {
    for (const line of dialogue.lines ?? []) existingGerman.add(normalise(line.de));
  }
}
for (const pack of Object.values(buildBundledParts())) {
  for (const phrase of pack.phrases ?? []) existingGerman.add(normalise(phrase.de));
}

const duplicates = newPhrases.filter((phrase) => existingGerman.has(normalise(phrase.de)));
check(
  "new authored phrases do not exactly duplicate the existing hand-written catalog",
  duplicates.length === 0,
  duplicates.map((phrase) => `${phrase.partKey}: ${phrase.de}`).join(" | ")
);

check("the one hundred and ninety-three expansion packs contain at least 5835 authored phrases", newPhrases.length >= 5835, `found ${newPhrases.length}`);
check("the one hundred and ninety-three expansion packs contain at least 2981 vocabulary entries", totalSeeds >= 2981, `found ${totalSeeds}`);
check("the one hundred and ninety-three expansion packs contain at least 434 dialogues", totalDialogues >= 434, `found ${totalDialogues}`);
check("everyday-news reactions follow the conversation-update pack", CURRICULUM_ORDER.indexOf("part244") === CURRICULUM_ORDER.indexOf("part171") + 1);
check("everyday-news reactions stay in the core conversation tier", packMeta("part244").tier === 1);
check("storytelling follows the conversation-bridges pack", CURRICULUM_ORDER.indexOf("part152") === CURRICULUM_ORDER.indexOf("cb-conversation-bridges") + 1);
check("digital safety follows the modern-tech packs", CURRICULUM_ORDER.indexOf("part151") === CURRICULUM_ORDER.indexOf("part56") + 1);
check("DIY follows the apartment-repair pack", CURRICULUM_ORDER.indexOf("part154") === CURRICULUM_ORDER.indexOf("cb-apartment-repairs") + 1);
check("tabletop language follows the social-gaming packs", CURRICULUM_ORDER.indexOf("part153") === CURRICULUM_ORDER.indexOf("part149") + 1);
check("tabletop language is labelled as specialist game talk", packMeta("part153").tier === 3 && Boolean(packMeta("part153").note));
check("the drugstore pack follows clothes shopping", CURRICULUM_ORDER.indexOf("part156") === CURRICULUM_ORDER.indexOf("part63") + 1);
check("the bakery pack follows grocery shopping", CURRICULUM_ORDER.indexOf("part155") === CURRICULUM_ORDER.indexOf("cb-grocery") + 1);
check("both new everyday-shopping packs are tier one", packMeta("part155").tier === 1 && packMeta("part156").tier === 1);
check("pet-directed speech follows the existing pets and animals pack", CURRICULUM_ORDER.indexOf("part157") === CURRICULUM_ORDER.indexOf("part86") + 1);
check("pet-directed speech stays in the common situational tier", packMeta("part157").tier === 2);
check("spoken-glue practice follows the short-replies pack", CURRICULUM_ORDER.indexOf("part158") === CURRICULUM_ORDER.indexOf("cb-shortreplies") + 1);
check("spoken-glue practice is introduced in tier one", packMeta("part158").tier === 1);
check("everyday essentials follow spoken-glue practice", CURRICULUM_ORDER.indexOf("part160") === CURRICULUM_ORDER.indexOf("part158") + 1);
check("everyday essentials are introduced in tier one", packMeta("part160").tier === 1);
check("essential conversation skills follow everyday essentials", CURRICULUM_ORDER.indexOf("part161") === CURRICULUM_ORDER.indexOf("part160") + 1);
check("essential conversation skills are introduced in tier one", packMeta("part161").tier === 1);
check("natural getting-to-know-you practice follows essential conversation skills", CURRICULUM_ORDER.indexOf("part162") === CURRICULUM_ORDER.indexOf("part161") + 1);
check("natural getting-to-know-you practice is introduced in tier one", packMeta("part162").tier === 1);
check("experience practice follows natural getting-to-know-you practice", CURRICULUM_ORDER.indexOf("part163") === CURRICULUM_ORDER.indexOf("part162") + 1);
check("experience practice is introduced in tier one", packMeta("part163").tier === 1);
check("reason-and-result practice follows experience practice", CURRICULUM_ORDER.indexOf("part164") === CURRICULUM_ORDER.indexOf("part163") + 1);
check("reason-and-result practice is introduced in tier one", packMeta("part164").tier === 1);
check("habits-and-frequency practice follows reason-and-result practice", CURRICULUM_ORDER.indexOf("part165") === CURRICULUM_ORDER.indexOf("part164") + 1);
check("habits-and-frequency practice is introduced in tier one", packMeta("part165").tier === 1);
check("everyday-things practice follows habits-and-frequency practice", CURRICULUM_ORDER.indexOf("part166") === CURRICULUM_ORDER.indexOf("part165") + 1);
check("everyday-things practice is introduced in tier one", packMeta("part166").tier === 1);
check("identifying practice follows everyday-things practice", CURRICULUM_ORDER.indexOf("part167") === CURRICULUM_ORDER.indexOf("part166") + 1);
check("identifying practice is introduced in tier one", packMeta("part167").tier === 1);
check("amount-and-sharing practice follows identifying practice", CURRICULUM_ORDER.indexOf("part168") === CURRICULUM_ORDER.indexOf("part167") + 1);
check("amount-and-sharing practice is introduced in tier one", packMeta("part168").tier === 1);
check("thinking-and-remembering practice follows amount-and-sharing practice", CURRICULUM_ORDER.indexOf("part169") === CURRICULUM_ORDER.indexOf("part168") + 1);
check("thinking-and-remembering practice is introduced in tier one", packMeta("part169").tier === 1);
check("getting-things-done practice follows thinking-and-remembering practice", CURRICULUM_ORDER.indexOf("part170") === CURRICULUM_ORDER.indexOf("part169") + 1);
check("getting-things-done practice is introduced in tier one", packMeta("part170").tier === 1);
check("conversation-update practice follows getting-things-done practice", CURRICULUM_ORDER.indexOf("part171") === CURRICULUM_ORDER.indexOf("part170") + 1);
check("conversation-update practice is introduced in tier one", packMeta("part171").tier === 1);
check("practical-gap practice follows home and daily errands", CURRICULUM_ORDER.indexOf("part159") === CURRICULUM_ORDER.indexOf("part9") + 1);
check("practical-gap practice stays in the common situational tier", packMeta("part159").tier === 2);

const petPhrases = new Set((allPartBlueprints.part157?.phrases ?? []).map((phrase) => phrase.de));
const petCoverage = {
  commands: ["Sitz!", "Platz!", "Gib Pfötchen!", "Bei Fuß!"],
  walking: ["Komm, wir gehen Gassi.", "Musst du mal raus?", "Nicht auf die Straße!"],
  feeding: ["Willst du ein Leckerli?", "Das darfst du nicht fressen.", "Trink erst mal was."],
  affection: ["Braver Junge!", "Braves Mädchen!", "Fein gemacht!"],
  care: ["Zeig mal deine Pfote.", "Nicht lecken!", "Du musst jetzt deine Medizin nehmen."],
  vet: ["Wir fahren jetzt zum Tierarzt.", "Das piekst nur ganz kurz.", "Den Trichter musst du noch anlassen."],
};
for (const [area, fixtures] of Object.entries(petCoverage)) {
  check(`pet-directed pack covers ${area}`, fixtures.every((phrase) => petPhrases.has(phrase)));
}

const spokenPhrases = new Set((allPartBlueprints.part158?.phrases ?? []).map((phrase) => phrase.de));
const spokenCoverage = {
  reactions: ["Na ja.", "Tja.", "Eben.", "Nicht schlecht."],
  agreement: ["Find ich auch.", "Seh ich auch so.", "Seh ich anders.", "Da hast du schon recht."],
  particles: ["Komm doch rein.", "Dann machen wir das eben so.", "Was ist eigentlich los?"],
  timing: ["Ich bin gleich so weit.", "Ich bin noch unterwegs.", "Ich komme erst später."],
  messages: ["Bin in zehn Minuten da.", "Sag Bescheid, wenn du da bist.", "Komm gut nach Hause."],
  repair: ["Das habe ich nicht mitbekommen.", "Du hast mich falsch verstanden.", "Das ist nicht das, was ich gesagt habe."],
};
for (const [area, fixtures] of Object.entries(spokenCoverage)) {
  check(`spoken-glue pack covers ${area}`, fixtures.every((phrase) => spokenPhrases.has(phrase)));
}

const practicalPhrases = new Set((allPartBlueprints.part159?.phrases ?? []).map((phrase) => phrase.de));
const practicalCoverage = {
  home: ["Hast du den Herd ausgemacht?", "Kannst du die Tür abschließen?", "Das Wasser läuft nicht ab."],
  appointments: ["Könnten Sie mich auf die Warteliste setzen?", "Ich muss meinen Termin leider absagen."],
  transport: ["Ist der Anschluss noch zu schaffen?", "Muss ich die Fahrkarte noch entwerten?"],
  shopping: ["Das wurde mir zweimal berechnet.", "Am Regal war aber ein anderer Preis angegeben."],
  health: ["Ich bekomme schlecht Luft.", "Meine Beschwerden sind schlimmer geworden."],
  work: ["Bis wann brauchst du das?", "Ich habe keinen Zugriff auf die Datei."],
  plans: ["Bleibt es bei heute Abend?", "Kann ich noch jemanden mitbringen?"],
  phone: ["Ich kann dich kaum hören.", "Du bist noch stummgeschaltet."],
};
for (const [area, fixtures] of Object.entries(practicalCoverage)) {
  check(`practical-gap pack covers ${area}`, fixtures.every((phrase) => practicalPhrases.has(phrase)));
}

const everydayEssentialPhrases = new Set((allPartBlueprints.part160?.phrases ?? []).map((phrase) => phrase.de));
const everydayEssentialCoverage = {
  replies: ["Klar.", "Gerne.", "Mach ich.", "Schade."],
  warmth: ["Schön, dich zu sehen.", "Freut mich für dich.", "Das kann ich verstehen."],
  opinions: ["Was hältst du davon?", "Wie findest du das?", "Da bin ich mir nicht sicher."],
  smalltalk: ["Und, was machst du so?", "Was hast du heute noch vor?", "Wie war dein Wochenende?"],
  timing: ["Bin gleich zurück.", "Ich bin ein bisschen spät dran.", "Ich muss jetzt los."],
  messages: ["Ich ruf dich später an.", "Sag Bescheid, falls sich was ändert.", "Ich melde mich morgen."],
  plans: ["Passt dir morgen?", "Klingt nach einem Plan.", "Wollen wir los?"],
};
for (const [area, fixtures] of Object.entries(everydayEssentialCoverage)) {
  check(`everyday-essentials pack covers ${area}`, fixtures.every((phrase) => everydayEssentialPhrases.has(phrase)));
}

const essentialConversationPhrases = new Set((allPartBlueprints.part161?.phrases ?? []).map((phrase) => phrase.de));
const essentialConversationCoverage = {
  choices: ["Schwer zu sagen.", "Mir ist beides recht.", "Du entscheidest.", "Das ist mir lieber."],
  attention: ["Kann ich dich kurz sprechen?", "Hast du einen Moment?", "Lass mich kurz ausreden."],
  boundaries: ["Darüber möchte ich nicht reden.", "So kannst du nicht mit mir reden.", "Das geht mir zu weit."],
  apologies: ["Tut mir leid wegen vorhin.", "Das war keine Absicht.", "Kann passieren."],
  support: ["Das hört sich echt anstrengend an.", "Kann ich irgendwas tun?", "Du kannst jederzeit mit mir reden."],
  followups: ["Was meinst du?", "Was würdest du machen?", "Was ist denn passiert?"],
};
for (const [area, fixtures] of Object.entries(essentialConversationCoverage)) {
  check(`essential-conversation pack covers ${area}`, fixtures.every((phrase) => essentialConversationPhrases.has(phrase)));
}

const naturalMeetingPhrases = new Set((allPartBlueprints.part162?.phrases ?? []).map((phrase) => phrase.de));
const naturalMeetingCoverage = {
  meeting: ["Bist du von hier?", "Woher kennt ihr euch?", "Wie habt ihr euch kennengelernt?"],
  work: ["Arbeitest du oder studierst du?", "Was machst du genau?", "Wann hast du Feierabend?"],
  catchups: ["Wie geht's dir so?", "Wie war deine Woche bisher?", "Hast du schon Pläne fürs Wochenende?"],
  interests: ["Wofür interessierst du dich?", "Hörst du gern Podcasts?", "Hast du in letzter Zeit was Gutes gesehen?"],
  recommendations: ["Was kannst du empfehlen?", "Wie fandest du es?", "Würdest du es empfehlen?"],
  reactions: ["Davon habe ich schon gehört.", "Das schaue ich mir mal an.", "Da bin ich gespannt."],
};
for (const [area, fixtures] of Object.entries(naturalMeetingCoverage)) {
  check(`natural-meeting pack covers ${area}`, fixtures.every((phrase) => naturalMeetingPhrases.has(phrase)));
}

const experiencePhrases = new Set((allPartBlueprints.part163?.phrases ?? []).map((phrase) => phrase.de));
const experienceCoverage = {
  questions: ["Hast du das schon mal gemacht?", "Seit wann machst du das?", "Wie lange ist das her?"],
  familiar: ["Ja, schon mehrmals.", "Das habe ich schon öfter gemacht.", "Ich habe erst vor Kurzem damit angefangen."],
  never: ["Nein, noch nie.", "Dazu bin ich noch nicht gekommen.", "Bisher hatte ich noch keine Gelegenheit dazu."],
  timing: ["Das ist das erste Mal, dass ich das mache.", "Das letzte Mal ist schon lange her.", "Ich habe das seitdem nicht mehr gemacht."],
  reflection: ["Daran erinnere ich mich noch gut.", "Es war schwieriger als gedacht.", "Ich habe viel daraus gelernt."],
  nextTime: ["Ich würde das gern noch mal machen.", "Das müssen wir unbedingt wiederholen.", "Beim nächsten Mal bin ich dabei."],
};
for (const [area, fixtures] of Object.entries(experienceCoverage)) {
  check(`experience pack covers ${area}`, fixtures.every((phrase) => experiencePhrases.has(phrase)));
}

const reasonResultPhrases = new Set((allPartBlueprints.part164?.phrases ?? []).map((phrase) => phrase.de));
const reasonResultCoverage = {
  questions: ["Wie kommt das?", "Woran liegt das?", "Wieso hast du nichts gesagt?"],
  reasons: ["Weil ich keine Zeit hatte.", "Ich hatte keine andere Wahl.", "Es lag an einem Missverständnis."],
  purpose: ["Wofür brauchst du das?", "Damit ich nichts vergesse.", "Ich mache das nur zur Sicherheit."],
  results: ["Deshalb habe ich abgesagt.", "Deswegen hat es länger gedauert.", "Am Ende hat es trotzdem geklappt."],
  understanding: ["Das erklärt einiges.", "Das macht jetzt Sinn.", "Kein Wunder, dass du müde bist."],
};
for (const [area, fixtures] of Object.entries(reasonResultCoverage)) {
  check(`reason-and-result pack covers ${area}`, fixtures.every((phrase) => reasonResultPhrases.has(phrase)));
}

const habitsFrequencyPhrases = new Set((allPartBlueprints.part165?.phrases ?? []).map((phrase) => phrase.de));
const habitsFrequencyCoverage = {
  questions: ["Wie oft machst du das?", "Wie sieht ein normaler Tag bei dir aus?", "Hast du dafür eine feste Routine?"],
  frequent: ["Eigentlich jeden Tag.", "Fast jeden Tag.", "Ich mache das regelmäßig."],
  occasional: ["Ab und zu.", "Eher selten.", "So gut wie nie."],
  changes: ["Früher habe ich das öfter gemacht.", "Ich will mir das angewöhnen.", "Ich habe meine Routine geändert."],
  patterns: ["Das passiert mir immer wieder.", "Ich halte mich nicht immer daran.", "Heute mache ich mal eine Ausnahme."],
};
for (const [area, fixtures] of Object.entries(habitsFrequencyCoverage)) {
  check(`habits-and-frequency pack covers ${area}`, fixtures.every((phrase) => habitsFrequencyPhrases.has(phrase)));
}

const everydayThingsPhrases = new Set((allPartBlueprints.part166?.phrases ?? []).map((phrase) => phrase.de));
const everydayThingsCoverage = {
  finding: ["Wo hab ich das hingelegt?", "Da ist es ja!", "Schau mal in der Schublade nach."],
  borrowing: ["Kann ich mir das kurz ausleihen?", "Wann brauchst du es zurück?", "Pass bitte gut darauf auf."],
  supplies: ["Wir haben keine Milch mehr.", "Das müssen wir nachkaufen.", "Lass mir bitte noch etwas übrig."],
  remembering: ["Vergiss deine Schlüssel nicht.", "Ich hab's zu Hause liegen lassen.", "Hast du an alles gedacht?"],
  tidying: ["Wo kommt das hin?", "Kann das weg?", "Heb das bitte für mich auf."],
};
for (const [area, fixtures] of Object.entries(everydayThingsCoverage)) {
  check(`everyday-things pack covers ${area}`, fixtures.every((phrase) => everydayThingsPhrases.has(phrase)));
}

const identifyingPhrases = new Set((allPartBlueprints.part167?.phrases ?? []).map((phrase) => phrase.de));
const identifyingCoverage = {
  choosing: ["Welchen meinst du?", "Nein, den anderen.", "Such dir einen aus."],
  locating: ["Den da links.", "Ganz oben im Regal.", "Kannst du darauf zeigen?"],
  people: ["Wie sieht er aus?", "Sie trägt eine rote Jacke.", "Du erkennst sie sofort."],
  features: ["Es ist ungefähr so groß.", "Es ist aus Holz.", "Welche Farbe hat es?"],
  comparing: ["Das ist nicht ganz dasselbe.", "Woran erkennt man den Unterschied?", "Das sieht in echt anders aus."],
};
for (const [area, fixtures] of Object.entries(identifyingCoverage)) {
  check(`identifying pack covers ${area}`, fixtures.every((phrase) => identifyingPhrases.has(phrase)));
}

const amountSharingPhrases = new Set((allPartBlueprints.part168?.phrases ?? []).map((phrase) => phrase.de));
const amountSharingCoverage = {
  asking: ["Wie viel brauchst du?", "Wie viele brauchen wir?", "Ist noch genug da?"],
  enough: ["Das reicht völlig.", "Das müsste reichen.", "Nicht so viel, bitte."],
  remaining: ["Es ist fast nichts mehr da.", "Ist noch etwas übrig?", "Das reicht noch bis morgen."],
  sharing: ["Wir teilen uns das.", "Lass uns halbe-halbe machen.", "Heb mir bitte etwas auf."],
  estimating: ["Ungefähr die Hälfte.", "Etwa doppelt so viel.", "Das kommt ungefähr hin."],
};
for (const [area, fixtures] of Object.entries(amountSharingCoverage)) {
  check(`amount-and-sharing pack covers ${area}`, fixtures.every((phrase) => amountSharingPhrases.has(phrase)));
}

const thinkingRememberingPhrases = new Set((allPartBlueprints.part169?.phrases ?? []).map((phrase) => phrase.de));
const thinkingRememberingCoverage = {
  thinking: ["Ich glaube, wir haben genug.", "Da muss ich kurz überlegen.", "Wie würdest du das einschätzen?"],
  knowing: ["Weißt du, was ich meine?", "Soweit ich weiß, ja.", "Damit kenne ich mich nicht aus."],
  remembering: ["Ah, jetzt weiß ich es wieder.", "Ich hab's völlig vergessen.", "Kannst du mich später daran erinnern?"],
  understanding: ["Was genau war unklar?", "Kannst du das einfacher sagen?", "Warte, ich komme gerade nicht mit."],
  checking: ["Ist das so richtig?", "Da lag ich wohl falsch.", "Das lese ich noch mal nach."],
};
for (const [area, fixtures] of Object.entries(thinkingRememberingCoverage)) {
  check(`thinking-and-remembering pack covers ${area}`, fixtures.every((phrase) => thinkingRememberingPhrases.has(phrase)));
}

const gettingThingsDonePhrases = new Set((allPartBlueprints.part170?.phrases ?? []).map((phrase) => phrase.de));
const gettingThingsDoneCoverage = {
  starting: ["Bist du so weit?", "Womit sollen wir anfangen?", "Jetzt kann's losgehen."],
  waiting: ["Warte bitte einen Moment.", "Du musst dich nicht beeilen.", "Wie lange dauert das noch?"],
  progress: ["Wie kommst du voran?", "Ich bin fast fertig.", "Hat alles geklappt?"],
  responsibility: ["Darum kümmere ich mich.", "Kannst du das übernehmen?", "Brauchst du Hilfe dabei?"],
  followup: ["Wir machen später weiter.", "Wo waren wir?", "Sag mir Bescheid, wenn du fertig bist."],
};
for (const [area, fixtures] of Object.entries(gettingThingsDoneCoverage)) {
  check(`getting-things-done pack covers ${area}`, fixtures.every((phrase) => gettingThingsDonePhrases.has(phrase)));
}

const conversationUpdatePhrases = new Set((allPartBlueprints.part171?.phrases ?? []).map((phrase) => phrase.de));
const conversationUpdateCoverage = {
  asking: ["Na, wie ist es gelaufen?", "Gibt es inzwischen etwas Neues?", "Wie geht es jetzt weiter?"],
  updates: ["Bei mir ist gerade viel los.", "Ich halte dich auf dem Laufenden.", "Ich sag dir Bescheid, sobald ich mehr weiß."],
  reactions: ["Echt? Das wusste ich gar nicht.", "Oh nein, das tut mir leid.", "Das ist mir auch schon mal passiert."],
  followups: ["Und was ist dann passiert?", "Wie kam es denn dazu?", "Wie hast du dich dabei gefühlt?"],
  nextSteps: ["Warten wir erst mal ab.", "Das bekommen wir schon irgendwie hin.", "Dann schauen wir weiter."],
};
for (const [area, fixtures] of Object.entries(conversationUpdateCoverage)) {
  check(`conversation-update pack covers ${area}`, fixtures.every((phrase) => conversationUpdatePhrases.has(phrase)));
}

const everydayNewsPhrases = new Set((allPartBlueprints.part244?.phrases ?? []).map((phrase) => phrase.de));
const everydayNewsCoverage = {
  surprise: ["Ach, echt?", "Damit habe ich nicht gerechnet.", "Ach so, daher also."],
  celebrating: ["Das sind ja gute Nachrichten!", "Das freut mich wirklich für dich.", "Darauf müssen wir anstoßen."],
  sympathy: ["Oh nein, wie blöd.", "Das tut mir leid zu hören.", "Hoffentlich wird es bald besser."],
  relief: ["Hauptsache, du bist okay.", "Da fällt mir ein Stein vom Herzen.", "Jetzt bin ich aber beruhigt."],
  nextSteps: ["Wann weißt du mehr?", "Halt mich auf dem Laufenden.", "Meld dich, wenn du etwas brauchst."],
  storyFollowups: ["Was hat er dann gesagt?", "Und wie hast du reagiert?", "Wie ging es dann weiter?"],
};
for (const [area, fixtures] of Object.entries(everydayNewsCoverage)) {
  check(`everyday-news pack covers ${area}`, fixtures.every((phrase) => everydayNewsPhrases.has(phrase)));
}

if (failures) {
  console.error(`\n${failures} expansion-pack regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log(`\n${newPhrases.length} phrases, ${totalSeeds} vocabulary seeds and ${totalDialogues} dialogues are guarded`);
