import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { ui, uiFmt } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LEAN_SENTENCE_PHASES, sentenceStageHeading, sentenceStageLabel } from "@/lib/guidedLessonPhases";
import {
  CUSTOMISABLE_STAGES,
  customStageCount,
  getLessonStages,
  LONG_ROUTE_STAGES,
  MAX_STAGE_REPEATS,
  REQUIRED_STAGE,
  setLessonStages,
  type CustomisableStage,
  type LessonStagesSetting as StagesSetting,
  type StageChoice,
} from "@/lib/lessonStages";

type Choice = "recommended" | "long" | "custom";

const sameStages = (a: readonly StageChoice[], b: readonly StageChoice[]) =>
  a.length === b.length && a.every((entry, index) => entry.stage === b[index].stage && entry.repeats === b[index].repeats);

/** What starting to customise hands you: the route a new phrase takes today. */
const STARTING_POINT: StageChoice[] = CUSTOMISABLE_STAGES
  .filter((stage) => (LEAN_SENTENCE_PHASES as readonly string[]).includes(stage))
  .map((stage) => ({ stage, repeats: 1 }));

/**
 * The stages a lesson runs, set by hand.
 *
 * Three choices rather than a bare list, because the list is not the default.
 * Recommended is not a fixed set of stages — it picks per phrase, and lengthens
 * a route when a test is missed — so it cannot be drawn as ticks. The long
 * route is the old one, a press away. Anything else is custom, which starts
 * from what a new phrase takes today, so the first change made is a small one.
 */
export function LessonStagesSetting() {
  const [setting, setSetting] = useState<StagesSetting>(() => getLessonStages());

  const stages = setting.mode === "custom" ? setting.stages : [];
  const choice: Choice = setting.mode === "recommended"
    ? "recommended"
    : sameStages(stages, LONG_ROUTE_STAGES) ? "long" : "custom";

  const save = (next: StagesSetting) => setSetting(setLessonStages(next));

  const choose = (next: Choice) => {
    if (next === "recommended") save({ mode: "recommended" });
    else if (next === "long") save({ mode: "custom", stages: [...LONG_ROUTE_STAGES] });
    // Already custom: leave what has been built alone rather than resetting it.
    else if (choice !== "custom") save({ mode: "custom", stages: STARTING_POINT });
  };

  const repeatsOf = (stage: CustomisableStage) => stages.find((entry) => entry.stage === stage)?.repeats ?? 0;

  const setRepeats = (stage: CustomisableStage, repeats: number) => {
    const rest = stages.filter((entry) => entry.stage !== stage);
    save({ mode: "custom", stages: repeats > 0 ? [...rest, { stage, repeats }] : rest });
  };

  const count = customStageCount(stages);

  return (
    <div className="mt-5 rounded-[18px] bg-[var(--surface)] p-4">
      <p className="text-sm font-black text-[var(--text-1)]">{ui("The stages in a lesson")}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">
        {ui("Recommended picks the stages for each phrase: short when you pass the typing test, longer when you miss it. Or set them yourself, and how many times each one runs.")}
      </p>

      <div
        aria-label={ui("The stages in a lesson")}
        // Wraps rather than squeezes: three labels share this row, and the longest
        // of them in some languages (Длинный маршрут) does not fit a third of a
        // narrow drawer. Each keeps room for its own word and moves down a line
        // before it spills out of its button.
        className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-1.5"
        role="radiogroup"
      >
        {([
          ["recommended", "Recommended"],
          ["long", "Long route"],
          ["custom", "Custom"],
        ] as const).map(([value, label]) => {
          const selected = choice === value;
          return (
            <button
              aria-checked={selected}
              className={cn(
                "min-h-10 flex-[1_1_10rem] rounded-xl border px-2 py-2 text-xs font-black transition-[background-color,border-color,color] duration-150",
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_3px_0_var(--accent-dark)]"
                  : "border-transparent bg-transparent text-[var(--text-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
              )}
              data-testid={`lesson-stages-${value}`}
              key={value}
              onClick={() => choose(value)}
              role="radio"
              type="button"
            >
              {ui(label)}
            </button>
          );
        })}
      </div>

      {setting.mode === "custom" && (
        <>
          <p className="mt-3 text-xs font-black text-[var(--text-2)]" data-testid="lesson-stages-count">
            {count === 1
              ? ui("1 step for each new phrase")
              : uiFmt("{count} steps for each new phrase", { count })}
          </p>

          <ul className="mt-2 flex flex-col gap-1.5" data-testid="lesson-stages-list">
            {CUSTOMISABLE_STAGES.map((stage) => {
              const repeats = repeatsOf(stage);
              const on = repeats > 0;
              const required = stage === REQUIRED_STAGE;
              const name = ui(sentenceStageLabel(stage));
              return (
                <li
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors",
                    on ? "border-[var(--border)] bg-[var(--surface-2)]" : "border-transparent bg-[var(--surface-1)]"
                  )}
                  data-testid={`lesson-stage-${stage}`}
                  key={stage}
                >
                  <button
                    aria-checked={on}
                    aria-disabled={required}
                    aria-label={name}
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                      on
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]"
                        : "border-[var(--border-strong)] bg-transparent hover:border-[var(--accent)]",
                      required && "cursor-default opacity-70"
                    )}
                    onClick={() => { if (!required) setRepeats(stage, on ? 0 : 1); }}
                    role="checkbox"
                    type="button"
                  >
                    {on && <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />}
                  </button>

                  <span className="min-w-0 flex-1">
                    <strong className={cn("block truncate text-xs font-black", on ? "text-[var(--text-1)]" : "text-[var(--text-3)]")}>
                      {name}
                      {required && <span className="ml-1.5 font-semibold text-[var(--text-3)]">· {ui("Always on")}</span>}
                    </strong>
                    <small className="block truncate text-[11px] font-semibold text-[var(--text-3)]">
                      {ui(sentenceStageHeading(stage))}
                    </small>
                  </span>

                  {on && (
                    <span className="inline-flex shrink-0 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      <button
                        aria-label={uiFmt("Run {stage} fewer times", { stage: name })}
                        className="grid h-7 w-7 place-items-center rounded-l-lg text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
                        disabled={repeats <= 1}
                        onClick={() => setRepeats(stage, repeats - 1)}
                        type="button"
                      >
                        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-[2.25rem] text-center text-xs font-black tabular-nums text-[var(--text-1)]"
                      >
                        ×{repeats}
                      </span>
                      <button
                        aria-label={uiFmt("Run {stage} more times", { stage: name })}
                        className="grid h-7 w-7 place-items-center rounded-r-lg text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
                        disabled={repeats >= MAX_STAGE_REPEATS}
                        onClick={() => setRepeats(stage, repeats + 1)}
                        type="button"
                      >
                        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="mt-3 text-[11px] font-semibold leading-5 text-[var(--text-3)]">
            {ui("A phrase you already know still gets one quick recall, a single word skips the stages only a sentence can do, and a stage that needs sound is swapped out while the sound is off.")}
          </p>
        </>
      )}
    </div>
  );
}
