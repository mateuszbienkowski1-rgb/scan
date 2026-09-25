import { applyBlobEffect } from './blob';
import { makeCanvas, type Scratch } from './renderer';
import { drawImageContent, drawTextContent } from './source';
import type { BackgroundSettings, BlobSettings, ContentMode, DistortionSettings, FormatPreset, ImageSettings, TextSettings } from '../types';

export interface SceneState {
  format: FormatPreset;
  contentMode: ContentMode;
  text: TextSettings;
  image: ImageSettings;
  imageEl: HTMLImageElement | null;
  background: BackgroundSettings;
  distortion: DistortionSettings;
  blob: BlobSettings;
}

export function buildContentCanvas(state: SceneState) {
  const { width: W, height: H } = state.format;
  const content = makeCanvas(W, H);
  if (state.contentMode === 'text') {
    drawTextContent(content, W, H, state.text);
  } else {
    drawImageContent(content, W, H, state.image, state.imageEl);
  }

  const solidColor = state.contentMode === 'text' ? state.text.color : null;
  return applyBlobEffect(content, W, H, state.blob, state.distortion.seed, solidColor);
}

export type { Scratch };
