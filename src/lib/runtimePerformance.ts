import { applyEffects, getEffects, hasEffectsChoice } from "@/lib/effects";

/**
 * Notice when the app is actually running badly, and calm it down.
 *
 * Device hints only describe the hardware. They cannot see that a laptop is
 * currently sharing itself with a browser full of tabs, a game launcher and a
 * video call — which is the difference between a machine that copes and the
 * same machine that stutters. The web has no way to read the process list, but
 * it does not need to: if the app is dropping frames, that is the symptom the
 * learner is complaining about, whatever the cause.
 *
 * So this watches real frame pacing for a few seconds after start-up and, if
 * the picture is genuinely poor, switches the heavy effects off.
 *
 * Deliberately conservative:
 *  - it never overrides a choice the learner has made
 *  - it only ever reduces, never re-enables — a reduction that flickers back
 *    on at the first quiet second would be worse than either state
 *  - it samples once, then stops, so the watcher itself costs nothing after
 */
const SAMPLE_MS = 4000;
/** Longer than this and the frame visibly missed its slot (~30fps). */
const SLOW_FRAME_MS = 32;
/** Proportion of slow frames that means "this is not smooth". */
const SLOW_FRAME_SHARE = 0.28;

export interface FrameReport {
  frames: number;
  slowFrames: number;
  slowShare: number;
  struggling: boolean;
}

/** Pure decision, so the rule can be tested without a browser. */
export function readsAsStruggling(frames: number, slowFrames: number): boolean {
  // Too few frames to judge — a backgrounded tab, or a very short sample.
  if (frames < 40) return false;
  return slowFrames / frames >= SLOW_FRAME_SHARE;
}

/**
 * Watch frame pacing once, then turn the effects down if the app is stuttering.
 * Returns a cancel function; safe to call when no window exists.
 */
export function watchRuntimePerformance(onReduce?: (report: FrameReport) => void): () => void {
  if (typeof window === "undefined" || typeof requestAnimationFrame !== "function") {
    return () => {};
  }
  // Someone who has already chosen has nothing to gain from being watched.
  if (hasEffectsChoice() || getEffects() === "lite") return () => {};

  let cancelled = false;
  let handle = 0;
  let frames = 0;
  let slowFrames = 0;
  let last = performance.now();
  const started = last;

  const tick = (now: number) => {
    if (cancelled) return;
    const delta = now - last;
    last = now;
    // Ignore the first frame and any gap so large it means the tab was hidden
    // or the window was being dragged, which says nothing about capability.
    if (frames > 0 && delta < 1000) {
      frames += 1;
      if (delta > SLOW_FRAME_MS) slowFrames += 1;
    } else {
      frames += 1;
    }

    if (now - started < SAMPLE_MS) {
      handle = requestAnimationFrame(tick);
      return;
    }

    const struggling = readsAsStruggling(frames, slowFrames);
    if (struggling) {
      // Not persisted: this is the app adapting, not the learner deciding, so
      // a machine that is only busy today is back to normal tomorrow.
      applyEffects("lite");
      onReduce?.({ frames, slowFrames, slowShare: slowFrames / frames, struggling });
    }
  };

  handle = requestAnimationFrame(tick);
  return () => {
    cancelled = true;
    if (handle) cancelAnimationFrame(handle);
  };
}
