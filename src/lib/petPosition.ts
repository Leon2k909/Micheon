import { flushSharedStorage, syncLocalStorageItem } from "@/lib/profileStorage";

/** Where a pet sits, in the plane it is drawn on. */
export type PetPosition = {
  x: number;
  y: number;
};

/** The pet inside the app window. */
export const PET_POSITION_KEY = "gl-codex-pet-position-v1";
/** The pet on the desktop, placed within the whole virtual desktop. */
export const DESKTOP_PET_POSITION_KEY = "gl-codex-pet-desktop-position-v2";
const PET_POSITION_MIRRORED_KEY = "gl-codex-pet-position-mirrored-v1";

/** Both lead pets, plus the per-pet keys the pets arranged apart write. */
function isPetPositionKey(key: string) {
  for (const base of [PET_POSITION_KEY, DESKTOP_PET_POSITION_KEY]) {
    if (key === base || key.startsWith(`${base}:`)) return true;
  }
  return false;
}

/**
 * The spot a pet was last put in, exactly as it was stored.
 *
 * Deliberately unclamped. Clamping belongs to whoever is about to draw the
 * pet, because the window it is drawn in can be a different size this time —
 * and a clamp folded into the read would quietly rewrite the learner's choice
 * into whatever fitted the smaller window.
 */
export function readStoredPetPosition(storageKey: string): PetPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "");
    if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
      return { x: Number(parsed.x), y: Number(parsed.y) };
    }
  } catch {
    // A corrupt position should never strand the mascot off-screen.
  }
  return null;
}

/**
 * Remember where a pet lives — in local storage AND in the shared mirror.
 *
 * The mirror is what a restart actually reads. App.tsx waits for
 * hydrateLocalStorageFromSharedStorage() before the pets render at all, and
 * that restore writes every shared key back over local storage, so a position
 * that only ever reached local storage was replaced by whatever the mirror
 * happened to be holding — usually a spot from whenever the profile was last
 * transferred. That is why dragging a pet somewhere and restarting put it
 * back where it used to be.
 *
 * Every other pet setting — size, name, layout, greeting, visibility — already
 * wrote to both. Position was the one that did not.
 */
export function savePetPosition(position: PetPosition, storageKey: string) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(position);
  window.localStorage.setItem(storageKey, raw);
  syncLocalStorageItem(storageKey, raw);
}

/**
 * Hand this machine's pet positions to the mirror, once, before it is restored.
 *
 * Without this the fix would only take effect after the next drag: local
 * storage holds where the pets really are, the mirror holds the stale spot,
 * and the very first restore of the updated app would still overwrite the good
 * one with the old one. Runs ahead of that restore and completes before it, so
 * the pets are where they were left on the first launch after updating, not
 * the second.
 */
export async function mirrorStoredPetPositions() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(PET_POSITION_MIRRORED_KEY) === "1") return;
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !isPetPositionKey(key)) continue;
    const value = window.localStorage.getItem(key);
    if (value !== null) syncLocalStorageItem(key, value);
  }
  // Only claim it is done once the mirror has actually taken them. A failed
  // batch is queued for retry, and the next start should try again too.
  await flushSharedStorage();
  window.localStorage.setItem(PET_POSITION_MIRRORED_KEY, "1");
  syncLocalStorageItem(PET_POSITION_MIRRORED_KEY, "1");
}
