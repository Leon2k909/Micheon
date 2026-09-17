/**
 * Which stages a lesson runs, and how many times.
 *
 * The route a new phrase takes is chosen by the app: short when the one typing
 * test in it is passed, the full march when it is missed, a single closed-book
 * recall once the phrase is known. That is the default and it stays the
 * default — it is the result of a long run of taking out stages that asked the
 * same question twice.
 *
 * But how much drilling suits somebody is theirs to decide. Some people learn
 * by writing a sentence out five times, and the route used to do exactly that:
 * fifteen stages, with Type and Translate each run twice. So the route can be
 * set by hand — any of the stages, in the order they always run, each up to
 * three times — and the long route is one press away.
 *
 * WHAT A CUSTOM ROUTE DOES NOT CHANGE. It governs how NEW material is taught.
 * A phrase already known still takes its single recall, an extension of a
 * sentence taught minutes ago still takes its short route, and the French
 * companion keeps its own: each of those is shorter for a reason a setting
 * about drilling new phrases has no business overriding. And the hard limits
 * stay hard — a stage that needs sound still gives way when the sound is off,
 * and a single word still skips the stages that only a sentence can do.
 */
import type { SentencePhase } from "@/lib/guidedLessonPhases";

/** Every stage a route can be built from, in the order a lesson runs them. */
export const CUSTOMISABLE_STAGES = [
  "Read",
  "MeaningSelect",
  "MeaningFirst",
  "ListenPick",
  "MissingWord",
  "Type",
  "Translate",
  "Gap",
  "Order",
  "WriteFromMemory",
  "RecallBoth",
] as const satisfies readonly SentencePhase[];

export type CustomisableStage = typeof CUSTOMISABLE_STAGES[number];

/** A stage and how many times it runs in a row. */
export interface StageChoice {
  stage: CustomisableStage;
  repeats: number;
}

export type LessonStagesSetting =
  | { mode: "recommended" }
  | { mode: "custom"; stages: StageChoice[] };

export const MAX_STAGE_REPEATS = 3;

/**
 * Read cannot be switched off. It is the only stage that shows the phrase
 * before asking anything about it, so a route without it opens with a test on
 * a sentence the learner has never seen.
 */
export const REQUIRED_STAGE: CustomisableStage = "Read";

export const DEFAULT_LESSON_STAGES: LessonStagesSetting = { mode: "recommended" };

/**
 * The long route: every stage there is, with the two writing stages that the
 * old fifteen-stage route ran twice run twice again.
 *
 * It lands on thirteen rather than fifteen, and honestly so. Two of the old
 * stages were single-direction recalls — the German alone, then the meaning
 * alone — and Recall both asks for both in one answer. The third was a
 * recognition check the other way round, which Meaning first now does as an
 * exposure. Each was folded into a stage that covers it, not dropped.
 */
export const LONG_ROUTE_STAGES: readonly StageChoice[] = [
  { stage: "Read", repeats: 1 },
  { stage: "MeaningSelect", repeats: 1 },
  { stage: "MeaningFirst", repeats: 1 },
  { stage: "ListenPick", repeats: 1 },
  { stage: "MissingWord", repeats: 1 },
  { stage: "Type", repeats: 2 },
  { stage: "Translate", repeats: 2 },
  { stage: "Gap", repeats: 1 },
  { stage: "Order", repeats: 1 },
  { stage: "WriteFromMemory", repeats: 1 },
  { stage: "RecallBoth", repeats: 1 },
];

const KEY = "gl-lesson-stages-v1";

const isCustomisableStage = (value: unknown): value is CustomisableStage =>
  (CUSTOMISABLE_STAGES as readonly string[]).includes(String(value));

/**
 * A stage list made safe to run: known stages only, each once, in lesson
 * order, repeats clamped to 1–3, and Read always present.
 *
 * Stored settings outlive the code that wrote them — a stage can be renamed or
 * retired by an update — so what comes back from storage is never trusted to
 * be a route as it stands.
 */
export function normaliseStageChoices(raw: unknown): StageChoice[] {
  const byStage = new Map<CustomisableStage, number>();
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      const stage = (entry as { stage?: unknown })?.stage;
      if (!isCustomisableStage(stage) || byStage.has(stage)) continue;
      const repeats = Math.round(Number((entry as { repeats?: unknown })?.repeats));
      byStage.set(stage, Number.isFinite(repeats) ? Math.min(MAX_STAGE_REPEATS, Math.max(1, repeats)) : 1);
    }
  }
  if (!byStage.has(REQUIRED_STAGE)) byStage.set(REQUIRED_STAGE, 1);
  return CUSTOMISABLE_STAGES
    .filter((stage) => byStage.has(stage))
    .map((stage) => ({ stage, repeats: byStage.get(stage) ?? 1 }));
}

export function getLessonStages(): LessonStagesSetting {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (!stored) return DEFAULT_LESSON_STAGES;
    const parsed = JSON.parse(stored) as { mode?: unknown; stages?: unknown };
    if (parsed?.mode === "custom") return { mode: "custom", stages: normaliseStageChoices(parsed.stages) };
  } catch { /* storage blocked or unreadable: the documented default */ }
  return DEFAULT_LESSON_STAGES;
}

export function setLessonStages(value: LessonStagesSetting): LessonStagesSetting {
  const next: LessonStagesSetting = value.mode === "custom"
    ? { mode: "custom", stages: normaliseStageChoices(value.stages) }
    : DEFAULT_LESSON_STAGES;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* keep the session usable */ }
  return next;
}

/**
 * The route a custom setting asks for, one entry per step: a stage set to run
 * twice appears twice. Undefined for the recommended route, which the route
 * builder chooses per phrase instead.
 */
export function customStageRoute(setting: LessonStagesSetting): SentencePhase[] | undefined {
  if (setting.mode !== "custom") return undefined;
  return normaliseStageChoices(setting.stages)
    .flatMap(({ stage, repeats }) => Array.from({ length: repeats }, () => stage));
}

/** How many steps a new phrase takes under a custom setting. */
export function customStageCount(stages: readonly StageChoice[]): number {
  return normaliseStageChoices(stages).reduce((sum, { repeats }) => sum + repeats, 0);
}
