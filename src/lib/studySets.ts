import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Study sets you make yourself.
 *
 * The rest of the app teaches a fixed course: our packs, our order, our
 * glosses. This is the other half — your own cards, in your own order, for
 * the thing you personally keep forgetting. Quizlet's model, because it is
 * the one people already know: a set is a title and a list of two-sided
 * cards, and every study mode is a different way of walking that list.
 *
 * Cards can be typed by hand, pasted in bulk, or pulled from the 23,000
 * items the app already has — that last one is the point. Nobody wants to
 * retype "die Haftpflichtversicherung" when we already know it, its gender,
 * its gloss and how to say it.
 *
 * Everything is scoped to the profile through the same storage the rest of
 * the app uses, so Leon's sets and Michelle's sets never mix.
 */

export const STUDY_SETS_KEY = "study-sets:v1";
export const STUDY_PROGRESS_PREFIX = "study-progress:v1";

export type StudyCardSource = "manual" | "catalogue" | "paste";

export type StudyCard = {
  id: string;
  /** The prompt side. For a language set this is usually the German. */
  term: string;
  /** The answer side. */
  definition: string;
  /** Optional third line — a usage note, an example, a mnemonic. */
  hint?: string;
  /** Where it came from, so the editor can show what was imported. */
  source: StudyCardSource;
  /** Catalogue id when imported, so a card can be traced back. */
  catalogueId?: string;
  starred?: boolean;
};

export type StudySet = {
  id: string;
  title: string;
  description: string;
  cards: StudyCard[];
  /** ISO timestamps, stamped by the caller so this module stays pure. */
  createdAt: string;
  updatedAt: string;
  /** Which side is shown first in flashcards and asked first in learn. */
  promptSide: "term" | "definition";
  /** Speak the term aloud where the platform can. */
  speak: boolean;
  /** Which stages a Learn session walks through, in order. */
  stages: StudyStage[];
  /**
   * How the ladder is climbed, not just what is on it.
   *
   * Choosing the stages settled what a card is asked; these settle how hard
   * it is to get past them. Leon: "the stages should be more customisable" —
   * so the number of right answers a promotion costs, the size of a round,
   * and whether a mistake knocks a card back down are the set's to decide.
   */
  masteryTarget: number;
  roundSize: number;
  demoteOnWrong: boolean;
};

/**
 * The stages a Learn session can run.
 *
 * Quizlet hard-codes recognise-then-recall. Leon asked for "however they want
 * stages to work", so the set owns its own ladder and the editor can reorder
 * or drop any of them. The default is the order that actually works for
 * vocabulary: see it, choose it, then produce it from nothing.
 */
export type StudyStage = "flashcard" | "choice" | "typed" | "reverse";

export const STUDY_STAGE_LABELS: Record<StudyStage, string> = {
  flashcard: "See it",
  choice: "Multiple choice",
  typed: "Type the answer",
  reverse: "Reverse — produce the term",
};

export const STUDY_STAGE_BLURBS: Record<StudyStage, string> = {
  flashcard: "Shown both sides once, to meet the card before being asked.",
  choice: "Pick the right answer from four. The cheapest kind of recall.",
  typed: "Write the answer out. Nothing to recognise, so nothing to guess.",
  reverse: "Given the answer, produce the term. The hardest direction.",
};

export const DEFAULT_STAGES: StudyStage[] = ["flashcard", "choice", "typed"];
export const ALL_STAGES: StudyStage[] = ["flashcard", "choice", "typed", "reverse"];

/** How many correct answers in a row promote a card, when a set says nothing. */
export const MASTERY_TARGET = 2;

/** How many cards a Learn round asks about, when a set says nothing. */
export const DEFAULT_ROUND_SIZE = 10;

/** The ends of each dial, so the editor and the loader agree on them. */
export const MASTERY_TARGET_RANGE = { min: 1, max: 5 } as const;
export const ROUND_SIZE_CHOICES = [5, 7, 10, 15, 20, 30, 50] as const;

const clampMastery = (value: unknown): number => {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return MASTERY_TARGET;
  return Math.min(MASTERY_TARGET_RANGE.max, Math.max(MASTERY_TARGET_RANGE.min, number));
};

const clampRoundSize = (value: unknown): number => {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return DEFAULT_ROUND_SIZE;
  return Math.min(100, Math.max(3, number));
};

export type StudyCardProgress = {
  /** Consecutive correct answers at the current stage. */
  streak: number;
  correct: number;
  wrong: number;
  /** Index into the set's stage list. */
  stage: number;
  mastered: boolean;
};

export type StudySetProgress = Record<string, StudyCardProgress>;

// ── Storage ─────────────────────────────────────────────────────────────────

export function loadStudySets(profile: UserProfile | null = getAuthUser()): StudySet[] {
  const raw = loadScopedJson<StudySet[]>(STUDY_SETS_KEY, [], profile);
  if (!Array.isArray(raw)) return [];
  // Sets written before a field existed still have to open rather than crash,
  // so every optional is defaulted on read instead of assumed.
  return raw.map((set) => ({
    ...set,
    cards: Array.isArray(set.cards) ? set.cards : [],
    promptSide: set.promptSide === "definition" ? "definition" : "term",
    speak: set.speak !== false,
    stages: Array.isArray(set.stages) && set.stages.length > 0 ? set.stages : DEFAULT_STAGES,
    description: set.description ?? "",
    masteryTarget: clampMastery(set.masteryTarget),
    roundSize: clampRoundSize(set.roundSize),
    demoteOnWrong: set.demoteOnWrong !== false,
  }));
}

export function saveStudySets(sets: StudySet[], profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(STUDY_SETS_KEY, sets, profile);
}

export function loadStudyProgress(setId: string, profile: UserProfile | null = getAuthUser()): StudySetProgress {
  const raw = loadScopedJson<StudySetProgress>(`${STUDY_PROGRESS_PREFIX}:${setId}`, {}, profile);
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
}

export function saveStudyProgress(
  setId: string,
  progress: StudySetProgress,
  profile: UserProfile | null = getAuthUser()
) {
  saveScopedJson(`${STUDY_PROGRESS_PREFIX}:${setId}`, progress, profile);
}

export function resetStudyProgress(setId: string, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(`${STUDY_PROGRESS_PREFIX}:${setId}`, {}, profile);
}

// ── Making things ───────────────────────────────────────────────────────────

let counter = 0;
/** Ids only have to be unique within one profile's sets, not globally. */
export function studyId(prefix: string, now: number): string {
  counter += 1;
  return `${prefix}-${now.toString(36)}-${counter.toString(36)}`;
}

export function makeCard(
  term: string,
  definition: string,
  options: { hint?: string; source?: StudyCardSource; catalogueId?: string; now?: number } = {}
): StudyCard {
  return {
    id: studyId("card", options.now ?? 0),
    term: term.trim(),
    definition: definition.trim(),
    hint: options.hint?.trim() || undefined,
    source: options.source ?? "manual",
    catalogueId: options.catalogueId,
  };
}

export function makeSet(title: string, now: number): StudySet {
  const at = new Date(now).toISOString();
  return {
    id: studyId("set", now),
    title: title.trim() || "Untitled set",
    description: "",
    cards: [],
    createdAt: at,
    updatedAt: at,
    promptSide: "term",
    speak: true,
    stages: [...DEFAULT_STAGES],
    masteryTarget: MASTERY_TARGET,
    roundSize: DEFAULT_ROUND_SIZE,
    demoteOnWrong: true,
  };
}

/**
 * Parse pasted text into cards.
 *
 * Accepts what people actually paste: a tab between the two sides (which is
 * what you get copying two columns out of a spreadsheet), or a dash, or an
 * equals, or a semicolon. Tab first, because a dash is also punctuation that
 * appears INSIDE German glosses — splitting "der Lkw - Lastkraftwagen - lorry"
 * on the first dash is right, on every dash is not.
 */
export function parsePastedCards(text: string, now = 0): StudyCard[] {
  const cards: StudyCard[] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let term = "";
    let definition = "";
    if (trimmed.includes("\t")) {
      const [first, ...rest] = trimmed.split("\t");
      term = first;
      definition = rest.join(" ").trim();
    } else {
      const match = /^(.*?)\s+(?:[-–—=]|::?)\s+(.*)$/.exec(trimmed);
      if (match) {
        term = match[1];
        definition = match[2];
      } else {
        // A line with no separator is still worth keeping — it becomes a card
        // with an empty back that the editor will flag, rather than silently
        // vanishing from a fifty-line paste.
        term = trimmed;
        definition = "";
      }
    }
    if (!term.trim()) continue;
    cards.push(makeCard(term, definition, { source: "paste", now }));
  }
  return cards;
}

/** A set is only studiable when enough cards have both sides filled in. */
export function studiableCards(set: StudySet): StudyCard[] {
  return set.cards.filter((card) => card.term.trim() && card.definition.trim());
}

export function setIsStudiable(set: StudySet): boolean {
  return studiableCards(set).length >= 1;
}

/** Cards the editor should complain about, so nothing fails silently later. */
export function incompleteCards(set: StudySet): StudyCard[] {
  return set.cards.filter((card) => !card.term.trim() || !card.definition.trim());
}

export function duplicateTerms(set: StudySet): string[] {
  const seen = new Map<string, number>();
  for (const card of set.cards) {
    const key = card.term.trim().toLocaleLowerCase();
    if (!key) continue;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, count]) => count > 1).map(([term]) => term);
}

// ── Progress maths ──────────────────────────────────────────────────────────

export function emptyProgress(): StudyCardProgress {
  return { streak: 0, correct: 0, wrong: 0, stage: 0, mastered: false };
}

export type StudySummary = {
  total: number;
  mastered: number;
  learning: number;
  untouched: number;
  percent: number;
};

export function summariseProgress(set: StudySet, progress: StudySetProgress): StudySummary {
  const cards = studiableCards(set);
  let mastered = 0;
  let learning = 0;
  for (const card of cards) {
    const entry = progress[card.id];
    if (!entry || (entry.correct === 0 && entry.wrong === 0)) continue;
    if (entry.mastered) mastered += 1;
    else learning += 1;
  }
  const total = cards.length;
  return {
    total,
    mastered,
    learning,
    untouched: Math.max(0, total - mastered - learning),
    percent: total === 0 ? 0 : Math.round((mastered / total) * 100),
  };
}

/**
 * Fold one answer into a card's progress.
 *
 * A right answer advances the streak, and enough in a row promotes the card
 * to the next stage — or retires it if that was the last. A wrong answer
 * resets the streak and drops the card back a stage, because getting it wrong
 * at typing means recognition was not as solid as it looked.
 *
 * How many is "enough", and whether a mistake really costs a stage, are the
 * set's to choose. The defaults are what a set written before those dials
 * existed silently used, so nobody's progress shifts under them.
 */
export function applyAnswer(
  current: StudyCardProgress | undefined,
  correct: boolean,
  stageCount: number,
  rules: { masteryTarget?: number; demoteOnWrong?: boolean } = {}
): StudyCardProgress {
  const target = clampMastery(rules.masteryTarget ?? MASTERY_TARGET);
  const demote = rules.demoteOnWrong !== false;
  const entry = current ?? emptyProgress();
  if (!correct) {
    return {
      ...entry,
      streak: 0,
      wrong: entry.wrong + 1,
      stage: demote ? Math.max(0, entry.stage - 1) : entry.stage,
      mastered: false,
    };
  }
  const streak = entry.streak + 1;
  if (streak < target) {
    return { ...entry, streak, correct: entry.correct + 1, mastered: false };
  }
  const nextStage = entry.stage + 1;
  const done = nextStage >= stageCount;
  return {
    streak: 0,
    correct: entry.correct + 1,
    wrong: entry.wrong,
    stage: done ? entry.stage : nextStage,
    mastered: done,
  };
}

/**
 * Which cards a Learn round should ask about, and at which stage.
 *
 * Unmastered first, least-practised first, so a round never opens with the
 * card you already know. Capped so a 300-card set still gives you a round you
 * can finish rather than a wall.
 */
export function buildLearnRound(
  set: StudySet,
  progress: StudySetProgress,
  size = clampRoundSize(set.roundSize)
): { card: StudyCard; stage: StudyStage }[] {
  const stages = set.stages.length > 0 ? set.stages : DEFAULT_STAGES;
  const pending = studiableCards(set)
    .map((card) => ({ card, entry: progress[card.id] ?? emptyProgress() }))
    .filter((item) => !item.entry.mastered)
    .sort((a, b) => {
      const seenA = a.entry.correct + a.entry.wrong;
      const seenB = b.entry.correct + b.entry.wrong;
      if (seenA !== seenB) return seenA - seenB;
      return a.entry.stage - b.entry.stage;
    });
  return pending.slice(0, size).map((item) => ({
    card: item.card,
    stage: stages[Math.min(item.entry.stage, stages.length - 1)],
  }));
}

/**
 * Is a typed answer right?
 *
 * Deliberately forgiving about the things that are not the point: case,
 * surrounding space, a trailing full stop, and the article on a German noun
 * when the learner typed the noun correctly. Not forgiving about spelling,
 * which IS the point. A set can carry several accepted answers separated by
 * a slash, matching how our own glosses are written.
 */
export function checkTypedAnswer(expected: string, given: string): boolean {
  const normalise = (value: string) =>
    value
      .normalize("NFC")
      .trim()
      .toLocaleLowerCase("de-DE")
      .replace(/[.!?]+$/, "")
      .replace(/\s+/g, " ");

  const ARTICLE = /^(der|die|das|the|a|an)\s+/;
  const articleOf = (value: string) => ARTICLE.exec(value)?.[1] ?? null;
  const stripArticle = (value: string) => value.replace(ARTICLE, "");

  const answer = normalise(given);
  if (!answer) return false;
  const accepted = expected.split(/\s*\/\s*/).map(normalise).filter(Boolean);

  return accepted.some((option) => {
    if (option === answer) return true;
    if (stripArticle(option) !== stripArticle(answer)) return false;
    // The nouns match, so only the article is in question. Leaving it off is
    // fine — the card is testing the word. Putting the WRONG one on is not:
    // typing "die Apfel" is a claim about gender, and a claim that gets
    // waved through is worse than no question at all.
    const expectedArticle = articleOf(option);
    const givenArticle = articleOf(answer);
    if (expectedArticle === null || givenArticle === null) return true;
    return expectedArticle === givenArticle;
  });
}

// ── Sharing ─────────────────────────────────────────────────────────────────

/**
 * A set as plain text, so it can be sent to somebody.
 *
 * Deliberately not JSON. Leon and Michelle share things by pasting them into
 * a chat, and a wall of braces is not something you paste to a person. This
 * is the same tab-separated shape the paste importer already reads, with the
 * title and settings as comment lines — so a set exported here can be pasted
 * straight back into the paste box even by someone who does not know it came
 * from an export.
 */
export function exportSetToText(set: StudySet): string {
  const lines = [`# ${set.title}`];
  if (set.description) lines.push(`# ${set.description}`);
  lines.push(`# stages: ${set.stages.join(", ")}`);
  lines.push("");
  for (const card of set.cards) {
    if (!card.term.trim()) continue;
    lines.push(card.hint
      ? `${card.term}\t${card.definition}\t${card.hint}`
      : `${card.term}\t${card.definition}`);
  }
  return lines.join("\n");
}

export type ImportedSet = { title: string | null; description: string | null; cards: StudyCard[]; stages: StudyStage[] | null };

/**
 * Read back what exportSetToText wrote — and anything close enough.
 *
 * The comment lines are optional. Somebody pasting a plain two-column list
 * with no header gets a set of cards and no title, which is the right answer
 * rather than an error.
 */
export function importSetFromText(text: string, now = 0): ImportedSet {
  const lines = text.split(/\r?\n/);
  let title: string | null = null;
  let description: string | null = null;
  let stages: StudyStage[] | null = null;
  const body: string[] = [];

  for (const line of lines) {
    const comment = /^#\s*(.*)$/.exec(line.trim());
    if (!comment) { body.push(line); continue; }
    const value = comment[1].trim();
    const stageLine = /^stages:\s*(.+)$/i.exec(value);
    if (stageLine) {
      const parsed = stageLine[1]
        .split(/\s*,\s*/)
        .map((entry) => entry.trim())
        .filter((entry): entry is StudyStage => (ALL_STAGES as string[]).includes(entry));
      if (parsed.length > 0) stages = parsed;
      continue;
    }
    if (title === null) title = value;
    else if (description === null) description = value;
  }

  // The third column is the hint, which parsePastedCards does not know about.
  const cards: StudyCard[] = [];
  for (const line of body) {
    const parts = line.split("\t");
    if (parts.length >= 3 && parts[0].trim()) {
      cards.push(makeCard(parts[0], parts[1], { hint: parts.slice(2).join(" "), source: "paste", now }));
      continue;
    }
    cards.push(...parsePastedCards(line, now));
  }

  return { title, description, cards, stages };
}
