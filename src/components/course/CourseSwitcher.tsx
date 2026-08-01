import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/lib/courseRegistry";
import { ui } from "@/lib/i18n";

const COURSE_SEARCH_ALIASES: Record<string, string> = {
  german: "de deutsch germany deutschland alemann allemand",
  spanish: "es espanol español spain spanisch espagnol",
  french: "fr francais français france franzosisch französisch",
  csharp: "c# c sharp dotnet .net programming coding sandbox sbox s&box",
};

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
      : "linear-gradient(to right, #0055a4 0 33.333%, #ffffff 33.333% 66.666%, #ef4135 66.666% 100%)";

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
  const normalizedQuery = query.trim().toLocaleLowerCase();
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
      ].join(" ").toLocaleLowerCase();
      return normalizedQuery.split(/\s+/).every((term) => corpus.includes(term));
    });
  }, [normalizedQuery]);
  const languages = visibleCourses.filter((c) => c.kind === "language");
  const programming = visibleCourses.filter((c) => c.kind === "programming");

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
            className="w-full max-w-lg rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_28px_80px_var(--shadow-strong)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Switch course")}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">{ui("Pick a language or a programming track.")}</p>
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
                className="h-12 w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-11 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:bg-[var(--surface)]"
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

            {languages.length > 0 && (
              <>
                <p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Languages")}</p>
                <div className="mt-2 grid gap-2">
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

            {visibleCourses.length === 0 && (
              <div className="mt-5 rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] px-5 py-8 text-center">
                <p className="text-sm font-black text-[var(--text-1)]">{ui("No matching course")}</p>
                <p className="mt-1 text-[13px] font-bold text-[var(--text-3)]">{ui("Try German, Spanish, French, C#, or s&box.")}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
