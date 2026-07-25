// Preload bridge: safely exposes a tiny window-control API to the renderer so the
// custom title bar (src/components/TitleBar.tsx) can drive the frameless window.
// contextIsolation is on, so the renderer only ever sees this whitelisted surface.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("germDesktop", {
  minimize: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
  // Subscribe to maximize/unmaximize so the button icon can swap. Returns an
  // unsubscribe function.
  onMaximizeChange: (cb) => {
    const handler = (_e, value) => cb(value);
    ipcRenderer.on("window:maximize-change", handler);
    return () => ipcRenderer.removeListener("window:maximize-change", handler);
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
  setPetOverlayVisible: (visible) => ipcRenderer.send("pet-overlay:set-visible", Boolean(visible)),
  setPetOverlayInteractive: (interactive) => ipcRenderer.send("pet-overlay:set-interactive", Boolean(interactive)),
  petOverlayHitRegionsSupported: process.platform === "win32" || process.platform === "linux",
  setPetOverlayHitRegions: (regions) => ipcRenderer.send("pet-overlay:set-hit-regions", regions),
  beginPetOverlayDrag: () => ipcRenderer.sendSync("pet-overlay:begin-drag"),
  endPetOverlayDrag: () => ipcRenderer.send("pet-overlay:end-drag"),
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
        text: typeof message?.text === "string" ? message.text.slice(0, 240) : "",
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
