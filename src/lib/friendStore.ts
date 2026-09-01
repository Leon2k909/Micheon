import { syncLocalStorageItem } from "@/lib/profileStorage";
import { normaliseFriendCode } from "@/lib/friendCode";
import { readFriendProfile, type FriendProfile } from "@/lib/friendProfile";

/**
 * Who this app has agreed to talk to, and the last thing each of them said.
 *
 * Two separate jobs, kept in one place because they answer one question. The
 * list is the ONLY thing that opens the door: a connection from a code that is
 * not on it gets a pairing prompt and no data. The snapshots are what the
 * Friends list shows when nobody is connected, which is most of the time — a
 * list that empties whenever your friend closes their laptop would be worse
 * than useless, because it reads as "you have no friends" rather than "nobody
 * is online".
 */
const FRIENDS_KEY = "gl-friends-v1";
export const FRIENDS_EVENT = "micheon-friends-changed";

export type StoredFriend = {
  code: string;
  /** The name they went by when they paired; replaced by anything newer. */
  name: string;
  addedAt: number;
  /** Their last profile, and when THIS machine received it. */
  profile?: FriendProfile;
  /**
   * Local clock, deliberately. `profile.sentAt` is the sender's, and a friend
   * whose clock is a day fast would otherwise read as active tomorrow.
   */
  seenAt?: number;
};

type FriendTable = Record<string, StoredFriend>;

function read(): FriendTable {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FRIENDS_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    const out: FriendTable = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const code = normaliseFriendCode(key);
      if (!code || !value || typeof value !== "object") continue;
      const row = value as Record<string, unknown>;
      const profile = row.profile ? readFriendProfile(row.profile) : null;
      out[code] = {
        code,
        name: String(row.name ?? "").slice(0, 40) || code,
        addedAt: Number(row.addedAt) || 0,
        ...(profile ? { profile } : {}),
        ...(Number(row.seenAt) ? { seenAt: Number(row.seenAt) } : {}),
      };
    }
    return out;
  } catch {
    return {};
  }
}

function write(table: FriendTable) {
  if (typeof window === "undefined") return;
  const value = JSON.stringify(table);
  window.localStorage.setItem(FRIENDS_KEY, value);
  syncLocalStorageItem(FRIENDS_KEY, value);
  window.dispatchEvent(new CustomEvent(FRIENDS_EVENT));
}

export function loadFriends(): StoredFriend[] {
  return Object.values(read()).sort((a, b) => a.addedAt - b.addedAt);
}

export function isFriend(code: string): boolean {
  const clean = normaliseFriendCode(code);
  return Boolean(clean) && Boolean(read()[clean]);
}

export function addFriend(code: string, name: string): boolean {
  const clean = normaliseFriendCode(code);
  if (!clean) return false;
  const table = read();
  if (table[clean]) return false;
  table[clean] = { code: clean, name: String(name ?? "").slice(0, 40) || clean, addedAt: Date.now() };
  write(table);
  return true;
}

export function removeFriend(code: string) {
  const clean = normaliseFriendCode(code);
  const table = read();
  if (!clean || !table[clean]) return;
  delete table[clean];
  write(table);
}

/**
 * File a profile that arrived.
 *
 * Refused outright for a code that is not already a friend. Without that this
 * would be a way for any peer that reached us to plant a row in somebody's
 * Friends list.
 */
export function recordFriendProfile(profile: FriendProfile, now = Date.now()): boolean {
  const clean = normaliseFriendCode(profile.code);
  if (!clean) return false;
  const table = read();
  const existing = table[clean];
  if (!existing) return false;
  table[clean] = { ...existing, name: profile.name || existing.name, profile, seenAt: now };
  write(table);
  return true;
}

/** How recently they were heard from, in the words the Friends list uses. */
type FriendPresence = "online" | "today" | "recent" | "away";

const DAY_MS = 24 * 60 * 60 * 1000;

export function presenceFor(friend: StoredFriend, connected: boolean, now = Date.now()): FriendPresence {
  if (connected) return "online";
  const seen = friend.seenAt ?? 0;
  if (!seen) return "away";
  const sinceMidnight = new Date(now);
  sinceMidnight.setHours(0, 0, 0, 0);
  if (seen >= sinceMidnight.getTime()) return "today";
  if (seen >= sinceMidnight.getTime() - DAY_MS) return "recent";
  return "away";
}
