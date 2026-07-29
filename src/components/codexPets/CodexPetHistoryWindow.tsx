import { useEffect } from "react";

import { CodexPetHistoryPanel } from "@/components/codexPets/CodexPetHistoryPanel";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { watchStoredThemePreferences } from "@/lib/theme";

const desktop = typeof window !== "undefined" ? (window as any).germDesktop : undefined;

/** Lightweight renderer for the desktop history window. */
export function CodexPetHistoryWindow() {
  const { answerQuestion, dismissMessage, history } = useCodexPets();

  useEffect(() => watchStoredThemePreferences(), []);

  return (
    <main className="relative h-full w-full overflow-hidden bg-transparent">
      <CodexPetHistoryPanel
        history={history}
        nativeWindow
        onAnswer={answerQuestion}
        onClose={() => desktop?.closePetHistory?.()}
        onDismiss={dismissMessage}
      />
    </main>
  );
}
