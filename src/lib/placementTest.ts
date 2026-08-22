import { orderParts } from "@/lib/curriculum";

/**
 * A placement test that keeps going while you keep being right.
 *
 * The old one asked ten A1–B1 vocabulary words and stopped. Somebody strong
 * answered all ten, was placed at B1, and there was nowhere further to put
 * them — the ceiling was the test's, not the learner's. What is wanted is
 * exactly that: doing really well should make Continue learning harder.
 *
 * So this climbs. It starts a rung below where it expects you, asks a short
 * round at each level, and only moves up while you are passing. It stops at
 * the first level you fail, and places you at the highest level you cleared.
 * The consequence is that the test is short for a beginner (two rounds) and
 * long for someone advanced (five), which is the right way round — the person
 * who needs placing precisely is the one with more range beneath them.
 *
 * It covers both directions. The German questions test German; the English
 * ones test English, rather than being the German ones read backwards, which
 * is what the previous test did and which asks a native English speaker
 * nothing.
 */

export type Cefr = "A1" | "A2" | "B1" | "B2" | "C1";
export type PlacementDirection = "learn-de" | "learn-en";

export const PLACEMENT_LEVELS: Cefr[] = ["A1", "A2", "B1", "B2", "C1"];

export type PlacementQuestion = {
  id: string;
  level: Cefr;
  prompt: string;
  /** Shown above the prompt — "What does this mean?", "Which is correct?" */
  instruction: string;
  options: string[];
  answer: number;
  explanation: string;
};

/** Questions asked at each level, and how many must be right to move up. */
export const PLACEMENT_ROUND_SIZE = 5;
export const PLACEMENT_PASS = 4;

const q = (
  id: string,
  level: Cefr,
  instruction: string,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string
): PlacementQuestion => ({ id, level, instruction, prompt, options, answer, explanation });

// ── Learning German ─────────────────────────────────────────────────────────
const DE: PlacementQuestion[] = [
  // A1
  q("de-a1-1", "A1", "What does this mean?", "das Haus", ["the house", "the horse", "the hat", "the hand"], 0, "das Haus — house."),
  q("de-a1-2", "A1", "What does this mean?", "Guten Morgen", ["Good evening", "Good morning", "Good night", "Goodbye"], 1, "Morgen is morning."),
  q("de-a1-3", "A1", "Which is correct?", "___ heiße Leon.", ["Ich", "Du", "Er", "Wir"], 0, "Ich heiße — the verb form heiße goes with ich."),
  q("de-a1-4", "A1", "What does this mean?", "Wie geht's?", ["Where are you going?", "How are you?", "What is that?", "Who are you?"], 1, "Wie geht's? — how are you?"),
  q("de-a1-5", "A1", "Which article does it take?", "___ Frau", ["der", "die", "das", "den"], 1, "die Frau — feminine."),
  q("de-a1-6", "A1", "What does this mean?", "Danke schön", ["Please", "Sorry", "Thank you very much", "Excuse me"], 2, "Danke schön — thank you very much."),
  q("de-a1-7", "A1", "What is the number?", "sieben", ["five", "six", "seven", "nine"], 2, "sieben — seven."),
  q("de-a1-8", "A1", "Which is correct?", "Das ist ___ Buch.", ["ein", "eine", "einen", "einem"], 0, "das Buch is neuter, so ein in the nominative."),

  // A2
  q("de-a2-1", "A2", "What does this mean?", "Ich habe keine Zeit.", ["I have no time.", "I have no money.", "I am not late.", "I do not know."], 0, "keine Zeit — no time."),
  q("de-a2-2", "A2", "Which is correct?", "Ich fahre ___ Bahnhof.", ["zur", "zum", "nach", "in"], 1, "zum Bahnhof — zu + dem, and Bahnhof is masculine."),
  q("de-a2-3", "A2", "What is the past tense?", "Ich ___ gestern ins Kino gegangen.", ["habe", "bin", "war", "hatte"], 1, "Verbs of motion take sein: ich bin gegangen."),
  q("de-a2-4", "A2", "What does this mean?", "Es tut mir leid.", ["It hurts me.", "I am sorry.", "I do not mind.", "It suits me."], 1, "Es tut mir leid — I am sorry."),
  q("de-a2-5", "A2", "Which is correct?", "Wenn es regnet, ___ ich zu Hause.", ["bleibe", "bleiben", "bleibst", "blieb"], 0, "ich bleibe — first person singular."),
  q("de-a2-6", "A2", "What does this mean?", "Ich muss noch einkaufen.", ["I still have to go shopping.", "I have already shopped.", "I would like to shop.", "I cannot shop."], 0, "müssen — to have to; noch here means still."),
  q("de-a2-7", "A2", "Which preposition?", "Ich warte ___ den Bus.", ["für", "auf", "an", "über"], 1, "warten auf — to wait for."),
  q("de-a2-8", "A2", "What does this mean?", "Das ist mir egal.", ["I do not mind.", "That is mine.", "That is equal.", "I agree."], 0, "Das ist mir egal — I do not mind / I do not care."),

  // B1
  q("de-b1-1", "B1", "Which is correct?", "Ich freue mich ___ das Wochenende.", ["für", "auf", "über", "an"], 1, "sich freuen auf — to look forward to something ahead."),
  q("de-b1-2", "B1", "What does this mean?", "Mir fällt gerade nichts ein.", ["Nothing comes to mind right now.", "I am falling behind.", "Nothing is falling.", "I do not fall for it."], 0, "einfallen — to occur to somebody."),
  q("de-b1-3", "B1", "Which case follows?", "Trotz ___ Wetters sind wir gegangen.", ["das", "dem", "des", "der"], 2, "trotz takes the genitive: trotz des Wetters."),
  q("de-b1-4", "B1", "What does this mean?", "Das kommt darauf an.", ["That depends.", "That is coming.", "That arrives there.", "That is on top."], 0, "Es kommt darauf an — it depends."),
  q("de-b1-5", "B1", "Which is correct?", "Ich hätte gern gewusst, ___ er kommt.", ["dass", "ob", "wenn", "als"], 1, "ob introduces an indirect yes/no question."),
  q("de-b1-6", "B1", "What does this mean?", "Sie hat sich daran gewöhnt.", ["She has got used to it.", "She has won it.", "She lives there.", "She has forgotten it."], 0, "sich an etwas gewöhnen — to get used to something."),
  q("de-b1-7", "B1", "Which is correct?", "Je mehr ich lerne, ___ besser verstehe ich.", ["desto", "als", "wie", "so"], 0, "je … desto — the more … the more."),
  q("de-b1-8", "B1", "What does this mean?", "Das lohnt sich nicht.", ["That is not worth it.", "That is not allowed.", "That does not fit.", "That is not paid."], 0, "sich lohnen — to be worth it."),

  // B2
  q("de-b2-1", "B2", "Which is correct?", "Er tat so, ___ er nichts gehört hätte.", ["als ob", "obwohl", "damit", "sodass"], 0, "als ob — as if, with the subjunctive."),
  q("de-b2-2", "B2", "What does this mean?", "Das steht außer Frage.", ["That is out of the question.", "That is beyond doubt.", "That is a good question.", "That is unanswered."], 1, "außer Frage stehen — to be beyond doubt. The English 'out of the question' is the opposite sense, which is the trap."),
  q("de-b2-3", "B2", "Which is the passive?", "Das Haus ___ letztes Jahr gebaut.", ["hat", "wurde", "ist", "war"], 1, "werden + past participle forms the passive: wurde gebaut."),
  q("de-b2-4", "B2", "What does this mean?", "Er hat sich damit abgefunden.", ["He has come to terms with it.", "He has found it.", "He has paid it off.", "He has arranged it."], 0, "sich abfinden mit — to come to terms with."),
  q("de-b2-5", "B2", "Which is correct?", "Es handelt sich ___ ein Missverständnis.", ["über", "um", "von", "für"], 1, "es handelt sich um — it is a matter of."),
  q("de-b2-6", "B2", "What does this mean?", "Das wirft die Frage auf, ob …", ["That raises the question of whether …", "That answers the question …", "That drops the question …", "That avoids the question …"], 0, "eine Frage aufwerfen — to raise a question."),
  q("de-b2-7", "B2", "Which is correct?", "Ich bestehe ___ meinem Recht.", ["auf", "an", "über", "in"], 0, "auf etwas bestehen — to insist on something."),
  q("de-b2-8", "B2", "What does this mean?", "Es liegt auf der Hand.", ["It is obvious.", "It is in hand.", "It is nearby.", "It is heavy."], 0, "auf der Hand liegen — to be obvious."),

  // C1
  q("de-c1-1", "C1", "What does this mean?", "Er nimmt kein Blatt vor den Mund.", ["He does not mince his words.", "He says nothing at all.", "He reads aloud.", "He covers his mouth."], 0, "kein Blatt vor den Mund nehmen — to speak plainly."),
  q("de-c1-2", "C1", "Which is correct?", "___ der schwierigen Lage blieb er ruhig.", ["Wegen", "Ungeachtet", "Trotzdem", "Dennoch"], 1, "ungeachtet + genitive — notwithstanding. Trotzdem and dennoch are adverbs, not prepositions."),
  q("de-c1-3", "C1", "What does this mean?", "Das ist an den Haaren herbeigezogen.", ["That is far-fetched.", "That is close at hand.", "That is well argued.", "That is hair-raising."], 0, "an den Haaren herbeigezogen — far-fetched."),
  q("de-c1-4", "C1", "Which register is formal written German?", "Choose the formal variant.", ["Er sagte, er komme später.", "Er sagte, er kommt später.", "Er sagte, dass er später kommt.", "Er meinte so was wie später."], 0, "Indirect speech in formal German uses Konjunktiv I: er komme."),
  q("de-c1-5", "C1", "What does this mean?", "Das schlägt dem Fass den Boden aus.", ["That is the last straw.", "That fills the barrel.", "That settles it fairly.", "That knocks it down."], 0, "dem Fass den Boden ausschlagen — the last straw."),
  q("de-c1-6", "C1", "Which is correct?", "Sie setzte sich ___ ihre Kollegen durch.", ["gegen", "für", "über", "auf"], 0, "sich gegen jemanden durchsetzen — to prevail against somebody."),
  q("de-c1-7", "C1", "What does this mean?", "Es steht und fällt mit der Finanzierung.", ["It depends entirely on the funding.", "It rises and falls in price.", "It is unstable.", "It has been funded."], 0, "stehen und fallen mit — to hinge entirely on."),
  q("de-c1-8", "C1", "What does this mean?", "Er hat die Nase voll.", ["He has had enough.", "He has a cold.", "He is nosy.", "He is full up."], 0, "die Nase voll haben — to be fed up."),
];

// ── Learning English ────────────────────────────────────────────────────────
const EN: PlacementQuestion[] = [
  // A1
  q("en-a1-1", "A1", "Which is correct?", "She ___ a teacher.", ["is", "are", "am", "be"], 0, "Third person singular takes is."),
  q("en-a1-2", "A1", "What does this mean?", "See you tomorrow.", ["Bis morgen.", "Bis später heute.", "Guten Morgen.", "Bis gestern."], 0, "tomorrow — morgen."),
  q("en-a1-3", "A1", "Which is correct?", "I ___ got two brothers.", ["have", "has", "haves", "having"], 0, "I have got."),
  q("en-a1-4", "A1", "What does this mean?", "How much is it?", ["Wie viel kostet das?", "Wie weit ist es?", "Wie viele sind es?", "Wie spät ist es?"], 0, "How much is it — what does it cost."),
  q("en-a1-5", "A1", "Which is correct?", "There ___ some milk in the fridge.", ["is", "are", "have", "be"], 0, "Milk is uncountable, so there is."),
  q("en-a1-6", "A1", "What does this mean?", "on the left", ["links", "rechts", "geradeaus", "oben"], 0, "on the left — links."),
  q("en-a1-7", "A1", "Which is correct?", "They ___ to school every day.", ["go", "goes", "going", "gone"], 0, "they go — no -s in the plural."),
  q("en-a1-8", "A1", "What does this mean?", "I would like a coffee, please.", ["Ich hätte gern einen Kaffee, bitte.", "Ich mag keinen Kaffee.", "Ich habe einen Kaffee.", "Ich trinke Kaffee."], 0, "I would like — ich hätte gern."),

  // A2
  q("en-a2-1", "A2", "Which is correct?", "I ___ to London last year.", ["went", "have gone", "go", "was going"], 0, "A finished time (last year) takes the past simple."),
  q("en-a2-2", "A2", "What does this mean?", "I am looking forward to it.", ["Ich freue mich darauf.", "Ich schaue nach vorne.", "Ich warte hier.", "Ich habe es gesehen."], 0, "to look forward to — sich freuen auf."),
  q("en-a2-3", "A2", "Which is correct?", "She is ___ than her brother.", ["taller", "more tall", "tallest", "the taller"], 0, "One-syllable adjectives take -er."),
  q("en-a2-4", "A2", "Which is correct?", "You ___ smoke in here.", ["mustn't", "don't must", "haven't to", "not must"], 0, "mustn't — prohibition."),
  q("en-a2-5", "A2", "What does this mean?", "It's up to you.", ["Das liegt bei dir.", "Es ist oben bei dir.", "Es geht bergauf.", "Du bist dran."], 0, "It is up to you — it is your decision."),
  q("en-a2-6", "A2", "Which is correct?", "I have lived here ___ 2019.", ["since", "for", "from", "during"], 0, "since with a point in time; for with a duration."),
  q("en-a2-7", "A2", "What does this mean?", "Never mind.", ["Macht nichts.", "Denk daran.", "Niemals.", "Pass auf."], 0, "Never mind — it does not matter."),
  q("en-a2-8", "A2", "Which is correct?", "If it rains, we ___ at home.", ["will stay", "would stay", "stayed", "have stayed"], 0, "First conditional: if + present, will + infinitive."),

  // B1
  q("en-b1-1", "B1", "Which is correct?", "I wish I ___ more time.", ["had", "have", "will have", "would have"], 0, "wish + past simple for a present regret."),
  q("en-b1-2", "B1", "What does this mean?", "I can't be bothered.", ["Ich habe keine Lust.", "Ich bin beschäftigt.", "Ich bin nicht gestört.", "Es stört mich nicht."], 0, "can't be bothered — cannot summon the will."),
  q("en-b1-3", "B1", "Which is correct?", "He suggested ___ earlier.", ["leaving", "to leave", "leave", "that leave"], 0, "suggest takes the -ing form."),
  q("en-b1-4", "B1", "What does this mean?", "It's not worth it.", ["Das lohnt sich nicht.", "Das ist wertlos.", "Es ist nicht erlaubt.", "Es kostet nichts."], 0, "not worth it — es lohnt sich nicht."),
  q("en-b1-5", "B1", "Which is correct?", "By the time we arrived, the film ___.", ["had started", "started", "has started", "was starting"], 0, "Past perfect for the earlier of two past events."),
  q("en-b1-6", "B1", "What does this mean?", "to put something off", ["etwas verschieben", "etwas ausziehen", "etwas ablegen", "etwas ablehnen"], 0, "to put off — to postpone."),
  q("en-b1-7", "B1", "Which is correct?", "She's used to ___ early.", ["getting up", "get up", "got up", "gets up"], 0, "be used to + -ing."),
  q("en-b1-8", "B1", "What does this mean?", "on second thoughts", ["wenn ich es mir recht überlege", "zum zweiten Mal", "in zweiter Linie", "nach kurzem Denken"], 0, "on second thoughts — having reconsidered."),

  // B2
  q("en-b2-1", "B2", "Which is correct?", "Had I known, I ___ differently.", ["would have acted", "had acted", "would act", "will act"], 0, "Inverted third conditional: had I known, I would have acted."),
  q("en-b2-2", "B2", "What does this mean?", "to take something for granted", ["etwas als selbstverständlich ansehen", "etwas geschenkt bekommen", "etwas gewähren", "etwas beantragen"], 0, "to take for granted — to assume without appreciating."),
  q("en-b2-3", "B2", "Which is correct?", "The report, ___ was published yesterday, is damning.", ["which", "that", "what", "who"], 0, "A non-defining clause after a comma takes which, never that."),
  q("en-b2-4", "B2", "What does this mean?", "It's a grey area.", ["Das ist eine Grauzone.", "Das ist trostlos.", "Das ist verboten.", "Das ist unklar formuliert."], 0, "a grey area — a matter not clearly governed by the rules."),
  q("en-b2-5", "B2", "Which is correct?", "Little ___ that the deal had collapsed.", ["did he know", "he knew", "he did know", "knew he"], 0, "A negative adverbial at the front inverts the subject and auxiliary."),
  q("en-b2-6", "B2", "What does this mean?", "to bring something up", ["etwas zur Sprache bringen", "etwas hochheben", "etwas erhöhen", "etwas erbrechen"], 0, "to bring up — to raise a subject."),
  q("en-b2-7", "B2", "Which is correct?", "I'd rather you ___ tell anyone.", ["didn't", "don't", "wouldn't", "won't"], 0, "would rather + past simple for another person's action."),
  q("en-b2-8", "B2", "What does this mean?", "That's beside the point.", ["Das gehört nicht zur Sache.", "Das ist nebenan.", "Das ist fast richtig.", "Das ist der Punkt."], 0, "beside the point — irrelevant."),

  // C1
  q("en-c1-1", "C1", "What does this mean?", "to hedge your bets", ["sich absichern", "wetten", "eine Hecke schneiden", "alles riskieren"], 0, "to hedge your bets — to avoid committing to one outcome."),
  q("en-c1-2", "C1", "Which is correct?", "Not until the results came in ___ the scale of it.", ["did we realise", "we realised", "we did realise", "realised we"], 0, "Not until at the front forces inversion."),
  q("en-c1-3", "C1", "What does this mean?", "a foregone conclusion", ["eine ausgemachte Sache", "eine voreilige Schlussfolgerung", "ein früherer Abschluss", "ein Vorwand"], 0, "a foregone conclusion — an outcome settled in advance."),
  q("en-c1-4", "C1", "What does this mean?", "to pay lip service to something", ["ein Lippenbekenntnis ablegen", "jemandem schmeicheln", "etwas laut vorlesen", "etwas bezahlen"], 0, "lip service — professed support not matched by action."),
  q("en-c1-5", "C1", "Which is correct?", "The proposal was rejected, ___ came as no surprise.", ["which", "that", "what", "it"], 0, "which can refer back to a whole clause; what and that cannot."),
  q("en-c1-6", "C1", "What does this mean?", "to be at loggerheads", ["sich in den Haaren liegen", "sich einig sein", "Holz hacken", "am Ende sein"], 0, "at loggerheads — in stubborn disagreement."),
  q("en-c1-7", "C1", "What does this mean?", "to gloss over something", ["etwas beschönigen", "etwas glänzend machen", "etwas erklären", "etwas übersetzen"], 0, "to gloss over — to skate past a difficulty."),
  q("en-c1-8", "C1", "What does this mean?", "with the benefit of hindsight", ["im Nachhinein betrachtet", "mit gutem Willen", "mit Weitblick", "zum Vorteil aller"], 0, "hindsight — understanding after the event."),
];

export function placementQuestions(direction: PlacementDirection): PlacementQuestion[] {
  return direction === "learn-en" ? EN : DE;
}

export function placementRound(
  direction: PlacementDirection,
  level: Cefr,
  random: () => number = Math.random,
  size = PLACEMENT_ROUND_SIZE
): PlacementQuestion[] {
  const pool = placementQuestions(direction).filter((question) => question.level === level);
  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled.slice(0, size);
}

/**
 * Where you stopped being right.
 *
 * `cleared` is every level whose round you passed. The placement is the
 * highest of them, or null when even A1 was not cleared — which is a real
 * answer, not a failure, and means starting at the beginning.
 */
export function assessPlacement(cleared: Cefr[]): Cefr | null {
  let best: Cefr | null = null;
  for (const level of PLACEMENT_LEVELS) {
    if (cleared.includes(level)) best = level;
  }
  return best;
}

export function nextPlacementLevel(level: Cefr): Cefr | null {
  const index = PLACEMENT_LEVELS.indexOf(level);
  return index >= 0 && index < PLACEMENT_LEVELS.length - 1 ? PLACEMENT_LEVELS[index + 1] : null;
}

/**
 * The pack Continue learning should start from, for an assessed level.
 *
 * Walks the curriculum in its real order and takes the first pack whose level
 * band opens at the assessed level. Bands like "A2-B1" count as A2 — the pack
 * starts there and climbs, so entering it at A2 is right and entering it as a
 * B1 would repeat work.
 *
 * Falls back down the ladder rather than to part1: somebody placed at C1 in a
 * catalogue whose hardest pack is B2 should start at the B2 pack, not at the
 * beginning.
 */
export function placementPartFor(level: Cefr | null, apiParts: Record<string, unknown>): string | null {
  if (!level) return null;
  const ordered = Object.keys(orderParts(apiParts as Record<string, any>));
  const bandStart = (key: string): string | null => {
    const part = apiParts[key] as { level?: unknown } | undefined;
    const raw = typeof part?.level === "string" ? part.level.trim() : "";
    if (!raw) return null;
    return raw.split("-")[0];
  };

  const from = PLACEMENT_LEVELS.indexOf(level);
  for (let index = from; index >= 0; index -= 1) {
    const wanted = PLACEMENT_LEVELS[index];
    const match = ordered.find((key) => bandStart(key) === wanted);
    if (match) return match;
  }
  return ordered[0] ?? null;
}
