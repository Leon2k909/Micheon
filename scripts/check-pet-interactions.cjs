const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const layer = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetLayer.tsx"),
  "utf8"
);
const panel = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetHistoryPanel.tsx"),
  "utf8"
);
const historyWindow = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetHistoryWindow.tsx"),
  "utf8"
);
const provider = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetProvider.tsx"),
  "utf8"
);
const sprite = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetSprite.tsx"),
  "utf8"
);
const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
const displayMode = fs.readFileSync(path.join(root, "src/lib/petDisplayMode.ts"), "utf8");
const main = fs.readFileSync(path.join(root, "electron/main.js"), "utf8");
const preload = fs.readFileSync(path.join(root, "electron/preload.cjs"), "utf8");

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
const pointerMoveEnd = layer.indexOf("const finishDrag =", pointerEnd);
const pointerMoveHandler = layer.slice(pointerEnd, pointerMoveEnd);
const nativeDragStart = layer.indexOf("const startNativeDrag = (");
const nativeDragEnd = layer.indexOf("const handlePointerDown = (", nativeDragStart);
const nativeDragHandler = layer.slice(nativeDragStart, nativeDragEnd);
const finishActiveStart = layer.indexOf("const finishActiveDrag = (");
const finishActiveEnd = layer.indexOf("const startNativeDrag = (", finishActiveStart);
const finishActiveHandler = layer.slice(finishActiveStart, finishActiveEnd);
const clickStart = layer.indexOf("const handleClick = (");
const clickEnd = layer.indexOf("const applyPetSize =", clickStart);
const clickHandler = layer.slice(clickStart, clickEnd);
const openHistoryStart = layer.indexOf("const openHistory = useCallback(");
const openHistoryEnd = layer.indexOf("// A preference change", openHistoryStart);
const openHistory = layer.slice(openHistoryStart, openHistoryEnd);
const createHistoryStart = main.indexOf("function createPetHistoryWindow()");
const createHistoryEnd = main.indexOf("function openPetHistoryWindow(", createHistoryStart);
const createHistoryWindow = main.slice(createHistoryStart, createHistoryEnd);
const openNativeHistoryStart = main.indexOf("function openPetHistoryWindow(");
const openNativeHistoryEnd = main.indexOf("function closePetHistoryWindow()", openNativeHistoryStart);
const openNativeHistory = main.slice(openNativeHistoryStart, openNativeHistoryEnd);
const syncAttachedHistoryStart = main.indexOf("function syncAttachedPetHistoryBounds()");
const syncAttachedHistoryEnd = main.indexOf("function syncPetHistoryBounds()", syncAttachedHistoryStart);
const syncAttachedHistory = main.slice(syncAttachedHistoryStart, syncAttachedHistoryEnd);
const createOverlayStart = main.indexOf("function createPetOverlayWindow()");
const createOverlayEnd = main.indexOf("function createPetHistoryWindow()", createOverlayStart);
const createOverlayWindow = main.slice(createOverlayStart, createOverlayEnd);

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
  pointerHandler.includes("if (repeatedPress) return;")
    && !pointerHandler.includes("beginPetOverlayDrag")
);
check(
  "an ordinary press does not begin native drag or hide the pet",
  pointerHandler.includes("nativeStarted: false")
    && pointerHandler.includes("pressClientX: event.clientX")
    && !pointerHandler.includes("beginPetOverlayDrag")
);
check(
  "native drag begins only after desktop pointer movement crosses the threshold",
  pointerMoveHandler.includes("if (drag.nativeStarted) return;")
    && pointerMoveHandler.includes("Math.abs(deltaX) <= 3")
    && pointerMoveHandler.includes("Math.abs(deltaY) <= 3")
    && pointerMoveHandler.indexOf("Math.abs(deltaY) <= 3")
      < pointerMoveHandler.indexOf("startNativeDrag(drag)")
    && nativeDragHandler.includes("desktop?.beginPetOverlayDrag?.()")
);
check(
  "a pending click never asks main to restore a drag transition that did not start",
  finishActiveHandler.includes("if (isDesktopPetOverlay && !drag.nativeStarted)")
    && finishActiveHandler.includes("isDesktopPetOverlay && drag.nativeStarted && notifyMain")
);
check(
  "a new pending click cannot strand the previous native drag surface",
  finishActiveHandler.includes("if (!dragState.current?.nativeStarted) desktop?.endPetOverlayDrag?.();")
    && !finishActiveHandler.includes("if (!dragState.current) desktop?.endPetOverlayDrag?.();")
);
check(
  "a repeated click cancels history instead of opening it",
  /if \(event\.detail > 1\) \{[\s\S]*?cancelPendingPetClick\(\);[\s\S]*?return;[\s\S]*?\}/.test(clickHandler)
);
check(
  "a single click waits before opening history",
  /pendingPetClick\.current = window\.setTimeout\([\s\S]*?openHistory\(\);[\s\S]*?PET_SINGLE_CLICK_DELAY_MS/.test(clickHandler)
);
check(
  "pet sizes persist as per-pet overrides with the old global size as fallback",
  layer.includes('const PET_SIZES_KEY = "gl-codex-pet-sizes-v2";')
    && layer.includes("const legacyPetSize = useRef(storedLegacyPetSize()).current;")
    && layer.includes("const [petSizes, setPetSizes] = useState<PetSizeMap>(storedPetSizes);")
    && layer.includes("localStorage.setItem(PET_SIZES_KEY, JSON.stringify(sizes));")
);
check(
  "the size slider acts on the pet that opened the menu",
  layer.includes("const targetPet = menuPet ?? selectedPet;")
    && layer.includes("const nextSizes = { ...petSizes, [targetKey]: nextSize };")
    && layer.includes("value={menuPetSize}")
    && layer.includes('id="codex-pet-size-label"')
);
check(
  "each pet can be enlarged beyond the old 192px ceiling",
  Number(layer.match(/const PET_SIZE_MAX = (\d+);/)?.[1]) >= 320
    && layer.includes("max={PET_SIZE_MAX}")
);
check(
  "pet artwork and speech use a soft neutral shadow instead of a black halo on light pages",
  !layer.includes("drop-shadow-[0_12px_18px_rgba(0,0,0,0.24)]")
    && !layer.includes("shadow-[0_12px_36px_rgba(0,0,0,0.18)]")
    && layer.includes("drop-shadow-[0_9px_10px_rgba(48,65,42,0.14)]")
    && layer.includes("shadow-[0_12px_30px_rgba(66,82,57,0.14)]")
);
check(
  "pet display mode persists as one of three explicit choices with game mode preserving current behaviour",
  displayMode.includes('CODEX_PET_DISPLAY_MODE_KEY = "gl-codex-pet-display-mode-v1"')
    && displayMode.includes('value === "app" || value === "desktop" || value === "games"')
    && displayMode.includes('DEFAULT_PET_DISPLAY_MODE: PetDisplayMode = "games"')
    && displayMode.includes("syncLocalStorageItem(CODEX_PET_DISPLAY_MODE_KEY, mode)")
);
check(
  "the right-click panel separates controls and exposes all three display choices",
  layer.includes("const PET_MENU_WIDTH = 280;")
    && layer.includes('role="radiogroup"')
    && layer.includes('data-pet-display-mode={option.value}')
    && layer.includes('ui("Where pets appear")')
    && layer.includes('ui("This pet")')
    && layer.includes('ui("Messages & voice")')
    && layer.includes("min-h-11 w-full items-center gap-3")
);
check(
  "hiding the talking pet uses the normal hand-off instead of duplicating close behaviour",
  layer.includes("togglePetVisibility(codexPetKey(menuPet));")
    && !layer.includes('if (menuPetIsSpeaker) selectPet("off");')
    && layer.includes('{ui("Close all pets")}')
    && layer.includes("{allVisiblePets.length > 1 && (")
);
check(
  "grouped and separated pets render with their own saved widths",
  layer.includes("size={petSizeFor(pet, petSizes, legacyPetSize)}")
    && layer.includes("size={metrics.width}")
    && layer.includes('const resizedCompanion = layoutMode === "apart"')
);
check(
  "the delay is long enough to recognise an ordinary double-click",
  Number(layer.match(/PET_SINGLE_CLICK_DELAY_MS = (\d+)/)?.[1]) >= 300
);
check(
  "desktop history opens through its independent native bridge",
  openHistory.includes("if (isDesktopPetOverlay)")
    && openHistory.includes("desktop?.openPetHistory?.(currentPetHistoryAnchor());")
    && openHistory.indexOf("desktop?.openPetHistory?.(currentPetHistoryAnchor());") < openHistory.indexOf("setHistoryOpen(true);")
);
check(
  "web history stays in-page while desktop history never mounts in the mascot renderer",
  layer.includes("historyOpen && !isDesktopPetOverlay && (")
);
check(
  "opening history never conditions away the mascot, speech, menu or companions",
  !layer.includes("showPetChrome")
    && layer.includes('data-pet-motion-layer="true"')
    && layer.includes("{speech && !messagesMuted && (")
    && layer.includes('{layoutMode === "apart" && companionPets.map')
);
check(
  "desktop history opens before any speech clear can reshape or flash the mascot window",
  openHistory.indexOf("if (isDesktopPetOverlay)") >= 0
    && openHistory.indexOf("desktop?.openPetHistory?.(currentPetHistoryAnchor());") < openHistory.indexOf("clearSpeech();")
);
check(
  "preload exposes separate history open and close IPC",
  preload.includes('openPetHistory: (mascotBounds) => ipcRenderer.send("pet-history:open", mascotBounds)')
    && preload.includes('closePetHistory: () => ipcRenderer.send("pet-history:close")')
    && preload.includes('ipcRenderer.send("pet-overlay:set-history-anchor", mascotBounds)')
);
check(
  "history anchors to the visible mascot without cursor-frame IPC",
  layer.includes("const currentPetHistoryAnchor = useCallback(() => ({")
    && layer.includes("x: positionRef.current.x + petGroupVisibleBounds.left")
    && layer.includes("y: positionRef.current.y + petGroupVisibleBounds.top")
    && layer.includes("desktop?.setPetHistoryAnchor?.(currentPetHistoryAnchor());")
    && layer.includes("Position changes are committed only when a drag finishes")
);
check(
  "main process creates a dedicated compact history window",
  createHistoryStart >= 0
    && createHistoryEnd > createHistoryStart
    && createHistoryWindow.includes("new BrowserWindow({")
    && createHistoryWindow.includes("?pet-history=1")
    && main.includes("const PET_HISTORY_WINDOW_WIDTH = 636;")
    && main.includes("const PET_HISTORY_WINDOW_HEIGHT = 576;")
);
check(
  "history window cannot recreate the giant transparent union surface",
  !createHistoryWindow.includes("virtualDesktopBounds")
    && !createHistoryWindow.includes("setShape")
    && !createHistoryWindow.includes("setIgnoreMouseEvents")
);
check(
  "history IPC validates the sender before opening or closing",
  /ipcMain\.on\("pet-history:open"[\s\S]*?eventCameFrom\(event, petWindow\)[\s\S]*?openPetHistoryWindow\(mascotBounds\)/.test(main)
    && /ipcMain\.on\("pet-history:close"[\s\S]*?eventCameFrom\(event, petHistoryWindow\)[\s\S]*?closePetHistoryWindow\(\)/.test(main)
    && /ipcMain\.on\("pet-overlay:set-history-anchor"[\s\S]*?eventCameFrom\(event, petWindow\)/.test(main)
);
check(
  "each history open reattaches beside the mascot instead of reusing a detached position",
  main.includes("let petHistoryAttached = false;")
    && openNativeHistory.includes("petHistoryAttached = true;")
    && openNativeHistory.includes("initialPetHistoryBounds({ attached: true })")
);
check(
  "an interactive native panel drag detaches history for the rest of the open session",
  createHistoryWindow.includes('historyWindow.on("will-move", () => {')
    && createHistoryWindow.includes("petHistoryAttached = false;")
    && createHistoryWindow.includes("!petHistoryProgrammaticMove")
    && createHistoryWindow.includes('historyWindow.on("move", () => {')
    && createHistoryWindow.includes("rememberPetHistoryBounds(historyWindow)")
    && syncAttachedHistory.includes("!petHistoryAttached")
);
check(
  "history has a lightweight application route",
  app.includes('search.get("pet-history") === "1"')
    && app.includes("<CodexPetHistoryWindow />")
    && historyWindow.includes("<CodexPetHistoryPanel")
    && historyWindow.includes("nativeWindow")
);
check(
  "app-only mode renders pets inside Micheon and removes them from the native overlay",
  app.includes("function PetOverlaySurface()")
    && app.includes('petDisplayMode === "app"')
    && app.includes("function MainWindowPetSurface")
    && app.includes('return petDisplayMode === "app" ? <CodexPetLayer /> : null;')
);
check(
  "the preload and main process exchange only validated pet display modes",
  preload.includes('ipcRenderer.send("pet-overlay:set-display-mode", mode)')
    && preload.includes('ipcRenderer.on("pet-overlay:display-mode", handler)')
    && main.includes('const PET_DISPLAY_MODES = new Set(["app", "desktop", "games"]);')
    && /ipcMain\.on\("pet-overlay:set-display-mode"[\s\S]*?eventCameFrom\(event, mainWindow\)[\s\S]*?eventCameFrom\(event, petWindow\)[\s\S]*?setPetOverlayDisplayMode\(mode\)/.test(main)
);
check(
  "desktop and game modes use distinct topmost policies while app mode cannot create an overlay",
  main.includes('const PET_DESKTOP_TOP_LEVEL = "floating";')
    && main.includes('process.platform === "win32" ? "screen-saver" : "floating"')
    && main.includes('petDisplayMode === "games" ? PET_GAME_TOP_LEVEL : PET_DESKTOP_TOP_LEVEL')
    && main.includes('visibleOnFullScreen: petDisplayMode === "games"')
    && main.includes('if (!visible || petDisplayMode === "app") {')
);
check(
  "native history uses OS header dragging without mascot overlay drag IPC",
  panel.includes('nativeWindow && "pet-history-window-drag"')
    && panel.includes("onPointerDown={nativeWindow ? undefined : startDrag}")
    && panel.includes("if (nativeWindow) return undefined;")
    && !historyWindow.includes("onGeometryChange")
    && !historyWindow.includes("setPetOverlayKeyboardInteractive")
    && !historyWindow.includes("beginPetOverlayDrag")
);
check(
  "native history cannot reshow or hide the mascot during catalog load",
  provider.includes("const isDesktopPetSurface = isDesktopPetOverlay || isDesktopPetHistory;")
    && provider.includes("if (!desktop || isDesktopPetSurface || isLoading) return;")
);
check(
  "native history does not refetch the full pet catalogue on every focus",
  provider.includes("if (isDesktopPetHistory) {")
    && provider.includes("setIsLoading(false);")
);
check(
  "history-originated speech can still reach the mascot",
  provider.includes('if (desktop && !isDesktopPetOverlay && petDisplayMode !== "app") {')
    && provider.includes("desktop.sendPetOverlaySpeech")
    && /ipcMain\.on\("pet-overlay:speak"[\s\S]*?eventCameFrom\(event, mainWindow\)[\s\S]*?eventCameFrom\(event, petHistoryWindow\)/.test(main)
);
check(
  "relayed confirmation questions keep their grading stage",
  main.includes("confirm: question.confirm === true,")
);
check(
  "history content remains selectable and copyable",
  panel.includes("selectContents(contentRef.current)")
    && panel.includes("await navigator.clipboard.writeText(text)")
    && panel.includes("onContextMenu={openContextMenu}")
);
check(
  "changing the selected pet clears queued history",
  /useEffect\(\(\) => \{\s*cancelPendingPetClick\(\);\s*\}, \[cancelPendingPetClick, selectedKey\]\);/.test(layer)
);
check(
  "the desktop overlay starts click-through so games receive input outside the visible pet",
  createOverlayWindow.includes("overlay.setIgnoreMouseEvents(true, { forward: true });")
);
check(
  "the desktop overlay keeps Chromium background throttling enabled",
  createOverlayWindow.includes("backgroundThrottling: true")
    && !createOverlayWindow.includes("backgroundThrottling: false")
);
check(
  "the native shaped window owns input only inside actual pet regions",
  main.includes("petWindow.setShape(regions);")
    && main.includes("if (signature === petOverlayShapeSignature) return true;")
    && main.includes("petWindow.setIgnoreMouseEvents(false);")
);
check(
  "sprite frame style updates cannot trigger native shape recalculation",
  layer.includes("const observer = new MutationObserver(scheduleHitRegionSync);")
    && layer.includes("attributes: false,")
    && !/observer\.observe\(document\.body, \{[\s\S]*?attributes:\s*true/.test(layer)
);
check(
  "pet animation timers pause whenever the renderer is hidden",
  sprite.includes("const onVisibility = () => (document.hidden ? stop() : start());")
    && sprite.includes('document.addEventListener("visibilitychange", onVisibility);')
    && sprite.includes('document.removeEventListener("visibilitychange", onVisibility);')
);

if (failures) {
  console.error(`\n${failures} pet interaction regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\npet click, double-click and attachable compact-history behaviour is guarded");
