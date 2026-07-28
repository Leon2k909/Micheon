const SEARCHABLE_KEYS = [
  "de",
  "en",
  "partLabel",
  "partKey",
  "lookup",
  "use",
  "fr",
  "short",
  "when",
  "say",
  "long",
  "group",
  "tierNote",
] as const;

const APOSTROPHES = /['\u2018\u2019\u201B\u02BB\u02BC\u02B9\uFF07]/gu;

function germanKeyboardForm(value: string) {
  return value
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

/**
 * Fold learner-entered text for forgiving catalogue search.
 *
 * Apostrophes are removed rather than changed to spaces so `dont`, `don't`,
 * and `don’t` all share the same form. Other punctuation becomes a word
 * boundary, accents are folded, and ß can be entered as `ss`.
 */
export function normalizeCatalogSearchText(value: unknown): string {
  return String(value ?? "")
    .toLocaleLowerCase("de-DE")
    .replace(APOSTROPHES, "")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchForms(value: unknown): string[] {
  const raw = String(value ?? "").toLocaleLowerCase("de-DE");
  const forms = [
    normalizeCatalogSearchText(raw),
    normalizeCatalogSearchText(germanKeyboardForm(raw)),
  ].filter(Boolean);
  return [...new Set(forms)];
}

function collectSearchValues(source: unknown, out: unknown[]) {
  if (source == null) return;
  if (Array.isArray(source)) {
    for (const value of source) collectSearchValues(value, out);
    return;
  }
  if (typeof source === "object") {
    const item = source as Record<string, unknown>;
    for (const key of SEARCHABLE_KEYS) collectSearchValues(item[key], out);
    return;
  }
  out.push(source);
}

/** Build the reusable haystack for one item, pack, or list of text values. */
export function buildCatalogSearchText(source: unknown): string {
  const values: unknown[] = [];
  collectSearchValues(source, values);
  const forms = values.flatMap(searchForms);
  return [...new Set(forms)].join("\n");
}

type SearchableCatalogItem = Record<string, unknown> & { searchText?: string };

/**
 * Search every indexed field using a normalized phrase substring. Keeping the
 * entered word order prevents a short query such as `i dont think` from
 * returning hundreds of rows whose unrelated metadata merely contains all
 * three words. Partial-word matching still works as before.
 */
export function catalogItemMatchesQuery(
  item: SearchableCatalogItem,
  query: unknown,
  indexedText?: string
): boolean {
  const queryForms = searchForms(query);
  if (queryForms.length === 0) return true;
  const haystack = indexedText || item.searchText || buildCatalogSearchText(item);
  return queryForms.some((form) => haystack.includes(form));
}
