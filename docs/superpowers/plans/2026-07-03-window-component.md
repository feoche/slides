# Window Component Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the duplicated browser-chrome markup/CSS from the theme's 8 `iframe*`/`image-window*` layouts into a single reusable `Window` component, then refactor all 8 layouts to consume it — with zero deck-facing changes.

**Architecture:** A new globally-auto-registered Vue component `src/theme/components/Window.vue` owns the window chrome (header, controls, address-bar subheader, container styling) and renders either an `<iframe>` (a live URL) or an `<img>` (an image), chosen by an auto-detected/overridable content type. Each of the 8 layouts is reduced to its own outer sizing/grid wrapper plus a `<Window>` element. The chrome CSS lives in `Window.vue` as a **non-scoped** `<style>` so it stays global — the `-left`/`-right` grid layouts rely on that (they never defined the container CSS themselves).

**Tech Stack:** Slidev (`@slidev/cli` ^52), Vue 3 `<script setup lang="ts">`, UnoCSS `@apply` with native CSS nesting, feoche design tokens (`--color-green`, `--color-deep-green`, `--color-cream`).

## Global Constraints

- **No deck-facing changes.** Layout-facing frontmatter keys stay exactly: `url`, `scale`, `image`, `objectFit`, `iframeTitle`. Layout file names are unchanged.
- **No new features.** No draggability, real navigation, or tabs. Visual output must be identical to before the refactor.
- **Component auto-registration:** Slidev auto-registers `.vue` files under the theme `components/` dir globally (as with the existing `Progress.vue`) — do NOT add manual imports in layouts.
- **Chrome CSS must be global** (non-scoped `<style>` in `Window.vue`) — the grid layouts depend on it.
- **Design tokens only:** header `--color-deep-green` / text `--color-cream`, container bg `--color-green`. Preserve verbatim.
- **No test harness exists.** Verification = `pnpm build` success + visual parity in `pnpm dev`. There is no unit-test runner; do not invent one.

---

## Testing approach (read before starting)

There is no automated component-test runner in this repo. Every task is verified by:

1. **Build gate (automated):** `pnpm build -- slides_window-test.md` must exit 0. Slidev only compiles layouts that a deck references, so the scratch deck `slides_window-test.md` (created in Task 1) exercises all 8 layouts + the `Window` component directly. A template/prop/CSS-compile error fails the build.
2. **Visual gate (manual reviewer checkpoint):** `pnpm dev slides_window-test.md`, then eyeball each slide in light and dark mode against the checklist. Because this is a pure refactor, the bar is *pixel-identical* to `main`.

The scratch deck is created in Task 1 and deleted in Task 4.

---

## Task 1: Create `Window.vue` + scratch verification deck

**Files:**
- Create: `src/theme/components/Window.vue`
- Create: `slides_window-test.md` (repo root — scratch deck, removed in Task 4)

**Interfaces:**
- Produces: component `<Window>` with props
  `src: string` (required),
  `title?: string`,
  `type?: 'iframe' | 'image'`,
  `scale?: number`,
  `objectFit?: string`.
  Auto-detects `image` when `src` matches `/\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i`, else `iframe`; explicit `type` wins. Renders `.window` root with header/subheader chrome (global classes `.window`, `.window-header`, `.window-title`, `.window-controls`, `.window-subheader`, `.window-subcontrols`, `.window-url`).

- [ ] **Step 1: Write the component**

Create `src/theme/components/Window.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  src: string
  title?: string
  type?: 'iframe' | 'image'
  scale?: number
  objectFit?: string
}>()

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i

const resolvedType = computed<'iframe' | 'image'>(() =>
  props.type ?? (IMAGE_EXT.test(props.src) ? 'image' : 'iframe'),
)

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`)
</script>

<template>
  <div
    class="window"
    :style="resolvedType === 'iframe' ? { width: scaleInvertPercent } : {}"
  >
    <span class="window-header">
      <span class="window-title">{{ title }}</span>
      <span class="window-controls">
        <span>−</span>
        <span class="text-sm">⧉</span>
        <span>×</span>
      </span>
    </span>
    <span class="window-subheader">
      <span class="window-subcontrols">
        <span>←</span>
        <span>→</span>
        <span>⟳</span>
      </span>
      <input
        type="search"
        class="window-url"
        :value="resolvedType === 'iframe' ? src : undefined"
      >
    </span>
    <iframe
      v-if="resolvedType === 'iframe'"
      id="frame"
      :src="src"
      :style="scale ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : {}"
    />
    <img
      v-else
      :src="src"
      class="w-full h-full object-top"
      :style="{ objectFit: objectFit || 'cover' }"
    />
  </div>
</template>

<style>
.window {
  @apply relative w-full h-full m-4 mb-0 rounded-2 overflow-hidden bg-[--color-green] border-1 border-gray box-sizing-border-box shadow-2xl;
  height: calc(100% - 1.5rem);

  .window-header {
    @apply flex bg-[--color-deep-green] color-[--color-cream] py-1.5 px-2 rounded-t-md place-content-between place-items-center overflow-hidden;
  }

  .window-title {
    @apply flex font-bold mx-1 color-[--color-cream];
  }

  .window-controls {
    @apply flex gap-1;

    & > span {
      @apply w-5 h-5 inline-flex items-center justify-center rounded-full bg-gray-200 font-sm opacity-50 color-[--color-deep-green];
    }
  }

  .window-subheader {
    @apply flex bg-gray-200 color-gray gap-2 p-1;

    .window-subcontrols {
      @apply flex gap-1 lh-1;

      & > span {
        @apply w-6 h-6 inline-flex items-center justify-center font-lg color-[--color-deep-green];
      }
    }

    input {
      @apply flex-1 px-2 rounded-sm border-gray border-solid border-1 text-xs lh-1 bg-[--color-cream] color-[--color-deep-green];
    }
  }

  iframe {
    @apply w-full h-full;
  }
}
</style>
```

Notes: the chrome markup/CSS is copied verbatim from `iframe.vue` with class names `iframe-*` → `window-*` and `.iframe-container` → `.window`. The `<style>` is intentionally **non-scoped** (no `scoped` attribute).

- [ ] **Step 2: Write the scratch verification deck**

Create `slides_window-test.md` at repo root. It references every layout under test plus the raw `<Window>` component, so the build compiles them all. Replace image paths with any existing asset if `/window-test.png` is absent — a real 404 image still renders the frame, which is enough for parity checks; or drop in any PNG under `public/`.

```markdown
---
theme: ./src/theme
title: Window component test
---

# Window test deck

Scratch deck — delete after verifying (plan Task 4).

---
layout: iframe
url: https://example.com
scale: 0.75
iframeTitle: Example (iframe)
---

## iframe (slot + window)

- bullet one
- bullet two

---
layout: iframe-full
url: https://example.com
iframeTitle: Example (iframe-full)
---

---
layout: iframe-left
url: https://example.com
iframeTitle: Example (iframe-left)
---

## iframe-left slot

window on the left

---
layout: iframe-right
url: https://example.com
iframeTitle: Example (iframe-right)
---

## iframe-right slot

window on the right

---
layout: image-window
image: https://example.com/window-test.png
iframeTitle: Shot (image-window)
---

## image-window (slot + window)

- bullet one

---
layout: image-window-full
image: https://example.com/window-test.png
iframeTitle: Shot (image-window-full)
---

---
layout: image-window-left
image: https://example.com/window-test.png
iframeTitle: Shot (image-window-left)
---

## image-window-left slot

---
layout: image-window-right
image: https://example.com/window-test.png
objectFit: contain
iframeTitle: Shot (image-window-right)
---

## image-window-right slot

---
layout: default
---

## Raw Window component

<Window src="https://example.com" title="Direct iframe" :scale="0.5" />

<Window src="https://example.com/pic.png" title="Direct image (auto-detect)" object-fit="contain" />

<Window src="https://example.com/no-ext" type="image" title="Type override → image" />
```

- [ ] **Step 3: Build to verify the component compiles**

Run: `pnpm build -- slides_window-test.md`
Expected: exits 0, prints `build complete` / `dist` output with no Vue template or UnoCSS errors. A failure here means a prop/template/CSS-nesting mistake in `Window.vue`.

- [ ] **Step 4: Visual check (manual reviewer gate)**

Run: `pnpm dev slides_window-test.md`
Expected in **both** light and dark mode:
- The "Raw Window component" slide shows: one live iframe window (URL `https://example.com` in the address bar), one image window (empty address bar, `contain` fit), and one image window forced by `type` override.
- Chrome looks identical to `main` (green header, `− ⧉ ×` controls, `← → ⟳` nav, rounded/shadowed container).

- [ ] **Step 5: Commit**

```bash
git add src/theme/components/Window.vue slides_window-test.md
git commit -m "feat(theme): add reusable Window component

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Refactor the iframe family (4 layouts) onto `Window`

**Files:**
- Modify: `src/theme/layouts/iframe.vue`
- Modify: `src/theme/layouts/iframe-full.vue`
- Modify: `src/theme/layouts/iframe-left.vue`
- Modify: `src/theme/layouts/iframe-right.vue`

**Interfaces:**
- Consumes: `<Window>` from Task 1 (`:src`, `:scale`, `:title`).
- Produces: layouts keep frontmatter keys `url`, `scale`, `iframeTitle` and their outer wrapper classes (`.iframe`, `.iframe-left`, `.iframe-right`). The duplicated `.iframe-container` CSS blocks are removed (now owned by `Window.vue`).

- [ ] **Step 1: Rewrite `iframe.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  url: string
  scale?: number
}>()
</script>

<template>
  <div class="slidev-layout iframe default">
    <slot/>
    <Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.iframe {
  @apply h-full;
  width: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 2: Rewrite `iframe-full.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  url: string
  scale?: number
}>()
</script>

<template>
  <div class="iframe">
    <Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.iframe {
  @apply h-full;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 3: Rewrite `iframe-left.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  url: string
  scale?: number
}>()
</script>

<template>
  <div class="iframe-left">
    <Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />
    <div class="slidev-layout default" v-bind="$attrs">
      <slot/>
    </div>
  </div>
</template>

<style>
.iframe-left {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 4: Rewrite `iframe-right.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  url: string
  scale?: number
}>()
</script>

<template>
  <div class="iframe-right">
    <div class="slidev-layout default" v-bind="$attrs">
      <slot/>
    </div>
    <Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.iframe-right {
  @apply grid grid-cols-2;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 5: Build**

Run: `pnpm build -- slides_window-test.md`
Expected: exits 0, no errors.

- [ ] **Step 6: Visual check (manual reviewer gate)**

Run: `pnpm dev slides_window-test.md`. Verify the four iframe slides are pixel-identical to `main`:
- `iframe`: window + slot bullets, URL in address bar, `scale: 0.75` shrinks the frame.
- `iframe-full`: single window filling the slide.
- `iframe-left` / `iframe-right`: window and slot on the correct sides (left = window left; right = window right).

- [ ] **Step 7: Commit**

```bash
git add src/theme/layouts/iframe.vue src/theme/layouts/iframe-full.vue src/theme/layouts/iframe-left.vue src/theme/layouts/iframe-right.vue
git commit -m "refactor(theme): use Window component in iframe layouts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Refactor the image-window family (4 layouts) onto `Window`

**Files:**
- Modify: `src/theme/layouts/image-window.vue`
- Modify: `src/theme/layouts/image-window-full.vue`
- Modify: `src/theme/layouts/image-window-left.vue`
- Modify: `src/theme/layouts/image-window-right.vue`

**Interfaces:**
- Consumes: `<Window>` from Task 1 (`:src`, `:object-fit`, `:title`).
- Produces: layouts keep frontmatter keys `image`, `objectFit`, `iframeTitle` and their outer wrapper classes (`.image-window`, `.image-window-left`, `.image-window-right`). The duplicated `.iframe-container` CSS is removed.

- [ ] **Step 1: Rewrite `image-window.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  image: string
  objectFit?: string
}>()
</script>

<template>
  <div class="slidev-layout image-window default">
    <slot/>
    <Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.image-window {
  @apply h-full;
  width: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 2: Rewrite `image-window-full.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  image: string
  objectFit?: string
}>()
</script>

<template>
  <div class="image-window-full">
    <Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.image-window-full {
  @apply h-full;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 3: Rewrite `image-window-left.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  image: string
  objectFit?: string
}>()
</script>

<template>
  <div class="image-window-left">
    <Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />
    <div class="slidev-layout default" v-bind="$attrs">
      <slot/>
    </div>
  </div>
</template>

<style>
.image-window-left {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 4: Rewrite `image-window-right.vue`**

Replace the whole file with:

```vue
<script setup lang="ts">
defineProps<{
  image: string
  objectFit?: string
}>()
</script>

<template>
  <div class="image-window-right">
    <div class="slidev-layout default" v-bind="$attrs">
      <slot/>
    </div>
    <Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.image-window-right {
  @apply grid grid-cols-2;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 5: Build**

Run: `pnpm build -- slides_window-test.md`
Expected: exits 0, no errors.

- [ ] **Step 6: Visual check (manual reviewer gate)**

Run: `pnpm dev slides_window-test.md`. Verify the four image-window slides are pixel-identical to `main`:
- image shown inside the window with an **empty** address bar.
- `image-window-right` slide uses `objectFit: contain` — image is letterboxed, not cropped.
- `-left` / `-right` place the window and slot on the correct sides.

- [ ] **Step 7: Commit**

```bash
git add src/theme/layouts/image-window.vue src/theme/layouts/image-window-full.vue src/theme/layouts/image-window-left.vue src/theme/layouts/image-window-right.vue
git commit -m "refactor(theme): use Window component in image-window layouts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Final verification and scratch cleanup

**Files:**
- Delete: `slides_window-test.md`

- [ ] **Step 1: Confirm no `iframe-container` / `iframe-header` references remain in layouts**

Run: `git grep -n "iframe-container\|iframe-header\|iframe-title\|iframe-subheader\|iframe-controls\|iframe-url" src/theme/`
Expected: **no output** (all chrome classes now live only as `window-*` inside `Window.vue`). If any match appears in a layout, that layout still has stale copied CSS/markup — remove it.

- [ ] **Step 2: Remove the scratch deck**

```bash
git rm slides_window-test.md
```

- [ ] **Step 3: Format touched files**

Run: `pnpm prettier --write "src/theme/**/*.vue"`
Expected: reformats without errors.

- [ ] **Step 4: Final build of a real deck**

Run: `pnpm build`
Expected: exits 0 (builds the repo's real root deck with no theme errors).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(theme): remove Window scratch deck, format layouts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review notes

- **Spec coverage:** `Window.vue` with `src`/`title`/`type`/`scale`/`objectFit` + auto-detect + override (Task 1); all 8 layouts refactored keeping frontmatter keys (Tasks 2–3); chrome CSS global & class-renamed `iframe-*`→`window-*` (Task 1 style block + Task 4 grep gate); address bar shows `src` for iframe / empty for image (Task 1 template); no deck-facing changes (Global Constraints + frontmatter preserved). All spec sections mapped.
- **Placeholder scan:** every code step contains complete file contents; commands have expected output. No TBD/TODO.
- **Type consistency:** prop names identical across tasks — `src`, `title`, `type`, `scale`, `objectFit`; layouts pass `:object-fit="objectFit"` (kebab attr → camel prop) and `:scale="scale"` consistently.
- **Note on pre-existing wrapper CSS:** `iframe.vue` and `iframe-full.vue` both define a global `.iframe` rule with slightly different height rules — this conflict pre-exists on `main` and is deliberately left unchanged (spec keeps wrapper CSS as-is).
