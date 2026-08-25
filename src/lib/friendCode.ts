import { syncLocalStorageItem } from "@/lib/profileStorage";

/**
 * The name this installation answers to on the network.
 *
 * Two apps that have never met need one thing to say to each other first, and
 * this is it. It is random rather than derived from the account: an address
 * built from an email address is guessable, and anyone who guessed it could
 * ask this app who it is and what it has done today.
 *
 * It is stored, not regenerated, because a friend keeps the code you gave
 * them. Changing it silently would leave them holding an address that answers
 * to nobody, and the app would have no way to tell them why.
 */
export const FRIEND_CODE_KEY = "gl-friend-code-v1";

/** How the code is shown and typed: five groups of four, case-insensitive. */
const GROUP = 4;
const GROUPS = 5;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * No I, O, 0 or 1. The code gets read off one screen and typed into another,
 * and those four are the pairs people mistype — which would present as "she
 * typed it right and it still says no such person".
 */
function randomCode(): string {
  const raw = new Uint8Array(GROUP * GROUPS);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(raw);
  else for (let i = 0; i < raw.length; i += 1) raw[i] = Math.floor(Math.random() * 256);
  let out = "";
  for (const byte of raw) out += ALPHABET[byte % ALPHABET.length];
  return out;
}

export function getFriendCode(): string {
  if (typeof window === "undefined") return "";
  const stored = window.localStorage.getItem(FRIEND_CODE_KEY);
  const clean = normaliseFriendCode(stored ?? "");
  if (clean) return clean;
  const made = randomCode();
  window.localStorage.setItem(FRIEND_CODE_KEY, made);
  syncLocalStorageItem(FRIEND_CODE_KEY, made);
  return made;
}

/** Strip anything that is not part of the alphabet, and upper-case the rest. */
export function normaliseFriendCode(input: string): string {
  const clean = String(input ?? "")
    .toUpperCase()
    .split("")
    .filter((character) => ALPHABET.includes(character))
    .join("");
  return clean.length === GROUP * GROUPS ? clean : "";
}

/** Grouped for reading aloud; the groups are cosmetic and never stored. */
export function formatFriendCode(code: string): string {
  const clean = normaliseFriendCode(code) || String(code ?? "").toUpperCase();
  const groups: string[] = [];
  for (let at = 0; at < clean.length; at += GROUP) groups.push(clean.slice(at, at + GROUP));
  return groups.join("-");
}

/**
 * The address the broker knows, which is not the code itself.
 *
 * The prefix keeps Micheon's peers from colliding with every other app using
 * the same public broker, where the namespace is shared and first-come.
 */
export function peerIdForCode(code: string): string {
  return `micheon-${normaliseFriendCode(code).toLowerCase()}`;
}
