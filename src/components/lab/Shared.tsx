import React, { useId } from "react";
import { motion } from "framer-motion";
import { Headphones, MessageSquare, Mic2, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

export const DAILY_GOAL = 50;

const AVATARS = ["Lina", "Max", "Noah", "Mia"];
const AVATAR_BG = ["#1e3a5f", "#1a3d3a", "#3d2a1a", "#2a1a3d"];

export function initialsFromName(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function InitialAvatar({ name, index = 0, className }: { name: string; index?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center rounded-full text-xs font-semibold text-white", className)}
      style={{ background: AVATAR_BG[index % AVATAR_BG.length] }}
    >
      {initialsFromName(name)}
    </div>
  );
}

export function StudentsOnline() {
  return (
    <div className="hidden items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 md:flex">
      <div className="flex -space-x-2">
        {AVATARS.map((name, i) => (
          <InitialAvatar
            key={name}
            className="h-6 w-6 text-[10px] ring-2 ring-[var(--bg)]"
            index={i}
            name={name}
          />
        ))}
      </div>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#58e6d9] opacity-75" style={{ animation: "ping-slow 2s ease-in-out infinite" }} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#58e6d9]" />
      </span>
      <span className="text-xs font-medium text-[var(--text-2)]">1,284 online</span>
    </div>
  );
}

export function DailyGoalChip({ completed }: { completed: number }) {
  const id = useId();
  const clamped = Math.min(DAILY_GOAL, completed);
  const pct = Math.min(100, Math.round((clamped / DAILY_GOAL) * 100));
  const r = 11;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
      <div className="relative h-7 w-7">
        <svg className="-rotate-90" height="28" width="28" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#58e6d9" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <circle cx="14" cy="14" fill="none" r={r} stroke="#2a2a2e" strokeWidth="2" />
          <motion.circle
            animate={{ strokeDashoffset: offset }}
            cx="14" cy="14" fill="none"
            initial={{ strokeDashoffset: circ }}
            r={r}
            stroke={`url(#${id})`}
            strokeDasharray={circ}
            strokeLinecap="round"
            strokeWidth="2"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
      <div>
        <p className="text-[10px] text-[var(--text-3)]">Daily goal</p>
        <p className="text-xs font-semibold text-[var(--text-1)]">{clamped}/{DAILY_GOAL}</p>
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { id: "speak",  label: "Speak",      caption: "Shadow phrases",  icon: Mic2 },
  { id: "ai",     label: "AI Chat",    caption: "Conversation",    icon: MessageSquare },
  { id: "srs",    label: "Review",     caption: "Spaced recall",   icon: Repeat },
  { id: "listen", label: "Listen",     caption: "Train your ear",  icon: Headphones },
];

export function QuickActionDock({ onStartSession }: { onStartSession: (type: string) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center">
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-1 rounded-2xl bg-[var(--surface)] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        initial={{ y: 10, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {QUICK_ACTIONS.map((a) => (
          <motion.button
            key={a.id}
            aria-label={a.label}
            className="group flex items-center gap-2.5 rounded-xl px-4 py-2 text-[var(--text-2)] transition-all duration-150 hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
            onClick={() => onStartSession(a.id)}
            type="button"
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
              <a.icon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-medium">{a.label}</p>
              <p className="text-[10px] text-[var(--text-3)]">{a.caption}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export function AppLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-lg space-y-4 p-8">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[0,1,2].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
      </div>
    </div>
  );
}
