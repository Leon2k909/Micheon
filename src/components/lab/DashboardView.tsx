import React from "react";
import { motion } from "framer-motion";
import { FluencyMeter } from "@/components/FluencyMeter";
import { countKnownVocab } from "@/lib/fluency";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Flame,
  Gamepad2,
  Headphones,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { Part } from "@/lib/types";
import { isBulkPartKey } from "@/lib/contentBank";
import { AnimatedBars } from "@/components/AnimatedBars";

type ProgressStats = {
  totalXp: number;
  sessionsCompleted: number;
  totalReviews: number;
  streak: number;
  externalWords: number;
};

function miniPercent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function ProgressCard({
  progressPercent,
  progressStats,
  nextLessons,
}: {
  progressPercent: number;
  progressStats: ProgressStats;
  nextLessons: Array<[string, Part]>;
}) {
  const wordsTracked = progressStats.totalReviews + progressStats.externalWords;
  const vocab = countKnownVocab(undefined, progressStats.externalWords);
  const nextLesson = nextLessons[0]?.[1];
  const nextLessonTitle = nextLesson?.theme ?? "German conversation basics";
  const sessionsLabel = progressStats.sessionsCompleted === 1 ? "session" : "sessions";

  return (
    <section className="card flex flex-col justify-between overflow-hidden p-5 sm:p-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">Today's German progress</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">Your next useful step, streak, and practice totals.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-bg)] px-3 py-1 text-[11px] font-black text-[var(--success-text)]">
            <Flame className="h-3.5 w-3.5 flame-anim" />
            {progressStats.streak} day
          </span>
        </div>

        <div className="mt-5 grid items-center gap-5 rounded-[26px] bg-[var(--surface-2)] p-5 sm:grid-cols-[150px_minmax(0,1fr)]">
          <div className="flex min-h-[132px] flex-col justify-center border-b border-[var(--border)] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
            <div className="flex items-center gap-2 text-[var(--text-3)]">
              <Target className="h-4 w-4" />
              <span className="text-[10px] font-black">A1-A2 path</span>
            </div>
            <div className="mt-4 flex items-end gap-1.5">
              <span className="text-5xl font-black leading-none tracking-tight text-[var(--text-1)]">{progressPercent}</span>
              <span className="pb-1 text-lg font-black text-[var(--text-1)]">%</span>
            </div>
            <p className="mt-2 text-xs font-bold text-[var(--text-3)]">Course complete</p>
            <div className="mt-4 h-2.5 rounded-full bg-[var(--surface-3)]">
              <div className="h-full rounded-full bg-[var(--yellow)]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-black text-[var(--text-3)]">Next up</p>
            <h3 className="mt-1 truncate text-2xl font-black tracking-tight text-[var(--text-1)]">{nextLessonTitle}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-2)]">
              {nextLesson?.focus ?? "Build the basics you need for everyday German conversations."}
            </p>
            <div className="mt-4 h-3 rounded-full bg-[var(--surface)]">
              <div className="h-full rounded-full bg-[var(--yellow)]" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-black text-[var(--text-2)]">
              <Sparkles className="h-4 w-4 text-[var(--text-3)]" />
              Finish one lesson to move today forward
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <FluencyMeter vocab={vocab} compact />
      </div>
    </section>
  );
}

function CurrentCourseCard({
  currentPart,
  lessonId,
  progressPercent,
  onOpenLesson,
}: {
  currentPart?: Part;
  lessonId: string;
  progressPercent: number;
  onOpenLesson: (partId: string) => void;
}) {
  return (
    <section className="card course-feature-card flex flex-col justify-between p-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="course-feature-pill rounded-full px-3 py-1 text-[11px] font-black">
            {currentPart?.level ?? "A1"}
          </span>
          <span className="course-feature-pill-success rounded-full px-3 py-1 text-[11px] font-black">
            Daily plan
          </span>
        </div>
        <h2 className="course-feature-title mt-4 text-2xl font-black leading-tight tracking-tight">
          {currentPart?.theme ?? "German conversation basics"}
        </h2>
        <p className="course-feature-copy mt-2 max-w-md text-sm leading-6">
          {currentPart?.description ?? "Build useful German for greetings, small talk, travel, and everyday questions."}
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="course-feature-panel rounded-[18px] p-4">
          <p className="course-feature-label text-[11px] font-bold">Current focus</p>
          <p className="course-feature-title mt-2 line-clamp-2 text-sm font-black leading-5">
            {(currentPart?.focus ?? "Listen, speak, type, translate").replace(/\.$/, "")}
          </p>
        </div>
        <div className="course-feature-panel rounded-[18px] p-4">
          <p className="course-feature-label text-[11px] font-bold">Course progress</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="course-feature-progress-track h-4 flex-1 rounded-full">
              <div className="course-feature-progress h-full rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="course-feature-title text-sm font-black">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <button
        className="accent-btn continue-glow mt-6 inline-flex h-12 w-full items-center justify-center gap-2 text-sm"
        onClick={() => onOpenLesson("")}
        type="button"
      >
        {/* No pack id: serve global due reviews + the first pack in
            curriculum order with fresh content — never just the last-visited pack. */}
        Continue learning
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}

function ScheduleCard({
  item,
  index,
  moduleNumber,
  active,
  onOpenLesson,
}: {
  item: [string, Part];
  index: number;
  moduleNumber: number;
  active: boolean;
  onOpenLesson: (partId: string) => void;
}) {
  const [id, part] = item;
  const times = ["10:30 - 12:00", "13:00 - 14:00", "16:00 - 17:00"];
  const styles = [
    { icon: MessageCircle, label: "Speak", accent: "bg-[var(--accent)]", soft: "bg-[var(--accent-dim)] text-[var(--accent)]" },
    { icon: Headphones, label: "Listen", accent: "bg-[var(--mint)]", soft: "bg-[var(--success-bg)] text-[var(--success-text)]" },
    { icon: BookOpen, label: "Review", accent: "bg-[var(--orange)]", soft: "bg-[var(--info-bg)] text-[var(--info-text)]" },
  ];
  const style = styles[index % styles.length];
  const lessonProgress = active ? 64 : index === 1 ? 35 : 18;

  return (
      <button
        className={[
        "group flex min-h-[236px] flex-col overflow-hidden rounded-[22px] p-4 text-left transition-all active:scale-[0.99]",
        active
          ? "lesson-card-active"
          : "bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface)] hover:shadow-[0_14px_34px_var(--shadow)]",
      ].join(" ")}
      onClick={() => onOpenLesson(id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={active ? "text-[11px] font-bold text-white/70" : "text-[11px] font-bold text-[var(--text-3)]"}>
            {times[index] ?? "17:00 - 17:30"}
          </p>
          <h3 className="mt-3 line-clamp-2 text-lg font-black leading-tight">{part.theme}</h3>
        </div>
        <span className={active ? "rounded-full bg-[var(--orange)] px-2 py-1 text-[10px] font-black text-white" : "rounded-full bg-[var(--surface)] px-2 py-1 text-[10px] font-black text-[var(--text-3)]"}>
          {active ? "Now" : `M${moduleNumber}`}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={[
            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-black",
            active ? "bg-white/15 text-white" : "bg-[var(--info-bg)] text-[var(--info-text)]",
          ].join(" ")}
        >
          {part.level}
        </span>
        <span className={active ? "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black text-white" : `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${style.soft}`}>
          <style.icon className="h-3.5 w-3.5" />
          {style.label}
        </span>
      </div>

      <p className={active ? "mt-4 line-clamp-2 text-sm font-semibold leading-5 text-white/78" : "mt-4 line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-2)]"}>
        {(part.focus || part.description || "Build practical German you can use today.").replace(/\.$/, "")}
      </p>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={active ? "flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--accent)]" : `flex h-10 w-10 items-center justify-center rounded-full ${style.accent} text-white`}>
              <style.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black">{active ? "Start daily lesson" : "Queued lesson"}</p>
              <p className={active ? "text-[11px] text-white/70" : "text-[11px] text-[var(--text-3)]"}>{Math.max(6, part.vocab.length)} words inside</p>
            </div>
          </div>
          <ArrowRight className={active ? "h-4 w-4 text-white/80" : "h-4 w-4 text-[var(--text-3)] transition-transform group-hover:translate-x-0.5"} />
        </div>

        <div className={active ? "mt-4 h-2 rounded-full bg-white/18" : "mt-4 h-2 rounded-full bg-[var(--surface)]"}>
          <div
            className={active ? "h-full rounded-full bg-white" : "h-full rounded-full bg-[var(--yellow)]"}
            style={{ width: `${lessonProgress}%` }}
          />
        </div>
      </div>
    </button>
  );
}

export function DashboardView({
  currentPart,
  onOpenLesson,
  pathParts,
  progressStats,
  gameMasteryCount = 0,
  setActiveTab,
  activePart,
}: {
  currentPart?: Part;
  onOpenLesson: (partId: string) => void;
  pathParts: Array<[string, Part]>;
  progressStats: ProgressStats;
  gameMasteryCount?: number;
  setActiveTab: (tab: string) => void;
  activePart?: string;
}) {
  const lessonId = activePart ?? pathParts[0]?.[0] ?? "part1";
  const activeIndex = Math.max(0, pathParts.findIndex(([key]) => key === lessonId));
  const coreParts = pathParts.filter(([key]) => !isBulkPartKey(key));
  const wordBankParts = pathParts.filter(([key]) => isBulkPartKey(key));
  const totalWords = pathParts.reduce((sum, [, part]) => sum + part.vocab.length, 0);
  const wordBankWords = wordBankParts.reduce((sum, [, part]) => sum + part.vocab.length, 0);
  const coreActiveIndex = Math.max(0, coreParts.findIndex(([key]) => key === lessonId));
  const progressPercent = Math.max(
    8,
    miniPercent(coreActiveIndex, Math.max(1, coreParts.length - 1))
  );
  const scheduleItems = pathParts.slice(activeIndex, activeIndex + 3);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="grid items-start gap-4 md:grid-cols-2"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      <CurrentCourseCard
        currentPart={currentPart}
        lessonId={lessonId}
        onOpenLesson={onOpenLesson}
        progressPercent={progressPercent}
      />
      <ProgressCard nextLessons={scheduleItems} progressPercent={progressPercent} progressStats={progressStats} />

      <section className="card p-5 sm:p-6 md:col-span-2">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[var(--text-1)]">My schedule</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                {totalWords.toLocaleString()} words available, including {wordBankWords.toLocaleString()} from the word bank.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-2 text-xs font-bold text-[var(--text-2)]">
                <Target className="h-4 w-4 text-[var(--text-3)]" />
                <span className="font-black text-[var(--text-1)]">Daily target:</span>
                <span>1 lesson + 5 words</span>
              </div>
            </div>
          <div className="flex flex-wrap items-start gap-2 lg:justify-end">
            <button className="ghost-btn h-11 px-4 text-xs" onClick={() => setActiveTab("learn")} type="button">
              All lessons
            </button>
            <button className="ghost-btn h-11 px-4 text-xs" onClick={() => setActiveTab("games")} type="button">
              Practice
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {scheduleItems.map((item, index) => (
            <ScheduleCard
              active={item[0] === lessonId}
              index={index}
              item={item}
              key={item[0]}
              moduleNumber={activeIndex + index + 1}
              onOpenLesson={onOpenLesson}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:col-span-2 md:grid-cols-3">
        {[
          { icon: Target, label: "Conversation basics", value: `${coreParts.length} modules`, tab: "learn" },
          { icon: BarChart3, label: "Reviews completed", value: progressStats.totalReviews.toLocaleString(), tab: "profile" },
          { icon: Gamepad2, label: "Practice mastery", value: gameMasteryCount.toLocaleString(), tab: "games" },
        ].map((item) => (
          <button
            className="card card-hover eq-host flex items-center gap-4 p-5 text-left"
            key={item.label}
            onClick={() => setActiveTab(item.tab)}
            type="button"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)]">
              {item.icon === BarChart3 ? <AnimatedBars className="h-5 w-5" /> : <item.icon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-[var(--text-1)]">{item.label}</p>
              <p className="text-xs font-semibold text-[var(--text-3)]">{item.value}</p>
            </div>
            <Play className="h-4 w-4 text-[var(--text-3)]" />
          </button>
        ))}
      </section>
    </motion.div>
  );
}
