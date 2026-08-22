import { useEffect } from "react";

/**
 * Stop the page behind a full-screen overlay from scrolling.
 *
 * The course reader and the lesson session are `fixed inset-0` overlays, but
 * the shell underneath keeps its own scrollbar — so the window shows TWO
 * scrollbars side by side on the right, and the wheel sometimes moves the
 * wrong one. There should be one scrollbar on the right, not two.
 *
 * Counted rather than a plain on/off flag. A session can be opened from
 * inside the reader, so two overlays are live at once; with a boolean, closing
 * the inner one would unlock the page while the outer one is still covering
 * it. The lock lifts when the last overlay goes.
 *
 * The scrollbar's width is compensated with padding, otherwise removing it
 * shifts the whole layout sideways by ~15px at the moment the overlay opens.
 */

let depth = 0;
let restore: (() => void) | null = null;

function lock() {
  depth += 1;
  if (depth > 1 || typeof document === "undefined") return;

  const { body, documentElement } = document;
  const previousOverflow = body.style.overflow;
  const previousPadding = body.style.paddingRight;
  const scrollbar = window.innerWidth - documentElement.clientWidth;

  body.style.overflow = "hidden";
  if (scrollbar > 0) {
    const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbar}px`;
  }

  restore = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPadding;
  };
}

function unlock() {
  depth = Math.max(0, depth - 1);
  if (depth > 0) return;
  restore?.();
  restore = null;
}

/** Hold the page still for as long as this component is mounted. */
export function useScrollLock() {
  useEffect(() => {
    lock();
    return unlock;
  }, []);
}
