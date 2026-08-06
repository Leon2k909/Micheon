import { useEffect, type RefObject } from "react";

/** Movement below this is a click, above it is a drag. */
const DRAG_THRESHOLD_PX = 5;

/**
 * Hold left click and pull to scroll, the way the old build did.
 *
 * A scrollbar on a 240px sidebar is a small target and a wheel is not always
 * to hand — grabbing the panel and pulling is the gesture people already
 * expect from a desktop app. The whole difficulty is not breaking the clicks:
 * the pointer only takes over once it has moved far enough to be a drag, and
 * the click that ends a real drag is swallowed so pulling past Games does not
 * navigate to Games.
 *
 * Left button only (right-click opens menus, middle-click is autoscroll), and
 * it stays out of the way of anything that scrolls or drags on its own —
 * inputs, the resizer, a text selection.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let startY = 0;
    let startScroll = 0;
    let pointerId: number | null = null;
    let dragging = false;
    let justDragged = false;

    const isExempt = (target: EventTarget | null) =>
      target instanceof Element
      && Boolean(target.closest("input, textarea, select, [contenteditable='true'], .np-sidebar-resizer, [data-no-drag-scroll]"));

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || isExempt(event.target)) return;
      if (el.scrollHeight <= el.clientHeight) return; // nothing to scroll
      justDragged = false;
      pointerId = event.pointerId;
      startY = event.clientY;
      startScroll = el.scrollTop;
      dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const travelled = startY - event.clientY;
      if (!dragging) {
        if (Math.abs(travelled) < DRAG_THRESHOLD_PX) return;
        dragging = true;
        el.setPointerCapture(event.pointerId);
        el.classList.add("is-drag-scrolling");
      }
      el.scrollTop = startScroll + travelled;
      // Stops the drag turning into a text selection halfway down the list.
      event.preventDefault();
    };

    const end = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      if (dragging) {
        el.classList.remove("is-drag-scrolling");
        if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
        // A flag rather than a one-shot listener: a listener armed here has no
        // reliable moment to disarm if the click never comes, and would then
        // eat a real click later. This is cleared by the click it suppresses,
        // or by the next press, whichever happens first.
        justDragged = true;
      }
      pointerId = null;
      dragging = false;
    };

    // Capture phase, so the drag is cancelled before the button beneath it
    // ever sees the click.
    const onClickCapture = (click: MouseEvent) => {
      if (!justDragged) return;
      justDragged = false;
      click.stopPropagation();
      click.preventDefault();
    };

    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    return () => {
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
  }, [ref, enabled]);
}
