import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Eye, Star } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { buildDuoPath } from "@/lib/duoPath";
import { duoUnitAnchorId } from "@/lib/scrollToAnchor";

/**
 * The course as a route: the units, their nodes, and the progress across them.
 *
 * It is the same catalogue the lesson list shows, drawn as a path with your
 * position on it. Which is exactly why it stopped being a place of its own.
 * Sitting under Learn beside the ways to start a session, it asked a learner
 * to hold two mental models of one course and to remember which screen showed
 * which — a list of lessons over here, the same lessons as a path over there.
 * It is a VIEW of the lessons, so it lives in Lessons as one.
 *
 * It takes the catalogue and a way to open a pack, and nothing else — no
 * cards, no session buttons. Whoever renders it decides what surrounds it.
 */
export function DuoPath({
  apiParts,
  onOpenLesson,
  hideFinished,
  onShowFinished,
}: {
  apiParts: Record<string, unknown>;
  onOpenLesson: (packKey: string) => void;
  /** The lesson list's shelf, applied here so one course has one answer. */
  hideFinished: boolean;
  /** Takes the shelf off, for the row that says how much it is holding. */
  onShowFinished: () => void;
}) {
  const path = useMemo(
    () => buildDuoPath(apiParts, undefined, { hideFinished }),
    [apiParts, hideFinished]
  );
  // Counted by the build itself, so the number and the path it describes come
  // from one pass over the catalogue and cannot disagree.
  const shelved = path.shelvedNodes;

  return (
    <div className="space-y-4">
    {path.units.length === 0 ? (
      <section className="card p-8 text-center">
        <p className="text-sm font-black text-[var(--text-1)]">{ui("Building your path")}</p>
        <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
          {ui("The course catalogue is still loading.")}
        </p>
      </section>
    ) : (
      <>
        <section className="card flex items-center justify-between gap-3 p-5">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Your path")}</h2>
            <p className="mt-0.5 text-xs font-semibold text-[var(--text-3)]">
              {uiFmt("{done} of {total} units complete", { done: path.doneNodes, total: path.totalNodes })}
            </p>
          </div>
          <span className="rounded-full bg-[var(--accent-dim)] px-3 py-1.5 text-sm font-black text-[var(--accent)]">
            {path.totalNodes === 0 ? 0 : Math.round((path.doneNodes / path.totalNodes) * 100)}%
          </span>
        </section>

        {/*
          What the shelf is holding, and the way back out of it.

          The same promise the lesson list makes: nothing is deleted, the
          control that put them away carries the count, and it is a visible
          button rather than a setting somewhere else — a path that quietly
          drops four hundred units is a path that gets blamed for losing them.
        */}
        {shelved > 0 && (
          <button
            className="inline-flex items-center gap-2 self-start rounded-xl bg-[var(--surface-2)] px-3.5 py-2 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
            onClick={onShowFinished}
            type="button"
          >
            <Eye className="h-3.5 w-3.5" />
            {uiFmt("{count} finished put away — show them", { count: shelved })}
          </button>
        )}

        {path.units.map((unit) => (
          // The id is what search scrolls to. scroll-margin keeps the unit's
          // own heading clear of the sticky header it would otherwise land
          // under, which reads as having scrolled to the wrong unit.
          <section
            key={unit.number}
            className="card scroll-mt-24 p-5 sm:p-6"
            id={duoUnitAnchorId(unit.number)}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-[var(--accent)]">
                  {uiFmt("Unit {n}", { n: unit.number })}
                  {unit.level ? ` · ${unit.level}` : ""}
                </p>
                <h3 className="mt-1 truncate text-base font-black tracking-tight text-[var(--text-1)]">
                  {unit.title}
                </h3>
              </div>
              <span className="shrink-0 text-xs font-bold text-[var(--text-3)]">{unit.percent}%</span>
            </div>

            {/* The winding trail. Nodes alternate left and right of centre so
                the eye follows a route rather than reading a list. */}
            <ol className="mt-5 space-y-1">
              {unit.nodes.map((node, nodeIndex) => {
                const offset = [0, 34, 52, 34, 0][nodeIndex % 5];
                return (
                  <li
                    key={node.key}
                    className="flex items-center gap-3"
                    style={{ paddingLeft: `${offset}px` }}
                  >
                    {/*
                      Every node opens. The path recommends an order; it
                      does not enforce one, and it never did so honestly —
                      the guided session has always taught from any pack, so
                      packs arrived here part-finished and still greyed out.
                    */}
                    <motion.button
                      type="button"
                      onClick={() => onOpenLesson(node.key)}
                      whileTap={{ scale: 0.94 }}
                      aria-label={`${node.title} — ${node.done}/${node.total}`}
                      className={cn(
                        "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 transition-all",
                        node.state === "done"
                          ? "border-[var(--success-text)] bg-[var(--success-bg)] text-[var(--success-text)]"
                          : node.state === "current"
                            ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_0_6px_rgba(var(--accent-rgb),0.18)]"
                            : "border-[var(--border-2)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--accent)]"
                      )}
                    >
                      {node.state === "done" ? <Check className="h-6 w-6" />
                        : node.state === "current" ? <Star className="h-6 w-6 fill-current" />
                        : <span className="text-sm font-black">{node.index + 1}</span>}
                    </motion.button>

                    <div className="min-w-0 flex-1 py-2">
                      <p className="truncate text-sm font-black text-[var(--text-1)]">
                        {node.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--surface-2)]">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              node.state === "done" ? "bg-[var(--success-text)]" : "bg-[var(--accent)]"
                            )}
                            style={{ width: `${node.percent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[var(--text-3)]">
                          {node.done}/{node.total}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </>
    )}
    </div>
  );
}
