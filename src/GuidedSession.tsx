import React, { useCallback, useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import { recordCrash } from "@/lib/crashReport";
import { AnimatePresence, motion, useReducedMotion, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  matchGermanPhrase as match,
  matchGermanMeaning,
  matchGermanSentence,
  matchEnglishMeaning,
  matchEnglishPhrase as matchEnglish,
  matchingVisibleKeys,
  primaryAnswer,
  primaryEnglishMeaning,
  primaryGermanMeaning,
  takeMatchingSafe,
} from "@/lib/germanTextMatch";
import { computeGap, matchesGapInput, spokenWord } from "@/lib/gapFill";
import type { AnswerPerformance } from "@/lib/adaptivePractice";
import { englishVariantLabel, formatEnglishText, getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import { matchLearningModeGermanAnswer } from "@/lib/learningMode";
import {
  FLASHCARD_FACE_KEY,
  FLASHCARD_MODE_EVENT,
  FLASHCARD_MODE_KEY,
  getFlashcardFace,
  getFlashcardMode,
  type FlashcardFace,
  type FlashcardMode,
} from "@/lib/flashcardMode";
import { effectsReduced } from "@/lib/effects";
import {
  GUIDED_BACKGROUND_EVENT,
  getGuidedBackground,
  getGuidedCustomBackground,
  type GuidedBackground,
} from "@/lib/guidedBackground";
import { getCompanion } from "@/lib/companion";
import { learningEnglish } from "@/lib/direction";
import { isElectronApp } from "@/lib/platform";
import {
  AUDIO_SETTINGS_EVENT,
  audioLanguageFromTag,
  getSfxAudioVolume,
  getTtsAudioVolume,
  getTtsSpeechRate,
} from "@/lib/audioMute";
import { SpeechSpeedControl, type TtsSpeechScope } from "@/components/SpeechSpeedControl";
import {
  BILINGUAL_SENTENCE_PHASES,
  buildSentencePhaseRoute,
  MASTERED_SENTENCE_PHASES as MASTERED_PHASES,
  replacementSentencePhaseWhenMuted,
  SENTENCE_PHASES,
  type SentencePhase as Phase,
} from "@/lib/guidedLessonPhases";
import { wordOrderTokensMatchSentence } from "@/lib/wordOrder";
import { MuteButton } from "@/components/MuteButton";
import { TtsWaveform } from "@/components/TtsWaveform";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";
import { detectRegister, REGISTER_LABEL } from "@/lib/register";
import { frequencyInfo, synonymNote } from "@/lib/wordFrequency";
import { germanWordGloss } from "@/lib/germanWordGloss";
import { englishWordGloss } from "@/lib/englishWordGloss";
import { addCustomEntries, getCustomPacks } from "@/lib/customContent";
import { getCodexPetFrequency } from "@/lib/codexPetCoaching";
import { pronounNote } from "@/lib/pronounNotes";
import { toSpokenGerman } from "@/lib/spokenGerman";
import { tts, ttsSequence, TTS_SPEAKING_EVENT } from "@/lib/voice";
import { ui, uiIsGerman, uiOr, uiFmt } from "@/lib/i18n";
import {
  Volume2, Mic2, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, X,
  BookOpen, ArrowRight,
  MessageSquareQuote, RotateCcw, Languages, GripVertical, ArrowLeftRight,
  Eye, EyeOff, Lightbulb, Keyboard, MousePointerClick, SkipForward, Square, Download, LoaderCircle
} from "lucide-react";

// TTS now runs through the /api/tts server (premium Microsoft voices in every
// browser) with an automatic fall back to the browser's built-in speechSynthesis.
// See src/lib/voice.ts.

// ── Subtle game-feel sounds (Web Audio, no assets) ────────────────
let _audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    if (!_audioCtx) _audioCtx = new Ctor();
    return _audioCtx;
  } catch { return null; }
}
function playTone(freqs: number[], dur = 0.12, type: OscillatorType = "sine", gain = 0.05) {
  const sfxVolume = getSfxAudioVolume();
  if (sfxVolume <= 0) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = f;
      const start = now + i * dur * 0.85;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gain * sfxVolume, start + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(start); osc.stop(start + dur);
    });
  } catch { /* ignore */ }
}
const playCorrect = () => playTone([523.25, 783.99], 0.12, "sine", 0.045);   // C5 → G5 ding
const playWrong = () => playTone([180], 0.18, "triangle", 0.04);             // soft low thunk
function insertAt(el: HTMLInputElement | null, char: string, set: (s: string) => void) {
  if (!el) return;
  const s = el.selectionStart ?? el.value.length;
  const e = el.selectionEnd ?? s;
  const next = el.value.slice(0, s) + char + el.value.slice(e);
  set(next);
  requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + char.length, s + char.length); });
}

// Section
/**
 * Register + usage context chips: tells the learner WHO you say this to
 * (du = friends/family vs Sie = polite), WHEN you'd use it, and — for vocab
 * items — how COMMON the word is (rank in the frequency word bank), so
 * same-meaning words are distinguishable ("Gegner" is a top-2,500 word,
 * "Feind" isn't). The usage note is hidden during Translate — some notes
 * would give the answer away.
 */
function UsageChips({ de, use, lookup, tierNote, hideUse, short, shortLabel, long }: { de: string; use?: string; lookup?: string; tierNote?: string; hideUse?: boolean; short?: string; shortLabel?: string; long?: string }) {
  const register = detectRegister(de);
  const freq = frequencyInfo(lookup);
  const syn = synonymNote(lookup);
  const isWarning = use && (
    use.toLowerCase().includes("uncommon") ||
    use.toLowerCase().includes("warning") ||
    use.toLowerCase().includes("incorrect") ||
    use.toLowerCase().includes("avoid")
  );
  const isSlang = use && (
    use.toLowerCase().includes("slang") ||
    use.toLowerCase().includes("informal") ||
    use.toLowerCase().includes("friends") ||
    use.toLowerCase().includes("colloquial") ||
    use.toLowerCase().includes("casual")
  );

  // Short colloquial form (e.g. "Weiß nicht" for "Ich weiß es nicht"). Hidden
  // during Translate — it's an alternative German phrasing and would give it away.
  const showShort = Boolean(short && !hideUse && short.trim().toLowerCase() !== de.trim().toLowerCase());
  // In Conversation mode the target itself is the short form. Keep the fuller
  // standard version visible in the same place where Exam mode shows the spoken
  // alternative, so the relationship between the two forms is unmistakable.
  const showLong = Boolean(long && !hideUse && long.trim().toLowerCase() !== de.trim().toLowerCase());
  // Two different things wear this chip and the learner cannot tell them
  // apart. A `short` is a genuinely different, shorter WORDING -- you could
  // type it instead. A `long` in Conversation mode is usually the same words
  // written out, where the only difference is the ich-form -e that gets
  // dropped in speech: "ich versteh" against "ich verstehe". One is a choice
  // about what to say, the other is only how it is said, and being told
  // "Full version" for both leaves you guessing which.
  const longIsSpokenForm = Boolean(
    long && toSpokenGerman(long).trim().toLowerCase() === de.trim().toLowerCase()
  );
  if (!register && !freq && !syn && !tierNote && !showShort && !showLong && (!use || (hideUse && !isWarning && !isSlang))) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Niche/casual pack note — uncommon German is always labelled */}
      {tierNote && (
        <span
          title={ui("Not everyday neutral German — use in the right company")}
          className="fs-tier-note rounded-full px-2.5 py-1 text-[11px] font-black"
        >
          {uiOr(tierNote, "Besonderer Sprachgebrauch")}
        </span>
      )}
      {register === "informal" && (
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-600">
          {ui(REGISTER_LABEL.informal)}
        </span>
      )}
      {register === "plural" && (
        <span
          title={ui("The German is aimed at more than one person. English says \"you\" either way.")}
          className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-black text-amber-600"
        >
          {ui(REGISTER_LABEL.plural)}
        </span>
      )}
      {register === "formal" && (
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-black text-indigo-500">
          {ui(REGISTER_LABEL.formal)}
        </span>
      )}
      {syn ? (
        <span
          title={uiOr(syn.hint, "Hinweis zur Wortwahl")}
          className={syn.kind === "rare"
            ? "rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-black text-amber-600"
            : "rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-black text-sky-600"}
        >
          {uiOr(syn.label, "Hinweis zur Wortwahl")}
        </span>
      ) : freq && (
        <span
          title={ui(freq.hint)}
          className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-black text-sky-600"
        >
          {ui(freq.label)}
        </span>
      )}
      {use && (!hideUse || isWarning || isSlang) && (
        <span className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-bold border",
          isWarning
            ? "bg-rose-500/10 text-rose-600 font-black border-rose-500/20"
            : isSlang
              ? "bg-amber-500/10 text-amber-600 font-black border-amber-500/20"
              // Tokens, not raw zinc: bg-zinc-100 is #f4f4f5, so this usage note
            // sat on the dark session as a cream island.
            : "bg-[var(--surface-3)] text-[var(--text-3)] border-transparent"
        )}>
          {uiOr(use, "Hinweis zur Verwendung")}
        </span>
      )}
      {showShort && (
        <span
          title={shortLabel ? uiOr(shortLabel, "Hinweis zur Verwendung") : ui("A shorter wording people use. Typing either one is accepted.")}
          className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-black text-teal-600"
        >
          {shortLabel ? uiOr(shortLabel, "Hinweis zur Verwendung") : ui("Shorter, and fine to type")}: “{short}”
        </span>
      )}
      {showLong && (
        <span
          title={longIsSpokenForm
            ? ui("The same words. Only the spoken ending differs, and both are accepted.")
            : ui("Complete standard form")}
          className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-black text-teal-600"
        >
          {longIsSpokenForm ? ui("Written out (same words)") : ui("Full version")}: “{long}”
        </span>
      )}
    </div>
  );
}

// Windows Alt codes for each helper character, surfaced on hover so learners
// can graduate from clicking the buttons to typing the characters directly.
const GERMAN_ALT_CODES: Record<string, string> = {
  "Ä": "0196", "ä": "0228", "Ö": "0214", "ö": "0246", "Ü": "0220", "ü": "0252", "ß": "0223",
};

const FRENCH_ALT_CODES: Record<string, string> = {
  "é": "0233", "è": "0232", "ê": "0234", "à": "0224", "â": "0226",
  "ç": "0231", "î": "0238", "ô": "0244", "û": "0251", "œ": "0156",
};

/**
 * The replay button plus a right-click speed menu. Every speed surface exposes
 * Master, English and German so a quick lesson adjustment never traps the
 * learner in a global-only setting.
 */
function HearItButton({ speaking, onPlay, lang }: { speaking: boolean; onPlay: () => void; lang: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState(() => getTtsSpeechRate(lang));
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const defaultScope: TtsSpeechScope = audioLanguageFromTag(lang) ?? "master";

  useEffect(() => {
    const sync = () => setSpeechRate(getTtsSpeechRate(lang));
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, [lang]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && wrapRef.current?.contains(event.target)) return;
      setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div className="fs-listen-wrap" ref={wrapRef}>
      <button
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        className={cn("fs-listen", speaking && "is-speaking")}
        onClick={onPlay}
        onContextMenu={(event) => { event.preventDefault(); setMenuOpen((current) => !current); }}
        title={`${ui("Hear it")} · ${ui("Right-click to change speed")} (${speechRate}×)`}
        type="button"
      >
        <span className="fs-listen-icon"><Volume2 className="h-5 w-5" /></span>
        <span>
          <strong>{ui("Hear it")}</strong>
          <small>{speechRate !== 1 ? `${speechRate}× · ${ui("Tap to replay")}` : ui("Tap to replay")}</small>
        </span>
      </button>
      {menuOpen && (
        <div aria-label={ui("Speech speed")} className="fs-speed-menu" role="dialog">
          <SpeechSpeedControl
            defaultScope={defaultScope}
            onRateChange={() => { setMenuOpen(false); onPlay(); }}
            testId="lesson-speech-speed"
          />
        </div>
      )}
    </div>
  );
}

function CharBar({ onInsert }: { onInsert: (c: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {["Ä","ä","Ö","ö","Ü","ü","ß"].map(c => (
        <motion.button key={c} type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          title={`${c} · Alt + ${GERMAN_ALT_CODES[c]}`}
          aria-keyshortcuts={`Alt+${GERMAN_ALT_CODES[c]}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-base font-semibold text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
          onMouseDown={e => { e.preventDefault(); onInsert(c); }}>
          {c}
        </motion.button>
      ))}
    </div>
  );
}

// French accent helper row for the French typing phase
function FrenchCharBar({ onInsert }: { onInsert: (c: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {["é","è","ê","à","â","ç","î","ô","û","œ"].map(c => (
        <motion.button key={c} type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          title={`${c} · Alt + ${FRENCH_ALT_CODES[c]}`}
          aria-keyshortcuts={`Alt+${FRENCH_ALT_CODES[c]}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-base font-semibold text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
          onMouseDown={e => { e.preventDefault(); onInsert(c); }}>
          {c}
        </motion.button>
      ))}
    </div>
  );
}

// Section
// The recognition rounds follow the first exposure: learners identify a whole
// spoken phrase, then identify one missing word from audio-only choices.
// Type and Translate each run twice to build memory through production. The
// final three rounds are deliberately closed-book: rehearsal ends at the
// write-from-memory stage,
// then the learner has to retrieve the target, meaning, and finally both.
const CLOSED_BOOK_PHASES: readonly Phase[] = MASTERED_PHASES;

/**
 * The short route for a phrase the learner already recalls reliably.
 *
 * Drilling something through the full lesson route when it has been recalled
 * correctly three times running is just tax on someone who knows it. A strong
 * item goes straight to the closed-book checks; getting one wrong drops it back
 * onto the full route, because the run of successes evidently didn't mean what
 * it looked like.
 */
function isClosedBookPhase(phase: Phase): boolean {
  return CLOSED_BOOK_PHASES.includes(phase);
}

type MissingWordPrompt = {
  answer: string;
  display: string;
};

function computeListeningGap(sentence: string): MissingWordPrompt {
  const tokens = String(sentence ?? "").trim().split(/\s+/).filter(Boolean);
  const candidates = tokens
    .map((token, index) => ({ index, answer: spokenWord(token) }))
    .filter(({ answer }) => answer.length >= 3)
    .sort((a, b) => b.answer.length - a.answer.length)
    .slice(0, 4)
    .sort((a, b) => choiceHash(`${sentence}|${a.index}`) - choiceHash(`${sentence}|${b.index}`));
  const selected = candidates[0] ?? (tokens.length ? { index: 0, answer: spokenWord(tokens[0]) } : null);
  if (!selected?.answer) return { answer: "", display: sentence };

  return {
    answer: selected.answer,
    display: tokens.map((token, index) => (index === selected.index ? "____" : token)).join(" "),
  };
}

type OrderToken = {
  id: string;
  text: string;
};

function buildOrderTokens(sentence: string): OrderToken[] {
  const tokens = String(sentence ?? "").trim().split(/\s+/).filter(Boolean).map((text, index) => ({
    id: `${index}-${text}`,
    text,
  }));
  if (tokens.length < 2) return tokens;

  let seed = Array.from(sentence).reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 2166136261);
  const shuffled = [...tokens];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = ((seed * 1664525) + 1013904223) >>> 0;
    const swapAt = seed % (index + 1);
    [shuffled[index], shuffled[swapAt]] = [shuffled[swapAt], shuffled[index]];
  }
  if (wordOrderTokensMatchSentence(shuffled, sentence)) {
    const visiblyDifferentIndex = shuffled.findIndex(
      (token, index) => index > 0 && token.text !== shuffled[0].text
    );
    if (visiblyDifferentIndex > 0) {
      [shuffled[0], shuffled[visiblyDifferentIndex]] = [shuffled[visiblyDifferentIndex], shuffled[0]];
    }
  }
  return shuffled;
}

function cleanTranslationToken(token: string): string {
  return String(token ?? "").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}'’-]+$/gu, "");
}

function buildTranslationChoices(answer: string, pool: string[] = [], distractorLimit = 3): OrderToken[] {
  const answerTokens = String(answer ?? "").trim().split(/\s+/).filter(Boolean).map((text, index) => ({
    id: `answer-${index}-${text}`,
    text,
  }));
  const answerKey = choiceKey(primaryAnswer(answer));
  const seen = new Set(
    answerTokens
      .map((token) => choiceKey(cleanTranslationToken(token.text)))
      .filter(Boolean)
  );

  const distractors = pool
    .filter((candidate) => choiceKey(primaryAnswer(candidate)) !== answerKey)
    .flatMap((candidate) => primaryAnswer(candidate).trim().split(/\s+/))
    .map(cleanTranslationToken)
    .filter((word) => {
      const key = choiceKey(word);
      if (word.length < 2 || !key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => choiceHash(`${answer}|decoy|${a}`) - choiceHash(`${answer}|decoy|${b}`))
    .slice(0, distractorLimit)
    .map((text, index) => ({
      id: `decoy-${index}-${text}`,
      text,
    }));

  return [...answerTokens, ...distractors]
    .sort((a, b) => choiceHash(`${answer}|position|${a.id}`) - choiceHash(`${answer}|position|${b.id}`));
}

function moveOrderToken(tokens: OrderToken[], from: number, to: number): OrderToken[] {
  if (from === to || from < 0 || to < 0 || from >= tokens.length || to >= tokens.length) return tokens;
  const next = [...tokens];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function choiceKey(value: string): string {
  return String(value ?? "").trim().toLocaleLowerCase("de-DE");
}

function choiceHash(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function buildListeningChoices(answer: string, pool: string[], limit = 4): string[] {
  const answerKey = choiceKey(answer);
  const seen = new Set<string>([answerKey]);
  const distractors = pool
    .map((value) => String(value ?? "").trim())
    .filter((value) => {
      const key = choiceKey(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => choiceHash(`${answer}|${a}`) - choiceHash(`${answer}|${b}`))
    .slice(0, Math.max(0, limit - 1));

  return [answer, ...distractors]
    .sort((a, b) => choiceHash(`position|${answer}|${a}`) - choiceHash(`position|${answer}|${b}`));
}

function buildMissingWordChoices(answer: string, pool: string[], limit = 3): string[] {
  const answerKey = choiceKey(answer);
  const seen = new Set<string>([answerKey]);
  const distractors = pool
    .flatMap((sentence) => String(sentence ?? "").trim().split(/\s+/))
    .map(spokenWord)
    .filter((word) => {
      const key = choiceKey(word);
      if (word.length < 2 || !key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const lengthDifference = Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length);
      return lengthDifference || choiceHash(`${answer}|${a}`) - choiceHash(`${answer}|${b}`);
    })
    .slice(0, Math.max(0, limit - 1));

  return [answer, ...distractors]
    .filter(Boolean)
    .sort((a, b) => choiceHash(`missing-position|${answer}|${a}`) - choiceHash(`missing-position|${answer}|${b}`));
}

// In French companion mode the flow tests the two target languages (German +
// French) and uses English only as the shown meaning, so the English-typing
// "Translate" step is replaced by the French step. "Memory" is a final recall
// phase where no sentence is shown — the learner types both from memory.
// "Type" is the German-typing step; label it "German" in bilingual mode so the
// two language steps read clearly as German / French. The second-round steps
// get short labels of their own.
// Underline the item's key word (its dictionary lookup form) in the sentence,
// like the mockup's highlighted word. Plain text when the word isn't found.
function renderKeyWord(sentence: string, lookup?: string) {
  if (!lookup || lookup.length < 3) return sentence;
  const i = sentence.toLowerCase().indexOf(lookup.toLowerCase());
  if (i < 0) return sentence;
  return (
    <>
      {sentence.slice(0, i)}
      <span className="word-key">{sentence.slice(i, i + lookup.length)}</span>
      {sentence.slice(i + lookup.length)}
    </>
  );
}

function phaseLabel(p: Phase, withFrench: boolean, targetLabel = "German", meaningLabel = "English") {
  if (withFrench && p === "Type") return "German";
  if (p === "MeaningPick") return "Meaning";
  if (p === "MeaningSelect") return "Select";
  if (p === "ListenPick") return "Pick it";
  if (p === "MissingWord") return "Missing word";
  if (p === "TypeAgain") return "Type 2";
  if (p === "TranslateAgain") return "Recall";
  if (p === "Gap") return "Fill in";
  if (p === "Order") return "Reorder";
  if (p === "WriteFromMemory") return "Write it";
  if (p === "RecallTarget") return targetLabel === "German" ? "Recall DE" : "Recall EN";
  if (p === "RecallMeaning") return meaningLabel === "German" ? "Recall DE" : "Recall EN";
  if (p === "RecallBoth") return "Recall both";
  return p;
}

// Big stage title for the lesson heading ("Build the sentence" style).
function phaseHeading(p: Phase, withFrench: boolean, targetLabel = "German", meaningLabel = "English"): string {
  switch (p) {
    case "Read": return "Read & listen";
    case "MeaningPick": return "Pick the meaning";
    case "MeaningSelect": return "Select the correct meaning";
    case "ListenPick": return "What did you hear?";
    case "MissingWord": return "Listen for the missing word";
    case "Type": return withFrench ? "Type the German" : "Type the sentence";
    case "TypeAgain": return "Type it once more";
    case "Translate": return "Translate this sentence";
    case "TranslateAgain": return "Recall the meaning";
    case "Gap": return "Fill the blank";
    case "Order": return "Reorder the sentence";
    case "WriteFromMemory": return "Build from memory";
    case "RecallTarget": return `Recall the ${targetLabel}`;
    case "RecallMeaning": return `Recall the ${meaningLabel}`;
    case "RecallBoth": return "Recall both sides";
    case "French": return "Type the French";
    case "Memory": return "Recall both languages";
    default: return "Sentence practice";
  }
}

// The sentence as tappable words — click any word to hear just that word.
// Hovering (or right-clicking) a German word opens a small popover with its
// meaning and a "Practice this word" action that saves it to the learner's own
// words, so a tricky spelling like Postfiliale can be drilled on its own later.
function TappableSentence({ text, lang, meaningText }: { text: string; lang: string; meaningText?: string }) {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  // Hover glosses translate toward the learner's helper language: German
  // text shows English meanings, and English text (learn-English mode) shows
  // German ones — the popover must not be a German-course-only feature.
  const glossLang = lang.toLowerCase().startsWith("de") ? ("de" as const)
    : lang.toLowerCase().startsWith("en") ? ("en" as const)
      : null;
  const showEnglishGloss = glossLang === "de";
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const playingTimer = useRef<number | undefined>(undefined);
  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);
  const [popoverSaved, setPopoverSaved] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (playingTimer.current) window.clearTimeout(playingTimer.current);
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const bareWord = (word: string) => word.replace(/[.,!?;:"«»„“()]/g, "");

  const wordIsSaved = (word: string) => {
    // Custom entries keep German in `de` in both directions, so an English
    // word saved from learn-English mode lives on the `en` side.
    if (glossLang === "en") {
      const key = bareWord(word).toLocaleLowerCase("en-GB");
      return getCustomPacks().some((pack) =>
        pack.entries.some((entry) => entry.en.toLocaleLowerCase("en-GB") === key)
      );
    }
    const key = bareWord(word).toLocaleLowerCase("de-DE");
    return getCustomPacks().some((pack) =>
      pack.entries.some((entry) => entry.de.toLocaleLowerCase("de-DE") === key)
    );
  };

  const openPopover = (index: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPopoverIndex(index);
    setPopoverSaved(wordIsSaved(words[index]));
  };

  const scheduleOpen = (index: number) => {
    if (!glossLang) return;
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => openPopover(index), 320);
  };

  const scheduleClose = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setPopoverIndex(null), 240);
  };

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const practiseWord = (word: string) => {
    const face = bareWord(word);
    if (!face) return;
    if (glossLang === "en") {
      // Learn-English mode: the hovered word is English, so the German gloss
      // fills `de` — the store keeps German in `de` in both directions, and
      // the lesson-direction swap flips the card back at practice time. Only
      // the first gloss alternative becomes the card's German side; without a
      // reviewed translation nothing is saved.
      const de = (englishWordGloss(face) || "").split(" / ")[0].trim();
      if (!de) return;
      addCustomEntries([{ de, en: face, use: text }]);
    } else {
      const en = germanWordGloss(face) || meaningText || "";
      if (!en) return;
      addCustomEntries([{ de: face, en, use: text }]);
    }
    setPopoverSaved(true);
  };

  const playWord = (word: string, index: number) => {
    const spokenWord = word.replace(/[.,!?;:"«»„“]/g, "");
    if (!spokenWord) return;
    if (playingTimer.current) window.clearTimeout(playingTimer.current);
    setPlayingIndex(index);
    tts(spokenWord, 0.82, lang);
    playingTimer.current = window.setTimeout(
      () => setPlayingIndex(null),
      Math.min(1600, 800 + spokenWord.length * 45)
    );
  };

  const copySelectionWithSpaces = (event: React.ClipboardEvent<HTMLSpanElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedWords = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(".fs-word")
    ).filter((word) => {
      try {
        return range.intersectsNode(word);
      } catch {
        return false;
      }
    });
    if (selectedWords.length === 0) return;

    // Flex gaps and adjacent interactive words are visual spacing only, so the
    // browser may omit them (or insert line breaks) when copying. Rebuild a
    // normal sentence for multi-word selections and normalize a single word.
    const copiedText = selectedWords.length > 1
      ? selectedWords.map((word) => word.textContent?.trim()).filter(Boolean).join(" ")
      : selection.toString().replace(/\s+/g, " ").trim();
    if (!copiedText) return;

    event.preventDefault();
    event.clipboardData.setData("text/plain", copiedText);
  };

  return (
    <span className="fs-tappable-sentence" onCopy={copySelectionWithSpaces}>
      {words.map((w, i) => {
        const hoverGloss = glossLang === "de" ? germanWordGloss(w)
          : glossLang === "en" ? englishWordGloss(w)
            : null;
        const popoverOpen = popoverIndex === i;
        // In learn-English mode the sentence meaning is German prose — it can
        // caption the popover but must never become a one-word card's back.
        const practiceMeaning = glossLang === "en" ? (hoverGloss || "") : (hoverGloss || meaningText || "");
        return (
          <React.Fragment key={`${w}-${i}`}>
            {i > 0 && " "}
            <span
              className="fs-word-anchor"
              onPointerEnter={() => scheduleOpen(i)}
              onPointerLeave={scheduleClose}
            >
              <span
                role="button"
                tabIndex={0}
                className={cn("fs-word", playingIndex === i && "is-playing", popoverOpen && "has-popover")}
                onClick={() => {
                  if (window.getSelection()?.toString().trim()) return;
                  playWord(w, i);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  playWord(w, i);
                }}
                onContextMenu={(event) => {
                  if (!glossLang) return;
                  event.preventDefault();
                  openPopover(i);
                }}
                aria-label={hoverGloss
                  ? `${w}: ${hoverGloss}. ${ui("Tap a word to hear it")}`
                  : `${ui("Hear it")}: ${w}`}
                data-gloss={hoverGloss ?? undefined}
                title={hoverGloss ? undefined : ui("Tap a word to hear it")}
              >
                {w}
              </span>
              {popoverOpen && (
                <span
                  className="fs-word-popover"
                  onPointerEnter={cancelClose}
                  onPointerLeave={scheduleClose}
                  role="group"
                  aria-label={`${bareWord(w)}`}
                >
                  <span className="fs-word-popover-word">{bareWord(w)}</span>
                  {hoverGloss && <span className="fs-word-popover-gloss">{hoverGloss}</span>}
                  {(() => {
                    const note = showEnglishGloss ? pronounNote(bareWord(w)) : null;
                    return note ? <span className="fs-word-popover-note">{note}</span> : null;
                  })()}
                  <span className="fs-word-popover-actions">
                    <button className="fs-word-popover-btn" onClick={() => playWord(w, i)} type="button">
                      <Volume2 aria-hidden="true" className="h-3.5 w-3.5" />
                      {ui("Hear it")}
                    </button>
                    {practiceMeaning && (popoverSaved ? (
                      <span className="fs-word-popover-saved">✓ {ui("In your words")}</span>
                    ) : (
                      <button className="fs-word-popover-btn is-primary" onClick={() => practiseWord(w)} type="button">
                        + {ui("Practice this word")}
                      </button>
                    ))}
                  </span>
                </span>
              )}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}

// Prototype-style stage route: numbered squares with labels on a progress
// line. Clicking a stage jumps to it (same behaviour the dots had).
/**
 * Conversation Beta's frame: the question this sentence answers.
 *
 * A phrase learned on its own is one you can recite. Shown as the reply to
 * something somebody actually asked, it is one you can use -- and the course
 * already contains the question, because these lines come from dialogues.
 * The structure notes sit beside it because the beta chooses sentences BY
 * their grammar, so saying which grammar is the point.
 */
function StageRoute({ current, withFrench = false, targetLabel = "German", meaningLabel = "English", locked = false, onClickPhase, phases }: {
  current: Phase;
  withFrench?: boolean;
  targetLabel?: string;
  meaningLabel?: string;
  locked?: boolean;
  onClickPhase?: (p: Phase) => void;
  /** Overrides the default route, for a phrase taking the short mastered path. */
  phases?: Phase[];
}) {
  // The bar must show the route actually being run. A phrase on the short
  // mastered route would otherwise display the full route and complete after
  // three, which reads as the lesson breaking rather than as a shortcut earned.
  const allPhases: Phase[] = phases
    ? [...phases]
    : withFrench ? [...BILINGUAL_SENTENCE_PHASES] : [...SENTENCE_PHASES];
  const idx = allPhases.indexOf(current);
  const n = allPhases.length;
  const activeStageRef = useRef<HTMLButtonElement>(null);
  const shortcutMenuRef = useRef<HTMLDivElement>(null);
  const shortcutTriggerRef = useRef<HTMLButtonElement>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const half = 100 / (n * 2); // center of first/last column, in %
  // Fill runs from the first stage's center to the current stage's center.
  const fillPct = n > 1 ? (Math.max(idx, 0) / (n - 1)) * 100 : 0;
  useEffect(() => {
    activeStageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);
  useEffect(() => {
    if (!shortcutsOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!shortcutMenuRef.current?.contains(event.target as Node)) setShortcutsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setShortcutsOpen(false);
      window.requestAnimationFrame(() => shortcutTriggerRef.current?.focus());
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [shortcutsOpen]);

  const shortcutForStage = (stageIndex: number) => {
    if (stageIndex < 9) {
      return { label: `Ctrl+${stageIndex + 1}`, aria: `Control+${stageIndex + 1}` };
    }
    if (stageIndex === 9) return { label: "Ctrl+0", aria: "Control+0" };
    return {
      label: `Ctrl+Shift+${stageIndex - 9}`,
      aria: `Control+Shift+${stageIndex - 9}`,
    };
  };

  return (
    <div className="fs-stagebar">
      <div className="fs-stagemeta">
        <div>
          <span>{ui("Stage")} {idx + 1} {ui("of")} {n}</span>
          <strong>{ui(phaseLabel(current, withFrench, targetLabel, meaningLabel))}</strong>
        </div>
        <div className="fs-stage-tools" ref={shortcutMenuRef}>
          <button
            ref={shortcutTriggerRef}
            type="button"
            className="fs-shortcut-trigger"
            aria-expanded={shortcutsOpen}
            aria-controls="lesson-keyboard-shortcuts"
            aria-label={ui("Keyboard shortcuts")}
            title={ui("Keyboard shortcuts")}
            onClick={() => setShortcutsOpen((open) => !open)}
          >
            <Keyboard aria-hidden="true" />
            <span className="fs-shortcut-trigger-keys"><kbd>←</kbd><kbd>→</kbd></span>
            <span className="fs-shortcut-trigger-label">{ui("Move stages")}</span>
          </button>
          {shortcutsOpen && (
            <div
              id="lesson-keyboard-shortcuts"
              className="fs-shortcut-panel"
              role="region"
              aria-label={ui("Keyboard shortcuts")}
            >
              <div className="fs-shortcut-head">
                <div>
                  <Keyboard aria-hidden="true" />
                  <strong>{ui("Keyboard shortcuts")}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShortcutsOpen(false);
                    window.requestAnimationFrame(() => shortcutTriggerRef.current?.focus());
                  }}
                  aria-label={ui("Close")}
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <div className="fs-shortcut-list">
                <div className="fs-shortcut-row">
                  <span><kbd>←</kbd><kbd>→</kbd></span>
                  <strong>{ui("Previous / next stage (when not typing)")}</strong>
                </div>
                <div className="fs-shortcut-row">
                  <span><kbd>Ctrl</kbd><kbd>{n <= 9 ? `1–${n}` : "1–9"}</kbd></span>
                  <strong>{ui("Jump directly to a stage")}</strong>
                </div>
                {n >= 10 && (
                  <div className="fs-shortcut-row">
                    <span><kbd>Ctrl</kbd><kbd>0</kbd></span>
                    <strong>{ui("Jump to stage 10")}</strong>
                  </div>
                )}
                {n > 10 && (
                  <div className="fs-shortcut-row">
                    <span><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>{`1–${n - 10}`}</kbd></span>
                    <strong>{ui("Jump to stages 11–15")}</strong>
                  </div>
                )}
                <div className="fs-shortcut-row">
                  <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></span>
                  <strong>{ui("Choose an answer")}</strong>
                </div>
                <div className="fs-shortcut-row">
                  <span><kbd>Enter</kbd></span>
                  <strong>{ui("Check / continue")}</strong>
                </div>
                <div className="fs-shortcut-row">
                  <span><kbd>Alt</kbd><kbd>K</kbd></span>
                  <strong>{ui("Know it")}</strong>
                </div>
                <div className="fs-shortcut-row">
                  <span><kbd>Alt</kbd><kbd>S</kbd></span>
                  <strong>{ui("Struggle")}</strong>
                </div>
              </div>
              <div className="fs-shortcut-altcodes">
                <div className="fs-shortcut-altcodes-head">
                  <strong>{ui("German characters")}</strong>
                  <span>{ui("Windows number pad")}</span>
                </div>
                <div className="fs-shortcut-altcodes-grid">
                  {[
                    ["ä", "0228"],
                    ["ö", "0246"],
                    ["ü", "0252"],
                    ["ß", "0223"],
                  ].map(([character, code]) => (
                    <div className="fs-shortcut-altcode" key={character}>
                      <strong>{character}</strong>
                      <span><kbd>Alt</kbd><b>+</b><code>{code}</code></span>
                    </div>
                  ))}
                </div>
                <p>{ui("Uppercase: Ä Alt + 0196 · Ö Alt + 0214 · Ü Alt + 0220")}</p>
              </div>
              <p>{ui("Stage numbers use Ctrl so Windows Alt-codes keep working. Hold Alt while typing the number-pad code, then release it. Arrow keys never take over an answer box.")}</p>
            </div>
          )}
        </div>
      </div>
      <div className="fs-stagetrack-scroll">
        <div className={cn("fs-stagetrack", n > 13 && "has-many-stages")} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          <div className="fs-stageline" style={{ left: `${half}%`, right: `${half}%` }} aria-hidden>
            <i style={{ width: `${fillPct}%` }} />
          </div>
          {allPhases.map((p, i) => {
            const stageShortcut = shortcutForStage(i);
            const stageName = ui(phaseLabel(p, withFrench, targetLabel, meaningLabel));
            return (
              <button
                key={p}
                ref={i === idx ? activeStageRef : undefined}
                type="button"
                title={`${ui("Stage")} ${i + 1}: ${stageName} · ${stageShortcut.label}`}
                aria-label={`${ui("Stage")} ${i + 1}: ${stageName}. ${stageShortcut.label}`}
                aria-keyshortcuts={stageShortcut.aria}
                aria-current={i === idx ? "step" : undefined}
                onClick={() => onClickPhase?.(p)}
                disabled={locked}
                className={cn(
                  "fs-stagebtn",
                  isClosedBookPhase(p) && "is-recall",
                  p === "RecallTarget" && "is-recall-start",
                  i === idx ? "is-active" : i < idx && "is-done"
                )}
              >
                <span>{i + 1}</span>
                <small>{stageName}</small>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useStickyFocus(ref: React.RefObject<HTMLInputElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = () => ref.current;
    el()?.focus();

    const INTERACTIVE = "input, textarea, select, button, a, [contenteditable], [role='button'], [tabindex]";
    const shouldSkip = () => {
      // Something is highlighted — never yank focus away from a selection.
      const sel = window.getSelection?.();
      if (sel && !sel.isCollapsed && String(sel).trim().length > 0) return true;
      // The user is focused on another real control (button, other input…).
      const a = document.activeElement as HTMLElement | null;
      if (a && a !== document.body && a !== el() && a.closest?.(INTERACTIVE)) return true;
      return false;
    };

    const restore = () => { if (!shouldSkip()) el()?.focus(); };
    // After a click/drag finishes, and after modifier-key shortcuts.
    const onMouseUp = () => setTimeout(restore, 0);
    const onKeyUp = (e: KeyboardEvent) => { if (e.key === "Tab") return; setTimeout(restore, 0); };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [ref, active]);
}

function isTextEntryTarget(target: EventTarget | null): boolean {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;
  return Boolean(
    element.isContentEditable
    || element.closest("input, textarea, select, [contenteditable='true'], [role='textbox']")
  );
}

function directStageShortcutIndex(event: KeyboardEvent): number | null {
  if (!event.ctrlKey || event.altKey || event.metaKey) return null;
  const match = /^(?:Digit|Numpad)([0-9])$/.exec(event.code);
  if (!match) return null;
  const digit = Number(match[1]);
  if (event.shiftKey) return digit >= 1 && digit <= 6 ? digit + 9 : null;
  return digit === 0 ? 9 : digit - 1;
}

function buildRecallHint(answer: string): string {
  const words = primaryAnswer(answer).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  return words.map((word, wordIndex) => {
    if (words.length > 1 && wordIndex === 0) return word;

    let revealedLetter = false;
    return Array.from(word).map((character) => {
      if (!/[\p{L}\p{N}]/u.test(character)) return character;
      if (!revealedLetter) {
        revealedLetter = true;
        return character;
      }
      return "•";
    }).join("");
  }).join(" ");
}

function RecallHelp({
  answer,
  hint,
  label,
  onHelp,
}: {
  answer: string;
  hint?: string;
  label?: string;
  onHelp?: () => void;
}) {
  const [level, setLevel] = useState<0 | 1 | 2>(0);
  const shownText = level === 2 ? primaryAnswer(answer) : (hint ?? buildRecallHint(answer));

  return (
    <div className={cn("fs-recall-help", level > 0 && "is-open", level === 2 && "is-answer")}>
      <div className="fs-recall-help-row">
        <span className="fs-recall-help-label">
          <Lightbulb aria-hidden="true" className="h-4 w-4" />
          {label && <>{ui(label)} <span aria-hidden="true">·</span></>} {ui("Need help?")}
        </span>
        <button
          type="button"
          className="fs-recall-help-action"
          onClick={() => {
            if (level < 2) onHelp?.();
            setLevel(level === 0 ? 1 : level === 1 ? 2 : 1);
          }}
          aria-expanded={level > 0}
        >
          {level === 0 ? (
            <><Lightbulb aria-hidden="true" className="h-4 w-4" /> {ui("Hint")}</>
          ) : level === 1 ? (
            <><Eye aria-hidden="true" className="h-4 w-4" /> {ui("Show answer")}</>
          ) : (
            <><EyeOff aria-hidden="true" className="h-4 w-4" /> {ui("Hide answer")}</>
          )}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {level > 0 && (
          <motion.div
            key={level}
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="fs-recall-help-content"
            role="status"
            aria-live="polite"
          >
            <span>{ui(level === 2 ? "Answer" : "Hint")}</span>
            <strong>{shownText}</strong>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TranslationWordBank({
  tokens,
  selected,
  disabled,
  checked,
  correct,
  onPick,
  onRemove,
}: {
  tokens: OrderToken[];
  selected: OrderToken[];
  disabled: boolean;
  checked: boolean;
  correct: boolean;
  onPick: (token: OrderToken) => void;
  onRemove: (index: number) => void;
}) {
  const selectedIds = new Set(selected.map((token) => token.id));

  return (
    <div className={cn(
      "fs-translation-bank",
      checked && correct && "is-good",
      checked && !correct && "is-bad"
    )}>
      <div className="fs-translation-answer" aria-label={ui("Your answer")}>
        <span className="fs-translation-bank-label">{ui("Your answer")}</span>
        <div className="fs-translation-picked" aria-live="polite">
          {selected.length === 0 ? (
            <span className="fs-translation-placeholder">{ui("Choose words to build your answer.")}</span>
          ) : selected.map((token, index) => (
            <button
              key={`${token.id}-picked`}
              type="button"
              className="fs-translation-picked-word"
              onClick={() => onRemove(index)}
              disabled={disabled}
              aria-label={`${ui("Remove word")}: ${token.text}`}
            >
              {token.text}
            </button>
          ))}
        </div>
      </div>
      <div className="fs-translation-options" aria-label={ui("Available words")}>
        <span className="fs-translation-bank-label">{ui("Available words")}</span>
        <div>
          {tokens.map((token) => {
            const used = selectedIds.has(token.id);
            return (
              <button
                key={token.id}
                type="button"
                className={cn("fs-translation-option", used && "is-used")}
                onClick={() => onPick(token)}
                disabled={disabled || used}
                aria-hidden={used}
                tabIndex={used ? -1 : 0}
              >
                {token.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// A single labeled language row (German / French) for bilingual companion mode.
// `active` highlights the language the learner is currently being asked to type.
function LangBlock({ label, text, active, onHear, onKnown, onStruggle }: {
  label: string;
  text: string;
  active?: boolean;
  onHear: () => void;
  onKnown?: () => void;
  onStruggle?: () => void;
}) {
  return (
    <div className={cn(
      "rounded-2xl p-4 transition-all",
      active
        ? "border-[1.5px] border-[var(--accent)] bg-white shadow-[0_0_0_3px_rgba(120,52,247,0.12)]"
        : "border border-zinc-100 bg-zinc-50/70"
    )}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-zinc-400">
          {label}
          {active && (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-black text-white">
              type this
            </span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          {onKnown && (
            <button
              type="button"
              onClick={onKnown}
              className="grade-btn grade-btn-known !h-7 !rounded-full !px-3 !text-xs"
            >
              {ui("Know it")}
            </button>
          )}
          {onStruggle && (
            <button
              type="button"
              onClick={onStruggle}
              className="grade-btn grade-btn-struggle !h-7 !rounded-full !px-3 !text-xs"
            >
              {ui("Struggle")}
            </button>
          )}
          <button
            type="button"
            aria-label={`Hear the ${label} sentence`}
            onClick={onHear}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-600 shadow-[inset_0_0_0_1px_#e4e4e7] transition-colors hover:bg-zinc-50"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="text-2xl font-black leading-tight tracking-tight text-zinc-950 sm:text-3xl">
        {text}
      </div>
    </div>
  );
}

function guidedTargetLanguageTag(): "de-DE" | "en-GB" | "en-US" {
  if (!learningEnglish()) return "de-DE";
  return resolveEnglishVariant(getEnglishVariant()) === "british" ? "en-GB" : "en-US";
}

function PromptLanguageBadge({ label }: { label: string }) {
  const isGerman = label === "German";
  const isEnglish = label === "English";
  // The English side mirrors the German flag treatment, but honours the
  // profile's English-variant setting so British learners see their own flag.
  const englishVariant = isEnglish ? resolveEnglishVariant(getEnglishVariant()) : null;
  const shortLabel = label.slice(0, 2).toUpperCase();
  const title = englishVariant ? ui(englishVariantLabel(englishVariant)) : ui(label);

  return (
    <span
      className={cn("fs-prompt-language", isGerman && "is-german", isEnglish && "is-english")}
      aria-label={title}
      title={title}
    >
      {isGerman ? (
        <i className="fs-german-flag" aria-hidden="true" />
      ) : isEnglish ? (
        <i
          className={cn("fs-english-flag", englishVariant === "british" ? "is-british" : "is-american")}
          aria-hidden="true"
        />
      ) : (
        shortLabel
      )}
    </span>
  );
}

type GuidedReviewLevel = "know" | "struggle" | "new" | "permanent" | 1 | 2 | 3 | 4 | 5;

/**
 * The rungs, described by what they actually do.
 *
 * These notes used to read "Review tomorrow", "Review in 3 days" and so on,
 * which was not true. A date on the ladder is the EARLIEST a review is asked
 * for, and an item you keep getting wrong is deliberately pulled back before
 * it -- that is the app working as intended, but the label promised something
 * else and so it read as a bug. Snooze is the control that genuinely holds an
 * item back; these set how strongly you know it.
 */
const GUIDED_REVIEW_LEVELS: Array<{ value: GuidedReviewLevel; label: string; note: string }> = [
  { value: "new", label: "New", note: "Starts over from the beginning" },
  { value: "struggle", label: "Struggling", note: "Comes back as soon as there is a slot" },
  { value: 1, label: "Not confident", note: "Comes back soon, often within a day" },
  { value: 2, label: "Familiar", note: "About 3 days away, sooner if you slip" },
  { value: 3, label: "Strong", note: "About 10 days away, sooner if you slip" },
  { value: 4, label: "Solid", note: "About 30 days away, sooner if you slip" },
  { value: 5, label: "Mastered", note: "About 180 days away, sooner if you slip" },
  { value: "permanent", label: "Never review", note: "Never comes back at all" },
];

/**
 * Putting something off, and meaning it.
 *
 * The rungs above are about how well you know a phrase, and the app is
 * allowed to bring those back early. These are a hard floor: nothing shows a
 * snoozed phrase before its date -- not a struggle mark, not the pet, not the
 * extra practice that repeated mistakes would normally earn it.
 */
const GUIDED_SNOOZE_CHOICES: Array<{ days: number; label: string; note: string }> = [
  { days: 1, label: "Tomorrow", note: "Nothing brings it back today" },
  { days: 3, label: "In 3 days", note: "Held back until then" },
  { days: 7, label: "In a week", note: "Held back until then" },
  { days: 30, label: "In a month", note: "Held back until then" },
];

function ReviewLevelPicker({
  onKnown,
  onSelect,
  onSnooze,
  disabled = false,
  knownAriaLabel,
  showShortcut = false,
  variant = "grade",
}: {
  onKnown: () => void;
  onSelect: (level: GuidedReviewLevel) => void;
  onSnooze?: (days: number) => void;
  disabled?: boolean;
  knownAriaLabel?: string;
  showShortcut?: boolean;
  variant?: "grade" | "flashcard";
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current == null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };
  const openMenu = () => {
    cancelClose();
    if (!disabled) setOpen(true);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, 180);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      className={cn("fs-review-level fs-known-review", variant === "flashcard" && "is-flashcard")}
      onBlurCapture={(event) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        scheduleClose();
      }}
      onFocusCapture={openMenu}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      ref={menuRef}
    >
      <div className="fs-known-review-trigger">
        <button
          aria-label={knownAriaLabel}
          className={variant === "flashcard" ? "fs-flashcard-known" : "grade-btn grade-btn-known"}
          disabled={disabled}
          onClick={onKnown}
          type="button"
        >
          {variant === "flashcard" && <CheckCircle2 className="h-4 w-4" />}
          {ui("Know it")}
          {showShortcut && <kbd className="grade-kbd">Alt K</kbd>}
        </button>
        <button
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={ui("More Know it options")}
          className="fs-known-review-more"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            cancelClose();
            setOpen((current) => !current);
          }}
          title={ui("More Know it options")}
          type="button"
        >
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="fs-review-level-menu" role="menu" aria-label={ui("Set review level")}>
          <div className="fs-review-level-menu-head">
            <strong>{ui("Set review level")}</strong>
            <span>{ui("How well do you know this? The app can still bring it back early if you keep slipping.")}</span>
          </div>
          <div className="fs-review-level-options">
            {GUIDED_REVIEW_LEVELS.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                role="menuitem"
                className={cn("fs-review-level-option", option.value === "struggle" && "is-struggle", option.value === "permanent" && "is-permanent")}
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                <strong>{ui(option.label)}</strong>
                <small>{ui(option.note)}</small>
              </button>
            ))}
          </div>
          {onSnooze && (
            <div className="fs-review-snooze">
              <div className="fs-review-level-menu-head">
                <strong>{ui("Or put it off")}</strong>
                <span>{ui("This one is a promise. Nothing shows it before the date you pick.")}</span>
              </div>
              <div className="fs-review-level-options">
                {GUIDED_SNOOZE_CHOICES.map((choice) => (
                  <button
                    key={choice.days}
                    type="button"
                    role="menuitem"
                    className="fs-review-level-option is-snooze"
                    onClick={() => {
                      onSnooze(choice.days);
                      setOpen(false);
                    }}
                  >
                    <strong>{ui(choice.label)}</strong>
                    <small>{ui(choice.note)}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * How long the "Marked as …" notice stays up before clearing itself. Long
 * enough to read the sentence it names and reach for Undo, short enough that
 * it is gone by the time the next card is being answered.
 */
const MANUAL_REVIEW_NOTICE_MS = 5000;

function reviewLevelDetails(level: GuidedReviewLevel) {
  if (level === "know") {
    return { label: "Known", note: "This item will return much later for a proper check." };
  }
  return GUIDED_REVIEW_LEVELS.find((option) => option.value === level) ?? GUIDED_REVIEW_LEVELS[0];
}

/**
 * Does choosing this level mean "I'm finished with this one for now"?
 *
 * Saying an item is Mastered — or that it should never be reviewed again —
 * and then being kept on it, still asked to pick its meaning, contradicts the
 * choice that was just made. Those levels schedule the item away, so the
 * lesson should move on exactly as "Know it" does.
 *
 * The two that stay put are the ones that ask for MORE practice, not less:
 * "Struggling" keeps the item in rotation, and "New" restarts it from scratch.
 */
function reviewLevelFinishesItem(level: GuidedReviewLevel): boolean {
  return level !== "struggle" && level !== "new";
}

// Only advances when the user types the sentence correctly.
/**
 * The "marked as …" note, shown inside the verdict card rather than above it.
 *
 * It used to be its own banner floating above "Not quite", which made one
 * moment look like two separate things happening: a verdict, and then an
 * unrelated red bar about scheduling. It is the same moment -- you got it
 * wrong, and here is what that means for when you see it again -- so it
 * belongs in the same card.
 */
/**
 * A conversation built from the phrases that are due.
 *
 * The beta used to be the ordinary thirteen-stage drill with the question
 * printed above it, which is not a conversation by any reading -- you still
 * read, chose, typed and translated the sentence in isolation, and the
 * question was decoration. This replaces the drill for those items: somebody
 * asks, you answer with the phrase, and that answer IS the review.
 *
 * One turn at a time, and the turns you have done stay on screen, so by the
 * end you are looking at a conversation you had rather than a list of
 * sentences you got right.
 */
function ManualReviewNote({ grade, notice, onUndo, onDismiss, onHold, onRelease }: {
  grade: string | null;
  notice?: { label: string; note: string; subject?: string } | null;
  onUndo?: () => void;
  onDismiss?: () => void;
  onHold?: () => void;
  onRelease?: () => void;
}) {
  if (grade !== "struggle" && !notice) return null;
  const isStruggle = grade === "struggle" || notice?.label === "Struggling";
  return (
    <span
      className={cn("fs-result-note", isStruggle && "is-struggle")}
      role="status"
      onMouseEnter={onHold}
      onMouseLeave={onRelease}
      onFocusCapture={onHold}
      onBlurCapture={onRelease}
    >
      <span className="fs-result-note-text">
        {isStruggle
          ? ui("Marked as struggle. This item will stay in practice instead of being skipped next time.")
          : `${ui("Marked as")} ${ui(notice?.label ?? "")}. ${ui(notice?.note ?? "")}`}
        {/* Which phrase. Once putting one off moves the lesson on, the note
            is describing something no longer on screen, and an Undo you
            cannot identify is one nobody will press. */}
        {notice?.subject && (
          <span className="fs-result-note-subject"> — “{notice.subject}”</span>
        )}
      </span>
      {notice && (
        <span className="fs-result-note-actions">
          <button type="button" className="fs-result-note-undo" onClick={onUndo}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {ui("Undo")}
          </button>
          <button
            type="button"
            className="fs-result-note-dismiss"
            aria-label={ui("Dismiss")}
            onClick={onDismiss}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
      )}
    </span>
  );
}
function SentenceExercise({ item, listeningChoicePool, translationChoicePool = [], onNext, onSkip, onGradeItem, onReviewLevel, onSnooze, onAnswer, manualReviewNotice, onUndoManualReview, onDismissManualReview, onHoldManualReview, onReleaseManualReview }: {
  item: any;
  listeningChoicePool: string[];
  translationChoicePool: string[];
  onNext: () => void;
  onSkip?: () => void;
  onGradeItem?: (itemId: string, grade: "know" | "struggle") => void;
  onReviewLevel?: (level: GuidedReviewLevel) => void;
  onSnooze?: (days: number) => void;
  onAnswer?: (correct: boolean) => void;
  /** The pending mark for THIS item, so the banner can host Undo inline. */
  manualReviewNotice?: { label: string; note: string } | null;
  onUndoManualReview?: () => void;
  /** Pause the notice's own countdown while it is being read or aimed at. */
  onHoldManualReview?: () => void;
  onReleaseManualReview?: () => void;
  onDismissManualReview?: () => void;
}) {
  const shakeControls = useAnimationControls();
  const reactToAnswer = (ok: boolean, gentle = false, animate = true) => {
    onAnswer?.(ok);
    if (!animate) return;
    if (ok) shakeControls.start({ scale: [1, 1.05, 1], transition: { duration: 0.32 } });
    // A coached near-miss ("people would understand you") gets a soft pulse,
    // not the hard error shake — it's a teaching moment, not a slap.
    else if (gentle) shakeControls.start({ scale: [1, 1.02, 1], transition: { duration: 0.3 } });
    else shakeControls.start({ x: [0, -9, 9, -7, 7, -3, 0], transition: { duration: 0.42 } });
  };
  // A phrase the learner already recalls reliably starts on the closed-book
  // checks instead of the full route. Failing one of them sets this, which puts
  // the full route back — the short route is a reward for remembering, not a
  // permanent downgrade of how carefully the phrase is taught.
  const [recallFailed, setRecallFailed] = useState(false);
  const masteredRoute = item?.mastery === "strong" && !recallFailed;
  const [audioMuted, setAudioMuted] = useState(
    () => getTtsAudioVolume(guidedTargetLanguageTag()) <= 0
  );
  const audioMutedRef = useRef(audioMuted);
  useEffect(() => {
    const syncAudioState = () => {
      // Listening checks require the voice for the language being learned.
      // Muting only German or only English must therefore remove those checks
      // even when sound effects and the other language remain audible.
      const muted = getTtsAudioVolume(guidedTargetLanguageTag()) <= 0;
      audioMutedRef.current = muted;
      setAudioMuted(muted);
    };
    syncAudioState();
    window.addEventListener(AUDIO_SETTINGS_EVENT, syncAudioState);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, syncAudioState);
  }, []);
  const [phase, setPhase] = useState<Phase>(
    item?.mastery === "strong" ? MASTERED_PHASES[0] : "Read"
  );
  const currentPhaseRef = useRef<Phase>(phase);
  useEffect(() => { currentPhaseRef.current = phase; }, [phase]);
  /** The stages this phrase actually runs through. */
  // A vocabulary sitting reuses these exercises but not the whole march:
  // a single word runs the short word route (see guidedLessonPhases).
  const isWordItem = item?.kind === "word";
  // Two tiles have exactly one possible arrangement other than the shuffle
  // they start in, so dragging them "in order" tests nothing — drop the
  // stage rather than ship a one-move formality.
  const isOrderable = String(item?.de ?? "").trim().split(/\s+/).filter(Boolean).length > 2;
  const phaseRoute = (): Phase[] => buildSentencePhaseRoute({
    mastered: masteredRoute,
    bilingual: hasFr,
    audioMuted: audioMutedRef.current,
    word: isWordItem,
    orderable: isOrderable,
  });
  // True while the app voice is actually speaking — drives the waveform accent.
  const [ttsOn, setTtsOn] = useState(false);
  useEffect(() => {
    const onSpeak = (e: Event) => setTtsOn(Boolean((e as CustomEvent).detail));
    window.addEventListener(TTS_SPEAKING_EVENT, onSpeak);
    return () => window.removeEventListener(TTS_SPEAKING_EVENT, onSpeak);
  }, []);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [enInput, setEnInput] = useState("");
  const [enChecked, setEnChecked] = useState(false);
  const [enAttempts, setEnAttempts] = useState(0);
  const [translationMode, setTranslationMode] = useState<"bank" | "type">("type");
  const [translationPicked, setTranslationPicked] = useState<OrderToken[]>([]);
  const [gapInput, setGapInput] = useState("");
  const [gapChecked, setGapChecked] = useState(false);
  const gapInputRef = useRef<HTMLInputElement>(null);
  const [meaningChoice, setMeaningChoice] = useState<string | null>(null);
  const [meaningChecked, setMeaningChecked] = useState(false);
  const [meaningSelectChoice, setMeaningSelectChoice] = useState<string | null>(null);
  const [meaningSelectChecked, setMeaningSelectChecked] = useState(false);
  const [listeningChoice, setListeningChoice] = useState<string | null>(null);
  const [listeningChecked, setListeningChecked] = useState(false);
  const [missingWordPreview, setMissingWordPreview] = useState<string | null>(null);
  const [missingWordChoice, setMissingWordChoice] = useState<string | null>(null);
  const [missingWordChecked, setMissingWordChecked] = useState(false);
  const [orderTokens, setOrderTokens] = useState<OrderToken[]>(() => buildOrderTokens(item.de));
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderTouched, setOrderTouched] = useState(false);
  const [orderSelected, setOrderSelected] = useState<number | null>(null);
  const [orderDragging, setOrderDragging] = useState<string | null>(null);
  const [orderDropTarget, setOrderDropTarget] = useState<string | null>(null);
  const draggedOrderTokenId = useRef<string | null>(null);
  const suppressOrderClickRef = useRef(false);
  const orderAdvanceTimerRef = useRef<number | null>(null);

  // Final "Write it" stage: type the whole target sentence from its meaning.
  const [sayInput, setSayInput] = useState("");
  const [sayChecked, setSayChecked] = useState(false);
  const sayRef = useRef<HTMLInputElement>(null);
  const [recallTargetInput, setRecallTargetInput] = useState("");
  const [recallTargetChecked, setRecallTargetChecked] = useState(false);
  const recallTargetRef = useRef<HTMLInputElement>(null);
  const [recallMeaningInput, setRecallMeaningInput] = useState("");
  const [recallMeaningChecked, setRecallMeaningChecked] = useState(false);
  const recallMeaningRef = useRef<HTMLInputElement>(null);
  const [recallBothTargetInput, setRecallBothTargetInput] = useState("");
  const [recallBothMeaningInput, setRecallBothMeaningInput] = useState("");
  const [recallBothTargetChecked, setRecallBothTargetChecked] = useState(false);
  const [recallBothChecked, setRecallBothChecked] = useState(false);
  // Is a verdict card on screen? If one is, it hosts the "marked as" note;
  // if not, the note needs a card of its own or Undo has nowhere to live.
  const verdictShowing = enChecked || gapChecked || meaningChecked || meaningSelectChecked
    || listeningChecked || missingWordChecked || orderChecked || sayChecked
    || recallTargetChecked || recallMeaningChecked || recallBothTargetChecked || recallBothChecked;
  const recallBothTargetRef = useRef<HTMLInputElement>(null);
  const recallBothMeaningRef = useRef<HTMLInputElement>(null);
  const [recallTransitionPending, setRecallTransitionPending] = useState(false);
  const recallTransitionPendingRef = useRef(false);
  const recallCompletionScheduledRef = useRef(false);
  const recallCompletionTimerRef = useRef<number | null>(null);
  const recallAdvanceTokenRef = useRef(0);
  const [frInput, setFrInput] = useState("");
  const [frChecked, setFrChecked] = useState(false);
  const [frAttempts, setFrAttempts] = useState(0);
  const [memDeInput, setMemDeInput] = useState("");
  const [memDeChecked, setMemDeChecked] = useState(false);
  const [memFrInput, setMemFrInput] = useState("");
  const [memFrChecked, setMemFrChecked] = useState(false);
  const [grade, setGrade] = useState<"know" | "struggle" | null>(null);
  // The lesson owns the pending mark; this banner is one of its two faces.
  // When the notice times out up there, the banner has to go with it —
  // otherwise the toast disappears and this copy sits on the card for ever.
  useEffect(() => {
    if (!manualReviewNotice) setGrade(null);
  }, [manualReviewNotice]);
  const inputRef = useRef<HTMLInputElement>(null);
  const enInputRef = useRef<HTMLInputElement>(null);
  const frInputRef = useRef<HTMLInputElement>(null);
  const memDeRef = useRef<HTMLInputElement>(null);
  const memFrRef = useRef<HTMLInputElement>(null);

  // The answer box stays focused so you can always just type — but selecting
  // text (the sentence, the meaning) is never interrupted. One hook per typing
  // phase; only the active phase's box claims focus.
  useStickyFocus(inputRef, phase === "Type" || phase === "TypeAgain");
  useStickyFocus(enInputRef, (phase === "Translate" || phase === "TranslateAgain") && translationMode === "type");
  useStickyFocus(gapInputRef, phase === "Gap");
  useStickyFocus(sayRef, phase === "WriteFromMemory");
  useStickyFocus(recallTargetRef, phase === "RecallTarget");
  useStickyFocus(recallMeaningRef, phase === "RecallMeaning");
  useStickyFocus(frInputRef, phase === "French");
  const englishVariant = useMemo(() => getEnglishVariant(), []);
  // Learning direction: by default German is the target (item.de) and English the
  // meaning (item.en). When learning English, the session builder has already
  // swapped the fields, so item.de IS the English target — we just need the right
  // TTS/speech language and labels.
  const learnEn = useMemo(() => learningEnglish(), []);
  // A German speaker learning English hears this on every stage, so it has to
  // honour their British/American choice — it was pinned to American, which
  // made the setting look broken to anyone who picked British.
  const targetLang = guidedTargetLanguageTag();
  const targetLabel = learnEn ? "English" : "German";
  const meaningLabel = learnEn ? "German" : "English";
  // Spoken gap-fill: sentence with 1-2 words blanked, learner says the missing word(s).
  const gap = useMemo(() => computeGap(item.de), [item.de]);
  // The meaning text (item.en) is already English in normal mode (apply spelling
  // variant) but is German when learning English (show as-is).
  const displayEnglish = useMemo(
    () => (learnEn ? item.en : formatEnglishText(item.en, englishVariant)),
    [item.en, englishVariant, learnEn]
  );
  const listeningChoices = useMemo(
    () => buildListeningChoices(item.de, listeningChoicePool),
    [item.de, listeningChoicePool]
  );
  const meaningChoices = useMemo(
    () => buildListeningChoices(item.de, listeningChoicePool, 3),
    [item.de, listeningChoicePool]
  );
  const meaningCorrect = meaningChoice !== null && choiceKey(meaningChoice) === choiceKey(item.de);
  const listeningCorrect = listeningChoice !== null && choiceKey(listeningChoice) === choiceKey(item.de);
  const missingWord = useMemo(() => computeListeningGap(item.de), [item.de]);
  const missingWordChoices = useMemo(
    () => buildMissingWordChoices(missingWord.answer, listeningChoicePool),
    [missingWord.answer, listeningChoicePool]
  );
  const missingWordCorrect = missingWordChoice !== null
    && choiceKey(missingWordChoice) === choiceKey(missingWord.answer);
  // In learn-English mode the target text is English — use the English matcher
  // so contractions ("it's" == "it is") and spelling variants are accepted.
  const matchTarget = learnEn ? matchEnglish : matchGermanSentence;
  // Where the spoken short form is what we teach, the fuller written form the
  // learner will have met in a book stays correct too. Taking the better of the
  // two results means the shown answer is the one people say, without punishing
  // anyone who typed the one people write.
  const matchEither = React.useCallback(
    (typed: string) => {
      const primary = matchTarget(typed, item.de);
      if (primary.ok || !item.long) return primary;
      const alt = matchTarget(typed, item.long);
      return alt.ok ? alt : primary;
    },
    [item.de, item.long, matchTarget]
  );
  const result   = useMemo(() => matchEither(input), [input, matchEither]);
  const sayResult = useMemo(() => matchEither(sayInput), [sayInput, matchEither]);
  // The other half of the pair, used only to recognise an answer aimed at the
  // wrong box. `displayEnglish` is whichever side carries the meaning, so this
  // stays correct in both learning directions.
  const matchMeaning = React.useCallback(
    (typed: string) => learnEn
      ? isWordItem
        ? matchGermanMeaning(typed, displayEnglish)
        : matchGermanSentence(typed, displayEnglish)
      : isWordItem
        ? matchEnglishMeaning(typed, displayEnglish)
        : matchEnglish(typed, displayEnglish),
    [displayEnglish, isWordItem, learnEn]
  );
  const recallTargetResult = useMemo(
    () => matchEither(recallTargetInput),
    [recallTargetInput, matchEither]
  );
  const recallBothTargetResult = useMemo(
    () => matchEither(recallBothTargetInput),
    [recallBothTargetInput, matchEither]
  );
  const recallBothTargetReady = recallBothTargetChecked && recallBothTargetResult.ok;
  useStickyFocus(recallBothTargetRef, phase === "RecallBoth" && !recallBothTargetReady);
  useStickyFocus(
    recallBothMeaningRef,
    phase === "RecallBoth" && recallBothTargetReady && !recallBothChecked
  );
  // Translate phase: in learn-DE mode the answer is English; in learn-EN mode
  // the answer is German — each direction gets its own synonym/coach matcher.
  const shownEnglish = useMemo(
    () => isWordItem
      ? learnEn ? primaryGermanMeaning(displayEnglish) : primaryEnglishMeaning(displayEnglish)
      : primaryAnswer(displayEnglish),
    [displayEnglish, isWordItem, learnEn]
  );
  const meaningSelectPool = useMemo(
    () => translationChoicePool.map((value) => {
      const displayValue = learnEn ? value : formatEnglishText(value, englishVariant);
      if (!isWordItem) return primaryAnswer(displayValue);
      return learnEn ? primaryGermanMeaning(displayValue) : primaryEnglishMeaning(displayValue);
    }),
    [translationChoicePool, learnEn, englishVariant, isWordItem]
  );
  const meaningSelectChoices = useMemo(
    () => buildListeningChoices(shownEnglish, meaningSelectPool, 3),
    [shownEnglish, meaningSelectPool]
  );
  const meaningSelectCorrect = meaningSelectChoice !== null
    && choiceKey(meaningSelectChoice) === choiceKey(shownEnglish);
  const translationTokens = useMemo(
    () => buildTranslationChoices(shownEnglish, translationChoicePool),
    [shownEnglish, translationChoicePool]
  );
  const translationAnswer = translationMode === "bank"
    ? translationPicked.map((token) => token.text).join(" ")
    : enInput;
  const enResult = useMemo(
    () => matchMeaning(translationAnswer),
    [translationAnswer, matchMeaning]
  );
  const recallMeaningResult = useMemo(
    () => matchMeaning(recallMeaningInput),
    [recallMeaningInput, matchMeaning]
  );
  const recallBothMeaningResult = useMemo(
    () => matchMeaning(recallBothMeaningInput),
    [recallBothMeaningInput, matchMeaning]
  );
  const meaningLang = learnEn
    ? "de-DE"
    : resolveEnglishVariant(englishVariant) === "american" ? "en-US" : "en-GB";
  // Gap stage: the typed answer just needs to contain each missing word
  // (order-free, ß/case tolerant), so a single blank accepts the one word and
  // two blanks accept both in either order.
  const gapResult = useMemo(() => {
    return { ok: matchesGapInput(gapInput, gap.words) };
  }, [gapInput, gap.words]);
  const orderIsCorrect = useMemo(
    () => wordOrderTokensMatchSentence(orderTokens, item.de),
    [orderTokens, item.de]
  );
  const orderLocked = orderChecked && orderIsCorrect;
  // French companion: tested as an extra phase when enabled and the item has French
  // — only in the German-learning direction.
  const companion = useMemo(() => getCompanion(), []);
  const hasFr = companion === "fr" && !learnEn && typeof item.fr === "string" && item.fr.trim().length > 0;
  const frResult = useMemo(() => match(frInput, item.fr ?? ""), [frInput, item.fr]);
  const memDeResult = useMemo(() => matchEither(memDeInput), [memDeInput, matchEither]);
  const memFrResult = useMemo(() => match(memFrInput, item.fr ?? ""), [memFrInput, item.fr]);

  // Audio settings change lessons immediately. If the required target voice
  // is muted during an audio-only check, continue at the next stage that can
  // be done without sound instead of leaving an impossible stage active.
  useEffect(() => {
    if (!audioMuted) return;
    const replacement = replacementSentencePhaseWhenMuted(phase, {
      mastered: masteredRoute,
      bilingual: hasFr,
      word: isWordItem,
      orderable: isOrderable,
      });
    if (!replacement || replacement === phase) return;
    currentPhaseRef.current = replacement;
    setPhase(replacement);
  }, [audioMuted, hasFr, masteredRoute, phase]);

  // A phase outside the current route renders NOTHING: every stage branch is
  // false, the header stays up, and the lesson looks dead. Routes change under
  // a live session — settings, updates that remove a stage, mastery flips —
  // so rather than trusting every path to notice, an impossible phase snaps to
  // the start of the route. A visible restart of one exercise beats a blank,
  // and the recovery is recorded so it shows up in the crash reports.
  useEffect(() => {
    const route = phaseRoute();
    if (route.length === 0 || route.includes(phase)) return;
    recordCrash({
      kind: "render",
      message: `guided phase "${phase}" is not in the current route [${route.join(", ")}] — recovered to "${route[0]}"`,
    });
    currentPhaseRef.current = route[0];
    setPhase(route[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, masteredRoute, hasFr, audioMuted]);


  // Play lesson audio automatically on first exposure and listening checks.
  // TTS is a no-op while muted, so the global mute still applies.
  useEffect(() => {
    if (audioMuted) return;
    if (phase !== "Read" && phase !== "ListenPick") return;
    if (phase === "ListenPick") tts(item.de, 0.88, targetLang);
    else if (hasFr) ttsSequence([{ text: item.de, lang: "de-DE" }, { text: item.fr, rate: 0.85, lang: "fr-FR" }]);
    else tts(item.de, 0.88, targetLang);
  }, [phase, item.de, item.fr, hasFr, audioMuted, targetLang]);

  // Focus input when entering Type or Translate phase
  useEffect(() => {
    if (phase === "Type" || phase === "TypeAgain")           setTimeout(() => inputRef.current?.focus(), 100);
    if ((phase === "Translate" || phase === "TranslateAgain") && translationMode === "type") {
      setTimeout(() => enInputRef.current?.focus(), 100);
    }
    if (phase === "Gap")       setTimeout(() => gapInputRef.current?.focus(), 100);
    if (phase === "WriteFromMemory") setTimeout(() => sayRef.current?.focus(), 100);
    if (phase === "RecallTarget") setTimeout(() => recallTargetRef.current?.focus(), 100);
    if (phase === "RecallMeaning") setTimeout(() => recallMeaningRef.current?.focus(), 100);
    if (phase === "RecallBoth") setTimeout(() => recallBothTargetRef.current?.focus(), 100);
    if (phase === "French")    setTimeout(() => frInputRef.current?.focus(), 100);
    if (phase === "Memory")    setTimeout(() => memDeRef.current?.focus(), 100);
  }, [phase, translationMode]);

  const advance = () => {
    // Ignore a delayed auto-advance if the learner manually jumped elsewhere
    // during the success animation.
    if (currentPhaseRef.current !== phase) return;
    const order: Phase[] = phaseRoute();
    const next = order[order.indexOf(phase) + 1];
    if (next) {
      currentPhaseRef.current = next;
      setPhase(next);
    }
  };

  // Advance to the next phase, or finish the exercise if this was the last one.
  // Used by the typing steps so the second Translate round ends the exercise.
  const advanceOrFinish = () => {
    if (currentPhaseRef.current !== phase) return;
    const order: Phase[] = phaseRoute();
    const next = order[order.indexOf(phase) + 1];
    if (next) {
      currentPhaseRef.current = next;
      setPhase(next);
    } else finishOrFrench();
  };

  // The second Type / Translate rounds reuse the first round's input state, so
  // clear it when the round begins — otherwise it shows the previous answer as
  // already-correct.
  useEffect(() => {
    if (orderAdvanceTimerRef.current !== null) {
      window.clearTimeout(orderAdvanceTimerRef.current);
      orderAdvanceTimerRef.current = null;
    }
    recallAdvanceTokenRef.current += 1;
    if (recallCompletionTimerRef.current !== null) {
      window.clearTimeout(recallCompletionTimerRef.current);
      recallCompletionTimerRef.current = null;
    }
    recallTransitionPendingRef.current = false;
    setRecallTransitionPending(false);
    recallCompletionScheduledRef.current = false;
    if (phase === "MeaningPick") {
      setMeaningChoice(null);
      setMeaningChecked(false);
    }
    if (phase === "MeaningSelect") {
      setMeaningSelectChoice(null);
      setMeaningSelectChecked(false);
    }
    if (phase === "ListenPick") {
      setListeningChoice(null);
      setListeningChecked(false);
    }
    if (phase === "MissingWord") {
      setMissingWordChoice(null);
      setMissingWordChecked(false);
    }
    if (phase === "TypeAgain") { setInput(""); setChecked(false); setAttempts(0); }
    if (phase === "Translate") {
      setEnInput("");
      setEnChecked(false);
      setEnAttempts(0);
      setTranslationPicked([]);
      setTranslationMode("type");
    }
    if (phase === "TranslateAgain") {
      setEnInput("");
      setEnChecked(false);
      setEnAttempts(0);
      setTranslationPicked([]);
      setTranslationMode("type");
    }
    if (phase === "Gap") { setGapInput(""); setGapChecked(false); }
    if (phase === "Order") {
      setOrderTokens(buildOrderTokens(item.de));
      setOrderChecked(false);
      setOrderTouched(false);
      setOrderSelected(null);
      setOrderDragging(null);
      setOrderDropTarget(null);
      draggedOrderTokenId.current = null;
      suppressOrderClickRef.current = false;
    }
    if (phase === "WriteFromMemory") { setSayInput(""); setSayChecked(false); }
    if (phase === "RecallTarget") {
      setRecallTargetInput("");
      setRecallTargetChecked(false);
    }
    if (phase === "RecallMeaning") {
      setRecallMeaningInput("");
      setRecallMeaningChecked(false);
    }
    if (phase === "RecallBoth") {
      setRecallBothTargetInput("");
      setRecallBothMeaningInput("");
      setRecallBothTargetChecked(false);
      setRecallBothChecked(false);
    }
  }, [phase, item.de]);

  useEffect(() => () => {
    recallAdvanceTokenRef.current += 1;
    if (recallCompletionTimerRef.current !== null) {
      window.clearTimeout(recallCompletionTimerRef.current);
    }
    if (orderAdvanceTimerRef.current !== null) {
      window.clearTimeout(orderAdvanceTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (phase !== "MeaningPick") return;
    const handleChoiceKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || meaningChecked) return;
      if (event.key === "Enter" && meaningChoice) {
        event.preventDefault();
        const ok = choiceKey(meaningChoice) === choiceKey(item.de);
        setMeaningChecked(true);
        reactToAnswer(ok);
        if (ok) {
          tts(item.de, 0.88, targetLang);
          window.setTimeout(advanceOrFinish, 900);
        }
        return;
      }
      const optionIndex = Number(event.key) - 1;
      const option = meaningChoices[optionIndex];
      if (!option) return;
      event.preventDefault();
      setMeaningChoice(option);
      setMeaningChecked(true);
      const ok = choiceKey(option) === choiceKey(item.de);
      reactToAnswer(ok);
      if (ok) {
        tts(item.de, 0.88, targetLang);
        window.setTimeout(advanceOrFinish, 900);
      }
    };
    window.addEventListener("keydown", handleChoiceKey);
    return () => window.removeEventListener("keydown", handleChoiceKey);
  }, [phase, meaningChecked, meaningChoice, meaningChoices, item.de, targetLang]);

  useEffect(() => {
    if (phase !== "MeaningSelect") return;
    const handleChoiceKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter" && meaningSelectChecked && meaningSelectCorrect) {
        event.preventDefault();
        advanceOrFinish();
        return;
      }
      if (meaningSelectChecked) return;
      const optionIndex = Number(event.key) - 1;
      const option = meaningSelectChoices[optionIndex];
      if (!option) return;
      event.preventDefault();
      const ok = choiceKey(option) === choiceKey(shownEnglish);
      setMeaningSelectChoice(option);
      setMeaningSelectChecked(true);
      reactToAnswer(ok);
      if (ok) window.setTimeout(advanceOrFinish, 900);
    };
    window.addEventListener("keydown", handleChoiceKey);
    return () => window.removeEventListener("keydown", handleChoiceKey);
  }, [
    phase,
    meaningSelectChecked,
    meaningSelectChoice,
    meaningSelectChoices,
    meaningSelectCorrect,
  ]);

  useEffect(() => {
    if (phase !== "ListenPick") return;
    const handleChoiceKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (isTextEntryTarget(event.target)) return;
      if (listeningChecked) {
        // After a miss, Space / R / → replay the phrase and reopen the round —
        // the keyboard version of "Hear it and try again". Registered in the
        // capture phase so → wins over the bubble-phase stage-nav arrows,
        // which skip events that are already defaultPrevented.
        if (listeningCorrect) return;
        if (event.key === " " || event.key === "r" || event.key === "R" || event.key === "ArrowRight") {
          event.preventDefault();
          retryListening();
        }
        return;
      }
      const optionIndex = Number(event.key) - 1;
      const option = listeningChoices[optionIndex];
      if (!option) return;
      event.preventDefault();
      setListeningChoice(option);
      setListeningChecked(true);
      const ok = choiceKey(option) === choiceKey(item.de);
      reactToAnswer(ok);
      if (ok) window.setTimeout(advanceOrFinish, 900);
    };
    window.addEventListener("keydown", handleChoiceKey, true);
    return () => window.removeEventListener("keydown", handleChoiceKey, true);
  }, [phase, listeningChecked, listeningCorrect, listeningChoices, item.de, targetLang]);

  useEffect(() => {
    if (phase !== "MissingWord") return;
    const handleChoiceKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (isTextEntryTarget(event.target)) return;
      if (missingWordChecked) {
        // Same retry keys as the listening round: Space / R / → reopen it.
        if (missingWordCorrect) return;
        if (event.key === " " || event.key === "r" || event.key === "R" || event.key === "ArrowRight") {
          event.preventDefault();
          retryMissingWord();
        }
        return;
      }
      const option = missingWordChoices[Number(event.key) - 1];
      if (!option) return;
      event.preventDefault();
      const ok = choiceKey(option) === choiceKey(missingWord.answer);
      setMissingWordPreview(null);
      setMissingWordChoice(option);
      setMissingWordChecked(true);
      reactToAnswer(ok);
      if (ok) {
        tts(item.de, 0.88, targetLang);
        window.setTimeout(advanceOrFinish, 900);
      }
    };
    window.addEventListener("keydown", handleChoiceKey, true);
    return () => window.removeEventListener("keydown", handleChoiceKey, true);
  }, [phase, missingWordChecked, missingWordCorrect, missingWordChoices, missingWord.answer, item.de, targetLang]);

  const goBack = () => {
    if (recallTransitionPendingRef.current || recallCompletionScheduledRef.current) return;
    const order: Phase[] = phaseRoute();
    const prev = order[order.indexOf(phase) - 1];
    if (prev) {
      currentPhaseRef.current = prev;
      setPhase(prev);
    }
  };

  const goToPhase = (p: Phase) => {
    if (!recallTransitionPendingRef.current && !recallCompletionScheduledRef.current) {
      currentPhaseRef.current = p;
      setPhase(p);
    }
  };

  useEffect(() => {
    const handleStageShortcut = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented
        || event.repeat
        || event.isComposing
        || recallTransitionPendingRef.current
        || recallCompletionScheduledRef.current
      ) return;

      const route = phaseRoute();
      const directIndex = directStageShortcutIndex(event);
      if (directIndex !== null) {
        const destination = route[directIndex];
        if (!destination) return;
        event.preventDefault();
        event.stopPropagation();
        goToPhase(destination);
        return;
      }

      if (
        event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
        || phase === "Order"
        || isTextEntryTarget(event.target)
      ) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const currentIndex = route.indexOf(phase);
      const offset = event.key === "ArrowLeft" ? -1 : 1;
      const destination = route[currentIndex + offset];
      if (!destination) return;
      event.preventDefault();
      event.stopPropagation();
      goToPhase(destination);
    };

    window.addEventListener("keydown", handleStageShortcut);
    return () => window.removeEventListener("keydown", handleStageShortcut);
    // phaseRoute intentionally derives from these route inputs and the live
    // audio ref, which is updated synchronously by the mute event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, masteredRoute, hasFr, audioMuted]);

  // Auto-advance: once the typed answer is strictly correct (no lenient/typo
  // pass), confirm it automatically — no Check press needed.
  useEffect(() => {
    if ((phase === "Type" || phase === "TypeAgain") && !checked && input.trim() && result.ok && !result.spellingNote) checkAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);
  useEffect(() => {
    if (
      (phase === "Translate" || phase === "TranslateAgain")
      && !enChecked
      && translationAnswer.trim()
      && enResult.ok
      && !enResult.spellingNote
    ) {
      checkEnAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationAnswer]);
  useEffect(() => {
    if (phase === "Gap" && !gapChecked && gapInput.trim() && gapResult.ok) checkGap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gapInput]);
  useEffect(() => {
    if (phase === "WriteFromMemory" && !sayChecked && sayInput.trim() && sayResult.ok && !sayResult.spellingNote) checkSay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sayInput]);
  useEffect(() => {
    if (
      phase === "RecallTarget"
      && !recallTargetChecked
      && recallTargetInput.trim()
      && recallTargetResult.ok
      && !recallTargetResult.spellingNote
    ) checkRecallTarget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recallTargetInput]);
  useEffect(() => {
    if (
      phase === "RecallMeaning"
      && !recallMeaningChecked
      && recallMeaningInput.trim()
      && recallMeaningResult.ok
      && !recallMeaningResult.spellingNote
    ) checkRecallMeaning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recallMeaningInput]);
  useEffect(() => {
    if (
      phase === "RecallBoth"
      && !recallBothTargetReady
      && recallBothTargetInput.trim()
      && recallBothTargetResult.ok
      && !recallBothTargetResult.spellingNote
    ) checkRecallBothTarget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recallBothTargetInput, recallBothTargetChecked]);
  useEffect(() => {
    if (
      phase === "RecallBoth"
      && !recallBothChecked
      && recallBothMeaningInput.trim()
      && recallBothMeaningResult.ok
      && !recallBothMeaningResult.spellingNote
    ) checkRecallBoth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recallBothMeaningInput, recallBothChecked]);
  useEffect(() => {
    if (
      phase === "Order"
      && orderTouched
      && !orderChecked
      && orderIsCorrect
      && orderDragging === null
      && draggedOrderTokenId.current === null
    ) {
      checkOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderTokens, orderTouched, orderDragging]);
  useEffect(() => {
    if (phase === "French" && !frChecked && frInput.trim() && frResult.ok && !frResult.spellingNote) checkFrAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frInput]);
  useEffect(() => {
    if (
      phase === "Memory"
      && !memDeChecked
      && !memFrChecked
      && memDeInput.trim()
      && memFrInput.trim()
      && memDeResult.ok
      && memFrResult.ok
      && !memDeResult.spellingNote
      && !memFrResult.spellingNote
    ) {
      checkMemory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memDeInput, memFrInput]);

  /**
   * Answering in the wrong language is a slip, not a gap in knowledge.
   *
   * Typing the English translation into the German box means the learner knew
   * the pair perfectly well and aimed at the wrong half of it. Grading that as
   * a failure marks the phrase "struggle", drops a mastered item back onto the
   * full fifteen-stage route, and adds difficulty debt — all for a mis-aimed
   * answer. So these are caught before any of that, and the learner is simply
   * pointed at the right box.
   *
   * Only consulted once the expected side has already failed to match, so a
   * genuinely correct answer can never be mistaken for one of these.
   */
  const [wrongLanguageNotice, setWrongLanguageNotice] = useState<string | null>(null);
  const answeredOtherSide = (typed: string, expecting: "target" | "meaning") => {
    const trimmed = typed.trim();
    // Single characters and stray words match too easily to judge.
    if (trimmed.length < 3) return false;
    return expecting === "target"
      ? matchMeaning(trimmed).ok
      : matchEither(trimmed).ok;
  };
  const flagWrongLanguage = (expecting: "target" | "meaning") => {
    const wanted = expecting === "target" ? targetLabel : meaningLabel;
    const typedInstead = expecting === "target" ? meaningLabel : targetLabel;
    setWrongLanguageNotice(
      `${ui("That's the")} ${ui(typedInstead)} — ${ui("this one wants the")} ${ui(wanted)}.`
    );
  };
  useEffect(() => { setWrongLanguageNotice(null); }, [phase]);

  const checkAnswer = () => {
    if (!input.trim() || checked) return;
    if (!result.ok && answeredOtherSide(input, "target")) { flagWrongLanguage("target"); return; }
    setWrongLanguageNotice(null);
    setChecked(true);
    reactToAnswer(result.ok, !!result.phrasingNote);
    tts(item.de, result.ok ? 0.88 : 0.75, targetLang);
    if (result.ok) {
      setTimeout(advance, 900);
    } else {
      setAttempts(a => a + 1);
    }
  };

  const retry = () => { setInput(""); setChecked(false); };

  // After the English translation: go to the French phase if active, else finish.
  const finishOrFrench = () => { if (hasFr) setPhase("French"); else onNext(); };

  const noteRecallStruggle = () => {
    // Failing a closed-book check on the short route means the run of correct
    // recalls that earned it didn't hold. Put the full route back and start it
    // from the beginning, so the phrase is retaught rather than just retried.
    if (masteredRoute) {
      setRecallFailed(true);
      setPhase("Read");
    }
    if (grade === "struggle") return;
    setGrade("struggle");
    if (item?.id) onGradeItem?.(item.id, "struggle");
  };

  const checkEnAnswer = () => {
    if (!translationAnswer.trim() || enChecked) return;
    if (!enResult.ok && answeredOtherSide(translationAnswer, "meaning")) { flagWrongLanguage("meaning"); return; }
    setWrongLanguageNotice(null);
    setEnChecked(true);
    reactToAnswer(enResult.ok, !!enResult.phrasingNote);
    if (enResult.ok) {
      setTimeout(advanceOrFinish, 900);
    } else {
      setEnAttempts(a => a + 1);
    }
  };

  const retryEn = () => {
    setEnInput("");
    setTranslationPicked([]);
    setEnChecked(false);
    if (translationMode === "type") setTimeout(() => enInputRef.current?.focus(), 50);
  };

  const chooseTranslationMode = (mode: "bank" | "type") => {
    if (mode === translationMode || (enChecked && enResult.ok)) return;
    if (mode === "type") {
      setEnInput(translationPicked.map((token) => token.text).join(" "));
      setTranslationPicked([]);
      setTimeout(() => enInputRef.current?.focus(), 50);
    } else {
      setEnInput("");
      setTranslationPicked([]);
    }
    setEnChecked(false);
    setTranslationMode(mode);
  };

  const pickTranslationToken = (token: OrderToken) => {
    if (enChecked || translationPicked.some((picked) => picked.id === token.id)) return;
    setTranslationPicked((picked) => [...picked, token]);
  };

  const removeTranslationToken = (index: number) => {
    if (enChecked) return;
    setTranslationPicked((picked) => picked.filter((_, pickedIndex) => pickedIndex !== index));
  };

  const selectMeaningAnswer = (choice: string) => {
    if (meaningChecked) return;
    const ok = choiceKey(choice) === choiceKey(item.de);
    setMeaningChoice(choice);
    setMeaningChecked(true);
    reactToAnswer(ok);
    if (ok) {
      tts(item.de, 0.88, targetLang);
      window.setTimeout(advanceOrFinish, 900);
    }
  };

  const retryMeaning = () => {
    setMeaningChoice(null);
    setMeaningChecked(false);
  };

  const chooseMeaningSelectAnswer = (choice: string) => {
    if (meaningSelectChecked) return;
    const ok = choiceKey(choice) === choiceKey(shownEnglish);
    setMeaningSelectChoice(choice);
    setMeaningSelectChecked(true);
    reactToAnswer(ok);
    if (ok) window.setTimeout(advanceOrFinish, 900);
  };

  const retryMeaningSelect = () => {
    setMeaningSelectChoice(null);
    setMeaningSelectChecked(false);
  };

  const chooseListeningAnswer = (choice: string) => {
    if (listeningChecked) return;
    setListeningChoice(choice);
    setListeningChecked(true);
    const ok = choiceKey(choice) === choiceKey(item.de);
    reactToAnswer(ok);
    if (ok) window.setTimeout(advanceOrFinish, 900);
  };

  const retryListening = () => {
    setListeningChoice(null);
    setListeningChecked(false);
    tts(item.de, 0.88, targetLang);
  };

  const selectMissingWord = (choice: string) => {
    if (missingWordChecked) return;
    const ok = choiceKey(choice) === choiceKey(missingWord.answer);
    setMissingWordPreview(null);
    setMissingWordChoice(choice);
    setMissingWordChecked(true);
    reactToAnswer(ok);
    if (ok) {
      tts(item.de, 0.88, targetLang);
      window.setTimeout(advanceOrFinish, 900);
    }
  };

  const previewMissingWord = (choice: string) => {
    setMissingWordPreview(choice);
    tts(choice, 0.78, targetLang);
  };

  const retryMissingWord = () => {
    setMissingWordPreview(null);
    setMissingWordChoice(null);
    setMissingWordChecked(false);
  };

  const checkGap = () => {
    if (!gapInput.trim() || gapChecked) return;
    setGapChecked(true);
    reactToAnswer(gapResult.ok);
    if (gapResult.ok) { tts(item.de, 0.88, targetLang); setTimeout(advanceOrFinish, 900); }
  };
  const retryGap = () => { setGapInput(""); setGapChecked(false); setTimeout(() => gapInputRef.current?.focus(), 50); };

  const reorderToken = (from: number, to: number) => {
    if (from === to || orderLocked) return;
    if (orderAdvanceTimerRef.current !== null) {
      window.clearTimeout(orderAdvanceTimerRef.current);
      orderAdvanceTimerRef.current = null;
    }
    setOrderTokens((tokens) => moveOrderToken(tokens, from, to));
    setOrderChecked(false);
    setOrderTouched(true);
    setOrderSelected(null);
  };

  const reorderTokenById = (fromId: string, toId: string) => {
    if (!fromId || fromId === toId || orderLocked) return;
    if (orderAdvanceTimerRef.current !== null) {
      window.clearTimeout(orderAdvanceTimerRef.current);
      orderAdvanceTimerRef.current = null;
    }
    setOrderTokens((tokens) => {
      const from = tokens.findIndex((token) => token.id === fromId);
      const to = tokens.findIndex((token) => token.id === toId);
      return moveOrderToken(tokens, from, to);
    });
    setOrderChecked(false);
    setOrderTouched(true);
    setOrderSelected(null);
  };

  const selectOrderToken = (index: number) => {
    if (orderSelected === null) {
      setOrderSelected(index);
      return;
    }
    reorderToken(orderSelected, index);
  };

  const checkOrder = () => {
    if (orderChecked || orderDragging !== null || draggedOrderTokenId.current !== null) return;
    setOrderChecked(true);
    // A just-dropped word should stay planted. The green tokens and feedback
    // confirm success without scaling the entire drag surface under the cursor.
    reactToAnswer(orderIsCorrect, false, !orderIsCorrect);
    if (orderIsCorrect) {
      tts(item.de, 0.88, targetLang);
      if (orderAdvanceTimerRef.current !== null) {
        window.clearTimeout(orderAdvanceTimerRef.current);
      }
      orderAdvanceTimerRef.current = window.setTimeout(() => {
        orderAdvanceTimerRef.current = null;
        advanceOrFinish();
      }, 1050);
    }
  };

  const retryOrder = () => {
    if (orderAdvanceTimerRef.current !== null) {
      window.clearTimeout(orderAdvanceTimerRef.current);
      orderAdvanceTimerRef.current = null;
    }
    setOrderTokens(buildOrderTokens(item.de));
    setOrderChecked(false);
    setOrderTouched(false);
    setOrderSelected(null);
    setOrderDragging(null);
    setOrderDropTarget(null);
    draggedOrderTokenId.current = null;
    suppressOrderClickRef.current = false;
  };

  const checkSay = () => {
    if (!sayInput.trim() || sayChecked) return;
    if (!sayResult.ok && answeredOtherSide(sayInput, "target")) { flagWrongLanguage("target"); return; }
    setWrongLanguageNotice(null);
    setSayChecked(true);
    reactToAnswer(sayResult.ok, !!sayResult.phrasingNote);
    if (sayResult.ok) {
      tts(item.de, 0.88, targetLang);
      setTimeout(advanceOrFinish, 900);
    }
  };
  const retrySay = () => { setSayInput(""); setSayChecked(false); setTimeout(() => sayRef.current?.focus(), 50); };

  const checkRecallTarget = () => {
    if (!recallTargetInput.trim() || recallTargetChecked) return;
    if (!recallTargetResult.ok && answeredOtherSide(recallTargetInput, "target")) { flagWrongLanguage("target"); return; }
    setWrongLanguageNotice(null);
    setRecallTargetChecked(true);
    reactToAnswer(recallTargetResult.ok, !!recallTargetResult.phrasingNote);
    if (recallTargetResult.ok) {
      recallTransitionPendingRef.current = true;
      setRecallTransitionPending(true);
      const advanceToken = ++recallAdvanceTokenRef.current;
      void tts(item.de, 0.88, targetLang).finally(() => {
        if (advanceToken === recallAdvanceTokenRef.current) advanceOrFinish();
      });
    } else {
      noteRecallStruggle();
    }
  };
  const retryRecallTarget = () => {
    setRecallTargetInput("");
    setRecallTargetChecked(false);
    setTimeout(() => recallTargetRef.current?.focus(), 50);
  };

  const checkRecallMeaning = () => {
    if (!recallMeaningInput.trim() || recallMeaningChecked) return;
    if (!recallMeaningResult.ok && answeredOtherSide(recallMeaningInput, "meaning")) { flagWrongLanguage("meaning"); return; }
    setWrongLanguageNotice(null);
    setRecallMeaningChecked(true);
    reactToAnswer(recallMeaningResult.ok, !!recallMeaningResult.phrasingNote);
    if (recallMeaningResult.ok) {
      recallTransitionPendingRef.current = true;
      setRecallTransitionPending(true);
      const advanceToken = ++recallAdvanceTokenRef.current;
      void tts(shownEnglish, 0.88, meaningLang).finally(() => {
        if (advanceToken === recallAdvanceTokenRef.current) advanceOrFinish();
      });
    } else {
      noteRecallStruggle();
    }
  };
  const retryRecallMeaning = () => {
    setRecallMeaningInput("");
    setRecallMeaningChecked(false);
    setTimeout(() => recallMeaningRef.current?.focus(), 50);
  };

  const checkRecallBothTarget = () => {
    if (
      !recallBothTargetInput.trim()
      || recallBothTargetReady
      || recallCompletionScheduledRef.current
    ) return;
    if (!recallBothTargetResult.ok && answeredOtherSide(recallBothTargetInput, "target")) {
      flagWrongLanguage("target");
      return;
    }
    setWrongLanguageNotice(null);
    setRecallBothTargetChecked(true);
    if (recallBothTargetResult.ok) {
      if (!(recallBothChecked && recallBothMeaningResult.ok)) {
        window.setTimeout(() => recallBothMeaningRef.current?.focus(), 50);
      }
      return;
    }
    reactToAnswer(false);
    noteRecallStruggle();
  };

  const checkRecallBoth = () => {
    if (
      !recallBothMeaningInput.trim()
      || recallBothChecked
      || recallCompletionScheduledRef.current
    ) return;
    if (
      !recallBothMeaningResult.ok
      && answeredOtherSide(recallBothMeaningInput, "meaning")
    ) { flagWrongLanguage("meaning"); return; }
    setWrongLanguageNotice(null);
    setRecallBothChecked(true);
    if (recallBothMeaningResult.ok) {
      if (!recallBothTargetReady) {
        window.setTimeout(() => recallBothTargetRef.current?.focus(), 50);
      }
      return;
    }
    reactToAnswer(false);
    noteRecallStruggle();
  };
  useEffect(() => {
    if (
      phase !== "RecallBoth"
      || recallCompletionScheduledRef.current
      || !recallBothTargetReady
      || !recallBothChecked
      || !recallBothMeaningResult.ok
    ) return;
    setWrongLanguageNotice(null);
    reactToAnswer(true);
    recallCompletionScheduledRef.current = true;
    recallCompletionTimerRef.current = window.setTimeout(() => {
      recallCompletionTimerRef.current = null;
      if (recallCompletionScheduledRef.current) onNext();
    }, 700);
    // Both sides are checked independently; this effect is their single
    // completion point so no extra "Check both" click can be required.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, recallBothTargetReady, recallBothChecked, recallBothMeaningResult.ok]);
  const retryRecallBoth = () => {
    if (recallCompletionTimerRef.current !== null) {
      window.clearTimeout(recallCompletionTimerRef.current);
      recallCompletionTimerRef.current = null;
    }
    setRecallBothMeaningInput("");
    setRecallBothChecked(false);
    recallCompletionScheduledRef.current = false;
    if (recallBothTargetReady) {
      setTimeout(() => recallBothMeaningRef.current?.focus(), 50);
    } else {
      setRecallBothTargetInput("");
      setRecallBothTargetChecked(false);
      setTimeout(() => recallBothTargetRef.current?.focus(), 50);
    }
  };

  const checkFrAnswer = () => {
    if (!frInput.trim() || frChecked) return;
    setFrChecked(true);
    reactToAnswer(frResult.ok);
    tts(item.fr, frResult.ok ? 0.9 : 0.78, "fr-FR");
    if (frResult.ok) {
      setTimeout(hasFr ? advance : onNext, 900);
    } else {
      setFrAttempts(a => a + 1);
    }
  };

  const retryFr = () => { setFrInput(""); setFrChecked(false); };

  const checkMemory = () => {
    if (!memDeInput.trim() && !memFrInput.trim()) return;
    if (!memDeResult.ok && answeredOtherSide(memDeInput, "target")) { flagWrongLanguage("target"); return; }
    setWrongLanguageNotice(null);
    setMemDeChecked(true);
    setMemFrChecked(true);
    const bothOk = memDeResult.ok && memFrResult.ok;
    reactToAnswer(bothOk);
    if (memDeResult.ok) tts(item.de, 0.88, "de-DE");
    if (bothOk) setTimeout(onNext, 1000);
  };
  const retryMemory = () => {
    setMemDeInput(""); setMemDeChecked(false);
    setMemFrInput(""); setMemFrChecked(false);
    setTimeout(() => memDeRef.current?.focus(), 50);
  };

  const markKnown = () => {
    if (recallTransitionPendingRef.current || recallCompletionScheduledRef.current) return;
    setGrade("know");
    if (item?.id) onGradeItem?.(item.id, "know");
    onNext();
  };
  const markStruggle = () => {
    if (recallTransitionPendingRef.current || recallCompletionScheduledRef.current) return;
    setGrade("struggle");
    if (item?.id) onGradeItem?.(item.id, "struggle");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // The answer box keeps focus permanently now, so Alt combos must work
      // while "typing" — Alt+K/S never inserts a character anyway.
      if (!event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "k") {
        event.preventDefault();
        markKnown();
      }
      if (key === "s") {
        event.preventDefault();
        markStruggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item?.id, onGradeItem]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      {/* Stage route (full-bleed inside the card) */}
      <StageRoute
        current={phase}
        phases={phaseRoute()}
        withFrench={hasFr}
        targetLabel={targetLabel}
        meaningLabel={meaningLabel}
        locked={recallTransitionPending || recallCompletionScheduledRef.current}
        onClickPhase={goToPhase}
      />

      <div className="fs-card-body space-y-4">
        {/* Heading: eyebrow + stage title + Hear it / grade pills */}
        <div className="fs-heading">
          <div>
            <span className="fs-eyebrow"><i /> {ui("Sentence practice")}</span>
            <h1 className="fs-h1">
              {ui(
                phase === "Translate"
                  ? `Write this in ${meaningLabel}`
                  : phase === "Read" && audioMuted
                    ? "Read the sentence"
                    : phaseHeading(phase, hasFr, targetLabel, meaningLabel)
              )}
            </h1>
            <p className="fs-sub">
              {phase === "RecallTarget"
                ? ui("Use the meaning cue to recall the full target sentence.")
                : phase === "RecallMeaning"
                  ? ui("Use the target sentence to recall its full meaning.")
                  : phase === "RecallBoth"
                    ? ui("No answers are shown now. Type both sides from memory.")
                    : hasFr
                      ? ui(audioMuted
                        ? "Read, choose, then type it in German and French."
                        : "Read, listen, choose, then type it in German and French.")
                      : ui(audioMuted
                        ? "Read, choose, type, translate, then recall."
                        : "Read, listen, choose, type, translate, then recall.")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {onReviewLevel ? (
              <ReviewLevelPicker
                disabled={recallTransitionPending || recallCompletionScheduledRef.current}
                knownAriaLabel={ui("Mark known and skip to the next item. Shortcut Alt K")}
                onKnown={markKnown}
                onSelect={onReviewLevel}
                onSnooze={onSnooze}
                showShortcut
              />
            ) : (
              <button
                aria-label={ui("Mark known and skip to the next item. Shortcut Alt K")}
                className="grade-btn grade-btn-known"
                onClick={markKnown}
                disabled={recallTransitionPending || recallCompletionScheduledRef.current}
                type="button"
              >
                {ui("Know it")}
                <kbd className="grade-kbd">Alt K</kbd>
              </button>
            )}
            <button
              aria-label={ui("Mark this item as a struggle. Shortcut Alt S")}
              className="grade-btn grade-btn-struggle"
              onClick={markStruggle}
              disabled={recallTransitionPending || recallCompletionScheduledRef.current}
              type="button"
            >
              {ui("Struggle")}
              <kbd className="grade-kbd">Alt S</kbd>
            </button>
            {phase !== "MeaningPick"
              && phase !== "ListenPick"
              && phase !== "MissingWord"
              && phase !== "RecallTarget"
              && phase !== "RecallBoth"
              && (
              <HearItButton lang={targetLang} speaking={ttsOn} onPlay={() => tts(item.de, 0.82, targetLang)} />
            )}
          </div>
        </div>

        {/* Directly under the buttons that cause it. As a bar at the foot of
            the page it was so far from Struggle or Set level that pressing
            one looked as though nothing had happened. */}
      {/* Folding the note into the verdict card left it homeless whenever
          there was no verdict: snoozing or setting a level BEFORE answering
          suppressed the floating toast and had nowhere of its own to go, so
          Undo simply was not on screen. It gets its own card in that case. */}
      {!verdictShowing && (
        <div className="fs-standalone-note">
          <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
        </div>
      )}

        {/* Register (du/Sie) + usage context — the German lives in item.en when learning English */}
        {phase !== "MeaningPick" && phase !== "MeaningSelect" && phase !== "ListenPick" && phase !== "MissingWord" && !isClosedBookPhase(phase) && (
          <UsageChips
            de={learnEn ? item.en : item.de}
            use={item.use ? formatEnglishText(item.use, englishVariant) : item.use}
            lookup={item.lookup}
            tierNote={item.tierNote ? formatEnglishText(item.tierNote, englishVariant) : item.tierNote}
            short={learnEn ? undefined : item.short}
            shortLabel={learnEn ? undefined : item.shortLabel}
            long={learnEn || phase === "Read" ? undefined : item.long}
            hideUse={phase === "Translate" || phase === "TranslateAgain"}
          />
        )}

        {/* When you'd actually say it. The usage chip explains the LANGUAGE;
            this explains the MOMENT — without it, a phrase like "Wie fällt das
            aus?" leaves you knowing the grammar and still not knowing when to
            open your mouth. Hidden during Translate for the same reason the
            usage note is: it can give the answer away. */}
        {item.when && phase !== "MeaningPick" && phase !== "MeaningSelect" && phase !== "ListenPick" && phase !== "MissingWord" && phase !== "Translate" && phase !== "TranslateAgain" && !isClosedBookPhase(phase) && (
          <div className="fs-when">
            <span className="fs-when-label">{ui("When you'd say it")}</span>
            <p>{uiOr(item.when, "Typischer Gesprächskontext")}</p>
          </div>
        )}

        {/* How it actually sounds. Germans swallow far more than the spelling
            admits — gehen is "gehn", nichts is "nix", kannst du is "kannste" —
            so a learner who reads the line as written is understood but marked
            instantly as foreign. Keep this guidance on first exposure; hiding
            it during recall avoids handing over the spelling. */}
        {item.say && phase === "Read" && (
          <div className="fs-say">
            <span className="fs-when-label">{ui("How it's really said")}</span>
            <p>{uiOr(item.say, "Achte auf eine natürliche Aussprache.")}</p>
          </div>
        )}

        {/* We teach the form people say; this is the fuller one they'll meet in
            print. Shown on Read only — during Type it would be a second answer
            on screen, and it counts as correct anyway (see matchEither). */}
        {item.long && phase === "Read" && (
          <div className="fs-say">
            <span className="fs-when-label">{ui("Written in full")}</span>
            <p>{item.long}</p>
          </div>
        )}

        {phase === "MeaningPick" ? null : phase === "MeaningSelect" ? (
          <div className="fs-board fs-meaning-select-board">
            <div className="fs-board-top">
              <span>{ui(targetLabel)}</span>
              <small>{ui("Select its meaning below")}</small>
            </div>
            <div className="fs-line">
              <TappableSentence text={item.de} lang={targetLang} meaningText={item.en} />
            </div>
          </div>
        ) : phase === "ListenPick" ? (
          <button
            type="button"
            className={cn("fs-listening-prompt", ttsOn && "is-speaking")}
            onClick={() => tts(item.de, 0.82, targetLang)}
            aria-label={ui("Replay the phrase")}
          >
            <span className="fs-listening-disc"><Volume2 className="h-7 w-7" /></span>
            <span className="fs-listening-copy">
              <strong>{ui("Listen carefully")}</strong>
              <small>{ui("Tap to hear the phrase again")}</small>
            </span>
            <TtsWaveform active={ttsOn} bars={7} className="fs-listening-wave" />
          </button>
        ) : phase === "MissingWord" ? (
          <>
            <div className="fs-board">
              <div className="fs-board-top">
                <span>{ui(targetLabel)}</span>
                <small>{ui("Choose the sound that completes the sentence")}</small>
              </div>
              <div className="fs-line">
                {missingWordChecked && missingWordCorrect
                  ? <TappableSentence text={item.de} lang={targetLang} meaningText={item.en} />
                  : missingWord.display}
              </div>
            </div>
            <div className="fs-trow">
              <span className="fs-chip">{learnEn ? "DE" : "EN"}</span>
              <p>{shownEnglish}</p>
            </div>
          </>
        ) : phase === "RecallTarget" ? (
          <div className="fs-board fs-recall-board">
            <div className="fs-board-top">
              <span>{ui(meaningLabel)}</span>
              <small>{ui("Meaning cue — recall the hidden sentence")}</small>
            </div>
            <div className="fs-line">{shownEnglish}</div>
          </div>
        ) : phase === "RecallMeaning" ? (
          <div className="fs-board fs-recall-board">
            <div className="fs-board-top">
              <span>{ui(targetLabel)}</span>
              <small>{ui("Sentence cue — recall the hidden meaning")}</small>
            </div>
            <div className="fs-line">
              <TappableSentence text={item.de} lang={targetLang} meaningText={item.en} />
            </div>
          </div>
        ) : phase === "RecallBoth" ? (
          <div className="fs-closed-recall-cue">
            <span><EyeOff aria-hidden="true" className="h-4 w-4" /> {ui("Closed-book recall")}</span>
            <strong>{ui("Recall what you just practised in both languages.")}</strong>
            <small>{ui("Neither answer is shown unless you choose Hint or Show answer.")}</small>
          </div>
        ) : phase === "Order" ? (
          <div className="fs-reorder-prompt">
            <span>{ui(meaningLabel)}</span>
            <p>{shownEnglish}</p>
            <small>{ui(`Arrange the ${targetLabel} words below.`)}</small>
          </div>
        ) : hasFr ? (
          phase === "Memory" ? (
            /* ── Memory phase: only English shown, recall both languages ── */
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 px-5 py-4 text-center">
              <p className="mb-1 text-[11px] font-black uppercase tracking-wide text-zinc-400">{ui("Meaning")}</p>
              <p className="text-2xl font-black text-zinc-950">{shownEnglish}</p>
            </div>
          ) : (
            /* ── Bilingual: German + French shown together, English as meaning ── */
            <div className="space-y-3">
              <LangBlock
                label="German"
                text={item.de}
                active={phase === "Type"}
                onHear={() => tts(item.de, 0.85, "de-DE")}
              />
              <LangBlock
                label="French"
                text={item.fr}
                active={phase === "French"}
                onHear={() => tts(item.fr, 0.85, "fr-FR")}
              />
              <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-500">
                Meaning: <span className="text-zinc-700">{shownEnglish}</span>
              </div>
            </div>
          )
        ) : (
          /* ── German only: prototype sentence board with tappable words ── */
          <>
            <div className="fs-board">
              <div className="fs-board-top">
                <span>{ui(targetLabel)}</span>
                <small>{ui("Tap a word to hear it")}</small>
              </div>
              <div className={cn(
                "fs-line transition-all duration-300",
                phase === "WriteFromMemory" && sayChecked && sayResult.ok ? "is-good" : "",
                phase === "WriteFromMemory" && sayChecked && !sayResult.ok ? "is-bad" : ""
              )}>
                {/* Retrieval stages hide the answer, then reveal it after a correct response. */}
                {phase === "Gap" && !(gapChecked && gapResult.ok) ? gap.display
                  : phase === "WriteFromMemory" && !sayChecked ? "• • •"
                  : <TappableSentence text={item.de} lang={targetLang} meaningText={item.en} />}
              </div>
            </div>
            <AnimatePresence>
              {phase !== "Read" && phase !== "Translate" && phase !== "TranslateAgain" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="fs-trow">
                  <span className="fs-chip">{learnEn ? "DE" : "EN"}</span>
                  <p>{shownEnglish}</p>
                </motion.div>
              )}
              {(phase === "Translate" || phase === "TranslateAgain") && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="fs-trow">
                  <span className="fs-chip">{learnEn ? "DE" : "EN"}</span>
                  <p className="text-sm">
                    {uiIsGerman() ? `Was bedeutet das auf ${ui(meaningLabel)}?` : `What does this mean in ${meaningLabel}?`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Aimed at the wrong box. Nothing has been graded, so this is a
            signpost rather than a verdict — no shake, no "Not quite". */}
        <AnimatePresence>
          {wrongLanguageNotice && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-800"
              role="status"
            >
              <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">{wrongLanguageNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>


      {/* Phase-specific controls */}
      <AnimatePresence mode="wait">

        {/* READ phase */}
        {phase === "Read" && (
          <motion.div key="read" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {audioMuted
                ? ui(hasFr
                  ? "Read the German and French sentences, then continue."
                  : "Read the sentence, then continue.")
                : hasFr
                  ? ui("Read and listen to the German and French.")
                  : ui("Read and listen — it plays automatically.")}
            </p>
            {/* One Hear-it only — the purple listen button in the heading replays. */}
            <Button onClick={advance}
              className="continue-glow h-14 w-full rounded-2xl lesson-cta text-sm font-black">
              {ui("Continue")} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* PICK THE MEANING phase */}
        {phase === "MeaningPick" && (
          <motion.div
            key="meaning-pick"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="fs-dashboard-choice-layout">
              <div className="fs-meaning-prompt">
                <span className="fs-meaning-new">{ui(meaningLabel)}</span>
                <MessageSquareQuote className="fs-meaning-prompt-icon" aria-hidden="true" />
                <p>{shownEnglish}</p>
                <small>{ui("Everyday conversation")}</small>
              </div>
              <div className="fs-meaning-choices" role="radiogroup" aria-label={ui("Meaning choices")}>
                {meaningChoices.map((choice, choiceIndex) => {
                  const isSelected = meaningChoice === choice;
                  const isAnswer = choiceKey(choice) === choiceKey(item.de);
                  return (
                    <button
                      key={`${choice}-${choiceIndex}`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={meaningChecked}
                      onClick={() => selectMeaningAnswer(choice)}
                      className={cn(
                        "fs-meaning-choice",
                        isSelected && "is-selected",
                        meaningChecked && isAnswer && "is-correct",
                        meaningChecked && isSelected && !isAnswer && "is-wrong"
                      )}
                    >
                      <span className="fs-meaning-choice-top">
                        <span>{ui(targetLabel)}</span>
                        <kbd>{choiceIndex + 1}</kbd>
                      </span>
                      <strong>{choice}</strong>
                      <span className="fs-meaning-choice-state" aria-hidden="true">
                        {meaningChecked && isAnswer
                          ? <CheckCircle2 className="h-5 w-5" />
                          : meaningChecked && isSelected
                            ? <X className="h-5 w-5" />
                            : <ChevronRight className="h-5 w-5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {meaningChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("fs-result", meaningCorrect ? "is-good" : "is-bad")}
                >
                  <strong>{ui(meaningCorrect ? "Exactly right!" : "Not quite")}</strong>
                  <span>
                    {meaningCorrect
                      ? ui("This is the natural everyday choice.")
                      : <>{ui("Answer:")} <strong>{item.de}</strong></>}
                  </span>
                                  <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
                </motion.div>
              )}
            </AnimatePresence>

            {meaningChecked && meaningCorrect ? null : meaningChecked ? (
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={retryMeaning}
                  variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {ui("Try again")}
                </Button>
                <Button
                  type="button"
                  onClick={advance}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black"
                >
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <div className="fs-meaning-actions fs-meaning-actions-centered">
                <button type="button" onClick={advance} className="fs-meaning-skip app-skip-button">
                  {ui("Skip")}
                </button>
              </div>
            )}
            <div className="fs-hint">
              <kbd>1-3</kbd> {ui("Choose an answer.")}
            </div>
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">
              {ui("← Back")}
            </button>
          </motion.div>
        )}

        {/* SELECT THE CORRECT MEANING phase */}
        {phase === "MeaningSelect" && (
          <motion.div
            key="meaning-select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui("Choose the correct meaning.")}
            </p>
            <div className="fs-meaning-select-list" role="radiogroup" aria-label={ui("Meaning choices")}>
              {meaningSelectChoices.map((choice, choiceIndex) => {
                const isSelected = meaningSelectChoice === choice;
                const isAnswer = choiceKey(choice) === choiceKey(shownEnglish);
                return (
                  <button
                    key={`${choice}-${choiceIndex}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={meaningSelectChecked}
                    onClick={() => chooseMeaningSelectAnswer(choice)}
                    className={cn(
                      "fs-meaning-select-choice",
                      isSelected && "is-selected",
                      meaningSelectChecked && isAnswer && "is-correct",
                      meaningSelectChecked && isSelected && !isAnswer && "is-wrong"
                    )}
                  >
                    <kbd>{choiceIndex + 1}</kbd>
                    <strong>{choice}</strong>
                    <span className="fs-meaning-select-state" aria-hidden="true">
                      {meaningSelectChecked && isAnswer
                        ? <CheckCircle2 className="h-5 w-5" />
                        : meaningSelectChecked && isSelected
                          ? <X className="h-5 w-5" />
                          : <span />}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {meaningSelectChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("fs-result fs-meaning-select-result", meaningSelectCorrect ? "is-good" : "is-bad")}
                  aria-live="polite"
                >
                  <strong>{ui(meaningSelectCorrect ? "Excellent!" : "Not quite")}</strong>
                  <span>
                    {meaningSelectCorrect
                      ? ui("You selected the correct meaning.")
                      : <>{ui("Answer:")} <strong>{shownEnglish}</strong></>}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {meaningSelectChecked && meaningSelectCorrect ? null : meaningSelectChecked ? (
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={retryMeaningSelect}
                  variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {ui("Try again")}
                </Button>
                <Button
                  type="button"
                  onClick={advance}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black"
                >
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <div className="fs-meaning-actions fs-meaning-actions-centered">
                <button type="button" onClick={advance} className="fs-meaning-skip app-skip-button">
                  {ui("Skip")}
                </button>
              </div>
            )}
            <div className="fs-hint">
              <kbd>1-3</kbd> {ui("Choose an answer.")}
            </div>
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">
              {ui("← Back")}
            </button>
          </motion.div>
        )}

        {/* LISTEN & PICK phase */}
        {phase === "ListenPick" && (
          <motion.div
            key="listen-pick"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui(`Choose the ${targetLabel} phrase you heard.`)}
            </p>
            <div className="fs-listening-choices" role="group" aria-label={ui("Listening choices")}>
              {listeningChoices.map((choice, choiceIndex) => {
                const isSelected = listeningChoice === choice;
                const isAnswer = choiceKey(choice) === choiceKey(item.de);
                return (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={listeningChecked}
                    onClick={() => chooseListeningAnswer(choice)}
                    className={cn(
                      "fs-listening-choice",
                      listeningChecked && isAnswer && "is-correct",
                      listeningChecked && isSelected && !isAnswer && "is-wrong"
                    )}
                  >
                    <span>{choiceIndex + 1}</span>
                    <strong>{choice}</strong>
                    {listeningChecked && isAnswer && <CheckCircle2 className="h-5 w-5" />}
                    {listeningChecked && isSelected && !isAnswer && <X className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {listeningChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("fs-result", listeningCorrect ? "is-good" : "is-bad")}
                >
                  <strong>{ui(listeningCorrect ? "That's it!" : "Not quite")}</strong>
                  <span>
                    {listeningCorrect
                      ? ui("You matched the spoken phrase.")
                      : <>{ui("Answer:")} <strong>{item.de}</strong></>}
                  </span>
                                  <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
                </motion.div>
              )}
            </AnimatePresence>

            {!listeningCorrect && listeningChecked && (
              <>
                <Button
                  type="button"
                  onClick={retryListening}
                  className="h-12 w-full rounded-2xl bg-zinc-100 font-black text-zinc-700 hover:bg-zinc-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {ui("Hear it and try again")}
                </Button>
                <div className="fs-hint">
                  <kbd>{ui("Space")}</kbd> <kbd>R</kbd> <kbd>→</kbd> {ui("Try again")}
                </div>
              </>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">
              {ui("← Back")}
            </button>
          </motion.div>
        )}

        {/* LISTEN FOR THE MISSING WORD phase */}
        {phase === "MissingWord" && (
          <motion.div
            key="missing-word"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="fs-missing-phase"
          >
            <p className="fs-missing-instruction">
              {ui("Listen to each option and choose the word that completes the sentence.")}
            </p>
            <div className="fs-missing-audio-list" role="group" aria-label={ui("Missing-word audio choices")}>
              {missingWordChoices.map((choice, choiceIndex) => {
                const isSelected = missingWordChoice === choice;
                const isAnswer = choiceKey(choice) === choiceKey(missingWord.answer);
                return (
                  <div
                    key={`${choice}-${choiceIndex}`}
                    className={cn(
                      "fs-missing-audio-option",
                      isSelected && "is-selected",
                      ttsOn && missingWordPreview === choice && "is-speaking",
                      missingWordChecked && isAnswer && "is-correct",
                      missingWordChecked && isSelected && !isAnswer && "is-wrong"
                    )}
                  >
                    <span className="fs-missing-option-number">{choiceIndex + 1}</span>
                    <button
                      aria-label={`${ui("Play option")} ${choiceIndex + 1}`}
                      className="fs-missing-play"
                      onClick={() => previewMissingWord(choice)}
                      type="button"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                    <TtsWaveform
                      active={ttsOn && missingWordPreview === choice}
                      bars={9}
                      className="fs-missing-wave"
                    />
                    <button
                      aria-label={`${ui("Choose answer")} ${choiceIndex + 1}`}
                      aria-pressed={isSelected}
                      className="fs-missing-choose"
                      disabled={missingWordChecked}
                      onClick={() => selectMissingWord(choice)}
                      type="button"
                    >
                      {missingWordChecked && isAnswer
                        ? <CheckCircle2 className="h-5 w-5" />
                        : missingWordChecked && isSelected
                          ? <X className="h-5 w-5" />
                          : ui("Choose")}
                    </button>
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {missingWordChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("fs-missing-result fs-result", missingWordCorrect ? "is-good" : "is-bad")}
                  aria-live="polite"
                  role="status"
                >
                  <strong>{ui(missingWordCorrect ? "That's it!" : "Not quite")}</strong>
                  <span>
                    {missingWordCorrect
                      ? ui("You found the missing word.")
                      : <>{ui("The missing word is")} <strong>{missingWord.answer}</strong>.</>}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {!missingWordCorrect && missingWordChecked && (
              <>
                <Button
                  type="button"
                  onClick={retryMissingWord}
                  className="h-12 w-full rounded-2xl bg-zinc-100 font-black text-zinc-700 hover:bg-zinc-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {ui("Listen and try again")}
                </Button>
                <div className="fs-hint">
                  <kbd>{ui("Space")}</kbd> <kbd>R</kbd> <kbd>→</kbd> {ui("Try again")}
                </div>
              </>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">
              {ui("← Back")}
            </button>
          </motion.div>
        )}

        {/* WRITE IT: read the meaning, then type the whole target sentence from memory. */}
        {phase === "WriteFromMemory" && (
          <motion.div key="write-from-memory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {`Type the whole ${targetLabel} sentence — from the ${meaningLabel} above.`}
            </p>
            <motion.div animate={shakeControls}>
              <div className={cn("fs-panel",
                sayChecked && sayResult.ok && "is-good",
                sayChecked && !sayResult.ok && (sayResult.phrasingNote ? "is-coach" : "is-bad"))}>
                <div className="fs-prompt">
                  <PromptLanguageBadge label={targetLabel} />
                  <strong>{ui(`Type in ${targetLabel}`)}</strong>
                </div>
                <Input ref={sayRef}
                  className="fs-input"
                  placeholder={`Type the ${targetLabel} sentence...`}
                  autoFocus
                  spellCheck={false}
                  value={sayInput}
                  onChange={(e) => { setSayInput(e.target.value); if (sayChecked) setSayChecked(false); }}
                  onKeyDown={(e) => e.key === "Enter" && (sayChecked && sayResult.ok ? advanceOrFinish() : checkSay())}
                  disabled={sayChecked && sayResult.ok}
                />
                <button type="button" className="fs-check" onClick={sayChecked && sayResult.ok ? advanceOrFinish : checkSay}>
                  <span className="fs-check-label">{sayChecked && sayResult.ok ? ui("Next") : ui("Check")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            {!learnEn && <div className="fs-charsrow"><CharBar onInsert={(c) => insertAt(sayRef.current, c, setSayInput)} /></div>}
            {!(sayChecked && sayResult.ok) && (
              <RecallHelp key={`${item.id}-write-${phase}`} answer={item.de} />
            )}

            <AnimatePresence>
              {sayChecked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-4 text-center text-sm font-semibold",
                    sayResult.ok ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700" :
                    sayResult.phrasingNote ? "border-amber-500/25 bg-amber-500/10 text-amber-700" : "border-rose-500/20 bg-rose-500/10 text-rose-700")}>
                  {sayResult.ok
                    ? <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> {sayResult.spellingNote ? "Close — mind the spelling" : "Perfect!"}</span>
                    : sayResult.phrasingNote
                    ? <span className="space-y-1 block">
                        <span className="block">{ui("People would understand you — but that's the literal translation.")}</span>
                        <span className="block text-xs text-zinc-500">{ui("The natural way is:")} <span className="text-zinc-950">{item.de}</span></span>
                      </span>
                    : <>{ui("Not quite — the answer is")} <span className="text-zinc-950">{item.de}</span></>}
                </motion.div>
              )}
            </AnimatePresence>

            {sayChecked && !sayResult.ok ? (
              <div className="flex gap-3">
                <Button onClick={retrySay} variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
                </Button>
                <Button onClick={advanceOrFinish}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black">
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* CLOSED-BOOK 1: retrieve the target sentence from its meaning. */}
        {phase === "RecallTarget" && (
          <motion.div key="recall-target" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui(`Type the ${targetLabel} sentence from memory. The answer stays hidden unless you ask for help.`)}
            </p>
            <motion.div animate={shakeControls}>
              <div className={cn(
                "fs-panel",
                recallTargetChecked && recallTargetResult.ok && "is-good",
                recallTargetChecked && !recallTargetResult.ok && "is-bad"
              )}>
                <div className="fs-prompt">
                  <PromptLanguageBadge label={targetLabel} />
                  <strong>{ui(`Type in ${targetLabel}`)}</strong>
                </div>
                <Input
                  ref={recallTargetRef}
                  className="fs-input"
                  aria-label={ui(`Recall the ${targetLabel} sentence`)}
                  placeholder={ui(`Type the ${targetLabel} sentence...`)}
                  autoFocus
                  spellCheck={false}
                  value={recallTargetInput}
                  onChange={(event) => {
                    setRecallTargetInput(event.target.value);
                    if (recallTargetChecked) setRecallTargetChecked(false);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && checkRecallTarget()}
                  disabled={recallTargetChecked && recallTargetResult.ok}
                />
                <button
                  type="button"
                  className="fs-check"
                  onClick={checkRecallTarget}
                  disabled={recallTargetChecked && recallTargetResult.ok}
                >
                  <span className="fs-check-label">{ui(recallTargetChecked && recallTargetResult.ok ? "Next" : "Check")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            {!learnEn && <div className="fs-charsrow"><CharBar onInsert={(character) => insertAt(recallTargetRef.current, character, setRecallTargetInput)} /></div>}
            {!(recallTargetChecked && recallTargetResult.ok) && (
              <RecallHelp
                key={`${item.id}-recall-target`}
                answer={item.de}
                label={targetLabel}
                onHelp={noteRecallStruggle}
              />
            )}
            {recallTargetChecked && (
              <div className={cn("fs-result", recallTargetResult.ok ? "is-good" : "is-bad")} role="status">
                <strong>{ui(recallTargetResult.ok ? "Recalled correctly" : "Not quite")}</strong>
                <span>{ui(recallTargetResult.ok ? "The next recall round is ready." : "Try again or use Hint. The answer will stay hidden until you ask for it.")}</span>
                              <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
              </div>
            )}
            {recallTargetChecked && !recallTargetResult.ok ? (
              <Button onClick={retryRecallTarget} variant="outline"
                className="h-12 w-full rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
              </Button>
            ) : (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* CLOSED-BOOK 2: retrieve the meaning from the target sentence. */}
        {phase === "RecallMeaning" && (
          <motion.div key="recall-meaning" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui(`Type the ${meaningLabel} meaning from memory. The answer stays hidden unless you ask for help.`)}
            </p>
            <motion.div animate={shakeControls}>
              <div className={cn(
                "fs-panel",
                recallMeaningChecked && recallMeaningResult.ok && "is-good",
                recallMeaningChecked && !recallMeaningResult.ok && "is-bad"
              )}>
                <div className="fs-prompt">
                  <PromptLanguageBadge label={meaningLabel} />
                  <strong>{ui(`Type in ${meaningLabel}`)}</strong>
                </div>
                <Input
                  ref={recallMeaningRef}
                  className="fs-input"
                  aria-label={ui(`Recall the ${meaningLabel} meaning`)}
                  placeholder={ui(`Type the ${meaningLabel} meaning...`)}
                  autoFocus
                  spellCheck={false}
                  value={recallMeaningInput}
                  onChange={(event) => {
                    setRecallMeaningInput(event.target.value);
                    if (recallMeaningChecked) setRecallMeaningChecked(false);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && checkRecallMeaning()}
                  disabled={recallMeaningChecked && recallMeaningResult.ok}
                />
                <button
                  type="button"
                  className="fs-check"
                  onClick={checkRecallMeaning}
                  disabled={recallMeaningChecked && recallMeaningResult.ok}
                >
                  <span className="fs-check-label">{ui(recallMeaningChecked && recallMeaningResult.ok ? "Next" : "Check")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            {learnEn && <div className="fs-charsrow"><CharBar onInsert={(character) => insertAt(recallMeaningRef.current, character, setRecallMeaningInput)} /></div>}
            {!(recallMeaningChecked && recallMeaningResult.ok) && (
              <RecallHelp
                key={`${item.id}-recall-meaning`}
                answer={displayEnglish}
                label={meaningLabel}
                onHelp={noteRecallStruggle}
              />
            )}
            {recallMeaningChecked && (
              <div className={cn("fs-result", recallMeaningResult.ok ? "is-good" : "is-bad")} role="status">
                <strong>{ui(recallMeaningResult.ok ? "Recalled correctly" : "Not quite")}</strong>
                <span>{ui(recallMeaningResult.ok ? "One final recall round remains." : "Try again or use Hint. The answer will stay hidden until you ask for it.")}</span>
                              <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
              </div>
            )}
            {recallMeaningChecked && !recallMeaningResult.ok ? (
              <Button onClick={retryRecallMeaning} variant="outline"
                className="h-12 w-full rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
              </Button>
            ) : (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* CLOSED-BOOK 3: retrieve both sides without either sentence shown. */}
        {phase === "RecallBoth" && (
          <motion.div key="recall-both" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui(
                learnEn
                  ? "English is ready to type. You can answer either box first; a correct English answer moves focus to German."
                  : "German is ready to type. You can answer either box first; a correct German answer moves focus to English."
              )}
            </p>
            <div className="fs-recall-pair">
              <div className="fs-recall-pair-column">
                <span className="fs-recall-language">{ui(targetLabel)}</span>
                <div className={cn(
                  "fs-panel",
                  recallBothTargetChecked && recallBothTargetResult.ok && "is-good",
                  recallBothTargetChecked && !recallBothTargetResult.ok && "is-bad"
                )}>
                  <div className="fs-prompt"><PromptLanguageBadge label={targetLabel} /><strong>{ui(`Type in ${targetLabel}`)}</strong></div>
                  <Input
                    ref={recallBothTargetRef}
                    autoFocus
                    className="fs-input"
                    aria-label={ui(`Recall the ${targetLabel}`)}
                    placeholder={ui(`Type in ${targetLabel}`)}
                    spellCheck={false}
                    value={recallBothTargetInput}
                    onChange={(event) => {
                      setRecallBothTargetInput(event.target.value);
                      if (recallBothTargetChecked) setRecallBothTargetChecked(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        checkRecallBothTarget();
                      }
                    }}
                    disabled={recallCompletionScheduledRef.current}
                  />
                </div>
                <div className="fs-recall-char-slot">
                  {!learnEn && <div className="fs-charsrow"><CharBar onInsert={(character) => insertAt(recallBothTargetRef.current, character, setRecallBothTargetInput)} /></div>}
                </div>
                {!recallBothTargetReady && (
                  <RecallHelp
                    key={`${item.id}-recall-both-target`}
                    answer={item.de}
                    label={targetLabel}
                    onHelp={noteRecallStruggle}
                  />
                )}
              </div>

              <div className="fs-recall-pair-column">
                <span className="fs-recall-language">{ui(meaningLabel)}</span>
                <div className={cn(
                  "fs-panel",
                  recallBothChecked && recallBothMeaningResult.ok && "is-good",
                  recallBothChecked && !recallBothMeaningResult.ok && "is-bad"
                )}>
                  <div className="fs-prompt"><PromptLanguageBadge label={meaningLabel} /><strong>{ui(`Type in ${meaningLabel}`)}</strong></div>
                  <Input
                    ref={recallBothMeaningRef}
                    className="fs-input"
                    aria-label={ui(`Recall the ${meaningLabel} meaning`)}
                    placeholder={ui(`Type the ${meaningLabel} meaning...`)}
                    spellCheck={false}
                    value={recallBothMeaningInput}
                    onChange={(event) => {
                      setRecallBothMeaningInput(event.target.value);
                      if (recallBothChecked) setRecallBothChecked(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        checkRecallBoth();
                      }
                    }}
                    disabled={recallCompletionScheduledRef.current}
                  />
                </div>
                <div className="fs-recall-char-slot">
                  {learnEn && <div className="fs-charsrow"><CharBar onInsert={(character) => insertAt(recallBothMeaningRef.current, character, setRecallBothMeaningInput)} /></div>}
                </div>
                {!(recallBothChecked && recallBothMeaningResult.ok) && (
                  <RecallHelp
                    key={`${item.id}-recall-both-meaning`}
                    answer={displayEnglish}
                    label={meaningLabel}
                    onHelp={noteRecallStruggle}
                  />
                )}
              </div>
            </div>

            {recallBothTargetChecked && recallBothChecked && (
              <div className={cn(
                "fs-result",
                recallBothTargetResult.ok && recallBothMeaningResult.ok ? "is-good" : "is-bad"
              )} role="status">
                <strong>{ui(recallBothTargetResult.ok && recallBothMeaningResult.ok ? "Both answers are correct." : "Not quite")}</strong>
                <span>
                  {ui(targetLabel)}: {ui(recallBothTargetResult.ok ? "Correct" : "Try again")}
                  <span aria-hidden="true"> · </span>
                  {ui(meaningLabel)}: {ui(recallBothMeaningResult.ok ? "Correct" : "Try again")}
                </span>
                <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
              </div>
            )}

            {recallBothTargetChecked && recallBothChecked && !(recallBothTargetResult.ok && recallBothMeaningResult.ok) ? (
              <Button onClick={retryRecallBoth} variant="outline"
                className="h-12 w-full rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
              </Button>
            ) : (
              <Button
                onClick={recallBothTargetReady ? checkRecallBoth : checkRecallBothTarget}
                disabled={
                  recallCompletionScheduledRef.current
                  || (recallBothTargetReady
                    ? !recallBothMeaningInput.trim()
                    : !recallBothTargetInput.trim())
                }
                className="continue-glow h-14 w-full rounded-2xl lesson-cta text-sm font-black"
              >
                {ui(
                  recallCompletionScheduledRef.current
                    ? "Done"
                    : recallBothTargetReady
                      ? `Check ${meaningLabel}`
                      : `Check ${targetLabel}`
                )} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <button
              type="button"
              onClick={goBack}
              disabled={recallCompletionScheduledRef.current}
              className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-50"
            >
              {ui("← Back")}
            </button>
          </motion.div>
        )}

        {/* TYPE phase */}
        {(phase === "Type" || phase === "TypeAgain") && (
          <motion.div key="type" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {phase === "TypeAgain" ? `Type the ${targetLabel} once more — build the memory.`
                : hasFr ? "Now type the German sentence." : "Now type the sentence exactly."}
            </p>

            <motion.div animate={shakeControls}>
              <div className={cn("fs-panel",
                checked && result.ok && "is-good",
                checked && !result.ok && (result.phrasingNote ? "is-coach" : "is-bad"))}>
                <div className="fs-prompt">
                  <PromptLanguageBadge label={targetLabel} />
                  <strong>{ui(`Type in ${targetLabel}`)}</strong>
                </div>
                <Input ref={inputRef}
                  className="fs-input"
                  placeholder="Type the sentence..."
                  autoFocus
                  spellCheck={false}
                  value={input}
                  onChange={e => { setInput(e.target.value); if (checked) setChecked(false); }}
                  onKeyDown={e => e.key === "Enter" && (checked && result.ok ? advance() : checkAnswer())}
                  disabled={checked && result.ok}
                />
                <button type="button" className="fs-check" onClick={checked && result.ok ? advance : checkAnswer}>
                  <span className="fs-check-label">{checked && result.ok ? ui("Next") : ui("Check")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            {!learnEn && <div className="fs-charsrow"><CharBar onInsert={c => insertAt(inputRef.current, c, setInput)} /></div>}

            {/* Feedback */}
            <AnimatePresence>
              {checked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-5 text-center space-y-2",
                    result.ok ? "border-emerald-500/20 bg-emerald-500/10" :
                    result.phrasingNote ? "border-amber-500/25 bg-amber-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                  {result.ok ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                      <CheckCircle2 className="h-5 w-5" />
                      {result.spellingNote ? "Close enough - watch the spelling next time" : "Perfect!"}
                    </div>
                  ) : result.phrasingNote ? (
                    <div className="space-y-1.5">
                      <div className="text-amber-700 font-semibold text-lg">
                        {ui("People would understand you — but that's the literal translation.")}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {ui("The natural way is:")} <span className="text-zinc-950 font-semibold">{item.de}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-rose-700 font-semibold">
                        {result.capitalizationError
                          ? "Capitalization error! In German, nouns and formal 'Sie/Ihnen/Ihr' must be capitalized."
                          : "Not quite - try again"}
                      </div>
                      <div className="text-xs text-zinc-500">{ui("Target:")} <span className="text-zinc-950 font-semibold">{item.de}</span></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wrong answer: retry / skip. Otherwise the panel's Check handles it. */}
            {checked && !result.ok ? (
              <div className="flex gap-3">
                <Button onClick={retry} variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
                </Button>
                <Button onClick={onSkip ?? onNext}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black">
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* TRANSLATE phase */}
        {(phase === "Translate" || phase === "TranslateAgain") && (
          <motion.div key="translate" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui(phase === "TranslateAgain"
                ? "Recall the translation. Use the word bank if you need support."
                : "Type the translation. Use the word bank if you need support.")}
            </p>

            <div className="fs-translation-toolbar">
              <div className="fs-translation-modes" role="group" aria-label={ui("Answer mode")}>
                <button
                  type="button"
                  className={cn(translationMode === "type" && "is-active")}
                  aria-pressed={translationMode === "type"}
                  onClick={() => chooseTranslationMode("type")}
                  disabled={enChecked && enResult.ok}
                >
                  <Keyboard aria-hidden="true" className="h-4 w-4" />
                  {ui("Type")}
                </button>
                <button
                  type="button"
                  className={cn(translationMode === "bank" && "is-active")}
                  aria-pressed={translationMode === "bank"}
                  onClick={() => chooseTranslationMode("bank")}
                  disabled={enChecked && enResult.ok}
                >
                  <MousePointerClick aria-hidden="true" className="h-4 w-4" />
                  {ui("Word bank")}
                </button>
              </div>
              {translationMode === "bank" && translationPicked.length > 0 && !enChecked && (
                <button
                  type="button"
                  className="fs-translation-clear"
                  onClick={() => setTranslationPicked([])}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  {ui("Clear")}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {translationMode === "bank" ? (
                <motion.div
                  key="translation-bank"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-3"
                >
                  <motion.div animate={shakeControls}>
                    <TranslationWordBank
                      tokens={translationTokens}
                      selected={translationPicked}
                      disabled={enChecked}
                      checked={enChecked}
                      correct={enResult.ok}
                      onPick={pickTranslationToken}
                      onRemove={removeTranslationToken}
                    />
                  </motion.div>
                  <Button
                    type="button"
                    onClick={enChecked && enResult.ok ? advanceOrFinish : checkEnAnswer}
                    disabled={translationPicked.length === 0 || (enChecked && !enResult.ok)}
                    className="continue-glow h-14 w-full rounded-2xl lesson-cta text-sm font-black"
                  >
                    {ui(enChecked && enResult.ok ? "Next" : "Check translation")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="translation-type"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-3"
                >
                  <motion.div animate={shakeControls}>
                    <div className={cn("fs-panel",
                      enChecked && enResult.ok && "is-good",
                      enChecked && !enResult.ok && (enResult.phrasingNote ? "is-coach" : "is-bad"))}>
                      <div className="fs-prompt">
                        <PromptLanguageBadge label={meaningLabel} />
                        <strong>{ui(`Type in ${meaningLabel}`)}</strong>
                      </div>
                      <Input ref={enInputRef}
                        className="fs-input"
                        placeholder={`Type the ${meaningLabel} meaning...`}
                        autoFocus
                        spellCheck={false}
                        value={enInput}
                        onChange={e => { setEnInput(e.target.value); if (enChecked) setEnChecked(false); }}
                        onKeyDown={e => e.key === "Enter" && (enChecked && enResult.ok ? advanceOrFinish() : checkEnAnswer())}
                        disabled={enChecked && enResult.ok}
                      />
                      <button type="button" className="fs-check" onClick={enChecked && enResult.ok ? advanceOrFinish : checkEnAnswer}>
                        <span className="fs-check-label">{enChecked && enResult.ok ? ui("Next") : ui("Check")}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                  {learnEn && <div className="fs-charsrow"><CharBar onInsert={c => insertAt(enInputRef.current, c, setEnInput)} /></div>}
                </motion.div>
              )}
            </AnimatePresence>
            {!(enChecked && enResult.ok) && (
              <RecallHelp key={`${item.id}-translate-${phase}`} answer={shownEnglish} />
            )}
            <AnimatePresence>
              {enChecked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-5 text-center space-y-2",
                    enResult.ok ? "border-emerald-500/20 bg-emerald-500/10" :
                    enResult.phrasingNote ? "border-amber-500/25 bg-amber-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                  {enResult.ok ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                      <CheckCircle2 className="h-5 w-5" /> That's it!
                    </div>
                  ) : enResult.phrasingNote ? (
                    <div className="space-y-1.5">
                      <div className="text-amber-700 font-semibold text-lg">
                        {ui("People would understand you — but that's the literal translation.")}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {ui("The natural way is:")} <span className="text-zinc-950 font-semibold">{shownEnglish}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-rose-700 font-semibold">{ui("Not quite")}</div>
                      <div className="text-xs text-zinc-500">{ui("Answer:")} <span className="text-zinc-950 font-semibold">{shownEnglish}</span></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {enChecked && !enResult.ok ? (
              <div className="flex gap-3">
                <Button onClick={retryEn} variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
                </Button>
                <Button onClick={onSkip ?? onNext}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black">
                  {ui("Skip")}
                </Button>
              </div>
            ) : translationMode === "type" ? (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            ) : (
              <div className="fs-hint">{ui("Choose the words, then check your answer.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* GAP phase — type the missing word(s) */}
        {phase === "Gap" && (
          <motion.div key="gap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              Fill the blank — type the missing {gap.words.length > 1 ? "words" : "word"}.
            </p>
            <motion.div animate={shakeControls}>
              <div className={cn("fs-panel",
                gapChecked && gapResult.ok && "is-good",
                gapChecked && !gapResult.ok && "is-bad")}>
                <div className="fs-prompt">
                  <PromptLanguageBadge label={targetLabel} />
                  <strong>{ui("Fill in")}</strong>
                </div>
                <Input ref={gapInputRef}
                  className="fs-input"
                  placeholder={gap.words.length > 1 ? "Type the missing words..." : "Type the missing word..."}
                  autoFocus
                  spellCheck={false}
                  value={gapInput}
                  onChange={(e) => { setGapInput(e.target.value); if (gapChecked) setGapChecked(false); }}
                  onKeyDown={(e) => e.key === "Enter" && (gapChecked && gapResult.ok ? advanceOrFinish() : checkGap())}
                  disabled={gapChecked && gapResult.ok}
                />
                <button type="button" className="fs-check" onClick={gapChecked && gapResult.ok ? advanceOrFinish : checkGap}>
                  <span className="fs-check-label">{gapChecked && gapResult.ok ? ui("Next") : ui("Check")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
            {!learnEn && <div className="fs-charsrow"><CharBar onInsert={(c) => insertAt(gapInputRef.current, c, setGapInput)} /></div>}
            {!(gapChecked && gapResult.ok) && (
              <RecallHelp
                key={`${item.id}-gap`}
                answer={gap.words.join(" ")}
                hint={buildRecallHint(gap.words.join(" "))}
              />
            )}

            <AnimatePresence>
              {gapChecked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-4 text-center text-sm font-semibold",
                    gapResult.ok ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700" : "border-rose-500/20 bg-rose-500/10 text-rose-700")}>
                  {gapResult.ok
                    ? <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> That's it!</span>
                    : <>Not quite — the missing {gap.words.length > 1 ? "words are" : "word is"} <span className="text-zinc-950">{gap.words.join(" ")}</span></>}
                </motion.div>
              )}
            </AnimatePresence>

            {gapChecked && !gapResult.ok ? (
              <div className="flex gap-3">
                <Button onClick={retryGap} variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
                </Button>
                <Button onClick={advanceOrFinish}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black">
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* WORD ORDER phase — arrange the sentence before writing it unaided. */}
        {phase === "Order" && (
          <motion.div key="order" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fs-order-phase space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {ui("Drag the words into the correct order. You can also select a word, then choose where to move it.")}
            </p>

            <motion.div animate={shakeControls} className="fs-order-panel">
              <div
                className="fs-order-list"
                role="group"
                aria-label={ui(learnEn ? "English words to arrange" : "German words to arrange")}
              >
                {orderTokens.map((token, tokenIndex) => {
                  const hoverGloss = learnEn ? englishWordGloss(token.text) : germanWordGloss(token.text);
                  return (
                    <button
                      key={token.id}
                      type="button"
                      draggable={!orderLocked}
                      aria-disabled={orderLocked}
                      aria-pressed={orderSelected === tokenIndex}
                      aria-label={`${token.text}${hoverGloss ? `: ${hoverGloss}` : ""}, ${ui("position")} ${tokenIndex + 1}`}
                      data-gloss={hoverGloss ?? undefined}
                      className={cn(
                        "fs-order-token",
                        orderSelected === tokenIndex && "is-selected",
                        orderDragging === token.id && "is-dragging",
                        orderDropTarget === token.id && orderDragging !== token.id && "is-drop-target",
                        orderChecked && orderIsCorrect && "is-correct"
                      )}
                      onClick={() => {
                        if (suppressOrderClickRef.current) {
                          suppressOrderClickRef.current = false;
                          return;
                        }
                        if (!orderLocked) selectOrderToken(tokenIndex);
                      }}
                      onDragStart={(event) => {
                        if (orderLocked) {
                          event.preventDefault();
                          return;
                        }
                        suppressOrderClickRef.current = true;
                        draggedOrderTokenId.current = token.id;
                        setOrderDragging(token.id);
                        setOrderDropTarget(null);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", token.id);
                      }}
                      onDragEnd={() => {
                        draggedOrderTokenId.current = null;
                        setOrderDragging(null);
                        setOrderDropTarget(null);
                        window.setTimeout(() => {
                          suppressOrderClickRef.current = false;
                        }, 0);
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        if (orderLocked) return;
                        const fromId = draggedOrderTokenId.current;
                        if (!fromId || fromId === token.id) {
                          setOrderDropTarget(null);
                          return;
                        }
                        setOrderDropTarget(token.id);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        if (draggedOrderTokenId.current && draggedOrderTokenId.current !== token.id) {
                          setOrderDropTarget(token.id);
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (orderLocked) return;
                        const fromId = draggedOrderTokenId.current || event.dataTransfer.getData("text/plain");
                        reorderTokenById(fromId, token.id);
                        draggedOrderTokenId.current = null;
                        setOrderDragging(null);
                        setOrderDropTarget(null);
                      }}
                      onKeyDown={(event) => {
                        if (orderLocked) return;
                        if (event.key === "ArrowLeft" && tokenIndex > 0) {
                          event.preventDefault();
                          reorderToken(tokenIndex, tokenIndex - 1);
                        }
                        if (event.key === "ArrowRight" && tokenIndex < orderTokens.length - 1) {
                          event.preventDefault();
                          reorderToken(tokenIndex, tokenIndex + 1);
                        }
                      }}
                    >
                      <GripVertical aria-hidden="true" className="h-4 w-4" />
                      <span>{token.text}</span>
                    </button>
                  );
                })}
              </div>
              <p className="fs-order-help">{ui("Drag, click two words, or use the arrow keys to reorder.")}</p>
            </motion.div>
            <div className="fs-order-feedback">
              {!orderChecked && (
                <RecallHelp key={`${item.id}-order`} answer={item.de} />
              )}

              {orderChecked && (
                <div className={cn("fs-result", orderIsCorrect ? "is-good" : "is-bad")} role="status">
                  <strong>{ui(orderIsCorrect ? "Correct word order" : "Not quite")}</strong>
                  <span>{ui(orderIsCorrect ? "The sentence is ready to write from memory." : "Rearrange the words and check again.")}</span>
                                  <ManualReviewNote grade={grade} notice={manualReviewNotice} onUndo={() => { onUndoManualReview?.(); setGrade(null); }} onDismiss={() => onDismissManualReview?.()} onHold={onHoldManualReview} onRelease={onReleaseManualReview} />
                </div>
              )}

              {!orderChecked ? (
                <Button onClick={checkOrder}
                  className="continue-glow h-14 w-full rounded-2xl lesson-cta text-sm font-black">
                  {ui("Check word order")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : !orderIsCorrect ? (
                <div className="flex gap-3">
                  <Button onClick={retryOrder} variant="outline"
                    className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                    <RotateCcw className="mr-2 h-4 w-4" /> {ui("Shuffle again")}
                  </Button>
                  <Button onClick={advanceOrFinish}
                    className="app-skip-button h-12 flex-1 rounded-2xl font-black">
                    {ui("Skip")}
                  </Button>
                </div>
              ) : null}
            </div>
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* FRENCH phase (companion language) */}
        {phase === "French" && (
          <motion.div key="french" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">{ui("Now type the same sentence in French.")}</p>
            <div className="space-y-3">
              <motion.div animate={shakeControls}>
                <div className={cn("fs-panel",
                  frChecked && frResult.ok && "is-good",
                  frChecked && !frResult.ok && "is-bad")}>
                  <div className="fs-prompt">
                    <span>FR</span>
                    <strong>{ui("Type in French")}</strong>
                  </div>
                  <Input ref={frInputRef}
                    className="fs-input"
                    placeholder="Type it in French..."
                    autoFocus
                    spellCheck={false}
                    value={frInput}
                    onChange={e => { setFrInput(e.target.value); if (frChecked) setFrChecked(false); }}
                    onKeyDown={e => e.key === "Enter" && (frChecked && frResult.ok ? onNext() : checkFrAnswer())}
                    disabled={frChecked && frResult.ok}
                  />
                  <button type="button" className="fs-check" onClick={frChecked && frResult.ok ? onNext : checkFrAnswer}>
                    <span className="fs-check-label">{frChecked && frResult.ok ? ui("Done") : ui("Check")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
              <FrenchCharBar onInsert={c => insertAt(frInputRef.current, c, setFrInput)} />
            </div>
            <AnimatePresence>
              {frChecked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-5 text-center space-y-2",
                    frResult.ok ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                  {frResult.ok ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                      <CheckCircle2 className="h-5 w-5" /> {frResult.spellingNote ? "Close — mind the accents" : "Parfait !"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-rose-700 font-semibold">{ui("Not quite")}</div>
                      <div className="text-xs text-zinc-500">{ui("French:")} <span className="text-zinc-950 font-semibold">{item.fr}</span></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {frChecked && !frResult.ok ? (
              <div className="flex gap-3">
                <Button onClick={retryFr} variant="outline"
                  className="h-12 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
                </Button>
                <Button onClick={onSkip ?? onNext}
                  className="app-skip-button h-12 flex-1 rounded-2xl font-black">
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <div className="fs-hint"><kbd>↵</kbd> {ui("Press Enter when you are ready.")}</div>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}

        {/* MEMORY phase — recall both sentences without prompts */}
        {phase === "Memory" && (
          <motion.div key="memory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              Recall both sentences from memory. Press Hint if you're stuck.
            </p>
            <div className="space-y-3">
              {/* German recall input */}
              <div className="space-y-1.5">
                <div className="flex items-center pl-1">
                  <p className="text-[11px] font-black uppercase tracking-wide text-zinc-400">{ui("German")}</p>
                </div>
                <motion.div animate={shakeControls}>
                  <Input ref={memDeRef}
                    className={cn(
                      "h-14 rounded-2xl border-zinc-200 bg-white px-4 text-center text-base font-bold text-zinc-950 transition-all placeholder:text-zinc-400",
                      memDeChecked && memDeResult.ok  ? "border-emerald-300 bg-emerald-50" :
                      memDeChecked && !memDeResult.ok ? "border-rose-300 bg-rose-50" :
                                                        "focus:border-[var(--accent)]"
                    )}
                    placeholder="Type the German sentence..."
                    spellCheck={false}
                    value={memDeInput}
                    onChange={e => { setMemDeInput(e.target.value); if (memDeChecked) { setMemDeChecked(false); setMemFrChecked(false); } }}
                    onKeyDown={e => e.key === "Enter" && memFrRef.current?.focus()}
                    disabled={memDeChecked && memDeResult.ok && memFrChecked && memFrResult.ok}
                  />
                </motion.div>
                <CharBar onInsert={c => insertAt(memDeRef.current, c, setMemDeInput)} />
                {!(memDeChecked && memDeResult.ok) && (
                  <RecallHelp key={`${item.id}-memory-de`} answer={item.de} />
                )}
              </div>
              {/* French recall input */}
              <div className="space-y-1.5">
                <div className="flex items-center pl-1">
                  <p className="text-[11px] font-black uppercase tracking-wide text-zinc-400">{ui("French")}</p>
                </div>
                <Input ref={memFrRef}
                  className={cn(
                    "h-14 rounded-2xl border-zinc-200 bg-white px-4 text-center text-base font-bold text-zinc-950 transition-all placeholder:text-zinc-400",
                    memFrChecked && memFrResult.ok  ? "border-emerald-300 bg-emerald-50" :
                    memFrChecked && !memFrResult.ok ? "border-rose-300 bg-rose-50" :
                                                      "focus:border-[var(--accent)]"
                  )}
                  placeholder="Type the French sentence..."
                  spellCheck={false}
                  value={memFrInput}
                  onChange={e => { setMemFrInput(e.target.value); if (memFrChecked) { setMemDeChecked(false); setMemFrChecked(false); } }}
                  onKeyDown={e => e.key === "Enter" && (!memDeChecked ? checkMemory() : undefined)}
                  disabled={memDeChecked && memDeResult.ok && memFrChecked && memFrResult.ok}
                />
                <FrenchCharBar onInsert={c => insertAt(memFrRef.current, c, setMemFrInput)} />
                {!(memFrChecked && memFrResult.ok) && (
                  <RecallHelp key={`${item.id}-memory-fr`} answer={item.fr ?? ""} />
                )}
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {(memDeChecked || memFrChecked) && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-2">
                  <div className={cn("rounded-lg border p-3 text-sm space-y-1",
                    memDeResult.ok ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                    <div className="flex items-center gap-2 font-semibold">
                      {memDeResult.ok
                        ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="text-emerald-700">{ui("German correct")}</span></>
                        : <><X className="h-4 w-4 text-rose-600" /><span className="text-rose-700">{ui("German")}: <span className="text-zinc-950">{item.de}</span></span></>}
                    </div>
                  </div>
                  <div className={cn("rounded-lg border p-3 text-sm space-y-1",
                    memFrResult.ok ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                    <div className="flex items-center gap-2 font-semibold">
                      {memFrResult.ok
                        ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="text-emerald-700">{ui("French correct")}</span></>
                        : <><X className="h-4 w-4 text-rose-600" /><span className="text-rose-700">{ui("French:")} <span className="text-zinc-950">{item.fr}</span></span></>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            {memDeChecked && !(memDeResult.ok && memFrResult.ok) ? (
              <div className="flex gap-3">
                <Button onClick={retryMemory} variant="outline"
                  className="h-14 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> {ui("Try again")}
                </Button>
                <Button onClick={onSkip ?? onNext}
                  className="app-skip-button h-14 flex-1 rounded-2xl font-black">
                  {ui("Skip")}
                </Button>
              </div>
            ) : (
              <Button onClick={memDeChecked && memDeResult.ok && memFrResult.ok ? onNext : checkMemory}
                className="continue-glow h-14 w-full rounded-2xl lesson-cta text-sm font-black">
                {memDeChecked && memDeResult.ok && memFrResult.ok
                  ? <>{ui("Done")} <ArrowRight className="ml-2 h-5 w-5" /></>
                  : "Check both"}
              </Button>
            )}
            <button type="button" onClick={goBack} className="w-full text-center text-xs font-semibold text-zinc-400 transition-colors hover:text-[var(--accent)]">{ui("← Back")}</button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Section
function DialogueExercise({ dialogue, onNext, onGradeItem, onReviewLevel, onSnooze, onAnswer }: { dialogue: any; onNext: () => void; onGradeItem?: (itemId: string, grade: "know" | "struggle") => void; onReviewLevel?: (itemId: string, level: GuidedReviewLevel) => void; onSnooze?: (itemId: string, days: number) => void; onAnswer?: (correct: boolean) => void }) {
  const lines: any[] = dialogue?.lines ?? [];
  const [lineIdx, setLineIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [grade, setGrade] = useState<"know" | "struggle" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const missingLineHandled = useRef(false);
  const line = lines[lineIdx];
  const isLast = lineIdx >= lines.length - 1;
  const learnEn = useMemo(() => learningEnglish(), []);
  const result = useMemo(
    () => learnEn
      ? matchEnglish(input, line?.de ?? "")
      : matchLearningModeGermanAnswer(input, { de: line?.de ?? "", long: line?.long }),
    [input, learnEn, line]
  );
  // A German speaker learning English hears this on every stage, so it has to
  // honour their British/American choice — it was pinned to American, which
  // made the setting look broken to anyone who picked British.
  const targetLang = learnEn
    ? (resolveEnglishVariant(getEnglishVariant()) === "british" ? "en-GB" : "en-US")
    : "de-DE";
  const companionFr = useMemo(() => getCompanion() === "fr" && !learnEn, [learnEn]);

  useEffect(() => {
    if (line?.de) tts(line.de, 0.88, targetLang);
  }, [line?.de, targetLang]);
  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [lineIdx]);
  useEffect(() => {
    if (line) {
      missingLineHandled.current = false;
      return;
    }
    if (missingLineHandled.current) return;
    missingLineHandled.current = true;
    onNext();
  }, [line, onNext]);

  const checkLine = () => {
    if (!input.trim() || checked) return;
    setChecked(true);
    onAnswer?.(result.ok);
    tts(line?.de ?? "", 0.88, targetLang);
    if (result.ok) setTimeout(nextLine, 900);
  };

  const nextLine = () => {
    if (isLast) { onNext(); return; }
    setLineIdx(i => i + 1);
    setInput("");
    setChecked(false);
    setGrade(null);
  };

  useEffect(() => {
    if (line && !checked && input.trim() && result.ok && !result.spellingNote) checkLine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const lineGradeId = line?.id ?? `dialogue-${dialogue?.title ?? "line"}-${lineIdx}-${line?.de ?? ""}`;
  const markKnown = () => {
    setGrade("know");
    onGradeItem?.(lineGradeId, "know");
    nextLine();
  };
  const markStruggle = () => {
    setGrade("struggle");
    onGradeItem?.(lineGradeId, "struggle");
  };
  const skipLine = () => {
    // Skipping should unblock the learner without pretending the line was
    // known. Keep it in the short-term review queue, then move straight on.
    onGradeItem?.(lineGradeId, "struggle");
    onAnswer?.(false);
    nextLine();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!line) return;
      // The answer box keeps focus permanently now, so Alt combos must work
      // while "typing" — Alt+K/S never inserts a character anyway.
      if (!event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "k") {
        event.preventDefault();
        markKnown();
      }
      if (key === "s") {
        event.preventDefault();
        markStruggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lineGradeId, onGradeItem]);

  if (!line) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-2xl">
      <div className="text-center space-y-1">
        <Badge variant="outline" className="dialogue-title-badge rounded-full px-5 py-2 text-base font-black uppercase tracking-[0.14em]">
          <MessageSquareQuote className="mr-2 h-5 w-5" /> {dialogue.title}
        </Badge>
        <div className="text-xs font-black tracking-wide text-zinc-500">{lineIdx + 1} / {lines.length}</div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {onReviewLevel ? (
            <ReviewLevelPicker
              knownAriaLabel="Mark known and skip this line. Shortcut Alt K"
              onKnown={markKnown}
              onSelect={(level) => onReviewLevel(lineGradeId, level)}
              onSnooze={onSnooze && ((days) => onSnooze(lineGradeId, days))}
              showShortcut
            />
          ) : (
            <button
              aria-label="Mark known and skip this line. Shortcut Alt K"
              className="grade-btn grade-btn-known"
              onClick={markKnown}
              type="button"
            >
              {ui("Know it")}
              <kbd className="grade-kbd">Alt K</kbd>
            </button>
          )}
          <button
            aria-label="Mark this line as a struggle. Shortcut Alt S"
            className="grade-btn grade-btn-struggle"
            onClick={markStruggle}
            type="button"
          >
            {ui("Struggle")}
            <kbd className="grade-kbd">Alt S</kbd>
          </button>
        </div>
      </div>

      {/* Conversation so far */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {lines.slice(0, lineIdx).map((l: any, i: number) => (
          <div key={i} className={cn("flex gap-3", l.speaker === "B" && "flex-row-reverse")}>
            <div className="h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">{l.speaker}</div>
            <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5 space-y-0.5",
              l.speaker === "A" ? "bg-white border border-zinc-200" : "bg-zinc-50 border border-zinc-200")}>
              <div className="text-sm font-black tracking-tight text-zinc-950">{l.de}</div>
              {companionFr && l.fr && <div className="text-sm font-black tracking-tight text-[var(--accent)]">{l.fr}</div>}
              <div className="text-xs font-semibold text-zinc-500">{l.en}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Current line to type */}
      <div className="rounded-[24px] border border-zinc-200 bg-white p-6 space-y-4 shadow-[0_14px_34px_rgba(25,27,38,0.06)]">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-[var(--accent-dim)] flex items-center justify-center text-[11px] font-black text-[var(--accent)] shrink-0">{line.speaker}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide text-zinc-400">Type this in {learnEn ? "English" : "German"}</p>
            <div className="mt-0.5 text-xl font-black leading-tight tracking-tight text-zinc-950 sm:text-2xl">{line.en}</div>
            <div className="mt-1.5">
              <UsageChips de={learnEn ? line.en : line.de} />
            </div>
            {companionFr && line.fr && (
              <div className="mt-1 text-sm font-black tracking-tight text-[var(--accent)]">
                <span className="mr-1.5 text-[10px] font-black uppercase tracking-wide text-zinc-400">FR</span>
                {line.fr}
              </div>
            )}
          </div>
          <button onClick={() => tts(line.de, 0.88, targetLang)}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-600 shadow-[inset_0_0_0_1px_#e4e4e7] transition-colors hover:bg-zinc-50 hover:text-zinc-950">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <Input ref={inputRef}
          className={cn("h-14 rounded-2xl border-zinc-200 bg-white px-5 text-base font-bold text-zinc-950 transition-all placeholder:text-zinc-400",
            checked && result.ok ? "border-emerald-500/40" : checked ? "border-rose-500/40" : "focus:border-[var(--accent)]")}
          placeholder="Type this line..."
          spellCheck={false}
          value={input}
          onChange={e => { setInput(e.target.value); if (checked) setChecked(false); }}
          onKeyDown={e => e.key === "Enter" && (checked && result.ok ? nextLine() : checkLine())}
          disabled={checked && result.ok}
        />
        {!learnEn && <CharBar onInsert={c => insertAt(inputRef.current, c, setInput)} />}
        {!(checked && result.ok) && (
          <RecallHelp key={`${lineGradeId}-dialogue`} answer={line.de} />
        )}
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-2xl border p-4 text-center",
              result.ok ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700" : "border-rose-500/20 bg-rose-500/10 text-rose-700")}>
            {result.ok ? <span className="text-sm font-black">{ui("Spot on!")}</span>
              : <div className="space-y-1">
                  <div className="text-sm font-black">
                    {result.capitalizationError
                      ? "Capitalization error! In German, nouns and formal 'Sie/Ihnen/Ihr' must be capitalized."
                      : "Not quite"}
                  </div>
                  <div className="text-xs font-bold text-zinc-500">{line.de}</div>
                </div>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {checked && !result.ok && (
          <Button onClick={() => { setInput(""); setChecked(false); }} variant="outline"
            className="flex-1 h-14 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
            <RotateCcw className="mr-2 h-4 w-4" /> Retry
          </Button>
        )}
        {!(checked && result.ok) && (
          <Button
            aria-label="Skip this line for now and keep it in practice"
            className="dialogue-skip-action h-14 rounded-2xl text-sm font-black"
            onClick={skipLine}
            type="button"
            variant="outline"
          >
            <SkipForward className="mr-2 h-4 w-4" /> {ui("Skip for now")}
          </Button>
        )}
        <Button onClick={checked && result.ok ? nextLine : checkLine}
          className={cn(
            "dialogue-primary-action h-14 rounded-2xl text-sm font-black",
            checked && "col-span-2"
          )}>
          {checked && result.ok ? (isLast ? "Done" : "Next line") : ui("Check")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// Section
const CONFETTI_COLORS = ["#7834f7", "#a177ff", "#46d59a", "#ffd233", "#ff8528"];

/** One-shot confetti burst — pure framer-motion, no extra deps. Skipped for reduced-motion. */
function Confetti({ count = 40 }: { count?: number }) {
  const reduce = useReducedMotion() || effectsReduced();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() * 2 - 1) * 280,
        y: 140 + Math.random() * 260,
        rot: (Math.random() * 2 - 1) * 540,
        delay: Math.random() * 0.2,
        dur: 1.5 + Math.random() * 1.1,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 6 + Math.random() * 6,
        h: 9 + Math.random() * 8,
      })),
    [count]
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center overflow-visible" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0"
          style={{ width: p.w, height: p.h, backgroundColor: p.color, borderRadius: 2 }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], x: p.x, y: p.y, rotate: p.rot, scale: 1 }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.2, 0.6, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

// Section
/**
 * A single Sie-or-du situation question, shown at the end of a lesson that
 * taught a register-committing sentence.
 *
 * Getting it wrong is not punished — no XP loss, no repeat drilling. The point
 * is the explanation underneath, which is shown either way; a wrong answer just
 * brings the question back in a few days instead of a few months.
 */
function RegisterCheck({ question, onAnswer, onNext }: any) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === question.answer;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const isCorrect = i === question.answer;
    onAnswer?.(question.id, isCorrect);
    if (isCorrect) window.setTimeout(onNext, 1200);
  };

  return (
    <div className="fs-card-body w-full space-y-6 py-8">
      <div className="space-y-2 text-center">
        <span className="fs-when-label">{ui("Quick check")}</span>
        <p className="text-2xl font-semibold leading-snug tracking-tight">{question.prompt}</p>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        {question.options.map((opt: string, i: number) => {
          const isAnswer = i === question.answer;
          const state = !answered ? "idle" : isAnswer ? "right" : i === picked ? "wrong" : "muted";
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => choose(i)}
              className={
                "rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition " +
                (state === "idle"
                  ? "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                  : state === "right"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : state === "wrong"
                  ? "border-rose-400 bg-rose-50 text-rose-900"
                  : "border-zinc-100 text-zinc-400")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md space-y-4"
        >
          <p className="text-sm font-semibold">
            {correct ? ui("That's it.") : ui("Worth knowing:")}
          </p>
          <p className="text-sm leading-relaxed text-zinc-600">{question.explain}</p>
          {!correct && (
            <Button onClick={onNext} className="h-12 w-full rounded-lg text-sm font-semibold">
              {ui("Got it")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}

function CompleteScreen({ onNext }: { onNext: () => void }) {
  // Auto-finish: the celebration plays, then the lesson closes itself and the
  // next one is queued up — no "Finish" press needed. Any key/click skips the
  // wait, and the button stays for anyone who reaches for it.
  const done = useRef(false);
  const finish = () => { if (!done.current) { done.current = true; onNext(); } };
  useEffect(() => {
    const t = setTimeout(finish, 2600);
    const skip = () => { clearTimeout(t); finish(); };
    window.addEventListener("keydown", skip);
    window.addEventListener("mousedown", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("mousedown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-xl space-y-7 py-10 text-center"
    >
      <Confetti />

      {/* Springy success mark with an expanding ring */}
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--accent)" }}
          initial={{ scale: 0.2, opacity: 0.4 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 13, delay: 0.05 }}
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--accent)", boxShadow: "0 12px 34px rgba(120,52,247,0.45)" }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ delay: 0.22, duration: 0.4, ease: "easeOut" }}
          >
            <CheckCircle2 className="h-11 w-11 text-white" />
          </motion.span>
        </motion.div>
      </div>

      <div className="space-y-2">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-4xl font-black tracking-tight text-zinc-950"
        >
          Lesson complete!
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-sm font-semibold text-zinc-500"
        >
          Nice work — that's another one in the bank. 🎉
        </motion.div>
      </div>

      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
        <Button
          onClick={onNext}
          className="continue-glow h-12 w-full rounded-2xl bg-zinc-950 text-sm font-black text-white hover:bg-zinc-800"
        >
          Finish <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

// Section
const JOURNAL_STORAGE_KEY = "german-lab-journal";

function saveJournalEntry(entry: object) {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    const log = raw ? JSON.parse(raw) : [];
    log.unshift(entry);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(log.slice(0, 100)));
  } catch {}
}

function SessionJournal({ stepsCompleted, totalSteps, onDone }: {
  stepsCompleted: number; totalSteps: number; onDone: () => void;
}) {
  const [wentWell, setWentWell]       = useState("");
  const [struggling, setStruggling]   = useState("");
  const [mood, setMood]               = useState<string | null>(null);
  const [saved, setSaved]             = useState(false);

  const moods = [
    { emoji: "High", label: "On fire" },
    { emoji: "Good", label: "Good" },
    { emoji: "Okay", label: "Okay" },
    { emoji: "Tough", label: "Tough" },
  ];

  const save = () => {
    saveJournalEntry({
      date: new Date().toISOString(),
      stepsCompleted,
      totalSteps,
      mood,
      wentWell: wentWell.trim(),
      struggling: struggling.trim(),
    });
    setSaved(true);
    setTimeout(onDone, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="app-overlay fixed inset-0 z-[600] flex items-center justify-center bg-zinc-50/95 p-6 backdrop-blur-sm"
    >
      <Card className="w-full max-w-lg space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center space-y-1">
          <div className="text-2xl"></div>
          <div className="text-xl font-semibold text-zinc-950">{ui("Quick reflection")}</div>
          <div className="text-xs text-zinc-500">
            {uiIsGerman()
              ? `${stepsCompleted} von ${totalSteps} Schritten geschafft · dauert 30 Sekunden`
              : `${stepsCompleted} of ${totalSteps} steps done · takes 30 seconds`}
          </div>
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{ui("How did it feel?")}</div>
          <div className="flex gap-2">
            {moods.map(m => (
              <motion.button key={m.label} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => setMood(m.label)}
                className={cn(
                  "flex-1 py-3 rounded-2xl border text-center transition-all",
                  mood === m.label
                    ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
                )}>
                <div className="text-xl">{m.emoji}</div>
                <div className="text-[9px] font-semibold uppercase tracking-wide mt-0.5">{ui(m.label)}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* What went well */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {ui("What clicked today?")}
          </label>
          <textarea
            value={wentWell}
            onChange={e => setWentWell(e.target.value)}
            placeholder={ui("e.g. the cafe dialogue felt natural, articles are making more sense...")}
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Struggling */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            {ui("Any words or phrases giving you trouble?")}
          </label>
          <textarea
            value={struggling}
            onChange={e => setStruggling(e.target.value)}
            placeholder={ui("e.g. Wochenende, verbs that split in two, der/die/das...")}
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={onDone} variant="ghost"
            className="app-skip-button h-12 flex-1 rounded-lg text-xs font-semibold uppercase">
            {ui("Skip")}
          </Button>
          <Button onClick={save} disabled={saved}
            className="h-12 flex-1 rounded-lg bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800">
            {ui(saved ? "Saved" : "Save & exit")}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Section
type SessionPreviewCard = {
  id: string;
  german: string;
  english: string;
  use?: string;
  review: boolean;
};

function buildSessionPreviewCards(steps: any[]): SessionPreviewCard[] {
  const learnEn = learningEnglish();
  const englishVariant = getEnglishVariant();
  const seen = new Set<string>();
  const cards: SessionPreviewCard[] = [];

  for (const step of steps) {
    if (step?.type !== "sentence" || !step.item) continue;
    const german = String(learnEn ? step.item.en : step.item.de).trim();
    const englishSource = String(learnEn ? step.item.de : step.item.en).trim();
    const english = formatEnglishText(englishSource, englishVariant);
    if (!german || !english) continue;
    const keys = matchingVisibleKeys(german, english);
    if (keys.length !== 2 || keys.some((key) => seen.has(key))) continue;
    keys.forEach((key) => seen.add(key));
    const key = keys.join("\u0000");
    cards.push({
      id: String(step.item.id ?? key),
      german,
      english,
      use: step.item.use ? formatEnglishText(step.item.use, englishVariant) : step.item.use,
      review: Boolean(step.review),
    });
    if (cards.length === 6) break;
  }

  return cards;
}

/**
 * The two faces of a flip card, turning on the Y axis.
 *
 * Both faces are always in the DOM and hidden by backface-visibility rather
 * than swapped on a timer — that is what makes the turn continuous instead of
 * a fade with a gap in the middle. The back is laid over the front absolutely
 * so the card keeps one height and nothing jumps as it turns.
 */
function FlipFace({ back, flipped, front, onFlip }: {
  back: React.ReactNode;
  flipped: boolean;
  front: React.ReactNode;
  onFlip: () => void;
}) {
  const reduceMotion = useReducedMotion() || effectsReduced();
  return (
    <div
      aria-live="polite"
      className="fs-flashcard-flip"
      onKeyDown={(event) => {
        if (event.key !== " " && event.key !== "Enter") return;
        event.preventDefault();
        event.stopPropagation();
        onFlip();
      }}
      role="button"
      style={{ cursor: "pointer", perspective: 1400 }}
      tabIndex={0}
      title={ui("Click or press space to flip")}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        initial={false}
        style={{ position: "relative", transformStyle: "preserve-3d" }}
        transition={reduceMotion
          ? { duration: 0 }
          : { duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div
          style={{
            backfaceVisibility: "hidden",
            inset: 0,
            position: "absolute",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

function SessionFlashcardPreview({
  cards,
  index,
  onIndexChange,
  onKnown,
  onReviewLevel,
  onSnooze,
  notice,
  onUndoNotice,
  onDismissNotice,
  onSkip,
  onStart,
}: {
  cards: SessionPreviewCard[];
  index: number;
  onIndexChange: (index: number) => void;
  onKnown: (itemId: string) => void;
  onReviewLevel?: (itemId: string, level: GuidedReviewLevel) => void;
  onSnooze?: (itemId: string, days: number) => void;
  /** The preview is the intro, where the floating toast is suppressed, so it
   *  has to show the "put off" notice itself or Undo is nowhere. */
  notice?: { label: string; note: string; subject?: string } | null;
  onUndoNotice?: () => void;
  onDismissNotice?: () => void;
  onSkip: () => void;
  onStart: () => void;
}) {
  const card = cards[Math.min(index, cards.length - 1)];
  const isLast = index === cards.length - 1;
  const englishVoice = resolveEnglishVariant(getEnglishVariant()) === "american" ? "en-US" : "en-GB";

  // One way in for every bit of speech on this screen. tts() already no-ops
  // when muted and stops whatever was playing, so rapid taps don't stack.
  const speak = (text: string, lang: string) => {
    if (!text) return;
    void tts(text, 0.82, lang).catch(() => {
      /* a missing voice must never break the card */
    });
  };

  const [mode, setMode] = useState<FlashcardMode>(getFlashcardMode);
  const [face, setFace] = useState<FlashcardFace>(getFlashcardFace);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const sync = () => {
      setMode(getFlashcardMode());
      setFace(getFlashcardFace());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === FLASHCARD_MODE_KEY || event.key === FLASHCARD_FACE_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(FLASHCARD_MODE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(FLASHCARD_MODE_EVENT, sync);
    };
  }, []);

  // A new card always starts face down. Carrying the flip over would show the
  // answer to a phrase you have not been asked about yet.
  useEffect(() => { setFlipped(false); }, [card?.id, mode, face]);

  const toggleFlip = () => setFlipped((current) => !current);

  // In "both" mode the language being learned is spoken on sight. On a flip
  // card that would give the answer away before the learner has tried, so it
  // only speaks the side actually facing them — and it speaks the TARGET
  // language, which for a German speaker learning English is the English.
  useEffect(() => {
    const learnEnglish = learningEnglish();
    const spoken = learnEnglish ? card?.english : card?.german;
    if (!spoken) return;
    const showingTarget = mode !== "flip"
      ? true
      : face === "target" ? !flipped : flipped;
    if (!showingTarget) return;
    const timer = window.setTimeout(() => speak(spoken, learnEnglish ? englishVoice : "de-DE"), 180);
    return () => window.clearTimeout(timer);
  }, [card?.id, card?.german, card?.english, englishVoice, mode, face, flipped]);

  // In the two-language layout the sentence remains a generous speech target.
  // On a flip card, a sentence click belongs to the card itself; the dedicated
  // speaker button remains available without accidentally revealing the back.
  const languageRow = (label: string, text: string, lang: string, htmlLang: string) => (
    <div className="fs-flashcard-language">
      <div
        onClick={mode === "both" ? (event) => { event.stopPropagation(); speak(text, lang); } : undefined}
        onKeyDown={(event) => {
          if (mode === "both" && event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            speak(text, lang);
          }
        }}
        role={mode === "both" ? "button" : undefined}
        style={{ cursor: mode === "both" ? "pointer" : "inherit" }}
        tabIndex={mode === "both" ? 0 : undefined}
        title={mode === "both" ? ui("Tap to hear it") : undefined}
      >
        <span>{ui(label)}</span>
        <strong lang={htmlLang}>{text}</strong>
      </div>
      <button
        type="button"
        aria-label={`${ui("Hear it")}: ${text}`}
        onClick={(event) => { event.stopPropagation(); speak(text, lang); }}
      >
        <Volume2 className="h-5 w-5" />
      </button>
    </div>
  );
  const germanRow = () => languageRow("German", card.german, "de-DE", "de");
  const englishRow = () => languageRow("English", card.english, englishVoice, "en");
  // "Target" means the language being LEARNED, which is not always German. A
  // German speaker learning English was shown the German side first with the
  // English hidden behind the flip — the card testing her on her own language.
  const targetRow = () => (learningEnglish() ? englishRow() : germanRow());
  const meaningRow = () => (learningEnglish() ? germanRow() : englishRow());
  const frontSide = face === "target" ? targetRow() : meaningRow();
  const backSide = face === "target" ? meaningRow() : targetRow();

  const previous = () => onIndexChange(Math.max(0, index - 1));
  const next = () => {
    if (isLast) onStart();
    else onIndexChange(index + 1);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // While the level menu is open its own keys win. Space on a focused
      // option would otherwise flip the card instead of choosing the level.
      if (event.target instanceof Element && event.target.closest(".fs-review-level")) return;
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        previous();
      }
      // Space turns the card over. Checked before Enter/ArrowRight so it can
      // never double as "next" and skip the card you were about to answer.
      if (event.key === " " && mode === "flip") {
        event.preventDefault();
        toggleFlip();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, isLast, mode, flipped]);

  return (
    <div className="fs-card-body fs-preview">
      <div className="fs-preview-head">
        <div className="fs-preview-heading-copy">
          <span className="fs-eyebrow"><i />{ui("Lesson preview")}</span>
          <h1 className="fs-h1">{ui("Meet today's phrases")}</h1>
          <p className="fs-sub">{ui("Review both languages before sentence practice.")}</p>
          <div className="fs-preview-summary" aria-label={ui("Lesson preview")}>
            <span><BookOpen className="h-4 w-4" />{cards.length} {ui("Phrases")}</span>
            <span><Languages className="h-4 w-4" />{ui("German")} + {ui("English")}</span>
          </div>
        </div>
        <span className="fs-preview-count">
          {index + 1} <small>{ui("of")} {cards.length}</small>
        </span>
      </div>

      {notice && (
        <div className="fs-standalone-note">
          <ManualReviewNote grade={null} notice={notice} onUndo={onUndoNotice} onDismiss={onDismissNotice} />
        </div>
      )}

      <div className="fs-preview-route" aria-label={ui("Flashcard progress")}>
        {cards.map((item, cardIndex) => (
          <button
            key={item.id}
            type="button"
            aria-label={`${ui("Flashcard")} ${cardIndex + 1}`}
            aria-current={cardIndex === index ? "step" : undefined}
            className={cn(
              cardIndex === index && "is-active",
              cardIndex < index && "is-seen"
            )}
            onClick={() => onIndexChange(cardIndex)}
          >
            {cardIndex + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn("fs-flashcard", mode === "flip" && "is-flippable")}
          onClick={mode === "flip" ? toggleFlip : undefined}
          title={mode === "flip" ? ui("Click or press space to flip") : undefined}
        >
          <div className="fs-flashcard-topline">
            <div className="fs-flashcard-badge">
              {ui(card.review ? "Review phrase" : "New phrase")}
            </div>
            {/* Both of these stop the click reaching the card, which would
                otherwise flip it while you were choosing. */}
            <span className="fs-flashcard-grade" onClick={(event) => event.stopPropagation()}>
              {onReviewLevel ? (
                <ReviewLevelPicker
                  onKnown={() => onKnown(card.id)}
                  onSelect={(level) => onReviewLevel(card.id, level)}
                  onSnooze={onSnooze && ((days) => onSnooze(card.id, days))}
                  variant="flashcard"
                />
              ) : (
                <button
                  type="button"
                  className="fs-flashcard-known"
                  onClick={() => onKnown(card.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {ui("Know it")}
                </button>
              )}
            </span>
          </div>

          <div className="fs-flashcard-content">
            {mode === "flip" ? (
              <FlipFace
                back={backSide}
                flipped={flipped}
                front={frontSide}
                onFlip={toggleFlip}
              />
            ) : (
              <>
                {germanRow()}
                <div className="fs-flashcard-divider" aria-hidden>
                  <span>{ui("means")}</span>
                </div>
                {englishRow()}
              </>
            )}
          </div>

          {/* The usage note explains the answer, so on a flip card it waits
              until the card has actually been turned over. */}
          {card.use && (mode !== "flip" || flipped) && (
            <p className="fs-flashcard-note">{card.use}</p>
          )}

          <div className="fs-flashcard-footer">
            {mode === "flip" ? <RotateCcw className="h-4 w-4" /> : <Languages className="h-4 w-4" />}
            <span>{ui(mode === "flip" ? "Click or press space to flip" : "Both languages")}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="fs-preview-actions">
        <button
          type="button"
          onClick={previous}
          disabled={index === 0}
          className="fs-preview-back"
        >
          <ChevronLeft className="h-4 w-4" />
          {ui("Previous")}
        </button>
        <div className="fs-preview-primary-actions">
          <button type="button" onClick={onSkip} className="fs-preview-skip">
            <SkipForward className="h-4 w-4" />
            {ui("Skip preview")}
          </button>
          <button type="button" onClick={next} className="fs-preview-next">
            {ui(isLast ? "Start matching" : "Next flashcard")}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

type MatchDirection = "en-de" | "de-en";
type MatchingItem = SessionPreviewCard & { matchId: string };

function buildMatchingItems(cards: SessionPreviewCard[]): MatchingItem[] {
  const safeCards = takeMatchingSafe(
    cards,
    cards.length,
    (card) => ({ german: card.german, english: card.english })
  );
  return safeCards.map((card, index) => ({
    ...card,
    matchId: `${card.id}-${index}`,
    german: primaryAnswer(card.german),
    english: primaryAnswer(card.english),
  }));
}

function shuffledMatchTargets(items: MatchingItem[], direction: MatchDirection): MatchingItem[] {
  const shuffled = [...items].sort(
    (a, b) => choiceHash(`match|${direction}|${a.matchId}`) - choiceHash(`match|${direction}|${b.matchId}`)
  );
  if (
    shuffled.length > 1
    && shuffled.every((item, index) => item.matchId === items[index]?.matchId)
  ) {
    shuffled.push(shuffled.shift()!);
  }
  return shuffled;
}

function SessionMatchingPairs({
  cards,
  onAnswer,
  onProgress,
  onSkip,
  onComplete,
}: {
  cards: SessionPreviewCard[];
  onAnswer?: (correct: boolean) => void;
  onProgress: (matched: number) => void;
  onSkip: () => void;
  onComplete: () => void;
}) {
  const items = useMemo(() => buildMatchingItems(cards), [cards]);
  const [direction, setDirection] = useState<MatchDirection>(
    () => learningEnglish() ? "de-en" : "en-de"
  );
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(() => new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(() => new Set());
  const [resolving, setResolving] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  const targetItems = useMemo(
    () => shuffledMatchTargets(items, direction),
    [items, direction]
  );
  const sourceLanguage = direction === "en-de" ? "English" : "German";
  const targetLanguage = direction === "en-de" ? "German" : "English";
  const sourceText = (item: MatchingItem) => direction === "en-de" ? item.english : item.german;
  const targetText = (item: MatchingItem) => direction === "en-de" ? item.german : item.english;
  const complete = items.length > 0 && matchedIds.size === items.length;

  useEffect(() => {
    onProgress(matchedIds.size);
  }, [matchedIds, onProgress]);

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const resetRound = (nextDirection: MatchDirection) => {
    if (nextDirection === direction) return;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    setDirection(nextDirection);
    setSourceId(null);
    setTargetId(null);
    setMatchedIds(new Set());
    setWrongIds(new Set());
    setResolving(false);
  };

  const checkPair = (nextSourceId: string, nextTargetId: string) => {
    if (nextSourceId === nextTargetId) {
      setMatchedIds((current) => {
        const next = new Set(current);
        next.add(nextSourceId);
        return next;
      });
      setSourceId(null);
      setTargetId(null);
      onAnswer?.(true);
      return;
    }

    setWrongIds(new Set([nextSourceId, nextTargetId]));
    setResolving(true);
    onAnswer?.(false);
    resetTimer.current = window.setTimeout(() => {
      setSourceId(null);
      setTargetId(null);
      setWrongIds(new Set());
      setResolving(false);
    }, 650);
  };

  // Every card you touch says itself out loud, in its own language — matching
  // was silent, so the one screen where you meet both sides of a phrase gave
  // you no idea how either of them sounds. tts() already no-ops when muted and
  // cancels whatever was playing, so tapping down a column doesn't stack up.
  const speakCard = (text: string, language: string) => {
    if (!text) return;
    void tts(text, 0.95, language === "German" ? "de-DE" : "en-US").catch(() => {
      /* a missing voice must never block the match itself */
    });
  };

  const selectSource = (matchId: string) => {
    if (resolving || matchedIds.has(matchId)) return;
    const item = items.find((candidate) => candidate.matchId === matchId);
    if (item) speakCard(sourceText(item), sourceLanguage);
    setSourceId(matchId);
    if (targetId) checkPair(matchId, targetId);
  };

  const selectTarget = (matchId: string) => {
    if (resolving || matchedIds.has(matchId)) return;
    const item = items.find((candidate) => candidate.matchId === matchId);
    if (item) speakCard(targetText(item), targetLanguage);
    setTargetId(matchId);
    if (sourceId) checkPair(sourceId, matchId);
  };

  return (
    <div className="fs-card-body fs-matching">
      <div className="fs-matching-head">
        <div>
          <span className="fs-eyebrow"><i />{ui("Quick match")}</span>
          <h1 className="fs-h1">{ui("Match today's phrases")}</h1>
          <p className="fs-sub">{ui("Choose one phrase from each column.")}</p>
        </div>

        <div className="fs-match-direction" role="group" aria-label={ui("Matching direction")}>
          <button
            type="button"
            aria-pressed={direction === "en-de"}
            className={direction === "en-de" ? "is-active" : undefined}
            onClick={() => resetRound("en-de")}
          >
            <span>EN</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>DE</span>
            <small>{ui("English to German")}</small>
          </button>
          <button
            type="button"
            aria-pressed={direction === "de-en"}
            className={direction === "de-en" ? "is-active" : undefined}
            onClick={() => resetRound("de-en")}
          >
            <span>DE</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>EN</span>
            <small>{ui("German to English")}</small>
          </button>
        </div>
      </div>

      <div className="fs-match-board">
        <div className="fs-match-column-head">
          <span>{ui(sourceLanguage)}</span>
          <ArrowLeftRight className="h-4 w-4" />
          <span>{ui(targetLanguage)}</span>
        </div>

        <div className="fs-match-grid">
          {items.map((sourceItem, rowIndex) => {
            const targetItem = targetItems[rowIndex];
            const sourceMatched = matchedIds.has(sourceItem.matchId);
            const targetMatched = matchedIds.has(targetItem.matchId);
            return (
              <React.Fragment key={`${direction}-${sourceItem.matchId}`}>
                <button
                  type="button"
                  className={cn(
                    "fs-match-option",
                    sourceId === sourceItem.matchId && "is-selected",
                    sourceMatched && "is-matched",
                    wrongIds.has(sourceItem.matchId) && "is-wrong"
                  )}
                  aria-pressed={sourceId === sourceItem.matchId}
                  disabled={sourceMatched || resolving}
                  onClick={() => selectSource(sourceItem.matchId)}
                >
                  <span>{sourceText(sourceItem)}</span>
                  {sourceMatched && <CheckCircle2 className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className={cn(
                    "fs-match-option",
                    targetId === targetItem.matchId && "is-selected",
                    targetMatched && "is-matched",
                    wrongIds.has(targetItem.matchId) && "is-wrong"
                  )}
                  aria-pressed={targetId === targetItem.matchId}
                  disabled={targetMatched || resolving}
                  onClick={() => selectTarget(targetItem.matchId)}
                >
                  <span>{targetText(targetItem)}</span>
                  {targetMatched && <CheckCircle2 className="h-4 w-4" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="fs-match-footer">
        <div className="fs-match-progress" aria-live="polite">
          <div>
            <strong>{complete ? ui("All pairs matched") : `${ui("Matched")} ${matchedIds.size} ${ui("of")} ${items.length}`}</strong>
            <span>{ui(complete ? "Ready for sentence practice." : "Match every pair to continue.")}</span>
          </div>
          <div className="fs-match-progress-track" aria-hidden>
            <i style={{ width: `${items.length ? (matchedIds.size / items.length) * 100 : 0}%` }} />
          </div>
        </div>
        <div className="fs-match-actions">
          <button type="button" className="fs-preview-skip" onClick={onSkip}>
            <SkipForward className="h-4 w-4" />
            {ui("Skip matching")}
          </button>
          <button
            type="button"
            className="fs-preview-next"
            disabled={!complete}
            onClick={onComplete}
          >
            {ui("Start sentence practice")}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GuidedSession({ steps, onComplete, onCancel, onGradeItem, onSetItemStrength, onSetItemPermanent, onUndoGradeItem, onPreviewKnown, onPreviewSwap, onSnoozeItem, onAdvance, onRegisterAnswer }: any) {
  const { speak: petSpeak, selectedKey, selectedPet } = useCodexPets();
  const petEnabled = Boolean(selectedPet && selectedKey !== "off");
  const reduceMotion = useReducedMotion() || effectsReduced();
  const [guidedBackground, setGuidedBackground] = useState<GuidedBackground>(() => getGuidedBackground());
  const [guidedCustomBackground, setGuidedCustomBackground] = useState<string | null>(() => getGuidedCustomBackground());
  const [index, setIndex] = useState(0);
  const [previewActive, setPreviewActive] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [matchingActive, setMatchingActive] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [lessonNavigatorOpen, setLessonNavigatorOpen] = useState(false);
  const [completedLessonNumbers, setCompletedLessonNumbers] = useState<Set<number>>(() => new Set());
  const [lastManualReviewChange, setLastManualReviewChange] = useState<{
    itemIds: string[];
    label: string;
    note: string;
    /**
     * Where the learner was standing when the mark was made, but only when the
     * mark itself moved them on. Undo uses it to put them back; marks that
     * stay put leave it undefined so undoing them never shifts the lesson.
     */
    returnIndex?: number;
    /**
     * What was marked, in the learner's own words — once the lesson has moved
     * on, "Undo" on its own asks them to remember which card it belonged to.
     */
    subject?: string;
  } | null>(null);
  /**
   * The mark is done and saved; the notice only exists so it can be taken
   * back. Left on screen it becomes furniture — still there three cards
   * later, still offering to undo something the learner has forgotten. It
   * clears itself after a few seconds instead.
   *
   * The countdown does not run while the pointer is over the notice or the
   * keyboard focus is inside it, so it never vanishes from under someone who
   * is reaching for Undo, and moving away restarts the full window rather
   * than resuming a nearly-expired one.
   */
  const [reviewNoticeHeld, setReviewNoticeHeld] = useState(false);
  useEffect(() => {
    if (!lastManualReviewChange) {
      setReviewNoticeHeld(false);
      return undefined;
    }
    if (reviewNoticeHeld) return undefined;
    const timer = window.setTimeout(() => setLastManualReviewChange(null), MANUAL_REVIEW_NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [lastManualReviewChange, reviewNoticeHeld]);
  const holdReviewNotice = useCallback(() => setReviewNoticeHeld(true), []);
  const releaseReviewNotice = useCallback(() => setReviewNoticeHeld(false), []);
  const [gradeResetNonce, setGradeResetNonce] = useState(0);
  const [praise, setPraise] = useState<{ count: number; id: number } | null>(null);
  useEffect(() => {
    const syncGuidedBackground = () => {
      setGuidedBackground(getGuidedBackground());
      setGuidedCustomBackground(getGuidedCustomBackground());
    };
    window.addEventListener(GUIDED_BACKGROUND_EVENT, syncGuidedBackground);
    return () => window.removeEventListener(GUIDED_BACKGROUND_EVENT, syncGuidedBackground);
  }, []);
  const lessonProgressRef = useRef<HTMLDivElement | null>(null);
  const lessonProgressTriggerRef = useRef<HTMLButtonElement | null>(null);
  const comboRef = useRef(0);
  const praiseId = useRef(0);
  const correctPraiseIndex = useRef(0);
  const retryPraiseIndex = useRef(0);
  const announcedComplete = useRef(false);
  // Stage answers are collected in memory and flushed once when the sentence
  // is left. Persisting every check would write localStorage (and wake every
  // grades-updated listener) many times during one 16-stage route.
  const answerPerformanceRef = useRef(new Map<string, AnswerPerformance>());
  const safeSteps = Array.isArray(steps) && steps.length > 0 ? steps : [{ type: "complete" }];
  const lessonStepIndexes = useMemo(
    () => safeSteps.flatMap((candidate: any, candidateIndex: number) => candidate.type === "complete" ? [] : [candidateIndex]),
    [safeSteps]
  );
  const previewCards = useMemo(() => buildSessionPreviewCards(safeSteps), [steps]);
  /**
   * Name what was marked, so the notice can say which phrase it means. Ids are
   * opaque, and once the lesson has moved on the card is no longer on screen.
   */
  const describeMarkedItems = useCallback((ids: string[]): string | undefined => {
    const wanted = new Set(ids);
    const found: string[] = [];
    for (const candidate of safeSteps) {
      if (candidate?.type === "sentence" && wanted.has(String(candidate.item?.id))) {
        if (candidate.item?.de) found.push(String(candidate.item.de));
      }
      for (const line of candidate?.dialogue?.lines ?? []) {
        if (wanted.has(String(line?.id)) && line?.de) found.push(String(line.de));
      }
    }
    if (!found.length) return undefined;
    return found.length === 1 ? found[0] : `${found.length} lines`;
  }, [safeSteps]);

  const applyManualReviewChange = useCallback((
    itemIds: string[],
    level: GuidedReviewLevel,
    returnIndex?: number
  ) => {
    const ids = Array.from(new Set(itemIds.filter(Boolean)));
    if (!ids.length) return;
    ids.forEach((itemId) => {
      if (level === "know" || level === "struggle") onGradeItem?.(itemId, level);
      else if (level === "permanent") onSetItemPermanent?.(itemId);
      else onSetItemStrength?.(itemId, level === "new" ? 0 : level);
    });
    const details = reviewLevelDetails(level);
    setLastManualReviewChange({
      itemIds: ids,
      label: details.label,
      note: details.note,
      returnIndex,
      subject: describeMarkedItems(ids),
    });
  }, [describeMarkedItems, onGradeItem, onSetItemPermanent, onSetItemStrength]);
  /**
   * Put an item off, and say so in the same notice the levels use.
   *
   * Unlike a level, this does not claim anything about how well it is known --
   * it only moves the earliest date it can reappear, and nothing overrides it.
   */

  const gradeItem = useCallback((itemId: string, grade: "know" | "struggle") => {
    applyManualReviewChange([itemId], grade);
  }, [applyManualReviewChange]);
  const markPreviewItemKnown = useCallback((itemId: string) => {
    if (onPreviewKnown) onPreviewKnown(itemId);
    else onGradeItem?.(itemId, "know");
  }, [onGradeItem, onPreviewKnown]);

  /**
   * Set a phrase's level from the preview, before the lesson has begun.
   *
   * Saying "Mastered" or "Never review" here means you already have this one,
   * so keeping it in today's six wastes a slot on something you know. The
   * levels that finish an item hand the slot back and a fresh phrase takes its
   * place, exactly as "Know it" does — the sitting stays six either way.
   *
   * "Struggling" and "New" ask for MORE practice, so those keep the card.
   */
  const setPreviewItemLevel = useCallback((itemId: string, level: GuidedReviewLevel) => {
    applyManualReviewChange([itemId], level);
    if (reviewLevelFinishesItem(level)) onPreviewSwap?.(itemId);
  }, [applyManualReviewChange, onPreviewSwap]);
  const listeningChoicePool = useMemo(
    () => safeSteps
      .filter((candidate: any) => candidate?.type === "sentence" && candidate.item?.de)
      .map((candidate: any) => String(candidate.item.de)),
    [steps]
  );
  const translationChoicePool = useMemo(
    () => safeSteps
      .filter((candidate: any) => candidate?.type === "sentence" && candidate.item?.en)
      .map((candidate: any) => String(candidate.item.en)),
    [steps]
  );
  const inPreview = previewActive && previewCards.length > 0;
  const inMatching = matchingActive && previewCards.length > 1;
  const inIntro = inPreview || inMatching;

  useEffect(() => {
    if (!lessonNavigatorOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && lessonProgressRef.current?.contains(event.target)) return;
      setLessonNavigatorOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setLessonNavigatorOpen(false);
      lessonProgressTriggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [lessonNavigatorOpen]);

  const registerAnswer = (ok: boolean, itemId?: string) => {
    if (itemId) {
      const current = answerPerformanceRef.current.get(itemId) ?? { attempts: 0, mistakes: 0 };
      answerPerformanceRef.current.set(itemId, {
        attempts: current.attempts + 1,
        mistakes: current.mistakes + (ok ? 0 : 1),
      });
    }
    // The praise filter: off silences the pet's cheering entirely, low keeps
    // only streak milestones. The little on-screen streak flash stays either
    // way — the filter is about chatter, not feedback.
    const praiseFrequency = getCodexPetFrequency("praise");
    if (ok) {
      const n = comboRef.current + 1;
      comboRef.current = n;
      playCorrect();
      if (n === 3 || n === 5 || n === 10 || (n > 10 && n % 5 === 0)) {
        const id = ++praiseId.current;
        setPraise({ count: n, id });
        setTimeout(() => setPraise((p) => (p && p.id === id ? null : p)), 1500);
        if (praiseFrequency !== "off") {
          petSpeak(`${n} correct in a row! Excellent work.`, {
            durationMs: 3800,
            mood: "celebrate",
            voiceLang: "en-US",
          });
        }
      } else if (praiseFrequency !== "off" && praiseFrequency !== "low") {
        const messages = ["Well done!", "Sehr gut! Very good.", "Nice work!", "You got it."];
        petSpeak(messages[correctPraiseIndex.current++ % messages.length], {
          mood: "success",
          voiceLang: "en-US",
        });
      }
    } else {
      comboRef.current = 0;
      playWrong();
      if (praiseFrequency !== "off") {
        const messages = [
          "Nearly. Try once more.",
          "Keep going. Check the hint.",
          "No problem. You can get the next one.",
        ];
        petSpeak(messages[retryPraiseIndex.current++ % messages.length], {
          durationMs: 3400,
          mood: "encourage",
          voiceLang: "en-US",
        });
      }
    }
  };

  const step = safeSteps[Math.min(index, safeSteps.length - 1)];
  const progress = inPreview
    ? Math.round(((previewIndex + 1) / previewCards.length) * 100)
    : inMatching
      ? Math.round((matchingProgress / previewCards.length) * 100)
      : safeSteps.length > 1 ? Math.round((index / (safeSteps.length - 1)) * 100) : 100;
  // Count only real exercises, not the final "lesson complete" summary screen,
  // so the header reads "4 of 6", not "4 of 7".
  const exerciseCount = lessonStepIndexes.length || 1;
  const currentLessonIndex = lessonStepIndexes.indexOf(index);
  const exercisePos = currentLessonIndex >= 0 ? currentLessonIndex + 1 : exerciseCount;
  // Persist the item we're leaving immediately, so closing the app mid-session
  // doesn't lose progress (onComplete/onCancel only fire on full finish or the
  // in-app exit, never on an abrupt window/tab close).
  //
  // `skipped` matters: skipping used to travel the same path as a clean recall,
  // so pressing Skip (or Alt+Right, or Skip after a wrong answer) promoted the
  // item up the memory ladder and scheduled it months out — and inflated the
  // fluency estimate, which counts the same records. A skipped item is left
  // exactly as it was.
  const leaveStep = (skipped: boolean) => {
    const current = safeSteps[index];
    const itemId = current?.type === "sentence" ? current.item?.id : undefined;
    const performance = itemId ? answerPerformanceRef.current.get(itemId) : undefined;
    if (current) onAdvance?.(current, skipped, performance);
    if (itemId) answerPerformanceRef.current.delete(itemId);
    if (!skipped && currentLessonIndex >= 0) {
      setCompletedLessonNumbers((previous) => {
        const nextCompleted = new Set(previous);
        nextCompleted.add(currentLessonIndex + 1);
        return nextCompleted;
      });
    }
    if (index < safeSteps.length - 1) setIndex(i => i + 1); else onComplete();
  };
  const next = () => leaveStep(false);

  const handleCancel = () => {
    const current = safeSteps[index];
    const itemId = current?.type === "sentence" ? current.item?.id : undefined;
    const performance = itemId ? answerPerformanceRef.current.get(itemId) : undefined;
    // Closing the lesson is not a successful recall, but genuine wrong attempts
    // made before closing still belong to this sentence's difficulty history.
    if (current) onAdvance?.(current, true, performance);
    if (itemId) answerPerformanceRef.current.delete(itemId);
    onCancel(index);
  };
  const skipStep = () => {
    if (inIntro) return;
    petSpeak("No problem. Let's try the next one.", {
      durationMs: 2800,
      mood: "encourage",
      voiceLang: "en-US",
    });
    leaveStep(true);
  };

  /**
   * The "Set level" menu. Levels that finish the item move the lesson on, the
   * same way "Know it" does — otherwise the learner tells the app an item is
   * Mastered and is then made to keep drilling it. The index is recorded so
   * the Undo that now appears on the NEXT card can bring them back here.
   */
  /**
   * Write the snooze and say so. Does NOT decide what happens next, because
   * that differs by where you are: mid-lesson the exercise moves on, on the
   * preview the card is swapped for one you have not met.
   */
  const recordSnooze = (itemIds: string[], days: number, returnIndex?: number) => {
    const ids = Array.from(new Set(itemIds.filter(Boolean)));
    if (!ids.length) return false;
    ids.forEach((itemId) => onSnoozeItem?.(itemId, days));
    const choice = GUIDED_SNOOZE_CHOICES.find((option) => option.days === days);
    setLastManualReviewChange({
      itemIds: ids,
      // Built through uiFmt rather than glued together in JS. The old version
      // produced "Put off until in a month", which is wrong in English and
      // was dropped untranslated into the middle of a German sentence.
      label: choice ? uiFmt("Put off — {when}", { when: ui(choice.label) }) : ui("Put off"),
      note: "Nothing will show this before then.",
      // Captured before anything moves: once the card is swapped or the lesson
      // advances, the phrase is no longer in the step list to look up.
      subject: describeMarkedItems(ids),
      returnIndex,
    });
    return true;
  };

  const applyManualSnooze = (itemIds: string[], days: number) => {
    if (!recordSnooze(itemIds, days, index)) return;
    next();
  };

  /**
   * Putting a phrase off from the preview.
   *
   * next() is the EXERCISE's advance and does nothing useful here -- the
   * preview has its own card index -- so putting one off appeared to do
   * nothing at all. It hands the slot back like "Know it" does, so a phrase
   * you have not met takes its place and the sitting stays six.
   */
  const snoozePreviewItem = (itemId: string, days: number) => {
    if (!recordSnooze([itemId], days)) return;
    onPreviewSwap?.(itemId);
  };

  const applyReviewLevelFromPicker = (itemIds: string[], level: GuidedReviewLevel) => {
    const finishes = reviewLevelFinishesItem(level);
    applyManualReviewChange(itemIds, level, finishes ? index : undefined);
    if (finishes) next();
  };

  const struggleIdsForStep = (candidate: any): string[] => {
    if (candidate?.type === "sentence" && candidate.item?.id) return [String(candidate.item.id)];
    if (candidate?.type === "dialogue" && Array.isArray(candidate.dialogue?.lines)) {
      return candidate.dialogue.lines.flatMap((line: any) => line?.id ? [String(line.id)] : []);
    }
    return [];
  };

  const jumpToLesson = (lessonNumber: number, markCurrentAsStruggle = false) => {
    const targetIndex = lessonStepIndexes[lessonNumber - 1];
    if (!Number.isInteger(targetIndex) || targetIndex === index) {
      setLessonNavigatorOpen(false);
      return;
    }

    const current = safeSteps[index];
    const itemId = current?.type === "sentence" ? current.item?.id : undefined;
    const performance = itemId ? answerPerformanceRef.current.get(itemId) : undefined;
    if (markCurrentAsStruggle) {
      applyManualReviewChange(struggleIdsForStep(current), "struggle");
      petSpeak("Marked as a struggle. We will bring it back for more practice.", {
        durationMs: 3600,
        mood: "encourage",
        voiceLang: "en-US",
      });
    }
    if (current) onAdvance?.(current, true, performance);
    if (itemId) answerPerformanceRef.current.delete(itemId);
    setIndex(targetIndex);
    setLessonNavigatorOpen(false);
  };

  const markStruggleAndContinue = () => {
    const nextLessonNumber = currentLessonIndex + 2;
    if (nextLessonNumber <= lessonStepIndexes.length) {
      jumpToLesson(nextLessonNumber, true);
      return;
    }
    const current = safeSteps[index];
    // No returnIndex here: "continue" was the learner's explicit request, not a
    // side effect of grading, so undoing the mark must not drag them back.
    applyManualReviewChange(struggleIdsForStep(current), "struggle");
    setLessonNavigatorOpen(false);
    petSpeak("Marked as a struggle. We will bring it back for more practice.", {
      durationMs: 3600,
      mood: "encourage",
      voiceLang: "en-US",
    });
    leaveStep(true);
  };

  // Reverting a mark should never move you — unless the mark itself moved you.
  // Marking something Struggling keeps you on it, so undoing that must not jump
  // anywhere (it used to, restarting the exercise at stage one, which read as
  // losing your place). Marking something Mastered or Never review DOES move
  // the lesson on, so undoing that has to bring you back to it.
  const undoLastManualReviewChange = () => {
    if (!lastManualReviewChange) return;
    let restored = false;
    for (const itemId of lastManualReviewChange.itemIds) {
      if (onUndoGradeItem?.(itemId)) restored = true;
    }
    if (!restored) return;
    // Only marks that moved the learner on carry a returnIndex, so this puts
    // them back exactly where the mark was made without ever disturbing an
    // undo made on the spot.
    const { returnIndex } = lastManualReviewChange;
    if (Number.isInteger(returnIndex) && returnIndex !== index && returnIndex! < safeSteps.length) {
      setIndex(returnIndex!);
    }
    setLastManualReviewChange(null);
    petSpeak("Undone. You can decide again whenever you are ready.", {
      durationMs: 2600,
      mood: "encourage",
      voiceLang: "en-US",
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.key !== "ArrowRight") return;
      event.preventDefault();
      skipStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inIntro, index, safeSteps.length]);

  const kind: string = step?.type || step?.kind || "complete";

  // When the pending mark belongs to the sentence on screen, the in-card
  // banner hosts Undo and the floating toast stays hidden — one notice, next
  // to the exercise it talks about.
  const manualNoticeInline = Boolean(
    lastManualReviewChange
    && step?.type === "sentence"
    && step.item?.id
    && lastManualReviewChange.itemIds.includes(String(step.item.id))
  );

  useEffect(() => {
    if (kind !== "complete" || announcedComplete.current) return;
    announcedComplete.current = true;
    petSpeak("Lesson complete. Great work — you’re ready to move on.", {
      durationMs: 6000,
      mood: "encourage",
      voiceLang: "en-US",
    });
  }, [kind, petSpeak]);

  const registerRegisterAnswer = (questionId: string, ok: boolean) => {
    registerAnswer(ok);
    onRegisterAnswer?.(questionId, ok);
  };

  const guidedBackgroundStyle = guidedBackground === "custom" && guidedCustomBackground
    ? { "--guided-custom-background": `url("${guidedCustomBackground}")` } as React.CSSProperties
    : undefined;

  return (
    <div
      className={cn("guided-session fs-app prototype-guided-session app-overlay fixed inset-0 z-[500] flex flex-col overflow-hidden font-sans", `guided-background-${guidedBackground}`)}
      style={guidedBackgroundStyle}
    >

      {/* Topbar: brand · lesson progress · mute/close */}
      <header className="fs-topbar">
        <div className="fs-brand">
          <img src="/icon-64.png" alt="" />
          <div className="fs-brand-copy">
            <span className="fs-brand-name">MICHEON</span>
            <span className="fs-brand-byline">{ui("made with love by Leon & Michelle")}</span>
          </div>
        </div>
        <div className="fs-progress" ref={lessonProgressRef}>
          <button
            ref={lessonProgressTriggerRef}
            type="button"
            className={cn("fs-progress-trigger", !inIntro && "is-navigable")}
            aria-expanded={!inIntro && lessonNavigatorOpen}
            aria-controls={!inIntro ? "lesson-navigator" : undefined}
            aria-haspopup={!inIntro ? "dialog" : undefined}
            disabled={inIntro}
            onClick={() => !inIntro && setLessonNavigatorOpen((open) => !open)}
            title={!inIntro ? ui("Choose any lesson") : undefined}
          >
            <div className="fs-progress-copy">
              <span>{ui(inPreview ? "Preview" : inMatching ? "Matching" : "Lesson")}</span>
              <strong>
                {inPreview ? previewIndex + 1 : inMatching ? matchingProgress : exercisePos} {ui("of")} {inIntro ? previewCards.length : exerciseCount}
              </strong>
            </div>
            <div className="fs-progress-track"><i style={{ width: `${progress}%` }} /></div>
            <strong className="fs-progress-pct">{progress}%</strong>
            {!inIntro && <ChevronDown className="fs-progress-chevron" aria-hidden="true" />}
          </button>
          {!inIntro && lessonNavigatorOpen && (
            <div id="lesson-navigator" className="fs-lesson-navigator" role="dialog" aria-label={ui("Choose any lesson")}>
              <div className="fs-lesson-navigator-head">
                <div>
                  <strong>{ui("Choose any lesson")}</strong>
                  <span>{ui("Move freely without marking unfinished lessons as complete.")}</span>
                </div>
                <button type="button" aria-label={ui("Close lesson navigator")} onClick={() => setLessonNavigatorOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="fs-lesson-number-grid" aria-label={ui("Lessons in this session")}>
                {lessonStepIndexes.map((stepIndex, lessonOffset) => {
                  const lessonNumber = lessonOffset + 1;
                  const isCurrent = stepIndex === index;
                  const isCompleted = completedLessonNumbers.has(lessonNumber);
                  return (
                    <button
                      key={stepIndex}
                      type="button"
                      className={cn("fs-lesson-number", isCurrent && "is-current", isCompleted && "is-complete")}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`${ui("Lesson")} ${lessonNumber}${isCurrent ? `, ${ui("current")}` : isCompleted ? `, ${ui("complete")}` : ""}`}
                      onClick={() => jumpToLesson(lessonNumber)}
                    >
                      <span>{lessonNumber}</span>
                      {isCompleted ? <CheckCircle2 aria-hidden="true" /> : <small>{isCurrent ? ui("Now") : ui("Open")}</small>}
                    </button>
                  );
                })}
              </div>
              {struggleIdsForStep(step).length > 0 && currentLessonIndex >= 0 && (
                <button type="button" className="fs-lesson-struggle-next" onClick={markStruggleAndContinue}>
                  <span>
                    <strong>{ui("Mark as struggle and continue")}</strong>
                    <small>{ui("This lesson will return in priority practice.")}</small>
                  </span>
                  <SkipForward className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {import.meta.env.DEV && !inIntro && (
            <Button variant="ghost" onClick={skipStep} className="skip-step-btn app-skip-button">
              <span>{ui("Skip")}</span>
              <kbd>Alt →</kbd>
            </Button>
          )}
          <MuteButton
            className="fs-iconbtn shrink-0"
            iconClassName="h-4 w-4"
            panelClassName="prototype-audio-mixer"
          />
          <button type="button" aria-label={ui("Close lesson")} className="fs-iconbtn" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-start justify-center overflow-y-auto p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div key={inPreview ? "preview" : inMatching ? "matching" : index}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full max-w-5xl justify-center">
            <div className={cn("fs-card relative", inPreview && "fs-card--preview")}>
              <div className="relative z-10 flex flex-col">
                {inPreview ? (
                  <SessionFlashcardPreview
                    cards={previewCards}
                    index={previewIndex}
                    onIndexChange={setPreviewIndex}
                    onKnown={markPreviewItemKnown}
                    onReviewLevel={setPreviewItemLevel}
                    onSnooze={snoozePreviewItem}
                    notice={lastManualReviewChange}
                    onUndoNotice={undoLastManualReviewChange}
                    onDismissNotice={() => setLastManualReviewChange(null)}
                    onSkip={() => {
                      setPreviewActive(false);
                      setMatchingActive(previewCards.length > 1);
                      setMatchingProgress(0);
                    }}
                    onStart={() => {
                      setPreviewActive(false);
                      setMatchingActive(previewCards.length > 1);
                    }}
                  />
                ) : inMatching ? (
                  <SessionMatchingPairs
                    cards={previewCards}
                    onAnswer={registerAnswer}
                    onProgress={setMatchingProgress}
                    onSkip={() => {
                      setMatchingActive(false);
                      setMatchingProgress(0);
                    }}
                    onComplete={() => setMatchingActive(false)}
                  />
                ) : (
                  <>
                    {kind === "sentence"  && <SentenceExercise key={`sentence-${index}-${gradeResetNonce}`} item={step.item} listeningChoicePool={listeningChoicePool} translationChoicePool={translationChoicePool} onGradeItem={gradeItem} onReviewLevel={(level) => applyReviewLevelFromPicker([String(step.item?.id ?? "")], level)} onSnooze={(days) => applyManualSnooze([String(step.item?.id ?? "")], days)} onNext={next} onSkip={skipStep} onAnswer={(ok) => registerAnswer(ok, step.item?.id)} manualReviewNotice={manualNoticeInline ? lastManualReviewChange : null} onUndoManualReview={undoLastManualReviewChange} onDismissManualReview={() => setLastManualReviewChange(null)} onHoldManualReview={holdReviewNotice} onReleaseManualReview={releaseReviewNotice} />}
                    {kind === "dialogue"  && <div className="fs-card-body flex flex-col items-center"><DialogueExercise key={`dialogue-${index}-${gradeResetNonce}`} dialogue={step.dialogue} onGradeItem={gradeItem} onReviewLevel={(itemId, level) => applyReviewLevelFromPicker([itemId], level)} onSnooze={(itemId, days) => applyManualSnooze([itemId], days)} onNext={next} onAnswer={registerAnswer} /></div>}
                    {kind === "register"  && <RegisterCheck question={step.question} onAnswer={registerRegisterAnswer} onNext={next} />}
                    {kind === "complete"  && (
                      <div className="fs-card-body flex flex-col items-center">
                        <CompleteScreen onNext={onComplete} />
                      </div>
                    )}
                    {!["sentence","dialogue","complete","register"].includes(kind) && (
                      <div className="fs-card-body py-12 text-center space-y-4">
                        <div className="text-4xl font-semibold tracking-tight text-zinc-950">{step.item?.de ?? ""}</div>
                        <Button onClick={next} className="h-12 rounded-lg bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800">
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {lastManualReviewChange && !inIntro && !manualNoticeInline && (
            <motion.div
              key={`${lastManualReviewChange.itemIds.join("-")}-${lastManualReviewChange.label}`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="fs-grade-undo"
              role="status"
              onMouseEnter={holdReviewNotice}
              onMouseLeave={releaseReviewNotice}
              onFocusCapture={holdReviewNotice}
              onBlurCapture={releaseReviewNotice}
            >
              <div>
                <strong>
                  {ui("Marked as")} {ui(lastManualReviewChange.label)}
                  {lastManualReviewChange.subject ? <> — “{lastManualReviewChange.subject}”</> : null}
                </strong>
                <span>{ui(lastManualReviewChange.note)}</span>
              </div>
              <button
                type="button"
                onClick={undoLastManualReviewChange}
                aria-label={lastManualReviewChange.subject
                  ? `${ui("Undo")} — ${lastManualReviewChange.subject}`
                  : ui("Undo")}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {ui("Undo")}
              </button>
              <button
                type="button"
                className="fs-grade-undo-dismiss"
                aria-label={ui("Dismiss")}
                onClick={() => setLastManualReviewChange(null)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Milestone praise pop */}
      <AnimatePresence>
        {praise && !petEnabled && (
          <motion.div
            key={praise.id}
            initial={reduceMotion
              ? { opacity: 0, x: "-50%" }
              : { opacity: 0, x: "-50%", y: -8 }}
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            exit={reduceMotion
              ? { opacity: 0, x: "-50%" }
              : { opacity: 0, x: "-50%", y: -4 }}
            transition={reduceMotion
              ? { duration: 0.12 }
              : { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            aria-label={`${praise.count} ${ui("correct in a row")}`}
            className="fs-praise-pop"
            data-testid="lesson-streak-feedback"
            role="status"
          >
            <span className="fs-praise-count">
              {praise.count}
            </span>
            <span className="fs-praise-copy">
              <span className="fs-praise-label">
                {ui("Correct streak")}
              </span>
              <strong>{ui("Keep it going")}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}



