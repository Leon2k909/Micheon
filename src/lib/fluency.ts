import { loadScopedJson, getAuthUser, type UserProfile } from "@/lib/profileStorage";
import { getMasteredCount } from "@/lib/mastery";
import { recallWeight, type GradeRecord } from "@/lib/memoryStrength";

// The per-item review/completion state (COMPLETED_KEY in guided_learning_session):
// id -> { lastGrade, ... }. An item graded "know" is something the learner has
// actually recalled successfully. May also be stored as a plain array of ids.
const REVIEW_KEY = "session-completed";

export type FluencyStage = { label: string; min: number; blurb: string };

/**
 * Honest ability milestones, keyed to the number of DISTINCT items a learner
 * has actually learned in the app (review "know" records + words mastered in
 * games + self-tracked external words) — not XP. The thresholds are calibrated
 * so the named ability roughly matches what that much active vocabulary unlocks
 * in real conversation. This is an estimate, and it never claims "100% fluent"
 * from a practice counter.
 */
export const FLUENCY_STAGES: FluencyStage[] = [
  { label: "Starting out", min: 0, blurb: "Building your very first words and phrases." },
  { label: "Basics", min: 150, blurb: "Greetings, essentials, and simple needs." },
  { label: "Everyday survival", min: 500, blurb: "Getting by in shops, directions, and small talk." },
  { label: "Conversational", min: 1200, blurb: "Following and joining everyday conversations." },
  { label: "Confident", min: 2500, blurb: "Understanding most speech and giving opinions freely." },
  // 5,000 used to be the top of the ladder. The bar moved after a look
  // at what native speakers actually hold — an educated native's ACTIVE
  // vocabulary runs to 12,000-16,000 words — so 5,000 became a stage on the
  // way and Fluent now demands the five-figure inventory real fluency takes.
  { label: "Near fluent", min: 5000, blurb: "Comfortable in almost any conversation, rarely searching for words." },
  { label: "Fluent", min: 10000, blurb: "Keeping up with real natives at full speed." },
];

export const FLUENT_TARGET = FLUENCY_STAGES[FLUENCY_STAGES.length - 1].min;

/**
 * The 10,000-item Fluent target, split into what it is actually made of.
 *
 * One raw "7,778 to go" reads like 7,778 hard new words and made the card
 * look far too hard. It never was: about 4,000
 * ACTIVE words is what vocabulary research puts behind comfortable
 * near-native conversation (the 12-16k native figure counts every word a
 * native holds, most of it passive), and the rest of the distance is
 * phrases — whole sentences a learner banks several at a sitting. Showing
 * the two lanes separately is both kinder and more truthful than one
 * mountain of a number.
 */
export const FLUENT_WORD_TARGET = 4000;
export const FLUENT_PHRASE_TARGET = FLUENT_TARGET - FLUENT_WORD_TARGET;

/**
 * The known count, split into its two lanes. Word progress lives under the
 * `vw-` id namespace (WORD_ID_PREFIX in wordSession.ts — hardcoded here to
 * keep this module free of the session graph); everything else in the store
 * is a sentence or phrase. Hand-mastered game words and self-tracked
 * external words are words by definition. Same recall decay as
 * countKnownVocab, so the lanes always sum to the headline number.
 */
export function countKnownSplit(
  user: UserProfile | null = getAuthUser(),
  externalWords = 0
): { words: number; phrases: number } {
  let words = 0;
  let phrases = 0;
  try {
    const raw = loadScopedJson<any>(REVIEW_KEY, {}, user);
    if (Array.isArray(raw)) {
      phrases = raw.length; // legacy array form predates word ids entirely
    } else if (raw && typeof raw === "object") {
      for (const [id, rec] of Object.entries(raw)) {
        const weight = recallWeight(rec as GradeRecord);
        if (String(id).startsWith("vw-")) words += weight;
        else phrases += weight;
      }
    }
  } catch {
    /* ignore */
  }
  return {
    words: Math.round(words) + getMasteredCount() + Math.max(0, externalWords || 0),
    phrases: Math.round(phrases),
  };
}

/** Distinct things the learner actually knows, across lessons, games and external tracking. */
/**
 * How much German you actually know: distinct items you can currently
 * produce, plus words you mastered by hand and any you told us you learned
 * elsewhere. An item that you got wrong last time does not count until you
 * get it right again.
 *
 * This is THE vocabulary number. Every screen that answers "how far along am
 * I" — the dashboard outlook, the profile fluency meter, the profile word
 * stat, the games mastery ring, the word milestones — reads it, so they all
 * agree. Do not substitute `totalReviews`: that is a lifetime tally of
 * practice events, it counts the same word once per sitting, and it will
 * happily climb past the number of words that exist.
 */
export function countKnownVocab(user: UserProfile | null = getAuthUser(), externalWords = 0): number {
  let known = 0;
  try {
    const raw = loadScopedJson<any>(REVIEW_KEY, {}, user);
    if (Array.isArray(raw)) {
      known = raw.length; // legacy: a plain list of completed ids (all "known")
    } else if (raw && typeof raw === "object") {
      // Each item is worth what you can still be assumed to recall, not a
      // flat one for ever. Memory fades, so the total can fall as well as
      // rise — and reviewing brings it straight back up.
      for (const rec of Object.values(raw)) known += recallWeight(rec as GradeRecord);
    }
  } catch {
    /* ignore */
  }
  // Hand-mastered words and anything learned outside the app carry no review
  // schedule, so there is nothing to fade them against; they stay whole
  // rather than being decayed on a guess.
  return Math.round(known) + getMasteredCount() + Math.max(0, externalWords || 0);
}

/**
 * How much of what you know is currently slipping.
 *
 * A number that falls without explanation reads as a bug or a punishment.
 * This is what the screen shows instead: how many items have started to fade,
 * so the drop comes with the thing that fixes it.
 */
export function countFadingVocab(user: UserProfile | null = getAuthUser()): number {
  try {
    const raw = loadScopedJson<any>(REVIEW_KEY, {}, user);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return 0;
    let fading = 0;
    for (const rec of Object.values(raw)) {
      const weight = recallWeight(rec as GradeRecord);
      if (weight > 0 && weight < 0.9) fading += 1;
    }
    return fading;
  } catch {
    return 0;
  }
}

export function getFluency(vocab: number) {
  const v = Math.max(0, Math.floor(vocab || 0));
  let i = 0;
  for (let k = 0; k < FLUENCY_STAGES.length; k += 1) if (v >= FLUENCY_STAGES[k].min) i = k;
  const cur = FLUENCY_STAGES[i];
  const next = FLUENCY_STAGES[i + 1] ?? null;
  const toNext = next ? Math.max(0, next.min - v) : 0;
  const span = next ? next.min - cur.min : 1;
  const pctToNext = next ? Math.max(0, Math.min(100, Math.round(((v - cur.min) / span) * 100))) : 100;
  const overallPct = Math.min(100, Math.round((v / FLUENT_TARGET) * 100));
  const toFluent = Math.max(0, FLUENT_TARGET - v); // distance to the final "Fluent" milestone
  return { vocab: v, cur, next, toNext, toFluent, pctToNext, overallPct, index: i, total: FLUENCY_STAGES.length };
}
