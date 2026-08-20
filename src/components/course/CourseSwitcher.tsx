import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/lib/courseRegistry";
import { PLANNED_LANGUAGES } from "@/lib/languageCatalogue";
import { FlagRoundel, hasFlagArt } from "@/components/course/FlagRoundel";
import { ui } from "@/lib/i18n";

const COURSE_SEARCH_ALIASES: Record<string, string> = {
  german: "de deutsch germany deutschland alemann allemand",
  spanish: "es espanol español spain spanisch espagnol",
  french: "fr francais français france franzosisch französisch",
  csharp: "c# c sharp dotnet .net programming coding sandbox sbox s&box",
  // Searching a variant by name still reaches it, even though the two share
  // one row: "american" narrows to the US card, "english" keeps them merged.
  "english-uk": "english britisch british uk gb england colour practise timetable englisch",
  "english-us": "english amerikanisch american us usa color practice schedule englisch",
  "life-in-the-uk": "life in the uk citizenship test british history government settlement indefinite leave to remain ilr home office",
  // Endonyms and alternative spellings for everything in the catalogue, so
  // searching "nihongo" or "espanol" finds the right row.
  ...Object.fromEntries(PLANNED_LANGUAGES.map((language) => [language.id, language.search])),
};

/** Diacritics fold away, so "cestina" matches "čeština" and vice versa. */
function foldForSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function CourseArtwork({ id }: { id: string }) {
  if (id === "csharp") {
    return (
      <img
        alt=""
        className="h-9 w-9 rounded-[11px] object-cover shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
        src="/course-assets/sbox-game.ico"
      />
    );
  }

  const backgroundImage = id === "german"
    ? "linear-gradient(to bottom, #181818 0 33.333%, #dd0000 33.333% 66.666%, #ffce00 66.666% 100%)"
    : id === "spanish"
      ? "linear-gradient(to bottom, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75% 100%)"
      : id === "french"
        ? "linear-gradient(to right, #0055a4 0 33.333%, #ffffff 33.333% 66.666%, #ef4135 66.666% 100%)"
        : null;

  if (!backgroundImage) {
    // Windows renders flag emoji as bare letter pairs, so the catalogue's
    // flags are drawn as SVG art instead — same picture on every platform.
    if (hasFlagArt(id)) return <FlagRoundel id={id} />;
    const icon = PLANNED_LANGUAGES.find((language) => language.id === id)?.icon ?? "🌍";
    return <span aria-hidden="true" className="text-2xl leading-none">{icon}</span>;
  }

  return (
    <span
      aria-hidden="true"
      className="block h-8 w-8 rounded-full border-2 border-[var(--surface)] shadow-[0_2px_8px_rgba(20,20,20,0.18)]"
      style={{ backgroundImage }}
    />
  );
}

export function CourseSwitcher({
  open,
  activeCourseId,
  onSelect,
  onClose,
}: {
  open: boolean;
  activeCourseId: string;
  onSelect: (courseId: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const normalizedQuery = foldForSearch(query.trim());
  const visibleCourses = useMemo(() => {
    if (!normalizedQuery) return COURSES;
    return COURSES.filter((course) => {
      const corpus = [
        course.id,
        course.name,
        ui(course.name),
        course.tagline,
        ui(course.tagline),
        COURSE_SEARCH_ALIASES[course.id] ?? "",
      ].join(" ");
      const folded = foldForSearch(corpus);
      return normalizedQuery.split(/\s+/).every((term) => folded.includes(term));
    });
  }, [normalizedQuery]);
  const allLanguages = visibleCourses.filter((c) => c.kind === "language");
  // The two English rows are folded into one card — see EnglishCard. They are
  // pulled out here rather than filtered inside the list so the count above
  // the section stays honest about how many rows are actually drawn.
  const englishUk = allLanguages.find((c) => c.id === "english-uk");
  const englishUs = allLanguages.find((c) => c.id === "english-us");
  const mergedEnglish = englishUk && englishUs ? { uk: englishUk, us: englishUs } : null;
  const languages = mergedEnglish
    ? allLanguages.filter((c) => c.id !== "english-uk" && c.id !== "english-us")
    : allLanguages;
  const languageRowCount = languages.length + (mergedEnglish ? 1 : 0);
  const programming = visibleCourses.filter((c) => c.kind === "programming");
  const citizenship = visibleCourses.filter((c) => c.kind === "citizenship");

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 120);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  const Card = ({ id, name, tagline, available, builtIn }: (typeof COURSES)[number]) => {
    const active = id === activeCourseId;
    return (
      <button
        type="button"
        disabled={!available}
        onClick={() => { if (available) { onSelect(id); onClose(); } }}
        className={cn(
          "relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
          active
            ? "border-[var(--accent)] bg-[var(--accent-dim)]"
            : available
              ? "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
              : "border-[var(--border)] bg-[var(--surface-2)] opacity-55"
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-xl font-black text-[var(--accent)] shadow-[inset_0_0_0_1px_var(--border)]">
          <CourseArtwork id={id} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-black text-[var(--text-1)]">{ui(name)}</span>
            {builtIn && (
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("Built-in")}
              </span>
            )}
          </span>
          <span className="mt-1 block text-[13px] font-bold leading-5 text-[var(--text-3)]">{ui(tagline)}</span>
        </span>
        {active ? (
          <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
        ) : !available ? (
          <Lock className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
        ) : null}
      </button>
    );
  };

  /**
   * English, once, with the two spellings side by side.
   *
   * These were two rows in the list — "English (UK)" and "English (US)" —
   * which read as two languages to learn and made switching between them a
   * hunt down the list. They are not two courses: selectCourse already treats
   * them as one, setting the same learn-en direction and only differing in
   * which spelling and accent it stores. So the picker now says that too, and
   * the two variants sit next to each other where swapping is one tap.
   *
   * It still calls onSelect with the real course id, so nothing downstream
   * has to know this row is a merge.
   */
  const EnglishCard = ({ uk, us }: { uk: (typeof COURSES)[number]; us: (typeof COURSES)[number] }) => {
    const activeVariant = activeCourseId === uk.id ? "uk" : activeCourseId === us.id ? "us" : null;
    const variants = [
      { key: "uk" as const, course: uk, label: "UK", detail: "colour, practise" },
      { key: "us" as const, course: us, label: "US", detail: "color, practice" },
    ];
    return (
      <div
        className={cn(
          "rounded-2xl border p-4 transition-all",
          activeVariant
            ? "border-[var(--accent)] bg-[var(--accent-dim)]"
            : "border-[var(--border)] bg-[var(--surface-2)]"
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] shadow-[inset_0_0_0_1px_var(--border)]">
            <CourseArtwork id={uk.id} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="text-sm font-black text-[var(--text-1)]">{ui("English")}</span>
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("Built-in")}
              </span>
            </span>
            <span className="mt-1 block text-[13px] font-bold leading-5 text-[var(--text-3)]">
              {ui("Same course, two spellings and accents. Pick one — you can swap any time.")}
            </span>
          </span>
          {activeVariant && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {variants.map((variant) => {
            const selected = activeVariant === variant.key;
            return (
              <button
                key={variant.key}
                type="button"
                aria-pressed={selected}
                onClick={() => { onSelect(variant.course.id); onClose(); }}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                  selected
                    ? "border-[var(--accent)] bg-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                  <CourseArtwork id={variant.course.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-black text-[var(--text-1)]">{variant.label}</span>
                  <span className="block truncate text-[11px] font-bold text-[var(--text-3)]">{ui(variant.detail)}</span>
                </span>
                {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 px-4 pt-[88px] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[min(78vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_28px_80px_var(--shadow-strong)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Switch course")}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("Pick a language, a programming track or the Life in the UK course.")}</p>
              </div>
              <button
                type="button"
                aria-label={ui("Close")}
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="relative mt-5 block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
              <input
                aria-label={ui("Search courses")}
                className="course-switcher-search h-12 w-full appearance-none rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-11 text-sm font-bold text-[var(--text-1)] transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:bg-[var(--surface)] outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui("Search languages or courses…")}
                ref={searchInputRef}
                type="search"
                value={query}
              />
              {query && (
                <button
                  aria-label={ui("Clear search")}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="-mr-2 mt-1 min-h-0 flex-1 overflow-y-auto pr-2">
              {languageRowCount > 0 && (
                <>
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">
                    {ui("Languages")}
                    <span className="ml-2 font-bold normal-case tracking-normal opacity-70">
                      {languageRowCount}
                    </span>
                  </p>
                  <div className="mt-2 grid gap-2">
                    {/* English sits at the top of the list: it is the one a
                        German speaker here is most likely to want, and the
                        merged card is taller than the rest. */}
                    {mergedEnglish && <EnglishCard uk={mergedEnglish.uk} us={mergedEnglish.us} />}
                    {languages.map((c) => <Card key={c.id} {...c} />)}
                  </div>
                </>
              )}

              {programming.length > 0 && (
                <>
                  <p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Programming")}</p>
                  <div className="mt-2 grid gap-2">
                    {programming.map((c) => <Card key={c.id} {...c} />)}
                  </div>
                </>
              )}

              {citizenship.length > 0 && (
                <>
                  <p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Living in the UK")}</p>
                  <div className="mt-2 grid gap-2">
                    {citizenship.map((c) => <Card key={c.id} {...c} />)}
                  </div>
                </>
              )}

              {visibleCourses.length === 0 && (
                <div className="mt-5 rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] px-5 py-8 text-center">
                  <p className="text-sm font-black text-[var(--text-1)]">{ui("No matching course")}</p>
                  <p className="mt-1 text-[13px] font-bold text-[var(--text-3)]">
                    {ui("Search by name, language code, or the name in that language — Deutsch, español, 日本語.")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
