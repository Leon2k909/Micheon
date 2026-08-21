/**
 * Passages: German as it is actually written to you, not at you.
 *
 * Everything else in Micheon teaches one sentence at a time, and a sentence
 * at a time is not how German arrives. It arrives as four messages from a
 * mate with no punctuation to speak of, a note from a landlord, a rant about
 * a parcel. Leon asked for "conversational paragraphs non-textbook style
 * where its german but you need to translate it into english... but its
 * supposed to be a challenge".
 *
 * So the challenge is deliberately the hard direction. Reading German and
 * producing English is the only exercise here that cannot be passed by
 * recognition: you have to have understood the thing. Hovering any word gives
 * its gloss, which removes the wrong kind of difficulty (not knowing a noun)
 * and leaves the right kind (working out what the sentence is doing).
 *
 * Written to sound like the medium rather than like a course. That means
 * particles nobody translates (doch, halt, mal, eh), clipped verbs (hab,
 * mach), and sentences that trail off — the things a textbook removes and a
 * chat window is made of.
 */

export type PassageLine = {
  de: string;
  /** A natural English rendering, not a word-for-word crib. */
  en: string;
  /** What makes this line hard, shown only after an attempt. */
  note?: string;
  /**
   * What a word means HERE, overriding the general glossary.
   *
   * germanWordGloss knows a word, not a sentence, and a passage is nothing
   * but sentences. It offers "age" for Alter, which is a fair reading of the
   * noun and the wrong one when a mate opens a message with it; "way" for
   * weg, when the line means gone; "pay" for Zahlen, when the line means
   * figures. It also has nothing at all for Paketbote, Makler or
   * aufschlüsseln — the content words a reader most needs.
   *
   * The passage knows both, because somebody wrote it on purpose. Anything
   * listed here wins, and a check refuses to ship a passage with a word that
   * resolves to nothing.
   */
  glosses?: Record<string, string>;
};

export type Passage = {
  id: string;
  /** What the situation is, in English — the reader needs the frame. */
  title: string;
  /** Where this would reach you. */
  source: string;
  level: string;
  lines: PassageLine[];
};

export const PASSAGES: Passage[] = [
  {
    id: "paket",
    title: "The parcel that never arrives",
    source: "Messages from a mate",
    level: "A2-B1",
    lines: [
      {
        de: "Alter, der Paketbote war schon wieder nicht da.",
        glosses: { "Alter": "mate / dude (not age)", "Paketbote": "delivery driver" },
        en: "Mate, the delivery guy didn't turn up again.",
        note: "schon wieder carries the exasperation — literally already again. Alter is what a friend calls you, not a comment on your age.",
      },
      {
        de: "Zettel im Briefkasten, obwohl ich den ganzen Tag zu Hause war.",
        en: "A slip in the letterbox, even though I was home all day.",
        note: "No verb in the first half — a chat message drops the ist. obwohl sends its verb to the end: war.",
      },
      {
        de: "Jetzt darf ich das Ding wieder aus der Filiale holen.",
        en: "Now I get to go and pick the thing up from the depot again.",
        note: "darf ich is sarcastic here — I am allowed to, meaning I have to. das Ding stands in for whatever it was.",
      },
      {
        de: "Das dritte Mal diesen Monat, ich schwör.",
        glosses: { "schwör": "swear" },
        en: "Third time this month, I swear.",
        note: "ich schwör, with the e dropped, is spoken German written down.",
      },
    ],
  },
  {
    id: "feierabend",
    title: "Leaving the office",
    source: "A colleague, on the way out",
    level: "A2-B1",
    lines: [
      {
        de: "Ich mach gleich Feierabend, brauchst du noch was?",
        en: "I'm knocking off shortly — do you need anything else?",
        note: "Feierabend is the end of the working day as a thing you make: Feierabend machen.",
      },
      {
        de: "Wenn nicht, bin ich in zehn Minuten weg.",
        glosses: { "weg": "gone / off" },
        en: "If not, I'm off in ten minutes.",
        note: "wenn nicht on its own — the rest of the condition is understood.",
      },
      {
        de: "Morgen bin ich eh den ganzen Tag im Büro.",
        en: "I'll be in the office all day tomorrow anyway.",
        note: "eh means anyway and does a lot of work in spoken German. Present tense for tomorrow, as usual.",
      },
    ],
  },
  {
    id: "besichtigung",
    title: "After a flat viewing",
    source: "Messages to a friend",
    level: "B1",
    lines: [
      {
        de: "Waren heute bei der Besichtigung, war eigentlich ganz nett.",
        glosses: { "Besichtigung": "viewing", "Waren": "we were", "gefühlt": "it felt like" },
        en: "We went to the viewing today — it was pretty nice, actually.",
        note: "Both wir and es are dropped. eigentlich softens: nice, though not enough to get excited about.",
      },
      {
        de: "Aber es waren gefühlt vierzig Leute da.",
        glosses: { "gefühlt": "it felt like" },
        en: "But it felt like there were forty people there.",
        note: "gefühlt plus a number means it felt like that many. Very common, entirely colloquial.",
      },
      {
        de: "Der Makler meinte, wir sollen die Unterlagen bis Freitag schicken.",
        glosses: { "Makler": "estate agent", "meinte": "said" },
        en: "The agent said we should send the paperwork by Friday.",
        note: "meinte is said rather than meant here. bis Freitag is by Friday, not until.",
      },
      {
        de: "Ich mach mir ehrlich gesagt keine großen Hoffnungen.",
        en: "Honestly, I'm not getting my hopes up.",
        note: "sich Hoffnungen machen — the reflexive is doing it to yourself.",
      },
    ],
  },
  {
    id: "sprachnachricht",
    title: "A voice note you have to answer",
    source: "Voice note from a friend",
    level: "A2",
    lines: [
      {
        de: "Ey, bist du heute Abend dabei?",
        glosses: { "Ey": "hey", "dabei": "in / coming along" },
        en: "Hey, are you in this evening?",
        note: "dabei sein is to be in on something, coming along.",
      },
      {
        de: "Wir treffen uns so um acht am Bahnhof.",
        en: "We're meeting at the station around eight.",
        note: "so um acht is around eight — so makes the time approximate.",
      },
      {
        de: "Sag kurz Bescheid, ja?",
        en: "Just let me know, yeah?",
        note: "Bescheid sagen is the everyday way to say let someone know. kurz means briefly and softens the ask.",
      },
    ],
  },
  {
    id: "meeting",
    title: "The meeting that keeps moving",
    source: "A colleague you trust",
    level: "B1-B2",
    lines: [
      {
        de: "Das Meeting wurde schon wieder verschoben.",
        glosses: { "Meeting": "meeting", "wurde": "was (passive)", "verschoben": "postponed / put back" },
        en: "The meeting has been put back again.",
        note: "Passive with wurde. verschieben is to postpone.",
      },
      {
        de: "Angeblich, weil noch Zahlen fehlen.",
        glosses: { "Angeblich": "supposedly (and the speaker doubts it)", "Zahlen": "figures / numbers" },
        en: "Supposedly because some figures are still missing.",
        note: "angeblich signals the speaker does not believe it. fehlen is to be missing, and the thing missing is the subject.",
      },
      {
        de: "Ich glaube eher, keiner hat sich vorbereitet.",
        en: "I reckon nobody has prepared, more like.",
        note: "eher here is more like rather than earlier — it corrects the reason just given.",
      },
    ],
  },
  {
    id: "krank",
    title: "Calling in sick",
    source: "A message to your team",
    level: "A2-B1",
    lines: [
      {
        de: "Ich bleib heute im Bett, mir geht's echt nicht gut.",
        en: "I'm staying in bed today, I really don't feel well.",
        note: "mir geht es — how you are takes the dative. geht's is geht es spoken.",
      },
      {
        de: "Hab schon beim Arzt angerufen, aber da geht keiner ran.",
        glosses: { "ran": "rangehen — to answer the phone" },
        en: "I've already rung the doctor, but nobody's picking up.",
        note: "rangehen is to answer the phone. The ich is dropped, as it usually is in a message.",
      },
      {
        de: "Wenn's morgen nicht besser ist, geh ich hin.",
        en: "If it's no better tomorrow, I'll go in.",
        note: "hingehen — hin carries the going there, and it lands at the end.",
      },
    ],
  },
  {
    id: "spiel",
    title: "Straight after the match",
    source: "The group chat",
    level: "B1",
    lines: [
      {
        de: "Was für ein Spiel, ich konnte bis zum Schluss nicht hinschauen.",
        glosses: { "hinschauen": "to look / watch" },
        en: "What a game — I couldn't watch right to the end.",
        note: "Was für ein is what a. hinschauen is to look over at the thing.",
      },
      {
        de: "In der zweiten Halbzeit haben sie hinten komplett aufgemacht.",
        glosses: { "Halbzeit": "half (of a match)", "aufgemacht": "opened up / left open" },
        en: "In the second half they left themselves wide open at the back.",
        note: "aufmachen is to open up; hinten is at the back. Football shorthand.",
      },
      {
        de: "Der Trainer überlebt das nicht lange, wetten?",
        glosses: { "Trainer": "manager / coach", "überlebt": "survives", "wetten": "want to bet?" },
        en: "The manager won't survive this long, want to bet?",
        note: "wetten? tagged on the end invites you to disagree.",
      },
    ],
  },
  {
    id: "discord",
    title: "Getting a game together",
    source: "Discord",
    level: "A2-B1",
    lines: [
      {
        de: "Kommst du noch on? Wir sind zu dritt.",
        glosses: { "on": "online", "dritt": "zu dritt — three of us" },
        en: "Are you coming online? There are three of us.",
        note: "zu dritt is how German says how many of you there are: zu zweit, zu dritt, zu viert.",
      },
      {
        de: "Ping ist heute komisch, keine Ahnung warum.",
        glosses: { "Ping": "ping / latency" },
        en: "The ping is weird today, no idea why.",
        note: "keine Ahnung is no idea, dropped in as a whole phrase.",
      },
      {
        de: "Wenn es wieder laggt, hör ich auf.",
        glosses: { "laggt": "lags", "hör": "aufhören — to stop", "auf": "part of aufhören" },
        en: "If it lags again, I'm stopping.",
        note: "aufhören is to stop, and auf goes to the end.",
      },
    ],
  },
  {
    id: "mama",
    title: "Your mother, checking in",
    source: "A message from home",
    level: "A2",
    lines: [
      {
        de: "Meldest du dich mal wieder?",
        en: "Are you going to get in touch again some time?",
        note: "sich melden is to get in touch. mal wieder — the reproach is entirely in those two words.",
      },
      {
        de: "Papa fragt jeden Tag, ob du angerufen hast.",
        glosses: { "Papa": "dad" },
        en: "Dad asks every day whether you've called.",
        note: "ob is whether, and it sends hast to the end.",
      },
      {
        de: "Und iss mal was Ordentliches, nicht immer nur Nudeln.",
        glosses: { "iss": "eat (imperative)", "Nudeln": "pasta / noodles", "Ordentliches": "something proper / decent" },
        en: "And eat something proper for once, not just pasta all the time.",
        note: "iss is the imperative of essen. was Ordentliches — something proper, capitalised because it is now a noun.",
      },
    ],
  },
  {
    id: "rechnung",
    title: "Querying a bill",
    source: "An email you have to write back to",
    level: "B1-B2",
    lines: [
      {
        de: "Auf der letzten Rechnung sind Positionen, die ich nicht zuordnen kann.",
        glosses: { "Positionen": "line items", "zuordnen": "place / account for" },
        en: "There are items on the last invoice that I can't account for.",
        note: "die Position on a bill is a line item. zuordnen is to assign something to something — here, to place it.",
      },
      {
        de: "Könnten Sie mir das bitte aufschlüsseln?",
        glosses: { "aufschlüsseln": "break down / itemise" },
        en: "Could you break that down for me, please?",
        note: "Könnten Sie is the polite conditional — the standard way to ask a company for anything.",
      },
      {
        de: "Bis dahin überweise ich nur den unstrittigen Betrag.",
        glosses: { "überweise": "transfer (money)", "unstrittigen": "undisputed" },
        en: "Until then I'll only transfer the amount that isn't in dispute.",
        note: "überweisen is to transfer money. unstrittig — not disputed — is exactly the register a billing email wants.",
      },
    ],
  },
];

// ── Did the attempt say what the German said? ───────────────────────────────

/**
 * A free translation cannot be marked right or wrong by a machine, and
 * pretending otherwise is worse than not marking it. "The delivery guy didn't
 * show up again" and "the postman failed to turn up once more" are both
 * correct and share almost no words.
 *
 * So nothing here says correct. It reports which IDEAS in the reference the
 * attempt mentions, and leaves the verdict to the reader — who can see both
 * versions side by side and is the only one able to judge. What the count is
 * good for is catching the half-read line: if you rendered four of nine
 * content words, you skipped a clause, and that is worth knowing before you
 * mark yourself right.
 */
const IDEA_STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "so", "if", "then", "than", "that",
  "this", "these", "those", "there", "here", "it", "its", "is", "are", "was",
  "were", "be", "been", "am", "do", "does", "did", "have", "has", "had",
  "will", "would", "can", "could", "should", "shall", "may", "might", "must",
  "i", "you", "he", "she", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "our", "their", "of", "to", "in", "on", "at", "by",
  "for", "with", "from", "as", "not", "no", "yes", "up", "down", "out",
  "just", "very", "too", "also", "some", "any", "all", "one", "s", "t", "re",
  "m", "ll", "ve", "d", "about", "into", "over", "again", "still", "only",
]);

const ideaTokens = (text: string): string[] => String(text ?? "")
  .toLocaleLowerCase("en")
  .replace(/[’']/g, "'")
  .split(/[^a-z']+/)
  // n't first, or didn't leaves "didn" behind — a word in no language, which
  // then gets reported as an idea the reader failed to mention.
  .map((token) => token.replace(/n't$/, "").replace(/'(s|re|ve|ll|d|m)$/, ""))
  .filter((token) => token.length > 1 && !IDEA_STOPWORDS.has(token));

/**
 * The shapes of an English word we accept as the same word.
 *
 * Both directions, via the base: stripping "staying" to "stay" is not enough
 * on its own, because the attempt might say "stayed" — the base has to be
 * built back up again as well.
 */
const shapesOf = (word: string): Set<string> => {
  const bases = new Set([word]);
  if (word.endsWith("ing")) { bases.add(word.slice(0, -3)); bases.add(`${word.slice(0, -3)}e`); }
  if (word.endsWith("ed")) { bases.add(word.slice(0, -2)); bases.add(word.slice(0, -1)); }
  if (word.endsWith("ies")) bases.add(`${word.slice(0, -3)}y`);
  if (word.endsWith("es")) bases.add(word.slice(0, -2));
  if (word.endsWith("s")) bases.add(word.slice(0, -1));

  const shapes = new Set<string>();
  for (const base of bases) {
    if (base.length < 2) continue;
    shapes.add(base);
    shapes.add(`${base}s`);
    shapes.add(`${base}es`);
    shapes.add(`${base}ed`);
    shapes.add(`${base}d`);
    shapes.add(`${base}ing`);
    if (base.endsWith("e")) {
      shapes.add(`${base.slice(0, -1)}ing`);
      shapes.add(`${base.slice(0, -1)}ed`);
    }
    if (base.endsWith("y")) {
      shapes.add(`${base.slice(0, -1)}ies`);
      shapes.add(`${base.slice(0, -1)}ied`);
    }
  }
  return shapes;
};

export type IdeaCoverage = {
  /** Content words of the reference that the attempt mentions. */
  covered: string[];
  /** Content words it does not. */
  missing: string[];
  total: number;
};

export function coverIdeas(reference: string, attempt: string): IdeaCoverage {
  const wanted = [...new Set(ideaTokens(reference))];
  const present = new Set(ideaTokens(attempt));
  const covered: string[] = [];
  const missing: string[] = [];
  for (const word of wanted) {
    const hit = [...shapesOf(word)].some((shape) => present.has(shape));
    (hit ? covered : missing).push(word);
  }
  return { covered, missing, total: wanted.length };
}

/** Every German word in a passage, in order, with the punctuation kept apart. */
export function passageTokens(line: string): { text: string; word: boolean }[] {
  const out: { text: string; word: boolean }[] = [];
  const pattern = /[\p{L}\p{N}ß'-]+|[^\p{L}\p{N}ß'-]+/gu;
  for (const match of String(line ?? "").matchAll(pattern)) {
    out.push({ text: match[0], word: /[\p{L}\p{N}ß]/u.test(match[0]) });
  }
  return out;
}
