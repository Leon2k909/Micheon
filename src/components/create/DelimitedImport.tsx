import React, { useMemo, useRef, useState } from "react";
import { FileSpreadsheet, FileUp } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  makeCardsFromDelimited,
  parseDelimitedFile,
  rowLooksLikeHeader,
  suggestDelimitedMapping,
  type DelimitedColumnMapping,
  type DelimitedTable,
} from "@/lib/delimitedCards";
import type { StudyCard } from "@/lib/studySets";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

type LoadedFile = DelimitedTable & {
  name: string;
};

const columnName = (index: number) => {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return `${ui("Column")} ${label}`;
};

export function DelimitedImport({ onImport }: { onImport: (cards: StudyCard[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);
  const [hasHeader, setHasHeader] = useState(false);
  const [mapping, setMapping] = useState<DelimitedColumnMapping>({
    term: 0,
    definition: 1,
    hint: null,
  });
  const [error, setError] = useState("");

  const columnCount = useMemo(
    () => loaded?.rows.reduce((largest, row) => Math.max(largest, row.length), 0) ?? 0,
    [loaded]
  );
  const labels = useMemo(() => Array.from({ length: columnCount }, (_, index) => {
    const header = hasHeader ? loaded?.rows[0]?.[index]?.trim() : "";
    return header || columnName(index);
  }), [columnCount, hasHeader, loaded]);
  const dataRows = useMemo(
    () => loaded ? loaded.rows.slice(hasHeader ? 1 : 0) : [],
    [hasHeader, loaded]
  );
  const mappingIsValid = mapping.term >= 0
    && mapping.definition >= 0
    && mapping.term !== mapping.definition;
  const mappedRows = useMemo(() => {
    if (!mappingIsValid) return [];
    return dataRows.flatMap((row) => {
      const term = row[mapping.term]?.trim() ?? "";
      if (!term) return [];
      return [{
        term,
        definition: row[mapping.definition]?.trim() ?? "",
        hint: mapping.hint === null ? "" : row[mapping.hint]?.trim() ?? "",
      }];
    });
  }, [dataRows, mapping, mappingIsValid]);

  const reset = () => {
    setLoaded(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const chooseFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setLoaded(null);
      setError(ui("That file is larger than 5 MB. Split it into smaller files and try again."));
      return;
    }
    try {
      const parsed = parseDelimitedFile(await file.text(), file.name);
      if (parsed.rows.length === 0 || parsed.rows.every((row) => row.length < 2)) {
        throw new Error(ui("No two-column rows were found."));
      }
      const header = rowLooksLikeHeader(parsed.rows[0]);
      setLoaded({ ...parsed, name: file.name });
      setHasHeader(header);
      setMapping(suggestDelimitedMapping(header ? parsed.rows[0] : []));
    } catch (cause) {
      setLoaded(null);
      setError(cause instanceof Error ? cause.message : ui("This file could not be read."));
    }
  };

  const changeHeader = (next: boolean) => {
    setHasHeader(next);
    setMapping(suggestDelimitedMapping(next ? loaded?.rows[0] ?? [] : []));
  };

  const commit = () => {
    if (!loaded || !mappingIsValid) return;
    const cards = makeCardsFromDelimited(dataRows, mapping, Date.now());
    if (cards.length === 0) return;
    onImport(cards);
    reset();
  };

  return (
    <div className="mt-6 border-t border-[var(--border)] pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-black text-[var(--text-1)]">{ui("Import a CSV or TSV file")}</h4>
          <p className="mt-1 max-w-lg text-xs font-semibold leading-5 text-[var(--text-3)]">
            {ui("Choose which columns contain the term, definition, and optional hint before anything is added.")}
          </p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent)]">
          <FileUp className="h-4 w-4" />
          {ui(loaded ? "Choose another file" : "Choose file")}
          <input
            ref={inputRef}
            data-testid="delimited-file-input"
            accept=".csv,.tsv,text/csv,text/tab-separated-values"
            className="sr-only"
            onChange={(event) => void chooseFile(event.target.files?.[0])}
            type="file"
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-[var(--danger-bg)] p-3 text-xs font-bold text-[var(--danger-text)]" role="alert">
          {error}
        </p>
      )}

      {loaded && (
        <div className="mt-4 rounded-2xl bg-[var(--surface-2)] p-3.5 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex min-w-0 items-center gap-2 text-xs font-black text-[var(--text-1)]">
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="truncate">{loaded.name}</span>
              <span className="shrink-0 text-[var(--text-3)]">
                {loaded.delimiter === "\t" ? ui("TSV") : ui("CSV")}
              </span>
            </p>
            <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-bold text-[var(--text-2)]">
              <input
                checked={hasHeader}
                className="accent-[var(--accent)]"
                onChange={(event) => changeHeader(event.target.checked)}
                type="checkbox"
              />
              {ui("First row contains headings")}
            </label>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {([
              ["term", "Term column", false],
              ["definition", "Definition column", false],
              ["hint", "Hint column", true],
            ] as const).map(([field, label, optional]) => (
              <label className="min-w-0 text-[11px] font-black text-[var(--text-3)]" key={field}>
                {ui(label)}
                <select
                  aria-label={ui(label)}
                  className="mt-1 h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
                  onChange={(event) => setMapping((current) => ({
                    ...current,
                    [field]: field === "hint" && event.target.value === "none"
                      ? null
                      : Number(event.target.value),
                  }))}
                  value={mapping[field] === null ? "none" : mapping[field]}
                >
                  {optional && <option value="none">{ui("Do not import")}</option>}
                  {labels.map((name, index) => (
                    <option key={index} value={index}>{name}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {!mappingIsValid && (
            <p className="mt-2 text-[11px] font-bold text-[var(--danger-text)]" role="alert">
              {ui("Choose different columns for the term and definition.")}
            </p>
          )}

          {mappingIsValid && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <table className="w-full min-w-[32rem] table-fixed text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">
                  <tr>
                    <th className="px-3 py-2 font-black">{ui("Term")}</th>
                    <th className="px-3 py-2 font-black">{ui("Definition")}</th>
                    <th className="px-3 py-2 font-black">{ui("Hint")}</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedRows.slice(0, 5).map((row, index) => (
                    <tr className="border-t border-[var(--border)]" key={index}>
                      <td className="truncate px-3 py-2 font-bold text-[var(--text-1)]">{row.term}</td>
                      <td className="truncate px-3 py-2 font-semibold text-[var(--text-2)]">{row.definition || ui("Empty")}</td>
                      <td className="truncate px-3 py-2 font-semibold text-[var(--text-3)]">{row.hint || ui("None")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-[var(--text-3)]">
              {mappedRows.length} {ui(mappedRows.length === 1 ? "card ready" : "cards ready")}
              {dataRows.length > mappedRows.length
                ? `, ${dataRows.length - mappedRows.length} ${ui("row(s) without a term skipped")}`
                : ""}
            </p>
            <button
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black transition-colors",
                mappedRows.length > 0 && mappingIsValid
                  ? "bg-[var(--accent)] text-[var(--accent-text)] hover:brightness-110"
                  : "cursor-not-allowed bg-[var(--surface-3)] text-[var(--text-3)]"
              )}
              disabled={mappedRows.length === 0 || !mappingIsValid}
              onClick={commit}
              type="button"
            >
              <FileUp className="h-4 w-4" />
              {ui("Import")} {mappedRows.length > 0 ? mappedRows.length : ""} {ui("cards")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
