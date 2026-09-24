# Distort

A browser-based tool for melting, waving and echoing text or images, then exporting the result as an Instagram-ready PNG or video.

## Features

- Type text or upload an image as the source content
- Organic "liquify" distortion: per-column vertical melt/stretch, per-row horizontal wave, layered ghost echoes
- Style presets (Liquid Melt, Flag Wave, Chaos, Subtle) plus full manual control over amplitude, turbulence, speed and seed
- Instagram format presets: Post (1:1), Portrait (4:5), Story/Reel (9:16), Landscape (1.91:1)
- Seamless looping animation (optional)
- Export a still frame as PNG, or the animation as MP4 (H.264) — falls back to WebM (VP9) automatically in browsers without an H.264 encoder

## Development

```bash
npm install
npm run dev
```

Video export uses the [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) via [mediabunny](https://mediabunny.dev), so it needs a recent Chromium-based browser (Chrome, Edge). PNG export and the live preview work everywhere canvas does.

```bash
npm run build   # production build
npm run lint    # oxlint
```
