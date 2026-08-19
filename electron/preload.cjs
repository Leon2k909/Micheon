// Preload bridge: safely exposes a tiny window-control API to the renderer so the
// custom title bar (src/components/TitleBar.tsx) can drive the frameless window.
// contextIsolation is on, so the renderer only ever sees this whitelisted surface.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("germDesktop", {
  minimize: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
  getWindowsSettings: () => ipcRenderer.invoke("windows-settings:get"),
  setLaunchAtLogin: (enabled) =>
    ipcRenderer.invoke("windows-settings:set-launch-at-login", Boolean(enabled)),
  setCloseBehavior: (behavior) =>
    ipcRenderer.invoke("windows-settings:set-close-behavior", behavior),
  // Remembers the resolved theme so the next launch opens the native window
  // in the right colour instead of flashing white at a dark-mode learner.
  setDesktopTheme: (theme) =>
    ipcRenderer.invoke("windows-settings:set-theme", theme),
  // Main-window zoom. All changes route through the main process so every
  // path (these calls, Ctrl+=/-/0, Ctrl+wheel) walks the same ladder and the
  // mascot windows are re-pinned. Each resolves to the applied factor.
  getZoomFactor: () => ipcRenderer.invoke("zoom:get"),
  setZoomFactor: (factor) => ipcRenderer.invoke("zoom:set", Number(factor)),
  stepZoom: (direction) => ipcRenderer.invoke("zoom:step", direction),
  onZoomChanged: (cb) => {
    const handler = (_e, factor) => cb(factor);
    ipcRenderer.on("zoom:changed", handler);
    return () => ipcRenderer.removeListener("zoom:changed", handler);
  },
  // Subscribe to maximize/unmaximize so the button icon can swap. Returns an
  // unsubscribe function.
  onMaximizeChange: (cb) => {
    const handler = (_e, value) => cb(value);
    ipcRenderer.on("window:maximize-change", handler);
    return () => ipcRenderer.removeListener("window:maximize-change", handler);
  },
  // Native Windows media controls for Listen mode. The renderer remains the
  // source of truth; Electron only mirrors its state into taskbar buttons and
  // forwards media-key/button commands back to the mounted player.
  setListenMediaState: (state) => ipcRenderer.send("listen-media:set-state", {
    available: state?.available === true,
    playing: state?.playing === true,
    subtitle: typeof state?.subtitle === "string" ? state.subtitle.slice(0, 240) : "",
    title: typeof state?.title === "string" ? state.title.slice(0, 240) : "",
  }),
  onListenMediaCommand: (cb) => {
    const handler = (_event, command) => cb(command);
    ipcRenderer.on("listen-media:command", handler);
    return () => ipcRenderer.removeListener("listen-media:command", handler);
  },
  // Auto-update: fires with the new version once an update has finished
  // downloading (it will also install automatically on next quit). Returns an
  // unsubscribe function. installUpdate() restarts and applies it right away.
  onUpdateDownloaded: (cb) => {
    const handler = (_e, version) => cb(version);
    ipcRenderer.on("update:downloaded", handler);
    return () => ipcRenderer.removeListener("update:downloaded", handler);
  },
  installUpdate: () => ipcRenderer.send("update:install-now"),
  // Ask outright rather than waiting to be told. The download can finish before
  // the window is even open, and then the one-shot toast above has nothing left
  // to announce.
  getUpdateStatus: () => ipcRenderer.invoke("update:get-status"),
  checkForUpdateNow: () => ipcRenderer.invoke("update:check-now"),
  // How much room Micheon takes on disk, and the one part of it that is
  // safe to clear.
  getStorageUsage: () => ipcRenderer.invoke("storage:get-usage"),
  clearAppCache: () => ipcRenderer.invoke("storage:clear-cache"),
  // Copies the bundled companion browser extension to a stable folder and
  // opens it in Explorer -- removes the manual unzip step. With a browser
  // id it also launches that browser and puts its extensions-page address
  // in the clipboard. Resolves { ok, path, address }; no browser lets this
  // go further (Developer mode and Load unpacked still have to be the
  // learner's own click, by design). The result includes the exact copied
  // version and the version that was in the stable folder beforehand so the
  // UI can distinguish first-time loading from Brave's required Reload step.
  installBrowserExtension: (browserId) => ipcRenderer.invoke("extension:install", browserId ?? null),
  getBrowserExtensionInfo: () => ipcRenderer.invoke("extension:info"),
  // Which of Chrome, Edge and Brave are actually installed on this machine.
  listExtensionBrowsers: () => ipcRenderer.invoke("extension:browsers"),
  // How updates should arrive, whether they are postponed, and whether the
  // panel narrates them at all.
  setUpdatePreferences: (preferences) =>
    ipcRenderer.invoke("update:set-preferences", preferences),
  downloadUpdateNow: () => ipcRenderer.invoke("update:download-now"),
  onUpdateStatus: (cb) => {
    const handler = (_e, status) => cb(status);
    ipcRenderer.on("update:status", handler);
    return () => ipcRenderer.removeListener("update:status", handler);
  },
  setPetDisplayMode: (mode) => ipcRenderer.send("pet-overlay:set-display-mode", mode),
  onPetDisplayModeChange: (cb) => {
    const handler = (_event, mode) => cb(mode);
    ipcRenderer.on("pet-overlay:display-mode", handler);
    return () => ipcRenderer.removeListener("pet-overlay:display-mode", handler);
  },
  setPetOverlayVisible: (visible) => ipcRenderer.send("pet-overlay:set-visible", Boolean(visible)),
  onPetAppFocusChange: (cb) => {
    const handler = (_event, focused) => cb(Boolean(focused));
    ipcRenderer.on("pet-overlay:app-focused", handler);
    return () => ipcRenderer.removeListener("pet-overlay:app-focused", handler);
  },
  openPetHistory: (mascotBounds) => ipcRenderer.send("pet-history:open", mascotBounds),
  closePetHistory: () => ipcRenderer.send("pet-history:close"),
  setPetHistoryAnchor: (mascotBounds) =>
    ipcRenderer.send("pet-overlay:set-history-anchor", mascotBounds),
  setPetOverlayInteractive: (interactive) => ipcRenderer.send("pet-overlay:set-interactive", Boolean(interactive)),
  petOverlayHitRegionsSupported: process.platform === "win32" || process.platform === "linux",
  getPetOverlayGeometry: () => ipcRenderer.sendSync("pet-overlay:get-geometry"),
  onPetOverlayGeometry: (cb) => {
    const handler = (_event, geometry) => cb(geometry);
    ipcRenderer.on("pet-overlay:geometry", handler);
    return () => ipcRenderer.removeListener("pet-overlay:geometry", handler);
  },
  acknowledgePetOverlayGeometry: (revision) =>
    ipcRenderer.send("pet-overlay:geometry-applied", Number(revision)),
  setPetOverlayHitRegions: (regions, origin) => ipcRenderer.send(
    "pet-overlay:set-hit-regions",
    { origin, regions }
  ),
  beginPetOverlayDrag: () => ipcRenderer.sendSync("pet-overlay:begin-drag"),
  endPetOverlayDrag: () => ipcRenderer.send("pet-overlay:end-drag"),
  onPetOverlayDragCursor: (cb) => {
    const handler = (_event, point) => cb(point);
    ipcRenderer.on("pet-overlay:drag-cursor", handler);
    return () => ipcRenderer.removeListener("pet-overlay:drag-cursor", handler);
  },
  onPetOverlayDragEnd: (cb) => {
    const handler = () => cb();
    ipcRenderer.on("pet-overlay:drag-ended", handler);
    return () => ipcRenderer.removeListener("pet-overlay:drag-ended", handler);
  },
  // Fires when the overlay window is shown. Until the renderer reports its hit
  // regions the window has no shape and stays completely click-through, so a
  // show that lands before the pet has rendered would otherwise leave a pet
  // that cannot be clicked or dragged at all.
  onPetOverlayResync: (cb) => {
    const handler = () => cb();
    ipcRenderer.on("pet-overlay:resync", handler);
    return () => ipcRenderer.removeListener("pet-overlay:resync", handler);
  },
  setPetOverlayKeyboardInteractive: (interactive) =>
    ipcRenderer.send("pet-overlay:set-keyboard-interactive", Boolean(interactive)),
  relayPetOverlayWheel: (deltaX, deltaY) => ipcRenderer.send("pet-overlay:wheel", deltaX, deltaY),
  onPetOverlayWheel: (cb) => {
    const handler = (_e, deltaX, deltaY) => cb(deltaX, deltaY);
    ipcRenderer.on("pet-overlay:wheel", handler);
    return () => ipcRenderer.removeListener("pet-overlay:wheel", handler);
  },
  sendPetOverlaySpeech: (payload) => {
    const durationMs = Number(payload?.options?.durationMs);
    const message = payload?.message;
    const question = message?.question;
    ipcRenderer.send("pet-overlay:speak", {
      message: {
        createdAt: Number.isFinite(Number(message?.createdAt)) ? Number(message.createdAt) : Date.now(),
        id: typeof message?.id === "string" ? message.id.slice(0, 96) : "",
        mood: typeof message?.mood === "string" ? message.mood : "greeting",
        silent: message?.silent === true,
        question: question && typeof question.itemId === "string"
          ? {
              aliases: Array.isArray(question.aliases)
                ? question.aliases.filter((value) => typeof value === "string").slice(0, 12)
                : [],
              answerLanguage: question.answerLanguage === "en" ? "en" : "de",
              // Without this the overlay's copy loses the flag and treats the
              // confirmation as a fresh question, asking it again forever.
              confirm: question.confirm === true,
              de: typeof question.de === "string" ? question.de.slice(0, 180) : "",
              en: typeof question.en === "string" ? question.en.slice(0, 180) : "",
              itemId: question.itemId.slice(0, 180),
            }
          : undefined,
        text: typeof message?.text === "string" ? message.text.slice(0, 240) : "",
        voiceLang: message?.voiceLang === "de-DE"
          ? "de-DE"
          : message?.voiceLang === "en-US"
            ? "en-US"
            : undefined,
      },
      options: {
        durationMs: Number.isFinite(durationMs) ? durationMs : undefined,
      },
    });
  },
  onPetOverlaySpeech: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on("pet-overlay:speech", handler);
    return () => ipcRenderer.removeListener("pet-overlay:speech", handler);
  },
});
