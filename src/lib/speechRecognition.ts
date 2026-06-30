/**
 * Browser Web Speech API — speech-to-text for German practice.
 * Uses SpeechRecognition (Chrome/Edge/Safari webkit). Requires HTTPS or localhost.
 */

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window &
    typeof globalThis & { webkitSpeechRecognition?: SpeechRecognitionCtor };
  return window.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export function speechRecognitionUserHint(errorCode: string): string {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone blocked — allow access in the browser address bar, then try again.";
    case "no-speech":
      return "Did not hear speech. Speak after the beep, or check your microphone.";
    case "audio-capture":
      return "No microphone found or it is in use elsewhere.";
    case "network":
      return "Network error — some browsers need online speech services.";
    case "aborted":
      return "";
    case "unsupported":
      return "Speech recognition is not available in this browser. Try Chrome or Edge.";
    case "start-failed":
      return "Could not start listening. Try again.";
    default:
      return errorCode ? `Speech error: ${errorCode}` : "Something went wrong. Try again.";
  }
}

export type ListenGermanOptions = {
  /** Abort to cancel listening early */
  signal?: AbortSignal;
  /** BCP-47 language to recognise (default de-DE). Set en-US when learning English. */
  lang?: string;
  /** Live partial transcripts as the user speaks (for on-screen feedback). */
  onInterim?: (text: string) => void;
  /** Fires once the recognizer confirms the microphone is actually capturing audio. */
  onAudioStart?: () => void;
  /** Hard stop if nothing comes back, so the UI never hangs on "Listening...". Default 12s. */
  timeoutMs?: number;
};

/**
 * Listen for a single German utterance and return the best transcript.
 * Cancels any in-progress speech synthesis to reduce echo.
 *
 * Uses interim results so callers can show what is being heard live — this is
 * also the clearest way to tell a "mic not capturing" problem (no interim text,
 * no audio-start) apart from a "captured but didn't match" problem.
 */
export function listenGermanOnce(options?: ListenGermanOptions): Promise<{ transcript: string; confidence: number }> {
  return new Promise((resolve, reject) => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      reject(new Error("unsupported"));
      return;
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const rec = new Ctor();
    rec.lang = options?.lang ?? "de-DE";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let settled = false;
    let gotAudio = false;
    let bestInterim = "";
    const timeoutMs = options?.timeoutMs ?? 12000;

    const watchdog = setTimeout(() => {
      // Nothing resolved in time — most often the mic captured no audio.
      settle(() => reject(new Error(gotAudio ? "no-speech" : "audio-capture")));
    }, timeoutMs);

    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
      fn();
    };

    const onAbort = () => {
      try {
        rec.abort();
      } catch {
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
      }
      settle(() => reject(new Error("aborted")));
    };

    options?.signal?.addEventListener("abort", onAbort, { once: true });

    rec.onaudiostart = () => {
      gotAudio = true;
      options?.onAudioStart?.();
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        const text = String(res?.[0]?.transcript ?? "");
        if (res.isFinal) finalTranscript += text;
        else interim += text;
      }
      if (interim.trim()) {
        bestInterim = interim.trim();
        options?.onInterim?.(bestInterim);
      }
      if (finalTranscript.trim()) {
        const alt = event.results[event.results.length - 1]?.[0];
        settle(() =>
          resolve({
            transcript: finalTranscript.trim(),
            confidence: typeof alt?.confidence === "number" ? alt.confidence : 0,
          })
        );
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;
      settle(() => reject(new Error(event.error || "unknown")));
    };

    rec.onend = () => {
      if (settled) return;
      // Ended without a final result. If we caught interim words, use them;
      // otherwise report whether the mic ever delivered audio.
      if (bestInterim) {
        settle(() => resolve({ transcript: bestInterim, confidence: 0 }));
      } else {
        settle(() => reject(new Error(gotAudio ? "no-speech" : "audio-capture")));
      }
    };

    try {
      rec.start();
    } catch {
      settle(() => reject(new Error("start-failed")));
    }
  });
}
