# Merge iframe-_, image-_ and image-window-\* layouts into `media-*`

**Date:** 2026-07-04
**Status:** Approved

## Problem

The theme has three overlapping layout families that all display a piece of visual media:

- `image`, `image-full`, `image-left`, `image-right` — a plain image (no chrome).
- `iframe`, `iframe-full`, `iframe-left`, `iframe-right` — a `Window` wrapping a URL.
- `image-window`, `image-window-full`, `image-window-left`, `image-window-right` — a `Window` wrapping an image.

The `Window` component already auto-detects iframe-vs-image (from the `src` extension) and
desktop-vs-mobile (from image aspect ratio). As a result `iframe-*` and `image-window-*` are
already functionally identical — they differ only in prop names (`url` vs `image`, `scale` vs
`objectFit`). The only genuine distinction left across all twelve layouts is **plain image vs.
windowed (browser/phone chrome)** and the **placement** (center / full / left / right).

## Goal

Collapse the twelve layouts into four `media-*` layouts distinguished only by placement, with a
`window: true` frontmatter flag selecting chromed rendering.

## Design

### Layout set (12 → 4)

| New layout   | `window` off (plain)          | `window: true` (chrome)                            |
| ------------ | ----------------------------- | -------------------------------------------------- |
| `media`      | centered `<img>` (old `image`) | centered Window (old `iframe` / `image-window`)     |
| `media-full` | full-bleed bg (old `image-full`) | full Window (old `iframe-full` / `image-window-full`) |
| `media-left` | image left half (old `image-left`) | Window left (old `iframe-left` / `image-window-left`) |
| `media-right`| image right half (old `image-right`) | Window right (old `iframe-right` / `image-window-right`) |

### Props (unified)

- `src: string` — replaces both `url` and `image`.
- `window?: boolean` — chrome on/off (default `false`).
- `type?: "desktop" | "mobile"` — Window device override (only meaningful when `window`).
- `scale?: number` — passed to Window (iframe scaling).
- `objectFit?: string` — passed to Window (image fit).
- `backgroundSize?: string` — plain full/left/right image sizing; preserves current behavior
  (`cover` default for left/right, `contain` for full).
- `windowTitle?: string` — replaces `iframeTitle`; feeds the Window title bar.

### Rendering behavior per layout

Each layout branches on `window`:

- **plain branch** — reproduces the exact markup/CSS of the corresponding old `image-*` layout
  (centered `<img object-contain>` for `media`; CSS background via `handleBackground` for
  `media-full` / `media-left` / `media-right`).
- **window branch** — renders `<Window :src="src" :scale :object-fit :type :title="windowTitle" />`
  inside the same placement wrapper the old `iframe-*` / `image-window-*` layouts used.

Placement wrappers (grid columns for left/right, full-height container for full, width-limited
container for center) are shared between the two branches so spacing is identical to today.

## Migration

1. Delete the twelve old layout files under `src/theme/layouts/`.
2. Add `media.vue`, `media-full.vue`, `media-left.vue`, `media-right.vue`.
3. Update every deck and root `slides*.md`:
   - rename `layout:` to the `media-*` equivalent,
   - rename `url:` / `image:` → `src:`,
   - rename `iframeTitle:` → `windowTitle:`,
   - add `window: true` to every former `iframe-*` / `image-window-*` slide.
4. Collapse the root `slides.md` showcase: replace the separate image / iframe demo slides with
   `media-*` demos that show both the plain and `window: true` forms.

Historical docs under `docs/superpowers/` are left as-is (they record past work).

## Testing / verification

- `pnpm build` succeeds.
- Visually spot-check the root `slides.md` showcase: each of the four placements in both plain and
  windowed form, plus a portrait-aspect image (auto mobile frame) and a URL (iframe).
