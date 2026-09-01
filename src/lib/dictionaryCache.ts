const STORAGE_KEY = "german-lab-dict-cache-v1";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 600;

type CacheRow = { entry: unknown; ts: number };
type CacheBucket = Record<string, CacheRow>;

function loadBucket(): CacheBucket {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as CacheBucket;
  } catch {
    return {};
  }
}

function saveBucket(bucket: CacheBucket) {
  if (typeof window === "undefined") return;
  const entries = Object.entries(bucket).sort((a, b) => (b[1].ts ?? 0) - (a[1].ts ?? 0)).slice(0, MAX_ENTRIES);
  const next = Object.fromEntries(entries);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

function getCachedDictionaryEntry(normalizedKey: string): unknown | null {
  if (!normalizedKey) return null;
  const bucket = loadBucket();
  const row = bucket[normalizedKey];
  if (!row || !row.entry) return null;
  if (typeof row.ts !== "number" || Date.now() - row.ts > TTL_MS) {
    delete bucket[normalizedKey];
    saveBucket(bucket);
    return null;
  }
  return row.entry;
}

function setCachedDictionaryEntry(normalizedKey: string, entry: unknown) {
  if (!normalizedKey || !entry) return;
  const bucket = loadBucket();
  bucket[normalizedKey] = { entry, ts: Date.now() };
  saveBucket(bucket);
}
