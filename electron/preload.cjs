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
});
