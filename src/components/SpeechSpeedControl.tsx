import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AUDIO_SETTINGS_EVENT,
  getAudioSettings,
  getMasterTtsSpeechRate,
  setTtsLanguageSpeechRate,
  setTtsSpeechRate,
  TTS_SPEED_PRESETS,
  type AudioSettings,
  type TtsAudioLanguage,
} from "@/lib/audioMute";
import { audioLanguagesInPlay } from "@/lib/audioLanguagesInPlay";
import { ui } from "@/lib/i18n";

export type TtsSpeechScope = "master" | TtsAudioLanguage;

const SCOPES: Array<{ value: TtsSpeechScope; label: string }> = [
  { value: "master", label: "Master" },
  { value: "english", label: "English" },
  { value: "german", label: "German" },
  { value: "french", label: "French" },
  { value: "polish", label: "Polish" },
];

function rateForScope(settings: AudioSettings, scope: TtsSpeechScope): number | null {
  if (scope === "english") return settings.englishSpeechRate;
  if (scope === "german") return settings.germanSpeechRate;
  if (scope === "french") return settings.frenchSpeechRate;
  if (scope === "polish") return settings.polishSpeechRate;
  return getMasterTtsSpeechRate(settings);
}

export function SpeechSpeedControl({
  className,
  defaultScope = "master",
  description,
  onRateChange,
  testId = "speech-speed",
}: {
  className?: string;
  defaultScope?: TtsSpeechScope;
  description?: string;
  onRateChange?: (scope: TtsSpeechScope, rate: number) => void;
  testId?: string;
}) {
  const [settings, setSettings] = useState<AudioSettings>(getAudioSettings);
  const [scope, setScope] = useState<TtsSpeechScope>(defaultScope);

  useEffect(() => {
    const sync = () => setSettings(getAudioSettings());
    window.addEventListener(AUDIO_SETTINGS_EVENT, sync);
    return () => window.removeEventListener(AUDIO_SETTINGS_EVENT, sync);
  }, []);

  useEffect(() => setScope(defaultScope), [defaultScope]);

  /**
   * Master, plus only the voices that can be heard in this course.
   *
   * Master stays whatever the others are: it is the batch control, and it
   * still means something when only one language is listed — that language
   * plus the pet.
   */
  const inPlay = audioLanguagesInPlay();
  const scopes = SCOPES.filter((option) => option.value === "master" || inPlay.includes(option.value));

  /**
   * A scope that has stopped applying must not stay selected.
   *
   * The panel remembers which voice was being adjusted, and the course can
   * change underneath it. Left alone, somebody would be dragging a speed
   * that belonged to a language no longer in the lesson, with no button on
   * screen showing which.
   */
  useEffect(() => {
    if (scope !== "master" && !inPlay.includes(scope)) setScope("master");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inPlay.join("|"), scope]);

  const rate = rateForScope(settings, scope);
  const status = rate === null ? ui("Mixed") : `${rate}×`;
  const scopeLabel = ui(scopes.find((option) => option.value === scope)?.label ?? "Master");

  const chooseRate = (nextRate: number) => {
    if (scope === "master") setTtsSpeechRate(nextRate);
    else setTtsLanguageSpeechRate(scope, nextRate);
    setSettings(getAudioSettings());
    onRateChange?.(scope, nextRate);
  };

  return (
    <div className={cn("speech-speed-control", className)} data-testid={testId}>
      <div className="speech-speed-heading">
        <span className="speech-speed-title">
          <Gauge aria-hidden="true" className="h-4 w-4" />
          {ui("Speech speed")}
        </span>
        <strong aria-live="polite">{status}</strong>
      </div>
      {description ? <p className="speech-speed-description">{description}</p> : null}
      <div
        aria-label={ui("Choose which voice speed to change")}
        className="speech-speed-scopes"
        role="radiogroup"
      >
        {scopes.map((option) => (
          <button
            aria-checked={scope === option.value}
            className={cn("speech-speed-scope", scope === option.value && "is-active")}
            data-testid={`${testId}-scope-${option.value}`}
            key={option.value}
            onClick={() => setScope(option.value)}
            role="radio"
            type="button"
          >
            {ui(option.label)}
          </button>
        ))}
      </div>
      <div
        aria-label={`${scopeLabel} ${ui("Speech speed")}`}
        className="audio-mixer-speed"
        data-testid={`${testId}-presets`}
        role="group"
      >
        {TTS_SPEED_PRESETS.map((preset) => {
          const active = rate !== null && Math.abs(rate - preset) < 0.01;
          return (
            <button
              aria-pressed={active}
              className={cn("audio-mixer-speed-chip", active && "is-active")}
              key={preset}
              onClick={() => chooseRate(preset)}
              type="button"
            >
              {preset}×
            </button>
          );
        })}
      </div>
      {scope === "master" && rate === null ? (
        <p className="speech-speed-mixed-note">{ui("The voices currently use different speeds. Choose a speed here to set them all.")}</p>
      ) : null}
    </div>
  );
}
