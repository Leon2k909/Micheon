import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * A sentence whose individual words can be flagged as "I don't know this".
 *
 * Hovering a word underlines it; clicking marks it. Marks are what the
 * "Teach me these" button on the results screen builds its lesson from, so this
 * is the one place in a test where the learner can say what they actually want
 * taught rather than only being scored.
 *
 * Whole-word only. Punctuation and spacing are rendered outside the buttons so
 * that marking a word never depends on where in it you happened to click, and
 * so the sentence still reads normally when nothing is marked.
 */

/** Splits into word / non-word runs, keeping both so the text renders intact. */
function tokenize(text: string) {
  return String(text ?? "").split(/([\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*)/u).filter((part) => part !== "");
}

function isWordToken(token: string) {
  return /^[\p{L}\p{N}]/u.test(token);
}

/** The form a marked word is stored and looked up under. */
export function normalizeMarkWord(word: string) {
  return String(word ?? "").toLocaleLowerCase("de-DE").replace(/[^\p{L}\p{N}]+/gu, "");
}

export function MarkableText({
  text,
  marked,
  onToggleWord,
  className,
  disabled = false,
}: {
  text: string;
  /** Normalised words currently marked. */
  marked: Set<string>;
  onToggleWord: (word: string) => void;
  className?: string;
  disabled?: boolean;
}) {
  const tokens = useMemo(() => tokenize(text), [text]);

  if (disabled) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (!isWordToken(token)) return <span key={index}>{token}</span>;
        const key = normalizeMarkWord(token);
        if (!key) return <span key={index}>{token}</span>;
        const isMarked = marked.has(key);
        return (
          <button
            aria-label={
              isMarked
                ? `${token} — marked as not known. Click to unmark.`
                : `${token} — click if you do not know this word.`
            }
            aria-pressed={isMarked}
            className={cn(
              "rounded-[6px] px-0.5 transition-colors",
              // The underline only appears on hover, so a sentence with nothing
              // marked still reads as a sentence rather than as a row of links.
              isMarked
                ? "bg-amber-400/25 text-[var(--text-1)] underline decoration-amber-500 decoration-2 underline-offset-4"
                : "hover:bg-amber-400/15 hover:underline hover:decoration-amber-500/70 hover:decoration-2 hover:underline-offset-4",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            )}
            key={index}
            onClick={() => onToggleWord(token)}
            type="button"
          >
            {token}
          </button>
        );
      })}
    </span>
  );
}
