export interface VocabSeed {
  de: string;
  lookup: string;
  fallbackEn: string;
  tip?: string;
  article?: string;
  use?: string;
  when?: string;
  say?: string;
  /**
   * This seed teaches the word's primary sense, so it owns the vocabulary card
   * even if a pack earlier in curriculum order also lists the word.
   *
   * Several packs legitimately teach one word in different senses: a clothes
   * pack teaches "sitzen — to fit (of a garment)", the position pack teaches
   * "sitzen — to be sitting". Whichever came first used to win the card, so
   * the card, the Listen voice and the browser extension all taught a niche
   * sense as if it were the meaning. Set this on the seed that teaches what
   * the word usually means; leave it off everywhere else.
   */
  core?: boolean;
}

export interface DialogueLine {
  speaker: string;
  de: string;
  en: string;
  fr?: string;
  use?: string;
  when?: string;
  say?: string;
  long?: string;
  id?: string;
}

export interface Dialogue {
  title: string;
  lines: DialogueLine[];
}

export interface Phrase {
  de: string;
  en: string;
  /** German of a sentence this one extends (e.g. "Ich weiß nicht." for
   *  "Ich weiß nicht, ob ich das schaffe."). Lesson ordering serves this
   *  phrase directly after its base, so learners meet the short form first
   *  and then how to finish the thought. Matched by sentence identity, not
   *  by id, so it survives packs being renumbered. */
  buildsOn?: string;
  use?: string;
  /** Related phrases learned together, e.g. several ways to say goodbye. */
  group?: string;
  fr?: string;
  /** Shorter colloquial form people actually say out loud, for longer phrases
   *  (e.g. "Ich weiß es nicht" → "Weiß nicht"). Omitted when already short. */
  short?: string;
  /** Optional learner-facing context for a `short` alternative that is natural
   *  but belongs to a specific speaker or situation (for example, something
   *  parents often say) rather than neutral conversation in general. */
  shortLabel?: string;
  /** English for `short`, and ONLY what the short form actually says.
   *  "Zu teuer." means "Too expensive." — not "I don't want to buy that, it's
   *  too expensive", which is the full sentence's meaning. Without this the
   *  short form is not taught at all, because pairing it with the long
   *  sentence's English would define it as something it does not say. */
  shortEn?: string;
  /** The SITUATION that triggers this phrase, for sentences whose moment isn't
   *  obvious from the words. `use` explains the language ("ausfallen: fällt
   *  klein aus = runs small"); `when` explains when you'd open your mouth
   *  ("Holding up a jumper in a shop, or before ordering a size online").
   *  Omit when the sentence speaks for itself ("Ich gehe ins Bett."). */
  when?: string;
  /** Plain-English respelling for phrases a learner would read aloud wrongly
   *  ("Wir gehen nach Hause." → "sounds like: veer GEHN nach HOW-zuh").
   *  No IPA. Omit unless reading it as written would sound clearly off. */
  say?: string;
  /** The fuller written form, when the SHORT one is what people actually say
   *  and is therefore what we teach. Shown as a footnote and accepted as an
   *  answer, so a learner who met the long form in a book is not marked wrong. */
  long?: string;
  /** Stable id, for phrases whose position in the pack can change — i.e. the
   *  learner's own. Bundled phrases omit it and stay keyed by index. */
  id?: string;
  /** Signed offset used only when ranking unseen Continue Learning material.
   *  Negative introduces a core phrase sooner; positive holds a useful but
   *  less essential variant back. Reviews and explicit lessons ignore it. */
  lessonPriority?: number;
}

export interface Blueprint {
  label: string;
  level: string;
  theme: string;
  description: string;
  focus: string;
  seeds: VocabSeed[];
  dialogues: Dialogue[];
  phrases: Phrase[];
  learningDirections?: Array<"learn-de" | "learn-en">;
  coachingLanguage?: "de" | "en" | "both";
}

export interface VocabItem {
  de: string;
  en: string;
  tip: string;
  lookup: string;
  example: string;
  exampleEn: string;
  pos: string;
  fr?: string;
  exampleFr?: string;
  /** usage note, e.g. "The word gamers actually say" — shown as a chip */
  use?: string;
  /** see VocabSeed.core — this entry teaches the word's primary sense */
  core?: boolean;
}

export interface ArticleQuestion {
  word: string;
  correct: string;
  hint: string;
}

export interface TranslationQuestion {
  prompt: string;
  answers: string[];
  sample: string;
  explain: string;
}

export interface Part {
  label: string;
  level: string;
  theme: string;
  description: string;
  focus: string;
  vocab: VocabItem[];
  articleQuestions: ArticleQuestion[];
  translationQuestions: TranslationQuestion[];
  dialogues: Dialogue[];
  phrases: Phrase[];
  /** Restrict a specialist pack to the direction it was written for. */
  learningDirections?: Array<"learn-de" | "learn-en">;
  /** Preserve target-language coaching when a lesson is direction-swapped. */
  coachingLanguage?: "de" | "en" | "both";
}

export interface ReviewStats {
  ease: number;
  interval: number;
  due: number;
  seen: number;
  lapses: number;
  streak: number;
  lastGrade: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
}
