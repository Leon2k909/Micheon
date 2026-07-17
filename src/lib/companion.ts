const KEY = "gl-companion";

/** The optional second language shown/tested alongside German. */
export type Companion = "none" | "fr";

export const COMPANION_LABEL: Record<Exclude<Companion, "none">, string> = {
  fr: "French",
};

export function getCompanion(): Companion {
  return "none";
}

export function setCompanion(c: Companion) {
  // disabled for now
}

/** True when a second language is active. */
export function companionActive(): boolean {
  return false;
}
