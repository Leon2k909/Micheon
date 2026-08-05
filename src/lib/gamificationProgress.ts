import { countKnownVocab } from "@/lib/fluency";

export type GamificationStats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
};

type Level = { level: number; label: string; xpRequired: number };

const LEVELS: Level[] = [
  { level: 1, label: "Getting started", xpRequired: 0 },
  { level: 2, label: "Warming up", xpRequired: 100 },
  { level: 3, label: "Finding a rhythm", xpRequired: 300 },
  { level: 4, label: "In the groove", xpRequired: 650 },
  { level: 5, label: "Committed", xpRequired: 1100 },
  { level: 6, label: "Dedicated", xpRequired: 1800 },
  { level: 7, label: "Relentless", xpRequired: 2800 },
  { level: 8, label: "Unstoppable", xpRequired: 4200 },
  { level: 9, label: "Fluent in the making", xpRequired: 6000 },
  { level: 10, label: "Conversational", xpRequired: 8200 },
  { level: 11, label: "Holding your own", xpRequired: 11000 },
  { level: 12, label: "Comfortable", xpRequired: 14500 },
  { level: 13, label: "Quick on your feet", xpRequired: 18500 },
  { level: 14, label: "Thinking in German", xpRequired: 23000 },
  { level: 15, label: "Hard to catch out", xpRequired: 28000 },
  { level: 16, label: "At home in the language", xpRequired: 34000 },
  { level: 17, label: "Reading between the lines", xpRequired: 41000 },
  { level: 18, label: "Rarely surprised", xpRequired: 49000 },
  { level: 19, label: "Near-native", xpRequired: 58000 },
  { level: 20, label: "Muttersprachler-Niveau", xpRequired: 70000 },
];

export const MILESTONES = [
  {
    id: "first_session",
    label: "First lesson",
    desc: "Complete one guided lesson.",
    target: 1,
    unit: "lesson",
    current: (stats: GamificationStats) => stats.sessionsCompleted,
    check: (stats: GamificationStats) => stats.sessionsCompleted >= 1,
  },
  {
    id: "streak_3",
    label: "Three-day streak",
    desc: "Return for three separate days.",
    target: 3,
    unit: "days",
    current: (stats: GamificationStats) => stats.streak,
    check: (stats: GamificationStats) => stats.streak >= 3,
  },
  {
    id: "reviews_50",
    label: "50 review items",
    desc: "Build recognition through recall.",
    target: 50,
    unit: "reviews",
    current: (stats: GamificationStats) => stats.totalReviews,
    check: (stats: GamificationStats) => stats.totalReviews >= 50,
  },
  {
    id: "xp_500",
    label: "500 XP",
    desc: "Show steady practice momentum.",
    target: 500,
    unit: "XP",
    current: (stats: GamificationStats) => stats.totalXp,
    check: (stats: GamificationStats) => stats.totalXp >= 500,
  },
  {
    id: "words_200",
    label: "200 tracked words",
    desc: "Combine lessons and word-bank items.",
    target: 200,
    unit: "words",
    current: (stats: GamificationStats) => countKnownVocab(undefined, stats.externalWords),
    check: (stats: GamificationStats) => countKnownVocab(undefined, stats.externalWords) >= 200,
  },
  {
    id: "week",
    label: "Seven-day rhythm",
    desc: "Keep a full week of returns.",
    target: 7,
    unit: "days",
    current: (stats: GamificationStats) => stats.streak,
    check: (stats: GamificationStats) => stats.streak >= 7,
  },
  {
    id: "lessons_10",
    label: "10 lessons complete",
    desc: "Build a dependable learning routine.",
    target: 10,
    unit: "lessons",
    current: (stats: GamificationStats) => stats.sessionsCompleted,
    check: (stats: GamificationStats) => stats.sessionsCompleted >= 10,
  },
  {
    id: "reviews_250",
    label: "250 review items",
    desc: "Strengthen useful language through recall.",
    target: 250,
    unit: "reviews",
    current: (stats: GamificationStats) => stats.totalReviews,
    check: (stats: GamificationStats) => stats.totalReviews >= 250,
  },
  {
    id: "xp_2500",
    label: "2,500 XP",
    desc: "Keep making steady progress across activities.",
    target: 2500,
    unit: "XP",
    current: (stats: GamificationStats) => stats.totalXp,
    check: (stats: GamificationStats) => stats.totalXp >= 2500,
  },
  {
    id: "words_1000",
    label: "1,000 tracked words",
    desc: "Grow a broad base for everyday conversation.",
    target: 1000,
    unit: "words",
    current: (stats: GamificationStats) => countKnownVocab(undefined, stats.externalWords),
    check: (stats: GamificationStats) => countKnownVocab(undefined, stats.externalWords) >= 1000,
  },
  {
    id: "streak_30",
    label: "30-day streak",
    desc: "Return regularly for a full month.",
    target: 30,
    unit: "days",
    current: (stats: GamificationStats) => stats.streak,
    check: (stats: GamificationStats) => stats.streak >= 30,
  },
  {
    id: "lessons_100",
    label: "100 lessons complete",
    desc: "Turn regular practice into lasting experience.",
    target: 100,
    unit: "lessons",
    current: (stats: GamificationStats) => stats.sessionsCompleted,
    check: (stats: GamificationStats) => stats.sessionsCompleted >= 100,
  },
] as const;

export function getLevelInfo(xp: number) {
  let cur = LEVELS[0];
  let nxt: Level | null = LEVELS[1];
  for (let index = 0; index < LEVELS.length; index += 1) {
    if (xp >= LEVELS[index].xpRequired) {
      cur = LEVELS[index];
      nxt = LEVELS[index + 1] ?? null;
    }
  }
  const into = xp - cur.xpRequired;
  const needed = nxt ? nxt.xpRequired - cur.xpRequired : 1;
  const pct = nxt ? Math.min(100, Math.round((into / needed) * 100)) : 100;
  return { cur, nxt, pct, into, needed };
}
