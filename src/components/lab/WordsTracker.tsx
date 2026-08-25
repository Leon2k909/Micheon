import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Check, Circle, Minus, Search, Star, Volume2, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui, uiFmt, uiIsEnglish, uiLocale, uiNumber } from "@/lib/i18n";
import { buildWordCatalog, rankWordCatalog, type WordItem } from "@/lib/wordSession";
import { useLearningMode } from "@/lib/learningMode";
import { buildWordExampleIndex } from "@/lib/wordExamples";
import { buildCorpusIndex } from "@/lib/corpusFrequency";
import {
  loadGradeStore,
  progressEntryForId,
  saveGradeStore,
  setCanonicalGradeRecord,
  setItemStatus,
  setItemsStatus,
  statusForId,
  type ItemStatus,
} from "@/lib/activity";
import {
  isDueForReview,
  isSnoozed,
  recordPermanent,
  setStrengthLevel,
  strengthInfo,
  recallDetail,
  REVIEW_INTERVALS_DAYS,
  type GradeRecord,
} from "@/lib/memoryStrength";
import { frequencyInfo, synonymCommonality } from "@/lib/wordFrequency";
import { packMeta } from "@/lib/curriculum";
import { tts } from "@/lib/voice";
import { targetLangTag } from "@/lib/direction";
import { courseSides } from "@/lib/courseLanguages";
import { frenchFor } from "@/lib/frenchCourse";
import {
  WORD_PART_OF_SPEECH_FILTERS,
  wordMatchesPartOfSpeech,
  type WordPartOfSpeechFilter,
} from "@/lib/wordPartOfSpeech";
import {
  sortWordTrackerRows,
  WORD_TRACKER_SORTS,
  type WordTrackerSort,
} from "@/lib/wordTrackerSort";
import type { Part } from "@/lib/types";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * The words tracker: vocabulary progress in exactly the sentence tracker's
 * clothes — same tiles, same pills, same controls row, same list rows, same
 * strength bars/star and bulk-select machinery — so the two read as one
 * family. It stays a SEPARATE component on purpose: the sentence tracker
 * indexes ~16,000 sentences through priority, search and commonality
 * indexes, and folding 3,000+ words into that list was called out as a lag
 * risk before it could ship. A few historical lookup spellings produce the
 * same visible word, so their old ids travel as aliases and migrate into the
 * surviving canonical id on the next write.
 *
 * Word progress lives under vw- ids that only vocabulary sittings and the
 * tests bank write, so marking a word Known here is the same record those
 * surfaces read.
 *
 * Mounted as a TAB in Gamification.tsx, not a card of its own — the outer
 * `.card` chrome, its padding, and the Sätze/Wörter switcher all live there.
 * This component's root section deliberately carries no `card` class and no
 * padding of its own (only `mt-4`, to clear the tab row above it): it is
 * tab CONTENT, swapped in and out of a shell it does not own. Rendering it
 * standalone (outside that shell) would look unstyled and flush to the
 * edges for exactly that reason — this is expected, not a bug.
 */
const PAGE = 40;

type Filter = "all" | "known" | "due" | "struggle" | "new";

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "All" },
  { key: "known", label: "Known" },
  { key: "due", label: "Due review" },
  { key: "struggle", label: "Struggling" },
  { key: "new", label: "To learn" },
];

/**
 * Memory strength meter: 5 pips fill as the spaced-repetition ladder climbs
 * (1d -> 3d -> 10d -> 30d -> 180d review intervals), plus a star for the
 * tier above Mastered. Copied from the sentence tracker's StrengthMeter —
 * same pips, same star, same fading/due chip — operating on a bare
 * GradeRecord, so it needs nothing word-specific to work here.
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
  const decay = recallDetail(record);
  const struggling = record?.lastGrade === "struggle";
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <div className="flex items-center gap-0.5" aria-label={`${ui("Memory strength")}: ${ui(s.label)}. ${ui("Click a bar to set it directly.")}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            title={REVIEW_INTERVALS_DAYS[n - 1] === 1
              ? uiFmt("Come back in {days} day (level {level} of 5)", { days: REVIEW_INTERVALS_DAYS[n - 1], level: n })
              : uiFmt("Come back in {days} days (level {level} of 5)", { days: REVIEW_INTERVALS_DAYS[n - 1], level: n })}
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
          title={ui(s.permanent ? "Never reviewed again" : "Mark permanent — never show this again")}
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
        {ui(s.label)}
      </span>
      {s.permanent && (
        <span className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]">
          {ui("never reviewed again")}
        </span>
      )}
      {!s.permanent && s.due && !decay.fading && (
        <span
          className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]"
          title={ui("Its review is due today. Answer it once and it counts in full again, on a longer interval.")}
        >
          {ui("due for review")}
        </span>
      )}
      {decay.fading && (
        <span
          className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-600"
          title={uiFmt("{days} days past its review, so you are assumed to still recall {kept}% of it — that is how much it counts towards your total right now. It halves every {halfLife} days towards {floor}% and never drops below that. Getting it right once puts it back to 100%.", {
            days: Math.round(decay.overdueDays),
            kept: Math.round(decay.weight * 100),
            halfLife: Math.round(decay.halfLifeDays),
            floor: Math.round(decay.floor * 100),
          })}
        >
          {uiFmt("{days} days overdue · {kept}% remembered", {
            days: Math.round(decay.overdueDays),
            kept: Math.round(decay.weight * 100),
          })}
        </span>
      )}
      {!s.permanent && !s.due && s.dueInDays != null && s.level > 0 && (
        <span className="text-[10px] font-bold text-[var(--text-3)]">
          {ui("review in")} {s.dueInDays} {ui("days short")}
        </span>
      )}
    </div>
  );
}

/** Checkbox-style toggle used for row selection and the header select-all control — copied from the sentence tracker. */
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
        "inline-flex h-8 items-center gap-1.5 rounded-full border bg-[var(--surface)] px-3 text-xs font-black tracking-[0.01em] transition-colors",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function WordsTracker({ apiParts, user }: {
  apiParts: Record<string, Part>;
  user: UserProfile | null;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [partOfSpeech, setPartOfSpeech] = useState<WordPartOfSpeechFilter>("all");
  const [sort, setSort] = useState<WordTrackerSort>("common");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // The catalogue stays German — its frequency ranking, its part-of-speech
  // tags and its progress ids all key on the German. Only the two lines of
  // text on a row, and the alphabet they are indexed under, follow the course.
  const sides = courseSides();
  const learnsEnglish = sides.target.code === "en";
  const alphabetLanguage = sides.target.code;

  // The catalogue depends on the learning style now: Conversation fronts the
  // word people say, exam practice the word people write. Memoising on the
  // parts alone left the tracker showing the other mode's faces until the
  // screen was rebuilt.
  const learningMode = useLearningMode();
  // The index is what tells conversation mode which words people actually say,
  // and it was not being built here — so the tracker ranked by written
  // frequency in both modes and entsprechend stayed at 108. It is memoised on
  // the parts object inside buildCorpusIndex too, so the other screens that
  // already build it and this one share the one walk of the course.
  const corpusIndex = useMemo(() => buildCorpusIndex(apiParts as any), [apiParts]);
  const catalog = useMemo(
    () => rankWordCatalog(buildWordCatalog(apiParts, learningMode), corpusIndex, learningMode),
    [apiParts, corpusIndex, learningMode]
  );
  const commonRanks = useMemo(
    () => new Map(catalog.map((word, index) => [word.id, index])),
    [catalog]
  );
  const exampleIndex = useMemo(() => buildWordExampleIndex(apiParts), [apiParts]);
  const grades = useMemo(() => loadGradeStore(user), [user, revision]);
  const recordFor = (word: WordItem) =>
    progressEntryForId(grades, word.id, word.aliases)?.record;

  // Word grades share the same "grades-updated" event every grade write in
  // the app dispatches, so a word graded elsewhere (another tracker instance,
  // a vocabulary lesson finishing) is reflected here without needing an
  // interaction on this component first.
  useEffect(() => {
    const onUpdate = () => setRevision((r) => r + 1);
    window.addEventListener("grades-updated", onUpdate);
    return () => window.removeEventListener("grades-updated", onUpdate);
  }, []);

  const statusOf = (word: WordItem): Filter => {
    const record = recordFor(word);
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
      if (!wordMatchesPartOfSpeech(word.pos, partOfSpeech)) return false;
      if (!needle) return true;
      // A combined card answers for every word in it: searching a less common
      // synonym has to find the card that now carries it.
      return word.de.toLowerCase().includes(needle)
        || word.en.toLowerCase().includes(needle)
        || word.lookup.toLowerCase().includes(needle)
        || (word.synonyms ?? []).some((syn) =>
          syn.de.toLowerCase().includes(needle)
          || syn.en.toLowerCase().includes(needle)
          || syn.lookup.toLowerCase().includes(needle));
    });
    return sortWordTrackerRows(
      rows,
      sort,
      recordFor,
      commonRanks,
      alphabetLanguage
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alphabetLanguage, catalog, commonRanks, filter, partOfSpeech, query, sort, grades]);

  const visible = filtered.slice(0, page * PAGE);

  const reset = () => setPage(1);

  // "Select all" targets every FILTERED word, not just the currently
  // rendered/paginated slice — matches the sentence tracker's behaviour.
  const allFilteredSelected = filtered.length > 0 && filtered.every((w) => selected.has(w.id));
  const someFilteredSelected = filtered.some((w) => selected.has(w.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((w) => w.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const apply = (word: WordItem, status: ItemStatus) => {
    setItemStatus(word.id, status, user, word.aliases);
    setRevision((current) => current + 1);
  };

  // Direct ladder override — writes the exact rung instead of climbing one
  // success at a time, so the learner can correct the tracker on the spot.
  // Any historical alias is folded into the surviving word id on write.
  const applyStrength = (word: WordItem, level: number) => {
    const store = loadGradeStore(user);
    const prior = progressEntryForId(store, word.id, word.aliases)?.record;
    const rec = setStrengthLevel(level, Date.now(), prior);
    if (rec) setCanonicalGradeRecord(store, word.id, word.aliases, rec);
    else {
      delete store[word.id];
      for (const alias of word.aliases ?? []) delete store[alias];
    }
    saveGradeStore(store, user);
    setRevision((r) => r + 1);
  };

  // Above Mastered: mark a word so easy it should never be reviewed again.
  const applyPermanent = (word: WordItem) => {
    const store = loadGradeStore(user);
    const prior = progressEntryForId(store, word.id, word.aliases)?.record;
    setCanonicalGradeRecord(store, word.id, word.aliases, recordPermanent(Date.now(), prior));
    saveGradeStore(store, user);
    setRevision((r) => r + 1);
  };

  // Bulk actions apply to every selected word in one load/save cycle.
  const bulkApplyStatus = (status: ItemStatus) => {
    const targets = catalog.filter((w) => selected.has(w.id));
    if (targets.length === 0) return;
    setItemsStatus(targets.map((w) => ({ id: w.id, aliases: w.aliases })), status, user);
    setRevision((r) => r + 1);
  };

  const bulkApplyPermanent = () => {
    const targets = catalog.filter((w) => selected.has(w.id));
    if (targets.length === 0) return;
    const store = loadGradeStore(user);
    for (const w of targets) {
      const prior = progressEntryForId(store, w.id, w.aliases)?.record;
      setCanonicalGradeRecord(store, w.id, w.aliases, recordPermanent(Date.now(), prior));
    }
    saveGradeStore(store, user);
    setRevision((r) => r + 1);
  };

  return (
    <section className="mt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Words tracker")}</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
            {ui("Single words from vocabulary lessons. Sentences live in the tracker above — the two never mix.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-center">
          <div className="rounded-2xl bg-[var(--success-bg)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--success-text)]">{uiNumber(counts.known)}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--success-text)] opacity-80">{ui("known")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--accent-dim)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--accent)]">{uiNumber(counts.due)}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--accent)] opacity-80">{ui("due review")}</p>
          </div>
          <div className="rounded-2xl bg-amber-500/15 px-3 py-2">
            <p className="text-lg font-black leading-none text-amber-600">{uiNumber(counts.struggle)}</p>
            <p className="mt-1 text-[10px] font-black text-amber-600 opacity-80">{ui("struggling")}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-2">
            <p className="text-lg font-black leading-none text-[var(--text-1)]">{uiNumber(counts.new)}</p>
            <p className="mt-1 text-[10px] font-black text-[var(--text-3)]">{ui("to learn")}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <SelectBox
          checked={allFilteredSelected}
          indeterminate={someFilteredSelected && !allFilteredSelected}
          onClick={toggleSelectAllFiltered}
          label={allFilteredSelected
            ? ui("Deselect all")
            : uiFmt("Select all {count} shown", { count: filtered.length })}
          size="h-8 w-8"
        />
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
          {uiNumber(filtered.length)} {ui("of")} {uiNumber(catalog.length)} {ui("items")}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 sm:grid-cols-3">
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Part of speech")}</span>
          <select
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => { setPartOfSpeech(event.target.value as WordPartOfSpeechFilter); reset(); }}
            value={partOfSpeech}
          >
            {WORD_PART_OF_SPEECH_FILTERS.map((option) => (
              <option key={option.key} value={option.key}>{ui(option.label)}</option>
            ))}
          </select>
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-3)]">{ui("Sort by")}</span>
          <select
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-1)] outline-none focus:border-[var(--accent)]"
            onChange={(event) => { setSort(event.target.value as WordTrackerSort); reset(); }}
            value={sort}
          >
            {WORD_TRACKER_SORTS.map((option) => (
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

      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-dim)] px-4 py-3">
          <span className="text-xs font-black text-[var(--accent)]">
            {selected.size} {ui("selected")}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <BulkActionButton tone="known" icon={CheckCircle2} label={ui("Known")} onClick={() => bulkApplyStatus("known")} />
            <BulkActionButton tone="struggle" icon={AlertTriangle} label={ui("Struggle")} onClick={() => bulkApplyStatus("struggle")} />
            <BulkActionButton tone="new" icon={Circle} label={ui("To learn")} onClick={() => bulkApplyStatus("new")} />
            <BulkActionButton tone="permanent" icon={Star} label={ui("Permanent")} onClick={bulkApplyPermanent} />
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-black text-[var(--text-3)] hover:text-[var(--text-1)]"
            >
              <XIcon className="h-3.5 w-3.5" />
              {ui("Clear")}
            </button>
          </div>
        </div>
      )}

      <div
        className="mt-4 h-[min(34rem,65vh)] min-h-[24rem] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4"
        aria-label={ui("Words tracker")}
        tabIndex={0}
      >
        <div className="divide-y divide-[var(--border)]">
          {visible.map((word) => {
            const status = statusForId(grades, word.id, word.aliases);
            const record = recordFor(word);
            const french = sides.target.code === "fr" ? frenchFor(word.de) : null;
            const primaryText = french ?? (learnsEnglish ? word.en : word.de);
            const meaningText = sides.meaning.code === "de" ? word.de : word.en;
            const example = exampleIndex.exampleFor(word);
            return (
              <div key={word.id} className="tracker-row flex flex-wrap items-center gap-3 py-3">
                <SelectBox
                  checked={selected.has(word.id)}
                  onClick={() => toggleSelect(word.id)}
                  label={`${selected.has(word.id) ? ui("Deselect") : ui("Select")} ${primaryText}`}
                />
                <button
                  type="button"
                  onClick={() => tts(primaryText, 0.9, targetLangTag())}
                  aria-label={uiFmt("Play {language} audio", { language: ui(sides.target.label) })}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)] hover:bg-[var(--surface-3)]"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <div className="min-w-48 flex-1 basis-0">
                  {/* No frequency badge here: commonality ORDERS the list and
                      feeds the sort/filter controls, but as a chip on every row
                      it was noise: it belongs behind the scenes. */}
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-black text-[var(--text-1)]">{primaryText}</p>
                  </div>
                  <p className="truncate text-xs font-semibold text-[var(--text-3)]">
                    {meaningText}
                    {word.pos ? ` · ${ui(word.pos)}` : ""}
                    {uiIsEnglish() && word.use ? ` · ${ui(word.use)}` : ""}
                    {uiIsEnglish() && (() => {
                        const note = packMeta(word.partKey).note;
                        return note ? <span className="font-black text-violet-500"> · {ui(note)}</span> : null;
                      })()}
                    {(() => {
                        const listens = Number(record?.listens) || 0;
                        return listens > 0
                          ? <span className="font-black text-teal-600" title={ui("Graded in Listen mode — exposure only, not mastery.")}> · {listens}× {ui("heard")}</span>
                          : null;
                      })()}
                    {/* A word put off in Listen or a lesson was invisible here —
                        it silently skipped sittings and the queue while the
                        tracker still called it due. Now the delay shows, with
                        its end date, wherever the word is listed. */}
                    {isSnoozed(record) && record?.snoozedUntil && (
                      <span
                        className="font-black text-violet-500"
                        title={ui("Put off — it returns to lessons, Listen and reviews on this date.")}
                      > · {ui("put off until")} {new Date(record.snoozedUntil).toLocaleDateString(uiLocale(), { day: "numeric", month: "short" })}</span>
                    )}
                  </p>
                  {(word.synonyms?.length ?? 0) > 0 && (
                    <p className="mt-0.5 text-xs font-semibold text-[var(--text-3)]">
                      <span className="font-black text-sky-600">{ui("Also")}: </span>
                      {(word.synonyms ?? []).map((syn, index) => {
                        // Compared with the word leading the card, not rated on
                        // its own: a bare tier said "(common)" about a synonym
                        // sitting beside a face of the same tier, which answers
                        // a question nobody asked. The bank does not rank slang
                        // or function words, so an unranked pair still says
                        // nothing rather than guessing.
                        const versus = synonymCommonality(word.lookup || word.de, syn.lookup || syn.de);
                        return (
                          <span
                            key={syn.id}
                            title={versus
                              ? versus.hint
                              : ui("Same meaning — the most common word leads this card.")}
                          >
                            {index > 0 && <span aria-hidden="true"> · </span>}
                            <span className="font-bold text-[var(--text-2)]">{syn.de}</span>
                            {versus && <span className="font-black text-amber-600"> ({ui(versus.label)})</span>}
                          </span>
                        );
                      })}
                    </p>
                  )}
                  {example && (
                    <p
                      className="mt-0.5 text-xs font-semibold text-[var(--text-2)]"
                      title={ui("Example in context")}
                    >
                      {/* Quote marks follow the quoted sentence's language, not the UI's. */}
                      {/* The example is a German sentence with an English
                          translation. There is no French one on a word card, so
                          the French course shows the pair the entry has rather
                          than an example in a language it is not teaching. */}
                      <span className="italic">{learnsEnglish ? `“${example.en}”` : `„${example.de}“`}</span>
                      <span className="font-medium text-[var(--text-3)]"> — {learnsEnglish ? example.de : example.en}</span>
                    </p>
                  )}
                  <StrengthMeter
                    record={record}
                    onSetLevel={(level) => applyStrength(word, level)}
                    onSetPermanent={() => applyPermanent(word)}
                  />
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
            {ui("Show more")} ({uiNumber(visible.length)} / {uiNumber(filtered.length)})
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
      : "border-[var(--border)] text-[var(--text-2)] hover:text-[var(--success-text)]",
    struggle: active
      ? "bg-amber-500/15 text-amber-600 border-transparent"
      : "border-[var(--border)] text-[var(--text-2)] hover:text-amber-600",
    new: active
      ? "bg-[var(--surface-3)] text-[var(--text-1)] border-transparent"
      : "border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-black tracking-[0.01em] transition-colors",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
