import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, Search, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildCatalog, type CatalogItem } from "@/session";
import { loadGradeStore, setItemStatus, statusForId, type GradeStore, type ItemStatus } from "@/lib/activity";
import { strengthInfo, type GradeRecord } from "@/lib/memoryStrength";
import { getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { tts } from "@/lib/voice";

type Part = Record<string, any>;
type FilterKey = "all" | "known" | "struggle" | "new";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "known", label: "Known" },
  { key: "struggle", label: "Struggling" },
  { key: "new", label: "To learn" },
];

function speak(text: string) {
  tts(text, 0.9, "de-DE");
}

function recordFor(grades: GradeStore, id: string, aliases: string[] = []): GradeRecord | undefined {
  for (const key of [id, ...aliases]) {
    const rec = grades?.[key];
    if (rec?.lastGrade) return rec;
  }
  return undefined;
}

/**
 * Memory strength meter: 5 pips fill as the spaced-repetition ladder climbs
 * (1d -> 3d -> 7d -> 14d -> 30d -> 90d review intervals). "Due" means the item
 * is about to return to lessons for review.
 */
function StrengthMeter({ record }: { record: GradeRecord | undefined }) {
  const s = strengthInfo(record);
  const struggling = record?.lastGrade === "struggle";
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`Memory strength: ${s.label}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1.5 w-3 rounded-full",
              n <= s.level
                ? struggling ? "bg-amber-500" : "bg-[var(--success-text)]"
                : "bg-[var(--surface-3)]"
            )}
          />
        ))}
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-wide",
        struggling ? "text-amber-600" : s.level > 0 ? "text-[var(--success-text)]" : "text-[var(--text-3)]"
      )}>
        {s.label}
      </span>
      {s.due && (
        <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]">
          due for review
        </span>
      )}
      {!s.due && s.dueInDays != null && s.level > 0 && (
        <span className="text-[10px] font-bold text-[var(--text-3)]">
          review in {s.dueInDays}d
        </span>
      )}
    </div>
  );
}

function StatusButton({
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

export function VocabTracker({
  apiParts,
  user = getAuthUser(),
}: {
  apiParts: Record<string, Part>;
  user?: UserProfile | null;
}) {
  const [grades, setGrades] = useState<GradeStore>(() => loadGradeStore(user));
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(40);

  useEffect(() => {
    const onUpdate = () => setGrades(loadGradeStore(user));
    window.addEventListener("grades-updated", onUpdate);
    return () => window.removeEventListener("grades-updated", onUpdate);
  }, [user]);

  const catalog = useMemo(() => buildCatalog(apiParts), [apiParts]);

  const counts = useMemo(() => {
    let known = 0;
    let struggle = 0;
    let fresh = 0;
    let due = 0;
    for (const item of catalog) {
      const s = statusForId(grades, item.id, item.aliases);
      if (s === "known") {
        known += 1;
        if (strengthInfo(recordFor(grades, item.id, item.aliases)).due) due += 1;
      }
      else if (s === "struggle") struggle += 1;
      else fresh += 1;
    }
    return { known, struggle, new: fresh, due, total: catalog.length };
  }, [catalog, grades]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((item) => {
      const status = statusForId(grades, item.id, item.aliases);
      if (filter !== "all" && status !== filter) return false;
      if (!q) return true;
      return (
        item.de.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        item.partLabel.toLowerCase().includes(q)
      );
    });
  }, [catalog, grades, filter, query]);

  const visible = filtered.slice(0, limit);

  const apply = (item: CatalogItem, status: ItemStatus) => {
    const next = setItemStatus(item.id, status, user, item.aliases);
    setGrades({ ...next });
  };

  if (catalog.length === 0) {
    return (
      <section className="card p-5 sm:p-6">
        <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Word & sentence tracker</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--text-3)]">Loading your vocabulary catalog…</p>
      </section>
    );
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Word & sentence tracker</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
            Review what you know, mark struggles, or reset items back to learn again.
          </p>
        </div>
        <div className="flex gap-2 text-center">
          <div className="rounded-2xl bg-[var(--success-bg)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--success-text)]">{counts.known}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--success-text)] opacity-80">known</p>
          </div>
          <div className="rounded-2xl bg-[var(--accent-dim)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--accent)]">{counts.due}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--accent)] opacity-80">due review</p>
          </div>
          <div className="rounded-2xl bg-amber-500/15 px-3 py-2">
            <p className="text-lg font-black leading-none text-amber-600">{counts.struggle}</p>
            <p className="mt-1 text-[10px] font-black text-amber-600 opacity-80">struggling</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--text-1)]">{counts.new}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">to learn</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => { setFilter(f.key); setLimit(40); }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black transition-colors",
              filter === f.key
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setLimit(40); }}
            placeholder="Search German or English…"
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] pl-9 pr-3 text-sm font-bold text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="mt-4 divide-y divide-[var(--border)]">
        {visible.map((item) => {
          const status = statusForId(grades, item.id, item.aliases);
          return (
            <div key={item.id} className="flex flex-wrap items-center gap-3 py-3">
              <button
                type="button"
                onClick={() => speak(item.de)}
                aria-label="Play German audio"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)] hover:bg-[var(--surface-3)]"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-[var(--text-1)]">{item.de}</p>
                <p className="truncate text-xs font-semibold text-[var(--text-3)]">
                  {item.en} · {item.partLabel}
                </p>
                <StrengthMeter record={recordFor(grades, item.id, item.aliases)} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusButton
                  tone="known" icon={CheckCircle2} label="Known"
                  active={status === "known"}
                  onClick={() => apply(item, status === "known" ? "new" : "known")}
                />
                <StatusButton
                  tone="struggle" icon={AlertTriangle} label="Struggle"
                  active={status === "struggle"}
                  onClick={() => apply(item, status === "struggle" ? "new" : "struggle")}
                />
                <StatusButton
                  tone="new" icon={Circle} label="To learn"
                  active={status === "new"}
                  onClick={() => apply(item, "new")}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm font-semibold text-[var(--text-3)]">No items match this filter.</p>
      )}

      {visible.length < filtered.length && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + 40)}
          className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-3 text-sm font-black text-[var(--text-2)] hover:bg-[var(--surface-3)]"
        >
          Show more ({filtered.length - visible.length} remaining)
        </button>
      )}
    </section>
  );
}
