import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  codexPetKey,
  fetchCodexPetCatalog,
  getStoredCodexPetKey,
  storeCodexPetKey,
  type CodexPet,
} from "@/lib/codexPets";

type CodexPetContextValue = {
  error: string | null;
  isLoading: boolean;
  pets: CodexPet[];
  refresh: () => Promise<void>;
  selectedKey: string;
  selectedPet: CodexPet | null;
  selectPet: (key: string) => void;
};

const CodexPetContext = createContext<CodexPetContextValue | null>(null);

export function CodexPetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<CodexPet[]>([]);
  const [selectedKey, setSelectedKey] = useState(() => getStoredCodexPetKey() ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(reason instanceof Error ? reason.message : "Unable to read Codex pets");
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

  const selectPet = useCallback((key: string) => {
    setSelectedKey(key);
    storeCodexPetKey(key);
  }, []);

  const selectedPet = useMemo(
    () => pets.find((pet) => codexPetKey(pet) === selectedKey) ?? null,
    [pets, selectedKey]
  );

  const value = useMemo<CodexPetContextValue>(
    () => ({ error, isLoading, pets, refresh, selectedKey, selectedPet, selectPet }),
    [error, isLoading, pets, refresh, selectedKey, selectedPet, selectPet]
  );

  return <CodexPetContext.Provider value={value}>{children}</CodexPetContext.Provider>;
}

export function useCodexPets() {
  const context = useContext(CodexPetContext);
  if (!context) throw new Error("useCodexPets must be used inside CodexPetProvider");
  return context;
}
