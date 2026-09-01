import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Volume2, ArrowLeft, ArrowRight } from "lucide-react";
import {
  speakGameTarget,
  useGameWordDeck,
  type GameContentEntry,
} from "@/games/gameContent";
import { recordWordMastery } from "@/lib/mastery";
import { ui } from "@/lib/i18n";

const COLS = 9;
const CELL = 44;
const W = COLS * CELL;
const H = 400;
const ROWS = Math.floor(H / CELL);

interface FallingTile {
  id: number;
  letter: string;
  col: number;
  row: number; // fractional
  isCorrect: boolean;
}

let tileId = 0;

function randomCol(exclude: number[] = []) {
  const cols = Array.from({ length: COLS }, (_, i) => i).filter(c => !exclude.includes(c));
  const available = cols.length > 0 ? cols : Array.from({ length: COLS }, (_, i) => i);
  return available[Math.floor(Math.random() * available.length)];
}

const WRONG_LETTERS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞ");

function makeTile(
  entry: Pick<GameContentEntry, "letters">,
  nextIdx: number,
  col: number,
  forceCorrect = false
): FallingTile | null {
  const needed = entry.letters[nextIdx];
  if (!needed) return null;
  const isCorrect = forceCorrect || Math.random() < 0.45;
  const decoys = WRONG_LETTERS.filter((letter) => letter !== needed);
  return {
    col,
    id: tileId++,
    isCorrect,
    letter: isCorrect ? needed : decoys[Math.floor(Math.random() * decoys.length)],
    row: 0,
  };
}

export default function FallingLetters() {
  const { next: nextEntry } = useGameWordDeck();
  const [entry, setEntry] = useState(() => nextEntry());
  const [nextIdx, setNextIdx] = useState(0);
  const [spelled, setSpelled] = useState("");
  const [tiles, setTiles] = useState<FallingTile[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "won" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("falling-hs") ?? "0", 10); } catch { return 0; }
  });
  const [wrongFlash, setWrongFlash] = useState(false);
  const [catcherCol, setCatcherCol] = useState(Math.floor(COLS / 2));

  const stateRef = useRef({ tiles, nextIdx, spelled, entry, phase, score, catcherCol });
  useEffect(() => { stateRef.current = { tiles, nextIdx, spelled, entry, phase, score, catcherCol }; });

  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSpawnAtRef = useRef(0);

  const newGame = useCallback(() => {
    const e = nextEntry();
    const startingCol = Math.floor(COLS / 2);
    stateRef.current = {
      catcherCol: startingCol,
      entry: e,
      nextIdx: 0,
      phase: "playing",
      score: 0,
      spelled: "",
      tiles: [],
    };
    setEntry(e);
    setNextIdx(0);
    setSpelled("");
    setTiles([]);
    setScore(0);
    setCatcherCol(startingCol);
    lastSpawnAtRef.current = performance.now();
    setPhase("playing");
  }, [nextEntry]);

  // Spawn tiles
  useEffect(() => {
    if (phase !== "playing") {
      if (spawnRef.current) clearInterval(spawnRef.current);
      spawnRef.current = null;
      return;
    }
    const spawn = () => {
      const { tiles, entry, nextIdx } = stateRef.current;
      const occupiedCols = tiles.filter(t => t.row < 1).map(t => t.col);
      const col = randomCol(occupiedCols);
      const tile = makeTile(entry, nextIdx, col);
      if (!tile) return;
      lastSpawnAtRef.current = performance.now();
      const nextTiles = [...tiles, tile];
      stateRef.current.tiles = nextTiles;
      setTiles(nextTiles);
    };
    spawn();
    spawnRef.current = setInterval(spawn, 1400);
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
      spawnRef.current = null;
    };
  }, [phase]);

  // Fall loop
  useEffect(() => {
    if (phase !== "playing") {
      if (loopRef.current) clearInterval(loopRef.current);
      loopRef.current = null;
      return;
    }
    loopRef.current = setInterval(() => {
      const { tiles, nextIdx, spelled, entry, score, catcherCol } = stateRef.current;
      const speed = 0.18 + Math.min(spelled.length * 0.02, 0.3);
      let newNextIdx = nextIdx;
      let newSpelled = spelled;
      let newScore = score;
      let gameOver = false;
      let won = false;

      const updated: FallingTile[] = [];
      for (const t of tiles) {
        const newRow = t.row + speed;
        // Reached catcher row
        if (newRow >= ROWS - 1 && t.col === catcherCol) {
          if (t.isCorrect && t.letter === entry.letters[newNextIdx]) {
            newNextIdx++;
            newSpelled = newSpelled + t.letter;
            newScore += 15;
            if (newNextIdx >= entry.letters.length) { won = true; break; }
          } else if (t.isCorrect) {
            // missed the correct letter — it passed
          } else {
            // caught wrong letter
            gameOver = true; break;
          }
          // tile consumed, don't add
        } else if (newRow >= ROWS) {
          // fell off bottom — if it was correct and we needed it, game over
          if (t.isCorrect && t.letter === entry.letters[newNextIdx]) {
            gameOver = true; break;
          }
          // else just remove
        } else {
          updated.push({ ...t, row: newRow });
        }
      }

      // Timer throttling or a cleared spawn interval must never leave an empty,
      // apparently running board. The fall loop owns this watchdog.
      if (
        !won &&
        !gameOver &&
        updated.length === 0 &&
        performance.now() - lastSpawnAtRef.current > 1700
      ) {
        const rescueTile = makeTile(entry, newNextIdx, randomCol(), true);
        if (rescueTile) {
          updated.push(rescueTile);
          lastSpawnAtRef.current = performance.now();
        }
      }

      if (won) {
        recordWordMastery(entry.de);
        stateRef.current = {
          ...stateRef.current,
          nextIdx: newNextIdx,
          phase: "won",
          score: newScore,
          spelled: newSpelled,
          tiles: [],
        };
        setSpelled(newSpelled);
        setNextIdx(newNextIdx);
        setScore(newScore);
        setTiles([]);
        setPhase("won");
        if (newScore > highScore) {
          setHighScore(newScore);
          try { localStorage.setItem("falling-hs", String(newScore)); } catch {}
        }
        setTimeout(() => speakGameTarget(entry), 350);
        return;
      }
      if (gameOver) {
        stateRef.current = {
          ...stateRef.current,
          phase: "wrong",
          tiles: updated,
        };
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 400);
        setTiles(updated);
        setPhase("wrong");
        return;
      }
      stateRef.current = {
        ...stateRef.current,
        nextIdx: newNextIdx,
        score: newScore,
        spelled: newSpelled,
        tiles: updated,
      };
      setTiles(updated);
      setNextIdx(newNextIdx);
      setSpelled(newSpelled);
      setScore(newScore);
    }, 50);
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
      loopRef.current = null;
    };
  }, [phase, highScore]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCatcherCol(c => {
          const next = Math.max(0, c - 1);
          stateRef.current.catcherCol = next;
          return next;
        });
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCatcherCol(c => {
          const next = Math.min(COLS - 1, c + 1);
          stateRef.current.catcherCol = next;
          return next;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">{ui("Falling Letters")}</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          {ui("Move the catcher to collect the correct letters in order.")}
        </p>
      </div>

      {/* Word display */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs text-[var(--text-3)]">{ui("Spell this word or phrase")}</p>
          <div className="mt-1.5 flex max-w-4xl flex-wrap items-center gap-1.5">
            {entry.letters.map((ch, i) => (
              <span key={i} className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                i < spelled.length
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                  : i === spelled.length
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-3)]"
              }`}>
                {i < spelled.length ? ch : i === spelled.length ? ch : "·"}
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-3)]">
            {ui(entry.clueLanguage === "de" ? "German:" : "English:")}{" "}
            <span className="font-medium text-[var(--text-2)]">{entry.clue}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">{ui("Score")}</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">{ui("Best")}</p>
            <div className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <p className="text-2xl font-bold text-[var(--text-1)]">{highScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game board */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={`relative overflow-hidden rounded-2xl border transition-all ${
            wrongFlash ? "border-rose-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]" : "border-[var(--border)]"
          }`}
          style={{ width: W, height: H, background: "var(--surface)", maxWidth: "100%" }}
        >
          {/* Grid lines */}
          <svg className="pointer-events-none absolute inset-0 opacity-[0.04]" width={W} height={H}>
            {Array.from({ length: COLS + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={H} stroke="currentColor" />
            ))}
            {Array.from({ length: ROWS + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * CELL} x2={W} y2={i * CELL} stroke="currentColor" />
            ))}
          </svg>

          {/* Falling tiles */}
          {tiles.map(tile => (
            <div
              key={tile.id}
              className={`absolute flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                tile.isCorrect && tile.letter === entry.letters[nextIdx]
                  ? "bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_0_12px_rgba(88,230,217,0.4)]"
                  : "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]"
              }`}
              style={{
                left: tile.col * CELL + 2,
                top: tile.row * CELL,
                width: CELL - 4,
                height: CELL - 4,
              }}
            >
              {tile.letter}
            </div>
          ))}

          {/* Catcher */}
          {phase === "playing" && (
            <motion.div
              animate={{ left: catcherCol * CELL + 2 }}
              className="absolute rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-dim)]"
              style={{ bottom: 4, width: CELL - 4, height: CELL - 4 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
            />
          )}

          {/* Overlay */}
          <AnimatePresence>
            {phase !== "playing" && (
              <motion.div
                animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
                style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)" }}
              >
                {phase === "idle" && (
                  <>
                    <p className="text-lg font-semibold text-[var(--text-1)]">{ui("Falling Letters")}</p>
                    <p className="max-w-xs text-center text-sm text-[var(--text-3)]">
                      {ui("Move the catcher with ← → to collect the glowing letters in order. Catch a wrong letter and it's game over.")}
                    </p>
                    <button className="accent-btn px-6 py-2.5 text-sm" onClick={newGame} type="button">{ui("Start game")}</button>
                  </>
                )}
                {phase === "won" && (
                  <>
                    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-5xl">🎉</motion.div>
                    <div className="flex items-center gap-3">
                      <p className="max-w-sm text-center text-2xl font-bold text-[var(--text-1)]">{entry.target}</p>
                      <button
                        aria-label={ui("Hear pronunciation")}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-text)] active:scale-95"
                        onClick={() => speakGameTarget(entry)} type="button"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--text-3)]">{entry.clue}</p>
                    <p className="text-xs text-[var(--text-3)]">+{score} {ui("points")}</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={newGame} type="button">
                      <RotateCcw className="h-4 w-4" /> {ui("Next word")}
                    </button>
                  </>
                )}
                {phase === "wrong" && (
                  <>
                    <p className="text-lg font-semibold text-rose-400">{ui("Wrong letter!")}</p>
                    <p className="text-sm text-[var(--text-3)]">
                      {ui("You needed")} <span className="font-bold text-[var(--accent)]">{entry.letters[nextIdx]}</span>
                    </p>
                    <p className="text-xs text-[var(--text-3)]">{entry.target} = {entry.clue}</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={newGame} type="button">
                      <RotateCcw className="h-4 w-4" /> {ui("Try again")}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile controls */}
        <div className="flex gap-3 lg:hidden">
          {[{ d: "left", icon: ArrowLeft }, { d: "right", icon: ArrowRight }].map(({ d, icon: Icon }) => (
            <button
              key={d}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] active:bg-[var(--accent-dim)] active:text-[var(--accent)]"
              onPointerDown={() => setCatcherCol(c => {
                const next = d === "left" ? Math.max(0, c - 1) : Math.min(COLS - 1, c + 1);
                stateRef.current.catcherCol = next;
                return next;
              })}
              type="button"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--text-3)]">
          {ui("← → arrow keys to move · Catch the glowing letter next")}
        </p>
      </div>
    </div>
  );
}
