/**
 * The question each phrase answers, written by hand.
 *
 * The first attempt at this looked the question up from the dialogues, which
 * sounded reasonable and covered 0.3% of the phrases a review is actually
 * drawn from — the dialogue pairs are between dialogue LINES, and reviews come
 * from taught phrases, so the two barely intersect. The beta was therefore
 * indistinguishable from an ordinary review.
 *
 * So they are assigned here instead. Hand-written means the question is one a
 * person would really ask, and that the phrase is a natural answer to it
 * rather than merely a grammatical one — which is the whole point of practising
 * it this way.
 *
 * Keyed on the German exactly as taught. Add a pair and the beta uses it.
 */
export const CONVERSATION_QUESTIONS: Record<string, { de: string; en: string }> = {
  // Small talk
  "Alles gut.": { de: "Alles klar bei dir?", en: "Everything okay with you?" },
  "Ich bin müde.": { de: "Du siehst fertig aus — alles okay?", en: "You look shattered — everything all right?" },
  "Ich bin glücklich.": { de: "Wie geht es dir heute?", en: "How are you today?" },
  "Ich bin gestresst.": { de: "Wie läuft es gerade bei der Arbeit?", en: "How are things at work right now?" },
  "Ich habe Hunger.": { de: "Sollen wir noch was essen?", en: "Shall we get something to eat?" },
  "Ich habe Durst.": { de: "Möchtest du etwas trinken?", en: "Would you like something to drink?" },
  "Das freut mich.": { de: "Ich habe die Stelle bekommen!", en: "I got the job!" },
  "Echt schade!": { de: "Das Konzert wurde leider abgesagt.", en: "The concert was cancelled, unfortunately." },
  "Was gibt's Neues?": { de: "Lange nicht gesehen!", en: "Long time no see!" },

  // Time and dates
  "Es ist drei Uhr.": { de: "Wie spät ist es?", en: "What time is it?" },
  "Es ist halb acht.": { de: "Weißt du, wie spät es ist?", en: "Do you know what time it is?" },
  "Es ist Viertel nach neun.": { de: "Entschuldigung, wie spät haben wir es?", en: "Sorry, what time do you have?" },
  "Heute ist Montag.": { de: "Welcher Tag ist heute?", en: "What day is it today?" },
  "Morgen ist Freitag.": { de: "Ist morgen schon Freitag?", en: "Is it Friday tomorrow already?" },
  "Am Wochenende habe ich Zeit.": { de: "Wann hättest du mal Zeit?", en: "When would you have time?" },

  // Shopping
  "Das ist zu teuer.": { de: "Wie gefällt Ihnen der Preis?", en: "How do you find the price?" },
  "Ich schaue nur, danke.": { de: "Kann ich Ihnen helfen?", en: "Can I help you?" },
  "Ich nehme das.": { de: "Und, haben Sie sich entschieden?", en: "So, have you decided?" },
  "Ich zahle bar.": { de: "Zahlen Sie bar oder mit Karte?", en: "Are you paying cash or by card?" },
  "Kann ich mit Karte zahlen?": { de: "Das macht dann 24,50 Euro.", en: "That comes to 24.50 euros, then." },
  "Was kostet das?": { de: "Dieses Modell haben wir gerade neu da.", en: "We have just got this model in." },
  "Wo ist die Kasse?": { de: "Möchten Sie sonst noch etwas?", en: "Would you like anything else?" },
  "Brauchen Sie eine Tüte?": { de: "Ich nehme die beiden hier.", en: "I'll take these two." },

  // Restaurant
  "Einen Tisch für zwei, bitte.": { de: "Guten Abend, haben Sie reserviert?", en: "Good evening, do you have a reservation?" },
  "Die Speisekarte, bitte.": { de: "Was darf ich Ihnen bringen?", en: "What can I bring you?" },
  "Ich hätte gern einen Kaffee.": { de: "Was möchten Sie trinken?", en: "What would you like to drink?" },
  "Ich nehme das Schnitzel.": { de: "Haben Sie schon gewählt?", en: "Have you chosen yet?" },
  "Für mich bitte ein Wasser.": { de: "Und für Sie?", en: "And for you?" },
  "Zum Mitnehmen, bitte.": { de: "Zum Hieressen oder zum Mitnehmen?", en: "To eat in or take away?" },
  "Ich bin Vegetarier.": { de: "Essen Sie Fleisch?", en: "Do you eat meat?" },
  "Hat das Nüsse?": { de: "Der Kuchen ist heute frisch gebacken.", en: "The cake was baked fresh today." },
  "Was können Sie empfehlen?": { de: "Alles bei Ihnen in Ordnung mit der Karte?", en: "Everything all right with the menu?" },

  // Directions
  "Wo ist die nächste Haltestelle?": { de: "Kann ich Ihnen weiterhelfen?", en: "Can I help you find something?" },
  "Wie komme ich zum Zentrum?": { de: "Sie sehen aus, als suchten Sie etwas.", en: "You look like you're looking for something." },
  "Ist es weit von hier?": { de: "Das Museum ist in der Hauptstraße.", en: "The museum is on the main street." },
  "Gehen Sie geradeaus.": { de: "Wie komme ich zum Bahnhof?", en: "How do I get to the station?" },
  "Biegen Sie links ab.": { de: "Und dann? An der Ampel?", en: "And then? At the lights?" },
  "Es ist gleich um die Ecke.": { de: "Ist die Apotheke weit?", en: "Is the pharmacy far?" },
  "Ich habe mich verlaufen.": { de: "Sie sehen etwas ratlos aus.", en: "You look a little lost." },
  "Eine Fahrkarte nach München, bitte.": { de: "Guten Tag, wohin möchten Sie?", en: "Hello, where would you like to go?" },
  "Wann fährt der nächste Zug?": { de: "Der Zug um zehn ist leider weg.", en: "The ten o'clock train has gone, I'm afraid." },

  // Hotel
  "Ich habe ein Zimmer reserviert.": { de: "Guten Abend, was kann ich für Sie tun?", en: "Good evening, what can I do for you?" },
  "Haben Sie ein Zimmer frei?": { de: "Guten Tag, haben Sie gebucht?", en: "Hello, have you booked?" },
  "Ein Einzelzimmer, bitte.": { de: "Einzel- oder Doppelzimmer?", en: "Single or double room?" },
  "Ist das Frühstück inklusive?": { de: "Das Zimmer kostet 89 Euro die Nacht.", en: "The room is 89 euros a night." },
  "Um wie viel Uhr ist Check-out?": { de: "Haben Sie sonst noch Fragen?", en: "Do you have any other questions?" },
  "Wo ist der Aufzug?": { de: "Ihr Zimmer ist im vierten Stock.", en: "Your room is on the fourth floor." },
  "Das WLAN funktioniert nicht.": { de: "Ist alles in Ordnung mit dem Zimmer?", en: "Is everything all right with the room?" },
  "Die Heizung ist kaputt.": { de: "Kann ich sonst noch etwas für Sie tun?", en: "Can I do anything else for you?" },

  // Work
  "Ich habe eine Frage.": { de: "Gibt es noch etwas?", en: "Is there anything else?" },
  "Können wir kurz sprechen?": { de: "Ja bitte?", en: "Yes?" },
  "Ich kümmere mich darum.": { de: "Wer übernimmt das?", en: "Who's taking that on?" },
  "Das mache ich sofort.": { de: "Kannst du das heute noch schaffen?", en: "Can you get that done today?" },
  "Können Sie mir das erklären?": { de: "Ist der Ablauf so weit klar?", en: "Is the process clear so far?" },
  "Ich bin in einer Besprechung.": { de: "Hast du kurz Zeit?", en: "Have you got a minute?" },
  "Ich schicke Ihnen eine E-Mail.": { de: "Wie bekomme ich die Unterlagen?", en: "How do I get the documents?" },
  "Das Meeting wurde verschoben.": { de: "Sehen wir uns nachher um drei?", en: "Are we meeting later at three?" },

  // Health
  "Ich fühle mich nicht gut.": { de: "Du bist so still heute — alles okay?", en: "You're very quiet today — everything okay?" },
  "Ich bin krank.": { de: "Kommst du morgen ins Büro?", en: "Are you coming into the office tomorrow?" },
  "Ich habe Kopfschmerzen.": { de: "Was fehlt Ihnen denn?", en: "What seems to be the trouble?" },
  "Ich habe Bauchschmerzen.": { de: "Wo genau haben Sie Beschwerden?", en: "Where exactly are you having trouble?" },
  "Ich habe Fieber.": { de: "Haben Sie schon Temperatur gemessen?", en: "Have you taken your temperature?" },
  "Ich brauche einen Arzt.": { de: "Soll ich jemanden rufen?", en: "Should I call someone?" },
  "Ich möchte einen Termin machen.": { de: "Praxis Dr. Bauer, guten Tag!", en: "Dr Bauer's surgery, hello!" },
  "Es tut hier weh.": { de: "Wo tut es weh?", en: "Where does it hurt?" },

  // On the phone
  "Kann ich bitte mit Herrn Müller sprechen?": { de: "Firma Berger, guten Tag!", en: "Berger and Company, hello!" },
  "Er ist gerade nicht da.": { de: "Ist Herr Müller zu sprechen?", en: "Is Mr Müller available?" },
  "Können Sie mich zurückrufen?": { de: "Er ist heute leider den ganzen Tag unterwegs.", en: "He's out all day today, I'm afraid." },
  "Die Verbindung ist schlecht.": { de: "Hallo? Hören Sie mich?", en: "Hello? Can you hear me?" },
  "Ich kann Sie nicht hören.": { de: "Hallo, sind Sie noch dran?", en: "Hello, are you still there?" },
  "Kann ich etwas ausrichten?": { de: "Ich wollte eigentlich Frau Klein sprechen.", en: "I was actually after Ms Klein." },
};

const normalise = (s: string) => String(s ?? "").trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");

let index: Map<string, { de: string; en: string }> | null = null;

/** The hand-written question for a phrase, or null if none has been assigned. */
export function assignedQuestionFor(de: string): { de: string; en: string } | null {
  if (!index) {
    index = new Map();
    for (const [answer, question] of Object.entries(CONVERSATION_QUESTIONS)) {
      index.set(normalise(answer), question);
    }
  }
  return index.get(normalise(de)) ?? null;
}

/** How many phrases have a question assigned. Used by the gate. */
export function assignedQuestionCount(): number {
  return Object.keys(CONVERSATION_QUESTIONS).length;
}
