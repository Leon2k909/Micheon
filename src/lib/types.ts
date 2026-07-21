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
  fr?: string;
  /** Shorter colloquial form people actually say out loud, for longer phrases
   *  (e.g. "Ich weiß es nicht" → "Weiß nicht"). Omitted when already short. */
  short?: string;
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
