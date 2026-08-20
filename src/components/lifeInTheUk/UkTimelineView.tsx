import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ui } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  UK_ERA_LABELS,
  UK_ERA_ORDER,
  ukTimelineSorted,
  type UkEra,
} from "@/lib/lifeInTheUkTimeline";


/**
 * British history as a line, because that is the shape the test asks about.
 *
 * The prose lessons teach each period well but leave the learner to hold the
 * order in their head, and the order is exactly what gets tested: whether
 * 1707 came before 1801, which of two adjacent dates is the Act of Union with
 * Scotland and which with Ireland. Laid end to end, that stops being
 * something to memorise.
 *
 * Clicking an event opens its detail rather than navigating away, so you can
 * open three in a row and compare them without losing your place.
 */
export function UkTimelineView() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [era, setEra] = useState<UkEra | "all">("all");

  const events = useMemo(() => {
    const all = ukTimelineSorted();
    return era === "all" ? all : all.filter((entry) => entry.era === era);
  }, [era]);

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Timeline")}</h2>
        <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
          {ui("Every date the test asks about, in order. Tap an event to read more.")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEra("all")}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-black transition-colors",
              era === "all"
                ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
            )}
          >
            {ui("All")}
          </button>
          {UK_ERA_ORDER.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setEra(entry)}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-black transition-colors",
                era === entry
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
              )}
            >
              {ui(UK_ERA_LABELS[entry])}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        {/* The rail is drawn behind the markers, so the list reads as one
            continuous line rather than a stack of separate cards. */}
        <div className="relative pl-8">
          <div className="absolute bottom-2 left-[13px] top-2 w-px bg-[var(--border-2)]" aria-hidden="true" />
          <ol className="space-y-2">
            {events.map((entry) => {
              const open = openId === entry.id;
              return (
                <li key={entry.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-[22px] top-4 h-3 w-3 rounded-full border-2 transition-colors",
                      open
                        ? "border-[var(--accent)] bg-[var(--accent)]"
                        : "border-[var(--border-2)] bg-[var(--surface)]"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : entry.id)}
                    aria-expanded={open}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-colors",
                      open ? "bg-[var(--accent-dim)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                    )}
                  >
                    <span className="w-24 shrink-0 text-xs font-black tabular-nums text-[var(--accent)]">
                      {entry.displayYear}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-[var(--text-1)]">{entry.title}</span>
                      <span className="mt-0.5 block text-xs font-semibold leading-5 text-[var(--text-3)]">
                        {entry.summary}
                      </span>
                    </span>
                    <ChevronDown className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-[var(--text-3)] transition-transform",
                      open && "rotate-180"
                    )} />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-2xl bg-[var(--surface)] p-4">
                          <p className="text-sm font-semibold leading-6 text-[var(--text-2)]">{entry.detail}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--accent)]">
                              {entry.category}
                            </span>
                            {entry.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-3)]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
