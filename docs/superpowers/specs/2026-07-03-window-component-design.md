# Design: `Window` component

**Date:** 2026-07-03
**Status:** Approved

## Goal

Extract the browser-chrome "window" currently copy-pasted across the theme's 8
`iframe*` / `image-window*` layouts into a single reusable `Window` component. The
component hosts either an **iframe** (a live URL) or an **image**, with an optional
window title. All 8 layouts are refactored to consume it, removing the duplicated
markup and CSS. This is a pure refactor: no deck-facing changes.

## Context

The theme (`src/theme/layouts/`) has two families that both wrap content in an
identical fake browser window:

- **iframe family** — `iframe.vue`, `iframe-full.vue`, `iframe-left.vue`,
  `iframe-right.vue` (props `url`, `scale?`).
- **image-window family** — `image-window.vue`, `image-window-full.vue`,
  `image-window-left.vue`, `image-window-right.vue` (props `image`, `objectFit?`).

Every one repeats the same chrome: a `.iframe-container` with a header (title
`$frontmatter.iframeTitle` + controls `− ⧉ ×`), a subheader (`← → ⟳` +
address-bar `<input>`), and the framed content. The `.iframe-container` CSS is
duplicated and defined globally. The previous `image-window` design
(`2026-07-03-image-window-layouts-design.md`) explicitly deferred "extracting a
shared component" — this spec is that deferred refactor.

Slidev auto-registers components under the theme's `components/` directory
globally (as with the existing `Progress.vue`), so layouts can use `<Window>`
without imports.

## Component

New file: `src/theme/components/Window.vue`. It owns all browser-chrome markup and
CSS.

### Props

| Prop        | Type                      | Purpose                                                                                             |
| ----------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| `src`       | `string` (required)       | URL or image path to display.                                                                       |
| `title`     | `string?`                 | Window title shown in the header.                                                                   |
| `type`      | `'iframe' \| 'image'?`    | Optional override. When unset, auto-detected (see below). When set, wins over auto-detection.       |
| `scale`     | `number?`                 | Iframe zoom — inverts container width and applies `transform: scale()`. Ignored for images.         |
| `objectFit` | `string?`                 | Image CSS `object-fit`, default `'cover'`. Ignored for iframes.                                     |

### Content-type resolution

- If `type` is provided, use it.
- Otherwise auto-detect from `src`: extensions `.png`, `.jpg`, `.jpeg`, `.gif`,
  `.webp`, `.svg`, `.avif` (case-insensitive, ignoring any query string) →
  `image`; anything else → `iframe`.

### Content rendering

- **iframe:** `<iframe :src="src" :style="scale ? { transform: 'scale(N)', transformOrigin: 'top left' } : {}" />`,
  and the container width is set to `scaleInvertPercent` (`(1/scale)*100%`) as
  today. The address-bar input shows `src` (`:value="src"`).
- **image:** `<img :src="src" class="w-full h-full object-top" :style="{ objectFit: objectFit || 'cover' }" />`.
  No `transform: scale`. The address-bar input renders **empty** (no `:value`),
  matching the current image-window behavior.

### Chrome markup (visually unchanged)

- **Header:** `title` on the left, controls `− ⧉ ×` on the right.
- **Subheader:** nav controls `← → ⟳` and an address-bar `<input type="search">`.
- **Container:** rounded, shadowed, green header — identical to today.

## Styling

All chrome CSS moves into `Window.vue` in a **non-scoped** `<style>` block so it
remains global (the left/right layouts rely on the container CSS being available
on the slide). Internal class names are renamed from `iframe-*` to `window-*`,
BEM-scoped under a `.window` root:

- `.window` (was `.iframe-container`)
- `.window-header`, `.window-title`, `.window-controls`
- `.window-subheader`, `.window-subcontrols`, `.window-url`

The `.window` element keeps the same sizing/margins/height as the current
`.iframe-container` so behavior is identical inside every layout wrapper.

## Layout refactor (all 8)

Each layout shrinks to its own outer sizing/grid wrapper plus a `<Window>`. Each
family passes its existing frontmatter through — **layout-facing frontmatter keys
are unchanged**.

| Layout                                     | Structure after refactor                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `iframe.vue` / `image-window.vue`          | wrapper + `<slot/>` + `<Window>` (window fills slide, alongside slot content)    |
| `iframe-full.vue` / `image-window-full.vue`| wrapper + `<Window>` (no slot)                                                   |
| `iframe-left.vue` / `image-window-left.vue`| 2-col grid: `<Window>` left, `<slot/>` right                                     |
| `iframe-right.vue` / `image-window-right.vue`| 2-col grid: `<slot/>` left, `<Window>` right                                   |

Prop wiring:

- iframe layouts: `<Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />`
- image-window layouts: `<Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />`

The outer wrapper classes (`.iframe`, `.iframe-left`, `.image-window-left`, etc.)
and their sizing/grid CSS stay in the layouts. The duplicated `.iframe-container`
CSS blocks are deleted from every layout (now owned by `Window.vue`).

## Out of scope

- Renaming layout-facing frontmatter keys (`url`, `scale`, `image`, `objectFit`,
  `iframeTitle`) or layout file names.
- Reveal.js / Pandoc decks (Slidev theme only).
- Any new window features (draggability, real navigation, multiple tabs, etc.).

## Testing

Run `pnpm dev` and verify, in both light and dark schemes:

- All 8 layouts render identically to before the refactor.
- iframe families show a live frame with the URL in the address bar; `scale`
  override still shrinks the frame correctly.
- image-window families show the image with an **empty** address bar; `objectFit`
  override (e.g. `contain`) works.
- `left` / `right` variants place the window and slot on the correct sides.
- The `type` override forces the intended renderer (e.g. an extensionless image
  URL with `type: image`).
