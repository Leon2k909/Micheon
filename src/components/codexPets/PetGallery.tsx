import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, RefreshCw, Search, Check } from "lucide-react";
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

export function PetGallery({ onInstalled }: { onInstalled: () => void }) {
  const [pets, setPets] = useState<GalleryPet[]>([]);
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number, nextSearch: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (nextSearch) params.set("search", nextSearch);
      const response = await fetch(`/api/pet-gallery?${params}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
      setPets(payload.pets ?? []);
      setInstalled(new Set(payload.installed ?? []));
      setPage(payload.page ?? nextPage);
      setTotalPages(payload.totalPages ?? 1);
      setTotal(payload.total ?? 0);
    } catch (reason) {
      // The gallery is a third-party service — it being down must never look
      // like the app being broken.
      setError(reason instanceof Error ? reason.message : "Could not reach the pet gallery");
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(1, ""); }, [load]);

  // Debounced, so typing doesn't fire a request per keystroke at the service.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search !== query) return;
      void load(1, search.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search, query, load]);

  const install = async (pet: GalleryPet) => {
    setBusyId(pet.id);
    setError(null);
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
      setError(reason instanceof Error ? reason.message : "Could not install that pet");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-5 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
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
          disabled={loading}
          onClick={() => void load(page, query.trim())}
          type="button"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      <label className="relative mt-3 block">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
        <input
          className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] pl-9 pr-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          onChange={(event) => { setSearch(event.target.value); setQuery(event.target.value); }}
          placeholder={ui("Search pets…")}
          type="search"
          value={search}
        />
      </label>

      {error && (
        <p className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-500">
          {error}
        </p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => {
          const already = installed.has(pet.id);
          const busy = busyId === pet.id;
          return (
            <div
              className="flex gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-2.5"
              key={pet.id}
            >
              {pet.previewUrl ? (
                <img
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-contain"
                  loading="lazy"
                  src={pet.previewUrl}
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

      {pets.length === 0 && !loading && !error && (
        <p className="mt-3 text-xs font-semibold text-[var(--text-3)]">{ui("No pets found.")}</p>
      )}

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            className="h-8 rounded-full bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] disabled:opacity-40"
            disabled={page <= 1 || loading}
            onClick={() => void load(page - 1, query.trim())}
            type="button"
          >
            {ui("Back")}
          </button>
          <span className="text-[11px] font-bold text-[var(--text-3)]">
            {page} / {totalPages}
          </span>
          <button
            className="h-8 rounded-full bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] disabled:opacity-40"
            disabled={page >= totalPages || loading}
            onClick={() => void load(page + 1, query.trim())}
            type="button"
          >
            {ui("Next")}
          </button>
        </div>
      )}
    </section>
  );
}
