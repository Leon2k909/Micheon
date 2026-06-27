import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Real daily streak tracking.
 *
 * Stores the streak count plus the last active calendar day (local time).
 * The streak only stays "alive" if the last active day was today or yesterday;
 * miss a full day and it resets. This replaces the old hardcoded `streak: 1`.
 */

const STREAK_KEY = "streak";
const LAST_DAY_KEY = "streak-last-day";

function todayStr(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Whole calendar days from a -> b (local), DST-safe. */
function dayDiff(aStr: string, bStr: string): number {
  const a = new Date(`${aStr}T00:00:00`);
  const b = new Date(`${bStr}T00:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** The streak to display now (0 if it has lapsed). */
export function getStreak(profile: UserProfile | null = getAuthUser()): number {
  const streak = Number(loadScopedJson(STREAK_KEY, 0, profile)) || 0;
  const last = String(loadScopedJson(LAST_DAY_KEY, "", profile) || "");
  if (!last) return streak; // legacy / never recorded — show stored value
  const diff = dayDiff(last, todayStr());
  return diff === 0 || diff === 1 ? streak : 0;
}

/**
 * Record activity for today and return the updated streak.
 * Same day → unchanged (min 1). Consecutive day → +1. Gap → reset to 1.
 */
export function recordStreakDay(profile: UserProfile | null = getAuthUser()): number {
  const today = todayStr();
  const last = String(loadScopedJson(LAST_DAY_KEY, "", profile) || "");
  let streak = Number(loadScopedJson(STREAK_KEY, 0, profile)) || 0;

  if (!last) {
    streak = 1;
  } else {
    const diff = dayDiff(last, today);
    if (diff === 0) streak = Math.max(1, streak);
    else if (diff === 1) streak += 1;
    else streak = 1;
  }

  saveScopedJson(STREAK_KEY, streak, profile);
  saveScopedJson(LAST_DAY_KEY, today, profile);
  return streak;
}
