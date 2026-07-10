import { getAuthUser, getScopedKey, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";
import { recordSuccess, recordStruggle } from "@/lib/memoryStrength";

export const ACTIVITY_LOG_KEY = "activity-log";
export const COMPLETED_KEY = "session-completed";

export type ActivitySession = {
  ts: number;          // epoch ms recorded
  durationSec: number; // real time spent in the session
  sentences: number;
  dialogues: number;
};

export type GradeRecord = {
  lastGrade?: string;
  updatedAt?: string;
  /** spaced-repetition ladder fields — see lib/memoryStrength.ts */
  successes?: number;
  intervalDays?: number;
  dueAt?: string;
};
export type GradeStore = Record<string, GradeRecord>;

const DAY_MS = 86_400_000;
const MAX_SESSION_SEC = 7_200; // cap a single session at 2h to ignore "left tab open"

function normalizeLegacyGrade(grade: string | undefined) {
  if (grade === "know" || grade === "known" || grade === "easy" || grade === "good") return "know";
  if (grade === "struggle" || grade === "hard" || grade === "again") return "struggle";
  return null;
}

function loadLegacyGradeStore(): GradeStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("german-lab-review-state");
    if (!raw) return {};
    const legacy = JSON.parse(raw);
    if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) return {};

    const migrated: GradeStore = {};
    for (const [id, rec] of Object.entries<any>(legacy)) {
      const lastGrade = normalizeLegacyGrade(rec?.lastGrade);
      if (!lastGrade) continue;
      migrated[id] = {
        lastGrade,
        updatedAt: typeof rec?.updatedAt === "string" ? rec.updatedAt : new Date().toISOString(),
      };
    }
    return migrated;
  } catch {
    return {};
  }
}

export function loadActivitySessions(profile: UserProfile | null = getAuthUser()): ActivitySession[] {
  const raw = loadScopedJson<ActivitySession[]>(ACTIVITY_LOG_KEY, [], profile);
  return Array.isArray(raw) ? raw : [];
}

export function recordActivitySession(entry: ActivitySession, profile: UserProfile | null = getAuthUser()) {
  const log = loadActivitySessions(profile);
  log.push({ ...entry, durationSec: Math.min(MAX_SESSION_SEC, Math.max(0, Math.round(entry.durationSec))) });
  saveScopedJson(ACTIVITY_LOG_KEY, log.slice(-500), profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("activity-updated"));
}

export function loadGradeStore(profile: UserProfile | null = getAuthUser()): GradeStore {
  if (typeof window !== "undefined") {
    const scopedKey = getScopedKey(COMPLETED_KEY, profile);
    if (window.localStorage.getItem(scopedKey) == null) {
      const migrated = loadLegacyGradeStore();
      if (Object.keys(migrated).length > 0) {
        saveGradeStore(migrated, profile);
        return migrated;
      }
    }
  }

  const raw = loadScopedJson<any>(COMPLETED_KEY, {}, profile) ?? {};
  if (Array.isArray(raw)) {
    // legacy array form: ids known with no timestamp
    return Object.fromEntries(raw.map((id: string) => [id, { lastGrade: "know" }]));
  }
  return raw && typeof raw === "object" ? raw : {};
}

export function saveGradeStore(store: GradeStore, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(COMPLETED_KEY, store, profile);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("grades-updated"));
}

export type ItemStatus = "known" | "struggle" | "new";

export function statusForId(store: GradeStore, id: string, aliases: string[] = []): ItemStatus {
  for (const key of [id, ...aliases]) {
    const grade = store?.[key]?.lastGrade;
    if (grade === "know") return "known";
    if (grade === "struggle") return "struggle";
  }
  return "new";
}

/** Set or clear an item's status. status="new" removes it from the store. */
export function setItemStatus(
  id: string,
  status: ItemStatus,
  profile: UserProfile | null = getAuthUser(),
  aliases: string[] = []
) {
  const store = loadGradeStore(profile);
  // Clear any alias entries so the canonical id is the single source of truth.
  for (const alias of aliases) {
    if (alias !== id) delete store[alias];
  }
  if (status === "new") {
    delete store[id];
  } else if (status === "known") {
    // Feed the spaced-repetition ladder so manual marks build strength too.
    store[id] = recordSuccess(store[id]);
  } else {
    store[id] = recordStruggle();
  }
  saveGradeStore(store, profile);
  return store;
}


export type DayBucket = { dayStart: number; minutes: number; items: number };

export function summarizeActivity(
  sessions: ActivitySession[],
  grades: GradeStore,
  days: number,
  now = Date.now()
) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const rangeStart = startOfToday.getTime() - (days - 1) * DAY_MS;
  const idx = (ts: number) => Math.floor((ts - rangeStart) / DAY_MS);

  const buckets: DayBucket[] = Array.from({ length: days }, (_, i) => ({
    dayStart: rangeStart + i * DAY_MS,
    minutes: 0,
    items: 0,
  }));

  let totalSec = 0;
  let sessionsCount = 0;
  for (const s of sessions) {
    const i = idx(s.ts);
    if (i < 0 || i >= days) continue;
    buckets[i].minutes += s.durationSec / 60;
    totalSec += s.durationSec;
    sessionsCount += 1;
  }

  let itemsCount = 0;
  let knownCount = 0;
  for (const rec of Object.values(grades)) {
    if (!rec?.updatedAt) continue;
    const t = Date.parse(rec.updatedAt);
    if (Number.isNaN(t)) continue;
    const i = idx(t);
    if (i < 0 || i >= days) continue;
    buckets[i].items += 1;
    itemsCount += 1;
    if (rec.lastGrade === "know") knownCount += 1;
  }

  const activeDays = buckets.filter((b) => b.minutes > 0 || b.items > 0).length;

  return {
    hours: totalSec / 3600,
    sessionsCount,
    itemsCount,
    knownCount,
    activeDays,
    buckets,
  };
}
