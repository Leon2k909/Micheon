import {
  gradeEntryForId,
  loadGradeStore,
  progressEntryForId,
  saveGradeStore,
  setCanonicalGradeRecord,
  statusForId,
  type GradeStore,
} from "@/lib/activity";
import {
  isDueForReview,
  isSnoozed,
  overdueBy,
  recordReinforcement,
  recordStruggle,
} from "@/lib/memoryStrength";
import { getLessonContent } from "@/lib/lessonContent";
import { primaryAnswer } from "@/lib/germanTextMatch";
import { buildCatalog } from "@/session";
import { buildWordCatalog, rankWordCatalog } from "@/lib/wordSession";
import { withoutMutedPacks } from "@/lib/mutedPacks";
import { getAuthUser, type UserProfile } from "@/lib/profileStorage";

/**
 * Listen mode: passive exposure, deliberately NOT a lesson.
 *
 * Both languages are on screen and spoken together so the learner can be
 * doing something else entirely. That changes what a button press means:
 * recognising a sentence you HEAR, with its translation in front of you, is
 * a far weaker signal than producing it from memory in a guided session.
 * So the grades here are damped on purpose:
 *
 *  - "Know it" on a NEW item stamps listen counters only. It must not set a
 *    mastery grade, because a new item marked known would stop being
 *    introduced by Continue Learning — and the learner still needs to meet
 *    its spelling there. The tracker shows the exposure; the queue does not
 *    move.
 *  - "Know it" on a KNOWN item records a reinforcement — the same
 *    "practised again today, review date untouched" stamp optional practice
 *    uses. No rung climbed, no due date pushed.
 *  - "Difficult" on a NEW item marks a real struggle. That is not progress,
 *    it is a flag: guided sessions teach struggle-first, which is exactly
 *    what "I heard this and didn't get it" should cause.
 *  - "Difficult" on a KNOWN item keeps the ladder (one distracted listen
 *    must not undo months of reviews) but adds difficulty debt, the same
 *    signal a wrong answer leaves, so practice resurfaces it sooner.
 */

const REPEATS_KEY = "gl-listen-german-repeats";
export const DEFAULT_GERMAN_REPEATS = 2;

export function getListenGermanRepeats(): number {
  try {
    const raw = Number(window.localStorage.getItem(REPEATS_KEY));
    if (Number.isFinite(raw) && raw >= 1 && raw <= 3) return Math.round(raw);
  } catch { /* storage blocked — default below */ }
  return DEFAULT_GERMAN_REPEATS;
}

export function setListenGermanRepeats(count: number): void {
  const clamped = Math.max(1, Math.min(3, Math.round(count)));
  try { window.localStorage.setItem(REPEATS_KEY, String(clamped)); } catch { /* fine */ }
}

export type ListenItem = {
  id: string;
  aliases: string[];
  de: string;
  en: string;
  kind: "sentence" | "word";
};

/**
 * The full listening queue, ordered like a session would prioritise it:
 * due reviews first (most overdue leading), then struggles, then new
 * material in course order, then everything known — least recently
 * listened-to first, so long passive sessions rotate rather than loop the
 * same openers. Snoozed items stay out, exactly as they do in lessons.
 */
export function buildListenQueue(
  apiParts: Record<string, any>,
  grades: GradeStore,
  now = Date.now()
): ListenItem[] {
  const parts = withoutMutedPacks(apiParts);
  const content = getLessonContent();

  // primaryAnswer on both sides: answer keys list alternatives behind " / "
  // for the matcher's benefit, but a listening card shows (and the voice
  // speaks) one clean form, not the whole key.
  const sentences: ListenItem[] = content === "words" ? [] : buildCatalog(parts)
    .map((item) => ({
      id: item.id,
      aliases: item.aliases ?? [],
      de: primaryAnswer(item.de),
      en: primaryAnswer(item.en),
      kind: "sentence" as const,
    }));

  const words: ListenItem[] = content === "sentences" ? [] : rankWordCatalog(buildWordCatalog(parts), null)
    .map((word) => ({
      id: word.id,
      aliases: [],
      de: primaryAnswer(word.de),
      en: primaryAnswer(word.en),
      kind: "word" as const,
    }));

  // "Both": words woven in at a light cadence (1 word per 4 sentences)
  // rather than concatenated, so a mixed queue actually mixes.
  let combined: ListenItem[];
  if (sentences.length && words.length) {
    combined = [];
    let w = 0;
    sentences.forEach((sentence, index) => {
      combined.push(sentence);
      if ((index + 1) % 4 === 0 && w < words.length) combined.push(words[w++]);
    });
    combined.push(...words.slice(w));
  } else {
    combined = sentences.length ? sentences : words;
  }

  const recordFor = (item: ListenItem) =>
    progressEntryForId(grades, item.id, item.aliases)?.record;

  const listenStamp = (item: ListenItem) => {
    const record = recordFor(item);
    const stamps = [record?.listenedAt, record?.reinforcedAt, record?.updatedAt]
      .map((value) => (value ? Date.parse(value) : 0))
      .filter((value) => Number.isFinite(value));
    return stamps.length ? Math.max(...stamps) : 0;
  };

  const bucketOf = (item: ListenItem): number => {
    const record = recordFor(item);
    if (isSnoozed(record, now)) return -1;
    const status = statusForId(grades, item.id, item.aliases);
    if (status === "known" && isDueForReview(record, now)) return 0;
    if (status === "struggle") return 1;
    if (status === "new") return 2;
    return 3;
  };

  return combined
    .map((item, index) => ({ item, index, bucket: bucketOf(item) }))
    .filter((entry) => entry.bucket >= 0)
    .sort((a, b) =>
      a.bucket - b.bucket
      || (a.bucket === 0
        ? overdueBy(recordFor(b.item), now) - overdueBy(recordFor(a.item), now)
        : a.bucket === 3
          ? listenStamp(a.item) - listenStamp(b.item)
          : a.index - b.index)
    )
    .map((entry) => entry.item);
}

export type ListenGrade = "know" | "difficult";

/**
 * Record a listen-mode grade. See the module comment for why every branch
 * is deliberately weaker than its guided-session counterpart.
 */
export function recordListenGrade(
  item: Pick<ListenItem, "id" | "aliases">,
  grade: ListenGrade,
  profile: UserProfile | null = getAuthUser(),
  now = Date.now()
): void {
  const store = loadGradeStore(profile);
  const status = statusForId(store, item.id, item.aliases);
  const prior = progressEntryForId(store, item.id, item.aliases)?.record;
  const listenFields = {
    listens: (Number(prior?.listens) || 0) + 1,
    listenedAt: new Date(now).toISOString(),
  };

  if (grade === "know") {
    if (status === "known" && prior) {
      setCanonicalGradeRecord(store, item.id, item.aliases, {
        ...recordReinforcement(prior, now),
        ...listenFields,
      });
    } else {
      // New or struggling: exposure counts as exposure, nothing more. No
      // lastGrade means statusForId still answers "new", so Continue
      // Learning introduces the item exactly as it would have.
      setCanonicalGradeRecord(store, item.id, item.aliases, { ...prior, ...listenFields });
    }
  } else {
    if (status === "known" && prior) {
      setCanonicalGradeRecord(store, item.id, item.aliases, {
        ...prior,
        ...listenFields,
        // Same scale a real mistake leaves (adaptivePractice caps at 8);
        // one distracted listen is a nudge, not a ladder reset.
        difficultyDebt: Math.min(8, (Number(prior.difficultyDebt) || 0) + 1),
        lastMistakeAt: new Date(now).toISOString(),
      });
    } else {
      setCanonicalGradeRecord(store, item.id, item.aliases, {
        ...recordStruggle(now, prior),
        ...listenFields,
      });
    }
  }

  saveGradeStore(store, profile);
}

/** The stored listen-exposure count for a tracker row, if any. */
export function listenCountForId(store: GradeStore, id: string, aliases: string[] = []): number {
  const viaGrade = gradeEntryForId(store, id, aliases)?.record;
  const record = viaGrade ?? progressEntryForId(store, id, aliases)?.record;
  return Number(record?.listens) || 0;
}
