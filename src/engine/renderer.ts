import { fbm4, type NoiseFields } from './noise';
import type { BackgroundSettings, DistortionSettings } from '../types';

type Canvas2D = HTMLCanvasElement | OffscreenCanvas;

export interface Scratch {
  tmp1: Canvas2D;
  tmp2: Canvas2D;
}

function ctx2d(c: Canvas2D): CanvasRenderingContext2D {
  return c.getContext('2d') as CanvasRenderingContext2D;
}

export function makeCanvas(W: number, H: number): Canvas2D {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(W, H);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  return c;
}

export function createScratch(W: number, H: number): Scratch {
  return { tmp1: makeCanvas(W, H), tmp2: makeCanvas(W, H) };
}

function timeCoords(t: number, settings: DistortionSettings): [number, number] {
  if (settings.loop && settings.loopDuration > 0) {
    const angle = (t / settings.loopDuration) * Math.PI * 2;
    const r = settings.speed;
    return [Math.cos(angle) * r, Math.sin(angle) * r];
  }
  return [t * settings.speed, 0];
}

/** Warps `src` vertically (per-column shift + stretch), writing the result into `dest`. */
function verticalMelt(
  src: Canvas2D,
  dest: Canvas2D,
  W: number,
  H: number,
  timeZ: number,
  timeW: number,
  settings: DistortionSettings,
  fields: NoiseFields,
) {
  const out = ctx2d(dest);
  out.clearRect(0, 0, W, H);
  if (settings.amplitude === 0 && settings.stretch === 0) {
    out.drawImage(src, 0, 0);
    return;
  }
  const strips = Math.max(16, Math.min(W, 340));
  const stripW = W / strips;
  for (let i = 0; i < strips; i++) {
    const cx = (i + 0.5) * stripW;
    const nShift = fbm4(fields.shift, cx * settings.frequency, 0, timeZ, timeW, settings.octaves);
    const nStretch = fbm4(fields.stretch, cx * settings.frequency * 1.31, 41.7, timeZ, timeW, settings.octaves);
    const shift = nShift * settings.amplitude;
    const scale = 1 + Math.max(-0.9, nStretch) * settings.stretch;
    const destH = H * scale;
    const destY = (H - destH) / 2 + shift;
    const sx = i * stripW;
    out.drawImage(src, sx, 0, stripW + 1, H, sx, destY, stripW + 1, destH);
  }
}

/** Warps `src` horizontally (per-row shift), writing the result into `dest`. */
function horizontalWave(
  src: Canvas2D,
  dest: Canvas2D,
  W: number,
  H: number,
  timeZ: number,
  timeW: number,
  settings: DistortionSettings,
  fields: NoiseFields,
) {
  const out = ctx2d(dest);
  out.clearRect(0, 0, W, H);
  if (settings.waveAmplitude === 0) {
    out.drawImage(src, 0, 0);
    return;
  }
  const rows = Math.max(16, Math.min(H, 340));
  const rowH = H / rows;
  for (let j = 0; j < rows; j++) {
    const cy = (j + 0.5) * rowH;
    const n = fbm4(fields.wave, cy * settings.frequency, 87.3, timeZ, timeW, settings.octaves);
    const dx = n * settings.waveAmplitude;
    const sy = j * rowH;
    out.drawImage(src, 0, sy, W, rowH + 1, dx, sy, W, rowH + 1);
  }
}

export interface RenderOptions {
  content: Canvas2D;
  distortion: DistortionSettings;
  fields: NoiseFields;
  background: BackgroundSettings;
  scratch: Scratch;
}

export function renderFrame(dest: CanvasRenderingContext2D, W: number, H: number, t: number, opts: RenderOptions) {
  dest.clearRect(0, 0, W, H);
  if (opts.background.mode === 'solid') {
    dest.fillStyle = opts.background.color;
    dest.fillRect(0, 0, W, H);
  }

  const layers = Math.max(0, Math.round(opts.distortion.echoLayers));

  for (let e = layers; e >= 0; e--) {
    const alpha = e === 0 ? 1 : Math.pow(opts.distortion.echoFade, e);
    if (alpha <= 0.01) continue;
    const layerT = t - e * opts.distortion.echoTimeOffset;
    const [timeZ, timeW] = timeCoords(layerT, opts.distortion);

    verticalMelt(opts.content, opts.scratch.tmp1, W, H, timeZ, timeW, opts.distortion, opts.fields);
    horizontalWave(opts.scratch.tmp1, opts.scratch.tmp2, W, H, timeZ, timeW, opts.distortion, opts.fields);

    const yOff = e * opts.distortion.echoSpacing;
    dest.save();
    dest.globalAlpha = alpha;
    dest.drawImage(opts.scratch.tmp2, 0, yOff);
    dest.restore();
  }
}
