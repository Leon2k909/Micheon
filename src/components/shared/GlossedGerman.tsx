import { cn } from "@/lib/utils";
import { germanWordGloss } from "@/lib/germanWordGloss";

/**
 * German you can hover a word at a time.
 *
 * Reading a sentence you nearly understand and being stuck on one word is the
 * most common way a learner stalls, and the two ways out are both bad: give up
 * on the line, or leave the app for a dictionary. Hovering the word answers it
 * in place and leaves the rest of the sentence to be worked out, which is the
 * part that teaches.
 *
 * Word-level, deliberately. germanWordGloss knows words, not sentences — it
 * answers "age" for Alter, which is right about the noun and wrong about a
 * message that opens with it. Anywhere the surrounding line decides a sense,
 * pass `glosses` and that wins; the lookup is the fallback, not the authority.
 */
export function glossedTokens(line: string): { text: string; word: boolean }[] {
  const out: { text: string; word: boolean }[] = [];
  const pattern = /[\p{L}\p{N}ß'-]+|[^\p{L}\p{N}ß'-]+/gu;
  for (const match of String(line ?? "").matchAll(pattern)) {
    out.push({ text: match[0], word: /[\p{L}\p{N}ß]/u.test(match[0]) });
  }
  return out;
}

export function GlossedGerman({ text, glosses, className }: {
  text: string;
  /** Meanings this particular line decides, which beat the word lookup. */
  glosses?: Record<string, string>;
  className?: string;
}) {
  return (
    <span className={className}>
      {glossedTokens(text).map((token, index) => {
        if (!token.word) return <span key={index}>{token.text}</span>;
        // German capitalises its nouns, so a capital anywhere but the opening
        // word says "noun" loudly enough to break a tie the word bank would
        // otherwise settle wrongly — Mal, Essen, Weiß, Fest, Laut all have a
        // lowercase twin that answers first. The first word is capitalised by
        // grammar rather than by meaning, so it gets no such hint.
        const midSentenceCapital = index > 0 && /^\p{Lu}/u.test(token.text);
        const gloss = glosses?.[token.text]
          ?? glosses?.[token.text.toLocaleLowerCase("de-DE")]
          ?? germanWordGloss(token.text, { midSentenceCapital });
        return (
          <span
            key={index}
            className={cn("gloss-word", gloss && "has-gloss")}
            data-gloss={gloss ?? undefined}
            title={gloss ?? undefined}
            tabIndex={gloss ? 0 : undefined}
            aria-label={gloss ? `${token.text}: ${gloss}` : undefined}
          >
            {token.text}
          </span>
        );
      })}
    </span>
  );
}
