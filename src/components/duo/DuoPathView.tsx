import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Lock, MessagesSquare, Play, Rocket, Shuffle, Star } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { buildDuoPath } from "@/lib/duoPath";
import { MatcherView } from "@/components/matcher/MatcherView";
import { ConversationView } from "@/components/conversation/ConversationView";
import { duoUnitAnchorId } from "@/lib/scrollToAnchor";

/**
 * Four ways in, side by side.
 *
 * The app already had one: a button that hands you the next thing you should
 * see. It is efficient and it is opaque — you cannot tell where you are, what
 * this unit is called, or what comes after it. This screen keeps that button
 * exactly as it was and puts the path beside it: the same curriculum, the same
 * grades, drawn as a route with your position on it.
 *
 * The path is a map rather than a mode. Every stop on it opens the guided
 * session on that unit, which is the one place a phrase gets taught properly.
 * It used to open a lesson of its own — ten quick turns and five hearts — and
 * that was a second opinion about how to teach, kept alongside the first: the
 * same five exercise shapes the guided session already runs, in a shorter
 * order, grading into the same store. Two teachers for one course is how the
 * two drift apart. So the map now points at the session, and what the quick
 * lesson was actually for — variety, and not being marched through the same
 * stages every time — belongs to the session it points at.
 *
 *
 * The fast track answers a different question again: not where am I in the
 * course, but what do I need to hold a conversation. The curriculum has the
 * rooms of a house and the things on a desk in it, and somebody who wants to
 * talk to a person this month should not have to walk past them.
 */
export function DuoPathView({
  apiParts,
  onGuidedSession,
  onFastTrack,
  onOpenLesson,
  lessonsCompleted,
}: {
  apiParts: Record<string, unknown>;
  onGuidedSession: () => void;
  onFastTrack: () => void;
  /** Opens the guided session on one pack — a stop on the path. */
  onOpenLesson: (packKey: string) => void;
  lessonsCompleted: number;
}) {
  const [matching, setMatching] = useState(false);
  const [conversing, setConversing] = useState(false);

  const path = useMemo(() => buildDuoPath(apiParts), [apiParts]);

  if (matching) {
    return <MatcherView apiParts={apiParts} profile={null} onExit={() => setMatching(false)} />;
  }

  if (conversing) {
    return (
      <div className="space-y-4">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3.5 text-xs font-black text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
          onClick={() => setConversing(false)}
          type="button"
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
          {ui("Back")}
        </button>
        <ConversationView apiParts={apiParts} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/*
        The ways in, side by side.

        Four of them: the quick path came out — it was a second teacher for
        one course — and the fast track went in beside Continue learning. The
        widest row has to seat all four, or whichever was added last sits
        alone underneath looking like an afterthought.
      */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {/*
          The second way in, and the one that skips the rest of the course.
          Continue learning walks the curriculum in order, which is right for
          somebody working through it and slow for somebody who wants to talk
          to a person this month — the order has the rooms of a house and the
          things on a desk in it. This draws on the conversational packs only:
          greetings, repairing a conversation, reacting, plans, then family,
          food, money, health. Same seven stages, much smaller course.
        */}
        <button
          type="button"
          onClick={onFastTrack}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <Rocket className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Fast track")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Straight to talking")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("Only what a conversation needs — greetings, reactions, plans, family, food. No rooms, no furniture.")}
            </span>
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-black text-[var(--accent)]">
            {ui("Start")} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>

        {/*
          The second way in: the tracker, in pairs, endlessly. It sits beside
          the guided session rather than under Games because it walks the same
          queue the course does — it is practice, not a diversion.

          It is also a stage inside the session now, on the phrases that
          session is teaching. Both are wanted: here it is the whole course to
          dip into, there it is today's material to warm up on.
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
        {/*
          The third: a conversation rather than a drill. The other two teach a
          phrase; this one puts somebody in front of you saying something and
          asks what you say back, which is the only one of the three that is
          about knowing WHEN to use what you know.
        */}
        <button
          type="button"
          onClick={() => setConversing(true)}
          className="card card-hover flex flex-col items-start gap-3 p-5 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
            <MessagesSquare className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
              {ui("Conversation")}
            </span>
            <strong className="mt-1 block text-lg font-black tracking-tight text-[var(--text-1)]">
              {ui("Say something back")}
            </strong>
            <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">
              {ui("A shop, a station, a doctor — they speak, you choose your reply, one turn at a time.")}
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
                        onClick={() => onOpenLesson(node.key)}
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
