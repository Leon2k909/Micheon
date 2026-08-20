/**
 * Installing only the content you actually want.
 *
 * WHY THIS EXISTS. Every learner downloads all 21,366 entries as one 3.9 MB
 * JavaScript chunk — a beginner on lesson three gets the B2 packs, and the
 * moment a second language becomes a course everybody gets that too. Split
 * into packs the same content is 0.60 MB for A1 and 40 KB for a language.
 *
 * WHY IT IS THE SAME CODE ON WEB AND DESKTOP. Electron does not load this app
 * from file:// — main.js does `loadURL("http://localhost:PORT")` and
 * server/index.js serves dist with express.static. So a relative fetch of
 * "content/level/a1.json" resolves the same way in both, the renderer is
 * Chromium in both, and the Cache API is there in both. There is no desktop
 * branch in this file and there should never need to be one.
 *
 * WHY NOT SQLITE. catalogue.db already exists and is the right tool for
 * SEARCH. It is the wrong one for delivery: on the web it means shipping a
 * WASM engine and downloading all 13 MB before the first query, which is
 * worse than the bundle we are trying to replace. These are cached by URL,
 * survive offline, and need no engine.
 *
 * NOTHING BREAKS IF THIS FAILS. Every call degrades to the network, and the
 * network degrades to the content already bundled in the app. A learner with
 * no packs installed and no connection still has the course they had before.
 */

export type ContentLevelPack = {
  id: string;
  url: string;
  parts: number;
  entries: number;
  bytes: number;
};

export type ContentLanguagePack = {
  id: string;
  name: string;
  url: string;
  entries: number;
  bytes: number;
};

export type ContentManifest = {
  version: number;
  levels: ContentLevelPack[];
  languages: ContentLanguagePack[];
};

/**
 * The cache name carries the manifest version.
 *
 * A pack cached under an older shape is not upgraded in place — the old cache
 * is dropped whole. Half-understanding a pack is worse than fetching it
 * again, and re-fetching costs one download.
 */
const CACHE_PREFIX = "micheon-content-v";
const MANIFEST_URL = "content/manifest.json";

let manifestPromise: Promise<ContentManifest | null> | null = null;

function cachesAvailable(): boolean {
  return typeof caches !== "undefined" && typeof window !== "undefined" && Boolean(window.isSecureContext ?? true);
}

async function openCache(version: number): Promise<Cache | null> {
  if (!cachesAvailable()) return null;
  try {
    const name = `${CACHE_PREFIX}${version}`;
    // Drop every cache from an older shape before opening the current one.
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((entry) => entry.startsWith(CACHE_PREFIX) && entry !== name)
        .map((entry) => caches.delete(entry))
    );
    return await caches.open(name);
  } catch {
    return null;
  }
}

export async function loadContentManifest(): Promise<ContentManifest | null> {
  if (!manifestPromise) {
    manifestPromise = (async () => {
      try {
        const response = await fetch(MANIFEST_URL, { cache: "no-cache" });
        if (!response.ok) return null;
        const value = (await response.json()) as ContentManifest;
        if (!value || typeof value.version !== "number" || !Array.isArray(value.levels)) return null;
        return value;
      } catch {
        // No manifest means the build did not emit packs, which is a valid
        // state: the app runs on its bundled content exactly as before.
        return null;
      }
    })();
  }
  return manifestPromise;
}

/** Which pack urls are already on this device. */
export async function installedPackUrls(): Promise<string[]> {
  const manifest = await loadContentManifest();
  if (!manifest) return [];
  const cache = await openCache(manifest.version);
  if (!cache) return [];
  const keys = await cache.keys();
  return keys.map((request) => new URL(request.url).pathname.replace(/^\//, ""));
}

export async function isPackInstalled(url: string): Promise<boolean> {
  const installed = await installedPackUrls();
  return installed.some((entry) => entry.endsWith(url));
}

/**
 * Download a pack and keep it.
 *
 * Returns false rather than throwing when the cache is unavailable — a
 * private window, or a browser with storage disabled. The pack still works
 * there, it is just fetched each time instead of kept.
 */
export async function installPack(url: string): Promise<boolean> {
  const manifest = await loadContentManifest();
  if (!manifest) return false;
  try {
    const response = await fetch(url, { cache: "reload" });
    if (!response.ok) return false;
    const cache = await openCache(manifest.version);
    if (!cache) return false;
    await cache.put(url, response.clone());
    return true;
  } catch {
    return false;
  }
}

export async function removePack(url: string): Promise<boolean> {
  const manifest = await loadContentManifest();
  if (!manifest) return false;
  const cache = await openCache(manifest.version);
  if (!cache) return false;
  try {
    return await cache.delete(url);
  } catch {
    return false;
  }
}

/**
 * Read a pack: cache first, then the network.
 *
 * Cache first rather than network first because these are immutable for a
 * given manifest version — a new build changes the version and the old cache
 * is dropped, so there is nothing stale to serve.
 */
export async function readPack<T>(url: string): Promise<T | null> {
  const manifest = await loadContentManifest();
  if (manifest) {
    const cache = await openCache(manifest.version);
    if (cache) {
      try {
        const hit = await cache.match(url);
        if (hit) return (await hit.json()) as T;
      } catch {
        // Fall through to the network.
      }
    }
  }
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/** Total bytes of everything installed, for the settings screen. */
export async function installedBytes(): Promise<number> {
  const manifest = await loadContentManifest();
  if (!manifest) return 0;
  const installed = await installedPackUrls();
  const all = [...manifest.levels, ...manifest.languages];
  return all
    .filter((pack) => installed.some((entry) => entry.endsWith(pack.url)))
    .reduce((sum, pack) => sum + pack.bytes, 0);
}

/** Everything on offer, level packs and language packs together. */
export async function availablePacks(): Promise<{
  levels: ContentLevelPack[];
  languages: ContentLanguagePack[];
  installed: string[];
}> {
  const manifest = await loadContentManifest();
  if (!manifest) return { levels: [], languages: [], installed: [] };
  return {
    levels: manifest.levels,
    languages: manifest.languages,
    installed: await installedPackUrls(),
  };
}

/** Only for tests and for the settings screen's "clear downloads". */
export async function clearInstalledPacks(): Promise<void> {
  if (!cachesAvailable()) return;
  try {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX)).map((name) => caches.delete(name)));
  } catch {
    // Nothing to do — the caller's next read falls back to the network.
  }
}

/** Test seam: forget the cached manifest promise. */
export function resetContentManifestCache(): void {
  manifestPromise = null;
}
