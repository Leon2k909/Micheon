// How common is this word, really?
//
// The bundled word bank is ordered by corpus frequency (index 0 = the most
// common word in German). That ordering lets us show learners which of two
// same-meaning words Germans actually reach for — e.g. "Gegner" is in the
// top 2,500 while "Feind" isn't, which matches how gamers talk.

import bundledWordBank from "@/lib/bundledWordBank.json";

const rankByWord = new Map<string, number>();
(bundledWordBank as any[]).forEach((entry, i) => {
  const lookup = String(entry?.lookup ?? "").toLowerCase();
  const bare = String(entry?.de ?? "").toLowerCase().replace(/^(der|die|das)\s+/, "");
  if (lookup && !rankByWord.has(lookup)) rankByWord.set(lookup, i + 1);
  if (bare && !rankByWord.has(bare)) rankByWord.set(bare, i + 1);
});

type FrequencyInfo = { rank: number; label: string; hint: string } | null;

/**
 * Frequency rank for a word (1 = most common). Accepts "Gegner" or
 * "der Gegner". Returns null when the word isn't in the top 2,500 — we
 * stay silent rather than call it rare, because curated slang (digga,
 * zocken) is common in speech but absent from written-corpus lists.
 *
 * The rank is for ORDERING (common words come first in lessons and the
 * tracker); the learner-facing label is plain English — numbers like
 * "top 300" mean nothing to a learner.
 */
export function frequencyInfo(word: string | undefined): FrequencyInfo {
  if (!word) return null;
  const key = String(word).toLowerCase().trim().replace(/^(der|die|das)\s+/, "");
  const rank = rankByWord.get(key);
  if (rank == null) return null;
  if (rank <= 300) return { rank, label: "very common", hint: "Everyday core German — you'll hear this constantly" };
  if (rank <= 1200) return { rank, label: "common", hint: "Solid everyday vocabulary" };
  return { rank, label: "less common", hint: "Useful, but Germans reach for it less often" };
}

/** Sort key: 1 = most common, Infinity = unranked (sentences, slang). */
export function frequencyRank(word: string | undefined): number {
  return frequencyInfo(word)?.rank ?? Infinity;
}

// ── Same-meaning pairs taught in the app ─────────────────────────────────
// When two taught words mean the same thing, the chip names the sibling
// instead of a bare tier: "less common than Gegner" beats "less common".
// Only pairs with a clear-cut preference are listed — beginnen/anfangen
// (written rank favours beginnen, speech favours anfangen) is deliberately
// absent, because a wrong "more common" claim is worse than none.
// That pair is not unanswerable, only unanswerable HERE: this list ranks two
// words against each other outright, and the honest answer depends on whether
// you are writing or speaking. SPOKEN_PREFERENCE below says exactly that, and
// is where beginnen/anfangen ended up.
const SYNONYM_PAIRS: { common: string; rare: string; context?: string }[] = [
  { common: "Gegner", rare: "Feind", context: "in games & everyday talk" },
  { common: "Auto", rare: "Wagen" },
  { common: "schnell", rare: "rasch" },
];

type SynonymNote = { kind: "common" | "rare" | "also"; label: string; hint: string } | null;

/**
 * How common a folded-in synonym is COMPARED WITH the word leading its card.
 *
 * A combined card showed its synonyms with a bare tier — "Also: fachlich
 * (common)" — which answers a question nobody asked. The tag has to say
 * whether the folded word is as common as the face word, less common or more,
 * and the face is always the most common of the group. That is right on
 * the bank ranks both words, the face is the commoner one 236 times. So the
 * only honest answers are "the same" and "less", and the tier was hiding that
 * — professionell is #719 and fachlich #956, which is the same tier and a
 * third of a step apart.
 *
 * Compared by RATIO rather than by difference, because a frequency list is
 * roughly Zipfian: #23 to #239 is a real drop in how often you meet a word,
 * while #1621 to #1833 is the same distance on paper and no distance at all
 * in practice. The cuts sit at 1.5x and 4x, which splits the 236 pairs about
 * 76 / 101 / 59 and puts das Fernsehen + das TV (1.13x) in the first band and
 * erhalten + empfangen (56x) in the last, where a reader would put them.
 *
 * Null when either word is outside the 2,500-word bank. Slang and function
 * words are unranked without being rare — the bank simply does not carry
 * them — so silence is the honest answer rather than a guess.
 */
type SynonymCommonality = { label: string; hint: string } | null;

/**
 * Pairs where the bank is right about writing and wrong about speech.
 *
 * The bank is a written corpus, so it ranks anfangen #1131 against beginnen
 * #130 — true of prose and false of anybody talking. Leaving that as a
 * caveat only the code knows is the worst of both: the card states a rank as
 * though it settled the matter. It is fixable: say so on the card.
 *
 * Found by measurement rather than by memory. Micheon's own phrases are
 * written to sound spoken, so how often each word turns up across them is the
 * closest thing to a spoken check that exists here, and the pairs where the
 * two sources disagree are exactly the ones worth naming — the sweep produced
 * eighteen candidates and found beginnen/anfangen unprompted, which is the
 * pair the curated list above documents as too split to call.
 *
 * Hand-reviewed from there, because the sweep also produces false ones:
 * corpusUses pools a lemma's forms, so "gebraucht" (second-hand) counted as
 * gebrauchen, and "total" counted the intensifier rather than the synonym for
 * gesamt. Six of the eighteen were rejected for that, der Betrieb among them:
 * four mentions against one is not evidence, and die Firma already carries
 * what people actually say for that word. The rule this file has always used
 * decides the close ones — a wrong claim about which word Germans reach for
 * is worse than no claim at all.
 */
const SPOKEN_PREFERENCE: { written: string; spoken: string }[] = [
  { written: "sprechen", spoken: "reden" },
  { written: "gesamt", spoken: "komplett" },
  { written: "Ort", spoken: "Stelle" },
  { written: "Ort", spoken: "Platz" },
  { written: "deutlich", spoken: "klar" },
  { written: "Raum", spoken: "Zimmer" },
  { written: "Unternehmen", spoken: "Firma" },
  { written: "beginnen", spoken: "anfangen" },
  { written: "versuchen", spoken: "probieren" },
  { written: "Beruf", spoken: "Job" },
  { written: "notwendig", spoken: "nötig" },
  { written: "gering", spoken: "niedrig" },
];

/**
 * Does everyday speech reach for this word where writing reaches for that one?
 *
 * The table above has always known — it is what puts "more common in speech"
 * on the synonym line. It just was not allowed to decide anything: the card's
 * face is chosen by the frequency bank, and that bank is built from WRITTEN
 * German, so der Ort fronted a card whose own note said Germans say der Platz.
 *
 * In Conversation mode the word people say is the word to learn, so der Platz
 * belongs on the front of that card and the written one waits behind it as
 * the synonym.
 */
export function speechPrefers(
  candidate: string | undefined,
  over: string | undefined
): boolean {
  const spoken = bare(String(candidate ?? ""));
  const written = bare(String(over ?? ""));
  if (!spoken || !written) return false;
  return SPOKEN_PREFERENCE.some((pair) =>
    bare(pair.spoken) === spoken && bare(pair.written) === written);
}

/** Is this the spoken side of any documented written/spoken pair? */

/** And the written side, which Conversation mode should hold back. */

export function synonymCommonality(
  faceWord: string | undefined,
  synonymWord: string | undefined
): SynonymCommonality {
  const face = frequencyRank(faceWord);
  const synonym = frequencyRank(synonymWord);
  if (!Number.isFinite(face) || !Number.isFinite(synonym) || face <= 0) return null;

  const faceName = String(faceWord ?? "").replace(/^(der|die|das)\s+/, "");
  const synonymName = String(synonymWord ?? "").replace(/^(der|die|das)\s+/, "");

  // Where writing and speech disagree, say so rather than reporting the rank
  // as though it were the whole answer.
  const spoken = SPOKEN_PREFERENCE.find((pair) =>
    bare(pair.written) === bare(faceName) && bare(pair.spoken) === bare(synonymName));
  if (spoken) {
    return {
      label: "more common in speech",
      hint: `Writing prefers ${faceName}, but this is what people say.`,
    };
  }

  const ratio = synonym / face;
  if (ratio < 1.5) {
    return {
      label: "just as common",
      hint: `Used about as often as ${faceName} — either is natural.`,
    };
  }
  if (ratio < 4) {
    return {
      label: "less common",
      hint: `Germans reach for ${faceName} more often, but this is not rare.`,
    };
  }
  return {
    label: "much less common",
    hint: `${faceName} is the everyday choice; this one is noticeably rarer.`,
  };
}

// Native-verified loanword/sibling pairs (see scratch/loanword-workflow):
// which anglicism or synonym Germans really use alongside the taught word.
// prefer: which side everyday speech reaches for ("either" = both common).
import loanwordPairs from "@/lib/loanwordPairs.json";
const bare = (s: string) => String(s ?? "").toLowerCase().trim().replace(/^(der|die|das)\s+/, "");

/** Comparative note when a taught same-meaning sibling exists. */
export function synonymNote(word: string | undefined): SynonymNote {
  if (!word) return null;
  const key = bare(word);
  for (const pair of SYNONYM_PAIRS) {
    if (pair.rare.toLowerCase() === key) {
      return {
        kind: "rare",
        label: `less common than ${pair.common}`,
        hint: `Germans usually say ${pair.common}${pair.context ? ` ${pair.context}` : ""}`,
      };
    }
    if (pair.common.toLowerCase() === key) {
      return {
        kind: "common",
        label: `more common than ${pair.rare}`,
        hint: `Prefer this over ${pair.rare}`,
      };
    }
  }
  // Loanword siblings: tell the learner what Germans actually say day to day.
  for (const p of loanwordPairs as { taught: string; alt: string; prefer: string; note: string }[]) {
    const t = bare(p.taught), a = bare(p.alt);
    if (key !== t && key !== a) continue;
    const other = key === t ? p.alt : p.taught;
    const viewedPreferred =
      p.prefer === "either" || (key === t ? p.prefer === "taught" : p.prefer === "alt");
    if (p.prefer !== "either" && !viewedPreferred) {
      return { kind: "rare", label: `Germans usually say ${other}`, hint: p.note };
    }
    return { kind: "also", label: `also: ${other}`, hint: p.note };
  }
  return null;
}
