<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  nextTick,
} from "vue";

const props = defineProps<{
  src: string;
  title?: string;
  type?: "iframe" | "image";
  scale?: number;
  objectFit?: string;
  url?: string;
}>();

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;

const resolvedType = computed<"iframe" | "image">(
  () => props.type ?? (IMAGE_EXT.test(props.src) ? "image" : "iframe"),
);

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`);

// Image windows fill the available height via CSS; the image fills that height
// at its natural aspect ratio. CSS shrink-to-fit can't match the window width
// to the height-scaled image, so only the width is set here (height stays 100%
// in CSS) — the chrome hugs the image with no side bars.
const root = ref<HTMLElement | null>(null);
const header = ref<HTMLElement | null>(null);
const subheader = ref<HTMLElement | null>(null);
const img = ref<HTMLImageElement | null>(null);

function fitImage() {
  const el = root.value;
  const image = img.value;
  if (resolvedType.value !== "image" || !el || !image || !image.naturalWidth)
    return;

  // Measure the available area, then set the width to the image's displayed
  // width (capped to the area). Height is left to CSS (100%).
  el.style.width = "100%";
  const availW = el.clientWidth;
  const chromeH =
    (header.value?.offsetHeight ?? 0) + (subheader.value?.offsetHeight ?? 0);
  const availH = el.clientHeight - chromeH;
  if (availW <= 0 || availH <= 0) return;

  const ratio = image.naturalWidth / image.naturalHeight;
  el.style.width = `${Math.min(availW, Math.round(availH * ratio))}px`;
}

let observer: ResizeObserver | null = null;

onMounted(() => {
  fitImage();
  // Observe the parent (the available area); our own width change must not
  // feed back into the observer.
  if (typeof ResizeObserver !== "undefined" && root.value?.parentElement) {
    observer = new ResizeObserver(() => fitImage());
    observer.observe(root.value.parentElement);
  }
});

onBeforeUnmount(() => observer?.disconnect());

watch(
  () => [props.src, props.type],
  () => nextTick(fitImage),
);
</script>

<template>
  <div
    ref="root"
    class="window"
    :class="{ 'window--image': resolvedType === 'image' }"
    :style="resolvedType === 'iframe' ? { width: scaleInvertPercent } : {}"
  >
    <span ref="header" class="window-header">
      <span class="window-title">{{ title }}</span>
      <span class="window-controls">
        <span>−</span>
        <span class="text-sm">⧉</span>
        <span>×</span>
      </span>
    </span>
    <span ref="subheader" class="window-subheader">
      <span class="window-subcontrols">
        <span>←</span>
        <span>→</span>
        <span>⟳</span>
      </span>
      <input
        type="search"
        class="window-url"
        :value="resolvedType === 'iframe' ? (url ?? src) : undefined"
      />
    </span>
    <iframe
      v-if="resolvedType === 'iframe'"
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
  </div>
</template>

<style>
.window {
  @apply relative w-full h-full m-4 mb-0 rounded-2 overflow-hidden bg-[--color-green] border-1 border-gray box-sizing-border-box shadow-2xl;

  .window-header {
    @apply flex flex-0 bg-[--color-deep-green] color-[--color-cream] py-1.5 px-2 rounded-t-md place-content-between place-items-center overflow-hidden;
    flex: 0 0 auto;

    .window-title {
      @apply flex font-bold mx-1 color-[--color-cream];
    }

    .window-controls {
      @apply flex gap-1;

      & > span {
        @apply w-5 h-5 inline-flex items-center justify-center rounded-full bg-gray-200 font-sm opacity-50 color-[--color-deep-green];
      }
    }
  }

  .window-subheader {
    @apply flex bg-gray-200 color-gray gap-2 p-1;
    flex: 0 0 auto;

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

/* Image windows fill the available height and center in their area; the image
   fills that height at its natural aspect ratio. The window width is set to the
   image's displayed width in script (see fitImage) so the chrome hugs the
   image. Default width is 100% for the no-JS / pre-hydration case. */
.window--image {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  margin: auto;

  .window-img {
    display: block;
    flex: 1 1 auto;
    height: calc(100% - 2.5rem);
    min-height: 0;
    width: 100%;
  }
}
</style>
