import { makeCard, type StudyCard } from "@/lib/studySets";

type Delimiter = "," | "\t";

export type DelimitedTable = {
  delimiter: Delimiter;
  rows: string[][];
};

export type DelimitedColumnMapping = {
  term: number;
  definition: number;
  hint: number | null;
};

const TERM_HEADERS = new Set([
  "term",
  "front",
  "question",
  "word",
  "phrase",
  "german",
  "de",
  "deutsch",
]);

const DEFINITION_HEADERS = new Set([
  "definition",
  "back",
  "answer",
  "meaning",
  "translation",
  "english",
  "en",
]);

const HINT_HEADERS = new Set([
  "hint",
  "note",
  "notes",
  "example",
  "mnemonic",
  "usage",
]);

const normaliseHeader = (value: string) => value
  .trim()
  .toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, "");

/** Pick the file's separator without counting commas inside quoted fields. */
function detectDelimiter(text: string, fileName = ""): Delimiter {
  const extension = fileName.trim().toLocaleLowerCase();
  if (extension.endsWith(".tsv")) return "\t";
  if (extension.endsWith(".csv")) return ",";

  let commas = 0;
  let tabs = 0;
  let quoted = false;
  let lines = 0;
  for (let index = 0; index < text.length && lines < 24; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') index += 1;
      else quoted = !quoted;
      continue;
    }
    if (quoted) continue;
    if (character === ",") commas += 1;
    if (character === "\t") tabs += 1;
    if (character === "\n") lines += 1;
  }
  return tabs > commas ? "\t" : ",";
}

/**
 * Parse CSV or TSV, including escaped quotes and line breaks inside a field.
 * Empty physical rows are ignored, while empty cells inside a row are kept.
 */
export function parseDelimitedText(text: string, delimiter: Delimiter): string[][] {
  const input = text.replace(/^\uFEFF/, "");
  if (!input.trim()) return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  const finishRow = () => {
    row.push(field);
    if (row.some((cell) => cell.trim().length > 0)) rows.push(row);
    row = [];
    field = "";
  };

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      finishRow();
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("The file ends inside a quoted value.");
  if (field.length > 0 || row.length > 0) finishRow();
  return rows;
}

export function parseDelimitedFile(text: string, fileName = ""): DelimitedTable {
  const delimiter = detectDelimiter(text, fileName);
  return { delimiter, rows: parseDelimitedText(text, delimiter) };
}

export function rowLooksLikeHeader(row: string[]): boolean {
  const recognised = row.reduce((count, cell) => {
    const key = normaliseHeader(cell);
    return count + Number(TERM_HEADERS.has(key) || DEFINITION_HEADERS.has(key) || HINT_HEADERS.has(key));
  }, 0);
  return recognised >= 2;
}

/** Suggest useful defaults, while still leaving every choice editable. */
export function suggestDelimitedMapping(row: string[]): DelimitedColumnMapping {
  const normalised = row.map(normaliseHeader);
  const find = (aliases: Set<string>) => normalised.findIndex((cell) => aliases.has(cell));
  const matchedTerm = find(TERM_HEADERS);
  const term = matchedTerm >= 0 ? matchedTerm : 0;
  const matchedDefinition = find(DEFINITION_HEADERS);
  const fallbackDefinition = row.findIndex((_, index) => index !== term);
  const definition = matchedDefinition >= 0
    ? matchedDefinition
    : fallbackDefinition >= 0 ? fallbackDefinition : 1;
  const matchedHint = find(HINT_HEADERS);
  return {
    term,
    definition,
    hint: matchedHint >= 0 ? matchedHint : null,
  };
}

export function makeCardsFromDelimited(
  rows: string[][],
  mapping: DelimitedColumnMapping,
  now = 0
): StudyCard[] {
  if (mapping.term < 0 || mapping.definition < 0 || mapping.term === mapping.definition) return [];
  return rows.flatMap((row, index) => {
    const term = row[mapping.term]?.trim() ?? "";
    if (!term) return [];
    return [makeCard(term, row[mapping.definition] ?? "", {
      hint: mapping.hint === null ? undefined : row[mapping.hint],
      source: "file",
      now: now + index,
    })];
  });
}
