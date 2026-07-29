"use strict";

const assert = require("node:assert/strict");
const {
  clampHistoryBounds,
  placePetHistoryBounds,
  rectanglesOverlap,
} = require("../electron/pet-history-geometry.cjs");

const MARGIN = 8;
const GAP = 12;

function assertInsideWorkArea(bounds, workArea, label) {
  assert.ok(bounds.x >= workArea.x + MARGIN, `${label}: left edge escaped the work area`);
  assert.ok(bounds.y >= workArea.y + MARGIN, `${label}: top edge escaped the work area`);
  assert.ok(
    bounds.x + bounds.width <= workArea.x + workArea.width - MARGIN,
    `${label}: right edge escaped the work area`
  );
  assert.ok(
    bounds.y + bounds.height <= workArea.y + workArea.height - MARGIN,
    `${label}: bottom edge escaped the work area`
  );
}

function assertAttachedToMascot(bounds, mascot, label) {
  const historyRight = bounds.x + bounds.width;
  const historyBottom = bounds.y + bounds.height;
  const mascotRight = mascot.x + mascot.width;
  const mascotBottom = mascot.y + mascot.height;
  const sharesHorizontalSpan = bounds.y < mascotBottom && historyBottom > mascot.y;
  const sharesVerticalSpan = bounds.x < mascotRight && historyRight > mascot.x;
  assert.ok(
    (sharesHorizontalSpan && (historyRight + GAP === mascot.x || mascotRight + GAP === bounds.x))
      || (sharesVerticalSpan && (historyBottom + GAP === mascot.y || mascotBottom + GAP === bounds.y)),
    `${label}: history is not anchored beside the mascot`
  );
}

const laptopWorkArea = { x: 0, y: 0, width: 1366, height: 768 };
const centredLaptopPet = { x: 443, y: 104, width: 480, height: 560 };
const laptopHistory = placePetHistoryBounds({
  attached: true,
  mascotBounds: centredLaptopPet,
  workArea: laptopWorkArea,
});
assertInsideWorkArea(laptopHistory, laptopWorkArea, "centred 1366x768 pet");
assert.equal(
  rectanglesOverlap(laptopHistory, centredLaptopPet, GAP),
  false,
  "history must not cover a centred pet on a 1366x768 laptop"
);
assert.ok(
  laptopHistory.width < 636 && laptopHistory.width >= 320,
  "history should shrink to a usable side column when the full width does not fit"
);
assertAttachedToMascot(laptopHistory, centredLaptopPet, "centred 1366x768 pet");

const roomyWorkArea = { x: 0, y: 0, width: 1920, height: 1080 };
const roomyPet = { x: 1500, y: 680, width: 300, height: 360 };
const safeStoredBounds = { x: 100, y: 100, width: 620, height: 560 };
assert.deepEqual(
  placePetHistoryBounds({
    mascotBounds: roomyPet,
    storedBounds: safeStoredBounds,
    workArea: roomyWorkArea,
  }),
  safeStoredBounds,
  "a visible stored position that does not cover the pet should be preserved"
);

const reattachedHistory = placePetHistoryBounds({
  attached: true,
  mascotBounds: roomyPet,
  storedBounds: safeStoredBounds,
  workArea: roomyWorkArea,
});
assert.notDeepEqual(
  reattachedHistory,
  safeStoredBounds,
  "an attached panel must not reopen at its old detached position"
);
assertAttachedToMascot(reattachedHistory, roomyPet, "reattached roomy history");

const overlappingStoredBounds = { x: 373, y: 96, width: 620, height: 560 };
const movedFromStored = placePetHistoryBounds({
  mascotBounds: centredLaptopPet,
  storedBounds: overlappingStoredBounds,
  workArea: laptopWorkArea,
});
assert.notDeepEqual(
  movedFromStored,
  overlappingStoredBounds,
  "an overlapping stored position must not be reused"
);
assert.equal(
  rectanglesOverlap(movedFromStored, centredLaptopPet, GAP),
  false,
  "an overlapping stored position should be replaced with a non-overlapping one"
);
assertInsideWorkArea(movedFromStored, laptopWorkArea, "repositioned stored bounds");

const leftMonitor = { x: -1920, y: 0, width: 1920, height: 1040 };
const leftMonitorPet = { x: -620, y: 560, width: 300, height: 400 };
const leftMonitorHistory = placePetHistoryBounds({
  mascotBounds: leftMonitorPet,
  storedBounds: { x: -560, y: 500, width: 636, height: 576 },
  workArea: leftMonitor,
});
assertInsideWorkArea(leftMonitorHistory, leftMonitor, "negative-origin work area");
assert.equal(
  rectanglesOverlap(leftMonitorHistory, leftMonitorPet, GAP),
  false,
  "negative-origin displays must use the same non-overlap guarantee"
);

assert.deepEqual(
  clampHistoryBounds(
    { x: -9999, y: 9999, width: 900, height: 900 },
    laptopWorkArea
  ),
  { x: 8, y: 8, width: 900, height: 752 },
  "clamping should keep oversized or off-screen history bounds inside the work area"
);

console.log("pet history geometry stays visible and clear of the mascot");
