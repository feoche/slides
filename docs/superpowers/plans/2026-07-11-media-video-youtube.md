# Media Video + YouTube Auto-Detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the `media` prop of every media layout accept an image, mp4/video file, or YouTube URL and auto-render the correct element, in both plain and window (browser/phone chrome) modes.

**Architecture:** Add pure detection helpers (`detectMediaKind`, `toYouTubeEmbed`) to `layoutHelper.ts`. Add a `Media.vue` component that renders the right element for a `src`. Layouts keep `background-image` for images (no regression) and render `<Media>` for video/youtube. `Window.vue` widens its `renderAs` detection to the new kinds.

**Tech Stack:** Vue 3 (`<script setup lang="ts">`), Slidev theme (`slidev-theme-feoche`), UnoCSS/Tailwind attributify, Node 25 (runs `.ts` directly for tests).

## Global Constraints

- Video playback: native `controls`, `playsinline`, click-to-play. **No** autoplay/loop/muted.
- YouTube: accept `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`; normalize to `https://www.youtube.com/embed/<id>`; preserve a `t=`/`start=` timestamp as `start=<seconds>`.
- Images must render **exactly** as today (via `background-image` in `media-full`/`media-left`/`media-right`).
- `IMAGE_EXT` lives in `layoutHelper.ts` only; `Window.vue` imports it (no duplicate copy).
- Detection order: youtube → video → image → iframe (fallback).
- No new npm dependencies. Vue component verification is visual (`pnpm dev`); repo has no component test harness.

---

### Task 1: Detection helpers in `layoutHelper.ts`

**Files:**
- Modify: `src/theme/layoutHelper.ts` (add exports near the top, after `resolveAssetUrl`)
- Test: `src/theme/layoutHelper.test.ts` (new; runnable via `node --test`)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export type MediaKind = "image" | "video" | "youtube" | "iframe"`
  - `export function detectMediaKind(src?: string): MediaKind`
  - `export function toYouTubeEmbed(url: string): string`
  - `export const IMAGE_EXT: RegExp` (exported so `Window.vue` reuses it)

- [ ] **Step 1: Write the failing test**

Create `src/theme/layoutHelper.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectMediaKind, toYouTubeEmbed } from "./layoutHelper.ts";

test("detectMediaKind classifies by extension and host", () => {
  assert.equal(detectMediaKind("/foo.png"), "image");
  assert.equal(detectMediaKind("/foo.JPG?x=1"), "image");
  assert.equal(detectMediaKind("/clip.mp4"), "video");
  assert.equal(detectMediaKind("/clip.webm"), "video");
  assert.equal(detectMediaKind("https://youtu.be/abc123"), "youtube");
  assert.equal(detectMediaKind("https://www.youtube.com/watch?v=abc123"), "youtube");
  assert.equal(detectMediaKind("https://example.com/app"), "iframe");
  assert.equal(detectMediaKind(undefined), "iframe");
  assert.equal(detectMediaKind(""), "iframe");
});

test("toYouTubeEmbed normalizes all URL forms", () => {
  assert.equal(toYouTubeEmbed("https://www.youtube.com/watch?v=abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(toYouTubeEmbed("https://youtu.be/abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(toYouTubeEmbed("https://www.youtube.com/embed/abc123"), "https://www.youtube.com/embed/abc123");
  assert.equal(toYouTubeEmbed("https://www.youtube.com/shorts/abc123"), "https://www.youtube.com/embed/abc123");
});

test("toYouTubeEmbed preserves timestamp as start=", () => {
  assert.equal(toYouTubeEmbed("https://youtu.be/abc123?t=90"), "https://www.youtube.com/embed/abc123?start=90");
  assert.equal(toYouTubeEmbed("https://www.youtube.com/watch?v=abc123&t=90s"), "https://www.youtube.com/embed/abc123?start=90");
});

test("toYouTubeEmbed returns input unchanged when no id", () => {
  assert.equal(toYouTubeEmbed("https://youtube.com/"), "https://youtube.com/");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/theme/layoutHelper.test.ts`
Expected: FAIL — `detectMediaKind`/`toYouTubeEmbed` are not exported yet (import error / not a function).

- [ ] **Step 3: Write minimal implementation**

In `src/theme/layoutHelper.ts`, add after the `resolveAssetUrl` function (top of file):

```ts
export type MediaKind = "image" | "video" | "youtube" | "iframe";

export const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
const YOUTUBE_RE = /(?:youtube\.com|youtu\.be)/i;

export function detectMediaKind(src?: string): MediaKind {
    if (!src) return "iframe";
    if (YOUTUBE_RE.test(src)) return "youtube";
    if (VIDEO_EXT.test(src)) return "video";
    if (IMAGE_EXT.test(src)) return "image";
    return "iframe";
}

export function toYouTubeEmbed(url: string): string {
    const idMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]+)/i,
    );
    if (!idMatch) return url;
    const id = idMatch[1];
    const tsMatch = url.match(/[?&](?:t|start)=(\d+)s?/i);
    const query = tsMatch ? `?start=${tsMatch[1]}` : "";
    return `https://www.youtube.com/embed/${id}${query}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/theme/layoutHelper.test.ts`
Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/theme/layoutHelper.ts src/theme/layoutHelper.test.ts
git commit -m "feat(theme): add media-kind detection and youtube embed helpers"
```

---

### Task 2: `Media.vue` renderer component

**Files:**
- Create: `src/theme/components/Media.vue`

**Interfaces:**
- Consumes: `detectMediaKind`, `toYouTubeEmbed`, `resolveAssetUrl`, `MediaKind` from `../layoutHelper`.
- Produces: `<Media :src="..." :object-fit="..." :kind="..." />` — a component that fills its container (`w-full h-full`) and renders the correct element. `kind` is optional and overrides auto-detection.

- [ ] **Step 1: Create the component**

Create `src/theme/components/Media.vue`:

```vue
<script setup lang="ts">
import { computed } from "vue";
import {
  detectMediaKind,
  toYouTubeEmbed,
  resolveAssetUrl,
  type MediaKind,
} from "../layoutHelper";

const props = defineProps<{
  src: string;
  objectFit?: string;
  kind?: MediaKind;
}>();

const kind = computed<MediaKind>(() => props.kind ?? detectMediaKind(props.src));
const resolved = computed(() => resolveAssetUrl(props.src));
const embedSrc = computed(() =>
  kind.value === "youtube" ? toYouTubeEmbed(props.src) : props.src,
);
const fitStyle = computed(() => ({ objectFit: props.objectFit || "contain" }));
</script>

<template>
  <video
    v-if="kind === 'video'"
    class="media-el"
    :src="resolved"
    :style="fitStyle"
    controls
    playsinline
  />
  <iframe
    v-else-if="kind === 'youtube'"
    class="media-el"
    :src="embedSrc"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
  <iframe v-else-if="kind === 'iframe'" class="media-el" :src="src" />
  <img v-else class="media-el" :src="resolved" :style="fitStyle" />
</template>

<style>
.media-el {
  @apply w-full h-full;
}
</style>
```

- [ ] **Step 2: Verify it type-checks via build**

Run: `pnpm build`
Expected: build succeeds (no Vue/TS errors referencing `Media.vue`). This is the verification gate — the component is exercised visually in Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/theme/components/Media.vue
git commit -m "feat(theme): add Media component rendering image/video/youtube/iframe"
```

---

### Task 3: `media.vue` layout uses `<Media>` in plain mode

**Files:**
- Modify: `src/theme/layouts/media.vue`

**Interfaces:**
- Consumes: `<Media>` (Task 2), globally registered by Slidev (components in `src/theme/components/` auto-register). No import needed in `<template>`.
- Produces: unchanged layout name/props.

- [ ] **Step 1: Replace the plain `<img>` with `<Media>`**

In `src/theme/layouts/media.vue` `<template>`, replace this line:

```vue
    <img v-else :src="media" :style="style" />
```

with:

```vue
    <Media v-else :src="media" :object-fit="objectFit" />
```

- [ ] **Step 2: Retarget the plain-mode CSS**

In the `<style>` block, change the `img` selector under `&:not(.media--window)` from:

```css
    img {
      @apply h-full w-auto object-contain;
    }
```

to:

```css
    :where(img, video, iframe) {
      @apply h-full w-auto object-contain;
    }
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: build succeeds. (`style`/`handleBackground` may now be unused — if the build warns, remove the now-dead `style` computed and its `handleBackground` import from `media.vue` and rebuild.)

- [ ] **Step 4: Commit**

```bash
git add src/theme/layouts/media.vue
git commit -m "feat(theme): render video/youtube in media layout plain mode"
```

---

### Task 4: `media-full` / `media-left` / `media-right` plain-mode branching

**Files:**
- Modify: `src/theme/layouts/media-full.vue`
- Modify: `src/theme/layouts/media-left.vue`
- Modify: `src/theme/layouts/media-right.vue`

**Interfaces:**
- Consumes: `detectMediaKind` from `../layoutHelper`; `<Media>` (auto-registered).
- Produces: unchanged layout names/props. Images keep `background-image`; video/youtube/iframe render `<Media>`.

- [ ] **Step 1: `media-full.vue` — add `kind` computed**

In `<script setup>`, add the import and computed (keep existing `handleBackground` import and `style`):

```ts
import { detectMediaKind } from "../layoutHelper";
```

```ts
const isImage = computed(() => detectMediaKind(props.media) === "image");
```

- [ ] **Step 2: `media-full.vue` — branch the plain-mode div**

Replace the plain-mode block:

```vue
  <div v-else class="slidev-layout media-full default" :style="style">
    <slot />
  </div>
```

with:

```vue
  <div
    v-else
    class="slidev-layout media-full default"
    :style="isImage ? style : undefined"
  >
    <slot />
    <Media v-if="!isImage" :src="media" :object-fit="objectFit" />
  </div>
```

- [ ] **Step 3: `media-left.vue` — add `isImage` computed**

In `<script setup>` add:

```ts
import { detectMediaKind } from "../layoutHelper";
```

```ts
const isImage = computed(() => detectMediaKind(props.media) === "image");
```

- [ ] **Step 4: `media-left.vue` — branch the media container**

Replace:

```vue
      <div v-else class="media-left__image" :style="style" />
```

with:

```vue
      <div v-else-if="isImage" class="media-left__image" :style="style" />
      <Media v-else :src="media" :object-fit="objectFit" />
```

- [ ] **Step 5: `media-right.vue` — add `isImage` computed**

In `<script setup>` add:

```ts
import { detectMediaKind } from "../layoutHelper";
```

```ts
const isImage = computed(() => detectMediaKind(props.media) === "image");
```

- [ ] **Step 6: `media-right.vue` — branch the media container**

Replace:

```vue
      <div v-else class="media-right__image" :style="style" />
```

with:

```vue
      <div v-else-if="isImage" class="media-right__image" :style="style" />
      <Media v-else :src="media" :object-fit="objectFit" />
```

- [ ] **Step 7: Verify build**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/theme/layouts/media-full.vue src/theme/layouts/media-left.vue src/theme/layouts/media-right.vue
git commit -m "feat(theme): render video/youtube in split/full media layouts (plain mode)"
```

---

### Task 5: `Window.vue` — video + youtube inside the chrome

**Files:**
- Modify: `src/theme/components/Window.vue`

**Interfaces:**
- Consumes: `detectMediaKind`, `toYouTubeEmbed`, `resolveAssetUrl`, `IMAGE_EXT`, `MediaKind` from `../layoutHelper`.
- Produces: `Window` now renders `video` and `youtube` kinds in both desktop and mobile frames.

- [ ] **Step 1: Import helpers and remove the local `IMAGE_EXT`**

At the top of `<script setup>`, add to the existing vue import block a helpers import:

```ts
import {
  detectMediaKind,
  toYouTubeEmbed,
  resolveAssetUrl,
  IMAGE_EXT,
  type MediaKind,
} from "../layoutHelper";
```

Delete the local line:

```ts
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;
```

- [ ] **Step 2: Widen the `content` prop and `renderAs`**

Change the prop type:

```ts
  content?: "iframe" | "image";
```

to:

```ts
  content?: MediaKind;
```

Change `renderAs`:

```ts
const renderAs = computed<"iframe" | "image">(
  () => props.content ?? (IMAGE_EXT.test(props.src) ? "image" : "iframe"),
);
```

to:

```ts
const renderAs = computed<MediaKind>(
  () => props.content ?? detectMediaKind(props.src),
);
```

- [ ] **Step 3: Add video/youtube branches — mobile frame**

In the mobile `.mobile-content` block, the current branches are `iframe` then `img`. Replace that inner content:

```vue
        <iframe
            v-if="renderAs === 'iframe'"
            :src="src"
            :style="
              scale
                ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
                : {}
            "
        />
        <img
            v-else
            ref="mobileImg"
            :src="src"
            class="mobile-img"
            :style="{ objectFit: objectFit || 'contain' }"
            @load="fitMobile"
        />
```

with:

```vue
        <iframe
            v-if="renderAs === 'iframe'"
            :src="src"
            :style="
              scale
                ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
                : {}
            "
        />
        <iframe
            v-else-if="renderAs === 'youtube'"
            :src="toYouTubeEmbed(src)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        />
        <video
            v-else-if="renderAs === 'video'"
            :src="resolveAssetUrl(src)"
            class="mobile-img"
            :style="{ objectFit: objectFit || 'contain' }"
            controls
            playsinline
        />
        <img
            v-else
            ref="mobileImg"
            :src="resolveAssetUrl(src)"
            class="mobile-img"
            :style="{ objectFit: objectFit || 'contain' }"
            @load="fitMobile"
        />
```

- [ ] **Step 4: Add video/youtube branches — desktop frame**

In the desktop `.window` block, replace:

```vue
    <iframe
      v-if="renderAs === 'iframe'"
      :src="src"
      :style="
        scale
          ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
          : {}
      "
    />
    <img
      v-else
      ref="img"
      :src="src"
      class="window-img"
      :style="{ objectFit: objectFit || 'contain' }"
      @load="fitImage"
    />
```

with:

```vue
    <iframe
      v-if="renderAs === 'iframe'"
      :src="src"
      :style="
        scale
          ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
          : {}
      "
    />
    <iframe
      v-else-if="renderAs === 'youtube'"
      :src="toYouTubeEmbed(src)"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <video
      v-else-if="renderAs === 'video'"
      :src="resolveAssetUrl(src)"
      class="window-img"
      :style="{ objectFit: objectFit || 'contain' }"
      controls
      playsinline
    />
    <img
      v-else
      ref="img"
      :src="resolveAssetUrl(src)"
      class="window-img"
      :style="{ objectFit: objectFit || 'contain' }"
      @load="fitImage"
    />
```

- [ ] **Step 5: Constrain image-only sizing classes to images**

The `.window--image` / `.mobile--image` classes are applied via `:class="{ 'window--image': renderAs === 'image' }"`. Video reuses `window-img`/`mobile-img` but the chrome-hug fit math (`fitImage`/`fitMobile`) is image-only (guarded by `renderAs.value !== "image"` — already returns early for video). No change needed; video sits inside the default `width:100%` chrome. Verify the existing early-return guards in `fitImage`/`fitMobile`/`detectDevice` read `renderAs.value !== "image"` (they do) — leave them.

- [ ] **Step 6: Verify build**

Run: `pnpm build`
Expected: build succeeds with no `IMAGE_EXT`/`renderAs` type errors.

- [ ] **Step 7: Commit**

```bash
git add src/theme/components/Window.vue
git commit -m "feat(theme): support video and youtube inside Window chrome"
```

---

### Task 6: Visual verification deck

**Files:**
- Create: `src/decks/_common/media-demo/slides.md` (throwaway verification deck)

**Interfaces:**
- Consumes: all layouts + `Media` + `Window`.
- Produces: a manual verification surface. Kept in the repo as a living example of the media layouts.

- [ ] **Step 1: Create the demo deck**

Create `src/decks/_common/media-demo/slides.md` (replace `<ID>` with a real public YouTube id, e.g. `dQw4w9WgXcQ`, and place any local `demo.mp4` in a sibling `public/` dir or reference an existing deck video such as `/tasnds.mp4`):

```md
---
theme: ../../../theme
---

# Media demo

---
layout: media
media: https://www.youtube.com/watch?v=dQw4w9WgXcQ
---

## YouTube, plain

---
layout: media
media: https://www.youtube.com/watch?v=dQw4w9WgXcQ
window: true
windowTitle: YouTube in a window
---

## YouTube, window (desktop)

---
layout: media-left
media: /demo.mp4
---

## Video, media-left plain

Click to play, audio kept.

---
layout: media-full
media: /demo.mp4
window: true
type: mobile
---
```

- [ ] **Step 2: Run the dev server and verify each slide**

Run: `pnpm dev` (opens browser; navigate the media-demo deck if the launcher lists decks, or run `pnpm exec slidev src/decks/_common/media-demo/slides.md`).
Expected, slide by slide:
1. YouTube plain — embed visible, plays on click.
2. YouTube window (desktop) — embed inside browser chrome.
3. Video media-left plain — `<video>` with controls; plays with audio on click; image slides elsewhere are unaffected.
4. Video media-full window mobile — `<video>` inside the phone frame.

Manually confirm an existing image deck (e.g. any deck already using `layout: media-full` with a `.png`) still renders identically.

- [ ] **Step 3: Final build gate**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/decks/_common/media-demo/slides.md
git commit -m "test(theme): add media video/youtube verification deck"
```

---

## Self-Review

**Spec coverage:**
- Detection helpers + youtube normalization + timestamp → Task 1. ✓
- `Media.vue` (image/video/youtube/iframe) → Task 2. ✓
- Plain-mode `media.vue` → Task 3; `media-full/left/right` keep `background-image` for images → Task 4. ✓
- `Window.vue` video/youtube in desktop + mobile, `IMAGE_EXT` deduped → Task 5. ✓
- Visual verification (image regression, video controls+audio, youtube, window chrome) → Task 6. ✓
- Video = controls/click-to-play/no autoplay; YouTube any-form normalize; both modes → Global Constraints, enforced in Tasks 2 & 5. ✓
- Out-of-scope items (autoplay modes, Vimeo, posters, captions) → not implemented. ✓

**Placeholder scan:** No TBD/TODO; all code shown. The demo deck's `<ID>` and `/demo.mp4` are explicitly flagged as user-supplied real assets, not code placeholders.

**Type consistency:** `MediaKind` defined in Task 1, imported unchanged in Tasks 2 & 5. `detectMediaKind(src?: string)` / `toYouTubeEmbed(url: string)` signatures identical across all call sites. `Media` props (`src`, `objectFit`, `kind`) match usage in Tasks 3 & 4. `renderAs` widened consistently in Task 5.
