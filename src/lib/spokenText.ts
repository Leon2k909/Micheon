const ALTERNATIVE_SEPARATOR = /\s+\/\s+/u;
const PARENTHETICAL_ANNOTATION = /\s*\([^()]*\)/gu;

function removeParentheticalAnnotations(value: string): string {
  let result = value;
  let previous = "";

  // Repeat so a nested note is removed one balanced level at a time. The
  // catalogue uses simple notes today, but leaving unmatched parentheses
  // untouched is safer than guessing how to rewrite ordinary prose.
  while (result !== previous) {
    previous = result;
    result = result.replace(PARENTHETICAL_ANNOTATION, "");
  }

  return result.replace(/\s{2,}/gu, " ").trim();
}

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

  return removeParentheticalAnnotations(firstAlternative)
    .replace(/\band\/or\b/giu, "and or")
    .replace(/\bund\/oder\b/giu, "und oder")
    .replace(/(\p{L}+)\/\p{L}+/gu, "$1")
    .trim();
}
