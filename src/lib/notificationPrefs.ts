import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Which kinds of notification the bell is allowed to raise.
 *
 * The bell used to show the same two items to everybody, for ever, with a
 * badge that never went down. Someone who does not play the games should not
 * be told about them every time they open the app, and a permanent "2" on a
 * bell teaches people to ignore the bell.
 *
 * Muting a kind hides it and takes it out of the badge count. Nothing is
 * deleted: unmuting brings it straight back if it still applies.
 *
 * Profile-scoped, so two people on one machine keep their own choices.
 */
const KEY = "gl-muted-notifications-v1";

export const NOTIFICATION_PREFS_EVENT = "gl:notification-prefs-change";

export type NotificationKind = "reviews" | "games" | "streak" | "progress";

export const NOTIFICATION_KINDS: Array<{ id: NotificationKind; label: string }> = [
  { id: "reviews", label: "Reviews" },
  { id: "games", label: "Games" },
  { id: "streak", label: "Streak" },
  { id: "progress", label: "Progress" },
];

const KNOWN = new Set<string>(NOTIFICATION_KINDS.map((kind) => kind.id));

function normalise(value: unknown): NotificationKind[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((entry): entry is NotificationKind =>
    typeof entry === "string" && KNOWN.has(entry)))];
}

export function getMutedNotificationKinds(profile?: UserProfile | null): Set<NotificationKind> {
  if (typeof window === "undefined") return new Set();
  return new Set(normalise(loadScopedJson<NotificationKind[]>(KEY, [], profile)));
}

export function setNotificationKindMuted(
  kind: NotificationKind,
  muted: boolean,
  profile?: UserProfile | null
): Set<NotificationKind> {
  const next = getMutedNotificationKinds(profile);
  if (muted) next.add(kind);
  else next.delete(kind);
  saveScopedJson(KEY, [...next], profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTIFICATION_PREFS_EVENT));
  return next;
}

export function setAllNotificationsMuted(muted: boolean, profile?: UserProfile | null): Set<NotificationKind> {
  const next = muted ? new Set(NOTIFICATION_KINDS.map((kind) => kind.id)) : new Set<NotificationKind>();
  saveScopedJson(KEY, [...next], profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTIFICATION_PREFS_EVENT));
  return next;
}

/**
 * Which individual notifications have been read and which have been cleared.
 *
 * Muting a whole kind is a standing decision; this is the day-to-day one —
 * "I have seen that", "I do not want that one there". Both are per profile.
 *
 * Notifications are written fresh from the learner's numbers every render, so
 * an id has to say which showing it is: "streak:2026-08-05", not "streak".
 * Clearing today's streak note therefore does not silence tomorrow's, which is
 * the behaviour muting is for.
 */
const STATUS_KEY = "gl-notification-status-v1";

/** Ids fall out of storage once they can no longer be produced again. */
const MAX_TRACKED_IDS = 120;

interface NotificationStatus {
  dismissed: string[];
  read: string[];
}

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((entry): entry is string =>
    typeof entry === "string" && entry.length > 0 && entry.length < 200))]
    .slice(-MAX_TRACKED_IDS);
}

function readStatus(profile?: UserProfile | null): NotificationStatus {
  if (typeof window === "undefined") return { dismissed: [], read: [] };
  const raw = loadScopedJson<Partial<NotificationStatus>>(STATUS_KEY, {}, profile);
  return { dismissed: cleanIds(raw?.dismissed), read: cleanIds(raw?.read) };
}

function writeStatus(next: NotificationStatus, profile?: UserProfile | null) {
  saveScopedJson(STATUS_KEY, {
    dismissed: cleanIds(next.dismissed),
    read: cleanIds(next.read),
  }, profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTIFICATION_PREFS_EVENT));
}

export function getNotificationStatus(profile?: UserProfile | null): {
  dismissed: Set<string>;
  read: Set<string>;
} {
  const stored = readStatus(profile);
  return { dismissed: new Set(stored.dismissed), read: new Set(stored.read) };
}

export function markNotificationsRead(ids: string[], profile?: UserProfile | null) {
  const stored = readStatus(profile);
  writeStatus({ ...stored, read: [...stored.read, ...ids] }, profile);
}

/** Clearing something also marks it read — an unread count for a row that is
 *  no longer on screen is a badge nobody can ever get rid of. */
export function dismissNotifications(ids: string[], profile?: UserProfile | null) {
  const stored = readStatus(profile);
  writeStatus({
    dismissed: [...stored.dismissed, ...ids],
    read: [...stored.read, ...ids],
  }, profile);
}

/** Bring back everything cleared today, for when it went too far. */
export function restoreDismissedNotifications(profile?: UserProfile | null) {
  const stored = readStatus(profile);
  writeStatus({ ...stored, dismissed: [] }, profile);
}
