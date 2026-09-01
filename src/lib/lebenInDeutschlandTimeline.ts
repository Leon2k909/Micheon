import type { CountryTimelineEvent } from "@/lib/countryStudies";

/**
 * Die deutsche Zeitleiste.
 *
 * Nach demselben Muster wie die britische gebaut, einschließlich der Regel,
 * die dort gilt: Ein Zeitraum wird nach seinem LETZTEN Jahr
 * einsortiert, nicht nach seinem ersten. Die Weimarer Republik gehört ans Ende
 * ihrer vierzehn Jahre, nicht neben den Kriegsausbruch von 1914 — sonst liest
 * sich die Leiste, als wäre sie vorbei, bevor sie begonnen hat.
 *
 * Sechs Epochen, weil sich die deutsche Geschichte an genau diesen Brüchen
 * teilt: vor der Nationalstaatsgründung, Kaiserreich, Weimar, NS-Zeit,
 * Teilung, vereintes Deutschland.
 */

type DeEra =
  | "vor-1871"
  | "kaiserreich"
  | "weimar"
  | "ns"
  | "teilung"
  | "vereint";

export const DE_ERA_LABELS: Record<DeEra, string> = {
  "vor-1871": "Vor der Reichsgründung",
  kaiserreich: "Kaiserreich",
  weimar: "Weimarer Republik",
  ns: "Nationalsozialismus",
  teilung: "Geteiltes Deutschland",
  vereint: "Vereintes Deutschland",
};

export const DE_ERA_ORDER: DeEra[] = [
  "vor-1871",
  "kaiserreich",
  "weimar",
  "ns",
  "teilung",
  "vereint",
];

const event = (
  id: string,
  year: number,
  displayYear: string,
  era: DeEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "Geschichte"
): CountryTimelineEvent => ({ id, year, displayYear, era, title, summary, detail, tags, category });

/** Dasselbe für einen Zeitraum, der in einem bekannten Jahr endet. */
const span = (
  id: string,
  year: number,
  endYear: number,
  displayYear: string,
  era: DeEra,
  title: string,
  summary: string,
  detail: string,
  tags: string[],
  category = "Geschichte"
): CountryTimelineEvent => ({ id, year, endYear, displayYear, era, title, summary, detail, tags, category });

export const DE_TIMELINE: CountryTimelineEvent[] = [
  // ── Vor der Reichsgründung ─────────────────────────────────────────────
  event("dt-gutenberg", 1450, "um 1450", "vor-1871", "Gutenberg erfindet den Buchdruck",
    "Bewegliche Lettern verändern Europa.",
    "Johannes Gutenberg druckt in Mainz mit beweglichen Metalllettern. Bücher werden erstmals vervielfältigbar, Wissen verbreitet sich schneller und billiger als je zuvor. Ohne diese Erfindung wäre die Reformation siebzig Jahre später kaum so weit gekommen.",
    ["Gutenberg", "Buchdruck", "Mainz", "Bibel", "Erfindung"], "Wissenschaft"),
  event("dt-reformation", 1517, "1517", "vor-1871", "Luther und die Reformation",
    "Die Kirchenspaltung beginnt in Wittenberg.",
    "Martin Luther kritisiert öffentlich den Ablasshandel. Aus dem Streit entsteht die evangelische Kirche und damit die bis heute prägende Teilung Deutschlands in katholische und protestantische Regionen. Luthers Bibelübersetzung formt zudem die deutsche Schriftsprache.",
    ["Luther", "Reformation", "Wittenberg", "evangelisch", "Bibelübersetzung"], "Religion"),
  span("dt-30-jahre", 1618, 1648, "1618–1648", "vor-1871", "Der Dreißigjährige Krieg",
    "Ein Religionskrieg verwüstet Mitteleuropa.",
    "Dreißig Jahre Krieg zwischen katholischen und protestantischen Mächten kosten in manchen Regionen ein Drittel der Bevölkerung das Leben. Der Westfälische Friede von 1648 beendet ihn und ordnet Europa neu — die deutschen Einzelstaaten gehen gestärkt daraus hervor, ein gemeinsamer Nationalstaat rückt in weite Ferne.",
    ["Dreißigjähriger Krieg", "Westfälischer Friede", "1648", "Religionskrieg"]),
  event("dt-1848", 1848, "1848", "vor-1871", "Die Revolution von 1848",
    "Der erste Versuch einer deutschen Demokratie.",
    "In der Frankfurter Paulskirche tagt das erste frei gewählte gesamtdeutsche Parlament und beschließt eine Verfassung mit Grundrechten. Der preußische König lehnt die angebotene Kaiserkrone ab, die Revolution scheitert. Die Farben Schwarz-Rot-Gold stammen aus dieser Zeit — sie stehen seither für Einheit und Freiheit.",
    ["Paulskirche", "Frankfurt", "1848", "Schwarz-Rot-Gold", "Revolution", "Grundrechte"], "Politik"),

  // ── Kaiserreich ────────────────────────────────────────────────────────
  event("dt-reichsgruendung", 1871, "1871", "kaiserreich", "Gründung des Deutschen Kaiserreichs",
    "Aus vielen Staaten wird ein Nationalstaat.",
    "Nach dem Krieg gegen Frankreich schließen sich die deutschen Staaten zum Kaiserreich zusammen. Der preußische König wird deutscher Kaiser, Otto von Bismarck erster Reichskanzler. Es gibt einen gewählten Reichstag, aber die Regierung ist ihm nicht verantwortlich — sie dient dem Kaiser.",
    ["Reichsgründung", "Bismarck", "Kaiserreich", "1871", "Wilhelm I."], "Politik"),
  span("dt-sozialgesetze", 1883, 1889, "1883–1889", "kaiserreich", "Die ersten Sozialversicherungen",
    "Bismarck baut den Sozialstaat auf.",
    "Kranken-, Unfall- und Rentenversicherung entstehen als weltweit erste staatliche Sozialversicherungen. Gedacht waren sie auch, um der Arbeiterbewegung den Wind aus den Segeln zu nehmen. Geblieben ist das Prinzip: Beiträge nach Einkommen, Leistungen nach Bedarf — bis heute die Grundlage des deutschen Sozialstaats.",
    ["Bismarck", "Sozialversicherung", "Krankenversicherung", "Rentenversicherung", "Solidarprinzip"], "Gesellschaft"),
  span("dt-wk1", 1914, 1918, "1914–1918", "kaiserreich", "Der Erste Weltkrieg",
    "Vier Jahre Krieg enden mit der Niederlage.",
    "Millionen Tote, eine erschöpfte Gesellschaft und eine Niederlage, die im Kaiserreich das Ende bedeutet. Am 9. November 1918 dankt Wilhelm II. ab und die Republik wird ausgerufen. Der Versailler Vertrag von 1919 verpflichtet Deutschland zu Reparationen und Gebietsabtretungen.",
    ["Erster Weltkrieg", "1918", "Versailler Vertrag", "Wilhelm II.", "Abdankung"]),

  // ── Weimarer Republik ──────────────────────────────────────────────────
  event("dt-weimar-verfassung", 1919, "1919", "weimar", "Die Weimarer Verfassung",
    "Die erste deutsche Demokratie — und das Frauenwahlrecht.",
    "Die Nationalversammlung tagt in Weimar und beschließt eine demokratische Verfassung. Frauen dürfen erstmals wählen und gewählt werden. Friedrich Ebert wird erster Reichspräsident. Hauptstadt bleibt Berlin; der Name der Republik kommt vom Tagungsort der Verfassunggebenden Versammlung.",
    ["Weimarer Verfassung", "Frauenwahlrecht", "Friedrich Ebert", "1919", "Weimar"], "Politik"),
  event("dt-inflation", 1923, "1923", "weimar", "Die Hyperinflation",
    "Geld verliert innerhalb von Monaten jeden Wert.",
    "Ein Brot kostet am Ende Milliarden Mark, Ersparnisse lösen sich auf. Die Währungsreform stoppt die Inflation, aber das Vertrauen des Mittelstands in die Republik ist beschädigt — eine Erfahrung, die die deutsche Angst vor Inflation bis heute prägt.",
    ["Hyperinflation", "1923", "Rentenmark", "Währungsreform"], "Wirtschaft"),
  span("dt-weimar-krise", 1929, 1933, "1929–1933", "weimar", "Weltwirtschaftskrise und Ende der Republik",
    "Massenarbeitslosigkeit und der Aufstieg der Extremen.",
    "Die Weltwirtschaftskrise trifft Deutschland hart: Millionen werden arbeitslos. Regierungen regieren mit Notverordnungen statt mit Mehrheiten, extreme Parteien von links und rechts stürzen jede Regierung, ohne eine neue zu bilden. Am Ende dieser vier Jahre steht die Machtübernahme der Nationalsozialisten.",
    ["Weltwirtschaftskrise", "Arbeitslosigkeit", "Notverordnung", "Präsidialkabinett"], "Politik"),

  // ── Nationalsozialismus ────────────────────────────────────────────────
  event("dt-machtuebernahme", 1933, "30. Januar 1933", "ns", "Hitler wird Reichskanzler",
    "Der Beginn der nationalsozialistischen Diktatur.",
    "Adolf Hitler wird zum Reichskanzler ernannt. Innerhalb weniger Monate werden Grundrechte außer Kraft gesetzt, das Ermächtigungsgesetz beseitigt die Gewaltenteilung, und alle Parteien außer der NSDAP werden verboten. Aus einer Demokratie wird in einem halben Jahr ein Einparteienstaat.",
    ["1933", "Hitler", "Ermächtigungsgesetz", "NSDAP", "Diktatur", "Gleichschaltung"], "Politik"),
  event("dt-nuernberger-gesetze", 1935, "1935", "ns", "Die Nürnberger Gesetze",
    "Jüdische Deutsche verlieren ihre Bürgerrechte.",
    "Rassistische Gesetze nehmen jüdischen Deutschen die staatsbürgerlichen Rechte und verbieten Ehen zwischen Juden und Nichtjuden. Die Ausgrenzung, die 1933 begann, wird damit zum geltenden Recht. Nicht zu verwechseln mit den Nürnberger Prozessen nach 1945.",
    ["Nürnberger Gesetze", "1935", "Antisemitismus", "Entrechtung"], "Verantwortung"),
  event("dt-pogromnacht", 1938, "9. November 1938", "ns", "Die Pogromnacht",
    "Synagogen brennen im ganzen Land.",
    "In der Nacht vom 9. auf den 10. November werden Synagogen angezündet, jüdische Geschäfte und Wohnungen zerstört, Menschen misshandelt und ermordet. Der 9. November ist damit zugleich das Datum des Mauerfalls 1989 — ein Grund, warum nicht er, sondern der 3. Oktober Nationalfeiertag ist.",
    ["Pogromnacht", "9. November", "1938", "Synagogen", "Novemberpogrome"], "Verantwortung"),
  span("dt-wk2", 1939, 1945, "1939–1945", "ns", "Der Zweite Weltkrieg",
    "Von Deutschland ausgelöst, endet er in der Kapitulation.",
    "Am 1. September 1939 überfällt Deutschland Polen. Der Krieg kostet weltweit über 50 Millionen Menschen das Leben und endet in Europa mit der bedingungslosen Kapitulation am 8. Mai 1945. Deutschland liegt in Trümmern und wird von den Siegermächten besetzt.",
    ["Zweiter Weltkrieg", "1939", "8. Mai 1945", "Kapitulation", "Polen"]),
  event("dt-holocaust", 1941, "1941–1945", "ns", "Der Holocaust",
    "Der staatlich organisierte Massenmord an den europäischen Juden.",
    "Etwa sechs Millionen Juden werden ermordet, dazu Sinti und Roma, Menschen mit Behinderung, politische Gegner und weitere Gruppen. Der Mord wird industriell betrieben, in Vernichtungslagern wie Auschwitz. Aus dieser Geschichte folgt die besondere Verantwortung, die deutsche Politik bis heute prägt.",
    ["Holocaust", "Schoah", "Auschwitz", "Vernichtungslager", "Verantwortung"], "Verantwortung"),
  event("dt-stauffenberg", 1944, "20. Juli 1944", "ns", "Das Attentat vom 20. Juli",
    "Der militärische Widerstand scheitert.",
    "Claus Schenk Graf von Stauffenberg verübt ein Attentat auf Hitler; es scheitert, die Beteiligten werden hingerichtet. Zuvor hatten schon die Geschwister Scholl mit der Weißen Rose Flugblätter verteilt und dafür 1943 mit dem Leben bezahlt. Der Widerstand war eine Minderheit — geehrt wird er trotzdem.",
    ["Stauffenberg", "20. Juli", "Weiße Rose", "Sophie Scholl", "Widerstand"], "Verantwortung"),

  // ── Geteiltes Deutschland ──────────────────────────────────────────────
  event("dt-stunde-null", 1945, "1945", "teilung", "Kriegsende und Besatzung",
    "Vier Siegermächte teilen Deutschland in Zonen.",
    "USA, Großbritannien, Frankreich und die Sowjetunion besetzen Deutschland; Berlin wird in vier Sektoren geteilt, obwohl es mitten in der sowjetischen Zone liegt. Millionen Menschen fliehen oder werden aus den Ostgebieten vertrieben. Die Entnazifizierung beginnt.",
    ["1945", "Besatzungszonen", "Vier Mächte", "Vertreibung", "Entnazifizierung"], "Politik"),
  span("dt-nuernberger-prozesse", 1945, 1946, "1945–1946", "teilung", "Die Nürnberger Prozesse",
    "Erstmals stehen Staatsführer vor Gericht.",
    "Die Alliierten klagen führende Nationalsozialisten wegen Kriegsverbrechen und Verbrechen gegen die Menschlichkeit an. Zum ersten Mal werden Staatsführer persönlich zur Verantwortung gezogen — die Grundlage des modernen Völkerstrafrechts.",
    ["Nürnberger Prozesse", "Kriegsverbrechen", "Völkerstrafrecht", "1946"], "Verantwortung"),
  span("dt-luftbruecke", 1948, 1949, "1948–1949", "teilung", "Die Berliner Luftbrücke",
    "West-Berlin wird fast ein Jahr aus der Luft versorgt.",
    "Die Sowjetunion sperrt alle Land- und Wasserwege nach West-Berlin. Die Westalliierten versorgen die Stadt per Flugzeug — im Minutentakt landen die Maschinen, die die Berliner Rosinenbomber nennen. Nach elf Monaten gibt die Sowjetunion die Blockade auf.",
    ["Luftbrücke", "Blockade", "Rosinenbomber", "West-Berlin", "1948"], "Politik"),
  event("dt-grundgesetz", 1949, "23. Mai 1949", "teilung", "Das Grundgesetz tritt in Kraft",
    "Die Bundesrepublik Deutschland entsteht.",
    "Aus den drei Westzonen wird die Bundesrepublik. Das Grundgesetz beginnt mit der Menschenwürde und baut an jeder Stelle Sicherungen gegen die Fehler von Weimar ein: Fünf-Prozent-Hürde, konstruktives Misstrauensvotum, Ewigkeitsklausel. Hauptstadt wird Bonn, erster Bundeskanzler Konrad Adenauer.",
    ["Grundgesetz", "23. Mai 1949", "Bundesrepublik", "Adenauer", "Bonn", "Menschenwürde"], "Politik"),
  event("dt-ddr-gruendung", 1949, "7. Oktober 1949", "teilung", "Gründung der DDR",
    "Aus der sowjetischen Zone wird ein zweiter deutscher Staat.",
    "Die Deutsche Demokratische Republik entsteht mit Ost-Berlin als Hauptstadt. Die SED beansprucht die Führung, die Wirtschaft wird zur Planwirtschaft. Wahlen gibt es, aber nur mit Einheitsliste — echte Auswahl besteht nicht.",
    ["DDR", "7. Oktober 1949", "SED", "Planwirtschaft", "Ost-Berlin"], "Politik"),
  event("dt-17-juni", 1953, "17. Juni 1953", "teilung", "Der Aufstand in der DDR",
    "Streiks werden zum Aufstand — und niedergeschlagen.",
    "Aus Protesten gegen erhöhte Arbeitsnormen wird ein Aufstand gegen die Regierung, der sich über das ganze Land ausbreitet. Sowjetische Panzer beenden ihn. In der Bundesrepublik ist der 17. Juni bis 1990 Nationalfeiertag.",
    ["17. Juni", "1953", "Aufstand", "Volksaufstand", "Panzer"], "Politik"),
  event("dt-nato", 1955, "1955", "teilung", "Die Bundesrepublik tritt der NATO bei",
    "Westbindung und Wiederbewaffnung.",
    "Die Bundesrepublik wird Mitglied des westlichen Verteidigungsbündnisses und baut die Bundeswehr auf — als Parlamentsarmee, über deren Einsätze der Bundestag entscheidet. Im selben Jahr beginnt die Anwerbung von Arbeitskräften aus dem Ausland.",
    ["NATO", "1955", "Bundeswehr", "Westbindung", "Parlamentsarmee"], "Politik"),
  span("dt-gastarbeiter", 1955, 1973, "1955–1973", "teilung", "Die Anwerbung von Gastarbeitern",
    "Millionen kommen zum Arbeiten — und viele bleiben.",
    "Weil die wachsende Wirtschaft Arbeitskräfte braucht, wirbt die Bundesrepublik Menschen aus Italien, Spanien, Griechenland, der Türkei und weiteren Ländern an. Viele bleiben, holen ihre Familien nach und prägen das Land bis heute. Deutschland wird zum Einwanderungsland, lange bevor es sich so nennt.",
    ["Gastarbeiter", "Anwerbeabkommen", "Einwanderung", "Wirtschaftswunder"], "Gesellschaft"),
  event("dt-mauerbau", 1961, "13. August 1961", "teilung", "Der Bau der Berliner Mauer",
    "Die Grenze wird geschlossen — nach innen.",
    "Weil immer mehr Menschen die DDR verlassen, wird Berlin über Nacht geteilt und die innerdeutsche Grenze abgeriegelt. An der Grenze gilt der Schießbefehl; bei Fluchtversuchen sterben Hunderte. Die Mauer hält niemanden draußen, sondern die eigene Bevölkerung drinnen.",
    ["Mauerbau", "13. August 1961", "Berliner Mauer", "Schießbefehl", "Republikflucht"], "Politik"),
  event("dt-ostpolitik", 1970, "1970", "teilung", "Willy Brandts Kniefall in Warschau",
    "Eine Geste, die um die Welt geht.",
    "Bundeskanzler Willy Brandt kniet vor dem Denkmal für die Opfer des Warschauer Ghettoaufstands nieder. Das Bild wird zum Symbol dafür, dass Deutschland Verantwortung für seine Geschichte übernimmt. Brandts Ostpolitik sucht die Verständigung mit den östlichen Nachbarn.",
    ["Willy Brandt", "Kniefall", "Warschau", "Ostpolitik", "1970"], "Verantwortung"),
  event("dt-uno", 1973, "1973", "teilung", "Beide deutsche Staaten treten den UN bei",
    "Bundesrepublik und DDR werden UN-Mitglieder.",
    "Nach dem Grundlagenvertrag zwischen beiden Staaten treten sie gemeinsam den Vereinten Nationen bei. Die Teilung wird damit international anerkannt — ohne dass die Bundesrepublik die Einheit als Ziel aufgibt.",
    ["Vereinte Nationen", "1973", "Grundlagenvertrag", "UN"], "Politik"),

  // ── Vereintes Deutschland ──────────────────────────────────────────────
  event("dt-mauerfall", 1989, "9. November 1989", "vereint", "Der Fall der Mauer",
    "Die Grenze öffnet sich ohne einen Schuss.",
    "Nach Wochen von Montagsdemonstrationen — in Leipzig mit dem Ruf „Wir sind das Volk“ — und einer verwirrenden Pressekonferenz strömen Menschen an die Grenzübergänge. Die Mauer wird geöffnet. Eine Diktatur endet durch friedlichen Protest, nicht durch Krieg.",
    ["Mauerfall", "9. November 1989", "Montagsdemonstrationen", "Leipzig", "Wir sind das Volk", "Friedliche Revolution"], "Politik"),
  event("dt-volkskammerwahl", 1990, "18. März 1990", "vereint", "Die erste freie Wahl in der DDR",
    "Zum ersten und einzigen Mal wählt die DDR frei.",
    "Die Volkskammer wird zum ersten Mal in freien, geheimen Wahlen bestimmt. Die neue Regierung verhandelt den Beitritt zur Bundesrepublik — die DDR wählt damit ihr eigenes Ende.",
    ["Volkskammer", "18. März 1990", "freie Wahl", "DDR"], "Politik"),
  event("dt-einheit", 1990, "3. Oktober 1990", "vereint", "Der Tag der Deutschen Einheit",
    "Die DDR tritt der Bundesrepublik bei.",
    "Aus zwei Staaten wird einer. Auf dem Gebiet der DDR entstehen fünf neue Bundesländer — Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen —, dazu kommt das vereinigte Berlin. Der Zwei-plus-Vier-Vertrag gibt Deutschland die volle Souveränität. Der 3. Oktober ist seither Nationalfeiertag.",
    ["3. Oktober 1990", "Wiedervereinigung", "Zwei-plus-Vier-Vertrag", "neue Bundesländer", "Helmut Kohl", "Tag der Deutschen Einheit"], "Politik"),
  event("dt-hauptstadtbeschluss", 1991, "1991", "vereint", "Berlin wird Regierungssitz",
    "Der Bundestag entscheidet sich knapp gegen Bonn.",
    "Nach einer der bewegendsten Debatten der Parlamentsgeschichte stimmt der Bundestag dafür, Parlament und Regierung nach Berlin zu verlegen. Bonn behält einen Teil der Ministerien und den Titel Bundesstadt.",
    ["Hauptstadtbeschluss", "1991", "Berlin", "Bonn", "Bundesstadt"], "Politik"),
  event("dt-maastricht", 1993, "1993", "vereint", "Die Europäische Union entsteht",
    "Aus der Gemeinschaft wird die Union.",
    "Der Vertrag von Maastricht tritt in Kraft: Aus der Europäischen Gemeinschaft wird die Europäische Union, mit Unionsbürgerschaft und dem Weg zur gemeinsamen Währung. Deutschland gibt damit die D-Mark auf — eine der umstrittensten Entscheidungen der Nachkriegszeit.",
    ["Maastricht", "Europäische Union", "1993", "Unionsbürgerschaft"], "Europa"),
  event("dt-umzug", 1999, "1999", "vereint", "Bundestag und Regierung ziehen nach Berlin",
    "Acht Jahre nach dem Beschluss folgt der Umzug.",
    "Der Bundestag tagt wieder im umgebauten Reichstagsgebäude, die Regierung arbeitet aus Berlin. Damit ist der institutionelle Teil der Wiedervereinigung abgeschlossen.",
    ["Umzug", "1999", "Reichstagsgebäude", "Berlin", "Regierungsviertel"], "Politik"),
  event("dt-euro", 2002, "1. Januar 2002", "vereint", "Der Euro löst die D-Mark ab",
    "Eine neue Währung in zwölf Ländern gleichzeitig.",
    "Euro-Scheine und -Münzen kommen in Umlauf; die D-Mark verschwindet innerhalb weniger Wochen aus den Portemonnaies. Als Buchgeld existierte der Euro schon seit 1999 — im Alltag angekommen ist er erst 2002.",
    ["Euro", "2002", "D-Mark", "Währungsunion"], "Wirtschaft"),
  event("dt-osterweiterung", 2004, "2004", "vereint", "Die EU-Osterweiterung",
    "Zehn neue Mitglieder auf einen Schlag.",
    "Polen, Tschechien, Ungarn, die Slowakei, Slowenien, die baltischen Staaten, Malta und Zypern treten der EU bei. Deutschland liegt damit nicht mehr am östlichen Rand der Union, sondern in ihrer Mitte — und grenzt nur noch an Mitgliedstaaten.",
    ["EU-Osterweiterung", "2004", "Polen", "Tschechien", "Erweiterung"], "Europa"),
  event("dt-merkel", 2005, "2005", "vereint", "Angela Merkel wird Bundeskanzlerin",
    "Zum ersten Mal führt eine Frau die Regierung.",
    "Angela Merkel wird als erste Frau zur Bundeskanzlerin gewählt und bleibt es sechzehn Jahre lang. Sie ist zugleich die erste Regierungschefin, die in der DDR aufgewachsen ist.",
    ["Angela Merkel", "2005", "Bundeskanzlerin", "erste Frau"], "Politik"),
  event("dt-finanzkrise", 2008, "2008", "vereint", "Die Finanzkrise erreicht Deutschland",
    "Banken wanken, der Staat greift ein.",
    "Die weltweite Finanzkrise trifft auch deutsche Banken. Der Staat stützt sie mit Milliarden und sichert mit Kurzarbeit Millionen Arbeitsplätze. Deutschland kommt vergleichsweise glimpflich durch die Krise — die Debatte über die Regulierung der Finanzmärkte prägt die Jahre danach.",
    ["Finanzkrise", "2008", "Kurzarbeit", "Bankenrettung"], "Wirtschaft"),
  event("dt-energiewende", 2011, "2011", "vereint", "Der Ausstieg aus der Kernenergie",
    "Nach Fukushima beschließt Deutschland die Energiewende.",
    "Nach der Reaktorkatastrophe in Japan beschließt der Bundestag, alle Kernkraftwerke abzuschalten und den Ausbau erneuerbarer Energien zu beschleunigen. Der letzte Meiler geht 2023 vom Netz.",
    ["Energiewende", "2011", "Fukushima", "Atomausstieg", "erneuerbare Energien"], "Gesellschaft"),
  event("dt-wm-2014", 2014, "2014", "vereint", "Deutschland wird Fußballweltmeister",
    "Der vierte WM-Titel, gewonnen in Brasilien.",
    "Die Nationalmannschaft gewinnt das Finale in Rio de Janeiro gegen Argentinien. Es ist der vierte Titel nach 1954, 1974 und 1990 — und der erste als wiedervereinigtes Deutschland von Anfang bis Ende.",
    ["Fußball", "WM 2014", "Weltmeister", "Brasilien", "Nationalmannschaft"], "Kultur"),
  event("dt-2015", 2015, "2015", "vereint", "Die Aufnahme von Geflüchteten",
    "Hunderttausende Menschen suchen Schutz in Deutschland.",
    "Vor allem aus Syrien, Afghanistan und dem Irak kommen viele Menschen nach Deutschland. Millionen engagieren sich ehrenamtlich bei der Aufnahme; zugleich wird über Integration und Zuwanderung intensiv gestritten. Integrationskurse und Orientierungskurse werden stark ausgebaut.",
    ["2015", "Geflüchtete", "Integration", "Ehrenamt", "Integrationskurs"], "Gesellschaft"),
  event("dt-ehe-fuer-alle", 2017, "2017", "vereint", "Die Ehe für alle",
    "Gleichgeschlechtliche Paare dürfen heiraten.",
    "Der Bundestag öffnet die Ehe für gleichgeschlechtliche Paare. Zuvor gab es seit 2001 die eingetragene Lebenspartnerschaft, die weniger Rechte umfasste — etwa beim gemeinsamen Adoptionsrecht.",
    ["Ehe für alle", "2017", "gleichgeschlechtlich", "Lebenspartnerschaft"], "Gesellschaft"),
  span("dt-corona", 2020, 2022, "2020–2022", "vereint", "Die Corona-Pandemie",
    "Der größte Einschnitt in den Alltag seit dem Krieg.",
    "Schulen und Geschäfte schließen, Kontakte werden beschränkt, Impfkampagnen laufen an. Der Bundestag und die Länder ringen um die Zuständigkeiten — ein Lehrstück über den Föderalismus, in dem Gesundheitsschutz Ländersache ist und der Bund den Rahmen setzt.",
    ["Corona", "Pandemie", "2020", "Lockdown", "Impfung", "Föderalismus"], "Gesellschaft"),
  event("dt-zeitenwende", 2022, "2022", "vereint", "Der Krieg in der Ukraine und die Zeitenwende",
    "Deutschland ordnet seine Sicherheitspolitik neu.",
    "Nach dem russischen Angriff auf die Ukraine beschließt der Bundestag höhere Verteidigungsausgaben, Deutschland nimmt über eine Million Geflüchtete auf und löst sich von russischem Gas. Die Bundesregierung nennt den Einschnitt Zeitenwende.",
    ["Ukraine", "2022", "Zeitenwende", "Bundeswehr", "Geflüchtete", "Energie"], "Politik"),
  event("dt-staatsangehoerigkeit", 2024, "2024", "vereint", "Das neue Staatsangehörigkeitsrecht",
    "Einbürgerung wird früher möglich, Mehrstaatigkeit erlaubt.",
    "Die Einbürgerung ist in der Regel nach fünf Jahren möglich, bei besonderen Integrationsleistungen früher. Die bisherige Pflicht, die alte Staatsangehörigkeit aufzugeben, entfällt — Mehrstaatigkeit wird allgemein akzeptiert. Der Einbürgerungstest bleibt Voraussetzung.",
    ["Staatsangehörigkeit", "2024", "Einbürgerung", "Mehrstaatigkeit", "Einbürgerungstest"], "Politik"),
];

const sortYear = (entry: CountryTimelineEvent) => entry.endYear ?? entry.year;

/**
 * Chronologisch, Zeiträume an ihrem Ende einsortiert.
 *
 * Bei gleichem Sortierjahr entscheidet das Anfangsjahr, damit ein Zeitpunkt
 * vor einem Zeitraum steht, der in demselben Jahr endet.
 */
export function deTimelineSorted(): CountryTimelineEvent[] {
  return [...DE_TIMELINE].sort((a, b) => sortYear(a) - sortYear(b) || a.year - b.year);
}
