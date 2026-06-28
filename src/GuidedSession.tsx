import React, { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  matchGermanPhrase as match,
  matchEnglishPhrase as matchEnglish,
} from "@/lib/germanTextMatch";
import { formatEnglishText, getEnglishVariant } from "@/lib/englishVariant";
import { effectsReduced } from "@/lib/effects";
import { getCompanion } from "@/lib/companion";
import {
  isSpeechRecognitionSupported,
  listenGermanOnce,
  speechRecognitionUserHint,
} from "@/lib/speechRecognition";
import {
  Volume2, Mic2, ChevronRight, CheckCircle2, X,
  BookOpen, ArrowRight,
  MessageSquareQuote, RotateCcw, Target, Languages
} from "lucide-react";

// Section
function tts(text: string, rate = 0.88, lang = "de-DE") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate;
  window.speechSynthesis.speak(u);
}

// Play several utterances back to back (one cancel, then queue) — used to hear
// the German and French of a sentence in sequence on the Listen step.
function ttsSequence(items: { text: string; rate?: number; lang: string }[]) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  for (const { text, rate = 0.88, lang } of items) {
    if (!text) continue;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate;
    window.speechSynthesis.speak(u);
  }
}

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
      g.gain.linearRampToValueAtTime(gain, start + 0.012);
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
function CharBar({ onInsert }: { onInsert: (c: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {["Ä","ä","Ö","ö","Ü","ü","ß"].map(c => (
        <motion.button key={c} type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
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
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-base font-semibold text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
          onMouseDown={e => { e.preventDefault(); onInsert(c); }}>
          {c}
        </motion.button>
      ))}
    </div>
  );
}

// Section
const PHASES = ["Read", "Listen", "Speak", "Type", "Translate"] as const;
type Phase = typeof PHASES[number] | "French";

// In French companion mode the flow tests the two target languages (German +
// French) and uses English only as the shown meaning, so the English-typing
// "Translate" step is replaced by the French step.
const BILINGUAL_PHASES: Phase[] = ["Read", "Listen", "Speak", "Type", "French"];

// "Type" is the German-typing step; label it "German" in bilingual mode so the
// two language steps read clearly as German / French.
function phaseLabel(p: Phase, withFrench: boolean) {
  if (withFrench && p === "Type") return "German";
  return p;
}

function PhaseDots({ current, withFrench = false }: { current: Phase; withFrench?: boolean }) {
  const allPhases: Phase[] = withFrench ? BILINGUAL_PHASES : [...PHASES];
  const idx = allPhases.indexOf(current);
  return (
    <div className="grid gap-2 rounded-2xl bg-zinc-50 p-2 sm:grid-cols-5">
      {allPhases.map((p, i) => (
        <div
          key={p}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-3 py-2 transition-all",
            i === idx ? "bg-zinc-950 text-white shadow-sm" : i < idx ? "bg-white text-zinc-950" : "text-zinc-400"
          )}
        >
          <div className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-all",
            i === idx ? "bg-white text-zinc-950" : i < idx ? "bg-[var(--yellow)] text-zinc-950" : "bg-zinc-200 text-zinc-500"
          )}>
            {i + 1}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wide">
            {phaseLabel(p, withFrench)}
          </span>
        </div>
      ))}
    </div>
  );
}

// A single labeled language row (German / French) for bilingual companion mode.
// `active` highlights the language the learner is currently being asked to type.
function LangBlock({ label, text, active, onHear, speechState }: {
  label: string;
  text: string;
  active?: boolean;
  onHear: () => void;
  speechState?: { ok: boolean } | null;
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
        <button
          type="button"
          aria-label={`Hear the ${label} sentence`}
          onClick={onHear}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-600 shadow-[inset_0_0_0_1px_#e4e4e7] transition-colors hover:bg-zinc-50"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
      <div className={cn(
        "text-2xl font-black leading-tight tracking-tight sm:text-3xl",
        speechState?.ok ? "text-emerald-500" : speechState && !speechState.ok ? "text-rose-500" : "text-zinc-950"
      )}>
        {text}
      </div>
    </div>
  );
}

// Section
// Section
// Only advances when the user types the sentence correctly.
function SentenceExercise({ item, onNext, onGradeItem, onAnswer }: { item: any; onNext: () => void; onGradeItem?: (itemId: string, grade: "know" | "struggle") => void; onAnswer?: (correct: boolean) => void }) {
  const shakeControls = useAnimationControls();
  const reactToAnswer = (ok: boolean) => {
    onAnswer?.(ok);
    if (ok) shakeControls.start({ scale: [1, 1.05, 1], transition: { duration: 0.32 } });
    else shakeControls.start({ x: [0, -9, 9, -7, 7, -3, 0], transition: { duration: 0.42 } });
  };
  const [phase, setPhase] = useState<Phase>("Read");
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [enInput, setEnInput] = useState("");
  const [enChecked, setEnChecked] = useState(false);
  const [enAttempts, setEnAttempts] = useState(0);
  const [frInput, setFrInput] = useState("");
  const [frChecked, setFrChecked] = useState(false);
  const [frAttempts, setFrAttempts] = useState(0);
  const [speechListening, setSpeechListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechPhraseMatch, setSpeechPhraseMatch] = useState<{ ok: boolean; spellingNote: boolean } | null>(null);
  const [speechErr, setSpeechErr] = useState<string | null>(null);
  const [grade, setGrade] = useState<"know" | "struggle" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const enInputRef = useRef<HTMLInputElement>(null);
  const frInputRef = useRef<HTMLInputElement>(null);
  const speechAbortRef = useRef<AbortController | null>(null);
  const speechSupported = useMemo(() => isSpeechRecognitionSupported(), []);
  const englishVariant = useMemo(() => getEnglishVariant(), []);
  const displayEnglish = useMemo(() => formatEnglishText(item.en, englishVariant), [item.en, englishVariant]);
  const result   = useMemo(() => match(input, item.de), [input, item.de]);
  const enResult = useMemo(() => matchEnglish(enInput, displayEnglish), [enInput, displayEnglish]);
  // French companion: tested as an extra phase when enabled and the item has French.
  const companion = useMemo(() => getCompanion(), []);
  const hasFr = companion === "fr" && typeof item.fr === "string" && item.fr.trim().length > 0;
  const frResult = useMemo(() => match(frInput, item.fr ?? ""), [frInput, item.fr]);

  // Auto-play TTS when entering Listen phase (German, then French in companion mode)
  useEffect(() => {
    if (phase !== "Listen") return;
    if (hasFr) ttsSequence([{ text: item.de, lang: "de-DE" }, { text: item.fr, rate: 0.85, lang: "fr-FR" }]);
    else tts(item.de);
  }, [phase, item.de, item.fr, hasFr]);

  // Reset speech UI when entering Speak or sentence changes
  useEffect(() => {
    if (phase === "Speak") {
      speechAbortRef.current?.abort();
      setSpeechListening(false);
      setSpeechTranscript("");
      setSpeechPhraseMatch(null);
      setSpeechErr(null);
    }
  }, [phase, item.de]);

  useEffect(() => {
    if (phase !== "Speak") {
      speechAbortRef.current?.abort();
      setSpeechListening(false);
    }
  }, [phase]);

  useEffect(() => () => speechAbortRef.current?.abort(), []);

  // Focus input when entering Type or Translate phase
  useEffect(() => {
    if (phase === "Type")      setTimeout(() => inputRef.current?.focus(), 100);
    if (phase === "Translate") setTimeout(() => enInputRef.current?.focus(), 100);
    if (phase === "French")    setTimeout(() => frInputRef.current?.focus(), 100);
  }, [phase]);

  const handleSpeechCheck = () => {
    if (speechListening || !speechSupported) return;
    speechAbortRef.current?.abort();
    const ac = new AbortController();
    speechAbortRef.current = ac;
    setSpeechErr(null);
    setSpeechPhraseMatch(null);
    setSpeechTranscript("");
    setSpeechListening(true);
    listenGermanOnce({
      signal: ac.signal,
      onInterim: (text) => { if (!ac.signal.aborted) setSpeechTranscript(text); },
    })
      .then(({ transcript }) => {
        setSpeechTranscript(transcript);
        const m = match(transcript, item.de);
        setSpeechPhraseMatch(m);
        reactToAnswer(m.ok);
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        const code = e instanceof Error ? e.message : "unknown";
        if (code !== "aborted") setSpeechErr(speechRecognitionUserHint(code));
      })
      .finally(() => {
        if (!ac.signal.aborted) setSpeechListening(false);
      });
  };

  const advance = () => {
    const order: Phase[] = hasFr ? BILINGUAL_PHASES : [...PHASES];
    const next = order[order.indexOf(phase) + 1];
    if (next) setPhase(next);
  };

  const checkAnswer = () => {
    if (!input.trim() || checked) return;
    setChecked(true);
    reactToAnswer(result.ok);
    tts(item.de, result.ok ? 0.88 : 0.75);
    if (result.ok) {
      setTimeout(advance, 900);
    } else {
      setAttempts(a => a + 1);
    }
  };

  const retry = () => { setInput(""); setChecked(false); };

  // After the English translation: go to the French phase if active, else finish.
  const finishOrFrench = () => { if (hasFr) setPhase("French"); else onNext(); };

  const checkEnAnswer = () => {
    if (!enInput.trim() || enChecked) return;
    setEnChecked(true);
    reactToAnswer(enResult.ok);
    if (enResult.ok) {
      setTimeout(finishOrFrench, 900);
    } else {
      setEnAttempts(a => a + 1);
    }
  };

  const retryEn = () => { setEnInput(""); setEnChecked(false); };

  const checkFrAnswer = () => {
    if (!frInput.trim() || frChecked) return;
    setFrChecked(true);
    reactToAnswer(frResult.ok);
    tts(item.fr, frResult.ok ? 0.9 : 0.78, "fr-FR");
    if (frResult.ok) {
      setTimeout(onNext, 900);
    } else {
      setFrAttempts(a => a + 1);
    }
  };

  const retryFr = () => { setFrInput(""); setFrChecked(false); };
  const markKnown = () => {
    setGrade("know");
    if (item?.id) onGradeItem?.(item.id, "know");
    onNext();
  };
  const markStruggle = () => {
    setGrade("struggle");
    if (item?.id) onGradeItem?.(item.id, "struggle");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (!event.altKey || isTyping) return;

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

  // Encouraging messages that rotate
  const encouragements = ["Speak at a normal pace.", "Focus on the vowel sounds.", "Try it once clearly.", "Replay if you need the model."];
  const enc = encouragements[attempts % encouragements.length];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-700 shadow-[inset_0_0_0_1px_#e4e4e7]">
            <Languages className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-zinc-950">Sentence practice</p>
            <p className="text-xs font-semibold text-zinc-500">
              {hasFr ? "Read, hear, say, then type it in German and French." : "Read, hear, say, type, then translate."}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-zinc-600 shadow-[inset_0_0_0_1px_#e4e4e7]">
          <Target className="h-4 w-4 text-zinc-400" />
          Build one useful sentence
        </div>
      </div>

      {/* Phase dots */}
      <PhaseDots current={phase} withFrench={hasFr} />

      {/* Sentence display card */}
      <div className={cn(
        "space-y-5 rounded-[24px] border border-zinc-200 bg-white p-6 shadow-[0_14px_34px_rgba(25,27,38,0.06)] transition-all duration-300 sm:p-8"
      )}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-black text-zinc-600">
            {hasFr ? "German + French" : "German sentence"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              aria-label="Mark known and skip to the next item. Shortcut Alt K"
              className="grade-btn grade-btn-known"
              onClick={markKnown}
              type="button"
            >
              Know it
              <kbd className="grade-kbd">Alt K</kbd>
            </button>
            <button
              aria-label="Mark this item as a struggle. Shortcut Alt S"
              className="grade-btn grade-btn-struggle"
              onClick={markStruggle}
              type="button"
            >
              Struggle
              <kbd className="grade-kbd">Alt S</kbd>
            </button>
            {!hasFr && (
              <button
                className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1.5 text-[11px] font-bold text-zinc-600 hover:bg-zinc-100"
                onClick={() => tts(item.de, 0.82)}
                type="button"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Hear it
              </button>
            )}
          </div>
        </div>

        {hasFr ? (
          /* ── Bilingual: German + French shown together, English as meaning ── */
          <div className="space-y-3">
            <LangBlock
              label="German"
              text={item.de}
              active={phase === "Type"}
              onHear={() => tts(item.de, 0.85, "de-DE")}
              speechState={phase === "Speak" ? speechPhraseMatch : null}
            />
            <LangBlock
              label="French"
              text={item.fr}
              active={phase === "French"}
              onHear={() => tts(item.fr, 0.85, "fr-FR")}
              speechState={null}
            />
            <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-500">
              Meaning: <span className="text-zinc-700">{displayEnglish}</span>
            </div>
          </div>
        ) : (
          /* ── German only (original) ── */
          <>
            <div className={cn(
              "text-4xl font-black leading-tight tracking-tight text-zinc-950 transition-all duration-300 sm:text-5xl",
              phase === "Speak" && speechPhraseMatch?.ok && "text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]",
              phase === "Speak" && speechPhraseMatch && !speechPhraseMatch.ok && "text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.25)]"
            )}>
              {item.de}
            </div>
            <AnimatePresence>
              {phase !== "Read" && phase !== "Translate" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-base font-semibold text-zinc-600">
                  {displayEnglish}
                </motion.div>
              )}
              {phase === "Translate" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-500">
                  What does this mean in English?
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <AnimatePresence>
          {grade === "struggle" && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-700">
              Marked as struggle. This item will stay in practice instead of being skipped next time.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phase-specific controls */}
      <AnimatePresence mode="wait">

        {/* READ phase */}
        {phase === "Read" && (
          <motion.div key="read" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {hasFr ? "Read both the German and French before listening." : "Read the sentence once before listening."}
            </p>
            <Button onClick={advance}
              className="continue-glow h-14 w-full rounded-2xl bg-zinc-950 text-sm font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] hover:bg-zinc-800">
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* LISTEN phase */}
        {phase === "Listen" && (
          <motion.div key="listen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">Listen once, then replay if you need it.</p>
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => tts(item.de)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50">
                <Volume2 className="h-5 w-5" />
              </motion.button>
              <Button onClick={advance}
                className="continue-glow h-14 flex-1 rounded-2xl bg-zinc-950 text-sm font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] hover:bg-zinc-800">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Section */}
        {phase === "Speak" && (
          <motion.div key="speak" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">Say it out loud. {enc}</p>
            {speechSupported ? (
              <>
                <Button type="button" onClick={handleSpeechCheck} disabled={speechListening}
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-white text-sm font-black text-zinc-900 hover:bg-zinc-50 disabled:opacity-70">
                  {speechListening ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                      </span>
                      Listening... speak now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Mic2 className="h-5 w-5" /> Check with microphone
                    </span>
                  )}
                </Button>
                {speechErr ? <p className="text-center text-xs text-rose-700">{speechErr}</p> : null}
                {speechTranscript ? (
                  <p className="text-center text-xs text-zinc-500">
                    Heard: <span className="font-semibold text-zinc-800">"{speechTranscript}"</span>
                  </p>
                ) : null}
                <AnimatePresence>
                  {speechPhraseMatch && speechTranscript ? (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={cn(
                        "flex items-center justify-center gap-1.5 text-xs font-semibold uppercase",
                        speechPhraseMatch.ok ? "text-emerald-500" : "text-rose-500"
                      )}>
                      {speechPhraseMatch.ok ? <CheckCircle2 className="h-4 w-4" /> : null}
                      {speechPhraseMatch.ok
                        ? speechPhraseMatch.spellingNote ? "Close match" : "Nice match"
                        : "Try again"}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <p className="text-center text-[10px] text-zinc-600">
                  Uses the browser speech recognizer (Chrome / Edge recommended). Requires microphone permission.
                </p>
              </>
            ) : (
              <p className="text-center text-xs text-zinc-500">
                Speech recognition is not available here - practice aloud, then continue when ready.
              </p>
            )}
            <div className="flex gap-3">
              <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => tts(item.de, 0.75)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50">
                <Volume2 className="h-5 w-5" />
              </motion.button>
              <Button type="button" onClick={advance}
                className="continue-glow h-14 flex-1 rounded-2xl bg-zinc-950 text-sm font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] hover:bg-zinc-800">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* TYPE phase */}
        {phase === "Type" && (
          <motion.div key="type" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">
              {hasFr ? "Now type the German sentence." : "Now type the sentence exactly."}
            </p>

            <div className="space-y-3">
              <motion.div animate={shakeControls}>
                <Input ref={inputRef}
                  className={cn(
                    "h-14 rounded-2xl border-zinc-200 bg-white px-4 text-center text-base font-bold text-zinc-950 transition-all placeholder:text-zinc-400",
                    checked && result.ok  ? "border-emerald-300 bg-emerald-50" :
                    checked && !result.ok ? "border-rose-300 bg-rose-50" :
                                            "focus:border-[var(--accent)]"
                  )}
                  placeholder="Type the sentence..."
                  value={input}
                  onChange={e => { setInput(e.target.value); if (checked) setChecked(false); }}
                  onKeyDown={e => e.key === "Enter" && (checked && result.ok ? onNext() : checkAnswer())}
                  disabled={checked && result.ok}
                />
              </motion.div>
              <CharBar onInsert={c => insertAt(inputRef.current, c, setInput)} />
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {checked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-5 text-center space-y-2",
                    result.ok ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                  {result.ok ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                      <CheckCircle2 className="h-5 w-5" />
                      {result.spellingNote ? "Close enough - watch the spelling next time" : "Perfect!"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-rose-700 font-semibold">Not quite - try again</div>
                      <div className="text-xs text-zinc-500">Target: <span className="text-zinc-950 font-semibold">{item.de}</span></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action button */}
            {checked && !result.ok ? (
              <div className="flex gap-3">
                <Button onClick={retry} variant="outline"
                  className="h-14 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Try again
                </Button>
                <Button onClick={onNext}
                  className="h-14 flex-1 rounded-2xl bg-zinc-100 font-black text-zinc-700 hover:bg-zinc-200">
                  Skip
                </Button>
              </div>
            ) : (
              <Button onClick={checked && result.ok ? advance : checkAnswer}
                className="h-14 w-full rounded-2xl bg-zinc-950 text-sm font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] hover:bg-zinc-800">
                {checked && result.ok ? <>Next <ArrowRight className="ml-2 h-5 w-5" /></> : "Check"}
              </Button>
            )}
          </motion.div>
        )}

        {/* TRANSLATE phase */}
        {phase === "Translate" && (
          <motion.div key="translate" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">Now type the English translation.</p>
            <div className="space-y-3">
              <motion.div animate={shakeControls}>
                <Input ref={enInputRef}
                  className={cn(
                    "h-14 rounded-2xl border-zinc-200 bg-white px-4 text-center text-base font-bold text-zinc-950 transition-all placeholder:text-zinc-400",
                    enChecked && enResult.ok  ? "border-emerald-300 bg-emerald-50" :
                    enChecked && !enResult.ok ? "border-rose-300 bg-rose-50" :
                                                "focus:border-[var(--accent)]"
                  )}
                  placeholder="Type the English meaning..."
                  value={enInput}
                  onChange={e => { setEnInput(e.target.value); if (enChecked) setEnChecked(false); }}
                  onKeyDown={e => e.key === "Enter" && (enChecked && enResult.ok ? finishOrFrench() : checkEnAnswer())}
                  disabled={enChecked && enResult.ok}
                />
              </motion.div>
            </div>
            <AnimatePresence>
              {enChecked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("rounded-lg border p-5 text-center space-y-2",
                    enResult.ok ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10")}>
                  {enResult.ok ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                      <CheckCircle2 className="h-5 w-5" /> That's it!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-rose-700 font-semibold">Not quite</div>
                      <div className="text-xs text-zinc-500">Answer: <span className="text-zinc-950 font-semibold">{displayEnglish}</span></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {enChecked && !enResult.ok ? (
              <div className="flex gap-3">
                <Button onClick={retryEn} variant="outline"
                  className="h-14 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Try again
                </Button>
                <Button onClick={onNext}
                  className="h-14 flex-1 rounded-2xl bg-zinc-100 font-black text-zinc-700 hover:bg-zinc-200">
                  Skip
                </Button>
              </div>
            ) : (
              <Button onClick={enChecked && enResult.ok ? finishOrFrench : checkEnAnswer}
                className="h-14 w-full rounded-2xl bg-zinc-950 text-sm font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] hover:bg-zinc-800">
                {enChecked && enResult.ok ? <>{hasFr ? "Next: French" : "Continue"} <ArrowRight className="ml-2 h-5 w-5" /></> : "Check"}
              </Button>
            )}
          </motion.div>
        )}

        {/* FRENCH phase (companion language) */}
        {phase === "French" && (
          <motion.div key="french" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-4">
            <p className="text-center text-sm font-semibold text-zinc-500">Now type the same sentence in French.</p>
            <div className="space-y-3">
              <motion.div animate={shakeControls}>
                <Input ref={frInputRef}
                  className={cn(
                    "h-14 rounded-2xl border-zinc-200 bg-white px-4 text-center text-base font-bold text-zinc-950 transition-all placeholder:text-zinc-400",
                    frChecked && frResult.ok  ? "border-emerald-300 bg-emerald-50" :
                    frChecked && !frResult.ok ? "border-rose-300 bg-rose-50" :
                                                "focus:border-[var(--accent)]"
                  )}
                  placeholder="Type it in French..."
                  value={frInput}
                  onChange={e => { setFrInput(e.target.value); if (frChecked) setFrChecked(false); }}
                  onKeyDown={e => e.key === "Enter" && (frChecked && frResult.ok ? onNext() : checkFrAnswer())}
                  disabled={frChecked && frResult.ok}
                />
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
                      <div className="text-rose-700 font-semibold">Not quite</div>
                      <div className="text-xs text-zinc-500">French: <span className="text-zinc-950 font-semibold">{item.fr}</span></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {frChecked && !frResult.ok ? (
              <div className="flex gap-3">
                <Button onClick={retryFr} variant="outline"
                  className="h-14 flex-1 rounded-2xl border-zinc-200 bg-white font-black text-zinc-700 hover:bg-zinc-50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Try again
                </Button>
                <Button onClick={onNext}
                  className="h-14 flex-1 rounded-2xl bg-zinc-100 font-black text-zinc-700 hover:bg-zinc-200">
                  Skip
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => tts(item.fr, 0.82, "fr-FR")}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50">
                  <Volume2 className="h-5 w-5" />
                </motion.button>
                <Button onClick={frChecked && frResult.ok ? onNext : checkFrAnswer}
                  className="h-14 flex-1 rounded-2xl bg-zinc-950 text-sm font-black text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] hover:bg-zinc-800">
                  {frChecked && frResult.ok ? <>Continue <ArrowRight className="ml-2 h-5 w-5" /></> : "Check"}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Section
function DialogueExercise({ dialogue, onNext, onGradeItem }: { dialogue: any; onNext: () => void; onGradeItem?: (itemId: string, grade: "know" | "struggle") => void }) {
  const lines: any[] = dialogue?.lines ?? [];
  const [lineIdx, setLineIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [grade, setGrade] = useState<"know" | "struggle" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const line = lines[lineIdx];
  const isLast = lineIdx >= lines.length - 1;
  const result = useMemo(() => match(input, line?.de ?? ""), [input, line]);
  const companionFr = useMemo(() => getCompanion() === "fr", []);

  useEffect(() => { if (line?.de) tts(line.de); }, [lineIdx]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, [lineIdx]);

  if (!line) { onNext(); return null; }

  const checkLine = () => {
    if (!input.trim() || checked) return;
    setChecked(true);
    tts(line.de);
    if (result.ok) setTimeout(nextLine, 900);
  };

  const nextLine = () => {
    if (isLast) { onNext(); return; }
    setLineIdx(i => i + 1);
    setInput("");
    setChecked(false);
    setGrade(null);
  };

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (!event.altKey || isTyping) return;

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-2xl">
      <div className="text-center space-y-1">
        <Badge variant="outline" className="rounded-full border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-pink-300">
          <MessageSquareQuote className="mr-1.5 h-3 w-3" /> {dialogue.title}
        </Badge>
        <div className="text-xs text-zinc-600">{lineIdx + 1} / {lines.length}</div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            aria-label="Mark known and skip this line. Shortcut Alt K"
            className="grade-btn grade-btn-known"
            onClick={markKnown}
            type="button"
          >
            Know it
            <kbd className="grade-kbd">Alt K</kbd>
          </button>
          <button
            aria-label="Mark this line as a struggle. Shortcut Alt S"
            className="grade-btn grade-btn-struggle"
            onClick={markStruggle}
            type="button"
          >
            Struggle
            <kbd className="grade-kbd">Alt S</kbd>
          </button>
        </div>
      </div>

      {/* Conversation so far */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {lines.slice(0, lineIdx).map((l: any, i: number) => (
          <div key={i} className={cn("flex gap-3", l.speaker === "B" && "flex-row-reverse")}>
            <div className="h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-semibold text-zinc-500 shrink-0">{l.speaker}</div>
            <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5 space-y-0.5",
              l.speaker === "A" ? "bg-white border border-zinc-200" : "bg-zinc-50 border border-zinc-200")}>
              <div className="text-sm font-bold text-zinc-950">{l.de}</div>
              {companionFr && l.fr && <div className="text-sm font-bold text-[var(--accent)]">{l.fr}</div>}
              <div className="text-xs text-zinc-500">{l.en}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Current line to type */}
      <div className={cn("rounded-lg border p-6 space-y-3",
        line.speaker === "A" ? "border-zinc-200 bg-white" : "border-zinc-200 bg-white")}>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-semibold text-zinc-400">{line.speaker}</div>
          <div className="flex-1">
            <div className="text-base text-zinc-500 italic">{line.en}</div>
            {companionFr && line.fr && (
              <div className="mt-0.5 text-sm font-bold text-[var(--accent)]">
                <span className="mr-1.5 text-[10px] font-black uppercase tracking-wide text-zinc-400">FR</span>
                {line.fr}
              </div>
            )}
          </div>
          <button onClick={() => tts(line.de)} className="ml-auto text-zinc-600 hover:text-zinc-950 transition-colors">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <Input ref={inputRef}
          className={cn("h-12 text-base font-bold rounded-lg border-zinc-200 bg-white px-5 text-zinc-950 transition-all placeholder:text-zinc-400",
            checked && result.ok ? "border-emerald-500/40" : checked ? "border-rose-500/40" : "focus:border-[var(--accent)]")}
          placeholder="Type this line..."
          value={input}
          onChange={e => { setInput(e.target.value); if (checked) setChecked(false); }}
          onKeyDown={e => e.key === "Enter" && (checked && result.ok ? nextLine() : checkLine())}
          disabled={checked && result.ok}
        />
        <CharBar onInsert={c => insertAt(inputRef.current, c, setInput)} />
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-lg border p-4 text-center",
              result.ok ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700" : "border-rose-500/20 bg-rose-500/10 text-rose-700")}>
            {result.ok ? <span className="font-semibold text-sm">Spot on!</span>
              : <div className="space-y-1"><div className="font-semibold text-sm">Not quite</div><div className="text-xs text-zinc-400">{line.de}</div></div>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {checked && !result.ok && (
          <Button onClick={() => { setInput(""); setChecked(false); }} variant="outline"
            className="flex-1 h-12 rounded-lg border-zinc-200 bg-white text-zinc-700 font-semibold">
            <RotateCcw className="mr-2 h-4 w-4" /> Retry
          </Button>
        )}
        <Button onClick={checked && result.ok ? nextLine : checkLine}
          className={cn("flex-1 h-12 rounded-lg text-sm font-semibold transition-all",
            checked && result.ok ? "bg-zinc-950 text-white"
            : "bg-zinc-950 text-white")}>
          {checked && result.ok ? (isLast ? "Done" : "Next line") : "Check"}
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
function CompleteScreen({ onNext }: { onNext: () => void }) {
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
      className="fixed inset-0 z-[600] flex items-center justify-center bg-zinc-50/95 p-6 backdrop-blur-sm"
    >
      <Card className="w-full max-w-lg space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center space-y-1">
          <div className="text-2xl"></div>
          <div className="text-xl font-semibold text-zinc-950">Quick reflection</div>
          <div className="text-xs text-zinc-500">
            {stepsCompleted} of {totalSteps} steps done - takes 30 seconds
          </div>
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">How did it feel?</div>
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
                <div className="text-[9px] font-semibold uppercase tracking-wide mt-0.5">{m.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* What went well */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            What clicked today?
          </label>
          <textarea
            value={wentWell}
            onChange={e => setWentWell(e.target.value)}
            placeholder="e.g. the cafe dialogue felt natural, articles are making more sense..."
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Struggling */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Any words or phrases giving you trouble?
          </label>
          <textarea
            value={struggling}
            onChange={e => setStruggling(e.target.value)}
            placeholder="e.g. Wochenende, separable verbs, der/die/das..."
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={onDone} variant="ghost"
            className="h-12 flex-1 rounded-lg border border-zinc-200 bg-white text-xs font-semibold uppercase text-zinc-500 hover:bg-zinc-50">
            Skip
          </Button>
          <Button onClick={save} disabled={saved}
            className="h-12 flex-1 rounded-lg bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800">
            {saved ? "Saved" : "Save & exit"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Section
export default function GuidedSession({ steps, onComplete, onCancel, onGradeItem }: any) {
  const [index, setIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [praise, setPraise] = useState<{ id: number; text: string } | null>(null);
  const comboRef = useRef(0);
  const praiseId = useRef(0);

  const registerAnswer = (ok: boolean) => {
    if (ok) {
      const n = comboRef.current + 1;
      comboRef.current = n;
      setCombo(n);
      playCorrect();
      if (n === 3 || n === 5 || n === 10 || (n > 10 && n % 5 === 0)) {
        const id = ++praiseId.current;
        setPraise({ id, text: `🔥 ${n} in a row!` });
        setTimeout(() => setPraise((p) => (p && p.id === id ? null : p)), 1500);
      }
    } else {
      comboRef.current = 0;
      setCombo(0);
      playWrong();
    }
  };

  const safeSteps = Array.isArray(steps) && steps.length > 0 ? steps : [{ type: "complete" }];
  const step = safeSteps[Math.min(index, safeSteps.length - 1)];
  const progress = safeSteps.length > 1 ? Math.round((index / (safeSteps.length - 1)) * 100) : 100;
  const next = () => { if (index < safeSteps.length - 1) setIndex(i => i + 1); else onComplete(); };

  const handleCancel = () => onCancel(index);
  const skipStep = () => next();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.key !== "ArrowRight") return;
      event.preventDefault();
      skipStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, safeSteps.length]);

  const kind: string = step?.type || step?.kind || "complete";

  return (
    <div className="guided-session fixed inset-0 z-[500] flex flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-950 selection:bg-[var(--accent-dim)]">

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Lesson</div>
            <div className="text-base font-semibold tracking-tight text-zinc-950">
              {index + 1} <span className="text-zinc-500">of {steps.length}</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <span>Progress</span><span className="text-zinc-700">{progress}%</span>
          </div>
          <Progress value={progress} variant="teal" className="h-1.5" />
        </div>
        {import.meta.env.DEV && (
          <Button variant="ghost" onClick={skipStep}
            className="skip-step-btn">
            <span>Skip</span>
            <kbd>Alt →</kbd>
          </Button>
        )}
        <Button variant="ghost" onClick={handleCancel}
          className="h-9 shrink-0 rounded-lg px-3 text-zinc-500 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-900 hover:shadow-[0_0_8px_0_rgba(161,161,170,0.6)]">
          <X className="h-3.5 w-3.5" />
        </Button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div key={index}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full max-w-4xl justify-center">
            <Card className="relative w-full overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_22px_60px_rgba(25,27,38,0.08)] sm:p-7">
              <div className="relative z-10 flex flex-col items-center">
                {kind === "sentence"  && <SentenceExercise item={step.item} onGradeItem={onGradeItem} onNext={next} onAnswer={registerAnswer} />}
                {kind === "dialogue"  && <DialogueExercise dialogue={step.dialogue} onGradeItem={onGradeItem} onNext={next} />}
                {kind === "complete"  && <CompleteScreen onNext={onComplete} />}
                {!["sentence","dialogue","complete"].includes(kind) && (
                  <div className="py-12 text-center space-y-4">
                    <div className="text-4xl font-semibold tracking-tight text-zinc-950">{step.item?.de ?? ""}</div>
                    <Button onClick={next} className="h-12 rounded-lg bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Combo streak chip */}
      <AnimatePresence>
        {combo >= 2 && (
          <motion.div
            key="combo-chip"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-24 z-30 -translate-x-1/2"
          >
            <motion.div
              key={combo}
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 12 }}
              className="rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-black text-white shadow-[0_8px_22px_rgba(120,52,247,0.45)]"
            >
              🔥 {combo} combo
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone praise pop */}
      <AnimatePresence>
        {praise && (
          <motion.div
            key={praise.id}
            initial={{ opacity: 0, y: 10, scale: 0.6 }}
            animate={{ opacity: 1, y: -44, scale: 1 }}
            exit={{ opacity: 0, y: -70 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/3 z-40 -translate-x-1/2 text-3xl font-black text-[var(--accent)] drop-shadow-[0_2px_10px_rgba(120,52,247,0.4)]"
          >
            {praise.text}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}



