import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import {
  INTERFACE_LANGUAGES,
  searchInterfaceLanguages,
  type InterfaceLanguage,
} from "@/lib/interfaceLanguage";

/**
 * The app-language control, as a searchable list rather than a `<select>`.
 *
 * A native select is fine at four options and stops being fine as the list
 * grows: it cannot be searched by anything except the first letter of the
 * label, and the label is in the language you are looking FOR — so a Spanish
 * speaker hunting for "Español" in an app currently written in Polish has to
 * read down a list of endonyms to find it. Typing is the natural move and a
 * select does not accept it.
 *
 * So: type to narrow, in the name a person actually reaches for. "spanish",
 * "espanol" and "Español" all find the same row, because the person most in
 * need of this box is the one whose keyboard will not make the ñ.
 *
 * Rendered as one component used in both places the setting appears. It was
 * two hand-written option lists, which is why the second one is easy to
 * forget when a language is added.
 */
export function AppLanguagePicker({
  autoLabel,
  onChange,
  value,
}: {
  /** What "Match my course" resolves to right now, shown beside it. */
  autoLabel: string;
  onChange: (language: InterfaceLanguage) => void;
  value: InterfaceLanguage;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const matches = useMemo(() => searchInterfaceLanguages(query), [query]);
  const chosen = INTERFACE_LANGUAGES.find((entry) => entry.value === value);
  const buttonLabel = value === "auto"
    ? `${ui("Match my course")} (${autoLabel})`
    : chosen?.label ?? ui("App language");

  // The query is what was typed for THIS opening. Keeping it would reopen the
  // list already narrowed to something chosen minutes ago, which reads as a
  // list that has lost most of its languages.
  useEffect(() => {
    if (!open) { setQuery(""); return; }
    const focus = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => window.clearTimeout(focus);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); }
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const pick = (language: InterfaceLanguage) => {
    onChange(language);
    setOpen(false);
  };

  const rowClass = (selected: boolean) => cn(
    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors",
    selected
      ? "bg-[var(--accent-dim)] text-[var(--accent)]"
      : "text-[var(--text-1)] hover:bg-[var(--surface-2)]"
  );

  return (
    <div className="relative mt-1" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-1)] outline-none transition-colors focus-visible:border-[var(--accent)]"
        data-testid="app-language-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">{buttonLabel}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[var(--text-3)] transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_45px_var(--shadow-strong)]"
          role="listbox"
        >
          <div className="relative border-b border-[var(--border)] p-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              className="h-9 w-full rounded-lg bg-[var(--surface-2)] pl-8 pr-3 text-sm font-semibold text-[var(--text-1)] outline-none placeholder:font-semibold placeholder:text-[var(--text-3)]"
              data-testid="app-language-search"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                // Enter takes the only remaining row, so a search that has
                // already answered does not need the mouse to confirm it.
                if (event.key === "Enter" && matches.length === 1) {
                  event.preventDefault();
                  pick(matches[0].value);
                }
              }}
              placeholder={ui("Search languages")}
              value={query}
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {/* "Match my course" is not a language and so is not searched —
                it is the setting's default and stays reachable at the top
                whenever nothing has been typed. */}
            {query.trim() ? null : (
              <button
                className={rowClass(value === "auto")}
                data-testid="app-language-auto"
                onClick={() => pick("auto")}
                role="option"
                aria-selected={value === "auto"}
                type="button"
              >
                <span>{ui("Match my course")} ({autoLabel})</span>
                {value === "auto" ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            )}

            {matches.map((entry) => (
              <button
                aria-selected={value === entry.value}
                className={rowClass(value === entry.value)}
                data-testid={`app-language-${entry.value}`}
                key={entry.value}
                onClick={() => pick(entry.value)}
                role="option"
                type="button"
              >
                <span>{entry.label}</span>
                {value === entry.value ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            ))}

            {matches.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs font-semibold text-[var(--text-3)]">
                {ui("No language matches that.")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
