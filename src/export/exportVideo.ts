import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, QUALITY_HIGH, WebMOutputFormat, getFirstEncodableVideoCodec, type VideoCodec } from 'mediabunny';
import { createNoiseFields } from '../engine/noise';
import { createScratch, renderFrame } from '../engine/renderer';
import { buildContentCanvas, type SceneState } from '../engine/scene';
import { downloadBlob } from './utils';

export interface VideoExportOptions {
  fps: number;
  durationSec: number;
  onProgress?: (ratio: number) => void;
}

// Preferred codec order: H.264/MP4 is what Instagram expects, but not every browser build ships an
// H.264 encoder (open-source Chromium builds often don't), so we fall back to VP9/WebM when needed.
const CODEC_PREFERENCE: VideoCodec[] = ['avc', 'vp9', 'vp8'];

export interface VideoSupport {
  codec: VideoCodec;
  container: 'mp4' | 'webm';
}

export async function detectVideoSupport(): Promise<VideoSupport | null> {
  if (typeof VideoEncoder === 'undefined') return null;
  try {
    const codec = await getFirstEncodableVideoCodec(CODEC_PREFERENCE);
    if (!codec) return null;
    return { codec, container: codec === 'avc' ? 'mp4' : 'webm' };
  } catch {
    return null;
  }
}

export async function isVideoExportSupported(): Promise<boolean> {
  return (await detectVideoSupport()) !== null;
}

export async function exportVideo(state: SceneState, opts: VideoExportOptions, filenameBase = 'distortion') {
  const support = await detectVideoSupport();
  if (!support) throw new Error("This browser can't encode video here.");

  const { width: W, height: H } = state.format;
  const content = buildContentCanvas(state);
  const fields = createNoiseFields(state.distortion.seed);
  const scratch = createScratch(W, H);

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = W;
  frameCanvas.height = H;
  const frameCtx = frameCanvas.getContext('2d') as CanvasRenderingContext2D;

  // These containers/codecs have no alpha channel, so transparent backgrounds fall back to solid black.
  const background = state.background.mode === 'transparent' ? { mode: 'solid' as const, color: '#000000' } : state.background;

  const output = new Output({
    format: support.container === 'mp4' ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target: new BufferTarget(),
  });
  const videoSource = new CanvasSource(frameCanvas, { codec: support.codec, bitrate: QUALITY_HIGH });
  output.addVideoTrack(videoSource);

  await output.start();

  const totalFrames = Math.max(1, Math.round(opts.durationSec * opts.fps));
  const frameDuration = 1 / opts.fps;

  for (let i = 0; i < totalFrames; i++) {
    const t = i * frameDuration;
    renderFrame(frameCtx, W, H, t, {
      content,
      distortion: state.distortion,
      fields,
      background,
      scratch,
    });
    await videoSource.add(t, frameDuration);
    opts.onProgress?.((i + 1) / totalFrames);
  }

  await output.finalize();

  const buffer = output.target.buffer;
  if (!buffer) throw new Error('Video export failed: no output buffer was produced.');
  const mime = support.container === 'mp4' ? 'video/mp4' : 'video/webm';
  downloadBlob(new Blob([buffer], { type: mime }), `${filenameBase}.${support.container}`);
}
