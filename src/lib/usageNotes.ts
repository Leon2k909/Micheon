import { useSyncExternalStore } from "react";
import { resolveInterfaceLanguage, INTERFACE_LANGUAGE_CHANGE_EVENT } from "@/lib/interfaceLanguage";

/**
 * The little line under a card that says when to use it.
 *
 * Fourteen thousand of them, written in English because the app was written
 * in English. The app is written in six languages now, and every one of them
 * was showing this line in English: a Portuguese reader got the card in
 * Portuguese and the explanation of it in a language nobody promised them.
 *
 * They are not interface strings. An interface string is one of about three
 * thousand short labels that every screen needs; these are fourteen thousand
 * sentences that only the screens showing a card need, and only for the card
 * in front of you. Putting them in the interface tables would have tripled
 * what an app downloads to say "Weiter" in the right language.
 *
 * So they load like the interface tables and separately from them: one file
 * per language, fetched the first time a screen wants a note, and never at
 * all for a reader who stays in English. Until the file lands — and for any
 * note not yet in it — the English is shown, which is exactly what shipped
 * before this existed. Nothing is ever blank.
 */
type UsageNoteTable = Record<string, string>;

const LOADERS: Record<string, () => Promise<UsageNoteTable>> = {
  de: () => import("@/lib/usageNotesDe").then((m) => m.USE_DE),
  fr: () => import("@/lib/usageNotesFr").then((m) => m.USE_FR),
  pl: () => import("@/lib/usageNotesPl").then((m) => m.USE_PL),
  es: () => import("@/lib/usageNotesEs").then((m) => m.USE_ES),
  it: () => import("@/lib/usageNotesIt").then((m) => m.USE_IT),
  pt: () => import("@/lib/usageNotesPt").then((m) => m.USE_PT),
};

const USAGE_NOTES_READY_EVENT = "gl-usage-notes-ready";

const TABLES: Record<string, UsageNoteTable> = {};
const inFlight = new Map<string, Promise<unknown>>();
/** Bumped whenever a table lands, so a screen showing notes redraws once. */
let revision = 0;

function currentLanguage(): string {
  return resolveInterfaceLanguage();
}

/**
 * Have the notes for a language, if it needs them.
 *
 * English is the language they are written in and has no table. A failed
 * fetch leaves the English in place and lets the next ask try again: a note
 * nobody can read beats a card that will not draw.
 */
function ensureUsageNotes(language: string = currentLanguage()): Promise<unknown> {
  if (language === "en" || TABLES[language] || !LOADERS[language]) return Promise.resolve();
  const already = inFlight.get(language);
  if (already) return already;
  const request = LOADERS[language]()
    .then((table) => {
      TABLES[language] = table;
      inFlight.delete(language);
      revision += 1;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent<string>(USAGE_NOTES_READY_EVENT, { detail: language }));
      }
    })
    .catch((error) => {
      inFlight.delete(language);
      console.error("usage notes:", error);
    });
  inFlight.set(language, request);
  return request;
}

/**
 * The note in the app's language, or the English it was written in.
 *
 * Read during render and therefore synchronous, like ui(). A miss is the
 * English text rather than an empty line, which is what makes it safe to fill
 * the tables in batches: a half-translated table is a screen that is half
 * translated, not one that is half missing.
 */
export function usageNote(text: string | undefined | null): string {
  const source = String(text ?? "");
  if (!source) return source;
  const table = TABLES[currentLanguage()];
  return (table && table[source]) || source;
}

/**
 * Subscribe a screen to the notes arriving.
 *
 * usageNote() is a plain lookup, so a table that lands after the first paint
 * reaches a screen that has no reason to redraw. A component that shows notes
 * calls this once and redraws when they come — and asks for them while it is
 * at it, so nothing else has to remember to.
 */
export function useUsageNotes(): number {
  return useSyncExternalStore(
    (onChange) => {
      void ensureUsageNotes();
      const refresh = () => { void ensureUsageNotes(); onChange(); };
      window.addEventListener(USAGE_NOTES_READY_EVENT, onChange);
      window.addEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, refresh);
      return () => {
        window.removeEventListener(USAGE_NOTES_READY_EVENT, onChange);
        window.removeEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, refresh);
      };
    },
    () => revision,
    () => 0
  );
}

