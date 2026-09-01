import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { ui, uiFmt, uiNumber } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  LONG_LIST_THRESHOLD,
  type LongListMode,
  type PageWindow,
} from "@/lib/longLists";

/**
 * The two ways a long list gets around, and the switch between them.
 *
 * Both controls are here together because they are one decision: a list is
 * either paged or scrolled, and whichever it is, the reader needs to be able
 * to say where they are and get somewhere else.
 */

/** Pages: which one, how many, and a way to the next. */
export function ListPager({ window: page, onPage }: { window: PageWindow; onPage: (page: number) => void }) {
  if (page.pageCount <= 1) {
    return (
      <p className="mt-3 text-center text-[11px] font-bold text-[var(--text-3)]">
        {uiFmt("{count} shown", { count: uiNumber(page.total) })}
      </p>
    );
  }
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page.page === 1}
        onClick={() => onPage(page.page - 1)}
        className="inline-flex h-9 items-center gap-1 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-35"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {ui("Back")}
      </button>
      <p className="px-1 text-[11px] font-bold text-[var(--text-3)]">
        {uiFmt("{from}-{to} of {total}", {
          from: uiNumber(page.from),
          to: uiNumber(page.to),
          total: uiNumber(page.total),
        })}
      </p>
      <button
        type="button"
        disabled={page.page === page.pageCount}
        onClick={() => onPage(page.page + 1)}
        className="inline-flex h-9 items-center gap-1 rounded-xl bg-[var(--surface-2)] px-3 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)] disabled:opacity-35"
      >
        {ui("Next")}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * Scroll mode still has a bottom.
 *
 * "One long scroll" cannot mean "render everything": the catalogue is 23,584
 * rows, and putting them all in the document at once locks the browser up for
 * seconds and then scrolls badly forever. So the long scroll grows a chunk at
 * a time, which is what every long feed does and what nobody notices.
 */
export function ShowMore({
  shown,
  total,
  onMore,
}: { shown: number; total: number; onMore: () => void }) {
  if (shown >= total) {
    return (
      <p className="mt-3 text-center text-[11px] font-bold text-[var(--text-3)]">
        {uiFmt("{count} shown", { count: uiNumber(total) })}
      </p>
    );
  }
  return (
    <div className="mt-3 flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onMore}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-5 text-xs font-black text-[var(--text-1)] transition-colors hover:bg-[var(--surface-3)]"
      >
        <ChevronDown className="h-3.5 w-3.5" />
        {ui("Show more")}
      </button>
      <p className="text-[11px] font-bold text-[var(--text-3)]">
        {uiFmt("{shown} of {total}", { shown: uiNumber(shown), total: uiNumber(total) })}
      </p>
    </div>
  );
}

/**
 * Get to a position, and actually arrive.
 *
 * Smooth is the nicer motion and is skipped when the reader has asked for
 * less of it. But smooth is also a request rather than a promise — some
 * browsers accept the call and do nothing, which was true of the one this was
 * built in, with no reduced-motion preference set. A control whose entire job
 * is "take me there" cannot be left depending on that, so it checks a moment
 * later and finishes the trip itself if nothing moved.
 */
function jumpTo(top: number) {
  const gentle = typeof window.matchMedia === "function"
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: gentle ? "smooth" : "auto" });
  if (!gentle) return;
  const started = window.scrollY;
  window.setTimeout(() => {
    if (Math.abs(window.scrollY - started) < 4 && Math.abs(window.scrollY - top) > 4) {
      window.scrollTo({ top, behavior: "auto" });
    }
  }, 250);
}

/**
 * Scroll: a jump to either end, pinned to the right of the window.
 *
 * It points wherever you are not — down until you are near the bottom, then
 * up — so one control covers both ends without asking which you meant. Fixed
 * rather than sticky, because the list is inside a scrolling page rather than
 * its own scroll box.
 */
export function ScrollJump({ enabled }: { enabled: boolean }) {
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;
    const update = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(height > 400);
      setDirection(top > height - 200 ? "up" : "down");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  if (!enabled || !visible) return null;
  const goingDown = direction === "down";
  return (
    <button
      type="button"
      data-testid="scroll-jump"
      aria-label={ui(goingDown ? "Jump to the bottom" : "Back to the top")}
      title={ui(goingDown ? "Jump to the bottom" : "Back to the top")}
      onClick={() => {
        jumpTo(goingDown ? document.documentElement.scrollHeight : 0);
        // The jump lands at a known end, so the control turns round now
        // rather than waiting to be told by a scroll event — which is not
        // always emitted for a programmatic jump, and left the button at
        // the bottom of the page still offering to take you there.
        setDirection(goingDown ? "up" : "down");
      }}
      className="fixed right-4 bottom-24 z-[420] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] shadow-lg transition-transform hover:brightness-110 active:scale-95 sm:right-6"
    >
      {goingDown ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
    </button>
  );
}

/**
 * The switch itself, shown only once a list is long enough for the choice to
 * mean anything — offering it on a list of nine cards is noise.
 */
export function LongListChoice({
  mode,
  onMode,
  total,
}: {
  mode: LongListMode;
  onMode: (mode: LongListMode) => void;
  total: number;
}) {
  if (total < LONG_LIST_THRESHOLD) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
        {ui("Long lists")}
      </span>
      {([["pages", "Pages"], ["scroll", "One long scroll"]] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onMode(value)}
          aria-pressed={mode === value}
          className={cn(
            "rounded-xl border px-3 py-1.5 text-xs font-black transition-colors",
            mode === value
              ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
          )}
        >
          {ui(label)}
        </button>
      ))}
    </div>
  );
}
