import React, { useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block, CalloutVariant, QuizOption } from "@/lib/courses";
import { translateCourseText, useTranslationLanguage } from "@/lib/courseTranslation";
import { ui } from "@/lib/i18n";

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

/**
 * One card, which turns over to show its translation.
 *
 * Only becomes a button when a translation actually exists — a card that looks
 * tappable and then does nothing is worse than one that never invited the tap.
 * With the setting off, or with nothing translated yet, this renders exactly
 * the plain card it always did.
 */
function LessonCard({ h4, p }: { h4: string; p: string }) {
  const language = useTranslationLanguage();
  const [open, setOpen] = useState(false);
  const titleDe = translateCourseText(h4, language);
  const bodyDe = translateCourseText(p, language);
  const hasTranslation = Boolean(titleDe || bodyDe);

  if (!hasTranslation) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
        <h4 className="text-sm font-black text-[var(--text-1)]">{h4}</h4>
        <p className="mt-1 text-[13px] leading-5 text-[var(--text-2)]">
          <RichText text={p} />
        </p>
      </div>
    );
  }

  return (
    <button
      aria-expanded={open}
      className={cn(
        "group relative rounded-xl border p-3.5 text-left transition-colors",
        open
          ? "border-[var(--accent)] bg-[var(--accent-dim)]"
          : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
      )}
      onClick={() => setOpen((value) => !value)}
      title={open ? ui("Tap to hide the translation") : ui("Tap for the translation")}
      type="button"
    >
      <Languages
        aria-hidden="true"
        className={cn(
          "absolute right-3 top-3 h-3.5 w-3.5 transition-opacity",
          open ? "text-[var(--accent)] opacity-100" : "text-[var(--text-3)] opacity-45 group-hover:opacity-90"
        )}
      />
      <h4 className="pr-6 text-sm font-black text-[var(--text-1)]">{h4}</h4>
      <p className="mt-1 text-[13px] leading-5 text-[var(--text-2)]">
        <RichText text={p} />
      </p>
      {open && (
        <div className="mt-3 border-t border-[var(--border-2)] pt-2.5">
          {titleDe ? <p className="text-[13px] font-black text-[var(--accent)]">{titleDe}</p> : null}
          {bodyDe ? (
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-2)]">{bodyDe}</p>
          ) : (
            <p className="mt-1 text-[12px] font-semibold italic text-[var(--text-3)]">
              {ui("No translation for this part yet.")}
            </p>
          )}
        </div>
      )}
    </button>
  );
}

/** A section heading that reveals its translation when tapped. */
function LessonHeading({ text }: { text: string }) {
  const language = useTranslationLanguage();
  const [open, setOpen] = useState(false);
  const translated = translateCourseText(text, language);

  if (!translated) {
    return <h3 className="mt-6 mb-2 text-lg font-black text-[var(--text-1)]">{text}</h3>;
  }

  return (
    <div className="mt-6 mb-2">
      <button
        aria-expanded={open}
        className="group inline-flex items-center gap-2 text-left"
        onClick={() => setOpen((value) => !value)}
        title={open ? ui("Tap to hide the translation") : ui("Tap for the translation")}
        type="button"
      >
        <h3 className="text-lg font-black text-[var(--text-1)]">{text}</h3>
        <Languages
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-opacity",
            open ? "text-[var(--accent)] opacity-100" : "text-[var(--text-3)] opacity-45 group-hover:opacity-90"
          )}
        />
      </button>
      {open && <p className="mt-0.5 text-sm font-bold text-[var(--accent)]">{translated}</p>}
    </div>
  );
}

const CALLOUT_STYLES: Record<CalloutVariant, string> = {
  why: "bg-[var(--info-bg)] text-[var(--info-text)]",
  warn: "bg-[var(--red-bg)] text-[var(--red-text)]",
  sbox: "bg-[var(--orange-bg)] text-[var(--orange-text)]",
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
                  ? "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-text)]"
                  : showWrong
                    ? "border-[var(--red-border)] bg-[var(--red-bg)] text-[var(--red-text)]"
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
              : "bg-[var(--red-bg)] text-[var(--red-text)]"
          )}
        >
          {options[picked!].correct ? ui("Correct!") : ui("Not quite — the correct answer is highlighted above.")}
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
            return <LessonHeading key={i} text={block.text} />;
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
                  <LessonCard h4={card.h4} key={j} p={card.p} />
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
