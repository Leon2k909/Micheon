import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { englishVoiceLang } from "@/lib/englishVariant";

import {
  DIRECTION_CHANGE_EVENT,
  getLearningDirection,
  type LearningDirection,
} from "@/lib/direction";
import { courseSides, type CourseLanguage, type VoiceTag } from "@/lib/courseLanguages";
import { frenchFor } from "@/lib/frenchCourse";
import { polishFor } from "@/lib/polishCourse";
import { tts } from "@/lib/voice";
import { buildCatalog, type CatalogItem } from "@/session";
import { buildWordCatalog } from "@/lib/wordSession";
import { useLearningMode } from "@/lib/learningMode";

const FALLBACK_ITEMS: CatalogItem[] = [
  {
    de: "Kein Problem.",
    en: "No problem.",
    id: "game-fallback-no-problem",
    kind: "phrase",
    partKey: "fallback",
    partLabel: "Everyday German",
  },
  {
    de: "Bis später.",
    en: "See you later.",
    id: "game-fallback-see-you",
    kind: "phrase",
    partKey: "fallback",
    partLabel: "Everyday German",
  },
  {
    de: "Wie geht's?",
    en: "How are you?",
    id: "game-fallback-how-are-you",
    kind: "phrase",
    partKey: "fallback",
    partLabel: "Everyday German",
  },
];

export type GameContentEntry = CatalogItem & {
  clue: string;
  clueLanguage: CourseLanguage;
  letters: string[];
  target: string;
  targetLanguage: CourseLanguage;
  targetLocale: VoiceTag;
};

/**
 * A single vocabulary word, for the games that ask you to spell one.
 *
 * These do NOT come from buildCatalog. That is the phrase course, and of its
 * 16,308 entries exactly 47 are a single word — all of them interjections
 * ("Mist!", "Verdammt!"). A game that draws a "word" from there draws a
 * sentence, which is how Word Snake ended up asking learners to spell
 * "Selbstverständlich. Sollen wir uns auf ein Safeword einigen?" one letter at
 * a time. The vocabulary lives in part.vocab and buildWordCatalog reads it:
 * 7,006 cards, of which 6,796 are spellable.
 */
export type GameWordEntry = {
  id: string;
  /** What you spell — the article split off, so the toggle can add it back. */
  spelling: string;
  /** der/die/das, present on 4,257 of them. */
  article?: string;
  /** The other language, shown as the clue. */
  clue: string;
  clueLanguage: CourseLanguage;
  letters: string[];
  /** The catalogue's own form ("der Apfel"), which is what progress is keyed on. */
  de: string;
  target: string;
  targetLocale: VoiceTag;
};

type GameContentContextValue = {
  entries: GameContentEntry[];
  words: GameWordEntry[];
  learningDirection: LearningDirection;
};

const GameContentContext = createContext<GameContentContextValue | null>(null);

function primaryVariant(value: string) {
  return value
    .split(/\s+\/\s+/)
    .map((part) => part.trim())
    .find(Boolean) ?? value.trim();
}

export function gameLetters(value: string) {
  return Array.from(value.normalize("NFC").toLocaleUpperCase())
    .filter((character) => /\p{L}|\p{N}/u.test(character));
}

function buildGameEntries(
  apiParts: Record<string, unknown>,
  learningDirection: LearningDirection
) {
  const catalog = buildCatalog(apiParts);
  const source = catalog.length > 0 ? catalog : FALLBACK_ITEMS;
  const seen = new Set<string>();
  const sides = courseSides(learningDirection);
  const learnsFrench = sides.target.code === "fr";
  const learnsPolish = sides.target.code === "pl";
  const entries: GameContentEntry[] = [];

  for (const item of source) {
    const de = item.de?.trim();
    const en = primaryVariant(item.en ?? "");
    if (!de || !en) continue;

    const key = `${de.toLocaleLowerCase("de-DE")}\u0000${en.toLocaleLowerCase("en-US")}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // The catalogue is German either way round, so a table-backed course looks
    // its target up rather than reading it off the entry. A sentence with no
    // translation cannot be played in that course and leaves the pool.
    const french = learnsFrench ? frenchFor(de, (item as { fr?: string }).fr) : null;
    if (learnsFrench && !french) continue;
    const polish = learnsPolish ? polishFor(de) : null;
    if (learnsPolish && !polish) continue;

    const target = french ?? polish ?? (sides.target.code === "en" ? en : de);
    const letters = gameLetters(target);
    if (letters.length === 0) continue;

    entries.push({
      ...item,
      clue: sides.meaning.code === "de" ? de : en,
      clueLanguage: sides.meaning.code,
      de,
      en,
      letters,
      target,
      targetLanguage: sides.target.code,
      targetLocale: sides.target.voice,
    });
  }

  return entries;
}

const LEADING_ARTICLE = /^(der|die|das)\s+/i;
const LEADING_INFINITIVE = /^to\s+/i;
// French nouns are taught with their article, and a spelling board asking for
// LECHIEN would be asking for two words. Elision counts as an article too:
// l'été is one article and one word, with no space between them.
const LEADING_FRENCH_ARTICLE = /^(le|la|les|un|une|l['’])\s*/i;

/**
 * The longest word worth spelling on a twenty-column board.
 *
 * The catalogue's tail is real German but a poor round: it tops out at
 * Mietschuldenfreiheitsbescheinigung, thirty-four letters. Capping at twenty
 * costs 23 words out of 6,819 and keeps every one anybody would call a word.
 */
const MAX_SPELLING_LETTERS = 20;

export function buildGameWords(
  apiParts: Record<string, unknown>,
  learningDirection: LearningDirection
): GameWordEntry[] {
  const sides = courseSides(learningDirection);
  const learnsEnglish = sides.target.code === "en";
  const learnsPolish = sides.target.code === "pl";
  const learnsFrench = sides.target.code === "fr";
  const seen = new Set<string>();
  const words: GameWordEntry[] = [];

  for (const word of buildWordCatalog(apiParts as Record<string, unknown>)) {
    const de = String((word as { de?: unknown })?.de ?? "").trim();
    const en = primaryVariant(String((word as { en?: unknown })?.en ?? ""));
    if (!de || !en) continue;

    const french = learnsFrench ? frenchFor(de) : null;
    if (learnsFrench && !french) continue;
    // Polish nouns carry no article, so there is nothing to strip off the
    // front of one before it reaches a spelling board.
    const polish = learnsPolish ? polishFor(de) : null;
    if (learnsPolish && !polish) continue;

    const article = LEADING_ARTICLE.exec(de);
    const bareDe = article ? de.slice(article[0].length).trim() : de;
    // "to go" is one word wearing an infinitive marker; the marker is English
    // grammar, not part of the spelling.
    const bareEn = en.replace(LEADING_INFINITIVE, "").trim();
    const frenchArticle = french ? LEADING_FRENCH_ARTICLE.exec(french) : null;
    const bareFr = french && frenchArticle ? french.slice(frenchArticle[0].length).trim() : french;

    const target = learnsFrench ? (bareFr ?? "") : learnsPolish ? (polish ?? "") : learnsEnglish ? bareEn : bareDe;
    const clue = sides.meaning.code === "de" ? de : en;

    // One token only. "sich freuen" spelled SICHFREUEN reads as a typo rather
    // than a word, and the space is gone by the time it reaches the board.
    if (!target || /\s/.test(target)) continue;
    const letters = gameLetters(target);
    if (letters.length < 2 || letters.length > MAX_SPELLING_LETTERS) continue;

    const key = target.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    words.push({
      id: String((word as { id?: unknown })?.id ?? key),
      spelling: target,
      article: learnsFrench
        ? frenchArticle?.[1].toLowerCase()
        : !learnsEnglish && article ? article[1].toLowerCase() : undefined,
      clue,
      clueLanguage: sides.meaning.code,
      letters,
      de,
      target,
      targetLocale: sides.target.voice,
    });
  }

  return words;
}

export function GameContentProvider({
  apiParts,
  children,
}: {
  apiParts: Record<string, unknown>;
  children: ReactNode;
}) {
  const [learningDirection, setLearningDirection] = useState(getLearningDirection);
  const learningMode = useLearningMode();

  useEffect(() => {
    // Read back rather than trusting the event payload, so a direction the
    // listener has not heard of cannot quietly become German.
    const updateDirection = () => setLearningDirection(getLearningDirection());
    window.addEventListener(DIRECTION_CHANGE_EVENT, updateDirection);
    return () => window.removeEventListener(DIRECTION_CHANGE_EVENT, updateDirection);
  }, []);

  const entries = useMemo(
    () => buildGameEntries(apiParts, learningDirection),
    [apiParts, learningDirection, learningMode]
  );
  const words = useMemo(
    () => buildGameWords(apiParts, learningDirection),
    [apiParts, learningDirection]
  );
  const value = useMemo(
    () => ({ entries, words, learningDirection }),
    [entries, words, learningDirection]
  );

  return <GameContentContext.Provider value={value}>{children}</GameContentContext.Provider>;
}

export function useGameContent() {
  const context = useContext(GameContentContext);
  if (!context) throw new Error("useGameContent must be used inside GameContentProvider");
  return context;
}

function shuffle<T>(values: T[]) {
  const next = [...values];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export type GameDeckMode = "all" | "letters" | "sentences" | "words";

export function useGameDeck(mode: GameDeckMode = "all") {
  const { entries, learningDirection } = useGameContent();
  const eligible = useMemo(() => entries.filter((entry) => {
    if (mode === "letters") return entry.letters.length >= 2;
    const hasSpaces = /\s/.test(entry.target.trim());
    if (mode === "sentences") return hasSpaces;
    if (mode === "words") return !hasSpaces;
    return true;
  }), [entries, mode]);
  const eligibleRef = useRef(eligible);
  const queueRef = useRef<GameContentEntry[]>([]);
  const lastIdRef = useRef("");

  useEffect(() => {
    eligibleRef.current = eligible;
    queueRef.current = [];
    lastIdRef.current = "";
  }, [eligible]);

  const refill = useCallback(() => {
    const next = shuffle(eligibleRef.current);
    if (next.length > 1 && next[next.length - 1]?.id === lastIdRef.current) {
      [next[0], next[next.length - 1]] = [next[next.length - 1], next[0]];
    }
    queueRef.current = next;
  }, []);

  const next = useCallback(() => {
    if (queueRef.current.length === 0) refill();
    const resolved = queueRef.current.pop() ?? eligibleRef.current[0] ?? entries[0];
    if (!resolved) {
      throw new Error("No game content is available");
    }
    lastIdRef.current = resolved.id;
    return resolved;
  }, [entries, refill]);

  const draw = useCallback((count: number) => {
    const picked: GameContentEntry[] = [];
    while (picked.length < count && eligibleRef.current.length > 0) {
      picked.push(next());
      if (picked.length >= eligibleRef.current.length) break;
    }
    return picked;
  }, [next]);

  return {
    count: eligible.length,
    draw,
    entries: eligible,
    learningDirection,
    next,
  };
}

/**
 * The same shuffled queue as useGameDeck, over vocabulary instead of phrases.
 *
 * For a game that asks you to spell something letter by letter this is the
 * only correct source. useGameDeck("words") filters the PHRASE catalogue for
 * entries without a space and finds 47 of them, all interjections — it looks
 * like it does this job and does not.
 */
export function useGameWordDeck() {
  const { words, learningDirection } = useGameContent();
  const eligibleRef = useRef(words);
  const queueRef = useRef<GameWordEntry[]>([]);
  const lastIdRef = useRef("");

  useEffect(() => {
    eligibleRef.current = words;
    queueRef.current = [];
    lastIdRef.current = "";
  }, [words]);

  const refill = useCallback(() => {
    const next = shuffle(eligibleRef.current);
    if (next.length > 1 && next[next.length - 1]?.id === lastIdRef.current) {
      [next[0], next[next.length - 1]] = [next[next.length - 1], next[0]];
    }
    queueRef.current = next;
  }, []);

  const next = useCallback(() => {
    if (queueRef.current.length === 0) refill();
    const resolved = queueRef.current.pop() ?? eligibleRef.current[0];
    if (!resolved) throw new Error("No game vocabulary is available");
    lastIdRef.current = resolved.id;
    return resolved;
  }, [refill]);

  return { count: words.length, entries: words, learningDirection, next };
}

// Narrowed to what it actually reads, so a GameWordEntry can be spoken too
// without pretending to be a full catalogue item.
export function speakGameTarget(entry: Pick<GameContentEntry, "target" | "targetLocale">) {
  return tts(entry.target, 0.9, entry.targetLocale);
}
