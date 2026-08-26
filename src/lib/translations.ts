import { FRENCH_BY_GERMAN } from "@/lib/frenchTranslations";
import { POLISH_BY_GERMAN } from "@/lib/polishTranslations";

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
 */

/** A language we hold translations for. Add the code when you add the table. */
export type TranslationLanguage = "fr" | "pl";

/** German text → that language's translation. */
export type TranslationTable = Record<string, string>;

const TABLES: Record<TranslationLanguage, TranslationTable> = {
  fr: FRENCH_BY_GERMAN,
  pl: POLISH_BY_GERMAN,
};

export const TRANSLATION_LANGUAGES = Object.keys(TABLES) as TranslationLanguage[];

export const TRANSLATION_LANGUAGE_NAMES: Record<TranslationLanguage, string> = {
  fr: "French",
  pl: "Polish",
};

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
 *   2. Import it here, add the code to TranslationLanguage, and put it in
 *      TABLES and TRANSLATION_LANGUAGE_NAMES.
 *   3. check-translation-coverage walks TRANSLATION_LANGUAGES, so the new language
 *      is measured and floored from its first run without any change to the
 *      gate.
 *
 * No pack file is edited at any point, which is the whole design.
 */
