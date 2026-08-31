import spokenRanks from "@/data/spokenFrequency.json";

/**
 * How common a word is in SPOKEN German.
 *
 * The bundled bank in wordFrequency.ts is a written corpus — news and web
 * German — and it is the wrong authority for a course whose whole point is
 * holding a conversation. It ranks "entsprechend" 30th, which is not a 30th
 * priority for anybody, and it does not contain bitte, danke, heute or
 * vielleicht at all, so those arrived as "unranked" and sorted with the rare
 * words.
 *
 * These ranks come from film and television subtitles instead: dialogue, which
 * is the closest large corpus there is to how people actually talk. They agree
 * with the complaints above rather than needing to be argued with — bitte is
 * 88th, danke 98th, vielleicht 108th, while entsprechend falls to 8,185th and
 * die Maßnahme to 20,180th.
 *
 * Built by scripts/build-spoken-frequency.cjs, which records the source.
 */
const RANK_BY_WORD = new Map<string, number>(
  Object.entries(spokenRanks as Record<string, number>)
);

/** The list is lowercased and carries no articles, so the lookup must match. */
function normalise(word: string | undefined): string {
  return String(word ?? "")
    .toLocaleLowerCase("de-DE")
    .replace(/^(der|die|das)\s+/, "")
    .trim();
}

/**
 * How much of a pooled count a noun has to own before the rank speaks for it.
 *
 * The list is lowercased, so it cannot tell die Macht from "er macht", das Los
 * from "los!", or der Weg from "weg". Where the two collide the rank belongs
 * partly to a word that is not this one, and reading it whole put die Macht
 * 160th and das Los 93rd in German.
 *
 * This course's own text can referee, because it keeps nouns and non-nouns
 * apart: a capital away from a full stop is a noun and nothing else is. Where
 * it says the form is mostly NOT this noun, the rank is pushed back by how
 * little of it the noun owns — a correction, not a veto, because die Liebe and
 * der Krieg are common words whichever way the count falls.
 *
 * Capped, because a noun the course happens never to capitalise would otherwise
 * be pushed to the far end on no evidence at all. It affects 40 of the 6,314
 * ranked words; the other 99% are untouched.
 */
const COLLISION_FLOOR = 3;
const COLLISION_CAP = 10;

export type NounEvidence = { noun: number; other: number };

export function spokenFrequencyRank(
  word: string | undefined,
  evidence: NounEvidence | null = null
): number {
  const rank = RANK_BY_WORD.get(normalise(word));
  if (rank === undefined) return Infinity;
  if (!evidence) return rank;
  const { noun, other } = evidence;
  // Too little either way to referee anything.
  if (other < COLLISION_FLOOR || other <= noun * 2) return rank;
  const share = Math.min(COLLISION_CAP, (noun + other) / Math.max(1, noun));
  return rank * share;
}

/** Whether the spoken list has anything to say about this word at all. */
export function hasSpokenRank(word: string | undefined): boolean {
  return RANK_BY_WORD.has(normalise(word));
}

export const SPOKEN_RANK_COUNT = RANK_BY_WORD.size;
