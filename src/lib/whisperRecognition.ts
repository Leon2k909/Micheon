// In-app offline speech recognition via Whisper (OpenAI's open model, run with
// transformers.js). This is the desktop-app counterpart to edge-tts: free, no
// API key, no account. The first mic check downloads a small (~40MB) model from
// the Hugging Face hub, then it works fully offline forever (cached by the app).
//
// It exists because the browser's webkitSpeechRecognition can't reach Google's
// servers from Electron. The whole module is lazy — the heavy ML library is only
// imported the first time the mic check runs, so it never bloats the website.

type ListenState = "loading-model" | "listening" | "transcribing";

export type WhisperListenOptions = {
  signal?: AbortSignal;
  /** Target language tag: de-DE | en-US | fr-FR. */
  lang?: string;
  /** Progress callback so the UI can show "preparing model" / "listening". */
  onState?: (state: ListenState) => void;
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

/** Lazily load (and cache) the Whisper pipeline. First call downloads the model. */
function getAsr(): Promise<any> {
  if (!asrPromise) {
    asrPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      // Single-threaded WASM needs no cross-origin isolation headers, so it runs
      // anywhere (website or Electron) without special server config.
      try { (env.backends as any).onnx.wasm.numThreads = 1; } catch { /* ignore */ }
      // whisper-tiny is multilingual (handles de/en/fr with one model). Force the
      // CPU/WASM backend. Use full-precision (fp32) weights: the 8-bit quantized
      // build fails on this onnxruntime-web version ("Missing required scale ...
      // MatMulNBits"), and fp32 avoids the n-bit matmul path entirely. Larger
      // one-time download (~150MB) but reliably compatible and still offline after.
      return pipeline("automatic-speech-recognition", "Xenova/whisper-tiny", {
        device: "wasm",
        dtype: "fp32",
      });
    })();
  }
  return asrPromise;
}

/** Warm the model in the background (optional) so the first real check is faster. */
export function preloadWhisper(): void {
  getAsr().catch(() => { asrPromise = null; });
}

export function isWhisperSupported(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

/**
 * Record one short utterance from the mic and return its transcript.
 * Records until ~1s of silence follows speech, or until maxMs, whichever comes first.
 */
export async function listenWhisperOnce(opts: WhisperListenOptions = {}): Promise<{ transcript: string }> {
  const maxMs = opts.maxMs ?? 8000;
  const language = LANG_MAP[opts.lang ?? "de-DE"] ?? "german";

  // Kick off model load (first time downloads it) and mic access together.
  opts.onState?.("loading-model");
  const asr = await getAsr();
  if (opts.signal?.aborted) throw new Error("aborted");

  opts.onState?.("listening");
  const audio = await recordUtterance(maxMs, opts.signal);
  if (opts.signal?.aborted) throw new Error("aborted");
  if (audio.length === 0) throw new Error("no-speech");

  opts.onState?.("transcribing");
  const out = await asr(audio, { language, task: "transcribe", chunk_length_s: 30 });
  const transcript = String((Array.isArray(out) ? out[0]?.text : out?.text) ?? "").trim();
  return { transcript };
}

/**
 * Capture mic audio as 16kHz mono Float32 (what Whisper expects). Uses an
 * AudioContext locked to 16kHz so no manual resampling is needed, plus a simple
 * RMS gate to stop shortly after the speaker goes quiet.
 */
async function recordUtterance(maxMs: number, signal?: AbortSignal): Promise<Float32Array> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const AudioCtx: typeof AudioContext =
    (window as any).AudioContext ?? (window as any).webkitAudioContext;
  const ctx = new AudioCtx({ sampleRate: 16000 });

  const source = ctx.createMediaStreamSource(stream);
  const processor = ctx.createScriptProcessor(4096, 1, 1);
  const mute = ctx.createGain();
  mute.gain.value = 0; // route to destination so onaudioprocess fires, but stay silent

  const chunks: Float32Array[] = [];
  let sawSpeech = false;
  let silenceStartedAt = 0;

  const cleanup = () => {
    try { processor.disconnect(); } catch { /* */ }
    try { source.disconnect(); } catch { /* */ }
    try { mute.disconnect(); } catch { /* */ }
    stream.getTracks().forEach((t) => t.stop());
    ctx.close().catch(() => {});
  };

  return await new Promise<Float32Array>((resolve, reject) => {
    const startedAt = ctx.currentTime;
    let finished = false;

    const finish = (ok: boolean) => {
      if (finished) return;
      finished = true;
      cleanup();
      if (!ok) return reject(new Error("aborted"));
      const total = chunks.reduce((n, c) => n + c.length, 0);
      const merged = new Float32Array(total);
      let offset = 0;
      for (const c of chunks) { merged.set(c, offset); offset += c.length; }
      resolve(merged);
    };

    signal?.addEventListener("abort", () => finish(false), { once: true });

    processor.onaudioprocess = (e: AudioProcessingEvent) => {
      const input = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(input));

      let sumSq = 0;
      for (let i = 0; i < input.length; i++) sumSq += input[i] * input[i];
      const rms = Math.sqrt(sumSq / input.length);
      const now = ctx.currentTime;

      if (rms > 0.015) {
        sawSpeech = true;
        silenceStartedAt = 0;
      } else if (sawSpeech && silenceStartedAt === 0) {
        silenceStartedAt = now;
      }

      const elapsedMs = (now - startedAt) * 1000;
      const silentLongEnough = sawSpeech && silenceStartedAt > 0 && now - silenceStartedAt > 1.0;
      if (silentLongEnough || elapsedMs >= maxMs) finish(true);
    };

    source.connect(processor);
    processor.connect(mute);
    mute.connect(ctx.destination);
  });
}
