import { useSyncExternalStore } from "react";
import { DIRECTION_CHANGE_EVENT, learningEnglish } from "@/lib/direction";
import { syncLocalStorageItem } from "@/lib/profileStorage";

const KEY = "gl-interface-language";
export const INTERFACE_LANGUAGE_CHANGE_EVENT = "gl-interface-language-change";
/**
 * A table for some language has arrived.
 *
 * The tables are downloaded per language now, so the language changing and
 * the app being able to speak it are two separate moments. This is the second
 * one. It is declared here rather than in i18n.ts so that the dependency
 * stays one-way: i18n reads this file already.
 */
export const INTERFACE_STRINGS_READY_EVENT = "gl-interface-strings-ready";

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
 *
 * French is a third choice rather than a third derivation: no course makes the
 * app French on its own, because the people learning French from here are
 * reading German or English while they do it. It is chosen, or it is not.
 */
export type InterfaceLanguage = "auto" | "en" | "de" | "fr" | "pl" | "es" | "it" | "pt";

/** The languages the app itself can be written in, without "auto". */
export type ResolvedInterfaceLanguage = "en" | "de" | "fr" | "pl" | "es" | "it" | "pt";

/**
 * The app languages, as a list rather than as options typed out twice.
 *
 * They were written inline in two separate `<select>`s — the settings page and
 * the profile sheet — so adding one meant editing both and nothing said if you
 * forgot. `search` carries the names a person might type instead of the one on
 * the button: somebody looking for Spanish is as likely to type "spanish" or
 * "espanol" (no accent, because the keyboard they are typing on is the reason
 * they are looking for this setting) as "Español".
 *
 * IN ALPHABETICAL ORDER, by the name on the row. The list is what the picker
 * draws and what a search filters, both in this order, so the order here is
 * the order on screen — and a list somebody has to read top to bottom to find
 * their own language in is a list that got longer than its arrangement.
 *
 * By the name on the ROW, which is each language's own name for itself. That
 * is the same word in every interface language, so unlike the course list this
 * one sorts once here rather than per locale at render.
 */
export const INTERFACE_LANGUAGES: ReadonlyArray<{
  value: ResolvedInterfaceLanguage;
  /** The language's own name, which is what a speaker of it looks for. */
  label: string;
  search: readonly string[];
}> = [
  { value: "de", label: "Deutsch", search: ["german", "deutsch", "allemand", "niemiecki", "aleman", "alemán"] },
  { value: "en", label: "English", search: ["english", "englisch", "anglais", "angielski", "ingles", "inglés"] },
  { value: "es", label: "Español", search: ["spanish", "spanisch", "espagnol", "hiszpański", "hiszpanski", "espanol", "español", "castellano"] },
  { value: "fr", label: "Français", search: ["french", "französisch", "francais", "français", "francuski", "frances", "francés"] },
  { value: "it", label: "Italiano", search: ["italian", "italienisch", "italien", "włoski", "wloski", "italiano"] },
  { value: "pl", label: "Polski", search: ["polish", "polnisch", "polonais", "polski", "polaco"] },
  { value: "pt", label: "Português", search: ["portuguese", "portugiesisch", "portugais", "portugalski", "portugues", "português", "brasileiro", "brazilian"] },
];

const INTERFACE_LANGUAGE_VALUES = new Set<string>(INTERFACE_LANGUAGES.map((entry) => entry.value));

/**
 * Which languages a typed query matches, in the list's own order.
 *
 * Accents are folded on both sides, so "espanol" finds Español and "francais"
 * finds Français — the search box is most useful to somebody whose keyboard
 * does not make the character in the name they are looking for.
 */
export function searchInterfaceLanguages(query: string): typeof INTERFACE_LANGUAGES {
  const fold = (value: string) => value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
  const needle = fold(query);
  if (!needle) return INTERFACE_LANGUAGES;
  return INTERFACE_LANGUAGES.filter((entry) =>
    fold(entry.label).includes(needle)
    || entry.search.some((name) => fold(name).includes(needle))
    || fold(entry.value) === needle);
}

let inMemory: InterfaceLanguage = "auto";

export function getInterfaceLanguage(): InterfaceLanguage {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = localStorage.getItem(KEY);
    // Against the list, so a language added to it is one this accepts back
    // out of storage — written as a chain of comparisons, adding Spanish to
    // the picker would have stored "es" and read it back as "auto" forever.
    inMemory = stored && INTERFACE_LANGUAGE_VALUES.has(stored) ? (stored as InterfaceLanguage) : "auto";
  } catch {
    // Keep the in-memory preference when browser storage is blocked.
  }
  return inMemory;
}

/** The language actually in force, with "auto" resolved against the course. */
export function resolveInterfaceLanguage(): ResolvedInterfaceLanguage {
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

/**
 * How many tables have landed since the app started.
 *
 * The snapshot below carries it because the LANGUAGE does not change when its
 * table arrives — it was already "fr". React compares snapshots to decide
 * whether to re-render, so without this the table lands into an app that
 * never redraws and the screen stays in the English it fell back to.
 */
let stringsArrived = 0;

/** The language in force, and whether anything has arrived since. */
function currentSnapshot(): string {
  return `${resolveInterfaceLanguage()}|${stringsArrived}`;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => onStoreChange();
  const onStringsReady = () => {
    stringsArrived += 1;
    onStoreChange();
  };
  window.addEventListener(INTERFACE_STRINGS_READY_EVENT, onStringsReady);
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
    window.removeEventListener(INTERFACE_STRINGS_READY_EVENT, onStringsReady);
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
export function useInterfaceLanguage(): ResolvedInterfaceLanguage {
  const snapshot = useSyncExternalStore(subscribe, currentSnapshot, () => "en|0");
  // Named, not spelled out: written as a literal union it was still "en" | "de"
  // | "fr" | "pl" two languages after Spanish and Portuguese shipped, so a
  // caller switching on the result had no case for either and TypeScript
  // agreed with it.
  return snapshot.slice(0, snapshot.indexOf("|")) as ResolvedInterfaceLanguage;
}
