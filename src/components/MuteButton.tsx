import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUDIO_MUTE_EVENT, isAudioMuted, toggleAudioMuted } from "@/lib/audioMute";

/**
 * Global audio mute toggle. Silences the TTS voices and the game-feel sounds
 * everywhere; state persists and stays in sync across every placement via a
 * window event.
 */
export function MuteButton({ className }: { className?: string }) {
  const [muted, setMuted] = useState(isAudioMuted);

  useEffect(() => {
    const sync = () => setMuted(isAudioMuted());
    window.addEventListener(AUDIO_MUTE_EVENT, sync);
    return () => window.removeEventListener(AUDIO_MUTE_EVENT, sync);
  }, []);

  return (
    <button
      type="button"
      aria-label={muted ? "Unmute audio" : "Mute audio"}
      aria-pressed={muted}
      title={muted ? "Unmute audio" : "Mute audio"}
      onClick={toggleAudioMuted}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
        muted ? "text-rose-500 hover:bg-rose-500/10" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
        className
      )}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
