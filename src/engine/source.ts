import type { ImageSettings, TextSettings } from '../types';

function measureLineWidth(ctx: CanvasRenderingContext2D, line: string, letterSpacing: number): number {
  if (line.length === 0) return 0;
  let width = 0;
  for (const ch of line) width += ctx.measureText(ch).width + letterSpacing;
  return width - letterSpacing;
}

function drawLineWithSpacing(
  ctx: CanvasRenderingContext2D,
  line: string,
  centerX: number,
  y: number,
  letterSpacing: number,
  align: TextSettings['align'],
  totalWidth: number,
) {
  let startX: number;
  if (align === 'center') startX = centerX - totalWidth / 2;
  else if (align === 'right') startX = centerX - totalWidth;
  else startX = centerX;

  let x = startX;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const ch of line) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + letterSpacing;
  }
  ctx.textAlign = prevAlign;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  W: number,
  H: number,
  settings: TextSettings,
): number {
  const maxWidth = W * 0.86;
  const maxHeight = H * 0.8;
  let size = Math.floor(H * 0.6);
  const minSize = 8;
  while (size > minSize) {
    ctx.font = `${settings.fontWeight} ${size}px ${settings.fontFamily}`;
    let widest = 0;
    for (const line of lines) {
      widest = Math.max(widest, measureLineWidth(ctx, line, settings.letterSpacing));
    }
    const totalHeight = size * settings.lineHeight * lines.length;
    if (widest <= maxWidth && totalHeight <= maxHeight) break;
    size -= 2;
  }
  return Math.max(size, minSize);
}

export function drawTextContent(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  W: number,
  H: number,
  settings: TextSettings,
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, W, H);
  const raw = (settings.uppercase ? settings.text.toUpperCase() : settings.text) || '';
  const lines = raw.split('\n');
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = settings.color;

  const fontSize = settings.fontSizeMode === 'auto' ? fitFontSize(ctx, lines, W, H, settings) : settings.fontSize;
  ctx.font = `${settings.fontWeight} ${fontSize}px ${settings.fontFamily}`;

  const lineHeightPx = fontSize * settings.lineHeight;
  const totalH = lineHeightPx * lines.length;
  const ascentOffset = fontSize * 0.36;
  let y = H / 2 - totalH / 2 + lineHeightPx / 2 + ascentOffset;
  const centerX = settings.align === 'center' ? W / 2 : settings.align === 'right' ? W * 0.93 : W * 0.07;

  for (const line of lines) {
    const width = measureLineWidth(ctx, line, settings.letterSpacing);
    drawLineWithSpacing(ctx, line, centerX, y, settings.letterSpacing, settings.align, width);
    y += lineHeightPx;
  }
}

export function drawImageContent(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  W: number,
  H: number,
  settings: ImageSettings,
  image: HTMLImageElement | null,
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, W, H);
  if (!image || !image.naturalWidth) return;

  const ir = image.naturalWidth / image.naturalHeight;
  const cr = W / H;
  let dw: number;
  let dh: number;
  const widerThanCanvas = ir > cr;
  const fillByHeight = settings.fit === 'cover' ? widerThanCanvas : !widerThanCanvas;
  if (fillByHeight) {
    dh = H;
    dw = H * ir;
  } else {
    dw = W;
    dh = W / ir;
  }
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;
  ctx.drawImage(image, dx, dy, dw, dh);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
