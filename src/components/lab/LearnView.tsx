import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Headphones, Search, X } from "lucide-react";
import { Part } from "@/lib/types";
import { isBulkPartKey, partItemCount } from "@/lib/contentBank";
import { loadGradeStore, statusForId } from "@/lib/activity";
import { getAuthUser } from "@/lib/profileStorage";
import { cefrTier, type CefrTier } from "@/lib/cefr";
import { ui, uiIsGerman, uiOr } from "@/lib/i18n";
import { buildCatalogSearchText, normalizeCatalogSearchText } from "@/lib/catalogSearch";

type LevelFilter = "all" | CefrTier;
type KindFilter = "all" | "core" | "wordbank";
type ProgressFilter = "all" | "unstarted" | "started" | "done";

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
];

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

export function LearnView({
  apiParts,
  onOpenLesson,
}: {
  apiParts: Record<string, Part>;
  onOpenLesson: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");

  const parts = Object.entries(apiParts);
  const coreParts = parts.filter(([key]) => !isBulkPartKey(key));
  const wordBankParts = parts.filter(([key]) => isBulkPartKey(key));

  // Built once per pack list rather than per keystroke — with ~100 packs and
  // thousands of phrases, rebuilding this on every character would be felt.
  const corpora = useMemo(
    () => new Map(parts.map(([key, part]) => [key, searchCorpus(key, part)])),
    [apiParts]
  );

  const progressByPart = useMemo(() => {
    const grades = loadGradeStore(getAuthUser());
    const out = new Map<string, { done: number; total: number }>();
    for (const [key, part] of parts) {
      const phrases = part.phrases ?? [];
      let done = 0;
      phrases.forEach((phrase, index) => {
        if (statusForId(grades, phrase.id ?? `${key}-phrase-${index}`) === "known") done += 1;
      });
      out.set(key, { done, total: phrases.length });
    }
    return out;
  }, [apiParts]);

  const terms = useMemo(() => normalizeCatalogSearchText(query).split(" ").filter(Boolean), [query]);

  const visible = useMemo(() => parts.filter(([key, part]) => {
    if (kindFilter === "core" && isBulkPartKey(key)) return false;
    if (kindFilter === "wordbank" && !isBulkPartKey(key)) return false;
    if (levelFilter !== "all" && cefrTier(part.level) !== levelFilter) return false;

    if (progressFilter !== "all") {
      const progress = progressByPart.get(key) ?? { done: 0, total: 0 };
      const ratio = progress.total ? progress.done / progress.total : 0;
      if (progressFilter === "unstarted" && progress.done !== 0) return false;
      if (progressFilter === "started" && (progress.done === 0 || ratio >= 1)) return false;
      if (progressFilter === "done" && (ratio < 1 || progress.total === 0)) return false;
    }

    // Every term must appear somewhere, so extra words narrow rather than widen.
    const corpus = corpora.get(key) ?? "";
    return terms.every((term) => corpus.includes(term));
  }), [parts, corpora, terms, levelFilter, kindFilter, progressFilter, progressByPart]);

  const filtering = Boolean(terms.length) || levelFilter !== "all"
    || kindFilter !== "all" || progressFilter !== "all";

  const clearAll = () => {
    setQuery("");
    setLevelFilter("all");
    setKindFilter("all");
    setProgressFilter("all");
  };

  const chip = (active: boolean) => [
    "h-9 rounded-full px-3.5 text-xs font-black transition-colors",
    active
      ? "bg-[var(--accent)] text-[var(--accent-text)]"
      : "bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)]",
  ].join(" ");

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">{ui("Lessons")}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-2)]">
              {ui(uiIsGerman()
                ? "Work through practical English in short blocks: read, listen, choose, type, and translate."
                : "Work through practical German in short blocks: read, listen, choose, type, and translate.")}
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
              className="h-12 w-full rounded-[16px] border-2 border-[var(--border)] bg-[var(--surface)] pl-11 pr-11 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui("Search lessons, topics or a German word…")}
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

          <div className="mt-3 flex flex-wrap gap-1.5">
            {LEVEL_FILTERS.map((option) => (
              <button
                aria-pressed={levelFilter === option.id}
                className={chip(levelFilter === option.id)}
                key={option.id}
                onClick={() => setLevelFilter(option.id)}
                type="button"
              >
                {ui(option.label)}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {KIND_FILTERS.map((option) => (
              <button
                aria-pressed={kindFilter === option.id}
                className={chip(kindFilter === option.id)}
                key={option.id}
                onClick={() => setKindFilter(option.id)}
                type="button"
              >
                {ui(option.label)}
              </button>
            ))}
            {PROGRESS_FILTERS.map((option) => (
              <button
                aria-pressed={progressFilter === option.id}
                className={chip(progressFilter === option.id)}
                key={option.id}
                onClick={() => setProgressFilter(option.id)}
                type="button"
              >
                {ui(option.label)}
              </button>
            ))}
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
            </div>
          )}
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
        <section className="grid gap-4 lg:grid-cols-3">
          {visible.map(([key, part], index) => {
            // The wide featured card only makes sense for an unfiltered list;
            // in search results every hit is equally relevant.
            const featured = index === 0 && !filtering;
            const progress = progressByPart.get(key) ?? { done: 0, total: 0 };
            const finished = progress.total > 0 && progress.done >= progress.total;
            return (
              <motion.button
                className={[
                  "card card-hover min-h-[236px] p-5 text-left",
                  featured ? "lg:col-span-2" : "",
                ].join(" ")}
                key={key}
                onClick={() => onOpenLesson(key)}
                type="button"
                whileTap={{ scale: 0.985 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                    {isBulkPartKey(key) ? <BookOpen className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {finished && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {ui("Finished")}
                      </span>
                    )}
                    <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-1)]">
                      {part.level}
                    </span>
                  </div>
                </div>
                <h2 className="mt-5 text-xl font-black leading-tight tracking-tight text-[var(--text-1)]">
                  {uiOr(part.theme, "Konversationsmodul")}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[var(--text-2)]">
                  {uiOr(part.description, "Praktische Sätze und Wörter für natürliche Gespräche zu diesem Thema.")}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#070707] text-white">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.button>
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
