import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, Loader2, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

/**
 * Browse codex-pets.net and install a pet with one click.
 *
 * Everything goes through the local server: it proxies the listing so the page
 * makes no cross-origin requests, and an install is one call that downloads,
 * checks and unpacks the bundle into the folder the pet loader already reads.
 */

type GalleryPet = {
  id: string;
  displayName: string;
  description: string;
  kind: string;
  tags: string[];
  owner: string;
  likeCount: number;
  downloadCount: number;
  previewUrl: string;
  posterUrl: string;
};

type LoadMode = "replace" | "refresh" | "more";
type LoadState = LoadMode | null;

function appendUniquePets(current: GalleryPet[], incoming: GalleryPet[]) {
  const seen = new Set(current.map((pet) => pet.id));
  const next = [...current];
  incoming.forEach((pet) => {
    if (seen.has(pet.id)) return;
    seen.add(pet.id);
    next.push(pet);
  });
  return next;
}

export function PetGallery({ onInstalled }: { onInstalled: () => void }) {
  const [pets, setPets] = useState<GalleryPet[]>([]);
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("replace");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [installError, setInstallError] = useState<string | null>(null);
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const requestGenerationRef = useRef(0);

  const load = useCallback(async (nextPage: number, nextSearch: string, mode: LoadMode) => {
    const generation = requestGenerationRef.current + 1;
    requestGenerationRef.current = generation;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setLoadState(mode);
    setGalleryError(null);
    setMoreError(null);
    if (mode === "replace") {
      setPets([]);
      setPage(0);
      setTotalPages(1);
      setTotal(0);
      if (scrollRootRef.current) scrollRootRef.current.scrollTop = 0;
    }

    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (nextSearch) params.set("search", nextSearch);
      const response = await fetch(`/api/pet-gallery?${params}`, { signal: controller.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
      if (generation !== requestGenerationRef.current) return;

      const incoming = Array.isArray(payload.pets) ? payload.pets : [];
      setPets((current) => mode === "more" ? appendUniquePets(current, incoming) : incoming);
      setInstalled(new Set(payload.installed ?? []));
      setPage(payload.page ?? nextPage);
      setTotalPages(Math.max(1, payload.totalPages ?? 1));
      setTotal(Math.max(0, payload.total ?? 0));
    } catch (reason) {
      if ((reason as { name?: string })?.name === "AbortError") return;
      if (generation !== requestGenerationRef.current) return;

      // The gallery is a third-party service. A later page failing should not
      // discard pets the learner has already browsed.
      const message = reason instanceof Error ? reason.message : "Could not reach the pet gallery";
      if (mode === "more") setMoreError(message);
      else setGalleryError(message);
    } finally {
      if (generation === requestGenerationRef.current) setLoadState(null);
    }
  }, []);

  // Debounce only the committed query. The query effect below owns fetching,
  // so mounting and clearing the search each make exactly one page-one request.
  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    void load(1, query, "replace");
  }, [load, query]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const hasMore = page > 0 && page < totalPages;
  const loadMore = useCallback(() => {
    if (!hasMore || loadState !== null || moreError) return;
    void load(page + 1, query, "more");
  }, [hasMore, load, loadState, moreError, page, query]);

  // Keep the observer rooted to the gallery, not the page. There may be
  // thousands of pets, and the settings below this control must stay reachable.
  useEffect(() => {
    const root = scrollRootRef.current;
    const target = loadMoreRef.current;
    if (!root || !target || !hasMore || loadState !== null || moreError) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { root, rootMargin: "180px 0px", threshold: 0.01 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loadState, moreError]);

  const install = async (pet: GalleryPet) => {
    setBusyId(pet.id);
    setInstallError(null);
    try {
      const response = await fetch(`/api/pet-gallery/${encodeURIComponent(pet.id)}/install`, {
        method: "POST",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `Install failed (${response.status})`);
      setInstalled((current) => new Set(current).add(pet.id));
      // The catalogue is read from disk, so it has to be refetched before the
      // new pet can be picked.
      onInstalled();
    } catch (reason) {
      setInstallError(reason instanceof Error ? reason.message : "Could not install that pet");
    } finally {
      setBusyId(null);
    }
  };

  const retryFirstPage = () => {
    void load(1, query, pets.length > 0 ? "refresh" : "replace");
  };

  const initialLoading = loadState === "replace" && pets.length === 0;
  const loadingMore = loadState === "more";

  return (
    <section className="mt-5 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4" aria-busy={loadState !== null}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[var(--text-1)]">{ui("Get more pets")}</h3>
          <p className="mt-0.5 text-xs font-semibold text-[var(--text-3)]">
            {total > 0
              ? `${total.toLocaleString()} ${ui("pets shared on codex-pets.net")}`
              : ui("Browse pets shared on codex-pets.net")}
          </p>
        </div>
        <button
          aria-label={ui("Refresh")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:text-[var(--accent)] disabled:opacity-50"
          disabled={loadState !== null}
          onClick={() => void load(1, query, "refresh")}
          type="button"
        >
          <RefreshCw className={cn("h-4 w-4", loadState === "refresh" && "animate-spin")} />
        </button>
      </div>

      <label className="relative mt-3 block">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
        <input
          aria-label={ui("Search pets…")}
          className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] pl-9 pr-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => setSearch(event.target.value)}
          placeholder={ui("Search pets…")}
          type="search"
          value={search}
        />
      </label>

      {galleryError && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-500" role="alert">
          <span>{galleryError}</span>
          <button className="shrink-0 underline underline-offset-2" onClick={retryFirstPage} type="button">
            {ui("Try again")}
          </button>
        </div>
      )}

      {installError && (
        <p className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-500" role="alert">
          {installError}
        </p>
      )}

      <div
        aria-label={ui("Pet gallery results")}
        className="mt-3 h-[min(34rem,65vh)] min-h-64 overflow-y-auto overscroll-contain rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        ref={scrollRootRef}
        tabIndex={0}
      >
        <div className="grid gap-2 pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {initialLoading && Array.from({ length: 9 }, (_, index) => (
            <div
              aria-hidden="true"
              className="flex animate-pulse gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-2.5"
              key={index}
            >
              <div className="h-14 w-14 shrink-0 rounded-lg bg-[var(--surface-3)]" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-4/5 rounded-full bg-[var(--surface-3)]" />
                <div className="h-2.5 w-3/5 rounded-full bg-[var(--surface-3)]" />
                <div className="h-7 w-16 rounded-full bg-[var(--surface-3)]" />
              </div>
            </div>
          ))}

          {pets.map((pet) => {
            const already = installed.has(pet.id);
            const busy = busyId === pet.id;
            return (
              <div
                className="flex gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-2.5"
                key={pet.id}
              >
                {/* The poster is a single 192x208 frame. "preview" is the whole
                    animation strip, so it is only a last resort. */}
                {pet.posterUrl || pet.previewUrl ? (
                  <img
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg bg-[var(--surface-3)] object-contain"
                    loading="lazy"
                    src={pet.posterUrl || pet.previewUrl}
                  />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-[var(--surface-3)]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-[var(--text-1)]" title={pet.displayName}>
                    {pet.displayName}
                  </p>
                  <p className="truncate text-[11px] font-semibold text-[var(--text-3)]">
                    {pet.owner ? `@${pet.owner}` : pet.kind}
                  </p>
                  <button
                    className={cn(
                      "mt-1.5 inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-black transition-colors",
                      already
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
                    )}
                    disabled={already || busy}
                    onClick={() => void install(pet)}
                    type="button"
                  >
                    {busy
                      ? <><Loader2 className="h-3 w-3 animate-spin" />{ui("Installing…")}</>
                      : already
                        ? <><Check className="h-3 w-3" />{ui("Installed")}</>
                        : <><Download className="h-3 w-3" />{ui("Add")}</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {pets.length === 0 && !initialLoading && !galleryError && (
          <p className="px-1 py-4 text-xs font-semibold text-[var(--text-3)]">{ui("No pets found.")}</p>
        )}

        <div className="flex min-h-14 items-center justify-center px-2 py-3 text-center" ref={loadMoreRef}>
          {loadingMore ? (
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-3)]" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" /> {ui("Loading more…")}
            </p>
          ) : moreError ? (
            <div className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-500" role="alert">
              <p>{ui("Could not load more pets.")}</p>
              <button className="mt-1 underline underline-offset-2" onClick={() => void load(page + 1, query, "more")} type="button">
                {ui("Try again")}
              </button>
            </div>
          ) : hasMore ? (
            <button className="rounded-full bg-[var(--surface-2)] px-3 py-2 text-xs font-black text-[var(--text-2)]" onClick={loadMore} type="button">
              {ui("Load more pets")}
            </button>
          ) : pets.length > 0 ? (
            <p className="text-[11px] font-bold text-[var(--text-3)]" aria-live="polite">
              {ui("You've reached the end.")}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
