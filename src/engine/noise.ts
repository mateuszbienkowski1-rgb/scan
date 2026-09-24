import { createNoise4D, type NoiseFunction4D } from 'simplex-noise';

// Deterministic PRNG so the same seed always produces the same noise field.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededNoise4D(seed: number): NoiseFunction4D {
  return createNoise4D(mulberry32(seed));
}

export interface NoiseFields {
  shift: NoiseFunction4D;
  stretch: NoiseFunction4D;
  wave: NoiseFunction4D;
}

export function createNoiseFields(seed: number): NoiseFields {
  return {
    shift: createSeededNoise4D(seed),
    stretch: createSeededNoise4D(seed + 7919),
    wave: createSeededNoise4D(seed + 15361),
  };
}

/** Fractal Brownian motion: layers several octaves of the 4D noise field together. */
export function fbm4(
  noise: NoiseFunction4D,
  x: number,
  y: number,
  z: number,
  w: number,
  octaves: number,
): number {
  let sum = 0;
  let ampSum = 0;
  let amp = 1;
  let freqMul = 1;
  const count = Math.max(1, Math.round(octaves));
  for (let o = 0; o < count; o++) {
    sum += noise(x * freqMul, y * freqMul, z * freqMul, w * freqMul) * amp;
    ampSum += amp;
    amp *= 0.5;
    freqMul *= 2;
  }
  return ampSum > 0 ? sum / ampSum : 0;
}
