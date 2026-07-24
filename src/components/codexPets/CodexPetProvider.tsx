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

const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;
const isDesktopPetOverlay = typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("pet-overlay") === "1";

export type CodexPetSpeechMood = "greeting" | "success" | "encourage" | "celebrate";

export type CodexPetSpeech = {
  id: number;
  mood: CodexPetSpeechMood;
  text: string;
};

type CodexPetSpeechOptions = {
  durationMs?: number;
  mood?: CodexPetSpeechMood;
};

type CodexPetContextValue = {
  clearSpeech: () => void;
  error: string | null;
  isLoading: boolean;
  pets: CodexPet[];
  refresh: () => Promise<void>;
  selectedKey: string;
  selectedPet: CodexPet | null;
  selectPet: (key: string) => void;
  speak: (text: string, options?: CodexPetSpeechOptions) => void;
  speech: CodexPetSpeech | null;
};

const CodexPetContext = createContext<CodexPetContextValue | null>(null);

export function CodexPetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<CodexPet[]>([]);
  const [selectedKey, setSelectedKey] = useState(() => getStoredCodexPetKey() ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speech, setSpeech] = useState<CodexPetSpeech | null>(null);
  const speechId = useRef(0);
  const speechTimer = useRef<number | null>(null);

  const clearSpeech = useCallback(() => {
    if (speechTimer.current !== null) {
      window.clearTimeout(speechTimer.current);
      speechTimer.current = null;
    }
    setSpeech(null);
  }, []);

  const showSpeech = useCallback((text: string, options: CodexPetSpeechOptions = {}) => {
    const message = text.trim();
    if (!message) return;

    if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
    const id = ++speechId.current;
    const durationMs = Math.min(7000, Math.max(1600, options.durationMs ?? 3200));
    setSpeech({ id, mood: options.mood ?? "greeting", text: message });
    speechTimer.current = window.setTimeout(() => {
      setSpeech((current) => current?.id === id ? null : current);
      speechTimer.current = null;
    }, durationMs);
  }, []);

  const speak = useCallback((text: string, options: CodexPetSpeechOptions = {}) => {
    showSpeech(text, options);
    if (desktop && !isDesktopPetOverlay) {
      desktop.sendPetOverlaySpeech({ options, text });
    }
  }, [showSpeech]);

  useEffect(() => () => {
    if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
  }, []);

  useEffect(() => {
    if (!isDesktopPetOverlay || !desktop?.onPetOverlaySpeech) return undefined;
    return desktop.onPetOverlaySpeech((payload: {
      options?: CodexPetSpeechOptions;
      text?: string;
    }) => {
      if (typeof payload?.text === "string") showSpeech(payload.text, payload.options);
    });
  }, [showSpeech]);

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
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const selectPet = useCallback((key: string) => {
    setSelectedKey(key);
    storeCodexPetKey(key);
    desktop?.setPetOverlayVisible(key !== "off");
    if (key === "off") clearSpeech();
  }, [clearSpeech]);

  const selectedPet = useMemo(
    () => pets.find((pet) => codexPetKey(pet) === selectedKey) ?? null,
    [pets, selectedKey]
  );

  useEffect(() => {
    if (desktop && !isLoading) desktop.setPetOverlayVisible(Boolean(selectedPet));
  }, [isLoading, selectedPet]);

  const value = useMemo<CodexPetContextValue>(
    () => ({
      clearSpeech,
      error,
      isLoading,
      pets,
      refresh,
      selectedKey,
      selectedPet,
      selectPet,
      speak,
      speech,
    }),
    [clearSpeech, error, isLoading, pets, refresh, selectedKey, selectedPet, selectPet, speak, speech]
  );

  return <CodexPetContext.Provider value={value}>{children}</CodexPetContext.Provider>;
}

export function useCodexPets() {
  const context = useContext(CodexPetContext);
  if (!context) throw new Error("useCodexPets must be used inside CodexPetProvider");
  return context;
}
