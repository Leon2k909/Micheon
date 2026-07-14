export const PROFILE_STORAGE_KEY = "german-arena-profile";
export const AUTH_USER_KEY = "german-arena-auth";
export const SIGNED_OUT_KEY = "german-arena-signed-out";
export const KNOWN_PROFILES_KEY = "german-arena-known-profiles";
const SHARED_SYNC_PREFIXES = [
  "german-arena-",
  "active-part:",
  "german-lab-placement-done:",
  "session-completed:",
  "totalXp:",
  "sessionsCompleted:",
  "totalReviews:",
  "streak:",
  "streak-last-day:",
  "externalWords:",
  "activity-log:",
  "course-progress:",
  "active-course:",
  "english-variant:",
  "gl-",
  "vocab-mastery",
  "germ-mastery-set",
  "german-lab-review-state",
  "progress-seen-words",
  "falling-hs",
  "hole-hs",
  "snake-hs",
  "verbshooter-hs",
  "minesweeper-hs",
  "slither-hs",
  "whack-hs",
  "dashboardLayout",
  "dashboardHidden",
  "germ-notifications-muted",
  "german-lab-h5p",
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  avatar?: string;
  externalWordsLearned: number;
}

export function slugify(value: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildProfileId(name: string, email: string) {
  const n = slugify(name);
  const e = slugify(email);
  return [n, e].filter(Boolean).join("--") || "anonymous";
}

function readKnownProfiles(): Record<string, UserProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KNOWN_PROFILES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Remember a profile keyed by its email so signing back in with the same email
 * reconnects to the exact same account — same id, so the same scoped progress.
 * Progress lives under the profile id, so a stable id per email is what keeps
 * "my progress lives on my email" true across sign-outs and re-logins.
 */
export function recordKnownProfile(user: UserProfile) {
  if (typeof window === "undefined" || !user?.email) return;
  const map = readKnownProfiles();
  const key = slugify(user.email);
  if (JSON.stringify(map[key]) === JSON.stringify(user)) return;
  map[key] = user;
  const raw = JSON.stringify(map);
  try { window.localStorage.setItem(KNOWN_PROFILES_KEY, raw); } catch { /* ignore */ }
  syncSharedItems({ [KNOWN_PROFILES_KEY]: raw });
}

/** Look up a previously-seen profile by email (case/format-insensitive). */
export function findProfileByEmail(email: string): UserProfile | null {
  if (!email) return null;
  return readKnownProfiles()[slugify(email)] || null;
}

export function getAuthUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function shouldSyncKey(key: string) {
  return SHARED_SYNC_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function syncSharedItems(items: Record<string, string | null>) {
  if (typeof window === "undefined") return;
  const filtered = Object.fromEntries(Object.entries(items).filter(([key]) => shouldSyncKey(key)));
  if (Object.keys(filtered).length === 0) return;

  fetch("/api/storage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: filtered }),
  }).catch(() => {
    // The app still works offline from localStorage; sync resumes when the local server is reachable.
  });
}

export function syncLocalStorageItem(key: string, value: string | null) {
  syncSharedItems({ [key]: value });
}

export async function hydrateLocalStorageFromSharedStorage() {
  if (typeof window === "undefined") return false;
  try {
    const response = await fetch("/api/storage", { cache: "no-store" });
    if (!response.ok) return false;
    const data = await response.json();
    const items = data?.items && typeof data.items === "object" ? data.items : {};
    let changed = false;
    let gradesChanged = false;
    let activityChanged = false;
    let masteryChanged = false;

    for (const [key, value] of Object.entries(items)) {
      if (typeof key !== "string" || typeof value !== "string" || !shouldSyncKey(key)) continue;
      if (window.localStorage.getItem(key) !== value) {
        window.localStorage.setItem(key, value);
        changed = true;
        if (key.startsWith("session-completed:")) {
          gradesChanged = true;
        }
        if (key.startsWith("activity-log:")) {
          activityChanged = true;
        }
        if (key === "germ-mastery-set" || key.startsWith("vocab-mastery")) {
          masteryChanged = true;
        }
      }
    }

    if (changed) {
      if (gradesChanged) {
        window.dispatchEvent(new Event("grades-updated"));
      }
      if (activityChanged) {
        window.dispatchEvent(new Event("activity-updated"));
      }
      if (masteryChanged) {
        try {
          const raw = window.localStorage.getItem("germ-mastery-set");
          const count = raw ? JSON.parse(raw).length : 0;
          window.dispatchEvent(new CustomEvent("vocab-mastery-updated", { detail: { count } }));
        } catch {}
      }
      window.dispatchEvent(new Event("storage-sync-completed"));
    }

    return changed;
  } catch {
    return false;
  }
}


export function setAuthUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(AUTH_USER_KEY);
    syncSharedItems({ [AUTH_USER_KEY]: null });
    return;
  }
  const raw = JSON.stringify(user);
  window.localStorage.setItem(AUTH_USER_KEY, raw);
  syncSharedItems({ [AUTH_USER_KEY]: raw });
  // Remember this account by email so a later email-only login reconnects to it.
  recordKnownProfile(user);
  // Signing in (or saving a profile) clears any prior sign-out marker.
  try { window.localStorage.removeItem(SIGNED_OUT_KEY); } catch { /* ignore */ }
  syncSharedItems({ [SIGNED_OUT_KEY]: null });
}

/** Log out for real: drop the session and remember that it was intentional. */
export function signOut() {
  if (typeof window === "undefined") return;
  setAuthUser(null);
  try { window.localStorage.setItem(SIGNED_OUT_KEY, "1"); } catch { /* ignore */ }
  syncSharedItems({ [SIGNED_OUT_KEY]: "1" });
}

export function getScopedKey(key: string, profile: UserProfile | null) {
  const profileId = profile?.id || "default";
  return `${key}:${profileId}`;
}

export function loadScopedJson<T>(key: string, fallback: T, profile: UserProfile | null = getAuthUser()): T {
  if (typeof window === "undefined") return fallback;
  const storage = window.localStorage;
  const scopedKey = getScopedKey(key, profile);
  const raw = storage.getItem(scopedKey);

  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveScopedJson<T>(key: string, value: T, profile: UserProfile | null = getAuthUser()) {
  if (typeof window === "undefined") return;
  const scopedKey = getScopedKey(key, profile);
  const raw = JSON.stringify(value);
  window.localStorage.setItem(scopedKey, raw);
  syncSharedItems({ [scopedKey]: raw });
}

const debounceTimers = new Map<string, any>();

/** Batched writes for high-churn keys. */
export function scheduleSaveScopedJson<T>(key: string, value: T, profile: UserProfile | null = getAuthUser(), delayMs = 400) {
  if (typeof window === "undefined") return;
  const scopedKey = getScopedKey(key, profile);
  const prev = debounceTimers.get(scopedKey);
  if (prev) clearTimeout(prev);
  const id = setTimeout(() => {
    debounceTimers.delete(scopedKey);
    saveScopedJson(key, value, profile);
  }, delayMs);
  debounceTimers.set(scopedKey, id);
}
