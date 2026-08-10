export type SpeechRecorderOptions = {
  maxMs?: number;
  onLevel?: (level: number) => void;
  onLive?: () => void;
};

export type SpeechRecordingSession = {
  result: Promise<ArrayBuffer>;
  stop: () => void;
  cancel: () => void;
};

function resampleMono(input: Float32Array, sourceRate: number, targetRate = 16000): Float32Array {
  if (sourceRate === targetRate) return input;
  const ratio = sourceRate / targetRate;
  const output = new Float32Array(Math.max(1, Math.round(input.length / ratio)));
  for (let i = 0; i < output.length; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.max(start + 1, Math.floor((i + 1) * ratio)));
    let total = 0;
    for (let source = start; source < end; source += 1) total += input[source];
    output[i] = total / Math.max(1, end - start);
  }
  return output;
}

function encodePcmWav(samples: Float32Array, sampleRate = 16000): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeText = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };
  writeText(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return buffer;
}

export function startSpeechRecording(options: SpeechRecorderOptions = {}): SpeechRecordingSession {
  const maxMs = options.maxMs ?? 15000;
  let stop = () => {};
  let cancel = () => {};
  const result = new Promise<ArrayBuffer>((resolve, reject) => {
    let finished = false;
    let cleanup = () => {};
    let sampleRate = 48000;
    const chunks: Float32Array[] = [];

    const fail = (message: string) => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(new Error(message));
    };

    const finish = (keep: boolean) => {
      if (finished) return;
      finished = true;
      cleanup();
      if (!keep) {
        reject(new Error("aborted"));
        return;
      }
      const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
      if (!length) {
        reject(new Error("no-speech"));
        return;
      }
      const merged = new Float32Array(length);
      let offset = 0;
      chunks.forEach((chunk) => {
        merged.set(chunk, offset);
        offset += chunk.length;
      });
      resolve(encodePcmWav(resampleMono(merged, sampleRate)));
    };
    stop = () => finish(true);
    cancel = () => finish(false);

    navigator.mediaDevices.getUserMedia({
      audio: { autoGainControl: true, echoCancellation: true, noiseSuppression: true },
    }).then((stream) => {
      if (finished) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const AudioContextCtor = window.AudioContext
        ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) {
        stream.getTracks().forEach((track) => track.stop());
        fail("microphone-unavailable");
        return;
      }
      const context = new AudioContextCtor();
      sampleRate = context.sampleRate;
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      const mute = context.createGain();
      mute.gain.value = 0;
      cleanup = () => {
        try { processor.disconnect(); } catch { /* already disconnected */ }
        try { source.disconnect(); } catch { /* already disconnected */ }
        try { mute.disconnect(); } catch { /* already disconnected */ }
        stream.getTracks().forEach((track) => track.stop());
        void context.close();
      };

      const startedAt = context.currentTime;
      let noiseFloor = 0.004;
      let speechStarted = false;
      let silenceStartedAt = 0;
      let announcedLive = false;
      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        chunks.push(new Float32Array(input));
        let squareTotal = 0;
        for (let i = 0; i < input.length; i += 1) squareTotal += input[i] * input[i];
        const rms = Math.sqrt(squareTotal / Math.max(1, input.length));
        const elapsed = context.currentTime - startedAt;
        if (elapsed < 0.35) {
          noiseFloor = Math.max(noiseFloor, rms);
          options.onLevel?.(Math.min(1, rms * 12));
          return;
        }
        if (!announcedLive) {
          announcedLive = true;
          options.onLive?.();
        }
        const speechGate = Math.max(0.008, noiseFloor * 2.5);
        options.onLevel?.(Math.min(1, rms / (speechGate * 3)));
        if (rms > speechGate) {
          speechStarted = true;
          silenceStartedAt = 0;
        } else if (speechStarted && silenceStartedAt === 0) {
          silenceStartedAt = context.currentTime;
        }
        const finishedSpeaking = speechStarted
          && silenceStartedAt > 0
          && context.currentTime - silenceStartedAt > 1.1;
        if (finishedSpeaking || elapsed * 1000 >= maxMs) finish(true);
      };
      source.connect(processor);
      processor.connect(mute);
      mute.connect(context.destination);
    }).catch(() => fail("microphone-unavailable"));
  });
  return { cancel: () => cancel(), result, stop: () => stop() };
}
