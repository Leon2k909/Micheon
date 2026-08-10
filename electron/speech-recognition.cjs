const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const extractZip = require("extract-zip");

const fsp = fs.promises;

const WHISPER_RUNTIME_VERSION = "1.9.2";
const WHISPER_RUNTIME_URL = `https://github.com/ggml-org/whisper.cpp/releases/download/v${WHISPER_RUNTIME_VERSION}/whisper-bin-x64.zip`;
const WHISPER_RUNTIME_SHA256 = "49dcc16de826f20bd53d44f947a1ae49dfa81f86cad67a64d80820cb192d674a";
const WHISPER_MODEL_NAME = "large-v3-turbo-q5_0";
const WHISPER_MODEL_FILE = `ggml-${WHISPER_MODEL_NAME}.bin`;
const WHISPER_MODEL_URL = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${WHISPER_MODEL_FILE}`;
const WHISPER_MODEL_SHA256 = "394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2";
const WHISPER_MODEL_SIZE = 574041195;
const MAX_RECORDING_BYTES = 32 * 1024 * 1024;
const INSTALL_RETRY_BASE_MS = 30 * 1000;
const INSTALL_RETRY_MAX_MS = 10 * 60 * 1000;

function humanError(error) {
  const message = String(error?.message ?? error ?? "Unknown error");
  if (/abort/i.test(message)) return "Speech recognition installation was stopped.";
  if (/ENOSPC/i.test(message)) return "There is not enough free space to install speech recognition.";
  if (/fetch|network|HTTP|socket|ECONN/i.test(message)) {
    return "Micheon could not download speech recognition. It will retry automatically.";
  }
  return message.replace(/[\r\n]+/g, " ").slice(0, 240);
}

async function fileSize(filePath) {
  try {
    return (await fsp.stat(filePath)).size;
  } catch {
    return -1;
  }
}

async function hashExistingFile(filePath, hash) {
  if ((await fileSize(filePath)) <= 0) return;
  await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", resolve);
  });
}

async function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  await hashExistingFile(filePath, hash);
  return hash.digest("hex");
}

function parseContentRangeTotal(value) {
  const match = String(value ?? "").match(/\/([0-9]+)$/);
  return match ? Number(match[1]) : 0;
}

function parseWhisperJson(value) {
  const segments = Array.isArray(value?.transcription)
    ? value.transcription
    : Array.isArray(value?.segments)
      ? value.segments
      : Array.isArray(value?.result?.segments)
        ? value.result.segments
        : [];
  const text = String(
    value?.text
      ?? value?.result?.text
      ?? segments.map((segment) => segment?.text ?? "").join("")
  ).trim();
  const tokens = segments.flatMap((segment) => {
    if (!Array.isArray(segment?.tokens)) return [];
    return segment.tokens.map((token) => ({
      text: String(token?.text ?? token?.token ?? ""),
      probability: Number.isFinite(Number(token?.p ?? token?.probability))
        ? Math.max(0, Math.min(1, Number(token?.p ?? token?.probability)))
        : null,
    }));
  }).filter((token) => token.text);
  return {
    language: String(value?.result?.language ?? value?.language ?? ""),
    text,
    tokens,
  };
}

function recordingBuffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value?.type === "Buffer" && Array.isArray(value.data)) return Buffer.from(value.data);
  return Buffer.alloc(0);
}

/** Seconds of audio in a PCM WAV, read from its own header rather than assumed. */
function wavDurationSeconds(audio) {
  if (!Buffer.isBuffer(audio) || audio.length < 44) return 0;
  const channels = audio.readUInt16LE(22) || 1;
  const sampleRate = audio.readUInt32LE(24) || 16000;
  const bits = audio.readUInt16LE(34) || 16;
  const bytesPerSecond = sampleRate * channels * (bits / 8);
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) return 0;
  return Math.max(0, (audio.length - 44) / bytesPerSecond);
}

/**
 * How hard to work, and how much of the window to look at.
 *
 * Two defaults were costing about fifteen seconds per attempt, measured on a
 * five-second clip: 16.6s as shipped, 2.4s with both of these.
 *
 * THREADS. whisper.cpp defaults to four, whatever the machine has. On a
 * sixteen-core machine that leaves twelve cores idle while the learner waits.
 * Two are left free so the app itself stays responsive, and the floor is the
 * old default, so a small machine is never made slower than it was.
 *
 * AUDIO CONTEXT. The encoder always processes a THIRTY-SECOND window, padding
 * whatever it is given — which is why a five-second clip and a ten-second clip
 * both took seventeen seconds. Sizing the context to the recording, with a
 * two-second margin, is the whole difference. It is a real trade: too small a
 * context truncates. So it is derived from the clip rather than fixed, floored
 * well above anything a spoken sentence needs, and dropped entirely past
 * twenty-five seconds, where the full window is what you want anyway.
 *
 * Checked on synthesised speech at 5.4s and 9.9s: the transcript is
 * word-for-word identical to the full-context one. That is two clips in
 * English, not a proof about German — hence the deliberately generous margin.
 */
function transcriptionTuning(audio, cpuCount = os.cpus().length) {
  const args = [];
  const cores = Number.isFinite(cpuCount) && cpuCount > 0 ? Math.floor(cpuCount) : 4;
  const threads = Math.min(16, Math.max(4, cores - 2));
  args.push("-t", String(threads));

  const seconds = wavDurationSeconds(audio);
  // 1500 is the full window: 30 seconds of mel frames.
  const needed = Math.ceil((1500 * (seconds + 2)) / 30);
  if (seconds > 0 && seconds <= 25 && needed < 1500) {
    args.push("-ac", String(Math.max(256, needed)));
  }
  return args;
}

function createSpeechRecognitionManager(options) {
  const userDataPath = path.resolve(options.userDataPath);
  const root = path.join(userDataPath, "speech-recognition");
  const runtimeDir = path.join(root, `whisper-cpp-${WHISPER_RUNTIME_VERSION}`);
  const runtimeExecutable = path.join(runtimeDir, "Release", "whisper-cli.exe");
  const modelPath = path.join(root, "models", WHISPER_MODEL_FILE);
  const manifestPath = path.join(root, "install.json");
  const downloadDir = path.join(root, "downloads");
  const tempDir = path.join(root, "temp");
  const runtimeArchive = path.join(downloadDir, `whisper-bin-x64-${WHISPER_RUNTIME_VERSION}.zip`);
  const platform = options.platform ?? process.platform;
  const arch = options.arch ?? process.arch;
  const fetchImpl = options.fetchImpl;
  const spawnImpl = options.spawnImpl ?? spawn;
  const extractImpl = options.extractImpl ?? extractZip;

  let installPromise = null;
  let installAbort = null;
  let installRetryTimer = null;
  let installRetryDelayMs = INSTALL_RETRY_BASE_MS;
  let activeProcess = null;
  let lastProgressPublish = 0;
  let status = {
    enabled: options.isEnabled() !== false,
    state: options.isEnabled() === false ? "disabled" : "checking",
    progress: 0,
    downloadedBytes: 0,
    totalBytes: WHISPER_MODEL_SIZE,
    modelName: WHISPER_MODEL_NAME,
    modelSizeBytes: WHISPER_MODEL_SIZE,
    runtimeVersion: WHISPER_RUNTIME_VERSION,
    message: "",
  };

  function publish(patch = {}, force = true) {
    status = {
      ...status,
      ...patch,
      enabled: options.isEnabled() !== false,
      modelName: WHISPER_MODEL_NAME,
      modelSizeBytes: WHISPER_MODEL_SIZE,
      runtimeVersion: WHISPER_RUNTIME_VERSION,
    };
    if (force) options.onStatus?.({ ...status });
    return { ...status };
  }

  function assertManagedPath(target) {
    const resolved = path.resolve(target);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
      throw new Error("Refusing to alter a path outside Micheon's speech-recognition folder");
    }
  }

  function clearInstallRetry() {
    if (installRetryTimer) clearTimeout(installRetryTimer);
    installRetryTimer = null;
  }

  function shouldRetryInstall(error) {
    const message = String(error?.message ?? error ?? "");
    return options.isEnabled() !== false
      && !/abort|ENOSPC|unsupported/i.test(message);
  }

  function scheduleInstallRetry() {
    clearInstallRetry();
    const delay = installRetryDelayMs;
    installRetryDelayMs = Math.min(INSTALL_RETRY_MAX_MS, installRetryDelayMs * 2);
    installRetryTimer = setTimeout(() => {
      installRetryTimer = null;
      void ensureInstalled();
    }, delay);
    installRetryTimer.unref?.();
  }

  async function removeManaged(target) {
    assertManagedPath(target);
    await fsp.rm(target, { force: true, recursive: true });
  }

  async function readManifest() {
    try {
      return JSON.parse(await fsp.readFile(manifestPath, "utf8"));
    } catch {
      return {};
    }
  }

  async function writeManifest(value) {
    await fsp.mkdir(root, { recursive: true });
    await fsp.writeFile(manifestPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  }

  async function installedParts() {
    const manifest = await readManifest();
    const runtimeReady = manifest.runtimeVersion === WHISPER_RUNTIME_VERSION
      && manifest.runtimeSha256 === WHISPER_RUNTIME_SHA256
      && (await fileSize(runtimeExecutable)) > 0;
    const modelReady = manifest.modelName === WHISPER_MODEL_NAME
      && manifest.modelSha256 === WHISPER_MODEL_SHA256
      && (await fileSize(modelPath)) === WHISPER_MODEL_SIZE;
    return { manifest, modelReady, runtimeReady };
  }

  async function downloadFile({ url, destination, expectedSha256, expectedSize, state, signal }) {
    await fsp.mkdir(path.dirname(destination), { recursive: true });
    const partial = `${destination}.partial`;
    let offset = Math.max(0, await fileSize(partial));
    if (offset > expectedSize) {
      await fsp.rm(partial, { force: true });
      offset = 0;
    }
    // A crash can land after the final byte is flushed but before the atomic
    // rename. Verify that complete partial instead of requesting an impossible
    // byte range and getting stuck on HTTP 416 forever.
    if (expectedSize && offset === expectedSize) {
      const digest = await sha256File(partial);
      if (!expectedSha256 || digest === expectedSha256) {
        await fsp.rm(destination, { force: true });
        await fsp.rename(partial, destination);
        return offset;
      }
      await fsp.rm(partial, { force: true });
      offset = 0;
    }
    const headers = offset > 0 ? { Range: `bytes=${offset}-` } : undefined;
    let response = await fetchImpl(url, { headers, signal });
    if (!response.ok && response.status !== 206) {
      throw new Error(`HTTP ${response.status} while downloading speech recognition`);
    }

    let append = offset > 0 && response.status === 206;
    if (!append) {
      offset = 0;
      await fsp.rm(partial, { force: true });
    }
    const contentLength = Number(response.headers.get("content-length")) || 0;
    const total = parseContentRangeTotal(response.headers.get("content-range"))
      || (contentLength ? offset + contentLength : expectedSize);
    const hash = crypto.createHash("sha256");
    if (append) await hashExistingFile(partial, hash);
    const handle = await fsp.open(partial, append ? "a" : "w");
    let downloaded = offset;
    try {
      const reader = response.body?.getReader();
      if (!reader) throw new Error("The download service returned no data");
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (signal.aborted) throw new Error("aborted");
        const chunk = Buffer.from(value);
        await handle.write(chunk);
        hash.update(chunk);
        downloaded += chunk.length;
        const now = Date.now();
        if (now - lastProgressPublish >= 160) {
          lastProgressPublish = now;
          publish({
            state,
            progress: total > 0 ? Math.min(100, Math.round((downloaded / total) * 100)) : 0,
            downloadedBytes: downloaded,
            totalBytes: total || expectedSize,
            message: "",
          });
        }
      }
    } finally {
      await handle.close();
    }

    const digest = hash.digest("hex");
    if (expectedSize && downloaded !== expectedSize) {
      throw new Error(`Speech recognition download was incomplete (${downloaded} of ${expectedSize} bytes)`);
    }
    if (expectedSha256 && digest !== expectedSha256) {
      await fsp.rm(partial, { force: true });
      throw new Error("Speech recognition download failed its integrity check");
    }
    await fsp.rm(destination, { force: true });
    await fsp.rename(partial, destination);
    return downloaded;
  }

  async function installRuntime(signal, manifest) {
    publish({
      state: "downloading-runtime",
      progress: 0,
      downloadedBytes: 0,
      totalBytes: 8194445,
      message: "Downloading the speech engine",
    });
    await downloadFile({
      url: WHISPER_RUNTIME_URL,
      destination: runtimeArchive,
      expectedSha256: WHISPER_RUNTIME_SHA256,
      expectedSize: 8194445,
      state: "downloading-runtime",
      signal,
    });
    const installingDir = `${runtimeDir}.installing`;
    await removeManaged(installingDir);
    await fsp.mkdir(installingDir, { recursive: true });
    publish({ state: "installing-runtime", progress: 100, message: "Installing the speech engine" });
    await extractImpl(runtimeArchive, { dir: installingDir });
    const installingExecutable = path.join(installingDir, "Release", "whisper-cli.exe");
    if ((await fileSize(installingExecutable)) <= 0) {
      await removeManaged(installingDir);
      throw new Error("The speech engine archive did not contain whisper-cli.exe");
    }
    await removeManaged(runtimeDir);
    await fsp.rename(installingDir, runtimeDir);
    await fsp.rm(runtimeArchive, { force: true });
    await writeManifest({
      ...manifest,
      runtimeVersion: WHISPER_RUNTIME_VERSION,
      runtimeSha256: WHISPER_RUNTIME_SHA256,
      installedAt: new Date().toISOString(),
    });
  }

  async function installModel(signal, manifest) {
    // Likewise, if the verified model was renamed just before a crash but its
    // manifest was not written, recover it in place. Re-downloading 574 MB for
    // a missing 200-byte manifest would be wasteful and surprising.
    if ((await fileSize(modelPath)) === WHISPER_MODEL_SIZE) {
      publish({
        state: "downloading-model",
        progress: 100,
        downloadedBytes: WHISPER_MODEL_SIZE,
        totalBytes: WHISPER_MODEL_SIZE,
        message: "Verifying the offline speech model",
      });
      if ((await sha256File(modelPath)) === WHISPER_MODEL_SHA256) {
        await writeManifest({
          ...manifest,
          runtimeVersion: WHISPER_RUNTIME_VERSION,
          runtimeSha256: WHISPER_RUNTIME_SHA256,
          modelName: WHISPER_MODEL_NAME,
          modelSha256: WHISPER_MODEL_SHA256,
          modelSizeBytes: WHISPER_MODEL_SIZE,
          installedAt: new Date().toISOString(),
        });
        return;
      }
      await fsp.rm(modelPath, { force: true });
    }
    publish({
      state: "downloading-model",
      progress: 0,
      downloadedBytes: 0,
      totalBytes: WHISPER_MODEL_SIZE,
      message: "Downloading high-accuracy speech recognition",
    });
    await downloadFile({
      url: WHISPER_MODEL_URL,
      destination: modelPath,
      expectedSha256: WHISPER_MODEL_SHA256,
      expectedSize: WHISPER_MODEL_SIZE,
      state: "downloading-model",
      signal,
    });
    await writeManifest({
      ...manifest,
      runtimeVersion: WHISPER_RUNTIME_VERSION,
      runtimeSha256: WHISPER_RUNTIME_SHA256,
      modelName: WHISPER_MODEL_NAME,
      modelSha256: WHISPER_MODEL_SHA256,
      modelSizeBytes: WHISPER_MODEL_SIZE,
      installedAt: new Date().toISOString(),
    });
  }

  async function ensureInstalled() {
    if (options.isEnabled() === false) return publish({ state: "disabled", progress: 0, message: "" });
    if (platform !== "win32" || arch !== "x64") {
      return publish({
        state: "unsupported",
        message: "This speech engine currently supports 64-bit Windows installs.",
      });
    }
    if (installPromise) return installPromise;
    clearInstallRetry();
    installAbort = new AbortController();
    installPromise = (async () => {
      await fsp.mkdir(root, { recursive: true });
      let parts = await installedParts();
      if (!parts.runtimeReady) {
        await installRuntime(installAbort.signal, parts.manifest);
        parts = await installedParts();
      }
      if (!parts.modelReady) {
        await installModel(installAbort.signal, parts.manifest);
      }
      installRetryDelayMs = INSTALL_RETRY_BASE_MS;
      return publish({
        state: "ready",
        progress: 100,
        downloadedBytes: WHISPER_MODEL_SIZE,
        totalBytes: WHISPER_MODEL_SIZE,
        message: "Ready for offline speaking practice",
      });
    })().catch((error) => {
      if (options.isEnabled() === false) {
        return publish({ state: "disabled", progress: 0, message: "" });
      }
      if (shouldRetryInstall(error)) scheduleInstallRetry();
      return publish({ state: "error", message: humanError(error) });
    }).finally(() => {
      installAbort = null;
      installPromise = null;
    });
    return installPromise;
  }

  async function getStatus() {
    if (options.isEnabled() === false) return publish({ state: "disabled", progress: 0, message: "" }, false);
    if (installPromise || status.state === "transcribing") return { ...status };
    const parts = await installedParts();
    return publish({
      state: parts.runtimeReady && parts.modelReady ? "ready" : "missing",
      progress: parts.runtimeReady && parts.modelReady ? 100 : 0,
      downloadedBytes: parts.modelReady ? WHISPER_MODEL_SIZE : 0,
      totalBytes: WHISPER_MODEL_SIZE,
      message: parts.runtimeReady && parts.modelReady ? "Ready for offline speaking practice" : "Preparing automatic installation",
    }, false);
  }

  async function install() {
    options.setEnabled(true);
    clearInstallRetry();
    installRetryDelayMs = INSTALL_RETRY_BASE_MS;
    publish({ enabled: true, state: "checking", message: "Preparing automatic installation" });
    return ensureInstalled();
  }

  async function uninstall() {
    options.setEnabled(false);
    clearInstallRetry();
    installAbort?.abort();
    if (activeProcess) {
      try { activeProcess.kill(); } catch { /* already gone */ }
    }
    if (installPromise) await installPromise.catch(() => {});
    await removeManaged(root);
    return publish({
      enabled: false,
      state: "disabled",
      progress: 0,
      downloadedBytes: 0,
      message: "",
    });
  }

  async function runWhisper(args, timeoutMs = 180000) {
    return new Promise((resolve, reject) => {
      let stderr = "";
      const child = spawnImpl(runtimeExecutable, args, {
        cwd: path.dirname(runtimeExecutable),
        windowsHide: true,
        stdio: ["ignore", "ignore", "pipe"],
        env: {
          ...process.env,
          PATH: `${path.dirname(runtimeExecutable)}${path.delimiter}${process.env.PATH ?? ""}`,
        },
      });
      activeProcess = child;
      const timer = setTimeout(() => {
        try { child.kill(); } catch { /* ignore */ }
        reject(new Error("Speech recognition took too long. Try a shorter recording."));
      }, timeoutMs);
      timer.unref?.();
      child.stderr?.on("data", (chunk) => {
        if (stderr.length < 64000) stderr += String(chunk);
      });
      child.on("error", (error) => {
        clearTimeout(timer);
        activeProcess = null;
        reject(error);
      });
      child.on("exit", (code) => {
        clearTimeout(timer);
        activeProcess = null;
        if (code === 0) resolve();
        else reject(new Error(stderr.trim().slice(-1200) || `whisper.cpp exited with code ${code}`));
      });
    });
  }

  async function transcribe(payload) {
    if (options.isEnabled() === false) throw new Error("Speech recognition was uninstalled in Settings.");
    const ready = await ensureInstalled();
    if (ready.state !== "ready") throw new Error(ready.message || "Speech recognition is not ready yet.");
    if (activeProcess) throw new Error("Speech recognition is already processing another recording.");
    const audio = recordingBuffer(payload?.audio);
    if (audio.length < 44 || audio.length > MAX_RECORDING_BYTES) throw new Error("The microphone recording was empty or too long.");
    if (audio.toString("ascii", 0, 4) !== "RIFF" || audio.toString("ascii", 8, 12) !== "WAVE") {
      throw new Error("Micheon received an invalid microphone recording.");
    }

    await fsp.mkdir(tempDir, { recursive: true });
    const id = crypto.randomUUID();
    const inputPath = path.join(tempDir, `${id}.wav`);
    const outputBase = path.join(tempDir, id);
    const outputPath = `${outputBase}.json`;
    await fsp.writeFile(inputPath, audio);
    publish({ state: "transcribing", message: "Checking your pronunciation" });
    const startedAt = Date.now();
    try {
      const language = String(payload?.language ?? "de").toLowerCase().startsWith("en") ? "en" : "de";
      await runWhisper([
        "-m", modelPath,
        "-f", inputPath,
        "-l", language,
        "-ojf",
        "-of", outputBase,
        "-np",
        "--no-gpu",
        ...transcriptionTuning(audio),
      ]);
      const parsed = parseWhisperJson(JSON.parse(await fsp.readFile(outputPath, "utf8")));
      return { ...parsed, durationMs: Date.now() - startedAt };
    } finally {
      await fsp.rm(inputPath, { force: true }).catch(() => {});
      await fsp.rm(outputPath, { force: true }).catch(() => {});
      const parts = await installedParts();
      publish({
        state: parts.runtimeReady && parts.modelReady ? "ready" : "missing",
        progress: parts.runtimeReady && parts.modelReady ? 100 : 0,
        message: parts.runtimeReady && parts.modelReady ? "Ready for offline speaking practice" : "Preparing automatic installation",
      });
    }
  }

  function dispose() {
    clearInstallRetry();
    installAbort?.abort();
    if (activeProcess) {
      try { activeProcess.kill(); } catch { /* already gone */ }
    }
  }

  return {
    dispose,
    ensureInstalled,
    getStatus,
    install,
    paths: { manifestPath, modelPath, root, runtimeExecutable },
    transcribe,
    uninstall,
  };
}

module.exports = {
  MAX_RECORDING_BYTES,
  WHISPER_MODEL_FILE,
  WHISPER_MODEL_NAME,
  WHISPER_MODEL_SHA256,
  WHISPER_MODEL_SIZE,
  WHISPER_MODEL_URL,
  WHISPER_RUNTIME_SHA256,
  WHISPER_RUNTIME_URL,
  WHISPER_RUNTIME_VERSION,
  createSpeechRecognitionManager,
  parseWhisperJson,
  recordingBuffer,
  transcriptionTuning,
  wavDurationSeconds,
};
