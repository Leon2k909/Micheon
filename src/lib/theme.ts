import { syncLocalStorageItem } from "./profileStorage";

const KEY = "gl-theme";
const PRESET_KEY = "gl-theme-preset";

export const THEME_PREFERENCES_EVENT = "micheon:theme-preferences";

export type Theme = "dark" | "light";
export type ThemePreset = "default" | "butter" | "butter-purple" | "lingo";

/** Every preset the app knows. Anything else stored falls back to "default". */
const PRESETS: ThemePreset[] = ["default", "butter", "butter-purple", "lingo"];

export type ThemePreferences = {
  theme: Theme;
  preset: ThemePreset;
};

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export function getThemePreset(): ThemePreset {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(PRESET_KEY);
  // Checked against the list rather than a chain of comparisons, so adding a
  // preset cannot be half-done: the old form silently ignored any new name and
  // sent the learner back to the default on every reload.
  return PRESETS.includes(stored as ThemePreset) ? (stored as ThemePreset) : "default";
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

export function applyThemePresetToDom(preset: ThemePreset) {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme-preset", preset);
    if (preset === "default") {
      document.documentElement.removeAttribute("data-astryx-theme");
    }
  }
}

function emitThemePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ThemePreferences>(THEME_PREFERENCES_EVENT, {
      detail: {
        theme: getTheme(),
        preset: getThemePreset(),
      },
    })
  );
}

/**
 * Follow a theme change made in ANOTHER window.
 *
 * The desktop pet lives in its own BrowserWindow, running the same app. It read
 * the theme once at boot and never again, so changing theme in the main window
 * left the speech bubble painted in the old one — most visibly when the two
 * themes disagree about what a surface is, which is exactly what a new preset
 * does. localStorage is shared between the windows and fires a storage event in
 * the ones that did not write it, which is the same mechanism the pet's own
 * settings already use.
 */
export function watchStoredThemePreferences(): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === PRESET_KEY) applyStoredThemePreferences();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

/** Repaint and announce the stored pair after shared-profile hydration. */
export function applyStoredThemePreferences() {
  const theme = getTheme();
  const preset = getThemePreset();
  applyThemeToDom(theme);
  applyThemePresetToDom(preset);
  emitThemePreferences();
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
    emitThemePreferences();
  }
}

export function setThemePreset(preset: ThemePreset) {
  applyThemePresetToDom(preset);
  if (typeof window !== "undefined") {
    localStorage.setItem(PRESET_KEY, preset);
    syncLocalStorageItem(PRESET_KEY, preset);
    emitThemePreferences();
  }
}
