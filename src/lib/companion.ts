const KEY = "gl-companion";

/** The optional second language shown/tested alongside German. */
export type Companion = "none" | "fr";

export const COMPANION_LABEL: Record<Exclude<Companion, "none">, string> = {
  fr: "French",
};

export function getCompanion(): Companion {
  if (typeof window === "undefined") return "none";
  return localStorage.getItem(KEY) === "fr" ? "fr" : "none";
}

export function setCompanion(c: Companion) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, c);
}

/** True when a second language is active. */
export function companionActive(): boolean {
  return getCompanion() !== "none";
}
