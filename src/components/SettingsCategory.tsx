import { useId, useState, type ComponentType, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";

/**
 * A collapsed-by-default settings group. The children are not mounted until
 * the first open, so rarely visited settings cost nothing on the profile
 * screen's first paint; after that they stay mounted (hidden) so reopening is
 * instant and any in-progress state survives a collapse.
 */
export function SettingsCategory({
  children,
  defaultOpen = false,
  description,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  description: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [everOpened, setEverOpened] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="mt-3">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(
          // A white card on a near-white page has no edge at all. The border is
          // what makes each category read as a separate thing you can open.
          "flex w-full items-center justify-between gap-3 rounded-[18px] border border-[color:var(--card-edge)] bg-[var(--surface)] px-4 py-3.5 text-left transition-colors",
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
            {open ? ui("Hide") : ui("Show")}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 text-[var(--text-3)] transition-transform", open && "rotate-180")}
          />
        </span>
      </button>
      {everOpened && (
        <div hidden={!open} id={panelId}>
          {children}
        </div>
      )}
    </div>
  );
}
