import { useSyncExternalStore } from "react";
import { DIRECTION_CHANGE_EVENT, learningEnglish } from "@/lib/direction";
import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-interface-language";
export const INTERFACE_LANGUAGE_CHANGE_EVENT = "gl-interface-language-change";

/**
 * Which language the app itself is written in.
 *
 * This used to be derived from the course: learning English meant a German
 * interface, learning German meant an English one. That reads as sensible
 * until two real people try to use it. A German speaker learning English
 * wanted her app in English — the language she is practising, which is rather
 * the point. An English speaker learning German wanted his app in German for
 * the same reason. Neither setup existed, because one setting was answering
 * two different questions.
 *
 * "auto" keeps the old derivation, so nobody's app changes language because
 * this shipped.
 */
export type InterfaceLanguage = "auto" | "en" | "de";

let inMemory: InterfaceLanguage = "auto";

export function getInterfaceLanguage(): InterfaceLanguage {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = localStorage.getItem(KEY);
    inMemory = stored === "en" || stored === "de" ? stored : "auto";
  } catch {
    // Keep the in-memory preference when browser storage is blocked.
  }
  return inMemory;
}

/** The language actually in force, with "auto" resolved against the course. */
export function resolveInterfaceLanguage(): "en" | "de" {
  const chosen = getInterfaceLanguage();
  if (chosen !== "auto") return chosen;
  return learningEnglish() ? "de" : "en";
}

export function setInterfaceLanguage(language: InterfaceLanguage) {
  inMemory = language;
  try {
    localStorage.setItem(KEY, language);
  } catch {
    // The in-memory preference still updates even if storage is blocked.
  }
  syncLocalStorageItem(KEY, language);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<InterfaceLanguage>(INTERFACE_LANGUAGE_CHANGE_EVENT, { detail: language }));
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) onStoreChange();
  };
  window.addEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, onChange);
  // On "auto" the answer depends on the course, so a direction change is also
  // a change of interface language.
  window.addEventListener(DIRECTION_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  // Profile hydration writes localStorage in this window, where `storage` does
  // not fire, and announces the finished batch with this event instead.
  window.addEventListener("storage-sync-completed", onChange);
  return () => {
    window.removeEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, onChange);
    window.removeEventListener(DIRECTION_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("storage-sync-completed", onChange);
  };
}

/**
 * Subscribe the tree to the interface language.
 *
 * ui() is a plain lookup read during render, so nothing re-runs on its own
 * when the language changes. Calling this near the root is what turns a
 * setting change into a re-render instead of a reload.
 */
export function useInterfaceLanguage(): "en" | "de" {
  return useSyncExternalStore(subscribe, resolveInterfaceLanguage, () => "en");
}
