import { conversationPriorityScore } from "@/lib/conversationPriority";
import { sentenceIdentityKey } from "@/lib/germanTextMatch";

/**
 * Conversation: somebody says something to you, and you answer.
 *
 * Every other mode teaches a phrase on its own. You can finish a lesson able
 * to recite "Ja, ich suche Wasser." and still be silent when a cashier asks
 * "Kann ich Ihnen helfen?", because the phrase was never attached to the
 * moment that calls for it.
 *
 * The course already holds the moments. 634 authored dialogues — a shop, a
 * station, a doctor, a beer garden — written as alternating turns with both
 * languages on every line. Nothing here invents content: a scenario IS one of
 * those dialogues, and the mode simply hands you one side of it.
 *
 * THE SHAPE. The other speaker's turns are given. Yours are chosen from four
 * options, one of which is what the dialogue actually says next. Choose right
 * and the conversation continues; the reward for a correct answer is finding
 * out what happens, which is the reward a conversation has anyway.
 */

export type ScenarioTurn = {
  /** "them" is the other speaker; "you" is the line the learner picks. */
  side: "them" | "you";
  de: string;
  en: string;
  fr?: string;
};

export type Scenario = {
  id: string;
  title: string;
  partKey: string;
  level?: string;
  /** The pack's own description, which reads as the setting. */
  setting?: string;
  turns: ScenarioTurn[];
};

type RawLine = { speaker?: string; de?: string; en?: string; fr?: string };
type RawDialogue = { title?: string; lines?: RawLine[] };

/**
 * Which speaker the learner plays.
 *
 * The dialogues are written with A opening — a cashier asking, a friend
 * greeting — so the learner is B and answers. Where a dialogue opens with B
 * instead, the learner still takes B, because the sides are a fact about the
 * script rather than about who speaks first.
 */
const LEARNER_SIDE = "B";

/**
 * A scenario has to be worth playing.
 *
 * Two turns is a question and an answer, which is a flashcard with extra
 * steps. Four is the shortest thing that feels like a conversation, and it is
 * what almost every authored dialogue already has.
 */
export const MIN_SCENARIO_TURNS = 4;

export function buildScenarios(apiParts: Record<string, any>): Scenario[] {
  const scenarios: Scenario[] = [];
  for (const [partKey, part] of Object.entries(apiParts ?? {})) {
    const dialogues: RawDialogue[] = (part as any)?.dialogues ?? [];
    for (const [index, dialogue] of dialogues.entries()) {
      const lines = dialogue?.lines ?? [];
      if (lines.length < MIN_SCENARIO_TURNS) continue;
      const turns: ScenarioTurn[] = [];
      for (const line of lines) {
        const de = String(line?.de ?? "").trim();
        const en = String(line?.en ?? "").trim();
        if (!de || !en) { turns.length = 0; break; }
        turns.push({
          side: String(line?.speaker ?? "").toUpperCase() === LEARNER_SIDE ? "you" : "them",
          de,
          en,
          fr: line?.fr ? String(line.fr) : undefined,
        });
      }
      // A dialogue where the learner never speaks is a script to read, not a
      // conversation to hold.
      if (turns.length < MIN_SCENARIO_TURNS) continue;
      if (!turns.some((turn) => turn.side === "you")) continue;
      scenarios.push({
        id: `sc-${partKey}-${index}`,
        title: String(dialogue?.title ?? "").trim() || String((part as any)?.label ?? partKey),
        partKey,
        level: (part as any)?.level,
        setting: String((part as any)?.description ?? "").trim() || undefined,
        turns,
      });
    }
  }

  // The same order the rest of the course uses, so a shop and a greeting come
  // before a Bundesliga argument. Scored on the learner's own first line,
  // which is the thing they will have to produce.
  return scenarios.sort((a, b) => {
    const score = (s: Scenario) => conversationPriorityScore({
      partKey: s.partKey,
      kind: "dialogue",
      commonality: 2500,
      lessonPriority: undefined,
    });
    return score(a) - score(b) || a.id.localeCompare(b.id);
  });
}

/** Every line the learner could be asked to say, across every scenario. */
export function learnerLines(scenarios: Scenario[]): ScenarioTurn[] {
  return scenarios.flatMap((s) => s.turns.filter((t) => t.side === "you"));
}

const key = (text: string) => sentenceIdentityKey(String(text ?? "")).toLocaleLowerCase("de-DE");
const words = (text: string) => String(text ?? "").trim().split(/\s+/).filter(Boolean).length;

/**
 * Four replies, one of them the one the dialogue actually gives.
 *
 * The wrong three have to be wrong. A distractor that would ALSO answer the
 * question makes the question unanswerable — "Danke." is a fine reply to most
 * things, and offered against "Kann ich Ihnen helfen?" there are suddenly two
 * right answers and no way to tell which the app wanted.
 *
 * So a candidate is refused when it is the same sentence by the app's own
 * identity rule, when it shares the answer's English (a paraphrase is the same
 * answer), and when it is a bare courtesy that fits anywhere. What is left is
 * matched roughly for length, because a two-word answer among three long ones
 * is guessable without reading any German at all.
 */
const FITS_ANYWHERE = /^(ja|nein|danke|bitte|okay|ok|klar|genau|gut|alles klar|kein problem|gerne|na klar)[.!?]?$/i;

export function replyOptions(
  answer: ScenarioTurn,
  pool: ScenarioTurn[],
  count = 4,
  seed = 0
): ScenarioTurn[] {
  const answerKey = key(answer.de);
  const answerEnglish = String(answer.en ?? "").trim().toLocaleLowerCase("en-GB");
  const target = words(answer.de);

  const usable = pool.filter((line) => {
    if (key(line.de) === answerKey) return false;
    if (String(line.en ?? "").trim().toLocaleLowerCase("en-GB") === answerEnglish) return false;
    // A courtesy that answers anything cannot be a wrong answer.
    if (FITS_ANYWHERE.test(line.de.trim())) return false;
    return true;
  });

  // Nearest in length first, so the right answer is not the odd one out.
  const ranked = [...usable].sort((a, b) =>
    Math.abs(words(a.de) - target) - Math.abs(words(b.de) - target)
    || key(a.de).localeCompare(key(b.de)));

  // Taken from a window rather than the very nearest, or every board would
  // draw the same handful of lines. Seeded so one scenario lays out the same
  // way twice — a re-render is not a new question.
  const window = ranked.slice(0, Math.max(count * 6, 24));
  const chosen: ScenarioTurn[] = [];
  const taken = new Set<string>([answerKey]);
  let state = (seed + target * 7919 + answerKey.length) >>> 0;
  while (chosen.length < count - 1 && window.length) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const pick = window.splice(state % window.length, 1)[0];
    if (!pick || taken.has(key(pick.de))) continue;
    taken.add(key(pick.de));
    chosen.push(pick);
  }

  // Shuffled with the answer among them, deterministically for the same reason.
  const all = [answer, ...chosen];
  for (let i = all.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const j = state % (i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

/** Where the learner's turns are, so the view can walk them in order. */
export function learnerTurnIndexes(scenario: Scenario): number[] {
  return scenario.turns
    .map((turn, index) => (turn.side === "you" ? index : -1))
    .filter((index) => index >= 0);
}
