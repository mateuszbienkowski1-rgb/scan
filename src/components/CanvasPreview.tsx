import type { RefObject } from 'react';

export function CanvasPreview({
  canvasRef,
  width,
  height,
  transparent,
  playing,
  onTogglePlay,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  transparent: boolean;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <div className="preview-stage">
      <div className={transparent ? 'canvas-frame checkerboard' : 'canvas-frame'}>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
      <button type="button" className="play-toggle" onClick={onTogglePlay}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}
