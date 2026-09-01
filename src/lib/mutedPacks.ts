import { loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Packs the learner has paused.
 *
 * Not every topic is for everybody — someone who never touches Mario Kart
 * should not have to learn its vocabulary to reach the rest of the course.
 * A paused pack is skipped entirely by Continue Learning: no new phrases, no
 * due reviews, no optional practice. Nothing is deleted, so unpausing brings
 * both the pack and any progress already made straight back.
 *
 * Profile-scoped, because two people sharing a machine rarely want to skip
 * the same things.
 */
const KEY = "gl-muted-packs-v1";

const MUTED_PACKS_EVENT = "gl:muted-packs-change";

function normalise(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0))];
}

export function getMutedPacks(profile?: UserProfile | null): Set<string> {
  if (typeof window === "undefined") return new Set();
  return new Set(normalise(loadScopedJson<string[]>(KEY, [], profile)));
}

export function setPackMuted(partKey: string, muted: boolean, profile?: UserProfile | null): Set<string> {
  const next = getMutedPacks(profile);
  if (muted) next.add(partKey);
  else next.delete(partKey);
  saveScopedJson(KEY, [...next], profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(MUTED_PACKS_EVENT));
  return next;
}

/** Pause or resume several packs in one write and one change event. */
export function setPacksMuted(
  partKeys: Iterable<string>,
  muted: boolean,
  profile?: UserProfile | null
): Set<string> {
  const next = getMutedPacks(profile);
  for (const key of partKeys) {
    if (muted) next.add(key);
    else next.delete(key);
  }
  saveScopedJson(KEY, [...next], profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(MUTED_PACKS_EVENT));
  return next;
}

export function clearMutedPacks(profile?: UserProfile | null): void {
  saveScopedJson(KEY, [], profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(MUTED_PACKS_EVENT));
}

/**
 * Drop paused packs from a catalogue, but never hand back an empty course:
 * if somebody pauses everything, the pause is ignored rather than leaving
 * Continue Learning with nothing to serve.
 */
export function withoutMutedPacks<T>(
  parts: Record<string, T>,
  muted: Set<string> = getMutedPacks()
): Record<string, T> {
  if (muted.size === 0) return parts;
  const kept = Object.fromEntries(Object.entries(parts).filter(([key]) => !muted.has(key)));
  return Object.keys(kept).length > 0 ? kept : parts;
}
