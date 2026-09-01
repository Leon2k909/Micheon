/**
 * Bring something into view that is not on the page yet.
 *
 * Search can send someone to a unit halfway down the path, but the path is
 * loaded lazily: at the moment the result is chosen, the element to scroll to
 * does not exist, and a scrollIntoView fired there does nothing at all — no
 * error, no movement, just a page that stayed where it was and a learner who
 * has to find the unit themselves.
 *
 * So it waits, frame by frame, and gives up rather than waiting for ever: a
 * target that never appears means the view failed to load or the id was
 * wrong, and neither is improved by a callback still running a minute later.
 */
type ScrollToAnchorOptions = {
  /** Frames to keep looking. Roughly a second at 60fps, which covers a lazy chunk. */
  attempts?: number;
  /** Injectable for the gate, which has neither a document nor a screen. */
  doc?: Pick<Document, "getElementById">;
  frame?: (callback: () => void) => unknown;
  behavior?: ScrollBehavior;
};

export function scrollToAnchorWhenReady(id: string, options: ScrollToAnchorOptions = {}): void {
  const {
    attempts = 60,
    doc = typeof document === "undefined" ? null : document,
    frame = typeof requestAnimationFrame === "undefined"
      ? (callback: () => void) => setTimeout(callback, 16)
      : requestAnimationFrame,
    behavior = "smooth",
  } = options;
  if (!doc || !id) return;
  let left = Math.max(1, attempts);
  const tick = () => {
    const target = doc.getElementById(id) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior, block: "start" });
      return;
    }
    left -= 1;
    if (left > 0) frame(tick);
  };
  frame(tick);
}

/** The id a unit's card carries, in one place so both ends agree. */
export function duoUnitAnchorId(unitNumber: number): string {
  return `duo-unit-${unitNumber}`;
}
