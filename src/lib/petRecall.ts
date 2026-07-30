import {
  getAuthUser,
  loadScopedJson,
  saveScopedJson,
  type UserProfile,
} from "@/lib/profileStorage";

export const CODEX_PET_RECALL_KEY = "gl-codex-pet-recall-v1";
export const PET_RECALL_FOCUS_CHANCE = 0.75;
export const PET_RECALL_REINFORCEMENT_CHANCE = 0.35;

const MAX_TRACKED_ITEMS = 40;
const MAX_OTHER_QUESTIONS_BEFORE_FOCUS = 2;
const REINFORCEMENT_FORCE_AFTER_QUESTIONS = 6;
const REINFORCEMENT_GAPS = [3, 8] as const;

export type PetRecallQuestionIdentity = {
  aliases?: string[];
  itemId: string;
  recallSequence?: number;
};

export type PetRecallEntry = {
  aliases: string[];
  dueQuestion: number;
  firstMissQuestion: number;
  itemId: string;
  lastAskedQuestion: number;
  misses: number;
  phase: "learning" | "reinforcement";
  successes: number;
  updatedAt: number;
};

export type PetRecallState = {
  entries: PetRecallEntry[];
  questionCount: number;
};

export type PetRecallAnswerOutcome =
  | "focused"
  | "reinforcement"
  | "retired"
  | "unchanged";

export type PetRecallCandidate = {
  aliases?: string[];
  id: string;
};

export function createPetRecallState(): PetRecallState {
  return { entries: [], questionCount: 0 };
}

function nonNegativeInteger(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.trunc(number) : fallback;
}

function cleanAliases(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((alias): alias is string =>
    typeof alias === "string" && alias.trim().length > 0
  ))].slice(0, 24);
}

function normalizePetRecallState(value: unknown): PetRecallState {
  if (!value || typeof value !== "object") return createPetRecallState();
  const raw = value as Partial<PetRecallState>;
  const questionCount = nonNegativeInteger(raw.questionCount);
  const entries = Array.isArray(raw.entries)
    ? raw.entries.flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object") return [];
        const entry = candidate as Partial<PetRecallEntry>;
        if (typeof entry.itemId !== "string" || !entry.itemId.trim()) return [];
        if (entry.phase !== "learning" && entry.phase !== "reinforcement") return [];
        return [{
          aliases: cleanAliases(entry.aliases),
          dueQuestion: nonNegativeInteger(entry.dueQuestion),
          firstMissQuestion: nonNegativeInteger(entry.firstMissQuestion),
          itemId: entry.itemId,
          lastAskedQuestion: nonNegativeInteger(entry.lastAskedQuestion),
          misses: Math.max(1, nonNegativeInteger(entry.misses, 1)),
          phase: entry.phase,
          successes: nonNegativeInteger(entry.successes),
          updatedAt: nonNegativeInteger(entry.updatedAt),
        } satisfies PetRecallEntry];
      })
    : [];
  return { entries: entries.slice(0, MAX_TRACKED_ITEMS), questionCount };
}

function identityKeys(identity: { aliases?: string[]; id?: string; itemId?: string }) {
  return new Set([
    identity.id,
    identity.itemId,
    ...(identity.aliases ?? []),
  ].filter((value): value is string => typeof value === "string" && value.length > 0));
}

function identitiesOverlap(
  first: { aliases?: string[]; id?: string; itemId?: string },
  second: { aliases?: string[]; id?: string; itemId?: string }
) {
  const firstKeys = identityKeys(first);
  return [...identityKeys(second)].some((key) => firstKeys.has(key));
}

function mergedAliases(entry: PetRecallEntry | undefined, question: PetRecallQuestionIdentity) {
  return cleanAliases([
    ...(entry?.aliases ?? []),
    ...(question.aliases ?? []),
  ]).filter((alias) => alias !== question.itemId);
}

function limitEntries(entries: PetRecallEntry[]) {
  if (entries.length <= MAX_TRACKED_ITEMS) return entries;
  const learning = entries
    .filter((entry) => entry.phase === "learning")
    .sort((a, b) => a.firstMissQuestion - b.firstMissQuestion);
  const reinforcement = entries
    .filter((entry) => entry.phase === "reinforcement")
    .sort((a, b) => b.updatedAt - a.updatedAt);
  return [...learning, ...reinforcement].slice(0, MAX_TRACKED_ITEMS);
}

/**
 * Counts a scheduled pet question. Confirmation prompts do not call this:
 * they reveal the answer for the question that was already counted.
 */
export function advancePetRecallQuestion(
  rawState: PetRecallState,
  question: PetRecallQuestionIdentity
) {
  const state = normalizePetRecallState(rawState);
  const questionNumber = state.questionCount + 1;
  const entries = state.entries.map((entry) =>
    identitiesOverlap(entry, question)
      ? {
          ...entry,
          aliases: mergedAliases(entry, question),
          lastAskedQuestion: questionNumber,
        }
      : entry
  );
  return {
    questionNumber,
    state: { entries, questionCount: questionNumber } satisfies PetRecallState,
  };
}

/**
 * A miss enters the focused queue. A remembered focused item moves through two
 * later reinforcement checks before it leaves the pet's short-term queue.
 */
export function applyPetRecallAnswer(
  rawState: PetRecallState,
  question: PetRecallQuestionIdentity,
  answer: "yes" | "no",
  now = Date.now()
): { outcome: PetRecallAnswerOutcome; state: PetRecallState } {
  const state = normalizePetRecallState(rawState);
  const existingIndex = state.entries.findIndex((entry) => identitiesOverlap(entry, question));
  const existing = existingIndex >= 0 ? state.entries[existingIndex] : undefined;
  const answeredQuestion = Math.max(
    0,
    nonNegativeInteger(question.recallSequence, state.questionCount)
  );

  if (answer === "no") {
    const nextEntry: PetRecallEntry = {
      aliases: mergedAliases(existing, question),
      dueQuestion: answeredQuestion,
      firstMissQuestion: existing?.phase === "learning"
        ? existing.firstMissQuestion
        : answeredQuestion,
      itemId: existing?.itemId ?? question.itemId,
      lastAskedQuestion: Math.max(existing?.lastAskedQuestion ?? 0, answeredQuestion),
      misses: (existing?.misses ?? 0) + 1,
      phase: "learning",
      successes: 0,
      updatedAt: now,
    };
    const entries = existingIndex >= 0
      ? state.entries.map((entry, index) => index === existingIndex ? nextEntry : entry)
      : [...state.entries, nextEntry];
    return {
      outcome: "focused",
      state: { ...state, entries: limitEntries(entries) },
    };
  }

  if (!existing) return { outcome: "unchanged", state };

  const successes = existing.successes + 1;
  if (successes > REINFORCEMENT_GAPS.length) {
    return {
      outcome: "retired",
      state: {
        ...state,
        entries: state.entries.filter((_, index) => index !== existingIndex),
      },
    };
  }

  const nextEntry: PetRecallEntry = {
    ...existing,
    aliases: mergedAliases(existing, question),
    dueQuestion: state.questionCount + REINFORCEMENT_GAPS[successes - 1],
    lastAskedQuestion: Math.max(existing.lastAskedQuestion, answeredQuestion),
    phase: "reinforcement",
    successes,
    updatedAt: now,
  };
  return {
    outcome: "reinforcement",
    state: {
      ...state,
      entries: state.entries.map((entry, index) => index === existingIndex ? nextEntry : entry),
    },
  };
}

function matchingCandidate<T extends PetRecallCandidate>(
  entry: PetRecallEntry,
  candidates: readonly T[]
) {
  return candidates.find((candidate) => identitiesOverlap(entry, candidate));
}

function wasRecentlyAsked(candidate: PetRecallCandidate, recentlyAskedIds: ReadonlySet<string>) {
  return [...identityKeys(candidate)].some((key) => recentlyAskedIds.has(key));
}

function chance(random: () => number) {
  const value = Number(random());
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 1;
}

/**
 * Returns only a deliberately prioritised item. `undefined` means the normal
 * round-robin picker should ask something different this time.
 */
export function selectPrioritizedPetRecallItem<T extends PetRecallCandidate>(
  rawState: PetRecallState,
  candidates: readonly T[],
  recentlyAskedIds: ReadonlySet<string>,
  random: () => number = Math.random
): T | undefined {
  const state = normalizePetRecallState(rawState);
  const focused = state.entries
    .filter((entry) => entry.phase === "learning")
    .sort((a, b) => a.firstMissQuestion - b.firstMissQuestion)
    .map((entry) => ({ candidate: matchingCandidate(entry, candidates), entry }))
    .find((match) => match.candidate);

  if (focused?.candidate) {
    const hasDifferentCandidate = candidates.some((candidate) =>
      !identitiesOverlap(focused.entry, candidate) && !wasRecentlyAsked(candidate, recentlyAskedIds)
    );
    const otherQuestionsSinceFocus = Math.max(
      0,
      state.questionCount - focused.entry.lastAskedQuestion
    );
    const mustRepeat = otherQuestionsSinceFocus >= MAX_OTHER_QUESTIONS_BEFORE_FOCUS;
    if (!hasDifferentCandidate || mustRepeat || chance(random) < PET_RECALL_FOCUS_CHANCE) {
      return focused.candidate;
    }
    return undefined;
  }

  const due = state.entries
    .filter((entry) =>
      entry.phase === "reinforcement" && entry.dueQuestion <= state.questionCount
    )
    .sort((a, b) => a.dueQuestion - b.dueQuestion)
    .map((entry) => ({ candidate: matchingCandidate(entry, candidates), entry }))
    .find((match) => match.candidate);
  if (!due?.candidate) return undefined;

  const hasDifferentCandidate = candidates.some((candidate) =>
    !identitiesOverlap(due.entry, candidate) && !wasRecentlyAsked(candidate, recentlyAskedIds)
  );
  const overdueBy = state.questionCount - due.entry.dueQuestion;
  if (
    !hasDifferentCandidate
    || overdueBy >= REINFORCEMENT_FORCE_AFTER_QUESTIONS
    || chance(random) < PET_RECALL_REINFORCEMENT_CHANCE
  ) {
    return due.candidate;
  }
  return undefined;
}

export function loadPetRecallState(
  profile: UserProfile | null = getAuthUser()
): PetRecallState {
  return normalizePetRecallState(
    loadScopedJson<PetRecallState>(CODEX_PET_RECALL_KEY, createPetRecallState(), profile)
  );
}

export function notePetRecallQuestion(
  question: PetRecallQuestionIdentity,
  profile: UserProfile | null = getAuthUser()
) {
  const advanced = advancePetRecallQuestion(loadPetRecallState(profile), question);
  saveScopedJson(CODEX_PET_RECALL_KEY, advanced.state, profile);
  return advanced.questionNumber;
}

export function notePetRecallAnswer(
  question: PetRecallQuestionIdentity,
  answer: "yes" | "no",
  profile: UserProfile | null = getAuthUser()
): PetRecallAnswerOutcome {
  const result = applyPetRecallAnswer(loadPetRecallState(profile), question, answer);
  if (result.outcome !== "unchanged") {
    saveScopedJson(CODEX_PET_RECALL_KEY, result.state, profile);
  }
  return result.outcome;
}

export function getPrioritizedPetRecallItem<T extends PetRecallCandidate>(
  candidates: readonly T[],
  recentlyAskedIds: ReadonlySet<string>,
  profile: UserProfile | null = getAuthUser(),
  random: () => number = Math.random
) {
  return selectPrioritizedPetRecallItem(
    loadPetRecallState(profile),
    candidates,
    recentlyAskedIds,
    random
  );
}
