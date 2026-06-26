import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { allPartBlueprints } from "@/lib/data";
import { normalize } from "@/lib/api";

const QUESTIONS = [
  { part: "part1", de: "Haus", en: "House", level: "A1" },
  { part: "part2", de: "Bahnhof", en: "Station", level: "A1" },
  { part: "part3", de: "Arbeit", en: "Work", level: "A1-A2" },
  { part: "part4", de: "Wochenende", en: "Weekend", level: "A2" },
  { part: "part6", de: "Straße", en: "Street", level: "A1-A2" },
  { part: "part7", de: "Familie", en: "Family", level: "A1-A2" },
  { part: "part9", de: "Küche", en: "Kitchen", level: "A2" },
  { part: "part10", de: "Plan", en: "Plan", level: "A2-B1" },
  { part: "part11", de: "interessant", en: "Interesting", level: "B1" },
  { part: "part12", de: "vergessen", en: "to forget", level: "B1" },
];

export function PlacementTest({ onComplete }: { onComplete: (partKey: string) => void }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const current = QUESTIONS[index];
  const progress = ((index + 1) / QUESTIONS.length) * 100;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isCorrect = normalize(input) === normalize(current.de);
    setAnswers([...answers, isCorrect]);
    setInput("");

    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculatePlacement = () => {
    const correctCount = answers.filter(Boolean).length;
    if (correctCount >= 9) return "part11";
    if (correctCount >= 7) return "part8";
    if (correctCount >= 5) return "part5";
    if (correctCount >= 3) return "part3";
    return "part1";
  };

  if (showResult) {
    const partKey = calculatePlacement();
    const blueprint = allPartBlueprints[partKey];
    const accuracy = Math.round((answers.filter(Boolean).length / QUESTIONS.length) * 100);

    return (
      <motion.div animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg" initial={{ opacity: 0, y: 12 }}>
        <div className="rounded-2xl border border-zinc-200 bg-white p-7 text-zinc-950 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Starting point</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">Recommended module</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-semibold text-teal-800">{blueprint.label} · {blueprint.level}</p>
            <p className="mt-2 text-xl font-semibold text-zinc-950">{blueprint.theme}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{blueprint.description}</p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
            <span className="text-sm text-zinc-600">Vocabulary check</span>
            <span className="text-sm font-semibold text-zinc-950">{accuracy}%</span>
          </div>

          <Button
            className="mt-6 h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
            onClick={() => onComplete(partKey)}
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg" initial={{ opacity: 0, y: 12 }}>
      <div className="rounded-2xl border border-zinc-200 bg-white p-7 text-zinc-950 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Starting point check</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Translate to German</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-teal-700">
            <Languages className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <span>Question {index + 1} of {QUESTIONS.length}</span>
            <span>{current.level}</span>
          </div>
          <Progress value={progress} variant="teal" className="h-1.5" />
        </div>

        <div className="mt-7 rounded-xl border border-zinc-200 bg-zinc-50 p-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">English prompt</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">{current.en}</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            className="h-12 rounded-lg border-zinc-300 bg-white px-4 text-base font-semibold text-zinc-950 shadow-none placeholder:text-zinc-400 focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-teal-700/10"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type the German word"
            value={input}
          />
          <Button
            className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
            disabled={!input.trim()}
            type="submit"
          >
            Check answer
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
