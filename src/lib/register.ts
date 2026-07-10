// Formal/informal register detection for German sentences.
//
// German distinguishes addressing friends & family (du/dich/dir/dein…) from
// polite address to strangers, staff, and elders (Sie/Ihnen). Learners need
// to know WHICH one a sentence uses, or they'll greet a shop assistant like
// a schoolmate.

export type Register = "formal" | "informal" | null;

export function detectRegister(de: string): Register {
  const text = String(de ?? "");
  // Polite Sie/Ihnen: only count mid-sentence capitalised forms — a
  // sentence-initial "Sie" is ambiguous with "she/they". Imperatives put the
  // verb first ("Rufen Sie…", "Gehen Sie…"), so they match mid-sentence too.
  if (/[^.!?]\s(Sie|Ihnen)\b/.test(text)) return "formal";
  // Casual du-forms anywhere (also sentence-initial "Du bist…").
  if (/\b(du|dich|dir|dein|deine|deinen|deinem|deiner|deins)\b/i.test(text)) return "informal";
  return null;
}

export const REGISTER_LABEL: Record<Exclude<Register, null>, string> = {
  informal: "du · casual — friends & family",
  formal: "Sie · polite — strangers, staff, elders",
};
