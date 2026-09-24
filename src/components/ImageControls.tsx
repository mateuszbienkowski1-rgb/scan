import { useCallback, useRef, useState } from 'react';
import type { ImageSettings } from '../types';
import { ButtonGroup } from './Field';

export function ImageControls({ value, onChange }: { value: ImageSettings; onChange: (v: ImageSettings) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ ...value, src: reader.result as string });
      };
      reader.readAsDataURL(file);
    },
    [value, onChange],
  );

  return (
    <>
      <div
        className={dragOver ? 'dropzone dropzone-active' : 'dropzone'}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          loadFile(e.dataTransfer.files[0]);
        }}
      >
        {value.src ? (
          <img src={value.src} alt="Uploaded source" className="dropzone-preview" />
        ) : (
          <span>Click or drop an image here</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => loadFile(e.target.files?.[0])}
      />

      {value.src && (
        <button type="button" className="ghost-button" onClick={() => onChange({ ...value, src: null })}>
          Remove image
        </button>
      )}

      <ButtonGroup
        options={[
          { id: 'cover', label: 'Fill (cover)' },
          { id: 'contain', label: 'Fit (contain)' },
        ]}
        value={value.fit}
        onChange={(v) => onChange({ ...value, fit: v })}
      />
    </>
  );
}
