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

export function getFavouriteCourses(profile: UserProfile | null = getAuthUser()): string[] {
  const raw = loadScopedJson<unknown>(KEY, [], profile);
  return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string" && id.length > 0) : [];
}

export function isFavouriteCourse(id: string, profile: UserProfile | null = getAuthUser()): boolean {
  return getFavouriteCourses(profile).includes(id);
}

/** Star or unstar one course, and return the list as it now stands. */
export function toggleFavouriteCourse(id: string, profile: UserProfile | null = getAuthUser()): string[] {
  const current = getFavouriteCourses(profile);
  const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
  saveScopedJson(KEY, next, profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(FAVOURITE_COURSES_EVENT));
  return next;
}
