import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

/**
 * Settings as a list of categories with a sidebar, not a column of accordions.
 *
 * Ten collapsed cards stacked down a page means finding anything is a matter of
 * reading ten descriptions and guessing which one hides it, then scrolling back
 * up when you guessed wrong. A sidebar shows every category at once and keeps
 * one of them open, which is how settings work in most things people already
 * use.
 *
 * The categories register themselves, so the sidebar is built from whatever is
 * actually rendered rather than from a second list that has to be kept in step
 * with it. That matters here because several categories are conditional.
 */
type Registered = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  hidden: boolean;
};

type NavContext = {
  register: (entry: Registered) => void;
  unregister: (id: string) => void;
  selected: string | null;
  select: (id: string) => void;
  /** Search is on: show every match at once instead of one category. */
  listMode: boolean;
};

const SettingsNavContext = createContext<NavContext | null>(null);

export function SettingsCategoryLayout({ children, searching, search }: {
  children: ReactNode;
  /** While searching, every matching category is shown in the panel. */
  searching: boolean;
  /** Rendered at the top of the sidebar: searching for a setting and
   *  picking one from a list are the same job, so they belong together
   *  rather than the search sitting above the whole page. */
  search?: ReactNode;
}) {
  const [entries, setEntries] = useState<Registered[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const value = useMemo<NavContext>(() => ({
    register: (entry) => setEntries((current) => {
      // Replace in place rather than re-appending: a category re-registers
      // whenever its title or hidden state changes, and moving it to the end
      // would shuffle the sidebar while you were looking at it. Mount order
      // is DOM order for siblings, so first registration sets the position.
      const at = current.findIndex((item) => item.id === entry.id);
      if (at === -1) return [...current, entry];
      const next = [...current];
      next[at] = entry;
      return next;
    }),
    unregister: (id) => setEntries((current) => current.filter((item) => item.id !== id)),
    selected,
    select: setSelected,
    listMode: searching,
  }), [selected, searching]);

  const visible = entries.filter((entry) => !entry.hidden);
  // Nothing chosen yet, or the chosen one disappeared: fall back to the first.
  const active = visible.some((entry) => entry.id === selected) ? selected : visible[0]?.id ?? null;

  return (
    <SettingsNavContext.Provider value={{ ...value, selected: active }}>
      <div className={cn("settings-layout", searching && "is-searching")}>
        <nav aria-label={ui("Settings categories")} className="settings-nav">
          {search && <div className="settings-nav-search">{search}</div>}
          {!searching && visible.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-current={entry.id === active ? "page" : undefined}
                className={cn("settings-nav-item", entry.id === active && "is-active")}
                onClick={() => setSelected(entry.id)}
              >
                <span className="settings-nav-icon">
                  <entry.icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="settings-nav-label">{entry.title}</span>
              </button>
          ))}
        </nav>
        <div className="settings-panel">{children}</div>
      </div>
    </SettingsNavContext.Provider>
  );
}

/**
 * One settings category.
 *
 * Inside a layout it registers itself and renders only when chosen. Outside
 * one — and while a search is running — it falls back to the collapsible card
 * it has always been, so search results still read as a list of sections.
 */
export function SettingsCategory({
  children,
  defaultOpen = false,
  description,
  forceOpen = false,
  hidden = false,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  description: string;
  /** Search opened this category: show its contents without changing the
   *  learner's own collapsed/expanded choice underneath. */
  forceOpen?: boolean;
  /** Search matched something else. Hidden rather than unmounted, so any
   *  half-typed value in here survives the search being cleared. */
  hidden?: boolean;
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [everOpened, setEverOpened] = useState(defaultOpen);
  const panelId = useId();
  const nav = useContext(SettingsNavContext);
  const id = panelId;

  useEffect(() => {
    if (!nav) return;
    nav.register({ id, title, description, icon: Icon, hidden });
    return () => nav.unregister(id);
    // register is stable per render of the layout; title/hidden are what change
  }, [id, title, description, hidden]);

  if (hidden) return null;

  // ── sidebar mode ────────────────────────────────────────────────────────
  if (nav && !nav.listMode) {
    if (nav.selected !== id) return null;
    return (
      <section aria-label={title} className="settings-category">
        <header className="settings-panel-head">
          <span className="settings-panel-icon">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="settings-panel-text min-w-0">
            <span className="block text-sm font-black text-[var(--text-1)]">{title}</span>
            {/* Named class, not a Tailwind selector: index.css reserves two
                lines here so every category's header is the same height. */}
            <span className="settings-panel-desc mt-0.5 block text-xs font-semibold text-[var(--text-3)]">{description}</span>
          </span>
        </header>
        <div id={panelId}>{children}</div>
      </section>
    );
  }

  // ── the original card, used while searching ─────────────────────────────
  const isOpen = open || forceOpen;
  return (
    <div className="settings-category mt-3">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={cn(
          // A white card on a near-white page has no edge at all. The border is
          // what makes each category read as a separate thing you can open.
          "flex w-full items-center justify-between gap-3 rounded-[18px] border border-[color:var(--card-edge)] bg-[var(--surface-2)] px-4 py-3.5 text-left transition-colors",
          "hover:bg-[var(--surface-3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        )}
        onClick={() => {
          setOpen((current) => !current);
          setEverOpened(true);
        }}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--accent-dim)] text-[var(--accent)]">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-black text-[var(--text-1)]">{title}</span>
            <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--text-3)]">{description}</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-black text-[var(--text-3)]">
            {isOpen ? ui("Hide") : ui("Show")}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 text-[var(--text-3)] transition-transform", isOpen && "rotate-180")}
          />
        </span>
      </button>
      {(everOpened || forceOpen) && (
        <div hidden={!isOpen} id={panelId}>
          {children}
        </div>
      )}
    </div>
  );
}
