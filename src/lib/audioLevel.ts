const PCM_MIDPOINT = 128;
const PCM_RANGE = 128;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/** Root-mean-square energy from an AnalyserNode byte time-domain frame. */
export function pcmRms(samples: ArrayLike<number>): number {
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
