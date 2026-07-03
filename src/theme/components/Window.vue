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

// Image windows hug the contained image: the window shrinks to the image's
// displayed size (plus chrome) so no background bars show around it. This
// needs the image's aspect ratio, which CSS shrink-to-fit can't use, so the
// box is measured and sized here.
const root = ref<HTMLElement | null>(null);
const header = ref<HTMLElement | null>(null);
const subheader = ref<HTMLElement | null>(null);
const img = ref<HTMLImageElement | null>(null);

function fitImage() {
  const el = root.value;
  const image = img.value;
  if (resolvedType.value !== "image" || !el || !image || !image.naturalWidth)
    return;

  // Fill the available area, then measure it.
  el.style.width = "100%";
  el.style.height = "100%";
  const availW = el.clientWidth;
  const chromeH =
    (header.value?.offsetHeight ?? 0) + (subheader.value?.offsetHeight ?? 0);
  const availH = el.clientHeight - chromeH;
  if (availW <= 0 || availH <= 0) return;

  // Fit the image into the area preserving its aspect ratio, then wrap.
  const ratio = image.naturalWidth / image.naturalHeight;
  let w = availW;
  let h = w / ratio;
  if (h > availH) {
    h = availH;
    w = h * ratio;
  }
  el.style.width = `${Math.round(w)}px`;
  el.style.height = `${Math.round(h + chromeH)}px`;
}

let observer: ResizeObserver | null = null;

onMounted(() => {
  fitImage();
  // Observe the parent (the available area); our own size changes must not
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

/* Image windows hug the contained image (sized in fitImage) and center in
   their available area. The image fills the wrapped content box exactly. */
.window--image {
  display: flex;
  flex-direction: column;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin: auto;

  .window-img {
    display: block;
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }
}
</style>
