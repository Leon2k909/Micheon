import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Where the background Listen player sits.
 *
 * It was pinned to the bottom right, which is also where a lot of the app
 * puts things worth reading, so it has to be movable around the window.
 * It is dragged, and where it
 * is dragged to is remembered per profile, because a player that returns to
 * the corner every time you open the app has not really moved.
 *
 * Stored as a fraction of the viewport rather than pixels. A window resized
 * between sessions would otherwise leave it off-screen, or wedged against an
 * edge it was nowhere near.
 */
export type MiniPlayerPosition = { x: number; y: number };

const KEY = "micheon:listen:mini-player-position";

const clampFraction = (value: unknown): number => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
};

export function loadMiniPlayerPosition(profile: UserProfile | null): MiniPlayerPosition | null {
  const stored = loadScopedJson<MiniPlayerPosition | null>(KEY, null, profile);
  if (!stored || typeof stored !== "object") return null;
  if (!Number.isFinite(Number(stored.x)) || !Number.isFinite(Number(stored.y))) return null;
  return { x: clampFraction(stored.x), y: clampFraction(stored.y) };
}

export function saveMiniPlayerPosition(position: MiniPlayerPosition | null, profile: UserProfile | null) {
  if (!position) {
    saveScopedJson(KEY, null, profile);
    return;
  }
  saveScopedJson(KEY, { x: clampFraction(position.x), y: clampFraction(position.y) }, profile);
}

/**
 * Turn a stored fraction into pixels that keep the whole player on screen.
 *
 * The fraction addresses the top-left corner, so a player parked at the right
 * edge of a wide window must not hang off a narrow one: the travel available
 * is the viewport minus the player itself.
 */
export function miniPlayerPixels(
  position: MiniPlayerPosition,
  size: { width: number; height: number },
  viewport: { width: number; height: number }
): { left: number; top: number } {
  const maxLeft = Math.max(0, viewport.width - size.width);
  const maxTop = Math.max(0, viewport.height - size.height);
  return {
    left: Math.round(clampFraction(position.x) * maxLeft),
    top: Math.round(clampFraction(position.y) * maxTop),
  };
}

/** And back again, for a drag that ends at a given pixel offset. */
export function miniPlayerFraction(
  pixels: { left: number; top: number },
  size: { width: number; height: number },
  viewport: { width: number; height: number }
): MiniPlayerPosition {
  const maxLeft = Math.max(1, viewport.width - size.width);
  const maxTop = Math.max(1, viewport.height - size.height);
  return {
    x: clampFraction(pixels.left / maxLeft),
    y: clampFraction(pixels.top / maxTop),
  };
}
