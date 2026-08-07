/**
 * Why "ihn" and not "er"? One-line answers for the word popover.
 *
 * German personal pronouns change form with their role in the sentence, and
 * that regularly reads as a mystery ("there is no er anywhere!"). English does
 * the same thing in a smaller way — he → him, we → us — so every note explains
 * the form through that analogy plus a tiny example, and never through case
 * names. Closed word class, so a hand-written table covers it completely.
 */
const PRONOUN_NOTES: Record<string, string> = {
  mich: "me — this is 'ich' when something happens to me, like I → me: Er sieht mich (he sees me).",
  mir: "me / to me — 'ich' when something is given or done to me: Gib mir das (give me that).",
  dich: "you — this is 'du' when something happens to you: Ich sehe dich (I see you).",
  dir: "you / to you — 'du' when something is given or done to you: Ich helfe dir (I'm helping you).",
  ihn: "him — this is 'er' when something happens to him, like he → him: Ruf ihn an (call him). You'd never say 'call he' — same idea here.",
  ihm: "him / to him — 'er' when something is given or done to him: Gib ihm Zeit (give him time).",
  ihr: "three words in one. Talking TO a group it is 'you all': Was macht ihr? (what are you all up to?). Before a noun it is 'her/their': ihr Auto (her car). On its own it can be 'to her': Ich helfe ihr (I'm helping her).",
  uns: "us — this is 'wir' when something happens to us, like we → us: Besuch uns mal (come visit us).",
  euch: "you (all) — 'ihr' when something happens to you all: Ich sehe euch (I see you all).",
  ihnen: "them / to them — like they → them: Ich helfe ihnen (I'm helping them). Capitalised (Ihnen) it's the polite 'you': Wie geht es Ihnen?",
  wen: "who — this is 'wer' asking about the person something happens to: Wen rufst du an? (who are you calling?).",
  wem: "who / to whom — 'wer' asking who receives something: Wem gehört das? (who does this belong to?).",
};

/** A plain-language note for a case-changed pronoun, or null for other words. */
export function pronounNote(word: string): string | null {
  return PRONOUN_NOTES[word.toLocaleLowerCase("de-DE")] ?? null;
}
