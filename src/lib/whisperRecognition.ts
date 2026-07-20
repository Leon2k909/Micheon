// In-app offline speech recognition via Whisper (OpenAI's open model, run with
// transformers.js). This is the desktop-app counterpart to edge-tts: free, no
// API key, no account. The first mic check downloads the model from the Hugging
// Face hub, then it works fully offline forever (cached by the app).
//
// It exists because the browser's webkitSpeechRecognition can't reach Google's
// servers from Electron. The whole module is lazy — the heavy ML library is only
// imported the first time the mic is used (or preloaded), so it never bloats the
// website bundle.
//
// Design notes (learned the hard way):
//  - Recording starts IMMEDIATELY and the model loads in PARALLEL. Waiting for
//    the model first meant the user spoke into a mic that wasn't recording yet.
//  - Stopping keeps the audio. A second tap is "I'm done", not "throw it away".
//  - Download progress is reported so the UI can show it; a silent multi-minute
//    download is indistinguishable from a broken button.

type ListenState = "loading-model" | "listening" | "transcribing";

export type WhisperListenOptions = {
  /** Hard cancel — discards audio. A graceful "I'm done" is `stop()` on the handle. */
  signal?: AbortSignal;
  /** Target language tag: de-DE | en-US | fr-FR. */
  lang?: string;
  /** Progress callback so the UI can show "preparing model" / "listening". */
  onState?: (state: ListenState) => void;
  /** Model download progress, 0-100, while state is "loading-model". */
  onProgress?: (percent: number) => void;
  /** Live mic level 0-1 while recording, so the UI can prove it's hearing you. */
  onLevel?: (level: number) => void;
  /** Hard cap on recording length (ms). */
  maxMs?: number;
};

const LANG_MAP: Record<string, string> = {
  "de-DE": "german",
  "en-US": "english",
  "en-GB": "english",
  "fr-FR": "french",
};

let asrPromise: Promise<any> | null = null;
let modelReady = false;
let lastProgress = 0;

/** True once the model is downloaded and warm — the UI can skip the wait copy. */
export function isWhisperReady(): boolean {
  return modelReady;
}

/** Lazily load (and cache) the Whisper pipeline. First call downloads the model. */
function getAsr(onProgress?: (p: number) => void): Promise<any> {
  if (!asrPromise) {
    asrPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      // Multi-threaded WASM needs SharedArrayBuffer, which needs cross-origin
      // isolation. Use threads when the page actually has it, else fall back to
      // one thread (correct everywhere, just slower).
      try {
        const isolated = typeof globalThis !== "undefined" && (globalThis as any).crossOriginIsolated;
        const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 1 : 1;
        (env.backends as any).onnx.wasm.numThreads = isolated ? Math.max(1, Math.min(4, cores - 1)) : 1;
      } catch { /* ignore */ }
      // whisper-tiny is multilingual (handles de/en/fr with one model). Force the
      // CPU/WASM backend. Use full-precision (fp32) weights: the 8-bit quantized
      // build fails on this onnxruntime-web version ("Missing required scale ...
      // MatMulNBits"), and fp32 avoids the n-bit matmul path entirely.
      const p = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny", {
        device: "wasm",
        dtype: "fp32",
        progress_callback: (e: any) => {
          if (!e) return;
          if (typeof e.progress === "number") {
            lastProgress = Math.max(0, Math.min(100, Math.round(e.progress)));
            onProgress?.(lastProgress);
          }
          if (e.status === "ready") { lastProgress = 100; onProgress?.(100); }
        },
      });
      modelReady = true;
      return p;
    })().catch((err) => { asrPromise = null; throw err; });
  } else if (onProgress && lastProgress) {
    onProgress(lastProgress);
  }
  return asrPromise;
}

/**
 * Warm the model in the background so the first real mic tap is instant.
 * Safe to call repeatedly; failures are swallowed and simply retried later.
 */
export function preloadWhisper(): void {
  getAsr().catch(() => { /* retried on demand */ });
}

export function isWhisperSupported(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

export type WhisperSession = {
  /** Resolves with the transcript once you stop (or the cap/silence hits). */
  result: Promise<{ transcript: string }>;
  /** "I'm done talking" — keeps what was captured and transcribes it. */
  stop: () => void;
};

/**
 * Start listening now and transcribe when the speaker stops.
 *
 * Recording begins immediately; the model loads concurrently, so nothing the
 * user says is lost to a cold download. Returns a handle whose `stop()` ends
 * the utterance gracefully (audio kept).
 */
export function listenWhisper(opts: WhisperListenOptions = {}): WhisperSession {
  const maxMs = opts.maxMs ?? 15000;
  const language = LANG_MAP[opts.lang ?? "de-DE"] ?? "german";

  // Kick the model load off first (non-blocking) so it overlaps the recording.
  const asrPromise = getAsr((p) => opts.onProgress?.(p));
  if (!modelReady) opts.onState?.("loading-model");

  const rec = startRecording(maxMs, opts.signal, opts.onLevel, () => {
    // Mic is live — tell the UI, unless the model download is still the headline.
    if (modelReady) opts.onState?.("listening");
  });

  const result = (async () => {
    const audio = await rec.done;
    if (opts.signal?.aborted) throw new Error("aborted");
    if (!audio.length) throw new Error("no-speech");
    opts.onState?.(modelReady ? "transcribing" : "loading-model");
    const asr = await asrPromise;
    if (opts.signal?.aborted) throw new Error("aborted");
    opts.onState?.("transcribing");
    const out = await asr(audio, { language, task: "transcribe", chunk_length_s: 30 });
    const transcript = String((Array.isArray(out) ? out[0]?.text : out?.text) ?? "").trim();
    return { transcript };
  })();

  return { result, stop: rec.stop };
}

/** Back-compat wrapper: start listening and await the transcript. */
export async function listenWhisperOnce(opts: WhisperListenOptions = {}): Promise<{ transcript: string }> {
  return listenWhisper(opts).result;
}

/**
 * Capture mic audio as 16kHz mono Float32 (what Whisper expects). Uses an
 * AudioContext locked to 16kHz so no manual resampling is needed, plus an
 * adaptive noise gate that stops shortly after the speaker goes quiet.
 */
function startRecording(
  maxMs: number,
  signal?: AbortSignal,
  onLevel?: (level: number) => void,
  onLive?: () => void
): { done: Promise<Float32Array>; stop: () => void } {
  let stopFn = () => {};
  const done = new Promise<Float32Array>((resolve, reject) => {
    let finished = false;
    let cleanup = () => {};
    const chunks: Float32Array[] = [];

    const finish = (keep: boolean) => {
      if (finished) return;
      finished = true;
      cleanup();
      if (!keep) return reject(new Error("aborted"));
      const total = chunks.reduce((n, c) => n + c.length, 0);
      const merged = new Float32Array(total);
      let offset = 0;
      for (const c of chunks) { merged.set(c, offset); offset += c.length; }
      resolve(merged);
    };
    // A deliberate stop KEEPS the audio — that's the user saying "I'm done".
    stopFn = () => finish(true);
    // A hard abort discards it.
    signal?.addEventListener("abort", () => finish(false), { once: true });

    navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    }).then((stream) => {
      if (finished) { stream.getTracks().forEach((t) => t.stop()); return; }
      const AudioCtx: typeof AudioContext =
        (window as any).AudioContext ?? (window as any).webkitAudioContext;
      const ctx = new AudioCtx({ sampleRate: 16000 });
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      const mute = ctx.createGain();
      mute.gain.value = 0; // keep onaudioprocess firing without echoing to speakers

      cleanup = () => {
        try { processor.disconnect(); } catch { /* */ }
        try { source.disconnect(); } catch { /* */ }
        try { mute.disconnect(); } catch { /* */ }
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => {});
      };

      const startedAt = ctx.currentTime;
      let sawSpeech = false;
      let silenceStartedAt = 0;
      // Calibrate the gate to the room instead of a fixed threshold: a quiet mic
      // used to never register speech, so it recorded silence until the cap.
      let noiseFloor = 0.004;
      let calibrating = true;

      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        const input = e.inputBuffer.getChannelData(0);
        chunks.push(new Float32Array(input));

        let sumSq = 0;
        for (let i = 0; i < input.length; i++) sumSq += input[i] * input[i];
        const rms = Math.sqrt(sumSq / input.length);
        const now = ctx.currentTime;
        const elapsed = now - startedAt;

        if (elapsed < 0.35) {
          // First moments: learn the room tone.
          noiseFloor = Math.max(noiseFloor, rms);
          onLevel?.(Math.min(1, rms * 12));
          return;
        }
        if (calibrating) { calibrating = false; onLive?.(); }

        const speechGate = Math.max(0.008, noiseFloor * 2.5);
        onLevel?.(Math.min(1, rms / (speechGate * 3)));

        if (rms > speechGate) {
          sawSpeech = true;
          silenceStartedAt = 0;
        } else if (sawSpeech && silenceStartedAt === 0) {
          silenceStartedAt = now;
        }

        const quietLongEnough = sawSpeech && silenceStartedAt > 0 && now - silenceStartedAt > 1.1;
        if (quietLongEnough || elapsed * 1000 >= maxMs) finish(true);
      };

      source.connect(processor);
      processor.connect(mute);
      mute.connect(ctx.destination);
    }).catch(() => finish(false));
  });

  return { done, stop: () => stopFn() };
}
