/**
 * Sie-or-du comprehension checks.
 *
 * Typing a sentence correctly proves nothing about whether the learner knows
 * WHO to say it to — and getting that wrong is the mistake native speakers
 * actually notice. So once a lesson has taught a phrase that commits to a
 * register, we occasionally ask a situation question about it.
 *
 * Deliberately low-frequency: at most one per lesson, only when a due question
 * exists, and a question answered correctly does not come back for months.
 * A quiz that nags is a quiz people click through without reading.
 */

// Detection already exists and is used to label sentences in the lesson UI —
// reuse it so a sentence tagged "Sie · polite" can never trigger a du question.
import { detectRegister } from "@/lib/register";

export type Register = "formal" | "informal";
export { detectRegister };

export interface RegisterQuestion {
  id: string;
  register: Register;
  /** The situation. Kept concrete — abstract "which is polite?" teaches nothing. */
  prompt: string;
  options: string[];
  answer: number;
  /** Shown after answering, right or wrong. This is the actual lesson. */
  explain: string;
}

export const REGISTER_QUESTIONS: RegisterQuestion[] = [
  {
    id: "boss",
    register: "formal",
    prompt: "It's your first week at a new job. How do you address your boss?",
    options: ["Sie", "du"],
    answer: 0,
    explain:
      "Sie, until they offer you du — and they will usually say so out loud (\"Wir können uns duzen\"). " +
      "Startups, trades and warehouses often duzen from day one, so listen to how the room talks. " +
      "Starting with Sie and being invited down is never wrong; the reverse is awkward.",
  },
  {
    id: "shop",
    register: "formal",
    prompt: "You need help finding something in a shop. The assistant is about 40.",
    options: ["Sie", "du"],
    answer: 0,
    explain: "Sie. Any adult stranger in a shop, bank, office or on the phone gets Sie — age doesn't change it.",
  },
  {
    id: "bar-same-age",
    register: "informal",
    prompt: "You're in a bar and start chatting to someone your own age.",
    options: ["du", "Sie"],
    answer: 0,
    explain:
      "du. Bars, clubs, parties, gigs and sport are du territory between people of a similar age. " +
      "Using Sie there sounds cold, like you're keeping your distance on purpose.",
  },
  {
    id: "child",
    register: "informal",
    prompt: "You're speaking to a 9-year-old.",
    options: ["du", "Sie"],
    answer: 0,
    explain:
      "du. Children get du from everyone. It flips around 16 with strangers — a teacher will start siezen " +
      "their pupils in the upper school years to mark them as young adults.",
  },
  {
    id: "partner-parents",
    register: "formal",
    prompt: "You're meeting your partner's parents for the first time.",
    options: ["Sie, unless they offer du", "du straight away"],
    answer: 0,
    explain:
      "Start with Sie. Many families move to du within the first visit, and they'll offer it — " +
      "but that offer is theirs to make. Waiting is read as respectful, not distant.",
  },
  {
    id: "official",
    register: "formal",
    prompt: "A police officer stops you to ask a question.",
    options: ["Sie", "du"],
    answer: 0,
    explain:
      "Sie. Police, officials and anyone acting in an official role — always Sie. Duzen a police officer " +
      "and it reads as deliberate disrespect.",
  },
  {
    id: "classmate",
    register: "informal",
    prompt: "Another student on your university course asks you something.",
    options: ["du", "Sie"],
    answer: 0,
    explain:
      "du. Students duzen each other automatically, whatever their age. Lecturers still get Sie.",
  },
  {
    id: "offered-du",
    register: "informal",
    prompt: "A colleague says: \"Wir können uns ruhig duzen.\" What just happened?",
    options: ["They invited you to use du", "They asked you to be more formal"],
    answer: 0,
    explain:
      "They've offered you du — accept it and switch immediately ('Gerne!'). Carrying on with Sie " +
      "after the offer is its own small rejection. It's usually the older or senior person who offers.",
  },
  {
    id: "group-strangers",
    register: "formal",
    prompt: "You're addressing a group of adult strangers — say, asking a queue a question.",
    options: ["Sie", "ihr"],
    answer: 0,
    explain:
      "Sie works for one person or a group. `ihr` is the plural of du, so save it for a group you'd " +
      "each call du — friends, family, teammates.",
  },
  {
    id: "email-stranger",
    register: "formal",
    prompt: "You're emailing a company you've never dealt with.",
    options: ["Sie, with \"Sehr geehrte Damen und Herren\"", "du, with \"Hallo\""],
    answer: 0,
    explain:
      "Sie. Written German stays formal longer than spoken German — even people who'd duzen you in " +
      "person often start an email with Sie. Note Sie/Ihnen/Ihr are capitalised in writing; du no longer has to be.",
  },
];

/** Correct → gone for four months. Wrong → back in three days. */
const CORRECT_DAYS = 120;
const WRONG_DAYS = 3;

export interface RegisterState {
  [id: string]: { correct: boolean; at: string };
}

function dueAt(rec: { correct: boolean; at: string }): number {
  const days = rec.correct ? CORRECT_DAYS : WRONG_DAYS;
  return new Date(rec.at).getTime() + days * 86400000;
}

/**
 * Pick a question worth asking now, or null.
 *
 * `registersSeen` are the registers the lesson actually taught — we only ask
 * about Sie after the learner has just met a Sie sentence, so the question
 * lands as a follow-up rather than a pop quiz from nowhere.
 */
export function pickRegisterQuestion(
  registersSeen: Register[],
  state: RegisterState,
  now: number = Date.now()
): RegisterQuestion | null {
  if (registersSeen.length === 0) return null;
  const wanted = new Set(registersSeen);
  const candidates = REGISTER_QUESTIONS.filter((q) => {
    if (!wanted.has(q.register)) return false;
    const rec = state[q.id];
    return !rec || dueAt(rec) <= now;
  });
  if (candidates.length === 0) return null;
  // Never-asked first, then whichever has been waiting longest.
  candidates.sort((a, b) => {
    const ra = state[a.id];
    const rb = state[b.id];
    if (!ra && !rb) return 0;
    if (!ra) return -1;
    if (!rb) return 1;
    return new Date(ra.at).getTime() - new Date(rb.at).getTime();
  });
  return candidates[0];
}

export function recordRegisterAnswer(
  state: RegisterState,
  id: string,
  correct: boolean,
  nowIso: string = new Date().toISOString()
): RegisterState {
  return { ...state, [id]: { correct, at: nowIso } };
}
