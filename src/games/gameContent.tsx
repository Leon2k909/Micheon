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
import { tts } from "@/lib/voice";
import { buildCatalog, type CatalogItem } from "@/session";
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
  clueLanguage: "de" | "en";
  letters: string[];
  target: string;
  targetLanguage: "de" | "en";
  targetLocale: "de-DE" | "en-GB" | "en-US";
};

type GameContentContextValue = {
  entries: GameContentEntry[];
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
  const learnsEnglish = learningDirection === "learn-en";
  const entries: GameContentEntry[] = [];

  for (const item of source) {
    const de = item.de?.trim();
    const en = primaryVariant(item.en ?? "");
    if (!de || !en) continue;

    const key = `${de.toLocaleLowerCase("de-DE")}\u0000${en.toLocaleLowerCase("en-US")}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const target = learnsEnglish ? en : de;
    const letters = gameLetters(target);
    if (letters.length === 0) continue;

    entries.push({
      ...item,
      clue: learnsEnglish ? de : en,
      clueLanguage: learnsEnglish ? "de" : "en",
      de,
      en,
      letters,
      target,
      targetLanguage: learnsEnglish ? "en" : "de",
      targetLocale: learnsEnglish ? englishVoiceLang() : "de-DE",
    });
  }

  return entries;
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
    const updateDirection = (event: Event) => {
      const next = (event as CustomEvent<LearningDirection>).detail;
      setLearningDirection(next === "learn-en" ? "learn-en" : "learn-de");
    };
    window.addEventListener(DIRECTION_CHANGE_EVENT, updateDirection);
    return () => window.removeEventListener(DIRECTION_CHANGE_EVENT, updateDirection);
  }, []);

  const entries = useMemo(
    () => buildGameEntries(apiParts, learningDirection),
    [apiParts, learningDirection, learningMode]
  );
  const value = useMemo(
    () => ({ entries, learningDirection }),
    [entries, learningDirection]
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

export function speakGameTarget(entry: GameContentEntry) {
  return tts(entry.target, 0.9, entry.targetLocale);
}
