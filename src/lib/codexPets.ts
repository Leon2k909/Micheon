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
  source: "custom" | "legacy" | "builtin";
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
  source: "codex-home";
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

export async function fetchCodexPetCatalog(signal?: AbortSignal): Promise<CodexPetCatalog> {
  const response = await fetch("/api/codex-pets", {
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(`Codex pet catalog returned ${response.status}`);
  return response.json() as Promise<CodexPetCatalog>;
}
