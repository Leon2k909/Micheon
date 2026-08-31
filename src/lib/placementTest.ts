import { orderParts } from "@/lib/curriculum";
import type { LearningDirection } from "@/lib/direction";

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
export type PlacementDirection = LearningDirection;

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

// ── Learning French ─────────────────────────────────────────────────────────
//
// Every option here is FRENCH, which the other two banks are not: the German
// bank answers in English and the English one answers in German, because each
// knows what its learner already speaks. The French course does not — it is
// taken by German speakers and English speakers both, and its meaning column
// follows the interface language. A bank written in either of them would be
// unanswerable for half the people sitting it, so the questions ask about
// French from inside French: which form is right, and which word means the
// same thing. That is also how the real French placement tests are written.
const FR: PlacementQuestion[] = [
  // A1
  q("fr-a1-1", "A1", "Which is correct?", "___ m'appelle Marie.", ["Je", "Tu", "Il", "Nous"], 0, "Je m'appelle — the verb form goes with je."),
  q("fr-a1-2", "A1", "What does this mean?", "Bonsoir", ["le soir", "le matin", "la nuit", "à midi"], 0, "Bonsoir is the evening greeting; bonjour covers the rest of the day."),
  q("fr-a1-3", "A1", "Which article does it take?", "___ maison", ["la", "le", "les", "du"], 0, "Maison is feminine: la maison."),
  q("fr-a1-4", "A1", "Which is correct?", "Nous ___ français.", ["parlons", "parlez", "parle", "parlent"], 0, "-ons is the nous ending of an -er verb."),
  q("fr-a1-5", "A1", "What does this mean?", "merci beaucoup", ["un grand merci", "de rien", "s'il te plaît", "au revoir"], 0, "beaucoup makes the thanks bigger, not the reply to it."),
  q("fr-a1-6", "A1", "Which is correct?", "Il ___ trois chats.", ["a", "as", "ai", "ont"], 0, "il a — third person singular of avoir."),
  q("fr-a1-7", "A1", "What is the number?", "quarante-deux", ["42", "24", "52", "72"], 0, "quarante = 40, deux = 2."),
  q("fr-a1-8", "A1", "Which is correct?", "Elle habite ___ Paris.", ["à", "en", "au", "dans le"], 0, "à before a city; en and au are for countries."),

  // A2
  q("fr-a2-1", "A2", "Which is correct?", "Hier, je ___ au cinéma.", ["suis allé", "ai allé", "vais", "serai allé"], 0, "aller takes être in the passé composé."),
  q("fr-a2-2", "A2", "Which preposition?", "Je pense ___ toi.", ["à", "de", "en", "pour"], 0, "penser à quelqu'un — to have someone in mind."),
  q("fr-a2-3", "A2", "What does this mean?", "avoir envie de", ["vouloir", "devoir", "pouvoir", "oublier"], 0, "avoir envie de — to feel like, to want."),
  q("fr-a2-4", "A2", "Which is correct?", "Ce sont ___ amies.", ["mes", "mon", "ma", "me"], 0, "A plural noun takes the plural possessive."),
  q("fr-a2-5", "A2", "Which is correct?", "Je n'ai ___ compris.", ["rien", "personne", "aucun", "nulle part"], 0, "ne … rien for a thing; personne is for a person."),
  q("fr-a2-6", "A2", "What is the past tense?", "je prends", ["j'ai pris", "j'ai prendu", "j'ai prené", "je prenais pris"], 0, "prendre has the irregular participle pris."),
  q("fr-a2-7", "A2", "Which is correct?", "Elle est plus grande ___ moi.", ["que", "de", "comme", "à"], 0, "plus … que is the comparison."),
  q("fr-a2-8", "A2", "What does this mean?", "tout de suite", ["immédiatement", "plus tard", "parfois", "rarement"], 0, "tout de suite — right away."),

  // B1
  q("fr-b1-1", "B1", "Which is correct?", "Il faut que tu ___ là à huit heures.", ["sois", "es", "seras", "étais"], 0, "il faut que takes the subjunctive."),
  q("fr-b1-2", "B1", "What does this mean?", "ça vaut le coup", ["ça en vaut la peine", "ça coûte cher", "c'est un coup de chance", "c'est raté"], 0, "valoir le coup — to be worth it."),
  q("fr-b1-3", "B1", "Which is correct?", "Les fleurs que j'ai ___ sont belles.", ["achetées", "acheté", "achetés", "achetée"], 0, "With avoir the participle agrees with a direct object that comes first."),
  q("fr-b1-4", "B1", "Which preposition?", "Je m'occupe ___ ça.", ["de", "à", "en", "pour"], 0, "s'occuper de — to take care of."),
  q("fr-b1-5", "B1", "What does this mean?", "faire la grasse matinée", ["dormir tard", "prendre un gros petit-déjeuner", "travailler le matin", "sauter un repas"], 0, "It is about a long lie-in, not about breakfast."),
  q("fr-b1-6", "B1", "Which is correct?", "Si j'avais le temps, je ___ plus souvent.", ["viendrais", "viendrai", "venais", "serais venu"], 0, "si + imparfait pairs with the conditional."),
  q("fr-b1-7", "B1", "Which is correct?", "C'est le livre ___ je t'ai parlé.", ["dont", "que", "qui", "lequel"], 0, "parler DE quelque chose, so the relative pronoun is dont."),
  q("fr-b1-8", "B1", "What does this mean?", "du coup", ["donc", "d'un seul coup", "malgré tout", "en revanche"], 0, "du coup is the spoken so/therefore."),

  // B2
  q("fr-b2-1", "B2", "Which is correct?", "Bien qu'il ___ tard, ils continuent.", ["soit", "est", "sera", "était"], 0, "bien que takes the subjunctive."),
  q("fr-b2-2", "B2", "What does this mean?", "tirer les vers du nez à quelqu'un", ["lui soutirer des informations", "le soigner", "le taquiner", "le dénoncer"], 0, "It is getting someone to talk, question by question."),
  q("fr-b2-3", "B2", "Which is correct?", "Je m'attendais à ce qu'il ___.", ["vienne", "vient", "viendra", "venait"], 0, "à ce que takes the subjunctive."),
  q("fr-b2-4", "B2", "Which is the passive?", "On a annulé le concert.", ["Le concert a été annulé.", "Le concert s'est annulé.", "Le concert est en annulation.", "On est annulé le concert."], 0, "être + past participle, agreeing with the subject."),
  q("fr-b2-5", "B2", "What does this mean?", "quitte à", ["au risque de", "à condition de", "à part", "en partant de"], 0, "quitte à — even if it means."),
  q("fr-b2-6", "B2", "Which is correct?", "___ que je sache, personne n'a appelé.", ["Autant", "Tant", "Aussi", "Si loin"], 0, "autant que je sache — as far as I know."),
  q("fr-b2-7", "B2", "What does this mean?", "revoir sa copie", ["reprendre son travail depuis le début", "relire une lettre", "copier sur quelqu'un", "changer d'avis d'un coup"], 0, "The plan goes back to the drawing board."),
  q("fr-b2-8", "B2", "Which is correct?", "Il est parti sans que je m'en ___.", ["rende compte", "rends compte", "rendrai compte", "rendais compte"], 0, "sans que takes the subjunctive."),

  // C1
  q("fr-c1-1", "C1", "What does this mean?", "battre en brèche", ["réfuter", "renforcer", "contourner", "abattre un mur"], 0, "battre en brèche — to demolish an argument."),
  q("fr-c1-2", "C1", "Which is correct?", "Encore ___ le dossier soit complet.", ["faut-il que", "il faut que", "faut que", "faudrait-il"], 0, "Encore fronted forces the inversion faut-il."),
  q("fr-c1-3", "C1", "What does this mean?", "prêcher le faux pour savoir le vrai", ["dire une contre-vérité pour faire réagir", "mentir par habitude", "défendre une cause perdue", "faire un sermon"], 0, "You float something wrong so the other person corrects you."),
  q("fr-c1-4", "C1", "Which is correct?", "Il n'est pas exclu qu'elle ___ déjà partie.", ["soit", "est", "serait", "était"], 0, "il n'est pas exclu que takes the subjunctive."),
  q("fr-c1-5", "C1", "What does this mean?", "avoir maille à partir avec quelqu'un", ["avoir un différend avec lui", "partager quelque chose avec lui", "s'en aller avec lui", "lui devoir de l'argent"], 0, "maille here is an old coin, not a stitch — it is a quarrel."),
  q("fr-c1-6", "C1", "Which is correct?", "___ eu plus de temps, nous aurions terminé.", ["Eussions-nous", "Aurions-nous", "Ayons-nous", "Serions-nous"], 0, "The literary conditional inverts the pluperfect subjunctive."),
  q("fr-c1-7", "C1", "What does this mean?", "à l'aune de", ["à la mesure de", "à la place de", "au lieu de", "à l'écart de"], 0, "An aune was a measuring rod; the phrase means measured against."),
  q("fr-c1-8", "C1", "Which is correct?", "Les mesures qu'il a ___ prendre étaient impopulaires.", ["dû", "dues", "due", "dus"], 0, "dû before an infinitive stays invariable."),
];


// ── Learning Polish ─────────────────────────────────────────────────────────
//
// Written the way the French bank is, and for the same reason: every option is
// POLISH. The German bank answers in English and the English one answers in
// German, because each knows what its learner already speaks. The Polish
// course does not — it is taken by German speakers and English speakers both,
// and its meaning column follows the interface language. A bank written in
// either would be unanswerable for half the people sitting it, so the
// questions ask about Polish from inside Polish.
//
// One difference from the French bank: the right answer moves around. The
// options are rendered in the order they are written and nothing shuffles
// them, so a bank whose answer is always first can be passed without reading
// past the first line.
const PL: PlacementQuestion[] = [
  // A1
  q("pl-a1-1", "A1", "Which is correct?", "Jak ___ nazywasz?", ["siebie", "się", "sobie", "sam"], 1, "nazywać się — the reflexive pronoun is się."),
  q("pl-a1-2", "A1", "What does this mean?", "Dobry wieczór", ["rano", "w południe", "wieczorem", "w nocy"], 2, "Dobry wieczór is the evening greeting; dzień dobry covers the rest of the day."),
  q("pl-a1-3", "A1", "Which is correct?", "To ___ moja siostra.", ["są", "jest", "być", "jesteś"], 1, "jest — third person singular of być."),
  q("pl-a1-4", "A1", "Which is correct?", "Mam dwa ___.", ["psa", "psów", "psy", "pies"], 2, "After dwa the noun takes the plural: dwa psy."),
  q("pl-a1-5", "A1", "What is the number?", "czterdzieści dwa", ["24", "42", "52", "72"], 1, "czterdzieści = 40, dwa = 2."),
  q("pl-a1-6", "A1", "What does this mean?", "dziękuję bardzo", ["proszę", "do widzenia", "wielkie dzięki", "nie ma za co"], 2, "bardzo makes the thanks bigger, not the reply to it."),
  q("pl-a1-7", "A1", "Which is correct?", "Ona ___ po polsku.", ["mówię", "mówi", "mówisz", "mówią"], 1, "ona mówi — third person singular."),
  q("pl-a1-8", "A1", "Which is correct?", "Mieszkam ___ Warszawie.", ["do", "z", "w", "na"], 2, "w + locative for living in a city."),

  // A2
  q("pl-a2-1", "A2", "Which is correct?", "Wczoraj ___ do kina.", ["idę", "pójdę", "chodzę", "poszedłem"], 3, "poszedłem — one finished trip in the past."),
  q("pl-a2-2", "A2", "Which preposition?", "Czekam ___ autobus.", ["do", "na", "o", "za"], 1, "czekać na — to wait for."),
  q("pl-a2-3", "A2", "What does this mean?", "mieć ochotę na coś", ["musieć coś zrobić", "umieć coś", "chcieć czegoś", "zapomnieć o czymś"], 2, "mieć ochotę na — to feel like, to fancy."),
  q("pl-a2-4", "A2", "Which is correct?", "Nie lubię ___.", ["kawa", "kawę", "kawy", "kawą"], 2, "A negated verb takes the genitive: lubię kawę, but nie lubię kawy."),
  q("pl-a2-5", "A2", "What does this mean?", "Przepraszam.", ["proszę bardzo", "bardzo mi przykro", "dziękuję", "na razie"], 1, "Przepraszam does both apologising and getting attention."),
  q("pl-a2-6", "A2", "Which is correct?", "Idę ___ sklepu.", ["do", "na", "w", "przy"], 0, "do + genitive for going into a place."),
  q("pl-a2-7", "A2", "What does this mean?", "Wszystko mi jedno.", ["mam wszystko", "wszystko jest gotowe", "jestem sam", "nie ma dla mnie znaczenia"], 3, "Wszystko mi jedno — it makes no difference to me."),
  q("pl-a2-8", "A2", "Which is correct?", "Ona jest ___ ode mnie.", ["wysoko", "wyżej", "wyższa", "najwyższa"], 2, "A comparison of two people takes the comparative adjective: wyższa."),

  // B1
  q("pl-b1-1", "B1", "Which is correct?", "Zawsze ___ gazetę rano.", ["przeczytam", "czytam", "przeczytałem", "poczytam"], 1, "A habit takes the imperfective: zawsze czytam."),
  q("pl-b1-2", "B1", "What does this mean?", "Nie mam pojęcia.", ["nie chcę", "nie mogę", "nie wiem", "nie pamiętam"], 2, "pojęcie — notion; nie mam pojęcia is the everyday I have no idea."),
  q("pl-b1-3", "B1", "Which case follows?", "Nie widzę ___.", ["samochód", "samochodu", "samochodem", "samochodzie"], 1, "Negation turns the accusative object into a genitive one."),
  q("pl-b1-4", "B1", "What does this mean?", "To zależy.", ["to na pewno", "to niemożliwe", "to koniec", "zobaczymy, jak będzie"], 3, "To zależy — it depends."),
  q("pl-b1-5", "B1", "Which is correct?", "Chciałbym wiedzieć, ___ on przyjdzie.", ["że", "czy", "jeśli", "jak"], 1, "czy introduces an indirect yes/no question."),
  q("pl-b1-6", "B1", "What does this mean?", "przyzwyczaić się do czegoś", ["oswoić się z czymś", "zapomnieć o czymś", "zrezygnować z czegoś", "polubić kogoś"], 0, "przyzwyczaić się — to get used to something."),
  q("pl-b1-7", "B1", "Which is correct?", "Im więcej się uczę, ___ lepiej rozumiem.", ["niż", "jak", "tym", "tak"], 2, "im … tym — the more … the more."),
  q("pl-b1-8", "B1", "What does this mean?", "To się nie opłaca.", ["nie warto", "to jest zabronione", "to nie pasuje", "to jest darmowe"], 0, "opłacać się — to be worth it."),

  // B2
  q("pl-b2-1", "B2", "Which is correct?", "Zachowywał się tak, ___ nic nie słyszał.", ["chociaż", "jakby", "żeby", "więc"], 1, "jakby — as if."),
  q("pl-b2-2", "B2", "What does this mean?", "To nie ulega wątpliwości.", ["to jest wątpliwe", "to jest pytanie", "to jest pewne", "to jest niemożliwe"], 2, "ulegać wątpliwości — to be in doubt, so the negative says beyond doubt."),
  q("pl-b2-3", "B2", "Which is the passive?", "Dom ___ zbudowany w zeszłym roku.", ["ma", "został", "miał", "będzie mieć"], 1, "zostać + past participle forms the passive: został zbudowany."),
  q("pl-b2-4", "B2", "What does this mean?", "pogodzić się z czymś", ["znaleźć coś", "zapłacić za coś", "zorganizować coś", "zaakceptować coś"], 3, "pogodzić się z czymś — to come to terms with something."),
  q("pl-b2-5", "B2", "Which is correct?", "Chodzi ___ nieporozumienie.", ["o", "na", "za", "po"], 0, "chodzi o — it is a matter of."),
  q("pl-b2-6", "B2", "What does this mean?", "To rodzi pytanie.", ["to daje odpowiedź", "to każe zapytać", "to kończy dyskusję", "to powtarza pytanie"], 1, "rodzić pytanie — to raise a question."),
  q("pl-b2-7", "B2", "Which is correct?", "Zależy mi ___ tym.", ["o", "na", "w", "za"], 1, "zależeć komuś na czymś — to care about something."),
  q("pl-b2-8", "B2", "What does this mean?", "mieć czegoś powyżej uszu", ["słyszeć coś dobrze", "wiedzieć o czymś", "mieć czegoś dosyć", "lubić coś bardzo"], 2, "mieć czegoś powyżej uszu — to be fed up with something."),

  // C1
  q("pl-c1-1", "C1", "What does this mean?", "owijać w bawełnę", ["mówić szczerze", "mówić nie wprost", "milczeć", "mówić głośno"], 1, "owijać w bawełnę — to beat about the bush."),
  q("pl-c1-2", "C1", "Which is correct?", "Bez względu ___ okoliczności zachował spokój.", ["o", "w", "za", "na"], 3, "bez względu na — regardless of."),
  q("pl-c1-3", "C1", "What does this mean?", "naciągany", ["mało wiarygodny", "dobrze uzasadniony", "napięty", "świeży"], 0, "naciągany — far-fetched."),
  q("pl-c1-4", "C1", "Which register is formal written Polish?", "Pick the formal wording.", ["Dajcie znać.", "Napisz mi coś.", "Uprzejmie proszę o informację.", "No to jak, piszecie?"], 2, "Uprzejmie proszę o … is the standard formal request."),
  q("pl-c1-5", "C1", "What does this mean?", "przelać czarę goryczy", ["rozlać napój", "przepełnić miarę", "osłodzić coś", "zakończyć spór"], 1, "przelać czarę goryczy — the last straw."),
  q("pl-c1-6", "C1", "Which is correct?", "Postawiła ___ swoim.", ["po", "za", "na", "w"], 2, "postawić na swoim — to get one's way."),
  q("pl-c1-7", "C1", "What does this mean?", "stać pod znakiem zapytania", ["być pewnym", "być zapisanym", "być zakończonym", "być niepewnym"], 3, "stać pod znakiem zapytania — to be in question."),
  q("pl-c1-8", "C1", "What does this mean?", "rzucać słowa na wiatr", ["obiecywać bez pokrycia", "mówić bardzo głośno", "mówić o pogodzie", "szybko odpowiadać"], 0, "rzucać słowa na wiatr — to make empty promises."),
];

/**
 * SPANISH. Written to the same rule as the others: every question is answerable
 * from the language rather than from the shape of the options, and the note
 * says WHY rather than repeating the answer. The pairs Spanish learners
 * actually trip on — ser/estar, preterite/imperfect, indicative/subjunctive —
 * are what the levels are built from, and the C1 rows are idioms because that
 * is what separates someone fluent from someone correct.
 */
const ES: PlacementQuestion[] = [
  q("es-a1-1", "A1", "Which is correct?", "\u00bfC\u00f3mo ___ llamas?", ["te", "se", "me", "le"], 0, "llamarse \u2014 the reflexive pronoun for t\u00fa is te."),
  q("es-a1-2", "A1", "What does this mean?", "Buenas noches", ["por la ma\u00f1ana", "al mediod\u00eda", "por la tarde", "por la noche"], 3, "Buenas noches is the night greeting; buenos d\u00edas covers the morning."),
  q("es-a1-3", "A1", "Which is correct?", "Ella ___ mi hermana.", ["son", "es", "ser", "eres"], 1, "es \u2014 third person singular of ser."),
  q("es-a1-4", "A1", "Which is correct?", "Tengo dos ___.", ["perro", "perros", "el perro", "los perro"], 1, "A number above one takes the plural noun on its own."),
  q("es-a1-5", "A1", "What is the number?", "cuarenta y dos", ["24", "42", "52", "72"], 1, "cuarenta = 40, dos = 2."),
  q("es-a1-6", "A1", "What does this mean?", "muchas gracias", ["de nada", "adi\u00f3s", "much\u00edsimas gracias", "por favor"], 2, "muchas makes the thanks bigger, not the reply to it."),
  q("es-a1-7", "A1", "Which is correct?", "Nosotros ___ espa\u00f1ol.", ["hablo", "habla", "hablamos", "hablan"], 2, "nosotros hablamos \u2014 first person plural."),
  q("es-a1-8", "A1", "Which is correct?", "Vivo ___ Madrid.", ["a", "de", "en", "por"], 2, "en for the place you live in."),
  q("es-a2-1", "A2", "Which is correct?", "Ayer ___ al cine.", ["voy", "iba", "fui", "ir\u00e9"], 2, "fui \u2014 the preterite, because ayer closes the action."),
  q("es-a2-2", "A2", "Which is correct?", "___ gusta el caf\u00e9.", ["Yo", "Me", "Mi", "M\u00ed"], 1, "gustar takes an indirect object: the coffee pleases me."),
  q("es-a2-3", "A2", "What does this mean?", "hace fr\u00edo", ["it is cold", "he is cold", "it is hot", "he makes cold"], 0, "Weather is hacer plus a noun, not ser or estar."),
  q("es-a2-4", "A2", "Which is correct?", "Estoy ___ un libro.", ["leer", "leyendo", "le\u00eddo", "leo"], 1, "estar plus the gerund for what is happening now."),
  q("es-a2-5", "A2", "Which is correct?", "Es ___ alta que su hermana.", ["mas", "m\u00e1s", "muy", "tan"], 1, "m\u00e1s with the accent is the comparative; mas without it means but."),
  q("es-a2-6", "A2", "What does this mean?", "tengo que irme", ["I want to go", "I have to go", "I can go", "I am going"], 1, "tener que plus infinitive is obligation."),
  q("es-a2-7", "A2", "Which is correct?", "No hay ___ en la nevera.", ["algo", "nada", "nadie", "alguno"], 1, "Spanish doubles the negative: no ... nada."),
  q("es-a2-8", "A2", "Which is correct?", "\u00bf___ es tu cumplea\u00f1os?", ["Cu\u00e1ndo", "Cu\u00e1nto", "C\u00f3mo", "D\u00f3nde"], 0, "cu\u00e1ndo asks for a time."),
  q("es-b1-1", "B1", "Which is correct?", "Quiero que ___ conmigo.", ["vienes", "vengas", "viniste", "vendr\u00e1s"], 1, "A wish about someone else takes the subjunctive."),
  q("es-b1-2", "B1", "Which is correct?", "Si tuviera dinero, ___ un coche.", ["compro", "comprar\u00e9", "comprar\u00eda", "comprara"], 2, "Imperfect subjunctive in the if, conditional in the result."),
  q("es-b1-3", "B1", "What does this mean?", "llevo dos a\u00f1os aqu\u00ed", ["I came two years ago", "I have been here two years", "I am staying two years", "I took two years"], 1, "llevar plus a period is how long something has been going on."),
  q("es-b1-4", "B1", "Which is correct?", "Yo se lo ___ ayer.", ["di", "d\u00ed", "dio", "di\u00f3"], 0, "One syllable, so no accent \u2014 and dio is the third person."),
  q("es-b1-5", "B1", "Which is correct?", "El libro ___ le\u00ed es bueno.", ["que", "cual", "quien", "lo que"], 0, "que is the relative for a thing."),
  q("es-b1-6", "B1", "What does this mean?", "por si acaso", ["at last", "just in case", "by chance", "on purpose"], 1, "The phrase covers the thing you do in case."),
  q("es-b1-7", "B1", "Which is correct?", "Hace dos horas que ___.", ["esperando", "espero", "esper\u00e9", "esperar\u00e9"], 1, "hace ... que takes the present for something still going on."),
  q("es-b1-8", "B1", "Which is correct?", "Me alegro de que ___ aqu\u00ed.", ["est\u00e1s", "est\u00e9s", "estabas", "estar\u00e1s"], 1, "An emotion about someone else takes the subjunctive."),
  q("es-b2-1", "B2", "Which is correct?", "Aunque ___ caro, lo comprar\u00eda.", ["es", "sea", "fuera", "ser\u00e1"], 2, "A hypothetical concession pairs the imperfect subjunctive with the conditional."),
  q("es-b2-2", "B2", "What does this mean?", "echar de menos", ["to throw away", "to miss someone", "to lose count", "to add less"], 1, "Nothing in the words says it; it is simply the phrase for missing."),
  q("es-b2-3", "B2", "Which is correct?", "En cuanto ___, te llamo.", ["llego", "llegue", "llegar\u00e9", "llegaba"], 1, "A time clause about the future takes the subjunctive."),
  q("es-b2-4", "B2", "Which is correct?", "Es la mejor pel\u00edcula que ___ visto.", ["he", "haya", "hab\u00eda", "habr\u00eda"], 1, "A superlative followed by que takes the subjunctive."),
  q("es-b2-5", "B2", "What does this mean?", "dar por sentado", ["to sit down", "to take for granted", "to offer a seat", "to settle a debt"], 1, "sentado here is settled, not seated."),
  q("es-b2-6", "B2", "Which is correct?", "Se ___ construido tres puentes.", ["ha", "han", "hab\u00edan", "hubo"], 1, "The passive se agrees with what was built, and three bridges are plural."),
  q("es-b2-7", "B2", "What does this mean?", "a duras penas", ["with great sorrow", "hardly, barely", "with hard labour", "in great pain"], 1, "It measures how narrowly something happened."),
  q("es-b2-8", "B2", "Which is correct?", "Lo hizo sin que nadie lo ___.", ["supo", "sab\u00eda", "supiera", "sabr\u00e1"], 2, "sin que always takes the subjunctive."),
  q("es-c1-1", "C1", "What does this mean?", "no tener pelos en la lengua", ["to be speechless", "to speak bluntly", "to have a sore throat", "to talk very fast"], 1, "Nothing slows the words down."),
  q("es-c1-2", "C1", "Which is correct?", "De haberlo sabido, ___ venido.", ["habr\u00eda", "hab\u00eda", "hubiera de", "he"], 0, "de plus infinitive replaces the if, and the result stays conditional."),
  q("es-c1-3", "C1", "What does this mean?", "estar en el aire", ["estar volando", "estar sin decidir", "estar contento", "estar cansado"], 1, "Said of a plan nobody has settled yet."),
  q("es-c1-4", "C1", "Which is correct?", "Por m\u00e1s que lo ___, no lo entiendo.", ["intento", "intente", "intentaba", "intentar\u00e9"], 1, "por m\u00e1s que takes the subjunctive when the effort is general."),
  q("es-c1-5", "C1", "What does this mean?", "a ra\u00edz de", ["at the root of", "as a result of", "in spite of", "in the middle of"], 1, "The root is what it grew from, so the phrase means following on from."),
  q("es-c1-6", "C1", "Which is correct?", "Ojal\u00e1 ___ venido antes.", ["has", "hab\u00edas", "hubieras", "habr\u00edas"], 2, "Ojal\u00e1 about the past takes the pluperfect subjunctive."),
  q("es-c1-7", "C1", "What does this mean?", "tirar la toalla", ["to do the laundry", "to give up", "to throw a party", "to waste money"], 1, "The same towel a boxer's corner throws in."),
  q("es-c1-8", "C1", "Which is correct?", "Fue \u00e9l quien ___ la idea.", ["propone", "propuso", "proponga", "propondr\u00eda"], 1, "The cleft keeps the tense of the event, which is past."),
];

// ── Learning Portuguese (European Portuguese) ──────────────────────────────
const PT: PlacementQuestion[] = [
  // A1
  q("pt-a1-1", "A1", "Which is correct?", "Como te ___?", ["chamas", "chama", "chamo", "chamam"], 0, "Como te chamas? is the informal European Portuguese way to ask someone's name."),
  q("pt-a1-2", "A1", "What does this mean?", "Bom dia", ["good night", "good morning", "goodbye", "please"], 1, "Bom dia is the normal morning greeting."),
  q("pt-a1-3", "A1", "Which is correct?", "Eu ___ de Londres.", ["sou", "estou", "tenho", "vou"], 0, "ser is used for origin: sou de Londres."),
  q("pt-a1-4", "A1", "What does this mean?", "a casa", ["the street", "the house", "the city", "the station"], 1, "a casa means the house/home."),
  q("pt-a1-5", "A1", "Which is correct?", "Tenho duas ___.", ["irmã", "irmãs", "irmãos", "a irmã"], 1, "duas requires the feminine plural irmãs."),
  q("pt-a1-6", "A1", "What does this mean?", "Não percebo.", ["I don't understand.", "I don't want it.", "I don't know him.", "I can't go."], 0, "Não percebo is a very common way to say I don't understand."),
  q("pt-a1-7", "A1", "Which is correct?", "Queria um café, ___.", ["obrigado", "desculpa", "por favor", "amanhã"], 2, "por favor makes the request polite."),
  q("pt-a1-8", "A1", "What is the number?", "sete", ["five", "six", "seven", "nine"], 2, "sete means seven."),

  // A2
  q("pt-a2-1", "A2", "Which is correct?", "Ontem ___ ao cinema.", ["vou", "fui", "ia", "irei"], 1, "fui is the completed past form of ir used with ontem."),
  q("pt-a2-2", "A2", "What does this mean?", "Tenho de ir.", ["I want to go.", "I have to go.", "I can go.", "I went already."], 1, "ter de + infinitive expresses obligation in European Portuguese."),
  q("pt-a2-3", "A2", "Which is correct?", "Estou ___ um livro.", ["ler", "a ler", "lido", "leio"], 1, "European Portuguese normally uses estar a + infinitive for an action happening now."),
  q("pt-a2-4", "A2", "Which is correct?", "Moro ___ Lisboa.", ["a", "de", "em", "por"], 2, "morar em means to live in a place."),
  q("pt-a2-5", "A2", "What does this mean?", "Está frio.", ["It is cold.", "He is ill.", "It is late.", "It is raining."], 0, "Está frio means it is cold."),
  q("pt-a2-6", "A2", "Which is correct?", "Ela é mais alta ___ a irmã.", ["de", "do que", "como", "para"], 1, "mais ... do que forms a comparison."),
  q("pt-a2-7", "A2", "Which is correct?", "Não há ___ no frigorífico.", ["algo", "nada", "ninguém", "algum"], 1, "não há nada means there is nothing."),
  q("pt-a2-8", "A2", "What does this mean?", "Ligo-te amanhã.", ["I'll call you tomorrow.", "I saw you yesterday.", "I'll wait here.", "I'll write it down."], 0, "ligar a alguém means to phone someone; ligo-te is the European Portuguese clitic form."),

  // B1
  q("pt-b1-1", "B1", "Which is correct?", "Quero que ___ comigo.", ["vens", "venhas", "vieste", "virás"], 1, "querer que introduces the present subjunctive: venhas."),
  q("pt-b1-2", "B1", "What does this mean?", "Estou cá há dois anos.", ["I arrived two years ago.", "I've been here for two years.", "I'll stay for two years.", "I left two years ago."], 1, "há + duration describes how long an ongoing situation has lasted."),
  q("pt-b1-3", "B1", "Which is correct?", "Se tiver tempo, ___ contigo.", ["vou", "ia", "fosse", "teria ido"], 0, "A real future condition uses the future subjunctive tiver and a normal future/present result."),
  q("pt-b1-4", "B1", "What does this mean?", "Depende.", ["It depends.", "It is forbidden.", "It is enough.", "It is missing."], 0, "Depende is the everyday answer for it depends."),
  q("pt-b1-5", "B1", "Which is correct?", "Ainda não sei ___ ele vem.", ["que", "se", "quando de", "porque de"], 1, "se introduces an indirect yes/no question: whether he is coming."),
  q("pt-b1-6", "B1", "Which is correct?", "Já me habituei ___ acordar cedo.", ["a", "de", "por", "com"], 0, "habituar-se a means to get used to something."),
  q("pt-b1-7", "B1", "What does this mean?", "Não vale a pena.", ["It isn't worth it.", "It isn't allowed.", "It isn't ready.", "It isn't expensive."], 0, "não vale a pena means it is not worth it."),
  q("pt-b1-8", "B1", "Which is correct?", "Quanto mais estudo, ___ percebo.", ["menos que", "mais", "tanto", "muito de"], 1, "quanto mais ... mais is the Portuguese 'the more ... the more' pattern."),

  // B2
  q("pt-b2-1", "B2", "Which is correct?", "Ele agiu como se não ___ nada.", ["sabe", "soubesse", "soube", "saberá"], 1, "como se calls for the imperfect subjunctive: soubesse."),
  q("pt-b2-2", "B2", "What does this mean?", "Isso está fora de questão.", ["That is beyond doubt.", "That is out of the question.", "That is unanswered.", "That is beside the point."], 1, "fora de questão means out of the question."),
  q("pt-b2-3", "B2", "Which is correct?", "A ponte ___ construída no ano passado.", ["foi", "teve", "fez", "era de"], 0, "ser + past participle forms the passive: foi construída."),
  q("pt-b2-4", "B2", "Which is correct?", "Embora ___ caro, comprei-o.", ["é", "seja", "foi de", "será"], 1, "embora normally introduces the subjunctive: seja."),
  q("pt-b2-5", "B2", "What does this mean?", "Tenho saudades tuas.", ["I'm worried about you.", "I miss you.", "I owe you.", "I remember your name."], 1, "ter saudades de alguém means to miss someone."),
  q("pt-b2-6", "B2", "Which is correct?", "Assim que ___, telefono-te.", ["chego", "chegar", "cheguei", "chegava"], 1, "A future time clause after assim que uses the future subjunctive; for regular -ar verbs it looks like the infinitive."),
  q("pt-b2-7", "B2", "What does this mean?", "dar-se conta de", ["to give a discount", "to realise", "to settle a bill", "to introduce oneself"], 1, "dar-se conta de means to realise or become aware of."),
  q("pt-b2-8", "B2", "Which is correct?", "Fê-lo sem que ninguém ___.", ["sabe", "soubesse", "soube", "saberá"], 1, "sem que takes the subjunctive: soubesse."),

  // C1
  q("pt-c1-1", "C1", "What does this mean?", "não ter papas na língua", ["to be speechless", "to speak very frankly", "to speak too quietly", "to forget a word"], 1, "não ter papas na língua describes someone who speaks frankly without holding back."),
  q("pt-c1-2", "C1", "Which is correct?", "Se o tivesse sabido, ___ mais cedo.", ["viria", "teria vindo", "vim", "venho"], 1, "A counterfactual past condition takes tivesse + participle and teria + participle."),
  q("pt-c1-3", "C1", "What does this mean?", "ficar em águas de bacalhau", ["to become very expensive", "to come to nothing", "to become obvious", "to change the subject"], 1, "ficar em águas de bacalhau means that a plan or matter came to nothing."),
  q("pt-c1-4", "C1", "Which is correct?", "Por mais que ___, não consigo.", ["tento", "tente", "tentarei", "tentava"], 1, "por mais que generally takes the subjunctive when expressing concession."),
  q("pt-c1-5", "C1", "What does this mean?", "na sequência de", ["before", "as a result/following", "despite", "instead of"], 1, "na sequência de means following or as a result of something."),
  q("pt-c1-6", "C1", "Which is correct?", "Oxalá ___ vindo mais cedo.", ["tenhas", "tinhas", "terias", "tens"], 0, "oxalá about a completed past possibility can take the perfect subjunctive: tenhas vindo."),
  q("pt-c1-7", "C1", "What does this mean?", "deitar a toalha ao chão", ["to do the laundry", "to give up", "to celebrate", "to waste time"], 1, "The expression literally throws the towel down and means to give up."),
  q("pt-c1-8", "C1", "Which is correct?", "Foi ele quem ___ a ideia.", ["propôs", "proponha", "propunha de", "proporia de"], 0, "The event is completed in the past, so propôs is the natural form here."),
];

/**
 * Russian, A1 to C1 like every other bank.
 *
 * It was going to stop at A2, where the vocabulary stops — and the gate was
 * right to refuse that. The test walks UP the levels, so a level with no
 * questions is an empty round rather than a short course: somebody who
 * answers the A2 set correctly would be asked nothing at all.
 *
 * Written in Cyrillic throughout, because the placement test is where a
 * learner finds out whether they can read it. Somebody who has chosen the
 * Latin setting still sees Cyrillic here, and that is the point.
 *
 * The upper levels lean on the things Russian actually tests at that level —
 * the cases a verb governs, motion verbs, and the idioms, which cannot be
 * worked out from their parts.
 */
const RU: PlacementQuestion[] = [
  // A1
  q("ru-a1-1", "A1", "Which is correct?", "Как тебя ___?", ["зовут", "зовёшь", "зову", "звать"], 0, "Как тебя зовут? is how you ask someone's name."),
  q("ru-a1-2", "A1", "What does this mean?", "Здравствуйте", ["goodbye", "hello", "thank you", "please"], 1, "Здравствуйте is the formal greeting."),
  q("ru-a1-3", "A1", "Which is correct?", "Я ___ в Москве.", ["живу", "живёшь", "живёт", "жить"], 0, "First person singular of жить is живу."),
  q("ru-a1-4", "A1", "What does this mean?", "дом", ["the street", "the house", "the city", "the station"], 1, "дом is a house or home."),
  q("ru-a1-5", "A1", "Which is correct?", "У меня ___ сестра.", ["есть", "быть", "имею", "иметь"], 0, "Russian says possession with у меня есть."),
  q("ru-a1-6", "A1", "What does this mean?", "спасибо", ["please", "sorry", "thank you", "hello"], 2, "спасибо is thank you."),
  q("ru-a1-7", "A1", "Which is correct?", "Это ___ книга.", ["моя", "мой", "моё", "мои"], 0, "книга is feminine, so the possessive is моя."),
  q("ru-a1-8", "A1", "What does this mean?", "хорошо", ["badly", "well", "quickly", "slowly"], 1, "хорошо is well or good."),
  // A2
  q("ru-a2-1", "A2", "Which is correct?", "Я живу ___ Москве.", ["в", "на", "к", "из"], 0, "Cities take в with the prepositional case."),
  q("ru-a2-2", "A2", "What does this mean?", "Мне нужно идти.", ["I want to go", "I have to go", "I can go", "I like going"], 1, "мне нужно expresses necessity, not desire."),
  q("ru-a2-3", "A2", "Which is correct?", "Вчера я ___ книгу.", ["читаю", "читал", "буду читать", "читать"], 1, "вчера needs the past tense."),
  q("ru-a2-4", "A2", "What does this mean?", "Сколько это стоит?", ["Where is it?", "How much is it?", "What is it?", "When is it?"], 1, "сколько стоит asks the price."),
  q("ru-a2-5", "A2", "Which is correct?", "Он идёт ___ работу.", ["на", "в", "к", "у"], 0, "работа takes на, not в — one of the pairs that has to be learned."),
  q("ru-a2-6", "A2", "What does this mean?", "Ничего страшного.", ["It is terrible", "It is nothing to worry about", "Nothing happened", "It is frightening"], 1, "It reassures rather than describes, despite страшный meaning frightening."),
  q("ru-a2-7", "A2", "Which is correct?", "У меня нет ___.", ["время", "времени", "временем", "времена"], 1, "нет takes the genitive: времени."),
  q("ru-a2-8", "A2", "What does this mean?", "Я не совсем понимаю.", ["I understand completely", "I do not quite understand", "I do not want to understand", "I understood"], 1, "не совсем softens it to not quite."),
  // B1
  q("ru-b1-1", "B1", "Which is correct?", "Если бы у меня было время, я ___ тебе.", ["помог бы", "помогу", "помогал", "помочь"], 0, "An unreal condition takes бы with the past form."),
  q("ru-b1-2", "B1", "What does this mean?", "Мне всё равно.", ["I agree", "I do not mind", "I am equal to it", "It is all the same size"], 1, "It says the speaker has no preference."),
  q("ru-b1-3", "B1", "Which is correct?", "Я занимаюсь ___.", ["спортом", "спорт", "спорта", "спорте"], 0, "заниматься governs the instrumental."),
  q("ru-b1-4", "B1", "What does this mean?", "Он вышел из себя.", ["He left the house", "He lost his temper", "He went out alone", "He came to his senses"], 1, "Literally he went out of himself, and it means he lost his temper."),
  q("ru-b1-5", "B1", "Which is correct?", "Она ___ в Петербург на прошлой неделе и уже вернулась.", ["ездила", "ехала", "едет", "поедет"], 0, "A completed there-and-back trip takes ездила, not ехала."),
  // B2
  q("ru-b2-1", "B2", "Which is correct?", "Несмотря ___ дождь, мы пошли гулять.", ["на", "в", "за", "о"], 0, "несмотря is always followed by на."),
  q("ru-b2-2", "B2", "What does this mean?", "Это мне не по карману.", ["I cannot afford it", "I do not like it", "It does not fit me", "I left it in my pocket"], 0, "не по карману is about price, not about pockets."),
  q("ru-b2-3", "B2", "Which is correct?", "Книга, ___ я читаю, очень интересная.", ["которую", "которая", "которой", "которых"], 0, "The relative pronoun takes the case its own clause needs, here accusative."),
  q("ru-b2-4", "B2", "What does this mean?", "Он бьёт баклуши.", ["He works hard", "He is idling", "He is fighting", "He is cooking"], 1, "An idiom for doing nothing; баклуши are not used outside it."),
  q("ru-b2-5", "B2", "Which is correct?", "Я привык ___ рано.", ["вставать", "встать", "встаю", "вставал"], 0, "привыкнуть takes an imperfective infinitive for a habit."),
  // C1
  q("ru-c1-1", "C1", "What does this mean?", "Он работает спустя рукава.", ["He works carelessly", "He works with his sleeves rolled up", "He works overtime", "He works from home"], 0, "Sleeves hanging down, so the work is done without care — the opposite of the English picture."),
  q("ru-c1-2", "C1", "Which is correct?", "___ на трудности, проект завершили вовремя.", ["Невзирая", "Невзирать", "Невзиравший", "Невзирав"], 0, "The adverbial participle невзирая is the fixed form here."),
  q("ru-c1-3", "C1", "What does this mean?", "Это палка о двух концах.", ["It is a double-edged sword", "It is a long stick", "It is the end of the road", "It has two solutions"], 0, "A stick with two ends: whatever you do cuts both ways."),
  q("ru-c1-4", "C1", "Which is correct?", "Будучи студентом, он ___ в библиотеке.", ["подрабатывал", "подрабатывать", "подработает", "подработав"], 0, "будучи sets a past frame, so the finite verb is past imperfective."),
  q("ru-c1-5", "C1", "What does this mean?", "У него денег куры не клюют.", ["He has no money at all", "He has money to burn", "He keeps chickens", "He spends money on food"], 1, "So much money that even the hens will not peck at it."),
];

export function placementQuestions(direction: PlacementDirection): PlacementQuestion[] {
  if (direction === "learn-en") return EN;
  if (direction === "learn-fr") return FR;
  if (direction === "learn-pl") return PL;
  if (direction === "learn-es") return ES;
  if (direction === "learn-pt") return PT;
  if (direction === "learn-ru") return RU;
  return DE;
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
