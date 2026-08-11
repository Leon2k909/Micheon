import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Headphones, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import { loadGradeStore } from "@/lib/activity";
import {
  buildListenQueue,
  getListenGermanRepeats,
  recordListenGrade,
  setListenGermanRepeats,
  type ListenItem,
} from "@/lib/listenMode";
import { stopTts, ttsSequence, TTS_SPEAKING_EVENT } from "@/lib/voice";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import type { UserProfile } from "@/lib/profileStorage";

/**
 * Listen: both languages on screen and read aloud, hands-free.
 *
 * This is the "I'm cooking / walking / gaming" companion to the guided
 * session: German spoken first (twice by default — the ear needs the second
 * pass), then the English, then on to the next item automatically. The
 * queue is prioritised like a lesson (due, struggling, new, then known)
 * but grading here is deliberately damped — see lib/listenMode.ts. The
 * learner can still press Know it / Struggle and the trackers record the
 * exposure, but Continue Learning keeps introducing these items as if they
 * were fresh, because hearing a sentence is not spelling it.
 */
export function ListenView({ apiParts, profile }: {
  apiParts: Record<string, any>;
  profile: UserProfile | null;
}) {
  // A snapshot, on purpose: grading mid-session must not reshuffle the
  // running order under the listener.
  const queue = useMemo<ListenItem[]>(
    () => buildListenQueue(apiParts, loadGradeStore(profile)),
    [apiParts, profile]
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [repeats, setRepeats] = useState(() => getListenGermanRepeats());
  const [graded, setGraded] = useState<"know" | "difficult" | null>(null);
  // Stale-completion guard: every (re)start bumps this; a finished sequence
  // only advances if nothing newer superseded it.
  const runRef = useRef(0);
  // A grade deliberately pauses for a beat before moving on. Keep that
  // transition cancellable so a double-click or an immediate prev/next click
  // cannot queue two advances and silently skip a card.
  const gradeAdvanceTimerRef = useRef<number | null>(null);

  const item = queue.length ? queue[index % queue.length] : null;
  const englishLang = resolveEnglishVariant(getEnglishVariant(profile)) === "british" ? "en-GB" : "en-US";

  useEffect(() => {
    if (!playing || !item) return undefined;
    const run = ++runRef.current;
    let advanceTimer: number | null = null;
    let heardSpeech = false;
    const markSpeechStarted = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail === true) heardSpeech = true;
    };
    window.addEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);

    const sequence = [
      ...Array.from({ length: repeats }, () => ({ text: item.de, rate: 0.92, lang: "de-DE" })),
      { text: item.en, rate: 0.95, lang: englishLang },
    ];
    void ttsSequence(sequence).then(() => {
      window.removeEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);
      if (runRef.current !== run) return;
      // Muted or broken audio never emits a real playback start. Advancing in
      // that state turns "play" into a silent carousel racing through cards.
      // Use the actual signal rather than elapsed time: a short cached word is
      // still valid audio and must not be mistaken for a failed sequence.
      if (!heardSpeech) {
        setPlaying(false);
        return;
      }
      advanceTimer = window.setTimeout(() => {
        if (runRef.current !== run) return;
        setGraded(null);
        setIndex((current) => (current + 1) % Math.max(1, queue.length));
      }, 1100);
    });

    return () => {
      window.removeEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);
      if (advanceTimer != null) window.clearTimeout(advanceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, repeats, item?.id]);

  useEffect(() => () => {
    runRef.current += 1;
    if (gradeAdvanceTimerRef.current != null) {
      window.clearTimeout(gradeAdvanceTimerRef.current);
      gradeAdvanceTimerRef.current = null;
    }
    stopTts();
  }, []);

  const cancelGradeAdvance = () => {
    if (gradeAdvanceTimerRef.current == null) return;
    window.clearTimeout(gradeAdvanceTimerRef.current);
    gradeAdvanceTimerRef.current = null;
  };

  const pause = () => {
    runRef.current += 1;
    stopTts();
    setPlaying(false);
  };

  const step = (direction: 1 | -1) => {
    cancelGradeAdvance();
    runRef.current += 1;
    stopTts();
    setGraded(null);
    setIndex((current) => {
      const length = Math.max(1, queue.length);
      return (current + direction + length) % length;
    });
  };

  const grade = (verdict: "know" | "difficult") => {
    if (!item || gradeAdvanceTimerRef.current != null) return;
    recordListenGrade(item, verdict, profile);
    setGraded(verdict);
    // Move on right away — the grade was the learner saying "next".
    runRef.current += 1;
    stopTts();
    gradeAdvanceTimerRef.current = window.setTimeout(() => {
      gradeAdvanceTimerRef.current = null;
      setGraded(null);
      setIndex((current) => (current + 1) % Math.max(1, queue.length));
    }, 350);
  };

  const chooseRepeats = (count: number) => {
    setListenGermanRepeats(count);
    setRepeats(count);
  };

  if (!item) {
    return (
      <section className="card p-6 text-center">
        <Headphones className="mx-auto h-8 w-8 text-[var(--text-3)]" />
        <p className="mt-3 text-sm font-black text-[var(--text-1)]">{ui("Nothing to listen to yet")}</p>
        <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
          {ui("Once the course content is loaded, everything you are learning becomes listenable here.")}
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Listen")}</h1>
              <p className="text-xs font-semibold text-[var(--text-3)]">
                {ui("Both languages read aloud while you do something else.")}
              </p>
            </div>
          </div>
          <div aria-label={ui("How often the German is spoken")} className="flex items-center gap-1" role="radiogroup">
            {[1, 2, 3].map((count) => (
              <button
                aria-checked={repeats === count}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-black transition-colors",
                  repeats === count
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                )}
                key={count}
                onClick={() => chooseRepeats(count)}
                role="radio"
                type="button"
              >
                {count}× {ui("German")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-[var(--surface-2)] p-6 text-center sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
            {ui(item.kind === "word" ? "Word" : "Sentence")} · {(index % queue.length) + 1} / {queue.length}
          </p>
          <p className="mt-4 text-2xl font-black leading-snug tracking-tight text-[var(--text-1)] sm:text-3xl" lang="de">
            {item.de}
          </p>
          <p className="mt-3 text-base font-bold leading-relaxed text-[var(--text-2)]" lang="en">
            {item.en}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button aria-label={ui("Back")} className="ghost-btn h-11 w-11" onClick={() => step(-1)} type="button">
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
          {playing ? (
            <button className="accent-btn inline-flex h-11 items-center gap-2 px-6" onClick={pause} type="button">
              <Pause className="h-4 w-4" /> {ui("Pause")}
            </button>
          ) : (
            <button className="accent-btn inline-flex h-11 items-center gap-2 px-6" onClick={() => setPlaying(true)} type="button">
              <Play className="h-4 w-4" /> {ui("Play audio")}
            </button>
          )}
          <button aria-label={ui("Next")} className="ghost-btn h-11 w-11" onClick={() => step(1)} type="button">
            <ChevronRight className="mx-auto h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-black transition-colors",
              graded === "know"
                ? "bg-emerald-500 text-white"
                : "bg-emerald-500/12 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
            )}
            onClick={() => grade("know")}
            type="button"
          >
            <Check className="h-4 w-4" /> {ui("Know it")}
          </button>
          <button
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-black transition-colors",
              graded === "difficult"
                ? "bg-rose-500 text-white"
                : "bg-rose-500/12 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
            )}
            onClick={() => grade("difficult")}
            type="button"
          >
            <X className="h-4 w-4" /> {ui("Struggle")}
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] font-semibold leading-relaxed text-[var(--text-3)]">
          {ui("Listening counts as exposure, not mastery — these items still appear in your lessons, because hearing a sentence is not spelling it.")}
        </p>
      </section>
    </div>
  );
}
