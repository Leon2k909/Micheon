import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Gauge, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { allPartBlueprints } from "@/lib/data";
import { normalize } from "@/lib/api";
import { learningEnglish } from "@/lib/direction";
import { ui } from "@/lib/i18n";

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
  const [stage, setStage] = useState<"choice" | "questions">("choice");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const current = QUESTIONS[index];
  const progress = ((index + 1) / QUESTIONS.length) * 100;
  const reverse = learningEnglish();
  const prompt = reverse ? current.de : current.en;
  const target = reverse ? current.en : current.de;

  const recordAnswer = (isCorrect: boolean) => {
    setAnswers([...answers, isCorrect]);
    setInput("");

    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    recordAnswer(normalize(input) === normalize(target));
  };

  useEffect(() => {
    if (input.trim() && normalize(input) === normalize(target)) recordAnswer(true);
    // The answer transition intentionally owns the current question snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const calculatePlacement = () => {
    const correctCount = answers.filter(Boolean).length;
    if (correctCount >= 9) return "part11";
    if (correctCount >= 7) return "part8";
    if (correctCount >= 5) return "part5";
    if (correctCount >= 3) return "part3";
    return "part1";
  };

  if (stage === "choice") {
    return (
      <motion.div animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl" initial={{ opacity: 0, y: 12 }}>
        <div className="rounded-[26px] border border-[#dcd8ce] bg-[#fffdf8] p-7 text-zinc-950 shadow-[0_24px_70px_rgba(82,68,53,0.14)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f8e5] text-[#218c36] shadow-[inset_0_0_0_1px_#b9e3b7]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#2a8e3d]">
                {ui("Your starting point")}
              </p>
              <h2 className="mt-1 text-[28px] font-black leading-tight tracking-[-0.025em] text-[#24211f]">
                {ui(reverse ? "Are you completely new to English?" : "Are you completely new to German?")}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-[15px] font-semibold leading-6 text-[#68625c]">
            {ui("Choose the route that fits you. You can change level later.")}
          </p>

          <div className="mt-7 grid gap-3">
            <button
              className="group flex w-full items-center gap-4 rounded-2xl border border-[#8fd49a] bg-[#eefbea] px-5 py-4 text-left shadow-[0_4px_0_#b7dfb8] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#e5f8df] hover:shadow-[0_6px_0_#afd8b1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2fb344]/25 active:translate-y-0 active:shadow-[0_2px_0_#afd8b1]"
              onClick={() => onComplete("part1")}
              type="button"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2fb344] text-white shadow-[0_3px_0_#238c34]">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-base font-black text-[#1f5329]">{ui("Yes, start from the beginning")}</strong>
                <span className="mt-1 block text-sm font-semibold leading-5 text-[#52705a]">
                  {ui("Begin with greetings, basic questions, numbers, and everyday phrases.")}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#268f39] transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              className="group flex w-full items-center gap-4 rounded-2xl border border-[#ded9cf] bg-white px-5 py-4 text-left shadow-[0_4px_0_#e5e0d7] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-[#b8cdb9] hover:shadow-[0_6px_0_#dfdbd3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2fb344]/20 active:translate-y-0 active:shadow-[0_2px_0_#dfdbd3]"
              onClick={() => setStage("questions")}
              type="button"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3f1eb] text-[#59544e] shadow-[inset_0_0_0_1px_#ded9cf]">
                <Gauge className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-base font-black text-[#2b2825]">{ui("No, check my level")}</strong>
                <span className="mt-1 block text-sm font-semibold leading-5 text-[#6c665f]">
                  {ui("Answer 10 short questions so Micheon can choose a better starting point.")}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#777169] transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{ui("Starting point")}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{ui("Recommended module")}</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-semibold text-teal-800">{ui(blueprint.label)} · {blueprint.level}</p>
            <p className="mt-2 text-xl font-semibold text-zinc-950">{ui(blueprint.theme)}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{ui(blueprint.description)}</p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
            <span className="text-sm text-zinc-600">{ui("Vocabulary check")}</span>
            <span className="text-sm font-semibold text-zinc-950">{accuracy}%</span>
          </div>

          <Button
            className="mt-6 h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
            onClick={() => onComplete(partKey)}
          >
            {ui("Continue")}
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{ui("Starting point check")}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{ui(reverse ? "Translate to English" : "Translate to German")}</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-teal-700">
            <Languages className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <span>{ui("Question")} {index + 1} {ui("of")} {QUESTIONS.length}</span>
            <span>{current.level}</span>
          </div>
          <Progress value={progress} variant="teal" className="h-1.5" />
        </div>

        <div className="mt-7 rounded-xl border border-zinc-200 bg-zinc-50 p-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{ui(reverse ? "German prompt" : "English prompt")}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">{prompt}</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            className="h-12 rounded-lg border-zinc-300 bg-white px-4 text-base font-semibold text-zinc-950 shadow-none placeholder:text-zinc-400 focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-teal-700/10"
            onChange={(event) => setInput(event.target.value)}
            placeholder={ui(reverse ? "Type the English word" : "Type the German word")}
            value={input}
          />
          <Button
            className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
            disabled={!input.trim()}
            type="submit"
          >
            {ui("Check answer")}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
