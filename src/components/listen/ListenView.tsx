import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Headphones,
  ListMusic,
  Minimize2,
  Pause,
  Play,
  Repeat2,
  Undo2,
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
  formatListenPetCaption,
  getListenBackgroundPlayback,
  getListenContentSource,
  getListenCurrentItemId,
  getListenEnglishRepeats,
  getListenGermanRepeats,
  getListenLanguageOrder,
  getListenLoopItems,
  getListenLoopPasses,
  getListenNextCardDelayMs,
  getListenPetBilingualCaptions,
  getListenQueueOrder,
  listenLoopPassForPlayhead,
  listenPlayheadForQueueIndex,
  listenQueueIndexForPlayhead,
  recordListenGrade,
  setListenBackgroundPlayback,
  setListenContentSource,
  setListenCurrentItemId,
  setListenEnglishRepeats,
  setListenGermanRepeats,
  setListenLanguageOrder,
  setListenLoopItems,
  setListenLoopPasses,
  setListenNextCardDelayMs,
  setListenPetBilingualCaptions,
  setListenQueueOrder,
  setListenReviewLevel,
  snoozeListenItem,
  undoListenReviewChange,
  type ListenContentSource,
  type ListenItem,
  type ListenLanguageOrder,
  type ListenQueueOrder,
  type ListenReviewChange,
  type ListenReviewLevel,
} from "@/lib/listenMode";
import { stopTts, ttsSequence, TTS_SPEAKING_EVENT } from "@/lib/voice";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import type { UserProfile } from "@/lib/profileStorage";
import type { LearningDirection } from "@/lib/direction";
import { useCodexPets } from "@/components/codexPets/CodexPetProvider";

type ListenMediaCommand = "previous" | "toggle" | "play" | "pause" | "next";

type ListenReviewNotice = {
  message: string;
  undo?: {
    change: ListenReviewChange;
    item: ListenItem;
  };
};

type ListenDesktopApi = {
  onListenMediaCommand?: (callback: (command: ListenMediaCommand) => void) => (() => void);
  setListenMediaState?: (state: {
    available: boolean;
    playing: boolean;
    title?: string;
    subtitle?: string;
  }) => void;
};

const desktop = typeof window !== "undefined"
  ? (window as typeof window & { germDesktop?: ListenDesktopApi }).germDesktop
  : undefined;

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
        <span className="min-w-8 text-xs font-black text-[var(--text-3)]">{suffix}</span>
      </span>
    </label>
  );
}

/**
 * Listen is the hands-free companion to guided lessons. By default it reads
 * English once, then German twice. Items are grouped into short learning loops
 * and revisited before new material arrives; both the group size and number of
 * passes are learner-controlled. Passive Know it / Struggle marks remain
 * deliberately damped; the explicit level picker is the place for a strong
 * tracker correction.
 */
export function ListenView({ active, apiParts, learningDirection, onOpen, profile }: {
  active: boolean;
  apiParts: Record<string, any>;
  learningDirection: LearningDirection;
  onOpen: () => void;
  profile: UserProfile | null;
}) {
  const [contentSource, setContentSource] = useState<ListenContentSource>(
    () => getListenContentSource(learningDirection)
  );
  const [queueOrder, setQueueOrder] = useState<ListenQueueOrder>(
    () => getListenQueueOrder(learningDirection)
  );
  const baseQueue = useMemo<ListenItem[]>(
    () => buildListenQueue(apiParts, loadGradeStore(profile), {
      contentSource,
      direction: learningDirection,
      order: queueOrder,
    }),
    [apiParts, contentSource, learningDirection, profile, queueOrder]
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());
  const queue = useMemo(
    () => baseQueue.filter((candidate) => !hiddenIds.has(candidate.id)),
    [baseQueue, hiddenIds]
  );
  const [loopItems, setLoopItems] = useState(() => getListenLoopItems(learningDirection));
  const [loopPasses, setLoopPasses] = useState(() => getListenLoopPasses(learningDirection));
  const [playhead, setPlayhead] = useState(() => {
    const storedId = getListenCurrentItemId(learningDirection, profile, contentSource, queueOrder);
    const storedIndex = baseQueue.findIndex((candidate) => candidate.id === storedId);
    return listenPlayheadForQueueIndex(
      storedIndex >= 0 ? storedIndex : 0,
      baseQueue.length,
      getListenLoopItems(learningDirection),
      getListenLoopPasses(learningDirection)
    );
  });
  const [playing, setPlaying] = useState(false);
  const [sessionActivated, setSessionActivated] = useState(false);
  const [backgroundPlayback, setBackgroundPlayback] = useState(
    () => getListenBackgroundPlayback(profile)
  );
  const [petBilingualCaptions, setPetBilingualCaptions] = useState(
    () => getListenPetBilingualCaptions(profile)
  );
  const [germanRepeats, setGermanRepeats] = useState(() => getListenGermanRepeats(learningDirection));
  const [englishRepeats, setEnglishRepeats] = useState(() => getListenEnglishRepeats(learningDirection));
  const [languageOrder, setLanguageOrder] = useState(() => getListenLanguageOrder(learningDirection));
  const [nextCardDelayMs, setNextCardDelayMs] = useState(getListenNextCardDelayMs);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(getAudioSettings);
  const [graded, setGraded] = useState<"know" | "difficult" | null>(null);
  const [reviewPanel, setReviewPanel] = useState<"level" | "snooze" | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ListenItem | null>(null);
  const [reviewNotice, setReviewNotice] = useState<ListenReviewNotice | null>(null);
  const runRef = useRef(0);
  const gradeAdvanceTimerRef = useRef<number | null>(null);
  const mediaCommandRef = useRef<(command: ListenMediaCommand) => void>(() => {});
  const {
    selectedKey: selectedPetKey,
    selectedPet,
    speak: petSpeak,
    visibleKeys: visiblePetKeys,
  } = useCodexPets();

  const effectiveLoopItems = Math.min(Math.max(1, queue.length), loopItems);
  const queueIndex = listenQueueIndexForPlayhead(
    playhead,
    queue.length,
    effectiveLoopItems,
    loopPasses
  );
  const loopPass = listenLoopPassForPlayhead(playhead, queue.length, effectiveLoopItems, loopPasses);
  const item = queue.length ? queue[queueIndex] : null;
  const englishLang = resolveEnglishVariant(getEnglishVariant(profile)) === "british" ? "en-GB" : "en-US";
  const masterMuted = isMasterAudioSilent(audioSettings);
  const englishMuted = audioSettings.englishMuted || audioSettings.englishVolume <= 0;
  const germanMuted = audioSettings.germanMuted || audioSettings.germanVolume <= 0;
  const petCaptionsAvailable = Boolean(selectedPet)
    && selectedPetKey !== "off"
    && visiblePetKeys.includes(selectedPetKey);

  useEffect(() => {
    runRef.current += 1;
    stopTts();
    setPlaying(false);
    setSessionActivated(false);
    setGermanRepeats(getListenGermanRepeats(learningDirection));
    setEnglishRepeats(getListenEnglishRepeats(learningDirection));
    setLanguageOrder(getListenLanguageOrder(learningDirection));
    setLoopItems(getListenLoopItems(learningDirection));
    setLoopPasses(getListenLoopPasses(learningDirection));
    setBackgroundPlayback(getListenBackgroundPlayback(profile));
    setPetBilingualCaptions(getListenPetBilingualCaptions(profile));
    setContentSource(getListenContentSource(learningDirection));
    setQueueOrder(getListenQueueOrder(learningDirection));
  }, [learningDirection, profile?.id]);

  useEffect(() => {
    setHiddenIds(new Set());
    const storedId = getListenCurrentItemId(learningDirection, profile, contentSource, queueOrder);
    const storedIndex = baseQueue.findIndex((candidate) => candidate.id === storedId);
    setPlayhead(listenPlayheadForQueueIndex(
      storedIndex >= 0 ? storedIndex : 0,
      baseQueue.length,
      getListenLoopItems(learningDirection),
      getListenLoopPasses(learningDirection)
    ));
  }, [apiParts, baseQueue, contentSource, learningDirection, profile?.id, queueOrder]);

  useEffect(() => {
    if (!item) return;
    setListenCurrentItemId(item.id, learningDirection, profile, contentSource, queueOrder);
  }, [contentSource, item?.id, learningDirection, profile?.id, queueOrder]);

  useEffect(() => {
    const sync = () => setAudioSettings(getAudioSettings());
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!reviewNotice) return undefined;
    const timer = window.setTimeout(() => setReviewNotice(null), reviewNotice.undo ? 8000 : 4500);
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

    const mirrorOnPet = (text: string, voiceLang: "de-DE" | "en-US") => {
      if (!petCaptionsAvailable) return;
      const caption = formatListenPetCaption(item, text, petBilingualCaptions);
      petSpeak(caption, {
        durationMs: Math.max(2600, Math.min(7000, caption.length * 72)),
        mood: "greeting",
        silent: true,
        verbatim: true,
        voiceLang,
      });
    };

    const germanSequence = Array.from(
      { length: germanRepeats },
      () => ({
        text: item.de,
        rate: 0.92,
        lang: "de-DE",
        onStart: () => mirrorOnPet(item.de, "de-DE"),
      })
    );
    const englishSequence = Array.from(
      { length: englishRepeats },
      () => ({
        text: item.en,
        rate: 0.95,
        lang: englishLang,
        onStart: () => mirrorOnPet(item.en, "en-US"),
      })
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
        setPlayhead((current) => current + 1);
      }, nextCardDelayMs);
    });

    return () => {
      window.removeEventListener(TTS_SPEAKING_EVENT, markSpeechStarted);
      if (advanceTimer != null) window.clearTimeout(advanceTimer);
      stopTts();
    };
  }, [playing, playhead, germanRepeats, englishRepeats, languageOrder, nextCardDelayMs, item?.id, englishLang, queue.length, petBilingualCaptions, petCaptionsAvailable, petSpeak]);

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

  const beginPlayback = () => {
    setReviewPanel(null);
    setReviewTarget(null);
    setSessionActivated(true);
    setPlaying(true);
  };

  const step = (direction: 1 | -1) => {
    cancelGradeAdvance();
    runRef.current += 1;
    stopTts();
    setGraded(null);
    setReviewPanel(null);
    setReviewTarget(null);
    setPlayhead((current) => {
      if (direction > 0) return current + 1;
      if (current > 0) return current - 1;
      return listenPlayheadForQueueIndex(
        Math.max(0, queue.length - 1),
        queue.length,
        effectiveLoopItems,
        loopPasses
      );
    });
  };

  const dismissBackgroundPlayer = () => {
    pause();
    setSessionActivated(false);
  };

  mediaCommandRef.current = (command) => {
    if (command === "previous") step(-1);
    else if (command === "next") step(1);
    else if (command === "pause") pause();
    else if (command === "play") beginPlayback();
    else if (playing) pause();
    else beginPlayback();
  };

  useEffect(() => {
    if (active || backgroundPlayback) return;
    pause();
  }, [active, backgroundPlayback]);

  const mediaAvailable = Boolean(item)
    && (active || (backgroundPlayback && sessionActivated));

  useEffect(() => {
    if (!desktop?.onListenMediaCommand) return undefined;
    return desktop.onListenMediaCommand((command) => mediaCommandRef.current(command));
  }, []);

  useEffect(() => {
    desktop?.setListenMediaState?.({
      available: mediaAvailable,
      playing: mediaAvailable && playing,
      title: item?.en,
      subtitle: item?.de,
    });
  }, [item?.de, item?.en, mediaAvailable, playing]);

  useEffect(() => () => {
    desktop?.setListenMediaState?.({ available: false, playing: false });
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return undefined;
    const invoke = (command: ListenMediaCommand) => () => mediaCommandRef.current(command);
    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler | null]> = [
      ["previoustrack", invoke("previous")],
      ["nexttrack", invoke("next")],
      ["play", invoke("play")],
      ["pause", invoke("pause")],
    ];
    handlers.forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* unsupported action */ }
    });
    return () => {
      handlers.forEach(([action]) => {
        try { navigator.mediaSession.setActionHandler(action, null); } catch { /* already gone */ }
      });
    };
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.playbackState = !mediaAvailable
        ? "none"
        : playing ? "playing" : "paused";
      navigator.mediaSession.metadata = mediaAvailable && item && typeof MediaMetadata !== "undefined"
        ? new MediaMetadata({
            album: ui("Listen"),
            artist: item.de,
            artwork: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
            title: item.en,
          })
        : null;
    } catch { /* browser media controls are an enhancement */ }
  }, [item?.de, item?.en, mediaAvailable, playing]);

  const grade = (verdict: "know" | "difficult") => {
    if (!item || gradeAdvanceTimerRef.current != null) return;
    recordListenGrade(item, verdict, profile);
    setGraded(verdict);
    runRef.current += 1;
    stopTts();
    gradeAdvanceTimerRef.current = window.setTimeout(() => {
      gradeAdvanceTimerRef.current = null;
      setGraded(null);
      setPlayhead((current) => current + 1);
    }, 350);
  };

  const openReviewPanel = (panel: "level" | "snooze") => {
    if (reviewPanel === panel) {
      setReviewPanel(null);
      setReviewTarget(null);
      return;
    }
    if (!item) return;
    // A review action must never chase autoplay onto the next card. Stop the
    // current sequence and keep an immutable target until the menu closes.
    cancelGradeAdvance();
    pause();
    setReviewTarget({ ...item, aliases: [...item.aliases] });
    setReviewPanel(panel);
  };

  const applyReviewLevel = (level: ListenReviewLevel, label: string) => {
    const target = reviewTarget;
    if (!target) return;
    const change = setListenReviewLevel(target, level, profile);
    setReviewNotice({
      message: uiFmt("“{item}” set to {level}.", { item: target.de, level: ui(label) }),
      undo: { change, item: target },
    });
    setReviewPanel(null);
    setReviewTarget(null);
    if (level === "permanent") {
      // "Never comes back at all" starts right now, not next session:
      // drop the item from this queue too, which slides the next item into
      // place -- the same move "Put off" makes. Future sessions exclude
      // permanent items in buildListenQueue.
      cancelGradeAdvance();
      setHiddenIds((current) => new Set(current).add(target.id));
    }
  };

  const undoReviewLevel = () => {
    const pending = reviewNotice?.undo;
    if (!pending) return;
    undoListenReviewChange(pending.change, profile);
    setHiddenIds((current) => {
      if (!current.has(pending.item.id)) return current;
      const next = new Set(current);
      next.delete(pending.item.id);
      return next;
    });
    setReviewNotice({
      message: uiFmt("Undid the level change for “{item}”.", { item: pending.item.de }),
    });
  };

  const putOff = (days: number, label: string) => {
    const target = reviewTarget;
    if (!target) return;
    cancelGradeAdvance();
    snoozeListenItem(target, days, profile);
    setReviewNotice({ message: uiFmt("Put off until {when}.", { when: ui(label) }) });
    setReviewPanel(null);
    setReviewTarget(null);
    setHiddenIds((current) => new Set(current).add(target.id));
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

  const commitLoopItems = (count: number) => {
    const next = setListenLoopItems(count, learningDirection);
    setLoopItems(next);
    setPlayhead(listenPlayheadForQueueIndex(queueIndex, queue.length, next, loopPasses));
    return next;
  };

  const commitLoopPasses = (count: number) => {
    const next = setListenLoopPasses(count, learningDirection);
    setLoopPasses(next);
    setPlayhead(listenPlayheadForQueueIndex(queueIndex, queue.length, effectiveLoopItems, next));
    return next;
  };

  const chooseLanguageOrder = (order: ListenLanguageOrder) => {
    setLanguageOrder(setListenLanguageOrder(order, learningDirection));
  };

  const chooseContentSource = (source: ListenContentSource) => {
    setContentSource(setListenContentSource(source, learningDirection));
  };

  const chooseQueueOrder = (order: ListenQueueOrder) => {
    setQueueOrder(setListenQueueOrder(order, learningDirection));
  };

  const commitDelaySeconds = (seconds: number) => {
    const nextMs = setListenNextCardDelayMs(seconds * 1000);
    setNextCardDelayMs(nextMs);
    return nextMs / 1000;
  };

  const chooseBackgroundPlayback = (enabled: boolean) => {
    setBackgroundPlayback(setListenBackgroundPlayback(enabled, profile));
  };

  const choosePetBilingualCaptions = (enabled: boolean) => {
    setPetBilingualCaptions(setListenPetBilingualCaptions(enabled, profile));
  };

  if (!item) {
    return active ? (
      <section className="card p-6 text-center">
        <Headphones className="mx-auto h-8 w-8 text-[var(--text-3)]" />
        <p className="mt-3 text-sm font-black text-[var(--text-1)]">{ui("Nothing to listen to yet")}</p>
        <p className="mt-1 text-xs font-semibold text-[var(--text-3)]">
          {ui("Once the course content is loaded, everything you are learning becomes listenable here.")}
        </p>
      </section>
    ) : null;
  }

  if (!active) {
    if (!backgroundPlayback || !sessionActivated || typeof document === "undefined") return null;
    return createPortal(
      <aside
        aria-label={ui("Listen player")}
        className="listen-mini-player"
        data-playing={playing ? "true" : "false"}
        data-testid="listen-background-player"
      >
        <button className="listen-mini-player__copy" onClick={onOpen} type="button">
          <span className="listen-mini-player__art" aria-hidden="true">
            <Headphones />
          </span>
          <span className="listen-mini-player__text">
            <small><Minimize2 /> {ui(playing ? "Playing in the background" : "Listen is paused")}</small>
            <strong lang="de">{item.de}</strong>
            <span lang="en">{item.en}</span>
          </span>
        </button>
        <div className="listen-mini-player__controls">
          <div className="listen-mini-player__volume">
            <button
              aria-label={ui(masterMuted ? "Unmute all app audio" : "Mute all app audio")}
              aria-pressed={masterMuted}
              onClick={() => toggleAudioMuted()}
              type="button"
            >
              <VolumeGlyph className="h-4 w-4" muted={masterMuted} volume={audioSettings.masterVolume} />
            </button>
            <input
              aria-label={ui("App volume")}
              max="100"
              min="0"
              onChange={(event) => setMasterAudioVolume(Number(event.target.value) / 100)}
              step="1"
              type="range"
              value={Math.round(audioSettings.masterVolume * 100)}
            />
          </div>
          <button aria-label={ui("Previous item")} className="listen-mini-player__step" onClick={() => step(-1)} type="button">
            <ChevronLeft />
          </button>
          <button
            aria-label={ui(playing ? "Pause" : "Play audio")}
            className="is-primary"
            onClick={playing ? pause : beginPlayback}
            type="button"
          >
            {playing ? <Pause /> : <Play />}
          </button>
          <button aria-label={ui("Next item")} className="listen-mini-player__step" onClick={() => step(1)} type="button">
            <ChevronRight />
          </button>
          <button aria-label={ui("Close Listen player")} onClick={dismissBackgroundPlayer} type="button">
            <X />
          </button>
        </div>
      </aside>,
      document.body
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[var(--text-1)]">{ui("Listen")}</h1>
              <p className="text-xs font-semibold text-[var(--text-3)]">
                {ui("Both languages repeat in small learning loops while you do something else.")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-black text-[var(--text-2)]">
            <span>
              {languageOrder === "english-first"
                ? uiFmt("English {en}×, then German {de}×", { de: germanRepeats, en: englishRepeats })
                : uiFmt("German {de}×, then English {en}×", { de: germanRepeats, en: englishRepeats })}
            </span>
            <span aria-hidden="true" className="text-[var(--text-3)]">·</span>
            <span>{uiFmt("{items}-item loop, {passes} passes", { items: effectiveLoopItems, passes: loopPasses })}</span>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface-2)] p-6 text-center shadow-[0_5px_0_var(--border)] sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
            {ui(item.kind === "word" ? "Word" : "Sentence")} · {queueIndex + 1} / {queue.length}
            {loopPasses > 1 && <> · {uiFmt("Learning pass {pass} of {passes}", { pass: loopPass, passes: loopPasses })}</>}
          </p>
          <p className="mt-4 text-2xl font-black leading-snug tracking-tight text-[var(--text-1)] sm:text-3xl" lang="de">
            {item.de}
          </p>
          <p className="mt-3 text-base font-bold leading-relaxed text-[var(--text-2)]" lang="en">
            {item.en}
          </p>

          <div aria-labelledby="listen-review-heading" className="mt-6 border-t border-[var(--border)] pt-5" role="group">
            <h2 className="sr-only" id="listen-review-heading">{ui("Review this item")}</h2>
            <p className="text-[11px] font-semibold text-[var(--text-3)]">
              {ui("Quick marks stay gentle. Set level makes an exact tracker change.")}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
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
                onClick={() => openReviewPanel("level")}
                type="button"
              >
                {ui("Set level")} <ChevronDown className="h-4 w-4" />
              </button>
              <button
                aria-expanded={reviewPanel === "snooze"}
                className="ghost-btn inline-flex h-11 items-center gap-2 px-4 text-sm font-black"
                onClick={() => openReviewPanel("snooze")}
                type="button"
              >
                <CalendarClock className="h-4 w-4" /> {ui("Put off")}
              </button>
            </div>

            {reviewPanel === "level" && (
              <div className="mt-4 grid gap-2 text-left sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label={ui("Set review level")}>
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
              <div className="mt-4 grid gap-2 text-left sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label={ui("Put off")}>
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
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-[var(--accent-dim)] px-3 py-2 text-center text-xs font-black text-[var(--accent)]" role="status">
                <span>{reviewNotice.message}</span>
                {reviewNotice.undo && (
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-current/25 bg-[var(--surface)] px-2.5 py-1 text-xs font-black transition hover:-translate-y-px"
                    onClick={undoReviewLevel}
                    type="button"
                  >
                    <Undo2 className="h-3.5 w-3.5" /> {ui("Undo")}
                  </button>
                )}
              </div>
            )}
          </div>
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
            <button className="listen-play-button inline-flex h-11 min-w-40 items-center justify-center gap-2 px-6" onClick={beginPlayback} type="button">
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
                <ListMusic className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--text-1)]" id="listen-pattern-heading">{ui("What you hear")}</h2>
                <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">{ui("Which items Listen plays, in what order, and how often they come back.")}</p>
              </div>
            </div>
            <fieldset className="mt-4">
              <legend className="text-xs font-black text-[var(--text-2)]">{ui("Content source")}</legend>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">
                {ui("Choose whether Listen pulls from the sentence tracker, word tracker, or both.")}
              </p>
              <div
                aria-label={ui("Content source")}
                className="mt-2 grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-1.5"
                role="radiogroup"
              >
                {([[
                  "sentences", "Sentences",
                ], [
                  "words", "Words",
                ], [
                  "mixed", "Both",
                ]] as const).map(([value, label]) => {
                  const selected = contentSource === value;
                  return (
                    <button
                      aria-checked={selected}
                      className={cn(
                        "min-h-10 rounded-xl border px-2 py-2 text-xs font-black transition-[background-color,border-color,color,transform,box-shadow] duration-150",
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_3px_0_var(--accent-dark)]"
                          : "border-transparent bg-transparent text-[var(--text-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                      )}
                      data-testid={`listen-source-${value}`}
                      key={value}
                      onClick={() => chooseContentSource(value)}
                      role="radio"
                      type="button"
                    >
                      {ui(label)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="text-xs font-black text-[var(--text-2)]">{ui("Queue order")}</legend>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">
                {ui("Most common first teaches the phrases and words people are most likely to use. Newest first plays the packs added most recently, so new content is heard instead of waiting behind thousands of commoner items.")}
              </p>
              <div
                aria-label={ui("Queue order")}
                className="mt-2 grid grid-cols-1 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-1.5 sm:grid-cols-2"
                role="radiogroup"
              >
                {([[
                  "common", "Most common first",
                ], [
                  "learning", "Reviews & struggles first",
                ], [
                  "least-heard", "Least heard first",
                ], [
                  "newest", "Newest first",
                ]] as const).map(([value, label]) => {
                  const selected = queueOrder === value;
                  return (
                    <button
                      aria-checked={selected}
                      className={cn(
                        "min-h-10 rounded-xl border px-2 py-2 text-[11px] font-black leading-tight transition-[background-color,border-color,color,transform,box-shadow] duration-150",
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-[0_3px_0_var(--accent-dark)]"
                          : "border-transparent bg-transparent text-[var(--text-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
                      )}
                      data-testid={`listen-queue-${value}`}
                      key={value}
                      onClick={() => chooseQueueOrder(value)}
                      role="radio"
                      type="button"
                    >
                      {ui(label)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="mt-4 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-dim)] p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)] shadow-sm">
                  <Repeat2 className="h-4 w-4" />
                </span>
                <span>
                  <strong className="block text-xs font-black text-[var(--text-1)]">{ui("Learning loop")}</strong>
                  <small className="mt-0.5 block text-[11px] font-semibold leading-snug text-[var(--text-3)]">
                    {ui("Hear a small set, then revisit the same items before moving on.")}
                  </small>
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <NumberSetting
                  label={ui("Items in each loop")}
                  max={12}
                  min={1}
                  note={ui("How many different items to hear before they return")}
                  onCommit={commitLoopItems}
                  suffix={ui("items")}
                  testId="listen-loop-items"
                  value={loopItems}
                />
                <NumberSetting
                  label={ui("Passes through each loop")}
                  max={6}
                  min={1}
                  note={ui("2 means every item returns once; 1 turns item repetition off")}
                  onCommit={commitLoopPasses}
                  suffix="×"
                  testId="listen-loop-passes"
                  value={loopPasses}
                />
              </div>
            </div>
            <div className="mt-4">
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
          </section>

          <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5" aria-labelledby="listen-volume-heading">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--text-1)]" id="listen-volume-heading">{ui("How it sounds")}</h2>
                <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">{ui("Voice levels, speed, and how each card is spoken. Saved automatically.")}</p>
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
            <fieldset className="mt-4 border-t border-[var(--border)] pt-4">
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
            <div className="mt-3 space-y-2">
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
            </div>
          </section>
        </div>

        {/* Session-wide switches: they govern Listen as a whole rather than a
            single card's content or voice, so they sit under both columns
            instead of padding out whichever column had room. */}
        <div className="listen-session-row">
          <label className="listen-background-toggle" data-testid="listen-background-toggle">
            <input
              checked={backgroundPlayback}
              onChange={(event) => chooseBackgroundPlayback(event.target.checked)}
              type="checkbox"
            />
            <span className="listen-background-toggle__copy">
              <strong>{ui("Keep playing around Micheon")}</strong>
              <small>{ui("Continue when you open Home, Practice, Settings, or another app section.")}</small>
            </span>
            <span aria-hidden="true" className="listen-background-toggle__switch"><i /></span>
          </label>
          <label className="listen-background-toggle" data-testid="listen-pet-bilingual-toggle">
            <input
              checked={petBilingualCaptions}
              onChange={(event) => choosePetBilingualCaptions(event.target.checked)}
              type="checkbox"
            />
            <span className="listen-background-toggle__copy">
              <strong>{ui("Show both languages on the pet")}</strong>
              <small>{ui("Keep German and English together in the pet bubble. Turn this off to show only the line currently being spoken.")}</small>
            </span>
            <span aria-hidden="true" className="listen-background-toggle__switch"><i /></span>
          </label>
        </div>

        <p className="mt-4 text-center text-[11px] font-semibold leading-relaxed text-[var(--text-3)]">
          {ui("Repeated listening builds familiarity, but it does not mark an item mastered. Lessons still check whether you can recall and spell it.")}
        </p>
      </section>
    </div>
  );
}
