/**
 * Dragging a destination between the sidebar and More.
 *
 * Hiding a nav entry was already a preference with a cross on each row and a
 * restore list underneath. This is the direct version: a row drags out of the
 * sidebar and back again. Same
 * preference underneath — this only gives it a handle.
 *
 * A private MIME type rather than text/plain, because a drop target has to
 * decide whether to accept BEFORE the drop, and dragover is only allowed to
 * read the type list, never the data. Text dragged in from anywhere else —
 * a word from a lesson, a link from a browser — carries text/plain and must
 * not move somebody's navigation around.
 *
 * Where the drag STARTED is carried the same way, as a second type, for the
 * same reason: only the type list is readable in flight. Without it the two
 * zones cannot tell a put-away from a bring-back, and since dragover bubbles
 * from the More row up to the sidebar that contains it, both would light up
 * at once and the last one to fire would win. With it, each zone accepts
 * exactly the direction it means: the sidebar takes things coming out of
 * More, and More takes things coming out of the sidebar.
 */
export const NAV_DRAG_TYPE = "application/x-micheon-nav";

export type NavDragOrigin = "sidebar" | "more";

const ORIGIN_TYPE: Record<NavDragOrigin, string> = {
  sidebar: "application/x-micheon-nav-from-sidebar",
  more: "application/x-micheon-nav-from-more",
};

export function startNavDrag(
  transfer: DataTransfer | null,
  id: string,
  origin: NavDragOrigin
): void {
  if (!transfer) return;
  transfer.setData(NAV_DRAG_TYPE, id);
  // The value is unused — the presence of the type is the whole message,
  // because presence is all dragover can see.
  transfer.setData(ORIGIN_TYPE[origin], id);
  // Firefox refuses to start a drag at all unless text/plain is set too.
  transfer.setData("text/plain", id);
  transfer.effectAllowed = "move";
}

/**
 * Is this drag one of ours, and did it come from where this zone expects?
 * The only question dragover is allowed to ask.
 */
export function isNavDrag(transfer: DataTransfer | null, from?: NavDragOrigin): boolean {
  if (!transfer) return false;
  const types = Array.from(transfer.types ?? []);
  if (!types.includes(NAV_DRAG_TYPE)) return false;
  return from ? types.includes(ORIGIN_TYPE[from]) : true;
}

/** The destination being dragged, read on drop. */
export function readNavDrag(transfer: DataTransfer | null, from?: NavDragOrigin): string | null {
  if (!isNavDrag(transfer, from)) return null;
  const id = transfer?.getData(NAV_DRAG_TYPE)?.trim();
  return id ? id : null;
}
