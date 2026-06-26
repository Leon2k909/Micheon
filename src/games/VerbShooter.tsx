import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Volume2 } from "lucide-react";
import { speakGerman } from "@/lib/tts";
import { recordWordMastery } from "@/lib/mastery";

// ── Verb conjugation data ─────────────────────────────────────
const VERBS: { infinitive: string; en: string; pronoun: string; correct: string; wrong: string[] }[] = [
  { infinitive: "sein",   en: "to be",   pronoun: "ich",  correct: "bin",   wrong: ["ist", "sind", "bist"] },
  { infinitive: "sein",   en: "to be",   pronoun: "du",   correct: "bist",  wrong: ["bin", "ist", "seid"] },
  { infinitive: "sein",   en: "to be",   pronoun: "er",   correct: "ist",   wrong: ["bin", "bist", "sind"] },
  { infinitive: "sein",   en: "to be",   pronoun: "wir",  correct: "sind",  wrong: ["bin", "ist", "seid"] },
  { infinitive: "haben",  en: "to have", pronoun: "ich",  correct: "habe",  wrong: ["hat", "haben", "hast"] },
  { infinitive: "haben",  en: "to have", pronoun: "du",   correct: "hast",  wrong: ["habe", "hat", "habt"] },
  { infinitive: "haben",  en: "to have", pronoun: "er",   correct: "hat",   wrong: ["habe", "hast", "haben"] },
  { infinitive: "haben",  en: "to have", pronoun: "wir",  correct: "haben", wrong: ["habe", "hat", "habt"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "ich",  correct: "gehe",  wrong: ["geht", "gehen", "gehst"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "du",   correct: "gehst", wrong: ["gehe", "geht", "gehen"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "er",   correct: "geht",  wrong: ["gehe", "gehst", "gehen"] },
  { infinitive: "gehen",  en: "to go",   pronoun: "wir",  correct: "gehen", wrong: ["gehe", "geht", "geht"] },
  { infinitive: "machen", en: "to do",   pronoun: "ich",  correct: "mache", wrong: ["macht", "machst", "machen"] },
  { infinitive: "machen", en: "to do",   pronoun: "du",   correct: "machst",wrong: ["mache", "macht", "machen"] },
  { infinitive: "machen", en: "to do",   pronoun: "er",   correct: "macht", wrong: ["mache", "machst", "machen"] },
  { infinitive: "kommen", en: "to come", pronoun: "ich",  correct: "komme", wrong: ["kommt", "kommst", "kommen"] },
  { infinitive: "kommen", en: "to come", pronoun: "du",   correct: "kommst",wrong: ["komme", "kommt", "kommen"] },
  { infinitive: "kommen", en: "to come", pronoun: "er",   correct: "kommt", wrong: ["komme", "kommst", "kommen"] },
  { infinitive: "sehen",  en: "to see",  pronoun: "ich",  correct: "sehe",  wrong: ["sieht", "siehst", "sehen"] },
  { infinitive: "sehen",  en: "to see",  pronoun: "du",   correct: "siehst",wrong: ["sehe", "sieht", "sehen"] },
  { infinitive: "sehen",  en: "to see",  pronoun: "er",   correct: "sieht", wrong: ["sehe", "siehst", "sehen"] },
  { infinitive: "wissen", en: "to know", pronoun: "ich",  correct: "weiß",  wrong: ["wissen", "weißt", "weiß"] },
  { infinitive: "wissen", en: "to know", pronoun: "du",   correct: "weißt", wrong: ["weiß", "wissen", "wisst"] },
  { infinitive: "wissen", en: "to know", pronoun: "er",   correct: "weiß",  wrong: ["weißt", "wissen", "wisst"] },
];

const COLS = 5;
const CELL_W = 90;
const W = COLS * CELL_W;
const H = 420;
const ROWS = Math.floor(H / 52);

interface Invader {
  id: number;
  col: number;
  row: number; // fractional
  text: string;
  isCorrect: boolean;
  hit: boolean;
}

interface Bullet {
  id: number;
  col: number;
  row: number;
}

let invId = 0;
let bulletId = 0;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickVerb() {
  return VERBS[Math.floor(Math.random() * VERBS.length)];
}

export default function VerbShooter() {
  const [verb, setVerb] = useState(() => pickVerb());
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [cannonCol, setCannonCol] = useState(Math.floor(COLS / 2));
  const [phase, setPhase] = useState<"idle" | "playing" | "won" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("verbshooter-hs") ?? "0", 10); } catch { return 0; }
  });
  const [wrongFlash, setWrongFlash] = useState(false);
  const [streak, setStreak] = useState(0);

  const stateRef = useRef({ invaders, bullets, cannonCol, verb, phase, score, streak });
  useEffect(() => { stateRef.current = { invaders, bullets, cannonCol, verb, phase, score, streak }; });

  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnWave = useCallback((v: typeof verb) => {
    const options = shuffle([v.correct, ...v.wrong.slice(0, 3)]);
    const cols = shuffle([0, 1, 2, 3, 4]).slice(0, options.length);
    setInvaders(options.map((text, i) => ({
      id: invId++,
      col: cols[i],
      row: 0,
      text,
      isCorrect: text === v.correct,
      hit: false,
    })));
  }, []);

  const nextRound = useCallback(() => {
    const v = pickVerb();
    setVerb(v);
    setBullets([]);
    spawnWave(v);
  }, [spawnWave]);

  const newGame = useCallback(() => {
    const v = pickVerb();
    setVerb(v);
    setScore(0);
    setStreak(0);
    setCannonCol(Math.floor(COLS / 2));
    setBullets([]);
    setPhase("playing");
    spawnWave(v);
  }, [spawnWave]);

  // Fall + bullet loop
  useEffect(() => {
    if (phase !== "playing") { clearInterval(loopRef.current!); return; }
    loopRef.current = setInterval(() => {
      const { invaders, bullets, verb, score, streak } = stateRef.current;
      const speed = 0.06 + Math.min(streak * 0.008, 0.12);

      // Move invaders
      let gameOver = false;
      const newInvaders = invaders
        .filter(inv => !inv.hit)
        .map(inv => {
          const newRow = inv.row + speed;
          if (newRow >= ROWS - 1) {
            if (inv.isCorrect) gameOver = true; // correct answer reached bottom
            return { ...inv, row: newRow, hit: true }; // remove it
          }
          return { ...inv, row: newRow };
        })
        .filter(inv => !inv.hit || inv.row < ROWS - 1);

      // Move bullets up
      const newBullets = bullets
        .map(b => ({ ...b, row: b.row - 0.8 }))
        .filter(b => b.row > 0);

      // Collision detection
      let newScore = score;
      let newStreak = streak;
      let won = false;
      const survivingInvaders: Invader[] = [];
      const survivingBullets: Bullet[] = [...newBullets];

      for (const inv of newInvaders) {
        let hit = false;
        for (let bi = survivingBullets.length - 1; bi >= 0; bi--) {
          const b = survivingBullets[bi];
          if (b.col === inv.col && Math.abs(b.row - inv.row) < 1.2) {
            survivingBullets.splice(bi, 1);
            hit = true;
            if (inv.isCorrect) {
              newScore += 25 + newStreak * 5;
              newStreak++;
              won = true;
            } else {
              // Shot wrong answer — game over
              gameOver = true;
            }
            break;
          }
        }
        if (!hit) survivingInvaders.push(inv);
      }

      if (gameOver) {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 400);
        setPhase("wrong");
        return;
      }

      setInvaders(survivingInvaders);
      setBullets(survivingBullets);
      setScore(newScore);
      setStreak(newStreak);

      if (won) {
        if (newScore > highScore) {
          setHighScore(newScore);
          try { localStorage.setItem("verbshooter-hs", String(newScore)); } catch {}
        }
        setTimeout(() => speakGerman(`${verb.pronoun} ${verb.correct}`), 200);
        recordWordMastery(verb.correct);
        // Brief pause then next round
        setTimeout(() => {
          if (stateRef.current.phase === "playing") nextRound();
        }, 800);
      }
    }, 50);
    return () => clearInterval(loopRef.current!);
  }, [phase, highScore, nextRound]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); setCannonCol(c => Math.max(0, c - 1)); }
      if (e.key === "ArrowRight") { e.preventDefault(); setCannonCol(c => Math.min(COLS - 1, c + 1)); }
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        const { cannonCol, invaders } = stateRef.current;
        // Only fire if no bullet already in that col
        setBullets(prev => {
          if (prev.some(b => b.col === cannonCol)) return prev;
          return [...prev, { id: bulletId++, col: cannonCol, row: ROWS - 2 }];
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  const fire = () => {
    if (phase !== "playing") return;
    const { cannonCol } = stateRef.current;
    setBullets(prev => {
      if (prev.some(b => b.col === cannonCol)) return prev;
      return [...prev, { id: bulletId++, col: cannonCol, row: ROWS - 2 }];
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-1)]">Verb Shooter</h2>
        <p className="mt-0.5 text-sm text-[var(--text-3)]">
          Shoot the correct conjugation before it reaches you.
        </p>
      </div>

      {/* Prompt card */}
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs text-[var(--text-3)]">Complete the sentence</p>
          <p className="mt-1 text-xl font-bold text-[var(--text-1)]">
            <span className="text-[var(--accent)]">{verb.pronoun}</span>{" "}
            <span className="rounded border border-dashed border-[var(--border)] px-3 py-0.5 text-[var(--text-3)]">???</span>
          </p>
          <p className="mt-1 text-xs text-[var(--text-3)]">
            {verb.pronoun} ___ ({verb.en} · {verb.infinitive})
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[var(--text-3)]">Score</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{score}</p>
          </div>
          {streak > 1 && (
            <div className="text-center">
              <p className="text-xs text-[var(--text-3)]">Streak</p>
              <p className="text-2xl font-bold text-amber-400">×{streak}</p>
            </div>
          )}
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
          className={`relative overflow-hidden rounded-2xl border transition-all ${
            wrongFlash ? "border-rose-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]" : "border-[var(--border)]"
          }`}
          style={{ width: W, height: H, background: "var(--surface)", maxWidth: "100%" }}
        >
          {/* Grid lines */}
          <svg className="pointer-events-none absolute inset-0 opacity-[0.04]" width={W} height={H}>
            {Array.from({ length: COLS + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * CELL_W} y1={0} x2={i * CELL_W} y2={H} stroke="currentColor" />
            ))}
          </svg>

          {/* Invaders */}
          {invaders.map(inv => (
            <div
              key={inv.id}
              className={`absolute flex items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
                inv.isCorrect
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)] shadow-[0_0_10px_rgba(88,230,217,0.3)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]"
              }`}
              style={{
                left: inv.col * CELL_W + 6,
                top: inv.row * 52,
                width: CELL_W - 12,
                height: 40,
              }}
            >
              {inv.text}
            </div>
          ))}

          {/* Bullets */}
          {bullets.map(b => (
            <div
              key={b.id}
              className="absolute rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(88,230,217,0.6)]"
              style={{
                left: b.col * CELL_W + CELL_W / 2 - 3,
                top: b.row * 52,
                width: 6,
                height: 16,
              }}
            />
          ))}

          {/* Cannon */}
          {phase === "playing" && (
            <motion.div
              animate={{ left: cannonCol * CELL_W + CELL_W / 2 - 18 }}
              className="absolute bottom-3 flex h-10 w-9 flex-col items-center justify-end"
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
            >
              <div className="h-6 w-4 rounded-t-full bg-[var(--accent)]" />
              <div className="h-4 w-9 rounded-lg bg-[var(--accent)]/70" />
            </motion.div>
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
                    <p className="text-lg font-semibold text-[var(--text-1)]">Verb Shooter</p>
                    <p className="max-w-xs text-center text-sm text-[var(--text-3)]">
                      Move with ← → and shoot with Space. Hit the correct conjugation. Wrong answer = game over.
                    </p>
                    <button className="accent-btn px-6 py-2.5 text-sm" onClick={newGame} type="button">Start game</button>
                  </>
                )}
                {phase === "wrong" && (
                  <>
                    <p className="text-lg font-semibold text-rose-400">Wrong!</p>
                    <p className="text-sm text-[var(--text-3)]">
                      <span className="font-bold text-[var(--text-1)]">{verb.pronoun}</span>{" "}
                      <span className="font-bold text-[var(--accent)]">{verb.correct}</span>
                    </p>
                    <p className="text-xs text-[var(--text-3)]">{verb.pronoun} {verb.correct} = {verb.pronoun} {verb.en}</p>
                    <button className="accent-btn flex items-center gap-2 px-6 py-2.5 text-sm" onClick={newGame} type="button">
                      <RotateCcw className="h-4 w-4" /> Try again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile controls */}
        <div className="flex gap-3 lg:hidden">
          {(["←", "🔫", "→"] as const).map((label, i) => (
            <button
              key={i}
              className="flex h-12 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] active:bg-[var(--accent-dim)] active:text-[var(--accent)]"
              onPointerDown={() => {
                if (i === 0) setCannonCol(c => Math.max(0, c - 1));
                else if (i === 2) setCannonCol(c => Math.min(COLS - 1, c + 1));
                else fire();
              }}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--text-3)]">
          ← → to move · Space to shoot · Hit the <span className="font-semibold text-[var(--accent)]">correct</span> conjugation
        </p>
      </div>
    </div>
  );
}
