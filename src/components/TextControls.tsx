import { FONT_OPTIONS } from '../presets';
import type { TextSettings } from '../types';
import { ButtonGroup, ColorField, SliderField, ToggleField } from './Field';

export function TextControls({ value, onChange }: { value: TextSettings; onChange: (v: TextSettings) => void }) {
  const set = <K extends keyof TextSettings>(key: K, v: TextSettings[K]) => onChange({ ...value, [key]: v });

  return (
    <>
      <label className="field">
        <span>Text</span>
        <textarea
          rows={3}
          value={value.text}
          placeholder="Type something..."
          onChange={(e) => set('text', e.target.value)}
        />
      </label>

      <label className="field">
        <span>Font</span>
        <select
          value={value.fontFamily}
          onChange={(e) => {
            const opt = FONT_OPTIONS.find((f) => f.family === e.target.value);
            onChange({ ...value, fontFamily: e.target.value, fontWeight: opt?.weight ?? value.fontWeight });
          }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.family}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <ButtonGroup
        options={[
          { id: 'left', label: 'Left' },
          { id: 'center', label: 'Center' },
          { id: 'right', label: 'Right' },
        ]}
        value={value.align}
        onChange={(v) => set('align', v)}
      />

      <ToggleField label="Uppercase" checked={value.uppercase} onChange={(v) => set('uppercase', v)} />

      <ButtonGroup
        options={[
          { id: 'auto', label: 'Auto size' },
          { id: 'manual', label: 'Manual size' },
        ]}
        value={value.fontSizeMode}
        onChange={(v) => set('fontSizeMode', v)}
      />
      {value.fontSizeMode === 'manual' && (
        <SliderField label="Font size" value={value.fontSize} min={16} max={400} step={2} onChange={(v) => set('fontSize', v)} />
      )}

      <SliderField
        label="Letter spacing"
        value={value.letterSpacing}
        min={-10}
        max={60}
        step={1}
        onChange={(v) => set('letterSpacing', v)}
      />
      <SliderField label="Line height" value={value.lineHeight} min={0.7} max={2} step={0.05} onChange={(v) => set('lineHeight', v)} />
      <ColorField label="Text color" value={value.color} onChange={(v) => set('color', v)} />
    </>
  );
}
