import { useEffect, useRef, type CSSProperties } from "react";
import {
  TTS_AUDIO_LEVEL_EVENT,
  type TtsAudioLevelDetail,
} from "@/lib/voice";

type WaveStyle = CSSProperties & { "--tts-wave-level": number };

function clampLevel(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

export function TtsWaveform({
  active,
  bars,
  className,
}: {
  active: boolean;
  bars: number;
  className: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const barRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const history = Array.from({ length: bars }, () => 0);

    const draw = (latest: number, available: boolean, reset = false) => {
      if (reset) history.fill(0);
      else {
        history.shift();
        history.push(clampLevel(latest));
      }

      const root = rootRef.current;
      if (root) {
        root.dataset.audioReactive = available ? "true" : "false";
        root.dataset.level = clampLevel(latest).toFixed(3);
      }
      history.forEach((level, index) => {
        const bar = barRefs.current[index];
        if (!bar) return;
        bar.style.setProperty("--tts-wave-level", String(level));
        bar.dataset.level = level.toFixed(3);
      });
    };

    draw(0, false, true);
    if (!active) return;

    const onAudioLevel = (event: Event) => {
      const detail = (event as CustomEvent<TtsAudioLevelDetail>).detail;
      if (!detail?.available) {
        draw(0, false, true);
        return;
      }
      draw(detail.level, true);
    };

    window.addEventListener(TTS_AUDIO_LEVEL_EVENT, onAudioLevel);
    return () => window.removeEventListener(TTS_AUDIO_LEVEL_EVENT, onAudioLevel);
  }, [active, bars]);

  return (
    <span
      ref={rootRef}
      className={className}
      data-audio-reactive="false"
      data-level="0.000"
      aria-hidden="true"
    >
      {Array.from({ length: bars }, (_, index) => (
        <i
          key={index}
          ref={(element) => { barRefs.current[index] = element; }}
          data-level="0.000"
          style={{ "--tts-wave-level": 0 } as WaveStyle}
        />
      ))}
    </span>
  );
}
