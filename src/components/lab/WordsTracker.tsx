import { useMemo, useState } from "react";
import { ui, uiFmt } from "@/lib/i18n";
import { buildWordCatalog, type WordItem } from "@/lib/wordSession";
import { loadGradeStore } from "@/lib/activity";
import { isDueForReview, strengthInfo } from "@/lib/memoryStrength";
import type { Part } from "@/lib/types";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * The words tracker: vocabulary progress on its own card.
 *
 * Deliberately NOT merged into the word & sentence tracker. That component
 * already carries ~16,000 sentences through a priority index, a search index
 * and a commonality index; folding 3,300 words into the same list would make
 * the heaviest view in the app heavier, and the two kinds of progress answer
 * different questions anyway — "which sentences can I say?" is not "how many
 * words do I know?". Separate card, separate (small) indexes, no shared state.
 *
 * Word progress lives under vw- ids that only vocabulary sittings write, so
 * everything here is a straight read of the grade store.
 */
const PAGE = 40;

type Row = { word: WordItem; status: "known" | "due" | "struggling" | "new"; label: string };

export function WordsTracker({ apiParts, user }: {
  apiParts: Record<string, Part>;
  user: UserProfile | null;
}) {
  const [filter, setFilter] = useState<"all" | "known" | "due" | "struggling" | "new">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo<Row[]>(() => {
    const grades = loadGradeStore(user);
    return buildWordCatalog(apiParts).map((word) => {
      const record = grades[word.id];
      const status = record?.lastGrade === "struggle"
        ? "struggling"
        : record?.lastGrade === "know"
          ? (isDueForReview(record) ? "due" : "known")
          : "new";
      return { word, status, label: strengthInfo(record).label };
    });
  }, [apiParts, user]);

  const counts = useMemo(() => {
    const out = { known: 0, due: 0, struggling: 0, new: 0 };
    for (const row of rows) out[row.status] += 1;
    return out;
  }, [rows]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!needle) return true;
      return row.word.de.toLowerCase().includes(needle)
        || row.word.en.toLowerCase().includes(needle)
        || row.word.lookup.toLowerCase().includes(needle);
    });
  }, [rows, filter, query]);

  const visible = shown.slice(0, page * PAGE);

  const FILTERS = [
    ["all", ui("All")],
    ["known", ui("Known")],
    ["due", ui("Due for review")],
    ["struggling", ui("Struggling")],
    ["new", ui("To learn")],
  ] as const;

  return (
    <section aria-label={ui("Words tracker")} className="card words-tracker">
      <h3>{ui("Words tracker")}</h3>
      <p className="words-tracker-sub">
        {ui("Single words from vocabulary lessons. Sentences live in the tracker above — the two never mix.")}
      </p>
      <div className="words-tracker-tiles">
        <span><strong>{counts.known}</strong><small>{ui("Known")}</small></span>
        <span><strong>{counts.due}</strong><small>{ui("Due for review")}</small></span>
        <span><strong>{counts.struggling}</strong><small>{ui("Struggling")}</small></span>
        <span><strong>{counts.new}</strong><small>{ui("To learn")}</small></span>
      </div>
      <div className="words-tracker-filters" role="group" aria-label={ui("Filter words")}>
        {FILTERS.map(([value, label]) => (
          <button
            aria-pressed={filter === value}
            className={filter === value ? "is-active" : undefined}
            key={value}
            onClick={() => { setFilter(value); setPage(1); }}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <input
        aria-label={ui("Search words")}
        className="words-tracker-search"
        onChange={(event) => { setQuery(event.target.value); setPage(1); }}
        placeholder={ui("Search words")}
        type="search"
        value={query}
      />
      <ul className="words-tracker-list">
        {visible.map(({ word, status, label }) => (
          <li key={word.id}>
            <span className="words-tracker-de">{word.de}</span>
            <span className="words-tracker-en">{word.en}</span>
            <span className={`words-tracker-status is-${status}`}>{ui(label)}</span>
          </li>
        ))}
      </ul>
      {visible.length < shown.length && (
        <button className="words-tracker-more" onClick={() => setPage((current) => current + 1)} type="button">
          {uiFmt("Show more ({n} of {total})", { n: visible.length, total: shown.length })}
        </button>
      )}
      {shown.length === 0 && (
        <p className="words-tracker-empty">{ui("No words match. Start a vocabulary lesson from the home page to begin.")}</p>
      )}
    </section>
  );
}
