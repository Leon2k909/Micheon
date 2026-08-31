import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Volume2 } from "lucide-react";
import { speakGerman } from "@/lib/tts";
import { englishVoiceLang } from "@/lib/englishVariant";
import { useGameContent } from "@/games/gameContent";
import { recordWordMastery } from "@/lib/mastery";
import { ui, uiFmt } from "@/lib/i18n";
import { courseSides } from "@/lib/courseLanguages";
import { tts } from "@/lib/voice";

// ── Verb conjugation data ─────────────────────────────────────
const VERBS: { infinitive: string; en: string; pronoun: string; correct: string; wrong: string[] }[] = [
  { infinitive: "sein",   en: "to be",   pronoun: "ich",  correct: "bin",   wrong: ["ist", "sind", "bist"] },
  { infinitive: "sein",   en: "to be",   pronoun: "du",   correct: "bist",  wrong: ["bin", "ist", "seid"] },
  { infinitive: "sein",   en: "to be",   pronoun: "er",   correct: "ist",   wrong: ["bin", "bist", "sind"] },
  { infinitive: "sein",   en: "to be",   pronoun: "wir",  correct: "sind",  wrong: ["bin", "ist", "seid"] },
  { infinitive: "haben",  en: "to have", pronoun: "ich",  correct: "habe",  wrong: ["hat", "haben", "hast"] },
  { infinitive: "haben",  en: "to have", pronoun: "du",   correct: "hast",  wrong: ["habe", "hat", "habt"] },
  { infinitive: "haben",  en: "to have", pronoun: "er",   correct: "hat",   wrong: ["habe", "hast", "haben"] },
  { infinitive: "haben",  en: "to have", pronoun: "wir",  correct: "haben", wrong: ["habe", "hat", "habt"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "ich",  correct: "gehe",  wrong: ["geht", "gehen", "gehst"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "du",   correct: "gehst", wrong: ["gehe", "geht", "gehen"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "er",   correct: "geht",  wrong: ["gehe", "gehst", "gehen"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "wir",  correct: "gehen", wrong: ["gehe", "geht", "geht"] },
  { infinitive: "machen", en: "to do",   pronoun: "ich",  correct: "mache", wrong: ["macht", "machst", "machen"] },
  { infinitive: "machen", en: "to do",   pronoun: "du",   correct: "machst",wrong: ["mache", "macht", "machen"] },
  { infinitive: "machen", en: "to do",   pronoun: "er",   correct: "macht", wrong: ["mache", "machst", "machen"] },
  { infinitive: "kommen", en: "to come", pronoun: "ich",  correct: "komme", wrong: ["kommt", "kommst", "kommen"] },
  { infinitive: "kommen", en: "to come", pronoun: "du",   correct: "kommst",wrong: ["komme", "kommt", "kommen"] },
  { infinitive: "kommen", en: "to come", pronoun: "er",   correct: "kommt", wrong: ["komme", "kommst", "kommen"] },
  { infinitive: "sehen",  en: "to see",  pronoun: "ich",  correct: "sehe",  wrong: ["sieht", "siehst", "sehen"] },
  { infinitive: "sehen",  en: "to see",  pronoun: "du",   correct: "siehst",wrong: ["sehe", "sieht", "sehen"] },
  { infinitive: "sehen",  en: "to see",  pronoun: "er",   correct: "sieht", wrong: ["sehe", "siehst", "sehen"] },
  { infinitive: "wissen", en: "to know", pronoun: "ich",  correct: "weiß",  wrong: ["wissen", "weißt", "weiß"] },
  { infinitive: "wissen", en: "to know", pronoun: "du",   correct: "weißt", wrong: ["weiß", "wissen", "wisst"] },
  { infinitive: "wissen", en: "to know", pronoun: "er",   correct: "weiß",  wrong: ["weißt", "wissen", "wisst"] },
];

// The same drill in French. Written out rather than derived: the seven verbs
// worth drilling first are all irregular, which is exactly why they are the
// ones worth drilling, and a rule-based conjugator would get every one of
// them wrong. The decoys are real forms of the same verb, so a wrong shot is
// a wrong PERSON rather than a word that does not exist.
const FRENCH_VERBS: typeof VERBS = [
  { infinitive: "être",   en: "to be",    pronoun: "je",   correct: "suis",    wrong: ["es", "est", "sommes"] },
  { infinitive: "être",   en: "to be",    pronoun: "tu",   correct: "es",      wrong: ["suis", "est", "êtes"] },
  { infinitive: "être",   en: "to be",    pronoun: "il",   correct: "est",     wrong: ["suis", "es", "sont"] },
  { infinitive: "être",   en: "to be",    pronoun: "nous", correct: "sommes",  wrong: ["suis", "est", "êtes"] },
  { infinitive: "avoir",  en: "to have",  pronoun: "j'",   correct: "ai",      wrong: ["as", "a", "avons"] },
  { infinitive: "avoir",  en: "to have",  pronoun: "tu",   correct: "as",      wrong: ["ai", "a", "avez"] },
  { infinitive: "avoir",  en: "to have",  pronoun: "il",   correct: "a",       wrong: ["ai", "as", "ont"] },
  { infinitive: "avoir",  en: "to have",  pronoun: "nous", correct: "avons",   wrong: ["ai", "a", "avez"] },
  { infinitive: "aller",  en: "to go",    pronoun: "je",   correct: "vais",    wrong: ["vas", "va", "allons"] },
  { infinitive: "aller",  en: "to go",    pronoun: "tu",   correct: "vas",     wrong: ["vais", "va", "allez"] },
  { infinitive: "aller",  en: "to go",    pronoun: "il",   correct: "va",      wrong: ["vais", "vas", "vont"] },
  { infinitive: "aller",  en: "to go",    pronoun: "nous", correct: "allons",  wrong: ["vais", "va", "allez"] },
  { infinitive: "faire",  en: "to do",    pronoun: "je",   correct: "fais",    wrong: ["fait", "faites", "faisons"] },
  { infinitive: "faire",  en: "to do",    pronoun: "tu",   correct: "fais",    wrong: ["fait", "faites", "font"] },
  { infinitive: "faire",  en: "to do",    pronoun: "il",   correct: "fait",    wrong: ["fais", "faites", "font"] },
  { infinitive: "faire",  en: "to do",    pronoun: "nous", correct: "faisons", wrong: ["fais", "fait", "faites"] },
  { infinitive: "venir",  en: "to come",  pronoun: "je",   correct: "viens",   wrong: ["vient", "venons", "viennent"] },
  { infinitive: "venir",  en: "to come",  pronoun: "tu",   correct: "viens",   wrong: ["vient", "venez", "viennent"] },
  { infinitive: "venir",  en: "to come",  pronoun: "il",   correct: "vient",   wrong: ["viens", "venez", "viennent"] },
  { infinitive: "venir",  en: "to come",  pronoun: "nous", correct: "venons",  wrong: ["viens", "vient", "venez"] },
  { infinitive: "voir",   en: "to see",   pronoun: "je",   correct: "vois",    wrong: ["voit", "voyons", "voient"] },
  { infinitive: "voir",   en: "to see",   pronoun: "tu",   correct: "vois",    wrong: ["voit", "voyez", "voient"] },
  { infinitive: "voir",   en: "to see",   pronoun: "il",   correct: "voit",    wrong: ["vois", "voyez", "voient"] },
  { infinitive: "voir",   en: "to see",   pronoun: "nous", correct: "voyons",  wrong: ["vois", "voit", "voyez"] },
  { infinitive: "savoir", en: "to know",  pronoun: "je",   correct: "sais",    wrong: ["sait", "savons", "savent"] },
  { infinitive: "savoir", en: "to know",  pronoun: "tu",   correct: "sais",    wrong: ["sait", "savez", "savent"] },
  { infinitive: "savoir", en: "to know",  pronoun: "il",   correct: "sait",    wrong: ["sais", "savez", "savent"] },
  { infinitive: "savoir", en: "to know",  pronoun: "nous", correct: "savons",  wrong: ["sais", "sait", "savez"] },
];

// And in Polish. Same principle as the French table: the eight verbs worth
// drilling first are the irregular ones, a rule-based conjugator would get
// every one of them wrong, and each decoy is a real form of the same verb —
// so a wrong shot is a wrong PERSON rather than a word that does not exist.
const POLISH_VERBS: typeof VERBS = [
  { infinitive: "być",       en: "to be",    pronoun: "ja", correct: "jestem",   wrong: ["jesteś", "jest", "jesteśmy"] },
  { infinitive: "być",       en: "to be",    pronoun: "ty", correct: "jesteś",   wrong: ["jestem", "jest", "jesteście"] },
  { infinitive: "być",       en: "to be",    pronoun: "on", correct: "jest",     wrong: ["jestem", "jesteś", "są"] },
  { infinitive: "być",       en: "to be",    pronoun: "my", correct: "jesteśmy", wrong: ["jestem", "jest", "jesteście"] },
  { infinitive: "mieć",      en: "to have",  pronoun: "ja", correct: "mam",      wrong: ["masz", "ma", "mamy"] },
  { infinitive: "mieć",      en: "to have",  pronoun: "ty", correct: "masz",     wrong: ["mam", "ma", "macie"] },
  { infinitive: "mieć",      en: "to have",  pronoun: "on", correct: "ma",       wrong: ["mam", "masz", "mają"] },
  { infinitive: "mieć",      en: "to have",  pronoun: "my", correct: "mamy",     wrong: ["mam", "ma", "macie"] },
  { infinitive: "iść",       en: "to go",    pronoun: "ja", correct: "idę",      wrong: ["idziesz", "idzie", "idziemy"] },
  { infinitive: "iść",       en: "to go",    pronoun: "ty", correct: "idziesz",  wrong: ["idę", "idzie", "idziecie"] },
  { infinitive: "iść",       en: "to go",    pronoun: "on", correct: "idzie",    wrong: ["idę", "idziesz", "idą"] },
  { infinitive: "iść",       en: "to go",    pronoun: "my", correct: "idziemy",  wrong: ["idę", "idzie", "idziecie"] },
  { infinitive: "jechać",    en: "to drive", pronoun: "ja", correct: "jadę",     wrong: ["jedziesz", "jedzie", "jedziemy"] },
  { infinitive: "jechać",    en: "to drive", pronoun: "ty", correct: "jedziesz", wrong: ["jadę", "jedzie", "jedziecie"] },
  { infinitive: "jechać",    en: "to drive", pronoun: "on", correct: "jedzie",   wrong: ["jadę", "jedziesz", "jadą"] },
  { infinitive: "robić",     en: "to do",    pronoun: "ja", correct: "robię",    wrong: ["robisz", "robi", "robimy"] },
  { infinitive: "robić",     en: "to do",    pronoun: "ty", correct: "robisz",   wrong: ["robię", "robi", "robicie"] },
  { infinitive: "robić",     en: "to do",    pronoun: "on", correct: "robi",     wrong: ["robię", "robisz", "robią"] },
  { infinitive: "robić",     en: "to do",    pronoun: "my", correct: "robimy",   wrong: ["robię", "robi", "robicie"] },
  { infinitive: "móc",       en: "can",      pronoun: "ja", correct: "mogę",     wrong: ["możesz", "może", "możemy"] },
  { infinitive: "móc",       en: "can",      pronoun: "ty", correct: "możesz",   wrong: ["mogę", "może", "możecie"] },
  { infinitive: "móc",       en: "can",      pronoun: "on", correct: "może",     wrong: ["mogę", "możesz", "mogą"] },
  { infinitive: "móc",       en: "can",      pronoun: "my", correct: "możemy",   wrong: ["mogę", "może", "możecie"] },
  { infinitive: "chcieć",    en: "to want",  pronoun: "ja", correct: "chcę",     wrong: ["chcesz", "chce", "chcemy"] },
  { infinitive: "chcieć",    en: "to want",  pronoun: "ty", correct: "chcesz",   wrong: ["chcę", "chce", "chcecie"] },
  { infinitive: "chcieć",    en: "to want",  pronoun: "on", correct: "chce",     wrong: ["chcę", "chcesz", "chcą"] },
  { infinitive: "wiedzieć",  en: "to know",  pronoun: "ja", correct: "wiem",     wrong: ["wiesz", "wie", "wiemy"] },
  { infinitive: "wiedzieć",  en: "to know",  pronoun: "ty", correct: "wiesz",    wrong: ["wiem", "wie", "wiecie"] },
  { infinitive: "wiedzieć",  en: "to know",  pronoun: "on", correct: "wie",      wrong: ["wiem", "wiesz", "wiedzą"] },
];
// And in Spanish. Same principle again: the verbs worth drilling first are the
// irregular ones, every decoy is a real form of the same verb, and the four
// persons are the ones a beginner meets. The stem-changers (poder, querer,
// venir) are here because the change happens in three persons out of four and
// disappears in nosotros \u2014 which is exactly the shape nobody guesses.
const SPANISH_VERBS: typeof VERBS = [
  { infinitive: "ser",    en: "to be",    pronoun: "yo",       correct: "soy",      wrong: ["eres", "es", "somos"] },
  { infinitive: "ser",    en: "to be",    pronoun: "t\u00fa",       correct: "eres",     wrong: ["soy", "es", "sois"] },
  { infinitive: "ser",    en: "to be",    pronoun: "\u00e9l",       correct: "es",       wrong: ["soy", "eres", "son"] },
  { infinitive: "ser",    en: "to be",    pronoun: "nosotros", correct: "somos",    wrong: ["soy", "es", "sois"] },
  { infinitive: "estar",  en: "to be",    pronoun: "yo",       correct: "estoy",    wrong: ["est\u00e1s", "est\u00e1", "estamos"] },
  { infinitive: "estar",  en: "to be",    pronoun: "t\u00fa",       correct: "est\u00e1s",    wrong: ["estoy", "est\u00e1", "est\u00e1is"] },
  { infinitive: "estar",  en: "to be",    pronoun: "\u00e9l",       correct: "est\u00e1",     wrong: ["estoy", "est\u00e1s", "est\u00e1n"] },
  { infinitive: "estar",  en: "to be",    pronoun: "nosotros", correct: "estamos",  wrong: ["estoy", "est\u00e1", "est\u00e1is"] },
  { infinitive: "tener",  en: "to have",  pronoun: "yo",       correct: "tengo",    wrong: ["tienes", "tiene", "tenemos"] },
  { infinitive: "tener",  en: "to have",  pronoun: "t\u00fa",       correct: "tienes",   wrong: ["tengo", "tiene", "ten\u00e9is"] },
  { infinitive: "tener",  en: "to have",  pronoun: "\u00e9l",       correct: "tiene",    wrong: ["tengo", "tienes", "tienen"] },
  { infinitive: "tener",  en: "to have",  pronoun: "nosotros", correct: "tenemos",  wrong: ["tengo", "tiene", "ten\u00e9is"] },
  { infinitive: "ir",     en: "to go",    pronoun: "yo",       correct: "voy",      wrong: ["vas", "va", "vamos"] },
  { infinitive: "ir",     en: "to go",    pronoun: "t\u00fa",       correct: "vas",      wrong: ["voy", "va", "vais"] },
  { infinitive: "ir",     en: "to go",    pronoun: "\u00e9l",       correct: "va",       wrong: ["voy", "vas", "van"] },
  { infinitive: "ir",     en: "to go",    pronoun: "nosotros", correct: "vamos",    wrong: ["voy", "va", "vais"] },
  { infinitive: "hacer",  en: "to do",    pronoun: "yo",       correct: "hago",     wrong: ["haces", "hace", "hacemos"] },
  { infinitive: "hacer",  en: "to do",    pronoun: "t\u00fa",       correct: "haces",    wrong: ["hago", "hace", "hac\u00e9is"] },
  { infinitive: "hacer",  en: "to do",    pronoun: "\u00e9l",       correct: "hace",     wrong: ["hago", "haces", "hacen"] },
  { infinitive: "hacer",  en: "to do",    pronoun: "nosotros", correct: "hacemos",  wrong: ["hago", "hace", "hac\u00e9is"] },
  { infinitive: "poder",  en: "can",      pronoun: "yo",       correct: "puedo",    wrong: ["puedes", "puede", "podemos"] },
  { infinitive: "poder",  en: "can",      pronoun: "t\u00fa",       correct: "puedes",   wrong: ["puedo", "puede", "pod\u00e9is"] },
  { infinitive: "poder",  en: "can",      pronoun: "\u00e9l",       correct: "puede",    wrong: ["puedo", "puedes", "pueden"] },
  { infinitive: "poder",  en: "can",      pronoun: "nosotros", correct: "podemos",  wrong: ["puedo", "puede", "pueden"] },
  { infinitive: "querer", en: "to want",  pronoun: "yo",       correct: "quiero",   wrong: ["quieres", "quiere", "queremos"] },
  { infinitive: "querer", en: "to want",  pronoun: "t\u00fa",       correct: "quieres",  wrong: ["quiero", "quiere", "quer\u00e9is"] },
  { infinitive: "querer", en: "to want",  pronoun: "\u00e9l",       correct: "quiere",   wrong: ["quiero", "quieres", "quieren"] },
  { infinitive: "querer", en: "to want",  pronoun: "nosotros", correct: "queremos", wrong: ["quiero", "quiere", "quieren"] },
  { infinitive: "decir",  en: "to say",   pronoun: "yo",       correct: "digo",     wrong: ["dices", "dice", "decimos"] },
  { infinitive: "decir",  en: "to say",   pronoun: "t\u00fa",       correct: "dices",    wrong: ["digo", "dice", "dec\u00eds"] },
  { infinitive: "decir",  en: "to say",   pronoun: "\u00e9l",       correct: "dice",     wrong: ["digo", "dices", "dicen"] },
  { infinitive: "venir",  en: "to come",  pronoun: "yo",       correct: "vengo",    wrong: ["vienes", "viene", "venimos"] },
  { infinitive: "venir",  en: "to come",  pronoun: "t\u00fa",       correct: "vienes",   wrong: ["vengo", "viene", "ven\u00eds"] },
  { infinitive: "venir",  en: "to come",  pronoun: "\u00e9l",       correct: "viene",    wrong: ["vengo", "vienes", "vienen"] },
  { infinitive: "ver",    en: "to see",   pronoun: "yo",       correct: "veo",      wrong: ["ves", "ve", "vemos"] },
  { infinitive: "ver",    en: "to see",   pronoun: "t\u00fa",       correct: "ves",      wrong: ["veo", "ve", "veis"] },
  { infinitive: "ver",    en: "to see",   pronoun: "\u00e9l",       correct: "ve",       wrong: ["veo", "ves", "ven"] },
  { infinitive: "saber",  en: "to know",  pronoun: "yo",       correct: "s\u00e9",       wrong: ["sabes", "sabe", "sabemos"] },
  { infinitive: "saber",  en: "to know",  pronoun: "t\u00fa",       correct: "sabes",    wrong: ["s\u00e9", "sabe", "sab\u00e9is"] },
  { infinitive: "saber",  en: "to know",  pronoun: "\u00e9l",       correct: "sabe",     wrong: ["s\u00e9", "sabes", "saben"] },
];

const COLS = 5;
const CELL_W = 90;
const W = COLS * CELL_W;
const H = 420;
const ROWS = Math.floor(H / 52);

interface Invader {
  id: number;
  col: number;
  row: number; // fractional
  text: string;
  isCorrect: boolean;
  hit: boolean;
}

interface Bullet {
  id: number;
  col: number;
  row: number;
}

let invId = 0;
let bulletId = 0;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickVerb(verbs: typeof VERBS) {
  return verbs[Math.floor(Math.random() * verbs.length)];
}

// And in Italian. The same principle a third time: the verbs worth drilling
// first are the irregular ones, every decoy is a real form of the same verb,
// and the four persons are the ones a beginner meets. essere and stare are
// both here because Italian splits being between them, and potere, volere and
// dovere because their stems change in three persons out of four and settle
// back down in noi \u2014 which is exactly the shape nobody guesses.
const ITALIAN_VERBS: typeof VERBS = [
  { infinitive: "essere", en: "to be", pronoun: "io", correct: "sono", wrong: ["sei", "è", "siamo"] },
  { infinitive: "essere", en: "to be", pronoun: "tu", correct: "sei", wrong: ["sono", "è", "siete"] },
  { infinitive: "essere", en: "to be", pronoun: "lui", correct: "è", wrong: ["sono", "sei", "siete"] },
  { infinitive: "essere", en: "to be", pronoun: "noi", correct: "siamo", wrong: ["sono", "è", "siete"] },
  { infinitive: "stare", en: "to be", pronoun: "io", correct: "sto", wrong: ["stai", "sta", "stiamo"] },
  { infinitive: "stare", en: "to be", pronoun: "tu", correct: "stai", wrong: ["sto", "sta", "state"] },
  { infinitive: "stare", en: "to be", pronoun: "lui", correct: "sta", wrong: ["sto", "stai", "stanno"] },
  { infinitive: "stare", en: "to be", pronoun: "noi", correct: "stiamo", wrong: ["sto", "sta", "state"] },
  { infinitive: "avere", en: "to have", pronoun: "io", correct: "ho", wrong: ["hai", "ha", "abbiamo"] },
  { infinitive: "avere", en: "to have", pronoun: "tu", correct: "hai", wrong: ["ho", "ha", "avete"] },
  { infinitive: "avere", en: "to have", pronoun: "lui", correct: "ha", wrong: ["ho", "hai", "hanno"] },
  { infinitive: "avere", en: "to have", pronoun: "noi", correct: "abbiamo", wrong: ["ho", "ha", "avete"] },
  { infinitive: "andare", en: "to go", pronoun: "io", correct: "vado", wrong: ["vai", "va", "andiamo"] },
  { infinitive: "andare", en: "to go", pronoun: "tu", correct: "vai", wrong: ["vado", "va", "andate"] },
  { infinitive: "andare", en: "to go", pronoun: "lui", correct: "va", wrong: ["vado", "vai", "vanno"] },
  { infinitive: "andare", en: "to go", pronoun: "noi", correct: "andiamo", wrong: ["vado", "va", "andate"] },
  { infinitive: "fare", en: "to do", pronoun: "io", correct: "faccio", wrong: ["fai", "fa", "facciamo"] },
  { infinitive: "fare", en: "to do", pronoun: "tu", correct: "fai", wrong: ["faccio", "fa", "fate"] },
  { infinitive: "fare", en: "to do", pronoun: "lui", correct: "fa", wrong: ["faccio", "fai", "fanno"] },
  { infinitive: "fare", en: "to do", pronoun: "noi", correct: "facciamo", wrong: ["faccio", "fa", "fate"] },
  { infinitive: "potere", en: "to be able", pronoun: "io", correct: "posso", wrong: ["puoi", "può", "possiamo"] },
  { infinitive: "potere", en: "to be able", pronoun: "tu", correct: "puoi", wrong: ["posso", "può", "potete"] },
  { infinitive: "potere", en: "to be able", pronoun: "lui", correct: "può", wrong: ["posso", "puoi", "possono"] },
  { infinitive: "potere", en: "to be able", pronoun: "noi", correct: "possiamo", wrong: ["posso", "può", "potete"] },
  { infinitive: "volere", en: "to want", pronoun: "io", correct: "voglio", wrong: ["vuoi", "vuole", "vogliamo"] },
  { infinitive: "volere", en: "to want", pronoun: "tu", correct: "vuoi", wrong: ["voglio", "vuole", "volete"] },
  { infinitive: "volere", en: "to want", pronoun: "lui", correct: "vuole", wrong: ["voglio", "vuoi", "vogliono"] },
  { infinitive: "volere", en: "to want", pronoun: "noi", correct: "vogliamo", wrong: ["voglio", "vuole", "volete"] },
  { infinitive: "venire", en: "to come", pronoun: "io", correct: "vengo", wrong: ["vieni", "viene", "veniamo"] },
  { infinitive: "venire", en: "to come", pronoun: "tu", correct: "vieni", wrong: ["vengo", "viene", "venite"] },
  { infinitive: "venire", en: "to come", pronoun: "lui", correct: "viene", wrong: ["vengo", "vieni", "vengono"] },
  { infinitive: "venire", en: "to come", pronoun: "noi", correct: "veniamo", wrong: ["vengo", "viene", "venite"] },
  { infinitive: "dovere", en: "to have to", pronoun: "io", correct: "devo", wrong: ["devi", "deve", "dobbiamo"] },
  { infinitive: "dovere", en: "to have to", pronoun: "tu", correct: "devi", wrong: ["devo", "deve", "dovete"] },
  { infinitive: "dovere", en: "to have to", pronoun: "lui", correct: "deve", wrong: ["devo", "devi", "devono"] },
  { infinitive: "dovere", en: "to have to", pronoun: "noi", correct: "dobbiamo", wrong: ["devo", "deve", "dovete"] },
  { infinitive: "sapere", en: "to know", pronoun: "io", correct: "so", wrong: ["sai", "sa", "sappiamo"] },
  { infinitive: "sapere", en: "to know", pronoun: "tu", correct: "sai", wrong: ["so", "sa", "sapete"] },
  { infinitive: "sapere", en: "to know", pronoun: "lui", correct: "sa", wrong: ["so", "sai", "sanno"] },
  { infinitive: "sapere", en: "to know", pronoun: "noi", correct: "sappiamo", wrong: ["so", "sa", "sapete"] },
];

export default function VerbShooter() {
  const { learningDirection } = useGameContent();
  const sides = courseSides(learningDirection);
  const learnsEnglish = sides.target.code === "en";
  const learnsFrench = sides.target.code === "fr";
  const learnsPolish = sides.target.code === "pl";
  const learnsSpanish = sides.target.code === "es";
  const learnsItalian = sides.target.code === "it";

  const buildPrompt = useCallback(() => {
    // French, Polish and Spanish each have their own table; English is derived
    // from the German one, because the two are the same sentences read the
    // other way round.
    const source = pickVerb(
      learnsFrench ? FRENCH_VERBS
        : learnsPolish ? POLISH_VERBS
        : learnsSpanish ? SPANISH_VERBS
        : learnsItalian ? ITALIAN_VERBS
        : VERBS
    );
    if (!learnsEnglish) return source;

    const pronouns: Record<string, string> = {
      du: "you",
      er: "he",
      ich: "I",
      wir: "we",
    };
    const pronoun = pronouns[source.pronoun] ?? source.pronoun;
    const base = source.en.replace(/^to\s+/i, "");
    const thirdPerson = pronoun === "he";
    let correct = base;
    if (base === "be") correct = pronoun === "I" ? "am" : thirdPerson ? "is" : "are";
    else if (base === "have") correct = thirdPerson ? "has" : "have";
    else if (thirdPerson) correct = /(?:s|sh|ch|x|z|o)$/i.test(base) ? `${base}es` : `${base}s`;

    const decoys = base === "be"
      ? ["am", "is", "are", "be"]
      : base === "have"
        ? ["have", "has", "had", "having"]
        : [base, `${base}s`, `${base}es`, `${base}ed`];

    return {
      correct,
      en: source.infinitive,
      infinitive: base,
      pronoun,
      wrong: Array.from(new Set(decoys.filter((value) => value !== correct))).slice(0, 3),
    };
  }, [learnsEnglish, learnsFrench, learnsPolish]);

  const [verb, setVerb] = useState(() => buildPrompt());
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [cannonCol, setCannonCol] = useState(Math.floor(COLS / 2));
  const [phase, setPhase] = useState<"idle" | "playing" | "won" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("verbshooter-hs") ?? "0", 10); } catch { return 0; }
  });
  const [wrongFlash, setWrongFlash] = useState(false);
  const [streak, setStreak] = useState(0);

  const stateRef = useRef({ invaders, bullets, cannonCol, verb, phase, score, streak });
  useEffect(() => { stateRef.current = { invaders, bullets, cannonCol, verb, phase, score, streak }; });

  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnWave = useCallback((v: typeof verb) => {
    const options = shuffle([v.correct, ...v.wrong.slice(0, 3)]);
    const cols = shuffle([0, 1, 2, 3, 4]).slice(0, options.length);
    setInvaders(options.map((text, i) => ({
      id: invId++,
      col: cols[i],
      row: 0,
      text,
      isCorrect: text === v.correct,
      hit: false,
    })));
  }, []);

  const nextRound = useCallback(() => {
    const v = buildPrompt();
    setVerb(v);
    setBullets([]);
    spawnWave(v);
  }, [buildPrompt, spawnWave]);

  const newGame = useCallback(() => {
    const v = buildPrompt();
    setVerb(v);
    setScore(0);
    setStreak(0);
    setCannonCol(Math.floor(COLS / 2));
    setBullets([]);
    setPhase("playing");
    spawnWave(v);
  }, [buildPrompt, spawnWave]);

  // Fall + bullet loop
  useEffect(() => {
    if (phase !== "playing") { clearInterval(loopRef.current!); return; }
    loopRef.current = setInterval(() => {
      const { invaders, bullets, verb, score, streak } = stateRef.current;
      const speed = 0.06 + Math.min(streak * 0.008, 0.12);

      // Move invaders
      let gameOver = false;
      const newInvaders = invaders
        .filter(inv => !inv.hit)
        .map(inv => {
          const newRow = inv.row + speed;
          if (newRow >= ROWS - 1) {
            if (inv.isCorrect) gameOver = true; // correct answer reached bottom
            return { ...inv, row: newRow, hit: true }; // remove it
          }
          return { ...inv, row: newRow };
        })
        .filter(inv => !inv.hit || inv.row < ROWS - 1);

      // Move bullets up
      const newBullets = bullets
        .map(b => ({ ...b, row: b.row - 0.8 }))
        .filter(b => b.row > 0);

      // Collision detection
      let newScore = score;
      let newStreak = streak;
      let won = false;
      const survivingInvaders: Invader[] = [];
      const survivingBullets: Bullet[] = [...newBullets];

      for (const inv of newInvaders) {
        let hit = false;
        for (let bi = survivingBullets.length - 1; bi >= 0; bi--) {
          const b = survivingBullets[bi];
          if (b.col === inv.col && Math.abs(b.row - inv.row) < 1.2) {
            survivingBullets.splice(bi, 1);
            hit = true;
            if (inv.isCorrect) {
              newScore += 25 + newStreak * 5;
              newStreak++;
              won = true;
            } else {
              // Shot wrong answer — game over
              gameOver = true;
            }
            break;
          }
        }
        if (!hit) survivingInvaders.push(inv);
      }

      if (gameOver) {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 400);
        setPhase("wrong");
        return;
      }

      setInvaders(survivingInvaders);
      setBullets(survivingBullets);
      setScore(newScore);
      setStreak(newStreak);

      if (won) {
        if (newScore > highScore) {
          setHighScore(newScore);
          try { localStorage.setItem("verbshooter-hs", String(newScore)); } catch {}
        }
        setTimeout(() => {
          // "j'" runs straight into its verb; every other pronoun takes a space.
          const spoken = verb.pronoun.endsWith("'")
            ? `${verb.pronoun}${verb.correct}`
            : `${verb.pronoun} ${verb.correct}`;
          if (learnsEnglish || learnsFrench || learnsPolish) void tts(spoken, 0.9, sides.target.voice);
          else speakGerman(spoken);
        }, 200);
        recordWordMastery(`${verb.infinitive}:${verb.pronoun}`);
        // Brief pause then next round
        setTimeout(() => {
          if (stateRef.current.phase === "playing") nextRound();
        }, 800);
      }
    }, 50);
    return () => clearInterval(loopRef.current!);
  }, [phase, highScore, learnsEnglish, learnsFrench, learnsPolish, sides.target.voice, nextRound]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); setCannonCol(c => Math.max(0, c - 1)); }
      if (e.key === "ArrowRight") { e.preventDefault(); setCannonCol(c => Math.min(COLS - 1, c + 1)); }
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        const { cannonCol, invaders } = stateRef.current;
        // Only fire if no bullet already in that col
        setBullets(prev => {
          if (prev.some(b => b.col === cannonCol)) return prev;
          return [...prev, { id: bulletId++, col: cannonCol, row: ROWS - 2 }];
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  const fire = () => {
    if (phase !== "playing") return;
    const { cannonCol } = stateRef.current;
    setBullets(prev => {
      if (prev.some(b => b.col === cannonCol)) return prev;
      return [...prev, { id: bulletId++, col: cannonCol, row: ROWS - 2 }];
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">{ui("Verb Shooter")}</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          {ui("Shoot the right form of the verb before it reaches you.")}
        </p>
      </div>

      {/* Prompt card */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs text-[var(--text-3)]">
            {uiFmt("Complete the {language} sentence", { language: ui(sides.target.label) })}
          </p>
          <p className="mt-1 text-xl font-bold text-[var(--text-1)]">
            <span className="text-[var(--accent)]">{verb.pronoun}</span>{" "}
            <span className="rounded border border-dashed border-[var(--border)] px-3 py-0.5 text-[var(--text-3)]">???</span>
          </p>
          <p className="mt-1 text-xs text-[var(--text-3)]">
            {verb.pronoun} ___ ({verb.en} · {verb.infinitive})
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">{ui("Score")}</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{score}</p>
          </div>
          {streak > 1 && (
            <div className="text-center">
              <p className="text-xs text-[var(--text-3)]">{ui("Streak")}</p>
              <p className="text-2xl font-bold text-amber-400">×{streak}</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">{ui("Best")}</p>
            <div className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <p className="text-2xl font-bold text-[var(--text-1)]">{highScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game board */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={`relative overflow-hidden rounded-2xl border transition-all ${
            wrongFlash ? "border-rose-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]" : "border-[var(--border)]"
          }`}
          style={{ width: W, height: H, background: "var(--surface)", maxWidth: "100%" }}
        >
          {/* Grid lines */}
          <svg className="pointer-events-none absolute inset-0 opacity-[0.04]" width={W} height={H}>
            {Array.from({ length: COLS + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * CELL_W} y1={0} x2={i * CELL_W} y2={H} stroke="currentColor" />
            ))}
          </svg>

          {/* Invaders */}
          {invaders.map(inv => (
            <div
              key={inv.id}
              className={`absolute flex items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
                inv.isCorrect
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] shadow-[0_0_10px_rgba(88,230,217,0.3)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]"
              }`}
              style={{
                left: inv.col * CELL_W + 6,
                top: inv.row * 52,
                width: CELL_W - 12,
                height: 40,
              }}
            >
              {inv.text}
            </div>
          ))}

          {/* Bullets */}
          {bullets.map(b => (
            <div
              key={b.id}
              className="absolute rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(88,230,217,0.6)]"
              style={{
                left: b.col * CELL_W + CELL_W / 2 - 3,
                top: b.row * 52,
                width: 6,
                height: 16,
              }}
            />
          ))}

          {/* Cannon */}
          {phase === "playing" && (
            <motion.div
              animate={{ left: cannonCol * CELL_W + CELL_W / 2 - 18 }}
              className="absolute bottom-3 flex h-10 w-9 flex-col items-center justify-end"
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
            >
              <div className="h-6 w-4 rounded-t-full bg-[var(--accent)]" />
              <div className="h-4 w-9 rounded-lg bg-[var(--accent)]/70" />
            </motion.div>
          )}

          {/* Overlay */}
          <AnimatePresence>
            {phase !== "playing" && (
              <motion.div
                animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
                style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
              >
                {phase === "idle" && (
                  <>
                    <p className="text-lg font-semibold text-[var(--text-1)]">{ui("Verb Shooter")}</p>
                    <p className="max-w-xs text-center text-sm text-[var(--text-3)]">
                      {ui("Move with ← → and shoot with Space. Hit the right form of the verb. Wrong answer = game over.")}
                    </p>
                    <button className="accent-btn px-6 py-2.5 text-sm" onClick={newGame} type="button">{ui("Start game")}</button>
                  </>
                )}
                {phase === "wrong" && (
                  <>
                    <p className="text-lg font-semibold text-rose-400">{ui("Wrong!")}</p>
                    <p className="text-sm text-[var(--text-3)]">
                      <span className="font-bold text-[var(--text-1)]">{verb.pronoun}</span>{" "}
                      <span className="font-bold text-[var(--accent)]">{verb.correct}</span>
                    </p>
                    <p className="text-xs text-[var(--text-3)]">
                      {learnsEnglish
                        ? `${verb.en} = ${verb.pronoun} ${verb.correct}`
                        : `${verb.pronoun} ${verb.correct} = ${verb.en}`}
                    </p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={newGame} type="button">
                      <RotateCcw className="h-4 w-4" /> {ui("Try again")}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile controls */}
        <div className="flex gap-3 lg:hidden">
          {(["←", "🔫", "→"] as const).map((label, i) => (
            <button
              key={i}
              className="flex h-12 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] active:bg-[var(--accent-dim)] active:text-[var(--accent)]"
              onPointerDown={() => {
                if (i === 0) setCannonCol(c => Math.max(0, c - 1));
                else if (i === 2) setCannonCol(c => Math.min(COLS - 1, c + 1));
                else fire();
              }}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--text-3)]">
          {ui("← → to move · Space to shoot · Hit the right form of the verb")}
        </p>
      </div>
    </div>
  );
}
