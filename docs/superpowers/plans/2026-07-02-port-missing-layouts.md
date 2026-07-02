# Port Missing Layouts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8 layouts from `slidev-theme-csscade` into the local `slidev-theme-feoche` theme (`src/_theme/`), rewritten in feoche's own conventions, plus two bug/asset fixes and README docs.

**Architecture:** Each layout is a Vue 3 SFC in `src/_theme/layouts/` using a `<div class="slidev-layout NAME">` wrapper, Tailwind/UnoCSS `@apply` for layout, BEM class names, and `class`/`layoutClass` props — mirroring the existing `two-cols-header.vue`. No per-slide number badge (the global footer already renders one). Verification is by building a scratch demo deck with the Slidev CLI, since the repo has no unit-test harness.

**Tech Stack:** Slidev (`@slidev/cli`), Vue 3, UnoCSS/Tailwind `@apply`, pnpm.

## Global Constraints

- Wrapper element: `<div class="slidev-layout NAME" :class="layoutClass">` — never `<section>`.
- Props signature on every layout: `const props = defineProps({ class: { type: String }, layoutClass: { type: String } })`; apply `layoutClass` to the wrapper and `props.class` to inner cells. (Exactly as `src/_theme/layouts/two-cols-header.vue`.)
- Never import or render `slides-current-number`, `big-concept`, or any csscade component.
- Never reference csscade CSS vars `--font-primary` / `--font-secondary`. Headings are already styled globally by `src/_theme/styles/fonts.css`.
- BEM class names scoped by layout, e.g. `three-cols__col-left`.
- Theme lives at `src/_theme/`; decks reference it via `theme: ./src/_theme`.
- Verification build command (run from repo root `C:/dev/slides`):
  `pnpm exec slidev build "<deck>" --out "<outdir>"`

---

## Task 0: Scratch demo deck for verification

**Files:**
- Create: `C:\Users\ADMINI~1\AppData\Local\Temp\claude\C--dev-slides\d15c9444-c9d5-4c74-8512-c7f5ab7383a0\scratchpad\layouts-demo.md`

This deck is a verification artifact only — it is NOT committed. Each later task appends a slide that exercises its layout, then rebuilds.

- [ ] **Step 1: Create the demo deck with a cover slide**

```markdown
---
theme: ./src/_theme
title: Layouts Demo
---

# Layouts Demo

Verification deck — not committed.
```

- [ ] **Step 2: Build it to confirm the toolchain works**

Run (from `C:/dev/slides`):
`pnpm exec slidev build "C:\Users\ADMINI~1\AppData\Local\Temp\claude\C--dev-slides\d15c9444-c9d5-4c74-8512-c7f5ab7383a0\scratchpad\layouts-demo.md" --out "C:\Users\ADMINI~1\AppData\Local\Temp\claude\C--dev-slides\d15c9444-c9d5-4c74-8512-c7f5ab7383a0\scratchpad\demo-dist"`

Expected: build completes with `build complete` / `dist` output and no errors. (No commit — scratch artifact.)

---

## Task 1: three-cols layout

**Files:**
- Create: `src/_theme/layouts/three-cols.vue`
- Verify: scratchpad `layouts-demo.md`

**Interfaces:**
- Produces: layout `three-cols`; named slots `left`, `center`, `right`, `bottom`; `layoutClass="centered"` modifier centers column content.

- [ ] **Step 1: Write the layout file**

`src/_theme/layouts/three-cols.vue`:

```vue
<!--
  Usage:
  ---
  layout: three-cols
  ---
  ::left::
  Left column
  ::center::
  Center column (wider)
  ::right::
  Right column
  ::bottom::
  Spans all columns, aligned to the bottom
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
})
</script>

<template>
  <div class="slidev-layout three-cols" :class="layoutClass">
    <div class="three-cols__cols">
      <div class="three-cols__col-left" :class="props.class">
        <slot name="left" />
      </div>
      <div class="three-cols__col-center" :class="props.class">
        <slot name="center" />
      </div>
      <div class="three-cols__col-right" :class="props.class">
        <slot name="right" />
      </div>
    </div>
    <div class="three-cols__col-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.slidev-layout.three-cols {
  @apply w-full h-full grid grid-rows-[1fr_auto] gap-4;

  .three-cols__cols {
    @apply grid gap-8;
    grid-template-columns: 1fr 2fr 1fr;
  }

  .three-cols__col-left,
  .three-cols__col-center,
  .three-cols__col-right {
    @apply flex flex-col gap-4;
  }

  .three-cols__col-bottom {
    align-self: end;
  }

  &.centered .three-cols__cols {
    @apply items-center;
  }

  &.centered .three-cols__col-left,
  &.centered .three-cols__col-center,
  &.centered .three-cols__col-right {
    @apply items-center justify-center text-center;
  }
}
</style>
```

- [ ] **Step 2: Add a demo slide** to the scratch `layouts-demo.md`:

```markdown
---
layout: three-cols
---
::left::
### Left
Narrow
::center::
### Center
Wide middle column
::right::
### Right
Narrow
::bottom::
Spanning footer row
```

- [ ] **Step 3: Build to verify it compiles and renders**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds, no Vue/SFC errors.

- [ ] **Step 4: Commit**

```bash
git add src/_theme/layouts/three-cols.vue
git commit -m "feat(theme): add three-cols layout"
```

---

## Task 2: three-cols-header layout

**Files:**
- Create: `src/_theme/layouts/three-cols-header.vue`
- Verify: scratchpad `layouts-demo.md`

**Interfaces:**
- Produces: layout `three-cols-header`; default slot = full-width header; named slots `left`, `center`, `right`.

- [ ] **Step 1: Write the layout file**

`src/_theme/layouts/three-cols-header.vue`:

```vue
<!--
  Usage:
  ---
  layout: three-cols-header
  ---
  # Header spanning all columns
  ::left::
  Left
  ::center::
  Center
  ::right::
  Right
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
})
</script>

<template>
  <div class="slidev-layout three-cols-header" :class="layoutClass">
    <div class="three-cols-header__col-header">
      <slot />
    </div>
    <div class="three-cols-header__col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="three-cols-header__col-center" :class="props.class">
      <slot name="center" />
    </div>
    <div class="three-cols-header__col-right" :class="props.class">
      <slot name="right" />
    </div>
  </div>
</template>

<style>
.slidev-layout.three-cols-header {
  @apply grid grid-cols-3 grid-rows-[auto_1fr] w-full h-full gap-4;

  .three-cols-header__col-header {
    @apply flex flex-col gap-4;
    grid-area: 1 / 1 / 2 / 4;
  }

  .three-cols-header__col-left {
    @apply flex flex-col gap-4;
    grid-area: 2 / 1 / 3 / 2;
  }

  .three-cols-header__col-center {
    @apply flex flex-col gap-4;
    grid-area: 2 / 2 / 3 / 3;
  }

  .three-cols-header__col-right {
    @apply flex flex-col gap-4;
    grid-area: 2 / 3 / 3 / 4;
  }
}
</style>
```

- [ ] **Step 2: Add a demo slide** to scratch `layouts-demo.md`:

```markdown
---
layout: three-cols-header
---
## Three columns with a header
::left::
Left
::center::
Center
::right::
Right
```

- [ ] **Step 3: Build to verify**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/_theme/layouts/three-cols-header.vue
git commit -m "feat(theme): add three-cols-header layout"
```

---

## Task 3: three-rows layout (minimal)

**Files:**
- Create: `src/_theme/layouts/three-rows.vue`
- Verify: scratchpad `layouts-demo.md`

**Interfaces:**
- Produces: layout `three-rows`; named slots `top`, `center`, `bottom`. No arrow decoration (dropped vs csscade).

- [ ] **Step 1: Write the layout file**

`src/_theme/layouts/three-rows.vue`:

```vue
<!--
  Usage:
  ---
  layout: three-rows
  ---
  ::top::
  Top row
  ::center::
  Center row
  ::bottom::
  Bottom row
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
})
</script>

<template>
  <div class="slidev-layout three-rows" :class="layoutClass">
    <div class="three-rows__row-top" :class="props.class">
      <slot name="top" />
    </div>
    <div class="three-rows__row-center" :class="props.class">
      <slot name="center" />
    </div>
    <div class="three-rows__row-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.slidev-layout.three-rows {
  @apply w-full h-full grid grid-rows-3 gap-8;

  .three-rows__row-top,
  .three-rows__row-center,
  .three-rows__row-bottom {
    @apply flex flex-col justify-center gap-2;
  }
}
</style>
```

- [ ] **Step 2: Add a demo slide** to scratch `layouts-demo.md`:

```markdown
---
layout: three-rows
---
::top::
**Top**
::center::
**Center**
::bottom::
**Bottom**
```

- [ ] **Step 3: Build to verify**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/_theme/layouts/three-rows.vue
git commit -m "feat(theme): add minimal three-rows layout"
```

---

## Task 4: six-cells-header layout (grid-area bug fixed)

**Files:**
- Create: `src/_theme/layouts/six-cells-header.vue`
- Verify: scratchpad `layouts-demo.md`

**Interfaces:**
- Produces: layout `six-cells-header`; default slot = full-width header; named slots `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. Each cell occupies a distinct grid area (fixes csscade's duplicate `1/1/2/2` for `top-center`, and its `.cells-*` selectors that never matched the `.col-*` markup).

- [ ] **Step 1: Write the layout file**

`src/_theme/layouts/six-cells-header.vue`:

```vue
<!--
  Usage:
  ---
  layout: six-cells-header
  ---
  # Header spanning the grid
  ::top-left::
  #### Top left
  ::top-center::
  #### Top center
  ::top-right::
  #### Top right
  ::bottom-left::
  #### Bottom left
  ::bottom-center::
  #### Bottom center
  ::bottom-right::
  #### Bottom right
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
})
</script>

<template>
  <div class="slidev-layout six-cells-header" :class="layoutClass">
    <div class="six-cells-header__col-header">
      <slot />
    </div>
    <div class="six-cells-header__cells">
      <div class="six-cells-header__cell-top-left" :class="props.class">
        <slot name="top-left" />
      </div>
      <div class="six-cells-header__cell-top-center" :class="props.class">
        <slot name="top-center" />
      </div>
      <div class="six-cells-header__cell-top-right" :class="props.class">
        <slot name="top-right" />
      </div>
      <div class="six-cells-header__cell-bottom-left" :class="props.class">
        <slot name="bottom-left" />
      </div>
      <div class="six-cells-header__cell-bottom-center" :class="props.class">
        <slot name="bottom-center" />
      </div>
      <div class="six-cells-header__cell-bottom-right" :class="props.class">
        <slot name="bottom-right" />
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.six-cells-header {
  @apply grid grid-rows-[auto_1fr] w-full h-full gap-4;

  .six-cells-header__col-header {
    @apply flex flex-col gap-4;
  }

  .six-cells-header__cells {
    @apply grid gap-4;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  .six-cells-header__cells > div {
    @apply flex flex-col gap-2;
  }

  .six-cells-header__cell-top-left {
    grid-area: 1 / 1 / 2 / 2;
  }

  .six-cells-header__cell-top-center {
    grid-area: 1 / 2 / 2 / 3;
  }

  .six-cells-header__cell-top-right {
    grid-area: 1 / 3 / 2 / 4;
  }

  .six-cells-header__cell-bottom-left {
    grid-area: 2 / 1 / 3 / 2;
  }

  .six-cells-header__cell-bottom-center {
    grid-area: 2 / 2 / 3 / 3;
  }

  .six-cells-header__cell-bottom-right {
    grid-area: 2 / 3 / 3 / 4;
  }
}
</style>
```

- [ ] **Step 2: Add a demo slide** to scratch `layouts-demo.md`:

```markdown
---
layout: six-cells-header
---
## Six cells
::top-left::
#### TL
::top-center::
#### TC
::top-right::
#### TR
::bottom-left::
#### BL
::bottom-center::
#### BC
::bottom-right::
#### BR
```

- [ ] **Step 3: Build to verify**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds; visually, the six cells occupy six distinct grid areas (no overlap of TL/TC).

- [ ] **Step 4: Commit**

```bash
git add src/_theme/layouts/six-cells-header.vue
git commit -m "feat(theme): add six-cells-header layout with fixed grid areas"
```

---

## Task 5: screenshot layout + device frame assets

**Files:**
- Create: `src/_theme/public/macbook-air-frame.png` (copied)
- Create: `src/_theme/public/iphone-15-pro-max-frame.png` (copied)
- Create: `src/_theme/layouts/screenshot.vue`
- Verify: scratchpad `layouts-demo.md`

**Interfaces:**
- Produces: layout `screenshot`; props `screenshot` (image path/URL), `layoutClass` `"laptop"` (default) or `"mobile"`; named slots `left`, `right` flank the framed image.

- [ ] **Step 1: Copy the two frame PNGs into the theme's public dir**

Run (from `C:/dev/slides`):
```bash
cp "C:/dev/slidev-theme-csscade/public/macbook-air-frame.png" "src/_theme/public/macbook-air-frame.png"
cp "C:/dev/slidev-theme-csscade/public/iphone-15-pro-max-frame.png" "src/_theme/public/iphone-15-pro-max-frame.png"
```
Expected: both files exist under `src/_theme/public/`.

- [ ] **Step 2: Write the layout file**

`src/_theme/layouts/screenshot.vue`:

```vue
<!--
  Usage:
  ---
  layout: screenshot
  layoutClass: laptop   # or: mobile
  screenshot: /my-screenshot.png
  ---
  ::left::
  Context on the left
  ::right::
  Notes on the right
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
    default: "laptop",
  },
  screenshot: {
    type: String,
    default: "",
  },
})
</script>

<template>
  <div class="slidev-layout screenshot" :class="layoutClass">
    <div class="screenshot__cols">
      <div class="screenshot__col-left" :class="props.class">
        <slot name="left" />
      </div>
      <div class="screenshot__col-center">
        <div class="screenshot__frame">
          <img :src="screenshot" alt="screenshot" />
        </div>
      </div>
      <div class="screenshot__col-right" :class="props.class">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.screenshot {
  @apply w-full h-full flex items-center;

  .screenshot__cols {
    @apply grid gap-10 w-full items-center;
    grid-template-columns: 1fr 2fr 1fr;
  }

  .screenshot__col-left,
  .screenshot__col-right {
    @apply flex flex-col justify-center gap-4;
  }

  .screenshot__col-center {
    @apply flex items-center justify-center relative;
  }

  &.laptop .screenshot__frame {
    > img {
      object-fit: cover;
      max-width: 400px;
    }

    &::after {
      content: "";
      background: url("/macbook-air-frame.png") no-repeat;
      background-size: 100%;
      position: absolute;
      height: calc(100% * 2.3);
      width: calc(100% * 1.2);
      left: -40px;
      top: -20px;
    }
  }

  &.mobile .screenshot__frame {
    > img {
      border-radius: 37px;
      max-height: 475px;
      object-fit: cover;
    }

    &::after {
      content: "";
      background: url("/iphone-15-pro-max-frame.png") no-repeat;
      background-size: 56%;
      position: absolute;
      height: calc(100% * 1.1);
      width: 100%;
      left: 93px;
      top: -5px;
    }
  }
}
</style>
```

- [ ] **Step 3: Add two demo slides** (laptop + mobile) to scratch `layouts-demo.md`. Use an existing image from the repo (`/` resolves to the theme public dir + deck public dir; reuse the mac frame itself as a stand-in image so the build has a valid `src`):

```markdown
---
layout: screenshot
layoutClass: laptop
screenshot: /macbook-air-frame.png
---
::left::
Laptop frame
::right::
Notes

---
layout: screenshot
layoutClass: mobile
screenshot: /iphone-15-pro-max-frame.png
---
::left::
Mobile frame
::right::
Notes
```

- [ ] **Step 4: Build to verify**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds; the framed image renders inside the device chrome for both `laptop` and `mobile`.

- [ ] **Step 5: Commit**

```bash
git add src/_theme/layouts/screenshot.vue src/_theme/public/macbook-air-frame.png src/_theme/public/iphone-15-pro-max-frame.png
git commit -m "feat(theme): add screenshot layout with device frame assets"
```

---

## Task 6: utility layouts (404, error, none)

**Files:**
- Create: `src/_theme/layouts/404.vue`
- Create: `src/_theme/layouts/error.vue`
- Create: `src/_theme/layouts/none.vue`
- Verify: scratchpad `layouts-demo.md`

**Interfaces:**
- Produces: layouts `404`, `error`, `none`. `none` is a bare passthrough of the default slot.

- [ ] **Step 1: Write `404.vue`** (recolored teal → feoche primary):

```vue
<template>
  <div class="px-4 py-10 text-center text-[--primary-color] dark:text-[--color-cream]">
    404
  </div>
</template>
```

- [ ] **Step 2: Write `error.vue`**:

```vue
<template>
  <div class="px-4 py-10 text-center text-red-700 dark:text-red-500 fw-700 font-mono">
    An error occurred on this slide. Check the terminal for more information.
  </div>
</template>
```

- [ ] **Step 3: Write `none.vue`**:

```vue
<template>
  <slot />
</template>
```

- [ ] **Step 4: Add a demo slide** to scratch `layouts-demo.md` (only `none` is author-facing; `404`/`error` are triggered by Slidev internally):

```markdown
---
layout: none
---
No chrome here — bare slot passthrough.
```

- [ ] **Step 5: Build to verify**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/_theme/layouts/404.vue src/_theme/layouts/error.vue src/_theme/layouts/none.vue
git commit -m "feat(theme): add 404, error, and none utility layouts"
```

---

## Task 7: Document new layouts in the theme README

**Files:**
- Modify: `src/_theme/README.md`

- [ ] **Step 1: Read the current README** to match its heading style and section placement.

Run: open `src/_theme/README.md`.

- [ ] **Step 2: Append a "New layouts" section** documenting each added layout with a usage snippet. Add this block (adjust surrounding heading level to match the file):

```markdown
## Layouts

### three-cols

Three columns (`1fr 2fr 1fr`) with an optional spanning bottom row. Add `layoutClass: centered` to vertically/horizontally center each column.

​```md
---
layout: three-cols
---
::left::
Left
::center::
Center
::right::
Right
::bottom::
Spans all columns
​```

### three-cols-header

Full-width header (default slot) above three equal columns.

​```md
---
layout: three-cols-header
---
# Header
::left::
Left
::center::
Center
::right::
Right
​```

### three-rows

Three stacked, vertically centered rows.

​```md
---
layout: three-rows
---
::top::
Top
::center::
Center
::bottom::
Bottom
​```

### six-cells-header

Full-width header above a 2×3 grid of cells.

​```md
---
layout: six-cells-header
---
# Header
::top-left::
TL
::top-center::
TC
::top-right::
TR
::bottom-left::
BL
::bottom-center::
BC
::bottom-right::
BR
​```

### screenshot

A device-framed screenshot flanked by two columns. Set `layoutClass` to `laptop` (default) or `mobile`, and `screenshot` to the image path.

​```md
---
layout: screenshot
layoutClass: laptop
screenshot: /my-shot.png
---
::left::
Context
::right::
Notes
​```

### Utility layouts

- `none` — bare slot passthrough with no chrome.
- `404` / `error` — used internally by Slidev.
```

Note: in the actual README, replace each `​```` (zero-width-joined) fence with a normal ```` ``` ```` fence — the zero-width marks above only prevent this plan's own code block from closing early.

- [ ] **Step 3: Commit**

```bash
git add src/_theme/README.md
git commit -m "docs(theme): document new layouts"
```

---

## Task 8: Final full-build verification and cleanup

**Files:**
- None (verification only)

- [ ] **Step 1: Rebuild the full demo deck one last time**

Run: `pnpm exec slidev build "<scratchpad>/layouts-demo.md" --out "<scratchpad>/demo-dist"`
Expected: build succeeds with all 8 layouts exercised, no errors or warnings about missing layouts/components.

- [ ] **Step 2: Confirm the existing project deck still builds** (no regressions)

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 3: Confirm git status is clean** except intended files

Run: `git status`
Expected: no uncommitted changes under `src/_theme/`; the scratchpad demo deck and `demo-dist` are outside the repo and untracked/ignored.

---

## Self-Review Notes

- **Spec coverage:** three-cols (T1), three-cols-header (T2), three-rows minimal (T3), six-cells-header + bug fix (T4), screenshot + assets (T5), 404/error/none (T6), README docs (T7), verification (T0/T8). All spec scope items covered.
- **Placeholders:** none — every layout ships complete SFC code.
- **Conventions:** every layout uses the `props` signature, `<div class="slidev-layout NAME">` wrapper, BEM names, no csscade components/vars — per Global Constraints.
- **Naming consistency:** class names within each layout match between template and `<style>` (verified per file).
