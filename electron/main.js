// Electron desktop wrapper for germ.
//
// It reuses the exact same web app: the bundled Express server (server/index.js)
// serves the built front-end AND the /api/tts endpoint, and this main process
// just starts that server and points a window at it. So the desktop build behaves
// identically to the website — including the premium Microsoft TTS voices, which
// work here because the server runs locally inside the app.

import { app, BrowserWindow, shell, ipcMain, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import electronUpdater from "electron-updater";
import { startServer } from "../server/index.js";

const { autoUpdater } = electronUpdater;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Local port for the embedded server. Deliberately uncommon so it won't collide
// with the dev server (3001) or other tooling on the user's machine.
const PORT = process.env.GERM_PORT || 41730;

let mainWindow = null;
let petWindow = null;
let petOverlayUsesShape = false;
let petOverlayDragging = false;
let petOverlayDragDesktopBounds = null;
let petOverlayDragTimer = null;
let petOverlayDragWatchdog = null;
let petOverlayHitRegions = [];
/** Geometry of the shape currently applied, so identical updates are skipped. */
let petOverlayShapeSignature = null;
let petOverlayGeometrySignature = null;
let serverStarted = false;

// Keep the transparent compositor surface close to the mascot instead of the
// size of the entire virtual desktop. The margin gives drag hit regions room
// to follow a fast cursor without turning the window back into a screen-sized
// surface.
const PET_OVERLAY_WINDOW_MARGIN = 128;
const PET_OVERLAY_RECENTER_INSET = 48;
const PET_OVERLAY_INITIAL_WIDTH = 480;
const PET_OVERLAY_INITIAL_HEIGHT = 560;
const PET_OVERLAY_CURSOR_INTERVAL_MS = 16;

// Only allow one instance — a second launch focuses the existing window instead
// of trying to bind the port or create another overlay.
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

async function ensureServer() {
  if (serverStarted) return;
  await startServer(PORT);
  serverStarted = true;
}

function virtualDesktopBounds() {
  const displays = screen.getAllDisplays();
  const left = Math.min(...displays.map((display) => display.bounds.x));
  const top = Math.min(...displays.map((display) => display.bounds.y));
  const right = Math.max(...displays.map((display) => display.bounds.x + display.bounds.width));
  const bottom = Math.max(...displays.map((display) => display.bounds.y + display.bounds.height));
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function initialPetOverlayBounds() {
  const desktopBounds = virtualDesktopBounds();
  const primary = screen.getPrimaryDisplay().workArea;
  const width = Math.min(PET_OVERLAY_INITIAL_WIDTH, desktopBounds.width);
  const height = Math.min(PET_OVERLAY_INITIAL_HEIGHT, desktopBounds.height);
  return {
    x: Math.min(
      desktopBounds.x + desktopBounds.width - width,
      Math.max(desktopBounds.x, primary.x + primary.width - width - 16)
    ),
    y: Math.min(
      desktopBounds.y + desktopBounds.height - height,
      Math.max(desktopBounds.y, primary.y + primary.height - height - 16)
    ),
    width,
    height,
  };
}

function currentPetOverlayGeometry() {
  const desktopBounds = petOverlayDragDesktopBounds ?? virtualDesktopBounds();
  const windowBounds = petWindow && !petWindow.isDestroyed()
    ? petWindow.getBounds()
    : initialPetOverlayBounds();
  return {
    height: windowBounds.height,
    originX: windowBounds.x - desktopBounds.x,
    originY: windowBounds.y - desktopBounds.y,
    viewportHeight: desktopBounds.height,
    viewportWidth: desktopBounds.width,
    width: windowBounds.width,
  };
}

function publishPetOverlayGeometry(force = false) {
  if (!petWindow || petWindow.isDestroyed()) return;
  const geometry = currentPetOverlayGeometry();
  const signature = JSON.stringify(geometry);
  if (!force && signature === petOverlayGeometrySignature) return;
  petOverlayGeometrySignature = signature;
  petWindow.webContents.send("pet-overlay:geometry", geometry);
}

function syncPetOverlayBounds() {
  if (!petWindow || petWindow.isDestroyed()) return;
  // A monitor being added, removed, or repositioned changes the virtual
  // desktop origin. End the current gesture before applying that new
  // coordinate space so cursor samples never mix two desktop geometries.
  if (petOverlayDragging) finishPetOverlayDrag();
  const desktopBounds = virtualDesktopBounds();
  const current = petWindow.getBounds();
  const width = Math.min(current.width, desktopBounds.width);
  const height = Math.min(current.height, desktopBounds.height);
  const next = {
    x: Math.min(
      Math.max(desktopBounds.x, current.x),
      desktopBounds.x + desktopBounds.width - width
    ),
    y: Math.min(
      Math.max(desktopBounds.y, current.y),
      desktopBounds.y + desktopBounds.height - height
    ),
    width,
    height,
  };
  if (
    current.x !== next.x
    || current.y !== next.y
    || current.width !== next.width
    || current.height !== next.height
  ) {
    const resized = current.width !== next.width || current.height !== next.height;
    petWindow.setBounds(next, false);
    if (resized) {
      // Resizing the window can drop the native region, so never let the
      // skip-identical check suppress the re-apply. Moving preserves it.
      petOverlayShapeSignature = null;
      if (petOverlayDragging) applyPetOverlayDragShape();
      else restorePetOverlayShape();
    }
  }
  publishPetOverlayGeometry(true);
}

function applyPetOverlayShape(regions, preserveOnFailure = false) {
  if (!petWindow || petWindow.isDestroyed() || regions.length === 0) return false;
  // setShape is a native SetWindowRgn on Windows and is far too expensive to
  // call at frame rate. Skipping an identical shape costs one string compare
  // and removes nearly all of the calls, because a moving pet re-sends the same
  // geometry whenever it settles.
  const signature = JSON.stringify(regions);
  if (signature === petOverlayShapeSignature) return true;
  try {
    petWindow.setShape(regions);
    petOverlayShapeSignature = signature;
    petOverlayUsesShape = true;
    petWindow.setIgnoreMouseEvents(false);
    return true;
  } catch (error) {
    petOverlayShapeSignature = null;
    if (!preserveOnFailure) {
      petOverlayUsesShape = false;
      petWindow.setIgnoreMouseEvents(true, { forward: true });
    }
    console.error("[pet] unable to shape overlay:", error?.message ?? error);
    return false;
  }
}

/**
 * Grow the overlay to the whole virtual desktop for a drag.
 *
 * Published synchronously so the renderer knows the new origin before the first
 * cursor sample arrives — otherwise the first move of every drag is drawn
 * against the old origin and the mascot jumps.
 */
function expandPetOverlayForDrag() {
  if (!petWindow || petWindow.isDestroyed()) return;
  const desktopBounds = petOverlayDragDesktopBounds ?? virtualDesktopBounds();
  const current = petWindow.getBounds();
  if (
    current.x === desktopBounds.x
    && current.y === desktopBounds.y
    && current.width === desktopBounds.width
    && current.height === desktopBounds.height
  ) return;
  // Resizing drops the Windows window region, so the shape must be re-applied
  // rather than skipped as identical.
  petOverlayShapeSignature = null;
  petWindow.setBounds(desktopBounds, false);
  publishPetOverlayGeometry(true);
}

function applyPetOverlayDragShape() {
  if (!petOverlayDragging || !petWindow || petWindow.isDestroyed()) return;
  const bounds = petWindow.getBounds();
  // During a drag the complete compact window becomes the temporary hit area.
  // Its transparent margin follows the mascot, so Windows receives mouse-up
  // without an expensive SetWindowRgn call for every cursor update.
  applyPetOverlayShape([{ x: 0, y: 0, width: bounds.width, height: bounds.height }], true);
}

function compactPetOverlayToRegions(
  regions,
  rendererOrigin = {},
  desktopBounds = virtualDesktopBounds()
) {
  if (!petWindow || petWindow.isDestroyed() || regions.length === 0) return [];

  // Never move the native window mid-drag. The window origin is what the
  // renderer positions its content against, so every move shifted the ground
  // under a mascot that was being dragged across it — which is what the stutter
  // was. The drag already widened the window to the whole desktop, so there is
  // nothing to follow; it recompacts when the drag ends.
  if (petOverlayDragging) return [];

  const currentBounds = petWindow.getBounds();
  const originX = Number.isFinite(Number(rendererOrigin?.x))
    ? Number(rendererOrigin.x)
    : currentBounds.x - desktopBounds.x;
  const originY = Number.isFinite(Number(rendererOrigin?.y))
    ? Number(rendererOrigin.y)
    : currentBounds.y - desktopBounds.y;

  // Renderer rectangles are local to the compact native window. Rebase them
  // through the origin that produced that render so even an in-flight geometry
  // update cannot make a stale rectangle jump to another part of the desktop.
  const globalRegions = regions.map((region) => ({
    height: region.height,
    width: region.width,
    x: desktopBounds.x + originX + region.x,
    y: desktopBounds.y + originY + region.y,
  }));

  const desiredLeft = Math.max(
    desktopBounds.x,
    Math.floor(Math.min(...globalRegions.map((region) => region.x)) - PET_OVERLAY_WINDOW_MARGIN)
  );
  const desiredTop = Math.max(
    desktopBounds.y,
    Math.floor(Math.min(...globalRegions.map((region) => region.y)) - PET_OVERLAY_WINDOW_MARGIN)
  );
  const desiredRight = Math.min(
    desktopBounds.x + desktopBounds.width,
    Math.ceil(
      Math.max(...globalRegions.map((region) => region.x + region.width))
      + PET_OVERLAY_WINDOW_MARGIN
    )
  );
  const desiredBottom = Math.min(
    desktopBounds.y + desktopBounds.height,
    Math.ceil(
      Math.max(...globalRegions.map((region) => region.y + region.height))
      + PET_OVERLAY_WINDOW_MARGIN
    )
  );
  if (desiredRight <= desiredLeft || desiredBottom <= desiredTop) return [];

  const desiredBounds = {
    x: desiredLeft,
    y: desiredTop,
    width: desiredRight - desiredLeft,
    height: desiredBottom - desiredTop,
  };
  const regionLeft = Math.min(...globalRegions.map((region) => region.x));
  const regionTop = Math.min(...globalRegions.map((region) => region.y));
  const regionRight = Math.max(...globalRegions.map((region) => region.x + region.width));
  const regionBottom = Math.max(...globalRegions.map((region) => region.y + region.height));
  const desktopRight = desktopBounds.x + desktopBounds.width;
  const desktopBottom = desktopBounds.y + desktopBounds.height;
  const safeLeft = currentBounds.x <= desktopBounds.x
    ? currentBounds.x
    : currentBounds.x + PET_OVERLAY_RECENTER_INSET;
  const safeTop = currentBounds.y <= desktopBounds.y
    ? currentBounds.y
    : currentBounds.y + PET_OVERLAY_RECENTER_INSET;
  const safeRight = currentBounds.x + currentBounds.width >= desktopRight
    ? currentBounds.x + currentBounds.width
    : currentBounds.x + currentBounds.width - PET_OVERLAY_RECENTER_INSET;
  const safeBottom = currentBounds.y + currentBounds.height >= desktopBottom
    ? currentBounds.y + currentBounds.height
    : currentBounds.y + currentBounds.height - PET_OVERLAY_RECENTER_INSET;
  const regionsHaveRoom = regionLeft >= safeLeft
    && regionTop >= safeTop
    && regionRight <= safeRight
    && regionBottom <= safeBottom;
  const currentArea = currentBounds.width * currentBounds.height;
  const desiredArea = desiredBounds.width * desiredBounds.height;
  const needToShrink = currentArea > desiredArea * 1.5;
  // Let the content travel within the compact surface and only recenter near an
  // edge. Without this hysteresis, a drag moved the native BrowserWindow on
  // every cursor tick even though it already had ample transparent room.
  const nextBounds = regionsHaveRoom && !needToShrink ? currentBounds : desiredBounds;
  const moved = currentBounds.x !== nextBounds.x || currentBounds.y !== nextBounds.y;
  const resized = currentBounds.width !== nextBounds.width || currentBounds.height !== nextBounds.height;
  if (moved || resized) {
    // Moving preserves a Windows window region. Resizing can drop it.
    if (resized) petOverlayShapeSignature = null;
    petWindow.setBounds(nextBounds, false);
  }

  const localRegions = globalRegions
    .map((region) => {
      const x = Math.max(0, Math.floor(region.x - nextBounds.x));
      const y = Math.max(0, Math.floor(region.y - nextBounds.y));
      const localRight = Math.min(
        nextBounds.width,
        Math.ceil(region.x + region.width - nextBounds.x)
      );
      const localBottom = Math.min(
        nextBounds.height,
        Math.ceil(region.y + region.height - nextBounds.y)
      );
      if (localRight <= x || localBottom <= y) return null;
      return { x, y, width: localRight - x, height: localBottom - y };
    })
    .filter(Boolean);

  if (moved || resized) publishPetOverlayGeometry();
  return localRegions;
}

function restorePetOverlayShape() {
  if (petOverlayHitRegions.length > 0) applyPetOverlayShape(petOverlayHitRegions);
}

function stopPetOverlayCursorTracking() {
  if (petOverlayDragTimer) clearInterval(petOverlayDragTimer);
  petOverlayDragTimer = null;
}

function petOverlayCursorPoint() {
  if (!petWindow || petWindow.isDestroyed()) return null;
  const cursor = screen.getCursorScreenPoint();
  const bounds = petOverlayDragDesktopBounds ?? virtualDesktopBounds();
  return {
    screenX: cursor.x,
    screenY: cursor.y,
    x: cursor.x - bounds.x,
    y: cursor.y - bounds.y,
  };
}

function startPetOverlayCursorTracking() {
  stopPetOverlayCursorTracking();
  let previousPoint = null;
  const sendCursor = () => {
    if (!petOverlayDragging || !petWindow || petWindow.isDestroyed()) {
      stopPetOverlayCursorTracking();
      return;
    }
    const point = petOverlayCursorPoint();
    if (!point || (previousPoint?.x === point.x && previousPoint?.y === point.y)) return;
    previousPoint = point;
    petWindow.webContents.send("pet-overlay:drag-cursor", point);
  };
  sendCursor();
  petOverlayDragTimer = setInterval(sendCursor, PET_OVERLAY_CURSOR_INTERVAL_MS);
  petOverlayDragTimer.unref?.();
  return previousPoint;
}

function finishPetOverlayDrag() {
  stopPetOverlayCursorTracking();
  if (petOverlayDragWatchdog) clearTimeout(petOverlayDragWatchdog);
  petOverlayDragWatchdog = null;
  if (!petOverlayDragging) return;
  petOverlayDragging = false;
  petOverlayDragDesktopBounds = null;
  // The stored regions are local to the window as it was BEFORE the drag
  // widened it, so re-applying them now would shape the wrong part of a
  // desktop-sized window and the mascot would simply stop being drawn. Drop
  // them and hold the full-window shape — everything stays visible — until the
  // renderer delivers regions measured against the window as it is now.
  petOverlayHitRegions = [];
  petOverlayShapeSignature = null;
  if (petWindow && !petWindow.isDestroyed() && !petWindow.webContents.isDestroyed()) {
    petWindow.webContents.send("pet-overlay:drag-ended");
    // Ask for those regions rather than waiting to be told: until they arrive
    // the overlay covers the desktop and swallows clicks meant for what is
    // behind it.
    petWindow.webContents.send("pet-overlay:resync");
  }
}

function startPetOverlayDragWatchdog() {
  if (petOverlayDragWatchdog) clearTimeout(petOverlayDragWatchdog);
  petOverlayDragWatchdog = setTimeout(finishPetOverlayDrag, 20000);
  petOverlayDragWatchdog.unref?.();
}

// The overlay used to be a single-shot load: one failed loadURL (server busy,
// transient socket error) was swallowed by a .catch and the overlay stayed a
// blank transparent window for the entire session — enabling a pet visibly did
// nothing. The load now retries with backoff while the overlay exists, and
// showing the overlay again resets the budget.
let petOverlayLoaded = false;
let petOverlayLoadAttempts = 0;
let petOverlayLoadTimer = null;
let petOverlayDestroyTimer = null;

function clearPetOverlayLoadTimer() {
  if (petOverlayLoadTimer) clearTimeout(petOverlayLoadTimer);
  petOverlayLoadTimer = null;
}

function clearPetOverlayDestroyTimer() {
  if (petOverlayDestroyTimer) clearTimeout(petOverlayDestroyTimer);
  petOverlayDestroyTimer = null;
}

function resetPetOverlayLoadState() {
  clearPetOverlayLoadTimer();
  petOverlayLoaded = false;
  petOverlayLoadAttempts = 0;
}

function loadPetOverlay() {
  if (!petWindow || petWindow.isDestroyed()) return;
  if (petWindow.webContents.isLoading()) return;
  void petWindow.loadURL(`http://localhost:${PORT}/?pet-overlay=1`).catch((error) => {
    console.error("[pet] unable to load overlay:", error?.message ?? error);
    schedulePetOverlayLoadRetry();
  });
}

function schedulePetOverlayLoadRetry() {
  if (petOverlayLoadTimer || !petWindow || petWindow.isDestroyed()) return;
  if (!petWindow.isVisible()) return;
  if (petOverlayLoadAttempts >= 5) return;
  const delay = Math.min(15000, 1000 * 2 ** petOverlayLoadAttempts);
  petOverlayLoadAttempts += 1;
  petOverlayLoadTimer = setTimeout(() => {
    petOverlayLoadTimer = null;
    loadPetOverlay();
  }, delay);
  petOverlayLoadTimer.unref?.();
}

function createPetOverlayWindow() {
  if (petWindow && !petWindow.isDestroyed()) return petWindow;
  const initialBounds = initialPetOverlayBounds();

  petWindow = new BrowserWindow({
    ...initialBounds,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    focusable: false,
    hasShadow: false,
    movable: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    title: "Micheon mascot",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // The overlay used to opt out of Chromium's background throttling. That
      // kept sprite timers and transparent-surface composition running at full
      // speed even after the mascot window was hidden, which could make the
      // entire desktop stutter. Visible pets animate normally with the default
      // throttling; hidden pets now become genuinely idle.
      backgroundThrottling: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  petWindow.setAlwaysOnTop(true, "floating");
  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.setIgnoreMouseEvents(true, { forward: true });
  petWindow.on("move", () => publishPetOverlayGeometry());
  petWindow.on("resize", () => publishPetOverlayGeometry());

  petWindow.webContents.on("did-finish-load", () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    clearPetOverlayLoadTimer();
    petOverlayLoaded = true;
    petOverlayLoadAttempts = 0;
    publishPetOverlayGeometry(true);
    if (petWindow.isVisible()) petWindow.webContents.send("pet-overlay:resync");
  });
  petWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, _validatedURL, isMainFrame) => {
      // Chromium reports ERR_ABORTED when a newer navigation replaces an older
      // one. It is not a failed overlay and must not consume the retry budget.
      if (!isMainFrame || errorCode === -3) return;
      finishPetOverlayDrag();
      petOverlayLoaded = false;
      console.error(`[pet] overlay load failed (${errorCode}):`, errorDescription);
      schedulePetOverlayLoadRetry();
    }
  );
  petWindow.webContents.on("render-process-gone", (_event, details) => {
    finishPetOverlayDrag();
    petOverlayLoaded = false;
    console.error("[pet] overlay renderer exited:", details?.reason ?? "unknown");
    schedulePetOverlayLoadRetry();
  });
  loadPetOverlay();
  petWindow.on("closed", () => {
    clearPetOverlayDestroyTimer();
    stopPetOverlayCursorTracking();
    if (petOverlayDragWatchdog) clearTimeout(petOverlayDragWatchdog);
    petOverlayDragWatchdog = null;
    resetPetOverlayLoadState();
    petWindow = null;
    petOverlayUsesShape = false;
    petOverlayDragging = false;
    petOverlayDragDesktopBounds = null;
    petOverlayHitRegions = [];
    petOverlayShapeSignature = null;
    petOverlayGeometrySignature = null;
  });
  petWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  return petWindow;
}

function setPetOverlayVisible(visible) {
  if (!visible) {
    finishPetOverlayDrag();
    clearPetOverlayLoadTimer();
    petWindow?.hide();
    clearPetOverlayDestroyTimer();
    petOverlayDestroyTimer = setTimeout(() => {
      petOverlayDestroyTimer = null;
      if (petWindow && !petWindow.isDestroyed() && !petWindow.isVisible()) {
        petWindow.destroy();
      }
    }, 1000);
    petOverlayDestroyTimer.unref?.();
    return;
  }
  clearPetOverlayDestroyTimer();
  const overlay = createPetOverlayWindow();
  // A show is an explicit recovery request. If initial navigation or the
  // renderer failed previously, give it a fresh bounded retry budget instead
  // of repeatedly showing the same blank transparent window.
  if (!petOverlayLoaded) {
    clearPetOverlayLoadTimer();
    petOverlayLoadAttempts = 0;
    loadPetOverlay();
  }
  syncPetOverlayBounds();
  overlay.setAlwaysOnTop(true, "floating");
  overlay.showInactive();
  // A hidden window runs no animation frames, so a hit-region sync scheduled
  // while hidden never completed and the overlay came back with no shape —
  // fully click-through, which looks exactly like the pet failing to appear.
  // Ask the renderer for fresh geometry every time the overlay is shown, and
  // drop the cached signature so the answer is definitely re-applied.
  petOverlayShapeSignature = null;
  const requestResync = () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    petWindow.webContents.send("pet-overlay:resync");
  };
  // The permanent did-finish-load listener sends this after recovery. Sending
  // here as well is only needed for an already healthy renderer.
  if (petOverlayLoaded && !overlay.webContents.isLoading()) requestResync();
}

function eventCameFrom(event, window) {
  return Boolean(
    window
    && !window.isDestroyed()
    && event.sender.id === window.webContents.id
  );
}

async function createWindow() {
  // Boot the embedded web + TTS server first, then load it.
  await ensureServer();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 880,
    minHeight: 600,
    backgroundColor: "#0b0b0f",
    title: "Micheon",
    // Frameless: we draw our own title bar in the app (src/components/TitleBar.tsx)
    // for a clean, on-brand look like Discord/Slack.
    frame: false,
    icon: path.join(__dirname, "..", "dist", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  await mainWindow.loadURL(`http://localhost:${PORT}`);
  // The overlay is NOT created here. It uses a second lightweight renderer and
  // is created only when a pet is actually shown, so someone who never turns
  // one on never pays for it.

  // Tell the renderer when the window is maximized/restored so the title bar's
  // maximize button can show the correct icon.
  const sendMaxState = () =>
    mainWindow?.webContents.send("window:maximize-change", mainWindow.isMaximized());
  mainWindow.on("maximize", sendMaxState);
  mainWindow.on("unmaximize", sendMaxState);

  // Open external links (http/https to other sites) in the user's real browser
  // instead of inside the app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (petWindow && !petWindow.isDestroyed()) petWindow.destroy();
  });
}

// ── Auto-update ──────────────────────────────────────────────────────────
// Checks the GitHub releases feed on launch (and hourly). When a newer version
// is published, it downloads it in the background and installs it silently the
// next time the app quits — so the user never re-downloads or reinstalls by
// hand. Only runs in the packaged app; a dev run has no update feed.
/**
 * What the updater last did, so the renderer can be told at any point.
 *
 * The "update downloaded" toast used to be the only signal, and it fires once.
 * Miss it — because the download finished before you opened the window, or you
 * dismissed it, or you restarted — and there is no way left to find out that an
 * update is sitting there waiting, or that the app checked at all. Keeping the
 * last result means the answer is always available on request.
 */
let updateStatus = { state: "idle", version: null, checkedAt: null };

function setUpdateStatus(state, version) {
  updateStatus = { state, version: version ?? updateStatus.version, checkedAt: Date.now() };
  if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
    mainWindow.webContents.send("update:status", updateStatus);
  }
}

function setupAutoUpdate() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  // Always full-download the installer. Differential (block-map) downloads diff
  // against the currently-installed build; across a big change (e.g. the
  // Learn German -> Micheon rename) that diff is huge and, over GitHub's
  // repo-rename redirect, its many range requests can stall. Full downloads are
  // a single resumable request and just work.
  autoUpdater.disableDifferentialDownload = true;

  autoUpdater.on("error", (err) => {
    console.error("[updater] error:", err?.message ?? err);
    setUpdateStatus("error");
  });
  autoUpdater.on("checking-for-update", () => {
    console.log("[updater] checking for updates…");
    setUpdateStatus("checking");
  });
  autoUpdater.on("update-available", (info) => {
    console.log("[updater] update available:", info.version);
    setUpdateStatus("downloading", info.version);
  });
  autoUpdater.on("update-not-available", () => {
    console.log("[updater] already up to date");
    setUpdateStatus("current");
  });
  autoUpdater.on("download-progress", (p) => console.log(`[updater] downloading ${Math.round(p.percent)}%`));
  autoUpdater.on("update-downloaded", (info) => {
    console.log("[updater] update downloaded:", info.version, "— will install on quit");
    setUpdateStatus("ready", info.version);
    // Let the app show a subtle "Update ready, restart to apply" hint if it wants.
    mainWindow?.webContents.send("update:downloaded", info.version);
  });

  autoUpdater.checkForUpdatesAndNotify().catch((e) => console.error("[updater] check failed:", e?.message ?? e));
  // Re-check periodically for long-running sessions. Fifteen minutes rather than
  // an hour: the app is left open for hours at a time, and waiting up to a full
  // hour to even notice a release is what makes it look as though nothing is
  // happening. The check is one small request against the releases feed.
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 15 * 60 * 1000);
}

/** The renderer asking directly — "check now", and what happened last time. */
ipcMain.handle("update:get-status", () => ({
  ...updateStatus,
  currentVersion: app.getVersion(),
  supported: app.isPackaged,
}));

ipcMain.handle("update:check-now", async () => {
  if (!app.isPackaged) {
    return { state: "unsupported", currentVersion: app.getVersion(), supported: false };
  }
  try {
    // An update already downloaded stays "ready": checking again would report
    // "current" against the feed and hide the restart the learner still needs.
    if (updateStatus.state !== "ready") setUpdateStatus("checking");
    await autoUpdater.checkForUpdates();
  } catch (error) {
    console.error("[updater] manual check failed:", error?.message ?? error);
    setUpdateStatus("error");
  }
  return { ...updateStatus, currentVersion: app.getVersion(), supported: true };
});

// Renderer can ask to apply the downloaded update immediately (restart + install).
ipcMain.on("update:install-now", () => {
  autoUpdater.quitAndInstall();
});

// Window-control IPC from the custom title bar.
ipcMain.on("window:minimize", () => mainWindow?.minimize());
ipcMain.on("window:toggle-maximize", () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on("window:close", () => mainWindow?.close());
ipcMain.handle("window:is-maximized", () => mainWindow?.isMaximized() ?? false);

ipcMain.on("pet-overlay:set-visible", (event, visible) => {
  const trustedSender = eventCameFrom(event, mainWindow) || eventCameFrom(event, petWindow);
  if (!trustedSender) return;
  setPetOverlayVisible(Boolean(visible));
});

ipcMain.on("pet-overlay:set-interactive", (event, interactive) => {
  if (!eventCameFrom(event, petWindow) || !petWindow || petWindow.isDestroyed()) return;
  // Windows-shaped overlays own input only over the mascot UI and therefore do
  // not need the fragile mousemove-driven click-through toggle.
  if (petOverlayUsesShape) return;
  petWindow.setIgnoreMouseEvents(!interactive, { forward: true });
});

ipcMain.on("pet-overlay:get-geometry", (event) => {
  if (!eventCameFrom(event, petWindow)) {
    event.returnValue = null;
    return;
  }
  event.returnValue = currentPetOverlayGeometry();
});

ipcMain.on("pet-overlay:set-hit-regions", (event, payload) => {
  if (!eventCameFrom(event, petWindow) || !petWindow || petWindow.isDestroyed()) return;
  if (process.platform !== "win32" && process.platform !== "linux") return;
  const regions = Array.isArray(payload) ? payload : payload?.regions;
  const rendererOrigin = Array.isArray(payload) ? undefined : payload?.origin;
  if (!Array.isArray(regions) || regions.length === 0) return;

  const desktopBounds = petOverlayDragDesktopBounds ?? virtualDesktopBounds();
  const maximumCoordinate = Math.max(desktopBounds.width, desktopBounds.height) * 2;
  const rawRegions = regions
    .slice(0, 32)
    .map((region) => {
      const rawX = Number(region?.x);
      const rawY = Number(region?.y);
      const rawWidth = Number(region?.width);
      const rawHeight = Number(region?.height);
      if (
        !Number.isFinite(rawX)
        || !Number.isFinite(rawY)
        || !Number.isFinite(rawWidth)
        || !Number.isFinite(rawHeight)
        || Math.abs(rawX) > maximumCoordinate
        || Math.abs(rawY) > maximumCoordinate
      ) return null;

      const x = Math.floor(rawX);
      const y = Math.floor(rawY);
      const right = Math.ceil(rawX + Math.min(rawWidth, desktopBounds.width));
      const bottom = Math.ceil(rawY + Math.min(rawHeight, desktopBounds.height));
      if (right <= x || bottom <= y) return null;
      return { x, y, width: right - x, height: bottom - y };
    })
    .filter(Boolean);

  if (rawRegions.length === 0) return;
  const safeRegions = compactPetOverlayToRegions(rawRegions, rendererOrigin, desktopBounds);
  if (safeRegions.length === 0) return;
  petOverlayHitRegions = safeRegions;
  // Pixels outside these rectangles are neither drawn nor interactive. During
  // a drag, the compact window itself is the temporary local hit region.
  if (petOverlayDragging) applyPetOverlayDragShape();
  else applyPetOverlayShape(safeRegions);
});

ipcMain.on("pet-overlay:begin-drag", (event) => {
  if (!eventCameFrom(event, petWindow) || !petWindow || petWindow.isDestroyed()) {
    event.returnValue = { reason: "untrusted-sender", started: false };
    return;
  }
  if (process.platform !== "win32" && process.platform !== "linux") {
    event.returnValue = { started: true };
    return;
  }
  // Keep an enlarged local region alive, poll the native cursor, and move the
  // compact window with the mascot during the drag.
  try {
    petOverlayDragDesktopBounds = virtualDesktopBounds();
    petOverlayDragging = true;
    // Take the whole desktop for the duration of the gesture. The compact
    // window had to chase the cursor to stay under the mascot, and every one of
    // those moves changed the coordinate origin the renderer draws against. It
    // also fenced the pet: it could not be dragged past the window's own edge
    // before that window had caught up. One resize here, one at the end.
    expandPetOverlayForDrag();
    // Apply the full compact-window drag region NOW, synchronously, before this call
    // returns to the renderer. The pointer has not been established over the
    // new shape yet, so nothing can be disturbed by the change — whereas the
    // old flow reshaped one frame INTO the drag, under an active pointer,
    // which is the kind of SetWindowRgn-mid-gesture that can end it. It also
    // means later renderer region updates reuse one identical shape instead of
    // reshaping while the pointer is held.
    applyPetOverlayDragShape();
    const point = startPetOverlayCursorTracking();
    startPetOverlayDragWatchdog();
    event.returnValue = {
      screenX: point?.screenX,
      screenY: point?.screenY,
      started: true,
      x: point?.x,
      y: point?.y,
    };
  } catch (error) {
    petOverlayDragging = false;
    petOverlayDragDesktopBounds = null;
    stopPetOverlayCursorTracking();
    // The collar may already be applied; a failed drag must not leave it
    // behind as an oversized invisible hit area.
    petOverlayShapeSignature = null;
    restorePetOverlayShape();
    console.error("[pet] unable to begin drag:", error?.message ?? error);
    event.returnValue = { reason: "native-drag-failed", started: false };
  }
});

ipcMain.on("pet-overlay:end-drag", (event) => {
  if (!eventCameFrom(event, petWindow)) return;
  finishPetOverlayDrag();
});

ipcMain.on("pet-overlay:set-keyboard-interactive", (event, interactive) => {
  if (!eventCameFrom(event, petWindow) || !petWindow || petWindow.isDestroyed()) return;
  const enabled = Boolean(interactive);
  petWindow.setFocusable(enabled);
  if (enabled) petWindow.focus();
});

ipcMain.on("pet-overlay:wheel", (event, deltaX, deltaY) => {
  if (!eventCameFrom(event, petWindow) || !mainWindow || mainWindow.isDestroyed()) return;
  const dx = Number(deltaX);
  const dy = Number(deltaY);
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
  mainWindow.webContents.send(
    "pet-overlay:wheel",
    Math.max(-1600, Math.min(1600, dx)),
    Math.max(-1600, Math.min(1600, dy))
  );
});

ipcMain.on("pet-overlay:speak", (event, payload) => {
  if (!eventCameFrom(event, mainWindow) || !petWindow || petWindow.isDestroyed()) return;
  const message = payload?.message;
  if (!message || typeof message.id !== "string" || typeof message.text !== "string") return;
  const text = message.text.trim().slice(0, 240);
  const id = message.id.trim().slice(0, 96);
  if (!id || !text) return;
  const durationMs = Number(payload.options?.durationMs);
  const question = message.question;
  petWindow.webContents.send("pet-overlay:speech", {
    message: {
      createdAt: Number.isFinite(Number(message.createdAt)) ? Number(message.createdAt) : Date.now(),
      id,
      mood: typeof message.mood === "string" ? message.mood : "greeting",
      question: question && typeof question.itemId === "string"
        ? {
            aliases: Array.isArray(question.aliases)
              ? question.aliases.filter((value) => typeof value === "string").slice(0, 12)
              : [],
            answerLanguage: question.answerLanguage === "en" ? "en" : "de",
            de: typeof question.de === "string" ? question.de.slice(0, 180) : "",
            en: typeof question.en === "string" ? question.en.slice(0, 180) : "",
            itemId: question.itemId.slice(0, 180),
          }
        : undefined,
      text,
      voiceLang: message.voiceLang === "de-DE"
        ? "de-DE"
        : message.voiceLang === "en-US"
          ? "en-US"
          : undefined,
    },
    options: {
      durationMs: Number.isFinite(durationMs) ? durationMs : undefined,
    },
  });
});

if (hasSingleInstanceLock) {
  app.whenReady().then(async () => {
    await createWindow();
    screen.on("display-added", syncPetOverlayBounds);
    screen.on("display-removed", syncPetOverlayBounds);
    screen.on("display-metrics-changed", syncPetOverlayBounds);
    setupAutoUpdate();
  });
}

// macOS: re-create a window when the dock icon is clicked and none are open.
app.on("activate", () => {
  if (!hasSingleInstanceLock) return;
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed, except on macOS where apps stay alive.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
