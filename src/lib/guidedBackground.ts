import { syncLocalStorageItem } from "@/lib/profileStorage";

/** Visual backdrop used behind the focused guided lesson. */
export type GuidedBackground = "monkey" | "garden" | "bubbles" | "atlas" | "dawn" | "plain" | "custom";

const GUIDED_BACKGROUND_KEY = "micheon-guided-background-v1";
const GUIDED_CUSTOM_BACKGROUND_KEY = "micheon-guided-custom-background-v1";
export const GUIDED_BACKGROUND_EVENT = "guided-background-changed";
const MAX_SOURCE_IMAGE_BYTES = 15 * 1024 * 1024;
const CUSTOM_BACKGROUND_MAX_EDGE = 1600;

function readLocal(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // The settings screen keeps its in-memory state even if storage is full.
  }
}

function notify(background: GuidedBackground) {
  syncLocalStorageItem(GUIDED_BACKGROUND_KEY, background);
  window.dispatchEvent(new Event(GUIDED_BACKGROUND_EVENT));
}

export function getGuidedCustomBackground(): string | null {
  const stored = readLocal(GUIDED_CUSTOM_BACKGROUND_KEY);
  return stored?.startsWith("data:image/") ? stored : null;
}

export function getGuidedBackground(): GuidedBackground {
  const stored = readLocal(GUIDED_BACKGROUND_KEY);
  if (stored === "custom" && getGuidedCustomBackground()) return "custom";
  // Anything not on this list falls back, so a new backdrop that is not added
  // here is chosen once and forgotten by the next reload.
  const known = ["monkey", "garden", "bubbles", "atlas", "dawn", "plain"];
  return known.includes(stored ?? "") ? (stored as GuidedBackground) : "monkey";
}

export function setGuidedBackground(background: GuidedBackground) {
  if (typeof window === "undefined") return;
  const next = background === "custom" && !getGuidedCustomBackground() ? "monkey" : background;
  writeLocal(GUIDED_BACKGROUND_KEY, next);
  notify(next);
}

/** Save a compressed copy so a personal lesson scene never bloats the app. */
export async function saveGuidedCustomBackground(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error("Choose an image smaller than 15 MB.");

  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("That image could not be read."));
      element.src = sourceUrl;
    });
    const scale = Math.min(1, CUSTOM_BACKGROUND_MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare that image.");
    context.fillStyle = "#fffaf1";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    writeLocal(GUIDED_CUSTOM_BACKGROUND_KEY, dataUrl);
    setGuidedBackground("custom");
    return dataUrl;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export function clearGuidedCustomBackground() {
  if (typeof window === "undefined") return;
  const wasCustom = getGuidedBackground() === "custom";
  writeLocal(GUIDED_CUSTOM_BACKGROUND_KEY, null);
  if (wasCustom) setGuidedBackground("monkey");
  else window.dispatchEvent(new Event(GUIDED_BACKGROUND_EVENT));
}
