import { getAuthUser, getScopedKey, type UserProfile } from "@/lib/profileStorage";

/**
 * What Micheon is storing, and how to get rid of it.
 *
 * Two honest separations here. First, THE APP versus YOUR DATA: the German
 * course is compiled into the program — you cannot uninstall it any more than
 * you can uninstall a chapter of a book — so it is reported as part of the
 * install, not as something to clear. Second, inside your data, the things you
 * would actually want to remove separately: a lesson history you would rather
 * not lose, a pile of game high scores you do not care about, and your own
 * added words which are the one irreplaceable part.
 */

export type DataCategoryId =
  | "progress"
  | "activity"
  | "custom"
  | "games"
  | "settings"
  | "other";

type DataCategory = {
  id: DataCategoryId;
  /** English, and a key into the interface dictionary — see ui(). */
  label: string;
  detail: string;
  bytes: number;
  entries: number;
  /** Losing this cannot be undone by using the app again. */
  irreplaceable: boolean;
};

export type DataUsage = {
  categories: DataCategory[];
  totalBytes: number;
};

/** Prefixes that identify a category. Longest match wins, so order matters. */
const CATEGORY_RULES: { id: DataCategoryId; prefixes: string[] }[] = [
  { id: "custom", prefixes: ["gl-custom-content", "germ-mastery-set", "externalWords"] },
  { id: "activity", prefixes: ["activity-log", "german-lab-h5p"] },
  {
    id: "progress",
    prefixes: [
      "session-completed", "german-lab-review-state", "progress-seen-words",
      "totalXp", "sessionsCompleted", "totalReviews", "streak", "streak-last-day",
      "course-progress", "active-course", "active-part", "vocab-mastery",
      "german-lab-placement-done", "german-lab-placement-result",
    ],
  },
  {
    id: "games",
    prefixes: ["falling-hs", "hole-hs", "snake-hs", "verbshooter-hs", "minesweeper-hs", "slither-hs", "whack-hs"],
  },
  {
    id: "settings",
    prefixes: [
      "gl-", "dashboardLayout", "dashboardHidden", "germ-notifications-muted",
      "english-variant", "micheon-",
    ],
  },
];

const LABELS: Record<DataCategoryId, Omit<DataCategory, "id" | "bytes" | "entries">> = {
  progress: {
    label: "Learning progress",
    detail: "Everything you have learned, your review schedule, streak and XP.",
    irreplaceable: true,
  },
  activity: {
    label: "Lesson history",
    detail: "The record of individual sittings behind the activity chart.",
    irreplaceable: true,
  },
  custom: {
    label: "Your own words and packs",
    detail: "Anything you typed in yourself. Nothing here can be recovered.",
    irreplaceable: true,
  },
  games: {
    label: "Game high scores",
    detail: "Best scores from the practice games. Safe to clear.",
    irreplaceable: false,
  },
  settings: {
    label: "Settings and appearance",
    detail: "Theme, accent colour, voice and learning preferences.",
    irreplaceable: false,
  },
  other: {
    label: "Everything else",
    detail: "Odds and ends Micheon keeps that do not fit the groups above.",
    irreplaceable: false,
  },
};

function categorise(key: string): DataCategoryId {
  for (const rule of CATEGORY_RULES) {
    if (rule.prefixes.some((prefix) => key === prefix || key.startsWith(prefix))) return rule.id;
  }
  return "other";
}

/** Roughly what a key/value pair costs. UTF-16, so two bytes a character. */
function sizeOf(key: string, value: string): number {
  return (key.length + value.length) * 2;
}

/** Keys belonging to this profile, unscoped name alongside the real one. */
function ownKeys(profile: UserProfile | null): { key: string; name: string }[] {
  const out: { key: string; name: string }[] = [];
  if (typeof window === "undefined") return out;
  const suffix = getScopedKey("", profile); // ":<id>"
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    // A scoped key ends with this profile's id; an unscoped one belongs to
    // everybody on the machine and is left alone.
    if (key.endsWith(suffix)) out.push({ key, name: key.slice(0, -suffix.length) });
  }
  return out;
}

export function measureDataUsage(profile: UserProfile | null = getAuthUser()): DataUsage {
  const totals = new Map<DataCategoryId, { bytes: number; entries: number }>();
  let totalBytes = 0;
  try {
    for (const { key, name } of ownKeys(profile)) {
      const value = window.localStorage.getItem(key) ?? "";
      const bytes = sizeOf(key, value);
      const id = categorise(name);
      const row = totals.get(id) ?? { bytes: 0, entries: 0 };
      row.bytes += bytes;
      row.entries += 1;
      totals.set(id, row);
      totalBytes += bytes;
    }
  } catch {
    /* storage unavailable: report nothing rather than guess */
  }
  const categories = (Object.keys(LABELS) as DataCategoryId[])
    .map((id) => ({ id, ...LABELS[id], ...(totals.get(id) ?? { bytes: 0, entries: 0 }) }))
    .filter((row) => row.entries > 0)
    .sort((a, b) => b.bytes - a.bytes);
  return { categories, totalBytes };
}

/** Delete one group. Returns how many entries went. */
export function clearDataCategory(id: DataCategoryId, profile: UserProfile | null = getAuthUser()): number {
  let removed = 0;
  try {
    for (const { key, name } of ownKeys(profile)) {
      if (categorise(name) !== id) continue;
      window.localStorage.removeItem(key);
      removed += 1;
    }
  } catch {
    /* ignore */
  }
  return removed;
}

/**
 * Delete everything this profile has stored.
 *
 * Deliberately does NOT touch the account itself or other profiles on the
 * machine — "delete my data" means the learning, not "sign me out and remove
 * my girlfriend's progress too".
 */
export function clearAllData(profile: UserProfile | null = getAuthUser()): number {
  let removed = 0;
  try {
    for (const { key } of ownKeys(profile)) {
      window.localStorage.removeItem(key);
      removed += 1;
    }
  } catch {
    /* ignore */
  }
  return removed;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
