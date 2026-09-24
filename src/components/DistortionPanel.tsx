import { DISTORTION_PRESETS } from '../presets';
import type { DistortionSettings } from '../types';
import { SliderField, ToggleField } from './Field';

export function DistortionPanel({ value, onChange }: { value: DistortionSettings; onChange: (v: DistortionSettings) => void }) {
  const set = <K extends keyof DistortionSettings>(key: K, v: DistortionSettings[K]) => onChange({ ...value, [key]: v });

  return (
    <>
      <div className="preset-row">
        {DISTORTION_PRESETS.map((p) => (
          <button key={p.id} type="button" className="chip" onClick={() => onChange({ ...value, ...p.values })}>
            {p.label}
          </button>
        ))}
      </div>

      <SliderField label="Melt amplitude" value={value.amplitude} min={0} max={150} step={1} onChange={(v) => set('amplitude', v)} />
      <SliderField label="Stretch" value={value.stretch} min={0} max={1} step={0.01} onChange={(v) => set('stretch', v)} />
      <SliderField label="Wave amplitude" value={value.waveAmplitude} min={0} max={150} step={1} onChange={(v) => set('waveAmplitude', v)} />
      <SliderField
        label="Detail scale"
        value={value.frequency}
        min={0.001}
        max={0.03}
        step={0.001}
        format={(v) => v.toFixed(3)}
        onChange={(v) => set('frequency', v)}
      />
      <SliderField label="Turbulence" value={value.octaves} min={1} max={5} step={1} onChange={(v) => set('octaves', v)} />
      <SliderField label="Flow speed" value={value.speed} min={0} max={3} step={0.05} onChange={(v) => set('speed', v)} />

      <div className="field seed-field">
        <label className="field">
          <span>Seed</span>
          <input
            type="number"
            value={value.seed}
            onChange={(e) => set('seed', Number(e.target.value) || 0)}
          />
        </label>
        <button type="button" className="ghost-button" onClick={() => set('seed', Math.floor(Math.random() * 100000))}>
          🎲 Randomize
        </button>
      </div>

      <ToggleField label="Seamless loop" checked={value.loop} onChange={(v) => set('loop', v)} />
      {value.loop && (
        <SliderField label="Loop duration (s)" value={value.loopDuration} min={1} max={10} step={0.5} onChange={(v) => set('loopDuration', v)} />
      )}

      <hr className="divider" />
      <SliderField label="Echo layers" value={value.echoLayers} min={0} max={5} step={1} onChange={(v) => set('echoLayers', v)} />
      {value.echoLayers > 0 && (
        <>
          <SliderField label="Echo spacing" value={value.echoSpacing} min={0} max={80} step={1} onChange={(v) => set('echoSpacing', v)} />
          <SliderField label="Echo fade" value={value.echoFade} min={0} max={0.9} step={0.01} onChange={(v) => set('echoFade', v)} />
          <SliderField
            label="Echo time offset (s)"
            value={value.echoTimeOffset}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => set('echoTimeOffset', v)}
          />
        </>
      )}
    </>
  );
}
