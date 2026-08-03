// The main window's zoom ladder. Pure data and maths so the build gate can
// exercise it directly, the same way desktop-settings.cjs is tested.
//
// Chromium's own zoom is per-origin and unbounded in either direction; the
// mascot overlay shares the main window's origin and its geometry only holds
// at zoom 1 (see pinPetOverlayZoom in main.js). Keeping every zoom change on
// this fixed ladder — and clamping anything restored from disk — means the
// app can offer zoom as a feature while each change stays a known, repairable
// quantity instead of a fractional level persisted forever.
const ZOOM_STEPS = Object.freeze([0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2]);
const ZOOM_MIN = ZOOM_STEPS[0];
const ZOOM_MAX = ZOOM_STEPS[ZOOM_STEPS.length - 1];

function clampZoomFactor(value) {
  const factor = Number(value);
  if (!Number.isFinite(factor)) return 1;
  return Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, factor)) * 100) / 100;
}

/**
 * The next ladder rung from `current` in `direction` (+1 in, -1 out).
 * A factor between rungs — a legacy fractional level from a trackpad pinch —
 * moves to the nearest rung strictly in the requested direction, so the first
 * keypress already lands back on the ladder.
 */
function nextZoomStep(current, direction) {
  const factor = clampZoomFactor(current);
  if (direction > 0) {
    for (const step of ZOOM_STEPS) {
      if (step > factor + 0.001) return step;
    }
    return ZOOM_MAX;
  }
  for (let i = ZOOM_STEPS.length - 1; i >= 0; i -= 1) {
    if (ZOOM_STEPS[i] < factor - 0.001) return ZOOM_STEPS[i];
  }
  return ZOOM_MIN;
}

module.exports = { ZOOM_STEPS, ZOOM_MIN, ZOOM_MAX, clampZoomFactor, nextZoomStep };
