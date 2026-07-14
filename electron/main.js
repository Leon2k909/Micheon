// Electron desktop wrapper for germ.
//
// It reuses the exact same web app: the bundled Express server (server/index.js)
// serves the built front-end AND the /api/tts endpoint, and this main process
// just starts that server and points a window at it. So the desktop build behaves
// identically to the website — including the premium Microsoft TTS voices, which
// work here because the server runs locally inside the app.

import { app, BrowserWindow, shell, ipcMain } from "electron";
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

async function createWindow() {
  // Boot the embedded web + TTS server first, then load it.
  await startServer(PORT);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 880,
    minHeight: 600,
    backgroundColor: "#0b0b0f",
    title: "Learn German",
    // Frameless: we draw our own title bar in the app (src/components/TitleBar.tsx)
    // for a clean, on-brand look like Discord/Slack.
    frame: false,
    icon: path.join(__dirname, "..", "public", "favicon.svg"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

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

app.whenReady().then(async () => {
  await createWindow();
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
