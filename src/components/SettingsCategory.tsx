import {
  useId,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

/**
 * Settings as a board of categories, each opening under its own row.
 *
 * For a while this was a sidebar with a single panel beside it, and then one
 * long column. The column showed every name at once, which the sidebar never
 * did, but ten rows of two lines each is most of a screen before you have
 * opened anything. Two across halves that, and a row that is open takes the
 * whole width back — a colour picker or a voice list in half a column is not
 * a setting anyone can use.
 *
 * The search box sits above the board rather than over the page, because
 * typing to find a setting and picking one off the board are the same job.
 */
export function SettingsCategoryLayout({ children, search }: {
  children: ReactNode;
  /** Rendered above the board, as part of the same list. */
  search?: ReactNode;
}) {
  return (
    <div className="settings-layout">
      {search && <div className="settings-layout-search">{search}</div>}
      <div className="settings-list">{children}</div>
    </div>
  );
}

/**
 * One settings category: a card you press, and its panel underneath.
 *
 * The tone is the category's own colour, the way a folder has one. It says
 * which of ten you are looking at, so unlike the rest of the app's paint it
 * does not follow the learner's accent — ten categories in one accent are ten
 * identical tiles.
 */
export function SettingsCategory({
  children,
  defaultOpen = false,
  description,
  forceOpen = false,
  hidden = false,
  icon: Icon,
  title,
  tone,
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
  /** Which of the ten category colours this one wears. */
  tone?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [everOpened, setEverOpened] = useState(defaultOpen);
  const panelId = useId();

  if (hidden) return null;

  const isOpen = open || forceOpen;
  return (
    <div className={cn("settings-category", isOpen && "is-open")}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="settings-row"
        onClick={() => {
          setOpen((current) => !current);
          setEverOpened(true);
        }}
        type="button"
      >
        {/* Named classes, not Tailwind selectors: index.css holds the icon
            steady and reserves two lines for the description, so every card
            on the board is the same height whatever its text does. */}
        <span className="settings-panel-head">
          <span className="settings-panel-icon" data-tone={tone}>
            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
          </span>
          <span className="settings-row-text">
            <span className="settings-row-title">{title}</span>
            <span className="settings-panel-desc">{description}</span>
          </span>
        </span>
        {/* Turns a quarter when the card is open, so it points at what it
            opened rather than staying an arrow to somewhere else. */}
        <span aria-hidden="true" className="settings-row-go">
          <ArrowRight className="h-4 w-4" />
        </span>
        <span className="sr-only">{isOpen ? ui("Hide") : ui("Show")}</span>
      </button>
      {(everOpened || forceOpen) && (
        <div className="settings-panel" hidden={!isOpen} id={panelId}>
          {children}
        </div>
      )}
    </div>
  );
}
