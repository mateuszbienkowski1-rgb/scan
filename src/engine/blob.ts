import { createSeededNoise4D } from './noise';
import { ctx2d, makeCanvas, type Canvas2D } from './renderer';
import type { BlobSettings } from '../types';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16) || 0;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

/**
 * "Goo" / metaball effect: stack several jittered copies of the source, blur them together,
 * then threshold the alpha channel back to a hard edge. Overlapping strokes fuse into rounded
 * blobs, corners soften — the bubble-letter look (e.g. the "ability" / "botch" wordmarks).
 */
export function applyBlobEffect(
  content: Canvas2D,
  W: number,
  H: number,
  settings: BlobSettings,
  seed: number,
  solidColor: string | null,
): Canvas2D {
  if (!settings.enabled) return content;

  const noiseX = createSeededNoise4D(seed + 31337);
  const noiseY = createSeededNoise4D(seed + 62661);

  const acc = makeCanvas(W, H);
  const actx = ctx2d(acc);
  const copies = Math.max(1, Math.round(settings.copies));
  for (let i = 0; i < copies; i++) {
    const ox = noiseX(i * 11.7, 0, 0, 0) * settings.spread;
    const oy = noiseY(i * 11.7, 0, 0, 0) * settings.spread;
    actx.drawImage(content, ox, oy);
  }

  const blurred = makeCanvas(W, H);
  const bctx = ctx2d(blurred);
  if (settings.blur > 0) {
    bctx.filter = `blur(${settings.blur}px)`;
  }
  bctx.drawImage(acc, 0, 0);
  bctx.filter = 'none';

  const imgData = bctx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const band = 26;
  const cut = settings.threshold * 255;
  const rgb = solidColor ? hexToRgb(solidColor) : null;

  for (let p = 0; p < data.length; p += 4) {
    const a = data[p + 3];
    let na = ((a - (cut - band)) / (band * 2)) * 255;
    na = Math.max(0, Math.min(255, na));
    data[p + 3] = na;
    if (rgb && na > 0) {
      data[p] = rgb.r;
      data[p + 1] = rgb.g;
      data[p + 2] = rgb.b;
    }
  }
  bctx.putImageData(imgData, 0, 0);
  return blurred;
}
