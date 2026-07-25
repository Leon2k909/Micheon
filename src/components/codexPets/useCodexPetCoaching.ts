import { useCallback, useEffect, useState } from "react";

import {
  CODEX_PET_COACHING_FREQUENCY_EVENT,
  CODEX_PET_QUESTION_FREQUENCY_KEY,
  CODEX_PET_TIP_FREQUENCY_KEY,
  getCodexPetFrequency,
  setCodexPetFrequency,
  type CodexPetCoachingKind,
  type CodexPetFrequency,
} from "@/lib/codexPetCoaching";

function readFrequencies() {
  return {
    questions: getCodexPetFrequency("questions"),
    tips: getCodexPetFrequency("tips"),
  };
}

export function useCodexPetCoaching() {
  const [frequencies, setFrequencies] = useState(readFrequencies);

  useEffect(() => {
    const sync = () => setFrequencies(readFrequencies());
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === CODEX_PET_QUESTION_FREQUENCY_KEY
        || event.key === CODEX_PET_TIP_FREQUENCY_KEY
      ) sync();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CODEX_PET_COACHING_FREQUENCY_EVENT, sync);
    window.addEventListener("storage-sync-completed", sync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CODEX_PET_COACHING_FREQUENCY_EVENT, sync);
      window.removeEventListener("storage-sync-completed", sync);
    };
  }, []);

  const setFrequency = useCallback((
    kind: CodexPetCoachingKind,
    frequency: CodexPetFrequency
  ) => setCodexPetFrequency(kind, frequency), []);

  return { frequencies, setFrequency };
}
