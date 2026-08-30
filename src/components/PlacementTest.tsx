import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Gauge, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { allPartBlueprints } from "@/lib/data";
import { normalize } from "@/lib/api";
import { learningEnglish } from "@/lib/direction";
import { courseSides } from "@/lib/courseLanguages";
import { matchFrenchPhrase } from "@/lib/frenchTextMatch";
import { matchPolishPhrase } from "@/lib/polishTextMatch";
import { matchSpanishPhrase } from "@/lib/spanishTextMatch";
import { matchPortuguesePhrase } from "@/lib/portugueseTextMatch";
import { ui, uiFmt } from "@/lib/i18n";

// One word per language per row, so the same ten questions work whichever
// course is being learned. The French is the ordinary dictionary form with its
// article, because that is how the course teaches a noun; Polish has no
// article to carry, so it is the bare dictionary form.
const QUESTIONS = [
  { part: "part1", de: "Haus", en: "House", fr: "la maison", pl: "dom", pt: "a casa", level: "A1" },
  { part: "part2", de: "Bahnhof", en: "Station", fr: "la gare", pl: "dworzec", pt: "a estação", level: "A1" },
  { part: "part3", de: "Arbeit", en: "Work", fr: "le travail", pl: "praca", pt: "o trabalho", level: "A1-A2" },
  { part: "part4", de: "Wochenende", en: "Weekend", fr: "le week-end", pl: "weekend", pt: "o fim de semana", level: "A2" },
  { part: "part6", de: "Straße", en: "Street", fr: "la rue", pl: "ulica", pt: "a rua", level: "A1-A2" },
  { part: "part7", de: "Familie", en: "Family", fr: "la famille", pl: "rodzina", pt: "a família", level: "A1-A2" },
  { part: "part9", de: "Küche", en: "Kitchen", fr: "la cuisine", pl: "kuchnia", pt: "a cozinha", level: "A2" },
  { part: "part10", de: "Plan", en: "Plan", fr: "le plan", pl: "plan", pt: "o plano", level: "A2-B1" },
  { part: "part11", de: "interessant", en: "Interesting", fr: "intéressant", pl: "ciekawy", pt: "interessante", level: "B1" },
  { part: "part12", de: "vergessen", en: "to forget", fr: "oublier", pl: "zapominać", pt: "esquecer", level: "B1" },
];

export function PlacementTest({ onComplete }: { onComplete: (partKey: string) => void }) {
  const [stage, setStage] = useState<"choice" | "questions">("choice");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const current = QUESTIONS[index];
  const progress = ((index + 1) / QUESTIONS.length) * 100;
  const sides = courseSides();
  const learnFr = sides.target.code === "fr";
  const learnPl = sides.target.code === "pl";
  const learnEs = sides.target.code === "es";
  const learnPt = sides.target.code === "pt";
  const reverse = learningEnglish();
  const prompt = learnFr || learnPl || learnPt
    ? (sides.meaning.code === "de" ? current.de : current.en)
    : reverse ? current.de : current.en;
  const target = learnFr ? current.fr : learnPl ? current.pl : learnPt ? current.pt : reverse ? current.en : current.de;
  // A missing accent is a spelling slip in French, and a missing ą or ł is one
  // in Polish — see frenchTextMatch.ts and polishTextMatch.ts. normalize()
  // would mark "la gare" typed as "gare" wrong too, which is why both
  // table-backed courses grade through their own matcher.
  const isRight = (typed: string) => learnFr
    ? matchFrenchPhrase(typed, target).ok
    : learnPl
      ? matchPolishPhrase(typed, target).ok
      : learnEs
      ? matchSpanishPhrase(typed, target).ok
      : learnPt
      ? matchPortuguesePhrase(typed, target).ok
      : normalize(typed) === normalize(target);

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
    recordAnswer(isRight(input));
  };

  useEffect(() => {
    if (input.trim() && isRight(input)) recordAnswer(true);
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
        <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface-2)] p-7 text-[var(--text-1)] shadow-[0_24px_70px_var(--shadow)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 shadow-[inset_0_0_0_1px] shadow-emerald-500/35">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--accent)]">
                {ui("Your starting point")}
              </p>
              <h2 className="mt-1 text-[28px] font-black leading-tight tracking-[-0.025em] text-[var(--text-1)]">
                {uiFmt("Are you completely new to {language}?", { language: ui(sides.target.label) })}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-[15px] font-semibold leading-6 text-[var(--text-3)]">
            {ui("Choose the route that fits you. You can change level later.")}
          </p>

          <div className="mt-7 grid gap-3">
            <button
              className="group flex w-full items-center gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-left transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-emerald-500/16 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 active:translate-y-0"
              onClick={() => onComplete("part1")}
              type="button"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-base font-black text-[var(--text-1)]">{ui("Yes, start from the beginning")}</strong>
                <span className="mt-1 block text-sm font-semibold leading-5 text-[var(--text-2)]">
                  {ui("Begin with greetings, basic questions, numbers, and everyday phrases.")}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[var(--text-2)] transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              className="group flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-left transition-[transform,border-color] hover:-translate-y-0.5 hover:border-[var(--border-2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)]/20 active:translate-y-0"
              onClick={() => setStage("questions")}
              type="button"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-3)] text-[var(--text-2)] shadow-[inset_0_0_0_1px_var(--border)]">
                <Gauge className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-base font-black text-[var(--text-1)]">{ui("No, check my level")}</strong>
                <span className="mt-1 block text-sm font-semibold leading-5 text-[var(--text-3)]">
                  {ui("Answer 10 short questions so Micheon can choose a better starting point.")}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[var(--text-3)] transition-transform group-hover:translate-x-0.5" />
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-7 text-[var(--text-1)] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-text)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">{ui("Starting point")}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text-1)]">{ui("Recommended module")}</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-sm font-semibold text-[var(--accent)]">{ui(blueprint.label)} · {blueprint.level}</p>
            <p className="mt-2 text-xl font-semibold text-[var(--text-1)]">{ui(blueprint.theme)}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">{ui(blueprint.description)}</p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
            <span className="text-sm text-[var(--text-2)]">{ui("Vocabulary check")}</span>
            <span className="text-sm font-semibold text-[var(--text-1)]">{accuracy}%</span>
          </div>

          <Button
            className="mt-6 h-12 w-full rounded-lg bg-[var(--accent)] text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
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
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-7 text-[var(--text-1)] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">{ui("Starting point check")}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-1)]">{uiFmt("Translate to {language}", { language: ui(sides.target.label) })}</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
            <Languages className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-3)]">
            <span>{ui("Question")} {index + 1} {ui("of")} {QUESTIONS.length}</span>
            <span>{current.level}</span>
          </div>
          <Progress value={progress} variant="teal" className="h-1.5" />
        </div>

        <div className="mt-7 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">{uiFmt("{language} prompt", { language: ui(sides.meaning.label) })}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text-1)]">{prompt}</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            className="h-12 rounded-lg border-[var(--border)] bg-[var(--surface)] px-4 text-base font-semibold text-[var(--text-1)] shadow-none placeholder:text-[var(--text-3)] focus-visible:border-[var(--accent)] focus-visible:bg-[var(--surface)] focus-visible:ring-4 focus-visible:ring-[var(--accent)]/15"
            onChange={(event) => setInput(event.target.value)}
            placeholder={uiFmt("Type the {language} word", { language: ui(sides.target.label) })}
            value={input}
          />
          <Button
            className="h-12 w-full rounded-lg bg-[var(--accent)] text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
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
