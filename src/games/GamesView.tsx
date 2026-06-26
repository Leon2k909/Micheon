import React, { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Blocks,
  Bug,
  ChevronLeft,
  CircleDot,
  Crosshair,
  Gamepad2,
  Grid3X3,
  Search,
  Target,
  X,
} from "lucide-react";
import { MasteryCard } from "@/components/lab/MasteryCard";

const SnakeGame = lazy(() => import("@/games/SnakeGame"));
const FallingLetters = lazy(() => import("@/games/FallingLetters"));
const WhackAMole = lazy(() => import("@/games/WhackAMole"));
const VerbShooter = lazy(() => import("@/games/VerbShooter"));
const VocabMinesweeper = lazy(() => import("@/games/VocabMinesweeper"));
const VocabSlither = lazy(() => import("@/games/VocabSlither"));
const HoleGame = lazy(() => import("@/games/HoleGame"));

const GAMES = [
  {
    id: "snake",
    title: "Word Snake",
    description: "Steer through letters in order and spell useful German words.",
    icon: CircleDot,
    component: SnakeGame,
  },
  {
    id: "falling",
    title: "Falling Letters",
    description: "Catch the correct letters before they leave the screen.",
    icon: Target,
    component: FallingLetters,
  },
  {
    id: "whack",
    title: "Letter Tap",
    description: "Tap the right letter quickly to train visual recall.",
    icon: Crosshair,
    component: WhackAMole,
  },
  {
    id: "verbs",
    title: "Verb Shooter",
    description: "Choose the correct conjugation before time runs out.",
    icon: Gamepad2,
    component: VerbShooter,
  },
  {
    id: "minesweeper",
    title: "Vocab Minesweeper",
    description: "Translate carefully to reveal cells and avoid wrong picks.",
    icon: Grid3X3,
    component: VocabMinesweeper,
  },
  {
    id: "slither",
    title: "Vocab Slither",
    description: "Match the target word while keeping the run alive.",
    icon: Bug,
    component: VocabSlither,
  },
  {
    id: "hole",
    title: "Object Collector",
    description: "Collect objects and learn their German names as you grow.",
    icon: Blocks,
    component: HoleGame,
  },
];

export function GamesView({ totalReviews = 0, externalWords = 0, gameMasteryCount = 0 }: {
  totalReviews?: number;
  externalWords?: number;
  gameMasteryCount?: number;
}) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = GAMES.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const game = GAMES.find((item) => item.id === activeGame);

  return (
    <AnimatePresence mode="wait">
      {game ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 8 }}
          key={game.id}
          transition={{ duration: 0.18 }}
        >
          <button
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-black text-[var(--text-2)] shadow-[0_10px_25px_rgba(32,34,49,0.06)] ring-1 ring-[var(--border)] transition-colors hover:text-[var(--text-1)]"
            onClick={() => setActiveGame(null)}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
            Practice library
          </button>
          <Suspense
            fallback={
              <div className="card flex min-h-[360px] items-center justify-center p-8 text-center">
                <div>
                  <div className="mx-auto h-14 w-14 rounded-2xl skeleton" />
                  <p className="mt-4 text-sm font-black text-[var(--text-1)]">Loading practice game</p>
                </div>
              </div>
            }
          >
            <game.component />
          </Suspense>
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 8 }}
          key="grid"
          transition={{ duration: 0.18 }}
        >
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="card p-5 sm:p-6">
              <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">Practice library</h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-[var(--text-2)]">
                Short games for spelling, recall, verbs, and quick recognition. Pick one and jump straight in.
              </p>
              <div className="relative mt-6">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
                <input
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-11 text-sm font-bold text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:bg-white"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search practice games"
                  type="text"
                  value={searchQuery}
                />
                {searchQuery && (
                  <button
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--text-3)]"
                    onClick={() => setSearchQuery("")}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </section>
            <MasteryCard
              externalWords={externalWords}
              gameMasteryCount={gameMasteryCount}
              totalReviews={totalReviews}
            />
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredGames.map((item) => (
              <motion.button
                className="card card-hover group min-h-[176px] p-5 text-left"
                key={item.id}
                onClick={() => setActiveGame(item.id)}
                type="button"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-3)]">
                    Play
                  </span>
                </div>
                <p className="mt-6 text-lg font-black tracking-tight text-[var(--text-1)]">{item.title}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-3)]">{item.description}</p>
              </motion.button>
            ))}
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
