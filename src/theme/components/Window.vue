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
  // Chrome style: a desktop browser window (default) or a mobile phone frame.
  type?: "desktop" | "mobile";
  // Content kind; auto-detected from src when omitted.
  content?: "iframe" | "image";
  scale?: number;
  objectFit?: string;
  url?: string;
}>();

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;

const device = computed(() => props.type ?? "desktop");

const renderAs = computed<"iframe" | "image">(
  () => props.content ?? (IMAGE_EXT.test(props.src) ? "image" : "iframe"),
);

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`);

// Desktop image windows fill the available height via CSS; the image fills that
// height at its natural aspect ratio. CSS shrink-to-fit can't match the window
// width to the height-scaled image, so only the width is set here (height stays
// 100% in CSS) — the chrome hugs the image with no side bars. Mobile frames
// have a fixed aspect ratio and need none of this.
const root = ref<HTMLElement | null>(null);
const header = ref<HTMLElement | null>(null);
const subheader = ref<HTMLElement | null>(null);
const img = ref<HTMLImageElement | null>(null);

function fitImage() {
  const el = root.value;
  const image = img.value;
  if (
    device.value !== "desktop" ||
    renderAs.value !== "image" ||
    !el ||
    !image ||
    !image.naturalWidth
  )
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
  () => [props.src, props.type, props.content],
  () => nextTick(fitImage),
);
</script>

<template>
  <!-- Mobile phone frame -->
  <div v-if="device === 'mobile'" class="mobile">
    <div class="mobile-frame">
      <div class="mobile-notch"></div>
      <div class="mobile-screen">
        <div class="mobile-bar">
          <span class="mobile-bar-icon">🔒</span>
          <span class="mobile-url">{{
            renderAs === "iframe" ? (url ?? src) : title
          }}</span>
          <span class="mobile-bar-icon">⋯</span>
        </div>
        <div
          class="mobile-content"
          :style="renderAs === 'iframe' ? { width: scaleInvertPercent } : {}"
        >
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
            :src="src"
            class="mobile-img"
            :style="{ objectFit: objectFit || 'cover' }"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Desktop browser window -->
  <div
    v-else
    ref="root"
    class="window"
    :class="{ 'window--image': renderAs === 'image' }"
    :style="renderAs === 'iframe' ? { width: scaleInvertPercent } : {}"
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
        :value="renderAs === 'iframe' ? (url ?? src) : undefined"
      />
    </span>
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

/* Desktop image windows fill the available height and center in their area; the
   image fills that height at its natural aspect ratio. The window width is set
   to the image's displayed width in script (see fitImage) so the chrome hugs
   the image. Default width is 100% for the no-JS / pre-hydration case. */
.window--image {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  margin: auto;

  .window-img {
    display: block;
    flex: 1 1 0;
    min-height: 0;
    width: 100%;
  }
}

/* Mobile phone frame: fixed aspect ratio, sized purely in CSS. */
.mobile {
  @apply flex h-full w-full items-center justify-center;
}

.mobile-frame {
  @apply relative flex flex-col overflow-hidden bg-[--color-deep-green] shadow-2xl;
  aspect-ratio: 10 / 20;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 0.55rem;
  border-radius: 2.25rem;
  border: 2px solid #0003;

  .mobile-notch {
    @apply absolute top-0 left-1/2 z-10 bg-black;
    width: 32%;
    height: 1.1rem;
    transform: translateX(-50%);
    border-bottom-left-radius: 0.7rem;
    border-bottom-right-radius: 0.7rem;
  }

  .mobile-screen {
    @apply relative flex flex-1 flex-col overflow-hidden bg-[--color-cream];
    border-radius: 1.75rem;
    min-height: 0;
  }

  .mobile-bar {
    @apply flex items-center gap-2 bg-gray-200 color-[--color-deep-green];
    padding: 1.4rem 0.9rem 0.4rem;

    .mobile-bar-icon {
      @apply flex-none text-xs opacity-60;
    }

    .mobile-url {
      @apply flex-1 truncate rounded-full bg-[--color-cream] px-3 py-1 text-center text-xs color-[--color-deep-green];
    }
  }

  .mobile-content {
    @apply relative flex-1;
    min-height: 0;

    iframe,
    .mobile-img {
      @apply h-full w-full;
    }
  }
}
</style>
