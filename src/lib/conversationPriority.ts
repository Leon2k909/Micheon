import { CURRICULUM_ORDER, packMeta } from "@/lib/curriculum";

/**
 * The packs that give a learner the fastest route into a normal conversation.
 *
 * This order is deliberately authored rather than inferred from individual
 * word counts. A sentence full of common words is not automatically a useful
 * thing to learn early ("I was flashed by a speed camera" is the motivating
 * example). These packs cover opening a conversation, repairing it, reacting,
 * making simple plans and keeping the exchange moving.
 */
export const CONVERSATION_ESSENTIAL_PACKS = [
  "cb-greetings",
  "cb-introductions",
  "part1",
  "cb-conversation-repair",
  "cb-reactions",
  "cb-shortreplies",
  "part158",
  "part160",
  "part161",
  "part169",
  "part171",
  "cb-smalltalk",
  "part57",
  "part150",
  "cb-plans",
  "part4",
  "part162",
  "part163",
  "part164",
] as const;

/** Common next-step topics once the learner can keep a conversation alive. */
export const EVERYDAY_CONVERSATION_PACKS = [
  "part165",
  "part166",
  "part167",
  "part168",
  "part170",
  "part244",
  "cb-conversation-bridges",
  "cb-opinions",
  "cb-numbers-time",
  "cb-letters-numbers",
  "part2",
  "cb-directions",
  "part6",
  "cb-travel",
  "cb-food",
  "part5",
  "cb-shopping",
  "cb-grocery",
  "cb-money",
  "part3",
  "cb-routine",
  "part7",
  "cb-family",
  "cb-weather",
  "cb-connectors",
  "cb-health",
  "cb-emergencies",
] as const;

export type ConversationUsefulness =
  | "essential"
  | "personal"
  | "everyday"
  | "situational"
  | "specialist"
  | "extra";

export type ConversationPriorityInfo = {
  key: ConversationUsefulness;
  label: string;
  hint: string;
  band: number;
  packRank: number;
};

export type ConversationPriorityInput = {
  partKey?: string;
  kind?: "vocab" | "phrase" | "dialogue";
  /** sentenceCommonality result: lower means more common vocabulary */
  commonality?: number;
  /** authored nudge inside a pack: lower means teach sooner */
  lessonPriority?: number;
};

const essentialRank = new Map<string, number>(
  CONVERSATION_ESSENTIAL_PACKS.map((key, index) => [key, index])
);
const everydayRank = new Map<string, number>(
  EVERYDAY_CONVERSATION_PACKS.map((key, index) => [key, index])
);
const curriculumRank = new Map<string, number>(
  CURRICULUM_ORDER.map((key, index) => [key, index])
);

function fallbackRank(partKey: string) {
  const known = curriculumRank.get(partKey);
  if (known != null) return known;
  const tatoeba = /^tatoeba-(a1|a2|b1|b2)-(\d+)$/i.exec(partKey);
  if (tatoeba) {
    const levelRank = ["a1", "a2", "b1", "b2"].indexOf(tatoeba[1].toLowerCase());
    return Math.max(0, levelRank) * 1_000 + Number(tatoeba[2] || 0);
  }
  return CURRICULUM_ORDER.length + 5_000;
}

/**
 * Honest, learner-facing usefulness category for an item.
 *
 * "Most common" in the tracker uses this category first, then the authored
 * pack order, then sentence-level frequency. It never promotes a niche corpus
 * sentence merely because its individual words happen to be frequent.
 */
export function conversationPriorityInfo(partKeyValue: string | undefined): ConversationPriorityInfo {
  const partKey = String(partKeyValue ?? "");

  if (partKey.startsWith("mine-")) {
    return {
      key: "personal",
      label: "Your material",
      hint: "Content you added yourself, kept near the front because it matters to you.",
      band: 1,
      packRank: fallbackRank(partKey),
    };
  }

  if (partKey.startsWith("tatoeba")) {
    return {
      key: "extra",
      label: "Extra practice",
      hint: "A broader real-sentence library for later practice, not an early conversation essential.",
      band: 5,
      packRank: fallbackRank(partKey),
    };
  }

  const essential = essentialRank.get(partKey);
  if (essential != null) {
    return {
      key: "essential",
      label: "Conversation essential",
      hint: "One of the first phrases to learn for starting, repairing or continuing a normal conversation.",
      band: 0,
      packRank: essential,
    };
  }

  const everyday = everydayRank.get(partKey);
  if (everyday != null) {
    return {
      key: "everyday",
      label: "Everyday conversation",
      hint: "Common next-step language for ordinary plans, people, places and daily needs.",
      band: 2,
      packRank: everyday,
    };
  }

  const meta = packMeta(partKey);
  if (meta.tier === 3) {
    return {
      key: "specialist",
      label: "Specialist / casual",
      hint: "Useful in a narrower, regional, technical or very casual context.",
      band: 4,
      packRank: fallbackRank(partKey),
    };
  }

  return {
    key: "situational",
    label: "Situational",
    hint: "Useful when this situation comes up, after the main conversation essentials.",
    band: 3,
    packRank: fallbackRank(partKey) + (meta.tier === 2 ? 1_000 : 0),
  };
}

/**
 * Stable ascending score used by lessons, the tracker and pet recall.
 *
 * Category and authored pack order are hard boundaries. Inside one pack,
 * phrases come before vocabulary examples, explicit lessonPriority wins next,
 * and word-frequency commonality is the final content-based tie-break.
 */
export function conversationPriorityScore(input: ConversationPriorityInput): number {
  const info = conversationPriorityInfo(input.partKey);
  const kindOffset = input.kind === "vocab" ? 600 : input.kind === "dialogue" ? 300 : 0;
  const authored = Number.isFinite(input.lessonPriority)
    ? Math.max(-2, Math.min(2, Number(input.lessonPriority))) * 1_500
    : 0;
  const commonality = Number.isFinite(input.commonality)
    ? Math.max(0, Math.min(5_000, Number(input.commonality)))
    : 5_000;

  return info.band * 10_000_000
    + info.packRank * 10_000
    + 3_000
    + kindOffset
    + authored
    + commonality;
}
