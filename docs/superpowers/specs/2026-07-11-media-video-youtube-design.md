# Auto media-type detection: video (mp4) + YouTube in media layouts

**Date:** 2026-07-11
**Status:** Design

## Problem

The four media layouts (`media`, `media-full`, `media-left`, `media-right`) and the
`Window` component only render images and generic iframes. Presenters cannot drop an
`.mp4` file or a YouTube link into a `media:` frontmatter prop and have it "just work" —
videos silently fail (background-image can't play video) and YouTube `watch?v=` URLs are
not embeddable as-is.

## Goal

Let any media layout accept an image, an mp4/video file, or a YouTube URL via the same
`media` prop, auto-detecting the type and rendering the correct element. Behavior applies
in **both** plain mode and window (browser/phone chrome) mode.

## Decisions

- **Video playback:** native `controls`, click-to-play, audio kept, **no** autoplay/loop.
- **YouTube input:** accept any YouTube URL form and normalize to an embeddable URL.
- **Scope:** plain rendering *and* the `Window` chrome, in both desktop and mobile frames.

## Architecture

### 1. Detection helpers (`src/theme/layoutHelper.ts`)

```ts
export type MediaKind = "image" | "video" | "youtube" | "iframe";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
const YOUTUBE_RE = /(?:youtube\.com|youtu\.be)/i;

export function detectMediaKind(src?: string): MediaKind {
  if (!src) return "iframe";
  if (YOUTUBE_RE.test(src)) return "youtube";
  if (VIDEO_EXT.test(src)) return "video";
  if (IMAGE_EXT.test(src)) return "image";
  return "iframe";
}

export function toYouTubeEmbed(url: string): string { ... }
```

`toYouTubeEmbed` extracts the video id from `watch?v=<id>`, `youtu.be/<id>`,
`youtube.com/embed/<id>`, and `youtube.com/shorts/<id>` (preserving a `t=`/`start=`
timestamp when present as `start=` seconds) and returns
`https://www.youtube.com/embed/<id>`. If no id can be parsed, it returns the input
unchanged (falls back to a raw iframe).

Detection order matters: YouTube is checked before extension tests so a `youtu.be` link
without a file extension is caught. `IMAGE_EXT` is the single source of truth (Window's
local copy is removed and imports from here).

### 2. `Media.vue` component (`src/theme/components/Media.vue`)

A single element renderer given a `src` and optional `objectFit`.

Props: `src: string`, `objectFit?: string`, `kind?: MediaKind` (override; defaults to
`detectMediaKind(src)`).

Renders:
- `image` → `<img :src="resolveAssetUrl(src)" :style="{ objectFit }">`
- `video` → `<video :src="resolveAssetUrl(src)" controls playsinline :style="{ objectFit }">`
- `youtube` → `<iframe :src="toYouTubeEmbed(src)" allow="...; encrypted-media; picture-in-picture" allowfullscreen>`
- `iframe` → `<iframe :src="src">`

The component fills its container (`w-full h-full`); sizing/aspect concerns stay with the
layout or Window, matching how `<img>`/`<iframe>` are sized today.

### 3. Layout changes

Each layout keeps `background-image` for the `image` case (no visual change to existing
image decks) and renders `<Media>` otherwise.

- **`media.vue`** (plain path): replace `<img>` with `<Media :src="media" :object-fit="objectFit" />`.
  Existing `img { h-full w-auto object-contain }` CSS is retargeted to `.media :where(img, video, iframe)`.
- **`media-full.vue`**, **`media-left.vue`**, **`media-right.vue`** (plain path): the
  `background-image` div is used only when `detectMediaKind(media) === "image"`; otherwise
  render `<Media>` filling the same container. A computed `kind` drives the `v-if`.

Window mode in every layout is unchanged at the call site — the `Window` component absorbs
the new kinds.

### 4. `Window.vue` changes

- Remove the local `IMAGE_EXT`; import `detectMediaKind` / `toYouTubeEmbed` / `resolveAssetUrl`.
- `renderAs` becomes `computed<MediaKind>(() => props.content ?? detectMediaKind(props.src))`
  (the `content` prop type widens to `MediaKind`).
- Desktop and mobile templates gain `<video>` and youtube-`<iframe>` branches alongside the
  existing image/iframe branches. Video uses `controls playsinline` and reuses the
  `window-img` / `mobile-img` sizing classes so the chrome hugs it like an image.
- Device auto-detection (portrait→mobile) currently probes images only; it stays
  image-only. Video/youtube keep the `type` prop / default `desktop`.

## Data flow

`media` frontmatter prop → layout → `detectMediaKind` → either background-image (image) or
`<Media>` (plain) / `<Window>` (window mode) → correct element. YouTube URLs pass through
`toYouTubeEmbed` at render time inside `Media`/`Window`.

## Error handling

- Missing/empty `src` → `detectMediaKind` returns `"iframe"` (existing fallback behavior).
- Unparseable YouTube URL → `toYouTubeEmbed` returns input unchanged → raw iframe.
- Unknown extension → `iframe` fallback, matching today's Window behavior.

## Testing / verification

No unit-test harness exists in this repo; verification is visual via the dev server.

1. Create a scratch deck (or reuse the speedrun deck, which now has `tasnds.mp4`) with:
   - an image `media:` slide (regression — must look identical),
   - an mp4 `media:` slide (plain + `window: true`),
   - a YouTube `watch?v=` URL slide (plain + window, desktop + mobile).
2. `pnpm dev` and confirm: image unchanged; video shows controls and plays on click with
   audio; YouTube embeds and plays; window chrome wraps video/youtube correctly in both
   desktop and mobile frames.
3. `pnpm build` succeeds.

## Out of scope (YAGNI)

- Autoplay/loop/muted modes and per-slide playback config.
- Non-YouTube providers (Vimeo, etc.).
- Poster images, captions/subtitles tracks.
- Multiple `<source>` fallbacks per video.
