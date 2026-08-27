import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Whether each of the two cards on the home page is unfolded.
 *
 * They fold outwards to the edge they sit at — language learning to the left,
 * country studies to the right — so the one you are not working on today gets
 * out of the way and the other takes the room it leaves.
 *
 * Open to begin with, and kept per profile rather than per course: how you
 * have arranged your own page is not a fact about German.
 */
export type HomeCard = "language" | "country";

const key = (card: HomeCard) => `home-card-open-${card}`;

export function getHomeCardOpen(card: HomeCard, profile: UserProfile | null = getAuthUser()): boolean {
  return loadScopedJson<unknown>(key(card), true, profile) !== false;
}

export function setHomeCardOpen(card: HomeCard, open: boolean, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(key(card), open, profile);
}
