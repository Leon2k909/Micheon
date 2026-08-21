import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Lock, Play, Shuffle, Star, Zap } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { buildDuoPath, type DuoNode } from "@/lib/duoPath";
import { DuoLesson } from "@/components/duo/DuoLesson";
import { MatcherView } from "@/components/matcher/MatcherView";

/**
 * Three ways in, side by side.
 *
 * The app already had one: a button that hands you the next thing you should
 * see. It is efficient and it is opaque — you cannot tell where you are, what
 * this unit is called, or what comes after it. This screen keeps that button
 * exactly as it was and puts a second one beside it, leading into a path: the
 * same curriculum, the same grades, drawn as a route with your position on it.
 *
 * They are not alternatives to choose between once. They suit different
 * moments — the guided session for sitting down properly, the path for five
 * minutes standing up — which is why both are on screen at the same time
 * rather than behind a setting.
 */
export function DuoPathView({
  apiParts,
  onGuidedSession,
  lessonsCompleted,
}: {
  apiParts: Record<string, unknown>;
  onGuidedSession: () => void;
  lessonsCompleted: number;
}) {
  const [activeNode, setActiveNode] = useState<DuoNode | null>(null);
  const [matching, setMatching] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  // Rebuilt after a lesson so finished nodes fill in without a reload.
  const path = useMemo(
    () => buildDuoPath(apiParts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiParts, refreshToken]
  );

  if (matching) {
    return <MatcherView apiParts={apiParts} profile={null} onExit={() => setMatching(false)} />;
  }

  if (activeNode) {
    return (
      <DuoLesson
        apiParts={apiParts}
        packKey={activeNode.key}
        packTitle={activeNode.title}
        onExit={() => { setActiveNode(null); setRefreshToken((value) => value + 1); }}
      />
    );
  }

  const current = path.current;

  return (
    <div className="space-y-4">
      {/* The two ways in. */}
      <section className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onGuidedSession}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Play className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Guided session")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Continue learning")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {uiFmt("Lesson {n}. Seven stages on one phrase at a time — read, choose, type, translate, recall.", { n: lessonsCompleted + 1 })}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        <button
          type="button"
          disabled={!current}
          onClick={() => current && setActiveNode(current)}
          className={cn(
            "card flex flex-col items-start gap-3 p-5 text-left transition-all",
            current ? "card-hover border-[var(--accent)]" : "opacity-60"
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-text)]">
            <Zap className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Quick path")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {current ? ui("Continue the path") : ui("Path complete")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {current
                ? uiFmt("{title} — ten quick turns, five hearts.", { title: current.title })
                : ui("Every unit in the course is finished.")}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
        {/*
          The third way in: the tracker, in pairs, endlessly. It sits beside
          the other two rather than under Games because it walks the same
          queue the course does — it is practice, not a diversion.
        */}
        <button
          type="button"
          onClick={() => setMatching(true)}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Shuffle className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Matcher")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Match and keep going")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("German against English, six pairs at a time — words or sentences, refilling until you stop.")}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </section>

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

          {path.units.map((unit) => (
            <section key={unit.number} className="card p-5 sm:p-6">
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
                  const locked = node.state === "locked";
                  return (
                    <li
                      key={node.key}
                      className="flex items-center gap-3"
                      style={{ paddingLeft: `${offset}px` }}
                    >
                      <motion.button
                        type="button"
                        disabled={locked}
                        onClick={() => setActiveNode(node)}
                        whileTap={locked ? undefined : { scale: 0.94 }}
                        aria-label={`${node.title} — ${node.done}/${node.total}`}
                        className={cn(
                          "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 transition-all",
                          node.state === "done"
                            ? "border-[var(--success-text)] bg-[var(--success-bg)] text-[var(--success-text)]"
                            : node.state === "current"
                              ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_0_6px_rgba(var(--accent-rgb),0.18)]"
                              : node.state === "available"
                                ? "border-[var(--border-2)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--accent)]"
                                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-3)] cursor-not-allowed"
                        )}
                      >
                        {node.state === "done" ? <Check className="h-6 w-6" />
                          : node.state === "current" ? <Star className="h-6 w-6 fill-current" />
                          : locked ? <Lock className="h-5 w-5" />
                          : <span className="text-sm font-black">{node.index + 1}</span>}
                      </motion.button>

                      <div className="min-w-0 flex-1 py-2">
                        <p className={cn(
                          "truncate text-sm font-black",
                          locked ? "text-[var(--text-3)]" : "text-[var(--text-1)]"
                        )}>
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
