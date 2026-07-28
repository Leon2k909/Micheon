const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const layer = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetLayer.tsx"),
  "utf8"
);

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const pointerStart = layer.indexOf("const handlePointerDown = (");
const pointerEnd = layer.indexOf("const handlePointerMove =", pointerStart);
const pointerHandler = layer.slice(pointerStart, pointerEnd);
const clickStart = layer.indexOf("const handleClick = (");
const clickEnd = layer.indexOf("const applyPetSize =", clickStart);
const clickHandler = layer.slice(clickStart, clickEnd);

check("pet pointer handler exists", pointerStart >= 0 && pointerEnd > pointerStart);
check("pet click handler exists", clickStart >= 0 && clickEnd > clickStart);
check(
  "a new press cancels a pending single-click action",
  pointerHandler.includes("cancelPendingPetClick();")
);
check(
  "right-press cancels history before leaving pointer handling",
  pointerHandler.indexOf("cancelPendingPetClick();") >= 0
    && pointerHandler.indexOf("cancelPendingPetClick();")
      < pointerHandler.indexOf("if (event.button !== 0) return;")
);
check(
  "a repeated press is detected from the pending action, not PointerEvent.detail",
  pointerHandler.includes("const repeatedPress = pendingPetClick.current !== null;")
    && !pointerHandler.includes("event.detail")
);
check(
  "a repeated press does not begin a native drag",
  pointerHandler.indexOf("if (repeatedPress) return;") >= 0
    && pointerHandler.indexOf("if (repeatedPress) return;")
      < pointerHandler.indexOf("beginPetOverlayDrag")
);
check(
  "a repeated click cancels history instead of opening it",
  /if \(event\.detail > 1\) \{[\s\S]*?cancelPendingPetClick\(\);[\s\S]*?return;[\s\S]*?\}/.test(clickHandler)
);
check(
  "a single click waits before swapping the desktop overlay to history",
  /pendingPetClick\.current = window\.setTimeout\([\s\S]*?setHistoryOpen\(true\);[\s\S]*?PET_SINGLE_CLICK_DELAY_MS/.test(clickHandler)
);
check(
  "the delay is long enough to recognise an ordinary double-click",
  Number(layer.match(/PET_SINGLE_CLICK_DELAY_MS = (\d+)/)?.[1]) >= 300
);
check(
  "desktop history still uses the compact overlay instead of spanning the desktop",
  layer.includes("const showPetChrome = !isDesktopPetOverlay || !historyOpen;")
);
check(
  "changing the selected pet clears queued history",
  /useEffect\(\(\) => \{\s*cancelPendingPetClick\(\);\s*\}, \[cancelPendingPetClick, selectedKey\]\);/.test(layer)
);

if (failures) {
  console.error(`\n${failures} pet interaction regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\npet click, double-click and compact-history behaviour is guarded");
