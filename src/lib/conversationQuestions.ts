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
  // ── meeting someone ────────────────────────────────────────────────────
  "Ich heiße Anna.": { de: "Wie heißen Sie?", en: "What's your name?" },
  "Ich bin Tom.": { de: "Und wer bist du?", en: "And who are you?" },
  "Freut mich!": { de: "Ich bin Julia, schön dich kennenzulernen.", en: "I'm Julia, nice to meet you." },
  "Ich komme aus England.": { de: "Woher kommen Sie?", en: "Where are you from?" },
  "Guten Morgen!": { de: "Guten Morgen! Gut geschlafen?", en: "Good morning! Sleep well?" },
  "Guten Abend!": { de: "Guten Abend! Schön, dass Sie da sind.", en: "Good evening! Good to have you here." },
  "Tschüss!": { de: "So, ich muss dann mal los.", en: "Right, I'd better get going." },
  "Auf Wiedersehen!": { de: "Vielen Dank für Ihre Zeit.", en: "Thank you for your time." },
  "Gute Nacht!": { de: "Ich geh ins Bett, bin todmüde.", en: "I'm off to bed, I'm exhausted." },
  "Hallo!": { de: "Hallo, kennen wir uns?", en: "Hello, do we know each other?" },

  // ── when you have not followed ─────────────────────────────────────────
  "Kannst du das nochmal sagen?": { de: "Wir treffen uns um Viertel vor sieben am Hauptbahnhof.", en: "We're meeting at quarter to seven at the main station." },
  "Kannst du das anders sagen?": { de: "Das ist reine Formsache, sozusagen pro forma.", en: "It's a pure formality, pro forma so to speak." },
  "Was meinst du genau?": { de: "Das könnte schwierig werden.", en: "That could get difficult." },
  "Wie meinst du das?": { de: "Naja, es ist kompliziert.", en: "Well, it's complicated." },
  "Ich hab das nicht ganz verstanden.": { de: "Alles klar so weit?", en: "All clear so far?" },
  "Hab ich dich richtig verstanden?": { de: "Genau, und deswegen machen wir es nächste Woche.", en: "Exactly, and that's why we're doing it next week." },

  // ── small talk ─────────────────────────────────────────────────────────
  "Alles gut.": { de: "Alles klar bei dir?", en: "Everything okay with you?" },
  "Ich bin müde.": { de: "Du siehst fertig aus — alles okay?", en: "You look shattered — everything all right?" },
  "Ich bin glücklich.": { de: "Wie geht es dir heute?", en: "How are you today?" },
  "Ich bin gestresst.": { de: "Wie läuft es gerade bei der Arbeit?", en: "How are things at work right now?" },
  "Ich habe Hunger.": { de: "Sollen wir noch was essen?", en: "Shall we get something to eat?" },

  // ── times and dates ────────────────────────────────────────────────────
  "Es ist drei Uhr.": { de: "Wie spät ist es?", en: "What time is it?" },
  "Es ist halb acht.": { de: "Weißt du, wie spät es ist?", en: "Do you know what time it is?" },
  "Es ist Viertel nach neun.": { de: "Entschuldigung, wie spät haben wir es?", en: "Sorry, what time do you have?" },
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
