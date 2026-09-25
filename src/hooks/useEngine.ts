import { useEffect, useRef } from 'react';
import { createNoiseFields, type NoiseFields } from '../engine/noise';
import { createScratch, renderFrame, type Scratch } from '../engine/renderer';
import { buildContentCanvas, type SceneState } from '../engine/scene';

type Canvas2D = HTMLCanvasElement | OffscreenCanvas;

export function useEngine(scene: SceneState, previewW: number, previewH: number, playing: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tRef = useRef(0);
  const contentRef = useRef<Canvas2D | null>(null);
  const fieldsRef = useRef<NoiseFields | null>(null);
  const scratchRef = useRef<Scratch | null>(null);

  const previewScene: SceneState = {
    ...scene,
    format: { ...scene.format, width: previewW, height: previewH },
  };

  useEffect(() => {
    contentRef.current = buildContentCanvas(previewScene);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.contentMode, scene.text, scene.image, scene.imageEl, scene.blob, scene.distortion.seed, previewW, previewH]);

  useEffect(() => {
    fieldsRef.current = createNoiseFields(scene.distortion.seed);
  }, [scene.distortion.seed]);

  useEffect(() => {
    scratchRef.current = createScratch(previewW, previewH);
  }, [previewW, previewH]);

  useEffect(() => {
    let raf = 0;
    let lastTs: number | null = null;

    function tick(ts: number) {
      if (lastTs == null) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      if (playing) {
        tRef.current += dt;
        if (scene.distortion.loop && scene.distortion.loopDuration > 0) {
          tRef.current = tRef.current % scene.distortion.loopDuration;
        }
      }

      const canvas = canvasRef.current;
      if (canvas && contentRef.current && fieldsRef.current && scratchRef.current) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        renderFrame(ctx, previewW, previewH, tRef.current, {
          content: contentRef.current,
          distortion: scene.distortion,
          fields: fieldsRef.current,
          background: scene.background,
          scratch: scratchRef.current,
        });
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, scene.distortion, scene.background, previewW, previewH]);

  return {
    canvasRef,
    getTime: () => tRef.current,
    setTime: (t: number) => {
      tRef.current = t;
    },
  };
}
