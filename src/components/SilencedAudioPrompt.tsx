import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { ui } from "@/lib/i18n";
import {
  SILENCED_PLAYBACK_EVENT,
  describeSilencedLabel,
  restoreSilencedPlayback,
  type SilencedPlayback,
} from "@/lib/audioPrompt";

/**
 * Answers the question a dead play button raises.
 *
 * Mounted once for the whole app, so every Hear it, every pet voice line and
 * every game sound gets the same explanation without each of them having to
 * know about mute state.
 */
export function SilencedAudioPrompt() {
  const [prompt, setPrompt] = useState<SilencedPlayback | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const onSilenced = (event: Event) => {
      const detail = (event as CustomEvent<SilencedPlayback>).detail;
      if (!detail) return;
      setPrompt(detail);
    };
    window.addEventListener(SILENCED_PLAYBACK_EVENT, onSilenced as EventListener);
    return () => window.removeEventListener(SILENCED_PLAYBACK_EVENT, onSilenced as EventListener);
  }, []);

  // Goes away on its own, like the other notices — but only after long enough
  // to read it and reach the button.
  useEffect(() => {
    if (!prompt) return undefined;
    timerRef.current = window.setTimeout(() => setPrompt(null), 8000);
    return clearTimer;
  }, [prompt, clearTimer]);

  if (!prompt) return null;

  const label = ui(describeSilencedLabel(prompt));

  return (
    <div className="audio-unmute-prompt" role="status">
      <VolumeX aria-hidden="true" />
      <div className="audio-unmute-prompt__text">
        <strong>{label} {ui("is muted")}</strong>
        <span>{ui("That is why nothing played. Turn it back on?")}</span>
      </div>
      <button
        className="audio-unmute-prompt__accept"
        onClick={() => {
          restoreSilencedPlayback(prompt);
          const { replay } = prompt;
          setPrompt(null);
          // Let the new setting land before asking for the sound again.
          window.setTimeout(() => replay?.(), 0);
        }}
        type="button"
      >
        <Volume2 aria-hidden="true" />
        {ui("Unmute")}
      </button>
      <button
        aria-label={ui("Keep it muted")}
        className="audio-unmute-prompt__dismiss"
        onClick={() => setPrompt(null)}
        type="button"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}

export default SilencedAudioPrompt;
