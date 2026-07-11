import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, Search, Volume2, Star, Check, Minus, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildCatalog, type CatalogItem } from "@/session";
import { loadGradeStore, saveGradeStore, setItemStatus, setItemsStatus, statusForId, type GradeStore, type ItemStatus } from "@/lib/activity";
import { strengthInfo, setStrengthLevel, recordPermanent, REVIEW_INTERVALS_DAYS, type GradeRecord } from "@/lib/memoryStrength";
import { frequencyInfo, frequencyRank } from "@/lib/wordFrequency";
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
 *
 * Each pip is clickable: jump straight to that rung (e.g. "I already know
 * this cold, put me at Solid" or "I clicked too far, back to Learning")
 * instead of having to replay the item in a lesson to climb the ladder.
 */
function StrengthMeter({
  record,
  onSetLevel,
  onSetPermanent,
}: {
  record: GradeRecord | undefined;
  onSetLevel: (level: number) => void;
  onSetPermanent: () => void;
}) {
  const s = strengthInfo(record);
  const struggling = record?.lastGrade === "struggle";
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`Memory strength: ${s.label}. Click a bar to set it directly.`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            title={`Set to ${REVIEW_INTERVALS_DAYS[n - 1]}d review (rung ${n}/5)`}
            onClick={(e) => { e.stopPropagation(); onSetLevel(n); }}
            className="cursor-pointer p-1 -m-1"
          >
            <span
              className={cn(
                "block h-1.5 w-3 rounded-full transition-transform hover:scale-125",
                n <= s.level
                  ? struggling ? "bg-amber-500" : "bg-[var(--success-text)]"
                  : "bg-[var(--surface-3)] hover:bg-[var(--surface-3)]/70"
              )}
            />
          </button>
        ))}
        {/* Above Mastered: never schedule this word for review again. */}
        <button
          type="button"
          title={s.permanent ? "Never reviewed again" : "Mark permanent — never show this again"}
          onClick={(e) => { e.stopPropagation(); onSetPermanent(); }}
          className="cursor-pointer p-1 -m-1"
        >
          <Star
            className={cn(
              "h-3 w-3 transition-transform hover:scale-125",
              s.permanent
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--surface-3)] hover:text-[var(--accent)]/60"
            )}
          />
        </button>
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-wide",
        struggling ? "text-amber-600" : s.permanent ? "text-[var(--accent)]" : s.level > 0 ? "text-[var(--success-text)]" : "text-[var(--text-3)]"
      )}>
        {s.label}
      </span>
      {s.permanent && (
        <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]">
          never reviewed again
        </span>
      )}
      {!s.permanent && s.due && (
        <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]">
          due for review
        </span>
      )}
      {!s.permanent && !s.due && s.dueInDays != null && s.level > 0 && (
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

function BulkActionButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  tone: "known" | "struggle" | "new" | "permanent";
  onClick: () => void;
}) {
  const tones: Record<string, string> = {
    known: "border-[var(--success-text)]/30 text-[var(--success-text)] hover:bg-[var(--success-bg)]",
    struggle: "border-amber-500/40 text-amber-600 hover:bg-amber-500/15",
    new: "border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--surface-3)]",
    permanent: "border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent-dim)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border bg-[var(--surface)] px-3 text-[11px] font-black transition-colors",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/** Checkbox-style toggle used for row selection and the header select-all control. */
function SelectBox({
  checked,
  indeterminate = false,
  onClick,
  label,
  size = "h-5 w-5",
}: {
  checked: boolean;
  indeterminate?: boolean;
  onClick: () => void;
  label: string;
  size?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-pressed={checked}
      aria-label={label}
      title={label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        size,
        checked || indeterminate
          ? "border-[var(--accent)] bg-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/50"
      )}
    >
      {checked && <Check className="h-3.5 w-3.5 text-white" />}
      {!checked && indeterminate && <Minus className="h-3.5 w-3.5 text-white" />}
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
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    const matches = catalog.filter((item) => {
      const status = statusForId(grades, item.id, item.aliases);
      if (filter !== "all" && status !== filter) return false;
      if (!q) return true;
      return (
        item.de.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        item.partLabel.toLowerCase().includes(q)
      );
    });
    // Common words first; unranked items (sentences, slang) keep catalog order after.
    return matches.sort((a, b) => frequencyRank(a.lookup) - frequencyRank(b.lookup));
  }, [catalog, grades, filter, query]);

  const visible = filtered.slice(0, limit);

  // "Select all" targets every FILTERED item, not just the currently
  // rendered/paginated slice — selecting only what's on screen would be
  // confusing once more rows load in via "Show more".
  const allFilteredSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));
  const someFilteredSelected = filtered.some((i) => selected.has(i.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((i) => i.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const apply = (item: CatalogItem, status: ItemStatus) => {
    const next = setItemStatus(item.id, status, user, item.aliases);
    setGrades({ ...next });
  };

  // Direct ladder override — writes the exact rung instead of climbing one
  // success at a time, so the learner can correct the tracker on the spot.
  const applyStrength = (item: CatalogItem, level: number) => {
    const store = loadGradeStore(user);
    for (const alias of item.aliases ?? []) if (alias !== item.id) delete store[alias];
    const rec = setStrengthLevel(level);
    if (rec) store[item.id] = rec; else delete store[item.id];
    saveGradeStore(store, user);
    setGrades({ ...store });
  };

  // Above Mastered: mark a word so easy it should never be reviewed again.
  const applyPermanent = (item: CatalogItem) => {
    const store = loadGradeStore(user);
    for (const alias of item.aliases ?? []) if (alias !== item.id) delete store[alias];
    store[item.id] = recordPermanent();
    saveGradeStore(store, user);
    setGrades({ ...store });
  };

  // Bulk actions apply to every selected item in one load/save cycle.
  const bulkApplyStatus = (status: ItemStatus) => {
    const targets = catalog.filter((i) => selected.has(i.id));
    if (targets.length === 0) return;
    const next = setItemsStatus(targets.map((i) => ({ id: i.id, aliases: i.aliases })), status, user);
    setGrades({ ...next });
  };

  const bulkApplyPermanent = () => {
    const targets = catalog.filter((i) => selected.has(i.id));
    if (targets.length === 0) return;
    const store = loadGradeStore(user);
    for (const item of targets) {
      for (const alias of item.aliases ?? []) if (alias !== item.id) delete store[alias];
      store[item.id] = recordPermanent();
    }
    saveGradeStore(store, user);
    setGrades({ ...store });
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
        <SelectBox
          checked={allFilteredSelected}
          indeterminate={someFilteredSelected && !allFilteredSelected}
          onClick={toggleSelectAllFiltered}
          label={allFilteredSelected ? "Deselect all" : `Select all ${filtered.length} shown`}
          size="h-8 w-8"
        />
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

      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-dim)] px-4 py-3">
          <span className="text-xs font-black text-[var(--accent)]">
            {selected.size} selected
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <BulkActionButton tone="known" icon={CheckCircle2} label="Known" onClick={() => bulkApplyStatus("known")} />
            <BulkActionButton tone="struggle" icon={AlertTriangle} label="Struggle" onClick={() => bulkApplyStatus("struggle")} />
            <BulkActionButton tone="new" icon={Circle} label="To learn" onClick={() => bulkApplyStatus("new")} />
            <BulkActionButton tone="permanent" icon={Star} label="Permanent" onClick={bulkApplyPermanent} />
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-black text-[var(--text-3)] hover:text-[var(--text-1)]"
            >
              <XIcon className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 divide-y divide-[var(--border)]">
        {visible.map((item) => {
          const status = statusForId(grades, item.id, item.aliases);
          return (
            <div key={item.id} className="flex flex-wrap items-center gap-3 py-3">
              <SelectBox
                checked={selected.has(item.id)}
                onClick={() => toggleSelect(item.id)}
                label={selected.has(item.id) ? `Deselect ${item.de}` : `Select ${item.de}`}
              />
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
                  {item.en} · {item.partLabel}{item.use ? ` · ${item.use}` : ""}
                  {(() => { const f = frequencyInfo(item.lookup); return f ? <span className="font-black text-sky-600"> · {f.label}</span> : null; })()}
                </p>
                <StrengthMeter
                  record={recordFor(grades, item.id, item.aliases)}
                  onSetLevel={(level) => applyStrength(item, level)}
                  onSetPermanent={() => applyPermanent(item)}
                />
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
