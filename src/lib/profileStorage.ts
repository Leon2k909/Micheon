export const PROFILE_STORAGE_KEY = "german-arena-profile";
export const AUTH_USER_KEY = "german-arena-auth";
export const SIGNED_OUT_KEY = "german-arena-signed-out";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  avatar?: string;
  externalWordsLearned: number;
}

export const DEFAULT_LOCAL_USER: UserProfile = {
  id: "leon--leon-ordifydirect-com",
  name: "Leon",
  email: "leon@ordifydirect.com",
  joinedAt: "2026-06-05T00:00:00.000Z",
  externalWordsLearned: 0,
};

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

export function getOrCreateDefaultAuthUser(): UserProfile | null {
  const existing = getAuthUser();
  if (existing) return existing;
  // Respect an explicit sign-out: don't silently recreate the default user.
  if (typeof window !== "undefined") {
    try {
      if (window.localStorage.getItem(SIGNED_OUT_KEY) === "1") return null;
    } catch { /* ignore */ }
  }
  setAuthUser(DEFAULT_LOCAL_USER);
  saveScopedJson("german-lab-placement-done", true, DEFAULT_LOCAL_USER);
  saveScopedJson("active-part", "part3", DEFAULT_LOCAL_USER);
  return DEFAULT_LOCAL_USER;
}

export function setAuthUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  // Signing in (or saving a profile) clears any prior sign-out marker.
  try { window.localStorage.removeItem(SIGNED_OUT_KEY); } catch { /* ignore */ }
}

/** Log out for real: drop the session and remember that it was intentional. */
export function signOut() {
  if (typeof window === "undefined") return;
  setAuthUser(null);
  try { window.localStorage.setItem(SIGNED_OUT_KEY, "1"); } catch { /* ignore */ }
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
  window.localStorage.setItem(getScopedKey(key, profile), JSON.stringify(value));
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
