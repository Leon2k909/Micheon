export type Difficulty = "easy" | "medium" | "hard";

export interface UserPerformance {
  correctCount: number;
  totalCount: number;
  streak: number;
}

export function calculateDifficulty(performance: UserPerformance): Difficulty {
  const ratio = performance.totalCount > 0 ? performance.correctCount / performance.totalCount : 0.5;
  
  if (ratio > 0.8 && performance.streak > 5) return "hard";
  if (ratio < 0.4) return "easy";
  return "medium";
}

export function adjustSessionItems(items: any[], difficulty: Difficulty) {
  // If hard, prefer translation (harder) over multiple choice (easier)
  // If easy, prefer flashcard/multiple choice over translation
  
  return items.sort((a, b) => {
    const scoreA = getDifficultyScore(a.kind);
    const scoreB = getDifficultyScore(b.kind);
    
    if (difficulty === "hard") return scoreB - scoreA;
    if (difficulty === "easy") return scoreA - scoreB;
    return 0;
  });
}

function getDifficultyScore(kind: string): number {
  switch (kind) {
    case "translation": return 3;
    case "cloze": return 2.5;
    case "listening": return 2;
    case "article": return 1.5;
    case "card": return 1;
    default: return 1;
  }
}
