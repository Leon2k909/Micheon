import { DIRECTION_CHANGE_EVENT } from "@/lib/direction";
import {
  INTERFACE_LANGUAGE_CHANGE_EVENT,
  INTERFACE_STRINGS_READY_EVENT,
  resolveInterfaceLanguage,
} from "@/lib/interfaceLanguage";

/**
 * The interface tables, fetched when the interface is in that language.
 *
 * English is the source key, so an English app needs no table at all — and it
 * used to download every other language's anyway. Both tables were static
 * imports and landed in a chunk the entry pulls in: 235 KB of German and
 * 227 KB of French, on every start, for a reader using neither. With more
 * interface languages coming, that grows by roughly 230 KB each.
 *
 * ui() is called from render and stays synchronous. A table not yet here
 * gives the English key back, which is what a missing string already did —
 * so the failure mode is unchanged, and main.tsx waits for the table before
 * the first render so nobody sees it.
 *
 * Both tables live in their own files for this reason. German was written
 * inline here, which meant it loaded with ui() — and ui() is imported by every
 * screen there is, so there was no arrangement of chunks that could leave it
 * out. Moving it was the whole fix; nothing about the entries changed.
 */
const UI_LOADERS: Record<string, () => Promise<Record<string, string>>> = {
  de: () => import("@/lib/i18nDe").then((m) => m.DE),
  fr: () => import("@/lib/i18nFr").then((m) => m.FR),
  pl: () => import("@/lib/i18nPl").then((m) => m.PL),
  es: () => import("@/lib/i18nEs").then((m) => m.ES),
  it: () => import("@/lib/i18nIt").then((m) => m.IT),
  pt: () => import("@/lib/i18nPt").then((m) => m.PT),
};

const UI_TABLES: Record<string, Record<string, string>> = {};
const uiInFlight = new Map<string, Promise<unknown>>();

/**
 * Have the table for an interface language, if it needs one.
 *
 * Resolves immediately for English, which is the source language and has no
 * table at all. Awaited before the first render, so the only app that waits is
 * one that is not written in English.
 */
export function ensureInterfaceStrings(language: string): Promise<unknown> {
  if (UI_TABLES[language] || !UI_LOADERS[language]) return Promise.resolve();
  const already = uiInFlight.get(language);
  if (already) return already;
  const request = UI_LOADERS[language]()
    .then((table) => {
      UI_TABLES[language] = table;
      uiInFlight.delete(language);
      // ui() is a plain lookup read during render, so nothing re-reads it on
      // its own. Without this the table arrives into a screen that never
      // redraws, and the fallback English stays on it.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent<string>(INTERFACE_STRINGS_READY_EVENT, { detail: language }));
      }
    })
    // A failed fetch shows English rather than nothing, and lets the next ask
    // try again. Never a blank screen over a translation.
    .catch((error) => { uiInFlight.delete(language); console.error("interface strings:", error); });
  uiInFlight.set(language, request);
  return request;
}


/**
 * Fetch the table for whatever language is in force now, whenever that changes.
 *
 * main.tsx fetches the one the app STARTS in, which was the whole job while
 * both tables were compiled in and therefore always present. Downloaded per
 * language, the language can change to one whose table was never fetched —
 * from the picker in settings, or from switching course while the interface
 * follows the course — and ui() then answers with its English key. The app
 * turned English and stayed English until it was restarted, in whichever
 * language was chosen next.
 *
 * These are the same four events the interface-language store subscribes to,
 * deliberately: the fetch must not be triggered by fewer things than the
 * re-render, or the app redraws in English while the table it needs is never
 * asked for.
 */
if (typeof window !== "undefined") {
  const follow = () => { void ensureInterfaceStrings(resolveInterfaceLanguage()); };
  window.addEventListener(INTERFACE_LANGUAGE_CHANGE_EVENT, follow);
  window.addEventListener(DIRECTION_CHANGE_EVENT, follow);
  window.addEventListener("storage-sync-completed", follow);
  window.addEventListener("storage", follow);
}

/**
 * The table for the language in force, or null when the app is in English.
 *
 * English is the source language, so it has no table: a key IS its English
 * text. Every other language is one lookup away, which is why adding French
 * was a table and a line here rather than a second code path.
 */
function table(): Record<string, string> | null {
  // Null until the table lands, which reads as the English key — the same
  // thing a missing string has always given. main.tsx waits for it first.
  return UI_TABLES[resolveInterfaceLanguage()] ?? null;
}

/** Translate a UI string into the learner's interface language. */
export function ui(s: string): string {
  const chosen = table();
  return chosen ? chosen[s] ?? s : s;
}

/**
 * Translate a pattern that has values in it.
 *
 * Wrapping only the static fragments of a template would freeze English word
 * order, and German rarely wants the number in the same place. The whole
 * sentence is one key with named slots, so the translation decides where the
 * values go.
 */
export function uiFmt(pattern: string, values: Record<string, string | number>): string {
  return ui(pattern).replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

export type UiPart = { kind: "text"; value: string } | { kind: "slot"; name: string };

/**
 * A translated sentence, broken at its slots so markup can go inside it.
 *
 * Some sentences have a bold number or a coloured stage name in the middle
 * of them. Those were written as a German block of JSX beside an English
 * one, which reads fine until a third language arrives and there is nowhere
 * to put it. Splitting the translated sentence instead keeps ONE key for the
 * whole thing — so the translation decides where the bold part goes, which
 * is the entire reason uiFmt exists — and hands the pieces back for the
 * caller to wrap. <UiText> is the component that does the wrapping.
 */
export function uiParts(pattern: string): UiPart[] {
  const translated = ui(pattern);
  const parts: UiPart[] = [];
  let cursor = 0;
  for (const match of translated.matchAll(/\{(\w+)\}/g)) {
    const at = match.index ?? 0;
    if (at > cursor) parts.push({ kind: "text", value: translated.slice(cursor, at) });
    parts.push({ kind: "slot", name: match[1] });
    cursor = at + match[0].length;
  }
  if (cursor < translated.length) parts.push({ kind: "text", value: translated.slice(cursor) });
  return parts;
}

/**
 * Translate UI copy, replacing unmapped English metadata with a German fallback.
 *
 * The fallback is content metadata rather than interface copy — a theme name
 * out of the catalogue — so there is no English key to translate and the
 * German is written at the call site. French cannot be written there without
 * a second argument at fourteen call sites, so the GERMAN fallback doubles as
 * a key: the French table holds those few German strings and answers for
 * them. If it does not, the German shows, which is what happened before
 * French existed anyway.
 */
export function uiOr(s: string, germanFallback: string): string {
  const language = resolveInterfaceLanguage();
  // Both tables come through the same map ui() reads. Before one lands this
  // gives the German fallback, which is what this already did for a string
  // the table had no entry for.
  const chosen = UI_TABLES[language];
  if (chosen) return chosen[s] ?? chosen[germanFallback] ?? germanFallback;
  return language === "en" ? s : germanFallback;
}

/**
 * True when the app chrome should render in German.
 *
 * This asked the course which language to use, so a German speaker learning
 * English could not have an English app and an English speaker learning German
 * could not have a German one. It reads the interface setting now, which still
 * defaults to deriving it from the course.
 */
export function uiIsGerman(): boolean {
  return resolveInterfaceLanguage() === "de";
}

/**
 * True when the app chrome is in English, its source language.
 *
 * A handful of places show catalogue metadata — a usage note, a synonym tier,
 * a pack note — that only exists in English. They were hidden behind
 * `!uiIsGerman()`, which meant "not German" and therefore "English" while
 * there were two languages. With French added, "not German" would have let
 * that English metadata through into a French app.
 */
export function uiIsEnglish(): boolean {
  return resolveInterfaceLanguage() === "en";
}

/** Locale used for UI-only dates and number formatting. */
export function uiLocale(): string {
  const language = resolveInterfaceLanguage();
  if (language === "de") return "de-DE";
  if (language === "fr") return "fr-FR";
  if (language === "pl") return "pl-PL";
  return "en-GB";
}

/**
 * The voice tag for anything the app SAYS in its own language.
 *
 * The pet talks, and it talks in the language the app is written in rather
 * than the one being studied — it is app furniture, not a lesson. This was
 * written as `uiIsGerman() ? "de-DE" : "en-US"` at every one of those sites,
 * which made French silently English the moment French existed.
 */
export function uiSpeechLang(): "de-DE" | "fr-FR" | "pl-PL" | "en-US" {
  const language = resolveInterfaceLanguage();
  if (language === "de") return "de-DE";
  if (language === "fr") return "fr-FR";
  if (language === "pl") return "pl-PL";
  return "en-US";
}

/**
 * A number, written the way the INTERFACE language writes numbers.
 *
 * Number.toLocaleString() with no argument follows the machine, not the app.
 * On a German-region Windows every count in Micheon came out with German
 * separators regardless of the language the app was set to, so an English
 * dashboard read "18.935 XP" — which an English reader parses as eighteen
 * point nine three five. Sixty-seven call sites did this.
 *
 * uiLocale() has existed for exactly this since it was written; it just had
 * to be reachable in one call so nobody has to remember to pass it.
 */
export function uiNumber(value: number, options?: Intl.NumberFormatOptions): string {
  if (!Number.isFinite(value)) return "0";
  try {
    return value.toLocaleString(uiLocale(), options);
  } catch {
    // A runtime without full ICU data still has to show the number.
    return String(value);
  }
}
