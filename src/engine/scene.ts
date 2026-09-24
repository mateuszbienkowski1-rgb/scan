import { makeCanvas, type Scratch } from './renderer';
import { drawImageContent, drawTextContent } from './source';
import type { BackgroundSettings, ContentMode, DistortionSettings, FormatPreset, ImageSettings, TextSettings } from '../types';

export interface SceneState {
  format: FormatPreset;
  contentMode: ContentMode;
  text: TextSettings;
  image: ImageSettings;
  imageEl: HTMLImageElement | null;
  background: BackgroundSettings;
  distortion: DistortionSettings;
}

export function buildContentCanvas(state: SceneState) {
  const { width: W, height: H } = state.format;
  const content = makeCanvas(W, H);
  if (state.contentMode === 'text') {
    drawTextContent(content, W, H, state.text);
  } else {
    drawImageContent(content, W, H, state.image, state.imageEl);
  }
  return content;
}

export type { Scratch };
