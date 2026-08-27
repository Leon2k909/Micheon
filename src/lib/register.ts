// Formal/informal register detection for German sentences.
//
// German distinguishes addressing friends & family (du/dich/dir/dein…) from
// polite address to strangers, staff, and elders (Sie/Ihnen), and both of
// those from addressing a GROUP (ihr/euch). English has one "you" for all
// three, so the English side of a card cannot show which one is meant.
// Learners need
// to know WHICH one a sentence uses, or they'll greet a shop assistant like
// a schoolmate.

export type Register = "formal" | "informal" | "plural" | null;

const PLURAL_PRONOUN = /\b(euch|euer|eue?re?[nmrs]?)\b/i;
const PLURAL_ONLY_VERB = /\b(seid|habt|werdet|wollt|k(?:ö|oe)nnt|m(?:ü|ue)sst|sollt|d(?:ü|ue)rft|m(?:ö|oe)gt|wisst|seht|lest|sprecht|nehmt|gebt|esst|helft|fahrt|lauft|schlaft|lasst|haltet|tragt)\b/i;

export function detectRegister(de: string): Register {
  const text = String(de ?? "");
  // Polite Sie/Ihnen: only count mid-sentence capitalised forms — a
  // sentence-initial "Sie" is ambiguous with "she/they". Imperatives put the
  // verb first ("Rufen Sie…", "Gehen Sie…"), so they match mid-sentence too.
  if (/[^.!?]\s(Sie|Ihnen)\b/.test(text)) return "formal";
  // Addressed to a GROUP. English collapses du, ihr and Sie into one "you",
  // so "Ist das alles, was ihr zu sagen habt?" reads as "Is that all you have
  // to say?" with nothing to show it is aimed at several people -- and no way
  // to work out which form to produce when typing it back.
  //
  // "ihr" alone is no evidence: it is also "her" (Ich helfe ihr) and "their"
  // (ihr Auto). These two are, though. euch/euer exist only in the second
  // person plural, and each verb form below differs from its third-person
  // singular -- er hat / ihr habt, er ist / ihr seid, er sieht / ihr seht --
  // so it cannot be anything else. Plural imperatives ("Seid still!", "Nehmt
  // das!") match too, and are also addressed to a group.
  if (PLURAL_PRONOUN.test(text) || PLURAL_ONLY_VERB.test(text)) return "plural";
  // Casual du-forms anywhere (also sentence-initial "Du bist…").
  if (/\b(du|dich|dir|dein|deine|deinen|deinem|deiner|deins)\b/i.test(text)) return "informal";
  return null;
}

export const REGISTER_LABEL: Record<Exclude<Register, null>, string> = {
  informal: "du · casual — friends & family",
  plural: "ihr · a group — you all, not one person",
  formal: "Sie · polite — strangers, staff, elders",
};

/**
 * The same three, short enough to sit on a list row.
 *
 * The labels above are written for a lesson card, which has a line to spare
 * and one sentence to explain. A tracker row has neither: it is already
 * carrying the meaning, the part of speech and whatever else the word has
 * collected, and "du · casual — friends & family" appended to that pushes the
 * meaning off the end. These say the same thing in three words.
 *
 * The pronoun leads in both, because that is the part a learner is looking
 * for: "Wie geht es dir?" is answered by seeing "du", not by reading "casual".
 */
export const REGISTER_SHORT: Record<Exclude<Register, null>, string> = {
  informal: "du — friends",
  plural: "ihr — a group",
  formal: "Sie — polite",
};

/** Which colour each one wears, so the three read the same way everywhere. */
export const REGISTER_TONE: Record<Exclude<Register, null>, string> = {
  informal: "text-emerald-600",
  plural: "text-amber-600",
  formal: "text-indigo-500",
};
