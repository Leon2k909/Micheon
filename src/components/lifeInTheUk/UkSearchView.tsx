import { useDeferredValue, useMemo, useState } from "react";
import { BookOpen, CalendarClock, HelpCircle, Layers, Search } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CountryPack } from "@/lib/countryStudies";
import { UK_PACK } from "@/lib/countryPacks";
import {
  COUNTRY_SEARCH_EXAMPLES,
  searchCountry,
  type CountrySearchHit,
} from "@/lib/countrySearch";

const KIND_ICON = {
  event: CalendarClock,
  lesson: BookOpen,
  question: HelpCircle,
  category: Layers,
  term: Search,
} as const;

const KIND_LABEL = {
  event: "Event",
  lesson: "Lesson",
  question: "Question",
  category: "Category",
  term: "Term",
} as const;

/**
 * Search by person, year, event, place, term or category.
 *
 * The interesting part is that a hit widens by tag. Typing "1066" matches the
 * Norman Conquest directly, and the tags on that event then pull in William
 * the Conqueror, the Battle of Hastings, the Bayeux Tapestry and the Domesday
 * Book — none of which contain the digits 1066. The chips below the box show
 * which tags did the pulling, so the learner can see the thread and follow it
 * further rather than wondering where the extra results came from.
 */
export function UkSearchView({
  onOpenLesson,
  pack = UK_PACK,
}: {
  onOpenLesson?: (lessonId: string) => void;
  /** Which country is being searched. Defaults to the UK. */
  pack?: CountryPack;
}) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const { hits, matchedTags } = useMemo(() => searchCountry(pack, deferred), [deferred, pack]);
  const examples = COUNTRY_SEARCH_EXAMPLES[pack.id] ?? COUNTRY_SEARCH_EXAMPLES.uk;
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const order: CountrySearchHit["kind"][] = ["event", "lesson", "category", "question"];
    return order
      .map((kind) => ({ kind, items: hits.filter((hit) => hit.kind === kind) }))
      .filter((group) => group.items.length > 0);
  }, [hits]);

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Search the course")}</h2>
        <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
          {ui("People, years, events, places, terms or categories. Try a date.")}
        </p>

        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            // Built from the pack rather than fixed, or the France course
            // would invite you to search for Churchill.
            placeholder={uiFmt("Search — try {examples}", { examples: examples.slice(0, 3).join(", ") })}
            className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-4 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:font-semibold placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
            type="search"
          />
        </label>

        {query.trim().length < 2 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-black text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]"
              >
                {example}
              </button>
            ))}
          </div>
        )}

        {matchedTags.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[var(--text-3)]">
            {ui("Also showing everything tagged")}
            {matchedTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-black text-[var(--accent)]">
                {tag}
              </span>
            ))}
          </p>
        )}
      </section>

      {query.trim().length >= 2 && hits.length === 0 && (
        <section className="card p-6 text-center">
          <p className="text-sm font-black text-[var(--text-1)]">{ui("Nothing found")}</p>
          <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
            {ui("Try a year, a person or a place — the index covers all three.")}
          </p>
        </section>
      )}

      {grouped.map((group) => {
        const Icon = KIND_ICON[group.kind];
        return (
          <section key={group.kind} className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="text-sm font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui(KIND_LABEL[group.kind])} · {group.items.length}
              </h3>
            </div>
            <div className="mt-3 space-y-2">
              {group.items.map((hit) => {
                const open = openId === hit.id;
                const canOpenLesson = hit.kind === "lesson" && hit.lessonId && onOpenLesson;
                return (
                  <div key={hit.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (canOpenLesson) onOpenLesson!(hit.lessonId!);
                        else setOpenId(open ? null : hit.id);
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-colors",
                        open ? "bg-[var(--accent-dim)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                      )}
                    >
                      {hit.displayYear && (
                        <span className="w-20 shrink-0 text-xs font-black tabular-nums text-[var(--accent)]">
                          {hit.displayYear}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black leading-snug text-[var(--text-1)]">{hit.title}</span>
                        <span className="mt-0.5 block text-[11px] font-semibold text-[var(--text-3)]">{hit.subtitle}</span>
                      </span>
                    </button>
                    {open && hit.detail && (
                      <div className="mt-2 rounded-2xl bg-[var(--surface)] p-4">
                        <p className="text-sm font-semibold leading-6 text-[var(--text-2)]">{hit.detail}</p>
                        {hit.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {hit.tags.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setQuery(tag)}
                                className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-3)] transition-colors hover:bg-[var(--accent-dim)] hover:text-[var(--accent)]"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
