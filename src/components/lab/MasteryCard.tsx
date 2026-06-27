import React, { useId, useEffect } from "react";
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { VOCAB_MILESTONES } from "@/lib/data";
import { effectsReduced } from "@/lib/effects";

const VOCAB_TARGET = 16000;

function Ring({ value, size = 100, stroke = 8 }: { value: number; size?: number; stroke?: number }) {
  const id = useId();
  const reduce = useReducedMotion() || effectsReduced();
  const r = (size - stroke) / 2;
  const circ = r * 2 * Math.PI;
  const dotR = stroke * 0.6;
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  // One animated value drives everything (number, arc fill, tip bead) in lockstep.
  const mv = useMotionValue(reduce ? value : 0);
  useEffect(() => {
    if (reduce) { mv.set(value); return; }
    const controls = animate(mv, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce]);

  const pctText = useTransform(mv, (v) => Math.round(v));
  const dashOffset = useTransform(mv, (v) => circ - (clamp(v) / 100) * circ);
  const dotCx = useTransform(mv, (v) => size / 2 + r * Math.cos((clamp(v) / 100) * 2 * Math.PI));
  const dotCy = useTransform(mv, (v) => size / 2 + r * Math.sin((clamp(v) / 100) * 2 * Math.PI));

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg aria-hidden="true" className="absolute inset-0 -rotate-90" height={size} width={size} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={id} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#7834f7" />
            <stop offset="55%" stopColor="#b06bff" />
            <stop offset="100%" stopColor="#ffd233" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle cx={size / 2} cy={size / 2} fill="none" r={r} stroke="var(--border)" strokeWidth={stroke} strokeOpacity={0.7} />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} fill="none"
          r={r} stroke={`url(#${id})`}
          strokeDasharray={circ} strokeLinecap="round" strokeWidth={stroke}
          style={{
            strokeDashoffset: dashOffset,
            filter: "drop-shadow(0 0 5px rgba(255,210,51,0.5)) drop-shadow(0 0 11px rgba(120,52,247,0.4))",
          }}
        />

        {/* Glowing tip bead with a breathing sonar-pulse halo */}
        {value > 0 && (
          <>
            <motion.circle
              cx={dotCx} cy={dotCy} fill="rgba(255,210,51,0.45)"
              animate={reduce ? { r: dotR * 1.6, opacity: 0.4 } : { r: [dotR * 1.1, dotR * 2.8], opacity: [0.55, 0] }}
              transition={reduce ? {} : { duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.circle
              cx={dotCx} cy={dotCy} r={dotR} fill="#fff3c4" stroke="#ffd233" strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 0 6px rgba(255,210,51,0.9))" }}
            />
          </>
        )}
      </svg>

      <div className="relative flex flex-col items-center">
        <span className="text-xl font-black tracking-tight text-[var(--text-1)]">
          <motion.span>{pctText}</motion.span>%
        </span>
        <span className="text-[10px] font-semibold text-[var(--text-3)]">mastered</span>
      </div>
    </div>
  );
}

export function MasteryCard({ totalReviews, externalWords, gameMasteryCount = 0 }: {
  totalReviews: number;
  externalWords: number;
  gameMasteryCount?: number;
}) {
  const mastered = totalReviews + externalWords + gameMasteryCount;
  const vocabPct = Math.min(100, Math.round((mastered / VOCAB_TARGET) * 100));
  const nextMilestone = VOCAB_MILESTONES.find((m) => mastered < m.value);
  const currentMilestone = [...VOCAB_MILESTONES].reverse().find((m) => mastered >= m.value);

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-[var(--text-1)]">Vocabulary mastery</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[var(--text-1)]">
            {mastered.toLocaleString()}
            <span className="text-base font-bold text-[var(--text-3)]"> / {VOCAB_TARGET.toLocaleString()}</span>
          </p>

          {/* Current level badge */}
          {currentMilestone && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: currentMilestone.color }} />
              <span className="text-xs font-medium" style={{ color: currentMilestone.color }}>
                {currentMilestone.label}
              </span>
              <span className="text-xs text-[var(--text-3)]">({currentMilestone.level})</span>
            </div>
          )}

          {/* Next milestone */}
          {nextMilestone && (
            <p className="mt-1 text-xs text-[var(--text-3)]">
              <span className="text-[var(--text-2)]">{nextMilestone.value - mastered} words</span> to{" "}
              <span className="font-medium" style={{ color: nextMilestone.color }}>{nextMilestone.label}</span>
              {" "} {nextMilestone.detail}
            </p>
          )}
        </div>
        <Ring value={vocabPct} size={100} stroke={8} />
      </div>

      {/* Progress bar with milestone ticks */}
      <div className="mt-4">
        <div className="relative h-3 w-full overflow-visible rounded-full bg-[var(--surface-2)]">
          {/* Fill */}
          <motion.div
            animate={{ width: `${vocabPct}%` }}
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--yellow)]"
            initial={{ width: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Milestone ticks */}
          {VOCAB_MILESTONES.slice(0, -1).map((m) => {
            const pct = (m.value / VOCAB_TARGET) * 100;
            const reached = mastered >= m.value;
            return (
              <div
                key={m.value}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pct}%` }}
              >
                <div
                  className="h-3.5 w-0.5 rounded-full"
                  style={{ background: reached ? m.color : "var(--border-2)" }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-[var(--text-3)]">
          <span>{mastered.toLocaleString()} learned</span>
          <span>{(VOCAB_TARGET - mastered).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Milestone ladder */}
      <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
        {VOCAB_MILESTONES.map((m) => {
          const reached = mastered >= m.value;
          const isNext = m === nextMilestone;
          return (
            <div
              key={m.value}
              className={`rounded-lg border px-2 py-2 text-center transition-all ${
                reached
                  ? "border-transparent bg-[var(--surface-2)]"
                  : isNext
                  ? "border-[var(--border-2)] bg-[var(--surface)]"
                  : "border-transparent bg-transparent opacity-35"
              }`}
            >
              <p
                className="text-[11px] font-semibold leading-tight"
                style={{ color: reached || isNext ? m.color : "var(--text-3)" }}
              >
                {m.label}
              </p>
              <p className="mt-0.5 text-[9px] text-[var(--text-3)]">{m.level}</p>
              <p className="mt-0.5 text-[9px] text-[var(--text-3)]">
                {m.value >= 1000 ? `${m.value / 1000}k` : m.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
