import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Which nav destinations a learner has put away.
 *
 * The sidebar carries eleven entries and most people use four. Somebody
 * revising for the citizenship test does not want Games in their eyeline, and
 * somebody here only for German does not want Life in the UK. Hiding is
 * per-profile, because two people share this app and want different
 * things out of it.
 *
 * Nothing here removes a destination — only its button. Every hidden view is
 * still reachable by search, by a direct link, and by unhiding it, which is
 * why this can be a display preference rather than a feature switch.
 */
const HIDDEN_NAV_KEY = "nav-hidden-v1";
export const HIDDEN_NAV_EVENT = "gl-nav-hidden-changed";

/**
 * Home cannot be hidden.
 *
 * Not for tidiness: it is the fallback destination. Several places call
 * navigate("home") when a view becomes unavailable — a gated preview, a
 * course that unloads — and the app also opens there. A learner who hid it
 * would keep being sent to a place with no button, which reads as the nav
 * losing track of itself rather than as a choice they made.
 */
export const ALWAYS_VISIBLE_NAV: string[] = ["home"];

export function loadHiddenNav(profile: UserProfile | null = getAuthUser()): string[] {
  const raw = loadScopedJson<string[]>(HIDDEN_NAV_KEY, [], profile);
  if (!Array.isArray(raw)) return [];
  return raw.filter((id) => typeof id === "string" && !ALWAYS_VISIBLE_NAV.includes(id));
}

export function saveHiddenNav(ids: string[], profile: UserProfile | null = getAuthUser()) {
  const next = [...new Set(ids)].filter((id) => !ALWAYS_VISIBLE_NAV.includes(id));
  saveScopedJson(HIDDEN_NAV_KEY, next, profile);
  // The sidebar and the mobile bar are separate components reading the same
  // preference, so the change has to be announced rather than only returned.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<string[]>(HIDDEN_NAV_EVENT, { detail: next }));
  }
  return next;
}

export function hideNavItem(id: string, profile: UserProfile | null = getAuthUser()) {
  if (ALWAYS_VISIBLE_NAV.includes(id)) return loadHiddenNav(profile);
  return saveHiddenNav([...loadHiddenNav(profile), id], profile);
}

export function showNavItem(id: string, profile: UserProfile | null = getAuthUser()) {
  return saveHiddenNav(loadHiddenNav(profile).filter((entry) => entry !== id), profile);
}

export function showAllNavItems(profile: UserProfile | null = getAuthUser()) {
  return saveHiddenNav([], profile);
}

export function canHideNavItem(id: string): boolean {
  return !ALWAYS_VISIBLE_NAV.includes(id);
}

/**
 * Not everything in the sidebar is a destination.
 *
 * Everything in the sidebar has to be able to go: a heading takes its whole
 * section, a row inside goes on its own. Most of what is on screen is not a
 * nav item, though, and so had no id to
 * put away: the three folding headings are layout, and the rows under Country
 * studies are tabs within one view rather than views of their own. Speaking is
 * not built yet and Vocabulary library is a scroll position on the profile
 * page.
 *
 * So the store — which was always just a list of strings — gains two more
 * kinds of string. The prefix is what tells them apart, and it is a prefix
 * rather than a separate preference so that Show all, the count, the drag and
 * the restore list all keep working on one list without knowing the
 * difference.
 */
const NAV_SECTION_PREFIX = "section:";
const NAV_ROW_PREFIX = "row:";

/** The whole heading and everything folded under it. */
export const navSectionId = (section: string) => `${NAV_SECTION_PREFIX}${section}`;
/** One row that is not a nav destination: a tab, a preview, a scroll target. */
export const navRowId = (row: string) => `${NAV_ROW_PREFIX}${row}`;
