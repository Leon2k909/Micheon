/**
 * How Continue learning decides what a sitting is made of.
 *
 * It used to have one answer: the course's own pick, a score that blends how
 * common a sentence is with how hard it is and where the learner's ability
 * sits. That is a good default and it is still the default. But it is one
 * way to learn, and a learner who wants all of A1 before a word of A2, or
 * every sentence that starts "Ich möchte" in one run, or the short ones
 * before the long ones, had no way to say so — Listen could be told all of
 * that and the guided session could not.
 *
 * These settings are per course, like Listen's: the order somebody wants for
 * German is not the order they want for Polish. Storage is a courtesy; when
 * it is blocked the documented default applies and nothing breaks.
 */
import { cefrRung, cefrStep, CEFR_STEPS, type CefrStep } from "@/lib/cefr";
import { getLearningDirection, type LearningDirection } from "@/lib/direction";
import { sentencePattern } from "@/lib/sentencePattern";

export type SittingOrder = "course" | "level" | "common" | "similar" | "conversation" | "shortest" | "longest";
/**
 * Written as a list so a value can be checked against it in one place. An
 * order added to the picker and not to this list would be chosen, written,
 * and read back as the default on the next sitting — silently.
 *
 * "conversation" sorts like the course's pick; what makes it different is
 * who follows the lead — the reply to it, from the packs' dialogues (see
 * exchanges.ts), the way "similar" is followed by its pattern-mates.
 */
export const SITTING_ORDERS: SittingOrder[] = ["course", "level", "common", "similar", "conversation", "shortest", "longest"];
export const DEFAULT_SITTING_ORDER: SittingOrder = "course";

/**
 * What each order is called, for anywhere that has to name one.
 *
 * Here rather than only in the picker, because the picker is no longer the
 * only place that says it: the lesson names the order that built it, and two
 * lists of the same seven names would drift the first time one was reworded.
 * The picker's own list is checked against this one.
 */
export const SITTING_ORDER_LABELS: Record<SittingOrder, string> = {
  course: "The course's pick",
  level: "Easiest first (A1 → C1)",
  common: "Most common first",
  similar: "Similar sentences together",
  conversation: "Conversation order",
  shortest: "Shortest first",
  longest: "Longest first",
};

const ORDER_KEY = "gl-sitting-order-v1";
const LEVEL_FILTER_KEY = "gl-sitting-level-filter-v1";

function courseSettingKey(key: string, direction: LearningDirection): string {
  return `${key}:${direction}`;
}

export function getSittingOrder(direction: LearningDirection = getLearningDirection()): SittingOrder {
  try {
    const value = window.localStorage.getItem(courseSettingKey(ORDER_KEY, direction));
    if (SITTING_ORDERS.includes(value as SittingOrder)) return value as SittingOrder;
  } catch { /* storage blocked: the documented default */ }
  return DEFAULT_SITTING_ORDER;
}

export function setSittingOrder(
  order: SittingOrder,
  direction: LearningDirection = getLearningDirection()
): SittingOrder {
  const next = SITTING_ORDERS.includes(order) ? order : DEFAULT_SITTING_ORDER;
  try {
    window.localStorage.setItem(courseSettingKey(ORDER_KEY, direction), next);
  } catch { /* keep the session usable */ }
  return next;
}

/**
 * Which levels a sitting may draw fresh material from. The empty set means
 * every level — a filter nobody has touched must not empty the sitting, and
 * unticking the last level is the same as not filtering. Reviews are never
 * filtered: what you have started, you finish.
 */
export function getSittingLevelFilters(direction: LearningDirection = getLearningDirection()): Set<CefrStep> {
  try {
    const raw = window.localStorage.getItem(courseSettingKey(LEVEL_FILTER_KEY, direction));
    if (!raw) return new Set();
    const wanted = new Set(raw.split(",").map((entry) => entry.trim()).filter(Boolean));
    return new Set(CEFR_STEPS.filter((step) => wanted.has(step)));
  } catch { /* storage blocked: every level */ }
  return new Set();
}

export function setSittingLevelFilters(
  levels: Iterable<CefrStep>,
  direction: LearningDirection = getLearningDirection()
): Set<CefrStep> {
  const wanted = new Set(levels);
  const next = new Set(CEFR_STEPS.filter((step) => wanted.has(step)));
  try {
    window.localStorage.setItem(courseSettingKey(LEVEL_FILTER_KEY, direction), [...next].join(","));
  } catch { /* keep the session usable */ }
  return next;
}

export function passesSittingLevel(level: string | undefined, filter: Set<CefrStep>): boolean {
  if (filter.size === 0) return true;
  return filter.has(cefrStep(level));
}

/**
 * What the sitting knows about a fresh card when it decides the order. Not
 * exported: the sitting's own candidate rows carry these fields and the
 * comparator takes them structurally.
 */
type SittingCandidate = {
  /** The course's own pick: lower is sooner. */
  score: number;
  /** Curriculum position, the tie-break everything else falls back to. */
  index: number;
  /** The pack's CEFR label, e.g. "A2" or "A2-B1". */
  level?: string;
  /** The German text. */
  de: string;
  /** How often the course's own sentences say this; higher is commoner. */
  commonality: number;
};

/**
 * The order a sitting sorts its fresh candidates in. Every order ends on the
 * course's pick and then the curriculum position, so ties are settled the way
 * the default would settle them, and "similar" IS the default here: the lead
 * is still the best card, and what follows it is decided by similarMates.
 */
export function sittingComparator(order: SittingOrder): (a: SittingCandidate, b: SittingCandidate) => number {
  const course = (a: SittingCandidate, b: SittingCandidate) => a.score - b.score || a.index - b.index;
  switch (order) {
    case "level":
      return (a, b) => cefrRung(a.level) - cefrRung(b.level) || course(a, b);
    case "common":
      return (a, b) => b.commonality - a.commonality || course(a, b);
    case "shortest":
      return (a, b) => a.de.length - b.de.length || course(a, b);
    case "longest":
      return (a, b) => b.de.length - a.de.length || course(a, b);
    default:
      return course;
  }
}

/**
 * The cards that open the same way as the lead, in the sitting's order. A
 * lead that is a single word, or whose opening nobody else shares, has no
 * mates and the sitting is the course's pick — the next sitting leads with
 * the next card, so a run of one-offs does not stall.
 */
export function similarMates<T extends SittingCandidate>(lead: T, candidates: T[]): T[] {
  const pattern = sentencePattern(lead.de);
  if (!pattern || !pattern.includes(" ")) return [];
  return candidates.filter((candidate) => candidate !== lead && sentencePattern(candidate.de) === pattern);
}
