import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Flag, Clock } from "lucide-react";
import { speakGerman } from "@/lib/tts";
import { recordWordMastery } from "@/lib/mastery";

// ── Vocab bank ────────────────────────────────────────────────
const VOCAB: { de: string; en: string }[] = [
  { de: "Hund", en: "dog" }, { de: "Katze", en: "cat" }, { de: "Haus", en: "house" },
  { de: "Buch", en: "book" }, { de: "Wasser", en: "water" }, { de: "Brot", en: "bread" },
  { de: "Schule", en: "school" }, { de: "Auto", en: "car" }, { de: "Baum", en: "tree" },
  { de: "Tisch", en: "table" }, { de: "Stuhl", en: "chair" }, { de: "Fenster", en: "window" },
  { de: "Blume", en: "flower" }, { de: "Vogel", en: "bird" }, { de: "Apfel", en: "apple" },
  { de: "Milch", en: "milk" }, { de: "Kind", en: "child" }, { de: "Stadt", en: "city" },
  { de: "Sonne", en: "sun" }, { de: "Mond", en: "moon" }, { de: "Herz", en: "heart" },
  { de: "Wald", en: "forest" }, { de: "Meer", en: "sea" }, { de: "Nacht", en: "night" },
  { de: "Tag", en: "day" }, { de: "Zeit", en: "time" }, { de: "Mann", en: "man" },
  { de: "Frau", en: "woman" }, { de: "Hand", en: "hand" }, { de: "Kopf", en: "head" },
  { de: "Auge", en: "eye" }, { de: "Ohr", en: "ear" }, { de: "Mund", en: "mouth" },
  { de: "Nase", en: "nose" }, { de: "Bein", en: "leg" }, { de: "Arm", en: "arm" },
  { de: "Tür", en: "door" }, { de: "Weg", en: "way" }, { de: "Geld", en: "money" },
  { de: "Arbeit", en: "work" }, { de: "Leben", en: "life" }, { de: "Welt", en: "world" },
  { de: "Land", en: "country" }, { de: "Straße", en: "street" }, { de: "Zug", en: "train" },
  { de: "Flugzeug", en: "airplane" }, { de: "Schiff", en: "ship" }, { de: "Brücke", en: "bridge" },
  { de: "Berg", en: "mountain" }, { de: "Fluss", en: "river" }, { de: "See", en: "lake" },
  { de: "Feuer", en: "fire" }, { de: "Eis", en: "ice" }, { de: "Regen", en: "rain" },
  { de: "Schnee", en: "snow" }, { de: "Wind", en: "wind" }, { de: "Wolke", en: "cloud" },
  { de: "Himmel", en: "sky" }, { de: "Erde", en: "earth" }, { de: "Stein", en: "stone" },
  { de: "Gold", en: "gold" }, { de: "Silber", en: "silver" }, { de: "Eisen", en: "iron" },
];

// ── Difficulty presets ────────────────────────────────────────
const DIFFICULTIES = {
  easy:   { cols: 8,  rows: 8,  mines: 8,  timer: 12, label: "Easy" },
  medium: { cols: 10, rows: 10, mines: 15, timer: 9,  label: "Medium" },
  hard:   { cols: 12, rows: 10, mines: 25, timer: 6,  label: "Hard" },
} as const;
type Difficulty = keyof typeof DIFFICULTIES;

// ── Cell type ─────────────────────────────────────────────────
interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  vocab: { de: string; en: string };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(cols: number, rows: number, mines: number, safeIdx: number): Cell[] {
  const total = cols * rows;
  const shuffledVocab = shuffle(VOCAB);

  // Place mines avoiding the first-click cell and its neighbors
  const safeRow = Math.floor(safeIdx / cols);
  const safeCol = safeIdx % cols;
  const safeSet = new Set<number>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr, c = safeCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) safeSet.add(r * cols + c);
    }
  }

  const candidates = Array.from({ length: total }, (_, i) => i).filter(i => !safeSet.has(i));
  const mineSet = new Set(shuffle(candidates).slice(0, mines));

  const cells: Cell[] = Array.from({ length: total }, (_, i) => ({
    isMine: mineSet.has(i),
    isRevealed: false,
    isFlagged: false,
    adjacentMines: 0,
    vocab: shuffledVocab[i % shuffledVocab.length],
  }));

  // Compute adjacency
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r * cols + c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && cells[nr * cols + nc].isMine) count++;
        }
      }
      cells[r * cols + c].adjacentMines = count;
    }
  }
  return cells;
}

function floodReveal(cells: Cell[], idx: number, cols: number, rows: number): Cell[] {
  const updated = [...cells];
  const queue = [idx];
  const visited = new Set<number>();
  while (queue.length) {
    const i = queue.shift()!;
    if (visited.has(i)) continue;
    visited.add(i);
    if (updated[i].isMine || updated[i].isFlagged) continue;
    updated[i] = { ...updated[i], isRevealed: true };
    if (updated[i].adjacentMines === 0) {
      const r = Math.floor(i / cols), c = i % cols;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) queue.push(nr * cols + nc);
        }
      }
    }
  }
  return updated;
}

const ADJACENT_COLORS = ["", "text-blue-400", "text-green-400", "text-rose-400", "text-violet-400", "text-amber-400", "text-cyan-400", "text-pink-400", "text-gray-400"];

// ── Component ─────────────────────────────────────────────────
export default function VocabMinesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cells, setCells] = useState<Cell[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "won" | "dead">("idle");

  // Quiz overlay state
  const [quizCell, setQuizCell] = useState<{ idx: number; vocab: { de: string; en: string } } | null>(null);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("minesweeper-hs") ?? "0", 10); } catch { return 0; }
  });
  const [flagMode, setFlagMode] = useState(false);
  const [minesLeft, setMinesLeft] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef({ cells, phase, score });
  useEffect(() => { stateRef.current = { cells, phase, score }; });

  const cfg = DIFFICULTIES[difficulty];

  const newGame = useCallback((diff: Difficulty = difficulty) => {
    setDifficulty(diff);
    setCells([]);
    setPhase("playing");
    setScore(0);
    setQuizCell(null);
    setAnswer("");
    setQuizResult(null);
    setFlagMode(false);
    setMinesLeft(DIFFICULTIES[diff].mines);
    setElapsedTime(0);
    clearInterval(elapsedRef.current!);
    elapsedRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
  }, [difficulty]);

  useEffect(() => {
    return () => { clearInterval(timerRef.current!); clearInterval(elapsedRef.current!); };
  }, []);

  // Stop elapsed timer when game ends
  useEffect(() => {
    if (phase === "won" || phase === "dead" || phase === "idle") {
      clearInterval(elapsedRef.current!);
    }
  }, [phase]);

  // Quiz countdown
  useEffect(() => {
    if (!quizCell || quizResult) return;
    setTimeLeft(cfg.timer);
    clearInterval(timerRef.current!);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleQuizResult(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearInterval(timerRef.current!);
  }, [quizCell]);

  const handleQuizResult = useCallback((correct: boolean) => {
    clearInterval(timerRef.current!);
    setQuizResult(correct ? "correct" : "wrong");

    if (correct) {
      setQuizResult("correct");
      if (quizCell) recordWordMastery(quizCell.vocab.de);
      setTimeout(() => {
        const { cells, score } = stateRef.current;
        const idx = stateRef.current.cells.findIndex((_, i) => i === quizCell?.idx);
        const qIdx = quizCell?.idx ?? -1;
        if (qIdx < 0) return;

        const cfg = DIFFICULTIES[difficulty];
        // Reveal — flood fill if 0 adjacent
        let updated = [...cells];
        updated[qIdx] = { ...updated[qIdx], isRevealed: true };
        if (updated[qIdx].adjacentMines === 0) {
          updated = floodReveal(updated, qIdx, cfg.cols, cfg.rows);
        }

        const newScore = score + 10 + cfg.timer * 2;
        setScore(newScore);
        setCells(updated);
        setQuizCell(null);
        setAnswer("");
        setQuizResult(null);

        // Check win: all non-mine cells revealed
        const won = updated.every(c => c.isMine || c.isRevealed);
        if (won) {
          const finalScore = newScore + 50;
          setScore(finalScore);
          setPhase("won");
          if (finalScore > highScore) {
            setHighScore(finalScore);
            try { localStorage.setItem("minesweeper-hs", String(finalScore)); } catch {}
          }
        }
      }, 600);
    } else {
      setQuizResult("wrong");
      setTimeout(() => {
        // Reveal all mines
        setCells(prev => prev.map(c => c.isMine ? { ...c, isRevealed: true } : c));
        setPhase("dead");
        setQuizCell(null);
        setAnswer("");
        setQuizResult(null);
      }, 900);
    }
  }, [quizCell, difficulty, highScore]);

  const submitAnswer = () => {
    if (!quizCell || quizResult) return;
    const userAns = answer.trim().toLowerCase();
    const correct = quizCell.vocab.en.toLowerCase().split("/").some(v => v.trim() === userAns);
    handleQuizResult(correct);
  };

  const handleCellClick = (idx: number) => {
    if (phase !== "playing" || quizCell) return;
    const cell = cells[idx];
    if (!cell || cell.isRevealed || cell.isFlagged) return;

    if (flagMode) {
      setCells(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], isFlagged: !updated[idx].isFlagged };
        return updated;
      });
      setMinesLeft(m => cells[idx].isFlagged ? m + 1 : m - 1);
      return;
    }

    // First click — build grid
    if (cells.length === 0) return;

    // Open quiz
    setAnswer("");
    setQuizResult(null);
    setQuizCell({ idx, vocab: cell.vocab });
    speakGerman(cell.vocab.de.toLowerCase());
  };

  const handleFirstClick = (idx: number) => {
    if (cells.length > 0) { handleCellClick(idx); return; }
    // Build grid on first click
    const built = buildGrid(cfg.cols, cfg.rows, cfg.mines, idx);
    setCells(built);
    setAnswer("");
    setQuizResult(null);
    setQuizCell({ idx, vocab: built[idx].vocab });
    speakGerman(built[idx].vocab.de.toLowerCase());
  };

  const handleRightClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    if (phase !== "playing" || quizCell || cells.length === 0) return;
    const cell = cells[idx];
    if (!cell || cell.isRevealed) return;
    setCells(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], isFlagged: !updated[idx].isFlagged };
      return updated;
    });
    setMinesLeft(m => cells[idx].isFlagged ? m + 1 : m - 1);
  };

  const CELL_SIZE = Math.min(40, Math.floor(320 / cfg.cols));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">Vocab Minesweeper</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          Click a cell — translate the German word to reveal it safely. Wrong answer = mine.
        </p>
      </div>

      {/* Stats bar */}
      <div className="card flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-base">💣</span>
            <span className="font-bold text-[var(--text-1)]">{minesLeft}</span>
            <span className="text-[var(--text-3)]">left</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5 text-[var(--text-3)]" />
            <span className="font-bold text-[var(--text-1)]">{elapsedTime}s</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-[var(--text-3)]">Score</span>
            <span className="font-bold text-[var(--text-1)]">{score}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-bold text-[var(--text-1)] text-sm">{highScore}</span>
          </div>
        </div>

        {/* Difficulty + flag toggle */}
        <div className="flex items-center gap-2">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map(d => (
            <button
              key={d}
              className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                difficulty === d
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border-2)]"
              }`}
              onClick={() => { if (phase === "idle") setDifficulty(d); else newGame(d); }}
              type="button"
            >
              {DIFFICULTIES[d].label}
            </button>
          ))}
          <button
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
              flagMode
                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                : "border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border-2)]"
            }`}
            onClick={() => setFlagMode(f => !f)}
            title="Toggle flag mode (or right-click cells)"
            type="button"
          >
            <Flag className="h-3 w-3" /> Flag
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className="rounded-2xl border border-[var(--border)] p-2"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${cfg.cols}, ${CELL_SIZE}px)` }}
            >
              {(cells.length > 0 ? cells : Array.from({ length: cfg.cols * cfg.rows })).map((cell, idx) => {
                const c = cell as Cell | undefined;
                const revealed = c?.isRevealed ?? false;
                const flagged = c?.isFlagged ?? false;
                const isMine = c?.isMine ?? false;
                const adj = c?.adjacentMines ?? 0;

                return (
                  <motion.button
                    key={idx}
                    className={`flex items-center justify-center rounded text-xs font-bold select-none transition-colors ${
                      revealed
                        ? isMine
                          ? "bg-rose-500/20 border border-rose-500/40"
                          : "bg-[var(--surface-2)] border border-[var(--border)]"
                        : flagged
                        ? "bg-amber-400/10 border border-amber-400/40 text-amber-400"
                        : "bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent-dim)] cursor-pointer"
                    }`}
                    onClick={() => handleFirstClick(idx)}
                    onContextMenu={e => handleRightClick(e, idx)}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    type="button"
                    whileTap={!revealed ? { scale: 0.88 } : undefined}
                  >
                    {revealed
                      ? isMine
                        ? "💣"
                        : adj > 0
                        ? <span className={ADJACENT_COLORS[adj]}>{adj}</span>
                        : null
                      : flagged
                      ? "🚩"
                      : null}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Game over / win overlay */}
          <AnimatePresence>
            {(phase === "idle" || phase === "won" || phase === "dead") && (
              <motion.div
                animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
                style={{ background: "color-mix(in srgb, var(--bg) 90%, transparent)" }}
              >
                {phase === "idle" && (
                  <>
                    <p className="text-lg font-semibold text-[var(--text-1)]">Vocab Minesweeper</p>
                    <p className="max-w-[260px] text-center text-sm text-[var(--text-3)]">
                      Click any cell to reveal it. Translate the German word correctly to defuse it. Wrong answer = boom.
                    </p>
                    <button className="accent-btn px-6 py-2.5 text-sm" onClick={() => newGame()} type="button">
                      Start game
                    </button>
                  </>
                )}
                {phase === "won" && (
                  <>
                    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-5xl">🎉</motion.div>
                    <p className="text-lg font-semibold text-[var(--text-1)]">Board cleared!</p>
                    <p className="text-sm text-[var(--text-3)]">+{score} points · {elapsedTime}s</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={() => newGame()} type="button">
                      <RotateCcw className="h-4 w-4" /> Play again
                    </button>
                  </>
                )}
                {phase === "dead" && (
                  <>
                    <div className="text-5xl">💥</div>
                    <p className="text-lg font-semibold text-rose-400">Boom!</p>
                    <p className="text-sm text-[var(--text-3)]">Score: {score}</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={() => newGame()} type="button">
                      <RotateCcw className="h-4 w-4" /> Try again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quiz modal */}
      <AnimatePresence>
        {quizCell && (
          <motion.div
            animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <motion.div
              animate={{ scale: 1, y: 0 }} initial={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl transition-colors ${
                quizResult === "correct"
                  ? "border-[var(--accent)] bg-[var(--surface)]"
                  : quizResult === "wrong"
                  ? "border-rose-500 bg-[var(--surface)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Timer bar */}
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                <motion.div
                  animate={{ width: `${(timeLeft / cfg.timer) * 100}%` }}
                  className={`h-full rounded-full transition-colors ${
                    timeLeft <= 3 ? "bg-rose-500" : "bg-[var(--accent)]"
                  }`}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>

              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-[var(--text-3)]">Translate to English</p>
                <span className={`text-sm font-bold ${timeLeft <= 3 ? "text-rose-400" : "text-[var(--text-3)]"}`}>
                  {timeLeft}s
                </span>
              </div>

              <p className="mb-4 text-3xl font-bold text-[var(--text-1)]">{quizCell.vocab.de}</p>

              {quizResult === null ? (
                <form onSubmit={e => { e.preventDefault(); submitAnswer(); }} className="flex gap-2">
                  <input
                    ref={inputRef}
                    autoComplete="off"
                    className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="English translation..."
                    type="text"
                    value={answer}
                  />
                  <button className="accent-btn px-4 py-2.5 text-sm" type="submit">Go</button>
                </form>
              ) : quizResult === "correct" ? (
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <span className="text-xl">✓</span>
                  <span className="font-semibold">Correct! "{quizCell.vocab.en}"</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-400">
                    <span className="text-xl">✗</span>
                    <span className="font-semibold">It was "{quizCell.vocab.en}"</span>
                  </div>
                  <p className="text-xs text-[var(--text-3)]">💥 Mine triggered...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-[var(--text-3)]">
        Click to reveal · Right-click or use Flag mode to mark mines · Translate correctly to defuse
      </p>
    </div>
  );
}
