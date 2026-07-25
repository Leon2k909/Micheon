import { syncLocalStorageItem } from "@/lib/profileStorage";

export const CODEX_PET_PREFERENCE_KEY = "gl-codex-pet";

export type CodexPetAnimation = {
  frames: number[];
  fps: number;
  loop: boolean;
  fallback?: string;
};

export type CodexPet = {
  id: string;
  displayName: string;
  description: string;
  source: "custom" | "legacy" | "builtin" | "micheon" | "micheon-custom";
  spriteVersionNumber?: 1 | 2;
  frame: {
    width: number;
    height: number;
    columns: number;
    rows: number;
  };
  animations: Record<string, CodexPetAnimation>;
  spritesheetUrl: string;
};

export type CodexPetCatalog = {
  pets: CodexPet[];
  selectedPetKey: string | null;
  source: "micheon-and-codex";
};

export function codexPetKey(pet: Pick<CodexPet, "source" | "id">) {
  return `${pet.source}:${pet.id}`;
}

export function getStoredCodexPetKey() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CODEX_PET_PREFERENCE_KEY);
}

export function storeCodexPetKey(key: string) {
  localStorage.setItem(CODEX_PET_PREFERENCE_KEY, key);
  syncLocalStorageItem(CODEX_PET_PREFERENCE_KEY, key);
}

const PET_CATALOG_ATTEMPTS = 3;
const PET_CATALOG_TIMEOUT_MS = 4000;

function waitForRetry(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(signal?.reason ?? new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function fetchCodexPetCatalog(signal?: AbortSignal): Promise<CodexPetCatalog> {
  let lastError: unknown;
  for (let attempt = 0; attempt < PET_CATALOG_ATTEMPTS; attempt += 1) {
    const attemptController = new AbortController();
    const handleAbort = () => attemptController.abort(signal?.reason);
    signal?.addEventListener("abort", handleAbort, { once: true });
    const timeout = window.setTimeout(
      () => attemptController.abort(new DOMException("Mascot catalog timed out", "TimeoutError")),
      PET_CATALOG_TIMEOUT_MS
    );
    try {
      const response = await fetch("/api/codex-pets", {
        cache: "no-store",
        signal: attemptController.signal,
      });
      if (!response.ok) throw new Error(`Codex pet catalog returned ${response.status}`);
      return await response.json() as CodexPetCatalog;
    } catch (error) {
      if (signal?.aborted) throw error;
      lastError = error;
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener("abort", handleAbort);
    }
    if (attempt + 1 < PET_CATALOG_ATTEMPTS) {
      await waitForRetry(250 * 2 ** attempt, signal);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unable to read mascot pets");
}
