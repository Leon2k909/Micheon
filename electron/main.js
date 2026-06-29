// Electron desktop wrapper for germ.
//
// It reuses the exact same web app: the bundled Express server (server/index.js)
// serves the built front-end AND the /api/tts endpoint, and this main process
// just starts that server and points a window at it. So the desktop build behaves
// identically to the website — including the premium Microsoft TTS voices, which
// work here because the server runs locally inside the app.

import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { startServer } from "../server/index.js";

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
    title: "German Lab",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "public", "favicon.svg"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

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

app.whenReady().then(createWindow);

// macOS: re-create a window when the dock icon is clicked and none are open.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed, except on macOS where apps stay alive.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
