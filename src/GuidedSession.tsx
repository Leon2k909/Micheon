import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  matchGermanPhrase as match,
  matchGermanSentence,
  matchEnglishPhrase as matchEnglish,
  matchingVisibleKeys,
  primaryAnswer,
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
import { getCompanion } from "@/lib/companion";
import { learningEnglish } from "@/lib/direction";
import { isElectronApp } from "@/lib/platform";
import {
  AUDIO_SETTINGS_EVENT,
  getSfxAudioVolume,
  getTtsAudioVolume,
  getTtsSpeechRate,
  setTtsSpeechRate,
  TTS_SPEED_PRESETS,
} from "@/lib/audioMute";
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
import { addCustomEntries, getCustomPacks } from "@/lib/customContent";
import { tts, ttsSequence, TTS_SPEAKING_EVENT } from "@/lib/voice";
import { ui, uiIsGerman, uiOr } from "@/lib/i18n";
import {
  isSpeechRecognitionSupported,
  listenGermanOnce,
} from "@/lib/speechRecognition";
import {
  Volume2, Mic2, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, X,
  BookOpen, ArrowRight,
  MessageSquareQuote, RotateCcw, Languages, GripVertical, ArrowLeftRight,
  Eye, EyeOff, Lightbulb, Keyboard, MousePointerClick, SkipForward
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
  if (!register && !freq && !syn && !tierNote && !showShort && !showLong && (!use || (hideUse && !isWarning && !isSlang))) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Niche/casual pack note — uncommon German is always labelled */}
      {tierNote && (
        <span
          title={ui("Not everyday neutral German — use in the right company")}
          className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-black text-violet-500"
        >
          {uiOr(tierNote, "Besonderer Sprachgebrauch")}
        </span>
      )}
      {register === "informal" && (
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-600">
          {ui(REGISTER_LABEL.informal)}
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
              : "bg-zinc-100 text-zinc-500 border-transparent"
        )}>
          {uiOr(use, "Hinweis zur Verwendung")}
        </span>
      )}
      {showShort && (
        <span
          title={shortLabel ? uiOr(shortLabel, "Hinweis zur Verwendung") : ui("Natural form people commonly use in conversation")}
          className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-black text-teal-600"
        >
          {shortLabel ? uiOr(shortLabel, "Hinweis zur Verwendung") : ui("People say")}: “{short}”
        </span>
      )}
      {showLong && (
        <span
          title={ui("Complete standard form")}
          className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-black text-teal-600"
        >
          {ui("Full version")}: “{long}”
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
 * The replay button plus a right-click speed menu. The speed is the global
 * speech-speed setting, so choosing one here also updates Audio settings.
 */
function HearItButton({ speaking, onPlay }: { speaking: boolean; onPlay: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState(() => getTtsSpeechRate());
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sync = () => setSpeechRate(getTtsSpeechRate());
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, []);

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
        aria-haspopup="menu"
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
        <div aria-label={ui("Speech speed")} className="fs-speed-menu" role="menu">
          <span className="fs-speed-menu-label">{ui("Speech speed")}</span>
          {TTS_SPEED_PRESETS.map((preset) => (
            <button
              aria-checked={Math.abs(speechRate - preset) < 0.01}
              className={cn("fs-speed-option", Math.abs(speechRate - preset) < 0.01 && "is-active")}
              key={preset}
              onClick={() => { setTtsSpeechRate(preset); setMenuOpen(false); onPlay(); }}
              role="menuitemradio"
              type="button"
            >
              {preset}×
            </button>
          ))}
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
   …50213 tokens truncated…on>
      </div>
    </div>
  );
}

export default function GuidedSession({ steps, onComplete, onCancel, onGradeItem, onPreviewKnown, onAdvance, onRegisterAnswer }: any) {
  const { speak: petSpeak, selectedKey, selectedPet } = useCodexPets();
  const petEnabled = Boolean(selectedPet && selectedKey !== "off");
  const reduceMotion = useReducedMotion() || effectsReduced();
  const [index, setIndex] = useState(0);
  const [previewActive, setPreviewActive] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [matchingActive, setMatchingActive] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [lessonNavigatorOpen, setLessonNavigatorOpen] = useState(false);
  const [completedLessonNumbers, setCompletedLessonNumbers] = useState<Set<number>>(() => new Set());
  const [praise, setPraise] = useState<{ count: number; id: number } | null>(null);
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
  const gradeItem = useCallback((itemId: string, grade: "know" | "struggle") => {
    onGradeItem?.(itemId, grade);
  }, [onGradeItem]);
  const markPreviewItemKnown = useCallback((itemId: string) => {
    if (onPreviewKnown) onPreviewKnown(itemId);
    else onGradeItem?.(itemId, "know");
  }, [onGradeItem, onPreviewKnown]);
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
    if (ok) {
      const n = comboRef.current + 1;
      comboRef.current = n;
      playCorrect();
      if (n === 3 || n === 5 || n === 10 || (n > 10 && n % 5 === 0)) {
        const id = ++praiseId.current;
        setPraise({ count: n, id });
        setTimeout(() => setPraise((p) => (p && p.id === id ? null : p)), 1500);
        petSpeak(`${n} correct in a row! Excellent work.`, {
          durationMs: 3800,
          mood: "celebrate",
          voiceLang: "en-US",
        });
      } else {
        const messages = ["Well done!", "Sehr gut! Very good.", "Nice work!", "You got it."];
        petSpeak(messages[correctPraiseIndex.current++ % messages.length], {
          mood: "success",
          voiceLang: "en-US",
        });
      }
    } else {
      comboRef.current = 0;
      playWrong();
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
      struggleIdsForStep(current).forEach((struggleId) => gradeItem(struggleId, "struggle"));
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
    struggleIdsForStep(current).forEach((struggleId) => gradeItem(struggleId, "struggle"));
    setLessonNavigatorOpen(false);
    petSpeak("Marked as a struggle. We will bring it back for more practice.", {
      durationMs: 3600,
      mood: "encourage",
      voiceLang: "en-US",
    });
    leaveStep(true);
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

  return (
    <div className="guided-session fs-app prototype-guided-session app-overlay fixed inset-0 z-[500] flex flex-col overflow-hidden font-sans">

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
                    onSkip={() => {
                      setPreviewActive(false);
                      setMatchingActive(false);
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
                    onComplete={() => setMatchingActive(false)}
                  />
                ) : (
                  <>
                    {kind === "sentence"  && <SentenceExercise item={step.item} listeningChoicePool={listeningChoicePool} translationChoicePool={translationChoicePool} onGradeItem={gradeItem} onNext={next} onSkip={skipStep} onAnswer={(ok) => registerAnswer(ok, step.item?.id)} />}
                    {kind === "dialogue"  && <div className="fs-card-body flex flex-col items-center"><DialogueExercise dialogue={step.dialogue} onGradeItem={gradeItem} onNext={next} onAnswer={registerAnswer} /></div>}
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


