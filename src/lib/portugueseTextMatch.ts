export type PortugueseMatch = {
  ok: boolean;
  spellingNote: boolean;
  capitalizationError?: boolean;
  phrasingNote?: boolean;
};

const APOSTROPHES = /[’ʼ'`´‘]/g;
const PUNCTUATION = /[.!?,;:"()\[\]{}“”„«»…¿¡]/g;
const THIN_SPACES = /[    ]/g;

export function normalizePortugueseInput(text: string): string {
  return String(text ?? "")
    .replace(THIN_SPACES, " ")
    .replace(APOSTROPHES, "")
    .replace(PUNCTUATION, " ")
    .replace(/[-‐–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePortugueseLenient(text: string): string {
  return normalizePortugueseInput(text)
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function lowerPortuguese(text: string): string {
  return normalizePortugueseInput(text).toLocaleLowerCase("pt-PT");
}

function compare(input: string, target: string): PortugueseMatch | null {
  const strictInput = normalizePortugueseInput(input);
  const strictTarget = normalizePortugueseInput(target);
  if (!strictInput) return null;
  if (strictInput === strictTarget) return { ok: true, spellingNote: false };

  if (lowerPortuguese(input) === lowerPortuguese(target)) {
    if (strictInput.slice(1) === strictTarget.slice(1)) return { ok: true, spellingNote: false };
    return { ok: false, spellingNote: false, capitalizationError: true };
  }

  if (normalizePortugueseLenient(input) === normalizePortugueseLenient(target)) {
    return { ok: true, spellingNote: true };
  }
  return null;
}

export function matchPortuguesePhrase(input: string, target: string): PortugueseMatch {
  const raw = String(target ?? "");
  if (raw.includes(" / ")) {
    for (const segment of raw.split(" / ").map((part) => part.trim()).filter(Boolean)) {
      const result = matchPortuguesePhrase(input, segment);
      if (result.ok) return result;
    }
  }
  return compare(input, target) ?? { ok: false, spellingNote: false };
}

export const matchPortugueseSentence = matchPortuguesePhrase;

export function portugueseMeaningAlternatives(value: string): string[] {
  const original = String(value ?? "").trim();
  if (!original) return [];
  const parts = original
    .split(/\s+\/\s+|[,;]|\s+ou\s+/iu)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [original];
}

export function matchPortugueseMeaning(input: string, target: string): PortugueseMatch {
  const whole = matchPortuguesePhrase(input, target);
  if (whole.ok) return whole;
  for (const alternative of portugueseMeaningAlternatives(target)) {
    const result = matchPortuguesePhrase(input, alternative);
    if (result.ok) return result;
  }
  return whole;
}

export const PORTUGUESE_SPECIAL_CHARACTERS = [
  "á", "à", "â", "ã", "é", "ê", "í", "ó", "ô", "õ", "ú", "ç",
  "Á", "À", "Â", "Ã", "É", "Ê", "Í", "Ó", "Ô", "Õ", "Ú", "Ç",
];
