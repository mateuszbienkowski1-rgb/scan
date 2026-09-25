import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { BlobPanel } from './components/BlobPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { DistortionPanel } from './components/DistortionPanel';
import { ExportPanel } from './components/ExportPanel';
import { ButtonGroup, ColorField, Section } from './components/Field';
import { ImageControls } from './components/ImageControls';
import { TextControls } from './components/TextControls';
import { loadImage } from './engine/source';
import { useEngine } from './hooks/useEngine';
import { FORMAT_PRESETS } from './presets';
import type { BackgroundSettings, BlobSettings, ContentMode, DistortionSettings, ImageSettings, TextSettings } from './types';

type Tab = 'content' | 'distortion' | 'export';

const DEFAULT_TEXT: TextSettings = {
  text: 'Bouillante',
  fontFamily: '"Archivo Black", sans-serif',
  fontWeight: 400,
  uppercase: false,
  fontSizeMode: 'auto',
  fontSize: 160,
  letterSpacing: 0,
  lineHeight: 1.05,
  align: 'center',
  color: '#0a0a0a',
};

const DEFAULT_IMAGE: ImageSettings = { src: null, fit: 'cover' };

const DEFAULT_BACKGROUND: BackgroundSettings = { mode: 'solid', color: '#ffffff' };

const DEFAULT_DISTORTION: DistortionSettings = {
  amplitude: 40,
  stretch: 0.35,
  waveAmplitude: 10,
  frequency: 0.006,
  octaves: 3,
  speed: 0.6,
  seed: 1234,
  echoLayers: 2,
  echoSpacing: 26,
  echoFade: 0.45,
  echoTimeOffset: 0.35,
  loop: true,
  loopDuration: 4,
};

const DEFAULT_BLOB: BlobSettings = { enabled: false, copies: 5, spread: 6, blur: 10, threshold: 0.5 };

const PREVIEW_MAX_DIM = 640;

export default function App() {
  const [tab, setTab] = useState<Tab>('content');
  const [formatId, setFormatId] = useState(FORMAT_PRESETS[0].id);
  const [contentMode, setContentMode] = useState<ContentMode>('text');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [background, setBackground] = useState(DEFAULT_BACKGROUND);
  const [distortion, setDistortion] = useState(DEFAULT_DISTORTION);
  const [blob, setBlob] = useState(DEFAULT_BLOB);
  const [playing, setPlaying] = useState(true);

  const format = FORMAT_PRESETS.find((f) => f.id === formatId) ?? FORMAT_PRESETS[0];

  useEffect(() => {
    if (!image.src) {
      setImageEl(null);
      return;
    }
    let cancelled = false;
    loadImage(image.src).then((img) => {
      if (!cancelled) setImageEl(img);
    });
    return () => {
      cancelled = true;
    };
  }, [image.src]);

  const scene = useMemo(
    () => ({ format, contentMode, text, image, imageEl, background, distortion, blob }),
    [format, contentMode, text, image, imageEl, background, distortion, blob],
  );

  const previewScale = Math.min(1, PREVIEW_MAX_DIM / Math.max(format.width, format.height));
  const previewW = Math.round(format.width * previewScale);
  const previewH = Math.round(format.height * previewScale);

  const { canvasRef, getTime } = useEngine(scene, previewW, previewH, playing);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Distort</h1>
        <p>Melt, wave, blob and echo text or images — export PNG or MP4 in Instagram-ready sizes.</p>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <nav className="tabs">
            <button className={tab === 'content' ? 'tab tab-active' : 'tab'} onClick={() => setTab('content')} type="button">
              Content
            </button>
            <button className={tab === 'distortion' ? 'tab tab-active' : 'tab'} onClick={() => setTab('distortion')} type="button">
              Distortion
            </button>
            <button className={tab === 'export' ? 'tab tab-active' : 'tab'} onClick={() => setTab('export')} type="button">
              Export
            </button>
          </nav>

          <div className="panel">
            {tab === 'content' && (
              <>
                <Section title="Source">
                  <ButtonGroup
                    options={[
                      { id: 'text', label: 'Text' },
                      { id: 'image', label: 'Image' },
                    ]}
                    value={contentMode}
                    onChange={setContentMode}
                  />
                  {contentMode === 'text' ? (
                    <TextControls value={text} onChange={setText} />
                  ) : (
                    <ImageControls value={image} onChange={setImage} />
                  )}
                </Section>
                <Section title="Background">
                  <ButtonGroup
                    options={[
                      { id: 'solid', label: 'Solid' },
                      { id: 'transparent', label: 'Transparent' },
                    ]}
                    value={background.mode}
                    onChange={(mode) => setBackground({ ...background, mode })}
                  />
                  {background.mode === 'solid' && (
                    <ColorField label="Color" value={background.color} onChange={(color) => setBackground({ ...background, color })} />
                  )}
                </Section>
              </>
            )}

            {tab === 'distortion' && (
              <>
                <Section title="Blob / Goo">
                  <BlobPanel value={blob} onChange={setBlob} />
                </Section>
                <Section title="Melt / Wave">
                  <DistortionPanel value={distortion} onChange={setDistortion} />
                </Section>
              </>
            )}

            {tab === 'export' && (
              <Section title="Export">
                <ExportPanel scene={scene} getTime={getTime} />
              </Section>
            )}
          </div>
        </aside>

        <main className="stage">
          <div className="format-row">
            {FORMAT_PRESETS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={f.id === formatId ? 'chip chip-active' : 'chip'}
                onClick={() => setFormatId(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <CanvasPreview
            canvasRef={canvasRef}
            width={previewW}
            height={previewH}
            transparent={background.mode === 'transparent'}
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
          />
        </main>
      </div>
    </div>
  );
}
