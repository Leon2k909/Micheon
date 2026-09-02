/**
 * What comes after what, in a conversation.
 *
 * The learner asked for an order where things make sense one after another —
 * a question, then an answer that fits it. The app already knows thousands of
 * those: every pack's dialogues are turns in sequence, 780 of them with 2,853
 * question-and-reply pairs, written by hand. That is the only honest source.
 * Pairing a loose question with a loose answer by guesswork would put
 * "Hast du morgen Zeit?" next to "Ja, jeden Morgen" and call it conversation.
 *
 * Lines are keyed by sentence identity rather than card id, because a line a
 * pack also teaches as a phrase is served as the phrase and the dialogue's
 * copy is dropped — the card is one thing, the place it holds in a
 * conversation is another, and this module keeps the second.
 */
import { sentenceIdentityKey } from "@/lib/germanTextMatch";

type ExchangePlace = {
  /** The dialogue this line belongs to: `${pack}-dlg-${index}`. */
  dialogue: string;
  /** Its turn in that dialogue, from 0. */
  line: number;
  /** How many turns the dialogue has. */
  lines: number;
};

type ExchangeIndex = {
  /** Where a line sits — its first appearance, when a line is said in several dialogues. */
  placeOf: Map<string, ExchangePlace>;
  /** What is said next, in every dialogue the line appears in. */
  follows: Map<string, string[]>;
  dialogues: number;
};

export function exchangeKey(text: unknown): string {
  return sentenceIdentityKey(String(text ?? "")).toLowerCase();
}

const cache = new WeakMap<object, ExchangeIndex>();

export function buildExchangeIndex(parts: Record<string, any>): ExchangeIndex {
  const cacheable = Boolean(parts) && typeof parts === "object";
  if (cacheable) {
    const cached = cache.get(parts);
    if (cached) return cached;
  }
  const placeOf = new Map<string, ExchangePlace>();
  const follows = new Map<string, string[]>();
  let dialogues = 0;
  for (const [partKey, part] of Object.entries(parts ?? {})) {
    const list: any[] = Array.isArray(part?.dialogues) ? part.dialogues : [];
    list.forEach((dialogue, di) => {
      const lines: any[] = (dialogue?.lines ?? []).filter((line: any) => line && String(line.de ?? "").trim());
      if (lines.length < 2) return;
      dialogues++;
      const id = `${partKey}-dlg-${di}`;
      lines.forEach((line, li) => {
        const key = exchangeKey(line.de);
        if (!key) return;
        if (!placeOf.has(key)) placeOf.set(key, { dialogue: id, line: li, lines: lines.length });
        const next = lines[li + 1];
        if (!next) return;
        const nextKey = exchangeKey(next.de);
        if (!nextKey || nextKey === key) return;
        const known = follows.get(key) ?? [];
        if (!known.includes(nextKey)) follows.set(key, [...known, nextKey]);
      });
    });
  }
  const index = { placeOf, follows, dialogues };
  if (cacheable) cache.set(parts, index);
  return index;
}

export function exchangePlace(text: unknown, index: ExchangeIndex): ExchangePlace | null {
  return index.placeOf.get(exchangeKey(text)) ?? null;
}

/** The keys of what is said next, or nothing when the line ends every dialogue it is in. */
export function repliesTo(text: unknown, index: ExchangeIndex): string[] {
  return index.follows.get(exchangeKey(text)) ?? [];
}

/**
 * The exchange that starts at a line: the first reply that `has`, then that
 * reply's reply, and so on, up to `limit` turns. Stops at the first turn
 * nobody has, because an answer to a question the learner will not see is
 * not an exchange.
 */
export function exchangeChain(lead: unknown, index: ExchangeIndex, has: (key: string) => boolean, limit: number): string[] {
  const chain: string[] = [];
  const seen = new Set([exchangeKey(lead)]);
  let current = exchangeKey(lead);
  while (chain.length < limit) {
    const next = (index.follows.get(current) ?? []).find((key) => has(key) && !seen.has(key));
    if (!next) break;
    chain.push(next);
    seen.add(next);
    current = next;
  }
  return chain;
}
