import { syncLocalStorageItem } from "./profileStorage";

const KEY = "gl-theme";

export type Theme = "dark" | "light";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
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
