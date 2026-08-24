/**
 * Where the word panel opens, given where the word is.
 *
 * Its own module so the gate can run this arithmetic rather than restate it.
 * A check that carries its own copy of the rule passes while the component
 * uses a different one — which is exactly what happened when this lived
 * inside the component: breaking the flip left the check green.
 */

/**
 * Roughly how tall the panel is: the word, its meaning, sometimes a note, and
 * the button row. Measuring the real thing would mean rendering it in the
 * wrong place first and then moving it, which is a visible jump. An estimate
 * that errs high only opens downward slightly sooner than it had to.
 */
export const POPOVER_HEIGHT = 132;
export const POPOVER_WIDTH = 190;
/** How close to the window's edge the panel is allowed to come. */
export const POPOVER_EDGE = 10;

export type PopoverPlace = {
  /** Open downward, because there is not room above. */
  below: boolean;
  /** How far sideways to move it so it stays inside the window. */
  shift: number;
};

export type PopoverAnchor = { top: number; left: number; width: number };

/**
 * Upward unless the word is too near the top for the panel to fit, which
 * keeps it clear of the sentence wherever it can. Listen puts its sentence
 * near the top of the window, so always-upward hid the word and its meaning
 * behind the header and left two buttons with nothing explaining them.
 *
 * Sideways is the same fault at the ends of a line: the panel is centred on
 * its word, so a word near an edge centred 190px of panel half outside the
 * window. It is pushed back inside whichever edge it crossed.
 */
export function placeWordPopover(anchor: PopoverAnchor, viewWidth: number): PopoverPlace {
  const below = anchor.top < POPOVER_HEIGHT + POPOVER_EDGE;
  const centre = anchor.left + anchor.width / 2;
  const half = POPOVER_WIDTH / 2;
  let shift = 0;
  if (centre - half < POPOVER_EDGE) {
    shift = POPOVER_EDGE - (centre - half);
  } else if (viewWidth && centre + half > viewWidth - POPOVER_EDGE) {
    shift = (viewWidth - POPOVER_EDGE) - (centre + half);
  }
  return { below, shift: Math.round(shift) };
}
