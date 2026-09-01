/**
 * Dragging a study set — into a folder, out of one, or up and down its list.
 *
 * The same technique as navDrag: a private MIME type, because a drop target
 * has to decide whether to accept BEFORE the drop, and dragover is only
 * allowed to read the type list, never the data. Text dragged in from
 * anywhere else carries text/plain and must not re-file somebody's sets.
 *
 * A separate file rather than a `kind` argument added to navDrag, which would
 * have meant editing the two live call sites behind the sidebar's shipped
 * hide-and-restore feature to save writing these few lines. The saving is not
 * worth putting a working feature back in play; nothing here imports from
 * navDrag or changes it, so a mistake in this file can only break the Create
 * tab.
 *
 * Where the drag started is carried as a second type for navDrag's reason: a
 * folder's body sits inside the list that the top-level rows also drop onto,
 * so dragover bubbles through both. Naming the origin lets each zone accept
 * only the direction it means, instead of the innermost and outermost target
 * lighting up together and the last to fire winning.
 */
export const SET_DRAG_TYPE = "application/x-micheon-study-set";

/** Which list the row was picked up from. */
type SetDragOrigin = "folder" | "unfiled";

const ORIGIN_TYPE: Record<SetDragOrigin, string> = {
  folder: "application/x-micheon-study-set-from-folder",
  unfiled: "application/x-micheon-study-set-from-unfiled",
};

export function startSetDrag(
  transfer: DataTransfer | null,
  id: string,
  origin: SetDragOrigin
): void {
  if (!transfer) return;
  transfer.setData(SET_DRAG_TYPE, id);
  // The value is unread — the presence of the type is the whole message,
  // because presence is all dragover can see.
  transfer.setData(ORIGIN_TYPE[origin], id);
  // Firefox refuses to start a drag at all unless text/plain is set too.
  transfer.setData("text/plain", id);
  transfer.effectAllowed = "move";
}

/** Is this drag one of ours? The only question dragover is allowed to ask. */
export function isSetDrag(transfer: DataTransfer | null, from?: SetDragOrigin): boolean {
  if (!transfer) return false;
  const types = Array.from(transfer.types ?? []);
  if (!types.includes(SET_DRAG_TYPE)) return false;
  return from ? types.includes(ORIGIN_TYPE[from]) : true;
}

/** The set being dragged, read on drop. */
export function readSetDrag(transfer: DataTransfer | null, from?: SetDragOrigin): string | null {
  if (!isSetDrag(transfer, from)) return null;
  const id = transfer?.getData(SET_DRAG_TYPE);
  return id || null;
}
