const KEY = "gl-effects";

export type Effects = "full" | "lite";

export function getEffects(): Effects {
  if (typeof window === "undefined") return "full";
  return localStorage.getItem(KEY) === "lite" ? "lite" : "full";
}

/** Apply the effects preference as a `data-fx` attribute the CSS keys off. */
export function applyEffects(mode: Effects) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-fx", mode);
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, mode);
  }
}

/** True when heavy/continuous motion should be skipped (manual "lite" or OS reduced-motion). */
export function effectsReduced(): boolean {
  if (typeof window === "undefined") return false;
  if (getEffects() === "lite") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
