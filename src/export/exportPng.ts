import { createNoiseFields } from '../engine/noise';
import { createScratch, makeCanvas, renderFrame } from '../engine/renderer';
import { buildContentCanvas, type SceneState } from '../engine/scene';
import { canvasToPngBlob, downloadBlob } from './utils';

export async function exportPng(state: SceneState, t: number, filename = 'distortion.png') {
  const { width: W, height: H } = state.format;
  const content = buildContentCanvas(state);
  const fields = createNoiseFields(state.distortion.seed);
  const scratch = createScratch(W, H);
  const out = makeCanvas(W, H);
  const ctx = out.getContext('2d') as CanvasRenderingContext2D;

  renderFrame(ctx, W, H, t, {
    content,
    distortion: state.distortion,
    fields,
    background: state.background,
    scratch,
  });

  const blob = await canvasToPngBlob(out);
  downloadBlob(blob, filename);
}
