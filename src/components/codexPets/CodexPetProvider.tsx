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
import { withPetPrefix } from "@/lib/petGreetings";
import { getCodexPetTimings } from "@/lib/codexPetCoaching";
import { setItemStatus } from "@/lib/activity";
import {
  getAuthUser,
  getScopedKey,
  loadScopedJson,
  saveScopedJson,
  syncLocalStorageItem,
} from "@/lib/profileStorage";
import { uiIsGerman } from "@/lib/i18n";
import {
  CODEX_PET_DISPLAY_MODE_EVENT,
  CODEX_PET_DISPLAY_MODE_KEY,
  getPetDisplayMode,
  isPetDisplayMode,
  setPetDisplayMode as storePetDisplayMode,
  type PetDisplayMode,
} from "@/lib/petDisplayMode";
import { notePetRecallAnswer, notePetRecallQuestion } from "@/lib/petRecall";

const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;
const desktopSurface = typeof window !== "undefined"
  ? new URLSearchParams(window.location.search)
  : null;
const isDesktopPetOverlay = typeof window !== "undefined"
  && desktopSurface?.get("pet-overlay") === "1";
const isDesktopPetHistory = typeof window !== "undefined"
  && desktopSurface?.get("pet-history") === "1";
const isDesktopPetSurface = isDesktopPetOverlay || isDesktopPetHistory;
const PET_HISTORY_KEY = "pet-message-history-v1";
const PET_VISIBLE_KEYS_KEY = "gl-codex-pet-visible-v1";
const MAX_PET_HISTORY = 200;
const PET_DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

export type CodexPetSpeechMood = "greeting" | "success" | "encourage" | "celebrate";
export type CodexPetVoiceLanguage = "de-DE" | "en-US";

export type CodexPetQuestion = {
  aliases?: string[];
  answerLanguage: "de" | "en";
  de: string;
  en: string;
  itemId: string;
  /** Sequence of the scheduled memory question, persisted across app restarts. */
  recallSequence?: number;
  /**
   * True for the follow-up that shows the answer and asks whether you really
   * had it. Saying "yes" to the first question is a guess about your own
   * memory made before seeing anything — this is the one that decides the
   * grade.
   */
  confirm?: boolean;
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
  voiceLang?: CodexPetVoiceLanguage;
};

type CodexPetSpeechOptions = {
  durationMs?: number;
  mood?: CodexPetSpeechMood;
  question?: CodexPetQuestion;
  voiceLang?: CodexPetVoiceLanguage;
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
  petDisplayMode: PetDisplayMode;
  selectedKey: string;
  selectedPet: CodexPet | null;
  selectPet: (key: string) => void;
  setPetDisplayMode: (mode: PetDisplayMode) => void;
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
  const [petDisplayMode, setPetDisplayModeState] = useState<PetDisplayMode>(getPetDisplayMode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speech, setSpeech] = useState<CodexPetSpeech | null>(null);
  const [history, setHistory] = useState<CodexPetSpeech[]>(loadPetHistory);
  const speechId = useRef(0);
  const speechTimer = useRef<number | null>(null);
  const historyRef = useRef(history);
  const catalogRefreshInFlight = useRef<Promise<void> | null>(null);
  const catalogRefreshRef = useRef<() => Promise<void>>(async () => {});
  const catalogRetryTimer = useRef<number | null>(null);
  const catalogRetryRounds = useRef(0);
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
    // How long it stays up is a setting now. A caller asking for a specific
    // duration still wins — the confirmation follow-up needs its 30 seconds
    // however brisk the learner likes their remarks.
    const timings = getCodexPetTimings();
    const preferred = message.question
      ? timings.questionSeconds * 1000
      : timings.messageSeconds * 1000;
    const ceiling = message.question
      ? Math.max(30000, preferred)
      : Math.max(7000, preferred);
    const visibleDuration = Math.min(ceiling, Math.max(1000, durationMs ?? preferred));
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
    // Was a hardcoded check for one pet's key, which prefixed everything it
    // said with "Hello darling." Every pet now gets that same dial, set by the
    // learner rather than by a code change.
    const messageText = withPetPrefix(selectedKey, rawText);
    const question = options.question && !options.question.confirm
      ? {
          ...options.question,
          recallSequence: notePetRecallQuestion(options.question, getAuthUser()),
        }
      : options.question;
    const message: CodexPetSpeech = {
      createdAt: Date.now(),
      id: `${Date.now()}-${++speechId.current}`,
      mood: options.mood ?? "greeting",
      question,
      text: messageText,
      voiceLang: options.voiceLang
        ?? (question
          ? question.answerLanguage === "en" ? "de-DE" : "en-US"
          : uiIsGerman() ? "de-DE" : "en-US"),
    };
    upsertHistory(message);
    showSpeech(message, options.durationMs);
    // The history renderer may still announce an explicitly requested answer
    // through the mascot. Only the mascot renderer itself suppresses forwarding
    // to avoid echoing a message back to its own native window.
    if (desktop && !isDesktopPetOverlay && petDisplayMode !== "app") {
      desktop.sendPetOverlaySpeech({ message, options: { durationMs: options.durationMs } });
    }
  }, [petDisplayMode, selectedKey, showSpeech, upsertHistory]);

  const answerQuestion = useCallback((
    messageId: string,
    answer: CodexPetAnswer,
    announce = true
  ) => {
    const entry = historyRef.current.find((message) => message.id === messageId);
    if (!entry?.question) return;

    const question = entry.question;
    const target = question.answerLanguage === "de" ? question.de : question.en;

    const nextEntry: CodexPetSpeech = {
      ...entry,
      answer,
      answeredAt: Date.now(),
    };
    upsertHistory(nextEntry);
    setSpeech((current) => current?.id === messageId ? nextEntry : current);

    // Saying "yes" to "do you know this?" is a guess about your own memory,
    // made before seeing the answer — and an easy one to get wrong when you are
    // only fairly sure. So the first yes reveals the answer and asks again;
    // only that second answer sets the grade. Saying "no" needs no check: you
    // have already told it you don't know, and it shows you the answer anyway.
    if (answer === "yes" && !question.confirm) {
      window.setTimeout(() => {
        speak(
          uiIsGerman()
            ? `Es heißt „${target}“ — hattest du es wirklich?`
            : `It's “${target}” — did you have it?`,
          {
            durationMs: 30000,
            mood: "greeting",
            question: { ...question, confirm: true },
            voiceLang: uiIsGerman() ? "de-DE" : "en-US",
          }
        );
      }, 180);
      return;
    }

    setItemStatus(
      question.itemId,
      answer === "yes" ? "known" : "struggle",
      getAuthUser(),
      question.aliases
    );
    const recallOutcome = notePetRecallAnswer(question, answer, getAuthUser());

    if (!announce) return;
    const response = answer === "yes"
      ? recallOutcome === "reinforcement"
        ? uiIsGerman()
          ? `Gut — „${target}“ sitzt schon besser. Ich frage dich später noch einmal.`
          : `Nice — “${target}” is getting stronger. I’ll check it again later.`
        : uiIsGerman()
          ? `Geschafft — „${target}“ sitzt jetzt.`
          : `You’ve got it — “${target}” is secure now.`
      : recallOutcome === "handed-over"
        // Asking a third time would just be the same question again. The
        // lesson can show the answer and drill it, so it goes there and the
        // pet moves on to something else.
        ? uiIsGerman()
          ? `Die Antwort ist „${target}“. Das üben wir in der nächsten Lektion richtig.`
          : `The answer is “${target}”. I’ve put it at the front of your next lesson so we can practise it properly.`
        : question.confirm
          ? uiIsGerman()
            ? `Kein Problem — ich frage dich „${target}“ bald wieder.`
            : `No problem — I’ll ask you “${target}” again soon.`
          : uiIsGerman()
            ? `Kein Problem — die Antwort ist „${target}“. Ich frage dich das bald wieder.`
            : `No problem — the answer is “${target}”. I’ll ask you this again soon.`;
    window.setTimeout(() => {
      speak(response, {
        durationMs: 5600,
        mood: answer === "yes" ? "success" : "encourage",
        voiceLang: uiIsGerman() ? "de-DE" : "en-US",
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

  const refresh = useCallback((): Promise<void> => {
    if (catalogRefreshInFlight.current) return catalogRefreshInFlight.current;
    setIsLoading(true);
    const request = (async () => {
      try {
        const catalog = await fetchCodexPetCatalog();
        setPets(catalog.pets);
        setError(null);
        catalogRetryRounds.current = 0;
        if (catalogRetryTimer.current !== null) {
          window.clearTimeout(catalogRetryTimer.current);
          catalogRetryTimer.current = null;
        }

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
        // The desktop overlay cannot receive normal window focus, so its old
        // focus-only refresh path made an initial catalog failure permanent.
        // Keep a small bounded recovery loop. Electron can report a transparent
        // overlay document as hidden during navigation even when its native
        // window is meant to be shown, so that browser flag is not reliable.
        if (
          isDesktopPetOverlay
          && catalogRetryTimer.current === null
          && catalogRetryRounds.current < 4
        ) {
          const delay = Math.min(12000, 1500 * 2 ** catalogRetryRounds.current);
          catalogRetryRounds.current += 1;
          catalogRetryTimer.current = window.setTimeout(() => {
            catalogRetryTimer.current = null;
            void catalogRefreshRef.current();
          }, delay);
        }
      } finally {
        catalogRefreshInFlight.current = null;
        setIsLoading(false);
      }
    })();
    catalogRefreshInFlight.current = request;
    return request;
  }, []);
  catalogRefreshRef.current = refresh;

  useEffect(() => {
    // The history surface only needs the shared message store. Avoid loading
    // and reloading the full pet catalogue whenever that small window opens or
    // regains focus.
    if (isDesktopPetHistory) {
      setIsLoading(false);
      return undefined;
    }
    void refresh();
    const handleFocus = () => void refresh();
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      catalogRetryRounds.current = 0;
      void refresh();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (catalogRetryTimer.current !== null) {
        window.clearTimeout(catalogRetryTimer.current);
        catalogRetryTimer.current = null;
      }
    };
  }, [refresh]);

  useEffect(() => {
    if (!isDesktopPetOverlay || !desktop?.onPetOverlayResync) return undefined;
    return desktop.onPetOverlayResync(() => {
      catalogRetryRounds.current = 0;
      void refresh();
    });
  }, [refresh]);

  useEffect(() => {
    const syncDisplayMode = () => setPetDisplayModeState(getPetDisplayMode());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CODEX_PET_PREFERENCE_KEY && event.newValue) {
        setSelectedKey(event.newValue);
      }
      if (event.key === PET_VISIBLE_KEYS_KEY) setVisibleKeys(getStoredVisiblePetKeys());
      if (event.key === CODEX_PET_DISPLAY_MODE_KEY) syncDisplayMode();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CODEX_PET_DISPLAY_MODE_EVENT, syncDisplayMode);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CODEX_PET_DISPLAY_MODE_EVENT, syncDisplayMode);
    };
  }, []);

  useEffect(() => {
    if (!desktop?.onPetDisplayModeChange) return undefined;
    return desktop.onPetDisplayModeChange((mode: unknown) => {
      if (isPetDisplayMode(mode)) setPetDisplayModeState(mode);
    });
  }, []);

  const setPetDisplayMode = useCallback((mode: PetDisplayMode) => {
    setPetDisplayModeState(mode);
    storePetDisplayMode(mode);
    desktop?.setPetDisplayMode?.(mode);
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
    desktop?.setPetOverlayVisible(key !== "off" && petDisplayMode !== "app");
    if (key === "off") clearSpeech();
  }, [clearSpeech, petDisplayMode]);

  /**
   * Show or hide one pet.
   *
   * This used to refuse outright when the pet was the talking one, because
   * hiding it would leave nothing to speak. True, but the refusal was silent:
   * the tickbox simply would not move, and the only way to discover why was to
   * pick a different pet and find it suddenly worked. Both the image and the
   * tickbox are now live for every pet, and the awkward case is handled rather
   * than forbidden — hiding the speaker hands the role to another visible pet,
   * or turns the mascot off if that was the last one.
   */
  const togglePetVisibility = useCallback((key: string) => {
    const hiding = visibleKeys.includes(key);
    const next = hiding
      ? visibleKeys.filter((entry) => entry !== key)
      : [...visibleKeys, key];
    setVisibleKeys(next);
    storeVisiblePetKeys(next);

    if (!hiding) {
      // Turning one on while the mascot is off entirely: this pet takes the
      // speaking role, so a single click does what it looks like it does
      // instead of ticking a box that changes nothing on screen.
      if (selectedKey === "off") {
        setSelectedKey(key);
        storeCodexPetKey(key);
      }
      desktop?.setPetOverlayVisible(petDisplayMode !== "app");
      return;
    }

    if (key === selectedKey) {
      const heir = next[0] ?? "off";
      setSelectedKey(heir);
      storeCodexPetKey(heir);
      desktop?.setPetOverlayVisible(heir !== "off" && petDisplayMode !== "app");
      if (heir === "off") clearSpeech();
      return;
    }

    desktop?.setPetOverlayVisible(selectedKey !== "off" && petDisplayMode !== "app");
  }, [clearSpeech, petDisplayMode, selectedKey, visibleKeys]);

  const selectedPet = useMemo(
    () => pets.find((pet) => codexPetKey(pet) === selectedKey) ?? null,
    [pets, selectedKey]
  );

  // Re-show the overlay only when the user's choice actually changes.
  //
  // This used to fire on every [isLoading, selectedPet] change. refresh() runs
  // on every window focus and rebuilds the pet list, so selectedPet became a new
  // object identity each time and the effect re-asserted "visible" — which
  // un-hid a pet the user had just closed from the overlay's own menu, as soon
  // as they clicked back on the main window. Comparing the key means a re-fetch
  // that resolves to the same pet no longer counts as a change.
  const pushedOverlayVisible = useRef<boolean | null>(null);
  useEffect(() => {
    if (!desktop || isDesktopPetSurface) return;
    desktop.setPetDisplayMode?.(petDisplayMode);
  }, [petDisplayMode]);

  useEffect(() => {
    if (!desktop || isDesktopPetSurface || isLoading) return;
    const shouldShow = Boolean(selectedPet) && petDisplayMode !== "app";
    if (pushedOverlayVisible.current === shouldShow) return;
    pushedOverlayVisible.current = shouldShow;
    desktop.setPetOverlayVisible(shouldShow);
  }, [isLoading, petDisplayMode, selectedKey, Boolean(selectedPet)]);

  const value = useMemo<CodexPetContextValue>(
    () => ({
      answerQuestion,
      clearSpeech,
      dismissMessage,
      error,
      history,
      isLoading,
      petDisplayMode,
      pets,
      refresh,
      selectedKey,
      selectedPet,
      selectPet,
      setPetDisplayMode,
      togglePetVisibility,
      visibleKeys,
      speak,
      speech,
    }),
    [answerQuestion, clearSpeech, dismissMessage, error, history, isLoading, petDisplayMode, pets, refresh, selectedKey, selectedPet, selectPet, setPetDisplayMode, speak, speech, togglePetVisibility, visibleKeys]
  );

  return <CodexPetContext.Provider value={value}>{children}</CodexPetContext.Provider>;
}

export function useCodexPets() {
  const context = useContext(CodexPetContext);
  if (!context) throw new Error("useCodexPets must be used inside CodexPetProvider");
  return context;
}
