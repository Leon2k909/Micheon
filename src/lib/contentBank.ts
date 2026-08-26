import { Part, Phrase, TranslationQuestion } from "./types";
import { curatedTopics } from "./phrasebank";
import { normalize } from "./api";
import tatoebaRaw from "./tatoeba.de-en.json";
import { getLearningDirection, type LearningDirection } from "./direction";
import { frenchParts, hasFrench } from "./frenchCourse";
import { hasPolish, polishParts } from "./polishCourse";

/**
 * Bundled, always-available content.
 *
 * Two offline sources are turned into the app's standard `Part` shape:
 *   1. The hand-curated phrasebank (curatedTopics) — themed teaching lessons.
 *   2. A filtered slice of the Tatoeba corpus — thousands of real sentences.
 *
 * This is the reliability floor: it works with no network at all. The remote
 * APIs in api.ts only ever merge *on top* of what these builders produce.
 */

interface RawSentence {
  de: string;
  en: string;
  level: string;
  short?: string;
  shortEn?: string;
  use?: string;
}

// Corpus translations are useful raw material, but learner-facing copy must
// be natural and preserve the speaker. Keep confident, reviewed corrections
// here instead of teaching a technically possible but confusing construction
// or silently changing German "ich" into English "you/we".
const TATOEBA_CORRECTIONS: Record<string, Partial<RawSentence>> = {
  "Ich glaube, dir ist nicht klar, wie wichtig das ist.": {
    // British spelling leads the display; the corpus original stays as
    // the accepted alternative.
    en: "I don't think you realise how important this is. / I don't think you realize how important this is.",
  },
  "Ich gebe zu, dass ich es nicht verstehe.": {
    en: "I admit I don't understand.",
    use: "Natural, but more deliberate than the everyday repair phrase 'Ich hab das nicht ganz verstanden.' Learn this later when you specifically want to admit or acknowledge something.",
  },
  "Sie müssen nicht mit, wenn Sie nicht wollen.": {
    en: "You don't have to come along if you don't want to.",
    use: "'Sie' and 'nicht' each appear twice on purpose: the first half says there is no obligation, and the second says 'if you don't want to'. In everyday German, 'mit' can stand for the full verb 'mitkommen' when the activity is already clear.",
  },
  "Ich glaube, ich habe alles, was ich brauche.": {
    use: "The comma after 'glaube' is correct. German separates the short lead-in 'Ich glaube' from the complete thought that follows, just as it does after 'Ich denke'.",
  },
  "Was ich sagen wollte, war, dass ich das nicht tun wollte.": {
    de: "Ich meinte damit, dass ich das nicht tun wollte.",
    en: "What I meant was that I didn't want to do that.",
    use: "'Ich meinte damit, dass ...' states the intended meaning directly and avoids an unnecessarily heavy sentence frame.",
  },
  "Was ich sagen wollte, ist, dass Sie das nicht tun sollten.": {
    de: "Ich wollte damit sagen, dass Sie das nicht tun sollten.",
    en: "What I meant was that you shouldn't do that.",
    use: "'Ich wollte damit sagen, dass ...' is the natural formal-address way to clarify what you meant.",
  },
  "Was ich sagen wollte, ist, dass du das nicht tun solltest.": {
    de: "Ich wollte damit sagen, dass du das nicht tun solltest.",
    en: "What I meant was that you shouldn't do that.",
    use: "'Ich wollte damit sagen, dass ...' is a natural way to clarify your earlier point.",
  },
  "Was ich will, ist, dass Sie zuhören, was ich zu sagen habe.": {
    de: "Ich will, dass Sie mir zuhören.",
    en: "I want you to listen to me.",
    use: "This direct request is natural but firm. 'mir zuhören' means listening to what I am saying.",
  },
  "Was ich will, ist, dass du zuhörst, was ich zu sagen habe.": {
    de: "Ich will, dass du mir zuhörst.",
    en: "I want you to listen to me.",
    use: "This direct request is natural but firm. Use a calm tone when the conversation is tense.",
  },
  "Es ist wie es ist.": {
    de: "So ist es nun mal.",
    en: "That's just the way it is. / That's just how it is.",
    use: "'nun mal' is a very common spoken way to accept that a situation cannot easily be changed.",
  },
  "Du weißt nicht wie es ist, arm zu sein.": {
    de: "Du weißt nicht, wie es ist, arm zu sein.",
    en: "You don't know what it's like to be poor.",
    use: "The commas separate the thing someone does not know and the situation being described.",
  },
  "Ich verstehe nicht was sie gesagt hat.": {
    de: "Ich verstehe nicht, was sie gesagt hat.",
    en: "I can't make out what she said. / I don't understand what she said.",
    use: "A comma belongs before the full 'what she said' part in German.",
  },
  "Wir wissen was zu tun ist.": {
    de: "Wir wissen, was zu tun ist.",
    en: "We know what to do.",
    use: "The comma separates 'we know' from what is known.",
  },
  "Es ist wichtiger was du bist als das, was du hast.": {
    de: "Wer du bist, ist wichtiger als das, was du hast.",
    en: "Who you are is more important than what you have.",
    use: "'Wer du bist' is the natural way to talk about who someone is as a person.",
  },
  "Sagen Sie „bitte“ .": {
    de: "Sagen Sie „bitte“.",
    en: "Say 'please'.",
  },
  "Ich verstehe warum.": {
    de: "Ich verstehe, warum.",
    use: "A comma separates 'I understand' from the implied reason that follows.",
  },
  "Für was ist das?": {
    de: "Wofür ist das?",
    use: "'Wofür' is the normal compact way to ask what something is for.",
  },
  "Zu was ist es gut?": {
    de: "Wozu ist das gut?",
    en: "What is that good for? / What is the point of that?",
    use: "'Wozu' sounds more natural here than the separated 'zu was'.",
  },
  "Für was bin ich hier?": {
    de: "Wofür bin ich hier?",
    use: "'Wofür' is the normal neutral form; 'für was' is regional or very casual.",
  },
  "Zu was sind die gut?": {
    de: "Wozu sind die gut?",
    en: "What are they good for?",
    use: "Use 'wozu' when asking about the purpose of something.",
  },
  "Ich weiß nicht, von was Sie sprechen.": {
    de: "Ich weiß nicht, wovon Sie sprechen.",
    en: "I don't know what you're talking about.",
    use: "'wovon' is the normal compact form for 'what ... about' in this sentence.",
  },
  "Für was, denkst du, ist das?": {
    de: "Was meinst du, wofür ist das?",
    en: "What do you think this is for?",
    use: "This is the natural spoken order when asking someone to guess an object's purpose.",
  },
  "Ich verstehe nicht, zu was das gut sein soll.": {
    de: "Ich verstehe nicht, wozu das gut sein soll.",
    en: "I don't see what good that will do.",
    use: "'wozu' is the usual form when questioning the point or purpose of something.",
  },
  "Es ist nicht an mir, das zu entscheiden.": {
    de: "Das ist nicht meine Entscheidung.",
    use: "This is the normal direct way to say that the decision belongs to someone else. 'Es ist nicht an mir, das zu entscheiden' is understandable, but it sounds formal and translated rather than conversational.",
  },
  "Es ist, was es ist.": {
    de: "Es ist so, wie es ist.",
    short: "Es ist, wie es ist.",
    shortEn: "It is what it is.",
    use: "Everyday German uses 'wie' here. The shorter 'Es ist, wie es ist' is the form people normally say.",
  },
  "Das ist, was ich mag.": {
    de: "Das ist das, was ich mag.",
    short: "Das mag ich.",
    shortEn: "I like that. / That's what I like.",
  },
  "Das ist, was ich denke.": {
    de: "Das ist das, was ich denke.",
    short: "Das denke ich.",
    shortEn: "That's what I think.",
  },
  "Das ist, was ich dachte.": {
    de: "Das ist das, was ich früher gedacht habe.",
    short: "Das habe ich früher gedacht.",
    shortEn: "That's what I used to think.",
  },
  "Das ist, was sie sagte.": {
    de: "Das ist das, was sie gesagt hat.",
    short: "Das hat sie gesagt.",
    shortEn: "That's what she said.",
  },
  "Das ist, was wir machen.": {
    de: "Das ist das, was wir machen.",
    short: "Das machen wir.",
    shortEn: "That's what we do.",
  },
  "Das ist, was ich mache.": {
    de: "Das ist das, was ich gerade mache.",
    short: "Das mache ich gerade.",
    shortEn: "That's what I'm doing. / Here's what I'm doing.",
  },
  "Das ist, was ich sage.": {
    de: "Das ist das, was ich sage.",
    short: "Das sage ich.",
    shortEn: "That's what I say.",
  },
  "Das ist, was ich tue.": {
    de: "Das ist das, was ich tue.",
    short: "Das tue ich.",
    shortEn: "That's what I do.",
  },
  "Das ist, was ich gesagt habe.": {
    de: "Das ist das, was ich gesagt habe.",
    short: "Das habe ich gesagt.",
    shortEn: "That's what I said.",
  },
  "Es ist nicht, was ich dachte.": {
    de: "Es ist nicht so, wie ich dachte.",
  },
  "Das ist, was ich ihr gesagt habe.": {
    de: "Das ist das, was ich ihr gesagt habe.",
    short: "Das habe ich ihr gesagt.",
    shortEn: "That's what I told her.",
  },
  "Das ist, was ich gesehen habe.": {
    de: "Das ist das, was ich gesehen habe.",
    short: "Das habe ich gesehen.",
    shortEn: "That's what I saw.",
  },
  "Das ist, was ich gut kann.": {
    de: "Das ist das, was ich gut kann.",
    short: "Das kann ich gut.",
    shortEn: "That's what I'm good at. / I'm good at that.",
  },
  "Das ist, was ich gehört habe.": {
    de: "Das ist das, was ich gehört habe.",
    short: "Das habe ich gehört.",
    shortEn: "That's what I heard.",
  },
  "Das ist, was ich tun möchte.": {
    de: "Das ist das, was ich machen möchte.",
    short: "Das möchte ich machen.",
    shortEn: "That's what I want to do. / Here's what I want to do.",
  },
  "Das ist, was ich tun muss.": {
    de: "Das ist das, was ich tun muss.",
    short: "Das muss ich tun.",
    shortEn: "That's what I have to do.",
  },
  "Das ist, was ich wirklich will.": {
    de: "Das ist genau das, was ich wirklich will.",
    short: "Genau das will ich.",
    shortEn: "That's exactly what I want.",
  },
  "Das ist, was er gesagt hat.": {
    de: "Das ist das, was er gesagt hat.",
    short: "Das hat er gesagt.",
    shortEn: "That's what he said.",
  },
  "Du weißt, das ist, was ich will.": {
    de: "Du weißt, dass ich das will.",
  },
  "Das ist, was du mir gesagt hast.": {
    de: "Das ist das, was du mir gesagt hast.",
    short: "Das hast du mir gesagt.",
    shortEn: "That's what you told me.",
  },
  "Ich glaube, das ist, was passiert ist.": {
    de: "Ich glaube, genau das ist passiert.",
  },
  "Das ist, was ich ihnen sagte.": {
    de: "Das ist das, was ich ihnen gesagt habe.",
    short: "Das habe ich ihnen gesagt.",
    shortEn: "That's what I told them.",
  },
  "Ich denke, das ist, was passiert ist.": {
    de: "Ich denke, genau das ist passiert.",
  },
  "Das ist, was wir gesehen haben.": {
    de: "Das ist das, was wir gesehen haben.",
    short: "Das haben wir gesehen.",
    shortEn: "That's what we saw.",
  },
  "Ich glaube, das ist, was Sie suchen.": {
    de: "Ich glaube, das ist das, was Sie suchen.",
    short: "Ich glaube, das suchen Sie.",
    shortEn: "I think that's what you're looking for.",
  },
  "Es ist nicht an dir, das zu entscheiden.": {
    de: "Das ist nicht deine Entscheidung.",
    use: "The direct everyday sentence is 'Das ist nicht deine Entscheidung'. It can sound firm, so tone matters.",
  },
  "Das ist, was ich verstehen möchte.": {
    de: "Das ist genau das, was ich verstehen möchte.",
    short: "Genau das möchte ich verstehen.",
    shortEn: "That's exactly what I want to understand.",
  },
  "Das ist, was sich so tut.": {
    de: "So sieht es gerade aus.",
    en: "That's how things are right now. / That's what's going on.",
  },
  "Das ist, was ich immer sage.": {
    de: "Das ist das, was ich immer sage.",
    short: "Das sage ich immer.",
    shortEn: "That's what I always say.",
  },
  "Das ist, was ich gerne wissen würde.": {
    de: "Das ist genau das, was ich gern wissen würde.",
    short: "Genau das würde ich gern wissen.",
    shortEn: "That's exactly what I'd like to know.",
  },
  "Das ist, was ich gerne mache.": {
    de: "Das ist das, was ich gern mache.",
    short: "Das mache ich gern.",
    shortEn: "That's what I like doing. / I like doing that.",
  },
  "Glaubst du, dass es das ist, was ich möchte.": {
    de: "Glaubst du, dass ich das will?",
    en: "Do you think that's what I want?",
  },
  "Das ist, was ich dachte, dass du gesagt hast.": {
    de: "Ich dachte, das hättest du gesagt.",
  },
  "Das ist, was ich dich gebeten habe zu tun.": {
    de: "Das ist das, worum ich dich gebeten habe.",
    en: "That's what I asked you to do.",
    short: "Darum habe ich dich gebeten.",
    shortEn: "That's what I asked you to do.",
  },
  "Es ist nicht an dem, dass ich dies nicht tun will.": {
    de: "Es ist nicht so, dass ich das nicht tun will.",
  },
  "Ich weiß, dass es nicht das ist, was du wolltest.": {
    de: "Ich weiß, dass du das nicht wolltest.",
  },
  "Bist du sicher, dass es das ist, was du willst?": {
    de: "Bist du sicher, dass du das willst?",
  },
  "Denkst du, dass es das ist, was ich hören will?": {
    de: "Glaubst du wirklich, dass ich das hören will?",
    en: "Do you really think that's what I want to hear?",
  },
  "Ich weiß nicht, wenn ich fragen kann.": {
    de: "Ich weiß nicht, wen ich fragen soll.",
    en: "I don't know who to ask. / I don't know whom to ask.",
    use: "'wen' is the person you would ask. 'wenn' means if or when, so it does not work in this sentence.",
  },
  "Das ist nicht, was ich sagte.": {
    de: "Das ist nicht das, was ich gesagt habe.",
    en: "That's not what I said.",
    short: "Das hab ich nicht gesagt.",
    shortEn: "That's not what I said. / I didn't say that.",
    use: "In everyday conversation, Germans normally say 'Das hab ich nicht gesagt.' The complete form uses 'das, was' and 'gesagt habe'.",
  },
  "Das stimmt nicht. Das ist nicht, was ich gesagt habe.": {
    de: "Das stimmt nicht. Das ist nicht das, was ich gesagt habe.",
    en: "You're wrong. That isn't what I said.",
    short: "Das stimmt nicht. Das hab ich nicht gesagt.",
    shortEn: "That's not true. I didn't say that.",
    use: "In everyday conversation, the direct 'Das hab ich nicht gesagt' sounds more natural. The complete version needs 'das, was'.",
  },
  "Das ist nicht, was ich denke.": {
    de: "Das ist nicht das, was ich denke.",
    short: "So denke ich nicht.",
    shortEn: "That's not how I see it. / That's not what I think.",
  },
  "Das ist nicht, was ich gesehen habe.": {
    de: "Das ist nicht das, was ich gesehen habe.",
  },
  "Das ist nicht, was ich dachte.": {
    de: "Das ist nicht das, was ich gedacht habe.",
    short: "Das hab ich nicht gedacht.",
    shortEn: "That's not what I thought. / I didn't think that.",
  },
  "Das ist nicht, was ich gehört habe.": {
    de: "Das ist nicht das, was ich gehört habe.",
  },
  "Das ist nicht, was ich tun werde.": {
    de: "Das ist nicht das, was ich tun werde.",
    short: "Das werde ich nicht tun.",
    shortEn: "That's not what I'm going to do. / I won't do that.",
  },
  "Das ist nicht, was er gesagt hat.": {
    de: "Das ist nicht das, was er gesagt hat.",
    short: "Das hat er nicht gesagt.",
    shortEn: "That's not what he said. / He didn't say that.",
  },
  "Das ist nicht, was ich sehen will.": {
    de: "Das ist nicht das, was ich sehen will.",
  },
  "Das ist nicht, was ich meinte.": {
    de: "Das ist nicht das, was ich gemeint habe.",
    short: "So hab ich das nicht gemeint.",
    shortEn: "That's not what I meant. / That's not how I meant it.",
  },
  "Das ist nicht, was ich suche.": {
    de: "Das ist nicht das, was ich suche.",
    short: "Das suche ich nicht.",
    shortEn: "That's not what I'm looking for. / I'm not looking for that.",
  },
  "Das ist nicht, was wir tun müssen.": {
    de: "Das ist nicht das, was wir tun müssen.",
  },
  "Das ist nicht, was ich bestellt habe.": {
    de: "Das ist nicht das, was ich bestellt habe.",
    short: "Das hab ich nicht bestellt.",
    shortEn: "This is not what I ordered. / I didn't order this.",
  },
  "Das ist nicht, was ich suchte.": {
    de: "Das ist nicht das, wonach ich gesucht habe.",
  },
  "Ist das nicht, was ich gesagt habe?": {
    de: "Ist das nicht das, was ich gesagt habe?",
    short: "Hab ich das nicht gesagt?",
    shortEn: "Isn't that what I said? / Didn't I say that?",
  },
  "Ist das nicht, was du willst?": {
    de: "Ist das nicht das, was du willst?",
  },
  "Ist das nicht, was sie wollen?": {
    de: "Ist das nicht das, was sie wollen?",
  },
  "Das ist nicht, warum ich hier bin.": {
    de: "Das ist nicht der Grund, warum ich hier bin.",
  },
  "Es ist nicht, wie du denkst.": {
    de: "Es ist nicht so, wie du denkst.",
  },
  "Das ist nicht, wie wir denken.": {
    de: "So denken wir nicht.",
  },
  "Das ist, wie ich es erfahren habe.": {
    de: "Daher weiß ich das.",
  },
  "Das ist, wo ich sein möchte.": {
    de: "Da möchte ich sein.",
  },
  "Das ist genau, was ich meine.": {
    de: "Das ist genau das, was ich meine.",
    short: "Genau das meine ich.",
    shortEn: "That's exactly what I mean.",
  },
  "Kann ich essen?": {
    de: "Kann ich das essen?",
    en: "Can I eat this? / Can I eat?",
  },
  "Ich glaube nicht, dass es gut für dich ist, ihn zu sehen.": {
    en: "I don't think it's good for you to see him. / I don't think seeing him is good for you.",
  },
  "Habe ich dir versprochen, dass ich das tun würde?": {
    en: "Did I promise you I'd do that? / Did I promise that I would do that?",
  },
  "Ich weiß, dass ich ohne Sie nicht leben kann.": {
    en: "I know I can't live without you.",
  },
  "Ich weiß, dass ich ohne dich nicht leben kann.": {
    en: "I know I can't live without you.",
  },
  "Ich weiß, dass ich ohne euch nicht leben kann.": {
    en: "I know I can't live without you.",
  },
  "Ich wollte nicht, dass das passiert.": {
    en: "I didn't want that to happen.",
  },
  "Wenn Sie nicht zu mir kommen, komme ich zu Ihnen.": {
    en: "If you don't come to me, I'll come to you.",
  },
  "Wenn ihr nicht zu mir kommt, komme ich zu euch.": {
    en: "If you don't come to me, I'll come to you.",
  },
  "Wenn du nicht zu mir kommst, komme ich zu dir.": {
    en: "If you don't come to me, I'll come to you.",
  },
  "Von wem haben Sie es, dass Sie das nicht müssen?": {
    en: "Who told you that you didn't need to do that?",
  },
  "Ich will das nicht so machen.": {
    en: "I don't want to do it that way.",
  },
  "Ich glaube, dass es wahr ist.": {
    en: "I believe that's true.",
  },
  "Ich weiß, dass dir das wichtig ist.": {
    en: "I know that's important to you.",
  },
  "Werden wir das nicht tun?": {
    en: "Aren't we going to do that?",
  },
  "Das ist nicht, was ich hören wollte.": {
    de: "Das ist nicht das, was ich hören wollte.",
    en: "That's not what I wanted to hear. / This isn't what I wanted to hear.",
  },
  "Wir sind uns nicht ganz sicher, was es ist.": {
    en: "We're not exactly sure what it is.",
  },
  "Sie sollen wissen, dass ich das nicht tun werde.": {
    en: "You should know that I won't do that.",
  },
};

const tatoebaSentences = (tatoebaRaw as RawSentence[]).map(s => {
  const correction = TATOEBA_CORRECTIONS[s.de];
  return correction ? { ...s, ...correction } : s;
});

const TATOEBA_PREFIX = "tatoeba";
const LEVEL_ORDER = ["A1", "A2", "B1", "B2"];

/** A part whose nav card should be grouped with the bulk "library", not the core path. */
export function isBulkPartKey(key: string) {
  return key.startsWith("wordbank") || key.startsWith(TATOEBA_PREFIX);
}

/** Items a part contributes to study (words + sentences), for honest UI counts. */
export function partItemCount(part: Part) {
  return (part.vocab?.length ?? 0) + (part.phrases?.length ?? 0);
}

interface PartMeta {
  label: string;
  level: string;
  theme: string;
  description: string;
  focus: string;
  learningDirections?: LearningDirection[];
  coachingLanguage?: "de" | "en" | "both";
}

function buildPartFromPhrases(meta: PartMeta, phrases: Phrase[]): Part {
  const usable = phrases.filter((p) => p.de?.trim() && p.en?.trim());

  const translationQuestions: TranslationQuestion[] = usable.slice(0, 8).map((p) => ({
    prompt: `Translate: "${p.en}"`,
    answers: [normalize(p.de)],
    sample: p.de,
    explain: p.use || "Bundled phrase.",
  }));

  return {
    label: meta.label,
    level: meta.level,
    theme: meta.theme,
    description: meta.description,
    focus: meta.focus,
    vocab: [],
    articleQuestions: [],
    translationQuestions,
    // No synthetic dialogues: these are standalone sentences, not real exchanges.
    dialogues: [],
    phrases: usable,
    learningDirections: meta.learningDirections,
    coachingLanguage: meta.coachingLanguage,
  };
}

/** Curated phrasebank → themed lesson parts (keys like "cb-greetings"). */
export function buildCuratedParts(direction: LearningDirection = getLearningDirection()): Record<string, Part> {
  const out: Record<string, Part> = {};
  for (const topic of curatedTopics) {
    if (topic.learningDirections && !topic.learningDirections.includes(direction)) continue;
    out[topic.id] = buildPartFromPhrases(
      {
        label: topic.label,
        level: topic.level,
        theme: topic.theme,
        description: topic.description,
        focus: topic.focus,
        learningDirections: topic.learningDirections,
        coachingLanguage: topic.coachingLanguage,
      },
      topic.phrases
    );
  }
  return out;
}

function determineUse(de: string): string {
  if (de === "Ist es Zeit?") {
    return "Uncommon (better: Ist es so weit? / Ist es an der Zeit?)";
  }
  if (de === "Wie war das?") {
    return "Uncommon (better: Wie bitte?)";
  }
  if (de === "Das hat Zeit.") {
    return "Uncommon / Formal (better: Das kann warten)";
  }
  if (de === "Dich will ich.") {
    return "Uncommon / Poetic inversion (better: Ich will dich)";
  }
  if (/^Die (kommen nicht|wissen das|schaffen das|lieben das|sind nicht hier|sind nicht gut|hören nicht zu|verstehen das nicht)\./.test(de)) {
    const betterForm = de.replace(/^Die /, "Sie ");
    return `Colloquial / Can sound disrespectful (better: ${betterForm})`;
  }
  if (de === "Ich will Zeit.") {
    return "Uncommon phrasing (better: Ich brauche Zeit)";
  }
  return "Real-world sentence";
}

/**
 * A "word" is a whitespace token containing at least one letter or digit —
 * so bare punctuation tokens (a stray "." or "„") don't inflate the count.
 */
function wordCount(s: string): number {
  return String(s ?? "").trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/**
 * The corpus is full of trivial 2-4 word fragments ("Ich wollte das.",
 * "Das ist es.") that teach almost nothing about German word order. The
 * Tatoeba tier's whole job is "how real full sentences are built," so it
 * only takes sentences of at least this many words. Genuinely useful short
 * phrases (greetings, reactions, idioms) live in the hand-curated packs
 * instead, where they carry proper usage notes.
 */
const TATOEBA_MIN_WORDS = 5;

/** Tatoeba slice → "real sentence" packs grouped by level (keys like "tatoeba-a1-1"). */
export function buildTatoebaParts(perPack = 50): Record<string, Part> {
  const byLevel: Record<string, RawSentence[]> = {};
  for (const s of tatoebaSentences) {
    if (wordCount(s.de) < TATOEBA_MIN_WORDS) continue;   // no trivial fragments
    let targetLevel = s.level;
    if (s.de === "Wie war das?") targetLevel = "B2";
    if (s.de === "Das hat Zeit.") targetLevel = "B1";
    if (s.de === "Dich will ich.") targetLevel = "B2";
    if (s.de === "Ich will Zeit.") targetLevel = "B1";
    if (/^Die (kommen nicht|wissen das|schaffen das|lieben das|sind nicht hier|sind nicht gut|hören nicht zu|verstehen das nicht)\./.test(s.de)) {
      targetLevel = "B2";
    }
    (byLevel[targetLevel] ??= []).push({ ...s, level: targetLevel });
  }

  const out: Record<string, Part> = {};
  for (const level of LEVEL_ORDER) {
    const items = byLevel[level] ?? [];
    let packNo = 0;
    for (let i = 0; i < items.length; i += perPack) {
      packNo += 1;
      const chunk = items.slice(i, i + perPack);
      const phrases: Phrase[] = chunk.map((s) => ({
        de: s.de,
        en: s.en,
        use: s.use || determineUse(s.de),
        short: s.short,
        shortEn: s.shortEn,
      }));
      const key = `${TATOEBA_PREFIX}-${level.toLowerCase()}-${packNo}`;
      out[key] = buildPartFromPhrases(
        {
          label: `Sentences ${level} · ${packNo}`,
          level,
          theme: `Real sentences ${level} · Set ${packNo}`,
          description:
            "Authentic German sentences with English translations — real practice at this level.",
          focus: "Absorb how real, everyday sentences are built at this level.",
        },
        phrases
      );
    }
  }
  return out;
}

/**
 * Everything bundled, in display order: curated lessons first.
 * Blueprint parts are merged before these by the caller.
 */
export function buildBundledParts(direction: LearningDirection = getLearningDirection()): Record<string, Part> {
  return buildCuratedParts(direction);
}

/**
 * Keep direction-specific packs out of every downstream surface in one pass.
 *
 * Two jobs, because both have to happen before anything reads a pack and this
 * is the one place every pack goes through. A pack written for one direction
 * is dropped in the others; and in the French and Polish courses every pack is
 * NARROWED to the entries that language covers, so lessons, the tracker, search, tests
 * and the games all see a catalogue whose every card has an answer instead of
 * discovering the gaps one blank card at a time.
 */
export function filterPartsForLearningDirection<T extends Part>(
  parts: Record<string, T>,
  direction: LearningDirection = getLearningDirection()
): Record<string, T> {
  const forDirection = Object.fromEntries(
    Object.entries(parts).filter(([, part]) =>
      !part.learningDirections || part.learningDirections.includes(direction)
    )
  ) as Record<string, T>;
  if (direction === "learn-fr") return frenchParts(forDirection);
  if (direction === "learn-pl") return polishParts(forDirection);
  return forDirection;
}

/** Flat pool of every bundled sentence (curated only) for games / review. */
export function getAllBundledSentences(direction: LearningDirection = getLearningDirection()): Phrase[] {
  const phrases = curatedTopics
    .filter((topic) => !topic.learningDirections || topic.learningDirections.includes(direction))
    .flatMap((topic) => topic.phrases);
  // Games and review draw straight from this pool, so it has to answer for the
  // course being studied rather than for the catalogue as a whole.
  if (direction === "learn-fr") return phrases.filter(hasFrench);
  if (direction === "learn-pl") return phrases.filter(hasPolish);
  return phrases;
}

/** Count of bundled sentences, for stats/labels. */
export const BUNDLED_SENTENCE_COUNT =
  curatedTopics.reduce((n, t) => n + t.phrases.length, 0);
