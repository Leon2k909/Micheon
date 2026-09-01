import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * The courses someone has starred in the switcher.
 *
 * Kept per profile, because which languages you care about is as personal as
 * the progress through them. The list is ids in the order they were starred,
 * so the section at the top of the switcher keeps a stable order rather than
 * reshuffling every time it is opened.
 */
const KEY = "favourite-courses";

/** Fired when the list changes, so an open switcher redraws both sections. */
export const FAVOURITE_COURSES_EVENT = "favourite-courses-changed";

/**
 * Whether the section is open. Open to begin with: the point of putting them
 * at the top is being able to see them.
 *
 * Per dialog, not per app. The switcher shows favourites twice — once among
 * the languages and once among the countries — and they are different
 * lists. One shared flag meant folding the countries away folded the
 * languages away too, in a dialog you were not even looking at. The
 * language dialog keeps the original key so nobody's section springs back
 * open because this shipped.
 */
export type FavouritesSection = "all" | "country";

const openKey = (section: FavouritesSection) =>
  (section === "country" ? "favourite-courses-open-country" : "favourite-courses-open");

export function getFavouritesOpen(
  section: FavouritesSection = "all",
  profile: UserProfile | null = getAuthUser()
): boolean {
  return loadScopedJson<unknown>(openKey(section), true, profile) !== false;
}

export function setFavouritesOpen(
  open: boolean,
  section: FavouritesSection = "all",
  profile: UserProfile | null = getAuthUser()
) {
  saveScopedJson(openKey(section), open, profile);
}

export function getFavouriteCourses(profile: UserProfile | null = getAuthUser()): string[] {
  const raw = loadScopedJson<unknown>(KEY, [], profile);
  return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string" && id.length > 0) : [];
}

/** Star or unstar one course, and return the list as it now stands. */
export function toggleFavouriteCourse(id: string, profile: UserProfile | null = getAuthUser()): string[] {
  const current = getFavouriteCourses(profile);
  const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
  saveScopedJson(KEY, next, profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(FAVOURITE_COURSES_EVENT));
  return next;
}
