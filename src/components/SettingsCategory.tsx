import {
  useId,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

/**
 * Settings as one column of categories, each opening under its own row.
 *
 * For a while this was a sidebar with a single panel beside it. That put the
 * list and the thing you had just opened in two different columns and only
 * ever showed one category at a time, so comparing two settings, or checking
 * what you changed a moment ago, meant clicking back and forth across the
 * page. A column of disclosures shows the same names and opens any number of
 * them in place, under the name you pressed.
 *
 * The search box sits above the list rather than over the whole page, because
 * typing to find a setting and picking one out of the list are the same job.
 */
export function SettingsCategoryLayout({ children, search }: {
  children: ReactNode;
  /** Rendered above the categories, as part of the same list. */
  search?: ReactNode;
}) {
  return (
    <div className="settings-layout">
      {search && <div className="settings-layout-search">{search}</div>}
      {children}
    </div>
  );
}

/**
 * One settings category: a row you press, and its panel underneath.
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

  if (hidden) return null;

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
        {/* Named classes, not Tailwind selectors: index.css anchors the icon to
            the top of the row and reserves two lines for the description, so
            ten rows down the column are the same height whatever their text
            does. */}
        <span className="settings-panel-head min-w-0">
          <span className="settings-panel-icon">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-black text-[var(--text-1)]">{title}</span>
            <span className="settings-panel-desc mt-0.5 block text-xs font-semibold leading-snug text-[var(--text-3)]">{description}</span>
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
