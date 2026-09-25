export type ContentMode = 'text' | 'image';

export interface FormatPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export type TextAlign = 'left' | 'center' | 'right';

export interface TextSettings {
  text: string;
  fontFamily: string;
  fontWeight: number;
  uppercase: boolean;
  fontSizeMode: 'auto' | 'manual';
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  align: TextAlign;
  color: string;
}

export interface ImageSettings {
  src: string | null;
  fit: 'cover' | 'contain';
}

export interface BackgroundSettings {
  mode: 'solid' | 'transparent';
  color: string;
}

export interface DistortionSettings {
  amplitude: number;
  stretch: number;
  waveAmplitude: number;
  frequency: number;
  octaves: number;
  speed: number;
  seed: number;
  echoLayers: number;
  echoSpacing: number;
  echoFade: number;
  echoTimeOffset: number;
  loop: boolean;
  loopDuration: number;
}

export interface DistortionPreset {
  id: string;
  label: string;
  values: Omit<DistortionSettings, 'seed' | 'loop' | 'loopDuration'>;
}

export interface BlobSettings {
  enabled: boolean;
  copies: number;
  spread: number;
  blur: number;
  threshold: number;
}

export interface BlobPreset {
  id: string;
  label: string;
  values: BlobSettings;
}
