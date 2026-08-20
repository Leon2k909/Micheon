import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Check, Layers, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  ADD_ALL_LIMIT,
  CEFR_LEVELS,
  COMMON_RANK_LIMIT,
  EMPTY_FILTERS,
  IMPORT_POS_GROUPS,
  buildImportPool,
  filterImportPool,
  filtersAreEmpty,
  importPacks,
  type CefrLevel,
  type ImportFilters,
  type ImportItem,
} from "@/lib/studyImport";

/**
 * Picking cards out of 23,000 without filters is a chore, not a feature.
 *
 * Leon: "should be filters/more options so i can add more words like a1, a1,
 * common etc or whichever theme etc". So the search box is now the last
 * resort rather than the only tool: choose words or phrases, a CEFR level, a
 * part of speech, a pack, or just the common ones, and add the whole result
 * in a single press.
 */
export function CatalogueImport({
  apiParts,
  alreadyAdded,
  onAdd,
  onAddMany,
}: {
  apiParts?: Record<string, unknown>;
  alreadyAdded: Set<string>;
  onAdd: (item: ImportItem) => void;
  onAddMany: (items: ImportItem[]) => void;
}) {
  const [pool, setPool] = useState<ImportItem[] | null>(null);
  const [filters, setFilters] = useState<ImportFilters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(true);
  const [packQuery, setPackQuery] = useState("");
  const deferred = useDeferredValue(filters);

  // Both catalogues together are a lot of work, so it happens once, when the
  // tab is opened, rather than on the way into the editor.
  useEffect(() => {
    if (pool || !apiParts) return undefined;
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      try {
        setPool(buildImportPool(apiParts));
      } catch {
        setPool([]);
      }
    };
    const idle = (window as typeof window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (typeof idle === "function") idle(build, { timeout: 1500 });
    else window.setTimeout(build, 60);
    return () => { cancelled = true; };
  }, [pool, apiParts]);

  const packs = useMemo(() => (pool ? importPacks(pool) : []), [pool]);
  const visiblePacks = useMemo(() => {
    const needle = packQuery.trim().toLocaleLowerCase();
    const list = needle
      ? packs.filter((pack) => pack.label.toLocaleLowerCase().includes(needle))
      : packs;
    return list.slice(0, 40);
  }, [packs, packQuery]);

  const results = useMemo(
    () => (pool ? filterImportPool(pool, deferred) : []),
    [pool, deferred]
  );
  const shown = results.slice(0, 80);
  const addable = results.filter((item) => !alreadyAdded.has(item.id)).slice(0, ADD_ALL_LIMIT);

  const set = <K extends keyof ImportFilters>(key: K, value: ImportFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const Chip = ({
    active,
    onClick,
    children,
  }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-xl border px-3 py-1.5 text-xs font-black transition-colors",
        active
          ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
      )}
    >
      {children}
    </button>
  );

  return (
    <section className="card p-5 sm:p-6">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
        <input
          value={filters.query}
          onChange={(event) => set("query", event.target.value)}
          placeholder={ui("Search every word and phrase we have")}
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-4 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
          type="search"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowFilters((value) => !value)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {ui(showFilters ? "Hide filters" : "Filters")}
        </button>
        {!filtersAreEmpty(filters) && (
          <button
            type="button"
            onClick={() => { setFilters(EMPTY_FILTERS); setPackQuery(""); }}
            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-black text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
          >
            <X className="h-3 w-3" />
            {ui("Clear")}
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-3 space-y-3 rounded-2xl bg-[var(--surface-2)] p-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Type")}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Chip active={filters.kind === "all"} onClick={() => set("kind", "all")}>{ui("Everything")}</Chip>
              <Chip active={filters.kind === "word"} onClick={() => set("kind", "word")}>{ui("Words")}</Chip>
              <Chip active={filters.kind === "phrase"} onClick={() => set("kind", "phrase")}>{ui("Phrases")}</Chip>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Level")}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Chip active={filters.level === "all"} onClick={() => set("level", "all")}>{ui("Any")}</Chip>
              {CEFR_LEVELS.map((level) => (
                <Chip key={level} active={filters.level === level} onClick={() => set("level", level as CefrLevel)}>
                  {level}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Part of speech")}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Chip active={filters.pos === "all"} onClick={() => set("pos", "all")}>{ui("Any")}</Chip>
              {IMPORT_POS_GROUPS.map((group) => (
                <Chip key={group.id} active={filters.pos === group.id} onClick={() => set("pos", group.id)}>
                  {ui(group.label)}
                </Chip>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => set("commonOnly", !filters.commonOnly)}
            aria-pressed={filters.commonOnly}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
              filters.commonOnly
                ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-3)]"
            )}
          >
            <span>
              <span className={cn("block text-xs font-black", filters.commonOnly ? "text-[var(--accent)]" : "text-[var(--text-1)]")}>
                {ui("Common words only")}
              </span>
              <span className="block text-[11px] font-semibold text-[var(--text-3)]">
                {ui("The most frequent")} {COMMON_RANK_LIMIT.toLocaleString()} {ui("in everyday German.")}
              </span>
            </span>
            {filters.commonOnly && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
          </button>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Theme or pack")}
              {filters.pack !== "all" && (
                <button
                  type="button"
                  onClick={() => set("pack", "all")}
                  className="ml-2 font-bold normal-case tracking-normal text-[var(--accent)]"
                >
                  {ui("clear")}
                </button>
              )}
            </p>
            <input
              value={packQuery}
              onChange={(event) => setPackQuery(event.target.value)}
              placeholder={ui("Find a pack — cooking, travel, work…")}
              className="mt-1.5 h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            />
            <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {visiblePacks.map((pack) => (
                <Chip
                  key={pack.key}
                  active={filters.pack === pack.key}
                  onClick={() => set("pack", filters.pack === pack.key ? "all" : pack.key)}
                >
                  {pack.label}
                  <span className="ml-1.5 font-bold text-[var(--text-3)]">{pack.count}</span>
                </Chip>
              ))}
              {visiblePacks.length === 0 && (
                <p className="text-[11px] font-bold text-[var(--text-3)]">{ui("No pack matches that.")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!apiParts ? (
        <p className="mt-4 rounded-2xl bg-[var(--surface-2)] p-5 text-center text-sm font-bold text-[var(--text-3)]">
          {ui("The catalogue is still loading. Try again in a moment.")}
        </p>
      ) : !pool ? (
        <p className="mt-4 rounded-2xl bg-[var(--surface-2)] p-5 text-center text-sm font-bold text-[var(--text-3)]">
          {ui("Preparing the catalogue…")}
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-black text-[var(--text-3)]">
              {results.length.toLocaleString()} {ui("of")} {pool.length.toLocaleString()} {ui("match")}
            </p>
            {addable.length > 0 && (
              <button
                type="button"
                onClick={() => onAddMany(addable)}
                className="accent-btn inline-flex h-9 items-center gap-2 px-4 text-xs"
              >
                <Layers className="h-3.5 w-3.5" />
                {ui("Add all")} {addable.length}
                {results.length > addable.length + alreadyAdded.size ? ` ${ui("(max)")}` : ""}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-[var(--surface-2)] p-5 text-center text-sm font-bold text-[var(--text-3)]">
              {ui("Nothing matches those filters.")}
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {shown.map((item) => {
                const added = alreadyAdded.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={added}
                    onClick={() => onAdd(item)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-colors",
                      added ? "cursor-default bg-[var(--surface-2)] opacity-55" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-[var(--text-1)]">{item.de}</span>
                      <span className="block truncate text-xs font-semibold text-[var(--text-3)]">
                        {item.en}{item.hint ? ` · ${item.hint}` : ""}
                      </span>
                    </span>
                    {item.level && (
                      <span className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-black text-[var(--text-3)]">
                        {item.level}
                      </span>
                    )}
                    <span className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-black uppercase text-[var(--text-3)]">
                      {item.kind === "word" ? ui("word") : ui("phrase")}
                    </span>
                    {added
                      ? <Check className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
                      : <Plus className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
                  </button>
                );
              })}
              {results.length > shown.length && (
                <p className="pt-1 text-center text-[11px] font-bold text-[var(--text-3)]">
                  {ui("Showing the first")} {shown.length} {ui("— narrow the filters, or use Add all.")}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
