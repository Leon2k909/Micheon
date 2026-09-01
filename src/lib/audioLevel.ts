const PCM_MIDPOINT = 128;
const PCM_RANGE = 128;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/** Root-mean-square energy from an AnalyserNode byte time-domain frame. */
function pcmRms(samples: ArrayLike<number>): number {
  if (!samples.length) return 0;
  let sumSquares = 0;
  for (let index = 0; index < samples.length; index += 1) {
    const centred = (Number(samples[index]) - PCM_MIDPOINT) / PCM_RANGE;
    sumSquares += centred * centred;
  }
  return Math.sqrt(sumSquares / samples.length);
}

/**
 * Turn PCM energy into a readable 0..1 speech level.
 *
 * The tiny floor removes MP3/background hiss. The gain makes ordinary speech
 * visibly distinct while still leaving headroom for genuinely louder syllables.
 */
export function speechLevelFromPcm(samples: ArrayLike<number>): number {
  return clamp01((pcmRms(samples) - 0.008) * 5.5);
}

/** Fast attack and slower release keep consonants responsive without flicker. */
export function smoothSpeechLevel(previous: number, next: number): number {
  const target = clamp01(next);
  const amount = target > previous ? 0.68 : 0.3;
  return clamp01(previous + (target - previous) * amount);
}

/**
 * Reduce an FFT frame to logarithmic speech-frequency bands.
 *
 * Each returned value represents a real frequency range from roughly 85 Hz
 * (low voice fundamentals) to 5.2 kHz (consonant detail). Using logarithmic
 * ranges gives the scarce low-frequency bins enough room while keeping the
 * high-frequency bars useful. This is a spectrum, not a decorative animation.
 */
export function speechSpectrumFromFft(
  samples: ArrayLike<number>,
  sampleRate: number,
  fftSize: number,
  bandCount = 12
): number[] {
  const count = Math.max(1, Math.floor(bandCount));
  const output = Array.from({ length: count }, () => 0);
  if (!samples.length || sampleRate <= 0 || fftSize <= 0) return output;

  const hertzPerBin = sampleRate / fftSize;
  const minimumHertz = 85;
  const maximumHertz = Math.min(5_200, sampleRate / 2);
  if (maximumHertz <= minimumHertz || hertzPerBin <= 0) return output;
  const frequencyRatio = maximumHertz / minimumHertz;

  for (let band = 0; band < count; band += 1) {
    const lowHertz = minimumHertz * Math.pow(frequencyRatio, band / count);
    const highHertz = minimumHertz * Math.pow(frequencyRatio, (band + 1) / count);
    const firstBin = Math.max(1, Math.floor(lowHertz / hertzPerBin));
    const finalBin = Math.min(samples.length, Math.max(firstBin + 1, Math.ceil(highHertz / hertzPerBin)));
    if (firstBin >= samples.length) continue;

    let peak = 0;
    let total = 0;
    let bins = 0;
    for (let bin = firstBin; bin < finalBin; bin += 1) {
      const magnitude = Math.max(0, Math.min(255, Number(samples[bin]) || 0));
      peak = Math.max(peak, magnitude);
      total += magnitude;
      bins += 1;
    }

    // A peak keeps narrow formants visible; the average prevents one noisy FFT
    // bin from making a bar jump to full height on its own.
    const combined = bins > 0 ? (peak * 0.68 + (total / bins) * 0.32) / 255 : 0;
    output[band] = clamp01((combined - 0.035) / 0.88);
  }

  return output;
}

/** Area-weighted down/up-sampling keeps the same spectrum shape at any UI size. */
export function resampleSpectrum(values: ArrayLike<number>, outputCount: number): number[] {
  const count = Math.max(1, Math.floor(outputCount));
  const sourceCount = values.length;
  if (!sourceCount) return Array.from({ length: count }, () => 0);
  if (sourceCount === count) {
    return Array.from({ length: count }, (_, index) => clamp01(Number(values[index]) || 0));
  }

  return Array.from({ length: count }, (_, outputIndex) => {
    const start = outputIndex * sourceCount / count;
    const end = (outputIndex + 1) * sourceCount / count;
    let weightedTotal = 0;
    let totalWeight = 0;
    const firstSource = Math.floor(start);
    const lastSource = Math.min(sourceCount - 1, Math.ceil(end) - 1);

    for (let sourceIndex = firstSource; sourceIndex <= lastSource; sourceIndex += 1) {
      const overlap = Math.max(0, Math.min(end, sourceIndex + 1) - Math.max(start, sourceIndex));
      weightedTotal += clamp01(Number(values[sourceIndex]) || 0) * overlap;
      totalWeight += overlap;
    }

    return totalWeight > 0 ? clamp01(weightedTotal / totalWeight) : 0;
  });
}
