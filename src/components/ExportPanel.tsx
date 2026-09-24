import { useEffect, useState } from 'react';
import { exportPng } from '../export/exportPng';
import { detectVideoSupport, exportVideo, type VideoSupport } from '../export/exportVideo';
import type { SceneState } from '../engine/scene';
import { SliderField } from './Field';

export function ExportPanel({ scene, getTime }: { scene: SceneState; getTime: () => number }) {
  const [support, setSupport] = useState<VideoSupport | null | undefined>(undefined);
  const [duration, setDuration] = useState(4);
  const [fps, setFps] = useState(30);
  const [busy, setBusy] = useState<'png' | 'video' | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectVideoSupport().then(setSupport);
  }, []);

  async function handlePng() {
    setBusy('png');
    setError(null);
    try {
      await exportPng(scene, getTime());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PNG export failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleVideo() {
    setBusy('video');
    setError(null);
    setProgress(0);
    try {
      await exportVideo(scene, { durationSec: duration, fps, onProgress: setProgress });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video export failed.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <p className="hint">
        {scene.format.width}×{scene.format.height}px · {scene.format.label}
      </p>

      <button type="button" className="primary-button" onClick={handlePng} disabled={busy !== null}>
        {busy === 'png' ? 'Exporting…' : 'Export PNG'}
      </button>

      <hr className="divider" />

      <SliderField label="Duration (s)" value={duration} min={1} max={8} step={0.5} onChange={setDuration} />
      <label className="field">
        <span>Frame rate</span>
        <select value={fps} onChange={(e) => setFps(Number(e.target.value))}>
          <option value={24}>24 fps</option>
          <option value={30}>30 fps</option>
          <option value={60}>60 fps</option>
        </select>
      </label>

      <button type="button" className="primary-button" onClick={handleVideo} disabled={busy !== null || support === null}>
        {busy === 'video'
          ? `Exporting… ${Math.round(progress * 100)}%`
          : `Export ${support?.container === 'webm' ? 'WebM' : 'MP4'}`}
      </button>
      {busy === 'video' && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      {support === null && (
        <p className="hint warning">
          This browser can't encode video here (needs WebCodecs support — try a recent Chrome or Edge). PNG export still works.
        </p>
      )}
      {support?.container === 'webm' && (
        <p className="hint">This browser lacks an H.264 encoder, so video exports as WebM (VP9) instead of MP4.</p>
      )}
      {error && <p className="hint warning">{error}</p>}
    </>
  );
}
