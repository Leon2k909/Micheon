/**
 * One translation layer for every language, so adding one is adding a file.
 *
 * THE PROBLEM THIS SOLVES. A translation used to be a COLUMN. Entries are
 * written `{ de, en }`, and French was bolted on as a third field `fr` on the
 * lines that had it. That model does not survive a second extra language:
 * languageCatalogue.ts lists 84, and a column each would mean 84 fields on
 * every one of 21,366 entries, in files that are already 1.9 MB.
 *
 * So a language is a TABLE now, not a column. Adding Spanish means writing
 * spanishTranslations.ts and registering it below — no pack file is touched,
 * no existing entry changes, and nothing that already works can break by
 * being edited.
 *
 * WHY KEYED BY THE GERMAN. The packs have no stable per-entry id; the German
 * string is what identifies a card everywhere else in the app, including in
 * progress and mastery. Keying on it means a table can be written against
 * the content as it stands rather than against an id scheme that would have
 * to be retrofitted to 21,366 lines first.
 *
 * The cost of that choice is homographs: keyed by text alone, this cannot
 * tell "laut" the preposition (selon) from "laut" the adjective (bruyant).
 * Those belong on the entry itself, where the context is known — which is
 * exactly what the inline fields are for, and why inline always wins below.
 *
 * WHY THE TABLES ARE FETCHED, NOT IMPORTED. They used to be two static
 * imports, which put every language into one chunk that the entry chunk
 * pulled in — so a learner doing German alone downloaded French and Polish at
 * startup and never opened either. Measured at 786 KB, growing by roughly
 * 450 KB per language added. The design above says a language should be one
 * more file; eagerly importing it made a language one more file EVERYBODY
 * pays for.
 *
 * So a table arrives when its course does. translate() stays synchronous —
 * it is called from render — and answers null for a table not yet here,
 * which is the same answer it already gave for a word a table does not
 * cover, so no caller needed changing. What DOES need care is asking for the
 * table before the course is built: a French lesson assembled while the
 * table is still in flight would quietly come out short, because entries
 * without a translation are dropped rather than shown in German. That is
 * what ensureTranslations is for, and why the course boot awaits it.
 */

/** A language we hold translations for. Add the code when you add the table. */
export type TranslationLanguage = "fr" | "pl" | "es" | "it" | "pt" | "ru";

/** German text → that language's translation. */
export type TranslationTable = Record<string, string>;

/**
 * How to fetch each table. The import is inside the function on purpose: a
 * top-level one is resolved at build time and lands in the startup chunk,
 * which is the whole fault being fixed.
 */
/**
 * The bundled copy, used when the pack cannot be had.
 *
 * A dynamic import so it stays its own chunk and is only fetched if it is
 * actually needed — a first run with no network, or a browser with storage
 * turned off. The pack is preferred because a pack can be REMOVED: a chunk,
 * once downloaded, is the browser's to keep.
 */
const BUNDLED: Record<TranslationLanguage, () => Promise<TranslationTable>> = {
  fr: () => import("@/lib/frenchTranslations").then((m) => m.FRENCH_BY_GERMAN),
  pl: () => import("@/lib/polishTranslations").then((m) => m.POLISH_BY_GERMAN),
  es: () => import("@/lib/spanishTranslations").then((m) => m.SPANISH_BY_GERMAN),
  it: () => import("@/lib/italianTranslations").then((m) => m.ITALIAN_BY_GERMAN),
  pt: () => import("@/lib/portugueseTranslations").then((m) => m.PORTUGUESE_BY_GERMAN),
  ru: () => import("@/lib/russianTranslations").then((m) => m.RUSSIAN_BY_GERMAN),
};

/**
 * Where each language's table is fetched from, and what to fall back on.
 *
 * The pack is the same table as plain JSON, built by build-content-packs and
 * verified byte-identical to the bundled copy by check-content-packs. Reading
 * it here rather than importing the module is what makes a language something
 * a learner HAS rather than something the app is made of — installed by
 * opening the course, and removable in Data and storage.
 *
 * readPack answers null for anything it cannot produce — no manifest, no
 * cache, no network — and the bundled copy answers instead. Nothing about
 * this can leave a course without its translations.
 */
const LOADERS: Record<TranslationLanguage, () => Promise<TranslationTable>> = {
  fr: () => fromPackOrBundle("fr"),
  pl: () => fromPackOrBundle("pl"),
  es: () => fromPackOrBundle("es"),
  it: () => fromPackOrBundle("it"),
  pt: () => fromPackOrBundle("pt"),
  ru: () => fromPackOrBundle("ru"),
};

async function fromPackOrBundle(language: TranslationLanguage): Promise<TranslationTable> {
  try {
    const packs = await import("@/lib/contentPacks");
    const manifest = await packs.loadContentManifest();
    const pack = manifest?.languages?.find((entry) => entry.id === language);
    if (pack) {
      // Keeping it is what makes it removable later; a failed keep still
      // reads, it is simply fetched again next time.
      if (!(await packs.isPackInstalled(pack.url))) await packs.installPack(pack.url);
      const table = await packs.readPack<TranslationTable>(pack.url);
      if (table && Object.keys(table).length) return table;
    }
  } catch {
    // Any failure at all falls through to the copy inside the app.
  }
  return BUNDLED[language]();
}

export const TRANSLATION_LANGUAGES = Object.keys(LOADERS) as TranslationLanguage[];

export const TRANSLATION_LANGUAGE_NAMES: Record<TranslationLanguage, string> = {
  fr: "French",
  pl: "Polish",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
};

/** Tables that have arrived. Empty until a course asks for one. */
const TABLES: Partial<Record<TranslationLanguage, TranslationTable>> = {};
/** In-flight requests, so ten callers at once cause one download. */
const inFlight = new Map<TranslationLanguage, Promise<TranslationTable>>();

/** Fired when a table lands, so anything already on screen can draw again. */
export const TRANSLATIONS_LOADED_EVENT = "gl-translations-loaded";

export function isTranslationLoaded(language: TranslationLanguage): boolean {
  return Boolean(TABLES[language]);
}

/**
 * Have a language's table ready, fetching it once if it is not.
 *
 * Await this before building anything for that course. Everything after it is
 * synchronous, so the rest of the app is unchanged.
 */
export function ensureTranslations(language: TranslationLanguage): Promise<TranslationTable> {
  const ready = TABLES[language];
  if (ready) return Promise.resolve(ready);
  const already = inFlight.get(language);
  if (already) return already;
  const load = LOADERS[language];
  if (!load) return Promise.resolve({});
  const request = load()
    .then((table) => {
      TABLES[language] = table;
      inFlight.delete(language);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(TRANSLATIONS_LOADED_EVENT, { detail: { language } }));
      }
      return table;
    })
    .catch((error) => {
      // A failed fetch must not wedge the language for the rest of the
      // session: dropping the record lets the next ask try again, and the
      // course meanwhile behaves as it does for an untranslated entry.
      inFlight.delete(language);
      console.error(`Could not load ${language} translations:`, error);
      return {} as TranslationTable;
    });
  inFlight.set(language, request);
  return request;
}

/** Every table at once — for build scripts and checks, never for the app. */

/**
 * Hand a table straight in, for the build scripts and the gate.
 *
 * Those run as synchronous CommonJS with no event loop to wait on, and they
 * genuinely do want every language at once — measuring coverage across all of
 * them is the job. They import the tables themselves and prime them here,
 * which keeps the awaiting version honest for the app instead of adding a
 * synchronous path nothing in the browser should take.
 *
 * check-language-loading refuses any call to this from src/, so it cannot
 * quietly become the way the app loads a language.
 */
export function primeTranslations(language: TranslationLanguage, table: TranslationTable): void {
  TABLES[language] = table;
}

/**
 * The translation for an entry, preferring whatever the entry itself carries.
 *
 * Inline wins because it was written against one specific sentence in one
 * specific lesson. A table keyed by German text alone cannot know which of
 * two contexts it is answering for, so it must not overrule something that
 * does.
 */
export function translate(
  german: string,
  language: TranslationLanguage,
  inline?: string | null
): string | null {
  if (inline && inline.trim()) return inline.trim();
  const table = TABLES[language];
  if (!table) return null;
  const direct = table[german];
  if (direct) return direct;
  // Nouns are stored with their article in the packs. The tables key the bare
  // noun where the German article adds nothing the target language needs.
  const bare = german.replace(/^(der|die|das)\s+/i, "");
  return table[bare] ?? null;
}

export function translationTable(language: TranslationLanguage): TranslationTable {
  return TABLES[language] ?? {};
}

export function translationCount(language: TranslationLanguage): number {
  return Object.keys(TABLES[language] ?? {}).length;
}

/**
 * What it takes to add a language, in one place so nobody has to guess:
 *
 *   1. Write src/lib/<name>Translations.ts exporting a Record<string, string>
 *      keyed by the German, to the standard in frenchTranslations.ts — what a
 *      speaker would actually say, at the register the German uses.
 *   2. Add the code to TranslationLanguage, then put a loader in LOADERS and
 *      a name in TRANSLATION_LANGUAGE_NAMES. The loader must keep its import
 *      inside the arrow, or the table joins the startup chunk and every
 *      learner downloads it.
 *   3. check-translation-coverage walks TRANSLATION_LANGUAGES, so the new
 *      language is measured and floored from its first run without any change
 *      to the gate. check-language-loading refuses a static import of any
 *      table, so step 2 cannot be got wrong quietly.
 *
 * No pack file is edited at any point, which is the whole design.
 */
