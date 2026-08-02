export interface VocabSeed {
  de: string;
  lookup: string;
  fallbackEn: string;
  tip?: string;
  article?: string;
}

export interface DialogueLine {
  speaker: string;
  de: string;
  en: string;
  fr?: string;
}

export interface Dialogue {
  title: string;
  lines: DialogueLine[];
}

export interface Phrase {
  de: string;
  en: string;
  use: string;
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
