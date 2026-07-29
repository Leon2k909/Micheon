"use strict";

const DEFAULT_HISTORY_WIDTH = 636;
const DEFAULT_HISTORY_HEIGHT = 576;
const DEFAULT_MARGIN = 8;
const DEFAULT_GAP = 12;
const DEFAULT_MIN_WIDTH = 320;
const DEFAULT_MIN_HEIGHT = 240;

function finite(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function normalizeWorkArea(workArea) {
  return {
    x: Math.round(finite(workArea?.x, 0)),
    y: Math.round(finite(workArea?.y, 0)),
    width: Math.max(1, Math.round(finite(workArea?.width, 1))),
    height: Math.max(1, Math.round(finite(workArea?.height, 1))),
  };
}

function normalizeRect(rect, fallback = {}) {
  return {
    x: Math.round(finite(rect?.x, finite(fallback.x, 0))),
    y: Math.round(finite(rect?.y, finite(fallback.y, 0))),
    width: Math.max(1, Math.round(finite(rect?.width, finite(fallback.width, 1)))),
    height: Math.max(1, Math.round(finite(rect?.height, finite(fallback.height, 1)))),
  };
}

function innerWorkArea(workArea, margin = DEFAULT_MARGIN) {
  const area = normalizeWorkArea(workArea);
  const safeMargin = Math.max(0, Math.min(
    Math.round(finite(margin, DEFAULT_MARGIN)),
    Math.floor((area.width - 1) / 2),
    Math.floor((area.height - 1) / 2)
  ));
  return {
    x: area.x + safeMargin,
    y: area.y + safeMargin,
    width: Math.max(1, area.width - safeMargin * 2),
    height: Math.max(1, area.height - safeMargin * 2),
  };
}

function clampHistoryBounds(bounds, workArea, options = {}) {
  const inner = innerWorkArea(workArea, options.margin);
  const requested = normalizeRect(bounds, {
    x: inner.x,
    y: inner.y,
    width: options.width ?? DEFAULT_HISTORY_WIDTH,
    height: options.height ?? DEFAULT_HISTORY_HEIGHT,
  });
  const width = Math.min(requested.width, inner.width);
  const height = Math.min(requested.height, inner.height);
  return {
    x: clamp(requested.x, inner.x, inner.x + inner.width - width),
    y: clamp(requested.y, inner.y, inner.y + inner.height - height),
    width,
    height,
  };
}

/** True when two rectangles touch or overlap inside the requested breathing room. */
function rectanglesOverlap(first, second, gap = 0) {
  if (!first || !second) return false;
  const a = normalizeRect(first);
  const b = normalizeRect(second);
  const spacing = Math.max(0, finite(gap, 0));
  return a.x < b.x + b.width + spacing
    && a.x + a.width + spacing > b.x
    && a.y < b.y + b.height + spacing
    && a.y + a.height + spacing > b.y;
}

function fitCandidate(area, direction, requested, mascot) {
  if (area.width < 1 || area.height < 1) return null;
  const width = Math.min(requested.width, Math.floor(area.width));
  const height = Math.min(requested.height, Math.floor(area.height));
  if (width < 1 || height < 1) return null;

  const preferredX = Number.isFinite(requested.x)
    ? requested.x
    : mascot.x + mascot.width - width;
  const preferredY = Number.isFinite(requested.y)
    ? requested.y
    : mascot.y + mascot.height - height;
  let x = clamp(preferredX, area.x, area.x + area.width - width);
  let y = clamp(preferredY, area.y, area.y + area.height - height);
  if (direction === "left") x = area.x + area.width - width;
  if (direction === "right") x = area.x;
  if (direction === "above") y = area.y + area.height - height;
  if (direction === "below") y = area.y;
  return { x: Math.round(x), y: Math.round(y), width, height };
}

/**
 * Place the history beside the mascot without moving or covering the mascot.
 * A stored position wins only while it remains visible and non-overlapping.
 * Otherwise the panel may shrink to the largest usable region around the pet.
 */
function placePetHistoryBounds({
  gap = DEFAULT_GAP,
  height = DEFAULT_HISTORY_HEIGHT,
  margin = DEFAULT_MARGIN,
  mascotBounds,
  minHeight = DEFAULT_MIN_HEIGHT,
  minWidth = DEFAULT_MIN_WIDTH,
  storedBounds,
  width = DEFAULT_HISTORY_WIDTH,
  workArea,
} = {}) {
  const inner = innerWorkArea(workArea, margin);
  const mascot = normalizeRect(mascotBounds, {
    x: inner.x + inner.width,
    y: inner.y + inner.height,
    width: 1,
    height: 1,
  });
  const requested = normalizeRect(storedBounds, {
    x: mascot.x - width - gap,
    y: mascot.y + mascot.height - height,
    width,
    height,
  });
  const clampedStored = storedBounds
    ? clampHistoryBounds(storedBounds, workArea, { height, margin, width })
    : null;
  if (clampedStored && !rectanglesOverlap(clampedStored, mascot, gap)) {
    return clampedStored;
  }

  const innerRight = inner.x + inner.width;
  const innerBottom = inner.y + inner.height;
  const petRight = mascot.x + mascot.width;
  const petBottom = mascot.y + mascot.height;
  const spacing = Math.max(0, finite(gap, DEFAULT_GAP));
  const areas = [
    {
      direction: "left",
      order: 0,
      x: inner.x,
      y: inner.y,
      width: Math.max(0, Math.min(innerRight, mascot.x - spacing) - inner.x),
      height: inner.height,
    },
    {
      direction: "right",
      order: 1,
      x: Math.max(inner.x, petRight + spacing),
      y: inner.y,
      width: Math.max(0, innerRight - Math.max(inner.x, petRight + spacing)),
      height: inner.height,
    },
    {
      direction: "above",
      order: 2,
      x: inner.x,
      y: inner.y,
      width: inner.width,
      height: Math.max(0, Math.min(innerBottom, mascot.y - spacing) - inner.y),
    },
    {
      direction: "below",
      order: 3,
      x: inner.x,
      y: Math.max(inner.y, petBottom + spacing),
      width: inner.width,
      height: Math.max(0, innerBottom - Math.max(inner.y, petBottom + spacing)),
    },
  ];
  const usableMinWidth = Math.min(
    Math.max(1, Math.round(finite(minWidth, DEFAULT_MIN_WIDTH))),
    requested.width,
    inner.width
  );
  const usableMinHeight = Math.min(
    Math.max(1, Math.round(finite(minHeight, DEFAULT_MIN_HEIGHT))),
    requested.height,
    inner.height
  );
  const candidates = areas
    .map((area) => {
      const bounds = fitCandidate(area, area.direction, requested, mascot);
      if (!bounds || rectanglesOverlap(bounds, mascot, spacing)) return null;
      return {
        bounds,
        order: area.order,
        usable: bounds.width >= usableMinWidth && bounds.height >= usableMinHeight,
      };
    })
    .filter(Boolean)
    .sort((first, second) => (
      Number(second.usable) - Number(first.usable)
      || second.bounds.width * second.bounds.height - first.bounds.width * first.bounds.height
      || first.order - second.order
    ));

  if (candidates.length > 0) return candidates[0].bounds;

  // Only possible when the mascot itself occupies every usable strip. Keep the
  // panel visible rather than returning off-screen or invalid geometry.
  return clampHistoryBounds(requested, workArea, { height, margin, width });
}

module.exports = {
  clampHistoryBounds,
  placePetHistoryBounds,
  rectanglesOverlap,
};
