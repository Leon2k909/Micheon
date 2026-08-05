const KEY = "gl-effects";

/** Fired whenever the effects level changes, so the motion gate can follow. */
export const EFFECTS_CHANGE_EVENT = "gl-effects-change";

export type Effects = "full" | "lite";

interface DeviceHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
}

/**
 * Should this machine start with the heavy effects turned off?
 *
 * The glows and continuous animations are lovely on a desktop and miserable on
 * an old laptop — and someone on an old laptop is exactly the person least
 * likely to go hunting through settings for the switch. So the default comes
 * from what the browser will say about the device rather than being "full"
 * for everybody.
 *
 * This only ever picks the DEFAULT. Once the learner touches the toggle their
 * choice is stored and wins from then on, including "full" on a slow machine.
 */
export function prefersReducedEffects(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & DeviceHints;
  // Someone who asked the OS for less motion has already answered this.
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  if (nav.connection?.saveData) return true;

  const memory = nav.deviceMemory;
  if (typeof memory === "number" && memory > 0) return memory <= 4;

  // No memory hint (Firefox, Safari): fall back to core count, and only call
  // it slow at two or fewer so ordinary laptops keep their effects.
  const cores = nav.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0) return cores <= 2;

  return false;
}

/** The stored choice, or the device-appropriate default when there isn't one. */
export function getEffects(): Effects {
  if (typeof window === "undefined") return "full";
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    // Storage blocked — fall through to the device default.
  }
  if (stored === "lite" || stored === "full") return stored;
  return prefersReducedEffects() ? "lite" : "full";
}

/** True once the learner has chosen for themselves. */
export function hasEffectsChoice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "lite" || stored === "full";
  } catch {
    return false;
  }
}

/**
 * Paint the effects preference as a `data-fx` attribute the CSS keys off.
 *
 * `persist` is off by default so applying the resolved value at start-up
 * cannot quietly write the default into storage. Writing it would freeze
 * whatever the default happened to be on first launch and stop the device
 * check ever being consulted again.
 */
export function applyEffects(mode: Effects, persist = false) {
  const changed = typeof document !== "undefined"
    && document.documentElement.getAttribute("data-fx") !== mode;
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-fx", mode);
  }
  if (changed && typeof window !== "undefined") {
    window.dispatchEvent(new Event(EFFECTS_CHANGE_EVENT));
  }
  if (persist && typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      // The attribute still applies for this session.
    }
  }
}

/** The learner picking for themselves: apply it and remember it. */
export function setEffects(mode: Effects) {
  applyEffects(mode, true);
}

/** True when heavy/continuous motion should be skipped (manual "lite" or OS reduced-motion). */
export function effectsReduced(): boolean {
  if (typeof window === "undefined") return false;
  if (getEffects() === "lite") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
