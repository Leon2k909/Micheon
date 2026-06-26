import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/lib/courseRegistry";

export function CourseSwitcher({
  open,
  activeCourseId,
  onSelect,
  onClose,
}: {
  open: boolean;
  activeCourseId: string;
  onSelect: (courseId: string) => void;
  onClose: () => void;
}) {
  const languages = COURSES.filter((c) => c.kind === "language");
  const programming = COURSES.filter((c) => c.kind === "programming");

  const Card = ({ id, icon, name, tagline, available, builtIn }: (typeof COURSES)[number]) => {
    const active = id === activeCourseId;
    return (
      <button
        type="button"
        disabled={!available}
        onClick={() => { if (available) { onSelect(id); onClose(); } }}
        className={cn(
          "relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
          active
            ? "border-[var(--accent)] bg-[var(--accent-dim)]"
            : available
              ? "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
              : "border-[var(--border)] bg-[var(--surface-2)] opacity-55"
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-xl font-black text-[var(--accent)]">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-black text-[var(--text-1)]">{name}</span>
            {builtIn && (
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[var(--text-3)]">
                Main
              </span>
            )}
          </span>
          <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--text-3)]">{tagline}</span>
        </span>
        {active ? (
          <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
        ) : !available ? (
          <Lock className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
        ) : null}
      </button>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 px-4 pt-[88px] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_28px_80px_var(--shadow-strong)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">Switch course</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">Pick a language or a programming track.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">Languages</p>
            <div className="mt-2 grid gap-2">
              {languages.map((c) => <Card key={c.id} {...c} />)}
            </div>

            <p className="mt-5 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">Programming</p>
            <div className="mt-2 grid gap-2">
              {programming.map((c) => <Card key={c.id} {...c} />)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
