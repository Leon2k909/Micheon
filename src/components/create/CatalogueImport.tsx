import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Check, CheckSquare, Layers, Plus, Search, SlidersHorizontal, Square, X } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { loadGradeStore } from "@/lib/activity";
import { cn } from "@/lib/utils";
import { ListPager, LongListChoice, ScrollJump, ShowMore } from "@/components/create/LongList";
import {
  CATALOGUE_PAGE_SIZE,
  LONG_LIST_THRESHOLD,
  loadLongListMode,
  pageSlice,
  pageWindow,
  saveLongListMode,
  type LongListMode,
} from "@/lib/longLists";
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
 * Filters do the picking: level, theme, words or phrases. So the search box
 * is now the last resort rather than the only tool: choose words or phrases, a CEFR level, a
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
  // Read once: the tracker verdicts do not change while this tab is open.
  const [grades] = useState(() => loadGradeStore());
  // Ticking individual results, for when "add all" is too blunt and one at a
  // time is too slow — which is most of the time.
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  // Scroll mode grows a chunk at a time. Rendering all 23,584 matches at once
  // locks the browser for seconds and then scrolls badly forever.
  const [loaded, setLoaded] = useState(CATALOGUE_PAGE_SIZE);
  const [mode, setMode] = useState<LongListMode>(() => loadLongListMode());
  const chooseMode = useCallback((next: LongListMode) => {
    setMode(next);
    saveLongListMode(next);
    setPage(1);
    setLoaded(CATALOGUE_PAGE_SIZE);
  }, []);
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

  // Sizes of each catalogue, so the picker can state them rather than
  // leaving the split to be inferred.
  const counts = useMemo(() => ({
    all: pool?.length ?? 0,
    word: pool?.filter((item) => item.kind === "word").length ?? 0,
    phrase: pool?.filter((item) => item.kind === "phrase").length ?? 0,
  }), [pool]);

  const packs = useMemo(() => (pool ? importPacks(pool) : []), [pool]);
  const visiblePacks = useMemo(() => {
    const needle = packQuery.trim().toLocaleLowerCase();
    const list = needle
      ? packs.filter((pack) => pack.label.toLocaleLowerCase().includes(needle))
      : packs;
    return list.slice(0, 40);
  }, [packs, packQuery]);

  // A new filter is a new list, so it starts at the beginning. pageWindow
  // clamps anyway, but landing on "page 4 of 4" after narrowing a search
  // reads as though results are missing.
  useEffect(() => { setPage(1); setLoaded(CATALOGUE_PAGE_SIZE); }, [deferred]);

  const results = useMemo(
    () => (pool ? filterImportPool(pool, deferred, grades) : []),
    [pool, deferred, grades]
  );
  /**
   * Paged, not truncated.
   *
   * This showed the first eighty matches and told you to narrow the filters,
   * which is fine advice for "der" and useless for a pack of two hundred you
   * deliberately asked for: there was no way to reach match eighty-one.
   */
  const pages = pageWindow(results.length, page, CATALOGUE_PAGE_SIZE);
  const shown = mode === "scroll"
    ? results.slice(0, loaded)
    : pageSlice(results, pages.page, CATALOGUE_PAGE_SIZE);
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
          {/*
            These really are two separate catalogues, and saying so matters.
            The vocabulary and the phrase course are built and stored apart,
            and someone searching for a noun in the phrase catalogue finds
            sentences containing it and no card to add — which is exactly what
            this screen used to do. Naming both, with their sizes, makes the
            distinction visible instead of something you deduce from results.
          */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Which catalogue")}
            </p>
            <div className="mt-1.5 grid gap-1.5 sm:grid-cols-3">
              {([
                ["all", "Both", counts.all, "Everything the app knows"],
                ["word", "Vocabulary", counts.word, "Single words, with gender and part of speech"],
                ["phrase", "Phrases", counts.phrase, "Full sentences from the course"],
              ] as const).map(([value, label, count, blurb]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("kind", value as ImportFilters["kind"])}
                  aria-pressed={filters.kind === value}
                  className={cn(
                    "rounded-xl border p-2.5 text-left transition-colors",
                    filters.kind === value
                      ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-3)]"
                  )}
                >
                  <span className={cn(
                    "block text-xs font-black",
                    filters.kind === value ? "text-[var(--accent)]" : "text-[var(--text-1)]"
                  )}>
                    {ui(label)}
                    <span className="ml-1.5 font-bold text-[var(--text-3)]">{uiNumber(count)}</span>
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold leading-4 text-[var(--text-3)]">
                    {ui(blurb)}
                  </span>
                </button>
              ))}
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
                {ui("The most frequent")} {uiNumber(COMMON_RANK_LIMIT)} {ui("in everyday German.")}
              </span>
            </span>
            {filters.commonOnly && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
          </button>

          {/*
            The most useful thing this screen can do with our data. The rest of
            the app already knows which words you miss and which keep going
            wrong; this turns that into a set instead of leaving it in a
            tracker you have to read.
          */}
          <button
            type="button"
            onClick={() => set("strugglingOnly", !filters.strugglingOnly)}
            aria-pressed={filters.strugglingOnly}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
              filters.strugglingOnly
                ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-3)]"
            )}
          >
            <span>
              <span className={cn("block text-xs font-black", filters.strugglingOnly ? "text-[var(--accent)]" : "text-[var(--text-1)]")}>
                {ui("Only what I get wrong")}
              </span>
              <span className="block text-[11px] font-semibold text-[var(--text-3)]">
                {ui("From your tracker — things you have missed or keep failing.")}
              </span>
            </span>
            {filters.strugglingOnly && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
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
              {uiNumber(results.length)} {ui("of")} {uiNumber(pool.length)} {ui("match")}
            </p>
            {ticked.size > 0 && (
              <button
                type="button"
                onClick={() => {
                  onAddMany(results.filter((item) => ticked.has(item.id) && !alreadyAdded.has(item.id)));
                  setTicked(new Set());
                }}
                className="accent-btn inline-flex h-9 items-center gap-2 px-4 text-xs"
              >
                <Check className="h-3.5 w-3.5" />
                {ui("Add selected")} {ticked.size}
              </button>
            )}
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
                const isTicked = ticked.has(item.id);
                return (
                  <div key={item.id} className="flex items-stretch gap-2">
                    {/* Ticking is separate from adding: one press to queue a
                        card, a different one to add it there and then. */}
                    <button
                      type="button"
                      disabled={added}
                      onClick={() => setTicked((current) => {
                        const next = new Set(current);
                        if (next.has(item.id)) next.delete(item.id);
                        else next.add(item.id);
                        return next;
                      })}
                      aria-pressed={isTicked}
                      aria-label={ui("Select this one")}
                      className={cn(
                        "flex w-9 shrink-0 items-center justify-center rounded-2xl transition-colors",
                        added ? "opacity-40" : "hover:bg-[var(--surface-3)]"
                      )}
                    >
                      {isTicked
                        ? <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
                        : <Square className="h-4 w-4 text-[var(--text-3)] opacity-50" />}
                    </button>
                  <button
                    type="button"
                    disabled={added}
                    onClick={() => onAdd(item)}
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-3.5 text-left transition-colors",
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
                  </div>
                );
              })}
            </div>
          )}
          {results.length > 0 && (
            mode === "scroll"
              ? (
                <ShowMore
                  shown={shown.length}
                  total={results.length}
                  onMore={() => setLoaded((value) => value + CATALOGUE_PAGE_SIZE * 2)}
                />
              )
              : <ListPager window={pages} onPage={setPage} />
          )}
          <LongListChoice mode={mode} onMode={chooseMode} total={results.length} />
          <ScrollJump enabled={mode === "scroll" && results.length >= LONG_LIST_THRESHOLD} />
        </>
      )}
    </section>
  );
}
