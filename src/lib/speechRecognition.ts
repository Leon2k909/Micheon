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
};

/**
 * Listen for a single German utterance and return the best transcript.
 * Cancels any in-progress speech synthesis to reduce echo.
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
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let settled = false;

    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
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

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (!last?.[0]) return;
      const alt = last[0];
      settle(() =>
        resolve({
          transcript: String(alt.transcript ?? "").trim(),
          confidence: typeof alt.confidence === "number" ? alt.confidence : 0,
        })
      );
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;
      settle(() => reject(new Error(event.error || "unknown")));
    };

    rec.onend = () => {
      if (!settled) settle(() => reject(new Error("no-speech")));
    };

    try {
      rec.start();
    } catch {
      settle(() => reject(new Error("start-failed")));
    }
  });
}
