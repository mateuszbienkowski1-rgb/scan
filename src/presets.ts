import type { BlobPreset, DistortionPreset, FormatPreset } from './types';

export const FORMAT_PRESETS: FormatPreset[] = [
  { id: 'square', label: 'Post 1:1', width: 1080, height: 1080 },
  { id: 'portrait', label: 'Portrait 4:5', width: 1080, height: 1350 },
  { id: 'story', label: 'Story/Reel 9:16', width: 1080, height: 1920 },
  { id: 'landscape', label: 'Landscape 1.91:1', width: 1080, height: 566 },
];

export const DISTORTION_PRESETS: DistortionPreset[] = [
  {
    id: 'liquid-melt',
    label: 'Liquid Melt',
    values: {
      amplitude: 60,
      stretch: 0.5,
      waveAmplitude: 6,
      frequency: 0.005,
      octaves: 3,
      speed: 0.5,
      echoLayers: 3,
      echoSpacing: 22,
      echoFade: 0.4,
      echoTimeOffset: 0.3,
    },
  },
  {
    id: 'flag-wave',
    label: 'Flag Wave',
    values: {
      amplitude: 8,
      stretch: 0.08,
      waveAmplitude: 45,
      frequency: 0.008,
      octaves: 2,
      speed: 0.8,
      echoLayers: 0,
      echoSpacing: 0,
      echoFade: 0,
      echoTimeOffset: 0,
    },
  },
  {
    id: 'chaos',
    label: 'Chaos',
    values: {
      amplitude: 70,
      stretch: 0.6,
      waveAmplitude: 50,
      frequency: 0.012,
      octaves: 4,
      speed: 1.2,
      echoLayers: 4,
      echoSpacing: 18,
      echoFade: 0.5,
      echoTimeOffset: 0.2,
    },
  },
  {
    id: 'subtle',
    label: 'Subtle',
    values: {
      amplitude: 14,
      stretch: 0.1,
      waveAmplitude: 6,
      frequency: 0.004,
      octaves: 2,
      speed: 0.3,
      echoLayers: 1,
      echoSpacing: 10,
      echoFade: 0.3,
      echoTimeOffset: 0.4,
    },
  },
  {
    id: 'off',
    label: 'None',
    values: {
      amplitude: 0,
      stretch: 0,
      waveAmplitude: 0,
      frequency: 0.005,
      octaves: 1,
      speed: 0,
      echoLayers: 0,
      echoSpacing: 0,
      echoFade: 0,
      echoTimeOffset: 0,
    },
  },
];

export const BLOB_PRESETS: BlobPreset[] = [
  { id: 'off', label: 'Off', values: { enabled: false, copies: 5, spread: 6, blur: 10, threshold: 0.5 } },
  { id: 'bubble', label: 'Bubble', values: { enabled: true, copies: 4, spread: 4, blur: 8, threshold: 0.55 } },
  { id: 'goo', label: 'Goo', values: { enabled: true, copies: 6, spread: 9, blur: 15, threshold: 0.46 } },
  { id: 'mega-blob', label: 'Mega Blob', values: { enabled: true, copies: 8, spread: 16, blur: 26, threshold: 0.4 } },
];

export const FONT_OPTIONS = [
  { id: 'archivo-black', label: 'Archivo Black', family: '"Archivo Black", sans-serif', weight: 400 },
  { id: 'anton', label: 'Anton', family: '"Anton", sans-serif', weight: 400 },
  { id: 'bebas', label: 'Bebas Neue', family: '"Bebas Neue", sans-serif', weight: 400 },
  { id: 'inter-black', label: 'Inter Black', family: '"Inter", sans-serif', weight: 900 },
  { id: 'system', label: 'System Bold', family: 'system-ui, sans-serif', weight: 800 },
];
