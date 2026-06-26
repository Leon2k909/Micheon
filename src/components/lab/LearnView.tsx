import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Headphones } from "lucide-react";
import { Part } from "@/lib/types";

export function LearnView({
  apiParts,
  onOpenLesson,
}: {
  apiParts: Record<string, Part>;
  onOpenLesson: (id: string) => void;
}) {
  const parts = Object.entries(apiParts);
  const coreParts = parts.filter(([key]) => !key.startsWith("wordbank"));
  const wordBankParts = parts.filter(([key]) => key.startsWith("wordbank"));

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-1)]">Lessons</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--text-2)]">
              Work through practical German in short blocks: read, listen, speak, type, and translate.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
              <p className="text-2xl font-black text-[var(--text-1)]">{coreParts.length}</p>
              <p className="text-[11px] font-bold text-[var(--text-3)]">core modules</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] px-4 py-3">
              <p className="text-2xl font-black text-[var(--text-1)]">{wordBankParts.length}</p>
              <p className="text-[11px] font-bold text-[var(--text-3)]">word-bank sets</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {parts.map(([key, part], index) => {
          const featured = index === 0;
          return (
            <motion.button
              className={[
                "card card-hover min-h-[236px] p-5 text-left",
                featured ? "lg:col-span-2" : "",
              ].join(" ")}
              key={key}
              onClick={() => onOpenLesson(key)}
              type="button"
              whileTap={{ scale: 0.985 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  {key.startsWith("wordbank") ? <BookOpen className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
                </div>
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[11px] font-black text-[var(--text-1)]">
                  {part.level}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-black leading-tight tracking-tight text-[var(--text-1)]">{part.theme}</h2>
              <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[var(--text-2)]">{part.description}</p>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-2)]">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--text-1)]">{part.vocab.length} items</p>
                    <p className="text-[11px] font-semibold text-[var(--text-3)]">10-15 min</p>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#070707] text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dcfff1] text-[#139a62]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-1)]">Conversation coverage</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
              The current path covers greetings, daily routines, travel, food, questions, basic opinions, and common sentence patterns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
