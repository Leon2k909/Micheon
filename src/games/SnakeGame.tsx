import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Trophy, Volume2, Settings, X, Check, Maximize, Minimize } from "lucide-react";
import { speakGerman } from "@/lib/tts";
import { allPartBlueprints, entryFallbacks } from "@/lib/data";
import { recordWordMastery } from "@/lib/mastery";

// ── Build word bank from all part blueprints + entryFallbacks + extended list ──
const EXTENDED_WORDS: { de: string; en: string }[] = [
  { de: "Hund", en: "dog" }, { de: "Katze", en: "cat" }, { de: "Maus", en: "mouse" },
  { de: "Vogel", en: "bird" }, { de: "Fisch", en: "fish" }, { de: "Pferd", en: "horse" },
  { de: "Kuh", en: "cow" }, { de: "Schwein", en: "pig" }, { de: "Schaf", en: "sheep" },
  { de: "Buch", en: "book" }, { de: "Tisch", en: "table" }, { de: "Stuhl", en: "chair" },
  { de: "Tür", en: "door" }, { de: "Wand", en: "wall" }, { de: "Boden", en: "floor" },
  { de: "Dach", en: "roof" }, { de: "Treppe", en: "stairs" }, { de: "Garten", en: "garden" },
  { de: "Zimmer", en: "room" }, { de: "Küche", en: "kitchen" }, { de: "Bad", en: "bathroom" },
  { de: "Schrank", en: "cupboard" }, { de: "Lampe", en: "lamp" }, { de: "Spiegel", en: "mirror" },
  { de: "Uhr", en: "clock" }, { de: "Telefon", en: "phone" }, { de: "Schlüssel", en: "key" },
  { de: "Tasche", en: "bag" }, { de: "Geldbörse", en: "wallet" }, { de: "Brille", en: "glasses" },
  { de: "Hemd", en: "shirt" }, { de: "Hose", en: "trousers" }, { de: "Jacke", en: "jacket" },
  { de: "Schuhe", en: "shoes" }, { de: "Socken", en: "socks" }, { de: "Mütze", en: "hat" },
  { de: "Kleid", en: "dress" }, { de: "Rock", en: "skirt" }, { de: "Mantel", en: "coat" },
  { de: "Wasser", en: "water" }, { de: "Saft", en: "juice" }, { de: "Bier", en: "beer" },
  { de: "Wein", en: "wine" }, { de: "Suppe", en: "soup" }, { de: "Salat", en: "salad" },
  { de: "Fleisch", en: "meat" }, { de: "Käse", en: "cheese" }, { de: "Ei", en: "egg" },
  { de: "Butter", en: "butter" }, { de: "Zucker", en: "sugar" }, { de: "Salz", en: "salt" },
  { de: "Pfeffer", en: "pepper" }, { de: "Kuchen", en: "cake" }, { de: "Eis", en: "ice cream" },
  { de: "Obst", en: "fruit" }, { de: "Gemüse", en: "vegetables" }, { de: "Kartoffel", en: "potato" },
  { de: "Tomate", en: "tomato" }, { de: "Zwiebel", en: "onion" }, { de: "Karotte", en: "carrot" },
  { de: "Banane", en: "banana" }, { de: "Orange", en: "orange" }, { de: "Erdbeere", en: "strawberry" },
  { de: "Zug", en: "train" }, { de: "Bus", en: "bus" }, { de: "Auto", en: "car" },
  { de: "Fahrrad", en: "bicycle" }, { de: "Flugzeug", en: "aeroplane" }, { de: "Schiff", en: "ship" },
  { de: "Straße", en: "street" }, { de: "Brücke", en: "bridge" }, { de: "Kreuzung", en: "crossroads" },
  { de: "Ampel", en: "traffic light" }, { de: "Parkplatz", en: "car park" }, { de: "Hafen", en: "harbour" },
  { de: "Flughafen", en: "airport" }, { de: "Krankenhaus", en: "hospital" }, { de: "Apotheke", en: "pharmacy" },
  { de: "Supermarkt", en: "supermarket" }, { de: "Markt", en: "market" }, { de: "Bank", en: "bank" },
  { de: "Post", en: "post office" }, { de: "Hotel", en: "hotel" }, { de: "Restaurant", en: "restaurant" },
  { de: "Café", en: "café" }, { de: "Kino", en: "cinema" }, { de: "Theater", en: "theatre" },
  { de: "Museum", en: "museum" }, { de: "Bibliothek", en: "library" }, { de: "Park", en: "park" },
  { de: "Strand", en: "beach" }, { de: "Berg", en: "mountain" }, { de: "Fluss", en: "river" },
  { de: "See", en: "lake" }, { de: "Wald", en: "forest" }, { de: "Wiese", en: "meadow" },
  { de: "Himmel", en: "sky" }, { de: "Sonne", en: "sun" }, { de: "Mond", en: "moon" },
  { de: "Stern", en: "star" }, { de: "Wolke", en: "cloud" }, { de: "Regen", en: "rain" },
  { de: "Schnee", en: "snow" }, { de: "Wind", en: "wind" }, { de: "Sturm", en: "storm" },
  { de: "Frühling", en: "spring" }, { de: "Sommer", en: "summer" }, { de: "Herbst", en: "autumn" },
  { de: "Winter", en: "winter" }, { de: "Montag", en: "Monday" }, { de: "Dienstag", en: "Tuesday" },
  { de: "Mittwoch", en: "Wednesday" }, { de: "Donnerstag", en: "Thursday" }, { de: "Freitag", en: "Friday" },
  { de: "Samstag", en: "Saturday" }, { de: "Sonntag", en: "Sunday" },
  { de: "Januar", en: "January" }, { de: "Februar", en: "February" }, { de: "März", en: "March" },
  { de: "April", en: "April" }, { de: "Mai", en: "May" }, { de: "Juni", en: "June" },
  { de: "Juli", en: "July" }, { de: "August", en: "August" }, { de: "September", en: "September" },
  { de: "Oktober", en: "October" }, { de: "November", en: "November" }, { de: "Dezember", en: "December" },
  { de: "Kopf", en: "head" }, { de: "Gesicht", en: "face" }, { de: "Auge", en: "eye" },
  { de: "Ohr", en: "ear" }, { de: "Nase", en: "nose" }, { de: "Mund", en: "mouth" },
  { de: "Zahn", en: "tooth" }, { de: "Haar", en: "hair" }, { de: "Hals", en: "neck" },
  { de: "Schulter", en: "shoulder" }, { de: "Arm", en: "arm" }, { de: "Hand", en: "hand" },
  { de: "Finger", en: "finger" }, { de: "Bein", en: "leg" }, { de: "Fuß", en: "foot" },
  { de: "Herz", en: "heart" }, { de: "Rücken", en: "back" }, { de: "Bauch", en: "stomach" },
  { de: "Mutter", en: "mother" }, { de: "Vater", en: "father" }, { de: "Bruder", en: "brother" },
  { de: "Schwester", en: "sister" }, { de: "Sohn", en: "son" }, { de: "Tochter", en: "daughter" },
  { de: "Großmutter", en: "grandmother" }, { de: "Großvater", en: "grandfather" },
  { de: "Onkel", en: "uncle" }, { de: "Tante", en: "aunt" }, { de: "Cousin", en: "cousin" },
  { de: "Mann", en: "man" }, { de: "Frau", en: "woman" }, { de: "Junge", en: "boy" },
  { de: "Mädchen", en: "girl" }, { de: "Baby", en: "baby" }, { de: "Lehrer", en: "teacher" },
  { de: "Arzt", en: "doctor" }, { de: "Polizist", en: "police officer" }, { de: "Koch", en: "cook" },
  { de: "Schüler", en: "pupil" }, { de: "Student", en: "student" }, { de: "Chef", en: "boss" },
  { de: "Kollege", en: "colleague" }, { de: "Nachbar", en: "neighbour" },
  { de: "Farbe", en: "colour" }, { de: "Rot", en: "red" }, { de: "Blau", en: "blue" },
  { de: "Grün", en: "green" }, { de: "Gelb", en: "yellow" }, { de: "Schwarz", en: "black" },
  { de: "Weiß", en: "white" }, { de: "Grau", en: "grey" }, { de: "Braun", en: "brown" },
  { de: "Orange", en: "orange" }, { de: "Lila", en: "purple" }, { de: "Rosa", en: "pink" },
  { de: "Groß", en: "big" }, { de: "Klein", en: "small" }, { de: "Lang", en: "long" },
  { de: "Kurz", en: "short" }, { de: "Schnell", en: "fast" }, { de: "Langsam", en: "slow" },
  { de: "Alt", en: "old" }, { de: "Neu", en: "new" }, { de: "Gut", en: "good" },
  { de: "Schlecht", en: "bad" }, { de: "Schön", en: "beautiful" }, { de: "Hässlich", en: "ugly" },
  { de: "Warm", en: "warm" }, { de: "Kalt", en: "cold" }, { de: "Heiß", en: "hot" },
  { de: "Laut", en: "loud" }, { de: "Leise", en: "quiet" }, { de: "Schwer", en: "heavy" },
  { de: "Leicht", en: "light" }, { de: "Teuer", en: "expensive" }, { de: "Billig", en: "cheap" },
  { de: "Richtig", en: "correct" }, { de: "Falsch", en: "wrong" }, { de: "Einfach", en: "easy" },
  { de: "Schwierig", en: "difficult" }, { de: "Sauber", en: "clean" }, { de: "Schmutzig", en: "dirty" },
  { de: "Lesen", en: "to read" }, { de: "Schreiben", en: "to write" }, { de: "Hören", en: "to hear" },
  { de: "Sehen", en: "to see" }, { de: "Essen", en: "to eat" }, { de: "Trinken", en: "to drink" },
  { de: "Schlafen", en: "to sleep" }, { de: "Laufen", en: "to run" }, { de: "Gehen", en: "to go" },
  { de: "Kommen", en: "to come" }, { de: "Stehen", en: "to stand" }, { de: "Sitzen", en: "to sit" },
  { de: "Liegen", en: "to lie" }, { de: "Spielen", en: "to play" }, { de: "Singen", en: "to sing" },
  { de: "Tanzen", en: "to dance" }, { de: "Schwimmen", en: "to swim" }, { de: "Fliegen", en: "to fly" },
  { de: "Öffnen", en: "to open" }, { de: "Schließen", en: "to close" }, { de: "Suchen", en: "to search" },
  { de: "Finden", en: "to find" }, { de: "Geben", en: "to give" }, { de: "Nehmen", en: "to take" },
  { de: "Bringen", en: "to bring" }, { de: "Zeigen", en: "to show" }, { de: "Fragen", en: "to ask" },
  { de: "Antworten", en: "to answer" }, { de: "Denken", en: "to think" }, { de: "Wissen", en: "to know" },
  { de: "Verstehen", en: "to understand" }, { de: "Vergessen", en: "to forget" },
  { de: "Erinnern", en: "to remember" }, { de: "Beginnen", en: "to begin" }, { de: "Enden", en: "to end" },
  { de: "Helfen", en: "to help" }, { de: "Brauchen", en: "to need" }, { de: "Wollen", en: "to want" },
  { de: "Können", en: "can" }, { de: "Müssen", en: "must" }, { de: "Dürfen", en: "may" },
  { de: "Sollen", en: "should" }, { de: "Mögen", en: "to like" }, { de: "Lieben", en: "to love" },
  { de: "Hassen", en: "to hate" }, { de: "Hoffen", en: "to hope" }, { de: "Glauben", en: "to believe" },
  { de: "Nummer", en: "number" }, { de: "Name", en: "name" }, { de: "Adresse", en: "address" },
  { de: "Sprache", en: "language" }, { de: "Wort", en: "word" }, { de: "Satz", en: "sentence" },
  { de: "Frage", en: "question" }, { de: "Antwort", en: "answer" }, { de: "Fehler", en: "mistake" },
  { de: "Beispiel", en: "example" }, { de: "Übung", en: "exercise" }, { de: "Prüfung", en: "exam" },
  { de: "Note", en: "grade" }, { de: "Klasse", en: "class" }, { de: "Unterricht", en: "lesson" },
  { de: "Hausaufgabe", en: "homework" }, { de: "Stift", en: "pen" }, { de: "Bleistift", en: "pencil" },
  { de: "Papier", en: "paper" }, { de: "Heft", en: "notebook" }, { de: "Tafel", en: "blackboard" },
  { de: "Computer", en: "computer" }, { de: "Handy", en: "mobile phone" }, { de: "Internet", en: "internet" },
  { de: "Musik", en: "music" }, { de: "Film", en: "film" }, { de: "Sport", en: "sport" },
  { de: "Fußball", en: "football" }, { de: "Tennis", en: "tennis" }, { de: "Schwimmen", en: "swimming" },
  { de: "Reise", en: "journey" }, { de: "Urlaub", en: "holiday" }, { de: "Koffer", en: "suitcase" },
  { de: "Pass", en: "passport" }, { de: "Visum", en: "visa" }, { de: "Karte", en: "map" },
  { de: "Geld", en: "money" }, { de: "Preis", en: "price" }, { de: "Rechnung", en: "bill" },
  { de: "Quittung", en: "receipt" }, { de: "Rabatt", en: "discount" }, { de: "Angebot", en: "offer" },
  { de: "Zeit", en: "time" }, { de: "Stunde", en: "hour" }, { de: "Minute", en: "minute" },
  { de: "Sekunde", en: "second" }, { de: "Morgen", en: "morning" }, { de: "Mittag", en: "midday" },
  { de: "Abend", en: "evening" }, { de: "Nacht", en: "night" }, { de: "Heute", en: "today" },
  { de: "Gestern", en: "yesterday" }, { de: "Übermorgen", en: "day after tomorrow" },
  { de: "Jetzt", en: "now" }, { de: "Später", en: "later" }, { de: "Früher", en: "earlier" },
  { de: "Immer", en: "always" }, { de: "Nie", en: "never" }, { de: "Manchmal", en: "sometimes" },
  { de: "Oft", en: "often" }, { de: "Selten", en: "rarely" }, { de: "Hier", en: "here" },
  { de: "Dort", en: "there" }, { de: "Oben", en: "above" }, { de: "Unten", en: "below" },
  { de: "Links", en: "left" }, { de: "Rechts", en: "right" }, { de: "Geradeaus", en: "straight ahead" },
  { de: "Neben", en: "next to" }, { de: "Zwischen", en: "between" }, { de: "Hinter", en: "behind" },
  { de: "Vor", en: "in front of" }, { de: "Über", en: "over" }, { de: "Unter", en: "under" },
];

// article is stored separately so showArticle toggle works
type WordEntry = { de: string; en: string; article?: string };

function buildWordBank(): WordEntry[] {
  const seen = new Set<string>();
  const bank: WordEntry[] = [];

  const add = (de: string, en: string, article?: string) => {
    const key = de.toLowerCase().trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    bank.push({ de, en, article });
  };

  // From blueprint seeds — use seed.de for display word, seed.article for article
  for (const part of Object.values(allPartBlueprints)) {
    for (const seed of (part as any).seeds ?? []) {
      // seed.de may be "die Woche" or "wohnen" — strip article prefix for the word
      const full: string = seed.de ?? "";
      const articleMatch = full.match(/^(der|die|das)\s+/i);
      const word = articleMatch ? full.slice(articleMatch[0].length).trim() : full.trim();
      if (!word) continue;
      add(word, seed.fallbackEn ?? word, seed.article ?? articleMatch?.[1]?.toLowerCase());
    }
  }

  // From entryFallbacks
  for (const entry of Object.values(entryFallbacks)) {
    const e = entry as any;
    add(e.word ?? "", (e.glosses?.[0] ?? ""));
  }

  // Extended list
  for (const { de, en } of EXTENDED_WORDS) {
    add(de, en);
  }

  return bank;
}

const WORD_BANK = buildWordBank();

function getWordWithArticle(entry: WordEntry, showArticle: boolean): string {
  const word = entry.de.toUpperCase();
  if (!showArticle || !entry.article) return word;
  return `${entry.article.toUpperCase()} ${word}`;
}

const BASE_COLS = 20;
const BASE_ROWS = 16;
const BASE_CELL = 28; // px

// ── Sentence bank from blueprint phrases + dialogues ──────────
type SentenceEntry = { de: string; en: string; words: string[] };

function buildSentenceBank(): SentenceEntry[] {
  const bank: SentenceEntry[] = [];
  const seen = new Set<string>();
  const add = (de: string, en: string) => {
    const key = de.trim().toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    // Strip punctuation for word splitting, keep original for display
    const words = de.trim().replace(/[.,!?]/g, "").split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 8) return; // keep manageable
    bank.push({ de: de.trim(), en, words });
  };
  for (const part of Object.values(allPartBlueprints)) {
    const p = part as any;
    for (const ph of p.phrases ?? []) add(ph.de, ph.en);
    for (const d of p.dialogues ?? []) {
      for (const line of d.lines ?? []) add(line.de, line.en);
    }
  }
  return bank;
}

const SENTENCE_BANK = buildSentenceBank();

type Pos = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Tile {
  pos: Pos;
  letter: string;
  id: number;
  isTarget: boolean; // is this the next letter needed?
}

// Sentence mode tile — each tile is a whole word
interface WordTile {
  pos: Pos;
  word: string;
  id: number;
  isTarget: boolean;
}

function spawnWordTiles(words: string[], nextIdx: number, snake: Pos[], cols: number, rows: number, classic = false): WordTile[] {
  const occupied = [...snake];
  const tiles: WordTile[] = [];
  // Spawn the target word + up to 4 decoy words from other sentences
  const needed = words[nextIdx];
  if (!needed) return [];

  const pos = randomPos(occupied, cols, rows);
  occupied.push(pos);
  tiles.push({ pos, word: needed, id: Date.now() + Math.random(), isTarget: true });

  if (!classic) {
    const allWords = SENTENCE_BANK.flatMap(s => s.words);
    const decoys = allWords.filter(w => w.toLowerCase() !== needed.toLowerCase());
    const DECOY_COUNT = Math.min(5, words.length + 1);
    let attempts = 0;
    while (tiles.length < DECOY_COUNT && attempts < 200) {
      attempts++;
      const decoy = decoys[Math.floor(Math.random() * decoys.length)];
      if (tiles.some(t => t.word === decoy)) continue;
      const p = randomPos(occupied, cols, rows);
      occupied.push(p);
      tiles.push({ pos: p, word: decoy, id: Date.now() + Math.random(), isTarget: false });
    }
  }
  return tiles;
}

function randomPos(exclude: Pos[], cols: number, rows: number): Pos {
  let pos: Pos;
  let attempts = 0;
  do {
    pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    attempts++;
  } while (exclude.some((p) => p.x === pos.x && p.y === pos.y) && attempts < 100);
  return pos;
}

function posEq(a: Pos, b: Pos) { return a.x === b.x && a.y === b.y; }

function spawnTiles(word: string, nextIdx: number, snake: Pos[], existing: Tile[], classic: boolean = false, cols = BASE_COLS, rows = BASE_ROWS): Tile[] {
  const needed = word[nextIdx];
  const occupied = [...snake, ...existing.map((t) => t.pos)];
  const tiles: Tile[] = [...existing];

  const hasTarget = tiles.some((t) => t.letter === needed && t.isTarget);
  if (!hasTarget && needed) {
    const pos = randomPos(occupied, cols, rows);
    occupied.push(pos);
    tiles.push({ pos, letter: needed, id: Date.now() + Math.random(), isTarget: true });
  }

  if (!classic) {
    const DECOY_COUNT = Math.min(6, word.length + 2);
    const alphabet = "ABCDEFGHIJKLMNOPRSTUVWZQXYÄÖÜẞ";
    while (tiles.length < DECOY_COUNT) {
      const decoy = alphabet[Math.floor(Math.random() * alphabet.length)];
      const pos = randomPos(occupied, cols, rows);
      occupied.push(pos);
      tiles.push({ pos, letter: decoy, id: Date.now() + Math.random(), isTarget: false });
    }
  }

  return tiles;
}

export default function SnakeGame() {
  const [showArticle, setShowArticle] = useState(false);
  const [classicMode, setClassicMode] = useState(false);
  const [isInfinite, setIsInfinite] = useState(false);
  const [gridExpansion, setGridExpansion] = useState(false);
  const [sentenceMode, setSentenceMode] = useState(false);
  const [gridSizeMultiplier, setGridSizeMultiplier] = useState(1); // 0.5–2.0
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Grid size — expands every 3 words when gridExpansion is on
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const expansionLevel = gridExpansion ? Math.floor(wordsCompleted / 3) : 0;
  const COLS = Math.round((BASE_COLS + expansionLevel * 2) * gridSizeMultiplier);
  const ROWS = Math.round((BASE_ROWS + expansionLevel * 2) * gridSizeMultiplier);
  // In sentence mode cells need to be wider to fit words; scale with grid size multiplier
  const CELL = sentenceMode
    ? Math.max(44, Math.round(64 / gridSizeMultiplier) - expansionLevel * 2)
    : Math.max(14, Math.round(BASE_CELL / gridSizeMultiplier) - expansionLevel * 2);

  // Sentence mode state
  const sentenceQueueRef = useRef<SentenceEntry[]>([]);
  const pickNextSentence = (): SentenceEntry => {
    if (sentenceQueueRef.current.length === 0) {
      sentenceQueueRef.current = [...SENTENCE_BANK].sort(() => Math.random() - 0.5);
    }
    return sentenceQueueRef.current.pop()!;
  };
  const [sentenceEntry, setSentenceEntry] = useState<SentenceEntry>(() => SENTENCE_BANK[0]);
  const [wordTiles, setWordTiles] = useState<WordTile[]>([]);

  // Shuffle queue so all words are seen before repeating
  const wordQueueRef = useRef<typeof WORD_BANK>([]);
  const pickNextWord = () => {
    if (wordQueueRef.current.length === 0) {
      // Refill and shuffle
      wordQueueRef.current = [...WORD_BANK].sort(() => Math.random() - 0.5);
    }
    return wordQueueRef.current.pop()!;
  };

  const [wordEntry, setWordEntry] = useState(() => pickNextWord());
  const [word, setWord] = useState(() => getWordWithArticle(wordEntry, showArticle));
  const [translation, setTranslation] = useState(wordEntry.en);
  const [nextIdx, setNextIdx] = useState(0);
  const [spelled, setSpelled] = useState("");

  const initSnake: Pos[] = [
    { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 },
  ];
  const [snake, setSnake] = useState<Pos[]>(initSnake);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [pendingDir, setPendingDir] = useState<Dir>("RIGHT");
  const [tiles, setTiles] = useState<Tile[]>(() =>
    spawnTiles(wordEntry.de, 0, initSnake, [])
  );
  const [phase, setPhase] = useState<"playing" | "wrong" | "won" | "idle">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("snake-hs") ?? "0", 10); } catch { return 0; }
  });
  const [wrongFlash, setWrongFlash] = useState(false);

  const gameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef({ snake, dir, pendingDir, tiles, nextIdx, spelled, word, phase, score, wordTiles, sentenceEntry });

  // Sync ref
  useEffect(() => {
    stateRef.current = { snake, dir, pendingDir, tiles, nextIdx, spelled, word, phase, score, wordTiles, sentenceEntry };
  });

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isFullscreen]);

  const newGame = useCallback(() => {
    const s: Pos[] = [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }];

    if (sentenceMode) {
      const entry = pickNextSentence();
      setSentenceEntry(entry);
      setWordTiles(spawnWordTiles(entry.words, 0, s, COLS, ROWS, classicMode));
      setNextIdx(0);
      setSpelled("");
      setWord(entry.de);
      setTranslation(entry.en);
    } else {
      const entry = pickNextWord();
      const finalWord = getWordWithArticle(entry, showArticle);
      const safetyZone = [...s, {x: 6, y: 8}, {x: 7, y: 8}, {x: 8, y: 8}, {x: 6, y: 7}, {x: 6, y: 9}];
      setWordEntry(entry);
      setWord(finalWord);
      setTranslation(entry.en);
      setNextIdx(0);
      setSpelled("");
      setTiles(spawnTiles(finalWord, 0, s, safetyZone.map(p => ({pos: p, letter: "", id: 0, isTarget: false})), classicMode, COLS, ROWS));
      setTiles(prev => prev.filter(t => t.id !== 0));
    }

    setSnake(s);
    setDir("RIGHT");
    setPendingDir("RIGHT");
    setPhase("playing");
    setIsPaused(false);
    setScore(0);
    setWordsCompleted(0);
    gameRef.current?.focus();
  }, [showArticle, classicMode, COLS, ROWS, sentenceMode]);

  // Game loop
  useEffect(() => {
    if (phase !== "playing" || isPaused) {
      if (loopRef.current) clearInterval(loopRef.current);
      return;
    }

    loopRef.current = setInterval(() => {
      const { snake, pendingDir, tiles, wordTiles, nextIdx, spelled, word, score, sentenceEntry } = stateRef.current;
      const d = pendingDir;
      stateRef.current.dir = d;
      
      const head = snake[0];
      const next: Pos = {
        x: (head.x + (d === "RIGHT" ? 1 : d === "LEFT" ? -1 : 0) + COLS) % COLS,
        y: (head.y + (d === "DOWN"  ? 1 : d === "UP"   ? -1 : 0) + ROWS) % ROWS,
      };

      // Self collision
      if (snake.slice(1).some((p) => posEq(p, next))) {
        setPhase("wrong");
        return;
      }

      // ── SENTENCE MODE ──────────────────────────────────────────
      if (sentenceMode) {
        const hitWordTile = wordTiles.find(t => posEq(t.pos, next));
        let newSnake: Pos[];

        if (hitWordTile) {
          const expectedWord = sentenceEntry.words[nextIdx];
          if (hitWordTile.word.toLowerCase() !== expectedWord.toLowerCase()) {
            setWrongFlash(true);
            setTimeout(() => setWrongFlash(false), 400);
            setPhase("wrong");
            return;
          }
          // Correct word eaten
          newSnake = [next, ...snake];
          const newNextIdx = nextIdx + 1;
          const newScore = score + 15;

          if (newNextIdx >= sentenceEntry.words.length) {
            // Sentence complete
            speakGerman(sentenceEntry.de);
            setSnake(newSnake);
            setNextIdx(newNextIdx);
            setScore(newScore);
            setWordsCompleted(w => w + 1);

            if (isInfinite) {
              const entry = pickNextSentence();
              setSentenceEntry(entry);
              setWord(entry.de);
              setTranslation(entry.en);
              setNextIdx(0);
              setSpelled("");
              setWordTiles(spawnWordTiles(entry.words, 0, newSnake, COLS, ROWS, classicMode));
              setScore(newScore);
              return;
            }
            setPhase("won");
            if (newScore > highScore) {
              setHighScore(newScore);
              try { localStorage.setItem("snake-hs", String(newScore)); } catch {}
            }
            return;
          }

          setNextIdx(newNextIdx);
          setScore(newScore);
          setSnake(newSnake);
          setWordTiles(spawnWordTiles(sentenceEntry.words, newNextIdx, newSnake, COLS, ROWS, classicMode));
        } else {
          newSnake = [next, ...snake.slice(0, -1)];
          setSnake(newSnake);
        }
        setDir(d);
        return;
      }

      // ── LETTER MODE ────────────────────────────────────────────
      // Check tile collision
      const hitTile = tiles.find((t) => posEq(t.pos, next));
      let newSnake: Pos[];
      let newTiles = tiles;
      let newNextIdx = nextIdx;
      let newSpelled = spelled;
      let newScore = score;

      if (hitTile) {
        if (hitTile.letter !== word[nextIdx]) {
          // Wrong letter
          setWrongFlash(true);
          setTimeout(() => setWrongFlash(false), 400);
          setPhase("wrong");
          return;
        }
        // Correct letter — grow snake
        newSnake = [next, ...snake];
        newNextIdx = nextIdx + 1;
        newSpelled = spelled + hitTile.letter;
        newScore = score + 10;

        // Remove eaten tile, update isTarget flags
        const remaining = tiles
          .filter((t) => t.id !== hitTile.id)
          .map((t) => ({ ...t, isTarget: t.letter === word[newNextIdx] }));

        if (newNextIdx >= word.length) {
          // Word complete — speak it!
          speakGerman(word.toLowerCase());
          recordWordMastery(word);
          
          if (isInfinite) {
            // Pick next word immediately
            const entry = pickNextWord();
            const finalWord = getWordWithArticle(entry, showArticle);
            
            setWordEntry(entry);
            setWord(finalWord);
            setTranslation(entry.en);
            setNextIdx(0);
            setSpelled("");
            setWordsCompleted(w => w + 1);
            
            // Spawn tiles for the NEW word, starting with index 0
            const newWordTiles = spawnTiles(finalWord, 0, newSnake, [], classicMode, COLS, ROWS);
            setTiles(newWordTiles);
            setScore(newScore);
            setSnake(newSnake);
            return;
          }

          // Normal mode — show Won screen
          setSnake(newSnake);
          setNextIdx(newNextIdx);
          setSpelled(newSpelled);
          setScore(newScore);
          setWordsCompleted(w => w + 1);
          setPhase("won");
          if (newScore > highScore) {
            setHighScore(newScore);
            try { localStorage.setItem("snake-hs", String(newScore)); } catch {}
          }
          return;
        }

        newTiles = spawnTiles(word, newNextIdx, newSnake, remaining, classicMode, COLS, ROWS);
        setScore(newScore);
        setNextIdx(newNextIdx);
        setSpelled(newSpelled);
        setTiles(newTiles);
      } else {
        // Normal move — shift snake
        newSnake = [next, ...snake.slice(0, -1)];
      }

      setSnake(newSnake);
      setDir(d);
    }, 130);

    return () => { if (loopRef.current) clearInterval(loopRef.current); };
  }, [phase, highScore, isPaused, classicMode, isInfinite, COLS, ROWS, sentenceMode]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (stateRef.current.phase === "playing") {
          setIsPaused((p) => !p);
        }
        return;
      }

      const map: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      const { dir } = stateRef.current;
      const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (next !== opposite[dir]) setPendingDir(next);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const swipe = (d: Dir) => {
    const { dir } = stateRef.current;
    const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (d !== opposite[dir]) setPendingDir(d);
  };

  const W = COLS * CELL;
  const H = ROWS * CELL;

  return (
    <div className="space-y-5" ref={containerRef}>
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">Word Snake</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          {sentenceMode ? "Eat the word-blocks in order to build the German sentence." : "Eat the letters in order to spell the German word."}
        </p>
      </div>

      <div className={`space-y-5 transition-all ${isFullscreen ? 'fixed inset-0 z-[100] bg-[var(--bg)] p-10 h-screen w-screen flex flex-col justify-center' : ''}`}>
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card relative z-50 p-6 border-accent/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent" />
                Game Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                   onClick={() => setShowArticle(!showArticle)}>
                <div>
                  <p className="text-sm font-semibold">Include Articles</p>
                  <p className="text-xs text-[var(--text-3)]">E.g. "Der Apfel" instead of "Apfel"</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${showArticle ? 'bg-accent' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showArticle ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                   onClick={() => setClassicMode(!classicMode)}>
                <div>
                  <p className="text-sm font-semibold">Classic Mode</p>
                  <p className="text-xs text-[var(--text-3)]">No decoy letters. Just 1 tile on board.</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${classicMode ? 'bg-accent' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${classicMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                   onClick={() => setIsInfinite(!isInfinite)}>
                <div>
                  <p className="text-sm font-semibold">Infinite Mode</p>
                  <p className="text-xs text-[var(--text-3)]">Words load automatically one after another.</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${isInfinite ? 'bg-accent' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isInfinite ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                   onClick={() => setGridExpansion(!gridExpansion)}>
                <div>
                  <p className="text-sm font-semibold">Grid Expansion</p>
                  <p className="text-xs text-[var(--text-3)]">Grid grows every 3 words — more room to breathe.</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${gridExpansion ? 'bg-accent' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${gridExpansion ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                   onClick={() => setSentenceMode(!sentenceMode)}>
                <div>
                  <p className="text-sm font-semibold">Sentence Mode</p>
                  <p className="text-xs text-[var(--text-3)]">Eat word-blocks to build a full German sentence.</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${sentenceMode ? 'bg-accent' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${sentenceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Grid Size</p>
                  <p className="text-xs font-mono" style={{ color: "var(--accent)" }}>{COLS}×{ROWS}</p>
                </div>
                <input
                  type="range" min={0.5} max={2} step={0.25}
                  value={gridSizeMultiplier}
                  onChange={e => setGridSizeMultiplier(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full cursor-pointer"
                  style={{ accentColor: "var(--accent)" }}
                />
                <div className="flex justify-between text-[10px] text-[var(--text-3)]">
                  <span>Small</span><span>Default</span><span>Large</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowSettings(false); newGame(); }}
              className="w-full mt-4 py-2 bg-[var(--accent)] text-[var(--accent-text)] font-bold rounded-xl text-sm hover:brightness-110 transition-all active:scale-95 shadow-[0_0_20px_rgba(88,230,217,0.2)]"
            >
              Apply & Restart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word display */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-4 relative group">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-2 right-2 p-2 opacity-50 hover:opacity-100 transition-opacity hover:bg-white/5 rounded-xl z-20"
        >
          <Settings className="w-4 h-4 text-[var(--text-3)]" />
        </button>
        <button 
          onClick={toggleFullscreen}
          className="absolute top-2 right-12 p-2 opacity-50 hover:opacity-100 transition-opacity hover:bg-white/5 rounded-xl z-20"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-[var(--text-3)]" /> : <Maximize className="w-4 h-4 text-[var(--text-3)]" />}
        </button>
        <div>
          {sentenceMode ? (
            <>
              <p className="text-xs text-[var(--text-3)]">Build this sentence</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {sentenceEntry.words.map((w, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded-lg border text-xs font-bold transition-all ${
                      i < nextIdx
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                        : i === nextIdx
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-3)]"
                    }`}
                  >
                    {i <= nextIdx ? w : "···"}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-[var(--text-3)]">
                {translation}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-[var(--text-3)]">Spell this word</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {word.split("").map((ch, i) => (
                  <span
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                      i < spelled.length
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                        : i === spelled.length
                        ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-3)]"
                    }`}
                  >
                    {i < spelled.length ? ch : i === spelled.length ? ch : "·"}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-[var(--text-3)]">
                English: <span className="font-medium text-[var(--text-2)]">{translation}</span>
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">Score</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">Best</p>
            <div className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <p className="text-2xl font-bold text-[var(--text-1)]">{highScore}</p>
            </div>
          </div>
          {gridExpansion && expansionLevel > 0 && (
            <div className="text-center">
              <p className="text-xs text-[var(--text-3)]">Grid</p>
              <p className="text-sm font-bold text-[var(--accent)]">{COLS}×{ROWS}</p>
            </div>
          )}
        </div>
      </div>

      {/* Game board */}
      <div className={`flex flex-col items-center gap-4 ${isFullscreen ? 'flex-grow justify-center' : ''}`}>
        <div
          ref={gameRef}
          className={`relative overflow-hidden rounded-2xl border transition-all outline-none ${
            wrongFlash
              ? "border-rose-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
              : "border-[var(--border)]"
          }`}
          style={{ 
            width: W, height: H, 
            background: "var(--surface)", 
            maxWidth: "100%",
            transform: isFullscreen ? `scale(${Math.min((window.innerWidth * 0.85) / W, (window.innerHeight * 0.65) / H)})` : 'none',
            transformOrigin: 'center center'
          }}
          tabIndex={0}
        >
          {/* Grid lines */}
          <svg
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            height={H} width={W}
          >
            {Array.from({ length: COLS + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={H} stroke="currentColor" />
            ))}
            {Array.from({ length: ROWS + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * CELL} x2={W} y2={i * CELL} stroke="currentColor" />
            ))}
          </svg>

          {/* Letter tiles (word mode) */}
          {!sentenceMode && tiles.map((tile) => (
            <motion.div
              key={tile.id}
              animate={{ scale: 1, opacity: 1 }}
              className={`absolute flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                tile.isTarget
                  ? "bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_12px_rgba(88,230,217,0.4)]"
                  : "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]"
              }`}
              initial={{ scale: 0.5, opacity: 0 }}
              style={{
                left: tile.pos.x * CELL + 2,
                top:  tile.pos.y * CELL + 2,
                width: CELL - 4,
                height: CELL - 4,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {tile.letter}
            </motion.div>
          ))}

          {/* Word tiles (sentence mode) */}
          {sentenceMode && wordTiles.map((tile) => (
            <motion.div
              key={tile.id}
              animate={{ scale: 1, opacity: 1 }}
              className={`absolute flex items-center justify-center rounded-lg text-xs font-bold px-1 transition-colors ${
                tile.isTarget
                  ? "bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_12px_rgba(88,230,217,0.4)]"
                  : "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]"
              }`}
              initial={{ scale: 0.5, opacity: 0 }}
              style={{
                left: tile.pos.x * CELL + 2,
                top:  tile.pos.y * CELL + 2,
                width: CELL - 4,
                height: CELL - 4,
                fontSize: Math.max(8, Math.min(12, CELL / 5)),
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="truncate text-center leading-tight">{tile.word}</span>
            </motion.div>
          ))}

          {/* Snake */}
          {snake.map((seg, i) => {
            const isHead = i === 0;
            // In sentence mode, label each body segment with the word it represents
            const segWord = sentenceMode && i > 0 ? sentenceEntry.words[nextIdx - i] : null;
            return (
              <div
                key={`${seg.x}-${seg.y}-${i}`}
                className={`absolute rounded-md transition-all flex items-center justify-center overflow-hidden ${
                  isHead ? "bg-[var(--accent)] z-10" : "bg-[var(--accent)]/70"
                }`}
                style={{
                  left: seg.x * CELL + 1,
                  top:  seg.y * CELL + 1,
                  width: CELL - 2,
                  height: CELL - 2,
                  opacity: isHead ? 1 : Math.max(0.3, 1 - i * 0.06),
                }}
              >
                {segWord && (
                  <span className="text-[var(--accent-text)] font-bold leading-tight text-center truncate px-0.5"
                    style={{ fontSize: Math.max(7, Math.min(11, CELL / 5.5)) }}>
                    {segWord}
                  </span>
                )}
              </div>
            );
          })}

          {/* Overlay: idle / won / wrong / paused */}
          <AnimatePresence>
            {isPaused && phase === "playing" && (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl z-40"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                style={{ background: "rgba(10, 10, 10, 0.75)", backdropFilter: "blur(4px)" }}
              >
                <div className="card p-8 border-white/10 flex flex-col items-center gap-6 shadow-2xl">
                    <h3 className="text-4xl font-black text-white tracking-widest uppercase">Paused</h3>
                    <p className="text-slate-400">Press <b>ESC</b> to resume</p>
                    <button 
                        onClick={() => setIsPaused(false)}
                        className="accent-btn px-10 py-3 text-lg"
                    >
                        Resume Game
                    </button>
                </div>
              </motion.div>
            )}

            {phase !== "playing" && !isPaused && (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
              >
                {phase === "idle" && (
                  <>
                    <p className="text-lg font-semibold text-[var(--text-1)]">Word Snake</p>
                    <p className="max-w-xs text-center text-sm text-[var(--text-3)]">
                      {sentenceMode
                        ? "Eat the glowing word-blocks in order to build the German sentence. Wrong word = game over."
                        : "Eat the glowing letters in order to spell the German word. Wrong letter = game over."}
                    </p>
                    <button
                      className="accent-btn px-6 py-2.5 text-sm"
                      onClick={newGame}
                      type="button"
                    >
                      Start game
                    </button>
                  </>
                )}
                {phase === "won" && (
                  <>
                    <motion.div
                      animate={{ scale: 1 }}
                      className="text-5xl"
                      initial={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      🎉
                    </motion.div>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-[var(--text-1)]">{word}</p>
                      <button
                        aria-label="Hear pronunciation"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-text)] active:scale-95"
                        onClick={() => speakGerman(word.toLowerCase())}
                        type="button"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--text-3)]">{translation}</p>
                    <p className="text-xs text-[var(--text-3)]">+{score} points</p>
                    <button
                      className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm"
                      onClick={newGame}
                      type="button"
                    >
                      <RotateCcw className="h-4 w-4" /> Next word
                    </button>
                  </>
                )}
                {phase === "wrong" && (
                  <>
                    <p className="text-lg font-semibold text-rose-400">Wrong letter!</p>
                    <p className="text-sm text-[var(--text-3)]">
                      You needed <span className="font-bold text-[var(--accent)]">{word[nextIdx]}</span>
                    </p>
                    <p className="text-xs text-[var(--text-3)]">
                      {word} = {translation}
                    </p>
                    <button
                      className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm"
                      onClick={newGame}
                      type="button"
                    >
                      <RotateCcw className="h-4 w-4" /> Try again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile D-pad */}
        <div className="grid grid-cols-3 gap-1 lg:hidden">
          {[
            [null, { d: "UP" as Dir, icon: ArrowUp }, null],
            [{ d: "LEFT" as Dir, icon: ArrowLeft }, { d: "DOWN" as Dir, icon: ArrowDown }, { d: "RIGHT" as Dir, icon: ArrowRight }],
          ].map((row, ri) => (
            <React.Fragment key={ri}>
              {row.map((cell, ci) =>
                cell ? (
                  <button
                    key={ci}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] active:bg-[var(--accent-dim)] active:text-[var(--accent)]"
                    onPointerDown={() => swipe(cell.d)}
                    type="button"
                  >
                    <cell.icon className="h-5 w-5" />
                  </button>
                ) : (
                  <div key={ci} />
                )
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-[var(--text-3)]">
          Arrow keys or WASD to move · Eat the{" "}
          <span className="font-semibold text-[var(--accent)]">highlighted</span> letter next
        </p>
      </div>
    </div>
    </div>
  );
}
