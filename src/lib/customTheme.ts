import { syncLocalStorageItem } from "@/lib/profileStorage";

// User-defined appearance overrides. Stored as JSON under a "gl-" key so it
// syncs through the shared store and follows the account across browsers on
// this machine. Values are applied as inline CSS variables on <html>, which
// outranks both [data-theme] blocks — so custom colours sit on top of the
// light/dark base theme, and anything not overridden keeps following the
// theme toggle.
const KEY = "gl-custom-theme";
export const CUSTOM_THEME_CHANGE_EVENT = "micheon:custom-theme";

export type CustomTheme = Record<string, string>;

/** The variables exposed in the Appearance editor, with friendly labels. */
export const THEME_COLOR_SLOTS: { cssVar: string; label: string }[] = [
  { cssVar: "--bg", label: "Background" },
  { cssVar: "--surface", label: "Cards" },
  { cssVar: "--surface-2", label: "Panels" },
  { cssVar: "--accent", label: "Accent" },
  { cssVar: "--accent-hover", label: "Accent hover" },
  { cssVar: "--yellow", label: "Progress bars" },
  { cssVar: "--text-1", label: "Main text" },
  { cssVar: "--text-3", label: "Muted text" },
];

/** Gradient stops for the hero/CTA gradient (--feature-gradient). */
export const GRADIENT_SLOTS: { key: string; label: string; fallback: string }[] = [
  { key: "gradFrom", label: "Gradient start", fallback: "#7834f7" },
  { key: "gradVia", label: "Gradient middle", fallback: "#8b4cff" },
  { key: "gradTo", label: "Gradient end", fallback: "#6b2ee6" },
];

export function getCustomTheme(): CustomTheme {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const ALL_VARS = [...THEME_COLOR_SLOTS.map((s) => s.cssVar), "--feature-gradient"];

/** Paint the stored overrides onto <html>. Safe to call on every boot/hydrate. */
export function applyCustomTheme(t: CustomTheme = getCustomTheme()) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const v of ALL_VARS) root.style.removeProperty(v);
  for (const [k, v] of Object.entries(t)) {
    if (k.startsWith("--") && v) root.style.setProperty(k, v);
  }
  if (t.gradFrom || t.gradVia || t.gradTo) {
    const from = t.gradFrom || GRADIENT_SLOTS[0].fallback;
    const via = t.gradVia || t.gradFrom || GRADIENT_SLOTS[1].fallback;
    const to = t.gradTo || GRADIENT_SLOTS[2].fallback;
    root.style.setProperty("--feature-gradient", `linear-gradient(135deg, ${from} 0%, ${via} 52%, ${to} 100%)`);
  }
}

/** Save one override (or several) and repaint + sync. */
export function setCustomTheme(patch: CustomTheme) {
  const next = { ...getCustomTheme(), ...patch };
  for (const k of Object.keys(next)) if (!next[k]) delete next[k];
  const raw = JSON.stringify(next);
  try { localStorage.setItem(KEY, raw); } catch { /* ignore */ }
  syncLocalStorageItem(KEY, raw);
  applyCustomTheme(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CUSTOM_THEME_CHANGE_EVENT));
  }
  return next;
}

/** Back to the selected preset (light/dark mode untouched). */
export function resetCustomTheme() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  syncLocalStorageItem(KEY, null);
  applyCustomTheme({});
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CUSTOM_THEME_CHANGE_EVENT));
  }
}

/** The value a picker should show: the override if set, else the theme's value. */
export function effectiveColor(cssVar: string, overrides: CustomTheme): string {
  if (overrides[cssVar]) return overrides[cssVar];
  if (typeof window === "undefined") return "#000000";
  const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return v.startsWith("#") ? v : "#000000";
}
