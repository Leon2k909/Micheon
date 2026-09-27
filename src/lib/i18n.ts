import { DIRECTION_CHANGE_EVENT } from "@/lib/direction";
import {
  INTERFACE_LANGUAGE_CHANGE_EVENT,
  INTERFACE_STRINGS_READY_EVENT,
  resolveInterfaceLanguage,
  type ResolvedInterfaceLanguage,
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
  ru: () => import("@/lib/i18nRu").then((m) => m.RU),
  el: () => import("@/lib/i18nEl").then((m) => m.EL),
  sq: () => import("@/lib/i18nSq").then((m) => m.SQ),
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

type UiPart = { kind: "text"; value: string } | { kind: "slot"; name: string };

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

/** The voices the app can be read aloud in, one per language it speaks. */
type UiSpeechLanguage =
  | "de-DE" | "el-GR" | "en-US" | "es-ES" | "fr-FR" | "it-IT" | "pl-PL" | "pt-PT" | "ru-RU" | "sq-AL";

/**
 * How each language the app can be set to writes its numbers and dates, and
 * what voice it is read aloud in.
 *
 * A table rather than a chain of ifs, and typed on ResolvedInterfaceLanguage
 * so it cannot be short of a language. Both helpers below used to end in a
 * bare `return` for English, and a language nobody added to the chain fell
 * into it without a word: Spanish, Italian and Portuguese shipped as complete
 * interface languages and still wrote their dates the English way and spoke
 * to their reader in an English voice. Now a missing row is a type error in
 * the same edit that adds the language.
 *
 * `format` and `speech` are separate because for one language they differ:
 * the app writes English dates and numbers the British way and speaks them
 * in the American voice it has always used.
 */
const UI_LOCALES: Record<ResolvedInterfaceLanguage, { format: string; speech: UiSpeechLanguage }> = {
  de: { format: "de-DE", speech: "de-DE" },
  el: { format: "el-GR", speech: "el-GR" },
  en: { format: "en-GB", speech: "en-US" },
  es: { format: "es-ES", speech: "es-ES" },
  fr: { format: "fr-FR", speech: "fr-FR" },
  it: { format: "it-IT", speech: "it-IT" },
  pl: { format: "pl-PL", speech: "pl-PL" },
  // Portugal rather than Brazil, the same way the Portuguese course chooses.
  pt: { format: "pt-PT", speech: "pt-PT" },
  ru: { format: "ru-RU", speech: "ru-RU" },
  sq: { format: "sq-AL", speech: "sq-AL" },
};

/** Locale used for UI-only dates and number formatting. */
export function uiLocale(): string {
  return UI_LOCALES[resolveInterfaceLanguage()].format;
}

/**
 * The voice tag for anything the app SAYS in its own language.
 *
 * The pet talks, and it talks in the language the app is written in rather
 * than the one being studied — it is app furniture, not a lesson. This was
 * written as `uiIsGerman() ? "de-DE" : "en-US"` at every one of those sites,
 * which made French silently English the moment French existed.
 */
export function uiSpeechLang(): UiSpeechLanguage {
  return UI_LOCALES[resolveInterfaceLanguage()].speech;
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
    const standIn = NUMBERS_WRITTEN_LIKE[resolveInterfaceLanguage()];
    if (standIn && !runtimeWrites(uiLocale())) return value.toLocaleString(standIn, options);
    return value.toLocaleString(uiLocale(), options);
  } catch {
    // A runtime without full ICU data still has to show the number.
    return String(value);
  }
}

/**
 * A date or a time, written the way the INTERFACE language writes them.
 *
 * The same rule as uiNumber, for the same reason: a date formatted without the
 * app's locale comes out in the machine's language. Takes the options
 * Intl.DateTimeFormat takes. The Albanian written by hand below understands
 * weekday, day, month, year, hour, minute and second, which is everything the
 * app asks for; check-number-formatting holds it to CLDR's spelling.
 */
export function uiDate(when: Date | number | string, options: Intl.DateTimeFormatOptions): string {
  const date = new Date(when);
  if (Number.isNaN(date.getTime())) return "";
  const byHand = DATES_WRITTEN_BY_HAND[resolveInterfaceLanguage()];
  if (byHand && !runtimeWrites(uiLocale())) return byHand(date, options);
  return new Intl.DateTimeFormat(uiLocale(), options).format(date);
}

/**
 * Albanian is the one interface language the runtime cannot write.
 *
 * Electron's ICU carries data only for the languages Chrome itself is
 * translated into, and Albanian is not among them: supportedLocalesOf("sq-AL")
 * comes back empty there, and a formatter handed sq-AL writes for the machine
 * instead, without an error. On a German Windows that is German month names;
 * on an English one it is 18,935, which an Albanian reader, whose decimal
 * point is a comma, reads as eighteen point nine three five.
 *
 * Numbers borrow Polish, which writes them exactly as Albanian does: a no-break
 * space between thousands from five digits up (1234, 12 345), a decimal comma,
 * 42%. Dates have nobody to borrow from, so they are written from CLDR's
 * Albanian patterns (CLDR 48). Both detours are taken only while the runtime
 * lacks the data, so an Electron that gains it is used as it is.
 */
const NUMBERS_WRITTEN_LIKE: Partial<Record<ResolvedInterfaceLanguage, string>> = { sq: "pl-PL" };
const DATES_WRITTEN_BY_HAND: Partial<Record<ResolvedInterfaceLanguage, (date: Date, options: Intl.DateTimeFormatOptions) => string>> = {
  sq: albanianDate,
};

const runtimeLocales = new Map<string, boolean>();

/** Whether this runtime has the data to write `locale` itself. */
function runtimeWrites(locale: string): boolean {
  let known = runtimeLocales.get(locale);
  if (known === undefined) {
    try {
      known = Intl.NumberFormat.supportedLocalesOf([locale]).length > 0;
    } catch {
      known = false;
    }
    runtimeLocales.set(locale, known);
  }
  return known;
}

const SQ_MONTHS = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];
const SQ_MONTHS_SHORT = ["jan", "shk", "mar", "pri", "maj", "qer", "korr", "gush", "sht", "tet", "nën", "dhj"];
const SQ_WEEKDAYS = ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"];
const SQ_WEEKDAYS_SHORT = ["die", "hën", "mar", "mër", "enj", "pre", "sht"];

/**
 * CLDR's Albanian patterns: 7 sht, 7.9.2026, e hënë, 7 shtator 2026, 02:05 m.d.
 * A month in letters is set off by spaces and a month in figures by full
 * stops, the weekday leads with a comma, and the clock is twelve-hour with p.d.
 * and m.d. (paradite, mbasdite) unless a 24-hour cycle is asked for.
 */
function albanianDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  const two = (n: number) => String(n).padStart(2, "0");
  const { weekday, day, month, year, hour, minute, second } = options;
  const parts: string[] = [];
  if (weekday) parts.push((weekday === "long" ? SQ_WEEKDAYS : SQ_WEEKDAYS_SHORT)[date.getDay()]);
  if (day || month || year) {
    const inFigures = month === "numeric" || month === "2-digit";
    const pieces = [
      !day ? "" : day === "2-digit" ? two(date.getDate()) : String(date.getDate()),
      !month ? ""
        : month === "2-digit" ? two(date.getMonth() + 1)
          : month === "numeric" ? String(date.getMonth() + 1)
            : (month === "long" ? SQ_MONTHS : SQ_MONTHS_SHORT)[date.getMonth()],
      !year ? "" : year === "2-digit" ? two(date.getFullYear() % 100) : String(date.getFullYear()),
    ];
    parts.push(pieces.filter(Boolean).join(inFigures ? "." : " "));
  }
  if (hour || minute || second) {
    const allDay = options.hour12 === false || options.hourCycle === "h23" || options.hourCycle === "h24";
    const hours = date.getHours();
    const twelve = hours % 12 || 12;
    const clock: string[] = [];
    if (hour) clock.push(allDay ? two(hours) : hour === "2-digit" ? two(twelve) : String(twelve));
    if (minute) clock.push(two(date.getMinutes()));
    if (second) clock.push(two(date.getSeconds()));
    parts.push(clock.join(":") + (hour && !allDay ? (hours < 12 ? " p.d." : " m.d.") : ""));
  }
  // No fields asked for is Intl's default: the date in figures.
  return parts.length ? parts.join(", ") : albanianDate(date, { day: "numeric", month: "numeric", year: "numeric" });
}
