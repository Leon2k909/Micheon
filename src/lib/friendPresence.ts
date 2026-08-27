import { getFriendCode } from "@/lib/friendCode";
import { shrinkPhotoForSharing } from "@/lib/friendPhoto";
import type { FriendProfile } from "@/lib/friendProfile";
import { getLevelInfo } from "@/lib/gamificationProgress";
import { countLearningDays } from "@/lib/activity";
import { loadScopedJson } from "@/lib/profileStorage";
import { getStreak } from "@/lib/streak";

/**
 * What this app says about its own learner, built from storage rather than
 * from a screen.
 *
 * The Friends panel used to be the only thing that could answer this, because
 * it was the only thing holding the figures. That made it the only thing that
 * could run the peer — and a peer that only exists while one screen is open is
 * a peer that is almost never reachable. Two people had to be looking at the
 * same page at the same moment for anything to pass between them; any other
 * time, a friend's app reported "could not connect" and their figures stayed
 * at whenever that last happened to line up.
 *
 * Every figure here is already on the home page. Read fresh on each send, so a
 * lesson finished a minute ago goes out with the new numbers.
 */
export function readOwnFriendProfile(user: unknown): FriendProfile {
  const totalXp = Number(loadScopedJson("totalXp", 0, user as never) ?? 0);
  const name = String((user as { name?: string } | null)?.name ?? "").trim();
  return {
    v: 1,
    code: getFriendCode(),
    name,
    level: getLevelInfo(totalXp).cur.label,
    streak: Number(getStreak(user as never) ?? 0),
    totalXp,
    learningDays: Number(countLearningDays(user as never) ?? 0),
    sentAt: Date.now(),
    photo: sharedPhoto,
  };
}

/**
 * The thumbnail of this learner's own photo.
 *
 * Held here rather than in a component for the same reason as everything else
 * on this page: shrinking reads a canvas and cannot happen inside the
 * synchronous call that builds a profile, and the profile is now built from
 * places that have no React state of their own.
 */
let sharedPhoto: string | undefined;

export async function primeSharedPhoto(avatar: string | undefined): Promise<void> {
  if (!avatar) {
    sharedPhoto = undefined;
    return;
  }
  sharedPhoto = await shrinkPhotoForSharing(avatar);
}
