# Port missing layouts from slidev-theme-csscade into slidev-theme-feoche

**Date:** 2026-07-02
**Status:** Approved for planning

## Goal

Add the layouts that `slidev-theme-csscade` (`C:/dev/slidev-theme-csscade`) provides
but the local `slidev-theme-feoche` theme (`src/_theme/`) lacks — ported to feoche's
own conventions rather than copied verbatim — plus targeted improvements.

## Context

- feoche has 19 layouts, styled with Tailwind/UnoCSS `@apply`, BEM-ish class names
  (`two-cols-header__col-left`), `<div class="slidev-layout NAME">` wrappers, and
  feoche design tokens (`--primary-color`, `--theme-primary`, …).
- `global-bottom.vue` already renders a page-number + progress-bar footer on every
  non-cover slide. csscade's per-slide `<slides-current-number/>` badge is therefore
  **redundant** and must NOT be ported.
- Headings are styled globally (`fonts.css`, Outfit). Ports must not reference
  csscade's `--font-primary` / `--font-secondary` variables.
- feoche layouts take `class` and `layoutClass` props (see `two-cols-header.vue`);
  ports follow the same signature.

## Scope

### Layouts to add (8 new `.vue` files in `src/_theme/layouts/`)

1. **three-cols** — grid `1fr 2fr 1fr`; named slots `left` / `center` / `right`
   plus optional `bottom` (aligned to grid end). Support a `.centered` layoutClass
   modifier that centers each column's content.
2. **three-cols-header** — default slot = full-width header row; then three equal
   columns (`left` / `center` / `right`).
3. **three-rows** — stacked `top` / `center` / `bottom` rows. **Minimal port:**
   drop csscade's `arrow-circle` decoration and its `arrow.png` asset dependency.
   Clean grid consistent with feoche's other layouts.
4. **six-cells-header** — default slot = full-width header; then a 2×3 grid with
   slots `top-left` / `top-center` / `top-right` / `bottom-left` / `bottom-center`
   / `bottom-right`. **Bug fix:** csscade maps `top-center` to grid-area `1/1/2/2`
   (same cell as `top-left`); the port sets it to `1/2/2/3`. Also note csscade's
   selectors are `.cells-top-left` (never matching `.col-top-left`); the port uses
   consistent, matching class names.
5. **screenshot** — device-framed image via a `screenshot` prop and a `layoutClass`
   of `laptop` (default) or `mobile`; slots `left` / `right` flank the frame.
   Copy `macbook-air-frame.png` and `iphone-15-pro-max-frame.png` from
   csscade's `public/` into `src/_theme/public/`. Recolor any chrome to feoche tokens.
6. **404** — utility layout; recolor teal → `--primary-color`.
7. **error** — utility layout; keep red error styling.
8. **none** — bare passthrough (`<slot/>` with no chrome).

### Assets

- Copy 2 PNGs into `src/_theme/public/`:
  `macbook-air-frame.png`, `iphone-15-pro-max-frame.png`.

### Documentation

- Add a short usage snippet per new layout to `src/_theme/README.md`.

## Conventions (apply to every ported layout)

- Wrapper: `<div class="slidev-layout NAME" :class="layoutClass">` (not `<section>`).
- Layout CSS via Tailwind `@apply` where practical, matching `two-cols-header.vue`;
  fall back to plain CSS grid definitions for grid-area maps.
- BEM class names scoped by layout (e.g. `three-cols__col-left`).
- Props: `class` (applied to inner cells) and `layoutClass` (applied to wrapper).
- No `<slides-current-number/>`, no `--font-*` csscade vars, no csscade component deps.

## Out of scope

- **statement** layout (excluded per user selection; depends on the animated
  `big-concept` water-circle component).
- Existing feoche-only layouts `disclaimer` and `image-full` — left untouched.
- No changes to tokens, `global-bottom`, build pipeline, or existing layouts.

## Success criteria

- 8 new layouts render correctly in `pnpm dev` in both light and dark schemes.
- No per-slide number badge duplicated over the existing footer.
- `screenshot` layout displays laptop and mobile frames with the provided PNGs.
- `six-cells-header` places all six cells in distinct grid areas.
- README documents each new layout with a usage snippet.
