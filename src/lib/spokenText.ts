const ALTERNATIVE_SEPARATOR = /\s+\/\s+/u;

/**
 * Learning content can show several accepted translations separated by a
 * spaced slash. Speech should model one natural answer, not read the separator
 * or recite every alternative.
 */
export function firstSpokenAlternative(text: string): string {
  const value = String(text ?? "").trim();
  if (!value) return "";

  const separatorIndex = value.search(ALTERNATIVE_SEPARATOR);
  const firstAlternative = separatorIndex === -1
    ? value
    : value.slice(0, separatorIndex).trim();

  return firstAlternative
    .replace(/\band\/or\b/giu, "and or")
    .replace(/\bund\/oder\b/giu, "und oder")
    .replace(/(\p{L}+)\/\p{L}+/gu, "$1");
}
