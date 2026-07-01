/** True when running inside the Electron desktop app (the preload bridge only exists there). */
export function isElectronApp(): boolean {
  return typeof window !== "undefined" && Boolean((window as any).germDesktop);
}
