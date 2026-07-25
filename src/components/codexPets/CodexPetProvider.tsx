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

import {
  CODEX_PET_PREFERENCE_KEY,
  codexPetKey,
  fetchCodexPetCatalog,
  getStoredCodexPetKey,
  storeCodexPetKey,
  type CodexPet,
} from "@/lib/codexPets";
import { getCodexPetMessagesMuted } from "@/lib/codexPetMessages";
import { setItemStatus } from "@/lib/activity";
import {
  getAuthUser,
  getScopedKey,
  loadScopedJson,
  saveScopedJson,
  syncLocalStorageItem,
} from "@/lib/profileStorage";
import { uiIsGerman } from "@/lib/i18n";

const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;
const isDesktopPetOverlay = typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("pet-overlay") === "1";
const PET_HISTORY_KEY = "pet-message-history-v1";
const PET_VISIBLE_KEYS_KEY = "gl-codex-pet-visible-v1";
const MAX_PET_HISTORY = 200;
const PET_DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

export type CodexPetSpeechMood = "greeting" | "success" | "encourage" | "celebrate";

export type CodexPetQuestion = {
  aliases?: string[];
  answerLanguage: "de" | "en";
  de: string;
  en: string;
  itemId: string;
};

export type CodexPetAnswer = "yes" | "no";

export type CodexPetSpeech = {
  answer?: CodexPetAnswer;
  answeredAt?: number;
  createdAt: number;
  id: string;
  mood: CodexPetSpeechMood;
  question?: CodexPetQuestion;
  text: string;
};

type CodexPetSpeechOptions = {
  durationMs?: number;
  mood?: CodexPetSpeechMood;
  question?: CodexPetQuestion;
};

type CodexPetContextValue = {
  answerQuestion: (messageId: string, answer: CodexPetAnswer, announce?: boolean) => void;
  clearSpeech: () => void;
  dismissMessage: (messageId: string) => void;
  error: string | null;
  history: CodexPetSpeech[];
  isLoading: boolean;
  pets: CodexPet[];
  refresh: () => Promise<void>;
  selectedKey: string;
  selectedPet: CodexPet | null;
  selectPet: (key: string) => void;
  togglePetVisibility: (key: string) => void;
  visibleKeys: string[];
  speak: (text: string, options?: CodexPetSpeechOptions) => void;
  speech: CodexPetSpeech | null;
};

const CodexPetContext = createContext<CodexPetContextValue | null>(null);

function messageSemanticKey(entry: CodexPetSpeech) {
  return entry.question?.itemId
    ? `question:${entry.question.itemId}:${entry.question.answerLanguage}`
    : `message:${entry.text.trim().toLocaleLowerCase()}`;
}

function dedupePetHistory(entries: CodexPetSpeech[]) {
  const deduped: CodexPetSpeech[] = [];
  for (const entry of entries) {
    const priorIndex = deduped.findLastIndex((prior) =>
      messageSemanticKey(prior) === messageSemanticKey(entry)
      && Math.abs(entry.createdAt - prior.createdAt) <= PET_DUPLICATE_WINDOW_MS
    );
    if (priorIndex === -1) deduped.push(entry);
    else deduped[priorIndex] = entry;
  }
  return deduped;
}

function loadPetHistory() {
  const stored = loadScopedJson<CodexPetSpeech[]>(PET_HISTORY_KEY, [], getAuthUser());
  return Array.isArray(stored)
    ? dedupePetHistory(stored
        .filter((entry) => entry && typeof entry.id === "string" && typeof entry.text === "string")
        .slice(-MAX_PET_HISTORY))
    : [];
}

function savePetHistory(history: CodexPetSpeech[]) {
  saveScopedJson(PET_HISTORY_KEY, history.slice(-MAX_PET_HISTORY), getAuthUser());
}

function getStoredVisiblePetKeys() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PET_VISIBLE_KEYS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((key): key is string => typeof key === "string") : [];
  } catch {
    return [];
  }
}

function storeVisiblePetKeys(keys: string[]) {
  const next = [...new Set(keys)];
  localStorage.setItem(PET_VISIBLE_KEYS_KEY, JSON.stringify(next));
  syncLocalStorageItem(PET_VISIBLE_KEYS_KEY, JSON.stringify(next));
}

export function CodexPetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<CodexPet[]>([]);
  const [selectedKey, setSelectedKey] = useState(() => getStoredCodexPetKey() ?? "");
  const [visibleKeys, setVisibleKeys] = useState<string[]>(getStoredVisiblePetKeys);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speech, setSpeech] = useState<CodexPetSpeech | null>(null);
  const [history, setHistory] = useState<CodexPetSpeech[]>(loadPetHistory);
  const speechId = useRef(0);
  const speechTimer = useRef<number | null>(null);
  const historyRef = useRef(history);
  historyRef.current = history;

  const clearSpeech = useCallback(() => {
    if (speechTimer.current !== null) {
      window.clearTimeout(speechTimer.current);
      speechTimer.current = null;
    }
    setSpeech(null);
  }, []);

  const showSpeech = useCallback((message: CodexPetSpeech, durationMs?: number) => {
    if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
    const visibleDuration = Math.min(
      message.question ? 30000 : 7000,
      Math.max(1600, durationMs ?? (message.question ? 18000 : 3200))
    );
    setSpeech(message);
    speechTimer.current = window.setTimeout(() => {
      setSpeech((current) => current?.id === message.id ? null : current);
      speechTimer.current = null;
    }, visibleDuration);
  }, []);

  const upsertHistory = useCallback((entry: CodexPetSpeech) => {
    setHistory((current) => {
      const existingIndex = current.findIndex((item) => item.id === entry.id);
      const semanticDuplicateIndex = existingIndex === -1
        ? current.findLastIndex((item) =>
            messageSemanticKey(item) === messageSemanticKey(entry)
            && Math.abs(entry.createdAt - item.createdAt) <= PET_DUPLICATE_WINDOW_MS
          )
        : -1;
      const replaceIndex = existingIndex === -1 ? semanticDuplicateIndex : existingIndex;
      const next = replaceIndex === -1
        ? [...current, entry]
        : current.map((item, index) => index === replaceIndex ? { ...item, ...entry } : item);
      const limited = next.slice(-MAX_PET_HISTORY);
      savePetHistory(limited);
      historyRef.current = limited;
      return limited;
    });
  }, []);

  const dismissMessage = useCallback((messageId: string) => {
    setHistory((current) => {
      if (!current.some((message) => message.id === messageId)) return current;
      const next = current.filter((message) => message.id !== messageId);
      savePetHistory(next);
      historyRef.current = next;
      return next;
    });
    setSpeech((current) => {
      if (current?.id !== messageId) return current;
      if (speechTimer.current !== null) {
        window.clearTimeout(speechTimer.current);
        speechTimer.current = null;
      }
      return null;
    });
  }, []);

  const speak = useCallback((text: string, options: CodexPetSpeechOptions = {}) => {
    if (getCodexPetMessagesMuted()) return;
    const rawText = text.trim();
    if (!rawText) return;
    const messageText = selectedKey.endsWith(":leon")
      ? `Hello darling. ${rawText}`
      : rawText;
    const message: CodexPetSpeech = {
      createdAt: Date.now(),
      id: `${Date.now()}-${++speechId.current}`,
      mood: options.mood ?? "greeting",
      question: options.question,
      text: messageText,
    };
    upsertHistory(message);
    showSpeech(message, options.durationMs);
    if (desktop && !isDesktopPetOverlay) {
      desktop.sendPetOverlaySpeech({ message, options: { durationMs: options.durationMs } });
    }
  }, [selectedKey, showSpeech, upsertHistory]);

  const answerQuestion = useCallback((
    messageId: string,
    answer: CodexPetAnswer,
    announce = true
  ) => {
    const entry = historyRef.current.find((message) => message.id === messageId);
    if (!entry?.question) return;

    const nextEntry: CodexPetSpeech = {
      ...entry,
      answer,
      answeredAt: Date.now(),
    };
    setItemStatus(
      entry.question.itemId,
      answer === "yes" ? "known" : "struggle",
      getAuthUser(),
      entry.question.aliases
    );
    upsertHistory(nextEntry);
    setSpeech((current) => current?.id === messageId ? nextEntry : current);

    if (!announce) return;
    const target = entry.question.answerLanguage === "de" ? entry.question.de : entry.question.en;
    const response = answer === "yes"
      ? uiIsGerman()
        ? `Erledigt — „${target}“ ist jetzt als bekannt markiert.`
        : `Done — “${target}” is now marked as known.`
      : uiIsGerman()
        ? `Kein Problem — die Antwort ist „${target}“. Ich behalte sie in deiner Wiederholung.`
        : `No problem — the answer is “${target}”. I’ll keep it in your review.`;
    window.setTimeout(() => {
      speak(response, {
        durationMs: 5600,
        mood: answer === "yes" ? "success" : "encourage",
      });
    }, 180);
  }, [speak, upsertHistory]);

  useEffect(() => () => {
    if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
  }, []);

  useEffect(() => {
    if (!isDesktopPetOverlay || !desktop?.onPetOverlaySpeech) return undefined;
    return desktop.onPetOverlaySpeech((payload: {
      message?: CodexPetSpeech;
      options?: { durationMs?: number };
    }) => {
      const message = payload?.message;
      if (!message || typeof message.id !== "string" || typeof message.text !== "string") return;
      if (getCodexPetMessagesMuted()) return;
      upsertHistory(message);
      showSpeech(message, payload.options?.durationMs);
    });
  }, [showSpeech, upsertHistory]);

  useEffect(() => {
    const profile = getAuthUser();
    const scopedHistoryKey = getScopedKey(PET_HISTORY_KEY, profile);
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== scopedHistoryKey) return;
      const next = loadPetHistory();
      historyRef.current = next;
      setHistory(next);
      setSpeech((current) => {
        if (!current || next.some((message) => message.id === current.id)) return current;
        if (speechTimer.current !== null) {
          window.clearTimeout(speechTimer.current);
          speechTimer.current = null;
        }
        return null;
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const catalog = await fetchCodexPetCatalog();
      setPets(catalog.pets);
      setError(null);

      const availableKeys = new Set(catalog.pets.map(codexPetKey));
      const stored = getStoredCodexPetKey();
      const next = stored === "off"
        ? "off"
        : stored && availableKeys.has(stored)
          ? stored
          : catalog.selectedPetKey && availableKeys.has(catalog.selectedPetKey)
            ? catalog.selectedPetKey
            : catalog.pets[0]
              ? codexPetKey(catalog.pets[0])
              : "off";

      setSelectedKey(next);
      if (stored !== next) storeCodexPetKey(next);

      const storedVisible = getStoredVisiblePetKeys().filter((key) => availableKeys.has(key));
      const nextVisible = next === "off"
        ? []
        : storedVisible.length
          ? storedVisible
          : [next];
      setVisibleKeys(nextVisible);
      storeVisiblePetKeys(nextVisible);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to read mascot pets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const handleFocus = () => void refresh();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refresh]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CODEX_PET_PREFERENCE_KEY && event.newValue) {
        setSelectedKey(event.newValue);
      }
      if (event.key === PET_VISIBLE_KEYS_KEY) setVisibleKeys(getStoredVisiblePetKeys());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const selectPet = useCallback((key: string) => {
    setSelectedKey(key);
    storeCodexPetKey(key);
    if (key !== "off") {
      setVisibleKeys((current) => {
        const next = current.includes(key) ? current : [...current, key];
        storeVisiblePetKeys(next);
        return next;
      });
    }
    desktop?.setPetOverlayVisible(key !== "off");
    if (key === "off") clearSpeech();
  }, [clearSpeech]);

  const togglePetVisibility = useCallback((key: string) => {
    if (key === selectedKey) return;
    setVisibleKeys((current) => {
      const next = current.includes(key)
        ? current.filter((entry) => entry !== key)
        : [...current, key];
      storeVisiblePetKeys(next);
      return next;
    });
  }, [selectedKey]);

  const selectedPet = useMemo(
    () => pets.find((pet) => codexPetKey(pet) === selectedKey) ?? null,
    [pets, selectedKey]
  );

  useEffect(() => {
    if (desktop && !isLoading) desktop.setPetOverlayVisible(Boolean(selectedPet));
  }, [isLoading, selectedPet]);

  const value = useMemo<CodexPetContextValue>(
    () => ({
      answerQuestion,
      clearSpeech,
      dismissMessage,
      error,
      history,
      isLoading,
      pets,
      refresh,
      selectedKey,
      selectedPet,
      selectPet,
      togglePetVisibility,
      visibleKeys,
      speak,
      speech,
    }),
    [answerQuestion, clearSpeech, dismissMessage, error, history, isLoading, pets, refresh, selectedKey, selectedPet, selectPet, speak, speech, togglePetVisibility, visibleKeys]
  );

  return <CodexPetContext.Provider value={value}>{children}</CodexPetContext.Provider>;
}

export function useCodexPets() {
  const context = useContext(CodexPetContext);
  if (!context) throw new Error("useCodexPets must be used inside CodexPetProvider");
  return context;
}
