import {
  AUTH_USER_KEY,
  KNOWN_PROFILES_KEY,
  PROFILE_STORAGE_KEY,
  SIGNED_OUT_KEY,
  flushSharedStorage,
  syncLocalStorageItem,
  type UserProfile,
} from "@/lib/profileStorage";

export const DATA_EXPORT_FORMAT = "micheon-data-export";
export const DATA_EXPORT_SCHEMA_VERSION = 1 as const;
export const MAX_DATA_EXPORT_BYTES = 10 * 1024 * 1024;

const MAX_ITEMS = 2_000;
const MAX_KEY_LENGTH = 512;
const MAX_VALUE_LENGTH = MAX_DATA_EXPORT_BYTES;

/** Settings and local records that are intentionally portable across PCs. */
const PORTABLE_GLOBAL_KEYS = new Set([
  "dashboardHidden",
  "dashboardLayout",
  "english-variant",
  "falling-hs",
  "germ-notifications-muted",
  "german-lab-h5p",
  "german-lab-journal",
  "german-lab-review-state",
  "germ-mastery-set",
  "hole-hs",
  "minesweeper-hs",
  "snake-hs",
  "slither-hs",
  "verbshooter-hs",
  "whack-hs",
]);

const PORTABLE_GLOBAL_PREFIXES = ["gl-", "micheon-"];

/** Machine/account metadata, caches, and diagnostics must never be restored. */
const EXCLUDED_KEYS = new Set([
  AUTH_USER_KEY,
  KNOWN_PROFILES_KEY,
  PROFILE_STORAGE_KEY,
  SIGNED_OUT_KEY,
  "german-lab-dict-cache-v1",
  "gl-crash-reports",
]);

export type DataExportItem = {
  key: string;
  value: string;
};

export type DataExportProfile = Pick<
  UserProfile,
  "id" | "name" | "email" | "joinedAt" | "avatar" | "externalWordsLearned"
>;

export type DataExportArchive = {
  format: typeof DATA_EXPORT_FORMAT;
  schemaVersion: typeof DATA_EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  profile: DataExportProfile;
  profileItems: DataExportItem[];
  globalItems: DataExportItem[];
};

export type DataImportSummary = {
  profileItems: number;
  globalItems: number;
};

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normaliseEmail(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function isSafeProfileId(value: string): boolean {
  return value.length > 0 && value.length <= 160 && !value.includes(":");
}

function requireBrowserStorage(): Storage {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Micheon storage is unavailable.");
  }
  return window.localStorage;
}

function knownProfileIds(storage: Storage): Set<string> {
  const ids = new Set<string>();
  try {
    const parsed = JSON.parse(storage.getItem(KNOWN_PROFILES_KEY) ?? "{}");
    const values = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});
    for (const value of values) {
      const id = typeof value === "string" ? value : value?.id;
      if (typeof id === "string" && isSafeProfileId(id)) ids.add(id);
    }
  } catch {
    // A malformed profile index must not prevent the learner's own export.
  }
  return ids;
}

function isPortableGlobalKey(key: string): boolean {
  if (EXCLUDED_KEYS.has(key)) return false;
  if (PORTABLE_GLOBAL_KEYS.has(key)) return true;
  return PORTABLE_GLOBAL_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function profileSuffix(profileId: string): string {
  return `:${profileId}`;
}

function isOtherProfileKey(key: string, currentProfileId: string, profileIds: Set<string>): boolean {
  return [...profileIds].some(
    (profileId) => profileId !== currentProfileId && key.endsWith(profileSuffix(profileId))
  );
}

function classifyStoredKey(
  key: string,
  currentProfileId: string,
  profileIds: Set<string>
): "profile" | "global" | null {
  if (EXCLUDED_KEYS.has(key)) return null;
  if (key.endsWith(profileSuffix(currentProfileId))) return "profile";
  if (isOtherProfileKey(key, currentProfileId, profileIds)) return null;
  return isPortableGlobalKey(key) ? "global" : null;
}

function profileSnapshot(profile: UserProfile | null): DataExportProfile {
  if (!profile || !isSafeProfileId(profile.id) || !profile.email.trim()) {
    throw new Error("Sign in before exporting or importing Micheon data.");
  }
  return {
    id: profile.id,
    name: String(profile.name ?? "").slice(0, 160),
    email: profile.email.trim().slice(0, 320),
    joinedAt: String(profile.joinedAt ?? "").slice(0, 80),
    ...(profile.avatar ? { avatar: String(profile.avatar).slice(0, 2_000_000) } : {}),
    externalWordsLearned: Number.isFinite(Number(profile.externalWordsLearned))
      ? Math.max(0, Math.floor(Number(profile.externalWordsLearned)))
      : 0,
  };
}

function validateItemList(
  value: unknown,
  name: string,
  sourceProfileId: string,
  kind: "profile" | "global",
  seen: Set<string>
): DataExportItem[] {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) {
    throw new Error(`${name} is missing or too large.`);
  }

  return value.map((item, index) => {
    if (!isRecord(item) || typeof item.key !== "string" || typeof item.value !== "string") {
      throw new Error(`${name}[${index}] is invalid.`);
    }
    const key = item.key;
    if (!key || key.length > MAX_KEY_LENGTH || seen.has(key)) {
      throw new Error(`${name}[${index}] has an invalid or duplicate key.`);
    }
    if (item.value.length > MAX_VALUE_LENGTH) {
      throw new Error(`${name}[${index}] is too large.`);
    }

    if (kind === "profile" && !key.endsWith(profileSuffix(sourceProfileId))) {
      throw new Error(`${name}[${index}] does not belong to the exported profile.`);
    }
    if (kind === "global" && !isPortableGlobalKey(key)) {
      throw new Error(`${name}[${index}] is not a portable Micheon setting.`);
    }

    seen.add(key);
    return { key, value: item.value };
  });
}

/** Validate the archive without reading or changing localStorage. */
export function validateDataExport(value: unknown): DataExportArchive {
  if (!isRecord(value)
    || value.format !== DATA_EXPORT_FORMAT
    || value.schemaVersion !== DATA_EXPORT_SCHEMA_VERSION) {
    throw new Error("This is not a supported Micheon data export.");
  }

  const rawProfile = value.profile;
  if (!isRecord(rawProfile)
    || typeof rawProfile.id !== "string"
    || typeof rawProfile.name !== "string"
    || typeof rawProfile.email !== "string"
    || typeof rawProfile.joinedAt !== "string"
    || !isSafeProfileId(rawProfile.id)
    || !normaliseEmail(rawProfile.email).includes("@")) {
    throw new Error("The export profile is invalid.");
  }
  if (rawProfile.name.length > 160 || rawProfile.email.length > 320 || rawProfile.joinedAt.length > 80) {
    throw new Error("The export profile is too large.");
  }
  if (rawProfile.avatar !== undefined
    && (typeof rawProfile.avatar !== "string" || rawProfile.avatar.length > 2_000_000)) {
    throw new Error("The export profile photo is too large.");
  }

  const seen = new Set<string>();
  const profileItems = validateItemList(
    value.profileItems,
    "profileItems",
    rawProfile.id,
    "profile",
    seen
  );
  const globalItems = validateItemList(value.globalItems, "globalItems", rawProfile.id, "global", seen);
  const archive: DataExportArchive = {
    format: DATA_EXPORT_FORMAT,
    schemaVersion: DATA_EXPORT_SCHEMA_VERSION,
    exportedAt: typeof value.exportedAt === "string" ? value.exportedAt.slice(0, 80) : "",
    profile: {
      id: rawProfile.id,
      name: rawProfile.name,
      email: rawProfile.email,
      joinedAt: rawProfile.joinedAt,
      ...(rawProfile.avatar ? { avatar: rawProfile.avatar } : {}),
      externalWordsLearned: Number.isFinite(Number(rawProfile.externalWordsLearned))
        ? Math.max(0, Math.floor(Number(rawProfile.externalWordsLearned)))
        : 0,
    },
    profileItems,
    globalItems,
  };

  if (JSON.stringify(archive).length * 2 > MAX_DATA_EXPORT_BYTES) {
    throw new Error("The Micheon data export is too large.");
  }
  return archive;
}

export function parseDataExport(text: string): DataExportArchive {
  if (typeof text !== "string" || text.length * 2 > MAX_DATA_EXPORT_BYTES) {
    throw new Error("The Micheon data export is too large.");
  }
  try {
    return validateDataExport(JSON.parse(text));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("The selected file is not valid JSON.");
    throw error;
  }
}

export function serializeDataExport(archive: DataExportArchive): string {
  return JSON.stringify(validateDataExport(archive), null, 2);
}

export function collectDataExport(profile: UserProfile | null): DataExportArchive {
  const storage = requireBrowserStorage();
  const snapshot = profileSnapshot(profile);
  const profileIds = knownProfileIds(storage);
  profileIds.add(snapshot.id);
  const profileItems: DataExportItem[] = [];
  const globalItems: DataExportItem[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) continue;
    const kind = classifyStoredKey(key, snapshot.id, profileIds);
    if (!kind) continue;
    const value = storage.getItem(key);
    if (value === null) continue;
    (kind === "profile" ? profileItems : globalItems).push({ key, value });
  }

  profileItems.sort((a, b) => a.key.localeCompare(b.key));
  globalItems.sort((a, b) => a.key.localeCompare(b.key));
  return validateDataExport({
    format: DATA_EXPORT_FORMAT,
    schemaVersion: DATA_EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    profile: snapshot,
    profileItems,
    globalItems,
  });
}

export async function applyDataImport(
  value: unknown,
  targetProfile: UserProfile | null
): Promise<DataImportSummary> {
  const archive = validateDataExport(value);
  const target = profileSnapshot(targetProfile);
  if (normaliseEmail(archive.profile.email) !== normaliseEmail(target.email)) {
    throw new Error("This export belongs to a different profile.");
  }

  const storage = requireBrowserStorage();
  const profileIds = knownProfileIds(storage);
  profileIds.add(target.id);
  const sourceSuffix = profileSuffix(archive.profile.id);
  const targetSuffix = profileSuffix(target.id);
  const desired = new Map<string, string>();

  for (const item of archive.profileItems) {
    const key = item.key.endsWith(sourceSuffix)
      ? `${item.key.slice(0, -sourceSuffix.length)}${targetSuffix}`
      : item.key;
    if (isOtherProfileKey(key, target.id, profileIds)) {
      throw new Error("The export contains another local profile.");
    }
    desired.set(key, item.value);
  }
  for (const item of archive.globalItems) {
    if (isOtherProfileKey(item.key, target.id, profileIds)) {
      throw new Error("The export contains another local profile.");
    }
    desired.set(item.key, item.value);
  }

  const currentPortableKeys = new Set<string>();
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) continue;
    if (classifyStoredKey(key, target.id, profileIds)) currentPortableKeys.add(key);
  }
  const keysToChange = new Set([...currentPortableKeys, ...desired.keys()]);
  const previous = new Map<string, string | null>();
  for (const key of keysToChange) previous.set(key, storage.getItem(key));

  try {
    for (const key of keysToChange) {
      const next = desired.get(key);
      if (next === undefined) storage.removeItem(key);
      else storage.setItem(key, next);
    }
  } catch (error) {
    for (const [key, previousValue] of previous) {
      try {
        if (previousValue === null) storage.removeItem(key);
        else storage.setItem(key, previousValue);
      } catch {
        // Best-effort rollback; the original storage exception is more useful.
      }
    }
    throw error;
  }

  for (const key of keysToChange) {
    syncLocalStorageItem(key, desired.has(key) ? desired.get(key)! : null);
  }
  await flushSharedStorage();
  return { profileItems: archive.profileItems.length, globalItems: archive.globalItems.length };
}
