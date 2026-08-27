import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AUDIO_SETTINGS_EVENT,
  getAudioSettings,
  isMasterAudioSilent,
  isTtsLanguageMuted,
  setMasterAudioVolume,
  setSfxAudioVolume,
  setTtsLanguageVolume,
  toggleAudioMuted,
  toggleSfxMuted,
  toggleTtsLanguageMuted,
  type AudioSettings,
  type TtsAudioLanguage,
} from "@/lib/audioMute";
import { ui } from "@/lib/i18n";
import { audioLanguagesInPlay } from "@/lib/audioLanguagesInPlay";
import { SpeechSpeedControl } from "@/components/SpeechSpeedControl";

type MixerPosition = { left: number; top: number };

function VolumeGlyph({ muted, volume, className }: { muted: boolean; volume: number; className?: string }) {
  if (muted || volume <= 0) return <VolumeX className={className} />;
  if (volume < 0.55) return <Volume1 className={className} />;
  return <Volume2 className={className} />;
}

function VolumeRow({
  label,
  muteLabel,
  unmuteLabel,
  value,
  muted,
  onToggleMuted,
  onChange,
  testId,
}: {
  label: string;
  muteLabel: string;
  unmuteLabel: string;
  value: number;
  muted: boolean;
  onToggleMuted: () => void;
  onChange: (value: number) => void;
  testId: string;
}) {
  const percent = Math.round(value * 100);
  return (
    <div className="audio-mixer-row">
      <div className="audio-mixer-rowhead">
        <span>{label}</span>
        <strong>{percent}%</strong>
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
          aria-valuetext={`${percent}%`}
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

/**
 * Fast left-click master mute plus a persistent audio mixer on hover, focus,
 * or right-click. The mixer is portalled and viewport-clamped so neither top
 * bar can crop it.
 */
export function MuteButton({
  className,
  iconClassName = "h-4 w-4",
  label,
  panelClassName,
  settingsOnly = false,
}: {
  className?: string;
  iconClassName?: string;
  label?: string;
  panelClassName?: string;
  settingsOnly?: boolean;
}) {
  const [settings, setSettings] = useState<AudioSettings>(getAudioSettings);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<MixerPosition>({ left: 12, top: 12 });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const suppressNextFocusOpenRef = useRef(false);
  const panelId = `audio-mixer-${useId().replace(/:/g, "")}`;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMixer = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
    setPinned(false);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      if (!pinned) setOpen(false);
      closeTimerRef.current = null;
    }, 240);
  }, [clearCloseTimer, pinned]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === "undefined") return;
    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 12;
    const panelWidth = panelRef.current?.offsetWidth || Math.min(320, window.innerWidth - viewportPadding * 2);
    const panelHeight = panelRef.current?.offsetHeight || 300;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - panelWidth - viewportPadding);
    const left = Math.min(maxLeft, Math.max(viewportPadding, rect.right - panelWidth));
    const below = rect.bottom + 10;
    const above = rect.top - panelHeight - 10;
    const top = below + panelHeight <= window.innerHeight - viewportPadding
      ? below
      : Math.max(viewportPadding, above);
    setPosition({ left, top });
  }, []);

  const openMixer = useCallback((pin = false) => {
    clearCloseTimer();
    if (pin) setPinned(true);
    setOpen(true);
  }, [clearCloseTimer]);

  const focusFirstMixerControl = useCallback(() => {
    window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button, input")?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const sync = () => setSettings(getAudioSettings());
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const reposition = () => updatePosition();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      closeMixer();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        suppressNextFocusOpenRef.current = true;
        closeMixer();
        triggerRef.current?.focus({ preventScroll: true });
        window.requestAnimationFrame(() => { suppressNextFocusOpenRef.current = false; });
      }
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMixer, open, updatePosition]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const masterMuted = isMasterAudioSilent(settings);
  const sfxMuted = settings.sfxMuted || settings.sfxVolume <= 0;
  const englishMuted = isTtsLanguageMuted("english");
  const germanMuted = isTtsLanguageMuted("german");
  const frenchMuted = isTtsLanguageMuted("french");
  const polishMuted = isTtsLanguageMuted("polish");
  /**
   * Only the voices that can actually be heard.
   *
   * Re-read on every open rather than once: the course and the interface
   * language can both change while the app is running, and a panel that
   * still listed yesterday’s languages would be worse than one listing all
   * four.
   */
  const inPlay = audioLanguagesInPlay();
  const triggerTitle = `${ui(masterMuted ? "Unmute audio" : "Mute audio")} · ${ui("Hover or right-click for audio settings.")}`;

  const setLanguageVolume = (language: TtsAudioLanguage, value: number) => {
    setTtsLanguageVolume(language, value);
  };

  const mixer = open && typeof document !== "undefined" ? createPortal(
    <div
      aria-label={ui("Audio settings")}
      aria-modal="false"
      className={cn("audio-mixer-panel", panelClassName)}
      data-testid="audio-mixer-panel"
      id={panelId}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && (panelRef.current?.contains(next) || triggerRef.current?.contains(next))) return;
        scheduleClose();
      }}
      onFocus={clearCloseTimer}
      onPointerEnter={clearCloseTimer}
      onPointerLeave={scheduleClose}
      ref={panelRef}
      role="dialog"
      style={{ left: position.left, top: position.top }}
    >
      <div className="audio-mixer-heading">
        <div className="audio-mixer-heading-icon">
          <VolumeGlyph className="h-5 w-5" muted={masterMuted} volume={settings.masterVolume} />
        </div>
        <div>
          <h2>{ui("Audio settings")}</h2>
          <p>{ui("Changes save automatically on this device.")}</p>
        </div>
      </div>
      <VolumeRow
        label={ui("Master volume")}
        muteLabel={ui("Mute all audio")}
        muted={masterMuted}
        onChange={setMasterAudioVolume}
        onToggleMuted={toggleAudioMuted}
        testId="master"
        unmuteLabel={ui("Unmute all audio")}
        value={settings.masterVolume}
      />
      <VolumeRow
        label={ui("Sound effects")}
        muteLabel={ui("Mute sound effects")}
        muted={sfxMuted}
        onChange={setSfxAudioVolume}
        onToggleMuted={toggleSfxMuted}
        testId="sfx"
        unmuteLabel={ui("Unmute sound effects")}
        value={settings.sfxVolume}
      />
      <div className="audio-mixer-divider" />
      {inPlay.includes("english") && (
        <VolumeRow
          label={ui("English voice")}
          muteLabel={ui("Mute English voice")}
          muted={englishMuted}
          onChange={(value) => setLanguageVolume("english", value)}
          onToggleMuted={() => toggleTtsLanguageMuted("english")}
          testId="english"
          unmuteLabel={ui("Unmute English voice")}
          value={settings.englishVolume}
        />
      )}
      {inPlay.includes("german") && (
        <VolumeRow
          label={ui("German voice")}
          muteLabel={ui("Mute German voice")}
          muted={germanMuted}
          onChange={(value) => setLanguageVolume("german", value)}
          onToggleMuted={() => toggleTtsLanguageMuted("german")}
          testId="german"
          unmuteLabel={ui("Unmute German voice")}
          value={settings.germanVolume}
        />
      )}
      {inPlay.includes("french") && (
        <VolumeRow
          label={ui("French voice")}
          muteLabel={ui("Mute French voice")}
          muted={frenchMuted}
          onChange={(value) => setLanguageVolume("french", value)}
          onToggleMuted={() => toggleTtsLanguageMuted("french")}
          testId="french"
          unmuteLabel={ui("Unmute French voice")}
          value={settings.frenchVolume}
        />
      )}
      {inPlay.includes("polish") && (
        <VolumeRow
          label={ui("Polish voice")}
          muteLabel={ui("Mute Polish voice")}
          muted={polishMuted}
          onChange={(value) => setLanguageVolume("polish", value)}
          onToggleMuted={() => toggleTtsLanguageMuted("polish")}
          testId="polish"
          unmuteLabel={ui("Unmute Polish voice")}
          value={settings.polishVolume}
        />
      )}
      <div className="audio-mixer-divider" />
      <SpeechSpeedControl className="audio-mixer-row" testId="speech-speed" />
      <p className="audio-mixer-footnote">{ui("Sound effects control correct and incorrect answer sounds. Voice controls apply to all spoken audio, including lessons, games, and pet speech.")}</p>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={settingsOnly ? ui("Audio settings") : ui(masterMuted ? "Unmute audio" : "Mute audio")}
        aria-pressed={settingsOnly ? undefined : masterMuted}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          masterMuted ? "text-rose-500 hover:bg-rose-500/10" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
          className
        )}
        data-testid="audio-mixer-trigger"
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (next && panelRef.current?.contains(next)) return;
          scheduleClose();
        }}
        onClick={settingsOnly ? () => openMixer(true) : toggleAudioMuted}
        onContextMenu={(event) => {
          event.preventDefault();
          openMixer(true);
        }}
        onFocus={() => {
          if (suppressNextFocusOpenRef.current) return;
          openMixer(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey && open)) {
            event.preventDefault();
            openMixer(true);
            focusFirstMixerControl();
            return;
          }
          if ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu") {
            event.preventDefault();
            openMixer(true);
            focusFirstMixerControl();
          }
        }}
        onPointerEnter={() => openMixer(false)}
        onPointerLeave={scheduleClose}
        ref={triggerRef}
        title={settingsOnly ? ui("Audio settings") : triggerTitle}
        type="button"
      >
        <VolumeGlyph className={iconClassName} muted={masterMuted} volume={settings.masterVolume} />
        {label ? <span>{label}</span> : null}
      </button>
      {mixer}
    </>
  );
}
