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
