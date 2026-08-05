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
