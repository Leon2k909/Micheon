import { syncLocalStorageItem } from "./profileStorage";

const KEY = "gl-theme";
const LIGHT_DEFAULT_MIGRATION_KEY = "micheon-light-default-v1";

export type Theme = "dark" | "light";

/**
 * What the learner CHOSE, which is not always what is on screen: "system"
 * resolves against the OS setting and follows it while the app is open.
 */
export type ThemePreference = Theme | "system";

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

export function systemTheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? "dark" : "light";
}

export function getThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "light";
}

export function resolveTheme(preference: ThemePreference = getThemePreference()): Theme {
  return preference === "system" ? systemTheme() : preference;
}

/** The theme actually on screen. Callers that only paint want this one. */
export function getTheme(): Theme {
  return resolveTheme();
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
  applyThemeToDom(resolveTheme());
}

/**
 * The user picked a theme: paint it, persist it locally, and push it to the
 * shared store so it survives restarts and follows them across browsers/tools
 * on this machine. Only call this from an explicit user action, never on boot.
 */
export function setTheme(preference: ThemePreference) {
  const resolved = resolveTheme(preference);
  applyThemeToDom(resolved);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, preference);
    // "gl-theme" matches the "gl-" sync prefix, so this keeps the shared store
    // authoritative; the next boot's hydrate reads it back instead of reverting.
    syncLocalStorageItem(KEY, preference);
    // The native window paints before any of this runs, so the choice is also
    // handed to the main process for the NEXT launch's backgroundColor.
    // Without it a dark-mode learner gets a white flash on every start.
    try {
      (window as any).germDesktop?.setDesktopTheme?.(resolved);
    } catch {
      /* browser build, or an older desktop shell: nothing to tell */
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }
}

export const THEME_CHANGE_EVENT = "gl-theme-changed";

/**
 * Follow the OS while the preference is "system".
 *
 * Returns a cleanup function. Re-reads the preference on every change rather
 * than capturing it, so switching to Light or Dark stops the following without
 * needing the listener to be torn down and rebuilt.
 */
export function watchSystemTheme(): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(SYSTEM_DARK_QUERY);
  const onChange = () => {
    if (getThemePreference() !== "system") return;
    applyThemeToDom(systemTheme());
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
