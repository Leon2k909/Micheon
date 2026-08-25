import {
  isDueForReview,
  overdueBy,
  recallDetail,
  strengthInfo,
  type GradeRecord,
} from "@/lib/memoryStrength";
import { wordLadderRung, type WordItem } from "@/lib/wordSession";

export type WordTrackerSort =
  | "common"
  | "rare"
  | "easy"
  | "hard"
  | "alpha"
  | "alpha-desc"
  | "status"
  | "weak"
  | "strong"
  | "recent";

export const WORD_TRACKER_SORTS: ReadonlyArray<{ key: WordTrackerSort; label: string }> = [
  { key: "common", label: "Most common first" },
  { key: "rare", label: "Least common first" },
  { key: "easy", label: "Easiest first" },
  { key: "hard", label: "Hardest first" },
  { key: "alpha", label: "Alphabetical A–Z" },
  { key: "alpha-desc", label: "Alphabetical Z–A" },
  { key: "status", label: "Needs attention first" },
  { key: "weak", label: "Weakest memory first" },
  { key: "strong", label: "Strongest memory first" },
  { key: "recent", label: "Recently practised first" },
];

type RecordForWord = (word: WordItem) => GradeRecord | undefined;
type AlphabetLanguage = "de" | "en" | "fr";

const COLLATOR: Record<AlphabetLanguage, Intl.Collator> = {
  de: new Intl.Collator("de", { numeric: true, sensitivity: "base" }),
  en: new Intl.Collator("en", { numeric: true, sensitivity: "base" }),
  // sensitivity "base" folds é onto e, which is what an A–Z index wants: a
  // French learner looking under E expects to find "école" there.
  fr: new Intl.Collator("fr", { numeric: true, sensitivity: "base" }),
};

const parsedTime = (value: string | undefined) => {
  const time = Date.parse(value ?? "");
  return Number.isFinite(time) ? time : 0;
};

/** Practice can happen in lessons, tests, Listen, or extra reinforcement. */
const latestPracticeTime = (record: GradeRecord | undefined) => record
  ? Math.max(
      parsedTime(record.updatedAt),
      parsedTime(record.reinforcedAt),
      parsedTime(record.lastAnswerAt),
      parsedTime(record.lastMistakeAt),
      parsedTime(record.listenedAt)
    )
  : 0;

/**
 * A learner-facing memory score. A demonstrated struggle is weakest, an
 * untouched word is unmeasured, then learned words follow the same 0–5 meter
 * shown in the row with current recall as the tie-break. Permanent is above
 * the normal ladder.
 */
const memoryScore = (record: GradeRecord | undefined, now: number) => {
  if (record?.lastGrade === "struggle") return 0;
  if (record?.lastGrade !== "know") return 0.5;
  const strength = strengthInfo(record, now);
  if (strength.permanent) return 7;
  return strength.level + recallDetail(record, now).weight;
};

const attentionRank = (record: GradeRecord | undefined, now: number) => {
  if (record?.lastGrade === "struggle") return 0;
  if (record?.lastGrade === "know" && isDueForReview(record, now)) return 1;
  if (record?.lastGrade !== "know") return 2;
  return 3;
};

/**
 * Sort filtered Word Tracker rows without mutating the catalogue. Expensive
 * values are calculated once per row rather than repeatedly in the sort
 * comparator; the full catalogue's common rank is the stable tie-break.
 */
export function sortWordTrackerRows(
  rows: readonly WordItem[],
  sort: WordTrackerSort,
  recordFor: RecordForWord,
  commonRanks: ReadonlyMap<string, number>,
  alphabetLanguage: AlphabetLanguage = "de",
  now = Date.now()
): WordItem[] {
  const collator = COLLATOR[alphabetLanguage];
  const keyed = rows.map((word) => {
    const record = recordFor(word);
    return {
      word,
      common: commonRanks.get(word.id) ?? Number.MAX_SAFE_INTEGER,
      difficulty: wordLadderRung(word),
      memory: memoryScore(record, now),
      attention: attentionRank(record, now),
      overdue: Math.max(0, overdueBy(record, now)),
      practisedAt: latestPracticeTime(record),
      text: alphabetLanguage === "en" ? word.en : word.de,
    };
  });
  type KeyedWord = (typeof keyed)[number];
  const byCommon = (a: KeyedWord, b: KeyedWord) => a.common - b.common;
  const byText = (a: KeyedWord, b: KeyedWord) => collator.compare(a.text, b.text);

  const compare: Record<WordTrackerSort, (a: KeyedWord, b: KeyedWord) => number> = {
    common: (a, b) => byCommon(a, b) || byText(a, b),
    rare: (a, b) => b.common - a.common || byText(a, b),
    easy: (a, b) => a.difficulty - b.difficulty || byCommon(a, b) || byText(a, b),
    hard: (a, b) => b.difficulty - a.difficulty || byCommon(a, b) || byText(a, b),
    alpha: (a, b) => byText(a, b) || byCommon(a, b),
    "alpha-desc": (a, b) => -byText(a, b) || byCommon(a, b),
    status: (a, b) => a.attention - b.attention
      || (a.attention === 1 ? b.overdue - a.overdue : 0)
      || byCommon(a, b)
      || byText(a, b),
    weak: (a, b) => a.memory - b.memory || byCommon(a, b) || byText(a, b),
    strong: (a, b) => b.memory - a.memory || byCommon(a, b) || byText(a, b),
    recent: (a, b) => b.practisedAt - a.practisedAt || byCommon(a, b) || byText(a, b),
  };

  keyed.sort(compare[sort]);
  return keyed.map(({ word }) => word);
}
