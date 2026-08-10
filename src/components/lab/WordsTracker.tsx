import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle, Search, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui, uiIsGerman } from "@/lib/i18n";
import { buildWordCatalog, rankWordCatalog, type WordItem } from "@/lib/wordSession";
import { loadGradeStore, setItemStatus, statusForId, type ItemStatus } from "@/lib/activity";
import { isDueForReview, strengthInfo } from "@/lib/memoryStrength";
import { frequencyInfo } from "@/lib/wordFrequency";
import { tts } from "@/lib/voice";
import { targetLangTag } from "@/lib/direction";
import type { Part } from "@/lib/types";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * The words tracker: vocabulary progress in exactly the sentence tracker's
 * clothes — same tiles, same pills, same controls row, same list rows — so
 * the two read as one family. It stays a SEPARATE component on purpose: the
 * sentence tracker indexes ~16,000 sentences through priority, search and
 * commonality indexes, and folding 3,000+ words into that list was called
 * out as a lag risk before it could ship.
 *
 * Word progress lives under vw- ids that only vocabulary sittings and the
 * tests bank write, so marking a word Known here is the same record those
 * surfaces read.
 */
const PAGE = 40;

type Filter = "all" | "known" | "due" | "struggle" | "new";
type Sort = "common" | "alpha" | "status";

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "All" },
  { key: "known", label: "Known" },
  { key: "due", label: "Due review" },
  { key: "struggle", label: "Struggling" },
  { key: "new", label: "To learn" },
];

const SORTS: Array<{ key: Sort; label: string }> = [
  { key: "common", label: "Most common first" },
  { key: "alpha", label: "Alphabetical" },
  { key: "status", label: "Needs attention first" },
];

export function WordsTracker({ apiParts, user }: {
  apiParts: Record<string, Part>;
  user: UserProfile | null;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("common");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);

  const catalog = useMemo(() => rankWordCatalog(buildWordCatalog(apiParts), null), [apiParts]);
  const grades = useMemo(() => loadGradeStore(user), [user, revision]);

  const statusOf = (word: WordItem): Filter => {
    const record = grades[word.id];
    if (record?.lastGrade === "struggle") return "struggle";
    if (record?.lastGrade === "know") return isDueForReview(record) ? "due" : "known";
    return "new";
  };

  const counts = useMemo(() => {
    const out = { known: 0, due: 0, struggle: 0, new: 0 };
    for (const word of catalog) out[statusOf(word) as Exclude<Filter, "all">] += 1;
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, grades]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = catalog.filter((word) => {
      if (filter !== "all" && statusOf(word) !== filter) return false;
      if (!needle) return true;
      return word.de.toLowerCase().includes(needle)
        || word.en.toLowerCase().includes(needle)
        || word.lookup.toLowerCase().includes(needle);
    });
    if (sort === "alpha") {
      return [...rows].sort((a, b) => a.de.localeCompare(b.de, "de"));
    }
    if (sort === "status") {
      const rank: Record<Filter, number> = { struggle: 0, due: 1, new: 2, known: 3, all: 4 };
      return [...rows].sort((a, b) => rank[statusOf(a)] - rank[statusOf(b)]);
    }
    return rows; // the catalogue is already most-common-first
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, filter, query, sort, grades]);

  const visible = filtered.slice(0, page * PAGE);

  const apply = (word: WordItem, status: ItemStatus) => {
    setItemStatus(word.id, status, user);
    setRevision((current) => current + 1);
  };

  const reset = () => setPage(1);

  return (
    <section className="card mt-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Words tracker")}</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
            {ui("Single words from vocabulary lessons. Sentences live in the tracker above — the two never mix.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-center">
          <div className="rounded-2xl bg-[var(--success-bg)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--success-text)]">{counts.known.toLocaleString()}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--success-text)] opacity-80">{ui("known")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--accent-dim)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--accent)]">{counts.due.toLocaleString()}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--accent)] opacity-80">{ui("due review")}</p>
          </div>
          <div className="rounded-2xl bg-amber-500/15 px-3 py-2">
            <p className="text-lg font-black leading-none text-amber-600">{counts.struggle.toLocaleString()}</p>
            <p className="mt-1 text-[10px] font-black text-amber-600 opacity-80">{ui("struggling")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--text-1)]">{counts.new.toLocaleString()}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">{ui("to learn")}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => { setFilter(f.key); reset(); }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black transition-colors",
              filter === f.key
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
            )}
          >
            {ui(f.label)}
          </button>
        ))}
        <p className="ml-auto text-xs font-bold text-[var(--text-3)]">
          {filtered.length.toLocaleString()} {ui("of")} {catalog.length.toLocaleString()} {ui("items")}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 sm:grid-cols-2">
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Sort by")}</span>
          <select
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => { setSort(event.target.value as Sort); reset(); }}
            value={sort}
          >
            {SORTS.map((option) => (
              <option key={option.key} value={option.key}>{ui(option.label)}</option>
            ))}
          </select>
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Search")}</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); reset(); }}
              placeholder={ui("German or English…")}
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            />
          </span>
        </label>
      </div>

      <div
        className="mt-4 h-[min(34rem,65vh)] min-h-[24rem] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4"
        aria-label={ui("Words tracker")}
        tabIndex={0}
      >
        <div className="divide-y divide-[var(--border)]">
          {visible.map((word) => {
            const status = statusForId(grades, word.id);
            const primaryText = uiIsGerman() ? word.en : word.de;
            const meaningText = uiIsGerman() ? word.de : word.en;
            const frequency = frequencyInfo(word.lookup || word.de);
            const strength = strengthInfo(grades[word.id]);
            return (
              <div key={word.id} className="flex flex-wrap items-center gap-3 py-3">
                <button
                  type="button"
                  onClick={() => tts(uiIsGerman() ? word.en : word.de, 0.9, targetLangTag())}
                  aria-label={ui(uiIsGerman() ? "Play English audio" : "Play German audio")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)] hover:bg-[var(--surface-3)]"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-black text-[var(--text-1)]">{primaryText}</p>
                    {frequency && (
                      <span
                        className="shrink-0 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-sky-600"
                        title={ui(frequency.hint)}
                      >
                        {ui(frequency.label)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs font-semibold text-[var(--text-3)]">
                    {meaningText}
                    {word.pos ? ` · ${ui(word.pos)}` : ""}
                    {status !== "new" ? ` · ${ui(strength.label)}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <WordStatusButton
                    tone="known" icon={CheckCircle2} label={ui("Known")}
                    active={status === "known"}
                    onClick={() => apply(word, status === "known" ? "new" : "known")}
                  />
                  <WordStatusButton
                    tone="struggle" icon={AlertTriangle} label={ui("Struggle")}
                    active={status === "struggle"}
                    onClick={() => apply(word, status === "struggle" ? "new" : "struggle")}
                  />
                  <WordStatusButton
                    tone="new" icon={Circle} label={ui("To learn")}
                    active={status === "new"}
                    onClick={() => apply(word, "new")}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm font-semibold text-[var(--text-3)]">{ui("No items match this filter.")}</p>
        )}

        {visible.length < filtered.length && (
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            className="my-3 flex h-10 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-black text-[var(--text-2)] hover:bg-[var(--surface-3)]"
          >
            {ui("Show more")} ({visible.length.toLocaleString()} / {filtered.length.toLocaleString()})
          </button>
        )}
      </div>
    </section>
  );
}

/** The sentence tracker's StatusButton, verbatim — same tones, same shape. */
function WordStatusButton({
  active,
  onClick,
  tone,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  tone: "known" | "struggle" | "new";
  icon: React.ElementType;
  label: string;
}) {
  const tones: Record<string, string> = {
    known: active
      ? "bg-[var(--success-bg)] text-[var(--success-text)] border-transparent"
      : "border-[var(--border)] text-[var(--text-3)] hover:text-[var(--success-text)]",
    struggle: active
      ? "bg-amber-500/15 text-amber-600 border-transparent"
      : "border-[var(--border)] text-[var(--text-3)] hover:text-amber-600",
    new: active
      ? "bg-[var(--surface-3)] text-[var(--text-1)] border-transparent"
      : "border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text-1)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-black transition-colors",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
