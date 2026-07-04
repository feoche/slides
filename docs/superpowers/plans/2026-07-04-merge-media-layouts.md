# Merge media layouts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the twelve `image-*` / `iframe-*` / `image-window-*` Slidev layouts with four `media-*` layouts that select chrome via a `window: true` frontmatter flag.

**Architecture:** Each `media-*` layout wraps a single `src`. When `window` is falsy it renders a plain image (or CSS background) exactly as the old `image-*` layouts did; when `window` is true it renders the existing `Window` component, which already auto-detects iframe-vs-image (src extension) and desktop-vs-mobile (aspect ratio). Placement (`media`, `media-full`, `media-left`, `media-right`) is the only axis that maps to separate files.

**Tech Stack:** Slidev 52, Vue 3 `<script setup>`, UnoCSS (`@apply`), the existing `Window.vue` component and `layoutHelper.ts`.

## Global Constraints

- Package manager: **pnpm**. Build command: `pnpm build` (runs `slidev build` on root `slides.md`).
- There is **no unit-test framework** in this repo. Verification is a successful build plus visual inspection of the root `slides.md` showcase.
- Unified frontmatter props across all four layouts: `src`, `window?`, `type?` (`desktop`/`mobile`), `scale?`, `objectFit?`, `backgroundSize?`, `windowTitle?`, `class?`.
- `Window` prop names are unchanged: `:src`, `:scale`, `:object-fit`, `:type`, `:title`.
- Preserve existing spacing/CSS: plain layouts must look identical to the old `image-*`; windowed layouts identical to the old `iframe-*` / `image-window-*`.
- Migration must NOT touch: deck-level top-frontmatter `url:` keys (they are deck metadata, not on a media slide), and the `end` layout's `image:` prop.

## File structure

- Create: `src/theme/layouts/media.vue`, `media-full.vue`, `media-left.vue`, `media-right.vue`
- Delete: `src/theme/layouts/{image,image-full,image-left,image-right,iframe,iframe-full,iframe-left,iframe-right,image-window,image-window,image-window-full,image-window-left,image-window-right}.vue`
- Modify decks: `slides.md` (showcase), `decks/pro/ovhcloud-design-system/slides.md`, `decks/pro/mauvaise-ux-sauve-voyage/slides.md`, `decks/pro/bookmarklets/slides.md`, `decks/pro/digital-bot-twitter/slides.md`

Historical files under `docs/superpowers/` are intentionally left unchanged.

---

### Task 1: Add `media.vue` and `media-full.vue`

**Files:**
- Create: `src/theme/layouts/media.vue`
- Create: `src/theme/layouts/media-full.vue`

**Interfaces:**
- Consumes: `Window` (global component), `handleBackground` from `../layoutHelper`.
- Produces: layouts `media` and `media-full` accepting props `src, window, type, scale, objectFit, backgroundSize, windowTitle`.

- [ ] **Step 1: Create `src/theme/layouts/media.vue`**

```vue
<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps<{
  src?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
}>();

const style = computed(() =>
  handleBackground("transparent", false, props.backgroundSize ?? "cover"),
);
</script>

<template>
  <div class="slidev-layout media default" :class="{ 'media--window': window }">
    <slot />
    <Window
      v-if="window"
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
    <img v-else :src="src" :style="style" />
  </div>
</template>

<style>
.slidev-layout.media {
  @apply h-full;
}
.slidev-layout.media:not(.media--window) {
  @apply flex flex-col gap-8;

  img {
    @apply h-full w-auto object-contain;
  }
}
.slidev-layout.media--window {
  width: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 2: Create `src/theme/layouts/media-full.vue`**

```vue
<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps<{
  src?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
}>();

const style = computed(() =>
  handleBackground(props.src, false, props.backgroundSize ?? "contain"),
);
</script>

<template>
  <div
    v-if="window"
    class="slidev-layout media-full media-full--window default"
  >
    <Window
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
  </div>
  <div v-else class="slidev-layout media-full default" :style="style">
    <slot />
  </div>
</template>

<style>
.slidev-layout.media-full {
  height: calc(100% - 2.5rem);
}
.slidev-layout.media-full--window {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/layouts/media.vue src/theme/layouts/media-full.vue
git commit -m "feat(theme): add media and media-full layouts"
```

---

### Task 2: Add `media-left.vue` and `media-right.vue`

**Files:**
- Create: `src/theme/layouts/media-left.vue`
- Create: `src/theme/layouts/media-right.vue`

**Interfaces:**
- Consumes: `Window`, `handleBackground`.
- Produces: layouts `media-left` and `media-right` with the same prop set as Task 1 plus optional `class`.

- [ ] **Step 1: Create `src/theme/layouts/media-left.vue`**

```vue
<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps<{
  src?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
  class?: string;
}>();

const style = computed(() =>
  handleBackground(props.src, false, props.backgroundSize ?? "cover"),
);
</script>

<template>
  <div class="media-left" :class="{ 'media-left--window': window }">
    <Window
      v-if="window"
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
    <div v-else class="media-left__image" :style="style" />
    <div class="slidev-layout default" :class="props.class">
      <slot />
    </div>
  </div>
</template>

<style>
.media-left {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);

  &__image {
    @apply w-full h-full;
  }
}
.media-left:not(.media-left--window) {
  @apply auto-rows-fr;
}
.media-left--window .window {
  @apply my-[2.5rem] mx-auto;
  height: calc(100% - 2.5rem);
}
</style>
```

- [ ] **Step 2: Create `src/theme/layouts/media-right.vue`**

```vue
<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps<{
  src?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
  class?: string;
}>();

const style = computed(() =>
  handleBackground(props.src, false, props.backgroundSize ?? "cover"),
);
</script>

<template>
  <div class="media-right" :class="{ 'media-right--window': window }">
    <div class="slidev-layout default" :class="props.class">
      <slot />
    </div>
    <Window
      v-if="window"
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
    <div v-else class="media-right__image" :style="style" />
  </div>
</template>

<style>
.media-right {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);

  &__image {
    @apply w-full h-full;
  }
}
.media-right:not(.media-right--window) {
  @apply auto-rows-fr;
}
.media-right--window {
  width: calc(100% - 2.5rem);
}
.media-right--window .window,
.media-right--window .mobile {
  height: calc(100% - 2.5rem);
  margin: 2.5rem auto;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/layouts/media-left.vue src/theme/layouts/media-right.vue
git commit -m "feat(theme): add media-left and media-right layouts"
```

---

### Task 3: Migrate the root `slides.md` showcase and delete old layouts

Rewrite the showcase demo block (currently lines ~191-273 covering `image-full`, `image`, `image-left`, `image-right`, `iframe-full`, `iframe`, `iframe-left`, `iframe-right`) into `media-*` demos showing both plain and windowed forms. Then delete the twelve old layout files.

**Files:**
- Modify: `slides.md`
- Delete: `src/theme/layouts/image.vue`, `image-full.vue`, `image-left.vue`, `image-right.vue`, `iframe.vue`, `iframe-full.vue`, `iframe-left.vue`, `iframe-right.vue`, `image-window.vue`, `image-window-full.vue`, `image-window-left.vue`, `image-window-right.vue`

- [ ] **Step 1: Replace the showcase block in `slides.md`**

Find the eight consecutive slides beginning with `layout: image-full` (the one whose `image:` is the `iamfy.co` URL) and ending with the `iframe-right` slide. Replace that entire run of eight slides with the following ten slides (keep the `iamfy.co` image URL and the `https://francoiseoche.fr/` URL as-is):

```markdown
---
layout: media-full
src: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
backgroundSize: contain
---

<!-- Speaker Notes -->

---
layout: media
src: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
---

## Media

<!-- Speaker Notes -->

---
layout: media-left
src: "https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60"
---

## Media Left
### A cool subtitle

This is an image on the left

<!-- Speaker Notes -->

---
layout: media-right
src: "https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60"
---

## Media Right
### A cool subtitle

This is an image on the right

---
layout: media-full
window: true
src: https://francoiseoche.fr/
windowTitle: Website
---

<!-- Speaker Notes -->

---
layout: media
window: true
src: https://francoiseoche.fr/
windowTitle: Website
---

## Media Window

<!-- Speaker Notes -->

---
layout: media-left
window: true
src: https://francoiseoche.fr/
windowTitle: Website
---

## Media Window Left
### A cool subtitle

This is an iframe on the left

<!-- Speaker Notes -->

---
layout: media-right
window: true
src: https://francoiseoche.fr/
windowTitle: Website
---

## Media Window Right
### A cool subtitle

This is an iframe on the right

<!-- Speaker Notes -->

---
layout: media
window: true
src: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
---

## Media Window (portrait → mobile frame)

<!-- Speaker Notes -->
```

- [ ] **Step 2: Delete the twelve old layout files**

```bash
git rm src/theme/layouts/image.vue src/theme/layouts/image-full.vue \
  src/theme/layouts/image-left.vue src/theme/layouts/image-right.vue \
  src/theme/layouts/iframe.vue src/theme/layouts/iframe-full.vue \
  src/theme/layouts/iframe-left.vue src/theme/layouts/iframe-right.vue \
  src/theme/layouts/image-window.vue src/theme/layouts/image-window-full.vue \
  src/theme/layouts/image-window-left.vue src/theme/layouts/image-window-right.vue
```

- [ ] **Step 3: Build to verify the showcase compiles with no unknown layouts**

Run: `pnpm build`
Expected: build completes with no "layout not found" / unresolved-component warnings for `image*`/`iframe*`.

- [ ] **Step 4: Visually verify the showcase**

Run `pnpm exec slidev` (dev server), open the Media/Media-window slides, and confirm: plain image full/center/left/right render as before; windowed full/center/left/right show browser chrome with the URL; the final portrait image shows the mobile phone frame.

- [ ] **Step 5: Commit**

```bash
git add slides.md src/theme/layouts
git commit -m "refactor(theme): migrate showcase to media layouts, remove old layouts"
```

---

### Task 4: Migrate the four decks

Apply this mechanical transformation to every slide that uses an old media layout. Do it one deck at a time.

**Rename `layout:` and, for iframe/image-window sources, add `window: true`:**

| old `layout:` | new `layout:` | add `window: true`? |
| --- | --- | --- |
| `image` | `media` | no |
| `image-full` | `media-full` | no |
| `image-left` | `media-left` | no |
| `image-right` | `media-right` | no |
| `image-window` | `media` | yes |
| `image-window-full` | `media-full` | yes |
| `image-window-left` | `media-left` | yes |
| `image-window-right` | `media-right` | yes |
| `iframe` | `media` | yes |
| `iframe-full` | `media-full` | yes |
| `iframe-left` | `media-left` | yes |
| `iframe-right` | `media-right` | yes |

**On each migrated slide only, rename props:** `image:` → `src:`, `url:` → `src:`, `iframeTitle:` → `windowTitle:`. Leave `backgroundSize:`, `scale:`, `objectFit:`, `type:` unchanged.

**Do NOT change:** any top-of-file deck metadata `url:` (e.g. `url: https://slides.com/...` near line 13, which is not inside a media slide), and the `end` layout's `image:` prop.

**Files:**
- Modify: `decks/pro/ovhcloud-design-system/slides.md` (25 × `image-full`, all with `backgroundSize: contain` + `image:`)
- Modify: `decks/pro/mauvaise-ux-sauve-voyage/slides.md` (`image`, `image-full`, and `image-window` / `image-window-left` / `image-window-right` → add `window: true`; note the `objectFit: cover` on the left one stays)
- Modify: `decks/pro/bookmarklets/slides.md` (many `image-right` + one `image`, all with `image:` + `backgroundSize:`; the `layout: end` slide and top `url:` are untouched)
- Modify: `decks/pro/digital-bot-twitter/slides.md` (`image` / `image-full`; the `layout: end` slide at the bottom keeps its `image:` prop untouched)

- [ ] **Step 1: Migrate `decks/pro/ovhcloud-design-system/slides.md`**

Every slide is `layout: image-full` → `layout: media-full`, and its `image:` → `src:`. `backgroundSize: contain` stays. No `window` flag.

- [ ] **Step 2: Migrate `decks/pro/mauvaise-ux-sauve-voyage/slides.md`**

Apply the table. Specifically: `image` → `media`; `image-full` → `media-full`; `image-window` → `media` + `window: true`; `image-window-left` → `media-left` + `window: true`; `image-window-right` → `media-right` + `window: true`. Rename every `image:` → `src:`. Leave the top-of-file `url:` deck metadata untouched.

- [ ] **Step 3: Migrate `decks/pro/bookmarklets/slides.md`**

`image-right` → `media-right`, `image` → `media`; each `image:` → `src:`; `backgroundSize:` stays. Do not touch the top `url:` metadata or the `layout: end` slide.

- [ ] **Step 4: Migrate `decks/pro/digital-bot-twitter/slides.md`**

`image` → `media`, `image-full` → `media-full`; each `image:` → `src:`. Leave the bottom `layout: end` slide's `image:` prop untouched.

- [ ] **Step 5: Verify no old layout names or stale props remain in decks**

Run: `git grep -nE "^layout: (image|iframe|image-window)|^(url|image|iframeTitle):" -- decks slides.md`
Expected: the only matches are the intentional deck-metadata `url:` lines and the `end` layout's `image:` line — no `layout: image*`/`iframe*`, no media-slide `image:`/`url:`/`iframeTitle:`.

- [ ] **Step 6: Build each migrated deck**

Run: `pnpm exec slidev build decks/pro/ovhcloud-design-system/slides.md` (repeat for the other three deck paths).
Expected: each build completes with no unresolved-layout errors.

- [ ] **Step 7: Commit**

```bash
git add decks slides.md
git commit -m "refactor(decks): migrate all decks to media layouts"
```

---

## Self-review notes

- **Spec coverage:** four layouts (Tasks 1-2) ✓; `window` flag ✓; unified `src`/`windowTitle` props ✓; delete old layouts (Task 3) ✓; migrate all decks + collapse showcase (Tasks 3-4) ✓; build verification ✓.
- **Placeholders:** none — full `.vue` source and exact migration rules given.
- **Type consistency:** prop set (`src, window, type, scale, objectFit, backgroundSize, windowTitle`, plus `class` on left/right) is identical across all four layout files and matches the `Window` props (`src, scale, object-fit, type, title`).
