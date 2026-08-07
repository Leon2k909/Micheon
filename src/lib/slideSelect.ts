import { useEffect, type RefObject } from "react";

/** Below this, a press is a plain click on the button you pressed. */
const SLIDE_THRESHOLD_PX = 4;

/**
 * Press a button, keep the mouse down, slide to another, release to pick it.
 *
 * The gesture the old build had on its top nav: you do not have to let go and
 * click again to change your mind — you hold, run down the list, and whatever
 * you are over when you release is what opens. Every item highlights as the
 * pointer passes it, so the list behaves like one control rather than several.
 *
 * A press that never travels is left completely alone, so an ordinary click is
 * still an ordinary click: the browser fires it, not this. Only a real slide
 * takes over, and then the natural click is suppressed so the item you started
 * on cannot open behind the one you chose.
 */
export function useSlideSelect(
  ref: RefObject<HTMLElement | null>,
  itemSelector: string,
  enabled = true,
) {
  useEffect(() => {
    const container = ref.current;
    if (!container || !enabled) return;

    let pointerId: number | null = null;
    let startItem: Element | null = null;
    let startY = 0;
    let sliding = false;
    let hovered: Element | null = null;
    let suppressNextClick = false;

    const itemAt = (x: number, y: number): Element | null => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const item = el.closest(itemSelector);
      return item && container.contains(item) ? item : null;
    };

    const highlight = (item: Element | null) => {
      if (hovered === item) return;
      hovered?.classList.remove("is-slide-target");
      item?.classList.add("is-slide-target");
      hovered = item;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const item = itemAt(event.clientX, event.clientY);
      if (!item) return;
      pointerId = event.pointerId;
      startItem = item;
      startY = event.clientY;
      sliding = false;
      suppressNextClick = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId || !startItem) return;
      if (!sliding) {
        if (Math.abs(event.clientY - startY) < SLIDE_THRESHOLD_PX) return;
        sliding = true;
        container.classList.add("is-slide-selecting");
        // Captured so the gesture survives the pointer crossing gaps between
        // buttons, and so a release outside still reaches us to clean up.
        try { container.setPointerCapture(event.pointerId); } catch { /* not capturable */ }
      }
      highlight(itemAt(event.clientX, event.clientY));
      event.preventDefault();
    };

    const finish = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const landedOn = sliding ? itemAt(event.clientX, event.clientY) : null;
      if (sliding) {
        container.classList.remove("is-slide-selecting");
        if (container.hasPointerCapture(event.pointerId)) {
          container.releasePointerCapture(event.pointerId);
        }
        // Order matters: activate FIRST, then arm the suppressor. Arming it
        // before the click meant the handler swallowed the very click it was
        // meant to let through, and the slide silently did nothing.
        const target = landedOn ?? startItem;
        if (target instanceof HTMLElement) target.click();
        // Now swallow the browser's own click, so the button we pressed on
        // cannot open behind the one we released over.
        suppressNextClick = true;
      }
      highlight(null);
      pointerId = null;
      startItem = null;
      sliding = false;
    };

    const onClickCapture = (click: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      click.stopPropagation();
      click.preventDefault();
    };

    container.addEventListener("click", onClickCapture, true);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", finish);
    container.addEventListener("pointercancel", finish);
    return () => {
      highlight(null);
      container.classList.remove("is-slide-selecting");
      container.removeEventListener("click", onClickCapture, true);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", finish);
      container.removeEventListener("pointercancel", finish);
    };
  }, [ref, itemSelector, enabled]);
}
