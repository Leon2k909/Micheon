import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * How a long list gets around.
 *
 * Two lists in Create can run to hundreds of rows: the catalogue search, and
 * the cards of a big set. They handled it in opposite and equally unhelpful
 * ways — the search silently cut itself off at eighty results with no way to
 * reach the eighty-first, and the card editor rendered every card, so a set
 * of three hundred was a page you scrolled for a while.
 *
 * Leon: "no pagination when adding words? and if a page is really long like i
 * have loads of flashcards, let users pick if they wanna see a scroll to
 * bottom thing on the right of their screen or pagination".
 *
 * So it is a choice rather than a decision made for everybody. Paging is
 * better for finding a particular row; one long scroll is better for reading
 * straight through, and gets a jump control so the ends are always one press
 * away. The setting is per profile, because it is about how a person likes to
 * work rather than about any one set.
 */
export type LongListMode = "pages" | "scroll";

const KEY = "micheon:create:long-list-mode";

export const DEFAULT_LONG_LIST_MODE: LongListMode = "pages";

/** Page sizes, named so the two lists cannot drift apart by accident. */
export const CATALOGUE_PAGE_SIZE = 80;
export const CARD_PAGE_SIZE = 50;

/** Below this a list is short enough that neither control earns its place. */
export const LONG_LIST_THRESHOLD = 60;

// Defaulted to the signed-in profile like every other scoped store. Passing
// null explicitly writes to the guest scope, which is a different setting
// that nobody signed in ever reads back.
export function loadLongListMode(profile: UserProfile | null = getAuthUser()): LongListMode {
  const stored = loadScopedJson<LongListMode>(KEY, DEFAULT_LONG_LIST_MODE, profile);
  return stored === "scroll" ? "scroll" : "pages";
}

export function saveLongListMode(mode: LongListMode, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(KEY, mode, profile);
}

export type PageWindow = {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
};

/**
 * Which slice of a list a page shows.
 *
 * Clamped rather than trusted: a filter that shrinks the results while you
 * are on page nine must not leave you staring at an empty list with no way
 * back, so the page is pulled into range instead.
 */
export function pageWindow(total: number, page: number, size: number): PageWindow {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, size)));
  const clamped = Math.min(Math.max(1, Math.round(page) || 1), pageCount);
  const from = total === 0 ? 0 : (clamped - 1) * size + 1;
  const to = Math.min(total, clamped * size);
  return { page: clamped, pageCount, from, to, total };
}

export function pageSlice<T>(items: T[], page: number, size: number): T[] {
  const window = pageWindow(items.length, page, size);
  return items.slice((window.page - 1) * size, window.page * size);
}
