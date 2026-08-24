import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  GripVertical,
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
import { SettingsCategory } from "@/components/SettingsCategory";
import { ui, uiFmt, uiNumber, uiOr } from "@/lib/i18n";
import { loadGradeStore } from "@/lib/activity";
import {
  AUDIO_SETTINGS_EVENT,
  getAudioSettings,
  isMasterAudioSilent,
  setMasterAudioVolume,
  setTtsLanguageVolume,
  toggleAudioMuted,
  toggleTtsLanguageMuted,
  type AudioSettings,
} from "@/lib/audioMute";
import { SpeechSpeedControl } from "@/components/SpeechSpeedControl";
import {
  buildListenQueue,
  buildListenSpeechPlan,
  formatListenPetCaption,
  getListenBackgroundPlayback,
  getListenContentSource,
  getListenCurrentItemId,
  getListenEnglishRepeats,
  getListenGermanRepeats,
  getListenLanguageGapMs,
  getListenLanguageOrder,
  getListenLoopItems,
  getListenMixedCounts,
  arrangeListenMixedQueue,
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
  setListenLanguageGapMs,
  setListenLanguageOrder,
  setListenLoopItems,
  setListenMixedCounts,
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
import { ListenTest } from "@/components/listen/ListenTest";
import { LISTEN_TEST_MAX_QUESTIONS } from "@/lib/listenTest";
import { TappableSentence } from "@/components/shared/TappableSentence";
import { stopTts, ttsSequence, TTS_SPEAKING_EVENT, type SeqItem } from "@/lib/voice";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";
import type { UserProfile } from "@/lib/profileStorage";
import {
  loadMiniPlayerPosition,
  miniPlayerFraction,
  miniPlayerPixels,
  saveMiniPlayerPosition,
  type MiniPlayerPosition,
} from "@/lib/miniPlayerPosition";
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
    <div className="audio-mixer-row">
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
  const [mixedCounts, setMixedCounts] = useState(() => getListenMixedCounts(learningDirection));
  useEffect(() => { setMixedCounts(getListenMixedCounts(learningDirection)); }, [learningDirection, profile?.id]);
  // Grade writes made elsewhere (the tracker's "never review" star, lesson
  // grades) must reach this queue: it stays mounted across tab switches, so
  // without a revision it kept playing items the learner had removed. While
  // the view is active its own review actions already handle the live queue
  // via hiddenIds, so foreign writes are folded in when the view is next
  // opened instead of yanking the playhead mid-session.
  const [gradesRevision, setGradesRevision] = useState(0);
  const activeRef = useRef(active);
  const gradesDirtyRef = useRef(false);
  useEffect(() => {
    const onGradesUpdated = () => {
      if (activeRef.current) {
        gradesDirtyRef.current = true;
        return;
      }
      setGradesRevision((revision) => revision + 1);
    };
    window.addEventListener("grades-updated", onGradesUpdated);
    return () => window.removeEventListener("grades-updated", onGradesUpdated);
  }, []);
  useEffect(() => {
    activeRef.current = active;
    if (active && gradesDirtyRef.current) {
      gradesDirtyRef.current = false;
      setGradesRevision((revision) => revision + 1);
    }
  }, [active]);
  /**
   * The queue is built when Listen is first opened, not when it is mounted.
   *
   * This view stays mounted whichever screen you are on, so that playback
   * survives navigating away — which also meant it built a 20,019-item queue
   * on every start and every language change, for a screen nobody was looking
   * at. Measured on a language switch: 2,182ms of a 3,195ms frozen frame, and
   * the same again at startup.
   *
   * Once opened it stays open as far as this is concerned, so the queue lives
   * on behind the mini player exactly as it did before. `active` is enough on
   * its own — nothing plays without the view having been opened to press it.
   */
  const [everOpened, setEverOpened] = useState(active);
  useEffect(() => {
    if (active) setEverOpened(true);
  }, [active]);

  const baseQueue = useMemo<ListenItem[]>(
    () => (everOpened
      ? buildListenQueue(apiParts, loadGradeStore(profile), {
        contentSource,
        direction: learningDirection,
        order: queueOrder,
      })
      : []),
    [everOpened, apiParts, contentSource, gradesRevision, learningDirection, profile, queueOrder]
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());
  const queue = useMemo(
    () => {
      const visible = baseQueue.filter((candidate) => !hiddenIds.has(candidate.id));
      return contentSource === "mixed" ? arrangeListenMixedQueue(visible, mixedCounts) : visible;
    },
    [baseQueue, contentSource, hiddenIds, mixedCounts]
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
  // Where the background player has been dragged to. The saved value is a
  // fraction of the viewport; dragPixels is the live position during a drag
  // and is cleared on resize so the fraction takes over again.
  const miniPlayerRef = useRef<HTMLElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [miniPlayerPosition, setMiniPlayerPosition] = useState<MiniPlayerPosition | null>(
    () => loadMiniPlayerPosition(profile)
  );
  const [dragPixels, setDragPixels] = useState<{ left: number; top: number } | null>(null);
  const [dragSize, setDragSize] = useState<{ width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [germanRepeats, setGermanRepeats] = useState(() => getListenGermanRepeats(learningDirection));
  const [englishRepeats, setEnglishRepeats] = useState(() => getListenEnglishRepeats(learningDirection));
  const [languageOrder, setLanguageOrder] = useState(() => getListenLanguageOrder(learningDirection));
  const [nextCardDelayMs, setNextCardDelayMs] = useState(getListenNextCardDelayMs);
  const [languageGapMs, setLanguageGapMs] = useState(getListenLanguageGapMs);
  const [yourTurn, setYourTurn] = useState(false);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(getAudioSettings);
  const [graded, setGraded] = useState<"know" | "difficult" | null>(null);
  /**
   * Which items this sitting has marked, and what the record looked like
   * first. Two jobs: the buttons stay lit for a mark you made, so stepping
   * back to a card shows what you decided about it rather than a blank pair
   * of buttons; and pressing a lit one takes the mark off again, which is
   * the same restore the Undo link performs.
   */
  const [sessionMarks, setSessionMarks] = useState<Map<string, { verdict: "know" | "difficult"; undo: ListenReviewChange }>>(
    () => new Map()
  );
  const [testing, setTesting] = useState(false);
  /** Where the bar is being dragged to, before the drag is let go of. */
  const [scrubAt, setScrubAt] = useState<number | null>(null);
  const [jumpBox, setJumpBox] = useState("");
  const [reviewPanel, setReviewPanel] = useState<"menu" | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ListenItem | null>(null);
  const [reviewNotice, setReviewNotice] = useState<ListenReviewNotice | null>(null);
  const timedHiddenIdsRef = useRef<Set<string>>(new Set());
  const runRef = useRef(0);
  const gradeAdvanceTimerRef = useRef<number | null>(null);
  const reviewCloseTimerRef = useRef<number | null>(null);
  const reviewWasPlayingRef = useRef(false);
  const mediaCommandRef = useRef<(command: ListenMediaCommand) => void>(() => {});
  const {
    selectedKey: selectedPetKey,
    selectedPet,
    speak: petSpeak,
    visibleKeys: visiblePetKeys,
  } = useCodexPets();

  const effectiveLoopItems = Math.min(Math.max(1, queue.length), contentSource === "mixed" ? mixedCounts.words + mixedCounts.sentences : loopItems);
  const queueIndex = listenQueueIndexForPlayhead(
    playhead,
    queue.length,
    effectiveLoopItems,
    loopPasses
  );
  const loopPass = listenLoopPassForPlayhead(playhead, queue.length, effectiveLoopItems, loopPasses);
  const item = queue.length ? queue[queueIndex] : null;

  /**
   * What this sitting has actually played, oldest first.
   *
   * The test asks about these rather than about the queue, which is 23,000
   * long and mostly unheard. Ids only — the queue rebuilds when a setting
   * changes, and holding the objects would test yesterday's copy of a card.
   */
  const [heardIds, setHeardIds] = useState<string[]>([]);
  useEffect(() => {
    if (!item) return;
    setHeardIds((current) => (current[current.length - 1] === item.id
      ? current
      : [...current.filter((id) => id !== item.id), item.id].slice(-LISTEN_TEST_MAX_QUESTIONS * 3)));
  }, [item?.id]);
  const heardItems = useMemo(() => {
    const byId = new Map(queue.map((entry) => [entry.id, entry]));
    return heardIds.map((id) => byId.get(id)).filter((entry): entry is ListenItem => Boolean(entry));
  }, [heardIds, queue]);

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
    setMixedCounts(getListenMixedCounts(learningDirection));
    setLoopPasses(getListenLoopPasses(learningDirection));
    setBackgroundPlayback(getListenBackgroundPlayback(profile));
    setPetBilingualCaptions(getListenPetBilingualCaptions(profile));
    setContentSource(getListenContentSource(learningDirection));
    setQueueOrder(getListenQueueOrder(learningDirection));
  }, [learningDirection, profile?.id]);

  useEffect(() => {
    setHiddenIds(new Set());
    timedHiddenIdsRef.current.clear();
    const storedId = getListenCurrentItemId(learningDirection, profile, contentSource, queueOrder);
    const restoredCounts = getListenMixedCounts(learningDirection);
    const restoredQueue = contentSource === "mixed"
      ? arrangeListenMixedQueue(baseQueue, restoredCounts)
      : baseQueue;
    const storedIndex = restoredQueue.findIndex((candidate) => candidate.id === storedId);
    setPlayhead(listenPlayheadForQueueIndex(
      storedIndex >= 0 ? storedIndex : 0,
      restoredQueue.length,
      contentSource === "mixed"
        ? restoredCounts.words + restoredCounts.sentences
        : getListenLoopItems(learningDirection),
      getListenLoopPasses(learningDirection)
    ));
  }, [apiParts, baseQueue, contentSource, learningDirection, profile?.id, queueOrder]);

  useEffect(() => {
    const releaseDueItems = () => {
      const heldIds = timedHiddenIdsRef.current;
      if (!heldIds.size) return;
      const grades = loadGradeStore(profile);
      const now = Date.now();
      const released = [...heldIds].filter((id) => {
        const record = grades[id];
        const dueAt = Date.parse(record?.dueAt ?? "");
        const snoozedUntil = Date.parse(record?.snoozedUntil ?? "");
        return ![dueAt, snoozedUntil].some((until) => Number.isFinite(until) && now < until);
      });
      if (!released.length) return;
      released.forEach((id) => heldIds.delete(id));
      setHiddenIds((current) => {
        const next = new Set(current);
        released.forEach((id) => next.delete(id));
        return next;
      });
    };
    const timer = window.setInterval(releaseDueItems, 60_000);
    return () => window.clearInterval(timer);
  }, [profile?.id]);

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

    const sequence: SeqItem[] = buildListenSpeechPlan({
      de: item.de,
      en: item.en,
      englishLang,
      englishRepeats,
      germanRepeats,
      languageGapMs,
      languageOrder,
    }).map((clip) => ({
      ...clip,
      onStart: () => mirrorOnPet(clip.text, clip.side === "de" ? "de-DE" : "en-US"),
      onPause: (holding: boolean) => setYourTurn(holding && runRef.current === run),
    }));
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
      // Pausing during the gap must take the prompt down with it, or the card
      // sits there telling a stopped player it is their turn.
      setYourTurn(false);
      stopTts();
    };
  }, [playing, playhead, germanRepeats, englishRepeats, languageOrder, languageGapMs, nextCardDelayMs, item?.id, englishLang, queue.length, petBilingualCaptions, petCaptionsAvailable, petSpeak]);

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

  const cancelReviewMenuClose = () => {
    if (reviewCloseTimerRef.current == null) return;
    window.clearTimeout(reviewCloseTimerRef.current);
    reviewCloseTimerRef.current = null;
  };

  const closeReviewPanel = (resumePlayback = true) => {
    cancelReviewMenuClose();
    setReviewPanel(null);
    setReviewTarget(null);
    if (resumePlayback && reviewWasPlayingRef.current) setPlaying(true);
    reviewWasPlayingRef.current = false;
  };

  const scheduleReviewPanelClose = () => {
    cancelReviewMenuClose();
    reviewCloseTimerRef.current = window.setTimeout(() => {
      reviewCloseTimerRef.current = null;
      closeReviewPanel();
    }, 180);
  };

  useEffect(() => () => {
    if (reviewCloseTimerRef.current != null) window.clearTimeout(reviewCloseTimerRef.current);
  }, []);

  const beginPlayback = () => {
    reviewWasPlayingRef.current = false;
    closeReviewPanel(false);
    setSessionActivated(true);
    setPlaying(true);
  };

  /** Everything a move has to undo before the card changes under it. */
  const leaveCurrentItem = () => {
    cancelGradeAdvance();
    runRef.current += 1;
    stopTts();
    setGraded(null);
    reviewWasPlayingRef.current = false;
    closeReviewPanel(false);
  };

  /**
   * Straight to a position in the queue.
   *
   * The arrows move one card and the queue is twenty-three thousand long, so
   * reaching anything you remember passing meant holding an arrow down. This
   * is the same primitive resume uses; it wraps, so 0 and the last item are
   * one step apart in either direction.
   */
  const jumpToQueueIndex = (index: number) => {
    if (queue.length === 0) return;
    leaveCurrentItem();
    setPlayhead(listenPlayheadForQueueIndex(index, queue.length, effectiveLoopItems, loopPasses));
  };

  const step = (direction: 1 | -1) => {
    leaveCurrentItem();
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

  /**
   * Arrow keys move through the queue.
   *
   * The
   * buttons were the only way, which means a hand on the mouse for something
   * you do every few seconds while listening.
   *
   * Left and right only, and only on the Listen screen. Up and down are left
   * alone because they scroll the page, and a key pressed inside a text box
   * or on a focused control belongs to that control — a right arrow in the
   * volume slider should move the volume, not the queue.
   */
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // instanceof rather than a cast: a key event can arrive with the window
      // itself as its target, and window has no closest() to call.
      const target = event.target;
      if (target instanceof Element
        && target.closest("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /**
   * Dragging the background player.
   *
   * Pointer events rather than mouse events, so a touchscreen and a pen work
   * without a second code path, and setPointerCapture keeps the drag alive
   * when the cursor outruns the element. The grab offset is taken once at
   * pointer-down so the player does not jump its own corner under the cursor.
   */
  const beginDrag = (event: React.PointerEvent<HTMLElement>) => {
    // The controls are the point of the player; only the shell drags.
    if ((event.target as HTMLElement).closest("button, input, a, [role='slider']")) return;
    const element = miniPlayerRef.current;
    if (!element || event.button !== 0) return;
    const box = element.getBoundingClientRect();
    dragOffsetRef.current = { x: event.clientX - box.left, y: event.clientY - box.top };
    setDragSize({ width: box.width, height: box.height });
    // Where it already is, in pixels, so the first move continues from there
    // rather than from wherever the stored fraction rounds to.
    setDragPixels({ left: box.left, top: box.top });
    setDragging(true);
    element.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return undefined;
    const element = miniPlayerRef.current;
    if (!element) return undefined;

    const move = (event: PointerEvent) => {
      const size = dragSize ?? { width: element.offsetWidth, height: element.offsetHeight };
      const maxLeft = Math.max(0, window.innerWidth - size.width);
      const maxTop = Math.max(0, window.innerHeight - size.height);
      setDragPixels({
        left: Math.min(maxLeft, Math.max(0, event.clientX - dragOffsetRef.current.x)),
        top: Math.min(maxTop, Math.max(0, event.clientY - dragOffsetRef.current.y)),
      });
    };
    const end = () => {
      setDragging(false);
      const size = dragSize ?? { width: element.offsetWidth, height: element.offsetHeight };
      setDragPixels((pixels) => {
        if (pixels) {
          const fraction = miniPlayerFraction(
            pixels,
            size,
            { width: window.innerWidth, height: window.innerHeight }
          );
          setMiniPlayerPosition(fraction);
          saveMiniPlayerPosition(fraction, profile);
        }
        return pixels;
      });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragging, dragSize, profile]);

  // A resized window must not strand the player off the edge, so the stored
  // fraction is re-read against the new viewport rather than kept in pixels.
  useEffect(() => {
    if (dragging) return undefined;
    const settle = () => setDragPixels(null);
    window.addEventListener("resize", settle);
    return () => window.removeEventListener("resize", settle);
  }, [dragging]);

  const miniPlayerStyle = (() => {
    if (dragPixels) {
      return { left: `${dragPixels.left}px`, top: `${dragPixels.top}px`, right: "auto", bottom: "auto" } as const;
    }
    if (!miniPlayerPosition) return undefined;
    const element = miniPlayerRef.current;
    const size = {
      width: element?.offsetWidth || 680,
      height: element?.offsetHeight || 96,
    };
    const { left, top } = miniPlayerPixels(miniPlayerPosition, size, {
      width: typeof window === "undefined" ? 1280 : window.innerWidth,
      height: typeof window === "undefined" ? 800 : window.innerHeight,
    });
    return { left: `${left}px`, top: `${top}px`, right: "auto", bottom: "auto" } as const;
  })();

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

  /** The mark this sitting has on the item currently on screen, if any. */
  const itemMark = item ? sessionMarks.get(item.id)?.verdict ?? null : null;

  const clearMark = (target: ListenItem) => {
    const existing = sessionMarks.get(target.id);
    if (!existing) return;
    undoListenReviewChange(existing.undo, profile);
    setSessionMarks((current) => {
      const next = new Map(current);
      next.delete(target.id);
      return next;
    });
    setReviewNotice({
      message: uiFmt("Took the mark off “{item}”.", { item: target.de }),
    });
  };

  const grade = (verdict: "know" | "difficult") => {
    if (!item || gradeAdvanceTimerRef.current != null) return;
    reviewWasPlayingRef.current = false;
    closeReviewPanel(false);
    // Pressing the mark that is already on takes it off, and stays on the
    // card — the point of an unmark is that you did not mean to move on.
    if (sessionMarks.get(item.id)?.verdict === verdict) {
      setGraded(null);
      clearMark(item);
      return;
    }
    const fresh = recordListenGrade(item, verdict, profile);
    // Re-marking an item keeps the ORIGINAL snapshot, not the one taken after
    // the first mark — otherwise Undo restores the earlier mark instead of
    // the state before any of this.
    const undo = sessionMarks.get(item.id)?.undo ?? fresh;
    const target = { ...item, aliases: [...item.aliases] };
    setSessionMarks((current) => {
      const next = new Map(current);
      next.set(item.id, { verdict, undo });
      return next;
    });
    setReviewNotice({
      message: uiFmt("“{item}” marked as {verdict}.", {
        item: item.de,
        verdict: ui(verdict === "know" ? "Know it" : "Struggle"),
      }),
      undo: { change: undo, item: target },
    });
    setGraded(verdict);
    runRef.current += 1;
    stopTts();
    gradeAdvanceTimerRef.current = window.setTimeout(() => {
      gradeAdvanceTimerRef.current = null;
      setGraded(null);
      setPlayhead((current) => current + 1);
    }, 350);
  };

  const openReviewPanel = () => {
    cancelReviewMenuClose();
    if (reviewPanel) return;
    if (!item) return;
    // A review action must never chase autoplay onto the next card. Stop the
    // current sequence and keep an immutable target until the menu closes.
    cancelGradeAdvance();
    reviewWasPlayingRef.current = playing;
    pause();
    setReviewTarget({ ...item, aliases: [...item.aliases] });
    setReviewPanel("menu");
  };

  const applyReviewLevel = (level: ListenReviewLevel, label: string) => {
    const target = reviewTarget;
    if (!target) return;
    const change = setListenReviewLevel(target, level, profile);
    setReviewNotice({
      message: uiFmt("“{item}” set to {level}.", { item: target.de, level: ui(label) }),
      undo: { change, item: target },
    });
    reviewWasPlayingRef.current = false;
    closeReviewPanel(false);
    if (typeof level === "number" || level === "permanent") {
      // Timed levels finish the current item until its scheduled review date;
      // Never review removes it permanently. Drop either choice from this
      // queue too, which slides the next item into place immediately. Future
      // sessions apply the same due-date rule in buildListenQueue.
      cancelGradeAdvance();
      setHiddenIds((current) => new Set(current).add(target.id));
      if (typeof level === "number") timedHiddenIdsRef.current.add(target.id);
    }
  };

  const undoReviewLevel = () => {
    const pending = reviewNotice?.undo;
    if (!pending) return;
    undoListenReviewChange(pending.change, profile);
    // Undo and the lit button are two faces of the same mark, so taking it
    // back here has to unlight the button as well.
    setSessionMarks((current) => {
      if (!current.has(pending.item.id)) return current;
      const next = new Map(current);
      next.delete(pending.item.id);
      return next;
    });
    timedHiddenIdsRef.current.delete(pending.item.id);
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
    reviewWasPlayingRef.current = false;
    closeReviewPanel(false);
    timedHiddenIdsRef.current.add(target.id);
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

  const commitMixedCounts = (counts: { words: number; sentences: number }) => {
    const currentId = item?.id ?? "";
    const next = setListenMixedCounts(counts, learningDirection);
    const visible = baseQueue.filter((candidate) => !hiddenIds.has(candidate.id));
    const nextQueue = arrangeListenMixedQueue(visible, next);
    const nextIndex = Math.max(0, nextQueue.findIndex((candidate) => candidate.id === currentId));
    setMixedCounts(next);
    setPlayhead(listenPlayheadForQueueIndex(
      nextIndex,
      nextQueue.length,
      next.words + next.sentences,
      loopPasses
    ));
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

  const commitLanguageGapSeconds = (seconds: number) => {
    const nextMs = setListenLanguageGapMs(seconds * 1000);
    setLanguageGapMs(nextMs);
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
        ref={miniPlayerRef}
        aria-label={ui("Listen player")}
        className="listen-mini-player"
        data-dragging={dragging ? "true" : "false"}
        data-playing={playing ? "true" : "false"}
        data-testid="listen-background-player"
        onPointerDown={beginDrag}
        style={miniPlayerStyle}
      >
        {/*
          A handle, so the player looks draggable before anybody tries it.
          Dragging works anywhere on the shell too — beginDrag ignores the
          controls — but a grip is the part people reach for.
        */}
        <span
          aria-hidden="true"
          className="listen-mini-player__grip"
          title={ui("Drag to move")}
        >
          <GripVertical />
        </span>
        <button className="listen-mini-player__copy" onClick={onOpen} type="button">
          <span className="listen-mini-player__art" aria-hidden="true">
            <Headphones />
          </span>
          <span className="listen-mini-player__text">
            <small>
              <Minimize2 />
              {/* Shrinks and ellipses so the count beside it never gets
                  pushed out: which item you are on is the part you cannot
                  work out from anywhere else in the collapsed player. */}
              <span className="listen-mini-player__state">
                {ui(playing ? "Playing in the background" : "Listen is paused")}
              </span>
              {queue.length > 0 && (
                <span
                  className="listen-mini-player__pos"
                  title={uiFmt("{position} of {total}", {
                    position: uiNumber(queueIndex + 1),
                    total: uiNumber(queue.length),
                  })}
                >
                  · {uiNumber(queueIndex + 1)} / {uiNumber(queue.length)}
                </span>
              )}
            </small>
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

  // The test takes the whole page rather than sitting under the player: the
  // player is a wall of controls and settings, and none of it is any help
  // while you are trying to remember what a word meant.
  if (testing) {
    return (
      <div className="listen-view mx-auto w-full max-w-3xl space-y-4">
        <ListenTest heard={heardItems} onClose={() => setTesting(false)} pool={queue} />
      </div>
    );
  }

  return (
    <div className="listen-view mx-auto w-full max-w-7xl space-y-4">
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
            {languageGapMs > 0 && (
              <>
                <span aria-hidden="true" className="text-[var(--text-3)]">·</span>
                <span>{uiFmt("{seconds}s for you", { seconds: uiNumber(languageGapMs / 1000) })}</span>
              </>
            )}
            <span aria-hidden="true" className="text-[var(--text-3)]">·</span>
            <span>{contentSource === "mixed"
              ? uiFmt("{words} words + {sentences} sentences, {passes} passes", { words: mixedCounts.words, sentences: mixedCounts.sentences, passes: loopPasses })
              : uiFmt("{items}-item loop, {passes} passes", { items: effectiveLoopItems, passes: loopPasses })}</span>
          </div>
        </div>

        <div className="listen-card mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface-2)] p-6 text-center shadow-[0_5px_0_var(--border)] sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
            {ui(item.kind === "word" ? "Word" : "Sentence")} · {queueIndex + 1} / {queue.length}
            {loopPasses > 1 && <> · {uiFmt("Learning pass {pass} of {passes}", { pass: loopPass, passes: loopPasses })}</>}
          </p>
          {/* A word at a time, with the same popover the lesson uses: the
              meaning, then Hear it and Practice this word. Listen plays a line
              twice and moves on, so the one word that blocked the sentence
              would otherwise stay blocked — and knowing what it meant is only
              half of it, since the next thing you want is to keep it.
              Tapping a word pauses the loop rather than talking over it. */}
          <p className="listen-sentence mt-4 text-2xl font-black leading-snug tracking-tight text-[var(--text-1)] sm:text-3xl" lang="de">
            <TappableSentence text={item.de} lang="de-DE" meaningText={item.en} onWordAudio={pause} />
          </p>
          <p className="mt-3 text-base font-bold leading-relaxed text-[var(--text-2)]" lang="en">
            {item.en}
          </p>
          {yourTurn ? (
            <p
              aria-live="polite"
              className="listen-your-turn"
              data-testid="listen-your-turn"
              style={{ "--gap-duration": `${languageGapMs}ms` } as React.CSSProperties}
            >
              {ui(languageOrder === "english-first"
                ? "Your turn — say it in German"
                : "Your turn — say it in English")}
              <span aria-hidden="true" className="listen-your-turn__bar">
                <span className="listen-your-turn__fill" />
              </span>
            </p>
          ) : null}
          {/* Register warning. Not word-only, unlike the use note below it:
              the 762 items this can appear on are mostly sentences, and
              "Ich komm." is exactly the card that needs it. */}
          {item.tierNote ? (
            <p className="mt-3 flex justify-center">
              <span
                className="register-note"
                title={ui("Not everyday neutral German — use in the right company")}
              >
                {uiOr(item.tierNote, "Besonderer Sprachgebrauch")}
              </span>
            </p>
          ) : null}
          {item.kind === "word" && item.use ? (
            <p className="mx-auto mt-3 max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold leading-relaxed text-[var(--text-3)]">
              {item.use}
            </p>
          ) : null}
          {item.kind === "word" && (item.synonyms?.length ?? 0) > 0 ? (
            <p
              className="mx-auto mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-[var(--text-3)]"
              title={ui("Same meaning — the most common word leads this card.")}
            >
              <span className="font-black text-sky-600">{ui("Also")}: </span>
              {(item.synonyms ?? []).map((syn, index) => (
                <span key={syn.de}>
                  {index > 0 && <span aria-hidden="true"> · </span>}
                  <span className="font-bold text-[var(--text-2)]" lang="de">{syn.de}</span>
                  {syn.label && <span> ({ui(syn.label)})</span>}
                </span>
              ))}
            </p>
          ) : null}

          <div
            aria-labelledby="listen-review-heading"
            className="relative mt-6 border-t border-[var(--border)] pt-5"
            onBlurCapture={(event) => {
              if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
              scheduleReviewPanelClose();
            }}
            onMouseEnter={cancelReviewMenuClose}
            onMouseLeave={scheduleReviewPanelClose}
            role="group"
          >
            <h2 className="sr-only" id="listen-review-heading">{ui("Review this item")}</h2>
            <p className="text-[11px] font-semibold text-[var(--text-3)]">
              {ui("Hover over Know it, or open its menu, for exact levels and Put off.")}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <div
                className="inline-flex"
                data-testid="listen-know-options"
                onFocusCapture={openReviewPanel}
                onMouseEnter={openReviewPanel}
              >
                <button
                  aria-pressed={itemMark === "know"}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-l-xl border border-r-0 px-4 text-sm font-black transition-colors",
                    graded === "know" || itemMark === "know"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/18 dark:text-emerald-300"
                  )}
                  onClick={() => grade("know")}
                  title={itemMark === "know" ? ui("Marked as known. Press to take the mark off.") : undefined}
                  type="button"
                >
                  <Check className="h-4 w-4" /> {ui(itemMark === "know" ? "Known" : "Know it")}
                </button>
                <button
                  aria-expanded={reviewPanel === "menu"}
                  aria-haspopup="menu"
                  aria-label={ui("More Know it options")}
                  className={cn(
                    "inline-grid h-11 w-9 place-items-center rounded-r-xl border text-sm font-black transition-colors",
                    graded === "know" || itemMark === "know"
                      ? "border-emerald-500 border-l-white/30 bg-emerald-500 text-white"
                      : "border-emerald-500/30 border-l-emerald-500/15 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/18 dark:text-emerald-300"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (reviewPanel) closeReviewPanel();
                    else openReviewPanel();
                  }}
                  title={ui("More Know it options")}
                  type="button"
                >
                  <ChevronDown className={cn("h-4 w-4 transition-transform", reviewPanel && "rotate-180")} />
                </button>
              </div>
              <button
                aria-pressed={itemMark === "difficult"}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-black transition-colors",
                  graded === "difficult" || itemMark === "difficult"
                    ? "border-rose-500 bg-rose-500 text-white"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/18 dark:text-rose-300"
                )}
                onClick={() => grade("difficult")}
                title={itemMark === "difficult" ? ui("Marked as a struggle. Press to take the mark off.") : undefined}
                type="button"
              >
                <X className="h-4 w-4" /> {ui(itemMark === "difficult" ? "Struggling" : "Struggle")}
              </button>
            </div>

            {reviewPanel === "menu" && (
              <div
                aria-label={ui("More Know it options")}
                /* Floating, not in the flow: as a block it made the card
                   taller than its space and put a scrollbar on it. */
                className="absolute inset-x-0 top-full z-30 mx-auto mt-2 w-full max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left shadow-[0_12px_30px_var(--shadow)]"
                data-testid="listen-review-menu"
                onMouseEnter={cancelReviewMenuClose}
                role="menu"
              >
                <section aria-labelledby="listen-review-level-title">
                  <strong className="block text-xs font-black text-[var(--text-1)]" id="listen-review-level-title">{ui("Set level")}</strong>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {REVIEW_LEVELS.map((option) => (
                      <button
                        className={cn(
                          "rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]",
                          option.value === "struggle" && "hover:border-rose-400 hover:bg-rose-500/10"
                        )}
                        key={String(option.value)}
                        onClick={() => applyReviewLevel(option.value, option.label)}
                        role="menuitem"
                        type="button"
                      >
                        <strong className="block text-xs font-black text-[var(--text-1)]">{ui(option.label)}</strong>
                        <small className="mt-1 block text-[10px] font-semibold leading-snug text-[var(--text-3)]">{ui(option.note)}</small>
                      </button>
                    ))}
                  </div>
                </section>
                <section aria-labelledby="listen-review-snooze-title" className="mt-3 border-t border-[var(--border)] pt-3">
                  <strong className="flex items-center gap-1.5 text-xs font-black text-[var(--text-1)]" id="listen-review-snooze-title">
                    <CalendarClock className="h-3.5 w-3.5 text-[var(--accent)]" /> {ui("Put off")}
                  </strong>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {SNOOZE_CHOICES.map((choice) => (
                      <button
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]"
                        key={choice.days}
                        onClick={() => putOff(choice.days, choice.label)}
                        role="menuitem"
                        type="button"
                      >
                        <strong className="block text-xs font-black text-[var(--text-1)]">{ui(choice.label)}</strong>
                        <small className="mt-1 block text-[10px] font-semibold leading-snug text-[var(--text-3)]">{ui(choice.note)}</small>
                      </button>
                    ))}
                  </div>
                </section>
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
          {/* Listening tells you nothing about what stuck, so this asks. It
              pauses first: the test is silent, and audio carrying on
              underneath it would be reading the answers out. */}
          <button
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-black text-[var(--text-1)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]"
            data-testid="listen-test-open"
            onClick={() => { pause(); setTesting(true); }}
            type="button"
          >
            <ClipboardCheck className="h-4 w-4" />
            {ui("Test me")}
          </button>
        </div>

        {/* Coarse and exact, because they are different jobs. The bar covers
            the whole queue at about forty items a pixel, which is right for
            "somewhere around a third of the way in" and useless for landing
            on a particular card; the box is for the card you can name. The
            bar commits on release rather than on every pixel, or dragging it
            would synthesise a few hundred clips on the way past. */}
        {queue.length > 1 && (
          <div className="listen-scrub mt-4" data-testid="listen-scrub">
            <input
              aria-label={ui("Move through the queue")}
              aria-valuetext={uiFmt("{position} of {total}", {
                position: uiNumber((scrubAt ?? queueIndex) + 1),
                total: uiNumber(queue.length),
              })}
              className="listen-scrub__bar"
              max={queue.length - 1}
              min={0}
              onChange={(event) => setScrubAt(Number(event.target.value))}
              onKeyUp={() => { if (scrubAt !== null) { jumpToQueueIndex(scrubAt); setScrubAt(null); } }}
              onPointerUp={() => { if (scrubAt !== null) { jumpToQueueIndex(scrubAt); setScrubAt(null); } }}
              step={1}
              type="range"
              value={scrubAt ?? queueIndex}
            />
            <form
              className="listen-scrub__jump"
              onSubmit={(event) => {
                event.preventDefault();
                const wanted = Number(jumpBox);
                if (!Number.isFinite(wanted)) return;
                // Shown one-based, held zero-based, and clamped rather than
                // refused: typing 99999 means "the end".
                jumpToQueueIndex(Math.min(Math.max(1, Math.round(wanted)), queue.length) - 1);
                setJumpBox("");
              }}
            >
              <label className="listen-scrub__label" htmlFor="listen-jump">{ui("Go to")}</label>
              <input
                className="listen-scrub__input"
                id="listen-jump"
                inputMode="numeric"
                onChange={(event) => setJumpBox(event.target.value.replace(/[^0-9]/g, ""))}
                placeholder={String(queueIndex + 1)}
                type="text"
                value={jumpBox}
              />
              <span className="listen-scrub__total">/ {uiNumber(queue.length)}</span>
              <button className="listen-scrub__go" disabled={!jumpBox} type="submit">
                {ui("Go")}
              </button>
            </form>
          </div>
        )}

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

        {/* Both settings panels fold away behind their headers — the player is
            the page; the knobs are a drawer you open when you want them. */}
        <div className="mt-3 grid items-start gap-x-4 lg:grid-cols-2">
          <SettingsCategory
            description={ui("Which items Listen plays, in what order, and how often they come back.")}
            icon={ListMusic}
            title={ui("What you hear")}
          >
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
            <fieldset className="mt-4 border-t border-[var(--border)] pt-4">
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
                {contentSource === "mixed" ? <>
                  <NumberSetting label={ui("Words in each loop")} max={Math.max(1, 12 - mixedCounts.sentences)} min={1} note={ui("Words before the loop returns")} onCommit={(value) => commitMixedCounts({ ...mixedCounts, words: value }).words} suffix={ui("words")} testId="listen-loop-words" value={mixedCounts.words} />
                  <NumberSetting label={ui("Sentences in each loop")} max={Math.max(1, 12 - mixedCounts.words)} min={1} note={ui("Sentences and phrases before the loop returns")} onCommit={(value) => commitMixedCounts({ ...mixedCounts, sentences: value }).sentences} suffix={ui("sentences")} testId="listen-loop-sentences" value={mixedCounts.sentences} />
                </> : <NumberSetting label={ui("Items in each loop")} max={12} min={1} note={ui("How many different items to hear before they return")} onCommit={commitLoopItems} suffix={ui("items")} testId="listen-loop-items" value={loopItems} />}
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
          </SettingsCategory>

          <SettingsCategory
            description={ui("Voice levels, speed, and how each card is spoken. Saved automatically.")}
            icon={Volume2}
            title={ui("How it sounds")}
          >
            <div className="listen-audio-stack">
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
            <div className="listen-speech-speed-card">
              <SpeechSpeedControl
                description={ui("Set both voices together or tune English and German separately.")}
                testId="listen-speech-speed"
              />
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
            {/* These three had no heading of their own. They sat straight
                under the language order and read as part of it, which is
                nearly true and not true enough: the order decides which
                language opens a card, these decide how often each one is
                said and how long the gap between them is. */}
            <fieldset className="mt-4 border-t border-[var(--border)] pt-4">
              <legend className="text-xs font-black text-[var(--text-2)]">{ui("Repeats and pauses")}</legend>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-3)]">
                {ui("How often each language is spoken on a card, and the gap between them.")}
              </p>
              <div className="mt-2 space-y-2">
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
                  label={ui("Pause between languages")}
                  max={30}
                  min={0}
                  note={ui(
                    languageOrder === "english-first"
                      ? "Your turn to say the German before it is spoken"
                      : "Your turn to say the English before it is spoken"
                  )}
                  onCommit={commitLanguageGapSeconds}
                  step={0.5}
                  suffix={ui("sec")}
                  testId="listen-language-gap"
                  value={languageGapMs / 1000}
                />
              </div>
            </fieldset>
          </SettingsCategory>
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
