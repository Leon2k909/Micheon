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
let petOverlayDragTimer = null;
let petOverlayDragStartRegions = [];
let petOverlayHitRegions = [];
/** Geometry of the shape currently applied, so identical updates are skipped. */
let petOverlayShapeSignature = null;
let petOverlayDragShapeTimer = null;
let petOverlayDragShapeAt = 0;
let serverStarted = false;

// Only allow one instance — a second launch focuses the existing window instead
// of trying to bind the port again.
if (!app.requestSingleInstanceLock()) {
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
  // Keep one click-through renderer across the complete virtual desktop. Moving
  // a small native window left Windows to clamp its transparent outer box on
  // some scaled laptop displays, long before the visible mascot reached an edge.
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

function syncPetOverlayBounds() {
  // Display bounds are expressed in Electron DIP coordinates, so this also
  // follows Windows display scaling and mixed-resolution monitor changes.
  if (!petWindow || petWindow.isDestroyed()) return;
  const next = virtualDesktopBounds();
  const current = petWindow.getBounds();
  if (
    current.x !== next.x
    || current.y !== next.y
    || current.width !== next.width
    || current.height !== next.height
  ) {
    petWindow.setBounds(next, false);
    // Resizing the window can drop the native region, so never let the
    // skip-identical check above suppress the re-apply.
    petOverlayShapeSignature = null;
    if (petOverlayDragging) applyPetOverlayDragShape();
    else restorePetOverlayShape();
  }
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

// While dragging, the pet moves with the native cursor poll rather than with
// DOM pointer events, so the native region only has to stay under the cursor
// well enough for the final mouse-up to land on the pet. Re-shaping on every
// 16ms tick meant up to 60 SetWindowRgn calls a second on top of everything
// else the drag was doing; coalescing to ~40ms keeps the region close enough
// (regions carry 18px of padding) and leaves the main process responsive.
const PET_DRAG_SHAPE_INTERVAL_MS = 40;

function applyPetOverlayDragShape() {
  if (petOverlayDragShapeTimer) return;
  const elapsed = Date.now() - petOverlayDragShapeAt;
  if (elapsed >= PET_DRAG_SHAPE_INTERVAL_MS) {
    flushPetOverlayDragShape();
    return;
  }
  // Always schedule the trailing apply, so the region ends the drag matching
  // where the pet actually stopped rather than one tick behind it.
  petOverlayDragShapeTimer = setTimeout(
    flushPetOverlayDragShape,
    PET_DRAG_SHAPE_INTERVAL_MS - elapsed
  );
  petOverlayDragShapeTimer.unref?.();
}

// Grown around the pet only while dragging. The shape is what decides whether
// the overlay receives mouse input at all, so if the cursor gets ahead of it the
// window stops seeing events — including the mouse-up that ends the drag. The
// pet then stays welded to the cursor and the next click does nothing, which is
// what "can't move them sometimes" looks like from the outside. A wide collar
// costs nothing (those pixels are transparent) and makes the cursor escaping
// between two shape updates effectively impossible.
const PET_DRAG_HIT_MARGIN = 220;

function inflateRegion(region, margin, bounds) {
  const x = Math.max(0, region.x - margin);
  const y = Math.max(0, region.y - margin);
  const right = Math.min(bounds.width, region.x + region.width + margin);
  const bottom = Math.min(bounds.height, region.y + region.height + margin);
  if (right <= x || bottom <= y) return null;
  return { x, y, width: right - x, height: bottom - y };
}

function flushPetOverlayDragShape() {
  if (petOverlayDragShapeTimer) {
    clearTimeout(petOverlayDragShapeTimer);
    petOverlayDragShapeTimer = null;
  }
  if (!petOverlayDragging || !petWindow || petWindow.isDestroyed()) return;
  petOverlayDragShapeAt = Date.now();
  const bounds = petWindow.getBounds();
  const regions = [...petOverlayDragStartRegions, ...petOverlayHitRegions]
    .map((region) => inflateRegion(region, PET_DRAG_HIT_MARGIN, bounds))
    .filter(Boolean);
  if (regions.length > 0) applyPetOverlayShape(regions, true);
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
  const bounds = petWindow.getBounds();
  return {
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
  petOverlayDragTimer = setInterval(sendCursor, 16);
  petOverlayDragTimer.unref?.();
  return previousPoint;
}

function finishPetOverlayDrag() {
  stopPetOverlayCursorTracking();
  if (petOverlayDragShapeTimer) {
    clearTimeout(petOverlayDragShapeTimer);
    petOverlayDragShapeTimer = null;
  }
  if (!petOverlayDragging) return;
  petOverlayDragging = false;
  petOverlayDragStartRegions = [];
  // The drag shape was the union of where the pet started and where it is now.
  // Collapsing back to just the pet is a real change, so it must not be skipped
  // by the identical-geometry check if the pet happened to end where it began.
  petOverlayShapeSignature = null;
  restorePetOverlayShape();
}

function createPetOverlayWindow() {
  if (petWindow && !petWindow.isDestroyed()) return petWindow;
  const desktopBounds = virtualDesktopBounds();

  petWindow = new BrowserWindow({
    ...desktopBounds,
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
      backgroundThrottling: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  petWindow.setAlwaysOnTop(true, "floating");
  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.setIgnoreMouseEvents(true, { forward: true });
  void petWindow.loadURL(`http://localhost:${PORT}/?pet-overlay=1`).catch((error) => {
    console.error("[pet] unable to load overlay:", error?.message ?? error);
  });
  petWindow.on("closed", () => {
    stopPetOverlayCursorTracking();
    petWindow = null;
    petOverlayUsesShape = false;
    petOverlayDragging = false;
    petOverlayDragStartRegions = [];
    petOverlayHitRegions = [];
    petOverlayShapeSignature = null;
  });
  petWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  return petWindow;
}

function setPetOverlayVisible(visible) {
  if (!visible) {
    finishPetOverlayDrag();
    petWindow?.hide();
    return;
  }
  const overlay = createPetOverlayWindow();
  syncPetOverlayBounds();
  overlay.setAlwaysOnTop(true, "floating");
  overlay.showInactive();
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
  createPetOverlayWindow();

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

  autoUpdater.on("error", (err) => console.error("[updater] error:", err?.message ?? err));
  autoUpdater.on("checking-for-update", () => console.log("[updater] checking for updates…"));
  autoUpdater.on("update-available", (info) => console.log("[updater] update available:", info.version));
  autoUpdater.on("update-not-available", () => console.log("[updater] already up to date"));
  autoUpdater.on("download-progress", (p) => console.log(`[updater] downloading ${Math.round(p.percent)}%`));
  autoUpdater.on("update-downloaded", (info) => {
    console.log("[updater] update downloaded:", info.version, "— will install on quit");
    // Let the app show a subtle "Update ready, restart to apply" hint if it wants.
    mainWindow?.webContents.send("update:downloaded", info.version);
  });

  autoUpdater.checkForUpdatesAndNotify().catch((e) => console.error("[updater] check failed:", e?.message ?? e));
  // Re-check periodically for long-running sessions.
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 60 * 60 * 1000);
}

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

ipcMain.on("pet-overlay:set-hit-regions", (event, regions) => {
  if (!eventCameFrom(event, petWindow) || !petWindow || petWindow.isDestroyed()) return;
  if (process.platform !== "win32" && process.platform !== "linux") return;
  if (!Array.isArray(regions) || regions.length === 0) return;

  const overlayBounds = petWindow.getBounds();
  const safeRegions = regions
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
      ) return null;

      const x = Math.max(0, Math.floor(rawX));
      const y = Math.max(0, Math.floor(rawY));
      const right = Math.min(overlayBounds.width, Math.ceil(rawX + rawWidth));
      const bottom = Math.min(overlayBounds.height, Math.ceil(rawY + rawHeight));
      if (right <= x || bottom <= y) return null;
      return { x, y, width: right - x, height: bottom - y };
    })
    .filter(Boolean);

  if (safeRegions.length === 0) return;
  petOverlayHitRegions = safeRegions;
  // Pixels outside these rectangles are neither drawn nor interactive. While
  // dragging, retain the starting region alongside the moving region so the
  // native hit area follows the mascot without requiring a desktop-sized shape.
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
  // A desktop-sized Windows region is rejected on some systems. Keep the
  // current small region alive, poll the native cursor, and let renderer shape
  // updates move the interactive region with the mascot during the drag.
  try {
    petOverlayDragging = true;
    petOverlayDragStartRegions = [...petOverlayHitRegions];
    const point = startPetOverlayCursorTracking();
    event.returnValue = {
      started: true,
      x: point?.x,
      y: point?.y,
    };
  } catch (error) {
    petOverlayDragging = false;
    petOverlayDragStartRegions = [];
    stopPetOverlayCursorTracking();
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
    },
    options: {
      durationMs: Number.isFinite(durationMs) ? durationMs : undefined,
    },
  });
});

app.whenReady().then(async () => {
  await createWindow();
  screen.on("display-added", syncPetOverlayBounds);
  screen.on("display-removed", syncPetOverlayBounds);
  screen.on("display-metrics-changed", syncPetOverlayBounds);
  setupAutoUpdate();
});

// macOS: re-create a window when the dock icon is clicked and none are open.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed, except on macOS where apps stay alive.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
