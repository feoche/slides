# Design: `image-window` layout family

**Date:** 2026-07-03
**Status:** Approved

## Goal

Add a family of Slidev layouts that render an **image** inside the same fake
browser-chrome window used by the existing `iframe*` layouts. Useful for showing
screenshots as if they were live pages, with consistent theme styling.

## Context

The theme (`src/theme/layouts/`) already provides an iframe family that wraps a
live `<iframe>` in browser chrome:

- `iframe.vue` — slot content + browser window (window fills slide)
- `iframe-full.vue` — single browser window, no slot
- `iframe-left.vue` — window left, slot right (2-col grid)
- `iframe-right.vue` — slot left, window right (2-col grid)

Each shares the same markup: a `.iframe-container` with a header
(title `$frontmatter.iframeTitle` + controls `− ⧉ ×`), a subheader
(`← → ⟳` + address-bar `<input>`), and the framed content. The `.iframe-container`
CSS (and its nested rules) is duplicated in `iframe.vue` and `iframe-full.vue`
and defined globally, so it is available to any layout on the slide.

## New layouts

Four files in `src/theme/layouts/`, mirroring the iframe family one-to-one:

| Layout                   | Mirrors           | Structure                                   |
| ------------------------ | ----------------- | ------------------------------------------- |
| `image-window.vue`       | `iframe.vue`      | Slot content + one browser window           |
| `image-window-full.vue`  | `iframe-full.vue` | Single browser window, no slot              |
| `image-window-left.vue`  | `iframe-left.vue` | Window left, slot right (2-col grid)         |
| `image-window-right.vue` | `iframe-right.vue`| Slot left, window right (2-col grid)         |

## Props

Replaces the iframe layouts' `url`/`scale` props with:

- `image: string` — path or URL to the image to display.
- `objectFit?: string` — CSS `object-fit` for the image, default `'cover'`.

## Browser chrome

Identical markup to the iframe layouts:

- **Header:** title `{{ $frontmatter.iframeTitle }}` on the left, controls
  `− ⧉ ×` on the right.
- **Subheader:** nav controls `← → ⟳` and an address-bar `<input type="search">`.
  Since there is no live URL for an image, the input renders **empty** (no
  `:value`) — kept only for the browser look.

## Image rendering

Inside `.iframe-container`, replace `<iframe>` with:

```html
<img :src="image" class="w-full h-full object-top" :style="{ objectFit }" />
```

A screenshot fills the window like a real page. No `transform: scale` — that was
only needed to shrink live iframes.

## Styling

Keep the layouts independent (matching the existing iframe layouts' copy-paste
style; a shared `BrowserChrome.vue` refactor is deliberately out of scope).

Each new layout defines only its own outer-wrapper class:

- `image-window.vue` / `image-window-full.vue`: reuse the same outer sizing as
  `iframe.vue` / `iframe-full.vue` (`width: calc(100% - 2.5rem)`, height, etc.),
  including a local copy of the `.iframe-container` block so the layout is
  self-contained.
- `image-window-left.vue` / `image-window-right.vue`: reuse the 2-col grid
  wrappers (`.image-window-left` / `.image-window-right`) analogous to
  `.iframe-left` / `.iframe-right`; the `.iframe-container` CSS is already global.

## Usage example

```markdown
---
layout: image-window-left
image: ./public/screenshot.png
iframeTitle: My App
---

## Notes about the screenshot

- point one
- point two
```

## Out of scope

- Extracting a shared `BrowserChrome.vue` component.
- Any change to the existing `iframe*` layouts.
- Reveal.js / Pandoc decks (Slidev theme only).

## Testing

- Build the Slidev theme / run `pnpm dev` and verify each of the four layouts
  renders the image inside browser chrome, with the title in the header and an
  empty address bar.
- Verify left/right variants place the window and slot on the correct sides.
- Verify `objectFit` override (e.g. `contain`) works.
```
