import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { Block, CalloutVariant, QuizOption } from "@/lib/courses";

// Render text with `inline code` spans.
function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={i}
            className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--accent)]"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

const CALLOUT_STYLES: Record<CalloutVariant, string> = {
  why: "bg-[var(--info-bg)] text-[var(--info-text)]",
  warn: "bg-[var(--red-bg,#3a2026)] text-[var(--red-text,#ff8a9b)]",
  sbox: "bg-[var(--orange-bg,#3a2e18)] text-[var(--orange-text,#f0b860)]",
  python: "bg-[var(--surface-2)] text-[var(--text-2)] border-l-4 border-[var(--border-2)]",
  analogy: "bg-[var(--surface-2)] text-[var(--text-2)] border-l-4 border-[var(--border-2)]",
};

function CodeBlock({ code, small }: { code: string; small?: boolean }) {
  return (
    <pre
      className={cn(
        "my-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono leading-relaxed text-[var(--text-1)]",
        small ? "text-[12px]" : "text-[13px]"
      )}
    >
      <code>{code}</code>
    </pre>
  );
}

function Quiz({ q, options, explanation, onCorrect }: { q: string; options: QuizOption[]; explanation: string; onCorrect?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correctIdx = options.findIndex((o) => o.correct);

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    if (options[i].correct) onCorrect?.();
  };

  return (
    <div className="my-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <p className="text-sm font-black text-[var(--text-1)]">
        <RichText text={q} />
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((opt, i) => {
          const showCorrect = answered && i === correctIdx;
          const showWrong = answered && i === picked && !opt.correct;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => choose(i)}
              className={cn(
                "rounded-lg border px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                showCorrect
                  ? "border-[var(--success-border,#2d6b4f)] bg-[var(--success-bg)] text-[var(--success-text)]"
                  : showWrong
                    ? "border-[var(--red-border,#7a3344)] bg-[var(--red-bg,#3a2026)] text-[var(--red-text,#ff8a9b)]"
                    : "border-[var(--border-2)] text-[var(--text-1)] hover:bg-[var(--surface-3)] disabled:opacity-70"
              )}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={cn(
            "mt-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold",
            options[picked!].correct
              ? "bg-[var(--success-bg)] text-[var(--success-text)]"
              : "bg-[var(--red-bg,#3a2026)] text-[var(--red-text,#ff8a9b)]"
          )}
        >
          {options[picked!].correct ? "Correct!" : "Not quite — correct answer highlighted above."}
        </div>
      )}
      {answered && (
        <div className="mt-3 rounded-lg bg-[var(--info-bg)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--info-text)]">
          <RichText text={explanation} />
        </div>
      )}
    </div>
  );
}

export function LessonBlocks({
  blocks,
  onQuizCorrect,
}: {
  blocks: Block[];
  onQuizCorrect?: () => void;
}) {
  return (
    <div className="space-y-1">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-[15px] leading-7 text-[var(--text-2)]">
                <RichText text={block.text} />
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-6 text-base font-black text-[var(--text-1)]">
                {block.text}
              </h3>
            );
          case "code":
            return <CodeBlock key={i} code={block.code} />;
          case "callout":
            return (
              <div
                key={i}
                className={cn("my-3 rounded-lg px-4 py-3 text-sm leading-relaxed", CALLOUT_STYLES[block.variant])}
              >
                <RichText text={block.text} />
              </div>
            );
          case "twocol":
            return (
              <div key={i} className="my-3 grid gap-2.5 sm:grid-cols-2">
                {[block.left, block.right].map((col, j) => (
                  <div key={j} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
                      {col.lang}
                    </p>
                    <CodeBlock code={col.code} small />
                  </div>
                ))}
              </div>
            );
          case "cards":
            return (
              <div key={i} className="my-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {block.items.map((card, j) => (
                  <div key={j} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                    <h4 className="text-sm font-black text-[var(--text-1)]">{card.h4}</h4>
                    <p className="mt-1 text-[13px] leading-5 text-[var(--text-2)]">
                      <RichText text={card.p} />
                    </p>
                  </div>
                ))}
              </div>
            );
          case "quiz":
            return (
              <Quiz key={i} q={block.q} options={block.options} explanation={block.explanation} onCorrect={onQuizCorrect} />
            );
          case "cta":
            return (
              <div key={i} className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 text-center">
                <p className="text-base font-black text-[var(--text-1)]">{block.title}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-2)]">{block.sub}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
