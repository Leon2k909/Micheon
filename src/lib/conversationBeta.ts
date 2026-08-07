import { allPartBlueprints } from "@/lib/data";
import { curatedTopics } from "@/lib/phrasebank";

/**
 * Conversation Beta: learn a phrase as a reply, and meet hard structure early.
 *
 * The normal lesson teaches a sentence on its own and orders by how useful the
 * phrase is. That is right for getting started and wrong for getting fast. Two
 * things are missing from it.
 *
 * First, a phrase learned in isolation is a phrase you can recite, not one you
 * can use. 705 of the dialogue lines in the course are already answers to a
 * question asked by the other speaker, so the question can be put on screen
 * and the phrase taught as the reply — the same sentence, in the place you
 * would actually say it.
 *
 * Second, the structures that make German feel foreign are exactly the ones a
 * usefulness ranking pushes to the back, because they turn up in longer, less
 * common sentences. "weil" sends the verb to the end and has no English
 * equivalent to lean on; you can know a thousand words and still not build a
 * sentence with it. This ranks by that difficulty instead, so the alien
 * grammar arrives while there is still time to get used to it.
 */

/** Verb-final subordinators — the structure with no English counterpart. */
const SUBORDINATOR = /\b(weil|dass|wenn|obwohl|damit|bevor|nachdem|w(?:ä|ae)hrend|falls|solange|sobald|ob|seit|sodass|da(?=\s+\w+\s)|bis)\b/i;
/** A relative clause: a comma, then a pronoun standing in for the noun. */
const RELATIVE = /,\s*(der|die|das|den|dem|deren|dessen|welche[rs]?)\b/i;
/** Modal or future, which parks the infinitive at the end of the clause. */
const MODAL_FRAME = /\b(kann|kannst|k(?:ö|oe)nnen|k(?:ö|oe)nnt|muss|musst|m(?:ü|ue)ssen|m(?:ü|ue)sst|will|willst|wollen|wollt|soll|sollst|sollen|sollt|darf|darfst|d(?:ü|ue)rfen|d(?:ü|ue)rft|m(?:ö|oe)chte|m(?:ö|oe)chten|werde|wirst|werden|werdet)\b[^.?!]*\b\w{3,}en\b/i;
/** Konjunktiv II — the "would/could have" mood. */
const KONJUNKTIV = /\b(w(?:ä|ae)re|w(?:ä|ae)r(?:st|en|t)|h(?:ä|ae)tte|h(?:ä|ae)tte(?:st|n|t)|w(?:ü|ue)rde|w(?:ü|ue)rde(?:st|n|t)|k(?:ö|oe)nnte|m(?:ü|ue)sste|sollte|d(?:ü|ue)rfte)\b/i;
/** Passive: a form of werden plus a past participle. */
const PASSIVE = /\b(wird|wurde|werden|wurden)\b[^.?!]*\bge\w+(?:t|en)\b/i;
/** Separable prefix left stranded at the end — ruf mich an, steh früh auf. */
const SEPARABLE = /\b\w{3,}\s+[^.?!]*\b(an|auf|aus|mit|zu|vor|nach|ein|ab|los|weg|zurück|zur(?:ü|ue)ck)\s*[.?!]/i;

const WEIGHTS: Array<[RegExp, number, string]> = [
  // Weighted by how little English prepares you for it, not by rarity.
  [SUBORDINATOR, 5, "verb sent to the end (weil, dass, wenn …)"],
  [KONJUNKTIV, 4, "Konjunktiv II — would / could have"],
  [RELATIVE, 3, "relative clause"],
  [PASSIVE, 3, "passive"],
  [MODAL_FRAME, 2, "infinitive parked at the end"],
  [SEPARABLE, 2, "separable prefix at the end"],
];

/** How much structure a sentence teaches. Higher means harder and earlier. */
export function structureScore(de: string): number {
  const text = String(de ?? "");
  if (!text) return 0;
  let score = 0;
  for (const [pattern, weight] of WEIGHTS) if (pattern.test(text)) score += weight;
  // A long sentence with none of the above is just long, so length only breaks
  // ties between sentences that already teach something.
  if (score > 0) score += Math.min(2, Math.floor(text.trim().split(/\s+/).length / 12));
  return score;
}

/** Plain-language names for what a sentence is teaching, for the lesson chip. */
export function structureNotes(de: string): string[] {
  const text = String(de ?? "");
  return WEIGHTS.filter(([pattern]) => pattern.test(text)).map(([, , label]) => label);
}

const normalise = (s: string) => String(s ?? "").trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");

let questionIndex: Map<string, { de: string; en: string }> | null = null;

/**
 * Which question does this sentence answer?
 *
 * Built once from every dialogue in the course: a line that ends in a question
 * mark, immediately followed by a line from the OTHER speaker, makes that
 * second line an answer. Same-speaker follow-ups are skipped — someone asking
 * a question and then carrying on talking has not been answered.
 */
export function questionFor(de: string): { de: string; en: string } | null {
  if (!questionIndex) {
    questionIndex = new Map();
    const packs: any[] = [...Object.values(allPartBlueprints), ...curatedTopics];
    for (const pack of packs) {
      for (const dialogue of pack?.dialogues ?? []) {
        const lines = dialogue?.lines ?? [];
        for (let i = 1; i < lines.length; i += 1) {
          const question = lines[i - 1];
          const answer = lines[i];
          if (!question?.de || !answer?.de) continue;
          if (!/\?\s*$/.test(String(question.de).trim())) continue;
          if (question.speaker && answer.speaker && question.speaker === answer.speaker) continue;
          const key = normalise(answer.de);
          // First one wins: the earliest dialogue is the simplest context.
          if (!questionIndex.has(key)) {
            questionIndex.set(key, { de: String(question.de), en: String(question.en ?? "") });
          }
        }
      }
    }
  }
  return questionIndex.get(normalise(de)) ?? null;
}

export type BetaRanked<T> = {
  item: T;
  structure: number;
  notes: string[];
  asks: { de: string; en: string } | null;
};

/**
 * Order candidates for the beta: hardest structure first, and prefer the ones
 * that come with a question to answer.
 *
 * The question bonus is smaller than a single structure point on purpose. A
 * conversation is the better way to meet a sentence, but meeting an easy
 * sentence in a conversation does not beat meeting a hard one at all.
 */
export function rankForBeta<T extends { de?: string }>(items: T[]): Array<BetaRanked<T>> {
  return items
    .map((item) => {
      const de = String(item?.de ?? "");
      const asks = questionFor(de);
      return { item, structure: structureScore(de), notes: structureNotes(de), asks };
    })
    .sort((a, b) =>
      (b.structure + (b.asks ? 0.5 : 0)) - (a.structure + (a.asks ? 0.5 : 0))
    );
}
