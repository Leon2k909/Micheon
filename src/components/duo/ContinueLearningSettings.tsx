import { useState } from "react";
import { CEFR_STEPS, cefrStepLabel, type CefrStep } from "@/lib/cefr";
import { getLearningDirection } from "@/lib/direction";
import { ui } from "@/lib/i18n";
import {
  getSittingLevelFilters,
  getSittingOrder,
  setSittingLevelFilters,
  setSittingOrder,
  type SittingOrder,
} from "@/lib/sittingOrder";
import { cn } from "@/lib/utils";

/**
 * How Continue learning is put together, chosen by the learner.
 *
 * Listen has had this for a while — order, levels, what plays — and the
 * guided session had one fixed answer. The choices are the same shape so a
 * learner who has set up Listen recognises them: an order, which decides
 * what comes first and still teaches everything, and levels, which decide
 * what is in the sitting at all. Reviews are never filtered; what you have
 * started, you finish.
 *
 * Per course, like Listen's settings, read straight from storage on every
 * render of this panel and written on every click, so the next sitting —
 * which is built on a fresh page load — sees exactly what the panel shows.
 */
const ORDER_CHOICES = [
  ["course", "The course's pick"],
  ["level", "Easiest first (A1 → C1)"],
  ["common", "Most common first"],
  ["similar", "Similar sentences together"],
  ["conversation", "Conversation order"],
  ["shortest", "Shortest first"],
  ["longest", "Longest first"],
] as const;

const CHOICE =
  "min-h-10 rounded-xl border px-2 py-2 text-[11px] font-black leading-tight transition-[background-color,border-color,color,transform,box-shadow] duration-150";
const CHOICE_ON = "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_3px_0_var(--accent-dark)]";
const CHOICE_OFF =
  "border-transparent bg-transparent text-[var(--text-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]";

export function ContinueLearningSettings() {
  const direction = getLearningDirection();
  const [order, setOrder] = useState<SittingOrder>(() => getSittingOrder(direction));
  const [levels, setLevels] = useState<Set<CefrStep>>(() => getSittingLevelFilters(direction));

  const chooseOrder = (value: SittingOrder) => setOrder(setSittingOrder(value, direction));
  const toggleLevel = (step: CefrStep) => {
    const next = new Set(levels);
    if (next.has(step)) next.delete(step); else next.add(step);
    setLevels(setSittingLevelFilters(next, direction));
  };

  return (
    <section className="card p-5" data-testid="continue-learning-settings">
      <h3 className="text-sm font-black tracking-tight text-[var(--text-1)]">
        {ui("How Continue learning is put together")}
      </h3>
      <fieldset className="mt-2">
        <legend className="text-xs font-black text-[var(--text-2)]">{ui("Order")}</legend>
        {/*
          leading-4, not leading-5, and mt-0 not mt-0.5: at the width this
          panel actually opens at — anchored beside the gear, capped by
          whatever room the window has — these two paragraphs run several
          lines each. Every pixel trimmed here, and off the grids and
          fieldsets below, is a pixel the level grid keeps below the bottom
          edge instead of past it; none of it changes what the text says or
          how many choices are on the board.
        */}
        <p className="mt-0 text-[11px] font-semibold leading-4 text-[var(--text-3)]">
          {ui("The course's pick blends how common a sentence is with how hard it is and how far you are. Easiest first takes all of one level before the next. Most common first takes what people say most, whatever the level. Similar sentences together takes the next sentence and then every sentence that starts the same way — all the “Ich möchte …”, then all the “Kannst du …”. Conversation order takes an exchange as the dialogues have it — a question, then the answer that fits it, then what comes next. Shortest first and Longest first go by length. Reviews come back whatever the order.")}
        </p>
        {/*
          Always 3 columns, not 2-below-sm-then-3: a 7th order joined this
          list and 2 columns turned it into 4 rows, which is exactly the row
          the panel no longer had room for. 3 columns keeps it at 3 rows
          whatever the window is doing, and it's the same layout desktop
          already showed at this width — nothing here is untested.
        */}
        <div
          aria-label={ui("Order")}
          className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-1"
          role="radiogroup"
        >
          {ORDER_CHOICES.map(([value, label]) => {
            const selected = order === value;
            return (
              <button
                aria-checked={selected}
                className={cn(CHOICE, selected ? CHOICE_ON : CHOICE_OFF)}
                data-testid={`sitting-order-${value}`}
                key={value}
                onClick={() => chooseOrder(value)}
                role="radio"
                type="button"
              >
                {ui(label)}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="mt-3 border-t border-[var(--border)] pt-3">
        <legend className="text-xs font-black text-[var(--text-2)]">{ui("Levels")}</legend>
        <p className="mt-0 text-[11px] font-semibold leading-4 text-[var(--text-3)]">
          {ui("Order decides what comes first and still teaches everything. This decides what a sitting draws on at all, so you can work through one level and stop. Reviews are never held back.")}
        </p>
        {/* Several levels can be on at once, and none on means every level. */}
        <div
          aria-label={ui("Levels")}
          className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-1 sm:grid-cols-4"
          role="group"
        >
          <button
            aria-pressed={levels.size === 0}
            className={cn(CHOICE, levels.size === 0 ? CHOICE_ON : CHOICE_OFF)}
            data-testid="sitting-level-all"
            onClick={() => setLevels(setSittingLevelFilters([], direction))}
            type="button"
          >
            {ui("All levels")}
          </button>
          {CEFR_STEPS.map((step) => {
            const selected = levels.has(step);
            return (
              <button
                aria-pressed={selected}
                className={cn(CHOICE, selected ? CHOICE_ON : CHOICE_OFF)}
                data-testid={`sitting-level-${step}`}
                key={step}
                onClick={() => toggleLevel(step)}
                type="button"
              >
                {cefrStepLabel(step)}
              </button>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
