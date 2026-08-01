import { syncLocalStorageItem } from "./profileStorage";

const KEY = "gl-theme";
const LIGHT_DEFAULT_MIGRATION_KEY = "micheon-light-default-v1";

export type Theme = "dark" | "light";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(KEY);
  return stored === "light" || stored === "dark" ? stored : "light";
}

/**
 * Promote the finished light shell for existing installs once. Older Micheon
 * builds persisted dark mode while the new dashboard was still a beta, so
 * simply changing the fallback would leave those users in a partly themed UI.
 * The marker deliberately is not part of the synced `gl-` namespace: each
 * browser/app installation performs this migration after hydrating its shared
 * profile, then the new light preference becomes the synced source of truth.
 */
export function migrateToLightThemeDefault() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(LIGHT_DEFAULT_MIGRATION_KEY) === "1") return;
  localStorage.setItem(KEY, "light");
  localStorage.setItem(LIGHT_DEFAULT_MIGRATION_KEY, "1");
  syncLocalStorageItem(KEY, "light");
}

/**
 * Paint the theme onto the document. Safe to call on every boot / after
 * hydration — it only sets the attribute and does NOT write storage or sync,
 * so it can't clobber a value the shared store is about to provide.
 */
export function applyThemeToDom(theme: Theme) {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

/**
 * Follow a theme change made in ANOTHER window.
 *
 * The desktop pet lives in its own BrowserWindow, running the same app. It read
 * the theme once at boot and never again, so changing theme in the main window
 * left the speech bubble in the old light/dark mode. localStorage is shared
 * between the windows and fires a storage event in the ones that did not write
 * it, which is the same mechanism the pet's own settings already use.
 */
export function watchStoredThemePreferences(): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) applyStoredThemePreferences();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

/** Repaint the stored mode after shared-profile hydration. */
export function applyStoredThemePreferences() {
  applyThemeToDom(getTheme());
}

/**
 * The user picked a theme: paint it, persist it locally, and push it to the
 * shared store so it survives restarts and follows them across browsers/tools
 * on this machine. Only call this from an explicit user action, never on boot.
 */
export function setTheme(theme: Theme) {
  applyThemeToDom(theme);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, theme);
    // "gl-theme" matches the "gl-" sync prefix, so this keeps the shared store
    // authoritative; the next boot's hydrate reads it back instead of reverting.
    syncLocalStorageItem(KEY, theme);
  }
}
