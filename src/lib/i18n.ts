import { learningEnglish } from "@/lib/direction";

// UI language follows the learning direction: a German speaker learning
// English (learn-en) gets the app chrome in German. English UI is the source
// key; anything not in the table falls through unchanged, so missing strings
// degrade gracefully instead of breaking.
const DE: Record<string, string> = {
  // ── Lesson screen ──
  "Sentence practice": "Satztraining",
  "Read, hear, say, type, then translate.": "Lesen, hören, sprechen, tippen, dann übersetzen.",
  "Build one useful sentence": "Einen nützlichen Satz lernen",
  "English sentence": "Englischer Satz",
  "German sentence": "Deutscher Satz",
  "Know it": "Kann ich",
  "Struggle": "Schwierig",
  "Hear it": "Anhören",
  "Read and listen — it plays automatically.": "Lies und hör zu — es wird automatisch abgespielt.",
  "Say it out loud.": "Sprich es laut aus.",
  "Check with microphone": "Mit Mikrofon prüfen",
  "Listening... speak now": "Ich höre... sprich jetzt",
  "Continue": "Weiter",
  "Check": "Prüfen",
  "Check answer": "Antwort prüfen",
  "Done": "Fertig",
  "Next": "Weiter",
  "Try again": "Nochmal",
  "Skip": "Überspringen",
  "← Back": "← Zurück",
  "One more round": "Noch eine Runde",
  "Not quite": "Nicht ganz",
  "Answer:": "Antwort:",
  "People would understand you — but that's the literal translation.": "Man würde dich verstehen — aber das ist wörtlich übersetzt.",
  "The natural way is:": "Natürlich sagt man:",
  "That's it!": "Genau!",
  "Perfect!": "Perfekt!",
  "Nice match": "Sehr gut",
  "Close match": "Fast genau",
  "Heard:": "Gehört:",
  // Focus-lesson chrome
  "German": "Deutsch",
  "English": "Englisch",
  "Lesson": "Lektion",
  "of": "von",
  "Jump to any stage": "Springe zu jedem Schritt",
  "Tap a word to hear it": "Tippe ein Wort, um es zu hören",
  "Tap to replay": "Zum Wiederholen tippen",
  "Press Enter when you are ready.": "Drücke Enter, wenn du bereit bist.",
  "Preparing voice…": "Spracherkennung wird vorbereitet…",
  "Reading it back…": "Wird ausgewertet…",
  "Listening — tap to stop": "Ich höre zu — zum Beenden tippen",
  "Type in English": "Auf Englisch tippen",
  "Type in German": "Auf Deutsch tippen",
  "Read & listen": "Lesen & hören",
  "Say it out loud": "Sprich es laut aus",
  "Type the sentence": "Tippe den Satz",
  "Type it once more": "Tippe ihn noch einmal",
  "Translate the meaning": "Übersetze die Bedeutung",
  "Recall the meaning": "Bedeutung abrufen",
  "Fill the blank": "Fülle die Lücke",
  "Build from memory": "Aus dem Gedächtnis",
  // Stage names (tooltips)
  "Stage": "Schritt",
  "Read": "Lesen",
  "Speak": "Sprechen",
  "Type": "Tippen",
  "Translate": "Übersetzen",
  "Type 2": "Tippen 2",
  "Recall": "Abruf",
  "Fill in": "Lücke",
  "Write it": "Schreiben",
  // Typed-phase prompts (built with target/meaning labels)
  "Now type the sentence exactly.": "Tippe jetzt den Satz genau ab.",
  "Fill the blank — type the missing word.": "Fülle die Lücke — tippe das fehlende Wort.",
  "Fill the blank — type the missing words.": "Fülle die Lücke — tippe die fehlenden Wörter.",
  // ── Dashboard ──
  "Continue learning": "Weiterlernen",
  "Current focus": "Aktueller Fokus",
  "Course progress": "Kursfortschritt",
  "Daily plan": "Tagesplan",
  "Today's German progress": "Dein Lernfortschritt heute",
  "Your next useful step, streak, and practice totals.": "Dein nächster Schritt, deine Serie und deine Übungswerte.",
  "Next up": "Als Nächstes",
  "Course complete": "Kurs geschafft",
  "Finish one lesson to move today forward": "Schließe eine Lektion ab, um heute voranzukommen",
  "My schedule": "Mein Plan",
  "All lessons": "Alle Lektionen",
  "Practice": "Üben",
  // ── Nav ──
  "Dashboard": "Übersicht",
  "Lessons": "Lektionen",
  "Grammar": "Grammatik",
  "day streak · switch": "Tage Serie · wechseln",
  // ── Fluency meter ──
  "to fluent": "bis fließend",
  "You're at": "Du bist bei",
  "more to go until you're fully fluent": "noch bis du wirklich fließend bist",
};

/** Translate a UI string into the learner's interface language. */
export function ui(s: string): string {
  return learningEnglish() ? DE[s] ?? s : s;
}

/** True when the app chrome should render in German (learn-en mode). */
export function uiIsGerman(): boolean {
  return learningEnglish();
}
