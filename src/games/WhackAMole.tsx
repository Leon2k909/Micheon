import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Volume2 } from "lucide-react";
import { speakGerman } from "@/lib/tts";
import { recordWordMastery } from "@/lib/mastery";

const WORD_BANK = [
  { de: "HAUS", en: "house" }, { de: "HUND", en: "dog" }, { de: "KATZE", en: "cat" },
  { de: "BUCH", en: "book" }, { de: "WASSER", en: "water" }, { de: "BROT", en: "bread" },
  { de: "SCHULE", en: "school" }, { de: "AUTO", en: "car" }, { de: "BAUM", en: "tree" },
  { de: "TISCH", en: "table" }, { de: "STUHL", en: "chair" }, { de: "FENSTER", en: "window" },
  { de: "BLUME", en: "flower" }, { de: "VOGEL", en: "bird" }, { de: "APFEL", en: "apple" },
  { de: "MILCH", en: "milk" }, { de: "KIND", en: "child" }, { de: "STADT", en: "city" },
  { de: "SONNE", en: "sun" }, { de: "MOND", en: "moon" }, { de: "HERZ", en: "heart" },
  { de: "WALD", en: "forest" }, { de: "MEER", en: "sea" }, { de: "NACHT", en: "night" },
];

const HOLES = 9; // 3x3 grid
const WRONG_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface Mole {
  id: number;
  holeIdx: number;
  letter: string;
  isCorrect: boolean;
  visible: boolean;
  whacked: boolean;
}

let moleId = 0;

function pickEntry() {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

export default function WhackAMole() {
  const [entry, setEntry] = useState(() => pickEntry());
  const [nextIdx, setNextIdx] = useState(0);
  const [spelled, setSpelled] = useState("");
  const [moles, setMoles] = useState<Mole[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "won" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("whack-hs") ?? "0", 10); } catch { return 0; }
  });
  const [wrongFlash, setWrongFlash] = useState(false);
  const [missedFlash, setMissedFlash] = useState<number | null>(null);

  const stateRef = useRef({ moles, nextIdx, spelled, entry, phase, score });
  useEffect(() => { stateRef.current = { moles, nextIdx, spelled, entry, phase, score }; });

  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const newGame = useCallback(() => {
    const e = pickEntry();
    setEntry(e);
    setNextIdx(0);
    setSpelled("");
    setMoles([]);
    setScore(0);
    setPhase("playing");
  }, []);

  // Spawn moles
  useEffect(() => {
    if (phase !== "playing") { clearInterval(spawnRef.current!); return; }

    const spawn = () => {
      const { moles, entry, nextIdx, spelled } = stateRef.current;
      const occupiedHoles = moles.filter(m => m.visible).map(m => m.holeIdx);
      const freeHoles = Array.from({ length: HOLES }, (_, i) => i).filter(h => !occupiedHoles.includes(h));
      if (freeHoles.length === 0) return;

      const holeIdx = freeHoles[Math.floor(Math.random() * freeHoles.length)];
      const isCorrect = Math.random() < 0.4;
      const letter = isCorrect
        ? entry.de[nextIdx]
        : WRONG_LETTERS.replace(entry.de[nextIdx], "")[Math.floor(Math.random() * 25)];

      const id = moleId++;
      setMoles(prev => [...prev, { id, holeIdx, letter, isCorrect, visible: true, whacked: false }]);

      // Auto-hide after duration
      const duration = Math.max(900, 1600 - spelled.length * 60);
      setTimeout(() => {
        setMoles(prev => {
          const m = prev.find(x => x.id === id);
          if (m && !m.whacked && m.isCorrect && m.letter === stateRef.current.entry.de[stateRef.current.nextIdx]) {
            // Correct mole escaped — game over
            setWrongFlash(true);
            setTimeout(() => setWrongFlash(false), 400);
            setPhase("wrong");
          }
          return prev.map(x => x.id === id ? { ...x, visible: false } : x);
        });
      }, duration);
    };

    spawn();
    const interval = Math.max(600, 1200 - spelled.length * 40);
    spawnRef.current = setInterval(spawn, interval);
    return () => clearInterval(spawnRef.current!);
  }, [phase]);

  const whack = useCallback((mole: Mole) => {
    if (!mole.visible || mole.whacked || phase !== "playing") return;
    const { nextIdx, spelled, entry, score } = stateRef.current;

    if (mole.isCorrect && mole.letter === entry.de[nextIdx]) {
      // Correct
      const newNextIdx = nextIdx + 1;
      const newSpelled = spelled + mole.letter;
      const newScore = score + 20;
      setMoles(prev => prev.map(m => m.id === mole.id ? { ...m, whacked: true, visible: false } : m));
      setNextIdx(newNextIdx);
      setSpelled(newSpelled);
      setScore(newScore);

      if (newNextIdx >= entry.de.length) {
        setPhase("won");
        recordWordMastery(entry.de);
        if (newScore > highScore) {
          setHighScore(newScore);
          try { localStorage.setItem("whack-hs", String(newScore)); } catch {}
        }
        setTimeout(() => speakGerman(entry.de.toLowerCase()), 350);
      }
    } else {
      // Wrong
      setMissedFlash(mole.holeIdx);
      setTimeout(() => setMissedFlash(null), 300);
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 400);
      setPhase("wrong");
    }
  }, [phase, highScore]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">Whack-a-Mole</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          Whack the correct letter before it disappears.
        </p>
      </div>

      {/* Word display */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs text-[var(--text-3)]">Spell this word</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            {entry.de.split("").map((ch, i) => (
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
            English: <span className="font-medium text-[var(--text-2)]">{entry.en}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">Score</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">Best</p>
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
          className={`relative rounded-2xl border p-4 transition-all ${
            wrongFlash ? "border-rose-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]" : "border-[var(--border)]"
          }`}
          style={{ background: "var(--surface)" }}
        >
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: HOLES }, (_, holeIdx) => {
              const mole = moles.find(m => m.holeIdx === holeIdx && m.visible);
              const isFlashing = missedFlash === holeIdx;
              return (
                <div key={holeIdx} className="relative flex h-20 w-20 items-end justify-center">
                  {/* Hole */}
                  <div className="absolute bottom-0 h-8 w-20 rounded-full bg-[var(--surface-2)] border border-[var(--border)]" />
                  {/* Mole */}
                  <AnimatePresence>
                    {mole && (
                      <motion.button
                        key={mole.id}
                        animate={{ y: 0 }}
                        className={`absolute bottom-3 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 text-base font-bold shadow-lg transition-colors select-none ${
                          isFlashing
                            ? "border-rose-500 bg-rose-500/20 text-rose-400"
                            : mole.isCorrect && mole.letter === entry.de[nextIdx]
                            ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] shadow-[0_0_16px_rgba(88,230,217,0.4)]"
                            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]"
                        }`}
                        exit={{ y: 60, opacity: 0 }}
                        initial={{ y: 60 }}
                        onClick={() => whack(mole)}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        type="button"
                        whileTap={{ scale: 0.85 }}
                      >
                        {mole.letter}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

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
                    <p className="text-lg font-semibold text-[var(--text-1)]">Whack-a-Mole</p>
                    <p className="max-w-xs text-center text-sm text-[var(--text-3)]">
                      Tap the glowing letter to spell the German word. Hit a wrong letter and it's game over.
                    </p>
                    <button className="accent-btn px-6 py-2.5 text-sm" onClick={newGame} type="button">Start game</button>
                  </>
                )}
                {phase === "won" && (
                  <>
                    <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-5xl">🎉</motion.div>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-[var(--text-1)]">{entry.de}</p>
                      <button
                        aria-label="Hear pronunciation"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-text)] active:scale-95"
                        onClick={() => speakGerman(entry.de.toLowerCase())} type="button"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--text-3)]">{entry.en}</p>
                    <p className="text-xs text-[var(--text-3)]">+{score} points</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={newGame} type="button">
                      <RotateCcw className="h-4 w-4" /> Next word
                    </button>
                  </>
                )}
                {phase === "wrong" && (
                  <>
                    <p className="text-lg font-semibold text-rose-400">Wrong letter!</p>
                    <p className="text-sm text-[var(--text-3)]">
                      You needed <span className="font-bold text-[var(--accent)]">{entry.de[nextIdx]}</span>
                    </p>
                    <p className="text-xs text-[var(--text-3)]">{entry.de} = {entry.en}</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={newGame} type="button">
                      <RotateCcw className="h-4 w-4" /> Try again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-[var(--text-3)]">
          Tap the <span className="font-semibold text-[var(--accent)]">glowing</span> letter · Don't let it escape
        </p>
      </div>
    </div>
  );
}
