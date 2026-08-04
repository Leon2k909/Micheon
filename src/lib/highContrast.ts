const KEY = "gl-high-contrast-v1";

export const HIGH_CONTRAST_EVENT = "gl:high-contrast-change";

export function getHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Apply and persist the preference as a `data-contrast` attribute the CSS
 * keys off — the same shape as the theme's `data-theme` and the effects
 * toggle's `data-fx`, so every themed surface can opt in with one selector.
 */
export function applyHighContrast(on: boolean) {
  if (typeof document !== "undefined") {
    if (on) document.documentElement.setAttribute("data-contrast", "high");
    else document.documentElement.removeAttribute("data-contrast");
  }
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch { /* storage unavailable — the attribute still applies this session */ }
  window.dispatchEvent(new Event(HIGH_CONTRAST_EVENT));
}
