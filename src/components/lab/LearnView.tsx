import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Check, CheckCircle2, Clock3, Headphones, List, Minus, PauseCircle, PlayCircle, Route, Search, SquareCheck, TrendingDown, X } from "lucide-react";
import { Part } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DuoPath } from "@/components/duo/DuoPath";
import { isBulkPartKey, partItemCount } from "@/lib/contentBank";
import { orderParts } from "@/lib/curriculum";
import { loadGradeStore } from "@/lib/activity";
import { getAuthUser } from "@/lib/profileStorage";
import { cefrTier, type CefrTier } from "@/lib/cefr";
import { ui, uiFmt, uiOr } from "@/lib/i18n";
import { courseSides } from "@/lib/courseLanguages";
import { buildCatalogSearchText, normalizeCatalogSearchText } from "@/lib/catalogSearch";
import { getMutedPacks, setPackMuted, setPacksMuted } from "@/lib/mutedPacks";
import {
  getHideFinishedLessons,
  isFinishedLesson,
  lessonProgress,
  passesFinishedShelf,
  setHideFinishedLessons,
  shelfCounts,
  type LessonProgress,
} from "@/lib/lessonShelf";

type LevelFilter = "all" | CefrTier;
type KindFilter = "all" | "core" | "wordbank";
type ProgressFilter = "all" | "unstarted" | "started" | "done" | "paused";

const LEVEL_FILTERS: { id: LevelFilter; label: string }[] = [
  { id: "all", label: "All levels" },
  { id: "a", label: "A1-A2" },
  { id: "b1", label: "B1" },
  { id: "b2", label: "B2" },
  { id: "c1", label: "C1" },
  { id: "c2", label: "C2" },
];

const KIND_FILTERS: { id: KindFilter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "core", label: "Core lessons" },
  { id: "wordbank", label: "Word banks" },
];

const PROGRESS_FILTERS: { id: ProgressFilter; label: string }[] = [
  { id: "all", label: "Any progress" },
  { id: "unstarted", label: "Not started" },
  { id: "started", label: "In progress" },
  { id: "done", label: "Finished" },
  { id: "paused", label: "Paused" },
];

/** The Words tracker's checkbox toggle, in lesson-card clothes — same box,
 *  same check/indeterminate marks, so selection reads the same app-wide. */
function SelectBox({
  checked,
  indeterminate = false,
  onClick,
  label,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-pressed={checked}
      aria-label={label}
      title={label}
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        checked || indeterminate
          ? "border-[var(--accent)] bg-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)]/50",
        className ?? "",
      ].join(" ")}
    >
      {checked && <Check className="h-3.5 w-3.5 text-white" />}
      {!checked && indeterminate && <Minus className="h-3.5 w-3.5 text-white" />}
    </button>
  );
}

/** Everything about a pack a search should be able to reach. */
function searchCorpus(key: string, part: Part) {
  return buildCatalogSearchText([
    key,
    part.label,
    part.level,
    part.theme,
    part.description,
    part.focus,
    // Searching the content itself is the point: a learner looks for
    // "Apotheke", not for the pack title they have never seen.
    ...(part.phrases ?? []).flatMap((phrase) => [phrase.de, phrase.en]),
    ...(part.vocab ?? []).flatMap((word) => [word.de, word.en]),
  ].filter(Boolean));
}

/** Which of the two views of the course Lessons is showing. */
type LessonsView = "list" | "path";

/**
 * The switch between them.
 *
 * Two buttons rather than a dropdown: there are two, both fit, and a menu
 * that hides one of two options is a menu for the sake of one.
 */
function LessonsViewChoice({
  value,
  onChange,
}: {
  value: LessonsView;
  onChange: (next: LessonsView) => void;
}) {
  const option = (key: LessonsView, label: string, Icon: typeof List) => (
    <button
      aria-pressed={value === key}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-black transition-colors",
        value === key
          ? "bg-[var(--accent)] text-[var(--accent-text)]"
          : "text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
      )}
      onClick={() => onChange(key)}
      type="button"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-[var(--surface-2)] p-1">
      {option("list", ui("All lessons"), List)}
      {option("path", ui("Your path"), Route)}
    </div>
  );
}

export function LearnView({
  apiParts,
  onOpenLesson,
  initialView = "list",
}: {
  apiParts: Record<string, Part>;
  onOpenLesson: (id: string) => void;
  /**
   * Which view opens, for the one caller that knows better than the default.
   *
   * Search can send somebody to Unit 12, and the unit cards are drawn by the
   * path — so arriving on the lesson list would scroll to an anchor that is
   * not on screen, which looks exactly like search having done nothing.
   */
  initialView?: LessonsView;
}) {
  const [view, setView] = useState<LessonsView>(initialView);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [hideFinished, setHideFinished] = useState<boolean>(getHideFinishedLessons);
  const [mutedPacks, setMutedPacks] = useState<Set<string>>(() => getMutedPacks());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  /**
   * A box on every card said "you are choosing lessons" to everyone who was
   * only reading them. Choosing is a mode you ask for now, and the boxes
   * appear with it.
   */
  const [selecting, setSelecting] = useState(false);
  // Leaving drops the selection: boxes you cannot see must not still be ticked.
  const stopSelecting = () => {
    setSelecting(false);
    setSelected(new Set());
  };

  const togglePaused = (key: string) => {
    setMutedPacks(new Set(setPackMuted(key, !mutedPacks.has(key))));
  };

  const toggleSelect = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Bulk pause/resume writes every selected pack in ONE storage write and one
  // change event (setPacksMuted), not a setPackMuted loop per pack.
  const bulkSetPaused = (muted: boolean) => {
    if (selected.size === 0) return;
    setMutedPacks(new Set(setPacksMuted(selected, muted)));
  };

  /**
   * In course order, so this view and the path agree about what comes first.
   *
   * The list used to sort by level alone, which made it disagree with the
   * path about the order of the very same packs — the path ran the hand
   * order, the list ran A1 to C2. One course, one order, from one function:
   * tier, then level, then the hand order, which is what the path draws and
   * what Continue learning serves.
   */
  const parts = Object.entries(orderParts(apiParts));
  const coreParts = parts.filter(([key]) => !isBulkPartKey(key));
  const wordBankParts = parts.filter(([key]) => isBulkPartKey(key));

  // Built once per pack list rather than per keystroke — with ~100 packs and
  // thousands of phrases, rebuilding this on every character would be felt.
  const corpora = useMemo(
    () => new Map(parts.map(([key, part]) => [key, searchCorpus(key, part)])),
    [apiParts]
  );

  /**
   * Learned, and how much of that has started to go.
   *
   * "Finished" is a claim about the past. The tracker already shows what an
   * item is worth TODAY — an answer given once and never revisited decays past
   * its review date — and a lesson list that only counted the past would keep
   * calling a lesson done long after its words had faded. Same curve, same
   * word for it, counted here per lesson.
   */
  const progressByPart = useMemo(() => {
    const grades = loadGradeStore(getAuthUser());
    const out = new Map<string, LessonProgress>();
    for (const [key, part] of parts) out.set(key, lessonProgress(key, part.phrases ?? [], grades));
    return out;
  }, [apiParts]);

  const terms = useMemo(() => normalizeCatalogSearchText(query).split(" ").filter(Boolean), [query]);

  const visible = useMemo(() => parts.filter(([key, part]) => {
    /**
     * A pack with nothing in it is not a lesson.
     *
     * The catalogue carries 129 reserved keys with no phrases and no words —
     * "Part 401", and so on up. The path has always dropped them, because it
     * builds from catalogue items and they produce none; the list showed them
     * all, so the two views of one course disagreed by 129 rows and clicking
     * one opened a lesson with nothing to teach.
     */
    if (partItemCount(part) === 0) return false;
    if (kindFilter === "core" && isBulkPartKey(key)) return false;
    if (kindFilter === "wordbank" && !isBulkPartKey(key)) return false;
    if (levelFilter !== "all" && cefrTier(part.level) !== levelFilter) return false;

    // The shelf, before the progress filter: a standing "put finished away"
    // must not fight an explicit "show me the finished ones", so asking for
    // them wins and passesFinishedShelf is told so.
    if (!passesFinishedShelf(
      progressByPart.get(key) ?? { done: 0, total: 0, fading: 0 },
      { hideFinished, askedForFinished: progressFilter === "done" }
    )) return false;

    if (progressFilter === "paused" && !mutedPacks.has(key)) return false;
    if (progressFilter !== "all" && progressFilter !== "paused") {
      const progress = progressByPart.get(key) ?? { done: 0, total: 0, fading: 0 };
      const ratio = progress.total ? progress.done / progress.total : 0;
      if (progressFilter === "unstarted" && progress.done !== 0) return false;
      if (progressFilter === "started" && (progress.done === 0 || ratio >= 1)) return false;
      if (progressFilter === "done" && (ratio < 1 || progress.total === 0)) return false;
    }

    // Every term must appear somewhere, so extra words narrow rather than widen.
    const corpus = corpora.get(key) ?? "";
    return terms.every((term) => corpus.includes(term));
  }),
  [parts, corpora, terms, levelFilter, kindFilter, progressFilter, progressByPart, mutedPacks, hideFinished]);

  // Counted over every lesson, not the filtered ones: the button says how
  // much is on the shelf, and that number must not move when a search does.
  const shelf = useMemo(
    () => shelfCounts(parts.map(([key]) => progressByPart.get(key) ?? { done: 0, total: 0, fading: 0 }),
    ), [parts, progressByPart]);

  const toggleHideFinished = () => setHideFinished(setHideFinishedLessons(!hideFinished));

  // The shelf narrows the list like a filter does, so it says so in the count
  // line and "Clear filters" brings the finished lessons back with everything
  // else — a list that stayed short after clearing every filter would read as
  // a bug rather than as a preference.
  const filtering = Boolean(terms.length) || levelFilter !== "all"
    || kindFilter !== "all" || progressFilter !== "all" || hideFinished;

  // "Select all" targets every FILTERED lesson, matching the words tracker.
  const allVisibleSelected = visible.length > 0 && visible.every(([key]) => selected.has(key));
  const someVisibleSelected = visible.some(([key]) => selected.has(key));
  const toggleSelectAllVisible = () => {
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map(([key]) => key)));
  };

  const clearAll = () => {
    setQuery("");
    setLevelFilter("all");
    setKindFilter("all");
    setProgressFilter("all");
    setHideFinished(setHideFinishedLessons(false));
  };

  // One pill per question, in the chip's own clothes. Accent ink means "an
  // answer other than the default", exactly what a lit chip used to mean, so
  // a narrowed list is still visible at a glance with the menu closed.
  const filterSelect = (active: boolean) => [
    "h-9 max-w-full rounded-full px-3.5 text-xs font-black outline-none transition-colors",
    active
      ? "bg-[var(--accent)] text-[var(--accent-text)]"
      : "bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)]",
  ].join(" ");

  /**
   * The same course, two ways of looking at it.
   *
   * The list is for finding a lesson: filters, levels, search, pausing. The
   * path is for seeing where you are: the same packs in curriculum order,
   * drawn as a route with your position on it. Those are two views of one
   * thing, and they were two places — the path lived behind its own nav
   * entry, so knowing where you were and choosing what to do next meant
   * holding the same course in your head twice.
   */
  if (view === "path") {
    return (
      <div className="space-y-4">
        <LessonsViewChoice value={view} onChange={setView} />
        <DuoPath
          apiParts={apiParts}
          hideFinished={hideFinished}
          onOpenLesson={onOpenLesson}
          onShowFinished={() => setHideFinished(setHideFinishedLessons(false))}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LessonsViewChoice value={view} onChange={setView} />
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">{ui("Lessons")}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-2)]">
              {/* Named from the course, not from the interface language. Those
                  two used to line up — a German interface meant learning
                  English — and the French course broke the coincidence. */}
              {uiFmt("Work through practical {language} in short blocks: read, listen, choose, type, and translate.", {
                language: ui(courseSides().target.label),
              })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
              <p className="text-2xl font-black text-[var(--text-1)]">{coreParts.length}</p>
              <p className="text-[11px] font-bold text-[var(--text-3)]">{ui("core modules")}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
              <p className="text-2xl font-black text-[var(--text-1)]">{wordBankParts.length}</p>
              <p className="text-[11px] font-bold text-[var(--text-3)]">{ui("practice sets")}</p>
            </div>
          </div>
        </div>

        {/* Search reaches the phrases inside a pack, not just its title — a
            learner looks for "Apotheke", not for a pack name they have never
            seen. */}
        <div className="mt-5">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
            />
            <input
              className="learn-library-search h-12 w-full rounded-[16px] border-2 border-[var(--border)] bg-[var(--surface)] pl-11 pr-11 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={uiFmt("Search lessons, topics or a {language} word…", {
                language: ui(courseSides().target.label),
              })}
              type="search"
              value={query}
            />
            {query && (
              <button
                aria-label={ui("Clear search")}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                onClick={() => setQuery("")}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          {/* Three questions, three menus, one row. As chips these were
              three rows holding fourteen pills for three answers, and the
              filters stood taller than the lessons they filtered. A closed
              menu shows its answer and nothing else; the row wraps only
              when the card genuinely has no width for it. */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <div className="min-w-0">
              <select
                aria-label={ui("Level")}
                className={filterSelect(levelFilter !== "all")}
                onChange={(event) => setLevelFilter(event.target.value as LevelFilter)}
                value={levelFilter}
              >
                {LEVEL_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>{ui(option.label)}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <select
                aria-label={ui("Lesson content")}
                className={filterSelect(kindFilter !== "all")}
                onChange={(event) => setKindFilter(event.target.value as KindFilter)}
                value={kindFilter}
              >
                {KIND_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>{ui(option.label)}</option>
                ))}
              </select>
            </div>
            {/* The shelf rides in this menu as its last entry. Choosing it
                answers the progress question too — "everything, minus the
                finished ones" — so the two states collapse into one value:
                any other answer takes the shelf off. The way BACK stays a
                visible button in the count line below, because a closed menu
                that silently hides forty lessons is a control that gets
                blamed for losing them. */}
            <div className="min-w-0">
              <select
                aria-label={ui("Progress")}
                className={filterSelect(progressFilter !== "all" || hideFinished)}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "shelf") {
                    setProgressFilter("all");
                    if (!hideFinished) setHideFinished(setHideFinishedLessons(true));
                    return;
                  }
                  if (hideFinished) setHideFinished(setHideFinishedLessons(false));
                  setProgressFilter(value as ProgressFilter);
                }}
                title={ui(hideFinished
                  ? "Finished lessons are put away — nothing is deleted, and any whose words have started to fade stay in the list so you can review them."
                  : "Put finished lessons away to clear the list. Nothing is deleted, and this button brings them straight back.")}
                value={hideFinished ? "shelf" : progressFilter}
              >
                {PROGRESS_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>{ui(option.label)}</option>
                ))}
                {/* Carries its own count, so a shelf holding forty lessons
                    says so. Rendered whenever the shelf is on as well, so the
                    select never holds a value with no option to show it. */}
                {(shelf.finished > 0 || hideFinished) && (
                  <option value="shelf">
                    {uiFmt("Hide finished ({count})", { count: shelf.finished })}
                  </option>
                )}
              </select>
            </div>
          </div>

          {filtering && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-xs font-black text-[var(--text-2)]">
                {visible.length} {ui(visible.length === 1 ? "lesson" : "lessons")} {ui("of")} {parts.length}
              </p>
              <button
                className="text-xs font-black text-[var(--accent)] hover:underline"
                onClick={clearAll}
                type="button"
              >
                {ui("Clear filters")}
              </button>
              {/* The labelled way back from the shelf, visible without
                  opening the menu that switched it on. */}
              {hideFinished && (
                <button
                  className="text-xs font-black text-[var(--accent)] hover:underline"
                  onClick={toggleHideFinished}
                  title={ui("Finished lessons are put away — nothing is deleted, and any whose words have started to fade stay in the list so you can review them.")}
                  type="button"
                >
                  {uiFmt("Show finished ({count})", { count: shelf.finished })}
                </button>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
            {!selecting ? (
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                onClick={() => setSelecting(true)}
                type="button"
              >
                <SquareCheck className="h-3.5 w-3.5" />
                {ui("Select lessons")}
              </button>
            ) : (
              <>
                <SelectBox
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected && !allVisibleSelected}
                  onClick={toggleSelectAllVisible}
                  label={allVisibleSelected
                    ? ui("Deselect all")
                    : uiFmt("Select all {count} shown", { count: visible.length })}
                />
                <p className="text-xs font-bold text-[var(--text-3)]">
                  {selected.size > 0
                    ? `${selected.size} ${ui("selected")}`
                    : ui("Select lessons to pause several at once")}
                </p>
                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  {selected.size > 0 && (
                    <>
                      <button
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                        onClick={() => bulkSetPaused(true)}
                        type="button"
                      >
                        <PauseCircle className="h-3.5 w-3.5" />
                        {ui("Pause selected")}
                      </button>
                      <button
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                        onClick={() => bulkSetPaused(false)}
                        type="button"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        {ui("Resume selected")}
                      </button>
                      <button
                        className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-black text-[var(--text-3)] hover:text-[var(--text-1)]"
                        onClick={() => setSelected(new Set())}
                        type="button"
                      >
                        <X className="h-3.5 w-3.5" />
                        {ui("Clear")}
                      </button>
                    </>
                  )}
                  {/* Clear empties the selection and stays; Done puts the boxes
                      away. Two different things, so both are here. */}
                  <button
                    className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-black text-[var(--text-2)] hover:text-[var(--text-1)]"
                    onClick={stopSelecting}
                    type="button"
                  >
                    {ui("Done")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {visible.length === 0 ? (
        <section className="card p-8 text-center">
          <p className="text-lg font-black text-[var(--text-1)]">{ui("Nothing matches that")}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--text-3)]">
            {ui("Try a different word, or clear the filters to see every lesson again.")}
          </p>
          <button
            className="mt-4 inline-flex h-11 items-center justify-center rounded-[14px] bg-[var(--accent)] px-5 text-sm font-black text-[var(--accent-text)]"
            onClick={clearAll}
            type="button"
          >
            {ui("Clear filters")}
          </button>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map(([key, part], index) => {
            // The wide featured card only makes sense for an unfiltered list;
            // in search results every hit is equally relevant.
            const featured = index === 0 && !filtering;
            const progress = progressByPart.get(key) ?? { done: 0, total: 0, fading: 0 };
            const finished = isFinishedLesson(progress);
            const paused = mutedPacks.has(key);
            return (
              <motion.div
                className={[
                  "card card-hover relative min-h-[236px] p-5 text-left",
                  featured ? "lg:col-span-2" : "",
                  paused ? "opacity-60" : "",
                ].join(" ")}
                key={key}
                whileTap={{ scale: 0.985 }}
              >
                {/* The whole card opens the lesson, but the pause control has to
                    be a real button of its own — so the card-wide target is an
                    overlay behind it rather than a button wrapping everything. */}
                <button
                  aria-label={`${ui("Open")} ${uiOr(part.theme, "Konversationsmodul")}`}
                  className="absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  onClick={() => onOpenLesson(key)}
                  type="button"
                />
                <div className="pointer-events-none relative z-10 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {selecting && (
                      <SelectBox
                        checked={selected.has(key)}
                        className="pointer-events-auto"
                        label={`${ui(selected.has(key) ? "Deselect" : "Select")} ${uiOr(part.theme, "Konversationsmodul")}`}
                        onClick={() => toggleSelect(key)}
                      />
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                      {isBulkPartKey(key) ? <BookOpen className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {paused && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-3)] px-2.5 py-1 text-[11px] font-black text-[var(--text-2)]">
                        <PauseCircle className="h-3 w-3" />
                        {ui("Paused")}
                      </span>
                    )}
                    {finished && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {ui("Finished")}
                      </span>
                    )}
                    {/* The tracker's amber, and the tracker's word for it, so
                        the same thing is called the same thing in both places.
                        Sits beside "Finished" rather than replacing it: both
                        are true, and they are about different times. */}
                    {progress.fading > 0 && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-black text-amber-600 dark:text-amber-400"
                        title={uiFmt("{count} of the items you learned here are past their review date, so you are assumed to have forgotten some of them. Answering them once each puts them back to full.", {
                          count: progress.fading,
                        })}
                      >
                        <TrendingDown className="h-3 w-3" />
                        {uiFmt("{count} fading", { count: progress.fading })}
                      </span>
                    )}
                    <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-1)]">
                      {part.level}
                    </span>
                  </div>
                </div>
                <h2 className="pointer-events-none relative z-10 mt-5 text-xl font-black leading-tight tracking-tight text-[var(--text-1)]">
                  {uiOr(part.theme, "Konversationsmodul")}
                </h2>
                <p className="pointer-events-none relative z-10 mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[var(--text-2)]">
                  {uiOr(part.description, "Praktische Sätze und Wörter für natürliche Gespräche zu diesem Thema.")}
                </p>

                <div className="pointer-events-none relative z-10 mt-6 flex items-center justify-between gap-3">
                  <div className="pointer-events-none flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-2)]">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-1)]">{partItemCount(part)} {ui("items")}</p>
                      <p className="text-[11px] font-semibold text-[var(--text-3)]">
                        {progress.done > 0 && progress.total > 0
                          ? `${progress.done}/${progress.total} ${ui("learned")}`
                          : "10-15 min"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-pressed={paused}
                      className="pointer-events-auto flex h-10 items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-3 text-[11px] font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      onClick={() => togglePaused(key)}
                      title={ui(paused
                        ? "Bring this pack back into your lessons."
                        : "Skip this pack in lessons. Nothing is deleted — you can bring it back any time.")}
                      type="button"
                    >
                      {paused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                      {ui(paused ? "Resume" : "Pause")}
                    </button>
                    <div aria-hidden="true" className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full bg-[#070707] text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {!filtering && (
        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dcfff1] text-[#139a62]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--text-1)]">{ui("Conversation coverage")}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                {ui("The current path covers greetings, daily routines, travel, food, questions, basic opinions, and common sentence patterns.")}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
