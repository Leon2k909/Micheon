import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gauge,
  Headphones,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ui, uiFmt } from "@/lib/i18n";
import { loadGradeStore } from "@/lib/activity";
import {
  AUDIO_SETTINGS_EVENT,
  getAudioSettings,
  isMasterAudioSilent,
  setMasterAudioVolume,
  setTtsLanguageVolume,
  setTtsSpeechRate,
  toggleAudioMuted,
  toggleTtsLanguageMuted,
  TTS_SPEED_PRESETS,
  type AudioSettings,
} from "@/lib/audioMute";
import {
  buildListenQueue,
  getListenEnglishRepeats,
  getListenGermanRepeats,
  getListenLanguageOrder,
  getListenNextCardDelayMs,
  recordListenGrade,
  setListenEnglishRepeats,
  setListenGermanRepeats,
  setListenLanguageOrder,
  setListenNextCardDelayMs,
  setListenReviewLevel,
  snoozeListenItem,
  type ListenItem,
  type ListenLanguageOrder,
  type ListenReviewLevel,
} from "@/lib/listenMode";
import { stopTts, ttsSequence, TTS_SPEAKING_EVENT } from "@/lib/voice";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import type { UserProfile } from "@/lib/profileStorage";
import type { LearningDirection } from "@/lib/direction";

const REVIEW_LEVELS: Array<{ value: ListenReviewLevel; label: string; note: string }> = [
  { value: "new", label: "New", note: "Starts over from the beginning" },
  { value: "struggle", label: "Struggling", note: "Comes back as soon as there is a slot" },
  { value: 1, label: "Not confident", note: "Comes back soon, often within a day" },
  { value: 2, label: "Familiar", note: "About 3 days away, sooner if you slip" },
  { value: 3, label: "Strong", note: "About 10 days away, sooner if you slip" },
  { value: 4, label: "Solid", note: "About 30 days away, sooner if you slip" },
  { value: 5, label: "Mastered", note: "About 180 days away, sooner if you slip" },
  { value: "permanent", label: "Never review", note: "Never comes back at all" },
];

const SNOOZE_CHOICES = [
  { days: 1, label: "Tomorrow", note: "Nothing brings it back today" },
  { days: 3, label: "In 3 days", note: "Held back until then" },
  { days: 7, label: "In a week", note: "Held back until then" },
  { days: 30, label: "In a month", note: "Held back until then" },
] as const;

function VolumeGlyph({ muted, volume, className }: { muted: boolean; volume: number; className?: string }) {
  if (muted || volume <= 0) return <VolumeX className={className} />;
  if (volume < 0.55) return <Volume1 className={className} />;
  return <Volume2 className={className} />;
}

function ListenVolumeRow({
  label,
  value,
  muted,
  muteLabel,
  unmuteLabel,
  onToggleMuted,
  onChange,
  testId,
}: {
  label: string;
  value: number;
  muted: boolean;
  muteLabel: string;
  unmuteLabel: string;
  onToggleMuted: () => void;
  onChange: (value: number) => void;
  testId: string;
}) {
  const percent = Math.round(value * 100);
  return (
    <div className="audio-mixer-row !px-0">
      <div className="audio-mixer-rowhead">
        <span>{label}</span>
        <strong>{muted ? ui("Muted") : `${percent}%`}</strong>
      </div>
      <div className="audio-mixer-controls">
        <button
          aria-label={muted ? unmuteLabel : muteLabel}
          aria-pressed={muted}
          className={cn("audio-mixer-mute", muted && "is-muted")}
          data-testid={`${testId}-mute`}
          onClick={onToggleMuted}
          type="button"
        >
          <VolumeGlyph className="h-4 w-4" muted={muted} volume={value} />
        </button>
        <input
          aria-label={label}
          aria-valuetext={muted ? ui("Muted") : `${percent}%`}
          className="audio-mixer-range"
          data-testid={`${testId}-volume`}
          max="100"
          min="0"
          onChange={(event) => onChange(Number(event.target.value) / 100)}
          step="1"
          type="range"
          value={percent}
        />
      </div>
    </div>
  );
}

function NumberSetting({
  label,
  note,
  value,
  min,
  max,
  step = 1,
  suffix,
  onCommit,
  testId,
}: {
  label: string;
  note: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onCommit: (value: number) => number;
  testId: string;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const parsed = Number(draft);
    const next = onCommit(Number.isFinite(parsed) ? parsed : value);
    setDraft(String(next));
  };

  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <span className="min-w-0">
        <strong className="block text-sm font-black text-[var(--text-1)]">{label}</strong>
        <small className="mt-0.5 block text-[11px] font-semibold leading-snug text-[var(--text-3)]">{note}</small>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <input
          className="h-10 w-[72px] rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-2 text-center text-sm font-black text-[var(--text-1)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
          data-testid={testId}
          inputMode="decimal"
          max={max}
          min={min}
          onBlur={commit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
              event.currentTarget.blur();
            }
          }}
          step={step}
          type="number"
          value={draft}
        />
        <span className="w-8 text-xs font-black text-[var(--text-3)]">{suffix}</span>
      </span>
    </label>
  );
}

/**
 * Listen is the hands-free companion to guided lessons. By default it reads
 * English once, then German twice, and advances after a configurable pause.
 * Learners can reverse that language order. Passive Know it / Struggle marks
 * remain deliberately damped; the explicit level picker is the place for a
 * strong tracker correction.
 */
export function ListenView({ apiParts, learningDirection, profile }: {
  apiParts: Record<string, any>;
  learningDirection: LearningDirection;
  profile: UserProfile | null;
}) {
  const baseQueue = useMemo<ListenItem[]>(
    () => buildListenQueue(apiParts, loadGradeStore(profile)),
    [apiParts, profile]
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());
  const queue = useMemo(
    () => baseQueue.filter((candidate) => !hiddenIds.has(candidate.id)),
    [baseQueue, hiddenIds]
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [germanRepeats, setGermanRepeats] = useState(() => getListenGermanRepeats(learningDirection));
  const [englishRepeats, setEnglishRepeats] = useState(() => getListenEnglishRepeats(learningDirection));
  const [languageOrder, setLanguageOrder] = useState(() => getListenLanguageOrder(learningDirection));
  const [nextCardDelayMs, setNextCardDelayMs] = useState(getListenNextCardDelayMs);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(getAudioSettings);
  const [graded, setGraded] = useState<"know" | "difficult" | null>(null);
  const [reviewPanel, setReviewPanel] = useState<"level" | "snooze" | null>(null);
  const [reviewNotice, setReviewNotice] = useState("");
  const runRef = useRef(0);
  const gradeAdvanceTimerRef = useRef<number | null>(null);

  const item = queue.length ? queue[index % queue.length] : null;
  const englishLang = resolveEnglishVariant(getEnglishVariant(profile)) === "british" ? "en-GB" : "en-US";
  const masterMuted = isMasterAudioSilent(audioSettings);
  const englishMuted = audioSettings.englishMuted || audioSettings.englishVolume <= 0;
  const germanMuted = audioSettings.germanMuted || audioSettings.germanVolume <= 0;

  useEffect(() => {
    runRef.current += 1;
    stopTts();
    setPlaying(false);
    setGermanRepeats(getListenGermanRepeats(learningDirection));
    setEnglishRepeats(getListenEnglishRepeats(learningDirection));
    setLanguageOrder(getListenLanguageOrder(learningDirection));
  }, [learningDirection]);

  useEffect(() => {
    setHiddenIds(new Set());
    setIndex(0);
  }, [apiParts, profile?.id]);

  useEffect(() => {
    const sync = () => setAudioSettings(getAudioSettings());
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!reviewNotice) return undefined;
    const timer = window.setTimeout(() => setReviewNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [reviewNotice]);

  useEffect(() => {
    if (!playing || !item) return undefined;
    const run = ++runRef.current;
    let advanceTimer: number | null = null;
    let heardSpeech = false;
    const markSpeechStarted = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail === true) heardSpeech = true;
    };
    window.addEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);

    const germanSequence = Array.from(
      { length: germanRepeats },
      () => ({ text: item.de, rate: 0.92, lang: "de-DE" })
    );
    const englishSequence = Array.from(
      { length: englishRepeats },
      () => ({ text: item.en, rate: 0.95, lang: englishLang })
    );
    const sequence = languageOrder === "english-first"
      ? [...englishSequence, ...germanSequence]
      : [...germanSequence, ...englishSequence];
    void ttsSequence(sequence).then(() => {
      window.removeEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);
      if (runRef.current !== run) return;
      if (!heardSpeech) {
        setPlaying(false);
        return;
      }
      advanceTimer = window.setTimeout(() => {
        if (runRef.current !== run) return;
        setGraded(null);
        setIndex((current) => (current + 1) % Math.max(1, queue.length));
      }, nextCardDelayMs);
    });

    return () => {
      window.removeEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);
      if (advanceTimer != null) window.clearTimeout(advanceTimer);
      stopTts();
    };
  }, [playing, index, germanRepeats, englishRepeats, languageOrder, nextCardDelayMs, item?.id, englishLang, queue.length]);

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
    setReviewPanel(null);
    setIndex((current) => {
      const length = Math.max(1, queue.length);
      return (current + direction + length) % length;
    });
  };

  const grade = (verdict: "know" | "difficult") => {
    if (!item || gradeAdvanceTimerRef.current != null) return;
    recordListenGrade(item, verdict, profile);
    setGraded(verdict);
    runRef.current += 1;
    stopTts();
    gradeAdvanceTimerRef.current = window.setTimeout(() => {
      gradeAdvanceTimerRef.current = null;
      setGraded(null);
      setIndex((current) => (current + 1) % Math.max(1, queue.length));
    }, 350);
  };

  const applyReviewLevel = (level: ListenReviewLevel, label: string) => {
    if (!item) return;
    setListenReviewLevel(item, level, profile);
    setReviewNotice(uiFmt("Set to {level}.", { level: ui(label) }));
    setReviewPanel(null);
  };

  const putOff = (days: number, label: string) => {
    if (!item) return;
    cancelGradeAdvance();
    snoozeListenItem(item, days, profile);
    setReviewNotice(uiFmt("Put off until {when}.", { when: ui(label) }));
    setReviewPanel(null);
    setHiddenIds((current) => new Set(current).add(item.id));
  };

  const commitGermanRepeats = (count: number) => {
    const next = setListenGermanRepeats(count, learningDirection);
    setGermanRepeats(next);
    return next;
  };

  const commitEnglishRepeats = (count: number) => {
    const next = setListenEnglishRepeats(count, learningDirection);
    setEnglishRepeats(next);
    return next;
  };

  const chooseLanguageOrder = (order: ListenLanguageOrder) => {
    setLanguageOrder(setListenLanguageOrder(order, learningDirection));
  };

  const commitDelaySeconds = (seconds: number) => {
    const nextMs = setListenNextCardDelayMs(seconds * 1000);
    setNextCardDelayMs(nextMs);
    return nextMs / 1000;
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
    <div className="mx-auto w-full max-w-5xl space-y-4">
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
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-black text-[var(--text-2)]">
            {languageOrder === "english-first"
              ? uiFmt("English {en}×, then German {de}×", { de: germanRepeats, en: englishRepeats })
              : uiFmt("German {de}×, then English {en}×", { de: germanRepeats, en: englishRepeats })}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface-2)] p-6 text-center shadow-[0_5px_0_var(--border)] sm:p-10">
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

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button aria-label={ui("Back")} className="ghost-btn h-11 w-11" onClick={() => step(-1)} type="button">
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
          {playing ? (
            <button className="listen-play-button inline-flex h-11 min-w-40 items-center justify-center gap-2 px-6" onClick={pause} type="button">
              <Pause className="h-4 w-4" /> {ui("Pause")}
            </button>
          ) : (
            <button className="listen-play-button inline-flex h-11 min-w-40 items-center justify-center gap-2 px-6" onClick={() => setPlaying(true)} type="button">
              <Play className="h-4 w-4" /> {ui("Play audio")}
            </button>
          )}
          <button aria-label={ui("Next")} className="ghost-btn h-11 w-11" onClick={() => step(1)} type="button">
            <ChevronRight className="mx-auto h-5 w-5" />
          </button>
        </div>

        {(masterMuted || englishMuted || germanMuted) && (
          <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-xs font-bold text-amber-800 dark:text-amber-200" role="status">
            {ui(masterMuted
              ? "All app audio is muted. Use the sliders below to turn it back on."
              : englishMuted && germanMuted
                ? "Both language voices are muted and will be skipped."
                : englishMuted
                  ? "English voice is muted and will be skipped."
                  : "German voice is muted and will be skipped.")}
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5" aria-labelledby="listen-pattern-heading">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--text-1)]" id="listen-pattern-heading">{ui("Playback pattern")}</h2>
                <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">{ui("Type how many times each language should be spoken.")}</p>
              </div>
            </div>
            <fieldset className="mt-4">
              <legend className="text-xs font-black text-[var(--text-2)]">{ui("Language order")}</legend>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">
                {ui("Choose which language is spoken first.")}
              </p>
              <div
                aria-label={ui("Language order")}
                className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-1.5"
                role="radiogroup"
              >
                {([
                  ["english-first", "English first"],
                  ["german-first", "German first"],
                ] as const).map(([value, label]) => {
                  const active = languageOrder === value;
                  return (
                    <button
                      aria-checked={active}
                      className={cn(
                        "min-h-10 rounded-xl border px-3 py-2 text-xs font-black transition-[background-color,border-color,color,transform,box-shadow] duration-150",
                        active
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_3px_0_var(--accent-dark)]"
                          : "border-transparent bg-transparent text-[var(--text-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                      )}
                      data-testid={`listen-order-${value}`}
                      key={value}
                      onClick={() => chooseLanguageOrder(value)}
                      role="radio"
                      type="button"
                    >
                      {ui(label)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="mt-4 space-y-2">
              <NumberSetting
                label={ui("German repeats")}
                max={10}
                min={1}
                note={ui("Times spoken on every card")}
                onCommit={commitGermanRepeats}
                suffix="×"
                testId="listen-german-repeats"
                value={germanRepeats}
              />
              <NumberSetting
                label={ui("English repeats")}
                max={10}
                min={1}
                note={ui("Times spoken on every card")}
                onCommit={commitEnglishRepeats}
                suffix="×"
                testId="listen-english-repeats"
                value={englishRepeats}
              />
              <NumberSetting
                label={ui("Next card delay")}
                max={30}
                min={0}
                note={ui("Pause after both languages finish")}
                onCommit={commitDelaySeconds}
                step={0.1}
                suffix={ui("sec")}
                testId="listen-next-card-delay"
                value={nextCardDelayMs / 1000}
              />
            </div>
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-black text-[var(--text-2)]">
                  <Gauge className="h-4 w-4 text-[var(--accent)]" /> {ui("Speech speed")}
                </span>
                <strong className="text-xs font-black text-[var(--text-3)]">{audioSettings.speechRate}×</strong>
              </div>
              <div className="audio-mixer-speed" data-testid="listen-speech-speed">
                {TTS_SPEED_PRESETS.map((preset) => (
                  <button
                    aria-pressed={Math.abs(audioSettings.speechRate - preset) < 0.01}
                    className={cn("audio-mixer-speed-chip", Math.abs(audioSettings.speechRate - preset) < 0.01 && "is-active")}
                    key={preset}
                    onClick={() => setTtsSpeechRate(preset)}
                    type="button"
                  >
                    {preset}×
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5" aria-labelledby="listen-volume-heading">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--text-1)]" id="listen-volume-heading">{ui("Voice levels")}</h2>
                <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">{ui("Always visible here and saved automatically.")}</p>
              </div>
            </div>
            <div className="mt-3">
              <ListenVolumeRow
                label={ui("Master volume")}
                muteLabel={ui("Mute all audio")}
                muted={masterMuted}
                onChange={setMasterAudioVolume}
                onToggleMuted={toggleAudioMuted}
                testId="listen-master"
                unmuteLabel={ui("Unmute all audio")}
                value={audioSettings.masterVolume}
              />
              <ListenVolumeRow
                label={ui("German voice")}
                muteLabel={ui("Mute German voice")}
                muted={germanMuted}
                onChange={(value) => setTtsLanguageVolume("german", value)}
                onToggleMuted={() => toggleTtsLanguageMuted("german")}
                testId="listen-german"
                unmuteLabel={ui("Unmute German voice")}
                value={audioSettings.germanVolume}
              />
              <ListenVolumeRow
                label={ui("English voice")}
                muteLabel={ui("Mute English voice")}
                muted={englishMuted}
                onChange={(value) => setTtsLanguageVolume("english", value)}
                onToggleMuted={() => toggleTtsLanguageMuted("english")}
                testId="listen-english"
                unmuteLabel={ui("Unmute English voice")}
                value={audioSettings.englishVolume}
              />
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-[22px] border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5" aria-labelledby="listen-review-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[var(--text-1)]" id="listen-review-heading">{ui("Review this item")}</h2>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">{ui("Quick marks stay gentle. Set level makes an exact tracker change.")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-black transition-colors",
                  graded === "know"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/18 dark:text-emerald-300"
                )}
                onClick={() => grade("know")}
                type="button"
              >
                <Check className="h-4 w-4" /> {ui("Know it")}
              </button>
              <button
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-black transition-colors",
                  graded === "difficult"
                    ? "border-rose-500 bg-rose-500 text-white"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/18 dark:text-rose-300"
                )}
                onClick={() => grade("difficult")}
                type="button"
              >
                <X className="h-4 w-4" /> {ui("Struggle")}
              </button>
              <button
                aria-expanded={reviewPanel === "level"}
                className="ghost-btn inline-flex h-11 items-center gap-2 px-4 text-sm font-black"
                onClick={() => setReviewPanel((current) => current === "level" ? null : "level")}
                type="button"
              >
                {ui("Set level")} <ChevronDown className="h-4 w-4" />
              </button>
              <button
                aria-expanded={reviewPanel === "snooze"}
                className="ghost-btn inline-flex h-11 items-center gap-2 px-4 text-sm font-black"
                onClick={() => setReviewPanel((current) => current === "snooze" ? null : "snooze")}
                type="button"
              >
                <CalendarClock className="h-4 w-4" /> {ui("Put off")}
              </button>
            </div>
          </div>

          {reviewPanel === "level" && (
            <div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label={ui("Set review level")}>
              {REVIEW_LEVELS.map((option) => (
                <button
                  className={cn(
                    "rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]",
                    option.value === "struggle" && "hover:border-rose-400 hover:bg-rose-500/10"
                  )}
                  key={String(option.value)}
                  onClick={() => applyReviewLevel(option.value, option.label)}
                  type="button"
                >
                  <strong className="block text-xs font-black text-[var(--text-1)]">{ui(option.label)}</strong>
                  <small className="mt-1 block text-[10px] font-semibold leading-snug text-[var(--text-3)]">{ui(option.note)}</small>
                </button>
              ))}
            </div>
          )}

          {reviewPanel === "snooze" && (
            <div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label={ui("Put off")}>
              {SNOOZE_CHOICES.map((choice) => (
                <button
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]"
                  key={choice.days}
                  onClick={() => putOff(choice.days, choice.label)}
                  type="button"
                >
                  <strong className="block text-xs font-black text-[var(--text-1)]">{ui(choice.label)}</strong>
                  <small className="mt-1 block text-[10px] font-semibold leading-snug text-[var(--text-3)]">{ui(choice.note)}</small>
                </button>
              ))}
            </div>
          )}

          {reviewNotice && (
            <p className="mt-4 rounded-xl bg-[var(--accent-dim)] px-3 py-2 text-center text-xs font-black text-[var(--accent)]" role="status">
              {reviewNotice}
            </p>
          )}
        </section>

        <p className="mt-4 text-center text-[11px] font-semibold leading-relaxed text-[var(--text-3)]">
          {ui("Listening counts as exposure, not mastery. These items still appear in lessons because hearing a sentence is not spelling it.")}
        </p>
      </section>
    </div>
  );
}
