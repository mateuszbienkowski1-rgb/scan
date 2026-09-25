import { BLOB_PRESETS } from '../presets';
import type { BlobSettings } from '../types';
import { SliderField, ToggleField } from './Field';

export function BlobPanel({ value, onChange }: { value: BlobSettings; onChange: (v: BlobSettings) => void }) {
  const set = <K extends keyof BlobSettings>(key: K, v: BlobSettings[K]) => onChange({ ...value, [key]: v });

  return (
    <>
      <div className="preset-row">
        {BLOB_PRESETS.map((p) => (
          <button key={p.id} type="button" className="chip" onClick={() => onChange(p.values)}>
            {p.label}
          </button>
        ))}
      </div>

      <ToggleField label="Enable blob / goo" checked={value.enabled} onChange={(v) => set('enabled', v)} />

      {value.enabled && (
        <>
          <SliderField label="Copies" value={value.copies} min={1} max={10} step={1} onChange={(v) => set('copies', v)} />
          <SliderField label="Spread" value={value.spread} min={0} max={40} step={1} onChange={(v) => set('spread', v)} />
          <SliderField label="Blur" value={value.blur} min={0} max={40} step={1} onChange={(v) => set('blur', v)} />
          <SliderField
            label="Threshold"
            value={value.threshold}
            min={0.15}
            max={0.85}
            step={0.01}
            onChange={(v) => set('threshold', v)}
          />
          <p className="hint">Merges strokes into rounded metaball shapes — works best on bold text.</p>
        </>
      )}
    </>
  );
}
